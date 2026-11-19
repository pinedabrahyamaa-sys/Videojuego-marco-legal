/**
 * renderer.js - Renderizador 2D HD Ilustrado y Forense (Opción A)
 * Estilo novela gráfica / ilustración técnica limpia de alta definición.
 * Sin pixel art, sin neón cyberpunk. 100% offline y vectorial en Canvas.
 */
window.Game = window.Game || {};

(function() {
    "use strict";

    // Helper seguro para rectángulos con esquinas redondeadas
    function drawRoundedRect(ctx, x, y, width, height, radius) {
        if (width <= 0 || height <= 0) return;
        try {
            if (ctx.roundRect) {
                ctx.beginPath();
                ctx.roundRect(x, y, width, height, radius);
                return;
            }
        } catch (e) {
            // Fallback manual si roundRect rechaza radios o no está disponible
        }
        ctx.beginPath();
        let tl = 4, tr = 4, br = 4, bl = 4;
        if (typeof radius === "number") {
            tl = tr = br = bl = radius;
        } else if (Array.isArray(radius)) {
            if (radius.length === 1) {
                tl = tr = br = bl = radius[0];
            } else if (radius.length === 2) {
                tl = br = radius[0];
                tr = bl = radius[1];
            } else if (radius.length === 4) {
                tl = radius[0];
                tr = radius[1];
                br = radius[2];
                bl = radius[3];
            }
        }
        const maxR = Math.min(width / 2, height / 2);
        tl = Math.max(0, Math.min(tl || 0, maxR));
        tr = Math.max(0, Math.min(tr || 0, maxR));
        br = Math.max(0, Math.min(br || 0, maxR));
        bl = Math.max(0, Math.min(bl || 0, maxR));

        ctx.moveTo(x + tl, y);
        ctx.lineTo(x + width - tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
        ctx.lineTo(x + width, y + height - br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
        ctx.lineTo(x + bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
        ctx.lineTo(x, y + tl);
        ctx.quadraticCurveTo(x, y, x + tl, y);
        ctx.closePath();
    }

    const INK_OUTLINE = "#0B0F14";

    window.Game.Renderer = {
        // =========================================================================
        // SILLA DE OFICINA ERGONÓMICA ILUSTRADA
        // =========================================================================
        drawChair: function(ctx, x, y) {
            ctx.save();

            // Sombra suave en el suelo
            ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
            ctx.beginPath();
            ctx.ellipse(x + 10, y + 15, 12, 7, 0, 0, Math.PI * 2);
            ctx.fill();

            // Base de estrella de 5 puntas con ruedas
            ctx.strokeStyle = "#151B22";
            ctx.lineWidth = 2.2;
            ctx.lineCap = "round";
            const cx = x + 10;
            const cy = y + 14;
            const armLen = 9;

            for (let a = 0; a < 5; a++) {
                const ang = (a * (Math.PI * 2 / 5)) + Math.PI / 2;
                const ex = cx + Math.cos(ang) * armLen;
                const ey = cy + Math.sin(ang) * armLen * 0.65;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(ex, ey);
                ctx.stroke();

                // Rueda pequeña en el extremo
                ctx.fillStyle = "#0A0D11";
                ctx.beginPath();
                ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Columna central neumática
            ctx.fillStyle = "#303844";
            ctx.fillRect(cx - 2, cy - 6, 4, 6);

            // Asiento acolchado contorneado
            drawRoundedRect(ctx, x + 2, y + 6, 16, 11, 4);
            ctx.fillStyle = "#1E2633";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.3;
            ctx.stroke();

            // Respaldo ergonómico curvo
            drawRoundedRect(ctx, x + 3, y - 1, 14, 8, [5, 5, 2, 2]);
            ctx.fillStyle = "#273243";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.3;
            ctx.stroke();

            // Apoyabrazos acolchados
            drawRoundedRect(ctx, x, y + 5, 2.5, 9, 1.5);
            ctx.fillStyle = "#161D26";
            ctx.fill();
            ctx.stroke();

            drawRoundedRect(ctx, x + 17.5, y + 5, 2.5, 9, 1.5);
            ctx.fillStyle = "#161D26";
            ctx.fill();
            ctx.stroke();

            ctx.restore();
        },

        // =========================================================================
        // PUESTO DE TRABAJO FORENSE DETALLADO
        // =========================================================================
        drawDesk: function(ctx, state, x, y, width, label, index) {
            const now = Date.now();
            const currentRoom = state.currentRoom;
            const clueKey = `${currentRoom}_${index}`;
            const isRead = state.readClues.has(clueKey);
            const textures = window.Game.Textures;

            ctx.save();

            // Sombra proyectada del escritorio
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            drawRoundedRect(ctx, x + 4, y + 6, width - 2, 58, 6);
            ctx.fill();

            // Tablero principal con textura de madera cálida o degradado satinado
            drawRoundedRect(ctx, x, y, width, 56, 5);
            if (textures && textures.woodDesk) {
                ctx.fillStyle = textures.woodDesk;
            } else {
                const woodGrad = ctx.createLinearGradient(x, y, x, y + 56);
                woodGrad.addColorStop(0, "#563C29");
                woodGrad.addColorStop(0.5, "#483222");
                woodGrad.addColorStop(1, "#3D2A1C");
                ctx.fillStyle = woodGrad;
            }
            ctx.fill();

            // Bisel exterior con tinta técnica oscura
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Borde superior iluminado del escritorio
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 5, y + 1);
            ctx.lineTo(x + width - 5, y + 1);
            ctx.stroke();

            // Rebaje frontal del escritorio
            ctx.fillStyle = "#221710";
            ctx.fillRect(x + 3, y + 52, width - 6, 4);

            const monitorX = x + Math.floor((width - 46) / 2);

            // Base y peana del monitor
            ctx.fillStyle = "#1E252E";
            drawRoundedRect(ctx, monitorX + 13, y + 31, 20, 4, 1.5);
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#2B3440";
            ctx.fillRect(monitorX + 21, y + 25, 4, 7);

            // Marco del monitor widescreen
            drawRoundedRect(ctx, monitorX, y + 7, 46, 21, 3);
            ctx.fillStyle = "#12171E";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Pantalla LCD con consola forense
            drawRoundedRect(ctx, monitorX + 2.5, y + 9, 41, 17, 2);
            ctx.fillStyle = "#0C1219";
            ctx.fill();

            // Líneas de registro de consola pericial en pantalla
            const isClueDesk = (index === 0 || index === 2);
            ctx.fillStyle = isClueDesk ? "#567A99" : "#3B4E63";
            ctx.fillRect(monitorX + 5, y + 12, 14, 1.5);
            ctx.fillRect(monitorX + 5, y + 15, 22, 1.5);
            ctx.fillRect(monitorX + 5, y + 18, 18, 1.5);
            ctx.fillRect(monitorX + 5, y + 21, 26, 1.5);

            // Cursor parpadeante sutil en el monitor
            if (Math.sin(now / 350) > 0) {
                ctx.fillStyle = isClueDesk ? "#86B4DB" : "#4A6B8A";
                ctx.fillRect(monitorX + 32, y + 21, 3, 2);
            }

            // Teclado estilizado con teclas
            const kbX = monitorX + 4;
            const kbY = y + 37;
            drawRoundedRect(ctx, kbX, kbY, 26, 10, 2);
            ctx.fillStyle = "#1A222B";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Barra espaciadora y filas
            ctx.fillStyle = "#283442";
            ctx.fillRect(kbX + 2, kbY + 2, 22, 1.5);
            ctx.fillRect(kbX + 2, kbY + 5, 22, 1.5);
            ctx.fillStyle = "#3E4F63";
            ctx.fillRect(kbX + 7, kbY + 7.5, 12, 1.5);

            // Alfombrilla y Mouse
            const mousePadX = monitorX + 33;
            const mousePadY = y + 36;
            drawRoundedRect(ctx, mousePadX, mousePadY, 9, 12, 2);
            ctx.fillStyle = "#131A22";
            ctx.fill();

            drawRoundedRect(ctx, mousePadX + 2, mousePadY + 2.5, 5, 7, 2);
            ctx.fillStyle = "#2D3745";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Hojas de expediente impreso (color marfil / archivo #F4EFE6)
            const docX = x + width - 36;
            const docY = y + 14;

            // Hoja inferior
            ctx.save();
            ctx.translate(docX + 8, docY + 12);
            ctx.rotate(0.08);
            drawRoundedRect(ctx, -8, -12, 17, 23, 1.5);
            ctx.fillStyle = "#E5DCCE";
            ctx.fill();
            ctx.restore();

            // Hoja superior
            drawRoundedRect(ctx, docX, docY, 17, 23, 1.5);
            ctx.fillStyle = "#F4EFE6";
            ctx.fill();
            ctx.strokeStyle = "rgba(40, 30, 20, 0.4)";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Texto simulado en el expediente
            ctx.fillStyle = "#3A352F";
            ctx.fillRect(docX + 2.5, docY + 4, 12, 1.2);
            ctx.fillStyle = "#70685E";
            ctx.fillRect(docX + 2.5, docY + 7.5, 10, 1);
            ctx.fillRect(docX + 2.5, docY + 10.5, 11, 1);
            ctx.fillRect(docX + 2.5, docY + 13.5, 8, 1);
            ctx.fillRect(docX + 2.5, docY + 16.5, 10, 1);

            // Sello judicial rojo lacre en la esquina del expediente
            ctx.fillStyle = "rgba(180, 50, 55, 0.65)";
            ctx.beginPath();
            ctx.arc(docX + 12, docY + 18, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Taza de café de cerámica institucional
            const cupX = x + width - 14;
            const cupY = y + 42;

            ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
            ctx.beginPath();
            ctx.ellipse(cupX + 1, cupY + 1.5, 4.5, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#EAE3D2";
            ctx.beginPath();
            ctx.arc(cupX, cupY, 4.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 0.9;
            ctx.stroke();

            ctx.fillStyle = "#5A3825";
            ctx.beginPath();
            ctx.arc(cupX, cupY, 3, 0, Math.PI * 2);
            ctx.fill();

            // Asa de la taza
            ctx.strokeStyle = "#EAE3D2";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(cupX + 3.8, cupY, 1.8, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();

            // Silla de oficina detrás del escritorio
            this.drawChair(ctx, x + Math.floor(width / 2) - 10, y + 59);

            // Rótulo del Puesto Pericial
            ctx.fillStyle = "#8F9FA8";
            ctx.font = "600 7.5px 'JetBrains Mono', monospace";
            ctx.fillText(label, x + 6, y + 50);

            // Marcador de cotejo de pista (Editorial: rombo/sello discreto)
            const layout = window.Game.ROOM_LAYOUTS ? window.Game.ROOM_LAYOUTS[currentRoom] : null;
            const deskData = layout && layout.desks ? layout.desks[index] : null;
            const isDoc = deskData && deskData.clueType === "document";
            const clueSpotX = isDoc ? docX + 8.5 : monitorX + 23;
            const clueSpotY = isDoc ? docY + 11.5 : y + 17.5;

            const isDeskRead = state.readClues.has(`${currentRoom}_desk_${index}`) || state.readClues.has(`${currentRoom}_${index}`);
            const isDeskNoise = deskData && !!deskData.isNoise;

            this.drawInspectionMarker(ctx, clueSpotX, clueSpotY, isDeskRead, isDeskNoise, now);

            ctx.restore();
        },

        // =========================================================================
        // GABINETES DE SERVIDORES Y TELECOMUNICACIONES
        // =========================================================================
        drawServerRack: function(ctx, state, x, y, label) {
            const now = Date.now();
            const currentRoom = state.currentRoom;
            const textures = window.Game.Textures;

            ctx.save();

            // Sombra del rack
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            drawRoundedRect(ctx, x + 4, y + 6, 56, 106, 5);
            ctx.fill();

            // Estructura exterior del gabinete
            drawRoundedRect(ctx, x, y, 56, 106, 4);
            if (textures && textures.rackMetal) {
                ctx.fillStyle = textures.rackMetal;
            } else {
                ctx.fillStyle = "#161D26";
            }
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Biseles de los rieles de montaje
            ctx.fillStyle = "#263242";
            ctx.fillRect(x + 4, y + 4, 3, 98);
            ctx.fillRect(x + 49, y + 4, 3, 98);

            // 5 Bahías de servidores apiladas (1U / 2U)
            for (let bay = 0; bay < 5; bay++) {
                const bayY = y + 7 + bay * 19;

                drawRoundedRect(ctx, x + 9, bayY, 38, 16, 2);
                ctx.fillStyle = bay % 2 === 0 ? "#1C242F" : "#202A37";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 0.9;
                ctx.stroke();

                // Manijas metálicas de extracción rápida
                ctx.fillStyle = "#3A4B5F";
                ctx.fillRect(x + 10, bayY + 3, 2, 10);
                ctx.fillRect(x + 43, bayY + 3, 2, 10);

                // Ranuras horizontales de disco duro y flujo de aire
                ctx.fillStyle = "#0D1218";
                for (let v = 0; v < 3; v++) {
                    ctx.fillRect(x + 15 + v * 6, bayY + 5, 4.5, 6);
                }

                // LEDs de estado discretos y realistas (sin halos gigantes)
                const phase1 = (x * 19 + bay * 37);
                const isBlink1On = Math.sin((now / 240) + phase1) > -0.15;
                const isAlertNode = (bay === 2 && currentRoom === 3) || (bay === 1 && currentRoom === 2);

                let ledColor = isBlink1On ? "#3FA37C" : "#1B3F30";
                if (isAlertNode) {
                    ledColor = isBlink1On ? "#D99B26" : "#4A3512";
                }

                ctx.fillStyle = ledColor;
                ctx.beginPath();
                ctx.arc(x + 36, bayY + 6, 1.6, 0, Math.PI * 2);
                ctx.fill();

                const phase2 = (x * 31 + bay * 53);
                const isBlink2On = Math.sin((now / 150) + phase2) > 0.40;
                ctx.fillStyle = isBlink2On ? "#6EA4D6" : "#1B2A38";
                ctx.beginPath();
                ctx.arc(x + 40.5, bayY + 6, 1.4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Puerta de malla semitransparente perforada
            ctx.fillStyle = "rgba(10, 15, 22, 0.25)";
            drawRoundedRect(ctx, x + 7, y + 5, 42, 96, 2);
            ctx.fill();

            // Etiqueta de precinto pericial ("EVIDENCIA - ART. 29") en racks comprometidos
            if (currentRoom === 3 || currentRoom === 2) {
                const sealX = x + 15;
                const sealY = y + 84;
                ctx.save();
                drawRoundedRect(ctx, sealX, sealY, 26, 8, 1);
                ctx.fillStyle = "#F4EFE6";
                ctx.fill();
                ctx.strokeStyle = "#8B263E";
                ctx.lineWidth = 0.9;
                ctx.stroke();

                ctx.fillStyle = "#8B263E";
                ctx.font = "bold 4.5px 'JetBrains Mono', monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("EVIDENCIA // ART.29", sealX + 13, sealY + 4);
                ctx.restore();
            }

            // Etiqueta del Rack
            ctx.fillStyle = "#8F9FA8";
            ctx.font = "600 7.5px 'JetBrains Mono', monospace";
            ctx.fillText(label, x + 8, y + 115);

            ctx.restore();
        },

        // =========================================================================
        // PLANTA DECORATIVA INSTITUCIONAL
        // =========================================================================
        drawPlant: function(ctx, x, y) {
            ctx.save();

            // Sombra en el suelo
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.beginPath();
            ctx.ellipse(x + 18, y + 27, 14, 6.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Maceta cerámica cónica mate
            ctx.fillStyle = "#3E3029";
            ctx.beginPath();
            ctx.moveTo(x + 7, y + 12);
            ctx.lineTo(x + 29, y + 12);
            ctx.lineTo(x + 26, y + 27);
            ctx.lineTo(x + 10, y + 27);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.3;
            ctx.stroke();

            // Borde superior de la maceta
            drawRoundedRect(ctx, x + 6, y + 10, 24, 3.5, 1.5);
            ctx.fillStyle = "#5E483C";
            ctx.fill();
            ctx.stroke();

            // Tierra abonada
            ctx.fillStyle = "#1E1612";
            ctx.beginPath();
            ctx.ellipse(x + 18, y + 12, 10, 2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Hojas botánicas orgánicas en doble tono verde
            const leaves = [
                { cx: x + 18, cy: y + 4, rx: 5.5, ry: 11, rot: 0, c1: "#2D6A4F", c2: "#40916C" },
                { cx: x + 12, cy: y + 6, rx: 6, ry: 10, rot: -0.45, c1: "#1B4332", c2: "#2D6A4F" },
                { cx: x + 24, cy: y + 6, rx: 6, ry: 10, rot: 0.45, c1: "#40916C", c2: "#52B788" },
                { cx: x + 8, cy: y + 11, rx: 5, ry: 8, rot: -0.75, c1: "#1B4332", c2: "#2D6A4F" },
                { cx: x + 28, cy: y + 11, rx: 5, ry: 8, rot: 0.75, c1: "#2D6A4F", c2: "#40916C" }
            ];

            leaves.forEach((leaf) => {
                ctx.save();
                ctx.translate(leaf.cx, leaf.cy);
                ctx.rotate(leaf.rot);

                // Mitad izquierda de la hoja
                ctx.fillStyle = leaf.c1;
                ctx.beginPath();
                ctx.ellipse(0, 0, leaf.rx, leaf.ry, 0, Math.PI / 2, Math.PI * 1.5);
                ctx.fill();

                // Mitad derecha con brillo sutil
                ctx.fillStyle = leaf.c2;
                ctx.beginPath();
                ctx.ellipse(0, 0, leaf.rx, leaf.ry, 0, -Math.PI / 2, Math.PI / 2);
                ctx.fill();

                // Nervadura central entintada
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(0, -leaf.ry + 1);
                ctx.lineTo(0, leaf.ry - 1);
                ctx.stroke();

                ctx.restore();
            });

            ctx.restore();
        },

        // =========================================================================
        // MAMPARAS Y ELEMENTOS DECORATIVOS ARQUITECTÓNICOS
        // =========================================================================
        drawWallPartition: function(ctx, wall) {
            const textures = window.Game.Textures;
            ctx.save();

            // Sombra arrojada al suelo
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            drawRoundedRect(ctx, wall.x + 3, wall.y + 4, wall.width, wall.height, 3);
            ctx.fill();

            // Cuerpo de la mampara
            drawRoundedRect(ctx, wall.x, wall.y, wall.width, wall.height, 3);
            if (textures && textures.wallTop) {
                ctx.fillStyle = textures.wallTop;
            } else {
                ctx.fillStyle = "#1E2A3A";
            }
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Marco / riel superior arquitectónico con bisel
            ctx.fillStyle = "#2D3F57";
            ctx.fillRect(wall.x, wall.y, wall.width, 3);
            ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            ctx.fillRect(wall.x, wall.y, wall.width, 1);

            ctx.restore();
        },

        // =========================================================================
        // MARCADOR DE COTEJO E INSPECCIÓN PERICIAL (EVIDENCIAS Y DESCARTE)
        // =========================================================================
        drawInspectionMarker: function(ctx, x, y, isRead, isNoise, now) {
            ctx.save();
            if (!isRead) {
                // Rombo editorial ámbar pulsante (#D99B26) idéntico para pistas reales y de descarte
                const pulse = 0.85 + Math.sin(now / 260) * 0.15;
                const dSize = 7 * pulse;

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(Math.PI / 4);

                // Halo sutil
                ctx.fillStyle = "rgba(217, 155, 38, 0.22)";
                ctx.fillRect(-dSize - 2, -dSize - 2, (dSize + 2) * 2, (dSize + 2) * 2);

                // Rombo principal
                ctx.fillStyle = "#D99B26";
                ctx.fillRect(-dSize, -dSize, dSize * 2, dSize * 2);
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 1.2;
                ctx.strokeRect(-dSize, -dSize, dSize * 2, dSize * 2);
                ctx.restore();

                // Signo de exclamación técnico
                ctx.fillStyle = "#11161F";
                ctx.font = "bold 8.5px 'Inter', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("!", x, y);
            } else if (!isNoise) {
                // Sello verde esmeralda mate (#3FA37C) con check de inspección para pistas reales
                ctx.fillStyle = "#3FA37C";
                ctx.beginPath();
                ctx.arc(x, y, 6.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#D4EFE3";
                ctx.lineWidth = 1.2;
                ctx.stroke();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 8px 'Inter', sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("✓", x, y);
            } else {
                // Sello gris neutro (#475569) con guión (—) para registro inspeccionado auxiliar
                ctx.fillStyle = "#475569";
                ctx.beginPath();
                ctx.arc(x, y, 6.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#94A3B8";
                ctx.lineWidth = 1.2;
                ctx.stroke();

                ctx.fillStyle = "#F1F5F9";
                ctx.font = "bold 9px 'JetBrains Mono', monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("—", x, y - 0.5);
            }
            ctx.restore();
        },

        // =========================================================================
        // PROPS 2D HD PROCEDURALES LIMPIOS (ESTÉTICA NOVELA GRÁFICA / FORENSE)
        // =========================================================================

        // 1. ARCHIVADOR METÁLICO GRIS CON CAJONES Y ETIQUETAS
        drawFilingCabinet: function(ctx, x, y, width, height, label) {
            ctx.save();
            // Sombra suave
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            drawRoundedRect(ctx, x + 3, y + 4, width, height, 4);
            ctx.fill();

            // Cuerpo metálico principal con bisel
            drawRoundedRect(ctx, x, y, width, height, 3);
            const grad = ctx.createLinearGradient(x, y, x, y + height);
            grad.addColorStop(0, "#3E4A59");
            grad.addColorStop(1, "#28313C");
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Resalte superior
            ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            ctx.fillRect(x + 2, y + 1, width - 4, 1.5);

            // 3 cajones con tiradores y porta-etiquetas
            const numDrawers = 3;
            const drawerH = Math.floor((height - 8) / numDrawers);
            for (let i = 0; i < numDrawers; i++) {
                const dy = y + 4 + i * drawerH;
                drawRoundedRect(ctx, x + 3, dy + 1, width - 6, drawerH - 2, 2);
                ctx.fillStyle = i % 2 === 0 ? "#333D4A" : "#2E3743";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 0.9;
                ctx.stroke();

                // Tirador metálico alargado
                ctx.fillStyle = "#8FA0B5";
                ctx.fillRect(x + Math.floor(width / 2) - 8, dy + Math.floor(drawerH / 2) + 1, 16, 2.2);

                // Porta-etiqueta marfil
                drawRoundedRect(ctx, x + Math.floor(width / 2) - 6, dy + 3, 12, 4.5, 1);
                ctx.fillStyle = "#ECE6D8";
                ctx.fill();
                ctx.strokeStyle = "rgba(30,30,30,0.3)";
                ctx.lineWidth = 0.6;
                ctx.stroke();
                ctx.fillStyle = "#3A4555";
                ctx.fillRect(x + Math.floor(width / 2) - 4, dy + 5, 8, 0.8);
            }

            if (label) {
                ctx.fillStyle = "#7E92A8";
                ctx.font = "600 6.5px 'JetBrains Mono', monospace";
                ctx.fillText(label, x + 4, y + height + 9);
            }
            ctx.restore();
        },

        // 2. IMPRESORA MULTIFUNCIÓN DE OFICINA CON BANDEJA DE PAPEL
        drawPrinter: function(ctx, x, y, width, height, label) {
            ctx.save();
            // Sombra
            ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
            drawRoundedRect(ctx, x + 3, y + 4, width, height, 4);
            ctx.fill();

            // Cuerpo base (chasis grafito)
            drawRoundedRect(ctx, x, y + 12, width, height - 12, 3);
            ctx.fillStyle = "#1E2632";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Cubierta superior plana / escáner en gris claro institucional
            drawRoundedRect(ctx, x + 1, y, width - 2, 14, 2);
            ctx.fillStyle = "#DDE3EB";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Vidrio del escáner con reflejo
            drawRoundedRect(ctx, x + 4, y + 2, width - 18, 9, 1);
            ctx.fillStyle = "#C2CBD6";
            ctx.fill();

            // Panel de control digital / LCD
            drawRoundedRect(ctx, x + width - 12, y + 2, 9, 10, 1);
            ctx.fillStyle = "#0E141C";
            ctx.fill();
            ctx.fillStyle = "#3FA37C"; // LED de encendido verde
            ctx.beginPath();
            ctx.arc(x + width - 7.5, y + 5, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#4B6E94"; // Pantalla LCD
            ctx.fillRect(x + width - 10, y + 7.5, 5, 3);

            // Bandeja de salida frontal
            const trayW = width - 14;
            drawRoundedRect(ctx, x + 7, y + height - 8, trayW, 6, 1.5);
            ctx.fillStyle = "#141A22";
            ctx.fill();

            // Hojas de papel saliendo de la bandeja con líneas simuladas
            drawRoundedRect(ctx, x + 9, y + height - 12, trayW - 4, 7, 1);
            ctx.fillStyle = "#F8FAFC";
            ctx.fill();
            ctx.strokeStyle = "rgba(40,40,40,0.2)";
            ctx.lineWidth = 0.6;
            ctx.stroke();

            ctx.fillStyle = "#64748B";
            ctx.fillRect(x + 11, y + height - 10, trayW - 8, 0.9);
            ctx.fillRect(x + 11, y + height - 8, trayW - 12, 0.9);

            if (label) {
                ctx.fillStyle = "#7E92A8";
                ctx.font = "600 6.5px 'JetBrains Mono', monospace";
                ctx.fillText(label, x + 3, y + height + 9);
            }
            ctx.restore();
        },

        // 3. PIZARRA BLANCA CON TRAZOS DE DIAGRAMAS Y NOTAS
        drawWhiteboard: function(ctx, x, y, width, height, label) {
            ctx.save();
            // Sombra
            ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
            drawRoundedRect(ctx, x + 2, y + 3, width, height, 3);
            ctx.fill();

            // Marco de aluminio
            drawRoundedRect(ctx, x, y, width, height, 3);
            ctx.fillStyle = "#5A6B7E";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.3;
            ctx.stroke();

            // Superficie de porcelana blanca
            drawRoundedRect(ctx, x + 3, y + 3, width - 6, height - 6, 2);
            ctx.fillStyle = "#F8FAFC";
            ctx.fill();

            // Diagramas técnicos dibujados en la pizarra
            // Caja 1 (Frontend / Proceso)
            drawRoundedRect(ctx, x + 6, y + 6, 18, 10, 1);
            ctx.fillStyle = "#EFF6FF";
            ctx.fill();
            ctx.strokeStyle = "#3B82F6";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Flecha conectora
            ctx.strokeStyle = "#1E293B";
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(x + 24, y + 11);
            ctx.lineTo(x + 32, y + 11);
            ctx.stroke();

            // Caja 2 (Backend / Base de datos)
            drawRoundedRect(ctx, x + 33, y + 6, 18, 10, 1);
            ctx.fillStyle = "#F0FDF4";
            ctx.fill();
            ctx.strokeStyle = "#10B981";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Flecha secundaria
            if (width > 60) {
                ctx.beginPath();
                ctx.moveTo(x + 51, y + 11);
                ctx.lineTo(x + 58, y + 11);
                ctx.stroke();

                drawRoundedRect(ctx, x + 59, y + 6, 15, 10, 1);
                ctx.fillStyle = "#FEF3C7";
                ctx.fill();
                ctx.strokeStyle = "#F59E0B";
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            // Notas técnicas y viñetas
            ctx.fillStyle = "#334155";
            ctx.fillRect(x + 6, y + 19, width - 20, 1);
            ctx.fillRect(x + 6, y + 22, width - 28, 1);
            ctx.fillStyle = "#DC2626"; // Viñeta roja urgente
            ctx.beginPath();
            ctx.arc(x + 8, y + 26, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#475569";
            ctx.fillRect(x + 12, y + 25.5, width - 26, 1);

            // Bandeja de marcadores inferior
            ctx.fillStyle = "#334155";
            ctx.fillRect(x + 6, y + height - 2.5, width - 12, 2.5);

            // Marcadores en la bandeja
            ctx.fillStyle = "#2563EB"; // Azul
            ctx.fillRect(x + 10, y + height - 4, 6, 1.5);
            ctx.fillStyle = "#DC2626"; // Rojo
            ctx.fillRect(x + 18, y + height - 4, 6, 1.5);
            ctx.fillStyle = "#0F172A"; // Negro
            ctx.fillRect(x + 26, y + height - 4, 6, 1.5);

            if (label) {
                ctx.fillStyle = "#7E92A8";
                ctx.font = "600 6.5px 'JetBrains Mono', monospace";
                ctx.fillText(label, x + 3, y + height + 9);
            }
            ctx.restore();
        },

        // 4. UNIDAD INDUSTRIAL DE AIRE ACONDICIONADO / UPS (SALA SERVIDORES)
        drawAcUnit: function(ctx, x, y, width, height, label) {
            const now = Date.now();
            ctx.save();
            // Sombra
            ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
            drawRoundedRect(ctx, x + 3, y + 4, width, height, 4);
            ctx.fill();

            // Carcasa de acero industrial
            drawRoundedRect(ctx, x, y, width, height, 3);
            const grad = ctx.createLinearGradient(x, y, x, y + height);
            grad.addColorStop(0, "#1F2833");
            grad.addColorStop(1, "#121820");
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Rejilla de ventilación industrial frontal (lamas horizontales biseladas)
            const grilleX = x + 6;
            const grilleY = y + 14;
            const grilleW = width - 12;
            const grilleH = height - 19;
            drawRoundedRect(ctx, grilleX, grilleY, grilleW, grilleH, 2);
            ctx.fillStyle = "#0B0E13";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 0.9;
            ctx.stroke();

            const numLouvers = 5;
            const louverStep = grilleH / numLouvers;
            for (let l = 0; l < numLouvers; l++) {
                const ly = grilleY + l * louverStep;
                ctx.fillStyle = "#25303D";
                ctx.fillRect(grilleX + 2, ly + 1, grilleW - 4, 2);
                ctx.fillStyle = "#0B0E13";
                ctx.fillRect(grilleX + 2, ly + 3, grilleW - 4, 1.5);
            }

            // Visor LED / Telemetría digital superior
            drawRoundedRect(ctx, x + 6, y + 3, width - 12, 8, 1.5);
            ctx.fillStyle = "#080C10";
            ctx.fill();

            // Lectura de temperatura digital en cian brillante
            ctx.fillStyle = "#22D3EE";
            ctx.font = "bold 5.5px 'JetBrains Mono', monospace";
            ctx.fillText("18°C", x + 9, y + 9);

            // LEDs de estado parpadeantes
            const isLedOn = Math.sin(now / 220) > 0;
            ctx.fillStyle = isLedOn ? "#34D399" : "#065F46"; // Heartbeat verde
            ctx.beginPath();
            ctx.arc(x + width - 14, y + 7, 1.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#60A5FA"; // Potencia / AC azul
            ctx.beginPath();
            ctx.arc(x + width - 9, y + 7, 1.3, 0, Math.PI * 2);
            ctx.fill();

            if (label) {
                ctx.fillStyle = "#7E92A8";
                ctx.font = "600 6.5px 'JetBrains Mono', monospace";
                ctx.fillText(label, x + 3, y + height + 9);
            }
            ctx.restore();
        },

        // 5. CAJA FUERTE / BÓVEDA METÁLICA OSCURA CON DIAL Y MANIJA
        drawSafe: function(ctx, x, y, width, height, label) {
            ctx.save();
            // Sombra
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            drawRoundedRect(ctx, x + 4, y + 5, width, height, 5);
            ctx.fill();

            // Carcasa de acero acorazado doble pared
            drawRoundedRect(ctx, x, y, width, height, 4);
            const grad = ctx.createLinearGradient(x, y, x + width, y + height);
            grad.addColorStop(0, "#222B36");
            grad.addColorStop(1, "#12171E");
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.6;
            ctx.stroke();

            // Puerta interior embutida
            drawRoundedRect(ctx, x + 4, y + 4, width - 8, height - 8, 3);
            ctx.fillStyle = "#182029";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Bisagras de seguridad en el lateral derecho
            ctx.fillStyle = "#4B5868";
            ctx.fillRect(x + width - 5, y + 8, 3.5, 7);
            ctx.fillRect(x + width - 5, y + height - 15, 3.5, 7);

            // Dial de combinación rotatorio en el centro
            const dialX = x + Math.floor(width / 2) - 4;
            const dialY = y + Math.floor(height / 2);
            const dialRad = 7.5;

            ctx.fillStyle = "#0D1117";
            ctx.beginPath();
            ctx.arc(dialX, dialY, dialRad + 1.5, 0, Math.PI * 2);
            ctx.fill();

            // Dial plateado con bisel
            const dialGrad = ctx.createLinearGradient(dialX - dialRad, dialY - dialRad, dialX + dialRad, dialY + dialRad);
            dialGrad.addColorStop(0, "#CBD5E1");
            dialGrad.addColorStop(1, "#475569");
            ctx.fillStyle = dialGrad;
            ctx.beginPath();
            ctx.arc(dialX, dialY, dialRad, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Perilla central
            ctx.fillStyle = "#0F172A";
            ctx.beginPath();
            ctx.arc(dialX, dialY, 2.8, 0, Math.PI * 2);
            ctx.fill();

            // Manija de bóveda de 3 radios
            const handleX = dialX + 13;
            const handleY = dialY;
            ctx.fillStyle = "#94A3B8";
            ctx.beginPath();
            ctx.arc(handleX, handleY, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(handleX, handleY - 6);
            ctx.lineTo(handleX, handleY + 6);
            ctx.moveTo(handleX - 5, handleY);
            ctx.lineTo(handleX + 5, handleY);
            ctx.stroke();

            // Lector de tarjetas / teclado de acceso en lateral izquierdo
            drawRoundedRect(ctx, x + 7, y + 9, 6, 9, 1);
            ctx.fillStyle = "#0F172A";
            ctx.fill();
            ctx.fillStyle = "#EF4444"; // LED rojo de bloqueo
            ctx.beginPath();
            ctx.arc(x + 10, y + 11.5, 1, 0, Math.PI * 2);
            ctx.fill();

            if (label) {
                ctx.fillStyle = "#7E92A8";
                ctx.font = "600 6.5px 'JetBrains Mono', monospace";
                ctx.fillText(label, x + 3, y + height + 9);
            }
            ctx.restore();
        },

        // 6. MESA DE JUNTAS LARGA DE MADERA OSCURA CON SILLAS ALREDEDOR
        drawConferenceTable: function(ctx, x, y, width, height, label) {
            const textures = window.Game.Textures;
            ctx.save();
            // Sombra
            ctx.fillStyle = "rgba(0, 0, 0, 0.44)";
            drawRoundedRect(ctx, x + 4, y + 6, width, height, 7);
            ctx.fill();

            // Tablero principal de madera noble
            drawRoundedRect(ctx, x, y, width, height, 6);
            if (textures && textures.woodDesk) {
                ctx.fillStyle = textures.woodDesk;
            } else {
                const woodGrad = ctx.createLinearGradient(x, y, x, y + height);
                woodGrad.addColorStop(0, "#4A3223");
                woodGrad.addColorStop(0.5, "#3D271A");
                woodGrad.addColorStop(1, "#301D13");
                ctx.fillStyle = woodGrad;
            }
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Bisel satinado superior
            ctx.strokeStyle = "rgba(255, 255, 255, 0.09)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + 6, y + 1.5);
            ctx.lineTo(x + width - 6, y + 1.5);
            ctx.stroke();

            // Pasacables / caja multimedia central de aluminio
            const grommetW = 32;
            const grommetH = 10;
            const grommetX = x + Math.floor((width - grommetW) / 2);
            const grommetY = y + Math.floor((height - grommetH) / 2);
            drawRoundedRect(ctx, grommetX, grommetY, grommetW, grommetH, 2);
            ctx.fillStyle = "#1E2733";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Sillas ejecutivas alrededor de la mesa
            const chairCount = 3;
            const chairSpacing = (width - 30) / (chairCount + 1);
            for (let c = 1; c <= chairCount; c++) {
                const cx = x + 15 + c * chairSpacing;
                // Silla norte
                drawRoundedRect(ctx, cx - 8, y - 9, 16, 7, 2);
                ctx.fillStyle = "#1E2633";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Silla sur
                drawRoundedRect(ctx, cx - 8, y + height + 2, 16, 7, 2);
                ctx.fillStyle = "#1E2633";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Carpetas de documentos en puestos de junta
            ctx.fillStyle = "#E5DCCE";
            ctx.fillRect(x + 20, y + 8, 12, 9);
            ctx.fillRect(x + width - 32, y + 8, 12, 9);
            ctx.fillRect(x + 20, y + height - 17, 12, 9);
            ctx.fillRect(x + width - 32, y + height - 17, 12, 9);

            if (label) {
                ctx.fillStyle = "#8F9FA8";
                ctx.font = "600 7px 'JetBrains Mono', monospace";
                ctx.fillText(label, x + 8, y + Math.floor(height / 2) + 2.5);
            }
            ctx.restore();
        },

        // 7. CAJAS DE ARCHIVO / EVIDENCIA DEL CICPC CON PRECINTO AMARILLO
        drawEvidenceBox: function(ctx, x, y, width, height, label) {
            ctx.save();
            // Sombra
            ctx.fillStyle = "rgba(0, 0, 0, 0.36)";
            drawRoundedRect(ctx, x + 3, y + 4, width, height, 3);
            ctx.fill();

            // Cuerpo de caja de cartón kraft
            drawRoundedRect(ctx, x, y, width, height, 2.5);
            const boxGrad = ctx.createLinearGradient(x, y, x, y + height);
            boxGrad.addColorStop(0, "#8D6E4F");
            boxGrad.addColorStop(1, "#6E5338");
            ctx.fillStyle = boxGrad;
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.3;
            ctx.stroke();

            // Tapa de cartón con solapas
            drawRoundedRect(ctx, x - 1, y, width + 2, 9, 2);
            ctx.fillStyle = "#9C7B59";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.1;
            ctx.stroke();

            // Agarraderas troqueladas en los laterales
            ctx.fillStyle = "#3E2D1D";
            drawRoundedRect(ctx, x + 3, y + 15, 3.5, 6, 1.5);
            ctx.fill();
            drawRoundedRect(ctx, x + width - 6.5, y + 15, 3.5, 6, 1.5);
            ctx.fill();

            // Precinto amarillo de custodia pericial CICPC cruzando la caja
            ctx.save();
            const tapeY = y + 13;
            ctx.fillStyle = "#FACC15";
            ctx.fillRect(x, tapeY, width, 8);
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 0.8;
            ctx.strokeRect(x, tapeY, width, 8);

            // Texto técnico "CICPC // EVIDENCIA"
            ctx.fillStyle = "#0B0F14";
            ctx.font = "bold 5px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("CICPC // EVIDENCIA", x + width / 2, tapeY + 4);
            ctx.restore();

            // Etiqueta blanca de registro forense con código de barras simulado
            drawRoundedRect(ctx, x + 6, y + 23, 14, 8, 1);
            ctx.fillStyle = "#F8FAFC";
            ctx.fill();
            ctx.strokeStyle = "rgba(40,40,40,0.3)";
            ctx.lineWidth = 0.5;
            ctx.stroke();

            ctx.fillStyle = "#1E293B";
            ctx.fillRect(x + 8, y + 25, 10, 1);
            ctx.fillRect(x + 8, y + 27, 8, 1);

            if (label) {
                ctx.fillStyle = "#8F9FA8";
                ctx.font = "600 6.5px 'JetBrains Mono', monospace";
                ctx.fillText(label, x + 2, y + height + 9);
            }
            ctx.restore();
        },

        // =========================================================================
        // PROCESADOR DECOR / MOBILIARIO GENERAL
        // =========================================================================
        drawDecor: function(ctx, decor, state, idx) {
            const propType = decor.propType || decor.type;
            const now = Date.now();

            switch (propType) {
                case "filingCabinet":
                    this.drawFilingCabinet(ctx, decor.x, decor.y, decor.width, decor.height, decor.label);
                    break;
                case "printer":
                    this.drawPrinter(ctx, decor.x, decor.y, decor.width, decor.height, decor.label);
                    break;
                case "whiteboard":
                    this.drawWhiteboard(ctx, decor.x, decor.y, decor.width, decor.height, decor.label);
                    break;
                case "acUnit":
                    this.drawAcUnit(ctx, decor.x, decor.y, decor.width, decor.height, decor.label);
                    break;
                case "safe":
                    this.drawSafe(ctx, decor.x, decor.y, decor.width, decor.height, decor.label);
                    break;
                case "conferenceTable":
                    this.drawConferenceTable(ctx, decor.x, decor.y, decor.width, decor.height, decor.label);
                    break;
                case "evidenceBox":
                    this.drawEvidenceBox(ctx, decor.x, decor.y, decor.width, decor.height, decor.label);
                    break;
                case "vault":
                    this.drawSafe(ctx, decor.x, decor.y, decor.width, decor.height, decor.label);
                    break;
                default:
                    // Mobiliario genérico (mesas auxiliares, mostradores)
                    ctx.save();
                    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                    drawRoundedRect(ctx, decor.x + 3, decor.y + 4, decor.width, decor.height, 4);
                    ctx.fill();

                    drawRoundedRect(ctx, decor.x, decor.y, decor.width, decor.height, 4);
                    ctx.fillStyle = "#26201E";
                    ctx.fill();
                    ctx.strokeStyle = INK_OUTLINE;
                    ctx.lineWidth = 1.4;
                    ctx.stroke();

                    if (decor.label) {
                        ctx.fillStyle = "#7D90A6";
                        ctx.font = "600 7px 'JetBrains Mono', monospace";
                        ctx.fillText(decor.label, decor.x + 6, decor.y + decor.height - 6);
                    }
                    ctx.restore();
                    break;
            }

            // Si el objeto es interactuable (evidencia o descarte de ruido), dibujar marcador
            if (decor.clue && state) {
                const key = decor.id || `${state.currentRoom}_prop_${idx}`;
                const isRead = state.readClues.has(key);
                const isNoise = !!decor.isNoise;
                const spotX = decor.x + decor.width / 2;
                const spotY = decor.y + Math.min(16, decor.height / 2);
                this.drawInspectionMarker(ctx, spotX, spotY, isRead, isNoise, now);
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
            const textures = window.Game.Textures;

            ctx.save();

            // Base de suelo técnico institucional
            if (textures && textures.floorConcrete) {
                ctx.fillStyle = textures.floorConcrete;
                ctx.fillRect(0, 0, worldW, worldH);
            } else {
                ctx.fillStyle = "#161D26";
                ctx.fillRect(0, 0, worldW, worldH);

                // Baldosas alternadas como fallback
                for (let y = 22; y < worldH - 24; y += 46) {
                    for (let x = 20; x < worldW - 24; x += 52) {
                        ctx.fillStyle = ((x + y) / 40) % 2 === 0 ? "#1C242F" : "#18202A";
                        ctx.fillRect(x, y, 51, 45);
                    }
                }
            }

            // Separador perimetral de dilatación
            ctx.strokeStyle = "#10151C";
            ctx.lineWidth = 1.2;
            ctx.strokeRect(20.5, 22.5, worldW - 41, worldH - 45);

            // =========================================================================
            // EMBLEMA DE LA DIVISIÓN DE DELITOS INFORMÁTICOS (SALA 1)
            // =========================================================================
            if (currentRoom === 1) {
                ctx.save();
                const emX = 100;
                const emY = 350;
                const rad = 32;

                // Sombra en el suelo
                ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                ctx.beginPath();
                ctx.arc(emX + 2, emY + 2, rad, 0, Math.PI * 2);
                ctx.fill();

                // Base circular institucional azul marino (#10203A)
                ctx.fillStyle = "#10203A";
                ctx.beginPath();
                ctx.arc(emX, emY, rad, 0, Math.PI * 2);
                ctx.fill();

                // Anillo dorado exterior
                ctx.strokeStyle = "#D9A738";
                ctx.lineWidth = 2.2;
                ctx.stroke();

                // Anillo interior fino
                ctx.beginPath();
                ctx.arc(emX, emY, rad - 5, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(217, 167, 56, 0.45)";
                ctx.lineWidth = 1;
                ctx.stroke();

                // Estrella de 8 puntas estilizada
                for (let p = 0; p < 8; p++) {
                    const ang = p * (Math.PI / 4);
                    const r1 = rad - 7;
                    const r2 = rad - 16;
                    const midAng = ang + Math.PI / 8;

                    ctx.beginPath();
                    ctx.moveTo(emX, emY);
                    ctx.lineTo(emX + Math.cos(ang) * r1, emY + Math.sin(ang) * r1);
                    ctx.lineTo(emX + Math.cos(midAng) * r2, emY + Math.sin(midAng) * r2);
                    ctx.closePath();
                    ctx.fillStyle = p % 2 === 0 ? "#E5BE60" : "#B88628";
                    ctx.fill();
                }

                // Núcleo central con balanza de la justicia
                ctx.fillStyle = "#0C1420";
                ctx.beginPath();
                ctx.arc(emX, emY, 11, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#D9A738";
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(emX - 5, emY - 2);
                ctx.lineTo(emX + 5, emY - 2);
                ctx.moveTo(emX, emY - 5);
                ctx.lineTo(emX, emY + 4);
                ctx.moveTo(emX - 2, emY + 4);
                ctx.lineTo(emX + 2, emY + 4);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(emX - 5, emY + 1, 2, 0, Math.PI);
                ctx.arc(emX + 5, emY + 1, 2, 0, Math.PI);
                ctx.stroke();

                // Leyenda pericial circular inferior
                ctx.fillStyle = "#EAE2D0";
                ctx.font = "bold 5.5px 'JetBrains Mono', monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("CICPC · DELITOS INFORMÁTICOS", emX, emY + rad + 8);
                ctx.restore();
            }

            // Canaletas de cables de red con funda técnica gris oscuro y abrazaderas
            ctx.save();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#253140";
            ctx.beginPath();
            ctx.moveTo(30, 90);
            ctx.lineTo(worldW - 40, 90);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(30, worldH - 100);
            ctx.lineTo(worldW - 40, worldH - 100);
            ctx.stroke();

            // Clips metálicos periódicos en las canaletas
            ctx.fillStyle = "#465870";
            for (let cx = 50; cx < worldW - 50; cx += 60) {
                ctx.fillRect(cx - 2, 87, 4, 6);
                ctx.fillRect(cx - 2, worldH - 103, 4, 6);
            }
            ctx.restore();

            // Cinta pericial de resguardo e inspección técnica (CICPC)
            ctx.save();
            const hazardX = door.x - 26;
            const hazardY = door.y - 2;
            const hazardW = 24;
            const hazardH = door.height + 4;

            drawRoundedRect(ctx, hazardX, hazardY, hazardW, hazardH, 3);
            ctx.fillStyle = door.locked ? "#121720" : "rgba(36, 107, 78, 0.22)";
            ctx.fill();
            ctx.clip();

            if (door.locked) {
                // Rayado diagonal de advertencia pericial en amarillo reflectivo (#D9A738) y negro
                ctx.strokeStyle = "#D9A738";
                ctx.lineWidth = 4;
                for (let stripeY = hazardY - 14; stripeY < hazardY + hazardH + 14; stripeY += 10) {
                    ctx.beginPath();
                    ctx.moveTo(hazardX - 4, stripeY);
                    ctx.lineTo(hazardX + hazardW + 4, stripeY + hazardW);
                    ctx.stroke();
                }

                // Cinta transversal pericial de resguardo
                ctx.fillStyle = "#D9A738";
                ctx.fillRect(hazardX + 1, hazardY + 8, hazardW - 2, 7.5);
                ctx.fillStyle = "#0B0F14";
                ctx.font = "bold 4.5px 'JetBrains Mono', monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("INSPECCIÓN", hazardX + hazardW / 2, hazardY + 12);

                ctx.fillStyle = "#D9A738";
                ctx.fillRect(hazardX + 1, hazardY + hazardH - 15, hazardW - 2, 7.5);
                ctx.fillStyle = "#0B0F14";
                ctx.fillText("CICPC", hazardX + hazardW / 2, hazardY + hazardH - 11);
            } else {
                // Paso despejado pericial en verde esmeralda mate
                ctx.strokeStyle = "rgba(63, 163, 124, 0.65)";
                ctx.lineWidth = 2.5;
                for (let stripeY = hazardY + 6; stripeY < hazardY + hazardH; stripeY += 12) {
                    ctx.beginPath();
                    ctx.moveTo(hazardX + 4, stripeY);
                    ctx.lineTo(hazardX + hazardW - 4, stripeY);
                    ctx.stroke();
                }
            }
            ctx.restore();

            // Muros perimetrales arquitectónicos con sombra y textura
            ctx.fillStyle = "#131922";
            ctx.fillRect(0, 0, worldW, 22);
            ctx.fillRect(0, worldH - 22, worldW, 22);
            ctx.fillRect(0, 22, 20, worldH - 44);
            // Pared derecha dividida por el vano de la puerta
            ctx.fillRect(worldW - 20, 22, 20, door.y - 22);
            ctx.fillRect(worldW - 20, door.y + door.height, 20, worldH - 22 - (door.y + door.height));

            // Cenefa horizontal institucional azul marino con filete dorado (CICPC)
            ctx.fillStyle = "#10203A";
            ctx.fillRect(0, 18, worldW, 4.5);
            ctx.fillStyle = "#D9A738";
            ctx.fillRect(0, 21.2, worldW, 1.3);

            // Zócalos y molduras entintadas
            ctx.fillStyle = "#2D3B4F";
            ctx.fillRect(0, worldH - 22, worldW, 2.5);
            ctx.fillRect(18, 22, 2.5, worldH - 44);
            ctx.fillRect(worldW - 20, 22, 2.5, door.y - 22);
            ctx.fillRect(worldW - 20, door.y + door.height, 2.5, worldH - 22 - (door.y + door.height));

            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1.4;
            ctx.strokeRect(0.5, 0.5, worldW - 1, 21.5);
            ctx.strokeRect(0.5, worldH - 22.5, worldW - 1, 22);

            // Luminarias empotradas en el techo con conos de luz arquitectónica cálida-neutra
            for (let lx = 35; lx < worldW - 40; lx += 80) {
                drawRoundedRect(ctx, lx, 5, 50, 9, 3);
                ctx.fillStyle = "#1E2734";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1;
                ctx.stroke();

                drawRoundedRect(ctx, lx + 4, 7, 42, 5, 2);
                ctx.fillStyle = "#F5F8FC";
                ctx.fill();

                // Cono de luz arquitectónica suave
                const coneGrad = ctx.createLinearGradient(lx + 25, 20, lx + 25, 85);
                coneGrad.addColorStop(0, "rgba(245, 248, 252, 0.05)");
                coneGrad.addColorStop(1, "rgba(245, 248, 252, 0.0)");
                ctx.fillStyle = coneGrad;
                ctx.beginPath();
                ctx.moveTo(lx + 2, 20);
                ctx.lineTo(lx + 48, 20);
                ctx.lineTo(lx + 60, 85);
                ctx.lineTo(lx - 10, 85);
                ctx.closePath();
                ctx.fill();
            }

            // Puerta de salida pericial
            ctx.save();
            drawRoundedRect(ctx, door.x, door.y, door.width, door.height, 3);
            ctx.fillStyle = door.locked ? "#7A2228" : "#246B4E";
            ctx.fill();
            ctx.strokeStyle = door.locked ? "#C84B52" : "#3FA37C";
            ctx.lineWidth = 1.6;
            ctx.stroke();

            // Cerrojo / Indicador visual de la puerta
            ctx.fillStyle = door.locked ? "#C84B52" : "#3FA37C";
            ctx.beginPath();
            ctx.arc(door.x + 8, door.y + door.height / 2, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // =========================================================================
            // ZONA ACORDONADA DE CUARENTENA / EQUIPO INCAUTADO (SALA 5)
            // =========================================================================
            if (currentRoom === 5) {
                ctx.save();
                const qX = 760, qY = 50, qW = 250, qH = 130;
                // Suelo tramado de advertencia pericial sutil
                ctx.strokeStyle = "rgba(217, 155, 38, 0.14)";
                ctx.lineWidth = 1;
                for (let sx = qX - qH; sx < qX + qW; sx += 18) {
                    ctx.beginPath();
                    ctx.moveTo(sx, qY + qH);
                    ctx.lineTo(sx + qH, qY);
                    ctx.stroke();
                }

                // Cinta perimetral amarilla reflectiva con guiones
                ctx.strokeStyle = "#EAB308";
                ctx.lineWidth = 2.5;
                ctx.setLineDash([8, 6]);
                ctx.strokeRect(qX, qY, qW, qH);
                ctx.setLineDash([]);

                // Rótulo pericial de custodia
                ctx.fillStyle = "rgba(17, 24, 39, 0.88)";
                drawRoundedRect(ctx, qX + 10, qY - 7, 190, 14, 3);
                ctx.fill();
                ctx.strokeStyle = "#EAB308";
                ctx.lineWidth = 1.1;
                ctx.stroke();

                ctx.fillStyle = "#EAB308";
                ctx.font = "bold 6px 'JetBrains Mono', monospace";
                ctx.textAlign = "start";
                ctx.textBaseline = "middle";
                ctx.fillText("CUARENTENA // EQUIPO INCAUTADO (CICPC)", qX + 16, qY);
                ctx.restore();
            }

            // Dibujar mamparas, decor y mobiliario
            const layout = window.Game.ROOM_LAYOUTS ? window.Game.ROOM_LAYOUTS[currentRoom] : null;
            if (layout) {
                if (layout.walls) {
                    layout.walls.forEach((wall) => this.drawWallPartition(ctx, wall));
                }
                if (layout.decor) {
                    layout.decor.forEach((dec, idx) => this.drawDecor(ctx, dec, state, idx));
                }
                if (layout.props) {
                    layout.props.forEach((prop, idx) => this.drawDecor(ctx, prop, state, idx));
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

            // Partículas ambientales de micro-polvo pericial
            if (state.ambientParticles && state.ambientParticles.length > 0) {
                for (let i = 0; i < state.ambientParticles.length; i++) {
                    const p = state.ambientParticles[i];
                    const pAlpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(now / 800 + p.pulseSeed));
                    ctx.fillStyle = `rgba(225, 235, 245, ${pAlpha})`;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.restore();
        },

        // =========================================================================
        // JUGADOR: PERITO FORENSE DEL CICPC (2D HD ILUSTRADO ~50PX)
        // =========================================================================
        drawPlayer: function(ctx, state) {
            const player = state.player;
            const isMoving = state.isMoving;
            const walkTimer = state.walkTimer;
            const facing = player.facing || "down";

            ctx.save();
            // Anclaje estricto en la caja de colisión (player.size = 26)
            const centerX = player.x + 13;
            const footY = player.y + 26;

            const stepCycle = isMoving ? Math.sin(walkTimer) : 0;
            const bob = isMoving ? Math.abs(Math.sin(walkTimer)) * 1.8 : 0;
            const sway = isMoving ? Math.sin(walkTimer) * 0.04 : 0;

            // Sombra ovalada suave proyectada en el suelo
            ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
            ctx.beginPath();
            ctx.ellipse(centerX, footY - 1, 15, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Piernas y calzado táctico con paso fluido (~50px altura visual total)
            const leftLegOffset = isMoving ? stepCycle * 4.5 : 0;
            const rightLegOffset = isMoving ? -stepCycle * 4.5 : 0;

            // Pantalón táctico oscuro (#141C26 con sombras #0C121A)
            // Pierna izquierda
            drawRoundedRect(ctx, centerX - 9, footY - 19 + leftLegOffset * 0.5, 6.5, 14, 2);
            ctx.fillStyle = "#141C26";
            ctx.fill();
            ctx.strokeStyle = INK_OUTLINE;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Zapato táctico izquierdo de cuero
            drawRoundedRect(ctx, centerX - 10, footY - 5.5 + leftLegOffset, 8.5, 5.5, 2);
            ctx.fillStyle = "#0A0D12";
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#222B38";
            ctx.fillRect(centerX - 10, footY - 1.5 + leftLegOffset, 8.5, 1.5);

            // Pierna derecha
            drawRoundedRect(ctx, centerX + 2.5, footY - 19 + rightLegOffset * 0.5, 6.5, 14, 2);
            ctx.fillStyle = "#141C26";
            ctx.fill();
            ctx.stroke();

            // Zapato táctico derecho de cuero
            drawRoundedRect(ctx, centerX + 1.5, footY - 5.5 + rightLegOffset, 8.5, 5.5, 2);
            ctx.fillStyle = "#0A0D12";
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#222B38";
            ctx.fillRect(centerX + 1.5, footY - 1.5 + rightLegOffset, 8.5, 1.5);

            // Torso superior, uniforme institucional del CICPC y rostro definido
            ctx.save();
            ctx.translate(centerX, footY - 20 - bob);
            ctx.rotate(sway);

            const armL_Y = isMoving ? -stepCycle * 3 : 0;
            const armR_Y = isMoving ? stepCycle * 3 : 0;

            if (facing === "up") {
                // ==================== VISTA TRASERA (FACING UP) ====================
                // Brazo izquierdo
                drawRoundedRect(ctx, -15.5, -17 + armL_Y, 5.5, 15, 2.5);
                ctx.fillStyle = "#0D1E38";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // Brazo derecho
                drawRoundedRect(ctx, 10, -17 + armR_Y, 5.5, 15, 2.5);
                ctx.fillStyle = "#0D1E38";
                ctx.fill();
                ctx.stroke();

                // Charreteras / hombreras doradas con ribete
                ctx.fillStyle = "#E5B842";
                ctx.fillRect(-14, -18 + armL_Y, 4, 1.6);
                ctx.fillRect(10, -18 + armR_Y, 4, 1.6);

                // Espalda de la chaqueta táctica azul marino (#0D1E38)
                drawRoundedRect(ctx, -11, -19, 22, 16, 3);
                ctx.fillStyle = "#0D1E38";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1.4;
                ctx.stroke();

                // Cinturón táctico negro con funda
                drawRoundedRect(ctx, -11, -3.5, 22, 3.5, 1);
                ctx.fillStyle = "#0A0D12";
                ctx.fill();
                ctx.stroke();

                // Franja reflectiva superior oscura en la espalda
                ctx.fillStyle = "#091322";
                ctx.fillRect(-10, -16.5, 20, 8);
                ctx.strokeStyle = "#E5B842";
                ctx.lineWidth = 0.9;
                ctx.strokeRect(-10, -16.5, 20, 8);

                // Siglas "CICPC" nítidas y más grandes en amarillo dorado reflectivo
                ctx.fillStyle = "#F0C24B";
                ctx.font = "bold 6.5px 'JetBrains Mono', monospace";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("CICPC", 0, -12.5);

                // Costura central inferior
                ctx.strokeStyle = "#1A3359";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, -8);
                ctx.lineTo(0, -3.5);
                ctx.stroke();

                // Cuello del uniforme
                drawRoundedRect(ctx, -7, -21.5, 14, 4, 2);
                ctx.fillStyle = "#081224";
                ctx.fill();
                ctx.stroke();

                // Nuca visible (piel masculina)
                drawRoundedRect(ctx, -3.5, -23, 7, 3.5, 1.5);
                ctx.fillStyle = "#E5B288";
                ctx.fill();

                // Orejas traseras sutiles
                ctx.fillStyle = "#E5B288";
                ctx.fillRect(-8.5, -27, 2, 4);
                ctx.fillRect(6.5, -27, 2, 4);

                // Cabeza posterior y corte de cabello táctico masculino
                ctx.fillStyle = "#1E1614";
                ctx.beginPath();
                ctx.arc(0, -26.5, 7.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // Degradado/volumen del cabello corto
                drawRoundedRect(ctx, -8, -33, 16, 9.5, [6, 6, 2, 2]);
                ctx.fillStyle = "#2D221F";
                ctx.fill();

            } else {
                // ==================== VISTA FRONTAL / LATERAL ====================
                const isSide = facing === "left" || facing === "right";
                const headDir = facing === "left" ? -1 : (facing === "right" ? 1 : 0);

                // Brazos
                drawRoundedRect(ctx, -15.5, -17 + armL_Y, 5.5, 15, 2.5);
                ctx.fillStyle = "#0D1E38";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // Mano izquierda
                ctx.fillStyle = "#E5B288";
                ctx.beginPath();
                ctx.arc(-12.8, -1 + armL_Y, 2.6, 0, Math.PI * 2);
                ctx.fill();

                // Libreta / carpeta de cadena de custodia en mano izquierda
                const clipX = -17.5;
                const clipY = -5 + armL_Y * 0.6;
                drawRoundedRect(ctx, clipX, clipY, 6.5, 9.5, 1);
                ctx.fillStyle = "#ECE5D8";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 0.8;
                ctx.stroke();

                ctx.fillStyle = "#1E2734";
                ctx.fillRect(clipX + 1.2, clipY, 4, 1.8);
                ctx.fillStyle = "#7A6F62";
                ctx.fillRect(clipX + 1, clipY + 3.5, 4.5, 0.8);
                ctx.fillRect(clipX + 1, clipY + 5.5, 4.5, 0.8);

                // Brazo derecho
                drawRoundedRect(ctx, 10, -17 + armR_Y, 5.5, 15, 2.5);
                ctx.fillStyle = "#0D1E38";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // Parche institucional en el hombro visible en vistas laterales
                if (isSide) {
                    const patchX = headDir > 0 ? 10.5 : -15;
                    drawRoundedRect(ctx, patchX, -16 + (headDir > 0 ? armR_Y : armL_Y), 4.5, 5.5, 1);
                    ctx.fillStyle = "#0D1E38";
                    ctx.fill();
                    ctx.strokeStyle = "#E5B842";
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                    ctx.fillStyle = "#E5B842";
                    ctx.fillRect(patchX + 0.8, -15 + (headDir > 0 ? armR_Y : armL_Y), 2.9, 1.5);
                }

                // Mano derecha
                ctx.fillStyle = "#E5B288";
                ctx.beginPath();
                ctx.arc(12.8, -1 + armR_Y, 2.6, 0, Math.PI * 2);
                ctx.fill();

                // Chaqueta táctica azul marino (#0D1E38 con sombras #081224)
                drawRoundedRect(ctx, -11, -19, 22, 16, 3);
                ctx.fillStyle = "#0D1E38";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1.4;
                ctx.stroke();

                // Charreteras doradas en los hombros
                ctx.fillStyle = "#E5B842";
                ctx.fillRect(-10, -18.5, 4, 1.5);
                ctx.fillRect(6, -18.5, 4, 1.5);

                // Cinturón táctico negro con hebilla metálica
                drawRoundedRect(ctx, -11, -3.5, 22, 3.5, 1);
                ctx.fillStyle = "#0A0D12";
                ctx.fill();
                ctx.stroke();

                // Hebilla metálica plateada/dorada
                ctx.fillStyle = "#E5B842";
                drawRoundedRect(ctx, -3, -3.5, 6, 3.5, 0.8);
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 0.6;
                ctx.stroke();
                ctx.fillStyle = "#0A0D12";
                ctx.fillRect(-1, -2.5, 2, 1.5);

                // Camisa interior clara y solapa
                ctx.fillStyle = "#E8EEF5";
                ctx.beginPath();
                ctx.moveTo(-4, -19);
                ctx.lineTo(4, -19);
                ctx.lineTo(0, -11);
                ctx.closePath();
                ctx.fill();

                // Corbata o cuello táctico oscuro
                ctx.fillStyle = "#08101E";
                ctx.beginPath();
                ctx.moveTo(-1.5, -19);
                ctx.lineTo(1.5, -19);
                ctx.lineTo(1.8, -8);
                ctx.lineTo(0, -6);
                ctx.lineTo(-1.8, -8);
                ctx.closePath();
                ctx.fill();

                // ==================== ESCUDO / PLACA POLICIAL DORADA ====================
                // Ubicado en el pecho (lado izquierdo del perito, viewer's right)
                const badgeX = isSide ? (headDir > 0 ? 3 : -7) : 3.5;
                const badgeY = -14.5;
                const badgeW = 6;
                const badgeH = 7.2;

                ctx.save();
                // Sombra sutil del escudo
                ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                ctx.beginPath();
                ctx.moveTo(badgeX + 0.5, badgeY + 0.5);
                ctx.lineTo(badgeX + badgeW + 0.5, badgeY + 0.5);
                ctx.lineTo(badgeX + badgeW + 0.5, badgeY + badgeH * 0.65);
                ctx.lineTo(badgeX + badgeW / 2 + 0.5, badgeY + badgeH + 0.5);
                ctx.lineTo(badgeX + 0.5, badgeY + badgeH * 0.65);
                ctx.closePath();
                ctx.fill();

                // Escudo dorado brillante (#E5B842)
                ctx.fillStyle = "#E5B842";
                ctx.beginPath();
                ctx.moveTo(badgeX, badgeY);
                ctx.lineTo(badgeX + badgeW, badgeY);
                ctx.lineTo(badgeX + badgeW, badgeY + badgeH * 0.65);
                ctx.lineTo(badgeX + badgeW / 2, badgeY + badgeH);
                ctx.lineTo(badgeX, badgeY + badgeH * 0.65);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 0.8;
                ctx.stroke();

                // Núcleo del escudo y destello metálico blanco (#FFF3C4)
                ctx.fillStyle = "#10203A";
                ctx.beginPath();
                ctx.arc(badgeX + badgeW / 2, badgeY + 3.2, 1.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#FFF3C4";
                ctx.fillRect(badgeX + 1, badgeY + 1, 1.5, 1.5);
                ctx.restore();

                // ==================== PORTA-CARNET / GAFETE INSTITUCIONAL ====================
                const idX = isSide ? (headDir > 0 ? -4 : -9.5) : -7.5;
                const idY = -12;

                // Cordón azul marino institucional
                ctx.strokeStyle = "#0D1E38";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-2, -18);
                ctx.lineTo(idX + 2.5, idY);
                ctx.lineTo(2, -18);
                ctx.stroke();

                // Tarjeta blanca con banda amarilla
                drawRoundedRect(ctx, idX, idY, 5, 6.5, 1);
                ctx.fillStyle = "#FFFFFF";
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 0.7;
                ctx.stroke();
                ctx.fillStyle = "#E5B842";
                ctx.fillRect(idX + 0.5, idY + 0.5, 4, 1.8);

                // ==================== CUELLO Y ROSTRO MASCULINO DEFINIDO ====================
                const headOffsetX = isSide ? headDir * 2.5 : 0;

                // Cuello definido sobre la camisa
                ctx.fillStyle = "#E5B288";
                ctx.fillRect(-3.2 + headOffsetX * 0.5, -21.5, 6.4, 4);
                ctx.fillStyle = "rgba(180, 110, 75, 0.35)"; // Sombra bajo la mandíbula
                ctx.fillRect(-3.2 + headOffsetX * 0.5, -21.5, 6.4, 1.5);

                // Cabeza base masculina con mandíbula angulada
                ctx.fillStyle = "#F0C49F";
                ctx.beginPath();
                ctx.arc(headOffsetX, -26.5, 7.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = INK_OUTLINE;
                ctx.lineWidth = 1.3;
                ctx.stroke();

                // Barbilla / mentón ligeramente cuadrado
                drawRoundedRect(ctx, -4.5 + headOffsetX, -23.5, 9, 4, 2);
                ctx.fillStyle = "#F0C49F";
                ctx.fill();

                // Sombra de barba recortada masculina (barba de dos días)
                ctx.fillStyle = "rgba(35, 25, 20, 0.22)";
                ctx.beginPath();
                ctx.arc(headOffsetX, -24.5, 6.5, 0.2, Math.PI - 0.2);
                ctx.fill();

                if (!isSide) {
                    // Orejas en vista frontal
                    ctx.fillStyle = "#E5B288";
                    ctx.fillRect(-8.4, -27, 2, 4.2);
                    ctx.fillRect(6.4, -27, 2, 4.2);

                    // Cejas masculinas definidas y rectas
                    ctx.fillStyle = "#1E1614";
                    ctx.fillRect(-5.8, -29.5, 4.2, 1.4);
                    ctx.fillRect(1.6, -29.5, 4.2, 1.4);

                    // Ojos nítidos oscuros con punto de brillo
                    ctx.fillStyle = "#0E141D";
                    ctx.beginPath();
                    ctx.arc(-3.6, -27, 1.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(3.6, -27, 1.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(-3.9, -27.4, 0.8, 0.8);
                    ctx.fillRect(3.3, -27.4, 0.8, 0.8);

                    // Tabique y sombra de nariz sutil
                    ctx.strokeStyle = "rgba(180, 110, 75, 0.65)";
                    ctx.lineWidth = 0.9;
                    ctx.beginPath();
                    ctx.moveTo(0, -28);
                    ctx.lineTo(0.5, -25.2);
                    ctx.lineTo(-0.8, -24.8);
                    ctx.stroke();

                    // Boca: línea seria y concentrada
                    ctx.fillStyle = "#8C5542";
                    ctx.fillRect(-1.8, -22.5, 3.6, 1);

                    // Cabello masculino corto con volumen táctico
                    ctx.fillStyle = "#1E1614";
                    drawRoundedRect(ctx, -8, -34, 16, 9.5, [7, 7, 1, 1]);
                    ctx.fill();
                    // Mechón / volumen superior
                    ctx.fillStyle = "#2D221F";
                    drawRoundedRect(ctx, -6.5, -34.8, 13, 5, [5, 5, 0, 0]);
                    ctx.fill();

                } else {
                    // Vista de perfil masculino (lateral)
                    const eyeX = headOffsetX + headDir * 2.6;
                    const earX = headOffsetX - headDir * 5.5;

                    // Oreja
                    ctx.fillStyle = "#E5B288";
                    ctx.fillRect(earX, -27, 2.2, 4.5);

                    // Ceja orientada
                    ctx.fillStyle = "#1E1614";
                    ctx.fillRect(eyeX - 1.5, -29.5, 4, 1.4);

                    // Ojo en perfil mirando al frente
                    ctx.fillStyle = "#0E141D";
                    ctx.beginPath();
                    ctx.arc(eyeX, -27, 1.3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(eyeX + (headDir > 0 ? 0.3 : -0.8), -27.3, 0.7, 0.7);

                    // Nariz en perfil que sobresale hacia la dirección
                    ctx.fillStyle = "#E5B288";
                    ctx.beginPath();
                    ctx.moveTo(headOffsetX + headDir * 5, -27);
                    ctx.lineTo(headOffsetX + headDir * 7.5, -25.5);
                    ctx.lineTo(headOffsetX + headDir * 5, -24.5);
                    ctx.closePath();
                    ctx.fill();

                    // Boca seria en perfil
                    ctx.fillStyle = "#8C5542";
                    ctx.fillRect(headOffsetX + headDir * 2, -22.5, 2.8, 1);

                    // Cabello táctico en perfil con corte desvanecido
                    ctx.fillStyle = "#1E1614";
                    drawRoundedRect(ctx, headOffsetX - 7, -34, 14, 9.5, [7, 7, 2, 2]);
                    ctx.fill();
                    ctx.fillStyle = "#2D221F";
                    drawRoundedRect(ctx, headOffsetX - 5.5, -34.8, 11, 4.8, [5, 5, 0, 0]);
                    ctx.fill();
                }
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
            const markerY = Math.max(34, active.y - 14) + floatOffset;

            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            drawRoundedRect(ctx, markerX - 11, markerY - 9, 22, 18, 5);
            ctx.fill();

            drawRoundedRect(ctx, markerX - 11, markerY - 11, 22, 18, 5);
            ctx.fillStyle = "#161D27";
            ctx.fill();
            ctx.strokeStyle = "#D99B26";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 10px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("E", markerX, markerY - 2);
            ctx.restore();
        },

        // =========================================================================
        // MINI-PLANO ARQUITECTÓNICO (BLUEPRINT) EN PANTALLA
        // =========================================================================
        drawMiniMap: function(ctx, state) {
            const vpW = state.viewport.width;
            const vpH = state.viewport.height;
            const worldW = state.world.width;
            const worldH = state.world.height;

            const miniW = 136;
            const miniH = 88;
            const miniX = vpW - miniW - 14;
            const miniY = vpH - miniH - 14;

            ctx.save();

            // Fondo translúcido de plano técnico / blueprint carbón
            drawRoundedRect(ctx, miniX, miniY, miniW, miniH, 5);
            ctx.fillStyle = "rgba(14, 19, 26, 0.88)";
            ctx.fill();
            ctx.strokeStyle = "#27394F";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Cuadrícula sutil de blueprint
            ctx.strokeStyle = "rgba(75, 110, 150, 0.12)";
            ctx.lineWidth = 0.8;
            for (let gx = miniX + 16; gx < miniX + miniW; gx += 20) {
                ctx.beginPath();
                ctx.moveTo(gx, miniY + 14);
                ctx.lineTo(gx, miniY + miniH - 4);
                ctx.stroke();
            }
            for (let gy = miniY + 24; gy < miniY + miniH; gy += 18) {
                ctx.beginPath();
                ctx.moveTo(miniX + 4, gy);
                ctx.lineTo(miniX + miniW - 4, gy);
                ctx.stroke();
            }

            // Encabezado técnico
            ctx.fillStyle = "#7E92A9";
            ctx.font = "700 7px 'JetBrains Mono', monospace";
            ctx.fillText("PLANO // SECTOR " + state.currentRoom, miniX + 7, miniY + 10);

            const scaleX = (miniW - 10) / worldW;
            const scaleY = (miniH - 16) / worldH;
            const offsetX = miniX + 5;
            const offsetY = miniY + 12;

            const layout = window.Game.ROOM_LAYOUTS ? window.Game.ROOM_LAYOUTS[state.currentRoom] : null;

            // Muros y mamparas internas en líneas de plano arquitectónico
            if (layout && layout.walls) {
                ctx.fillStyle = "#3B5270";
                layout.walls.forEach((w) => {
                    ctx.fillRect(
                        offsetX + Math.round(w.x * scaleX),
                        offsetY + Math.round(w.y * scaleY),
                        Math.max(2, Math.round(w.width * scaleX)),
                        Math.max(2, Math.round(w.height * scaleY))
                    );
                });
            }

            // Mobiliario en líneas finas (evidencias y descarte)
            if (layout && layout.desks) {
                layout.desks.forEach((desk, idx) => {
                    const isDeskRead = state.readClues.has(`${state.currentRoom}_desk_${idx}`) || state.readClues.has(`${state.currentRoom}_${idx}`);
                    const isDeskNoise = !!desk.isNoise;
                    ctx.fillStyle = !isDeskRead ? "#D99B26" : (!isDeskNoise ? "#3FA37C" : "#64748B");
                    ctx.beginPath();
                    ctx.arc(
                        offsetX + Math.round((desk.x + desk.width / 2) * scaleX),
                        offsetY + Math.round((desk.y + 29) * scaleY),
                        2.5,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                });
            }

            // Props / decor con pistas o descarte en el blueprint
            const minimapProps = (layout && layout.decor ? layout.decor : []).concat(layout && layout.props ? layout.props : []);
            minimapProps.forEach((dec, idx) => {
                if (dec.clue) {
                    const key = dec.id || `${state.currentRoom}_prop_${idx}`;
                    const isPropRead = state.readClues.has(key);
                    const isPropNoise = !!dec.isNoise;
                    ctx.fillStyle = !isPropRead ? "#D99B26" : (!isPropNoise ? "#3FA37C" : "#64748B");
                    ctx.beginPath();
                    ctx.arc(
                        offsetX + Math.round((dec.x + dec.width / 2) * scaleX),
                        offsetY + Math.round((dec.y + dec.height / 2) * scaleY),
                        2.5,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            });

            // Puerta pericial
            ctx.fillStyle = state.door.locked ? "#C84B52" : "#3FA37C";
            ctx.fillRect(
                offsetX + Math.round(state.door.x * scaleX) - 1,
                offsetY + Math.round(state.door.y * scaleY),
                3.5,
                Math.round(state.door.height * scaleY)
            );

            // Perito / auditor (punto blanco brillante con anillo de pulso)
            const pX = offsetX + Math.round((state.player.x + 13) * scaleX);
            const pY = offsetY + Math.round((state.player.y + 13) * scaleY);

            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.beginPath();
            ctx.arc(pX, pY, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(pX, pY, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        },

        // =========================================================================
        // MÉTODO PRINCIPAL DRAW (CON HIGH-DPI, CÁMARA SUAVE Y BLUEPRINT)
        // =========================================================================
        draw: function(ctx, state) {
            // Soporte High-DPI: transformar coordenadas para que 840x520 se renderice nítido en DPR 1x o 2x
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Limpiar fondo del visor
            ctx.fillStyle = "#0E131B";
            ctx.fillRect(0, 0, state.viewport.width, state.viewport.height);

            // 1. DIBUJAR MUNDO TRASLADADO POR LA CÁMARA
            ctx.save();
            ctx.translate(-Math.round(state.camera.x), -Math.round(state.camera.y));

            this.drawRoom(ctx, state);
            try {
                this.drawPlayer(ctx, state);
            } catch (err) {
                console.error("Error en drawPlayer:", err);
            }
            this.drawInteractionMarker(ctx, state);

            ctx.restore();

            // 2. DIBUJAR ELEMENTOS FIJOS EN PANTALLA (BLUEPRINT DE SECTOR)
            if (state.mode !== "MENU" && state.mode !== "VICTORY") {
                this.drawMiniMap(ctx, state);
            }
        }
    };
})();
