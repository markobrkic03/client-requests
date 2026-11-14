export default function Filters({ clients, filters, onChange }){
    function handleChange(e){
        onChange({ ...filters, [e.target.name]: e.target.value });
    }

    return (
        <div className="filters">
            <label>
                Klijent
                <select name="client_id" value={filters.client_id} onChange={handleChange}>
                    <option value="">Svi klijenti</option>
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                </select>
            </label>

            <label>
                Status
                <select name="status" value={filters.status} onChange={handleChange}>
                    <option value="">Svi statusi</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                </select>
            </label>

            <label>
                Pretraga
                <input
                    type="text"
                    name="q"
                    value={filters.q}
                    onChange={handleChange}
                    placeholder="Naslov" />
            </label>
        </div>
    )
}
