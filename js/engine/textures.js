/**
 * textures.js - Generador procedural de texturas 2D HD y patrones offscreen
 * Parte de la arquitectura técnica forense (100% offline, sin imágenes externas)
 */
window.Game = window.Game || {};

(function() {
    "use strict";

    const Textures = {
        floorConcrete: null,
        floorServerGrid: null,
        floorFinanceCarpet: null,
        floorLabTile: null,
        woodDesk: null,
        rackMetal: null,
        wallTop: null,
        initialized: false,

        init: function() {
            if (this.initialized) return;

            try {
                this.floorConcrete = this.createFloorConcretePattern();
                this.floorServerGrid = this.createFloorServerGridPattern();
                this.floorFinanceCarpet = this.createFloorFinanceCarpetPattern();
                this.floorLabTile = this.createFloorLabTilePattern();
                this.woodDesk = this.createWoodDeskPattern();
                this.rackMetal = this.createRackMetalPattern();
                this.wallTop = this.createWallTopPattern();
                this.initialized = true;
            } catch (err) {
                console.warn("Aviso: No se pudieron generar algunos patrones procedurales de textura.", err);
            }
        },

        /**
         * Patrón de baldosas amplias de concreto / pizarra gris oscuro (#242B33 y #20262E)
         * con juntas finas, micro-grano sutil y variación tonal por losa.
         */
        createFloorConcretePattern: function() {
            const size = 160;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            // Fondo base
            ctx.fillStyle = "#191F26";
            ctx.fillRect(0, 0, size, size);

            // 4 grandes losas técnicas (80x80 cada una)
            const tiles = [
                { x: 1, y: 1, w: 78, h: 78, col: "#222931" },
                { x: 81, y: 1, w: 78, h: 78, col: "#1E252D" },
                { x: 1, y: 81, w: 78, h: 78, col: "#20272F" },
                { x: 81, y: 81, w: 78, h: 78, col: "#242C35" }
            ];

            tiles.forEach((t) => {
                ctx.fillStyle = t.col;
                ctx.fillRect(t.x, t.y, t.w, t.h);

                // Bisel sutil en cada losa
                ctx.fillStyle = "rgba(255, 255, 255, 0.025)";
                ctx.fillRect(t.x, t.y, t.w, 1.5);
                ctx.fillRect(t.x, t.y, 1.5, t.h);

                ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                ctx.fillRect(t.x, t.y + t.h - 1.5, t.w, 1.5);
                ctx.fillRect(t.x + t.w - 1.5, t.y, 1.5, t.h);
            });

            // Micro-grano orgánico procedural (seguro ante entornos sin putImageData)
            if (ctx.getImageData && ctx.putImageData) {
                try {
                    const imgData = ctx.getImageData(0, 0, size, size);
                    const data = imgData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        const grain = (Math.random() - 0.5) * 8;
                        data[i] = Math.max(0, Math.min(255, data[i] + grain));
                        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
                        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
                    }
                    ctx.putImageData(imgData, 0, 0);
                } catch (e) {}
            }

            // Juntas finas de dilatación pericial
            ctx.strokeStyle = "#12161B";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(0.75, 0.75, size - 1.5, size - 1.5);
            ctx.beginPath();
            ctx.moveTo(80, 0);
            ctx.lineTo(80, size);
            ctx.moveTo(0, 80);
            ctx.lineTo(size, 80);
            ctx.stroke();

            return ctx.createPattern(canvas, "repeat");
        },

        /**
         * Sala 2 (Núcleo de Servidores): piso técnico elevado gris oscuro (#1a212a)
         * con rejillas metálicas perforadas y líneas de paneles técnicos modulares.
         */
        createFloorServerGridPattern: function() {
            const size = 120;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            ctx.fillStyle = "#131820";
            ctx.fillRect(0, 0, size, size);

            const tiles = [
                { x: 1, y: 1, w: 58, h: 58, col: "#1A212A" },
                { x: 61, y: 1, w: 58, h: 58, col: "#171D25" },
                { x: 1, y: 61, w: 58, h: 58, col: "#181E27" },
                { x: 61, y: 61, w: 58, h: 58, col: "#1B222C" }
            ];

            tiles.forEach((t, idx) => {
                ctx.fillStyle = t.col;
                ctx.fillRect(t.x, t.y, t.w, t.h);

                // Bisel perimetral metálico
                ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
                ctx.fillRect(t.x, t.y, t.w, 1.5);
                ctx.fillRect(t.x, t.y, 1.5, t.h);

                ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                ctx.fillRect(t.x, t.y + t.h - 1.5, t.w, 1.5);
                ctx.fillRect(t.x + t.w - 1.5, t.y, 1.5, t.h);

                // Tornillos de anclaje de esquina
                const corners = [
                    { x: t.x + 4, y: t.y + 4 },
                    { x: t.x + t.w - 4, y: t.y + 4 },
                    { x: t.x + 4, y: t.y + t.h - 4 },
                    { x: t.x + t.w - 4, y: t.y + t.h - 4 }
                ];
                corners.forEach(c => {
                    ctx.fillStyle = "#0D1117";
                    ctx.beginPath();
                    ctx.arc(c.x, c.y, 1.4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
                    ctx.fillRect(c.x - 1, c.y - 0.5, 2, 1);
                });

                // Rejillas perforadas de ventilación en baldosas seleccionadas
                if (idx === 1 || idx === 2) {
                    const gx = t.x + 12;
                    const gy = t.y + 12;
                    const gw = t.w - 24;
                    const gh = t.h - 24;
                    ctx.fillStyle = "#0F141A";
                    ctx.fillRect(gx, gy, gw, gh);
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(gx, gy, gw, gh);

                    ctx.fillStyle = "#080B0F";
                    for (let px = gx + 4; px <= gx + gw - 4; px += 5) {
                        for (let py = gy + 4; py <= gy + gh - 4; py += 5) {
                            ctx.beginPath();
                            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                }
            });

            // Juntas de dilatación del piso técnico
            ctx.strokeStyle = "#0E1318";
            ctx.lineWidth = 2;
            ctx.strokeRect(0.5, 0.5, size - 1, size - 1);
            ctx.beginPath();
            ctx.moveTo(60, 0);
            ctx.lineTo(60, size);
            ctx.moveTo(0, 60);
            ctx.lineTo(size, 60);
            ctx.stroke();

            return ctx.createPattern(canvas, "repeat");
        },

        /**
         * Sala 3 (Área Financiera): alfombra corporativa tejida en tono azul pizarra / carbón
         * sobrio (#1d2430) con micro-trama fina entrelazada.
         */
        createFloorFinanceCarpetPattern: function() {
            const size = 64;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            // Base azul pizarra sobrio
            ctx.fillStyle = "#1D2430";
            ctx.fillRect(0, 0, size, size);

            // Micro-trama tejida de alfombra corporativa
            for (let y = 0; y < size; y += 4) {
                for (let x = 0; x < size; x += 4) {
                    const isEven = ((x + y) / 4) % 2 === 0;
                    ctx.fillStyle = isEven ? "#222B39" : "#19202B";
                    ctx.fillRect(x, y, 4, 4);

                    // Micro-hebra texturada
                    ctx.fillStyle = isEven ? "rgba(255, 255, 255, 0.025)" : "rgba(0, 0, 0, 0.07)";
                    ctx.fillRect(x + 1, y + 1, 2, 2);
                }
            }

            // Cuadrícula arquitectónica de placas de alfombra (32x32)
            ctx.strokeStyle = "rgba(43, 56, 74, 0.45)";
            ctx.lineWidth = 1;
            ctx.strokeRect(0.5, 0.5, size - 1, size - 1);
            ctx.beginPath();
            ctx.moveTo(32, 0);
            ctx.lineTo(32, size);
            ctx.moveTo(0, 32);
            ctx.lineTo(size, 32);
            ctx.stroke();

            return ctx.createPattern(canvas, "repeat");
        },

        /**
         * Sala 5 (Laboratorio de Software): losas técnicas gris claro-medio (#27303a)
         * con juntas precisas y acabado clínico limpio.
         */
        createFloorLabTilePattern: function() {
            const size = 120;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            ctx.fillStyle = "#182028";
            ctx.fillRect(0, 0, size, size);

            const tiles = [
                { x: 1, y: 1, w: 58, h: 58, col: "#28323D" },
                { x: 61, y: 1, w: 58, h: 58, col: "#252F39" },
                { x: 1, y: 61, w: 58, h: 58, col: "#26303A" },
                { x: 61, y: 61, w: 58, h: 58, col: "#2A3440" }
            ];

            tiles.forEach(t => {
                ctx.fillStyle = t.col;
                ctx.fillRect(t.x, t.y, t.w, t.h);

                // Biselado perimetral nítido
                ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
                ctx.fillRect(t.x, t.y, t.w, 1.5);
                ctx.fillRect(t.x, t.y, 1.5, t.h);

                ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
                ctx.fillRect(t.x, t.y + t.h - 1.5, t.w, 1.5);
                ctx.fillRect(t.x + t.w - 1.5, t.y, 1.5, t.h);

                // Cuadrante central de acabado liso antiestático
                ctx.fillStyle = "rgba(255, 255, 255, 0.012)";
                ctx.fillRect(t.x + 8, t.y + 8, t.w - 16, t.h - 16);
            });

            // Juntas periciales milimétricas
            ctx.strokeStyle = "#161D24";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(0.75, 0.75, size - 1.5, size - 1.5);
            ctx.beginPath();
            ctx.moveTo(60, 0);
            ctx.lineTo(60, size);
            ctx.moveTo(0, 60);
            ctx.lineTo(size, 60);
            ctx.stroke();

            return ctx.createPattern(canvas, "repeat");
        },

        /**
         * Madera cálida oscura realista (#5E412C a #4A3120)
         * con vetas horizontales finas y brillo satinado.
         */
        createWoodDeskPattern: function() {
            const width = 120;
            const height = 60;
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            // Degradado base de madera
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, "#563C29");
            grad.addColorStop(0.5, "#483222");
            grad.addColorStop(1, "#3D2A1C");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            // Vetas horizontales suaves
            ctx.lineWidth = 1;
            for (let y = 3; y < height; y += 4) {
                const alpha = 0.08 + Math.random() * 0.12;
                ctx.strokeStyle = Math.random() > 0.5 ? `rgba(28, 17, 10, ${alpha})` : `rgba(110, 80, 56, ${alpha})`;
                ctx.beginPath();
                ctx.moveTo(0, y);
                const cpY1 = y + (Math.random() - 0.5) * 3;
                const cpY2 = y + (Math.random() - 0.5) * 3;
                if (ctx.bezierCurveTo) {
                    ctx.bezierCurveTo(width * 0.33, cpY1, width * 0.66, cpY2, width, y);
                } else {
                    ctx.lineTo(width, y);
                }
                ctx.stroke();
            }

            // Brillo satinado diagonal sutil
            const satinGrad = ctx.createLinearGradient(0, 0, width, height);
            satinGrad.addColorStop(0, "rgba(255, 235, 210, 0.0)");
            satinGrad.addColorStop(0.45, "rgba(255, 235, 210, 0.035)");
            satinGrad.addColorStop(0.55, "rgba(255, 235, 210, 0.05)");
            satinGrad.addColorStop(0.65, "rgba(255, 235, 210, 0.035)");
            satinGrad.addColorStop(1, "rgba(255, 235, 210, 0.0)");
            ctx.fillStyle = satinGrad;
            ctx.fillRect(0, 0, width, height);

            return ctx.createPattern(canvas, "repeat");
        },

        /**
         * Acero cepillado oscuro (#1C232B) con perforaciones de rejilla de ventilación.
         */
        createRackMetalPattern: function() {
            const size = 32;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            // Metal base cepillado
            ctx.fillStyle = "#182028";
            ctx.fillRect(0, 0, size, size);

            // Estrías de cepillado vertical
            for (let x = 0; x < size; x += 2) {
                const a = Math.random() * 0.06;
                ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
                ctx.fillRect(x, 0, 1, size);
            }

            // Perforaciones hexagonales/circulares de ventilación
            const holes = [
                { x: 8, y: 8 }, { x: 24, y: 8 },
                { x: 16, y: 16 },
                { x: 8, y: 24 }, { x: 24, y: 24 }
            ];

            holes.forEach((h) => {
                // Sombra interior de perforación
                ctx.fillStyle = "#0A0D11";
                ctx.beginPath();
                ctx.arc(h.x, h.y, 2.2, 0, Math.PI * 2);
                ctx.fill();

                // Borde inferior iluminado
                ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.arc(h.x, h.y, 2.4, 0, Math.PI);
                ctx.stroke();
            });

            return ctx.createPattern(canvas, "repeat");
        },

        /**
         * Acabado arquitectónico mate (#161C24) con bisel superior para muros y mamparas.
         */
        createWallTopPattern: function() {
            const size = 40;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) return null;

            ctx.fillStyle = "#161C24";
            ctx.fillRect(0, 0, size, size);

            // Línea de bisel superior técnico
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillRect(0, 0, size, 2);

            // Línea de junta arquitectónica
            ctx.strokeStyle = "#10141A";
            ctx.lineWidth = 1;
            ctx.strokeRect(0.5, 0.5, size - 1, size - 1);

            return ctx.createPattern(canvas, "repeat");
        }
    };

    window.Game.Textures = Textures;
})();
