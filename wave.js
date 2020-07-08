class Wave {
    /**
     * コンストラクタ
     * @param {HTMLCanvasElement}} element Canvas要素
     */
    constructor( element ) {
        this.element = element;
        this.ctx = element.getContext('2d');
        this.width = element.width;
        this.height = element.height;
    }

    /**
     * 波形を描画する
     * @param {Array<Number>} elm 振幅(0〜1）の配列
     */
    draw( elm ) {
        let ctx = this.ctx;
        let data = [];
        for( let x=0; x<this.width * 2; x++ ) {
            let amp = 0;
            for( let i=1; i<=20; i++ ) {
                amp += elm[i] * Math.sin( 2.0 * Math.PI * x * i / 100.0 );
            }
            data[x] = amp;
        }

        ctx.beginPath();
        ctx.clearRect( 0, 0, 800, 200 );
        ctx.moveTo( 0, 100 );

        for( let x in data ) {
            ctx.lineTo( x, 100 - data[x] * 50.0 );
        }
        ctx.stroke();
    }
}