const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export async function getRequests(filters = {}){
    const params = new URLSearchParams(filters);
    const res = await fetch(`/api/requests?${params}`, { headers });

    if(!res.ok){
        throw new Error("Greska pri ucitavanju zahteva");
    }

    return res.json();

}

export async function getClients(){

    const res = await fetch('/api/clients', { headers });

    if(!res.ok){
        throw new Error("Greska pri ucitavanju klijenata");
    }

    return res.json();

}
