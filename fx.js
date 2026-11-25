/* Zero Archive effects: intro, particles, confetti, tilt, reveal, XP + levels. All off under reduced motion. */
{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(pointer: fine)').matches;
const COLS=['#ffffff','#bff1ff','#7fe3ff','#38a8ff','#c25bff','#b04dff','#8c6cff','#7fe3ff'];
const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const ss={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};

/* ---------- particle canvas: Zero Point shards, rift sparks, shockwaves ---------- */
const ZP=['#ffffff','#bff1ff','#7fe3ff','#38a8ff'],RIFT=['#c25bff','#b04dff','#8c6cff','#7fe3ff'];
const cv=document.createElement('canvas');cv.className='fx-canvas';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
const cx=cv.getContext('2d');let P=[],running=false,DPR=Math.min(2,devicePixelRatio||1);
function size(){cv.width=innerWidth*DPR;cv.height=innerHeight*DPR;cx.setTransform(DPR,0,0,DPR,0,0)}
size();addEventListener('resize',size);
const pick=a=>a[(Math.random()*a.length)|0];
function draw(p){
  cx.globalAlpha=Math.max(0,Math.min(1,p.life));
  if(p.t==='ring'){cx.strokeStyle=p.c;cx.lineWidth=p.w*p.life;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.stroke();return}
  if(p.t==='spark'){cx.strokeStyle=p.c;cx.lineWidth=p.r;cx.lineCap='round';cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x-p.vx*4,p.y-p.vy*4);cx.stroke();return}
  if(p.t==='dust'){cx.fillStyle=p.c;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill();return}
  /* shard: long diamond pointing along its spin */
  cx.save();cx.translate(p.x,p.y);cx.rotate(p.rot);cx.shadowColor='#7fe3ff';cx.shadowBlur=12;
  cx.fillStyle=p.c;cx.beginPath();cx.moveTo(0,-p.r*2.2);cx.lineTo(p.r,0);cx.lineTo(0,p.r*2.2);cx.lineTo(-p.r,0);cx.closePath();cx.fill();
  cx.shadowBlur=0;cx.fillStyle='rgba(255,255,255,.85)';cx.beginPath();cx.moveTo(0,-p.r*2.2);cx.lineTo(p.r*.35,0);cx.lineTo(0,p.r*.6);cx.closePath();cx.fill();cx.restore();
}
function loop(){
  cx.clearRect(0,0,innerWidth,innerHeight);cx.globalCompositeOperation='lighter';
  P=P.filter(p=>p.life>0);
  for(const p of P){p.life-=p.decay;
    if(p.t==='ring'){p.r+=p.vr}else{p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=p.f;p.vy*=p.f;p.rot+=p.vr}
    draw(p)}
  cx.globalAlpha=1;cx.globalCompositeOperation='source-over';
  if(P.length)requestAnimationFrame(loop);else running=false;
}
function kick(){if(!running){running=true;requestAnimationFrame(loop)}}
function burst(x,y,n=36,power=9){if(RM)return;if(P.length>420)P.splice(0,P.length-300);
  P.push({t:'ring',x,y,r:6,vr:power*.9,w:5,life:1,decay:.035,c:'#bff1ff'},{t:'ring',x,y,r:2,vr:power*.6,w:3,life:1,decay:.03,c:'#c25bff'});
  for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=power*(.3+Math.random()*.85),k=Math.random();
    const base={x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,f:.955,g:-.02,rot:Math.random()*6,vr:(Math.random()-.5)*.3,life:1,decay:.014+Math.random()*.014};
    if(k<.45)P.push({...base,t:'shard',r:3+Math.random()*3.5,c:pick(ZP),g:.03});
    else if(k<.8)P.push({...base,t:'spark',r:1.6+Math.random()*1.6,c:pick(RIFT),f:.94});
    else P.push({...base,t:'dust',r:1.5+Math.random()*2,c:pick(ZP),decay:.01+Math.random()*.01})}
  kick()}
