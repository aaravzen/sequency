import * as Tone from 'tone'

export function isPlaying() {
    return Tone.Transport.state === "started"
}

export function play() {
    Tone.start()
    if (Tone.Transport.state !== "started") {
        console.log("START")
        Tone.Transport.start();
        console.log(Tone.Transport.position)
        // Tone.Transport.position = 0;
    }
}

export function pause() {
    if (Tone.Transport.state !== "stopped") {
        // Tone.Transport.cancel();
        Tone.Transport.pause();
    }
}