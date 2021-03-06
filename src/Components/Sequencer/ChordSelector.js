import React from "react"
import {getChordsInKey} from "../../Music/ScaleTools"

function ChordSelector(props) {

    const possibleChords = getChordsInKey(props.keyNote, props.keyQuality)
    const possOptions = possibleChords.map((x, idx) => <option value={idx} key={x + idx}>{idx === 0 ? "" : idx}</option>)

    const selects = props.chords.map((chord,idx) => 
    <select 
    className={chord === "" || chord === 0 ? "chordSelectButtonUnfilled" : "chordSelectButtonFilled"}
    onChange={(event) => props.addChordAtBeat(idx, event.target.value)}
    value={chord}
    key={idx}>
        {possOptions}
    </select>)
    
    const divided_selects = props.measureIndices.map((o, i) => <div className={"selectorMeasure" + (i+1)} key={i}>
        {selects.slice(o.start, o.end)}
    </div>)

    return (
        <div className="ChordSelector">
            {divided_selects}
        </div>
    )
}

export default ChordSelector