window.FX={burst};
let last=0;
if(FINE&&!RM)addEventListener('pointermove',e=>{const t=performance.now();if(t-last<26)return;last=t;
  const sh=Math.random()<.3;
  P.push({t:sh?'shard':'dust',x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*1,vy:-.4-Math.random()*.8,g:-.01,f:.98,r:sh?2.2:1.6+Math.random()*1.4,rot:Math.random()*6,vr:.06,life:.9,decay:.028,c:sh?pick(ZP):pick(Math.random()<.5?ZP:RIFT)});kick()},{passive:true});

/* ---------- XP + levels ---------- */
const nav=document.querySelector('nav .wrap');
let xp=store.get('zaXP',0),got=store.get('zaGot',{});
const lvl=x=>Math.floor(x/1000)+1;
let badge=null,fill=null;
if(nav){nav.insertAdjacentHTML('beforeend',`<div class="xp" title="Je lore-XP"><b id="lvB">LV ${lvl(xp)}</b><span class="xpbar"><i id="xpF"></i></span><small id="xpN">${xp%1000}/1000 XP</small></div>`);
  badge=document.getElementById('lvB');fill=document.getElementById('xpF');}
function draw(){if(!fill)return;fill.style.width=(xp%1000)/10+'%';badge.textContent='LV '+lvl(xp);document.getElementById('xpN').textContent=(xp%1000)+'/1000 XP'}
draw();
function toast(txt,x,y,big){const t=document.createElement('div');t.className='fx-toast'+(big?' big':'');t.textContent=txt;
  t.style.left=(x??innerWidth/2)+'px';t.style.top=(y??innerHeight/2)+'px';document.body.appendChild(t);setTimeout(()=>t.remove(),big?2200:1300)}
function give(key,amt,x,y){if(got[key])return;got[key]=1;store.set('zaGot',got);
  const before=lvl(xp);xp+=amt;store.set('zaXP',xp);draw();
  if(badge){badge.classList.remove('pop');void badge.offsetWidth;badge.classList.add('pop')}
  toast('+'+amt+' XP',x,y);
  if(lvl(xp)>before){setTimeout(()=>{toast('Level '+lvl(xp)+'!',undefined,innerHeight*.42,true);burst(innerWidth/2,innerHeight*.42,90,14)},350)}}
window.FX.give=give;
const page=location.pathname.split('/').pop()||'index.html';
/* reading XP: every 20% of a page */
addEventListener('scroll',()=>{const h=document.documentElement;const p=h.scrollTop/((h.scrollHeight-h.clientHeight)||1);
  for(let m=1;m<=5;m++)if(p>=m*.2-.01)give(page+':read'+m,60,innerWidth-120,90)},{passive:true});
/* interaction XP */
document.addEventListener('click',e=>{const x=e.clientX,y=e.clientY;
  const tab=e.target.closest('[role=tab]');if(tab)give(page+':tab'+tab.textContent,100,x,y);
  const sum=e.target.closest('summary');if(sum)give(page+':story'+(sum.closest('[id]')||{}).id,150,x,y);
  const w=e.target.closest('a.wiki');if(w)give('wiki'+w.href,50,x,y);
  const chip=e.target.closest('.chips button');if(chip)give(page+':chip'+chip.dataset.f,40,x,y);
  const btn=e.target.closest('.btn,.tabs button,.chips button,.wiki');if(btn)burst(x,y,28,8);
  const li=e.target.closest('.tl li');if(li)give(page+':tile'+li.querySelector('h3').textContent,30,x,y);
});
document.addEventListener('change',e=>{if(e.target.matches('.check input')&&e.target.checked){const r=e.target.getBoundingClientRect();give('check'+e.target.id,100,r.left+20,r.top);burst(r.left+10,r.top+10,24,7)}});


