class Synth {
    /**
     * 音を合成するクラス
     * @param {AudioContext} ctx オーディオ・コンテキスト
     * @param {Number} frequency 基音の周波数
     * @param {Array} spectrum スペクトラムの配列
     */
    constructor( ctx, frequency, spectrum ) {
        this.number = spectrum.length;
        this.oscNode = new Array(this.number);
        this.gainNode = new Array(this.number);
        this.masterGain = ctx.createGain();
        this.ctx = ctx;

        let type = "sine";
        for( let i=1; i<this.number; i++ ) {
            this.oscNode[i] = this.ctx.createOscillator();
            this.gainNode[i] = this.ctx.createGain();

            this.oscNode[i].connect( this.gainNode[i] );
            this.gainNode[i].connect( this.masterGain );
            this.oscNode[i].type = type;
            this.oscNode[i].frequency.value = frequency*i;
            this.gainNode[i].gain.value = spectrum[i];
        }
        this.masterGain.connect( this.ctx.destination );
        this.masterGain.gain.value = 0;
    }

    /**
     * 合成音を鳴らす
     * @param {Array} array 以下のパラメータ要素を持つ配列
     *
     * 0 attack 音量が最大になるまでの時間(ms)
     * 1 decay 音量が最大からSustainレベルになるまでの時間(ms)
     * 2 sustain Sustainレベル
     * 3 release キーＯＦＦから音量0になるまでの時間（ms)
     */
    play( array ) {
        let attack = array[0];
        let decay = array[1];
        let sustain = array[2];
        this.release = array[3];
        this.masterGain.gain.value = 0;
        for( let i=1; i<this.number; i++ ) {
            this.oscNode[i].start();
        }
        let now = this.ctx.currentTime;
        console.log(now);
        console.log(now+attack);
        console.log(now+attack+decay);
        this.masterGain.gain.linearRampToValueAtTime( 1, now + attack );
        this.masterGain.gain.setTargetAtTime( sustain, now + attack, decay );
    }

    /**
     * キーＯＦＦで徐々に音量を下げる
     */
    stop() {
        let now = this.ctx.currentTime;
        if( this.masterGain.gain.cancelAndHoldAtTime )
            this.masterGain.gain.cancelAndHoldAtTime(now);
        //else this.masterGain.gain = sustain;
        this.masterGain.gain.setTargetAtTime( 0, now, this.release );
        for( let i=1; i<this.number; i++ ) {
            this.oscNode[i].stop( now + this.release);
        }
    }
    /**
     * キーＯＦＦですぐに鳴り終わる
     */
    stop2() {
        let now = this.ctx.currentTime;
        if( this.masterGain.gain.cancelAndHoldAtTime )
            this.masterGain.gain.cancelAndHoldAtTime(now);
        else this.masterGain.gain.value = 0;
        for( let i=1; i<this.number; i++ ) {
            this.oscNode[i].stop( now + this.release);
        }
    }
    // /**
    //  * 基本波形を鳴らす
    //  * @param {String} type 波形{"sine", "square", "triangle", "sawtooth"のいずれか}
    //  * @param {Number} gain 音量
    //  * @param {Object} param 周波数と鳴らす時間のハッシュ
    //  */
    // play( type, gain, param ) {
    //     let frequency = param.freq || 440;
    //     let duration = param.duration || 1000;
    //     let oscNode = this.ctx.createOscillator();
    //     let gainNode = this.ctx.createGain();

    //     oscNode.connect( gainNode );
    //     gainNode.connect( this.ctx.destination );
    //     oscNode.type = type;
    //     oscNode.frequency.value = frequency;
    //     gainNode.gain.value = gain;
    //     oscNode.start();
    //     setTimeout( () => { oscNode.stop() }, duration );
    // }

    // /**
    //  * 楽器音を合成するための，元となる正弦波を生成する
    //  * @param {Number} number 合成する正弦波の数
    //  * @param {Number} frequency 基音の周波数
    //  * @param {Number} gain 振幅
    //  */
    // inst( number, frequency, gain ) {
    //     let type = "sine";
    //     let oscNode = new Array(number);
    //     let gainNode = new Array(number);
    //     for( let i=1; i<oscNode.length; i++ ) {
    //         oscNode[i] = this.ctx.createOscillator();
    //         gainNode[i] = this.ctx.createGain();

    //         oscNode[i].connect( gainNode[i] );
    //         gainNode[i].connect( this.ctx.destination );
    //         oscNode[i].type = type;
    //         oscNode[i].frequency.value = frequency*i;
    //         gainNode[i].gain.value = gain/i;
    //     }
    //     return [ oscNode, gainNode ];
    // }

    // /**
    //  * バイオリン：高い周波数成分まで含まれる音
    //  * @param {Number} gain 音量
    //  * @param {Object} param 周波数と鳴らす時間のハッシュ
    //  */
    // violin( gain, param ) {
    //     let frequency = param.freq || 440;
    //     let duration = param.duration || 1000;
    //     let [oscNode, gainNode] = this.inst( this.number, frequency, gain );
    //     for( let i=1; i<this.number; i++ ) {
    //         oscNode[i].start();
    //     }
    //     setTimeout( () => {
    //         for( let i=1; i<this.number; i++ ) {
    //             oscNode[i].stop();
    //         }
    //     }, duration );
    // }

    // /**
    //  * クッリネット：奇数倍音で構成される音
    //  * @param {Number} gain 音量
    //  * @param {Object} param 周波数と鳴らす時間のハッシュ
    //  */
    // clarinet( gain, param ) {
    //     let frequency = param.freq || 440;
    //     let duration = param.duration || 1000;
    //     let [oscNode, gainNode] = this.inst( this.number, frequency, gain );
    //     oscNode[1].start();
    //     for( let i=2; i<this.number; i+=2 ) {
    //         oscNode[i].start();
    //     }
    //     setTimeout( () => {
    //         oscNode[1].stop();
    //         for( let i=2; i<this.number; i+=2 ) {
    //             oscNode[i].stop();
    //         }
    //     }, duration );
    // }

    // /**
    //  * ピアノ：偶数倍音で構成される音
    //  * @param {Number} gain 音量
    //  * @param {Object} param 周波数と鳴らす時間のハッシュ
    //  */
    // piano( gain, param ) {
    //     let frequency = param.freq || 440;
    //     let duration = param.duration || 1000;
    //     let [oscNode, amp] = this.inst( this.number, frequency, gain );
    //     for( let i=1; i<this.number; i+=2 ) {
    //         oscNode[i].start();
    //     }
    //     setTimeout( () => {
    //         for( let i=1; i<this.number; i+=2 ) {
    //             oscNode[i].stop();
    //         }
    //     }, duration );
    // }

    // /**
    //  * フルート：低い周波数成分のみ含む音
    //  * @param {Number} gain 音量
    //  * @param {Object} param 周波数と鳴らす時間のハッシュ
    //  */
    // flute( gain, param ) {
    //     let frequency = param.freq || 440;
    //     let duration = param.duration || 1000;
    //     let [oscNode, amp] = this.inst( this.number, frequency, gain );
    //     for( let i=1; i<6; i++ ) {
    //         oscNode[i].start();
    //     }
    //     setTimeout( () => {
    //         for( let i=1; i<6; i++ ) {
    //             oscNode[i].stop();
    //         }
    //     }, duration );
    // }
}
