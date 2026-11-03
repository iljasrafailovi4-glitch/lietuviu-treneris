import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{BookOpen,Brain,Check,Languages,RotateCcw,Sparkles,Trophy,X}from'lucide-react';
import rawVocab from'./vocab.json';
import'./styles.css';

// Проверка нечувствительна к регистру и принимает английские аналоги литовских букв.
const normalize=s=>(s??'').trim().normalize('NFC').toLocaleLowerCase('lt-LT')
 .replace(/[ą]/g,'a').replace(/[č]/g,'c').replace(/[ęė]/g,'e').replace(/[į]/g,'i')
 .replace(/[š]/g,'s').replace(/[ųū]/g,'u').replace(/[ž]/g,'z').replace(/ё/g,'е').replace(/\s+/g,' ');

// Исправления словарных форм. aliases тоже засчитываются как правильный ответ.
const CORRECTIONS={
 'bazilikai':{lt:'bazilikas',ru:'базилик',aliases:['bazilikai']},
 'gabaliukas; gabalėlis':{lt:'gabaliukas',ru:'кусочек',aliases:['gabalėlis']},
 'šie, šios':{lt:'šie / šios',ru:'эти',aliases:['šie','šios']},
 'šis, ši':{lt:'šis / ši',ru:'этот / эта',aliases:['šis','ši']},
 'tas, ta':{lt:'tas / ta',ru:'тот / та',aliases:['tas','ta']},
 'tie, tos':{lt:'tie / tos',ru:'те',aliases:['tie','tos']}
};
const entries=rawVocab.map(x=>{
 const lt=x.lt??x.word??''; const ru=x.ru??x.translation??''; const c=CORRECTIONS[lt];
 return c?{...x,...c,sourceLt:lt}:{...x,lt,ru,aliases:x.aliases??[]};
}).filter(x=>x.lt&&x.ru);

const CASES=[['gen','Родительный','Kilmininkas','ko?'],['dat','Дательный','Naudininkas','kam?'],['acc','Винительный','Galininkas','ką?'],['ins','Творительный','Įnagininkas','kuo?'],['loc','Местный','Vietininkas','kur?'],['voc','Звательный','Šauksmininkas','—']];

// Эти части речи никогда не попадают в тренажёр падежей существительных.
const ADJECTIVES=new Set(`alkanas aukštas aštrus baltas didelis draugiškas geltonas geras gražus įdomus jaunas jaunesnis jauniausias juodas karštas keptas linksmas liūdnas malonus mažas mėlynas mielas miręs puikus raudonas riebus rūgštus rūkytas saldus senas skanus sotus sūrus šaltas šiltas švelnus šviesus šviežias tamsus vedęs vidurinis virtas vyresnis vyriausias žalias žemas`.split(' '));
const ADVERBS=new Set(['arti','blogai','čia','dažnai','gerai','kartu','kartais','kasdien','namie','niekada','paprastai','retai','rytoj','šiaip sau','šiandien','taip','taip pat','toli','truputį','visada']);
const FUNCTION_WORDS=new Set(['bet','ir','ne','o','taip','tas / ta','tie / tos','šis / ši','šie / šios']);
const isVerb=w=>w.endsWith('ti')||w.includes(', yra')||w.includes(', nėra');
const isDeclinableNoun=x=>!x.lt.includes(' ')&&!x.lt.includes('/')&&!x.lt.includes(',')&&!x.lt.includes(';')&&!ADJECTIVES.has(x.lt)&&!ADVERBS.has(x.lt)&&!FUNCTION_WORDS.has(x.lt)&&!isVerb(x.lt);

