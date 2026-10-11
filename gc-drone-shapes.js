/* Gem Copter — hostile ground drone silhouettes (not boss gunships) */
(function (global) {
  const NAMES = [
    'Walker', 'Spider', 'Tread', 'Orb', 'Crane', 'Boxer', 'Twin', 'Pylon',
  ];

  function hull(z) {
    if (z.hurt > 0) return '#b8c0c8';
    return z.elite ? '#3a4850' : '#454f58';
  }

  function eye(ctx, x, y, r, accent) {
    ctx.fillStyle = '#101820';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.88;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function eliteRing(ctx, sc, accent) {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.65;
    ctx.strokeRect(-14 * sc, -16 * sc, 28 * sc, 22 * sc);
    ctx.globalAlpha = 1;
  }

  const V = {
    0(ctx, sc, h, accent, z) {
      const walk = Math.sin(z.t * 9) * 3;
      ctx.fillStyle = h;
      ctx.fillRect(-8 * sc, -14 * sc, 16 * sc, 14 * sc);
      ctx.fillRect(-10 * sc, 0 + walk, 4 * sc, 10 * sc);
      ctx.fillRect(6 * sc, 0 - walk, 4 * sc, 10 * sc);
      ctx.fillStyle = '#2a3238';
      ctx.fillRect(-6 * sc, -20 * sc, 12 * sc, 8 * sc);
      eye(ctx, 0, -16 * sc, 3.5 * sc, accent);
      ctx.fillStyle = '#606878';
      ctx.fillRect(-12 * sc, -8 * sc, 4 * sc, 3 * sc);
      ctx.fillRect(8 * sc, -8 * sc, 4 * sc, 3 * sc);
    },
    1(ctx, sc, h, accent, z) {
      const wiggle = Math.sin(z.t * 12) * 0.15;
      ctx.rotate(wiggle);
      ctx.fillStyle = h;
      ctx.beginPath();
      ctx.ellipse(0, -4 * sc, 11 * sc, 8 * sc, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2a3038';
      ctx.lineWidth = 2 * sc;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + z.t * 4;
        const lx = Math.cos(a) * 14 * sc;
        const ly = Math.sin(a) * 8 * sc + 4 * sc;
        ctx.beginPath();
        ctx.moveTo(lx * 0.4, ly * 0.4 - 4 * sc);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      }
      eye(ctx, 0, -5 * sc, 3 * sc, accent);
    },
    2(ctx, sc, h, accent, z) {
      ctx.fillStyle = '#1a2028';
      [-12, 8].forEach((px) => {
        ctx.beginPath();
        ctx.arc(px * sc, 8 * sc, 6 * sc, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = h;
      ctx.fillRect(-14 * sc, -6 * sc, 28 * sc, 12 * sc);
      ctx.fillRect(-6 * sc, -14 * sc, 12 * sc, 10 * sc);
      eye(ctx, 0, -10 * sc, 3 * sc, accent);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(10 * sc, -2 * sc, 6 * sc, 3 * sc);
      ctx.globalAlpha = 1;
    },
    3(ctx, sc, h, accent, z) {
      const bob = Math.sin(z.t * 7) * 4;
      ctx.translate(0, bob);
      ctx.fillStyle = h;
      ctx.beginPath();
      ctx.arc(0, -6 * sc, 10 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5 * sc;
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + z.t * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 8 * sc, -6 * sc + Math.sin(a) * 8 * sc);
        ctx.lineTo(Math.cos(a) * 16 * sc, -6 * sc + Math.sin(a) * 16 * sc);
        ctx.stroke();
      }
      eye(ctx, 0, -7 * sc, 4 * sc, accent);
      ctx.strokeStyle = '#7dffd4';
      ctx.beginPath();
      ctx.moveTo(0, 4 * sc);
      ctx.lineTo(0, 10 * sc);
      ctx.stroke();
    },
    4(ctx, sc, h, accent, z) {
      ctx.fillStyle = h;
      ctx.fillRect(-5 * sc, -22 * sc, 10 * sc, 24 * sc);
      ctx.fillStyle = '#3a4048';
      ctx.save();
      ctx.translate(6 * sc, -18 * sc);
      ctx.rotate(-0.4 + Math.sin(z.t * 3) * 0.08);
      ctx.fillRect(0, 0, 18 * sc, 3 * sc);
      ctx.fillStyle = accent;
      ctx.fillRect(16 * sc, -1 * sc, 4 * sc, 5 * sc);
      ctx.restore();
      eye(ctx, 0, -18 * sc, 3 * sc, accent);
      ctx.fillRect(-8 * sc, 0, 16 * sc, 4 * sc);
    },
    5(ctx, sc, h, accent, z) {
      ctx.fillStyle = h;
      ctx.fillRect(-12 * sc, -16 * sc, 24 * sc, 20 * sc);
      ctx.fillStyle = '#141820';
      ctx.fillRect(-9 * sc, -13 * sc, 18 * sc, 10 * sc);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5 * sc;
      ctx.strokeRect(-9 * sc, -13 * sc, 18 * sc, 10 * sc);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.35;
      ctx.fillRect(-6 * sc, -10 * sc, 4 * sc, 2 * sc);
      ctx.fillRect(0, -10 * sc, 4 * sc, 2 * sc);
      ctx.fillRect(6 * sc, -10 * sc, 3 * sc, 2 * sc);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#505860';
      ctx.fillRect(-8 * sc, 2 * sc, 6 * sc, 8 * sc);
      ctx.fillRect(2 * sc, 2 * sc, 6 * sc, 8 * sc);
    },
    6(ctx, sc, h, accent, z) {
      const sway = Math.sin(z.t * 8) * 2;
      ctx.fillStyle = h;
      ctx.beginPath();
      ctx.arc(-5 * sc, -8 * sc + sway, 7 * sc, 0, Math.PI * 2);
      ctx.arc(6 * sc, -6 * sc - sway, 6 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#586878';
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(-5 * sc, -1 * sc + sway);
      ctx.lineTo(6 * sc, 0 - sway);
      ctx.stroke();
      eye(ctx, -2 * sc, -7 * sc, 2.5 * sc, accent);
      eye(ctx, 4 * sc, -5 * sc, 2 * sc, accent);
      ctx.fillRect(-4 * sc, 4 * sc, 3 * sc, 8 * sc);
      ctx.fillRect(2 * sc, 4 * sc, 3 * sc, 8 * sc);
    },
    7(ctx, sc, h, accent, z) {
      ctx.strokeStyle = h;
      ctx.lineWidth = 3 * sc;
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(0, 2 * sc);
        ctx.lineTo(Math.cos(a) * 14 * sc, 2 * sc + Math.sin(a) * 10 * sc);
        ctx.stroke();
      }
      ctx.fillStyle = h;
      ctx.beginPath();
      ctx.moveTo(0, -18 * sc);
      ctx.lineTo(10 * sc, 2 * sc);
      ctx.lineTo(-10 * sc, 2 * sc);
      ctx.closePath();
      ctx.fill();
      eye(ctx, 0, -8 * sc, 3.5 * sc, accent);
    },
  };

  function radius(variant, elite) {
    const base = [15, 16, 15, 14, 17, 16, 15, 16];
    return (base[variant % 8] || 15) * (elite ? 1.22 : 1);
  }

  function draw(ctx, z, m) {
    const variant = (z.variant != null ? z.variant : 0) % 8;
    const elite = !!z.elite;
    const sc = elite ? 1.22 : 1;
    const h = hull(z);
    const accent = m.accent || '#7dffd4';
    ctx.scale(z.face || 1, 1);
    const fn = V[variant] || V[0];
    fn(ctx, sc, h, accent, z);
    if (elite) eliteRing(ctx, sc, accent);
  }

  global.GcDroneShapes = { draw, radius, NAMES, VARIANTS: 8 };
})(typeof window !== 'undefined' ? window : global);
