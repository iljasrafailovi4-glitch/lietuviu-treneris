import React from 'react';
import { CASES, ENDINGS } from '../grammar/nouns';

export default function GrammarTable({ onClose }) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modalBox" onClick={(event) => event.stopPropagation()}>
        <div className="modalHead">
          <h2>Падежи: вопросы и окончания</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>
        <div className="tableWrap">
          <table>
            <thead><tr><th>Падеж</th><th>Вопрос</th><th>-as</th><th>-is</th><th>-a</th><th>-ė</th><th>-us</th></tr></thead>
            <tbody>
              {CASES.map(([id, ruCase, ltCase, question]) => (
                <tr key={id}>
                  <td><b>{ruCase}</b><small>{ltCase}</small></td>
                  <td>{question}</td>
                  {['as', 'is', 'a', 'ė', 'us'].map((ending) => <td key={ending}>{ENDINGS[ending]?.[id] ?? '—'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
