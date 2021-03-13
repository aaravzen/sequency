import React, { useEffect, useState, useCallback } from "react"
import ChordSelector from "./Sequencer/ChordSelector"
import ChordModifier from "./Sequencer/ChordModifier"
import MasterControls from "./Sequencer/MasterControls"
import SynthTrack from "./Sequencer/SynthTrack"
import {getChordsInKey} from "../Music/ScaleTools"
import "./Sequencer/Sequencer.css"

function Sequencer(props) {
    const getDefaultChordProgression = useCallback(() => {
        const bpm = parseInt(props.timeSignature.split("/")[0])
        const beats = props.measures * bpm
        return Array.from(Array(beats), (_,x) => {
            const defaultProg = [1, 6, 4, 5, 1, 3, 4, 2, 7, 6]
            const valid = getChordsInKey(props.keyNote, props.keyQuality)
            return x % bpm === 0 ? valid[defaultProg[x / bpm]] : ""
        })
    }, [props.timeSignature, props.measures, props.keyNote, props.keyQuality])

    const [baseChords, changeBaseChords] = useState(getDefaultChordProgression())
    const [modifiedChords, changeModifiedChords] = useState(baseChords)

    function addChordAtBeat(beat, newChord) {
        const newBaseChords = baseChords.map((c,idx) => idx === beat ?  newChord : c)
        changeBaseChords(newBaseChords)
        const newModifiedChords = modifiedChords.map((c,idx) => idx === beat ?  newChord : c)
        changeModifiedChords(newModifiedChords)
    }
    
    function modifyChordAtBeat(beat, newChord) {
        const newChords = modifiedChords.map((c,idx) => idx === beat ?  newChord : c)
        changeModifiedChords(newChords)
    }
    
    useEffect(() => {
        const validChords = getChordsInKey(props.keyNote, props.keyQuality)
        const newChords = baseChords.map((c) => validChords.includes(c) ? c : "")
        if (JSON.stringify(newChords) !== JSON.stringify(baseChords)){
            changeBaseChords(newChords)
        }
    }, [props.keyNote, props.keyQuality, baseChords])

    useEffect(() => {
        const b = props.measures * parseInt(props.timeSignature.split("/")[0])
        if (b !== baseChords.length) {
            let newChords
            if (b < baseChords.length) {
                newChords = baseChords.slice(0, b)
            }
            else {
                newChords = baseChords.concat(getDefaultChordProgression().slice(baseChords.length)).slice(0, b)
            }
            changeBaseChords(newChords)
        }
    }, [props.measures, props.timeSignature, baseChords, getDefaultChordProgression])
    
    const modifiedChordView = modifiedChords.map((c,i) => <span className="chordViewBox" key={i}>{c === "" ? "- -" : c}</span>)

    return (
        <div className="Sequencer">
            <ChordSelector
                chords={baseChords}
                addChordAtBeat={addChordAtBeat}
                keyNote={props.keyNote}
                keyQuality={props.keyQuality}
                timeSignature={props.timeSignature}
                measures={props.measures}
            />
            <br />
            <ChordModifier 
                chords={modifiedChords}
                addChordAtBeat={modifyChordAtBeat}
            />
            <p>{modifiedChordView}</p>
            { /*<SynthTrack 
                chords={chords}
                tempo={props.tempo}
            />*/ }
            <MasterControls />
        </div>
    )
}

export default Sequencer