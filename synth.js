class Synth {
    constructor() {
        window.AudioContext = window.webkitAudioContext || window.AudioContext;
        this.ctx = new AudioContext();
        this.number = 20;
    }

    play2( frequency, spectrum ) {
        console.log( frequency );
        console.log( spectrum );
        let duration = 1000;
        let type = "sine";
        let oscNode = new Array(this.number);
        let gainNode = new Array(this.number);
        for( let i=0; i<oscNode.length; i++ ) {
            oscNode[i] = this.ctx.createOscillator();
            gainNode[i] = this.ctx.createGain();

            oscNode[i].connect( gainNode[i] );
            gainNode[i].connect( this.ctx.destination );
            oscNode[i].type = type;
            oscNode[i].frequency.value = frequency*i;
            gainNode[i].gain.value = spectrum[i];
        }
        for( let i=1; i<this.number; i++ ) {
            oscNode[i].start();
        }
        setTimeout( () => {
            for( let i=1; i<this.number; i++ ) {
                oscNode[i].stop();
            }
        }, duration );
    }
    /**
     * 基本波形を鳴らす
     * @param {String} type 波形{"sine", "square", "triangle", "sawtooth"のいずれか}
     * @param {Number} gain 音量
     * @param {Object} param 周波数と鳴らす時間のハッシュ
     */
    play( type, gain, param ) {
        let frequency = param.freq || 440;
        let duration = param.duration || 1000;
        let oscNode = this.ctx.createOscillator();
        let gainNode = this.ctx.createGain();

        oscNode.connect( gainNode );
        gainNode.connect( this.ctx.destination );
        oscNode.type = type;
        oscNode.frequency.value = frequency;
        gainNode.gain.value = gain;
        oscNode.start();
        setTimeout( () => { oscNode.stop() }, duration );
    }

    /**
     * 楽器音を合成するための，元となる正弦波を生成する
     * @param {Number} number 合成する正弦波の数
     * @param {Number} frequency 基音の周波数
     * @param {Number} gain 振幅
     */
    inst( number, frequency, gain ) {
        let type = "sine";
        let oscNode = new Array(number);
        let gainNode = new Array(number);
        for( let i=1; i<oscNode.length; i++ ) {
            oscNode[i] = this.ctx.createOscillator();
            gainNode[i] = this.ctx.createGain();

            oscNode[i].connect( gainNode[i] );
            gainNode[i].connect( this.ctx.destination );
            oscNode[i].type = type;
            oscNode[i].frequency.value = frequency*i;
            gainNode[i].gain.value = gain/i;
        }
        return [ oscNode, gainNode ];
    }

    /**
     * バイオリン：高い周波数成分まで含まれる音
     * @param {Number} gain 音量
     * @param {Object} param 周波数と鳴らす時間のハッシュ
     */
    violin( gain, param ) {
        let frequency = param.freq || 440;
        let duration = param.duration || 1000;
        let [oscNode, gainNode] = this.inst( this.number, frequency, gain );
        for( let i=1; i<this.number; i++ ) {
            oscNode[i].start();
        }
        setTimeout( () => {
            for( let i=1; i<this.number; i++ ) {
                oscNode[i].stop();
            }
        }, duration );
    }

    /**
     * クッリネット：奇数倍音で構成される音
     * @param {Number} gain 音量
     * @param {Object} param 周波数と鳴らす時間のハッシュ
     */
    clarinet( gain, param ) {
        let frequency = param.freq || 440;
        let duration = param.duration || 1000;
        let [oscNode, gainNode] = this.inst( this.number, frequency, gain );
        oscNode[1].start();
        for( let i=2; i<this.number; i+=2 ) {
            oscNode[i].start();
        }
        setTimeout( () => {
            oscNode[1].stop();
            for( let i=2; i<this.number; i+=2 ) {
                oscNode[i].stop();
            }
        }, duration );
    }

    /**
     * ピアノ：偶数倍音で構成される音
     * @param {Number} gain 音量
     * @param {Object} param 周波数と鳴らす時間のハッシュ
     */
    piano( gain, param ) {
        let frequency = param.freq || 440;
        let duration = param.duration || 1000;
        let [oscNode, amp] = this.inst( this.number, frequency, gain );
        for( let i=1; i<this.number; i+=2 ) {
            oscNode[i].start();
        }
        setTimeout( () => {
            for( let i=1; i<this.number; i+=2 ) {
                oscNode[i].stop();
            }
        }, duration );
    }

    /**
     * フルート：低い周波数成分のみ含む音
     * @param {Number} gain 音量
     * @param {Object} param 周波数と鳴らす時間のハッシュ
     */
    flute( gain, param ) {
        let frequency = param.freq || 440;
        let duration = param.duration || 1000;
        let [oscNode, amp] = this.inst( this.number, frequency, gain );
        for( let i=1; i<6; i++ ) {
            oscNode[i].start();
        }
        setTimeout( () => {
            for( let i=1; i<6; i++ ) {
                oscNode[i].stop();
            }
        }, duration );
    }
}
