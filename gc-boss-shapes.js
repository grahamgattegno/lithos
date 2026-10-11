/* Gem Copter — per-map boss silhouettes (game + boss gallery) */
(function (global) {
  function darken(hex, f) {
    const n = parseInt(String(hex).replace('#', ''), 16);
    if (Number.isNaN(n)) return hex;
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.max(0, Math.min(255, Math.round(r * f)));
    g = Math.max(0, Math.min(255, Math.round(g * f)));
    b = Math.max(0, Math.min(255, Math.round(b * f)));
    return `rgb(${r},${g},${b})`;
  }

  function skids(ctx, sc) {
    ctx.strokeStyle = '#252a30';
    ctx.lineWidth = 3 * sc;
    ctx.beginPath();
    ctx.moveTo(-24 * sc, 16 * sc);
    ctx.lineTo(-12 * sc, 24 * sc);
    ctx.lineTo(26 * sc, 24 * sc);
    ctx.lineTo(38 * sc, 16 * sc);
    ctx.stroke();
  }

  function rotors(ctx, b, sc, pairs, color) {
    const spin = b.t * 16;
    pairs.forEach(([tx, ty, len]) => {
      ctx.save();
      ctx.translate(tx, ty);
      ctx.strokeStyle = color || 'rgba(255,100,100,.75)';
      ctx.lineWidth = 2.5 * sc;
      ctx.beginPath();
      ctx.moveTo(Math.cos(spin) * len, 0);
      ctx.lineTo(Math.cos(spin + Math.PI) * len, 0);
      ctx.stroke();
      ctx.restore();
    });
  }

  function gemEye(ctx, sc, glow, cx, cy, rx, ry, r) {
    ctx.fillStyle = '#141820';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = glow;
    ctx.globalAlpha = 0.88;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function nameAndBar(ctx, b, sc) {
    ctx.fillStyle = '#e8ecf4';
    ctx.font = `bold ${Math.max(10, 11 * sc) | 0}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(b.name, 0, -38 * sc);
    const barW = 120 * sc;
    const barY = 30 * sc;
    const ratio = b.maxHp ? b.hp / b.maxHp : 0.72;
    ctx.fillStyle = 'rgba(0,0,0,.55)';
    ctx.fillRect(-barW / 2, barY, barW, 8 * sc);
    ctx.fillStyle = '#ff4060';
    ctx.fillRect(-barW / 2, barY, barW * ratio, 8 * sc);
  }

  const V = {
    /* 1 — wide assault tank, triple snout cannons */
    1(ctx, sc, hull, glow, b) {
      skids(ctx, sc);
      ctx.fillStyle = hull;
      ctx.fillRect(-38 * sc, 4 * sc, 76 * sc, 14 * sc);
      ctx.beginPath();
      ctx.moveTo(-36 * sc, 4 * sc);
      ctx.lineTo(36 * sc, 4 * sc);
      ctx.lineTo(40 * sc, -8 * sc);
      ctx.lineTo(-32 * sc, -8 * sc);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = darken(glow, 0.4);
      ctx.fillRect(-28 * sc, -18 * sc, 56 * sc, 12 * sc);
      [-18, 0, 18].forEach((px) => {
        ctx.fillStyle = '#303840';
        ctx.fillRect(px * sc - 4 * sc, -6 * sc, 8 * sc, 10 * sc);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px * sc, -1 * sc, 3 * sc, 0, Math.PI * 2);
        ctx.fill();
      });
      gemEye(ctx, sc, glow, 0, -12 * sc, 10 * sc, 6 * sc, 4 * sc);
      rotors(ctx, b, sc, [[0, -32 * sc, 26 * sc]]);
    },
    /* 2 — long sub hull, fin, tail rotor */
    2(ctx, sc, hull, glow, b) {
      skids(ctx, sc);
      ctx.fillStyle = hull;
      ctx.beginPath();
      ctx.ellipse(0, 6 * sc, 44 * sc, 12 * sc, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = darken(glow, 0.35);
      ctx.beginPath();
      ctx.moveTo(-8 * sc, -14 * sc);
      ctx.lineTo(8 * sc, -14 * sc);
      ctx.lineTo(4 * sc, -28 * sc);
      ctx.lineTo(-4 * sc, -28 * sc);
      ctx.closePath();
      ctx.fill();
      gemEye(ctx, sc, glow, 0, -22 * sc, 5 * sc, 8 * sc, 3.5 * sc);
      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(-42 * sc, 2 * sc, 6 * sc, 8 * sc);
      ctx.globalAlpha = 1;
      rotors(ctx, b, sc, [[38 * sc, 0, 14 * sc]], 'rgba(120,200,255,.8)');
      ctx.fillStyle = hull;
      ctx.beginPath();
      ctx.moveTo(36 * sc, -4 * sc);
      ctx.lineTo(48 * sc, 6 * sc);
      ctx.lineTo(36 * sc, 10 * sc);
      ctx.closePath();
      ctx.fill();
    },
    /* 3 — lumpy jungle carrier + hanging pods */
    3(ctx, sc, hull, glow, b) {
      skids(ctx, sc);
      ctx.fillStyle = hull;
      ctx.beginPath();
      ctx.ellipse(0, 2 * sc, 34 * sc, 18 * sc, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = darken(glow, 0.45);
      ctx.beginPath();
      ctx.arc(-12 * sc, -8 * sc, 14 * sc, 0, Math.PI * 2);
      ctx.arc(14 * sc, -6 * sc, 12 * sc, 0, Math.PI * 2);
      ctx.fill();
      gemEye(ctx, sc, glow, 2 * sc, -4 * sc, 11 * sc, 9 * sc, 5 * sc);
      [-28, 28].forEach((px, i) => {
        ctx.strokeStyle = darken(glow, 0.55);
        ctx.lineWidth = 2 * sc;
        ctx.beginPath();
        ctx.moveTo(px * sc * 0.6, 8 * sc);
        ctx.lineTo(px * sc, 22 * sc);
        ctx.stroke();
        ctx.fillStyle = glow;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.ellipse(px * sc, 24 * sc, 7 * sc, 9 * sc, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      rotors(ctx, b, sc, [[-14 * sc, -26 * sc, 16 * sc], [16 * sc, -24 * sc, 16 * sc]]);
    },
    /* 4 — crystal crown, faceted hull */
    4(ctx, sc, hull, glow, b) {
      skids(ctx, sc);
      ctx.fillStyle = hull;
      ctx.beginPath();
      ctx.moveTo(-30 * sc, 12 * sc);
      ctx.lineTo(-22 * sc, -4 * sc);
      ctx.lineTo(0, -20 * sc);
      ctx.lineTo(22 * sc, -4 * sc);
      ctx.lineTo(30 * sc, 12 * sc);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = glow;
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(0, -20 * sc);
      ctx.lineTo(0, -34 * sc);
      ctx.moveTo(-12 * sc, -14 * sc);
      ctx.lineTo(-20 * sc, -30 * sc);
      ctx.moveTo(12 * sc, -14 * sc);
      ctx.lineTo(20 * sc, -30 * sc);
      ctx.stroke();
      ctx.fillStyle = glow;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(-8 * sc, -8 * sc);
      ctx.lineTo(0, -18 * sc);
      ctx.lineTo(8 * sc, -8 * sc);
      ctx.fill();
      ctx.globalAlpha = 1;
      gemEye(ctx, sc, glow, 0, 2 * sc, 9 * sc, 7 * sc, 4 * sc);
      rotors(ctx, b, sc, [[-20 * sc, -22 * sc, 14 * sc], [20 * sc, -22 * sc, 14 * sc]], 'rgba(200,140,255,.85)');
    },
    /* 5 — tall frost spire, horn wings */
    5(ctx, sc, hull, glow, b) {
      skids(ctx, sc);
      ctx.fillStyle = hull;
      ctx.fillRect(-14 * sc, -24 * sc, 28 * sc, 36 * sc);
      ctx.fillStyle = darken(glow, 0.5);
      ctx.fillRect(-10 * sc, -20 * sc, 20 * sc, 8 * sc);
      [[-1, -18, -28, -36], [1, -18, 28, -36]].forEach(([sx, sy, ex, ey]) => {
        ctx.fillStyle = '#c8d8e8';
        ctx.beginPath();
        ctx.moveTo(sx * 14 * sc, sy * sc);
        ctx.lineTo(ex * sc, ey * sc);
        ctx.lineTo(sx * 8 * sc, -8 * sc);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = glow;
        ctx.lineWidth = 1.5 * sc;
        ctx.stroke();
      });
      gemEye(ctx, sc, glow, 0, -8 * sc, 8 * sc, 10 * sc, 5 * sc);
      rotors(ctx, b, sc, [[0, -38 * sc, 20 * sc]], 'rgba(200,220,255,.8)');
    },
    /* 6 — mirage delta wings */
    6(ctx, sc, hull, glow, b) {
      skids(ctx, sc);
      ctx.fillStyle = hull;
      ctx.fillRect(-8 * sc, -6 * sc, 16 * sc, 18 * sc);
      ctx.fillStyle = darken(glow, 0.4);
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-52 * sc, 14 * sc);
      ctx.lineTo(-18 * sc, 6 * sc);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(52 * sc, 14 * sc);
      ctx.lineTo(18 * sc, 6 * sc);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = glow;
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(-52 * sc, 14 * sc);
      ctx.lineTo(52 * sc, 14 * sc);
      ctx.stroke();
      gemEye(ctx, sc, glow, 0, -4 * sc, 6 * sc, 8 * sc, 3.5 * sc);
      rotors(ctx, b, sc, [[-36 * sc, -10 * sc, 12 * sc], [36 * sc, -10 * sc, 12 * sc]], 'rgba(255,160,220,.75)');
    },
    /* 7 — low sand crawler + treads */
    7(ctx, sc, hull, glow, b) {
      ctx.fillStyle = '#2a2420';
      [-26, 10].forEach((px) => {
        ctx.beginPath();
        ctx.arc(px * sc, 22 * sc, 8 * sc, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4a4038';
        ctx.lineWidth = 2 * sc;
        ctx.stroke();
      });
      ctx.fillStyle = hull;
      ctx.fillRect(-40 * sc, 0, 80 * sc, 16 * sc);
      ctx.fillRect(-12 * sc, -14 * sc, 24 * sc, 16 * sc);
      ctx.fillStyle = darken(glow, 0.45);
      ctx.beginPath();
      ctx.arc(0, -18 * sc, 10 * sc, 0, Math.PI * 2);
      ctx.fill();
      gemEye(ctx, sc, glow, 0, -6 * sc, 10 * sc, 6 * sc, 4 * sc);
      const spin = b.t * 10;
      ctx.save();
      ctx.translate(0, -20 * sc);
      ctx.strokeStyle = glow;
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(Math.cos(spin) * 12 * sc, Math.sin(spin) * 12 * sc);
      ctx.lineTo(Math.cos(spin + Math.PI) * 12 * sc, Math.sin(spin + Math.PI) * 12 * sc);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = glow;
      ctx.fillRect(32 * sc, 4 * sc, 10 * sc, 4 * sc);
    },
    /* 8 — volcano back, jagged plates */
    8(ctx, sc, hull, glow, b) {
      skids(ctx, sc);
      ctx.fillStyle = hull;
      ctx.beginPath();
      ctx.moveTo(-34 * sc, 12 * sc);
      ctx.lineTo(-20 * sc, -8 * sc);
      ctx.lineTo(24 * sc, -8 * sc);
      ctx.lineTo(38 * sc, 12 * sc);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = darken(glow, 0.35);
      ctx.beginPath();
      ctx.moveTo(-6 * sc, -8 * sc);
      ctx.lineTo(0, -32 * sc);
      ctx.lineTo(6 * sc, -8 * sc);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ff6040';
      ctx.globalAlpha = 0.6 + Math.sin(b.t * 8) * 0.2;
      ctx.beginPath();
      ctx.arc(0, -30 * sc, 5 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      gemEye(ctx, sc, glow, 8 * sc, 2 * sc, 9 * sc, 7 * sc, 4 * sc);
      rotors(ctx, b, sc, [[-22 * sc, -18 * sc, 15 * sc], [22 * sc, -16 * sc, 15 * sc]], 'rgba(255,120,80,.85)');
    },
    /* 9 — forked mining jaw + crane arm */
    9(ctx, sc, hull, glow, b) {
      skids(ctx, sc);
      ctx.fillStyle = hull;
      ctx.fillRect(-20 * sc, -4 * sc, 40 * sc, 16 * sc);
      ctx.strokeStyle = '#505860';
      ctx.lineWidth = 3 * sc;
      ctx.beginPath();
      ctx.moveTo(-28 * sc, 8 * sc);
      ctx.lineTo(-40 * sc, 20 * sc);
      ctx.lineTo(-24 * sc, 12 * sc);
      ctx.moveTo(28 * sc, 8 * sc);
      ctx.lineTo(40 * sc, 20 * sc);
      ctx.lineTo(24 * sc, 12 * sc);
      ctx.stroke();
      ctx.fillStyle = hull;
      ctx.beginPath();
      ctx.moveTo(18 * sc, -8 * sc);
      ctx.lineTo(34 * sc, -28 * sc);
      ctx.lineTo(30 * sc, -30 * sc);
      ctx.lineTo(16 * sc, -10 * sc);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = glow;
      ctx.fillRect(32 * sc, -32 * sc, 6 * sc, 6 * sc);
      gemEye(ctx, sc, glow, -4 * sc, 0, 8 * sc, 7 * sc, 4 * sc);
      rotors(ctx, b, sc, [[0, -24 * sc, 18 * sc]]);
    },
    /* 10 — golden halo ring + crown */
    10(ctx, sc, hull, glow, b) {
      skids(ctx, sc);
      ctx.strokeStyle = glow;
      ctx.lineWidth = 4 * sc;
      ctx.beginPath();
      ctx.ellipse(0, 0, 42 * sc, 22 * sc, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = hull;
      ctx.beginPath();
      ctx.arc(0, 0, 16 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = darken(glow, 0.4);
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 14 * sc, Math.sin(a) * 14 * sc);
        ctx.lineTo(Math.cos(a) * 26 * sc, Math.sin(a) * 26 * sc - 8 * sc);
        ctx.lineTo(Math.cos(a + 0.25) * 14 * sc, Math.sin(a + 0.25) * 14 * sc);
        ctx.fill();
      }
      gemEye(ctx, sc, glow, 0, 0, 10 * sc, 10 * sc, 6 * sc);
      rotors(ctx, b, sc, [[-32 * sc, -8 * sc, 14 * sc], [32 * sc, -8 * sc, 14 * sc], [0, -34 * sc, 16 * sc]], 'rgba(255,220,120,.85)');
    },
  };

  function drawBossBody(ctx, b, m) {
    const sc = b.r / 34;
    const hop = Math.sin(b.t * 1.3) * 3;
    const hull = b.hurt > 0 ? '#d8e0ec' : '#3a444c';
    const glow = m.accent;
    ctx.translate(0, hop);
    const fn = V[m.id] || V[1];
    fn(ctx, sc, hull, glow, b);
    nameAndBar(ctx, b, sc);
  }

  global.GcBossShapes = { drawBossBody, darken };
})(typeof window !== 'undefined' ? window : global);
