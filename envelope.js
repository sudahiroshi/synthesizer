/**
 * 音のエンベロープに関するクラス
 */
class Envelope {
    /**
     * コンストラクタ
     * @param {Array<String>} ui エンベロープ関連の要素名(String)の配列
     * @param {HTMLCanvasElement} graph_elm グラフを描画する要素
     * @param {SynthUI} synth_ui スペクトルを得るのに使用する
     */
    constructor( ui, graph_elm, synth_ui ) {
        this.ui = ui;
        this.graph_elm = graph_elm;
        this.synth_ui = synth_ui;
        this.width = graph_elm.width;
        this.height = graph_elm.height;

        this.canvas = document.querySelector('#env_canvas');
        this.ctx = this.canvas.getContext('2d');

        // Attack
        ui[0].addEventListener('input', (ev) => {
            this.draw_graph();
            this.draw_env();
        });

        // Decay
        ui[1].addEventListener('input', (ev) => {
            this.draw_graph();
            this.draw_env();
        });

        // Sustain
        ui[2].addEventListener('input', (ev) => {
            this.draw_graph();
            this.draw_env();
        });

        // Release
        ui[3].addEventListener('input', (ev) => {
            this.draw_graph();
            this.draw_env();
        });
        this.draw_graph();
        this.draw_env();
    }

    /**
     * エンベロープのグラフを描画する
     */
    draw_graph() {
        let [attack, decay, sustain, release] = this.get_envelope();

        this.ctx.clearRect(0,0,this.canvas.clientWidth, this.canvas.height);
        this.ctx.clearRect(0,0,400, 150);
        // Attack
        this.ctx.beginPath();
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = 'rgb(200,100,100)';
        this.ctx.moveTo( 0, 150 );
        this.ctx.lineTo( attack * 50, 0 );
        this.ctx.stroke();

        // Decay
        this.ctx.beginPath();
        this.ctx.moveTo( attack * 50, 0 );
        this.ctx.strokeStyle = 'rgb(100,200,100)';
        this.ctx.lineTo( (attack + decay) * 50, 150 - sustain * 150 );
        this.ctx.stroke();

        // Sustain
        this.ctx.beginPath();
        this.ctx.moveTo( (attack + decay) * 50, 150 -sustain * 150 );
        this.ctx.strokeStyle = 'rgb(50,50,50)';
        this.ctx.lineTo( 200, 150 - sustain * 150 );
        this.ctx.stroke();

        // Release
        this.ctx.beginPath();
        this.ctx.moveTo( 200, 150 - sustain * 150 );
        this.ctx.strokeStyle = 'rgb(100,100,200)';
        this.ctx.lineTo( 200 + release * 50, 150 );
        this.ctx.stroke();
    }

    /**
     * エンベロープに関連する4つのスライダから値を取得する
     * @return {Array<Number>} エンベロープの内容
     */
    get_envelope() {
        return this.ui.map( ui => Number(ui.value) );
    }

    /**
     * エンベロープに関連する4つの値をセットする
     * @param {Array<Number>} params エンベロープに関連する4つの値
     */
    set_envelope( params ) {
        [ this.attack, this.decay, this.sustain, this.release ] = params;
        this.draw_env();
    }

    draw_env() {
        let graph = this.graph_elm;
        let ctx = graph.getContext('2d');
        let spectrum = this.synth_ui.get_spectrum();
        let [attack, decay, sustain, release] = this.get_envelope();
        const sample_rate = 44100;

        let data = [];
        //let amp = 10.0 * spectrum.reduce( (sum, a) => sum + a, 0 ) / spectrum.length;
        let amp = 1.0;
        let skip = 180;
        for( let x=0; x<sample_rate * 4; x+=skip ) {
            data.push( amp * Math.sin( 2.0 * Math.PI * x / 100.0 ) );
        }

        // Attackの部分の振幅を作る
        let p1 = Math.floor(attack * sample_rate / skip); // Attackに到達する要素
        let p2 = Math.floor((attack+decay)*sample_rate / skip); // Decayに到達する要素
        let p3 = Math.floor((attack + decay + 0.5) * sample_rate / skip); // キーoffの要素
        let p4 = Math.floor((attack+decay+0.5+release) * sample_rate / skip); // 音が鳴り止む要素
        let rate = 1.0 / p1;
        let volume = 0.0;
        for( let i=0; i<p1; i++ ) {
            data[i] *= volume;
            volume += rate;
        }

        // Decayの部分の振幅を作る
        rate =  ( 1.0 - sustain ) / ( decay * sample_rate / skip );
        for( let i=p1; i<p2; i++ ) {
            data[i] *= volume;
            volume -= rate;
        }

        for( let i=p2; i<p3; i++ ) {
            data[i] *= volume;
        }

        // Releaseの部分の振幅を作る
        rate = sustain / ( release * sample_rate / skip );
        for( let i=p3; i<p4; i++ ) {
            data[i] *= volume;
            volume -= rate;
        }

        // 鳴り終わった後
        for( let i=p4; i<4.0 * sample_rate / skip; i++ ) {
            data[i] = 0;
        }

        // グラフ描画
        ctx.beginPath();
        ctx.clearRect( 0, 0, 800, 200 );
        ctx.moveTo( 0, 100 );
        for( let x in data ) {
            ctx.lineTo( x, 100 - data[x] * 50.0 );
        }
        ctx.stroke();

    }
}