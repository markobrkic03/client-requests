import { useEffect, useState } from 'react';
import { getClients, getRequests } from '../api';
import Filters from './Filters';
import RequestList from './RequestList';

export default function App(){
    const [clients, setClients] = useState([]);
    const [filters, setFilters] = useState({client_id: '', status: '', q: ''});
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function loadClients(){
        try{
            const data = await getClients();
            setClients(data);
        }catch(e){
            setError("Klijenti ne mogu da se ucitaju. Proveriti da li server radi kako treba");
        }
    }

    async function loadRequests(){
        setLoading(true);
        setError(null);

        try{
            const data = await getRequests(filters);
            setRequests(data);
        }catch (e){
            setError("Ne ucitavaju se podaci. Proveriti da li server radi kako treba");
        }finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        loadClients();
    }, []);

    useEffect(() =>{
        loadRequests();
    }, [filters]);

    return (
        <div className="container">
            <h1>Client Requests</h1>

            <Filters clients={clients} filters={filters} onChange={setFilters} />

            {loading && <p>Ucitavanje...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && <RequestList requests={requests} />}
        </div>
    )



}
