import React, { useEffect, useState, useCallback } from "react"
import ChordSelector from "./Sequencer/ChordSelector"
import ChordModifier from "./Sequencer/ChordModifier"
import MasterControls from "./Sequencer/MasterControls"
// import SynthTrack from "./Sequencer/SynthTrack"
import GuitarTrack from "./Sequencer/GuitarTrack"
import {getChordsInKey} from "../Music/ScaleTools"
import "./Sequencer/Sequencer.css"

function Sequencer(props) {

    const views = {
        chord_selector: "chord_selector_view",
        chord_modifier: "chord_modifier_view",
        tracks: "track_view",
        all: "uncompressed_view"
    }

    const [view, changeView] = useState(views.chord_selector)

    const generateMeasureIndices = useCallback(() => {
        const ret = []
        const bpm = parseInt(props.timeSignature.split("/")[0])
        for (let idx = 0; idx < props.measures * bpm; idx += bpm) {
            const o = {
                start: idx,
                end: idx + bpm
            }
            ret.push(o)
        }
        return ret
    }, [props.timeSignature, props.measures])

    const getDefaultChordProgression = useCallback(() => {
        const bpm = parseInt(props.timeSignature.split("/")[0])
        const beats = props.measures * bpm
        return Array.from(Array(beats), (_,x) => {
            const defaultProg = [1, 6, 4, 5, 1, 3, 4, 2, 7, 6]
            // const valid = getChordsInKey(props.keyNote, props.keyQuality)
            return x % bpm === 0 ? defaultProg[x / bpm] : ""
        })
    }, [props.timeSignature, props.measures, props.keyNote, props.keyQuality])

    const [baseChords, changeBaseChords] = useState(getDefaultChordProgression())
    const [modifiedChords, changeModifiedChords] = useState(baseChords.map(idx => {
        const chordIndex = idx === "" ? 0 : parseInt(idx)
        return getChordsInKey(props.keyNote, props.keyQuality)[chordIndex]
    }))
    const [measureIndices, changeMeasureIndices] = useState(generateMeasureIndices())

    function addChordAtBeat(beat, newChord) {
        const newBaseChords = baseChords.map((c,idx) => idx === beat ? newChord : c)
        changeBaseChords(newBaseChords)
        const chordIndex = newChord === "" ? 0 : parseInt(newChord)
        const newChordInKey = getChordsInKey(props.keyNote, props.keyQuality)[chordIndex]
        const newModifiedChords = modifiedChords.map((c,idx) => idx === beat ? newChordInKey : c)
        changeModifiedChords(newModifiedChords)
    }
    
    function modifyChordAtBeat(beat, newChord) {
        const newChords = modifiedChords.map((c,idx) => idx === beat ? newChord : c)
        changeModifiedChords(newChords)
    }
    
    useEffect(() => {
        // const validChords = getChordsInKey(props.keyNote, props.keyQuality)
        // const newChords = baseChords.map((c) => validChords.includes(c) ? c : "")
        // if (JSON.stringify(newChords) !== JSON.stringify(baseChords)){
            // changeBaseChords(newChords)
        // }
        const newModifiedChords = modifiedChords.map((c,idx) => {
            const b = baseChords[idx]
            const chordIndex = b === "" ? 0 : parseInt(b)
            const chordInKey = getChordsInKey(props.keyNote, props.keyQuality)[chordIndex]
            if (c.split(" ")[0] === chordInKey.split(" ")[0]) {
                if (c.split(" ")[1] !== "M" && c.split(" ")[1] !== "m" && c.split(" ")[1] !== "dim") {
                    return c
                }
            }
            return chordInKey
        })
        changeModifiedChords(newModifiedChords)
    }, [props.keyNote, props.keyQuality, baseChords])

    useEffect(() => {
        const b = props.measures * parseInt(props.timeSignature.split("/")[0])
        if (b !== baseChords.length) {
            let newChords
            let newModifiedChords
            if (b < baseChords.length) {
                newChords = baseChords.slice(0, b)
                newModifiedChords = modifiedChords.slice(0, b)
            }
            else {
                newChords = baseChords.concat(getDefaultChordProgression().slice(baseChords.length)).slice(0, b)
                const newChordsFromStart = newChords.slice(modifiedChords.length)
                newModifiedChords = modifiedChords.concat(newChordsFromStart.map((c) => {
                    const chordIndex = c === "" ? 0 : parseInt(c)
                    const chordInKey = getChordsInKey(props.keyNote, props.keyQuality)[chordIndex]
                    return chordInKey
                })).slice(0, b)
            }
            changeBaseChords(newChords)
            changeModifiedChords(newModifiedChords)
        }
    }, [props.measures, props.timeSignature, baseChords, modifiedChords, getDefaultChordProgression])

    useEffect(() => changeMeasureIndices(generateMeasureIndices()), [generateMeasureIndices])
    
    const modifiedChordView = modifiedChords.map((c,i) => <span className="chordViewBox" key={i}>{c === "" ? "- -" : c}</span>)

    const dividedChordView = measureIndices.map((o, i) => {
        return (<div className={"chordViewMeasure" + (i+1)} key={i}>
            {modifiedChordView.slice(o.start, o.end)}
        </div>)
    })

    let prevView = null
    let nextView = null
    switch (view) {
        case (views.chord_selector):
            nextView = views.chord_modifier
            break
        case (views.chord_modifier):
            prevView = views.chord_selector
            nextView = views.tracks
            break
        case (views.tracks):
            prevView = views.chord_modifier
            break
    }
    console.log(`${prevView} ${nextView}`)

    return (
        <div className="Sequencer">
            {view === views.chord_selector || view === views.all ? 
            <ChordSelector
                chords={baseChords}
                addChordAtBeat={addChordAtBeat}
                keyNote={props.keyNote}
                keyQuality={props.keyQuality}
                timeSignature={props.timeSignature}
                measures={props.measures}
                measureIndices={measureIndices}
            /> :
            <p />}
            <br />
            {view === views.chord_modifier || view === views.all ? 
            <ChordModifier 
                chords={modifiedChords}
                modifyChordAtBeat={modifyChordAtBeat}
                measureIndices={measureIndices}
            /> : 
            <p />
            }
            { prevView === null ?
                <button disabled>prev</button> :
                <button onClick={() => {
                changeView(prevView)
                }}>prev</button>
            }
            <p>{dividedChordView}</p>
            { nextView === null ?
                <button disabled>next</button> :
                <button onClick={() => {
                changeView(nextView)
                }}>next</button>
            }
            { /*<SynthTrack chords={modifiedChords} />*/ }
            {view === views.tracks || view === views.all ? 
            <GuitarTrack 
                chords={modifiedChords}
                timeSignature={props.timeSignature} 
                measureIndices={measureIndices}
                keyNote={props.keyNote}
            /> :
            <p />
            }
            <MasterControls />
        </div>
    )
}

export default Sequencer