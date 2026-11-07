import { Analytics } from '@vercel/analytics/react';
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Brain, Languages, ListPlus, RotateCcw, Speech } from 'lucide-react';
import rawVocab from './vocab.json';
import './styles.css';
import './styles-header-v11.css';
import './styles-plural-v10-5.css';
import Stats from './components/Stats';
import { buildCaseTasks } from './grammar/nouns';
import CasesTrainer from './trainers/CasesTrainer';
import PluralTrainer from './trainers/PluralTrainer';
import VerbsTrainer from './trainers/VerbsTrainer';
import WordsTrainer from './trainers/WordsTrainer';

const CORRECTIONS = { bazilikai: { lt: 'bazilikas', ru: 'базилик', aliases: ['bazilikai'] }, 'gabaliukas; gabalėlis': { lt: 'gabaliukas', ru: 'кусочек', aliases: ['gabalėlis'] } };
const entries = rawVocab.map((item) => { const lt = item.lt ?? item.word ?? ''; const ru = item.ru ?? item.translation ?? ''; const correction = CORRECTIONS[lt]; return correction ? { ...item, ...correction } : { ...item, lt, ru, aliases: item.aliases ?? [] }; }).filter((item) => item.lt && item.ru);

function App() {
  const [mode, setMode] = useState('vocab');
  const [ok, setOk] = useState(0), [bad, setBad] = useState(0), [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('ltBest10')) || 0);
  const caseTasks = useMemo(() => buildCaseTasks(entries), []);
  const handleResult = (correct) => { if (!correct) { setBad((v) => v + 1); setStreak(0); return; } setOk((v) => v + 1); setStreak((v) => { const next = v + 1; if (next > best) { setBest(next); localStorage.setItem('ltBest10', String(next)); } return next; }); };
  const common = { onResult: handleResult, onSkip: () => setStreak(0) };
  return <main><div className="shell"><header><div className="brand"><BookOpen /> LIETUVIŲ KALBA</div><h1>Литовский тренажёр</h1><p>Слова, падежи, количество и глаголы.</p><div className="switch switchFour"><button className={mode === 'vocab' ? 'on' : ''} onClick={() => setMode('vocab')}><Languages />Слова</button><button className={mode === 'cases' ? 'on' : ''} onClick={() => setMode('cases')}><Brain />Падежи</button><button className={mode === 'plural' ? 'on' : ''} onClick={() => setMode('plural')}><ListPlus />Числительные</button><button className={mode === 'verbs' ? 'on' : ''} onClick={() => setMode('verbs')}><Speech />Глаголы</button></div></header><Stats ok={ok} bad={bad} streak={streak} best={best} />{mode === 'vocab' && <WordsTrainer entries={entries} {...common} />}{mode === 'cases' && <CasesTrainer tasks={caseTasks} {...common} />}{mode === 'plural' && <PluralTrainer {...common} />}{mode === 'verbs' && <VerbsTrainer {...common} />}<button className="reset" onClick={() => { setOk(0); setBad(0); setStreak(0); }}><RotateCcw />Сбросить статистику</button></div></main>;
}
createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Analytics />
  </>
);
