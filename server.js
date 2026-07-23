import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import * as deepl from "deepl-node";
import hangulRomanizationPkg from "hangul-romanization";
import { pinyin } from "pinyin-pro";
import { transliterate } from "transliteration";
import kuroshiroPkg from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const HangulRomanization = hangulRomanizationPkg.default || hangulRomanizationPkg;
const Kuroshiro = kuroshiroPkg.default || kuroshiroPkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Batasi request per IP supaya biaya DeepL tidak jebol kalau ada yang spam/scraping.
// 30 request/menit per IP sudah lebih dari cukup untuk pemakaian normal 1 aplikasi.
const translateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Terlalu banyak permintaan. Coba lagi sebentar lagi." }
});

let translator = null;

function getTranslator() {
  if (!translator) {
    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPL_API_KEY belum dikonfigurasi.");
    }
    translator = new deepl.Translator(apiKey, {
      serverUrl: 'https://api-free.deepl.com'
    });
  }
  return translator;
}

// Daftar bahasa yang didukung DeepL (semua lowercase)
const SUPPORTED_LANGUAGES = [
  'ar', 'bg', 'cs', 'da', 'de', 'el', 'en-us', 'en-gb', 'es', 'et', 'fi',
  'fr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'nl',
  'pl', 'pt-pt', 'pt-br', 'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh'
];

// DeepL membedakan aturan kode bahasa antara source_lang dan target_lang:
// - source_lang TIDAK boleh punya varian regional (harus 'EN', 'PT', bukan 'en-us'/'pt-pt')
// - target_lang UNTUK beberapa bahasa WAJIB pakai varian regional ('en-us'/'en-gb', 'pt-pt'/'pt-br')

// Normalisasi kode bahasa untuk SOURCE (auto-detect atau bahasa asal)
function normalizeSourceLang(code) {
  if (!code || code === 'AUTO') return undefined;

  const upperCode = code.toUpperCase();

  // Source lang tidak boleh punya suffix regional, jadi dipetakan ke bentuk dasarnya
  if (upperCode === 'EN-US' || upperCode === 'EN-GB') return 'EN';
  if (upperCode === 'PT-PT' || upperCode === 'PT-BR') return 'PT';

  return upperCode;
}

// Normalisasi kode bahasa untuk TARGET (bahasa tujuan)
function normalizeTargetLang(code) {
  if (!code) return undefined;

  // Mapping khusus untuk bahasa yang wajib pakai varian regional di target_lang
  const map = {
    'EN': 'en-us',
    'EN-US': 'en-us',
    'EN-GB': 'en-gb',
    'PT': 'pt-pt',
    'PT-PT': 'pt-pt',
    'PT-BR': 'pt-br'
  };

  const upperCode = code.toUpperCase();
  if (map[upperCode]) return map[upperCode];

  // Untuk bahasa lain, lowercase (misal 'ID' -> 'id', 'KO' -> 'ko')
  return code.toLowerCase();
}

// ==========================================================
// FALLBACK GEMINI — untuk bahasa yang TIDAK didukung DeepL sama sekali
// (Thailand, Vietnam, Hindi). DeepL tetap dipakai untuk semua bahasa lain
// karena kualitasnya lebih konsisten untuk terjemahan.
// ==========================================================
const GEMINI_FALLBACK_LANGUAGES = {
  TH: { name: 'Thai', romanize: true },
  VI: { name: 'Vietnamese', romanize: false }, // sudah pakai huruf Latin
  HI: { name: 'Hindi', romanize: true }
};

const GEMINI_MODEL = 'gemini-3.5-flash';

// Nama lengkap tiap kode bahasa yang tersedia di app, dipakai untuk menyusun
// prompt Gemini yang lebih jelas (mis. "from Indonesian" bukan cuma "from ID").
const LANGUAGE_NAMES = {
  KO: 'Korean', EN: 'English', ID: 'Indonesian', JA: 'Japanese', ZH: 'Chinese',
  FR: 'French', DE: 'German', ES: 'Spanish', IT: 'Italian', RU: 'Russian',
  AR: 'Arabic', PT: 'Portuguese', TR: 'Turkish', NL: 'Dutch', PL: 'Polish',
  SV: 'Swedish', BG: 'Bulgarian', CS: 'Czech', DA: 'Danish', EL: 'Greek',
  ET: 'Estonian', FI: 'Finnish', HU: 'Hungarian', LT: 'Lithuanian', LV: 'Latvian',
  NB: 'Norwegian', RO: 'Romanian', SK: 'Slovak', SL: 'Slovenian', UK: 'Ukrainian',
  TH: 'Thai', VI: 'Vietnamese', HI: 'Hindi'
};

