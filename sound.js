class Sound {
    constructor() {
        window.AudioContext = window.webkitAudioContext || window.AudioContext;
        this.ctx = new AudioContext();
    }
}