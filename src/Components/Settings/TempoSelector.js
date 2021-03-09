import React from "react"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function TempoSelector(props) {
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