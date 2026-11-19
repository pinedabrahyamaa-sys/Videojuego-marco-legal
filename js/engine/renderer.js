window.Game = window.Game || {};

(function() {
    function drawRoundedRect(ctx, x, y, width, height, radius) {
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
        } else {
            ctx.beginPath();
            const r = typeof radius === "number" ? radius : (radius[0] || 4);
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + width - r, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + r);
            ctx.lineTo(x + width, y + height - r);
            ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
            ctx.lineTo(x + r, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }
    }

    window.Game.Renderer = {
        // =========================================================================
        // SILLA DE OFICINA ERGONÓMICA
        // =========================================================================
        drawChair: function(ctx, x, y) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
            ctx.beginPath();
            ctx.ellipse(x + 10, y + 14, 11, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#1A232E";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 10, y + 13);
            ctx.lineTo(x + 2, y + 18);
            ctx.moveTo(x + 10, y + 13);
            ctx.lineTo(x + 18, y + 18);
            ctx.moveTo(x + 10, y + 13);
            ctx.lineTo(x + 10, y + 21);
            ctx.stroke();

            ctx.fillStyle = "#334152";
            ctx.fillRect(x + 8.5, y + 10, 3, 4);

            drawRoundedRect(ctx, x + 3, y + 8, 14, 10, 3);
            ctx.fillStyle = "#1E2734";
            ctx.fill();
            ctx.strokeStyle = "#2B3747";
            ctx.lineWidth = 1;
            ctx.stroke();

            drawRoundedRect(ctx, x + 4, y + 1, 12, 8, [4, 4, 2, 2]);
            ctx.fillStyle = "#263242";
            ctx.fill();
            ctx.strokeStyle = "#38475C";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#161D27";
            ctx.fillRect(x + 1, y + 6, 2, 8);
            ctx.fillRect(x + 17, y + 6, 2, 8);
        },

        // =========================================================================
        // PUESTO DE TRABAJO FORENSE
        // =========================================================================
        drawDesk: function(ctx, state, x, y, width, label, index) {
            const now = Date.now();
            const currentRoom = state.currentRoom;
            const clueKey = `${currentRoom}_${index}`;
            const isRead = state.readClues.has(clueKey);

            // Sombra
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            drawRoundedRect(ctx, x + 4, y + 6, width - 2, 60, 6);
            ctx.fill();

            // Mueble
            drawRoundedRect(ctx, x, y, width, 58, 6);
            const deskGrad = ctx.createLinearGradient(x, y, x, y + 58);
            deskGrad.addColorStop(0, "#2E2A27");
            deskGrad.addColorStop(1, "#211D1B");
            ctx.fillStyle = deskGrad;
            ctx.fill();
            ctx.strokeStyle = "#423B36";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.fillStyle = "#1A1715";
            ctx.fillRect(x + 3, y + 54, width - 6, 3);

            const monitorX = x + Math.floor((width - 40) / 2);

            // Monitor
            drawRoundedRect(ctx, monitorX + 11, y + 33, 18, 3, 1.5);
            ctx.fillStyle = "#343F4F";
            ctx.fill();

            ctx.fillStyle = "#222C38";
            ctx.fillRect(monitorX + 18, y + 28, 4, 6);

            drawRoundedRect(ctx, monitorX - 2, y + 6, 44, 23, 3);
            ctx.fillStyle = "#121720";
            ctx.fill();
            ctx.strokeStyle = "#2E3A4B";
            ctx.lineWidth = 1;
            ctx.stroke();

            drawRoundedRect(ctx, monitorX, y + 8, 40, 19, 2);
            const screenGrad = ctx.createLinearGradient(monitorX, y + 8, monitorX, y + 27);
            screenGrad.addColorStop(0, "#101621");
            screenGrad.addColorStop(1, "#151F2D");
            ctx.fillStyle = screenGrad;
            ctx.fill();

            // Barra y botones de ventana
            ctx.fillStyle = "#1E2A3A";
            ctx.fillRect(monitorX + 1, y + 9, 38, 3);

            ctx.fillStyle = "#C84B52";
            ctx.beginPath();
            ctx.arc(monitorX + 4, y + 10.5, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#D99B26";
            ctx.beginPath();
            ctx.arc(monitorX + 7, y + 10.5, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#3FA37C";
            ctx.beginPath();
            ctx.arc(monitorX + 10, y + 10.5, 1, 0, Math.PI * 2);
            ctx.fill();

            // Líneas de texto y cursor
            ctx.fillStyle = "#6F849B";
            ctx.fillRect(monitorX + 3, y + 14, 18, 1.5);
            ctx.fillRect(monitorX + 3, y + 17, 26, 1.5);

            const cursorBlink = Math.floor(now / 420) % 2 === 0;
            const line3Len = 12 + (Math.floor(now / 1500) % 3) * 6;
            ctx.fillStyle = "#9BB0C7";
            ctx.fillRect(monitorX + 3, y + 20, line3Len, 1.5);
            if (cursorBlink) {
                ctx.fillStyle = "#D99B26";
                ctx.fillRect(monitorX + 4 + line3Len, y + 19, 2.5, 3);
            }

            // Teclado
            drawRoundedRect(ctx, x + Math.floor(width / 2) - 26, y + 38, 52, 9, 2);
            ctx.fillStyle = "#1C2431";
            ctx.fill();
            ctx.strokeStyle = "#2F3C4E";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.fillStyle = "#4F6278";
            for (let k = 0; k < 9; k++) {
                ctx.fillRect(x + Math.floor(width / 2) - 23 + k * 5.2, y + 40, 3.5, 2);
                ctx.fillRect(x + Math.floor(width / 2) - 23 + k * 5.2, y + 43, 3.5, 2);
            }

            // Expediente / Folios
            drawRoundedRect(ctx, x + width - 36, y + 35, 15, 13, 2);
            ctx.fillStyle = "#EAE2D0";
            ctx.fill();
            ctx.strokeStyle = "#C8BDA6";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.fillStyle = "#D6CABE";
            ctx.fillRect(x + width - 36, y + 33, 7, 3);

            ctx.fillStyle = "#C84B52";
            ctx.beginPath();
            ctx.arc(x + width - 24, y + 41, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Taza de café
            ctx.fillStyle = "#9C7948";
            ctx.beginPath();
            ctx.arc(x + width - 13, y + 41, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#CDB285";
            ctx.beginPath();
            ctx.arc(x + width - 13, y + 41, 3.2, 0, Math.PI * 2);
            ctx.fill();

            // Silla
            this.drawChair(ctx, x + Math.floor(width / 2) - 9, y + 61);

            // Rótulo del Puesto
            ctx.fillStyle = "#8F9FA8";
            ctx.font = "600 8px 'JetBrains Mono', monospace";
            ctx.fillText(label, x + 6, y + 53);

            // Marcador de cotejo de pista
            const layout = window.Game.ROOM_LAYOUTS[currentRoom];
            const deskData = layout && layout.desks ? layout.desks[index] : null;
            const isDoc = deskData && deskData.clueType === "document";
            const clueSpotX = isDoc ? x + width - 28 : monitorX + 20;
            const clueSpotY = isDoc ? y + 41 : y + 17;

            if (!isRead) {
                const pulse = 0.25 + Math.sin(now / 280) * 0.12;
                ctx.fillStyle = `rgba(217, 155, 38, ${pulse})`;
                ctx.beginPath();
                ctx.arc(clueSpotX, clueSpotY, 11, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#D99B26";
                ctx.beginPath();
                ctx.arc(clueSpotX, clueSpotY, 6.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = "#11161F";
                ctx.font = "bold 9px 'Inter', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("!", clueSpotX, clueSpotY);
                ctx.textAlign = "start";
                ctx.textBaseline = "alphabetic";
            } else {
                ctx.fillStyle = "#3FA37C";
                ctx.beginPath();
                ctx.arc(clueSpotX, clueSpotY, 6.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#D4EFE3";
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 8px 'Inter', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("✓", clueSpotX, clueSpotY);
                ctx.textAlign = "start";
                ctx.textBaseline = "alphabetic";
            }
        },

        // =========================================================================
        // GABINETES DE SERVIDORES
        // =========================================================================
        drawServerRack: function(ctx, state, x, y, label) {
            const now = Date.now();
            const currentRoom = state.currentRoom;

            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            drawRoundedRect(ctx, x + 4, y + 6, 56, 106, 5);
            ctx.fill();

            drawRoundedRect(ctx, x, y, 56, 106, 4);
            ctx.fillStyle = "#131922";
            ctx.fill();
            ctx.strokeStyle = "#2F3B4D";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.fillStyle = "#263242";
            ctx.fillRect(x + 4, y + 4, 3, 98);
            ctx.fillRect(x + 49, y + 4, 3, 98);

            for (let bay = 0; bay < 5; bay++) {
                const bayY = y + 7 + bay * 19;

                drawRoundedRect(ctx, x + 9, bayY, 38, 16, 2);
                ctx.fillStyle = bay % 2 === 0 ? "#1A232E" : "#1F2835";
                ctx.fill();
                ctx.strokeStyle = "#2C3848";
                ctx.lineWidth = 0.8;
                ctx.stroke();

                ctx.fillStyle = "#0E141C";
                for (let v = 0; v < 4; v++) {
                    ctx.fillRect(x + 13 + v * 5, bayY + 5, 3, 6);
                }

                const phase1 = (x * 19 + bay * 37);
                const isBlink1On = Math.sin((now / 240) + phase1) > -0.15;
                const isAlertNode = (bay === 2 && currentRoom === 3) || (bay === 1 && currentRoom === 2);

                let ledColor = isBlink1On ? "#3FA37C" : "#1B3F30";
                if (isAlertNode) {
                    ledColor = isBlink1On ? "#D99B26" : "#4A3512";
                }

                ctx.fillStyle = ledColor;
                ctx.beginPath();
                ctx.arc(x + 36, bayY + 6, 1.8, 0, Math.PI * 2);
                ctx.fill();

                const phase2 = (x * 31 + bay * 53);
                const isBlink2On = Math.sin((now / 150) + phase2) > 0.40;
                ctx.fillStyle = isBlink2On ? "#7EB1E0" : "#243344";
                ctx.beginPath();
                ctx.arc(x + 41, bayY + 6, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = "#8F9FA8";
            ctx.font = "600 7px 'JetBrains Mono', monospace";
            ctx.fillText(label, x + 10, y + 115);
        },

        // =========================================================================
        // PLANTA DECORATIVA INSTITUCIONAL
        // =========================================================================
        drawPlant: function(ctx, x, y) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.beginPath();
            ctx.ellipse(x + 18, y + 26, 14, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#4E3C32";
            ctx.beginPath();
            ctx.moveTo(x + 7, y + 12);
            ctx.lineTo(x + 29, y + 12);
            ctx.lineTo(x + 26, y + 27);
            ctx.lineTo(x + 10, y + 27);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "#6B5346";
            ctx.lineWidth = 1;
            ctx.stroke();

            drawRoundedRect(ctx, x + 6, y + 10, 24, 3, 1.5);
            ctx.fillStyle = "#705648";
            ctx.fill();

            const leaves = [
                { cx: x + 18, cy: y + 5, rx: 5, ry: 10, rot: 0, color: "#2D6A4F" },
                { cx: x + 12, cy: y + 7, rx: 6, ry: 9, rot: -0.4, color: "#40916C" },
                { cx: x + 24, cy: y + 7, rx: 6, ry: 9, rot: 0.4, color: "#52B788" },
                { cx: x + 9, cy: y + 11, rx: 5, ry: 7, rot: -0.7, color: "#1B4332" },
                { cx: x + 27, cy: y + 11, rx: 5, ry: 7, rot: 0.7, color: "#2D6A4F" }
            ];

            leaves.forEach((leaf) => {
                ctx.save();
                ctx.translate(leaf.cx, leaf.cy);
                ctx.rotate(leaf.rot);
                ctx.fillStyle = leaf.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, leaf.rx, leaf.ry, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        },

        // =========================================================================
        // MAMPARAS Y ELEMENTOS DECORATIVOS ARQUITECTÓNICOS
        // =========================================================================
        drawWallPartition: function(ctx, wall) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
            drawRoundedRect(ctx, wall.x + 3, wall.y + 4, wall.width, wall.height, 3);
            ctx.fill();

            drawRoundedRect(ctx, wall.x, wall.y, wall.width, wall.height, 3);
            ctx.fillStyle = "#1E2A3A";
            ctx.fill();
            ctx.strokeStyle = "#2E3F57";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Riel superior
            ctx.fillStyle = "#364A66";
            ctx.fillRect(wall.x, wall.y, wall.width, 3);
        },

        drawDecor: function(ctx, decor) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
            drawRoundedRect(ctx, decor.x + 3, decor.y + 4, decor.width, decor.height, 4);
            ctx.fill();

            if (decor.type === "cabinet" || decor.type === "vault") {
                drawRoundedRect(ctx, decor.x, decor.y, decor.width, decor.height, 4);
                ctx.fillStyle = decor.type === "vault" ? "#19222E" : "#222D3E";
                ctx.fill();
                ctx.strokeStyle = "#384A63";
                ctx.lineWidth = 1.2;
                ctx.stroke();

                ctx.fillStyle = "#5A7291";
                ctx.fillRect(decor.x + 4, decor.y + 8, decor.width - 8, 2);
                ctx.fillRect(decor.x + 4, decor.y + 20, decor.width - 8, 2);
            } else {
                // Mesas auxiliares / reunión
                drawRoundedRect(ctx, decor.x, decor.y, decor.width, decor.height, 5);
                ctx.fillStyle = "#26201E";
                ctx.fill();
                ctx.strokeStyle = "#3D3430";
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            if (decor.label) {
                ctx.fillStyle = "#7D90A6";
                ctx.font = "600 7px 'JetBrains Mono', monospace";
                ctx.fillText(decor.label, decor.x + 6, decor.y + decor.height - 6);
            }
        },

        // =========================================================================
        // ESCENARIO AMPLIO COMPLETO (1160 x 740)
        // =========================================================================
        drawRoom: function(ctx, state) {
            const now = Date.now();
            const currentRoom = state.currentRoom;
            const door = state.door;
            const worldW = state.world.width;
            const worldH = state.world.height;

            // Base de suelo técnico institucional
            ctx.fillStyle = "#11161F";
            ctx.fillRect(0, 0, worldW, worldH);

            const tileDark = "#141C27";
            const tileLight = "#17202C";

            // Baldosas amplias
            for (let y = 22; y < worldH - 24; y += 46) {
                for (let x = 20; x < worldW - 24; x += 52) {
                    ctx.fillStyle = ((x + y) / 40) % 2 === 0 ? tileLight : tileDark;
                    ctx.fillRect(x, y, 51, 45);
                }
            }

            // Separador arquitectónico
            ctx.strokeStyle = "#1D2736";
            ctx.lineWidth = 1;
            ctx.strokeRect(20.5, 22.5, worldW - 41, worldH - 45);

            // Canalizaciones de red
            ctx.save();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(75, 110, 148, 0.35)";
            ctx.beginPath();
            ctx.moveTo(30, 90);
            ctx.lineTo(worldW - 40, 90);
            ctx.stroke();

            ctx.strokeStyle = "rgba(90, 110, 130, 0.28)";
            ctx.beginPath();
            ctx.moveTo(30, worldH - 100);
            ctx.lineTo(worldW - 40, worldH - 100);
            ctx.stroke();
            ctx.restore();

            // Franjas de advertencia en el umbral de la salida
            ctx.save();
            const hazardX = door.x - 26;
            const hazardY = door.y - 2;
            const hazardW = 24;
            const hazardH = door.height + 4;

            drawRoundedRect(ctx, hazardX, hazardY, hazardW, hazardH, 3);
            ctx.fillStyle = "#151C27";
            ctx.fill();
            ctx.clip();

            ctx.strokeStyle = door.locked ? "rgba(200, 75, 82, 0.35)" : "rgba(63, 163, 124, 0.45)";
            ctx.lineWidth = 3;
            for (let stripeY = hazardY - 14; stripeY < hazardY + hazardH + 14; stripeY += 10) {
                ctx.beginPath();
                ctx.moveTo(hazardX - 4, stripeY);
                ctx.lineTo(hazardX + hazardW + 4, stripeY + hazardW);
                ctx.stroke();
            }
            ctx.restore();

            // Muros perimetrales
            ctx.fillStyle = "#192230";
            ctx.fillRect(0, 0, worldW, 22);
            ctx.fillRect(0, worldH - 22, worldW, 22);
            ctx.fillRect(0, 22, 20, worldH - 44);
            // Pared derecha dividida por el vano de la puerta
            ctx.fillRect(worldW - 20, 22, 20, door.y - 22);
            ctx.fillRect(worldW - 20, door.y + door.height, 20, worldH - 22 - (door.y + door.height));

            // Zócalos y molduras
            ctx.fillStyle = "#2D3B4F";
            ctx.fillRect(0, 20, worldW, 2.5);
            ctx.fillRect(0, worldH - 22, worldW, 2.5);
            ctx.fillRect(18, 22, 2.5, worldH - 44);
            ctx.fillRect(worldW - 20, 22, 2.5, door.y - 22);
            ctx.fillRect(worldW - 20, door.y + door.height, 2.5, worldH - 22 - (door.y + door.height));

            // Luminarias superiores
            for (let lx = 35; lx < worldW - 40; lx += 80) {
                drawRoundedRect(ctx, lx, 6, 50, 8, 3);
                ctx.fillStyle = "#232F40";
                ctx.fill();

                drawRoundedRect(ctx, lx + 4, 8, 42, 4, 2);
                ctx.fillStyle = "#E4EDF7";
                ctx.fill();

                const coneGrad = ctx.createLinearGradient(lx + 25, 20, lx + 25, 80);
                coneGrad.addColorStop(0, "rgba(228, 237, 247, 0.05)");
                coneGrad.addColorStop(1, "rgba(228, 237, 247, 0.0)");
                ctx.fillStyle = coneGrad;
                ctx.beginPath();
                ctx.moveTo(lx + 2, 20);
                ctx.lineTo(lx + 48, 20);
                ctx.lineTo(lx + 58, 80);
                ctx.lineTo(lx - 8, 80);
                ctx.closePath();
                ctx.fill();
            }

            // Dibujar mamparas divisorias
            const layout = window.Game.ROOM_LAYOUTS[currentRoom];
            if (layout) {
                if (layout.walls) {
                    layout.walls.forEach((wall) => this.drawWallPartition(ctx, wall));
                }
                if (layout.decor) {
                    layout.decor.forEach((dec) => this.drawDecor(ctx, dec));
                }
                if (layout.desks) {
                    layout.desks.forEach((desk, idx) => this.drawDesk(ctx, state, desk.x, desk.y, desk.width, desk.label, idx));
                }
                if (layout.racks) {
                    layout.racks.forEach((rack) => this.drawServerRack(ctx, state, rack.x, rack.y, rack.label));
                }
                if (layout.plants) {
                    layout.plants.forEach((plant) => this.drawPlant(ctx, plant.x, plant.y));
                }
            }

            // Partículas ambientales de polvo
            if (state.ambientParticles && state.ambientParticles.length > 0) {
                for (let i = 0; i < state.ambientParticles.length; i++) {
                    const p = state.ambientParticles[i];
                    const pAlpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(now / 800 + p.pulseSeed));
                    ctx.fillStyle = `rgba(220, 235, 250, ${pAlpha})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Placa institucional de la sección
            drawRoundedRect(ctx, 28, 28, 180, 18, 4);
            ctx.fillStyle = "rgba(20, 28, 40, 0.88)";
            ctx.fill();
            ctx.strokeStyle = "#2E3D52";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#E8EEF5";
            ctx.font = "700 8.5px 'JetBrains Mono', monospace";
            const roomName = (window.Game.ROOM_NAMES && window.Game.ROOM_NAMES[currentRoom]) || "";
            ctx.fillText(roomName, 36, 40);

            // ==========================================================
            // PUERTA DE CONTROL PERICIAL
            // ==========================================================
            if (door.locked) {
                drawRoundedRect(ctx, door.x - 2, door.y - 2, door.width + 4, door.height + 4, 3);
                ctx.fillStyle = "#161D27";
                ctx.fill();
                ctx.strokeStyle = "#2E3B4D";
                ctx.lineWidth = 1;
                ctx.stroke();

                drawRoundedRect(ctx, door.x + 2, door.y + 2, door.width - 4, door.height - 4, 2);
                ctx.fillStyle = "#4A1F23";
                ctx.fill();
                ctx.strokeStyle = "#702A30";
                ctx.lineWidth = 1;
                ctx.stroke();

                drawRoundedRect(ctx, door.x + 18, door.y + 48, 4, 10, 1);
                ctx.fillStyle = "#C84B52";
                ctx.fill();

                ctx.fillStyle = "#E88D93";
                ctx.font = "700 7px 'JetBrains Mono', monospace";
                ctx.fillText("RESTRINGIDO", door.x - 85, door.y + door.height + 16);
            } else {
                const pulse = 0.28 + Math.sin(now / 280) * 0.08;
                const beamGrad = ctx.createLinearGradient(door.x, door.y + 52, door.x - 140, door.y + 52);
                beamGrad.addColorStop(0, `rgba(63, 163, 124, ${pulse * 0.85})`);
                beamGrad.addColorStop(0.5, `rgba(63, 163, 124, ${pulse * 0.35})`);
                beamGrad.addColorStop(1, "rgba(63, 163, 124, 0)");

                ctx.save();
                ctx.fillStyle = beamGrad;
                ctx.beginPath();
                ctx.moveTo(door.x, door.y);
                ctx.lineTo(door.x, door.y + door.height);
                ctx.lineTo(door.x - 135, door.y + door.height + 30);
                ctx.lineTo(door.x - 135, door.y - 30);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                drawRoundedRect(ctx, door.x - 2, door.y - 2, door.width + 4, door.height + 4, 3);
                ctx.fillStyle = "#1E3B30";
                ctx.fill();
                ctx.strokeStyle = "#3FA37C";
                ctx.lineWidth = 1;
                ctx.stroke();

                drawRoundedRect(ctx, door.x + 18, door.y + 48, 4, 10, 1);
                ctx.fillStyle = "#3FA37C";
                ctx.fill();

                const arrowShift = Math.floor((now / 180) % 3);
                const arrowX = door.x - 42 + arrowShift * 6;
                const arrowY = door.y + Math.floor(door.height / 2) + 5;

                ctx.fillStyle = "#3FA37C";
                ctx.font = "bold 13px 'Inter', sans-serif";
                ctx.fillText("» » »", arrowX, arrowY);

                ctx.fillStyle = "#7ED4B2";
                ctx.font = "700 7px 'JetBrains Mono', monospace";
                ctx.fillText("AUTORIZADO", door.x - 80, door.y + door.height + 16);
            }
        },

        // =========================================================================
        // JUGADOR: AUDITOR / PERITO FORENSE
        // =========================================================================
        drawPlayer: function(ctx, state) {
            const player = state.player;
            const isMoving = state.isMoving;
            const walkTimer = state.walkTimer;
            const facing = player.facing || "down";

            ctx.save();
            const centerX = player.x + 13;
            const footY = player.y + 26;

            const stepCycle = isMoving ? Math.sin(walkTimer) : 0;
            const bob = isMoving ? Math.abs(Math.sin(walkTimer)) * 1.5 : 0;
            const sway = isMoving ? Math.sin(walkTimer) * 0.05 : 0;

            // Sombra en el suelo
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            ctx.beginPath();
            ctx.ellipse(centerX, footY - 2, 11, 4.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Piernas
            const leftLegOffset = isMoving ? stepCycle * 3.5 : 0;
            const rightLegOffset = isMoving ? -stepCycle * 3.5 : 0;

            drawRoundedRect(ctx, centerX - 7, footY - 14 + leftLegOffset * 0.5, 5, 11, 2);
            ctx.fillStyle = "#1E2734";
            ctx.fill();

            drawRoundedRect(ctx, centerX - 8, footY - 4 + leftLegOffset, 6.5, 4, 1.5);
            ctx.fillStyle = "#0F141C";
            ctx.fill();

            drawRoundedRect(ctx, centerX + 2, footY - 14 + rightLegOffset * 0.5, 5, 11, 2);
            ctx.fillStyle = "#1E2734";
            ctx.fill();

            drawRoundedRect(ctx, centerX + 1.5, footY - 4 + rightLegOffset, 6.5, 4, 1.5);
            ctx.fillStyle = "#0F141C";
            ctx.fill();

            // Torso y cabeza
            ctx.save();
            ctx.translate(centerX, footY - 16 - bob);
            ctx.rotate(sway);

            if (facing === "up") {
                const armL_Y = isMoving ? -stepCycle * 2.5 : 0;
                const armR_Y = isMoving ? stepCycle * 2.5 : 0;

                drawRoundedRect(ctx, -11, -9 + armL_Y, 4, 11, 2);
                ctx.fillStyle = "#243242";
                ctx.fill();

                drawRoundedRect(ctx, 7, -9 + armR_Y, 4, 11, 2);
                ctx.fillStyle = "#243242";
                ctx.fill();

                drawRoundedRect(ctx, -8, -12, 16, 14, 3);
                ctx.fillStyle = "#2A3A4D";
                ctx.fill();
                ctx.strokeStyle = "#384A60";
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.strokeStyle = "#1C2735";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.lineTo(0, 2);
                ctx.stroke();

                drawRoundedRect(ctx, -5, -14, 10, 3, 1.5);
                ctx.fillStyle = "#1E2938";
                ctx.fill();

                ctx.fillStyle = "#221C1A";
                ctx.beginPath();
                ctx.arc(0, -18, 5.8, 0, Math.PI * 2);
                ctx.fill();

                drawRoundedRect(ctx, -6, -24, 12, 8, [5, 5, 2, 2]);
                ctx.fillStyle = "#2B2321";
                ctx.fill();
            } else {
                const armL_Y = isMoving ? -stepCycle * 2.5 : 0;
                const armR_Y = isMoving ? stepCycle * 2.5 : 0;

                drawRoundedRect(ctx, -11, -9 + armL_Y, 4, 11, 2);
                ctx.fillStyle = "#243242";
                ctx.fill();
                ctx.fillStyle = "#E5B288";
                ctx.beginPath();
                ctx.arc(-9, 3 + armL_Y, 1.8, 0, Math.PI * 2);
                ctx.fill();

                drawRoundedRect(ctx, 7, -9 + armR_Y, 4, 11, 2);
                ctx.fillStyle = "#243242";
                ctx.fill();
                ctx.fillStyle = "#E5B288";
                ctx.beginPath();
                ctx.arc(9, 3 + armR_Y, 1.8, 0, Math.PI * 2);
                ctx.fill();

                drawRoundedRect(ctx, -8, -12, 16, 14, 3);
                ctx.fillStyle = "#2A3A4D";
                ctx.fill();
                ctx.strokeStyle = "#384A60";
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = "#E8EEF5";
                ctx.beginPath();
                ctx.moveTo(-3, -12);
                ctx.lineTo(3, -12);
                ctx.lineTo(0, -7);
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = "#18212D";
                ctx.beginPath();
                ctx.moveTo(-1, -12);
                ctx.lineTo(1, -12);
                ctx.lineTo(1.5, -4);
                ctx.lineTo(0, -2);
                ctx.lineTo(-1.5, -4);
                ctx.closePath();
                ctx.fill();

                let badgeX = -1;
                let eyeL_X = -2.5;
                let eyeR_X = 2.5;
                let headOffsetX = 0;

                if (facing === "left") {
                    badgeX = -4;
                    eyeL_X = -4.5;
                    eyeR_X = -1;
                    headOffsetX = -1.2;
                } else if (facing === "right") {
                    badgeX = 2;
                    eyeL_X = 1;
                    eyeR_X = 4.5;
                    headOffsetX = 1.2;
                }

                drawRoundedRect(ctx, badgeX, -7, 4, 5.5, 1);
                ctx.fillStyle = "#D99B26";
                ctx.fill();
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(badgeX + 0.8, -5.5, 2.4, 2);

                ctx.fillStyle = "#E5B288";
                ctx.fillRect(-2 + headOffsetX, -14, 4, 3);

                ctx.fillStyle = "#F0C49F";
                ctx.beginPath();
                ctx.arc(headOffsetX, -18, 5.6, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#1D2733";
                ctx.beginPath();
                ctx.arc(eyeL_X + headOffsetX * 0.3, -18, 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(eyeR_X + headOffsetX * 0.3, -18, 1, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#2B2321";
                ctx.beginPath();
                ctx.arc(headOffsetX, -20, 6, Math.PI, Math.PI * 2);
                ctx.fill();
                drawRoundedRect(ctx, -6 + headOffsetX, -23, 12, 6, [5, 5, 0, 0]);
                ctx.fill();
            }

            ctx.restore();
            ctx.restore();
        },

        // =========================================================================
        // MARCADOR [E] FLOTANTE
        // =========================================================================
        drawInteractionMarker: function(ctx, state) {
            const active = state.activeInteraction;
            if (!active) return;

            const now = Date.now();
            const floatOffset = Math.sin(now / 220) * 2.5;
            const markerX = active.x + active.width / 2;
            const markerY = Math.max(34, active.y - 12) + floatOffset;

            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            drawRoundedRect(ctx, markerX - 11, markerY - 9, 22, 18, 5);
            ctx.fill();

            drawRoundedRect(ctx, markerX - 11, markerY - 11, 22, 18, 5);
            ctx.fillStyle = "#192230";
            ctx.fill();
            ctx.strokeStyle = "#D99B26";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 10px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("E", markerX, markerY - 2);
            ctx.textAlign = "start";
            ctx.textBaseline = "alphabetic";
        },

        // =========================================================================
        // MINI-PLANO (RADAR DE SECTOR) DISCRETO EN PANTALLA (FUERA DE CÁMARA)
        // =========================================================================
        drawMiniMap: function(ctx, state) {
            const vpW = state.viewport.width;
            const vpH = state.viewport.height;
            const worldW = state.world.width;
            const worldH = state.world.height;

            const miniW = 130;
            const miniH = 84;
            const miniX = vpW - miniW - 14;
            const miniY = vpH - miniH - 14;

            // Fondo semitransparente del mini-plano
            drawRoundedRect(ctx, miniX, miniY, miniW, miniH, 5);
            ctx.fillStyle = "rgba(16, 23, 33, 0.88)";
            ctx.fill();
            ctx.strokeStyle = "#2D3E56";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Etiqueta del radar
            ctx.fillStyle = "#7E92A9";
            ctx.font = "700 7px 'JetBrains Mono', monospace";
            ctx.fillText("RADAR // SECTOR", miniX + 7, miniY + 11);

            const scaleX = miniW / worldW;
            const scaleY = miniH / worldH;

            // Muros y mamparas internas en el mini-plano
            const layout = window.Game.ROOM_LAYOUTS[state.currentRoom];
            if (layout && layout.walls) {
                ctx.fillStyle = "#34455C";
                layout.walls.forEach((w) => {
                    ctx.fillRect(
                        miniX + Math.round(w.x * scaleX),
                        miniY + Math.round(w.y * scaleY),
                        Math.max(2, Math.round(w.width * scaleX)),
                        Math.max(2, Math.round(w.height * scaleY))
                    );
                });
            }

            // Pistas / Evidencias (ámbar si pendiente, verde si leída)
            if (layout && layout.desks) {
                layout.desks.forEach((desk, idx) => {
                    const isRead = state.readClues.has(`${state.currentRoom}_${idx}`);
                    ctx.fillStyle = isRead ? "#3FA37C" : "#D99B26";
                    ctx.beginPath();
                    ctx.arc(
                        miniX + Math.round((desk.x + desk.width / 2) * scaleX),
                        miniY + Math.round((desk.y + 29) * scaleY),
                        2.5,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                });
            }

            // Barra de la puerta en la pared derecha del mini-plano
            ctx.fillStyle = state.door.locked ? "#C84B52" : "#3FA37C";
            ctx.fillRect(
                miniX + miniW - 3,
                miniY + Math.round(state.door.y * scaleY),
                3,
                Math.round(state.door.height * scaleY)
            );

            // Posición del jugador (punto blanco brillante)
            const pX = miniX + Math.round((state.player.x + 13) * scaleX);
            const pY = miniY + Math.round((state.player.y + 13) * scaleY);

            ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
            ctx.beginPath();
            ctx.arc(pX, pY, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(pX, pY, 2, 0, Math.PI * 2);
            ctx.fill();
        },

        // =========================================================================
        // MÉTODO PRINCIPAL DRAW (CON CÁMARA SUAVE Y MINI-MAPA)
        // =========================================================================
        draw: function(ctx, state) {
            // Limpiar fondo del visor
            ctx.fillStyle = "#0E131B";
            ctx.fillRect(0, 0, state.viewport.width, state.viewport.height);

            // 1. DIBUJAR MUNDO TRASLADADO POR LA CÁMARA
            ctx.save();
            ctx.translate(-Math.round(state.camera.x), -Math.round(state.camera.y));

            this.drawRoom(ctx, state);
            this.drawPlayer(ctx, state);
            this.drawInteractionMarker(ctx, state);

            ctx.restore();

            // 2. DIBUJAR ELEMENTOS FIJOS EN PANTALLA (RADAR DE SECTOR)
            if (state.mode !== "MENU" && state.mode !== "VICTORY") {
                this.drawMiniMap(ctx, state);
            }
        }
    };
})();
