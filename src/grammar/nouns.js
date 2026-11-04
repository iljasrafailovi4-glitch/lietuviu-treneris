export const CASES = [
  ['gen', 'Родительный', 'Kilmininkas', 'ko?'],
  ['dat', 'Дательный', 'Naudininkas', 'kam?'],
  ['acc', 'Винительный', 'Galininkas', 'ką?'],
  ['ins', 'Творительный', 'Įnagininkas', 'kuo?'],
  ['loc', 'Местный', 'Vietininkas', 'kur?'],
  ['voc', 'Звательный', 'Šauksmininkas', '—'],
];

export const ENDINGS = {
  as: { nom: 'as', gen: 'o', dat: 'ui', acc: 'ą', ins: 'u', loc: 'e', voc: 'e' },
  is: { nom: 'is', gen: 'io', dat: 'iui', acc: 'į', ins: 'iu', loc: 'yje', voc: 'i' },
  ys: { nom: 'ys', gen: 'io', dat: 'iui', acc: 'į', ins: 'iu', loc: 'yje', voc: 'y' },
  a: { nom: 'a', gen: 'os', dat: 'ai', acc: 'ą', ins: 'a', loc: 'oje', voc: 'a' },
  ė: { nom: 'ė', gen: 'ės', dat: 'ei', acc: 'ę', ins: 'e', loc: 'ėje', voc: 'e' },
  us: { nom: 'us', gen: 'aus', dat: 'ui', acc: 'ų', ins: 'umi', loc: 'uje', voc: 'au' },
  ius: { nom: 'ius', gen: 'iaus', dat: 'iui', acc: 'ių', ins: 'iumi', loc: 'iuje', voc: 'iau' },
};

const SPECIAL = {
  sesuo: { gen: 'sesers', dat: 'seseriai', acc: 'seserį', ins: 'seseria', loc: 'seseryje', voc: 'seserie' },
  duktė: { gen: 'dukters', dat: 'dukteriai', acc: 'dukterį', ins: 'dukteria', loc: 'dukteryje', voc: 'dukterie' },
  moteris: { gen: 'moters', dat: 'moteriai', acc: 'moterį', ins: 'moterimi', loc: 'moteryje', voc: 'moterie' },
  šuo: { gen: 'šuns', dat: 'šuniui', acc: 'šunį', ins: 'šunimi', loc: 'šunyje', voc: 'šunie' },
  žmogus: { gen: 'žmogaus', dat: 'žmogui', acc: 'žmogų', ins: 'žmogumi', loc: 'žmoguje', voc: 'žmogau' },
  stotis: { gen: 'stoties', dat: 'stočiai', acc: 'stotį', ins: 'stotimi', loc: 'stotyje', voc: 'stotie' },
  pilis: { gen: 'pilies', dat: 'piliai', acc: 'pilį', ins: 'pilimi', loc: 'pilyje', voc: 'pilie' },
  žuvis: { gen: 'žuvies', dat: 'žuviai', acc: 'žuvį', ins: 'žuvimi', loc: 'žuvyje', voc: 'žuvie' },
  naktis: { gen: 'nakties', dat: 'nakčiai', acc: 'naktį', ins: 'naktimi', loc: 'naktyje', voc: 'naktie' },
  vanduo: { gen: 'vandens', dat: 'vandeniui', acc: 'vandenį', ins: 'vandeniu', loc: 'vandenyje', voc: 'vandenie' },
  turgus: { gen: 'turgaus', dat: 'turgui', acc: 'turgų', ins: 'turgumi', loc: 'turguje', voc: 'turgau' },
  medus: { gen: 'medaus', dat: 'medui', acc: 'medų', ins: 'medumi', loc: 'meduje', voc: 'medau' },
};

const ADJECTIVES = new Set(`alkanas aukštas aštrus baltas didelis draugiškas geltonas geras gražus įdomus jaunas jaunesnis jauniausias juodas karštas keptas linksmas liūdnas malonus mažas mėlynas mielas miręs puikus raudonas riebus rūgštus rūkytas saldus senas skanus sotus sūrus šaltas šiltas švelnus šviesus šviežias tamsus vedęs vidurinis virtas vyresnis vyriausias žalias žemas`.split(' '));
const ADVERBS = new Set(['arti', 'blogai', 'čia', 'dažnai', 'gerai', 'kartu', 'kartais', 'kasdien', 'namie', 'niekada', 'paprastai', 'retai', 'rytoj', 'šiaip sau', 'šiandien', 'taip', 'taip pat', 'toli', 'truputį', 'visada']);
const FUNCTION_WORDS = new Set(['bet', 'ir', 'ne', 'o', 'taip']);

const isVerb = (word) => word.endsWith('ti');

const nounClass = (word) => {
  if (SPECIAL[word]) return 'special';
  for (const ending of ['ius', 'ys', 'as', 'is', 'us', 'a', 'ė']) {
    if (word.endsWith(ending)) return ending;
  }
  return null;
};

const inflect = (word, nounType, caseId) => {
  if (SPECIAL[word]?.[caseId]) return SPECIAL[word][caseId];
  const endings = ENDINGS[nounType];
  if (!endings) return null;
  return word.slice(0, -endings.nom.length) + endings[caseId];
};

const isSingleNounCandidate = ({ lt }) =>
  !lt.includes(' ') &&
  !lt.includes(',') &&
  !lt.includes(';') &&
  !lt.includes('/') &&
  !ADJECTIVES.has(lt) &&
  !ADVERBS.has(lt) &&
  !FUNCTION_WORDS.has(lt) &&
  !isVerb(lt);

export const buildCaseTasks = (entries) =>
  entries
    .filter(isSingleNounCandidate)
    .map((entry) => ({ ...entry, cls: nounClass(entry.lt) }))
    .filter((entry) => entry.cls)
    .flatMap((entry) =>
      CASES.map(([id, ruCase, ltCase, question]) => ({
        ...entry,
        id,
        ruCase,
        ltCase,
        q: question,
        answer: inflect(entry.lt, entry.cls, id),
      })),
    )
    .filter((task) => task.answer);
