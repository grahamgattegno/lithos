// ===== NIGHT SHIFT 2: THE MINE BELOW — Deep Crew =====
let ns2Game=null, ns2Loop=null;

function ns2BotId(name){
  const n=String(name||'').toLowerCase();
  if(n.includes('magna')||n.includes('magnet'))return 'magna';
  if(n.includes('prism')||n.includes('opal')||n.includes('mimic'))return 'prism';
  if(n.includes('glaci')||n.includes('ice')||n.includes('frost'))return 'glaci';
  if(n.includes('swarm')||n.includes('pyrite')||n.includes('shard'))return 'swarm';
  if(n.includes('null')||n.includes('glitch'))return 'null';
  return n;
}
function ns2BotAnimMode(botId){
  try{
    if(typeof ns2Game==='undefined'||!ns2Game)return 'calm';
    if(ns2Game.blackout||ns2Game.power<=0)return 'intense';
    const bot=ns2Game.bots&&ns2Game.bots.find(b=>(b.id||ns2BotId(b.name))===botId);
    if(bot&&bot.pos>=3)return 'intense';
    if(bot&&bot.id==='swarm'&&(bot.swarmL>=2||bot.swarmR>=2))return 'intense';
    if((ns2Game.anger||0)>=4)return 'intense';
  }catch(_){}
  return 'calm';
}