const SPECIAL={
 sesuo:{gen:'sesers',dat:'seseriai',acc:'seserį',ins:'seseria',loc:'seseryje',voc:'seserie'},
 duktė:{gen:'dukters',dat:'dukteriai',acc:'dukterį',ins:'dukteria',loc:'dukteryje',voc:'dukterie'},
 moteris:{gen:'moters',dat:'moteriai',acc:'moterį',ins:'moterimi',loc:'moteryje',voc:'moterie'},
 šuo:{gen:'šuns',dat:'šuniui',acc:'šunį',ins:'šunimi',loc:'šunyje',voc:'šunie'},
 žmogus:{gen:'žmogaus',dat:'žmogui',acc:'žmogų',ins:'žmogumi',loc:'žmoguje',voc:'žmogau'},
 stotis:{gen:'stoties',dat:'stočiai',acc:'stotį',ins:'stotimi',loc:'stotyje',voc:'stotie'},
 pilis:{gen:'pilies',dat:'piliai',acc:'pilį',ins:'pilimi',loc:'pilyje',voc:'pilie'},
 žuvis:{gen:'žuvies',dat:'žuviai',acc:'žuvį',ins:'žuvimi',loc:'žuvyje',voc:'žuvie'},
 naktis:{gen:'nakties',dat:'nakčiai',acc:'naktį',ins:'naktimi',loc:'naktyje',voc:'naktie'},
 vanduo:{gen:'vandens',dat:'vandeniui',acc:'vandenį',ins:'vandeniu',loc:'vandenyje',voc:'vandenie'},
 turgus:{gen:'turgaus',dat:'turgui',acc:'turgų',ins:'turgumi',loc:'turguje',voc:'turgau'},
 medus:{gen:'medaus',dat:'medui',acc:'medų',ins:'medumi',loc:'meduje',voc:'medau'}
};
const END={
 as:{nom:'as',gen:'o',dat:'ui',acc:'ą',ins:'u',loc:'e',voc:'e'},
 ias:{nom:'ias',gen:'io',dat:'iui',acc:'ią',ins:'iu',loc:'yje',voc:'y'},
 is:{nom:'is',gen:'io',dat:'iui',acc:'į',ins:'iu',loc:'yje',voc:'i'},
 ys:{nom:'ys',gen:'io',dat:'iui',acc:'į',ins:'iu',loc:'yje',voc:'y'},
 a:{nom:'a',gen:'os',dat:'ai',acc:'ą',ins:'a',loc:'oje',voc:'a'},
 ė:{nom:'ė',gen:'ės',dat:'ei',acc:'ę',ins:'e',loc:'ėje',voc:'e'},
 us:{nom:'us',gen:'aus',dat:'ui',acc:'ų',ins:'umi',loc:'uje',voc:'au'},
 ius:{nom:'ius',gen:'iaus',dat:'iui',acc:'ių',ins:'iumi',loc:'iuje',voc:'iau'}
};
function nounClass(w){if(SPECIAL[w])return'special';for(const c of['ius','ias','ys','as','is','us','a','ė'])if(w.endsWith(c))return c;return null}
function inflect(w,c,id){if(SPECIAL[w])return SPECIAL[w][id];const e=END[c];return w.slice(0,-e.nom.length)+e[id]}
const nouns=entries.filter(isDeclinableNoun).map(x=>({...x,cls:nounClass(x.lt)})).filter(x=>x.cls);
const caseTasks=nouns.flatMap(n=>CASES.map(([id,ruCase,ltCase,q])=>({...n,id,ruCase,ltCase,q,answer:inflect(n.lt,n.cls,id)}))).filter(x=>x.answer);

