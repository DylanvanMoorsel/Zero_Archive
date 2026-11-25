/* Shared helpers for the sub-pages: svg gradients, rarity colours, emblems, countdown, reading bar */
{
const defs=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<radialGradient id="bg-rare" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#7fd8ff"/><stop offset="1" stop-color="#1557d6"/></radialGradient>
<radialGradient id="bg-epic" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#e08bff"/><stop offset="1" stop-color="#5a14b8"/></radialGradient>
<radialGradient id="bg-leg" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#ffd27a"/><stop offset="1" stop-color="#c8560f"/></radialGradient>
<radialGradient id="bg-unc" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#a8f57f"/><stop offset="1" stop-color="#22801f"/></radialGradient>
<radialGradient id="bg-io" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#ff8a8a"/><stop offset="1" stop-color="#8a0b1e"/></radialGradient>
<radialGradient id="bg-myth" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#fff59a"/><stop offset="1" stop-color="#d49a00"/></radialGradient>
<radialGradient id="bg-com" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#d6dde8"/><stop offset="1" stop-color="#5d6779"/></radialGradient>
<linearGradient id="metal" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#dfe6f0"/><stop offset="1" stop-color="#8b97ab"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2a0"/><stop offset="1" stop-color="#e0a000"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c98a45"/><stop offset="1" stop-color="#7a4a1e"/></linearGradient>
<linearGradient id="rock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa3b5"/><stop offset="1" stop-color="#4a5468"/></linearGradient>
<linearGradient id="cubeg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a9a"/><stop offset="1" stop-color="#b0081e"/></linearGradient>
<radialGradient id="fireg"><stop offset="0" stop-color="#fff6b0"/><stop offset=".5" stop-color="#ff8a1c"/><stop offset="1" stop-color="#d0231a"/></radialGradient>
<radialGradient id="zpg"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#bdf3ff"/><stop offset="1" stop-color="#20a8e0"/></radialGradient>
<g id="rays"><g fill="#ffffff" opacity=".13"><path d="M40 40 L36 -20 L44 -20Z"/><path d="M40 40 L36 -20 L44 -20Z" transform="rotate(45 40 40)"/><path d="M40 40 L36 -20 L44 -20Z" transform="rotate(90 40 40)"/><path d="M40 40 L36 -20 L44 -20Z" transform="rotate(135 40 40)"/><path d="M40 40 L36 -20 L44 -20Z" transform="rotate(180 40 40)"/><path d="M40 40 L36 -20 L44 -20Z" transform="rotate(225 40 40)"/><path d="M40 40 L36 -20 L44 -20Z" transform="rotate(270 40 40)"/><path d="M40 40 L36 -20 L44 -20Z" transform="rotate(315 40 40)"/></g></g>
</defs></svg>`;
document.body.insertAdjacentHTML('afterbegin',defs);

const R={rare:'var(--rare)',epic:'var(--epic)',leg:'var(--leg)',unc:'var(--unc)',io:'var(--io)',myth:'var(--myth)',com:'var(--com)'};
const RN={rare:'Rare',epic:'Epic',leg:'Legendary',unc:'Uncommon',io:'IO',myth:'Mythic',com:'Onbekend'};
const BG=r=>`<rect width="80" height="80" fill="url(#bg-${r})"/><use href="#rays" class="rays"/>`;
const SH=(x,y,w)=>`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w/4}" fill="#000" opacity=".25"/>`;
const L='stroke="#1a2040" stroke-width="2"';
/* Original emblems: symbols for each character's role, not likenesses */
const EM={
 jones:`<g class="a-spin c" style="animation-duration:6s"><polygon points="40,16 62,28 62,52 40,64 18,52 18,28" fill="url(#cubeg)" ${L}/><polygon points="40,16 62,28 40,40 18,28" fill="#ffd0d3" opacity=".8"/><path d="M40 40 V64" stroke="#1a2040" stroke-width="1.5"/></g>`,
 geno:`<circle cx="40" cy="40" r="24" fill="#120006" ${L}/><circle cx="40" cy="40" r="16" fill="none" stroke="#ff2e4a" stroke-width="2" stroke-dasharray="4 5"/><path d="M40 18 v44 M18 40 h44" stroke="#ff2e4a" stroke-width="2"/><circle class="a-pulse c" cx="40" cy="40" r="6" fill="#ff2e4a"/>`,
 hope:`<rect x="30" y="26" width="20" height="36" rx="5" fill="#b04dff" ${L}/><rect x="34" y="18" width="12" height="9" rx="2" fill="url(#metal)" ${L}/><path d="M30 38 h20" stroke="#fff" stroke-width="3"/><g class="a-pulse c"><circle cx="58" cy="20" r="4" fill="#ffe41f"/><circle cx="64" cy="30" r="3" fill="#2ea8ff"/><circle cx="56" cy="30" r="2.5" fill="#ff2e4a"/></g>`,
 slone:`<circle cx="40" cy="40" r="16" fill="url(#metal)" ${L}/><g stroke="#1a2040" stroke-width="5"><path d="M40 16 v8 M40 56 v8 M16 40 h8 M56 40 h8 M23 23 l6 6 M51 51 l6 6 M57 23 l-6 6 M23 57 l6 -6"/></g><circle cx="40" cy="40" r="6" fill="#2ea8ff"/>`,
 captainx:`<circle cx="40" cy="42" r="22" fill="url(#gold)" ${L}/><circle cx="40" cy="42" r="16" fill="none" stroke="#7a4a00" stroke-width="2"/><path d="M31 33 L49 51 M49 33 L31 51" stroke="#1a2040" stroke-width="6" stroke-linecap="round"/><path class="a-pulse c" d="M62 16 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" fill="#fff"/>`,
 voyager:`<path d="M12 46 L40 22 L68 46 L56 54 H24Z" fill="#141a2e" ${L}/><path d="M28 46 L40 34 L52 46Z" fill="#ff2e4a" opacity=".85"/><path class="a-blink" d="M30 56 L24 72 H56 L50 56Z" fill="#bff1ff" opacity=".5"/>`,
 foundation:`<rect x="22" y="22" width="36" height="40" fill="url(#rock)" ${L}/><path d="M22 34 h36 M22 48 h36 M34 22 v12 M46 34 v14 M34 48 v14" stroke="#1a2040" stroke-width="2"/><path d="M20 20 l40 44" stroke="#bff1ff" stroke-width="3" opacity=".7"/>`,
 order:`<path d="M14 40 q26 -26 52 0 q-26 26 -52 0z" fill="#fff" ${L}/><circle cx="40" cy="40" r="9" fill="#1a2040"/><circle cx="37" cy="37" r="3" fill="#fff"/>`,
 iceking:`<path d="M22 50 l4 -22 l8 10 l6 -16 l6 16 l8 -10 l4 22z" fill="#e8f8ff" stroke="#3a7ac8" stroke-width="2"/><g stroke="#3a7ac8" stroke-width="2.5"><path d="M34 60 h12 M40 54 v12 M36 56 l8 8 M44 56 l-8 8"/></g>`,
 oscar:`<path d="M40 16 v42 M28 26 h24" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><path d="M20 46 q20 26 40 0" fill="none" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><circle cx="40" cy="14" r="5" fill="none" stroke="#dfe6f0" stroke-width="4"/>`,
 singularity:`<circle cx="40" cy="40" r="20" fill="#0a0018" ${L}/><path d="M40 20 q14 20 0 40 q-14 -20 0 -40z" fill="url(#zpg)"/>`,
 looper:`<path d="M14 34 q26 -30 52 0 q-13 -6 -26 -5 q-13 -1 -26 5z" fill="#ffe41f" ${L}/><path d="M20 33 L36 58 M60 33 L44 58 M40 29 L40 56" stroke="#fff" stroke-width="1.5"/><circle cx="40" cy="60" r="6" fill="#2ea8ff" ${L}/>`,
 zp:`<circle class="a-pulse c" cx="40" cy="40" r="20" fill="url(#zpg)" stroke="#fff" stroke-width="2"/>`,
 chest:`<rect x="22" y="40" width="36" height="22" rx="2" fill="url(#wood)" ${L}/><path d="M22 41 q18 -16 36 0z" fill="#b5711f" ${L}/><rect x="22" y="45" width="36" height="4" fill="url(#gold)"/><rect x="36" y="45" width="8" height="10" rx="1" fill="url(#gold)" stroke="#7a4a00"/>`};
