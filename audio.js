'use strict';
// All sounds are synthesized locally; no downloads or microphone access.
window.ParkAudio=(()=>{
 let insectGain,fountainGain,fountainPan,birdPan,carouselPan,zoneBeat=0,zoneClock=0,birdLevel=1;
 let rainGain,natureBus,effectsBus,natureLevel=1,effectsLevel=1,natureDuck=1,focused=false,toneChannel='effects';
 let ctx,bus,wind,windGain,windFilter,enabled=true,playing=false,clock=0,airTime=0,gustClock=0,song=0;
 const voices=new Set(),targets=new WeakMap();
 const strength=v=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):0;
 // Each new visit starts with sound enabled; the button mutes the current visit.
 const button=()=>document.getElementById('sound-toggle');
 function ui(){button().textContent=enabled?'♫ Звук: вкл':'♫ Звук: выкл';button().setAttribute('aria-pressed',String(enabled));}
 function hold(param,t){
  if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(t);
  else{const value=param.value;param.cancelScheduledValues(t);param.setValueAtTime(value,t);}
 }
 // Replace old automation, and skip identical targets: update() runs every frame.
 function smooth(param,value,seconds){if(targets.has(param)&&Math.abs(targets.get(param)-value)<.001)return;hold(param,ctx.currentTime);param.setTargetAtTime(value,ctx.currentTime,seconds);targets.set(param,value);}
 function filter(type,frequency,q=.55){const f=ctx.createBiquadFilter();f.type=type;f.frequency.value=frequency;f.Q.value=q;return f;}
 // Stereo is a gentle cue; older engines and mono devices keep the same mix.
 function panner(destination){if(!ctx.createStereoPanner)return null;const p=ctx.createStereoPanner();p.pan.value=0;p.connect(destination);return p;}
 function movePan(p,value){if(p)smooth(p.pan,Number.isFinite(value)?Math.max(-.8,Math.min(.8,value)):0,.35);}
 function init(){
  if(ctx)return;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('Audio unavailable');
  ctx=new Audio();bus=ctx.createGain();bus.gain.value=0;
  // A gentle safety net when rewards, birds and vehicle effects overlap.
  const limiter=ctx.createDynamicsCompressor();limiter.threshold.value=-18;limiter.knee.value=12;limiter.ratio.value=3;limiter.attack.value=.012;limiter.release.value=.25;bus.connect(limiter);limiter.connect(ctx.destination);
  natureBus=ctx.createGain();effectsBus=ctx.createGain();natureBus.gain.value=natureLevel;effectsBus.gain.value=effectsLevel;
  const natureTone=filter('highshelf',2800);natureTone.gain.value=-3;
  const effectsTone=filter('lowpass',3200);
  natureBus.connect(natureTone);natureTone.connect(bus);effectsBus.connect(effectsTone);effectsTone.connect(bus);
  fountainPan=panner(natureBus);birdPan=panner(natureBus);carouselPan=panner(effectsBus);
  const buffer=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.2;
  wind=ctx.createBufferSource();wind.buffer=buffer;wind.loop=true;windFilter=filter('lowpass',650);
  windGain=ctx.createGain();windGain.gain.value=.8;wind.connect(windFilter);windFilter.connect(windGain);windGain.connect(natureBus);wind.start();
  const rain=ctx.createBufferSource();rain.buffer=buffer;rain.loop=true;
  const rainLow=filter('highpass',430),rainHigh=filter('lowpass',2700);
  rainGain=ctx.createGain();rainGain.gain.value=0;rain.connect(rainLow);rainLow.connect(rainHigh);rainHigh.connect(rainGain);rainGain.connect(natureBus);rain.start();
  const water=ctx.createBufferSource();water.buffer=buffer;water.loop=true;const waterFilter=filter('bandpass',950,.55);
  fountainGain=ctx.createGain();fountainGain.gain.value=0;water.connect(waterFilter);waterFilter.connect(fountainGain);fountainGain.connect(fountainPan||natureBus);water.start();initInsects();
 }
 // Lower, quieter chirps with soft edges and breathing room between calls.
 function initInsects(){
  const buffer=ctx.createBuffer(1,Math.round(ctx.sampleRate*8),ctx.sampleRate),data=buffer.getChannelData(0);
  const groups=[{at:.25,hz:2150,pulses:3},{at:1.45,hz:2550,pulses:2},{at:3.1,hz:1950,pulses:4},{at:4.85,hz:2300,pulses:3},{at:6.6,hz:2450,pulses:2}];
  for(const [index,group]of groups.entries())for(let pulse=0;pulse<group.pulses;pulse++){
   const start=Math.floor((group.at+pulse*.105)*ctx.sampleRate),length=Math.max(1,Math.round(.065*ctx.sampleRate));
   for(let j=0;j<length&&start+j<data.length;j++){
    const t=j/ctx.sampleRate,envelope=Math.sin(Math.PI*j/length)**2,phase=2*Math.PI*(group.hz*t+5/17*Math.sin(2*Math.PI*17*t));
    data[start+j]+=.14*(.88+.12*Math.sin(index+pulse))*envelope*(Math.sin(phase)+.12*Math.sin(phase*.985));
   }
  }
  const insects=ctx.createBufferSource();insects.buffer=buffer;insects.loop=true;const soft=filter('lowpass',2800,.5);
  insectGain=ctx.createGain();insectGain.gain.value=0;insects.connect(soft);soft.connect(insectGain);insectGain.connect(natureBus);insects.start();
 }
 async function unlock(){if(!enabled)return;try{init();await ctx.resume();}catch{enabled=false;ui();}}
 function releaseVoice(source,g,...nodes){const voice={source,g,channel:toneChannel};voices.add(voice);source.onended=()=>{voices.delete(voice);source.disconnect();g.disconnect();nodes.forEach(n=>n.disconnect());};}
 function hush(){
  playing=false;if(!ctx)return;smooth(bus.gain,0,.025);
  // Cancel delayed jingles too, so they do not resume when a dialog closes.
  for(const {source,g}of voices){hold(g.gain,ctx.currentTime);g.gain.setTargetAtTime(0,ctx.currentTime,.015);source.stop(ctx.currentTime+.08);}
 }
 async function toggle(){enabled=!enabled;ui();if(enabled)await unlock();else hush();}
 function tone(from,to,duration,volume=.09,type='sine',delay=0,holdTime=0){
  if(!ctx||!enabled||!playing||voices.size>=24)return;if(toneChannel==='birds')volume*=birdLevel*.7;if(volume<.0005)return;
  const t=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain(),attack=Math.min(.025,duration*.25);
  o.type=type;o.frequency.setValueAtTime(from,t);o.frequency.exponentialRampToValueAtTime(to,t+duration);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+attack);if(holdTime>0)g.gain.setValueAtTime(volume,t+Math.max(attack,holdTime));
  g.gain.exponentialRampToValueAtTime(.0001,t+duration);g.gain.linearRampToValueAtTime(0,t+duration+.025);
  o.connect(g);g.connect(toneChannel==='birds'?(birdPan||natureBus):toneChannel==='carousel'?(carouselPan||effectsBus):toneChannel==='nature'?natureBus:effectsBus);releaseVoice(o,g);o.start(t);o.stop(t+duration+.03);
 }
 function birds(){toneChannel='birds';try{birdsSound();}finally{toneChannel='effects';}}
 function birdsSound(){song=(song+1+Math.floor(Math.random()*3))%4;const pitch=.85+Math.random()*.25;
  if(song===0){for(let i=0;i<5;i++)tone((2100+i*70)*pitch,(2800-i*70)*pitch,.1,.15,'sine',i*.15);}
  else if(song===1){tone(1800*pitch,2600*pitch,.23,.19);tone(2800*pitch,2100*pitch,.25,.15,'sine',.34);tone(2300*pitch,2600*pitch,.12,.12,'sine',.7);}
  else if(song===2){for(let i=0;i<3;i++){tone(2800*pitch,3200*pitch,.085,.11,'sine',i*.34);tone(3200*pitch,2600*pitch,.12,.09,'sine',i*.34+.12);}}
  else{tone(1600*pitch,2200*pitch,.3,.16);tone(2200*pitch,1750*pitch,.32,.13,'sine',.38);}
 }
 function cuckoo(){toneChannel='nature';try{for(let i=0;i<2;i++){tone(780,740,.25,.19,'sine',i*.95);tone(620,575,.33,.17,'sine',i*.95+.32);}}finally{toneChannel='effects';}}
 function update(dt,active,rain=0,zones={},night=0,season={}){
  if(!ctx)return;rain=strength(rain);const grove=strength(zones.grove??.35),carousel=strength(zones.carousel),evening=strength(night),snow=strength(season.snow),cold=strength(season.cold);
  movePan(fountainPan,zones.fountainPan);movePan(birdPan,zones.grovePan);movePan(carouselPan,zones.carouselPan);
  birdLevel=(.2+grove*.8)*(1-rain*.75)*(1-evening*.97)*(1-cold*.85);
  smooth(insectGain.gain,evening*(1-rain*.85)*(1-cold)*.38,1.2);
  smooth(fountainGain.gain,strength(zones.fountain)*.85,.65);smooth(rainGain.gain,rain*1.3,.45);
  const musicFocus=!!zones.musicFocus,nextFocus=!!zones.discovery||musicFocus;
  natureDuck=musicFocus?.5:1;smooth(natureBus.gain,natureLevel*natureDuck,.18);
  if(nextFocus&&!focused)for(const voice of voices)if(['birds','carousel'].includes(voice.channel)){hold(voice.g.gain,ctx.currentTime);voice.g.gain.setTargetAtTime(0,ctx.currentTime,.025);voice.source.stop(ctx.currentTime+.12);}
  focused=nextFocus;
  const next=enabled&&active;
  if(next!==playing){if(!next){hush();return;}playing=true;smooth(bus.gain,.22,.16);}
  if(!playing)return;
  airTime+=dt;gustClock-=dt;
  if(gustClock<=0){gustClock=.3;const gust=(1+Math.sin(airTime*.37))*.5;smooth(windGain.gain,.4+gust*.65+Math.sin(airTime*1.3)*.07+rain*.5+snow*1.05,.85);smooth(windFilter.frequency,400+gust*650+snow*350,.8);}
  if(!focused)clock-=dt;if(clock<=0&&!focused){clock=3+(1-grove)*2+evening*4+Math.random()*4.5;birds();}
  zoneClock-=dt;if(zoneClock<=0){zoneClock=.65;const notes=[262,330,392,523,440,392,330,294];if(carousel>.015&&!focused){const n=notes[zoneBeat%notes.length];toneChannel='carousel';try{tone(n,n,.46,carousel*.055,'triangle');}finally{toneChannel='effects';}}zoneBeat++;}
 }
 function thunder(){toneChannel='nature';try{tone(85,45,1.65,.13,'triangle');tone(58,34,1.9,.085,'sine',.18);}finally{toneChannel='effects';}}
 function reward(){tone(523,523,.16,.23);tone(659,659,.16,.23,'sine',.15);tone(784,784,.3,.23,'sine',.3);}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hush();});window.addEventListener('blur',hush);window.addEventListener('pagehide',hush);
 function detector(distance){tone(distance<100?950:680,distance<100?950:680,.085,.085);}
 function music(beat){const notes=[262,330,392,330,349,440,392,330],n=notes[beat%notes.length];tone(n,n,.25,.14,'triangle');}
 // A struck metal shell: stable inharmonic partials, beating and a second softer strike.
 let bicycleBellBuffer=null;
 function bicycleBell(){
  if(!ctx||!enabled||!playing||voices.size>=24)return;
  if(!bicycleBellBuffer){
   bicycleBellBuffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*1.65),ctx.sampleRate);const data=bicycleBellBuffer.getChannelData(0);
   const modes=[[1680,.5,.38],[1687,.18,.34],[2345,.2,.23],[3450,.085,.14],[4670,.025,.07]];
   for(let i=0;i<data.length;i++){const time=i/ctx.sampleRate;let value=0;for(const [at,force]of [[0,1],[.19,.7]]){const t=time-at;if(t<0)continue;const attack=1-Math.exp(-t/.0018);for(const [hz,level,decay]of modes)value+=force*level*attack*Math.exp(-t/decay)*Math.sin(2*Math.PI*hz*t);value+=force*.035*Math.exp(-t/.008)*Math.sin(2*Math.PI*6100*t);}data[i]=value*Math.min(1,(1.65-time)/.06);}
  }
  const t=ctx.currentTime,source=ctx.createBufferSource(),g=ctx.createGain();source.buffer=bicycleBellBuffer;
  g.gain.setValueAtTime(.24,t);source.connect(g);g.connect(effectsBus);releaseVoice(source,g);source.start(t);source.stop(t+1.66);
 }
 function stoneSplash(index=0){tone(620-index*55,240-index*15,.11,.045,'sine');}

 function horn(){tone(330,330,1.2,.27,'triangle',0,.9);tone(440,440,1.2,.18,'triangle',0,.9);}
 function shutter(){tone(1100,650,.045,.09,'triangle');tone(650,350,.06,.06,'triangle',.055);}
 function snowCrunch(){
  if(!ctx||!enabled||!playing||voices.size>=24)return;const t=ctx.currentTime,source=ctx.createBufferSource(),f=filter('bandpass',900,.55),g=ctx.createGain();
  source.buffer=wind.buffer;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.3,t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+.11);g.gain.linearRampToValueAtTime(0,t+.12);
  source.connect(f);f.connect(g);g.connect(effectsBus);releaseVoice(source,g,f);source.start(t,.2,.12);
 }
 function footstep(surface){
  if(surface==='snow'){snowCrunch();return;}
  if(!ctx||!enabled||!playing||voices.size>=22)return;
  const settings={path:[430,.14,.075],grass:[1100,.18,.13],wood:[310,.16,.085],leaves:[1600,.21,.17]};
  const [hz,volume,duration]=settings[surface]||settings.grass,t=ctx.currentTime,source=ctx.createBufferSource(),f=filter('lowpass',hz*(.92+Math.random()*.16),.5),g=ctx.createGain();
  source.buffer=wind.buffer;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(volume,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);g.gain.linearRampToValueAtTime(0,t+duration+.01);
  source.connect(f);f.connect(g);g.connect(effectsBus);releaseVoice(source,g,f);source.start(t,Math.random()*2,duration+.01);
  if(surface==='wood')tone(165+Math.random()*20,95,.09,.028,'sine');
  else if(surface==='path')tone(100+Math.random()*12,65,.065,.022,'sine');
 }
 function bubblePop(){tone(520,250,.095,.07,'sine');}
 function fountainNote(beat,volume=1){const notes=[392,494,587,784,659,587,494,440,523,659,784,880,784,659,587,494,440,494,587,392],n=notes[beat%notes.length];tone(n,n,.5,.105*strength(volume),'triangle');}
 function wheelNote(beat,volume=1){const notes=[262,330,392,523,440,392,330,294,262,349,440,523,494,440,392,330,294,330,392,262,330,392,523,392,330,294,262,262],n=notes[beat%notes.length];tone(n,n,.58,.085*strength(volume),'sine');}
 function starlight(){for(const [i,hz]of [392,494,587].entries())tone(hz,hz,.6,.07,'sine',i*.19);}
 function dawnBirds(){toneChannel='nature';try{tone(1250,1650,.18,.06,'sine');tone(1500,1180,.24,.045,'sine',.27);tone(1380,1720,.16,.035,'sine',.67);}finally{toneChannel='effects';}}
 function compressor(){tone(95,105,.5,.12,'triangle');tone(190,205,.48,.035,'sine',.02);}
 function fairNote(beat,volume=1){const notes=[330,392,440,494,440,392,330,294,330,392,523,494,440,392,330,294],hz=notes[beat%notes.length];tone(hz,hz,.28,.055*strength(volume),'triangle');tone(hz*2,hz*2,.12,.012*strength(volume),'sine');}
 function setLevels(n,e){natureLevel=strength(n);effectsLevel=strength(e);if(ctx){smooth(natureBus.gain,natureLevel*natureDuck,.12);smooth(effectsBus.gain,effectsLevel,.12);}}
 function fairFanfare(beat){const notes=[392,494,587,494,659,587,784];if(!Number.isInteger(beat)||beat<0||beat>=notes.length)return;const hz=notes[beat];tone(hz,hz,.4,.075,'triangle');tone(hz/2,hz/2,.45,.035,'sine');}
 const pathPitches=[261.63,293.66,329.63,349.23,392,440,493.88,523.25];
 function echoBird(note){const notes=pathPitches;if(!Number.isInteger(note)||note<0||note>=notes.length)return;toneChannel='nature';try{const hz=notes[note]*2;tone(hz*1.025,hz,.3,.052,'sine');tone(hz,hz*.99,.19,.025,'sine',.18);}finally{toneChannel='effects';}}
 function pathNote(note,volume=1){const notes=pathPitches;if(!Number.isInteger(note)||note<0||note>=notes.length)return;const hz=notes[note];tone(hz,hz,.56,.085*strength(volume),'sine');tone(hz*3,hz*3,.13,.018*strength(volume),'sine');}
 function catMeow(volume=1){const v=strength(volume);tone(480,650,.18,.07*v,'sine');tone(650,360,.36,.05*v,'sine',.15);tone(960,720,.3,.009*v,'sine',.12);}
 // Paired plucked strings: slight beating, quickly fading upper partials, a warm body.
 // PCM is cached per pitch; soft edges avoid clicks even on small phone speakers.
 // Each beat starts only when requested; pause/mute uses the shared voice cleanup.
 const balalaikaBuffers=new Map();
 function balalaikaNote(beat,volume=1){
  if(!Number.isInteger(beat)||beat<0||beat>=16||!ctx||!enabled||!playing||voices.size>=22)return;
  const level=strength(volume);if(!level)return;
  const notes=[330,392,440,392,330,294,330,247,330,392,494,440,392,330,294,330],hz=notes[beat];
  let buffer=balalaikaBuffers.get(hz);
  if(!buffer){
   buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.6),ctx.sampleRate);const data=buffer.getChannelData(0);
   for(let i=0;i<data.length;i++){const t=i/ctx.sampleRate,attack=1-Math.exp(-t/.004),tail=Math.max(0,Math.min(1,(.6-t)/.04));let sample=0;
    for(let harmonic=1;harmonic<=6;harmonic++){
     const phase=2*Math.PI*hz*harmonic*t,decay=Math.exp(-t*(5+harmonic*3)),level=1/(harmonic**1.7);
     sample+=(Math.sin(phase)*.62+Math.sin(phase*1.003)*.38)*decay*level;
    }
    sample+=.1*Math.sin(2*Math.PI*165*t)*Math.exp(-t*14);
    data[i]=sample*attack*tail*.68;
   }balalaikaBuffers.set(hz,buffer);
  }
  const source=ctx.createBufferSource(),g=ctx.createGain(),t=ctx.currentTime;source.buffer=buffer;g.gain.setValueAtTime(.18*level,t);source.connect(g);g.connect(effectsBus);releaseVoice(source,g);source.start(t);source.stop(t+.61);
  if(beat%2===0)tone(180,105,.075,.025*level,'sine');
 }
 return{balalaikaNote,echoBird,catMeow,pathNote,fairFanfare,fairNote,stoneSplash,bicycleBell,starlight,dawnBirds,wheelNote,footstep,bubblePop,snowCrunch,fountainNote,setLevels,horn,shutter,compressor,toggle,unlock,update,reward,cuckoo,ui,detector,music,thunder};
})();
