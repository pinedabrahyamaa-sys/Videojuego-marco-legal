window.Game = window.Game || {};

(function() {
    // Módulos centrales
    const State = window.Game.State;
    const Renderer = window.Game.Renderer;
    const Audio = window.Game.Audio;

    let canvas, ctx;

    // =========================================================================
    // DETECCIÓN DE OBSTÁCULOS (ESCRITORIOS, RACKS, PLANTAS, MAMPARAS Y DECOR)
    // =========================================================================
    function getRoomObstacles() {
        const layout = window.Game.ROOM_LAYOUTS[State.currentRoom];
        const obstacles = [];
        if (!layout) return obstacles;

        // Escritorios y sus respectivas sillas
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

        // Racks de servidores
        if (layout.racks) {
            layout.racks.forEach((rack) => {
                obstacles.push({ x: rack.x, y: rack.y, width: 56, height: 106 });
            });
        }

        // Plantas de ornato
        if (layout.plants) {
            layout.plants.forEach((plant) => {
                obstacles.push({ x: plant.x + 5, y: plant.y, width: 24, height: 28 });
            });
        }

        // Muros divisorios internos / mamparas de oficina
        if (layout.walls) {
            layout.walls.forEach((wall) => {
                obstacles.push({ x: wall.x, y: wall.y, width: wall.width, height: wall.height });
            });
        }

        // Mobiliario decorativo, archivadores y props
        const decorList = (layout.decor || []).concat(layout.props || []);
        decorList.forEach((dec) => {
            obstacles.push({ x: dec.x, y: dec.y, width: dec.width, height: dec.height });
        });

        // Puerta mientras permanezca cerrada
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

    // =========================================================================
    // OBJETOS INTERACTIVOS (EVIDENCIAS REALES, RUIDO FORENSE Y TERMINAL)
    // =========================================================================
    function getRoomInteractables() {
        const layout = window.Game.ROOM_LAYOUTS[State.currentRoom];
        if (!layout) return [];

        const items = [];

        // 1. Escritorios con evidencias
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

        // 2. Mobiliario, props y ruido forense interactuable
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

        // 3. Terminal de salida (puzzle de tipificación)
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

    // =========================================================================
    // ACTUALIZACIÓN DE FOTOGRAMA (UPDATE)
    // =========================================================================
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
                    // Silencioso para garantizar que el movimiento nunca se interrumpa
                }
            }
        } else {
            State.isMoving = false;
        }

        // Actualizar seguimiento suave de cámara (lerp = 0.14)
        State.updateCamera(0.14);

        // Cruzar la puerta abierta activa la transición de sector
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

    // =========================================================================
    // TRANSICIÓN CINEMATOGRÁFICA ENTRE SALAS // CICPC
    // =========================================================================
    function playRoomTransition(roomNumber, onReady) {
        State.setMode("TRANSITION");
        State.keys = {}; // Limpiar estados de teclas para evitar bloqueos

        const overlay = document.getElementById("room-transition-overlay");
        const titleEl = document.getElementById("room-trans-title");
        const subEl = document.getElementById("room-trans-sub");

        const roomName = (window.Game.ROOM_NAMES && window.Game.ROOM_NAMES[roomNumber]) || "SECTOR PERICIAL";
        if (titleEl) {
            titleEl.innerText = `SECTOR 0${roomNumber} // ${roomName.toUpperCase()}`;
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
                        State.keys = {}; // Asegurar que no queden teclas pegadas
                        State.setMode("PLAYING");
                    }, 350);
                } else {
                    State.keys = {};
                    State.setMode("PLAYING");
                }
            }, 1000); // Mantener ~1.0s con animación de entrada
        }, 350); // Fade-in inicial
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

                // Control del zumbido ambiental de servidores (Sala 2)
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
            // Última sala completada: consolidar informe final de auditoría
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

    // =========================================================================
    // MODAL DE TERMINAL EN TRES PASOS (CALIFICACIÓN Y CÓDIGO DE PUERTA)
    // =========================================================================
    function openTerminal() {
        const stampWrap = document.getElementById("terminal-stamp");
        if (stampWrap) stampWrap.style.display = "none";

        const roomLayout = window.Game.ROOM_LAYOUTS && window.Game.ROOM_LAYOUTS[State.currentRoom];
        const hasDoorCode = roomLayout && !!roomLayout.doorCode;

        // Si la calificación ya fue aprobada previamente, ir directamente al Paso 3 de código
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
                // Paso 2 aprobado: guardar calificación jurídica de la sala
                State.quizSolvedByRoom[State.currentRoom] = true;
                const roomLayout = window.Game.ROOM_LAYOUTS && window.Game.ROOM_LAYOUTS[State.currentRoom];
                const hasDoorCode = roomLayout && !!roomLayout.doorCode;

                if (Audio) Audio.stepSuccess();

                // Animación de golpe de sello pericial CALIFICACIÓN VALIDADA
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
                    <div style="font-family:'JetBrains Mono', monospace; font-weight:700; color:#F87171; margin-bottom:5px; font-size:11px; letter-spacing:0.5px;">
                        ⚖ OBSERVACIÓN DE FISCALÍA // DICTAMEN NO CONFORME
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

    // Paso 3: Renderizado y control del Teclado Numérico de la Compuerta
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
                feedbackEl.innerText = "✓ CÓDIGO CORRECTO // COMPUERTA DESBLOQUEADA";
                feedbackEl.className = "keypad-feedback success";
            }
            State.showTacticalToast("¡CÓDIGO CORRECTO! COMPUERTA DESBLOQUEADA. DIRÍGETE A LA SALIDA.");
            setTimeout(() => {
                State.setMode("PLAYING");
                State.doorCodeInput = "";
                updateInteractionHint();
            }, 650);
        } else {
            if (Audio) Audio.error();
            // Código incorrecto: NO suma errores al dictamen fiscal conforme a la instrucción
            if (feedbackEl) {
                feedbackEl.innerText = "Código denegado. Revise notas o archivos antiguos del sector.";
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
            stepBadgeEl.innerText = "DICTAMEN PERICIAL VALIDADO";
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
                        <span class="verdict-icon">⚖</span>
                        <b>DICTAMEN PERICIAL HOMOLOGADO</b>
                    </div>
                    <p class="verdict-text">${puzzle.verdict}</p>
                    <div class="verdict-details">
                        <span><b>Delito:</b> ${puzzle.report.crime}</span>
                        <span><b>Normativa:</b> ${puzzle.report.articles}</span>
                    </div>
                    <button id="btn-unlock-door" class="cyber-btn" type="button">CONFIRMAR Y DESBLOQUEAR PASO</button>
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

    // =========================================================================
    // MODAL DE EVIDENCIA (CLUE DIEGÉTICO)
    // =========================================================================
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
                clueBadgeLabel.innerText = "DOCUMENTO ARCHIVADO // NOTA PERSONAL";
                clueBadgeLabel.style.color = "#5C4738";
                clueBadgeLabel.style.borderColor = "#B89F70";
            } else {
                clueBadgeLabel.innerText = "REGISTRO INSPECCIONADO // CADENA DE CUSTODIA";
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

    // =========================================================================
    // MODAL DE LIBRETA DE CAMPO / BITÁCORA DE EVIDENCIAS ([B])
    // =========================================================================
    function openNotebook() {
        if (Audio) Audio.paper();
        State.notebookPreviousMode = State.mode; // 'PLAYING' o 'TERMINAL'
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
            if (clue.clueType === "oldNote") typeLabel = "NOTA PERSONAL";
            else if (clue.clueType === "computer") typeLabel = "SISTEMA DIGITAL";

            card.innerHTML = `
                <div class="nb-card-header">
                    <span class="nb-card-title">${clue.title}</span>
                    <span class="nb-card-type">${typeLabel}</span>
                </div>
                <div class="nb-card-text">${clue.text}</div>
                <div class="nb-card-actions">
                    <button class="nb-tag-btn tag-btn-rel${currentTag === 'relevant' ? ' active' : ''}" type="button">
                        ★ Relevante
                    </button>
                    <button class="nb-tag-btn tag-btn-disc${currentTag === 'discarded' ? ' active' : ''}" type="button">
                        ✕ Descartado
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

    // =========================================================================
    // MODAL DE MANUAL LEGAL (GLOSSARY)
    // =========================================================================
    let currentManualTab = "definitions";

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

    // =========================================================================
    // PANTALLA DE VICTORIA: INFORME FINAL DE AUDITORÍA
    // =========================================================================
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
            let evalIcon = "";
            let evalDesc = "";

            if (State.errors <= 1) {
                evalTitle = "DICTAMEN EXCELENTE — ADMITIDO POR FISCALÍA SIN REPAROS";
                evalClass = "eval-excellent";
                evalIcon = "✓";
                evalDesc = "El Ministerio Público homologó la totalidad de las calificaciones jurídicas en primera instancia, reconociendo rigurosidad probatoria y apego irrestricto a la Gaceta Oficial N.° 37.313.";
            } else if (State.errors <= 4) {
                evalTitle = "DICTAMEN APROBADO CON OBSERVACIONES MENORES";
                evalClass = "eval-approved";
                evalIcon = "!";
                evalDesc = "La Fiscalía admitió las tipificaciones tras subsanar observaciones técnicas puntuales durante la instrucción del expediente.";
            } else {
                evalTitle = "DICTAMEN DEVUELTO PARA AMPLIACIÓN PERICIAL";
                evalClass = "eval-rejected";
                evalIcon = "✕";
                evalDesc = "El fiscal de la causa ordenó reabrir la investigación debido a reiteradas discrepancias en la tipificación penal y concurso de agravantes.";
            }

            const evalHtml = `
                <div class="fiscal-evaluation-seal ${evalClass}">
                    <div class="eval-icon-badge">${evalIcon}</div>
                    <div class="eval-content-block">
                        <div class="eval-seal-title">${evalTitle}</div>
                        <p class="eval-seal-desc">${evalDesc} (Total de observaciones: <b>${State.errors}</b>)</p>
                    </div>
                </div>
            `;

            const rows = [];
            const total = State.getTotalRooms();
            for (let r = 1; r <= total; r++) {
                const rep = window.Game.PUZZLES[r].report;
                rows.push(`
                    <tr>
                        <td class="col-room">${rep.room}</td>
                        <td class="col-crime">${rep.crime}</td>
                        <td class="col-art">${rep.articles}</td>
                        <td class="col-penalty">${rep.penalty}</td>
                    </tr>
                `);
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

    // =========================================================================
    // GESTIÓN DE INTERACCIÓN GENERAL
    // =========================================================================
    function interactWithObject(item) {
        if (item.kind === "puzzle") {
            // Verificar si se han examinado todas las evidencias requeridas obligatorias
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
                State.showTacticalToast("ELEMENTO INSPECCIONADO // REGISTRO EN ACTA");
            }
            openClue(item);
        }
    }

    function closeAnyOpenModal() {
        if (State.mode === "CLUE" || State.mode === "TERMINAL" || State.mode === "MANUAL" || State.mode === "NOTEBOOK") {
            if (Audio) Audio.uiClick();
            const qTextEl = document.getElementById("q-text");
            if (qTextEl) qTextEl.style.display = "block";
            const stampWrap = document.getElementById("terminal-stamp");
            if (stampWrap) stampWrap.style.display = "none";
            State.setMode("PLAYING");
            State.activeInteraction = findNearestInteraction();
            updateInteractionHint();
        }
    }

    // =========================================================================
    // CONTROL DE PANTALLA COMPLETA ADAPTABLE
    // =========================================================================
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
                ? `<span class="hud-btn-icon">🗗</span> SALIR [Esc]`
                : `<span class="hud-btn-icon">⛶</span> PANTALLA [F]`;
            btnFull.title = isFull ? "Salir de pantalla completa [Esc / F]" : "Alternar Pantalla Completa [F]";
        }
    }

    // =========================================================================
    // BUCLE DE RENDERIZADO
    // =========================================================================
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

    // =========================================================================
    // INICIALIZACIÓN Y EVENT LISTENERS
    // =========================================================================
    function init() {
        canvas = document.getElementById("gameCanvas");
        if (!canvas) return;
        ctx = canvas.getContext("2d");

        // Inicializar texturas procedimentales HD en canvas offscreen
        if (window.Game.Textures && window.Game.Textures.init) {
            window.Game.Textures.init();
        }

        // Configurar soporte High-DPI (2D HD nítido)
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(State.viewport.width * dpr);
        canvas.height = Math.round(State.viewport.height * dpr);

        // Inicializar partículas atmosféricas en las dimensiones del mundo (1160x740)
        State.initAmbientParticles(State.world.width, State.world.height, 35);
        State.snapCamera();

        // Inicializar audio en la primera interacción
        const initAudioOnInteraction = () => {
            if (Audio) Audio.init();
            window.removeEventListener("pointerdown", initAudioOnInteraction);
            window.removeEventListener("keydown", initAudioOnInteraction);
        };
        window.addEventListener("pointerdown", initAudioOnInteraction);
        window.addEventListener("keydown", initAudioOnInteraction);

        // Control de teclado unificado con máquina de estados
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();

            if (key.startsWith("arrow")) e.preventDefault();

            // Bloquear entrada de teclado durante transiciones cinematográficas
            if (State.mode === "TRANSITION") {
                return;
            }

            // Si el modal de pista está abierto, permitir cerrarlo con [Enter] o [Espacio]
            // para evitar salir accidentalmente de pantalla completa al usar [Esc]
            if (State.mode === "CLUE" && (key === "enter" || key === " " || key === "spacebar")) {
                e.preventDefault();
                closeClue();
                return;
            }

            // Tecla [Escape]: cierra cualquier modal abierto y regresa al modo correspondiente
            if (key === "escape") {
                if (State.mode === "NOTEBOOK") {
                    closeNotebook();
                    return;
                }
                if (State.mode === "CLUE" || State.mode === "TERMINAL" || State.mode === "MANUAL") {
                    closeAnyOpenModal();
                    return;
                }
            }

            // Tecla [B]: abre o cierra la Bitácora de Campo (en PLAYING o TERMINAL)
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

            // Teclado numérico físico para el Paso 3 del Terminal (Código de Salida)
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

            // Tecla [F]: alternar pantalla completa
            if (key === "f") {
                const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
                if (tag !== "input" && tag !== "textarea") {
                    e.preventDefault();
                    toggleFullscreen();
                    return;
                }
            }

            // Tecla [M]: abre o cierra el Manual de Consulta Legal
            if (key === "m") {
                const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
                if (tag !== "input" && tag !== "textarea") {
                    toggleManual();
                    return;
                }
            }

            // Tecla [N]: alternar audio
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

            // Tecla [E]: interacción física en el escenario (solo en PLAYING)
            if (key === "e" && !State.keys[key] && State.mode === "PLAYING") {
                const target = findNearestInteraction();
                if (target) interactWithObject(target);
            }

            State.keys[key] = true;
        });

        window.addEventListener("keyup", (e) => {
            State.keys[e.key.toLowerCase()] = false;
        });

        // Botón cerrar modal de pista
        const closeClueBtn = document.getElementById("close-clue");
        if (closeClueBtn) {
            closeClueBtn.addEventListener("click", closeClue);
        }

        // Botón iniciar en la pantalla de inicio
        const btnStart = document.getElementById("btn-start");
        if (btnStart) {
            btnStart.addEventListener("click", () => {
                if (Audio) {
                    Audio.init();
                    Audio.uiClick();
                    Audio.stopServerHum();
                }

                playRoomTransition(1, () => {
                    State.updateHUD();
                    State.showTacticalToast("DILIGENCIA INICIADA // SECCIÓN 1");
                });
            });
        }

        // Botón reiniciar en la pantalla de victoria
        const btnRestart = document.getElementById("btn-restart");
        if (btnRestart) {
            btnRestart.addEventListener("click", () => {
                if (Audio) {
                    Audio.uiClick();
                    Audio.stopServerHum();
                }
                State.resetMission();
            });
        }

        // Botón imprimir dictamen pericial en PDF
        const btnPrintReport = document.getElementById("btn-print-report");
        if (btnPrintReport) {
            btnPrintReport.addEventListener("click", () => {
                if (Audio) Audio.uiClick();
                window.print();
            });
        }

        // Botón abrir manual en el HUD
        const btnOpenManual = document.getElementById("btn-open-manual");
        if (btnOpenManual) {
            btnOpenManual.addEventListener("click", toggleManual);
        }

        // Botón abrir bitácora en el HUD
        const btnNotebook = document.getElementById("btn-notebook");
        if (btnNotebook) {
            btnNotebook.addEventListener("click", () => {
                if (State.mode === "NOTEBOOK") closeNotebook();
                else openNotebook();
            });
        }

        // Botón abrir bitácora desde la cabecera del terminal
        const btnTerminalNotebook = document.getElementById("btn-terminal-notebook");
        if (btnTerminalNotebook) {
            btnTerminalNotebook.addEventListener("click", openNotebook);
        }

        // Botón abrir bitácora desde el teclado numérico del terminal
        const btnKeypadNotebook = document.getElementById("btn-keypad-notebook");
        if (btnKeypadNotebook) {
            btnKeypadNotebook.addEventListener("click", openNotebook);
        }

        // Botones de cierre de la bitácora
        const closeNotebookBtn = document.getElementById("close-notebook");
        if (closeNotebookBtn) {
            closeNotebookBtn.addEventListener("click", closeNotebook);
        }

        const closeNotebookFooterBtn = document.getElementById("btn-close-notebook-footer");
        if (closeNotebookFooterBtn) {
            closeNotebookFooterBtn.addEventListener("click", closeNotebook);
        }

        // Botón cerrar teclado numérico y buscar código en el sector
        const btnCloseKeypadSearch = document.getElementById("btn-close-keypad-search");
        if (btnCloseKeypadSearch) {
            btnCloseKeypadSearch.addEventListener("click", () => {
                if (Audio) Audio.uiClick();
                State.setMode("PLAYING");
                updateInteractionHint();
            });
        }

        // Delegación de clics en la cuadrícula del teclado numérico
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

        // Botón toggle audio en el HUD
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

        // Botón toggle pantalla completa en el HUD
        const btnFullscreen = document.getElementById("btn-fullscreen");
        if (btnFullscreen) {
            btnFullscreen.addEventListener("click", toggleFullscreen);
        }

        // Sincronización de eventos de pantalla completa
        document.addEventListener("fullscreenchange", updateFullscreenUI);
        document.addEventListener("webkitfullscreenchange", updateFullscreenUI);

        // Botón cerrar manual
        const closeManualBtn = document.getElementById("close-manual");
        if (closeManualBtn) {
            closeManualBtn.addEventListener("click", () => {
                if (Audio) Audio.uiClick();
                State.setMode("PLAYING");
            });
        }

        // Pestañas del Manual Legal
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

        // Estado inicial: pantalla de inicio
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
