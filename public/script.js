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
  let imageTranslateTargetLang = 'EN'; // Target khusus layar translate foto, selalu reset ke EN tiap buka foto baru
  let lastCapturedPhoto = null; // Foto terakhir yang diambil, dipakai kalau target bahasa diganti di layar hasil
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
  
  // Speakers / Copies
  const speakSourceBtn = document.getElementById('speakSourceBtn');
  const speakTargetBtn = document.getElementById('speakTargetBtn');
  const copySourceBtn = document.getElementById('copySourceBtn');
  const cameraTranslateBtn = document.getElementById('cameraTranslateBtn');
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
  const CameraPlugin = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Camera;
  if (!CameraPlugin) {
    showToast('Fitur kamera hanya tersedia di aplikasi (bukan browser).');
    return;
  }

  let photo;
  try {
    photo = await CameraPlugin.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: 'base64',
      source: 'PROMPT',
      width: 1600,
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
      throw new Error(data?.error || 'Server Error (' + response.status + '): ' + rawText.substring(0, 150));
    }

    if (!data.blocks || !data.blocks.length) {
      showToast('Tidak ada teks yang terbaca dari foto ini. Coba foto yang lebih jelas.');
      imageSourceLangName.textContent = 'Tidak terbaca';
      return;
    }

    imageSourceLangName.textContent = data.detectedLanguage || 'Tidak diketahui';
    renderImageOverlayLabels(data.blocks);

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
      performTranslation(text, true);
    }, 1000); // 1s optimal user experience typing delay
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
    sheetTitle.textContent = type === 'source' ? 'Pilih Bahasa Asal' : 'Pilih Bahasa Tujuan';
    
    // Clear search and render the list
    langSearchInput.value = '';
    langSearchQuery = '';
    renderLanguagesInSheet();
    
    languageSheet.classList.add('active');
  }

  function closeLanguageSheet() {
    languageSheet.classList.remove('active');
    currentSelectingLangType = null;
  }

  function renderLanguagesInSheet() {
    languageListContainer.innerHTML = '';
    
    const currentSelected = currentSelectingLangType === 'source' ? sourceLang : (currentSelectingLangType === 'imageTarget' ? imageTranslateTargetLang : targetLang);
    const query = langSearchQuery.toLowerCase().trim();

    // Filter languages
    const filteredLangs = languages.filter(lang => {
      // Kalau lagi pilih target (baik target biasa maupun target khusus translate foto), AUTO tidak relevan
      if ((currentSelectingLangType === 'target' || currentSelectingLangType === 'imageTarget') && lang.code === 'AUTO') {
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
      emptyDiv.textContent = 'Bahasa tidak ditemukan';
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
    
    updateFavoriteBtnState();
    showToast('Papan ketik dibersihkan');
    sourceTextEl.focus();
  }

  function init() {
  loadHistoryFromStorage();
  updateLangPills();
  stopSpeechRecognition();

  // ---- CLEAR TEXT BUTTON (X) ----
  const clearTextBtn = document.getElementById('clearTextBtn');

  if (clearTextBtn) {
    // Tampilkan/sembunyikan tombol X berdasarkan teks
    sourceTextEl.addEventListener('input', function () {
      const hasText = this.value.length > 0;
      clearTextBtn.classList.toggle('visible', hasText);
    });

    // Saat tombol X diklik, kosongkan workspace
    clearTextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      clearAllWorkspace(); // fungsi yang sudah ada
      clearTextBtn.classList.remove('visible');
      sourceTextEl.focus();
    });

    // Sembunyikan tombol saat pertama kali load (tidak ada teks)
    clearTextBtn.classList.remove('visible');
  }

  // Matikan mikrofon saat app masuk background
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopSpeechRecognition();
    }
  });

  // Matikan mikrofon saat aplikasi keluar
  window.addEventListener('pagehide', function () {
    stopSpeechRecognition();
  });

  // Matikan mikrofon saat app akan ditutup
  window.addEventListener('beforeunload', function () {
    stopSpeechRecognition();
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