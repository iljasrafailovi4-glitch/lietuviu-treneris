import React, { useEffect, useState } from 'react';
import { Dices, SkipForward } from 'lucide-react';
import { normalizeAnswer, shuffle } from '../utils/text';

export default function WordsTrainer({ entries, onResult, onSkip }) {
  const [direction, setDirection] = useState('ru-lt');
  const [deck, setDeck] = useState(() => shuffle(entries));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setDeck(shuffle(entries));
    setIndex(0);
    setInput('');
    setStatus('idle');
  }, [entries]);

  const item = deck[index % Math.max(deck.length, 1)] ?? entries[0];
  if (!item) return <section className="card">Нет слов для тренировки.</section>;

  const expected = direction === 'ru-lt' ? item.lt : item.ru;
  const prompt = direction === 'ru-lt' ? item.ru : item.lt;

  const next = () => {
    setIndex((value) => (value + 1) % Math.max(deck.length, 1));
    setInput('');
    setStatus('idle');
  };

  const reshuffle = () => {
    setDeck(shuffle(entries));
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
    const answers = direction === 'ru-lt' ? [item.lt, ...(item.aliases ?? [])] : [expected];
    const correct = answers.some((answer) => normalizeAnswer(answer) === normalizeAnswer(input));
    setStatus(correct ? 'good' : 'bad');
    onResult(correct);
  };

  return (
    <div className="layout">
      <aside>
        <h3>НАПРАВЛЕНИЕ</h3>
        <button className={direction === 'ru-lt' ? 'active' : ''} onClick={() => { setDirection('ru-lt'); setInput(''); setStatus('idle'); }}>Русский → Литовский</button>
        <button className={direction === 'lt-ru' ? 'active' : ''} onClick={() => { setDirection('lt-ru'); setInput(''); setStatus('idle'); }}>Литовский → Русский</button>
      </aside>
      <section className="card">
        <div className="tools">
          <button title="Перемешать" onClick={reshuffle}><Dices /></button>
          <button title="Другое слово, серия сбросится" onClick={skip}><SkipForward /></button>
        </div>
        <div className="prompt">{prompt}</div>
        <div className="sub">{direction === 'ru-lt' ? 'Напиши по-литовски' : 'Напиши по-русски'}</div>
        <form onSubmit={submit}>
          <input autoFocus value={input} disabled={status !== 'idle'} onChange={(event) => setInput(event.target.value)} placeholder="Введите ответ…" />
          <button disabled={!input.trim() || status !== 'idle'}>Проверить</button>
        </form>
        <div className="casehint">Регистр не важен. Можно писать без литовской раскладки.</div>
        {status !== 'idle' && <div className={'result ' + status}><b>{status === 'good' ? 'Правильно!' : 'Неверно'}</b><span>Ответ: <strong>{expected}</strong></span><button onClick={next}>Дальше</button></div>}
      </section>
    </div>
  );
}
