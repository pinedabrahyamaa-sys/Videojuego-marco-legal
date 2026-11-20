window.Game = window.Game || {};

(function() {

    const State = window.Game.State;
    const Renderer = window.Game.Renderer;
    const Audio = window.Game.Audio;

    let canvas, ctx;

    // movimiento y choques con paredes
    function getRoomObstacles() {
        const layout = window.Game.ROOM_LAYOUTS[State.currentRoom];
        const obstacles = [];
        if (!layout) return obstacles;

        if (layout.desks) {
            layout.desks.forEach((desk) => {
                obstacles.push({ x: desk.x, y: desk.y, width: desk.width, height: 58 });
                obstacles.push({
                    x: desk.x + Math.floor(desk.width / 2) - 9,
                    y: desk.y + 61,
                    width: 20,
                    height: 22
                });
            });
        }

        if (layout.racks) {
            layout.racks.forEach((rack) => {
                obstacles.push({ x: rack.x, y: rack.y, width: 56, height: 106 });
            });
        }

        if (layout.plants) {
            layout.plants.forEach((plant) => {
                obstacles.push({ x: plant.x + 5, y: plant.y, width: 24, height: 28 });
            });
        }

        if (layout.walls) {
            layout.walls.forEach((wall) => {
                obstacles.push({ x: wall.x, y: wall.y, width: wall.width, height: wall.height });
            });
        }

        const decorList = (layout.decor || []).concat(layout.props || []);
        decorList.forEach((dec) => {
            obstacles.push({ x: dec.x, y: dec.y, width: dec.width, height: dec.height });
        });

        if (layout.npcs) {
            layout.npcs.forEach((npc) => {
                obstacles.push({ x: npc.x, y: npc.y, width: 26, height: 26 });
            });
        }

        if (State.door.locked) {
            obstacles.push({
                x: State.door.x,
                y: State.door.y,
                width: State.door.width,
                height: State.door.height
            });
        }

        return obstacles;
    }

    function getRoomInteractables() {
        const layout = window.Game.ROOM_LAYOUTS[State.currentRoom];
        if (!layout) return [];

        const items = [];

        if (layout.desks) {
            layout.desks.forEach((desk, idx) => {
                const key = `${State.currentRoom}_desk_${idx}`;
                const isDoc = desk.clueType === "document";
                items.push({
                    kind: desk.isNoise ? "noise" : "clue",
                    key: key,
                    id: desk.id || key,
                    isNoise: !!desk.isNoise,
                    index: idx,
                    sourceType: "desk",
                    title: desk.title || (isDoc ? "Expediente: " + desk.label : "Estación de trabajo: " + desk.label),
                    text: desk.clue,
                    clueType: desk.clueType || (isDoc ? "document" : "computer"),
                    x: isDoc ? desk.x + desk.width - 33 : desk.x + Math.floor(desk.width / 2) - 25,
                    y: desk.y + 35,
                    width: isDoc ? 14 : 50,
                    height: isDoc ? 13 : 14,
                    range: 62
                });
            });
        }

        const decorList = (layout.decor || []).concat(layout.props || []);
        decorList.forEach((dec, idx) => {
            if (dec.clue) {
                const key = dec.id || `${State.currentRoom}_prop_${idx}`;
                items.push({
                    kind: dec.isNoise ? "noise" : "clue",
                    key: key,
                    id: key,
                    isNoise: !!dec.isNoise,
                    index: idx,
                    sourceType: "prop",
                    prop: dec,
                    title: dec.title || (dec.label ? `${dec.label}` : "Elemento Pericial"),
                    text: dec.clue,
                    clueType: dec.clueType || "document",
                    x: dec.x,
                    y: dec.y,
                    width: dec.width,
                    height: dec.height,
                    range: 65
                });
            }
        });

        if (layout.npcs) {
            layout.npcs.forEach((npc) => {
                items.push({
                    kind: "npc",
                    key: "npc_" + npc.id,
                    id: npc.id,
                    data: npc,
                    title: npc.name,
                    x: npc.x,
                    y: npc.y,
                    width: 26,
                    height: 26,
                    range: 64
                });
            });
        }

        if (State.door.locked) {
            items.push({
                kind: "puzzle",
                key: "terminal_puzzle",
                title: "Terminal de control pericial",
                x: State.door.x - 10,
                y: State.door.y,
                width: State.door.width + 10,
                height: State.door.height,
                range: 42
            });
        }

        return items;
    }

    function distanceToInteractable(item) {
        const centerX = State.player.x + State.player.size / 2;
        const centerY = State.player.y + State.player.size / 2;
        const nearestX = Math.max(item.x, Math.min(centerX, item.x + item.width));
        const nearestY = Math.max(item.y, Math.min(centerY, item.y + item.height));
        return Math.hypot(centerX - nearestX, centerY - nearestY);
    }

    function findNearestInteraction() {
        let nearest = null;
        let nearestDistance = Infinity;

        getRoomInteractables().forEach((item) => {
            const distance = distanceToInteractable(item);
            if (distance <= item.range && distance < nearestDistance) {
                nearest = item;
                nearestDistance = distance;
            }
        });

        return nearest;
    }

    function overlapsObstacle(x, y, obstacle) {
        return x < obstacle.x + obstacle.width &&
            x + State.player.size > obstacle.x &&
            y < obstacle.y + obstacle.height &&
            y + State.player.size > obstacle.y;
    }

    function canMoveTo(x, y) {
        const worldW = State.world.width;
        const worldH = State.world.height;

        if (x < 20 || x > worldW - 20 - State.player.size ||
            y < 22 || y > worldH - 22 - State.player.size) {
            return false;
        }
        return !getRoomObstacles().some((obstacle) => overlapsObstacle(x, y, obstacle));
    }

    function updateInteractionHint() {
        const hint = document.getElementById("interaction-hint");
        if (!hint) return;

        if (State.activeInteraction) {
            const item = State.activeInteraction;
            if (item.kind === "puzzle") {
                hint.innerHTML = `Pulsa <b>[E]</b> para validar en terminal: <span style="color:#3FA37C">${item.title}</span>`;
            } else if (item.kind === "npc") {
                hint.innerHTML = `Pulsa <b>[E]</b> para entrevistar a: <span style="color:#38BDF8">${item.title}</span>`;
            } else {
                const isRead = State.readClues.has(item.key) || State.readClues.has(`${State.currentRoom}_${item.index}`);
                const statusTag = isRead
                    ? ` <span style="color:#94A3B8">[Inspeccionado]</span>`
                    : ``;
                hint.innerHTML = `Pulsa <b>[E]</b> para examinar: <span style="color:#D99B26">${item.title}</span>${statusTag}`;
            }
        } else {
            hint.innerHTML = `Diligencia activa: usa <b>W A S D</b> para desplazarte. [E] examinar. [M] Manual. [N] Audio. [F] Pantalla.`;
        }
    }

    function update() {
        if (State.mode !== "PLAYING") return;

        let moveX = 0;
        let moveY = 0;

        if (State.keys["w"] || State.keys["arrowup"]) {
            moveY -= State.player.speed;
            State.player.facing = "up";
        }
        if (State.keys["s"] || State.keys["arrowdown"]) {
            moveY += State.player.speed;
            State.player.facing = "down";
        }
        if (State.keys["a"] || State.keys["arrowleft"]) {
            moveX -= State.player.speed;
            State.player.facing = "left";
        }
        if (State.keys["d"] || State.keys["arrowright"]) {
            moveX += State.player.speed;
            State.player.facing = "right";
        }

        let moved = false;
        if (moveX !== 0 && canMoveTo(State.player.x + moveX, State.player.y)) {
            State.player.x += moveX;
            moved = true;
        }
        if (moveY !== 0 && canMoveTo(State.player.x, State.player.y + moveY)) {
            State.player.y += moveY;
            moved = true;
        }

        if (moved) {
            State.isMoving = true;
            State.walkTimer += 0.22;
            if (Audio && State.mode === "PLAYING") {
                try {
                    Audio.step();
                } catch (e) {

                }
            }
        } else {
            State.isMoving = false;
        }

        State.updateCamera(0.14);

        if (!State.door.locked) {
            if (State.player.x + State.player.size >= State.door.x &&
                State.player.y + State.player.size >= State.door.y &&
                State.player.y <= State.door.y + State.door.height + 6) {
                triggerRoomTransition();
                return;
            }
        }

        State.updateAmbientParticles(State.world.width, State.world.height);
        State.activeInteraction = findNearestInteraction();
        updateInteractionHint();
    }

    function playRoomTransition(roomNumber, onReady) {
        State.setMode("TRANSITION");
        State.keys = {};

        const overlay = document.getElementById("room-transition-overlay");
        const titleEl = document.getElementById("room-trans-title");
        const subEl = document.getElementById("room-trans-sub");

        const roomName = (window.Game.ROOM_NAMES && window.Game.ROOM_NAMES[roomNumber]) || "Área pericial";
        if (titleEl) {
            titleEl.innerText = `Sala ${roomNumber} - ${roomName}`;
        }
        if (subEl) {
            subEl.innerText = "Preservando cadena de custodia digital (G.O. N.° 37.313)";
        }

        if (overlay) {
            overlay.style.display = "flex";
            void overlay.offsetWidth;
            overlay.classList.add("active");
        }

        setTimeout(() => {
            if (onReady) onReady();

            setTimeout(() => {
                if (overlay) {
                    overlay.classList.remove("active");
                    setTimeout(() => {
                        overlay.style.display = "none";
                        State.keys = {};
                        State.setMode("PLAYING");
                    }, 350);
                } else {
                    State.keys = {};
                    State.setMode("PLAYING");
                }
            }, 1000);
        }, 350);
    }

    function triggerRoomTransition() {
        State.setMode("TRANSITION");
        State.keys = {};

        const totalRooms = State.getTotalRooms();

        if (State.currentRoom < totalRooms) {
            const nextRoom = State.currentRoom + 1;
            if (Audio) Audio.transition();

            playRoomTransition(nextRoom, () => {
                State.currentRoom = nextRoom;
                State.player.x = 64;
                State.player.y = 350;
                State.player.facing = "down";
                State.door.locked = true;
                State.door.color = "#C84B52";
                State.snapCamera();
                State.updateHUD();

                if (Audio) {
                    if (State.currentRoom === 2) {
                        Audio.startServerHum();
                    } else {
                        Audio.stopServerHum();
                    }
                }

                const sectorName = window.Game.ROOM_NAMES[State.currentRoom] || "";
                State.showTacticalToast("SECCIÓN " + State.currentRoom + ": " + sectorName);
            });
        } else {

            const overlay = document.getElementById("transition-overlay");
            const statusText = document.getElementById("transition-status-text");
            if (statusText) statusText.innerText = "CONSOLIDANDO DICTAMEN PERICIAL FINAL...";
            if (overlay) overlay.classList.add("active");

            setTimeout(() => {
                if (overlay) overlay.classList.remove("active");
                if (Audio) Audio.stopServerHum();
                renderVictoryScreen();
                State.setMode("VICTORY");
                if (Audio) Audio.victory();
            }, 650);
        }
    }

    // terminal, preguntas y codigo
    function openTerminal() {
        const stampWrap = document.getElementById("terminal-stamp");
        if (stampWrap) stampWrap.style.display = "none";

        const roomLayout = window.Game.ROOM_LAYOUTS && window.Game.ROOM_LAYOUTS[State.currentRoom];
        const hasDoorCode = roomLayout && !!roomLayout.doorCode;

        if (State.quizSolvedByRoom[State.currentRoom] && hasDoorCode) {
            State.terminalStep = 3;
            State.setMode("TERMINAL");
            if (Audio) Audio.computer();
            renderTerminalStep3();
            return;
        }

        State.terminalStep = 1;
        State.setMode("TERMINAL");
        if (Audio) Audio.computer();
        renderTerminalStep();
    }

    function renderTerminalStep() {
        const puzzle = window.Game.PUZZLES[State.currentRoom];
        if (!puzzle) return;

        const qTitleEl = document.getElementById("q-title");
        const qSummaryEl = document.getElementById("q-summary");
        const qTextEl = document.getElementById("q-text");
        const errorEl = document.getElementById("terminal-error");
        const optionsContainer = document.getElementById("q-options");
        const verdictContainer = document.getElementById("terminal-verdict");
        const keypadContainer = document.getElementById("terminal-keypad");
        const stepBadgeEl = document.getElementById("terminal-step-badge");

        if (qTitleEl) qTitleEl.innerText = puzzle.title;
        if (qSummaryEl) qSummaryEl.innerText = puzzle.summary;

        if (errorEl) {
            errorEl.style.display = "none";
            errorEl.innerText = "";
        }

        if (verdictContainer) {
            verdictContainer.style.display = "none";
            verdictContainer.innerHTML = "";
        }

        if (keypadContainer) {
            keypadContainer.style.display = "none";
        }

        if (optionsContainer) {
            optionsContainer.style.display = "block";
            optionsContainer.innerHTML = "";
        }

        const stepData = State.terminalStep === 1 ? puzzle.step1 : puzzle.step2;

        if (stepBadgeEl) {
            stepBadgeEl.innerText = State.terminalStep === 1
                ? "PASO 1 DE 2: TIPIFICACIÓN DEL DELITO"
                : "PASO 2 DE 2: AGRAVANTES, ACCESORIAS Y CONSECUENCIAS";
            stepBadgeEl.className = State.terminalStep === 1 ? "step-badge step-1" : "step-badge step-2";
        }

        if (qTextEl) {
            qTextEl.style.display = "block";
            qTextEl.innerText = stepData.prompt;
        }

        const shuffled = [...stepData.options].sort(() => Math.random() - 0.5);
        const letters = ["A", "B", "C", "D"];

        shuffled.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "option-btn";
            btn.type = "button";
            btn.innerHTML = `<span class="opt-letter">${letters[idx]})</span> <span class="opt-text">${opt.text}</span>`;
            btn.onclick = () => handleTerminalAnswer(opt, puzzle);
            optionsContainer.appendChild(btn);
        });
    }

    function handleTerminalAnswer(option, puzzle) {
        const errorEl = document.getElementById("terminal-error");
        const modal = document.getElementById("terminal-modal");

        if (option.correct) {
            if (errorEl) errorEl.style.display = "none";

            if (State.terminalStep === 1) {
                if (Audio) Audio.stepSuccess();
                State.terminalStep = 2;
                renderTerminalStep();
            } else {

                State.quizSolvedByRoom[State.currentRoom] = true;
                const roomLayout = window.Game.ROOM_LAYOUTS && window.Game.ROOM_LAYOUTS[State.currentRoom];
                const hasDoorCode = roomLayout && !!roomLayout.doorCode;

                if (Audio) Audio.stepSuccess();

                const stampWrap = document.getElementById("terminal-stamp");
                if (stampWrap) {
                    stampWrap.style.display = "block";
                    const stampInner = stampWrap.querySelector(".terminal-stamp");
                    if (stampInner) {
                        stampInner.classList.remove("stamp-animate");
                        void stampInner.offsetWidth;
                        stampInner.classList.add("stamp-animate");
                    }
                }

                setTimeout(() => {
                    if (stampWrap) stampWrap.style.display = "none";

                    if (hasDoorCode) {
                        State.terminalStep = 3;
                        renderTerminalStep3();
                    } else {
                        renderTerminalVerdict(puzzle);
                    }
                }, 850);
            }
        } else {
            State.errors++;
            State.updateHUD();
            if (Audio) Audio.error();

            if (errorEl) {
                const feedbackText = option.fiscalFeedback || option.feedback || "Revise las definiciones y tipos en el Manual Legal [M].";
                errorEl.innerHTML = `
                    <div style="font-family:'Consolas', 'Courier New', monospace; font-weight:700; color:#F87171; margin-bottom:5px; font-size:11px; letter-spacing:0.5px;">
                        Observación de Fiscalía: calificación no conforme
                    </div>
                    <div style="font-size:12px; line-height:1.5;">${feedbackText}</div>
                `;
                errorEl.style.display = "block";
            }

            if (modal) {
                modal.classList.remove("shake");
                void modal.offsetWidth;
                modal.classList.add("shake");
            }
        }
    }

    function renderTerminalStep3() {
        const puzzle = window.Game.PUZZLES[State.currentRoom];
        const qTitleEl = document.getElementById("q-title");
        const qSummaryEl = document.getElementById("q-summary");
        const qTextEl = document.getElementById("q-text");
        const errorEl = document.getElementById("terminal-error");
        const optionsContainer = document.getElementById("q-options");
        const verdictContainer = document.getElementById("terminal-verdict");
        const stepBadgeEl = document.getElementById("terminal-step-badge");
        const keypadContainer = document.getElementById("terminal-keypad");
        const feedbackEl = document.getElementById("keypad-feedback");

        if (qTitleEl) qTitleEl.innerText = puzzle ? puzzle.title : "CONTROL PERICIAL";
        if (qSummaryEl) qSummaryEl.innerText = "Cerradura técnica de anulación del sector pericial.";

        if (stepBadgeEl) {
            stepBadgeEl.innerText = "PASO 3: CÓDIGO DE SEGURIDAD DE PUERTA";
            stepBadgeEl.className = "step-badge step-keypad";
        }

        if (errorEl) {
            errorEl.style.display = "none";
            errorEl.innerText = "";
        }
        if (qTextEl) qTextEl.style.display = "none";
        if (optionsContainer) optionsContainer.style.display = "none";
        if (verdictContainer) verdictContainer.style.display = "none";

        if (keypadContainer) {
            keypadContainer.style.display = "block";
        }

        if (feedbackEl) {
            feedbackEl.innerText = "";
            feedbackEl.className = "keypad-feedback";
        }

        updateKeypadDisplay();
    }

    function updateKeypadDisplay() {
        const input = State.doorCodeInput || "";
        for (let i = 0; i < 4; i++) {
            const digitEl = document.getElementById(`digit-${i}`);
            if (digitEl) {
                if (i < input.length) {
                    digitEl.innerText = input[i];
                    digitEl.classList.add("filled");
                } else {
                    digitEl.innerText = "—";
                    digitEl.classList.remove("filled");
                }
            }
        }
    }

    function handleKeypadInput(val) {
        if (State.doorCodeInput.length < 4) {
            State.doorCodeInput += val;
            if (Audio) Audio.uiClick();
            updateKeypadDisplay();
        }
    }

    function handleKeypadBackspace() {
        if (State.doorCodeInput.length > 0) {
            State.doorCodeInput = State.doorCodeInput.slice(0, -1);
            if (Audio) Audio.uiClick();
            updateKeypadDisplay();
        }
    }

    function validateDoorCode() {
        const roomLayout = window.Game.ROOM_LAYOUTS && window.Game.ROOM_LAYOUTS[State.currentRoom];
        const expected = roomLayout ? String(roomLayout.doorCode || "") : "";
        const feedbackEl = document.getElementById("keypad-feedback");

        if (State.doorCodeInput.length < 4) {
            if (feedbackEl) {
                feedbackEl.innerText = "Ingrese los 4 dígitos del código de seguridad.";
                feedbackEl.className = "keypad-feedback warn";
            }
            if (Audio) Audio.error();
            return;
        }

        if (State.doorCodeInput === expected) {
            if (Audio) Audio.doorUnlock();
            State.door.locked = false;
            State.door.color = "#3FA37C";
            if (feedbackEl) {
                feedbackEl.innerText = "Código correcto - Acceso desbloqueado";
                feedbackEl.className = "keypad-feedback success";
            }
            State.showTacticalToast("Código correcto. Acceso desbloqueado. Dirígete a la salida.");
            setTimeout(() => {
                State.setMode("PLAYING");
                State.doorCodeInput = "";
                updateInteractionHint();
            }, 650);
        } else {
            if (Audio) Audio.error();

            if (feedbackEl) {
                feedbackEl.innerText = "Código incorrecto. Verifique sus notas o archivos antiguos.";
                feedbackEl.className = "keypad-feedback error";
            }
            const keypadContainer = document.getElementById("terminal-keypad");
            if (keypadContainer) {
                keypadContainer.classList.remove("shake");
                void keypadContainer.offsetWidth;
                keypadContainer.classList.add("shake");
            }
            State.doorCodeInput = "";
            updateKeypadDisplay();
        }
    }

    function renderTerminalVerdict(puzzle) {
        const qTextEl = document.getElementById("q-text");
        const optionsContainer = document.getElementById("q-options");
        const verdictContainer = document.getElementById("terminal-verdict");
        const keypadContainer = document.getElementById("terminal-keypad");
        const stepBadgeEl = document.getElementById("terminal-step-badge");

        if (stepBadgeEl) {
            stepBadgeEl.innerText = "Dictamen pericial validado";
            stepBadgeEl.className = "step-badge step-complete";
        }

        if (qTextEl) qTextEl.style.display = "none";
        if (optionsContainer) optionsContainer.style.display = "none";
        if (keypadContainer) keypadContainer.style.display = "none";

        if (verdictContainer) {
            verdictContainer.style.display = "block";
            verdictContainer.innerHTML = `
                <div class="verdict-box">
                    <div class="verdict-header">
                        <b>Dictamen pericial homologado</b>
                    </div>
                    <p class="verdict-text">${puzzle.verdict}</p>
                    <div class="verdict-details">
                        <span><b>Delito:</b> ${puzzle.report.crime}</span>
                        <span><b>Normativa:</b> ${puzzle.report.articles}</span>
                    </div>
                    <button id="btn-unlock-door" class="cyber-btn" type="button">Confirmar y continuar</button>
                </div>
            `;

            document.getElementById("btn-unlock-door").onclick = () => {
                if (Audio) Audio.doorUnlock();
                State.door.locked = false;
                State.door.color = "#3FA37C";
                State.setMode("PLAYING");
                State.showTacticalToast("¡DICTAMEN CONFORME! PASO HABILITADO. DIRÍGETE A LA SALIDA.");
            };
        }
    }

    function openClue(item) {
        const clueModal = document.getElementById("clue-modal");
        const clueTitleEl = document.getElementById("clue-title");
        const clueTextEl = document.getElementById("clue-text");

        if (clueModal) {
            clueModal.classList.remove("clue-document", "clue-computer", "clue-old-note");
            if (item.clueType === "oldNote") {
                clueModal.classList.add("clue-old-note");
            } else if (item.clueType === "document") {
                clueModal.classList.add("clue-document");
            } else {
                clueModal.classList.add("clue-computer");
            }
        }

        if (clueTitleEl) clueTitleEl.innerText = item.title;
        if (clueTextEl) clueTextEl.innerText = item.text;

        const clueBadgeLabel = document.getElementById("clue-badge-label");
        if (clueBadgeLabel) {
            if (item.clueType === "oldNote") {
                clueBadgeLabel.innerText = "Nota archivada";
                clueBadgeLabel.style.color = "#5C4738";
                clueBadgeLabel.style.borderColor = "#B89F70";
            } else {
                clueBadgeLabel.innerText = "Registro inspeccionado";
                clueBadgeLabel.style.color = "#D99B26";
                clueBadgeLabel.style.borderColor = "rgba(217, 155, 38, 0.4)";
            }
        }

        State.setMode("CLUE");

        if (Audio) {
            if (item.clueType === "computer") {
                Audio.keyboardClick();
            } else {
                Audio.paperRustle();
            }
        }
    }

    function closeClue() {
        if (Audio) Audio.uiClick();
        State.setMode("PLAYING");
        State.activeInteraction = findNearestInteraction();
        updateInteractionHint();
    }

    // libreta de pistas
    function openNotebook() {
        if (Audio) Audio.paper();
        State.notebookPreviousMode = State.mode;
        State.setMode("NOTEBOOK");
        renderNotebook();
    }

    function closeNotebook() {
        if (Audio) Audio.uiClick();
        if (State.notebookPreviousMode === "TERMINAL") {
            State.setMode("TERMINAL");
        } else {
            State.setMode("PLAYING");
        }
        updateInteractionHint();
    }

    function renderNotebook() {
        const roomInfoEl = document.getElementById("notebook-room-info");
        const listEl = document.getElementById("notebook-list");
        if (!listEl) return;

        if (roomInfoEl) {
            const roomName = (window.Game.ROOM_NAMES && window.Game.ROOM_NAMES[State.currentRoom]) || "ÁREA ACTUAL";
            roomInfoEl.innerText = `SECCIÓN ${State.currentRoom}: ${roomName}`;
        }

        const clues = (State.inspectedCluesByRoom && State.inspectedCluesByRoom[State.currentRoom]) || [];

        if (clues.length === 0) {
            listEl.innerHTML = `
                <div class="notebook-empty">
                    No se han inspeccionado registros en esta sección todavía.<br><br>
                    Explora los puestos de trabajo, archivadores y notas pulsando <b>[E]</b> para incorporarlos a tu bitácora.
                </div>
            `;
            return;
        }

        listEl.innerHTML = "";

        clues.forEach((clue) => {
            const card = document.createElement("div");
            const currentTag = State.noteTags[clue.key] || "none";
            const tagClass = currentTag === "relevant" ? " is-relevant" : (currentTag === "discarded" ? " is-discarded" : "");
            card.className = `notebook-card${tagClass}`;

            let typeLabel = "DOCUMENTO";
            if (clue.clueType === "oldNote") typeLabel = "Nota archivada";
            else if (clue.clueType === "computer") typeLabel = "Sistema digital";
            else if (clue.clueType === "document") typeLabel = "Documento";

            card.innerHTML = `
                <div class="nb-card-header">
                    <span class="nb-card-title">${clue.title}</span>
                    <span class="nb-card-type">${typeLabel}</span>
                </div>
                <div class="nb-card-text">${clue.text}</div>
                <div class="nb-card-actions">
                    <button class="nb-tag-btn tag-btn-rel${currentTag === 'relevant' ? ' active' : ''}" type="button">
                        Relevante
                    </button>
                    <button class="nb-tag-btn tag-btn-disc${currentTag === 'discarded' ? ' active' : ''}" type="button">
                        Descartado
                    </button>
                </div>
            `;

            const btnRel = card.querySelector(".tag-btn-rel");
            const btnDisc = card.querySelector(".tag-btn-disc");

            btnRel.onclick = () => {
                if (Audio) Audio.uiClick();
                State.setNoteTag(clue.key, "relevant");
                renderNotebook();
            };

            btnDisc.onclick = () => {
                if (Audio) Audio.uiClick();
                State.setNoteTag(clue.key, "discarded");
                renderNotebook();
            };

            listEl.appendChild(card);
        });
    }

    let currentManualTab = "definitions";

    // manual y pantalla final
    function toggleManual() {
        if (Audio) Audio.uiClick();

        if (State.mode === "MANUAL") {
            State.setMode("PLAYING");
        } else if (State.mode === "PLAYING") {
            State.setMode("MANUAL");
            renderManual();
        }
    }

    function renderManual(filterQuery = "") {
        const contentContainer = document.getElementById("manual-content");
        if (!contentContainer || !window.Game.GLOSSARY) return;

        const query = filterQuery.toLowerCase().trim();
        const items = currentManualTab === "definitions"
            ? window.Game.GLOSSARY.definitions
            : window.Game.GLOSSARY.rules;

        const filtered = items.filter((item) => {
            return item.term.toLowerCase().includes(query) ||
                item.def.toLowerCase().includes(query) ||
                item.art.toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
            contentContainer.innerHTML = `<div class="manual-empty">No se encontraron artículos o términos con el criterio: "${filterQuery}"</div>`;
            return;
        }

        contentContainer.innerHTML = filtered.map((item) => `
            <div class="manual-entry">
                <div class="manual-entry-header">
                    <span class="manual-term">${item.term}</span>
                    <span class="manual-art">${item.art}</span>
                </div>
                <p class="manual-def">${item.def}</p>
            </div>
        `).join("");
    }

    function renderVictoryScreen() {
        if (Audio) Audio.stopServerHum();

        const timeEl = document.getElementById("victory-time");
        const cluesEl = document.getElementById("victory-clues");
        const errorsEl = document.getElementById("victory-errors");
        const dateEl = document.getElementById("victory-date");
        const tableContainer = document.getElementById("victory-table-container");

        if (timeEl) timeEl.innerText = State.formatTime(State.elapsedSeconds);
        if (cluesEl) cluesEl.innerText = `${State.readClues.size} / ${State.getTotalCluesAllRooms()}`;
        if (errorsEl) errorsEl.innerText = State.errors;

        if (dateEl) {
            const now = new Date();
            dateEl.innerText = now.toLocaleString("es-VE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }

        if (tableContainer && window.Game.PUZZLES) {
            let evalTitle = "";
            let evalClass = "";
            let evalBadge = "";
            let evalDesc = "";

            if (State.errors <= 1) {
                evalTitle = "Dictamen aprobado";
                evalClass = "eval-excellent";
                evalBadge = "[Conforme]";
                evalDesc = "El Ministerio Público homologó la totalidad de las calificaciones jurídicas en primera instancia, reconociendo rigurosidad probatoria y apego irrestricto a la Gaceta Oficial N.° 37.313.";
            } else if (State.errors <= 4) {
                evalTitle = "Aprobado con observaciones";
                evalClass = "eval-approved";
                evalBadge = "[Observado]";
                evalDesc = "La Fiscalía admitió las tipificaciones tras subsanar observaciones técnicas puntuales durante la instrucción del expediente.";
            } else {
                evalTitle = "Devuelto por Fiscalía";
                evalClass = "eval-rejected";
                evalBadge = "[Revisión]";
                evalDesc = "El fiscal de la causa ordenó reabrir la investigación debido a discrepancias en la tipificación penal y concurso de agravantes.";
            }

            const evalHtml = `
                <div class="fiscal-evaluation-seal ${evalClass}">
                    <div class="eval-icon-badge">${evalBadge}</div>
                    <div class="eval-content-block">
                        <div class="eval-seal-title">${evalTitle}</div>
                        <p class="eval-seal-desc">${evalDesc} (Total de observaciones: <b>${State.errors}</b>)</p>
                    </div>
                </div>
            `;

            const rows = [];
            const total = State.getTotalRooms();
            for (let r = 1; r <= total; r++) {
                const puzzle = window.Game.PUZZLES && window.Game.PUZZLES[r];
                const rep = puzzle ? puzzle.report : null;
                const isDirectAccess = State.startRoom && r < State.startRoom;

                if (rep) {
                    const sectorLabel = isDirectAccess
                        ? `${rep.room} <span style="font-size:9.5px; color:#38BDF8; font-weight:600; display:block;">(Acceso directo)</span>`
                        : rep.room;
                    rows.push(`
                        <tr>
                            <td class="col-room">${sectorLabel}</td>
                            <td class="col-crime">${rep.crime || "Delito informático tipificado"}</td>
                            <td class="col-art">${rep.articles || "G.O. N.° 37.313"}</td>
                            <td class="col-penalty">${rep.penalty || "Sanción pericial homologada"}</td>
                        </tr>
                    `);
                } else {
                    rows.push(`
                        <tr>
                            <td class="col-room">Sector 0${r}</td>
                            <td class="col-crime">Acceso directo pericial</td>
                            <td class="col-art">G.O. N.° 37.313</td>
                            <td class="col-penalty">Conforme a dictamen pericial</td>
                        </tr>
                    `);
                }
            }

            tableContainer.innerHTML = `
                ${evalHtml}
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>SECCIÓN</th>
                            <th>DELITO TIPIFICADO</th>
                            <th>BASE LEGAL</th>
                            <th>SANCIÓN Y CONSECUENCIAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.join("")}
                    </tbody>
                </table>
            `;
        }
    }

    function interactWithObject(item) {
        if (item.kind === "npc") {
            openInterview(item.data);
            return;
        }

        if (item.kind === "puzzle") {

            const interactables = getRoomInteractables();
            const realClues = interactables.filter((i) => i.kind !== "puzzle" && !i.isNoise);
            const unread = realClues.filter((i) => !State.readClues.has(i.key) && !State.readClues.has(`${State.currentRoom}_${i.index}`));

            if (unread.length > 0) {
                State.showTacticalToast(`EVIDENCIAS REQUERIDAS: Faltan ${unread.length} evidencia(s) obligatoria(s) por cotejar.`);
                if (Audio) Audio.error();
                return;
            }
            openTerminal();
        } else {
            const wasAlreadyRead = State.readClues.has(item.key) || (item.sourceType === "desk" && State.readClues.has(`${State.currentRoom}_${item.index}`));
            State.readClues.add(item.key);
            if (item.sourceType === "desk") {
                State.readClues.add(`${State.currentRoom}_${item.index}`);
            }
            State.recordInspectedClue(State.currentRoom, item);
            State.updateHUD();
            if (!wasAlreadyRead) {
                State.showTacticalToast("Elemento inspeccionado y anotado");
            }
            openClue(item);
        }
    }

    function openInterview(npc) {
        if (!npc) return;
        if (Audio) Audio.uiClick();

        State.activeNPC = npc;
        State.setMode("INTERVIEW");

        const nameEl = document.getElementById("interview-name");
        const roleEl = document.getElementById("interview-role");
        const respEl = document.getElementById("interview-response-text");

        if (nameEl) nameEl.textContent = npc.name;
        if (roleEl) roleEl.textContent = npc.role;
        if (respEl) {
            respEl.style.opacity = "1";
            respEl.textContent = `"${npc.intro}"`;
        }

        renderInterviewQuestions(npc);
    }

    function renderInterviewQuestions(npc) {
        const listEl = document.getElementById("interview-questions-list");
        const respEl = document.getElementById("interview-response-text");
        if (!listEl) return;
        listEl.innerHTML = "";

        npc.questions.forEach((item, idx) => {
            const isAsked = State.isQuestionAsked(npc.id, idx);
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "interview-q-btn" + (isAsked ? " asked" : "");
            btn.innerHTML = `<span class="q-indicator">${isAsked ? "Listo" : (idx + 1)}</span><span>${item.q}</span>`;

            btn.onclick = () => {
                if (Audio) Audio.dialogueBeep();
                State.markQuestionAsked(npc.id, idx);
                if (respEl) {
                    respEl.style.opacity = "0.2";
                    setTimeout(() => {
                        respEl.textContent = `"${item.a}"`;
                        respEl.style.opacity = "1";
                    }, 120);
                }

                State.recordInspectedClue(State.currentRoom, {
                    key: `testimonio_${npc.id}_${idx}`,
                    id: `testimonio_${npc.id}_${idx}`,
                    title: `Testimonio: ${npc.name}`,
                    clueType: "document",
                    text: `Acta de entrevista testimonial\nDeclarante: ${npc.name} (${npc.role})\nPregunta: ${item.q}\nRespuesta: ${item.a}`,
                    label: "TESTIMONIO",
                    isNoise: false
                });

                renderInterviewQuestions(npc);
            };

            listEl.appendChild(btn);
        });
    }

    function closeInterview() {
        if (Audio) Audio.uiClick();
        State.setMode("PLAYING");
        State.activeNPC = null;
        State.activeInteraction = findNearestInteraction();
        updateInteractionHint();
    }

    function closeAnyOpenModal() {
        if (State.mode === "CLUE" || State.mode === "TERMINAL" || State.mode === "MANUAL" || State.mode === "NOTEBOOK" || State.mode === "INTERVIEW") {
            if (Audio) Audio.uiClick();
            const qTextEl = document.getElementById("q-text");
            if (qTextEl) qTextEl.style.display = "block";
            const stampWrap = document.getElementById("terminal-stamp");
            if (stampWrap) stampWrap.style.display = "none";
            State.activeNPC = null;
            State.setMode("PLAYING");
            State.activeInteraction = findNearestInteraction();
            updateInteractionHint();
        }
    }

    function toggleFullscreen() {
        if (Audio) Audio.uiClick();

        try {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                const el = document.documentElement;
                if (el.requestFullscreen) {
                    el.requestFullscreen().catch(() => {});
                } else if (el.webkitRequestFullscreen) {
                    el.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        } catch (err) {
            console.warn("Fullscreen toggle error:", err);
        }
    }

    function updateFullscreenUI() {
        const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
        document.body.classList.toggle("is-fullscreen", isFull);

        const btnFull = document.getElementById("btn-fullscreen");
        if (btnFull) {
            btnFull.innerHTML = isFull
                ? `Salir [Esc]`
                : `[F] Pantalla`;
            btnFull.title = isFull ? "Salir de pantalla completa [Esc / F]" : "Alternar Pantalla Completa [F]";
        }
    }

    function loop() {
        try {
            update();
        } catch (err) {
            console.error("Error en update:", err);
        }

        try {
            if (Renderer && Renderer.draw && ctx) {
                Renderer.draw(ctx, State);
            }
        } catch (err) {
            console.error("Error en Renderer.draw:", err);
        }

        requestAnimationFrame(loop);
    }

    // botones y teclado
    function init() {
        canvas = document.getElementById("gameCanvas");
        if (!canvas) return;
        ctx = canvas.getContext("2d");

        if (window.Game.Textures && window.Game.Textures.init) {
            window.Game.Textures.init();
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(State.viewport.width * dpr);
        canvas.height = Math.round(State.viewport.height * dpr);

        State.initAmbientParticles(State.world.width, State.world.height, 35);
        State.snapCamera();

        const initAudioOnInteraction = () => {
            if (Audio) Audio.init();
            window.removeEventListener("pointerdown", initAudioOnInteraction);
            window.removeEventListener("keydown", initAudioOnInteraction);
        };
        window.addEventListener("pointerdown", initAudioOnInteraction);
        window.addEventListener("keydown", initAudioOnInteraction);

        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();

            if (key.startsWith("arrow")) e.preventDefault();

            if (State.mode === "TRANSITION") {
                return;
            }

            if (State.mode === "CLUE" && (key === "enter" || key === " " || key === "spacebar")) {
                e.preventDefault();
                closeClue();
                return;
            }

            if (key === "escape") {
                if (State.mode === "NOTEBOOK") {
                    closeNotebook();
                    return;
                }
                if (State.mode === "INTERVIEW") {
                    closeInterview();
                    return;
                }
                if (State.mode === "CLUE" || State.mode === "TERMINAL" || State.mode === "MANUAL") {
                    closeAnyOpenModal();
                    return;
                }
            }

            if (key === "b") {
                const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
                if (tag !== "input" && tag !== "textarea") {
                    if (State.mode === "NOTEBOOK") {
                        closeNotebook();
                        return;
                    } else if (State.mode === "PLAYING" || State.mode === "TERMINAL") {
                        openNotebook();
                        return;
                    }
                }
            }

            if (State.mode === "TERMINAL" && State.terminalStep === 3) {
                const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
                if (tag !== "input" && tag !== "textarea") {
                    if (key >= "0" && key <= "9") {
                        e.preventDefault();
                        handleKeypadInput(key);
                        return;
                    } else if (key === "backspace") {
                        e.preventDefault();
                        handleKeypadBackspace();
                        return;
                    } else if (key === "enter") {
                        e.preventDefault();
                        validateDoorCode();
                        return;
                    }
                }
            }

            if (key === "f") {
                const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
                if (tag !== "input" && tag !== "textarea") {
                    e.preventDefault();
                    toggleFullscreen();
                    return;
                }
            }

            if (key === "m") {
                const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
                if (tag !== "input" && tag !== "textarea") {
                    toggleManual();
                    return;
                }
            }

            if (key === "n") {
                const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
                if (tag !== "input" && tag !== "textarea") {
                    if (Audio) {
                        const isMuted = Audio.toggleMute();
                        State.updateHUD();
                        if (!isMuted && State.currentRoom === 2 && State.mode === "PLAYING") {
                            Audio.startServerHum();
                        }
                    }
                    return;
                }
            }

            if (key === "e") {
                if (e.repeat) return;
                State.keys[key] = true;
                if (State.mode === "CLUE") {
                    e.preventDefault();
                    closeClue();
                    return;
                }
                if (State.mode === "INTERVIEW") {
                    e.preventDefault();
                    closeInterview();
                    return;
                }
                if (State.mode === "PLAYING") {
                    const target = findNearestInteraction();
                    if (target) interactWithObject(target);
                }
                return;
            }

            State.keys[key] = true;
        });

        window.addEventListener("keyup", (e) => {
            State.keys[e.key.toLowerCase()] = false;
        });

        const closeClueBtn = document.getElementById("close-clue");
        if (closeClueBtn) {
            closeClueBtn.addEventListener("click", closeClue);
        }

        function startGame(startRoomIndex = 0) {
            let roomNum = Number(startRoomIndex);
            if (roomNum < 1) roomNum = roomNum + 1;
            if (roomNum > 5) roomNum = 5;

            if (Audio) {
                Audio.init();
                Audio.uiClick();
                if (roomNum === 2) {
                    Audio.startServerHum();
                } else {
                    Audio.stopServerHum();
                }
            }

            State.resetMission(roomNum);

            playRoomTransition(roomNum, () => {
                State.updateHUD();
                if (Audio) {
                    if (roomNum === 2) {
                        Audio.startServerHum();
                    } else {
                        Audio.stopServerHum();
                    }
                }
                const sectorName = (window.Game.ROOM_NAMES && window.Game.ROOM_NAMES[roomNum]) || "";
                State.showTacticalToast(`Inspección iniciada: Sala ${roomNum} - ${sectorName}`);
            });
        }

        const btnStart = document.getElementById("btn-start");
        if (btnStart) {
            btnStart.addEventListener("click", () => {
                startGame(0);
            });
        }

        const sectorBtns = document.querySelectorAll(".btn-sector-select");
        sectorBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const targetRoom = btn.dataset.room !== undefined ? Number(btn.dataset.room) : 0;
                startGame(targetRoom);
            });
        });

        const btnRestart = document.getElementById("btn-restart");
        if (btnRestart) {
            btnRestart.addEventListener("click", () => {
                if (Audio) {
                    Audio.uiClick();
                    Audio.stopServerHum();
                }
                startGame(0);
            });
        }

        const btnPrintReport = document.getElementById("btn-print-report");
        if (btnPrintReport) {
            btnPrintReport.addEventListener("click", () => {
                if (Audio) Audio.uiClick();
                window.print();
            });
        }

        const btnOpenManual = document.getElementById("btn-open-manual");
        if (btnOpenManual) {
            btnOpenManual.addEventListener("click", toggleManual);
        }

        const btnNotebook = document.getElementById("btn-notebook");
        if (btnNotebook) {
            btnNotebook.addEventListener("click", () => {
                if (State.mode === "NOTEBOOK") closeNotebook();
                else openNotebook();
            });
        }

        const btnTerminalNotebook = document.getElementById("btn-terminal-notebook");
        if (btnTerminalNotebook) {
            btnTerminalNotebook.addEventListener("click", openNotebook);
        }

        const btnKeypadNotebook = document.getElementById("btn-keypad-notebook");
        if (btnKeypadNotebook) {
            btnKeypadNotebook.addEventListener("click", openNotebook);
        }

        const closeNotebookBtn = document.getElementById("close-notebook");
        if (closeNotebookBtn) {
            closeNotebookBtn.addEventListener("click", closeNotebook);
        }

        const closeNotebookFooterBtn = document.getElementById("btn-close-notebook-footer");
        if (closeNotebookFooterBtn) {
            closeNotebookFooterBtn.addEventListener("click", closeNotebook);
        }

        const closeInterviewBtn = document.getElementById("close-interview");
        if (closeInterviewBtn) {
            closeInterviewBtn.addEventListener("click", closeInterview);
        }

        const btnCloseInterviewFooter = document.getElementById("btn-close-interview-footer");
        if (btnCloseInterviewFooter) {
            btnCloseInterviewFooter.addEventListener("click", closeInterview);
        }

        const btnCloseKeypadSearch = document.getElementById("btn-close-keypad-search");
        if (btnCloseKeypadSearch) {
            btnCloseKeypadSearch.addEventListener("click", () => {
                if (Audio) Audio.uiClick();
                State.setMode("PLAYING");
                updateInteractionHint();
            });
        }

        const keypadGrid = document.querySelector(".keypad-grid");
        if (keypadGrid) {
            keypadGrid.addEventListener("click", (e) => {
                const btn = e.target.closest(".keypad-btn");
                if (!btn) return;
                if (btn.dataset.val !== undefined) {
                    handleKeypadInput(btn.dataset.val);
                } else if (btn.dataset.action === "backspace") {
                    handleKeypadBackspace();
                } else if (btn.dataset.action === "enter") {
                    validateDoorCode();
                }
            });
        }

        const btnAudio = document.getElementById("btn-audio");
        if (btnAudio) {
            btnAudio.addEventListener("click", () => {
                if (Audio) {
                    Audio.init();
                    const isMuted = Audio.toggleMute();
                    Audio.uiClick();
                    State.updateHUD();
                    if (!isMuted && State.currentRoom === 2 && State.mode === "PLAYING") {
                        Audio.startServerHum();
                    }
                }
            });
        }

        const btnFullscreen = document.getElementById("btn-fullscreen");
        if (btnFullscreen) {
            btnFullscreen.addEventListener("click", toggleFullscreen);
        }

        document.addEventListener("fullscreenchange", updateFullscreenUI);
        document.addEventListener("webkitfullscreenchange", updateFullscreenUI);

        const closeManualBtn = document.getElementById("close-manual");
        if (closeManualBtn) {
            closeManualBtn.addEventListener("click", () => {
                if (Audio) Audio.uiClick();
                State.setMode("PLAYING");
            });
        }

        const tabDefs = document.getElementById("tab-defs");
        const tabRules = document.getElementById("tab-rules");
        const searchInput = document.getElementById("manual-search");

        if (tabDefs && tabRules) {
            tabDefs.addEventListener("click", () => {
                if (Audio) Audio.paper();
                currentManualTab = "definitions";
                tabDefs.classList.add("active");
                tabRules.classList.remove("active");
                renderManual(searchInput ? searchInput.value : "");
            });

            tabRules.addEventListener("click", () => {
                if (Audio) Audio.paper();
                currentManualTab = "rules";
                tabRules.classList.add("active");
                tabDefs.classList.remove("active");
                renderManual(searchInput ? searchInput.value : "");
            });
        }

        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                renderManual(e.target.value);
            });
        }

        State.setMode("MENU");
        State.updateHUD();

        requestAnimationFrame(loop);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
