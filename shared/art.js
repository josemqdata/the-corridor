/* THE CORRIDOR — illustration helpers (inline SVG, no external images) */
/* ---------------- ART helpers (inline SVG) ---------------- */
const W=400,H=250;
function sky(t){
  const g={day:["#7fb6e0","#f4dcb4"],dusk:["#3a3f6b","#f08a5d"],night:["#070d1c","#1e2a48"]}[t];
  let s=`<defs><linearGradient id="sk-${t}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[1]}"/></linearGradient>
  <radialGradient id="fireg"><stop offset="0" stop-color="#ffd36b"/><stop offset="1" stop-color="#ff6a2b" stop-opacity="0"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sk-${t})"/>`;
  if(t==="night"){ for(let i=0;i<40;i++){const x=(i*97)%W,y=(i*53)%110; s+=`<circle cx="${x}" cy="${y}" r="${i%3?0.8:1.3}" fill="#fff" class="twinkle" style="animation-delay:${(i%7)*.3}s"/>`;}
    s+=`<circle cx="330" cy="40" r="14" fill="#f4efd8"/><circle cx="336" cy="36" r="13" fill="#0b1326"/>`; }
  if(t==="day") s+=`<circle cx="330" cy="46" r="18" fill="#fff4cf" opacity=".9"/>`;
  if(t==="dusk") s+=`<circle cx="300" cy="150" r="26" fill="#ffc27a" opacity=".85"/>`;
  return s;
}
function mountains(t){
  const far=t==="night"?"#1b2540":t==="dusk"?"#5b4a6e":"#8aa0b8", near=t==="night"?"#121a30":t==="dusk"?"#3f3550":"#6d7f6a", snow=t==="night"?"#8a95b0":"#fff";
  return `<polygon points="0,150 40,95 70,120 120,60 170,115 210,80 260,130 310,70 360,120 400,90 400,250 0,250" fill="${far}"/>
  <polygon points="120,60 108,78 120,74 132,82" fill="${snow}"/><polygon points="310,70 298,88 310,84 322,92" fill="${snow}"/>
  <polygon points="0,180 60,130 110,160 170,120 230,165 290,135 350,170 400,145 400,250 0,250" fill="${near}"/>`;
}
function ground(t){ const c=t==="night"?"#2a2a2e":t==="dusk"?"#6b5240":"#a98a5e"; return `<rect y="185" width="${W}" height="${H}" fill="${c}"/>`; }
function road(t){ const c=t==="night"?"#4a443c":"#cfae74"; return `<path d="M-10,250 C 120,215 180,205 230,192 C 270,182 320,180 410,176 L410,190 C 330,194 280,198 245,206 C 200,218 150,232 60,250 Z" fill="${c}"/>`; }
function truck(x,y,s=1,cls="",color="#e8b33a"){
  return `<g class="${cls}"><g transform="translate(${x},${y}) scale(${s})"><rect x="0" y="-22" width="44" height="18" rx="2" fill="${color}"/><path d="M44,-18 h12 l8,8 v6 h-20z" fill="#d49a2a"/>
    <rect x="49" y="-16" width="7" height="6" fill="#bfe0f0"/><circle cx="10" cy="-3" r="5" fill="#222"/><circle cx="34" cy="-3" r="5" fill="#222"/><circle cx="56" cy="-3" r="5" fill="#222"/>
    <circle class="dust" cx="-6" cy="-6" r="7" fill="#e9d6b0"/><circle class="dust" style="animation-delay:1.3s" cx="-10" cy="-4" r="6" fill="#e9d6b0"/><circle class="dust" style="animation-delay:2.6s" cx="-4" cy="-8" r="8" fill="#e9d6b0"/></g></g>`;
}
function stoppedTruck(x,y,s=1,lights=false){
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="0" y="-22" width="44" height="18" rx="2" fill="#c89a32"/><path d="M44,-18 h12 l8,8 v6 h-20z" fill="#b5852a"/><rect x="49" y="-16" width="7" height="6" fill="#9cc"/>
  <circle cx="10" cy="-3" r="5" fill="#222"/><circle cx="34" cy="-3" r="5" fill="#222"/><circle cx="56" cy="-3" r="5" fill="#222"/>${lights?`<path d="M64,-10 L120,-22 L120,6 Z" fill="#fff7c0" opacity=".35" class="glow"/>`:""}</g>`;
}
function house(x,y,s=1){ return `<g transform="translate(${x},${y}) scale(${s})"><rect x="0" y="-18" width="30" height="18" fill="#c98f5f"/><polygon points="-3,-18 15,-30 33,-18" fill="#9e3b2a"/><rect x="11" y="-10" width="7" height="10" fill="#5a3a22"/><rect x="21" y="-14" width="5" height="5" fill="#f5d78e"/></g>`; }
const PAL=["#b5562b","#2a6f6a","#7b4ea8","#c9a227","#3c6fb0","#a83a50","#4f8a3c","#d07a2c"];
function person(x,y,s=1,c="#b5562b",o={}){
  let hat="";
  if(o.hat==="bowler") hat=`<ellipse cx="0" cy="-27" rx="8" ry="2" fill="#2b2b2b"/><rect x="-5" y="-34" width="10" height="7" rx="4" fill="#2b2b2b"/>`;
  if(o.hat==="helmet") hat=`<path d="M-7,-26 a7,7 0 0 1 14,0 z" fill="#f2f2f2"/>`;
  if(o.hat==="chullo") hat=`<path d="M-6,-27 a6,6 0 0 1 12,0 z" fill="#c23b5a"/>`;
  const arm=o.arm?`<path d="M5,-16 L14,-30" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`:"";
  const tie=o.tie?`<path d="M0,-17 l-1.5,2 1.5,8 1.5,-8z" fill="#b5262b"/>`:"";
  return `<g class="${o.bob?"bob":""}" style="animation-delay:${o.d||0}s"><g transform="translate(${x},${y}) scale(${s})">
    <path d="M-7,0 L-6,-17 Q0,-21 6,-17 L7,0 Z" fill="${c}"/>${tie}${arm}<circle cx="0" cy="-23" r="5.5" fill="${o.skin||"#8a5a3c"}"/>${hat}</g></g>`;
}
function crowd(x,y,n,spread,s=1,opt={}){ let g=""; for(let i=0;i<n;i++){ const px=x+((i*37)%spread), py=y+((i*13)%10);
  g+=person(px,py,s*(0.85+((i*7)%4)*.06),(opt.pal||PAL)[i%(opt.pal||PAL).length],{bob:true,d:(i%5)*.3,hat:opt.helmets?"helmet":(opt.hats===false?"":(i%4===0?"chullo":(i%5===1?"bowler":""))),arm:opt.arms&&i%3===0,tie:opt.ties,skin:opt.ties&&i%2?"#c99a72":undefined}); } return g; }
