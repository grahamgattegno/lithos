/* Gem Copter — Gravastar Counterstrike cutscene (game + preview) */
(function (global) {
  const PHASES = [
    { id: 'title', dur: 2.4 },
    { id: 'climb', dur: 3.8 },
    { id: 'solar', dur: 3.6 },
    { id: 'lock', dur: 2.6 },
    { id: 'laser', dur: 4.2 },
    { id: 'planets', dur: 5.8 },
    { id: 'blackhole', dur: 5.4 },
    { id: 'boom', dur: 2.8 },
  ];

  const PLANETS = [
    { name: 'Mercury', color: '#b0b0b0', size: 7 },
    { name: 'Venus', color: '#e8c070', size: 9 },
    { name: 'Earth', color: '#4a9ae8', size: 10 },
    { name: 'Mars', color: '#d06040', size: 8 },
    { name: 'Jupiter', color: '#d4a870', size: 16 },
    { name: 'Saturn', color: '#e8d898', size: 14, ring: true },
    { name: 'Uranus', color: '#80d8e8', size: 11 },
    { name: 'Neptune', color: '#4060d0', size: 11 },
  ];

  const MAP10 = {
    id: 10,
    name: 'Rainbow Crater',
    sky: ['#100818', '#201030'],
    ground: '#281838',
    accent: '#c9a94f',
    boss: 'Auric Apocalypse',
  };

  function phase(c) {
    let acc = 0;
    for (const p of PHASES) {
      if (c.t < acc + p.dur) {
        return { id: p.id, local: c.t - acc, dur: p.dur, prog: (c.t - acc) / p.dur };
      }
      acc += p.dur;
    }
    return { id: 'done', local: 0, dur: 1, prog: 1 };
  }

  function totalDuration() {
    return PHASES.reduce((a, p) => a + p.dur, 0);
  }

  function create(opts) {
    opts = opts || {};
    return {
      t: 0,
      planetIdx: 0,
      planetT: 0,
      shake: 0,
      bossName: opts.bossName || 'Auric Apocalypse',
      bossAccent: opts.bossAccent || '#c9a94f',
      map: opts.map || MAP10,
      booms: [],
      impactShake: 0,
    };
  }

  function spawnPlanetImpact(c, W, H, planet, planetIndex) {
    const bx = W / 2;
    const by = H * 0.52;
    const parts = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + planetIndex * 0.55;
      const spd = 90 + (i % 5) * 38;
      parts.push({
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 40,
        size: 2 + (i % 4),
      });
    }
    c.booms.push({
      x: bx,
      y: by,
      t: 0,
      life: 0.95,
      color: planet.color,
      accent: '#fff',
      ring: 22 + planet.size * 2.2,
      parts,
      label: planet.name,
    });
    c.impactShake = Math.max(c.impactShake || 0, 11);
  }

  function tickBooms(c, dt) {
    if (!c.booms || !c.booms.length) return;
    c.booms.forEach((b) => {
      b.t += dt;
    });
    c.booms = c.booms.filter((b) => b.t < b.life);
  }

  function drawPlanetExplosions(ctx, c) {
    if (!c.booms || !c.booms.length) return;
    c.booms.forEach((b) => {
      const prog = b.t / b.life;
      const a = Math.max(0, 1 - prog);
      ctx.strokeStyle = b.color;
      ctx.globalAlpha = a * 0.9;
      ctx.lineWidth = 2 + prog * 8;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.ring + prog * 85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#fff';
      ctx.globalAlpha = a * 0.45;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.ring * 0.5 + prog * 45, 0, Math.PI * 2);
      ctx.stroke();
      if (prog < 0.4) {
        const flashA = 1 - prog / 0.4;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 35 + prog * 110);
        g.addColorStop(0, `rgba(255,255,255,${flashA})`);
        g.addColorStop(0.35, b.color);
        g.addColorStop(1, 'rgba(255,120,40,0)');
        ctx.globalAlpha = flashA;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 35 + prog * 110, 0, Math.PI * 2);
        ctx.fill();
      }
      b.parts.forEach((p) => {
        const px = b.x + p.vx * b.t;
        const py = b.y + p.vy * b.t + 120 * b.t * b.t;
        ctx.fillStyle = b.color;
        ctx.globalAlpha = a * 0.95;
        ctx.fillRect(px, py, p.size, p.size);
        ctx.fillStyle = b.accent;
        ctx.globalAlpha = a * 0.35;
        ctx.fillRect(px + 1, py + 1, p.size * 0.6, p.size * 0.6);
      });
      if (prog < 0.55 && b.label) {
        ctx.globalAlpha = (1 - prog / 0.55) * 0.85;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.label + ' IMPACT', b.x, b.y - 28 - prog * 20);
      }
    });
    ctx.globalAlpha = 1;
  }

  function update(c, dt, W, H) {
    W = W || 960;
    H = H || 540;
    c.t += dt;
    c.shake = Math.min(6, c.t * 0.15);
    if (c.impactShake > 0) {
      c.impactShake = Math.max(0, c.impactShake - dt * 11);
      c.shake = Math.max(c.shake, c.impactShake);
    }
    tickBooms(c, dt);
    const ph = phase(c);
    if (ph.id === 'planets') {
      c.planetT += dt;
      if (c.planetT > 0.65) {
        c.planetT = 0;
        if (c.planetIdx < PLANETS.length) {
          spawnPlanetImpact(c, W, H, PLANETS[c.planetIdx], c.planetIdx);
        }
        c.planetIdx++;
      }
    }
    return ph;
  }

  function isDone(c) {
    return phase(c).id === 'done';
  }

  function drawStars(ctx, W, H, seed, alpha) {
    for (let i = 0; i < 140; i++) {
      const x = (Math.sin(seed * 0.17 + i * 12.9898) * 0.5 + 0.5) * W;
      const y = (Math.cos(seed * 0.11 + i * 78.233) * 0.5 + 0.5) * H;
      const sz = 1 + (i % 3);
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = alpha * (0.35 + (i % 5) * 0.12);
      ctx.fillRect(x, y, sz, sz);
    }
    ctx.globalAlpha = 1;
  }

  function drawBossSil(ctx, cx, cy, sc, c, alpha, hurt) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalAlpha = alpha;
    const map = c.map || MAP10;
    if (global.GcBossShapes && global.GcBossShapes.drawBossBody) {
      const fake = {
        name: c.bossName,
        r: 34 * sc,
        t: performance.now() / 1000,
        hp: 1,
        maxHp: 1,
        hurt: hurt ? 1 : 0,
      };
      global.GcBossShapes.drawBossBody(ctx, fake, map);
    } else {
      ctx.fillStyle = c.bossAccent;
      ctx.beginPath();
      ctx.arc(0, 0, 30 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${14 * sc}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(c.bossName, 0, -40 * sc);
    }
    ctx.restore();
  }

  function draw(ctx, c, W, H) {
    const ph = phase(c);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#020208');
    g.addColorStop(1, '#0a0820');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    drawStars(ctx, W, H, c.t, 0.55 + Math.min(0.45, c.t * 0.08));

    ctx.textAlign = 'center';

    if (ph.id === 'title') {
      ctx.fillStyle = '#7dffd4';
      ctx.font = 'bold 26px system-ui,sans-serif';
      ctx.fillText('GRAVASTAR COUNTERSTRIKE', W / 2, H * 0.42);
      ctx.fillStyle = '#e8ecf4';
      ctx.font = '15px system-ui,sans-serif';
      ctx.fillText('Leaving Rainbow Crater…', W / 2, H * 0.5);
      ctx.globalAlpha = 0.5 + ph.prog * 0.5;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.72, 18 + ph.prog * 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      return ph;
    }

    const cam = Math.min(1, ph.id === 'climb' ? ph.prog : 1);
    if (ph.id === 'climb' || ph.id === 'solar' || ph.id === 'lock') {
      ctx.save();
      ctx.translate(W / 2, H * 0.62);
      ctx.scale(0.35 + cam * 0.25, 0.35 + cam * 0.25);
      ctx.fillStyle = '#2a5038';
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a3868';
      ctx.beginPath();
      ctx.arc(0, -8, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = 'rgba(255,220,120,0.9)';
      ctx.beginPath();
      ctx.arc(W * 0.78, H * 0.22, 28 + cam * 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,200,0.35)';
      ctx.beginPath();
      ctx.arc(W * 0.78, H * 0.22, 40 + cam * 18, 0, Math.PI * 2);
      ctx.fill();
      if (ph.id !== 'climb') {
        PLANETS.forEach((p, i) => {
          const a = c.t * 0.4 + i * 0.78;
          const dist = 70 + i * 22;
          const px = W / 2 + Math.cos(a) * dist;
          const py = H * 0.55 + Math.sin(a) * dist * 0.35;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fill();
          if (p.ring) {
            ctx.strokeStyle = 'rgba(232,216,152,0.55)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(px, py, p.size * 1.8, p.size * 0.55, a * 0.2, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
      }
      if (ph.id === 'climb') {
        ctx.fillStyle = '#e8ecf4';
        ctx.font = '16px system-ui,sans-serif';
        ctx.fillText('Past the solar system… beyond known space', W / 2, H * 0.12);
      }
      if (ph.id === 'solar') {
        ctx.fillStyle = '#7dffd4';
        ctx.font = '17px system-ui,sans-serif';
        ctx.fillText('Space Counter-Strike online', W / 2, H * 0.1);
      }
      if (ph.id === 'lock') {
        const bx = W / 2;
        const by = H * 0.48;
        ctx.strokeStyle = '#ff4060';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx - 48, by - 48, 96, 96);
        ctx.fillStyle = 'rgba(255,64,96,0.25)';
        ctx.fillRect(bx - 48, by - 48, 96, 96);
        drawBossSil(ctx, bx, by + 20, 1.1, c, 0.95, false);
        ctx.fillStyle = '#fff';
        ctx.font = '14px system-ui,sans-serif';
        ctx.fillText('TARGET LOCK: ' + c.bossName, bx, by - 62);
      }
      return ph;
    }

    if (ph.id === 'laser') {
      const bx = W / 2;
      const by = H * 0.52;
      const srcY = H * 0.07;
      const srcX = bx;

      // Bolt races from space weapon down to the boss (ease-out, no pop-in)
      const travelT = Math.min(1, ph.prog / 0.4);
      const ease = 1 - Math.pow(1 - travelT, 2.8);
      const frontY = srcY + (by - srcY) * ease;
      const hitBoss = travelT >= 0.995;
      const swell = hitBoss ? Math.min(1, (ph.prog - 0.4) / 0.55) : 0;

      drawBossSil(ctx, bx, by, 1.15, c, 1, hitBoss && swell > 0.35);

      // orbital strike emitter
      ctx.fillStyle = '#2a3848';
      ctx.fillRect(srcX - 18, srcY - 10, 36, 14);
      ctx.strokeStyle = '#7dffd4';
      ctx.lineWidth = 2;
      ctx.strokeRect(srcX - 16, srcY - 8, 32, 10);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(srcX, srcY + 2, 5, 0, Math.PI * 2);
      ctx.fill();

      const tipPulse = 1 + Math.sin(c.t * 28) * 0.12;

      if (travelT > 0.02) {
        const coreTop = 3 + travelT * 5;
        const coreBot = 5 + travelT * 10;
        const boltGrad = ctx.createLinearGradient(srcX, srcY, srcX, frontY);
        boltGrad.addColorStop(0, 'rgba(255,255,255,1)');
        boltGrad.addColorStop(0.55, 'rgba(255,255,255,0.96)');
        boltGrad.addColorStop(1, 'rgba(200,230,255,0.75)');
        ctx.fillStyle = boltGrad;
        ctx.beginPath();
        ctx.moveTo(srcX - coreTop, srcY);
        ctx.lineTo(srcX + coreTop, srcY);
        ctx.lineTo(srcX + coreBot, frontY);
        ctx.lineTo(srcX - coreBot, frontY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(srcX, srcY);
        ctx.lineTo(srcX, frontY);
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 18 * tipPulse;
        ctx.beginPath();
        ctx.arc(srcX, frontY, (7 + travelT * 8) * tipPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (swell > 0.02) {
        const wTop = 10 + swell * 46;
        const wBot = 18 + swell * 82;
        const beamGrad = ctx.createLinearGradient(bx, srcY, bx, H);
        beamGrad.addColorStop(0, 'rgba(255,255,255,0.98)');
        beamGrad.addColorStop(0.45, 'rgba(255,255,255,0.88)');
        beamGrad.addColorStop(1, 'rgba(200,220,255,0.05)');
        ctx.fillStyle = beamGrad;
        ctx.globalAlpha = 0.55 + swell * 0.45;
        ctx.beginPath();
        ctx.moveTo(bx - wTop, srcY);
        ctx.lineTo(bx + wTop, srcY);
        ctx.lineTo(bx + wBot, H);
        ctx.lineTo(bx - wBot, H);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.globalAlpha = 0.4 + swell * 0.55;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(bx, by, 22 + swell * 92, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (ph.prog > 0.58) {
        ctx.fillStyle = '#ff8090';
        ctx.font = 'bold 18px system-ui,sans-serif';
        ctx.fillText('STILL ALIVE?!', W / 2, H * 0.88);
      }
      return ph;
    }

    if (ph.id === 'planets') {
      const bx = W / 2;
      const by = H * 0.52;
      drawBossSil(ctx, bx, by, 1, c, 0.85 + Math.sin(c.t * 8) * 0.1, true);
      drawPlanetExplosions(ctx, c);
      const idx = Math.min(c.planetIdx, PLANETS.length);
      if (idx < PLANETS.length) {
        const p = PLANETS[idx];
        const t = Math.min(1, c.planetT / 0.55);
        const px = (1 - t) * W * 0.92 + t * bx;
        const py = (1 - t) * H * 0.08 + t * by;
        if (t > 0.75) {
          ctx.strokeStyle = 'rgba(255,255,255,0.35)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size * (1 + t * 0.15), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '14px system-ui,sans-serif';
        ctx.fillText(p.name, W / 2, H * 0.1);
      } else {
        ctx.fillStyle = '#ff6080';
        ctx.font = 'bold 17px system-ui,sans-serif';
        ctx.fillText('IT STILL SURVIVES!', W / 2, H * 0.1);
      }
      return ph;
    }

    if (ph.id === 'blackhole') {
      const bx = W / 2;
      const by = H * 0.52;
      const r = 20 + ph.prog * Math.min(W, H) * 0.48;
      const swirl = Math.sin(c.t * 14) * ph.prog * 10;
      drawBossSil(ctx, bx + swirl, by + swirl * 0.6, 1 - ph.prog * 0.7, c, 1 - ph.prog * 0.85, true);
      const hole = ctx.createRadialGradient(bx, by, 0, bx, by, r);
      hole.addColorStop(0, '#000');
      hole.addColorStop(0.35, '#120818');
      hole.addColorStop(0.7, 'rgba(80,40,120,0.5)');
      hole.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hole;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(200,160,255,0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(bx, by, r * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#e8d4ff';
      ctx.font = 'bold 18px system-ui,sans-serif';
      ctx.fillText('GRAVASTAR — MAXIMUM SINGULARITY', W / 2, H * 0.12);
      return ph;
    }

    if (ph.id === 'boom' || ph.id === 'done') {
      const flash = ph.id === 'boom' ? 1 - ph.prog : 0;
      ctx.fillStyle = `rgba(255,255,255,${flash * 0.92})`;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#c9a94f';
      ctx.font = 'bold 24px system-ui,sans-serif';
      ctx.fillText('AURIC APOCALYPSE — DESTROYED', W / 2, H * 0.48);
      ctx.fillStyle = '#7dffd4';
      ctx.font = '16px system-ui,sans-serif';
      ctx.fillText('Rainbow Crater cleared', W / 2, H * 0.56);
    }
    return ph;
  }

  global.GcGravastarScene = {
    PHASES,
    PLANETS,
    MAP10,
    create,
    update,
    draw,
    phase,
    isDone,
    totalDuration,
  };
})(typeof window !== 'undefined' ? window : global);
