import React from "react"
import KeySelector from "./Settings/KeySelector"
import QualitySelector from "./Settings/QualitySelector"
import TimeSignatureSelector from "./Settings/TimeSignatureSelector"
import MeasureSelector from "./Settings/MeasureSelector"
import TempoSelector from "./Settings/TempoSelector"
import "./Settings/Settings.css"

function SettingsBar(props) {
    return (
        <div className="SettingsBar">
            <div className="SettingsPane">
                Settings
                <br />
                {props.keyNote} {props.keyQuality} 
                <br />
                {props.measures} measures in {props.timeSignature}
                <br />
                Tempo {props.tempo}
            </div>
            <KeySelector 
                keyNote={props.keyNote}
                changeKeyNote={props.changeKeyNote}
            />
            <QualitySelector
                keyQuality={props.keyQuality}
                changeKeyQuality={props.changeKeyQuality}
            />
            <TimeSignatureSelector
                timeSignature={props.timeSignature}
                changeTimeSignature={props.changeTimeSignature}
            />
            <MeasureSelector
                measures={props.measures}
                changeMeasures={props.changeMeasures}
            />
            <TempoSelector
                tempo={props.tempo}
                changeTempo={props.changeTempo}
            />
        </div>
    )
}

export default SettingsBar