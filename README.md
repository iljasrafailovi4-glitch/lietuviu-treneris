# v10 — Количество и глаголы без нового vocab.json

Добавлены автономные модули:
- `trainers/PluralTrainer.jsx`
- `trainers/VerbsTrainer.jsx`
- `grammar/numerals.js`
- `grammar/adjectives.js`
- `grammar/plurals.js`
- `grammar/verbs.js`
- `styles-v10.css`
- обновлённый `main.jsx`

Текущие `vocab.json`, `WordsTrainer.jsx`, `CasesTrainer.jsx`, `nouns.js`, `styles.css` не заменяются.

## Установка
1. Заменить `src/main.jsx`.
2. Добавить новые файлы в `src/trainers/` и `src/grammar/`.
3. Добавить `src/styles-v10.css`.
4. Commit changes.

Новые модули используют собственный небольшой проверенный набор, поэтому не зависят от будущего большого vocabulary.
