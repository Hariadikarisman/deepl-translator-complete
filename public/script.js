/* =====================================================
   Haka Translator AI - Standalone Premium Vanilla JS Engine
   Supports 35+ languages, STT, TTS, full-featured history & favorites
===================================================== */

(function () {
  'use strict';

  // ---- LANGUAGE DATABASE (35+ Premium Languages) ----
  const languages = [
    { code: 'AUTO', name: 'Detect', flag: '🌐', ttsCode: 'id-ID', speechCode: 'id-ID' },
    { code: 'KO', name: 'Korean', flag: '🇰🇷', ttsCode: 'ko-KR', speechCode: 'ko-KR' },
    { code: 'EN', name: 'English', flag: '🇺🇸', ttsCode: 'en-US', speechCode: 'en-US' },
    { code: 'ID', name: 'Indonesian', flag: '🇮🇩', ttsCode: 'id-ID', speechCode: 'id-ID' },
    { code: 'JA', name: 'Japanese', flag: '🇯🇵', ttsCode: 'ja-JP', speechCode: 'ja-JP' },
    { code: 'ZH', name: 'Chinese', flag: '🇨🇳', ttsCode: 'zh-CN', speechCode: 'zh-CN' },
    { code: 'FR', name: 'French', flag: '🇫🇷', ttsCode: 'fr-FR', speechCode: 'fr-FR' },
    { code: 'DE', name: 'German', flag: '🇩🇪', ttsCode: 'de-DE', speechCode: 'de-DE' },
    { code: 'ES', name: 'Spanish', flag: '🇪🇸', ttsCode: 'es-ES', speechCode: 'es-ES' },
    { code: 'IT', name: 'Italian', flag: '🇮🇹', ttsCode: 'it-IT', speechCode: 'it-IT' },
    { code: 'RU', name: 'Russian', flag: '🇷🇺', ttsCode: 'ru-RU', speechCode: 'ru-RU' },
    { code: 'AR', name: 'Arabic', flag: '🇸🇦', ttsCode: 'ar-SA', speechCode: 'ar-SA' },
    { code: 'PT', name: 'Portuguese', flag: '🇵🇹', ttsCode: 'pt-PT', speechCode: 'pt-PT' },
    { code: 'TR', name: 'Turkish', flag: '🇹🇷', ttsCode: 'tr-TR', speechCode: 'tr-TR' },
    { code: 'NL', name: 'Dutch', flag: '🇳🇱', ttsCode: 'nl-NL', speechCode: 'nl-NL' },
    { code: 'PL', name: 'Polish', flag: '🇵🇱', ttsCode: 'pl-PL', speechCode: 'pl-PL' },
    { code: 'SV', name: 'Swedish', flag: '🇸🇪', ttsCode: 'sv-SE', speechCode: 'sv-SE' },
    { code: 'VI', name: 'Vietnamese', flag: '🇻🇳', ttsCode: 'vi-VN', speechCode: 'vi-VN' },
    { code: 'TH', name: 'Thai', flag: '🇹🇭', ttsCode: 'th-TH', speechCode: 'th-TH' },
    { code: 'HI', name: 'Hindi', flag: '🇮🇳', ttsCode: 'hi-IN', speechCode: 'hi-IN' },
    { code: 'BG', name: 'Bulgarian', flag: '🇧🇬', ttsCode: 'bg-BG', speechCode: 'bg-BG' },
    { code: 'CS', name: 'Czech', flag: '🇨🇿', ttsCode: 'cs-CZ', speechCode: 'cs-CZ' },
    { code: 'DA', name: 'Danish', flag: '🇩🇰', ttsCode: 'da-DK', speechCode: 'da-DK' },
    { code: 'EL', name: 'Greek', flag: '🇬🇷', ttsCode: 'el-GR', speechCode: 'el-GR' },
    { code: 'ET', name: 'Estonian', flag: '🇪🇪', ttsCode: 'et-EE', speechCode: 'et-EE' },
    { code: 'FI', name: 'Finnish', flag: '🇫🇮', ttsCode: 'fi-FI', speechCode: 'fi-FI' },
    { code: 'HU', name: 'Hungarian', flag: '🇭🇺', ttsCode: 'hu-HU', speechCode: 'hu-HU' },
    { code: 'LT', name: 'Lithuanian', flag: '🇱🇹', ttsCode: 'lt-LT', speechCode: 'lt-LT' },
    { code: 'LV', name: 'Latvian', flag: '🇱🇻', ttsCode: 'lv-LV', speechCode: 'lv-LV' },
    { code: 'NB', name: 'Norwegian', flag: '🇳🇴', ttsCode: 'no-NO', speechCode: 'no-NO' },
    { code: 'RO', name: 'Romanian', flag: '🇷🇴', ttsCode: 'ro-RO', speechCode: 'ro-RO' },
    { code: 'SK', name: 'Slovak', flag: '🇸🇰', ttsCode: 'sk-SK', speechCode: 'sk-SK' },
    { code: 'SL', name: 'Slovenian', flag: '🇸🇮', ttsCode: 'sl-SI', speechCode: 'sl-SI' },
    { code: 'UK', name: 'Ukrainian', flag: '🇺🇦', ttsCode: 'uk-UA', speechCode: 'uk-UA' }
  ];

  // ---- APP STATE ----
  let sourceLang = 'AUTO'; // Auto Detect by default
  let targetLang = 'EN'; // English by default as shown in the screenshot
  let currentRomanization = ''; // Romanisasi hasil terjemahan yang sedang tampil
  let isOnline = navigator.onLine; // Status koneksi — dipakai untuk mode offline dasar
  let convLangA = 'ID'; // Bahasa kamu (panel bawah)
  let convLangB = 'EN'; // Bahasa lawan bicara (panel atas, dibalik 180°)
  let convRecognitionInstance = null; // Instance STT terpisah dari mic utama, khusus conversation mode
  let convListeningSide = null; // 'A' | 'B' | null — sisi mana yang sedang merekam
  let currencyRates = null; // Cache kurs (relatif ke USD), diisi setelah fetch pertama
  let currencyRatesFetchedAt = 0; // Timestamp cache, dipakai supaya tidak fetch berulang tiap buka layar
  let unitFromKey = 'km';
  let unitToKey = 'mi';
  let currencyFromCode = 'USD';
  let currencyToCode = 'IDR';
  let emergencyLangCode = 'EN';
  let imageTranslateTargetLang = 'EN'; // Target khusus layar translate foto, selalu reset ke EN tiap buka foto baru
  let lastCapturedPhoto = null; // Foto terakhir yang diambil, dipakai kalau target bahasa diganti di layar hasil
  let imageTranslateCache = {}; // Cache hasil per bahasa target untuk foto yang sedang aktif — hindari panggil API ulang kalau user gonta-ganti balik ke bahasa yang sama
  let isImageTranslating = false; // Cegah request numpuk kalau user ganti bahasa berkali-kali dengan cepat
  let historyList = [];
  let isTranslating = false;
  let isListening = false;
  let speechRecognitionInstance = null;
  let translateDebounceTimeout = null;
  
  // Overlay screen & sliding drawer active variables
  let currentSelectingLangType = null; // 'source' or 'target'
  let activeHistoryTab = 'history'; // 'history' or 'favorite'
  let historySearchQuery = '';
  let langSearchQuery = '';

  // ---- DOM ELEMENT REFERENCES ----
  const sourceTextEl = document.getElementById('sourceText');
  const targetTextEl = document.getElementById('targetText');
  const targetRomanizationEl = document.getElementById('targetRomanization');
  const sourceLangPill = document.getElementById('sourceLangPill');
  const targetLangPill = document.getElementById('targetLangPill');
  const swapBtn = document.getElementById('swapBtn');
  const voiceInputBtn = document.getElementById('voiceInputBtn');
  const favoriteBtn = document.getElementById('favoriteBtn');
  const historyBtn = document.getElementById('historyBtn');
  const offlineBanner = document.getElementById('offlineBanner');
  const conversationModeBtn = document.getElementById('conversationModeBtn');
  const conversationOverlay = document.getElementById('conversationOverlay');
  const backFromConversationBtn = document.getElementById('backFromConversationBtn');
  const convSwapBtn = document.getElementById('convSwapBtn');
  const convLangAPill = document.getElementById('convLangAPill');
  const convLangBPill = document.getElementById('convLangBPill');
  const convLangAName = document.getElementById('convLangAName');
  const convLangBName = document.getElementById('convLangBName');
  const convDisplayA = document.getElementById('convDisplayA');
  const convDisplayB = document.getElementById('convDisplayB');
  const convMicA = document.getElementById('convMicA');
  const convMicB = document.getElementById('convMicB');

  // Travel Tools Hub
  const travelToolsBtn = document.getElementById('travelToolsBtn');
  const travelToolsOverlay = document.getElementById('travelToolsOverlay');
  const backFromTravelToolsBtn = document.getElementById('backFromTravelToolsBtn');
  const openUnitConverterBtn = document.getElementById('openUnitConverterBtn');

  // Konverter Satuan
  const unitConverterOverlay = document.getElementById('unitConverterOverlay');
  const backFromUnitConverterBtn = document.getElementById('backFromUnitConverterBtn');
  const unitCategoryTabs = document.getElementById('unitCategoryTabs');
  const unitInputFrom = document.getElementById('unitInputFrom');
  const unitInputTo = document.getElementById('unitInputTo');
  const unitFromPill = document.getElementById('unitFromPill');
  const unitFromPillLabel = document.getElementById('unitFromPillLabel');
  const unitToPill = document.getElementById('unitToPill');
  const unitToPillLabel = document.getElementById('unitToPillLabel');
  const unitSwapBtn = document.getElementById('unitSwapBtn');

  // Info Tipping
  const openTippingInfoBtn = document.getElementById('openTippingInfoBtn');
  const tippingInfoOverlay = document.getElementById('tippingInfoOverlay');
  const backFromTippingInfoBtn = document.getElementById('backFromTippingInfoBtn');
  const tippingSearchInput = document.getElementById('tippingSearchInput');
  const tippingListContainer = document.getElementById('tippingListContainer');

  // Tunjukkan ke Lokal
  const showToLocalBtn = document.getElementById('showToLocalBtn');
  const showToLocalOverlay = document.getElementById('showToLocalOverlay');
  const showToLocalText = document.getElementById('showToLocalText');

  // Kalkulator Mata Uang
  const openCurrencyCalcBtn = document.getElementById('openCurrencyCalcBtn');
  const currencyCalcOverlay = document.getElementById('currencyCalcOverlay');
  const backFromCurrencyCalcBtn = document.getElementById('backFromCurrencyCalcBtn');
  const currencyInputFrom = document.getElementById('currencyInputFrom');
  const currencyInputTo = document.getElementById('currencyInputTo');
  const currencyFromPill = document.getElementById('currencyFromPill');
  const currencyFromPillLabel = document.getElementById('currencyFromPillLabel');
  const currencyToPill = document.getElementById('currencyToPill');
  const currencyToPillLabel = document.getElementById('currencyToPillLabel');
  const currencySwapBtn = document.getElementById('currencySwapBtn');
  const currencyRateInfo = document.getElementById('currencyRateInfo');

  // Frasa Darurat
  const openEmergencyPhrasesBtn = document.getElementById('openEmergencyPhrasesBtn');
  const emergencyPhrasesOverlay = document.getElementById('emergencyPhrasesOverlay');
  const backFromEmergencyPhrasesBtn = document.getElementById('backFromEmergencyPhrasesBtn');
  const emergencyLangPill = document.getElementById('emergencyLangPill');
  const emergencyLangPillLabel = document.getElementById('emergencyLangPillLabel');
  const emergencyPhraseList = document.getElementById('emergencyPhraseList');
  
  // Speakers / Copies
  const speakSourceBtn = document.getElementById('speakSourceBtn');
  const speakTargetBtn = document.getElementById('speakTargetBtn');
  const copySourceBtn = document.getElementById('copySourceBtn');
  const cameraTranslateBtn = document.getElementById('cameraTranslateBtn');
  const clearTextBtn = document.getElementById('clearTextBtn');
  const imageResultOverlay = document.getElementById('imageResultOverlay');
  const imageResultViewport = document.getElementById('imageResultViewport');
  const imageResultPhoto = document.getElementById('imageResultPhoto');
  const imageResultLoading = document.getElementById('imageResultLoading');
  const backFromImageResultBtn = document.getElementById('backFromImageResultBtn');
  const imageSourceLangName = document.getElementById('imageSourceLangName');
  const imageTargetLangPill = document.getElementById('imageTargetLangPill');
  const imageTargetLangName = document.getElementById('imageTargetLangName');
  const copyTargetBtn = document.getElementById('copyTargetBtn');
  
  // Modal Overlays
  const historyOverlay = document.getElementById('historyOverlay');
  const backFromHistoryBtn = document.getElementById('backFromHistoryBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const tabHistory = document.getElementById('tabHistory');
  const tabFavourite = document.getElementById('tabFavourite');
  const historySearchInput = document.getElementById('historySearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const historyListContainer = document.getElementById('historyListContainer');
  
  // Bottom Language Selection Sheet Drawer
  const languageSheet = document.getElementById('languageSheet');
  const sheetBackdrop = document.getElementById('sheetBackdrop');
  const closeSheetBtn = document.getElementById('closeSheetBtn');
  const langSearchInput = document.getElementById('langSearchInput');
  const languageListContainer = document.getElementById('languageListContainer');
  const sheetTitle = document.getElementById('sheetTitle');
  
  // Toast notifications
  const globalToast = document.getElementById('globalToast');
  const toastMessage = document.getElementById('toastMessage');

  // ---- LOCAL STORAGE PERSISTENCE ----
  function loadHistoryFromStorage() {
    try {
      const saved = localStorage.getItem('haka_history_v2');
      if (saved) {
        historyList = JSON.parse(saved);
      } else {
        historyList = [];
      }
    } catch (e) {
      console.error('Failed to parse history data:', e);
      historyList = [];
    }
  }

  function saveHistoryToStorage() {
    try {
      localStorage.setItem('haka_history_v2', JSON.stringify(historyList));
    } catch (e) {
      console.error('Failed to write history data:', e);
    }
  }

  // ---- TOAST UTILITIES ----
  let toastTimer = null;
  function showToast(message) {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastMessage.textContent = message;
    globalToast.classList.add('active');
    
    toastTimer = setTimeout(() => {
      globalToast.classList.remove('active');
    }, 2500);
  }

  // ---- RENDER/DISPLAY FORMATTERS ----
  function getLangByCode(code) {
    return languages.find(lang => lang.code === code) || languages[0];
  }

  function updateLangPills() {
    const srcLangObj = getLangByCode(sourceLang);
    const tgtLangObj = getLangByCode(targetLang);

    document.getElementById('sourceLangFlag').textContent = srcLangObj.flag;
    document.getElementById('sourceLangName').textContent = srcLangObj.name;

    document.getElementById('targetLangFlag').textContent = tgtLangObj.flag;
    document.getElementById('targetLangName').textContent = tgtLangObj.name;
    
    // Check if the current translated card is favorited
    updateFavoriteBtnState();
  }

  function updateFavoriteBtnState() {
    const srcText = sourceTextEl.value.trim().toLowerCase();
    const isFav = historyList.some(item => 
      item.source.trim().toLowerCase() === srcText && 
      item.favorite && 
      item.srcLang === sourceLang && 
      item.tgtLang === targetLang
    );

    if (isFav) {
      favoriteBtn.classList.add('active');
    } else {
      favoriteBtn.classList.remove('active');
    }
  }

  function adjustFontSize(element, text) {
    element.classList.remove('size-large', 'size-medium', 'size-small');
    const len = text.length;
    if (len <= 40) {
      element.classList.add('size-large');
    } else if (len <= 120) {
      element.classList.add('size-medium');
    } else {
      element.classList.add('size-small');
    }
  }

  function updateOnlineStatus() {
  isOnline = navigator.onLine;
  if (offlineBanner) {
    offlineBanner.classList.toggle('visible', !isOnline);
  }
}

function findCachedTranslation(text, srcLangCode, tgtLangCode) {
  const normalized = text.trim().toLowerCase();
  return historyList.find(item =>
    item.source.trim().toLowerCase() === normalized &&
    item.srcLang === srcLangCode &&
    item.tgtLang === tgtLangCode
  ) || null;
}

  // Tampilkan/sembunyikan romanisasi (cara baca) di bawah teks target.
  // Kosongkan text jika tidak ada romanisasi (mis. bahasa Latin seperti EN/ID).
  function updateRomanizationDisplay(text) {
    currentRomanization = text || '';
    if (currentRomanization) {
      targetRomanizationEl.textContent = currentRomanization;
      targetRomanizationEl.classList.add('visible');
    } else {
      targetRomanizationEl.textContent = '';
      targetRomanizationEl.classList.remove('visible');
    }
  }

  function updateOnlineStatus() {
  isOnline = navigator.onLine;
  if (offlineBanner) {
    offlineBanner.classList.toggle('visible', !isOnline);
  }
}

function findCachedTranslation(text, srcLangCode, tgtLangCode) {
  const normalized = text.trim().toLowerCase();
  return historyList.find(item =>
    item.source.trim().toLowerCase() === normalized &&
    item.srcLang === srcLangCode &&
    item.tgtLang === tgtLangCode
  ) || null;
}

  function updateClearButtonVisibility() {
    if (clearTextBtn) {
      clearTextBtn.classList.toggle('visible', sourceTextEl.value.length > 0);
    }
  }

  // URL backend Railway. App ini (Capacitor/iOS) selalu memanggil backend produksi,
  // jadi tidak perlu deteksi environment yang rumit.
  const API_BASE_URL = 'https://deepl-translator-complete-production.up.railway.app';

  function getApiUrl(path) {
    return API_BASE_URL + path;
  }

  // ---- DEBOUNCED AUTO TRANSLATOR ENGINE ----
  async function performTranslation(textToTranslate, shouldSaveHistory = false) {
    if (!textToTranslate || !textToTranslate.trim()) {
      targetTextEl.textContent = 'Hasil Terjemahan';
      targetTextEl.classList.add('translation-placeholder');
      adjustFontSize(targetTextEl, 'Hasil Terjemahan');
      updateRomanizationDisplay('');
      updateFavoriteBtnState();
      return;
    }

    targetTextEl.classList.remove('translation-placeholder');
    targetTextEl.textContent = 'Menerjemahkan...';
    adjustFontSize(targetTextEl, 'Menerjemahkan...');
    updateRomanizationDisplay(''); // sembunyikan romanisasi lama selama proses translate
    isTranslating = true;

    if (!navigator.onLine) {
      const cached = findCachedTranslation(textToTranslate, sourceLang, targetLang);
      if (cached) {
        targetTextEl.textContent = cached.translated;
        adjustFontSize(targetTextEl, cached.translated);
        updateRomanizationDisplay(cached.romanization || '');
        showToast('Offline — menampilkan dari riwayat tersimpan');
        isTranslating = false;
        updateFavoriteBtnState();
        return;
      }

      targetTextEl.textContent = 'Tidak ada koneksi internet. Kalimat ini belum pernah diterjemahkan sebelumnya, jadi tidak tersedia offline.';
      updateRomanizationDisplay('');
      isTranslating = false;
      updateFavoriteBtnState();
      return;
    }

    try {
      const response = await fetch(getApiUrl('/api/translate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLang: sourceLang,
          targetLang: targetLang,
          formality: 'default'
        })
      });

      const rawText = await response.text();
      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (jsonErr) {
        throw new Error('Server returned invalid response: ' + rawText.substring(0, 150) + ' (Status: ' + response.status + ')');
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Server Error (' + response.status + '): ' + rawText.substring(0, 150));
      }
      
      if (data && data.translation) {
        targetTextEl.textContent = data.translation;
        adjustFontSize(targetTextEl, data.translation);
        updateRomanizationDisplay(data.romanization || '');

        if (shouldSaveHistory) {
          // Check for exact duplicates in list to keep list tidy
          const isDuplicate = historyList.some(item => 
            item.source.trim().toLowerCase() === textToTranslate.trim().toLowerCase() && 
            item.srcLang === sourceLang && 
            item.tgtLang === targetLang
          );

          if (!isDuplicate) {
            const newItem = {
              id: Date.now(),
              source: textToTranslate,
              translated: data.translation,
              romanization: data.romanization || '',
              srcLang: sourceLang,
              tgtLang: targetLang,
              timestamp: new Date().toISOString(),
              favorite: false
            };
            historyList.unshift(newItem);
            saveHistoryToStorage();
          }
        }
      } else {
        targetTextEl.textContent = 'Translation failed';
        updateRomanizationDisplay('');
      }
    } catch (e) {
      console.error('Translation process error:', e);
      var rawErrorStr = e.stack || e.message || String(e);
      var displayMsg = e.message || 'Koneksi error. Silakan coba lagi.';
      if (displayMsg === 'Load failed' || displayMsg === 'Failed to fetch' || displayMsg.toLowerCase().indexOf('fetch') !== -1) {
        displayMsg = 'Koneksi gagal. Pastikan koneksi internet stabil atau coba lagi.\n(Detail Error: ' + rawErrorStr + ')';
      } else {
        displayMsg = displayMsg + '\n(Detail Error: ' + rawErrorStr + ')';
      }
      targetTextEl.textContent = displayMsg;
      updateRomanizationDisplay('');
    } finally {
      isTranslating = false;
      updateFavoriteBtnState();
    }
  }

  // ---- TRANSLATE DARI FOTO (KAMERA / GALERI) ----
  // Memakai native Camera plugin Capacitor via window.Capacitor.Plugins.Camera
  // (tidak perlu import npm karena app ini tidak pakai bundler). Native plugin-nya
  // sendiri ditambahkan lewat "npx cap sync" setelah @capacitor/camera di-install.
  // ---- TRANSLATE DARI FOTO (KAMERA / GALERI) ----
async function handleCameraTranslate() {
  if (!navigator.onLine) {
    showToast('Translate foto butuh koneksi internet.');
    return;
  }

  const CameraPlugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Camera;

  if (!CameraPlugin) {
    showToast('Fitur kamera hanya tersedia di aplikasi (bukan browser).');
    return;
  }

  let photo;
  try {
    photo = await CameraPlugin.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: 'base64',
      source: 'PROMPT',
      width: 1024,
      correctOrientation: true,
      promptLabelHeader: 'Translate dari Foto',
      promptLabelPhoto: 'Pilih dari Galeri',
      promptLabelPicture: 'Ambil Foto'
    });
  } catch (err) {
    const msg = (err && err.message) ? err.message : '';
    let rawDetail = msg;
    if (!rawDetail) {
      try {
        rawDetail = JSON.stringify(err);
      } catch (stringifyErr) {
        rawDetail = String(err);
      }
    }
    console.error('Camera getPhoto error (raw):', rawDetail, err);
    if (msg.toLowerCase().indexOf('cancel') === -1) {
      showToast('Gagal mengambil foto: ' + (rawDetail || 'unknown error'));
    }
    return;
  }

  if (!photo || !photo.base64String) {
    showToast('Gagal memproses foto.');
    return;
  }

  openImageResultScreen(photo);
}

