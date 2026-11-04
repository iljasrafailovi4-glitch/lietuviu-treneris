import React, { useMemo, useState } from 'react';
import { Dices, SkipForward, Table2 } from 'lucide-react';
import GrammarTable from '../components/GrammarTable';
import { CASES } from '../grammar/nouns';
import { normalizeAnswer, shuffle } from '../utils/text';

export default function CasesTrainer({ tasks, onResult, onSkip }) {
  const [caseId, setCaseId] = useState('all');
  const [deck, setDeck] = useState(() => shuffle(tasks));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [showTable, setShowTable] = useState(false);

  const activeDeck = useMemo(() => caseId === 'all' ? deck : deck.filter((task) => task.id === caseId), [caseId, deck]);
  const item = activeDeck[index % Math.max(activeDeck.length, 1)] ?? tasks[0];
  if (!item) return <section className="card">Нет заданий по падежам.</section>;

  const chooseCase = (id) => {
    setCaseId(id);
    setIndex(0);
    setInput('');
    setStatus('idle');
  };

  const next = () => {
    setIndex((value) => (value + 1) % Math.max(activeDeck.length, 1));
    setInput('');
    setStatus('idle');
  };

  const reshuffle = () => {
    setDeck(shuffle(tasks));
    setIndex(0);
    setInput('');
    setStatus('idle');
  };

  const skip = () => {
    onSkip();
    next();
  };

  const submit = (event) => {
    event.preventDefault();
    if (status !== 'idle' || !input.trim()) return;
    const correct = normalizeAnswer(item.answer) === normalizeAnswer(input);
    setStatus(correct ? 'good' : 'bad');
    onResult(correct);
  };

  return (
    <>
      <div className="layout">
        <aside>
          <h3>ПАДЕЖ</h3>
          <button className={caseId === 'all' ? 'active' : ''} onClick={() => chooseCase('all')}>Все падежи</button>
          {CASES.map(([id, ruCase, , question]) => <button key={id} className={caseId === id ? 'active' : ''} onClick={() => chooseCase(id)}>{ruCase}<small>{question}</small></button>)}
          <button className="tableBtn" onClick={() => setShowTable(true)}><Table2 />Окончания и вопросы</button>
        </aside>
        <section className="card">
          <div className="tools">
            <button title="Перемешать" onClick={reshuffle}><Dices /></button>
            <button title="Другое слово, серия сбросится" onClick={skip}><SkipForward /></button>
          </div>
          <div className="caseHero"><div><span className="caseRu">{item.ruCase ?? 'Падеж'}</span><span className="caseLt">{item.ltCase ?? ''}</span></div><b>{item.q ?? ''}</b></div>
          <div className="prompt">{item.lt}</div>
          <div className="sub">Поставь существительное в {(item.ruCase ?? 'нужный').toLocaleLowerCase('ru-RU')} падеж · {item.ru}</div>
          <form onSubmit={submit}>
            <input autoFocus value={input} disabled={status !== 'idle'} onChange={(event) => setInput(event.target.value)} placeholder="Введите ответ…" />
            <button disabled={!input.trim() || status !== 'idle'}>Проверить</button>
          </form>
          <div className="casehint">Регистр не важен. Можно писать без литовской раскладки.</div>
          {status !== 'idle' && <div className={'result ' + status}><b>{status === 'good' ? 'Правильно!' : 'Неверно'}</b><span>Ответ: <strong>{item.answer}</strong></span><button onClick={next}>Дальше</button></div>}
        </section>
      </div>
      {showTable && <GrammarTable onClose={() => setShowTable(false)} />}
    </>
  );
}
