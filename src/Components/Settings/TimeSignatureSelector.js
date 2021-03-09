import React from "react"

function TimeSignatureSelector(props) {
    return (
        <div className="TimeSignatureSelector">
            <select value={props.timeSignature} onChange={(event) => props.changeTimeSignature(event.target.value)}>
                <option value="4/4">4/4</option>
                <option value="3/4">3/4</option>
                <option value="6/8">6/8</option>
            </select>
        </div>
    )
}

export default TimeSignatureSelector