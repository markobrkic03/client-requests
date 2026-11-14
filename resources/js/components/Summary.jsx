export default function Summary({ summary }){
    return(
        <div className="summary">
            <div>
                <strong>{summary.open}</strong>
                Open
            </div>
            <div>
                <strong>{summary.in_progress}</strong>
                In progress
            </div>
            <div>
                <strong>{summary.done}</strong>
                Done
            </div>
        </div>
    )
}