function openImageResultScreen(photo) {
  lastCapturedPhoto = photo;
  imageTranslateTargetLang = 'EN';
  imageTranslateCache = {}; // Foto baru = cache lama tidak relevan lagi

  imageResultPhoto.src = 'data:image/' + (photo.format || 'jpeg') + ';base64,' + photo.base64String;
  imageSourceLangName.textContent = 'Mendeteksi...';
  imageTargetLangName.textContent = getLangByCode(imageTranslateTargetLang).name;

  imageResultViewport.querySelectorAll('.image-overlay-label').forEach(el => el.remove());
  imageResultOverlay.classList.add('active');

  runImageTranslation(photo, imageTranslateTargetLang);
}

function closeImageResultScreen() {
  imageResultOverlay.classList.remove('active');
}

async function runImageTranslation(photo, targetLangCode) {
  if (isImageTranslating) {
    showToast('Masih memproses permintaan sebelumnya, tunggu sebentar...');
    return;
  }

  // Sudah pernah diterjemahkan ke bahasa ini sebelumnya untuk foto yang sama? Pakai cache, jangan panggil API lagi.
  if (imageTranslateCache[targetLangCode]) {
    const cached = imageTranslateCache[targetLangCode];
    imageSourceLangName.textContent = cached.detectedLanguage || 'Tidak diketahui';
    imageTargetLangName.textContent = getLangByCode(targetLangCode).name;
    renderImageOverlayLabels(cached.blocks);
    return;
  }

  isImageTranslating = true;
  imageTargetLangPill.classList.add('is-processing');
  imageResultLoading.classList.remove('hidden');
  imageResultViewport.querySelectorAll('.image-overlay-label').forEach(el => el.remove());
  imageTargetLangName.textContent = getLangByCode(targetLangCode).name;
  cameraTranslateBtn.classList.add('is-processing');

  try {
    const response = await fetch(getApiUrl('/api/translate-image'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: photo.base64String,
        mimeType: 'image/' + (photo.format || 'jpeg'),
        targetLang: targetLangCode
      })
    });

    const rawText = await response.text();
    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch (jsonErr) {
      throw new Error('Server returned invalid response: ' + rawText.substring(0, 150) + ' (Status: ' + response.status + ')');
    }

    if (!response.ok) {
      // Kasus khusus rate limit/quota Gemini — kasih pesan yang mudah dimengerti, bukan JSON error mentah
      const errMsg = data?.error || '';
      if (response.status === 429 || errMsg.indexOf('429') !== -1 || errMsg.toLowerCase().indexOf('quota') !== -1) {
        throw new Error('Kena limit pemakaian AI gratis (terlalu banyak percobaan dalam waktu singkat). Tunggu 1-2 menit lalu coba lagi.');
      }
      throw new Error(errMsg || 'Server Error (' + response.status + '): ' + rawText.substring(0, 150));
    }

    if (!data.blocks || !data.blocks.length) {
      showToast('Tidak ada teks yang terbaca dari foto ini. Coba foto yang lebih jelas.');
      imageSourceLangName.textContent = 'Tidak terbaca';
      return;
    }

    imageSourceLangName.textContent = data.detectedLanguage || 'Tidak diketahui';
    renderImageOverlayLabels(data.blocks);

    // Simpan ke cache supaya kalau user balik lagi ke bahasa ini, tidak perlu panggil API lagi
    imageTranslateCache[targetLangCode] = {
      detectedLanguage: data.detectedLanguage || '',
      blocks: data.blocks
    };

    const newItem = {
      id: Date.now(),
      source: data.extractedText,
      translated: data.translation,
      romanization: data.romanization || '',
      srcLang: 'AUTO',
      tgtLang: targetLangCode,
      timestamp: new Date().toISOString(),
      favorite: false
    };
    historyList.unshift(newItem);
    saveHistoryToStorage();
  } catch (e) {
    console.error('Camera translate error:', e);
    showToast('Gagal menerjemahkan foto: ' + (e.message || 'Terjadi kesalahan.'));
    imageSourceLangName.textContent = 'Gagal';
  } finally {
    isImageTranslating = false;
    imageTargetLangPill.classList.remove('is-processing');
    imageResultLoading.classList.add('hidden');
    cameraTranslateBtn.classList.remove('is-processing');
  }
}

