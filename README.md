# Client Requests

Mali interni alat za vođenje zahteva klijenata: Laravel API + React UI u jednom repozitorijumu,
baza je PostgreSQL 16 u Dockeru.

## Potrebno

- PHP 8.4 i Composer (ja sam koristio Laravel Herd na Windowsu)
- Node.js (koristio sam v24) i npm
- Docker Desktop

## Pokretanje

### 1. Postgres (Docker)

```bash
docker compose up -d
```

Podiže Postgres 16 na portu 5432 (baza `client_requests`, korisnik `app`, lozinka `app`).
Provera da kontejner radi:

```bash
docker compose ps
```

Test baza za `php artisan test` pravi se jednom:

```bash
docker compose exec postgres createdb -U app client_requests_test
```

Napomena: compose fajl nema volume, pa `docker compose down` briše podatke.
Posle ponovnog `up` treba opet napraviti test bazu i pokrenuti migracije i seed.

### 2. Laravel

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

`.env.example` je već podešen za Postgres iz Dockera (`DB_CONNECTION=pgsql`, port 5432).
Za ponovno punjenje baze od nule: `php artisan migrate:fresh --seed`.

### 3. API i UI

U dva odvojena terminala:

```bash
php artisan serve
```

```bash
npm install
npm run dev
```

Aplikacija je na http://127.0.0.1:8000, a API na http://127.0.0.1:8000/api/...

### 4. Test

```bash
php artisan test
```

Test koristi posebnu bazu `client_requests_test` (podešeno u `phpunit.xml`), pa ne dira podatke iz seeda.

## Utrošeno vreme

Ukupno otprilike 11 sati aktivnog rada, u delovima tokom tri dana (12–14. novembar):

- Instalacija i Docker (Postgres, docker-compose, baze): ~1,5 h
- Backend: Laravel projekat, migracije, modeli, seed, API, validacija, feature test: ~4,5 h
- Frontend (React): ~4 h
- README: ~1 h


Docker i React nisam koristio ranije, pa sam veliki deo vremena izdvojio za učenje
i razumevanje ta dva, jer mi je ovo bio prvi susret sa njima. Laravel znam, ali sam
prvi put radio sa Postgresom (CHECK ograničenja, ILIKE, test baza na Postgresu).

## Zašto indeks (client_id, status)

Glavni upiti u aplikaciji filtriraju po klijentu, a onda po statusu:

- Lista: `GET /api/requests?client_id=1&status=open` → `WHERE client_id = ? AND status = ?`
- Summary za klijenta: `GET /api/requests/summary?client_id=1` → `WHERE client_id = ? GROUP BY status`

Složeni indeks (client_id, status) pokriva oba slučaja. Pošto je `client_id` prva kolona,
indeks se koristi i kad se filtrira samo po klijentu, a ne samo kad su zadata oba filtera.
Za summary Postgres može da prebroji statuse direktno iz indeksa, bez čitanja cele tabele.

Redosled kolona je bitan. `client_id` je prvi jer se po njemu najčešće filtrira i on najviše
sužava rezultat. `status` ima samo 3 vrednosti, pa indeks koji počinje statusom ne bi mnogo
pomogao, a ne bi pomogao ni upitima samo po klijentu.

Postgres, za razliku od MySQL-a, ne pravi automatski indeks na stranom ključu. Ovaj indeks
zato pokriva i `client_id` kao strani ključ, na primer pri proveri `ON DELETE RESTRICT`
kad se briše klijent.

Napomena: sa 8 zahteva iz seeda Postgres će verovatno ipak pročitati celu tabelu, jer je
to brže za tako malo redova. Indeks ima efekta kad zahteva ima mnogo.

## SQL za summary

`GET /api/requests/summary?client_id=3` — u `ClientRequestController@summary` upit se gradi ovako:

```php
$query = ClientRequest::selectRaw('status, count(*) as total')
    ->when($request->query('client_id'), function ($query, $clientId) {
        $query->where('client_id', $clientId);
    })
    ->groupBy('status');

$counts = $query->pluck('total', 'status');
```

SQL koji Laravel pošalje Postgresu (izvučeno sa `toSql()` i `getBindings()`):

```sql
select status, count(*) as total from "requests" where "client_id" = ? group by "status"
```

bindings: `["3"]`

Bez `client_id` filtera (summary za sve klijente):

```sql
select status, count(*) as total from "requests" group by "status"
```

Postgres vraća red samo za statuse koji postoje (npr. Klijent 3 nema nijedan `in_progress`).
Zato se rezultat u PHP-u dopunjava nulama, pa odgovor uvek ima sva tri broja:

```json
{"open": 1, "in_progress": 0, "done": 1}
```

## Šta nije urađeno

Sve stavke iz zadatka su urađene i provereno je da rade.

Svesno nisam radio ono što je u zadatku navedeno kao van opsega: login i autentifikaciju
(Sanctum je instaliran kroz `php artisan install:api`, ali se ne koristi), paginaciju,
izmenu svih polja, brisanje zahteva i testove frontenda.

Poznata ograničenja:

- API ne proverava redosled statusa. Preko PATCH-a zahtev može da se vrati iz `done` u
  `open` ili `in_progress`, a `resolution` tada ostaje upisan. UI to ne nudi (završen
  zahtev nema dugmad), ali API to ne zabranjuje.
- U pretrazi se znakovi `%` i `_` ne escape-uju, pa se ponašaju kao džokeri u ILIKE
  (npr. `q=%` vraća sve zahteve). Vrednost i dalje ide kao vezani parametar, pa ovo nije
  SQL injection, samo neprecizna pretraga.

## Korišćeni alati

- AI asistent (Claude) kao "mentor". Objašnjavao mi je korake, posebno za Docker, Postgres
  i React, jer sam se sa njima prvi put susreo i nisam znao kako da počnem.
    - Laravel deo (migracije, modeli, seed, kontroleri, FormRequest validacija, test) sam
      pisao sam, uz Laravel dokumentaciju i internet za podsećanje sintakse. AI mi je
      pregledao kod i ukazao na nekoliko grešaka, koje sam ispravio.
    - Za React mi je AI pomogao kod komponenti, uz objašnjenje šta koji deo radi.
      Određene delove koda sam prekucao, a do ostalog sam dolazio sam, na osnovu onoga
      što sam kroz te delove naučio. Kod sam pokretao, testirao i ispravljao greške koje
      su se pojavile, i usput učio kako React radi (state, useEffect, props, kontrolisana polja).
- PhpStorm HTTP Client (`api.http` u korenu projekta) za ručno testiranje API-ja,
  uključujući 422 slučajeve.
- Laravel Herd (PHP i Composer), Docker Desktop, Git i GitHub.

Svaki deo koda sam pokrenuo i proverio da radi, i mogu da objasnim šta radi.
