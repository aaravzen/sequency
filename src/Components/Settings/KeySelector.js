import React from "react"

function KeySelector(props) {

    return (
        <div className="KeySelector">
            <select value={props.keyNote} onChange={(event) => props.changeKeyNote(event.target.value)}>
                <option value="A♭">A♭</option>
                <option value="A">A</option>
                <option value="A#">A#</option>
                <option value="B♭">B♭</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="C#">C#</option>
                <option value="D♭">D♭</option>
                <option value="D">D</option>
                <option value="D#">D#</option>
                <option value="E♭">E♭</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="F#">F#</option>
                <option value="G♭">G♭</option>
                <option value="G">G</option>
                <option value="G#">G#</option>
            </select>
        </div>
    )
}

export default KeySelector