/* ---------- shard hunt: one hidden Zero Point sliver per page ---------- */
const SPOTS={'index.html':['#seven .wrap','right:0;top:-10px'],'out-of-time.html':['.hero .fig','right:2%;top:2%'],'personages.html':['#chars','right:-6px;top:-70px'],'quiz.html':['#quiz .wrap','right:0;top:-20px']};
const ALL=Object.keys(SPOTS);
let found=store.get('zaShardPages',[]);
if(nav)nav.querySelector('.xp').insertAdjacentHTML('afterbegin',`<span class="shc" id="shc" title="Gevonden Zero Point-splinters">◆ ${found.length}/${ALL.length}</span>`);
const shc=document.getElementById('shc');
const spot=SPOTS[page];
if(spot&&!found.includes(page)){const host=document.querySelector(spot[0]);
  if(host){if(getComputedStyle(host).position==='static')host.style.position='relative';
    const b=document.createElement('button');b.type='button';b.className='shardbtn';b.style.cssText=spot[1];b.setAttribute('aria-label','Pak de Zero Point-splinter');
    b.innerHTML=`<svg viewBox="0 0 120 200" aria-hidden="true"><defs>
      <linearGradient id="psh1" x1="0" x2="1"><stop offset="0" stop-color="#fbeaff"/><stop offset=".5" stop-color="#e2a8ff"/><stop offset="1" stop-color="#9b4dff"/></linearGradient>
      <linearGradient id="psh2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d98bff"/><stop offset=".6" stop-color="#8c2cf0"/><stop offset="1" stop-color="#3a0a8a"/></linearGradient>
      <radialGradient id="psh3"><stop offset="0" stop-color="#e2a8ff" stop-opacity=".85"/><stop offset="1" stop-color="#b04dff" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="60" cy="100" rx="58" ry="92" fill="url(#psh3)"/>
      <polygon points="60,6 94,66 76,190 44,190 26,66" fill="url(#psh2)" stroke="#f5dcff" stroke-width="3"/>
      <polygon points="60,6 94,66 60,90" fill="url(#psh1)"/><polygon points="60,6 26,66 60,90" fill="#fbeaff"/>
      <polygon points="60,90 94,66 76,190" fill="#7a1fd6" opacity=".85"/><polygon points="60,90 26,66 44,190" fill="#c25bff" opacity=".75"/>
      <path d="M60 90 L60 186" stroke="#f5dcff" stroke-width="1.5" opacity=".6"/>
      <path d="M44 38 L52 27" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg><span>Pak de splinter</span>`;
    host.appendChild(b);
    b.addEventListener('click',()=>{if(b.classList.contains('gone'))return;const r=b.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
      burst(x,y,130,16);setTimeout(()=>burst(x,y,60,9),180);
      found=[...new Set([...found,page])];store.set('zaShardPages',found);if(shc){shc.textContent=`◆ ${found.length}/${ALL.length}`;shc.classList.remove('pop');void shc.offsetWidth;shc.classList.add('pop')}
      give('shard:'+page,250,x,y-60);b.classList.add('gone');b.querySelector('span').textContent='Splinter gevonden!';
      const left=ALL.length-found.length;
      setTimeout(()=>{if(left===0){toast('Alle splinters!',undefined,innerHeight*.42,true);for(let k=0;k<4;k++)setTimeout(()=>burst(innerWidth*(.2+Math.random()*.6),innerHeight*(.3+Math.random()*.3),120,15),k*300);give('shard:all',500,innerWidth/2,innerHeight*.55)}
        else toast(`Nog ${left} splinter${left>1?'s':''} verstopt op andere pagina's`,innerWidth/2,innerHeight*.7)},900);
      setTimeout(()=>b.remove(),1400)});
  }}

/* ---------- reveal on scroll + count-up ---------- */
const SEL='h2,.card,.item,.tl li,.q,.ev,.fact,.tldr li,.steps li,.panel,.char,.who a,.mem,.gl div';
const rio=!RM&&'IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');rio.unobserve(en.target);count(en.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'}):null;
function tag(root){if(!rio)return;root.querySelectorAll(SEL).forEach(el=>{if(el.classList.contains('fx-rev'))return;
  const sib=[...el.parentElement.children].indexOf(el);el.style.setProperty('--d',Math.min(sib,8)*70+'ms');el.classList.add('fx-rev');rio.observe(el)})}
function count(el){const b=el.matches('.fact')&&el.querySelector('b');if(!b||b.dataset.done)return;b.dataset.done=1;
  const m=b.textContent.match(/^([\d.,]+)(.*)$/);if(!m)return;const raw=m[1],suf=m[2],dec=raw.includes(',')?1:0,target=parseFloat(raw.replace(/\./g,'').replace(',','.'));
  const t0=performance.now(),D=1200;const step=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3),v=target*e;
    b.textContent=(dec?v.toFixed(1).replace('.',','):Math.round(v))+suf;if(k<1)requestAnimationFrame(step);else b.textContent=raw+suf};requestAnimationFrame(step)}
