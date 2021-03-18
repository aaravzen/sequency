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
                onChange={(event) => props.modifyChordAtBeat(i, event.target.value)}
                value={c}
                key={i}>
                    {possOptions}
                </select>
            )
        }
    })

    const dividedChordView = props.measureIndices.map((o, i) => <div className={"modifierMeasure" + (i+1)} key={i}>
        {chordView.slice(o.start, o.end)}
    </div>)

    return (
        <div className="ChordModifier">
            {dividedChordView}
        </div>
    )
}

export default ChordModifier