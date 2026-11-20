window.Game = window.Game || {};

(function() {
    // variables del juego
    window.Game.State = {
        mode: "MENU",

        currentRoom: 1,
        startRoom: 1,
        readClues: new Set(),
        inspectedCluesByRoom: { 1: [], 2: [], 3: [], 4: [], 5: [] },
        noteTags: {},
        quizSolvedByRoom: {},
        doorCodeInput: "",
        notebookPreviousMode: "PLAYING",
        askedQuestionsByNpc: {},
        activeNPC: null,
        errors: 0,
        elapsedSeconds: 0,
        timerInterval: null,
        terminalStep: 1,

        world: {
            width: 1160,
            height: 740
        },

        viewport: {
            width: 840,
            height: 520
        },

        camera: {
            x: 0,
            y: 0
        },

        player: {
            x: 64,
            y: 350,
            size: 26,
            speed: 3.6,
            color: "#D99B26",
            facing: "down"
        },

        isMoving: false,
        walkTimer: 0,

        door: {
            x: 1124,
            y: 318,
            width: 28,
            height: 104,
            locked: true,
            color: "#C84B52"
        },

        keys: {},
        activeInteraction: null,
        toastTimeout: null,
        ambientParticles: [],

        updateCamera: function(lerp = 0.14) {
            const targetX = this.player.x + this.player.size / 2 - this.viewport.width / 2;
            const targetY = this.player.y + this.player.size / 2 - this.viewport.height / 2;

            const maxX = Math.max(0, this.world.width - this.viewport.width);
            const maxY = Math.max(0, this.world.height - this.viewport.height);

            const clampedX = Math.max(0, Math.min(maxX, targetX));
            const clampedY = Math.max(0, Math.min(maxY, targetY));

            this.camera.x += (clampedX - this.camera.x) * lerp;
            this.camera.y += (clampedY - this.camera.y) * lerp;
        },

        snapCamera: function() {
            const targetX = this.player.x + this.player.size / 2 - this.viewport.width / 2;
            const targetY = this.player.y + this.player.size / 2 - this.viewport.height / 2;

            const maxX = Math.max(0, this.world.width - this.viewport.width);
            const maxY = Math.max(0, this.world.height - this.viewport.height);

            this.camera.x = Math.max(0, Math.min(maxX, targetX));
            this.camera.y = Math.max(0, Math.min(maxY, targetY));
        },

        setMode: function(newMode) {
            const validModes = ["MENU", "PLAYING", "CLUE", "TERMINAL", "MANUAL", "TRANSITION", "VICTORY", "NOTEBOOK", "INTERVIEW"];
            if (!validModes.includes(newMode)) return;

            this.mode = newMode;

            if (newMode !== "PLAYING") {
                this.clearMovementState();
            }

            const terminalModal = document.getElementById("terminal-modal");
            const clueModal = document.getElementById("clue-modal");
            const manualModal = document.getElementById("manual-modal");
            const notebookModal = document.getElementById("notebook-modal");
            const interviewModal = document.getElementById("interview-modal");
            const startScreen = document.getElementById("start-screen");
            const victoryScreen = document.getElementById("victory-screen");

            if (terminalModal) terminalModal.style.display = newMode === "TERMINAL" ? "block" : "none";
            if (clueModal) clueModal.style.display = newMode === "CLUE" ? "block" : "none";
            if (manualModal) manualModal.style.display = newMode === "MANUAL" ? "block" : "none";
            if (notebookModal) notebookModal.style.display = newMode === "NOTEBOOK" ? "block" : "none";
            if (interviewModal) interviewModal.style.display = newMode === "INTERVIEW" ? "block" : "none";
            if (startScreen) startScreen.style.display = newMode === "MENU" ? "flex" : "none";
            if (victoryScreen) victoryScreen.style.display = newMode === "VICTORY" ? "flex" : "none";

            this.ensureTimerRunning();
        },

        isQuestionAsked: function(npcId, qIdx) {
            return !!(this.askedQuestionsByNpc[npcId] && this.askedQuestionsByNpc[npcId][qIdx]);
        },

        markQuestionAsked: function(npcId, qIdx) {
            if (!this.askedQuestionsByNpc[npcId]) {
                this.askedQuestionsByNpc[npcId] = {};
            }
            this.askedQuestionsByNpc[npcId][qIdx] = true;
        },

        allQuestionsAsked: function(npc) {
            if (!npc || !npc.questions) return false;
            const recorded = this.askedQuestionsByNpc[npc.id];
            if (!recorded) return false;
            return npc.questions.every((_, idx) => !!recorded[idx]);
        },

        recordInspectedClue: function(room, item) {
            if (!this.inspectedCluesByRoom[room]) {
                this.inspectedCluesByRoom[room] = [];
            }
            const list = this.inspectedCluesByRoom[room];
            const key = item.key || `${room}_${item.index}`;
            const exists = list.some((c) => c.key === key);
            if (!exists) {
                list.push({
                    key: key,
                    id: item.id || key,
                    title: item.title,
                    clueType: item.clueType || "document",
                    text: item.text || item.clue,
                    label: item.label,
                    isNoise: !!item.isNoise
                });
            }
        },

        setNoteTag: function(key, tag) {
            if (this.noteTags[key] === tag) {
                this.noteTags[key] = "none";
            } else {
                this.noteTags[key] = tag;
            }
        },

        clearMovementState: function() {
            this.isMoving = false;
            this.keys = {};
        },

        getTotalRooms: function() {
            return window.Game.PUZZLES ? Object.keys(window.Game.PUZZLES).length : 5;
        },

        getTotalCluesAllRooms: function() {
            if (!window.Game.ROOM_LAYOUTS) return 0;
            let total = 0;
            for (const key in window.Game.ROOM_LAYOUTS) {
                const layout = window.Game.ROOM_LAYOUTS[key];
                if (layout.desks) {
                    layout.desks.forEach((desk) => {
                        if (!desk.isNoise) total++;
                    });
                }
                const props = (layout.props || []).concat(layout.decor || []);
                props.forEach((prop) => {
                    if (prop.clue && !prop.isNoise) total++;
                });
            }
            return total;
        },

        getTotalCluesCurrentRoom: function() {
            if (!window.Game.ROOM_LAYOUTS || !window.Game.ROOM_LAYOUTS[this.currentRoom]) return 0;
            const layout = window.Game.ROOM_LAYOUTS[this.currentRoom];
            let total = 0;
            if (layout.desks) {
                layout.desks.forEach((desk) => {
                    if (!desk.isNoise) total++;
                });
            }
            const props = (layout.props || []).concat(layout.decor || []);
            props.forEach((prop) => {
                if (prop.clue && !prop.isNoise) total++;
            });
            return total;
        },

        getReadCluesCurrentRoom: function() {
            if (!window.Game.ROOM_LAYOUTS || !window.Game.ROOM_LAYOUTS[this.currentRoom]) return 0;
            const layout = window.Game.ROOM_LAYOUTS[this.currentRoom];
            let count = 0;
            if (layout.desks) {
                layout.desks.forEach((desk, idx) => {
                    if (!desk.isNoise) {
                        const key = `${this.currentRoom}_desk_${idx}`;
                        if (this.readClues.has(key) || this.readClues.has(`${this.currentRoom}_${idx}`)) {
                            count++;
                        }
                    }
                });
            }
            const props = (layout.props || []).concat(layout.decor || []);
            props.forEach((prop, idx) => {
                if (prop.clue && !prop.isNoise) {
                    const key = prop.id || `${this.currentRoom}_prop_${idx}`;
                    if (this.readClues.has(key)) count++;
                }
            });
            return count;
        },

        formatTime: function(totalSeconds) {
            const mins = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
            const secs = (totalSeconds % 60).toString().padStart(2, "0");
            return `${mins}:${secs}`;
        },

        ensureTimerRunning: function() {
            if (this.mode !== "MENU" && this.mode !== "VICTORY") {
                if (!this.timerInterval) {
                    this.timerInterval = setInterval(() => {
                        if (this.mode !== "MENU" && this.mode !== "VICTORY") {
                            this.elapsedSeconds++;
                            const timerEl = document.getElementById("timer-display");
                            if (timerEl) timerEl.innerText = this.formatTime(this.elapsedSeconds);
                        }
                    }, 1000);
                }
            }
        },

        updateHUD: function() {
            const roomNumEl = document.getElementById("room-num");
            const roomNameEl = document.getElementById("room-name-display");
            const cluesCounterEl = document.getElementById("clues-counter");
            const timerEl = document.getElementById("timer-display");
            const errorsEl = document.getElementById("errors-counter");

            if (roomNumEl) roomNumEl.innerText = `${this.currentRoom} / ${this.getTotalRooms()}`;
            if (roomNameEl && window.Game.ROOM_NAMES) {
                roomNameEl.innerText = window.Game.ROOM_NAMES[this.currentRoom] || "ÁREA PERICIAL";
            }
            if (cluesCounterEl) {
                cluesCounterEl.innerText = `${this.getReadCluesCurrentRoom()} / ${this.getTotalCluesCurrentRoom()}`;
            }
            if (timerEl) {
                timerEl.innerText = this.formatTime(this.elapsedSeconds);
            }
            if (errorsEl) {
                errorsEl.innerText = this.errors;
            }

            const btnAudio = document.getElementById("btn-audio");
            if (btnAudio && window.Game.Audio) {
                const muted = window.Game.Audio.isMuted();
                btnAudio.innerHTML = muted 
                    ? `<span id="audio-btn-label">Audio: OFF</span>` 
                    : `<span id="audio-btn-label">Audio: ON</span>`;
                btnAudio.classList.toggle("muted", muted);
            }
        },

        showTacticalToast: function(msg) {
            const toast = document.getElementById("tactical-toast");
            const msgEl = document.getElementById("toast-message");
            if (!toast || !msgEl) return;

            msgEl.innerText = msg;
            toast.classList.add("visible");
            clearTimeout(this.toastTimeout);
            this.toastTimeout = setTimeout(() => {
                toast.classList.remove("visible");
            }, 3200);
        },

        initAmbientParticles: function(worldWidth = 1160, worldHeight = 740, count = 35) {
            this.ambientParticles = [];
            for (let i = 0; i < count; i++) {
                this.ambientParticles.push({
                    x: Math.random() * (worldWidth - 60) + 30,
                    y: Math.random() * (worldHeight - 60) + 30,
                    vx: (Math.random() - 0.5) * 0.22,
                    vy: -0.1 - Math.random() * 0.18,
                    size: 1 + Math.random() * 1.5,
                    baseAlpha: 0.12 + Math.random() * 0.25,
                    pulseSeed: Math.random() * Math.PI * 2
                });
            }
        },

        updateAmbientParticles: function(worldWidth = 1160, worldHeight = 740) {
            const minX = 26, maxX = worldWidth - 26;
            const minY = 26, maxY = worldHeight - 26;

            for (let i = 0; i < this.ambientParticles.length; i++) {
                const p = this.ambientParticles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.y < minY) {
                    p.y = maxY;
                    p.x = Math.random() * (maxX - minX) + minX;
                }
                if (p.x < minX) p.x = maxX;
                if (p.x > maxX) p.x = minX;
            }
        },

        resetMission: function(targetRoom = 1) {
            let r = Number(targetRoom);
            if (r < 1) r = r + 1;
            if (r > 5) r = 5;

            this.currentRoom = r;
            this.startRoom = r;
            this.readClues.clear();
            this.inspectedCluesByRoom = { 1: [], 2: [], 3: [], 4: [], 5: [] };
            this.noteTags = {};
            this.quizSolvedByRoom = {};
            this.doorCodeInput = "";
            this.notebookPreviousMode = "PLAYING";
            this.askedQuestionsByNpc = {};
            this.activeNPC = null;
            this.errors = 0;
            this.elapsedSeconds = 0;
            this.terminalStep = 1;

            this.player.x = 64;
            this.player.y = 350;
            this.player.facing = "down";

            this.door.x = 1124;
            this.door.y = 318;
            this.door.width = 28;
            this.door.height = 104;
            this.door.locked = true;
            this.door.color = "#C84B52";

            this.snapCamera();
            this.setMode("PLAYING");
            this.updateHUD();
            this.showTacticalToast("Expediente reiniciado: Sala " + r);
        }
    };
})();
