import React, { useState } from "react"
import { isPlaying, play, pause } from "../../Music/ToneTools"


function MasterControls() {
    const [playing, setPlaying] = useState(isPlaying())

    const button = playing ? (
        <button onClick={() => {
            pause()
            setPlaying(false)
        }}>
            Pause
        </button>
    ) : (
        <button onClick={() => {
            play()
            setPlaying(true)
        }}>
            Play
        </button>
    )

    return (
        <div className="MasterControls">
            {button}
        </div>
    )
}

export default MasterControls