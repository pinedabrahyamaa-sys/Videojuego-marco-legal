window.Game = window.Game || {};

(function() {
    // Motor de audio sintetizado con Web Audio API (sin archivos externos)
    let ctx = null;
    let isMuted = false;
    let lastStepTime = 0;

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
            return isMuted;
        },

        // =====================================================================
        // EFECTOS DE SONIDO SINTETIZADOS SUTILES Y SOBRIOS
        // =====================================================================

        // Pisada sutil al caminar (con cooldown de ~280ms)
        step: function() {
            if (isMuted) return;
            const now = Date.now();
            if (now - lastStepTime < 280) return;
            lastStepTime = now;

            const ac = getAudioContext();
            if (!ac) return;

            const osc = ac.createOscillator();
            const gain = ac.createGain();
            const filter = ac.createBiquadFilter();

            const t = ac.currentTime;
            // Tono grave variable
            const freq = 65 + (Math.random() - 0.5) * 14;
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, t);
            osc.frequency.exponentialRampToValueAtTime(35, t + 0.08);

            // Filtro pasa-bajos para sonido mate amortiguado
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(180, t);

            gain.gain.setValueAtTime(0.06, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ac.destination);

            osc.start(t);
            osc.stop(t + 0.08);
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
        }
    };
})();
