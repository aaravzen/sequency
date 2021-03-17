const sharp_octave = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const flat_octave = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"]

export function toSharp(note) {
    switch(note) {
        case "D♭": return "E#"
        case "E♭": return "D#"
        case "G♭": return "F#"
        case "A♭": return "G#"
        case "B♭": return "A#"
        default: return note
    }
}

function toFlat(note) {
    switch(note) {
        case "E#": return "D♭"
        case "D#": return "E♭"
        case "F#": return "G♭"
        case "G#": return "A♭"
        case "A#": return "B♭"
        default: return note
    }
}

function getQualityOffset(quality) {
    switch (quality.toLowerCase()) {
        case "dorian": return 1
        case "phrygian": return 2
        case "lydian": return 3
        case "mixolydian": return 4
        case "aeolian":
        case "minor": return 5
        case "locrian": return 6
        case "major":
        case "ionian":
        default: return 0
    }
}

function getIndices(quality) {
    const indices = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24]
    const qualityOffset = getQualityOffset(quality)
    const unadjusted = indices.slice(qualityOffset, qualityOffset+8)
    const adjusted = unadjusted.map(x => x - unadjusted[0])
    return adjusted
}

function getChordsInQuality(quality) {
    const chords = ["M", "m", "m", "M", "M", "m", "dim", "M", "m", "m", "M", "M", "m", "dim"]
    const qualityOffset = getQualityOffset(quality)
    const chordsInQuality = chords.slice(qualityOffset, qualityOffset+8)
    return chordsInQuality
}

function buildScale(keyNote, keyQuality, octave) {
    const notes = octave.concat(octave).concat(octave)
    const noteIndices = getIndices(keyQuality).map(note => note + notes.indexOf(keyNote))
    const scale = noteIndices.map(idx => notes[idx])
    return scale
}

export function getScale(keyNote, keyQuality) {
    const flatScale = buildScale(toFlat(keyNote), keyQuality, flat_octave)
    const sharpScale = buildScale(toSharp(keyNote), keyQuality, sharp_octave)
    const voices = Array.from("ABCDEFG")
    if (flatScale.every(n => n !== "") && voices.every(v => flatScale.some(n => n !== "" && n.includes(v)))) {
        return flatScale
    }
    else { // if (sharpScale.every(n => n !== "") && voices.every(v => sharpScale.some(n => n !== "" && n.includes(v)))) {
        return sharpScale
    }
    
}

export function getChordsInKey(keyNote, keyQuality) {
    const ret = [""]
    const scale_notes = getScale(keyNote, keyQuality).slice(0,-1)
    const chord_qualities = getChordsInQuality(keyQuality)
    for (let i = 0; i < scale_notes.length; ++i) {
        const chord = `${scale_notes[i]} ${chord_qualities[i]}`
        ret.push(chord)
    }
    return ret
}

export function getChordModifications(chord) {
    const keyNote = chord.split(" ")[0]
    const modifiedQualities = [
        "M",
        "m",
        "1",
        "5",
        "sus4",
        "sus2",
        "add9",
        "6",
        "6/9",
        "Maj7",
        "8",
        "Maj9",
        "Maj7#11",
        "Maj13",
        "madd9",
        "m6",
        "m♭6",
        "m6/9",
        "m7",
        "m7♭5",
        "m8",
        "m9",
        "m11",
        "m13",
        "7",
        "7sus4",
        "9",
        "9sus4",
        "11",
        "13",
        "13sus4",
        "dim",
        "dim7",
        "aug"
    ]
    return modifiedQualities.map(q => `${keyNote} ${q}`)
}