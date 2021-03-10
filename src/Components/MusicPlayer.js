import React from "react"
import * as Tone from 'tone'

function MusicPlayer(props) {
    //create a synth and connect it to the main output (your speakers)
    const synth = new Tone.Synth().toDestination();

    function handleMouseDown(e, note) {
        e.preventDefault(e);
        Tone.start();
        synth.triggerAttack(note,Tone.now());
      }
    
      function handleMouseUp(e) {
        e.preventDefault(e);
        synth.triggerRelease(Tone.now());
      }

    const notes = props.scale
    const buttons = notes.map(note => 
        <button
            onMouseDown={e => handleMouseDown(e, note)} 
            onMouseUp={handleMouseUp}
            key={note}
        > {note} </button>
    )
    
    return (
        <div className="MusicPlayer">
            {buttons}
        </div>
    )
}

export default MusicPlayer