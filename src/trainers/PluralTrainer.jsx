import React,{useMemo,useState}from'react';
import{Dices,HelpCircle,SkipForward,X}from'lucide-react';
import{CONSTRUCTIONS,CONSTRUCTION_HINTS,PLURAL_DEMO_ITEMS,buildExercise}from'../grammar/plurals';
import{normalizeAnswer,shuffle}from'../utils/text';

export default function PluralTrainer({onResult,onSkip}){
 const[items,setItems]=useState(()=>shuffle(PLURAL_DEMO_ITEMS));
 const[constructions,setConstructions]=useState(()=>shuffle(CONSTRUCTIONS));
 const[index,setIndex]=useState(0),[constructionIndex,setConstructionIndex]=useState(0);
 const[number,setNumber]=useState(()=>1+Math.floor(Math.random()*20));
 const[input,setInput]=useState(''),[status,setStatus]=useState('idle'),[showHint,setShowHint]=useState(false);
 const item=items[index%items.length],construction=constructions[constructionIndex%constructions.length];
 const exercise=useMemo(()=>buildExercise(item,number,construction),[item,number,construction]);
 const resetQuestion=()=>{setConstructionIndex(v=>(v+1)%constructions.length);setNumber(1+Math.floor(Math.random()*20));setInput('');setStatus('idle')};
 const next=()=>{setIndex(v=>(v+1)%items.length);resetQuestion()};
 const reshuffle=()=>{setItems(shuffle(PLURAL_DEMO_ITEMS));setConstructions(shuffle(CONSTRUCTIONS));setIndex(0);setConstructionIndex(0);setNumber(1+Math.floor(Math.random()*20));setInput('');setStatus('idle')};
 const skip=()=>{onSkip();next()};
 const submit=e=>{e.preventDefault();if(!input.trim()||status!=='idle')return;const good=normalizeAnswer(input)===normalizeAnswer(exercise.answer);setStatus(good?'good':'bad');onResult(good)};
 return <>
  <section className="card pluralCard fullTrainerCard">
   <div className="pluralTopbar">
    <button className="hintPill" onClick={()=>setShowHint(true)}><HelpCircle/>Подсказка</button>
    <div className="tools"><button title="Перемешать" onClick={reshuffle}><Dices/></button><button title="Другое задание, серия сбросится" onClick={skip}><SkipForward/></button></div>
   </div>
   <div className="constructionBadge"><span>{construction.lt}</span><small>{construction.caseRu} · {construction.question}</small></div>
   <div className="prompt promptSentence pluralPrompt">{exercise.russian}</div>
   <div className="sub pluralTemplate">{exercise.lithuanian}</div>
   <form onSubmit={submit}><input autoFocus value={input} disabled={status!=='idle'} onChange={e=>setInput(e.target.value)} placeholder="Числительное, прилагательное и существительное…"/><button disabled={!input.trim()||status!=='idle'}>Проверить</button></form>
   {status!=='idle'&&<div className={'result '+status}><b>{status==='good'?'Правильно!':'Неверно'}</b><span>Ответ: <strong>{exercise.answer}</strong></span><button onClick={next}>Дальше</button></div>}
  </section>
  {showHint&&<div className="modal" onClick={()=>setShowHint(false)}><div className="modalBox" onClick={e=>e.stopPropagation()}><div className="modalHead"><h2>Подсказка: конструкции и падежи</h2><button onClick={()=>setShowHint(false)}><X/></button></div><div className="tableWrap"><table><thead><tr><th>Конструкция</th><th>Падеж</th><th>Вопрос</th><th>Пример</th></tr></thead><tbody>{CONSTRUCTION_HINTS.map(x=><tr key={x.construction}><td><b>{x.construction}</b></td><td>{x.case}</td><td>{x.question}</td><td>{x.example}</td></tr>)}</tbody></table></div><div className="note hintNote"><b>Запомни:</b> norėti требует родительного. Отрицание у mėgti и turėti переводит прямое дополнение в родительный. Patinka / nepatinka использует именительный для того, что нравится.</div></div></div>}
 </>;
}
