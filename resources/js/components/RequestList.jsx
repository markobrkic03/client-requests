import RequestItem from './RequestItem';

export default function RequestList({ requests, onUpdated }){

    if(requests.length === 0){
        return <p>Nema zahteva.</p>
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Naslov</th>
                    <th>Klijent</th>
                    <th>Status</th>
                    <th>Prioritet</th>
                    <th>Rok</th>
                    <th>Akcije</th>
                </tr>
            </thead>
            <tbody>
                {requests.map((request) => (
                    <RequestItem key={request.id} request={request} onUpdated={onUpdated}/>
                ))}
            </tbody>
        </table>
    )

}
