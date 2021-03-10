const notes = ["C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
"C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
"C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5"]

function getStart(note) {
    switch(note) {
        case "C#":
        case "D♭":
            return "C#3"
        case "D": return "D3"
        case "D#":
        case "E♭":
            return "D#3"
        case "E": return "E3"
        case "F": return "F3"
        case "F#":
        case "G♭":
            return "F#3"
        case "G": return "G3"
        case "G#":
        case "A♭":
            return "G#3"
        case "A": return "A3"
        case "A#":
        case "B♭":
            return "A#3"
        case "B": return "B3"
        case "C": 
        default:
            return "C3"
    }
}

function getIndices(quality) {
    switch (quality) {
        case "Dorian": return [0, 2, 3, 5, 7, 9, 10, 12]
        case "Phrygian": return [0, 1, 3, 5, 7, 8, 10, 12]
        case "Lydian": return [0, 2, 4, 6, 7, 9, 11, 12]
        case "Mixolydian": return [0, 2, 4, 5, 7, 9, 10, 12]
        case "Aeolian": return [0, 2, 3, 5, 7, 8, 10, 12]
        case "Minor": return [0, 2, 3, 5, 7, 8, 10, 12]
        case "Locrian": return [0, 1, 3, 5, 6, 8, 10, 12]
        default: return [0, 2, 4, 5, 7, 9, 11, 12] // Major / Ionian
    }
}

export function getScale(keyNote, keyQuality) {
    const startingIndex = getStart(keyNote)
    const noteIndices = getIndices(keyQuality).map(note => note + notes.indexOf(startingIndex))
    const scale = noteIndices.map(idx => notes[idx])
    return scale
}

export function getChords(keyNote, keyQuality) {
    const ret = [""]
    const scale = getScale(keyNote, keyQuality)
    for (const note in scale) {
        ret.push(scale[note])
    }
    return ret
}