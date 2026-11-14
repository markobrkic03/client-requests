import {useState} from "react";
import { createRequest } from "../api";

const emptyForm = {
    client_id: '',
    title: '',
    description: '',
    priority: '',
    due_date: '',
};

function FieldError({ messages }){
    if(!messages){
        return null;
    }

    return <p className="field-error">{messages[0]}</p>
}

export default function RequestForm({ clients, onCreated }){

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    function handleChange(e){
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e){
        e.preventDefault();
        setSaving(true);
        setErrors({});
        setError(null);

        try{
            const result = await createRequest(form);

            if(result.ok){
                setForm(emptyForm);
                onCreated();
            }else{
                setErrors(result.errors);
            }
        } catch (e){
            console.error(e);
            setError("Zahtev nije sacuvan. Proveriti da li radi server");
        }finally {
            setSaving(false);
        }

    }

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2>Novi zahtev</h2>

            <div className="form-row">
                <label>
                    Klijent
                    <select name="client_id" value={form.client_id} onChange={handleChange}>
                        <option value="">Izaberi klijenta</option>
                        {clients.map((client) => (
                            <option value={client.id} key={client.id}>{client.name}</option>
                        ))}
                    </select>
                    <FieldError messages={errors.client_id} />
                </label>

                <label>
                    Naslov
                    <input type="text" name="title" value={form.title} onChange={handleChange}/>
                    <FieldError messages={errors.title} />
                </label>

                <label>
                    Prioritet
                    <select name="priority" value={form.priority} onChange={handleChange}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <FieldError messages={errors.priority} />
                </label>

                <label>
                    Rok
                    <input type="date" name="due_date" value={form.due_date} onChange={handleChange}/>
                    <FieldError messages={errors.due_date} />
                </label>

            </div>

            <label>
                Opis
                <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
                <FieldError messages={errors.description} />
            </label>

            { error && <p className="error">{error}</p> }

            <button type="submit" disabled={saving}>
                {saving ? "Cuvanje" : "Dodaj zahtev"}
            </button>
        </form>
    );

}










