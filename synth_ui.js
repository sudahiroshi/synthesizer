window.addEventListener('load', () => {
    let sound = new Sound();
    let ui = new SynthUI( sound );
    ui.set_event();
    ui.set_keyboard();
})

class SynthUI {
    /**
     * コンストラクタ
     * @param {Sound} sound Soundクラスのインスタンス
     */
    constructor( sound ) {
        this.sound = sound;
        this.spectrum = {};
        this.spectrum_ui = [];
        for( let i=0; i<10; i++ ) {
            this.spectrum_ui.push( document.querySelector("#x0"+i) );
            this.spectrum["x0"+i] = 0;
        }
        for( let i=10; i<=20; i++ ) {
            this.spectrum_ui.push( document.querySelector("#x"+i) );
            this.spectrum["x"+i] = 0;
        }

        this.envelope_ui = [ "attack", "decay", "sustain", "release" ].map( (name) => document.querySelector( "#"+name ));
        this.envelope = new Envelope( this.envelope_ui );

        this.keys = [
            "c3","c3s","d3","d3s","e3","f3","f3s","g3","g3s","a3","a3s","b3",
            "c4","c4s","d4","d4s","e4","f4","f4s","g4","g4s","a4","a4s","b4"
        ];
        // 12平均律
        this.freq = {
            "c3":   130.81, // c3
            "c3s":  138.59,
            "d3":   146.83,
            "d3s":  155.56,
            "e3":   164.81,
            "f3":   174.61,
            "f3s":  185.00,
            "g3":   196.00,
            "g3s":  207.65,
            "a3":   220.00, // a3
            "a3s":  233.08,
            "b3":   246.94,
            "c4":   261.63, // c4
            "c4s":  277.18,
            "d4":   293.66,
            "d4s":  311.13,
            "e4":   329.63,
            "f4":   349.23,
            "f4s":  369.99,
            "g4":   391.99,
            "g4s":  415.30,
            "a4":   440.00, // a4
            "a4s":  466.16,
            "b4":   493.88,
        };
        // 純正律
        this.freq2 = {
            "c3":   132.00, // c3
            "c3s":  140.80,
            "d3":   148.50,
            "d3s":  158.40,
            "e3":   165.00,
            "f3":   176.00,
            "f3s":  187.00,
            "g3":   198.00,
            "g3s":  211.20,
            "a3":   220.00, // a3
            "a3s":  237.60,
            "b3":   247.50,
            "c4":   264.00, // c4
            "c4s":  281.60,
            "d4":   293.66,
            "d4s":  316.80,
            "e4":   329.63,
            "f4":   349.23,
            "f4s":  374.00,
            "g4":   391.99,
            "g4s":  422.40,
            "a4":   440.00, // a4
            "a4s":  475.20,
            "b4":   493.88,
        };
    }

    /**
     * 画面に並んだスライダーからスペクトルを取得する
     * @return {Array<Number>} スペクトル（Number）の配列
     */
    get_spectrum() {
        return this.spectrum_ui.map( ui => Number( ui.value ) );
    }

    /**
     * 配列で与えられたスペクトルをスライダーにセットする
     * @param {Array<Number>} array スペクトルの配列(Number)　値は0〜1
     */
    set_spectrum( array ) {
        for( let i=1; i<=20; i++ ) {
            this.spectrum_ui[i].value = array[i];
        }
    }

    /**
     * 画面に並んだエンベロープ関係のスライダーから値を取得する
     * @return {Array<Number>} Numberの配列　値は0〜1
     */
    get_envelope() {
        return this.envelope_ui.map( ui => Number(ui.value) );
    }

    /**
     * 配列で与えられたエンベロープ関連のパラメータをスライダーにセットする
     * @param {Array<Number>} array エンベロープ関係(Number)の配列　値は0〜1
     */
    set_envelope( array ) {
        for( let i=0; i<4; i++ ) {
            this.envelope_ui[i].value = array[i];
        }
    }

