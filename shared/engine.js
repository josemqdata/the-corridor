/* =====================================================================
   THE CORRIDOR — shared engine
   Each domain page defines window.CFG (story, people, art, scoring)
   and then loads this file. No AI: everything is pre-scripted.
   ===================================================================== */

/* ---------------- portraits ---------------- */
function portrait(k){
  const P=(CFG.PORTRAITS&&CFG.PORTRAITS[k])||{bg:"#333a46",skin:"#c99a72",hair:"#2b2b2b",top:"#555",extra:""};
  return `<svg viewBox="0 0 80 80"><rect width="80" height="80" fill="${P.bg}"/><path d="M10,80 q30,-30 60,0z" fill="${P.top}"/><rect x="34" y="50" width="12" height="10" fill="${P.skin}"/>
   <ellipse cx="40" cy="36" rx="15" ry="18" fill="${P.skin}"/><path d="M25,30 q15,-20 30,0" fill="${P.hair}"/>${P.extra||""}
   <circle cx="34" cy="35" r="1.8" fill="#1a1a1a"/><circle cx="46" cy="35" r="1.8" fill="#1a1a1a"/><ellipse class="mouth" cx="40" cy="46" rx="4" ry="2" fill="#5a2a22"/></svg>`;
}

/* ---------------- VOICE (browser text-to-speech) ---------------- */
const TTS={on:true,ok:("speechSynthesis" in window),voices:[]};
function loadVoices(){ try{ TTS.voices=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)); }catch(e){} }
if(TTS.ok){ loadVoices(); try{speechSynthesis.onvoiceschanged=loadVoices;}catch(e){} }
const FEM=/(female|samantha|victoria|karen|moira|tessa|serena|zira|susan|fiona|allison|ava|joanna|kendra|salli|libby|sonia|jenny|aria|emma|google us english)/i;
const MAL=/(male|daniel|alex|fred|david|mark|guy|tom|aaron|arthur|oliver|ryan|george|james|rishi|google uk english male)/i;
function pickVoice(g){ const vs=TTS.voices; if(!vs.length) return null; const re=g==="f"?FEM:MAL; const m=vs.filter(v=>re.test(v.name)&&!(g==="f"&&MAL.test(v.name)&&!FEM.test(v.name))); return m[0]||vs[0]; }
let PLAY={token:0};
function stopAll(){ PLAY.token++; try{ if(TTS.ok) speechSynthesis.cancel(); }catch(e){} clearTimeout(PLAY.timer); clearInterval(PLAY.iv); }
function setCaption(who,text){
  const cap=document.getElementById("cap"); if(!cap) return [];
  const words=text.split(" ");
  cap.innerHTML=`<div class="pt">${portrait(who)}</div><div style="flex:1"><div class="spk">${CFG.NAMES[who]||""}</div><div class="words">${words.map(w=>`<span>${w}</span>`).join(" ")}</div></div>`;
  cap.classList.add("speaking"); return [...cap.querySelectorAll(".words span")];
}
function revealAll(){ document.querySelectorAll("#cap .words span").forEach(s=>s.classList.add("on")); const c=document.getElementById("cap"); if(c) c.classList.remove("speaking"); }
function playLines(lines,onDone){
  stopAll(); const my=++PLAY.token; let i=0; const prog=document.getElementById("prog");
  const next=()=>{
    if(my!==PLAY.token) return;
    if(prog) prog.style.width=`${Math.round(i/lines.length*100)}%`;
    if(i>=lines.length){ const c=document.getElementById("cap"); if(c) c.classList.remove("speaking"); onDone&&onDone(); return; }
    const L=lines[i++]; const spans=setCaption(L.w,L.t); const words=L.t.split(" "); const est=words.length*330+600;
    const done=()=>{ if(my!==PLAY.token) return; clearTimeout(PLAY.timer); clearInterval(PLAY.iv); spans.forEach(s=>s.classList.add("on")); const c=document.getElementById("cap"); if(c) c.classList.remove("speaking"); PLAY.timer=setTimeout(next,450); };
    let w=0; PLAY.iv=setInterval(()=>{ if(w<spans.length) spans[w++].classList.add("on"); },TTS.on&&TTS.ok?300:260);
    if(TTS.on&&TTS.ok){
      try{ const u=new SpeechSynthesisUtterance(L.t); const v=CFG.VOICE[L.w]||{g:"f",p:1,r:1}; const vv=pickVoice(v.g);
        if(vv) u.voice=vv; u.lang="en-US"; u.pitch=v.p; u.rate=v.r;
        let cum=0; const starts=words.map(x=>{const s=cum; cum+=x.length+1; return s;});
        u.onboundary=(e)=>{ if(e.name&&e.name!=="word") return; const idx=starts.filter(s=>s<=e.charIndex).length; for(let k=0;k<idx&&k<spans.length;k++) spans[k].classList.add("on"); };
        u.onend=done; u.onerror=done; PLAY.timer=setTimeout(done,est*2.2+2500);
        setTimeout(()=>{ if(my===PLAY.token) speechSynthesis.speak(u); },60);
      }catch(e){ PLAY.timer=setTimeout(done,est); }
    } else PLAY.timer=setTimeout(done,est);
  };
  next();
}

