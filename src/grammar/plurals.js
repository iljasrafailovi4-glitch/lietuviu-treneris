// CONSTRUCTION GOVERNMENT
// patinka / nepatinka: the liked item is the grammatical subject -> nominative
// norėti: governs genitive (ko?) even in the affirmative
// mėgti / turėti: affirmative direct object -> accusative; negated -> genitive
export const CONSTRUCTIONS = [
  { id:'patinka', lt:'Man patinka', ruOne:'Мне нравится', ruMany:'Мне нравятся', caseId:'nom', caseRu:'именительный', question:'kas?' },
  { id:'nepatinka', lt:'Man nepatinka', ruOne:'Мне не нравится', ruMany:'Мне не нравятся', caseId:'nom', caseRu:'именительный', question:'kas?' },
  { id:'megstu', lt:'Aš mėgstu', ruOne:'Я люблю', ruMany:'Я люблю', caseId:'acc', caseRu:'винительный', question:'ką?' },
  { id:'nemegstu', lt:'Aš nemėgstu', ruOne:'Я не люблю', ruMany:'Я не люблю', caseId:'gen', caseRu:'родительный', question:'ko?' },
  { id:'noriu', lt:'Aš noriu', ruOne:'Я хочу', ruMany:'Я хочу', caseId:'gen', caseRu:'родительный', question:'ko?' },
  { id:'nenoriu', lt:'Aš nenoriu', ruOne:'Я не хочу', ruMany:'Я не хочу', caseId:'gen', caseRu:'родительный', question:'ko?' },
  { id:'turiu', lt:'Aš turiu', ruOne:'У меня есть', ruMany:'У меня есть', caseId:'acc', caseRu:'винительный', question:'ką?' },
  { id:'neturiu', lt:'Aš neturiu', ruOne:'У меня нет', ruMany:'У меня нет', caseId:'gen', caseRu:'родительный', question:'ko?' },
];

const NUMERALS = {
  1:{nom:{m:'vienas',f:'viena'},acc:{m:'vieną',f:'vieną'},gen:{m:'vieno',f:'vienos'}},
  2:{nom:{m:'du',f:'dvi'},acc:{m:'du',f:'dvi'},gen:{m:'dviejų',f:'dviejų'}},
  3:{nom:{m:'trys',f:'trys'},acc:{m:'tris',f:'tris'},gen:{m:'trijų',f:'trijų'}},
  4:{nom:{m:'keturi',f:'keturios'},acc:{m:'keturis',f:'keturias'},gen:{m:'keturių',f:'keturių'}},
  5:{nom:{m:'penki',f:'penkios'},acc:{m:'penkis',f:'penkias'},gen:{m:'penkių',f:'penkių'}},
  6:{nom:{m:'šeši',f:'šešios'},acc:{m:'šešis',f:'šešias'},gen:{m:'šešių',f:'šešių'}},
  7:{nom:{m:'septyni',f:'septynios'},acc:{m:'septynis',f:'septynias'},gen:{m:'septynių',f:'septynių'}},
  8:{nom:{m:'aštuoni',f:'aštuonios'},acc:{m:'aštuonis',f:'aštuonias'},gen:{m:'aštuonių',f:'aštuonių'}},
  9:{nom:{m:'devyni',f:'devynios'},acc:{m:'devynis',f:'devynias'},gen:{m:'devynių',f:'devynių'}},
  10:{nom:'dešimt',acc:'dešimt',gen:'dešimties'},11:{nom:'vienuolika',acc:'vienuolika',gen:'vienuolikos'},12:{nom:'dvylika',acc:'dvylika',gen:'dvylikos'},13:{nom:'trylika',acc:'trylika',gen:'trylikos'},14:{nom:'keturiolika',acc:'keturiolika',gen:'keturiolikos'},15:{nom:'penkiolika',acc:'penkiolika',gen:'penkiolikos'},16:{nom:'šešiolika',acc:'šešiolika',gen:'šešiolikos'},17:{nom:'septyniolika',acc:'septyniolika',gen:'septyniolikos'},18:{nom:'aštuoniolika',acc:'aštuoniolika',gen:'aštuoniolikos'},19:{nom:'devyniolika',acc:'devyniolika',gen:'devyniolikos'},20:{nom:'dvidešimt',acc:'dvidešimt',gen:'dvidešimties'}
};

