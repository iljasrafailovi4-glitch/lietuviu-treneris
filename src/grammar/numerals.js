export const NUMERALS = {
  1: { mAcc: 'vieną', fAcc: 'vieną' },
  2: { mAcc: 'du', fAcc: 'dvi' },
  3: { mAcc: 'tris', fAcc: 'tris' },
  4: { mAcc: 'keturis', fAcc: 'keturias' },
  5: { mAcc: 'penkis', fAcc: 'penkias' },
  6: { mAcc: 'šešis', fAcc: 'šešias' },
  7: { mAcc: 'septynis', fAcc: 'septynias' },
  8: { mAcc: 'aštuonis', fAcc: 'aštuonias' },
  9: { mAcc: 'devynis', fAcc: 'devynias' },
  10: { mAcc: 'dešimt', fAcc: 'dešimt' },
  11: { mAcc: 'vienuolika', fAcc: 'vienuolika' },
  12: { mAcc: 'dvylika', fAcc: 'dvylika' },
  13: { mAcc: 'trylika', fAcc: 'trylika' },
  14: { mAcc: 'keturiolika', fAcc: 'keturiolika' },
  15: { mAcc: 'penkiolika', fAcc: 'penkiolika' },
  16: { mAcc: 'šešiolika', fAcc: 'šešiolika' },
  17: { mAcc: 'septyniolika', fAcc: 'septyniolika' },
  18: { mAcc: 'aštuoniolika', fAcc: 'aštuoniolika' },
  19: { mAcc: 'devyniolika', fAcc: 'devyniolika' },
  20: { mAcc: 'dvidešimt', fAcc: 'dvidešimt' },
};

export function numeralAccusative(number, gender) {
  return NUMERALS[number]?.[gender === 'f' ? 'fAcc' : 'mAcc'] ?? String(number);
}

// В конструкции «Aš noriu ...» дополнение стоит в винительном.
// 1 требует винительного единственного; 2–9 — винительного множественного;
// 10–20 управляют родительным множественного.
export function wantedQuantityPattern(number) {
  if (number === 1) return 'acc_sg';
  if (number >= 2 && number <= 9) return 'acc_pl';
  return 'gen_pl';
}
