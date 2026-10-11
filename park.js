'use strict';
(() => {
 const $=id=>document.getElementById(id),canvas=$('world');let ctx=canvas.getContext('2d');
 const quiz=$('quiz'),info=$('info'),win=$('win'),journal=$('journal'),activity=$('activity');
 const T=32,COLS=96,ROWS=76,W=COLS*T,H=ROWS*T,SAVE_KEY='dex-park-v1';
 const stick={x:0,y:0,pointer:null};
 let touchLayoutDirty=true;
 const keys=new Set(),solved=new Set(),collected=new Set(),discovered=new Set();
 const ACHIEVEMENTS=[['nutEncore','На бис — за орех','Верните белке орех после лесного концерта.'],['forestConcert','Лесной меломан','Послушайте медведя с балалайкой и белку с ореховым барабаном.'],['picnicRescue','Всё в корзину','Спасите пикник от порыва ветра.'],['dandelionWish','По ветру','Загадайте желание на одуванчиковой поляне.'],
 ['melodyEcho','Ноги помнят музыку','Повторите четыре ноты на музыкальной дорожке.'],
 ['catSeeker','Мур-сыщик','Найдите Рыжика в трёх укрытиях.'],
  ['musicPath','Прогулка в мажоре','Пройдите по всем восьми музыкальным плиткам северной аллеи.'],
 ['fair-champion','Чемпион парковой олимпиады','Выиграйте в мешках, канате и кольцебросе. Любой темп подходит.'],
 ['fair-music','Музыка объединяет','Послушайте семейный концерт на северо-западной ярмарке.'],
 ['fair-sacks','Прыжок в выходные','Выиграйте забег в мешках на ярмарке.'],
 ['fair-rope','Одна команда','Победите в перетягивании каната.'],
 ['fair-rings','Точное попадание','Набросьте четыре кольца за одну игру.'],
 ['groupPortrait','Вся компания в сборе','Сделайте общий снимок с друзьями парка.'],
 ['lastMile','Последняя миля','Проводите робота-курьера к кафе.'],
 ['warmParking','Тёплое место','Погладьте кошку, устроившуюся на капоте BMW.'],
 ['quietNeighbour','Тихий сосед','Понаблюдайте за ёжиком вечером, не пугая его.'],
 ['dexStars','Звёзды сошлись','Увидьте созвездие DEX в парковом телескопе.'],
 ['photoAssistant','Гусь вне кадра','Помогите фотографу: уведите гуся к отметке и дождитесь снимка.'],
 ['fetchFriend','Лучший друг курьера','Трижды сыграйте с собачкой в мяч после завершения её поручения.'],
 ['airMail','Воздушная почта','Поймайте шесть самолётиков с разными посланиями.'],
 ['parkHeart','Сердце парка','Посмотрите, как светлячки собираются в сердце на северной поляне.'],
 ['magic','Продакшен-магия','Досмотрите фокус со стаканчиками и неожиданным голубем.'],
 ['portrait','С натуры','Получите свой первый портрет у уличного художника.'],
 ['portraitSeasons','Четыре времени себя','Соберите у художника летний, осенний, зимний и весенний портреты.'],
 ['parkCinema','Кино под звёздами','Посмотрите целиком 12-секундный фильм у зелёного театра вечером.'],
 ['bubbles','Тестировщик пузырей','Лопните героем 10 мыльных пузырей на поляне юго-восточнее старта.'],
 ['kite','На крыльях ветра','Запустите воздушного змея на поляне у беседки и дождитесь его возвращения.'],
 ['winterKeeper','Хранитель зимних запасов','Помогите белке найти спрятанный орех и верните его. Это отдельная зимняя история.'],
 ['snowSculptor','Снежный коллега','Соберите три снежных кома и слепите снеговика с шарфом DEX на поляне южнее старта.'],
 ['longWalk','Вы играете 15 минут','Проведите в парке 15 минут игрового времени и встретьте первый снег.'],
 ['luck10','+10 к деньгам','Дождитесь благодарности голубя после штрафа за кормление.'],
 ['metal','Археолог обеденного перерыва','Возьмите металлоискатель на южной аллее и найдите источник сигнала.'],
 ['music','Танцуют все','Потанцуйте с музыкантом рядом с летней эстрадой.'],
 ['water','Незапланированный душ','Попадите под дождеватель южнее гуся.'],
 ['echo','Голос из трекера','Крикните в дупло большого дерева рядом с белкой.'],
 ['pigeons','Спонсор голубей','Покормите голубей у запрещающей таблички и познакомьтесь с охранником.'],
 ['squirrel','Надёжный поставщик','Принесите орех белке у большого дерева.'],
 ['goose','Выжил после гуся','Познакомьтесь с гусем и дождитесь его возвращения на пост.'],
 ['paint','В цвет парка','Посидите на окрашенной скамейке у колеса.'],
 ['photo','Птица в кадре','Сфотографируйтесь в фотозоне DEX.'],
 ['fish','Рыбак своего размера','Попробуйте порыбачить в пруду.'],
 ['bush','Фокус-время','Осмотрите подозрительный куст восточнее колеса.'],
 ['espresso','Кофейный ускоритель','Выберите эспрессо в автомате у кафе.'],
 ['deadline','Поймал дедлайн','Закажите «Дедлайн» в кофейном автомате.'],
 ['litter','Карма +1','Подберите бумажку и отнесите её в урну у пикника.'],
 ['wheel','Парк с высоты','Прокатитесь на колесе обозрения до конца.'],
 ['karaoke','Голос парка','Спойте в караоке на летней эстраде.'],
 ['fountain','На удачу','Бросьте монетку в фонтан.'],
 ['pet','Друг хвостатых','Погладьте кошку или собачку.'],
 ['ice','Счастье в рожке','Возьмите мороженое у тележки.'],
 ['swing','Вот это полёт','Покачайтесь на качелях.'],
 ['photoHunt','Ловец мгновений','Снимите стрижей, радугу и кошку кнопкой фотоаппарата.'],
 ['photoAlbum','Летописец парка','Соберите восемь основных сюжетов фотоохоты. Шоу фонтана и четыре сезонных сюжета — дополнительные кадры.'],
 ['paperBoat','Капитан ручейка','Запустите бумажный кораблик во время дождя и проводите его до финиша.'],
 ['garden','Цветущий результат','Помогите садовнику с тремя клумбами и верните лейку. Дождь тоже считается помощником.']
 ].map(([id,title,hint])=>({id,title,hint}));
 const achievements=new Set();let latestAchievement='';
 function unlockAchievement(id){if(achievements.has(id)||!ACHIEVEMENTS.some(a=>a.id===id))return;achievements.add(id);latestAchievement=id;$('journal-button').classList.add('new-discovery');announce('Достижение: '+ACHIEVEMENTS.find(a=>a.id===id).title+' · J — журнал');save();}
 function renderAchievements(){$('achievement-count').textContent=`Открыто ${achievements.size} из ${ACHIEVEMENTS.length}. Необязательно для финиша. Бонусы: +${extras.luckMoney} к деньгам.`;$('achievement-list').replaceChildren();for(const a of ACHIEVEMENTS){const found=achievements.has(a.id),card=document.createElement('li'),title=document.createElement('strong'),hint=document.createElement('p');card.className='achievement-card'+(found?' unlocked':'')+(latestAchievement===a.id?' latest':'');title.textContent=(found?'✓ ':'○ ')+a.title;hint.textContent=found?'Получено! '+a.hint:a.hint;card.append(title,hint);$('achievement-list').append(card);}latestAchievement='';}
 const repeatRules={
 fountain:{max:5,name:'Монетки в фонтан',stop:'Фонтан: «Лимит удачи пополнен. Терминал больше не принимает монеты!»'},
 telescope:{max:2,name:'Телескоп',stop:'Космос изучен. Пусть инопланетяне теперь смотрят на нас.'},
 carousel:{max:2,name:'Карусель',stop:'Чё-то голова кружится. Третий круг пропущу!'},
 trampoline:{max:3,name:'Батут',stop:'KPI по прыжкам выполнен. Колени просят перерыв.'},
 wheel:{max:2,name:'Колесо обозрения',stop:'Весь парк уже запомнил. Пора исследовать его пешком!'},
 swing:{max:3,name:'Качели',stop:'В космос сегодня не полетим. Хватит раскачиваться!'},
 ice:{max:3,name:'Мороженое',stop:'Три порции — достаточно. А то замёрзнет даже бэклог.'},
 gazebo:{max:2,name:'Беседка',stop:'Отдохнул за всю команду. Пора на прогулку!'},
 release:{max:3,name:'Ожидание релиза',stop:'Релиз уже в проде. Не трогаем, пока работает!'}
 };
 let fountainParty=0,dizzyTime=0;
 const visitCount=kind=>extras.visits?.[kind]||0;
 function repeatBlocked(kind){if(kind==='telescope'&&!achievements.has('dexStars'))return false;const rule=repeatRules[kind];if(!rule||visitCount(kind)<rule.max)return false;speech=rule.stop;speechTime=5;if(kind==='carousel')dizzyTime=3;return true;}
 function finishVisit(kind){const rule=repeatRules[kind];if(!rule)return 0;extras.visits[kind]=Math.min(rule.max,visitCount(kind)+1);save();return extras.visits[kind];}
 function renderRepeatProgress(){$('repeat-progress').textContent='Необязательная история «Улетевший шарик»: '+(extras.balloon===2?'возвращён хозяину.':extras.balloon===1?'верните шарик гуляющему на западной аллее.':'поговорите с гуляющим в клетчатой рубашке на западной аллее; после порыва ветра ищите шарик южнее по той же дорожке.')+'\n\n'+Object.entries(repeatRules).map(([kind,r])=>r.name+': '+visitCount(kind)+' / '+r.max+(visitCount(kind)===r.max?' · история завершена':'')).join('\n');}

 let reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches??false;
 let comfort={nature:1,effects:1,large:false,reduced,sensitivity:1,controls:1,leftHanded:false,lightweight:false,quality:'auto',fairSlow:false,panelCollapsed:false};
 try{const c=JSON.parse(localStorage.getItem('dex-comfort')||'null');if(c){for(const k of ['nature','effects'])if(Number.isFinite(c[k]))comfort[k]=Math.max(0,Math.min(1,c[k]));if(Number.isFinite(c.controls))comfort.controls=Math.max(.8,Math.min(1.2,c.controls));if(typeof c.panelCollapsed==='boolean')comfort.panelCollapsed=c.panelCollapsed;if(typeof c.fairSlow==='boolean')comfort.fairSlow=c.fairSlow;if(typeof c.leftHanded==='boolean')comfort.leftHanded=c.leftHanded;if(typeof c.lightweight==='boolean')comfort.lightweight=c.lightweight;comfort.quality=['auto','beautiful','eco'].includes(c.quality)?c.quality:c.lightweight?'eco':'auto';if(typeof c.large==='boolean')comfort.large=c.large;if(typeof c.reduced==='boolean')comfort.reduced=c.reduced;if(Number.isFinite(c.sensitivity))comfort.sensitivity=Math.max(.6,Math.min(1.5,c.sensitivity));}}catch{}

 // Auto quality uses sustained foreground frame samples with hysteresis, never game time.
 let graphicsTier=comfort.quality==='eco'?2:0,qualityFrames=0,qualityMs=0,qualityWork=0,qualityBad=0,qualityGood=0;
 function effectCount(count){return graphicsTier===1?Math.max(1,Math.ceil(count*.65)):count;}
 function resetQualitySamples(){qualityFrames=qualityMs=qualityWork=qualityBad=qualityGood=0;}
 function qualityDescription(){return comfort.quality==='auto'?'Авто · '+['полная детализация','меньше декоративных частиц','экономная графика'][graphicsTier]:comfort.quality==='eco'?'Экономно · меньше частиц и бликов':'Красиво · полная детализация';}
 function syncQuality(){comfort.lightweight=graphicsTier===2;$('graphics-quality').value=comfort.quality;$('graphics-status').textContent=qualityDescription();}
 function setGraphicsQuality(mode){if(!['auto','beautiful','eco'].includes(mode))return;comfort.quality=mode;graphicsTier=mode==='eco'?2:0;resetQualitySamples();syncQuality();applyComfort();resize();}
 function sampleGraphics(ms,work,active=true){
  if(comfort.quality!=='auto'||!active||!Number.isFinite(ms)||ms<=0||ms>180){resetQualitySamples();return;}
  qualityMs+=ms;qualityFrames++;qualityWork+=Math.max(0,Number.isFinite(work)?work:0);if(qualityMs<3000)return;
  const average=qualityMs/qualityFrames,cost=qualityWork/qualityFrames;qualityBad=average>25?qualityBad+1:0;qualityGood=average<19&&cost<10?qualityGood+1:0;
  qualityMs=qualityFrames=qualityWork=0;let next=graphicsTier;
  if(qualityBad>=2&&graphicsTier<2)next++;else if(qualityGood>=10&&graphicsTier>0)next--;
  if(next!==graphicsTier){graphicsTier=next;qualityBad=qualityGood=0;syncQuality();resize();}
 }
 function applyComfort(){touchLayoutDirty=true;$('touch-controls').classList.toggle('left-handed',comfort.leftHanded);$('control-layout-description').textContent=comfort.leftHanded?'Стик справа · действия и педали слева':'Стик слева · действия и педали справа';for(const id of ['joystick','car-controls','dash-button'])$(id).style.transform='scale('+comfort.controls+')';reduced=comfort.reduced;if(reduced)cameraLeadX=cameraLeadY=0;window.ParkAudio?.setLevels?.(comfort.nature,comfort.effects);$('journal').classList.toggle('large-copy',comfort.large);$('info').classList.toggle('large-copy',comfort.large);$('quiz').classList.toggle('large-copy',comfort.large);$('away-pause').classList.toggle('large-copy',comfort.large);try{localStorage.setItem('dex-comfort',JSON.stringify(comfort));}catch{}}

 const logo=new Image();logo.src='assets/postcard.jpg';
 const point=([tx,ty])=>({x:tx*T+16,y:ty*T+16});
 const boundary=[[6,6],[90,6],[90,70],[6,70]];
 const gates=[{side:'left',at:26},{side:'left',at:55},{side:'top',at:42},{side:'right',at:28},{side:'right',at:56},{side:'bottom',at:27},{side:'bottom',at:70}];
 const onSidewalk=(x,y)=>x/T>=4&&x/T<92&&y/T>=4&&y/T<72&&(x/T<8||x/T>=88||y/T<8||y/T>=68);
 function fenceTile(x,y){const side=x===6?'left':x===89?'right':y===6?'top':y===69?'bottom':null;if(!side||x<6||x>89||y<6||y>69)return false;return !gates.some(g=>g.side===side&&Math.abs((side==='left'||side==='right'?y:x)-g.at)<=3);}
 const promenade=[[[10,12],[85,12]],[[85,12],[85,66]],[[85,66],[10,66]],[[10,66],[10,12]],[[4,26],[10,26]],[[4,55],[10,55]],[[42,4],[42,12]],[[85,28],[92,28]],[[85,56],[92,56]],[[27,66],[27,72]],[[70,66],[70,72]],[[27,46],[27,66]],[[10,26],[30,28]],[[85,28],[76,28]]];
 const ring=[[30,28],[34,19],[42,16],[51,19],[54,28],[51,37],[42,40],[34,37],[30,28]];
 const route=[[27,46],[30,42],[34,37],[32,33],[30,28],[32,23],[34,19],[38,17],[42,16],[47,17],[51,19],[53,24],[54,28],[53,33],[51,37],[47,39],[42,40],[42,34]].map(point);
 const routeStops=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16];
 const secrets=[
  {tx:17,ty:23,kind:'rock',place:'Тайник под камнем',action:'Осмотреть камень',hint:'В западной роще лежит необычный серый камень.'},
  {tx:24,ty:34,kind:'stump',place:'Дупло старого пня',action:'Заглянуть в пень',hint:'Поищите старый пень западнее кольцевой аллеи.'},
  {tx:45,ty:12,kind:'poster',place:'Афиша зелёного театра',action:'Изучить афишу',hint:'На севере у зелёного театра есть афиша с секретом.'},
  {tx:44,ty:48,kind:'box',place:'Почта у кафе',action:'Открыть ящик',hint:'Возле кафе на юге вас ждёт необычное письмо.'},
  {tx:63,ty:29,kind:'flowers',place:'Секрет цветочной клумбы',action:'Осмотреть клумбу',hint:'Восточнее летней эстрады растут яркие цветы.'}
 ];
 const clues=[...routeStops.map((r,i)=>({tx:(route[r].x-16)/T,ty:(route[r].y-16)/T,place:`${i+1} · Кольцевая аллея`})),...secrets.map(c=>({...c,hidden:true}))].map(c=>({...c,...point([c.tx,c.ty])}));
 const TOTAL=clues.length,spawn=point([27,46]),exit=point([42,34]);
 const badges=[[20,18,'rock','Камень в северо-западной роще'],[20,30,'stump','Пень в западной роще'],[30,40,'flowers','Клумба у стартовой аллеи'],[39,9,'box','Ящик возле зелёного театра'],[57,23,'poster','Афиша возле эстрады'],[64,32,'rock','Камень в восточном саду'],[46,51,'flowers','Клумба южнее кафе'],[48,43,'box','Ящик на южной аллее']].map(([tx,ty,kind,place],id)=>({tx,ty,kind,place,id,type:'badge',action:'Обыскать '+({rock:'камень',stump:'пень',flowers:'клумбу',box:'ящик',poster:'афишу'}[kind]),...point([tx,ty])}));
 const attractions=[{tx:59,ty:23,kind:'karaoke',action:'Зайти на караоке'},{tx:22,ty:39,kind:'toilet',action:'Зайти в кабинку',reply:'Занято!!!'},{tx:24,ty:39,kind:'toilet',action:'Зайти в кабинку',reply:'Пока не хочется'},{tx:34,ty:53,kind:'ice',action:'Взять мороженое'},{tx:65,ty:17,kind:'ice',action:'Взять мороженое'},{tx:23,ty:28,kind:'swing',action:'Покачаться'}].map(a=>({...a,...point([a.tx,a.ty])}));
 const pets=[{tx:26,ty:22,kind:'cat',size:.8,action:'Погладить кошечку',reply:'Мяу'},{tx:55,ty:40,kind:'dog',action:'Погладить собачку',reply:'Гау гау гау'},{tx:28,ty:31,kind:'dog',size:.65,action:'Погладить собачку',reply:'Раф'}].map(a=>({...a,...point([a.tx,a.ty])}));
 const motorLoop=[[2,2],[94,2],[94,74],[2,74],[2,2]],motorAccess=[[70,66],[70,74]];
 const motorSegments=[...motorLoop.slice(1).map((b,i)=>[motorLoop[i],b]),...motorAccess.slice(1).map((b,i)=>[motorAccess[i],b])];
 const onMotorRoad=(x,y)=>motorSegments.some(([a,b])=>segmentDistance(x/T,y/T,a,b)<2);
 const roads=[...promenade,...ring.slice(1).map((b,i)=>[ring[i],b]),[[4,26],[76,28]],[[17,7],[48,59]],[[27,46],[53,9]],[[27,46],[66,44]],[[42,28],[48,59]],[[42,28],[41,5]],[[42,28],[68,18]],[[42,28],[64,45]],[[27,46],[42,28]],[[42,28],[42,40]],[[66,44],[79,46]],[[79,46],[83,34]],[[79,46],[75,57]],[[75,57],[55,57]],[[55,57],[47,54]],[[69,57],[69,65]],[[69,65],[62,65]]];
 const segmentDistance=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],u=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-u*dx,y-a[1]-u*dy);};
 function inside(x,y){let hit=false;for(let i=0,j=boundary.length-1;i<boundary.length;j=i++){const a=boundary[i],b=boundary[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
 const path=(x,y)=>roads.some(([a,b])=>segmentDistance(x,y,a,b)<1.25)||route.slice(1).some((b,i)=>segmentDistance(x,y,[(route[i].x-16)/T,(route[i].y-16)/T],[(b.x-16)/T,(b.y-16)/T])<1.25)||Math.hypot(x-42,y-28)<3.5;
 const water=(x,y)=>Math.hypot((x-37)/1.9,(y-35)/2.1)<1;
 const bridge=()=>false;
 const fountain=(x,y)=>Math.hypot(x-42,y-28)<1.6;
 const buildings=[{tx:42,ty:8,w:6,h:3,label:'ЗЕЛЁНЫЙ ТЕАТР',color:'#356c51'},{tx:57,ty:20,w:5,h:3,label:'ЛЕТНЯЯ ЭСТРАДА',color:'#866095'},{tx:42,ty:45,w:5,h:2,label:'КАФЕ',color:'#bb7650'}];
 const fountainSpots=[[40,28],[44,28],[42,26],[42,30]].map(p=>({...point(p),kind:'fountain',action:'Бросить монетку на удачу'}));
 const wheel={...point([62,38]),kind:'wheel',action:'Прокатиться на колесе'};
 const lamps=[[29,45],[35,39],[29,27],[36,18],[49,18],[55,30],[45,41]].map(point);
 const benches=[{tx:36,ty:21},{tx:47,ty:22},{tx:48,ty:34},{tx:37,ty:43},{tx:58,ty:31},{tx:24,ty:18},{tx:27,ty:35},{tx:50,ty:29},{tx:47,ty:48},{tx:60,ty:40}];
 const objectTile=(x,y)=>[...secrets,...badges,...pets,...attractions.filter(a=>a.kind!=='karaoke')].some(c=>x===c.tx&&y===c.ty-1);
 const buildingTile=(x,y)=>buildings.some(b=>x>=b.tx&&x<b.tx+b.w&&y>=b.ty&&y<b.ty+b.h);
 const supporters=[{tx:39,ty:33,hair:'#ef302b',shirt:'#b1f0ed',phrase:'Ты молодец',style:'red'},{tx:45,ty:33,hair:'#ffbb3f',shirt:'#ee4447',phrase:'Давай',style:'glasses'},{tx:45,ty:36,hair:'#593d2c',shirt:'#f4f2f5',phrase:'У тебя всё получится',style:'brown'},{tx:39,ty:37,hair:'#65422e',shirt:'#2e435a',phrase:'Ты справишься!',style:'plaid'},{tx:48,ty:36,hair:'#493b38',shirt:'#4862e8',phrase:'Мы в тебя верим!',style:'hoodie'},{tx:30,ty:46,hair:'#70442e',shirt:'#459d87',phrase:'Мы любим людей',style:'hoodie'},{tx:49,ty:49,heightScale:.82,hair:'#e99a35',shirt:'#b776b0',phrase:'Мы любим людей',style:'glasses'}].map((n,i)=>({...n,avatar:9+i,...point([n.tx,n.ty])}));
 const errands=[{title:'Мячик для собачки',giver:supporters[5],receiver:pets[1],hint:'Красный мячик лежит на траве слева от колеса обозрения, у восточного сада.',item:{...point([58,33]),type:'errand',id:0,action:'Поднять мячик'},request:'Максим: «Поможешь? Собачка потеряла мячик у восточного сада. Найди и отнеси ей!»',thanks:'Мячик возвращён! Собачка радостно виляет хвостом.'},{title:'Потерянная книга',giver:supporters[6],receiver:supporters[6],hint:'Книга лежит у северо-западного поворота кольцевой аллеи.',item:{...point([31,21]),type:'errand',id:1,action:'Поднять книгу'},request:'Аня: «Привет! Я оставила книгу у северо-западной аллеи. Найдёшь и принесёшь?»',thanks:'Аня: «Спасибо! Теперь можно спокойно дочитать. Ты мой герой!»'}];
 let hornReaction=null;const visitedPlaces=new Set();
 let driveSeconds=0,flatTyre=false,tyreRepaired=false,pumpTime=0,hornCooldown=0,hornGlow=0;
 function honk(){if(cycling){ringBikeBell();return;}if(blocked()||!driving||hornCooldown>0||towScene)return;hornCooldown=1.35;hornGlow=1.2;window.ParkAudio?.horn?.();hornReaction={x:bmw.x,y:bmw.y,until:elapsed+2.5};for(const p of [...pigeons,...tamePigeons])if(p.flight===0&&Math.hypot(p.homeX-bmw.x,p.homeY-bmw.y)<260){p.dx=p.dy=0;p.flight=reduced?0:2;p.cooldown=4;}for(const n of wanderers)if(Math.hypot(n.x-bmw.x,n.y-bmw.y)<230){n.wait=1.5;n.face=bmw.x<n.x?-1:1;}if(Math.hypot(brother.x-bmw.x,brother.y-bmw.y)<260){speech='Я тебя и так вижу!';speechTime=3;}}
 // A complete park year takes 20 active minutes; pauses and saves use the same clock.
 // Free-roam scenery uses its own origin; elapsed and the recorded finish never jump.
 const parkWeatherModes=[
  {id:'auto',name:'Естественная смена',hint:'Погода и времена года снова следуют времени прогулки.'},
  {id:'day',name:'☀ Летний день',hint:'Лето и ясный день остаются, пока вы не выберете другой вариант.'},
  {id:'evening',name:'☾ Тёплый вечер',hint:'Загораются фонари, появляются светлячки, слышны вечерние насекомые.'},
  {id:'autumn',name:'🍂 Золотая осень',hint:'Солнечный день, золотые деревья и листопад.'},
  {id:'snow',name:'❄ Первый снег',hint:'Минута снегопада, затем северное сияние и тихая зима с сугробами. Можно построить снеговика.'},
  {id:'rain',name:'☂ Короткий дождь',hint:'Сначала стрижи, через 5 секунд — дождь на 10 секунд, затем радуга.'}
 ];
 let parkWeather={mode:'auto',since:0,serial:0,fromNight:0};
 const weatherControlled=()=>parkWeather.mode!=='auto';
 const weatherAge=(time=elapsed)=>Math.max(0,time-parkWeather.since);
 function restoreParkWeather(v={}){
  const w=v.parkWeather;
  parkWeather=v.finished===true&&w&&parkWeatherModes.some(p=>p.id===w.mode)&&Number.isFinite(w.since)&&w.since>=0&&w.since<=(v.elapsed||0)?{mode:w.mode,since:w.since,serial:Number.isInteger(w.serial)?Math.max(0,Math.min(899999,w.serial)):0,fromNight:Number.isFinite(w.fromNight)?unit(w.fromNight):0}:{mode:'auto',since:0,serial:0,fromNight:0};
 }
 function renderParkWeather(){
  const unlocked=finished&&freeRoam,host=$('park-weather-controls');$('park-weather-locked').hidden=unlocked;host.hidden=!unlocked;$('park-weather-walk').hidden=!unlocked;
  const mode=parkWeatherModes.find(p=>p.id===parkWeather.mode)||parkWeatherModes[0];
  $('park-weather-status').textContent=unlocked?'Выбрано: '+mode.name+'. '+mode.hint:'Завершите квест и выберите «Остаться в парке», чтобы открыть пульт.';
  host.replaceChildren();if(!unlocked)return;
  for(const p of parkWeatherModes){const b=document.createElement('button');b.type='button';b.id='park-weather-'+p.id;b.textContent=p.name;b.setAttribute('aria-pressed',String(p.id===parkWeather.mode));b.onclick=()=>selectParkWeather(p.id);host.append(b);}
 }
 function selectParkWeather(mode){
  if(!finished||!freeRoam||!parkWeatherModes.some(p=>p.id===mode))return false;
  if(photoMode||funScene||feedScene||towScene||trafficStop||idleEscort||wheelTime>0||swingTime>0||karaokeTime>0||pumpTime>0||paperVoyage){$('park-weather-status').textContent='Сначала завершите текущее занятие, затем меняйте погоду.';return false;}
  const fromNight=nightLevel();parkWeather={mode,since:elapsed,serial:(parkWeather.serial+1)%900000,fromNight};
  swiftOrigin=stormBag=null;winterTracks=[];snowPowder=[];snowWheelPose=null;wetPrints=[];wetSoles=0;roadSpray=[];
  fountainShow=null;fireflyDance=null;wheelLightShow=null;wheelShowGuests=[];wheelShowRequested=false;seasonalPaletteKey='';clearInput();notePlayActivity();
  const chosen=parkWeatherModes.find(p=>p.id===mode);rememberMessage('Пульт парка: '+chosen.name+'. '+chosen.hint);save();renderParkWeather();
  $('park-weather-status').textContent=chosen.hint+' Нажмите «Гулять с этой погодой». Повторное нажатие варианта запускает его сначала.';$('park-weather-'+mode).focus();return true;
 }
 function leaveWeatherPanel(){if(!finished||!freeRoam)return;closeJournal();canvas.focus();}

 // The original mistakes are kept separately from optional, untimed practice.
 let questionErrors={},reviewSession=null,reviewReturn='';
 function restoreQuestionReview(v={}){
  $('quiz-review').close();reviewSession=null;questionErrors={};
  const data=v.questionReview;if(data?.bank!=='idle41'||!Array.isArray(data.errors))return;
  for(const pair of data.errors.slice(0,20))if(Array.isArray(pair)&&Number.isInteger(pair[0])&&pair[0]>=0&&pair[0]<TOTAL&&Number.isInteger(pair[1])&&pair[1]>0)questionErrors[pair[0]]=Math.min(9999,pair[1]);
 }
 function reviewQuestionIds(){return Object.keys(questionErrors).map(Number).sort((a,b)=>a-b);}
 function renderReviewEntry(){
  $('farewell-replay').hidden=!finished;$('review-finish').hidden=!finished;$('review-journal').hidden=!finished;
  const ids=reviewQuestionIds();$('review-journal').textContent=ids.length?'Разобрать вопросы с ошибками · '+ids.length:'Повторить вопросы без таймера';
 }
 function openQuestionReview(origin='journal'){
  if(!finished||$('farewell').open||(!win.open&&!journal.open))return false;
  reviewReturn=origin==='win'?'review-finish':'review-journal';clearInput();reviewSession=null;renderQuestionReview();$('quiz-review').showModal();$('review-title').focus();return true;
 }
 function renderQuestionReview(){
  const ids=reviewQuestionIds();$('review-home').hidden=!!reviewSession;$('review-practice').hidden=!reviewSession;
  if(!reviewSession){
   const recorded=Object.values(questionErrors).reduce((n,v)=>n+v,0),unknown=Math.max(0,(finalResult?.mistakes||mistakes)-recorded);
   $('review-summary').textContent=ids.length?'В '+ids.length+' вопросах были ошибки. Можно прочитать объяснения или проверить себя ещё раз.':unknown?'В старом сохранении записано число ошибок, но не их вопросы. Можно повторить все двадцать.':'Все вопросы пройдены без записанных ошибок. Можно повторить их для себя.';
   if(ids.length&&unknown)$('review-summary').textContent+=' Часть старых ошибок сохранена без номеров вопросов.';
   $('review-missed').hidden=!ids.length;$('review-explanations').replaceChildren();
   for(const id of ids){const q=QUESTIONS[id],item=document.createElement('details'),title=document.createElement('summary'),question=document.createElement('p'),answer=document.createElement('p'),note=document.createElement('p');title.textContent=(id+1)+'. '+q.title;question.textContent=q.question;answer.textContent='Верный ответ: '+q.answers[q.correct];note.textContent=q.note;item.append(title,question,answer,note);$('review-explanations').append(item);}
   return;
  }
  const s=reviewSession,done=s.index>=s.ids.length;$('review-answers').replaceChildren();$('review-next').hidden=true;$('review-back').hidden=!done;$('review-feedback').textContent='';
  $('review-progress').textContent=done?'Повторение завершено':'Вопрос '+(s.index+1)+' из '+s.ids.length+' · без таймера';
  if(done){$('review-question').textContent='Спасибо за любопытство!';$('review-feedback').textContent='В этом повторении верно с первой попытки: '+s.correct+' / '+s.ids.length+'. Результат прогулки остался прежним.';return;}
  const q=QUESTIONS[s.ids[s.index]];s.answered=false;$('review-question').textContent=q.question;
  q.answers.forEach((text,i)=>{const b=document.createElement('button');b.type='button';b.className='answer';b.textContent=(i+1)+'. '+text;b.onclick=()=>chooseReviewAnswer(i);$('review-answers').append(b);});
 }
 function startQuestionPractice(missed=true){
  if(!$('quiz-review').open||!finished)return false;const ids=missed?reviewQuestionIds():QUESTIONS.map((_,i)=>i);if(!ids.length)return false;
  reviewSession={ids,index:0,correct:0,answered:false};renderQuestionReview();$('quiz-review').scrollTop=0;$('review-question').focus();return true;
 }
 function chooseReviewAnswer(i){
  const s=reviewSession;if(!$('quiz-review').open||!s||s.answered||s.index>=s.ids.length||!Number.isInteger(i)||i<0||i>3)return false;
  const q=QUESTIONS[s.ids[s.index]],correct=i===q.correct;s.answered=true;if(correct)s.correct++;
  [...$('review-answers').children].forEach((b,j)=>{b.disabled=true;b.classList.toggle('correct',j===q.correct);b.classList.toggle('wrong',j===i&&!correct);if(j===q.correct)b.textContent='✓ '+b.textContent;else if(j===i)b.textContent='↪ '+b.textContent;});
  $('review-feedback').textContent=(correct?'Верно! ':'Верный ответ: '+q.answers[q.correct]+'. ')+q.note;
  $('review-next').textContent=s.index===s.ids.length-1?'Завершить повторение':'Следующий вопрос →';$('review-next').hidden=false;$('review-feedback').focus();return correct;
 }
 function nextReviewQuestion(){if(!reviewSession?.answered||reviewSession.index>=reviewSession.ids.length||!$('quiz-review').open)return false;reviewSession.index++;renderQuestionReview();$('quiz-review').scrollTop=0;$('review-question').focus();return true;}
 function closeQuestionReview(){const target=reviewReturn;$('quiz-review').close();reviewSession=null;clearInput();notePlayActivity();if(target)$(target).focus();}

 const WHEEL_SHOW_SECONDS=18;
 let wheelLightShow=null,wheelShowCycle='',wheelShowRequested=false,wheelShowGuests=[];
 function restoreWheelShow(v={}){
  wheelLightShow=null;wheelShowGuests=[];const s=v.wheelShow;
  wheelShowCycle=typeof s?.cycle==='string'&&/^(auto|manual):\d{1,7}$/.test(s.cycle)?s.cycle:'';
  wheelShowRequested=v.finished===true&&s?.requested===true;
  if(Number.isFinite(s?.start)&&s.start>=0&&s.start<=(v.elapsed||0)&&(v.elapsed||0)-s.start<WHEEL_SHOW_SECONDS)wheelLightShow={start:s.start,beat:-1};
 }
 function wheelEveningKey(){return weatherControlled()?'manual:'+parkWeather.serial:'auto:'+Math.floor(elapsed/300);}
 function renderWheelShowControl(){
  $('wheel-show-launch').hidden=!(finished&&freeRoam);
  $('wheel-show-status').textContent=wheelShowRequested?'Шоу заказано. Подойдите к большому колесу по указателю.':wheelLightShow?'Сейчас у большого колеса идёт световое шоу. P — сохранить этот момент.':'В сухой вечер подойдите к большому колесу: вас ждут 18 секунд музыки и мягкого света. После финиша шоу можно вызвать здесь.';
 }
 function requestWheelShow(){
  if(!finished||!freeRoam||!journal.open||!selectParkWeather('evening'))return false;
  wheelShowRequested=true;trackedPlace=-1;selectPlace(mapPlaces.findIndex(p=>p.name==='Колесо'));announce('Вечер включён. Следуйте к колесу — шоу начнётся, когда вы подойдёте.');save();return true;
 }
 function wheelShowLevel(){if(!wheelLightShow)return 0;const t=elapsed-wheelLightShow.start;return unit(t/2)*unit((WHEEL_SHOW_SECONDS-t)/2)*nightLevel();}
 function makeWheelShowGuests(){
  const guests=[];
  for(const [id,side]of [[0,-1],[1,1]]){const a={x:wheel.x+side*110,y:wheel.y+65},b={x:wheel.x+side*76,y:wheel.y+40};if(canStand(a.x,a.y)&&canStand(b.x,b.y)&&clearSegment(a,b)&&![...supporters,...testers,...pets].some(n=>Math.hypot(n.x-b.x,n.y-b.y)<42))guests.push({...a,id,home:a,target:b,walking:true,applause:0});}
  return guests;
 }
 function updateWheelShow(dt){
  const distance=Math.hypot(player.x-wheel.x,player.y-wheel.y),dry=rainIntensity()<.1&&!snowing(),key=wheelEveningKey();
  if(!ambientSceneBusy()&&!wheelLightShow&&distance<260&&nightLevel()>.6&&dry&&!momentsBusy()&&!fountainShow&&!fireflyDance&&speechTime<=0&&!weatherSpeaking()&&(wheelShowRequested||wheelShowCycle!==key&&(weatherControlled()||elapsed%300>=246&&elapsed%300<=277))){
   wheelLightShow={start:elapsed,beat:-1};wheelShowGuests=makeWheelShowGuests();wheelShowCycle=key;wheelShowRequested=false;announce('Колесо зажигает огни! 18 секунд музыки и света · P — сделать снимок.');save();
  }
  if(!wheelLightShow)return;
  const age=elapsed-wheelLightShow.start;
  if(age>=WHEEL_SHOW_SECONDS||!dry||nightLevel()<.1){wheelLightShow=null;wheelShowGuests=[];save();return;}
  for(const n of wheelShowGuests){const target=age>14?n.home:n.target,dx=target.x-n.x,dy=target.y-n.y,d=Math.hypot(dx,dy),step=Math.min(d,22*dt),x=n.x+dx/(d||1)*step,y=n.y+dy/(d||1)*step;n.walking=d>1;n.applause=age>11&&age<14?1:0;if(canStand(x,y)&&Math.hypot(player.x-x,player.y-y)>25){n.x=x;n.y=y;}}
  const beat=Math.floor(age/.65);if(beat!==wheelLightShow.beat){wheelLightShow.beat=beat;if(distance<400)window.ParkAudio?.wheelNote?.(beat,unit((400-distance)/220));}
 }
 function drawWheelLightShow(){
  const level=wheelShowLevel();if(level<=0||wheel.x<camX-120||wheel.x>camX+viewW+120||wheel.y<camY||wheel.y-220>camY+viewH)return;
  const age=elapsed-wheelLightShow.start,cx=wheel.x,cy=wheel.y-116,colors=['#f2d595','#a5d8cf','#cbbce0'];
  ctx.save();ctx.translate(-camX,-camY);
  const count=comfort.lightweight?24:48;
  for(let i=0;i<count;i++){const a=i/count*Math.PI*2-Math.PI/2,x=cx+Math.cos(a)*86,y=cy+Math.sin(a)*86,lit=reduced?.65:age<4?unit((age/4-i/count)*8):.5+.5*(1+Math.sin(a*3-age*1.2))*.5,color=colors[Math.floor(i/count*6)%3];ctx.globalAlpha=level*lit*.14;rect(x-6,y-6,12,12,color);ctx.globalAlpha=level*lit;rect(x-2,y-2,4,4,color);}
  ctx.globalAlpha=level*.55;for(let i=0;i<8;i++){const a=i*Math.PI/4+(reduced?0:age*.12);line(cx+Math.cos(a)*19,cy+Math.sin(a)*19,cx+Math.cos(a)*77,cy+Math.sin(a)*77,colors[i%3],2);}
  if(age>5||reduced){ctx.globalAlpha=level;rect(cx-27,cy-12,54,24,'#294d50');text('DEX',cx,cy+5,16,'#f6e2a9','center');}
  ctx.restore();
 }

 // Returning guests remember actions; reading a line never changes that memory.
 let npcMemory={visits:{},traffic:null,calmDrive:0,farewellSeen:false},farewellProfile=null,farewellScene=null;
 const npcVisitTimes=new Map();
 const parkInspector={...point([74,67]),kind:'parkInspector',name:'Инспектор у парковки',action:'Поговорить с инспектором',time:0,fined:true};
 function restoreNpcMemory(v={}){
  $('farewell').close();farewellScene=null;npcVisitTimes.clear();const m=v.npcMemory;
  npcMemory={visits:{},traffic:null,calmDrive:Number.isFinite(m?.calmDrive)?Math.max(0,Math.min(25,m.calmDrive)):0,farewellSeen:m?.farewellSeen===true};
  for(const id of ['book','ball','chess','golf','inspector'])if(Number.isInteger(m?.visits?.[id]))npcMemory.visits[id]=Math.max(0,Math.min(99,m.visits[id]));
  if(['speeding','red','parking'].includes(m?.traffic?.reason)&&Number.isInteger(m.traffic.choice)&&m.traffic.choice>=0&&m.traffic.choice<3)npcMemory.traffic={reason:m.traffic.reason,choice:m.traffic.choice};
  const p=v.farewellProfile;farewellProfile=v.finished&&p&&Number.isInteger(p.chess)&&p.chess>=0&&p.chess<=3&&Number.isInteger(p.fetch)&&p.fetch>=0&&p.fetch<=999?{chess:p.chess,fetch:p.fetch}:null;
 }
 function npcMemoryId(n){return n===errands[1].giver?'book':n===errands[0].giver?'ball':n.id==='chess'?'chess':n===brother?'golf':n===parkInspector?'inspector':'';}
 function rememberNpcVisit(n){const id=npcMemoryId(n);if(!id||elapsed<(npcVisitTimes.get(id)??-Infinity)+30)return;npcMemory.visits[id]=Math.min(99,(npcMemory.visits[id]||0)+1);npcVisitTimes.set(id,elapsed);save();}
 function trafficMemoryLine(){
  const m=npcMemory.traffic;if(!m)return '';
  return {speeding:['Ваш «нагрузочный тест дороги» я помню.','Вы обещали больше не спешить.','Хорошее настроение помню. Оно по-прежнему бесплатно.'],red:['Гонку условий помню. У светофора всё ещё один верный сигнал.','Помню, договорились ждать зелёного.','Тему оформления светофора мы так и не меняли.'],parking:['Помню вашу парковку «с запасом на масштабирование».','Вы обещали занимать одно место.','Те два «бесплатных слота» я помню.']}[m.reason][m.choice];
 }
 function inspectorGreeting(){
  const count=fines.red+fines.speeding+fines.parking;
  if(npcMemory.calmDrive>=25)return count?'Вот теперь совсем другое дело! Вижу: едете спокойно и по правилам. Так и продолжайте.':'Едете спокойно, штрафов нет. Приятно иметь дело с таким водителем!';
  if(npcMemory.traffic)return trafficMemoryLine()+' Давайте дальше без нарушений.';
  return count?'Чёрную BMW помню. Попробуйте отключить спорт: до 50 км/ч здесь гораздо спокойнее.':(npcMemory.visits.inspector||0)>0?'Снова здравствуйте! Светофор на месте, правила тоже. Хорошей прогулки!':'Добрый день! На дороге — до 50 км/ч, на светофоре — зелёный, на парковке — одно место.';
 }
 function personalGreeting(n){
  const id=npcMemoryId(n),visit=npcMemory.visits[id]||0;
  if(fairFamily.includes(n)&&(fairStats.music?.plays||0)>0)return n.name+': «'+(n===fairFamily[1]?'Наш слушатель вернулся! Следующая мелодия для тебя.':n===fairFamily[0]?'Рад тебя видеть! Помнишь наш концерт?':'Привет! Сегодня опять держу ритм.')+'»';
  if(id==='inspector')return inspectorGreeting();
  if(id==='chess'&&(rideVisits.chess||0)>0&&(rideVisits.chess||0)<3)return 'Леша: «'+(rideVisits.chess===1?'Первую победу я запомнил. Сыграем реванш?':'Уже две победы! Дашь мне последний шанс?')+'»';
  if(id==='chess'&&(rideVisits.chess||0)>=3)return ['Чемпион! Я пока тренируюсь. Ферзь просил перерыв.','Снова ты? Я сегодня наблюдаю. Три победы я запомнил!','Счёт 3:0 висит у меня над доской. Для мотивации.'][Math.min(2,visit)];
  if(id==='book'&&errandStates[1]===3)return ['Привет! Книгу теперь держу крепче. Спасибо ещё раз!','Снова мой спаситель! У книги теперь закладка и место в сумке.','Если потеряю продолжение — знаю, к кому обращаться! Шучу, сумку проверила.'][Math.min(2,visit)];
  if(id==='ball'&&errandStates[0]===3)return fetchTrips>=3?'Три игры в мяч! Кажется, у хвостатого появился любимый напарник.':fetchTrips>0?'Он запомнил, как вы играли! Видит тебя — сразу ищет мячик.':visit?'Мячик на месте. А хвостатый с тех пор всех встречает как героев!':'О, спаситель мячика! Хвостатый уже ждёт реванша.';
  if(id==='golf'&&(fines.speeding+fines.red+fines.parking)>=2)return 'Твою BMW уже знает весь парк. А мой Golf сегодня отдыхает!';
  return '';
 }
 function noteCalmDrive(before,dt){
  if(!driving||trafficStop||towScene)return;
  if(Math.abs(driveSpeed)*.22>50.5){npcMemory.calmDrive=0;return;}
  if(Math.abs(driveSpeed)>30&&Math.hypot(bmw.x-before.x,bmw.y-before.y)>.01)npcMemory.calmDrive=Math.min(25,npcMemory.calmDrive+dt);
 }
 function talkInspector(){clearInput();clearTrafficDialogue();activity.classList.add('traffic-conversation');player.vx=player.vy=0;$('activity-title').textContent='Инспектор у парковки';const line=inspectorGreeting();$('activity-copy').textContent=line;rememberMessage('Инспектор: «'+line+'»','Разговор');rememberNpcVisit(parkInspector);activity.showModal();}
 function farewellLines(){
  const p=farewellProfile||{chess:rideVisits.chess||0,fetch:fetchTrips};
  return [
   {who:'Аня',kind:'book',text:'Спасибо, что вернул книгу! Следующая глава — уже дома. А эта прогулка останется доброй историей.'},
   {who:'Хвостатый друг',kind:'dog',text:p.fetch>=3?'Гав! Мяч спасён, три игры позади — ты теперь мой любимый напарник!':p.fetch>0?'Гав! И мяч вернул, и поиграл со мной. Держи — ещё один бросок на прощание!':'Гав! Ты нашёл мой мяч. Принёс его тебе — заходи ещё поиграть!'},
   {who:'Леша',kind:'chess',text:p.chess>=3?'Три партии, три твоих победы. Я запомнил! Приходи ещё — я пока потренирую ферзя.':p.chess>0?'Твои победы я запомнил. В следующий раз начнём с реванша! Буду ждать у шахматного стола.':'Сегодня до шахмат не дошли? Тогда в следующий раз обязательно сыграем. Доска будет ждать!'}
  ];
 }
 function openFarewell(){
  if(!finished||!win.open||$('farewell').open)return false;
  if(!farewellProfile)farewellProfile={chess:rideVisits.chess||0,fetch:Math.min(999,fetchTrips)};
  farewellScene={time:0,playing:!reduced,index:-1};clearInput();
  if(!npcMemory.farewellSeen){for(const line of farewellLines())rememberMessage(line.who+': «'+line.text+'»','Разговор');npcMemory.farewellSeen=true;}
  save();$('farewell-transcript').replaceChildren();for(const line of farewellLines()){const p=document.createElement('p');p.textContent=line.who+': '+line.text;$('farewell-transcript').append(p);}
  $('farewell').showModal();updateFarewell(0);$('farewell-title').focus();return true;
 }
 function closeFarewell(){if(!$('farewell').open)return;$('farewell').close();farewellScene=null;clearInput();win.scrollTop=0;$('win-title').focus();}
 function updateFarewell(dt){
  const s=farewellScene;if(!s||!$('farewell').open)return;
  if(!document.hidden&&s.playing)s.time=Math.min(12,s.time+dt);if(s.time>=12)s.playing=false;
  const index=Math.min(2,Math.floor(s.time/4)),line=farewellLines()[index];
  if(index!==s.index){s.index=index;$('farewell-speaker').textContent=line.who;$('farewell-copy').textContent=line.text;$('farewell-progress').textContent='Встреча '+(index+1)+' из 3';}
  $('farewell-play').textContent=s.time>=12?'Посмотреть ещё раз':s.playing?'Ⅱ Пауза':'▶ Продолжить';$('farewell-next').textContent=index===2?'К итогам прогулки':'Следующая встреча →';$('farewell-skip').hidden=index===2;
  drawFarewell();
 }
 function toggleFarewell(){if(!farewellScene)return;if(farewellScene.time>=12)farewellScene.time=0;farewellScene.playing=!farewellScene.playing;updateFarewell(0);}
 function nextFarewell(){if(!farewellScene)return;if(farewellScene.index>=2){closeFarewell();return;}farewellScene.time=(farewellScene.index+1)*4;updateFarewell(0);}
 function pauseFarewell(){if(farewellScene){farewellScene.playing=false;updateFarewell(0);}}
 function drawFarewell(){
  if(!farewellScene)return;const c=$('farewell-stage'),savedContext=ctx;ctx=c.getContext('2d');if(!ctx){ctx=savedContext;return;}
  try{
   ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=false;
   const s=farewellScene,phase=reduced?1:(s.time%4)/4,wave=reduced?0:Math.sin(s.time*5)*3;
   rect(0,0,720,300,'#d9dfc7');rect(0,85,720,215,'#799660');rect(0,230,720,70,'#d6bd88');rect(250,130,220,170,'#d6bd88');
   for(const x of [54,650]){rect(x,65,15,158,'#836747');rect(x-39,37,90,98,'#497354');rect(x-22,17,62,110,'#628653');rect(x-16,29,27,22,'#86a46d');}
   rect(204,55,10,163,'#6b745a');rect(506,55,10,163,'#6b745a');rect(192,38,336,42,'#31594c');text('ДО НОВЫХ ВСТРЕЧ!',360,65,19,'#f2dfb0','center');
   for(let i=0;i<7;i++)rect(242+i*36,86,15,12,['#ddb974','#9fc4b0','#c99594'][i%3]);
   ctx.save();ctx.translate(232,225);ctx.scale(2,2);rect(-7,-9,5,12,'#304758');rect(3,-9,5,12,'#304758');rect(-9,1,8,3,'#ece9d4');rect(2,1,8,3,'#ece9d4');rect(-10,-28,20,21,'#e34d50');rect(-8,-46,17,20,'#294b93');rect(-5,-50,12,6,'#294b93');rect(-6,-40,13,9,'#f3ba92');rect(-3,-37,2,2,'#263c4d');rect(4,-37,2,2,'#263c4d');rect(-2,-28,7,2,'#fff3d4');rect(-13,-24,4,16,'#f3ba92');rect(10,-35-wave,4,17,'#f3ba92');rect(9,-39-wave,6,6,'#f3ba92');ctx.restore();
   ctx.save();ctx.translate(s.index===1?480-Math.sin(phase*Math.PI)*120:s.index===2?520:485,225);ctx.scale(2,2);
   if(s.index===0){drawSupporter({...errands[1].giver,x:0,y:0,moving:false,quiet:true});rect(9,-29-wave,4,16,'#ffc19d');drawQuestBook(23,-34-wave,1,true);}
   if(s.index===1){drawPet({...errands[0].receiver,x:0,y:0});drawQuestBall(-1,-15,.65);}
   if(s.index===2){ctx.scale(.78,.78);ctx.translate(0,-10);drawChess({...parkRides.find(p=>p.id==='chess'),x:0,y:32},false);}
   ctx.restore();text('DEX · 20 лет вместе',360,278,15,'#365647','center');ctx.restore();
  }finally{ctx=savedContext;}
 }

 const SEASON_SECONDS=1200,AUTUMN_AT=600,SNOW_AT=900,SNOW_SECONDS=60,SPRING_AT=990,MELT_END=1050;
 const unit=v=>Math.max(0,Math.min(1,v));
 function seasonPhase(time=elapsed){if(weatherControlled())return parkWeather.mode==='autumn'?720:parkWeather.mode==='snow'?SNOW_AT+Math.min(80,weatherAge(time)):120;return Math.max(0,time)%SEASON_SECONDS;}
 function snowing(time=elapsed){const t=seasonPhase(time);return t>=SNOW_AT&&t<SNOW_AT+SNOW_SECONDS;}
 function snowIntensity(time=elapsed){const t=seasonPhase(time)-SNOW_AT;return t>=0&&t<SNOW_SECONDS?Math.min(1,t/3,(SNOW_SECONDS-t)/6):0;}
 function snowCover(time=elapsed){const t=seasonPhase(time);return t<SNOW_AT?0:t<SPRING_AT?unit((t-SNOW_AT)/24):unit((MELT_END-t)/(MELT_END-SPRING_AT));}
 function seasonState(time=elapsed){const t=seasonPhase(time),id=t<AUTUMN_AT?'summer':t<SNOW_AT?'autumn':t<SPRING_AT?'winter':'spring';return {id,label:{summer:'Лето',autumn:'Осень',winter:'Зима',spring:'Весна'}[id],autumn:t<AUTUMN_AT||t>=SPRING_AT?0:unit((t-AUTUMN_AT)/30),spring:t>=SPRING_AT?unit((t-SPRING_AT)/60)*unit((SEASON_SECONDS-t)/15):0,cold:snowCover(time)};}
 // Deterministic irregular showers: 1:00, 11:00, 26:00, then varying long gaps.
 const rainStarts=[60],rainGaps=[600,900,420,720,540,840];
 function rainEventIndex(time=elapsed){
  if(weatherControlled())return parkWeather.mode==='rain'?100000+parkWeather.serial:-1;
  if(!Number.isFinite(time)||time<55)return -1;
  while(rainStarts[rainStarts.length-1]-5<=time){let next=rainStarts[rainStarts.length-1]+rainGaps[(rainStarts.length-1)%rainGaps.length];const phase=Math.max(0,next)%SEASON_SECONDS;if(phase+18>SNOW_AT&&phase-5<MELT_END)next+=MELT_END+10-phase;rainStarts.push(next);}
  let lo=0,hi=rainStarts.length;while(lo<hi){const mid=(lo+hi)>>1;if(rainStarts[mid]-5<=time)lo=mid+1;else hi=mid;}return lo-1;
 }
 function weatherTime(time=elapsed){if(weatherControlled())return parkWeather.mode==='rain'?25+weatherAge(time):0;const i=rainEventIndex(time),season=seasonPhase(time);if(i<0||season>=SNOW_AT&&season<MELT_END)return 0;return 30+time-rainStarts[i];}
 function rainElapsed(time=elapsed){if(weatherControlled())return parkWeather.mode==='rain'?Math.min(10,Math.max(0,weatherAge(time)-5)):0;const i=rainEventIndex(time);return i<0?0:i*10+Math.max(0,Math.min(10,time-rainStarts[i]));}
 function updateSeasons(previous){
  const before=seasonPhase(previous),now=seasonPhase();
  if(before<AUTUMN_AT&&now>=AUTUMN_AT){announce('В парке осень: золотые кроны и листопад.');if(speechTime<=0){speech='Смотри-ка, парк переоделся в золотое!';speechTime=5;}}
  if(before<SNOW_AT&&now>=SNOW_AT){swiftOrigin=stormBag=null;announce('Началась метель. Снег будет идти одну минуту.');if(speechTime<=0){speech='Вот это поворот… Первый снег!';speechTime=5;}}
  if(elapsed>=SNOW_AT&&!achievements.has('longWalk'))unlockAchievement('longWalk');
  if(before<SNOW_AT+SNOW_SECONDS&&now>=SNOW_AT+SNOW_SECONDS)announce('Метель стихла. Сугробы ещё немного побудут в парке.');
  if(before<SPRING_AT&&now>=SPRING_AT){announce('Пришла весна. Снег постепенно тает, парк снова зеленеет.');if(speechTime<=0){speech='Кажется, мы прогуляли целую зиму!';speechTime=5;}}
  if(now<before)announce('Снова лето! Времена года в парке идут по кругу.');
 }
 const summerTrees=[['#245b40','#327447','#489153','#75ad64'],['#285b49','#357950','#51945b','#84b671'],['#305f40','#417c48','#5d9a51','#91b76b']];
 const fallTrees=[['#68563b','#917044','#b08e50','#cfb576'],['#695640','#95754b','#bc975c','#d1b77c'],['#735840','#a07b4d','#c69b60','#ddbc7c']];
 let seasonalPaletteKey='',seasonalPalette;
 function mixSeasonColor(a,b,amount){const t=unit(amount),n=parseInt(a.slice(1),16),m=parseInt(b.slice(1),16);return '#'+[16,8,0].map(shift=>Math.round(((n>>shift)&255)*(1-t)+((m>>shift)&255)*t).toString(16).padStart(2,'0')).join('');}
 function seasonPalette(){
  const state=seasonState(),fall=Math.round(state.autumn*40)/40,cover=Math.round(state.cold*40)/40,spring=Math.round(state.spring*40)/40,key=fall+':'+cover+':'+spring;
  if(key===seasonalPaletteKey)return seasonalPalette;
  seasonalPaletteKey=key;
  const tint=(base,autumn,winter,fresh)=>mixSeasonColor(mixSeasonColor(mixSeasonColor(base,autumn,fall),fresh,spring),winter,cover);
  seasonalPalette={grass:tint('#719953','#9a9660','#d5dfdb','#81a66b'),grassDark:tint('#577e46','#877444','#a9bab3','#619257'),grassLight:tint('#8fa965','#bba369','#e3eae0','#9abc7d'),trees:summerTrees.map((row,i)=>row.map((c,j)=>tint(c,fallTrees[i][j],['#485c59','#62766c','#899788','#b7c2ab'][j],['#356849','#488655','#6ba464','#a4c384'][j])))};
  return seasonalPalette;
 }
 const seasonGroundTiles=new Map();
 function seasonalGroundTile(x,y){const key=y*COLS+x;if(!seasonGroundTiles.has(key))seasonGroundTiles.set(key,inside(x,y)&&!path(x,y)&&!water(x,y)&&!buildingTile(x,y));return seasonGroundTiles.get(key);}
 function drawSeasonGround(startX,endX,startY,endY){
  const state=seasonState(),cover=state.cold,fall=state.autumn*(1-cover);if(cover<=0&&fall<=0)return;
  ctx.save();
  for(let y=startY;y<endY;y++)for(let x=startX;x<endX;x++){
   if(!seasonalGroundTile(x,y))continue;
   const seed=(Math.imul(x+13,374761393)^Math.imul(y+7,668265263))>>>0,px=x*T+12+seed%9,py=y*T+10+(seed>>>9)%10;
   if(cover>0&&seed%5===0){ctx.globalAlpha=cover*.85;const w=17+(seed>>>5)%13;rect(px-w/2,py,w,8,'#e7eee7');rect(px-w/2+3,py-4,w-5,13,'#eef2e9');rect(px-w/2+2,py+8,w-4,2,'#b1c6c6');if(seed%7===0){rect(px-15,py-3,30,9,'#e7eee7');rect(px-11,py-8,22,6,'#f4f5eb');}}
   if(fall>0&&seed%3===0){ctx.globalAlpha=fall*.72;for(let j=0;j<3;j++)rect(px-9+j*7,py+(seed+j*7)%10,4+j%2,2,['#c4a364','#b6844b','#d2b375'][j]);}
  }
  ctx.restore();
 }
 function snowCap(x,y,width,height=4){const cover=snowCover();if(cover<=0)return;ctx.save();ctx.globalAlpha*=cover;rect(x,y,width,height,'#d4e2df');rect(x+2,y-2,Math.max(1,width-4),Math.max(2,height-1),'#f0f3e9');ctx.restore();}
 function drawSnow(){
  const strength=snowIntensity();if(strength<=0)return;
  ctx.save();ctx.globalAlpha=strength*.055;rect(0,0,viewW,viewH,'#dfebee');
  const t=reduced?0:seasonPhase()-SNOW_AT,count=reduced?18:comfort.lightweight?42:effectCount(110),width=viewW+70,height=viewH+40,wrap=(n,size)=>(n%size+size)%size;
  for(let i=0;i<count;i++){
   const layer=i%3,x=wrap(i*137+t*(48+layer*27)+Math.sin(t*.8+i)*12-camX*.15,width)-35,y=wrap(i*83+t*(22+layer*9)-camY*.1,height)-20;
   ctx.globalAlpha=strength*(.3+layer*.2);rect(x,y,layer===2?3:2,2,'#f5f7ef');if(layer===2){rect(x+1,y-1,1,4,'#f5f7ef');if(!reduced)line(x-6,y-2,x-2,y-1,'#dce8e6',1);}
  }
  if(!reduced&&!comfort.lightweight){ctx.globalAlpha=strength*.13;for(let i=0;i<4;i++){const x=wrap(t*100+i*211,width)-35,y=70+i*95+Math.sin(t+i)*8;line(x-36,y,x,y+9,'#e3eeeb',1);}}
  ctx.restore();
 }

 // Optional seasonal stories and bounded, transient effects. All ages use active game time.
 const snowmanSite={...point([31,49]),kind:'snowman',action:'Слепить снеговика'};
 const snowballSites=[[34,49],[33,51],[31,54]].map((p,id)=>({...point(p),id,kind:'snowball',action:'Собрать снежный ком'}));
 const leafPileSites=[[25,23],[28,24],[28,54],[32,49],[81,32],[35,43]].map((p,id)=>({...point(p),id,readyAt:0}));
 let winterTracks=[],snowPowder=[],leafFlurry=[],leafCatReactions=new Map(),snowFootDistance=0,snowFootSide=1,snowWheelPose=null;
 let snowman={cycle:0,balls:[],built:false,meltedLine:false},fountainShow=null,fountainShowCycle=-1;
 function restoreWonders(v={}){
  winterTracks=[];snowPowder=[];leafFlurry=[];leafCatReactions.clear();snowFootDistance=0;snowWheelPose=null;
  leafPileSites.forEach(p=>p.readyAt=0);
  const cycle=Math.floor((v.elapsed||0)/SEASON_SECONDS),saved=v.snowman;
  snowman={cycle,balls:saved?.cycle===cycle&&Array.isArray(saved.balls)?[...new Set(saved.balls.filter(id=>Number.isInteger(id)&&id>=0&&id<3))]:[],built:saved?.cycle===cycle&&saved.built===true,meltedLine:saved?.cycle===cycle&&saved.meltedLine===true};
  if(snowman.built)snowman.balls=[0,1,2];
  fountainShow=null;fountainShowCycle=Number.isInteger(v.fountainShowCycle)&&v.fountainShowCycle>=0&&v.fountainShowCycle<=Math.floor((v.elapsed||0)/300)?v.fountainShowCycle:-1;
 }
 function snowmanAvailable(){return snowCover()>.3;}
 function snowmanGoal(){return snowmanAvailable()&&!snowman.built?snowballSites.find(p=>!snowman.balls.includes(p.id))||snowmanSite:snowmanSite;}
 function snowmanGoalName(){return !snowmanAvailable()?'Снеговик · ждём снег':snowman.built?'Снеговик DEX':snowman.balls.length<3?'Соберите снежные комья · '+snowman.balls.length+'/3':'Вернитесь и слепите снеговика';}
 function useSnowman(a){
  if(!snowmanAvailable()){speech=snowman.built?'Коллега перешёл на удалёнку. До следующей зимы!':'Здесь будет снеговик. Первый снег — на 15-й минуте!';speechTime=5;return;}
  if(a.kind==='snowball'){
   if(snowman.built||snowman.balls.includes(a.id))return;
   snowman.balls.push(a.id);speech=snowman.balls.length===3?'Три кома есть! Осталось собрать коллегу.':'Ком № '+snowman.balls.length+' готов. Снежная работа!';speechTime=4;
   window.ParkAudio?.snowCrunch?.();
  }else if(snowman.built){speech='Привет, снежный коллега! Шарф тебе идёт.';speechTime=4;return;}
  else if(snowman.balls.length===3){snowman.built=true;speech='Готово! Самый хладнокровный коллега в DEX.';speechTime=5;unlockAchievement('snowSculptor');window.ParkAudio?.reward?.();}
  else{speech='Соберём три снежных кома на этой поляне. Шарф уже готов!';speechTime=5;}
  trackedPlace=snowman.built?-1:snowmanPlace;trackedErrand=-1;navCache=null;save();
 }
 function renderSnowmanGuide(){
  $('snowman-status').textContent=snowman.built?(snowCover()>.05?'✓ Снеговик собран и машет вам веткой. Весной вернётся на удалёнку.':'✓ Снеговик растаял. Шляпа и морковка ждут следующей зимы.'):!snowmanAvailable()?'Необязательная зимняя история на поляне южнее старта. Когда ляжет снег, соберите три кома через E и вернитесь к шарфу DEX.':snowman.balls.length===3?'Все три кома собраны. Вернитесь к шарфу и нажмите E, чтобы слепить снеговика.':'Собрано снежных комьев: '+snowman.balls.length+' / 3. Указатель ведёт к следующему.';
  $('snowman-track').textContent=trackedPlace===snowmanPlace?'Убрать указатель':snowmanAvailable()&&!snowman.built?'Показать путь':'Найти поляну';
 }
 function capWonders(){const max=comfort.lightweight?90:260;if(winterTracks.length>max)winterTracks.splice(0,winterTracks.length-max);if(snowPowder.length>(comfort.lightweight?8:24))snowPowder.splice(0,snowPowder.length-(comfort.lightweight?8:24));if(leafFlurry.length>(comfort.lightweight?12:42))leafFlurry.splice(0,leafFlurry.length-(comfort.lightweight?12:42));}
 function snowUnderfoot(x,y){return snowCover()>.15&&seasonalGroundTile(Math.floor(x/T),Math.floor(y/T));}
 function recordSeasonWalk(before){
  const dx=player.x-before.x,dy=player.y-before.y,d=Math.hypot(dx,dy);if(!d||d>15)return;
  if(snowUnderfoot(player.x,player.y)){
   snowFootDistance+=d;if(snowFootDistance>=19){snowFootDistance%=19;snowFootSide*=-1;const a=Math.atan2(dy,dx);winterTracks.push({kind:'foot',x:player.x-Math.sin(a)*snowFootSide*5,y:player.y+Math.cos(a)*snowFootSide*5,angle:a,life:42});}
  }else snowFootDistance=0;
  if(seasonState().id==='autumn'&&!ridesWet())for(const p of leafPileSites)if(elapsed>=p.readyAt&&Math.hypot(player.x-p.x,player.y-p.y)<30&&canStand(p.x,p.y))scatterLeafPile(p);
  capWonders();
 }
 function scatterLeafPile(p){
  p.readyAt=elapsed+6;const count=reduced?4:comfort.lightweight?7:14;
  for(let i=0;i<count;i++){const a=i*2.4;leafFlurry.push({x:p.x,y:p.y,age:0,vx:Math.cos(a)*(20+i*2),vy:Math.sin(a)*16,lift:14+i%5*5,seed:i});}
  const cat=[...pets.filter(n=>n.kind==='cat'),...wanderers.filter(n=>n.kind==='cat'&&!n.sheltered&&!n.shelter)].filter(n=>Math.hypot(n.x-p.x,n.y-p.y)<175&&!leafCatReactions.has(n)).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
  if(cat)leafCatReactions.set(cat,{until:elapsed+1.5,side:p.x<cat.x?-1:1});
 }
 function recordSnowDrive(before){
  if(snowCover()<=.15||Math.abs(driveSpeed)<12){snowWheelPose=null;return;}
  if(!snowWheelPose)snowWheelPose=before;
  if(Math.hypot(bmw.x-snowWheelPose.x,bmw.y-snowWheelPose.y)<8)return;
  for(const side of [-1,1]){const a=vehiclePoint(snowWheelPose,side*28,-22),b=vehiclePoint(bmw,side*28,-22);if(driveSurface(a.x,a.y)&&driveSurface(b.x,b.y)){winterTracks.push({kind:'tyre',a,b,life:35});if(!reduced)snowPowder.push({...b,age:0,vx:Math.sin(bmw.angle)*25+side*9,vy:-Math.cos(bmw.angle)*25-10});}}
  snowWheelPose={...bmw};capWonders();
 }
 function updateSeasonWonders(dt){
  const cover=snowCover(),wash=1+snowIntensity()*2;
  for(const p of winterTracks)p.life-=dt*wash;winterTracks=cover>.02?winterTracks.filter(p=>p.life>0):[];
  for(const p of snowPowder){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}snowPowder=cover>.02?snowPowder.filter(p=>p.age<.8):[];
  for(const p of leafFlurry){p.age+=dt;if(!reduced){p.x+=p.vx*dt;p.y+=p.vy*dt;}}leafFlurry=seasonState().id==='autumn'?leafFlurry.filter(p=>p.age<2.2):[];
  for(const [cat,r]of leafCatReactions)if(elapsed>=r.until||seasonState().id!=='autumn')leafCatReactions.delete(cat);
  if(!driving||towScene||trafficStop)snowWheelPose=null;
  const cycle=Math.floor(elapsed/SEASON_SECONDS);
  if(snowman.cycle!==cycle)snowman={cycle,balls:[],built:false,meltedLine:false};
  if(snowman.built&&cover<=.03&&!snowman.meltedLine&&Math.hypot(player.x-snowmanSite.x,player.y-snowmanSite.y)<180&&speechTime<=0){speech='Коллега перешёл на удалёнку.';speechTime=5;snowman.meltedLine=true;save();}
  const near=Math.hypot(player.x-42.5*T,player.y-28.5*T),evening=Math.floor(elapsed/300);
  if(!ambientSceneBusy()&&!fountainShow&&fountainShowCycle!==evening&&elapsed%300<274&&speechTime<=0&&!encounterGreeting&&!weatherSpeaking()&&nightLevel()>.6&&near<230&&!momentsBusy()&&rainIntensity()<.1&&!snowing()){
   fountainShow={start:elapsed,beat:-1};fountainShowCycle=evening;announce('Вечерний фонтан! 12 секунд музыки и света · P — сделать снимок.');save();
  }
  if(fountainShow){const age=elapsed-fountainShow.start;if(age>=12){fountainShow=null;}else if(near<350){const beat=Math.floor(age/.6);if(beat!==fountainShow.beat){fountainShow.beat=beat;window.ParkAudio?.fountainNote?.(beat,unit((350-near)/180));}}}
 }
 function fountainShowLevel(){if(!fountainShow)return 0;const t=elapsed-fountainShow.start;return unit(t/1.3)*unit((12-t)/2)*nightLevel();}
 function fountainShowColor(){if(!fountainShow)return '#a1d7df';const colors=['#a8dcd7','#d5b7dd','#f0cf9c'],t=reduced?0:(elapsed-fountainShow.start)/3,i=Math.floor(t)%3;return mixSeasonColor(colors[i],colors[(i+1)%3],t%1);}
 // Short telescope view and a local dawn flock. No independent wall-clock timers.
 const dexConstellation=[
  [[-67,-25],[-67,25],[-49,25],[-37,13],[-37,-13],[-49,-25],[-67,-25]],
  [[2,-25],[-23,-25],[-23,25],[2,25]],[[ -23,0],[-3,0]],
  [[18,-25],[52,25]],[[18,25],[52,-25]]
 ];
 const dexStarEdges=dexConstellation.flatMap(path=>path.slice(1).map((p,i)=>[path[i],p]));
 const dexStarPoints=[...new Map(dexConstellation.flat().map(p=>[p.join(','),p])).values()];
 let dawnFlock=null,dawnFlockCycle=-1;
 function restoreSkyMoments(v={}){
  dawnFlock=null;const max=Math.floor(((v.elapsed||0)-294)/300);
  dawnFlockCycle=Number.isInteger(v.dawnFlockCycle)&&v.dawnFlockCycle>=0&&v.dawnFlockCycle<=max?v.dawnFlockCycle:-1;
 }
 function updateSkyMoments(){
  if(funScene?.kind==='telescope'&&funScene.time>=.65&&!funScene.starChime){funScene.starChime=true;window.ParkAudio?.starlight?.();}
  if(dawnFlock&&(elapsed-dawnFlock.start>=12||ridesWet()||weatherControlled()||snowCover()>.15))dawnFlock=null;
  const cycle=Math.floor((elapsed-294)/300),phase=elapsed-294-cycle*300;
  if(ambientSceneBusy()||cycle<0||phase<0||phase>=12||dawnFlockCycle===cycle||weatherControlled()||ridesWet()||snowCover()>.15||funScene||feedScene||trafficStop||idleEscort)return;
  dawnFlockCycle=cycle;dawnFlock={start:elapsed,x:player.x,y:player.y-24,span:Math.max(260,Math.min(430,viewW)),direction:cycle%2?-1:1};
  window.ParkAudio?.dawnBirds?.();if(!driving)announce('Парк просыпается: птицы встречают рассвет · '+(mobileScreen()?'📷':'P')+' — поймать мгновение.');save();
 }
 function dawnFlockBirds(){
  if(!dawnFlock||ridesWet()||weatherControlled()||snowCover()>.15)return [];
  const age=elapsed-dawnFlock.start;if(age<0||age>=12)return [];
  const u=reduced?.52:age/12,alpha=unit(age/1.5)*unit((12-age)/2),count=reduced?8:comfort.lightweight?10:18,points=[];
  for(let i=0;i<count;i++){
   const side=i%2?1:-1,row=Math.floor((i+1)/2),spread=.3+u*.7;
   const x=dawnFlock.x+dawnFlock.direction*((u-.42)*dawnFlock.span-row*11*spread+(reduced?0:Math.sin(u*5+i*.7)*7*(1-u)));
   const y=dawnFlock.y+28-Math.sin(u*Math.PI*.8)*105+side*row*6*spread;
   points.push({x,y,alpha,seed:i,lift:12+u*80});
  }return points;
 }
 function drawDawnFlockShadows(){
  const birds=dawnFlockBirds();if(!birds.length)return;ctx.save();
  for(const b of birds){const x=b.x+12,y=b.y+b.lift;if(x<camX-20||x>camX+viewW+20||y<camY-20||y>camY+viewH+20)continue;ctx.globalAlpha=b.alpha*.12;rect(x-5,y,10,2,'#304e48');}
  ctx.restore();
 }
 function drawDawnFlock(){
  const birds=dawnFlockBirds();if(!birds.length)return;ctx.save();
  for(const b of birds){if(b.x<camX-20||b.x>camX+viewW+20||b.y<camY-20||b.y>camY+viewH+20)continue;
   ctx.globalAlpha=b.alpha*.9;const wing=reduced?-3:Math.sin((elapsed-dawnFlock.start)*10+b.seed*.7)*5;
   line(b.x-8,b.y+wing,b.x,b.y,'#36515b',2);line(b.x,b.y,b.x+8,b.y+wing,'#36515b',2);rect(b.x-1,b.y-1,3,5,'#314852');rect(b.x-1,b.y-2,2,1,'#d4b980');
  }ctx.restore();
 }
 function telescopeViewLayout(){const r=Math.max(35,Math.min(118,(viewW-32)/2,viewH*.27));return {x:viewW/2,y:viewH*.38,r,font:Math.min(25,Math.max(12,12*viewH/viewCSSHeight))};}
 function drawTelescopeView(){
  if(funScene?.kind!=='telescope'||capturingPhoto)return;
  const t=funScene.time,layout=telescopeViewLayout(),{x,y,r,font}=layout,scale=r/100;
  const fade=unit(t/.4)*unit((4-t)/.35),trace=reduced?1:unit((t-.45)/2.1);ctx.save();ctx.globalAlpha=fade;
  ctx.fillStyle='#18353f';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#c4b584';ctx.lineWidth=3;ctx.stroke();
  ctx.strokeStyle='#607d7b';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r-6,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<(comfort.lightweight?20:38);i++){const a=i*2.399,rho=(18+(i*23)%67)*scale,px=x+Math.cos(a)*rho,py=y+Math.sin(a)*rho;rect(px,py,i%6===0?2:1,1,i%3?'#6a969e':'#c5c8a4');}
  ctx.save();ctx.translate(x+7*scale,y-6*scale);ctx.scale(scale,scale);
  dexStarEdges.forEach(([a,b],i)=>{const f=unit(trace*dexStarEdges.length-i);if(f>0)line(a[0],a[1],a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,'#b3d6d3',1.5);});
  for(const [sx,sy]of dexStarPoints){rect(sx-3,sy-3,7,7,'#e9cf8520');rect(sx-1,sy-2,2,5,'#f5dfac');rect(sx-2,sy-1,4,2,'#f5dfac');}
  if(visitCount('telescope')===1){const u=reduced?.52:unit((t-.35)/3.1),ux=-66+u*127,uy=-51+(reduced?0:Math.sin(u*Math.PI)*6);rect(ux-8,uy-7,16,6,'#a8cbd0');rect(ux-16,uy,32,4,'#789fa2');rect(ux-12,uy+4,24,3,'#bbba8b');rect(ux-7,uy+5,3,2,'#edce8d');rect(ux+4,uy+5,3,2,'#edce8d');}
  ctx.restore();
  text(trace>.9?'DEX · 20 лет вместе':'Соединяем звёзды…',x,y+r*.64,font*.8,'#f2dfb5','center');
  ctx.fillStyle='#23453ee8';ctx.fillRect(x-r,y+r+7,r*2,font+12);text('Созвездие DEX',x,y+r+font+8,font,'#f5e6bf','center');ctx.restore();
 }
 function dawnMistLevel(){if(weatherControlled())return 0;if(elapsed<294)return 0;const t=(elapsed-294)%300;return t<26?unit(t/4)*unit((26-t)/12)*(1-rainIntensity())*(1-snowIntensity())*(1-snowCover()):0;}
 function drawDawnMist(){
  const level=dawnMistLevel(),x=37*T+16,y=35*T+12;if(level<=0||x+120<camX||x-120>camX+viewW||y+60<camY||y-70>camY+viewH)return;
  ctx.save();const count=comfort.lightweight?4:7;
  for(let i=0;i<count;i++){const drift=reduced?0:Math.sin(elapsed*.25+i)*12,w=105+(i*23)%65,py=y-44+i*11;ctx.globalAlpha=level*(i%2?.07:.1);rect(x-w/2+drift,py,w,14,'#eef0de');rect(x-w/2+12+drift,py-4,w-28,22,'#edf0de');}
  if(!comfort.lightweight&&nightLevel()<.4){ctx.globalAlpha=level*.085;ctx.fillStyle='#fff1c5';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-30+i*35,y-70);ctx.lineTo(x-20+i*35,y-70);ctx.lineTo(x-55+i*35,y+42);ctx.lineTo(x-80+i*35,y+42);ctx.closePath();ctx.fill();}}
  ctx.restore();
 }
 function drawWinterRoadDust(){const cover=snowCover();if(!cover)return;ctx.save();ctx.globalAlpha=cover*.22;ctx.lineWidth=120;ctx.strokeStyle='#d9e5e5';ctx.lineJoin='round';for(const pts of [motorLoop,motorAccess]){ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x*T,y*T):ctx.moveTo(x*T,y*T));ctx.stroke();}rect(parking.x,parking.y,parking.w,parking.h,'#d9e5e5');ctx.restore();}
 function drawWinterTracks(){
  const cover=snowCover();if(!cover)return;ctx.save();
  for(const p of winterTracks){const x=p.kind==='foot'?p.x:p.b.x,y=p.kind==='foot'?p.y:p.b.y;if(x<camX-20||x>camX+viewW+20||y<camY-20||y>camY+viewH+20)continue;ctx.globalAlpha=cover*Math.min(1,p.life/8)*(p.kind==='foot'?.42:.25);
   if(p.kind==='foot'){ctx.save();ctx.translate(x,y);ctx.rotate(p.angle);rect(-3,-2,7,4,'#647e85');rect(-2,-2,4,1,'#9db4b8');ctx.restore();}else{line(p.a.x,p.a.y,p.b.x,p.b.y,'#324e59',4);line(p.a.x+1,p.a.y,p.b.x+1,p.b.y,'#aec5c9',1);}
  }ctx.restore();
 }
 function drawSnowPowder(){if(reduced)return;ctx.save();for(const p of snowPowder){const u=p.age/.8,r=3+u*8;ctx.globalAlpha=(1-u)*snowCover()*.45;rect(p.x-r,p.y-r,r*2,r,'#f1f4eb');rect(p.x-r+2,p.y-r-3,r*1.4,r,'#e1ebea');}ctx.restore();}
 function drawLeafPiles(){if(seasonState().id!=='autumn')return;ctx.save();for(const p of leafPileSites){if(!canStand(p.x,p.y)||p.x<camX-30||p.x>camX+viewW+30||p.y<camY-20||p.y>camY+viewH+20)continue;const grow=unit((elapsed-p.readyAt+6)/6);ctx.globalAlpha=seasonState().autumn*(.2+grow*.65);for(let i=0;i<13;i++)rect(p.x-21+(i*17)%40,p.y-7+(i*7)%15,6+i%3,3,['#b58b52','#d3b273','#af794c'][i%3]);}ctx.restore();}
 function drawLeafFlurry(){ctx.save();for(const p of leafFlurry){const u=p.age/2.2;ctx.globalAlpha=(1-u)*.85;ctx.save();ctx.translate(p.x,p.y-(reduced?0:Math.sin(u*Math.PI)*p.lift));if(!reduced)ctx.rotate(p.age*4+p.seed);rect(-3,-1,7,3,['#d3b273','#b58b52','#c59760'][p.seed%3]);rect(-1,-2,2,5,'#dfbe82');ctx.restore();}ctx.restore();}
 function drawLeafCat(cat,paint){if(umbrellaShake?.cat===cat){const p=umbrellaCatPose(cat);ctx.save();ctx.translate(p.x,p.y);paint();ctx.restore();return;}const r=leafCatReactions.get(cat);if(!r){paint();return;}const u=unit((r.until-elapsed)/1.5),hop=reduced?0:Math.sin((1-u)*Math.PI)*13;ctx.save();ctx.translate(0,-hop);paint();if(cat.kind==='cat')rect(cat.x+r.side*10,cat.y-16,8*r.side,-5,'#dbab72');ctx.restore();}
 function drawSnowman(){
  const {x,y}=snowmanSite;if(x<camX-220||x>camX+viewW+220||y<camY-220||y>camY+viewH+220)return;
  const level=snowCover();ctx.save();
  if(!snowman.built){rect(x-15,y-10,30,14,'#94764f');rect(x-11,y-14,22,5,'#bd9964');rect(x-10,y-15,20,6,'#528a98');rect(x+4,y-10,6,12,'#528a98');text('DEX',x,y-10,7,'#f4e8c4','center');}
  else if(level>.03){ctx.translate(x,y);ctx.scale(1,.25+level*.75);rect(-21,1,42,5,'#90afb04d');const ball=(cx,cy,r)=>{rect(cx-r,cy-r*.65,r*2,r*1.3,'#c5dadb');rect(cx-r*.75,cy-r,r*1.5,r*2,'#ecf2e8');rect(cx-r*.55,cy-r*.7,r*.5,r*.5,'#ffffff99');};ball(0,-13,19);ball(0,-35,14);ball(0,-55,10);rect(-13,-66,26,4,'#344e5f');rect(-9,-77,18,12,'#344e5f');rect(-9,-68,18,3,'#9aadb0');rect(-13,-46,26,5,'#448795');rect(7,-44,6,16,'#448795');text('DEX',0,-41,7,'#fff1d0','center');rect(-4,-58,2,2,'#334b53');rect(4,-58,2,2,'#334b53');rect(0,-53,10,3,'#d69960');rect(0,-34,2,2,'#55737c');rect(0,-25,2,2,'#55737c');line(-12,-36,-31,-43,'#876c51',2);const wave=!reduced&&Math.hypot(player.x-x,player.y-y)<150?Math.sin(elapsed*3)*7:0;line(12,-36,29,-50+wave,'#876c51',2);line(29,-50+wave,26,-58+wave,'#876c51',1);line(29,-50+wave,35,-54+wave,'#876c51',1);}
  else{rect(x-16,y-2,31,9,'#aac4bb66');rect(x-12,y-3,24,4,'#344e5f');rect(x-8,y-10,16,8,'#344e5f');rect(x+16,y+3,10,3,'#d69960');rect(x-20,y+6,16,4,'#448795');}
  ctx.restore();
  if(!snowman.built&&snowmanAvailable())for(const p of snowballSites){if(snowman.balls.includes(p.id))continue;rect(p.x-11,p.y-6,22,10,'#bdd4d5');rect(p.x-8,p.y-11,16,17,'#f3f5eb');rect(p.x-5,p.y-9,5,4,'#fffef4');if(Math.hypot(player.x-p.x,player.y-p.y)<85)mapLabel('Снежный ком · E',p.x,p.y-27,10,1);}
 }
 function drawFountainShowGlow(){const strength=fountainShowLevel();if(strength<=0)return;const cx=42.5*T,cy=28.5*T;ctx.save();ctx.translate(-camX,-camY);ctx.globalAlpha=strength*.08;ctx.fillStyle=fountainShowColor();ctx.beginPath();ctx.ellipse(cx,cy+8,60,29,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=strength*.7;for(let i=0;i<8;i++){const a=i*Math.PI/4;rect(cx+Math.cos(a)*41-2,cy+Math.sin(a)*25-2,4,3,fountainShowColor());}ctx.restore();}

 // Small park stories share the game clock and never add required quest objectives.
 const winterCache={...point([77,43]),kind:'winterCache',action:'Раскопать запас белки'};
 let squirrelStory={cycle:0,watched:false,stage:0},squirrelScene=null;
 let teaTime=0,teaCooldown=0,snowVisitors=[],snowAudienceCycle=-1;
 let noticeQueue=[],activeNotice=null,noticeGap=0;
 const METEOR_AT=286;
 function restoreStories(v={}){
  const cycle=Math.floor((v.elapsed||0)/SEASON_SECONDS),s=v.squirrelStory;
  squirrelStory={cycle,watched:s?.cycle===cycle&&s.watched===true,stage:s?.cycle===cycle&&[0,1,2,3].includes(s.stage)?s.stage:0};
  squirrelScene=null;teaTime=teaCooldown=0;snowVisitors=[];snowAudienceCycle=-1;
  noticeQueue=[];activeNotice=null;noticeGap=0;noticeTime=0;
 }
 function weatherSpeaking(){const t=weatherTime();return t>=25&&t<29.8||t>=30&&t<34;}
 function notificationBusy(){return !!idleEscort||blocked()||speechTime>0||residentRemark>0||!!encounterGreeting||weatherSpeaking()||!!funScene||!!feedScene||!!towScene||!!trafficStop||wheelTime>0||swingTime>0||karaokeTime>0||pumpTime>0||petTime>0;}
 function noticeHidden(){return blocked()||!noticeAllowed(activeNotice)||(!activeNotice?.urgent&&notificationBusy());}
 function showNotice(n){activeNotice=n;$('announcement').textContent=n.text;$('announcement').scrollTop=0;if($('announcement').parentElement)$('announcement').parentElement.scrollTop=0;noticeTime=Math.min(12,Math.max(4,n.text.length/16));}
 function queueNotice(message,options={}){
  const text=mobileCopy(message);rememberMessage(text);const key=options.key||text;
  if(activeNotice?.key===key&&noticeTime>0||noticeQueue.some(n=>n.key===key))return;
  const n={text,key,scope:options.scope||'',urgent:options.urgent===true,expires:elapsed+(options.ttl||120)};
  if(n.urgent){if(activeNotice&&noticeTime>0&&!activeNotice.urgent)noticeQueue.unshift(activeNotice);showNotice(n);}
  else if(noticeAllowed(n)&&!notificationBusy()&&(noticeTime<=0||!noticeAllowed(activeNotice))&&noticeGap<=0){if(activeNotice&&noticeTime>0)noticeQueue.unshift(activeNotice);showNotice(n);}
  else noticeQueue.push(n);
  if(noticeQueue.length>8)noticeQueue.splice(0,noticeQueue.length-8);
 }
 function updateNotices(dt){
  noticeQueue=noticeQueue.filter(n=>n.expires>elapsed);
  if(activeNotice&&!noticeAllowed(activeNotice)){noticeQueue.unshift(activeNotice);activeNotice=null;noticeTime=0;if(noticeQueue.length>8)noticeQueue.length=8;}
  if(blocked()||notificationBusy())return;
  if(noticeTime>0){noticeTime=Math.max(0,noticeTime-dt);if(noticeTime===0){activeNotice=null;noticeGap=.5;}return;}
  if(notificationBusy())return;
  noticeGap=Math.max(0,noticeGap-dt);if(noticeGap===0){const index=noticeQueue.findIndex(noticeAllowed);if(index>=0)showNotice(noticeQueue.splice(index,1)[0]);}
 }
 function squirrelHome(){return extraSpots.find(p=>p.kind==='squirrel');}
 function squirrelGoal(){return squirrelStory.stage===1?winterCache:squirrelHome();}
 function squirrelGoalName(){return squirrelStory.stage===1?'Найдите запас по следам':squirrelStory.stage===2?'Верните запас белке':'Белкины запасы';}
 function useWinterSquirrel(a){
  clearInput();player.vx=player.vy=0;
  if(a.kind==='winterCache'){
   if(squirrelStory.stage!==1)return;
   squirrelStory.stage=2;speech='Нашёл! Целый ореховый резерв. Отнесу белке.';
  }else if(squirrelStory.stage===2){
   squirrelStory.stage=3;speech='Белка: «Спасибо! Зимний бюджет спасён». ';unlockAchievement('winterKeeper');window.ParkAudio?.reward?.();
  }else if(squirrelStory.stage===3){speech='Белка: «Запас есть. Теперь можно смотреть на снег». ';speechTime=4;return;}
  else if(snowCover()>.15||squirrelStory.stage===1){squirrelStory.stage=1;speech='Белка забыла свой запас. Следы ведут к северо-востоку, к маленькому сугробу!';}
  else{speech='Осенью белка прячет орехи, а зимой ей пригодится помощь.';speechTime=4;return;}
  speechTime=5;trackedPlace=squirrelStory.stage===3?-1:squirrelPlace;trackedErrand=-1;navCache=null;save();
 }
 function renderSquirrelGuide(){
  $('squirrel-status').textContent=squirrelStory.stage===3?'✓ Зимний запас возвращён. Следующей зимой история повторится.':squirrelStory.stage===2?'Ореховый запас у вас. Вернитесь к белке у большого дерева в восточном саду.':squirrelStory.stage===1?'Поищите маленький сугроб к северо-востоку от белки. К нему ведут парные следы.':squirrelStory.watched?'Вы видели, как белка спрятала орех. Вернитесь зимой — вдруг ей понадобится помощь?':'Необязательная история: осенью белка прячет орех, зимой можно помочь найти запас. Начать можно и без встречи осенью.';
  $('squirrel-track').textContent=trackedPlace===squirrelPlace?'Убрать указатель':'Показать путь';
 }
 function squirrelPose(){
  const home=squirrelHome();if(!squirrelScene)return {...home,phase:'idle',face:1};
  const age=elapsed-squirrelScene.start,route=squirrelScene.route,total=route.length-1;
  let u=age<3?age/3:age<6?1:1-unit((age-6)/3);const p=u*total,i=Math.min(total-1,Math.floor(p)),f=p-i;
  return {x:route[i].x+(route[i+1].x-route[i].x)*f,y:route[i].y+(route[i+1].y-route[i].y)*f,phase:age<3?'carry':age<5?'dig':age<6?'look':'return',face:age<6?1:-1};
 }
 function drawStorySquirrel(){
  const p=squirrelPose(),bob=reduced?0:p.phase==='dig'?Math.sin(elapsed*9)*2:p.phase==='carry'||p.phase==='return'?Math.abs(Math.sin(elapsed*10))*2:0;
  ctx.save();ctx.translate(p.x,p.y-bob);ctx.scale(p.face,1);rect(-16,1,32,4,'#3b604644');rect(-21,-36,13,29,'#bf7946');rect(-25,-38,14,14,'#d69a60');rect(-10,-24,19,24,'#cf8c51');rect(-3,-35,16,14,'#dda76f');rect(-3,-41,4,8,'#bd7647');rect(7,-41,4,8,'#bd7647');rect(8,-30,2,2,'#2b4039');rect(6,-21,8,5,'#ebc290');rect(-9,-3,9,5,'#bc7949');rect(4,-3,9,5,'#bc7949');
  if(p.phase==='carry'){rect(9,-22,7,7,'#946438');rect(8,-23,9,2,'#6d5034');}
  if(p.phase==='dig'){rect(10,-9,7,4,'#ebc290');for(let i=0;i<3;i++)rect(15+i*5,2-(reduced?0:Math.abs(Math.sin(elapsed*8+i))*5),3,2,'#927448');}if(p.phase==='look'&&!reduced)rect(8+Math.sin(elapsed*5)*2,-30,2,2,'#2b4039');ctx.restore();
 }
 function drawWinterCache(){
  const home=squirrelHome(),visible=snowCover()>.15||squirrelStory.stage>0;
  if(!visible||squirrelStory.stage>=2)return;
  ctx.save();ctx.globalAlpha=snowCover()>.15?.55:.25;
  for(let i=1;i<9;i++){const u=i/9,x=home.x+(winterCache.x-home.x)*u,y=home.y+(winterCache.y-home.y)*u;rect(x-1,y-4,3,2,'#617a7d');rect(x+2,y+3,3,2,'#617a7d');}ctx.restore();
  rect(winterCache.x-14,winterCache.y-5,28,8,snowCover()>.15?'#bdd2d0':'#a68c64');rect(winterCache.x-10,winterCache.y-10,20,10,snowCover()>.15?'#edf1e5':'#bea077');rect(winterCache.x-2,winterCache.y-4,4,2,'#859b95');
 }
 function coldCafe(){return snowCover()>.1||seasonState().id==='autumn'||rainIntensity()>.15;}
 function drinkTea(){
  closeActivity();clearInput();player.vx=player.vy=0;
  if(teaCooldown>0){speech='Чашка ещё тёплая. Не будем торопиться.';speechTime=3;return;}
  teaTime=10;teaCooldown=18;speech='Теперь можно и ещё один круг по парку.';speechTime=4;window.ParkAudio?.ui?.();
 }
 function drawSteam(x,y,strength=1){ctx.save();const count=comfort.lightweight?2:3;for(let i=0;i<count;i++){const u=reduced?.45:(elapsed*.6+i/count)%1;ctx.globalAlpha=(1-u)*strength*.65;rect(x+Math.sin(u*5+i)*3,y-u*20,2,5,'#f0eee2');}ctx.restore();}
 function drawCafeWarmth(){
  if(!coldCafe()&&nightLevel()<.2)return;const b=buildings[2],x=b.tx*T,y=b.ty*T;
  ctx.save();ctx.globalAlpha=.2+snowCover()*.1+nightLevel()*.12;rect(x+4,y+11,b.w*T-8,36,'#f4ca81');ctx.restore();
  for(let i=0;i<b.w;i++){rect((b.tx+i)*T+8,y+16,16,22,'#e6cc94');rect((b.tx+i)*T+10,y+18,3,18,'#fff0c277');}
  const c=extraSpots.find(p=>p.kind==='coffee');if(coldCafe())drawSteam(c.x-1,c.y-29,.75);
 }
 function drawTeaHands(){if(teaTime<=0||driving||cycling||funScene||wheelTime>0||swingTime>0||karaokeTime>0)return;const x=player.x,y=player.y;
  rect(x-10,y-28,8,5,'#f3c399');rect(x+2,y-28,8,5,'#f3c399');rect(x-5,y-32,11,12,'#f5e6c8');rect(x-4,y-33,9,3,'#af8259');rect(x+6,y-29,4,6,'#f5e6c8');rect(x-4,y-25,9,2,'#6b9994');drawSteam(x,y-35);
 }
 function makeSnowVisitor(kind,start,goal){const home=point(start),target=point(goal),route=lifePath(home,goal);return route.length?{kind,...home,home,target,path:route,state:'approach',hold:0,stride:0,moving:false,face:1,color:'#acb3ae',hair:'#665348',shirt:kind==='child'?'#c4a267':'#778da1',style:kind==='child'?'plain':'plaid',heightScale:kind==='child'?.68:1,age:0}:null;}
 function updateSnowVisitors(dt){
  const cycle=Math.floor(elapsed/SEASON_SECONDS),available=snowman.built&&snowCover()>.25;
  if(!available){snowVisitors=[];return;}
  if(snowAudienceCycle!==cycle&&!snowing()&&Math.hypot(player.x-snowmanSite.x,player.y-snowmanSite.y)<280){
   snowAudienceCycle=cycle;snowVisitors=[makeSnowVisitor('adult',[27,53],[33,49]),makeSnowVisitor('child',[27,54],[32,48]),makeSnowVisitor('cat',[35,54],[30,49])].filter(Boolean);
  }
  for(const n of snowVisitors){n.age+=dt;n.moving=false;if(n.state==='done')continue;
   if(n.state==='watch'){n.hold+=dt;n.face=snowmanSite.x<n.x?-1:1;if(n.hold>=7){n.state='leave';n.path=lifePath(n,[Math.floor(n.home.x/T),Math.floor(n.home.y/T)]);}continue;}
   const target=n.path[0];if(!target){n.state=n.state==='leave'?'done':'watch';continue;}
   const dx=target.x-n.x,dy=target.y-n.y,d=Math.hypot(dx,dy),step=Math.min(d,(n.kind==='cat'?42:58)*dt),x=n.x+dx/(d||1)*step,y=n.y+dy/(d||1)*step;
   if(Math.hypot(x-player.x,y-player.y)<23||!lifeClear(x,y))continue;
   n.x=x;n.y=y;n.moving=true;n.stride+=dt*9;if(Math.abs(dx)>.1)n.face=Math.sign(dx);if(d<=step+.01)n.path.shift();
  }
  snowVisitors=snowVisitors.filter(n=>n.state!=='done');
 }
 function drawSnowVisitor(n){ctx.save();ctx.globalAlpha=unit(n.age/2)*unit(snowCover()/.3);
  if(n.kind==='cat'){drawWanderer(n);if(n.state==='watch'){rect(n.x+n.face*20,n.y-13,3,2,'#eadbc2');if(!reduced)rect(n.x+n.face*23,n.y-14-Math.sin(elapsed*5),2,2,'#d9d7c7');}}
  else{const wave=n.state==='watch'&&n.kind==='child';drawSupporter({...n,quiet:true,y:n.y-(n.moving&&!reduced?Math.abs(Math.sin(n.stride))*1.5:0)});if(wave){const h=n.heightScale,armX=n.x+(snowmanSite.x<n.x?-1:1)*12;line(armX,n.y-28*h,armX,n.y-43*h+(reduced?0:Math.sin(elapsed*5)*3),'#e7b697',4);}if(n.state==='watch'&&n.kind==='adult')text('♥',n.x,n.y-67,11,'#d7aa9b','center');}
  ctx.restore();
 }
 function updateStories(dt){
  const cycle=Math.floor(elapsed/SEASON_SECONDS);if(squirrelStory.cycle!==cycle){squirrelStory={cycle,watched:false,stage:0};squirrelScene=null;snowVisitors=[];snowAudienceCycle=-1;}
  teaTime=Math.max(0,teaTime-dt);teaCooldown=Math.max(0,teaCooldown-dt);
  if(driving||funScene)teaTime=0;
  const home=squirrelHome();if(!ambientSceneBusy()&&!squirrelStory.watched&&seasonState().id==='autumn'&&!momentsBusy()&&!ridesWet()&&Math.hypot(player.x-home.x,player.y-home.y)<260){
   const route=[{x:home.x,y:home.y},...lifePath(home,[Math.floor(winterCache.x/T),Math.floor(winterCache.y/T)])];if(route.length>1){squirrelStory.watched=true;squirrelScene={start:elapsed,route};save();}
  }
  if(squirrelScene&&(elapsed-squirrelScene.start>=9||seasonState().id!=='autumn'))squirrelScene=null;
  updateSnowVisitors(dt);
 }

 // Footfalls follow actual collision-resolved movement, never a held key or a teleport.
 let footDistance=0,lastFootSound=-1;
 function footSurface(x,y){
  if(snowUnderfoot(x,y))return 'snow';
  const gazebo=extraSpots.find(p=>p.kind==='gazebo');
  if(Math.abs(x-gazebo.x)<38&&Math.abs(y-gazebo.y)<18)return 'wood';
  if(path(Math.floor(x/T),Math.floor(y/T))||onSidewalk(x,y)||onMotorRoad(x,y)||x>=parking.x&&x<=parking.x+parking.w&&y>=parking.y&&y<=parking.y+parking.h)return 'path';
  return seasonState().id==='autumn'&&!ridesWet()?'leaves':'grass';
 }
 function recordFootsteps(before){
  const d=Math.hypot(player.x-before.x,player.y-before.y);
  if(d<=.01||d>15||driving){footDistance=0;return;}
  footDistance+=d;
  if(footDistance>=42&&elapsed-lastFootSound>=.18){footDistance%=42;lastFootSound=elapsed;window.ParkAudio?.footstep?.(footSurface(player.x,player.y));}
 }

 // Bubbles are cosmetic: they never add obstacles or change quest completion.
 const bubbleHost={...point([32,49]),kind:'bubbles',action:'Большой пузырь · запустить'};
 let soapBubbles=[],bubbleBursts=[],bubblePops=0,bubbleClock=1,bubbleBlow=0,bubbleSoundAt=-1,bubbleShowWait=6,bubbleTap=null;
 function restoreBubbles(v={}){soapBubbles=[];bubbleBursts=[];bubblePops=Number.isInteger(v.bubblePops)?Math.max(0,Math.min(10,v.bubblePops)):0;bubbleClock=1;bubbleBlow=0;bubbleSoundAt=-1;bubbleShowWait=6;bubbleTap=null;footDistance=0;lastFootSound=-1;}
 function bubbleWeather(){return !ridesWet()&&snowCover()<.15;}
 function blowBubbles(){
  if(!bubbleWeather())return;
  bubbleBlow=1.4;
  const limit=comfort.lightweight||reduced?8:14,count=comfort.lightweight||reduced?2:3;
  for(let i=0;i<count&&soapBubbles.length<limit;i++){
   const seed=Math.random()*Math.PI*2;
   soapBubbles.push({x:bubbleHost.x+23+i*13,y:bubbleHost.y-37+i*10,r:12+i*4+Math.random()*3,age:0,life:10+Math.random()*3,seed,vx:6+i*5+Math.random()*4,vy:(i-1)*11+Math.random()*4});
  }
 }
 // One large bubble at a time, within the same bounded particle pool.
 function blowBigBubble(){
  if(!bubbleWeather()||soapBubbles.some(b=>b.big&&b.age<b.life))return false;
  const limit=comfort.lightweight||reduced?8:14;
  if(soapBubbles.length>=limit)soapBubbles.pop();
  soapBubbles.push({x:bubbleHost.x+64,y:bubbleHost.y-61,r:34,age:0,life:14,seed:Math.random()*6.28,vx:4,vy:-.5,big:true});
  bubbleBlow=2;bubbleShowWait=24;completePinned('bubbles');return true;
 }
 function useBubbles(){
  clearInput();player.vx=player.vy=0;
  if(!bubbleWeather())speech='Пережду непогоду. У пузырей сегодня слишком короткий отпуск!';
  else{blowBubbles();blowBigBubble();bubbleClock=5;speech='Большой пузырь готов к полёту! Лопайте касанием или на ходу. Проверено: '+bubblePops+' / 10.';}
  speechTime=5;
 }
 function canPopBubbles(){return !blocked()&&!guardedInput()&&!driving&&!idleEscort&&!idleExempt()&&!observing;}
 function popSoapBubble(b,byPlayer=true){
  if(!b||b.age>=b.life)return false;
  b.age=b.life;bubbleBursts.push({x:b.x,y:b.y,r:b.r,age:0});bubbleBursts=bubbleBursts.slice(-8);
  if(elapsed-bubbleSoundAt>.1){window.ParkAudio?.bubblePop?.();bubbleSoundAt=elapsed;}
  if(byPlayer&&bubblePops<10){bubblePops++;if(bubblePops===10)unlockAchievement('bubbles');else save();}
  return true;
 }
 function popBubbleAt(x,y){
  if(!canPopBubbles()||!Number.isFinite(x)||!Number.isFinite(y))return false;
  const b=[...soapBubbles].reverse().find(b=>b.age>.25&&b.age<b.life&&Math.hypot(b.x-player.x,b.y-player.y)<430&&Math.hypot(b.x-x,b.y-y)<b.r+7);
  if(!b)return false;notePlayActivity();return popSoapBubble(b);
 }
 function bubblePointerDown(e){if(e.button>0||!canPopBubbles())return;bubbleTap={id:e.pointerId,x:e.clientX,y:e.clientY};}
 function bubblePointerUp(e){
  const tap=bubbleTap;bubbleTap=null;
  if(!tap||tap.id!==e.pointerId||Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>10)return;
  const box=canvas.getBoundingClientRect();if(box.width<=0||box.height<=0)return;
  if(popBubbleAt(camX+(e.clientX-box.left)*viewW/box.width,camY+(e.clientY-box.top)*viewH/box.height))e.preventDefault();
 }
 function updateBubbles(dt){
  bubbleBlow=Math.max(0,bubbleBlow-dt);bubbleClock-=dt;
  const near=Math.hypot(player.x-bubbleHost.x,player.y-bubbleHost.y)<330;
  if(!ambientSceneBusy()&&near&&bubbleWeather()&&!idleEscort){bubbleShowWait-=dt;if(bubbleShowWait<=0)blowBigBubble();}
  if(bubbleClock<=0){bubbleClock=5;if(!ambientSceneBusy()&&Math.hypot(player.x-bubbleHost.x,player.y-bubbleHost.y)<650&&!idleEscort)blowBubbles();}
  for(const p of bubbleBursts)p.age+=dt;
  bubbleBursts=bubbleBursts.filter(p=>p.age<.4);
  const touch=canPopBubbles();
  for(const b of soapBubbles){
   b.age+=dt;
   if(!bubbleWeather())b.age=Math.max(b.age,b.life-.45);
   if(!reduced){b.x+=(b.vx+windGust()*(b.big?5:9))*dt;b.y+=(b.vy+Math.sin(b.age*1.8+b.seed)*(b.big?3:7))*dt;}
   if(touch&&b.age>.25&&b.age<b.life&&Math.hypot(b.x-player.x,b.y-(player.y-28))<b.r+12)popSoapBubble(b);
  }
  soapBubbles=soapBubbles.filter(b=>b.age<b.life);
 }
 // Reuse a roaming cat; the chase never moves it through a solid object.
 function updateCatBubble(n,dt,seek){
  if(n.kind!=='cat')return false;
  const release=()=>{n.bubbleTarget=null;n.bubblePaw=0;n.bubbleRoute=[];};
  if(seek||reduced||!bubbleWeather()||n.visit||n.shelter||idleEscort){release();return false;}
  n.bubblePaw=Math.max(0,(n.bubblePaw||0)-dt);n.bubbleRest=Math.max(0,(n.bubbleRest||0)-dt);n.bubbleRepath=Math.max(0,(n.bubbleRepath||0)-dt);
  let b=n.bubbleTarget;
  if(!b||b.age>=b.life||!soapBubbles.includes(b)){b=soapBubbles.find(b=>b.big&&b.age>1&&b.age<b.life&&Math.hypot(n.x-b.x,n.y-(b.y+28))<360);n.bubbleRepath=0;n.bubbleRoute=[];}
  if(!b){release();return false;}
  const target={x:b.x-18,y:b.y+32},distance=Math.hypot(target.x-n.x,target.y-n.y);
  if(!lifeClear(target.x,target.y)){release();return false;}
  n.bubbleTarget=b;n.face=b.x<n.x?-1:1;
  if(distance>21){
   let goal=target;const heroBlocks=segmentDistance(player.x,player.y,[n.x,n.y],[target.x,target.y])<28;
   if(!clearSegment(n,target)||heroBlocks){
    if(!n.bubbleRepath){n.bubbleRoute=lifePath(n,[Math.floor(target.x/T),Math.floor(target.y/T)],player);n.bubbleRepath=1;}
    while(n.bubbleRoute?.length&&Math.hypot(n.bubbleRoute[0].x-n.x,n.bubbleRoute[0].y-n.y)<3)n.bubbleRoute.shift();
    goal=n.bubbleRoute?.[0];if(!goal)return true;
   }
   const dx=goal.x-n.x,dy=goal.y-n.y,d=Math.hypot(dx,dy),step=Math.min(d,dt*52),x=n.x+dx/(d||1)*step,y=n.y+dy/(d||1)*step;
   if(lifeClear(x,y)&&Math.hypot(x-player.x,y-player.y)>25){n.x=x;n.y=y;n.moving=true;n.stride+=dt*9;}
  }else if(!n.bubbleRest){n.bubblePaw=.65;n.bubbleRest=2.6;}
  n.path=[];return true;
 }
 function drawBubbleHost(){
  const {x,y}=bubbleHost,blowing=bubbleWeather()&&bubbleBlow>0;
  ctx.save();ctx.translate(x,y);rect(-12,0,25,4,'#365c3b55');
  rect(-7,-12,6,14,'#526170');rect(2,-12,6,14,'#526170');rect(-9,0,9,4,'#ebe6d5');rect(2,0,9,4,'#ebe6d5');
  rect(-10,-30,20,21,'#77a8ad');rect(-7,-28,14,4,'#adcecb');rect(-14,-28,5,17,'#77a8ad');rect(-14,-13,5,6,'#edbd96');
  rect(-8,-45,16,17,'#edbd96');rect(-9,-49,18,8,'#76563f');rect(-7,-51,13,4,'#76563f');rect(-4,-39,2,2,'#344d45');rect(4,-39,2,2,'#344d45');rect(2,-33,5,2,'#b88570');
  rect(-17,-13,10,14,'#e6bf76');rect(-16,-15,8,3,'#668e84');rect(-14,-9,4,5,'#fff1cb');
  if(blowing){rect(9,-30,10,5,'#edbd96');line(19,-28,22,-36,'#d7bc72',2);ctx.strokeStyle='#e6d5a0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(23,-39,5,0,Math.PI*2);ctx.stroke();}
  else{rect(10,-28,5,15,'#77a8ad');rect(10,-14,5,5,'#edbd96');line(13,-10,20,-3,'#d7bc72',2);ctx.strokeStyle='#e6d5a0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(23,-1,4,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
 }
 function drawBubbles(){
  ctx.save();
  for(const b of soapBubbles){
   if(b.x<camX-b.r||b.x>camX+viewW+b.r||b.y<camY-b.r||b.y>camY+viewH+b.r)continue;
   const fade=Math.max(0,Math.min(1,b.age/.5,(b.life-b.age)/.5));
   ctx.save();const swell=b.big?Math.min(1,.35+b.age/.9):1,wobble=b.big&&!reduced?Math.sin(b.age*2+b.seed)*.035:0;ctx.translate(b.x,b.y);ctx.scale(swell*(1+wobble),swell*(1-wobble));ctx.translate(-b.x,-b.y);
   ctx.globalAlpha=fade*.1;ctx.fillStyle='#d0ece4';ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();
   ctx.globalAlpha=fade*.45;ctx.lineWidth=1.5;ctx.strokeStyle='#d7eddf';ctx.stroke();
   for(let i=0;i<3;i++){ctx.strokeStyle=['#ebb9d6','#8fdce5','#f7db99'][i];ctx.lineWidth=2.4;ctx.globalAlpha=fade*.8;ctx.beginPath();const a=i*2.1+(reduced?0:b.age*.18);ctx.arc(b.x,b.y,b.r-1,a,a+1.15);ctx.stroke();}
   ctx.globalAlpha=fade*.85;ctx.strokeStyle='#fff6e6';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,b.r-4,3.7,4.6);ctx.stroke();rect(b.x+b.r*.35,b.y+b.r*.45,2,2,'#fff4df');
   if(b.big){ctx.globalAlpha=fade*.25;ctx.strokeStyle='#d8efd5';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x+2,b.y+8,b.r*.64,.15,2.85);ctx.stroke();ctx.globalAlpha=fade*.65;rect(b.x-b.r*.48,b.y-b.r*.52,4,3,'#fff7df');}
   ctx.restore();
  }
  for(const p of bubbleBursts){const u=p.age/.4;ctx.globalAlpha=(1-u)*.6;for(let i=0;i<(reduced?3:6);i++){const a=i*Math.PI/3,r=p.r*(1+u*.4);rect(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r,2,2,['#e4c9df','#c5e4d9','#f2dfb4'][i%3]);}}
  ctx.restore();
 }

 // Optional park stories. Only completed visits and collected messages are saved.
 const planeHost={...point([36,49]),kind:'planeHost',action:'Запустить самолётик'};
 const cinemaSite={...point([46,14]),kind:'cinema',action:'Посмотреть вечернее кино'};
 const planeLetters=[
  ['Попутный ветер','Пусть идеи взлетают, задачи приземляются в «Готово», а пятница приходит без срочных правок.'],
  ['Зелёный свет','Желаем зелёных тестов, понятных требований и коллег, с которыми приятно даже чинить прод.'],
  ['Письмо из отпуска','Этот самолётик прошёл ручное тестирование. Автопилот — ветер. SLA не обещаем, хорошее настроение — да!'],
  ['Нейросеть парка','Промпт на сегодня: выдохнуть, оглядеться и заметить что-нибудь красивое. Результат можно сохранить в памяти.'],
  ['Маленький релиз','Пусть каждый день приносит хотя бы одно маленькое «Получилось!». Большие победы тоже складываются из коммитов.'],
  ['Команде DEX','20 лет вместе — это тысячи идей и людей, которые помогают им сбыться. Спасибо, что вы часть этой истории!']
 ];
 let planeMail=new Set(),paperPlane=null,planeSerial=0,planeCooldown=0,fetchTrips=0,cinemaVisits=0,cinemaGuests=[],cinemaWasOpen=false;
 let wetPrints=[],roadSpray=[],wetSoles=0,wetDistance=0,wetDryTime=0,wetSide=1,sprayClock=0;
 function restoreParkPlay(v={}){
  planeMail=new Set(Array.isArray(v.planeMail)?v.planeMail.filter(i=>Number.isInteger(i)&&i>=0&&i<planeLetters.length):[]);
  paperPlane=null;planeSerial=planeMail.size;planeCooldown=0;
  fetchTrips=Number.isInteger(v.fetchTrips)?Math.max(0,Math.min(999,v.fetchTrips)):0;
  cinemaVisits=Number.isInteger(v.cinemaVisits)?Math.max(0,Math.min(999,v.cinemaVisits)):0;
  cinemaGuests=[];cinemaWasOpen=false;wetPrints=[];roadSpray=[];wetSoles=wetDistance=wetDryTime=sprayClock=0;selectedInteraction='';
  if(['fetch','cinema'].includes(funScene?.kind))funScene=null;
 }
 function startFetch(){
  if(errandStates[0]!==3)return;if(fetchReturn){speech='Собачка возвращается на поляну. Ещё секундочку!';speechTime=2;return;}
  if(ridesWet()){speech='Гав! Мячик подождёт до конца непогоды.';speechTime=3;return;}
  const dog=errands[0].receiver,angles=[.1,1.1,2.3,3.3,4.2,5.2];let target=null;
  for(let j=0;j<angles.length;j++){const a=angles[(j+fetchTrips)%angles.length],p={x:dog.x+Math.cos(a)*105,y:dog.y+Math.sin(a)*105};if(canStand(p.x,p.y)&&clearSegment(dog,p)){target=p;break;}}
  if(!target){speech='Гав! Здесь тесно для броска. Попробуем чуть позже.';speechTime=3;return;}
  const cat=[...pets,...wanderers].find(p=>p.kind==='cat'&&Math.hypot(p.x-target.x,p.y-target.y)<200);
  clearInput();player.vx=player.vy=0;petTime=0;dashTime=0;
  const atFeet={x:player.x+22,y:player.y+8},returnPoint=canStand(atFeet.x,atFeet.y)&&clearSegment(target,atFeet)?atFeet:{x:dog.x,y:dog.y};
  funScene={kind:'fetch',returnPoint,time:0,home:{x:dog.x,y:dog.y},target,thrower:{x:player.x,y:player.y},distracted:fetchTrips%2===1,cat:!!cat};
  speech='Лови!';speechTime=1.2;
 }
 function fetchDogPose(){
  const f=funScene;if(f?.kind!=='fetch')return fetchReturn||errands[0].receiver;
  const t=f.time,u=t<.65?0:t<2.65?(t-.65)/2:t<3.45?1:t<5.45?1-(t-3.45)/2:0;
  const origin=t>=3.45?(f.returnPoint||f.home):f.home;return {x:origin.x+(f.target.x-origin.x)*u,y:origin.y+(f.target.y-origin.y)*u,running:t>.65&&t<2.65||t>3.45&&t<5.45,carrying:t>=3.45};
 }
 function updateFetch(){
  const f=funScene;if(f.time>=2.65&&f.time<3.45&&f.distracted&&speechTime<=0){speech=f.cat?'Кошка! Так… сначала мяч.':'Что за запах? Так… сначала мяч.';speechTime=.75;}
  if(f.time<6.1)return;
  beginDogReturn(f);completePinned('fetch');funScene=null;fetchTrips=Math.min(999,fetchTrips+1);errandJoy[0]=2;activePet=errands[0].receiver;petTime=1;
  speech=fetchTrips%2?'Мяч доставлен. Курьер просит ещё один бросок!':'Сначала отвлёкся, но задачу всё-таки закрыл!';speechTime=4;
  if(fetchTrips>=3)unlockAchievement('fetchFriend');save();
 }
 function drawFetchBall(){
  const f=funScene;if(f?.kind!=='fetch'||f.time>=3.45)return;
  const u=Math.min(1,f.time/.65),x=f.thrower.x+(f.target.x-f.thrower.x)*u,y=f.thrower.y-22+(f.target.y-f.thrower.y+22)*u-(reduced?0:Math.sin(u*Math.PI)*44);
  drawQuestBall(x,y,.75);
 }
 function launchLetter(){
  clearInput();player.vx=player.vy=0;
  if(ridesWet()||snowCover()>.15){speech='Бумага не любит непогоду. Запустим, когда прояснится!';speechTime=4;return;}
  if(paperPlane){speech='Самолётик ещё рядом. Подойди к нему и поймай кнопкой действия!';speechTime=4;return;}
  if(planeCooldown>0){speech='Секунду, складываю новый самолётик.';speechTime=2;return;}
  const start={x:planeHost.x+18,y:planeHost.y},options=[[2,2],[1,3],[-2,3],[3,1],[-3,1],[2,-2]];let landing=null;
  for(let i=0;i<options.length;i++){const [dx,dy]=options[(i+planeSerial)%options.length],p=point([36+dx,49+dy]);if(canStand(p.x,p.y)&&lifePath(planeHost,[36+dx,49+dy]).length){landing=p;break;}}
  if(!landing){speech='Ветер капризничает. Попробуем ещё раз через минутку.';speechTime=3;return;}
  const missing=planeLetters.map((_,i)=>i).filter(i=>!planeMail.has(i)),letter=missing.length?missing[planeSerial%missing.length]:planeSerial%planeLetters.length;
  paperPlane={kind:'letter',action:'Поймать самолётик',x:start.x,y:start.y,start,landing,time:0,letter,bend:Math.min(24,windGust()*10)*(planeSerial%2?-1:1)};
  planeSerial++;planeCooldown=3;speech='Лови послание! Ветер сегодня наш почтальон.';speechTime=3;
 }
 function catchLetter(){
  if(!paperPlane||paperPlane.time<.8)return;
  completePinned('planes');const id=paperPlane.letter,fresh=!planeMail.has(id);planeMail.add(id);paperPlane=null;selectedInteraction='';
  clearInput();player.vx=player.vy=0;speechTime=0;
  $('activity-title').textContent='✉ '+planeLetters[id][0];$('activity-copy').textContent=planeLetters[id][1]+(fresh?' Новое послание: ':' Уже в коллекции: ')+planeMail.size+' / '+planeLetters.length+'. Все письма можно перечитать в журнале.';
  activity.showModal();if(planeMail.size===planeLetters.length)unlockAchievement('airMail');save();
 }
 function updateLetters(dt){
  planeCooldown=Math.max(0,planeCooldown-dt);const p=paperPlane;if(!p)return;
  p.time+=dt;if(p.time>35||ridesWet()||snowCover()>.15){paperPlane=null;return;}
  const u=Math.min(1,p.time/6),gust=Math.sin(u*Math.PI)*p.bend;
  p.x=p.start.x+(p.landing.x-p.start.x)*u+gust;p.y=p.start.y+(p.landing.y-p.start.y)*u;
 }
 function drawPaperPlane(){
  const p=paperPlane;if(!p)return;const u=Math.min(1,p.time/6),lift=reduced?0:Math.sin(u*Math.PI)*22+(1-u)*24;
  ctx.save();ctx.globalAlpha=.14;ctx.fillStyle='#2d5044';ctx.beginPath();ctx.ellipse(p.x,p.y+3,12,4,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=Math.min(1,(35-p.time)/2);
  ctx.translate(p.x,p.y-lift);if(!reduced)ctx.rotate(u<1?Math.atan2(p.landing.y-p.start.y,p.landing.x-p.start.x)+Math.sin(u*Math.PI*2)*.2:.3);
  ctx.fillStyle='#f5edd8';ctx.beginPath();ctx.moveTo(17,0);ctx.lineTo(-13,-9);ctx.lineTo(-7,1);ctx.lineTo(-13,9);ctx.closePath();ctx.fill();line(-7,1,17,0,'#bbccba',1);line(-7,1,-11,7,'#809e97',1);rect(-5,-4,5,2,'#79aba8');ctx.restore();
  if(p.time>=6&&!blocked()&&!observing)mapLabel('✉ Послание',p.x,p.y-28,11,1);
 }
 function drawPlaneHost(){
  const n={...planeHost,hair:'#715341',shirt:'#bdad7c',style:'hoodie'};drawSupporter(n);
  if(paperPlane&&paperPlane.time<1.5){rect(n.x+10,n.y-33,14,5,'#edbd96');rect(n.x+21,n.y-39,4,10,'#edbd96');}
  else{rect(n.x+10,n.y-19,15,4,'#f0e9cf');line(n.x+10,n.y-22,n.x+25,n.y-18,'#c6d6cd',2);}
 }
 function renderParkPlay(){
  $('letters-status').textContent='Послания: '+planeMail.size+' / '+planeLetters.length+'. Посетитель с самолётиками ждёт юго-восточнее старта. Поймайте самолётик через E / кнопку действия. Необязательно для финиша.';
  const list=$('letters-list');list.replaceChildren();planeLetters.forEach(([title,copy],i)=>{const li=document.createElement('li'),b=document.createElement('strong'),p=document.createElement('p');b.textContent=planeMail.has(i)?'✉ '+title:'○ Послание '+(i+1);p.textContent=planeMail.has(i)?copy:'Ещё не поймано';li.append(b,p);list.append(li);});
  $('cinema-status').textContent='У зелёного театра вечером работает проектор. Сеанс — 12 секунд; можно встать раньше. В дождь и метель — перерыв. Просмотрено: '+cinemaVisits+'.';
 }
 function cinemaOpen(){return nightLevel()>.35&&!ridesWet();}
 function startCinema(){
  if(!cinemaOpen()){speech=ridesWet()?'Кино подождёт, пока закончится непогода.':'Загляни вечером: фонари зажгутся — и начнётся кино!';speechTime=4;return;}
  if(!canStand(cinemaSite.x,cinemaSite.y))return;
  clearInput();Object.assign(player,{x:cinemaSite.x,y:cinemaSite.y,vx:0,vy:0,face:'up'});dashTime=0;speechTime=noticeTime=0;funScene={kind:'cinema',time:0};
 }
 function finishCinema(complete){
  if(funScene?.kind!=='cinema')return;funScene=null;clearInput();player.vx=player.vy=0;
  if(complete){completePinned('cinema');cinemaGuests.forEach(n=>n.applause=3);cinemaVisits=Math.min(999,cinemaVisits+1);unlockAchievement('parkCinema');speech='Короткий метр, а настроение — на весь вечер.';speechTime=4;save();}
 }
 function updateCinema(dt){
  const open=cinemaOpen(),near=Math.hypot(player.x-cinemaSite.x,player.y-cinemaSite.y)<650;
  if(open&&near&&!cinemaWasOpen&&!cinemaGuests.length){
   for(const [i,from,to]of [[0,[41,14],[44,14]],[1,[50,15],[48,14]],[2,[49,16],[47,15]]]){
    const origin=point(from),seat=point(to);if(!canStand(origin.x,origin.y)||!canStand(seat.x,seat.y))continue;
    const route=lifePath(origin,to);if(route.length)cinemaGuests.push({...origin,origin,seat,route,id:i,leaving:false,walking:false});
   }
  }
  cinemaWasOpen=open&&near;
  for(const n of cinemaGuests){
   n.applause=Math.max(0,(n.applause||0)-dt);if(!open&&!n.leaving){n.leaving=true;n.route=lifePath(n,[Math.floor(n.origin.x/T),Math.floor(n.origin.y/T)]);}
   const p=n.route[0];n.walking=false;if(!p)continue;const d=Math.hypot(p.x-n.x,p.y-n.y),step=Math.min(d,62*dt);
   if(d<.5){n.route.shift();continue;}const x=n.x+(p.x-n.x)/d*step,y=n.y+(p.y-n.y)/d*step;
   if(canStand(x,y)){n.x=x;n.y=y;n.walking=true;}else n.route=[];
  }
  cinemaGuests=cinemaGuests.filter(n=>!n.leaving||n.route.length);
 }
 function drawCinemaGuest(n){drawSupporter({...n,avatar:[10,11,12][n.id%3],quiet:true,moving:n.walking,stride:elapsed*10+n.id,pose:n.applause>0&&!n.walking?'clap':undefined,heightScale:.9});}
 function drawCinemaFrame(){
  const x=45*T,y=10*T+16;rect(x-76,y-76,152,82,'#675b48');rect(x-72,y-72,144,74,'#e9e2c6');rect(x-66,y-67,132,62,'#344d58');
  text('ВЕЧЕРНЕЕ КИНО',x,y-25,11,'#d7dfcc','center');
  rect(cinemaSite.x-16,cinemaSite.y-10,32,6,'#a28a67');for(const dx of [-13,10])rect(cinemaSite.x+dx,cinemaSite.y-4,3,10,'#626452');
  const px=cinemaSite.x-27,py=cinemaSite.y-24;rect(px-9,py-8,18,12,'#415753');rect(px-5,py-14,9,6,'#687b70');rect(px-2,py+4,3,17,'#6f6b54');
 }
 function drawCinemaLight(){
  if(!cinemaOpen()&&funScene?.kind!=='cinema')return;
  const x=45*T,y=10*T+16;if(x<camX-160||x>camX+viewW+160||y<camY-160||y>camY+viewH+260)return;
  ctx.save();ctx.translate(-camX,-camY);const px=cinemaSite.x-27,py=cinemaSite.y-31;
  ctx.globalAlpha=.075;ctx.fillStyle='#f4e8be';ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x-66,y-67);ctx.lineTo(x+66,y-67);ctx.closePath();ctx.fill();ctx.globalAlpha=1;rect(px-4,py-2,8,4,'#f2e4b7');
  if(!reduced)for(let i=0;i<(comfort.lightweight?4:10);i++){const u=(elapsed*.08+i*.137)%1,dx=Math.sin(i*4.3)*u*40;ctx.globalAlpha=.12+Math.sin(u*Math.PI)*.18;rect(px+(x-px)*u+dx,py+(y-50-py)*u,1,2,'#f2e9d2');}
  ctx.globalAlpha=1;rect(x-66,y-67,132,62,'#496b80');rect(x-66,y-27,132,22,'#8dac72');
  const t=funScene?.kind==='cinema'?funScene.time:((elapsed-246)%12+12)%12,act=Math.min(2,Math.floor(t/4));
  if(act===0){rect(x-53,y-55,19,7,'#e3e8d4');rect(x-48,y-59,9,6,'#e3e8d4');const ax=reduced?x:x-45+(t/4)*87;ctx.fillStyle='#fff0ca';ctx.beginPath();ctx.moveTo(ax+9,y-42);ctx.lineTo(ax-8,y-48);ctx.lineTo(ax-3,y-41);ctx.lineTo(ax-8,y-36);ctx.closePath();ctx.fill();}
  else if(act===1){rect(x-66,y-67,132,62,'#567381');rect(x-66,y-27,132,22,'#78956d');for(let i=0;i<13;i++){const yy=y-61+(reduced?i*3%30:(t*20+i*13)%35);line(x-57+i*9,yy,x-59+i*9,yy+5,'#b4d1d0',1);}}
  else{rect(x+37,y-57,13,13,'#f0d691');ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.strokeStyle=['#cf929c','#d5b875','#b5ca92','#9ebcc2'][i];ctx.beginPath();ctx.arc(x+12,y-32,23-i*3,Math.PI,Math.PI*2);ctx.stroke();}}
  const hx=x-23;rect(hx-5,y-28,10,12,'#d9625e');rect(hx-4,y-38,8,10,'#e6b48a');rect(hx-5,y-41,10,5,'#314f76');rect(hx-4,y-16,3,8,'#334f65');rect(hx+1,y-16,3,8,'#334f65');
  if(act===1){line(hx+6,y-20,hx+6,y-46,'#d7cfb3',1);ctx.fillStyle='#d5bd6d';ctx.beginPath();ctx.arc(hx+6,y-44,15,Math.PI,Math.PI*2);ctx.fill();}
  text(act===0?'Идея взлетела':act===1?'Вместе в любую погоду':'DEX · 20 лет вместе',x,y-9,8,'#fff2d5','center');ctx.restore();
 }
 function recordWetWalk(before){
  const dx=player.x-before.x,dy=player.y-before.y,d=Math.hypot(dx,dy);if(!d||d>15||driving)return;
  recordPuddleRipple(d);if(footInPuddle()){wetSoles=6;wetDistance=0;wetDryTime=9;return;}if(!wetSoles)return;
  wetDistance+=d;if(wetDistance<27)return;wetDistance%=27;wetSide*=-1;wetSoles--;
  if(footSurface(player.x,player.y)!=='path'&&footSurface(player.x,player.y)!=='wood')return;
  const a=Math.atan2(dy,dx);wetPrints.push({x:player.x-Math.sin(a)*wetSide*5,y:player.y+Math.cos(a)*wetSide*5,angle:a,life:8,alpha:.2+wetSoles*.035});
  const max=comfort.lightweight?18:40;if(wetPrints.length>max)wetPrints.splice(0,wetPrints.length-max);
 }
 function roadPuddleTile(x,y){return (x*19+y*7)%11===0&&onMotorRoad(x*T+16,y*T+16);}
 function roadWaterAt(x,y){const tx=Math.floor(x/T),ty=Math.floor(y/T);return puddleLevel()>.15&&roadPuddleTile(tx,ty)&&Math.abs(x-(tx*T+16))<24&&Math.abs(y-(ty*T+20))<12;}
 function recordRoadSplash(dt){
  sprayClock=Math.max(0,sprayClock-dt);if(!driving||reduced||sprayClock>0||Math.abs(driveSpeed)<35||puddleLevel()<=.15)return;
  const wet=[-1,1].filter(side=>{const p=vehiclePoint(bmw,side*28,24);return roadWaterAt(p.x,p.y);});if(!wet.length)return;sprayClock=comfort.lightweight?.14:.08;
  for(const side of wet)for(let i=0;i<(comfort.lightweight?2:4);i++){const p=vehiclePoint(bmw,side*30,24),out=side*(30+i*14+Math.abs(driveSpeed)*.12),back=-Math.sign(driveSpeed)*(10+i*8);roadSpray.push({...p,age:0,vx:out*Math.cos(bmw.angle)-back*Math.sin(bmw.angle),vy:out*Math.sin(bmw.angle)+back*Math.cos(bmw.angle),lift:7+i*3});}
  roadSpray=roadSpray.slice(-(comfort.lightweight?16:40));
 }
 function updateWetEffects(dt){
  rippleWait=Math.max(0,rippleWait-dt);for(const r of puddleRipples)r.age+=dt;puddleRipples=puddleLevel()?puddleRipples.filter(r=>r.age<1.3):[];
  wetDryTime=Math.max(0,wetDryTime-dt);if(!wetDryTime)wetSoles=0;
  for(const p of wetPrints)p.life-=dt;wetPrints=wetPrints.filter(p=>p.life>0);
  for(const p of roadSpray){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}roadSpray=roadSpray.filter(p=>p.age<.6);
 }
 function drawWetPrints(){ctx.save();for(const p of wetPrints){ctx.globalAlpha=p.alpha*Math.min(1,p.life/5);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);rect(-2,-2,6,4,'#526c6b');rect(3,-1,2,2,'#526c6b');rect(-6,-2,3,4,'#526c6b');ctx.restore();}ctx.restore();}
 function drawRoadPuddles(){const level=puddleLevel();if(!level)return;ctx.save();ctx.globalAlpha=level*.35;for(let y=Math.max(0,Math.floor(camY/T));y<Math.min(ROWS,Math.ceil((camY+viewH)/T));y++)for(let x=Math.max(0,Math.floor(camX/T));x<Math.min(COLS,Math.ceil((camX+viewW)/T));x++)if(roadPuddleTile(x,y)){ctx.fillStyle='#9db5b7';ctx.beginPath();ctx.ellipse(x*T+16,y*T+20,24,11,0,0,Math.PI*2);ctx.fill();rect(x*T+8,y*T+16,17,1,'#d4dfd1');}ctx.restore();}
 function drawRoadSpray(){if(reduced)return;ctx.save();for(const p of roadSpray){const u=p.age/.6;ctx.globalAlpha=(1-u)*.6;rect(p.x,p.y-Math.sin(u*Math.PI)*p.lift,2,3,'#bfd9d8');}ctx.restore();}
 function updateParkPlay(dt){updateFireflyDance(dt);updateSceneReactions(dt);updateLetters(dt);updateCinema(dt);updateWetEffects(dt);}

 // The artist keeps compact scene descriptions; PNGs are rendered only when opened.
 const artistSite={...point([31,55]),kind:'artist',name:'Уличный художник',action:'Портрет на память · 8 с'};
 const portraitSeasons={
  summer:{name:'Летняя прогулка',sky:'#b6d2cf',ground:'#91aa76',leaf:'#648967',light:'#a7c487',accent:'#dec985'},
  autumn:{name:'Золотая прогулка',sky:'#c5ccc1',ground:'#b4a079',leaf:'#b67f50',light:'#d6ad65',accent:'#ca8b61'},
  winter:{name:'Зимняя прогулка',sky:'#adc4d0',ground:'#dce4db',leaf:'#72988e',light:'#e5ece1',accent:'#9fbcc2'},
  spring:{name:'Весенняя прогулка',sky:'#bcd4cf',ground:'#a0b683',leaf:'#80a17a',light:'#d8b9c2',accent:'#c997a9'}
 };
 let portraits={},portraitImages=new Map();
 function restorePortraits(v={}){
  portraits={};portraitImages.clear();
  for(const id of Object.keys(portraitSeasons)){const p=v.portraits?.[id];if(p&&Number.isFinite(p.time)&&p.time>=0&&p.time<=1e8&&typeof p.evening==='boolean')portraits[id]={season:id,time:Math.floor(p.time),evening:p.evening};}
  if(funScene?.kind==='portrait')funScene=null;
  $('portrait-receipt').hidden=true;$('portrait-close').hidden=true;activity.classList.remove('portrait-result');
 }
 function startPortrait(){
  if(ridesWet()){speech='Краски подождут. После непогоды напишем портрет!';speechTime=4;return;}
  const seat={x:artistSite.x-34,y:artistSite.y+40};if(!canStand(seat.x,seat.y)||!clearSegment(player,seat)){speech='Подойди к табурету перед мольбертом.';speechTime=3;return;}
  clearInput();Object.assign(player,{...seat,vx:0,vy:0,face:'up'});dashTime=0;
  startArtSpectator();funScene={kind:'portrait',time:0,season:seasonState().id,evening:nightLevel()>.35,line:0};
  speech='Замри на секундочку. Улыбку можно не фиксировать в Git!';speechTime=3;noticeTime=0;
 }
 function finishPortrait(complete){
  const f=funScene;if(f?.kind!=='portrait')return;
  funScene=null;clearInput();player.vx=player.vy=0;speechTime=0;
  if(!complete){speech='Холст подождёт. Загляну ещё!';speechTime=3;return;}
  const p={season:f.season,evening:f.evening,time:Math.floor(elapsed)};
  if(artSpectator)artSpectator.pleased=true;completePinned('artist');portraits[p.season]=p;portraitImages.delete(p.season);
  unlockAchievement('portrait');if(Object.keys(portraits).length===4)unlockAchievement('portraitSeasons');
  save();window.ParkAudio?.reward?.();
  $('activity-title').textContent='Ваш портрет готов!';
  $('activity-copy').textContent='«Похож? Я немного добавил вдохновения». '+portraitSeasons[p.season].name+'. Портрет сохранён в журнале. В другом времени года художник напишет новый фон.';
  $('portrait-receipt').hidden=false;$('portrait-close').hidden=false;activity.classList.add('portrait-result');
  try{setPortraitImage($('portrait-image'),$('portrait-download'),p);}catch{$('portrait-receipt').hidden=true;$('activity-copy').textContent+=' Изображение можно открыть позднее в журнале.';}
  activity.showModal();
 }
 function updatePortrait(){
  const f=funScene;if(ridesWet()){finishPortrait(false);speech='Берегу краски от непогоды. Продолжим, когда прояснится!';speechTime=4;return;}
  if(f.time>=8){finishPortrait(true);return;}
  const phase=Math.floor(f.time/3);if(phase>f.line){f.line=phase;speech=phase===1?'Так… добавим немного характера. И ни одного бага.':'Последний штрих. Даже голубь одобряет.';speechTime=2.3;}
 }
 function portraitImage(p){
  const cached=portraitImages.get(p.season);if(cached&&cached.time===p.time&&cached.evening===p.evening)return cached.image;
  const c=document.createElement('canvas');c.width=1600;c.height=1200;const g=c.getContext('2d');if(!g)throw new Error('Canvas unavailable');
  g.scale(4,4);g.imageSmoothingEnabled=false;
  const palette=portraitSeasons[p.season],r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h);};
  const label=(copy,x,y,size,color='#315449',font='Georgia')=>{g.fillStyle=color;g.font=size+'px '+font;g.textAlign='center';g.fillText(copy,x,y);};
  r(0,0,400,300,'#f3ebd8');r(12,12,376,276,'#d0b989');r(15,15,370,270,'#fbf4e2');
  label('DEX · ПОРТРЕТ ИЗ ПАРКА',200,35,11);label('20 лет вместе',200,48,7,'#7b8370','sans-serif');
  r(27,59,346,184,'#ad946e');r(30,62,340,178,p.evening?'#536b76':palette.sky);r(30,157,340,83,palette.ground);
  if(p.evening){r(315,77,16,16,'#e5dfb4');r(321,74,12,15,'#536b76');for(let i=0;i<16;i++)r(42+(i*47)%300,73+(i*17)%71,2,2,'#e1dfbe');}
  else{r(307,78,20,20,'#e5cf8e');r(49,84,37,8,'#e7e9d7');r(59,79,19,8,'#e7e9d7');r(258,99,29,6,'#e7e9d7');}
  for(const [x,y]of [[79,105],[321,126]]){r(x-5,y+24,10,77,'#867450');r(x-30,y+12,59,27,palette.leaf);r(x-24,y-9,46,30,palette.light);r(x-14,y-22,32,19,palette.leaf);for(let i=0;i<9;i++)r(x-23+(i*13)%43,y-2+(i*7)%26,6,3,palette.light);}
  g.fillStyle=p.season==='winter'?'#bfcec7':'#d5c18e';g.beginPath();g.moveTo(184,156);g.lineTo(204,156);g.lineTo(306,240);g.lineTo(86,240);g.closePath();g.fill();
  for(let i=0;i<22;i++){const x=37+(i*43)%323,y=179+(i*19)%55;if(Math.abs(x-196)<53)continue;
   r(x,y,p.season==='winter'?5:3,2,palette.accent);if(p.season==='spring'||p.season==='summer'){r(x,y-3,3,3,i%2?'#eee1b2':'#d4a2a5');r(x+1,y+2,1,4,palette.leaf);}}
  // A painted, front-facing version of the game's blue-hatted hero.
  r(171,224,61,6,'#65775d');r(176,206,15,19,'#3e5264');r(207,206,15,19,'#3e5264');r(172,224,20,6,'#ece7d7');r(205,224,20,6,'#ece7d7');
  r(172,161,54,49,'#a84f56');r(178,166,42,37,'#cd6869');r(160,169,12,28,'#c66a69');r(226,168,12,30,'#c66a69');r(161,197,11,10,'#d9a780');r(226,198,11,10,'#d9a780');
  r(175,118,47,47,'#365d81');r(181,107,32,18,'#426e94');r(182,128,34,29,'#e3b78f');r(181,151,36,14,'#416989');r(187,137,5,5,'#344a53');r(205,137,5,5,'#344a53');r(193,153,12,3,'#fff0cb');r(211,144,5,3,'#d5927b');
  if(p.season==='winter'){r(176,164,48,8,'#d4bd79');r(212,170,8,22,'#d4bd79');}else{r(189,178,19,11,'#eadbb9');label('DEX',199,186,6,'#46665e','monospace');}
  label(palette.name,200,261,14);label('Парк Победа · '+formatTime(p.time)+' · '+(p.evening?'вечерний этюд':'написано с натуры'),200,276,7,'#6d7b6d','sans-serif');
  const image=c.toDataURL('image/png');portraitImages.set(p.season,{...p,image});return image;
 }
 function setPortraitImage(img,link,p){const image=portraitImage(p);img.src=image;img.alt='Портрет героя — '+portraitSeasons[p.season].name;link.href=image;link.download='DEX-portrait-'+p.season+'-1600x1200.png';}
 function renderPortraits(){
  $('portrait-status').textContent='Ваша коллекция: '+Object.keys(portraits).length+' / 4. Художник ждёт на поляне южнее продавца мороженого. Восемь секунд позирования — и портрет ваш. Повторный сеанс обновляет портрет текущего времени года. Необязательно для финиша.';
  const list=$('portrait-album');list.replaceChildren();
  for(const [id,theme]of Object.entries(portraitSeasons)){const li=document.createElement('li'),title=document.createElement('strong');title.textContent=(portraits[id]?'✓ ':'○ ')+theme.name;li.className='portrait-card';li.append(title);
   if(portraits[id]){const img=document.createElement('img'),link=document.createElement('a');link.className='photo-download';link.textContent='Скачать PNG · 1600 × 1200';try{setPortraitImage(img,link,portraits[id]);li.append(img,link);}catch{const note=document.createElement('p');note.textContent='Портрет сохранён. Откройте журнал ещё раз, чтобы загрузить изображение.';li.append(note);}}
   else{const note=document.createElement('p');note.textContent='Загляните к художнику в это время года.';li.append(note);}list.append(li);
  }
 }
 function drawArtist(){
  const {x,y}=artistSite,f=funScene?.kind==='portrait'?funScene:null,wet=ridesWet();
  rect(x-48,y-12,102,25,'#46654c33');rect(x-47,y+31,26,6,'#b69b6c');rect(x-44,y+37,4,10,'#736650');rect(x-28,y+37,4,10,'#736650');
  const ex=x+35;line(ex-13,y+6,ex-4,y-59,'#8e7650',4);line(ex+15,y+6,ex+4,y-59,'#8e7650',4);rect(ex-20,y-53,41,39,'#b79865');rect(ex-17,y-50,35,33,'#f1e7cd');rect(ex-23,y-13,46,4,'#94744e');
  const theme=portraitSeasons[f?.season||seasonState().id],p=f?Math.min(1,f.time/8):.95;
  if(wet){rect(ex-19,y-52,40,40,'#829489');line(ex-17,y-47,ex+16,y-22,'#a4b7a5',2);}
  else{rect(ex-14,y-47,29,Math.max(1,Math.floor(p*15)),theme.sky);if(p>.24)rect(ex-14,y-32,29,12,theme.ground);if(p>.43){rect(ex-4,y-36,7,7,'#41678a');rect(ex-5,y-29,9,9,'#c26c68');}if(p>.65){rect(ex-2,y-34,4,4,'#e4b68e');rect(ex-4,y-20,3,2,'#435566');rect(ex+1,y-20,3,2,'#435566');}if(p>.85)rect(ex+9,y-44,4,4,'#e4d097');}
  rect(x-7,y-13,5,15,'#4b5a5e');rect(x+2,y-13,5,15,'#4b5a5e');rect(x-9,y,8,4,'#d9dcc9');rect(x+2,y,8,4,'#d9dcc9');rect(x-10,y-31,20,21,'#ddd9c3');for(let i=0;i<4;i++)rect(x-10,y-28+i*4,20,2,'#758d91');rect(x-5,y-25,15,17,'#9b9b76');
  rect(x-7,y-45,15,15,'#dcb28b');rect(x-10,y-49,23,6,'#596475');rect(x-6,y-53,13,6,'#596475');rect(x+3,y-40,2,2,'#3d4b49');rect(x+6,y-36,5,2,'#806651');
  const stroke=reduced||wet?0:Math.sin(elapsed*(f?9:2))*4;rect(x-14,y-26,5,14,'#ddd9c3');rect(x-17,y-15,14,8,'#b99563');rect(x-15,y-13,3,3,'#b56a69');rect(x-9,y-12,3,3,'#82a384');
  rect(x+9,y-27+stroke,12,5,'#dbb38f');line(x+19,y-25+stroke,ex-8,y-35+stroke,'#846a4c',2);if(!wet)rect(ex-8,y-36+stroke,3,3,theme.accent);
 }


 const magicianSite={...point([82,58]),kind:'magician',name:'Уличный фокусник',action:'Посмотреть фокус'};
 const heartSite=point([55,19]);
 let magicShows=0,magicPending=false,fireflyDance=null,heartCycle=-1,artSpectator=null,fetchReturn=null,fetchDrop=null;
 function restoreLife46(v={}){
  magicShows=Number.isInteger(v.magicShows)?Math.max(0,Math.min(999,v.magicShows)):0;magicPending=false;fireflyDance=null;
  heartCycle=Number.isInteger(v.heartCycle)&&v.heartCycle>=-1&&v.heartCycle<=1e6?v.heartCycle:-1;
  artSpectator=fetchReturn=fetchDrop=null;$('magic-choices').hidden=true;
  if(funScene?.kind==='magic')funScene=null;
 }
 function startMagic(){
  if(ridesWet()){speech='В непогоду голубь предпочитает оставаться за кулисами.';speechTime=4;return;}
  clearInput();magicPending=true;$('magic-choices').hidden=false;
  $('activity-title').textContent='Фокус без спойлеров';$('activity-copy').textContent='Под каким стаканчиком шарик? Выберите любой. Здесь важнее удивиться, чем угадать.';activity.showModal();
 }
 function chooseMagic(choice){
  if(!magicPending||!activity.open||![0,1,2].includes(choice))return;
  closeActivity();const seat={x:magicianSite.x,y:magicianSite.y+40};
  if(canStand(seat.x,seat.y)&&clearSegment(player,seat))Object.assign(player,seat);
  clearInput();player.vx=player.vy=0;player.face='up';dashTime=0;
  funScene={kind:'magic',time:0,choice,revealed:false};speech='Следите за руками. Логи потом посмотрим!';speechTime=3;
 }
 function finishMagic(complete){
  if(funScene?.kind!=='magic')return;funScene=null;clearInput();player.vx=player.vy=0;
  if(complete){magicShows=Math.min(999,magicShows+1);completePinned('magic');unlockAchievement('magic');speech='Шарик ушёл в отпуск. Голубь вышел на замену!';speechTime=4;save();}
  else{speech='Продолжим фокус в следующий раз.';speechTime=3;}
 }
 function updateMagic(){
  const f=funScene;if(ridesWet()){finishMagic(false);return;}
  if(f.time>=4&&!f.revealed){f.revealed=true;speech='Так… это была продакшен-версия.';speechTime=3.4;}
  if(f.time>=8)finishMagic(true);
 }
 function drawMagician(){
  const {x,y}=magicianSite,f=funScene?.kind==='magic'?funScene:null,t=f?.time||0;
  rect(x-42,y-8,84,18,'#31504733');rect(x-29,y-28,58,17,'#7b6980');rect(x-29,y-14,5,20,'#70634e');rect(x+24,y-14,5,20,'#70634e');
  rect(x-8,y-30,6,12,'#43505c');rect(x+3,y-30,6,12,'#43505c');rect(x-12,y-52,25,24,'#716180');rect(x-3,y-51,8,18,'#e4dccb');rect(x-5,y-48,13,3,'#bc8585');
  rect(x-8,y-67,17,15,'#dab38e');rect(x-13,y-70,28,5,'#3b4d56');rect(x-7,y-87,17,18,'#3b4d56');rect(x-7,y-76,17,4,'#bc969e');rect(x-3,y-61,2,2,'#374749');rect(x+5,y-61,2,2,'#374749');
  const hands=reduced?0:Math.sin(elapsed*(f?8:2))*3;rect(x-19,y-49+hands,7,16,'#716180');rect(x+13,y-49-hands,7,16,'#716180');rect(x-19,y-35+hands,8,5,'#dab38e');rect(x+13,y-35-hands,8,5,'#dab38e');
  rect(x-47,y-19,94,9,'#bda379');rect(x-45,y-10,90,13,'#687e7a');rect(x-44,y,88,3,'#d0be8c');
  for(let i=0;i<3;i++){const shift=f&&t<3&&!reduced?Math.sin(t*7+i*2.1)*6:0,lift=f&&i===f.choice&&t>=4?14:0,cx=x+(i-1)*27+shift;rect(cx-8,y-36-lift,16,17,'#d2bc86');rect(cx-10,y-22-lift,20,4,'#e0cf9b');rect(cx-5,y-33-lift,3,10,'#e9dba9');}
 }
 function drawMagicPigeon(){
  const f=funScene;if(f?.kind!=='magic'||f.time<4)return;const u=Math.min(1,(f.time-4)/3.7),x=magicianSite.x+(f.choice-1)*27+(reduced?0:u*110),y=magicianSite.y-36-(reduced?24:Math.sin(u*Math.PI*.65)*95);
  ctx.save();ctx.globalAlpha=Math.min(1,(f.time-4)*5,(8-f.time)*2);rect(x-9,y-4,17,10,'#d2d8cc');rect(x+5,y-9,8,9,'#e1e4d7');rect(x+11,y-6,5,3,'#cdb174');rect(x+8,y-7,2,2,'#394f53');const wing=reduced?5:Math.sin(f.time*22)*9;rect(x-9,y-7-wing,16,5,'#aabdc0');rect(x-14,y+2,7,4,'#839b9e');ctx.restore();
 }
 function heartAvailable(){return nightLevel()>.65&&!ridesWet()&&snowCover()<.15;}
 function updateFireflyDance(dt){
  const cycle=Math.floor(elapsed/300),phase=elapsed%300;
  if(!ambientSceneBusy()&&!fireflyDance&&heartCycle!==cycle&&phase>=248&&phase<280&&heartAvailable()&&!momentsBusy()&&speechTime<=0&&Math.hypot(player.x-heartSite.x,player.y-heartSite.y)<245){
   heartCycle=cycle;fireflyDance={time:0,witness:0,awarded:false};speech='Кажется, у нашего парка тоже есть сердце.';speechTime=3;save();
  }
  const f=fireflyDance;if(!f)return;if(!heartAvailable()){fireflyDance=null;return;}f.time+=dt;
  if(f.time>=3&&f.time<9&&Math.hypot(player.x-heartSite.x,player.y-heartSite.y)<280)f.witness+=dt;
  if(f.witness>=3&&!f.awarded){f.awarded=true;completePinned('heart');unlockAchievement('parkHeart');save();}
  if(f.time>=12)fireflyDance=null;
 }
 function drawFireflyDance(){
  const f=fireflyDance;if(!f)return;const x=heartSite.x,y=heartSite.y-72;
  if(x<camX-150||x>camX+viewW+150||y<camY-140||y>camY+viewH+140)return;
  ctx.save();ctx.translate(-camX,-camY);const t=f.time,settle=reduced?1:Math.min(1,t/3),scatter=reduced?0:Math.max(0,(t-9)/3),alpha=Math.min(1,t/1.5,(12-t)/2),count=comfort.lightweight?32:56;
  for(let i=0;i<count;i++){const a=i/count*Math.PI*2,hx=16*Math.sin(a)**3*4,hy=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))*4;
   const loose=(1-settle+scatter)*60,px=x+hx+Math.sin(a*5+t*.5)*loose,py=y+hy+Math.cos(a*3+t*.7)*loose;
   const glow=alpha*(reduced?.8:.72+.2*Math.sin(t+i));ctx.globalAlpha=glow*.08;rect(px-8,py-8,17,17,'#dce9aa');ctx.globalAlpha=glow*.22;rect(px-4,py-4,9,9,'#e4edb4');ctx.globalAlpha=glow;rect(px-1,py-1,3,3,'#f5edbd');
  }
  if(t>2.5&&t<10){ctx.globalAlpha=Math.min(1,(t-2.5)*2,(10-t))*alpha;const glyphs=['110101101101110','111100110100111','101101010101101'];for(let k=0;k<3;k++)for(let row=0;row<5;row++)for(let col=0;col<3;col++)if(glyphs[k][row*3+col]==='1')rect(x-24+k*18+col*4,y-7+row*4,3,3,'#ecebc0');}
  ctx.restore();
 }
 function startArtSpectator(){
  if(artSpectator)return;const origin=point([28,58]),seat=point([32,57]),route=lifePath(origin,[32,57]);if(!route.length||!canStand(origin.x,origin.y)||!canStand(seat.x,seat.y))return;
  artSpectator={...origin,origin,route,id:2,walking:true,leaving:false,applause:0,wait:0};
 }
 function walkSceneGuest(n,dt,speed=70){const p=n.route[0];n.walking=false;if(!p)return;const d=Math.hypot(p.x-n.x,p.y-n.y),step=Math.min(d,speed*dt);if(d<.5){n.route.shift();return;}const x=n.x+(p.x-n.x)/d*step,y=n.y+(p.y-n.y)/d*step;if(canStand(x,y)){n.x=x;n.y=y;n.walking=true;}else n.route=[];}
 function updateSceneReactions(dt){
  if(artSpectator){const n=artSpectator;if(funScene?.kind!=='portrait'&&!n.leaving){n.wait+=dt;n.applause=n.pleased?Math.max(0,2.2-n.wait):0;if(!n.pleased||n.wait>2.2||ridesWet()){n.leaving=true;n.applause=0;n.route=lifePath(n,[28,58]);}}walkSceneGuest(n,dt);if(n.leaving&&!n.route.length)artSpectator=null;}
  if(fetchReturn){walkSceneGuest(fetchReturn,dt,100);fetchReturn.running=fetchReturn.walking;if(!fetchReturn.route.length)fetchReturn=null;}
  if(fetchDrop){fetchDrop.life-=dt;if(fetchDrop.life<=0)fetchDrop=null;}
 }
 function beginDogReturn(f){
  const p=f.returnPoint||f.home;fetchDrop={x:p.x,y:p.y+9,life:3};const route=lifePath(p,[Math.floor(f.home.x/T),Math.floor(f.home.y/T)]);
  if(route.length)fetchReturn={...p,route,walking:true,running:true,carrying:false};
 }
 function drawDroppedBall(){if(!fetchDrop)return;ctx.save();ctx.globalAlpha=Math.min(1,fetchDrop.life);drawQuestBall(fetchDrop.x,fetchDrop.y,.6);ctx.restore();}


 // Spring details and pond life share active game time; no new collision surfaces.
 const kiteSite={...point([23,58]),kind:'kite',action:'Запустить воздушного змея'};
 const pondCenter={x:37.5*T,y:35.5*T};
 let duckFamily=[],duckPhase=0,duckShore=0,butterfly=null,butterflyIdle=0,butterflyWait=0;
 let kiteFlights=0,kiteCooldown=0,collage={ids:[],caption:''},collageBusy=false,collageRevision=0;
 function restoreNature(v={}){
  duckFamily=[];duckPhase=0;duckShore=0;butterfly=null;butterflyIdle=butterflyWait=0;kiteCooldown=0;
  kiteFlights=Number.isInteger(v.kiteFlights)?Math.max(0,Math.min(999,v.kiteFlights)):0;
  collage={ids:Array.isArray(v.collage?.ids)?[...new Set(v.collage.ids.filter(id=>photoTargets.some(p=>p.id===id)&&v.photoShots?.[id]))].slice(0,4):[],caption:typeof v.collage?.caption==='string'?v.collage.caption.slice(0,80):''};
  collageRevision++;$('collage-result').hidden=true;
 }
 function springBloom(time=elapsed){return seasonState(time).spring*(1-snowCover(time));}
 function blossomTree(t){return (t.tx*37+t.ty*61)%3===0;}
 function drawBlossoms(t){const bloom=springBloom();if(bloom<=0||!blossomTree(t))return;ctx.save();ctx.globalAlpha*=bloom;for(let i=0;i<7;i++){const x=7+(i*13+t.tx)%18,y=-12+(i*11+t.ty)%28;rect(x-2,y,5,3,i%2?'#f2d5d2':'#f4e7cc');rect(x,y-1,2,5,'#f7ecdb');rect(x,y+1,1,1,'#c8a26c');}ctx.restore();}
 function drawSpringGround(sx,ex,sy,ey){const bloom=springBloom();if(bloom<=0)return;ctx.save();ctx.globalAlpha=bloom;for(let y=sy;y<ey;y++)for(let x=sx;x<ex;x++){if((x*17+y*31)%9||!seasonalGroundTile(x,y))continue;for(let i=0;i<3;i++){const px=x*T+7+i*8,py=y*T+12+(i*7+x)%12;rect(px,py,1,5,'#568457');rect(px-2,py-2,5,3,i%2?'#e3d7ec':'#f3e6bb');rect(px,py-1,1,1,'#c4a05c');}}ctx.restore();}
 function updatePond(dt){
  if(!duckFamily.length)duckFamily=Array.from({length:4},(_,i)=>({x:pondCenter.x+Math.cos(-i*.6)*29,y:pondCenter.y+Math.sin(-i*.6)*31,face:1}));
  if(snowCover()>.35||reduced)return;
  const dx=player.x-pondCenter.x,dy=player.y-pondCenter.y,d=Math.hypot(dx,dy),near=!driving&&d<155&&d>55&&!ridesWet();
  duckShore=approach(duckShore,near?1:0,dt*.35);duckPhase+=dt*.28;
  const bank={x:pondCenter.x+dx/(d||1)*34,y:pondCenter.y+dy/(d||1)*38};
  const lead={x:(pondCenter.x+Math.cos(duckPhase)*29)*(1-duckShore)+bank.x*duckShore,y:(pondCenter.y+Math.sin(duckPhase)*31)*(1-duckShore)+bank.y*duckShore};
  for(let i=0;i<duckFamily.length;i++){
   const n=duckFamily[i],target=i?duckFamily[i-1]:lead,dist=Math.hypot(target.x-n.x,target.y-n.y),distracted=i===3&&elapsed%23>10&&elapsed%23<12&&!near;
   if(distracted||dist<(i?13:1))continue;
   const step=Math.min(dist-(i?12:0),(i===3&&dist>26?29:17)*dt),nx=n.x+(target.x-n.x)/dist*step,ny=n.y+(target.y-n.y)/dist*step;
   if(water(Math.floor(nx/T),Math.floor(ny/T))){if(Math.abs(nx-n.x)>.01)n.face=nx>n.x?1:-1;n.x=nx;n.y=ny;}
  }
 }
 function drawDuckFamily(){
  const visible=unit(1-snowCover()*3)*(1-rainIntensity()*.55);if(visible<=0)return;
  for(let i=0;i<duckFamily.length;i++){const n=duckFamily[i];if(n.x<camX-25||n.x>camX+viewW+25||n.y<camY-20||n.y>camY+viewH+20)continue;
   ctx.save();ctx.globalAlpha=visible;ctx.translate(n.x,n.y);ctx.scale(n.face,1);
   const ripple=reduced?0:(elapsed*.7+i*.31)%1;
   if(!comfort.lightweight||i===0){ctx.strokeStyle='#a8cbd0';ctx.globalAlpha=visible*(.5-ripple*.25);ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(-4-ripple*4,4,10+ripple*6,3+ripple*2,0,.2,Math.PI*1.8);ctx.stroke();ctx.globalAlpha=visible;}
   if(i===0){rect(-10,-4,18,8,'#bea682');rect(-7,-5,9,6,'#dfceb0');rect(3,-11,8,9,'#536c52');rect(5,-5,6,2,'#f0e1bb');rect(10,-7,5,3,'#d6a25b');rect(8,-9,2,2,'#253f38');rect(-12,-5,5,3,'#8c7559');}
   else{rect(-5,-3,10,6,'#e6cf89');rect(2,-7,5,6,'#eee0a8');rect(7,-4,3,2,'#c59454');rect(5,-6,1,1,'#334b42');rect(-7,-3,3,2,'#cbb773');}ctx.restore();
  }
 }
 function updateNature(dt){
  updatePond(dt);kiteCooldown=Math.max(0,kiteCooldown-dt);butterflyWait=Math.max(0,butterflyWait-dt);
  const quiet=!ambientSceneBusy()&&springBloom()>.3&&!ridesWet()&&nightLevel()<.4&&!momentsBusy()&&!restingBench&&teaTime<=0&&Math.hypot(player.vx,player.vy)<3;
  if(!quiet){butterflyIdle=0;if(butterfly)butterfly.depart=true;}
  else butterflyIdle+=dt;
  if(!butterfly&&quiet&&butterflyIdle>3&&butterflyWait===0){butterfly={age:0,depart:false,away:0,x:player.x-(reduced?-3:65),y:player.y-(reduced?54:92)};butterflyWait=25;}
  if(butterfly){const b=butterfly;b.age+=dt;if(b.age>7)b.depart=true;if(b.depart){b.away+=dt;if(!reduced){b.x+=28*dt;b.y-=18*dt;}if(b.away>=2)butterfly=null;}else{const rate=Math.min(1,dt*2);b.x+=(player.x+3-b.x)*rate;b.y+=(player.y-54-b.y)*rate;}}
 }
 function drawSpringAir(){
  const bloom=springBloom();if(bloom>.05&&!reduced&&!comfort.lightweight&&!ridesWet()){
   ctx.save();ctx.globalAlpha=bloom*.75;
   for(const t of trees){if(!blossomTree(t)||t.tx*T<camX-55||t.tx*T>camX+viewW||t.ty*T<camY-60||t.ty*T>camY+viewH)continue;
    for(let i=0;i<effectCount(3);i++){const u=(elapsed*.12+i*.33+t.tx*.07)%1,x=t.tx*T+12+u*42+Math.sin(elapsed+i)*4,y=t.ty*T-15+u*65;rect(x,y,3,2,i%2?'#eed4d0':'#f2e6d2');}}
   ctx.restore();
  }
  if(!butterfly)return;const b=butterfly,flap=reduced?3:2+Math.abs(Math.sin(elapsed*(b.age<3?16:5)))*4;ctx.save();ctx.globalAlpha=1-b.away/2;rect(b.x-flap,b.y-2,flap,5,'#d8b4cd');rect(b.x+1,b.y-2,flap,5,'#eed6a1');rect(b.x,b.y-3,1,7,'#6f6250');ctx.restore();
 }
 function useKite(){
  if(ridesWet()||snowCover()>.15){speech='Полёты откладываются! Дождёмся сухой погоды.';speechTime=4;return;}
  if(kiteCooldown>0){speech='Дадим ветру передохнуть. Скоро запустим снова!';speechTime=3;return;}
  clearInput();player.vx=player.vy=0;dashTime=0;teaTime=0;restingBench=null;funScene={kind:'kite',time:0};speech='Попутного ветра!';speechTime=2;
 }
 function finishKite(cancelled=false){if(funScene?.kind!=='kite')return;funScene=null;kiteCooldown=cancelled?3:15;if(!cancelled){kiteFlights=Math.min(999,kiteFlights+1);unlockAchievement('kite');speech='Вот это высота! И никаких авиабилетов.';}else speech=ridesWet()?'Полёты откладываются! Сматываем леску.':'Змей на земле. Продолжим прогулку!';speechTime=4;save();}

 function kiteWind(){const phase=weatherTime();return windGust()+(phase>=25&&phase<30?(phase-25)*.4:0);}
 function kitePose(){
  if(funScene?.kind!=='kite')return null;
  const progress=unit(funScene.time/2)*unit((8-funScene.time)/1.5),gust=reduced?0:Math.sin(elapsed*1.4)*kiteWind()*7;
  return {x:player.x+35+progress*22+gust,y:player.y-32-progress*102,angle:gust*.013,progress};
 }
 function kiteTail(){return Array.from({length:9},(_,i)=>({x:reduced?i*1.5:Math.sin(elapsed*2.8-i*.6)*(4+i*.7)*(1+kiteWind()*.15)+i*1.5,y:26+i*6}));}
 function drawKite(){
  const pose=kitePose(),x=pose?player.x:kiteSite.x,y=pose?player.y:kiteSite.y;
  if(!pose){rect(x-13,y-5,26,10,'#9a7b52');rect(x-10,y-6,20,3,'#d8c292');rect(x-6,y-14,12,8,'#86b8bc');rect(x-2,y-17,4,14,'#efc779');return;}
  ctx.save();ctx.strokeStyle='#ede5c9';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+11,y-18);ctx.quadraticCurveTo(x+40,y-30,pose.x,pose.y+9);ctx.stroke();
  rect(x+7,y-24,8,8,'#d7b778');rect(x+8,y-21,7,3,'#f1d59c');ctx.translate(pose.x,pose.y);ctx.rotate(pose.angle);
  ctx.fillStyle='#74a9b0';ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(18,0);ctx.lineTo(0,24);ctx.lineTo(-18,0);ctx.closePath();ctx.fill();
  ctx.fillStyle='#e7bd7a';ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(18,0);ctx.lineTo(0,24);ctx.closePath();ctx.fill();line(0,-22,0,24,'#f3e5bc',1);line(-18,0,18,0,'#f3e5bc',1);
  let last={x:0,y:24};for(const [i,p]of kiteTail().entries()){line(last.x,last.y,p.x,p.y,'#d0c6a6',1);rect(p.x-4,p.y,3,4,['#dfa994','#92b8b2','#d7c284'][i%3]);rect(p.x+1,p.y,3,4,['#dfa994','#92b8b2','#d7c284'][i%3]);last=p;}ctx.restore();
 }
 function drawKiteLights(){
  const pose=kitePose(),level=nightLevel();if(!pose||level<.1)return;
  ctx.save();ctx.translate(pose.x-camX,pose.y-camY);ctx.rotate(pose.angle);
  for(const p of kiteTail()){if(!comfort.lightweight){ctx.globalAlpha=level*.15;rect(p.x-5,p.y-3,10,10,'#ffe2a2');}ctx.globalAlpha=level*.85;rect(p.x-1,p.y+1,2,2,'#ffebba');}ctx.restore();
 }
 function photoMomentBusy(){return !!idleEscort||blocked()||driving||cycling||(!!funScene&&!['kite','bear'].includes(funScene.kind))||!!feedScene||!!towScene||!!trafficStop||wheelTime>0||swingTime>0||karaokeTime>0||pumpTime>0;}
 function renderKiteGuide(){$('kite-status').textContent='Удачных запусков: '+kiteFlights+'. Поляна к востоку от беседки. Запуск — 8 секунд: ветер подхватывает длинный хвост, вечером светятся огоньки. P / 📷 остановит время для снимка. E сматывает леску. В дождь и снег змей отдыхает.';$('kite-track').textContent=trackedPlace===kitePlace?'Убрать указатель':'Найти поляну';}

 // Four selected originals produce a printable 2400 × 1800 postcard.
 function updateCollageControls(){
  const chosen=new Set(collage.ids);for(const input of $('collage-choices').querySelectorAll?.('input')||[]){input.checked=chosen.has(input.value);input.disabled=collageBusy||(!input.checked&&chosen.size===4);}
  $('collage-count').textContent='Выбрано '+chosen.size+' / 4. Снимки расположатся в порядке выбора.';$('collage-create').disabled=collageBusy||chosen.size!==4;$('collage-caption').disabled=collageBusy;
 }
 function renderCollage(){
  const list=$('collage-choices');list.replaceChildren();collage.ids=collage.ids.filter(id=>photoShots[id]);
  for(const p of photoTargets){const shot=photoShots[p.id];if(!shot)continue;const label=document.createElement('label'),input=document.createElement('input'),img=document.createElement('img'),name=document.createElement('span');input.type='checkbox';input.value=p.id;input.checked=collage.ids.includes(p.id);img.src=shot.image;img.alt='';name.textContent=p.name;label.append(input,img,name);input.onchange=()=>{if(collageBusy)return;if(input.checked&&collage.ids.length<4)collage.ids.push(p.id);else if(!input.checked)collage.ids=collage.ids.filter(id=>id!==p.id);collageRevision++;$('collage-result').hidden=true;updateCollageControls();save();};list.append(label);}
  $('collage-caption').value=collage.caption;$('collage-status').textContent=Object.keys(photoShots).length<4?'Для открытки нужны любые четыре снимка из фотоохоты.':'Выберите четыре снимка. Оригиналы останутся в фотоальбоме.';updateCollageControls();
 }
 function photoImage(url){return new Promise((resolve,reject)=>{const img=new Image(),timer=setTimeout(()=>reject(new Error('Image timeout')),8000);img.onload=()=>{clearTimeout(timer);resolve(img);};img.onerror=()=>{clearTimeout(timer);reject(new Error('Image unavailable'));};img.src=url;});}
 function collageLayout(width,height,x,y,w,h){const scale=Math.min(w/width,h/height);return {x:x+(w-width*scale)/2,y:y+(h-height*scale)/2,w:width*scale,h:height*scale};}
 async function createCollage(){
  if(collageBusy||collage.ids.length!==4||!collage.ids.every(id=>photoShots[id]))return false;
  collageBusy=true;updateCollageControls();const revision=collageRevision,ids=[...collage.ids],caption=collage.caption,shots=ids.map(id=>({...photoShots[id]}));$('collage-status').textContent='Собираем открытку…';
  try{
   const images=[];let previews=0;
   for(const shot of shots){const original=shot.storageKey?await loadPhotoOriginal(shot.storageKey):null;let img;try{img=await photoImage(original||shot.image);if(!original)previews++;}catch{if(!original)throw new Error('Photo unavailable');img=await photoImage(shot.image);previews++;}images.push(img);}
   if(revision!==collageRevision)return false;
   const c=document.createElement('canvas');c.width=2400;c.height=1800;const g=c.getContext('2d');if(!g)throw new Error('Canvas unavailable');g.imageSmoothingEnabled=false;g.fillStyle='#f7f1e3';g.fillRect(0,0,2400,1800);g.fillStyle='#284e43';g.fillRect(0,0,2400,205);g.fillStyle='#fff4d7';g.font='bold 66px Arial';g.fillText('Моя прогулка в парке DEX',90,108);g.font='28px Arial';g.fillText('Четыре мгновения, которые хочется сохранить',94,160);
   images.forEach((img,i)=>{const x=90+i%2*1140,y=250+Math.floor(i/2)*640;g.fillStyle='#e5e9da';g.fillRect(x,y,1080,550);const fit=collageLayout(img.naturalWidth,img.naturalHeight,x,y,1080,550);g.drawImage(img,fit.x,fit.y,fit.w,fit.h);g.fillStyle='#284e43';g.font='bold 30px Arial';g.fillText(photoTargets.find(p=>p.id===ids[i]).name,x,y+593);g.font='24px Arial';g.fillText(formatTime(shots[i].time),x+925,y+593);});
   g.fillStyle='#385a4c';g.font='34px Arial';const words=(caption||'Всё начинается с любопытства.').split(/\s+/);let line='',row=0;for(const word of words){const next=line?line+' '+word:word;if(g.measureText(next).width>2200&&line){g.fillText(line,90,1615+row*45);row++;line=word;}else line=next;}g.fillText(line,90,1615+row*45,2200);g.font='24px Arial';g.fillStyle='#718371';g.fillText('DEX · 20 лет вместе · Парк Победа',90,1750);
   const url=c.toDataURL('image/png');$('collage-image').src=url;$('collage-download').href=url;$('collage-download').download='DEX-моя-прогулка-2400x1800.png';$('collage-result').hidden=false;$('collage-status').textContent='Открытка готова: 2400 × 1800 px.'+(previews?' Для '+previews+' кадров доступна только миниатюра — их детализация ниже.':' Все четыре кадра взяты из оригиналов.')+' Нажмите «Скачать открытку»; на телефоне можно удерживать изображение.';return true;
  }catch{$('collage-status').textContent='Не удалось собрать открытку. Снимки сохранены — попробуйте ещё раз.';return false;}
  finally{collageBusy=false;updateCollageControls();}
 }

 const DAY_SECONDS=240,EVENING_SECONDS=60,SKY_FADE_SECONDS=6;
 function nightLevel(time=elapsed){return Math.max(ordinaryNightLevel(time),auroraLevel(time)*.82);}
 function ordinaryNightLevel(time=elapsed){if(weatherControlled()){const target=parkWeather.mode==='evening'?1:0;return parkWeather.fromNight+(target-parkWeather.fromNight)*unit(weatherAge(time)/4);}const cycle=DAY_SECONDS+EVENING_SECONDS,t=time%cycle;return t<DAY_SECONDS?0:Math.max(0,Math.min(1,(t-DAY_SECONDS)/SKY_FADE_SECONDS,(cycle-t)/SKY_FADE_SECONDS));}
 let trackedPlace=-1,mapHitRegions=[];
 const memories=new Map(),memoryTypes=[{id:'rainbow',title:'После дождя',hint:'Дождитесь радуги.',icon:'🌈'},{id:'night',title:'Парк засыпает',hint:'Застаньте ночной парк.',icon:'☾'},{id:'photo',title:'Птица в кадре',hint:'Сделайте фото в фотозоне.',icon:'📷'},{id:'repair',title:'Сам себе автосервис',hint:'Подкачайте колесо BMW.',icon:'▥'}];
 function remember(id){if(memories.has(id))return;memories.set(id,Math.floor(elapsed));save();}
 function goalName(){if(trackedPlace===-3&&photoNav)return 'Снимок: '+photoNav.name;if(trackedPlace===-2&&personalMarker)return personalMarker.name;if(trackedPlace===squirrelPlace)return squirrelGoalName();if(trackedPlace===snowmanPlace)return snowmanGoalName();if(trackedPlace===gardenPlace)return gardenGoalName();return trackedPlace>=0?mapPlaces[trackedPlace].name:trackedErrand>=0?errands[trackedErrand].title+' · '+['Поговорить','Найти предмет','Вернуть предмет','Готово'][errandStates[trackedErrand]]:(pinnedSpec()?.name||'');}
 function clearTrackedGoal(){if(blocked())return;pinnedActivity='';trackedPlace=-1;trackedErrand=-1;navCache=null;clearInput();save();updateGoalCard();canvas.focus();}
 function goalCardTitle(){if(trackedPlace===-3&&photoNav)return 'Место снимка: '+photoNav.name;if(trackedPlace===-2&&personalMarker)return personalMarker.name;if(trackedPlace===janitorPlace||pinnedActivity==='janitor')return janitorHelp.stage===1?'Листья: '+janitorHelp.leaves.length+' / 3':janitorHelp.stage===2?'Вернитесь к дворнику':'Дворник';if(trackedPlace===courierPlace||pinnedActivity==='courier')return courier.stage===1?(Math.hypot(player.x-courier.x,player.y-courier.y)>170?'Вернитесь к курьеру':'Проводите курьера к кафе'):'Робот-курьер';if(trackedPlace===squirrelPlace)return squirrelGoalName();if(trackedPlace===snowmanPlace)return snowmanGoalName();if(trackedPlace===gardenPlace)return gardenGoalName();if(trackedPlace>=0)return mapPlaces[trackedPlace].name;if(trackedErrand<0)return pinnedSpec()?.name||'';const state=errandStates[trackedErrand],book=trackedErrand===1;return state===0?book?'Поговорите с Аней у кафе':'Поговорите с парнем у входа':state===1?book?'Найдите потерянную книгу':'Найдите потерянный мячик':state===2?book?'Верните книгу Ане у кафе':'Отнесите мячик собачке':'Поручение выполнено';}
 function updateGoalCard(){const goal=trackedGoal(),hidden=ambientSceneBusy()||!!idleEscort||!goal||blocked()||noticeTime>0||focusedDialogue()||focusedParkShow()||!!funScene||wheelTime>0||swingTime>0||karaokeTime>0||!!feedScene||!!towScene||!!trafficStop;$('goal-card').hidden=hidden;if(!goal)return;const title=goalCardTitle(),distance=Math.round(Math.hypot(goal.x-player.x,goal.y-player.y)/T),detail=(distance<=2?'Вы рядом':'Около '+distance+' шагов по прямой')+' · Карта →';if($('goal-name').textContent!==title)$('goal-name').textContent=title;if($('goal-distance').textContent!==detail)$('goal-distance').textContent=detail;$('tracked-goal').setAttribute('aria-label',title+'. '+detail);}
 function selectPlace(i){if(!Number.isInteger(i)||!mapPlaces[i])return;pinnedActivity='';trackedPlace=trackedPlace===i?-1:i;trackedErrand=-1;navCache=null;save();closeJournal();}
 let trackedErrand=-1;
 function trackedGoal(){if(trackedPlace===-3)return photoNav;if(pinnedActivity==='catWalk')return seekCat;if(trackedPlace===-2)return personalMarker;if(trackedPlace===janitorPlace||trackedPlace<0&&trackedErrand<0&&pinnedActivity==='janitor')return janitorGoal();if(trackedPlace===courierPlace||trackedPlace<0&&trackedErrand<0&&pinnedActivity==='courier')return courierGoal();if(trackedPlace===squirrelPlace)return squirrelGoal();if(trackedPlace===snowmanPlace)return snowmanGoal();if(trackedPlace===gardenPlace)return gardenGoal();if(trackedPlace>=0)return mapPlaces[trackedPlace];if(trackedErrand<0)return pinnedSpec()?mapPlaces[pinnedSpec().place]:null;const e=errands[trackedErrand],state=errandStates[trackedErrand];return state===3?null:state===0?e.giver:state===1?e.item:e.receiver;}
 function followErrand(i){trackedPlace=-1;trackedErrand=i;navCache=null;}
 function selectErrand(i){trackedPlace=-1;trackedErrand=trackedErrand===i?-1:i;save();closeJournal();}
 let sportMode=true;
 function toggleSport(){if(blocked()||!driving||trafficStop||towScene)return;sportMode=!sportMode;if(!sportMode&&driveSpeed>50/.22){driveSpeed=50/.22;brakeGlow=.5;}save();updateUI();}
 let errandStates=[0,0];
 let fines={pigeons:0,red:0,speeding:0,parking:0};
 function recordFine(kind){fines[kind]++;save();}
 function readyToFinish(){return solved.size===TOTAL&&collected.size===8&&errandStates.every(s=>s===3);}
 function completionStatus(){return `Аллея ${[...solved].filter(i=>i<15).length}/15 · Тайники ${[...solved].filter(i=>i>=15).length}/5 · DEX ${collected.size}/8 · Поручения ${errandStates.filter(s=>s===3).length}/2`;}
 function remainingHint(){if(solved.size<TOTAL)return `Осталось вопросов: ${TOTAL-solved.size}. Нажмите Q для подсказки.`;if(collected.size<8)return `Осталось логотипов DEX: ${8-collected.size}. Подсказки — в журнале J.`;if(errandStates.some(s=>s!==3))return 'Верните мячик собачке и книгу девушке. Подсказки — в журнале J → Добрые дела.';return 'Всё найдено и выполнено — можно на финиш!';}
 const errandGivers=errands.map((e,id)=>({...e.giver,type:'giver',id,action:'Поговорить'}));
 // Leave a visible gap between the east love poster and the DEX photo backdrop.
 const lovePosters=[{tx:33,ty:47},{tx:69.5,ty:22}].map(p=>({...p,...point([p.tx,p.ty])}));
 // Keep the eastern beds wholly in the lawn strip, clear of the alley and fence.
 const flowerBeds=[[70,31,3,2],[87.25,36,1.5,2],[71,35,2,2],[65,51,3,2],[59,60,3,2],[72,61,2,1],[81,31,2,1],[74,33,3,2],[77,38,2,2],[87.25,31,1.5,2],[68,38,3,2]].map(([tx,ty,w,h])=>({tx,ty,w,h}));
 const picnicTables=[[70,48],[73,51],[70,53]].map(([tx,ty])=>({tx,ty,...point([tx,ty])}));
 const picnicBlankets=[[73,48],[78,54]].map(point);
 const directionSigns=[{tx:65,ty:46,lines:['ПИКНИК →','← ЦЕНТР']},{tx:81,ty:47,lines:['САД ↑','ПИКНИК ↓']},{tx:55,ty:55,lines:['ПИКНИК →','← КАФЕ']}].map(p=>({...p,...point([p.tx,p.ty])}));
 const gardenTile=(x,y)=>flowerBeds.some(b=>x+1>b.tx&&x<b.tx+b.w&&y+1>b.ty&&y<b.ty+b.h)||picnicTables.some(b=>x>=b.tx&&x<b.tx+2&&y>=b.ty&&y<b.ty+2);
 const photoZone=point([56,47]);
 const photoSpot={x:photoZone.x,y:photoZone.y+24,kind:'photo',action:'Сфотографироваться'};
 const paintedBench={...point([60,41]),kind:'paint',action:'Присесть на скамейку'};
 const gooseHome=point([64,48]),goose={...gooseHome,state:'idle',time:0,cooldown:0,trail:[]};
 let funScene=null,paintTime=0,coffeeTime=0,bushTime=0,bootTime=0,detectorActive=false,detectorBeep=0,sprinkleTime=0,sprinkleCooldown=0,wetTime=0,networkTime=0;
 let extras={balloon:0,nut:0,litter:0,debt:false,beauty:false,cups:0,luckMoney:0,boots:0,feeds:0,guestRemoved:false,visits:{}};
 // One optional scene shares the existing goose; only completed/accepted progress is saved.

 // Optional neighbourhood stories share collision-aware, throttled walking routes.
 const courierHome=point([51,40]),courierCafe=point([44,48]),hedgehogHome=point([24,62]),parkingCatHome=point([75,64]);
 let courier={...courierHome,kind:'courier',id:'delivery',name:'Робот-курьер',stage:0,path:[],repath:0,quip:0,moving:false};
 let hedgehog={...hedgehogHome,path:[],repath:0,goal:0,leaves:0,wait:0,curl:0,watch:0,moving:false,face:1};
 let hoodCat={...parkingCatHome,path:[],repath:0,state:'idle',time:0,rest:0,pet:0,face:1,kind:'cat',color:'#c5b5a0',stride:0,moving:false};
 let carWarmth=0,carWarmDistance=0,auroraSeen='';
 const hedgehogLeaves=[[23,63],[22,62],[23,61]].map(point);
 function restoreNeighbourStories(v={}){
  const saved=v.courier,stage=[0,1,2].includes(saved?.stage)?saved.stage:0;
  const pos=stage===2&&saved?.phase==='charge'?courierHome:stage>0&&Number.isFinite(saved.x)&&Number.isFinite(saved.y)&&saved.x>8*T&&saved.x<87*T&&saved.y>8*T&&saved.y<67*T&&lifeClear(saved.x,saved.y)?saved:stage===2?courierCafe:courierHome;
  courier={x:pos.x,y:pos.y,kind:'courier',id:'delivery',name:'Робот-курьер',stage,phase:stage===2?(['pickup','return','charge'].includes(saved?.phase)?saved.phase:'pickup'):null,path:[],repath:0,quip:0,moving:false};
  hedgehog={...hedgehogHome,path:[],repath:0,goal:0,leaves:0,wait:0,curl:0,watch:0,moving:false,face:1};
  hoodCat={...parkingCatHome,path:[],repath:0,state:'idle',time:0,rest:0,pet:0,face:1,kind:'cat',color:'#c5b5a0',stride:0,moving:false};
  carWarmth=carWarmDistance=0;auroraSeen=typeof v.auroraSeen==='string'&&/^(season|weather):\d{1,8}$/.test(v.auroraSeen)?v.auroraSeen:'';
 }
 function storyCarBlocks(x,y,pad=0){if(!bmwAvailable||towScene)return false;const c=Math.cos(bmw.angle),sn=Math.sin(bmw.angle),dx=x-bmw.x,dy=y-bmw.y;return Math.abs(dx*c+dy*sn)<38+pad&&Math.abs(-dx*sn+dy*c)<57+pad;}
 function storyStep(n,target,speed,dt,keepAway=true){
  n.moving=false;n.repath=Math.max(0,(n.repath||0)-dt);
  const key=Math.floor(target.x/T)+','+Math.floor(target.y/T),distance=Math.hypot(n.x-target.x,n.y-target.y);
  if(distance<3){n.path=[];return true;}
  if(!n.repath&&(!n.path?.length||n.routeKey!==key)){n.path=lifePath(n,[Math.floor(target.x/T),Math.floor(target.y/T)],null,true);n.routeKey=key;n.repath=1.4;}
  while(n.path?.length&&Math.hypot(n.path[0].x-n.x,n.path[0].y-n.y)<2)n.path.shift();
  const goal=n.path?.[0]||(distance<T?target:null);if(!goal)return false;
  const dx=goal.x-n.x,dy=goal.y-n.y,d=Math.hypot(dx,dy),step=Math.min(d,speed*dt),x=n.x+dx/(d||1)*step,y=n.y+dy/(d||1)*step;
  if(!lifeClear(x,y)||storyCarBlocks(x,y)){n.path=[];return false;}
  if(keepAway&&Math.hypot(x-player.x,y-player.y)<25){if(!n.repath&&Math.hypot(target.x-player.x,target.y-player.y)>28){n.path=lifePath(n,[Math.floor(target.x/T),Math.floor(target.y/T)],player,true);n.repath=1.4;}return false;}
  n.x=x;n.y=y;n.moving=true;n.stride=(n.stride||0)+dt*9;if(Math.abs(dx)>.1)n.face=Math.sign(dx);return false;
 }
 function courierGoal(){return courier.stage!==1||Math.hypot(courier.x-player.x,courier.y-player.y)>170?courier:courierCafe;}
 function useCourier(){
  if(courier.stage===2){speech=courier.phase==='charge'?'Курьер: «Проверенный человек. Можно доверять! Заряжаюсь добрыми делами… и электричеством».':courier.phase==='return'?'Курьер: «Посылка вручена. Еду к зарядной станции — спасибо, напарник!»':'Курьер: «Получатель уже идёт за посылкой. Спасибо за сопровождение!»';speechTime=4;return;}
  if(!courier.stage){courier.stage=1;courier.path=[];courier.repath=0;speech='Курьер: «Маршрут построен. Уверенность — 3%. Проводите меня к кафе?»';}
  else speech=ridesWet()?'Курьер: «Коробка не водонепроницаемая. Переждём непогоду!»':'Курьер: «Я за вами! Не убегайте далеко. Получатель ждёт у кафе».';
  speechTime=5;pinnedActivity='courier';trackedPlace=courierPlace;trackedErrand=-1;navCache=null;courier.quip=12;save();
 }
 function updateCourier(dt){
  courier.moving=false;courier.quip=Math.max(0,courier.quip-dt);Object.assign(mapPlaces[courierPlace],{x:courier.x,y:courier.y});
  if(courier.stage===2){updateCourierAftercare(dt);return;}if(courier.stage!==1||ridesWet()||driving||funScene||idleEscort||feedScene||towScene||trafficStop)return;
  const distance=Math.hypot(player.x-courier.x,player.y-courier.y),atCafe=Math.hypot(player.x-courierCafe.x,player.y-courierCafe.y)<110;
  if(Math.hypot(courier.x-courierCafe.x,courier.y-courierCafe.y)<56&&atCafe){courier.stage=2;courier.phase='pickup';courier.pickupTime=0;courier.path=[];completePinned('courier');speech='Курьер: «Доставка завершена. Человечность обнаружена! Спасибо за сопровождение».';speechTime=5;unlockAchievement('lastMile');window.ParkAudio?.reward?.();save();return;}
  if(distance>330){if(!courier.quip&&distance<480){courier.quip=18;announce('Курьер ждёт на дорожке. Вернитесь к нему — посылка ещё у него.');}return;}
  const bird=[...pigeons,...tamePigeons].some(b=>!b.flight&&Math.hypot(b.homeX-courier.x,b.homeY-courier.y)<38);
  if(bird&&!courier.yielded){courier.yielded=true;courier.birdYield=1.4;if(!courier.quip&&distance<150){speech='Курьер: «Уступаю дорогу пешеходам с перьями».';speechTime=3;courier.quip=15;}}
  if(courier.birdYield>0){courier.birdYield-=dt;return;}if(!bird){courier.birdYield=0;courier.yielded=false;}
  if(distance<48&&!atCafe)return;
  storyStep(courier,atCafe?courierCafe:player,112,dt);
 }
 function drawCourier(){const n=courier,bob=n.moving&&!reduced?Math.sin(elapsed*12)*.6:0;ctx.save();ctx.translate(n.x,n.y+bob);rect(-16,1,32,5,'#294a3940');for(const x of [-15,9]){rect(x,-8,6,12,'#34494c');rect(x+1,-5,4,4,'#778785');}rect(-14,-29,28,26,'#dedac6');rect(-12,-27,24,10,'#45696b');for(const x of [-7,5])rect(x,-24,3,4,'#b6ded5');rect(-5,-17,10,1,'#b6ded5');rect(-3,-34,6,5,'#7d9b92');rect(-1,-38,2,6,'#aab7a7');rect(-2,-39,4,3,'#d8c27c');rect(-11,-14,22,10,'#789890');text('DEX',0,-6,7,'#eef0d9','center');if(n.stage!==2||n.phase==='pickup'){rect(-10,-15,20,12,'#ba986c');rect(-1,-15,3,12,'#e3c68e');rect(-8,-12,5,3,'#f2e6c8');}else{rect(16,-24,4,15,'#dedac6');rect(15,-27,6,5,'#dedac6');}ctx.restore();}
 function hoodCatOnCar(){return ['jump','sleep','leave'].includes(hoodCat.state);}
 function startCatLeave(){if(!hoodCatOnCar())return;hoodCat.state='leave';hoodCat.time=0;hoodCat.from={x:hoodCat.x,y:hoodCat.y};hoodCat.path=[];hoodCat.repath=0;}
 function petHoodCat(){if(hoodCat.state!=='sleep')return;hoodCat.pet=3;speech='Кажется, парковочное место уже занято. Мур-р-р…';speechTime=4;unlockAchievement('warmParking');save();}
 function updateHoodCat(dt){
  const n=hoodCat;n.moving=false;n.rest=Math.max(0,n.rest-dt);n.pet=Math.max(0,n.pet-dt);carWarmth=Math.max(0,carWarmth-dt);
  if((driving||ridesWet()||!bmwAvailable||towScene)&&hoodCatOnCar()&&n.state!=='leave')startCatLeave();
  if(n.state==='jump'||n.state==='leave'){
   n.time+=dt;const leaving=n.state==='leave',duration=leaving?1.25:.8,u=unit((n.time-(leaving?.35:0))/(leaving?.9:.8));
   const target=leaving?n.edge:vehiclePoint(bmw,0,32);n.x=n.from.x+(target.x-n.from.x)*u;n.y=n.from.y+(target.y-n.from.y)*u;n.lift=reduced?0:Math.sin(u*Math.PI)*20;
   if(n.time>=duration){n.lift=0;n.state=leaving?'return':'sleep';n.time=0;if(leaving)n.rest=45;else if(Math.hypot(player.x-n.x,player.y-n.y)<180&&!notificationBusy()){speech='Кажется, парковочное место уже занято.';speechTime=4;}}
   return;
  }
  if(n.state==='sleep'){n.time+=dt;if(n.time>35||!carWarmth)startCatLeave();return;}
  if(n.state==='return'){if(storyStep(n,parkingCatHome,48,dt)){n.state='idle';n.path=[];}return;}
  if(n.state==='approach'){
   if(driving||ridesWet()||towScene||!bmwAvailable||!carWarmth||Math.hypot(n.park.x-bmw.x,n.park.y-bmw.y)>1){n.state='return';n.path=[];return;}
   if(storyStep(n,n.edge,50,dt)){n.from={x:n.x,y:n.y};n.time=0;n.state='jump';}return;
  }
  if(n.rest||driving||ridesWet()||towScene||!bmwAvailable||!carWarmth||carWarmDistance<90||Math.hypot(n.x-bmw.x,n.y-bmw.y)>440)return;
  const edges=[vehiclePoint(bmw,62,31),vehiclePoint(bmw,-62,31),vehiclePoint(bmw,0,82)].filter(p=>lifeClear(p.x,p.y)&&!storyCarBlocks(p.x,p.y));edges.sort((a,b)=>Math.hypot(n.x-a.x,n.y-a.y)-Math.hypot(n.x-b.x,n.y-b.y));
  const edge=edges.find(p=>lifePath(n,[Math.floor(p.x/T),Math.floor(p.y/T)],null,true).length);if(!edge){n.rest=8;return;}
  n.edge=edge;n.park={x:bmw.x,y:bmw.y};n.state='approach';n.path=[];n.repath=0;
 }
 function drawHoodCat(){
  const n=hoodCat;if(n.state!=='sleep'){ctx.save();ctx.translate(0,-(n.lift||0));drawWanderer(n);ctx.restore();return;}
  ctx.save();ctx.translate(n.x,n.y);const breath=reduced?0:Math.sin(elapsed*2)*.4;rect(-13,-2,26,4,'#182a3144');rect(-12,-13-breath,24,13,n.color);rect(-15,-10,8,9,'#a99786');rect(3,-17,12,12,n.color);rect(3,-20,4,6,n.color);rect(11,-20,4,6,n.color);rect(6,-12,6,1,'#45545a');rect(-8,-9,3,6,'#9d8f80');rect(-2,-10,3,7,'#9d8f80');if(n.pet)text('♥',1,-30,12,'#d9a3a1','center');else text('z',-4,-25,9,'#d3ddcd','center');ctx.restore();
 }
 function updateHedgehog(dt){
  const n=hedgehog;n.moving=false;n.curl=Math.max(0,n.curl-dt);n.wait=Math.max(0,n.wait-dt);
  if(seasonState().id==='winter'||snowCover()>.2||ridesWet()||nightLevel()<.12){if(Math.hypot(n.x-hedgehogHome.x,n.y-hedgehogHome.y)>3)storyStep(n,hedgehogHome,32,dt);n.watch=0;return;}
  const d=Math.hypot(n.x-player.x,n.y-player.y),speed=Math.hypot(player.vx,player.vy);
  if(!reduced&&d<65&&speed>95){n.curl=2;n.watch=0;}
  if(n.curl>0)return;
  if(d<100&&speed<15&&!driving&&!momentsBusy()){n.watch+=dt;if(n.watch>=3){unlockAchievement('quietNeighbour');completePinned('hedgehog');}if(d<42)return;}else n.watch=0;
  if(n.wait>0)return;
  const target=n.carry?hedgehogHome:hedgehogLeaves[n.goal%hedgehogLeaves.length];
  if(storyStep(n,target,26,dt)){n.path=[];n.repath=0;if(n.carry){n.carry=false;n.leaves=Math.min(8,n.leaves+1);n.goal++;n.wait=2;}else{n.carry=true;n.wait=1.2;}}
 }
 function drawHedgehogHome(){if(courier.stage===1&&!capturingPhoto){const p=courierCafe;ctx.strokeStyle='#dfc783';ctx.lineWidth=2;ctx.strokeRect(p.x-19,p.y-17,38,34);text('КАФЕ',p.x,p.y-24,9,'#f2e3b9','center');}const p=hedgehogHome,autumn=seasonState().id==='autumn',count=autumn?14:8;rect(p.x-20,p.y-8,40,17,'#536745');for(let i=0;i<count;i++)rect(p.x-20+(i*17)%37,p.y-12+(i*7)%21,9,4,['#ac8955','#b69a68','#8d7c51'][i%3]);rect(p.x-6,p.y-4,12,9,'#485444');if(snowCover()>.2)rect(p.x-22,p.y-12,44,8,'#e1e7df');}
 function drawHedgehog(){const n=hedgehog;if(Math.hypot(n.x-hedgehogHome.x,n.y-hedgehogHome.y)<4&&(snowCover()>.2||ridesWet()||nightLevel()<.12)){if(Math.hypot(player.x-n.x,player.y-n.y)<100)text('z',n.x,n.y-18,8,'#d9ddc3','center');return;}
  ctx.save();ctx.translate(n.x,n.y);ctx.scale(n.face||1,1);rect(-12,1,24,3,'#314d3c44');rect(-11,-12,20,13,'#766750');for(let i=0;i<7;i++)rect(-12+i*3,-15+(i%2)*2,3,5,'#a89876');if(!n.curl){rect(6,-9,10,8,'#bcaa88');rect(15,-6,3,3,'#354448');rect(10,-8,2,2,'#354448');const stride=n.moving&&!reduced?Math.sin(elapsed*10)*2:0;rect(-8,0+stride,4,4,'#605743');rect(5,-stride,4,4,'#605743');if(n.carry)rect(12,-1,9,4,'#c4a36c');}else{rect(-11,-6,21,9,'#817054');rect(-10,0,18,2,'#ac9b79');}ctx.restore();}
 function auroraLevel(time=elapsed){if(weatherControlled()&&parkWeather.mode!=='snow')return 0;const t=weatherControlled()?weatherAge(time)-SNOW_SECONDS:seasonPhase(time)-SNOW_AT-SNOW_SECONDS;return t>=0&&t<24?unit(t/4)*unit((24-t)/5)*snowCover(time):0;}
 function updateNeighbourStories(dt){
  updateCourier(dt);updateHoodCat(dt);updateHedgehog(dt);
  const key=weatherControlled()?'weather:'+parkWeather.serial:'season:'+Math.floor(elapsed/SEASON_SECONDS);
  if(!ambientSceneBusy()&&auroraLevel()>.35&&auroraSeen!==key&&!momentsBusy()){auroraSeen=key;announce('Метель стихла… Над парком загорается северное сияние · '+(mobileScreen()?'📷':'P')+' — снимок.');window.ParkAudio?.starlight?.();save();}
 }
 function drawAurora(){const level=auroraLevel();if(!level)return;ctx.save();const bands=comfort.lightweight?3:5,segments=comfort.lightweight?18:32,phase=reduced?0:elapsed*.34;
  // Translucent ribbons stay above the scene, leaving paths and controls readable.
  for(let b=0;b<bands;b++){ctx.beginPath();for(let i=0;i<=segments;i++){const x=i/segments*viewW,y=28+b*19+Math.sin(i*.32+phase+b*.7)*18+Math.sin(i*.12-phase*.5)*12;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}for(let i=segments;i>=0;i--){const x=i/segments*viewW,y=28+b*19+Math.sin(i*.32+phase+b*.7)*18+Math.sin(i*.12-phase*.5)*12;ctx.lineTo(x,y+26+Math.sin(i*.4+b)*8);}ctx.closePath();ctx.globalAlpha=level*(b%2?.22:.27);const color=['#76caaa','#afa0d6','#92d2b8','#a2b5da','#74bba2'][b];ctx.fillStyle=color;ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.globalAlpha=level*.4;ctx.beginPath();for(let i=0;i<=segments;i++){const x=i/segments*viewW,y=28+b*19+Math.sin(i*.32+phase+b*.7)*18+Math.sin(i*.12-phase*.5)*12;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();if(!comfort.lightweight)for(let i=0;i<segments;i++){const x=i/segments*viewW,y=28+b*19+Math.sin(i*.32+phase+b*.7)*18+Math.sin(i*.12-phase*.5)*12;for(let j=0;j<3;j++){ctx.globalAlpha=level*.09*(1-j/3);rect(x,y+j*12,2,12,color);}}}
  ctx.globalAlpha=level*.045;rect(0,0,viewW,viewH,'#b5dbcd');ctx.restore();
 }


 // A small rental bike uses the same directional controls as walking.
 const bikeRack={...point([29,51]),kind:'bikeStation',name:'Велопрокат',action:'Взять велосипед'};
 const bikeHome={x:bikeRack.x,y:bikeRack.y+18};
 let cycling=false,bike={...bikeHome,angle:0,pedal:0,rented:false,returns:0,bell:0,saveClock:0};
 function resetBike(){resetBicycleEffects();cycling=false;bike={...bikeHome,angle:0,pedal:0,rented:false,returns:0,bell:0,saveClock:0};}
 // Vehicle contact uses continuous bounds, independent of the tile grid and who is driving.
 function bikeCarOverlap(cycle,car=bmw){
  const c=Math.cos(car.angle),n=Math.sin(car.angle),sin=Math.sin(cycle.angle);
  // Bound the projected wheels, handlebar and frame; their top edge is asymmetric.
  const top=Math.min(-28,-23-11*Math.abs(sin),11*sin-34),bottom=6+11*Math.abs(sin);
  const dx=cycle.x-car.x,dy=cycle.y+(top+bottom)/2-car.y;
  const bx=7+26*Math.abs(Math.cos(cycle.angle)),by=(bottom-top)/2,cw=35,ch=53,gap=3;
  return Math.abs(dx)<bx+Math.abs(c)*cw+Math.abs(n)*ch+gap&&
   Math.abs(dy)<by+Math.abs(n)*cw+Math.abs(c)*ch+gap&&
   Math.abs(dx*c+dy*n)<cw+Math.abs(c)*bx+Math.abs(n)*by+gap&&
   Math.abs(-dx*n+dy*c)<ch+Math.abs(n)*bx+Math.abs(c)*by+gap;
 }
 function vehicleMoveClear(from,to,canAt){
  const turn=Math.atan2(Math.sin(to.angle-from.angle),Math.cos(to.angle-from.angle));
  const steps=Math.max(1,Math.ceil((Math.hypot(to.x-from.x,to.y-from.y)+Math.abs(turn)*64)/4));
  for(let i=1;i<=steps;i++){const u=i/steps;if(!canAt(from.x+(to.x-from.x)*u,from.y+(to.y-from.y)*u,from.angle+turn*u))return false;}
  return true;
 }
 function canCycleAt(x,y,angle=bike.angle){
  // Use the walkable surface, including parking, open gates and perimeter roads.
  const c=Math.cos(angle),n=Math.sin(angle);
  if(bmwAvailable&&bikeCarOverlap({x,y,angle}))return false;
  return [-18,0,18].every(d=>{const px=x+c*d,py=y+n*d;return canStand(px,py,true);});
 }
 function restoreBike(v){
  resetBike();const b=v?.bicycle;if(!b)return;
  bike.returns=Number.isInteger(b.returns)?Math.max(0,Math.min(999,b.returns)):0;
  if(b.rented===true&&[b.x,b.y,b.angle].every(Number.isFinite)&&Math.abs(b.angle)<100){
   let position=canCycleAt(b.x,b.y,b.angle)?{x:b.x,y:b.y}:null;
   // Repair pre-collision saves without losing the rented bicycle or moving the car.
   if(!position&&bmwAvailable&&bikeCarOverlap(b))for(let radius=16;radius<=256&&!position;radius+=16)for(let i=0;i<16;i++){
    const a=i*Math.PI/8,x=b.x+Math.cos(a)*radius,y=b.y+Math.sin(a)*radius;
    if(canCycleAt(x,y,b.angle)){position={x,y};break;}
   }
   if(position){Object.assign(bike,{...position,angle:b.angle,rented:true});
    if(b.riding===true&&!driving&&Math.hypot(player.x-b.x,player.y-b.y)<60){cycling=true;player.x=bike.x;player.y=bike.y;}
   }
  }
  updateBikeMarker();
 }
 function updateBikeMarker(){if(mapPlaces[bikePlace])Object.assign(mapPlaces[bikePlace],{x:bike.rented?bike.x:bikeRack.x,y:bike.rented?bike.y:bikeRack.y,name:bike.rented?'Мой велосипед':'Велосипед у стойки'});}
 function cycleNeighbours(){return [janitor,...supporters,...testers,...wanderers,...pets,courier,hoodCat,hedgehog,balloonOwner,...(!extras.guestRemoved?[drunkGuest]:[]),...(!trafficStop?[parkInspector]:[])];}
 function bicycleSpeedLimit(d,neighbours=cycleNeighbours()){
  let limit=ridesWet()||snowCover()>.1?170:path(player.x/T,player.y/T)?285:220;
  const magnitude=Math.hypot(d.x,d.y);if(magnitude)for(const p of neighbours){
   const dx=p.x-player.x,dy=p.y-player.y,ahead=(dx*d.x+dy*d.y)/magnitude,across=Math.abs(dx*d.y-dy*d.x)/magnitude;
   if(ahead>-10&&ahead<105&&across<35)limit=Math.min(limit,ahead<28?0:ahead<55?65:110);
  }
  return limit;
 }
 function bicycleMoveClear(x,y,neighbours=cycleNeighbours(),angle=bike.angle){
  if(duckCrossingBlocks(x,y,35,player)||!canCycleAt(x,y,angle))return false;
  return neighbours.every(p=>Math.hypot(x-p.x,y-p.y)>=25||Math.hypot(x-p.x,y-p.y)>=Math.hypot(player.x-p.x,player.y-p.y)-.001);
 }
 function takeBike(){
  if(blocked()||cycling||driving||funScene||idleEscort)return false;
  if(garden.stage===1||errandStates.includes(2)||extras.balloon===1){announce('Сначала доставим находку: для велосипеда нужны обе руки.');return false;}
  if(Math.hypot(player.x-bike.x,player.y-bike.y)>85||!canCycleAt(bike.x,bike.y))return false;
  cycling=true;bike.rented=true;bike.bell=0;player.x=bike.x;player.y=bike.y;player.vx=player.vy=0;dashTime=0;heroReaction=null;selectedInteraction='';interactionOrder=[];clearInput();notePlayActivity();updateBikeMarker();
  announce((viewW<600||mobileScreen())?'Стик — ехать. Отпустите — стоп. Справа — звонок.':'Велосипед: WASD / стрелки — направление, пробел — тормоз, H — звонок, E — сойти. У стойки E возвращает велосипед.');save();return true;
 }
 function leaveBike(returnToRack=false){
  if(!cycling)return false;
  const origin=returnToRack?bikeHome:player;
  for(const [dx,dy]of [[-38,10],[38,10],[0,42],[0,-42],[-28,32],[28,32]]){
   const p={x:origin.x+dx,y:origin.y+dy};if(!canStand(p.x,p.y))continue;
   bike.x=returnToRack?bikeHome.x:player.x;bike.y=returnToRack?bikeHome.y:player.y;cycling=false;player.x=p.x;player.y=p.y;player.vx=player.vy=0;bike.bell=0;clearInput();selectedInteraction='';interactionOrder=[];
   if(returnToRack){bike.rented=false;bike.angle=0;bike.returns++;speech='Велосипед на месте. Ноги благодарят!';speechTime=3;}
   updateBikeMarker();save();return true;
  }
  announce('Здесь тесно. Отъедьте немного, чтобы спокойно сойти.');return false;
 }
 function useBikeStation(){if(!bike.rented){takeBike();return;}selectPlace(bikePlace);announce('Велосипед ждёт там, где вы его оставили. Указатель поможет найти его.');}
 function ringBikeBell(){
  if(!cycling||blocked()||bike.bell>0)return false;bike.bell=1.1;notePlayActivity();window.ParkAudio?.bicycleBell?.();
  hornReaction={x:player.x,y:player.y,until:elapsed+1};reactToBikeBell();return true;
 }
 function stepCycling(dt){
  const before={...bike};
  bike.bell=Math.max(0,bike.bell-dt);const d=inputDirection(),neighbours=cycleNeighbours(),limit=bicycleSpeedLimit(d,neighbours),braking=keys.has('Space');
  player.vx=approach(player.vx,braking?0:d.x*limit,(braking?1500:850)*dt);player.vy=approach(player.vy,braking?0:d.y*limit,(braking?1500:850)*dt);
  let speed=Math.hypot(player.vx,player.vy);if(speed>limit&&speed){player.vx*=limit/speed;player.vy*=limit/speed;speed=limit;}
  let angle=bike.angle;
  if(speed>5){const desired=Math.atan2(player.vy,player.vx),delta=Math.atan2(Math.sin(desired-angle),Math.cos(desired-angle));angle+=Math.max(-4.5*dt,Math.min(4.5*dt,delta));angle=Math.atan2(Math.sin(angle),Math.cos(angle));player.face=Math.abs(player.vx)>Math.abs(player.vy)?player.vx>0?'right':'left':player.vy>0?'down':'up';}
  const ox=player.x,oy=player.y,next={x:ox+player.vx*dt,y:oy+player.vy*dt,angle};
  const origin={...bike,x:ox,y:oy},clear=(x,y,a)=>bicycleMoveClear(x,y,neighbours,a);
  let allowed=vehicleMoveClear(origin,next,clear);
  // A turn can widen the bicycle at contact; keep its heading so backing away remains possible.
  if(!allowed&&next.angle!==bike.angle){next.angle=bike.angle;allowed=vehicleMoveClear(origin,next,clear);}
  if(allowed){player.x=next.x;player.y=next.y;bike.angle=next.angle;}
  else player.vx=player.vy=0;
  bike.pedal+=Math.hypot(player.x-ox,player.y-oy)/13;bike.x=player.x;bike.y=player.y;nearest=-1;updateBikeMarker();recordBicycleTrail(before);
  if(Math.hypot(player.x-ox,player.y-oy)<.05)showBikeObstacle(d,neighbours);else bikeCueKey='';
  bike.saveClock+=dt;if(bike.saveClock>2){bike.saveClock=0;save();}
 }
 function drawBikeRack(){const p=bikeRack;rect(p.x-39,p.y-12,78,35,'#65785b33');for(const dx of [-33,-11,11,33]){line(p.x+dx,p.y-11,p.x+dx,p.y+13,'#708c87',3);line(p.x+dx,p.y-11,p.x+dx+9,p.y-11,'#a2b5a2',3);}line(p.x-37,p.y+13,p.x+43,p.y+13,'#4e6b64',3);rect(p.x-3,p.y-51,6,40,'#826e4f');rect(p.x-45,p.y-72,90,25,'#e4dfbf');rect(p.x-42,p.y-69,84,19,'#42685a');text('ВЕЛОПРОКАТ',p.x,p.y-56,11,'#fff0d0','center');}
 function drawBicycle(p,rider=false){
  const c=Math.cos(p.angle),n=Math.sin(p.angle),ax=c*21,ay=n*11,phase=reduced?0:p.pedal;
  ctx.save();ctx.translate(p.x,p.y);rect(-29,0,58,6,'#34513c44');
  for(const side of [-1,1]){const x=ax*side,y=ay*side-9;ctx.strokeStyle='#304850';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,5+Math.abs(c)*5,12,0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#b7c9bf';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,3+Math.abs(c)*4,9,0,0,Math.PI*2);ctx.stroke();line(x-Math.cos(phase)*6,y-Math.sin(phase)*8,x+Math.cos(phase)*6,y+Math.sin(phase)*8,'#a0b8ae',1);}
  line(-ax,-ay-9,-6,-22,'#7ea9a6',3);line(-6,-22,6,-9,'#70a3a0',3);line(6,-9,-ax,-ay-9,'#62928d',3);line(-6,-22,ax,ay-20,'#95bfba',3);line(6,-9,ax,ay-20,'#7ba8a2',3);line(ax,ay-9,ax,ay-31,'#9ab3ac',3);line(ax-5,ay-32,ax+6,ay-32,'#344c4b',3);rect(-12,-26,15,4,'#3c5351');
  if(!rider){line(3,-4,9,6,'#536963',2);ctx.restore();return;}
  const pedal=reduced?0:Math.sin(phase)*4,lean=c*3;
  line(-4,-22,-9,-10+pedal,'#283f59',5);line(2,-21,7,-9-pedal,'#283f59',5);rect(-12,-10+pedal,8,3,'#eee9d2');rect(5,-9-pedal,8,3,'#eee9d2');
  rect(-10+lean,-39,19,19,'#bf3949');rect(-8+lean,-38,15,13,'#ef5555');
  line(-10+lean,-35,ax-5,ay-31,'#ed5554',4);line(8+lean,-35,ax+5,ay-31,'#ed5554',4);rect(ax-7,ay-34,5,5,'#f6b683');rect(ax+3,ay-34,5,5,'#f6b683');
  rect(-9+lean,-55,18,18,'#24457e');rect(-6+lean,-60,13,7,'#31518f');
  if(player.face!=='up'){const shift=player.face==='right'?2:player.face==='left'?-2:0;rect(-7+lean+shift,-50,14,10,'#f6b683');rect(-4+lean+shift,-48,2,2,'#20374b');rect(3+lean+shift,-48,2,2,'#20374b');rect(-6+lean+shift,-42,12,5,'#31518f');rect(-2+lean+shift,-40,5,2,'#f6efd5');}
  if(bike.bell>.7&&!capturingPhoto){ctx.strokeStyle='#e6cf89';ctx.lineWidth=1;for(let i=0;i<2;i++){ctx.beginPath();ctx.arc(ax+10,ay-36,4+i*4,-1.1,.8);ctx.stroke();}}
  if(nightLevel()>.2)rect(ax-2,ay-27,4,3,'#fff0bd');ctx.restore();
 }
 function updateBikeUI(){
  $('dash-button').setAttribute('aria-label',cycling?'Велосипедный звонок':'Быстрый шаг');
  if(!cycling)return;
  $('objective').textContent='Велосипед · '+Math.round(Math.hypot(player.vx,player.vy)*.05)+' км/ч';$('dash-charge').textContent=mobileScreen()?'Стик — ехать · Отпустите, чтобы остановиться':'WASD — ехать · Пробел — тормоз';
  $('driving-hint').hidden=true;$('horn-button').hidden=false;$('horn-button').disabled=blocked()||bike.bell>0;$('horn-button').textContent=mobileScreen()?'Звонок':'H · Звонок';$('horn-button').setAttribute('aria-label','Велосипедный звонок — H');
  $('dash-button').hidden=false;$('dash-button').textContent='🔔';$('dash-button').disabled=blocked()||bike.bell>0;
  $('prompt').hidden=blocked()||!!idleEscort;$('interact-label').textContent=Math.hypot(player.x-bikeRack.x,player.y-bikeRack.y)<80?'Вернуть велосипед':'Сойти с велосипеда';$('finish-panel').hidden=true;$('scan-button').hidden=true;
 }


 // Courtesy uses short, collision-checked sidesteps; quest givers never leave an active task.
 const bikeCourtesy=new Map();
 let bikeReply=null,bikeCourtesyWait=0,unavailableKey='',unavailableWait=0;
 function resetPark62(){for(const [n,r]of bikeCourtesy)Object.assign(n,r.home,{moving:false});bikeCourtesy.clear();bikeReply=null;bikeCourtesyWait=unavailableWait=stoneCooldown=0;unavailableKey='';stoneSkips=null;}
 function courtesyEligible(n){const job=errands.findIndex(e=>e.giver===n);return !groupPhotoMember(n)&&!n.shelter&&!(job>=0&&errandStates[job]>0)&&encounterGreeting?.npc!==n;}
 function courtesyClear(n,x,y){return residentClear(x,y)&&Math.hypot(x-player.x,y-player.y)>29&&cycleNeighbours().every(p=>p===n||Math.hypot(x-p.x,y-p.y)>29);}
 function courtesySegment(n,a,b){const d=Math.hypot(b.x-a.x,b.y-a.y);for(let i=1;i<=Math.ceil(d/4);i++){const u=Math.min(1,i*4/d);if(!courtesyClear(n,a.x+(b.x-a.x)*u,a.y+(b.y-a.y)*u))return false;}return true;}
 function reactToBikeBell(){
  if(bikeCourtesyWait>0)return;bikeCourtesyWait=8;
  const c=Math.cos(bike.angle),s=Math.sin(bike.angle),near=[...supporters,...wanderers.filter(n=>n.kind==='runner')].filter(n=>{const dx=n.x-bike.x,dy=n.y-bike.y;return dx*c+dy*s>-15&&dx*c+dy*s<145&&Math.abs(dx*s-dy*c)<58;}).sort((a,b)=>Math.hypot(a.x-bike.x,a.y-bike.y)-Math.hypot(b.x-bike.x,b.y-bike.y));
  let moved=0;
  for(const n of near){n.face=bike.x<n.x?-1:1;if(moved>=2||bikeCourtesy.has(n)||!courtesyEligible(n))continue;
   const home={x:n.x,y:n.y};let target=null;
   for(const side of [1,-1]){const p={x:n.x-s*side*38,y:n.y+c*side*38};if(courtesySegment(n,home,p)){target=p;break;}}
   if(!target)continue;bikeCourtesy.set(n,{home,target,time:0,returning:false});moved++;
   if(!bikeReply&&!notificationBusy()&&noticeTime<=0)bikeReply={npc:n,text:'Проезжай, спортсмен!',life:2.8};
  }
 }
 function updateBikeCourtesy(dt){
  bikeCourtesyWait=Math.max(0,bikeCourtesyWait-dt);unavailableWait=Math.max(0,unavailableWait-dt);
  if(bikeReply){bikeReply.life-=dt;if(bikeReply.life<=0)bikeReply=null;}
  for(const [n,r]of bikeCourtesy){if(groupPhotoMember(n)||n.shelter||errands.some((e,i)=>e.giver===n&&errandStates[i]>0)){n.moving=false;bikeCourtesy.delete(n);continue;}r.time+=dt;n.moving=false;if(r.time>3.5)r.returning=true;const target=r.returning?r.home:r.target;
   const d=Math.hypot(target.x-n.x,target.y-n.y);if(d<.5){if(r.returning)bikeCourtesy.delete(n);continue;}
   const travel=Math.min(d,42*dt),x=n.x+(target.x-n.x)/d*travel,y=n.y+(target.y-n.y)/d*travel;
   if(!courtesyClear(n,x,y)){if(r.time>12){bikeCourtesy.delete(n);n.path=[];}continue;}
   n.x=x;n.y=y;n.moving=true;n.stride=(n.stride||0)+travel*.2;
  }
  syncErrandGivers();
 }
 function drawBikeReply(){if(bikeReply&&!blocked()&&!capturingPhoto&&!observing&&!notificationBusy()&&noticeTime<=0)mapLabel(bikeReply.text,bikeReply.npc.x,bikeReply.npc.y-72,12,5);}

 function unavailableReason(a){
  if(['bike','bikeStation'].includes(a.kind)&&!(a.kind==='bikeStation'&&bike.rented)){
   if(errandStates[1]===2)return 'Сначала вернём книгу девушке у кафе — для велосипеда нужны обе руки.';
   if(errandStates[0]===2)return 'Сначала отнесём мячик собачке — для велосипеда нужны обе руки.';
   if(garden.stage===1)return 'Сначала вернём лейку садовнику — для велосипеда нужны обе руки.';
   if(extras.balloon===1)return 'Сначала вернём шарик хозяину — для велосипеда нужны обе руки.';
  }
  const ride=['wheel','swing','carousel','trampoline'].includes(a.kind)||a.kind==='parkRide'&&a.id!=='history'&&!(a.id==='chess'&&(rideVisits.chess||0)>=3);
  if(ride&&ridesWet())return snowing()?'Сейчас метель. Аттракцион откроется, когда снегопад закончится.':'Сейчас дождь. Аттракцион откроется, когда дорожки подсохнут.';
  if(a.kind==='kite'&&(ridesWet()||snowCover()>.15))return 'Змей ждёт сухой погоды. Вернёмся после дождя или таяния снега.';
  if(a.kind==='stoneSkip'){
   if(errandStates.includes(2)||garden.stage===1||extras.balloon===1)return 'Сначала доставим то, что несём. Камешки подождут у пруда.';
   if(ridesWet()||snowCover()>.15)return 'Камешки подождут сухой погоды. Вернёмся после дождя или таяния снега.';
   if(stoneCooldown>0)return 'Пусть круги на воде улягутся. Ещё '+Math.ceil(stoneCooldown)+' с.';
  }
  return '';
 }
 function explainUnavailable(a){const reason=unavailableReason(a);if(!reason)return false;const key=interactionKey(a)+':'+reason.replace(/\d+/g,'');if(key!==unavailableKey||unavailableWait<=0){speech=reason;speechTime=4;unavailableKey=key;unavailableWait=4;}clearInput();player.vx=player.vy=0;return true;}

 // Five skips share one small scene: no particle arrays or permanent quest requirements.
 const stoneSite={...point([37,38]),kind:'stoneSkip',name:'Камешки на пруду',action:'Пустить блинчик · 5 с'};
 const stoneHits=[{x:1196,y:1197},{x:1188,y:1171},{x:1180,y:1152},{x:1174,y:1138},{x:1170,y:1128}];
 let stoneSkips=null,stoneCooldown=0;
 function startStoneSkip(){
  if(momentsBusy()||explainUnavailable(stoneSite)||!canStand(stoneSite.x,stoneSite.y))return false;
  clearInput();Object.assign(player,{x:stoneSite.x,y:stoneSite.y,vx:0,vy:0,face:'up'});dashTime=teaTime=0;restingBench=null;
  funScene={kind:'stoneSkip',time:0};stoneSkips={origin:{x:player.x-9,y:player.y-24},hits:0};speechTime=0;return true;
 }
 function finishStoneSkip(cancelled=false){if(funScene?.kind!=='stoneSkip')return;funScene=null;stoneSkips=null;stoneCooldown=cancelled?3:8;if(!cancelled){completePinned('stoneSkip');speech='Пять отскоков! В продакшене так бы.';speechTime=4;}save();}
 function updateStoneSkip(){if(!stoneSkips)return;const count=Math.min(5,Math.max(0,Math.floor((funScene.time-.8)/.55)+1));while(stoneSkips.hits<count){window.ParkAudio?.stoneSplash?.(stoneSkips.hits);stoneSkips.hits++;}if(funScene.time>=5)finishStoneSkip();}
 function drawStoneSkip(){
  const p=stoneSite;if(!stoneSkips){for(let i=0;i<4;i++){rect(p.x-11+i*7,p.y-3+i%2*3,6,3,'#b0b4a0');rect(p.x-10+i*7,p.y-3+i%2*3,3,1,'#e2dbb8');}return;}
  const t=funScene.time;ctx.save();
  for(let i=0;i<5;i++){const age=t-(.8+i*.55);if(age<0||age>2)continue;const hit=stoneHits[i],r=reduced?10:3+age*12;ctx.globalAlpha=(1-age/2)*.65;ctx.strokeStyle='#c5e0d8';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(hit.x,hit.y,r,r*.38,0,0,Math.PI*2);ctx.stroke();if(!reduced&&age<.18)for(const sign of [-1,1])rect(hit.x+sign*age*25,hit.y-Math.sin(age/.18*Math.PI)*7,2,2,'#deebe0');}
  ctx.globalAlpha=1;
  if(t<3){const i=Math.min(4,Math.max(0,Math.floor((t-.8)/.55)+1)),from=i?stoneHits[i-1]:stoneSkips.origin,to=stoneHits[i],start=i?.8+(i-1)*.55:0,duration=i?.55:.8,u=unit((t-start)/duration),x=from.x+(to.x-from.x)*u,y=from.y+(to.y-from.y)*u-(reduced?0:Math.sin(Math.PI*u)*(i?11-i*1.5:17));rect(x-2,y-1,4,3,'#e3dfc6');}
  ctx.restore();
 }
 function drawStoneHand(){if(funScene?.kind!=='stoneSkip')return;const t=funScene.time,reach=reduced?1:unit(t/.35)*(1-unit((t-.35)/.45));line(-8,-17,-11-reach*8,-18-reach*9,'#f6b683',4);}

 function mothPose(lamp,index,k,time=elapsed){
  const phase=((time+index*2.7+k*5)%18+18)%18,perched=reduced||phase>=11;
  const fade=unit(phase/1.5)*(phase<9?1:1-unit((phase-9)/2)),a=time*(.9+k*.15)+index+k*2.8;
  return {x:lamp.x-8+k*15+(perched?0:Math.cos(a)*(13+k*4)*fade),y:lamp.y-62+(perched?0:(12+Math.sin(a*1.7)*10)*fade),perched,wing:perched?1:1+Math.round(Math.abs(Math.sin(time*11+k))*2)};
 }
 function drawLampMoths(level){
  if(ridesWet()||snowCover()>.1)return;
  for(const [i,p]of lamps.entries()){if(p.x<camX-40||p.x>camX+viewW+40||p.y<camY||p.y>camY+viewH+90)continue;
   for(let k=0;k<(comfort.lightweight?1:2);k++){const m=mothPose(p,i,k);ctx.globalAlpha=level*.75;rect(m.x-m.wing-1,m.y,m.wing,2,'#e9dab5');rect(m.x+1,m.y,m.wing,2,'#e9dab5');rect(m.x,m.y,1,3,'#a89672');}
  }
 }

 // Short bicycle feedback is keyed to an attempt, so holding a direction cannot spam it.
 let bikeCue=null,bikeCueKey='',bikeCueQuiet=0,bikeTracks=[],bikeDrops=[],bikeWet=[0,0],bikeWetTime=0,bikeTrackDistance=0;
 function resetBicycleEffects(){bikeCue=null;bikeCueKey='';bikeCueQuiet=0;bikeTracks=[];bikeDrops=[];bikeWet=[0,0];bikeWetTime=bikeTrackDistance=0;}
 function updateBicycleEffects(dt){
  if(bikeCue){bikeCue.life-=dt;if(bikeCue.life<=0)bikeCue=null;}
  bikeWetTime=Math.max(0,bikeWetTime-dt);if(!bikeWetTime)bikeWet=[0,0];
  for(const p of bikeTracks)p.life-=dt;bikeTracks=bikeTracks.filter(p=>p.life>0);
  for(const p of bikeDrops){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}bikeDrops=bikeDrops.filter(p=>p.life>0);
  const d=inputDirection();if(!cycling||!d.x&&!d.y){bikeCueQuiet+=dt;if(bikeCueQuiet>1)bikeCueKey='';}else bikeCueQuiet=0;
 }
 function showBikeObstacle(d,neighbours){
  if(bikeCueKey||!d.x&&!d.y)return;const m=Math.hypot(d.x,d.y),nx=d.x/m,ny=d.y/m;
  const person=neighbours.find(p=>{const x=p.x-player.x,y=p.y-player.y;return x*nx+y*ny>-10&&x*nx+y*ny<48&&Math.abs(x*ny-y*nx)<35;});
  let key,bounds,copy;
  if(duckCrossingBlocks(player.x+nx*8,player.y+ny*8,35,player)){key='ducks';copy='Пропустим утят';}
  else if(bmwAvailable&&bikeCarOverlap({x:player.x+nx*8,y:player.y+ny*8,angle:bike.angle})){key='bmw';bounds=interactionFocusBounds({...bmw,kind:'drive'});copy='Перед вами BMW — объедьте её';}
  else if(person){key='person:'+neighbours.indexOf(person);bounds={x:person.x-18,y:person.y-55,w:36,h:62};copy='Пропустим пешехода';}
  else{
   for(const along of [-18,0,18])for(const [cx,cy]of [[-9,-9],[9,-9],[-9,9],[9,9]]){
    const x=player.x+nx*8+Math.cos(bike.angle)*along+cx,y=player.y+ny*8+Math.sin(bike.angle)*along+cy,tx=Math.floor(x/T),ty=Math.floor(y/T);
    if(!solidTile(tx,ty))continue;key='tile:'+tx+','+ty;bounds={x:tx*T-2,y:ty*T-2,w:T+4,h:T+4};break;
   }
   if(!key)return;if(bmwAvailable&&inBMW(bounds.x+T/2,bounds.y+T/2)){key='bmw';bounds=interactionFocusBounds({...bmw,kind:'drive'});}copy='Здесь препятствие';
  }
  if(key===bikeCueKey)return;bikeCueKey=key;bikeCue={key,bounds,copy,life:1.8};
 }
 function drawBikeObstacle(){
  if(!cycling||!bikeCue||capturingPhoto||blocked()||observing)return;
  const b=bikeCue.bounds;if(b){ctx.save();ctx.globalAlpha=Math.min(1,bikeCue.life/.4)*.8;ctx.strokeStyle='#e2c786';ctx.lineWidth=2;ctx.beginPath();for(const [x,y,dx,dy]of [[b.x,b.y,1,1],[b.x+b.w,b.y,-1,1],[b.x,b.y+b.h,1,-1],[b.x+b.w,b.y+b.h,-1,-1]]){ctx.moveTo(x+dx*8,y);ctx.lineTo(x,y);ctx.lineTo(x,y+dy*8);}ctx.stroke();ctx.restore();}
  if(!notificationBusy()&&noticeTime<=0)mapLabel(bikeCue.copy,player.x,player.y-78,12,5);
 }
 function bikeWheelPoint(p,side){return {x:p.x+Math.cos(p.angle)*21*side,y:p.y+Math.sin(p.angle)*11*side};}
 function bicycleWaterAt(x,y){const tx=Math.floor(x/T),ty=Math.floor(y/T);return roadWaterAt(x,y)||puddleLevel()>.15&&puddleTile(tx,ty)&&Math.abs(x-(tx*T+16))<14&&Math.abs(y-(ty*T+22))<8;}
 function recordBicycleTrail(before){
  const distance=Math.hypot(bike.x-before.x,bike.y-before.y);if(!distance||distance>15)return;
  bikeTrackDistance+=distance;const mark=bikeTrackDistance>=6;if(mark)bikeTrackDistance%=6;
  [-1,1].forEach((side,i)=>{
   const p=bikeWheelPoint(bike,side),q=bikeWheelPoint(before,side),wet=bicycleWaterAt(p.x,p.y);
   if(wet){bikeWet[i]=140;bikeWetTime=9;}else bikeWet[i]=Math.max(0,bikeWet[i]-distance);
   if(!mark)return;
   const surface=footSurface(p.x,p.y),grass=surface==='grass'&&snowCover()<.05;
   if(!wet&&(bikeWet[i]>0||grass))bikeTracks.push({x:p.x,y:p.y,px:q.x-Math.cos(bike.angle)*5,py:q.y-Math.sin(bike.angle)*5,kind:grass?'grass':'wet',life:grass?5:10,alpha:grass?.2:.12+.22*bikeWet[i]/140});
   if(wet&&!reduced){const cross=i?1:-1;bikeDrops.push({x:p.x,y:p.y,life:.45,vx:-Math.sin(bike.angle)*cross*24,vy:Math.cos(bike.angle)*cross*18-12});}
  });
  bikeTracks=bikeTracks.slice(-(comfort.lightweight?70:180));bikeDrops=bikeDrops.slice(-(comfort.lightweight?6:16));
 }
 function drawBicycleTracks(){ctx.save();ctx.lineCap='round';ctx.lineWidth=2;for(const p of bikeTracks){if(p.x<camX-10||p.x>camX+viewW+10||p.y<camY-10||p.y>camY+viewH+10)continue;ctx.globalAlpha=p.alpha*Math.min(1,p.life/(p.kind==='grass'?4:7));line(p.px,p.py,p.x,p.y,p.kind==='grass'?'#496d49':'#496b70',2);}ctx.restore();}
 function drawBicycleDrops(){if(reduced)return;ctx.save();for(const p of bikeDrops){ctx.globalAlpha=p.life/.45*.65;rect(p.x,p.y-4*Math.sin(p.life/.45*Math.PI),2,2,'#c2dad8');}ctx.restore();}

 const janitorHome={...point([27,60]),kind:'janitor',name:'Дворник',action:'Поговорить с дворником'};
 const janitorLeaves=[[27,58],[26,61],[28,62]].map((p,id)=>({...point(p),kind:'sweepLeaf',name:'Кленовый лист',action:'Подобрать лист',id}));
 let janitor={...janitorHome,time:0,remark:0},janitorHelp={stage:0,leaves:[]};
 function restoreJanitor(v={}){
  const saved=v.janitorHelp;janitorHelp={stage:[0,1,2,3].includes(saved?.stage)?saved.stage:0,leaves:Array.isArray(saved?.leaves)?[...new Set(saved.leaves.filter(i=>Number.isInteger(i)&&i>=0&&i<3))]:[]};
  if(janitorHelp.stage===0)janitorHelp.leaves=[];
  if(janitorHelp.stage===3)janitorHelp.leaves=[0,1,2];
  else if(janitorHelp.stage>0)janitorHelp.stage=janitorHelp.leaves.length===3?2:1;
  janitor={...janitorHome,time:0,remark:0};duckCrossing=null;duckNextAt=100;
 }
 function janitorGoal(){return janitorHelp.stage===1?[...janitorLeaves].filter(p=>!janitorHelp.leaves.includes(p.id)).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0]||janitor:janitor;}
 function useJanitor(a){
  if(a.kind==='sweepLeaf'){
   if(janitorHelp.stage!==1||janitorHelp.leaves.includes(a.id))return;
   janitorHelp.leaves.push(a.id);if(janitorHelp.leaves.length===3)janitorHelp.stage=2;
   speech=janitorHelp.stage===2?'Три листа собраны. Вернёмся к дворнику!':'Лист '+janitorHelp.leaves.length+' из 3 — в кармане.';speechTime=3;navCache=null;save();return;
  }
  if(janitorHelp.stage===0){janitorHelp.stage=1;pinnedActivity='janitor';trackedPlace=janitorPlace;trackedErrand=-1;navCache=null;speech='Дворник: «Ветер устроил откат изменений! Соберёшь три больших листа рядом?»';}
  else if(janitorHelp.stage===1)speech='Дворник: «Ещё '+(3-janitorHelp.leaves.length)+' листа. Золотая стрелка поможет!»';
  else if(janitorHelp.stage===2){janitorHelp.stage=3;completePinned('janitor');if(trackedPlace===janitorPlace)trackedPlace=-1;speech='Дворник: «Спасибо! Чистота закоммичена. Ветер без права записи!»';burst(janitor.x,janitor.y-28,'#dbc58a');window.ParkAudio?.reward();}
  else speech='Дворник: «О, мой напарник! Сегодня у ветра выходной.»';
  speechTime=5;janitor.remark=0;save();
 }
 function updateJanitor(dt){
  janitor.remark=Math.max(0,janitor.remark-dt);if(janitorHelp.stage===1||janitorHelp.stage===2||ridesWet()||snowCover()>.15||Math.hypot(player.x-janitorHome.x,player.y-janitorHome.y)>380)return;
  const before=janitor.time%22;janitor.time+=dt;const phase=janitor.time%22;
  if(janitorHelp.stage===0&&before<8&&phase>=8)janitor.remark=3;
  const y=janitorHome.y+Math.sin(janitor.time*.5)*15;
  if(canStand(janitorHome.x,y)&&Math.hypot(player.x-janitorHome.x,player.y-y)>28){janitor.x=janitorHome.x;janitor.y=y;}
 }
 function drawJanitorGround(){
  if(janitorHelp.stage===1){for(const p of janitorLeaves)if(!janitorHelp.leaves.includes(p.id)){rect(p.x-10,p.y-3,20,7,'#786c4040');for(const [dx,dy,w,h]of [[-7,-8,14,10],[-11,-5,22,4],[-3,-13,6,16]])rect(p.x+dx,p.y+dy,w,h,'#c6a36b');line(p.x,p.y-11,p.x,p.y+3,'#806b45',1);rect(p.x-1,p.y-23,3,7,'#f2dfac');rect(p.x-1,p.y-14,3,3,'#f2dfac');}return;}
  if(janitorHelp.stage>0||snowCover()>.15)return;
  const phase=janitor.time%22,scatter=phase<8?0:phase<10?(phase-8)/2:phase<15?1:Math.max(0,1-(phase-15)/7);
  for(let i=0;i<9;i++){const a=i*2.4,r=(8+i*3)*scatter,x=janitorHome.x+24+Math.cos(a)*r,y=janitorHome.y+4+Math.sin(a)*r*.5;rect(x,y-(reduced?0:Math.sin(scatter*Math.PI)*10),6,3,['#c7a773','#b88c58','#d6bc82'][i%3]);}
 }
 function drawJanitor(){
  const x=janitor.x,y=janitor.y,working=janitorHelp.stage===0&&!ridesWet(),sweep=reduced?0:working?Math.sin(janitor.time*5)*7:0;
  ctx.save();ctx.translate(x,y);rect(-13,0,27,5,'#365c3b55');rect(-8,-9,6,12,'#49565c');rect(3,-9,6,12,'#49565c');rect(-10,1,9,4,'#5c5549');rect(3,1,9,4,'#5c5549');rect(-11,-29,23,21,'#779795');rect(-8,-27,6,20,'#d4bd75');rect(5,-27,5,20,'#d4bd75');rect(-10,-17,21,3,'#ddd7b6');rect(-9,-43,18,16,'#e4b696');rect(-10,-46,20,6,'#6b7265');rect(-11,-44,26,3,'#79958b');rect(-5,-37,2,2,'#3d4b43');rect(3,-37,2,2,'#3d4b43');rect(-5,-31,11,3,'#ddd3bc');line(13,-29,23+sweep,0,'#aa8960',3);rect(18+sweep,-2,14,6,'#c9b484');for(let i=0;i<4;i++)line(19+sweep+i*3,1,18+sweep+i*4,7,'#a99669',1);line(9,-24,17,-16,'#e4b696',4);ctx.restore();
  if(janitor.remark>0&&!notificationBusy())mapLabel('Откат изменений…',x,y-67,12,5);
 }

 const duckCrossingSite={x:70*T,y:70.4*T};
 let duckCrossing=null,duckNextAt=100;
 function duckCrossingBlocks(x,y,margin,from){
  if(!duckCrossing)return false;const p=duckCrossingSite;
  return x>p.x-117&&x<p.x+117&&Math.abs(y-p.y)<margin&&Math.abs(y-p.y)<=Math.abs(from.y-p.y)+.001;
 }
 function crossingDuckPose(i){
  if(!duckCrossing)return null;const t=duckCrossing.time,delay=i*.55+(i===3?.6:0),u=unit((t-delay-(i===3?Math.min(1,Math.max(0,t-3.1)):0))/(i===3?4.8:6.4));
  return {x:duckCrossingSite.x-98+196*u,y:duckCrossingSite.y+Math.sin(u*Math.PI*2)*3,face:1,alpha:Math.min(1,unit((t-delay)/.4),unit((9.2-t)/.5))};
 }
 function updateDuckCrossing(dt){
  if(duckCrossing){duckCrossing.time+=dt;if(duckCrossing.time>=9.2){duckCrossing=null;duckNextAt=elapsed+150;}return;}
  if(elapsed<duckNextAt||ridesWet()||snowCover()>.1||trafficStop||towScene||idleEscort||funScene||Math.hypot(player.x-duckCrossingSite.x,player.y-duckCrossingSite.y)>340)return;
  if(Math.abs(player.y-duckCrossingSite.y)<(driving?95:55)||Math.abs(bmw.y-duckCrossingSite.y)<85&&Math.abs(bmw.x-duckCrossingSite.x)<180)return;
  for(let x=duckCrossingSite.x-98;x<=duckCrossingSite.x+98;x+=14)if(!canStand(x,duckCrossingSite.y))return;
  duckCrossing={time:0};if(!notificationBusy()){speech='Главные участники движения.';speechTime=3;}
 }
 function drawCrossingDuck(i){const n=crossingDuckPose(i);if(!n||n.alpha<=0)return;ctx.save();ctx.translate(n.x,n.y);ctx.globalAlpha=n.alpha;const step=reduced?0:Math.sin(duckCrossing.time*(i===3?16:11)+i)*2;
  rect(-8,0,17,3,'#3a51464a');rect(-4,0+step,3,3,'#c89c5d');rect(3,0-step,3,3,'#c89c5d');
  if(i===0){rect(-10,-10,19,10,'#bfa888');rect(-6,-12,11,9,'#d5c4a4');rect(4,-19,8,12,'#537260');rect(11,-15,6,3,'#d7ad6a');rect(8,-17,2,2,'#263e36');rect(5,-8,7,2,'#f0dfb7');}
  else{rect(-6,-7,12,7,'#dcc581');rect(2,-12,6,8,'#eedca0');rect(8,-9,4,2,'#c99a55');rect(6,-11,1,1,'#354840');}ctx.restore();}

 // Ambient gestures never take control of the hero or interrupt an interaction.
 let heroReaction=null,heroGestureCooldown=12,heroLeafCooldown=0,heroLeafContact=0,heroLeafProbe=0,heroNearLeaves=false,heroUmbrellaUsed=false;
 function restoreHeroGestures(){heroReaction=null;heroGestureCooldown=12;heroLeafCooldown=heroLeafContact=heroLeafProbe=0;heroNearLeaves=heroUmbrellaUsed=false;}
 function heroGestureBusy(){return !!umbrellaShake||!!pickupGesture||bearNut.phase==='carry'||ambientSceneBusy()||momentsBusy()||!!restingBench||petTime>0||sprayHand>0||garden.stage===1||errandStates.includes(2)||extras.balloon===1;}
 function beginHeroGesture(kind){
  heroReaction={kind,time:0};heroGestureCooldown=38;
  if(kind==='leaf'){heroLeafCooldown=90;heroLeafContact=0;}
  if(kind==='umbrella')heroUmbrellaUsed=true;
  if(kind!=='hood'&&!notificationBusy()){speech=kind==='leaf'?'Осень выдала новый аксессуар.':'Зонт решил стать антенной!';speechTime=3;}
 }
 function updateHeroGestures(dt){
  heroGestureCooldown=Math.max(0,heroGestureCooldown-dt);heroLeafCooldown=Math.max(0,heroLeafCooldown-dt);
  const open=umbrellaOpening(),autumn=seasonState().id==='autumn';if(!autumn)heroNearLeaves=false;if(open===0)heroUmbrellaUsed=false;
  if(heroGestureBusy()){heroReaction=null;heroLeafContact=0;return;}
  if(heroReaction){
   const r=heroReaction;r.time+=dt;
   if(r.time>=(r.kind==='leaf'?4.8:r.kind==='umbrella'?2.8:1.6)||(r.kind==='leaf'&&(!autumn||ridesWet()))||(r.kind==='umbrella'&&open<.3))heroReaction=null;
   return;
  }
  // One short umbrella mishap per shower, after the rain announcement has finished.
  if(!heroUmbrellaUsed&&open>.95&&weatherTime()>34&&weatherTime()<38&&windGust()>2&&!notificationBusy()){beginHeroGesture('umbrella');return;}
  if(heroGestureCooldown>0||notificationBusy())return;
  const walking=Math.hypot(player.vx,player.vy)>25;
  if(autumn&&!ridesWet()&&walking&&!heroLeafCooldown){
   heroLeafProbe-=dt;if(heroLeafProbe<=0){heroLeafProbe=.35;heroNearLeaves=trees.some(p=>Math.hypot(player.x-(p.tx*T+16),player.y-(p.ty*T+16))<105)||leafPileSites.some(p=>Math.hypot(player.x-p.x,player.y-p.y)<65);}
   heroLeafContact=heroNearLeaves?heroLeafContact+dt:0;
   if(heroLeafContact>=1.6){beginHeroGesture('leaf');return;}
  }else heroLeafContact=0;
  if(walking&&!ridesWet()&&open===0&&windGust()>1.65&&!heroNearLeaves)beginHeroGesture('hood');
 }
 function heroUmbrellaFlex(){if(reduced||heroReaction?.kind!=='umbrella')return 0;const t=heroReaction.time;return unit(t/.3)*unit((2.4-t)/.55);}
 function drawHeroGestures(){
  const r=heroReaction;if(!r||photoPose()!=='natural')return;const t=r.time,side=player.face==='left'?-1:1;
  if(r.kind==='leaf'){
   let x=-1,y=-40,alpha=1;
   if(!reduced&&t<1){const u=unit(t);x-=26*(1-u);y-=23*(1-u)+Math.sin(u*Math.PI)*5;}
   if(t>3.6){const u=unit((t-3.6)/1.2);if(!reduced){x+=side*u*30;y+=u*u*27;}alpha=1-u;}
   ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);if(!reduced)ctx.rotate(t<1?Math.sin(t*5)*.45:t>3.6?(t-3.6)*side*2:.15);
   rect(-5,-2,9,4,'#bf8847');rect(-3,-4,5,8,'#d3aa62');rect(-1,-5,2,10,'#e3bd7b');line(0,1,4,5,'#896640',1);ctx.restore();
  }
  if(r.kind==='umbrella'){rect(-12,-22,5,8,'#f04b4b');line(-10,-17,7,-18,'#f6b683',4);rect(6,-21,5,5,'#f6b683');}
  const brush=r.kind==='leaf'&&t>3&&t<4,hood=r.kind==='hood';
  if(brush||hood){const reach=reduced?1:hood?Math.sin(unit(t/1.6)*Math.PI):Math.sin(unit((t-3))*Math.PI);
   ctx.save();ctx.scale(side,1);rect(8,-23,5,9,'#f04b4b');line(11,-18,12,-18-13*reach,'#f6b683',4);rect(4,-22-13*reach,10,4,'#f6b683');ctx.restore();}
 }

 // Short ambient details use game time and never take control of movement.
 let pickupGesture=null,umbrellaShake=null,umbrellaArmed=false;
 let puddleRipples=[],rippleDistance=0,rippleWait=0;
 const puddleSceneryCache=new Map();
 function resetParkDetails(){pickupGesture=umbrellaShake=null;umbrellaArmed=false;puddleRipples=[];rippleDistance=rippleWait=0;}
 function holdsFind(kind){return kind==='nut'?bearNut.phase==='carry':errandStates[kind==='ball'?0:1]===2;}
 function celebrateFind(kind){if(holdsFind(kind))pickupGesture={kind,time:0};}
 function detailHandsBusy(){return momentsBusy()||!!restingBench||garden.stage===1||teaTime>0||petTime>0||sprayHand>0;}
 function updateParkDetails(dt){
  if(pickupGesture){pickupGesture.time+=dt;if(pickupGesture.time>=1.15||!holdsFind(pickupGesture.kind)||detailHandsBusy())pickupGesture=null;}
  const open=umbrellaOpening();if(open>.9)umbrellaArmed=true;
  if(umbrellaArmed&&open===0){
   umbrellaArmed=false;
   if(weatherTime()>=40.5&&weatherTime()<43&&!detailHandsBusy()&&!errandStates.includes(2)&&bearNut.phase!=='carry'&&extras.balloon!==1){
    const cats=[...pets,...wanderers].filter(n=>n.kind==='cat'&&!n.sheltered&&!n.shelter&&!n.visit&&!n.bubblePaw&&Math.hypot(n.x-player.x,n.y-player.y)<115).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));
    const cat=cats[0]||null,side=cat&&cat.x<player.x?-1:1;
    umbrellaShake={time:0,cat,side,hopSide:cat&&lifeClear(cat.x+side*10,cat.y)?side:0,sounded:false};heroReaction=null;
   }
  }
  if(umbrellaShake){
   const r=umbrellaShake;r.time+=dt;
   if(detailHandsBusy()||rainIntensity()>0||errandStates.includes(2)||bearNut.phase==='carry'||Math.hypot(player.vx,player.vy)>210){umbrellaShake=null;return;}
   if(r.cat&&!r.sounded&&r.time>=.35){r.sounded=true;window.ParkAudio?.catMeow?.(.5);}
   if(r.time>=1.8)umbrellaShake=null;
  }
 }
 function umbrellaCatPose(cat){
  const r=umbrellaShake;if(!r||r.cat!==cat||r.time<.3||r.time>1.5)return {x:0,y:0};
  const hop=reduced?0:Math.sin(unit((r.time-.3)/1.2)*Math.PI);return {x:r.hopSide*10*hop,y:-12*hop};
 }
 function drawClosedUmbrella(){
  const r=umbrellaShake;if(!r||photoPose()!=='natural')return;
  const swing=reduced?0:Math.sin(r.time*18)*unit(1-r.time/1.8)*.18;
  ctx.save();ctx.translate(player.x+13,player.y-25);ctx.rotate(.28+swing);
  line(0,2,0,-26,'#b69b70',2);rect(-4,-25,8,23,'#c49d52');rect(-2,-26,3,22,'#e8cd83');line(0,2,0,7,'#b69b70',2);line(0,7,-4,7,'#b69b70',2);rect(-4,-2,7,5,'#f6b683');
  if(!reduced)for(let i=0;i<(comfort.lightweight?3:6);i++){const u=(r.time*1.6+i*.13)%1;if(r.time>1.2)continue;ctx.globalAlpha=(1-u)*.7;rect((i%2?1:-1)*(5+u*19),-14+u*u*23,2,2,'#b7d7d5');}
  ctx.restore();
  if(r.cat&&r.time>.35&&r.time<1.65&&!notificationBusy()&&!capturingPhoto&&!reflectingHero)mapLabel('Мяу! Я уже высохла!',r.cat.x,r.cat.y-45,11,1);
 }
 function puddleScenery(p){
  const key=p.x+':'+p.y;if(puddleSceneryCache.has(key))return puddleSceneryCache.get(key);
  const near=trees.filter(t=>Math.abs(t.tx*T+16-p.x)<90&&p.y-(t.ty*T+32)>0&&p.y-(t.ty*T+32)<110).sort((a,b)=>Math.hypot(a.tx*T+16-p.x,a.ty*T+32-p.y)-Math.hypot(b.tx*T+16-p.x,b.ty*T+32-p.y)).slice(0,2);
  puddleSceneryCache.set(key,near);return near;
 }
 function rippleStrength(p){return reduced?0:puddleRipples.reduce((v,r)=>Math.hypot(r.x-p.x,r.y-p.y)<p.rx+15?Math.max(v,1-r.age/1.3):v,0);}
 function recordPuddleRipple(distance){
  if(!footInPuddle()){rippleDistance=0;return;}rippleDistance+=distance;
  if(reduced||rippleWait>0||rippleDistance<16)return;
  rippleDistance=0;rippleWait=.2;puddleRipples.push({x:player.x,y:player.y,age:0});puddleRipples=puddleRipples.slice(-(comfort.lightweight?4:10));
 }
 function drawPuddleScenery(p){
  if(p.rx<20)return;const energy=rippleStrength(p),strips=!comfort.lightweight&&!reduced&&energy>0?3:1;
  for(let i=0;i<strips;i++){ctx.save();ctx.beginPath();ctx.ellipse(p.x,p.y,p.rx,p.ry,0,0,Math.PI*2);ctx.clip();
   if(strips>1){ctx.beginPath();ctx.rect(p.x-p.rx,p.y-p.ry+i*2*p.ry/strips,2*p.rx,2*p.ry/strips);ctx.clip();}
   ctx.globalAlpha=puddleLevel()*.3;const wave=energy*Math.sin(elapsed*12+i*2)*2;
   for(const t of puddleScenery(p)){const colors=seasonPalette().trees[(t.tx*37+t.ty*61)%3],x=p.x+(t.tx*T+16-p.x)*.34+wave,y=p.y-10;
    rect(x-2,y,4,19,'#655e49');rect(x-13,y+12,26,10,colors[0]);rect(x-10,y+16,20,10,colors[1]);rect(x-5,y+23,11,7,colors[2]);}
   ctx.restore();
  }
 }
 function drawPuddleRipples(){
  if(reduced||!puddleLevel())return;ctx.save();
  for(const r of puddleRipples){const u=unit(r.age/1.3),tx=Math.floor(r.x/T),ty=Math.floor(r.y/T),p=puddleShape(tx,ty);ctx.save();ctx.beginPath();ctx.ellipse(p.x,p.y,p.rx,p.ry,0,0,Math.PI*2);ctx.clip();ctx.strokeStyle='#d3e6dd';ctx.lineWidth=1;ctx.globalAlpha=(1-u)*puddleLevel()*.65;ctx.beginPath();ctx.ellipse(r.x,r.y,4+u*28,2+u*11,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
  ctx.restore();
 }

 function rideCaptionVisible(p,active=false){
  if(observing||capturingPhoto)return false;if(active)return true;if(notificationBusy())return false;
  let nearestRide=null,best=180;for(const ride of parkRides){const d=Math.hypot(player.x-ride.x,player.y-ride.y);if(d<best){best=d;nearestRide=ride;}}
  return nearestRide===p;
 }
 function rideSilhouette(p){return {x:p.x-(p.id==='chess'||p.id==='history'?58:76),y:p.y-(p.id==='chess'?116:148),w:p.id==='chess'||p.id==='history'?116:152,h:p.id==='chess'?116:p.id==='history'?128:132};}

 // Small, optional park routines: automatic irrigation and a shared souvenir photo.
 const lawnSprinklers=[[30,59],[81,31]].map((p,i)=>({...point(p),id:i}));
 const groupPhotoSite={x:photoSpot.x+123,y:photoSpot.y-10,kind:'groupPhoto',name:'Общая фотография',action:'Позвать друзей в кадр'};
 let sprayHand=0,sprayRemark=0,groupPhoto=null,cafeClerk=null;
 function restoreParkRoutines(){resetParkDetails();restoreHeroGestures();sprayHand=sprayRemark=0;groupPhoto=null;cafeClerk=null;}
 function lawnWaterLevel(p,time=elapsed){
  const phase=(time-90-p.id*23)%180;
  if(time<90+p.id*23||phase<0||phase>=16||ridesWet()||snowCover()>.05||nightLevel()>.15||!['summer','spring'].includes(seasonState().id))return 0;
  return Math.min(1,phase,16-phase);
 }
 function updateLawnWater(dt){
  sprayRemark=Math.max(0,sprayRemark-dt);sprayHand=Math.max(0,sprayHand-dt);
  if(driving||funScene||restingBench)return;
  if(lawnSprinklers.some(p=>lawnWaterLevel(p)>.3&&Math.hypot(player.x-p.x,player.y-p.y)<49)){
   sprayHand=.25;if(!sprayRemark&&!notificationBusy()){sprayRemark=25;speech='Газону — полив. Мне — освежающий душ!';speechTime=3;}
  }
 }
 function rerouteSprinklerCat(n){
  if(n.kind!=='cat'||!n.path.length)return;
  const p=lawnSprinklers.find(p=>lawnWaterLevel(p)>.1&&Math.hypot(n.x-p.x,n.y-p.y)<170&&n.path.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<62));
  if(!p)return;const key=p.id+':'+Math.floor((elapsed-90-p.id*23)/180);if(n.sprinklerRoute===key)return;
  n.sprinklerRoute=key;let target=n.path[n.path.length-1];
  if(Math.hypot(target.x-p.x,target.y-p.y)<65)target=n.route[n.goal]?point(n.route[n.goal]):target;
  const route=lifePath(n,[Math.floor(target.x/T),Math.floor(target.y/T)],{...p,radius:62});
  if(route.length)n.path=route;
 }
 function drawLawnWater(){for(const p of lawnSprinklers){const level=lawnWaterLevel(p);rect(p.x-7,p.y-3,14,7,'#617b66');rect(p.x-4,p.y-6,8,5,'#b1ba9c');if(!level)continue;
  ctx.save();ctx.globalAlpha=.65*level;const spin=reduced?.6:elapsed*1.2+p.id,streams=comfort.lightweight?2:3,drops=comfort.lightweight?8:15;
  for(let s=0;s<streams;s++){const a=spin+s*Math.PI*2/streams;for(let i=0;i<drops;i++){const u=reduced?(i+.5)/drops:((i/drops+elapsed*.65)%1),r=58*u,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r*.55-30*Math.sin(u*Math.PI);rect(x,y-6,2,3,'#d2e6dc');}ctx.strokeStyle='#b8d7cd';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(p.x+Math.cos(a)*58,p.y+Math.sin(a)*32,6,2,0,0,Math.PI*2);ctx.stroke();}
  ctx.globalAlpha=.3*level;for(let i=0;i<4;i++){ctx.strokeStyle=['#dba7a0','#ddcb95','#a9c9a3','#aebed6'][i];ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y-10,34-i*2,Math.PI*1.12,Math.PI*1.88);ctx.stroke();}ctx.restore();
 }}
 function drawSprayHands(){if(!sprayHand||capturingPhoto)return;rect(8,-24,7,7,'#f04b4b');rect(10,-31,5,11,'#f6b683');rect(2,-32,13,5,'#f6b683');}
 function updateCourierAftercare(dt){
  if(courier.stage!==2)return;
  if(!courier.phase)courier.phase='pickup';
  if(courier.phase==='pickup'){
   if(ridesWet())return;
   if(!cafeClerk)cafeClerk={...courierCafe,id:2,path:[],repath:0,moving:false,carrying:false};
   if(Math.hypot(cafeClerk.x-courier.x,cafeClerk.y-courier.y)>28){storyStep(cafeClerk,courier,65,dt,false);return;}
   courier.pickupTime=(courier.pickupTime||0)+dt;
   if(courier.pickupTime>=1.5){cafeClerk.carrying=true;courier.phase='return';courier.path=[];courier.repath=0;if(Math.hypot(player.x-courier.x,player.y-courier.y)<200){speech='Кафе: «Посылка приехала! Спасибо вам обоим». Курьер: «Теперь мне бы розетку…»';speechTime=5;}save();}
  }else if(courier.phase==='return'){
   if(storyStep(courier,courierHome,82,dt)){courier.phase='charge';courier.path=[];save();}
  }
  if(cafeClerk?.carrying){if(Math.hypot(cafeClerk.x-courierCafe.x,cafeClerk.y-courierCafe.y)<12)cafeClerk=null;else storyStep(cafeClerk,courierCafe,65,dt,false);}
 }
 function drawCourierStation(){const p=courierHome;rect(p.x-20,p.y-6,40,18,'#556f64');rect(p.x-17,p.y-3,34,12,'#a5b5a0');rect(p.x-12,p.y+1,24,4,'#627c6d');const on=courier.phase==='charge';rect(p.x+16,p.y-28,10,28,'#526c64');rect(p.x+18,p.y-25,6,8,on?'#b8d49e':'#8c9f91');if(on){const pulse=reduced?1:.65+Math.sin(elapsed*2)*.25;ctx.save();ctx.globalAlpha=pulse;rect(p.x-9,p.y-30,18,3,'#bdd49d');ctx.restore();}}
 function drawCafeClerk(){if(!cafeClerk)return;drawCinemaGuest({...cafeClerk,walking:cafeClerk.moving});rect(cafeClerk.x-7,cafeClerk.y-26,14,19,'#e2ddc7');if(cafeClerk.carrying){rect(cafeClerk.x-10,cafeClerk.y-21,20,13,'#ba986c');rect(cafeClerk.x-1,cafeClerk.y-21,3,13,'#e3c68e');}}
 function groupPhotoMember(n){return !!groupPhoto&&groupPhoto.cast.some(g=>g.original===n);}
 function startGroupPhoto(){
  if(momentsBusy())return false;
  if(ridesWet()){speech='Соберёмся для снимка, когда закончится непогода.';speechTime=4;return false;}
  const specs=[{original:supporters[0],kind:'person',dx:-48,dy:4},{original:supporters[4],kind:'person',dx:48,dy:4},{original:errands[0].receiver,kind:'dog',dx:-24,dy:42},{original:goose,kind:'goose',dx:-76,dy:15}];
  const cast=specs.map((s,i)=>{const goal={x:photoSpot.x+s.dx,y:photoSpot.y+s.dy};const spawn=[[i%2?40:-40,64],[i%2?-40:40,64],[0,64],[64,0],[-64,0]].map(([dx,dy])=>({x:goal.x+dx,y:goal.y+dy})).find(p=>lifeClear(p.x,p.y)&&lifePath(p,[Math.floor(goal.x/T),Math.floor(goal.y/T)]).length)||goal;return {...s,...spawn,spawn,goal,path:[],repath:0,moving:false,stride:0,face:1};});
  if(!canStand(photoSpot.x,photoSpot.y)||cast.some(g=>!lifeClear(g.goal.x,g.goal.y)||!lifeClear(g.x,g.y)||!lifePath(g,[Math.floor(g.goal.x/T),Math.floor(g.goal.y/T)]).length)){announce('Для общего снимка нужно свободное место. Попробуйте чуть позже.');return false;}
  groupPhoto={cast,phase:'gather',countdown:0};funScene={kind:'groupPhoto',time:0};Object.assign(player,{x:photoSpot.x,y:photoSpot.y,face:'down',vx:0,vy:0});clearInput();dashTime=0;speechTime=0;notePlayActivity();return true;
 }
 function stopGroupPhoto(){groupPhoto=null;if(funScene?.kind==='groupPhoto')funScene=null;clearInput();armInputGuard();}
 function updateGroupPhoto(dt){
  if(!groupPhoto)return;
  if(ridesWet()){stopGroupPhoto();speech='Дождь разогнал нашу компанию. Снимемся, когда прояснится!';speechTime=4;return;}
  const g=groupPhoto;
  for(const n of g.cast){if(n.kind==='goose'&&(g.phase==='gather'||g.countdown<1.25))continue;if(Math.hypot(n.x-n.goal.x,n.y-n.goal.y)>3)storyStep(n,n.goal,110,dt,false);else n.moving=false;}
  if(g.phase==='gather'){
   if(g.cast.filter(n=>n.kind!=='goose').every(n=>Math.hypot(n.x-n.goal.x,n.y-n.goal.y)<3))g.phase='countdown';
   else if(funScene.time>10){stopGroupPhoto();announce('Не все успели подойти. Можно позвать компанию ещё раз.');}return;
  }
  g.countdown+=dt;
  if(g.countdown<3.2)return;
  if(g.cast.some(n=>Math.hypot(n.x-n.goal.x,n.y-n.goal.y)>3)){if(g.countdown>6)stopGroupPhoto();return;}
  g.phase='pose';funScene=null;inputQuietUntil=0;
  if(openPhotoMode()){photoMode.x=photoSpot.x;photoMode.y=photoSpot.y-24;photoMode.frame='postcard';photoMode.pose='wave';$('photo-border').value='postcard';$('photo-pose').value='wave';photoMode.dirty=true;renderPhotoMode();capturePhotoMode();}
  else stopGroupPhoto();
 }
 function drawGroupGuest(n){
  if(n.kind==='goose'){if(groupPhoto.phase==='gather'||groupPhoto.countdown<1.25)return;ctx.save();ctx.translate(n.x-goose.x,n.y-goose.y);drawGoose();ctx.restore();}
  else if(n.kind==='dog')drawPet({...n.original,x:n.x,y:n.y});
  else drawSupporter({...n.original,x:n.x,y:n.y,moving:n.moving,stride:n.stride});
 }
 function drawGroupPhotoDecor(){const p=groupPhotoSite;line(p.x,p.y-20,p.x-12,p.y+6,'#596b68',2);line(p.x,p.y-20,p.x+12,p.y+6,'#596b68',2);rect(p.x-12,p.y-33,24,15,'#405b57');rect(p.x-4,p.y-31,9,10,'#a3bdb3');rect(p.x-1,p.y-28,4,4,'#3f5959');
  if(groupPhoto&&!capturingPhoto){const label=groupPhoto.phase==='gather'?'Собираемся в кадр…':groupPhoto.countdown<3?String(3-Math.floor(groupPhoto.countdown)):'Все на месте!';mapLabel(label,photoSpot.x,photoSpot.y-90,groupPhoto.phase==='gather'?12:24,2);}
 }

 const photographerSite={...point([61,48]),kind:'photographer',name:'Фотограф и гусь'},gooseLure=point([60,51]);
 let photographer={stage:0,hold:0,cheer:0,quip:0};
 function restorePhotographer(v={}){
  photographer={stage:[0,1,2].includes(v.photographer)?v.photographer:0,hold:0,cheer:0,quip:0};
  if(goose.state==='photobomb')Object.assign(goose,{...gooseHome,state:'idle',time:0,cooldown:3,trail:[],chased:false});
 }
 function photographerCamera(){const shift=reduced||photographer.stage!==0||ridesWet()?0:Math.sin(elapsed*.8)*9;return {x:photographerSite.x+25,y:photographerSite.y+shift};}
 function releasePhotoGoose(){if(goose.state==='photobomb'){goose.state='return';goose.chased=false;}photographer.hold=0;}
 function usePhotographer(){
  clearInput();player.vx=player.vy=0;dashTime=0;
  if(photographer.stage===2){speech='Фотограф: «Кадр спасён! Гусь уже просит исходники».';speechTime=4;return;}
  if(ridesWet()){speech='Фотограф: «Спрячу камеру от непогоды. Приходи, когда прояснится!»';speechTime=4;return;}
  photographer.stage=1;photographer.quip=8;
  if(sprinkleTime<=0&&['idle','chase','return'].includes(goose.state)){if(!goose.trail.length)goose.trail=[{x:goose.x,y:goose.y}];goose.state='photobomb';goose.cooldown=0;goose.chased=false;}
  speech='Фотограф: «Отведи гуся к золотой отметке слева внизу и побудь там 3 секунды. Он пойдёт за тобой!»';speechTime=7;
  save();
 }
 function updatePhotographer(dt){
  photographer.cheer=Math.max(0,photographer.cheer-dt);photographer.quip=Math.max(0,photographer.quip-dt);
  const near=Math.hypot(player.x-photographerSite.x,player.y-photographerSite.y)<270;
  if(!near||photographer.stage===2||ridesWet()||driving||funScene||idleEscort||feedScene||sprinkleTime>0){releasePhotoGoose();return;}
  if(goose.state==='idle'&&goose.cooldown<=0&&(photographer.stage===1||Math.hypot(player.x-goose.x,player.y-goose.y)>112)){
   goose.state='photobomb';goose.trail=[{x:goose.x,y:goose.y}];goose.chased=false;
  }
  if(goose.state!=='photobomb'){photographer.hold=0;return;}
  if(photographer.stage===0&&Math.hypot(player.x-goose.x,player.y-goose.y)<100){goose.state='chase';goose.chased=true;goose.time=4;photographer.hold=0;return;}
  const camera=photographerCamera(),target=photographer.stage===1?player:{x:camera.x+58,y:camera.y-4};
  const dx=target.x-goose.x,dy=target.y-goose.y,d=Math.hypot(dx,dy),step=Math.min(Math.max(0,d-(photographer.stage===1?25:2)),95*dt);
  if(step>0){if(canStand(goose.x+dx/d*step,goose.y))goose.x+=dx/d*step;if(canStand(goose.x,goose.y+dy/d*step))goose.y+=dy/d*step;
   const tail=goose.trail[goose.trail.length-1];if(!tail||Math.hypot(goose.x-tail.x,goose.y-tail.y)>8)goose.trail.push({x:goose.x,y:goose.y});
   if(goose.trail.length>300){releasePhotoGoose();return;}
  }
  if(photographer.stage===0){if(!photographer.quip&&speechTime<=0){speech='Фотограф: «И снова гусь… Он во всех моих пейзажах!»';speechTime=3.5;photographer.quip=18;}return;}
  const ready=Math.hypot(player.x-gooseLure.x,player.y-gooseLure.y)<30&&Math.hypot(goose.x-player.x,goose.y-player.y)<44&&Math.hypot(goose.x-camera.x,goose.y-camera.y)>60;
  photographer.hold=ready?photographer.hold+dt:0;
  if(photographer.hold>=3){photographer.stage=2;photographer.cheer=5;releasePhotoGoose();completePinned('photographer');speech='Фотограф: «Есть! Пейзаж без гуся. Теперь это редкий кадр!»';speechTime=5;window.ParkAudio?.shutter?.();unlockAchievement('photoAssistant');save();}
 }
 function drawPhotographer(){
  const p=photographerSite,c=photographerCamera(),x=p.x-8,y=c.y,moving=!reduced&&photographer.stage===0&&!ridesWet(),stride=moving?Math.sin(elapsed*4)*2:0;
  rect(x-12,y,25,5,'#365c3b44');rect(x-7,y-8+stride,5,10,'#435964');rect(x+2,y-8-stride,5,10,'#435964');rect(x-8,y+1+stride,7,3,'#e5dfc9');rect(x+1,y+1-stride,8,3,'#e5dfc9');
  rect(x-10,y-27,20,21,'#a38058');rect(x-7,y-25,14,16,'#c2a271');rect(x-6,y-41,13,14,'#e3b589');rect(x-8,y-44,16,6,'#615746');rect(x+2,y-37,2,2,'#324b45');rect(x-6,y-30,12,4,'#e4d2ad');
  rect(x-13,y-25,4,15,'#b99565');rect(x-13,y-12,4,4,'#e3b589');rect(x+9,y-25,4,12,'#b99565');
  if(photographer.cheer>0){rect(x+12,y-40,4,20,'#e3b589');rect(x+11,y-44,6,6,'#e3b589');}else{rect(x+12,y-19,8,4,'#e3b589');}
  line(x-5,y-29,x+8,y-13,'#4b5e54',2);rect(x+2,y-18,11,9,'#354d4b');rect(x+7,y-15,3,3,'#a3c8be');
  for(const dx of [-14,0,14])line(c.x,c.y-18,c.x+dx,c.y+5,'#556660',2);
  rect(c.x-12,c.y-32,23,15,'#354d4b');rect(c.x-7,c.y-36,8,5,'#526a64');rect(c.x+10,c.y-29,9,10,'#8aaba2');rect(c.x+16,c.y-27,4,6,'#263f3d');rect(c.x-8,c.y-28,9,7,'#acd0c0');
  if(photographer.cheer>4.65&&!reduced){rect(c.x+4,c.y-37,5,4,'#fff0be');}
  if(!capturingPhoto&&photographer.stage===1&&!ridesWet()){
   ctx.save();ctx.strokeStyle='#f2d38a';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.beginPath();ctx.ellipse(gooseLure.x,gooseLure.y,26,12,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
   mapLabel(photographer.hold>0?'Не двигайтесь · '+Math.max(1,Math.ceil(3-photographer.hold))+' с':'Отведите гуся сюда',gooseLure.x,gooseLure.y+24,11,2);
  }
 }
 const extraSpots=[{tx:28.5,ty:20,kind:'bear',name:'Медведь с балалайкой',action:'Послушать лесной дуэт · 8 с'},{tx:61,ty:48,kind:'photographer',name:'Фотограф и гусь',action:'Помочь фотографу'},{tx:82,ty:58,kind:'magician',name:'Уличный фокусник',action:'Посмотреть фокус'},{tx:31,ty:55,kind:'artist',name:'Уличный художник',action:'Портрет на память · 8 с'},{tx:36,ty:49,kind:'planeHost',action:'Запустить самолётик'},{tx:32,ty:49,kind:'bubbles',action:'Большой пузырь · запустить'},{tx:69,ty:35,kind:'gardener',action:'Поговорить с садовником'},{tx:15,ty:52,kind:'carousel',action:'Прокатиться на карусели'},{tx:80,ty:17,kind:'trampoline',action:'Попрыгать на батуте'},{tx:18,ty:60,kind:'gazebo',action:'Отдохнуть в беседке'},{tx:80,ty:62,kind:'telescope',action:'Посмотреть в телескоп'},{tx:46,ty:30,kind:'questAuthor',phrase:'Подготовил квест на ДР DEX'},{tx:85,ty:49,kind:'door409',action:'Войти в дверь 409 — Конфликт'},{tx:15,ty:18,kind:'feature',action:'Осмотреть камень-фичу'},{tx:14,ty:34,kind:'support',action:'Обратиться в техподдержку'},{tx:18,ty:34,kind:'router',action:'Перезагрузить роутер'},{tx:58,ty:10,kind:'release',action:'Узнать срок релиза'},{tx:42,ty:60,kind:'production',action:'Войти в продакшен'},{tx:73,ty:50,kind:'vacation',action:'Поговорить с коллегой'},{tx:80,ty:49,kind:'door404',action:'Войти в дверь 404'},{tx:39,ty:35,kind:'duck',action:'Объяснить проблему утке'},{tx:58,ty:55,kind:'debt',action:'Открыть сундук техдолга'},{tx:81,ty:39,kind:'beauty',action:'Сделать красиво'},{tx:66,ty:56,kind:'detector',action:'Взять металлоискатель'},{tx:62,ty:54,kind:'dig',action:'Копать здесь'},{tx:64,ty:23,kind:'music',action:'Потанцевать с музыкантом'},{tx:64,ty:50,kind:'sprinkler',action:'Включить дождеватель'},{tx:74,ty:43,kind:'echo',action:'Крикнуть в дупло'},{tx:76,ty:44,kind:'squirrel',action:'Поговорить с белкой'},{tx:78,ty:35,kind:'nut',action:'Поднять орех'},{tx:35,ty:35,kind:'fish',action:'Закинуть удочку'},{tx:67,ty:40,kind:'bush',action:'Осмотреть подозрительный куст'},{tx:52,ty:43,kind:'coffee',action:'Взять кофе'},{tx:70,ty:46,kind:'paper',action:'Поднять бумажку'},{tx:68,ty:48,kind:'bin',action:'Выбросить бумажку'}].map(p=>({...p,...point([p.tx,p.ty])}));

 const gardener=extraSpots.find(p=>p.kind==='gardener');

 // A tiny sheltered stage: bear and squirrel share one bounded, optional scene.
 const bearSite=extraSpots.find(p=>p.kind==='bear');
 const BEAR_SECONDS=8;
 let bearConcerts=0,bearCooldown=0,bearPhotoUntil=0;
 let bearGreeting=0,bearGreetingCooldown=0,bearSawHero=false;
 let bearAudience=[],bearNut={phase:'idle',time:0},bearNutReturns=0,bearEncore=null;
 function restoreBear(v={}){bearGreeting=bearGreetingCooldown=0;bearSawHero=false;bearAudience=[];bearEncore=null;bearNutReturns=Number.isInteger(v.bearNutReturns)?Math.max(0,Math.min(999,v.bearNutReturns)):0;bearNut={phase:['ground','rolling','carry'].includes(v.bearNut)?v.bearNut==='carry'?'carry':'ground':'idle',time:0};bearConcerts=Number.isInteger(v.bearConcerts)?Math.max(0,Math.min(999,v.bearConcerts)):0;bearCooldown=bearPhotoUntil=0;if(funScene?.kind==='bear')funScene=null;}
 function startBear(){
  if(blocked()||driving||cycling||funScene||idleEscort)return false;
  if(bearCooldown>0){speech='Медведь настраивает струны, белка пересчитывает орехи. Ещё '+Math.ceil(bearCooldown)+' с.';speechTime=3;return false;}
  clearInput();player.vx=player.vy=0;dashTime=0;teaTime=0;restingBench=null;bearPhotoUntil=0;
  gatherBearAudience();funScene={kind:'bear',time:0,beat:-1};speechTime=residentRemark=0;encounterGreeting=null;notePlayActivity();
  announce('Лесной дуэт · 8 секунд. P / 📷 — снять, E — уйти.',{scope:'bear'});return true;
 }
 function finishBear(cancelled=false){
  if(funScene?.kind!=='bear')return;funScene=null;bearCooldown=cancelled?3:15;for(const n of bearAudience){n.phase=cancelled?'leave':'clap';n.hold=2.6;n.applause=cancelled?0:2.6;}
  if(cancelled){bearPhotoUntil=0;speech='Медведь помахал лапой. До следующего концерта!';}
  else{bearConcerts=Math.min(999,bearConcerts+1);bearPhotoUntil=elapsed+15;completePinned('bear');unlockAchievement('forestConcert');
   speech=['Браво! Белка просит гонорар орехами.','Медведь на ухо не наступал. Только на сцену!','На бис? Сначала настроим струны и орехи.'][(bearConcerts-1)%3];
  }if(!cancelled&&bearConcerts%2===1&&bearNut.phase==='idle'){bearNut={phase:'rolling',time:0};speech='Ой, орех укатился! Подберите его и верните белке · E.';}speechTime=4;save();
 }
 function updateBearConcert(){
  const f=funScene;if(f?.kind!=='bear')return;
  const beat=Math.floor((f.time-.6)/.42);if(beat>=0&&beat<16&&beat!==f.beat){f.beat=beat;window.ParkAudio?.balalaikaNote?.(beat);}
  if(f.time>=BEAR_SECONDS)finishBear();
 }
 function bearPhotoReady(){return funScene?.kind==='bear'?funScene.time>=1:elapsed<bearPhotoUntil;}

 function bearNutSpot(){return {x:bearSite.x+24,y:bearSite.y+52,kind:'bearNut',name:'Укатившийся орех',action:'Подобрать орех для белки'};}
 function gatherBearAudience(){
  if(ridesWet())return;const goals=[{x:bearSite.x-24,y:bearSite.y+96},{x:bearSite.x+56,y:bearSite.y+96}];
  if(bearAudience.length){for(const n of bearAudience){n.phase='approach';n.applause=0;n.age=0;}return;}
  for(const [id,goal]of goals.entries()){
   if(!canStand(goal.x,goal.y)||path(Math.floor(goal.x/T),Math.floor(goal.y/T)))continue;
   for(const [dx,dy]of [[0,64],[80,0],[-64,0],[0,-48]]){
    const home={x:goal.x+dx,y:goal.y+dy};if(!canStand(home.x,home.y)||!clearSegment(home,goal)||Math.hypot(home.x-player.x,home.y-player.y)<34)continue;
    bearAudience.push({...home,home,goal,id:id+4,phase:'approach',age:0,hold:0,applause:0,walking:false});break;
   }
  }
 }
 function updateBearLife(dt){
  bearGreeting=Math.max(0,bearGreeting-dt);bearGreetingCooldown=Math.max(0,bearGreetingCooldown-dt);
  const near=Math.hypot(player.x-bearSite.x,player.y-bearSite.y)<155;
  if(!near&&Math.hypot(player.x-bearSite.x,player.y-bearSite.y)>215)bearSawHero=false;
  if(near&&!bearSawHero&&!funScene&&!driving&&!cycling){bearSawHero=true;if(!bearGreetingCooldown){bearGreeting=1.8;bearGreetingCooldown=20;}}

  if(bearNut.phase==='rolling'){bearNut.time+=dt;if(bearNut.time>=1.4){bearNut.phase='ground';if(Math.hypot(player.x-bearNutSpot().x,player.y-bearNutSpot().y)<58&&(!selectedInteraction||selectedInteraction===interactionKey(bearSite))){selectedInteraction=interactionKey(bearNutSpot());interactionOrder=[];}save();}}
  if(bearEncore){bearEncore.time+=dt;const beat=Math.floor(bearEncore.time/.22);if(beat<4&&beat!==bearEncore.beat){bearEncore.beat=beat;window.ParkAudio?.balalaikaNote?.([0,3,6,9][beat],.8);}if(bearEncore.time>=1.2)bearEncore=null;}
  for(const n of bearAudience){
   n.age+=dt;n.walking=false;if(ridesWet()||Math.hypot(player.x-bearSite.x,player.y-bearSite.y)>550)n.phase='leave';
   if(n.phase==='clap'){n.hold-=dt;n.applause=n.hold;if(n.hold<=0){n.phase='leave';n.age=0;}}
   if(n.phase==='watch'||n.phase==='clap')continue;
   const goal=n.phase==='leave'?n.home:n.goal,d=Math.hypot(goal.x-n.x,goal.y-n.y);
   if(d<1){if(n.phase==='leave')n.done=true;else n.phase='watch';continue;}
   const travel=Math.min(d,62*dt),x=n.x+(goal.x-n.x)/d*travel,y=n.y+(goal.y-n.y)/d*travel;
   if(canStand(x,y)&&Math.hypot(x-player.x,y-player.y)>26&&!bearAudience.some(o=>o!==n&&Math.hypot(o.x-x,o.y-y)<25)){n.x=x;n.y=y;n.walking=true;}
   if(n.phase==='leave'&&n.age>18)n.done=true;
  }
  bearAudience=bearAudience.filter(n=>!n.done);
 }
 function useBearNut(){
  if(blocked()||funScene||driving||cycling)return false;
  if(bearNut.phase==='ground'&&Math.hypot(player.x-bearNutSpot().x,player.y-bearNutSpot().y)<62){bearNut.phase='carry';celebrateFind('nut');speech='Орех нашёлся! Верните его белке у медведя · E.';}
  else if(bearNut.phase==='carry'&&Math.hypot(player.x-bearSite.x,player.y-bearSite.y)<72){bearNut.phase='idle';bearNutReturns=Math.min(999,bearNutReturns+1);bearEncore={time:0,beat:-1};speech='Белка кланяется: «Спасибо! Этот орех был ударным!»';unlockAchievement('nutEncore');}
  else return false;
  speechTime=4;notePlayActivity();clearInput();save();return true;
 }
 function drawBearNut(){
  if(bearNut.phase==='idle'||bearNut.phase==='carry')return;const target=bearNutSpot(),u=bearNut.phase==='rolling'?unit(bearNut.time/1.4):1;
  let x=bearSite.x+42+(target.x-bearSite.x-42)*u,y=bearSite.y+(target.y-bearSite.y)*u;
  if(bearNut.phase==='carry'){x=player.x+15;y=player.y-17;}else if(!reduced)y-=Math.sin(u*Math.PI)*12;
  rect(x-5,y-4,10,8,'#a47a48');rect(x-3,y-6,6,11,'#c99b60');line(x,y-4,x-1,y+3,'#795b39',1);
 }
 function drawBearAudience(n){
  const sway=n.phase==='watch'&&!reduced?Math.sin(elapsed*4+n.id)*1.3:0;
  ctx.save();ctx.globalAlpha=unit(n.age/.35);drawCinemaGuest({...n,x:n.x+sway});ctx.restore();
 }

 function bearIdleAction(){if(funScene?.kind==='bear'||bearEncore)return 'play';if(bearGreeting>0)return 'greet';if(elapsed<bearPhotoUntil)return 'tune';const phase=elapsed%24;return phase>=8&&phase<15?'tea':'tune';}
 function drawBearStage(p=bearSite){
  const {x,y}=p;if(x<camX-170||x>camX+viewW+170||y<camY-50||y>camY+viewH+150)return;
  const active=funScene?.kind==='bear'||!!bearEncore,time=funScene?.kind==='bear'?funScene.time:bearEncore?.time??elapsed,pose=elapsed<bearPhotoUntil;
  const idle=bearIdleAction(),strum=reduced?0:active?Math.sin(time*15)*3:idle==='tune'?Math.sin(time*2.2)*1.8:0,bow=reduced?0:pose?Math.sin(Math.min(1,(15-bearPhotoUntil+elapsed)/1.6)*Math.PI)*3:0;
  ctx.save();ctx.translate(x,y);
  // Low wooden boards and an open front leave the neighbouring paths clear.
  rect(-70,4,140,13,'#a68b65');rect(-70,14,140,4,'#79654d');for(let i=-64;i<70;i+=22)line(i,5,i,13,'#847453',1);
  for(const side of [-1,1]){rect(side*67-2,-80,4,85,'#837450');rect(side*67-5,1,10,5,'#b4a178');}
  rect(-73,-86,146,8,'#557b65');rect(-64,-92,128,6,'#6e9177');rect(-72,-78,144,4,'#c3b789');
  line(-60,-75,60,-75,'#b6ae86',1);for(let i=0;i<6;i++){const lx=-53+i*21;rect(lx,-75,3,4,'#c0ae71');rect(lx-1,-72,5,5,nightLevel()>.2?'#f6d999':'#dfd2a9');}
  if(snowCover()>.1)rect(-61,-95,122,3,'#e3e8dc');
  // Rounded ears, broad muzzle, small eyes and padded paws keep the bear friendly.
  ctx.save();ctx.translate(-18,-1+bow);rect(-22,-6,45,8,'#655a4244');
  rect(-23,-42,46,36,'#78573d');rect(-18,-48,36,40,'#8f6847');rect(-12,-36,25,28,'#b89165');
  rect(-24,-6,18,9,'#684c39');rect(7,-6,18,9,'#684c39');for(const px of [-20,-14,11,17])rect(px,-1,3,2,'#b5966e');
  rect(-22,-67,12,13,'#755039');rect(11,-67,12,13,'#755039');rect(-19,-64,6,7,'#c29b74');rect(14,-64,6,7,'#c29b74');
  rect(-19,-59,39,29,'#916a48');rect(-15,-63,30,33,'#916a48');rect(-22,-53,44,16,'#916a48');
  const blink=!reduced&&(elapsed%6.7)<.12;rect(-11,-49,3,blink?1:3,'#333b30');rect(9,-49,3,blink?1:3,'#333b30');
  rect(-10,-43,23,13,'#d0aa79');rect(-4,-44,10,5,'#3f3c30');line(1,-39,1,-35,'#725040',1);line(-3,-34,5,-34,'#725040',1);
  rect(-17,-30,34,5,'#748d80');rect(10,-26,7,12,'#748d80');
  // Triangular soundboard, long neck and three visible strings: a balalaika.
  line(7,-28,32,-52,'#674c37',7);line(7,-28,32,-52,'#b39160',3);rect(28,-58,11,8,'#82613f');
  for(const px of [28,34])rect(px,-61,3,4,'#c3b28d');rect(37,-55,4,3,'#c3b28d');
  ctx.fillStyle='#c89a58';ctx.beginPath();ctx.moveTo(5,-35);ctx.lineTo(-19,-9);ctx.lineTo(28,-9);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#ecd199';ctx.lineWidth=2;ctx.stroke();rect(1,-23,7,6,'#694b33');
  for(const dx of [-2,0,2])line(31+dx,-53,3+dx,-11,'#ead8aa',.7);line(-6,-12,14,-12,'#7c5737',2);
  rect(-25,-31,10,19,'#79553c');rect(-17+strum,-24,13,8,'#ab8056');
  if(idle==='tea'){
   const sip=reduced?1:(1-Math.cos((elapsed%24-8)/7*Math.PI*2))/2,cy=-22-15*sip;
   line(23,-28,25,cy+5,'#ab8056',7);rect(19,cy,13,12,'#c7d1b5');rect(21,cy+2,9,7,'#e3e5c9');line(32,cy+3,36,cy+3,'#c7d1b5',2);line(36,cy+3,36,cy+8,'#c7d1b5',2);line(32,cy+8,36,cy+8,'#c7d1b5',2);rect(20,cy-1,11,2,'#72604b');
   if(!reduced){ctx.save();ctx.globalAlpha=.4;for(let i=0;i<2;i++){const u=(elapsed*.5+i*.5)%1;line(24+Math.sin(u*6)*2,cy-3-u*9,25,cy-6-u*9,'#e7dfc7',1);}ctx.restore();}
  }else if(idle==='greet'){const wave=reduced?0:Math.sin(bearGreeting*9)*3;line(22,-34,29+wave,-56,'#916a48',8);rect(24+wave,-62,12,9,'#ba9063');}
  else{rect(17,-39,10,8,'#ab8056');if(!active){rect(27,-54,9,5,'#ab8056');}}
  ctx.restore();
  // A squirrel percussionist, with a curled tail and a walnut-shell drum.
  const tap=reduced?0:active?Math.max(0,Math.sin(time*15))*5:0;ctx.save();ctx.translate(45,1);
  rect(7,-26,14,22,'#b17a49');rect(12,-38,11,21,'#bb8852');rect(8,-42,13,7,'#bb8852');rect(9,-30,7,15,'#d7b276');
  rect(-9,-23,20,22,'#b97f48');rect(-5,-19,11,16,'#e2bf89');rect(-11,-31,21,14,'#c68f53');
  rect(-10,-37,6,8,'#b77e46');rect(3,-37,6,8,'#b77e46');rect(-9,-29,3,3,'#333c32');rect(-14,-24,6,5,'#dec397');rect(-16,-24,3,2,'#4c4b36');
  rect(-15,-8,18,12,'#906741');rect(-16,-10,20,5,'#d4b980');line(-11,-5,-9,2,'#b69562',1);line(-3,-5,-4,2,'#b69562',1);
  if(active){line(-7,-18,-17,-14-tap,'#dcc28d',2);line(4,-19,-3,-13+tap*.3,'#dcc28d',2);rect(-9,-20,5,4,'#c79557');rect(2,-20,5,4,'#c79557');}
  else if(idle==='greet'){line(-6,-19,-15,-29,'#c79557',4);rect(-18,-32,6,5,'#dec397');}
  else{rect(-30,-1,18,5,'#a78b61');for(let i=0;i<3;i++){const nx=-27+i*6;rect(nx,-5,4,5,'#c69b65');rect(nx+1,-4,1,3,'#8b6542');}const reach=reduced?0:Math.sin(elapsed*2)*4;line(-7,-18,-19+reach,-7,'#c79557',4);rect(-22+reach,-9,5,5,'#d6aa6c');}
  ctx.restore();
  if(active&&!reduced)for(let i=0;i<(comfort.lightweight?2:4);i++){const u=(time*.65+i*.25)%1;text(i%2?'♪':'♫',-32+i*20+Math.sin(time+i)*4,-65-u*13,10,'#e0bc76','center');}
  ctx.restore();
 }

 const gardenBeds=[0,7,8].map((index,id)=>{const b=flowerBeds[index];return {...point([b.tx+Math.floor(b.w/2),b.ty+b.h]),id,bed:index,kind:'gardenBed',action:'Полить клумбу · 2 с'};});
 let garden={stage:0,watered:[],rainHelp:false},gardenRain=0;
 function restoreGarden(v){const stage=[0,1,2].includes(v?.stage)?v.stage:0;garden={stage,watered:stage===2?[0,1,2]:stage===1&&Array.isArray(v?.watered)?[...new Set(v.watered.filter(i=>Number.isInteger(i)&&i>=0&&i<3))]:[],rainHelp:stage>0&&v?.rainHelp===true};gardenRain=0;}
 function gardenGoal(){return garden.stage===1?gardenBeds.find(p=>!garden.watered.includes(p.id))||gardener:gardener;}
 function gardenGoalName(){return garden.stage===0?'Поговорите с садовником':garden.stage===2?'Садовник · цветы политы':garden.watered.length===3?'Верните лейку садовнику':'Полейте клумбу '+(gardenGoal().id+1)+' · '+garden.watered.length+'/3';}
 function followGarden(){trackedPlace=gardenPlace;trackedErrand=-1;navCache=null;}
 function waterGardenBed(id){if(garden.stage!==1||garden.watered.includes(id)||!gardenBeds[id])return;garden.watered.push(id);navCache=null;const p=gardenBeds[id];burst(p.x,p.y-35,'#f5bbd3');save();}
 function updateGardenRain(dt){if(garden.stage!==1||garden.watered.length===3)return;gardenRain=rainIntensity()>.3?gardenRain+dt:0;if(gardenRain<2)return;garden.rainHelp=true;for(let i=0;i<3;i++)waterGardenBed(i);announce('Дождь полил все три клумбы! Осталось вернуть лейку садовнику.');save();}
 function useGardener(a){if(a.kind==='gardenBed'){if(garden.stage!==1||garden.watered.includes(a.id))return;clearInput();player.vx=player.vy=0;dashTime=0;speechTime=0;funScene={kind:'watering',time:0,bedId:a.id};return;}
  clearInput();player.vx=player.vy=0;dashTime=0;speechTime=0;let copy;
  if(garden.stage===0){garden.stage=1;followGarden();copy='Поможешь полить три клумбы? Держи лейку — воды хватит на все. Подходи к отмеченным цветам и нажимай E или кнопку действия. Указатель проведёт от одной клумбы к другой. Потом верни мне лейку.';}
  else if(garden.stage===1&&garden.watered.length===3){garden.stage=2;if(trackedPlace===gardenPlace)trackedPlace=-1;navCache=null;copy=garden.rainHelp?'Спасибо, небесный подрядчик уже справился! А ты вовремя вернул лейку. Командная работа — даже с облаками.':'Спасибо! Вот это цветущий результат. Ни одного совещания, а три клумбы счастливы!';unlockAchievement('garden');window.ParkAudio?.reward();}
  else if(garden.stage===1){followGarden();copy='Полито '+garden.watered.length+' из 3 клумб. Остальные ждут — указатель покажет дорогу. А если пойдёт дождь, поработаем в команде с погодой!';}
  else copy='Цветы передают привет! Лейка отдыхает, бабочки на смене.';
  $('activity-title').textContent=garden.stage===2?'Садовник · цветущий результат':'Садовник · три клумбы';$('activity-copy').textContent=copy;activity.showModal();save();
 }
 function renderGardenQuest(){$('garden-status').textContent=garden.stage===0?'Садовник в восточном саду просит помощи с цветами. Это необязательное поручение.':garden.stage===2?'✓ Три клумбы политы, лейка возвращена. Цветы расцвели!':garden.watered.length===3?'Все клумбы политы. Верните лейку садовнику.':'Лейка у вас · полито '+garden.watered.length+' из 3 клумб. Дождь тоже может помочь.';$('garden-track').textContent=trackedPlace===gardenPlace?'Убрать указатель':garden.stage===0?'Найти садовника':garden.stage===2?'Навестить садовника':'Показать путь';}
 function drawWateringCan(x,y,tilt=0){ctx.save();ctx.translate(x,y);ctx.rotate(tilt);rect(-6,-5,12,10,'#3c8992');rect(-4,-7,8,3,'#80c1bb');line(5,-1,13,-6,'#96d1cc',3);rect(11,-9,4,6,'#bde1d5');ctx.strokeStyle='#80c1bb';ctx.lineWidth=2;ctx.strokeRect(-10,-5,6,8);rect(-3,-3,2,5,'#b4d7bd');ctx.restore();}
 function drawGardener(){const x=gardener.x,y=gardener.y;ctx.save();ctx.translate(x,y);rect(-12,0,25,4,'#365c3b55');rect(-8,-9,6,12,'#394d3c');rect(2,-9,6,12,'#394d3c');rect(-10,1,9,4,'#80614a');rect(2,1,9,4,'#80614a');rect(-10,-27,20,21,'#98b86c');rect(-7,-24,14,17,'#447c62');rect(-4,-17,8,5,'#75977a');rect(-13,-24,4,15,'#e9ae82');rect(9,-24,4,15,'#e9ae82');rect(-8,-41,16,16,'#efbb91');rect(-9,-44,18,7,'#77604a');rect(-4,-35,2,2,'#29463b');rect(3,-35,2,2,'#29463b');rect(-2,-29,6,2,'#fff0cd');rect(-14,-46,28,4,'#d5b96c');rect(-9,-54,18,9,'#e9ce84');rect(-9,-47,18,2,'#789263');if(garden.stage!==1)drawWateringCan(18,-6);else{rect(12,-27,4,12,'#efbb91');rect(12,-32,5,6,'#efbb91');}ctx.restore();}
 function drawGardenLife(){if(snowCover()>.1)return;for(const p of gardenBeds){if(garden.stage===1&&!garden.watered.includes(p.id)){rect(p.x-5,p.y-12,10,10,'#e7c572');rect(p.x-2,p.y-10,4,6,'#478896');}if(!garden.watered.includes(p.id)||ridesWet())continue;const b=flowerBeds[p.bed];for(let i=0;i<(comfort.lightweight?1:2);i++){const t=reduced?i*2:elapsed*1.6+i*3,x=(b.tx+.5)*T+20+Math.sin(t*.6)*27,y=b.ty*T+12+Math.cos(t*.8)*14,flap=reduced?3:2+Math.abs(Math.sin(t*5))*4;rect(x-flap,y-2,flap,5,i?'#ffdda0':'#f5afcb');rect(x+1,y-2,flap,5,i?'#ffeabe':'#e6c4ef');rect(x,y-3,1,7,'#665441');}}
  if(funScene?.kind==='watering'){const p=gardenBeds[funScene.bedId],b=flowerBeds[p.bed],tx=p.x,ty=(b.ty+b.h)*T-12;for(let i=0;i<(comfort.lightweight?4:9);i++){const u=(funScene.time*1.5+i/9)%1,x=player.x+22+(tx-player.x-22)*u,y=player.y-26+(ty-player.y+26)*u-Math.sin(u*Math.PI)*13;rect(x,y,2,3,'#b9e4df');}}
 }


 // Small discoveries share the active game clock; no timers run behind dialogs.
 const musicTiles=Array.from({length:8},(_,i)=>({...point([31+i,12]),note:i}));
 // Optional discoveries: four remembered notes, a playful cat and one personal pin.
 const melodyPatterns=[[0,2,1,3],[3,1,4,2],[2,4,3,5]];
 let melody={active:false,index:0,wins:0},melodyDemo=null;
 const seekCatHome={...point([28,12]),name:'Кот Рыжик',kind:'seekCat',id:'ryzhik'};
 const catHides=[[31,14],[27,16],[24,17]].map((p,i)=>({...point(p),id:i}));
 let seekCat={...seekCatHome,stage:0,state:'invite',path:[],repath:0,stride:0},catClueTime=0,catInviteTime=-100,catRubTime=0;
 let personalMarker=null,markerDraft=null,markerMode=false;
 let reflectingHero=false,reflectionCanvas=null;
 // New discoveries own attention, but never block walking, the camera or weather.
 const songPerch={x:musicTiles[3].x,y:musicTiles[3].y-58};
 const dandelionSite={...point([28,10]),kind:'dandelion',id:'meadow',name:'Одуванчиковая поляна',action:'Подуть на одуванчик'};
 let birdEcho=null,dandelion=null,dandelionChase=null,dandelionBlows=0,markerEditing=false;
 function markerName(value){return Array.from(typeof value==='string'?value.replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,'').replace(/\s+/g,' ').trim():'').slice(0,32).join('')||'Моя отметка';}
 function restoreDiscoveries70(v={}){
  const e=v.birdEcho;birdEcho=e&&Array.isArray(e.sequence)&&e.sequence.length===4&&e.sequence.every(n=>Number.isInteger(n)&&n>=0&&n<8)?{sequence:[...e.sequence],time:-1,beat:-1}:null;
  dandelion=null;dandelionChase=null;dandelionBlows=Number.isInteger(v.dandelionBlows)?Math.max(0,Math.min(999,v.dandelionBlows)):0;markerEditing=false;
 }
 function catFocused(){return !driving&&!cycling&&!funScene&&['run','hide','rub'].includes(seekCat.state)&&Math.hypot(player.x-seekCat.x,player.y-seekCat.y)<260;}
 function discoveryFocus(){if(funScene?.kind==='bear')return 'bear';if(picnic.phase!=='idle'&&Math.hypot(player.x-picnicSite.x,player.y-picnicSite.y)<230)return 'picnic';if(melodyFocused())return 'melody';if(catFocused())return 'cat';if(birdEcho&&birdEcho.time>=0&&Math.hypot(player.x-songPerch.x,player.y-songPerch.y)<330)return 'birds';if(dandelion&&Math.hypot(player.x-dandelionSite.x,player.y-dandelionSite.y)<230)return 'dandelion';return '';}
 function ambientSceneBusy(){return !!discoveryFocus();}
 function noticeAllowed(n){const focus=discoveryFocus();return !focus||n?.urgent||n?.scope===focus;}
 function queueBirdEcho(sequence){birdEcho={sequence:[...sequence],time:-1,beat:-1};}
 function updateDiscoveries70(dt){
  updateBirdEcho(dt);updateDandelions(dt);
 }
 function updateBirdEcho(dt){
  if(!birdEcho)return;const e=birdEcho,d=Math.hypot(player.x-songPerch.x,player.y-songPerch.y);
  const unavailable=ridesWet()||snowCover()>.2||momentsBusy()||melodyFocused()||catFocused()||!!dandelion;
  if(e.time<0){if(unavailable||d>220||speechTime>0||weatherSpeaking()||fountainShow||wheelLightShow||fireflyDance)return;e.time=0;announce((viewW<600||mobileScreen())?'Парк подпевает! 📷 — снимок.':'Птицы подхватили вашу мелодию! Послушайте ответ · P — снимок.',{scope:'birds',key:'bird-echo',ttl:18});}
  if(unavailable||d>400){e.time=-1;e.beat=-1;save();return;}
  e.time+=dt;const beat=Math.floor((e.time-2)/.85);
  if(beat>=0&&beat<4&&beat!==e.beat){e.beat=beat;window.ParkAudio?.echoBird?.(e.sequence[beat]);}
  if(e.time>=14){birdEcho=null;save();}
 }
 function echoBirdPoses(){
  if(!birdEcho||birdEcho.time<0)return [];const age=birdEcho.time;
  return [0,1,2].map(i=>{const fly=reduced?0:age<1.5?1-age/1.5:age>11?(age-11)/3:0,side=i===1?1:-1;return {x:songPerch.x+(i-1)*28+side*fly*100,y:songPerch.y-26-fly*65,fly,alpha:unit(age/.5)*unit((14-age)/1.4),id:i};});
 }
 function drawSongPerch(){
  const {x,y}=songPerch;if(x<camX-90||x>camX+viewW+90||y<camY||y>camY+viewH+40)return;
  rect(x-51,y-23,102,5,'#a79770');for(const side of [-1,1]){rect(x+side*44-2,y-30,5,32,'#8b805f');rect(x+side*44-3,y-31,7,3,'#c4b58c');}snowCap(x-51,y-24,102,3);
  for(const b of echoBirdPoses()){
   const singing=birdEcho.time>=2&&birdEcho.time<5.4&&birdEcho.beat%3===b.id,side=singing?1:player.x<b.x?-1:1;
   ctx.save();ctx.globalAlpha=b.alpha;ctx.translate(b.x,b.y);ctx.scale(side,1);
   rect(-8,-8,13,7,'#8b8271');rect(-5,-5,10,5,'#d8cbb0');rect(1,-13,9,9,'#9a917a');rect(3,-10,7,4,'#ece1bd');rect(6,-12,2,2,'#354e45');rect(10,-8,4,singing?3:1,'#c5a46c');rect(-13,-6,7,3,'#777967');line(-3,0,-4,3,'#666a52',1);line(2,0,3,3,'#666a52',1);
   if(b.fly>0){const flap=reduced?0:Math.sin(elapsed*16)*6;line(-3,-7,-13,-14+flap,'#b7ad92',4);}ctx.restore();
   if(singing){ctx.save();ctx.globalAlpha=b.alpha;text('♪ '+(birdEcho.sequence[birdEcho.beat]+1),b.x,b.y-23,12,'#f9eac6','center');ctx.restore();}
  }
 }
 function dandelionReady(){return !ridesWet()&&snowCover()<.15;}
 function useDandelion(){
  if(dandelion||driving||cycling||funScene||melodyFocused())return false;
  if(!dandelionReady()){speech='Пушинки ждут сухой погоды. Вернусь за желанием позже.';speechTime=4;return false;}
  const count=reduced?6:comfort.lightweight?12:26;
  dandelion={time:0,seeds:Array.from({length:count},(_,i)=>({x:dandelionSite.x+(i%5-2)*2,y:dandelionSite.y-24+(i%3)*2,vx:9+(i%6)*3,vy:-9-(i%5)*2,age:0,seed:i}))};
  dandelionBlows=Math.min(999,dandelionBlows+1);completePinned('dandelion');unlockAchievement('dandelionWish');
  speech='Желание отправлено. Доставка — попутным ветром.';speechTime=4;player.face=player.x<dandelionSite.x?'right':'left';
  if(catCompanion.phase==='idle'&&['invite','done'].includes(seekCat.state)&&Math.hypot(seekCat.x-dandelionSite.x,seekCat.y-dandelionSite.y)<180){const target={x:dandelionSite.x+20,y:dandelionSite.y+15};if(lifeClear(target.x,target.y))dandelionChase={time:0,target,home:{x:seekCat.x,y:seekCat.y}};}
  save();return true;
 }
 function updateDandelions(dt){
  if(dandelion){dandelion.time+=dt;for(const p of dandelion.seeds){p.age+=dt;if(!reduced){p.x+=(p.vx+windGust()*7)*dt;p.y+=(p.vy+Math.sin(p.age*1.5+p.seed)*4)*dt;}}if(dandelion.time>=9||!dandelionReady())dandelion=null;}
  if(!dandelionChase)return;const c=dandelionChase;c.time+=dt;
  if(!['invite','done'].includes(seekCat.state)||!dandelionReady()||driving||cycling){dandelionChase=null;seekCat.path=[];return;}
  const returning=c.time>4,target=returning?c.home:c.target;storyStep(seekCat,target,returning?45:68,dt,false);
  if(c.time>9||(returning&&Math.hypot(seekCat.x-target.x,seekCat.y-target.y)<4)){dandelionChase=null;seekCat.path=[];}
 }
 function drawDandelionMeadow(){
  const {x,y}=dandelionSite;if(x<camX-100||x>camX+viewW+100||y<camY-60||y>camY+viewH+60)return;
  if(snowCover()>.15)return;
  for(let i=0;i<13;i++){const dx=(i*19%83)-41,dy=(i*13%33)-16,h=10+i%5,bend=reduced?0:Math.sin(elapsed*1.5+i)*Math.min(2,windGust());line(x+dx,y+dy,x+dx+bend,y+dy-h,'#55784f',2);rect(x+dx-5,y+dy-2,6,2,'#608756');
   if(!dandelion||i%3){const white=i%4!==0,color=white?'#eee9d4':'#ddc77e';rect(x+dx-4+bend,y+dy-h-3,8,5,color);rect(x+dx-2+bend,y+dy-h-5,4,9,color);rect(x+dx-1+bend,y+dy-h-1,2,2,'#a4a889');}
  }
  // Low garden lantern: decorative, outside the walking lane.
  rect(x-57,y-27,3,30,'#53685b');rect(x-62,y-36,13,11,nightLevel()>.2?'#f2d596':'#bac5aa');rect(x-64,y-39,17,3,'#53685b');
 }
 function drawDandelionSeeds(){
  if(!dandelion)return;const age=dandelion.time,glow=nightLevel(),fade=unit((9-age)/2),baseX=dandelionSite.x,baseY=dandelionSite.y;
  ctx.save();for(const p of dandelion.seeds){const x=reduced?baseX+18+(p.seed%3)*22:p.x,y=reduced?baseY-30-Math.floor(p.seed/3)*20:p.y;if(x<camX-10||x>camX+viewW+10||y<camY-10||y>camY+viewH+10)continue;
   ctx.globalAlpha=fade*.82;if(glow>.1&&!comfort.lightweight){ctx.globalAlpha=fade*glow*.13;rect(x-4,y-5,9,9,'#f4d7a0');ctx.globalAlpha=fade*.9;}line(x,y,x+1,y+5,glow>.2?'#ebcd94':'#d9d4b5',1);line(x-4,y-2,x+4,y-2,glow>.2?'#f5e2b8':'#fff7df',1);line(x-2,y-4,x+2,y,glow>.2?'#f5e2b8':'#fff7df',1);
  }ctx.restore();
 }
 function drawDandelionHands(){if(!dandelion||dandelion.time>1.1||Math.hypot(player.x-dandelionSite.x,player.y-dandelionSite.y)>75||driving||cycling||funScene)return;ctx.save();ctx.translate(player.x,player.y);ctx.scale(player.face==='left'?-1:1,1);line(10,-20,18,-30,'#eab48e',4);line(17,-25,21,-41,'#799064',2);rect(18,-45,7,5,'#f2ead5');ctx.restore();}
 function editMarker(){if(!personalMarker)return;markerDraft=null;markerMode=false;markerEditing=true;$('marker-status').textContent='';$('marker-name').value=personalMarker.name;renderExplorerMap(true);$('marker-name').focus();}
 function drawDandelionLight(){const night=nightLevel();if(night<.1)return;const x=dandelionSite.x-56-camX,y=dandelionSite.y-31-camY;if(x>-120&&x<viewW+120&&y>-100&&y<viewH+100){ctx.save();ctx.globalAlpha=night*.15;ctx.fillStyle='#f0d69e';ctx.beginPath();ctx.ellipse(x+24,y+27,68,37,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=night*.8;rect(x-3,y-2,7,7,'#f6dfa6');ctx.restore();}ctx.save();ctx.translate(-camX,-camY);drawDandelionSeeds();ctx.restore();}
 function cancelMarkerEdit(){markerDraft=null;markerEditing=false;renderExplorerMap(true);$('marker-status').textContent='Изменения отменены.';}
 function saveMarkerName(){if(!markerEditing||!personalMarker)return false;personalMarker.name=markerName($('marker-name').value);markerEditing=false;save();renderExplorerMap(true);$('marker-status').textContent='Подпись сохранена: '+personalMarker.name;return true;}


 // Small optional scenes, bounded path work, and photo navigation independent of the personal pin.
 const picnicSite={...point([68,53]),kind:'picnic',id:'picnic',name:'Спасти пикник',action:'Помочь с пикником',hair:'#715747',shirt:'#b58b68',quiet:true};
 const picnicApple=point([69,55]);
 let picnic={phase:'idle',time:0,cooldown:0,helps:0};
 let catCompanion={phase:'idle',left:60,age:0,wait:0,invited:false,completed:false};
 let triedActivities=new Set(),photoNav=null,photoViewerId='',photoViewerRevision=0;
 function safePhotoPlace(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&inside(p.x/T,p.y/T)?{x:Math.round(p.x),y:Math.round(p.y)}:null;}
 function restoreDiscoveries71(v={}){
  const c=v.catCompanion;catCompanion={phase:'idle',left:60,age:0,wait:0,invited:c?.invited===true,completed:c?.completed===true};
  if(seekCat.stage===3&&['follow','wait','return'].includes(c?.phase)&&Number.isFinite(c.left)&&c.left>=0&&c.left<=60){const p=safePhotoPlace(c);if(p&&catSafe(p.x,p.y)){Object.assign(seekCat,p);Object.assign(catCompanion,{phase:c.phase,left:c.left,age:60-c.left});}}
  picnic={phase:'idle',time:0,cooldown:0,helps:Number.isInteger(v.picnicHelps)?Math.max(0,Math.min(999,v.picnicHelps)):0};
  triedActivities=new Set(Array.isArray(v.triedActivities)?v.triedActivities.filter(id=>typeof id==='string'&&/^[a-zA-Z0-9-]{1,40}$/.test(id)).slice(0,100):[]);
  const p=safePhotoPlace(v.photoNav);photoNav=p?{...p,name:markerName(v.photoNav.name)}:null;
  photoViewerId='';photoViewerRevision++;$('photo-viewer').close();$('activity-search').value='';for(const id of ['nearby','untried','available'])$('search-'+id).checked=false;
 }
 function catSafe(x,y){return lifeClear(x,y)&&!onMotorRoad(x,y)&&!storyCarBlocks(x,y,12);}
 function catWalkPath(from,to){
  const sx=Math.floor(from.x/T),sy=Math.floor(from.y/T),tx=Math.floor(to.x/T),ty=Math.floor(to.y/T),start=sy*COLS+sx,end=ty*COLS+tx;
  if(!catSafe(to.x,to.y))return [];const queue=[start],prev=new Map([[start,-1]]);let head=0;
  while(head<queue.length&&head<6500){const key=queue[head++];if(key===end)break;const x=key%COLS,y=Math.floor(key/COLS);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,nk=ny*COLS+nx;if(nx<8||nx>87||ny<8||ny>67||prev.has(nk)||!catSafe(nx*T+16,ny*T+16))continue;prev.set(nk,key);queue.push(nk);}}
  if(!prev.has(end))return [];const path=[];for(let key=end;key!==start;key=prev.get(key))path.push({x:key%COLS*T+16,y:Math.floor(key/COLS)*T+16});path.reverse();path.push({x:to.x,y:to.y});return path;
 }
 function catWalkStep(target,speed,dt){
  const n=seekCat;n.moving=false;n.repath=Math.max(0,n.repath-dt);const d=Math.hypot(n.x-target.x,n.y-target.y);if(d<4)return true;
  const key=Math.floor(target.x/T)+','+Math.floor(target.y/T);if(n.repath===0&&(!n.path.length||n.routeKey!==key)){n.path=catWalkPath(n,target);n.routeKey=key;n.repath=1.2;}
  while(n.path.length&&Math.hypot(n.x-n.path[0].x,n.y-n.path[0].y)<3)n.path.shift();const p=n.path[0];if(!p)return false;
  const dx=p.x-n.x,dy=p.y-n.y,len=Math.hypot(dx,dy),step=Math.min(len,speed*dt),x=n.x+dx/(len||1)*step,y=n.y+dy/(len||1)*step;
  if(!catSafe(x,y)){n.path=[];return false;}if(catCompanion.phase!=='return'&&Math.hypot(player.x-x,player.y-y)<25)return false;
  n.x=x;n.y=y;n.moving=true;n.stride+=dt*9;if(Math.abs(dx)>.1)n.face=Math.sign(dx);return false;
 }
 function startCatWalk(){
  if(seekCat.stage<3||driving||cycling||funScene||ridesWet())return false;
  dandelionChase=null;seekCat.state='done';seekCat.path=[];seekCat.repath=0;Object.assign(catCompanion,{phase:'follow',left:60,age:0,wait:0,invited:true});
  speech='Рыжик решил проводить вас. Минутка прогулки — и обратно к своим тайникам.';speechTime=5;completePinned('catWalk');save();return true;
 }
 function useCatWalk(){if(['follow','wait'].includes(catCompanion.phase)){catCompanion.phase='return';seekCat.path=[];seekCat.repath=0;speech='Спасибо за компанию, Рыжик! До встречи на аллее.';speechTime=4;save();return true;}return startCatWalk();}
 function updateCatCompanion(dt){
  const c=catCompanion,n=seekCat;if(c.phase==='idle')return false;n.moving=false;
  const distance=Math.hypot(player.x-n.x,player.y-n.y);
  if(c.phase!=='return'&&(ridesWet()||distance>600||c.left<=0)){c.phase='return';n.path=[];n.repath=0;save();}
  if(c.phase==='return'){if(catWalkStep(seekCatHome,105,dt)){c.phase='idle';n.path=[];save();}return true;}
  if(driving||cycling||funScene||onMotorRoad(player.x,player.y)||distance>260){c.phase='wait';c.wait+=dt;if(c.wait>45){c.phase='return';n.path=[];n.repath=0;}return true;}
  c.phase='follow';c.wait=0;c.left=Math.max(0,c.left-dt);c.age+=dt;
  if(c.age>=8&&!c.completed){c.completed=true;save();}
  const distracted=!reduced&&((c.age>=12&&c.age<14)||(c.age>=28&&c.age<30));if(distracted){n.face=1;return true;}
  if(distance<52){n.face=player.x<n.x?-1:1;return true;}
  const vx=player.vx||0,vy=player.vy||0,len=Math.hypot(vx,vy),side=Math.floor(c.age/9)%3===1?1:-1;
  let target=len>10?{x:player.x+vx/len*42*side,y:player.y+vy/len*42*side}:{x:player.x+(n.x<player.x?-38:38),y:player.y+12};
  if(!catSafe(target.x,target.y))target={x:player.x,y:player.y};catWalkStep(target,210,dt);return true;
 }
 function drawCatButterfly(){const c=catCompanion;if(c.phase!=='follow'||reduced||!((c.age>=12&&c.age<14)||(c.age>=28&&c.age<30)))return;const x=seekCat.x+24,y=seekCat.y-22+Math.sin(c.age*4)*5,w=3+Math.abs(Math.sin(c.age*12))*4;rect(x-w,y-3,w*2,6,'#e4c889');rect(x,y-3,2,7,'#718369');}
 function picnicReady(){return !ridesWet()&&snowCover()<.15;}
 function picnicInteraction(){return [{...picnicSite,action:picnic.phase==='gust'?'Спасти яблоко и салфетки':picnic.phase==='help'?'Собираем пикник…':picnic.phase==='happy'?'Пикник спасён · можно снять фото':'Помочь с пикником'}];}
 function startPicnic(){if(!picnicReady()||picnic.cooldown>0||momentsBusy())return false;picnic.phase='gust';picnic.time=0;announce('Ветер уносит пикник! E у столика — помочь.',{scope:'picnic',key:'picnic',ttl:18});return true;}
 function usePicnic(){
  if(!picnicReady()){speech='Пикник ждёт сухой погоды.';speechTime=4;return false;}
  if(picnic.phase==='idle'){if(picnic.cooldown>0){speech='Всё на месте. Теперь можно спокойно пить чай!';speechTime=4;return false;}return startPicnic();}
  if(picnic.phase!=='gust')return false;picnic.phase='help';picnic.time=0;speech='Яблоко поймано! Осталось прижать салфетки.';speechTime=3;return true;
 }
 function updateDiscoveries71(dt){
  if(trackedPlace===-3&&photoNav&&Math.hypot(player.x-photoNav.x,player.y-photoNav.y)<42){trackedPlace=-1;navCache=null;save();announce('Вот место вашего снимка. Можно поймать новый ракурс.');}
  picnic.cooldown=Math.max(0,picnic.cooldown-dt);const near=Math.hypot(player.x-picnicSite.x,player.y-picnicSite.y)<220;
  if(picnic.phase==='idle'){if(near&&picnic.cooldown===0&&picnicReady()&&!ambientSceneBusy()&&!momentsBusy()&&!notificationBusy())startPicnic();return;}
  if(!picnicReady()){picnic.phase='idle';picnic.time=0;picnic.cooldown=20;return;}
  picnic.time+=dt;
  if(picnic.phase==='help'&&picnic.time>=3){picnic.phase='happy';picnic.time=0;picnic.helps=Math.min(999,picnic.helps+1);completePinned('picnic');unlockAchievement('picnicRescue');speech='Спасибо! Без вас получился бы шведский стол для всего парка.';speechTime=5;window.ParkAudio?.reward?.();save();}
  if(picnic.phase==='gust'&&picnic.time>=18||picnic.phase==='happy'&&picnic.time>=10){picnic.phase='idle';picnic.time=0;picnic.cooldown=90;}
 }
 function drawPicnicCloth(){
  const p=picnicTables[2],x=p.tx*T,y=p.ty*T+17,active=picnic.phase==='gust',lift=active?(reduced?7:5+Math.sin(picnic.time*5)*4):0;
  rect(x+4,y+2,56,24,'#e6ddbd');for(let i=0;i<7;i++)rect(x+5+i*8,y+2,3,24,'#a0b4a1');rect(x+4,y+10,56,3,'#a0b4a1');
  ctx.fillStyle='#ece4c9';ctx.beginPath();ctx.moveTo(x+4,y+2);ctx.lineTo(x+20,y+2-lift);ctx.lineTo(x+26,y+16-lift);ctx.lineTo(x+4,y+18);ctx.closePath();ctx.fill();
  rect(x+37,y+8,15,9,'#aa8353');line(x+39,y+8,x+43,y+3,'#836845',2);line(x+43,y+3,x+49,y+8,'#836845',2);
 }
 function drawPicnic(){
  const p=picnicSite;if(Math.abs(p.x-player.x)>viewW+200||Math.abs(p.y-player.y)>viewH+200)return;drawSupporter({...p,quiet:picnic.phase!=='happy'});
  if(picnic.phase==='idle')return;
  const active=picnic.phase==='gust',u=active?unit(picnic.time/3):picnic.phase==='help'?1-unit(picnic.time/3):0,tx=picnicTables[2].tx*T+20,ty=picnicTables[2].ty*T+30;
  const ax=tx+(picnicApple.x-tx)*u,ay=ty+(picnicApple.y-ty)*u;
  if(active||picnic.phase==='help'){rect(ax-5,ay-8,10,9,'#c97865');rect(ax-3,ay-10,7,3,'#dc9876');rect(ax,ay-13,2,5,'#756344');rect(ax+2,ay-12,5,2,'#839568');}
  if(active){for(let i=0;i<(comfort.lightweight?3:6);i++){const t=reduced?.6:((picnic.time*.3+i*.17)%1),x=tx-15-t*100+i%2*20,y=ty-20-Math.sin(t*Math.PI)*45+i*3;ctx.save();ctx.translate(x,y);if(!reduced)ctx.rotate(t*3+i);rect(-4,-3,9,7,'#eee8d5');rect(-3,1,5,1,'#c6d2bf');ctx.restore();}mapLabel('Пикник улетает! E — помочь',p.x,p.y-62,12,2);}
  else if(picnic.phase==='happy')mapLabel('Пикник спасён! 📷',p.x,p.y-62,12,2);
 }
 function savedPhotoIds(){return photoTargets.filter(p=>photoShots[p.id]).map(p=>p.id);}
 async function showPhotoInViewer(id){
  const shot=photoShots[id],target=photoTargets.find(p=>p.id===id);if(!shot||!target)return false;
  photoViewerId=id;const revision=++photoViewerRevision,ids=savedPhotoIds(),img=$('photo-viewer-image');img.src=shot.image;img.alt='Ваш снимок «'+target.name+'»';$('photo-viewer-title').textContent=target.name;
  $('photo-viewer-meta').textContent=(ids.indexOf(id)+1)+' / '+ids.length+' · Снято на '+formatTime(shot.time)+(shot.width?' · '+shot.width+' × '+shot.height+' px':'');
  $('photo-viewer-status').textContent=shot.storageKey?'Загружаем оригинал…':'Старый снимок: доступна сохранённая копия.';
  $('photo-viewer-prev').disabled=$('photo-viewer-next').disabled=ids.length<2;
  const place=safePhotoPlace(shot.place);$('photo-viewer-return').disabled=!place||!canStand(place.x,place.y);$('photo-viewer-location').textContent=place?'Можно вернуться к месту съёмки. Личная отметка останется на карте.':'У этого старого снимка нет координат. Они сохраняются у новых кадров.';
  if(shot.storageKey){const original=await loadPhotoOriginal(shot.storageKey);if(revision!==photoViewerRevision||!$('photo-viewer').open)return false;if(original)img.src=original;$('photo-viewer-status').textContent=original?'Оригинал снимка':'Оригинал недоступен. Показана сохранённая копия.';}return true;
 }
 function openPhotoViewer(id){if(!photoShots[id])return false;clearInput();$('photo-viewer').showModal();showPhotoInViewer(id);$('photo-viewer-close').focus();return true;}
 function closePhotoViewer(){const id=photoViewerId;photoViewerRevision++;photoViewerId='';$('photo-viewer').close();clearInput();armInputGuard();if(journal.open)$('photo-open-'+id)?.focus();else canvas.focus();}
 function movePhotoViewer(delta){const ids=savedPhotoIds();if(!ids.length)return;showPhotoInViewer(ids[(ids.indexOf(photoViewerId)+delta+ids.length)%ids.length]);}
 function followPhoto(){const shot=photoShots[photoViewerId],p=safePhotoPlace(shot?.place),target=photoTargets.find(t=>t.id===photoViewerId);if(!p||!canStand(p.x,p.y))return false;photoNav={...p,name:target.name};trackedPlace=-3;trackedErrand=-1;pinnedActivity='';navCache=null;closePhotoViewer();closeJournal();save();announce('Путь к месту снимка «'+target.name+'». Личная отметка сохранена.');return true;}
 $('photo-viewer-close').onclick=closePhotoViewer;$('photo-viewer-prev').onclick=()=>movePhotoViewer(-1);$('photo-viewer-next').onclick=()=>movePhotoViewer(1);$('photo-viewer-return').onclick=followPhoto;
 $('photo-viewer').addEventListener('cancel',e=>{e.preventDefault();closePhotoViewer();});
 $('photo-viewer').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();e.stopPropagation();movePhotoViewer(e.key==='ArrowLeft'?-1:1);});
 $('photo-viewer-download').onclick=async()=>{const id=photoViewerId,b=$('photo-viewer-download');if(!id||b.disabled)return;b.disabled=true;try{await downloadPhoto(id);}catch{$('photo-viewer-status').textContent='Не удалось скачать снимок. Попробуйте ещё раз.';}finally{b.disabled=false;}};

 function restoreDiscoveries69(v={}){
  restoreDiscoveries70(v);
  const m=v.melody;melody={active:m?.active===true,index:Number.isInteger(m?.index)?Math.max(0,Math.min(3,m.index)):0,wins:Number.isInteger(m?.wins)?Math.max(0,Math.min(999,m.wins)):0};melodyDemo=null;
  const c=v.seekCat,stage=Number.isInteger(c?.stage)?Math.max(0,Math.min(3,c.stage)):0,state=stage===3?'done':c?.started===true?'hide':'invite',home=state==='hide'?catHides[stage]:seekCatHome;
  seekCat={...seekCatHome,...home,stage,state,path:[],repath:0,stride:0};catClueTime=0;catInviteTime=-100;catRubTime=0;
  const p=v.personalMarker;personalMarker=p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&inside(p.x/T,p.y/T)&&canStand(p.x,p.y)?{x:p.x,y:p.y,name:markerName(p.name)}:null;
  markerDraft=null;markerMode=false;$('melody-dialog').close();restoreDiscoveries71(v);
 }
 function musicChallengeSpot(){return {x:Math.max(musicTiles[0].x,Math.min(musicTiles[7].x,player.x)),y:musicTiles[0].y,kind:'melody',id:'path',name:'Повтори мелодию',action:melody.active?(melodyDemo?'Образец '+(Math.max(0,melodyDemo.beat)+1)+'/4 · плитка '+(melodyPatterns[melody.wins%melodyPatterns.length][Math.max(0,melodyDemo.beat)]+1):'Повтори '+melody.index+'/4 · переслушать'):'Сыграть «Повтори мелодию»'};}
 function openMelody(){
  clearInput();player.vx=player.vy=0;$('melody-status').textContent=(melody.active?'Уже повторено: '+melody.index+' / 4. ':'')+'Послушайте четыре ноты, затем наступите на те же плитки в том же порядке. Обходите ненужные плитки по краю аллеи. Время не ограничено. Номера и огоньки помогают играть без звука.';
  $('melody-play').textContent=melody.active?'Повторить образец с начала':'Послушать и начать';$('melody-play').disabled=!musicAvailable();$('melody-pause').hidden=!melody.active;
  if(!musicAvailable())$('melody-status').textContent+=' Сейчас плитки под снегом. Прогресс сохранён до оттепели.';
  $('melody-dialog').showModal();
 }
 function closeMelody(){$('melody-dialog').close();clearInput();canvas.focus();}
 function playMelody(){
  if(!musicAvailable())return false;if(birdEcho){birdEcho.time=-1;birdEcho.beat=-1;}melody.active=true;melody.index=0;melodyDemo={time:0,beat:-1};musicReplay=null;musicPulse.fill(0);closeMelody();save();announce('Смотрите на огоньки и номера: звучат четыре ноты.',{scope:'melody'});return true;
 }
 function stopMelody(){melody.active=false;melody.index=0;melodyDemo=null;save();closeMelody();announce('Мелодия подождёт. Можно просто гулять по плиткам.');}
 function acceptMelodyNote(note){
  if(!melody.active||melodyDemo)return;
  const sequence=melodyPatterns[melody.wins%melodyPatterns.length];
  if(note!==sequence[melody.index]){melody.index=0;speech='Это был джаз! Попробую ещё раз. E — переслушать.';speechTime=5;}
  else if(++melody.index===4){melody.active=false;melody.index=0;melody.wins=Math.min(999,melody.wins+1);queueBirdEcho(sequence);unlockAchievement('melodyEcho');speech='Получилось! Кажется, у мелодии появились пернатые слушатели.';speechTime=5;window.ParkAudio?.reward();}
  save();
 }
 function updateMelody(dt,eligible){
  if(!melodyDemo)return;
  if(!eligible||!musicAvailable()||Math.hypot(player.x-musicTiles[3].x,player.y-musicTiles[3].y)>340){melodyDemo=null;return;}
  melodyDemo.time+=dt;const beat=Math.floor(melodyDemo.time/.85);
  if(beat>=4){melodyDemo=null;announce('Ваш ход! Четыре плитки по памяти. E — переслушать.',{scope:'melody'});return;}
  if(beat!==melodyDemo.beat){melodyDemo.beat=beat;const note=melodyPatterns[melody.wins%melodyPatterns.length][beat];musicPulse.fill(0);musicPulse[note]=.75;window.ParkAudio?.pathNote?.(note);}
 }
 function seekCatTarget(){return seekCat.state==='invite'||seekCat.state==='done'?seekCatHome:catHides[seekCat.stage];}
 function catInteraction(){if(seekCat.state==='run'||seekCat.state==='rub')return [];return [...(seekCat.stage===3?[{...seekCat,kind:'catWalk',id:'catWalk',action:['follow','wait'].includes(catCompanion.phase)?'Отпустить Рыжика домой':'Позвать Рыжика на прогулку'}]:[]),{...seekCat,kind:'seekCat',id:'ryzhik',action:seekCat.state==='invite'?'Сыграть с Рыжиком в прятки':seekCat.state==='hide'?'Нашёл тебя, Рыжик!':'Погладить Рыжика'}];}
 function useSeekCat(){
  if(seekCat.state==='run'||seekCat.state==='rub')return;dandelionChase=null;
  if(seekCat.state==='invite'){seekCat.state='run';speech='Рыжик: «Мур? Давай в прятки!» Ищите хвост и следы рядом.';}
  else if(seekCat.state==='hide'){
   seekCat.stage++;if(seekCat.stage===3){seekCat.state='rub';catRubTime=0;completePinned('seekCat');unlockAchievement('catSeeker');speech='Три тайника раскрыты. Награда — персональный мурчальник!';window.ParkAudio?.reward();}
   else{seekCat.state='run';seekCat.path=[];seekCat.repath=0;speech=seekCat.stage===1?'Вижу хвост! Рыжик: «Ладно, теперь место посложнее».':'Нашёл! Рыжик: «Последняя попытка. Я почти невидим».';}
  }else{seekCat.state='rub';catRubTime=0;speech='Мур-р-р. Лучший сыщик парка вернулся!';}
  speechTime=5;catClueTime=0;save();
 }
 function updateSeekCat(dt){
  if(dandelionChase)return;
  if(seekCat.state==='done'&&updateCatCompanion(dt))return;
  const near=Math.hypot(player.x-seekCat.x,player.y-seekCat.y)<250;
  if(seekCat.state==='invite'&&near&&!ambientSceneBusy()&&!notificationBusy()&&elapsed-catInviteTime>80){catInviteTime=elapsed;window.ParkAudio?.catMeow?.(.45);announce('Рыжик выглядывает с северной лужайки. E рядом с котом — сыграть в прятки.');}
  if(seekCat.state==='run'){if(storyStep(seekCat,catHides[seekCat.stage],80,dt,false)){seekCat.state='hide';seekCat.path=[];save();}}
  else if(seekCat.state==='hide'&&near&&!melodyFocused()){catClueTime+=dt;if(catClueTime>=8){catClueTime=0;window.ParkAudio?.catMeow?.(.5);announce('Мяу… '+['Рыжий хвост торчит из травы у цветочного ящика.','Кто-то шуршит у низкой скамейки к югу от аллеи.','Следы ведут на запад, к корзинке под навесом.'][seekCat.stage],{scope:'cat',key:'cat-clue',ttl:12});}}
  else if(seekCat.state==='rub'){
   catRubTime+=dt;const angle=reduced?0:catRubTime*2,target={x:player.x+Math.cos(angle)*19,y:player.y+8+Math.sin(angle)*8};
   if(driving||cycling||funScene||!lifeClear(target.x,target.y)||Math.hypot(player.x-seekCat.x,player.y-seekCat.y)>180){seekCat.state='done';seekCat.path=[];}
   else{storyStep(seekCat,target,85,dt,false);if(catRubTime>=6){seekCat.state='done';seekCat.path=[];if(!catCompanion.invited)startCatWalk();save();}}
  }else if(seekCat.state==='done'&&Math.hypot(seekCat.x-seekCatHome.x,seekCat.y-seekCatHome.y)>4)storyStep(seekCat,seekCatHome,45,dt,false);
 }
 function drawSeekCat(){
  if(seekCat.x<camX-80||seekCat.x>camX+viewW+80||seekCat.y<camY-80||seekCat.y>camY+viewH+80)return;
  const x=seekCat.x,y=seekCat.y;drawCatButterfly();
  if(seekCat.state==='hide'){
   const wag=reduced?0:Math.sin(elapsed*3)*3,tip=seekCat.stage===0?36:seekCat.stage===1?25:18;line(x+17,y-5,x+26+wag,y-tip,'#d69a56',5);rect(x+24+wag,y-tip-3,5,7,'#f2c081');
   if(Math.hypot(player.x-x,player.y-y)<95)mapLabel('Мяу?..',x,y-42,12,2);
  }else{
   ctx.save();ctx.translate(0,seekCat.moving&&!reduced?Math.sin(seekCat.stride)*1.5:0);drawPet({...seekCat,kind:'cat',size:.65});ctx.restore();
   if(dandelionChase&&dandelionChase.time>2&&dandelionChase.time<4){line(x+10,y-7,x+18,y-17,'#d69a56',4);text('·',x+20,y-23,12,'#f8ebc8','center');}
   if(seekCat.state==='rub')text('♥',x,y-35,14,'#d99094','center');
   else if(seekCat.state==='invite'&&Math.hypot(player.x-x,player.y-y)<140)mapLabel('Рыжик · сыграем?',x,y-46,12,1);
  }
 }
 function drawCatHide(p){
  const {x,y,id}=p;
  if(id===0){rect(x-23,y-14,46,17,'#9a7853');rect(x-20,y-19,40,6,'#627f58');for(let i=0;i<5;i++){rect(x-17+i*8,y-28,3,11,'#527b4d');rect(x-19+i*8,y-29,7,4,i%2?'#edd18b':'#daa4ae');}}
  else if(id===1){rect(x-26,y-18,52,6,'#a2865c');rect(x-23,y-10,46,5,'#bd9d69');rect(x-21,y-5,4,11,'#6a7359');rect(x+17,y-5,4,11,'#6a7359');}
  else{rect(x-21,y-10,42,14,'#b39664');for(let i=0;i<5;i++)rect(x-18+i*8,y-9,2,11,'#d3ba8b');rect(x-25,y-27,50,6,'#7e9979');rect(x-23,y-22,3,25,'#6a785b');rect(x+20,y-22,3,25,'#6a785b');}
 }
 function drawCatClues(){
  if(!['hide','run'].includes(seekCat.state))return;
  const to=catHides[seekCat.stage],from=seekCat.stage?catHides[seekCat.stage-1]:seekCatHome;
  for(let i=1;i<=7;i++){const u=i/9,x=from.x+(to.x-from.x)*u+(i%2?3:-3),y=from.y+(to.y-from.y)*u;if(!canStand(x,y))continue;ctx.save();ctx.globalAlpha=.55;rect(x-2,y-1,4,3,'#6d7962');rect(x-3,y-4,2,2,'#6d7962');rect(x+1,y-4,2,2,'#6d7962');ctx.restore();}
 }
 function markerPick(p){
  const x=Math.round(p.x*W/900),y=Math.round(p.y*H/720);markerDraft=null;
  if(!inside(x/T,y/T)||!canStand(x,y)||(!findNavigationRoute({x,y}).length&&Math.hypot(player.x-x,player.y-y)>65)){$('marker-status').textContent='Здесь не пройти. Выберите свободную дорожку или поляну.';renderExplorerMap(true);return false;}
  markerDraft={x:Math.round(x),y:Math.round(y)};markerMode=false;markerEditing=false;$('marker-name').value=personalMarker?.name||'';renderExplorerMap(true);$('marker-status').textContent='Место выбрано. Сохранить личную отметку?';$('marker-name').focus();return true;
 }
 function saveMarker(){if(!markerDraft)return false;personalMarker={...markerDraft,name:markerName($('marker-name').value)};markerDraft=null;markerMode=false;markerEditing=false;trackedPlace=-2;trackedErrand=-1;pinnedActivity='';navCache=null;save();closeJournal();announce('Личная отметка сохранена. Золотая стрелка подскажет путь.');return true;}
 function followMarker(){if(!personalMarker)return;trackedPlace=-2;trackedErrand=-1;pinnedActivity='';navCache=null;save();closeJournal();}
 function removeMarker(){personalMarker=null;markerDraft=null;markerEditing=false;if(trackedPlace===-2)trackedPlace=-1;navCache=null;save();renderExplorerMap();$('marker-status').textContent='Личная отметка удалена.';}
 function renderMarkerControls(){
  $('marker-place').setAttribute('aria-pressed',String(markerMode));$('marker-place').textContent=markerMode?'Отменить выбор места':'＋ Своя отметка';
  $('marker-confirm').hidden=!markerDraft;$('marker-cancel').hidden=!markerDraft&&!markerEditing;$('marker-editor').hidden=!markerDraft&&!markerEditing;$('marker-save-name').hidden=!markerEditing;$('marker-edit').hidden=!personalMarker||markerEditing||!!markerDraft;$('marker-saved-name').textContent=personalMarker?'♥ '+personalMarker.name:'';$('marker-follow').hidden=!personalMarker;$('marker-remove').hidden=!personalMarker;
  $('marker-center').hidden=!markerMode;
 }
 function drawPersonalMarker(g,sx,sy){
  for(const [p,draft]of [[personalMarker,false],[markerDraft,true]]){if(!p)continue;const x=p.x*sx,y=p.y*sy;g.strokeStyle='#fff9e4';g.lineWidth=5;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-25);g.stroke();g.strokeStyle='#385f73';g.lineWidth=2;g.stroke();g.fillStyle=draft?'#acbdc5':'#567b94';g.fillRect(x,y-25,20,13);g.font='bold 13px sans-serif';g.fillStyle='#fffdf3';g.fillText('♥',x+10,y-14);if(!draft){const label=p.name.length>21?p.name.slice(0,20)+'…':p.name;g.font='bold 12px sans-serif';const width=Math.min(170,g.measureText(label).width+14),left=x>700?x-width-7:x+26;g.fillStyle='#f2f1df';g.fillRect(left,y-24,width,21);g.fillStyle='#284f46';g.textAlign='left';g.fillText(label,left+7,y-9,width-14);g.textAlign='center';}}
 }
 function updateDiscoveries69(dt){
  updateSeekCat(dt);
  if(trackedPlace===-2&&personalMarker&&Math.hypot(player.x-personalMarker.x,player.y-personalMarker.y)<42){trackedPlace=-1;navCache=null;announce('Вы на месте: '+personalMarker.name+'. Отметка останется на карте.');save();}
 }
 function puddleShape(x,y){const large=(x*37+y*61)%3===0;return {x:x*T+16,y:y*T+22,rx:large?30:13,ry:large?20:6};}
 function nearbyReflectivePuddles(){
  if(!puddleLevel()||driving||cycling||funScene||restingBench||wheelTime>0||swingTime>0||karaokeTime>0)return [];
  const result=[],tx=Math.floor(player.x/T),ty=Math.floor(player.y/T);
  for(let y=ty-1;y<=ty+1;y++)for(let x=tx-2;x<=tx+2;x++)if(x>=0&&y>=0&&x<COLS&&y<ROWS&&puddleTile(x,y)){const p=puddleShape(x,y);if(Math.abs(p.x-player.x)<p.rx+30&&p.y+p.ry>player.y&&p.y-p.ry<player.y+28)result.push(p);}
  return result;
 }
 function drawHeroReflection(){
  const puddles=nearbyReflectivePuddles();if(!puddles.length)return;
  if(!reflectionCanvas){reflectionCanvas=document.createElement('canvas');reflectionCanvas.width=112;reflectionCanvas.height=120;}
  const worldContext=ctx;ctx=reflectionCanvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,112,120);ctx.save();ctx.translate(56-player.x,100-player.y);reflectingHero=true;
  try{drawHero();}finally{ctx.restore();ctx=worldContext;reflectingHero=false;}
  const moving=!reduced&&Math.hypot(player.vx,player.vy)>15&&footInPuddle(),energy=puddles.reduce((v,p)=>Math.max(v,rippleStrength(p)),moving?1:0),strips=energy>0&&!comfort.lightweight?3:1;
  for(const p of puddles){ctx.save();ctx.beginPath();ctx.ellipse(p.x,p.y,p.rx,p.ry,0,0,Math.PI*2);ctx.clip();ctx.globalAlpha=puddleLevel()*.68;
   for(let i=0;i<strips;i++){ctx.save();if(strips>1){ctx.beginPath();ctx.rect(p.x-p.rx,p.y-p.ry+i*2*p.ry/strips,2*p.rx,2*p.ry/strips);ctx.clip();}const wave=energy*Math.sin(elapsed*12+i*2)*2;ctx.translate(player.x-56*.65+wave,player.y+2+24);ctx.scale(.65,-.24);ctx.drawImage(reflectionCanvas,0,0);ctx.restore();}
   if(moving){ctx.globalAlpha=puddleLevel()*.55;ctx.strokeStyle='#d4e1d8';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(player.x,player.y+3,8+(elapsed*15)%17,3+(elapsed*5)%6,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
  }
 }

 const rainWriting=[
  {...point([17,27]),lines:['Сборка успешна.','Можно гулять.']},
  {...point([71,57]),lines:['Даже облакам','нужен перерыв.']}
 ];
 let musicWalk={notes:[],plays:0},musicFoot=-1,musicPulse=Array(8).fill(0),musicReplay=null,musicHintAt=-100;
 let strollPlan=null,walkEvents=[],walkKnown=new Set(),storyClock=0,walkReplay=null;
 const moodNames={short:'Пять минут отвлечься',calm:'Спокойная прогулка',adventure:'Хочу приключений'};
 function restoreWalkDiscoveries(v={}){
  restoreDiscoveries69(v);
  const m=v.musicWalk;musicWalk={notes:Array.isArray(m?.notes)?[...new Set(m.notes.filter(n=>Number.isInteger(n)&&n>=0&&n<8))]:[],plays:Number.isInteger(m?.plays)?Math.max(0,Math.min(999,m.plays)):0};
  musicFoot=melody.active?musicTiles.findIndex(p=>Math.abs(v.x-p.x)<15&&Math.abs(v.y-p.y)<24):-1;musicPulse=Array(8).fill(0);musicReplay=null;musicHintAt=-100;storyClock=0;walkReplay=null;
  const p=v.strollPlan;strollPlan=p&&Object.hasOwn(moodNames,p.mood)&&Array.isArray(p.stops)&&p.stops.length===3&&new Set(p.stops).size===3&&p.stops.every(id=>strollOptions().some(q=>q.id===id))&&Number.isInteger(p.index)&&p.index>=0&&p.index<=3?{mood:p.mood,stops:[...p.stops],index:p.index,arrived:p.arrived===true}:null;
  walkEvents=cleanWalkEvents(v.walkEvents,v.elapsed||0);walkKnown=new Set(walkEvents.map(e=>e.id));
  for(const n of [1,5,10,15,20])if((v.solved?.length||0)>=n)walkKnown.add('quiz-'+n);
  if(v.errands?.[0]===3)walkKnown.add('ball');if(v.errands?.[1]===3)walkKnown.add('book');if(musicWalk.plays>0)walkKnown.add('musicPath');
  for(const id of ['wheel','fair-champion','photo'])if(v.achievements?.includes(id))walkKnown.add(id);
  if(v.rideVisits?.chess>0)walkKnown.add('chess');if(Object.keys(v.photoShots||{}).length)walkKnown.add('camera');if(v.bicycle?.riding)walkKnown.add('bike');
  $('walk-story').hidden=true;$('walk-story-image').hidden=true;$('walk-story-export-status').textContent='';
 }
 function rainWritingLevel(){const t=weatherTime();return snowCover()>.15?0:unit((t-30)/2)*unit((48-t)/8);}
 function musicAvailable(){return snowCover()<.2&&!snowing();}
 function updateWalkDiscoveries(dt){
  for(let i=0;i<8;i++)musicPulse[i]=Math.max(0,musicPulse[i]-dt);
  const eligible=!(birdEcho&&birdEcho.time>=0)&&!driving&&!cycling&&!funScene&&!feedScene&&!idleEscort&&!towScene&&!trafficStop&&!observing&&!restingBench&&wheelTime<=0&&swingTime<=0&&karaokeTime<=0&&pumpTime<=0;
  const tile=eligible&&musicAvailable()?musicTiles.findIndex(p=>Math.abs(player.x-p.x)<15&&Math.abs(player.y-p.y)<24):-1;
  if(tile>=0&&tile!==musicFoot){
    musicReplay=null;
   if(melody.active){if(!melodyDemo){musicPulse[tile]=.9;window.ParkAudio?.pathNote?.(tile);acceptMelodyNote(tile);}}else{musicPulse[tile]=.9;window.ParkAudio?.pathNote?.(tile);if(!musicWalk.notes.includes(tile)){musicWalk.notes.push(tile);save();}
   if(musicWalk.notes.length===8){musicWalk.notes=[];musicWalk.plays=Math.min(999,musicWalk.plays+1);musicReplay={time:-.55,beat:-1};completePinned('musicPath');unlockAchievement('musicPath');speech='Прогулка в мажоре. И ни одной фальшивой ноты!';speechTime=4;save();}}
  }
  musicFoot=tile;updateMelody(dt,eligible);
  if(!melody.active&&eligible&&Math.hypot(player.x-musicTiles[3].x,player.y-musicTiles[3].y)<190&&elapsed-musicHintAt>90){musicHintAt=elapsed;announce(musicAvailable()?'Музыкальная дорожка: пройдите по восьми плиткам — каждая звучит.':'Музыкальная дорожка отдыхает под снегом. Вернёмся весной.');}
  if(musicReplay){musicReplay.time+=dt;const beat=Math.floor(musicReplay.time/.32);if(beat>7||!eligible||!musicAvailable()||Math.hypot(player.x-musicTiles[3].x,player.y-musicTiles[3].y)>400)musicReplay=null;else if(beat>=0&&beat!==musicReplay.beat){musicReplay.beat=beat;musicPulse[beat]=.7;window.ParkAudio?.pathNote?.(beat,.65);}}
  if(storyClock<=dt&&strollPlan&&strollPlan.index<3&&!strollPlan.arrived){const stop=strollOptions().find(p=>p.id===strollPlan.stops[strollPlan.index]);if(stop&&Math.hypot(player.x-stop.target.x,player.y-stop.target.y)<65){strollPlan.arrived=true;announce('Остановка '+(strollPlan.index+1)+' / 3: '+stop.name+'. Осмотритесь. Следующая остановка — в журнале → Развлечения.');save();}}
  storyClock-=dt;if(storyClock<=0){storyClock=1;recordWalkEvents();}
 }
 function drawWalkDiscoveries(){
  const colors=['#bed0ad','#e3c68c','#a6c6bd','#d7b4ad','#bfc2d6','#d1cf9e','#abd0c5','#dfbc94'];
  if(musicTiles[7].x>camX-30&&musicTiles[0].x<camX+viewW+30&&musicTiles[0].y>camY-65&&musicTiles[0].y<camY+viewH+65){
   const available=musicAvailable();for(const p of musicTiles){const lit=musicPulse[p.note]>0;rect(p.x-15,p.y-24,30,48,available?colors[p.note]:'#ccd4c9');rect(p.x-12,p.y-21,24,42,available?(lit?'#f8e8b0':colors[p.note]):'#e0e5da');line(p.x-12,p.y+20,p.x+12,p.y+20,'#617b69',2);text(String(p.note+1),p.x,p.y+5,12,'#35564d','center');rect(p.x-4,p.y-33,8,5,lit?'#f3d784':'#728872');
    if(lit&&nightLevel()>.1){ctx.save();ctx.globalAlpha=(reduced?.3:Math.min(.5,musicPulse[p.note]))*nightLevel();rect(p.x-12,p.y-38,24,15,'#f4de9c');ctx.restore();}
   }if(!ambientSceneBusy()&&!melody.active&&!capturingPhoto&&Math.hypot(player.x-musicTiles[3].x,player.y-musicTiles[3].y)<240)mapLabel(melody.active?(melodyDemo?'Слушаем · плитка '+(melodyPatterns[melody.wins%melodyPatterns.length][Math.max(0,melodyDemo.beat)]+1):'Повтори мелодию · '+melody.index+'/4 · E — образец'):'Музыкальная дорожка · '+musicWalk.notes.length+'/8',musicTiles[3].x+16,musicTiles[0].y-58,12,1);
  }
  const wet=rainWritingLevel();if(wet<=.02)return;for(const p of rainWriting){if(p.x<camX-140||p.x>camX+viewW+140||p.y<camY-40||p.y>camY+viewH+40)continue;ctx.save();ctx.globalAlpha=wet;rect(p.x-113,p.y-25,226,51,'#d8ca9e');ctx.strokeStyle='#66816b';ctx.lineWidth=2;ctx.strokeRect(p.x-110,p.y-22,220,45);p.lines.forEach((s,i)=>text(s,p.x,p.y-3+i*18,14,'#345b58','center'));ctx.restore();}
 }
 function strollOptions(){
  return [
   {id:'musicPath',name:'Музыкальная дорожка',target:musicTiles[0],place:musicPathPlace,tags:['short','calm','adventure'],done:musicWalk.plays>0,open:musicAvailable(),hint:'Пройдите по восьми звучащим плиткам.'},
   {id:'rainWords',name:'Дождевое послание',target:rainWriting[0],place:rainWritingPlaces[0],tags:['short','calm','adventure'],done:!!photoShots.rainWords,open:rainWritingLevel()>.2,hint:'Надпись проявляется на мокрой аллее. Можно сфотографировать.'},
   ...leisurePassport.filter(p=>!p.achievement?.startsWith('fair-')).map(p=>({id:'place-'+p.place,name:p.name,target:p.target,place:p.place,tags:p.key==='gazebo'||p.ride==='chess'?['short','calm']:['short','adventure'],done:leisureCount(p)>0,open:!(p.ride==='chess'&&leisureCount(p)>=3)&&!(p.key&&leisureCount(p)>=repeatRules[p.key].max)&&!(ridesWet()&&(p.ride||['wheel','swing','carousel','trampoline'].includes(p.key)))&&!(p.key==='telescope'&&nightLevel()<.3),hint:p.ride==='chess'?'Пятиминутная стратегия за пять секунд.':'Небольшая остановка для нового впечатления.'})),
   {id:'artist',name:'Портрет на память',target:artistSite,place:artistPlace,tags:['short','calm'],done:Object.keys(portraits).length>0,open:!ridesWet(),hint:'Художнику нужно восемь секунд.'},
   {id:'stoneSkip',name:'Камешки на пруду',target:stoneSite,place:stonePlace,tags:['short','calm'],done:visitedPlaces.has(stonePlace),open:!ridesWet(),hint:'Пять отскоков по воде.'},
   {id:'fair-rings',name:'Кольцеброс',target:fairSites[3],place:fairPlaces[3],tags:['adventure'],done:(fairStats.rings?.best||0)>=4,open:!ridesWet(),hint:'Семь бросков. Можно выбрать спокойный темп.'},
   {id:'fountain',name:'Фонтан',target:mapPlaces[2],place:2,tags:['short','calm','adventure'],done:visitedPlaces.has(2),open:true,hint:'Послушайте воду и немного передохните.'},
   {id:'bear',name:'Лесной дуэт',target:bearSite,place:bearPlace,tags:['short','calm','adventure'],done:bearConcerts>0,open:bearCooldown<=0,hint:'Медведь с балалайкой и белка с ореховым барабаном. Концерт восемь секунд.'},
   {id:'west',name:'Западная аллея',target:mapPlaces[6],place:6,tags:['short','calm','adventure'],done:visitedPlaces.has(6),open:true,hint:'Тихая часть парка для прогулки.'}
  ];
 }
 function makeStroll(mood){
  if(!Object.hasOwn(moodNames,mood))return false;let choices=strollOptions().filter(p=>p.open&&p.tags.includes(mood)),from=player;const stops=[];
  for(let i=0;i<3&&choices.length;i++){choices.sort((a,b)=>(Math.hypot(a.target.x-from.x,a.target.y-from.y)+(a.done?mood==='short'?350:900:0))-(Math.hypot(b.target.x-from.x,b.target.y-from.y)+(b.done?mood==='short'?350:900:0)));const p=choices.shift();stops.push(p.id);from=p.target;}
  if(stops.length!==3)return false;if(strollPlan){const old=strollOptions().find(p=>p.id===strollPlan.stops[strollPlan.index]);if(old&&trackedPlace===old.place){trackedPlace=-1;navCache=null;}}strollPlan={mood,stops,index:0,arrived:false};save();renderStroll();return true;
 }
 function followStroll(){
  if(!strollPlan||strollPlan.index>=3)return false;const p=strollOptions().find(p=>p.id===strollPlan.stops[strollPlan.index]);if(!p)return false;
  if(!p.open){$('stroll-status').textContent='Сейчас это занятие отдыхает из-за погоды или времени суток. Пропустите остановку или соберите новый маршрут.';return false;}
  pinnedActivity='';trackedPlace=p.place;trackedErrand=-1;navCache=null;save();closeJournal();updateGoalCard();return true;
 }
 function nextStroll(){if(!strollPlan||strollPlan.index>=3)return;const old=strollOptions().find(p=>p.id===strollPlan.stops[strollPlan.index]);if(old&&trackedPlace===old.place){trackedPlace=-1;navCache=null;}strollPlan.index++;strollPlan.arrived=false;save();renderStroll();}
 function stopStroll(){if(strollPlan){const p=strollOptions().find(p=>p.id===strollPlan.stops[strollPlan.index]);if(p&&trackedPlace===p.place){trackedPlace=-1;navCache=null;}}strollPlan=null;save();renderStroll();}
 function renderStroll(){
  $('stroll-list').replaceChildren();$('stroll-active').hidden=!strollPlan;
  $('stroll-status').textContent=strollPlan?(strollPlan.index===3?'Три остановки позади! Можно выбрать другое настроение.':moodNames[strollPlan.mood]+' · остановка '+(strollPlan.index+1)+' / 3'+(strollPlan.arrived?' · Вы на месте.':'')+' Время примерное, спешить не нужно.'):'Три необязательные остановки с учётом погоды и ваших посещений. Выберите настроение.';
  if(!strollPlan)return;const options=strollOptions();strollPlan.stops.forEach((id,i)=>{const p=options.find(q=>q.id===id);if(!p)return;const li=document.createElement('li'),strong=document.createElement('strong'),hint=document.createElement('p');strong.textContent=(i<strollPlan.index?'✓ ':i===strollPlan.index?'→ ':'')+p.name;hint.textContent=p.hint+(p.open?'':' Сейчас недоступно: погода или время суток.');li.append(strong,hint);$('stroll-list').append(li);});
  $('stroll-follow').hidden=strollPlan.index>=3||strollPlan.arrived;$('stroll-next').hidden=strollPlan.index>=3;$('stroll-next').textContent=strollPlan.arrived?'Следующая остановка →':'Пропустить остановку';
 }
 function cleanWalkEvents(events,maxTime){return Array.isArray(events)?events.filter(e=>e&&typeof e.id==='string'&&/^[a-zA-Z0-9-]{1,60}$/.test(e.id)&&typeof e.name==='string'&&e.name.length<=90&&Number.isFinite(e.time)&&e.time>=0&&e.time<=maxTime&&Number.isFinite(e.x)&&e.x>=0&&e.x<=W&&Number.isFinite(e.y)&&e.y>=0&&e.y<=H).slice(0,32).map(e=>({id:e.id,name:e.name,time:e.time,x:e.x,y:e.y})):[];}
 function noteWalkEvent(id,name,p=player){if(finished||walkKnown.has(id)||walkEvents.length>=31)return;walkKnown.add(id);walkEvents.push({id,name,time:id==='start'?0:elapsed,x:p.x,y:p.y});}
 function recordWalkEvents(){
  if(finished)return;noteWalkEvent('start','Начало прогулки',spawn);
  for(const n of [1,5,10,15,20])if(solved.size>=n)noteWalkEvent('quiz-'+n,'Ответов найдено: '+n);
  if(errandStates[0]===3)noteWalkEvent('ball','Мяч вернулся к другу',errands[0].receiver);if(errandStates[1]===3)noteWalkEvent('book','Книга нашла хозяйку',errands[1].giver);
  if(rainIntensity()>.2)noteWalkEvent('rain','Первый дождь');if(nightLevel()>.5)noteWalkEvent('evening','Вечерние огоньки');
  if(snowIntensity()>.2)noteWalkEvent('snow','Первый снег');if(musicWalk.plays>0)noteWalkEvent('musicPath','Прогулка в мажоре',musicTiles[3]);
  for(const [id,name,p]of [['wheel','Парк с высоты',wheel],['fair-champion','Чемпион ярмарки',fairSites[0]],['photo','Фото на память',photoSpot]])if(achievements.has(id))noteWalkEvent(id,name,p);
  if((rideVisits.chess||0)>0)noteWalkEvent('chess','Победа в шахматы',parkRides.find(p=>p.id==='chess'));if(Object.keys(photoShots).length)noteWalkEvent('camera','Первый удачный кадр');if(cycling)noteWalkEvent('bike','Ветер в спицах');
 }
 function freezeWalkStory(){recordWalkEvents();const events=[...walkEvents.filter(e=>!e.id.startsWith('quiz-')||e.id==='quiz-20'),{id:'finish',name:'Квест пройден!',time:elapsed,x:exit.x,y:exit.y}];return events.length<=7?events:Array.from({length:7},(_,i)=>events[Math.round(i*(events.length-1)/6)]);}
 function storyEvents(){const valid=cleanWalkEvents(finalResult?.story,finalResult?.elapsed||0);return valid.length?valid:[{id:'finish',name:'Квест пройден!',time:finalResult?.elapsed||elapsed,x:exit.x,y:exit.y}];}
 function startWalkReplay(focus=true){if(!finalResult||!win.open)return false;$('walk-story').hidden=false;walkReplay={time:reduced?10:0,playing:!reduced,index:-1};updateWalkReplay(0);if(focus){$('walk-story-title').focus();$('walk-story').scrollIntoView?.({block:'start'});}return true;}
 function updateWalkReplay(dt){
  if(!walkReplay||!win.open)return;const s=walkReplay;if(s.playing&&!document.hidden&&!$('farewell').open&&!$('quiz-review').open)s.time=Math.min(10,s.time+dt);if(s.time>=10)s.playing=false;
  const events=storyEvents(),i=Math.min(events.length-1,Math.round(s.time/10*(events.length-1)));if(i!==s.index){s.index=i;$('walk-story-caption').textContent=formatTime(events[i].time)+' · '+events[i].name;}
  $('walk-story-play').textContent=s.time>=10?'Посмотреть ещё раз':s.playing?'Пауза':'Продолжить';$('walk-story-skip').hidden=s.time>=10;drawWalkStory($('walk-story-canvas'),s.time/10,false);
 }
 function drawWalkStory(c,progress,postcard=false){
  const g=c.getContext('2d');if(!g)return;const w=c.width,h=c.height;g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle='#eef1e4';g.fillRect(0,0,w,h);
  const pad=w*.07,top=postcard?240:h*.06,mw=postcard?960:w-pad*2,mh=postcard?820:h*.83,s=Math.min(mw/W,mh/H),ox=postcard?80:(w-W*s)/2,oy=top;
  g.fillStyle='#aac091';g.fillRect(ox,oy,W*s,H*s);g.strokeStyle='#e8d2a1';g.lineWidth=Math.max(2,w/260);for(const [a,b]of roads){g.beginPath();g.moveTo(ox+a[0]*T*s,oy+a[1]*T*s);g.lineTo(ox+b[0]*T*s,oy+b[1]*T*s);g.stroke();}
  const events=storyEvents(),count=events.length,advance=unit(progress)*(count-1),full=Math.floor(advance),u=advance-full;
  const dot=(p,r,color)=>{g.beginPath();g.arc(ox+p.x*s,oy+p.y*s,r,0,Math.PI*2);g.fillStyle=color;g.fill();};
  // Dotted links connect memories, not a fabricated GPS route.
  g.strokeStyle='#476b5b';g.lineWidth=Math.max(2,w/400);g.setLineDash([w/140,w/100]);g.beginPath();events.forEach((p,i)=>i?g.lineTo(ox+p.x*s,oy+p.y*s):g.moveTo(ox+p.x*s,oy+p.y*s));g.stroke();g.setLineDash([]);
  const pins=[],radius=postcard?19:w*.015;events.forEach((p,i)=>{const x=ox+p.x*s,y=oy+p.y*s;let px=x,py=y;for(let attempt=0;attempt<32&&pins.some(q=>Math.hypot(q.x-px,q.y-py)<radius*2.6);attempt++){const angle=attempt*Math.PI/4,r=radius*(3+Math.floor(attempt/8)*2);px=x+Math.cos(angle)*r;py=y+Math.sin(angle)*r;}pins.push({x:px,y:py});if(px!==x||py!==y){g.strokeStyle='#628573';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(px,py);g.stroke();}g.beginPath();g.arc(px,py,radius,0,Math.PI*2);g.fillStyle=i<=full?'#f4d586':'#e7ecdf';g.fill();g.fillStyle='#234c42';g.font='bold '+Math.round(postcard?24:w*.022)+'px sans-serif';g.textAlign='center';g.fillText(String(i+1),px,py+(postcard?8:w*.008));});
  const a=events[full],b=events[Math.min(count-1,full+1)];dot({x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u},w*.005,'#bd665b');
  if(postcard){g.textAlign='center';g.fillStyle='#294e43';g.font='bold 62px sans-serif';g.fillText('Моя прогулка в парке',w/2,95);g.font='30px sans-serif';g.fillText('DEX · 20 лет вместе · '+formatTime(finalResult.elapsed),w/2,151);g.textAlign='left';events.forEach((p,i)=>{const y=280+i*112;g.fillStyle='#78916d';g.font='26px sans-serif';g.fillText(String(i+1).padStart(2,'0')+'  /  '+formatTime(p.time),1110,y);g.fillStyle='#294e43';g.font='bold 31px sans-serif';g.fillText(p.name,1110,y+43,720);});g.textAlign='center';g.font='30px sans-serif';g.fillStyle='#617c67';g.fillText('Маленькие открытия. Хорошие воспоминания.',w/2,1190);}
  g.restore();
 }
 function downloadWalkStory(){if(!finalResult)return false;try{const c=document.createElement('canvas');c.width=1920;c.height=1280;drawWalkStory(c,1,true);const url=c.toDataURL('image/png');$('walk-story-image').src=url;$('walk-story-image').hidden=false;const a=document.createElement('a');a.href=url;a.download='DEX-история-прогулки-1920x1280.png';document.body.append(a);a.click();a.remove();$('walk-story-export-status').textContent='Открытка 1920 × 1280 готова. На телефоне можно удержать изображение ниже.';return true;}catch{$('walk-story-export-status').textContent='Не удалось подготовить открытку. Попробуйте ещё раз.';return false;}}

 // Optional moments use game time, so dialogs and background pause freeze them too.
 const photoTargets=[{id:'bearDuet',bonus:true,name:'Лесной дуэт',short:'Медведь и белка',icon:'♫',hint:'На поляне южнее ярмарки послушайте медведя с балалайкой. Снимите его вместе с белкой во время концерта или в течение 15 секунд после. P / 📷 остановит время для кадра.'},{id:'kite',bonus:true,name:'Выше забот',short:'Воздушный змей',icon:'◇',hint:'Запустите змея на поляне у беседки. Когда он поднимется, откройте P / 📷 и снимите его целиком. Вечером на хвосте загораются огоньки.'},{id:'picnic',bonus:true,name:'Пикник с ветерком',short:'Пикник',icon:'🍎',hint:'У юго-восточных столиков помогите спасти пикник. Снимите летящие салфетки или благодарного хозяина.'},
  {id:'birdEcho',bonus:true,name:'Парк подпевает',short:'Пернатое эхо',icon:'♫',hint:'Повторите четыре ноты на северной музыкальной дорожке. После победы три птицы сядут на ограду и ответят той же мелодией. Снимите всех троих. Если пошёл дождь, они дождутся сухой погоды.'},
  {id:'rainWords',bonus:true,name:'Послание облаков',short:'Дождевое послание',icon:'☂',hint:'Во время дождя и сразу после него на западной и юго-восточной аллеях проявляются надписи. Снимите любую целиком. Места отмечены в журнале.'},
  {id:'groupPhoto',bonus:true,name:'Вся компания в сборе',short:'Общий снимок',icon:'📷',hint:'У фотозоны DEX позовите друзей через камеру на штативе. Они подойдут, а гусь успеет в последний момент. После отсчёта снимок откроется для скачивания.'},
  {id:'hoodCat',bonus:true,name:'Тёплое место',short:'Кошка на капоте',icon:'🐾',hint:'Прокатитесь на BMW и припаркуйтесь у парковки. Выйдите и подождите кошку. Снимите её на капоте.'},
  {id:'hedgehog',bonus:true,name:'Хозяин листьев',short:'Ёжик',icon:'🦔',hint:'В сухой вечер загляните к домику ёжика на западе. Подойдите тихо и снимите его с листочком.'},
  {id:'aurora',bonus:true,name:'Парк за полярным кругом',short:'Сияние',icon:'✧',hint:'После минутной метели, около 16:00, наступают короткие зимние сумерки с сиянием. Длится 24 секунды; можно снять из любой точки парка.'},
  {id:'dawnFlock',bonus:true,name:'На крыльях рассвета',short:'Рассветная стая',icon:'⌁',hint:'В конце вечера, около 04:54 каждого пятиминутного круга, птицы поднимаются над парком. В сухую погоду без снега снимите стаю: в кадре должно быть хотя бы пять птиц.'},
  {id:'soapShow',bonus:true,name:'Радужная невесомость',short:'Большой пузырь',icon:'◯',hint:'На поляне юго-восточнее старта попросите посетителя пустить большой пузырь. Снимите его целиком в сухую погоду. Кошка иногда тоже приходит посмотреть.'},
  {id:'parkHeart',bonus:true,name:'Сердце парка',short:'Сердце парка',icon:'♡',hint:'В сухой вечер после 04:00 посетите северную поляну светлячков. Снимите сердце с DEX, пока оно светится. Место отмечено на карте.'},
  {id:'firstSnow',bonus:true,name:'Первый снег',short:'Первый снег',icon:'❄',hint:'Во время минутного снегопада нажмите фотоаппарат. Первый снег начинается на 15:00 активной прогулки.'},
  {id:'snowColleague',bonus:true,name:'Снежный коллега',short:'Снеговик',icon:'☃',hint:'Соберите снеговика DEX южнее старта и снимите его целиком до весеннего таяния.'},
  {id:'goldenAlley',bonus:true,name:'Золотая аллея',short:'Золотая аллея',icon:'🍂',hint:'Осенью подойдите к жёлтым деревьям. В кадре должны оказаться хотя бы две кроны рядом с вами.'},
  {id:'dawnPond',bonus:true,name:'Туман над водой',short:'Туман',icon:'≋',hint:'После вечера, около 05:00 каждого пятиминутного круга, подойдите к пруду в центре. Успейте снять утренний туман.'},
  {id:'swifts',name:'Низкий полёт',short:'Стрижи',hint:'За пять секунд до дождя низко пролетают стрижи. Снимите их, пока они видны на экране.'},
  {id:'rainbow',name:'После дождя',short:'Радуга',hint:'После дневного дождя на несколько секунд появится радуга. В этот момент нажмите фотоаппарат.'},
  {id:'cat',name:'Хвостатая модель',short:'Кошка',icon:'🐾',hint:'Найдите кошку, подойдите поближе и снимите её. Можно сначала погладить кошку или подождать, пока она сама подойдёт.'},
  {id:'fountain',name:'Брызги на солнце',short:'Фонтан',icon:'⛲',hint:'Подойдите к фонтану в центре парка днём, когда нет дождя. Пусть фонтан попадёт в кадр.'},
  {id:'wheel',name:'Колесо воспоминаний',short:'Колесо',icon:'🎡',hint:'Подойдите к большому колесу обозрения с южной стороны, чтобы его кабинки были видны в кадре.'},
  {id:'fireflies',name:'Живые огоньки',short:'Светлячки',icon:'✦',hint:'В сухой вечер подойдите к светлячкам: например, у старта или на поляне рядом с беседкой.'},
  {id:'boat',name:'Бумажный капитан',short:'Кораблик',icon:'⛵',hint:'Во время дождя запустите бумажный кораблик южнее старта. Сфотографируйте его, пока он плывёт рядом.'},
  {id:'wheelLights',bonus:true,name:'Колесо света',short:'Шоу колеса',icon:'🎡',hint:'В сухой вечер подойдите к большому колесу с юга. Снимите его во время 18-секундного светового шоу. После финиша шоу можно вызвать из пульта парка.'},
  {id:'fountainShow',bonus:true,name:'Музыка воды',short:'Шоу фонтана',icon:'♫',hint:'В сухой вечер подойдите к центральному фонтану. Представление длится 12 секунд и запускается один раз за вечер. Снимите подсвеченные струи.'},
  {id:'meteors',name:'Загадай желание',short:'Звездопад',icon:'☄',hint:'Под конец вечера, примерно на 04:46 каждого пятиминутного круга, в небе появятся падающие звёзды. Успейте снять их — зрелище длится около двенадцати секунд.'}
 ];
 let photoShots={},photoCooldown=0,photoFlash=0,capturingPhoto=false;
 const PHOTO_EDGE=1920,photoOriginals=new Map();let photoDBPromise=null;
 const boatLaunch={...point([26,51]),kind:'paperBoat',action:'Запустить кораблик'};
 const streamStart=point([27,51]),streamEnd=point([27,56]),BOAT_SECONDS=5;
 let paperVoyage=null,boatLastCycle=-1,boatWins=0;
 const fireflyHomes=[[22,54],[31,46],[70,37],[79,57],[20,25],[55,19]].flatMap(([tx,ty],group)=>Array.from({length:5},(_,i)=>{const a=i*2.4+group,r=24+i*7;return {hx:(tx+.5)*T+Math.cos(a)*r,hy:(ty+.5)*T+Math.sin(a)*r,dx:0,dy:0,seed:group*5+i};}));
 function restoreMoments(v={}){photoOriginals.clear();photoShots={};for(const p of photoTargets){const shot=v.photoShots?.[p.id];if(shot&&Number.isFinite(shot.time)&&shot.time>=0&&shot.time<=1e8&&typeof shot.image==='string'&&shot.image.length<=200000&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(shot.image))photoShots[p.id]={time:shot.time,image:shot.image,place:safePhotoPlace(shot.place),width:Number.isInteger(shot.width)&&shot.width>0&&shot.width<=PHOTO_EDGE?shot.width:0,height:Number.isInteger(shot.height)&&shot.height>0&&shot.height<=PHOTO_EDGE?shot.height:0,storageKey:typeof shot.storageKey==='string'&&/^[a-z0-9-]{1,100}$/.test(shot.storageKey)?shot.storageKey:null};}photoCooldown=photoFlash=0;capturingPhoto=false;boatWins=Number.isInteger(v.boat?.wins)?Math.max(0,Math.min(999,v.boat.wins)):0;boatLastCycle=v.weatherVersion===2&&Number.isInteger(v.boat?.lastCycle)?Math.max(-1,Math.min(1e6,v.boat.lastCycle)):-1;paperVoyage=null;const trip=v.boat?.trip,age=weatherTime(v.elapsed||0),cycle=rainEventIndex(v.elapsed||0);if(v.weatherVersion===2&&trip&&Number.isFinite(trip.time)&&trip.time>=0&&trip.time<BOAT_SECONDS&&trip.cycle===cycle&&boatLastCycle===cycle&&age>=30&&age<45&&weatherTime((v.elapsed||0)-trip.time)>=30&&weatherTime((v.elapsed||0)-trip.time)<=39)paperVoyage={time:trip.time,cycle};for(const f of fireflyHomes)f.dx=f.dy=0;}
 function momentsBusy(){return !!idleEscort||blocked()||driving||cycling||!!funScene||!!feedScene||!!towScene||!!trafficStop||wheelTime>0||swingTime>0||karaokeTime>0||pumpTime>0;}
 function photoVisible(x,y){return x>camX+22&&x<camX+viewW-22&&y>camY+22&&y<camY+viewH-22;}

 function photoCandidates(){
  const found=[];if(bearPhotoReady()&&Math.hypot(player.x-bearSite.x,player.y-bearSite.y)<240&&photoVisible(bearSite.x-48,bearSite.y-76)&&photoVisible(bearSite.x+72,bearSite.y+20))found.push('bearDuet');const kite=kitePose();if(kite&&kite.progress>.75&&photoVisible(kite.x-24,kite.y-27)&&photoVisible(kite.x+32,kite.y+84))found.push('kite');if(picnic.phase!=='idle'&&(picnic.phase!=='gust'||picnic.time>=2)&&Math.hypot(player.x-picnicSite.x,player.y-picnicSite.y)<220&&photoVisible(picnicSite.x-15,picnicSite.y-48)&&photoVisible(picnicTables[2].tx*T+64,picnicTables[2].ty*T+55))found.push('picnic');if(birdEcho&&birdEcho.time>=1.5&&birdEcho.time<11&&echoBirdPoses().every(p=>photoVisible(p.x-12,p.y-14)&&photoVisible(p.x+14,p.y+4)))found.push('birdEcho');if(rainWritingLevel()>.25&&rainWriting.some(p=>Math.hypot(player.x-p.x,player.y-p.y)<260&&photoVisible(p.x-115,p.y-26)&&photoVisible(p.x+115,p.y+28)))found.push('rainWords');if(soapBubbles.some(b=>b.big&&b.age>1&&b.age<b.life-.5&&Math.hypot(b.x-player.x,b.y-player.y)<330&&photoVisible(b.x-b.r,b.y-b.r)&&photoVisible(b.x+b.r,b.y+b.r)))found.push('soapShow');if(fireflyDance&&fireflyDance.time>=3&&fireflyDance.time<9&&Math.hypot(player.x-heartSite.x,player.y-heartSite.y)<280&&photoVisible(heartSite.x,heartSite.y-72))found.push('parkHeart');if(swiftBirds().some(p=>photoVisible(p.x,p.y-14)))found.push('swifts');if(afterRain()*(1-nightLevel())>.2)found.push('rainbow');
  if([...pets.filter(p=>p.kind==='cat'),...wanderers.filter(p=>p.kind==='cat'&&!p.sheltered),...(seekCat.state!=='hide'?[seekCat]:[])].some(p=>Math.hypot(p.x-player.x,p.y-player.y)<150&&photoVisible(p.x,p.y-15)&&clearSegment(player,p)))found.push('cat');
  if(nightLevel()<.2&&rainIntensity()<.1&&Math.hypot(player.x-(42.5*T),player.y-(28.5*T))<225&&photoVisible(42.5*T,28.5*T-25))found.push('fountain');
  if(Math.hypot(player.x-wheel.x,player.y-wheel.y)<270&&photoVisible(wheel.x,wheel.y-135))found.push('wheel');
  if(nightLevel()>.4&&rainIntensity()<.2&&fireflyHomes.some(f=>Math.hypot(player.x-f.hx,player.y-f.hy)<160&&photoVisible(f.hx+f.dx,f.hy+f.dy-20)))found.push('fireflies');
  if(paperVoyage){const p=streamPoint(Math.min(1,paperVoyage.time/BOAT_SECONDS));if(Math.hypot(p.x-player.x,p.y-player.y)<150&&photoVisible(p.x,p.y))found.push('boat');}
  if(fountainShowLevel()>.1&&Math.hypot(player.x-42.5*T,player.y-28.5*T)<260&&photoVisible(42.5*T,28.5*T-25))found.unshift('fountainShow');
  if(wheelShowLevel()>.2&&Math.hypot(player.x-wheel.x,player.y-wheel.y)<270&&photoVisible(wheel.x,wheel.y-116))found.unshift('wheelLights');
  if(meteorStreaks().length)found.unshift('meteors');
  if(snowman.built&&snowCover()>.3&&Math.hypot(player.x-snowmanSite.x,player.y-snowmanSite.y)<200&&photoVisible(snowmanSite.x,snowmanSite.y-55))found.unshift('snowColleague');
  if(seasonState().id==='autumn'&&seasonState().autumn>.5&&trees.filter(t=>Math.hypot((t.tx+.5)*T-player.x,(t.ty+.5)*T-player.y)<260&&photoVisible((t.tx+.5)*T,t.ty*T-25)).length>=2)found.unshift('goldenAlley');
  if(dawnMistLevel()>.2&&Math.hypot(player.x-37.5*T,player.y-35.5*T)<220&&photoVisible(37.5*T,35*T))found.unshift('dawnPond');
  if(dawnFlock&&elapsed-dawnFlock.start>1&&elapsed-dawnFlock.start<10.5&&dawnFlockBirds().filter(b=>photoVisible(b.x,b.y)).length>=5)found.unshift('dawnFlock');if(snowIntensity()>.2)found.unshift('firstSnow');if(hoodCat.state==='sleep'&&photoVisible(hoodCat.x,hoodCat.y-12)&&Math.hypot(player.x-hoodCat.x,player.y-hoodCat.y)<180)found.unshift('hoodCat');if(hedgehog.carry&&!hedgehog.curl&&nightLevel()>.12&&snowCover()<.2&&!ridesWet()&&photoVisible(hedgehog.x,hedgehog.y-9))found.unshift('hedgehog');if(auroraLevel()>.25)found.unshift('aurora');if(groupPhoto?.phase==='pose'&&groupPhoto.cast.every(n=>photoVisible(n.x-15,n.y-48)&&photoVisible(n.x+15,n.y+8)))found.unshift('groupPhoto');return found;
 }
 function nextPhotoTarget(){const ids=photoCandidates();if(bearPhotoReady()&&ids.includes('bearDuet'))return photoTargets.find(p=>p.id==='bearDuet');if(funScene?.kind==='kite'&&ids.includes('kite'))return photoTargets.find(p=>p.id==='kite');if(groupPhoto?.phase==='pose'&&ids.includes('groupPhoto'))return photoTargets.find(p=>p.id==='groupPhoto');const id=ids.find(id=>!photoShots[id])||ids[0];return photoTargets.find(p=>p.id===id)||null;}

 function photoExportSize(width,height){const ratio=PHOTO_EDGE/Math.max(width,height);return {width:Math.max(1,Math.round(width*ratio)),height:Math.max(1,Math.round(height*ratio))};}
 function openPhotoDB(){
  if(typeof indexedDB==='undefined')return Promise.resolve(null);
  if(!photoDBPromise)photoDBPromise=new Promise(resolve=>{let request;try{request=indexedDB.open('dex-quest-photos',1);}catch{resolve(null);return;}request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('shots'))request.result.createObjectStore('shots');};request.onsuccess=()=>resolve(request.result);request.onerror=request.onblocked=()=>resolve(null);});
  return photoDBPromise;
 }
 async function storePhotoOriginal(key,image,oldKey){
  const db=await openPhotoDB();if(!db)return false;
  return new Promise(resolve=>{try{const tx=db.transaction('shots','readwrite'),store=tx.objectStore('shots');store.put(image,key);if(oldKey&&oldKey!==key)store.delete(oldKey);tx.oncomplete=()=>resolve(true);tx.onerror=tx.onabort=()=>resolve(false);}catch{resolve(false);}});
 }
 async function loadPhotoOriginal(key){
  const live=photoOriginals.get(key);if(live)return live;const db=await openPhotoDB();if(!db)return null;
  return new Promise(resolve=>{try{const request=db.transaction('shots','readonly').objectStore('shots').get(key);request.onsuccess=()=>resolve(typeof request.result==='string'&&request.result.startsWith('data:image/png;base64,')?request.result:null);request.onerror=()=>resolve(null);}catch{resolve(null);}});
 }
 function captureScenePhoto(){
  const c=document.createElement('canvas'),size=photoExportSize(canvas.width,canvas.height);c.width=size.width;c.height=size.height;const g=c.getContext('2d');if(!g)throw new Error('Canvas unavailable');
  const previousContext=ctx;capturingPhoto=true;ctx=g;
  try{g.imageSmoothingEnabled=false;draw(c);const fullImage=c.toDataURL('image/png'),thumb=document.createElement('canvas'),ratio=360/Math.max(c.width,c.height);thumb.width=Math.round(c.width*ratio);thumb.height=Math.round(c.height*ratio);const tg=thumb.getContext('2d');if(!tg)throw new Error('Canvas unavailable');tg.imageSmoothingEnabled=false;tg.drawImage(c,0,0,thumb.width,thumb.height);const image=thumb.toDataURL('image/png');if(!fullImage.startsWith('data:image/png;base64,')||image.length>200000)throw new Error('Snapshot unavailable');return {image,fullImage,...size};}
  finally{ctx=previousContext;capturingPhoto=false;draw();}
 }
 async function downloadPhoto(id){
  const shot=photoShots[id];if(!shot)return;let image=shot.storageKey?await loadPhotoOriginal(shot.storageKey):null;
  if(!image){const source=new Image();await new Promise((resolve,reject)=>{source.onload=resolve;source.onerror=reject;source.src=shot.image;});const c=document.createElement('canvas'),size=photoExportSize(source.naturalWidth,source.naturalHeight);c.width=size.width;c.height=size.height;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(source,0,0,c.width,c.height);image=c.toDataURL('image/png');}
  const a=document.createElement('a');a.href=image;a.download='DEX-'+id+'-1920.png';a.click();
 }

 // The camera owns a separate render target; player coordinates and game time never change.
 let photoMode=null,photoDrag=null,photoComparison=null;
 function photoGreeting(n){return !!(capturingPhoto&&photoMode?.crowd&&Math.hypot(n.x-player.x,n.y-player.y)<190&&!n.pose);}
 function openPhotoMode(){
  if(guardedInput()||photoMomentBusy()||observing)return false;
  clearInput();notePlayActivity();
  photoMode={x:player.x,y:player.y-30,zoom:1,frame:'none',pose:'natural',crowd:true,message:'',dirty:true};
  $('photo-crowd').checked=true;$('photo-zoom').value='1';$('photo-border').value='none';$('photo-pose').value='natural';$('photo-download-now').hidden=true;
  document.documentElement?.classList.add('photographing');$('photo-studio').showModal();renderPhotoMode();$('photo-shutter').focus();return true;
 }
 function closePhotoMode(){
  if(!photoMode)return;closePhotoComparison(false);if(groupPhoto?.phase==='pose')groupPhoto=null;photoMode=null;photoDrag=null;$('photo-studio').close();document.documentElement?.classList.remove('photographing');
  $('photo-download-now').removeAttribute('href');clearInput();armInputGuard();acc=0;resize();draw();canvas.focus();
 }
 function photoPose(){return capturingPhoto&&photoMode?photoMode.pose:'natural';}
 function dirtyPhoto(){if(!photoMode)return;photoMode.dirty=true;photoMode.message='';$('photo-download-now').hidden=true;}
 function setPhotoPose(pose){if(!photoMode||!['natural','front','wave','thumb','umbrella'].includes(pose))return;photoMode.pose=pose;dirtyPhoto();}
 function photoCameraBounds(){return {minX:Math.max(0,player.x-240),maxX:Math.min(W,player.x+240),minY:Math.max(0,player.y-270),maxY:Math.min(H,player.y+210)};}
 function panPhoto(dx,dy){if(!photoMode)return;const b=photoCameraBounds();photoMode.x=Math.max(b.minX,Math.min(b.maxX,photoMode.x+dx));photoMode.y=Math.max(b.minY,Math.min(b.maxY,photoMode.y+dy));dirtyPhoto();}
 function setPhotoZoom(value){if(!photoMode)return;photoMode.zoom=Math.max(1,Math.min(2,Number(value)||1));dirtyPhoto();$('photo-zoom').value=String(photoMode.zoom);}
 function photoBorder(g,w,h){
  if(!photoMode||photoMode.frame==='none')return;
  const ivory=photoMode.frame==='postcard',u=Math.min(w,h)/480,pad=12*u,band=34*u;
  g.save();g.setTransform(1,0,0,1,0,0);g.strokeStyle=ivory?'#f3ecd9':'#dfc68c';g.lineWidth=pad;g.strokeRect(pad/2,pad/2,w-pad,h-pad);
  g.fillStyle=ivory?'#f3ecd9':'#24483e';g.fillRect(0,h-band,w,band);g.fillStyle=ivory?'#284e43':'#fff1ca';g.textAlign='center';g.font='bold '+Math.round(13*u)+'px monospace';g.fillText('DEX · 20 лет вместе',w/2,h-12*u);g.restore();
 }
 function renderPhotoTarget(target){
  const previous={ctx,viewW,viewH,camX,camY,capturingPhoto};
  try{ctx=target.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');capturingPhoto=true;viewH=480/(photoMode?.zoom||1);draw(target);const candidate=nextPhotoTarget();photoBorder(ctx,target.width,target.height);return candidate;}
  finally{ctx=previous.ctx;viewW=previous.viewW;viewH=previous.viewH;camX=previous.camX;camY=previous.camY;capturingPhoto=previous.capturingPhoto;}
 }
 function renderPhotoMode(){
  if(!photoMode)return;const c=$('photo-preview'),r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d));
  if(c.width!==w||c.height!==h){c.width=w;c.height=h;photoMode.dirty=true;}
  if(!photoMode.dirty)return;photoMode.dirty=false;const target=renderPhotoTarget(c);
  $('photo-zoom-value').textContent=Math.round(photoMode.zoom*100)+'%';
  const message=photoMode.message||(target?'В кадре: '+target.name+' · попадёт в фотоальбом':'Свободный кадр · можно скачать PNG');
  if($('photo-studio-status').textContent!==message)$('photo-studio-status').textContent=message;
 }
 function capturePhotoMode(){
  if(!photoMode||photoComparison)return false;
  try{
   const c=document.createElement('canvas'),size=photoExportSize($('photo-preview').width,$('photo-preview').height);c.width=size.width;c.height=size.height;
   const target=renderPhotoTarget(c),fullImage=c.toDataURL('image/png');
   const thumb=document.createElement('canvas'),ratio=360/Math.max(c.width,c.height);thumb.width=Math.round(c.width*ratio);thumb.height=Math.round(c.height*ratio);const g=thumb.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(c,0,0,thumb.width,thumb.height);
   if(target)savePhotoShot(target,{...size,fullImage,image:thumb.toDataURL('image/png')});else window.ParkAudio?.shutter?.();
   const link=$('photo-download-now');link.href=fullImage;link.download='DEX-'+(target?.id||'park')+'-1920.png';link.hidden=false;
   photoMode.message=(photoComparison?'Выберите снимок для альбома. ':target?'В альбоме: '+target.name+'. ':'Кадр готов. ')+size.width+' × '+size.height+' px · скачайте ниже';photoMode.dirty=true;renderPhotoMode();return true;
  }catch{photoMode.message='Не удалось создать снимок. Попробуйте ещё раз.';photoMode.dirty=true;renderPhotoMode();return false;}
 }
 function initPhotoMode(){
  const studio=$('photo-studio'),preview=$('photo-preview');
  $('photo-crowd').onchange=()=>{if(photoMode){photoMode.crowd=$('photo-crowd').checked;dirtyPhoto();}};
  $('photo-keep-old').onclick=()=>closePhotoComparison(false);$('photo-keep-new').onclick=()=>closePhotoComparison(true);$('photo-compare-close').onclick=()=>closePhotoComparison(false);$('photo-compare').addEventListener('cancel',e=>{e.preventDefault();closePhotoComparison(false);});
  $('photo-close').onclick=closePhotoMode;$('photo-shutter').onclick=capturePhotoMode;
  studio.addEventListener('cancel',e=>{e.preventDefault();closePhotoMode();});
  $('photo-zoom').oninput=e=>setPhotoZoom(e.target.value);
  $('photo-border').onchange=e=>{if(photoMode){photoMode.frame=e.target.value;dirtyPhoto();}};
  $('photo-pose').onchange=e=>setPhotoPose(e.target.value);
  $('photo-center').onclick=()=>{if(photoMode){photoMode.x=player.x;photoMode.y=player.y-30;setPhotoZoom(1);}};
  preview.addEventListener('pointerdown',e=>{if(!photoMode||e.button>0)return;e.preventDefault();photoDrag={id:e.pointerId,x:e.clientX,y:e.clientY};preview.setPointerCapture(e.pointerId);preview.focus();});
  preview.addEventListener('pointermove',e=>{if(!photoMode||photoDrag?.id!==e.pointerId)return;const r=preview.getBoundingClientRect(),scale=480/photoMode.zoom/r.height;panPhoto((photoDrag.x-e.clientX)*scale,(photoDrag.y-e.clientY)*scale);photoDrag.x=e.clientX;photoDrag.y=e.clientY;});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])preview.addEventListener(type,e=>{if(photoDrag?.id===e.pointerId)photoDrag=null;});
  preview.addEventListener('wheel',e=>{if(!photoMode)return;e.preventDefault();setPhotoZoom(photoMode.zoom+(e.deltaY>0?-.1:.1));},{passive:false});
  studio.addEventListener('keydown',e=>{
   if(!photoMode||photoComparison||['INPUT','SELECT'].includes(e.target.tagName))return;
   const delta={ArrowLeft:[-24,0],ArrowRight:[24,0],ArrowUp:[0,-24],ArrowDown:[0,24]}[e.code];
   if(delta){e.preventDefault();panPhoto(...delta);}else if(['Equal','NumpadAdd','Minus','NumpadSubtract'].includes(e.code)){e.preventDefault();setPhotoZoom(photoMode.zoom+(e.code==='Minus'||e.code==='NumpadSubtract'?-.1:.1));}
   else if(e.code==='KeyP'&&!e.repeat){e.preventDefault();capturePhotoMode();}
  });
 }

 function takePhoto(){
  if(guardedInput()||photoMomentBusy()||observing||photoCooldown>0)return false;const target=nextPhotoTarget();
  if(!target){announce('В фотоохоте '+photoTargets.length+' сюжетов: животные, времена года, фонтан, колесо, кораблик и чудеса погоды. Подсказки — в альбоме журнала.');return false;}
  let shot;try{shot=captureScenePhoto();}catch{announce('Не удалось сохранить кадр. Попробуйте ещё раз.');return false;}
  return savePhotoShot(target,shot);
 }

 function closePhotoComparison(keepNew=false){
  const pending=photoComparison;if(!pending)return false;photoComparison=null;$('photo-compare').close();$('photo-compare-download').removeAttribute('href');
  $('photo-compare-old').removeAttribute('src');$('photo-compare-new').removeAttribute('src');
  if(keepNew)commitPhotoShot(pending.target,pending.shot);
  if(photoMode){photoMode.message=(keepNew?'В альбоме новый кадр: ':'В альбоме оставлен прежний кадр: ')+pending.target.name+'. Новый снимок можно скачать ниже.';photoMode.dirty=true;renderPhotoMode();$('photo-shutter').focus();}
  else{armInputGuard();canvas.focus();}return true;
 }
 function savePhotoShot(target,shot){
  if(photoComparison)return false;
  if(!photoShots[target.id])return commitPhotoShot(target,shot);
  photoComparison={target,shot};$('photo-compare-title').textContent='Какой снимок оставить?';$('photo-compare-subject').textContent=target.name+' · прежний кадр останется, пока вы не выберете новый.';
  $('photo-compare-old').src=photoShots[target.id].image;$('photo-compare-new').src=shot.image;
  $('photo-compare-old').alt='Прежний снимок: '+target.name;$('photo-compare-new').alt='Новый снимок: '+target.name;
  $('photo-compare-download').href=shot.fullImage;$('photo-compare-download').download='DEX-'+target.id+'-new-1920.png';
  window.ParkAudio?.shutter?.();clearInput();$('photo-compare').showModal();$('photo-keep-old').focus();return true;
 }

 function commitPhotoShot(target,shot){
  const old=photoShots[target.id],storageKey=target.id+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  if(old?.storageKey)photoOriginals.delete(old.storageKey);photoOriginals.set(storageKey,shot.fullImage);
  photoShots[target.id]={time:Math.floor(elapsed),image:shot.image,width:shot.width,height:shot.height,storageKey,place:safePhotoPlace(player)};
  storePhotoOriginal(storageKey,shot.fullImage,old?.storageKey).then(saved=>{if(!saved&&photoShots[target.id]?.storageKey===storageKey)announce('Снимок готов. Оригинал пока доступен в этой вкладке — скачайте его из альбома.');});
  if(target.id==='groupPhoto'){unlockAchievement('photo');unlockAchievement('groupPortrait');completePinned('groupPhoto');}if(target.id==='parkHeart')completePinned('heart');photoCooldown=.9;photoFlash=.65;window.ParkAudio?.shutter?.();if(['swifts','rainbow','cat'].every(id=>photoShots[id]))unlockAchievement('photoHunt');if(photoTargets.filter(p=>!p.bonus).every(p=>photoShots[p.id]))unlockAchievement('photoAlbum');
  announce((old?'Кадр обновлён: ':'Снимок готов: ')+target.name+' · '+Object.keys(photoShots).length+'/'+photoTargets.length+'. PNG 1920 px — в журнале.');$('journal-button').classList.add('new-discovery');save();return true;
 }

 function renderPhotoAlbum(){
  const list=$('photo-album');list.replaceChildren();$('photo-count').textContent='Ваши снимки: '+Object.keys(photoShots).length+' / '+photoTargets.length+'. P или 📷 открывает режим фотографа: время остановится. Сдвигайте кадр, приближайте и выбирайте рамку. Снимки — PNG с длинной стороной 1920 px. Нажмите на фотографию, чтобы рассмотреть её и вернуться к месту съёмки.';
  for(const p of photoTargets){const li=document.createElement('li'),title=document.createElement('strong'),desc=document.createElement('p'),shot=photoShots[p.id];li.className='photo-card'+(shot?' captured':'');title.textContent=(shot?'✓ ':'○ ')+p.name;
   if(shot){const img=document.createElement('img');img.src=shot.image;img.alt='Ваш снимок «'+p.name+'»';const open=document.createElement('button');open.type='button';open.id='photo-open-'+p.id;open.className='photo-open';open.setAttribute('aria-label','Открыть снимок «'+p.name+'»');open.onclick=()=>openPhotoViewer(p.id);open.append(img);li.append(open);desc.textContent='Снято на '+formatTime(shot.time)+'. '+(shot.width?shot.width+' × '+shot.height+' px.':'Старый кадр: переснимите для новых деталей.')+' При пересъёмке вы выберете, какой кадр оставить.';const download=document.createElement('a');download.href=shot.image;download.download='DEX-'+p.id+'-1920.png';download.className='photo-download';download.textContent='Скачать PNG · 1920 px';download.setAttribute('aria-label','Скачать снимок «'+p.name+'»');download.onclick=async e=>{e.preventDefault();if(download.dataset?.busy)return;download.setAttribute('data-busy','true');download.textContent='Готовим PNG…';try{await downloadPhoto(p.id);download.textContent='Скачать PNG · 1920 px';}catch{download.textContent='Повторить скачивание';}finally{download.removeAttribute('data-busy');}};li.append(title,desc,download);}
   else{const empty=document.createElement('div');empty.className='photo-empty';empty.textContent=p.icon||(p.id==='swifts'?'⌁':'🌈');empty.setAttribute('aria-hidden','true');desc.textContent=p.hint;li.append(empty,title,desc);}list.append(li);
  }
 }
 function boatCycle(){return rainEventIndex();}
 function streamPoint(u){return {x:streamStart.x+Math.sin(u*Math.PI*3)*5,y:streamStart.y+(streamEnd.y-streamStart.y)*u};}
 function launchPaperBoat(){const phase=weatherTime();if(paperVoyage){announce('Кораблик уже плывёт! Пройдите вниз по ручейку к клетчатому флажку.');return false;}if(phase<30||phase>=40){announce('Для кораблика нужен дождь. Как зажурчит ручеёк, вернитесь сюда — он течёт вниз вдоль аллеи.');return false;}if(phase>39){announce('Ручеёк уже стихает. Запустим кораблик в следующий дождь!');return false;}if(boatLastCycle===boatCycle()){announce('Сегодняшний рейс уже отправлен. Следующий — с новым дождём.');return false;}paperVoyage={time:0,cycle:boatCycle()};boatLastCycle=boatCycle();announce('Попутного дождя! Проводите кораблик вниз по ручейку до клетчатого флажка.');save();return true;}
 function updateParkMoments(dt){if(!ambientSceneBusy()&&elapsed%300>=METEOR_AT&&(elapsed-dt)%300<METEOR_AT&&nightLevel()>.3&&rainIntensity()<.2&&!speechTime){speech='Падающие звёзды! Успею загадать желание.';speechTime=4;}photoCooldown=Math.max(0,photoCooldown-dt);photoFlash=Math.max(0,photoFlash-dt);if(paperVoyage){paperVoyage.time+=dt;if(paperVoyage.time>=BOAT_SECONDS){const nearby=!driving&&Math.hypot(player.x-streamEnd.x,player.y-streamEnd.y)<100;paperVoyage=null;if(nearby){boatWins=Math.min(999,boatWins+1);unlockAchievement('paperBoat');speech='Доставлено! Ни одного пирата. Только дождевые червяки.';speechTime=5;window.ParkAudio?.reward?.();}else announce('Кораблик доплыл! В следующий дождь пройдите рядом с ним до флажка — получите звание капитана.');save();}}
  const lit=nightLevel()>.1&&rainIntensity()<.2;for(const f of fireflyHomes){const dx=f.hx-player.x,dy=f.hy-player.y,d=Math.hypot(dx,dy),push=lit&&!reduced?Math.max(0,1-d/115)*65:0,rate=Math.min(1,dt*2.5);f.dx+=(dx/(d||1)*push-f.dx)*rate;f.dy+=(dy/(d||1)*push-f.dy)*rate;}
 }
 function drawRainStream(){const wet=puddleLevel();if(streamStart.x<camX-65||streamStart.x>camX+viewW+65||streamEnd.y<camY-30||streamStart.y>camY+viewH+30)return;rect(boatLaunch.x-13,boatLaunch.y-7,25,9,'#986e49');rect(boatLaunch.x-10,boatLaunch.y-10,20,5,'#fff0ce');line(boatLaunch.x-8,boatLaunch.y-10,boatLaunch.x+7,boatLaunch.y-5,'#baa98d',1);if(wet<=0)return;ctx.save();ctx.globalAlpha=wet*.8;for(let i=0;i<=20;i++){const p=streamPoint(i/20);rect(p.x-7,p.y-4,14,10,'#769ca5');rect(p.x-3,p.y-3,5,10,'#a6c9cb');}for(let i=0;i<(comfort.lightweight?4:9);i++){const u=(i/9+(reduced?0:elapsed*.18))%1,p=streamPoint(u);rect(p.x-4,p.y,8,1,'#e5f1e3');}ctx.restore();line(streamEnd.x+14,streamEnd.y+2,streamEnd.x+14,streamEnd.y-24,'#725942',2);for(let y=0;y<2;y++)for(let x=0;x<3;x++)rect(streamEnd.x+15+x*4,streamEnd.y-24+y*4,4,4,(x+y)%2?'#fff6d8':'#375449');if(!paperVoyage)return;const u=Math.min(1,paperVoyage.time/BOAT_SECONDS),p=streamPoint(u),bob=reduced?0:Math.sin(elapsed*5)*1.5;ctx.save();ctx.translate(p.x,p.y+bob);if(!reduced)ctx.rotate(Math.sin(elapsed*2)*.1);rect(-9,4,18,2,'#b2d9d6');ctx.fillStyle='#fff0cf';ctx.beginPath();ctx.moveTo(-11,0);ctx.lineTo(10,0);ctx.lineTo(5,7);ctx.lineTo(-5,7);ctx.closePath();ctx.fill();ctx.fillStyle='#e5d6b0';ctx.beginPath();ctx.moveTo(-7,0);ctx.lineTo(1,-11);ctx.lineTo(1,0);ctx.closePath();ctx.fill();ctx.fillStyle='#fff9e3';ctx.beginPath();ctx.moveTo(1,-11);ctx.lineTo(8,0);ctx.lineTo(1,0);ctx.closePath();ctx.fill();ctx.restore();}
 function drawFireflies(){const strength=nightLevel()*(1-rainIntensity())*(1-snowCover());if(strength<=.1)return;ctx.save();ctx.translate(-camX,-camY);for(const f of fireflyHomes){if(fireflyDance&&f.seed>=25)continue;if(comfort.lightweight&&f.seed%2)continue;const t=reduced?0:elapsed*.75+f.seed,x=f.hx+f.dx+Math.sin(t)*10,y=f.hy+f.dy-20+Math.cos(t*.7)*7;if(x<camX-12||x>camX+viewW+12||y<camY-12||y>camY+viewH+12)continue;const glow=strength*(reduced?.6:.2+Math.pow((1+Math.sin(elapsed*1.7+f.seed*2.1))/2,2)*.8);ctx.globalAlpha=glow*.1;rect(x-6,y-6,13,13,'#d4ee85');ctx.globalAlpha=glow*.25;rect(x-3,y-3,7,7,'#d6f094');ctx.globalAlpha=glow;rect(x-1,y-1,3,3,'#eff5af');rect(x,y,1,1,'#fff8d5');}ctx.restore();}

 function meteorStreaks(){
  const t=elapsed%300-METEOR_AT;if(t<0||t>=12||nightLevel()<.3||rainIntensity()>.2)return [];
  const result=[];for(let i=0;i<4;i++){if(comfort.lightweight&&i%2)continue;const u=(t-i*2.4)/3.8;if(u<0||u>=1)continue;const phase=reduced?.48:u;result.push({x:[.05,.47,.22,.66][i]+phase*.21,y:.035+(i%2)*.035+phase*.22,alpha:Math.min(1,u*5,(1-u)*4),seed:i});}return result;
 }
 function drawMeteorShower(){
  const stars=meteorStreaks();if(!stars.length)return;ctx.save();
  for(const star of stars){const x=star.x*viewW,y=star.y*viewH,length=reduced?30:Math.min(120,viewW*.18);
   for(let j=15;j>=1;j--){ctx.globalAlpha=star.alpha*(1-j/16)*.65;rect(x-j*length/15,y-j*length/25,Math.max(3,length/15),j>8?1:2,j>7?'#b7cbd3':'#f2e5ba');}
   ctx.globalAlpha=star.alpha*.08;rect(x-10,y-10,21,21,'#e9ebc8');ctx.globalAlpha=star.alpha*.18;rect(x-5,y-5,11,11,'#e9ebc8');ctx.globalAlpha=star.alpha*(reduced?.65:1);rect(x-2,y-2,5,5,'#fff0c8');rect(x-5,y,11,1,'#fff8e0');rect(x,y-5,1,11,'#fff8e0');
  }ctx.restore();
 }
 function drawPhotoFrame(){if(photoFlash<=0||capturingPhoto||observing||blocked())return;ctx.save();ctx.globalAlpha=Math.min(1,photoFlash*3)*(reduced?.55:.9);const pad=24,size=18;ctx.strokeStyle='#f8e6ae';ctx.lineWidth=2;for(const [x,y,dx,dy]of [[pad,pad,1,1],[viewW-pad,pad,-1,1],[pad,viewH-pad,1,-1],[viewW-pad,viewH-pad,-1,-1]]){ctx.beginPath();ctx.moveTo(x+dx*size,y);ctx.lineTo(x,y);ctx.lineTo(x,y+dy*size);ctx.stroke();}ctx.restore();}
 function updatePhotoUI(){const b=$('photo-button'),target=nextPhotoTarget();b.hidden=driving;b.disabled=photoMomentBusy()||photoCooldown>0;b.classList.toggle('photo-ready',!!target&&!b.disabled);b.textContent=(mobileScreen()?'📷 ':'P · ')+(target?target.short:'Фото');b.setAttribute('aria-label',target?'Режим фотографа: '+target.name:'Открыть режим фотографа');const fleeting=target&&['kite','birdEcho','swifts','rainbow','meteors','fountainShow','firstSnow','dawnPond','parkHeart','dawnFlock','aurora'].includes(target.id),hint=$('photo-hint');hint.hidden=!fleeting||b.disabled||observing||blocked()||(viewW<420&&!$('prompt').hidden);hint.textContent=hint.hidden?'':'Момент для фото';b.title='Режим фотографа · время остановится, кадр можно приблизить и сдвинуть';}
 function renderBoatGuide(){$('boat-status').textContent='Удачных рейсов: '+boatWins+'. '+(paperVoyage?'Кораблик в пути. Пройдите вниз по ручейку до флажка.':weatherTime()>=30&&weatherTime()<=39&&boatLastCycle!==boatCycle()?'Сейчас идёт дождь — можно запускать кораблик!':'Следующий рейс — с новым дождём. Лоток с бумажными корабликами — на аллее к югу от старта.');$('boat-track').textContent=trackedPlace===boatPlace?'Убрать указатель':'Найти ручеёк';}

 const guestHome=point([39,30]),drunkGuest={...guestHome,kind:'drunkGuest',action:'Сделать замечание'};let guestEscort=null;
 const feedingSpot={...point([72,29]),kind:'pigeons',action:'Бросить голубям хлеб'};
 let feedScene=null,feedCooldown=0;
 const pigeons=[[34,20],[51,36],[29,44]].flatMap(([x,y],group)=>[0,1,2].map(i=>({originX:x*T+8+i*15,originY:y*T+12+(i%2)*14,homeX:x*T+8+i*15,homeY:y*T+12+(i%2)*14,flight:0,dx:0,dy:0,cooldown:0,phase:group*3+i})));
 const tamePigeons=[[-24,-10],[4,-18],[25,0],[-9,13]].map(([dx,dy],phase)=>({homeX:feedingSpot.x+dx,homeY:feedingSpot.y+dy,phase,flight:0,dx:0,dy:0}));
 const parking={x:56*T,y:62*T,w:16*T,h:6*T};
 const golf={x:parking.x+128,y:parking.y+44};
 const bmw={x:parking.x+368,y:parking.y+45};
 const trafficLight={x:72*T+24,y:71*T+10,stopY:71*T};
 let brakeGlow=0,trafficLightClock=0,redLightViolations=0;
 let windshieldBroken=false,nutAttack=null,nutImpact=0;
 let carPitch=0,carRoll=0,visualLastSpeed=0;
 let carTrail=[],stormBag=null;
 let tyreMarks=[],exhaustPuffs=[],skidPose=null,exhaustClock=0;
 const wanderers=[];
 let bmwHazardTime=0,bmwNearby=false,driving=false,driveSpeed=0,driveSaveClock=0,trafficStop=null,trafficCooldown=0,steerValue=0,luckDelay=-1,luckAfter=0,whiteMark=0,luckyOrigin=null,luckyDrop=null,speedingViolations=0,bmwAvailable=true,towScene=null;bmw.angle=0;
 let parkingViolations=0,parkingStillTime=0,parkingFinedHere=false;
 let brotherRefusal=0,brotherRequests=0;
 const brotherReplies=['Не дам!!!','Сказал же, не дам!!!','Тебе уже одну увезли. Golf в очередь не встанет!','Ключи у белки. Она против!'];
 const speedLimitSign={x:67*T,y:71*T};
 const brother={x:golf.x+58,y:golf.y+30,phrase:'Привет, брат'};
 const brotherHome={x:brother.x,y:brother.y};
 let brotherEscape=null,brotherShout=0,emergencyBrake=0,wheelTravel=0;
 const sighGuest={...point([39,47]),phrase:'офффф'};
 // The northwest fair stays optional and leaves the northern promenade open.
 const fairSites=[
  {id:'music',tx:13,ty:10,name:'Семейный концерт',action:'Познакомиться с музыкантами'},
  {id:'sacks',tx:13,ty:15,name:'Бег в мешках',action:'Прыгнуть в мешок'},
  {id:'rope',tx:27,ty:15,name:'Перетягивание каната',action:'Встать в команду'},
  {id:'rings',tx:21,ty:10,name:'Броски колец',action:'Попробовать кольцеброс'}
 ].map(p=>({...p,...point([p.tx,p.ty]),kind:'fair'}));
 const fairFamily=[
  {name:'Гитарист',avatar:0,x:400,y:292,hair:'#40372f',shirt:'#618a89',style:'glasses',instrument:'guitar',quiet:true},
  {name:'Скрипачка',avatar:1,x:444,y:296,hair:'#493930',shirt:'#ae6672',style:'brown',instrument:'violin',quiet:true},
  {name:'Барабанщик',avatar:2,x:488,y:302,hair:'#504233',shirt:'#b29658',style:'glasses',instrument:'drum',quiet:true,heightScale:.86}
 ];
 const fairSackRival={avatar:3,quiet:true};
 const fairRopeCast=[4,5,6,7].map(avatar=>({avatar,quiet:true}));
 const fairRingHost={avatar:8,quiet:true};
 const fairInstructions={
  music:'Скрипачка: «Привет! Мы ромская семья: я играю на скрипке, рядом — гитара и барабан. Останься послушать! Сегодня наша маленькая сцена открыта для всех». Концерт длится 8 секунд.',
  sacks:'Семь сигналов — семь прыжков. Когда появится «ПРЫГАЙ!», нажмите E, пробел или большую кнопку. Четырёх точных прыжков достаточно для победы, а семь доведут до самой финишной черты. Частые нажатия не помогают: на каждый сигнал есть одна попытка.',
  rope:'Тянем вместе с командой! На каждом из семи сигналов «ТЯНИ!» нажмите E, пробел или большую кнопку. Четыре попадания в ритм — и флажок окажется на вашей стороне. Удерживать кнопку не нужно.',
  rings:'Подождите, пока бегунок окажется в светлой зоне и появится «БРОСАЙ!». Нажмите E, пробел или большую кнопку. Из семи колец нужно набросить хотя бы четыре. Считается первый бросок в каждом раунде.'
 };
 let fairStats={},fairPending='',fairFeedback='',fairLastPaint='';
 function fairClearing(x,y){return x>=10&&x<=31&&y>=7&&y<=17;}
 function restoreFair(v={}){
  fairRibbon=v.fairRibbon!==false;fairWatchers=[];fairCheer=null;
  fairStats={};for(const p of fairSites){const a=v.fair?.[p.id];fairStats[p.id]={plays:Number.isInteger(a?.plays)?Math.max(0,Math.min(999,a.plays)):0,best:Number.isInteger(a?.best)?Math.max(0,Math.min(7,a.best)):0};}
  restoreFairStories(v);if(funScene?.kind==='fair')funScene=null;fairPending='';fairFeedback='';fairLastPaint='';$('fair-dialog').close();$('fair-controls').hidden=true;$('game-viewport').classList.remove('fair-playing');
 }
 function fairReason(p){return ridesWet()?'Ярмарка пережидает непогоду. Возвращайтесь после дождя или метели.':p.id!=='music'&&(errandStates.includes(2)||garden.stage===1||extras.balloon===1)?'Сначала доставим то, что несём. Для игры нужны обе руки.':'';}
 function openFair(p){
  if(momentsBusy())return false;const reason=fairReason(p);if(reason){speech=reason;speechTime=4;return false;}
  clearInput();player.vx=player.vy=0;fairPending=p.id;$('fair-title').textContent=p.name;$('fair-copy').textContent=fairInstructions[p.id];$('fair-start').textContent=p.id==='music'?'Послушать · 8 секунд':'Начать игру';$('fair-start').hidden=false;renderFairPace();renderFairExtras();$('fair-dialog').showModal();return true;
 }
 function closeFairDialog(){fairPending='';$('fair-dialog').close();clearInput();canvas.focus();}
 function startFair(restart=false){
  const p=fairSites.find(a=>a.id===fairPending);if(!p)return false;
  const reason=fairReason(p);if(reason){$('fair-copy').textContent=reason;return false;}
  if(driving||cycling||funScene||!canStand(p.x,p.y))return false;
  const paused=restart===true?null:fairInterrupted[p.id];delete fairInterrupted[p.id];
  $('fair-dialog').close();clearInput();restingBench=null;dashTime=teaTime=speechTime=0;
  Object.assign(player,{x:p.x,y:p.y,vx:0,vy:0,face:p.id==='music'?'up':'right'});
  funScene={kind:'fair',gameId:p.id,time:0,score:0,attempted:-1,lastHit:-20,lastNote:-1,home:{x:p.x,y:p.y},throwTime:-20,throwHit:false,slow:comfort.fairSlow===true,period:comfort.fairSlow?2.1:1.35,ropePull:0,jumpFrom:p.x,jumpTo:p.x,rings:[]};
  if(paused){const f=funScene;f.slow=paused.slow;f.period=paused.slow?2.1:1.35;f.time=2.4+paused.round*f.period;f.score=paused.score;f.attempted=paused.round-1;f.countdown=2.4;f.ropePull=f.score*6;f.jumpFrom=f.jumpTo=fairSackX(f);if(p.id==='sacks')player.x=f.jumpTo;if(p.id==='rope')player.x=f.home.x-f.ropePull;if(p.id==='rings')for(let i=0;i<f.score;i++)f.rings.push({x:p.x-24+(i%3)*24,y:p.y-47-Math.floor(i/3)*3,lands:0});}
  $('fair-cancel').textContent='Выйти';gatherFairWatchers(p);
  fairPending='';fairFeedback=p.id==='music'?'Скрипачка: «Ловите наше хорошее настроение!»':'Приготовьтесь…';fairLastPaint='';$('game-viewport').classList.add('fair-playing');$('fair-controls').hidden=false;syncFairControls();canvas.focus();$('fair-controls').scrollIntoView?.({block:'nearest',behavior:'instant'});notePlayActivity();save();return true;
 }
 function fairBeat(f=funScene){const t=Math.max(0,f.time-2.4),period=f.period||1.35,round=Math.floor(t/period+1e-8),phase=Math.max(0,t/period-round),[lo,hi]=fairWindow(f);return {round,phase,ready:!(f.countdown>0)&&f.time>=2.4&&round<7&&phase>=lo&&phase<=hi};}
 function fairAction(){
  const f=funScene;if(f?.kind!=='fair'||blocked()||f.gameId==='music'||f.time<2.4||f.countdown>0)return false;
  const beat=fairBeat(f);if(beat.round>=7||f.attempted===beat.round)return false;
  f.attempted=beat.round;f.throwTime=f.time;f.throwHit=beat.ready;notePlayActivity();
  if(beat.ready){f.score++;f.lastHit=f.time;if(f.gameId==='sacks'){f.jumpFrom=player.x;f.jumpTo=fairSackX(f);}if(f.gameId==='rings'){const p=fairSites[3];f.throwTarget={x:p.x-24+((f.score-1)%3)*24,y:p.y-47-Math.floor((f.score-1)/3)*3};f.rings.push({...f.throwTarget,lands:f.time+(reduced?0:.6)});}cheerFairHit(f);fairFeedback={sacks:'Есть прыжок!',rope:'Дружно! Флажок ближе.',rings:'Кольцо на стойке!'}[f.gameId];window.ParkAudio?.fairNote?.(f.score,.45);}
  else{f.throwTarget={x:fairSites[3].x+45,y:fairSites[3].y-47};fairFeedback=(beat.phase<fairWindow(f)[0]?'Рановато.':'Поздновато.')+' Следующий сигнал — новая попытка!';}syncFairControls();save();return beat.ready;
 }
 function syncFairControls(){
  const f=funScene;if(f?.kind!=='fair')return;const music=f.gameId==='music',b=fairBeat(f),p=fairSites.find(p=>p.id===f.gameId),remaining=Math.max(0,Math.ceil(fairDuration(f)-f.time+(f.countdown||0)));
  const ready=!music&&b.ready&&f.attempted!==b.round,word={sacks:'ПРЫГАЙ!',rope:'ТЯНИ!',rings:'БРОСАЙ!'}[f.gameId];
  const status=f.countdown>0?'Продолжаем через '+Math.ceil(f.countdown)+' с':music?'Концерт · '+remaining+' с':f.time<2.4?'Старт через '+Math.ceil(2.4-f.time)+' с':(ready?word:f.attempted===b.round?'Ждём следующий сигнал':'Приготовьтесь…')+' · '+f.score+' / 7 · '+remaining+' с';
  const key=status+'|'+fairFeedback;if(key!==fairLastPaint){$('fair-status').textContent=status;$('fair-feedback').textContent=fairFeedback;$('fair-action').textContent=ready?word:word?'E / пробел · '+{sacks:'Прыжок',rope:'Тянуть',rings:'Бросок'}[f.gameId]:'';$('fair-action').classList.toggle('fair-ready',ready);fairLastPaint=key;}
  $('fair-action').hidden=music;$('fair-meter').hidden=music;$('fair-action').disabled=!music&&(f.countdown>0||f.time<2.4||b.round>=7||f.attempted===b.round);$('fair-controls').setAttribute('aria-label',p.name);
  $('fair-marker').style.left=(b.phase*100)+'%';const [lo,hi]=fairWindow(f);$('fair-zone').style.left=(lo*100)+'%';$('fair-zone').style.width=((hi-lo)*100)+'%';
 }
 function finishFair(cancelled=false,weather=false){
  const f=funScene;if(f?.kind!=='fair')return;const p=fairSites.find(p=>p.id===f.gameId),success=f.gameId==='music'||f.score>=4,wasChampion=fairChampion();
  funScene=null;$('fair-controls').hidden=true;$('game-viewport').classList.remove('fair-playing');clearInput();Object.assign(player,f.home,{vx:0,vy:0,face:'down'});notePlayActivity();
  dismissFairWatchers(!cancelled&&success&&p.id!=='music',p.id);
  if(cancelled){if(weather&&fairSports.includes(p.id))fairInterrupted[p.id]=fairCheckpoint(f);else delete fairInterrupted[p.id];speech=weather&&p.id!=='music'?'Непогода! Очки и оставшиеся раунды сохранены. Продолжим, когда прояснится.':weather?'Музыканты переждут непогоду. Приходите снова!':'Передохнём. На ярмарке можно попробовать снова.';speechTime=5;save();canvas.focus();return;}
  delete fairInterrupted[p.id];
  const a=fairStats[p.id]||(fairStats[p.id]={plays:0,best:0});a.plays=Math.min(999,a.plays+1);a.best=Math.max(a.best,f.score);if(p.id==='music')for(let i=0;i<3;i++)meetNeighbour('musician-'+i);
  completePinned('fair-'+p.id);if(success)unlockAchievement('fair-'+p.id);if(!wasChampion&&fairChampion()){fairRibbon=true;unlockAchievement('fair-champion');}window.ParkAudio?.reward();
  $('fair-title').textContent=p.id==='music'?'Спасибо за компанию!':success?'Победа! · '+p.name:'Хорошая попытка! · '+p.name;
  $('fair-copy').textContent=p.id==='music'?'Гитарист: «Музыка лучше звучит, когда её с кем-то делишь. Заходи ещё!»':f.score+' из 7 точных действий. '+(success?{sacks:'Мешок — самый экологичный транспорт парка!',rope:'Вот что значит командная работа. Канат согласен!',rings:'Меткость проверена. Можно выпускать в прод!'}[p.id]:'Для победы нужно четыре. Дождитесь надписи «'+{sacks:'ПРЫГАЙ',rope:'ТЯНИ',rings:'БРОСАЙ'}[p.id]+'!» и нажимайте один раз. Можно попробовать ещё.');
  if(!wasChampion&&fairChampion())$('fair-copy').textContent+=' Три победы! Вы — чемпион парковой олимпиады. Золотая лента уже на вас; снять её можно в журнале, в разделе «Развлечения».';
  fairPending=p.id;renderFairPace();renderFairExtras();$('fair-start').hidden=false;$('fair-start').textContent=p.id==='music'?'Послушать ещё':'Попробовать ещё';save();$('fair-dialog').showModal();
 }
 function updateFair(dt){
  const f=funScene;if(f?.kind!=='fair')return;if(ridesWet()){finishFair(true,true);return;}if(f.countdown>0){f.time-=dt;f.countdown=Math.max(0,f.countdown-dt);syncFairControls();return;}
  if(f.gameId==='sacks'){const u=Math.max(0,Math.min(1,(f.time-f.lastHit)/.56)),x=f.jumpFrom+(f.jumpTo-f.jumpFrom)*u;if(canStand(x,player.y))player.x=x;}
  if(f.gameId==='rope'){const resistance=reduced?0:Math.sin(f.time*3)*1.5,target=Math.max(0,f.score*6-resistance);f.ropePull=approach(f.ropePull,target,24*dt);const x=f.home.x-f.ropePull;if(canStand(x,player.y))player.x=x;}
  if(f.gameId==='music'){const note=Math.floor(f.time/.38);if(note!==f.lastNote){f.lastNote=note;window.ParkAudio?.fairNote?.(note,.8);}}
  syncFairControls();if(f.time>=fairDuration(f))finishFair();
 }
 // Seven scored jumps share the full track; four hits still qualify for the prize.
 function fairSackX(f){return f.home.x+160*Math.min(7,Math.max(0,f.score))/7;}
 function fairHop(){return funScene?.kind==='fair'&&funScene.gameId==='sacks'&&!reduced?Math.sin(Math.min(1,(funScene.time-funScene.lastHit)/.56)*Math.PI)*20:0;}
 function drawFairSack(x,y){rect(x-15,y-24,30,29,'#b39764');rect(x-16,y-25,32,4,'#d6c191');line(x-10,y-17,x-7,y+1,'#927b53',2);line(x+8,y-17,x+5,y+1,'#927b53',2);rect(x-4,y-16,8,4,'#e1cda0');}
 function drawFairCostume(){if(funScene?.kind==='fair'&&funScene.gameId==='sacks')drawFairSack(player.x,player.y-fairHop());}
 function drawFairGround(){
  const m=fairSites[0],s=fairSites[1],r=fairSites[2],rings=fairSites[3];
  rect(m.x-55,m.y-77,150,66,'#a77a63');rect(m.x-49,m.y-71,138,54,'#d0ae84');
  line(m.x-60,m.y-93,m.x+100,m.y-93,'#765b46',2);for(let i=0;i<10;i++){const x=m.x-58+i*16;rect(x,m.y-91,10,4,['#b66e70','#e4c98b','#79a6a0'][i%3]);rect(x+2,m.y-87,6,4,['#b66e70','#e4c98b','#79a6a0'][i%3]);}
  rect(s.x-30,s.y-26,204,65,'#c5b784');for(const y of [s.y-20,s.y+10,s.y+36])line(s.x-24,y,s.x+166,y,'#eee4bf',2);
  for(let i=0;i<6;i++)for(let j=0;j<2;j++)rect(s.x+148+j*7,s.y-21+i*9,7,9,(i+j)%2?'#647267':'#f0e6c7');
  rect(r.x-111,r.y-17,220,47,'#c5b784');line(r.x,r.y-16,r.x,r.y+27,'#f0e6c7',3);
  rect(rings.x-43,rings.y-71,86,40,'#b49368');for(let i=0;i<3;i++){rect(rings.x-27+i*24,rings.y-67,6,20,'#dfce9f');rect(rings.x-28+i*24,rings.y-69,8,4,'#f0dfab');}
  line(rings.x-26,rings.y+5,rings.x+26,rings.y+5,'#f0e6c7',3);
  for(const p of fairSites)text(p.id==='music'?'МУЗЫКА':p.id==='sacks'?'МЕШКИ':p.id==='rope'?'КАНАТ':'КОЛЬЦА',p.x,p.y+57,10,'#f9edcd','center');
 }
 function drawFairPeople(){
  if(funScene?.kind==='fairAward'){drawFairAwardCast(funScene.time);return;}
  const active=funScene?.kind==='fair'?funScene:null,music=active?.gameId==='music';
  for(const [i,n]of fairFamily.entries()){
   const sway=reduced?0:Math.sin(elapsed*(music?7:2)+i)*1.3;drawSupporter({...n,x:n.x+sway,y:n.y});
   drawFairInstrument(n,i,music,active?.time??elapsed);
   if(music&&Math.floor(active.time*2+i)%3===0)text('♪',n.x+19,n.y-55-(reduced?0:active.time%1*12),14,'#f5dc94');
  }
  const rival=fairRivalPose(active);drawSupporter({...fairSackRival,x:rival.x,y:rival.y});ctx.save();ctx.translate(rival.x,rival.y);ctx.rotate(Math.sin(elapsed*13)*fairIdle('sacks')*.09);drawFairSack(0,0);const shake=fairIdle('sacks');if(shake>0)for(let i=0;i<3;i++)rect(-11+i*9,-30-shake*(5+i*3),2,2,'#e2d0a1');ctx.restore();
  drawFairRopeTeam(active);drawFairRings(active);drawFairRingHost();
 }

 // Pace is a comfort preference; ribbons and records belong to the current walk.
 const fairSports=['sacks','rope','rings'];
 let fairRibbon=true,fairWatchers=[],fairCheer=null;
 const fairWins=()=>fairSports.filter(id=>(fairStats[id]?.best||0)>=4).length;
 const fairChampion=()=>fairWins()===3;
 function renderFairPrize(){
  const won=fairChampion();$('fair-prize-status').textContent=won?'Чемпион парковой олимпиады! Лента ваша — можно носить её на прогулке.':'Победите в мешках, канате и кольцебросе: '+fairWins()+' / 3. Награда — чемпионская лента. Любой темп подходит.';
  $('fair-ribbon-toggle').disabled=!won;$('fair-ribbon-toggle').checked=won&&fairRibbon;$('fair-prize-award').hidden=!won;$('fair-prize-award').textContent=fairAward?'Повторить награждение':'На награждение →';$('fair-postcard').hidden=!fairAward;
 }
 function toggleFairRibbon(){if(!fairChampion())return false;fairRibbon=$('fair-ribbon-toggle').checked;save();renderFairPrize();return true;}
 function renderFairPace(){const music=fairPending==='music';$('fair-pace-options').hidden=music||!!fairInterrupted[fairPending];$('fair-slow').checked=comfort.fairSlow;$('fair-pace-description').textContent=comfort.fairSlow?'Спокойный: сигнал каждые 2,1 с, больше времени на нажатие. Награды те же.':'Обычный: сигнал каждые 1,35 с. Можно выбрать более спокойный темп.';}
 function setFairPace(){comfort.fairSlow=$('fair-slow').checked===true;applyComfort();renderFairPace();}
 const fairDuration=f=>f.gameId==='music'?8:2.4+(f.period||1.35)*7;
 const fairWindow=f=>f.slow?[.18,.88]:[.3,.76];
 function fairLean(){const f=funScene;return !reduced&&f?.kind==='fair'&&f.gameId==='rope'?-.12-Math.sin(f.time*3)*.025:0;}
 function fairRopePull(f){return f?.gameId==='rope'?(f.ropePull||0):0;}
 function fairRivalPose(f){
  const s=fairSites[1],running=f?.gameId==='sacks',round=running?Math.max(0,(f.time-2.4)/(f.period||1.35)):0,lap=Math.min(7,round),u=lap%1;
  const x=s.x+(running?160*lap/7:0),hop=running&&!reduced?Math.sin(u*Math.PI)*16:0;
  return {x,y:s.y+28-hop,groundY:s.y+28};
 }
 function drawChampionRibbon(){
  if(!fairRibbon||!fairChampion())return;
  line(-7,-20,7,-5,'#f5e1a1',5);line(-7,-20,7,-5,'#b59449',1);rect(3,-10,7,7,'#f0cb6e');rect(5,-8,3,3,'#fff1c0');rect(4,-3,2,4,'#bc775e');rect(7,-3,2,3,'#bc775e');
 }
 function drawFairHeroHands(){if(funScene?.kind!=='fair'||funScene.gameId!=='rope')return;rect(-16,-13,8,5,'#f6b683');rect(8,-13,8,5,'#f6b683');}
 function fairSpectatorGoals(p){
  const tiles=p.id==='sacks'?[[14,14],[17,14]]:p.id==='rope'?[[26,14],[29,14]]:[[24,8],[26,10]];
  return tiles.map(point).filter(g=>canStand(g.x,g.y)&&!path(Math.floor(g.x/T),Math.floor(g.y/T)));
 }
 function fairWatcherRoute(n,goal){
  const steps=Math.max(1,Math.ceil(Math.hypot(goal.x-n.x,goal.y-n.y)/12));let throughHero=false;
  for(let i=0;i<=steps;i++)if(Math.hypot(n.x+(goal.x-n.x)*i/steps-player.x,n.y+(goal.y-n.y)*i/steps-player.y)<32)throughHero=true;
  if(!throughHero&&clearSegment(n,goal))return [{...goal}];
  return lifePath(n,[Math.floor(goal.x/T),Math.floor(goal.y/T)],{x:player.x,y:player.y,radius:32});
 }
 function gatherFairWatchers(p){
  fairCheer=null;if(p.id==='music'){dismissFairWatchers();return;}
  const goals=fairSpectatorGoals(p);
  for(let i=0;i<goals.length;i++){
   let n=fairWatchers[i];const goal=goals[i];
   if(!n){let home=null;for(const [dx,dy]of [[-96,0],[96,0],[0,-64],[0,64]]){const a={x:goal.x+dx,y:goal.y+dy};if(canStand(a.x,a.y)&&clearSegment(a,goal)&&Math.hypot(a.x-player.x,a.y-player.y)>45){home=a;break;}}if(!home)continue;n={...home,home:{...home},id:i,walking:true,applause:0};fairWatchers.push(n);}
   n.done=false;n.path=fairWatcherRoute(n,goal);n.goal=goal;n.phase='approach';n.hold=0;n.applause=0;n.age=0;
  }
  for(let i=goals.length;i<fairWatchers.length;i++)leaveFairWatcher(fairWatchers[i]);
 }
 function leaveFairWatcher(n){n.phase='leave';n.applause=0;n.path=fairWatcherRoute(n,n.home);n.age=0;}
 function dismissFairWatchers(success=false,gameId=''){
  fairCheer=null;
  for(const n of fairWatchers){if(success){n.phase='cheer';n.path=[];n.hold=2.8;n.applause=2.8;}else leaveFairWatcher(n);}
  if(success&&fairWatchers.length)fairCheer={text:{sacks:'Вот это прыжок!',rope:'Берём тебя в команду!',rings:'Метко! Ещё один чемпион!'}[gameId]||'Браво!',time:2.8};
 }
 function updateFairWatchers(dt){
  if(fairCheer){fairCheer.time-=dt;if(fairCheer.time<=0)fairCheer=null;}
  for(const n of fairWatchers){
   n.walking=false;n.age+=dt;n.applause=Math.max(0,n.applause-dt);
   if(ridesWet()&&n.phase!=='leave')leaveFairWatcher(n);
   if(n.phase==='cheer'){n.hold-=dt;if(n.hold<=0)leaveFairWatcher(n);}
   if(n.phase==='watch'){continue;}
   const goal=n.path[0];if(!goal){if(n.phase==='approach')n.phase='watch';else if(n.phase==='leave')n.done=true;continue;}
   const d=Math.hypot(goal.x-n.x,goal.y-n.y),step=Math.min(d,86*dt);if(d<1){n.path.shift();continue;}
   const x=n.x+(goal.x-n.x)/d*step,y=n.y+(goal.y-n.y)/d*step;
   if(canStand(x,y)&&Math.hypot(x-player.x,y-player.y)>24){n.x=x;n.y=y;n.walking=true;}
   if(n.phase==='leave'&&n.age>12)n.done=true;
  }
  fairWatchers=fairWatchers.filter(n=>!n.done);
 }
 function cheerFairHit(f){
  if(![2,4].includes(f.score)||!fairWatchers.some(n=>n.phase==='watch'))return;
  fairCheer={text:f.score===4?'Получилось!':{sacks:'Давай, ещё прыжок!',rope:'Раз, два — вместе!',rings:'Точно в цель!'}[f.gameId],time:1.5};
  fairWatchers.forEach(n=>n.applause=1.2);
 }
 function drawFairCheer(){if(fairCheer&&fairWatchers.length&&!blocked()&&!capturingPhoto){const n=fairWatchers[0];mapLabel(fairCheer.text,n.x,n.y-64,12,3);}}
 function drawFairWatcher(n){drawCinemaGuest(n);}
 function drawFairRopeTeam(active){
  const p=fairSites[2],playing=active?.gameId==='rope',pull=playing?fairRopePull(active):0,pulse=playing&&!reduced?Math.sin(active.time*4)*.035:0;
  for(const [i,dx]of [-79,-48,54,84].entries()){
   const x=p.x+dx-pull,y=p.y+10,lean=playing&&!reduced?(i<2?-.14:.16)+pulse:fairIdle('rope')*(i<2?-.07:.07);
   ctx.save();ctx.translate(x,y);ctx.rotate(lean);drawSupporter({...fairRopeCast[i],x:0,y:0,pose:'rope'});const skin=npcAppearance(fairRopeCast[i]).skin;rect(-13,-23,7,5,skin);rect(6,-23,7,5,skin);ctx.restore();
  }
  const tension=playing?Math.min(1,.6+Math.abs(pull)/80):0,sag=(1-tension)*8+fairIdle('rope')*4;
  ctx.beginPath();ctx.moveTo(p.x-88-pull,p.y-9);for(let i=1;i<=12;i++){const u=i/12;ctx.lineTo(p.x-88-pull+180*u,p.y-9+Math.sin(u*Math.PI)*sag);}ctx.strokeStyle='#dcc69a';ctx.lineWidth=4;ctx.stroke();rect(p.x-3-pull,p.y-10+sag,7,14,'#bc6d6f');const tidy=fairIdle('rope');if(tidy>.05){ctx.beginPath();ctx.ellipse(p.x-12,p.y-7,9,tidy*7,0,0,Math.PI*2);ctx.ellipse(p.x+2,p.y-7,9,tidy*7,0,0,Math.PI*2);ctx.stroke();}
 }
 function drawFairRings(f){
  if(f?.gameId!=='rings')return;const p=fairSites[3],age=f.time-f.throwTime;
  for(const ring of f.rings||[]){const a=f.time-ring.lands;if(a<0)continue;const wobble=reduced?0:Math.sin(a*19)*Math.exp(-a*3);ctx.strokeStyle='#ecd589';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(ring.x,ring.y,9,4+wobble, wobble*.24,0,Math.PI*2);ctx.stroke();}
  if(age>=0&&age<.6&&!reduced){const u=age/.6,target=f.throwTarget||{x:p.x+45,y:p.y-47},x=p.x+(target.x-p.x)*u,y=p.y-24+(target.y-p.y+24)*u-Math.sin(u*Math.PI)*32;ctx.strokeStyle='#f7de94';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,10,5,u*2,0,Math.PI*2);ctx.stroke();}
  if(!f.throwHit&&age>=.6&&age<1.4){ctx.save();ctx.globalAlpha=1-(age-.6)/.8;ctx.strokeStyle='#d8c385';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x+48,p.y-30,10,3,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 }

 // Only completed rounds are checkpointed; a spent attempt is never replayed.
 let fairInterrupted={},fairAward=null,fairCardCache='',fairRecognitionAt=0,fairRecognitionIndex=0;
 function fairCheckpoint(f){const b=fairBeat(f),round=Math.min(7,b.round+(f.attempted===b.round?1:0));return {round,score:Math.min(round,f.score),slow:f.slow===true};}
 function fairSavedRounds(){const copy={...fairInterrupted};if(funScene?.kind==='fair'&&fairSports.includes(funScene.gameId))copy[funScene.gameId]=fairCheckpoint(funScene);return copy;}
 function restoreFairStories(v={}){
  fairInterrupted={};for(const id of fairSports){const p=v.fairInterrupted?.[id];if(p&&Number.isInteger(p.round)&&p.round>=0&&p.round<=7&&Number.isInteger(p.score)&&p.score>=0&&p.score<=p.round&&typeof p.slow==='boolean')fairInterrupted[id]={round:p.round,score:p.score,slow:p.slow};}
  const a=v.fairAward;fairAward=a&&/^\d{4}-\d{2}-\d{2}$/.test(a.date)&&Number.isFinite(Date.parse(a.date))&&fairSports.every(id=>Number.isInteger(a[id])&&a[id]>=4&&a[id]<=7)&&fairChampion()?{date:a.date,sacks:a.sacks,rope:a.rope,rings:a.rings}:null;
  fairCardCache='';fairRecognitionAt=0;fairRecognitionIndex=0;if(funScene?.kind==='fairAward')funScene=null;$('fair-postcard').hidden=true;$('fair-award-dialog').close();$('fair-cancel').textContent='Выйти';
 }
 function renderFairExtras(){
  const pending=fairInterrupted[fairPending],available=fairChampion();$('fair-restart').hidden=!pending;$('fair-award-start').hidden=!available;$('fair-award-start').textContent=fairAward?'Повторить награждение':'На награждение →';
  if(pending){$('fair-copy').textContent='Попытка сохранена: завершено '+pending.round+' из 7 раундов, точных действий — '+pending.score+'. Продолжим после короткого отсчёта. Темп сохранён: '+(pending.slow?'спокойный.':'обычный.');$('fair-start').textContent='Продолжить попытку';}
 }
 function syncFairAwardControls(){const f=funScene;if(f?.kind!=='fairAward')return;$('fair-meter').hidden=true;$('fair-action').hidden=true;$('fair-cancel').textContent='Пропустить сценку';$('fair-status').textContent=f.time<2?'Чемпион, на пьедестал!':f.time<5?'Чемпион парковой олимпиады!':'Общее фото · '+Math.max(1,Math.ceil(8-f.time));$('fair-feedback').textContent=f.time<5?'Музыканты и соперники поздравляют вас.':'Улыбнитесь! Открытка останется в журнале.';$('fair-controls').setAttribute('aria-label','Награждение чемпиона');}
 function startFairAward(){
  if(!fairChampion()||funScene)return false;
  const reason=driving||cycling?'Перед награждением выйдите из транспорта.':errandStates.includes(2)||garden.stage===1||extras.balloon===1?'Сначала доставьте то, что несёте. Награда вас подождёт.':ridesWet()?'Награда вас подождёт. Соберёмся для фото после непогоды.':'';
  if(reason){$('fair-prize-status').textContent=reason;$('fair-copy').textContent=reason;return false;}
  if(Math.hypot(player.x-fairSites[0].x,player.y-fairSites[0].y)>620){closeFairDialog();if(trackedPlace===fairPlaces[0])trackedPlace=-1;selectPlace(fairPlaces[0]);announce('Музыканты ждут у сцены ярмарки. Подойдите и выберите «На награждение».');return false;}
  if(!canStand(fairSites[0].x,fairSites[0].y))return false;
  closeFairDialog();journal.close();$('fair-award-dialog').close();clearInput();restingBench=null;dashTime=speechTime=teaTime=0;fairWatchers=[];fairCheer=null;
  funScene={kind:'fairAward',time:0,note:-1,home:{x:player.x,y:player.y}};Object.assign(player,{x:fairSites[0].x,y:fairSites[0].y,vx:0,vy:0,face:'down'});$('game-viewport').classList.add('fair-playing');$('fair-controls').hidden=false;syncFairAwardControls();canvas.focus();$('fair-controls').scrollIntoView?.({block:'nearest',behavior:'instant'});notePlayActivity();return true;
 }
 function updateFairAward(){const f=funScene;if(f?.kind!=='fairAward')return;if(ridesWet()){finishFairAward(true);return;}if(f.time>=2&&f.time<4.7){const note=Math.floor((f.time-2)/.38);if(note!==f.note){f.note=note;window.ParkAudio?.fairFanfare?.(note);}}syncFairAwardControls();if(f.time>=8)finishFairAward();}
 function finishFairAward(weather=false){
  const f=funScene;if(f?.kind!=='fairAward')return false;
  funScene=null;$('fair-controls').hidden=true;$('game-viewport').classList.remove('fair-playing');$('fair-cancel').textContent='Выйти';Object.assign(player,f.home,{vx:0,vy:0,face:'down'});clearInput();notePlayActivity();
  if(weather){announce('Непогода прервала награждение. Лента ваша — за общим фото приходите, когда прояснится.');save();return true;}
  if(!fairAward){const now=new Date();fairAward={date:now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'),...Object.fromEntries(fairSports.map(id=>[id,fairStats[id].best]))};fairCardCache='';}
  window.ParkAudio?.shutter?.();save();showFairPostcard();return true;
 }
 function fairAwardLift(){return funScene?.kind==='fairAward'?(reduced?12:12*Math.min(1,funScene.time/1.4)):0;}
 function fairAwardCast(time=8){
  const p=fairSites[0],u=reduced?1:Math.min(1,time/2),specs=[...fairFamily.map((n,i)=>({...n,dx:[-82,-40,82][i],dy:[-40,-55,-40][i],musician:true})),{...fairSackRival,dx:-65,dy:24},{...fairRopeCast[0],dx:65,dy:24},{...fairRopeCast[2],dx:102,dy:24}];
  return specs.map((n,i)=>({...n,x:p.x+n.dx+(1-u)*(i%2?16:-16),y:p.y+n.dy+(1-u)*18,quiet:true,moving:u<1,stride:time*9}));
 }
 function drawFairInstrument(n,i,music=false,time=elapsed){const sway=reduced?0:Math.sin(time*(music?7:2)+i)*1.3;
  if(n.instrument==='guitar'){ctx.fillStyle='#c49755';ctx.beginPath();ctx.ellipse(n.x,n.y-17,10,12,-.45,0,Math.PI*2);ctx.fill();rect(n.x-3,n.y-20,6,6,'#5e4b3c');line(n.x+3,n.y-21,n.x+17,n.y-34,'#78593e',4);line(n.x-8,n.y-12,n.x+6,n.y-18+sway,npcAppearance(n).skin,3);}
  if(n.instrument==='violin'){rect(n.x-7,n.y-28,17,6,'#bd8b56');line(n.x-12,n.y-32+sway,n.x+14,n.y-17+sway,'#eedeb6',2);}
  if(n.instrument==='drum'){rect(n.x-13,n.y-19,26,16,'#946d60');rect(n.x-14,n.y-22,28,5,'#e4d3a6');line(n.x-15,n.y-30+sway,n.x-4,n.y-22,'#d9bd87',2);}
 }
 function drawFairAwardCast(time=8){for(const [i,n]of fairAwardCast(time).entries()){drawSupporter({...n,pose:!n.musician&&time>=2?'clap':undefined});if(n.musician)drawFairInstrument(n,i,time>=2&&time<5,time);}}
 function drawFairPodium(){const p=fairSites[0];rect(p.x-23,p.y-13,46,22,'#ae8d51');rect(p.x-25,p.y-16,50,5,'#efcf87');text('1',p.x,p.y+3,15,'#fff4d3','center');}
 function drawFairCardHero(){const p=fairSites[0];ctx.save();ctx.translate(p.x,p.y-12);ctx.scale(1.08,1.35);for(const x of [-7,2]){rect(x,-5,5,8,'#243852');rect(x-1,1,7,3,'#e6f0e4');}rect(-9,-20,18,17,'#be3145');rect(-7,-19,14,12,'#f04b4b');rect(-12,-18,4,11,'#f04b4b');rect(-12,-9,4,4,'#f6b683');rect(8,-20,6,8,'#f04b4b');rect(12,-30,4,15,'#f6b683');rect(11,-35,6,7,'#f6b683');rect(-9,-34,18,16,'#203c78');rect(-6,-38,13,6,'#294b93');rect(-7,-29,14,9,'#f6b683');rect(-7,-22,14,6,'#294b93');rect(-4,-27,2,2,'#182e54');rect(3,-27,2,2,'#182e54');rect(-2,-20,5,2,'#fff4d9');drawChampionRibbon();ctx.restore();}
 function drawFairConfetti(time){if(time<2||time>7)return;const p=fairSites[0],count=comfort.lightweight?12:25;for(let i=0;i<count;i++){const u=reduced?.55:Math.min(1,(time-2)/5),x=p.x-115+(i*47%230)+(reduced?0:Math.sin(time*2+i)*6),y=p.y-135+((i*31)%60)+u*95;rect(x,y,3,i%2?5:3,['#e8cb88','#bb7980','#b1cec0'][i%3]);}}
 function createFairPostcard(){
  if(!fairAward)return '';if(fairCardCache)return fairCardCache;const c=document.createElement('canvas');c.width=1920;c.height=1280;const g=c.getContext('2d');if(!g)throw Error('Canvas unavailable');
  const old={ctx,elapsed,reduced,capturingPhoto,fairRibbon,hornReaction};
  try{ctx=g;reduced=true;elapsed=0;capturingPhoto=true;fairRibbon=true;hornReaction=null;g.imageSmoothingEnabled=false;
   rect(0,0,1920,1280,'#f5efda');rect(48,174,1824,864,'#7f9a68');rect(48,834,1824,204,'#c5b784');
   for(let i=0;i<70;i++)rect(70+(i*167)%1750,220+(i*89)%580,8,12,'#9cb57c');
   g.textAlign='center';g.fillStyle='#294d40';g.font='bold 58px sans-serif';g.fillText('Чемпион парковой олимпиады',960,108);
   g.save();g.translate(960-432*5,735-336*5);g.scale(5,5);drawFairGround();drawFairPodium();drawFairAwardCast(8);drawFairCardHero();drawFairConfetti(4.5);g.restore();
   rect(48,1038,1824,194,'#f5efda');g.textAlign='center';g.fillStyle='#294d40';g.font='bold 38px sans-serif';g.fillText('Мешки '+fairAward.sacks+'/7   ·   Канат '+fairAward.rope+'/7   ·   Кольца '+fairAward.rings+'/7',960,1110);g.font='28px sans-serif';g.fillText('DEX · 20 лет вместе · '+fairAward.date.split('-').reverse().join('.'),960,1174);fairCardCache=c.toDataURL('image/png');return fairCardCache;
  }finally{ctx=old.ctx;elapsed=old.elapsed;reduced=old.reduced;capturingPhoto=old.capturingPhoto;fairRibbon=old.fairRibbon;hornReaction=old.hornReaction;}
 }
 function showFairPostcard(){if(!fairAward)return false;try{const image=createFairPostcard();$('fair-award-image').src=image;$('fair-award-download').href=image;$('fair-award-download').download='DEX-champion-'+fairAward.date+'-1920x1280.png';$('fair-award-image').hidden=false;$('fair-award-download').hidden=false;$('fair-award-message').textContent='Вся компания в сборе! Открытка с датой и результатами сохранена в журнале → «Развлечения».';}catch{$('fair-award-image').hidden=true;$('fair-award-download').hidden=true;$('fair-award-message').textContent='Награда сохранена. Не удалось подготовить открытку — откройте её ещё раз из журнала.';}journal.close();$('fair-award-dialog').showModal();return true;}
 function closeFairPostcard(){$('fair-award-dialog').close();clearInput();canvas.focus();}
 function fairChampionLine(n){if(!fairChampion()||!fairRibbon||ridesWet()||elapsed<fairRecognitionAt||!supporters.includes(n)||errands.some(e=>e.giver===n))return '';return ['Чемпион идёт!','Реванш будет?','На работу тоже в мешке прыгаешь?'][fairRecognitionIndex%3];}
 function fairIdle(id){const p=fairSites.find(p=>p.id===id);if(reduced||ridesWet()||funScene?.kind==='fairAward'||funScene?.kind==='fair'&&funScene.gameId===id||Math.hypot(player.x-p.x,player.y-p.y)<105)return 0;const phase=(elapsed+fairSports.indexOf(id)*4)%15;return phase<4?Math.sin(phase*Math.PI/4):0;}
 function drawFairRingHost(){const p=fairSites[3],idle=fairIdle('rings'),x=p.x+55,y=p.y-22;ctx.save();ctx.translate(x,y);ctx.rotate(-idle*.13);drawSupporter({...fairRingHost,x:0,y:0});ctx.restore();ctx.strokeStyle='#e7cc80';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x-16-idle*9,y-12+idle*7,8,3,0,0,Math.PI*2);ctx.stroke();}

 // Full drawn silhouettes, including elevated panels and wheel cabins.
 const parkRides=[
 {tx:77,ty:22,id:'smallWheel',name:'Детское колесо',action:'Прокатиться на детском колесе',reply:'Маленькое колесо — большие впечатления!'},
 {tx:34,ty:45,id:'bee',name:'Карусель «Пчёлка»',action:'Прокатиться на «Пчёлке»',reply:'Ж-ж-ж! Мёд впечатлений собран.'},
 {tx:18,ty:39,id:'boats',name:'Качели «Лодочки»',action:'Покачаться на «Лодочках»',reply:'Моря нет, а капитан уже есть!'},
 {tx:17,ty:44,id:'slides',name:'Весёлые горки',action:'Прокатиться на горках',reply:'Вниз быстрее, чем обратно по лестнице!'},
 {tx:37,ty:58,id:'maze',name:'Игровой лабиринт',action:'Пройти игровой лабиринт',reply:'Выход найден! Навигатор внутри меня доволен.'},
 {tx:20,ty:55,id:'playground',name:'Детская площадка',action:'Пройти игровую площадку',reply:'Полоса препятствий пройдена. Детство одобряет!'},
 {tx:53,ty:62,id:'railway',name:'Детская железная дорога',action:'Прокатиться на ретро-поезде',reply:'Следующая станция — хорошее настроение!',historic:true},
 {tx:14,ty:57,id:'chess',name:'Леша · шахматы',action:'Сыграть с Лешей · 5 секунд'},
 {tx:14,ty:63,id:'history',name:'История аттракционов',action:'Прочитать об аттракционах прошлого',historic:true}
 ].map(p=>({...p,kind:'parkRide',x:p.tx*T+16,y:p.ty*T+48}));
 const landmarkBounds=[...clues,...badges].map(p=>({x:p.x-42,y:p.y-90,w:84,h:112})).concat(parkRides.map(p=>({...rideSilhouette(p),ride:p.id})),[
  {x:wheel.x-116,y:wheel.y-240,w:232,h:260},
  {x:photoZone.x-104,y:photoZone.y-148,w:208,h:170},
  {x:paintedBench.x-24,y:paintedBench.y-48,w:88,h:64}
 ]);
 function boundsTouch(a,b,gap=12){return a.x<b.x+b.w+gap&&a.x+a.w+gap>b.x&&a.y<b.y+b.h+gap&&a.y+a.h+gap>b.y;}
 const decorBeds=[[14,17],[25,10],[63,10],[83,23],[12,42],[22,61],[35,62],[47,64],[84,58]].map(([tx,ty])=>({x:tx*T,y:ty*T}));
 const decorSeats=[[12,18],[24,10],[64,10],[12,40],[21,61],[36,63],[83,59]].map(([tx,ty])=>({x:tx*T,y:ty*T}));
 const expansionClear=[...decorBeds,...decorSeats],settledDecor=[];
 function decorSiteClear(p){if(fairClearing(p.x/T,p.y/T))return false;if(landmarkBounds.some(b=>boundsTouch({x:p.x-36,y:p.y-24,w:90,h:55},b)))return false;for(const dx of [-32,0,32])for(const dy of [-20,0,26]){const x=p.x+dx,y=p.y+dy;if(!inside(x/T,y/T)||path(x/T,y/T)||onMotorRoad(x,y)||onSidewalk(x,y)||water(x/T,y/T)||gardenTile(Math.floor(x/T),Math.floor(y/T))||buildingTile(Math.floor(x/T),Math.floor(y/T)))return false;}return ![...extraSpots,...attractions,...supporters,...benches.map(p=>point([p.tx,p.ty])),...settledDecor].some(q=>Math.hypot(q.x-p.x,q.y-p.y)<100);}
 for(const p of expansionClear){const origin={...p};if(!decorSiteClear(p)){let done=false;for(let r=32;r<=320&&!done;r+=32)for(const [dx,dy]of [[r,0],[-r,0],[0,r],[0,-r],[r,r],[-r,r],[r,-r],[-r,-r]]){const q={x:origin.x+dx,y:origin.y+dy};if(decorSiteClear(q)){Object.assign(p,q);done=true;break;}}if(!done){const alternatives=[];for(let dx=-480;dx<=480;dx+=32)for(let dy=-480;dy<=480;dy+=32)alternatives.push({x:origin.x+dx,y:origin.y+dy,d:dx*dx+dy*dy});alternatives.sort((a,b)=>a.d-b.d);const q=alternatives.find(decorSiteClear);if(q){p.x=q.x;p.y=q.y;}}}settledDecor.push(p);}

 const squirrelTree={tx:74,ty:42,...point([74,42])};
 const squirrelCanopy={x:squirrelTree.x-77,y:squirrelTree.y-165,w:154,h:114};
 const parkSigns=[
  {x:68*T,y:10*T,style:'slogan',lines:['Учись или','проиграешь']},
  {x:27*T,y:52*T,lines:['УЛ. МИРА','ВХОД В ПАРК']},
  {x:42*T,y:25*T+40,lines:['ПАРК ПОБЕДА']},
  {x:19*T,y:28*T+40,lines:['ЗАПАДНАЯ РОЩА']},
  ...buildings.map(b=>({x:(b.tx+b.w/2)*T,y:b.ty*T+12,lines:[b.label]})),
  {x:wheel.x+130,y:wheel.y-40,lines:['КОЛЕСО','ОБОЗРЕНИЯ']},
  ...attractions.filter(a=>a.kind==='swing').map(a=>({x:a.x-95,y:a.y-25,lines:['КАЧЕЛИ']})),
  ...directionSigns.map(p=>({x:p.x,y:p.y+18,lines:p.lines})),
  {x:feedingSpot.x,y:feedingSpot.y-70,lines:['Кормить голубей','запрещено!!!']},
  {x:paintedBench.x+16,y:paintedBench.y-40,lines:['НЕ САДИТЬСЯ','ОКРАШЕНО!']},
  ...lovePosters.map(p=>({x:p.x,y:p.y+16,style:'love',lines:['DEX ♥','Мы любим людей']})),
  ...gates.map(g=>({x:(g.side==='left'?6:g.side==='right'?89:g.at)*T+16,y:(g.side==='top'?6:g.side==='bottom'?69:g.at)*T+16,lines:[g.side==='bottom'&&g.at===70?'ВЪЕЗД':'ВХОД']}))
 ];
 const signOffsets=[];for(let dx=-640;dx<=640;dx+=16)for(let dy=-640;dy<=640;dy+=16)signOffsets.push([dx,dy]);signOffsets.sort((a,b)=>a[0]*a[0]+a[1]*a[1]-b[0]*b[0]-b[1]*b[1]);const settledSigns=[];
 function signSiteClear(p){const b=signBounds(p);if(boundsTouch(b,squirrelCanopy))return false;if(landmarkBounds.some(q=>boundsTouch({...b,h:p.y-b.y+8},q)))return false;for(let x=b.x-8;x<=b.x+b.w+8;x+=8)for(let y=b.y;y<=p.y+8;y+=8){const tx=x/T,ty=y/T;if(!inside(tx,ty)||path(tx,ty)||onMotorRoad(x,y)||onSidewalk(x,y)||water(tx,ty)||buildingTile(Math.floor(tx),Math.floor(ty))||gardenTile(Math.floor(tx),Math.floor(ty))||(x>=parking.x-10&&x<=parking.x+parking.w+10&&y>=parking.y-10&&y<=parking.y+parking.h+10))return false;}if([...extraSpots,...attractions,...supporters,...benches.map(p=>point([p.tx,p.ty])),...expansionClear].some(q=>b.x<q.x+55&&b.x+b.w>q.x-55&&b.y<q.y+25&&p.y>q.y-100))return false;return !settledSigns.some(q=>{const a=signBounds(q);return b.x<a.x+a.w+12&&b.x+b.w+12>a.x&&b.y<a.y+a.h+12&&p.y+8>a.y;});}
 for(const p of parkSigns){const origin={x:p.x,y:p.y};if(!signSiteClear(p)){let found=false;for(const [dx,dy]of signOffsets){const candidate={...p,x:origin.x+dx,y:origin.y+dy};if(signSiteClear(candidate)){p.x=candidate.x;p.y=candidate.y;found=true;break;}}}settledSigns.push(p);}

 // Keep the poster legs above UpCore and clear the ride to the upper left.
 const entranceLoveSign=parkSigns.find(p=>p.style==='love'&&Math.hypot(p.x-23*T,p.y-45*T)<4*T);
 if(entranceLoveSign){entranceLoveSign.y-=T;entranceLoveSign.x+=8;}

 // Keep the painted bench beside its already settled warning sign.
 const paintWarning=parkSigns.find(p=>p.lines.includes('ОКРАШЕНО!')),paintBenchBase=benches.find(b=>b.tx===60&&b.ty===40);
 const benchCandidates=[];for(let tx=Math.floor(paintWarning.x/T)-7;tx<=Math.floor(paintWarning.x/T)+7;tx++)for(let ty=Math.floor(paintWarning.y/T)-4;ty<=Math.floor(paintWarning.y/T)+3;ty++)benchCandidates.push({tx,ty,...point([tx,ty+1])});
 benchCandidates.sort((a,b)=>Math.hypot(a.x+16-paintWarning.x,a.y-30-paintWarning.y)-Math.hypot(b.x+16-paintWarning.x,b.y-30-paintWarning.y));
 for(const q of benchCandidates){const body={x:q.x-20,y:q.y-48,w:76,h:52},base=point([q.tx,q.ty]);if(boundsTouch(body,{x:74*T+16-70,y:42*T+16-165,w:140,h:180})||landmarkBounds.slice(0,-1).some(b=>boundsTouch(body,b))||parkSigns.some(p=>{const b=signBounds(p);return boundsTouch(body,{...b,h:p.y-b.y+8});})||[...expansionClear,...extraSpots,...attractions,...supporters,...pets].some(p=>Math.hypot(p.x-q.x,p.y-q.y)<85))continue;let clear=true;for(let x=body.x;x<body.x+body.w;x+=12)for(let y=body.y;y<body.y+body.h;y+=12){if(!inside(x/T,y/T)||path(x/T,y/T)||water(x/T,y/T)||buildingTile(Math.floor(x/T),Math.floor(y/T))||gardenTile(Math.floor(x/T),Math.floor(y/T)))clear=false;}if(!clear)continue;paintBenchBase.tx=q.tx;paintBenchBase.ty=q.ty;paintedBench.x=q.x;paintedBench.y=q.y;landmarkBounds[landmarkBounds.length-1]=body;break;}

 function signBounds(p){if(p.style==='love'||p.style==='slogan')return {x:p.x-84,y:p.y-104,w:168,h:80};const w=Math.max(68,...p.lines.map(s=>s.length*7.3+26)),h=p.lines.length*17+16;return {x:p.x-w/2,y:p.y-24-h,w,h};}
 function drawLoveSign(p){const b=signBounds(p);for(const dx of [-52,52]){rect(p.x+dx-3,b.y+b.h,6,25,'#a77956');rect(p.x+dx-2,b.y+b.h,2,25,'#d8b98b');}rect(b.x+3,b.y+4,b.w,b.h,'#4b584044');rect(b.x,b.y,b.w,b.h,'#dd7e89');rect(b.x+4,b.y+4,b.w-8,b.h-8,'#fff0d5');rect(b.x+9,b.y+9,b.w-18,2,'#efc7af');text('DEX',p.x-12,b.y+29,15,'#34776d','center');text('♥',p.x+20,b.y+30,21,'#d85875','center');text(p.style==='slogan'?'Учись или':'Мы любим',p.x,b.y+51,16,'#705147','center');text(p.style==='slogan'?'проиграешь':'людей',p.x,b.y+70,17,'#b94d68','center');for(const dx of [-71,69]){rect(p.x+dx,b.y+43,2,18,'#77a479');rect(p.x+dx-3,b.y+42,8,5,'#e698a5');rect(p.x+dx,b.y+39,2,11,'#e698a5');rect(p.x+dx,b.y+43,2,2,'#f1c366');}}
 function drawAddressSign(p){if(p.style==='love'||p.style==='slogan'){drawLoveSign(p);return;}const outer=signBounds(p),b={x:outer.x+4,y:outer.y+2,w:outer.w-8,h:outer.h-4};rect(p.x-11,p.y-2,22,5,'#365b3c44');rect(p.x-3,b.y+b.h,6,25,'#647b70');rect(p.x-2,b.y+b.h,2,24,'#b1bd9b');rect(b.x+2,b.y+3,b.w,b.h,'#253f3544');rect(b.x,b.y,b.w,b.h,'#e9e4c9');rect(b.x+2,b.y+2,b.w-4,b.h-4,'#31594b');rect(b.x+5,b.y+5,b.w-10,b.h-10,'#244c40');for(const dx of [8,b.w-10])rect(b.x+dx,b.y+b.h/2-1,2,2,'#e4dfbd');p.lines.forEach((row,i)=>text(row,p.x,b.y+19+i*17,12,'#fff2d1','center'));}


 const testers=[
 {at:[22,15],look:'football',hair:'#49382d',shirt:'#f2f2ed',pants:'#9cbacf',lines:['Багов нет? А если нажать двумя пальцами?','Проверил мяч: круглый. На квадратном не воспроизводится.','Матч окончен. Регрессия — никогда.']},
 {at:[19,48],look:'cap',hair:'#936a40',shirt:'#b89379',pants:'#3e5258',lines:['У меня не борода. Это накопленный опыт регрессии.','Нашёл баг на рыбалке. Завёл на окуня.','Релиз отпускаю только после контрольного заброса.']},
 {at:[33,58],look:'lace',hair:'#755440',shirt:'#f1e7d7',pants:'#bcb4a6',lines:['Красиво! Теперь откроем в другом браузере.','На макете было море. В проде — лужа.','Отпуск прошёл проверку. Возвращение на работу — нет.']},
 {at:[54,14],look:'beard',hair:'#352e29',shirt:'#713748',pants:'#374554',lines:['Это не случайный баг. Мы с ним давно знакомы.','Разработчик: «Не трогай». Тестировщик: «Уже».','Закрыл один баг. Два пришли на похороны.']},
 {at:[73,19],look:'jacket',hair:'#79553e',shirt:'#3299c2',pants:'#455670',lines:['Я только один сценарий проверю. И ещё сорок два.','Всё по требованиям. Требования тоже завела как баг.','Чек-лист закончился. Фантазия — нет.']},
 {at:[82,55],look:'bob',hair:'#242b30',shirt:'#30343c',pants:'#353c49',lines:['На словах всё работает. Покажи логи.','Баг закрыли? Я просто уточнить. Переоткрыла.','Это не строгий взгляд. Это приёмочное тестирование.']},
 {at:[49,60],look:'tie',hair:'#61503d',shirt:'#edf0eb',pants:'#344354',lines:['Галстук — чтобы баг-репорт выглядел убедительнее.','Серьёзность: критическая. Настроение: праздничное.','Проверил вход, выход и выход из себя.']},
 {at:[13,25],look:'goatee',hair:'#62534b',shirt:'#b4d4da',pants:'#536272',lines:['Автотест зелёный. Подозрительно. Запущу ещё раз.','Тест упал сам. Я только рядом стоял.','Добавил sleep. Теперь высыпаюсь только я.']},
 {at:[81,10],look:'blonde',hair:'#c8ac70',shirt:'#f4ebd6',pants:'#c7b99c',lines:['Солнце светит. Скриншот к багу засвечен.','Проверила закат: каждый день новый билд.','На отдыхе баги не ищу. Они сами подходят.']}
 ].map((n,id)=>({...n,id,kind:'tester',action:'Поговорить',...point(n.at),talks:0}));
 // Place colleagues on open grass, with clear approaches and no overlapping scenery.
 for(const n of testers){const origin={x:n.x,y:n.y};let found=false;for(const [dx,dy] of signOffsets){const q={x:origin.x+dx,y:origin.y+dy};const box={x:q.x-26,y:q.y-58,w:52,h:70};if(!decorSiteClear(q)||parkSigns.some(p=>boundsTouch(box,{...signBounds(p),h:p.y-signBounds(p).y+8}))||testers.some(p=>p.id<n.id&&Math.hypot(q.x-p.x,q.y-p.y)<170)||[drunkGuest,sighGuest,feedingSpot,gooseHome,photoZone,wheel,...pets,...errands.map(e=>e.item)].some(p=>Math.hypot(q.x-p.x,q.y-p.y)<130)||q.x>parking.x-70&&q.x<parking.x+parking.w+70&&q.y>parking.y-90)continue;Object.assign(n,q,{tx:Math.floor(q.x/T),ty:Math.floor(q.y/T)});found=true;break;}if(!found)throw new Error('No clear tester location: '+n.id);}
 function drawTester(n){ctx.save();ctx.translate(n.x,n.y);ctx.scale(.82,.88);const skin=n.look==='goatee'?'#efc9b3':'#edbd9b';rect(-15,0,30,5,'#365c3b55');if(['lace','jacket','bob','blonde'].includes(n.look))rect(-11,-49,23,30,n.hair);rect(-8,-12,6,13,n.pants);rect(3,-12,6,13,n.pants);rect(-10,0,9,4,'#ede6d5');rect(2,0,10,4,'#ede6d5');rect(-11,-29,23,20,n.shirt);rect(-15,-27,5,12,n.shirt);rect(11,photoGreeting(n)?-37:-27,5,12,n.shirt);rect(-15,-15,5,8,skin);rect(11,photoGreeting(n)?-45:-15,5,8,skin);if(n.look==='cap'){rect(-13,-29,27,21,n.shirt);rect(-17,-27,5,12,n.shirt);rect(13,photoGreeting(n)?-37:-27,5,12,n.shirt);rect(-17,-15,5,8,skin);rect(13,photoGreeting(n)?-45:-15,5,8,skin);}
 rect(-8,-45,17,18,skin);rect(-9,-49,19,7,n.hair);rect(-9,-44,3,8,n.hair);rect(-5,-38,2,2,'#4c5952');rect(4,-38,2,2,'#4c5952');rect(-3,-30,7,2,'#ae7765');
 if(['beard','cap','goatee','tie'].includes(n.look)){rect(-8,-33,3,6,n.hair);rect(6,-33,3,6,n.hair);rect(-6,-28,13,n.look==='cap'?9:n.look==='beard'?6:3,n.hair);rect(-4,-33,9,2,n.hair);if(n.look==='goatee')rect(-1,-30,4,6,n.hair);}
 if(['football','lace','blonde'].includes(n.look)){for(const x of [-8,2]){rect(x,-40,8,6,'#806541');rect(x+1,-39,6,4,'#4d5050');}rect(0,-39,2,2,'#806541');}
 if(n.look==='football'){rect(-9,-28,19,3,'#d64d4a');rect(-15,-20,5,2,'#d64d4a');rect(11,-20,5,2,'#d64d4a');rect(5,-23,3,5,'#d64d4a');rect(-7,-52,11,5,n.hair);rect(1,-54,7,5,n.hair);}
 if(n.look==='cap'){
  // Anton: ochre/blue plaid, long beard, sunglasses resting on a black cap.
  for(const y of [-24,-15])rect(-13,y,27,4,'#638e88');for(const x of [-8,6])rect(x,-28,4,20,'#cfb99c');
  rect(-8,-33,3,9,n.hair);rect(6,-33,3,9,n.hair);rect(-6,-28,13,8,n.hair);rect(-4,-20,9,4,n.hair);rect(-2,-16,5,2,n.hair);rect(-3,-24,2,6,'#ab8254');rect(3,-26,2,6,'#795738');
  rect(-11,-52,23,8,'#2c343a');rect(-16,-46,28,3,'#d6a055');rect(-16,-43,28,1,'#ae7b43');
  for(const x of [-8,2]){rect(x,-53,8,6,'#d9c794');rect(x+1,-52,6,4,'#343e40');rect(x+2,-52,2,1,'#b9c9bd');}rect(0,-51,2,2,'#d9c794');
 }
 if(n.look==='goatee'){
  // Dima: short side-parted hair, neat beard, light blue T-shirt; no hat.
  rect(-8,-51,10,4,n.hair);rect(-4,-52,7,2,n.hair);rect(2,-48,6,3,n.hair);rect(1,-49,2,3,'#9a8773');
  rect(-7,-33,2,5,n.hair);rect(6,-33,2,5,n.hair);rect(-5,-28,11,3,n.hair);rect(-2,-25,5,1,n.hair);rect(-4,-33,3,2,n.hair);rect(2,-33,3,2,n.hair);rect(-2,-30,5,1,'#b48172');
  rect(-5,-27,3,2,'#d7e6e3');rect(3,-27,3,2,'#d7e6e3');rect(-2,-25,5,1,'#d7e6e3');
 }
 if(n.look==='lace'){for(let y=-26;y<-10;y+=5)for(let x=-8;x<10;x+=6)rect(x,y,2,3,'#fffaf0');rect(8,-27,2,20,'#5f5549');}
 if(n.look==='jacket'){for(const x of [-11,5]){rect(x,-28,7,20,'#b1bfc0');rect(x+2,-28,1,20,'#6a858e');}rect(-8,-45,16,3,n.hair);rect(-6,-52,6,3,'#3c424a');rect(2,-52,6,3,'#3c424a');}
 if(n.look==='bob'){rect(-12,-45,5,22,n.hair);rect(8,-45,5,22,n.hair);rect(-6,-28,12,5,skin);rect(-8,-25,5,6,'#484b52');rect(4,-25,5,6,'#484b52');}
 if(n.look==='tie'){rect(-1,-27,4,16,'#28313e');rect(-7,-29,6,5,'#ffffff');rect(3,-29,6,5,'#ffffff');}
 if(n.look==='blonde'){rect(8,-45,5,29,n.hair);rect(-12,-45,4,19,n.hair);rect(11,-28,3,21,'#e1d2b4');rect(12,-15,8,12,'#ded0b5');}
 ctx.restore();}

 let rideVisits={};
 const chessReplies=['Мат?! Я просто проверял, умеешь ли ты играть. Реванш?','Опять мат! Кажется, мой конь сегодня работает удалённо.','Три победы из трёх! Всё, ухожу тренировать ферзя. Он явно недорабатывает.'];
 function rideBody(x,y){return parkRides.some(p=>x>=p.tx-2&&x<=p.tx+2&&y>=p.ty-3&&y<p.ty);}
 function rideClearing(x,y){return parkRides.some(p=>Math.abs(x-p.tx)<=3&&y>=p.ty-4&&y<=p.ty+2);}
 function ridesWet(){const t=weatherTime();return snowing()||t>=30&&t<40;}
 function weatherStopsRide(chess=false){if(!ridesWet())return false;clearInput();speech=snowing()?'Переждём метель — через минутку снова можно!':chess?'Переждём дождь. Мокрый конь ходит куда попало!':'Переждём дождь — скоро снова можно кататься!';speechTime=4;return true;}
 function rideAmbientTime(){if(weatherControlled())return elapsed-rainElapsed()-(parkWeather.mode==='snow'?Math.min(SNOW_SECONDS,weatherAge()):0);const years=Math.floor(elapsed/SEASON_SECONDS),phase=seasonPhase(),snowTime=years*SNOW_SECONDS+Math.max(0,Math.min(SNOW_SECONDS,phase-SNOW_AT));return elapsed-rainElapsed()-snowTime;}
 function useParkRide(p){if(p.id==='chess')meetNeighbour('chess-alexey');clearInput();player.vx=player.vy=0;dashTime=0;if(p.id==='chess'&&(rideVisits.chess||0)>=3){$('activity-title').textContent='Вы — Леша · 3 : 0';const line=personalGreeting(p);$('activity-copy').textContent=line+' Три партии, три твоих победы!';rememberMessage('Леша: «'+line+'»','Разговор');rememberNpcVisit(p);activity.showModal();return;}if(p.id==='history'){$('activity-title').textContent='Аттракционы прошлого';$('activity-copy').textContent='«Сюрприз», «Юнга», «Карнавал», «Круговой обзор» и детская железная дорога — исторические названия из истории парка. Здесь они собраны на памятном стенде. Ретро-поезд на карте — наша игровая реконструкция детской железной дороги.';activity.showModal();return;}if(weatherStopsRide(p.id==='chess'))return;funScene={kind:'parkRide',rideId:p.id,time:0};announce(p.id==='chess'?'Шахматы · Партия '+((rideVisits.chess||0)+1)+' из 3 · 5 секунд':p.name+' · Поездка 6 секунд');}
 const trees=[];
 for(let y=2;y<ROWS-2;y++)for(let x=2;x<COLS-2;x++)if(inside(x,y)&&!fairClearing(x,y)&&!parkSigns.some(p=>boundsTouch({x:x*T-24,y:y*T-65,w:80,h:96},signBounds(p)))&&!expansionClear.some(p=>boundsTouch({x:x*T-24,y:y*T-65,w:80,h:96},{x:p.x-30,y:p.y-20,w:86,h:48}))&&!onSidewalk(x*T+16,y*T+16)&&!fenceTile(x,y)&&!onMotorRoad(x*T+16,y*T+16)&&!path(x,y)&&!water(x,y)&&!buildingTile(x,y)&&!benches.some(b=>Math.hypot(x-b.tx,y-b.ty)<3)&&![...clues,...badges,...attractions,...pets,...supporters,...lovePosters,bikeRack,...errands.map(e=>e.item),...lamps,...testers,drunkGuest,...parkSigns,...expansionClear,sighGuest,...extraSpots,gooseHome,feedingSpot,photoZone,wheel,spawn,exit,point([23,45])].some(c=>Math.hypot(x*T+16-c.x,y*T+16-c.y)<100)&&!buildings.some(b=>x>=b.tx-2&&x<=b.tx+b.w+2&&y>=b.ty-2&&y<=b.ty+b.h+2)&&Math.hypot(x-56,y-45)>4&&Math.hypot(x-62,y-35)>5&&Math.hypot(x-23,y-26)>3&&Math.hypot(x-23,y-45)>4.5&&!(x>=54&&x<=74&&y>=60&&y<=70)&&!(x>=68&&x<=76&&y>=24&&y<=31)&&!gardenTile(x,y)&&!flowerBeds.some(b=>x>=b.tx-2&&x<=b.tx+b.w+2&&y>=b.ty-2&&y<=b.ty+b.h+3)&&!picnicTables.some(b=>Math.hypot(x-b.tx,y-b.ty)<5)&&!directionSigns.some(b=>Math.hypot(x-b.tx,y-b.ty)<4)&&!(x>65&&y>42&&y<61)&&((x*37+y*61)%19<5)){if(![stoneSite,janitorHome,...janitorLeaves].some(p=>Math.hypot(x*T+16-p.x,y*T+16-p.y)<46)&&!rideClearing(x,y))trees.push({tx:x,ty:y});}
 const treeSet=new Set(trees.map(t=>`${t.tx},${t.ty}`));
 function solidTile(x,y,ignoreBMW=false){return extraSpots.some(p=>p.kind==='magician'&&x>=p.tx-1&&x<=p.tx+1&&y===p.ty-1)||extraSpots.some(p=>p.kind==='artist'&&x===p.tx+1&&(y===p.ty-1||y===p.ty))||rideBody(x,y)||testers.some(n=>n.tx===x&&n.ty===y)||fenceTile(x,y)||(x===39&&y===47)||x<0||y<0||x>=COLS||y>=ROWS||(!inside(x,y)&&!onSidewalk(x*T+16,y*T+16)&&!onMotorRoad(x*T+16,y*T+16))||(!ignoreBMW&&!driving&&inBMW((x+.5)*T,(y+.5)*T))||((x+.5)*T>golf.x-26&&(x+.5)*T<golf.x+26&&(y+.5)*T>golf.y-40&&(y+.5)*T<golf.y+42)||(x===Math.floor(brother.x/T)&&y===Math.floor(brother.y/T))||(x===squirrelTree.tx&&(y===squirrelTree.ty||y===squirrelTree.ty-1))||extraSpots.some(p=>['bush','coffee','bin','questAuthor'].includes(p.kind)&&x===p.tx&&y===p.ty-1)||extraSpots.some(p=>p.kind==='squirrel'&&extras.nut!==2&&x===p.tx&&y===p.ty-1)||gardenTile(x,y)||treeSet.has(`${x},${y}`)||water(x,y)||fountain(x,y)||buildingTile(x,y)||objectTile(x,y)||(y===37&&x>=60&&x<=64)||parkSigns.some(p=>Math.floor(p.x/T)===x&&Math.floor(p.y/T)===y)||benches.some(b=>y===b.ty&&x>=b.tx&&x<=b.tx+1);}
 function canStand(x,y,ignoreBMW=false){const r=9;return [[x-r,y-r],[x+r,y-r],[x-r,y+r],[x+r,y+r]].every(([a,b])=>!solidTile(Math.floor(a/T),Math.floor(b/T),ignoreBMW));}
 const player={x:spawn.x,y:spawn.y,vx:0,vy:0,face:'down',dx:0,dy:1};
 // Small local routines keep quest characters close to their familiar landmarks.
 const residentRoutines=supporters.map((npc,id)=>({npc,id,home:{x:npc.x,y:npc.y},route:null,goal:0,wait:1+id*.4}));
 let residentRemark=0,residentRemarkWait=0;
 function syncErrandGivers(){errandGivers.forEach((g,i)=>{g.x=errands[i].giver.x;g.y=errands[i].giver.y;});}
 function restoreResidents(saved=[]){
  residentRemark=residentRemarkWait=0;
  residentRoutines.forEach((r,i)=>{const p=saved?.[i],valid=p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.hypot(p.x-r.home.x,p.y-r.home.y)<=42&&residentClear(p.x,p.y);Object.assign(r.npc,valid?{x:p.x,y:p.y}:r.home,{moving:false,stride:0,face:1});r.goal=0;r.wait=1+i*.4;});syncErrandGivers();
 }
 function residentClear(x,y){return canStand(x,y)&&!onMotorRoad(x,y)&&!parkSigns.some(p=>boundsTouch({x:x-12,y:y-48,w:24,h:52},signBounds(p),0));}
 function residentSegment(a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(1,Math.ceil(d/5));for(let i=0;i<=steps;i++)if(!residentClear(a.x+(b.x-a.x)*i/steps,a.y+(b.y-a.y)*i/steps))return false;return true;}
 function updateResidents(dt){if(auroraLevel()>.25){supporters.forEach(n=>n.moving=false);return;}
  residentRemark=Math.max(0,residentRemark-dt);residentRemarkWait=Math.max(0,residentRemarkWait-dt);
  const girl=errands[1].giver,searching=errandStates[1]===0,nearGirl=Math.hypot(player.x-girl.x,player.y-girl.y)<180;
  if(ambientSceneBusy()||!searching||!nearGirl||momentsBusy()||speechTime>0||!!encounterGreeting||weatherSpeaking())residentRemark=0;
  else if(!residentRemark&&residentRemarkWait===0){residentRemark=3.5;residentRemarkWait=16;}
  for(const r of residentRoutines){
   const n=r.npc;if(bikeCourtesy.has(n))continue;n.moving=false;if(groupPhotoMember(n))continue;
   const job=errands.findIndex(e=>e.giver===n),waiting=job>=0&&(errandStates[job]===1||errandStates[job]===2)||n===girl&&!searching;
   if(waiting||reduced||ridesWet()||Math.hypot(player.x-n.x,player.y-n.y)<90||encounterGreeting?.npc===n)continue;
   if(r.wait>0){r.wait=Math.max(0,r.wait-dt);continue;}
   if(!r.route){r.route=[r.home];for(const [dx,dy] of [[-28,0],[0,-24],[28,0],[0,20]]){const p={x:r.home.x+dx,y:r.home.y+dy};if(residentSegment(r.home,p)){r.route.push(p,r.home);}}r.goal=r.route.length>1?1:0;}
   const target=r.route[r.goal],dx=target.x-n.x,dy=target.y-n.y,d=Math.hypot(dx,dy);
   if(d<.5){r.goal=(r.goal+1)%r.route.length;r.wait=n===girl?1.8:2+r.id%3;continue;}
   const travel=Math.min(d,(n===girl?19:14+r.id%3)*dt),x=n.x+dx/d*travel,y=n.y+dy/d*travel;
   if(!residentClear(x,y)||residentRoutines.some(other=>other!==r&&Math.hypot(other.npc.x-x,other.npc.y-y)<27)){r.wait=1;r.goal=0;continue;}
   n.x=x;n.y=y;n.moving=true;n.stride=(n.stride||0)+travel*.2;if(Math.abs(dx)>.1)n.face=Math.sign(dx);
  }
  syncErrandGivers();
 }
 function drawResidentActivity(n,waving,reading){
  if(n.moving||waving||reading||ridesWet())return;
  const id=supporters.indexOf(n);if(id<0)return;
  const skin=npcAppearance(n).skin,motion=reduced?0:Math.sin(elapsed*2+id)*1.5;
  if(id===6){if(errandStates[1]!==0)return;rect(10,-32,4,14,skin);rect(2,-39,12,4,skin);rect(-16,-12,6,8,'#81735b');}
  else if(id===1){rect(8,-23,8,13,'#3e5457');rect(10,-21,4,8,'#b8d2cc');rect(6,-13,5,4,skin);}
  else if(id===3){drawQuestBook(0,-16,1,true);rect(-12,-16,4,5,skin);rect(8,-16+motion,4,5,skin);line(7,-22+motion,3,-16,'#716049',1);}
  else if(id===4){rect(-10,-31,20,10,'#425453');rect(-4,-30,8,8,'#b6c9b0');rect(-2,-28,4,4,'#3c555f');rect(-14,-29,5,5,skin);rect(9,-29,5,5,skin);}
  else if(id===0){rect(-20,-25+motion,10,4,skin);rect(10,-25-motion,10,4,skin);}
  else if(id===2){rect(10,-20,2,13,'#608352');for(const [x,y]of [[8,-23],[12,-23],[10,-26]])rect(x,y,4,4,'#e8bea3');rect(9,-14,5,4,skin);}
  else if(id===5){rect(10,-32,4,14,skin);rect(2,-38,12,4,skin);}
 }

 // AFK is input inactivity, separate from the optional no-progress hint timer.
 const IDLE_SECONDS=60;
 let inactiveTime=0,idleEscort=null,idleRouteRetry=0;
 function notePlayActivity(){inactiveTime=0;idleRouteRetry=0;if($('idle-warning-status').textContent)$('idle-warning-status').textContent='';}
 function idleWarning(){return !idleEscort&&inactiveTime+1e-7>=IDLE_SECONDS-10&&inactiveTime<IDLE_SECONDS&&!blocked()&&!idleExempt();}
 function idleExempt(){return observing||!!restingBench||!!funScene||!!feedScene||!!towScene||!!trafficStop||wheelTime>0||swingTime>0||karaokeTime>0||pumpTime>0||petTime>0||!!coin;}
 function updateInactivity(dt){
  if(idleEscort)return;
  if(idleExempt()||!inside(player.x/T,player.y/T)||keys.size||Math.hypot(stick.x,stick.y)>.01||driving&&Math.abs(driveSpeed)>2){notePlayActivity();return;}
  const before=inactiveTime;inactiveTime+=dt;if(before<IDLE_SECONDS-10&&inactiveTime+1e-7>=IDLE_SECONDS-10)$('idle-warning-status').textContent='Охрана: «Гражданин, вы гуляете или загружаетесь?» Двиньтесь в течение 10 секунд, чтобы продолжить прогулку.';idleRouteRetry=Math.max(0,idleRouteRetry-dt);
  if(inactiveTime+1e-7>=IDLE_SECONDS&&idleRouteRetry===0){beginIdleEscort();idleRouteRetry=10;}
 }
 const exploredTiles=new Set();let hintLevels={},tutorialSeen={car:false,item:false},idleSeconds=0,idleOffered=false,progressKey='',pendingReset=null;
 function askReset(kind){pendingReset=kind;clearInput();$('reset-message').textContent=kind==='logos'?'Спрятать все найденные логотипы? Ответы и поручения сохранятся.':'Начать новую прогулку? Вопросы, находки, достижения и результат этой прогулки будут сброшены. Настройки сохранятся.';$('reset-confirm').showModal();}
 function cancelReset(){pendingReset=null;$('reset-confirm').close();}
 function confirmReset(){const kind=pendingReset;cancelReset();if(kind==='logos'){if(finished)return;collected.clear();badgeSearch=-1;lastBadge=-1;save();closeJournal();announce('Логотипы снова спрятаны. Ответы и поручения сохранены.');}else if(kind==='all'){savedRun=null;start();reset();}}
 let cameraLeadX=0,cameraLeadY=0,navCache=null,immersive=false,panelCollapsed=comfort.panelCollapsed;
 function updateCameraLead(dt){
  if(reduced){cameraLeadX=cameraLeadY=0;return;}
  let x=0,y=0;
  if(driving){const distance=Math.max(-80,Math.min(115,driveSpeed*.32));x=-Math.sin(bmw.angle)*distance;y=Math.cos(bmw.angle)*distance;}
  else if(cycling){const speed=Math.hypot(player.vx,player.vy),distance=Math.min(72,Math.max(0,speed-25)*.3);if(speed){x=player.vx/speed*distance;y=player.vy/speed*distance;}}
  x=Math.max(-viewW*.2,Math.min(viewW*.2,x));y=Math.max(-viewH*.18,Math.min(viewH*.18,y));
  const blend=1-Math.exp(-dt*3.5);cameraLeadX+=(x-cameraLeadX)*blend;cameraLeadY+=(y-cameraLeadY)*blend;
  if(Math.abs(cameraLeadX)<.05&&x===0)cameraLeadX=0;if(Math.abs(cameraLeadY)<.05&&y===0)cameraLeadY=0;
 }
 function mobileScreen(){return window.matchMedia?.('(pointer: coarse)').matches===true;}
 function initMobileScreen(){if(!mobileScreen())return;immersive=true;document.documentElement?.classList.add('immersive');$('fullscreen-button').textContent='Выйти из полного экрана';$('fullscreen-button').setAttribute('aria-label','Выйти из полного экрана');}
 function enterMobileFullscreen(){if(!mobileScreen()||!immersive||document.fullscreenElement)return;try{const request=document.documentElement?.requestFullscreen?.();request?.catch(()=>{});}catch{}}
 async function toggleFullscreen(){clearInput();immersive=!immersive;document.documentElement?.classList.toggle('immersive',immersive);$('fullscreen-button').textContent=immersive?'Выйти из полного экрана':'⛶ На весь экран';$('fullscreen-button').setAttribute('aria-label',immersive?'Выйти из полного экрана':'На весь экран');try{if(immersive&&!document.fullscreenElement)await document.documentElement?.requestFullscreen?.();else if(!immersive&&document.fullscreenElement)await document.exitFullscreen?.();}catch{announce('Режим большого экрана включён. Повторное нажатие вернёт обычный вид.');}resize();}
 function syncPanel(){
  $('game-toolbar').classList.toggle('collapsed',panelCollapsed);
  $('collapse-panel').textContent=panelCollapsed?'⌄ Панель':'⌃ Свернуть';
  $('collapse-panel').setAttribute('aria-expanded',String(!panelCollapsed));
  $('collapse-panel').setAttribute('aria-label',panelCollapsed?'Развернуть панель':'Свернуть панель');
 }
 function togglePanel(){panelCollapsed=!panelCollapsed;comfort.panelCollapsed=panelCollapsed;syncPanel();try{localStorage.setItem('dex-comfort',JSON.stringify(comfort));}catch{}resize();}
 let badgeSearch=-1;
 let freeRoam=false,finalResult=null;
 let started=false,finished=false,elapsed=0,mistakes=0,current=-1,nearest=-1,walk=0;
 let dashTime=0,dashCooldown=0,dashX=0,dashY=1,scanTime=0,scanCooldown=0,scanTarget=-1;
 let noticeTime=0,saveClock=0,savedRun=null,last=0,acc=0,camX=0,camY=0,viewW=900,viewH=480,viewCSSHeight=480,particles=[];
 let errandJoy=[0,0];
 let karaokeTime=0,joyTime=0,speechTime=0,speech='',lastBadge=-1,activePet=null,petTime=0,swingTime=0,wheelTime=0,wheelAngle=0,coin=null,coinCooldown=0;
 let carouselAngle=0;
 let birdWait=8,birdFlight=0,birdDirection=1,birdHeight=.3,birdOrigin=null;
 const blocked=()=>$('photo-compare').open||$('photo-viewer').open||$('melody-dialog').open||$('fair-award-dialog').open||$('fair-dialog').open||!!photoMode||!started||(finished&&!freeRoam)||quiz.open||$('quiz-review').open||$('farewell').open||info.open||journal.open||win.open||activity.open||$('reset-confirm').open||$('away-pause').open||document.hidden;
 const formatTime=t=>`${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;
 const approach=(a,b,n)=>a<b?Math.min(a+n,b):Math.max(a-n,b);
 function clearInput(){keys.clear();resetStick();if(cycling)player.vx=player.vy=0;}
 function resetStick(){const id=stick.pointer;stick.x=stick.y=0;stick.pointer=null;const base=$('joystick');$('joystick-knob').style.transform='translate(0px,0px)';base.classList.remove('is-active');if(id!==null&&base.hasPointerCapture?.(id))base.releasePointerCapture(id);}
 function moveStick(e){if(e.pointerId!==stick.pointer)return;const b=$('joystick').getBoundingClientRect(),r=b.width*.32,dx=e.clientX-b.left-b.width/2,dy=e.clientY-b.top-b.height/2,len=Math.hypot(dx,dy),clamped=Math.min(r,len),dead=r*.13,amount=Math.min(1,Math.max(0,(clamped-dead)/(r-dead))*comfort.sensitivity);stick.x=len?dx/len*amount:0;stick.y=len?dy/len*amount:0;$('joystick-knob').style.transform=`translate(${len?dx/len*clamped:0}px,${len?dy/len*clamped:0}px)`;}
 let observing=false,inputQuietUntil=0;
 function armInputGuard(){notePlayActivity();inputQuietUntil=Date.now()+400;clearInput();}
 function guardedInput(){return Date.now()<inputQuietUntil;}
 function setObservation(value){observing=!!value&&!!restingBench&&!blocked();document.documentElement?.classList.toggle('observing',observing);$('observe-return').hidden=!observing;clearInput();if(!observing)armInputGuard();}
 function handlePlayInput(e){const inGame=$('game-viewport').contains?.(e.target);if(inGame)notePlayActivity();if(observing&&(inGame||e.type==='keydown')){e.preventDefault();e.stopImmediatePropagation();setObservation(false);return;}if(guardedInput()&&(inGame||e.type==='keydown')){e.preventDefault();e.stopImmediatePropagation();}}
 function mobileCopy(value){if(!mobileScreen())return value;return String(value).replace(/E · /g,'').replace(/Нажмите Q или «Сканер»/g,'Нажмите «Сканер»').replace(/Откройте J — журнал/g,'Откройте «Журнал»').replace(/через E/g,'экранной кнопкой').replace(/ещё раз E/g,'ещё раз кнопкой действия').replace(/↓ или пробел — тормоз/g,'нажмите педаль «Тормоз»').replace(/нажмите E/gi,'нажмите кнопку действия');}
 function mobileHUD(){if(!mobileScreen())return;$('journal-button').textContent='Журнал';$('fullscreen-journal').textContent='Журнал';$('map-button').textContent='Карта';$('horn-button').textContent='Сигнал';$('horn-button').setAttribute('aria-label','Звуковой сигнал');$('sport-toggle').textContent=sportMode?'Спорт: вкл':'Спорт: выкл · ≤50';$('driving-hint').textContent=flatTyre?'Колесо спустило · выйдите и подкачайте':'Стик — руль · Педали — газ и тормоз';$('dash-charge').textContent=driving?'Стик — руль · Справа педали':dashCooldown>0?'Рывок: '+dashCooldown.toFixed(1)+' с':'Кнопка ⇧ — быстрый шаг';if(scanCooldown<=0)$('scan-button').textContent='Сканер';}
 let restingBench=null,messageHistory=[],lastCapturedSpeech='',lastCapturedActivity='';
 // Migrate names once per reference correction; stable actor IDs and progress stay intact.
 function migrateCharacterMessage(message,version=0){
  let text=String(message).slice(0,900);
  // Before park82 only the cap-wearing fisherman was named Dima.
  if(version<82)text=text.replace(/[А-Яа-яЁё]+/g,word=>({Дима:'Антон',Димы:'Антона',Диме:'Антону',Диму:'Антона',Димой:'Антоном'}[word]||word));
  if(version>=75)return text;
  const names={Соня:'Аня',Алексей:'Леша',Алексеем:'Лешей',Алина:'Бегунья',Игорь:'Посетитель с телефоном',Вера:'Любительница цветов',Виктор:'Посетитель с блокнотом',Никита:'Фотолюбитель',Роман:'Максим',Даниэль:'Гитарист',Мира:'Скрипачка',Лев:'Барабанщик',Костя:'Соперник в мешках',Семён:'Участник перетягивания каната',Лена:'Участник перетягивания каната',Нина:'Участник перетягивания каната',Артём:'Участник перетягивания каната',Павел:'Ведущий кольцеброса',Тамара:'Посетительница',Тамары:'по прогулке',Борис:'Посетитель',Ольга:'Мама',Миша:'Мальчик'};
  text=text.replace(/Знакомство: ([^—]+) — ([^.]+)\./g,(all,name,role)=>{const old=name.trim(),next=names[old];return next?('Знакомство: '+(['Аня','Леша','Максим'].includes(next)?next+' — ':'')+role+'.'):all;});
  text=text.replace(/[А-Яа-яЁё]+/g,word=>names[word]||word).replace(/Шахматист:/g,'Леша:');
  return text.replace(/Вы — Иван\. /g,'').replace(/Иван —/g,'Вы —').replace(/Привет, Иван!/g,'Привет!').replace(/Спасибо, Иван!/g,'Спасибо!').replace(/, Иван\?/g,'?').replace(/Иван, ([а-яё])/g,(_,letter)=>letter.toUpperCase()).replace(/Иван, /g,'').replace(/помощь Ивана/g,'вашу помощь').replace(/Знакомые Ивана/g,'Ваши знакомые').replace(/победы Ивана/g,'ваши победы').replace(/результат Ивана/g,'ваш результат').replace(/узнают Ивана/g,'узнают вас').replace(/поддержать Ивана/g,'поддержать вас').replace(/Ивана/g,'героя').replace(/Иван/g,'герой');
 }
 function rememberMessage(message,kind='Подсказка'){const text=String(message||'').trim().slice(0,900);if(!text)return;if(messageHistory.some(m=>m.text===text&&elapsed-m.time<3))return;messageHistory.push({text,kind,time:Math.floor(elapsed)});if(messageHistory.length>30)messageHistory.shift();}
 function captureMessages(){if(speechTime>0&&speech&&speech!==lastCapturedSpeech){rememberMessage(speech,'Реплика');lastCapturedSpeech=speech;}if(speechTime<=0)lastCapturedSpeech='';const copy=activity.open?$('activity-copy').textContent:'';if(copy&&copy!==lastCapturedActivity)rememberMessage(copy,'Разговор');lastCapturedActivity=copy;}
 function renderMessageHistory(){captureMessages();const list=$('message-history');list.replaceChildren();if(!messageHistory.length){const li=document.createElement('li');li.textContent='Здесь появятся подсказки и реплики этой прогулки.';list.append(li);}for(const m of [...messageHistory].reverse()){const li=document.createElement('li'),stamp=document.createElement('small'),p=document.createElement('p');stamp.textContent=formatTime(m.time)+' · '+m.kind;p.textContent=m.text;li.append(stamp,p);list.append(li);}}
 function benchActions(){return benches.filter(b=>b!==paintBenchBase).map(b=>({x:b.tx*T+32,y:b.ty*T+42,kind:'bench',action:'Присесть на скамейку',bench:b}));}
 function toggleBench(a){if(observing)setObservation(false);if(!restingBench&&ridesWet()){announce(snowing()?"Переждём метель в укрытии. Скамейки пока заметает.":"Скамейка мокрая. Присядем, когда закончится дождь.");return;}clearInput();player.vx=player.vy=0;dashTime=0;if(restingBench){restingBench=null;speech='Отдохнул. Можно идти дальше!';}else{restingBench=a.bench;player.face='down';speech='Хорошо сидим. Парк никуда не торопится.';}speechTime=4;save();}
 function interactionTag(a){if(a.type==='question')return a.hidden?'⌕ Осмотреть':'E · Вопрос '+(a.id+1);if(a.kind==='snowman')return '◇ '+actionLabel(a);if(a.kind==='bench')return restingBench?'↑ Встать':'▰ Отдохнуть';if(a.kind==='parkRide'&&a.id!=='history')return (rideVisits[a.id]?'✓ ':'◇ ')+(a.id==='chess'?'Шахматы':'Прокатиться');if(['wheel','swing','carousel','trampoline'].includes(a.kind))return (visitCount(a.kind)?'✓ ':'◇ ')+'Прокатиться';if(a.type==='giver'||['tester','balloonOwner','borrowGolf'].includes(a.kind))return '… Поговорить';if(a.type==='badge')return collected.has(a.id)?'✓ Найдено':'⌕ Осмотреть';return '◇ '+(a.action||'Осмотреть');}
 function announce(s,options){queueNotice(s,options);}
 function burst(x,y,color){if(reduced)return;for(let i=0;i<(comfort.lightweight?5:12);i++){const a=i*Math.PI*2/(comfort.lightweight?5:12);particles.push({x,y,vx:Math.cos(a)*65,vy:Math.sin(a)*65,life:.5,color});}particles=particles.slice(-80);}
 function save(){if(!started)return;captureMessages();try{localStorage.setItem(SAVE_KEY,JSON.stringify({version:3,characterNamesVersion:82,bearConcerts,bearNut:bearNut.phase,bearNutReturns,metNeighbours:[...metNeighbours],catCompanion:{...catCompanion,x:seekCat.x,y:seekCat.y},picnicHelps:picnic.helps,triedActivities:[...triedActivities],photoNav,birdEcho:birdEcho?{sequence:birdEcho.sequence}:null,dandelionBlows,melody,seekCat:{stage:seekCat.stage,started:seekCat.state!=='invite'},personalMarker,musicWalk,strollPlan,walkEvents,fair:fairStats,fairRibbon,fairInterrupted:fairSavedRounds(),fairAward,quizRetry:{bank:'idle41',attempts:quizRetries},janitorHelp,bicycle:{x:bike.x,y:bike.y,angle:bike.angle,rented:bike.rented,riding:cycling,returns:bike.returns},courier:{stage:courier.stage,x:courier.x,y:courier.y,phase:courier.phase},auroraSeen,dawnFlockCycle,photographer:photographer.stage,npcMemory,farewellProfile,questionReview:{bank:'idle41',errors:Object.entries(questionErrors).map(([id,count])=>[Number(id),count])},wheelShow:{cycle:wheelShowCycle,requested:wheelShowRequested,start:wheelLightShow?.start},weatherVersion:2,parkWeather,magicShows,heartCycle,journalTab,pinnedActivity,portraits,planeMail:[...planeMail],fetchTrips,cinemaVisits,bubblePops,residents:supporters.map(n=>({x:n.x,y:n.y})),kiteFlights,collage,squirrelStory,snowman,fountainShowCycle,photoShots,boat:{wins:boatWins,lastCycle:boatLastCycle,trip:paperVoyage},garden,messageHistory,rideVisits,exploredTiles:[...exploredTiles],hintLevels,tutorialSeen,freeRoam,finalResult,trackedPlace,memories:[...memories],visitedPlaces:[...visitedPlaces],tyre:{driveSeconds,flat:flatTyre,repaired:tyreRepaired},trackedErrand,sportMode,fines,luckDelay,vehicle:bmwAvailable&&!towScene?{x:bmw.x,y:bmw.y,angle:bmw.angle,driving,windshieldBroken}:{x:parking.x+368,y:parking.y+45,angle:0,driving:false},achievements:[...achievements],extras,errands:errandStates,discovered:[...discovered],solved:[...solved],collected:[...collected],elapsed,mistakes,x:player.x,y:player.y,finished}));$('save-status').textContent='✓ Сохранено';}catch{$('save-status').textContent='Сохранение недоступно';}}
 function safeSavedPoint(x,y){if(canStand(x,y))return {x,y};for(let radius=1;radius<=5;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){const p=point([Math.floor(x/T)+dx,Math.floor(y/T)+dy]);if(canStand(p.x,p.y))return p;}return {...spawn};}
 function readSave(){try{const v=JSON.parse(localStorage.getItem(SAVE_KEY)),ids=(a,n)=>Array.isArray(a)&&a.length<=n&&new Set(a).size===a.length&&a.every(i=>Number.isInteger(i)&&i>=0&&i<n);if(!v||![1,2,3].includes(v.version)||!ids(v.solved,v.version===1?7:TOTAL)||!ids(v.collected,8)||!Number.isFinite(v.elapsed)||v.elapsed<0||v.elapsed>1e8||!Number.isInteger(v.mistakes)||v.mistakes<0||!Number.isFinite(v.x)||!Number.isFinite(v.y)||(v.version===3&&!inside(v.x/T,v.y/T)&&!onSidewalk(v.x,v.y)&&!onMotorRoad(v.x,v.y))||typeof v.finished!=='boolean'||(v.finished&&v.solved.length!==(v.version===1?7:TOTAL)))return null;if(v.version===3&&!ids(v.discovered,TOTAL))return null;if(v.errands!==undefined&&(!Array.isArray(v.errands)||v.errands.length!==2||!v.errands.every(n=>Number.isInteger(n)&&n>=0&&n<=3)))return null;return {...v,version:3,errands:v.errands||[0,0],discovered:v.discovered||v.solved.filter(i=>i>=15),...safeSavedPoint(v.version<3?spawn.x:v.x,v.version<3?spawn.y:v.y),finished:v.finished&&v.solved.length===TOTAL&&v.collected.length===8&&v.errands?.every(s=>s===3)===true};}catch{return null;}}
 function restore(v){closePhotoComparison(false);restoreBear(v);restoreNeighbours73(v);restoreWalkDiscoveries(v);restoreFair(v);restoreQuizRetries(v);resetPark62();resetBike();restoreJanitor(v);restoreParkRoutines();restoreNeighbourStories(v);restoreSkyMoments(v);restorePhotographer(v);restoreNpcMemory(v);restoreQuestionReview(v);restoreWheelShow(v);restoreParkWeather(v);clearTrafficDialogue();closePhotoMode();jubileeGuests=[];jubileeGuestLevel=0;journalTab=journalTabs.includes(v.journalTab)?v.journalTab:'quest';pinnedActivity=pinnedActivities().some(p=>p.id===v.pinnedActivity)?v.pinnedActivity:'';idleEscort=null;notePlayActivity();restoreResidents(v.residents);restoreNature(v);restoreBubbles(v);restoreParkPlay(v);restorePortraits(v);restoreLife46(v);restoreStories(v);restoreWonders(v);restoreMoments(v);restoreGarden(v.garden);resetMap();observing=false;document.documentElement?.classList.remove("observing");encounterGreeting=encounterNPC=null;encounterText="";greetingCooldowns.clear();bathSparrows=[];sparrowCycle=-1;restingBench=null;lastCapturedSpeech=lastCapturedActivity="";messageHistory=Array.isArray(v.messageHistory)?v.messageHistory.filter(m=>m&&typeof m.text==="string"&&Number.isFinite(m.time)&&m.time>=0).slice(-30).map(m=>({text:migrateCharacterMessage(m.text,v.characterNamesVersion),time:m.time,kind:["Подсказка","Реплика","Разговор"].includes(m.kind)?m.kind:"Подсказка"})):[];rideVisits=Object.fromEntries(parkRides.filter(p=>p.id!=='history').map(p=>[p.id,Math.max(0,Math.min(p.id==='chess'?3:99,Number.isInteger(v.rideVisits?.[p.id])?v.rideVisits[p.id]:0))]));badgeSearch=-1;errandJoy=[0,0];cameraLeadX=cameraLeadY=0;navCache=null;exploredTiles.clear();if(Array.isArray(v.exploredTiles))v.exploredTiles.forEach(k=>{if(Number.isInteger(k)&&k>=0&&k<24*19)exploredTiles.add(k);});hintLevels={};for(let i=0;i<20;i++)if(Number.isInteger(v.hintLevels?.[i]))hintLevels[i]=Math.max(0,Math.min(3,v.hintLevels[i]));tutorialSeen={car:v.tutorialSeen?.car===true,item:v.tutorialSeen?.item===true};idleSeconds=0;idleOffered=false;progressKey='';freeRoam=false;finalResult=null;if(v.finished&&v.finalResult&&Number.isFinite(v.finalResult.elapsed)&&v.finalResult.elapsed>=0&&Number.isInteger(v.finalResult.mistakes)&&v.finalResult.mistakes>=0&&["pigeons","red","speeding","parking"].every(k=>Number.isInteger(v.finalResult.fines?.[k])&&v.finalResult.fines[k]>=0)){finalResult=v.finalResult;}trackedPlace=v.trackedPlace===-3&&photoNav?-3:v.trackedPlace===-2&&personalMarker?-2:Number.isInteger(v.trackedPlace)&&mapPlaces[v.trackedPlace]?v.trackedPlace:-1;memories.clear();if(Array.isArray(v.memories))v.memories.forEach(m=>{if(Array.isArray(m)&&memoryTypes.some(t=>t.id===m[0])&&Number.isFinite(m[1])&&m[1]>=0)memories.set(m[0],m[1]);});hornReaction=null;visitedPlaces.clear();if(Array.isArray(v.visitedPlaces))v.visitedPlaces.forEach(i=>{if(Number.isInteger(i)&&i>=0&&i<mapPlaces.length)visitedPlaces.add(i);});driveSeconds=Number.isFinite(v.tyre?.driveSeconds)?Math.max(0,Math.min(30,v.tyre.driveSeconds)):0;flatTyre=v.tyre?.flat===true;tyreRepaired=v.tyre?.repaired===true;pumpTime=hornCooldown=hornGlow=0;trackedErrand=[0,1].includes(v.trackedErrand)?v.trackedErrand:-1;sportMode=v.sportMode!==false;fines=Object.fromEntries(['pigeons','red','speeding','parking'].map(k=>[k,Number.isSafeInteger(v.fines?.[k])&&v.fines[k]>=0?v.fines[k]:k==='pigeons'?(v.extras?.feeds||0):0]));carTrail=[];tyreMarks=[];exhaustPuffs=[];skidPose=null;exhaustClock=0;stormBag=null;swiftOrigin=null;wanderers.length=0;carPitch=carRoll=visualLastSpeed=0;brotherEscape=null;brotherShout=emergencyBrake=wheelTravel=0;Object.assign(brother,brotherHome);parkingViolations=parkingStillTime=0;parkingFinedHere=false;brotherRefusal=brotherRequests=0;windshieldBroken=v.vehicle?.windshieldBroken===true;nutAttack=null;nutImpact=0;brakeGlow=trafficLightClock=redLightViolations=0;fountainParty=dizzyTime=0;guestEscort=null;Object.assign(drunkGuest,guestHome);steerValue=0;luckDelay=Number.isFinite(v.luckDelay)&&v.luckDelay>=0&&v.luckDelay<=10?v.luckDelay:-1;luckAfter=whiteMark=0;luckyOrigin=luckyDrop=null;bmwAvailable=true;towScene=null;speedingViolations=0;trafficStop=null;trafficCooldown=0;driving=false;driveSpeed=0;if(v.vehicle&&[v.vehicle.x,v.vehicle.y,v.vehicle.angle].every(Number.isFinite)&&canDriveAt(v.vehicle.x,v.vehicle.y,v.vehicle.angle)){bmw.x=v.vehicle.x;bmw.y=v.vehicle.y;bmw.angle=v.vehicle.angle;driving=v.vehicle.driving===true;}achievements.clear();if(Array.isArray(v.achievements))v.achievements.forEach(id=>{if(ACHIEVEMENTS.some(a=>a.id===id))achievements.add(id);});if(fairChampion())achievements.add('fair-champion');if(v.extras?.nut===2)achievements.add('squirrel');if(v.extras?.litter===2)achievements.add('litter');latestAchievement='';extras={balloon:[0,1,2].includes(v.extras?.balloon)?v.extras.balloon:0,visits:Object.fromEntries(Object.entries(repeatRules).map(([k,r])=>[k,Number.isInteger(v.extras?.visits?.[k])?Math.max(0,Math.min(r.max,v.extras.visits[k])):0])),guestRemoved:v.extras?.guestRemoved===true,feeds:[0,1,2].includes(v.extras?.feeds)?v.extras.feeds:(achievements.has('pigeons')?1:0),boots:[0,1,2].includes(v.extras?.boots)?v.extras.boots:(achievements.has('fish')?1:0),nut:[0,1,2].includes(v.extras?.nut)?v.extras.nut:0,litter:[0,1,2].includes(v.extras?.litter)?v.extras.litter:0,debt:v.extras?.debt===true,beauty:v.extras?.beauty===true,cups:Number.isInteger(v.extras?.cups)?Math.max(0,Math.min(8,v.extras.cups)):0,luckMoney:Number.isInteger(v.extras?.luckMoney)?Math.max(0,Math.min(100000,v.extras.luckMoney)):0};errandStates=v.errands?[...v.errands]:[0,0];discovered.clear();(v.discovered||[]).forEach(i=>discovered.add(i));solved.clear();v.solved.forEach(i=>solved.add(i));collected.clear();v.collected.forEach(i=>collected.add(i));elapsed=v.elapsed;mistakes=v.mistakes;player.x=driving?bmw.x:v.x;player.y=driving?bmw.y:v.y;player.vx=player.vy=0;restoreBike(v);if(v.finished&&readyToFinish()){finish(false);if(v.freeRoam)continueWalking();}}
 // Keep resume choices in the intro; resetting or restoring a run never follows a stale goal.
 function renderIntro(v){
  // The invitation stays complete for both a new walk and a returning player.
  const solvedCount=v?.solved?.length||0,badgeCount=v?.collected?.length||0,errandCount=(v?.errands||[]).filter(state=>state===3).length;
  $('save-note').textContent=v?`Сохранено: ${solvedCount} / ${TOTAL} вопросов · ${badgeCount} / 8 DEX · ${errandCount} / 2 поручений.`:'Прогресс сохраняется на этом устройстве автоматически.';
  const goal=v&&!v.finished?returnContext(v):null,canGuide=!!goal&&v.vehicle?.driving!==true;
  $('intro-return').hidden=!goal;$('intro-return').open=false;$('save-goal').textContent=goal?.text||'';
  $('start-path-option').hidden=!canGuide;$('start-path').checked=false;
  $('start').textContent=v?(v.finished?(v.freeRoam?'Продолжить прогулку →':'Посмотреть результат →'):'Продолжить забег →'):'Выйти на старт →';
  $('fresh-start').hidden=!v;
 }
 function startFromIntro(){const guide=!$('start-path-option').hidden&&$('start-path').checked;start();if(guide)followReturnGoal();}
 function start(){if(started)return;enterMobileFullscreen();started=true;document.documentElement?.classList.add('playing');window.ParkAudio?.unlock();$('intro').hidden=true;resize();if(savedRun){restore(savedRun);const goal=returnContext();if(goal&&!blocked())announce(goal.text);}canvas.focus();save();}
 function reset(){closePhotoComparison(false);restoreBear();restoreNeighbours73();restoreWalkDiscoveries();restoreFair();restoreQuizRetries();resetPark62();resetBike();restoreJanitor();restoreParkRoutines();restoreNeighbourStories();restoreSkyMoments();restorePhotographer();restoreNpcMemory();restoreQuestionReview();restoreWheelShow();restoreParkWeather();clearTrafficDialogue();closePhotoMode();jubileeGuests=[];jubileeGuestLevel=0;journalTab='quest';pinnedActivity='';idleEscort=null;notePlayActivity();restoreResidents();restoreNature();restoreBubbles();restoreParkPlay();restorePortraits();restoreLife46();restoreStories();restoreWonders();restoreMoments();restoreGarden(null);resetMap();observing=false;document.documentElement?.classList.remove("observing");encounterGreeting=encounterNPC=null;encounterText="";greetingCooldowns.clear();bathSparrows=[];sparrowCycle=-1;restingBench=null;messageHistory=[];lastCapturedSpeech=lastCapturedActivity="";rideVisits={};badgeSearch=-1;errandJoy=[0,0];$('away-pause').close();cameraLeadX=cameraLeadY=0;navCache=null;cancelReset();exploredTiles.clear();hintLevels={};tutorialSeen={car:false,item:false};idleSeconds=0;idleOffered=false;progressKey='';freeRoam=false;finalResult=null;trackedPlace=-1;memories.clear();hornReaction=null;visitedPlaces.clear();driveSeconds=0;flatTyre=tyreRepaired=false;pumpTime=hornCooldown=hornGlow=0;trackedErrand=-1;sportMode=true;fines={pigeons:0,red:0,speeding:0,parking:0};carTrail=[];tyreMarks=[];exhaustPuffs=[];skidPose=null;exhaustClock=0;stormBag=null;swiftOrigin=null;wanderers.length=0;carPitch=carRoll=visualLastSpeed=0;brotherEscape=null;brotherShout=emergencyBrake=wheelTravel=0;Object.assign(brother,brotherHome);parkingViolations=parkingStillTime=0;parkingFinedHere=false;brotherRefusal=brotherRequests=0;windshieldBroken=false;nutAttack=null;nutImpact=0;testers.forEach(n=>n.talks=0);brakeGlow=trafficLightClock=redLightViolations=0;fountainParty=dizzyTime=0;guestEscort=null;Object.assign(drunkGuest,guestHome);steerValue=0;luckDelay=-1;luckAfter=whiteMark=0;luckyOrigin=luckyDrop=null;bmwAvailable=true;towScene=null;speedingViolations=0;trafficStop=null;trafficCooldown=0;driving=false;driveSpeed=driveSaveClock=0;Object.assign(bmw,{x:parking.x+368,y:parking.y+45,angle:0});bmwHazardTime=0;bmwNearby=false;networkTime=0;const rock=extraSpots.find(p=>p.kind==='feature');Object.assign(rock,point([rock.tx,rock.ty]));rock.move=0;detectorActive=false;detectorBeep=sprinkleTime=sprinkleCooldown=wetTime=0;achievements.clear();latestAchievement='';extras={balloon:0,nut:0,litter:0,debt:false,beauty:false,cups:0,luckMoney:0,boots:0,feeds:0,guestRemoved:false,visits:{}};coffeeTime=bushTime=bootTime=0;funScene=null;paintTime=0;Object.assign(goose,{...gooseHome,state:'idle',time:0,cooldown:0,trail:[]});feedScene=null;feedCooldown=0;pigeons.forEach(p=>{p.homeX=p.originX;p.homeY=p.originY;p.flight=0;p.cooldown=0;});birdWait=8;birdFlight=0;birdOrigin=null;errandStates=[0,0];[quiz,info,win,journal,activity].forEach(d=>d.close());solved.clear();discovered.clear();collected.clear();Object.assign(player,{x:spawn.x,y:spawn.y,vx:0,vy:0,face:'down',dx:0,dy:1});finished=false;karaokeTime=joyTime=speechTime=0;speech='';lastBadge=-1;activePet=null;petTime=0;swingTime=0;wheelTime=0;wheelAngle=0;coin=null;coinCooldown=0;$('journal-button').classList.remove('new-discovery');elapsed=mistakes=walk=dashTime=dashCooldown=scanTime=scanCooldown=noticeTime=saveClock=0;current=nearest=scanTarget=-1;particles=[];savedRun=null;clearInput();updateBikeMarker();save();canvas.focus();}
 function walkTitle(){const rides=['wheel','swing','carousel','trampoline'].reduce((n,k)=>n+visitCount(k),0)+Object.entries(rideVisits).filter(([id])=>id!=='chess').reduce((n,[,v])=>n+v,0);if(fines.parking>=2||fines.red+fines.speeding>=2)return 'Гроза парковки — парк запомнит ваш номер!';if(Object.values(fines).reduce((a,b)=>a+b,0)===0&&extras.balloon===2)return 'Друг парка — ни штрафа, ни потерянного шарика!';if(rides>=5)return 'Испытатель аттракционов — проверено на себе!';return 'Исследователь DEX — ни один тайник не устоял!';}
 function renderResultCard(){if(!finalResult)return;const c=$('result-card'),g=c.getContext('2d');c.width=1000;c.height=720;g.imageSmoothingEnabled=false;const box=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h);};const label=(str,x,y,size,color='#fff4d7')=>{g.fillStyle=color;g.font='bold '+size+'px monospace';g.fillText(String(str),x,y);};box(0,0,1000,720,'#163e37');box(20,20,960,680,'#f4e9ce');box(36,36,928,260,'#86b8bd');box(36,192,928,104,'#749956');box(82,67,48,48,'#ffe095');box(75,77,62,28,'#ffe095');for(const x of [80,200,745,860]){box(x,168,15,93,'#7b6040');box(x-34,117,82,64,'#426f4b');box(x-20,96,57,88,'#518653');box(x-13,105,22,16,'#81ab67');}box(290,239,420,57,'#d9bd7d');box(413,190,24,50,'#294b93');box(449,190,24,50,'#294b93');box(405,237,36,10,'#e7e7d2');box(450,237,36,10,'#e7e7d2');box(405,132,76,62,'#ed4b51');box(391,141,15,44,'#f2b58b');box(481,141,15,44,'#f2b58b');box(413,79,61,56,'#294b93');box(424,68,43,18,'#294b93');box(420,98,48,24,'#f2b58b');box(430,102,7,7,'#17384c');box(454,102,7,7,'#17384c');box(420,121,48,16,'#294b93');box(439,122,14,5,'#fff4dc');label('DEX',535,152,46,'#fff8dd');label('20 лет вместе',535,190,22,'#fff8dd');label('МОЯ ПРОГУЛКА В ПАРКЕ ПОБЕДА',70,350,30,'#244b41');label(finalResult.title||'Исследователь парка',70,399,30,'#8b573e');label('Время: '+formatTime(finalResult.elapsed),70,460,25,'#244b41');label('Ошибок: '+finalResult.mistakes,555,460,25,'#244b41');label('Вопросы: 20 / 20',70,507,25,'#244b41');label('Логотипы: 8 / 8',555,507,25,'#244b41');label('Поручения: 2 / 2',70,554,25,'#244b41');label('Штрафов: '+Object.values(finalResult.fines).reduce((a,b)=>a+b,0),555,554,25,'#244b41');box(70,591,860,2,'#bdc6a7');label('Спасибо за любопытство и добрые дела!',70,639,24,'#446b51');}
 function downloadResultCard(){if(!finalResult)return;const status=$('card-status');try{renderResultCard();const url=$('result-card').toDataURL('image/png');$('card-image').src=url;$('card-image').hidden=false;const a=document.createElement('a');a.href=url;a.download='DEX-прогулка-'+formatTime(finalResult.elapsed).replace(':','-')+'.png';document.body.append(a);a.click();a.remove();status.textContent='Открытка готова. Если скачивание не началось, удерживайте картинку ниже и выберите «Сохранить изображение».';}catch{status.textContent='Не удалось скачать открытку. Можно сделать скриншот карточки выше.';}}
 // Decorations follow solved answers, including old saves. They never add collision tiles.
 const jubileeMilestones=[
  {at:5,name:'Первые огоньки',copy:'Пять ответов! На арке старта появилась праздничная гирлянда.'},
  {at:10,name:'Парк наряжается',copy:'Десять ответов! Летнюю эстраду украсили флажками и шарами.'},
  {at:15,name:'Гости собираются',copy:'Пятнадцать ответов! У летней эстрады собираются гости юбилея.'}
 ];
 const jubileeLevel=()=>Math.min(3,Math.floor(solved.size/5));
 let jubileeGuests=[],jubileeGuestLevel=0;
 function jubileeProgress(){const stage=jubileeLevel(),next=jubileeMilestones[stage];return next?'До следующего украшения: '+solved.size+' / '+next.at+' ответов · '+next.name:'Парк готов к юбилею! Украшения зажглись, гости собрались у летней эстрады.';}
 function jubileeAnswer(){const milestone=jubileeMilestones.find(m=>m.at===solved.size);if(milestone)announce(milestone.copy);}
 function jubileeString(x,y,w,count,balloons=false){
  const wind=reduced?0:Math.sin(elapsed*1.7)*2,lit=nightLevel(),colors=['#dfb96d','#c9878b','#8fb7a4'];
  line(x,y,x+w/2,y+12,'#756b4c',1);line(x+w/2,y+12,x+w,y,'#756b4c',1);
  for(let i=0;i<count;i++){const px=x+(i+.5)*w/count,py=y+Math.sin((i+.5)/count*Math.PI)*12;ctx.fillStyle=colors[i%3];ctx.beginPath();ctx.moveTo(px-5,py);ctx.lineTo(px+5,py);ctx.lineTo(px+wind,py+11);ctx.closePath();ctx.fill();if(lit>.1){ctx.globalAlpha=lit*.15;rect(px-7,py-7,14,14,'#ffdd92');ctx.globalAlpha=1;}rect(px-1,py-2,3,3,lit>.1?'#fff2be':'#efe0ab');}
  if(balloons)for(const side of [0,1]){const bx=x+side*w,by=y+26;line(bx,by+48,bx+wind,by,'#8b7959',1);for(let i=0;i<3;i++){ctx.fillStyle=colors[i];ctx.beginPath();ctx.ellipse(bx+(i-1)*10+wind,by-(i%2)*11,8,11,0,0,Math.PI*2);ctx.fill();rect(bx+(i-1)*10+wind-3,by-5-(i%2)*11,2,3,'#f3e5c9');}}
 }
 function drawJubilee(){
  const stage=jubileeLevel();if(stage===0)return;
  jubileeString(route[0].x-63,route[0].y-85,126,10);
  if(stage<2)return;const b=buildings[1],x=b.tx*T,y=b.ty*T;
  jubileeString(x-12,y-17,b.w*T+24,12,true);
  rect(x+24,y+48,112,29,'#efe2bd');text('DEX · 20 ЛЕТ',x+b.w*T/2,y+68,13,'#315449','center');
 }
 function updateJubilee(dt){
  const stage=jubileeLevel();if(stage<3){jubileeGuests=[];jubileeGuestLevel=stage;return;}
  if(jubileeGuestLevel!==3){
   jubileeGuestLevel=3;jubileeGuests=[];const b=buildings[1],cx=(b.tx+b.w/2)*T,front=(b.ty+b.h)*T;
   for(const [dx,dy] of [[-58,75],[0,104],[58,75],[-106,132],[106,132],[-44,164]]){
    const seat={x:cx+dx,y:front+dy},origin={x:seat.x,y:seat.y+64};
    if(!canStand(seat.x,seat.y)||!canStand(origin.x,origin.y)||!clearSegment(origin,seat)||parkSigns.some(p=>boundsTouch({x:seat.x-16,y:seat.y-50,w:32,h:54},signBounds(p))))continue;
    jubileeGuests.push({...origin,seat,id:jubileeGuests.length,walking:true});
   }
  }
  for(const n of jubileeGuests){const dx=n.seat.x-n.x,dy=n.seat.y-n.y,d=Math.hypot(dx,dy),pace=Math.min(d,dt*25);n.walking=d>.5;if(d>.01){n.x+=dx/d*pace;n.y+=dy/d*pace;}}
 }
 function drawJubileeGuest(n){
  // The small audience stays off the stage entrance and remains passable.
  const stride=reduced||!n.walking?0:Math.sin(elapsed*8+n.id)*2,colors=['#598995','#b78278','#887f9d','#82966c'];ctx.save();ctx.translate(n.x,n.y);
  rect(-10,1,21,4,'#365c3b55');rect(-7,-9+stride,5,12,'#3c4b51');rect(2,-9-stride,5,12,'#3c4b51');rect(-8,1+stride,7,3,'#eee5cf');rect(2,1-stride,7,3,'#eee5cf');rect(-9,-27,18,20,colors[n.id%4]);rect(-8,-42,16,15,'#e9ba95');rect(-9,-44,18,10,n.id%2?'#7a5c42':'#4c4840');rect(-11,-25,4,12,colors[n.id%4]);rect(8,-25,4,12,colors[n.id%4]);
  const wave=!n.walking&&!reduced?Math.max(0,Math.sin(elapsed*1.4+n.id))*5:0;rect(-11,-15,4,5,'#e9ba95');rect(8,-15-wave,4,5,'#e9ba95');ctx.restore();
 }

 function finishPartyLevel(){if(!finished||!finalResult)return 0;const age=Math.max(0,elapsed-finalResult.elapsed);return age<12?Math.min(1,(12-age)/2):0;}
 function finishGuests(){if(!finishPartyLevel())return [];const result=[];for(const [dx,dy] of [[-96,65],[96,65],[-130,15],[130,15],[-96,-35],[96,-35],[-150,95],[150,95],[-170,135],[170,135],[-65,130],[65,130]]){const x=exit.x+dx,y=exit.y+dy;if(!canStand(x,y)||[...supporters,...testers,...extraSpots,...pets,balloonOwner,sighGuest,brother].some(n=>Math.hypot(n.x-x,n.y-y)<55)||parkSigns.some(p=>boundsTouch({x:x-14,y:y-45,w:28,h:50},signBounds(p))))continue;result.push({x,y,index:result.length});if(result.length===4)break;}return result;}
 function drawFinishGuest(p){ctx.save();ctx.globalAlpha=finishPartyLevel();drawSupporter({...p,avatar:[8,9,10,11][p.index%4],quiet:true,pose:'clap',heightScale:.92});ctx.restore();}
 function drawFinishConfetti(){const level=finishPartyLevel();if(!level)return;const age=Math.max(0,elapsed-finalResult.elapsed);ctx.save();ctx.globalAlpha=level;for(let i=0;i<36;i++){const x=exit.x-150+(i*83%300)+(reduced?0:Math.sin(age*2+i)*8),y=exit.y-170+(reduced?i*47%175:(age*37+i*47)%175);if(x<camX||x>camX+viewW||y<camY||y>camY+viewH)continue;rect(Math.round(x),Math.round(y),i%2?3:5,i%2?5:3,['#f3d88c','#eb6975','#77bfd0','#f7f2d9'][i%4]);}ctx.restore();}
 function finish(showFarewell=true){if(!readyToFinish())return;const firstFinish=!finalResult;const story=firstFinish?freezeWalkStory():null;finished=true;freeRoam=false;if(!finalResult)finalResult={elapsed,mistakes,fines:{...fines},title:walkTitle(),story};clearInput();$('final-errands').textContent='2 / 2';$('final-fines').textContent=Object.values(finalResult.fines).reduce((a,b)=>a+b,0);$('final-fine-details').textContent=`Голуби: ${finalResult.fines.pigeons} · Красный свет: ${finalResult.fines.red} · Скорость: ${finalResult.fines.speeding} · Парковка: ${finalResult.fines.parking}`;$('final-time').textContent=formatTime(finalResult.elapsed);$('final-mistakes').textContent=finalResult.mistakes;$('final-badges').textContent='8 / 8';$('achievement').textContent=finalResult.title;save();renderReviewEntry();renderResultCard();$('card-image').hidden=true;$('card-status').textContent='Открытка содержит итог на момент финиша.';win.showModal();startWalkReplay(false);win.scrollTop=0;$('win-title').focus();if(firstFinish&&showFarewell&&!npcMemory.farewellSeen)openFarewell();}
 function continueWalking(){if(!finished)return;closeFarewell();if(finishPartyLevel()>0&&!freeRoam)announce('Парк аплодирует! Спасибо за прогулку — можно остаться ещё немного.');freeRoam=true;win.close();clearInput();save();canvas.focus();announce('Открыт пульт парка: журнал → Развлечения → погода. Можно выбрать вечер, осень, снег или дождь.');}

 const nearFinish=()=>Math.abs(player.x-exit.x)<54&&Math.abs(player.y-exit.y)<36;
 function tryFinish(){if(idleEscort)return false;if(blocked()||!nearFinish())return false;if(!readyToFinish()){announce(remainingHint());return false;}finish();return true;}
 function closeQuiz(){quiz.close();clearInput();canvas.focus();}
 function actionLabel(a){if(a.kind==='bear'&&bearNut.phase==='carry')return 'Вернуть орех белке';if(a.kind==='bikeStation')return bike.rented?'Найти мой велосипед':'Взять велосипед';if(a.kind==='courier')return courier.stage===2?'Поговорить с курьером':courier.stage===1?'Курьер · напомнить маршрут':'Проводить курьера к кафе';if(a.kind==='photographer')return photographer.stage===2?'Поговорить о снимке':photographer.stage===1?'Напомнить, куда отвести гуся':'Помочь фотографу';if(a.kind==='bubbles')return 'Большой пузырь · запустить';if(a.type==='question')return a.hidden?a.action:'Вопрос '+(a.id+1)+' из '+TOTAL;if(a.kind==='cinema')return cinemaOpen()?'Сесть смотреть кино · 12 с':'Узнать о вечернем кино';if(a.kind==='planeHost')return paperPlane?'Где самолётик?':'Запустить самолётик';if(a===errands[0].receiver&&errandStates[0]===3)return 'Бросить мяч собачке';if(a.kind==='snowman')return snowman.built?'Навестить снеговика':!snowmanAvailable()?'О зимнем сюрпризе':snowman.balls.length===3?'Слепить снеговика':'О снежных комьях';if(a.kind==='paperBoat')return paperVoyage?'Кораблик в пути':rainIntensity()>0?'Запустить кораблик':'Узнать о корабликах';if(a.kind==='gardener')return garden.stage===1&&garden.watered.length===3?'Вернуть лейку':'Поговорить с садовником';if(a.kind==='parkRide'&&a.id!=='history'&&ridesWet()&&!(a.id==='chess'&&(rideVisits.chess||0)>=3))return snowing()?'Переждать метель':'Переждать дождь';if(['wheel','swing','carousel','trampoline'].includes(a.kind)&&ridesWet())return snowing()?'Переждать метель':'Переждать дождь';if(a.kind==='parkRide'&&a.id==='chess')return (rideVisits.chess||0)>=3?'Поговорить с Лешей':'Сыграть с Лешей · '+((rideVisits.chess||0)+1)+'/3';if(a.type==='giver'){const i=a.id;return errandStates[i]===2&&errands[i].receiver===errands[i].giver?'Вернуть книгу':errandStates[i]===0?'Узнать о '+(i===0?'потерянном мячике':'потерянной книге'):'Поговорить';}if(a===errands[0].receiver&&errandStates[0]===2)return 'Отдать мячик';if(a.kind==='balloonOwner'&&extras.balloon===1)return 'Вернуть шарик';return a.action;}
 let selectedInteraction='',interactionOrder=[];
 const questionTargets=clues.map((c,id)=>({...c,id,type:'question'}));
 function interactionKey(a){if(['courier','parkInspector','drunkGuest','balloonOwner','bike','bikeStation','janitor'].includes(a.kind))return a.kind;if(a.kind==='drive'||a.kind==='pump')return 'bmw';if(a.type)return a.type+':'+a.id;if(a.kind==='letter')return 'letter';if(a.kind==='bench')return 'bench:'+a.bench.tx+','+a.bench.ty;if(pets.includes(a))return 'pet:'+pets.indexOf(a);return a.kind+':'+(a.id??((a.tx??a.x)+','+(a.ty??a.y)));}
 function interactionName(a){
  if(a.type==='question')return a.hidden?({rock:'Камень',stump:'Пень',poster:'Афиша',box:'Почтовый ящик',flowers:'Клумба'}[a.kind]||'Объект'):'Вопрос '+(a.id+1);
  if(a.type==='giver'){const id=a.id===1?6:5,n=namedNeighbours.find(n=>n.id==='resident-'+id);return metNeighbours.has(n.id)?n.name+' · '+(a.id===1?'книга':'мячик'):(a.id===1?'Девушка у кафе':'Хозяин мячика');}
  if(a.type==='errand')return a.id===1?'Потерянная книга':'Мячик';
  if(a.type==='badge')return collected.has(a.id)?'Найденный логотип DEX':({rock:'Камень',stump:'Пень',poster:'Афиша',box:'Ящик',flowers:'Клумба'}[a.kind]||'Объект');
  const person=namedNeighbours.find(n=>n.npc()===a);if(person?.name)return neighbourCaption(person);
  if(a.kind==='borrowGolf')return 'Сережа · Golf';
  return a.name||({dog:'Собачка',cat:'Кошка',bench:'Скамейка',drive:'BMW',pump:'BMW',bubbles:'Мыльные пузыри',snowman:'Поляна снеговика',planeHost:'Бумажная почта',letter:'Самолётик',cinema:'Вечерний кинотеатр',tester:'Посетитель',fountain:'Фонтан',ice:'Мороженое',toilet:'WC',wheel:'Колесо обозрения',swing:'Качели',gardener:'Садовник'}[a.kind])||a.action||'Объект рядом';
 }
 function interactionCandidates(){
  const candidates=[...(bearNut.phase==='ground'?[bearNutSpot()]:[]),musicChallengeSpot(),{...dandelionSite,action:dandelion?'Пушинки летят по ветру':'Подуть на одуванчик'},...catInteraction(),...picnicInteraction(),...fairSites,stoneSite,janitor,...(janitorHelp.stage===1?janitorLeaves.filter(p=>!janitorHelp.leaves.includes(p.id)):[]),bikeRack,...(bike.rented?[{...bike,kind:'bike',name:'Мой велосипед',action:'Сесть на велосипед'}]:[]),groupPhotoSite,courier,...(hoodCat.state==='sleep'?[{x:hoodCat.x,y:hoodCat.y,kind:'hoodCat',id:'parking',action:'Погладить кошку на капоте'}]:[]),...(bmwAvailable&&!towScene?[{...bmw,kind:flatTyre?'pump':'drive',action:flatTyre?'Подкачать колесо':'Сесть в BMW'}]:[]),...(!bmwAvailable&&!towScene?[{...brother,kind:'borrowGolf',action:'Дай прокатиться, пожалуйста'}]:[]),...testers,...(!trafficStop&&!towScene?[parkInspector]:[]),...parkRides,kiteSite,...(squirrelStory.stage===1?[winterCache]:[]),snowmanSite,...(snowmanAvailable()&&!snowman.built?snowballSites.filter(p=>!snowman.balls.includes(p.id)):[]),boatLaunch,...(garden.stage===1?gardenBeds.filter(p=>!garden.watered.includes(p.id)):[]),...benchActions(),balloonOwner,...(elapsed>=30&&extras.balloon===0?[{...balloonEnd,kind:'lostBalloon',action:'Поймать шарик'}]:[]),...(!extras.guestRemoved&&!guestEscort?[drunkGuest]:[]),...extraSpots.filter(p=>p.kind!=='questAuthor'&&(p.kind!=='fish'||extras.boots<2)&&(p.kind!=='dig'||detectorActive)&&(p.kind!=='nut'||extras.nut===0)&&(p.kind!=='paper'||extras.litter===0)),photoSpot,paintedBench,feedingSpot,...fountainSpots,wheel,...attractions,...badges,...pets,...errandGivers,...errands.filter((e,i)=>errandStates[i]===1).map(e=>e.item),cinemaSite,...(paperPlane&&paperPlane.time>=.8?[paperPlane]:[]),...questionTargets.filter(c=>!solved.has(c.id))];
  return candidates.filter(a=>Math.hypot(a.x-player.x,a.y-player.y)<(['drive','pump'].includes(a.kind)?100:interactionKey(a)===selectedInteraction?72:58)).sort((a,b)=>{const ai=interactionOrder.indexOf(interactionKey(a)),bi=interactionOrder.indexOf(interactionKey(b));if(ai>=0||bi>=0)return (ai<0?999:ai)-(bi<0?999:bi);return (interactionKey(a)==='bmw'?-100:0)-(interactionKey(b)==='bmw'?-100:0)+Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y);});
 }
 function nearAttraction(){
  if(idleEscort)return null;
  if(restingBench)return {x:restingBench.tx*T+32,y:restingBench.ty*T+42,kind:'bench',action:'Встать со скамейки',bench:restingBench};
  if(cycling)return {...bike,kind:'bike',name:'Велосипед',action:'Сойти с велосипеда'};if(driving)return {...bmw,kind:'drive',action:'Выйти из BMW'};
  
  const candidates=interactionCandidates(),chosen=candidates.find(a=>interactionKey(a)===selectedInteraction)||candidates[0];
  interactionOrder=candidates.map(interactionKey);selectedInteraction=chosen?interactionKey(chosen):'';return chosen||null;
 }
 function cycleInteraction(){
  if(blocked()||driving||cycling||idleEscort||funScene||restingBench||petTime>0)return;
  const candidates=interactionCandidates();if(candidates.length<2)return;
  const i=candidates.findIndex(a=>interactionKey(a)===selectedInteraction);selectedInteraction=interactionKey(candidates[(i+1)%candidates.length]);
  notePlayActivity();clearInput();player.vx=player.vy=0;updateUI();canvas.focus();
 }
 function updateInteractionChoice(nearby){
  const locked=driving||cycling||!!restingBench||!!funScene||!!idleEscort,choices=locked?[]:interactionCandidates();
  $('cycle-target').hidden=$('prompt').hidden||choices.length<2;
  const index=choices.findIndex(a=>nearby&&interactionKey(a)===interactionKey(nearby)),next=choices.length>1?choices[(index+1)%choices.length]:null;
  const caption=nearby&&!locked?(choices.length>1?'Выбрано: ':'')+interactionName(nearby)+(choices.length>1?' · '+(index+1)+' / '+choices.length:''):'';
  if($('interaction-target').textContent!==caption)$('interaction-target').textContent=caption;
  $('interaction-target').hidden=!caption;
  $('cycle-target-key').textContent=mobileScreen()?'↻ Другая цель':'C · Другая цель';
  $('cycle-target-next').textContent=next?interactionName(next):'';
  $('cycle-target').setAttribute('aria-label','Следующий объект: '+(next?interactionName(next):'нет')+'. Доступно: '+choices.length+'. Клавиша C.');
 }

 let trafficDialogue=null;
 const trafficReplies={
  speeding:[
   ['Это был нагрузочный тест дороги!','Дорога выдержала. А вот скоростной лимит — нет. Для тестов включайте ограничение до 50.'],
   ['Больше не буду.','Договорились. Отключите спортрежим — и гуляющие скажут спасибо.'],
   ['Можно оплатить хорошим настроением?','Настроение принимается как бонус. Штраф оформлен по обычному тарифу.']
  ],
  red:[
   ['Я ждал зелёный, но сработала гонка условий.','Тогда поставьте ожидание зелёного. Здесь таймаут лучше, чем столкновение.'],
   ['Понял, в следующий раз остановлюсь.','Хорошо. Перед стоп-линией тормозим, на зелёный продолжаем путь.'],
   ['А красный нельзя переключить в настройках темы?','Тему меняйте, сигнал остаётся красным. Правила одинаковы в светлой и тёмной теме.']
  ],
  parking:[
   ['Это парковка с запасом на масштабирование.','Масштабируйтесь в пределах одного места. Соседнему водителю тоже нужен ресурс.'],
   ['Сейчас перепаркуюсь.','Вот и договорились. Поставьте BMW внутри одной разметки.'],
   ['Я думал, это два бесплатных слота.','Один автомобиль — один слот. Второй оставим следующему посетителю.']
  ]
 };
 function clearTrafficDialogue(){activity.classList.remove('traffic-conversation');trafficDialogue=null;$('traffic-dialogue').hidden=true;$('traffic-replies').replaceChildren();$('traffic-response').textContent='';}
 function showTrafficDialogue(officer){
  clearTrafficDialogue();activity.classList.add('traffic-conversation');trafficDialogue={officer,answered:false};$('traffic-dialogue').hidden=false;
  $('traffic-dialogue-hint').textContent='Что ответить? Можно выбрать реплику или просто продолжить. Штраф уже оформлен.';
  const choices=trafficReplies[officer.reason]||trafficReplies.speeding;
  choices.forEach(([line],i)=>{const b=document.createElement('button');b.type='button';b.textContent=line;b.onclick=()=>chooseTrafficReply(i);$('traffic-replies').append(b);});
 }
 function chooseTrafficReply(index){
  const d=trafficDialogue,choices=d&&(trafficReplies[d.officer.reason]||trafficReplies.speeding);
  if(!activity.open||!d||d.officer!==trafficStop||!d.officer.fined||d.answered||!Number.isInteger(index)||!choices[index])return false;
  d.answered=true;const [line,reply]=choices[index],response=(npcMemory.traffic?trafficMemoryLine()+' ':'')+(d.officer.repeat?reply+' Но это повторное нарушение: эвакуатор уже вызван.':reply);
  [...$('traffic-replies').children].forEach((b,i)=>{b.disabled=true;b.classList.toggle('chosen',i===index);});
  $('traffic-response').textContent='Инспектор: «'+response+'»';$('traffic-response').focus();
  rememberMessage('Вы: «'+line+'»','Разговор');rememberMessage('Инспектор: «'+response+'»','Разговор');npcMemory.traffic={reason:d.officer.reason,choice:index};save();return true;
 }

 function closeActivity(){clearTrafficDialogue();magicPending=false;$('magic-choices').hidden=true;$('portrait-receipt').hidden=true;$('portrait-close').hidden=true;activity.classList.remove('portrait-result');if(feedScene?.fined&&!feedScene.paid){feedScene.paid=true;luckDelay=10;luckyOrigin=luckyDrop=null;luckAfter=0;save();}if(trafficStop?.fined&&trafficStop.repeat){activity.close();startTowing();clearInput();canvas.focus();return;}if(trafficStop?.fined){trafficStop=null;trafficCooldown=8;driveSpeed=0;}activity.close();clearInput();canvas.focus();}
 function finishErrand(i){if(errandStates[i]===3)return;errandStates[i]=3;errandJoy[i]=4;if(trackedErrand===i){trackedErrand=errandStates.findIndex(s=>s===2);navCache=null;}if(i===1){clearInput();player.vx=player.vy=0;speechTime=0;noticeTime=0;$('activity-title').textContent=errands[i].title;$('activity-copy').textContent=errands[i].thanks;activity.showModal();}else{announce(errands[i].thanks);speech='Спасибо за помощь!';speechTime=3;}burst(player.x,player.y-35,'#ffe5a0');window.ParkAudio?.reward();save();}
 function drawErrands(){errands.forEach((e,i)=>{const state=errandStates[i];if(state===1){const p=e.item;if(i===0){rect(p.x-10,p.y+2,20,4,'#365c3b55');rect(p.x-5,p.y-15,10,18,'#d95f69');rect(p.x-9,p.y-11,18,10,'#d95f69');rect(p.x-7,p.y-6,14,3,'#f7dfaf');rect(p.x-5,p.y-12,4,4,'#fff1cf');}else{rect(p.x-10,p.y-13,20,17,'#6b83c2');rect(p.x-7,p.y-10,14,11,'#fff1d1');rect(p.x-1,p.y-11,2,14,'#cfb67f');}}if(state===0||state===2){const p=state===2?e.receiver:e.giver;text(state===0?'!':'♥',p.x,p.y-60,16,'#ffe19a','center');}});}
 function friendlyGreeting(n){const champion=fairChampionLine(n);if(champion)return champion;const personal=personalGreeting(n);if(personal)return personal;if(n.id==='chess')return 'Так, чемпион, я пока тренируюсь! Ферзь просил перерыв.';if(n===errands[0].giver&&errandStates[0]===3)return 'О, спаситель мячика! Хвостатый уже ждёт реванша.';if(n===errands[1].giver&&errandStates[1]===3)return 'Привет! Книгу теперь держу крепче. Спасибо ещё раз!';if(n===brother)return n.phrase;const variant=Math.abs((n.tx||0)+(n.ty||0))%3;if(snowing())return ['Первый снег! Беседка сегодня очень кстати.','Вот это метель! Хорошо, что ненадолго.','Парк как на зимней открытке!'][variant];if(ridesWet())return ['Вот это душ! Хорошо, что у тебя зонт.','Дождик ненадолго. В беседке можно переждать.','Парк поливают без расписания!'][variant];if(nightLevel()>.5)return ['Фонари зажглись. Парк совсем другой!','Добрый вечер! Самое время для тихой прогулки.','Смотри, как светится колесо!'][variant];if(afterRain()>0)return 'Свежо после дождя! Только в лужу не наступи.';return n.phrase;}
 function renderMemories(){const list=$('memory-album');list.replaceChildren();for(const m of memoryTypes){const card=document.createElement('li'),art=document.createElement('div'),title=document.createElement('strong'),desc=document.createElement('p'),found=memories.has(m.id);card.className='memory-card '+m.id+(found?' found':' locked');art.className='memory-art';art.textContent=found?m.icon:'?';art.setAttribute('aria-hidden','true');title.textContent=found?m.title:'Неоткрытый момент';desc.textContent=found?'На память · '+formatTime(memories.get(m.id)):m.hint;card.append(art,title,desc);list.append(card);}$('memory-count').textContent=memories.size+' / '+memoryTypes.length+' памятных открыток. Необязательно для финиша.';}
 function renderRemaining(){const list=$('remaining-list');list.replaceChildren();const add=(label,target)=>{const li=document.createElement('li'),b=document.createElement('button');b.className='remaining-link';b.textContent=label;b.onclick=()=>{journalJump(target);};li.append(b);list.append(li);};const road=15-[...solved].filter(i=>i<15).length,secret=5-[...solved].filter(i=>i>=15).length;if(road)add('Вопросы на дороге: осталось '+road+' → подсказки','journal-list');if(secret)add('Скрытые вопросы: осталось '+secret+' → подсказки','journal-list');if(collected.size<8)add('Логотипы DEX: осталось '+(8-collected.size)+' → коллекция','badge-album');errands.forEach((e,i)=>{if(errandStates[i]!==3)add(e.title+': '+['поговорить с заказчиком','найти предмет','вернуть предмет'][errandStates[i]]+' → поручение','errand-list');});if(readyToFinish()){const li=document.createElement('li'),b=document.createElement('button');b.className='remaining-link';b.textContent='Всё выполнено! Показать путь к финишу →';b.onclick=()=>selectPlace(1);li.append(b);list.append(li);}}
 function renderErrands(){const list=$('errand-list');list.replaceChildren();errands.forEach((e,i)=>{const li=document.createElement('li'),title=document.createElement('strong'),desc=document.createElement('p');title.textContent=(errandStates[i]===3?'✓ ':errandStates[i]===0?'○ ':'→ ')+e.title;desc.textContent=[i===0?'Поговорите с парнем в зелёном у входа.':'Поговорите с Аней возле кафе.',e.hint,i===0?'Мячик у вас! Вернитесь к большой собачке на юго-востоке и нажмите E.':'Книга у вас! Вернитесь к Ане возле кафе и нажмите E.','Выполнено. Спасибо за помощь!'][errandStates[i]];li.className='errand-card'+(errandStates[i]===2?' carrying':'');const status=document.createElement('p');status.className='errand-status';status.textContent=['Не начато','1 / 3 · Задание принято','2 / 3 · Предмет у вас','3 / 3 · Предмет возвращён'][errandStates[i]];li.append(title,status,desc);if(errandStates[i]!==3){const button=document.createElement('button');button.className='track-errand';button.textContent=trackedErrand===i?'Убрать указатель':'Показать направление';button.onclick=()=>selectErrand(i);li.append(button);}list.append(li);});}
 function useAttraction(a){meetNeighbourForNpc(a);if(a.kind==='catWalk'){useCatWalk();return;}if(a.kind==='picnic'){usePicnic();return;}if(a.kind==='dandelion'){useDandelion();return;}if(a.kind==='melody'){openMelody();return;}if(a.kind==='seekCat'){useSeekCat();return;}if(a.kind==='fair'){openFair(a);return;}if(explainUnavailable(a))return;if(a.kind==='stoneSkip'){startStoneSkip();return;}if(['janitor','sweepLeaf'].includes(a.kind)){useJanitor(a);return;}if(a.kind==='bike'){takeBike();return;}if(a.kind==='bikeStation'){useBikeStation();return;}if(a.kind==='groupPhoto'){startGroupPhoto();return;}if(a.kind==='courier'){useCourier();return;}if(a.kind==='hoodCat'){petHoodCat();return;}if(a.kind==='photographer'){usePhotographer();return;}if(a.kind==='parkInspector'){talkInspector();return;}if(a.kind==='magician'){startMagic();return;}if(a.kind==='artist'){startPortrait();return;}if(a.type==='question'){openQuestion(a.id);return;}if(a.kind==='letter'){catchLetter();return;}if(a.kind==='cinema'){startCinema();return;}if(a===errands[0].receiver&&errandStates[0]===3){startFetch();return;}if(a.kind==='kite'){useKite();return;}if(a.kind==='winterCache'){useWinterSquirrel(a);return;}if(a.kind==='snowman'||a.kind==='snowball'){useSnowman(a);return;}if(a.kind==='paperBoat'){launchPaperBoat();return;}if(['gardener','gardenBed'].includes(a.kind)){useGardener(a);return;}if(a.kind==="bench"){toggleBench(a);return;}if(['wheel','swing'].includes(a.kind)&&weatherStopsRide())return;if(a.kind==='parkRide'){useParkRide(a);return;}if(a.kind==='pump'){pumpTime=5;clearInput();player.vx=player.vy=0;window.ParkAudio?.compressor?.();return;}if(a.kind==='lostBalloon'){if(extras.balloon!==0)return;extras.balloon=1;speech='Поймал! Верну хозяину, пока не улетел я.';speechTime=5;save();return;}if(a.kind==='balloonOwner'){if(extras.balloon===1){extras.balloon=2;speech='Спасибо! Шарик хотел в отпуск без меня!';burst(a.x,a.y-35,'#ffc267');window.ParkAudio?.reward();save();}else speech=extras.balloon===2?'Теперь держу крепко. Ручная кладь!':elapsed<25?'Шарик на прогулке. Я просто сопровождающий.':'Ветер унёс мой шарик вниз по западной аллее! Поймаешь?';speechTime=5;return;}if(a.kind==='borrowGolf'){brotherRequests=Math.min(brotherRequests+1,brotherReplies.length);brotherRefusal=4;speechTime=0;return;}if(a.kind==='bearNut'){useBearNut();return;}if(a.kind==='tester'){speech=(colleagueNames[a.look]?colleagueNames[a.look]+': ':'')+a.lines[a.talks%a.lines.length];a.talks++;speechTime=6;return;}if(repeatBlocked(a.kind))return;if(a.kind==='drunkGuest'){if(guestEscort||extras.guestRemoved)return;const path=escortPath(drunkGuest);if(!path){announce('Охрана пока не может пройти. Попробуйте чуть позже.');return;}guestEscort={time:0,x:drunkGuest.x,y:drunkGuest.y,guardX:drunkGuest.x-120,guardY:drunkGuest.y+8,escort:false,path};speech='Здесь отдыхают люди. Ведите себя прилично!';speechTime=3;return;}if(a.kind==='drive'){toggleDriving();return;}if(extraSpots.includes(a)){useExtra(a);return;}if(a.kind==='photo'||a.kind==='paint'){clearInput();player.vx=player.vy=0;dashTime=0;speechTime=0;funScene={kind:a.kind,time:0};if(a.kind==='photo'){player.x=photoSpot.x;player.y=photoSpot.y;player.face='down';}else{player.x=paintedBench.x+16;player.y=paintedBench.y;player.face='down';}return;}if(a.kind==='pigeons'){if(extras.feeds>=2){speech='Чё-то больше не хочется';speechTime=4;return;}if(feedScene||feedCooldown>0)return;extras.feeds++;clearInput();player.vx=player.vy=0;dashTime=0;speechTime=0;feedScene={time:0,x:player.x,y:player.y,guardX:player.x-120,guardY:player.y+8,fined:false,repeat:extras.feeds===2};feedCooldown=8;save();return;}if(a.kind==='fountain'){if(coinCooldown>0)return;clearInput();player.vx=player.vy=0;dashTime=0;coin={x:player.x,y:player.y-30,time:0};coinCooldown=2;return;}if(a.kind==='wheel'){clearInput();player.vx=player.vy=0;dashTime=0;player.x=wheel.x;player.y=wheel.y;wheelTime=5;wheelAngle=Math.PI/2;save();return;}if(a.type==='errand'){if(errandStates[a.id]!==1)return;errandStates[a.id]=2;celebrateFind(a.id===0?'ball':'book');followErrand(a.id);const firstItem=!tutorialSeen.item;if(firstItem){tutorialSeen.item=true;$('journal-button').classList.add('new-discovery');}announce((a.id===0?'Мячик найден! Отнесите его большой собачке.':'Книга найдена! Верните её девушке возле кафе.')+' Указатель ведёт к получателю.');window.ParkAudio?.reward();save();return;}if(a.type==='giver'){const i=a.id;meetNeighbour('resident-'+(i===1?6:5));residentRemark=0;errands[i].giver.moving=false;if(errandStates[i]===2&&errands[i].receiver===errands[i].giver){finishErrand(i);return;}if(errandStates[i]===0){errandStates[i]=1;followErrand(i);}speech=errandStates[i]===3?friendlyGreeting(errands[i].giver):errandStates[i]===2?'Отнеси мячик собачке на юго-востоке.':errands[i].request;if(errandStates[i]===3)rememberNpcVisit(errands[i].giver);speechTime=0;clearInput();player.vx=player.vy=0;$('activity-title').textContent=errands[i].title;$('activity-copy').textContent=speech;activity.showModal();save();return;}if(a.kind==='swing'){clearInput();player.vx=player.vy=0;dashTime=0;player.x=a.x;player.y=a.y;swingTime=4;return;}if(pets.includes(a)){if(a===errands[0].receiver&&errandStates[0]===2)finishErrand(0);clearInput();player.vx=player.vy=0;dashTime=0;activePet=a;petTime=3;unlockAchievement('pet');burst(a.x,a.y-30,'#ffc1cf');return;}if(a.type==='badge'){if(collected.has(a.id)){speech='Здесь логотип уже найден';speechTime=3;return;}collected.add(a.id);lastBadge=a.id;speech='Вы нашли логотип DEX!';speechTime=3;burst(a.x,a.y-25,'#ffe263');announce(`Поздравляем! Вы нашли логотип DEX · ${collected.size} / 8. Откройте J — журнал.`);$('journal-button').classList.add('new-discovery');save();return;}clearInput();player.vx=player.vy=0;dashTime=0;if(a.kind==='karaoke'){karaokeTime=3;Object.assign(player,{x:a.x,y:a.y});announce('Вы на сцене! ♪ Ваш выход…');}else if(a.kind==='toilet'){speech=a.reply;speechTime=3;}else{if(joyTime>0)return;const portion=finishVisit('ice');joyTime=2.4;unlockAchievement('ice');speech=portion===3?'Третье мороженое! Теперь я сам немного пломбир.':portion===2?'Вторая порция — для вдохновения!':'Ура! Мороженое!';speechTime=2.4;burst(player.x,player.y-25,'#ffc7dc');burst(player.x,player.y-35,'#fff1a1');}}
 function interact(){if(funScene?.kind==='bear'){if(!blocked())finishBear(true);return;}if(funScene?.kind==='fairAward'){if(!blocked())finishFairAward();return;}if(funScene?.kind==='fair'){fairAction();return;}if(idleEscort)return;if(cycling){if(!blocked()){notePlayActivity();leaveBike(Math.hypot(player.x-bikeRack.x,player.y-bikeRack.y)<80);}return;}if(funScene?.kind==='groupPhoto'&&!blocked()){stopGroupPhoto();return;}notePlayActivity();if(funScene?.kind==='stoneSkip'&&!blocked()){finishStoneSkip(true);return;}if(funScene?.kind==='magic'&&!blocked()){finishMagic(false);return;}if(funScene?.kind==='portrait'&&!blocked()){finishPortrait(false);return;}if(funScene?.kind==='cinema'&&!blocked()){finishCinema(false);return;}if(funScene?.kind==='kite'&&!blocked()){finishKite(true);return;}if(pumpTime>0)return;if(towScene||trafficStop)return;if(driving){if(!blocked())toggleDriving();return;}if(blocked()||karaokeTime>0||swingTime>0||wheelTime>0||feedScene||funScene)return;const a=nearAttraction();if(a){useAttraction(a);return;}if(nearFinish()){tryFinish();return;}if(nearest<0)return;openQuestion(nearest);}
 // The world is paused in the quiz; retry deadlines use real time instead.
 const ANSWER_RETRY_MS=7000;
 let quizRetries={};
 function restoreQuizRetries(v){
  quizRetries={};const data=v?.quizRetry;if(data?.bank!=='idle41'||!data.attempts||typeof data.attempts!=='object')return;
  const now=Date.now();
  for(let id=0;id<TOTAL;id++){const a=data.attempts[id];if(!a||!Array.isArray(a.wrong))continue;
   const wrong=[...new Set(a.wrong.filter(i=>Number.isInteger(i)&&i>=0&&i<4&&i!==QUESTIONS[id].correct))];
   if(wrong.length)quizRetries[id]={wrong,until:Number.isFinite(a.until)?Math.min(now+ANSWER_RETRY_MS,Math.max(0,a.until)):0};
  }
 }
 function quizRetrySeconds(now=Date.now()){return Math.max(0,Math.ceil(((quizRetries[current]?.until||0)-now)/1000));}
 function updateQuizRetry(now=Date.now()){
  const timer=$('quiz-retry');if(!quiz.open||current<0||solved.has(current)){timer.hidden=true;return;}
  const attempt=quizRetries[current],seconds=quizRetrySeconds(now),wasWaiting=!timer.hidden;
  timer.hidden=seconds===0;
  if(seconds){const text='Другой ответ можно выбрать через '+seconds+' с';if(timer.textContent!==text)timer.textContent=text;}
  for(const [i,b]of [...$('answers').children].entries()){const disabled=seconds>0||!!attempt?.wrong.includes(i);if(b.disabled!==disabled)b.disabled=disabled;}
  if(wasWaiting&&!seconds){$('feedback').textContent='Теперь можно выбрать другой ответ.';$('feedback').style.color='#426458';}
 }

 function openQuestion(index){if(!Number.isInteger(index)||!clues[index]||solved.has(index)||blocked())return;current=index;if(clues[current].hidden&&!discovered.has(current)){discovered.add(current);burst(clues[current].x,clues[current].y,'#ffe263');announce('Тайник найден! Внутри — секретный вопрос.');save();}clearInput();const q=QUESTIONS[current];$('question-label').textContent=`${clues[current].place} · ${current+1} / ${TOTAL}`;$('question').textContent=q.question;$('answers').replaceChildren();$('feedback').textContent='';$('continue').hidden=true;q.answers.forEach((a,i)=>{const b=document.createElement('button');b.className='answer';const n=document.createElement('span');n.textContent=i+1;b.append(n,document.createTextNode(a));b.onclick=()=>choose(i);b.classList.toggle('wrong',!!quizRetries[current]?.wrong.includes(i));$('answers').append(b);});quiz.showModal();if(quizRetries[current]?.wrong.length){$('feedback').textContent=quizRetrySeconds()>0?'Ответ не подошёл. Немного подумайте перед следующей попыткой.':'Можно выбрать другой ответ.';$('feedback').style.color='#426458';}updateQuizRetry();}
 function choose(i){if(!quiz.open||current<0||solved.has(current)||!Number.isInteger(i)||i<0||i>3)return false;updateQuizRetry();if(quizRetrySeconds()>0)return false;const q=QUESTIONS[current],buttons=[...$('answers').children];if(buttons[i].disabled)return false;const correct=i===q.correct;if(correct){delete quizRetries[current];$('quiz-retry').hidden=true;solved.add(current);buttons.forEach((b,j)=>{b.disabled=true;b.classList.toggle('correct',j===i);});$('feedback').textContent=`Верно! ${q.note}`;$('feedback').style.color='#21774e';$('continue').hidden=false;$('continue').focus();burst(clues[current].x,clues[current].y,'#ffe263');if(jubileeMilestones.some(m=>m.at===solved.size))jubileeAnswer();else announce(solved.size===TOTAL?remainingHint():'Верный ответ! Исследуйте аллеи и ищите тайники.');}else{mistakes++;questionErrors[current]=Math.min(9999,(questionErrors[current]||0)+1);buttons[i].disabled=true;buttons[i].classList.add('wrong');const attempt=quizRetries[current]||{wrong:[],until:0};if(!attempt.wrong.includes(i))attempt.wrong.push(i);attempt.until=Date.now()+ANSWER_RETRY_MS;quizRetries[current]=attempt;$('feedback').textContent='Ответ не подошёл. Немного подумайте перед следующей попыткой.';$('feedback').style.color='#8b5148';updateQuizRetry();$('quiz-retry').scrollIntoView?.({block:'nearest',behavior:reduced?'instant':'smooth'});}save();return correct;}
 function returnContext(v){
  const states=v?.errands||errandStates,place=v?v.trackedPlace:trackedPlace,selected=v?v.trackedErrand:trackedErrand;
  if(place===-3&&(v?v.photoNav:photoNav))return {place:-3,text:'Вы направлялись к месту снимка «'+markerName((v?v.photoNav:photoNav).name)+'».'};
  if(place===-2&&(v?v.personalMarker:personalMarker))return {place:-2,text:'На карте ждёт «'+markerName((v?v.personalMarker:personalMarker).name)+'». Можно вернуться к отметке.'};
  const errand=[0,1].includes(selected)&&states[selected]<3?selected:states.findIndex(s=>s===2)>=0?states.findIndex(s=>s===2):states.findIndex(s=>s===1);
  if(Number.isInteger(place)&&mapPlaces[place])return {place,text:'Вы направлялись к месту «'+mapPlaces[place].name+'». Можно продолжить путь.'};
  if(errand>=0){const text=errand===1?['Вы собирались поговорить с девушкой у кафе.','Вы искали книгу у северо-западной аллеи. Девушка ждёт у кафе.','Книга уже с вами. Осталось вернуть её девушке у кафе.']:['Вы собирались поговорить с парнем у входа.','Вы искали мячик у восточного сада. Собачка ждёт его возвращения.','Мячик уже с вами. Отнесите его собачке.'];return {errand,text:text[states[errand]]};}
  return null;
 }
 function followReturnGoal(){const goal=returnContext();if(!goal)return false;if(Number.isInteger(goal.errand))followErrand(goal.errand);else{trackedPlace=goal.place;trackedErrand=-1;navCache=null;}save();announce(goalCardTitle()+' · Следуйте золотой стрелке');return true;}
 function pauseAway(){if(walkReplay)walkReplay.playing=false;pauseFarewell();notePlayActivity();clearInput();save();if(photoMode||!started||(finished&&!freeRoam)||[quiz,info,journal,win,activity,$('photo-viewer'),$('melody-dialog'),$('fair-dialog'),$('fair-award-dialog'),$('quiz-review'),$('farewell'),$('reset-confirm'),$('away-pause')].some(d=>d.open))return;$('away-progress').textContent=completionStatus();const goal=returnContext();$('away-goal').textContent=goal?goal.text:freeRoam?'Квест завершён. Продолжайте гулять и собирать воспоминания.':remainingHint();$('away-path').hidden=!goal||driving||!!idleEscort||idleExempt();$('away-pause').showModal();}
 function resumeAway(withPath=false){if(document.hidden)return;$('away-pause').close();notePlayActivity();clearInput();if(withPath)followReturnGoal();window.ParkAudio?.unlock();canvas.focus();}
 function showInfo(){if(wheelTime>0||swingTime>0||karaokeTime>0||activity.open||quiz.open||win.open||journal.open||info.open)return;clearInput();info.showModal();$('info-title').focus({preventScroll:true});info.scrollTop=0;}
 const mapPlaces=[{name:'Старт',...spawn},{name:'Финиш',...exit},{name:'Фонтан',...point([42,28])},{name:'Колесо',...wheel},{name:'Парковка',...golf},{name:'Беседка',...point([18,60])},{name:'Западная аллея',...point([10,40])},...parkRides.map(p=>({name:p.name,x:p.x,y:p.y}))];
 const leisurePassport=[
 {name:'Большое колесо обозрения',target:wheel,key:'wheel'},
 {name:'Качели',target:attractions.find(p=>p.kind==='swing'),key:'swing'},
 ...['carousel','trampoline','telescope','gazebo'].map(key=>({name:repeatRules[key].name,target:extraSpots.find(p=>p.kind===key),key})),
 {name:'Караоке на эстраде',target:attractions.find(p=>p.kind==='karaoke'),achievement:'karaoke'},
 {name:'Фотозона',target:photoSpot,achievement:'photo'},
 ...parkRides.filter(p=>p.id!=='history').map(p=>({name:p.id==='chess'?'Шахматы':p.name,target:p,ride:p.id}))
 ].map(p=>{let place=mapPlaces.findIndex(q=>q.x===p.target.x&&q.y===p.target.y);if(place<0){place=mapPlaces.length;mapPlaces.push({name:p.name,x:p.target.x,y:p.target.y});}return {...p,place};});
 const gardenPlace=mapPlaces.length;mapPlaces.push({name:'Садовник',x:gardener.x,y:gardener.y});
 const boatPlace=mapPlaces.length;mapPlaces.push({name:'Бумажные кораблики',x:boatLaunch.x,y:boatLaunch.y});
 const snowmanPlace=mapPlaces.length;mapPlaces.push({name:'Снеговик DEX',x:snowmanSite.x,y:snowmanSite.y});
 const squirrelPlace=mapPlaces.length;mapPlaces.push({name:'Белкины запасы',x:squirrelHome().x,y:squirrelHome().y});
 const kitePlace=mapPlaces.length;mapPlaces.push({name:'Поляна воздушного змея',...kiteSite});
 const bubblePlace=mapPlaces.length;mapPlaces.push({name:'Мыльные пузыри',...bubbleHost});
 const planePlace=mapPlaces.length;mapPlaces.push({name:'Бумажные самолётики',...planeHost});
 const cinemaPlace=mapPlaces.length;mapPlaces.push({name:'Вечерний кинотеатр',...cinemaSite});
 const artistPlace=mapPlaces.length;mapPlaces.push({name:'Уличный художник',...artistSite});
 const heartPlace=mapPlaces.length;mapPlaces.push({name:'Поляна светлячков',...heartSite});
 const magicPlace=mapPlaces.length;mapPlaces.push({name:'Уличный фокусник',...magicianSite});
 const fetchPlace=mapPlaces.length;mapPlaces.push({name:'Собачка с мячом',...errands[0].receiver});
 const photographerPlace=mapPlaces.length;mapPlaces.push({name:'Фотограф и гусь',...point([61,48])});
 const courierPlace=mapPlaces.length;mapPlaces.push({name:'Робот-курьер',...courierHome});
 const hedgehogPlace=mapPlaces.length;mapPlaces.push({name:'Домик ёжика',...hedgehogHome});
 const groupPhotoPlace=mapPlaces.length;mapPlaces.push({...groupPhotoSite,name:'Общая фотография'});
 const bikeRackPlace=mapPlaces.length;mapPlaces.push({...bikeRack});const bikePlace=mapPlaces.length;mapPlaces.push({...bikeRack,name:'Велосипед у стойки'});const janitorPlace=mapPlaces.length;mapPlaces.push({...janitorHome});const stonePlace=mapPlaces.length;mapPlaces.push({...stoneSite});
 function leisureCount(p){return p.ride?(rideVisits[p.ride]||0):p.key?visitCount(p.key):Number(achievements.has(p.achievement));}
 function renderLeisurePassport(){renderStroll();renderFairPrize();const list=$('leisure-list');list.replaceChildren();const tried=leisurePassport.filter(p=>leisureCount(p)>0).length;$('leisure-summary').textContent='Попробовано '+tried+' из '+leisurePassport.length+'. Развлечения необязательны для финиша.';const entries=leisurePassport.filter(p=>!$('leisure-untried').checked||leisureCount(p)===0);for(const p of entries){const count=leisureCount(p),li=document.createElement('li'),title=document.createElement('strong'),status=document.createElement('p'),button=document.createElement('button');li.className='leisure-card'+(count?' visited':'');title.textContent=(count?'✓ ':'○ ')+p.name;const max=p.ride==='chess'?3:p.key?repeatRules[p.key].max:0;status.textContent=p.ride==='chess'?'Победы: '+count+' / 3'+(count===3?' · Все партии выиграны':''):count===0?'Ещё не пробовали':max?'Посещений: '+count+' / '+max+(count>=max?' · На сегодня достаточно':''):p.achievement?'Впечатление получено':'Посещений: '+count;if(p.key==='telescope'&&count>=2&&!achievements.has('dexStars'))status.textContent+=' · Новый звёздный сюрприз доступен';if(ridesWet()&&(p.ride||['wheel','swing','carousel','trampoline'].includes(p.key)))status.textContent+=snowing()?' · Перерыв на метель':' · Перерыв на дождь';button.className='track-errand';button.textContent=trackedPlace===p.place?'Убрать указатель':'Показать путь';button.setAttribute('aria-label',(trackedPlace===p.place?'Убрать указатель к месту «':'Показать путь к месту «')+p.name+'»');button.onclick=()=>selectPlace(p.place);li.append(title,status,button);list.append(li);}if(!entries.length){const li=document.createElement('li');li.className='leisure-empty';li.textContent='Все развлечения уже попробованы! Снимите фильтр, чтобы посмотреть результаты.';list.append(li);}}
 function renderExplorerMap(paintOnly=false){const c=$('explorer-map'),g=c.getContext('2d'),mw=900,mh=720,sx=mw/W,sy=mh/H;c.width=mw;c.height=mh;g.save();g.translate(mapView.x,mapView.y);g.scale(mapView.zoom,mapView.zoom);
 const dot=(x,y,r,fill,stroke)=>{g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=3;g.stroke();}};
 g.fillStyle='#edf0e1';g.fillRect(0,0,mw,mh);g.beginPath();boundary.forEach(([x,y],i)=>i?g.lineTo(x*T*sx,y*T*sy):g.moveTo(x*T*sx,y*T*sy));g.closePath();g.fillStyle='#b4c99a';g.fill();g.strokeStyle='#62856a';g.lineWidth=4;g.stroke();
 for(let y=6;y<70;y++)for(let x=6;x<90;x++){if(water(x,y)){g.fillStyle='#75b2c4';g.fillRect(x*T*sx,y*T*sy,T*sx+1,T*sy+1);}else if(gardenTile(x,y)){g.fillStyle='#93ae75';g.fillRect(x*T*sx,y*T*sy,T*sx,T*sy);}}
 g.fillStyle='#e4edc155';for(const k of exploredTiles){const x=k%24,y=Math.floor(k/24);g.fillRect(x*4*T*sx,y*4*T*sy,4*T*sx,4*T*sy);}g.lineCap='round';g.strokeStyle='#718281';g.lineWidth=14;for(const [a,b]of motorSegments){g.beginPath();g.moveTo(a[0]*T*sx,a[1]*T*sy);g.lineTo(b[0]*T*sx,b[1]*T*sy);g.stroke();}
 for(const width of [9,5]){g.strokeStyle=width===9?'#a5b486':'#f8edc9';g.lineWidth=width;for(const [a,b]of roads){g.beginPath();g.moveTo((a[0]+.5)*T*sx,(a[1]+.5)*T*sy);g.lineTo((b[0]+.5)*T*sx,(b[1]+.5)*T*sy);g.stroke();}}
 g.strokeStyle='#238aab';g.lineWidth=4;g.setLineDash([9,6]);g.beginPath();route.forEach((p,i)=>i?g.lineTo(p.x*sx,p.y*sy):g.moveTo(p.x*sx,p.y*sy));g.stroke();g.setLineDash([]);
 g.font='bold 16px sans-serif';g.textAlign='center';for(const b of buildings){const x=b.tx*T*sx,y=b.ty*T*sy;g.fillStyle=b.color;g.fillRect(x,y,b.w*T*sx,b.h*T*sy);g.fillStyle='#24473d';g.fillText(b.label==='ЗЕЛЁНЫЙ ТЕАТР'?'Театр':b.label==='ЛЕТНЯЯ ЭСТРАДА'?'Эстрада':'Кафе',x+b.w*T*sx/2,y-9);}
 g.fillStyle='#7d9290';g.fillRect(parking.x*sx,parking.y*sy,parking.w*sx,parking.h*sy);g.fillStyle='#397fa2';g.fillRect(42*T*sx-18,28*T*sy-12,36,24);
 clues.forEach((p,i)=>{if(p.hidden&&!discovered.has(i)&&!solved.has(i))return;g.fillStyle=solved.has(i)?'#307749':'#b88425';g.fillRect(p.x*sx-2,p.y*sy-2,4,4);dot(p.x*sx,p.y*sy,5,solved.has(i)?'#307749':'#f8cc66','#fff7da');});
 const area=badgeSearchArea();if(area){g.fillStyle='#f7bc4744';g.fillRect(area.x*sx,area.y*sy,area.w*sx,area.h*sy);g.strokeStyle='#9c681c';g.lineWidth=3;g.setLineDash([8,5]);g.strokeRect(area.x*sx,area.y*sy,area.w*sx,area.h*sy);g.setLineDash([]);}
 const placed=[];mapHitRegions=[];const offsets=[[0,23],[30,24],[0,-28],[0,0],[0,0],[0,0],[0,0]];mapPlaces.forEach((p,i)=>{let x=p.x*sx+(offsets[i]?.[0]||0),y=p.y*sy+(offsets[i]?.[1]||0);while(placed.some(q=>Math.hypot(q.x-x,q.y-y)<35))x+=36;placed.push({x,y});mapHitRegions.push({x,y,id:i});g.strokeStyle='#55715b';g.lineWidth=2;g.beginPath();g.moveTo(p.x*sx,p.y*sy);g.lineTo(x,y);g.stroke();dot(x,y,15,visitedPlaces.has(i)?'#2d7253':'#f4f1df','#fffdf0');g.fillStyle=visitedPlaces.has(i)?'#fffbe6':'#345044';g.font='bold 19px sans-serif';g.fillText(String(i+1),x,y+7);});
 const goal=trackedGoal();if(goal){const x=goal.x*sx,y=goal.y*sy;dot(x,y,21,'#ffdc6577','#9a6819');g.fillStyle='#8a5714';g.font='bold 24px sans-serif';g.fillText('★',x,y+8);}
 drawPersonalMarker(g,sx,sy);const px=player.x*sx,py=player.y*sy;dot(px,py,12,'#e34e62','#ffffff');dot(px,py,4,'#fff4e4');g.restore();g.fillStyle='#2b5043';g.font='bold 22px sans-serif';g.fillText('С ↑',mw-46,42);if(markerMode){g.strokeStyle='#375f73';g.lineWidth=2;g.beginPath();g.arc(450,360,10,0,Math.PI*2);g.moveTo(430,360);g.lineTo(470,360);g.moveTo(450,340);g.lineTo(450,380);g.stroke();}
 $('map-scale').textContent=Math.round(mapView.zoom*100)+'%';$('map-zoom-out').disabled=mapView.zoom<=1;$('map-zoom-in').disabled=mapView.zoom>=3;renderMarkerControls();if(paintOnly)return;const list=$('map-places');list.replaceChildren();mapPlaces.forEach((p,i)=>{const item=document.createElement('li');const button=document.createElement('button');button.className='map-place-button';button.textContent=(i+1)+'. '+p.name+(visitedPlaces.has(i)?' · посещено':'')+(trackedPlace===i?' · убрать цель':' →');button.onclick=()=>selectPlace(i);item.append(button);item.className=visitedPlaces.has(i)?'map-visited':'';list.append(item);});$('map-caption').textContent='Посещено '+visitedPlaces.size+' из '+mapPlaces.length+' мест. '+(goal?'★ Цель: '+goalName()+'.':'Выберите поручение в разделе «Добрые дела».')+(area?' Золотой квадрат — примерная область поиска логотипа.':'');
 }

 // Map coordinates stay in the 900 × 720 overview space; gestures only move its viewport.
 const mapView={zoom:1,x:0,y:0},mapPointers=new Map();let mapGesture=null;
 function clampMapView(){mapView.x=Math.max(900*(1-mapView.zoom),Math.min(0,mapView.x));mapView.y=Math.max(720*(1-mapView.zoom),Math.min(0,mapView.y));}
 function mapLocal(e){const r=$('explorer-map').getBoundingClientRect();return {x:(e.clientX-(r.left||0))*900/r.width,y:(e.clientY-(r.top||0))*720/r.height};}
 function mapWorldPoint(p){return {x:(p.x-mapView.x)/mapView.zoom,y:(p.y-mapView.y)/mapView.zoom};}
 function zoomMap(value,anchor={x:450,y:360}){const p=mapWorldPoint(anchor);mapView.zoom=Math.max(1,Math.min(3,value));mapView.x=anchor.x-p.x*mapView.zoom;mapView.y=anchor.y-p.y*mapView.zoom;clampMapView();renderExplorerMap(true);}
 function centerMap(){mapView.zoom=Math.max(2,mapView.zoom);mapView.x=450-player.x*900/W*mapView.zoom;mapView.y=360-player.y*720/H*mapView.zoom;clampMapView();renderExplorerMap(true);}
 function resetMap(){Object.assign(mapView,{zoom:1,x:0,y:0});mapPointers.clear();mapGesture=null;}
 function beginMapGesture(moved=false){const ps=[...mapPointers.values()];if(!ps.length){mapGesture=null;return;}const mid=ps.length>1?{x:(ps[0].x+ps[1].x)/2,y:(ps[0].y+ps[1].y)/2}:ps[0];mapGesture={mid,world:mapWorldPoint(mid),zoom:mapView.zoom,distance:ps.length>1?Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y):0,moved:moved||ps.length>1};}
 function initMapControls(){const c=$('explorer-map');
  $('marker-place').onclick=()=>{markerMode=!markerMode;markerDraft=null;markerEditing=false;renderExplorerMap(true);$('marker-status').textContent=markerMode?'Коснитесь свободного места на карте. С клавиатуры: приблизьте карту, сдвиньте её стрелками и нажмите «Поставить по центру карты».':'';if(markerMode)c.focus();};
  $('marker-center').onclick=()=>markerPick(mapWorldPoint({x:450,y:360}));$('marker-confirm').onclick=saveMarker;$('marker-follow').onclick=followMarker;$('marker-remove').onclick=removeMarker;$('marker-cancel').onclick=cancelMarkerEdit;$('marker-edit').onclick=editMarker;$('marker-save-name').onclick=saveMarkerName;$('marker-name').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();if(markerEditing)saveMarkerName();else saveMarker();}});for(const id of ['cat','view','later'])$('marker-preset-'+id).onclick=()=>{$('marker-name').value=$('marker-preset-'+id).textContent;$('marker-name').focus();};
  $('melody-play').onclick=playMelody;$('melody-pause').onclick=stopMelody;$('melody-close').onclick=closeMelody;$('melody-dialog').addEventListener('cancel',e=>{e.preventDefault();closeMelody();});
  $('map-zoom-in').onclick=()=>zoomMap(mapView.zoom+.35);$('map-zoom-out').onclick=()=>zoomMap(mapView.zoom-.35);$('map-center').onclick=centerMap;$('map-overview').onclick=()=>{resetMap();renderExplorerMap(true);};
  c.addEventListener('pointerdown',e=>{if(e.button>0||mapPointers.size>=2)return;e.preventDefault();c.setPointerCapture(e.pointerId);mapPointers.set(e.pointerId,mapLocal(e));beginMapGesture(mapGesture?.moved);});
  c.addEventListener('pointermove',e=>{if(!mapPointers.has(e.pointerId)||!mapGesture)return;e.preventDefault();mapPointers.set(e.pointerId,mapLocal(e));const ps=[...mapPointers.values()],mid=ps.length>1?{x:(ps[0].x+ps[1].x)/2,y:(ps[0].y+ps[1].y)/2}:ps[0];if(ps.length>1&&mapGesture.distance>0)mapView.zoom=Math.max(1,Math.min(3,mapGesture.zoom*Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y)/mapGesture.distance));if(Math.hypot(mid.x-mapGesture.mid.x,mid.y-mapGesture.mid.y)>8)mapGesture.moved=true;mapView.x=mid.x-mapGesture.world.x*mapView.zoom;mapView.y=mid.y-mapGesture.world.y*mapView.zoom;clampMapView();renderExplorerMap(true);});
  const release=(e,cancel=false)=>{if(!mapPointers.has(e.pointerId))return;const tap=!cancel&&!mapGesture?.moved&&mapPointers.size===1,p=mapWorldPoint(mapLocal(e));mapPointers.delete(e.pointerId);if(c.hasPointerCapture?.(e.pointerId))c.releasePointerCapture(e.pointerId);beginMapGesture(true);if(tap){const hit=mapHitRegions.find(q=>Math.hypot(q.x-p.x,q.y-p.y)<25/mapView.zoom+7);if(markerMode||!hit)markerPick(p);else selectPlace(hit.id);}};
  c.addEventListener('pointerup',e=>release(e));for(const type of ['pointercancel','lostpointercapture'])c.addEventListener(type,e=>release(e,true));
  c.addEventListener('wheel',e=>{e.preventDefault();zoomMap(mapView.zoom*Math.exp(-e.deltaY*.0015),mapLocal(e));},{passive:false});
  c.addEventListener('keydown',e=>{if(['+','=','-','0','Home','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();e.stopPropagation();if(e.key==='+'||e.key==='=')zoomMap(mapView.zoom+.35);else if(e.key==='-')zoomMap(mapView.zoom-.35);else if(e.key==='Home')centerMap();else if(e.key==='0'){resetMap();renderExplorerMap(true);}else{mapView.x+=e.key==='ArrowLeft'?70:e.key==='ArrowRight'?-70:0;mapView.y+=e.key==='ArrowUp'?70:e.key==='ArrowDown'?-70:0;clampMapView();renderExplorerMap(true);}}});
  journal.addEventListener('close',()=>{mapPointers.clear();mapGesture=null;markerDraft=null;markerMode=false;markerEditing=false;$('marker-status').textContent='';});
 }
 function activityProgress(){if(funScene?.kind==='bear')return {name:'Медведь и белка · лесной дуэт',total:BEAR_SECONDS,left:Math.max(0,BEAR_SECONDS-funScene.time)};if(funScene?.kind==='stoneSkip')return {name:'Камешек · '+(stoneSkips?.hits||0)+' / 5 отскоков',total:5,left:Math.max(0,5-funScene.time)};if(funScene?.kind==='groupPhoto')return {name:groupPhoto?.phase==='gather'?'Друзья подходят к фотозоне':'Улыбаемся · '+Math.max(1,3-Math.floor(groupPhoto?.countdown||0)),total:8,left:Math.max(0,8-funScene.time)};if(funScene?.kind==='magic')return {name:'Фокус со стаканчиками',total:8,left:Math.max(0,8-funScene.time)};if(funScene?.kind==='portrait')return {name:'Художник пишет ваш портрет',total:8,left:Math.max(0,8-funScene.time)};if(funScene?.kind==='fetch')return {name:'Играем с собачкой',total:6.1,left:Math.max(0,6.1-funScene.time)};if(funScene?.kind==='cinema')return {name:'Кино под звёздами',total:12,left:Math.max(0,12-funScene.time)};if(funScene?.kind==='kite')return {name:'Воздушный змей',total:8,left:Math.max(0,8-funScene.time)};if(wheelTime>0)return {name:'Колесо обозрения',total:5,left:wheelTime};if(swingTime>0)return {name:'Качели',total:4,left:swingTime};if(karaokeTime>0)return {name:'Караоке',total:3,left:karaokeTime};if(pumpTime>0)return {name:'Подкачиваем колесо',total:5,left:pumpTime};if(!funScene)return null;let total=0,name='';if(funScene.kind==='parkRide'){total=funScene.rideId==='chess'?5:6;name=parkRides.find(p=>p.id===funScene.rideId)?.name;}else if(['carousel','trampoline','gazebo','telescope','watering'].includes(funScene.kind)){total=funScene.kind==='watering'?2:4;name={carousel:'Карусель',trampoline:'Батут',gazebo:'Отдыхаем в беседке',telescope:'Смотрим в телескоп',watering:'Поливаем клумбу'}[funScene.kind];}return total?{name,total,left:Math.max(0,total-funScene.time)}:null;}
 function updateActivityProgress(){const p=activityProgress(),el=$('ride-progress');el.hidden=!p||blocked()||observing;if(!p)return;const value=Math.round((1-p.left/p.total)*100);$('ride-progress-name').textContent=p.name;$('ride-progress-time').textContent=Math.max(0,Math.ceil(p.left-.001))+' с';$('ride-progress-bar').value=value;$('ride-progress-bar').setAttribute('aria-label',p.name);$('ride-progress-bar').setAttribute('aria-valuetext','Осталось '+Math.max(0,Math.ceil(p.left-.001))+' с');}

 const journalTabs=['quest','map','fun','collection','people'];let journalTab='quest',pinnedActivity='';
 function showJournalTab(id,focus=false){
  if(!journalTabs.includes(id))id='quest';journalTab=id;
  for(const key of journalTabs){const on=key===id,b=$('journal-tab-'+key);b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;$('journal-panel-'+key).hidden=!on;}
  if(id==='map'){$('map-details').open=true;renderExplorerMap();}
  if(id==='people')renderNeighboursAlbum();
  journal.scrollTop=0;if(focus)$('journal-tab-'+id).focus();save();
 }
 function journalJump(target){
  showJournalTab(['badge-album','photo-album','portrait-guide'].includes(target)?'collection':'quest');
  const el=$(target);el.scrollIntoView?.({behavior:reduced?'auto':'smooth',block:'start'});el.focus?.();
 }
 const fairPlaces=fairSites.map(p=>{const index=mapPlaces.length;mapPlaces.push({...p});return index;});
 fairSites.forEach((p,i)=>leisurePassport.push({name:p.name,target:p,achievement:'fair-'+p.id,place:fairPlaces[i]}));
 const musicPathPlace=mapPlaces.length;mapPlaces.push({name:'Музыкальная дорожка',...musicTiles[0]});
 const rainWritingPlaces=rainWriting.map((p,i)=>{const index=mapPlaces.length;mapPlaces.push({name:'Дождевое послание · '+(i+1),x:p.x,y:p.y});return index;});

 const seekCatPlace=mapPlaces.length;mapPlaces.push({...seekCatHome,name:'Рыжик · прятки'});
 const dandelionPlace=mapPlaces.length;mapPlaces.push({...dandelionSite});
 const picnicPlace=mapPlaces.length;mapPlaces.push({...picnicSite});
 const bearPlace=mapPlaces.length;mapPlaces.push({...bearSite});

 function parkBillboardEntries(){
  const list=[],add=(id,name,detail,delay=0,place=null)=>list.push({id,name,detail,delay,place}),phase=elapsed%300,dry=rainIntensity()<.1&&!snowing(),wheelPlace=mapPlaces.findIndex(p=>p.name==='Колесо');
  if(wheelLightShow)add('wheel','Колесо света','Шоу уже идёт. Подойдите и сохраните этот момент.',0,wheelPlace);
  else if(dry&&nightLevel()>.6&&wheelShowCycle!==wheelEveningKey()&&(weatherControlled()||phase>=246&&phase<=277))add('wheel','Колесо света','Начнётся, когда вы подойдёте к колесу.',0,wheelPlace);
  if(weatherTime()>=30&&weatherTime()<=39&&boatLastCycle!==boatCycle())add('boat','Бумажный кораблик','Ручеёк журчит: сейчас можно запустить кораблик.',0,boatPlace);
  if(afterRain()>0&&nightLevel()<.2)add('rainbow','Радуга после дождя','Посмотрите вверх и откройте камеру — радуга скоро растает.');
  if(!weatherControlled()){
   const evening=phase<240?240-phase:300-phase+240;if(evening<=90)add('evening','Вечер в парке','Зажгутся фонари. В сухую погоду у колеса можно увидеть шоу.',evening,wheelPlace);
   rainEventIndex(elapsed+90);const rain=rainStarts.find(t=>t>elapsed);if(rain&&rain-elapsed<=90)add('rain','Дождь и кораблики','В начале дождя оживёт ручеёк. Можно заранее найти лоток с корабликами.',rain-elapsed,boatPlace);
   const season=seasonPhase();if(season<SNOW_AT&&SNOW_AT-season<=90)add('snow','Первый снег','На минуту придёт метель, затем можно слепить снеговика.',SNOW_AT-season,snowmanPlace);
  }
  if(bearNut.phase==='carry')add('nut','Белка ждёт орех','Вы уже нашли его. Вернитесь к лесной сцене.',0,bearPlace);
  else if(['ground','rolling'].includes(bearNut.phase))add('nut','Орех укатился','Перед сценой медведя лежит орех. Белка будет рада помощи.',0,bearPlace);
  else if(bearCooldown<=0)add('bear','Лесной дуэт','Медведь и белка готовы сыграть восьмисекундный концерт.',0,bearPlace);
  return list.sort((a,b)=>(a.delay>0)-(b.delay>0)||a.delay-b.delay).slice(0,4);
 }
 function renderParkBillboard(){
  const list=$('park-billboard-list');list.replaceChildren();
  for(const e of parkBillboardEntries()){
   const li=document.createElement('li'),title=document.createElement('strong'),status=document.createElement('small'),copy=document.createElement('p');
   title.textContent=e.name;status.textContent=e.delay?'Через '+Math.ceil(e.delay)+' с игрового времени':'Сейчас';copy.textContent=e.detail;li.append(title,status,copy);
   if(Number.isInteger(e.place)&&e.place>=0){const b=document.createElement('button');b.type='button';b.textContent='Показать путь';b.setAttribute('aria-label','Показать путь: '+e.name);b.onclick=()=>{trackedPlace=-1;selectPlace(e.place);};li.append(b);}list.append(li);
  }
  if(!list.children.length){const p=document.createElement('li');p.textContent='Сейчас тихая прогулка. Загляните в развлечения — парк полон занятий.';list.append(p);}
 }

 function discoveryCatalog(){
  const pinned=pinnedActivities(),catalog=mapPlaces.map((place,i)=>{const a=pinned.find(p=>p.place===i&&p.id!=='catWalk'),leisure=leisurePassport.find(p=>p.place===i);return {...place,place:i,id:a?.id||'place-'+i,name:a?.name||leisure?.name||place.name,hint:a?.hint||'',leisure,activity:!!a||!!leisure};});
  catalog.push({...seekCat,name:'Прогулка с Рыжиком',place:seekCatPlace,id:'catWalk',hint:'После трёх побед в прятках кот проводит вас по парку. У транспорта он ждёт.',activity:true});
  return catalog;
 }
 function discoveryTried(p){
  if(p.id==='catWalk')return catCompanion.completed;
  if(p.id.startsWith('fair-'))return (fairStats[p.id.slice(5)]?.plays||0)>0;
  if(p.leisure)return leisureCount(p.leisure)>0;
  if(triedActivities.has(p.id))return true;
  const counts={bear:bearConcerts,dandelion:dandelionBlows,seekCat:seekCat.stage===3,musicPath:musicWalk.plays,janitor:janitorHelp.stage===3,courier:courier.stage===2,photographer:photographer.stage===2,artist:Object.keys(portraits).length,cinema:cinemaVisits,heart:achievements.has('parkHeart'),magic:magicShows,fetch:fetchTrips,bubbles:bubblePops,planes:planeMail.size,hedgehog:achievements.has('quietNeighbour'),groupPhoto:photoShots.groupPhoto,stars:achievements.has('dexStars'),picnic:picnic.helps};
  if(p.id.startsWith('rainWords-'))return !!photoShots.rainWords;if(p.id in counts)return !!counts[p.id];
  if(p.place===gardenPlace)return garden.stage===2;if(p.place===boatPlace)return boatWins>0;if(p.place===snowmanPlace)return snowman.built;if(p.place===squirrelPlace)return squirrelStory.stage===3;if(p.place===kitePlace)return kiteFlights>0;
  return visitedPlaces.has(p.place);
 }
 function discoveryUnavailable(p){
  if(p.id==='bear')return bearCooldown>0?'Артисты настраиваются. До повтора '+Math.ceil(bearCooldown)+' с.':'';
  if(p.leisure){const r=unavailableReason(p.leisure.target);if(r)return r;const l=p.leisure,max=l.ride==='chess'?3:l.key?repeatRules[l.key].max:0;if(max&&leisureCount(l)>=max&&!(l.key==='telescope'&&!achievements.has('dexStars')))return l.ride==='chess'?'Все три партии выиграны. Можно зайти поговорить.':'Все повторы уже сыграны. Можно посетить это место.';}
  if(p.id.startsWith('fair-'))return fairReason({id:p.id.slice(5)});
  if(p.id==='catWalk')return seekCat.stage<3?'Сначала найдите Рыжика в трёх укрытиях.':ridesWet()?'Прогуляемся после непогоды.':'';
  if(p.id==='picnic')return !picnicReady()?'Ждём сухую погоду и таяние снега.':picnic.cooldown>0?'Пикник уже в порядке. Новая сценка через '+Math.ceil(picnic.cooldown)+' с.':'';
  if(p.id==='dandelion'&&!dandelionReady())return 'Пушинки ждут сухой погоды и таяния снега.';
  if(p.id==='musicPath'&&!musicAvailable())return 'Музыкальные плитки откроются после таяния снега.';
  if(p.id.startsWith('rainWords-')&&rainWritingLevel()<=.25)return 'Послание становится видно под дождём.';
  if(p.id==='cinema'&&!cinemaOpen())return 'Кино открывается в сухой вечер.';
  if(p.id==='heart'&&!heartAvailable())return 'Светлячки танцуют в сухой вечер без снега.';
  if(p.id==='hedgehog'&&(nightLevel()<=.12||snowCover()>=.2||ridesWet()))return 'Ёжик выходит сухим вечером; зимой спит.';
  if(p.id==='fetch'&&errandStates[0]!==3)return 'Сначала верните собачке мячик по поручению.';
  if(p.id==='bubbles'&&!bubbleWeather())return 'Пузыри ждут сухой погоды без снега.';
  if(['artist','photographer','courier'].includes(p.id)&&ridesWet())return 'Посетители пережидают непогоду.';
  if(p.id==='stoneSkip')return unavailableReason(stoneSite);
  if(p.place===kitePlace)return unavailableReason(kiteSite);
  if(p.place===snowmanPlace&&!snowmanAvailable())return 'Для снеговика нужны сугробы.';
  if(p.place===boatPlace&&(weatherTime()<30||weatherTime()>39||boatLastCycle===boatCycle()))return 'Кораблик запускают один раз в начале дождя.';
  if([bikeRackPlace,bikePlace].includes(p.place))return unavailableReason(bikeRack);
  return '';
 }
 function activitySearchResults(query='',filters={}){
  const normalize=s=>s.toLocaleLowerCase('ru').replace(/ё/g,'е').trim(),words=normalize(query).split(/\s+/).filter(Boolean);
  return discoveryCatalog().map(p=>({...p,distance:Math.hypot(p.x-player.x,p.y-player.y),tried:discoveryTried(p),reason:discoveryUnavailable(p)})).filter(p=>{
   const hay=normalize(p.name+' '+p.hint+(p.id==='seekCat'||p.id==='catWalk'?' кот кошка рыжик':''));return words.every(w=>hay.includes(w))&&(!filters.nearby||p.distance<=384)&&(!filters.untried||!p.tried)&&(!filters.available||!p.reason);
  }).sort((a,b)=>a.distance-b.distance);
 }
 function renderActivitySearch(){
  const query=($('activity-search').value||'').slice(0,80),filters={nearby:!!$('search-nearby').checked,untried:!!$('search-untried').checked,available:!!$('search-available').checked},active=!!query.trim()||Object.values(filters).some(Boolean),list=$('activity-results');
  $('fun-browse-rest').hidden=active;$('activity-results-wrap').hidden=!active;list.replaceChildren();if(!active)return;
  const results=activitySearchResults(query,filters);$('activity-search-status').textContent=results.length?'Найдено: '+results.length+'. Ближайшие места — первыми. Расстояния по прямой.':'Ничего не найдено. Попробуйте другое слово или снимите фильтр.';
  for(const p of results){const li=document.createElement('li'),title=document.createElement('strong'),status=document.createElement('p'),button=document.createElement('button');li.className='activity-pick';title.textContent=p.name;status.textContent=(p.tried?'✓ Уже знакомо':p.activity?'○ Ещё не пробовали':'○ Ещё не посещали')+' · Шагов по прямой: '+Math.max(1,Math.round(p.distance/T))+'. '+(p.reason||'Доступно сейчас.');button.className='track-errand';button.textContent=p.reason?'Показать место':'Показать путь';button.setAttribute('aria-label',button.textContent+': '+p.name);button.onclick=()=>{if(p.id==='catWalk'){pinnedActivity='catWalk';trackedPlace=seekCatPlace;trackedErrand=-1;navCache=null;save();closeJournal();}else selectPlace(p.place);};li.append(title,status,button);list.append(li);}
 }
 $('activity-search').addEventListener('input',renderActivitySearch);for(const id of ['nearby','untried','available'])$('search-'+id).addEventListener('change',renderActivitySearch);
 $('activity-search-clear').onclick=()=>{$('activity-search').value='';for(const id of ['nearby','untried','available'])$('search-'+id).checked=false;renderActivitySearch();$('activity-search').focus();};

 function pinnedActivities(){return [
  {id:'bear',name:'Медведь с балалайкой',hint:'Поляна южнее ярмарки. Балалайка, белка с ореховым барабаном и восемь секунд музыки под навесом. P / 📷 — фото, E — уйти. Концертов: '+bearConcerts+'. '+(bearNut.phase==='carry'?'У вас орех: верните его белке. ':['ground','rolling'].includes(bearNut.phase)?'Перед сценой укатился орех — можно помочь белке. ':'')+'Необязательно для финиша.',place:bearPlace},
 {id:'catWalk',name:'Прогулка с Рыжиком',hint:'После трёх побед в прятках кот проводит вас по парку. У транспорта он ждёт.',place:seekCatPlace},
 {id:'picnic',name:'Спасти пикник',hint:'Столики на юго-востоке. В сухую погоду ветер подхватывает салфетки. E у хозяина — помочь, затем можно сделать фото.',place:picnicPlace},
 {id:'dandelion',name:'Одуванчиковая поляна',hint:'Севернее Рыжика, у музыкальной аллеи. В сухую погоду нажмите E: пушинки полетят по ветру. Вечером их подсветит садовый фонарик.',place:dandelionPlace},
 {id:'seekCat',name:'Прятки с Рыжиком',hint:'Кот ждёт у северной аллеи, западнее музыкальных плиток. Три укрытия рядом: ищите хвост, следы и мяуканье. Без таймера.',place:seekCatPlace},
 {id:'musicPath',name:'Музыкальная дорожка',hint:'Северная аллея. Пройдите по восьми плиткам или нажмите E рядом с ними, чтобы повторить образец из четырёх нот. Вечером огоньки отвечают на шаги. Под снегом дорожка отдыхает.',place:musicPathPlace},
 ...rainWritingPlaces.map((place,i)=>({id:'rainWords-'+i,name:'Дождевое послание · '+(i+1),hint:'Надпись проступает под дождём и плавно исчезает после него. Можно снять для фотоохоты.',place})),
 ...fairSites.map((p,i)=>({id:'fair-'+p.id,name:p.name,hint:'Северо-западная ярмарка. '+(p.id==='music'?'Ромская семья приглашает на восьмисекундный концерт.':'Семь сигналов, четыре точных действия для победы. E, пробел или экранная кнопка. Лучший результат: '+(fairStats[p.id]?.best||0)+' / 7.')+(fairInterrupted[p.id]?' Сохранена попытка: '+fairInterrupted[p.id].round+' из 7 раундов, точных действий — '+fairInterrupted[p.id].score+'.':'')+' Необязательно для финиша.',place:fairPlaces[i]})),
  {id:'stoneSkip',name:'Камешки на пруду',hint:'Южный берег маленького пруда. Пять отскоков за пять секунд. Занятие необязательное; доступно в сухую погоду.',place:stonePlace},
  {id:'janitor',name:'Помочь дворнику',hint:janitorHelp.stage===3?'Листья собраны. Дворник благодарит за помощь.':janitorHelp.stage===2?'Все три листа собраны. Вернитесь к дворнику.':janitorHelp.stage===1?'Собрано '+janitorHelp.leaves.length+' / 3. Большие листья отмечены возле южной аллеи.':'Южнее велопроката, на аллее к воротам. Соберите три листа после порыва ветра. Для финиша не требуется.',place:janitorPlace},
  {id:'groupPhoto',name:'Общая фотография',hint:'Камера на штативе у фотозоны DEX. Позовите компанию и скачайте общий снимок после отсчёта.',place:groupPhotoPlace},
  {id:'courier',name:'Робот-курьер',hint:courier.stage===2?'Посылка доставлена. Можно зайти поболтать.':courier.stage===1?'Идите к кафе, курьер следует за вами. Если отстали друг от друга, указатель вернёт к роботу. В непогоду он ждёт.':'К юго-востоку от фонтана. Помогите роботу доставить посылку в кафе.',place:courierPlace},
  {id:'hedgehog',name:'Тихий сосед',hint:'Домик западнее старта, рядом с беседкой. Приходите вечером и постойте спокойно рядом с ёжиком три секунды. Зимой он спит.',place:hedgehogPlace},
  {id:'stars',name:'Созвездие DEX',hint:visitCount('telescope')>=2&&achievements.has('dexStars')?'Вы уже посмотрели оба звёздных сюрприза.':'На юго-востоке парка. Четыре секунды у телескопа — и звёзды сложатся в DEX. Второй просмотр с сюрпризом.',place:leisurePassport.find(p=>p.key==='telescope').place},
  {id:'photographer',name:'Фотограф и гусь',hint:photographer.stage===2?'Кадр спасён! Можно зайти поболтать.':photographer.stage===1?'Уведите гуся к золотой отметке слева внизу от фотографа. Постойте там 3 секунды.':'На поляне у гуся. Помогите сделать пейзаж без пернатой модели. В сухую погоду.',place:photographerPlace},
  {id:'artist',name:'Портрет у художника',hint:'Восемь секунд позирования. Свой рисунок на память.',place:artistPlace},
  {id:'cinema',name:'Кино под звёздами',hint:'В сухой вечер. Фильм длится 12 секунд.',place:cinemaPlace},
  {id:'heart',name:'Танец светлячков',hint:'В сухой вечер после 04:00. Приходите на северную поляну.',place:heartPlace},
  {id:'magic',name:'Фокус со стаканчиками',hint:'Выберите стаканчик и посмотрите, что получится.',place:magicPlace},
  {id:'fetch',name:'Игра с собачкой',hint:errandStates[0]===3?'Бросьте мяч — собачка принесёт его к ногам.':'Сначала найдите и верните мяч по поручению.',place:fetchPlace},
  {id:'bubbles',name:'Шоу мыльных пузырей',hint:'Большой радужный пузырь, кошка и новый сюжет для фото. В сухую погоду.',place:bubblePlace},
  {id:'planes',name:'Бумажная почта',hint:'Шесть посланий, которые приносит ветер.',place:planePlace}
 ];}
 function pinnedSpec(){return pinnedActivities().find(p=>p.id===pinnedActivity)||null;}
 function pinActivity(id){const p=pinnedActivities().find(p=>p.id===id);if(!p)return;
  if(pinnedActivity===id){pinnedActivity='';trackedPlace=-1;}else{pinnedActivity=id;trackedPlace=p.place;}
  trackedErrand=-1;navCache=null;save();closeJournal();updateGoalCard();
 }
 function completePinned(id){triedActivities.add(id);if(pinnedActivity!==id)return;const p=pinnedSpec();if(p&&trackedPlace===p.place)trackedPlace=-1;pinnedActivity='';navCache=null;}
 function renderPinnedActivities(){
  const list=$('activity-picks');list.replaceChildren();
  for(const p of pinnedActivities()){const li=document.createElement('li'),title=document.createElement('strong'),hint=document.createElement('p'),button=document.createElement('button');li.className='activity-pick';title.textContent=p.name;hint.textContent=p.hint;button.className='track-errand';button.textContent=pinnedActivity===p.id?'✓ Закреплено · убрать':'Закрепить занятие';button.setAttribute('aria-label',(pinnedActivity===p.id?'Убрать занятие «':'Закрепить занятие «')+p.name+'»');button.setAttribute('aria-pressed',String(pinnedActivity===p.id));button.onclick=()=>pinActivity(p.id);li.append(title,hint,button);list.append(li);}
 }
 for(const [i,id]of journalTabs.entries()){
  const b=$('journal-tab-'+id);b.onclick=()=>showJournalTab(id);
  b.addEventListener('keydown',e=>{const next=e.key==='ArrowRight'?(i+1)%4:e.key==='ArrowLeft'?(i+3)%4:e.key==='Home'?0:e.key==='End'?3:-1;if(next<0)return;e.preventDefault();e.stopPropagation();showJournalTab(journalTabs[next],true);});
 }

 function openExplorerMap(){if(openJournal()){showJournalTab('map');}}
 function badgeSearchArea(){if(collected.size<6||collected.size>=8||badgeSearch<0||collected.has(badgeSearch))return null;const p=badges[badgeSearch],size=12*T;return {x:Math.floor(p.x/size)*size,y:Math.floor(p.y/size)*size,w:size,h:size};}
 function updateBadgeHint(){if(collected.has(badgeSearch)||collected.size<6||collected.size>=8)badgeSearch=-1;const eligible=collected.size>=6&&collected.size<8;$('badge-hint').hidden=!eligible;$('badge-hint').textContent=badgeSearch>=0?'Скрыть область поиска':'Подсказать область последнего логотипа';$('badge-hint').setAttribute('aria-pressed',String(badgeSearch>=0));$('badge-hint-status').textContent=badgeSearch>=0?'На карте выделен участок с одним из оставшихся логотипов. Осматривайте объекты внутри него.':eligible?'Если поиск затянулся, можно показать примерную область. Это необязательно.':'';}
 function toggleBadgeHint(){if(collected.size<6||collected.size>=8)return;if(badgeSearch>=0)badgeSearch=-1;else{badgeSearch=badges.map((p,i)=>({i,d:Math.hypot(p.x-player.x,p.y-player.y)})).filter(p=>!collected.has(p.i)).sort((a,b)=>a.d-b.d)[0].i;}showJournalTab('map');$('map-details').open=true;updateBadgeHint();renderExplorerMap();$('map-details').scrollIntoView?.({behavior:reduced?'auto':'smooth',block:'start'});}
 function openJournal(){if(idleEscort)return false;renderParkBillboard();notePlayActivity();renderMessageHistory();renderParkPlay();renderPortraits();if(towScene||trafficStop)return false;if(!started||blocked()||karaokeTime>0||swingTime>0||wheelTime>0||feedScene||funScene)return false;clearInput();updateBadgeHint();renderRemaining();renderReviewEntry();renderParkWeather();renderWheelShowControl();$('jubilee-status').textContent=jubileeProgress();renderMemories();renderPhotoAlbum();renderCollage();renderKiteGuide();renderBoatGuide();renderSnowmanGuide();renderSquirrelGuide();renderExplorerMap();renderErrands();renderAchievements();renderRepeatProgress();renderLeisurePassport();renderGardenQuest();$('journal-list').replaceChildren();QUESTIONS.forEach((q,i)=>{const li=document.createElement('li'),title=document.createElement('strong'),p=document.createElement('p');title.textContent=`${solved.has(i)?'✓':'○'} ${clues[i].place}`;p.textContent=solved.has(i)?q.note:clues[i].hidden?clues[i].hint:'Найдите жёлтую табличку на маршруте.';li.append(title,p);$('journal-list').append(li);});$('badge-album').replaceChildren();badges.forEach((b,i)=>{const card=document.createElement('div'),stamp=document.createElement('span'),label=document.createElement('strong'),place=document.createElement('small');const found=collected.has(i);card.className='badge-card'+(found?' found':'')+(i===lastBadge?' latest':'');stamp.className='dex-stamp'+(found?'':' missing');stamp.setAttribute('aria-hidden','true');label.textContent=found?`✓ Логотип ${i+1}${i===lastBadge?' · Новая находка':''}`:`? Логотип ${i+1}`;place.textContent=b.place;card.append(stamp,label,place);$('badge-album').append(card);});$('journal-button').classList.remove('new-discovery');$('journal-collection').textContent=`Логотипы DEX: ${collected.size} / 8`;renderPinnedActivities();renderActivitySearch();journal.showModal();showJournalTab(journalTab);return true;}
 function closeJournal(){journal.close();clearInput();canvas.focus();}
 function scan(){if(idleEscort)return false;notePlayActivity();if(towScene||driving)return false;if(blocked()||karaokeTime>0||swingTime>0||wheelTime>0||feedScene||funScene||scanCooldown>0)return false;scanTarget=clues.findIndex((_,i)=>!solved.has(i));scanTime=8;scanCooldown=12;if(scanTarget<0){announce(remainingHint());return true;}const p=clues[scanTarget],level=hintLevels[scanTarget]=Math.min(3,(hintLevels[scanTarget]||0)+1);if(level===3){trackedPlace=trackedErrand=-1;}const region=(p.y<H*.4?'северной':p.y>H*.6?'южной':'центральной')+' части парка';announce(level===1?'Подсказка 1/3: ищите в '+region+'. Следующий запрос даст ориентир.':level===2?'Подсказка 2/3: '+(p.hidden?p.hint:p.place)+'. Ещё один запрос включит стрелку.':'Подсказка 3/3: следуйте за стрелкой. Ответ на вопрос нужно найти самостоятельно.');save();return true;}

 function inputDirection(){let x=Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA')),y=Number(keys.has('ArrowDown')||keys.has('KeyS'))-Number(keys.has('ArrowUp')||keys.has('KeyW'));if(!x&&!y)return {x:stick.x,y:stick.y};const len=Math.hypot(x,y)||1;return{x:x/len,y:y/len};}
 function dash(){if(cycling)return ringBikeBell();if(idleEscort)return false;notePlayActivity();if(restingBench)return false;if(towScene)return false;if(driving){driveSpeed=approach(driveSpeed,0,160);return false;}if(blocked()||karaokeTime>0||swingTime>0||wheelTime>0||feedScene||funScene||dashCooldown>0)return false;const d=inputDirection();dashX=d.x||d.y?d.x:player.dx;dashY=d.x||d.y?d.y:player.dy;dashTime=.18;dashCooldown=1.2;burst(player.x,player.y,'#d4f2e4');return true;}
 function step(dt){if(blocked()){notePlayActivity();return;}updateWalkDiscoveries(dt);updateDiscoveries69(dt);updateDiscoveries70(dt);updateDiscoveries71(dt);updateInactivity(dt);errandJoy=errandJoy.map(t=>Math.max(0,t-dt));updateCameraLead(dt);speechTime=Math.max(0,speechTime-dt);updateNotices(dt);updateBicycleEffects(dt);updateBikeCourtesy(dt);updateFairWatchers(dt);stoneCooldown=Math.max(0,stoneCooldown-dt);updateJanitor(dt);updateDuckCrossing(dt);const previousElapsed=elapsed;elapsed+=dt;updateSeasons(previousElapsed);updateSeasonWonders(dt);updateSkyMoments();updateWheelShow(dt);updateStories(dt);updateNature(dt);updateBearLife(dt);bearCooldown=Math.max(0,bearCooldown-dt);updateBubbles(dt);updateParkPlay(dt);updatePhotographer(dt);updateNeighbourStories(dt);updateLawnWater(dt);updateHeroGestures(dt);updateParkDetails(dt);updateResidents(dt);updateParkMoments(dt);updateJubilee(dt);updateGardenRain(dt);updateEncounterGreetings(dt);updateNeighbourPairs(dt);updateNeighbourNames(dt);updateBathSparrows(dt);if(restingBench&&ridesWet()){if(observing)setObservation(false);restingBench=null;clearInput();announce(snowing()?"Метель! Встаём со скамейки. В беседке уютнее.":"Дождь! Встаём со скамейки и раскрываем зонт.");}const ex=Math.floor(player.x/(T*4)),ey=Math.floor(player.y/(T*4));for(let y=Math.max(0,ey-1);y<=Math.min(18,ey+1);y++)for(let x=Math.max(0,ex-1);x<=Math.min(23,ex+1);x++)exploredTiles.add(y*24+x);const key=solved.size+':'+collected.size+':'+errandStates.join(',');if(key!==progressKey){progressKey=key;idleSeconds=0;idleOffered=false;}else idleSeconds+=dt;if(!idleEscort&&idleSeconds>90&&!idleOffered&&!driving&&!funScene&&!feedScene&&!finished){idleOffered=true;announce('Нужна подсказка? Нажмите Q или «Сканер». Можно продолжать искать самостоятельно.');}if(afterRain()>.4&&nightLevel()<.2)remember('rainbow');if(nightLevel()>.7)remember('night');if(achievements.has('photo'))remember('photo');if(trackedPlace>=0&&!(trackedPlace===gardenPlace&&garden.stage===1)&&trackedPlace!==snowmanPlace&&trackedPlace!==squirrelPlace&&trackedPlace!==courierPlace&&trackedPlace!==janitorPlace&&Math.hypot(mapPlaces[trackedPlace].x-player.x,mapPlaces[trackedPlace].y-player.y)<65){announce('Вы на месте: '+mapPlaces[trackedPlace].name);trackedPlace=-1;save();}mapPlaces.forEach((p,i)=>{if(Math.hypot(p.x-player.x,p.y-player.y)<120)visitedPlaces.add(i);});hornCooldown=Math.max(0,hornCooldown-dt);hornGlow=Math.max(0,hornGlow-dt);if(weatherTime()<weatherTime(previousElapsed)){swiftOrigin=null;stormBag=null;}if(pumpTime>0){clearInput();player.vx=player.vy=0;const pumpBefore=pumpTime;pumpTime=Math.max(0,pumpTime-dt);if(pumpTime>0&&Math.floor(pumpBefore)!==Math.floor(pumpTime))window.ParkAudio?.compressor?.();if(pumpTime===0){flatTyre=false;tyreRepaired=true;remember('repair');speech="Готово! Давление в норме. Моё тоже.";speechTime=5;save();}return;}if(weatherTime()>=25&&weatherTime()<30&&!swiftOrigin)swiftOrigin={x:player.x,y:player.y};updateParkLife(dt);if(rainIntensity()>0&&((weatherTime(previousElapsed)<32.7&&weatherTime()>=32.7)||(weatherTime(previousElapsed)<37.7&&weatherTime()>=37.7)))window.ParkAudio?.thunder?.();updateVehicleBody(dt);ageVehicleEffects(dt);updateBrotherEscape(dt);brotherRefusal=Math.max(0,brotherRefusal-dt);updateNutAttack(dt);trafficLightClock+=dt;brakeGlow=Math.max(0,brakeGlow-dt);fountainParty=Math.max(0,fountainParty-dt);dizzyTime=Math.max(0,dizzyTime-dt);updateGuestEscort(dt);if(!reduced&&(!ridesWet()||funScene?.kind==='carousel'))carouselAngle+=dt*(funScene?.kind==='carousel'?1.5:.22);updateBird(dt);updateLuckyPigeon(dt);updatePigeons(dt);if(towScene){updateTowing(dt);return;}if(idleEscort){updateIdleEscort(dt);return;}updateParkingViolation(dt);if(trafficStop&&!driving){updateTrafficStop(dt);return;}if(driving){stepDriving(dt);return;}updateBMW(dt);if(cycling){stepCycling(dt);return;}networkTime=Math.max(0,networkTime-dt);updateNewScenes(dt);coffeeTime=Math.max(0,coffeeTime-dt);bushTime=Math.max(0,bushTime-dt);bootTime=Math.max(0,bootTime-dt);paintTime=Math.max(0,paintTime-dt);if(funScene){updateFunScene(dt);return;}updateGoose(dt);feedCooldown=Math.max(0,feedCooldown-dt);if(feedScene){updateFeeding(dt);return;}coinCooldown=Math.max(0,coinCooldown-dt);if(coin){coin.time+=dt;if(coin.time>=.8){coin=null;const count=finishVisit('fountain');if(count===5){fountainParty=5;burst(42*T+16,28*T,'#ffe58b');}unlockAchievement('fountain');speech=count===5?'Пятая монетка! Фонтан принял заявку на чудо.':'Удача +1';speechTime=3;burst(42*T+16,28*T+24,'#c6f8ff');window.ParkAudio?.reward();}}if(wheelTime>0){wheelTime=Math.max(0,wheelTime-dt);wheelAngle=Math.PI/2+(5-wheelTime)/5*Math.PI*2;clearInput();if(wheelTime===0){finishVisit('wheel');unlockAchievement('wheel');speech='Это увлекательный был аттракцион';speechTime=3;save();}return;}if(!reduced&&!ridesWet())wheelAngle+=dt*.14;if(swingTime>0){swingTime=Math.max(0,swingTime-dt);clearInput();if(swingTime===0){finishVisit('swing');unlockAchievement('swing');speech='Вот это полёт!';speechTime=2;save();}return;}if(karaokeTime>0){karaokeTime=Math.max(0,karaokeTime-dt);clearInput();if(karaokeTime===0){unlockAchievement('karaoke');burst(player.x,player.y-30,'#ffe263');$('activity-title').textContent='Ваш выход — 95 из 100!';$('activity-copy').textContent='Вы заработали 95 баллов из 100 в караоке. Публика в восторге!';save();activity.showModal();}return;}petTime=Math.max(0,petTime-dt);joyTime=Math.max(0,joyTime-dt);saveClock+=dt;if(saveClock>2){saveClock=0;save();}dashTime=Math.max(0,dashTime-dt);dashCooldown=Math.max(0,dashCooldown-dt);scanTime=Math.max(0,scanTime-dt);scanCooldown=Math.max(0,scanCooldown-dt);if(restingBench){clearInput();player.vx=player.vy=0;return;}const d=inputDirection();if(d.x||d.y){player.dx=d.x;player.dy=d.y;player.face=Math.abs(d.x)>Math.abs(d.y)?d.x>0?'right':'left':d.y>0?'down':'up';}player.vx=dashTime>0?dashX*490:approach(player.vx,d.x*(coffeeTime>0?245:185),1400*dt);player.vy=dashTime>0?dashY*490:approach(player.vy,d.y*(coffeeTime>0?245:185),1400*dt);
  const seasonBefore={x:player.x,y:player.y};const mx=player.vx*dt,my=player.vy*dt;if(canStand(player.x+mx,player.y))player.x+=mx;else player.vx=0;if(canStand(player.x,player.y+my))player.y+=my;else player.vy=0;walk+=Math.hypot(player.vx,player.vy)*dt*.12;recordSeasonWalk(seasonBefore);recordFootsteps(seasonBefore);recordWetWalk(seasonBefore);

  nearest=-1;let best=52;clues.forEach((c,i)=>{const d=Math.hypot(c.x-player.x,c.y-player.y);if(!solved.has(i)&&d<best){nearest=i;best=d;}});
  particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;});particles=particles.filter(p=>p.life>0);
 }
 function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
 function text(s,x,y,size,c,align='left'){ctx.fillStyle=c;ctx.font=`bold ${size}px monospace`;ctx.textAlign=align;ctx.fillText(s,Math.round(x),Math.round(y));}
 let labelQueue=[],labelBoxes=[];
 function mapLabel(s,x,y,size=13,priority=0){if(comfort.large)size+=3;labelQueue.push({s,x,y,size,priority});}
 const overlaps=(a,b)=>a.x<b.x+b.w+4&&a.x+a.w+4>b.x&&a.y<b.y+b.h+4&&a.y+a.h+4>b.y;
 function compactDrivingHUD(){return driving&&viewW<420;}
 let shortViewport=false,touchTools=false;
 function melodyFocused(){return melody.active&&!driving&&!cycling&&!funScene&&player.x>=musicTiles[0].x-58&&player.x<=musicTiles[7].x+58&&Math.abs(player.y-musicTiles[0].y)<90;}
 function hideMiniMap(){return touchTools||viewW<420||focusedDialogue()||focusedParkShow()||compactDrivingHUD()||shortViewport;}
 function focusedDialogue(){return viewW<420&&labelQueue.some(l=>l.priority>=5);}
 function focusedParkShow(){return viewW<420&&((['birds','dandelion'].includes(discoveryFocus()))||(duckCrossing&&Math.hypot(player.x-duckCrossingSite.x,player.y-duckCrossingSite.y)<360)||auroraLevel()>.15||(dawnFlock&&Math.hypot(player.x-dawnFlock.x,player.y-dawnFlock.y)<280)||(wheelLightShow&&Math.hypot(player.x-wheel.x,player.y-wheel.y)<280)||['stoneSkip','kite','bear','cinema','portrait','magic','telescope','fairAward'].includes(funScene?.kind)||(fireflyDance&&Math.hypot(player.x-heartSite.x,player.y-heartSite.y)<280)||(fountainShowLevel()>.1&&Math.hypot(player.x-42.5*T,player.y-28.5*T)<260));}
 function drawLabels(){
  // The whole world (including birds and moving cabins) is already painted.
  const reserved=hideMiniMap()?[]:[{x:viewW-122,y:60,w:110,h:85}];if((noticeTime>0||!$('goal-card').hidden)&&!blocked()){const a=($('announcement').parentElement||$('announcement')).getBoundingClientRect(),c=canvas.getBoundingClientRect();if(Number.isFinite(a.left)&&c.width>0&&c.height>0)reserved.push({x:(a.left-c.left)*viewW/c.width,y:(a.top-c.top)*viewH/c.height,w:a.width*viewW/c.width,h:a.height*viewH/c.height});}
  if(!blocked()&&!observing){const a=$('explore-tools').getBoundingClientRect(),c=canvas.getBoundingClientRect();if(Number.isFinite(a.left)&&c.width>0&&c.height>0)reserved.push({x:(a.left-c.left)*viewW/c.width,y:(a.top-c.top)*viewH/c.height,w:a.width*viewW/c.width,h:a.height*viewH/c.height});}
  if(!$('ride-progress').hidden&&!blocked()){const a=$('ride-progress').getBoundingClientRect(),c=canvas.getBoundingClientRect();if(Number.isFinite(a.left)&&c.width>0&&c.height>0)reserved.push({x:(a.left-c.left)*viewW/c.width,y:(a.top-c.top)*viewH/c.height,w:a.width*viewW/c.width,h:a.height*viewH/c.height});}
  if(!blocked()){reserved.push({x:viewW/2-Math.min(190,viewW*.45),y:viewH-84,w:Math.min(380,viewW*.9),h:84});if(!$('prompt').hidden){const a=$('prompt').getBoundingClientRect(),c=canvas.getBoundingClientRect();if(Number.isFinite(a.left)&&c.width>0&&c.height>0)reserved.push({x:(a.left-c.left)*viewW/c.width,y:(a.top-c.top)*viewH/c.height,w:a.width*viewW/c.width,h:a.height*viewH/c.height});}}
  if(rainWritingLevel()>.15)for(const p of rainWriting)reserved.push({x:p.x-115-camX,y:p.y-27-camY,w:230,h:55});
  labelBoxes=[];const placed=[{x:bikeRack.x-48,y:bikeRack.y-74,w:96,h:112},...parkSigns.map(signBounds),...parkRides.map(rideSilhouette),...[janitor,...supporters,...testers].map(n=>({x:n.x-16,y:n.y-58,w:32,h:62}))],hero=heroCanopyBounds(),heroBox=hero?{x:hero.x-camX,y:hero.y-camY,w:hero.w,h:hero.h}:null;ctx.save();
  for(const l of labelQueue.sort((a,b)=>b.priority-a.priority)){l.s=mobileCopy(l.s);
   if(l.priority>=5)l.size=Math.max(14,l.size);ctx.font=`bold ${l.size}px monospace`;const measure=s=>ctx.measureText(s)?.width??s.length*l.size*.62,maxWidth=Math.min(330,viewW-40),lines=[];let row='';
   for(const word of l.s.split(' ')){const next=row?row+' '+word:word;if(row&&measure(next)>maxWidth){lines.push(row);row=word;}else row=next;}if(row)lines.push(row);
   const w=Math.max(...lines.map(measure))+16,h=lines.length*(l.size+4)+12,world={x:l.x-w/2,y:l.y-l.size-5,w,h};
   // Fixed world anchors: neither camera motion nor nearby labels can move a sign.
   if(l.priority<5&&placed.some(b=>overlaps(world,b)))continue;
   let box={x:world.x-Math.round(camX),y:world.y-Math.round(camY),w,h};
   const fits=b=>b.x>=4&&b.y>=4&&b.x+w<=viewW-4&&b.y+h<=viewH-4&&!reserved.some(r=>overlaps(b,r))&&!labelBoxes.some(r=>overlaps(b,r))&&!(heroBox&&overlaps(b,heroBox));
   if(!fits(box)&&l.priority>=5){const x=Math.max(4,Math.min(viewW-w-4,box.x));box=[{x,y:Math.max(4,Math.min(viewH-h-90,box.y)),w,h},{x:Math.max(4,(viewW-w)/2),y:215,w,h},{x:4,y:8,w,h}].find(fits)||box;}
   if(!fits(box))continue;placed.push(world);
   labelBoxes.push({...box,s:l.s,worldX:world.x,worldY:world.y});rect(box.x,box.y,w,h,'#183d32f5');rect(box.x,box.y+h-2,w,2,'#a8c9a4');lines.forEach((row,i)=>text(row,box.x+w/2,box.y+8+l.size+i*(l.size+4),l.size,'#fff5d6','center'));
  }ctx.restore();
 }

 let encounterGreeting=null,encounterNPC=null,encounterText='',greetingCooldowns=new Map();
 function updateEncounterGreetings(dt){
  if(encounterGreeting){encounterGreeting.remaining-=dt;if(encounterGreeting.remaining<=0)encounterGreeting=null;}
  const n=nearSupporter(),busy=ambientSceneBusy()||!!bikeReply||driving||funScene||feedScene||towScene||trafficStop||karaokeTime>0||wheelTime>0||swingTime>0||speechTime>0;
  if(!n){encounterNPC=null;encounterText='';encounterGreeting=null;return;}
  if(busy||(n===brother&&(!bmwAvailable||brotherShout>0))||errands.some((e,i)=>e.giver===n&&errandStates[i]!==3)){encounterGreeting=null;return;}
  if(encounterGreeting&&encounterGreeting.npc!==n)encounterGreeting=null;const line=n===encounterNPC&&encounterText?encounterText:friendlyGreeting(n);if(!line)return;
  if((n!==encounterNPC||line!==encounterText)&&elapsed>=(greetingCooldowns.get(n)||0)){encounterNPC=n;encounterText=line;encounterGreeting={npc:n,text:line,remaining:4.5};greetingCooldowns.set(n,elapsed+60);meetNeighbourForNpc(n);if(line===fairChampionLine(n)){fairRecognitionAt=elapsed+45;fairRecognitionIndex++;}rememberMessage(line,'Реплика');rememberNpcVisit(n);}
 }
 function nearSupporter(){let result=null,best=100;for(const n of [...supporters,brother,sighGuest,...(!trafficStop&&!towScene?[parkInspector]:[]),extraSpots.find(p=>p.kind==='questAuthor'),...((fairStats.music?.plays||0)>0?fairFamily:[]),...((rideVisits.chess||0)>0?[parkRides.find(p=>p.id==='chess')]:[])]){const distance=Math.hypot(player.x-n.x,player.y-n.y);if(distance<best){result=n;best=distance;}}return result;}
 // Stable appearances belong to characters, never to their current world coordinates.
 const NPC_LOOKS=[
  {hair:'#444036',skin:'#c89370',shirt:'#668b83',pants:'#485654',cut:'part',beard:true,garment:'vest',width:11,head:8,height:1.03,seed:0},
  {hair:'#59423e',skin:'#edc3a5',shirt:'#ab7380',pants:'#5e5263',cut:'bob',garment:'dress',width:9,head:7,height:.98,seed:1},
  {hair:'#534539',skin:'#d5a27d',shirt:'#c2aa73',pants:'#536779',cut:'curls',garment:'stripes',width:9,head:8,height:.95,seed:2},
  {hair:'#766047',skin:'#e0b58e',shirt:'#7497a0',pants:'#536678',cut:'crop',hat:'cap',garment:'sport',width:11,head:8,height:.97,seed:3},
  {hair:'#858579',skin:'#d7ac87',shirt:'#5f8980',pants:'#4e6259',cut:'crop',moustache:true,garment:'polo',width:12,head:9,height:1.04,seed:4},
  {hair:'#554b3e',skin:'#ad795c',shirt:'#8ea99a',pants:'#485d62',cut:'ponytail',garment:'sport',headband:true,width:9,head:7,height:.96,seed:5},
  {hair:'#b9b7a6',skin:'#e1b999',shirt:'#b39c78',pants:'#6d6056',cut:'bun',glasses:'round',garment:'cardigan',width:10,head:8,height:.95,seed:6},
  {hair:'#8a5c41',skin:'#efd0ad',shirt:'#bb896d',pants:'#5c6258',cut:'quiff',garment:'stripes',width:9,head:7,height:1.05,seed:7},
  {hair:'#62594b',skin:'#ca9c7a',shirt:'#9ba278',pants:'#576956',cut:'crop',hat:'sunhat',moustache:true,garment:'vest',width:11,head:8,height:1,seed:8},
  {hair:'#9e6547',skin:'#e7bd9a',shirt:'#83aaa1',pants:'#596c72',cut:'braid',garment:'sport',headband:true,width:9,head:8,height:1,seed:9},
  {hair:'#786d5d',skin:'#cfa080',shirt:'#b67877',pants:'#566474',cut:'bald',glasses:'square',garment:'polo',width:11,head:9,height:1,seed:10},
  {hair:'#493f3a',skin:'#b78262',shirt:'#e0dbca',pants:'#82748a',cut:'bob',garment:'dress',width:9,head:7,height:1.02,seed:11},
  {hair:'#bbb8a4',skin:'#e5bd9c',shirt:'#68848f',pants:'#59605b',cut:'part',beard:true,garment:'cardigan',width:11,head:8,height:1.02,seed:12},
  {hair:'#48483e',skin:'#c68f6c',shirt:'#7b8caa',pants:'#4c5c6f',cut:'quiff',garment:'hoodie',width:10,head:8,height:1,seed:13},
  {hair:'#49443a',skin:'#9d7056',shirt:'#779080',pants:'#586956',cut:'curls',moustache:true,garment:'jacket',bag:true,width:11,head:9,height:1.03,seed:14},
  {hair:'#aa744a',skin:'#edc8a9',shirt:'#af8fa6',pants:'#5e657e',cut:'ponytail',glasses:'round',garment:'overalls',width:9,head:7,height:.98,seed:15}
 ];
 const maximLook={...NPC_LOOKS[14],hair:'#493d3b',skin:'#edb8a2',shirt:'#526ec4',pants:'#445268',cut:'curls',garment:'hoodie',moustache:false,bag:false,width:11,head:8,height:1};
 supporters[5].appearance=maximLook;
 const npcLookCache=new Map();
 function npcAppearance(n){
  if(n.appearance)return n.appearance;
  if(Number.isInteger(n.avatar)&&NPC_LOOKS[n.avatar])return NPC_LOOKS[n.avatar];
  const key=[n.hair,n.shirt,n.style].join('|');let p=npcLookCache.get(key);if(p)return p;
  let hash=0;for(let i=0;i<key.length;i++)hash=(hash*31+key.charCodeAt(i))>>>0;
  const base=NPC_LOOKS[hash%NPC_LOOKS.length];p={...base,hair:n.hair||base.hair,shirt:n.shirt||base.shirt,garment:n.style==='plaid'?'plaid':n.style==='hoodie'?'hoodie':base.garment};npcLookCache.set(key,p);return p;
 }
 function npcBlink(p){return !reduced&&(elapsed+p.seed*1.73)%(5.2+p.seed%4*.6)<.12;}
 function drawNpcHair(p,back=false){
  const h=p.head,c=p.hair,cut=p.cut;
  if(back){
   if(cut==='bob'){rect(-h-2,-44,h*2+4,22,c);rect(-h-1,-26,h*2+2,3,c);}
   if(cut==='ponytail'){rect(h,-45,6,15,c);rect(h+2,-34,4,9,c);rect(h,-41,5,3,'#c5b681');}
   if(cut==='braid'){for(let i=0;i<4;i++)rect(-h-4+i%2,-35+i*5,5,6,c);rect(-h-3,-16,4,3,'#c7a36a');}
   return;
  }
  if(cut==='bald'){rect(-h-1,-40,3,9,c);rect(h-2,-40,3,9,c);rect(-h,-45,4,4,c);rect(h-4,-45,4,4,c);return;}
  rect(-h-1,-46,h*2+2,6,c);rect(-h-1,-41,3,7,c);
  if(cut==='part'){rect(-h,-49,h+3,5,c);rect(-1,-47,h+3,5,c);rect(0,-46,2,3,'#b7a482');}
  if(cut==='quiff'){rect(-h+2,-50,h*2-3,7,c);rect(-h+5,-52,h+1,4,c);rect(h-3,-44,4,7,c);}
  if(cut==='curls'){for(let i=0;i<4;i++){rect(-h-2+i*5,-49+(i%2)*2,6,7,c);rect(-h-3+i*5,-43,6,5,c);}rect(h-1,-42,4,5,c);}
  if(cut==='bun'){rect(-5,-53,10,7,c);rect(-7,-49,14,5,c);rect(h-2,-41,3,7,c);}
  if(cut==='bob'){rect(-h-1,-41,4,13,c);rect(h-2,-41,4,13,c);rect(-h+2,-43,7,5,c);}
  if(cut==='ponytail'||cut==='braid'){rect(-h+1,-49,h*2-2,5,c);rect(-h,-43,5,5,c);}
 }
 const npcWardrobes=new WeakMap();
 function npcWardrobe(p){
  const cold=snowing()||snowCover()>.08,wet=!cold&&rainIntensity()>.05;if(!cold&&!wet)return p;
  let clothes=npcWardrobes.get(p);if(!clothes){const coats=['#748f99','#b29677','#879981','#a48289'],raincoats=['#b8aa72','#789d99','#8b9eae','#ae8c91'];clothes={cold:{...p,shirt:coats[p.seed%4],garment:'coat',hat:'knit',headband:false},wet:{...p,shirt:raincoats[p.seed%4],garment:'raincoat',hat:'hood',headband:false}};npcWardrobes.set(p,clothes);}return cold?clothes.cold:clothes.wet;
 }
 const neighbourPairs=[
  {id:'hello',home:point([27,28]),time:0,phase:'idle',cooldown:6,cast:[
   {id:'walk-tamara',name:'Посетительница',role:'Любит прогулки',avatar:11,home:point([25,28]),meet:point([26,28])},
   {id:'walk-boris',name:'Посетитель',role:'Друг по прогулке',avatar:12,home:point([29,28]),meet:point([28,28])}]},
  {id:'family',home:point([76,26]),time:0,phase:'idle',cooldown:6,cast:[
   {id:'walk-olga',name:'Мама',role:'На прогулке с сыном',avatar:1,home:point([75,26]),meet:point([75,25])},
   {id:'walk-misha',name:'Мальчик',role:'Любит аттракционы',avatar:7,heightScale:.74,home:point([76,26]),meet:point([76,24])}]}
 ];
 for(const pair of neighbourPairs)for(const n of pair.cast)Object.assign(n,n.home,{quiet:true,moving:false,stride:0});
 // Names confirmed by the user. Anonymous visitors keep their roles, not aliases.
 const residentNames=[['','Бегунья'],['','Посетитель с телефоном'],['','Любительница цветов'],['','Посетитель с блокнотом'],['','Фотолюбитель'],['Максим','Хозяин собачки'],['Аня','Ищет свою книгу']];
 const colleagueNames={football:'Никита',cap:'Антон',goatee:'Дима',lace:'Лена',beard:'Толя',bob:'Наташа',tie:'Саша',blonde:'Алена'};
 const namedNeighbours=[
  ...supporters.map((n,i)=>({id:'resident-'+i,name:residentNames[i][0],role:residentNames[i][1],npc:()=>n})),
  ...fairFamily.map((n,i)=>({id:'musician-'+i,name:'',role:n.name,npc:()=>n})),
  {id:'fair-sack',name:'',role:'Соперник в мешках',npc:()=>({...fairSackRival,...fairRivalPose(null)})},
  ...fairRopeCast.map((n,i)=>({id:'fair-rope-'+i,name:'',role:'Участник перетягивания каната',npc:()=>({...n,x:fairSites[2].x+[-79,-48,54,84][i],y:fairSites[2].y+10})})),
  {id:'fair-rings',name:'',role:'Ведущий кольцеброса',npc:()=>({...fairRingHost,x:fairSites[3].x+55,y:fairSites[3].y-22})},
  ...neighbourPairs.flatMap(p=>p.cast.map(n=>({id:n.id,name:'',role:n.name,npc:()=>n}))),
  {id:'chess-alexey',name:'Леша',role:'Шахматист',npc:()=>parkRides.find(p=>p.id==='chess')},
  ...testers.filter(n=>colleagueNames[n.look]).map(n=>({id:'colleague-'+n.look,name:colleagueNames[n.look],role:n.look==='cap'?'Рыбак':'Коллега на прогулке',portrait:'tester',npc:()=>n})),
  {id:'guest-zhanna',name:'Жанна',role:'На прогулке',portrait:'sigh',npc:()=>sighGuest},
  {id:'golf-serezha',name:'Сережа',role:'Хозяин Golf',portrait:'brother',npc:()=>brother},
  {id:'laptop-sasha',name:'Саша',role:'С ноутбуком',portrait:'laptop',npc:()=>extraSpots.find(p=>p.kind==='vacation')}
 ];
 function neighbourTitle(n){return n.name||neighbourRole(n);}
 function neighbourCaption(n){return n.name?n.name+' · '+neighbourRole(n):neighbourRole(n);}
 let metNeighbours=new Set(),neighbourIntro=null,neighbourLast='',neighbourNamesWait=new Map();
 function restoreNeighbours73(v={}){
  canopyObject=null;canopyFades.clear();
  metNeighbours=new Set((Array.isArray(v.metNeighbours)?v.metNeighbours:[]).filter(id=>namedNeighbours.some(n=>n.id===id)));
  neighbourIntro=null;neighbourLast='';neighbourNamesWait.clear();
  if(Number.isInteger(v.rideVisits?.chess)&&v.rideVisits.chess>0&&v.rideVisits.chess<=3)metNeighbours.add('chess-alexey');
  if(Number.isInteger(v.errands?.[1])&&v.errands[1]>0&&v.errands[1]<=3)metNeighbours.add('resident-6');
  if(Number.isInteger(v.errands?.[0])&&v.errands[0]>0&&v.errands[0]<=3)metNeighbours.add('resident-5');
  if(Number.isInteger(v.fair?.music?.plays)&&v.fair.music.plays>0)for(let i=0;i<3;i++)metNeighbours.add('musician-'+i);
  for(const p of neighbourPairs){p.phase='idle';p.time=0;p.cooldown=6;for(const n of p.cast)Object.assign(n,n.home,{moving:false,stride:0,pose:undefined});}
 }
 function neighbourRole(n){return n.id==='resident-6'?(errandStates[1]===0?'Ищет свою книгу':errandStates[1]===3?'Любит читать':'Ждёт книгу'):n.role;}
 function neighbourSceneBusy(){return momentsBusy()||ambientSceneBusy()||observing||speechTime>0||residentRemark>0||!!encounterGreeting||weatherSpeaking();}
 function neighbourStep(n,target,dt){
  n.moving=false;const dx=target.x-n.x,dy=target.y-n.y,d=Math.hypot(dx,dy);if(d<.4)return true;
  const step=Math.min(d,dt*24),x=n.x+dx/d*step,y=n.y+dy/d*step;
  if(!residentClear(x,y)||Math.hypot(x-player.x,y-player.y)<30||supporters.some(p=>Math.hypot(x-p.x,y-p.y)<30)||neighbourPairs.some(p=>p.cast.some(o=>o!==n&&Math.hypot(x-o.x,y-o.y)<27)))return false;
  n.x=x;n.y=y;n.moving=true;n.stride+=step*.2;return d<=step+.4;
 }
 function updateNeighbourPairs(dt){
  for(const p of neighbourPairs){
   for(const n of p.cast){n.moving=false;n.pose=undefined;}
   if(neighbourSceneBusy())continue;
   p.cooldown=Math.max(0,p.cooldown-dt);const nearby=Math.hypot(player.x-p.home.x,player.y-p.home.y)<240;
   if(p.phase==='idle'){
    if(!nearby||p.cooldown>0||ridesWet()||snowCover()>.08||neighbourIntro||neighbourPairs.some(o=>o!==p&&o.phase!=='idle'))continue;
    p.phase=p.id==='hello'?'approach':'talk';p.time=0;
   }
   if((!nearby||ridesWet()||snowCover()>.08)&&p.phase!=='return'){p.phase='return';p.time=0;}
   if(p.phase==='approach'){
    const arrived=reduced||p.cast.map(n=>neighbourStep(n,n.meet,dt)).every(Boolean);p.time+=dt;
    if(arrived){p.phase='talk';p.time=0;}else if(p.time>8){p.phase='return';p.time=0;}
   }else if(p.phase==='talk'){
    p.time+=dt;p.cast[p.id==='family'?(p.time<3?1:0):(p.time<3?0:1)].pose=p.id==='hello'?'hello':'point';
    if(p.time>=6){p.phase=p.id==='hello'||reduced?'return':'stroll';p.time=0;}
   }else if(p.phase==='stroll'){
    const arrived=p.cast.map(n=>neighbourStep(n,n.meet,dt)).every(Boolean);p.time+=dt;
    if(arrived||p.time>8){p.phase='return';p.time=0;}
   }else if(p.phase==='return'){
    const arrived=p.cast.map(n=>neighbourStep(n,n.home,dt)).every(Boolean);
    if(arrived){p.phase='idle';p.time=0;p.cooldown=75;}
   }
  }
 }
 function updateNeighbourNames(dt){
  if(neighbourIntro){neighbourIntro.left-=dt;if(neighbourIntro.left<=0)neighbourIntro=null;}
  if(neighbourSceneBusy()||neighbourPairs.some(p=>p.phase==='talk')||driving||cycling){neighbourIntro=null;return;}
  let closest=null,best=86;for(const n of namedNeighbours){const p=n.npc(),d=Math.hypot(player.x-p.x,player.y-p.y);if(d<best){best=d;closest=n;}}
  if(!closest){neighbourLast='';neighbourIntro=null;return;}
  if(neighbourIntro&&neighbourIntro.person.id!==closest.id)neighbourIntro=null;
  if(closest.id===neighbourLast||elapsed<(neighbourNamesWait.get(closest.id)||0))return;
  neighbourLast=closest.id;neighbourNamesWait.set(closest.id,elapsed+30);
  const fresh=!metNeighbours.has(closest.id);neighbourIntro={person:closest,left:fresh?3.5:2.5};
  if(fresh)meetNeighbour(closest.id);
 }

 // Album entries derive from completed actions; browsing never changes progress.
 function meetNeighbour(id){
  const n=namedNeighbours.find(p=>p.id===id);if(!n||metNeighbours.has(id))return false;
  metNeighbours.add(id);rememberMessage('Знакомство: '+(n.name?n.name+' — ':'')+neighbourRole(n)+'.','Разговор');save();return true;
 }
 function meetNeighbourForNpc(n){const p=namedNeighbours.find(p=>p.npc()===n);if(p)meetNeighbour(p.id);}
 function neighbourStory(n){
  if(n.id==='resident-6')return ['Познакомились у кафе. Аня ищет свою книгу.','Помогаем Ане найти книгу.','Книга нашлась! Осталось вернуть её Ане.','Вернули книгу. Аня читает и помнит вашу помощь.'][errandStates[1]];
  if(n.id==='resident-5')return errandStates[0]===3?'Вернули мячик. '+(fetchTrips?'Поиграли с собачкой: '+fetchTrips+'.':'Хвостатый друг ждёт совместной игры.'):errandStates[0]>0?'Помогаем найти мячик для его собачки.':'Познакомились у стартовой аллеи.';
  if(n.id==='chess-alexey')return (rideVisits.chess||0)===3?'Три партии — три ваши победы. Леша тренирует ферзя.':rideVisits.chess?'Вы — Леша: '+rideVisits.chess+' : 0. Можно сыграть ещё.':'Леша ждёт за шахматным столом. Каждая партия — пять секунд.';
  if(n.id.startsWith('musician-'))return fairStats.music?.plays?'Послушали семейный концерт. Музыканты узнают вас.':'Познакомились у маленькой сцены на ярмарке.';
  const game=n.id==='fair-sack'?'sacks':n.id.startsWith('fair-rope-')?'rope':n.id==='fair-rings'?'rings':'';
  if(game)return fairStats[game]?.plays?'Сыграли вместе: '+fairStats[game].plays+'. Ваш лучший результат: '+fairStats[game].best+' / 7.':'Познакомились на парковой ярмарке.';
  if(n.portrait==='laptop')return 'Даже на прогулке нашлась минутка для ноутбука.';
  if(n.portrait==='brother')return 'Повстречались у парковки. Его Golf всегда узнаваем.';
  if(n.portrait==='tester'||n.portrait==='sigh')return 'Повстречались на прогулке по парку.';
  return n.id.startsWith('walk-')?'Повстречались на прогулке. В парке стало на одно знакомое лицо больше.':'Познакомились на центральной аллее. Здесь всегда поддержат добрым словом.';
 }
 function neighbourPortrait(n){
  const c=document.createElement('canvas');c.width=128;c.height=144;c.setAttribute('aria-hidden','true');
  const old={ctx,reduced,elapsed,capturingPhoto};try{
   ctx=c.getContext('2d');if(!ctx)return c;reduced=true;elapsed=0;capturingPhoto=true;ctx.imageSmoothingEnabled=false;
   rect(0,0,128,144,'#e8eddd');rect(0,117,128,27,'#d6dfc7');ctx.translate(64,128);
   if(n.id==='chess-alexey'){ctx.scale(.94,.94);drawChess({x:0,y:0},false);}
   else if(n.portrait){ctx.scale(n.portrait==='laptop'?1.65:2,n.portrait==='laptop'?1.65:2);const person={...n.npc(),x:0,y:0};if(n.portrait==='tester')drawTester(person);else if(n.portrait==='sigh')drawSighGuest(person);else if(n.portrait==='brother')drawBrother(person);else if(n.portrait==='laptop')drawRemainingProp(person);}
   else{ctx.scale(2,2);const person={...n.npc(),x:0,y:0,quiet:true,moving:false,pose:undefined};drawNpcBody(person,npcAppearance(person),{reading:n.id==='resident-6'&&errandStates[1]===3,portrait:true});}
  }finally{ctx=old.ctx;reduced=old.reduced;elapsed=old.elapsed;capturingPhoto=old.capturingPhoto;}return c;
 }
 function renderNeighboursAlbum(){
  const list=$('neighbours-album');list.replaceChildren();const priority=['resident-6','chess-alexey','resident-5'],rank=n=>priority.includes(n.id)?priority.indexOf(n.id):3;const known=namedNeighbours.filter(n=>metNeighbours.has(n.id)).sort((a,b)=>rank(a)-rank(b));
  $('neighbours-count').textContent='Ваши знакомые: '+known.length+'. Новые карточки появляются при встречах. Истории обновляются после совместных дел.';
  $('neighbours-empty').hidden=known.length>0;
  for(const n of known){const li=document.createElement('li'),body=document.createElement('div'),title=document.createElement('h3'),role=document.createElement('p'),story=document.createElement('p');
   li.className='neighbour-card';title.textContent=neighbourTitle(n);role.className='neighbour-role';role.textContent=n.name?neighbourRole(n):'';role.hidden=!n.name;story.textContent=neighbourStory(n);body.append(title,role,story);li.append(neighbourPortrait(n),body);list.append(li);}
 }

 function drawNeighbourLabels(){
  if(capturingPhoto||neighbourSceneBusy())return;
  const pair=neighbourPairs.find(p=>p.phase==='talk');
  if(pair){const i=pair.time<3?0:1,n=pair.cast[i],copy=pair.id==='hello'?['Привет! Как прогулка?','Лучше любого совещания!']:['Мам, можно на колесо?','Конечно! Только держись рядом.'];const speaker=pair.id==='family'?pair.cast[1-i]:n;mapLabel(speaker.name+': '+copy[i],speaker.x,speaker.y-68,12,5);return;}
  if(neighbourIntro){const n=neighbourIntro.person,p=n.npc();mapLabel(neighbourCaption(n),p.x,p.y-(n.portrait==='laptop'?88:65),11,5);}
 }

 function drawNpcBody(n,p,{waving=false,reading=false,searching=false,portrait=false}={}){
  if(!portrait)p=npcWardrobe(p);
  const w=p.width,skin=p.skin,stride=n.moving&&!reduced?Math.sin(n.stride||0)*2.5:0,still=!n.moving&&!reading&&!searching&&!n.pose,breathe=reduced||!still?0:Math.sin(elapsed*1.8+p.seed)*.55;
  rect(-w-3,0,w*2+6,5,'#365c3b55');ctx.save();ctx.scale(1,n.heightScale??p.height);ctx.translate(0,-breathe);
  if(searching&&!n.moving&&!reduced)ctx.rotate(Math.sin(elapsed*1.4)*.035);
  drawNpcHair(p,true);
  if(p.bag){rect(-w-5,-25,7,20,'#877556');rect(-w-5,-16,7,2,'#b3a47f');}
  rect(-7,-9+stride,5,12,p.pants);rect(3,-9-stride,5,12,p.pants);rect(-9,1+stride,8,3,'#e4e5d5');rect(2,1-stride,8,3,'#e4e5d5');
  rect(-w,-26,w*2,22,p.shirt);rect(-w+2,-28,w*2-4,3,p.shirt);rect(-3,-30,6,5,skin);
  if(p.garment==='dress'){rect(-w-2,-13,w*2+4,11,p.shirt);rect(-w,-17,w*2,3,'#a59c88');}
  if(p.garment==='stripes')for(const y of [-22,-15,-8])rect(-w+1,y,w*2-2,3,'#e5d9b9');
  if(p.garment==='plaid'){for(const y of [-22,-13])rect(-w,y,w*2,3,'#c2a885');for(const x of [-5,4])rect(x,-26,2,21,'#c2a885');}
  if(['vest','cardigan','jacket'].includes(p.garment)){rect(-4,-25,8,20,'#dfd9bf');rect(-w,-26,w-4,22,p.shirt);rect(5,-26,w-5,22,p.shirt);rect(-w+2,-13,5,2,'#465c54');if(p.garment==='cardigan')for(let y=-21;y<-5;y+=6)rect(4,y,2,2,'#d1c79f');}
  if(p.garment==='overalls'){rect(-6,-24,3,10,p.pants);rect(4,-24,3,10,p.pants);rect(-7,-15,15,11,p.pants);rect(-3,-12,7,5,p.shirt);}
  if(p.garment==='hoodie'){rect(-w-1,-29,w*2+2,6,p.shirt);rect(-5,-24,2,7,'#dce2d2');rect(4,-24,2,7,'#dce2d2');rect(-5,-10,11,3,'#556b7b');}
  if(p.garment==='sport'){rect(-w,-25,3,17,'#e6e1c6');rect(w-3,-25,3,17,'#e6e1c6');rect(-3,-21,7,8,'#e6e1c6');rect(0,-19,2,4,p.shirt);}
  if(p.garment==='coat'||p.garment==='raincoat'){rect(-w-1,-26,w*2+2,24,p.shirt);rect(-1,-25,2,23,'#e0d9ba');for(const y of [-20,-13,-6])rect(2,y,2,2,'#52675f');rect(-w+2,-12,5,2,'#52675f');}
  if(p.garment==='polo'){rect(-5,-26,4,4,'#d9d8bf');rect(2,-26,4,4,'#d9d8bf');rect(0,-22,1,4,'#ded6b8');}
  const h=p.head;rect(-h,-42,h*2,16,skin);rect(-h+2,-27,h*2-4,2,skin);rect(-h-2,-36,2,6,skin);rect(h,-36,2,6,skin);
  drawNpcHair(p);const eye=p.head===9?5:4,blink=npcBlink(p),gaze=!n.quiet&&Math.hypot(player.x-n.x,player.y-n.y)<130?(player.x>n.x?1:-1):0;
  for(const x of [-eye,eye-1]){rect(x+gaze,-35,blink?3:2,blink?1:2,'#39433c');if(p.beard||p.moustache)rect(x-1,-38,4,1,p.hair);}
  rect(0,-31,2,2,'#ad7d60');
  if(p.beard){rect(-h+1,-30,h*2-2,5,p.hair);rect(-h+3,-25,h*2-6,2,p.hair);rect(-3,-29,6,2,'#e5c4a6');}
  else{rect(-2,-27,5,p.seed%3===0?2:1,'#946753');if(p.moustache){rect(-5,-30,10,2,p.hair);rect(-5,-29,3,2,p.hair);}}
  if(p.glasses){ctx.strokeStyle='#5a6156';ctx.lineWidth=1;if(p.glasses==='round'){for(const x of [-4,4]){ctx.beginPath();ctx.arc(x,-34,3,0,Math.PI*2);ctx.stroke();}}else{ctx.strokeRect(-8,-38,7,6);ctx.strokeRect(1,-38,7,6);}rect(-1,-35,2,1,'#5a6156');}
  if(p.headband){rect(-h-1,-42,h*2+2,3,'#e5d9bc');rect(h,-42,4,2,'#d4c18c');}
  if(p.hat==='cap'){rect(-h-1,-49,h*2+1,7,p.shirt);rect(-h+1,-51,h*2-3,3,p.shirt);rect(-h-4,-43,h*2+6,3,'#586a64');}
  if(p.hat==='sunhat'){rect(-h,-51,h*2,8,'#c4b687');rect(-h-5,-44,h*2+10,4,'#d9c99b');rect(-h,-46,h*2,2,'#7b8165');}
  if(p.hat==='hood'){rect(-h-4,-46,4,22,p.shirt);rect(h,-46,4,22,p.shirt);rect(-h-3,-52,h*2+6,7,p.shirt);rect(-h-2,-46,3,3,'#dbd4b2');rect(h-1,-46,3,3,'#dbd4b2');}
  if(p.hat==='knit'){rect(-h-2,-52,h*2+4,10,p.shirt);rect(-h-3,-44,h*2+6,4,'#d2c5a4');rect(-3,-57,6,5,'#d2c5a4');rect(-h-1,-25,h*2+2,4,'#d2c5a4');rect(3,-22,5,12,'#d2c5a4');}
  rect(-w-3,-24,4,8,p.shirt);rect(w-1,-24,4,8,p.shirt);
  if(n.pose==='hello'||n.pose==='point'){const lift=n.pose==='hello'?(reduced?0:Math.sin(elapsed*4)*2):0;rect(-w-3,-16,4,10,skin);rect(w-1,-29-lift,4,13,skin);rect(w-1,-33-lift,7,5,skin);}
  else if(n.pose==='rope'){line(-w-1,-16,-8,-19,skin,4);line(w+1,-16,8,-19,skin,4);}
  else if(n.pose==='clap'){const clap=reduced?2:Math.abs(Math.sin(elapsed*9+p.seed))*4;rect(-w-2,-17,w-3+clap,5,skin);rect(4-clap,-17,w-2+clap,5,skin);}
  else{rect(-w-3,-16,4,10,skin);if(waving){const wave=reduced?0:Math.sin(elapsed*5+p.seed)*2;rect(w,-31-wave,4,16,skin);rect(w-1,-36-wave,6,7,skin);rect(w-1,-39-wave,2,4,skin);rect(w+3,-38-wave,2,3,skin);}else rect(w-1,-16,4,10,skin);}
  if(p.garment==='coat'||p.garment==='raincoat'){rect(-w-3,-22,4,11,p.shirt);if(!waving&&!n.pose)rect(w-1,-22,4,11,p.shirt);}
  if(reading){const opening=reduced?1:Math.min(1,(4-errandJoy[1])*2);drawQuestBook(0,-15,opening,true);rect(-13,-15,4,5,skin);rect(9,-15,4,5,skin);}
  drawResidentActivity(n,waving,reading);ctx.restore();
 }
 function drawSupporter(n){
  if(photoGreeting(n)){ctx.save();ctx.translate(n.x,n.y);drawNpcBody({...n,moving:false,quiet:true},npcAppearance(n),{waving:true});ctx.restore();return;}
  const reacting=hornReaction&&elapsed<hornReaction.until&&Math.hypot(n.x-hornReaction.x,n.y-hornReaction.y)<230,reading=n===errands[1].giver&&errandStates[1]===3,searching=n===errands[1].giver&&errandStates[1]===0,waving=!n.quiet&&!reading&&!searching&&!n.pose&&(reacting||Math.hypot(player.x-n.x,player.y-n.y)<100);
  ctx.save();ctx.translate(n.x,n.y);if(reacting&&hornReaction.x<n.x)ctx.scale(-1,1);drawNpcBody(n,npcAppearance(n),{waving,reading,searching});ctx.restore();
 }
 function windGust(){return reduced?.25:.35+Math.pow((1+Math.sin(elapsed*.43))*.5,3)*1.65+rainIntensity()*1.8+snowIntensity()*2.3;}
 function sunlight(){return (1-rainIntensity()*.92)*(1-snowIntensity()*.88)*(1-nightLevel());}
 // Fade foliage only when it is drawn in front of the visible hero.
 function heroCanopyBounds(){if(cycling)return {x:player.x-30,y:player.y-63,w:60,h:70,depth:player.y};if(driving||karaokeTime>0||swingTime>0||wheelTime>0||['parkRide','carousel','door409'].includes(funScene?.kind))return null;const x=restingBench?restingBench.tx*T+32:player.x,y=restingBench?restingBench.ty*T+24:player.y;return {x:x-15,y:y-56,w:30,h:62,depth:player.y};}

 let canopyObject=null;const canopyFades=new Map();
 function updateCanopyObject(){
  canopyObject=null;if(driving||cycling||funScene||observing)return;
  const a=nearAttraction();if(!a||!canMarkInteraction(a))return;
  const distance=Math.hypot(a.x-player.x,a.y-player.y),strength=unit((80-distance)/26);if(!strength)return;
  if(a.kind==='parkRide')canopyObject={...rideSilhouette(a),depth:a.y-32,strength};
  else if(a.kind==='wheel')canopyObject={x:a.x-95,y:a.y-220,w:190,h:218,depth:a.y,strength};
  else canopyObject={x:a.x-22,y:a.y-(a.type==='giver'||a.kind==='fair'?60:38),w:44,h:a.type==='giver'||a.kind==='fair'?64:44,depth:a.y,strength};
 }
 function canopyOpacity(bounds,depth){
  let opacity=1;const hero=heroCanopyBounds();
  for(const target of [hero,canopyObject]){
   if(!target||target.depth>=depth)continue;
   const horizontal=Math.min(bounds.x+bounds.w,target.x+target.w)-Math.max(bounds.x,target.x),vertical=Math.min(bounds.y+bounds.h,target.y+target.h)-Math.max(bounds.y,target.y);
   if(horizontal<=0||vertical<=0)continue;
   const overlap=Math.min(1,horizontal/12,vertical/12);opacity=Math.min(opacity,1-.74*overlap*overlap*(3-2*overlap)*(target.strength??1));
  }return opacity;
 }
 function foliageOpacity(bounds,depth){
  const target=canopyOpacity(bounds,depth),key=bounds.x+','+bounds.y+','+depth;
  if(capturingPhoto)return target;
  const previous=canopyFades.get(key),dt=previous?Math.max(0,Math.min(.25,elapsed-previous.time)):0;
  const value=!previous||reduced?target:previous.value+(target-previous.value)*(1-Math.exp(-dt/ .1));
  canopyFades.set(key,{value,time:elapsed});return value;
 }
 function tree(t){const x=t.tx*T,y=t.ty*T,seed=t.tx*37+t.ty*61,phase=t.tx*.31+t.ty*.19;
 const sway=reduced?0:Math.sin(elapsed*1.6-phase)*(1+windGust())+Math.sin(elapsed*3+phase)*.35;
 const colors=seasonPalette().trees[seed%3];
 rect(x+2,y+12,31,24,'#234c3e');rect(x+13,y+19,8,17,'#71543b');rect(x+14,y+20,2,15,'#ab8051');rect(x+19,y+25,2,10,'#4e4532');rect(x+11,y+33,5,3,'#675139');
 ctx.save();ctx.globalAlpha=foliageOpacity({x:x-3,y:y-16,w:39,h:38},y+20);ctx.translate(x+sway*.65,y);rect(2,-6,29,27,colors[0]);rect(6,-13,21,31,colors[1]);rect(10,-16,13,26,colors[2]);rect(4,3,7,8,colors[3]);
 for(let j=0;j<13;j++){const n=(seed+j*47)%113,px=7+n%17,py=-10+(n*7)%27,w=3+n%4;rect(px,py,Math.min(w,28-px),2+n%3,j%4===0?colors[3]:j%3===0?colors[0]:colors[2]);if(j%4===0)rect(px,py,2,1,'#b1ce7b88');}rect(5,17,7,3,colors[0]);rect(22,9,6,6,colors[0]);drawBlossoms(t);snowCap(10,-16,13,4);snowCap(5,-7,9,3);snowCap(22,3,9,3);ctx.restore();}
 function drawSunGround(){const sun=sunlight();ctx.save();for(const t of trees){const x=t.tx*T,y=t.ty*T;if(x<camX-70||x>camX+viewW+30||y<camY-60||y>camY+viewH+30)continue;rect(x+9,y+26,39,9,'#244a3524');rect(x+20,y+35,30,5,'#244a3519');if(sun>.1&&!comfort.lightweight){const drift=reduced?0:Math.sin(elapsed*.9+t.tx)*2;for(let j=0;j<3;j++){ctx.globalAlpha=sun*(.18+(reduced?0:(1+Math.sin(elapsed*.7+j+t.ty))*.035));rect(x-12+j*12+drift,y+12+j*9,8+j*2,3,'#f5e9a5');}}ctx.globalAlpha=1;}ctx.restore();}
 function drawSunRays(){if(comfort.lightweight)return;const sun=sunlight();if(sun<.1)return;ctx.save();ctx.globalAlpha=sun*(reduced?.035:.03+(1+Math.sin(elapsed*.25))*.012);ctx.fillStyle='#ffedb1';for(let i=0;i<3;i++){const x=viewW*.16+i*viewW*.32+(reduced?0:Math.sin(elapsed*.13+i)*14);ctx.beginPath();ctx.moveTo(x-25,0);ctx.lineTo(x+16,0);ctx.lineTo(x-155,viewH);ctx.lineTo(x-225,viewH);ctx.closePath();ctx.fill();}ctx.restore();}
 function balloons(x,y,seed){const colors=['#ef5968','#6bbbea','#f5d46a'];for(let i=0;i<3;i++){const sway=reduced?0:Math.sin(elapsed*2+seed+i)*2,bx=x+(i-1)*12+sway,by=y-42-(i%2)*12;ctx.strokeStyle='#f1e4be';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(bx,by+13);ctx.stroke();rect(bx-7,by-7,14,18,colors[(i+seed)%3]);rect(bx-4,by-10,8,24,colors[(i+seed)%3]);rect(bx-4,by-5,3,6,'#ffffff88');}rect(x-3,y,6,4,'#6d563e');}
 function drawRaceArch(x,y,label,checkered){rect(x-56,y-62,8,67,'#e6ece2');rect(x+48,y-62,8,67,'#e6ece2');rect(x-57,y-64,114,24,checkered?'#244d67':'#df5260');text(label,x,y-47,14,'#fff5d5','center');if(checkered){for(let row=0;row<2;row++)for(let col=0;col<12;col++)rect(x-48+col*8,y-4+row*8,8,8,(row+col)%2?'#34483e':'#fcf1d6');}else rect(x-48,y,96,4,'#fff2ce');balloons(x-70,y+3,0);balloons(x+70,y+3,1);}
 function drawRoute(){for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],len=Math.hypot(b.x-a.x,b.y-a.y),dx=(b.x-a.x)/len,dy=(b.y-a.y)/len;for(let d=38;d<len;d+=56){const x=a.x+dx*d,y=a.y+dy*d;ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(dy,dx));ctx.fillStyle='#e8f9ee';ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-4,-5);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();rect(-12,-2,11,4,'#3782ab');ctx.restore();}for(let d=0;d<len;d+=96){const x=a.x+dx*d-dy*25,y=a.y+dy*d+dx*25;rect(x-4,y-5,8,10,'#eb8455');rect(x-3,y-2,6,2,'#fff1c6');}}}
 function drawUpCore(){const x=23*T,y=45*T;rect(x-81,y-43,162,92,'#496d4e');rect(x-76,y-48,152,87,'#e8e7ca');rect(x-70,y-42,140,73,'#fff4d8');rect(x-66,y+35,8,21,'#746348');rect(x+58,y+35,8,21,'#746348');text('DEX · 20 ЛЕТ',x,y-23,12,'#3d6850','center');ctx.save();ctx.fillStyle='#275ba0';ctx.font='bold 25px Arial';ctx.textAlign='center';ctx.fillText('UpCore',x-14,y+5);const beat=reduced?1:1+Math.sin(elapsed*3)*.06;ctx.translate(x+49,y-6);ctx.scale(beat,beat);const heart=['01100110','11111111','11111111','01111110','00111100','00011000'];heart.forEach((row,j)=>[...row].forEach((v,i)=>{if(v==='1')rect((i-4)*3,(j-3)*3,3,3,'#ec5260');}));ctx.restore();text('ИТ продукт № 1',x,y+23,9,'#4a6656','center');}
 function drawSecret(c,i){const x=c.x,y=c.y-25,done=c.type==='badge'?collected.has(i):solved.has(i),found=c.type==='badge'?false:discovered.has(i);
  if(c.kind==='rock'){rect(x-19,y-12,38,22,'#687978');rect(x-12,y-19,25,24,'#99a7a0');rect(x-7,y-16,12,4,'#c1c7af');}
  if(c.kind==='stump'){rect(x-13,y-12,26,26,'#815733');rect(x-17,y+6,34,7,'#64462e');rect(x-13,y-17,26,9,'#cdab71');rect(x-6,y-15,12,5,'#775533');}
  if(c.kind==='poster'){rect(x-3,y-15,6,34,'#725335');rect(x-17,y-30,34,33,'#8e6445');rect(x-13,y-26,26,25,'#eee0b6');text('★',x,y-8,19,'#ce6477','center');}
  if(c.kind==='box'){rect(x-3,y,6,20,'#6e503b');rect(x-16,y-21,32,24,'#487a8c');rect(x-11,y-13,22,3,'#1e4c5a');text('✉',x,y-1,15,'#fff0c1','center');}
  if(c.kind==='flowers'){rect(x-22,y-10,44,25,'#7b6547');for(let k=0;k<5;k++){rect(x-17+k*8,y-10,3,18,'#356741');rect(x-20+k*8,y-15-(k%2)*5,8,8,k%2?'#ec7e98':'#f3cf70');}}
  if(done||found)text(done?'✓':'?',x,y-35,15,done?'#dbffbb':'#fff0a1','center');else if(Math.hypot(player.x-c.x,player.y-c.y)<110&&!reduced){text('·',x+22,y-20+Math.sin(elapsed*3)*3,20,'#fff1b0','center');}
 }
 function drawAttractions(){for(const a of attractions){const x=a.x,y=a.y-20;if(a.kind==='swing'){drawSwing(a);continue;}if(a.kind==='karaoke'){rect(x-12,y-28,24,32,'#352947');rect(x+6,y-11,3,3,'#fff1aa');continue;}if(a.kind==='toilet'){rect(x-16,y-48,32,49,'#4f8991');rect(x-19,y-53,38,7,'#d5e9d5');rect(x-11,y-39,22,37,'#326872');text('WC',x,y-25,11,'#fff5d6','center');rect(x+5,y-13,3,3,'#f4dfa6');}else{rect(x-19,y-20,38,21,'#f3d5b5');rect(x-21,y-25,42,7,'#e77f98');rect(x-16,y+1,8,8,'#344b4a');rect(x+8,y+1,8,8,'#344b4a');rect(x-2,y-45,3,20,'#6b6650');rect(x-24,y-47,48,8,'#fff0c8');for(let i=0;i<3;i++)rect(x-24+i*16,y-47,8,8,'#e77f98');text('ICE',x,y-7,11,'#775743','center');}}}
 function drawPet(p){const fetch=p===errands[0].receiver&&(funScene?.kind==='fetch'||fetchReturn)?fetchDogPose():null;const returned=p===errands[0].receiver&&errandStates[0]===3,celebrating=returned&&errandJoy[0]>0;const happy=celebrating||activePet===p&&petTime>0,cat=p.kind==='cat',size=p.size??1,x=fetch?fetch.x:p.x,y=(fetch?fetch.y:p.y)-23*size,fur=cat?'#efa94e':'#c79062',wag=reduced?0:Math.sin(elapsed*(happy?14:3))*(happy?5:2);ctx.save();ctx.translate(x,y-(celebrating&&!reduced?Math.abs(Math.sin((4-errandJoy[0])*7))*11:0));ctx.scale(size,size);rect(-15,19,31,5,'#365c3b55');if(!cat&&photoGreeting(p)){rect(-8,-1,18,21,fur);rect(-12,12,26,9,fur);}else rect(-10,0,22,19,fur);const stride=fetch?.running&&!reduced?Math.sin(elapsed*18)*3:0;rect(-10,16+stride,6,6,fur);rect(6,16-stride,6,6,fur);rect(-7,17,15,3,'#fff1d5');rect(-11,-12,24,19,fur);if(cat){rect(-11,-19,6,10,fur);rect(7,-19,6,10,fur);rect(-9,-16,2,4,'#efabb1');rect(9,-16,2,4,'#efabb1');rect(12,6,8,4,fur);rect(18,1+wag,4,9,fur);rect(17,-2+wag,5,4,fur);rect(-17,0,6,1,'#fff0cc');rect(14,0,6,1,'#fff0cc');}else{rect(-15,-10,7,18,'#6d4d39');rect(11,-10,7,18,'#6d4d39');rect(11,7,9,4,fur);rect(18,3+wag,5,5,fur);rect(-10,7,23,3,'#d74b53');rect(0,9,4,4,'#f6d96e');}rect(-6,-5,3,happy?1:3,'#283b35');rect(6,-5,3,happy?1:3,'#283b35');rect(-1,-1,4,3,cat?'#d47782':'#382f2a');if(happy){rect(0,3,3,4,'#f09fa4');text('♥',0,-27,14,'#ee718b','center');}if(returned&&(!fetch||fetch.carrying))drawQuestBall(1,7,.65);ctx.restore();}
 function line(x1,y1,x2,y2,color,width=3){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
 function drawSwing(a){const x=a.x,y=a.y-10,offset=reduced?0:Math.sin(elapsed*(swingTime>0?4:1.4))*(swingTime>0?27:3);line(x-48,y,x-35,y-92,'#547b79',7);line(x+48,y,x+35,y-92,'#547b79',7);line(x-39,y-92,x+39,y-92,'#f1ca72',8);line(x-14,y-87,x-14+offset,y-20,'#e5dfc9',2);line(x+14,y-87,x+14+offset,y-20,'#e5dfc9',2);rect(x-20+offset,y-20,40,6,'#bd7049');if(swingTime>0){rect(x-9+offset,y-40,18,20,'#ee4848');rect(x-8+offset,y-58,16,18,'#294b93');rect(x-6+offset,y-52,12,8,'#ffc19d');rect(x-7+offset,y-20,5,13,'#2b405b');rect(x+3+offset,y-20,5,13,'#2b405b');}}
 function drawCoin(){if(fountainParty>0){const x=42*T+16,y=28*T;for(let i=0;i<12;i++){const a=i*Math.PI/6+(reduced?0:elapsed),r=30+Math.sin(fountainParty)*8;text('✦',x+Math.cos(a)*r,y-30+Math.sin(a)*20,12,i%2?'#fff0a3':'#b6f3ec','center');}}if(!coin)return;const t=Math.min(1,coin.time/.8),x=coin.x+(42*T+16-coin.x)*t,y=coin.y+(28*T+24-coin.y)*t-(reduced?0:Math.sin(t*Math.PI)*42);rect(x-3,y-4,6,8,'#f6ce55');rect(x-1,y-3,2,5,'#fff3ae');}
 function drawFountain(){const show=fountainShowLevel(),color=fountainShowColor(),pulse=reduced?.6:(1+Math.sin((elapsed-(fountainShow?.start||0))*Math.PI*1.2))*.5;const cx=42*T+16,cy=28*T+16,time=reduced?0:elapsed;rect(40*T,26*T,5*T,5*T,'#b4b6a0');rect(41*T,27*T,3*T,3*T,'#4c94ac');
  for(let i=0;i<4;i++){const radius=8+((time*12+i*10)%38);ctx.strokeStyle=i%2?'#a2dbdf':'#73bccd';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy+10,radius,radius*.45,0,0,Math.PI*2);ctx.stroke();}
  rect(cx-10,cy-18,20,27,'#c5d8ce');rect(cx-15,cy-21,30,6,'#eff3d7');
  for(let side=-1;side<=1;side++){const height=(side===0?38:24)*(1+show*(.5+pulse*.5));ctx.strokeStyle=show>0?mixSeasonColor('#b7edf2',color,show):'#b7edf2';ctx.lineWidth=3;ctx.beginPath();for(let j=0;j<=12;j++){const u=j/12,x=cx+side*u*32,y=cy-23-4*u*(1-u)*height+u*29;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();const t=(time*1.2+side*.24+1)%1,dx=cx+side*t*32,dy=cy-23-4*t*(1-t)*height+t*29;rect(dx-2,dy-2,4,5,'#f1ffff');}
  if(show>0){ctx.save();ctx.globalAlpha=show*.85;for(const side of [-1,1])for(let jet=0;jet<2;jet++){const source=cx+side*(18+jet*18),span=side*(24-jet*10),height=27+show*(15+jet*7+pulse*12);ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();for(let j=0;j<=12;j++){const u=j/12,x=source+u*span,y=cy+5-4*u*(1-u)*height;if(!j)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();const u=(time*.8+jet*.35)%1;rect(source+u*span-1,cy+3-4*u*(1-u)*height,3,4,'#fff4d8');}ctx.restore();}
  for(let i=0;i<8;i++){const t=(time*1.6+i/8)%1,a=i*Math.PI/4;rect(cx+Math.cos(a)*(17+t*19),cy+10+Math.sin(a)*10-Math.sin(t*Math.PI)*9,2,3,'#d5f8f2');}
 }
 function drawWheel(){const x=wheel.x,y=wheel.y,cx=x,cy=y-116,r=86;line(x-52,y-4,cx,cy,'#e5dcbd',10);line(x+52,y-4,cx,cy,'#e5dcbd',10);ctx.strokeStyle='#c9e5dc';ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4+(reduced?Math.PI/2:wheelAngle),px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;line(cx,cy,px,py,'#ecdeb0',3);line(px,py,px,py+10,'#49605b',2);rect(px-12,py+9,24,19,['#e87386','#6aadde','#efcc68'][i%3]);rect(px-8,py+11,16,7,'#ddf4ec');rect(px-14,py+7,28,3,'#fff1ca');if(i===0&&wheelTime>0){rect(px-6,py-7,12,15,'#ee4848');rect(px-6,py-19,12,12,'#294b93');rect(px-4,py-14,8,5,'#ffc19d');rect(px-8,py+8,16,3,'#f6d96e');}}rect(cx-9,cy-9,18,18,'#e7b955');rect(x-62,y-6,124,10,'#538674');}
 function drawLamps(){for(const p of lamps){rect(p.x-3,p.y-49,6,51,'#405d53');rect(p.x-9,p.y-61,18,15,'#ffdfa0');rect(p.x-12,p.y-65,24,5,'#405d53');rect(p.x-6,p.y-57,5,7,'#fff6d6');rect(p.x-7,p.y,14,4,'#405d53');}}
 function useRemainingJoke(a){clearInput();player.vx=player.vy=0;dashTime=0;speechTime=4;
  if(a.kind==='feature'){const offsets=[[0,0],[1.7,0],[1,1.5],[-1,1]];for(let i=1;i<=offsets.length;i++){const next=((a.move||0)+i)%offsets.length,p=point([a.tx+offsets[next][0],a.ty+offsets[next][1]]);if(canStand(p.x,p.y)&&Math.hypot(player.x-p.x,player.y-p.y)>25){a.move=next;a.x=p.x;a.y=p.y;break;}}speech='Это не баг, это фича. Воспроизвести не удалось.';return;}
  if(a.kind==='support'){speech='Пробовали выйти из парка и зайти снова? Роутер справа.';return;}
  if(a.kind==='release'){const count=finishVisit('release');speech=count===3?'Релиз состоялся! Просто никто не верил, что дождёмся.':count===2?'Ещё 5 минут. Даже таймер взял перерыв.':'Ещё 5 минут. Теперь точно!';return;}
  if(a.kind==='vacation'){extras.cups=Math.min(8,extras.cups+1);speech='Саша: «Нагрузка готова на 90%»';save();return;}
  if(a.kind==='production'){$('activity-title').textContent='Точно в пятницу?';$('activity-copy').textContent='Продакшен ждёт смельчаков. ';for(const [label,enter] of [['Войти',true],['Не сегодня',false]]){const b=document.createElement('button');b.className='answer';b.textContent=label;b.onclick=()=>{closeActivity();if(enter){clearInput();player.vx=player.vy=0;dashTime=0;funScene={kind:'production',time:0};speechTime=0;}};$('activity-copy').append(b);}activity.showModal();return;}
  funScene={kind:a.kind,time:0,x:player.x,y:player.y};speechTime=0;
 }
 function finishRemainingJoke(){const kind=funScene.kind;if(kind==='router'){networkTime=5;speech='Связь восстановлена. Вы великолепны!';}if(kind==='door409')speech='409: Конфликт. Кажется, мнения разошлись.';if(kind==='production')speech='Откатили. Никто не заметил.';if(kind==='door404'){const p=extraSpots.find(a=>a.kind==='door404'),side=player.y>=p.y-24?-1:1,choices=[{x:p.x,y:p.y+side*64},{x:p.x+48,y:p.y},{x:p.x-48,y:p.y}];const target=choices.find(q=>canStand(q.x,q.y));if(target){player.x=target.x;player.y=target.y;}speech='Комната не найдена. Зато вы нашлись.';}funScene=null;speechTime=5;save();}
 function drawPicnicColleague(x,y){rect(x-13,y+1,27,4,'#365c3b55');rect(x-8,y-12,6,14,'#2c3c4b');rect(x+3,y-12,6,14,'#2c3c4b');rect(x-10,y+1,9,3,'#e8e7d4');rect(x+2,y+1,9,3,'#e8e7d4');rect(x-13,y-39,26,27,'#202e40');rect(x-18,y-35,6,22,'#28394b');rect(x+12,y-35,6,22,'#28394b');rect(x-18,y-16,6,6,'#e8b896');rect(x+12,y-16,6,6,'#e8b896');rect(x-10,y-62,20,24,'#ecc2a2');rect(x-13,y-53,4,10,'#deb091');rect(x+9,y-53,4,10,'#deb091');rect(x-9,y-65,16,6,'#776043');rect(x-5,y-68,9,4,'#806747');rect(x-11,y-59,4,14,'#6a543e');rect(x+7,y-59,4,14,'#6a543e');rect(x-6,y-54,5,2,'#72533c');rect(x+3,y-54,5,2,'#72533c');rect(x-4,y-51,2,2,'#566b63');rect(x+4,y-51,2,2,'#566b63');rect(x,y-49,3,6,'#dba589');rect(x-10,y-46,4,7,'#654d38');rect(x+6,y-46,4,7,'#654d38');rect(x-7,y-42,14,6,'#5c4635');rect(x-5,y-45,10,3,'#6b503b');rect(x-3,y-42,6,2,'#e6b496');rect(x-7,y-38,5,5,'#35465a');rect(x+2,y-38,5,5,'#35465a');rect(x,y-32,2,19,'#46576a');rect(x+1,y-30,2,2,'#b5b9ac');}
 function drawRemainingProp(p){const {x,y}=p;
  if(p.kind==='door409'){const active=funScene?.kind==='door409',shake=active&&!reduced?Math.sin(funScene.time*20)*2:0;ctx.save();ctx.translate(shake,0);rect(x-25,y-83,50,85,'#b9806d');rect(x-19,y-77,38,77,active?'#513b43':'#a34b4f');rect(x+9,y-32,4,4,'#efd482');rect(x-29,y+1,58,6,'#b8c1a2');if(active){rect(x-7,y-33,14,13,'#294b93');rect(x-5,y-28,10,6,'#f6b683');rect(x-8,y-19,16,15,'#f04b4b');}else text('409',x,y-52,16,'#fff2cf','center');ctx.restore();}

  if(p.kind==='feature'){rect(x-22,y-19,44,18,'#829185');rect(x-15,y-29,31,14,'#acb6a0');rect(x-16,y-23,9,4,'#d1d8bf');text('FEATURE',x,y-7,8,'#243f37','center');}
  if(p.kind==='support'){rect(x-38,y-65,76,60,'#e6d2a4');rect(x-12,y-43,24,38,'#34594b');ctx.fillStyle='#659b8c';ctx.beginPath();ctx.moveTo(x-47,y-65);ctx.lineTo(x,y-102);ctx.lineTo(x+47,y-65);ctx.fill();text('IT HELP',x,y-75,11,'#fff2d0','center');drawSupporter({x:x+24,y:y+9,hair:'#513b2c',shirt:'#75a9b8',style:'glasses'});}
  if(p.kind==='router'){rect(x-18,y-21,36,17,'#edf0d7');rect(x-17,y-46,3,25,'#3b514b');rect(x+14,y-46,3,25,'#3b514b');rect(x-10,y-14,4,4,funScene?.kind==='router'?'#df865f':'#70b880');rect(x+1,y-14,4,4,'#70b880');rect(x-21,y-3,42,6,'#93683f');}
  if(p.kind==='release')drawAddressSign({x,y:y+3,lines:['ДО РЕЛИЗА',visitCount('release')>=3?'ГОТОВО!':'5 МИНУТ']});
  if(p.kind==='production'){rect(x-27,y-78,54,80,'#775586');rect(x-20,y-71,40,73,'#342d53');rect(x-16,y-65,32,62,'#734868');text('PROD',x,y-44,11,'#ffdaa5','center');rect(x-33,y+1,66,7,'#b2938f');}
  if(p.kind==='vacation'){drawPicnicColleague(x,y);rect(x-25,y-9,48,5,'#af814f');rect(x-15,y-29,28,19,'#536e80');rect(x-12,y-26,22,13,'#355361');text('</>',x-1,y-16,9,'#d8ecdb','center');rect(x-18,y-10,34,3,'#91a6ad');for(let i=0;i<extras.cups;i++){const cx=x+28+(i%4)*12,cy=y-21+Math.floor(i/4)*14;rect(cx,cy-10,8,10,'#fff2d1');rect(cx+8,cy-8,3,5,'#ead8ad');}}
  if(p.kind==='door404'){rect(x-25,y-83,50,85,'#e0c99e');rect(x-19,y-77,38,77,'#456d76');text('404',x,y-52,16,'#fff2cf','center');rect(x+9,y-32,4,4,'#efd482');rect(x-29,y+1,58,6,'#b8c1a2');}
 }
 function drawNetworkHearts(){if(funScene?.kind==='door409'){const p=extraSpots.find(a=>a.kind==='door409'),phrases=['##^%#@#!','@#%!! ^&*?!','##@! %^#!!!'],i=reduced?0:Math.floor(funScene.time/.6)%phrases.length;mapLabel(phrases[i],p.x,p.y-125,15,5);}if(networkTime>0){const booth=extraSpots.find(p=>p.kind==='support'),router=extraSpots.find(p=>p.kind==='router');for(const p of [player,{x:booth.x+24,y:booth.y+9},...supporters.filter(n=>Math.hypot(n.x-router.x,n.y-router.y)<350)])text('♥',p.x,p.y-67-(reduced?0:Math.sin(elapsed*3)*3),18,'#f69dab','center');}if(funScene&&['router','production','door404'].includes(funScene.kind))mapLabel(funScene.kind==='router'?'Выключаем… Включаем…':funScene.kind==='production'?'Кажется, всё красное…':'Ищем комнату…',player.x,player.y-105,13,2);}
 function useNewScene(a){if(['carousel','trampoline'].includes(a.kind)&&weatherStopsRide())return;if(repeatBlocked(a.kind))return;if(['carousel','trampoline','gazebo','telescope'].includes(a.kind)){clearInput();player.vx=player.vy=0;dashTime=0;speechTime=0;funScene={kind:a.kind,time:0};return;}if(['feature','support','router','release','production','vacation','door404','door409'].includes(a.kind)){useRemainingJoke(a);return;}if((a.kind==='debt'&&extras.debt)||(a.kind==='beauty'&&extras.beauty)){speech=a.kind==='debt'?'Пять задач уже в бэклоге. Новые пока не заводим.':'Цветочек уже есть. Остальное — отдельная задача.';speechTime=4;return;}clearInput();player.vx=player.vy=0;dashTime=0;speechTime=0;if(a.kind==='detector'){detectorActive=!detectorActive;detectorBeep=0;speech=detectorActive?'Чем чаще писк, тем ближе находка. Ищу северо-западнее!':'Металлоискатель возвращён.';speechTime=4;return;}if(a.kind==='sprinkler'){if(sprinkleTime<=0){sprinkleTime=8;sprinkleCooldown=18;}return;}funScene={kind:a.kind,time:0,note:0};player.face=a.kind==='echo'?'up':'down';}
 function updateNewScenes(dt){wetTime=Math.max(0,wetTime-dt);sprinkleCooldown=Math.max(0,sprinkleCooldown-dt);const sprinkler=extraSpots.find(p=>p.kind==='sprinkler');if(sprinkleTime>0){sprinkleTime=Math.max(0,sprinkleTime-dt);if(Math.hypot(player.x-sprinkler.x,player.y-sprinkler.y)<76){wetTime=10;unlockAchievement('water');}}else if(sprinkleCooldown===0&&Math.hypot(player.x-sprinkler.x,player.y-sprinkler.y)<85){sprinkleTime=8;sprinkleCooldown=18;}if(detectorActive){detectorBeep-=dt;if(detectorBeep<=0){const target=extraSpots.find(p=>p.kind==='dig'),d=Math.hypot(player.x-target.x,player.y-target.y);detectorBeep=.12+Math.min(1.4,d/260);window.ParkAudio?.detector?.(d);}}}
 function finishNewScene(dt){const kind=funScene.kind,t=funScene.time;if(kind==='music'){funScene.note-=dt;if(funScene.note<=0){funScene.note=.3;window.ParkAudio?.music?.(Math.floor(t/.3));}}if(['carousel','trampoline','gazebo','telescope'].includes(kind)){if(t<4)return;const count=finishVisit(kind);funScene=null;speech={carousel:'Голова кругом — идеи тоже!',trampoline:'Прыгнул выше своих KPI!',gazebo:'Пять минут без созвонов. Красота.',telescope:'Вижу светлое будущее DEX!'}[kind];if(kind==='carousel'&&count===2)speech='Два круга! Земля пока ещё вращается…';if(kind==='telescope'){completePinned('stars');unlockAchievement('dexStars');}if(kind==='telescope'&&count===2)speech='НЛО! Кажется, инопланетяне тоже на удалёнке.';if(kind==='trampoline'&&count===3)speech='Три прыжковых сессии. KPI выполнен!';if(kind==='gazebo'&&count===2)speech='Вторая пауза. Уведомления подождут.';speechTime=5;return;}const duration=(kind==='production'||kind==='door409')?3:kind==='music'?5:kind==='duck'?3.5:kind==='echo'?2.5:2;if(t<duration)return;if(['router','production','door404','door409'].includes(kind)){finishRemainingJoke();return;}funScene=null;if(['duck','debt','beauty'].includes(kind)){if(kind==='debt')extras.debt=true;if(kind==='beauty')extras.beauty=true;speech=kind==='duck'?'Пока объяснял — сам понял. Консультация проведена!':kind==='debt'?'Починили одно — появилось пять задач.':'Один цветочек готов. Остальное — отдельная задача.';speechTime=5;burst(player.x,player.y-22,'#ffdfa0');save();return;}const id={dig:'metal',music:'music',echo:'echo'}[kind];if(kind==='dig')detectorActive=false;unlockAchievement(id);speech=kind==='dig'?'Ложка! Артефакт корпоративной кухни.':kind==='music'?'Вот это командная синхронизация!':'Эхо: «Задачу в трекере создал?»';speechTime=5;burst(player.x,player.y-25,'#ffdf8b');}
 function drawTinyChest(x,y,size=1,opened=false){ctx.save();ctx.translate(x,y);ctx.scale(size,size);rect(-22,-22,44,25,'#94603b');rect(-24,opened?-40:-31,48,opened?10:12,'#c78d4f');rect(-18,-22,4,25,'#e1bb65');rect(14,-22,4,25,'#e1bb65');rect(-4,-18,8,9,'#edce75');if(opened)rect(-18,-28,36,6,'#352e2a');ctx.restore();}
 function drawITProp(p){drawRemainingProp(p);const {x,y}=p,t=funScene?.kind===p.kind?funScene.time:0;if(p.kind==='duck'){const bob=reduced?0:Math.sin(elapsed*2)*1.5;rect(x-15,y-5,30,5,'#426b4255');rect(x-13,y-23+bob,25,17,'#f0d657');rect(x+5,y-34+bob,15,16,'#ffe986');rect(x+17,y-26+bob,12,5,'#df8b3d');rect(x+14,y-30+bob,2,2,'#273c39');rect(x-17,y-23+bob,7,7,'#f0d657');rect(x-6,y-19+bob,12,6,'#d9ba43');}if(p.kind==='debt'){const opened=extras.debt||t>.55;drawTinyChest(x,y,1,opened);if(opened)for(let i=0;i<5;i++){const u=extras.debt||reduced?1:Math.max(0,Math.min(1,(t-.55-i*.13)*2)),tx=x+(i-2)*26*u,ty=y+39*u-(reduced?0:Math.sin(u*Math.PI)*24);if(u>0){drawTinyChest(tx,ty,.35,false);text(String(i+1),tx,ty+14,9,'#fff0c8','center');}}}if(p.kind==='beauty'){rect(x-16,y-23,32,23,'#9aa89c');rect(x-20,y-27,40,7,'#d3d7bd');rect(x-10,y-32,20,7,'#e66868');if(extras.beauty||t>.3){const u=extras.beauty||reduced?1:Math.min(1,(t-.3)/1.3),fx=x+38,fy=y;rect(fx,fy-25*u,3,25*u,'#438655');if(u>.5){rect(fx-7,fy-13,8,3,'#69a264');rect(fx-7,fy-31*u,18,7,'#f79db6');rect(fx-2,fy-36*u,7,17,'#f79db6');rect(fx,fy-29*u,4,4,'#ffe28a');}}}}
 function drawITScene(){drawNetworkHearts();if(!funScene)return;const {kind,time}=funScene;if(kind==='duck'){const p=extraSpots.find(p=>p.kind==='duck');mapLabel(time<1.7?'В общем, у меня тут всё падает…':'…',time<1.7?player.x:p.x,time<1.7?player.y-85:p.y-65,13,2);}if(kind==='debt')mapLabel('Сейчас быстренько починим…',player.x,player.y-85,12,2);if(kind==='beauty')mapLabel('Наводим красоту…',player.x,player.y-85,12,2);}
 function drawNewProp(p){drawITProp(p);const {x,y}=p;if(p.kind==='detector'){rect(x-18,y-15,36,14,'#ab8250');rect(x-8,y-45,5,34,'#354d57');rect(x-15,y-47,18,8,'#89b9b3');ctx.strokeStyle='#354d57';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x+4,y-11,12,5,0,0,Math.PI*2);ctx.stroke();}if(p.kind==='dig'&&detectorActive&&Math.hypot(player.x-x,player.y-y)<110){rect(x-6,y-2,12,3,'#d7be7c');text('✦',x,y-10,14,'#ffec9e','center');}if(p.kind==='music'){drawSupporter({x,y:y-14,hair:'#503e32',shirt:'#945987',style:'plaid'});rect(x-2,y-41,17,17,'#d6a05c');rect(x+3,y-45,9,8,'#d6a05c');rect(x+10,y-50,17,4,'#815333');rect(x+5,y-35,4,5,'#544431');rect(x-30,y+7,55,8,'#77563c');text('♪',x+26,y-60,20,'#fff0b1','center');}if(p.kind==='sprinkler'){rect(x-7,y-5,14,7,'#728681');rect(x-2,y-17,4,15,'#c1d0b7');rect(x-10,y-19,20,4,'#506d71');}}
 function drawNewScenes(){drawITScene();const sprinkler=extraSpots.find(p=>p.kind==='sprinkler');if(sprinkleTime>0){ctx.strokeStyle='#b0e5edaa';ctx.lineWidth=2;for(let i=0;i<9;i++){const a=i/9*Math.PI*2+(reduced?0:elapsed*1.2),x=sprinkler.x+Math.cos(a)*65,y=sprinkler.y+Math.sin(a)*35;ctx.beginPath();ctx.moveTo(sprinkler.x,sprinkler.y-17);ctx.quadraticCurveTo((x+sprinkler.x)/2,(y+sprinkler.y)/2-62,x,y);ctx.stroke();rect(x,y,3,4,'#c3f1ef');}}if(wetTime>0){for(let i=0;i<4;i++){const offset=reduced?i*7:(elapsed*28+i*13)%45;rect(player.x-15+i*9,player.y-42+offset,2,4,'#95ddec');}}if(detectorActive&&!funScene){const target=extraSpots.find(p=>p.kind==='dig'),d=Math.hypot(player.x-target.x,player.y-target.y);mapLabel(d<58?'Сигнал здесь! E · Копать':d<150?'Пип-пип-пип! Горячо!':d<300?'Пип… Уже ближе':'Пип… Ищу сигнал',player.x,player.y-125,12,1);ctx.strokeStyle='#304a50';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(player.x+10,player.y-21);ctx.lineTo(player.x+29,player.y+6);ctx.ellipse(player.x+29,player.y+8,10,4,0,0,Math.PI*2);ctx.stroke();}if(!funScene)return;const t=funScene.time;if(funScene.kind==='echo')mapLabel(t<1?'DEX!':'DEX… DEX…',player.x,player.y-80,18,2);if(funScene.kind==='dig'){mapLabel('Что там звенит?..',player.x,player.y-80,13,2);const offset=reduced?0:Math.sin(t*9)*5;rect(player.x+16,player.y-29+offset,4,27,'#936337');rect(player.x+12,player.y-5+offset,12,10,'#9faeb0');}if(funScene.kind==='music'){const p=extraSpots.find(p=>p.kind==='music');for(let i=0;i<2;i++){const approach=Math.min(1,t),x=p.x+(i?1:-1)*(94-approach*48),bob=reduced?0:Math.sin(t*9+i)*5;drawSupporter({x,y:p.y+25-bob,hair:i?'#deab56':'#70412d',shirt:i?'#5397b9':'#d88768',style:i?'glasses':'brown'});text('♪',x,p.y-45-bob,18,'#ffe394','center');}mapLabel('♪ Танцуют все! ♪',p.x,p.y-100,14,2);}}
 function useExtra(a){meetNeighbourForNpc(a);if(a.kind==='bear'){if(bearNut.phase==='carry')useBearNut();else startBear();return;}if(a.kind==='planeHost'){launchLetter();return;}if(a.kind==='bubbles'){useBubbles();return;}if(a.kind==='squirrel'&&extras.nut!==1&&(snowCover()>.15||squirrelStory.stage>0)){useWinterSquirrel(a);return;}if(['carousel','trampoline','gazebo','telescope','feature','support','router','release','production','vacation','door404','door409','duck','debt','beauty','detector','dig','music','sprinkler','echo'].includes(a.kind)){useNewScene(a);return;}clearInput();player.vx=player.vy=0;dashTime=0;speechTime=4;
  if(a.kind==='nut'){extras.nut=1;speech='Орех найден! Отнесу белке у восточной аллеи.';}
  if(a.kind==='squirrel'){if(extras.nut===1){extras.nut=2;unlockAchievement('squirrel');speech='Звание: «Надёжный поставщик»! Проходи!';burst(a.x,a.y-30,'#ffd27d');}else speech=extras.nut===2?'Своим — зелёный свет!':'Орех есть? Поищи севернее, у цветочного сада!';}
  if(a.kind==='paper'){extras.litter=1;speech='Бумажка в кармане. Урна чуть юго-западнее.';}
  if(a.kind==='bin'){if(extras.litter===1){extras.litter=2;unlockAchievement('litter');speech='Спасибо! Хоть кто-то попал. Карма +1';burst(a.x,a.y-30,'#bde9a4');}else speech=extras.litter===2?'Чистота! Карма уже начислена.':'Есть бумажка? Принимаю без очереди!';}
  if(a.kind==='bush'){bushTime=6;unlockAchievement('bush');speech='Я не прячусь. У меня фокус-время.';}
  if(a.kind==='fish'){if(extras.boots>=2)return;bootTime=0;funScene={kind:'fish',time:0};speechTime=0;player.face='right';}
  if(a.kind==='coffee'){speechTime=0;$('activity-title').textContent=coldCafe()?'Согреемся у кафе?':'Эспрессо или дедлайн?';$('activity-copy').textContent='Выберите топливо для прогулки. ';for(const [label,seconds] of [['Эспрессо',10],['Дедлайн',16]]){const b=document.createElement('button');b.className='answer';b.textContent=label;b.onclick=()=>{coffeeTime=seconds;unlockAchievement(label==='Эспрессо'?'espresso':'deadline');closeActivity();speech=label==='Эспрессо'?'Бодрость +100!':'Сдать ещё вчера!';speechTime=3;};$('activity-copy').append(b);}if(coldCafe()){const b=document.createElement('button');b.className='answer';b.textContent='Горячий чай';b.onclick=drinkTea;$('activity-copy').append(b);}activity.showModal();}save();
 }
 function drawSquirrelTree(){const {x,y}=squirrelTree,c=seasonPalette().trees[0];rect(x-27,y,54,8,'#365c3b66');rect(x-17,y-77,34,80,'#93623b');rect(x-12,y-73,8,76,'#b2804c');rect(x+9,y-65,5,62,'#69482f');rect(x-25,y-3,18,8,'#93623b');rect(x+9,y-3,18,8,'#93623b');rect(x-11,y-46,23,31,'#c48f54');rect(x-8,y-44,17,26,'#3d3029');rect(x-4,y-40,9,18,'#231f20');rect(x-12,y-18,24,5,'#ba844e');ctx.save();ctx.globalAlpha=foliageOpacity({x:x-69,y:y-157,w:138,h:96},y);const sway=reduced?0:Math.sin(elapsed*.9)*(1+windGust());ctx.translate(x+sway,y);rect(-28,-157,56,42,c[1]);rect(-46,-140,92,55,c[1]);rect(-63,-116,126,43,c[0]);rect(-48,-91,96,30,c[0]);rect(-35,-146,55,27,c[3]);rect(-52,-119,43,24,c[2]);rect(9,-128,31,29,c[2]);rect(25,-101,27,21,c[1]);rect(-28,-84,37,13,c[1]);for(let i=0;i<28;i++){const px=-40+(i*31)%80,py=-130+(i*17)%51;rect(px,py,5+i%4,3,i%3?c[2]:c[3]);if(i%4===0)rect(px,py,3,1,c[3]);}snowCap(-27,-157,54,6);snowCap(-53,-118,38,5);snowCap(17,-103,32,4);ctx.restore();}
 function drawQuestAuthor(px,py){ctx.save();ctx.translate(px,py);ctx.scale(.72,.78);const x=0,y=0;rect(x-12,y+2,25,4,'#365c3b55');rect(x-8,y-9,6,12,'#384858');rect(x+3,y-9,6,12,'#384858');rect(x-10,y+2,9,3,'#252f38');rect(x+2,y+2,9,3,'#252f38');rect(x-12,y-31,24,24,'#f4f2e9');rect(x-17,y-29,6,19,'#dfE5df');rect(x+11,y-29,6,19,'#e9ece4');rect(x-17,y-11,5,6,'#edbe9e');rect(x+12,y-11,5,6,'#edbe9e');rect(x-10,y-49,20,20,'#edc3a7');rect(x-13,y-45,4,11,'#dfb394');rect(x+9,y-45,4,11,'#dfb394');rect(x-11,y-54,22,10,'#292a2d');rect(x-7,y-57,15,6,'#353239');rect(x-10,y-47,4,7,'#333035');rect(x+7,y-48,4,7,'#333035');rect(x+1,y-50,5,6,'#292a2d');rect(x-7,y-43,6,2,'#4b3a33');rect(x+2,y-43,6,2,'#4b3a33');rect(x-5,y-40,3,2,'#6d7d65');rect(x+4,y-40,3,2,'#6d7d65');rect(x,y-38,2,4,'#d9a78d');rect(x-4,y-32,9,2,'#c7847e');rect(x-7,y-30,5,7,'#d4dcd7');rect(x+2,y-30,5,7,'#d4dcd7');rect(x,y-24,1,15,'#c5cfc9');for(let i=0;i<3;i++)rect(x+1,y-21+i*5,2,2,'#9caaa5');ctx.restore();}
 function drawExtra(p){if(p.kind==='bear'){drawBearStage(p);return;}if(p.kind==='photographer'){drawPhotographer();return;}if(p.kind==='magician'){drawMagician();return;}if(p.kind==='artist'){drawArtist();return;}if(p.kind==='planeHost'){drawPlaneHost();return;}if(p.kind==='bubbles'){drawBubbleHost();return;}if(p.kind==='gardener'){drawGardener();return;}drawExpansionProp(p);drawNewProp(p);const x=p.x,y=p.y-22;if(p.kind==='questAuthor')drawQuestAuthor(x,p.y);
  if(p.kind==='nut'&&extras.nut===0){rect(x-6,y+12,12,10,'#ac713d');rect(x-5,y+8,10,5,'#705037');rect(x-1,y+6,3,4,'#705037');}
  if(p.kind==='paper'&&extras.litter===0){rect(x-7,y+12,14,10,'#fff5d6');rect(x-3,y+14,8,2,'#99aaa1');}
  if(p.kind==='squirrel'&&(squirrelScene||squirrelStory.stage>0)){drawStorySquirrel();return;}if(p.kind==='squirrel'){const sx=x+(extras.nut===2?44:0);rect(sx-18,y-24,12,27,'#c37536');rect(sx-22,y-27,13,14,'#df9551');rect(sx-8,y-13,17,20,'#d88842');rect(sx-3,y-24,15,13,'#e69c53');rect(sx-3,y-29,4,7,'#c37536');rect(sx+6,y-29,4,7,'#c37536');rect(sx+7,y-20,2,3,'#263c35');rect(sx+8,y-9,7,5,'#f1c188');}
  if(p.kind==='bin'){rect(x-12,y-19,24,34,'#37675e');rect(x-15,y-23,30,7,'#648d76');rect(x-8,y-14,16,6,'#1e3b36');text('♥',x,y+6,12,'#c9dd9b','center');}
  if(p.kind==='coffee'){rect(x-19,y-47,38,64,'#3b5964');rect(x-15,y-43,30,18,'#efdb9f');text('КОФЕ',x,y-31,10,'#254f42','center');rect(x-11,y-19,18,19,'#203e46');rect(x-6,y-12,10,10,'#fff2d9');rect(x+10,y-19,4,4,'#eaa36b');if(coldCafe())drawSteam(x,y-12,.7);}
  if(p.kind==='bush'){const shake=reduced?0:Math.sin(elapsed*5)*2;rect(x-22+shake,y-13,44,28,'#3d774f');rect(x-15+shake,y-23,31,33,'#5a9459');if(bushTime>0){const emerge=reduced?1:Math.min(1,(6-bushTime)*2);drawSupporter({x:x+emerge*35,y:p.y,hair:'#6b4534',shirt:'#deb768',style:'plaid'});}}
  if(p.kind==='fish'){rect(x-9,y+16,16,8,'#947354');rect(x-7,y+12,12,4,'#c2a071');}
 }
 function drawFishing(){if(funScene?.kind!=='fish'&&bootTime<=0)return;const x=player.x,y=player.y;ctx.strokeStyle='#947354';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+8,y-22);ctx.lineTo(x+34,y-60);ctx.stroke();ctx.strokeStyle='#f2e3b8';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+34,y-60);ctx.lineTo(x+64,y-5);ctx.stroke();if(funScene?.kind==='fish'){rect(x+62,y-8+(reduced?0:Math.sin(elapsed*5)*2),4,5,'#ef7761');mapLabel('Ну же, большая и маленькая…',x,y-85,12,2);}else{rect(x+55,y-24,10,15,'#72533a');rect(x+55,y-12,19,7,'#72533a');rect(x+54,y-6,21,3,'#3c4034');}}
 function updateFunScene(dt){clearInput();player.vx=player.vy=0;funScene.time+=dt;if(funScene.kind==='bear'){updateBearConcert();return;}if(funScene.kind==='fairAward'){updateFairAward();return;}if(funScene.kind==='fair'){updateFair(dt);return;}if(funScene.kind==='stoneSkip'){updateStoneSkip();return;}if(funScene.kind==='groupPhoto'){updateGroupPhoto(dt);return;}if(funScene.kind==='magic'){updateMagic();return;}if(funScene.kind==='portrait'){updatePortrait();return;}if(funScene.kind==='fetch'){updateFetch();return;}if(funScene.kind==='cinema'){if(ridesWet()){finishCinema(false);speech='Дождь прервал сеанс. Посмотрим, когда прояснится.';speechTime=4;}else if(funScene.time>=12)finishCinema(true);return;}if(funScene.kind==='kite'){if(ridesWet()||snowCover()>.15)finishKite(true);else if(funScene.time>=8)finishKite();return;}if(funScene.kind==='watering'){if(funScene.time>=2){waterGardenBed(funScene.bedId);funScene=null;speech=garden.watered.length===3?'Все три клумбы довольны. Верну лейку!':'Готово! Ещё немного — и целый букет.';speechTime=4;save();}return;}if(funScene.kind==='parkRide'){if(funScene.time>=(funScene.rideId==='chess'?5:6)){const p=parkRides.find(p=>p.id===funScene.rideId);rideVisits[p.id]=Math.min(99,(rideVisits[p.id]||0)+1);funScene=null;if(p.id==='chess'){speechTime=0;noticeTime=0;$('activity-title').textContent='Победа! Шах и мат · '+rideVisits.chess+' : 0';$('activity-copy').textContent='Леша: «'+chessReplies[rideVisits.chess-1]+'»';activity.showModal();}else{speech=p.reply;speechTime=4;}window.ParkAudio?.reward();save();}return;}if(['carousel','trampoline','gazebo','telescope','router','production','door404','door409','duck','debt','beauty','dig','music','echo'].includes(funScene.kind)){finishNewScene(dt);return;}if(funScene.kind==='fish'&&funScene.time>=3){funScene=null;extras.boots=Math.min(2,extras.boots+1);bootTime=extras.boots===1?5:0;unlockAchievement('fish');speech=extras.boots===1?'Старый ботинок… Зато своего размера!':'Второй ботинок! Теперь полный комплект — надеваю!';speechTime=5;save();return;}if(funScene.kind==='paint'&&funScene.time>=1.5){paintTime=40;funScene=null;unlockAchievement('paint');speech='Зато теперь я в цвет парка!';speechTime=4;}else if(funScene.kind==='photo'&&funScene.time>=4.2){funScene=null;unlockAchievement('photo');speech='Главное, что голубь получился!';speechTime=4;burst(player.x,player.y-28,'#fff1a1');}}
 function updateGoose(dt){if(groupPhotoMember(goose)||goose.state==='photobomb')return;goose.cooldown=Math.max(0,goose.cooldown-dt);if(goose.state==='idle'){const sprinkler=extraSpots.find(p=>p.kind==='sprinkler');if(sprinkleTime>0&&Math.hypot(sprinkler.x-goose.x,sprinkler.y-goose.y)<240){goose.state='shower';goose.time=8;goose.trail=[{x:goose.x,y:goose.y}];goose.chased=false;return;}if(!feedScene&&goose.cooldown===0&&Math.hypot(player.x-goose.x,player.y-goose.y)<100){goose.state='chase';goose.chased=true;goose.time=4;goose.trail=[{x:goose.x,y:goose.y}];}return;}if(goose.state==='return'){let distance=150*dt;while(goose.trail.length&&distance>0){const p=goose.trail[goose.trail.length-1],d=Math.hypot(p.x-goose.x,p.y-goose.y);if(d<=distance){goose.x=p.x;goose.y=p.y;distance-=d;goose.trail.pop();}else{goose.x+=(p.x-goose.x)/d*distance;goose.y+=(p.y-goose.y)/d*distance;distance=0;}}if(!goose.trail.length){goose.state='idle';goose.cooldown=7;if(goose.chased)unlockAchievement('goose');}return;}goose.time-=dt;if(goose.time<=0||feedScene||(goose.state==='shower'&&sprinkleTime<=0)){goose.state='return';return;}const target=goose.state==='shower'?extraSpots.find(p=>p.kind==='sprinkler'):player,dx=target.x-goose.x,dy=target.y-goose.y,d=Math.hypot(dx,dy);if(d<26)return;const speed=130*dt;if(canStand(goose.x+dx/d*speed,goose.y))goose.x+=dx/d*speed;if(canStand(goose.x,goose.y+dy/d*speed))goose.y+=dy/d*speed;goose.trail.push({x:goose.x,y:goose.y});}
 function drawGoose(){const {x,y}=goose,flip=player.x<x?-1:1,bob=reduced||goose.state==='idle'?0:Math.sin(elapsed*17)*2;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(flip,1);rect(-13,1,28,4,'#365c3b55');rect(-9,-3+bob,5,7,'#edaa48');rect(5,-3-bob,5,7,'#edaa48');rect(-14,-20,28,17,'#faf2d5');rect(-9,-17,17,8,'#d6decd');rect(8,-34,8,23,'#faf2d5');rect(7,-38,15,11,'#fff8df');rect(17,-35,2,2,'#233d3d');rect(21,-32,10,5,'#eea440');rect(-19,-20,8,5,'#faf2d5');ctx.restore();if(goose.state==='chase')mapLabel('Га Га Га',x,y-65,12,1);}
 function drawFunDecor(){const x=paintedBench.x+16,y=paintedBench.y;rect(x-30,y-42,58,3,'#67aa70');rect(x+38,y-26,13,15,'#759b86');rect(x+40,y-29,9,5,'#c6d4b4');if(funScene?.kind==='photo'){const t=funScene.time;if(t<3)mapLabel(String(3-Math.floor(t)),photoSpot.x,photoSpot.y-90,25,2);else{const u=Math.min(1,(t-3)/.25);drawPigeon({homeX:photoSpot.x+90*(1-u),homeY:photoSpot.y-24,dx:0,dy:0,phase:0,flight:0});ctx.strokeStyle='#fff6da';ctx.lineWidth=3;ctx.strokeRect(photoSpot.x-58,photoSpot.y-76,116,88);text('ЩЁЛК!',photoSpot.x,photoSpot.y-90,15,'#fff5d6','center');}}}
 function updatePigeons(dt){for(const p of [...pigeons,...tamePigeons]){p.cooldown=Math.max(0,p.cooldown-dt);if(p.flight>0){p.flight=Math.max(0,p.flight-dt);if(p.flight===0){p.homeX+=p.dx;p.homeY+=p.dy;p.cooldown=2+Math.random()*3;}}else if(!tamePigeons.includes(p)&&p.cooldown===0&&Math.hypot(player.x-p.homeX,player.y-p.homeY)<78){for(let attempt=0;attempt<24;attempt++){const angle=Math.atan2(p.homeY-player.y,p.homeX-player.x)+(Math.random()-.5)*2.8,distance=100+Math.random()*150,x=p.homeX+Math.cos(angle)*distance,y=p.homeY+Math.sin(angle)*distance;if(!canStand(x,y)||Math.hypot(x-player.x,y-player.y)<90||[...pigeons,...tamePigeons].some(other=>other!==p&&Math.hypot(x-(other.homeX+(other.flight>0?other.dx:0)),y-(other.homeY+(other.flight>0?other.dy:0)))<24))continue;p.dx=x-p.homeX;p.dy=y-p.homeY;if(reduced){p.homeX=x;p.homeY=y;p.cooldown=3;}else p.flight=2;break;}}}}
 // Build one collision snapshot per escort, never run route searches in the render loop.
 function idleExitRoute(subject=player){
  const cells=new Uint8Array(COLS*ROWS);
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)cells[y*COLS+x]=solidTile(x,y)?1:0;
  const clear=(x,y)=>[[x-9,y-9],[x+9,y-9],[x-9,y+9],[x+9,y+9]].every(([px,py])=>{const tx=Math.floor(px/T),ty=Math.floor(py/T);return tx>=0&&ty>=0&&tx<COLS&&ty<ROWS&&!cells[ty*COLS+tx];});
  const goals=new Set(gates.map(g=>{const [x,y]=g.side==='left'?[5,g.at]:g.side==='right'?[90,g.at]:g.side==='top'?[g.at,5]:[g.at,70];return y*COLS+x;}));
  const start=Math.floor(subject.y/T)*COLS+Math.floor(subject.x/T);
  for(const wide of [true,false]){
   const queue=[start],prev=new Int32Array(COLS*ROWS).fill(-2);prev[start]=-1;let end=-1;
   for(let i=0;i<queue.length;i++){
    const key=queue[i],x=key%COLS,y=Math.floor(key/COLS);if(goals.has(key)){end=key;break;}
    for(const [dx,dy]of [[0,1],[1,0],[-1,0],[0,-1]]){
     const nx=x+dx,ny=y+dy,k=ny*COLS+nx;if(nx<0||ny<0||nx>=COLS||ny>=ROWS||prev[k]!==-2||cells[k])continue;
     if(wide&&(!clear(nx*T+16-25,ny*T+24)||!clear(nx*T+16+25,ny*T+24)))continue;
     prev[k]=key;queue.push(k);
    }
   }
   if(end>=0){const points=[];for(let k=end;k>=0;k=prev[k])points.push(point([k%COLS,Math.floor(k/COLS)]));return points.reverse();}
  }
  return null;
 }
 function idleGuardPositions(center){
  return [-1,1].map(side=>{
   // At narrow passages the guards fall into single file instead of crossing scenery.
   for(const [dx,dy]of [[side*25,8],[side*18,0],[0,side*24],[0,0]])if(canStand(center.x+dx,center.y+dy))return {x:center.x+dx,y:center.y+dy};
   return {...center};
  });
 }
 function beginIdleEscort(){
  if(idleEscort||blocked()||idleExempt()||!inside(player.x/T,player.y/T))return false;
  if(cycling&&!leaveBike())return false;
  if(driving){if(Math.abs(driveSpeed)>2)return false;toggleDriving();if(driving)return false;}
  const route=idleExitRoute();if(!route)return false;
  const approachRoute=route.slice(0,Math.min(5,route.length)).reverse();approachRoute.push({x:player.x,y:player.y});
  const center={...approachRoute.shift()};
  idleEscort={time:1,phase:'approach',escort:false,route,approachRoute,center,guards:idleGuardPositions(center),hold:0,stationary:false};
  clearInput();player.vx=player.vy=0;dashTime=scanTime=speechTime=0;encounterGreeting=null;residentRemark=0;$('idle-warning-status').textContent='';
  rememberMessage('Охрана: «Не играете — дайте другим поиграть! Пройдёмте к выходу».','Разговор');
  return true;
 }
 function updateIdleEscort(dt){
  const f=idleEscort;if(!f)return;clearInput();player.vx=player.vy=0;f.time+=dt;
  if(f.phase==='greeting'){f.hold+=dt;f.stationary=true;if(f.hold>=2.4){f.phase='walk';f.stationary=false;}return;}
  const approaching=f.phase==='approach',subject=approaching?f.center:player,route=approaching?f.approachRoute:f.route,target=route[0];
  if(!target){
   if(approaching){f.phase='greeting';f.escort=true;f.guards=idleGuardPositions(player);return;}
   idleEscort=null;notePlayActivity();player.face='down';clearInput();save();
   $('activity-title').textContent='Перерыв у ворот';
   $('activity-copy').textContent='Охрана: «Минута без движения — мы уже решили, что вы новый памятник! Не играете — дайте другим поиграть». Вас проводили к выходу. Штрафа нет, все находки и ответы сохранены. Можно сразу вернуться через ворота и продолжить прогулку.';
   activity.showModal();return;
  }
  const dx=target.x-subject.x,dy=target.y-subject.y,d=Math.hypot(dx,dy),distance=Math.min(d,(approaching?145:190)*dt);
  if(d>.001){
   const x=subject.x+dx/d*distance,y=subject.y+dy/d*distance;
   // A parked car may have moved since the map was built. Release safely if the way changed.
   if(!canStand(x,y)){idleEscort=null;notePlayActivity();speech='Охрана: «Проход занят. Ладно, продолжайте гулять!»';speechTime=5;save();return;}
   subject.x=x;subject.y=y;
   if(!approaching){player.vx=dx/d*190;player.vy=dy/d*190;player.face=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';walk+=dt*12;}
  }
  if(d<=distance+.001)route.shift();f.guards=idleGuardPositions(subject);
 }
 function escortPath(subject=player){const start=[Math.floor(subject.x/T),Math.floor(subject.y/T)],goal=[90,28],key=(x,y)=>x+','+y,queue=[start],prev=new Map([[key(...start),null]]);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===goal[0]&&y===goal[1])break;for(const [dx,dy]of [[1,0],[0,-1],[0,1],[-1,0]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(nx<0||ny<0||nx>=COLS||ny>=ROWS||prev.has(k)||![-25,0,25].every(offset=>canStand(nx*T+16+offset,ny*T+16)))continue;prev.set(k,key(x,y));queue.push([nx,ny]);}}const target=key(...goal);if(!prev.has(target))return null;const points=[];for(let k=target;k;k=prev.get(k)){const [x,y]=k.split(',').map(Number);points.push({x:x*T+16,y:y*T+16});}return points.reverse();}
 function updateEscort(f,dt){if(!f.escort){const progress=Math.min(1,Math.max(0,(f.time-1)/.8));f.guardX=f.x-120+progress*95;f.guardY=f.y+8;if(progress<1)return;f.path=escortPath();if(!f.path){feedScene=null;extras.feeds=1;speech='На этот раз предупреждение. Больше не кормите!';speechTime=4;save();return;}f.escort=true;recordFine('pigeons');announce('Охрана: «Мы предупреждали. Пройдёмте к выходу!»');}const target=f.path[0];if(!target){feedScene=null;player.vx=player.vy=0;speech='Кажется, прогулка с охраной закончилась…';speechTime=5;clearInput();save();return;}const dx=target.x-player.x,dy=target.y-player.y,d=Math.hypot(dx,dy),step=Math.min(d,120*dt);if(d>.01){player.x+=dx/d*step;player.y+=dy/d*step;player.vx=dx/d*120;player.vy=dy/d*120;player.face=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';walk+=dt*12;}if(d<=step+.01)f.path.shift();f.guardX=player.x-25;f.guardY=player.y+8;}
 function updateGuestEscort(dt){const f=guestEscort;if(!f)return;f.time+=dt;const progress=Math.min(1,Math.max(0,(f.time-1)/.8));f.guardX=f.x-120+progress*95;f.guardY=f.y+8;if(progress<1)return;f.escort=true;const target=f.path[0];if(!target){extras.guestRemoved=true;guestEscort=null;announce('Охрана вывела нарушителя за территорию парка.');save();return;}const dx=target.x-drunkGuest.x,dy=target.y-drunkGuest.y,d=Math.hypot(dx,dy),step=Math.min(d,115*dt);if(d>.01){drunkGuest.x+=dx/d*step;drunkGuest.y+=dy/d*step;}if(d<=step+.01)f.path.shift();f.guardX=drunkGuest.x-25;f.guardY=drunkGuest.y+8;}
 function drawDrunkGuest(){const {x,y}=drunkGuest,sway=reduced||guestEscort?0:Math.sin(elapsed*1.7)*2.5,stride=reduced||!guestEscort?.escort?0:Math.sin(guestEscort.time*13)*2;ctx.save();ctx.translate(Math.round(x+sway),Math.round(y));rect(-10,1,21,4,'#365c3b55');rect(-7,-9+stride,6,12,'#42505a');rect(2,-9-stride,6,12,'#42505a');rect(-8,1+stride,8,3,'#d7d4bb');rect(2,1-stride,8,3,'#d7d4bb');rect(-10,-27,20,19,'#dc772e');rect(-13,-25,4,14,'#e58a38');rect(10,-25,4,14,'#dc772e');rect(-13,-12,4,5,'#eab58b');rect(10,-12,4,5,'#eab58b');rect(-8,-41,17,15,'#eab58b');rect(-7,-31,15,4,'#d5a184');rect(-9,-47,19,9,'#747763');rect(-12,-40,24,4,'#555e51');rect(-7,-46,6,4,'#2c3c43');rect(1,-46,6,4,'#2c3c43');line(-1,-44,1,-44,'#bbc6ba',1);rect(-4,-34,2,2,'#494636');rect(4,-34,2,2,'#494636');rect(-1,-29,5,2,'#a96959');if(!guestEscort){rect(13,-16,5,11,'#68824c');rect(14,-20,3,5,'#adba7b');rect(13,-10,5,3,'#e6ce9b');}ctx.restore();}
 function updateFeeding(dt){const f=feedScene;clearInput();player.vx=player.vy=0;f.time+=dt;if(f.repeat){updateEscort(f,dt);return;}if(f.time>=1){const progress=Math.min(1,(f.time-1)/.8);f.guardX=f.x-120+progress*88;f.guardY=f.y+8;if(progress===1&&!f.fined){f.fined=true;recordFine('pigeons');unlockAchievement('pigeons');$('activity-title').textContent='Штраф — 50 рублей';$('activity-copy').textContent='Охранник: «Табличку видели? Кормить голубей запрещено!!! Штраф — 50 рублей». Голуби довольны обедом.';activity.showModal();}}if(f.fined&&f.time>2.8)feedScene=null;}

 function drawFeedingGround(){const p=feedingSpot;if(feedScene){const u=Math.min(1,feedScene.time/.55);for(let i=0;i<7;i++){const x=feedScene.x+(p.x+(i-3)*7-feedScene.x)*u,y=feedScene.y-23+(p.y+(i%3)*5-feedScene.y+23)*u-(reduced?0:Math.sin(u*Math.PI)*28);rect(x,y,4,3,i%2?'#f5df9e':'#ba8550');}}}
 function drawGuard(side=-1,f=feedScene,subject=player){if(!f||f.time<1)return;const pose=f.guards?.[side===-1?0:1],x=pose?pose.x:side===1?(f.escort?subject.x+25:f.x+120-Math.min(1,Math.max(0,(f.time-1)/.8))*95):f.guardX,y=pose?pose.y:f.guardY,stride=reduced||f.fined||f.stationary?0:Math.sin(f.time*16)*3;rect(x-11,y,23,4,'#365c3b66');rect(x-8,y-11+stride,6,13,'#263d50');rect(x+2,y-11-stride,6,13,'#263d50');rect(x-10,y-29,21,20,'#456b73');rect(x-14,y-26,5,15,'#456b73');rect(x+11,y-26,5,15,'#456b73');rect(x-8,y-43,17,15,'#f3be91');rect(x-11,y-47,23,7,'#263d50');rect(x-8,y-51,17,7,'#456b73');rect(x-1,y-47,4,4,'#f4d26d');rect(x-4,y-37,2,2,'#293b43');rect(x+4,y-37,2,2,'#293b43');rect(x+3,y-25,4,5,'#f4d26d');if(f.fined)rect(x+12,y-21,10,13,'#fff1cf');if(f.escort)line(x-side*10,y-20,subject.x+side*10,subject.y-15,'#f3be91',4);}

 function drawPigeon(p){const u=p.flight>0?1-p.flight/2:0,arc=Math.sin(u*Math.PI),x=p.homeX+p.dx*u,y=p.homeY+p.dy*u;rect(x-7,y+1,15,3,'#385b3940');ctx.save();ctx.translate(Math.round(x),Math.round(y-arc*54));const peck=p.flight===0&&!reduced&&Math.sin(elapsed*3+p.phase)>.8?3:0;rect(-7,-8,13,8,'#9da9b4');rect(-4,-10,9,4,'#6e8291');rect(4,-14+peck,7,8,'#65778b');rect(6,-7+peck,4,3,'#66a598');rect(9,-12+peck,2,2,'#172f42');rect(11,-10+peck,4,2,'#d8b879');rect(-10,-5,5,3,'#4b6176');rect(-3,0,2,3,'#cf866b');rect(3,0,2,3,'#cf866b');if(p.flight>0){const flap=Math.sin(elapsed*24+p.phase)*9;rect(-9,-12-flap,8,5,'#d0d9df');rect(0,-12+flap,8,5,'#b4c3cd');}ctx.restore();}

 function drawLeaves(){if(reduced||snowCover()>.1||snowing())return;const autumn=seasonState().autumn,cell=180,gust=windGust(),t=elapsed+2*rainElapsed();for(let cy=Math.floor((camY-90)/cell);cy<=Math.floor((camY+viewH+90)/cell);cy++)for(let cx=Math.floor((camX-90)/cell);cx<=Math.floor((camX+viewW+90)/cell);cx++){const seed=Math.abs(cx*73+cy*151);for(let j=0;j<(comfort.lightweight?1:effectCount(autumn>.5?5:3));j++){const phase=(t*.065+seed*.17+j*.31)%1,age=phase*15.38,x=cx*cell+phase*cell,y=cy*cell+(seed*13+j*61)%cell+Math.sin(age*1.8+seed)*13;if(!inside(x/T,y/T)||x<camX-12||x>camX+viewW+12||y<camY-12||y>camY+viewH+12)continue;ctx.save();ctx.globalAlpha=Math.min(1,phase*8,(1-phase)*8)*.65;ctx.translate(x,y);ctx.rotate(Math.sin(age*2+seed)*.9+age*.4);const w=3+Math.abs(Math.cos(age*3))*3;rect(-w/2,-1,w,3,autumn>.5?['#c4a064','#bd9259','#d2b177'][j%3]:j===0?'#dbb468':j===1?'#aac56c':'#85ac5d');rect(-1,-2,2,5,autumn>.5?'#d3b373':j===0?'#e8c77f':'#b3c775');line(-2,0,3,1,'#748b4d',1);ctx.restore();}if(gust>1.05){const phase=(t*.13+seed*.11)%1,x=cx*cell+phase*cell,y=cy*cell+70;if(inside(x/T,y/T)){ctx.save();ctx.globalAlpha=Math.sin(phase*Math.PI)*(gust-1)*.19;ctx.strokeStyle='#e6edc2';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-23,y+4);ctx.quadraticCurveTo(x,y-7,x+25,y);ctx.stroke();ctx.restore();}}}}

 function drawGardenDecor(){
  for(const b of flowerBeds){const x=b.tx*T,y=b.ty*T,w=b.w*T,h=b.h*T,gb=gardenBeds.find(p=>flowerBeds[p.bed]===b),bloom=!gb||garden.watered.includes(gb.id);rect(x-3,y-3,w+6,h+6,'#b6ac91');rect(x,y,w,h,'#735d42');rect(x+4,y+4,w-8,h-8,'#4c804e');for(let row=0;row<b.h*2;row++)for(let col=0;col<b.w*2;col++){const fx=x+10+col*15+(row%2)*2,fy=y+10+row*15,shade=['#e9cf91','#d79caf','#bab6d6','#e1ddbd'][(col+row+Math.floor(b.tx))%4];rect(fx,fy,2,8,'#315f3e');rect(fx-3,fy+5,4,2,'#789e67');if(bloom){rect(fx-3,fy-1,8,3,shade);rect(fx-1,fy-4,3,8,shade);}else{rect(fx-1,fy-2,4,4,shade);rect(fx-2,fy+2,6,2,'#789e67');}rect(fx,fy,2,2,'#c69b50');}}
  for(const p of picnicBlankets){rect(p.x-23,p.y-17,50,38,'#f6e4bb');for(let row=0;row<4;row++)for(let col=0;col<5;col++)if((row+col)%2===0)rect(p.x-21+col*9,p.y-15+row*9,9,9,'#df7a73');rect(p.x+3,p.y-9,16,12,'#b48049');ctx.strokeStyle='#795339';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x+11,p.y-9,6,Math.PI,0);ctx.stroke();rect(p.x-12,p.y+5,9,5,'#f3c767');}
  for(const p of picnicTables){const x=p.tx*T,y=p.ty*T;rect(x-2,y+3,68,8,'#41594444');rect(x+5,y+8,5,48,'#6b5039');rect(x+53,y+8,5,48,'#6b5039');rect(x-3,y+4,70,10,'#b98653');rect(x-3,y+45,70,10,'#b98653');rect(x,y+18,64,22,'#d5a367');rect(x,y+27,64,2,'#a37149');rect(x+43,y+19,9,12,'#69b8c4');rect(x+45,y+16,5,4,'#eef2d3');rect(x+16,y+23,15,9,'#fff2ce');rect(x+20,y+24,6,5,'#e47361');}drawPicnicCloth();

 }
 function drawPhotoZone(){const {x,y}=photoZone;rect(x-98,y+3,196,8,'#547348');rect(x-88,y-133,176,128,'#fff0ce');rect(x-82,y-127,164,116,'#249cc0');rect(x-94,y-140,188,9,'#f5d781');rect(x-91,y-5,7,17,'#705b40');rect(x+84,y-5,7,17,'#705b40');text('DEX',x,y-91,28,'#fff9e7','center');text('20 ЛЕТ',x,y-57,25,'#ffe18a','center');text('ВМЕСТЕ!',x,y-30,15,'#fff9e7','center');ctx.strokeStyle='#fff1bf';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-86,y-121);ctx.quadraticCurveTo(x,y-97,x+86,y-121);ctx.stroke();for(let i=0;i<8;i++){const bx=x-73+i*21,by=y-120+Math.sin((i+.5)/8*Math.PI)*11;ctx.fillStyle=['#ef6680','#ffdb78','#b3e3d2'][i%3];ctx.beginPath();ctx.moveTo(bx-6,by);ctx.lineTo(bx+6,by);ctx.lineTo(bx,by+10);ctx.closePath();ctx.fill();}}
 function updateBird(dt){if(birdFlight>0){birdFlight=Math.max(0,birdFlight-dt);return;}if(ambientSceneBusy()||musicSoundFocused())return;birdWait-=dt;if(birdWait<=0){birdFlight=7;birdWait=24+Math.random()*22;birdDirection=Math.random()<.5?1:-1;birdHeight=.3+Math.random()*.18;birdOrigin={x:camX+(birdDirection===1?-45:viewW+45),y:camY+viewH*birdHeight,span:viewW+90};window.ParkAudio?.cuckoo();}}
 function cuckooPosition(){if(!birdOrigin)return null;const progress=1-birdFlight/7;return {x:birdOrigin.x+birdDirection*progress*birdOrigin.span,y:birdOrigin.y+Math.sin(progress*Math.PI*2)*14};}
 function drawBird(){if(birdFlight<=0||reduced)return;const {x,y}=cuckooPosition(),flap=Math.sin(elapsed*13);ctx.save();ctx.translate(x,y);ctx.scale(birdDirection,1);rect(-21,4,18,5,'#354754');rect(-24,7,13,3,'#f0e5cf');rect(-10,-3,23,12,'#84939b');rect(-6,5,16,5,'#f0e9d6');for(let i=0;i<4;i++)rect(-5+i*4,7,2,3,'#4c5b65');rect(8,-8,11,12,'#85969f');rect(15,-5,2,2,'#242f34');rect(19,-3,8,3,'#d9bd68');ctx.fillStyle='#526a7a';ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(-20,-8-flap*20);ctx.lineTo(5,-5);ctx.closePath();ctx.fill();ctx.restore();}

 let swiftOrigin=null;
 const balloonOwner={...point([10,40]),kind:'balloonOwner',action:'Поговорить о шарике',hair:'#7b4d35',shirt:'#e8ac55',style:'plaid'};
 const balloonEnd=point([10,44]);
 function swiftBirds(){const phase=weatherTime();if(phase<25||phase>=30||!swiftOrigin)return [];const u=(phase-25)/5;return Array.from({length:reduced?3:7},(_,i)=>({x:swiftOrigin.x-270+u*620-i*32,y:swiftOrigin.y-15+Math.sin(u*7+i*.65)*24+(i%3)*15,i}));}
 function drawSwifts(){for(const {x,y,i}of swiftBirds()){const flap=reduced?3:Math.sin(elapsed*19-i)*5;rect(x-7,y+13,15,3,'#29453825');rect(x-4,y-13,9,3,'#28333c');line(x-1,y-12,x-12,y-18-flap,'#25313c',2);line(x-12,y-18-flap,x-21,y-15-flap,'#25313c',2);line(x+2,y-12,x+12,y-18-flap,'#25313c',2);line(x+12,y-18-flap,x+21,y-15-flap,'#25313c',2);line(x-3,y-11,x-7,y-7,'#25313c',1);line(x-3,y-11,x-2,y-7,'#25313c',1);}}
 function drawLostBalloon(){let p;if(extras.balloon===1)p={x:player.x+22,y:player.y-5};else if(extras.balloon===2||elapsed<25)p={x:balloonOwner.x+22,y:balloonOwner.y};else{const u=Math.min(1,(elapsed-25)/5);p={x:balloonOwner.x+(balloonEnd.x-balloonOwner.x)*u,y:balloonOwner.y+(balloonEnd.y-balloonOwner.y)*u};}const sway=reduced?0:Math.sin(elapsed*3)*5,x=p.x+sway,y=p.y-65;ctx.strokeStyle='#fff0ce';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y-15);ctx.quadraticCurveTo(p.x-8,y+35,x,y+14);ctx.stroke();rect(x-9,y-10,18,23,'#eb687e');rect(x-6,y-14,12,30,'#eb687e');rect(x-5,y-9,4,8,'#ffb9bc');rect(x-2,y+16,4,3,'#a84561');}
 function rainIntensity(){const t=weatherTime();return t>=30&&t<40?Math.min(1,(t-30)*2,(40-t)*2):0;}
 function umbrellaOpening(){const t=weatherTime();if(driving||cycling||t<30||t>=40.5)return 0;return Math.max(0,Math.min(1,(t-30)/.55,(40.5-t)/.5));}
 function drawUmbrella(){if(umbrellaShake){drawClosedUmbrella();if(photoPose()!=='umbrella')return;}const open=photoPose()==='umbrella'?1:umbrellaOpening();if(open<=0)return;const x=Math.round(player.x+13),y=Math.round(player.y-54),w=5+25*open,flex=heroUmbrellaFlex(),tip=y-23*open+39*open*flex;line(x,tip,x,player.y-22,'#d6b67f',2);line(x,player.y-22,x-4,player.y-20,'#d6b67f',2);rect(x-4,player.y-26,6,5,'#f6b683');ctx.fillStyle='#dbad45';ctx.beginPath();ctx.moveTo(x-w,y);ctx.lineTo(x-w*.7,y-12*open+19*open*flex);ctx.lineTo(x,tip);ctx.lineTo(x+w*.7,y-12*open+19*open*flex);ctx.lineTo(x+w,y);ctx.lineTo(x+w*.5,y-3);ctx.lineTo(x,y);ctx.lineTo(x-w*.5,y-3);ctx.closePath();ctx.fill();ctx.fillStyle='#edce68';ctx.beginPath();ctx.moveTo(x,tip);ctx.lineTo(x-w*.45,y-3);ctx.lineTo(x+w*.45,y-3);ctx.closePath();ctx.fill();for(const side of [-1,1])line(x,tip,x+side*w*.5,y-3,'#ae8740',1);rect(x-1,tip-2,2,4,'#826841');}
 function drawRain(){const strength=rainIntensity();if(strength<=0)return;ctx.save();ctx.globalAlpha=strength;rect(0,0,viewW,viewH,'#253f651c');const t=weatherTime()-30;for(let i=0;i<(comfort.lightweight?28:reduced?42:effectCount(100));i++){const x=((i*137-t*45-camX*.2)%(viewW+40)+viewW+40)%(viewW+40)-20,y=((i*83+t*(190+i%4*27)-camY*.15)%(viewH+30)+viewH+30)%(viewH+30)-15;line(x,y,x-3,y+9,'#c0dde577',1);if(i<(comfort.lightweight?5:effectCount(18))){const phase=(t*1.7+i*.37)%1,sx=(i*193+55)%viewW,sy=(i*97+180)%viewH;if(phase<.3){rect(sx-3,sy,7,1,'#b8d7dc66');rect(sx,sy-2,1,3,'#d3e9e377');}}}const phase=weatherTime(),boltAge=phase<35?phase-32.2:phase-37.2;if(boltAge>=0&&boltAge<.65){ctx.globalAlpha=strength*(1-boltAge/.65)*(reduced?.35:1);const x=viewW*.73;ctx.strokeStyle='#eff3ce';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-16,29);ctx.lineTo(x+3,25);ctx.lineTo(x-20,67);ctx.lineTo(x-10,45);ctx.stroke();line(x-16,29,x-35,35,'#c8def0',1);}ctx.restore();}

 function drawQuestBall(x,y,scale=1){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);rect(-7,-7,14,14,'#bf3f51');rect(-8,-4,16,8,'#e9696e');rect(-4,-8,8,16,'#e9696e');rect(-4,-5,5,4,'#ffe4ad');rect(2,1,4,4,'#f8c571');ctx.restore();}
 function drawQuestBook(x,y,opening=0,reading=false){ctx.save();ctx.translate(x,y);const w=reading?7+6*opening:7;rect(-w-2,-8,w*2+4,17,'#465e9a');rect(-w,-7,w*2,14,'#fff1d1');rect(-1,-7,2,15,'#b69a74');for(let i=0;i<3;i++){rect(-w+2,-4+i*4,Math.max(2,w-4),1,'#c4b28d');rect(3,-4+i*4,Math.max(2,w-5),1,'#c4b28d');}if(reading&&!reduced){const page=Math.sin(elapsed*1.4);rect(1,-6,Math.max(1,Math.round(Math.abs(page)*5)),12,'#fff9e6');}ctx.restore();}

 function drawFindItem(kind,x,y){if(kind==='ball')drawQuestBall(x,y,.8);else if(kind==='book')drawQuestBook(x,y);else{rect(x-5,y-4,10,8,'#a47a48');rect(x-3,y-6,6,11,'#c99b60');line(x,y-4,x-1,y+3,'#795b39',1);}}
 function activePickupLift(){return pickupGesture&&holdsFind(pickupGesture.kind)&&photoPose()==='natural'&&umbrellaOpening()===0&&(!detailHandsBusy()||capturingPhoto&&photoMode&&!funScene)?pickupGesture:null;}
 function drawCarriedItems(lift=activePickupLift()){
  if(garden.stage===1)drawWateringCan(16,-8,funScene?.kind==='watering'?-.5:0);
  if(!lift)for(const [kind,x,y] of [['ball',-13,-12],['book',13,-12],['nut',0,-23]])if(holdsFind(kind)&&lift?.kind!==kind){drawFindItem(kind,x,y);rect(x+1,y+5,5,3,'#f6b683');}
  if(lift){const u=unit(lift.time/1.15),rise=reduced?1:Math.min(1,u/.18,(1-u)/.2),y=-15-36*rise;
   const elbow=-13-13*rise;for(const side of [-1,1]){line(side*10,-18,side*12,elbow,'#f04b4b',5);line(side*12,elbow,side*6,y+6,'#f6b683',4);}drawFindItem(lift.kind,0,y);rect(-8,y+5,5,3,'#f6b683');rect(4,y+5,5,3,'#f6b683');}
 }

 function drawChess(p,caption=true){const active=funScene?.kind==='parkRide'&&funScene.rideId==='chess',t=active?funScene.time:0,x=p.x,y=p.y-32;ctx.save();ctx.translate(x,y);rect(-58,-16,116,27,'#b5a17c');ctx.save();ctx.translate(0,-34);ctx.scale(.65,.65);ctx.translate(0,34);rect(-19,-83,38,44,'#7b6149');rect(-17,-81,34,6,'#b38b59');rect(-23,-66,46,30,'#36516e');rect(-18,-68,36,31,'#2b405b');rect(-7,-65,14,27,'#233244');rect(-3,-63,2,23,'#7890a0');rect(-14,-101,28,31,'#d5a07b');rect(-15,-105,30,10,'#51483d');rect(-11,-109,23,7,'#625548');for(const [hx,hy]of [[-10,-106],[-4,-108],[5,-107],[10,-102]])rect(hx,hy,5,2,'#998775');rect(-15,-97,3,15,'#7f705b');rect(12,-97,3,15,'#7f705b');rect(-10,-92,7,2,'#665041');rect(4,-92,7,2,'#665041');rect(-8,-88,3,3,'#332f2a');rect(5,-88,3,3,'#332f2a');rect(-2,-86,3,9,'#bb8568');rect(-6,-74,12,2,'#986951');rect(-10,-70,20,2,'#c28e72');rect(-25,-62,8,22,'#3d5978');rect(17,-62,8,22,'#3d5978');const reach=active&&!reduced?Math.sin(t*Math.PI*2)*3:0;rect(-23,-43,7,9,'#d5a07b');rect(17,-43+reach,7,9,'#d5a07b');ctx.restore();rect(-44,-39,88,47,'#825b3c');rect(-41,-37,82,42,'#b88e58');rect(-37,7,7,17,'#765337');rect(30,7,7,17,'#765337');const ox=-28,oy=-35,size=7;for(let row=0;row<8;row++)for(let col=0;col<8;col++)rect(ox+col*size,oy+row*4.5,size,4.5,(row+col)%2?'#5c7560':'#eeddb3');const piece=(col,row,white,king=false)=>{const px=ox+col*size+3,py=oy+row*4.5+2,c=white?'#fff7d7':'#243b36';rect(px-2,py-5,4,5,c);rect(px-3,py,6,2,c);if(king){rect(px-1,py-9,2,5,c);rect(px-3,py-7,6,2,c);}};const turn=active?Math.min(4,Math.floor(t)):0;piece(4,0,false,true);piece(1,1,false);piece(6,1,false);piece(0,6,true);piece(7,6,true);piece(4,7,true,true);piece(active?4:3,active?6-turn:6,true);if(active){rect(-16,14,32,18,'#785c43');rect(-12,8,24,19,'#e8454b');rect(-11,-8,22,19,'#294b93');rect(-7,-12,16,6,'#294b93');rect(-17,5,6,15,'#e8454b');rect(11,5,6,15,'#e8454b');rect(-16,1,5,7,'#f6b683');rect(11,1,5,7,'#f6b683');}else{rect(-17,13,34,6,'#aa7a4f');rect(-14,18,5,11,'#765337');rect(9,18,5,11,'#765337');}if(ridesWet()){rect(38,-66,3,76,'#777158');ctx.save();ctx.translate(0,30);rect(-48,-97,101,8,'#d2ac5e');rect(-38,-105,82,8,'#ead083');rect(-22,-111,50,6,'#f4df9d');rect(2,-114,6,4,'#777158');for(let u=-38;u<=42;u+=20)rect(u,-98,8,11,'#6a9685');ctx.restore();}ctx.restore();if(caption&&rideCaptionVisible(p,active))mapLabel(ridesWet()&&!active?(snowing()?'Шахматы · Переждём метель':'Шахматы · Переждём дождь'):active?'Партия '+((rideVisits.chess||0)+1)+'/3 · '+Math.max(1,Math.ceil(5-t))+' с':'Леша · Ваши победы: '+(rideVisits.chess||0)+'/3',p.x,p.y-136,12,1);}
 function drawParkRide(p){if(p.id==='chess'){drawChess(p);return;}const active=funScene?.kind==='parkRide'&&funScene.rideId===p.id,t=active?funScene.time:0,a=reduced?0:active?t*Math.PI/3:rideAmbientTime()*.22,x=p.x,y=p.y-32;ctx.save();ctx.translate(x,y);rect(-76,-11,152,20,'#c3b085');rect(-74,5,148,4,'#8b785a');const guest=(gx,gy)=>{rect(gx-5,gy-19,10,9,'#294b93');rect(gx-4,gy-14,8,5,'#f6b683');rect(gx-6,gy-8,12,10,'#ed4b51');};const oval=(cx,cy,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.fill();};const car=(cx,cy,color,hero=false)=>{rect(cx-12,cy-7,24,13,color);rect(cx-10,cy+6,20,3,'#455957');rect(cx-13,cy-16,26,3,'#376a8b');line(cx-12,cy-14,cx-12,cy,'#376a8b',2);line(cx+12,cy-14,cx+12,cy,'#376a8b',2);if(hero)guest(cx,cy-5);};
 if(p.id==='smallWheel'){line(-30,0,0,-61,'#387193',6);line(30,0,0,-61,'#387193',6);for(let k=0;k<6;k++){const angle=a+k*Math.PI/3,cx=Math.cos(angle)*48,cy=-61+Math.sin(angle)*48;line(0,-61,cx,cy,'#f3d36d',5);car(cx,cy,['#ba6863','#60978b','#d9ad55'][k%3],active&&k===0);}rect(-8,-69,16,16,'#f7da7b');}
 else if(p.id==='bee'){oval(0,-7,65,18,'#7b9473');rect(-5,-74,10,66,'#4d805c');for(let k=0;k<5;k++){const angle=a+k*Math.PI*2/5,cx=Math.cos(angle)*48,cy=-28+Math.sin(angle)*16;line(0,-62,cx,cy,'#edce6c',3);oval(cx-6,cy-8,8,5,'#d5e7d9');oval(cx+6,cy-9,8,5,'#d5e7d9');rect(cx-13,cy-4,26,14,'#f0cd55');for(let z=-8;z<10;z+=7)rect(cx+z,cy-4,3,14,'#4c4738');rect(cx+13,cy-5,8,10,'#f0cd55');rect(cx+17,cy-3,2,2,'#273e36');if(active&&k===0)guest(cx,cy-5);}rect(-53,-83,106,10,'#dd7358');rect(-37,-94,74,11,'#e9ba5b');}
 else if(p.id==='boats'){for(const bx of [-38,38]){line(bx-28,0,bx,-99,'#6493a2',5);line(bx+28,0,bx,-99,'#6493a2',5);const sway=reduced?0:Math.sin(active?t*2.5:rideAmbientTime()*.7)* (active?22:4);line(bx,-96,bx+sway-13,-24,'#c6d1bc',2);line(bx+6,-96,bx+sway+15,-24,'#c6d1bc',2);car(bx+sway,-21, bx<0?'#d2ae5d':'#76a39e',active&&bx<0);}rect(-67,-102,134,5,'#8db6b6');}
 else if(p.id==='slides'||p.id==='playground'){rect(-43,-76,34,8,'#e6b54c');for(const xx of [-40,-15])rect(xx,-72,4,67,'#438a92');for(let yy=-67;yy<-8;yy+=10)rect(-39,yy,25,3,'#dd9857');line(-9,-69,52,-8,'#dd6957',17);line(-9,-74,56,-12,'#efc369',3);if(p.id==='playground'){rect(21,-65,48,5,'#529c9e');for(const xx of [23,63])rect(xx,-65,4,56,'#529c9e');for(let xx=28;xx<63;xx+=8)rect(xx,-64,2,25,'#c8dac4');rect(-49,-91,45,14,'#d65c59');}if(active){const f=t/6;if(f<.5)guest(-28,-10-f*116);else guest(-8+(f-.5)*122,-69+(f-.5)*122);}}
 else if(p.id==='maze'){rect(-67,-103,134,94,'#cdbc7c');const walls=[[-65,-102,130,5],[-65,-102,5,87],[60,-102,5,87],[-65,-19,65,5],[-38,-77,77,5],[-38,-77,5,35],[-10,-52,48,5],[33,-77,5,54],[-10,-52,5,34]];for(const [wx,wy,ww,wh]of walls){rect(wx,wy,ww,wh+3,'#426d4b');rect(wx,wy,ww,wh,'#83aa62');}rect(40,-21,14,7,'#e6b557');if(active){const route=[[47,-8],[47,-88],[-51,-88],[-51,-31],[-23,-31],[-23,-63],[20,-63],[20,-32],[20,0]],f=Math.min(7.999,t/6*8),k=Math.floor(f),u=f-k;guest(route[k][0]+(route[k+1][0]-route[k][0])*u,route[k][1]+(route[k+1][1]-route[k][1])*u);}}
 else if(p.id==='railway'){oval(0,-42,64,35,'#806f55');oval(0,-42,57,28,'#8eaa68');for(let k=0;k<24;k++){const z=k*Math.PI/12,cx=Math.cos(z)*61,cy=-42+Math.sin(z)*32;rect(cx-2,cy-2,4,4,'#dad4ae');}for(let k=2;k>=0;k--){const z=a-k*.5,cx=Math.cos(z)*60,cy=-42+Math.sin(z)*32;rect(cx-12,cy-13,25,16,k===0?'#d66355':'#5f96a4');rect(cx-9,cy+3,5,4,'#304b49');rect(cx+6,cy+3,5,4,'#304b49');if(k===0){rect(cx+7,cy-25,5,13,'#3c5b61');rect(cx-14,cy-23,14,11,'#d8b764');if(active)guest(cx-5,cy-13);}else rect(cx-9,cy-11,18,8,'#d8e5cc');}text('РЕТРО',0,-91,10,'#f9efd1','center');}
 else{rect(-56,-116,112,100,'#d4b57d');rect(-51,-111,102,90,'#315b50');rect(-49,-16,5,17,'#856547');rect(44,-16,5,17,'#856547');['АТТРАКЦИОНЫ','ПРОШЛОГО'].forEach((row,k)=>text(row,0,-99+k*11,9,'#f3d98e','center'));['Сюрприз · Юнга','Карнавал','Круговой обзор','Детская железная','дорога'].forEach((row,k)=>text(row,0,-73+k*11,9,'#fff0c8','center'));}
 ctx.restore();if(rideCaptionVisible(p,active))mapLabel(p.name+(ridesWet()&&p.id!=='history'&&!active?(snowing()?' · Перерыв: метель':' · Перерыв: дождь'):p.historic?' · ретро':''),p.x,p.y-166,11,1);}
 function drawHero(){if(cycling){drawBicycle(bike,true);return;}if(funScene?.kind==='parkRide')return;if(driving||funScene?.kind==='carousel')return;if(funScene?.kind==='door409')return;if(karaokeTime>0||swingTime>0||wheelTime>0)return;const x=Math.round(restingBench?restingBench.tx*T+32:player.x),y=Math.round(restingBench?restingBench.ty*T+24:player.y);const pose=photoPose(),face=pose==='natural'?player.face:'down',lift=activePickupLift();const running=pose==='natural'&&Math.hypot(player.vx,player.vy)>15,bob=reduced?0:running?Math.abs(Math.sin(walk))*2:Math.sin(elapsed*2)*.5;ctx.save();ctx.translate(x,y-bob-fairHop()-fairAwardLift()-(funScene?.kind==='trampoline'&&!reduced?Math.abs(Math.sin(funScene.time*6))*25:funScene?.kind==='paint'?24:funScene?.kind==='music'&&!reduced?Math.abs(Math.sin(funScene.time*9))*9:0)-(reduced?0:Math.abs(Math.sin(joyTime*8))*14*(joyTime>0)));rect(-10,0,22,5,'#365c3b66');ctx.rotate(fairLean());ctx.scale(1.08,restingBench||['cinema','portrait','magic'].includes(funScene?.kind)?1.1:1.35);const stride=running&&!reduced?Math.sin(walk)*3:0;rect(-7,-5+stride,5,8,'#243852');rect(2,-5-stride,5,8,'#243852');if(extras.boots===2){for(const [bx,by]of [[-9,stride],[2,-stride]]){rect(bx,-5+by,7,8,'#805637');rect(bx-1,1+by,10,5,'#946940');rect(bx-1,5+by,10,2,'#3d3c32');rect(bx+2,-3+by,3,1,'#d7b576');rect(bx+2,by,3,1,'#d7b576');}}else{rect(-8,1+stride,7,3,'#e6f0e4');rect(2,1-stride,7,3,'#e6f0e4');}rect(-9,-20,18,17,'#be3145');rect(-7,-19,14,12,'#f04b4b');if(paintTime>0){for(let i=0;i<3;i++)rect(-7,-18+i*4,14,2,'#71b77b');}if(whiteMark>0){rect(-3,-16,7,4,'#fffdf2');rect(0,-13,3,5,'#fffdf2');}if(funScene?.kind==='photo'){rect(10,-34,4,17,'#f6b683');rect(9,-39,2,7,'#f6b683');rect(14,-39,2,7,'#f6b683');}if(!lift){rect(-12,-18-stride,4,11,'#f04b4b');rect(-12,-9-stride,4,4,'#f6b683');if(pose==='wave'){rect(8,-23,6,7,'#f04b4b');rect(12,-35,4,16,'#f6b683');rect(11,-40,6,7,'#f6b683');rect(10,-39,1,4,'#e5a77b');}else if(pose==='thumb'){rect(8,-19,7,7,'#f04b4b');rect(13,-23,8,6,'#f6b683');rect(17,-29,4,8,'#f6b683');rect(14,-20,3,1,'#d2916a');}else{rect(8,-18+stride,4,11,'#f04b4b');rect(8,-9+stride,4,4,'#f6b683');}}rect(-9,-34,18,16,'#203c78');rect(-6,-38,13,6,'#294b93');if(face!=='up'){const shift=face==='right'?3:face==='left'?-3:0;rect(-7+shift,-29,14,9,'#f6b683');rect(-7+shift,-22,14,6,'#294b93');rect(-4+shift,-27,2,2,'#182e54');rect(3+shift,-27,2,2,'#182e54');rect(-2+shift,-20,5,2,'#fff4d9');}else rect(-6,-30,12,10,'#294b93');if(restingBench||['cinema','portrait','magic'].includes(funScene?.kind)){rect(-8,-3,7,6,'#243852');rect(2,-3,7,6,'#243852');rect(-10,3,9,3,'#e6f0e4');rect(2,3,9,3,'#e6f0e4');}if(!lift){drawHeroGestures();drawStoneHand();drawSprayHands();drawFairHeroHands();}drawChampionRibbon();drawCarriedItems(lift);ctx.restore();if(!restingBench&&!['cinema','portrait','magic'].includes(funScene?.kind)){if(!reflectingHero)drawFootSplash();drawUmbrella();}else if(pose==='umbrella')drawUmbrella();}
 function luckyPigeonPosition(){if(!luckyOrigin)return null;const progress=luckAfter>0?1+(2-luckAfter)/2:1-luckDelay/2;return {x:luckyOrigin.x+progress*150,y:luckyOrigin.y};}
 function updateLuckyPigeon(dt){whiteMark=Math.max(0,whiteMark-dt);luckAfter=Math.max(0,luckAfter-dt);if(luckDelay<0||driving||funScene||towScene)return;luckDelay=Math.max(0,luckDelay-dt);if(luckDelay<=2&&!luckyOrigin)luckyOrigin={x:player.x-150,y:player.y-110};if(luckDelay<=.45&&!luckyDrop)luckyDrop={...luckyPigeonPosition()};if(luckDelay===0){luckDelay=-1;luckAfter=2;whiteMark=5;extras.luckMoney+=10;speech='О, это к деньгам!';speechTime=5;unlockAchievement('luck10');announce('+10 к деньгам! Голубь передал привет.');save();}}
 function drawLuckyPigeon(){if((luckDelay<0||luckDelay>2)&&luckAfter<=0)return;const pos=luckyPigeonPosition();if(!pos)return;const {x,y}=pos;drawPigeon({homeX:x,homeY:y,dx:0,dy:0,flight:0,phase:1});if(!reduced){rect(x-18,y-12-Math.sin(elapsed*18)*8,10,5,'#b5c8ce');rect(x+7,y-12+Math.sin(elapsed*18)*8,10,5,'#b5c8ce');}if(luckyDrop&&luckDelay>=0&&luckDelay<.45){const u=1-luckDelay/.45;rect(luckyDrop.x+(player.x-luckyDrop.x)*u,luckyDrop.y+(player.y-19-luckyDrop.y)*u,4,6,'#fffdf2');}}

 function drawSidewalks(){const stripes=[[4,4,88,2],[4,70,88,2],[4,6,2,64],[90,6,2,64]];for(const [x,y,w,h] of stripes){rect(x*T,y*T,w*T,h*T,'#c3c6b8');for(let tx=x;tx<x+w;tx++)for(let ty=y;ty<y+h;ty++){rect(tx*T,ty*T,32,1,'#a6afa4');rect(tx*T,ty*T,1,32,'#a6afa4');}}}
 const fencePanels=[];
 for(let ty=6;ty<=69;ty++)for(let tx=6;tx<=89;tx++)if(fenceTile(tx,ty))fencePanels.push({tx,ty,x:tx*T+16,y:ty*T+16});
 function drawFencePanel(p){const {x:px,y:py,tx}=p;if(tx===6||tx===89){rect(px-3,py-16,6,32,'#456557');rect(px-7,py-12,14,3,'#93ab89');}else{rect(px-16,py-11,32,4,'#456557');rect(px-16,py+2,32,3,'#456557');rect(px-2,py-17,4,24,'#93ab89');}}
 function fenceActors(){return fencePanels.map(p=>({y:p.y+(p.tx===6||p.tx===89?16:7),paint:()=>drawFencePanel(p)}));}
 function drawCarousel(p,active){const {x,y}=p,angle=carouselAngle;const oval=(cx,cy,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);ctx.fill();};
  oval(x,y+8,64,25,'#365b3c55');oval(x,y,61,26,'#745a3e');rect(x-61,y-9,122,10,'#ab7849');oval(x,y-10,61,26,'#dbb978');oval(x,y-11,55,21,'#e9cd94');
  for(let i=0;i<12;i++){const a=i*Math.PI/6+angle;line(x,y-11,x+Math.cos(a)*54,y-11+Math.sin(a)*20,'#bd955d',1);}oval(x,y-10,15,6,'#b88a54');
  const seats=Array.from({length:6},(_,i)=>{const a=i*Math.PI/3+angle;return {i,a,depth:Math.sin(a),x:x+Math.cos(a)*45,y:y-24+Math.sin(a)*17};}).sort((a,b)=>a.depth-b.depth);
  const seat=q=>{const shade=['#db6878','#629fc2','#ddb94f'][q.i%3],ax=x+Math.cos(q.a)*40,ay=y-87+Math.sin(q.a)*14;line(ax-5,ay,q.x-7,q.y-11,'#d4d9bd',2);line(ax+5,ay,q.x+7,q.y-11,'#d4d9bd',2);rect(q.x-9,q.y-13,18,13,shade);rect(q.x-10,q.y,20,4,'#486565');rect(q.x-7,q.y-11,14,3,'#fff0c0');line(q.x-10,q.y-1,q.x-10,q.y-7,'#e9dbad',2);line(q.x+10,q.y-1,q.x+10,q.y-7,'#e9dbad',2);if(active&&q.i===0){rect(q.x-6,q.y-28,12,14,'#284987');rect(q.x-4,q.y-24,8,6,'#f6b683');rect(q.x-7,q.y-14,14,12,'#ef5553');rect(q.x-10,q.y-9,4,7,'#f6b683');rect(q.x+6,q.y-9,4,7,'#f6b683');line(q.x-9,q.y-1,q.x+9,q.y-1,'#f4dfad',3);}};
  seats.filter(q=>q.depth<0).forEach(seat);rect(x-7,y-99,14,83,'#b99458');rect(x-4,y-99,5,81,'#f5dfaa');for(let i=0;i<5;i++)rect(x-7,y-85+i*15,14,3,'#db765e');oval(x,y-16,11,4,'#ead3a0');seats.filter(q=>q.depth>=0).forEach(seat);
  oval(x,y-90,64,22,'#a95359');for(let i=0;i<12;i++){const a=i*Math.PI/6,b=(i+1)*Math.PI/6;ctx.fillStyle=['#e7817b','#f3d995','#d96d70','#f8e7b3'][i%4];ctx.beginPath();ctx.moveTo(x,y-131);ctx.lineTo(x+Math.cos(a)*64,y-95+Math.sin(a)*20);ctx.lineTo(x+Math.cos(b)*64,y-95+Math.sin(b)*20);ctx.closePath();ctx.fill();}for(let i=0;i<9;i++){const a=i*Math.PI/8;rect(x+Math.cos(a)*60-2,y-93+Math.sin(a)*20,4,4,'#fff1b7');}oval(x,y-132,5,3,'#e6bd60');line(x,y-134,x,y-148,'#e5d09c',2);ctx.fillStyle='#e36f77';ctx.beginPath();ctx.moveTo(x+1,y-148);ctx.lineTo(x+21,y-141);ctx.lineTo(x+1,y-136);ctx.fill();
 }

 function drawExpansionDecor(){for(const {x,y} of decorBeds){rect(x-24,y-4,48,19,'#5b804f');for(let i=0;i<7;i++){const fx=x-21+i*7;rect(fx,y-7,2,13,'#3d7548');rect(fx-3,y-10,8,5,i%2?'#ddc280':'#cd99a5');}rect(x-27,y+14,54,4,'#bbad83');}for(const {x,y} of decorSeats){rect(x,y,48,12,'#a47547');rect(x+4,y+12,4,11,'#4b5b44');rect(x+40,y+12,4,11,'#4b5b44');rect(x+2,y+4,44,2,'#d3a369');}}
 function drawExpansionProp(p){if(!['carousel','trampoline','gazebo','telescope'].includes(p.kind))return;const {x,y}=p,active=funScene?.kind===p.kind,t=active?funScene.time:0;if(p.kind==='carousel')drawCarousel(p,active);if(p.kind==='trampoline'){rect(x-35,y-19,70,27,'#426a83');rect(x-28,y-16,56,19,'#344c5e');for(const dx of [-32,29])rect(x+dx,y+8,4,10,'#b9c7ad');}if(p.kind==='gazebo'){rect(x-38,y-18,76,36,'#b7996c');for(let dy=-15;dy<18;dy+=7)rect(x-38,y+dy,76,1,'#97805d');for(const dx of [-31,28])rect(x+dx,y-65,5,65,'#a4774e');rect(x-38,y-6,76,8,'#b48d5a');ctx.fillStyle='#6c8b62';ctx.beginPath();ctx.moveTo(x-44,y-65);ctx.lineTo(x,y-99);ctx.lineTo(x+44,y-65);ctx.fill();rect(x-25,y-25,50,8,'#b48d5a');}if(p.kind==='telescope'){rect(x-3,y-38,6,35,'#b4c3bf');for(const dx of [-1,1]){ctx.strokeStyle='#526d71';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y-20);ctx.lineTo(x+dx*18,y+7);ctx.stroke();}ctx.save();ctx.translate(x,y-40);ctx.rotate(-.35);rect(-24,-8,49,16,'#618da0');rect(22,-10,6,20,'#d4ded1');ctx.restore();if(active&&visitCount('telescope')===1){const ux=x+(reduced?0:Math.sin(t*2)*25),uy=y-108;rect(ux-18,uy,36,5,'#aacbc9');rect(ux-9,uy-8,18,8,'#71bdd3');rect(ux-22,uy+4,44,4,'#527a80');for(let i=0;i<3;i++)rect(ux-13+i*11,uy+8,4,3,'#f8de8b');}if(active)for(let i=0;i<7;i++)text('✦',x-45+i*14,y-78-(i%3)*13,12,'#fff1b4','center');}}
 function drawParking(){const {x,y,w,h}=parking;rect(x-5,y-5,w+10,h+10,'#c7c6af');rect(x,y,w,h,'#758080');rect(x,y+84,w,h-84,'#58656a');const mouth=68*T;rect(mouth,y+h,4*T,6,'#58656a');for(let i=0;i<6;i++)rect(x+8+i*80,y+5,3,77,'#fff1ca');rect(x+8,y+5,403,3,'#fff1ca');for(let i=0;i<5;i++)text(String(i+1),x+48+i*80,y+79,11,'#f4ebcd','center');for(let dx=20;dx<w-30;dx+=38)rect(x+dx,y+138,18,2,'#eedfae');line(70*T,y+155,70*T,y+183,'#fff1ca',2);line(70*T,y+183,70*T-5,y+176,'#fff1ca',2);line(70*T,y+183,70*T+5,y+176,'#fff1ca',2);rect(x-16,y+89,4,39,'#685d46');rect(x-28,y+61,28,29,'#427998');text('P',x-14,y+83,23,'#fff4d6','center');}

 function inBMW(x,y){if(!bmwAvailable)return false;const dx=x-bmw.x,dy=y-bmw.y,c=Math.cos(bmw.angle),s=Math.sin(bmw.angle);return Math.abs(dx*c+dy*s)<31&&Math.abs(-dx*s+dy*c)<49;}
 function driveSurface(x,y){return (x>=parking.x&&x<=parking.x+parking.w&&y>=parking.y&&y<=parking.y+parking.h)||onMotorRoad(x,y);}
 function canDriveAt(x,y,angle){if(bikeCarOverlap(bike,{x,y,angle}))return false;const c=Math.cos(angle),s=Math.sin(angle);for(const [dx,dy] of [[0,0],[-27,-43],[27,-43],[-27,46],[27,46],[0,-43],[0,46],[-27,0],[27,0]]){const px=x+dx*c-dy*s,py=y+dx*s+dy*c;if(!driveSurface(px,py)||solidTile(Math.floor(px/T),Math.floor(py/T),true))return false;}return true;}
 function toggleDriving(){if(idleEscort||cycling)return;notePlayActivity();steerValue=0;if(trafficStop||towScene||!bmwAvailable)return;if(driving){if(Math.abs(driveSpeed)>25){announce('Сначала остановитесь: ↓ или пробел — тормоз.');return;}const c=Math.cos(bmw.angle),s=Math.sin(bmw.angle);for(const [dx,dy] of [[65,0],[-65,0],[0,85],[0,-85],[85,35],[-85,35]]){const x=bmw.x+dx*c-dy*s,y=bmw.y+dx*s+dy*c;driving=false;if(canStand(x,y)){player.x=x;player.y=y;player.vx=player.vy=0;driveSpeed=0;clearInput();save();return;}driving=true;}announce('Здесь тесно. Подъедьте к более свободному месту.');return;}if(Math.hypot(player.x-bmw.x,player.y-bmw.y)>=100)return;if(hoodCatOnCar()){startCatLeave();announce('Кошка потягивается и спрыгивает. Секунду — и можно ехать.');}driving=true;driveSpeed=0;player.x=bmw.x;player.y=bmw.y;player.vx=player.vy=0;dashTime=0;clearInput();if(!tutorialSeen.car){tutorialSeen.car=true;announce((viewW<600||mobileScreen())?'Первый выезд: стик — руль. Справа педали «Газ» и «Тормоз». Кнопка «Спорт» ограничивает скорость до 50. После остановки нажмите «Выйти из BMW».':'Первый выезд: W — газ, S — назад, пробел — тормоз. R отключает спорт, E — выйти после остановки.');}save();}
 function stepDriving(dt){if(hoodCatOnCar()){driveSpeed=0;return;}const before={x:bmw.x,y:bmw.y,angle:bmw.angle};trafficCooldown=Math.max(0,trafficCooldown-dt);if(trafficStop){updateTrafficStop(dt);return;}if(emergencyBrake>0){driveSpeed=0;brakeGlow=.3;return;}const up=keys.has('ArrowUp')||keys.has('KeyW')?1:0,down=keys.has('ArrowDown')||keys.has('KeyS')?1:0,keyboardSteer=Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA')),steer=keyboardSteer||stick.x;if(keys.has('Space')||(down&&driveSpeed>0)||(up&&driveSpeed<0))brakeGlow=.3;if(keys.has('Space'))driveSpeed=approach(driveSpeed,0,650*dt);else if(up)driveSpeed=approach(driveSpeed,(sportMode?420:50/.22)*up,190*up*dt);else if(down)driveSpeed=approach(driveSpeed,-170*down,driveSpeed>0?400*down*dt:150*down*dt);else driveSpeed=approach(driveSpeed,0,70*dt);if(flatTyre)driveSpeed=Math.max(-25,Math.min(25,driveSpeed));if(!sportMode)driveSpeed=Math.min(driveSpeed,50/.22);steerValue=approach(steerValue,steer,(steer?4.5:5)*dt);const turnRate=2.7/(1+Math.abs(driveSpeed)/220);const angle=bmw.angle+steerValue*Math.sign(driveSpeed)*Math.min(1,Math.abs(driveSpeed)/45)*turnRate*dt;if(vehicleMoveClear(bmw,{...bmw,angle},canDriveAt))bmw.angle=angle;const x=bmw.x-Math.sin(bmw.angle)*driveSpeed*dt,y=bmw.y+Math.cos(bmw.angle)*driveSpeed*dt;if(duckCrossingBlocks(x,y,72,bmw)){driveSpeed=0;brakeGlow=.3;return;}if(brotherInCarPath()){driveSpeed=0;brakeGlow=1;emergencyBrake=.65;brotherShout=3;brotherRefusal=0;if(!brotherEscape||brotherEscape.state==='return')brotherEscape={state:'away',route:[{x:brother.x,y:parking.y+12},{x:parking.x+248,y:parking.y+12}],moving:false};return;}if(vehicleMoveClear(bmw,{x,y,angle:bmw.angle},canDriveAt)){if(Math.hypot(x-bmw.x,y-bmw.y)>.01&&!tyreRepaired&&!flatTyre)driveSeconds+=dt;wheelTravel+=Math.hypot(x-bmw.x,y-bmw.y)*Math.sign(driveSpeed);bmw.x=x;bmw.y=y;recordVehicleMotion(before,dt);const lastPoint=carTrail[carTrail.length-1];if(!lastPoint||Math.hypot(x-lastPoint.x,y-lastPoint.y)>10){carTrail.push({x,y,angle:bmw.angle});if(carTrail.length>50)carTrail.shift();}}else{driveSpeed=0;brakeGlow=.3;}player.x=bmw.x;player.y=bmw.y;if(driveSeconds>=30&&!flatTyre&&!tyreRepaired){flatTyre=true;driveSpeed=0;brakeGlow=1;toggleDriving();announce('Колесо спустило! Выйдите через E и подкачайте его компрессором — ещё раз E рядом с BMW.',{urgent:true});save();return;}if(crossedRedLight(before,bmw)){beginTrafficStop('red');return;}if(trafficCooldown===0&&Math.round(Math.abs(driveSpeed)*.22)>=70){beginTrafficStop();return;}noteCalmDrive(before,dt);bmwHazardTime=Math.max(0,bmwHazardTime-dt);driveSaveClock+=dt;if(driveSaveClock>2){driveSaveClock=0;save();}}
 function trafficLightPhase(){const t=trafficLightClock%18;return t<8?'green':t<10?'yellow':'red';}
 function carSouthEdge(p){return p.y+Math.abs(Math.cos(p.angle))*46+Math.abs(Math.sin(p.angle))*27;}
 function crossedRedLight(before,after){if(trafficLightPhase()!=='red'||after.y<=before.y)return false;const a=carSouthEdge(before),b=carSouthEdge(after);if(a>trafficLight.stopY||b<=trafficLight.stopY)return false;const u=(trafficLight.stopY-a)/(b-a),x=before.x+(after.x-before.x)*u;return x>=68*T&&x<=72*T;}
 function bmwLightState(){return {brake:driving&&(brakeGlow>0||!!trafficStop||keys.has('Space')||((keys.has('ArrowDown')||keys.has('KeyS')||stick.y>.05)&&driveSpeed>=0)),reverse:driving&&driveSpeed<-.5};}

 function drawSpeedLimitSign(){const {x,y}=speedLimitSign;rect(x-3,y-53,6,54,'#778981');rect(x-2,y-52,2,53,'#c7cec3');rect(x-10,y,20,4,'#496355');ctx.beginPath();ctx.arc(x,y-68,23,0,Math.PI*2);ctx.fillStyle='#d9433d';ctx.fill();ctx.beginPath();ctx.arc(x,y-68,17,0,Math.PI*2);ctx.fillStyle='#fff7df';ctx.fill();text('50',x,y-61,20,'#273d3d','center');}

 function drawTrafficLight(){const {x,y}=trafficLight,phase=trafficLightPhase();rect(x-4,y-42,8,44,'#6e807a');rect(x-11,y-99,22,63,'#1d3236');rect(x-8,y-96,16,57,'#35494a');for(const [i,color,on]of [[0,'#f45450','red'],[1,'#ffda64','yellow'],[2,'#6ce899','green']]){rect(x-5,y-91+i*18,10,12,phase===on?color:'#202f32');if(phase===on)rect(x-8,y-94+i*18,16,18,color+'33');}rect(x-10,y,20,4,'#536e60');}
 function drawStopLine(){rect(68*T+5,trafficLight.stopY-3,4*T-10,5,'#fff4d3');text('СТОП',70*T,trafficLight.stopY-12,11,'#fff4d3','center');}
 function drawMotorRoad(){ctx.save();ctx.lineJoin='round';ctx.lineCap='round';for(const [width,color,dash] of [[134,'#d0cbb7',[]],[128,'#58656a',[]],[2,'#f1db96',[15,15]]]){ctx.lineWidth=width;ctx.strokeStyle=color;ctx.setLineDash(dash);for(const points of [motorLoop,motorAccess]){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x*T,y*T):ctx.moveTo(x*T,y*T));ctx.stroke();}}ctx.setLineDash([]);ctx.restore();}
 function startTowing(){trafficStop=null;driveSpeed=0;driving=false;bmwAvailable=false;bmwHazardTime=0;const c=Math.cos(bmw.angle),s=Math.sin(bmw.angle);let exit=null;for(const [dx,dy] of [[78,0],[-78,0],[0,95],[0,-95]]){const x=bmw.x+dx*c-dy*s,y=bmw.y+dx*s+dy*c;if(canStand(x,y)){exit={x,y};break;}}exit=exit||safeSavedPoint(bmw.x,bmw.y);Object.assign(player,{...exit,vx:0,vy:0});towScene={time:0,x:bmw.x,y:bmw.y,angle:bmw.angle};clearInput();save();}
 function updateTowing(dt){clearInput();player.vx=player.vy=0;towScene.time+=dt;if(towScene.time>=6){towScene=null;speech='BMW увезли. Дальше пешком!';speechTime=5;announce('Машина эвакуирована. Вернётся на парковку после перезагрузки игры.');save();}}

 function towPose(t){const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);},load=ease((t-2)),depart=Math.max(0,(t-3)/3),travel=570*depart*depart;return {truck:145+270*(1-ease(t/2))+travel,car:145*load+travel,load,moving:t<2||t>3,ramp:t<2?0:t<3?1:Math.max(0,1-(t-3)*3)};}
 function drawTowTruck(){if(!towScene)return;const t=towScene.time,p=towPose(t),angle=towScene.angle;
 ctx.save();ctx.translate(towScene.x,towScene.y);ctx.rotate(angle);ctx.translate(0,p.truck);
 rect(-37,-56,74,168,'#31453d55');for(const side of [-1,1])for(const axle of [-30,35,87])drawPixelTyre(side*34,axle,0,p.truck,10,22);
 const bob=reduced||!p.moving?0:Math.sin(p.truck*.14)*.7;ctx.save();ctx.translate(0,bob);
 rect(-32,-52,64,114,'#576c74');rect(-29,-49,58,108,'#98aaa8');for(let i=0;i<8;i++)rect(-26,-44+i*13,52,3,'#6d8287');for(const x of [-32,28]){rect(x,-51,4,113,'#d0d1b7');for(let i=0;i<7;i++)rect(x,-44+i*15,4,7,'#cba448');}
 if(p.ramp>0)for(const x of [-25,13]){rect(x,-52-58*p.ramp,12,58*p.ramp,'#8e9e99');for(let i=0;i<6*p.ramp;i++)rect(x,-55-i*9,12,3,'#506670');}
 if(t>=2&&t<3){line(0,53,0,p.car-p.truck+44,'#e6debe',2);rect(-9,48,18,8,'#34494d');for(let i=0;i<3;i++)rect(-6+i*5,49,2,6,'#b8c5b5');}
 rect(-31,64,62,43,'#db9637');rect(-28,65,56,5,'#f7c767');rect(-25,71,50,16,'#355b69');rect(-21,73,19,3,'#91bbc0');rect(4,73,16,2,'#91bbc0');rect(-1,71,2,16,'#d9a44e');rect(-29,90,58,17,'#e5ad48');rect(-22,105,44,5,'#455c63');rect(-28,110,56,5,'#c3c9ad');for(const x of [-27,19])rect(x,101,9,5,'#fff0b7');
 rect(-18,61,36,6,'#5e6360');for(const side of [-1,1]){const lit=reduced||(Math.floor(elapsed*7)%2===(side===1?1:0));rect(side*11-5,58,10,7,lit?'#ffe094':'#bd7f33');if(lit&&!reduced)rect(side*11-8,55,16,13,'#ffc65c33');}text('ЭВАКУАТОР',0,99,8,'#503f2c','center');ctx.restore();ctx.restore();
 const car={x:towScene.x-Math.sin(angle)*p.car,y:towScene.y+Math.cos(angle)*p.car,angle};drawBMW(car,true);if(t>=3){ctx.save();ctx.translate(car.x,car.y);ctx.rotate(angle);for(const y of [-28,31]){line(-29,y-5,29,y+5,'#e3ab4c',3);line(-29,y-5,29,y+5,'#ffe3a0',1);}ctx.restore();}
 mapLabel(t<2?'Едет эвакуатор…':t<3?'Лебёдка: погрузка BMW…':'Ну всё, приехали.',player.x,player.y-85,13,2);}


 // Test actual rotated body on both sides of an internal bay divider.
 function spansParkingDivider(){const c=Math.cos(bmw.angle),s=Math.sin(bmw.angle);const inBody=(x,y)=>{const dx=x-bmw.x,dy=y-bmw.y;return Math.abs(dx*c+dy*s)<25&&Math.abs(-dx*s+dy*c)<43;};for(let i=1;i<5;i++){const x=parking.x+9+i*80;for(let y=parking.y+8;y<parking.y+80;y+=2)if(inBody(x-6,y)&&inBody(x+6,y))return true;}return false;}
 function updateParkingViolation(dt){if(!bmwAvailable||towScene)return;const across=spansParkingDivider();if(!across){parkingStillTime=0;parkingFinedHere=false;return;}if(trafficStop||parkingFinedHere)return;if(Math.abs(driveSpeed)>1){parkingStillTime=0;return;}parkingStillTime+=dt;if(parkingStillTime>=2){parkingStillTime=0;parkingFinedHere=true;beginTrafficStop('parking');}}


 function makePatrolRoute(){const points=[];let distance=0,prev=bmw;for(let i=carTrail.length-1;i>=0;i--){const p=carTrail[i],d=Math.hypot(p.x-prev.x,p.y-prev.y);if(d>50)break;distance+=d;prev=p;if(distance>=100&&canDriveAt(p.x,p.y,p.angle))points.push({...p});if(distance>230)break;}if(points.length>=2)return points.reverse();const c=Math.cos(bmw.angle),sn=Math.sin(bmw.angle);for(let d=220;d>=95;d-=10){const p={x:bmw.x+sn*d,y:bmw.y-c*d,angle:bmw.angle};if(canDriveAt(p.x,p.y,p.angle))points.push(p);}return points.length?points:[{x:bmw.x+sn*100,y:bmw.y-c*100,angle:bmw.angle}];}
 function patrolPosition(){const f=trafficStop,route=f.patrol,u=Math.min(1,f.time/2.4),k=(u*u*(3-2*u))*(route.length-1),i=Math.floor(k),a=route[i],b=route[Math.min(i+1,route.length-1)],mix=k-i,da=Math.atan2(Math.sin(b.angle-a.angle),Math.cos(b.angle-a.angle));return {x:a.x+(b.x-a.x)*mix,y:a.y+(b.y-a.y)*mix,angle:a.angle+da*mix};}
 function drawPatrolCar(){const p=patrolPosition(),t=trafficStop.time;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);rect(-29,-43,62,94,'#263b3944');for(const side of [-1,1])for(const axle of [-24,30])drawPixelTyre(side*27,axle,0,t<2.4?t*65:156);rect(-25,-44,50,88,'#e4e6dc');rect(-24,-30,48,17,'#385b68');rect(-21,-26,19,3,'#8fb8ba');rect(-23,-10,46,22,'#f6f3df');rect(-25,13,50,14,'#365a69');rect(-21,15,19,3,'#91bdc5');rect(-25,29,50,12,'#e8e9de');rect(-25,-8,7,30,'#3772b3');rect(18,-8,7,30,'#3772b3');rect(-9,32,18,6,'#36464d');for(const x of [-23,15])rect(x,33,8,5,'#fff5b8');text('ДПС',0,-33,9,'#315d8e','center');rect(-18,-6,36,7,'#364752');const blue=reduced||Math.floor(t*6)%2===0;rect(-16,-5,14,5,blue?'#84d9ff':'#286a9c');rect(2,-5,14,5,!blue||reduced?'#ff8c85':'#ad4245');if(!reduced){rect(blue?-24:0,-11,24,17,blue?'#63c9ff35':'#ff6c6635');}ctx.restore();}
 let bathSparrows=[],sparrowCycle=-1;
 function updateBathSparrows(dt){
  const wt=weatherTime(),cycle=rainEventIndex();
  if(wt>=40&&wt<44&&sparrowCycle!==cycle){
   sparrowCycle=cycle;bathSparrows=[];
   if(nightLevel()<.5){const sites=[];const tx=Math.floor(player.x/T),ty=Math.floor(player.y/T);
    for(let y=Math.max(1,ty-9);y<Math.min(ROWS-1,ty+10);y++)for(let x=Math.max(1,tx-11);x<Math.min(COLS-1,tx+12);x++){const px=x*T+16,py=y*T+22,d=Math.hypot(px-player.x,py-player.y);if(d>115&&d<340&&puddleTile(x,y)&&canStand(px,py))sites.push({x:px,y:py,d});}
    sites.sort((a,b)=>a.d-b.d);const chosen=[];for(const p of sites){if(chosen.some(q=>Math.hypot(q.x-p.x,q.y-p.y)<110))continue;chosen.push(p);if(chosen.length===2)break;}
    chosen.forEach((p,group)=>{for(let i=0;i<3;i++)bathSparrows.push({x:p.x+(i-1)*11,y:p.y+(i%2)*5,homeX:p.x+(i-1)*11,homeY:p.y+(i%2)*5,phase:i*1.9+group,time:0,flight:0,dir:i%2?1:-1});});
    if(bathSparrows.length)rememberMessage('После дождя воробьи купаются в лужах. Подойдите тихонько — можно понаблюдать.','Подсказка');
   }
  }
  for(const b of bathSparrows){b.time+=dt;if(!b.flight&&(wt<40||wt>=44||puddleLevel()<=0||Math.hypot(player.x-b.x,player.y-b.y)<(driving?140:80)||(hornGlow>0&&Math.hypot(b.x-bmw.x,b.y-bmw.y)<250))){b.flight=.001;b.dir=b.x<player.x?-1:1;}
   if(b.flight){b.flight+=dt;if(!reduced){b.x=b.homeX+b.dir*b.flight*(90+b.phase*8);b.y=b.homeY-b.flight*100;}}
  }
  bathSparrows=bathSparrows.filter(b=>b.flight<(reduced?.8:2));
 }
 function drawBathSparrow(b){if(b.x<camX-25||b.x>camX+viewW+25||b.y<camY-25||b.y>camY+viewH+25)return;
  ctx.save();if(b.flight)ctx.globalAlpha=Math.max(0,1-b.flight/(reduced?.8:2));
  if(!b.flight){const u=reduced?.3:(b.time*2+b.phase)%1;ctx.strokeStyle='#d9eff1';ctx.lineWidth=1;ctx.globalAlpha=puddleLevel()*(1-u)*.8;ctx.beginPath();ctx.ellipse(b.homeX,b.homeY+2,5+u*9,2+u*3,0,0,Math.PI*2);ctx.stroke();if(!reduced)for(const side of [-1,1])rect(b.homeX+side*(4+u*8),b.homeY-Math.sin(u*Math.PI)*9,2,2,'#dcf0ed');ctx.globalAlpha=1;}
  ctx.translate(Math.round(b.x),Math.round(b.y));ctx.scale(b.dir,1);const dip=!reduced&&!b.flight&&Math.sin(b.time*7+b.phase)>.55?2:0;
  rect(-5,-5,9,6,'#8e6c4b');rect(-4,-7,6,4,'#624a39');rect(2,-9+dip,5,5,'#8a6246');rect(4,-8+dip,2,2,'#272c2d');rect(7,-6+dip,3,2,'#d5ad65');rect(-8,-3,4,2,'#554638');rect(-2,1,2,2,'#bc9063');rect(2,1,2,2,'#bc9063');rect(-3,-4,5,2,'#d2b58a');
  if(!reduced&&(b.flight||Math.sin(b.time*9+b.phase)>.1)){const flap=Math.sin(b.time*(b.flight?23:13)+b.phase)*4;rect(-6,-7-flap,5,3,'#b2956c');rect(-1,-7+flap,5,3,'#dbc4a0');}
  ctx.restore();
 }
 function puddleLevel(){const t=weatherTime();return t<30||t>=45?0:t<40?Math.min(1,(t-30)/3):(45-t)/5;}
 function puddleTile(x,y){return (x*37+y*61)%13===0&&path(x,y)&&!water(x,y)&&!buildingTile(x,y)&&!onMotorRoad(x*T,y*T);}
 function footInPuddle(){const x=Math.floor(player.x/T),y=Math.floor(player.y/T);const p=puddleShape(x,y);return !driving&&!cycling&&puddleLevel()>0&&puddleTile(x,y)&&((player.x-p.x)/p.rx)**2+((player.y-p.y)/p.ry)**2<1;}
 function drawFootSplash(){if(!footInPuddle()||Math.hypot(player.vx,player.vy)<15)return;const u=reduced?.4:(elapsed*4)%1,x=player.x,y=player.y;ctx.save();ctx.globalAlpha=(1-u)*puddleLevel();ctx.strokeStyle='#d5edf0';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,5+u*13,2+u*5,0,0,Math.PI*2);ctx.stroke();if(!reduced)for(const side of [-1,1])for(let i=0;i<3;i++)rect(x+side*(5+u*(10+i*3)),y-Math.sin(u*Math.PI)*(6+i*4),2,3,'#d5edf0');ctx.restore();}
 function drawPuddles(){const level=puddleLevel();if(!level)return;for(let y=Math.max(0,Math.floor(camY/T));y<Math.min(ROWS,Math.ceil((camY+viewH)/T));y++)for(let x=Math.max(0,Math.floor(camX/T));x<Math.min(COLS,Math.ceil((camX+viewW)/T));x++){const seed=x*37+y*61;if(!puddleTile(x,y))continue;const shape=puddleShape(x,y),{x:px,y:py,rx,ry}=shape;ctx.save();ctx.globalAlpha=level*.55;if(rx>13){ctx.fillStyle='#809ca1';ctx.beginPath();ctx.ellipse(px,py,rx,ry,0,0,Math.PI*2);ctx.fill();}rect(px-13,py-3,26,7,'#718d96');rect(px-9,py-6,17,12,'#88a8ae');rect(px-7,py-4,10,2,'#c9dace');drawPuddleScenery(shape);if(nightLevel()>0&&lamps.some(l=>Math.hypot(l.x-px,l.y-py)<240)){ctx.globalAlpha=level*nightLevel()*.65;for(let j=0;j<4;j++)rect(px-5+(reduced?0:Math.sin(elapsed*3+j)*2),py-4+j*3,10-j*2,1,'#ffe9a5');}if(weatherTime()<40&&!reduced){const u=(elapsed*1.8+seed*.1)%1;ctx.strokeStyle='#d1e7df';ctx.globalAlpha=level*(1-u)*.5;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(px,py,u*12,u*4,0,0,Math.PI*2);ctx.stroke();}ctx.restore();}}
 function drawStormBag(){const phase=weatherTime();if(!stormBag||phase<31||phase>=39||reduced)return;const t=phase-31,x=stormBag.x+t*95,y=stormBag.y+Math.sin(t*2)*24;ctx.save();ctx.translate(x,y);ctx.rotate(t*1.5);ctx.globalAlpha=Math.min(1,t,39-phase)*.65;rect(-7,-5,15,14,'#f1eed9');rect(-6,-10,4,7,'#e0e5d4');rect(4,-10,4,7,'#e0e5d4');rect(-2,-1,2,8,'#acb9a9');rect(3,3,4,1,'#bbc7b8');ctx.restore();}
 function lifeClear(x,y){return [[-8,-8],[8,-8],[-8,8],[8,8]].every(([dx,dy])=>!solidTile(Math.floor((x+dx)/T),Math.floor((y+dy)/T),true));}
 function lifePath(n,target,avoid=null,carObstacle=false){const sx=Math.floor(n.x/T),sy=Math.floor(n.y/T),gx=target[0],gy=target[1],key=(x,y)=>x+','+y,q=[[sx,sy]],prev=new Map([[key(sx,sy),null]]);for(let i=0;i<q.length;i++){const [x,y]=q[i];if(x===gx&&y===gy)break;for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(nx<8||nx>87||ny<8||ny>67||prev.has(k)||!lifeClear(nx*T+16,ny*T+16)||carObstacle&&storyCarBlocks(nx*T+16,ny*T+16)||avoid&&[0,.25,.5,.75,1].some(t=>Math.hypot((x+dx*t)*T+16-avoid.x,(y+dy*t)*T+16-avoid.y)<(avoid.radius||30)))continue;prev.set(k,key(x,y));q.push([nx,ny]);}}const end=key(gx,gy);if(!prev.has(end))return [];const result=[];for(let k=end;k;k=prev.get(k)){const [x,y]=k.split(',').map(Number);result.push(point([x,y]));}return result.reverse().slice(1);}
 function findShelter(n){const gazebo=extraSpots.find(p=>p.kind==='gazebo');const targets=n.kind==='cat'?benches.map(b=>[b.tx+1,b.ty+1]):[[gazebo.tx,gazebo.ty],[gazebo.tx-1,gazebo.ty],[gazebo.tx+1,gazebo.ty]];targets.sort((a,b)=>Math.hypot(a[0]*T+16-n.x,a[1]*T+16-n.y)-Math.hypot(b[0]*T+16-n.x,b[1]*T+16-n.y));for(const target of targets){if(!lifeClear(target[0]*T+16,target[1]*T+16))continue;if(lifePath(n,target).length)return target;}return null;}
 function updateCatVisit(n,dt,seek){if(n.kind!=='cat')return false;n.visitCooldown=Math.max(0,(n.visitCooldown||0)-dt);const calm=!driving&&!funScene&&!feedScene&&!towScene&&!trafficStop&&wheelTime===0&&swingTime===0&&karaokeTime===0&&Math.hypot(player.vx,player.vy)<5;const stop=()=>{n.visit=null;n.visitIdle=0;n.visitCooldown=30;n.path=[];n.wait=0;};if(n.visit&&(seek||!calm||Math.hypot(player.x-n.visit.px,player.y-n.visit.py)>8)){stop();return false;}if(seek||!calm||n.shelter||n.visitCooldown>0){n.visitIdle=0;return false;}if(!n.visit){if(Math.hypot(n.x-player.x,n.y-player.y)>105){n.visitIdle=0;return false;}n.visitIdle=(n.visitIdle||0)+dt;if(n.visitIdle<1.5)return false;const x=player.x+(n.x<player.x?-25:25),y=player.y+7;if(!lifeClear(x,y)){n.visitIdle=0;n.visitCooldown=10;return false;}n.visit={px:player.x,py:player.y,x,y,time:0,arrived:false};n.path=[];}const v=n.visit;if(v.arrived){v.time+=dt;n.face=v.px>n.x?1:-1;if(v.time>=3){stop();return false;}return true;}const dx=v.x-n.x,dy=v.y-n.y,d=Math.hypot(dx,dy);if(d<2){v.arrived=true;n.wait=0;return true;}const step=Math.min(d,42*dt),x=n.x+dx/d*step,y=n.y+dy/d*step,c=Math.cos(bmw.angle),sn=Math.sin(bmw.angle),bx=x-bmw.x,by=y-bmw.y;if(!lifeClear(x,y)||bmwAvailable&&Math.abs(bx*c+by*sn)<43&&Math.abs(-bx*sn+by*c)<62){stop();return false;}n.x=x;n.y=y;n.moving=true;n.stride+=dt*9;if(Math.abs(dx)>.1)n.face=Math.sign(dx);return true;}
 function runnerDetour(n,dt){if(n.kind!=='runner')return;n.detourCooldown=Math.max(0,(n.detourCooldown||0)-dt);if(n.detourCooldown>0||!n.path.length||Math.hypot(n.x-player.x,n.y-player.y)>90)return;const next=n.path[0],dx=next.x-n.x,dy=next.y-n.y;if(dx*(player.x-n.x)+dy*(player.y-n.y)<=0)return;n.detourCooldown=1.5;const end=n.path[n.path.length-1],route=lifePath(n,[Math.floor(end.x/T),Math.floor(end.y/T)],player);if(route.length)n.path=route;}
 function updateParkLife(dt){if(!stormBag&&weatherTime()>=31&&weatherTime()<39)stormBag={x:player.x-300,y:player.y-90};if(!wanderers.length){const specs=[{kind:'cat',route:[[27,54],[27,60],[35,60],[35,54]],color:'#d5a265'},{kind:'cat',route:[[80,27],[85,28],[85,36],[80,33]],color:'#849596'},{kind:'runner',avatar:9,route:[[10,26],[10,12],[85,12],[85,28]],color:'#de846c'},{kind:'runner',avatar:5,route:[[85,56],[85,66],[27,66],[27,55]],color:'#63a9ba'}];for(const n of specs){const p=point(n.route[0]);if(!lifeClear(p.x,p.y))continue;wanderers.push({...n,...p,goal:1,path:[],wait:0,stride:0,moving:false,face:1});}}
 for(const n of wanderers){if(umbrellaShake?.cat===n){n.moving=false;continue;}if(bikeCourtesy.has(n))continue;n.moving=false;if(auroraLevel()>.25&&n.kind==='runner')continue;if(wheelLightShow&&n.kind==='runner'&&Math.hypot(n.x-wheel.x,n.y-wheel.y)<250){n.face=wheel.x>n.x?1:-1;continue;}const seek=snowing()||weatherTime()>=25&&weatherTime()<40;const waterNearby=lawnSprinklers.some(p=>lawnWaterLevel(p)>.1&&Math.hypot(n.x-p.x,n.y-p.y)<130);if(updateCatBubble(n,dt,seek||waterNearby))continue;if(updateCatVisit(n,dt,seek||waterNearby))continue;if(seek&&!n.shelter){n.shelter=findShelter(n);n.path=n.shelter?lifePath(n,n.shelter):[];n.wait=0;}if(!seek&&n.shelter){n.shelter=null;n.path=[];n.wait=0;}if(n.shelter&&Math.hypot(n.x-(n.shelter[0]*T+16),n.y-(n.shelter[1]*T+16))<3){n.sheltered=true;continue;}n.sheltered=false;if(n.wait>0){n.wait-=dt;continue;}if(!n.path.length){n.path=lifePath(n,n.shelter||n.route[n.goal]);if(!n.shelter)n.goal=(n.goal+1)%n.route.length;if(!n.path.length){n.wait=2;continue;}}rerouteSprinklerCat(n);runnerDetour(n,dt);const target=n.path[0],dx=target.x-n.x,dy=target.y-n.y,d=Math.hypot(dx,dy),speed=n.shelter?(n.kind==='cat'?110:190):n.kind==='cat'?25:80,step=Math.min(d,speed*dt);if(d<.5){n.path.shift();if(!n.path.length)n.wait=n.kind==='cat'?2.5: .3;continue;}const x=n.x+dx/d*step,y=n.y+dy/d*step,c=Math.cos(bmw.angle),sn=Math.sin(bmw.angle),bx=x-bmw.x,by=y-bmw.y;if(!lifeClear(x,y)){n.path=[];n.wait=2;continue;}if(n.kind==='cat'&&lawnSprinklers.some(p=>lawnWaterLevel(p)>.1&&Math.hypot(x-p.x,y-p.y)<50&&Math.hypot(x-p.x,y-p.y)<Math.hypot(n.x-p.x,n.y-p.y)))continue;if(Math.hypot(x-player.x,y-player.y)<23||bmwAvailable&&Math.abs(bx*c+by*sn)<43&&Math.abs(-bx*sn+by*c)<62)continue;n.x=x;n.y=y;n.moving=true;n.stride+=dt*(n.kind==='cat'?8:13);if(Math.abs(dx)>.1)n.face=Math.sign(dx);}}
 function drawWanderer(n){const cuddle=n.visit?.arrived;ctx.save();ctx.translate(n.x+(cuddle&&!reduced?Math.sin(n.visit.time*5)*2:0),n.y);ctx.scale(n.face,1);const stride=reduced||!n.moving?0:Math.sin(n.stride)*4;if(n.kind==='cat'){if(n.sheltered)ctx.scale(1,.65);rect(-12,0,25,4,'#365c3b44');rect(-10,-13,22,11,n.color);for(const x of [-8,7])rect(x,-4+(x<0?stride:-stride)*.4,4,7,n.color);rect(6,-22,13,13,n.color);rect(7,-26,4,7,n.color);rect(15,-26,4,7,n.color);rect(14,-18,2,cuddle?1:2,'#203c35');rect(18,-14,3,2,'#d89488');rect(-16,-18+(reduced?0:Math.sin(elapsed*3)*2),5,13,n.color);rect(-14,-8,7,4,n.color);if(n.bubblePaw>0&&!reduced){const lift=Math.sin(n.bubblePaw/.65*Math.PI)*13;rect(14,-8-lift,6,5,n.color);rect(18,-10-lift,4,4,'#e6dbbc');}}else{drawNpcBody({...n,quiet:true,moving:photoGreeting(n)?false:n.moving},npcAppearance(n),{waving:photoGreeting(n)});}ctx.restore();if(cuddle){text('♥',n.x,n.y-35,12,'#f4a2a4','center');mapLabel('Мур-р-р…',n.x,n.y-54,12,1);}}

 function beginTrafficStop(reason='speeding'){npcMemory.calmDrive=0;if(reason==='speeding')speedingViolations++;else if(reason==='red')redLightViolations++;else if(reason==='parking')parkingViolations++;brakeGlow=2;const side=bmw.x<W/2?1:-1;trafficStop={time:0,fined:false,reason,repeat:reason==='parking'?parkingViolations>=2:reason==='red'?redLightViolations>=2:speedingViolations>=2,speed:Math.round(Math.abs(driveSpeed)*.22),startX:bmw.x+side*115,targetX:bmw.x+side*50,x:bmw.x+side*115,y:bmw.y-4};if(reason==='speeding')trafficStop.patrol=makePatrolRoute();driveSpeed=0;clearInput();bmwHazardTime=1.8;announce(reason==='speeding'?'Черный BMW, прижимаемся вправо, останавливаемся':'Водитель BMW, остановитесь!',{urgent:true});save();}
 function updateTrafficStop(dt){driveSpeed=0;clearInput();const officer=trafficStop;officer.time+=dt;const walkTime=Math.max(0,officer.time-(officer.patrol?2.8:0));if(officer.patrol){const car=patrolPosition();officer.startX=car.x+40;officer.x=officer.startX+(officer.targetX-officer.startX)*Math.min(1,walkTime/1.4);officer.y=car.y+(bmw.y-4-car.y)*Math.min(1,walkTime/1.4);}else officer.x=officer.startX+(officer.targetX-officer.startX)*Math.min(1,walkTime/1.4);if(walkTime>=1.4&&!officer.fined){officer.fined=true;recordFine(officer.reason);if(officer.reason==='parking'){$('activity-title').textContent=officer.repeat?'Парковка на двух местах — 30 рублей и эвакуация':'Парковка на двух местах — штраф 15 рублей';$('activity-copy').textContent=officer.repeat?'Гаишник: «Снова два места на одну машину? 30 рублей. Эвакуатор припаркует аккуратнее!» BMW будет недоступна до перезагрузки игры.':'Гаишник: «Одна BMW — одно место! Штраф 15 рублей. Перепаркуйтесь: за повторное нарушение — 30 рублей и эвакуация.»';showTrafficDialogue(officer);activity.showModal();return;}if(officer.reason==='red'){ $('activity-title').textContent=officer.repeat?'Повторный проезд на красный — эвакуация':'Проезд на красный — штраф 200 рублей';$('activity-copy').textContent=officer.repeat?'Гаишник: «Снова проехали на красный? Штраф — 200 рублей. Вызываем эвакуатор!» BMW будет недоступна до перезагрузки игры.':'Гаишник: «Вы проехали стоп-линию на красный. Штраф — 200 рублей. Предупреждение: перед выездом из парка дождитесь зелёного сигнала! За повторный проезд на красный — эвакуация.»';showTrafficDialogue(officer);activity.showModal();return;}$('activity-title').textContent=officer.repeat?'Повторное нарушение — эвакуация':'Штраф — 100 рублей';$('activity-copy').textContent=officer.repeat?'Гаишник: «Снова 70 км/ч? Штраф — 100 рублей. Вызываем эвакуатор!» BMW будет недоступна до перезагрузки игры.':`Гаишник: «Разогнались до ${officer.speed} км/ч? Здесь парк, а не гоночная трасса! Штраф — 100 рублей».`;showTrafficDialogue(officer);activity.showModal();}}
 function drawTrafficOfficer(officer=trafficStop){if(officer.patrol&&officer.time<2.8)return;const {x,y}=officer,stride=reduced||officer.fined?0:Math.sin(officer.time*14)*2;rect(x-11,y+1,24,4,'#365c3b55');rect(x-7,y-10+stride,5,12,'#263d52');rect(x+2,y-10-stride,5,12,'#263d52');rect(x-11,y-29,22,19,'#46667a');rect(x-10,y-25,20,4,'#c9df83');rect(x-14,y-26,4,15,'#46667a');rect(x+10,y-26,4,15,'#46667a');rect(x-8,y-43,16,15,'#efbf96');rect(x-12,y-46,24,5,'#263d52');rect(x-9,y-51,18,7,'#46667a');rect(x-2,y-48,4,4,'#e5cd73');rect(x-5,y-38,2,2,'#243c43');rect(x+3,y-38,2,2,'#243c43');rect(x+14,y-27,4,22,'#f4f1d8');for(let i=0;i<3;i++)rect(x+14,y-25+i*7,4,3,'#293640');if(officer.fined)rect(x-22,y-23,10,13,'#fff0d1');}
 function updateBMW(dt){if(!bmwAvailable)return;bmwHazardTime=Math.max(0,bmwHazardTime-dt);const distance=Math.hypot(player.x-bmw.x,player.y-bmw.y);if(!bmwNearby&&distance<100){bmwNearby=true;bmwHazardTime=1.8;}else if(bmwNearby&&distance>145)bmwNearby=false;}

 function windshieldPoint(){return {x:bmw.x-Math.sin(bmw.angle)*21,y:bmw.y+Math.cos(bmw.angle)*21};}
 function inGolfThrowZone(x,y){return Math.abs(x-golf.x)<=55&&y>=parking.y+108&&y<=parking.y+186;}
 function updateNutAttack(dt){nutImpact=Math.max(0,nutImpact-dt);if(towScene||!bmwAvailable){nutAttack=null;return;}if(!nutAttack){if(!windshieldBroken&&driving&&!trafficStop&&Math.abs(driveSpeed)>18&&inGolfThrowZone(bmw.x,bmw.y))nutAttack={time:0,x:golf.x+5,y:golf.y-3};return;}nutAttack.time+=dt;if(nutAttack.time>=.85){windshieldBroken=true;nutAttack=null;nutImpact=.45;announce('Хрясь! Белка: «Ореховое КАСКО не оформляли?»');save();}}
 function drawNutAttack(){if(nutAttack){const u=Math.max(0,Math.min(1,(nutAttack.time-.25)/.6)),p=windshieldPoint(),x=nutAttack.x+(p.x-nutAttack.x)*u,y=nutAttack.y+(p.y-nutAttack.y)*u-Math.sin(u*Math.PI)*45;rect(x-4,y-4,8,8,'#87582d');rect(x-2,y-3,4,6,'#d6a465');rect(x,y-3,1,6,'#ad7540');}if(nutImpact>0){const p=windshieldPoint();text('ХРЯСЬ!',p.x,p.y-48,16,'#fff0c5','center');}}
 function wiperSweep(){return driving&&(rainIntensity()>0||snowing())?(reduced?.5:(1-Math.cos(elapsed*7))*.5):0;}
 function drawWipers(){const u=wiperSweep();for(const x of [-12,7]){const a=-Math.PI+u*Math.PI*.85,ex=x+Math.cos(a)*11,ey=27+Math.sin(a)*11;line(x,27,ex,ey,'#b7c4c3',1);line(ex-3,ey,ex+4,ey-1,'#172b30',2);}}
 function drawWindshieldCrack(){if(!windshieldBroken)return;ctx.strokeStyle='#d9f3ef';ctx.lineWidth=1.3;for(const pts of [[[1,21],[-7,18],[-20,15]],[[1,21],[-9,23],[-18,27]],[[1,21],[10,19],[21,16]],[[1,21],[9,25],[19,28]],[[1,21],[3,15]],[[1,21],[-1,28]],[[-7,18],[-9,15]],[[10,19],[14,23]],[[9,25],[7,28]]]){ctx.beginPath();ctx.moveTo(...pts[0]);for(const p of pts.slice(1))ctx.lineTo(...p);ctx.stroke();}rect(-1,20,4,3,'#f4fffa');}


 function brotherInCarPath(){if(Math.abs(driveSpeed)<1)return false;const c=Math.cos(bmw.angle),s=Math.sin(bmw.angle),dx=brother.x-bmw.x,dy=brother.y-bmw.y,side=dx*c+dy*s,ahead=(-dx*s+dy*c)*Math.sign(driveSpeed);return Math.abs(side)<45&&ahead>0&&ahead<78+Math.abs(driveSpeed)*.12;}
 function thirdBayOccupied(){if(!bmwAvailable)return false;const w=Math.abs(Math.cos(bmw.angle))*27+Math.abs(Math.sin(bmw.angle))*46,h=Math.abs(Math.sin(bmw.angle))*27+Math.abs(Math.cos(bmw.angle))*46;return bmw.x+w>parking.x+148&&bmw.x-w<parking.x+268&&bmw.y+h>parking.y-12&&bmw.y-h<parking.y+110;}
 function updateBrotherEscape(dt){brotherShout=Math.max(0,brotherShout-dt);emergencyBrake=Math.max(0,emergencyBrake-dt);if(!brotherEscape)return;const f=brotherEscape;if(f.state==='wait'&&!thirdBayOccupied()){f.state='return';f.route=[{x:brotherHome.x,y:parking.y+12},{...brotherHome}];}f.moving=false;if(!f.route.length){if(f.state==='return'){Object.assign(brother,brotherHome);brotherEscape=null;}else f.state='wait';return;}const target=f.route[0],dx=target.x-brother.x,dy=target.y-brother.y,d=Math.hypot(dx,dy),step=Math.min(d,(f.state==='return'?85:165)*dt);if(d<1){f.route.shift();return;}const x=brother.x+dx/d*step,y=brother.y+dy/d*step,ownX=Math.floor(brother.x/T),ownY=Math.floor(brother.y/T);const clear=[[-9,-9],[9,-9],[-9,9],[9,9]].every(([a,b])=>{const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);return tx===ownX&&ty===ownY||!solidTile(tx,ty,true);});const c=Math.cos(bmw.angle),s=Math.sin(bmw.angle),bx=x-bmw.x,by=y-bmw.y;if(!clear||bmwAvailable&&Math.abs(bx*c+by*s)<40&&Math.abs(-bx*s+by*c)<59||Math.hypot(player.x-x,player.y-y)<20)return;brother.x=x;brother.y=y;f.moving=true;}


 function vehiclePoint(pose,x,y){const c=Math.cos(pose.angle),sn=Math.sin(pose.angle);return {x:pose.x+x*c-y*sn,y:pose.y+x*sn+y*c};}
 function ageVehicleEffects(dt){
  const wash=1+rainIntensity()*2;for(const mark of tyreMarks)mark.life-=dt*wash;tyreMarks=tyreMarks.filter(p=>p.life>0);
  for(const puff of exhaustPuffs){puff.age+=dt;puff.x+=puff.vx*dt;puff.y+=puff.vy*dt;}exhaustPuffs=exhaustPuffs.filter(p=>p.age<1.35);
  if(!driving||Math.abs(driveSpeed)<12||towScene||trafficStop||!bmwAvailable){skidPose=null;exhaustClock=0;}
 }
 function recordVehicleMotion(before,dt){
  const speed=Math.abs(driveSpeed),distance=Math.hypot(bmw.x-before.x,bmw.y-before.y),turn=Math.abs(bmw.angle-before.angle)/Math.max(dt,.001),wet=rainIntensity();
  if(!driving||distance<.01||towScene||trafficStop||!bmwAvailable)return;
  carWarmth=150;carWarmDistance=Math.min(1000,carWarmDistance+distance);recordSnowDrive(before);recordRoadSplash(dt);const skidding=speed>(wet>.2?110:135)&&Math.abs(steerValue)>.6&&turn>.7;
  if(skidding){if(!skidPose)skidPose=before;if(Math.hypot(bmw.x-skidPose.x,bmw.y-skidPose.y)>=4){for(const side of [-1,1]){const a=vehiclePoint(skidPose,side*28,-22),b=vehiclePoint(bmw,side*28,-22);if(driveSurface(a.x,a.y)&&driveSurface(b.x,b.y))tyreMarks.push({a,b,life:18});}skidPose={...bmw};const limit=comfort.lightweight?180:420;if(tyreMarks.length>limit)tyreMarks.splice(0,tyreMarks.length-limit);}}else skidPose=null;
  if(reduced||speed<12)return;exhaustClock+=dt;const interval=comfort.lightweight?.25:.14;
  if(exhaustClock>=interval){exhaustClock%=interval;const p=vehiclePoint(bmw,-17,-49),pulse=Math.sin(wheelTravel*.07);exhaustPuffs.push({...p,age:0,seed:wheelTravel,vx:Math.sin(bmw.angle)*16+3,vy:-Math.cos(bmw.angle)*16-6+pulse*2});const limit=comfort.lightweight?6:12;if(exhaustPuffs.length>limit)exhaustPuffs.shift();}
 }
 function drawTyreMarks(){ctx.save();ctx.strokeStyle='#293235';ctx.lineWidth=3;ctx.lineCap='butt';for(const mark of tyreMarks){if(Math.max(mark.a.x,mark.b.x)<camX||Math.min(mark.a.x,mark.b.x)>camX+viewW||Math.max(mark.a.y,mark.b.y)<camY||Math.min(mark.a.y,mark.b.y)>camY+viewH)continue;ctx.globalAlpha=.4*Math.min(1,mark.life/6);ctx.beginPath();ctx.moveTo(Math.round(mark.a.x),Math.round(mark.a.y));ctx.lineTo(Math.round(mark.b.x),Math.round(mark.b.y));ctx.stroke();}ctx.restore();}
 function drawExhaust(){if(reduced)return;ctx.save();for(const puff of exhaustPuffs){if(puff.x<camX-20||puff.x>camX+viewW+20||puff.y<camY-20||puff.y>camY+viewH+20)continue;const u=puff.age/1.35,size=3+Math.floor(u*6),wobble=Math.sin(puff.seed+puff.age*3)*2;ctx.globalAlpha=(1-u)*.21;rect(puff.x-size,puff.y-size,size*2,size*2,'#d0d2c6');ctx.globalAlpha=(1-u)*.12;rect(puff.x-size-2+wobble,puff.y-size+2,size*2+4,size,'#dce0d3');}ctx.restore();}
 function updateVehicleBody(dt){const acceleration=(driveSpeed-visualLastSpeed)/Math.max(dt,.001);visualLastSpeed=driveSpeed;const pitch=driving?Math.max(-1.8,Math.min(1.8,-acceleration/240)):0,roll=driving?steerValue*Math.min(1.7,Math.abs(driveSpeed)/150):0,f=1-Math.exp(-dt*10);carPitch+=(pitch-carPitch)*f;carRoll+=(roll-carRoll)*f;}
 function drawPixelTyre(x,y,angle,travel,w=8,h=20){ctx.save();ctx.translate(x,y);ctx.rotate(angle);rect(-w/2,-h/2,w,h,'#111d23');rect(-w/2+1,-h/2+2,2,h-4,'#47575f');const phase=reduced?0:((travel%6)+6)%6;for(let k=-1;k<6;k++){const y=-h/2+2+k*6+phase;if(y>=-h/2+2&&y<=h/2-2)rect(-w/2+1,y,w-2,2,'#83918e');}rect(-1,-3,2,6,'#b1bdb7');ctx.restore();}
 function drawBMWTyres(carried=false){for(const side of [-1,1])for(const axle of [-22,32])drawPixelTyre(side*28,axle,axle>0&&!carried?steerValue*.35:0,carried?0:wheelTravel);}
 function windowGleam(x,y,w,h,phase){const u=reduced?.45:((phase%1)+1)%1,b=Math.round(u*(w-10));rect(x+b,y+2,7,h-4,'#c8eeea38');rect(x+b+9,y+2,2,h-4,'#e5f8e72b');}


 function drawBMW(pose=bmw,carried=false){const lights=carried?{brake:false,reverse:false}:bmwLightState();ctx.save();ctx.translate(pose.x,pose.y);ctx.rotate(pose.angle);const x=0,y=0;const flash=bmwHazardTime>0&&(reduced||Math.floor((1.8-bmwHazardTime)/.3)%2===0);rect(x-32,y-40,64,90,'#263b3955');drawBMWTyres(carried);if(flatTyre){rect(-34,27,13,10,'#17272c');rect(-33,35,12,3,'#0f1e22');}ctx.save();if(!reduced&&!carried)ctx.translate(carRoll,carPitch+(driving?Math.sin(wheelTravel*.22)*Math.min(.65,Math.abs(driveSpeed)/180):0));rect(x-21,y-50,9,5,'#84908d');rect(x-19,y-51,5,3,'#17272b');rect(x-27,y-42,54,89,'#18252b');rect(x-23,y-46,46,7,'#35444b');rect(x-25,y-39,50,20,'#304750');rect(x-18,y-35,31,3,'#5b727a');rect(x-23,y-16,46,28,'#1e2c32');rect(x-19,y-12,38,20,'#293940');rect(x-24,y-40,3,62,'#6b7679');rect(x+21,y-40,3,62,'#59666d');rect(x-25,y+14,50,15,'#354e59');rect(x-18,y+16,34,3,'#70868f');windowGleam(-23,15,44,13,wheelTravel/420+bmw.angle*.15);drawWindshieldCrack();if(!carried)drawWipers();rect(x-24,y+31,48,12,'#22323a');rect(x-29,y+10,6,7,'#4b5c64');rect(x+23,y+10,6,7,'#4b5c64');for(const dx of [-10,2]){rect(x+dx,y+33,9,10,'#b5c0c4');rect(x+dx+2,y+34,5,8,'#121e24');}for(const dx of [-23,14]){rect(x+dx,y+32,10,7,'#c5d8df');rect(x+dx+2,y+34,2,3,'#fff3cb');rect(x+dx+6,y+34,2,3,'#fff3cb');}rect(x-3,y+28,6,4,'#83afc6');rect(x-26,y+44,52,5,'#52616b');rect(x-9,y+44,18,4,'#e3e6dd');text('X5',x,y-24,8,'#d0d9db','center');for(const side of [-1,1]){rect(x+side*23-3,y-40,6,8,flash?'#ffc254':lights.brake?'#ff4545':'#a64e42');rect(x+side*15-3,y-42,6,5,lights.reverse?'#fffef1':'#566369');if(lights.brake)rect(x+side*23-5,y-44,10,14,'#ff343438');if(lights.reverse)rect(x+side*15-5,y-48,10,12,'#fffde333');rect(x+side*23-3,y+34,6,5,flash?'#ffc254':'#b39160');rect(x+side*27-2,y+12,4,3,flash?'#ffd273':'#7b817a');if(flash)rect(x+side*31-3,y+32,6,9,'#ffbf5544');}ctx.restore();ctx.restore();}
 function drawGolf(){const {x,y}=golf;rect(x-28,y-37,56,81,'#34474355');rect(x-28,y-26,7,17,'#26373c');rect(x+21,y-26,7,17,'#26373c');rect(x-28,y+20,7,17,'#26373c');rect(x+21,y+20,7,17,'#26373c');ctx.save();if(!reduced)ctx.translate(0,nutAttack?Math.sin(nutAttack.time*22)*Math.max(0,1-nutAttack.time)*1.1:Math.sin(elapsed*1.4)*.25);rect(x-23,y-39,46,80,'#a9b4bc');rect(x-19,y-43,38,7,'#c8d0d3');rect(x-20,y-33,40,17,'#3e5964');rect(x-17,y-13,34,24,'#c3cbd0');rect(x-21,y+12,42,15,'#38515c');rect(x-15,y+14,22,3,'#8eaab3');windowGleam(x-19,y+13,38,13,elapsed/14);rect(x-23,y+28,46,14,'#c8d0d3');rect(x-17,y+33,34,5,'#46565d');for(const cx of [x-17,x+12]){rect(cx,y+31,7,6,'#f7ebba');rect(cx+2,y+32,2,3,'#fff6d9');}rect(x-4,y+32,8,7,'#ced6d9');text('W',x,y+38,6,'#3a5b76','center');rect(x-9,y+40,18,4,'#f2eee0');rect(x-27,y+9,5,7,'#b8c2c7');rect(x+22,y+9,5,7,'#b8c2c7');rect(x-23,y-33,3,11,'#da6760');rect(x+20,y-33,3,11,'#da6760');text('GOLF',x,y-22,7,'#dce5e3','center');const bob=reduced?0:Math.sin(elapsed*3)*1.2,tail=reduced?0:Math.sin(elapsed*5)*2;ctx.save();ctx.translate(x,y+6+bob);ctx.scale(.7,.7);rect(-13+tail,-17,8,18,'#bf7237');rect(-17+tail,-21,11,12,'#de9452');rect(-5,-9,12,12,'#da8944');rect(0,-18,12,10,'#e9a660');rect(0,-22,3,6,'#bd7037');rect(7,-22,3,6,'#bd7037');rect(8,-15,2,2,'#263d36');rect(5,-7,5,4,'#f3c48b');if(nutAttack&&nutAttack.time<.25){rect(10,-18,4,12,'#e9a660');rect(10,-22,6,6,'#a77239');}ctx.restore();ctx.restore();}
 function drawSighGuest(person=sighGuest){const {x,y}=person;rect(x-12,y+1,25,4,'#365c3b55');rect(x-7,y-8,5,11,'#292f38');rect(x+2,y-8,5,11,'#292f38');rect(x-9,y+1,8,3,'#e8dfcd');rect(x+2,y+1,8,3,'#e8dfcd');rect(x-11,y-27,22,21,'#222831');rect(x-9,y-25,18,5,'#2d333a');rect(x-15,y-25,5,15,'#222831');rect(x-15,y-11,4,7,'#efbea4');rect(x+10,y-30,5,13,'#242b34');rect(x+13,y-39,4,13,'#efbea4');rect(x+8,y-42,8,4,'#efbea4');rect(x+10,y-29,5,2,'#d2b575');rect(x-9,y-44,18,19,'#f0c3a8');rect(x-10,y-47,20,9,'#493b34');rect(x-10,y-41,3,10,'#493b34');rect(x+7,y-41,3,9,'#493b34');rect(x-12,y-50,9,8,'#41362e');rect(x-8,y-48,13,3,'#665044');rect(x-6,y-38,5,1,'#785044');rect(x+2,y-38,5,1,'#785044');rect(x-5,y-36,3,2,'#695b48');rect(x+3,y-36,3,2,'#695b48');rect(x-1,y-34,2,4,'#dda98c');rect(x-4,y-28,8,2,'#cb807c');rect(x-5,y-25,10,2,'#e3b096');}
 function drawBrother(person=brother){ctx.save();ctx.translate(person.x,person.y);ctx.scale(.76,.86);const x=0,y=0,stride=brotherEscape?.moving&&!reduced?Math.sin(elapsed*19)*4:0;rect(x-12,y+1,25,4,'#365c3b55');rect(x-8,y-9+stride,6,11,'#34495c');rect(x+2,y-9-stride,6,11,'#34495c');rect(x-9,y+1+stride,8,3,'#e3e6d5');rect(x+2,y+1-stride,8,3,'#e3e6d5');rect(x-12,y-29,24,21,'#1d2937');rect(x-16,y-28,5,13,'#263340');rect(x+11,y-28,5,13,'#263340');rect(x-16,y-16,5,9,'#edba94');rect(x+11,y-16,5,9,'#edba94');rect(x-9,y-45,18,18,'#edba94');rect(x-10,y-49,20,9,'#594b3b');rect(x-8,y-52,16,6,'#514638');rect(x-9,y-42,3,6,'#675642');rect(x+6,y-42,3,6,'#675642');rect(x-5,y-38,3,2,'#668989');rect(x+3,y-38,3,2,'#668989');rect(x-7,y-31,14,3,'#b19177');rect(x-3,y-32,6,2,'#e3b18c');rect(x-5,y-27,4,5,'#344451');rect(x+1,y-27,4,5,'#344451');rect(x,y-23,1,11,'#4b5864');rect(x+1,y-19,2,2,'#aeb5ad');ctx.restore();}
 function draw(renderTarget=canvas){labelQueue=[];updateCanopyObject();const scale=renderTarget.height/viewH;ctx.setTransform(scale,0,0,scale,0,0);ctx.imageSmoothingEnabled=false;viewW=renderTarget.width/scale;camX=Math.max(0,Math.min(W-viewW,player.x+cameraLeadX-viewW/2));camY=Math.max(0,Math.min(H-viewH,player.y+cameraLeadY-(wheelTime>0?100:funScene?.kind==='cinema'?65:0)-viewH/2+30));if(photoMode&&capturingPhoto){camX=Math.max(0,Math.min(W-viewW,photoMode.x-viewW/2));camY=Math.max(0,Math.min(H-viewH,photoMode.y-viewH/2));}ctx.save();ctx.translate(-Math.round(camX),-Math.round(camY));const palette=seasonPalette();rect(0,0,W,H,palette.grass);
  const startX=Math.max(0,Math.floor(camX/T)),endX=Math.min(COLS,Math.ceil((camX+viewW)/T)),startY=Math.max(0,Math.floor(camY/T)-1),endY=Math.min(ROWS,Math.ceil((camY+viewH)/T)+2);
  for(let y=startY;y<endY;y++)for(let x=startX;x<endX;x++){const px=x*T,py=y*T,n=(x*37+y*61)%17;if(!inside(x,y)){rect(px,py,T,T,'#a8afa0');continue;}if(path(x,y)){rect(px,py,T,T,'#d4b776');if(n%3===0)rect(px+8,py+19,4,2,'#b59b64');}else{if(n<5){const bend=reduced?0:Math.sin(elapsed*2+x*.3+y*.2)*windGust();line(px+10,py+21,px+9+bend,py+16,palette.grassDark,2);line(px+13,py+19,px+12+bend,py+13,palette.grassLight,2);}if(x>29&&x<44&&y>6&&y<9){rect(px+10,py+12,3,9,'#38734a');rect(px+7,py+9,9,5,n%2?'#f8d876':'#e58cac');}}if(water(x,y)){rect(px,py,32,32,'#386f91');if(bridge(x,y)){rect(px,py+2,32,28,'#986a48');rect(px,py+3,32,3,'#e0b078');rect(px,py+26,32,3,'#e0b078');rect(px+2,py+7,2,17,'#684b37');}else{const wave=reduced?0:Math.sin(elapsed*2+x)*3;rect(px+7+wave,py+10,13,2,'#69acc0');rect(px+18-wave,py+25,7,2,'#538fab');const drift=reduced?0:(elapsed*7+x*5+y*3)%18;rect(px+4+drift,py+17,6,1,'#a5d8dc');}}}
  drawSeasonGround(startX,endX,startY,endY);drawSpringGround(startX,endX,startY,endY);drawDuckFamily();drawLeafPiles();drawSidewalks();drawMotorRoad();drawRoute();drawParking();drawStopLine();drawWinterRoadDust();drawTyreMarks();drawWinterTracks();drawSunGround();drawPuddles();drawHeroReflection();drawPuddleRipples();drawDandelionMeadow();drawCatClues();drawWalkDiscoveries();drawRoadPuddles();drawWetPrints();drawBicycleTracks();drawStoneSkip();drawJanitorGround();drawHedgehogHome();drawCourierStation();drawLawnWater();drawDawnFlockShadows();drawRainStream();drawExpansionDecor();
  drawWheel();drawLamps();
  drawUpCore();
  drawPhotoZone();drawGardenDecor();drawFeedingGround();drawFairGround();

  drawFountain();
  for(const b of buildings){rect(b.tx*T,b.ty*T,b.w*T,b.h*T,b.color);rect(b.tx*T-6,b.ty*T-12,b.w*T+12,16,'#efdbad');snowCap(b.tx*T-6,b.ty*T-13,b.w*T+12,5);for(let i=0;i<b.w;i++)rect((b.tx+i)*T+8,b.ty*T+16,16,22,'#c4e0ce');}drawCafeWarmth();drawCinemaFrame();
  drawAttractions();
  for(const b of benches){rect(b.tx*T+2,b.ty*T+4,59,15,'#9c6540');rect(b.tx*T+2,b.ty*T+9,59,3,'#d69c60');rect(b.tx*T+5,b.ty*T+19,5,9,'#4a4b3a');rect(b.tx*T+52,b.ty*T+19,5,9,'#4a4b3a');snowCap(b.tx*T+2,b.ty*T+3,59,3);}
  drawRaceArch(route[0].x,route[0].y-22,'СТАРТ',false);
  drawRaceArch(exit.x,exit.y,'ФИНИШ',true);drawJubilee();

  for(let i=0;i<clues.length;i++){const c=clues[i];if(c.hidden){drawSecret(c,i);continue;}rect(c.x-3,c.y-3,6,17,'#76543a');rect(c.x-14,c.y-22,28,24,'#5a4939');rect(c.x-12,c.y-20,24,19,solved.has(i)?'#79b48b':'#ffe093');text(solved.has(i)?'✓':String(i+1),c.x,c.y-5,17,'#3b533f','center');}
  badges.forEach((b,i)=>drawSecret(b,i));
  drawWinterCache();drawExhaust();drawSnowPowder();
  const actors=trees.filter(t=>t.tx>=startX-1&&t.tx<=endX&&t.ty>=startY&&t.ty<=endY).map(t=>({y:t.ty*T+20,paint:()=>tree(t)}));if(!extras.guestRemoved){actors.push({y:drunkGuest.y,paint:drawDrunkGuest});if(guestEscort)for(const side of [-1,1])actors.push({y:guestEscort.guardY,paint:()=>drawGuard(side,guestEscort,drunkGuest)});}actors.push({y:speedLimitSign.y,paint:drawSpeedLimitSign});actors.push({y:trafficLight.y,paint:drawTrafficLight});actors.push(...fenceActors(),...parkSigns.map(p=>({y:p.y,paint:()=>drawAddressSign(p)})));actors.push({y:golf.y+40,paint:drawGolf});if(bmwAvailable&&!towScene)actors.push({y:bmw.y+47,paint:drawBMW});actors.push({y:brother.y,paint:drawBrother});actors.push({y:sighGuest.y,paint:drawSighGuest});actors.push({y:squirrelTree.y,paint:drawSquirrelTree});testers.forEach(n=>actors.push({y:n.y,paint:()=>drawTester(n)}));supporters.filter(n=>!groupPhotoMember(n)).forEach(n=>actors.push({y:n.y,paint:()=>drawSupporter(n)}));pets.filter(p=>!groupPhotoMember(p)).forEach(p=>actors.push({y:(p===errands[0].receiver&&(funScene?.kind==='fetch'||fetchReturn)?fetchDogPose().y:p.y)-4,paint:()=>drawLeafCat(p,()=>drawPet(p))}));[...pigeons,...tamePigeons].filter(p=>p.flight===0).forEach(p=>actors.push({y:p.homeY,paint:()=>drawPigeon(p)}));if(trafficStop)actors.push({y:trafficStop.y,paint:()=>drawTrafficOfficer()});else if(!towScene)actors.push({y:parkInspector.y,paint:()=>drawTrafficOfficer(parkInspector)});if(idleEscort)idleEscort.guards.forEach((p,i)=>actors.push({y:p.y,paint:()=>drawGuard(i===0?-1:1,idleEscort)}));if(feedScene){actors.push({y:feedScene.guardY,paint:()=>drawGuard(-1)});if(feedScene.repeat)actors.push({y:feedScene.guardY,paint:()=>drawGuard(1)});}extraSpots.forEach(p=>actors.push({y:p.y-8,paint:()=>drawExtra(p)}));actors.push({y:courier.y,paint:drawCourier},{y:hedgehog.y,paint:drawHedgehog},{y:hoodCatOnCar()?bmw.y+49:hoodCat.y,paint:drawHoodCat});if(!groupPhotoMember(goose))actors.push({y:goose.y,paint:drawGoose});if(cafeClerk)actors.push({y:cafeClerk.y,paint:drawCafeClerk});if(groupPhoto)for(const n of groupPhoto.cast)actors.push({y:n.y,paint:()=>drawGroupGuest(n)});actors.push({y:groupPhotoSite.y,paint:drawGroupPhotoDecor});actors.push({y:balloonOwner.y,paint:()=>drawSupporter(balloonOwner)});parkRides.forEach(p=>actors.push({y:p.y-32,paint:()=>drawParkRide(p)}));actors.push({y:snowmanSite.y,paint:drawSnowman});for(const n of snowVisitors)actors.push({y:n.y,paint:()=>drawSnowVisitor(n)});if(artSpectator)actors.push({y:artSpectator.y,paint:()=>drawCinemaGuest(artSpectator)});for(const n of cinemaGuests)actors.push({y:n.y,paint:()=>drawCinemaGuest(n)});actors.push({y:janitor.y,paint:drawJanitor});if(duckCrossing)for(let i=0;i<4;i++)actors.push({y:crossingDuckPose(i).y,paint:()=>drawCrossingDuck(i)});actors.push({y:bikeRack.y,paint:drawBikeRack});if(!cycling)actors.push({y:bike.y,paint:()=>drawBicycle(bike)});actors.push({y:player.y,paint:()=>{drawHero();drawFairCostume();drawTeaHands();drawDandelionHands();}});for(const n of jubileeGuests)actors.push({y:n.y,paint:()=>drawJubileeGuest(n)});for(const n of wheelShowGuests)actors.push({y:n.y,paint:()=>{ctx.save();ctx.globalAlpha=wheelShowLevel();drawCinemaGuest(n);ctx.restore();}});for(const guest of finishGuests())actors.push({y:guest.y,paint:()=>drawFinishGuest(guest)});for(const b of bathSparrows)actors.push({y:b.flight?H+100:b.y,paint:()=>drawBathSparrow(b)});for(const n of wanderers)actors.push({y:n.y,paint:()=>drawLeafCat(n,()=>drawWanderer(n))});if(trafficStop?.patrol)actors.push({y:patrolPosition().y+45,paint:drawPatrolCar});if(funScene?.kind==='fairAward')actors.push({y:fairSites[0].y-1,paint:drawFairPodium});actors.push({y:fairSites[0].y-30,paint:drawFairPeople});for(const n of bearAudience)actors.push({y:n.y,paint:()=>drawBearAudience(n)});actors.push({y:bearNut.phase==='carry'?player.y+1:bearNutSpot().y,paint:drawBearNut});for(const n of fairWatchers)actors.push({y:n.y,paint:()=>drawFairWatcher(n)});actors.push({y:songPerch.y,paint:drawSongPerch});actors.push({y:picnicSite.y,paint:drawPicnic});actors.push({y:seekCat.y-5,paint:drawSeekCat});for(const p of catHides)actors.push({y:p.y,paint:()=>drawCatHide(p)});for(const p of neighbourPairs)for(const n of p.cast)actors.push({y:n.y,paint:()=>drawSupporter(n)});actors.sort((a,b)=>a.y-b.y).forEach(a=>a.paint());
  for(const p of particles){ctx.globalAlpha=Math.max(0,p.life*2);rect(p.x,p.y,3,3,p.color);}ctx.globalAlpha=1;
  [...pigeons,...tamePigeons].filter(p=>p.flight>0).forEach(drawPigeon);drawCompressor();drawTreeDrips();drawLeaves();drawLeafFlurry();drawDawnMist();drawStormBag();drawLostBalloon();drawSwifts();drawGardenLife();drawSpringAir();drawKite();drawBubbles();drawDawnFlock();drawDandelionSeeds();
  drawCoin();drawFinishConfetti();drawFetchBall();drawDroppedBall();drawMagicPigeon();drawPaperPlane();drawRoadSpray();drawBicycleDrops();
  if(dizzyTime>0)for(let i=0;i<3;i++){const a=i*2.1+(reduced?0:elapsed*3);text('✦',player.x+Math.cos(a)*18,player.y-61+Math.sin(a)*5,11,'#ffe18a','center');}drawBird();drawLuckyPigeon();drawTowTruck();drawNutAttack();drawErrands();drawFunDecor();drawFishing();drawNewScenes();
  // Подписи поверх объектов мира: деревья и герой не перекрывают буквы.
  drawNeighbourLabels();
  if(residentRemark>0&&!blocked()&&!momentsBusy()&&speechTime<=0&&!encounterGreeting&&!weatherSpeaking())mapLabel('Да где же она',errands[1].giver.x,errands[1].giver.y-70,12,5);
  const greeting=encounterGreeting;if(greeting&&!idleEscort&&!blocked()&&!driving&&!funScene&&speechTime<=0)mapLabel(greeting.text,greeting.npc.x,greeting.npc.y-68,13,5);



  if(funScene?.kind==='fairAward')drawFairConfetti(funScene.time);drawBikeReply();drawBikeObstacle();drawFairCheer();const nearby=nearAttraction();if(nearby&&!observing&&!capturingPhoto&&!blocked()&&!driving&&!cycling&&!funScene){drawInteractionFocus(nearby);if(!ambientSceneBusy()&&!dawnFlock&&speechTime<=0&&!(nearby.kind==='fountain'&&fountainShowLevel()>.1)&&!(nearby.kind==='wheel'&&wheelShowLevel()>.1))mapLabel(interactionTag(nearby),nearby.x,nearby.y+(nearby.kind==='bear'?-110:['parkRide','fair'].includes(nearby.kind)?42:-62),11,3);}
  if(idleEscort&&!blocked())mapLabel(idleEscort.time<7?'Охрана: «Не играете — дайте другим поиграть!»':'Охрана: «Проветримся у ворот. И снова в игру!»',player.x,player.y-90,13,7);
  else if(idleWarning())mapLabel('Охрана: «Гражданин, вы гуляете или загружаетесь?» Двиньтесь · '+Math.max(1,Math.ceil(IDLE_SECONDS-inactiveTime))+' с',player.x,player.y-100,13,7);
  else if(trafficStop?.patrol&&!trafficStop.fined){const p=patrolPosition();mapLabel('Черный BMW, прижимаемся вправо, останавливаемся',p.x,p.y-90,13,6);}
  else if(speechTime<=0&&weatherTime()>=25&&weatherTime()<29.8&&!blocked())mapLabel('Низко летят, к дождю',player.x,player.y-100,13,5);
  else if(speechTime<=0&&weatherTime()>=30&&weatherTime()<34&&!blocked())mapLabel('Кажется дождь начинается',player.x,player.y-110,13,5);
  else if(brotherShout>0&&!blocked())mapLabel('Эй!!!',brother.x,brother.y-80,15,7);
  else if(wheelTime>0)mapLabel(`На колесе · ${Math.ceil(wheelTime)} с`,wheel.x,wheel.y-254,12,2);
  else if(swingTime>0)mapLabel(`На качелях · ${Math.ceil(swingTime)} с`,player.x,player.y-140,12,2);
  else if(karaokeTime>0)mapLabel(`♪ КАРАОКЕ · ${Math.ceil(karaokeTime)} ♪`,player.x,player.y-115,14,2);
  else if(funScene){if(funScene.kind==='paint')mapLabel('Одну минуточку посижу…',player.x,player.y-65,12,2);else if(speechTime>0&&['portrait','fetch','magic'].includes(funScene.kind)){const anchor=funScene.kind==='portrait'?artistSite:funScene.kind==='magic'?magicianSite:player;mapLabel(speech,anchor.x,anchor.y-(funScene.kind==='magic'?110:85),13,7);}}
  else if(feedScene)mapLabel(feedScene.repeat&&feedScene.escort?'Пройдёмте к выходу!':feedScene.fined?'Штраф — 50 рублей!':'Голуби клюют хлеб…',feedScene.escort?player.x:feedingSpot.x,feedScene.escort?player.y-85:feedingSpot.y-65,12,2);
  else if(petTime>0&&activePet)mapLabel(activePet===errands[0].receiver&&errandStates[0]===3?'Гав! Мой герой вернулся!':activePet.reply,activePet.x,activePet.y-76,13,2);
  else if(brotherRefusal>0&&!blocked())mapLabel(brotherReplies[brotherRequests-1],brother.x,brother.y-80,13,7);
  else if(speechTime>0)mapLabel(speech,speech==='Я тебя и так вижу!'?brother.x:player.x,(speech==='Я тебя и так вижу!'?brother.y:player.y)-86,13,7);
  else if(!nearby&&nearest>=0&&!blocked())mapLabel(clues[nearest].hidden?'E · ОСМОТРЕТЬ':'E · ИЗУЧИТЬ',clues[nearest].x,clues[nearest].y-68,12,2);ctx.restore();
  drawSunRays();drawRain();drawNight();drawAurora();drawCinemaLight();drawMeteorShower();drawEveningLights();drawKiteLights();drawDandelionLight();drawWheelLightShow();drawFountainShowGlow();drawFireflies();drawFireflyDance();drawRainbow();drawSnow();drawTelescopeView();
  if(funScene?.kind==='production')rect(0,0,viewW,viewH,reduced?'#c93e3415':'#c93e3435');
  if(!observing&&!capturingPhoto){if(!hideMiniMap()){const mx=viewW-117,my=65,mw=100,mh=75;rect(mx-5,my-5,mw+10,mh+10,'#203b34dd');rect(mx,my,mw,mh,'#9bafa0');ctx.fillStyle='#70954e';ctx.beginPath();boundary.forEach(([x,y],i)=>i?ctx.lineTo(mx+x/COLS*mw,my+y/ROWS*mh):ctx.moveTo(mx+x/COLS*mw,my+y/ROWS*mh));ctx.closePath();ctx.fill();ctx.strokeStyle='#58656a';ctx.lineWidth=3;for(const [a,b]of motorSegments){ctx.beginPath();ctx.moveTo(mx+a[0]/COLS*mw,my+a[1]/ROWS*mh);ctx.lineTo(mx+b[0]/COLS*mw,my+b[1]/ROWS*mh);ctx.stroke();}ctx.strokeStyle='#e0c78e';ctx.lineWidth=1;for(const [a,b]of roads){ctx.beginPath();ctx.moveTo(mx+(a[0]+.5)/COLS*mw,my+(a[1]+.5)/ROWS*mh);ctx.lineTo(mx+(b[0]+.5)/COLS*mw,my+(b[1]+.5)/ROWS*mh);ctx.stroke();}ctx.strokeStyle='#c3ecff';ctx.lineWidth=2;ctx.beginPath();route.forEach((r,i)=>i?ctx.lineTo(mx+r.x/W*mw,my+r.y/H*mh):ctx.moveTo(mx+r.x/W*mw,my+r.y/H*mh));ctx.stroke();rect(mx+exit.x/W*mw-2,my+exit.y/H*mh-2,5,5,'#fff');clues.forEach((c,i)=>{if(!c.hidden||discovered.has(i)||solved.has(i))rect(mx+c.x/W*mw-1,my+c.y/H*mh-1,3,3,solved.has(i)?'#aceab4':'#ffe093');});rect(mx+player.x/W*mw-2,my+player.y/H*mh-2,4,4,'#f24e52');}
  drawTrackedArrow();
  if(!idleEscort&&!trackedGoal()&&scanTime>0&&!blocked()&&(scanTarget<0||hintLevels[scanTarget]>=3)){const target=navigationPoint(scanTarget<0?exit:clues[scanTarget]);if(target){const dx=target.x-player.x,dy=target.y-player.y,a=Math.atan2(dy,dx);const sx=player.x-camX+Math.cos(a)*58,sy=player.y-camY-15+Math.sin(a)*58;ctx.save();ctx.translate(sx,sy);ctx.rotate(a);ctx.fillStyle='#fff3a5';ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-7,-6);ctx.lineTo(-7,6);ctx.closePath();ctx.fill();ctx.restore();}}
  }if(!capturingPhoto){updateUI();if(!observing)drawLabels();drawPhotoFrame();}
 }
 let touchLayoutMode=null;
 function updateUI(){canvas.parentElement?.classList.toggle('discovery-view',!!discoveryFocus()&&!melodyFocused());canvas.parentElement?.classList.toggle('melody-playing',melodyFocused());canvas.parentElement?.classList.toggle('duck-crossing',!!duckCrossing&&(driving||cycling)&&Math.hypot(player.x-duckCrossingSite.x,player.y-duckCrossingSite.y)<360);const layoutMode=driving+':'+comfort.controls;if(touchLayoutDirty||touchLayoutMode!==layoutMode){touchLayoutMode=layoutMode;resize();}canvas.parentElement?.classList.toggle('mobile-driving',compactDrivingHUD());canvas.parentElement?.classList.toggle('cinema-view',['bear','stoneSkip','groupPhoto','cinema','portrait','magic','telescope'].includes(funScene?.kind));canvas.parentElement?.classList.toggle('kite-flight',['kite','bear'].includes(funScene?.kind));captureMessages();updatePhotoUI();updateActivityProgress();$("observe-button").hidden=!restingBench||blocked();$("observe-return").hidden=!observing;$('result-button').hidden=!finished;$('rehide-badges').hidden=finished;$('scan-button').hidden=driving;$('joystick').setAttribute('aria-label',driving?'Руль: стик влево или вправо':'Стик движения');$('car-controls').hidden=!driving;$('horn-button').hidden=!driving;$('horn-button').textContent='H · Сигнал';$('horn-button').setAttribute('aria-label','Звуковой сигнал — H');$('horn-button').disabled=blocked()||hornCooldown>0;$('dash-button').hidden=driving;$('driving-hint').hidden=!driving;$('driving-hint').textContent=flatTyre?'Колесо спустило · E — выйти и подкачать':'W — газ · S — назад · Пробел — тормоз · H — сигнал';updateGoalCard();$('wanted-star').hidden=!trafficStop||trafficStop.fined;$('wanted-star').style.opacity=trafficStop&&!reduced?(Math.floor(trafficStop.time*3)%2?'.3':'1'):'1';$('sport-toggle').hidden=!driving;$('sport-toggle').disabled=blocked()||!!trafficStop||!!towScene;$('sport-toggle').textContent=sportMode?'R · Спорт: вкл':'R · Спорт: выкл · ≤50';$('sport-toggle').setAttribute('aria-pressed',String(sportMode));const nearby=nearAttraction(),nearExit=!finished&&nearFinish();$('progress').textContent=`${solved.size} / ${TOTAL} подсказок`;$('badge-count').textContent=`DEX ${collected.size} / 8`;$('timer').textContent=formatTime(elapsed);$('timer').title=seasonState().label;$('timer').setAttribute('aria-label','Время прогулки '+formatTime(elapsed)+'. '+seasonState().label);$('objective').textContent=finished?'Квест завершён · Свободная прогулка':readyToFinish()?'Всё выполнено → На финиш!':completionStatus().replace(/ · DEX \d+\/8/,'');$('dash-charge').textContent=dashCooldown>0?`Рывок: ${dashCooldown.toFixed(1)} с`:'Shift · Быстрый шаг';$('prompt').hidden=!!idleEscort||blocked()||pumpTime>0||!!towScene||karaokeTime>0||swingTime>0||wheelTime>0||!!feedScene||!!funScene||nearExit||(nearest<0&&!nearby);if(['bear','stoneSkip','groupPhoto','kite','cinema','portrait','magic'].includes(funScene?.kind)&&!blocked())$('prompt').hidden=false;$('interact-label').textContent=funScene?.kind==='bear'?'Закончить концерт':funScene?.kind==='stoneSkip'?'Продолжить прогулку':funScene?.kind==='groupPhoto'?'Отменить общий снимок':funScene?.kind==='magic'?'Закончить просмотр':funScene?.kind==='portrait'?'Встать · вернуться позже':funScene?.kind==='cinema'?'Встать и продолжить прогулку':funScene?.kind==='kite'?'Смотать леску':nearby?actionLabel(nearby):nearest>=0?clues[nearest].hidden?clues[nearest].action:`Вопрос ${nearest+1} из ${TOTAL}`:'Изучить подсказку';$('finish-panel').hidden=!!idleEscort||blocked()||finished||!nearExit;$('finish-race').disabled=!readyToFinish();$('finish-status').textContent=completionStatus()+'. '+remainingHint();$('scan-button').disabled=!!idleEscort||blocked()||scanCooldown>0;$('scan-button').textContent=scanCooldown>0?`Сканер ${Math.ceil(scanCooldown)} с`:'Q · Сканер';$('scan-button').setAttribute('data-compact-label',scanCooldown>0?Math.ceil(scanCooldown)+' с':'Подсказка');$('scan-button').setAttribute('aria-label',scanCooldown>0?'Поиск подсказки будет доступен через '+Math.ceil(scanCooldown)+' с':'Найти ближайшую подсказку');$('dash-button').disabled=!!idleEscort||blocked()||!!restingBench||dashCooldown>0;$('journal-button').disabled=!!idleEscort||!started||(finished&&!freeRoam);$('map-button').disabled=!!idleEscort||blocked();$('fullscreen-journal').disabled=!!idleEscort||blocked();$('announcement').hidden=noticeHidden()||noticeTime<=0;if(driving){$('objective').textContent='BMW X5 · '+Math.round(Math.abs(driveSpeed)*.22)+' км/ч';$('dash-charge').textContent='↑ Газ · ↓ Тормоз / назад · ← → Руль';$('prompt').hidden=blocked()||!!trafficStop;$('interact-label').textContent='Выйти из BMW';$('finish-panel').hidden=true;$('scan-button').disabled=true;$('dash-button').textContent='▥';}else $('dash-button').textContent='⇧';$('dash-charge').classList.toggle('ready-hint',!driving&&dashCooldown<=0);updateInteractionChoice(nearby);mobileHUD();updateBikeUI();}
 function clearSegment(a,b){const d=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(1,Math.ceil(d/8));for(let i=1;i<=steps;i++)if(!canStand(a.x+(b.x-a.x)*i/steps,a.y+(b.y-a.y)*i/steps))return false;return true;}

 function findNavigationRoute(goal){
  const sx=Math.floor(player.x/T),sy=Math.floor(player.y/T),starts=[];
  for(let y=sy-1;y<=sy+1;y++)for(let x=sx-1;x<=sx+1;x++){const p=point([x,y]);if(canStand(p.x,p.y)&&clearSegment(player,p))starts.push({...p,tx:x,ty:y});}
  starts.sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));
  if(!starts.length)return [];
  const start=starts[0],origin=start.ty*COLS+start.tx,reach=canStand(goal.x,goal.y)?25:65;
  const costs=new Float64Array(COLS*ROWS).fill(Infinity),previous=new Int32Array(COLS*ROWS).fill(-1),passable=new Uint8Array(COLS*ROWS),heap=[];
  const estimate=(x,y)=>Math.max(0,(Math.hypot((x+.5)*T-goal.x,(y+.5)*T-goal.y)-reach)/T);
  const push=node=>{let i=heap.length;heap.push(node);while(i){const parent=(i-1)>>1;if(heap[parent].f<=node.f)break;heap[i]=heap[parent];i=parent;}heap[i]=node;};
  const pop=()=>{const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let child=i*2+1;if(child+1<heap.length&&heap[child+1].f<heap[child].f)child++;if(heap[child].f>=last.f)break;heap[i]=heap[child];i=child;}heap[i]=last;}return first;};
  costs[origin]=0;push({id:origin,g:0,f:estimate(start.tx,start.ty)});let found=-1;
  while(heap.length){const current=pop(),k=current.id;if(current.g!==costs[k])continue;const x=k%COLS,y=Math.floor(k/COLS);if(Math.hypot((x+.5)*T-goal.x,(y+.5)*T-goal.y)<reach){found=k;break;}
   for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=COLS||ny>=ROWS)continue;const nk=ny*COLS+nx;
    // Collision is tile based: between adjacent tile centres, only these two tiles are touched.
    if(!passable[nk])passable[nk]=solidTile(nx,ny)?1:2;if(passable[nk]!==2)continue;
    const g=current.g+(path(nx,ny)?1:3);if(g>=costs[nk])continue;costs[nk]=g;previous[nk]=k;push({id:nk,g,f:g+estimate(nx,ny)});
   }
  }
  const route=[];for(let k=found;k>=0;k=previous[k])route.push(point([k%COLS,Math.floor(k/COLS)]));return route.reverse();
 }
 // Look ahead along the same walkable route instead of chasing each tile centre.
 function navigationPoint(goal){
  const distance=Math.hypot(goal.x-player.x,goal.y-player.y);
  if(distance<2)return null;
  if(distance<T*2&&canStand(goal.x,goal.y)&&clearSegment(player,goal))return goal;
  const key=Math.floor(goal.x/T)+','+Math.floor(goal.y/T),tile=Math.floor(player.x/T)+','+Math.floor(player.y/T);
  const ahead=()=>{
   const route=navCache.route;
   if(!route.length)return null;
   while(navCache.index<route.length-1&&Math.hypot(player.x-route[navCache.index].x,player.y-route[navCache.index].y)<14)navCache.index++;
   for(let i=Math.min(route.length-1,navCache.index+6);i>=navCache.index;i--){
    const next=route[i],d=Math.hypot(next.x-player.x,next.y-player.y);
    if(d<T*4&&clearSegment(player,next)){navCache.index=i;return d<10&&i===route.length-1?null:next;}
   }
   return undefined;
  };
  if(navCache?.key===key){
   if(!navCache.route.length&&navCache.tile===tile&&elapsed-navCache.time<1)return null;
   const next=ahead();if(next!==undefined&&navCache.route.length)return next;
  }
  navCache={key,tile,time:elapsed,route:findNavigationRoute(goal),index:0};
  return ahead()||null;
 }
 function drawTrackedArrow(){const goal=trackedGoal();if(idleEscort||!goal||blocked()||driving||activityProgress()||Math.hypot(goal.x-player.x,goal.y-player.y)<42)return;const target=navigationPoint(goal);if(!target)return;const dx=target.x-player.x,dy=target.y-player.y,a=Math.atan2(dy,dx),offset=Math.min(60,Math.max(24,Math.hypot(dx,dy)-12));ctx.save();ctx.translate(player.x-camX+Math.cos(a)*offset,player.y-camY-15+Math.sin(a)*offset);ctx.rotate(a);ctx.fillStyle='#ffe263';ctx.strokeStyle='#34503c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,-7);ctx.lineTo(-4,0);ctx.lineTo(-8,7);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
 function drawCompressor(){if(pumpTime<=0)return;const x=player.x+20,y=player.y;rect(x-9,y-13,22,15,'#d65d44');rect(x-5,y-17,13,5,'#364b48');rect(x+2,y-10,7,7,'#ebdcaa');line(x+6,y-6,x+6+Math.sin(elapsed*14)*3,y-9,'#334f45',1);ctx.strokeStyle='#283a36';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+12,y);ctx.quadraticCurveTo((x+bmw.x)/2,y+28,bmw.x-Math.cos(bmw.angle)*28-Math.sin(bmw.angle)*32,bmw.y-Math.sin(bmw.angle)*28+Math.cos(bmw.angle)*32);ctx.stroke();mapLabel('Подкачка · '+Math.ceil(pumpTime)+' с',player.x,player.y-85,13,7);}
 function afterRain(){const t=weatherTime();return t>=40&&t<48?Math.min(1,(t-40)*2,(48-t)/2):0;}
 function drawRainbow(){const a=afterRain()*(1-nightLevel());if(a<=0)return;ctx.save();ctx.globalAlpha=a*.35;ctx.lineWidth=4;['#ee727f','#efb26e','#efe49a','#9fca84','#7bbdc9','#a895c8'].forEach((c,i)=>{ctx.strokeStyle=c;ctx.beginPath();ctx.arc(viewW*.46,126,95-i*5,Math.PI,Math.PI*2);ctx.stroke();});ctx.restore();}
 function drawTreeDrips(){const a=afterRain();if(a<=0||reduced)return;ctx.save();ctx.globalAlpha=a*.65;for(const t of trees){const x=t.tx*T,y=t.ty*T;if(x<camX||x>camX+viewW||y<camY||y>camY+viewH||(t.tx+t.ty)%3)continue;const u=(elapsed*1.5+t.tx*.31+t.ty*.17)%1;rect(x+7+(t.tx%3)*6,y-7+u*35,2,3,'#c8e5df');}ctx.restore();}
 function drawEveningLights(){const level=nightLevel();if(level<=0)return;ctx.save();ctx.translate(-camX,-camY);const colors=['#ffe9a2','#f3b6a8','#a9dcd5'];const bulb=(x,y,color,seed=0)=>{if(x<camX-12||x>camX+viewW+12||y<camY-12||y>camY+viewH+12)return;ctx.globalAlpha=level*(reduced?.16:.14+.025*Math.sin(elapsed*.8+seed));rect(x-6,y-6,12,12,color);ctx.globalAlpha=level*.95;rect(x-2,y-2,4,4,color);rect(x-1,y-1,2,2,'#fff8df');};for(let i=0;i<24;i++){const a=i*Math.PI/12;bulb(wheel.x+Math.cos(a)*86,wheel.y-116+Math.sin(a)*86,colors[i%3],i);}for(let i=0;i<8;i++){const a=i*Math.PI/4+(reduced?Math.PI/2:wheelAngle);bulb(wheel.x+Math.cos(a)*86,wheel.y-102+Math.sin(a)*86,'#ffe9a2',i);}for(let i=0;i<6;i++)bulb(bearSite.x-52+i*21,bearSite.y-70,'#ffe3aa',i);const carousel=extraSpots.find(p=>p.kind==='carousel');for(let i=0;i<9;i++){const a=i*Math.PI/8;bulb(carousel.x+Math.cos(a)*60,carousel.y-91+Math.sin(a)*20,colors[i%3],i);}for(const p of parkRides){const y=p.y-32;if(p.id==='smallWheel'){const active=funScene?.kind==='parkRide'&&funScene.rideId===p.id,a=reduced?0:active?funScene.time*Math.PI/3:rideAmbientTime()*.22;for(let k=0;k<6;k++)bulb(p.x+Math.cos(a+k*Math.PI/3)*48,y-61+Math.sin(a+k*Math.PI/3)*48-14,colors[k%3],k);}else if(p.id==='bee')for(let k=0;k<9;k++)bulb(p.x-48+k*12,y-78,colors[k%3],k);else if(p.id==='boats')for(let k=0;k<9;k++)bulb(p.x-60+k*15,y-99,colors[k%3],k);}
 drawLampMoths(level);ctx.restore();}
 // Quiet corner brackets identify the exact selected object without revealing secrets.
 function interactionFocusBounds(a){
  if(!canMarkInteraction(a))return null;
  if(a.kind==='bike'||a.kind==='bikeStation')return {x:a.x-33,y:a.y-(a.kind==='bikeStation'?74:38),w:66,h:a.kind==='bikeStation'?94:48};if(a.kind==='drive'||a.kind==='pump'){const c=Math.abs(Math.cos(bmw.angle)),n=Math.abs(Math.sin(bmw.angle));return {x:a.x-43*c-60*n,y:a.y-43*n-60*c,w:86*c+120*n,h:86*n+120*c};}
  let w=40,h=58,dy=-53;
  if(a.type==='question'){w=a.hidden?50:36;h=a.hidden?40:43;dy=a.hidden?-30:-27;}
  else if(a.kind==='bear'){w=146;h=112;dy=-94;}
  else if(a.kind==='bench'){w=72;h=36;dy=-38;}
  else if(['cat','dog','letter','sweepLeaf'].includes(a.kind)||a.type==='errand'){w=40;h=40;dy=-35;}
  else if(a.type==='badge'){w=54;h=46;dy=-35;}
  else if(a.kind==='parkRide'){w=a.id==='chess'?70:100;h=a.id==='chess'?106:84;dy=-h;}
  else if(['wheel','carousel','swing','fountain'].includes(a.kind)){w=56;h=38;dy=-28;}
  return {x:a.x-w/2,y:a.y+dy,w,h};
 }
 function drawInteractionFocus(a){
  const b=interactionFocusBounds(a);if(!b)return;
  ctx.save();ctx.lineJoin='round';
  for(const [color,width] of [['#26473c99',5],['#fff0bd',2]]){
   ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();
   for(const [x,y,sx,sy] of [[b.x,b.y,1,1],[b.x+b.w,b.y,-1,1],[b.x,b.y+b.h,1,-1],[b.x+b.w,b.y+b.h,-1,-1]]){ctx.moveTo(x+sx*8,y);ctx.lineTo(x,y);ctx.lineTo(x,y+sy*8);}ctx.stroke();
  }
  ctx.restore();
 }
 function canMarkInteraction(a){return !!a&&(a.type!=='badge'||collected.has(a.id))&&(!a.hidden||discovered.has(a.type==='question'?a.id:clues.indexOf(a)));}
 // Lighten the already composed scene, keeping all foreground occlusion intact.
 let nightShadeCanvas=null,nightShadeContext=null;
 function nightFocusPoints(){
  const points=[],hero=heroCanopyBounds();
  if(hero)points.push({x:hero.x+hero.w/2,y:hero.y+hero.h/2,rx:30,ry:44,strength:1});
  else if(driving&&bmwAvailable&&!towScene)points.push({x:bmw.x,y:bmw.y,rx:62,ry:62,strength:.7});
  if(!driving&&!funScene){const n=nearSupporter(),d=n?Math.hypot(n.x-player.x,n.y-player.y):Infinity;if(n)points.push({x:n.x,y:n.y-24,rx:29,ry:41,strength:Math.min(1,Math.max(0,(100-d)/45))});}
  return points;
 }
 function drawNightShade(){
  if(!(viewW>0&&viewH>0))return;
  if(!nightShadeCanvas){nightShadeCanvas=document.createElement('canvas');nightShadeContext=nightShadeCanvas.getContext('2d');}
  const m=nightShadeContext;if(!m){rect(0,0,viewW,viewH,'#111a4e77');return;}
  const width=Math.ceil(viewW);if(nightShadeCanvas.width!==width||nightShadeCanvas.height!==viewH){nightShadeCanvas.width=width;nightShadeCanvas.height=viewH;}
  m.clearRect(0,0,width,viewH);m.save();m.globalAlpha=1;m.globalCompositeOperation='source-over';m.fillStyle='#111a4e77';m.fillRect(0,0,width,viewH);m.globalCompositeOperation='destination-out';
  for(const p of nightFocusPoints())for(const scale of [1.25,1,.75]){m.globalAlpha=p.strength*.14;m.beginPath();m.ellipse(Math.round(p.x-camX),Math.round(p.y-camY),p.rx*scale,p.ry*scale,0,0,Math.PI*2);m.fill();}
  m.restore();ctx.drawImage(nightShadeCanvas,0,0);
 }
 function drawNight(){
  const n=nightLevel();if(n<=0)return;ctx.save();
  // Warm twilight blends into the blue evening and returns during dawn.
  ctx.globalAlpha=Math.sin(n*Math.PI)*(reduced?.07:.13);rect(0,0,viewW,viewH,'#ffd494');
  ctx.globalAlpha=n;drawNightShade();
  for(const p of lamps){const x=p.x-camX,y=p.y-camY-55;if(x<-55||x>viewW+55||y<-70||y>viewH+30)continue;ctx.fillStyle='#ffe9a522';ctx.beginPath();ctx.ellipse(x,y+38,35,20,0,0,Math.PI*2);ctx.fill();rect(x-8,y-7,16,15,'#ffe9a518');rect(x-4,y-3,8,7,'#ffe9a5');}
  const mx=48,my=40;rect(mx-11,my-16,22,32,'#e9edce');rect(mx-16,my-10,32,20,'#e9edce');rect(mx+1,my-17,16,24,'#29395d');
  for(let i=0;i<12;i++){const x=(i*127+90)%viewW,y=15+(i*41)%90;ctx.globalAlpha=n*(reduced?.7:.5+Math.sin(elapsed*2+i)*.25);rect(x,y,2,2,'#f5edcf');}
  ctx.restore();drawVehicleHeadlights(n);
 }
 function drawVehicleHeadlights(level=nightLevel()){
  if(level<=0||!driving||!bmwAvailable||towScene)return;
  ctx.save();ctx.translate(bmw.x-camX,bmw.y-camY);ctx.rotate(bmw.angle);ctx.globalAlpha=level*(reduced?.75:1);
  const steps=comfort.lightweight?16:effectCount(24);
  for(const side of [-1,1]){const x=side*18;for(let row=0;row<steps;row++){const u=row/steps,y=42+Math.round(u*144),height=Math.ceil(144/steps),half=4+u*34;for(const band of [1,.78,.52]){ctx.globalAlpha=level*(reduced?.75:1)*.13*Math.pow(1-u,1.5)*(band===1?.45:.8);ctx.fillStyle='#ffeac0';const w=Math.max(2,Math.round(half*band));ctx.fillRect(x-w,y,w*2,height);}}ctx.globalAlpha=level*(reduced?.75:1);rect(x-8,31,16,13,'#ffedaa33');rect(x-4,34,8,5,'#fff7d8');rect(side*23-3,-40,6,8,bmwLightState().brake?'#ff5c52':'#c96c58');}
  ctx.restore();
 }
 function resize(){touchLayoutDirty=false;const r=canvas.getBoundingClientRect();viewCSSHeight=Math.max(1,r.height);const controlScale=Math.min(comfort.controls,Math.max(.8,(r.width-40)/(132+(driving?130:62))));for(const id of ['joystick','car-controls','dash-button'])$(id).style.transform='scale('+controlScale+')';const d=Math.min(devicePixelRatio||1,comfort.lightweight?1:2);const pixelWidth=Math.round(r.width*d),pixelHeight=Math.round(r.height*d);if(canvas.width!==pixelWidth)canvas.width=pixelWidth;if(canvas.height!==pixelHeight)canvas.height=pixelHeight;viewH=480;
  // Touch tools stay at the edge rather than following the desktop minimap's height.
  touchTools=mobileScreen()||r.width<=700;
  const top=touchTools?10:Math.round(r.height*145/viewH+12),compact=touchTools||r.height<525;
  $('explore-tools').style.top=top+'px';$('explore-tools').classList.toggle('compact',compact);
  canvas.parentElement?.classList.toggle('touch-tools',touchTools);
  canvas.parentElement?.classList.toggle('tools-row',touchTools&&r.width>r.height);
  shortViewport=r.height<400&&r.width>550;canvas.parentElement?.classList.toggle('short-landscape',shortViewport);
  const notice=$('announcement').parentElement;if(notice)notice.style.maxHeight=!touchTools&&compact?(top-22)+'px':'';
 }
 new ResizeObserver(resize).observe(canvas);
 let soundZoneTime=-1,soundZoneCache={discovery:ambientSceneBusy(),fountain:0,carousel:0,grove:0};
 function musicSoundFocused(){return !!(funScene&&(funScene.kind==='bear'||funScene.kind==='music'||funScene.kind==='fairAward'||funScene.kind==='fair'&&funScene.gameId==='music')||bearEncore||melodyFocused()||musicReplay||musicPulse.some(p=>p>0));}
 function soundZones(){
  const musicFocus=musicSoundFocused(),discovery=ambientSceneBusy();
  if(elapsed>=soundZoneTime&&elapsed-soundZoneTime<.25){soundZoneCache.musicFocus=musicFocus;soundZoneCache.discovery=discovery;return soundZoneCache;}soundZoneTime=elapsed;
  const falloff=(p,r)=>{const a=Math.max(0,1-Math.hypot(player.x-p.x,player.y-p.y)/r);return a*a*(3-2*a);},pan=x=>Math.max(-.8,Math.min(.8,(x-player.x)/260));
  const carousel=extraSpots.find(p=>p.kind==='carousel'),bee=parkRides.find(p=>p.id==='bee'),ca=falloff(carousel,280),be=falloff(bee,250);
  let grove=0,groveX=0;for(const t of trees)if(Math.abs(t.tx*T+16-player.x)<250&&Math.abs(t.ty*T+16-player.y)<250){const x=t.tx*T+16,w=falloff({x,y:t.ty*T+16},250)*.17;grove+=w;groveX+=x*w;}
  soundZoneCache={discovery,musicFocus,fountain:falloff(point([42,28]),360),fountainPan:pan(42*T+16),carousel:ridesWet()?0:Math.max(ca,be),carouselPan:pan(ca+be>0?(carousel.x*ca+bee.x*be)/(ca+be):player.x),grove:Math.min(1,grove),grovePan:grove>0?pan(groveX/grove):0};return soundZoneCache;
 }
 function frame(t){const frameStart=globalThis.performance?.now?.()||0,rawMs=last?t-last:0;const dt=last?Math.min((t-last)/1000,.06):0;last=t;updateQuizRetry();updateFarewell(dt);updateWalkReplay(dt);window.ParkAudio?.update(dt,!blocked(),rainIntensity(),soundZones(),nightLevel(),{snow:snowIntensity(),cold:snowCover()});if(blocked())acc=0;else{acc+=dt;while(acc>=1/120){step(1/120);acc-=1/120;}}if(photoMode)renderPhotoMode();else draw();sampleGraphics(rawMs,(globalThis.performance?.now?.()||frameStart)-frameStart,!blocked()&&!document.hidden&&!capturingPhoto);requestAnimationFrame(frame);}
 $('mood-short').onclick=()=>makeStroll('short');$('mood-calm').onclick=()=>makeStroll('calm');$('mood-adventure').onclick=()=>makeStroll('adventure');$('stroll-follow').onclick=followStroll;$('stroll-next').onclick=nextStroll;$('stroll-stop').onclick=stopStroll;$('walk-story-play').onclick=()=>{if(!walkReplay||walkReplay.time>=10)startWalkReplay();else{walkReplay.playing=!walkReplay.playing;updateWalkReplay(0);}};$('walk-story-skip').onclick=()=>{if(walkReplay){walkReplay.time=10;updateWalkReplay(0);}};$('walk-story-download').onclick=downloadWalkStory;
 $('rehide-badges').onclick=()=>{if(!finished)askReset('logos');};
 $('fair-restart').onclick=()=>startFair(true);$('fair-award-start').onclick=startFairAward;$('fair-prize-award').onclick=startFairAward;$('fair-postcard').onclick=showFairPostcard;$('fair-award-close').onclick=closeFairPostcard;$('fair-award-dialog').addEventListener('cancel',e=>{e.preventDefault();closeFairPostcard();});$('fair-slow').onchange=setFairPace;$('fair-ribbon-toggle').onchange=toggleFairRibbon;$('fair-start').onclick=startFair;$('fair-close').onclick=closeFairDialog;$('fair-dialog').addEventListener('cancel',e=>{e.preventDefault();closeFairDialog();});$('fair-action').onclick=fairAction;$('fair-cancel').onclick=()=>funScene?.kind==='fairAward'?finishFairAward():finishFair(true);
 $('close-activity').onclick=closeActivity;$('portrait-close').onclick=closeActivity;for(let i=0;i<3;i++)$('magic-cup-'+i).onclick=()=>chooseMagic(i);activity.addEventListener('cancel',e=>{e.preventDefault();closeActivity();});
 $('sound-toggle').onclick=()=>window.ParkAudio?.toggle();window.ParkAudio?.ui();
 $('leisure-untried').onchange=renderLeisurePassport;$('badge-hint').onclick=toggleBadgeHint;$('download-card').onclick=downloadResultCard;$('away-resume').onclick=()=>resumeAway();$('away-path').onclick=()=>resumeAway(true);$('intro-guide').onclick=showInfo;$('away-pause').addEventListener('cancel',e=>{e.preventDefault();resumeAway();});$('finish-race').onclick=tryFinish;$('start').onclick=startFromIntro;$('fresh-start').onclick=()=>askReset('all');$('restart').onclick=()=>askReset('all');$('reset-cancel').onclick=cancelReset;$('reset-accept').onclick=confirmReset;$('reset-confirm').addEventListener('cancel',e=>{e.preventDefault();cancelReset();});$('help').onclick=showInfo;$('pause').onclick=showInfo;$('info-close').onclick=$('resume').onclick=()=>{info.close();clearInput();if(started)canvas.focus();else $('intro-guide').focus();};$('interact').onclick=interact;$('cycle-target').onclick=cycleInteraction;$('letters-track').onclick=()=>selectPlace(planePlace);$('cinema-track').onclick=()=>selectPlace(cinemaPlace);$('portrait-track').onclick=()=>selectPlace(artistPlace);$('close-quiz').onclick=closeQuiz;$('continue').onclick=closeQuiz;$('journal-button').onclick=openJournal;$('close-journal').onclick=closeJournal;$('scan-button').onclick=scan;$('sport-toggle').onclick=toggleSport;$('horn-button').onclick=honk;$('touch-horn').onclick=honk;$('fullscreen-button').onclick=toggleFullscreen;$('fullscreen-journal').onclick=openJournal;$('fullscreen-settings').onclick=()=>{showInfo();$('comfort-options').scrollIntoView?.({block:'start'});};$('collapse-panel').onclick=togglePanel;document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&immersive){immersive=false;document.documentElement?.classList.remove('immersive');$('fullscreen-button').textContent='⛶ На весь экран';$('fullscreen-button').setAttribute('aria-label','На весь экран');resize();}});$('stay-in-park').onclick=continueWalking;$('result-button').onclick=()=>{if(!blocked())finish();};$('comfort-button').onclick=()=>{showInfo();$('comfort-options').scrollIntoView?.({block:'start'});};$('photo-button').onclick=openPhotoMode;initPhotoMode();$('farewell-replay').onclick=openFarewell;$('farewell-close').onclick=closeFarewell;$('farewell-skip').onclick=closeFarewell;$('farewell-play').onclick=toggleFarewell;$('farewell-next').onclick=nextFarewell;$('farewell').addEventListener('cancel',e=>{e.preventDefault();closeFarewell();});$('park-weather-walk').onclick=leaveWeatherPanel;$('wheel-show-launch').onclick=requestWheelShow;$('review-finish').onclick=()=>openQuestionReview('win');$('review-journal').onclick=()=>openQuestionReview('journal');$('review-close').onclick=closeQuestionReview;$('review-missed').onclick=()=>startQuestionPractice(true);$('review-all').onclick=()=>startQuestionPractice(false);$('review-next').onclick=nextReviewQuestion;$('review-back').onclick=()=>{reviewSession=null;renderQuestionReview();$('quiz-review').scrollTop=0;$('review-title').focus();};$('quiz-review').addEventListener('cancel',e=>{e.preventDefault();closeQuestionReview();});$('boat-track').onclick=()=>selectPlace(boatPlace);$('map-button').onclick=openExplorerMap;initMapControls();
 quiz.addEventListener('cancel',e=>{e.preventDefault();closeQuiz();});journal.addEventListener('cancel',e=>{e.preventDefault();closeJournal();});win.addEventListener('cancel',e=>e.preventDefault());info.addEventListener('close',clearInput);
 const movement=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD'];
 window.addEventListener('keydown',e=>{if([...movement,'Space','KeyE','KeyJ','KeyQ','KeyR','KeyH','KeyM','KeyP','KeyC','ShiftLeft','ShiftRight','Escape'].includes(e.code))notePlayActivity();if(idleEscort&&e.code!=='Escape'){if(movement.includes(e.code)||e.code==='Space')e.preventDefault();return;}if(observing){e.preventDefault();setObservation(false);return;}if(guardedInput()||blocked())return;if(funScene?.kind==='fairAward'&&['KeyE','Space','Escape'].includes(e.code)){e.preventDefault();if(!e.repeat)finishFairAward();return;}if(funScene?.kind==='fair'&&['KeyE','Space','Escape'].includes(e.code)){e.preventDefault();if(!e.repeat){if(e.code==='Escape')finishFair(true);else fairAction();}return;}if(e.code==='Space'){e.preventDefault();if(driving||cycling)keys.add('Space');return;}if([...movement,'KeyE','KeyJ','KeyQ','KeyR','KeyH','KeyM','KeyP','KeyC','ShiftLeft','ShiftRight','Escape'].includes(e.code))e.preventDefault();if(e.repeat)return;if(movement.includes(e.code))keys.add(e.code);else if(e.code==='KeyE')interact();else if(e.code==='KeyJ')openJournal();else if(e.code==='KeyQ')scan();else if(e.code==='KeyR')toggleSport();else if(e.code==='KeyH')honk();else if(e.code==='KeyM')openExplorerMap();else if(e.code==='KeyP')openPhotoMode();else if(e.code==='KeyC')cycleInteraction();else if(e.code.startsWith('Shift'))dash();else if(e.code==='Escape')showInfo();});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',pauseAway);document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseAway();});window.addEventListener('pagehide',save);

 const stickBase=$('joystick');
 stickBase.addEventListener('pointerdown',e=>{e.preventDefault();if(blocked()||idleEscort||towScene||trafficStop||stick.pointer!==null||e.button>0)return;stick.pointer=e.pointerId;stickBase.setPointerCapture(e.pointerId);stickBase.classList.add('is-active');moveStick(e);});
 stickBase.addEventListener('pointermove',e=>{if(e.pointerId===stick.pointer){e.preventDefault();if(blocked())resetStick();else moveStick(e);}});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])stickBase.addEventListener(type,e=>{if(e.pointerId===stick.pointer)resetStick();});
 stickBase.addEventListener('contextmenu',e=>e.preventDefault());window.addEventListener('resize',resetStick);

 document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();if(blocked()||idleEscort)return;b.setPointerCapture(e.pointerId);if(b.dataset.key==='ShiftLeft'){if(driving)keys.add('Space');else dash();}else keys.add(b.dataset.key);});const up=()=>{keys.delete(b.dataset.key);if(b.dataset.key==='ShiftLeft')keys.delete('Space');};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);});
 savedRun=readSave();renderIntro(savedRun);syncPanel();
 for(const [id,key]of [['nature-volume','nature'],['effects-volume','effects'],['stick-sensitivity','sensitivity'],['control-size','controls']]){const el=$(id);el.value=comfort[key];el.oninput=()=>{const value=Number(el.value);if(!Number.isFinite(value))return;comfort[key]=key==='controls'?Math.max(.8,Math.min(1.2,value)):key==='sensitivity'?Math.max(.6,Math.min(1.5,value)):Math.max(0,Math.min(1,value));applyComfort();};}for(const [id,key]of [['large-copy','large'],['reduce-effects','reduced'],['left-handed','leftHanded']]){$(id).checked=comfort[key];$(id).onchange=()=>{comfort[key]=$(id).checked;if(key==='leftHanded')clearInput();applyComfort();};}syncQuality();applyComfort();
 initMobileScreen();
 $('graphics-quality').onchange=()=>setGraphicsQuality($('graphics-quality').value);$('kite-track').onclick=()=>selectPlace(kitePlace);$('collage-create').onclick=createCollage;$('collage-caption').oninput=()=>{collage.caption=$('collage-caption').value.slice(0,80);collageRevision++;$('collage-result').hidden=true;};$('collage-caption').onchange=save;
 $('snowman-track').onclick=()=>selectPlace(snowmanPlace);$('squirrel-track').onclick=()=>selectPlace(squirrelPlace);
 $('garden-track').onclick=()=>selectPlace(gardenPlace);$('tracked-goal').onclick=openExplorerMap;$('clear-goal').onclick=clearTrackedGoal;$('observe-button').onclick=()=>setObservation(true);$('observe-return').onclick=()=>setObservation(false);
 for(const id of ['quiz','info','journal','activity','win','reset-confirm','away-pause'])$(id).addEventListener('close',armInputGuard);
 canvas.addEventListener('pointerdown',bubblePointerDown);canvas.addEventListener('pointerup',bubblePointerUp);canvas.addEventListener('pointercancel',()=>{bubbleTap=null;});
 document.addEventListener('pointerdown',handlePlayInput,true);document.addEventListener('click',handlePlayInput,true);
 document.documentElement?.classList.toggle('touch-copy',mobileScreen());
 resize();requestAnimationFrame(frame);
})();



















