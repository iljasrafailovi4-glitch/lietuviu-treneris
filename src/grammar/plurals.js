// Автономный набор для раздела «Количество».
// ruForms нужны, чтобы русское задание тоже было грамматически правильным.
export const PLURAL_DEMO_ITEMS = [
  { noun:'bananas', gender:'m', ruForms:{one:'жёлтый банан',few:'жёлтых банана',many:'жёлтых бананов'}, nounForms:{acc_sg:'bananą',acc_pl:'bananus',gen_pl:'bananų'}, adjectiveForms:{acc_sg:'geltoną',acc_pl:'geltonus',gen_pl:'geltonų'} },
  { noun:'arbūzas', gender:'m', ruForms:{one:'большой арбуз',few:'больших арбуза',many:'больших арбузов'}, nounForms:{acc_sg:'arbūzą',acc_pl:'arbūzus',gen_pl:'arbūzų'}, adjectiveForms:{acc_sg:'didelį',acc_pl:'didelius',gen_pl:'didelių'} },
  { noun:'obuolys', gender:'m', ruForms:{one:'зелёное яблоко',few:'зелёных яблока',many:'зелёных яблок'}, nounForms:{acc_sg:'obuolį',acc_pl:'obuolius',gen_pl:'obuolių'}, adjectiveForms:{acc_sg:'žalią',acc_pl:'žalius',gen_pl:'žalių'} },
  { noun:'knyga', gender:'f', ruForms:{one:'новую книгу',few:'новые книги',many:'новых книг'}, nounForms:{acc_sg:'knygą',acc_pl:'knygas',gen_pl:'knygų'}, adjectiveForms:{acc_sg:'naują',acc_pl:'naujas',gen_pl:'naujų'} },
  { noun:'mašina', gender:'f', ruForms:{one:'красную машину',few:'красные машины',many:'красных машин'}, nounForms:{acc_sg:'mašiną',acc_pl:'mašinas',gen_pl:'mašinų'}, adjectiveForms:{acc_sg:'raudoną',acc_pl:'raudonas',gen_pl:'raudonų'} },
];

const NUMERALS = {
  1:{m:'vieną',f:'vieną'},2:{m:'du',f:'dvi'},3:{m:'tris',f:'tris'},4:{m:'keturis',f:'keturias'},5:{m:'penkis',f:'penkias'},6:{m:'šešis',f:'šešias'},7:{m:'septynis',f:'septynias'},8:{m:'aštuonis',f:'aštuonias'},9:{m:'devynis',f:'devynias'},10:{m:'dešimt',f:'dešimt'},11:{m:'vienuolika',f:'vienuolika'},12:{m:'dvylika',f:'dvylika'},13:{m:'trylika',f:'trylika'},14:{m:'keturiolika',f:'keturiolika'},15:{m:'penkiolika',f:'penkiolika'},16:{m:'šešiolika',f:'šešiolika'},17:{m:'septyniolika',f:'septyniolika'},18:{m:'aštuoniolika',f:'aštuoniolika'},19:{m:'devyniolika',f:'devyniolika'},20:{m:'dvidešimt',f:'dvidešimt'}
};
export const quantityPattern=n=>n===1?'acc_sg':n<=9?'acc_pl':'gen_pl';
export const russianQuantityPattern=n=>n===1?'one':n<=4?'few':'many';
export function buildQuantityAnswer(item,number){const p=quantityPattern(number);return `${NUMERALS[number][item.gender]} ${item.adjectiveForms[p]} ${item.nounForms[p]}`;}
export function buildRussianPrompt(item,number){return `Я хочу ${number} ${item.ruForms[russianQuantityPattern(number)]}.`;}
export const QUANTITY_HINTS=[
 {range:'1',number:'vieną',adjective:'вин. ед.',noun:'вин. ед.',example:'vieną didelį arbūzą'},
 {range:'2–9',number:'du / tris / keturis…',adjective:'вин. мн.',noun:'вин. мн.',example:'tris didelius arbūzus'},
 {range:'10–20',number:'dešimt / vienuolika…',adjective:'род. мн.',noun:'род. мн.',example:'dešimt didelių arbūzų'},
];