function ns2BotSVG(name, size){
  size = size || 60;
  const uid='n2'+Math.random().toString(36).slice(2,7);
  const id=ns2BotId(name);
  const mode=ns2BotAnimMode(id);
  const svg=(vw,vh,body)=>{
    const h=Math.round(size*(vh/vw));
    return `<svg class="ns-bot-svg" viewBox="0 0 ${vw} ${vh}" width="${size}" height="${h}" xmlns="http://www.w3.org/2000/svg" aria-label="${String(name).replace(/"/g,'')}" style="overflow:visible">${body}</svg>`;
  };
  if(id==='magna'){
    const body=mode==='intense'?`<defs>
            <linearGradient id="${uid}m" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#8a90a8"/><stop offset="45%" stop-color="#4a4a5a"/><stop offset="100%" stop-color="#1e1e28"/></linearGradient>
          </defs>
          <ellipse cx="68" cy="144" rx="32" ry="5" fill="#000" opacity=".4"/>
          <!-- the DOOR he's ripping open! -->
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0 132 140;-7 132 140;0 132 140" dur=".5s" repeatCount="indefinite"/>
            <animateTransform attributeName="transform" type="translate" values="0,0;-8,0;0,0" dur=".5s" additive="sum" repeatCount="indefinite"/>
            <rect x="120" y="60" width="22" height="82" rx="3" fill="#2a2436" stroke="#4a4058" stroke-width="2"/>
            <circle cx="126" cy="102" r="2.4" fill="#8a80a0"/>
          </g>
          <!-- sparks at the door hinge -->
          <polygon points="118,64 120,69 125,71 120,73 118,78 116,73 111,71 116,69" fill="#fff2c0"><animate attributeName="opacity" values="0;1;0" dur=".4s" repeatCount="indefinite"/></polygon>
          <polygon points="116,132 118,136 122,138 118,140 116,144 114,140 110,138 114,136" fill="#fff2c0"><animate attributeName="opacity" values="0;1;0" dur=".45s" begin=".2s" repeatCount="indefinite"/></polygon>
          <!-- magnetic force arcs pulling the door -->
          <g fill="none" stroke="#8ab0ff" stroke-width="2.4" stroke-linecap="round">
            <path d="M96,74 Q112,78 120,84"><animate attributeName="opacity" values="0;1;0" dur=".5s" repeatCount="indefinite"/></path>
            <path d="M98,92 Q112,96 120,100"><animate attributeName="opacity" values="0;1;0" dur=".5s" begin=".16s" repeatCount="indefinite"/></path>
            <path d="M96,110 Q112,112 120,116"><animate attributeName="opacity" values="0;1;0" dur=".5s" begin=".32s" repeatCount="indefinite"/></path>
          </g>
          <!-- DOOR-RIP: leaning in, blazing, shaking with force -->
          <g transform="rotate(6 68 100)">
            <animateTransform attributeName="transform" type="translate" values="0,0;1.6,0;-1.6,0;0,0" dur=".16s" additive="sum" repeatCount="indefinite"/>
            <path d="M58,118 L54,130 L58,141" fill="none" stroke="#2a2a36" stroke-width="9" stroke-linecap="round"/>
            <path d="M80,118 L84,130 L82,141" fill="none" stroke="#2a2a36" stroke-width="9" stroke-linecap="round"/>
            <polygon points="69,70 92,86 86,120 52,120 46,86" fill="url(#${uid}m)" stroke="#9aa0b8" stroke-width="2"/>
            <!-- both arms REACHING at the door -->
            <path d="M90,88 L106,90 L114,86" fill="none" stroke="#2a2a36" stroke-width="8" stroke-linecap="round"/>
            <path d="M88,104 L106,106 L114,110" fill="none" stroke="#2a2a36" stroke-width="8" stroke-linecap="round"/>
            <path d="M46,20 L46,48 Q46,68 69,68 Q92,68 92,48 L92,20 L80,20 L80,46 Q80,56 69,56 Q58,56 58,46 L58,20 Z" fill="url(#${uid}m)" stroke="#9aa0b8" stroke-width="2"/>
            <rect x="43" y="12" width="18" height="11" rx="2" fill="#ff3a4a"><animate attributeName="opacity" values="1;.35;1" dur=".22s" repeatCount="indefinite"/></rect>
            <rect x="77" y="12" width="18" height="11" rx="2" fill="#3a7aff"><animate attributeName="opacity" values=".35;1;.35" dur=".22s" repeatCount="indefinite"/></rect>
            <rect x="60" y="58" width="7" height="5" rx="1" fill="#fff"><animate attributeName="opacity" values="1;.3;1" dur=".3s" repeatCount="indefinite"/></rect>
            <rect x="71" y="58" width="7" height="5" rx="1" fill="#fff"><animate attributeName="opacity" values="1;.3;1" dur=".3s" repeatCount="indefinite"/></rect>
            <circle cx="69" cy="98" r="7" fill="#14141c"/>
            <circle cx="69" cy="98" r="4.4" fill="#8ab0ff"><animate attributeName="r" values="4.4;6.2;4.4" dur=".3s" repeatCount="indefinite"/></circle>
          </g>`:`<defs>
            <linearGradient id="${uid}m" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#8a90a8"/><stop offset="45%" stop-color="#4a4a5a"/><stop offset="100%" stop-color="#1e1e28"/></linearGradient>
          </defs>
          <ellipse cx="75" cy="144" rx="30" ry="5" fill="#000" opacity=".35"/>
          <!-- MAGNETIC PATROL: heavy march, junk metal orbiting him -->
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-2 75 140;2 75 140;-2 75 140" dur="2.2s" repeatCount="indefinite"/>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="1.1s" repeatCount="indefinite"/>
              <!-- iron legs -->
              <path d="M64,118 L62,130 L64,141" fill="none" stroke="#2a2a36" stroke-width="9" stroke-linecap="round"/>
              <path d="M86,118 L88,130 L86,141" fill="none" stroke="#2a2a36" stroke-width="9" stroke-linecap="round"/>
              <circle cx="62" cy="130" r="3" fill="#14141c"/><circle cx="88" cy="130" r="3" fill="#14141c"/>
              <!-- iron crystal torso -->
              <polygon points="75,70 98,86 92,120 58,120 52,86" fill="url(#${uid}m)" stroke="#9aa0b8" stroke-width="2"/>
              <polygon points="75,70 98,86 75,94" fill="#fff" opacity=".14"/>
              <!-- chunky arms -->
              <path d="M54,88 L40,102 L44,114" fill="none" stroke="#2a2a36" stroke-width="8" stroke-linecap="round"/>
              <path d="M96,88 L110,102 L106,114" fill="none" stroke="#2a2a36" stroke-width="8" stroke-linecap="round"/>
              <!-- HORSESHOE-MAGNET head! red + blue poles -->
              <path d="M52,20 L52,48 Q52,68 75,68 Q98,68 98,48 L98,20 L86,20 L86,46 Q86,56 75,56 Q64,56 64,46 L64,20 Z" fill="url(#${uid}m)" stroke="#9aa0b8" stroke-width="2"/>
              <rect x="49" y="12" width="18" height="11" rx="2" fill="#e84a5a"><animate attributeName="opacity" values="1;.55;1" dur="1.1s" repeatCount="indefinite"/></rect>
              <rect x="83" y="12" width="18" height="11" rx="2" fill="#4a7ae8"><animate attributeName="opacity" values=".55;1;.55" dur="1.1s" repeatCount="indefinite"/></rect>
              <!-- face on the magnet base -->
              <rect x="66" y="58" width="7" height="5" rx="1" fill="#aef"><animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite"/></rect>
              <rect x="77" y="58" width="7" height="5" rx="1" fill="#aef"><animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite"/></rect>
              <!-- chest core -->
              <circle cx="75" cy="98" r="7" fill="#14141c"/>
              <circle cx="75" cy="98" r="4.4" fill="#7a8ae8"><animate attributeName="r" values="4.4;5.6;4.4" dur="1.1s" repeatCount="indefinite"/></circle>
            </g>
          </g>
          <!-- scrap metal ORBITS him -->
          <g><animateTransform attributeName="transform" type="rotate" values="0 75 80;360 75 80" dur="5s" repeatCount="indefinite"/>
            <polygon points="75,26 80,32 72,34" fill="#8a90a8"/></g>
          <g><animateTransform attributeName="transform" type="rotate" values="120 75 80;480 75 80" dur="6.5s" repeatCount="indefinite"/>
            <circle cx="75" cy="30" r="4" fill="none" stroke="#8a90a8" stroke-width="2.4"/></g>
          <g><animateTransform attributeName="transform" type="rotate" values="240 75 80;600 75 80" dur="4.2s" repeatCount="indefinite"/>
            <rect x="72" y="27" width="7" height="5" fill="#6a7088"/></g>`;
    return svg(150,150,body);
  }
  if(id==='prism'){
    const body=mode==='intense'?`<defs>
            <radialGradient id="${uid}p" cx="45%" cy="30%" r="75%"><stop offset="0%" stop-color="#4a2e58"/><stop offset="55%" stop-color="#2a1638"/><stop offset="100%" stop-color="#0e0616"/></radialGradient>
          </defs>
          <ellipse cx="75" cy="142" rx="40" ry="5" fill="#000" opacity=".45"/>
          <!-- shattered crate planks on the floor... it was never a crate -->
          <g fill="#4a3018" stroke="#241606" stroke-width="1.5">
            <rect x="18" y="130" width="24" height="7" rx="2" transform="rotate(-10 30 133)"/>
            <rect x="108" y="132" width="22" height="7" rx="2" transform="rotate(14 119 135)"/>
          </g>
          <!-- THE TRUE FORM: a looming, dripping, many-eyed thing -->
          <g>
            <animateTransform attributeName="transform" type="rotate" calcMode="discrete" values="0 75 100;0 75 100;-2.5 75 100;0 75 100;2 75 100;0 75 100" keyTimes="0;.55;.6;.65;.8;1" dur="2.6s" repeatCount="indefinite"/>
            <g>
              <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="3.4s" repeatCount="indefinite"/>
              <!-- long spindly arms with talon-drip fingers -->
              <g>
                <animateTransform attributeName="transform" type="rotate" calcMode="discrete" values="0 46 96;0 46 96;4 46 96;0 46 96" keyTimes="0;.5;.56;1" dur="2.1s" repeatCount="indefinite"/>
                <path d="M46,96 Q26,104 20,124" fill="none" stroke="#1c0e28" stroke-width="7" stroke-linecap="round"/>
                <path d="M20,124 L12,132 M20,124 L18,136 M20,124 L26,134" stroke="#1c0e28" stroke-width="3" stroke-linecap="round" fill="none"/>
              </g>
              <g>
                <animateTransform attributeName="transform" type="rotate" calcMode="discrete" values="0 108 80;0 108 80;-5 108 80;0 108 80" keyTimes="0;.4;.47;1" dur="2.4s" repeatCount="indefinite"/>
                <path d="M108,80 Q128,70 132,52" fill="none" stroke="#1c0e28" stroke-width="7" stroke-linecap="round"/>
                <path d="M132,52 L126,42 M132,52 L134,40 M132,52 L140,44" stroke="#1c0e28" stroke-width="3" stroke-linecap="round" fill="none"/>
              </g>
              <!-- hunched towering body -->
              <path d="M46,138 Q34,120 40,96 Q34,66 56,46 Q66,30 82,32 Q104,34 110,58 Q120,80 112,104 Q118,124 104,138 Q75,146 46,138 Z" fill="url(#${uid}p)" stroke="#8a6aa8" stroke-width="1.6"/>
              <path d="M56,46 Q66,30 82,32" fill="none" stroke="#d8c8ff" stroke-width="1.4" opacity=".5"/>
              <!-- goo dripping off its bottom edge -->
              <path d="M58,138 q-2,7 0,10 q3,-3 2,-10 Z" fill="#2a1638"/>
              <path d="M90,140 q-2,6 0,9 q3,-3 2,-9 Z" fill="#2a1638"/>
              <circle cx="59" cy="148" r="1.6" fill="#4a2e58"><animateTransform attributeName="transform" type="translate" values="0,0;0,8" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="1.6s" repeatCount="indefinite"/></circle>
              <!-- a plank from the crate STILL STUCK in its shoulder -->
              <g transform="rotate(-18 98 46)">
                <rect x="86" y="40" width="26" height="9" rx="1.5" fill="#5a3c20" stroke="#241606" stroke-width="1.5"/>
                <text x="99" y="47" text-anchor="middle" font-size="6" fill="#241606" font-family="monospace" font-weight="bold">GE</text>
              </g>
              <!-- dim, sickly opal shimmer under its skin -->
              <circle cx="56" cy="108" r="6" fill="#4ae8b8" opacity=".28"><animate attributeName="fill" values="#4ae8b8;#6a5aff;#a8e84a;#4ae8b8" dur="4s" repeatCount="indefinite"/></circle>
              <circle cx="98" cy="120" r="5" fill="#6a5aff" opacity=".25"><animate attributeName="fill" values="#6a5aff;#a8e84a;#4ae8b8;#6a5aff" dur="3.4s" repeatCount="indefinite"/></circle>
              <circle cx="88" cy="72" r="4" fill="#a8e84a" opacity=".25"><animate attributeName="fill" values="#a8e84a;#4ae8b8;#6a5aff;#a8e84a" dur="4.4s" repeatCount="indefinite"/></circle>
              <!-- THE MAIN EYE — huge, sickly, vertical slit pupil, veins -->
              <ellipse cx="66" cy="62" rx="13" ry="11" fill="#e8f0c8"/>
              <path d="M56,56 l5,3 M76,54 l-5,4 M58,68 l5,-2" stroke="#c05a5a" stroke-width="1" opacity=".8"/>
              <circle cx="66" cy="62" r="6.4" fill="#a8e84a"/>
              <ellipse cx="66" cy="62" rx="1.7" ry="5.4" fill="#0a0410">
                <animate attributeName="cx" calcMode="discrete" values="66;70;66;62;66" keyTimes="0;.3;.5;.75;1" dur="2.8s" repeatCount="indefinite"/>
              </ellipse>
              <path d="M53,56 Q66,48 79,56 L79,52 Q66,44 53,52 Z" fill="#1c0e28"/>
              <!-- MORE EYES keep opening where eyes should NOT be... -->
              <g>
                <ellipse cx="96" cy="54" rx="5" ry="4" fill="#e8f0c8"><animate attributeName="ry" values="0;0;4;4" keyTimes="0;.3;.36;1" dur="4s" repeatCount="indefinite"/></ellipse>
                <ellipse cx="96" cy="54" rx="1.1" ry="3" fill="#0a0410"><animate attributeName="ry" values="0;0;3;3" keyTimes="0;.3;.36;1" dur="4s" repeatCount="indefinite"/></ellipse>
              </g>
              <g>
                <ellipse cx="98" cy="92" rx="4.4" ry="3.6" fill="#e8f0c8"><animate attributeName="ry" values="0;0;3.6;3.6" keyTimes="0;.55;.61;1" dur="4s" repeatCount="indefinite"/></ellipse>
                <ellipse cx="98" cy="92" rx="1" ry="2.6" fill="#0a0410"><animate attributeName="ry" values="0;0;2.6;2.6" keyTimes="0;.55;.61;1" dur="4s" repeatCount="indefinite"/></ellipse>
              </g>
              <g>
                <ellipse cx="52" cy="84" rx="3.6" ry="3" fill="#e8f0c8"><animate attributeName="ry" values="0;0;3;3" keyTimes="0;.75;.8;1" dur="4s" repeatCount="indefinite"/></ellipse>
                <ellipse cx="52" cy="84" rx=".9" ry="2.2" fill="#0a0410"><animate attributeName="ry" values="0;0;2.2;2.2" keyTimes="0;.75;.8;1" dur="4s" repeatCount="indefinite"/></ellipse>
              </g>
              <!-- THE MAW — a huge unhinging jaw full of needle teeth -->
              <path d="M50,102 Q75,94 102,102 L104,118 Q75,134 48,118 Z" fill="#160410"/>
              <g fill="#e8e8f0">
                <polygon points="54,103 57,112 60,103"/>
                <polygon points="63,101 66,112 69,101"/>
                <polygon points="73,100 76,113 79,100"/>
                <polygon points="83,101 86,112 89,101"/>
                <polygon points="93,102 96,111 99,102"/>
              </g>
              <g>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,5;0,0" dur="2.6s" repeatCount="indefinite"/>
                <path d="M48,118 Q75,134 104,118 L102,124 Q75,140 50,124 Z" fill="#160410"/>
                <g fill="#e8e8f0">
                  <polygon points="58,121 61,113 64,122"/>
                  <polygon points="70,124 73,115 76,124"/>
                  <polygon points="82,124 85,115 88,123"/>
                  <polygon points="92,120 95,113 98,120"/>
                </g>
                <line x1="75" y1="106" x2="75" y2="126" stroke="#8a6aa8" stroke-width="1.2" opacity=".5"/>
              </g>
            </g>
          </g>`:`<ellipse cx="75" cy="140" rx="36" ry="5" fill="#000" opacity=".35"/>
          <!-- DISGUISED as an innocent crate... but the crate is BREATHING -->
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-1.4;0,0" dur="3s" repeatCount="indefinite"/>
            <rect x="45" y="72" width="60" height="58" rx="3" fill="#6a4a2a" stroke="#3a2814" stroke-width="2.5"/>
            <rect x="45" y="72" width="60" height="12" fill="#7a5834"/>
            <line x1="45" y1="101" x2="105" y2="101" stroke="#3a2814" stroke-width="2"/>
            <line x1="75" y1="72" x2="75" y2="130" stroke="#3a2814" stroke-width="2"/>
            <text x="75" y="122" text-anchor="middle" font-size="9" fill="#3a2814" font-family="monospace" font-weight="bold">GEMS</text>
            <!-- claw scratches... from the INSIDE -->
            <g stroke="#241606" stroke-width="1.4" stroke-linecap="round">
              <line x1="52" y1="80" x2="58" y2="94"/>
              <line x1="56" y1="79" x2="62" y2="93"/>
              <line x1="60" y1="80" x2="66" y2="94"/>
            </g>
          </g>
          <!-- a shimmer sweeps across it... suspicious -->
          <rect x="30" y="60" width="10" height="84" fill="#b08ae0" opacity=".1" transform="skewX(-18)">
            <animate attributeName="x" values="30;116" dur="3.4s" repeatCount="indefinite"/>
          </rect>
          <!-- dark goo dripping from a corner... VERY suspicious -->
          <circle cx="49" cy="132" r="2.6" fill="#8a6aa8"><animate attributeName="cy" values="130;140" dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="2.6s" repeatCount="indefinite"/><animate attributeName="fill" values="#8a6aa8;#4ae8b8;#a8e84a;#8a6aa8" dur="5s" repeatCount="indefinite"/></circle>
          <!-- AND THEN THE CRATE BLINKS. 👁️ -->
          <ellipse cx="90" cy="90" rx="8" ry="6" fill="#e8f0c8"><animate attributeName="ry" values="0;0;6;6;0;0" keyTimes="0;.6;.66;.86;.92;1" dur="5s" repeatCount="indefinite"/></ellipse>
          <circle cx="90" cy="90" r="3.4" fill="#a8e84a"><animate attributeName="r" values="0;0;3.4;3.4;0;0" keyTimes="0;.6;.66;.86;.92;1" dur="5s" repeatCount="indefinite"/></circle>
          <ellipse cx="90" cy="90" rx="1" ry="2.6" fill="#0a0410"><animate attributeName="ry" values="0;0;2.6;2.6;0;0" keyTimes="0;.6;.66;.86;.92;1" dur="5s" repeatCount="indefinite"/></ellipse>`;
    return svg(150,150,body);
  }
  if(id==='glaci'){
    const body=mode==='intense'?`<defs>
            <linearGradient id="${uid}g" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="#e8f8ff"/><stop offset="45%" stop-color="#7ad0f0"/><stop offset="100%" stop-color="#1e5a7a"/></linearGradient>
            <linearGradient id="${uid}gC" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e8f8ff" stop-opacity=".9"/><stop offset="100%" stop-color="#7ad0f0" stop-opacity="0"/></linearGradient>
          </defs>
          <ellipse cx="62" cy="143" rx="40" ry="5" fill="#000" opacity=".4"/>
          <!-- FROST-BREATH blast cone -->
          <polygon points="96,66 148,44 148,96" fill="url(#${uid}gC)">
            <animate attributeName="opacity" values=".5;1;.5" dur=".5s" repeatCount="indefinite"/>
          </polygon>
          <!-- flying snowflakes -->
          <g fill="#fff">
            <circle cx="104" cy="62" r="2"><animateTransform attributeName="transform" type="translate" values="0,0;40,-8" dur=".7s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur=".7s" repeatCount="indefinite"/></circle>
            <circle cx="102" cy="72" r="2.4"><animateTransform attributeName="transform" type="translate" values="0,0;44,2" dur=".6s" begin=".2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur=".6s" begin=".2s" repeatCount="indefinite"/></circle>
            <circle cx="104" cy="80" r="1.8"><animateTransform attributeName="transform" type="translate" values="0,0;40,10" dur=".65s" begin=".4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur=".65s" begin=".4s" repeatCount="indefinite"/></circle>
          </g>
          <!-- ICE forming where the breath lands! -->
          <g stroke="#e8f8ff" stroke-width="1">
            <polygon points="140,96 144,78 148,96" fill="url(#${uid}g)"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.3;.8;1" dur="1.4s" repeatCount="indefinite"/></polygon>
            <polygon points="130,100 133,86 138,100" fill="url(#${uid}g)"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.4;.8;1" dur="1.4s" begin=".3s" repeatCount="indefinite"/></polygon>
          </g>
          <!-- braced body blasting -->
          <g transform="rotate(-4 62 100)">
            <animateTransform attributeName="transform" type="translate" values="0,0;-1.6,0;0,0" dur=".2s" additive="sum" repeatCount="indefinite"/>
            <g stroke-linecap="round" stroke-linejoin="round">
              <path d="M36,98 L28,118 L36,126 L34,140" fill="none" stroke="#12384e" stroke-width="8"/>
              <path d="M50,100 L46,120 L52,128 L50,141" fill="none" stroke="#12384e" stroke-width="8"/>
              <path d="M82,102 L80,122 L86,130 L84,142" fill="none" stroke="#12384e" stroke-width="8"/>
              <path d="M94,100 L96,120 L102,128 L100,140" fill="none" stroke="#12384e" stroke-width="8"/>
            </g>
            <path d="M28,96 Q24,72 50,66 Q76,60 94,68 Q108,74 104,88 Q98,104 72,108 Q44,112 28,96 Z" fill="url(#${uid}g)" stroke="#e8f8ff" stroke-width="2"/>
            <g stroke="#e8f8ff" stroke-width="1">
              <polygon points="48,68 52,46 60,66" fill="url(#${uid}g)"><animate attributeName="opacity" values="1;.5;1" dur=".4s" repeatCount="indefinite"/></polygon>
              <polygon points="64,64 70,40 78,62" fill="url(#${uid}g)"><animate attributeName="opacity" values=".5;1;.5" dur=".4s" repeatCount="indefinite"/></polygon>
              <polygon points="82,64 90,48 92,66" fill="url(#${uid}g)"><animate attributeName="opacity" values="1;.5;1" dur=".45s" repeatCount="indefinite"/></polygon>
            </g>
            <!-- head thrown forward, jaws WIDE -->
            <path d="M94,66 Q116,56 126,66 Q126,74 112,78 Q100,78 94,66 Z" fill="url(#${uid}g)" stroke="#e8f8ff" stroke-width="2"/>
            <path d="M96,80 Q114,86 124,82 Q122,92 108,92 Q98,90 96,80 Z" fill="url(#${uid}g)" stroke="#e8f8ff" stroke-width="2">
              <animateTransform attributeName="transform" type="rotate" values="0 96 80;6 96 80;0 96 80" dur=".4s" repeatCount="indefinite"/>
            </path>
            <polygon points="112,66 115,73 119,65" fill="#fff"/>
            <polygon points="120,68 123,74 126,67" fill="#fff"/>
            <polygon points="110,86 113,80 117,87" fill="#fff"/>
            <ellipse cx="104" cy="64" rx="4" ry="3" fill="#0c2838"/>
            <ellipse cx="104" cy="64" rx="2.2" ry="1.8" fill="#e8f8ff"><animate attributeName="opacity" values="1;.3;1" dur=".25s" repeatCount="indefinite"/></ellipse>
            <!-- frost mist at the feet -->
            <ellipse cx="60" cy="138" rx="26" ry="5" fill="#cfeeff" opacity=".25"><animate attributeName="rx" values="22;30;22" dur="1s" repeatCount="indefinite"/></ellipse>
          </g>`:`<defs>
            <linearGradient id="${uid}g" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0%" stop-color="#e8f8ff"/><stop offset="45%" stop-color="#7ad0f0"/><stop offset="100%" stop-color="#1e5a7a"/></linearGradient>
            <linearGradient id="${uid}gD" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4a9ac0"/><stop offset="100%" stop-color="#12384e"/></linearGradient>
          </defs>
          <ellipse cx="75" cy="143" rx="42" ry="5" fill="#000" opacity=".35"/>
          <!-- PROWLING: 4-legged stalk, frosty breath -->
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur=".65s" repeatCount="indefinite"/>
            <!-- back legs -->
            <g stroke-linecap="round" stroke-linejoin="round">
              <g><animateTransform attributeName="transform" type="rotate" values="-14 46 98;14 46 98;-14 46 98" dur="1.3s" repeatCount="indefinite"/>
                <path d="M46,98 L40,116 L46,124 L44,138" fill="none" stroke="#12384e" stroke-width="8"/>
                <path d="M46,98 L40,116 L46,124 L44,138" fill="none" stroke="url(#${uid}gD)" stroke-width="5"/>
                <circle cx="40" cy="116" r="2.8" fill="#0c2838"/><circle cx="40" cy="116" r="1.2" fill="#7ad0f0"/>
                <polygon points="44,135 39,143 49,141" fill="#0c2838"/></g>
              <g><animateTransform attributeName="transform" type="rotate" values="12 58 100;-12 58 100;12 58 100" dur="1.3s" repeatCount="indefinite"/>
                <path d="M58,100 L54,118 L60,126 L58,139" fill="none" stroke="#12384e" stroke-width="8"/>
                <path d="M58,100 L54,118 L60,126 L58,139" fill="none" stroke="url(#${uid}gD)" stroke-width="5"/>
                <circle cx="54" cy="118" r="2.8" fill="#0c2838"/><circle cx="54" cy="118" r="1.2" fill="#7ad0f0"/>
                <polygon points="58,136 53,144 63,142" fill="#0c2838"/></g>
            </g>
            <!-- icy tail -->
            <g><animateTransform attributeName="transform" type="rotate" values="-8 38 84;8 38 84;-8 38 84" dur="1.3s" repeatCount="indefinite"/>
              <path d="M38,84 Q18,80 10,64" fill="none" stroke="url(#${uid}g)" stroke-width="7" stroke-linecap="round"/>
              <polygon points="12,66 4,56 16,58" fill="url(#${uid}g)" stroke="#e8f8ff" stroke-width="1"/></g>
            <!-- crystal body -->
            <path d="M36,96 Q32,72 58,66 Q84,60 104,68 Q118,74 114,88 Q108,104 82,108 Q52,112 36,96 Z" fill="url(#${uid}g)" stroke="#e8f8ff" stroke-width="2"/>
            <!-- jagged ice spikes on the back -->
            <g stroke="#e8f8ff" stroke-width="1">
              <polygon points="56,68 60,48 68,66" fill="url(#${uid}g)"/>
              <polygon points="72,64 78,42 86,62" fill="url(#${uid}g)"/>
              <polygon points="90,64 98,50 100,66" fill="url(#${uid}g)"/>
            </g>
            <!-- front legs -->
            <g stroke-linecap="round" stroke-linejoin="round">
              <g><animateTransform attributeName="transform" type="rotate" values="14 92 102;-14 92 102;14 92 102" dur="1.3s" repeatCount="indefinite"/>
                <path d="M92,102 L88,120 L94,128 L92,140" fill="none" stroke="#12384e" stroke-width="8"/>
                <path d="M92,102 L88,120 L94,128 L92,140" fill="none" stroke="url(#${uid}gD)" stroke-width="5"/>
                <circle cx="88" cy="120" r="2.8" fill="#0c2838"/><circle cx="88" cy="120" r="1.2" fill="#7ad0f0"/>
                <polygon points="92,137 87,145 97,143" fill="#0c2838"/></g>
              <g><animateTransform attributeName="transform" type="rotate" values="-12 104 100;12 104 100;-12 104 100" dur="1.3s" repeatCount="indefinite"/>
                <path d="M104,100 L102,118 L108,126 L106,139" fill="none" stroke="#12384e" stroke-width="8"/>
                <path d="M104,100 L102,118 L108,126 L106,139" fill="none" stroke="url(#${uid}gD)" stroke-width="5"/>
                <circle cx="102" cy="118" r="2.8" fill="#0c2838"/><circle cx="102" cy="118" r="1.2" fill="#7ad0f0"/>
                <polygon points="106,136 101,144 111,142" fill="#0c2838"/></g>
            </g>
            <!-- wolfish head + icicle fangs -->
            <path d="M104,68 Q126,60 134,72 Q132,86 116,88 Q104,84 104,68 Z" fill="url(#${uid}g)" stroke="#e8f8ff" stroke-width="2"/>
            <polygon points="108,62 112,50 118,62" fill="url(#${uid}g)" stroke="#e8f8ff" stroke-width="1"/>
            <path d="M116,84 L134,80" stroke="#12384e" stroke-width="2.4" stroke-linecap="round"/>
            <polygon points="118,84 121,90 124,83" fill="#fff"/>
            <polygon points="126,82 129,88 132,81" fill="#fff"/>
            <ellipse cx="118" cy="72" rx="4" ry="3" fill="#0c2838"/>
            <ellipse cx="118" cy="72" rx="2" ry="1.6" fill="#7ad0f0"><animate attributeName="opacity" values="1;.4;1" dur="1.2s" repeatCount="indefinite"/></ellipse>
            <!-- frosty breath puffs -->
            <circle cx="138" cy="78" r="3" fill="#cfeeff" opacity="0">
              <animateTransform attributeName="transform" type="translate" values="0,0;10,-3" dur="1.6s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values=".6;0" dur="1.6s" repeatCount="indefinite"/></circle>
            <circle cx="136" cy="82" r="2.2" fill="#cfeeff" opacity="0">
              <animateTransform attributeName="transform" type="translate" values="0,0;9,1" dur="1.9s" begin=".7s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values=".6;0" dur="1.9s" begin=".7s" repeatCount="indefinite"/></circle>
          </g>`;
    return svg(150,150,body);
  }
  if(id==='swarm'){
    const body=mode==='intense'?`<defs>
            <linearGradient id="${uid}s" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0%" stop-color="#ffe98a"/><stop offset="45%" stop-color="#d8b830"/><stop offset="100%" stop-color="#6a5408"/></linearGradient>
          </defs>
          <ellipse cx="75" cy="142" rx="44" ry="5" fill="#000" opacity=".4"/>
          <!-- speed lines -->
          <g stroke="#ffe06a" stroke-width="2.4" stroke-linecap="round">
            <line x1="2" y1="86" x2="26" y2="86"><animate attributeName="opacity" values="0;1;0" dur=".4s" repeatCount="indefinite"/></line>
            <line x1="6" y1="106" x2="28" y2="106"><animate attributeName="opacity" values="0;1;0" dur=".4s" begin=".14s" repeatCount="indefinite"/></line>
            <line x1="0" y1="124" x2="22" y2="124"><animate attributeName="opacity" values="0;1;0" dur=".4s" begin=".28s" repeatCount="indefinite"/></line>
          </g>
          <!-- gold sparks -->
          <polygon points="44,70 46,75 51,77 46,79 44,84 42,79 37,77 42,75" fill="#fff2b0"><animate attributeName="opacity" values="0;1;0" dur=".45s" repeatCount="indefinite"/></polygon>
          <polygon points="100,60 102,65 107,67 102,69 100,74 98,69 93,67 98,65" fill="#fff2b0"><animate attributeName="opacity" values="0;1;0" dur=".5s" begin=".22s" repeatCount="indefinite"/></polygon>
          <!-- SWARM RUSH! all charging right at once -->
          <!-- battering-ram big cube -->
          <g transform="rotate(6 96 112)">
            <animateTransform attributeName="transform" type="translate" values="0,0;3,-7;0,0" dur=".35s" additive="sum" repeatCount="indefinite"/>
            <polygon points="80,92 114,92 114,126 80,126" fill="url(#${uid}s)" stroke="#8a7010" stroke-width="2"/>
            <polygon points="80,92 88,84 122,84 114,92" fill="#ffe98a" stroke="#8a7010" stroke-width="1.5"/>
            <polygon points="114,92 122,84 122,118 114,126" fill="#a8880f" stroke="#8a7010" stroke-width="1.5"/>
            <rect x="88" y="102" width="6" height="6" fill="#3a2c02"/><rect x="101" y="102" width="6" height="6" fill="#3a2c02"/>
            <rect x="89.5" y="103.5" width="3" height="3" fill="#fff"><animate attributeName="opacity" values="1;.3;1" dur=".22s" repeatCount="indefinite"/></rect>
            <rect x="102.5" y="103.5" width="3" height="3" fill="#fff"><animate attributeName="opacity" values="1;.3;1" dur=".22s" repeatCount="indefinite"/></rect>
            <polyline points="88,118 93,114 98,118 103,114 108,118" fill="none" stroke="#3a2c02" stroke-width="2" stroke-linecap="round"/>
          </g>
          <!-- mid cube sprinting -->
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;4,-9;0,0" dur=".3s" begin=".1s" additive="sum" repeatCount="indefinite"/>
            <g transform="rotate(-8 56 116)">
              <polygon points="42,102 70,102 70,130 42,130" fill="url(#${uid}s)" stroke="#8a7010" stroke-width="2"/>
              <polygon points="42,102 49,95 77,95 70,102" fill="#ffe98a" stroke="#8a7010" stroke-width="1.4"/>
              <rect x="49" y="111" width="5" height="5" fill="#3a2c02"/><rect x="59" y="111" width="5" height="5" fill="#3a2c02"/>
            </g>
          </g>
          <!-- tiny one TUMBLING head over heels! -->
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;6,-12;0,0" dur=".5s" begin=".05s" additive="sum" repeatCount="indefinite"/>
            <g>
              <animateTransform attributeName="transform" type="rotate" values="0 27 116;360 27 116" dur=".9s" repeatCount="indefinite"/>
              <polygon points="18,107 36,107 36,125 18,125" fill="url(#${uid}s)" stroke="#8a7010" stroke-width="1.8"/>
              <rect x="22" y="113" width="4" height="4" fill="#3a2c02"/><rect x="29" y="113" width="4" height="4" fill="#3a2c02"/>
            </g>
          </g>
          <!-- dust behind the stampede -->
          <circle cx="34" cy="132" r="3.4" fill="#c9b06a" opacity=".5">
            <animateTransform attributeName="transform" type="translate" values="0,0;-14,-4" dur=".5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values=".55;0" dur=".5s" repeatCount="indefinite"/></circle>
          <circle cx="74" cy="134" r="3" fill="#c9b06a" opacity=".5">
            <animateTransform attributeName="transform" type="translate" values="0,0;-12,-3" dur=".45s" begin=".2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values=".55;0" dur=".45s" begin=".2s" repeatCount="indefinite"/></circle>`:`<defs>
            <linearGradient id="${uid}s" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0%" stop-color="#ffe98a"/><stop offset="45%" stop-color="#d8b830"/><stop offset="100%" stop-color="#6a5408"/></linearGradient>
          </defs>
          <ellipse cx="75" cy="142" rx="42" ry="5" fill="#000" opacity=".35"/>
          <!-- SCOUTING: a pack of little pyrite cubes hopping about -->
          <!-- big cube -->
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="1s" repeatCount="indefinite"/>
            <polygon points="46,96 78,96 78,128 46,128" fill="url(#${uid}s)" stroke="#8a7010" stroke-width="2"/>
            <polygon points="46,96 54,88 86,88 78,96" fill="#ffe98a" stroke="#8a7010" stroke-width="1.5"/>
            <polygon points="78,96 86,88 86,120 78,128" fill="#a8880f" stroke="#8a7010" stroke-width="1.5"/>
            <rect x="53" y="106" width="6" height="6" fill="#3a2c02"/><rect x="66" y="106" width="6" height="6" fill="#3a2c02"/>
            <rect x="54.5" y="107.5" width="3" height="3" fill="#ffe98a"><animate attributeName="opacity" values="1;.3;1" dur="1.4s" repeatCount="indefinite"/></rect>
            <rect x="67.5" y="107.5" width="3" height="3" fill="#ffe98a"><animate attributeName="opacity" values="1;.3;1" dur="1.4s" repeatCount="indefinite"/></rect>
            <line x1="54" y1="128" x2="52" y2="136" stroke="#6a5408" stroke-width="3.4" stroke-linecap="round"/>
            <line x1="70" y1="128" x2="72" y2="136" stroke="#6a5408" stroke-width="3.4" stroke-linecap="round"/>
            <!-- the tiny one RIDES on top! -->
            <g>
              <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur=".6s" repeatCount="indefinite"/>
              <polygon points="56,74 70,74 70,88 56,88" fill="url(#${uid}s)" stroke="#8a7010" stroke-width="1.5"/>
              <polygon points="56,74 60,70 74,70 70,74" fill="#ffe98a" stroke="#8a7010" stroke-width="1"/>
              <rect x="59" y="79" width="3" height="3" fill="#3a2c02"/><rect x="65" y="79" width="3" height="3" fill="#3a2c02"/>
            </g>
          </g>
          <!-- middle cube hopping -->
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-9;0,0" dur=".8s" begin=".2s" repeatCount="indefinite"/>
            <polygon points="94,104 118,104 118,128 94,128" fill="url(#${uid}s)" stroke="#8a7010" stroke-width="2"/>
            <polygon points="94,104 100,98 124,98 118,104" fill="#ffe98a" stroke="#8a7010" stroke-width="1.5"/>
            <rect x="100" y="112" width="5" height="5" fill="#3a2c02"/><rect x="109" y="112" width="5" height="5" fill="#3a2c02"/>
            <line x1="100" y1="128" x2="98" y2="135" stroke="#6a5408" stroke-width="3" stroke-linecap="round"/>
            <line x1="112" y1="128" x2="114" y2="135" stroke="#6a5408" stroke-width="3" stroke-linecap="round"/>
          </g>
          <!-- small cube hopping -->
          <g>
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-7;0,0" dur=".7s" begin=".45s" repeatCount="indefinite"/>
            <polygon points="22,112 40,112 40,130 22,130" fill="url(#${uid}s)" stroke="#8a7010" stroke-width="2"/>
            <polygon points="22,112 27,107 45,107 40,112" fill="#ffe98a" stroke="#8a7010" stroke-width="1.2"/>
            <rect x="26" y="118" width="4" height="4" fill="#3a2c02"/><rect x="33" y="118" width="4" height="4" fill="#3a2c02"/>
            <line x1="27" y1="130" x2="25" y2="136" stroke="#6a5408" stroke-width="2.6" stroke-linecap="round"/>
            <line x1="35" y1="130" x2="37" y2="136" stroke="#6a5408" stroke-width="2.6" stroke-linecap="round"/>
          </g>`;
    return svg(150,150,body);
  }
  if(id==='null'){
    const body=mode==='intense'?`<defs>
            <linearGradient id="${uid}n" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#c890f0"/><stop offset="50%" stop-color="#7a3ac0"/><stop offset="100%" stop-color="#241040"/></linearGradient>
          </defs>
          <!-- RGB-SPLIT ghost copies -->
          <g opacity=".4" fill="#ff3a5a">
            <animateTransform attributeName="transform" type="translate" calcMode="discrete" values="-5,0;-8,0;-4,0;-6,0;-5,0" dur=".5s" repeatCount="indefinite"/>
            <polygon points="75,58 96,74 90,114 60,114 54,74"/>
            <polygon points="75,18 92,30 88,54 62,54 58,30"/>
          </g>
          <g opacity=".4" fill="#3ae8ff">
            <animateTransform attributeName="transform" type="translate" calcMode="discrete" values="5,0;8,0;4,0;7,0;5,0" dur=".45s" repeatCount="indefinite"/>
            <polygon points="75,58 96,74 90,114 60,114 54,74"/>
            <polygon points="75,18 92,30 88,54 62,54 58,30"/>
          </g>
          <!-- SIGNAL LOST: the whole body teleport-jitters -->
          <g>
            <animateTransform attributeName="transform" type="translate" calcMode="discrete" values="0,0;-10,0;7,0;-4,0;10,0;0,0" dur=".7s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;.25;1;.15;1" dur=".4s" repeatCount="indefinite"/>
            <path d="M64,112 L60,126 L62,140" fill="none" stroke="#241040" stroke-width="8" stroke-linecap="round"/>
            <path d="M86,112 L90,126 L88,140" fill="none" stroke="#241040" stroke-width="8" stroke-linecap="round"/>
            <polygon points="75,58 96,74 90,114 60,114 54,74" fill="url(#${uid}n)" stroke="#d8b0ff" stroke-width="1.8"/>
            <!-- both arms reaching NOW -->
            <path d="M94,78 L112,74 L120,66" fill="none" stroke="#4a2a78" stroke-width="7" stroke-linecap="round"/>
            <path d="M56,78 L38,74 L30,66" fill="none" stroke="#4a2a78" stroke-width="7" stroke-linecap="round"/>
            <!-- head slices VIOLENTLY apart -->
            <g><animateTransform attributeName="transform" type="translate" calcMode="discrete" values="0,0;10,0;-8,0;5,0;0,0" dur=".5s" repeatCount="indefinite"/>
              <polygon points="75,18 92,30 90,38 60,38 58,30" fill="url(#${uid}n)" stroke="#d8b0ff" stroke-width="1.8"/></g>
            <g><animateTransform attributeName="transform" type="translate" calcMode="discrete" values="0,0;-7,0;9,0;-4,0;0,0" dur=".45s" repeatCount="indefinite"/>
              <polygon points="60,38 90,38 88,54 62,54" fill="url(#${uid}n)" stroke="#d8b0ff" stroke-width="1.8"/>
              <!-- eyes gone FULL static -->
              <rect x="64" y="42" width="8" height="5" fill="#fff"><animate attributeName="opacity" values="1;0;1;0;1" dur=".25s" repeatCount="indefinite"/></rect>
              <rect x="78" y="42" width="8" height="5" fill="#fff"><animate attributeName="opacity" values="0;1;0;1;0" dur=".25s" repeatCount="indefinite"/></rect>
            </g>
            <circle cx="75" cy="90" r="7" fill="#180a2c"/>
            <circle cx="75" cy="90" r="4.4" fill="#ff4ae8"><animate attributeName="r" values="4.4;6.6;4.4" dur=".2s" repeatCount="indefinite"/></circle>
          </g>
          <!-- STATIC STORM -->
          <g fill="#d8b0ff">
            <rect x="20" y="34" width="16" height="3"><animate attributeName="opacity" values="0;1;0" dur=".3s" repeatCount="indefinite"/></rect>
            <rect x="110" y="52" width="20" height="3"><animate attributeName="opacity" values="0;1;0" dur=".26s" begin=".1s" repeatCount="indefinite"/></rect>
            <rect x="26" y="96" width="14" height="3"><animate attributeName="opacity" values="0;1;0" dur=".34s" begin=".18s" repeatCount="indefinite"/></rect>
            <rect x="106" y="112" width="18" height="3"><animate attributeName="opacity" values="0;1;0" dur=".3s" begin=".05s" repeatCount="indefinite"/></rect>
          </g>
          <text x="122" y="30" font-size="9" fill="#ff4ae8" font-family="monospace" font-weight="bold" text-anchor="middle">ERR<animate attributeName="opacity" values="0;1;0" dur=".5s" repeatCount="indefinite"/></text>
          <text x="30" y="126" font-size="9" fill="#3ae8ff" font-family="monospace" font-weight="bold" text-anchor="middle">▮▮▯<animate attributeName="opacity" values="0;1;0" dur=".6s" begin=".3s" repeatCount="indefinite"/></text>`:`<defs>
            <linearGradient id="${uid}n" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stop-color="#c890f0"/><stop offset="50%" stop-color="#7a3ac0"/><stop offset="100%" stop-color="#241040"/></linearGradient>
          </defs>
          <ellipse cx="75" cy="143" rx="26" ry="5" fill="#000" opacity=".3"><animate attributeName="opacity" values=".3;.12;.3" dur="1.4s" repeatCount="indefinite"/></ellipse>
          <!-- BUFFERING: pieces drift out of place and snap back -->
          <g>
            <animate attributeName="opacity" values="1;.82;1;.9;1" dur="1.4s" repeatCount="indefinite"/>
            <!-- legs -->
            <path d="M64,112 L60,126 L62,140" fill="none" stroke="#241040" stroke-width="8" stroke-linecap="round"/>
            <path d="M86,112 L90,126 L88,140" fill="none" stroke="#241040" stroke-width="8" stroke-linecap="round"/>
            <!-- torso -->
            <polygon points="75,58 96,74 90,114 60,114 54,74" fill="url(#${uid}n)" stroke="#d8b0ff" stroke-width="1.8"/>
            <!-- an arm that keeps DRIFTING off its socket -->
            <g>
              <animateTransform attributeName="transform" type="translate" values="0,0;6,0;6,0;0,0;0,0" keyTimes="0;.25;.5;.55;1" dur="2.8s" repeatCount="indefinite"/>
              <path d="M94,80 L108,92 L104,106" fill="none" stroke="#4a2a78" stroke-width="7" stroke-linecap="round"/>
            </g>
            <path d="M56,80 L42,92 L46,106" fill="none" stroke="#4a2a78" stroke-width="7" stroke-linecap="round"/>
            <!-- head in TWO slices — the top slice keeps sliding off! -->
            <g>
              <animateTransform attributeName="transform" type="translate" values="0,0;5,0;0,0;-4,0;0,0" keyTimes="0;.2;.4;.7;1" dur="2.2s" repeatCount="indefinite" calcMode="discrete"/>
              <polygon points="75,18 92,30 90,38 60,38 58,30" fill="url(#${uid}n)" stroke="#d8b0ff" stroke-width="1.8"/>
            </g>
            <polygon points="60,38 90,38 88,54 62,54" fill="url(#${uid}n)" stroke="#d8b0ff" stroke-width="1.8"/>
            <!-- mismatched eyes: one calm, one flickering -->
            <rect x="64" y="42" width="8" height="5" rx="1" fill="#e8c8ff"/>
            <rect x="78" y="42" width="8" height="5" rx="1" fill="#e8c8ff"><animate attributeName="opacity" values="1;.1;1;.1;1" dur=".7s" repeatCount="indefinite"/></rect>
            <!-- chest core stuttering -->
            <circle cx="75" cy="90" r="7" fill="#180a2c"/>
            <circle cx="75" cy="90" r="4.4" fill="#b060e8"><animate attributeName="r" values="4.4;4.4;6;4.4" keyTimes="0;.6;.7;1" dur="1.2s" repeatCount="indefinite"/></circle>
          </g>
          <!-- static bars sweeping down him -->
          <rect x="46" y="30" width="58" height="3" fill="#d8b0ff" opacity=".25">
            <animate attributeName="y" values="20;136" dur="2.4s" repeatCount="indefinite"/>
          </rect>
          <rect x="46" y="60" width="58" height="2" fill="#fff" opacity=".18">
            <animate attributeName="y" values="136;20" dur="3.1s" repeatCount="indefinite"/>
          </rect>
          <!-- stray pixels blinking around him -->
          <rect x="38" y="48" width="5" height="5" fill="#b060e8"><animate attributeName="opacity" values="0;1;0" dur="1.1s" repeatCount="indefinite"/></rect>
          <rect x="108" y="70" width="4" height="4" fill="#d8b0ff"><animate attributeName="opacity" values="0;1;0" dur="1.3s" begin=".4s" repeatCount="indefinite"/></rect>
          <rect x="42" y="118" width="4" height="4" fill="#8a4ae0"><animate attributeName="opacity" values="0;1;0" dur=".9s" begin=".7s" repeatCount="indefinite"/></rect>`;
    return svg(150,150,body);
  }
  return ns2BotSVG('magna',size);
}

