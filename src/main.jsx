import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Brain, Languages, RotateCcw } from 'lucide-react';
import rawVocab from './vocab.json';
import './styles.css';
import Stats from './components/Stats';
import { buildCaseTasks } from './grammar/nouns';
import CasesTrainer from './trainers/CasesTrainer';
import WordsTrainer from './trainers/WordsTrainer';

const CORRECTIONS = {
  bazilikai: { lt: 'bazilikas', ru: 'базилик', aliases: ['bazilikai'] },
  'gabaliukas; gabalėlis': { lt: 'gabaliukas', ru: 'кусочек', aliases: ['gabalėlis'] },
};

const entries = rawVocab
  .map((item) => {
    const lt = item.lt ?? item.word ?? '';
    const ru = item.ru ?? item.translation ?? '';
    const correction = CORRECTIONS[lt];
    return correction ? { ...item, ...correction } : { ...item, lt, ru, aliases: item.aliases ?? [] };
  })
  .filter((item) => item.lt && item.ru);

function App() {
  const [mode, setMode] = useState('vocab');
  const [ok, setOk] = useState(0);
  const [bad, setBad] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('ltBest9')) || 0);
  const caseTasks = useMemo(() => buildCaseTasks(entries), []);

  const handleResult = (correct) => {
    if (!correct) {
      setBad((value) => value + 1);
      setStreak(0);
      return;
    }
    setOk((value) => value + 1);
    setStreak((value) => {
      const next = value + 1;
      if (next > best) {
        setBest(next);
        localStorage.setItem('ltBest9', String(next));
      }
      return next;
    });
  };

  const resetStats = () => {
    setOk(0);
    setBad(0);
    setStreak(0);
  };

  return (
    <main>
      <div className="shell">
        <header>
          <div className="brand"><BookOpen /> LIETUVIŲ KALBA</div>
          <h1>Литовский тренажёр</h1>
          <p>Слова, переводы и склонение существительных.</p>
          <div className="switch">
            <button className={mode === 'vocab' ? 'on' : ''} onClick={() => setMode('vocab')}><Languages />Слова</button>
            <button className={mode === 'cases' ? 'on' : ''} onClick={() => setMode('cases')}><Brain />Падежи</button>
          </div>
        </header>
        <Stats ok={ok} bad={bad} streak={streak} best={best} />
        {mode === 'vocab'
          ? <WordsTrainer entries={entries} onResult={handleResult} onSkip={() => setStreak(0)} />
          : <CasesTrainer tasks={caseTasks} onResult={handleResult} onSkip={() => setStreak(0)} />}
        <button className="reset" onClick={resetStats}><RotateCcw />Сбросить статистику</button>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