function fire(x,y,s=1){ return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="0" cy="-8" r="30" fill="url(#fireg)" class="glow"/><ellipse cx="0" cy="0" rx="14" ry="5" fill="#111"/><ellipse cx="0" cy="-4" rx="12" ry="4" fill="#222"/>
  <path class="flick" d="M-9,-4 Q-6,-22 0,-30 Q4,-20 9,-4 Z" fill="#ff7a2b"/><path class="flick" style="animation-delay:.15s" d="M-5,-4 Q-2,-16 1,-22 Q4,-14 5,-4 Z" fill="#ffd36b"/>
  <circle class="smoke" cx="0" cy="-30" r="8" fill="#555"/><circle class="smoke" style="animation-delay:2s" cx="3" cy="-30" r="9" fill="#666"/><circle class="smoke" style="animation-delay:4s" cx="-3" cy="-30" r="7" fill="#4a4a4a"/></g>`; }
function rocks(x,y){ return `<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="9" ry="6" fill="#77706a"/><ellipse cx="14" cy="2" rx="7" ry="5" fill="#8a837c"/><ellipse cx="26" cy="-1" rx="10" ry="6" fill="#6d665f"/><ellipse cx="40" cy="2" rx="8" ry="5" fill="#857e77"/></g>`; }
function room(wall="#6e5644",floor="#4a3a2e"){ return `<rect width="${W}" height="${H}" fill="${wall}"/><rect y="185" width="${W}" height="65" fill="${floor}"/>`; }
let _wv=0;
function windowView(x,y,w,h,t="day",inner){ const id="wv"+(_wv++); return `<g><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})"><g transform="translate(${x},${y}) scale(${w/W},${h/H})">${inner||(sky(t)+mountains(t)+ground(t))}</g></g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#2a211a" stroke-width="5"/><line x1="${x+w/2}" y1="${y}" x2="${x+w/2}" y2="${y+h}" stroke="#2a211a" stroke-width="3"/></g>`; }
function skyline(t="day"){ const c=t==="night"?"#1d2638":"#7f8fa3"; let g=sky(t)+`<rect y="200" width="${W}" height="50" fill="${t==="night"?"#10141e":"#5d6b7c"}"/>`;
  [[10,120,40],[55,90,30],[90,140,45],[140,70,35],[180,110,50],[235,60,40],[280,100,35],[320,130,45],[365,85,35]].forEach(([x,h,w],i)=>{ g+=`<rect x="${x}" y="${200-h}" width="${w}" height="${h}" fill="${c}"/>`;
    for(let r=0;r<Math.floor(h/18);r++) for(let k=0;k<Math.floor(w/12);k++) g+=`<rect x="${x+4+k*12}" y="${200-h+6+r*18}" width="6" height="8" fill="${t==="night"?((r+k+i)%3?"#f5d78e":"#2a3348"):"#c9d6e3"}" ${t==="night"&&(r+k)%5===0?'class="twinkle"':""}/>`; });
  return g; }
