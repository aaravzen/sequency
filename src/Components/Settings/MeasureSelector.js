import React from "react"

function TimeSignatureSelector(props) {
    return (
        <div className="MeasureSelector">
            <input 
                type="number"
                defaultValue={120}
                value={props.measures}
                onChange={(event) => props.changeMeasures(event.target.value)}
                min={1}
                max={10}
            />
        </div>
    )
}

export default TimeSignatureSelector