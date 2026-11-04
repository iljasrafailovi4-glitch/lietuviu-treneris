import React from 'react';
import { Check, Sparkles, Trophy, X } from 'lucide-react';

export default function Stats({ ok, bad, streak, best }) {
  return (
    <section className="stats">
      <div><Check />Правильно <b>{ok}</b></div>
      <div><X />Ошибки <b>{bad}</b></div>
      <div><Sparkles />Серия <b>{streak}</b></div>
      <div><Trophy />Рекорд <b>{best}</b></div>
    </section>
  );
}
