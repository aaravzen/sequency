import React, { useEffect, useState } from "react"
import ChordSelector from "./Sequencer/ChordSelector"
import SynthTrack from "./Sequencer/SynthTrack"
import {getChords} from "../Music/ScaleTools"
import "./Sequencer/Sequencer.css"

function Sequencer(props) {
    const beats = props.measures * parseInt(props.timeSignature.split("/")[0])
    const [chords, changeChords] = useState(Array.from(Array(beats), (_,x) => x === 0 ? "C3" : ""))

    function addChordAtBeat(beat, newChord) {
        const newChords = chords.map((c,idx) => idx === beat ?  newChord : c)
        changeChords(newChords)
    }
    
    useEffect(() => {
        const validChords = getChords(props.keyNote, props.keyQuality)
        const newChords = chords.map((c) => validChords.includes(c) ? c : "")
        if (JSON.stringify(newChords) !== JSON.stringify(chords)){
            changeChords(newChords)
        }
    }, [props.keyNote, props.keyQuality, chords])

    useEffect(() => {
        const b = props.measures * parseInt(props.timeSignature.split("/")[0])
        if (b !== chords.length) {
            let newChords
            if (b < chords.length) {
                newChords = chords.slice(0, b)
            }
            else {
                newChords = Array.from(chords.concat(Array(b - chords.length)))
            }
            changeChords(newChords)
        }
    }, [props.measures, props.timeSignature, chords])
    
    const chordView = chords.map((c,i) => <span className="chordViewBox" key={i}>{c === "" ? "- -" : c}</span>)

    return (
        <div className="Sequencer">
            <ChordSelector
                chords={chords}
                addChordAtBeat={addChordAtBeat}
                keyNote={props.keyNote}
                keyQuality={props.keyQuality}
                timeSignature={props.timeSignature}
                measures={props.measures}
            />
            <p>{chordView}</p>
            <SynthTrack 
                chords={chords}
                tempo={props.tempo}
            />
        </div>
    )
}

export default Sequencer