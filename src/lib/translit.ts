// Romanized Nepali → Devanagari transliteration (Nepali Typing tool).
//
// Scheme (standard for simple Nepali IMEs):
//  - "aa" → ा / आ, "i" → ि / इ, "ee|ii" → ी / ई, "u" → ु / उ,
//    "oo|uu" → ू / ऊ, "e" → े / ए, "o" → ो / ओ, "ai" → ै / ऐ, "au" → औ.
//  - A single "a" inside a word is an implicit schwa (invisible), so
//    "nepaal" gives नेपाल and "namaste" gives नमस्ते.
//  - Two consonants typed back-to-back (e.g. "st") get a halant: स्त.
//  - A trailing single "a" at the end of a word becomes ा ("mama" → ममा).
//  - Capital letters add retroflex/alveolar sounds: T → ट, D → ड, N → ण.
//  - A vowel letter where a consonant is expected emits an independent
//    vowel (long form at word end): "bhaai" → भाई.

const CONS: Array<[string, string]> = [
  ["chh", "छ"], ["kh", "ख"], ["gh", "घ"], ["jh", "झ"], ["th", "थ"],
  ["dh", "ध"], ["ph", "फ"], ["bh", "भ"], ["sh", "श"], ["ch", "च"],
  ["ksh", "क्ष"], ["Tr", "त्र्"], ["ny", "ञ"], ["ky", "क्य"], ["gy", "ज्ञ"],
  ["k", "क"], ["g", "ग"], ["j", "ज"], ["t", "त"], ["d", "द"], ["n", "न"],
  ["p", "प"], ["b", "ब"], ["m", "म"], ["y", "य"], ["r", "र"], ["l", "ल"],
  ["w", "व"], ["v", "व"], ["s", "स"], ["h", "ह"], ["f", "फ"],
  ["T", "ट"], ["D", "ड"], ["N", "ण"],
];

const MATRAS: Array<[string, string]> = [
  ["aa", "ा"], ["ai", "ै"], ["au", "ौ"], ["ee", "ी"], ["ii", "ी"],
  ["oo", "ू"], ["uu", "ू"], ["e", "े"], ["o", "ो"], ["i", "ि"], ["u", "ु"], ["a", ""],
];

const START_VOWELS: Array<[string, string]> = [
  ["aa", "आ"], ["ai", "ऐ"], ["au", "औ"], ["ee", "ई"], ["ii", "ई"],
  ["oo", "ऊ"], ["uu", "ऊ"], ["e", "ए"], ["o", "ओ"], ["i", "इ"], ["u", "उ"], ["a", "अ"],
];

const CONS_SORTED = [...CONS].sort((x, y) => y[0].length - x[0].length);
const MATRAS_SORTED = [...MATRAS].sort((x, y) => y[0].length - x[0].length);
const START_VOWELS_SORTED = [...START_VOWELS].sort((x, y) => y[0].length - x[0].length);

const VOWELS = "aeiou";
const isLetter = (c: string) => /[a-zA-Z]/.test(c);

export function transliterate(input: string): string {
  let out = "";
  let i = 0;
  let pendingCons = false; // a consonant was last emitted, no vowel since
  let started = false; // emitted anything for the current word?

  while (i < input.length) {
    const ch = input[i];
    if (!isLetter(ch)) {
      out += ch;
      i += 1;
      started = false;
      pendingCons = false;
      continue;
    }

    // Word-initial vowel → independent vowel letter.
    if (!started && VOWELS.includes(ch)) {
      let matched = false;
      for (const [rom, dev] of START_VOWELS_SORTED) {
        if (input.startsWith(rom, i)) {
          out += dev;
          i += rom.length;
          matched = true;
          break;
        }
      }
      if (!matched) { out += ch; i += 1; }
      started = true;
      continue;
    }
    started = true;

    // Consonant expected: match a consonant (longest first, case-sensitive)?
    let consDev: string | null = null;
    let consLen = 0;
    for (const [rom, dev] of CONS_SORTED) {
      if (input.startsWith(rom, i)) { consDev = dev; consLen = rom.length; break; }
    }
    if (consDev) {
      if (pendingCons) { out += "्"; } // स + t → स्त
      pendingCons = false;
      out += consDev;
      i += consLen;
      // Consume ONE vowel run after the consonant (matras don't chain).
      let hadVowel = false;
      if (i < input.length && isLetter(input[i]) && VOWELS.includes(input[i].toLowerCase())) {
        let vMatched = false;
        for (const [rom, dev] of MATRAS_SORTED) {
          if (input.startsWith(rom, i)) {
            if (rom === "a") {
              const atEnd = !(i + 1 < input.length && isLetter(input[i + 1]));
              if (atEnd) out += "ा";
            } else {
              out += dev;
            }
            i += rom.length;
            hadVowel = true;
            vMatched = true;
            break;
          }
        }
        void vMatched;
      }
      pendingCons = !hadVowel;
      continue;
    }

    // Vowel letter where a consonant was expected → independent vowel
    // (long form at the end of the word: bhaai → भाई).
    const atWordEnd = !(i + 1 < input.length && isLetter(input[i + 1]));
    const endLong: Record<string, string> = { i: "ई", u: "ऊ", a: "आ" };
    if (atWordEnd && endLong[ch]) {
      out += endLong[ch];
      i += 1;
      continue;
    }
    let matchedInd = false;
    for (const [rom, dev] of START_VOWELS_SORTED) {
      if (input.startsWith(rom, i)) {
        out += dev;
        i += rom.length;
        matchedInd = true;
        break;
      }
    }
    if (!matchedInd) { out += ch; i += 1; }
    pendingCons = false;
  }
  return out;
}

export const TRANSLIT_SAMPLES: Array<[string, string]> = [
  ["namaste", "नमस्ते"],
  ["nepaal", "नेपाल"],
  ["mero desh nepal ho", "मेरो देश नेपल हो"],
  ["bhaai", "भाई"],
  ["mama", "ममा"],
];
