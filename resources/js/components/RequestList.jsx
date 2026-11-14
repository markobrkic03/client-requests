import RequestItem from './RequestItem';

export default function RequestList({ requests }){

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
                </tr>
            </thead>
            <tbody>
                {requests.map((request) => (
                    <RequestItem key={request.id} request={request} />
                ))}
            </tbody>
        </table>
    )

}
