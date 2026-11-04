import React, { useState } from 'react';
import { Dices, SkipForward } from 'lucide-react';
import { PERSONS, VERB_DEMO_ITEMS } from '../grammar/verbs';
import { normalizeAnswer, shuffle } from '../utils/text';

export default function VerbsTrainer({ onResult, onSkip }) {
  const [tense, setTense] = useState('present');
  const [deck, setDeck] = useState(() => shuffle(VERB_DEMO_ITEMS));
  const [index, setIndex] = useState(0);
  const [personIndex, setPersonIndex] = useState(() => Math.floor(Math.random() * PERSONS.length));
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const item = deck[index % deck.length];
  const person = PERSONS[personIndex];
  const answer = item[tense][person.id];

  const resetQuestion = () => { setPersonIndex(Math.floor(Math.random() * PERSONS.length)); setInput(''); setStatus('idle'); };
  const next = () => { setIndex((value) => (value + 1) % deck.length); resetQuestion(); };
  const reshuffle = () => { setDeck(shuffle(VERB_DEMO_ITEMS)); setIndex(0); resetQuestion(); };
  const skip = () => { onSkip(); next(); };
  const changeTense = (value) => { setTense(value); resetQuestion(); };
  const submit = (event) => {
    event.preventDefault();
    if (!input.trim() || status !== 'idle') return;
    const correct = normalizeAnswer(input) === normalizeAnswer(answer);
    setStatus(correct ? 'good' : 'bad');
    onResult(correct);
  };

  return <div className="layout"><aside><h3>ВРЕМЯ</h3><button className={tense === 'present' ? 'active' : ''} onClick={() => changeTense('present')}>Настоящее</button><button className={tense === 'future' ? 'active' : ''} onClick={() => changeTense('future')}>Будущее</button><div className="note">Три модели настоящего: <b>-a, -i, -o</b>. Будущее тренируется по лицам отдельно.</div></aside><section className="card"><div className="tools"><button title="Перемешать" onClick={reshuffle}><Dices /></button><button title="Другой глагол, серия сбросится" onClick={skip}><SkipForward /></button></div><div className="moduleHero"><span>{tense === 'present' ? 'Настоящее время' : 'Будущее время'}</span><b>{person.lt}</b></div><div className="prompt">{item.infinitive}</div><div className="sub">{item.ru} · Поставь для: <strong>{person.ru}</strong></div><form onSubmit={submit}><input autoFocus value={input} disabled={status !== 'idle'} onChange={(event) => setInput(event.target.value)} placeholder="Введите форму глагола…" /><button disabled={!input.trim() || status !== 'idle'}>Проверить</button></form><div className="casehint">Автономный набор: dirbti, kalbėti, skaityti, būti, eiti.</div>{status !== 'idle' && <div className={'result ' + status}><b>{status === 'good' ? 'Правильно!' : 'Неверно'}</b><span>{person.lt} <strong>{answer}</strong></span><button onClick={next}>Дальше</button></div>}</section></div>;
}
