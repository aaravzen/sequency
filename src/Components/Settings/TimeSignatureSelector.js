import React, {useEffect} from "react"
import * as Tone from 'tone'

function TimeSignatureSelector(props) {
    useEffect(() => {Tone.Transport.timeSignature = props.timeSignature.split("/").map(x => parseInt(x))}, [props.timeSignature])

    return (
        <div className="TimeSignatureSelector">
            <select value={props.timeSignature} onChange={(event) => props.changeTimeSignature(event.target.value)}>
                <option value="4/4">4/4</option>
                <option value="3/4">3/4</option>
                <option value="6/8">6/8</option>
                <option value="8/8">8/8</option>
            </select>
        </div>
    )
}

export default TimeSignatureSelector