function pit(){ return `<g><ellipse cx="200" cy="215" rx="190" ry="40" fill="#8c6b4a"/><ellipse cx="200" cy="218" rx="150" ry="30" fill="#7a5c3f"/><ellipse cx="200" cy="221" rx="110" ry="21" fill="#684d34"/><ellipse cx="200" cy="224" rx="70" ry="12" fill="#563f2b"/></g>`; }
function phoneBig(x,y,label,sub){ return `<g transform="translate(${x},${y})"><circle class="ring" cx="45" cy="80" r="60" fill="none" stroke="#5cc2b5" stroke-width="3"/><circle class="ring" style="animation-delay:.8s" cx="45" cy="80" r="60" fill="none" stroke="#5cc2b5" stroke-width="3"/>
  <g class="shake"><rect x="0" y="0" width="90" height="160" rx="14" fill="#15171c" stroke="#555" stroke-width="2"/><rect x="6" y="14" width="78" height="132" rx="6" fill="#20324a"/>
  <text x="45" y="62" fill="#fff" font-size="10" text-anchor="middle" font-family="sans-serif" font-weight="700">${label}</text><text x="45" y="76" fill="#9fb3c8" font-size="7.5" text-anchor="middle" font-family="sans-serif">${sub}</text>
  <circle cx="25" cy="122" r="10" fill="#e0443b"/><circle cx="65" cy="122" r="10" fill="#45b39d" class="glow"/></g></g>`; }
function radioTower(x,y){ return `<g transform="translate(${x},${y})"><path d="M0,0 L10,-70 L20,0 M4,-25 L16,-25 M7,-48 L13,-48" stroke="#ccc" stroke-width="2.5" fill="none"/><circle cx="10" cy="-72" r="3" fill="#e0443b" class="blink"/>
  ${[0,.7,1.4].map(d=>`<circle class="wave" style="animation-delay:${d}s" cx="10" cy="-72" r="20" fill="none" stroke="#fff" stroke-width="2"/>`).join("")}</g>`; }