/* ---------------- model ---------------- */
const COMP={stakeholder:"Stakeholder judgment",integrity:"Integrity & compliance",strategic:"Strategic thinking",pressure:"Decisions under pressure",adaptability:"Adaptability",leadership:"People leadership",safety:"Safety judgment",financial:"Data & financial reasoning"};
const STYLES={
  D:{name:"Driver",color:"var(--D)",desc:"You move toward results fast and you're not afraid to make the hard call."},
  I:{name:"Connector",color:"var(--I)",desc:"You lead through people: you show up, listen and build relationships."},
  S:{name:"Steward",color:"var(--S)",desc:"You protect stability and fairness, and you build plans people can rely on."},
  A:{name:"Analyst",color:"var(--A)",desc:"You look for the facts first and make decisions you can defend with evidence."}
};
const clamp=v=>Math.max(0,Math.min(100,v));
let S;
function newState(){ return {v:{...CFG.INIT},day:1,flags:{},set:{},earned:{},min:{},max:{},style:{D:0,I:0,S:0,A:0},log:[],infoAvail:0,infoUsed:0,times:[],variant:Math.random()<.5?"a":"b",idx:0,t0:0,infoShown:false}; }

/* ---------------- engine ---------------- */
const app=document.getElementById("app");
const meterColor=v=>v>=60?"var(--good)":v>=35?"var(--warn)":"var(--bad)";
function metersHTML(){ return `<div class="meters" id="meters">${CFG.METERS.map(m=>{const v=Math.round(m.f?m.f(S):S.v[m.k]); return `<div class="meter"><label>${m.label}</label><div class="bar"><i style="width:${v}%;background:${meterColor(v)}"></i></div></div>`;}).join("")}</div>`; }
function refreshMeters(){ const m=document.getElementById("meters"); if(m) m.outerHTML=metersHTML(); }
function topbar(right){ return `<header class="top"><a class="brand" href="../">THE CORRIDOR</a><span class="day">${right||""}</span></header>`; }

