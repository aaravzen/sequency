import React from "react"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function MeasureSelector(props) {
    return (
        <div className="MeasureSelector">
            <Slider 
                value={props.measures}
                min={1}
                max={10}
                onChange={(event) => props.changeMeasures(event)}
            />
        </div>
    )
}

export default MeasureSelector