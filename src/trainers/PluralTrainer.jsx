import React, { useMemo, useState } from 'react';
import { Dices, SkipForward } from 'lucide-react';
import { PLURAL_DEMO_ITEMS, buildQuantityAnswer } from '../grammar/plurals';
import { normalizeAnswer, shuffle } from '../utils/text';

export default function PluralTrainer({ onResult, onSkip }) {
  const [deck, setDeck] = useState(() => shuffle(PLURAL_DEMO_ITEMS));
  const [index, setIndex] = useState(0);
  const [number, setNumber] = useState(() => 1 + Math.floor(Math.random() * 20));
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const item = deck[index % deck.length];
  const answer = useMemo(() => buildQuantityAnswer(item, number), [item, number]);

  const next = () => {
    setIndex((value) => (value + 1) % deck.length);
    setNumber(1 + Math.floor(Math.random() * 20));
    setInput('');
    setStatus('idle');
  };
  const reshuffle = () => { setDeck(shuffle(PLURAL_DEMO_ITEMS)); setIndex(0); setNumber(1 + Math.floor(Math.random() * 20)); setInput(''); setStatus('idle'); };
  const skip = () => { onSkip(); next(); };
  const submit = (event) => {
    event.preventDefault();
    if (!input.trim() || status !== 'idle') return;
    const correct = normalizeAnswer(input) === normalizeAnswer(answer);
    setStatus(correct ? 'good' : 'bad');
    onResult(correct);
  };

  return <div className="layout"><aside><h3>КОНСТРУКЦИЯ</h3><div className="note"><b>Число + прилагательное + существительное</b><br />Число меняется в каждом задании.</div></aside><section className="card"><div className="tools"><button title="Перемешать" onClick={reshuffle}><Dices /></button><button title="Другое задание, серия сбросится" onClick={skip}><SkipForward /></button></div><div className="moduleHero"><span>Множественное число</span><b>{number}</b></div><div className="prompt promptSentence">Я хочу {number} {item.ruAdjective} {item.ruNoun}.</div><div className="sub">Aš noriu ___ ___ ___.</div><form onSubmit={submit}><input autoFocus value={input} disabled={status !== 'idle'} onChange={(event) => setInput(event.target.value)} placeholder="Напиши число, прилагательное и существительное…" /><button disabled={!input.trim() || status !== 'idle'}>Проверить</button></form><div className="casehint">Пока это автономный демонстрационный набор. Полная лексика будет подключена позже.</div>{status !== 'idle' && <div className={'result ' + status}><b>{status === 'good' ? 'Правильно!' : 'Неверно'}</b><span>Ответ: <strong>{answer}</strong></span><button onClick={next}>Дальше</button></div>}</section></div>;
}
