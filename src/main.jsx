import React,{useEffect,useMemo,useState}from'react';
import{createRoot}from'react-dom/client';
import{BookOpen,Brain,Check,Dices,Languages,RotateCcw,SkipForward,Sparkles,Table2,Trophy,X}from'lucide-react';
import rawVocab from'./vocab.json';
import'./styles.css';

const normalize=s=>(s??'').trim().normalize('NFC').toLocaleLowerCase('lt-LT').replace(/[ą]/g,'a').replace(/[č]/g,'c').replace(/[ęė]/g,'e').replace(/[į]/g,'i').replace(/[š]/g,'s').replace(/[ųū]/g,'u').replace(/[ž]/g,'z').replace(/ё/g,'е').replace(/\s+/g,' ');
const CORRECTIONS={
 'bazilikai':{lt:'bazilikas',ru:'базилик',aliases:['bazilikai']},
 'gabaliukas; gabalėlis':{lt:'gabaliukas',ru:'кусочек',aliases:['gabalėlis']}
};
const entries=rawVocab.map(x=>{const lt=x.lt??x.word??'',ru=x.ru??x.translation??'';const c=CORRECTIONS[lt];return c?{...x,...c}:{...x,lt,ru,aliases:x.aliases??[]}}).filter(x=>x.lt&&x.ru);

const CASES=[
 ['gen','Родительный','Kilmininkas','ko?'],
 ['dat','Дательный','Naudininkas','kam?'],
 ['acc','Винительный','Galininkas','ką?'],
 ['ins','Творительный','Įnagininkas','kuo?'],
 ['loc','Местный','Vietininkas','kur?'],
 ['voc','Звательный','Šauksmininkas','—']
];
const ADJ=new Set(`alkanas aukštas aštrus baltas didelis draugiškas geltonas geras gražus įdomus jaunas jaunesnis jauniausias juodas karštas keptas linksmas liūdnas malonus mažas mėlynas mielas miręs puikus raudonas riebus rūgštus rūkytas saldus senas skanus sotus sūrus šaltas šiltas švelnus šviesus šviežias tamsus vedęs vidurinis virtas vyresnis vyriausias žalias žemas`.split(' '));
const ADV=new Set(['arti','blogai','čia','dažnai','gerai','kartu','kartais','kasdien','namie','niekada','paprastai','retai','rytoj','šiaip sau','šiandien','taip','taip pat','toli','truputį','visada']);
const FN=new Set(['bet','ir','ne','o','taip']);
const isVerb=w=>w.endsWith('ti');

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
 is:{nom:'is',gen:'io',dat:'iui',acc:'į',ins:'iu',loc:'yje',voc:'i'},
 ys:{nom:'ys',gen:'io',dat:'iui',acc:'į',ins:'iu',loc:'yje',voc:'y'},
 a:{nom:'a',gen:'os',dat:'ai',acc:'ą',ins:'a',loc:'oje',voc:'a'},
 ė:{nom:'ė',gen:'ės',dat:'ei',acc:'ę',ins:'e',loc:'ėje',voc:'e'},
 us:{nom:'us',gen:'aus',dat:'ui',acc:'ų',ins:'umi',loc:'uje',voc:'au'},
 ius:{nom:'ius',gen:'iaus',dat:'iui',acc:'ių',ins:'iumi',loc:'iuje',voc:'iau'}
};
function nounClass(w){if(SPECIAL[w])return 'special';for(const c of['ius','ys','as','is','us','a','ė'])if(w.endsWith(c))return c;return null}
function inflect(w,c,k){if(SPECIAL[w]?.[k])return SPECIAL[w][k];const e=END[c];if(!e)return null;return w.slice(0,-e.nom.length)+e[k]}
const nouns=entries.filter(x=>!x.lt.includes(' ')&&!x.lt.includes(',')&&!x.lt.includes(';')&&!x.lt.includes('/')&&!ADJ.has(x.lt)&&!ADV.has(x.lt)&&!FN.has(x.lt)&&!isVerb(x.lt)).map(x=>({...x,cls:nounClass(x.lt)})).filter(x=>x.cls);
const caseTasks=nouns.flatMap(n=>CASES.map(([id,ruCase,ltCase,q])=>({...n,id,ruCase,ltCase,q,answer:inflect(n.lt,n.cls,id)}))).filter(x=>x.answer);
const shuffled=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};

