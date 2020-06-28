/**
 * AudioContextを司るクラス
 * 他の仕事もさせるつもりでクラス化したけど，ほとんど仕事がないので廃止するかも
 */
class Sound {
    constructor() {
        window.AudioContext = window.webkitAudioContext || window.AudioContext;
        this.ctx = new AudioContext();
    }
}