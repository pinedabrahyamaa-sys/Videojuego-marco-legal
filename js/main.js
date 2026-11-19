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

        // Mobiliario decorativo y archivadores
        if (layout.decor) {
            layout.decor.forEach((dec) => {
                obstacles.push({ x: dec.x, y: dec.y, width: dec.width, height: dec.height });
            });
        }

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
    // OBJETOS INTERACTIVOS (EVIDENCIAS Y TERMINAL)
    // =========================================================================
    function getRoomInteractables() {
        const layout = window.Game.ROOM_LAYOUTS[State.currentRoom];
        if (!layout) return [];

        const items = [];

        if (layout.desks) {
            layout.desks.forEach((desk, idx) => {
                if (desk.clueType === "document") {
                    items.push({
                        kind: "clue",
                        index: idx,
                        title: "Expediente: " + desk.label,
                        text: desk.clue,
                        clueType: "document",
                        x: desk.x + desk.width - 33,
                        y: desk.y + 35,
                        width: 14,
                        height: 13,
                        range: 58
                    });
                } else {
                    items.push({
                        kind: "clue",
                        index: idx,
                        title: "Estación de trabajo: " + desk.label,
                        text: desk.clue,
                        clueType: "computer",
                        x: desk.x + Math.floor(desk.width / 2) - 25,
                        y: desk.y + 35,
                        width: 50,
                        height: 14,
                        range: 58
                    });
                }
            });
        }

        if (State.door.locked) {
            items.push({
                kind: "puzzle",
                title: "Terminal de control pericial",
                x: State.door.x - 10,
                y: State.door.y,
                width: State.door.width + 10,
                height: State.door.height,
                range: 35
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

        hint.innerHTML = State.activeInteraction
            ? `Pulsa <b>[E]</b> para examinar: <span style="color:#D99B26">${State.activeInteraction.title}</span>`
            : `Diligencia activa: usa <b>W A S D</b> para desplazarte. [E] examinar. [M] Manual. [N] Audio.`;
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
    // TRANSICIÓN ENTRE SALAS PERICIALES
    // =========================================================================
    function triggerRoomTransition() {
        State.setMode("TRANSITION");
        if (Audio) Audio.transition();

        const overlay = document.getElementById("transition-overlay");
        const statusText = document.getElementById("transition-status-text");

        const totalRooms = State.getTotalRooms();

        if (State.currentRoom < totalRooms) {
            if (statusText) statusText.innerText = "ACCEDIENDO A LA SIGUIENTE SECCIÓN PERICIAL...";
            if (overlay) overlay.classList.add("active");

            setTimeout(() => {
                State.currentRoom++;
                State.player.x = 64;
                State.player.y = 350;
                State.player.facing = "down";
                State.door.locked = true;
                State.door.color = "#C84B52";
                State.snapCamera();
                State.updateHUD();

                setTimeout(() => {
                    if (overlay) overlay.classList.remove("active");
                    State.setMode("PLAYING");
                    const sectorName = window.Game.ROOM_NAMES[State.currentRoom] || "";
                    State.showTacticalToast("SECCIÓN " + State.currentRoom + ": " + sectorName);
                }, 350);
            }, 550);
        } else {
            // Última sala completada: consolidar informe final de auditoría
            if (statusText) statusText.innerText = "CONSOLIDANDO DICTAMEN PERICIAL FINAL...";
            if (overlay) overlay.classList.add("active");

            setTimeout(() => {
                if (overlay) overlay.classList.remove("active");
                renderVictoryScreen();
                State.setMode("VICTORY");
                if (Audio) Audio.victory();
            }, 650);
        }
    }

    // =========================================================================
    // MODAL DE TERMINAL EN DOS PASOS
    // =========================================================================
    function openTerminal() {
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
                renderTerminalVerdict(puzzle);
            }
        } else {
            State.errors++;
            State.updateHUD();
            if (Audio) Audio.error();

            if (errorEl) {
                errorEl.innerText = `[DICTAMEN NO CONFORME] ${option.feedback}`;
                errorEl.style.display = "block";
            }

            if (modal) {
                modal.classList.remove("shake");
                void modal.offsetWidth;
                modal.classList.add("shake");
            }
        }
    }

    function renderTerminalVerdict(puzzle) {
        const qTextEl = document.getElementById("q-text");
        const optionsContainer = document.getElementById("q-options");
        const verdictContainer = document.getElementById("terminal-verdict");
        const stepBadgeEl = document.getElementById("terminal-step-badge");

        if (stepBadgeEl) {
            stepBadgeEl.innerText = "DICTAMEN PERICIAL VALIDADO";
            stepBadgeEl.className = "step-badge step-complete";
        }

        if (qTextEl) qTextEl.style.display = "none";
        if (optionsContainer) optionsContainer.style.display = "none";

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
    // MODAL DE EVIDENCIA (CLUE)
    // =========================================================================
    function openClue(item) {
        const clueModal = document.getElementById("clue-modal");
        const clueTitleEl = document.getElementById("clue-title");
        const clueTextEl = document.getElementById("clue-text");

        if (clueModal) {
            clueModal.classList.remove("clue-document", "clue-computer");
            if (item.clueType === "document") {
                clueModal.classList.add("clue-document");
            } else {
                clueModal.classList.add("clue-computer");
            }
        }

        if (clueTitleEl) clueTitleEl.innerText = item.title;
        if (clueTextEl) clueTextEl.innerText = item.text;

        State.setMode("CLUE");

        if (Audio) {
            if (item.clueType === "document") {
                Audio.paper();
            } else {
                Audio.computer();
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
        const timeEl = document.getElementById("victory-time");
        const cluesEl = document.getElementById("victory-clues");
        const errorsEl = document.getElementById("victory-errors");
        const tableContainer = document.getElementById("victory-table-container");

        if (timeEl) timeEl.innerText = State.formatTime(State.elapsedSeconds);
        if (cluesEl) cluesEl.innerText = `${State.readClues.size} / ${State.getTotalCluesAllRooms()}`;
        if (errorsEl) errorsEl.innerText = State.errors;

        if (tableContainer && window.Game.PUZZLES) {
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
            openTerminal();
        } else {
            State.readClues.add(`${State.currentRoom}_${item.index}`);
            State.updateHUD();
            openClue(item);
        }
    }

    function closeAnyOpenModal() {
        if (State.mode === "CLUE" || State.mode === "TERMINAL" || State.mode === "MANUAL") {
            if (Audio) Audio.uiClick();
            const qTextEl = document.getElementById("q-text");
            if (qTextEl) qTextEl.style.display = "block";
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

            // Si el modal de pista está abierto, permitir cerrarlo con [Enter] o [Espacio]
            // para evitar salir accidentalmente de pantalla completa al usar [Esc]
            if (State.mode === "CLUE" && (key === "enter" || key === " " || key === "spacebar")) {
                e.preventDefault();
                closeClue();
                return;
            }

            // Tecla [Escape]: cierra cualquier modal abierto y regresa a PLAYING
            if (key === "escape") {
                if (State.mode === "CLUE" || State.mode === "TERMINAL" || State.mode === "MANUAL") {
                    closeAnyOpenModal();
                    return;
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
                        Audio.toggleMute();
                        State.updateHUD();
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
                }
                State.setMode("PLAYING");
                State.updateHUD();
                State.showTacticalToast("DILIGENCIA INICIADA // SECCIÓN 1");
            });
        }

        // Botón reiniciar en la pantalla de victoria
        const btnRestart = document.getElementById("btn-restart");
        if (btnRestart) {
            btnRestart.addEventListener("click", () => {
                if (Audio) Audio.uiClick();
                State.resetMission();
            });
        }

        // Botón abrir manual en el HUD
        const btnOpenManual = document.getElementById("btn-open-manual");
        if (btnOpenManual) {
            btnOpenManual.addEventListener("click", toggleManual);
        }

        // Botón toggle audio en el HUD
        const btnAudio = document.getElementById("btn-audio");
        if (btnAudio) {
            btnAudio.addEventListener("click", () => {
                if (Audio) {
                    Audio.init();
                    Audio.toggleMute();
                    Audio.uiClick();
                    State.updateHUD();
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
