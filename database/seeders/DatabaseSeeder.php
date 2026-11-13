<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Klijent 1
        $firma = Client::create([
            'name' => 'Firma d.o.o.',
            'email' => 'firma@firma.com'
        ]);

        $firma->requests()->create([
            'title' => "Novi logo za sajt",
            'description' => 'Klijent zeli logo koji ce bit bolji od proslog.',
            'status' => 'open',
            'priority' => 'high',
            'due_date' => '2026-11-25'
        ]);

        $firma->requests()->create([
            'title' => 'Ispravka kontakt forme na stranici',
            'status' => 'done',
            'priority' => 'medium',
            'resolution' => 'Popravljena validacija email polja i poslat test e-mail',
        ]);

        $firma->requests()->create([
            'title' => 'Prevod stranice O nama',
            'status' => 'in_progress',
            'priority' => 'low',
        ]);

        // Klijent2

        $klijent2 = Client::create([
            'name' => 'Klijent 2',
            'email' => 'ime@klijent2.com'
        ]);

        $klijent2->requests()->createMany([
            [
                'title' => 'Logo u footeru',
                'description' => 'Logo koji se nalazi na dnu stranice je losih dimenzija na telefonu',
                'status' => 'done',
                'priority' => 'low',
                'resolution' => 'Zamenjene su dimenzije da budu relativne i sada je dobrih dimenzija'
            ],
            [
                'title' => 'Online porudzbine ne stizu na mejl',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => '2026-11-18'
            ],
            [
                'title' => 'Dodati novi cenovnik',
                'status' => 'open',
                'priority' => 'medium'
            ]
        ]);

        $klijent3 = Client::create([
            'name' => 'Klijent 3',
            'email' => 'prezime@klijent3.com',
        ]);

        $klijent3->requests()->createMany([
            [
                'title' => 'Ispravka navigacije da prati stranicu kada se skroluje na dole',
                'status' => 'open',
                'priority' => 'low',
            ],
            [
                'title' => 'Sertifikat za HTTPS istekao',
                'status' => 'done',
                'priority' => 'high',
                'due_date' => '2026-11-10',
                'resolution' => 'Obnovljen ssl sertifikat i ukljuceno je automatsko obnavljanje'
            ],
        ]);


    }
}