function renderImageOverlayLabels(blocks) {
  imageResultViewport.querySelectorAll('.image-overlay-label').forEach(el => el.remove());

  const imgHeightPx = imageResultPhoto.clientHeight || 300;

  blocks.forEach(function (block) {
    const box = block.box;
    const topPct = box[0] / 10;
    const leftPct = box[1] / 10;
    const heightPct = Math.max(0, (box[2] - box[0]) / 10);
    const widthPct = Math.max(0, (box[3] - box[1]) / 10);

    const label = document.createElement('div');
    label.className = 'image-overlay-label';
    label.style.top = topPct + '%';
    label.style.left = leftPct + '%';
    label.style.width = widthPct + '%';
    label.style.height = heightPct + '%';

    const boxHeightPx = (heightPct / 100) * imgHeightPx;
    const fontSize = Math.max(10, Math.min(26, boxHeightPx * 0.55));
    label.style.fontSize = fontSize + 'px';

    label.textContent = block.translatedText;
    imageResultViewport.appendChild(label);
  });
}

// ---- CONVERSATION MODE ----
// Catatan teknis: Web Speech API TIDAK bisa auto-detect bahasa yang diucapkan —
// bahasa harus ditentukan SEBELUM mulai merekam. Makanya di mode ini bahasa
// dipilih sekali di awal sesi (convLangA/convLangB), bukan per-kalimat.

function updateConvLangPills() {
  convLangAName.textContent = getLangByCode(convLangA).name;
  convLangBName.textContent = getLangByCode(convLangB).name;
}

function resetConvDisplay(displayEl) {
  displayEl.innerHTML = '<span class="conv-placeholder">Ketuk mic untuk bicara</span>';
}

function openConversationMode() {
  stopSpeechRecognition(); // matikan mic layar utama kalau kebetulan aktif
  stopConvListening();
  updateConvLangPills();
  resetConvDisplay(convDisplayA);
  resetConvDisplay(convDisplayB);
  conversationOverlay.classList.add('active');
}

function closeConversationMode() {
  stopConvListening();
  conversationOverlay.classList.remove('active');
}

function handleConvSwap() {
  const temp = convLangA;
  convLangA = convLangB;
  convLangB = temp;
  updateConvLangPills();
  resetConvDisplay(convDisplayA);
  resetConvDisplay(convDisplayB);
  showToast('Bahasa ditukar');
}

function stopConvListening() {
  if (convRecognitionInstance) {
    try { convRecognitionInstance.stop(); } catch (e) {}
    try { convRecognitionInstance.abort(); } catch (e) {}
    convRecognitionInstance = null;
  }
  convMicA.classList.remove('listening');
  convMicB.classList.remove('listening');
  convListeningSide = null;
}

function startConvListening(side) {
  if (!navigator.onLine) {
    showToast('Conversation mode butuh koneksi internet.');
    return;
  }

  // Tap sisi yang sedang aktif = batalkan rekaman
  if (convListeningSide === side) {
    stopConvListening();
    return;
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    showToast('Perangkat ini tidak mendukung perekaman suara.');
    return;
  }

  stopConvListening(); // pastikan tidak ada sesi lain yang masih jalan

  const langCode = side === 'A' ? convLangA : convLangB;
  const speechCode = (getLangByCode(langCode).speechCode || 'en-US').replace('_', '-');

  const rec = new SpeechRec();
  rec.continuous = false;
  rec.interimResults = false;
  rec.lang = speechCode;

  rec.onstart = function () {
    convListeningSide = side;
    (side === 'A' ? convMicA : convMicB).classList.add('listening');
  };

  rec.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    if (transcript) {
      translateConvUtterance(side, transcript);
    }
  };

  rec.onerror = function (err) {
    console.error('Conversation STT error:', err.error);
    if (err.error !== 'no-speech' && err.error !== 'aborted') {
      showToast('Gagal merekam suara: ' + err.error);
    }
    stopConvListening();
  };

  rec.onend = function () {
    stopConvListening();
  };

  convRecognitionInstance = rec;

  try {
    rec.start();
  } catch (startErr) {
    console.error('Conversation STT start failed:', startErr);
    showToast('Gagal memulai perekaman suara.');
    stopConvListening();
  }
}

