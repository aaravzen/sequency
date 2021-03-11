import React from "react"
import {getChords} from "../../Music/ScaleTools"

function ChordSelector(props) {

    function editChordAtIdx(event, idx) {
        props.addChordAtBeat(idx, event.target.value)
    }
    const possibleChords = getChords(props.keyNote, props.keyQuality)
    const possOptions = possibleChords.map((x) => <option value={x} key={x}>{x}</option>)

    const buttons = props.chords.map((chord,idx) => 
    <select 
    className={chord === "" ? "chordSelectButtonUnfilled" : "chordSelectButtonFilled"}
    onChange={(event) => editChordAtIdx(event, idx)}
    value={chord}
    key={idx}>
        {possOptions}
    </select>)
    
    function generateMeasureIndices() {
        const ret = []
        const bpm = parseInt(props.timeSignature.split("/")[0])
        for (let idx = 0; idx < props.chords.length; idx += bpm) {
            const o = {
                start: idx,
                end: idx + bpm
            }
            ret.push(o)
        }
        return ret
    }

    const divided_buttons = generateMeasureIndices().map((o, i) => <div className={"measure" + (i+1)} key={i}>
        {buttons.slice(o.start, o.end)}
    </div>)

    return (
        <div className="ChordSelector">
            {divided_buttons}
        </div>
    )
}

export default ChordSelector