import React from "react"

function QualitySelector(props) {
    return (
        <div className="QualitySelector">
            <select value={props.keyQuality} onChange={(event) => props.changeKeyQuality(event.target.value)}>
                <option value="Major">Major (Ionian)</option>
                <option value="Dorian">Dorian</option>
                <option value="Phrygian">Phrygian</option>
                <option value="Lydian">Lydian</option>
                <option value="Mixolydian">Mixolydian</option>
                <option value="Minor">Minor (Aeolian)</option>
                <option value="Locrian">Locrian</option>
            </select>
        </div>
    )
}

export default QualitySelector