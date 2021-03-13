import React from "react"
import {getChordModifications} from "../../Music/ScaleTools"

function ChordModifier(props) {

    const chordView = props.chords.map((c,i) => {
        if (c === "") {
            return (
                <span className="chordViewBox" key={i}>
                    {"- - "}
                </span>
            )
        }
        else {
            const possOptions = getChordModifications(c).map((x, idx) => <option value={x} key={x + idx}>{x}</option>)
            return (
                <select 
                className={c === "" ? "chordSelectButtonUnfilled" : "chordSelectButtonFilled"}
                onChange={(event) => props.addChordAtBeat(i, event.target.value)}
                value={c}
                key={i}>
                    {possOptions}
                </select>
            )
        }
    })

    return (
        <div className="ChordModifier">
            {chordView}
        </div>
    )
}

export default ChordModifier