import React from "react"
import { isPlaying, play, pause } from "../../Music/ToneTools"


function MasterControls() {
    const button = isPlaying() ? (
        <button onClick={pause}>
            Pause
        </button>
    ) : (
        <button onClick={play}>
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