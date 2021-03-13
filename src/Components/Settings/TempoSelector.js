import React, {useEffect} from "react"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as Tone from 'tone'

function TempoSelector(props) {
    useEffect(() => {Tone.Transport.bpm.rampTo(props.tempo)}, [props.tempo])

    return (
        <div className="TempoSelector">
            <Slider 
                value={props.tempo}
                min={60}
                max={180}
                onChange={(event) => props.changeTempo(event)}
            />
        </div>
    )
}

export default TempoSelector