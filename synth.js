/**
 * 音を合成するクラス
 */
class Synth {
    /**
     * コンストラクタ
     * @param {AudioContext} ctx オーディオ・コンテキスト
     * @param {Number} frequency 基音の周波数
     * @param {Array<Number>} spectrum スペクトラムの配列
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
     * @param {Array<Number>} array 以下のパラメータ要素を持つ配列
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
}
