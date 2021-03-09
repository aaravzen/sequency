import './App.css'
import { useState } from 'react'
import SettingsBar from "./Components/SettingsBar"

function App() {

    const [keyNote, changeKeyNote] = useState("C")
    const [keyQuality, changeKeyQuality] = useState("Major")
    const [timeSignature, changeTimeSignature] = useState("4/4")
    const [measures, changeMeasures] = useState(4)
    const [tempo, changeTempo] = useState(120)

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
            />
        </div>
    );
}

export default App