export const PLURAL_DEMO_ITEMS = [
  { gender:'m', ru:{nomOne:'большой арбуз',accOne:'большой арбуз',few:'больших арбуза',many:'больших арбузов'}, forms:{nom_sg:['didelis','arbūzas'],nom_pl:['dideli','arbūzai'],acc_sg:['didelį','arbūzą'],acc_pl:['didelius','arbūzus'],gen_sg:['didelio','arbūzo'],gen_pl:['didelių','arbūzų']} },
  { gender:'m', ru:{nomOne:'жёлтый банан',accOne:'жёлтый банан',few:'жёлтых банана',many:'жёлтых бананов'}, forms:{nom_sg:['geltonas','bananas'],nom_pl:['geltoni','bananai'],acc_sg:['geltoną','bananą'],acc_pl:['geltonus','bananus'],gen_sg:['geltono','banano'],gen_pl:['geltonų','bananų']} },
  { gender:'m', ru:{nomOne:'зелёное яблоко',accOne:'зелёное яблоко',few:'зелёных яблока',many:'зелёных яблок'}, forms:{nom_sg:['žalias','obuolys'],nom_pl:['žali','obuoliai'],acc_sg:['žalią','obuolį'],acc_pl:['žalius','obuolius'],gen_sg:['žalio','obuolio'],gen_pl:['žalių','obuolių']} },
  { gender:'f', ru:{nomOne:'новая книга',accOne:'новую книгу',few:'новые книги',many:'новых книг'}, forms:{nom_sg:['nauja','knyga'],nom_pl:['naujos','knygos'],acc_sg:['naują','knygą'],acc_pl:['naujas','knygas'],gen_sg:['naujos','knygos'],gen_pl:['naujų','knygų']} },
  { gender:'f', ru:{nomOne:'красная машина',accOne:'красную машину',few:'красные машины',many:'красных машин'}, forms:{nom_sg:['raudona','mašina'],nom_pl:['raudonos','mašinos'],acc_sg:['raudoną','mašiną'],acc_pl:['raudonas','mašinas'],gen_sg:['raudonos','mašinos'],gen_pl:['raudonų','mašinų']} },
];
function numeralForm(number,caseId,gender){const value=NUMERALS[number]?.[caseId];return typeof value==='string'?value:value?.[gender];}
function formKey(number,caseId){if(caseId==='gen')return number===1?'gen_sg':'gen_pl';if(number>=10)return'gen_pl';if(caseId==='nom')return number===1?'nom_sg':'nom_pl';return number===1?'acc_sg':'acc_pl';}
function russianObject(item,number,construction){if(number===1)return construction.caseId==='nom'?item.ru.nomOne:item.ru.accOne;return number>=2&&number<=4?item.ru.few:item.ru.many;}
export function buildExercise(item,number,construction){const key=formKey(number,construction.caseId);const[adjective,noun]=item.forms[key];return{answer:`${numeralForm(number,construction.caseId,item.gender)} ${adjective} ${noun}`,russian:`${number===1?construction.ruOne:construction.ruMany} ${number} ${russianObject(item,number,construction)}.`,lithuanian:`${construction.lt} ___ ___ ___.`,formKey:key};}
export const CONSTRUCTION_HINTS = [
 {construction:'Man patinka / nepatinka',case:'Именительный',question:'kas?',example:'trys dideli arbūzai'},
 {construction:'Aš mėgstu / turiu',case:'Винительный',question:'ką?',example:'tris didelius arbūzus'},
 {construction:'Aš noriu / nenoriu',case:'Родительный',question:'ko?',example:'trijų didelių arbūzų'},
 {construction:'Aš nemėgstu / neturiu',case:'Родительный',question:'ko?',example:'trijų didelių arbūzų'},
 {construction:'10–20 после родительного управления',case:'Родительный всей группы',question:'ko?',example:'dešimties didelių arbūzų'},
];