async function translateWithGemini(text, sourceLangCode, targetLangCode) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi (dibutuhkan untuk bahasa Thai/Vietnam/Hindi).");
  }

  const targetInfo = GEMINI_FALLBACK_LANGUAGES[targetLangCode];
  const targetName = targetInfo ? targetInfo.name : (LANGUAGE_NAMES[targetLangCode] || targetLangCode);
  const sourceInstruction = (sourceLangCode && sourceLangCode !== 'AUTO')
    ? `from ${LANGUAGE_NAMES[sourceLangCode] || sourceLangCode} `
    : '';

  const prompt = `Translate the following text ${sourceInstruction}into ${targetName}. ` +
    `Reply with ONLY the translated text, no explanation, no quotes, no notes.\n\nText: """${text}"""`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        thinkingConfig: { thinkingLevel: "low" }
      }
    })
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Gemini API error (${response.status}): ${errBody.slice(0, 200)}`);
  }

  const data = await response.json();
  const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!translated || !translated.trim()) {
    throw new Error("Gemini tidak mengembalikan hasil terjemahan.");
  }

  return translated.trim();
}

// ==========================================================
// ROMANISASI — mengubah hasil terjemahan non-Latin jadi bacaan Latin
// ==========================================================

// Kuroshiro (Jepang) perlu di-init sekali dengan kamus kuromoji.
// Prosesnya agak lambat (±2-3 detik) jadi dibuat singleton + lazy-load
// supaya hanya terjadi sekali seumur hidup server, bukan tiap request.
let kuroshiroInstance = null;
let kuroshiroInitPromise = null;

function getKuroshiro() {
  if (!kuroshiroInitPromise) {
    kuroshiroInstance = new Kuroshiro();
    kuroshiroInitPromise = kuroshiroInstance
      .init(new KuromojiAnalyzer())
      .then(() => kuroshiroInstance)
      .catch((err) => {
        console.error("⚠️ Gagal inisialisasi Kuroshiro (romanisasi Jepang):", err.message);
        kuroshiroInitPromise = null; // biar bisa dicoba lagi di request berikutnya
        throw err;
      });
  }
  return kuroshiroInitPromise;
}

// Bahasa yang romanisasinya ditangani via library 'transliteration' generik
// (Arab, Yunani, Rusia, Bulgaria, Ukraina — non-Latin tapi tanpa library khusus)
const GENERIC_TRANSLITERATE_LANGS = new Set(['ar', 'el', 'ru', 'bg', 'uk']);

async function getRomanization(text, targetLangCode) {
  if (!text || !targetLangCode) return "";

  try {
    const lang = targetLangCode.toLowerCase();

    if (lang === 'ko') {
      return HangulRomanization.convert(text);
    }

    if (lang === 'zh') {
      return pinyin(text, { toneType: 'symbol', type: 'string' });
    }

    if (lang === 'ja') {
      const kuroshiro = await getKuroshiro();
      return await kuroshiro.convert(text, {
        to: 'romaji',
        mode: 'spaced',
        romajiSystem: 'hepburn'
      });
    }

    if (GENERIC_TRANSLITERATE_LANGS.has(lang)) {
      return transliterate(text);
    }

    // Bahasa berbasis Latin (id, en, fr, de, dst) tidak butuh romanisasi
    return "";
  } catch (err) {
    console.error("⚠️ Romanisasi gagal, dilewati:", err.message);
    return ""; // gagal romanisasi tidak boleh membuat translate gagal total
  }
}

app.post("/api/translate", translateLimiter, async (req, res) => {
  console.log(`📥 Request: ${req.body?.sourceLang || 'AUTO'} → ${req.body?.targetLang}`);
  try {
    const { text, sourceLang, targetLang, formality } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Teks tidak boleh kosong" });
    }

    const targetUpper = (targetLang || '').toUpperCase();
    const sourceUpper = (sourceLang || '').toUpperCase();

    // Bahasa yang tidak didukung DeepL sama sekali → alihkan ke Gemini
    if (GEMINI_FALLBACK_LANGUAGES[targetUpper] || GEMINI_FALLBACK_LANGUAGES[sourceUpper]) {
      try {
        console.log(`🔄 Menerjemahkan ke ${targetUpper} dengan Gemini (fallback, tidak didukung DeepL)...`);
        const translatedText = await translateWithGemini(text, sourceUpper, targetUpper);
        console.log(`✅ Terjemahan Gemini berhasil (${translatedText.length} karakter)`);

        const targetInfo = GEMINI_FALLBACK_LANGUAGES[targetUpper];
        let romanization = "";
        if (targetInfo && targetInfo.romanize) {
          try {
            romanization = transliterate(translatedText);
          } catch (err) {
            console.error("⚠️ Romanisasi Gemini fallback gagal, dilewati:", err.message);
          }
        }

        return res.json({ translation: translatedText, romanization });
      } catch (err) {
        console.error("❌ Gemini fallback error:", err);
        return res.status(500).json({ error: err.message || "Gagal menerjemahkan teks (Gemini)." });
      }
    }

    let translator;
    try {
      translator = getTranslator();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }

    // Normalisasi kode bahasa (source dan target punya aturan berbeda)
    const src = normalizeSourceLang(sourceLang);
    const tgt = normalizeTargetLang(targetLang);

    if (!tgt) {
      return res.status(400).json({ error: "Target language tidak valid." });
    }

    // Cek apakah target language didukung (case insensitive)
    const tgtLower = tgt.toLowerCase();
    if (!SUPPORTED_LANGUAGES.includes(tgtLower)) {
      return res.status(400).json({
        error: `Bahasa target "${tgt}" tidak didukung oleh DeepL. Daftar bahasa yang didukung: ${SUPPORTED_LANGUAGES.join(', ')}`
      });
    }

    const formalityLevel = formality === "more" ? "more" : formality === "less" ? "less" : "default";

    console.log(`🔄 Menerjemahkan ke ${tgt} dengan DeepL...`);

    const result = await translator.translateText(
      text,
      src,      // undefined = auto detect
      tgt,
      { formality: formalityLevel }
    );

    console.log(`✅ Terjemahan berhasil (${result.text.length} karakter)`);

    const romanization = await getRomanization(result.text, tgt);
    if (romanization) {
      console.log(`🔤 Romanisasi ditambahkan`);
    }

    res.json({
      translation: result.text,
      romanization
    });
  } catch (error) {
    console.error("❌ Translation error:", error);
    if (error instanceof deepl.DeepLError) {
      return res.status(500).json({ error: `DeepL Error: ${error.message}` });
    }
    res.status(500).json({ error: error.message || "Gagal menerjemahkan teks." });
  }
});

app.get("/api/test", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔑 Pastikan DEEPL_API_KEY sudah diatur di environment variables.`);
});