    /**
     * 楽器選択画面のイベントを設定する
     */
    set_event() {
        document.querySelector('#sin').addEventListener('click', () => {
            let dummy_array = new Array(21);
            for( let i=0; i<=20; i++ ) {
                dummy_array[i] = 0;
            }
            dummy_array[1] = 1;
            this.set_spectrum( dummy_array );
            this.set_envelope( [ 0.0, 0.0, 1.0, 0.0 ] );
            this.envelope.draw_graph();
        });
        document.querySelector('#piano').addEventListener('click', () => {
            let dummy_array = new Array(21);
            for( let i=0; i<=20; i++ ) {
                dummy_array[i] = 0;
            }
            //dummy_array[1] = 1;
            for( let i=1; i<=6; i++ )  dummy_array[i] = 1.0/i;
            this.set_spectrum( dummy_array );
            this.set_envelope( [ 0.01, 0.9, 0, 0]);
            this.envelope.draw_graph();
        });
        document.querySelector('#organ').addEventListener('click', () => {
            let dummy_array = new Array(21);
            for( let i=0; i<=20; i++ ) {
                dummy_array[i] = 0;
            }
            for( let i=1; i<=20; i+=2 )  dummy_array[i] = 1.0/i;
            this.set_spectrum( dummy_array );
            this.set_envelope( [ 0.01, 0.9, 1, 0.2]);
            this.envelope.draw_graph();
        });
        document.querySelector('#violin').addEventListener('click', () => {
            let dummy_array = new Array(21);
            for( let i=0; i<=20; i++ ) {
                dummy_array[i] = 1.0/i;
            }
            this.set_spectrum( dummy_array );
            this.set_envelope( [ 0.01, 0.9, 1, 0.2]);
            this.envelope.draw_graph();
        });
        document.querySelector('#clarinet').addEventListener('click', () => {
            let dummy_array = new Array(21);
            for( let i=0; i<=20; i++ ) {
                dummy_array[i] = 0;
            }
            //dummy_array[1] = 1;
            for( let i=1; i<=7; i+=2 )  dummy_array[i] = 1.0/i;
            this.set_spectrum( dummy_array );
            this.set_envelope( [ 0.1, 1.0, 0, 0.3]);
            this.envelope.draw_graph();
        });
        document.querySelector('#flute').addEventListener('click', () => {
            let dummy_array = new Array(21);
            for( let i=0; i<=20; i++ ) {
                dummy_array[i] = 0;
            }
            dummy_array[1] = 0.5;
            dummy_array[2] = 0.8;
            dummy_array[3] = 0.3;
            this.set_spectrum( dummy_array );
            this.set_envelope( [ 0.1, 0.0, 0.9, 0.3]);
            this.envelope.draw_graph();
        });
    }

    /**
     * 鍵盤関係のイベントを設定する
     */
    set_keyboard() {
        for( let [key, value] of Object.entries(this.freq) ) {
            let playing = false;
            let tone;
            document.querySelector('#' + key).addEventListener("mousedown", () => {
                if(!playing) {
                    tone = new Synth( this.sound.ctx, value, this.get_spectrum() );
                    tone.play( this.get_envelope() );
                    console.log("key down");
                    playing = true;
                }
            });
            document.querySelector('#' + key).addEventListener("mouseup", (ev) => {
                if(playing) {
                    console.log("key up");
                    tone.stop();
                    playing = false;
                }
            });
            document.querySelector('#' + key).addEventListener("mouseout", (ev) => {
                if(playing) {
                    console.log("key up");
                    tone.stop();
                    playing = false;
                }
            });
            document.querySelector('#' + key).addEventListener("touchstart", () => {
                if(playing) tone.stop2();
                //{
                    tone = new Synth( this.sound.ctx, value, this.get_spectrum() );
                    tone.play( this.get_envelope() );
                    console.log("key down");
                    playing = true;
                //}
            });
            document.querySelector('#' + key).addEventListener("touchend", (ev) => {
                if(playing) {
                    console.log("key up");
                    tone.stop();
                    playing = false;
                }
            });
        }
    }
}