function bubble(x,y,txt,d=0,c="#25d366",tc="#062"){ return `<g class="pop" style="animation-delay:${d}s"><rect x="${x}" y="${y}" width="${txt.length*5.2+16}" height="20" rx="10" fill="${c}"/><text x="${x+8}" y="${y+14}" font-size="9.5" fill="${tc}" font-family="sans-serif" font-weight="700">${txt}</text></g>`; }
function banner(x,y,txt){ return `<g transform="translate(${x},${y})" class="bob"><line x1="0" y1="0" x2="0" y2="-38" stroke="#5a3a22" stroke-width="2"/><line x1="60" y1="0" x2="60" y2="-38" stroke="#5a3a22" stroke-width="2"/><rect x="-2" y="-40" width="64" height="18" fill="#f3efe6"/><text x="30" y="-27" text-anchor="middle" font-size="10" font-weight="800" fill="#b5262b" font-family="sans-serif">${txt}</text></g>`; }
function tableLong(y=185){ return `<rect x="40" y="${y}" width="320" height="14" rx="3" fill="#5a3f2c"/><rect x="60" y="${y+14}" width="8" height="40" fill="#4a3324"/><rect x="332" y="${y+14}" width="8" height="40" fill="#4a3324"/>`; }
function papers(x,y){ return `<g transform="translate(${x},${y})"><rect x="0" y="0" width="22" height="14" fill="#f4f1ea" transform="rotate(-6)"/><rect x="6" y="2" width="22" height="14" fill="#fff" transform="rotate(4)"/></g>`; }
function envelope(x,y){ return `<g transform="translate(${x},${y})"><circle cx="14" cy="9" r="24" fill="#ffd36b" opacity=".25" class="glow"/><rect x="0" y="0" width="28" height="18" rx="2" fill="#e8d7a8"/><path d="M0,0 L14,10 L28,0" fill="none" stroke="#a88f55" stroke-width="1.5"/><text x="14" y="-6" text-anchor="middle" font-size="11" font-weight="800" fill="#ffd36b" font-family="sans-serif">$</text></g>`; }
function hospital(x,y){ return `<g transform="translate(${x},${y})"><rect x="0" y="-70" width="120" height="70" fill="#d9dde3"/><rect x="45" y="-92" width="30" height="22" fill="#d9dde3"/><rect x="55" y="-88" width="10" height="16" fill="#e0443b"/><rect x="52" y="-83" width="16" height="6" fill="#e0443b"/>
  ${[0,1,2,3].map(i=>`<rect x="${10+i*28}" y="-55" width="16" height="12" fill="#f5e7a8" class="${i===2?"blink":""}"/>`).join("")}<rect x="48" y="-26" width="24" height="26" fill="#8fb3cc"/></g>`; }
function ambulance(x,y){ return `<g transform="translate(${x},${y})"><rect x="0" y="-20" width="50" height="18" rx="3" fill="#f2f2f2"/><rect x="50" y="-14" width="14" height="12" rx="2" fill="#f2f2f2"/><rect x="18" y="-16" width="4" height="10" fill="#e0443b"/><rect x="15" y="-13" width="10" height="4" fill="#e0443b"/>
  <rect x="20" y="-25" width="12" height="5" class="siren"/><circle cx="12" cy="-2" r="5" fill="#222"/><circle cx="48" cy="-2" r="5" fill="#222"/></g>`; }
