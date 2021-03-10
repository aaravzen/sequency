import React, { useState, useCallback, useEffect } from "react"
import * as Tone from 'tone'

function SynthTrack(props) {

    const [sequence, changeSequence] = useState(null)
    const synth = new Tone.Synth().toDestination();

    const getFilledChords = useCallback(() => {
        const newChords = []
        let lastChord = props.chords[0]
        for (let i = 0; i < props.chords.length; ++i) {
            if (props.chords[i] !== "") {
                newChords.push(props.chords[i])
                lastChord = props.chords[i]
            }
            else {
                newChords.push(lastChord)
            }
        }
        return newChords
    }, [props.chords])

    const updateSequence = useCallback(() => {
        console.log("updating????")
        const filledChords = getFilledChords()
        if (sequence !== null) {
            if (sequence !== new Tone.Sequence((time, note) => {
                synth.triggerAttackRelease(note, 0.1, time);
            }, filledChords).start()) {
                sequence.clear()
                changeSequence(new Tone.Sequence((time, note) => {
                    synth.triggerAttackRelease(note, 0.1, time);
                }, filledChords).start(Tone.now()))
            }
        }
        else {
            changeSequence(new Tone.Sequence((time, note) => {
                synth.triggerAttackRelease(note, 0.1, time);
            }, filledChords).start(Tone.now()))
        }
    }, [getFilledChords, sequence, synth])

    function playTrack() {
        Tone.start()
        if (Tone.Transport.state !== "started") {
            Tone.Transport.start();
        }
    }

    function stopTrack() {
        if (Tone.Transport.state !== "stopped") {
            Tone.Transport.cancel();
            Tone.Transport.stop();
        }
    }

    useEffect(() => {Tone.Transport.bpm.value = props.tempo}, [props.tempo])

    return (
        <div className="SynthTrack">
            <button onClick={() => {
                updateSequence()
                playTrack()
            }}>
                Play
            </button>
            <button onClick={() => updateSequence()}>
                Update
            </button>
            <button onClick={stopTrack}>
                Stop
            </button>
        </div>
    )
}

export default SynthTrack