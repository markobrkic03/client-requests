import { useEffect, useState } from 'react';
import {getClients, getRequests, getSummary} from '../api';
import Filters from './Filters';
import RequestList from './RequestList';
import Summary from './Summary';

export default function App(){
    const [clients, setClients] = useState([]);
    const [filters, setFilters] = useState({client_id: '', status: '', q: ''});
    const [requests, setRequests] = useState([]);
    const [summary, setSummary] = useState({open: 0, in_progress: 0, done: 0});
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

    async function loadSummary(){
        try{
            const data = await getSummary(filters.client_id);
            setSummary(data);
        }catch (e){
            console.error(e);
            setError("Ne ucitava se summary. Proveriti da li server radi kako treba");
        }
    }

    useEffect(() => {
        loadClients();
    }, []);

    useEffect(() =>{
        loadRequests();
    }, [filters]);

    useEffect(() => {
        loadSummary();
    }, [filters.client_id]);

    return (
        <div className="container">
            <h1>Client Requests</h1>

            <Summary summary={summary} />

            <Filters clients={clients} filters={filters} onChange={setFilters} />

            {loading && <p>Ucitavanje...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && <RequestList requests={requests} />}
        </div>
    )



}
