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

export async function getSummary(clientId){

    const params = new URLSearchParams({ client_id: clientId });
    const result = await fetch(`api/requests/summary?${params}`, { headers });

    if(!result.ok){
        throw new Error("Greska pri ucitavanju summary-ja");
    }

    return result.json();

}

























