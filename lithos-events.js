/**
 * Lithos Live Events — host a room with a code, friends join via PeerJS (P2P).
 * Requires PeerJS loaded from CDN before this script.
 */
(function () {
  'use strict';

  const PEER_PREFIX = 'lithos-event-';
  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  let peer = null;
  let role = null; // 'host' | 'guest'
  let eventCode = '';
  let myName = '';
  let myId = '';
  let connections = new Map(); // guest peer id -> connection (host only)
  let hostConn = null; // guest only
  let players = new Map(); // id -> { id, name, score }
  let eventMode = 'hunt';
  let eventState = 'idle'; // idle | lobby | playing | ended
  let round = 0;
  let rounds = [];
  let roundAnswers = new Map();
  let roundWinner = null;

  function genCode() {
    let s = '';
    for (let i = 0; i < 6; i++) s += CODE_CHARS[(Math.random() * CODE_CHARS.length) | 0];
    return s;
  }

  function peerRoomId(code) {
    return PEER_PREFIX + code.toUpperCase();
  }

  function send(conn, msg) {
    if (!conn || !conn.open) return;
    try {
      conn.send(msg);
    } catch (_) {}
  }

  function broadcast(msg) {
    connections.forEach((c) => send(c, msg));
  }

  function huntRounds() {
    const items =
      typeof SCAVENGER_ITEMS !== 'undefined'
        ? SCAVENGER_ITEMS
        : [
            { id: 1, clue: 'Mohs 10 — hardest natural material.', gem: 'Diamond' },
            { id: 2, clue: 'Violet quartz — Greek "not intoxicated."', gem: 'Amethyst' },
            { id: 3, clue: 'Red corundum — pigeon\'s blood hue.', gem: 'Ruby' },
          ];
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).map((it) => ({ clue: it.clue, gem: it.gem, hint: it.hint || '' }));
  }

  function quizRounds() {
    const qs =
      typeof STATIC_Q !== 'undefined'
        ? STATIC_Q
        : [
            {
              q: 'On the Mohs scale, which is the hardest?',
              opts: ['Topaz', 'Diamond', 'Corundum', 'Quartz'],
              a: 1,
              ex: 'Diamond is Mohs 10.',
            },
          ];
    return [...qs].sort(() => Math.random() - 0.5).slice(0, 5);
  }

  function scoreList() {
    return [...players.values()].sort((a, b) => b.score - a.score);
  }

  function setPlayer(id, name, score) {
    const p = players.get(id) || { id, name, score: 0 };
    if (name) p.name = name;
    if (typeof score === 'number') p.score = score;
    players.set(id, p);
  }

  function addScore(id, pts) {
    const p = players.get(id);
    if (p) p.score += pts;
  }

  function destroyPeer() {
    connections.forEach((c) => {
      try {
        c.close();
      } catch (_) {}
    });
    connections.clear();
    if (hostConn) {
      try {
        hostConn.close();
      } catch (_) {}
      hostConn = null;
    }
    if (peer) {
      try {
        peer.destroy();
      } catch (_) {}
      peer = null;
    }
    role = null;
    eventState = 'idle';
    round = 0;
    rounds = [];
    roundAnswers.clear();
    roundWinner = null;
  }

  function handleMessage(fromId, msg) {
    if (!msg || !msg.t) return;
    if (role === 'host') {
      if (msg.t === 'join') {
        setPlayer(fromId, msg.name || 'Explorer', 0);
        send(connections.get(fromId), { t: 'welcome', code: eventCode, mode: eventMode, hostName: myName });
        syncLobby();
      } else if (msg.t === 'found' && eventState === 'playing' && eventMode === 'hunt') {
        if (msg.round !== round || roundWinner) return;
        const cur = rounds[round];
        if (!cur || msg.gem?.toLowerCase() !== cur.gem.toLowerCase()) return;
        roundWinner = fromId;
        addScore(fromId, 10);
        broadcast({ t: 'found', round, gem: cur.gem, winner: players.get(fromId)?.name, winnerId: fromId, scores: scoreList() });
        setTimeout(() => nextRound(), 2200);
      } else if (msg.t === 'answer' && eventState === 'playing' && eventMode === 'quiz') {
        if (msg.round !== round || roundAnswers.has(fromId)) return;
        const q = rounds[round];
        const correct = msg.choice === q.a;
        roundAnswers.set(fromId, msg.choice);
        if (correct) addScore(fromId, 10);
        broadcast({ t: 'answered', id: fromId, name: players.get(fromId)?.name, correct, scores: scoreList() });
        if (roundAnswers.size >= players.size) setTimeout(() => nextRound(), 1500);
      } else if (msg.t === 'chat') {
        broadcast({ t: 'chat', name: players.get(fromId)?.name || 'Guest', text: msg.text });
      }
    } else if (role === 'guest') {
      if (msg.t === 'welcome') {
        eventMode = msg.mode || 'hunt';
        render();
      } else if (msg.t === 'lobby') {
        players.clear();
        (msg.players || []).forEach((p) => setPlayer(p.id, p.name, p.score));
        eventMode = msg.mode || eventMode;
        eventState = 'lobby';
        render();
      } else if (msg.t === 'start') {
        eventState = 'playing';
        round = msg.round || 0;
        rounds = msg.rounds || [];
        roundWinner = null;
        roundAnswers.clear();
        render();
      } else if (msg.t === 'found') {
        roundWinner = msg.winnerId;
        (msg.scores || []).forEach((p) => setPlayer(p.id, p.name, p.score));
        render();
      } else if (msg.t === 'answered') {
        (msg.scores || []).forEach((p) => setPlayer(p.id, p.name, p.score));
        render();
      } else if (msg.t === 'round') {
        round = msg.round;
        roundWinner = null;
        roundAnswers.clear();
        if (msg.scores) msg.scores.forEach((p) => setPlayer(p.id, p.name, p.score));
        render();
      } else if (msg.t === 'end') {
        eventState = 'ended';
        (msg.scores || []).forEach((p) => setPlayer(p.id, p.name, p.score));
        render();
      } else if (msg.t === 'chat') {
        appendChat(msg.name, msg.text);
      }
    }
  }

  function syncLobby() {
    const payload = {
      t: 'lobby',
      code: eventCode,
      mode: eventMode,
      hostName: myName,
      players: scoreList(),
    };
    broadcast(payload);
    if (role === 'host') render();
  }

  function startEvent() {
    rounds = eventMode === 'hunt' ? huntRounds() : quizRounds();
    round = 0;
    roundWinner = null;
    roundAnswers.clear();
    eventState = 'playing';
    players.forEach((p) => (p.score = 0));
    const payload = { t: 'start', mode: eventMode, round: 0, rounds };
    broadcast(payload);
    render();
  }

  function nextRound() {
    round++;
    roundWinner = null;
    roundAnswers.clear();
    if (round >= rounds.length) {
      eventState = 'ended';
      const payload = { t: 'end', scores: scoreList(), winner: scoreList()[0]?.name };
      broadcast(payload);
      render();
      return;
    }
    broadcast({ t: 'round', round, scores: scoreList() });
    render();
  }

  function hostPeer(code) {
    return new Promise((resolve, reject) => {
      if (typeof Peer === 'undefined') {
        reject(new Error('PeerJS not loaded — check your connection and refresh.'));
        return;
      }
      const p = new Peer(peerRoomId(code), { debug: 1 });
      const timer = setTimeout(() => reject(new Error('Connection timed out. Try again.')), 15000);
      p.on('open', (id) => {
        clearTimeout(timer);
        resolve({ peer: p, id });
      });
      p.on('error', (err) => {
        clearTimeout(timer);
        if (err.type === 'unavailable-id') reject(new Error('Code already in use — generate a new one.'));
        else reject(err);
      });
    });
  }

  function guestPeer(code) {
    return new Promise((resolve, reject) => {
      if (typeof Peer === 'undefined') {
        reject(new Error('PeerJS not loaded — check your connection and refresh.'));
        return;
      }
      const p = new Peer({ debug: 1 });
      const timer = setTimeout(() => reject(new Error('Could not reach host. Check the code and try again.')), 15000);
      p.on('open', (id) => {
        clearTimeout(timer);
        const conn = p.connect(peerRoomId(code), { reliable: true });
        const cTimer = setTimeout(() => reject(new Error('Host not found. Is the event still open?')), 12000);
        conn.on('open', () => {
          clearTimeout(cTimer);
          resolve({ peer: p, id, conn });
        });
        conn.on('error', () => {
          clearTimeout(cTimer);
          reject(new Error('Could not join event.'));
        });
      });
      p.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  function wireConnection(conn) {
    conn.on('data', (data) => handleMessage(conn.peer || conn._peerId || 'guest', data));
    conn.on('close', () => {
      if (role === 'host') {
        connections.delete(conn.peer);
        players.delete(conn.peer);
        syncLobby();
      }
    });
  }

  async function doHost(name, mode) {
    destroyPeer();
    myName = name || 'Host';
    eventMode = mode || 'hunt';
    eventCode = genCode();
    role = 'host';
    players.clear();
    try {
      const { peer: p, id } = await hostPeer(eventCode);
      peer = p;
      myId = id;
      eventState = 'lobby';
      peer.on('connection', (conn) => {
        connections.set(conn.peer, conn);
        wireConnection(conn);
      });
      setPlayer(id, myName, 0);
      render();
    } catch (e) {
      destroyPeer();
      eventState = 'idle';
      buildEventHub();
      showError(e.message || 'Failed to host event.');
    }
  }

  async function doJoin(name, code) {
    destroyPeer();
    myName = name || 'Guest';
    eventCode = (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (eventCode.length < 4) {
      showError('Enter the event code from your host.');
      return;
    }
    role = 'guest';
    players.clear();
    try {
      const { peer: p, id, conn } = await guestPeer(eventCode);
      peer = p;
      myId = id;
      hostConn = conn;
      setPlayer(id, myName, 0);
      wireConnection(conn);
      send(conn, { t: 'join', name: myName });
      eventState = 'lobby';
      render();
    } catch (e) {
      destroyPeer();
      eventState = 'idle';
      buildEventHub();
      showError(e.message || 'Failed to join event.');
    }
  }

  function showError(msg) {
    const el = document.getElementById('event-error');
    if (el) {
      el.textContent = msg;
      el.hidden = false;
    }
  }

  function appendChat(name, text) {
    const log = document.getElementById('event-chat-log');
    if (!log) return;
    const line = document.createElement('div');
    line.className = 'event-chat-line';
    line.innerHTML = `<b>${esc(name)}</b> ${esc(text)}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function sendChat() {
    const input = document.getElementById('event-chat-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim().slice(0, 200);
    input.value = '';
    if (role === 'host') {
      appendChat(myName, text);
      broadcast({ t: 'chat', name: myName, text });
    } else if (hostConn) {
      send(hostConn, { t: 'chat', text });
    }
  }

  function renderLanding() {
    return `
      <div class="event-landing">
        <div class="event-tabs">
          <button type="button" class="event-tab on" data-event-tab="host">Host event</button>
          <button type="button" class="event-tab" data-event-tab="join">Join with code</button>
        </div>
        <div class="event-panel on" id="event-panel-host">
          <label class="event-label">Your name</label>
          <input class="event-input" id="event-host-name" placeholder="e.g. Graham" maxlength="24" autocomplete="nickname">
          <label class="event-label">Event type</label>
          <select class="event-input" id="event-host-mode">
            <option value="hunt">Gem Hunt Race — first to find each catalog gem wins points</option>
            <option value="quiz">Quiz Battle — answer geology questions together</option>
          </select>
          <button type="button" class="btn event-cta" id="event-host-btn">Create event &amp; get code →</button>
        </div>
        <div class="event-panel" id="event-panel-join">
          <label class="event-label">Your name</label>
          <input class="event-input" id="event-join-name" placeholder="e.g. Alex" maxlength="24" autocomplete="nickname">
          <label class="event-label">Event code from host</label>
          <input class="event-input event-code-input" id="event-join-code" placeholder="e.g. RUBY42" maxlength="6" autocomplete="off" style="text-transform:uppercase;letter-spacing:.2em;font-family:var(--mono)">
          <button type="button" class="btn event-cta" id="event-join-btn">Join event →</button>
        </div>
        <p class="event-note">Live events use peer-to-peer connections — no account needed. The host shares a 6-letter code; everyone joins from Games → Live Event. Works best when host and guests are online at the same time.</p>
      </div>`;
  }

  function renderLobby() {
    const list = scoreList();
    return `
      <div class="event-lobby">
        ${role === 'host' ? `<div class="event-code-box"><div class="event-code-label">Share this code</div><div class="event-code" id="event-code-display">${eventCode}</div><button type="button" class="btn ghost event-copy" id="event-copy-code">Copy code</button></div>` : `<div class="event-code-box guest"><div class="event-code-label">Joined event</div><div class="event-code">${eventCode}</div></div>`}
        <div class="event-mode-tag">${eventMode === 'hunt' ? '🔍 Gem Hunt Race' : '❓ Quiz Battle'}</div>
        <h2 class="event-lobby-title">${role === 'host' ? 'Waiting for players…' : 'In the lobby'}</h2>
        <ul class="event-players">${list.map((p) => `<li><span>${esc(p.name)}${role === 'host' && p.id === myId ? ' ★ host' : ''}</span><span>${p.score} pts</span></li>`).join('') || '<li><span>No players yet</span></li>'}</ul>
        ${role === 'host' ? `<button type="button" class="btn event-cta" id="event-start-btn">Start event (${eventMode === 'hunt' ? 5 : 5} rounds)</button>` : '<p class="event-wait">Waiting for the host to start…</p>'}
        <button type="button" class="btn ghost" id="event-leave-btn">Leave event</button>
      </div>
      <div class="event-chat">
        <div class="event-chat-log" id="event-chat-log"></div>
        <div class="event-chat-row"><input class="event-input" id="event-chat-input" placeholder="Say hi…" maxlength="200"><button type="button" class="btn ghost" id="event-chat-send">Send</button></div>
      </div>`;
  }

  function renderPlaying() {
    const cur = rounds[round];
    const isHunt = eventMode === 'hunt';
    let main = '';
    if (isHunt && cur) {
      main = `
        <div class="event-round">Round ${round + 1} / ${rounds.length}</div>
        <div class="event-clue">${esc(cur.clue)}</div>
        <p class="event-hunt-hint">Open the matching gem in the Lithos catalog — first to find it gets 10 points!</p>
        <button type="button" class="btn" id="event-open-catalog">Open catalog to search →</button>
        ${roundWinner ? `<div class="event-winner">✅ ${esc(players.get(roundWinner)?.name || 'Someone')} found ${esc(cur.gem)}!</div>` : ''}`;
    } else if (!isHunt && cur) {
      const answered = roundAnswers.has(myId);
      main = `
        <div class="event-round">Question ${round + 1} / ${rounds.length}</div>
        <div class="event-clue">${esc(cur.q)}</div>
        <div class="event-quiz-opts" id="event-quiz-opts">
          ${cur.opts.map((o, i) => `<button type="button" class="event-quiz-opt${answered ? ' disabled' : ''}" data-i="${i}" ${answered ? 'disabled' : ''}>${esc(o)}</button>`).join('')}
        </div>`;
    }
    return `
      <div class="event-play">
        ${main}
        <div class="event-scoreboard">
          <div class="event-score-title">Scores</div>
          ${scoreList().map((p) => `<div class="event-score-row"><span>${esc(p.name)}</span><span>${p.score}</span></div>`).join('')}
        </div>
        ${role === 'host' && isHunt ? `<button type="button" class="btn ghost" id="event-skip-round">Skip round →</button>` : ''}
        <button type="button" class="btn ghost" id="event-leave-btn">Leave event</button>
      </div>`;
  }

  function renderEnded() {
    const top = scoreList()[0];
    return `
      <div class="event-ended">
        <h2>🏆 Event over!</h2>
        ${top ? `<p class="event-winner-big">${esc(top.name)} wins with ${top.score} points</p>` : ''}
        <ul class="event-players">${scoreList().map((p, i) => `<li><span>${i + 1}. ${esc(p.name)}</span><span>${p.score} pts</span></li>`).join('')}</ul>
        <button type="button" class="btn" id="event-new-btn">Host or join another event</button>
      </div>`;
  }

  function bindUI() {
    const wrap = document.getElementById('event-wrap');
    if (!wrap) return;

    wrap.querySelectorAll('[data-event-tab]').forEach((btn) => {
      btn.onclick = () => {
        wrap.querySelectorAll('.event-tab').forEach((b) => b.classList.remove('on'));
        wrap.querySelectorAll('.event-panel').forEach((p) => p.classList.remove('on'));
        btn.classList.add('on');
        const panel = document.getElementById('event-panel-' + btn.dataset.eventTab);
        if (panel) panel.classList.add('on');
      };
    });

    const hostBtn = document.getElementById('event-host-btn');
    if (hostBtn) {
      hostBtn.onclick = () => {
        document.getElementById('event-error').hidden = true;
        doHost(document.getElementById('event-host-name')?.value.trim(), document.getElementById('event-host-mode')?.value);
      };
    }

    const joinBtn = document.getElementById('event-join-btn');
    if (joinBtn) {
      joinBtn.onclick = () => {
        document.getElementById('event-error').hidden = true;
        doJoin(document.getElementById('event-join-name')?.value.trim(), document.getElementById('event-join-code')?.value.trim());
      };
    }

    const startBtn = document.getElementById('event-start-btn');
    if (startBtn) startBtn.onclick = () => startEvent();

    const copyBtn = document.getElementById('event-copy-code');
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard?.writeText(eventCode);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy code'), 1500);
      };
    }

    const leaveBtn = document.getElementById('event-leave-btn');
    if (leaveBtn) leaveBtn.onclick = () => {
      destroyPeer();
      buildEventHub();
    };

    const newBtn = document.getElementById('event-new-btn');
    if (newBtn) newBtn.onclick = () => {
      destroyPeer();
      buildEventHub();
    };

    const catalogBtn = document.getElementById('event-open-catalog');
    if (catalogBtn) {
      catalogBtn.onclick = () => {
        if (typeof switchView === 'function') switchView('catalog');
      };
    }

    const skipBtn = document.getElementById('event-skip-round');
    if (skipBtn) skipBtn.onclick = () => nextRound();

    document.getElementById('event-chat-send')?.addEventListener('click', sendChat);
    document.getElementById('event-chat-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChat();
    });

    wrap.querySelectorAll('.event-quiz-opt').forEach((btn) => {
      btn.onclick = () => {
        if (roundAnswers.has(myId)) return;
        const choice = parseInt(btn.dataset.i, 10);
        roundAnswers.set(myId, choice);
        if (role === 'host') handleMessage(myId, { t: 'answer', choice, round });
        else send(hostConn, { t: 'answer', choice, round });
        btn.parentElement.querySelectorAll('.event-quiz-opt').forEach((b) => (b.disabled = true));
      };
    });
  }

  function render() {
    const wrap = document.getElementById('event-wrap');
    if (!wrap) return;
    let body = `<div class="event-error" id="event-error" hidden></div>`;
    if (eventState === 'idle') body += renderLanding();
    else if (eventState === 'lobby') body += renderLobby();
    else if (eventState === 'playing') body += renderPlaying();
    else if (eventState === 'ended') body += renderEnded();
    wrap.innerHTML = `<div class="eyebrow">Multiplayer</div><h1>Live <em>Event</em></h1><p class="lede">Host a gem hunt or quiz night — share your code and play together in real time.</p>${body}`;
    bindUI();
  }

  window.buildEventHub = function buildEventHub() {
    if (eventState === 'idle') render();
    else render();
  };

  window.lithosEventLeave = function () {
    destroyPeer();
  };

  /** Called when a player opens a gem in the catalog during a live hunt. */
  window.lithosEventGemOpened = function (gemName) {
    if (eventState !== 'playing' || eventMode !== 'hunt') return;
    if (role === 'host') {
      handleMessage(myId, { t: 'found', gem: gemName, round });
    } else if (hostConn) {
      send(hostConn, { t: 'found', gem: gemName, round });
    }
  };

  window.lithosEventJoinByCode = function (code) {
    buildEventHub();
    setTimeout(() => {
      const input = document.getElementById('event-join-code');
      if (input) input.value = code;
      document.querySelector('[data-event-tab="join"]')?.click();
    }, 50);
  };
})();
