import { useState } from "react";
import { updateRequestStatus } from "../api";

export default function RequestItem({ request, onUpdated }){

    const [showDone, setShowDone] = useState(false);
    const [resolution, setResolution] = useState('');
    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    async function changeStatus(data){
        setSaving(true);
        setErrors({});
        setError(null);

        try{
            const result = await updateRequestStatus(request.id, data);

            if(result.ok){
                setShowDone(false);
                setResolution('');
                onUpdated();
            }else{
                setErrors(result.errors);
            }
        }
        catch (e){
            console.error(e);
            setError("Promena nije sacuvana. PRoveri da li server radi.");
        }finally {
            setSaving(false);
        }
    }

    function cancelDone(){
        setShowDone(false);
        setResolution('');
        setErrors({});
    }

    return (
        <tr>
            <td>
                {request.title}
                {request.resolution && <div className="muted">{request.resolution}</div>}
            </td>
            <td>{request.client.name}</td>
            <td>{request.status}</td>
            <td>{request.priority}</td>
            <td>{request.due_date ?? '-'}</td>
            <td className="actions">

                {request.status === 'open' && (
                    <button disabled={saving} onClick={() => changeStatus({status: 'in_progress'})}>In progress</button>
                )}

                {request.status !== 'done' && !showDone && (
                    <button disabled={saving} onClick={() => setShowDone(true)}>Done</button>
                )}

                {showDone && (
                    <div>
                        <textarea rows="2" placeholder="Resolution, min 10 karaktera" value={resolution} onChange={(e) => setResolution(e.target.value)} />
                        {errors.resolution && <p className="field-error">{errors.resolution[0]}</p>}
                        <button disabled={saving} onClick={() => changeStatus({ status: 'done', resolution })}>Potvrdi</button>
                        <button disabled={saving} onClick={cancelDone}>Otkazi</button>
                    </div>
                )}

                {error && <p className="error">{error}</p>}
            </td>
        </tr>
    );



}






