function screenChart(x,y,w=150,h=85,trend="up",label=""){
  const pts = trend==="up"?"12,65 40,58 62,62 84,30 106,44 138,20":trend==="down"?"12,20 40,30 62,26 84,52 106,48 138,68":trend==="spike"?"12,60 40,58 62,55 84,50 106,22 138,10":"12,40 40,45 62,38 84,44 106,40 138,42";
  const sx=w/150, sy=h/85;
  return `<g transform="translate(${x},${y})"><rect x="0" y="0" width="${w}" height="${h}" rx="4" fill="#1a2433" stroke="#444" stroke-width="3"/>
  <g transform="scale(${sx},${sy})"><polyline class="draw" points="${pts}" fill="none" stroke="${trend==="down"?"#e05a4f":"#5cc2b5"}" stroke-width="3"/>
  ${[0,1,2,3].map(i=>`<rect x="${16+i*32}" y="${70-i*8}" width="14" height="${i*8+6}" fill="#e08a4f" opacity=".35"/>`).join("")}</g>
  ${label?`<text x="8" y="14" font-size="9" fill="#9fb3c8" font-family="sans-serif" font-weight="700">${label}</text>`:""}</g>`; }
function clipboard(x,y){ return `<g transform="translate(${x},${y})"><rect x="0" y="0" width="150" height="190" rx="8" fill="#8a6a4a"/><rect x="10" y="14" width="130" height="168" fill="#fbf8f1"/><rect x="50" y="-6" width="50" height="16" rx="4" fill="#555"/>
  ${[0,1,2,3,4].map(i=>`<g><rect x="22" y="${34+i*28}" width="70" height="7" fill="#c8c1b4"/><circle cx="118" cy="${38+i*28}" r="7" fill="${i===3?"#45b39d":"#e05a4f"}" class="pop" style="animation-delay:${i*.4}s"/></g>`).join("")}</g>`; }
function spring(){ return `<path d="M0,215 C80,205 120,230 200,220 C280,210 320,232 400,222" stroke="#6ab7e0" stroke-width="8" fill="none" stroke-dasharray="20 20" class="water"/>`; }
function laptop(x,y,s=1,inner=""){ return `<g transform="translate(${x},${y}) scale(${s})"><rect x="0" y="0" width="120" height="76" rx="4" fill="#15171c"/><rect x="5" y="5" width="110" height="66" fill="#eef2f6"/>${inner}<path d="M-12,76 h144 l-8,8 h-128 z" fill="#2b2e35"/></g>`; }
function sheetRows(){ let g=`<rect x="5" y="5" width="110" height="10" fill="#2a6f6a"/>`; for(let r=0;r<5;r++){ g+=`<rect x="8" y="${19+r*10}" width="40" height="5" fill="#c8ccd2"/>`; for(let c=0;c<3;c++) g+=`<rect x="${54+c*20}" y="${19+r*10}" width="14" height="5" fill="${r===2&&c===2?"#e05a4f":"#9aa3ad"}" class="${r===2&&c===2?"blink":""}"/>`; } return g; }
function coins(x,y,n=5,cls=""){ let g=`<g transform="translate(${x},${y})" class="${cls}">`; for(let i=0;i<n;i++) g+=`<ellipse cx="0" cy="${-i*5}" rx="14" ry="5" fill="${i%2?"#d9a93a":"#e8bd4f"}" stroke="#a87c20" stroke-width="1"/>`; return g+`</g>`; }
function bank(x,y,s=1,name="BANK"){ return `<g transform="translate(${x},${y}) scale(${s})"><polygon points="0,-60 70,-85 140,-60" fill="#d8d2c4"/><rect x="0" y="-60" width="140" height="8" fill="#c6bfae"/>
  ${[0,1,2,3,4].map(i=>`<rect x="${10+i*27}" y="-52" width="10" height="44" fill="#e8e2d4"/>`).join("")}<rect x="-5" y="-8" width="150" height="8" fill="#c6bfae"/><text x="70" y="-66" text-anchor="middle" font-size="9" font-weight="800" fill="#6b6455" font-family="sans-serif">${name}</text></g>`; }
function ticker(y,txt){ return `<g><rect x="0" y="${y}" width="${W}" height="18" fill="#0c0d10"/><g class="tick"><text x="0" y="${y+13}" font-size="10.5" font-family="monospace" font-weight="700" fill="#5cc2b5">${txt}   ${txt}   ${txt}</text></g></g>`; }