function intro(){
  const I=CFG.INTRO;
  app.innerHTML=`<div class="intro fade">${topbar(CFG.DOMAIN)}
   <div class="stage"><div class="artbox"><svg class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${CFG.ART[CFG.SCENES[0].id](newState())}</svg><div class="scene-tag">A story in ${CFG.SCENES.length} decisions</div></div></div>
   <span class="pill" style="margin-top:14px">${CFG.DOMAIN}</span><span class="pill">~15 min</span><span class="pill">🔊 Sound on</span>
   <h1>${I.title}</h1><p>${I.body}</p>
   <p style="color:var(--muted);font-size:14px">Turn your sound on. Subtitles are always shown. At the end you'll see your leadership profile.</p>
   <button class="btn" id="go">▶ Start</button></div>`;
  document.getElementById("go").onclick=()=>{ if(TTS.ok){ try{ const u=new SpeechSynthesisUtterance(" "); u.volume=0; speechSynthesis.speak(u); loadVoices(); }catch(e){} } S=newState(); render(); };
}
function stageHTML(sc){
  return `<div class="stage"><div class="artbox"><svg class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${CFG.ART[sc.id](S)}</svg>
   <div class="scene-tag">${sc.tag}</div>
   <div class="ctrls"><button id="snd" title="Sound">${TTS.on?"🔊":"🔇"}</button><button id="rep" title="Replay">↻</button><button id="skp" title="Skip">⏭</button></div>
   <div class="progress" id="prog"></div></div><div class="caption" id="cap"></div></div>`;
}
function render(){
  if(S.idx>=CFG.SCENES.length) return results();
  const sc=CFG.SCENES[S.idx]; S.day=sc.day; S.infoShown=false; if(sc.info) S.infoAvail++;
  app.innerHTML=`${topbar(`Decision ${S.idx+1} of ${CFG.SCENES.length}`)}${metersHTML()}<div class="fade">${stageHTML(sc)}</div>
    <div class="panel" id="panel"><div class="waiting"><span class="dots"><i></i><i></i><i></i></span> Listen to the scene…</div></div>`;
  window.scrollTo({top:0,behavior:"smooth"});
  document.getElementById("snd").onclick=()=>{ TTS.on=!TTS.on; document.getElementById("snd").textContent=TTS.on?"🔊":"🔇"; if(!TTS.on) try{speechSynthesis.cancel();}catch(e){} };
  document.getElementById("rep").onclick=()=>{ if(S.locked) return; playLines(sc.lines(S),()=>{ if(!S.choicesShown) showChoices(sc); }); };
  document.getElementById("skp").onclick=()=>{ stopAll(); revealAll(); const p=document.getElementById("prog"); if(p) p.style.width="100%"; if(!S.choicesShown) showChoices(sc); };
  S.choicesShown=false;
  playLines(sc.lines(S),()=>{ if(!S.choicesShown) showChoices(sc); });
}
function showChoices(sc){
  S.choicesShown=true; S.locked=false; S.t0=performance.now();
  const panel=document.getElementById("panel");
  if(sc.type==="alloc"){ panel.innerHTML=allocHTML(sc); bindAlloc(sc); return; }
  const opts=sc.options(S);
  panel.innerHTML=`${typeof sc.extra==="function"?sc.extra(S):(sc.extra||"")}<p class="prompt">WHAT DO YOU DO?</p><div class="opts">${opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${String.fromCharCode(65+i)}</span><span>${o.t}</span></button>`).join("")}</div>
    ${sc.info?`<button class="ask" id="ask">💬 ${CFG.ASK_LABEL}</button>`:""}`;
  [...panel.querySelectorAll("button.opt")].forEach((b,i)=>{ setTimeout(()=>b.classList.add("in"),80+i*110); b.onclick=()=>choose(sc,opts,i); });
  const ask=document.getElementById("ask");
  if(ask) ask.onclick=()=>{ if(S.infoShown) return; S.infoShown=true; S.infoUsed++; ask.remove(); const L=typeof sc.info==="function"?sc.info(S):sc.info; playLines([L],()=>{}); };
}
function recordComp(cmap,allOpts){
  const keys=new Set(); allOpts.forEach(o=>Object.keys(o.c||{}).forEach(k=>keys.add(k)));
  keys.forEach(k=>{ const vals=allOpts.map(o=>(o.c&&o.c[k])||0); S.min[k]=(S.min[k]||0)+Math.min(...vals); S.max[k]=(S.max[k]||0)+Math.max(...vals); S.earned[k]=(S.earned[k]||0)+((cmap&&cmap[k])||0); });
}
function applyEff(e){ for(const k in e) S.v[k]=clamp((S.v[k]||0)+e[k]); }
function addStyle(s){ for(const k in s) S.style[k]+=s[k]; }
function afterChoice(out){
  refreshMeters();
  const panel=document.getElementById("panel");
  panel.insertAdjacentHTML("beforeend",`<button class="btn" id="next" style="display:none">Continue ▸</button>`);
  document.getElementById("next").onclick=()=>{ stopAll(); S.idx++; render(); };
  document.querySelector(".stage").scrollIntoView({behavior:"smooth",block:"start"});
  playLines([N(out||"Noted.")],()=>{ const n=document.getElementById("next"); if(n){ n.style.display="inline-block"; n.scrollIntoView({behavior:"smooth",block:"nearest"}); } });
  setTimeout(()=>{ const n=document.getElementById("next"); if(n) n.style.display="inline-block"; },1200);
}
function choose(sc,opts,i){
  if(S.locked) return; S.locked=true;
  const o=opts[i]; const secs=(performance.now()-S.t0)/1000; S.times.push(secs);
  recordComp(o.c,opts); addStyle(o.s||{});
  applyEff(typeof o.eff==="function"?o.eff(S):(o.eff||{}));
  if(o.flag) S.flags[o.flag]=true; if(o.set) Object.assign(S.set,o.set);
  if(CFG.onChoose) CFG.onChoose(S,sc,o);
  S.log.push({day:sc.day,title:sc.tag.split("·")[1].trim(),choice:o.t,secs,info:S.infoShown});
  document.querySelectorAll("button.opt").forEach((b,j)=>{ b.classList.add(j===i?"pick":"dim"); b.style.pointerEvents="none"; });
  const ask=document.getElementById("ask"); if(ask) ask.remove();
  afterChoice(typeof o.out==="function"?o.out(S):o.out);
}
function allocHTML(sc){
  return `<p class="prompt">${sc.allocPrompt||"SPLIT 10 POINTS"}</p>${sc.buckets.map(b=>`<div class="alloc-row"><div class="lbl">${b.t}<small>${b.d}</small></div>
   <div class="stepper"><button data-k="${b.k}" data-d="-1">−</button><span id="v-${b.k}">0</span><button data-k="${b.k}" data-d="1">+</button></div></div>`).join("")}
   <div class="remain" id="remain">10 points left</div><button class="btn" id="confirm" disabled>Confirm plan</button>`;
}
function bindAlloc(sc){
  const v={}; sc.buckets.forEach(b=>v[b.k]=0);
  const upd=()=>{ const used=Object.values(v).reduce((a,b)=>a+b,0); for(const k in v) document.getElementById("v-"+k).textContent=v[k];
    document.getElementById("remain").textContent=`${10-used} point${10-used===1?"":"s"} left`; document.getElementById("confirm").disabled=used!==10; };
  document.querySelectorAll(".stepper button").forEach(b=>b.onclick=()=>{ const k=b.dataset.k,d=+b.dataset.d; const used=Object.values(v).reduce((a,c)=>a+c,0); if(d>0&&used>=10) return; if(d<0&&v[k]<=0) return; v[k]+=d; upd(); });
  document.getElementById("confirm").onclick=()=>{
    if(S.locked) return; S.locked=true;
    const secs=(performance.now()-S.t0)/1000; S.times.push(secs);
    const r=sc.score(v,S); // {c, ranges, style, eff, flags, out, set}
    for(const k in r.c){ S.earned[k]=(S.earned[k]||0)+r.c[k]; S.min[k]=(S.min[k]||0)+r.ranges[k][0]; S.max[k]=(S.max[k]||0)+r.ranges[k][1]; }
    addStyle(r.style||{}); applyEff(r.eff||{}); (r.flags||[]).forEach(f=>S.flags[f]=true); if(r.set) Object.assign(S.set,r.set);
    S.log.push({day:sc.day,title:sc.tag.split("·")[1].trim(),choice:sc.buckets.map(b=>`${b.short||b.t} ${v[b.k]}`).join(" · "),secs,info:false});
    document.querySelectorAll(".stepper button").forEach(b=>b.style.pointerEvents="none"); document.getElementById("confirm").remove();
    afterChoice(r.out);
  };
}

/* ---------------- results ---------------- */
const BASE_FLAGS={
  noInfo:["Never asked the team for more information before deciding.","Decisive, or acting without enough input?"],
  fast:["Decided very fast (average under 4 seconds after the options appeared).","Were they reading carefully? Check depth in the interview."]
};
function compute(){
  const score={};
  for(const k in COMP){ const mn=S.min[k]||0,mx=S.max[k]||0,e=S.earned[k]||0; score[k]=mx>mn?Math.round(clamp((e-mn)/(mx-mn)*100)):50; }
  let wsum=0,fsum=0; for(const k in CFG.TARGET){ wsum+=CFG.TARGET[k]; const r=Math.min(1,score[k]/CFG.TARGET[k]); fsum+=CFG.TARGET[k]*r*r; }
  const fit=Math.round(fsum/wsum*100);
  const avg=S.times.reduce((a,b)=>a+b,0)/S.times.length;
  if(S.infoUsed===0&&S.infoAvail>0) S.flags.noInfo=true; if(avg<4) S.flags.fast=true;
  const tot=Object.values(S.style).reduce((a,b)=>a+b,0)||1;
  const styleP=Object.fromEntries(Object.entries(S.style).map(([k,v])=>[k,Math.round(v/tot*100)]));
  const order=Object.entries(styleP).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
  return {score,fit,avg,styleP,order,balanced:styleP[order[0]]-styleP[order[1]]<=5};
}
function results(){
  stopAll();
  const FL={...CFG.FLAGS,...BASE_FLAGS};
  const R=compute(); const top3=Object.entries(R.score).filter(([k])=>k in CFG.TARGET).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const flags=Object.keys(S.flags).filter(f=>FL[f]); const strengths=Object.entries(R.score).filter(([k,v])=>v>=80&&k in CFG.TARGET).map(([k])=>COMP[k]);
  const dom=STYLES[R.order[0]],sec=STYLES[R.order[1]];
  const styleTitle=R.balanced?`${dom.name} + ${sec.name}<span style="color:var(--muted);font-weight:500;font-size:18px"> (balanced)</span>`:`${dom.name}<span style="color:var(--muted);font-weight:500;font-size:18px"> with ${sec.name} energy</span>`;
  const stat=CFG.endStat(S);
  app.innerHTML=`${topbar("Complete")}
  <div class="stage"><div class="artbox" style="aspect-ratio:16/7"><svg class="art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${CFG.endArt(S)}</svg><div class="scene-tag">${CFG.END_TAG}</div></div></div>
  <div class="tabs" style="margin-top:12px"><button class="on" data-t="c">Your profile</button><button data-t="h">Recruiter report</button></div>
  <div id="tab-c" class="panel fade" style="margin-top:0">
    <h3 style="margin-top:2px">Your leadership style</h3><h1 style="font-size:28px;margin:4px 0">${styleTitle}</h1>
    <div class="stylebar">${R.order.map(k=>`<div style="width:${R.styleP[k]}%;background:${STYLES[k].color}"></div>`).join("")}</div>
    <div class="legend">${R.order.map(k=>`<span><i style="background:${STYLES[k].color}"></i>${STYLES[k].name} ${R.styleP[k]}%</span>`).join("")}</div>
    <p class="story" style="margin-top:12px">${dom.desc} ${sec.desc.replace("You ","You also ")}</p>
    <h3>Where you stood out</h3><ul class="flags">${top3.map(([k])=>`<li>${COMP[k]}</li>`).join("")}</ul>
    <h3>How it ended</h3><p class="story">${CFG.ending(S)}</p>
    <button class="btn secondary" id="again">Play again (some events change)</button> <a class="btn secondary" href="../">Other roles</a>
  </div>
  <div id="tab-h" class="panel fade" style="display:none;margin-top:0">
    <h3 style="margin-top:2px">Recruiter report · ${CFG.DOMAIN}</h3>
    <div class="fit"><div class="num" style="color:${R.fit>=80?"var(--good)":R.fit>=60?"var(--warn)":"var(--bad)"}">${R.fit}%</div><div class="lbl">Match to the target profile for this role domain.<br>An input for the interview, not a decision.</div></div>
    <h3>Competencies vs. target</h3>
    ${Object.keys(CFG.TARGET).map(k=>{const v=R.score[k],t=CFG.TARGET[k];return `<div class="comp"><div class="row"><span>${COMP[k]}</span><b>${v}</b></div><div class="track"><div class="fill" style="width:${v}%;background:${v>=t?"var(--good)":v>=t-20?"var(--warn)":"var(--bad)"}"></div><div class="tgt" style="left:${t}%"></div></div></div>`}).join("")}
    <p class="note" style="margin-top:4px">White line = target for this role domain.</p>
    <h3>Probe in the interview</h3>
    ${flags.length?`<ul class="flags">${flags.map(f=>`<li class="${(CFG.RED_FLAGS||[]).includes(f)?"flag-red":""}"><b>${FL[f][0]}</b><br><span style="color:var(--muted)">${FL[f][1]}</span></li>`).join("")}</ul>`:`<p class="story">No flags were raised.</p>`}
    ${strengths.length?`<h3>Strengths seen</h3><p class="story">${strengths.join(" · ")}</p>`:""}
    <h3>Behavior</h3>
    <div class="stats"><div class="stat"><b>${R.avg.toFixed(0)}s</b><span>avg per decision</span></div><div class="stat"><b>${S.infoUsed}/${S.infoAvail}</b><span>asked team first</span></div><div class="stat"><b>${stat[0]}</b><span>${stat[1]}</span></div></div>
    <div class="legend" style="margin:6px 0 4px">Style: ${R.order.map(k=>`<span><i style="background:${STYLES[k].color}"></i>${STYLES[k].name} ${R.styleP[k]}%</span>`).join("")}</div>
    <h3>Decision log</h3>
    <table class="log"><tr><th>Day</th><th>Choice</th><th>Time</th></tr>${S.log.map(l=>`<tr><td>${l.day}</td><td><b>${l.title}</b><br>${l.choice}${l.info?` <span style="color:var(--accent2)">(asked team)</span>`:""}</td><td>${l.secs.toFixed(0)}s</td></tr>`).join("")}</table>
    <button class="btn" id="copy">Copy report</button> <button class="btn secondary" id="again2">Play again</button>
    <p class="note">Prototype. Scores aren't calibrated against real senior leaders yet. Voices use your device's built-in text-to-speech, so quality varies by phone.</p>
  </div>`;
  window.scrollTo({top:0});
  document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{ document.querySelectorAll(".tabs button").forEach(x=>x.classList.toggle("on",x===b));
    document.getElementById("tab-c").style.display=b.dataset.t==="c"?"":"none"; document.getElementById("tab-h").style.display=b.dataset.t==="h"?"":"none"; });
  const again=()=>{ S=newState(); render(); }; document.getElementById("again").onclick=again; document.getElementById("again2").onclick=again;
  document.getElementById("copy").onclick=async(ev)=>{
    const txt=[`THE CORRIDOR — Recruiter report (${CFG.DOMAIN})`,`Match to target: ${R.fit}%`,`Style: ${R.order.map(k=>`${STYLES[k].name} ${R.styleP[k]}%`).join(", ")}`,``,`Competencies (score / target):`,...Object.keys(CFG.TARGET).map(k=>`- ${COMP[k]}: ${R.score[k]} / ${CFG.TARGET[k]}`),``,`Probe in the interview:`,...(flags.length?flags.map(f=>`- ${FL[f][0]} → ${FL[f][1]}`):["- None"]),``,`Behavior: avg ${R.avg.toFixed(0)}s per decision; asked team ${S.infoUsed}/${S.infoAvail}; ${stat[1]}: ${stat[0]}`,``,`Decision log:`,...S.log.map(l=>`Day ${l.day} – ${l.title}: ${l.choice} (${l.secs.toFixed(0)}s)`)].join("\n");
    try{ await navigator.clipboard.writeText(txt); ev.target.textContent="Copied"; }catch(e){ ev.target.textContent="Copy not allowed here"; }
  };
}
intro();
