import React, { useRef, useCallback, useEffect } from "react"
import * as Tone from 'tone'

function SynthTrack(props) {

    // let [sequence, changeSequence] = useState(null)
    const filledChords = useRef(null)
    const synth = new Tone.Synth().toDestination()
    // const synth = useMemo(() => new Tone.Synth().toDestination(), []);
    synth.debug = true

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
        filledChords.current = getFilledChords()
        console.log("updating sequence")
        Tone.Transport.clear()
        let sequence = new Tone.Sequence((time, note) => {
            console.log(`playing ${note}`)
            synth.triggerAttackRelease(note, 0.1, time);
        }, filledChords.current, "8n").start(0)// Tone.Transport.now())
        return () => {sequence.clear()}
    }, [getFilledChords, synth])

    function playTrack() {
        Tone.start()
        if (Tone.Transport.state !== "started") {
            console.log("START")
            Tone.Transport.start();
            console.log(Tone.Transport.position)
            // Tone.Transport.position = 0;
        }
    }

    function stopTrack() {
        if (Tone.Transport.state !== "stopped") {
            // Tone.Transport.cancel();
            Tone.Transport.pause();
        }
    }

    useEffect(() => {
        Tone.Transport.bpm.rampTo(props.tempo, 1)}, [props.tempo])
    useEffect(() => {return updateSequence()}, [props.chords, updateSequence])
    const chordView = getFilledChords(props.chords).map((c,i) => <span className="chordViewBox" key={i}>{c === "" ? "- -" : c}</span>)

    return (
        <div className="SynthTrack">
            {chordView}
            <button onClick={() => {
                playTrack()
            }}>
                Play
            </button>
            <button onClick={stopTrack}>
                Stop
            </button>
        </div>
    )
}

export default SynthTrack