// Terjemahkan ucapan dari satu sisi, tampilkan hasilnya di sisi lawan bicara
async function translateConvUtterance(speakingSide, transcript) {
  const fromLang = speakingSide === 'A' ? convLangA : convLangB;
  const toLang = speakingSide === 'A' ? convLangB : convLangA;
  const ownDisplay = speakingSide === 'A' ? convDisplayA : convDisplayB;
  const otherDisplay = speakingSide === 'A' ? convDisplayB : convDisplayA;

  ownDisplay.innerHTML = '<span class="conv-original">Kamu: ' + transcript + '</span>';
  otherDisplay.innerHTML = '<span class="conv-placeholder">Menerjemahkan...</span>';

  try {
    const response = await fetch(getApiUrl('/api/translate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: transcript,
        sourceLang: fromLang,
        targetLang: toLang,
        formality: 'default'
      })
    });

    const rawText = await response.text();
    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch (jsonErr) {
      throw new Error('Server returned invalid response (Status: ' + response.status + ')');
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Server Error (' + response.status + ')');
    }

    if (data && data.translation) {
      otherDisplay.innerHTML = '<span class="conv-translated"></span>' +
        (data.romanization ? '<span class="conv-original" style="margin-top:6px;">' + data.romanization + '</span>' : '');
      const translatedSpan = otherDisplay.querySelector('.conv-translated');
      translatedSpan.textContent = data.translation;
      adjustFontSize(translatedSpan, data.translation);
    } else {
      otherDisplay.innerHTML = '<span class="conv-placeholder">Gagal menerjemahkan</span>';
    }
  } catch (e) {
    console.error('Conversation translate error:', e);
    otherDisplay.innerHTML = '<span class="conv-placeholder">Gagal menerjemahkan: ' + (e.message || 'error') + '</span>';
  }
}

  // ---- TRAVEL TOOLS HUB ----
  function openTravelToolsHub() {
    travelToolsOverlay.classList.add('active');
  }

  function closeTravelToolsHub() {
    travelToolsOverlay.classList.remove('active');
  }

  // ---- KONVERTER SATUAN ----
  // Semua konversi murni matematika lokal — tidak butuh internet/API sama sekali.
  // Tiap kategori punya "satuan dasar" (base) — semua satuan lain dikonversi via base itu,
  // supaya menambah satuan baru tidak perlu bikin rumus untuk tiap pasangan.
  const UNIT_CATEGORIES = {
    distance: {
      defaultFrom: 'km',
      defaultTo: 'mi',
      units: {
        km: { name: 'Kilometer (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        m: { name: 'Meter (m)', toBase: (v) => v, fromBase: (v) => v },
        mi: { name: 'Mil (miles)', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
        ft: { name: 'Kaki (feet)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 }
      }
    },
    temperature: {
      defaultFrom: 'c',
      defaultTo: 'f',
      units: {
        c: { name: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
        f: { name: 'Fahrenheit (°F)', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => (v * 9 / 5) + 32 },
        k: { name: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
      }
    },
    weight: {
      defaultFrom: 'kg',
      defaultTo: 'lb',
      units: {
        kg: { name: 'Kilogram (kg)', toBase: (v) => v, fromBase: (v) => v },
        g: { name: 'Gram (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        lb: { name: 'Pon (lbs)', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
        oz: { name: 'Ons (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 }
      }
    }
  };

  let currentUnitCategory = 'distance';

  function roundNice(num) {
    // Bulatkan ke maks 2 desimal, tapi buang trailing zero yang tidak perlu (3.00 -> 3)
    return Math.round(num * 100) / 100;
  }

  function openUnitConverter() {
    unitCategoryTabs.querySelectorAll('.segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === 'distance');
    });
    switchUnitCategory('distance');
    unitConverterOverlay.classList.add('active');
  }

  function closeUnitConverter() {
    unitConverterOverlay.classList.remove('active');
  }

  function switchUnitCategory(category) {
    currentUnitCategory = category;
    const cat = UNIT_CATEGORIES[category];

    unitFromKey = cat.defaultFrom;
    unitToKey = cat.defaultTo;
    unitFromPillLabel.textContent = cat.units[unitFromKey].name;
    unitToPillLabel.textContent = cat.units[unitToKey].name;

    unitInputFrom.value = '';
    unitInputTo.value = '';
  }

  function convertUnit(amount, fromKey, toKey) {
    const cat = UNIT_CATEGORIES[currentUnitCategory];
    if (!cat.units[fromKey] || !cat.units[toKey]) return null;
    const baseVal = cat.units[fromKey].toBase(amount);
    return cat.units[toKey].fromBase(baseVal);
  }

  function recalculateUnitFromInput() {
    const val = parseFloat(unitInputFrom.value);
    if (isNaN(val)) { unitInputTo.value = ''; return; }
    const result = convertUnit(val, unitFromKey, unitToKey);
    if (result !== null) {
      unitInputTo.value = roundNice(result);
    }
  }

  function handleUnitSwap() {
    const tempKey = unitFromKey;
    unitFromKey = unitToKey;
    unitToKey = tempKey;

    const cat = UNIT_CATEGORIES[currentUnitCategory];
    unitFromPillLabel.textContent = cat.units[unitFromKey].name;
    unitToPillLabel.textContent = cat.units[unitToKey].name;

    const tempVal = unitInputFrom.value;
    unitInputFrom.value = unitInputTo.value;
    unitInputTo.value = tempVal;
  }

  // ---- INFO TIPPING ----
  // Data statis (tidak butuh internet) — mencakup destinasi traveling populer.
  // Kebiasaan tipping bisa berubah seiring waktu, jadi ini panduan umum, bukan aturan mutlak.
  const TIPPING_DATA = [
    { country: 'Jepang', flag: '🇯🇵', info: 'TIDAK ada budaya tipping — bahkan bisa dianggap tidak sopan. Pelayanan yang baik sudah termasuk standar.' },
    { country: 'Korea Selatan', flag: '🇰🇷', info: 'Umumnya tidak diharapkan. Beberapa hotel/restoran mewah kadang menerima, tapi bukan kewajiban.' },
    { country: 'China', flag: '🇨🇳', info: 'Umumnya tidak dilakukan, terutama di restoran lokal. Bisa membuat pelayan bingung/menolak.' },
    { country: 'Hong Kong', flag: '🇭🇰', info: 'Banyak restoran sudah menambahkan service charge 10%. Tip tambahan opsional, membulatkan bill sudah cukup.' },
    { country: 'Taiwan', flag: '🇹🇼', info: 'Tidak wajib. Beberapa restoran sudah termasuk service charge 10%.' },
    { country: 'Thailand', flag: '🇹🇭', info: 'Tidak wajib tapi diapresiasi. Restoran/hotel: bulatkan tagihan atau 10%. Pijat: 50-100 baht.' },
    { country: 'Vietnam', flag: '🇻🇳', info: 'Tidak wajib, tapi mulai umum di area turis. Restoran: bulatkan tagihan atau 10%.' },
    { country: 'Singapura', flag: '🇸🇬', info: 'Umumnya tidak diharapkan — banyak restoran sudah termasuk service charge 10%. Dilarang di beberapa tempat.' },
    { country: 'Malaysia', flag: '🇲🇾', info: 'Tidak wajib. Restoran besar biasanya sudah termasuk service charge 10%.' },
    { country: 'Filipina', flag: '🇵🇭', info: 'Diapresiasi, restoran 10% kalau belum termasuk service charge. Porter/supir: sesuai kebijaksanaan.' },
    { country: 'Indonesia', flag: '🇮🇩', info: 'Tidak wajib. Restoran biasa: bulatkan tagihan. Hotel/resort: Rp10-20 ribu untuk porter.' },
    { country: 'India', flag: '🇮🇳', info: 'Restoran: 5-10% kalau belum termasuk service charge. Supir/porter: tip kecil diapresiasi.' },
    { country: 'Uni Emirat Arab (Dubai)', flag: '🇦🇪', info: 'Restoran: 10-15% kalau belum termasuk service charge. Taksi: bulatkan tagihan.' },
    { country: 'Arab Saudi', flag: '🇸🇦', info: 'Umumnya diapresiasi tapi tidak wajib. Restoran: 10% kalau belum termasuk service charge.' },
    { country: 'Turki', flag: '🇹🇷', info: 'Diapresiasi. Restoran: 5-10%. Hammam/spa: 10-15%.' },
    { country: 'Mesir', flag: '🇪🇬', info: 'Sangat umum dan sering diharapkan (disebut "baksheesh") — hampir semua layanan, termasuk toilet umum.' },
    { country: 'Amerika Serikat', flag: '🇺🇸', info: 'WAJIB secara sosial. Restoran: 15-20%. Taksi: 10-15%. Hotel porter: $1-2/tas. Bartender: $1-2/minuman.' },
    { country: 'Kanada', flag: '🇨🇦', info: 'Mirip Amerika Serikat. Restoran: 15-18%. Taksi: 10-15%.' },
    { country: 'Meksiko', flag: '🇲🇽', info: 'Umum dan diharapkan. Restoran: 10-15%. Hotel porter: sekitar $1-2/tas.' },
    { country: 'Brasil', flag: '🇧🇷', info: 'Restoran biasanya sudah termasuk service charge 10%. Tip tambahan opsional.' },
    { country: 'Inggris', flag: '🇬🇧', info: 'Restoran: 10-12.5% kalau belum termasuk service charge. Taksi: bulatkan tagihan. Pub: tidak wajib.' },
    { country: 'Prancis', flag: '🇫🇷', info: 'Service charge biasanya sudah termasuk harga ("service compris"). Tip kecil tambahan diapresiasi tapi tidak wajib.' },
    { country: 'Jerman', flag: '🇩🇪', info: 'Bulatkan tagihan atau tambah 5-10%. Diberikan langsung ke pelayan, bukan ditinggal di meja.' },
    { country: 'Italia', flag: '🇮🇹', info: 'Banyak restoran sudah punya "coperto" (biaya tempat duduk). Tip tambahan kecil opsional, tidak wajib.' },
    { country: 'Spanyol', flag: '🇪🇸', info: 'Tidak wajib. Bulatkan tagihan atau tambah sedikit untuk pelayanan bagus.' },
    { country: 'Belanda', flag: '🇳🇱', info: 'Service charge biasanya sudah termasuk. Bulatkan tagihan untuk pelayanan bagus.' },
    { country: 'Swiss', flag: '🇨🇭', info: 'Service charge sudah termasuk harga secara hukum. Tip tambahan tidak wajib.' },
    { country: 'Australia', flag: '🇦🇺', info: 'Tidak wajib — gaji pekerja sudah relatif tinggi. Restoran mewah: 10% opsional untuk pelayanan sangat baik.' },
    { country: 'Selandia Baru', flag: '🇳🇿', info: 'Umumnya tidak diharapkan sama sekali, mirip Australia.' },
    { country: 'Rusia', flag: '🇷🇺', info: 'Restoran: 10% diapresiasi kalau belum termasuk service charge.' },
    { country: 'Afrika Selatan', flag: '🇿🇦', info: 'Restoran: 10-15%. Petugas SPBU/porter: tip kecil diharapkan.' },
    { country: 'Maladewa', flag: '🇲🇻', info: 'Banyak resort sudah termasuk service charge 10%. Tip tambahan untuk staf opsional tapi diapresiasi.' },
    { country: 'Qatar', flag: '🇶🇦', info: 'Restoran: 10% kalau belum termasuk service charge. Tidak wajib tapi umum di area turis.' }
  ];

  function openTippingInfo() {
    tippingSearchInput.value = '';
    renderTippingList('');
    tippingInfoOverlay.classList.add('active');
  }

  function closeTippingInfo() {
    tippingInfoOverlay.classList.remove('active');
  }

  function renderTippingList(query) {
    tippingListContainer.innerHTML = '';
    const q = query.toLowerCase().trim();

    const filtered = TIPPING_DATA.filter(item => item.country.toLowerCase().includes(q));

    if (filtered.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.style.textAlign = 'center';
      emptyDiv.style.padding = '32px 16px';
      emptyDiv.style.color = 'rgba(255,255,255,0.35)';
      emptyDiv.style.fontSize = '14px';
      emptyDiv.textContent = 'Negara tidak ditemukan';
      tippingListContainer.appendChild(emptyDiv);
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'tipping-item';
      card.innerHTML = `
        <span class="tipping-item-flag">${item.flag}</span>
        <div class="tipping-item-text">
          <div class="tipping-item-country">${item.country}</div>
          <div class="tipping-item-info">${item.info}</div>
        </div>
      `;
      tippingListContainer.appendChild(card);
    });
  }

  // ---- TUNJUKKAN KE LOKAL ----
  function showFullscreenText(text) {
    showToLocalText.textContent = text;
    adjustFontSize(showToLocalText, text); // reuse fungsi yang sama, cuma beda skala CSS-nya
    showToLocalOverlay.classList.add('active');
  }

  function handleShowToLocal() {
    const text = targetTextEl.textContent.trim();
    if (!text || text === 'Hasil Terjemahan' || text === 'Menerjemahkan...') {
      showToast('Tidak ada teks untuk ditampilkan');
      return;
    }
    showFullscreenText(text);
  }

  function closeShowToLocal() {
    showToLocalOverlay.classList.remove('active');
  }

  // ---- KALKULATOR MATA UANG ----
  // Data kurs dari Frankfurter API (sumber: European Central Bank) — gratis, tanpa API key, CORS-enabled.
  // Cakupan terbatas ~30 mata uang utama (tidak semua mata uang dunia tersedia).
  const CURRENCY_LIST = [
    { code: 'IDR', name: 'Rupiah Indonesia', flag: '🇮🇩' },
    { code: 'USD', name: 'Dolar Amerika', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'Poundsterling Inggris', flag: '🇬🇧' },
    { code: 'JPY', name: 'Yen Jepang', flag: '🇯🇵' },
    { code: 'KRW', name: 'Won Korea Selatan', flag: '🇰🇷' },
    { code: 'CNY', name: 'Yuan China', flag: '🇨🇳' },
    { code: 'SGD', name: 'Dolar Singapura', flag: '🇸🇬' },
    { code: 'MYR', name: 'Ringgit Malaysia', flag: '🇲🇾' },
    { code: 'THB', name: 'Baht Thailand', flag: '🇹🇭' },
    { code: 'PHP', name: 'Peso Filipina', flag: '🇵🇭' },
    { code: 'INR', name: 'Rupee India', flag: '🇮🇳' },
    { code: 'AUD', name: 'Dolar Australia', flag: '🇦🇺' },
    { code: 'HKD', name: 'Dolar Hong Kong', flag: '🇭🇰' },
    { code: 'CHF', name: 'Franc Swiss', flag: '🇨🇭' },
    { code: 'CAD', name: 'Dolar Kanada', flag: '🇨🇦' },
    { code: 'NZD', name: 'Dolar Selandia Baru', flag: '🇳🇿' },
    { code: 'TRY', name: 'Lira Turki', flag: '🇹🇷' },
    { code: 'ZAR', name: 'Rand Afrika Selatan', flag: '🇿🇦' },
    { code: 'MXN', name: 'Peso Meksiko', flag: '🇲🇽' }
  ];

  function populateCurrencySelects() {
    updateCurrencyPillLabels();
  }

  function updateCurrencyPillLabels() {
    const fromC = CURRENCY_LIST.find(c => c.code === currencyFromCode);
    const toC = CURRENCY_LIST.find(c => c.code === currencyToCode);
    currencyFromPillLabel.textContent = fromC ? `${fromC.flag} ${fromC.code}` : currencyFromCode;
    currencyToPillLabel.textContent = toC ? `${toC.flag} ${toC.code}` : currencyToCode;
  }

  async function fetchCurrencyRates(forceRefresh) {
    const ONE_HOUR = 60 * 60 * 1000;
    if (!forceRefresh && currencyRates && (Date.now() - currencyRatesFetchedAt) < ONE_HOUR) {
      return currencyRates; // masih fresh, tidak perlu fetch ulang
    }

    const response = await fetch('https://api.frankfurter.dev/v2/rates?base=USD');
    if (!response.ok) {
      throw new Error('Gagal mengambil data kurs (status ' + response.status + ')');
    }
    const data = await response.json();

    // v2 Frankfurter API mengembalikan ARRAY datar, satu baris per mata uang —
    // bukan object {rates: {...}} seperti v1. Bentuknya: [{quote: "EUR", rate: 0.87}, ...]
    if (!Array.isArray(data)) {
      throw new Error('Format data kurs tidak sesuai dugaan (API mungkin berubah).');
    }

    const ratesMap = {};
    data.forEach(row => {
      if (row && row.quote && typeof row.rate === 'number') {
        ratesMap[row.quote] = row.rate;
      }
    });

    if (Object.keys(ratesMap).length === 0) {
      throw new Error('Data kurs kosong dari API.');
    }

    currencyRates = ratesMap;
    currencyRates.USD = 1; // base currency, tidak disertakan otomatis di response
    currencyRatesFetchedAt = Date.now();
    return currencyRates;
  }

  function convertCurrency(amount, fromCode, toCode) {
    if (!currencyRates || !currencyRates[fromCode] || !currencyRates[toCode]) return null;
    const usdAmount = amount / currencyRates[fromCode];
    return usdAmount * currencyRates[toCode];
  }

  function updateCurrencyRateInfoText() {
    if (!currencyRates || !currencyRates[currencyFromCode] || !currencyRates[currencyToCode]) return;
    const rate = convertCurrency(1, currencyFromCode, currencyToCode);
    currencyRateInfo.textContent = `1 ${currencyFromCode} = ${roundNice(rate).toLocaleString('id-ID')} ${currencyToCode}`;
  }

  function recalculateCurrencyFromInput() {
    const val = parseFloat(currencyInputFrom.value);
    if (isNaN(val)) { currencyInputTo.value = ''; return; }
    const result = convertCurrency(val, currencyFromCode, currencyToCode);
    if (result !== null) {
      currencyInputTo.value = roundNice(result);
    }
  }

  async function openCurrencyCalculator() {
    currencyCalcOverlay.classList.add('active');
    currencyRateInfo.textContent = 'Memuat kurs...';

    if (!navigator.onLine) {
      currencyRateInfo.textContent = 'Butuh koneksi internet untuk mengambil kurs terbaru.';
      return;
    }

    try {
      await fetchCurrencyRates(false);
      updateCurrencyRateInfoText();
      recalculateCurrencyFromInput();
    } catch (e) {
      console.error('Currency rate fetch error:', e);
      currencyRateInfo.textContent = 'Gagal mengambil kurs. Coba lagi nanti.';
    }
  }

  function closeCurrencyCalculator() {
    currencyCalcOverlay.classList.remove('active');
  }

  function handleCurrencySwap() {
    const tempCode = currencyFromCode;
    currencyFromCode = currencyToCode;
    currencyToCode = tempCode;
    updateCurrencyPillLabels();

    const tempVal = currencyInputFrom.value;
    currencyInputFrom.value = currencyInputTo.value;
    currencyInputTo.value = tempVal;

    updateCurrencyRateInfoText();
  }

  // ---- FRASA DARURAT ----
  // Terjemahan otomatis, bukan hasil verifikasi penutur asli — disclaimer sudah
  // ditampilkan di UI. 100% offline (data statis, tidak butuh internet sama sekali).
  const EMERGENCY_LANGUAGES = ['EN', 'KO', 'JA', 'ZH', 'FR', 'DE', 'ES', 'IT', 'RU', 'AR', 'PT', 'TR', 'NL', 'PL', 'SV', 'VI', 'TH', 'HI', 'BG', 'CS', 'DA', 'EL', 'ET', 'FI', 'HU', 'LT', 'LV', 'NB', 'RO', 'SK', 'SL', 'UK'];

  const EMERGENCY_PHRASES = [
    {
      idText: 'Tolong!',
      translations: { EN: 'Help!', KO: '도와주세요!', JA: '助けて!', ZH: '救命!', FR: 'Au secours !', DE: 'Hilfe!', ES: '¡Ayuda!', IT: 'Aiuto!', RU: 'Помогите!', AR: 'النجدة!', PT: 'Socorro!', TR: 'İmdat!', NL: 'Help!', PL: 'Pomocy!', SV: 'Hjälp!', VI: 'Cứu tôi với!', TH: 'ช่วยด้วย!', HI: 'बचाओ!', BG: 'Помощ!', CS: 'Pomoc!', DA: 'Hjælp!', EL: 'Βοήθεια!', ET: 'Appi!', FI: 'Apua!', HU: 'Segítség!', LT: 'Padėkite!', LV: 'Palīgā!', NB: 'Hjelp!', RO: 'Ajutor!', SK: 'Pomoc!', SL: 'Pomagajte!', UK: 'Допоможіть!' }
    },
    {
      idText: 'Saya butuh bantuan',
      translations: { EN: 'I need help', KO: '도움이 필요해요', JA: '助けが必要です', ZH: '我需要帮助', FR: "J'ai besoin d'aide", DE: 'Ich brauche Hilfe', ES: 'Necesito ayuda', IT: 'Ho bisogno di aiuto', RU: 'Мне нужна помощь', AR: 'أحتاج إلى مساعدة', PT: 'Preciso de ajuda', TR: 'Yardıma ihtiyacım var', NL: 'Ik heb hulp nodig', PL: 'Potrzebuję pomocy', SV: 'Jag behöver hjälp', VI: 'Tôi cần giúp đỡ', TH: 'ฉันต้องการความช่วยเหลือ', HI: 'मुझे मदद चाहिए', BG: 'Имам нужда от помощ', CS: 'Potřebuji pomoc', DA: 'Jeg har brug for hjælp', EL: 'Χρειάζομαι βοήθεια', ET: 'Ma vajan abi', FI: 'Tarvitsen apua', HU: 'Segítségre van szükségem', LT: 'Man reikia pagalbos', LV: 'Man vajag palīdzību', NB: 'Jeg trenger hjelp', RO: 'Am nevoie de ajutor', SK: 'Potrebujem pomoc', SL: 'Potrebujem pomoč', UK: 'Мені потрібна допомога' }
    },
    {
      idText: 'Tolong panggil ambulans',
      translations: { EN: 'Please call an ambulance', KO: '구급차를 불러주세요', JA: '救急車を呼んでください', ZH: '请叫救护车', FR: 'Appelez une ambulance, s\'il vous plaît', DE: 'Bitte rufen Sie einen Krankenwagen', ES: 'Por favor, llame a una ambulancia', IT: "Per favore, chiami un'ambulanza", RU: 'Пожалуйста, вызовите скорую помощь', AR: 'من فضلك اتصل بسيارة إسعاف', PT: 'Por favor, chame uma ambulância', TR: 'Lütfen ambulans çağırın', NL: 'Bel alstublieft een ambulance', PL: 'Proszę wezwać karetkę', SV: 'Ring en ambulans, tack', VI: 'Xin hãy gọi xe cứu thương', TH: 'กรุณาโทรเรียกรถพยาบาล', HI: 'कृपया एम्बुलेंस बुलाएं', BG: 'Моля, извикайте линейка', CS: 'Prosím, zavolejte sanitku', DA: 'Ring venligst efter en ambulance', EL: 'Παρακαλώ καλέστε ασθενοφόρο', ET: 'Palun kutsuge kiirabi', FI: 'Soittakaa ambulanssi, kiitos', HU: 'Kérem, hívjon mentőt', LT: 'Prašau, iškvieskite greitąją pagalbą', LV: 'Lūdzu, izsauciet ātro palīdzību', NB: 'Vennligst ring en ambulanse', RO: 'Vă rog chemați o ambulanță', SK: 'Prosím, zavolajte sanitku', SL: 'Prosim, pokličite rešilca', UK: 'Будь ласка, викличте швидку допомогу' }
    },
    {
      idText: 'Saya butuh dokter',
      translations: { EN: 'I need a doctor', KO: '의사가 필요해요', JA: '医者が必要です', ZH: '我需要看医生', FR: "J'ai besoin d'un médecin", DE: 'Ich brauche einen Arzt', ES: 'Necesito un médico', IT: 'Ho bisogno di un medico', RU: 'Мне нужен врач', AR: 'أحتاج إلى طبيب', PT: 'Preciso de um médico', TR: 'Bir doktora ihtiyacım var', NL: 'Ik heb een dokter nodig', PL: 'Potrzebuję lekarza', SV: 'Jag behöver en läkare', VI: 'Tôi cần bác sĩ', TH: 'ฉันต้องการหมอ', HI: 'मुझे डॉक्टर चाहिए', BG: 'Имам нужда от лекар', CS: 'Potřebuji lékaře', DA: 'Jeg har brug for en læge', EL: 'Χρειάζομαι γιατρό', ET: 'Ma vajan arsti', FI: 'Tarvitsen lääkärin', HU: 'Orvosra van szükségem', LT: 'Man reikia gydytojo', LV: 'Man vajag ārstu', NB: 'Jeg trenger en lege', RO: 'Am nevoie de un doctor', SK: 'Potrebujem lekára', SL: 'Potrebujem zdravnika', UK: 'Мені потрібен лікар' }
    },
    {
      idText: 'Di mana rumah sakit terdekat?',
      translations: { EN: 'Where is the nearest hospital?', KO: '가장 가까운 병원이 어디예요?', JA: '一番近い病院はどこですか?', ZH: '最近的医院在哪里?', FR: "Où est l'hôpital le plus proche ?", DE: 'Wo ist das nächste Krankenhaus?', ES: '¿Dónde está el hospital más cercano?', IT: "Dov'è l'ospedale più vicino?", RU: 'Где находится ближайшая больница?', AR: 'أين أقرب مستشفى؟', PT: 'Onde fica o hospital mais próximo?', TR: 'En yakın hastane nerede?', NL: 'Waar is het dichtstbijzijnde ziekenhuis?', PL: 'Gdzie jest najbliższy szpital?', SV: 'Var ligger närmaste sjukhus?', VI: 'Bệnh viện gần nhất ở đâu?', TH: 'โรงพยาบาลที่ใกล้ที่สุดอยู่ที่ไหน?', HI: 'सबसे नज़दीकी अस्पताल कहाँ है?', BG: 'Къде е най-близката болница?', CS: 'Kde je nejbližší nemocnice?', DA: 'Hvor er det nærmeste hospital?', EL: 'Πού είναι το πλησιέστερο νοσοκομείο;', ET: 'Kus on lähim haigla?', FI: 'Missä on lähin sairaala?', HU: 'Hol van a legközelebbi kórház?', LT: 'Kur yra artimiausia ligoninė?', LV: 'Kur ir tuvākā slimnīca?', NB: 'Hvor er nærmeste sykehus?', RO: 'Unde este cel mai apropiat spital?', SK: 'Kde je najbližšia nemocnica?', SL: 'Kje je najbližja bolnišnica?', UK: 'Де найближча лікарня?' }
    },
    {
      idText: 'Saya tersesat',
      translations: { EN: 'I am lost', KO: '길을 잃었어요', JA: '道に迷いました', ZH: '我迷路了', FR: 'Je suis perdu(e)', DE: 'Ich habe mich verirrt', ES: 'Estoy perdido/a', IT: 'Mi sono perso/a', RU: 'Я заблудился/заблудилась', AR: 'أنا تائه', PT: 'Estou perdido/a', TR: 'Kayboldum', NL: 'Ik ben verdwaald', PL: 'Zgubiłem/am się', SV: 'Jag har gått vilse', VI: 'Tôi bị lạc đường', TH: 'ฉันหลงทาง', HI: 'मैं रास्ता भटक गया/गई हूँ', BG: 'Изгубих се', CS: 'Ztratil/a jsem se', DA: 'Jeg er faret vild', EL: 'Έχω χαθεί', ET: 'Ma olen eksinud', FI: 'Olen eksynyt', HU: 'Eltévedtem', LT: 'Aš pasiklydau', LV: 'Es esmu apmaldījies/apmaldījusies', NB: 'Jeg har gått meg bort', RO: 'M-am rătăcit', SK: 'Stratil/a som sa', SL: 'Izgubil/a sem se', UK: 'Я заблукав/заблукала' }
    },
    {
      idText: 'Paspor saya hilang',
      translations: { EN: 'I lost my passport', KO: '여권을 잃어버렸어요', JA: 'パスポートをなくしました', ZH: '我的护照丢了', FR: 'J\'ai perdu mon passeport', DE: 'Ich habe meinen Reisepass verloren', ES: 'He perdido mi pasaporte', IT: 'Ho perso il mio passaporto', RU: 'Я потерял(а) паспорт', AR: 'لقد فقدت جواز سفري', PT: 'Perdi meu passaporte', TR: 'Pasaportumu kaybettim', NL: 'Ik ben mijn paspoort kwijt', PL: 'Zgubiłem/am paszport', SV: 'Jag har tappat bort mitt pass', VI: 'Tôi bị mất hộ chiếu', TH: 'หนังสือเดินทางของฉันหาย', HI: 'मेरा पासपोर्ट खो गया है', BG: 'Загубих паспорта си', CS: 'Ztratil/a jsem pas', DA: 'Jeg har mistet mit pas', EL: 'Έχασα το διαβατήριό μου', ET: 'Ma kaotasin oma passi', FI: 'Kadotin passini', HU: 'Elvesztettem az útlevelemet', LT: 'Praradau savo pasą', LV: 'Es pazaudēju savu pasi', NB: 'Jeg har mistet passet mitt', RO: 'Mi-am pierdut pașaportul', SK: 'Stratil/a som pas', SL: 'Izgubil/a sem potni list', UK: 'Я загубив/загубила паспорт' }
    },
    {
      idText: 'Tolong hubungi polisi',
      translations: { EN: 'Please call the police', KO: '경찰을 불러주세요', JA: '警察を呼んでください', ZH: '请报警', FR: "Appelez la police, s'il vous plaît", DE: 'Bitte rufen Sie die Polizei', ES: 'Por favor, llame a la policía', IT: 'Per favore, chiami la polizia', RU: 'Пожалуйста, вызовите полицию', AR: 'من فضلك اتصل بالشرطة', PT: 'Por favor, chame a polícia', TR: 'Lütfen polisi arayın', NL: 'Bel alstublieft de politie', PL: 'Proszę wezwać policję', SV: 'Ring polisen, tack', VI: 'Xin hãy gọi cảnh sát', TH: 'กรุณาโทรแจ้งตำรวจ', HI: 'कृपया पुलिस को बुलाएं', BG: 'Моля, обадете се на полицията', CS: 'Prosím, zavolejte policii', DA: 'Ring venligst til politiet', EL: 'Παρακαλώ καλέστε την αστυνομία', ET: 'Palun kutsuge politsei', FI: 'Soittakaa poliisi, kiitos', HU: 'Kérem, hívja a rendőrséget', LT: 'Prašau, iškvieskite policiją', LV: 'Lūdzu, izsauciet policiju', NB: 'Vennligst ring politiet', RO: 'Vă rog chemați poliția', SK: 'Prosím, zavolajte políciu', SL: 'Prosim, pokličite policijo', UK: 'Будь ласка, викличте поліцію' }
    }
  ];

  function populateEmergencyLangSelect() {
    updateEmergencyLangPillLabel();
  }

  function updateEmergencyLangPillLabel() {
    const lang = getLangByCode(emergencyLangCode);
    emergencyLangPillLabel.textContent = `${lang.flag} ${lang.name}`;
  }

  function renderEmergencyPhrases(langCode) {
    emergencyPhraseList.innerHTML = '';

    EMERGENCY_PHRASES.forEach(phrase => {
      const translated = phrase.translations[langCode] || phrase.translations.EN;

      const card = document.createElement('div');
      card.className = 'emergency-phrase-card';
      card.innerHTML = `
        <div class="emergency-phrase-text">
          <div class="emergency-phrase-id">${phrase.idText}</div>
          <div class="emergency-phrase-translated">${translated}</div>
        </div>
        <button class="emergency-phrase-speak-btn" aria-label="Dengarkan">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        </button>
      `;

      card.querySelector('.emergency-phrase-translated').addEventListener('click', () => {
        showFullscreenText(translated);
      });

      card.querySelector('.emergency-phrase-speak-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        speakSentence(translated, langCode, false);
      });

      emergencyPhraseList.appendChild(card);
    });
  }

  function openEmergencyPhrases() {
    renderEmergencyPhrases(emergencyLangCode);
    emergencyPhrasesOverlay.classList.add('active');
  }

  function closeEmergencyPhrases() {
    emergencyPhrasesOverlay.classList.remove('active');
  }

  function queueTranslation(text) {
    if (translateDebounceTimeout) {
      clearTimeout(translateDebounceTimeout);
    }

    if (!text || !text.trim()) {
      targetTextEl.textContent = 'Hasil Terjemahan';
      targetTextEl.classList.add('translation-placeholder');
      adjustFontSize(targetTextEl, 'Hasil Terjemahan');
      updateRomanizationDisplay('');
      updateFavoriteBtnState();
      return;
    }

    translateDebounceTimeout = setTimeout(() => {
      // shouldSaveHistory = false — ini cuma preview selagi user masih mengetik.
      // Baru disimpan ke history kalau user benar-benar menekan Enter.
      performTranslation(text, false);
    }, 1000);
  }

  // ---- SPEECH RECOGNITION (STT) ----
  function initSpeechRecognition() {
    try {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        console.warn('Speech recognition is not supported in this browser environment');
        return;
      }

      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = function () {
        isListening = true;
        voiceInputBtn.classList.add('listening-active');
        showToast('Mendengarkan...');
      };

      rec.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          sourceTextEl.value = transcript;
          adjustFontSize(sourceTextEl, transcript);
          updateClearButtonVisibility();
          showToast('Suara terekam!');
          performTranslation(transcript, true);
        }
      };

      rec.onerror = function (err) {
        console.error('STT Voice error:', err.error);
        showToast(`Kesalahan: ${err.error}`);
        stopSpeechRecognition();
      };

      rec.onend = function () {
        stopSpeechRecognition();
      };

      speechRecognitionInstance = rec;
    } catch (e) {
      console.error('Failed to initialize Speech Recognition:', e);
    }
  }

 function stopSpeechRecognition() {
  isListening = false;
  voiceInputBtn.classList.remove('listening-active');

  if (speechRecognitionInstance) {
    try {
      speechRecognitionInstance.stop();
    } catch (e) {}
    try {
      speechRecognitionInstance.abort();
    } catch (e) {}
    // Hapus semua referensi
    speechRecognitionInstance = null;
  }

  // Coba matikan semua stream audio yang mungkin tertinggal
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
          console.log('🔇 Stream audio dimatikan');
        })
        .catch(() => {});
    }
  } catch (e) {}

  console.log('🎤 Microphone released');
}

  function toggleVoiceInput() {
    try {
      if (!speechRecognitionInstance) {
        initSpeechRecognition();
      }

      if (!speechRecognitionInstance) {
        showToast('Browser Anda tidak mendukung perekaman suara');
        return;
      }

      if (isListening) {
        stopSpeechRecognition();
      } else {
        const srcLangObj = getLangByCode(sourceLang);
        let speechCode = srcLangObj.speechCode || 'en-US';
        // Normalize language code pattern for Safari
        speechCode = speechCode.replace('_', '-');
        
        try {
          speechRecognitionInstance.lang = speechCode;
        } catch (langErr) {
          console.warn('Safari SpeechRecognition lang assignment failed:', langErr);
          try {
            speechRecognitionInstance.lang = 'en-US';
          } catch (e) {}
        }

        try {
          speechRecognitionInstance.start();
        } catch (startErr) {
          console.error('STT start failed:', startErr);
          try {
            speechRecognitionInstance.lang = 'en-US';
            speechRecognitionInstance.start();
          } catch (retryErr) {
            console.error('STT fallback failed:', retryErr);
            showToast('Bahasa perekaman tidak didukung di perangkat ini.');
            stopSpeechRecognition();
          }
        }
      }
    } catch (e) {
      console.error('STT activation error:', e);
      showToast('Gagal memulai perekaman suara.');
      stopSpeechRecognition();
    }
  }

  // ---- SPEECH SYNTHESIS (TTS) ----
  let activeSynthesisUtterance = null;
  function speakSentence(text, langCode, isSourceCard) {
    if (!text || !text.trim() || text === 'Hasil Terjemahan' || text === 'Menerjemahkan...') {
      showToast('Tidak ada teks untuk diputar');
      return;
    }

    if (!('speechSynthesis' in window)) {
      showToast('Browser Anda tidak mendukung pemutar suara');
      return;
    }

    try {
      window.speechSynthesis.cancel();

      // If currently speaking, toggle off
      if (activeSynthesisUtterance) {
        activeSynthesisUtterance = null;
        return;
      }

      const langObj = getLangByCode(langCode);
      const utterance = new SpeechSynthesisUtterance(text);
      let ttsCode = langObj.ttsCode || 'en-US';
      // Normalize language code pattern for Safari
      ttsCode = ttsCode.replace('_', '-');
      
      try {
        utterance.lang = ttsCode;
      } catch (langErr) {
        console.warn('SpeechSynthesis lang setting failed:', langErr);
        try {
          utterance.lang = 'en-US';
        } catch (e) {}
      }

      utterance.onstart = function () {
        activeSynthesisUtterance = utterance;
      };

      utterance.onend = function () {
        activeSynthesisUtterance = null;
      };

      utterance.onerror = function () {
        activeSynthesisUtterance = null;
      };

      try {
        window.speechSynthesis.speak(utterance);
        showToast('Memutar suara...');
      } catch (speakErr) {
        console.error('SpeechSynthesis speak failed:', speakErr);
        try {
          utterance.lang = 'en-US';
          window.speechSynthesis.speak(utterance);
          showToast('Memutar suara...');
        } catch (retrySpeakErr) {
          console.error('SpeechSynthesis fallback speak failed:', retrySpeakErr);
          showToast('Bahasa ini tidak didukung untuk pemutar suara.');
          activeSynthesisUtterance = null;
        }
      }
    } catch (e) {
      console.error('TTS error:', e);
      showToast('Pemutar suara tidak didukung oleh perangkat ini.');
      activeSynthesisUtterance = null;
    }
  }

  // ---- CLIPBOARD COPY UTILS ----
  async function copyTextToClipboard(text) {
    if (!text || !text.trim() || text === 'Hasil Terjemahan') {
      showToast('Tidak ada teks untuk disalin');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast('Teks disalin ke papan klip!');
    } catch (e) {
      console.error('Clipboard write error:', e);
      showToast('Gagal menyalin teks');
    }
  }

  // ---- LANGUAGE SELECTION BOTTOM SHEET DRAWER ----
  function openLanguageSheet(type) {
    currentSelectingLangType = type;
    let title = 'Pilih Bahasa Tujuan';
    if (type === 'source') title = 'Pilih Bahasa Asal';
    else if (type === 'convA') title = 'Bahasa Kamu';
    else if (type === 'convB') title = 'Bahasa Lawan Bicara';
    else if (type === 'unitFrom' || type === 'unitTo') title = 'Pilih Satuan';
    else if (type === 'currencyFrom' || type === 'currencyTo') title = 'Pilih Mata Uang';
    else if (type === 'emergencyLang') title = 'Pilih Bahasa';
    sheetTitle.textContent = title;
    
    langSearchInput.value = '';
    langSearchQuery = '';
    renderLanguagesInSheet();
    
    languageSheet.classList.add('active');
  }

  function closeLanguageSheet() {
    languageSheet.classList.remove('active');
    currentSelectingLangType = null;
  }

  // Ambil daftar item untuk ditampilkan di sheet, sesuai tipe picker yang sedang aktif.
  // Semua item dinormalisasi ke bentuk {code, flag, name} supaya render loop-nya generik.
  function getSheetItems(type) {
    if (type === 'unitFrom' || type === 'unitTo') {
      const cat = UNIT_CATEGORIES[currentUnitCategory];
      return Object.keys(cat.units).map(key => ({ code: key, flag: '📏', name: cat.units[key].name }));
    }
    if (type === 'currencyFrom' || type === 'currencyTo') {
      return CURRENCY_LIST;
    }
    if (type === 'emergencyLang') {
      return languages.filter(l => EMERGENCY_LANGUAGES.indexOf(l.code) !== -1);
    }
    return languages;
  }

  function getSheetCurrentSelected(type) {
    switch (type) {
      case 'source': return sourceLang;
      case 'imageTarget': return imageTranslateTargetLang;
      case 'convA': return convLangA;
      case 'convB': return convLangB;
      case 'unitFrom': return unitFromKey;
      case 'unitTo': return unitToKey;
      case 'currencyFrom': return currencyFromCode;
      case 'currencyTo': return currencyToCode;
      case 'emergencyLang': return emergencyLangCode;
      default: return targetLang;
    }
  }

  function renderLanguagesInSheet() {
    languageListContainer.innerHTML = '';

    const items = getSheetItems(currentSelectingLangType);
    const currentSelected = getSheetCurrentSelected(currentSelectingLangType);
    const query = langSearchQuery.toLowerCase().trim();

    const excludeAutoTypes = ['target', 'imageTarget', 'convA', 'convB', 'emergencyLang'];
    const filteredLangs = items.filter(lang => {
      if (excludeAutoTypes.indexOf(currentSelectingLangType) !== -1 && lang.code === 'AUTO') {
        return false;
      }
      return lang.name.toLowerCase().includes(query);
    });

    if (filteredLangs.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.style.textAlign = 'center';
      emptyDiv.style.padding = '32px 16px';
      emptyDiv.style.color = 'rgba(255,255,255,0.35)';
      emptyDiv.style.fontSize = '14px';
      emptyDiv.textContent = 'Tidak ditemukan';
      languageListContainer.appendChild(emptyDiv);
      return;
    }

    filteredLangs.forEach(lang => {
      const item = document.createElement('div');
      item.className = 'lang-list-item' + (currentSelected === lang.code ? ' selected' : '');
      item.dataset.code = lang.code;

      item.innerHTML = `
        <div class="lang-item-left">
          <span class="lang-item-flag">${lang.flag}</span>
          <span class="lang-item-name">${lang.name}</span>
        </div>
        <svg class="lang-item-check" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;

      item.addEventListener('click', function () {
        selectLanguage(lang.code);
      });

      languageListContainer.appendChild(item);
    });
  }

  function selectLanguage(code) {
    if (currentSelectingLangType === 'source') {
      sourceLang = code;
      updateLangPills();
      closeLanguageSheet();
      performTranslation(sourceTextEl.value, true);
      return;
    }

    if (currentSelectingLangType === 'imageTarget') {
      imageTranslateTargetLang = code;
      closeLanguageSheet();
      if (lastCapturedPhoto) {
        runImageTranslation(lastCapturedPhoto, imageTranslateTargetLang);
      }
      return;
    }

    if (currentSelectingLangType === 'convA' || currentSelectingLangType === 'convB') {
      if (currentSelectingLangType === 'convA') {
        convLangA = code;
      } else {
        convLangB = code;
      }
      updateConvLangPills();
      closeLanguageSheet();
      return;
    }

    if (currentSelectingLangType === 'unitFrom' || currentSelectingLangType === 'unitTo') {
      if (currentSelectingLangType === 'unitFrom') {
        unitFromKey = code;
      } else {
        unitToKey = code;
      }
      const cat = UNIT_CATEGORIES[currentUnitCategory];
      unitFromPillLabel.textContent = cat.units[unitFromKey].name;
      unitToPillLabel.textContent = cat.units[unitToKey].name;
      closeLanguageSheet();
      recalculateUnitFromInput();
      return;
    }

    if (currentSelectingLangType === 'currencyFrom' || currentSelectingLangType === 'currencyTo') {
      if (currentSelectingLangType === 'currencyFrom') {
        currencyFromCode = code;
      } else {
        currencyToCode = code;
      }
      updateCurrencyPillLabels();
      closeLanguageSheet();
      updateCurrencyRateInfoText();
      recalculateCurrencyFromInput();
      return;
    }

    if (currentSelectingLangType === 'emergencyLang') {
      emergencyLangCode = code;
      updateEmergencyLangPillLabel();
      closeLanguageSheet();
      renderEmergencyPhrases(emergencyLangCode);
      return;
    }

    targetLang = code;
    updateLangPills();
    closeLanguageSheet();
    performTranslation(sourceTextEl.value, true);
  }

  // ---- HISTORY SCREEN & ACTIONS ----
  function formatHistoryDate(timestamp) {
    try {
      const d = new Date(timestamp);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      console.warn('Date formatting failed, falling back:', e);
      try {
        return new Date(timestamp).toISOString().substring(0, 16).replace('T', ' ');
      } catch (e2) {
        return '';
      }
    }
  }

  function renderHistoryItems() {
    historyListContainer.innerHTML = '';
    const query = historySearchQuery.toLowerCase().trim();

    const filtered = historyList.filter(item => {
      if (activeHistoryTab === 'favorite' && !item.favorite) {
        return false;
      }
      if (!query) return true;
      return item.source.toLowerCase().includes(query) || item.translated.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      historyListContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <p class="empty-state-title">Tidak ada hasil ditemukan</p>
          <p class="empty-state-subtitle">Cari kata atau terjemahan lainnya</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'history-card';
      
      const srcObj = getLangByCode(item.srcLang);
      const tgtObj = getLangByCode(item.tgtLang);

      card.innerHTML = `
        <div class="history-card-content">
          <div class="history-card-langs">
            <span>${srcObj.flag} ${item.srcLang}</span>
            <span class="arrow">➔</span>
            <span>${tgtObj.flag} ${item.tgtLang}</span>
          </div>
          <div class="history-card-source">${item.source}</div>
          <div class="history-card-translated">${item.translated}</div>
          <span class="history-card-time">${formatHistoryDate(item.timestamp)}</span>
        </div>
        <div class="history-card-actions">
          <button class="history-card-btn fav ${item.favorite ? 'active' : ''}" data-id="${item.id}" aria-label="Favorit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
          <button class="history-card-btn del" data-id="${item.id}" aria-label="Hapus">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </button>
        </div>
      `;

      // Click card to restore translation to workspace
      card.addEventListener('click', function (e) {
        if (e.target.closest('.history-card-btn')) return;
        
        sourceLang = item.srcLang;
        targetLang = item.tgtLang;
        sourceTextEl.value = item.source;
        targetTextEl.textContent = item.translated;
        
        adjustFontSize(sourceTextEl, item.source);
        adjustFontSize(targetTextEl, item.translated);
        targetTextEl.classList.remove('translation-placeholder');
        updateRomanizationDisplay(item.romanization || '');
        updateClearButtonVisibility();
        
        updateLangPills();
        historyOverlay.classList.remove('active');
        showToast('Terjemahan dimuat!');
      });

      // Favorite toggle click
      card.querySelector('.fav').addEventListener('click', function (e) {
        e.stopPropagation();
        const id = parseInt(this.dataset.id);
        toggleFavoriteItem(id);
      });

      // Delete click
      card.querySelector('.del').addEventListener('click', function (e) {
        e.stopPropagation();
        const id = parseInt(this.dataset.id);
        deleteHistoryItem(id);
      });

      historyListContainer.appendChild(card);
    });
  }

  function toggleFavoriteItem(id) {
    historyList = historyList.map(item => {
      if (item.id === id) {
        return { ...item, favorite: !item.favorite };
      }
      return item;
    });
    saveHistoryToStorage();
    renderHistoryItems();
    updateFavoriteBtnState();
    showToast('Favorit diperbarui');
  }

  function deleteHistoryItem(id) {
    historyList = historyList.filter(item => item.id !== id);
    saveHistoryToStorage();
    renderHistoryItems();
    updateFavoriteBtnState();
    showToast('Riwayat dihapus');
  }

  function clearAllHistory() {
    if (confirm('Hapus seluruh riwayat terjemahan?')) {
      historyList = [];
      saveHistoryToStorage();
      renderHistoryItems();
      updateFavoriteBtnState();
      showToast('Seluruh riwayat dibersihkan');
    }
  }

  // ---- WORKSPACE ACTIONS ----
  function handleFavoriteToggle() {
    const srcText = sourceTextEl.value.trim();
    const tgtText = targetTextEl.textContent.trim();

    if (!srcText || !tgtText || tgtText === 'Hasil Terjemahan' || tgtText === 'Menerjemahkan...') {
      showToast('Tidak ada teks untuk difavoritkan');
      return;
    }

    const existingIndex = historyList.findIndex(item => 
      item.source.trim().toLowerCase() === srcText.toLowerCase() && 
      item.srcLang === sourceLang && 
      item.tgtLang === targetLang
    );

    if (existingIndex > -1) {
      // Toggle existing
      historyList[existingIndex].favorite = !historyList[existingIndex].favorite;
      showToast(historyList[existingIndex].favorite ? 'Disimpan ke Favorit' : 'Dihapus dari Favorit');
    } else {
      // Add as favorite directly
      const newItem = {
        id: Date.now(),
        source: srcText,
        translated: tgtText,
        romanization: currentRomanization,
        srcLang: sourceLang,
        tgtLang: targetLang,
        timestamp: new Date().toISOString(),
        favorite: true
      };
      historyList.unshift(newItem);
      showToast('Disimpan ke Favorit');
    }

    saveHistoryToStorage();
    updateFavoriteBtnState();
  }

  function handleLanguageSwap() {
    if (sourceLang === 'AUTO') {
      showToast('Tidak dapat menukar dengan Deteksi Otomatis');
      return;
    }

    const tempLang = sourceLang;
    const tempText = sourceTextEl.value;

    sourceLang = targetLang;
    targetLang = tempLang;

    sourceTextEl.value = targetTextEl.textContent === 'Hasil Terjemahan' || targetTextEl.textContent === 'Menerjemahkan...' ? '' : targetTextEl.textContent;
    targetTextEl.textContent = tempText || 'Hasil Terjemahan';

    if (!sourceTextEl.value) {
      targetTextEl.classList.add('translation-placeholder');
    } else {
      targetTextEl.classList.remove('translation-placeholder');
    }

    adjustFontSize(sourceTextEl, sourceTextEl.value);
    adjustFontSize(targetTextEl, targetTextEl.textContent);
    updateRomanizationDisplay(''); // romanisasi lama tidak relevan lagi setelah swap
    updateClearButtonVisibility();

    updateLangPills();
    showToast('Bahasa ditukar');
    
    // Trigger translation for swapped text
    if (sourceTextEl.value.trim()) {
      performTranslation(sourceTextEl.value, true);
    }
  }

  function clearAllWorkspace() {
    sourceTextEl.value = '';
    targetTextEl.textContent = 'Hasil Terjemahan';
    targetTextEl.classList.add('translation-placeholder');
    
    adjustFontSize(sourceTextEl, '');
    adjustFontSize(targetTextEl, 'Hasil Terjemahan');
    updateRomanizationDisplay('');
    updateClearButtonVisibility();
    
    updateFavoriteBtnState();
    showToast('Papan ketik dibersihkan');
    sourceTextEl.focus();
  }

  function init() {
    loadHistoryFromStorage();
    updateLangPills();
    stopSpeechRecognition();
    populateCurrencySelects();
    populateEmergencyLangSelect();
    updateOnlineStatus();
    window.addEventListener('online', function () {
      updateOnlineStatus();
      showToast('Koneksi kembali tersambung');
    });
    window.addEventListener('offline', updateOnlineStatus);

    // ---- CLEAR TEXT BUTTON (X) ----
    if (clearTextBtn) {
      sourceTextEl.addEventListener('input', updateClearButtonVisibility);

      clearTextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        clearAllWorkspace();
        sourceTextEl.focus();
      });

      clearTextBtn.classList.remove('visible');
    }

    // Matikan mikrofon saat app masuk background
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopSpeechRecognition();
        stopConvListening();
      }
    });

    // Matikan mikrofon saat aplikasi keluar
    window.addEventListener('pagehide', function () {
      stopSpeechRecognition();
      stopConvListening();
    });

    // Matikan mikrofon saat app akan ditutup
    window.addEventListener('beforeunload', function () {
      stopSpeechRecognition();
      stopConvListening();
    });

    // Text Input Events
    sourceTextEl.addEventListener('input', function () {
      adjustFontSize(this, this.value);
      queueTranslation(this.value);
    });

    sourceTextEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent carriage return
        this.blur(); // Dismiss native mobile keyboard

        const text = this.value.trim();
        if (text) {
          // Cancel any scheduled debounced translation timeout to trigger immediate translation
          if (translateDebounceTimeout) {
            clearTimeout(translateDebounceTimeout);
          }
          performTranslation(text, true); // Force immediate translation and save to history
        }
      }
    });

    // Language pills clicking
    sourceLangPill.addEventListener('click', () => openLanguageSheet('source'));
    targetLangPill.addEventListener('click', () => openLanguageSheet('target'));

    // Bottom Sheet search & close
    closeSheetBtn.addEventListener('click', closeLanguageSheet);
    sheetBackdrop.addEventListener('click', closeLanguageSheet);
    langSearchInput.addEventListener('input', function () {
      langSearchQuery = this.value;
      renderLanguagesInSheet();
    });

    // History and favorite workspace events
    swapBtn.addEventListener('click', handleLanguageSwap);
    favoriteBtn.addEventListener('click', handleFavoriteToggle);
    cameraTranslateBtn.addEventListener('click', handleCameraTranslate);
    backFromImageResultBtn.addEventListener('click', closeImageResultScreen);
    imageTargetLangPill.addEventListener('click', () => openLanguageSheet('imageTarget'));

    conversationModeBtn.addEventListener('click', openConversationMode);
    backFromConversationBtn.addEventListener('click', closeConversationMode);
    convSwapBtn.addEventListener('click', handleConvSwap);
    convLangAPill.addEventListener('click', () => openLanguageSheet('convA'));
    convLangBPill.addEventListener('click', () => openLanguageSheet('convB'));
    convMicA.addEventListener('click', () => startConvListening('A'));
    convMicB.addEventListener('click', () => startConvListening('B'));

  // Travel Tools Hub
  travelToolsBtn.addEventListener('click', openTravelToolsHub);
  backFromTravelToolsBtn.addEventListener('click', closeTravelToolsHub);
  openUnitConverterBtn.addEventListener('click', () => {
    closeTravelToolsHub();
    openUnitConverter();
  });

  // Konverter Satuan
  backFromUnitConverterBtn.addEventListener('click', closeUnitConverter);
  unitCategoryTabs.addEventListener('click', function (e) {
    const btn = e.target.closest('.segment-btn');
    if (!btn) return;
    unitCategoryTabs.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    switchUnitCategory(btn.dataset.category);
  });
  unitInputFrom.addEventListener('input', recalculateUnitFromInput);
  unitInputTo.addEventListener('input', function () {
    const val = parseFloat(this.value);
    if (isNaN(val)) { unitInputFrom.value = ''; return; }
    const result = convertUnit(val, unitToKey, unitFromKey);
    if (result !== null) {
      unitInputFrom.value = roundNice(result);
    }
  });
  unitFromPill.addEventListener('click', () => openLanguageSheet('unitFrom'));
  unitToPill.addEventListener('click', () => openLanguageSheet('unitTo'));
  unitSwapBtn.addEventListener('click', handleUnitSwap);

  openTippingInfoBtn.addEventListener('click', () => {
    closeTravelToolsHub();
    openTippingInfo();
  });
  backFromTippingInfoBtn.addEventListener('click', closeTippingInfo);
  tippingSearchInput.addEventListener('input', function () {
    renderTippingList(this.value);
  });

  showToLocalBtn.addEventListener('click', handleShowToLocal);
  showToLocalOverlay.addEventListener('click', closeShowToLocal);

  openCurrencyCalcBtn.addEventListener('click', () => {
    closeTravelToolsHub();
    openCurrencyCalculator();
  });
  backFromCurrencyCalcBtn.addEventListener('click', closeCurrencyCalculator);
  currencySwapBtn.addEventListener('click', handleCurrencySwap);
  currencyInputFrom.addEventListener('input', recalculateCurrencyFromInput);
  currencyInputTo.addEventListener('input', function () {
    const val = parseFloat(this.value);
    if (isNaN(val)) { currencyInputFrom.value = ''; return; }
    const result = convertCurrency(val, currencyToCode, currencyFromCode);
    if (result !== null) {
      currencyInputFrom.value = roundNice(result);
    }
  });
  currencyFromPill.addEventListener('click', () => openLanguageSheet('currencyFrom'));
  currencyToPill.addEventListener('click', () => openLanguageSheet('currencyTo'));

  openEmergencyPhrasesBtn.addEventListener('click', () => {
    closeTravelToolsHub();
    openEmergencyPhrases();
  });
  backFromEmergencyPhrasesBtn.addEventListener('click', closeEmergencyPhrases);
  emergencyLangPill.addEventListener('click', () => openLanguageSheet('emergencyLang'));

    // History overlay navigation
    historyBtn.addEventListener('click', () => {
      historyOverlay.classList.add('active');
      renderHistoryItems();
    });
    backFromHistoryBtn.addEventListener('click', () => {
      historyOverlay.classList.remove('active');
    });
    clearHistoryBtn.addEventListener('click', clearAllHistory);

    // Segmented tabs within History Overlay
    tabHistory.addEventListener('click', function () {
      tabHistory.classList.add('active');
      tabFavourite.classList.remove('active');
      activeHistoryTab = 'history';
      renderHistoryItems();
    });
    tabFavourite.addEventListener('click', function () {
      tabFavourite.classList.add('active');
      tabHistory.classList.remove('active');
      activeHistoryTab = 'favorite';
      renderHistoryItems();
    });

    // Search filter inside History Overlay
    historySearchInput.addEventListener('input', function () {
      historySearchQuery = this.value;
      searchClearBtn.classList.toggle('visible', this.value.length > 0);
      renderHistoryItems();
    });
    searchClearBtn.addEventListener('click', () => {
      historySearchInput.value = '';
      historySearchQuery = '';
      searchClearBtn.classList.remove('visible');
      renderHistoryItems();
    });

    // Audio triggers
    voiceInputBtn.addEventListener('click', toggleVoiceInput);
    speakSourceBtn.addEventListener('click', () => speakSentence(sourceTextEl.value, sourceLang, true));
    speakTargetBtn.addEventListener('click', () => speakSentence(targetTextEl.textContent, targetLang, false));

    // Copy triggers
    copySourceBtn.addEventListener('click', () => copyTextToClipboard(sourceTextEl.value));
    copyTargetBtn.addEventListener('click', () => copyTextToClipboard(targetTextEl.textContent));

    // Handle initial keyboard layout optimizations
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        stopSpeechRecognition();
        try {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
        } catch (e) {}
      }
    });

    console.log('Haka Translator vanilla engine initialized successfully.');
  }

  // Self start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();