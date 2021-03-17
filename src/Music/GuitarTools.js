import { toSharp } from "./ScaleTools"

const octave = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const notes = [
    'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
    'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7'
]

export function getChord(chord, keyNote, octaveShift=24) {
    if (chord === "") {
        return []
    }
    let notesShifted = notes.slice(0)
    if (octaveShift % 12 === 0) {
        notesShifted = notes.slice(octaveShift)
    }

    const [chordNoteUnsharped, chordQuality] = chord.split(" ")
    const chordNote = toSharp(chordNoteUnsharped)
    const startingIndex = octave.indexOf(keyNote)

    const notesStartingOnKey = notesShifted.slice(startingIndex)
    const shiftedOctave = octave.slice(startingIndex).concat(octave.slice(0, startingIndex))

    const chordIndex = shiftedOctave.indexOf(chordNote)
    const root = notesStartingOnKey.slice(chordIndex)
    switch(chordQuality) {
        case "m":
        case "minor":
        case "Minor":
            return [root[0], root[3], root[7]]
        case "1":
            return [root[0]]
        case "5":
            return [root[0], root[7]]
        case "sus4":
            return [root[0], root[5], root[7]]
        case "sus2":
            return [root[0], root[2], root[7]]
        case "add9":
        case "M(add9)":
            return [root[0], root[4], root[7], root[14]]
        case "M6":
        case "6":
            return [root[0], root[4], root[7], root[9]]
        case "6/9":
            return [root[0], root[4], root[7], root[9], root[14]]
        case "Maj7":
        case "maj7":
        case "M7":
            return [root[0], root[4], root[7], root[11]]
        case "8":
        case "add8":
        case "M8":
            return [root[0], root[4], root[7], root[12]]
        case "Maj9":
        case "maj9":
        case "M9":
            return [root[0], root[4], root[7], root[11], root[14]]
        case "Maj7#11":
        case "maj7#11":
        case "M7#11":
            return [root[0], root[4], root[7], root[11], root[18]]
        case "Maj13":
        case "maj13":
        case "M13":
            return [root[0], root[4], root[7], root[11], root[14], root[21]]
        case "madd9":
        case "m(add9)":
            return [root[0], root[3], root[7], root[14]]
        case "m6":
            return [root[0], root[3], root[7], root[9]]
        case "m♭6":
            return [root[0], root[3], root[7], root[8]]
        case "m6/9":
            return [root[0], root[3], root[7], root[9], root[14]]
        case "m7":
            return [root[0], root[3], root[7], root[10]]
        case "m8":
            return [root[0], root[3], root[7], root[12]]
        case "m9":
            return [root[0], root[3], root[7], root[10], root[14]]
        case "m11":
            return [root[0], root[3], root[7], root[10], root[14], root[17]]
        case "m13":
            return [root[0], root[3], root[7], root[10], root[14], root[17], root[21]]
        case "7":
            return [root[0], root[4], root[7], root[10]]
        case "7sus4":
            return [root[0], root[5], root[7], root[10]]
        case "9":
            return [root[0], root[4], root[7], root[10], root[14]]
        case "9sus4":
            return [root[0], root[5], root[7], root[10], root[14]]
        case "11":
            return [root[0], root[7], root[10], root[14], root[17]]
        case "13":
            return [root[0], root[4], root[7], root[10], root[14], root[21]]
        case "13sus4":
            return [root[0], root[5], root[7], root[10], root[14], root[21]]
        case "dim":
        case "diminished":
            return [root[0], root[3], root[6]]
        case "dim7":
            return [root[0], root[3], root[6], root[9]]
        case "m7o5":
        case "m7♭5":
            return [root[0], root[3], root[6], root[10]]
        case "aug":
        case "augmented":
        case "+":
            return [root[0], root[4], root[8]]
        case "M":
        case "Major":
        default:
            return [root[0], root[4], root[7]]
    }
}