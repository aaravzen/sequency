import React, {useRef} from "react"
import * as Tone from 'tone'
import {useKeyPress} from "../Tools/keyboard"

function ScaleTester(props) {
    //create a synth and connect it to the main output (your speakers)
    const synth = new Tone.PolySynth().toDestination();
    const notes = props.scale
    const held = useRef(Array(notes.length).fill(false))
    
    function handleMouseDown(e, note) {
        e.preventDefault(e);
        Tone.start();
        synth.triggerAttack(note);
        held.current[notes.indexOf(note)] = true
        console.log(held.current)
    }
    
    function handleMouseUp(e, note) {
        e.preventDefault(e);
        synth.triggerRelease(note);
        held.current[notes.indexOf(note)] = false
        console.log(held.current)
    }

    const pressed = [];
    pressed.push(useKeyPress("a", () => synth.triggerAttack(notes[0]), () => synth.triggerRelease(notes[0])))
    pressed.push(useKeyPress("s", () => synth.triggerAttack(notes[1]), () => synth.triggerRelease(notes[1])))
    pressed.push(useKeyPress("d", () => synth.triggerAttack(notes[2]), () => synth.triggerRelease(notes[2])))
    pressed.push(useKeyPress("f", () => synth.triggerAttack(notes[3]), () => synth.triggerRelease(notes[3])))
    pressed.push(useKeyPress("g", () => synth.triggerAttack(notes[4]), () => synth.triggerRelease(notes[4])))
    pressed.push(useKeyPress("h", () => synth.triggerAttack(notes[5]), () => synth.triggerRelease(notes[5])))
    pressed.push(useKeyPress("j", () => synth.triggerAttack(notes[6]), () => synth.triggerRelease(notes[6])))
    pressed.push(useKeyPress("k", () => synth.triggerAttack(notes[7]), () => synth.triggerRelease(notes[7])))
    // const pressed = keys.map((key) => useKeyPress(key))
    
    const buttons = notes.map((note, idx) => 
        <button
            onMouseDown={e => handleMouseDown(e, note)} 
            onMouseUp={e => handleMouseUp(e, note)}
            key={note}
            className={(pressed[idx] || held.current[idx]) ? "ScaleTesterButtonDown" : "ScaleTesterButtonUp"}
        > {note} </button>
    )
    
    return (
        <div className="MusicPlayer">
            {buttons}
        </div>
    )
}

export default ScaleTester