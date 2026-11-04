export const PERSONS = [
  { id: 'as', lt: 'aš', ru: 'я' },
  { id: 'tu', lt: 'tu', ru: 'ты' },
  { id: 'jis', lt: 'jis / ji', ru: 'он / она' },
  { id: 'mes', lt: 'mes', ru: 'мы' },
  { id: 'jus', lt: 'jūs', ru: 'вы' },
  { id: 'jie', lt: 'jie / jos', ru: 'они' },
];

// Автономный проверенный мини-набор. После расширения vocab.json источник заменим.
export const VERB_DEMO_ITEMS = [
  {
    infinitive: 'dirbti', ru: 'работать', en: 'to work',
    present: { as: 'dirbu', tu: 'dirbi', jis: 'dirba', mes: 'dirbame', jus: 'dirbate', jie: 'dirba' },
    future: { as: 'dirbsiu', tu: 'dirbsi', jis: 'dirbs', mes: 'dirbsime', jus: 'dirbsite', jie: 'dirbs' },
  },
  {
    infinitive: 'kalbėti', ru: 'говорить', en: 'to speak',
    present: { as: 'kalbu', tu: 'kalbi', jis: 'kalba', mes: 'kalbame', jus: 'kalbate', jie: 'kalba' },
    future: { as: 'kalbėsiu', tu: 'kalbėsi', jis: 'kalbės', mes: 'kalbėsime', jus: 'kalbėsite', jie: 'kalbės' },
  },
  {
    infinitive: 'skaityti', ru: 'читать', en: 'to read',
    present: { as: 'skaitau', tu: 'skaitai', jis: 'skaito', mes: 'skaitome', jus: 'skaitote', jie: 'skaito' },
    future: { as: 'skaitysiu', tu: 'skaitysi', jis: 'skaitys', mes: 'skaitysime', jus: 'skaitysite', jie: 'skaitys' },
  },
  {
    infinitive: 'būti', ru: 'быть', en: 'to be',
    present: { as: 'esu', tu: 'esi', jis: 'yra', mes: 'esame', jus: 'esate', jie: 'yra' },
    future: { as: 'būsiu', tu: 'būsi', jis: 'bus', mes: 'būsime', jus: 'būsite', jie: 'bus' },
  },
  {
    infinitive: 'eiti', ru: 'идти', en: 'to go on foot',
    present: { as: 'einu', tu: 'eini', jis: 'eina', mes: 'einame', jus: 'einate', jie: 'eina' },
    future: { as: 'eisiu', tu: 'eisi', jis: 'eis', mes: 'eisime', jus: 'eisite', jie: 'eis' },
  },
];
