import React, { useState, useCallback, useEffect, useRef } from "react"
import * as Tone from 'tone'
import WebMidi from "webmidi"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
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
        const defaultStrummingPattern = getDefaultStrummingPattern()
        console.log(fullChords)
        const newStrumArray = fullChords.map((s,i) => {
            if (i < strumArray.length && strumArray[i] !== "") {
                return fullChords[i]
            }
            else if (i < strumArray.length) { // blanks
                return ""
            }
            else {
                const offset = i - strumArray.length
                const moddedOffset = offset % defaultStrummingPattern.length
                if (defaultStrummingPattern[moddedOffset]) {
                    return s
                }
                else {
                    return ""
                }
            }
        })
        changeStrumArray(newStrumArray)
    }, [props.chords])

    // SYNTH AND MIDI

    const [synthLoaded, setSynthLoaded] = useState(false)
    const [webmidiLoaded, setWebMidiLoaded] = useState(false)
    const synth = useRef(null)
    const webmidiOutput = useRef(null)
    const [volume, setVolume] = useState(1)


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
            }
          });
    }, [])

    const seq = useRef(null)

    useEffect(() => {
        if (seq.current !== null) {
            // seq.current.clear()
            seq.current.cancel()
            console.log("yo")
            seq.current.callback = (time, chord) => {
                if (synthLoaded && chord !== "") {
                    // console.log(`trying to play tone chord ${getChord(chord, props.keyNote)}`)
                    synth.current.triggerAttackRelease(getChord(chord, props.keyNote), "16n", time)
                }
                if (webmidiLoaded && chord !== "") {
                    // console.log(`trying to play midi chord ${getChord(chord, props.keyNote)} at velocity ${volume}`)
                    webmidiOutput.current.playNote(getChord(chord, props.keyNote), 1, {duration: 250, velocity: volume})
                }
                // console.log(`chord ${chord}, time ${time}`)
            }
            seq.current.events = strumArray
        }
        // Tone.Transport.clear()
        else {
            seq.current = new Tone.Sequence((time, chord) => {
                if (synthLoaded && chord !== "") {
                    // console.log(`trying to play tone chord ${getChord(chord, props.keyNote)}`)
                    synth.current.triggerAttackRelease(getChord(chord, props.keyNote), "16n", time)
                }
                if (webmidiLoaded && chord !== "") {
                    // console.log(`trying to play midi chord ${getChord(chord, props.keyNote)} at velocity ${volume}`)
                    webmidiOutput.current.playNote(getChord(chord, props.keyNote), 1, {duration: 250, velocity: volume})
                }
                // console.log(`chord ${chord}, time ${time}`)
            }, strumArray, "8n")
            seq.current.debug = true
            seq.current.start(0)
        }
    }, [synthLoaded, webmidiLoaded, props.keyNote, strumArray, volume])

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
            <p>Volume: {volume}</p>
            <div className="GuitarVolume">
                <Slider 
                    value={volume}
                    min={0}
                    max={1}
                    step={.05}
                    onChange={(event) => setVolume(event)}
                />
            </div>
            { /*<button onClick={() => {seq.current.cancel()}}>
                Stop sequence
            </button>*/ }
        </div>
    )
}

export default GuitarTrack