function acceptedAnswers(item,mode,dir){
 if(mode==='cases')return[item.answer];
 if(dir==='ru-lt')return[item.lt,...(item.aliases??[])];
 return[item.ru,...(item.ruAliases??[])];
}
function useStats(){const[s,setS]=useState(()=>{try{return JSON.parse(localStorage.getItem('ltStats7'))||{ok:0,bad:0,best:0}}catch{return{ok:0,bad:0,best:0}}});useEffect(()=>localStorage.setItem('ltStats7',JSON.stringify(s)),[s]);return[s,setS]}
function App(){
 const[mode,setMode]=useState('vocab'),[dir,setDir]=useState('ru-lt'),[caseId,setCase]=useState('all'),[i,setI]=useState(0),[input,setInput]=useState(''),[state,setState]=useState('idle'),[streak,setStreak]=useState(0),[stats,setStats]=useStats();
 const pool=useMemo(()=>mode==='vocab'?entries:(caseId==='all'?caseTasks:caseTasks.filter(x=>x.id===caseId)),[mode,caseId]);
 const item=pool[i%pool.length]; const expected=mode==='vocab'?(dir==='ru-lt'?item.lt:item.ru):item.answer; const prompt=mode==='vocab'?(dir==='ru-lt'?item.ru:item.lt):item.lt;
 function check(e){e?.preventDefault();if(!input.trim()||state!=='idle')return;const ok=acceptedAnswers(item,mode,dir).some(a=>normalize(a)===normalize(input));setState(ok?'good':'bad');if(ok){const n=streak+1;setStreak(n);setStats(s=>({...s,ok:s.ok+1,best:Math.max(s.best,n)}))}else{setStreak(0);setStats(s=>({...s,bad:s.bad+1}))}}
 function next(){setI(n=>n+1+Math.floor(Math.random()*7));setInput('');setState('idle')}
 return <main><div className="shell"><header><div><div className="brand"><BookOpen/> LIETUVIŲ KALBA</div><h1>Литовский тренажёр</h1><p>Слова, переводы и склонение существительных.</p></div><div className="switch"><button className={mode==='vocab'?'on':''} onClick={()=>{setMode('vocab');setState('idle');setInput('')}}><Languages/>Слова</button><button className={mode==='cases'?'on':''} onClick={()=>{setMode('cases');setState('idle');setInput('')}}><Brain/>Падежи</button></div></header><section className="stats"><div><Check/>Правильно <b>{stats.ok}</b></div><div><X/>Ошибки <b>{stats.bad}</b></div><div><Sparkles/>Серия <b>{streak}</b></div><div><Trophy/>Рекорд <b>{stats.best}</b></div></section><div className="layout"><aside>{mode==='vocab'?<><h3>Направление</h3><button className={dir==='ru-lt'?'active':''} onClick={()=>{setDir('ru-lt');setState('idle');setInput('')}}>Русский → Литовский</button><button className={dir==='lt-ru'?'active':''} onClick={()=>{setDir('lt-ru');setState('idle');setInput('')}}>Литовский → Русский</button><div className="note"><b>{entries.length}</b> слов и выражений.</div></>:<><h3>Падеж</h3><button className={caseId==='all'?'active':''} onClick={()=>setCase('all')}>Все падежи</button>{CASES.map(([id,r,l,q])=><button className={caseId===id?'active':''} onClick={()=>setCase(id)} key={id}>{r}<small>{q}</small></button>)}<div className="note">Здесь только существительные. Прилагательные, наречия, глаголы, местоимения и словосочетания исключены.</div></>}</aside><section className="card"><div className="pad"><div className="badge">{mode==='vocab'?'Словарь':item.ruCase+' · '+item.ltCase+' · '+item.q}</div><div className="prompt">{prompt}</div><div className="sub">{mode==='vocab'?(dir==='ru-lt'?'Напиши по-литовски':'Напиши по-русски'):'Поставь существительное в нужный падеж · '+item.ru}</div><form onSubmit={check}><input autoFocus value={input} disabled={state!=='idle'} onChange={e=>setInput(e.target.value)} placeholder="Введите ответ…"/><button disabled={!input.trim()||state!=='idle'}>Проверить</button></form><div className="casehint">Регистр не важен. Можно писать без литовской раскладки: ą→a, č→c, ę/ė→e, į→i, š→s, ų/ū→u, ž→z.</div>{state!=='idle'&&<div className={'result '+state}>{state==='good'?<Check/>:<X/>}<div><b>{state==='good'?'Правильно!':'Неверно'}</b><span>Основной ответ: <strong>{expected}</strong></span></div><button onClick={next}>Дальше</button></div>}</div></section></div><button className="reset" onClick={()=>{setStats({ok:0,bad:0,best:0});setStreak(0)}}><RotateCcw/>Сбросить статистику</button><footer>Литовский тренажёр · Русский ↔ Литовский</footer></div></main>
}
createRoot(document.getElementById('root')).render(<App/>);
