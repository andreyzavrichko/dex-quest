'use strict';
(() => {
 const $=id=>document.getElementById(id), canvas=$('world'), ctx=canvas.getContext('2d');
 const quiz=$('quiz'), info=$('info'), win=$('win'), keys=new Set(), hero=new Image();
 hero.src='assets/hero.png';
 const dexLogo=new Image();dexLogo.src='assets/postcard.jpg';
 const journal=$('journal');let scanTime=0,scanCooldown=0,scanTarget=-1;
 const W=2600,H=620,ground=550;
 const platforms=[{x:0,y:ground,w:1350,h:70,floor:true},{x:1430,y:ground,w:445,h:70,floor:true},{x:1950,y:ground,w:650,h:70,floor:true},{x:470,y:455,w:240,h:18},{x:790,y:365,w:240,h:18},{x:1080,y:275,w:250,h:18},{x:1630,y:455,w:240,h:18},{x:1950,y:360,w:210,h:18},{x:2220,y:270,w:230,h:18},
 {x:1340,y:450,w:90,h:18,baseX:1340,amplitude:55,moving:true},{x:1880,y:455,w:90,h:18,baseX:1880,amplitude:65,moving:true},
 {x:1350,y:ground,w:80,h:14,unlock:2},{x:1875,y:ground,w:75,h:14,unlock:4}];
 const clues=[{x:290,y:514},{x:595,y:419},{x:910,y:329},{x:1205,y:239},{x:1480,y:514},{x:1760,y:419},{x:2340,y:234}];
 let player={x:110,y:ground-76,w:34,h:76,vx:0,vy:0,grounded:true,face:1};
 let started=false,finished=false,elapsed=0,mistakes=0,solved=new Set(),current=-1,nearest=-1,cam=0,viewW=1200,last=0,acc=0,walk=0,coyote=0,jumpBuffer=0;
 let jumps=0,standing=null,checkpoint={x:110,y:ground-76},checkpointId=-1,falls=0,notice='',noticeTime=0,pulse=0;
 const badges=[{x:420,y:350},{x:735,y:265},{x:1050,y:175},{x:1390,y:335},{x:1600,y:320},{x:1880,y:285},{x:2180,y:170},{x:2460,y:385}];
 const SAVE_KEY='dex-quest-v3';
 const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
 let landing=0,lean=0,trailClock=0,dustClock=0,particles=[],trails=[];
 const approach=(value,target,amount)=>value<target?Math.min(value+amount,target):Math.max(value-amount,target);
 function burst(x,y,color,count=10){if(reducedMotion)return;for(let i=0;i<count;i++){const angle=Math.PI*2*i/count;particles.push({x,y,vx:Math.cos(angle)*(45+i*7),vy:Math.sin(angle)*90-65,life:.5,maxLife:.5,color,size:2+i%3});}particles=particles.slice(-100);}
 function clearMotion(){landing=0;lean=0;trailClock=0;dustClock=0;particles=[];trails=[];}
 function animate(dt){
  landing=Math.max(0,landing-dt*4);lean=approach(lean,player.vx/350,dt*8);
  for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=180*dt;}particles=particles.filter(p=>p.life>0);
  for(const p of trails)p.life-=dt;trails=trails.filter(p=>p.life>0);
  if(reducedMotion)return;
  trailClock+=dt;dustClock+=dt;
  if(dashTime>0&&trailClock>.025){trailClock=0;trails.push({x:player.x,y:player.y,face:player.face,life:.22});}
  if(player.grounded&&Math.abs(player.vx)>120&&dustClock>.09){dustClock=0;particles.push({x:player.x+17,y:player.y+76,vx:-player.vx*.15,vy:-25,life:.25,maxLife:.25,color:'#bce6ff',size:3});}
 }

 let collected=new Set(),dashTime=0,dashCooldown=0,dashFace=1,saveClock=0,savedRun=null;
 function save(){if(!started)return;try{localStorage.setItem(SAVE_KEY,JSON.stringify({version:3,solved:[...solved],collected:[...collected],elapsed,mistakes,falls,checkpointId,finished}));}catch{}}
 function readSave(){try{const v=JSON.parse(localStorage.getItem(SAVE_KEY));
  const ids=(a,n)=>Array.isArray(a)&&a.length<=n&&new Set(a).size===a.length&&a.every(i=>Number.isInteger(i)&&i>=0&&i<n);
  if(!v||v.version!==3||!ids(v.solved,7)||!ids(v.collected,8)||!Number.isFinite(v.elapsed)||v.elapsed<0||v.elapsed>1e8||![v.mistakes,v.falls].every(n=>Number.isInteger(n)&&n>=0&&n<1e8)||!Number.isInteger(v.checkpointId)||v.checkpointId< -1||v.checkpointId>6||(v.checkpointId>=0&&!v.solved.includes(v.checkpointId))||typeof v.finished!=='boolean'||(v.finished&&v.solved.length!==7))return null;
  return v;
 }catch{return null;}}
 function restore(v){clearMotion();solved=new Set(v.solved);collected=new Set(v.collected);elapsed=v.elapsed;mistakes=v.mistakes;falls=v.falls;checkpointId=v.checkpointId;checkpoint=checkpointId<0?{x:110,y:474}:{x:clues[checkpointId].x-17,y:clues[checkpointId].y-40};player.x=checkpoint.x;player.y=checkpoint.y;player.vx=0;player.vy=0;standing=null;jumps=0;dashTime=0;dashCooldown=0;$('progress').textContent=`${solved.size} / 7 подсказок`;if(v.finished)finish();else announce('Продолжаем с последней контрольной точки.');}
 function dash(){if(blocked()||dashCooldown>0)return false;dashTime=.18;dashCooldown=1.3;dashFace=keys.has('ArrowLeft')||keys.has('KeyA')?-1:keys.has('ArrowRight')||keys.has('KeyD')?1:player.face;player.face=dashFace;player.vy=0;burst(player.x+17,player.y+40,'#a1edff',8);return true;}
 function scan(){if(blocked()||scanCooldown>0)return false;scanTarget=-1;let best=Infinity;clues.forEach((c,i)=>{const d=Math.hypot(c.x-player.x-17,c.y-player.y-38);if(!solved.has(i)&&d<best){best=d;scanTarget=i;}});scanTime=4;scanCooldown=12;announce(scanTarget<0?'Все подсказки решены. Портал находится у правого края кампуса.':`Сигнал: «${QUESTIONS[scanTarget].title}». Следуйте за голубым указателем.`);return true;}
 function openJournal(){if(!started||quiz.open||info.open||win.open||journal.open)return false;clearInput();const list=$('journal-list');list.replaceChildren();QUESTIONS.forEach((q,i)=>{const item=document.createElement('li'),title=document.createElement('strong'),detail=document.createElement('p');title.textContent=`${solved.has(i)?'✓':'○'} ${i+1}. ${q.title}`;detail.textContent=solved.has(i)?q.note:'Подсказка ещё не решена. Найдите её в кампусе.';item.append(title,detail);list.append(item);});$('badge-album').replaceChildren();badges.forEach((_,i)=>{const stamp=document.createElement('span');stamp.className='dex-stamp'+(collected.has(i)?'':' missing');stamp.setAttribute('role','img');stamp.setAttribute('aria-label',`Логотип ${i+1}: ${collected.has(i)?'собран':'не найден'}`);$('badge-album').append(stamp);});$('journal-collection').textContent=`Коллекция DEX: ${collected.size} / 8. ${collected.size===8?'Все логотипы найдены!':'Логотипы необязательны для открытия портала.'}`;journal.showModal();return true;}
 function closeJournal(){journal.close();clearInput();canvas.focus();}
 $('journal-button').onclick=openJournal;$('close-journal').onclick=closeJournal;$('scan-button').onclick=scan;journal.addEventListener('cancel',e=>{e.preventDefault();closeJournal();});
 const active=p=>!p.unlock||solved.size>=p.unlock;
 const nearPortal=()=>Math.hypot(player.x+player.w/2-2532,player.y+player.h/2-490)<85;
 function announce(message){notice=message;noticeTime=4;$('announcement').textContent=message;}
 function respawn(){clearMotion();player.x=checkpoint.x;player.y=checkpoint.y;player.vx=0;player.vy=0;player.grounded=false;standing=null;jumps=0;coyote=0;clearInput();falls++;dashTime=0;save();announce('Возврат к контрольной точке. Все ответы сохранены.');}
 const blocked=()=>!started||finished||quiz.open||info.open||win.open||journal.open||document.hidden;
 const formatTime=t=>`${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;
 function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);viewW=r.width/(r.height/H);}
 new ResizeObserver(resize).observe(canvas);
 function clearInput(){keys.clear();jumpBuffer=0;}
 function start(){if(started)return;started=true;$('intro').hidden=true;canvas.focus();if(savedRun)restore(savedRun);save();}
 function showInfo(){clearInput();if(!info.open&&!quiz.open&&!win.open&&!journal.open)info.showModal();}
 function closeQuiz(){quiz.close();clearInput();canvas.focus();}
 function interact(){if(blocked())return;if(nearPortal()){if(solved.size===clues.length)finish();else announce(`Порталу нужны все фрагменты. Осталось ${clues.length-solved.size}.`);return;}if(nearest<0)return;current=nearest;clearInput();const q=QUESTIONS[current];$('question-label').textContent=`ФРАГМЕНТ ${String(current+1).padStart(2,'0')} / ${q.title.toUpperCase()}`;$('question').textContent=q.question;$('answers').replaceChildren();$('feedback').textContent='';$('continue').hidden=true;q.answers.forEach((answer,i)=>{const b=document.createElement('button');b.className='answer';const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');b.append(n,document.createTextNode(answer));b.onclick=()=>choose(i);$('answers').append(b);});quiz.showModal();}
 function choose(index){if(!quiz.open||current<0||solved.has(current)||!Number.isInteger(index)||index<0||index>3)return false;const q=QUESTIONS[current],buttons=[...$('answers').children];if(index===q.correct){solved.add(current);
checkpointId=current;checkpoint={x:clues[current].x-17,y:clues[current].y+36-player.h};pulse=1;
const reward=solved.size===7?'Все фрагменты собраны! Войдите в портал справа.':solved.size===2?'Первый энергомост восстановлен!':solved.size===4?'Второй энергомост восстановлен!':'Контрольная точка активирована.';
announce(reward);buttons.forEach((b,i)=>{b.disabled=true;b.classList.toggle('correct',i===index);});$('feedback').style.color='#21774e';$('feedback').textContent=`Верно! ${q.note} ${reward}`;$('continue').hidden=false;$('continue').focus();$('progress').textContent=`${solved.size} / 7 подсказок`;}else{mistakes++;buttons[index].classList.add('wrong');buttons[index].disabled=true;$('feedback').style.color='#b13a34';$('feedback').textContent='Пока не сходится. Попробуйте другой ответ.';}save();return index===q.correct;}
 function finish(){finished=true;clearInput();$('final-time').textContent=formatTime(elapsed);$('final-mistakes').textContent=mistakes;$('final-falls').textContent=falls;$('final-badges').textContent=`${collected.size} / 8`;$('achievement').textContent=collected.size===8?'Исследователь DEX — все тайники найдены!':'Связь восстановлена. В кампусе ещё есть тайники!';save();win.showModal();}
 function reset(){clearMotion();journal.close();scanTime=0;scanCooldown=0;scanTarget=-1;win.close();info.close();quiz.close();savedRun=null;collected.clear();dashTime=0;dashCooldown=0;saveClock=0;solved.clear();elapsed=0;mistakes=0;finished=false;current=-1;nearest=-1;cam=0;jumps=0;standing=null;checkpoint={x:110,y:ground-76};checkpointId=-1;falls=0;notice='';noticeTime=0;pulse=0;coyote=0;platforms.filter(p=>p.moving).forEach(p=>p.x=p.baseX);player={x:110,y:ground-76,w:34,h:76,vx:0,vy:0,grounded:true,face:1};$('progress').textContent='0 / 7 подсказок';clearInput();save();canvas.focus();}
 $('start').onclick=start;$('help').onclick=showInfo;$('pause').onclick=showInfo;$('resume').onclick=()=>{info.close();clearInput();if(started)canvas.focus();};$('interact').onclick=interact;$('close-quiz').onclick=closeQuiz;$('continue').onclick=closeQuiz;$('restart').onclick=reset;
 quiz.addEventListener('cancel',e=>{e.preventDefault();closeQuiz();});win.addEventListener('cancel',e=>e.preventDefault());info.addEventListener('close',clearInput);
 const gameKeys=['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW','KeyE','ShiftLeft','ShiftRight','KeyQ','KeyJ'];
 window.addEventListener('keydown',e=>{if(gameKeys.includes(e.code)&&!quiz.open&&!info.open&&!win.open&&!journal.open){e.preventDefault();if(e.repeat)return;if(e.code==='KeyE')interact();else if(e.code==='KeyQ')scan();else if(e.code==='KeyJ')openJournal();else if(e.code.startsWith('Shift'))dash();else if(['Space','KeyW','ArrowUp'].includes(e.code)){if(!blocked())jumpBuffer=.14;}else if(!blocked())keys.add(e.code);}if(e.code==='Escape'&&started&&!blocked()){e.preventDefault();showInfo();}});
 window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{clearInput();if(started&&!blocked())showInfo();});document.addEventListener('visibilitychange',()=>{clearInput();if(document.hidden&&started&&!finished&&!quiz.open&&!info.open&&!journal.open)info.showModal();});
 document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();if(blocked())return;b.setPointerCapture(e.pointerId);if(b.dataset.key==='Space')jumpBuffer=.14;else if(b.dataset.key==='ShiftLeft')dash();else keys.add(b.dataset.key);});const release=()=>keys.delete(b.dataset.key);b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);});
 function step(dt){
  if(blocked())return;
  elapsed+=dt;scanTime=Math.max(0,scanTime-dt);scanCooldown=Math.max(0,scanCooldown-dt);dashCooldown=Math.max(0,dashCooldown-dt);dashTime=Math.max(0,dashTime-dt);saveClock+=dt;if(saveClock>=2){save();saveClock=0;}noticeTime=Math.max(0,noticeTime-dt);pulse=Math.max(0,pulse-dt*1.5);
  for(const p of platforms){if(!p.moving)continue;const previous=p.x;p.x=p.baseX+Math.sin(elapsed*1.15)*p.amplitude;if(standing===p&&player.grounded)player.x+=p.x-previous;}
  coyote=player.grounded?.1:Math.max(0,coyote-dt);jumpBuffer=Math.max(0,jumpBuffer-dt);
  const direction=Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA'));
  const wasGrounded=player.grounded;
  const targetSpeed=direction*350;
  const acceleration=direction?(player.grounded?3200:2300):(player.grounded?4800:2600);
  player.vx=dashTime>0?dashFace*850:approach(player.vx,targetSpeed,acceleration*dt);
  if(direction&&dashTime<=0)player.face=direction;
  walk+=Math.abs(player.vx)*dt*.055;
  if(jumpBuffer>0&&dashTime<=0&&(coyote>0||jumps<2)){
   const first=coyote>0;player.vy=first?-650:-590;jumps=first?1:2;player.grounded=false;standing=null;coyote=0;jumpBuffer=0;
   burst(player.x+17,player.y+76,first?'#a9d9ff':'#8affe0',first?7:12);if(!first)pulse=.6;
  }
  const prevBottom=player.y+player.h;
  player.x=Math.max(12,Math.min(W-player.w-12,player.x+player.vx*dt));if(dashTime<=0)player.vy+=1550*dt;else player.vy=0;player.y+=player.vy*dt;
  player.grounded=false;standing=null;
  if(player.vy>=0){
   const landings=platforms.filter(p=>active(p)&&player.x+player.w>p.x&&player.x<p.x+p.w&&prevBottom<=p.y+1&&player.y+player.h>=p.y).sort((a,b)=>a.y-b.y);
   if(landings.length){if(!wasGrounded&&player.vy>180){landing=Math.min(1,player.vy/800);burst(player.x+17,landings[0].y,'#bce6ff',12);}standing=landings[0];player.y=standing.y-player.h;player.vy=0;player.grounded=true;jumps=0;}
  }
  if(player.y>H+100)respawn();
  badges.forEach((c,i)=>{if(!collected.has(i)&&Math.abs(c.x-player.x-player.w/2)<30&&c.y>player.y-12&&c.y<player.y+player.h+12){collected.add(i);burst(c.x,c.y,'#ffe263',18);pulse=1;announce(collected.size===8?'Все 8 логотипов DEX! Звание «Исследователь DEX» получено.':`Логотип DEX найден: ${collected.size} / 8. Они необязательны для портала.`);save();}});
  animate(dt);
  nearest=-1;let distance=Infinity;
  clues.forEach((c,i)=>{if(solved.has(i))return;const d=Math.hypot(c.x-player.x-player.w/2,c.y-player.y-player.h/2);if(d<80&&d<distance){nearest=i;distance=d;}});
 }
 function rect(x,y,w,h,color,r=0){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
 function text(s,x,y,size,color,align='left',weight='400'){ctx.fillStyle=color;ctx.font=`${weight} ${size}px Arial`;ctx.textAlign=align;ctx.fillText(s,x,y);}
 function draw(t){const scale=canvas.height/H;ctx.setTransform(scale,0,0,scale,0,0);viewW=canvas.width/scale;cam=Math.max(0,Math.min(W-viewW,player.x-viewW*.36));const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#102653');bg.addColorStop(1,`rgb(${28+solved.size*2},${71+solved.size*5},${129+solved.size*6})`);ctx.fillStyle=bg;ctx.fillRect(0,0,viewW,H);
 // Абстрактная сетка и линии связи: визуальный язык технологического кампуса.
 ctx.strokeStyle='#ffffff07';ctx.lineWidth=1;for(let x=-(cam*.2)%60;x<viewW;x+=60){ctx.beginPath();ctx.moveTo(x,80);ctx.lineTo(x,H);ctx.stroke();}for(let y=100;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(viewW,y);ctx.stroke();}
 ctx.save();ctx.translate(-cam*.25,0);text('dex',100,275,180,'#ffffff06','left','900');text('IDEAS CONNECT HERE',850,230,45,'#ffffff06','left','700');ctx.restore();
 ctx.save();ctx.translate(-cam,0);ctx.strokeStyle='#82b4fa22';ctx.lineWidth=2;ctx.setLineDash([5,9]);ctx.beginPath();clues.forEach((c,i)=>i?ctx.lineTo(c.x,c.y):ctx.moveTo(c.x,c.y));ctx.stroke();ctx.setLineDash([]);clues.forEach((c,i)=>{if(i&&solved.has(i)&&solved.has(i-1)){ctx.strokeStyle='#8affe0';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(clues[i-1].x,clues[i-1].y);ctx.lineTo(c.x,c.y);ctx.stroke();}});
 for(let i=0;i<platforms.length;i++){
  const p=platforms[i];
  if(p.unlock&&!active(p)){ctx.strokeStyle='#84fbe644';ctx.setLineDash([4,5]);ctx.strokeRect(p.x,p.y,p.w,p.h);ctx.setLineDash([]);text(`${p.unlock} ОТВЕТА`,p.x+p.w/2,p.y+38,12,'#8dc4d4','center');continue;}
  if(p.floor){rect(p.x,p.y,p.w,p.h,'#0c2146');rect(p.x,p.y,p.w,4,'#5496e4');for(let j=p.x+20;j<p.x+p.w-24;j+=60)rect(j,p.y+24,24,3,'#1d3e6c',1);}
  else{rect(p.x,p.y+8,p.w,20,'#0b2046',6);rect(p.x,p.y,p.w,18,p.unlock?'#43b7a0':p.moving?'#8462ca':'#407fc6',5);rect(p.x+3,p.y,p.w-6,4,p.unlock?'#acffe4':p.moving?'#e1c5ff':'#8bc5fa',2);if(p.moving)text('↔',p.x+p.w/2,p.y+15,18,'#fff','center');}
 }
 text('ТОЧКА СТАРТА',75,589,12,'#749acc');text('ЛАБОРАТОРИЯ ИДЕЙ',800,180,14,'#85aedb');text('ВЫШЕ — ИНТЕРЕСНЕЕ',1945,175,14,'#85aedb');
 for(let i=0;i<clues.length;i++){const c=clues[i],done=solved.has(i),bob=done?0:Math.sin(t/700+i)*4;ctx.save();ctx.translate(c.x,c.y+bob);if(!done){const glow=ctx.createRadialGradient(0,0,5,0,0,40);glow.addColorStop(0,'#ffe36535');glow.addColorStop(1,'#ffe36500');ctx.fillStyle=glow;ctx.fillRect(-40,-40,80,80);}ctx.rotate(Math.PI/4);rect(-15,-15,30,30,done?'#2f796f':'#ffe263',5);ctx.rotate(-Math.PI/4);text(done?'✓':'?',0,6,19,done?'#b9f5d1':'#17345f','center','700');ctx.restore();if(nearest===i&&!done)text('E · ИЗУЧИТЬ',c.x,c.y-40,12,'#ffe263','center','700');}
 if(checkpointId>=0){ctx.strokeStyle='#88ffe0';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(checkpoint.x+17,checkpoint.y+76,27,7,0,0,Math.PI*2);ctx.stroke();text('ТОЧКА ВОЗВРАТА',checkpoint.x+17,checkpoint.y+104,11,'#88ffe0','center');}
 if(pulse>0){ctx.strokeStyle=`rgba(133,255,227,${pulse})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(player.x+17,player.y+50,30+(1-pulse)*20,18,0,0,Math.PI*2);ctx.stroke();}
 for(let i=0;i<badges.length;i++){if(collected.has(i))continue;const c=badges[i],y=c.y+Math.sin(t/450+i)*4;
  rect(c.x-34,y-18,68,36,'#82d6ff44',10);rect(c.x-31,y-15,62,30,'#0b96e3',7);
  if(dexLogo.complete&&dexLogo.naturalWidth)ctx.drawImage(dexLogo,940,1028,260,110,c.x-29,y-12,58,24);else text('dex',c.x,y+7,23,'white','center','900');
 }
 if(scanTime>0){const target=scanTarget<0?{x:2532,y:480}:clues[scanTarget];ctx.strokeStyle='#8eeaff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(target.x,target.y,36+Math.sin(t/150)*5,0,Math.PI*2);ctx.stroke();}
 // Короткие полупрозрачные силуэты подчёркивают рывок.
 for(const p of trails){if(!hero.complete||!hero.naturalWidth)break;ctx.save();ctx.globalAlpha=p.life/.22*.24;ctx.translate(p.x+17,p.y+76);ctx.scale(p.face*1.1,.94);ctx.drawImage(hero,-35,-86,70,90);ctx.restore();}
 for(const p of particles){ctx.save();ctx.globalAlpha=p.life/p.maxLife;rect(p.x,p.y,p.size,p.size,p.color,1);ctx.restore();}
 // Поза привязана к скорости и фазе прыжка; точка опоры остаётся у стоп.
 const running=player.grounded&&Math.abs(player.vx)>25;
 const stride=running?Math.sin(walk):0;
 const idle=player.grounded&&!running?Math.sin(elapsed*2.8):0;
 const bob=reducedMotion?0:running?-Math.abs(stride)*3:idle*1.2;
 const squash=reducedMotion?0:landing*.17;
 const stretch=reducedMotion?0:!player.grounded&&player.vy<0?.055:0;
 ctx.fillStyle='#040f2945';ctx.beginPath();ctx.ellipse(player.x+17,player.y+player.h+2,24+squash*40,5,0,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.translate(player.x+17,player.y+player.h+bob);
 if(!reducedMotion)ctx.rotate(lean*.085+(running?stride*.025:0));
 ctx.scale(player.face*(1+squash-stretch+(dashTime>0&&!reducedMotion?.08:0)),1-squash+stretch);
 if(hero.complete&&hero.naturalWidth){ctx.drawImage(hero,-35,-86,70,90);}else{rect(-17,-76,34,76,'#ef3345',10);}ctx.restore();
 // Финишный маяк становится активным после последнего ответа.
 rect(2500,ground-125,64,125,'#16345f',12);rect(2508,ground-116,48,108,solved.size===7?'#ffe263':'#47719d',8);text('DEX',2532,ground-58,16,solved.size===7?'#102653':'#acc8e8','center','700');text(solved.size===7?'E · ВОЙТИ':'НУЖНО 7 ФРАГМЕНТОВ',2532,ground-145,12,solved.size===7?'#ffe263':'#a5c3e2','center','700');
 if(solved.size===7){ctx.strokeStyle='#ffe263';ctx.lineWidth=3;ctx.strokeRect(2494,ground-131,76,131);}ctx.restore();
 $('prompt').hidden=(nearest<0&&!nearPortal())||blocked();$('interact-label').textContent=nearPortal()?(solved.size===7?'Войти в портал':'Проверить портал'):'Изучить подсказку';$('timer').textContent=formatTime(elapsed);
 $('objective').textContent=solved.size===7?'Портал открыт → Войдите в него справа':`Связь ${Math.round(solved.size/7*100)}% · Энергомосты ${Number(solved.size>=2)+Number(solved.size>=4)} / 2`;
 $('jump-charge').textContent=player.grounded?'Прыжок + прыжок в воздухе':jumps<2?'Ещё один прыжок доступен':'Приземлитесь для перезарядки';
 $('badge-count').textContent=`DEX ${collected.size} / 8`; $('dash-charge').textContent=dashCooldown>0?`Рывок: ${dashCooldown.toFixed(1)} с`:'Shift · Рывок готов';$('dash-button').disabled=dashCooldown>0||blocked();
 $('scan-button').disabled=blocked()||scanCooldown>0;$('scan-button').textContent=scanCooldown>0?`Сканер ${Math.ceil(scanCooldown)} с`:'Q · Сканер';$('journal-button').disabled=!started||finished;
 if(scanTime>0&&!blocked()){const target=scanTarget<0?{x:2532,y:480}:clues[scanTarget],dx=target.x-player.x-17,dy=target.y-player.y-38;const arrow=Math.abs(dx)<60?(dy<0?'↑':'↓'):dx<0?(dy< -70?'↖':dy>70?'↙':'←'):(dy< -70?'↗':dy>70?'↘':'→');rect(viewW/2-95,175,190,35,'#143856ee',10);text(`${arrow} ${scanTarget<0?'ПОРТАЛ':'СИГНАЛ ПОДСКАЗКИ'}`,viewW/2,198,14,'#96eeff','center','700');}
 $('announcement').hidden=noticeTime<=0||blocked();
 const mapW=Math.min(180,viewW*.28),mapX=viewW-mapW-25;rect(mapX,88,mapW,3,'#ffffff15',2);clues.forEach((c,i)=>rect(mapX+c.x/W*mapW-2,86,5,7,solved.has(i)?'#91dcbc':'#ffe263',2));rect(mapX+player.x/W*mapW-3,99,6,4,'white',2);
 }
 function frame(t){const delta=last?Math.min((t-last)/1000,.06):0;last=t;if(blocked())acc=0;else{acc+=delta;while(acc>=1/120){step(1/120);acc-=1/120;}}draw(t);requestAnimationFrame(frame);}
 savedRun=readSave();if(savedRun){$('start').textContent=savedRun.finished?'Посмотреть результат →':'Продолжить приключение →';$('save-note').textContent=`Сохранено на этом устройстве: ${savedRun.solved.length} / 7 ответов, ${savedRun.collected.length} / 8 логотипов DEX.`;$('fresh-start').hidden=false;}
 $('fresh-start').onclick=()=>{savedRun=null;start();reset();};window.addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
 resize();requestAnimationFrame(frame);
 const context=document.modelContext;if(context?.registerTool){try{Promise.resolve(context.registerTool({name:'read_quest_progress',title:'Прогресс квеста',description:'Показать количество решённых подсказок, время и состояние игры без изменения прогресса.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(input&&Object.keys(input).length)throw new Error('Параметры не поддерживаются');return{started,finished,solved:solved.size,total:clues.length,elapsedSeconds:Math.floor(elapsed),mistakes};}})).catch(()=>{});}catch{}}
})();