tag(document);
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1){tag(n.parentElement||n);if(n.closest&&n.closest('#panel')){const pn=document.getElementById('panel');pn.classList.remove('fx-swap');void pn.offsetWidth;pn.classList.add('fx-swap')}}}))).observe(document.body,{childList:true,subtree:true});

/* ---------- tilt + shine ---------- */
const TILT='.card,.item,.q,.ev,.fact,.who a,.tl li,.char .top,.mem,.panel';
if(FINE&&!RM){
  document.addEventListener('pointermove',e=>{const el=e.target.closest(TILT);document.querySelectorAll('.fx-tilt-on').forEach(o=>{if(o!==el){o.classList.remove('fx-tilt-on');o.style.removeProperty('--rx');o.style.removeProperty('--ry')}});
    if(!el)return;const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
    el.classList.add('fx-tilt','fx-tilt-on');el.style.setProperty('--rx',(-py*7).toFixed(2)+'deg');el.style.setProperty('--ry',(px*9).toFixed(2)+'deg');el.style.setProperty('--mx',(px+.5)*100+'%')},{passive:true});
}

/* ---------- hero sky: floating shards ---------- */
const hero=document.querySelector('.hero');
if(hero&&!RM){const sky=document.createElement('div');sky.className='fx-sky';sky.setAttribute('aria-hidden','true');
  sky.innerHTML=Array.from({length:22},(_,i)=>`<i style="left:${(i*47)%100}%;animation-delay:${-(i*.73)%9}s;animation-duration:${7+(i%5)*1.6}s;--s:${.5+(i%4)*.3};--c:${COLS[i%COLS.length]}"></i>`).join('');
  hero.prepend(sky)}

/* ---------- countdown bounce ---------- */
['cd','ch','cm'].forEach(id=>{const el=document.getElementById(id);if(!el)return;const box=el.parentElement;
  new MutationObserver(()=>{box.classList.remove('bump');void box.offsetWidth;box.classList.add('bump')}).observe(el,{childList:true,characterData:true,subtree:true})});

/* ---------- intro: the Zero Point opens ---------- */
function intro(){
  const o=document.createElement('div');o.className='fx-intro';o.setAttribute('role','presentation');
  o.innerHTML=`<div class="zi-stage" aria-hidden="true">
    <div class="zi-ring r1"></div><div class="zi-ring r2"></div><div class="zi-ring r3"></div>
    <div class="zi-loop"></div>
    <div class="zi-orb"></div>
    ${Array.from({length:12},(_,i)=>`<span class="zi-shard" style="--a:${i*30}deg;--dl:${.9+i*.02}s"></span>`).join('')}
    <div class="zi-title"><b>Zero</b> <em>Archive</em></div>
    <div class="zi-sub">Het hele verhaal van Fortnite</div>
  </div><div class="zi-flash"></div><button class="zi-skip" type="button">Overslaan ›</button>`;
  document.body.appendChild(o);document.documentElement.classList.remove('intro-on');
  let done=false;const end=()=>{if(done)return;done=true;o.classList.add('out');setTimeout(()=>o.remove(),700);ss.set('zaIntro','1');
    setTimeout(()=>{burst(innerWidth/2,innerHeight*.38,110,15);give('intro',100,innerWidth/2,innerHeight*.5)},250)};
  o.querySelector('.zi-skip').addEventListener('click',end);o.addEventListener('click',e=>{if(!e.target.closest('.zi-skip'))end()});
  addEventListener('keydown',function k(e){if(e.key==='Escape'||e.key===' '){end();removeEventListener('keydown',k)}});
  setTimeout(()=>{if(!done)burst(innerWidth/2,innerHeight/2,70,12)},1050);
  setTimeout(end,3300);
}
if(!RM&&!ss.get('zaIntro'))intro();else document.documentElement.classList.remove('intro-on');
const foot=document.querySelector('footer .wrap');
if(foot&&!RM){foot.insertAdjacentHTML('beforeend','<p><button class="zi-again" type="button">Intro opnieuw afspelen</button></p>');
  foot.querySelector('.zi-again').addEventListener('click',()=>{scrollTo(0,0);intro()})}
}
