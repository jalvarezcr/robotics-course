/* ═══════════════════════════════════════════════════════════════
   RoboLab — Topic 12: RF 433 MHz Circuit Diagrams
   Interactive Canvas with Zoom, Pan & HiDPI support
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    window.canvasViewers = {};

    /* ── Color palette ─────────────────────────────────────── */
    var COLORS = {
        bg: '#080C14',
        gridLine: 'rgba(56,189,248,0.04)',
        wire: '#38bdf8',
        wireGreen: '#34d399',
        wirePurple: '#c084fc',
        wireRed: '#f87171',
        wireOrange: '#fb923c',
        wireYellow: '#fbbf24',
        wireDim: '#475569',
        chipBody: '#1e293b',
        chipBorder: '#334155',
        chipText: '#e2e8f0',
        chipLabel: '#38bdf8',
        pinText: '#94a3b8',
        labelText: '#e2e8f0',
        gnd: '#64748b',
        vcc: '#f87171',
        component: '#0f172a',
        componentBorder: '#334155',
        note: 'rgba(56,189,248,0.08)'
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       CanvasViewer — zoom, pan, touch, HiDPI
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    function CanvasViewer(id, worldW, worldH, drawFn) {
        this.canvas = document.getElementById(id);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.id = id;
        this.worldW = worldW;
        this.worldH = worldH;
        this.drawFn = drawFn;
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.minZoom = 0.4;
        this.maxZoom = 5;
        this._dragging = false;
        this._dragStart = { x: 0, y: 0 };
        this._panStart = { x: 0, y: 0 };
        this._rafId = null;
        this._hintEl = this.canvas.parentElement.querySelector('.canvas-hint');
        this._hintHidden = false;
        this._resize();
        this._bindEvents();
        this.render();
    }

    CanvasViewer.prototype._resize = function () {
        var container = this.canvas.parentElement;
        var dpr = window.devicePixelRatio || 1;
        var cw = container.clientWidth;
        var ch = cw * (this.worldH / this.worldW);
        this.canvas.width = cw * dpr;
        this.canvas.height = ch * dpr;
        this.canvas.style.height = ch + 'px';
        this.dpr = dpr;
        this.displayW = cw;
        this.displayH = ch;
        this.baseScale = cw / this.worldW;
    };

    CanvasViewer.prototype._bindEvents = function () {
        var self = this;
        var cv = this.canvas;

        /* Wheel zoom — towards cursor */
        cv.addEventListener('wheel', function (e) {
            e.preventDefault();
            self._hideHint();
            var rect = cv.getBoundingClientRect();
            var mx = e.clientX - rect.left;
            var my = e.clientY - rect.top;
            var oldZ = self.zoom;
            var factor = e.deltaY > 0 ? 0.90 : 1.10;
            self.zoom = clamp(self.zoom * factor, self.minZoom, self.maxZoom);
            var k = self.zoom / oldZ;
            self.panX = mx - (mx - self.panX) * k;
            self.panY = my - (my - self.panY) * k;
            self._updateLabel();
            self.render();
        }, { passive: false });

        /* Mouse drag */
        cv.addEventListener('mousedown', function (e) {
            self._dragging = true;
            self._dragStart = { x: e.clientX, y: e.clientY };
            self._panStart = { x: self.panX, y: self.panY };
            cv.parentElement.classList.add('is-dragging');
            self._hideHint();
        });
        var onMouseMove = function (e) {
            if (!self._dragging) return;
            self.panX = self._panStart.x + (e.clientX - self._dragStart.x);
            self.panY = self._panStart.y + (e.clientY - self._dragStart.y);
            self.render();
        };
        var onMouseUp = function () {
            if (self._dragging) {
                self._dragging = false;
                cv.parentElement.classList.remove('is-dragging');
            }
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        /* Touch: 1-finger pan, 2-finger pinch-zoom */
        var lastTouchDist = 0;
        cv.addEventListener('touchstart', function (e) {
            e.preventDefault();
            self._hideHint();
            if (e.touches.length === 1) {
                self._dragging = true;
                self._dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                self._panStart = { x: self.panX, y: self.panY };
            } else if (e.touches.length === 2) {
                lastTouchDist = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
            }
        }, { passive: false });
        cv.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if (e.touches.length === 1 && self._dragging) {
                self.panX = self._panStart.x + (e.touches[0].clientX - self._dragStart.x);
                self.panY = self._panStart.y + (e.touches[0].clientY - self._dragStart.y);
                self.render();
            } else if (e.touches.length === 2 && lastTouchDist > 0) {
                var nd = Math.hypot(
                    e.touches[0].clientX - e.touches[1].clientX,
                    e.touches[0].clientY - e.touches[1].clientY
                );
                self.zoom = clamp(self.zoom * (nd / lastTouchDist), self.minZoom, self.maxZoom);
                lastTouchDist = nd;
                self._updateLabel();
                self.render();
            }
        }, { passive: false });
        cv.addEventListener('touchend', function () {
            self._dragging = false;
            lastTouchDist = 0;
        });

        /* Resize */
        window.addEventListener('resize', function () {
            self._resize();
            self.render();
        });
    };

    CanvasViewer.prototype._updateLabel = function () {
        var el = document.getElementById('zoom-' + this.id);
        if (el) el.textContent = Math.round(this.zoom * 100) + '%';
    };

    CanvasViewer.prototype._hideHint = function () {
        if (!this._hintHidden && this._hintEl) {
            this._hintEl.style.opacity = '0';
            this._hintHidden = true;
        }
    };

    CanvasViewer.prototype.render = function () {
        var self = this;
        if (this._rafId) cancelAnimationFrame(this._rafId);
        this._rafId = requestAnimationFrame(function () {
            self._rafId = null;
            var ctx = self.ctx;
            var dpr = self.dpr;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            var s = self.baseScale * self.zoom * dpr;
            ctx.setTransform(s, 0, 0, s, self.panX * dpr, self.panY * dpr);
            self.drawFn(ctx, self.worldW, self.worldH);
        });
    };

    CanvasViewer.prototype.zoomIn = function () { this._zoomCenter(1.4); };
    CanvasViewer.prototype.zoomOut = function () { this._zoomCenter(1 / 1.4); };
    CanvasViewer.prototype.reset = function () {
        this.zoom = 1; this.panX = 0; this.panY = 0;
        this._updateLabel(); this.render();
    };
    CanvasViewer.prototype._zoomCenter = function (f) {
        var cx = this.displayW / 2, cy = this.displayH / 2, oz = this.zoom;
        this.zoom = clamp(this.zoom * f, this.minZoom, this.maxZoom);
        var k = this.zoom / oz;
        this.panX = cx - (cx - this.panX) * k;
        this.panY = cy - (cy - this.panY) * k;
        this._updateLabel(); this.render();
    };

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       Drawing Helpers
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function drawGrid(ctx, w, h) {
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = COLORS.gridLine;
        ctx.lineWidth = 0.5;
        for (var x = 0; x < w; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (var y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    }

    function drawChip(ctx, x, y, w, h, label, pins_l, pins_r) {
        ctx.fillStyle = COLORS.chipBody;
        ctx.strokeStyle = COLORS.chipBorder;
        ctx.lineWidth = 2;
        roundRect(ctx, x, y, w, h, 8);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = COLORS.bg;
        ctx.beginPath(); ctx.arc(x + w / 2, y, 6, 0, Math.PI); ctx.fill();
        ctx.strokeStyle = COLORS.chipBorder; ctx.stroke();
        ctx.fillStyle = COLORS.chipLabel;
        ctx.font = 'bold 14px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, x + w / 2, y + h / 2 - 8);
        ctx.fillStyle = COLORS.pinText;
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('DIP-18', x + w / 2, y + h / 2 + 8);
        var ps = h / (pins_l.length + 1);
        ctx.font = '10px "JetBrains Mono", monospace';
        for (var i = 0; i < pins_l.length; i++) {
            var py = y + ps * (i + 1);
            ctx.fillStyle = COLORS.chipBorder;
            ctx.fillRect(x - 12, py - 3, 12, 6);
            ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'right';
            ctx.fillText(pins_l[i].num, x - 18, py + 1);
            ctx.fillStyle = COLORS.chipText; ctx.textAlign = 'left';
            ctx.fillText(pins_l[i].name, x + 8, py + 1);
        }
        for (var j = 0; j < pins_r.length; j++) {
            var pyr = y + ps * (j + 1);
            ctx.fillStyle = COLORS.chipBorder;
            ctx.fillRect(x + w, pyr - 3, 12, 6);
            ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'left';
            ctx.fillText(pins_r[j].num, x + w + 18, pyr + 1);
            ctx.fillStyle = COLORS.chipText; ctx.textAlign = 'right';
            ctx.fillText(pins_r[j].name, x + w - 8, pyr + 1);
        }
        return ps;
    }

    function drawWire(ctx, points, color, dashed) {
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        if (dashed) ctx.setLineDash([6, 4]); else ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
        ctx.stroke(); ctx.setLineDash([]);
    }

    function drawNode(ctx, x, y, color) {
        ctx.fillStyle = color || COLORS.wire;
        ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    }

    function drawLabel(ctx, x, y, text, color, align, size) {
        ctx.fillStyle = color || COLORS.labelText;
        ctx.font = (size || '11') + 'px "Inter", sans-serif';
        ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
    }

    function drawBoldLabel(ctx, x, y, text, color, align) {
        ctx.fillStyle = color || COLORS.labelText;
        ctx.font = 'bold 13px "Space Grotesk", sans-serif';
        ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
    }

    function drawBox(ctx, x, y, w, h, label, color, borderColor) {
        ctx.fillStyle = color || COLORS.component;
        ctx.strokeStyle = borderColor || COLORS.componentBorder;
        ctx.lineWidth = 1.5;
        roundRect(ctx, x, y, w, h, 6); ctx.fill(); ctx.stroke();
        if (label) {
            ctx.fillStyle = COLORS.chipText;
            ctx.font = 'bold 11px "Space Grotesk", sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(label, x + w / 2, y + h / 2);
        }
    }

    function drawResistor(ctx, x1, y1, x2, y2, label, color) {
        var dx = x2 - x1, dy = y2 - y1;
        var len = Math.sqrt(dx * dx + dy * dy);
        var ux = dx / len, uy = dy / len;
        var px = -uy, py = ux;
        ctx.strokeStyle = color || '#fb923c'; ctx.lineWidth = 2;
        ctx.beginPath();
        var seg = len / 8;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + ux * seg, y1 + uy * seg);
        for (var i = 1; i <= 5; i++) {
            var cx = x1 + ux * seg * (i + 0.5);
            var cy = y1 + uy * seg * (i + 0.5);
            var side = (i % 2 === 1) ? 6 : -6;
            ctx.lineTo(cx + px * side, cy + py * side);
        }
        ctx.lineTo(x1 + ux * seg * 7, y1 + uy * seg * 7);
        ctx.lineTo(x2, y2); ctx.stroke();
        if (label) {
            var mx = (x1 + x2) / 2 + px * 14;
            var my = (y1 + y2) / 2 + py * 14;
            drawLabel(ctx, mx, my, label, '#fb923c', 'center', '9');
        }
    }

    function drawButton(ctx, x, y, label) {
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 1.5;
        roundRect(ctx, x - 20, y - 14, 40, 28, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.stroke();
        drawLabel(ctx, x, y - 24, label, COLORS.chipText, 'center', '10');
    }

    function drawLED(ctx, x, y, color) {
        ctx.fillStyle = color || '#fbbf24';
        ctx.globalAlpha = 0.3;
        ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(x - 8, y - 8); ctx.lineTo(x + 8, y - 8); ctx.lineTo(x, y + 8);
        ctx.closePath(); ctx.fillStyle = color || '#fbbf24'; ctx.fill();
        ctx.strokeStyle = color || '#fbbf24'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x - 8, y + 8); ctx.lineTo(x + 8, y + 8); ctx.stroke();
    }

    function drawMotor(ctx, x, y) {
        ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#34d399'; ctx.stroke();
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 16px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('M', x, y);
    }

    function drawAntenna(ctx, x, y, h) {
        ctx.strokeStyle = COLORS.wireYellow; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y - h, 3, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.wireYellow; ctx.fill();
        ctx.strokeStyle = 'rgba(251,191,36,0.3)'; ctx.lineWidth = 1;
        for (var i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(x, y - h, 6 + i * 6, -Math.PI * 0.6, -Math.PI * 0.4);
            ctx.stroke();
        }
    }

    function drawDiode(ctx, x1, y1, x2, y2, label) {
        var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        var dx = x2 - x1, dy = y2 - y1;
        var len = Math.sqrt(dx * dx + dy * dy);
        var ux = dx / len, uy = dy / len;
        var px = -uy, py = ux;
        ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(mx - ux * 8, my - uy * 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx + ux * 8, my + uy * 8); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.moveTo(mx - ux * 8 + px * 6, my - uy * 8 + py * 6);
        ctx.lineTo(mx - ux * 8 - px * 6, my - uy * 8 - py * 6);
        ctx.lineTo(mx + ux * 4, my + uy * 4);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mx + ux * 4 + px * 6, my + uy * 4 + py * 6);
        ctx.lineTo(mx + ux * 4 - px * 6, my + uy * 4 - py * 6);
        ctx.stroke();
        if (label) drawLabel(ctx, mx + px * 14, my + py * 14, label, '#c084fc', 'center', '9');
    }

    function drawTransistor(ctx, x, y, label, config) {
        var r = 16;
        ctx.strokeStyle = '#94a3b8'; ctx.fillStyle = '#0f172a'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x - 6, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 6, y - 8); ctx.lineTo(x - 6, y + 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 6, y - 5); ctx.lineTo(x + 8, y - 12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 6, y + 5); ctx.lineTo(x + 8, y + 12); ctx.stroke();
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 12); ctx.lineTo(x + 2, y + 6); ctx.lineTo(x + 1, y + 12);
        ctx.closePath(); ctx.fill();
        if (label) {
            ctx.fillStyle = COLORS.chipText;
            ctx.font = 'bold 10px "JetBrains Mono", monospace';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(label, x, y + r + 14);
        }
        if (config) {
            ctx.fillStyle = '#64748b';
            ctx.font = '8px "Inter", sans-serif';
            ctx.fillText(config, x, y + r + 26);
        }
    }

    function drawGndSymbol(ctx, x, y) {
        ctx.strokeStyle = COLORS.gnd; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 5, y + 4); ctx.lineTo(x + 5, y + 4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 2, y + 8); ctx.lineTo(x + 2, y + 8); ctx.stroke();
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       DIAGRAM 1 — System Overview
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    function drawSystemDiagram(ctx, w, h) {
        drawGrid(ctx, w, h);

        drawBoldLabel(ctx, w / 2, 25, 'DIAGRAMA GENERAL DEL SISTEMA — RF 433 MHz', COLORS.chipLabel, 'center');

        // TX Side
        ctx.fillStyle = 'rgba(56,189,248,0.04)';
        ctx.strokeStyle = 'rgba(56,189,248,0.15)'; ctx.lineWidth = 1;
        roundRect(ctx, 30, 50, 380, 420, 12); ctx.fill(); ctx.stroke();
        drawBoldLabel(ctx, 220, 72, 'LADO TRANSMISOR · +5V / GND', '#38bdf8', 'center');

        // RX Side
        ctx.fillStyle = 'rgba(192,132,252,0.04)';
        ctx.strokeStyle = 'rgba(192,132,252,0.15)';
        roundRect(ctx, 690, 50, 380, 420, 12); ctx.fill(); ctx.stroke();
        drawBoldLabel(ctx, 880, 72, 'LADO RECEPTOR · +5V / GND', '#c084fc', 'center');

        // Air
        ctx.fillStyle = 'rgba(251,191,36,0.04)';
        ctx.strokeStyle = 'rgba(251,191,36,0.12)';
        roundRect(ctx, 430, 180, 240, 140, 12); ctx.fill(); ctx.stroke();
        drawBoldLabel(ctx, 550, 250, 'RF 433 MHz', COLORS.wireYellow, 'center');
        ctx.fillStyle = 'rgba(251,191,36,0.5)';
        ctx.font = '20px "Inter", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('\u301C\u301C\u301C', 550, 225);

        // TX components
        drawButton(ctx, 100, 150, 'PB1 LED');
        drawButton(ctx, 100, 210, 'PB2 FWD');
        drawButton(ctx, 100, 270, 'PB3 REV');

        drawBox(ctx, 200, 120, 120, 200, '', '#0f172a', '#1e4a6e');
        ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 13px "Space Grotesk", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('HT12E', 260, 195);
        ctx.fillStyle = '#64748b'; ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('Codificador', 260, 215);
        ctx.fillText('OSC: 1M\u03A9', 260, 230);
        ctx.fillText('A0-A7 \u2192 GND', 260, 245);
        ctx.fillText('TE \u2192 GND', 260, 260);

        drawBox(ctx, 210, 360, 100, 50, 'FS1000A', '#0f172a', '#1e4a6e');
        drawLabel(ctx, 260, 425, 'TX RF 433MHz', '#38bdf8', 'center', '10');

        drawAntenna(ctx, 360, 380, 50);
        drawLabel(ctx, 375, 350, '~17cm', COLORS.wireYellow, 'left', '9');

        // TX wires
        drawWire(ctx, [[120, 150], [200, 150]], COLORS.wire, false);
        drawWire(ctx, [[120, 210], [200, 210]], COLORS.wire, false);
        drawWire(ctx, [[120, 270], [200, 270]], COLORS.wire, false);
        drawLabel(ctx, 155, 140, 'AD8', '#94a3b8', 'center', '9');
        drawLabel(ctx, 155, 200, 'AD9', '#94a3b8', 'center', '9');
        drawLabel(ctx, 155, 260, 'AD10', '#94a3b8', 'center', '9');

        drawWire(ctx, [[260, 320], [260, 360]], COLORS.wire, false);
        drawLabel(ctx, 275, 340, 'DOUT', '#94a3b8', 'left', '9');
        drawWire(ctx, [[310, 385], [360, 385]], COLORS.wireYellow, false);

        // RF arrows
        drawWire(ctx, [[360, 335], [430, 250]], COLORS.wireYellow, true);
        drawWire(ctx, [[670, 250], [740, 335]], COLORS.wireYellow, true);

        // RX components
        drawAntenna(ctx, 740, 380, 50);
        drawLabel(ctx, 755, 350, '~17cm', COLORS.wireYellow, 'left', '9');

        drawBox(ctx, 790, 360, 100, 50, 'MX-RM-5V', '#0f172a', '#5b3e7e');
        drawLabel(ctx, 840, 425, 'RX RF 433MHz', '#c084fc', 'center', '10');
        drawWire(ctx, [[740, 385], [790, 385]], COLORS.wireYellow, false);

        drawBox(ctx, 780, 120, 120, 200, '', '#0f172a', '#5b3e7e');
        ctx.fillStyle = '#c084fc'; ctx.font = 'bold 13px "Space Grotesk", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('HT12D', 840, 195);
        ctx.fillStyle = '#64748b'; ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('Decodificador', 840, 215);
        ctx.fillText('OSC: 33k\u03A9', 840, 230);
        ctx.fillText('A0-A7 \u2192 GND', 840, 245);

        drawWire(ctx, [[840, 320], [840, 360]], COLORS.wirePurple, false);
        drawLabel(ctx, 855, 340, 'DIN', '#94a3b8', 'left', '9');

        // RX outputs
        drawLED(ctx, 970, 150, '#fbbf24');
        drawLabel(ctx, 970, 178, 'LED', COLORS.wireYellow, 'center', '10');
        drawWire(ctx, [[900, 155], [955, 155]], COLORS.wireYellow, false);
        drawLabel(ctx, 920, 143, 'D8', '#94a3b8', 'center', '9');

        drawBox(ctx, 940, 210, 80, 50, 'Puente H', '#0f172a', '#1a4a3e');
        drawLabel(ctx, 980, 275, '4\u00D7 2N2222', '#34d399', 'center', '9');
        drawWire(ctx, [[900, 210], [940, 225]], COLORS.wireGreen, false);
        drawLabel(ctx, 915, 203, 'D9', '#94a3b8', 'center', '9');
        drawWire(ctx, [[900, 250], [940, 245]], COLORS.wireRed, false);
        drawLabel(ctx, 915, 260, 'D10', '#94a3b8', 'center', '9');
        drawLabel(ctx, 927, 218, 'FWD', '#34d399', 'center', '8');
        drawLabel(ctx, 927, 255, 'REV', '#f87171', 'center', '8');

        drawMotor(ctx, 1040, 235);
        drawWire(ctx, [[1020, 235], [1017, 235]], COLORS.wireGreen, false);
        drawLabel(ctx, 1040, 270, 'Motor DC', '#34d399', 'center', '10');
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       DIAGRAM 2 — TX Circuit (HT12E)
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    function drawTXCircuit(ctx, w, h) {
        drawGrid(ctx, w, h);
        drawBoldLabel(ctx, w / 2, 25, 'CIRCUITO TRANSMISOR \u2014 HT12E + FS1000A', '#38bdf8', 'center');

        var chipX = 380, chipY = 60, chipW = 160, chipH = 540;
        var pinsL = [
            { num: '1', name: 'A0' }, { num: '2', name: 'A1' }, { num: '3', name: 'A2' }, { num: '4', name: 'A3' },
            { num: '5', name: 'A4' }, { num: '6', name: 'A5' }, { num: '7', name: 'A6' }, { num: '8', name: 'A7' },
            { num: '9', name: 'VSS' }
        ];
        var pinsR = [
            { num: '18', name: 'VDD' }, { num: '17', name: 'DOUT' }, { num: '16', name: 'OSC1' },
            { num: '15', name: 'OSC2' }, { num: '14', name: 'TE' }, { num: '13', name: 'AD11' },
            { num: '12', name: 'AD10' }, { num: '11', name: 'AD9' }, { num: '10', name: 'AD8' }
        ];
        var ps = drawChip(ctx, chipX, chipY, chipW, chipH, 'HT12E', pinsL, pinsR);
        function lpy(i) { return chipY + ps * (i + 1); }
        function rpy(i) { return chipY + ps * (i + 1); }

        // GND rail
        var gndX = 200;
        ctx.strokeStyle = COLORS.gnd; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(gndX, lpy(0) - 10); ctx.lineTo(gndX, lpy(8) + 10); ctx.stroke();
        drawBoldLabel(ctx, gndX, lpy(8) + 28, 'GND', COLORS.gnd, 'center');
        drawGndSymbol(ctx, gndX, lpy(8) + 38);

        for (var i = 0; i <= 8; i++) {
            drawWire(ctx, [[chipX - 12, lpy(i)], [gndX, lpy(i)]], COLORS.gnd, false);
            drawNode(ctx, gndX, lpy(i), COLORS.gnd);
        }

        // VCC rail
        var vccX = 820;
        ctx.strokeStyle = COLORS.vcc; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(vccX, rpy(0) - 20); ctx.lineTo(vccX, rpy(0) + 5); ctx.stroke();
        drawBoldLabel(ctx, vccX, rpy(0) - 28, '+5V', COLORS.vcc, 'center');
        drawWire(ctx, [[chipX + chipW + 12, rpy(0)], [vccX, rpy(0)]], COLORS.vcc, false);
        drawNode(ctx, vccX, rpy(0), COLORS.vcc);

        // DOUT → FS1000A
        var doutY = rpy(1);
        drawWire(ctx, [[chipX + chipW + 12, doutY], [750, doutY]], COLORS.wire, false);
        drawBox(ctx, 750, doutY - 25, 120, 50, 'FS1000A', '#0f172a', '#1e4a6e');
        drawLabel(ctx, 810, doutY + 38, 'Transmisor RF', '#38bdf8', 'center', '10');
        drawAntenna(ctx, 920, doutY, 45);
        drawWire(ctx, [[870, doutY], [920, doutY]], COLORS.wireYellow, false);

        // OSC resistor
        var osc1Y = rpy(2), osc2Y = rpy(3);
        drawWire(ctx, [[chipX + chipW + 12, osc1Y], [680, osc1Y]], COLORS.wireOrange, false);
        drawWire(ctx, [[chipX + chipW + 12, osc2Y], [680, osc2Y]], COLORS.wireOrange, false);
        drawResistor(ctx, 680, osc1Y, 680, osc2Y, '1 M\u03A9', '#fb923c');
        drawLabel(ctx, 710, (osc1Y + osc2Y) / 2, 'OSC', '#fb923c', 'left', '9');

        // TE → GND
        var teY = rpy(4);
        drawWire(ctx, [[chipX + chipW + 12, teY], [700, teY], [700, teY + 25]], COLORS.gnd, false);
        drawLabel(ctx, 715, teY, 'GND', COLORS.gnd, 'left', '9');
        drawGndSymbol(ctx, 700, teY + 25);

        // AD11 → GND
        var ad11Y = rpy(5);
        drawWire(ctx, [[chipX + chipW + 12, ad11Y], [700, ad11Y], [700, ad11Y + 25]], COLORS.gnd, false);
        drawLabel(ctx, 715, ad11Y, 'GND', COLORS.gnd, 'left', '9');
        drawGndSymbol(ctx, 700, ad11Y + 25);

        // AD10, AD9, AD8 — buttons + pull-downs
        var adPins = [
            { idx: 6, label: 'PB3 REV', color: COLORS.wireRed, rx: 660 },
            { idx: 7, label: 'PB2 FWD', color: COLORS.wireGreen, rx: 720 },
            { idx: 8, label: 'PB1 LED', color: COLORS.wireYellow, rx: 780 }
        ];
        var btnVccX = 1000;
        for (var p = 0; p < adPins.length; p++) {
            var pin = adPins[p];
            var py = rpy(pin.idx);
            var rx = pin.rx;
            drawWire(ctx, [[chipX + chipW + 12, py], [rx, py]], pin.color, false);
            drawNode(ctx, rx, py, pin.color);
            drawResistor(ctx, rx, py, rx, py + 30, '10k\u03A9', '#fb923c');
            drawWire(ctx, [[rx, py + 30], [rx, py + 42]], COLORS.gnd, false);
            drawGndSymbol(ctx, rx, py + 42);
            drawWire(ctx, [[rx, py], [850, py]], pin.color, false);
            drawButton(ctx, 900, py, pin.label);
            drawWire(ctx, [[920, py], [btnVccX, py]], COLORS.vcc, false);
        }
        ctx.strokeStyle = COLORS.vcc; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(btnVccX, rpy(6) - 10); ctx.lineTo(btnVccX, rpy(8) + 10); ctx.stroke();
        drawBoldLabel(ctx, btnVccX, rpy(6) - 22, '+5V', COLORS.vcc, 'center');
        for (var q = 0; q < adPins.length; q++) {
            drawNode(ctx, btnVccX, rpy(adPins[q].idx), COLORS.vcc);
        }
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       DIAGRAM 3 — RX Circuit (HT12D)
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    function drawRXCircuit(ctx, w, h) {
        drawGrid(ctx, w, h);
        drawBoldLabel(ctx, w / 2, 25, 'CIRCUITO RECEPTOR \u2014 MX-RM-5V + HT12D', '#c084fc', 'center');

        var chipX = 380, chipY = 60, chipW = 160, chipH = 420;
        var pinsL = [
            { num: '1', name: 'A0' }, { num: '2', name: 'A1' }, { num: '3', name: 'A2' }, { num: '4', name: 'A3' },
            { num: '5', name: 'A4' }, { num: '6', name: 'A5' }, { num: '7', name: 'A6' }, { num: '8', name: 'A7' },
            { num: '9', name: 'VSS' }
        ];
        var pinsR = [
            { num: '18', name: 'VDD' }, { num: '17', name: 'VT' }, { num: '16', name: 'OSC1' },
            { num: '15', name: 'OSC2' }, { num: '14', name: 'DIN' }, { num: '13', name: 'D11' },
            { num: '12', name: 'D10' }, { num: '11', name: 'D9' }, { num: '10', name: 'D8' }
        ];
        var ps = drawChip(ctx, chipX, chipY, chipW, chipH, 'HT12D', pinsL, pinsR);
        function lpy(i) { return chipY + ps * (i + 1); }
        function rpy(i) { return chipY + ps * (i + 1); }

        // GND rail
        var gndX = 200;
        ctx.strokeStyle = COLORS.gnd; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(gndX, lpy(0) - 10); ctx.lineTo(gndX, lpy(8) + 10); ctx.stroke();
        drawBoldLabel(ctx, gndX, lpy(8) + 28, 'GND', COLORS.gnd, 'center');
        drawGndSymbol(ctx, gndX, lpy(8) + 38);

        for (var i = 0; i <= 8; i++) {
            drawWire(ctx, [[chipX - 12, lpy(i)], [gndX, lpy(i)]], COLORS.gnd, false);
            drawNode(ctx, gndX, lpy(i), COLORS.gnd);
        }

        // VDD
        var vccX = 820;
        drawWire(ctx, [[chipX + chipW + 12, rpy(0)], [vccX, rpy(0)]], COLORS.vcc, false);
        ctx.strokeStyle = COLORS.vcc; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(vccX, rpy(0) - 20); ctx.lineTo(vccX, rpy(0) + 5); ctx.stroke();
        drawBoldLabel(ctx, vccX, rpy(0) - 28, '+5V', COLORS.vcc, 'center');
        drawNode(ctx, vccX, rpy(0), COLORS.vcc);

        // VT (optional)
        var vtY = rpy(1);
        drawWire(ctx, [[chipX + chipW + 12, vtY], [660, vtY]], '#64748b', true);
        drawLabel(ctx, 680, vtY, '(opcional)', '#64748b', 'left', '9');

        // OSC
        var osc1Y = rpy(2), osc2Y = rpy(3);
        drawWire(ctx, [[chipX + chipW + 12, osc1Y], [680, osc1Y]], COLORS.wireOrange, false);
        drawWire(ctx, [[chipX + chipW + 12, osc2Y], [680, osc2Y]], COLORS.wireOrange, false);
        drawResistor(ctx, 680, osc1Y, 680, osc2Y, '33 k\u03A9', '#fb923c');

        // DIN ← MX-RM-5V
        var dinY = rpy(4);
        drawWire(ctx, [[chipX + chipW + 12, dinY], [750, dinY]], COLORS.wirePurple, false);
        drawBox(ctx, 750, dinY - 25, 120, 50, 'MX-RM-5V', '#0f172a', '#5b3e7e');
        drawLabel(ctx, 810, dinY + 38, 'Receptor RF', '#c084fc', 'center', '10');
        drawAntenna(ctx, 920, dinY, 45);
        drawWire(ctx, [[870, dinY], [920, dinY]], COLORS.wireYellow, false);

        // D11 — not used
        drawWire(ctx, [[chipX + chipW + 12, rpy(5)], [660, rpy(5)]], '#334155', true);
        drawLabel(ctx, 680, rpy(5), '(no usado)', '#475569', 'left', '9');

        // D10 → IN_REV
        var d10Y = rpy(6);
        drawWire(ctx, [[chipX + chipW + 12, d10Y], [800, d10Y]], COLORS.wireRed, false);
        drawBox(ctx, 800, d10Y - 15, 110, 30, 'IN_REV \u2192 H-Bridge', '#0f172a', '#7f1d1d');
        drawLabel(ctx, 855, d10Y + 25, 'Bases Q2, Q3', '#f87171', 'center', '9');

        // D9 → IN_FWD
        var d9Y = rpy(7);
        drawWire(ctx, [[chipX + chipW + 12, d9Y], [800, d9Y]], COLORS.wireGreen, false);
        drawBox(ctx, 800, d9Y - 15, 110, 30, 'IN_FWD \u2192 H-Bridge', '#0f172a', '#14532d');
        drawLabel(ctx, 855, d9Y + 25, 'Bases Q1, Q4', '#34d399', 'center', '9');

        // D8 → LED
        var d8Y = rpy(8);
        drawWire(ctx, [[chipX + chipW + 12, d8Y], [720, d8Y]], COLORS.wireYellow, false);
        drawResistor(ctx, 720, d8Y, 800, d8Y, '330\u03A9', '#fb923c');
        drawLED(ctx, 850, d8Y, '#fbbf24');
        drawWire(ctx, [[815, d8Y], [836, d8Y]], COLORS.wireYellow, false);
        drawWire(ctx, [[864, d8Y], [920, d8Y], [920, d8Y + 25]], COLORS.gnd, false);
        drawGndSymbol(ctx, 920, d8Y + 25);
        drawLabel(ctx, 850, d8Y + 22, 'LED', COLORS.wireYellow, 'center', '9');
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       DIAGRAM 4 — H-Bridge
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    function drawHBridgeDiagram(ctx, w, h) {
        drawGrid(ctx, w, h);
        drawBoldLabel(ctx, w / 2, 25, 'PUENTE H \u2014 4\u00D7 2N2222 NPN + DIODOS FLYBACK', '#34d399', 'center');

        var cx = w / 2;
        var vccY = 80, topQY = 170, motorY = 310, botQY = 440, gndY = 550;
        var leftX = cx - 180, rightX = cx + 180;

        // VCC Rail
        ctx.strokeStyle = COLORS.vcc; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(leftX - 60, vccY); ctx.lineTo(rightX + 60, vccY); ctx.stroke();
        drawBoldLabel(ctx, cx, vccY - 16, '+5V MOTOR', COLORS.vcc, 'center');

        // GND Rail
        ctx.strokeStyle = COLORS.gnd; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(leftX - 60, gndY); ctx.lineTo(rightX + 60, gndY); ctx.stroke();
        drawBoldLabel(ctx, cx, gndY + 20, 'GND', COLORS.gnd, 'center');
        drawGndSymbol(ctx, cx, gndY + 30);

        // Transistors
        drawTransistor(ctx, leftX, topQY, 'Q1', 'Col. Com\u00FAn');
        drawTransistor(ctx, rightX, topQY, 'Q2', 'Col. Com\u00FAn');
        drawTransistor(ctx, leftX, botQY, 'Q3', 'Em. Com\u00FAn');
        drawTransistor(ctx, rightX, botQY, 'Q4', 'Em. Com\u00FAn');

        // Q1: C→+5V, E→Motor A
        drawWire(ctx, [[leftX + 8, topQY - 12], [leftX + 8, vccY]], COLORS.vcc, false);
        drawNode(ctx, leftX + 8, vccY, COLORS.vcc);
        drawWire(ctx, [[leftX + 8, topQY + 12], [leftX + 8, motorY - 30]], COLORS.wire, false);

        // Q2: C→+5V, E→Motor B
        drawWire(ctx, [[rightX + 8, topQY - 12], [rightX + 8, vccY]], COLORS.vcc, false);
        drawNode(ctx, rightX + 8, vccY, COLORS.vcc);
        drawWire(ctx, [[rightX + 8, topQY + 12], [rightX + 8, motorY - 30]], COLORS.wire, false);

        // Q3: C→Motor A, E→GND
        drawWire(ctx, [[leftX + 8, botQY - 12], [leftX + 8, motorY + 30]], COLORS.wire, false);
        drawWire(ctx, [[leftX + 8, botQY + 12], [leftX + 8, gndY]], COLORS.gnd, false);
        drawNode(ctx, leftX + 8, gndY, COLORS.gnd);

        // Q4: C→Motor B, E→GND
        drawWire(ctx, [[rightX + 8, botQY - 12], [rightX + 8, motorY + 30]], COLORS.wire, false);
        drawWire(ctx, [[rightX + 8, botQY + 12], [rightX + 8, gndY]], COLORS.gnd, false);
        drawNode(ctx, rightX + 8, gndY, COLORS.gnd);

        // Motor
        drawMotor(ctx, cx, motorY);
        drawLabel(ctx, leftX + 8, motorY - 40, 'MA', COLORS.wire, 'center', '10');
        drawLabel(ctx, rightX + 8, motorY - 40, 'MB', COLORS.wire, 'center', '10');
        drawNode(ctx, leftX + 8, motorY - 30, COLORS.wire);
        drawNode(ctx, rightX + 8, motorY - 30, COLORS.wire);
        drawNode(ctx, leftX + 8, motorY + 30, COLORS.wire);
        drawNode(ctx, rightX + 8, motorY + 30, COLORS.wire);
        drawWire(ctx, [[cx - 22, motorY], [leftX + 8, motorY]], COLORS.wire, false);
        drawWire(ctx, [[cx + 22, motorY], [rightX + 8, motorY]], COLORS.wire, false);

        // Base resistors + input signals
        var inFwdY = (topQY + botQY) / 2 - 30;
        var inRevY = (topQY + botQY) / 2 + 30;
        var routeOff = 28;

        // IN_FWD → Q1 (left-top) + Q4 (right-bottom)
        drawBoldLabel(ctx, 60, inFwdY, 'IN_FWD', COLORS.wireGreen, 'left');
        drawLabel(ctx, 60, inFwdY + 16, 'HT12D D9 \u00B7 Pin 11', '#64748b', 'left', '9');
        drawWire(ctx, [[130, inFwdY], [250, inFwdY]], COLORS.wireGreen, false);
        drawNode(ctx, 250, inFwdY, COLORS.wireGreen);
        // Q1 branch: up then resistor to Q1 base
        drawWire(ctx, [[250, inFwdY], [250, topQY]], COLORS.wireGreen, false);
        drawResistor(ctx, 250, topQY, leftX - 16, topQY, '1k\u03A9', '#fb923c');
        // Q4 branch: down to offset channel, right, jog up, resistor to Q4 base
        drawWire(ctx, [[250, inFwdY], [250, botQY + routeOff]], COLORS.wireGreen, false);
        drawWire(ctx, [[250, botQY + routeOff], [rightX - 70, botQY + routeOff]], COLORS.wireGreen, false);
        drawWire(ctx, [[rightX - 70, botQY + routeOff], [rightX - 70, botQY]], COLORS.wireGreen, false);
        drawResistor(ctx, rightX - 70, botQY, rightX - 16, botQY, '1k\u03A9', '#fb923c');

        // IN_REV → Q2 (right-top) + Q3 (left-bottom)
        drawBoldLabel(ctx, 60, inRevY, 'IN_REV', COLORS.wireRed, 'left');
        drawLabel(ctx, 60, inRevY + 16, 'HT12D D10 \u00B7 Pin 12', '#64748b', 'left', '9');
        drawWire(ctx, [[130, inRevY], [200, inRevY]], COLORS.wireRed, false);
        drawNode(ctx, 200, inRevY, COLORS.wireRed);
        // Q2 branch: up to offset channel (above top row), right, jog down, resistor to Q2 base
        drawWire(ctx, [[200, inRevY], [200, topQY - routeOff]], COLORS.wireRed, false);
        drawWire(ctx, [[200, topQY - routeOff], [rightX - 70, topQY - routeOff]], COLORS.wireRed, false);
        drawWire(ctx, [[rightX - 70, topQY - routeOff], [rightX - 70, topQY]], COLORS.wireRed, false);
        drawResistor(ctx, rightX - 70, topQY, rightX - 16, topQY, '1k\u03A9', '#fb923c');
        // Q3 branch: down then resistor to Q3 base
        drawWire(ctx, [[200, inRevY], [200, botQY]], COLORS.wireRed, false);
        drawResistor(ctx, 200, botQY, leftX - 16, botQY, '1k\u03A9', '#fb923c');

        // Flyback diodes (outside the bridge columns)
        var dLeftX = leftX - 45;
        var dRightX = rightX + 45;

        // D1: anti-parallel Q1 (motor A → VCC)
        drawDiode(ctx, dLeftX, motorY - 30, dLeftX, vccY + 10, 'D1');
        drawWire(ctx, [[leftX + 8, motorY - 30], [dLeftX, motorY - 30]], 'rgba(192,132,252,0.4)', false);
        drawWire(ctx, [[dLeftX, vccY + 10], [dLeftX, vccY]], 'rgba(192,132,252,0.4)', false);
        drawNode(ctx, dLeftX, vccY, COLORS.wirePurple);

        // D2: anti-parallel Q3 (GND → motor A)
        drawDiode(ctx, dLeftX, gndY - 10, dLeftX, motorY + 30, 'D2');
        drawWire(ctx, [[dLeftX, gndY - 10], [dLeftX, gndY]], 'rgba(192,132,252,0.4)', false);
        drawNode(ctx, dLeftX, gndY, COLORS.wirePurple);
        drawWire(ctx, [[dLeftX, motorY + 30], [leftX + 8, motorY + 30]], 'rgba(192,132,252,0.4)', false);

        // D3: anti-parallel Q2 (motor B → VCC)
        drawDiode(ctx, dRightX, motorY - 30, dRightX, vccY + 10, 'D3');
        drawWire(ctx, [[rightX + 8, motorY - 30], [dRightX, motorY - 30]], 'rgba(192,132,252,0.4)', false);
        drawWire(ctx, [[dRightX, vccY + 10], [dRightX, vccY]], 'rgba(192,132,252,0.4)', false);
        drawNode(ctx, dRightX, vccY, COLORS.wirePurple);

        // D4: anti-parallel Q4 (GND → motor B)
        drawDiode(ctx, dRightX, gndY - 10, dRightX, motorY + 30, 'D4');
        drawWire(ctx, [[dRightX, gndY - 10], [dRightX, gndY]], 'rgba(192,132,252,0.4)', false);
        drawNode(ctx, dRightX, gndY, COLORS.wirePurple);
        drawWire(ctx, [[dRightX, motorY + 30], [rightX + 8, motorY + 30]], 'rgba(192,132,252,0.4)', false);

        // Legend
        ctx.fillStyle = COLORS.note;
        roundRect(ctx, 830, 80, 240, 160, 8); ctx.fill();
        ctx.strokeStyle = 'rgba(56,189,248,0.1)'; ctx.lineWidth = 1; ctx.stroke();
        drawBoldLabel(ctx, 850, 105, 'LEYENDA', COLORS.chipLabel, 'left');
        drawWire(ctx, [[850, 130], [880, 130]], COLORS.wireGreen, false);
        drawLabel(ctx, 890, 130, 'IN_FWD (Q1 + Q4)', COLORS.wireGreen, 'left', '10');
        drawWire(ctx, [[850, 155], [880, 155]], COLORS.wireRed, false);
        drawLabel(ctx, 890, 155, 'IN_REV (Q2 + Q3)', COLORS.wireRed, 'left', '10');
        drawWire(ctx, [[850, 180], [880, 180]], COLORS.wirePurple, false);
        drawLabel(ctx, 890, 180, 'Diodos flyback', COLORS.wirePurple, 'left', '10');
        drawWire(ctx, [[850, 205], [880, 205]], COLORS.vcc, false);
        drawLabel(ctx, 890, 205, '+5V / GND', COLORS.vcc, 'left', '10');

        // Current flow note
        ctx.fillStyle = COLORS.note;
        roundRect(ctx, 830, 260, 240, 100, 8); ctx.fill();
        drawBoldLabel(ctx, 850, 285, 'FLUJO DE CORRIENTE', '#34d399', 'left');
        drawLabel(ctx, 850, 305, 'FWD: +5V \u2192 Q1 \u2192 MA \u2192 M \u2192 MB \u2192 Q4 \u2192 GND', '#94a3b8', 'left', '9');
        drawLabel(ctx, 850, 325, 'REV: +5V \u2192 Q2 \u2192 MB \u2192 M \u2192 MA \u2192 Q3 \u2192 GND', '#94a3b8', 'left', '9');
        drawLabel(ctx, 850, 345, 'VBE \u2248 0.7V + VCE_sat \u2248 0.2V \u2192 Motor \u2248 4.1V', '#fbbf24', 'left', '9');
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       Initialization
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    document.addEventListener('DOMContentLoaded', function () {
        canvasViewers.canvasSystem = new CanvasViewer('canvasSystem', 1100, 500, drawSystemDiagram);
        canvasViewers.canvasTX = new CanvasViewer('canvasTX', 1100, 680, drawTXCircuit);
        canvasViewers.canvasRX = new CanvasViewer('canvasRX', 1100, 580, drawRXCircuit);
        canvasViewers.canvasHBridge = new CanvasViewer('canvasHBridge', 1100, 650, drawHBridgeDiagram);
    });

})();