const tile=(r,e,s)=>`<svg viewBox="0 0 80 80" preserveAspectRatio="xMidYMid slice" aria-hidden="true" ${s||''}>${BG(r)}${SH(40,70,18)}${EM[e]||''}</svg>`;
window.FN={R,RN,BG,SH,EM,tile};

/* countdown (if present) */
const cd=document.getElementById('cd');
if(cd){const target=Date.UTC(2026,11,5,19,0,0),chh=document.getElementById('ch'),cm=document.getElementById('cm');
 const tick=()=>{const s=Math.max(0,Math.floor((target-Date.now())/1000));cd.textContent=Math.floor(s/86400);chh.textContent=Math.floor(s%86400/3600);cm.textContent=Math.floor(s%3600/60)};
 tick();setInterval(tick,15000)}
/* reading bar */
const prog=document.getElementById('prog');
if(prog){const f=()=>{const h=document.documentElement;prog.style.width=(h.scrollTop/((h.scrollHeight-h.clientHeight)||1)*100).toFixed(1)+'%'};addEventListener('scroll',f,{passive:true});f()}
/* play animations on view + hover */
const play=el=>{el.classList.remove('play');void el.offsetWidth;el.classList.add('play')};
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){play(en.target);io.unobserve(en.target)}}),{threshold:.4});
window.FN.watch=root=>root.querySelectorAll('[data-anim]').forEach(el=>{io.observe(el);el.addEventListener('mouseenter',()=>play(el))});
}