function playNightShift2(opts){
  opts=opts||{};
  const old=document.getElementById('nightshift2'); if(old)old.remove();
  if(ns2Loop){clearInterval(ns2Loop);ns2Loop=null;}
  try{closeGamesHub({skipHash:true});}catch(_){}
  try{closePoppyPlay();}catch(_){}
  try{nsCloseGame();}catch(_){}
  ns2Game={
    hour:12,minute:0,power:100,
    leftDoor:false,rightDoor:false,camOpen:false,currentCam:1,
    over:false,won:false,intro:true,msg:'',scare:0,
    decoy:null,frost:null,corrupt:{1:0,2:0,3:0,4:0},
    bots:[
      {id:'magna',name:'Magnapull',role:'Door-Breaker',gem:'Magnetite · rips doors with magnetism',side:'left',pos:0,speed:0.14,color:'#7a8ae8'},
      {id:'prism',name:'Prismimic',role:'Shapeshifter',gem:'Opal · The Shapeshifter',side:'right',pos:0,speed:0.16,color:'#ff6ab0'},
      {id:'glaci',name:'Glacivore',role:'The Freezer',gem:'Ice Crystal · freezes controls',side:'left',pos:0,speed:0.15,color:'#7ad0f0'},
      {id:'swarm',name:'Swarmshard',role:'The Many',gem:'Pyrite · swarms both doors',side:'right',pos:0,speed:0.17,color:'#e8c838',swarmL:0,swarmR:0},
      {id:'null',name:'Nullite',role:'The Glitch',gem:'Corrupted · static & teleports',side:'right',pos:0,speed:0.11,color:'#b060e8',telepath:true},
    ],
  };
  const wrap=document.createElement('div');
  wrap.id='nightshift2';
  wrap.innerHTML='<div class="ns-screen" id="ns2-screen"></div>';
  document.body.appendChild(wrap);
  try{history.replaceState(null,'','#nightshift2');}catch(_){}
  if(typeof syncNavHighlight==='function')syncNavHighlight('nightshift2');
  if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
  renderNightShift2();
  try{if(typeof SFX!=='undefined'&&SFX.boss)SFX.boss();}catch(_){}
  if(typeof lithos8bitSync==='function')lithos8bitSync();
}
function ns2CloseGame(){
  if(ns2Loop){clearInterval(ns2Loop);ns2Loop=null;}
  ns2Game=null;
  const w=document.getElementById('nightshift2'); if(w)w.remove();
  if(location.hash==='#nightshift2'){
    try{history.replaceState(null,'',location.pathname+location.search+(typeof activeView!=='undefined'&&activeView!=='catalog'?('#'+activeView):''));}catch(_){}
  }
  if(typeof syncNavHighlight==='function')syncNavHighlight(typeof activeView!=='undefined'?activeView:'catalog');
  if(typeof syncBodyScrollLock==='function')syncBodyScrollLock();
  if(typeof lithos8bitSync==='function')lithos8bitSync();
}
function ns2StartNight(){
  if(!ns2Game)return;
  ns2Game.intro=false; ns2Game.over=false; ns2Game.won=false;
  try{if(typeof SFX!=='undefined'){SFX.office&&SFX.office();SFX.talk&&SFX.talk('bonnie');}}catch(_){}
  renderNightShift2();
  if(ns2Loop)clearInterval(ns2Loop);
  ns2Loop=setInterval(ns2Tick,100);
}
function ns2CrackFrost(){
  if(!ns2Game||!ns2Game.frost)return;
  ns2Game.frost.clicks--;
  if(ns2Game.frost.clicks<=0) ns2Game.frost=null;
  else ns2Game.msg='Ice cracking… '+ns2Game.frost.clicks+' more tap'+(ns2Game.frost.clicks===1?'':'s')+'!';
  try{if(typeof SFX!=='undefined'&&SFX.click)SFX.click();}catch(_){}
  renderNightShift2();
}
function ns2ClickDecoy(){
  if(!ns2Game||!ns2Game.decoy)return;
  ns2Game.decoy=null;
  ns2Game.msg='Got it! Prismimic disguise shattered — no free move.';
  try{if(typeof SFX!=='undefined'&&SFX.code)SFX.code();}catch(_){}
  renderNightShift2();
}
function ns2ToggleDoor(side){
  if(!ns2Game||ns2Game.over||ns2Game.blackout||ns2Game.frost)return;
  if(side==='left')ns2Game.leftDoor=!ns2Game.leftDoor;
  else ns2Game.rightDoor=!ns2Game.rightDoor;
  const closed=side==='left'?ns2Game.leftDoor:ns2Game.rightDoor;
  try{if(typeof SFX!=='undefined'&&SFX.door)SFX.door(closed);else if(SFX&&SFX.click)SFX.click();}catch(_){}
  renderNightShift2();
}
function ns2ToggleCam(){
  if(!ns2Game||ns2Game.over||ns2Game.frost)return;
  ns2Game.camOpen=!ns2Game.camOpen;
  try{if(typeof SFX!=='undefined'&&SFX.cam)SFX.cam(ns2Game.camOpen);else if(SFX&&SFX.click)SFX.click();}catch(_){}
  renderNightShift2();
}
function ns2SetCam(n){
  if(!ns2Game||ns2Game.frost)return;
  if(ns2Game.currentCam!==n){try{if(typeof SFX!=='undefined'&&SFX.camSwitch)SFX.camSwitch();}catch(_){}}
  ns2Game.currentCam=n;
  renderNightShift2();
}
function ns2SmartDoor(){
  if(!ns2Game||ns2Game.over||ns2Game.blackout||ns2Game.frost)return;
  const left=Math.max(...ns2Game.bots.filter(b=>b.side==='left'&&b.id!=='swarm').map(b=>b.pos),0);
  const right=Math.max(...ns2Game.bots.filter(b=>b.side==='right'&&b.id!=='swarm').map(b=>b.pos),0);
  const sw=ns2Game.bots.find(b=>b.id==='swarm');
  const sl=sw?sw.swarmL:0,sr=sw?sw.swarmR:0;
  if(sr+right>sl+left) ns2ToggleDoor('right'); else ns2ToggleDoor('left');
}
function ns2Lose(bot){
  ns2Game.over=true; ns2Game.won=false; ns2Game.caughtBy=bot;
  try{if(typeof SFX!=='undefined'&&SFX.jumpscare)SFX.jumpscare(bot&&(bot.id||bot.name));}catch(_){}
  if(ns2Loop){clearInterval(ns2Loop);ns2Loop=null;}
  renderNightShift2();
}
function ns2Win(){
  try{if(typeof SFX!=='undefined'&&SFX.win)SFX.win();}catch(_){}
  if(ns2Loop){clearInterval(ns2Loop);ns2Loop=null;}
  if(!ns2Game)return;
  ns2Game.over=true; ns2Game.won=true;
  renderNightShift2();
}
function ns2Tick(){
  if(!ns2Game||ns2Game.over)return;
  const g=ns2Game;
  g.minute+=1.7;
  if(g.minute>=60){
    g.minute=0; g.hour++; if(g.hour>12)g.hour=1;
    try{if(typeof SFX!=='undefined'&&SFX.code)SFX.code();}catch(_){}
    if(g.hour===6){ns2Win();return;}
  }
  let drain=0.045;
  if(g.leftDoor)drain+=0.05;
  if(g.rightDoor)drain+=0.05;
  if(g.camOpen)drain+=0.04;
  g.power-=drain;
  if(g.power<=0){
    g.power=0; g.leftDoor=false; g.rightDoor=false;
    if(!g.blackout){g.blackout=true;try{if(typeof SFX!=='undefined'&&SFX.powerOut)SFX.powerOut();}catch(_){}}
  }
  const hoursPassed=(g.hour===12)?0:g.hour;
  g.anger=hoursPassed;
  const angerCurve=[0.07,0.22,0.50,0.95,1.6,2.4];
  const angerBoost=angerCurve[Math.min(5,g.anger||0)];
  g.scare=0; g.telepathSensed=false;
  let doorBot=null;
  const wakeHour=[0,1,2,3,4];
  g.bots.forEach((bot,idx)=>{
    const awake=hoursPassed>=(wakeHour[idx]!==undefined?wakeHour[idx]:0);
    bot.asleep=!awake;
    if(!awake)return;
    const prevPos=bot._prevPos!=null?bot._prevPos:bot.pos;
    if(bot.id==='null'){
      if(Math.random()<bot.speed*angerBoost*0.9){
        bot.pos+=Math.random()<0.45?2:1;
        if(Math.random()<0.12){
          const c=1+Math.floor(Math.random()*4);
          g.corrupt[c]=35;
          g.msg='NULLITE corrupted CAM '+c+'!';
        }
      }
      const watching=g.camOpen&&((g.currentCam===1&&bot.side==='left')||(g.currentCam===bot.pos));
      if(!watching&&Math.random()<0.1*angerBoost) bot.pos+=1;
      if(bot.pos>4)bot.pos=4;
    }else if(bot.id==='swarm'){
      if(Math.random()<bot.speed*angerBoost){ if(Math.random()<0.5) bot.swarmL=Math.min(4,(bot.swarmL||0)+1); else bot.swarmR=Math.min(4,(bot.swarmR||0)+1); }
      if(Math.random()<bot.speed*angerBoost*0.6){ if(Math.random()<0.5) bot.swarmL=Math.min(4,(bot.swarmL||0)+1); else bot.swarmR=Math.min(4,(bot.swarmR||0)+1); }
    }else{
      if(Math.random()<bot.speed*angerBoost) bot.pos+=1;
      if(g.camOpen&&Math.random()<0.05*angerBoost) bot.pos+=1;
      if(bot.pos>4)bot.pos=4;
      if(bot.pos>=4){ if(doorBot) bot.pos=3; else doorBot=bot; }
    }
    if(bot.pos>prevPos&&bot.id!=='swarm'){
      const bid=bot.id||ns2BotId(bot.name);
      try{if(bid==='glaci'&&SFX.clack)SFX.clack();else if(bid==='magna'&&SFX.stomp)SFX.stomp();else if(SFX.walk)SFX.walk(bid);}catch(_){}
      if(Math.random()<0.22){try{if(SFX.talk)SFX.talk(bid);}catch(_){}}
    }
    bot._prevPos=bot.pos;
  });
  Object.keys(g.corrupt).forEach(k=>{if(g.corrupt[k]>0)g.corrupt[k]--;});
  const prism=g.bots.find(b=>b.id==='prism');
  if(prism&&!prism.asleep&&prism.pos>=1&&!g.decoy&&Math.random()<0.04*angerBoost){
    g.decoy={cam:g.camOpen?g.currentCam:(1+Math.floor(Math.random()*4)),ttl:28};
    g.msg='Something on CAM '+g.decoy.cam+' looks… wrong. Click the blinking crate!';
  }
  if(g.decoy){
    g.decoy.ttl--;
    if(g.decoy.ttl<=0){
      g.decoy=null;
      if(prism&&prism.pos<4){prism.pos++;g.msg='Prismimic slipped closer while you stared at the fake!';try{if(SFX.talk)SFX.talk('prism');}catch(_){}}
    }
  }
  const glaci=g.bots.find(b=>b.id==='glaci');
  if(glaci&&!glaci.asleep&&glaci.pos>=2&&!g.frost&&Math.random()<0.035*angerBoost){
    g.frost={clicks:3};
    g.msg='GLACIVORE frost-breath! Tap the ice 3 times to unfreeze controls!';
    try{if(SFX.code)SFX.code();}catch(_){}
  }
  if(doorBot){
    g.scare=1;
    try{if(SFX.heartbeat)SFX.heartbeat();}catch(_){}
    const side=doorBot.side;
    const doorClosed=(side==='left'&&g.leftDoor)||(side==='right'&&g.rightDoor);
    if(doorBot.id==='magna'&&doorClosed&&Math.random()<0.09){
      if(side==='left')g.leftDoor=false; else g.rightDoor=false;
      g.msg='MAGNETIC GROAN — Magnapull ripped the '+side+' door open! Slam it again!';
      try{if(SFX.door)SFX.door(false);}catch(_){}
    }else if(!doorClosed){
      if(!g.camOpen||g.blackout){ns2Lose(doorBot);return;}
    }
  }
  const swarm=g.bots.find(b=>b.id==='swarm');
  if(swarm&&!swarm.asleep){
    for(const [side,count] of [['left',swarm.swarmL],['right',swarm.swarmR]]){
      if(count<3)continue;
      g.scare=1;
      const closed=(side==='left'&&g.leftDoor)||(side==='right'&&g.rightDoor);
      if(!closed&&(!g.camOpen||g.blackout)){
        ns2Lose({id:'swarm',name:'Swarmshard',side});
        return;
      }
      if(count>=4&&!closed&&(!g.camOpen||g.blackout)){
        ns2Lose({id:'swarm',name:'Swarmshard',side});
        return;
      }
    }
  }
  renderNightShift2();
}
function ns2CamDecor(cam){
  if(cam===1)return '<div class="ns-decor" style="left:8%;bottom:14%;font-size:26px">⛏️</div><div class="ns-shelf" style="bottom:10%"></div>';
  if(cam===2)return '<div class="ns-decor" style="left:10%;bottom:12%;font-size:28px">🪨</div><div class="ns-tracks" style="bottom:8%"></div>';
  if(cam===3)return '<div class="ns-crate" style="left:10%;bottom:12%"></div><div class="ns-crate" style="right:14%;bottom:12%"></div>';
  return '<div class="ns-belt" style="bottom:22%"></div><div class="ns-machine" style="left:6%;bottom:12%"></div>';
}
function renderNightShift2(){
  const scr=document.getElementById('ns2-screen');
  if(!scr||!ns2Game)return;
  const g=ns2Game;
  const esc=typeof escapeHtml==='function'?escapeHtml:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  if(g.intro){
    scr.innerHTML=`<div class="ns-intro">
      <div class="ns-intro-title">⛏️ NIGHT SHIFT 2 — THE MINE BELOW</div>
      <div class="ns-intro-sub">Five NEW animatronics from the abandoned mine under the factory — each with a unique game power. Survive until 6 AM!</div>
      <button class="ns-btn big" onclick="ns2StartNight()">Descend Into the Mine 🌙</button>
      <div class="ns-intro-bots">${g.bots.map(b=>`<div class="ns-intro-bot">
        <div class="ns-intro-emoji" style="filter:drop-shadow(0 0 10px ${b.color})">${ns2BotSVG(b.id,64)}</div>
        <div class="ns-intro-name" style="color:${b.color}">${b.name}</div>
        <div class="ns-intro-role">${b.role||''}</div>
        <div class="ns-intro-gem">${b.gem||''}</div>
      </div>`).join('')}</div>
      <div class="ns-intro-tip">⌨️ <b>Space/C</b> cameras · <b>D</b> danger door · <b>L/R</b> doors<br>
        🧲 Magnapull rips doors · 📦 click fake crates · ❄️ tap ice 3× · 💨 swarm both sides · 📺 Nullite static</div>
      <button class="ns-btn ghost" onclick="ns2CloseGame()">Leave</button>
    </div>`;
    return;
  }
  if(g.over){
    if(g.won){
      scr.innerHTML=`<div class="ns-end win"><div class="ns-end-big">☀️ 6:00 AM</div><div class="ns-end-title">YOU ESCAPED THE MINE!</div>
        <div class="ns-end-msg">The deep crew powers down. You made it out of the mine below the factory!</div>
        <button class="ns-btn big" onclick="playNightShift2()">Another Shift ⛏️</button>
        <button class="ns-btn ghost" onclick="ns2CloseGame()">Leave</button></div>`;
    }else{
      const bot=g.caughtBy||{name:'Something',id:'null'};
      scr.innerHTML=`<div class="ns-end lose"><div class="ns-jumpscare-art">${ns2BotSVG(bot.id||bot.name,220)}</div>
        <div class="ns-end-title">${esc(bot.name).toUpperCase()} GOT YOU!</div>
        <div class="ns-end-msg">The mine below claims another guard…</div>
        <button class="ns-btn big" onclick="playNightShift2()">Try Again ⛏️</button>
        <button class="ns-btn ghost" onclick="ns2CloseGame()">Leave</button></div>`;
    }
    return;
  }
  const hourStr=`${g.hour}:${String(Math.floor(g.minute)).padStart(2,'0')} AM`;
  const powerPct=Math.min(100,Math.max(0,g.power));
  const powerColor=g.power>40?'#3fa34d':(g.power>15?'#e0a020':'#c0392b');
  const msgHTML=g.msg?`<div class="ns-telepath" style="margin:6px 0">${esc(g.msg)}</div>`:'';
  const frostHTML=g.frost?`<div class="ns2-frost" onclick="ns2CrackFrost()" title="Tap to crack the ice!">🧊 FROZEN — tap ${g.frost.clicks}× to break ice!</div>`:'';
  if(g.camOpen){
    const cam=g.currentCam;
    const corrupt=g.corrupt[cam]>0;
    const camBots=g.bots.filter(b=>{
      if(b.asleep||b.id==='swarm')return false;
      if(cam===1)return b.pos<=1;
      if(cam===2)return b.pos===2;
      if(cam===3)return b.pos===3;
      return b.side==='right'&&b.pos<=1;
    });
    const botDots=camBots.map(b=>{
      const bid=b.id||ns2BotId(b.name);
      return `<div class="ns-cam-bot" style="left:${20+Math.random()*55}%;top:${30+Math.random()*40}%"><div style="width:52px;filter:drop-shadow(0 0 8px ${b.color})">${ns2BotSVG(bid,52)}</div><div class="ns-cam-name">${b.name}</div></div>`;
    }).join('');
    const decoyHTML=(g.decoy&&g.decoy.cam===cam)?`<button type="button" class="ns2-decoy" onclick="ns2ClickDecoy()" style="left:${35+Math.random()*20}%;top:${45+Math.random()*15}%">📦<span class="ns2-blink">👁</span></button>`:'';
    scr.innerHTML=`<div class="ns-topbar"><div class="ns-clock">🕛 ${hourStr}</div><div class="ns-power">🔋 <div class="ns-power-bar"><span style="width:${powerPct}%;background:${powerColor}"></span></div> ${Math.round(g.power)}%</div></div>
      ${frostHTML}${msgHTML}
      <div class="ns-camview ${corrupt?'ns2-corrupt':''} ${g.scare?'scare':''}"><div class="ns-cam-decor">${ns2CamDecor(cam)}</div><div class="ns-static" style="opacity:${corrupt?0.35:0.08}"></div>
      <div class="ns-cam-label">📹 MINE CAM ${cam}${corrupt?' · 📺 STATIC':''}</div>${botDots}${decoyHTML||'<div class="ns-cam-empty">...tunnel clear...</div>'}
      </div><div class="ns-cam-btns">${[1,2,3,4].map(n=>`<button class="ns-cam-select ${cam===n?'on':''}" ${g.frost?'disabled':''} onclick="ns2SetCam(${n})">CAM ${n}</button>`).join('')}</div>
      <button class="ns-btn wide" ${g.frost?'disabled':''} onclick="ns2ToggleCam()">⬇️ Close Cameras</button>`;
    return;
  }
  const doorBot=g.bots.find(b=>!b.asleep&&b.pos>=4)||null;
  const swarm=g.bots.find(b=>b.id==='swarm');
  const leftAtDoor=doorBot&&doorBot.side==='left';
  const rightAtDoor=doorBot&&doorBot.side==='right';
  const leftBot=g.bots.filter(b=>b.side==='left'&&b.id!=='swarm').reduce((a,b)=>b.pos>a.pos?b:a,{pos:0});
  const rightBot=g.bots.filter(b=>b.side==='right'&&b.id!=='swarm').reduce((a,b)=>b.pos>a.pos?b:a,{pos:0});
  const swarmL=swarm?swarm.swarmL:0, swarmR=swarm?swarm.swarmR:0;
  const leftWarn=leftAtDoor?'👹 AT DOOR!':(swarmL>=3?'💨 SWARM!':(leftBot.pos>=2?'👀 close…':''));
  const rightWarn=rightAtDoor?'👹 AT DOOR!':(swarmR>=3?'💨 SWARM!':(rightBot.pos>=2?'👀 close…':''));
  const hallBots=g.bots.filter(b=>!b.asleep&&b.id!=='swarm'&&b.pos>=1&&b.pos<=3).map(b=>{
    const side=b.side==='left'?'left':'right';
    const depth=b.pos;
    const bid=b.id||ns2BotId(b.name);
    return `<div class="ns-hallbot ${side}" style="${side}:${6+depth*10}%;bottom:${30+depth*6}%;width:${18+depth*10}px;filter:drop-shadow(0 0 ${depth*4}px ${b.color})">${ns2BotSVG(bid,18+depth*10)}<div class="ns-hallbot-name">${b.name}</div></div>`;
  }).join('');
  const swarmHall=(swarmL>0?`<div class="ns-hallbot left" style="left:8%;bottom:28%;width:24px;opacity:${0.5+swarmL*0.12}">${ns2BotSVG('swarm',24)}<div class="ns-hallbot-name">×${swarmL}</div></div>`:'')+
    (swarmR>0?`<div class="ns-hallbot right" style="right:8%;bottom:28%;width:24px;opacity:${0.5+swarmR*0.12}">${ns2BotSVG('swarm',24)}<div class="ns-hallbot-name">×${swarmR}</div></div>`:'');
  scr.innerHTML=`<div class="ns-topbar"><div class="ns-clock">⛏️ ${hourStr}</div><div class="ns-mood" style="color:#7ad0f0">Mine Level · Anger ${g.anger||0}/5</div>
    <div class="ns-power">🔋 <div class="ns-power-bar"><span style="width:${powerPct}%;background:${powerColor}"></span></div> ${Math.round(g.power)}%</div></div>
    ${frostHTML}${msgHTML}
    <div class="ns-office fpv ${g.scare?'scare':''} ${g.blackout?'blackout':''}">
      ${g.blackout?'<div class="ns-blackout-msg">⚡ POWER OUT!</div>':''}
      <div class="ns-fp-hall"><div class="ns-fp-depth"></div><div class="ns-fp-floor"></div>${hallBots}${swarmHall}</div>
      <div class="ns-door-area left"><div class="ns-door ${g.leftDoor?'closed':'open'}">${g.leftDoor?'🚪':(leftAtDoor?`<span class="ns-doorbot">${ns2BotSVG(doorBot.id,60)}</span>`:'')}</div>
        <div class="ns-door-warn">${leftWarn}</div><button class="ns-btn door ${g.leftDoor?'on':''}" ${g.frost||g.blackout?'disabled':''} onclick="ns2ToggleDoor('left')">${g.leftDoor?'🔒 Left SHUT':'🚪 Left'}</button></div>
      <div class="ns-desk"><div class="ns-fp-you">⛏️</div><div class="ns-desk-label">Deep Guard</div>
        <div class="ns-hint">Night Shift 2 · Mine Below crew</div></div>
      <div class="ns-door-area right"><div class="ns-door ${g.rightDoor?'closed':'open'}">${g.rightDoor?'🚪':(rightAtDoor?`<span class="ns-doorbot">${ns2BotSVG(doorBot.id,60)}</span>`:'')}</div>
        <div class="ns-door-warn">${rightWarn}</div><button class="ns-btn door ${g.rightDoor?'on':''}" ${g.frost||g.blackout?'disabled':''} onclick="ns2ToggleDoor('right')">${g.rightDoor?'🔒 Right SHUT':'🚪 Right'}</button></div>
    </div>
    <button class="ns-btn wide" ${g.frost?'disabled':''} onclick="ns2ToggleCam()">📹 Mine Cameras</button>`;
}
document.addEventListener('keydown',function ns2Key(e){
  if(!ns2Game||!document.getElementById('nightshift2'))return;
  if(ns2Game.intro){if(e.key==='Enter'||(e.key===' '&&!e.shiftKey)){ns2StartNight();e.preventDefault();}return;}
  if(ns2Game.over)return;
  if(e.key===' '||e.key==='c'||e.key==='C'){ns2ToggleCam();e.preventDefault();return;}
  if(e.key==='d'||e.key==='D'){ns2SmartDoor();e.preventDefault();return;}
  if(e.key==='l'||e.key==='L'){ns2ToggleDoor('left');e.preventDefault();return;}
  if(e.key==='r'||e.key==='R'){ns2ToggleDoor('right');e.preventDefault();return;}
  if(ns2Game.camOpen&&['1','2','3','4'].includes(e.key)){ns2SetCam(+e.key);e.preventDefault();}
});
