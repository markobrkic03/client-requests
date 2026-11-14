export default function RequestItem({ request }){
    return(
        <tr>
            <td>{request.title}</td>
            <td>{request.client.name}</td>
            <td>{request.status}</td>
            <td>{request.priority}</td>
            <td>{request.due_date ?? '-'}</td>
        </tr>
    );
}
