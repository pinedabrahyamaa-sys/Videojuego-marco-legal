window.Game = window.Game || {};

(function() {
    // Motor de audio sintetizado con Web Audio API (sin archivos externos)
    let ctx = null;
    let isMuted = false;
    let lastStepTime = 0;
    let isLeftFoot = false;

    // Nodos de Web Audio API para el zumbido ambiental de servidores (Sala 2)
    let humGain = null;
    let humOsc1 = null;
    let humOsc2 = null;
    let humFilter = null;
    let humActive = false;

    // Cargar preferencia persistente
    try {
        isMuted = localStorage.getItem("escape_room_muted") === "true";
    } catch (e) {
        isMuted = false;
    }

    function getAudioContext() {
        if (!ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                ctx = new AudioContextClass();
            }
        }
        if (ctx && ctx.state === "suspended") {
            ctx.resume();
        }
        return ctx;
    }

    window.Game.Audio = {
        init: function() {
            getAudioContext();
        },

        isMuted: function() {
            return isMuted;
        },

        toggleMute: function() {
            isMuted = !isMuted;
            try {
                localStorage.setItem("escape_room_muted", isMuted ? "true" : "false");
            } catch (e) {}
            if (isMuted && humActive) {
                this.stopServerHum();
            }
            return isMuted;
        },

        // =====================================================================
        // EFECTOS DE SONIDO SINTETIZADOS SUTILES Y SOBRIOS
        // =====================================================================

        // Pisada ligera y realista de zapato sobre piso de concreto (Web Audio API)
        step: function() {
            try {
                if (isMuted) return;
                const now = Date.now();
                if (now - lastStepTime < 280) return;
                lastStepTime = now;

                const ac = getAudioContext();
                if (!ac) return;

                // Alternar sutilmente entre pie izquierdo y derecho para sonido orgánico
                isLeftFoot = !isLeftFoot;
                const t = ac.currentTime;
                const duration = 0.045; // ~45 ms

                // 1. Golpe grave suave de cuerpo / suela (116Hz / 124Hz)
                const baseFreq = isLeftFoot ? 122 : 116;
                const pitchJitter = (Math.random() - 0.5) * 4;
                const oscFreq = baseFreq + pitchJitter;

                const osc = ac.createOscillator();
                const oscGain = ac.createGain();
                const oscFilter = ac.createBiquadFilter();

                osc.type = "sine";
                osc.frequency.setValueAtTime(oscFreq, t);
                osc.frequency.exponentialRampToValueAtTime(38, t + duration);

                oscFilter.type = "lowpass";
                oscFilter.frequency.setValueAtTime(170, t);

                oscGain.gain.setValueAtTime(0.075, t);
                oscGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

                osc.connect(oscFilter);
                oscFilter.connect(oscGain);
                oscGain.connect(ac.destination);

                osc.start(t);
                osc.stop(t + duration);

                // 2. Pulso muy corto de ruido blanco con filtro pasa-banda (~900Hz) para textura de concreto
                const sampleRate = ac.sampleRate || 44100;
                const bufferSize = Math.max(1, Math.floor(sampleRate * duration));
                const buffer = ac.createBuffer(1, bufferSize, sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
                }

                const noise = ac.createBufferSource();
                noise.buffer = buffer;

                const bandpass = ac.createBiquadFilter();
                bandpass.type = "bandpass";
                bandpass.frequency.setValueAtTime(isLeftFoot ? 910 : 880, t);
                bandpass.Q.setValueAtTime(1.8, t);

                const noiseGain = ac.createGain();
                noiseGain.gain.setValueAtTime(0.038, t);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

                noise.connect(bandpass);
                bandpass.connect(noiseGain);
                noiseGain.connect(ac.destination);

                noise.start(t);
                noise.stop(t + duration);
            } catch (err) {
                // Silencioso ante cualquier restricción de Web Audio API
            }
        },

        // Sonido de folio / expediente de papel
        paper: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            const bufferSize = ac.sampleRate * 0.09;
            const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
            }

            const noise = ac.createBufferSource();
            noise.buffer = buffer;

            const filter = ac.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.value = 1600;
            filter.Q.value = 1.2;

            const gain = ac.createGain();
            const t = ac.currentTime;
            gain.gain.setValueAtTime(0.08, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ac.destination);

            noise.start(t);
        },

        // Sonido de terminal informática / pantalla de datos
        computer: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            const t = ac.currentTime;
            [880, 1320].forEach((freq, idx) => {
                const osc = ac.createOscillator();
                const gain = ac.createGain();
                osc.type = "sine";
                osc.frequency.value = freq;

                const start = t + idx * 0.035;
                gain.gain.setValueAtTime(0.04, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.04);

                osc.connect(gain);
                gain.connect(ac.destination);

                osc.start(start);
                osc.stop(start + 0.04);
            });
        },

        // Clic discreto de interfaz
        uiClick: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            const osc = ac.createOscillator();
            const gain = ac.createGain();
            const t = ac.currentTime;

            osc.type = "sine";
            osc.frequency.setValueAtTime(700, t);
            osc.frequency.exponentialRampToValueAtTime(300, t + 0.025);

            gain.gain.setValueAtTime(0.05, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

            osc.connect(gain);
            gain.connect(ac.destination);

            osc.start(t);
            osc.stop(t + 0.025);
        },

        // Acorde sobrio ascendente al superar el Paso 1 de la terminal
        stepSuccess: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            const t = ac.currentTime;
            const notes = [440, 554.37, 659.25]; // La, Do#, Mi (A mayor)

            notes.forEach((freq, i) => {
                const osc = ac.createOscillator();
                const gain = ac.createGain();
                const filter = ac.createBiquadFilter();

                osc.type = "sine";
                osc.frequency.value = freq;

                filter.type = "lowpass";
                filter.frequency.value = 1800;

                const start = t + i * 0.045;
                gain.gain.setValueAtTime(0.06, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ac.destination);

                osc.start(start);
                osc.stop(start + 0.16);
            });
        },

        // Golpe sutil amortiguado al cometer un error en la terminal
        error: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            const osc = ac.createOscillator();
            const gain = ac.createGain();
            const filter = ac.createBiquadFilter();
            const t = ac.currentTime;

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(140, t);
            osc.frequency.exponentialRampToValueAtTime(70, t + 0.18);

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(320, t);

            gain.gain.setValueAtTime(0.08, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ac.destination);

            osc.start(t);
            osc.stop(t + 0.18);
        },

        // Clic de desbloqueo mecánico + confirmación de salida
        doorUnlock: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            const t = ac.currentTime;

            // Clic de cerrojo mecánico
            const clickOsc = ac.createOscillator();
            const clickGain = ac.createGain();
            clickOsc.type = "square";
            clickOsc.frequency.setValueAtTime(350, t);
            clickOsc.frequency.exponentialRampToValueAtTime(80, t + 0.04);
            clickGain.gain.setValueAtTime(0.07, t);
            clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
            clickOsc.connect(clickGain);
            clickGain.connect(ac.destination);
            clickOsc.start(t);
            clickOsc.stop(t + 0.04);

            // Tono armónico posterior
            const notes = [523.25, 659.25, 783.99]; // Do, Mi, Sol
            notes.forEach((freq, i) => {
                const osc = ac.createOscillator();
                const gain = ac.createGain();
                osc.type = "sine";
                osc.frequency.value = freq;

                const start = t + 0.05 + i * 0.05;
                gain.gain.setValueAtTime(0.05, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

                osc.connect(gain);
                gain.connect(ac.destination);
                osc.start(start);
                osc.stop(start + 0.22);
            });
        },

        // Barrido suave al cruzar de sala
        transition: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            const t = ac.currentTime;
            const bufferSize = ac.sampleRate * 0.35;
            const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
            }

            const noise = ac.createBufferSource();
            noise.buffer = buffer;

            const filter = ac.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(250, t);
            filter.frequency.exponentialRampToValueAtTime(900, t + 0.18);
            filter.frequency.exponentialRampToValueAtTime(200, t + 0.35);

            const gain = ac.createGain();
            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ac.destination);

            noise.start(t);
        },

        // Progresión elegante de 3 notas al completar el peritaje
        victory: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            const t = ac.currentTime;
            const chords = [
                { f: 523.25, d: 0.25 }, // C5
                { f: 659.25, d: 0.28 }, // E5
                { f: 783.99, d: 0.45 }  // G5
            ];

            chords.forEach((c, idx) => {
                const osc = ac.createOscillator();
                const gain = ac.createGain();
                osc.type = "sine";
                osc.frequency.value = c.f;

                const start = t + idx * 0.16;
                gain.gain.setValueAtTime(0.08, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + c.d);

                osc.connect(gain);
                gain.connect(ac.destination);
                osc.start(start);
                osc.stop(start + c.d);
            });
        },

        // Sonido suave y breve de hojeo de papel para documentos y notas (~140ms, pasa-banda ~2000Hz)
        paperRustle: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            try {
                const duration = 0.14; // ~140ms
                const bufferSize = Math.max(1, Math.floor(ac.sampleRate * duration));
                const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
                }

                const noise = ac.createBufferSource();
                noise.buffer = buffer;

                const filter = ac.createBiquadFilter();
                filter.type = "bandpass";
                filter.frequency.value = 2000;
                filter.Q.value = 1.4;

                const gain = ac.createGain();
                const t = ac.currentTime;
                gain.gain.setValueAtTime(0.06, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ac.destination);

                noise.start(t);
                noise.stop(t + duration);
            } catch (e) {}
        },

        // Secuencia corta de clics mecánicos nítidos para terminales y computadoras (~18ms, pasa-altos ~2800Hz)
        keyboardClick: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;

            try {
                const t = ac.currentTime;
                const clicks = [0, 0.034, 0.072]; // 3 clics rápidos mecánicos
                clicks.forEach((offset) => {
                    const clickTime = t + offset;
                    const duration = 0.018; // ~18ms

                    const bufferSize = Math.max(1, Math.floor(ac.sampleRate * duration));
                    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
                    }

                    const noise = ac.createBufferSource();
                    noise.buffer = buffer;

                    const filter = ac.createBiquadFilter();
                    filter.type = "highpass";
                    filter.frequency.value = 2800;

                    const gain = ac.createGain();
                    gain.gain.setValueAtTime(0.04, clickTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, clickTime + duration);

                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(ac.destination);

                    noise.start(clickTime);
                    noise.stop(clickTime + duration);
                });
            } catch (e) {}
        },

        // Zumbido ambiental suave y de baja frecuencia para racks de servidores (Sala 2)
        startServerHum: function() {
            if (isMuted) return;
            const ac = getAudioContext();
            if (!ac) return;
            if (humActive) return;

            try {
                const t = ac.currentTime;
                humOsc1 = ac.createOscillator();
                humOsc2 = ac.createOscillator();
                humFilter = ac.createBiquadFilter();
                humGain = ac.createGain();

                humOsc1.type = "sine";
                humOsc1.frequency.setValueAtTime(60, t); // 60Hz

                humOsc2.type = "sine";
                humOsc2.frequency.setValueAtTime(120, t); // 120Hz (armónico)

                humFilter.type = "lowpass";
                humFilter.frequency.setValueAtTime(180, t); // Pasa-bajos ~180Hz

                humGain.gain.setValueAtTime(0.0001, t);
                humGain.gain.linearRampToValueAtTime(0.018, t + 0.3); // 300ms fade-in suave

                humOsc1.connect(humFilter);
                humOsc2.connect(humFilter);
                humFilter.connect(humGain);
                humGain.connect(ac.destination);

                humOsc1.start(t);
                humOsc2.start(t);
                humActive = true;
            } catch (e) {
                humActive = false;
            }
        },

        // Apagado suave con fade-out de 300ms del zumbido ambiental
        stopServerHum: function() {
            if (!humActive || !humGain) return;
            const ac = getAudioContext();
            if (!ac) return;

            try {
                const t = ac.currentTime;
                humGain.gain.cancelScheduledValues(t);
                humGain.gain.setValueAtTime(humGain.gain.value, t);
                humGain.gain.linearRampToValueAtTime(0.0001, t + 0.3); // 300ms fade-out

                const o1 = humOsc1;
                const o2 = humOsc2;
                const g = humGain;
                const f = humFilter;

                setTimeout(() => {
                    try {
                        if (o1) { o1.stop(); o1.disconnect(); }
                        if (o2) { o2.stop(); o2.disconnect(); }
                        if (f) f.disconnect();
                        if (g) g.disconnect();
                    } catch (e) {}
                }, 320);

                humOsc1 = null;
                humOsc2 = null;
                humFilter = null;
                humGain = null;
                humActive = false;
            } catch (e) {
                humActive = false;
            }
        },

        isHumActive: function() {
            return humActive;
        }
    };
})();
