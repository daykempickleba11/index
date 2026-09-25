(function(){
  function burst(count=18, icons=['💖','✨','🏮','🌕','🥮']){
    for(let i=0;i<count;i++){
      const el=document.createElement('div');
      el.className='floatHeart';
      el.textContent=icons[Math.floor(Math.random()*icons.length)];
      el.style.left=(Math.random()*100)+'vw';
      el.style.fontSize=(14+Math.random()*24)+'px';
      el.style.animationDelay=(Math.random()*.45)+'s';
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),4200);
    }
  }
  function sparkAt(x,y,count=10){
    const icons=['✨','💖','⭐'];
    for(let i=0;i<count;i++){
      const s=document.createElement('div');s.className='sparkle';s.textContent=icons[i%icons.length];
      s.style.left=(x+(Math.random()-.5)*90)+'px';s.style.top=(y+(Math.random()-.5)*50)+'px';s.style.fontSize=(12+Math.random()*13)+'px';
      document.body.appendChild(s);setTimeout(()=>s.remove(),900);
    }
  }
  let toastTimer;
  function toast(msg){
    let t=document.querySelector('.toast');
    if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
    t.textContent=msg;requestAnimationFrame(()=>t.classList.add('show'));
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2200);
  }
  function chime(type='soft'){
    try{
      const C=window.AudioContext||window.webkitAudioContext; if(!C) return;
      const ctx=new C(); const now=ctx.currentTime; const notes=type==='big'?[523.25,659.25,783.99,1046.5]:[659.25,783.99];
      notes.forEach((f,i)=>{const o=ctx.createOscillator();const g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,now+i*.08);g.gain.linearRampToValueAtTime(type==='big'?.08:.045,now+i*.08+.02);g.gain.exponentialRampToValueAtTime(.001,now+i*.08+.48);o.connect(g).connect(ctx.destination);o.start(now+i*.08);o.stop(now+i*.08+.52)});
      setTimeout(()=>ctx.close(),1000);
    }catch(e){}
  }
  function progress(percent,label){
    const shell=document.createElement('div');shell.className='progressShell';
    shell.innerHTML=`<div class="progressTop"><div class="progressText">${label||'Kèo Trung Thu'} • ${percent}%</div><div class="progressTrack"><div class="progressBar" style="--progress:${percent}%"></div></div></div>`;
    document.body.prepend(shell);
  }
  function selectionFX(el,msg){
    const r=el.getBoundingClientRect(); sparkAt(r.left+r.width/2,r.top+r.height/2,12); chime(); if(msg) toast(msg);
  }
  function fireworks(duration=5200){
    const canvas=document.createElement('canvas');canvas.className='fireworks';document.body.appendChild(canvas);const ctx=canvas.getContext('2d');let w,h,dpr,parts=[];
    function size(){dpr=Math.min(2,window.devicePixelRatio||1);w=canvas.width=innerWidth*dpr;h=canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0)} size();addEventListener('resize',size);
    function boom(){const x=Math.random()*innerWidth,y=60+Math.random()*innerHeight*.52;const hue=Math.floor(Math.random()*360);for(let i=0;i<34;i++){const a=Math.random()*Math.PI*2,s=1.5+Math.random()*4.2;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,h:hue})}}
    let last=0,start=performance.now();function frame(t){ctx.fillStyle='rgba(20,7,18,.16)';ctx.fillRect(0,0,innerWidth,innerHeight);if(t-last>420){boom();last=t}parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.025;p.vx*=.99;p.life-=.015;ctx.beginPath();ctx.arc(p.x,p.y,2.1,0,Math.PI*2);ctx.fillStyle=`hsla(${p.h},90%,70%,${Math.max(0,p.life)})`;ctx.fill()});parts=parts.filter(p=>p.life>0);if(t-start<duration)requestAnimationFrame(frame);else setTimeout(()=>canvas.remove(),700)}requestAnimationFrame(frame);
  }
  window.LoveFX={burst,sparkAt,toast,chime,progress,selectionFX,fireworks};
})();
