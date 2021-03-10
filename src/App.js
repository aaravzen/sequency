import './App.css'
import { useEffect, useState } from 'react'
import SettingsBar from "./Components/SettingsBar"
import Sequencer from "./Components/Sequencer"
import { getScale } from "./Music/ScaleTools"

function App() {

    const [keyNote, changeKeyNote] = useState("C")
    const [keyQuality, changeKeyQuality] = useState("Major")
    const [timeSignature, changeTimeSignature] = useState("4/4")
    const [measures, changeMeasures] = useState(4)
    const [tempo, changeTempo] = useState(120)
    const [scale, changeScale] = useState(getScale(keyNote, keyQuality))
    useEffect(() => changeScale(getScale(keyNote, keyQuality)), [keyNote, keyQuality])

    return (
        <div className="App">
            <SettingsBar
                keyNote={keyNote}
                keyQuality={keyQuality}
                changeKeyNote={changeKeyNote}
                changeKeyQuality={changeKeyQuality}
                timeSignature={timeSignature}
                changeTimeSignature={changeTimeSignature}
                measures={measures}
                changeMeasures={changeMeasures}
                tempo={tempo}
                changeTempo={changeTempo}
                scale={scale}
            />
            <br/>
            <br/>
            <Sequencer 
                measures={measures}
                timeSignature={timeSignature}
                keyNote={keyNote}
                keyQuality={keyQuality}
                tempo={tempo}
            />
        </div>
    );
}

export default App
