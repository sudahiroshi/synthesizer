/**
 * 音のエンベロープに関するクラス
 */
class Envelope {
    /**
     * コンストラクタ
     * @param {Array<String>} ui エンベロープ関連の要素名(String)の配列
     */
    constructor( ui ) {
        this.ui = ui;

        this.canvas = document.querySelector('#env_canvas');
        this.ctx = this.canvas.getContext('2d');

        // Attack
        ui[0].addEventListener('change', (ev) => {
            this.draw_graph();
        });

        // Decay
        ui[1].addEventListener('change', (ev) => {
            this.draw_graph();
        });

        // Sustain
        ui[2].addEventListener('change', (ev) => {
            this.draw_graph();
        });

        // Release
        ui[3].addEventListener('change', (ev) => {
            this.draw_graph();
        });
        this.draw_graph();
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

}