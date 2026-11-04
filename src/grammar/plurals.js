import { adjectiveForQuantity } from './adjectives';
import { numeralAccusative, wantedQuantityPattern } from './numerals';

// Проверенный автономный набор для конструкции «Aš noriu ...».
export const PLURAL_DEMO_ITEMS = [
  { noun: 'bananas', ruNoun: 'банан', gender: 'm', nounForms: { acc_sg: 'bananą', acc_pl: 'bananus', gen_pl: 'bananų' }, adjective: 'geltonas', ruAdjective: 'жёлтый', adjectiveForms: { acc_sg: 'geltoną', acc_pl: 'geltonus', gen_pl: 'geltonų' } },
  { noun: 'arbūzas', ruNoun: 'арбуз', gender: 'm', nounForms: { acc_sg: 'arbūzą', acc_pl: 'arbūzus', gen_pl: 'arbūzų' }, adjective: 'didelis', ruAdjective: 'большой', adjectiveForms: { acc_sg: 'didelį', acc_pl: 'didelius', gen_pl: 'didelių' } },
  { noun: 'obuolys', ruNoun: 'яблоко', gender: 'm', nounForms: { acc_sg: 'obuolį', acc_pl: 'obuolius', gen_pl: 'obuolių' }, adjective: 'žalias', ruAdjective: 'зелёный', adjectiveForms: { acc_sg: 'žalią', acc_pl: 'žalius', gen_pl: 'žalių' } },
  { noun: 'knyga', ruNoun: 'книга', gender: 'f', nounForms: { acc_sg: 'knygą', acc_pl: 'knygas', gen_pl: 'knygų' }, adjective: 'nauja', ruAdjective: 'новая', adjectiveForms: { acc_sg: 'naują', acc_pl: 'naujas', gen_pl: 'naujų' } },
  { noun: 'mašina', ruNoun: 'машина', gender: 'f', nounForms: { acc_sg: 'mašiną', acc_pl: 'mašinas', gen_pl: 'mašinų' }, adjective: 'raudona', ruAdjective: 'красная', adjectiveForms: { acc_sg: 'raudoną', acc_pl: 'raudonas', gen_pl: 'raudonų' } },
];

export function buildQuantityAnswer(item, number) {
  const pattern = wantedQuantityPattern(number);
  const numeral = numeralAccusative(number, item.gender);
  const adjective = adjectiveForQuantity(item, pattern);
  const noun = item.nounForms[pattern];
  return `${numeral} ${adjective} ${noun}`;
}
