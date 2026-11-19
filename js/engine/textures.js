/**
 * textures.js - Generador procedural de texturas 2D HD y patrones offscreen
 * Parte de la arquitectura técnica forense (100% offline, sin imágenes externas)
 */
window.Game = window.Game || {};

(function() {
    "use strict";

    const Textures = {
        floorConcrete: null,
        woodDesk: null,
        rackMetal: null,
        wallTop: null,
        initialized: false,

        init: function() {
            if (this.initialized) return;

            try {
                this.floorConcrete = this.createFloorConcretePattern();
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

            // Micro-grano orgánico procedural
            const imgData = ctx.getImageData(0, 0, size, size);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
                const grain = (Math.random() - 0.5) * 8;
                data[i] = Math.max(0, Math.min(255, data[i] + grain));
                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
            }
            ctx.putImageData(imgData, 0, 0);

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
                ctx.bezierCurveTo(width * 0.33, cpY1, width * 0.66, cpY2, width, y);
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
