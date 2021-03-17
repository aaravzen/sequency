import React, { useState, useCallback, useEffect, useRef } from "react"
import * as Tone from 'tone'
import WebMidi from "webmidi"
import { getChord } from "../../Music/GuitarTools"

function GuitarTrack(props) {
    
    // TRACK LOGIC

    const getDefaultStrummingPattern = useCallback(() => {
        console.log("get default strumming pattern - guitar track")
        const bpm = parseInt(props.timeSignature.split("/")[0])
        switch(bpm) {
            case 3: return [1, 0, 1, 0, 1, 1]
            case 6: return [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1]
            case 8: return [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0]
            case 4:
            default: return [1, 0, 1, 0, 0, 1, 1, 1]
        }
    }, [props.timeSignature])

    const [strummingPattern, changeStrummingPattern] = useState(() => getDefaultStrummingPattern())
    useEffect(() => {
        console.log("from useEffect")
        changeStrummingPattern(() => getDefaultStrummingPattern())
    }, [getDefaultStrummingPattern])

    const getDefaultStrums = useCallback(() => {
        const strums = []
        let lastChord = ""
        let pattern_idx = 0
        for (let i = 0; i < props.chords.length; ++i) {
            if (props.chords[i] !== "") {
                lastChord = props.chords[i]
                pattern_idx = 0
            }

            if (lastChord !== "") {
                strums.push(strummingPattern[pattern_idx++] ? lastChord : "")
                pattern_idx %= strummingPattern.length
                strums.push(strummingPattern[pattern_idx++] ? lastChord : "")
                pattern_idx %= strummingPattern.length
            }
            else {
                strums.push("")
                strums.push("")
            }
        }
        return strums
    }, [props.chords, strummingPattern])

    const getFullChords = useCallback(() => {
        const chords = []
        let lastChord = ""
        for (let i = 0; i < props.chords.length; ++i) {
            if (props.chords[i] !== "") {
                lastChord = props.chords[i]
            }
            chords.push(lastChord)
            chords.push(lastChord)
        }
        return chords
    }, [props.chords])

    const [strumArray, changeStrumArray] = useState(getDefaultStrums())

    function changeStrumArrayAtIndex(index) {
        const newStrums = strumArray.map((s,i) => {
            if (i === index) {
                if (s === "") {
                    return getFullChords()[i]
                }
                else {return ""}
            }
            return s
        })
        changeStrumArray(newStrums)
    }

    useEffect(() => {
        const fullChords = getFullChords()
        const newStrumArray = strumArray.map((s,i) => {
            if (s !== "") {
                return fullChords[i]
            }
            return s
        })
        changeStrumArray(newStrumArray.slice(0, fullChords.length))
    }, [props.chords])

    // SYNTH AND MIDI

    const [synthLoaded, setSynthLoaded] = useState(false)
    const [webmidiLoaded, setWebMidiLoaded] = useState(false)
    const synth = useRef(null)
    const webmidiOutput = useRef(null)


    useEffect(() => {
        synth.current = new Tone.PolySynth(Tone.Synth, {
            onload: () => {
                setSynthLoaded(false); //TODO CHANGE
            }
          }).toDestination()

          WebMidi.enable(function(err) {
            if (err) console.log("An error occurred", err);
            else {
                console.log(WebMidi.inputs)
                console.log(WebMidi.outputs)
                setWebMidiLoaded(true)
                webmidiOutput.current = WebMidi.outputs.find(output => output.name.includes("IAC"))
                console.log(webmidiOutput.current)
                webmidiOutput.current.playNote(["C3", "E3", "G3"], 1, {duration: 3000})
                // webmidiOutput.current.playNote("C3")
            }
          });
    }, [])

    const seq = useRef(null)

    useEffect(() => {
        if (seq.current !== null) {
            seq.current.cancel()
            seq.current.clear()
        }
        Tone.Transport.clear()
        seq.current = new Tone.Sequence((time, chord) => {
            if (synthLoaded && chord !== "") {
                synth.current.triggerAttackRelease(getChord(chord, props.keyNote), "8n", time)
            }
            if (webmidiLoaded && chord !== "") {
                console.log(`trying to play midi chord ${getChord(chord, props.keyNote)}`)
                webmidiOutput.current.playNote(getChord(chord, props.keyNote), 1, {duration: 250})
            }
            console.log(`chord ${chord}, time ${time}`)
        }, strumArray, "8n").start(0)
    }, [synthLoaded, webmidiLoaded, props.keyNote, strumArray])

    // VIEW

    const strumView = strumArray.map((c,i) => {
        return (
        <button
        className={c === "" ? "strumUnselected" : "strumSelected"}
        onClick={() => changeStrumArrayAtIndex(i)}
        key={i}>
            {c === "" ? "-----" : `${c} ${(i%2===0?"(D)":"(U)")} `}
        </button>
    )})
    
    const dividedStrumView = props.measureIndices.map((o, i) => {
        return (<div className={"guitarMeasure" + (i+1)} key={i}>
            {strumView.slice(o.start * 2, o.end * 2)}
        </div>)
    })

    return (
        <div className="GuitarTrack">
            {dividedStrumView}
            <br />
            { /*<button onClick={() => {seq.current.cancel()}}>
                Stop sequence
            </button>*/ }
        </div>
    )
}

export default GuitarTrack