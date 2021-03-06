'use strict'

const { ipcRenderer } = require('electron')
const { Howl, Howler } = require('howler')

document.getElementById('play-sound-btn').addEventListener('click', () => {
    ipcRenderer.send('play-song')
})

document.getElementById('volume-slider').oninput = function() {
    const v = this.value
    Howler.volume(v / 100.0)
}

let sound;
let soundTick;

function soundCleanup() {
    sound = null
    window.clearInterval(soundTick)
}

ipcRenderer.on('use-sound-file', (event, filepath) => {
    if (sound) {
        sound.stop()
        soundCleanup()
    }

    sound = new Howl({
        src: [ filepath ],
        onend: soundCleanup
    })

    soundTick = window.setInterval(() => {
        const visSlider = document.getElementById('sound-progress')
        const newVal = sound.seek() || 0
        const maxVal = sound.duration() || 1
        visSlider.style.width = ((newVal / maxVal) * 100) + "%"
    }, 100)

    sound.play()
})