function App(){
 const[mode,setMode]=useState('vocab'),[dir,setDir]=useState('ru-lt'),[caseId,setCaseId]=useState('all');
 const[deck,setDeck]=useState([]),[index,setIndex]=useState(0),[input,setInput]=useState(''),[status,setStatus]=useState('idle');
 const[ok,setOk]=useState(0),[bad,setBad]=useState(0),[streak,setStreak]=useState(0),[best,setBest]=useState(()=>+localStorage.getItem('ltBest82')||0),[showTable,setShowTable]=useState(false);
 const base=useMemo(()=>mode==='vocab'?entries:(caseId==='all'?caseTasks:caseTasks.filter(x=>x.id===caseId)),[mode,caseId]);
 useEffect(()=>{setDeck(shuffled(base));setIndex(0);setInput('');setStatus('idle')},[base]);
 const item=deck.length?deck[index%deck.length]:base[0];
 if(!item)return <main><div className="shell"><h1>Нет заданий для выбранного режима</h1></div></main>;
 const expected=mode==='vocab'?(dir==='ru-lt'?item.lt:item.ru):item.answer;
 const prompt=mode==='vocab'?(dir==='ru-lt'?item.ru:item.lt):item.lt;
 const next=()=>{setIndex(n=>(n+1)%Math.max(deck.length,1));setInput('');setStatus('idle')};
 const shuffleNow=()=>{setDeck(shuffled(base));setIndex(0);setInput('');setStatus('idle')};
 const skip=()=>{setStreak(0);next()};
 function submit(e){e.preventDefault();if(status!=='idle'||!input.trim())return;const answers=mode==='vocab'&&dir==='ru-lt'?[item.lt,...(item.aliases??[])]:[expected];const good=answers.some(a=>normalize(a)===normalize(input));setStatus(good?'good':'bad');if(good){setOk(n=>n+1);const s=streak+1;setStreak(s);if(s>best){setBest(s);localStorage.setItem('ltBest82',s)}}else{setBad(n=>n+1);setStreak(0)}}
 return <main><div className="shell">
  <header><div className="brand"><BookOpen/> LIETUVIŲ KALBA</div><h1>Литовский тренажёр</h1><p>Слова, переводы и склонение существительных.</p><div className="switch"><button className={mode==='vocab'?'on':''} onClick={()=>setMode('vocab')}><Languages/>Слова</button><button className={mode==='cases'?'on':''} onClick={()=>setMode('cases')}><Brain/>Падежи</button></div></header>
  <section className="stats"><div><Check/>Правильно <b>{ok}</b></div><div><X/>Ошибки <b>{bad}</b></div><div><Sparkles/>Серия <b>{streak}</b></div><div><Trophy/>Рекорд <b>{best}</b></div></section>
  <div className="layout"><aside>{mode==='vocab'?<><h3>НАПРАВЛЕНИЕ</h3><button className={dir==='ru-lt'?'active':''} onClick={()=>setDir('ru-lt')}>Русский → Литовский</button><button className={dir==='lt-ru'?'active':''} onClick={()=>setDir('lt-ru')}>Литовский → Русский</button></>:<><h3>ПАДЕЖ</h3><button className={caseId==='all'?'active':''} onClick={()=>setCaseId('all')}>Все падежи</button>{CASES.map(([id,r,,q])=><button key={id} className={caseId===id?'active':''} onClick={()=>setCaseId(id)}>{r}<small>{q}</small></button>)}<button className="tableBtn" onClick={()=>setShowTable(true)}><Table2/>Окончания и вопросы</button></>}</aside>
   <section className="card"><div className="tools"><button title="Перемешать" onClick={shuffleNow}><Dices/></button><button title="Другое слово, серия сбросится" onClick={skip}><SkipForward/></button></div>{mode==='cases'&&<div className="caseHero"><div><span className="caseRu">{item.ruCase}</span><span className="caseLt">{item.ltCase}</span></div><b>{item.q}</b></div>}<div className="prompt">{prompt}</div><div className="sub">{mode==='cases'?`Поставь существительное в ${item.ruCase.toLowerCase()} падеж · ${item.ru}`:(dir==='ru-lt'?'Напиши по-литовски':'Напиши по-русски')}</div><form onSubmit={submit}><input autoFocus value={input} disabled={status!=='idle'} onChange={e=>setInput(e.target.value)} placeholder="Введите ответ…"/><button disabled={!input.trim()||status!=='idle'}>Проверить</button></form><div className="casehint">Регистр не важен. Можно писать без литовской раскладки.</div>{status!=='idle'&&<div className={'result '+status}><b>{status==='good'?'Правильно!':'Неверно'}</b><span>Ответ: <strong>{expected}</strong></span><button onClick={next}>Дальше</button></div>}</section>
  </div>
  {showTable&&mode==='cases'&&<div className="modal" onClick={()=>setShowTable(false)}><div className="modalBox" onClick={e=>e.stopPropagation()}><div className="modalHead"><h2>Падежи: вопросы и окончания</h2><button onClick={()=>setShowTable(false)}>×</button></div><div className="tableWrap"><table><thead><tr><th>Падеж</th><th>Вопрос</th><th>-as</th><th>-is</th><th>-a</th><th>-ė</th><th>-us</th></tr></thead><tbody>{CASES.map(([id,r,l,q])=><tr key={id}><td><b>{r}</b><small>{l}</small></td><td>{q}</td>{['as','is','a','ė','us'].map(c=><td key={c}>{END[c]?.[id]??'—'}</td>)}</tr>)}</tbody></table></div></div></div>}
  <button className="reset" onClick={()=>{setOk(0);setBad(0);setStreak(0)}}><RotateCcw/>Сбросить статистику</button>
 </div></main>
}
createRoot(document.getElementById('root')).render(<App/>);
