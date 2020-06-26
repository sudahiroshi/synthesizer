window.addEventListener('load', () => {
    let sound = new Sound();
    let ui = new SynthUI( sound );
    ui.set_event();
    ui.set_keyboard();
})

class SynthUI {
    constructor( sound ) {
        this.down = "touchstart";
        this.up = "touchend";
        this.sound = sound;
        this.spectrum = {};
        this.spectrum_ui = [];
        this.playing = {};
        for( let i=0; i<10; i++ ) {
            this.spectrum_ui.push( document.querySelector("#x0"+i) );
            this.spectrum["x0"+i] = 0;
        }
        for( let i=10; i<=20; i++ ) {
            this.spectrum_ui.push( document.querySelector("#x"+i) );
            this.spectrum["x"+i] = 0;
        }

        this.envelope_ui = [ "attack", "decay", "sustain", "release" ].map( (name) => document.querySelector( "#"+name ));
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

    get_spectrum() {
        return this.spectrum_ui.map( ui => Number( ui.value ) );
    }

    set_spectrum( array ) {
        for( let i=1; i<=20; i++ ) {
            this.spectrum_ui[i].value = array[i];
        }
    }

    get_envelope() {
        return this.envelope_ui.map( ui => Number(ui.value) );
    }

    set_envelope( array ) {
        for( let i=0; i<4; i++ ) {
            this.envelope_ui[i].value = array[i];
        }
    }

    set_event() {
        document.querySelector('#sin').addEventListener('click', () => {
            let dummy_array = new Array(21);
            for( let i=0; i<=20; i++ ) {
                dummy_array[i] = 0;
            }
            dummy_array[1] = 1;
            this.set_spectrum( dummy_array );
            this.set_envelope( [ 0.5, 0.5, 0.5, 0.5 ] );
        });
        document.querySelector('#piano2').addEventListener('click', () => {
            let dummy_array = new Array(21);
            for( let i=0; i<=20; i++ ) {
                dummy_array[i] = 0;
            }
            dummy_array[1] = 1;
            for( let i=2; i<=20; i+=2 )  dummy_array[i] = 1;
            this.set_spectrum( dummy_array );
            this.set_envelope( [ 0.01, 0.9, 0, 0]);
        });
        document.querySelector('#piano').addEventListener('click', () => {
            let dummy_array = new Array(21);
            for( let i=0; i<=20; i++ ) {
                dummy_array[i] = 0;
            }
            for( let i=1; i<=20; i+=2 )  dummy_array[i] = 1;
            this.set_spectrum( dummy_array );
            this.set_envelope( [ 0.01, 0.9, 0, 0]);
        });
    }

    set_keyboard() {
        for( let [key, value] of Object.entries(this.freq) ) {
            document.querySelector('#' + key).addEventListener(this.down, () => {
                let tone = new Synth( this.sound.ctx, value, this.get_spectrum() );
                tone.play2( this.get_envelope() );
                console.log("key down");
                document.querySelector('#' + key).addEventListener(this.up, (ev) => {
                    if(!tone) {}
                    return function f() {
                        console.log("key up");
                        tone.stop2();
                        setTimeout( () => {
                            tone = null;
                        }, 2500 );
                        ev.srcElement.removeEventListener(this.up, f, false );
                    }
                });
            });
        }
        // document.querySelector('#a3').addEventListener('click', () => {
        //     this.synth.play2( this.freq["a3"], this.get_spectrum() );
        // });
        // document.querySelector('#a4').addEventListener('click', () => {
        //     this.synth.play2( this.freq["a4"], this.get_spectrum() );
        // });
    }
}