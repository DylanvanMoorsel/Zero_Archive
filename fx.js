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
      setTimeout(()=>{if(left===0){toast('Alle splinters!',undefined,innerHeight*.42,true);burst(innerWidth/2,innerHeight*.42,120,15);setTimeout(finale,1700)}
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

/* ---------- finale: the Zero Point is restored, a meteor hits, Big Bang, thousands of realities ---------- */
function finale(){
  const ov=document.createElement('div');ov.className='fn-ov';ov.setAttribute('role','dialog');ov.setAttribute('aria-label','Finale: de Zero Point wordt hersteld');
  ov.innerHTML=`<canvas aria-hidden="true"></canvas><p class="fn-cap" aria-live="polite"></p><p class="fn-count" hidden></p>
   <div class="fn-end" hidden><span class="tagl">Alle 4 splinters gevonden · +1000 XP</span><h2>Het <em>Omniverse</em> is geboren</h2>
   <p>Jij bracht de splinters terug, de Zero Point werd heel, en één meteoriet later ontstonden er duizenden nieuwe realiteiten.</p>
   <div class="btns"><button class="btn y" type="button" data-a="close">Terug naar het archief</button><button class="btn w" type="button" data-a="again">Nog een keer</button></div></div>
   <button class="zi-skip" type="button" data-a="skip">Overslaan ›</button>`;
  document.body.appendChild(ov);
  const c=ov.querySelector('canvas'),g=c.getContext('2d'),capEl=ov.querySelector('.fn-cap'),cnt=ov.querySelector('.fn-count'),endEl=ov.querySelector('.fn-end');
  let W,H,D=Math.min(2,devicePixelRatio||1);const fit=()=>{W=innerWidth;H=innerHeight;c.width=W*D;c.height=H*D;g.setTransform(D,0,0,D,0,0)};fit();addEventListener('resize',fit);
  let raf=0,t0=performance.now(),ended=false,last='';
  const close=()=>{cancelAnimationFrame(raf);removeEventListener('resize',fit);ov.classList.add('out');setTimeout(()=>ov.remove(),500)};
  ov.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;const k=a.dataset.a;
    if(k==='close')close();if(k==='again'){close();setTimeout(finale,520)}if(k==='skip'){t0=performance.now()-11300}});
  addEventListener('keydown',function esc(e){if(e.key==='Escape'){removeEventListener('keydown',esc);if(ended)close();else t0=performance.now()-11300}});
  if(RM){t0=performance.now()-11300}
  const R=()=>Math.min(W,H)*.15,CX=()=>W/2,CY=()=>H*.46;
  const ease=x=>x<=0?0:x>=1?1:1-Math.pow(1-x,3),easeIn=x=>x<=0?0:x>=1?1:x*x*x,cl=x=>Math.max(0,Math.min(1,x));
  const stars=Array.from({length:240},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.4+.2,p:Math.random()*6}));
  /* broken orb: 9 jagged wedges */
  const N=9,frags=[];
  for(let i=0;i<N;i++){const a0=i/N*Math.PI*2,a1=(i+1)/N*Math.PI*2,pts=[[Math.cos((a0+a1)/2)*.08,Math.sin((a0+a1)/2)*.08]];
    for(let k=0;k<=4;k++){const a=a0+(a1-a0)*k/4,rr=k===0||k===4?1:.9+Math.random()*.16;pts.push([Math.cos(a)*rr,Math.sin(a)*rr])}
    frags.push({pts,dir:(a0+a1)/2,d0:.5+Math.random()*.55,r0:(Math.random()-.5)*.9,ph:Math.random()*6})}
  const corners=[[-.1,-.1],[1.1,-.1],[1.1,1.1],[-.1,1.1]];
  const shards=corners.map((s,i)=>({s,dl:1.0+i*.22,hit:false}));
  let rings=[],sparks=[],reals=null,flash=0,shake=0;
  const PAL=['#7fe3ff','#ffffff','#c25bff','#ff9f1c','#5bd13f','#ffe41f','#2ea8ff','#ff2e4a','#b04dff'];
  const NAMES=['Reality Zero','Reality 616','Reality 783','Reality 337','Helios','Oninoshima','Reality Unknown','The Last Reality','Springfield','Olympus'];
  const nebs=Array.from({length:6},(_,i)=>({x:Math.random(),y:Math.random(),r:.25+Math.random()*.3,c:['#3b1a8a','#0f4fd6','#7a1fd6','#1557d6','#5a14b8','#0b3aa0'][i],p:Math.random()*6}));
  const debris=Array.from({length:34},()=>({a:Math.random()*7,d:1.4+Math.random()*1.6,s:2+Math.random()*5,sp:(Math.random()-.5)*.3,rot:Math.random()*6,ph:Math.random()*6}));
  const smoke=Array.from({length:9},(_,i)=>({ox:(Math.random()-.5)*.16,oy:(Math.random()-.5)*.12,r:.05+Math.random()*.06,ph:i}));
  const tendr=Array.from({length:4},(_,i)=>({a:.3+i*.45,len:.18+Math.random()*.12,ph:Math.random()*6}));
  function backdrop(t,cx,cy,r){
    const gone=cl((t-7.55)/.7),A=1-gone,push=1+gone*2.5;
    /* nebula */
    g.globalCompositeOperation='lighter';
    for(const n of nebs){const x=(n.x+Math.sin(t*.05+n.p)*.02)*W,y=(n.y+Math.cos(t*.04+n.p)*.02)*H,rr=n.r*Math.max(W,H);
      const ng=g.createRadialGradient(x,y,0,x,y,rr);ng.addColorStop(0,n.c+(t>7.55?'66':'40'));ng.addColorStop(1,n.c+'00');g.fillStyle=ng;g.fillRect(x-rr,y-rr,rr*2,rr*2)}
    if(A<=0)return;
    /* Geno: his IO sigil looming behind everything */
    const sg=r*3.2,sa=(.16+(t>5.6&&t<7.55?.25*Math.abs(Math.sin(t*9)):0))*A;
    g.save();g.translate(cx,cy-r*.2);g.rotate(t*.08);g.globalAlpha=sa;g.strokeStyle='#ff2e4a';g.shadowColor='#ff2e4a';g.shadowBlur=20;
    g.lineWidth=6;g.beginPath();g.arc(0,0,sg,0,7);g.stroke();g.lineWidth=3;g.setLineDash([18,22]);g.beginPath();g.arc(0,0,sg*.72,0,7);g.stroke();g.setLineDash([]);
    g.lineWidth=4;g.beginPath();g.moveTo(0,-sg*1.12);g.lineTo(0,sg*1.12);g.moveTo(-sg*1.12,0);g.lineTo(sg*1.12,0);g.stroke();
    g.rotate(-t*.16);g.lineWidth=2;for(let i=0;i<12;i++){g.rotate(Math.PI/6);g.beginPath();g.moveTo(sg*.84,0);g.lineTo(sg*.94,0);g.stroke()}
    g.restore();g.globalAlpha=1;
    if(t>.4){g.globalAlpha=cl((t-.4))*A*.8;g.font='900 12px "Nunito Sans",sans-serif';g.fillStyle='#ff8a9a';g.textAlign='center';g.fillText('GENO',cx,cy-r*.2-sg-10);g.globalAlpha=1}
    /* The Last Reality: a torn purple rift with reaching tendrils (top-left) */
    const lx=W*.17-gone*W*.3,ly=H*.24-gone*H*.3,lr=Math.min(W,H)*.11;
    g.save();g.translate(lx,ly);g.globalAlpha=A;
    g.globalCompositeOperation='source-over';
    g.beginPath();for(let i=0;i<=24;i++){const a=i/24*Math.PI*2,rr=lr*(1+.18*Math.sin(a*5+t*2)+.1*Math.sin(a*11-t*3));g.lineTo(Math.cos(a)*rr*.75,Math.sin(a)*rr*1.1)}g.closePath();
    const lg=g.createRadialGradient(0,0,0,0,0,lr*1.1);lg.addColorStop(0,'#000000');lg.addColorStop(.6,'#1a0530');lg.addColorStop(1,'#5a14b8');g.fillStyle=lg;g.fill();
    g.strokeStyle='#e08bff';g.lineWidth=3;g.shadowColor='#c25bff';g.shadowBlur=22;g.stroke();g.shadowBlur=0;
    g.globalCompositeOperation='lighter';g.rotate(t*.9);g.strokeStyle='rgba(194,91,255,.5)';g.lineWidth=2;
    for(let i=0;i<3;i++){g.beginPath();g.arc(0,0,lr*(.25+i*.2),i,i+3.6);g.stroke()}
    g.restore();
    g.globalCompositeOperation='source-over';g.globalAlpha=A;
    for(const td of tendr){const a=td.a+Math.sin(t*1.3+td.ph)*.15,L=td.len*Math.max(W,H)*(.6+.4*cl(t/2)),x0=lx+Math.cos(a)*lr*.6,y0=ly+Math.sin(a)*lr*.9;
      g.strokeStyle='#14001f';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x0,y0);
      g.bezierCurveTo(x0+Math.cos(a)*L*.4+Math.sin(t*2+td.ph)*20,y0+Math.sin(a)*L*.4,x0+Math.cos(a+.4)*L*.7,y0+Math.sin(a+.4)*L*.7+Math.cos(t*1.7+td.ph)*24,x0+Math.cos(a+.2)*L,y0+Math.sin(a+.2)*L);g.stroke();
      g.strokeStyle='rgba(194,91,255,.6)';g.lineWidth=1.5;g.stroke()}
    g.globalAlpha=cl(t-.6)*A*.85;g.font='900 12px "Nunito Sans",sans-serif';g.fillStyle='#e08bff';g.textAlign='center';g.fillText('THE LAST REALITY',lx,ly+lr*1.35);
    /* Dark Presence: shapeless smoke with a red core (bottom-right) */
    const dx=W*.84+gone*W*.3,dy=H*.74+gone*H*.3,ds=Math.min(W,H);
    g.globalAlpha=A;
    for(const s of smoke){const x=dx+(s.ox+Math.sin(t*.7+s.ph)*.015)*ds,y=dy+(s.oy+Math.cos(t*.6+s.ph)*.015)*ds,rr=s.r*ds*(1+.08*Math.sin(t*1.5+s.ph));
      const sgr=g.createRadialGradient(x,y,0,x,y,rr);sgr.addColorStop(0,'rgba(20,0,8,.95)');sgr.addColorStop(1,'rgba(20,0,8,0)');g.fillStyle=sgr;g.beginPath();g.arc(x,y,rr,0,7);g.fill()}
    g.globalCompositeOperation='lighter';const pr=ds*.05*(1+.25*Math.sin(t*3));
    const rg=g.createRadialGradient(dx,dy,0,dx,dy,pr*2.2);rg.addColorStop(0,'rgba(255,46,74,.75)');rg.addColorStop(1,'rgba(255,46,74,0)');g.fillStyle=rg;g.beginPath();g.arc(dx,dy,pr*2.2,0,7);g.fill();
    g.globalAlpha=cl(t-.8)*A*.85;g.fillStyle='#ff8a9a';g.fillText('DARK PRESENCE',dx,dy+ds*.13);
    /* rocket silhouette launching in the distance */
    if(t>.2&&t<3.4){const p=easeIn(cl((t-.2)/3.2)),x=W*(.1+p*.22),y=H*(1.08-p*1.35),ang=.32;
      g.save();g.translate(x,y);g.rotate(ang);g.globalCompositeOperation='lighter';
      const fl=g.createLinearGradient(0,20,0,90);fl.addColorStop(0,'rgba(255,240,180,.95)');fl.addColorStop(1,'rgba(255,120,20,0)');g.fillStyle=fl;
      g.beginPath();g.moveTo(-9,22);g.lineTo(9,22);g.lineTo(0,90+Math.random()*20);g.closePath();g.fill();
      g.globalCompositeOperation='source-over';g.globalAlpha=1;g.fillStyle='#04060f';g.strokeStyle='rgba(127,227,255,.7)';g.lineWidth=1.5;
      g.beginPath();g.moveTo(0,-46);g.quadraticCurveTo(13,-26,12,22);g.lineTo(20,32);g.lineTo(12,26);g.lineTo(-12,26);g.lineTo(-20,32);g.lineTo(-12,22);g.quadraticCurveTo(-13,-26,0,-46);g.closePath();g.fill();g.stroke();
      g.restore();
      for(let i=0;i<2;i++)sparks.push({x:x-Math.sin(ang)*-60,y:y+Math.cos(ang)*60,vx:(Math.random()-.5)*1.5,vy:1+Math.random()*2,l:.8,c:Math.random()<.5?'#ff9f1c':'#ffe41f'})}
    /* debris floating around the broken orb, pulled in while it heals */
    const k2=ease((t-2.4)/1.8);
    g.globalCompositeOperation='source-over';
    for(const d of debris){if(k2>=1)break;const dd=r*d.d*(1-k2*.85),a=d.a+t*d.sp;const x=cx+Math.cos(a)*dd,y=cy+Math.sin(a)*dd*.8;
      g.save();g.translate(x,y);g.rotate(d.rot+t*d.sp*3);g.globalAlpha=(1-k2)*.9;g.fillStyle='#2a1f5a';g.strokeStyle='#9b6cff';g.lineWidth=1;
      g.beginPath();g.moveTo(-d.s,-d.s*.6);g.lineTo(d.s*.8,-d.s);g.lineTo(d.s,d.s*.5);g.lineTo(-d.s*.4,d.s);g.closePath();g.fill();g.stroke();g.restore()}
    g.globalAlpha=1;g.globalCompositeOperation='lighter';
  }
  function makeReals(){const M=Math.hypot(W,H)*.62;reals=[];
    for(let i=0;i<2600;i++){const big=i<NAMES.length;const a=Math.random()*Math.PI*2;
      reals.push({a,s:big?M*(.25+Math.random()*.45):M*Math.pow(Math.random(),1.6),z:big?7+Math.random()*4:.5+Math.pow(Math.random(),7)*7,c:PAL[i%PAL.length],tw:Math.random()*6,name:big?NAMES[i]:null})}}
  function ring(r,vr,col,w,life=1){rings.push({r,vr,c:col,w,life})}
  function cap(t){if(t===last)return;last=t;capEl.classList.remove('on');void capEl.offsetWidth;capEl.textContent=t;if(t)capEl.classList.add('on')}
  function shardPath(x,y,ang,s){g.save();g.translate(x,y);g.rotate(ang);g.beginPath();g.moveTo(0,-s*2.4);g.lineTo(s,0);g.lineTo(0,s*2.4);g.lineTo(-s,0);g.closePath();g.restore()}
  function frame(now){
    const t=(now-t0)/1000,cx=CX(),cy=CY(),r=R();
    /* captions */
    cap(t<1?'De Zero Point is gebroken…':t<3.8?'Jouw splinters vliegen terug':t<5.4?'De Zero Point is hersteld!':t<6.8?'…maar er komt iets aan':t<8.2?'':t<11.2?'Big Bang':'');
    g.setTransform(D,0,0,D,0,0);
    const sx=shake?(Math.random()-.5)*shake:0,sy=shake?(Math.random()-.5)*shake:0;shake*=.9;if(shake<.3)shake=0;
    g.fillStyle='#02040f';g.fillRect(0,0,W,H);
    const bg=g.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.7);bg.addColorStop(0,t>7.5?'#1a0f45':'#0b1650');bg.addColorStop(1,'#02040f');g.fillStyle=bg;g.fillRect(0,0,W,H);
    g.translate(sx,sy);
    g.globalCompositeOperation='lighter';
    for(const s of stars){g.globalAlpha=.35+.35*Math.sin(t*2+s.p);g.fillStyle='#fff';g.beginPath();g.arc(s.x*W,s.y*H,s.r,0,7);g.fill()}
    g.globalAlpha=1;
    backdrop(t,cx,cy,r);g.globalAlpha=1;g.globalCompositeOperation='lighter';
    const k=ease((t-2.4)/1.8),heal=cl((t-3.7)/.8);
    /* orb (until the explosion) */
    if(t<7.55){
      const unstable=cl((t-6.85)/.7),scale=1+unstable*.45+(unstable?Math.sin(t*60)*.04*unstable:0);
      const glowR=r*(1.6+heal*1.4+unstable*2)*scale;
      const gl=g.createRadialGradient(cx,cy,0,cx,cy,glowR);gl.addColorStop(0,unstable?'rgba(255,240,220,.9)':`rgba(127,227,255,${.15+heal*.55})`);gl.addColorStop(1,'rgba(127,227,255,0)');
      g.fillStyle=gl;g.beginPath();g.arc(cx,cy,glowR,0,7);g.fill();
      if(heal>0&&t<6.9){g.save();g.translate(cx,cy);g.rotate(t*.4);g.globalAlpha=heal*.35;for(let i=0;i<10;i++){g.rotate(Math.PI/5);g.fillStyle='#bff1ff';g.beginPath();g.moveTo(0,0);g.lineTo(-r*.12,-r*4);g.lineTo(r*.12,-r*4);g.closePath();g.fill()}g.restore();g.globalAlpha=1}
      g.globalCompositeOperation='source-over';
      for(const f of frags){const off=r*f.d0*(1-k)+(1-k)*Math.sin(t*1.4+f.ph)*r*.05,rot=f.r0*(1-k)+(1-k)*Math.sin(t*.8+f.ph)*.05;
        const fx=cx+Math.cos(f.dir)*off,fy=cy+Math.sin(f.dir)*off;
        g.save();g.translate(fx,fy);g.rotate(rot);g.scale(r*scale,r*scale);
        g.beginPath();f.pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();
        const fg=g.createRadialGradient(-.3,-.35,0,0,0,1.1);
        if(unstable){fg.addColorStop(0,'#ffffff');fg.addColorStop(.6,'#fff2c2');fg.addColorStop(1,'#ff9f1c')}
        else{fg.addColorStop(0,heal?'#ffffff':'#6a5ac8');fg.addColorStop(.5,heal?'#bff1ff':'#3b2a7a');fg.addColorStop(1,heal?'#1c8fd0':'#160d3a')}
        g.fillStyle=fg;g.fill();
        g.lineWidth=(heal?.01:.025);g.strokeStyle=heal?'rgba(255,255,255,.6)':'#c25bff';g.shadowColor='#c25bff';g.shadowBlur=heal?0:14;g.stroke();
        if(!heal&&Math.sin(t*7+f.ph)>.6){g.beginPath();g.moveTo(f.pts[0][0],f.pts[0][1]);const m=f.pts[3];g.lineTo(m[0]*.4+.05,m[1]*.4-.05);g.lineTo(m[0]*.7,m[1]*.7);g.strokeStyle='#f5dcff';g.lineWidth=.02;g.stroke()}
        g.restore()}
      g.globalCompositeOperation='lighter';
    }
    /* returning shards */
    for(const s of shards){const p=cl((t-s.dl)/1.3);if(p<=0||s.hit&&p>=1)continue;const e=easeIn(p)*.6+ease(p)*.4;
      const x0=s.s[0]*W,y0=s.s[1]*H,mx=(x0+cx)/2+(cy-y0)*.35,my=(y0+cy)/2+(x0-cx)*.35;
      const x=(1-e)*(1-e)*x0+2*(1-e)*e*mx+e*e*cx,y=(1-e)*(1-e)*y0+2*(1-e)*e*my+e*e*cy;
      const dx=2*(1-e)*(mx-x0)+2*e*(cx-mx),dy=2*(1-e)*(my-y0)+2*e*(cy-my),ang=Math.atan2(dy,dx)+Math.PI/2;
      g.strokeStyle='rgba(194,91,255,.45)';g.lineWidth=6;g.beginPath();g.moveTo(x,y);g.lineTo(x-dx*.06,y-dy*.06);g.stroke();
      g.shadowColor='#c25bff';g.shadowBlur=24;g.fillStyle='#d98bff';shardPath(x,y,ang,9);g.fill();g.shadowBlur=0;g.fillStyle='#fbeaff';shardPath(x,y,ang,4);g.fill();
      if(p>=1&&!s.hit){s.hit=true;ring(r*.9,6,'#c25bff',6);flash=Math.max(flash,.25)}}
    if(t>4.15&&t<4.3&&!rings.some(q=>q.tag))rings.push({r:r,vr:9,c:'#bff1ff',w:8,life:1,tag:1});
    /* meteor */
    if(t>5.6&&t<6.9){const p=easeIn(cl((t-5.6)/1.3)),x0=W+120,y0=-140,x=x0+(cx-x0)*p,y=y0+(cy-y0)*p,ang=Math.atan2(cy-y0,cx-x0);
      const tl=g.createLinearGradient(x,y,x-Math.cos(ang)*260,y-Math.sin(ang)*260);tl.addColorStop(0,'rgba(255,200,90,.95)');tl.addColorStop(1,'rgba(255,60,20,0)');
      g.strokeStyle=tl;g.lineWidth=22;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.lineTo(x-Math.cos(ang)*260,y-Math.sin(ang)*260);g.stroke();
      const hd=g.createRadialGradient(x,y,0,x,y,26);hd.addColorStop(0,'#fff6c2');hd.addColorStop(.5,'#ff8a1c');hd.addColorStop(1,'rgba(208,35,26,0)');g.fillStyle=hd;g.beginPath();g.arc(x,y,26,0,7);g.fill();
      for(let i=0;i<3;i++)sparks.push({x,y,vx:-Math.cos(ang)*3+(Math.random()-.5)*3,vy:-Math.sin(ang)*3+(Math.random()-.5)*3,l:1,c:Math.random()<.5?'#ff9f1c':'#ffe41f'})}
    if(t>=6.9&&!ov.dataset.hit){ov.dataset.hit=1;flash=.9;shake=22;ring(r,14,'#ffe41f',10);ring(r*.6,10,'#ff9f1c',8)}
    if(t>=7.55&&!reals){makeReals();flash=1;shake=34;ring(r,26,'#ffffff',16);ring(r,18,'#7fe3ff',12);ring(r,12,'#c25bff',10);
      for(let i=0;i<260;i++){const a=Math.random()*7,s=4+Math.random()*16;sparks.push({x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1.3,c:PAL[i%PAL.length]})}}
    /* realities */
    if(reals){const e=ease((t-7.55)/2.6),drift=(t-7.55)*.035,al=cl((t-7.55)*2.5);
      for(const q of reals){const rr=q.s*(e+drift);const x=cx+Math.cos(q.a)*rr,y=cy+Math.sin(q.a)*rr*.82;if(x<-40||x>W+40||y<-40||y>H+40)continue;
        const tw=.65+.35*Math.sin(t*3+q.tw);g.globalAlpha=al*tw;
        if(q.z>3){const bg2=g.createRadialGradient(x-q.z*.3,y-q.z*.3,0,x,y,q.z);bg2.addColorStop(0,'#ffffff');bg2.addColorStop(.35,q.c);bg2.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=bg2;g.beginPath();g.arc(x,y,q.z*1.6,0,7);g.fill();
          g.strokeStyle=q.c;g.lineWidth=1.2;g.beginPath();g.arc(x,y,q.z*1.9,0,7);g.stroke()}
        else{g.fillStyle=q.c;g.beginPath();g.arc(x,y,q.z,0,7);g.fill()}
        if(q.name&&t>8.7){g.globalCompositeOperation='source-over';g.globalAlpha=cl((t-8.7)*1.5);g.font='800 13px "Nunito Sans",sans-serif';g.fillStyle='#ffffff';g.textAlign='center';g.fillText(q.name,x,y-q.z*2.4-4);g.globalCompositeOperation='lighter'}}
      g.globalAlpha=1;
      const n=Math.floor(10000*ease((t-7.7)/3.2));cnt.hidden=false;cnt.textContent=`Realiteiten ontstaan: ${n.toLocaleString('nl-NL')}`}
    /* sparks + rings */
    sparks=sparks.filter(p=>p.l>0);for(const p of sparks){p.x+=p.vx;p.y+=p.vy;p.vx*=.96;p.vy*=.96;p.l-=.02;g.globalAlpha=cl(p.l);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,2.2,0,7);g.fill()}
    rings=rings.filter(q=>q.life>0);for(const q of rings){q.r+=q.vr;q.life-=.022;g.globalAlpha=cl(q.life);g.strokeStyle=q.c;g.lineWidth=q.w*q.life;g.beginPath();g.arc(cx,cy,q.r,0,7);g.stroke()}
    g.globalAlpha=1;g.globalCompositeOperation='source-over';
    if(flash>.01){g.setTransform(D,0,0,D,0,0);g.fillStyle=`rgba(255,255,255,${flash})`;g.fillRect(0,0,W,H);flash*=.9}
    if(t>=11.2&&!ended){ended=true;endEl.hidden=false;ov.querySelector('.zi-skip').hidden=true;give('shard:finale',1000,W/2,H*.3);endEl.querySelector('.btn').focus({preventScroll:true})}
    raf=requestAnimationFrame(frame)}
  raf=requestAnimationFrame(frame);
}
window.FX.finale=finale;
if(foot&&found.length===ALL.length){foot.insertAdjacentHTML('beforeend','<p><button class="zi-again" type="button" id="finAgain">Zero Point-finale opnieuw bekijken</button></p>');document.getElementById('finAgain').addEventListener('click',finale)}
}