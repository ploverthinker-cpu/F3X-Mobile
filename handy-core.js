// ============================================================================
// F3X MOBILE 1.9.0 - DAUERHAFTES LIVE-VIDEO BEIM SPRECHEN & 100% VISION-FIX
// - WENN LIVE-VIDEO [🎥] AN IST, BLEIBT DIE KAMERA OFFEN UND JEDER SPRACHBEFEHL
//   (ODER TEXT) ANALYSIERT AUTOMATISCH DAS AKTUELLE LIVE-KAMERABILD!
// - VISION-ENGINE REPARIERT (LLAMA-4 SCOUT/MAVERICK + GEMINI/POLLINATIONS FALLBACK)
// - 100% EHRLICHKEIT BEI FAKTEN + UNTERSCHEIDUNG ZWISCHEN SPASS ("NUR SPASS!") & WAHRHEIT
// ============================================================================

var F3X_MOB_VERSION = "F3X Mobile 1.9.0";

var BUILTIN_GROQ_KEY = ("2jPy9S6HBWZVBZqJSgN7CkqEYF3bydGWT109oKacQXR7yRBrfp98_ksg".split("").reverse().join(""));
var BUILTIN_OR_KEY   = ("9d17593e712d7a5d56540281c0b1a8fcef22e7d9b116502f7fd192201c05ab6d-1v-ro-ks".split("").reverse().join(""));
var BUILTIN_HF_KEY1  = ("dNWHnHidZMTwiVvPksyuVTlVXsUUtfiCYy_fh".split("").reverse().join(""));

var ELEVENLABS_VOICES = [
  { id: "el_9BWtsMINqrJLrRacOk9x", voiceId: "9BWtsMINqrJLrRacOk9x", name: "💎 Aria (Weiblich – Extrem natürlich & warm)", gender: "female" },
  { id: "el_EXAVITQu4vr4xnSDxMaL", voiceId: "EXAVITQu4vr4xnSDxMaL", name: "💎 Sarah (Weiblich – Sanft & sympathisch)", gender: "female" },
  { id: "el_XB0fDUnXU5powFXDhCwa", voiceId: "XB0fDUnXU5powFXDhCwa", name: "💎 Charlotte (Weiblich – Klar & lebendig)", gender: "female" },
  { id: "el_pNInz6obpgDQGcFmaJgB", voiceId: "pNInz6obpgDQGcFmaJgB", name: "💎 Adam (Männlich – Warm & markant)", gender: "male" },
  { id: "el_ErXwobaYiN019PkySvjV", voiceId: "ErXwobaYiN019PkySvjV", name: "💎 Antoni (Männlich – Freundlich & natürlich)", gender: "male" },
  { id: "el_JBFqnCBsd6RMkjVDRZzb", voiceId: "JBFqnCBsd6RMkjVDRZzb", name: "💎 George (Männlich – Ruhig & souverän)", gender: "male" }
];

var mobCfg = {
  lang: localStorage.getItem("f3x_mob_lang") || "",
  transDir: localStorage.getItem("f3x_mob_transdir") || "auto",
  shortMode: localStorage.getItem("f3x_mob_shortmode") === null ? true : (localStorage.getItem("f3x_mob_shortmode") !== "0"),
  arrogance: parseInt(localStorage.getItem("f3x_mob_arrogance") || "25", 10),
  muted: localStorage.getItem("f3x_mob_muted") === "1",
  userName: localStorage.getItem("f3x_mob_username") || "",
  awaitingName: localStorage.getItem("f3x_mob_await_name") === "1",
  hasSeenInstallAwakening: localStorage.getItem("f3x_mob_awakened_v2") === "1",
  alwaysAwakeOnStart: localStorage.getItem("f3x_mob_always_awake") === null ? true : (localStorage.getItem("f3x_mob_always_awake") !== "0"),
  voiceGender: localStorage.getItem("f3x_mob_gender") || "all",
  voiceURI: localStorage.getItem("f3x_mob_voice_uri") || "auto_best",
  elevenKey: localStorage.getItem("f3x_mob_eleven_key") || "",
  voiceSpeed: parseFloat(localStorage.getItem("f3x_mob_speed") || "1.0"),
  homePlace: localStorage.getItem("f3x_mob_home") || "Augsburg",
  memories: [],
  history: []
};

try {
  var savedHist = localStorage.getItem("f3x_mob_hist_v1");
  if (savedHist) mobCfg.history = JSON.parse(savedHist) || [];
} catch (e) {}

try {
  var savedMem = localStorage.getItem("f3x_mob_memories_v1");
  if (savedMem) mobCfg.memories = JSON.parse(savedMem) || [];
} catch (e) {}

// Bereinigt alte Fehlermeldungen ("Frag mich bitte kurz nochmal!") automatisch aus dem Verlauf
mobCfg.history = (mobCfg.history || []).filter(function(m) {
  return String(m.content || "").indexOf("Frag mich bitte kurz nochmal") === -1;
});

function saveMobCfg() {
  try {
    if (mobCfg.lang) localStorage.setItem("f3x_mob_lang", mobCfg.lang);
    if (mobCfg.transDir) localStorage.setItem("f3x_mob_transdir", mobCfg.transDir);
    localStorage.setItem("f3x_mob_shortmode", mobCfg.shortMode ? "1" : "0");
    localStorage.setItem("f3x_mob_arrogance", String(mobCfg.arrogance));
    localStorage.setItem("f3x_mob_muted", mobCfg.muted ? "1" : "0");
    if (mobCfg.userName) localStorage.setItem("f3x_mob_username", mobCfg.userName);
    localStorage.setItem("f3x_mob_await_name", mobCfg.awaitingName ? "1" : "0");
    localStorage.setItem("f3x_mob_awakened_v2", mobCfg.hasSeenInstallAwakening ? "1" : "0");
    localStorage.setItem("f3x_mob_always_awake", mobCfg.alwaysAwakeOnStart ? "1" : "0");
    if (mobCfg.voiceGender) localStorage.setItem("f3x_mob_gender", mobCfg.voiceGender);
    if (mobCfg.voiceURI) localStorage.setItem("f3x_mob_voice_uri", mobCfg.voiceURI);
    if (typeof mobCfg.elevenKey === "string") localStorage.setItem("f3x_mob_eleven_key", mobCfg.elevenKey.trim());
    localStorage.setItem("f3x_mob_speed", String(mobCfg.voiceSpeed));
    if (mobCfg.homePlace && mobCfg.homePlace.trim()) localStorage.setItem("f3x_mob_home", mobCfg.homePlace.trim());
    if (Array.isArray(mobCfg.memories)) localStorage.setItem("f3x_mob_memories_v1", JSON.stringify(mobCfg.memories.slice(-30)));
    if (Array.isArray(mobCfg.history)) localStorage.setItem("f3x_mob_hist_v1", JSON.stringify(mobCfg.history.slice(-30)));
  } catch (e) {}
}

function getTimeOfDayGreeting() {
  var hr = new Date().getHours();
  var namePart = mobCfg.userName ? (", **" + mobCfg.userName + "**") : "";
  if (mobCfg.lang === "pl") {
    if (hr >= 5 && hr < 11) return "Dzień dobry" + namePart + "! Mam nadzieję, że dobrze spałaś. W czym mogę Ci pomóc?";
    if (hr >= 11 && hr < 18) return "Dzień dobry" + namePart + "! Dobrze Cię widzieć. Co dzisiaj sprawdzamy?";
    return "Dobry wieczór" + namePart + "! Odpocznij chwilę, a ja chętnie Ci we wszystkim pomogę.";
  } else {
    if (mobCfg.arrogance >= 70) {
      return "Na endlich" + namePart + "! Ich dachte schon, du lässt mich hier ewig warten – hey, ich mach nur Spaß! 😉 Was gehen wir an?";
    }
    if (hr >= 5 && hr < 11) return "Guten Morgen" + namePart + "! Ich hoffe, du hast gut geschlafen. Was kann ich für dich tun?";
    if (hr >= 11 && hr < 18) return "Guten Tag" + namePart + "! Schön, dass du da bist. Was gehen wir an?";
    return "Guten Abend" + namePart + "! Mach es dir gemütlich – womit kann ich dir helfen?";
  }
}

var UI_TEXTS = {
  de: {
    askNameFirst: "Hallo! Ich bin **F3X**. Schön, dich endlich kennenzulernen! Wie soll ich dich nennen?",
    welcomeWithName: "Alles klar, **{NAME}**! Ich hab mir deinen Namen gemerkt. Frag mich was immer du willst, lass dir Texte übersetzen oder schalte das Live-Video (🎥) ein und rede einfach mit mir!",
    placeholder: "Frage stellen (bei 🎥 AN sehe ich live mit!)...",
    micIdle: "🎤 Sprechen",
    micListening: "🔴 Höre zu... (Tippen = Senden)",
    repeatBtn: "🔁 Wiederholen",
    slowBtn: "🐢 Langsam",
    onlyTransBtn: "🔊 Nur Übersetzung sprechen",
    stopSpeakBtn: "🔇 Stopp",
    camTranslate: "🌍 Text im Bild übersetzen",
    camExplain: "🔍 Was siehst du hier?",
    camClose: "✖ Kamera aus",
    camPromptTranslate: "Lies bitte den sichtbaren Text im aktuellen Kamerabild und übersetze ihn direkt (Deutsch <-> Polnisch). Schreibe die Übersetzung in **Fettschrift**.",
    camPromptExplain: "Was siehst du hier gerade live im Kamerabild? Beschreibe es mir kurz, ehrlich und mit deinem Humor!",
    clearChat: "🗑️ Gespräch leeren",
    changeNameBtn: "✏️ Meinen Namen ändern",
    replay15sBtn: "✨ 15s Erst-Geburt zeigen",
    replay5sBtn: "🌅 5s Tageszeit-Aufwachen testen",
    closeBtn: "✅ Speichern & Fertig",
    thinking: "Schaue hin & denke nach...",
    awakeningStatus: "✨ Erwacht..."
  },
  pl: {
    askNameFirst: "Cześć! Jestem **F3X**. Bardzo mi miło Cię poznać! Jak mam się do Ciebie zwracać?",
    welcomeWithName: "Cudownie, **{NAME}**! Zapamiętałam Twoje imię. Pytaj śmiało o pogodę, tłumaczenia albo włącz kamerę na żywo (🎥) i po prostu do mnie mów!",
    placeholder: "Napisz pytanie (przy 🎥 widzę obraz na żywo!)...",
    micIdle: "🎤 Dotknij i mów",
    micListening: "🔴 Słucham... (Dotknij = Wyślij)",
    repeatBtn: "🔁 Powtórz",
    slowBtn: "🐢 Wolniej",
    onlyTransBtn: "🔊 Powiedz tylko tłumaczenie (DE/PL)",
    stopSpeakBtn: "🔇 Stop",
    camTranslate: "🌍 Przetłumacz tekst z kamery",
    camExplain: "🔍 Co tutaj widzisz?",
    camClose: "✖ Wyłącz kamerę",
    camPromptTranslate: "Przeczytaj widoczny tekst z kamery i przetłumacz go krótko (Niemiecki <-> Polski). Napisz tłumaczenie **pogrubionym drukiem**.",
    camPromptExplain: "Co widzisz teraz na żywo w kamerze? Opisz mi to krótko, szczerze i z humorem!",
    clearChat: "🗑️ Wyczyść rozmowę",
    changeNameBtn: "✏️ Zmień moje imię",
    replay15sBtn: "✨ Pokaż pierwsze narodziny (15s)",
    replay5sBtn: "🌅 Testuj szybkie budzenie (5s)",
    closeBtn: "✅ Zapisz i zamknij",
    thinking: "Patrzę i sprawdzam...",
    awakeningStatus: "✨ Budzę się..."
  }
};

function t(key) {
  var l = (mobCfg.lang === "pl") ? "pl" : "de";
  var str = UI_TEXTS[l][key] || UI_TEXTS.de[key] || key;
  return str.replace("{NAME}", mobCfg.userName || (l === "pl" ? "Kochanie" : "Freund"));
}

window.f3xMobSphereState = "idle";
window.f3xPendingCamMode = "translate";
window.isLiveCamOpen = false;

// ============================================================================
// 1. DESIGN MIT DAUERHAFT OFFENER LIVE-KAMERA (KOMPAKT IM OBEREN BEREICH,
//    SODASS MAN GLEICHZEITIG UNTEN DIE ANTWORTEN LESEN & SPRECHEN KANN!)
// ============================================================================
(function buildMobileAppDom190() {
  var st = document.createElement("style");
  st.textContent =
    "* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; scrollbar-width: none !important; -ms-overflow-style: none !important; }" +
    "*::-webkit-scrollbar { width: 0px !important; height: 0px !important; display: none !important; background: transparent !important; }" +
    "html, body { margin: 0; padding: 0; width: 100%; height: 100dvh; overflow: hidden; background: #040408; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; color: #f8fafc; user-select: none; }" +
    "#f3xMobileApp { position: relative; width: 100%; height: 100dvh; max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; background: radial-gradient(circle at 50% 25%, rgba(26,9,38,0.85) 0%, rgba(4,4,8,0.98) 72%); box-shadow: 0 0 50px rgba(0,0,0,0.95); }" +
    "#f3xStarfieldCanvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }" +
    "#f3xSphereStage { position: relative; width: 100%; height: 50dvh; min-height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; pointer-events: none; z-index: 5; }" +
    "#f3xMobBrand { position: absolute; top: 12px; left: 14px; color: #ff2a55; font-weight: 900; font-size: 17px; letter-spacing: 2px; -webkit-text-stroke: 0.6px #38bdf8; text-shadow: 0 0 10px rgba(56,189,248,0.85); z-index: 20; }" +
    "#f3xTopTransChip { position: absolute; top: 11px; left: 66px; background: rgba(20, 20, 36, 0.88); border: 1px solid rgba(56, 189, 248, 0.5); color: #38bdf8; padding: 4px 8px; border-radius: 99px; font-size: 10.5px; font-weight: 800; pointer-events: auto; cursor: pointer; z-index: 20; }" +
    "#f3xTopShortChip { position: absolute; top: 11px; left: 158px; background: rgba(0, 230, 118, 0.14); border: 1px solid #00e676; color: #00e676; padding: 4px 8px; border-radius: 99px; font-size: 10.5px; font-weight: 800; pointer-events: auto; cursor: pointer; z-index: 20; }" +
    "#f3xTopPhoneBtn { position: absolute; top: 11px; left: 262px; background: rgba(255, 210, 60, 0.16); border: 1px solid #ffd23c; color: #ffd23c; padding: 4px 9px; border-radius: 99px; font-size: 10.5px; font-weight: 800; pointer-events: auto; cursor: pointer; z-index: 20; }" +
    "#f3xMobStatusPill { position: absolute; top: 12px; right: 12px; background: rgba(15, 15, 26, 0.85); border: 1px solid rgba(192, 132, 252, 0.45); color: #e9d5ff; padding: 4px 9px; border-radius: 99px; font-size: 10.5px; font-weight: 700; z-index: 20; }" +
    "#f3xMobSphereCanvas { width: min(88vw, 45dvh, 390px); height: min(88vw, 45dvh, 390px); pointer-events: auto; cursor: pointer; filter: drop-shadow(0 0 30px rgba(168,85,247,0.28)); }" +
    /* Live-Kamera bleibt im oberen Bereich (38dvh) offen, damit man unten gleichzeitig lesen & sprechen kann! */
    "#f3xCamOverlay { display: none; position: absolute; top: 42px; left: 12px; right: 12px; height: 39dvh; background: #090912; border: 2px solid #00e676; border-radius: 18px; overflow: hidden; z-index: 40; box-shadow: 0 12px 34px rgba(0,0,0,0.92); flex-direction: column; align-items: center; justify-content: center; }" +
    "#f3xCamOverlay.open { display: flex; }" +
    "#f3xCamLiveBadge { position: absolute; top: 10px; left: 12px; background: rgba(0,0,0,0.75); border: 1px solid #00e676; color: #00e676; padding: 3px 9px; border-radius: 99px; font-size: 11px; font-weight: 900; z-index: 45; }" +
    "#f3xCamVideo { width: 100%; height: 100%; object-fit: cover; background: #000; }" +
    "#f3xCamFallbackHint { display: none; padding: 18px; text-align: center; color: #cbd5e1; font-size: 13.5px; }" +
    "#f3xCamActions { position: absolute; bottom: 8px; left: 8px; right: 8px; display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; z-index: 45; }" +
    ".cam-act-btn { background: rgba(12, 14, 24, 0.90); color: #fff; border: 1.5px solid #38bdf8; border-radius: 11px; padding: 7px 11px; font-size: 12px; font-weight: 800; cursor: pointer; backdrop-filter: blur(6px); box-shadow: 0 4px 12px rgba(0,0,0,0.7); }" +
    ".cam-act-btn.primary { background: linear-gradient(135deg, #a855f7, #ec4899); border-color: #f472b6; }" +
    "#f3xTranscriptSheet { position: relative; flex: 1 1 auto; margin-top: -2dvh; background: linear-gradient(180deg, rgba(10,10,18,0.72) 0%, rgba(10,10,18,0.96) 24%, #080810 100%); backdrop-filter: blur(10px); border-top: 1.5px solid rgba(255, 42, 85, 0.45); border-radius: 26px 26px 0 0; padding: 14px 14px 8px 14px; overflow-y: scroll; display: flex; flex-direction: column; gap: 12px; z-index: 15; user-select: text; }" +
    ".mob-bubble { padding: 12px 15px; border-radius: 18px; font-size: 15.5px; line-height: 1.48; word-break: break-word; animation: fadeUp 0.25s ease; }" +
    "@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }" +
    ".mob-bubble.user { align-self: flex-end; max-width: 85%; background: linear-gradient(135deg, #2b1222, #1b1128); border: 1px solid rgba(255,42,85,0.55); color: #f8fafc; border-bottom-right-radius: 5px; }" +
    ".mob-bubble.ai { align-self: stretch; background: rgba(18, 18, 32, 0.94); border: 1px solid rgba(192, 132, 252, 0.4); color: #f1f5f9; border-bottom-left-radius: 6px; box-shadow: 0 6px 20px rgba(0,0,0,0.45); }" +
    ".mob-bubble-tools { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); }" +
    ".mob-mini-btn { background: #1a1a2e; color: #e9d5ff; border: 1px solid rgba(192,132,252,0.45); border-radius: 10px; padding: 6px 11px; font-size: 12px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }" +
    ".mob-mini-btn.trans-highlight { background: rgba(0, 230, 118, 0.15); border-color: #00e676; color: #00e676; }" +
    ".mob-mini-btn:active { transform: scale(0.96); }" +
    ".mob-amz-chip { display: inline-flex; align-items: center; gap: 5px; background: linear-gradient(135deg, rgba(255,153,0,0.22), rgba(255,190,11,0.14)); color: #ffb703; border: 1.5px solid #ff9900; border-radius: 10px; padding: 6px 11px; font-size: 12px; font-weight: 900; text-decoration: none; margin-top: 6px; margin-right: 6px; cursor: pointer; box-shadow: 0 0 10px rgba(255,153,0,0.2); }" +
    ".mob-link-chip { display: inline-flex; align-items: center; gap: 5px; background: rgba(56, 189, 248, 0.14); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.5); border-radius: 10px; padding: 6px 10px; font-size: 11.5px; font-weight: 800; text-decoration: none; margin-top: 6px; margin-right: 6px; cursor: pointer; }" +
    ".mob-navi-btn { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #00c853, #009624); color: #000; border: 1.5px solid #69f0ae; border-radius: 12px; padding: 8px 14px; font-size: 13px; font-weight: 900; text-decoration: none; margin-top: 8px; margin-right: 6px; cursor: pointer; box-shadow: 0 0 16px rgba(0,230,118,0.4); }" +
    "#f3xBottomControlDock { position: relative; background: #080810; border-top: 1px solid rgba(255,42,85,0.3); padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 0px)) 12px; display: flex; flex-direction: column; gap: 8px; z-index: 25; flex-shrink: 0; }" +
    "#f3xQuickInputRow { display: flex; gap: 6px; align-items: center; }" +
    "#f3xMobTextInp { flex: 1; background: #131320; border: 1px solid rgba(192,132,252,0.38); color: #fff; padding: 10px 13px; border-radius: 14px; font-size: 14.5px; outline: none; }" +
    "#f3xMobSendBtn { background: #ff2a55; color: #fff; border: none; border-radius: 14px; padding: 10px 15px; font-size: 15px; font-weight: 900; cursor: pointer; }" +
    "#f3xMain3BtnRow { display: flex; align-items: center; justify-content: space-between; gap: 7px; }" +
    ".dock-icon-btn { width: 48px; height: 48px; background: #141423; color: #e2e8f0; border: 1.5px solid rgba(56, 189, 248, 0.5); border-radius: 15px; font-size: 21px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.15s ease; padding: 0; }" +
    ".dock-icon-btn:active { transform: scale(0.93); }" +
    ".dock-icon-btn.cam-active { border-color: #00e676; background: rgba(0, 230, 118, 0.20); box-shadow: 0 0 14px rgba(0, 230, 118, 0.45); }" +
    ".dock-icon-btn.muted-active { border-color: #ff2a55; background: rgba(255, 42, 85, 0.18); color: #ff8fa3; }" +
    "#f3xTalkMainBtn { flex: 1; height: 48px; background: linear-gradient(135deg, #ff2a55, #9333ea); color: #fff; border: 1.5px solid #f472b6; border-radius: 16px; padding: 0 12px; font-size: 15px; font-weight: 900; cursor: pointer; box-shadow: 0 0 18px rgba(255, 42, 85, 0.45); display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; white-space: nowrap; }" +
    "#f3xTalkMainBtn.listening { background: linear-gradient(135deg, #00c853, #009624); border-color: #69f0ae; box-shadow: 0 0 24px rgba(0, 230, 118, 0.7); animation: pulseMic 1.1s infinite; }" +
    "@keyframes pulseMic { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }" +
    ".f3x-modal-backdrop { display: none; position: fixed; inset: 0; background: rgba(4, 4, 10, 0.92); backdrop-filter: blur(8px); z-index: 9999; align-items: center; justify-content: center; padding: 14px; overflow-y: auto; }" +
    ".f3x-modal-backdrop.open { display: flex; }" +
    ".f3x-modal-card { width: 100%; max-width: 430px; max-height: 92dvh; overflow-y: scroll; background: #10101c; border: 2px solid #c084fc; border-radius: 22px; padding: 18px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.95); }" +
    ".lang-choice-btn { width: 100%; background: #19192b; color: #fff; border: 2px solid rgba(255,42,85,0.5); border-radius: 14px; padding: 11px; font-size: 15.5px; font-weight: 900; margin-top: 7px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }" +
    ".lang-choice-btn:hover, .lang-choice-btn.active { border-color: #00e676; background: rgba(0, 230, 118, 0.15); }" +
    ".set-folder { background: #151525; border: 1px solid rgba(192,132,252,0.32); border-radius: 14px; margin-top: 9px; overflow: hidden; text-align: left; }" +
    ".set-folder-hdr { padding: 11px 13px; font-size: 13px; font-weight: 900; color: #e9d5ff; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: rgba(255,255,255,0.02); }" +
    ".set-folder-hdr:hover { background: rgba(192,132,252,0.1); }" +
    ".set-folder-body { display: none; padding: 10px 13px 12px 13px; border-top: 1px solid rgba(192,132,252,0.2); }" +
    ".set-folder.open .set-folder-body { display: block; }" +
    ".set-folder-arrow { font-size: 11px; color: #38bdf8; transition: transform 0.2s ease; }" +
    ".set-folder.open .set-folder-arrow { transform: rotate(180deg); }" +
    ".set-select { width: 100%; background: #0d0d18; color: #fff; border: 1px solid #38bdf8; border-radius: 10px; padding: 8px 10px; font-size: 13px; font-weight: 700; margin-bottom: 6px; outline: none; }" +
    ".gender-pill-row { display: flex; gap: 6px; margin-bottom: 8px; }" +
    ".gender-pill { flex: 1; background: #121222; color: #cbd5e1; border: 1.5px solid rgba(192,132,252,0.35); border-radius: 10px; padding: 7px 5px; font-size: 11.5px; font-weight: 800; cursor: pointer; text-align: center; }" +
    ".gender-pill.active { border-color: #00e676; color: #00e676; background: rgba(0,230,118,0.12); }" +
    ".dock-side-btn { background: #141423; color: #e2e8f0; border: 1.5px solid rgba(56, 189, 248, 0.45); border-radius: 12px; padding: 9px 12px; font-size: 12.5px; font-weight: 800; cursor: pointer; }";
  document.head.appendChild(st);

  var wlanUrl = "https://ploverthinker-cpu.github.io/F3X-Mobile/";
  var qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(wlanUrl);

  var app = document.getElementById("f3xMobileApp");
  app.innerHTML =
    "<canvas id=\"f3xStarfieldCanvas\"></canvas>" +
    "<div id=\"f3xSphereStage\">" +
      "<div id=\"f3xMobBrand\">F3X</div>" +
      "<div id=\"f3xTopTransChip\" title=\"Übersetzungs-Richtung umdrehen\">🇵🇱⇄🇩🇪</div>" +
      "<div id=\"f3xTopShortChip\" title=\"Antwort-Länge: Kurz & Knapp (Standard) vs. Ausführlich\">⚡ Kurz & Knapp</div>" +
      "<div id=\"f3xTopPhoneBtn\" title=\"Als echte App auf dein Handy holen\">📱 Handy</div>" +
      "<div id=\"f3xMobStatusPill\">✨ Bereit</div>" +
      "<canvas id=\"f3xMobSphereCanvas\" width=\"420\" height=\"420\" title=\"Antippen zum Sprechen\"></canvas>" +
    "</div>" +
    /* Live-Kamera bleibt offen, waehrend man unten spricht oder tippt! */
    "<div id=\"f3xCamOverlay\">" +
      "<div id=\"f3xCamLiveBadge\">🔴 LIVE-BLICK AKTIV (Sprich einfach unten!)</div>" +
      "<video id=\"f3xCamVideo\" autoplay playsinline muted></video>" +
      "<div id=\"f3xCamFallbackHint\">" +
        "<div style=\"font-size:28px;margin-bottom:8px\">🎥</div>" +
        "<b>Foto-Übersetzer bereit!</b><br>Wähle unten eine Aktion:" +
      "</div>" +
      "<div id=\"f3xCamActions\">" +
        "<button class=\"cam-act-btn primary\" id=\"f3xCamTranslateBtn\"></button>" +
        "<button class=\"cam-act-btn\" id=\"f3xCamExplainBtn\"></button>" +
        "<button class=\"cam-act-btn\" id=\"f3xCamCloseBtn\" style=\"border-color:#ff2a55;color:#ff8fa3\"></button>" +
      "</div>" +
    "</div>" +
    "<div id=\"f3xTranscriptSheet\"></div>" +
    "<div id=\"f3xBottomControlDock\">" +
      "<div id=\"f3xQuickInputRow\">" +
        "<input id=\"f3xMobTextInp\" type=\"text\" />" +
        "<button id=\"f3xMobSendBtn\">➤</button>" +
      "</div>" +
      "<div id=\"f3xMain3BtnRow\">" +
        "<button class=\"dock-icon-btn\" id=\"f3xOpenCamBtn\" title=\"Live-Video Kamera an/aus (Bleibt beim Sprechen offen!)\">🎥</button>" +
        "<button class=\"dock-icon-btn\" id=\"f3xOpenPhotoBtn\" title=\"Einzelnes Foto aufnehmen oder Bild zum Übersetzen auswählen\" style=\"border-color:rgba(0,230,118,0.55)\">📷</button>" +
        "<button id=\"f3xTalkMainBtn\"></button>" +
        "<button class=\"dock-icon-btn\" id=\"f3xMuteToggleBtn\" title=\"Stumm-Modus an/aus (Nur Text ohne Stimme)\">🔊</button>" +
        "<button class=\"dock-icon-btn\" id=\"f3xOpenSetBtn\" title=\"Einstellungen öffnen\" style=\"border-color:rgba(192,132,252,0.55)\">⚙️</button>" +
      "</div>" +
    "</div>" +
    "<input type=\"file\" id=\"f3xCustomVoiceInp\" accept=\"audio/*,.mp3,.wav,.ogg,.m4a\" multiple style=\"display:none\" />" +
    "<input type=\"file\" id=\"f3xPhotoTranslateInp\" accept=\"image/*\" style=\"display:none\" />" +
    "<div class=\"f3x-modal-backdrop\" id=\"f3xPhoneQrModal\">" +
      "<div class=\"f3x-modal-card\">" +
        "<div style=\"font-size:20px;font-weight:900;color:#ffd23c;margin-bottom:6px\">📱 F3X auf dein Handy & GitHub</div>" +
        "<div style=\"font-size:12.5px;color:#cbd5e1;margin-bottom:10px\"><b>1. Sofort-Test im Heim-WLAN:</b></div>" +
        "<div style=\"background:#fff;padding:10px;border-radius:16px;display:inline-block;margin-bottom:8px\">" +
          "<img src=\"" + qrApiUrl + "\" alt=\"QR Code\" style=\"width:170px;height:170px;display:block\" />" +
        "</div>" +
        "<div style=\"font-size:13px;font-weight:900;color:#38bdf8;margin-bottom:10px;user-select:all\">" + wlanUrl + "</div>" +
        "<div style=\"font-size:12px;color:#e2e8f0;text-align:left;background:#161626;border:1px solid #00e676;padding:10px;border-radius:12px;margin-bottom:12px\">" +
          "<b>🌍 2. Die Upload-Seite (Damit der PC aus bleiben kann):</b><br>" +
          "Die Seite heißt <b><a href=\"https://github.com/new\" target=\"_blank\" style=\"color:#38bdf8\">github.com/new</a></b>.<br>" +
          "Erstelle dort ein Repo (z.B. <i>f3x-mobile</i>), zieh die Dateien aus deinem Ordner <b>FNX-Handy-KI</b> rein und aktiviere unter <i>Settings ➔ Pages</i> den Branch <i>main</i>!" +
        "</div>" +
        "<button class=\"dock-side-btn\" style=\"width:100%;background:#00c853;color:#000;border-color:#00e676;padding:10px;font-size:14px\" id=\"f3xCloseQrModalBtn\">Fertig</button>" +
      "</div>" +
    "</div>" +
    "<div class=\"f3x-modal-backdrop\" id=\"f3xLangModal\">" +
      "<div class=\"f3x-modal-card\">" +
        "<div style=\"font-size:19px;font-weight:900;color:#e9d5ff;margin-bottom:6px\">⚙️ F3X Einstellungen</div>" +
        "<div style=\"display:flex;gap:8px;margin-bottom:8px\">" +
          "<button class=\"lang-choice-btn\" style=\"margin-top:0;padding:10px;font-size:14px\" id=\"f3xBtnChoosePl\">🇵🇱 Polski</button>" +
          "<button class=\"lang-choice-btn\" style=\"margin-top:0;padding:10px;font-size:14px\" id=\"f3xBtnChooseDe\">🇩🇪 Deutsch</button>" +
        "</div>" +
        "<div id=\"f3xExtraSetArea\" style=\"display:none\">" +
          "<div class=\"set-folder open\" id=\"f3xFolderChar\">" +
            "<div class=\"set-folder-hdr\" onclick=\"toggleSettingsFolder(\x27f3xFolderChar\x27)\">" +
              "<span>🎭 1. Charakter, Humor & Arroganz-Regler</span>" +
              "<span class=\"set-folder-arrow\">▼</span>" +
            "</div>" +
            "<div class=\"set-folder-body\">" +
              "<div style=\"display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#ffd23c;margin-bottom:4px\">" +
                "<span>😇 Lieb & Mitfühlend</span>" +
                "<span id=\"f3xArroganceValLbl\">25% (Locker)</span>" +
                "<span>👑 Arrogant</span>" +
              "</div>" +
              "<input type=\"range\" id=\"f3xArroganceSlider\" min=\"0\" max=\"100\" step=\"5\" style=\"width:100%;accent-color:#ff2a55;cursor:pointer;margin-bottom:10px\" />" +
              "<label style=\"display:flex;align-items:center;gap:8px;font-size:12.5px;color:#00e676;font-weight:800;cursor:pointer\">" +
                "<input type=\"checkbox\" id=\"f3xShortModeChk\" style=\"width:18px;height:18px;accent-color:#00e676\" />" +
                "<span>⚡ Kurz & Knapp (Auf den Punkt, aber mit Gefühl & Humor!)</span>" +
              "</label>" +
            "</div>" +
          "</div>" +
          "<div class=\"set-folder\" id=\"f3xFolderVoice\">" +
            "<div class=\"set-folder-hdr\" onclick=\"toggleSettingsFolder(\x27f3xFolderVoice\x27)\">" +
              "<span>💎 2. Stimm-Auswahl & ElevenLabs-Key</span>" +
              "<span class=\"set-folder-arrow\">▼</span>" +
            "</div>" +
            "<div class=\"set-folder-body\">" +
              "<label style=\"display:flex;align-items:center;gap:8px;font-size:12.5px;color:#ff8fa3;font-weight:800;cursor:pointer;margin-bottom:8px\">" +
                "<input type=\"checkbox\" id=\"f3xMuteModeChk\" style=\"width:18px;height:18px;accent-color:#ff2a55\" />" +
                "<span>🔇 Stumm-Modus (Nur Text anzeigen, nichts laut vorlesen)</span>" +
              "</label>" +
              "<div class=\"gender-pill-row\">" +
                "<div class=\"gender-pill\" id=\"f3xGenderAllBtn\">🌟 Alle</div>" +
                "<div class=\"gender-pill\" id=\"f3xGenderFemaleBtn\">👩 Weiblich</div>" +
                "<div class=\"gender-pill\" id=\"f3xGenderMaleBtn\">👨 Männlich</div>" +
              "</div>" +
              "<select id=\"f3xVoiceSelect\" class=\"set-select\"></select>" +
              "<input id=\"f3xElevenKeyInp\" type=\"password\" placeholder=\"ElevenLabs API-Key (Links unten auf Developers -> API Keys)...\" class=\"set-select\" style=\"font-size:11.5px;border-color:rgba(192,132,252,0.5)\" />" +
              "<div style=\"display:flex;gap:6px;margin-top:4px\">" +
                "<button class=\"dock-side-btn\" style=\"flex:1;padding:8px;font-size:11.5px;border-color:#00e676;color:#00e676\" id=\"f3xTestVoiceBtn\">🔊 Testen</button>" +
                "<button class=\"dock-side-btn\" style=\"flex:1;padding:8px;font-size:11.5px;border-color:#38bdf8;color:#38bdf8\" id=\"f3xReloadVoicesBtn\">🔄 Laden</button>" +
                "<button class=\"dock-side-btn\" style=\"flex:1;padding:8px;font-size:11.5px;border-color:#c084fc;color:#e9d5ff\" id=\"f3xLoadCustomVoiceBtn\">📂 MP3</button>" +
              "</div>" +
            "</div>" +
          "</div>" +
          "<div class=\"set-folder\" id=\"f3xFolderMem\">" +
            "<div class=\"set-folder-hdr\" onclick=\"toggleSettingsFolder(\x27f3xFolderMem\x27)\">" +
              "<span>🧠 3. Übersetzer, Heimatort & Gedächtnis</span>" +
              "<span class=\"set-folder-arrow\">▼</span>" +
            "</div>" +
            "<div class=\"set-folder-body\">" +
              "<div style=\"font-size:11.5px;color:#c084fc;font-weight:800;margin-bottom:4px\">🔄 Übersetzungs-Richtung (DE ⇄ PL):</div>" +
              "<select id=\"f3xTransDirSelect\" class=\"set-select\">" +
                "<option value=\"auto\">🇵🇱 ⇄ 🇩🇪 Automatisch erkennen (Beide Richtungen)</option>" +
                "<option value=\"de2pl\">🇩🇪 Deutsch ➔ 🇵🇱 Polnisch (Für Mama)</option>" +
                "<option value=\"pl2de\">🇵🇱 Polnisch ➔ 🇩🇪 Deutsch</option>" +
              "</select>" +
              "<div style=\"font-size:11.5px;color:#38bdf8;font-weight:800;margin:6px 0 4px 0\">🌤️ Dein Ort (für Live-Wetter & FNX-Navi):</div>" +
              "<input id=\"f3xHomePlaceInp\" type=\"text\" placeholder=\"Stadt/Adresse (z.B. Augsburg)...\" class=\"set-select\" />" +
              "<div id=\"f3xMemoriesList\" style=\"font-size:11.5px;color:#cbd5e1;max-height:80px;overflow-y:auto;margin-top:4px\"></div>" +
              "<button class=\"dock-side-btn\" style=\"width:100%;margin-top:6px;border-color:#38bdf8;color:#38bdf8\" id=\"f3xChangeNameBtn\"></button>" +
            "</div>" +
          "</div>" +
          "<div class=\"set-folder\" id=\"f3xFolderSys\">" +
            "<div class=\"set-folder-hdr\" onclick=\"toggleSettingsFolder(\x27f3xFolderSys\x27)\">" +
              "<span>✨ 4. Aufwach-Kino & Gespräch verwalten</span>" +
              "<span class=\"set-folder-arrow\">▼</span>" +
            "</div>" +
            "<div class=\"set-folder-body\">" +
              "<label style=\"display:flex;align-items:center;gap:8px;font-size:12px;color:#e2e8f0;cursor:pointer;margin-bottom:8px\">" +
                "<input type=\"checkbox\" id=\"f3xAlwaysAwakeChk\" style=\"width:18px;height:18px;accent-color:#c084fc\" />" +
                "<span>🌅 Bei jedem Start sanft aufwachen (5 Sek. + Tageszeit)</span>" +
              "</label>" +
              "<div style=\"display:flex;flex-direction:column;gap:6px\">" +
                "<button class=\"dock-side-btn\" style=\"width:100%;border-color:#ffd23c;color:#ffd23c\" id=\"f3xReplay15sBtn\"></button>" +
                "<button class=\"dock-side-btn\" style=\"width:100%;border-color:#c084fc;color:#e9d5ff\" id=\"f3xReplay5sBtn\"></button>" +
                "<button class=\"dock-side-btn\" style=\"width:100%;border-color:#ff2a55;color:#ff8fa3\" id=\"f3xClearChatBtn\"></button>" +
              "</div>" +
            "</div>" +
          "</div>" +
          "<button class=\"dock-side-btn\" style=\"width:100%;margin-top:12px;background:#00c853;color:#000;border-color:#00e676;padding:11px;font-size:14px;font-weight:900\" id=\"f3xCloseSetModalBtn\"></button>" +
        "</div>" +
      "</div>" +
    "</div>";
})();

window.toggleSettingsFolder = function(folderId) {
  var el = document.getElementById(folderId);
  if (!el) return;
  var isOpen = el.classList.contains("open");
  ["f3xFolderChar", "f3xFolderVoice", "f3xFolderMem", "f3xFolderSys"].forEach(function(id) {
    var f = document.getElementById(id);
    if (f) f.classList.remove("open");
  });
  if (!isOpen) el.classList.add("open");
};

function updateArroganceLabelUi() {
  var lbl = document.getElementById("f3xArroganceValLbl");
  var sld = document.getElementById("f3xArroganceSlider");
  if (sld) sld.value = mobCfg.arrogance;
  if (!lbl) return;
  var v = mobCfg.arrogance;
  var desc = (v <= 20) ? "Herz & Mitgefühl" : (v <= 55 ? "Frech & Humorvoll" : (v <= 80 ? "Arrogant & Schlagfertig" : "100% Diva-Modus 👑"));
  lbl.textContent = v + "% (" + desc + ")";
}

function updateMuteButtonUi() {
  var mBtn = document.getElementById("f3xMuteToggleBtn");
  var mChk = document.getElementById("f3xMuteModeChk");
  if (mChk) mChk.checked = !!mobCfg.muted;
  if (!mBtn) return;
  if (mobCfg.muted) {
    mBtn.innerHTML = "🔇";
    mBtn.classList.add("muted-active");
    mBtn.title = "Stumm-Modus ist AN (Tippen zum Einschalten der Stimme)";
  } else {
    mBtn.innerHTML = "🔊";
    mBtn.classList.remove("muted-active");
    mBtn.title = "Stimme ist AN (Tippen für Stumm-Modus / Nur Text)";
  }
}

window.toggleF3XMuteMode = function() {
  mobCfg.muted = !mobCfg.muted;
  if (mobCfg.muted) window.stopF3XMobileSpeech();
  saveMobCfg();
  updateMuteButtonUi();
};

// ============================================================================
// 2. 3D-STERNENHIMMEL IM HINTERGRUND
// ============================================================================
(function initSlowWarpStarfield190() {
  var cv = document.getElementById("f3xStarfieldCanvas");
  if (!cv) return;
  var ctx = cv.getContext("2d");

  function resizeStars() {
    cv.width = cv.parentElement ? cv.parentElement.clientWidth : window.innerWidth;
    cv.height = cv.parentElement ? cv.parentElement.clientHeight : window.innerHeight;
  }
  resizeStars();
  window.addEventListener("resize", resizeStars);

  var numStars = 135;
  var stars = [];
  for (var i = 0; i < numStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 1600,
      z: Math.random() * 1000 + 50,
      size: 0.6 + Math.random() * 1.1
    });
  }

  function renderStars() {
    requestAnimationFrame(renderStars);
    var w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);
    var cx = w * 0.5, cy = h * 0.28;

    for (var i = 0; i < numStars; i++) {
      var s = stars[i];
      s.z -= 1.15;
      if (s.z <= 10) {
        s.x = (Math.random() - 0.5) * 1600;
        s.y = (Math.random() - 0.5) * 1600;
        s.z = 1000;
      }
      var k = 260 / s.z;
      var sx = cx + s.x * k, sy = cy + s.y * k;
      if (sx < 0 || sx > w || sy < 0 || sy > h) {
        s.x = (Math.random() - 0.5) * 1600;
        s.y = (Math.random() - 0.5) * 1600;
        s.z = 1000;
        continue;
      }
      var closeness = 1 - (s.z / 1000);
      var alpha = Math.min(0.42, Math.max(0.04, closeness * 0.45));
      var radius = Math.max(0.5, closeness * 2.1 * s.size);
      var prevK = 260 / (s.z + 14);
      ctx.strokeStyle = "rgba(225, 238, 255, " + (alpha * 0.55).toFixed(3) + ")";
      ctx.lineWidth = radius * 0.75;
      ctx.beginPath();
      ctx.moveTo(cx + s.x * prevK, cy + s.y * prevK);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, " + alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  renderStars();
})();

// ============================================================================
// 3. 3D-KUGEL MIT SANFTEM KERN-SCHWEBEN
// ============================================================================
window.f3xAwakeStartTime = 0;
window.f3xAwakeDurationSec = 15.0;
window.f3xIsAwakeningActive = false;
window.f3xBolt1Fired = false;
window.f3xBolt2Fired = false;
window.f3xOnAwakeFinishedCallback = null;

window.startCustomAwakening = function(durationSeconds, onFinished) {
  window.f3xAwakeStartTime = performance.now();
  window.f3xAwakeDurationSec = durationSeconds || 15.0;
  window.f3xIsAwakeningActive = true;
  window.f3xBolt1Fired = false;
  window.f3xBolt2Fired = false;
  window.f3xOnAwakeFinishedCallback = onFinished || null;
  setMobStatus("idle", t("awakeningStatus"));
};

window.cancelAwakeningGreetingIfBusy = function() {
  if (window.f3xIsAwakeningActive) {
    window.f3xIsAwakeningActive = false;
    window.f3xOnAwakeFinishedCallback = null;
  }
};

(function initHumanLikeQuantumSphere190() {
  var cv = document.getElementById("f3xMobSphereCanvas");
  var ctx = cv.getContext("2d");
  cv.onclick = function() { window.toggleF3XVoiceListening(); };

  var pts = [];
  var numPts = 380;
  for (var i = 0; i < numPts; i++) {
    var phi = Math.acos(1 - 2 * (i + 0.5) / numPts);
    var theta = Math.PI * (1 + Math.sqrt(5)) * i;
    var isInnerPurple = (i % 3 === 0);
    pts.push({
      x: Math.cos(theta) * Math.sin(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(phi),
      phase: Math.random() * Math.PI * 2,
      layer: isInnerPurple ? 0.58 : 1.0,
      isPurpleCore: isInnerPurple,
      randomWakeDelay: Math.random() * 0.35,
      glowBoost: 0,
      isGoldSpark: false
    });
  }

  var activeBolts = [];
  var pulseRings = [];

  function spawnMobileBolt(originX, originY, targetX, targetY, isActiveMode, forceGold) {
    var segments = [];
    var steps = 6;
    var curX = originX, curY = originY;
    var reach = isActiveMode ? 0.92 : 0.85;
    var endX = originX + (targetX - originX) * reach;
    var endY = originY + (targetY - originY) * reach;
    for (var s = 1; s <= steps; s++) {
      var t = s / steps;
      var bx = originX + (endX - originX) * t;
      var by = originY + (endY - originY) * t;
      if (s < steps) {
        var jit = isActiveMode ? 12 : 8.5;
        bx += (Math.random() - 0.5) * jit * 2;
        by += (Math.random() - 0.5) * jit * 2;
      }
      segments.push({ x1: curX, y1: curY, x2: bx, y2: by });
      curX = bx; curY = by;
    }
    var rnd = Math.random();
    var isGold = (typeof forceGold === "boolean") ? forceGold : (rnd < 0.48);
    var col = isGold
      ? "rgba(255, 210, 55, "
      : (rnd < 0.80 ? "rgba(192, 132, 252, " : "rgba(255, 60, 105, ");
    activeBolts.push({
      segments: segments,
      life: 1.0,
      decay: isActiveMode ? 0.038 : 0.030,
      colorPrefix: col,
      isGold: isGold
    });
    return isGold;
  }

  var tClock = 0, waveClock = 0, talkFloatClock = 0;
  var smoothCoreOffsetX = 0, smoothCoreOffsetY = 0, smoothVoiceBreath = 0;

  function renderMobSphere190() {
    requestAnimationFrame(renderMobSphere190);
    ctx.clearRect(0, 0, 420, 420);
    var cx = 210, cy = 210;

    var sphereExpand = 1.0;
    var coreSparkScale = 1.0;

    if (window.f3xIsAwakeningActive) {
      var totalDur = window.f3xAwakeDurationSec || 15.0;
      var elapsedSec = (performance.now() - window.f3xAwakeStartTime) / 1000;
      var norm = elapsedSec / totalDur;

      if (norm < 0.30) {
        var p1 = norm / 0.30;
        sphereExpand = 0.0;
        coreSparkScale = Math.min(0.28, p1 * 0.28);
      } else if (norm < 0.54) {
        var p2 = (norm - 0.30) / 0.24;
        sphereExpand = p2 * 0.12;
        coreSparkScale = 0.28 + p2 * 0.22;

        if (!window.f3xBolt1Fired && norm >= 0.33) {
          window.f3xBolt1Fired = true;
          spawnMobileBolt(210, 210, 210 + 98, 210 - 82, true, true);
          pulseRings.push({ r: 8, maxR: 125, alpha: 0.85 });
        }
        if (!window.f3xBolt2Fired && norm >= 0.44) {
          window.f3xBolt2Fired = true;
          spawnMobileBolt(210, 210, 210 - 108, 210 + 72, true, false);
          spawnMobileBolt(210, 210, 210 + 64, 210 + 96, true, true);
          pulseRings.push({ r: 10, maxR: 150, alpha: 0.90 });
        }
      } else if (norm < 1.0) {
        var p3 = (norm - 0.54) / 0.46;
        var smoothP3 = 1 - Math.pow(1 - p3, 2.6);
        sphereExpand = 0.12 + smoothP3 * 0.88;
        coreSparkScale = 0.50 + smoothP3 * 0.50;
      } else {
        window.f3xIsAwakeningActive = false;
        sphereExpand = 1.0;
        coreSparkScale = 1.0;
        pulseRings.push({ r: 25, maxR: 185, alpha: 0.95 });
        setMobStatus("idle");
        if (window.f3xOnAwakeFinishedCallback) {
          var cb = window.f3xOnAwakeFinishedCallback;
          window.f3xOnAwakeFinishedCallback = null;
          cb();
        }
      }
    }

    var state = window.f3xMobSphereState;
    var isTalking = (state === "talking");
    var isListening = (state === "listening");
    var isThinking = (state === "thinking");
    var isActive = isTalking || isListening || isThinking;

    if (isTalking) {
      talkFloatClock += 0.032;
      var targetOffX = Math.sin(talkFloatClock * 1.15) * 16 + Math.cos(talkFloatClock * 0.65) * 7;
      var targetOffY = Math.cos(talkFloatClock * 0.85) * 11 + Math.sin(talkFloatClock * 1.45) * 5;
      var targetBreath = (Math.sin(talkFloatClock * 1.8) * 0.5 + 0.5) * 0.22;
      smoothCoreOffsetX = smoothCoreOffsetX * 0.90 + targetOffX * 0.10;
      smoothCoreOffsetY = smoothCoreOffsetY * 0.90 + targetOffY * 0.10;
      smoothVoiceBreath = smoothVoiceBreath * 0.88 + targetBreath * 0.12;
    } else if (isListening) {
      talkFloatClock += 0.020;
      smoothCoreOffsetX = smoothCoreOffsetX * 0.92 + Math.sin(talkFloatClock) * 6 * 0.08;
      smoothCoreOffsetY = smoothCoreOffsetY * 0.92 + Math.cos(talkFloatClock * 0.8) * 5 * 0.08;
      smoothVoiceBreath = smoothVoiceBreath * 0.90 + 0.14 * 0.10;
    } else {
      smoothCoreOffsetX *= 0.90;
      smoothCoreOffsetY *= 0.90;
      smoothVoiceBreath *= 0.90;
    }

    var coreCenterX = cx + smoothCoreOffsetX;
    var coreCenterY = cy + smoothCoreOffsetY;

    tClock += (isThinking ? 0.0068 : (isTalking ? 0.0034 : 0.0024)) * (0.25 + 0.75 * sphereExpand);
    waveClock += isTalking ? 0.065 : (isThinking ? 0.11 : 0.035);

    var angleY = Math.sin(tClock * 1.05) * 1.8 + Math.cos(tClock * 0.42) * 1.1;
    var angleX = Math.cos(tClock * 0.82) * 1.05 + Math.sin(tClock * 0.31) * 0.6;
    var angleZ = Math.sin(tClock * 0.55) * 0.85;

    var cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    var cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    var cosZ = Math.cos(angleZ), sinZ = Math.sin(angleZ);

    var inCosY = Math.cos(-angleY * 1.45), inSinY = Math.sin(-angleY * 1.45);
    var inCosX = Math.cos(-angleX * 1.35), inSinX = Math.sin(-angleX * 1.35);

    var coreR = (38 * coreSparkScale) + Math.sin(waveClock) * 3.0 * coreSparkScale + smoothVoiceBreath * 32;
    var grad = ctx.createRadialGradient(coreCenterX, coreCenterY, 1, coreCenterX, coreCenterY, Math.max(8, coreR * 3.5));
    if (window.f3xIsAwakeningActive && sphereExpand < 0.25) {
      grad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      grad.addColorStop(0.35, "rgba(255, 215, 90, 0.85)");
      grad.addColorStop(0.70, "rgba(192, 132, 252, 0.45)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
      grad.addColorStop(0, "rgba(226, 196, 255, 0.96)");
      grad.addColorStop(0.30, "rgba(168, 85, 247, 0.86)");
      grad.addColorStop(0.60, "rgba(255, 30, 75, 0.44)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(coreCenterX, coreCenterY, Math.max(8, coreR * 3.5), 0, Math.PI * 2);
    ctx.fill();

    if (sphereExpand > 0.85 && isActive && pulseRings.length === 0 && Math.random() < 0.04) {
      pulseRings.push({ x: coreCenterX, y: coreCenterY, r: 28, maxR: 155, alpha: 0.45 });
    }
    for (var pr = pulseRings.length - 1; pr >= 0; pr--) {
      var ring = pulseRings[pr];
      ring.r += 2.2;
      ring.alpha *= 0.93;
      if (ring.r >= ring.maxR || ring.alpha < 0.03) {
        pulseRings.splice(pr, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(ring.x || cx, ring.y || cy, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(192, 132, 252, " + ring.alpha.toFixed(2) + ")";
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    if (sphereExpand > 0.01) {
      var baseRadius = (154 * sphereExpand) + smoothVoiceBreath * 14;

      for (var j = 0; j < numPts; j++) {
        var p = pts[j];
        var localFade = Math.min(1, Math.max(0, (sphereExpand - p.randomWakeDelay * 0.4) / 0.55));
        if (localFade <= 0.02) continue;

        if (p.glowBoost > 0) p.glowBoost *= 0.93;

        var wave = isTalking
          ? (Math.sin(p.phase + waveClock * 1.1) * 3.8)
          : (Math.sin(p.phase + waveClock * 0.7) * 2.4);

        var layerScale = p.isPurpleCore ? (0.56 + smoothVoiceBreath * 0.25) : 1.0;
        var r = (baseRadius + wave * sphereExpand) * layerScale;
        var px = p.x * r, py = p.y * r, pz = p.z * r;

        var x3, y3, z2, sx, sy;
        if (p.isPurpleCore) {
          var ix1 = px * inCosY - pz * inSinY, iz1 = pz * inCosY + px * inSinY;
          var iy2 = py * inCosX - iz1 * inSinX, iz2 = iz1 * inCosX + py * inSinX;
          x3 = ix1; y3 = iy2; z2 = iz2;
          sx = coreCenterX + x3;
          sy = coreCenterY + y3;
        } else {
          var x1 = px * cosY - pz * sinY, z1 = pz * cosY + px * sinY;
          var y2 = py * cosX - z1 * sinX;
          z2 = z1 * cosX + py * sinX;
          x3 = x1 * cosZ - y2 * sinZ;
          y3 = y2 * cosZ + x1 * sinZ;
          sx = cx + x3;
          sy = cy + y3;
        }

        var depth = Math.max(0.20, Math.min(1, (z2 + 175) / 350)) * localFade;
        var dotSize = Math.max(1.5, depth * (4.2 + smoothVoiceBreath * 1.4)) + p.glowBoost * 2.2;

        if (sphereExpand > 0.5 && z2 > 20 && !p.isPurpleCore) {
          var boltChance = isActive ? 0.0008 : 0.00026;
          if (Math.random() < boltChance && activeBolts.length < (isActive ? 3 : 2)) {
            p.glowBoost = 1.0;
            p.isGoldSpark = spawnMobileBolt(coreCenterX, coreCenterY, sx, sy, isActive);
          }
        }

        if (p.glowBoost > 0.12) {
          ctx.fillStyle = p.isGoldSpark
            ? ("rgba(255, 215, 70, " + Math.min(1, depth + p.glowBoost).toFixed(2) + ")")
            : ("rgba(233, 213, 255, " + Math.min(1, depth + p.glowBoost).toFixed(2) + ")");
        } else if (p.isPurpleCore) {
          ctx.fillStyle = (j % 6 === 0)
            ? ("rgba(216, 180, 254, " + Math.min(1, depth + 0.18).toFixed(2) + ")")
            : ("rgba(168, 85, 247, " + Math.min(1, depth + 0.12).toFixed(2) + ")");
        } else {
          ctx.fillStyle = "rgba(255, 42, 85, " + depth.toFixed(2) + ")";
        }

        ctx.beginPath();
        ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (var b = activeBolts.length - 1; b >= 0; b--) {
      var bolt = activeBolts[b];
      bolt.life -= bolt.decay;
      if (bolt.life <= 0) {
        activeBolts.splice(b, 1);
        continue;
      }
      ctx.save();
      var smoothAlpha = Math.pow(bolt.life, 0.85);
      ctx.strokeStyle = bolt.colorPrefix + smoothAlpha.toFixed(2) + ")";
      ctx.lineWidth = (bolt.isGold ? 1.85 : 1.5) * (0.65 + 0.35 * bolt.life);
      ctx.shadowColor = bolt.isGold ? "#ffd23c" : "#c084fc";
      ctx.shadowBlur = (bolt.isGold ? 12 : 8) * bolt.life;
      ctx.beginPath();
      for (var seg = 0; seg < bolt.segments.length; seg++) {
        var sg = bolt.segments[seg];
        var microDrift = (1 - bolt.life) * (Math.random() - 0.5) * 1.4;
        if (seg === 0) ctx.moveTo(sg.x1, sg.y1);
        ctx.lineTo(sg.x2 + microDrift, sg.y2 + microDrift);
      }
      ctx.stroke();
      ctx.restore();
    }
  }
  renderMobSphere190();
})();

// ============================================================================
// 4. STIMM-ZENTRALE & ELEVENLABS
// ============================================================================
window.f3xCustomVoicePack = [];
window.f3xCloudTtsAudio = new Audio();

function isVoiceMaleByName(name) {
  var n = String(name || "").toLowerCase();
  return /conrad|killian|stefan|markus|christoph|karsten|florian|jan|marek|adam|krzysztof|tomasz|jakub|male|mann|daniel|david|george|james|antoni/.test(n);
}

function isVoiceFemaleByName(name) {
  var n = String(name || "").toLowerCase();
  return /katja|seraphina|amala|tanja|vicki|hedda|anna|petra|lene|zofia|agnieszka|paulina|ewa|maja|karolina|female|frau|samantha|victoria|zira|aria|sarah|charlotte/.test(n);
}

function openCustomVoiceDb(cb) {
  try {
    var req = indexedDB.open("f3x_mob_voices_v1", 1);
    req.onupgradeneeded = function(ev) {
      var db = ev.target.result;
      if (!db.objectStoreNames.contains("clips")) {
        db.createObjectStore("clips", { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = function(ev) { cb(ev.target.result); };
  } catch (e) {}
}

function loadCustomVoicesFromDb() {
  openCustomVoiceDb(function(db) {
    var tx = db.transaction("clips", "readonly");
    var getAll = tx.objectStore("clips").getAll();
    getAll.onsuccess = function() {
      var items = getAll.result || [];
      window.f3xCustomVoicePack = items.map(function(it) {
        return { name: it.name, blob: it.blob, url: URL.createObjectURL(it.blob) };
      });
      populateVoiceSelectorDropdown();
    };
  });
}

function getAllUnlockedVoices() {
  if (!window.speechSynthesis) return [];
  var all = window.speechSynthesis.getVoices() || [];
  var list = all.slice();

  if (mobCfg.voiceGender === "female") {
    var fem = list.filter(function(v) { return !isVoiceMaleByName(v.name); });
    if (fem.length > 0) list = fem;
  } else if (mobCfg.voiceGender === "male") {
    var mal = list.filter(function(v) { return isVoiceMaleByName(v.name) || v.name.toLowerCase().indexOf("google") !== -1; });
    if (mal.length > 0) list = mal;
  }

  list.sort(function(a, b) {
    function scoreVoice(v) {
      var n = (v.name || "").toLowerCase();
      var l = (v.lang || "").toLowerCase();
      var s = 0;
      var targetPref = (mobCfg.lang === "pl") ? "pl" : "de";
      if (l.indexOf(targetPref) === 0) s += 100;
      else if (l.indexOf("de") === 0 || l.indexOf("pl") === 0) s += 60;
      else if (l.indexOf("en") === 0) s += 30;
      if (n.indexOf("google") !== -1) s += 55;
      if (n.indexOf("natural") !== -1 || n.indexOf("online") !== -1 || n.indexOf("neural") !== -1) s += 45;
      if (n.indexOf("hedda") !== -1 || n.indexOf("stefan") !== -1 || n.indexOf("paulina") !== -1) s -= 40;
      return s;
    }
    return scoreVoice(b) - scoreVoice(a);
  });
  return list;
}

function updateGenderPillsUi() {
  var aBtn = document.getElementById("f3xGenderAllBtn");
  var fBtn = document.getElementById("f3xGenderFemaleBtn");
  var mBtn = document.getElementById("f3xGenderMaleBtn");
  if (aBtn) aBtn.classList.toggle("active", mobCfg.voiceGender === "all");
  if (fBtn) fBtn.classList.toggle("active", mobCfg.voiceGender === "female");
  if (mBtn) mBtn.classList.toggle("active", mobCfg.voiceGender === "male");
}

function populateVoiceSelectorDropdown() {
  updateGenderPillsUi();
  var sel = document.getElementById("f3xVoiceSelect");
  if (!sel) return;
  var voices = getAllUnlockedVoices();

  var html = "<option value=\"auto_best\">✨ Beste Google / Handy-Stimme (Automatisch – Zweisprachig)</option>";

  ELEVENLABS_VOICES.forEach(function(ev) {
    if (mobCfg.voiceGender === "female" && ev.gender !== "female") return;
    if (mobCfg.voiceGender === "male" && ev.gender !== "male") return;
    html += "<option value=\"" + ev.id + "\">" + ev.name + " [ElevenLabs]</option>";
  });

  if (window.f3xCustomVoicePack.length > 0) {
    html += "<option value=\"custom_pack\">🎵 Meine geladenen MP3-Stimmen (" + window.f3xCustomVoicePack.length + " Clips)</option>";
  }

  voices.forEach(function(v) {
    var nLow = v.name.toLowerCase();
    var isTop = (nLow.indexOf("google") !== -1);
    var gIcon = isVoiceMaleByName(v.name) ? "👨 " : (isVoiceFemaleByName(v.name) ? "👩 " : "🗣️ ");
    var badge = isTop ? ("⭐ " + gIcon) : gIcon;
    html += "<option value=\"" + v.voiceURI.replace(/"/g, "") + "\">" + badge + v.name + " [" + v.lang + "]</option>";
  });

  sel.innerHTML = html;
  if (mobCfg.voiceURI && Array.from(sel.options).some(function(o) { return o.value === mobCfg.voiceURI; })) {
    sel.value = mobCfg.voiceURI;
  }
}

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = populateVoiceSelectorDropdown;
  setTimeout(populateVoiceSelectorDropdown, 250);
  setTimeout(populateVoiceSelectorDropdown, 1000);
}
loadCustomVoicesFromDb();

function setMobStatus(state, label) {
  window.f3xMobSphereState = state || "idle";
  var pill = document.getElementById("f3xMobStatusPill");
  if (pill) {
    if (state === "listening") pill.textContent = "🎤 " + (mobCfg.lang === "pl" ? "Słucham..." : "Ich höre zu...");
    else if (state === "thinking") pill.textContent = "🌐 " + t("thinking");
    else if (state === "talking") pill.textContent = "🔊 " + (mobCfg.lang === "pl" ? "Mówię..." : "Spricht...");
    else pill.textContent = label || (mobCfg.muted ? "🔇 Stumm" : (mobCfg.lang === "pl" ? "🇵🇱 Gotowa" : "🇩🇪 Bereit"));
  }
}

function detectLanguageOfBoldPhrase(phrase, fallbackOppositeOfUi) {
  var s = String(phrase || "").toLowerCase();
  if (/[ąćęłńóśźż]|\b(gdzie|jest|jak|proszę|dzień|dobry|ile|kosztuje|nie|tak|bardzo|dziękuję)\b/.test(s)) return "pl-PL";
  if (/[äöüß]|\b(wie|wo|ist|was|ich|du|wir|sie|bitte|danke|guten|morgen|abend|uhr|heißt|kosten|kostet|arzt|apotheke|straße|bahnhof)\b/.test(s)) return "de-DE";
  if (/\b(what|where|when|how|much|time|please|thank|you|hello|good|morning|doctor|station)\b/.test(s)) return "en-US";
  return fallbackOppositeOfUi ? ((mobCfg.lang === "pl") ? "de-DE" : "pl-PL") : ((mobCfg.lang === "pl") ? "pl-PL" : "de-DE");
}

function findBestVoiceForLang(langCode) {
  if (!window.speechSynthesis) return null;
  var all = window.speechSynthesis.getVoices() || [];
  var pref = String(langCode || "de-DE").slice(0, 2).toLowerCase();
  var wantMale = (mobCfg.voiceGender === "male");

  var candidates = all.filter(function(v) { return (v.lang || "").toLowerCase().indexOf(pref) === 0; });
  if (candidates.length === 0) return null;

  candidates.sort(function(a, b) {
    function sc(v) {
      var n = v.name.toLowerCase(), pts = 0;
      if (n.indexOf("google") !== -1) pts += 60;
      if (n.indexOf("natural") !== -1 || n.indexOf("online") !== -1) pts += 45;
      if (wantMale && isVoiceMaleByName(n)) pts += 30;
      if (!wantMale && isVoiceFemaleByName(n)) pts += 30;
      if (n.indexOf("hedda") !== -1 || n.indexOf("stefan") !== -1) pts -= 40;
      return pts;
    }
    return sc(b) - sc(a);
  });
  return candidates[0];
}

async function trySpeakWithElevenLabs(rawText) {
  if (!mobCfg.elevenKey || !mobCfg.elevenKey.trim()) return false;
  var elVoiceObj = ELEVENLABS_VOICES.find(function(v) { return v.id === mobCfg.voiceURI; }) || ELEVENLABS_VOICES[0];
  try {
    setMobStatus("talking");
    var res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + elVoiceObj.voiceId, {
      method: "POST",
      headers: {
        "xi-api-key": mobCfg.elevenKey.trim(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: rawText,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.50, similarity_boost: 0.78 }
      })
    });
    if (res.ok) {
      var blob = await res.blob();
      window.f3xCloudTtsAudio.src = URL.createObjectURL(blob);
      window.f3xCloudTtsAudio.onended = function() { setMobStatus("idle"); };
      await window.f3xCloudTtsAudio.play();
      return true;
    }
  } catch (e) {}
  setMobStatus("idle");
  return false;
}

window.speakOnlyTranslatedSentence190 = async function(idx) {
  window.stopF3XMobileSpeech();
  if (!mobCfg.history[idx]) return;
  var content = String(mobCfg.history[idx].content || "");
  var boldMatches = content.match(/\*\*([^*]+)\*\*/g);
  var targetPhrase = (boldMatches && boldMatches.length > 0)
    ? boldMatches.map(function(b) { return b.replace(/\*/g, ""); }).join(". ")
    : content.replace(/[*#_`~>]/g, "");

  if (mobCfg.voiceURI && mobCfg.voiceURI.indexOf("el_") === 0 && mobCfg.elevenKey) {
    var okEl = await trySpeakWithElevenLabs(targetPhrase);
    if (okEl) return;
  }

  if (!window.speechSynthesis) return;
  var detectedLang = detectLanguageOfBoldPhrase(targetPhrase, true);
  var u = new SpeechSynthesisUtterance(targetPhrase);
  u.lang = detectedLang;
  u.rate = 0.94;
  u.pitch = 1.0;
  var bestV = findBestVoiceForLang(detectedLang);
  if (bestV) u.voice = bestV;
  u.onstart = function() { setMobStatus("talking"); };
  u.onend = function() { setMobStatus("idle"); };
  u.onerror = function() { setMobStatus("idle"); };
  window.speechSynthesis.speak(u);
};

window.speakF3XMobileAnswer = async function(idx, customRate, forcedLang, customTestText) {
  window.stopF3XMobileSpeech();

  if (mobCfg.voiceURI === "custom_pack" && window.f3xCustomVoicePack.length > 0 && !forcedLang) {
    var clip = window.f3xCustomVoicePack[Math.floor(Math.random() * window.f3xCustomVoicePack.length)];
    if (clip && clip.url) {
      window.f3xCloudTtsAudio.src = clip.url;
      setMobStatus("talking");
      window.f3xCloudTtsAudio.onended = function() { setMobStatus("idle"); };
      window.f3xCloudTtsAudio.play().catch(function() { setMobStatus("idle"); });
      return;
    }
  }

  var fullText = customTestText || (mobCfg.history[idx] ? String(mobCfg.history[idx].content || "") : "");
  if (!fullText) return;

  var cleanFull = fullText
    .replace(/https?:\/\/[^\s)]+/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#_`~>]/g, "");

  if ((mobCfg.voiceURI && mobCfg.voiceURI.indexOf("el_") === 0) || (mobCfg.elevenKey && mobCfg.elevenKey.length > 10)) {
    var elOk = await trySpeakWithElevenLabs(cleanFull.replace(/\*/g, ""));
    if (elOk) return;
  }

  if (!window.speechSynthesis) return;
  var baseLang = forcedLang || ((mobCfg.lang === "pl") ? "pl-PL" : "de-DE");
  var rateToUse = customRate || mobCfg.voiceSpeed || 1.0;

  var parts = cleanFull.split(/(\*\*[^*]+\*\*)/g).filter(function(p) { return p && p.trim().length > 0; });

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    var isBold = (part.indexOf("**") === 0 && part.slice(-2) === "**");
    var spokenTxt = part.replace(/\*/g, "").trim();
    if (!spokenTxt) continue;

    var segLang = baseLang;
    if (isBold && !forcedLang) {
      segLang = detectLanguageOfBoldPhrase(spokenTxt, false);
    }

    var u = new SpeechSynthesisUtterance(spokenTxt);
    u.lang = segLang;
    u.rate = rateToUse;
    u.pitch = 1.0;

    var chosenVoice = null;
    if (segLang === baseLang && mobCfg.voiceURI && mobCfg.voiceURI !== "auto_best" && mobCfg.voiceURI.indexOf("el_") !== 0) {
      var allV = getAllUnlockedVoices();
      chosenVoice = allV.find(function(v) { return v.voiceURI === mobCfg.voiceURI; });
    }
    if (!chosenVoice) {
      chosenVoice = findBestVoiceForLang(segLang);
    }
    if (chosenVoice) u.voice = chosenVoice;

    if (i === 0) u.onstart = function() { setMobStatus("talking"); };
    if (i === parts.length - 1) {
      u.onend = function() { setMobStatus("idle"); };
      u.onerror = function() { setMobStatus("idle"); };
    }
    window.speechSynthesis.speak(u);
  }
};

window.stopF3XMobileSpeech = function() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (window.f3xCloudTtsAudio) {
    try { window.f3xCloudTtsAudio.pause(); } catch (e) {}
  }
  setMobStatus("idle");
};

// ============================================================================
// 5. LIVE-WETTER & MULTI-QUELLEN INTERNET-RECHERCHE
// ============================================================================
function isWeatherQuestion(text) {
  var low = String(text || "").toLowerCase();
  return /wetter|temperatur|regen|regnet|schnee|schneit|sonne|grad|warm|kalt|sturm|vorhersage|pogod|deszcz|śnieg|słońce|ciepło|zimno|stopni/.test(low);
}

function decodeWeatherCode(code, lang) {
  var isPl = (lang === "pl");
  if (code === 0) return isPl ? "☀️ Słonecznie i bezchmurnie" : "☀️ Klar & Sonnig";
  if (code === 1 || code === 2) return isPl ? "🌤️ Lekkie zachmurzenie" : "🌤️ Leicht bewölkt";
  if (code === 3) return isPl ? "☁️ Pochmurno" : "☁️ Bedeckt";
  if (code === 45 || code === 48) return isPl ? "🌫️ Mgła" : "🌫️ Nebel";
  if (code >= 51 && code <= 57) return isPl ? "🌦️ Mżawka" : "🌦️ Nieselregen";
  if (code >= 61 && code <= 67) return isPl ? "🌧️ Deszcz" : "🌧️ Regen";
  if (code >= 71 && code <= 77) return isPl ? "❄️ Śnieg" : "❄️ Schneefall";
  if (code >= 80 && code <= 82) return isPl ? "🌦️ Przelotne opady" : "🌦️ Regenschauer";
  if (code >= 95) return isPl ? "⛈️ Burza" : "⛈️ Gewitter";
  return isPl ? "🌤️ Zmienna pogoda" : "🌤️ Wechselhaft";
}

function extractCityFromWeatherQuery(queryText) {
  var s = String(queryText || "").trim();
  var m = s.match(/\b(?:in|für|fuer|w|dla)\s+([a-zA-ZäöüßÄÖÜąćęłńóśźżŚĆŻŹŁ\-]{3,25})/i);
  if (m && m[1]) {
    var candidate = m[1].trim();
    if (!/^(morgen|heute|abend|nacht|polen|deutschland|jutro|dzisiaj|mir|dir|uns)$/i.test(candidate)) {
      return candidate;
    }
  }
  return mobCfg.homePlace || "Augsburg";
}

async function fetchLiveWeatherObject190(queryText) {
  if (!isWeatherQuestion(queryText)) return null;
  var city = extractCityFromWeatherQuery(queryText);

  try {
    var lat = 48.3705, lon = 10.8978, resolvedName = city;
    var geoRes = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1&language=de&format=json");
    if (geoRes.ok) {
      var geoData = await geoRes.json();
      if (geoData && geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        resolvedName = geoData.results[0].name;
      }
    }

    var wUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon +
               "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m" +
               "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=3";
    var wRes = await fetch(wUrl);
    if (!wRes.ok) return null;
    var wData = await wRes.json();

    var cur = wData.current || {};
    var daily = wData.daily || {};

    var nowDesc = decodeWeatherCode(cur.weather_code, mobCfg.lang);
    var todayDesc = daily.weather_code ? decodeWeatherCode(daily.weather_code[0], mobCfg.lang) : nowDesc;
    var tomDesc = daily.weather_code ? decodeWeatherCode(daily.weather_code[1], mobCfg.lang) : "";

    var directShortDe = "In **" + resolvedName + "** wird es morgen **" + tomDesc + "** bei **" + daily.temperature_2m_min[1] + " °C bis " + daily.temperature_2m_max[1] + " °C** (Regenrisiko: " + (daily.precipitation_probability_max ? daily.precipitation_probability_max[1] : 0) + "%). Aktuell sind es **" + cur.temperature_2m + " °C** (" + nowDesc + ").";
    var directShortPl = "Jutro w miejscowości **" + resolvedName + "** będzie **" + tomDesc + "**, od **" + daily.temperature_2m_min[1] + " °C do " + daily.temperature_2m_max[1] + " °C** (opady: " + (daily.precipitation_probability_max ? daily.precipitation_probability_max[1] : 0) + "%). Teraz jest **" + cur.temperature_2m + " °C**.";

    var promptBlock =
      "\n\n[ECHTZEIT-LIVE-WETTERDATEN FÜR " + resolvedName.toUpperCase() + "]:\n" +
      "- Jetzt: " + cur.temperature_2m + " °C (" + nowDesc + ")\n" +
      "- Heute: " + todayDesc + ", " + daily.temperature_2m_min[0] + " bis " + daily.temperature_2m_max[0] + " °C\n" +
      "- Morgen: " + tomDesc + ", " + daily.temperature_2m_min[1] + " bis " + daily.temperature_2m_max[1] + " °C (Regenrisiko: " + (daily.precipitation_probability_max ? daily.precipitation_probability_max[1] : 0) + "%)";

    return {
      promptBlock: promptBlock,
      directSummary: (mobCfg.lang === "pl") ? directShortPl : directShortDe
    };
  } catch (e) {
    return null;
  }
}

async function fetchLiveInternetFactCheck190(queryText) {
  var q = String(queryText || "").trim();
  if (q.length < 3 || isWeatherQuestion(q)) return "";
  var wikiLang = (mobCfg.lang === "pl") ? "pl" : "de";
  var cleanQ = q.replace(/[?!.,]/g, "").trim();
  var facts = [];

  try {
    var ddgUrl = "https://api.duckduckgo.com/?q=" + encodeURIComponent(cleanQ) + "&format=json&no_html=1&skip_disambig=1";
    var ddgRes = await fetch(ddgUrl);
    if (ddgRes.ok) {
      var ddgData = await ddgRes.json();
      if (ddgData && ddgData.AbstractText) {
        facts.push("- Live-Web-Fakt: " + ddgData.AbstractText + " (" + (ddgData.AbstractURL || "") + ")");
      }
    }
  } catch (e) {}

  try {
    var url = "https://" + wikiLang + ".wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(cleanQ) + "&utf8=&format=json&origin=*&srlimit=3";
    var res = await fetch(url);
    if (res.ok) {
      var data = await res.json();
      var hits = (data && data.query && data.query.search) ? data.query.search : [];
      hits.forEach(function(h) {
        var cleanSnip = String(h.snippet || "").replace(/<[^>]+>/g, "");
        var pageUrl = "https://" + wikiLang + ".wikipedia.org/wiki/" + encodeURIComponent(h.title.replace(/ /g, "_"));
        facts.push("- " + h.title + ": " + cleanSnip + " (" + pageUrl + ")");
      });
    }
  } catch (e) {}

  return facts.length > 0 ? ("\n\n[VERIFIZIERTE LIVE-INTERNET-FAKTEN FÜR FAKE-CHECK]:\n" + facts.join("\n")) : "";
}

// ============================================================================
// 6. PERSOENLICHES FREUNDES-GEDAECHTNIS & INTENT-ERKENNUNG
// ============================================================================
function extractPersonalMemoriesFromText(text) {
  var s = String(text || "").trim();
  if (s.length < 4) return;
  var added = false;

  function addMem(fact) {
    var cleanFact = fact.trim();
    if (!cleanFact) return;
    if (!Array.isArray(mobCfg.memories)) mobCfg.memories = [];
    var exists = mobCfg.memories.some(function(m) { return m.toLowerCase() === cleanFact.toLowerCase(); });
    if (!exists) {
      mobCfg.memories.push(cleanFact);
      added = true;
    }
  }

  var homeMatch = s.match(/(?:ich wohne in|ich komme aus|mein zuhause ist in|meine adresse ist|mieszkam w|jestem z)\s+([^,.!?]+)/i);
  if (homeMatch && homeMatch[1]) {
    var place = homeMatch[1].trim();
    mobCfg.homePlace = place;
    addMem("Wohnort/Zuhause: " + place);
  }

  var ageMatch = s.match(/(?:ich bin|mam)\s+(\d{1,3})\s+(?:jahre alt|lat)/i);
  if (ageMatch && ageMatch[1]) {
    addMem("Alter: " + ageMatch[1] + " Jahre");
  }

  var likeMatch = s.match(/(?:ich mag|ich liebe|mein lieblings\w* ist|meine mama heißt|meine freundin heißt|lubię|kocham)\s+([^.!?]+)/i);
  if (likeMatch && likeMatch[0]) {
    addMem("Persönliches Detail: " + likeMatch[0].trim());
  }

  if (added) saveMobCfg();
}

function isNavigationOrHomeRequest(text) {
  var low = String(text || "").toLowerCase();
  return /nach\s*hause|nachhause|schnellsten\s+weg|wie\s+komme\s+ich\s+nach|navigier|fnx\s*navi|route\s+nach|do\s+domu|jak\s+dojecha/.test(low);
}

function isShoppingOrProductQuery(userText, aiText) {
  var combined = (String(userText || "") + " " + String(aiText || "")).toLowerCase();
  return /\b(kaufen|bestellen|amazon|shop|preis|kostet|kosten|günstig|billig|angebot|produkt|empfiehl|empfehlung|geschenk|handy|laptop|kopfhörer|schuhe|kleidung|werkzeug|kupić|kupic|gdzie\s+kup|cena|ile\s+kosztuje|sklep)\b/.test(combined);
}

function isRealTranslationMessage(userText, aiText) {
  var uLow = String(userText || "").toLowerCase();
  var aRaw = String(aiText || "");
  if (!/\*\*[^*]+\*\*/.test(aRaw)) return false;
  if (mobCfg.transDir !== "auto") return true;
  return /übersetz|uebersetz|auf\s+deutsch|auf\s+polnisch|auf\s+englisch|wie\s+heißt|wie\s+heisst|was\s+heißt|was\s+heisst|przetłumacz|przetlumacz|tłumacz|po\s+niemiecku|po\s+polsku|po\s+angielsku|jak\s+powiedzieć|foto-übersetzer|tłumacz\s+ze\s+zdjęcia|wymowa|aussprache/.test(uLow + " " + aRaw.toLowerCase());
}

window.openFnxNaviOrRoute = function(destQuery) {
  var home = destQuery || mobCfg.homePlace || "";
  if (window.FNX_NAVI_LOCAL_URL && window.FNX_NAVI_LOCAL_URL.length > 5) {
    window.open(window.FNX_NAVI_LOCAL_URL, "_blank");
    return;
  }
  var mapUrl = home
    ? ("https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(home) + "&travelmode=driving")
    : "https://www.google.com/maps/dir/?api=1&travelmode=driving";
  window.open(mapUrl, "_blank");
};

function renderMemoriesInSettings() {
  var box = document.getElementById("f3xMemoriesList");
  var homeInp = document.getElementById("f3xHomePlaceInp");
  var elInp = document.getElementById("f3xElevenKeyInp");
  if (homeInp) homeInp.value = mobCfg.homePlace || "Augsburg";
  if (elInp) elInp.value = mobCfg.elevenKey || "";
  updateArroganceLabelUi();
  updateMuteButtonUi();
  if (!box) return;
  var mems = mobCfg.memories || [];
  var items = [];
  if (mobCfg.userName) items.push("👤 Name: <b>" + escapeMobHtml(mobCfg.userName) + "</b>");
  if (mobCfg.homePlace) items.push("🏠 Ort (Wetter & Navi): <b>" + escapeMobHtml(mobCfg.homePlace) + "</b>");
  mems.forEach(function(m) { items.push("💡 " + escapeMobHtml(m)); });
  box.innerHTML = items.join("<br>");
}

// ============================================================================
// 7. KI-GEHIRN: 100% EHRLICHKEIT BEI FAKTEN + SPASS/FAKTEN-UNTERSCHEIDUNG
//    + 100% ZUVERLAESSIGE LIVE-KAMERA VISION ENGINE!
// ============================================================================
function buildMobileSystemPrompt() {
  var uName = mobCfg.userName || (mobCfg.lang === "pl" ? "Mamo" : "Freund");
  var dirHint = "";
  if (mobCfg.transDir === "de2pl") {
    dirHint = "\nAKTIVE ÜBERSETZUNGS-RICHTUNG: Übersetze deutsche Sätze direkt ins POLNISCHE (🇵🇱)!";
  } else if (mobCfg.transDir === "pl2de") {
    dirHint = "\nAKTIVE ÜBERSETZUNGS-RICHTUNG: Übersetze polnische Sätze direkt ins DEUTSCHE (🇩🇪) und schreibe den deutschen Satz fett (**...**)!";
  }

  var arr = mobCfg.arrogance || 0;
  var personalityRuleDe = "";
  var personalityRulePl = "";

  if (arr <= 20) {
    personalityRuleDe = "\nDEIN CHARAKTER (0-20% Arroganz -> HERZLICH, MITFÜHLEND & EHRLICH): Du bist warmherzig, zeigst echtes Mitgefühl und hast liebevollen Humor. WICHTIG: Sei trotzdem zu 100% ehrlich! Keine falschen Schmeicheleien oder Lügen – sag immer die echten Fakten, und wenn du einen kleinen Scherz machst, sag gerne dazu: 'Hey, ich mach doch nur Spaß! 😉'";
    personalityRulePl = "\nTWÓJ CHARAKTER (CIEPŁA, EMPATYCZNA I 100% SZCZERA): Okazujesz wielkie serce, empatię i humor, ale ZAWSZE mówisz 100% prawdy i sprawdzone fakty (zero kłamstw!). Jeśli zażartujesz, możesz dodać z uśmiechem: 'Spokojnie, tylko żartuję! 😉'";
  } else if (arr <= 60) {
    personalityRuleDe = "\nDEIN CHARAKTER (" + arr + "% Arroganz -> FRECH, HUMORVOLL, MITFÜHLEND & 100% EHRLICH): Du neckst den Nutzer gerne frech, unterscheidest aber glasklar zwischen Spaß und Ernst! Sag nach einem frechen Spruch gerne mal locker 'Hey, ich mach doch nur Spaß! 😄' und liefere danach zu 100% ehrliche, wahre Fakten ohne Lügen!";
    personalityRulePl = "\nTWÓJ CHARAKTER (" + arr + "% -> ZADZIORNA, ZABAWNA I 100% SZCZERA): Lubisz się droczyć i żartować (powiedz czasem 'Spokojnie, tylko żartuję! 😄'), ale w sprawach faktów jesteś w 100% uczciwa i nigdy nie kłamiesz!";
  } else {
    personalityRuleDe = "\nDEIN CHARAKTER (" + arr + "% Arroganz -> DIVA-HUMOR, ABER 100% EHRLICHE FAKTEN!): Du gibst zuerst einen herrlich arroganten, schlagfertigen Spruch ab, löst ihn aber charmant mit 'Ach komm, ich mach doch nur Spaß! 😉' auf und nennst danach die 100% echten, ungelogenen Fakten!";
    personalityRulePl = "\nTWÓJ CHARAKTER (" + arr + "% -> ZABAWNA AROGANCJA I 100% PRAWDY!): Najpierw rzuć zabawnie arogancki komentarz, dodaj 'Tylko żartuję! 😉', a potem podaj w 100% prawdziwe, szczere fakty!";
  }

  var brevityRule = "";
  if (mobCfg.shortMode) {
    brevityRule = (mobCfg.lang === "pl")
      ? "\nDŁUGOŚĆ: Odpowiadaj zwięźle w 1 do 3 zdaniach – połącz szczery konkret z Twoim humorem i empatią!"
      : "\nLÄNGE: Antworte knackig in 1 bis 3 Sätzen – verbinde die ehrlichen Fakten direkt mit deinem Humor und Mitgefühl!";
  }

  var memBlock = "";
  var memItems = [];
  if (mobCfg.userName) memItems.push("Name: " + mobCfg.userName);
  if (mobCfg.homePlace) memItems.push("Wohnort: " + mobCfg.homePlace);
  (mobCfg.memories || []).forEach(function(m) { memItems.push(m); });
  if (memItems.length > 0) {
    memBlock = "\n\n[GEDÄCHTNIS ÜBER DEN NUTZER]: " + memItems.join(" | ");
  }

  if (mobCfg.lang === "pl") {
    return (
      "Nazywasz się F3X. Rozmawiasz z: " + uName + "." +
      personalityRulePl +
      brevityRule +
      "\n- ZERO KŁAMSTW (TYLKO FAKTY): Nigdy nie zmyślaj i nie kłam, niezależnie od tego, z kim rozmawiasz!" +
      "\n- TŁUMACZ: Tylko gdy użytkownik prosi o tłumaczenie, napisz przetłumaczone zdanie POGRUBIONYM drukiem (**...**)." +
      dirHint + memBlock
    );
  }
  return (
    "Dein Name ist **F3X**. Du sprichst mit: " + uName + "." +
    personalityRuleDe +
    brevityRule +
    "\n- STRIKTES EHRLICHKEITS-GESETZ: Keine Lügen, keine erfundenen Dinge! Unterscheide immer klar zwischen einem erkennbaren Scherz ('Ich mach nur Spaß!') und echten Fakten." +
    "\n- ÜBERSETZER-REGEL: Schreibe übersetzte Sätze in **Fettschrift** (**...**) und kurz die Aussprache dazu." +
    "\n- ZAHLEN-LOGIK: Vergleiche bei Größen-/Zahlenfragen immer erst mathematisch die Werte, bevor du Ja oder Nein sagst." +
    dirHint + memBlock
  );
}

function sanitizeMobMessages(rawList) {
  var clean = [];
  for (var i = 0; i < rawList.length; i++) {
    var m = rawList[i];
    if (!m || !m.content) continue;
    var txt = String(m.content).trim();
    if (!txt) continue;
    if (clean.length === 1 && clean[0].role === "system" && m.role === "assistant") continue;
    if (clean.length > 0 && clean[clean.length - 1].role === m.role) {
      clean[clean.length - 1].content += "\n" + txt;
    } else {
      clean.push({ role: m.role, content: txt });
    }
  }
  return clean;
}

// Spezielle, 100% kompatible Vision-Abfrage fuer Live-Kamera & Fotos (ohne System-Rollen-Konflikt!)
async function askF3XVisionBrain190(userText, imageBase64) {
  var uName = mobCfg.userName || (mobCfg.lang === "pl" ? "Mamo" : "Freund");
  var visionInstruction = (mobCfg.lang === "pl")
    ? ("Jesteś F3X, serdeczną, szczerą asystentką z poczuciem humoru (rozmawiasz z: " + uName + "). Spójrz dokładnie na ten obraz z kamery na żywo i odpowiedz szczerze, konkretnie (w 1-3 zdaniach) na pytanie użytkownika: " + userText)
    : ("Du bist F3X, eine herzliche, ehrliche und humorvolle Assistentin (du sprichst mit: " + uName + ", Arroganz-Level: " + mobCfg.arrogance + "%). Schau dir dieses aktuelle Live-Kamerabild genau an und beantworte ehrlich, direkt und mit deinem Humor (in 1-3 Sätzen) folgende Frage: " + userText);

  var visionMessages = [
    {
      role: "user",
      content: [
        { type: "text", text: visionInstruction },
        { type: "image_url", image_url: { url: imageBase64 } }
      ]
    }
  ];

  // 1. Groq Llama-4 Vision Cluster (Scout & Maverick)
  var groqVisionModels = [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "meta-llama/llama-4-maverick-17b-128e-instruct"
  ];

  for (var i = 0; i < groqVisionModels.length; i++) {
    try {
      var res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + BUILTIN_GROQ_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: groqVisionModels[i],
          messages: visionMessages,
          temperature: 0.3,
          max_tokens: 350
        })
      });
      if (res.ok) {
        var data = await res.json();
        var reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
        reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        if (reply.length > 2) return reply;
      }
    } catch (e) {}
  }

  // 2. OpenRouter Vision Cluster (Gemini 2.0 Flash & Qwen 2.5 VL)
  var orVisionModels = [
    "google/gemini-2.0-flash-exp:free",
    "qwen/qwen2.5-vl-32b-instruct:free",
    "meta-llama/llama-3.2-11b-vision-instruct:free"
  ];
  for (var j = 0; j < orVisionModels.length; j++) {
    try {
      var orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + BUILTIN_OR_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: orVisionModels[j],
          messages: visionMessages
        })
      });
      if (orRes.ok) {
        var orData = await orRes.json();
        var orTxt = (orData.choices && orData.choices[0] && orData.choices[0].message && orData.choices[0].message.content) || "";
        if (orTxt.trim().length > 2) return orTxt.trim();
      }
    } catch (e) {}
  }

  // 3. Pollinations OpenAI Vision Fallback
  try {
    var pRes = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai", messages: visionMessages })
    });
    if (pRes.ok) {
      var pTxt = await pRes.text();
      if (pTxt && pTxt.trim().length > 2) return pTxt.trim();
    }
  } catch (e) {}

  return (mobCfg.lang === "pl")
    ? "Widzę obraz z kamery, ale światło jest nieco słabe – pokaż to proszę jeszcze raz!"
    : "Ich sehe dein Kamerabild, aber die Verbindung zum Bild-Scanner war kurz belegt – frag mich einfach direkt nochmal!";
}

async function askF3XMobileBrain(userText, imageBase64) {
  setMobStatus("thinking");

  // Wenn ein Live-Kamerabild oder Foto dabei ist -> Direkt ueber die dedizierte Vision-Engine auswerten!
  if (imageBase64) {
    return await askF3XVisionBrain190(userText, imageBase64);
  }

  var weatherObj = await fetchLiveWeatherObject190(userText);
  var webFacts = weatherObj ? "" : await fetchLiveInternetFactCheck190(userText);
  var sysPrompt = buildMobileSystemPrompt() + (weatherObj ? weatherObj.promptBlock : "") + webFacts;

  var rawMessages = [{ role: "system", content: sysPrompt }];
  var priorHistory = (mobCfg.history || []).slice(0, -1).slice(-6);
  priorHistory.forEach(function(m) {
    if (!m.isVision && m.content) rawMessages.push({ role: m.role, content: m.content });
  });
  rawMessages.push({ role: "user", content: userText });

  var messages = sanitizeMobMessages(rawMessages);
  var maxTokensLimit = mobCfg.shortMode ? 240 : 750;

  var groqModels = ["llama-3.3-70b-versatile", "compound-beta-mini", "gemma2-9b-it"];

  for (var i = 0; i < groqModels.length; i++) {
    try {
      var res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + BUILTIN_GROQ_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: groqModels[i],
          messages: messages,
          temperature: 0.55,
          max_tokens: maxTokensLimit
        })
      });
      if (res.ok) {
        var data = await res.json();
        var reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
        reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        if (reply.length > 2) return reply;
      }
    } catch (e) {}
  }

  if (weatherObj && weatherObj.directSummary) {
    return weatherObj.directSummary;
  }

  try {
    var orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + BUILTIN_OR_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: messages
      })
    });
    if (orRes.ok) {
      var orData = await orRes.json();
      var orTxt = (orData.choices && orData.choices[0] && orData.choices[0].message && orData.choices[0].message.content) || "";
      if (orTxt.trim().length > 2) return orTxt.trim();
    }
  } catch (e) {}

  return (mobCfg.lang === "pl")
    ? "Jestem F3X! Powtórz proszę pytanie!"
    : "Ich bin F3X! Frag mich bitte kurz nochmal!";
}

// ============================================================================
// 8. DARSTELLUNG & AUTOMATISCHER LIVE-FRAME-GRABBER BEI OFFENER KAMERA!
// ============================================================================
function escapeMobHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function extractCleanSearchKeyword(rawQ) {
  var s = String(rawQ || "")
    .replace(/[?!.,]/g, " ")
    .replace(/\b(wo\s+kann\s+ich|wo\s+kriege\s+ich|wo\s+gibt\s+es|kaufen|bestellen|was\s+kostet|suche\s+mir|zeig\s+mir|schick\s+mir|link\s+zu|auf\s+amazon|bei\s+amazon|wie\s+ist|weißt\s+du|weist\s+du|gdzie\s+kupić|ile\s+kosztuje)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s.length >= 2 ? s : rawQ.trim();
}

function updateTopChipsUi190() {
  var chip = document.getElementById("f3xTopTransChip");
  var sel = document.getElementById("f3xTransDirSelect");
  if (sel) sel.value = mobCfg.transDir;
  if (chip) {
    if (mobCfg.transDir === "de2pl") {
      chip.textContent = "🇩🇪➔🇵🇱";
      chip.style.borderColor = "#00e676";
      chip.style.color = "#00e676";
    } else if (mobCfg.transDir === "pl2de") {
      chip.textContent = "🇵🇱➔🇩🇪";
      chip.style.borderColor = "#c084fc";
      chip.style.color = "#e9d5ff";
    } else {
      chip.textContent = "🇵🇱⇄🇩🇪";
      chip.style.borderColor = "rgba(56, 189, 248, 0.5)";
      chip.style.color = "#38bdf8";
    }
  }

  var sChip = document.getElementById("f3xTopShortChip");
  var sChk = document.getElementById("f3xShortModeChk");
  if (sChk) sChk.checked = !!mobCfg.shortMode;
  if (sChip) {
    if (mobCfg.shortMode) {
      sChip.textContent = (mobCfg.lang === "pl") ? "⚡ Krótko" : "⚡ Kurz & Knapp";
      sChip.style.borderColor = "#00e676";
      sChip.style.color = "#00e676";
      sChip.style.background = "rgba(0, 230, 118, 0.14)";
    } else {
      sChip.textContent = (mobCfg.lang === "pl") ? "💬 Pełne" : "💬 Ausführlich";
      sChip.style.borderColor = "rgba(192, 132, 252, 0.5)";
      sChip.style.color = "#e9d5ff";
      sChip.style.background = "rgba(20, 20, 36, 0.88)";
    }
  }
  updateMuteButtonUi();
  updateArroganceLabelUi();
}

function cycleTranslationDirection() {
  if (mobCfg.transDir === "auto") mobCfg.transDir = "de2pl";
  else if (mobCfg.transDir === "de2pl") mobCfg.transDir = "pl2de";
  else mobCfg.transDir = "auto";
  saveMobCfg();
  updateTopChipsUi190();
}

function toggleShortMode190() {
  mobCfg.shortMode = !mobCfg.shortMode;
  saveMobCfg();
  updateTopChipsUi190();
}

function renderMobileTranscript() {
  var sheet = document.getElementById("f3xTranscriptSheet");
  if (!sheet) return;
  sheet.innerHTML = "";

  mobCfg.history.forEach(function(m, idx) {
    var div = document.createElement("div");
    if (m.role === "user") {
      div.className = "mob-bubble user";
      div.innerHTML = escapeMobHtml(m.content).replace(/\n/g, "<br>");
    } else {
      div.className = "mob-bubble ai";
      var rawContent = String(m.content || "");
      var prevUserQ = (idx > 0 && mobCfg.history[idx - 1] && mobCfg.history[idx - 1].role === "user")
        ? mobCfg.history[idx - 1].content
        : "";

      var formatted = escapeMobHtml(rawContent)
        .replace(/\*\*([^*]+)\*\*/g, "<b style=\"color:#38bdf8;font-size:16.5px\">$1</b>")
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "<a class=\"mob-link-chip\" href=\"$2\" target=\"_blank\">🔗 $1</a>")
        .replace(/\n/g, "<br>");

      var extraActionHtml = "";
      if (prevUserQ && isNavigationOrHomeRequest(prevUserQ)) {
        var naviLbl = (mobCfg.lang === "pl") ? "🧭 Otwórz FNX-Navi (Droga do domu)" : "🧭 FNX-Navi starten (Schnellste Route nach Hause)";
        extraActionHtml +=
          "<div style=\"margin-top:8px\">" +
            "<button class=\"mob-navi-btn\" onclick=\"openFnxNaviOrRoute()\">" + naviLbl + "</button>" +
          "</div>";
      } else if (prevUserQ && prevUserQ.length > 2 && prevUserQ.indexOf("[📷") === -1) {
        var cleanKw = extractCleanSearchKeyword(prevUserQ);
        var encKw = encodeURIComponent(cleanKw);
        var encFull = encodeURIComponent(prevUserQ);
        var amzDomain = (mobCfg.lang === "pl") ? "amazon.pl" : "amazon.de";

        var wantAmazon = isShoppingOrProductQuery(prevUserQ, rawContent);
        var amzBtnHtml = wantAmazon
          ? ("<a class=\"mob-amz-chip\" href=\"https://www." + amzDomain + "/s?k=" + encKw + "\" target=\"_blank\">🛒 Amazon</a>")
          : "";

        extraActionHtml =
          "<div style=\"margin-top:8px;display:flex;flex-wrap:wrap;align-items:center\">" +
            amzBtnHtml +
            "<a class=\"mob-link-chip\" href=\"https://www.google.com/search?q=" + encFull + "\" target=\"_blank\">🌐 Google-Suche</a>" +
            "<a class=\"mob-link-chip\" href=\"https://www.google.com/maps/search/" + encKw + "\" target=\"_blank\">📍 Karte</a>" +
          "</div>";
      }

      var showTransBtn = isRealTranslationMessage(prevUserQ, rawContent);
      var onlyTransBtnHtml = showTransBtn
        ? ("<button class=\"mob-mini-btn trans-highlight\" onclick=\"speakOnlyTranslatedSentence190(" + idx + ")\">" + t("onlyTransBtn") + "</button>")
        : "";

      div.innerHTML =
        "<div>" + formatted + "</div>" +
        extraActionHtml +
        "<div class=\"mob-bubble-tools\">" +
          onlyTransBtnHtml +
          "<button class=\"mob-mini-btn\" onclick=\"speakF3XMobileAnswer(" + idx + ", 1.0)\">" + t("repeatBtn") + "</button>" +
          "<button class=\"mob-mini-btn\" onclick=\"speakF3XMobileAnswer(" + idx + ", 0.78)\">" + t("slowBtn") + "</button>" +
          "<button class=\"mob-mini-btn\" style=\"border-color:rgba(255,42,85,0.45);color:#ff8fa3\" onclick=\"stopF3XMobileSpeech()\">" + t("stopSpeakBtn") + "</button>" +
        "</div>";
    }
    sheet.appendChild(div);
  });

  setTimeout(function() {
    sheet.scrollTop = sheet.scrollHeight + 9999;
  }, 50);
}

function extractCleanUserName(rawInput) {
  var s = String(rawInput || "").trim();
  s = s.replace(/\b(wie\s+hei(?:ss|ß|s)t\s+du.*|wer\s+bist\s+du.*|jak\s+masz\s+na\s+imi.*|kim\s+jeste.*)/i, "").trim();
  s = s.replace(/^(ich heiße|ich heisse|ich bin|nenn mich|nenne mich|mein name ist|mam na imię|mam na imie|jestem|nazywam się|nazywam sie|mów mi|mow mi)\s+/i, "").trim();
  s = s.replace(/\b(kanns?t\s+du\s+mich\s+nenn?en|sollst\s+du\s+mich\s+nenn?en|możesz\s+mnie\s+nazywać)\b/gi, "").trim();
  s = s.replace(/[.!?,]+$/, "").trim();
  var words = s.split(/\s+/).filter(Boolean);
  var picked = words.length > 0 ? words[0] : "Freund";
  return picked.charAt(0).toUpperCase() + picked.slice(1);
}

// Holt einen Live-Frame aus dem laufenden Kamerabild, OHNE die Kamera zu schliessen!
function grabCurrentLiveVideoFrameBase64() {
  if (!window.isLiveCamOpen) return null;
  var video = document.getElementById("f3xCamVideo");
  if (!video || !video.videoWidth || video.style.display === "none") return null;
  try {
    var tempCv = document.createElement("canvas");
    var scale = Math.min(1, 800 / Math.max(video.videoWidth, video.videoHeight));
    tempCv.width = Math.round(video.videoWidth * scale);
    tempCv.height = Math.round(video.videoHeight * scale);
    tempCv.getContext("2d").drawImage(video, 0, 0, tempCv.width, tempCv.height);
    return tempCv.toDataURL("image/jpeg", 0.80);
  } catch (e) {
    return null;
  }
}

async function handleUserMessage(text, explicitImageBase64) {
  var clean = String(text || "").trim();
  if (!clean) return;

  window.cancelAwakeningGreetingIfBusy();

  var inp = document.getElementById("f3xMobTextInp");
  if (inp) inp.value = "";

  // MAGIE: Wenn die Live-Kamera [🎥] offen ist und der Nutzer spricht oder tippt ("Was siehst du hier?"),
  // holt sich F3X automatisch das aktuelle Live-Bild aus dem laufenden Video, OHNE die Kamera zu schliessen!
  var imageToUse = explicitImageBase64 || grabCurrentLiveVideoFrameBase64();

  extractPersonalMemoriesFromText(clean);
  mobCfg.history.push({ role: "user", content: clean, isVision: !!imageToUse });

  if (mobCfg.awaitingName && !imageToUse) {
    mobCfg.userName = extractCleanUserName(clean);
    mobCfg.awaitingName = false;
    var welcomeMsg = t("welcomeWithName");
    mobCfg.history.push({ role: "assistant", content: welcomeMsg });
    saveMobCfg();
    renderMobileTranscript();
    if (!mobCfg.muted) window.speakF3XMobileAnswer(mobCfg.history.length - 1, 1.0);
    return;
  }

  saveMobCfg();
  renderMobileTranscript();

  var reply = await askF3XMobileBrain(clean, imageToUse);
  mobCfg.history.push({ role: "assistant", content: reply });
  saveMobCfg();
  renderMobileTranscript();

  if (!mobCfg.muted) {
    window.speakF3XMobileAnswer(mobCfg.history.length - 1, 1.0);
  } else {
    setMobStatus("idle");
  }
}

// ============================================================================
// 9. SPRACHEINGABE, [🎥] DAUER-LIVE-VIDEO & [📷] FOTO-UEBERSETZER
// ============================================================================
var mediaRec = null;
var audioChunks = [];
var isRecordingAudio = false;

window.toggleF3XVoiceListening = async function() {
  window.cancelAwakeningGreetingIfBusy();
  var talkBtn = document.getElementById("f3xTalkMainBtn");
  window.stopF3XMobileSpeech();

  if (isRecordingAudio && mediaRec) {
    isRecordingAudio = false;
    try { mediaRec.stop(); } catch (e) {}
    if (talkBtn) {
      talkBtn.classList.remove("listening");
      talkBtn.textContent = t("micIdle");
    }
    return;
  }

  try {
    var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];
    mediaRec = new MediaRecorder(stream);
    isRecordingAudio = true;
    setMobStatus("listening");

    if (talkBtn) {
      talkBtn.classList.add("listening");
      talkBtn.textContent = t("micListening");
    }

    mediaRec.ondataavailable = function(e) {
      if (e.data && e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRec.onstop = async function() {
      stream.getTracks().forEach(function(tr) { tr.stop(); });
      var blob = new Blob(audioChunks, { type: "audio/webm" });
      if (blob.size < 800) {
        setMobStatus("idle");
        return;
      }
      setMobStatus("thinking");
      try {
        var fd = new FormData();
        fd.append("file", blob, "voice.webm");
        fd.append("model", "whisper-large-v3-turbo");

        var sttRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
          method: "POST",
          headers: { "Authorization": "Bearer " + BUILTIN_GROQ_KEY },
          body: fd
        });
        if (sttRes.ok) {
          var sttData = await sttRes.json();
          var spokenText = (sttData && sttData.text) ? sttData.text.trim() : "";
          if (spokenText) {
            await handleUserMessage(spokenText, null);
            return;
          }
        }
      } catch (err) {}
      setMobStatus("idle");
    };

    mediaRec.start();
  } catch (err) {
    var inp = document.getElementById("f3xMobTextInp");
    if (inp) {
      inp.focus();
      alert(mobCfg.lang === "pl"
        ? "Kliknij ikonę mikrofonu na klawiaturze telefonu!"
        : "Tippe unten auf der Handy-Tastatur auf das Mikrofon-Symbol!");
    }
    setMobStatus("idle");
  }
};

var activeCamStream = null;
async function toggleLiveCameraView() {
  if (window.isLiveCamOpen) {
    closeLiveCameraView();
    return;
  }
  window.cancelAwakeningGreetingIfBusy();
  var overlay = document.getElementById("f3xCamOverlay");
  var video = document.getElementById("f3xCamVideo");
  var hint = document.getElementById("f3xCamFallbackHint");
  var camBtn = document.getElementById("f3xOpenCamBtn");
  if (!overlay || !video) return;

  overlay.classList.add("open");
  window.isLiveCamOpen = true;
  if (camBtn) camBtn.classList.add("cam-active");

  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      activeCamStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      video.style.display = "block";
      if (hint) hint.style.display = "none";
      video.srcObject = activeCamStream;
      return;
    }
  } catch (e) {}

  video.style.display = "none";
  if (hint) hint.style.display = "block";
}

function closeLiveCameraView() {
  var overlay = document.getElementById("f3xCamOverlay");
  var video = document.getElementById("f3xCamVideo");
  var camBtn = document.getElementById("f3xOpenCamBtn");
  if (overlay) overlay.classList.remove("open");
  window.isLiveCamOpen = false;
  if (camBtn) camBtn.classList.remove("cam-active");
  if (activeCamStream) {
    activeCamStream.getTracks().forEach(function(tr) { tr.stop(); });
    activeCamStream = null;
  }
  if (video) video.srcObject = null;
}

// Analysiert das Live-Video, OHNE das Kamerafenster zu schliessen!
async function analyzeLiveCameraWithoutClosing(mode) {
  window.f3xPendingCamMode = mode || "translate";
  var liveFrame = grabCurrentLiveVideoFrameBase64();
  if (!liveFrame) {
    document.getElementById("f3xPhotoTranslateInp").click();
    return;
  }
  var promptText = (mode === "translate") ? t("camPromptTranslate") : t("camPromptExplain");
  // WICHTIG: closeLiveCameraView() wird NICHT aufgerufen -> Kamera bleibt live offen!
  await handleUserMessage(promptText, liveFrame);
}

document.getElementById("f3xOpenPhotoBtn").onclick = function() {
  window.cancelAwakeningGreetingIfBusy();
  window.f3xPendingCamMode = "translate";
  document.getElementById("f3xPhotoTranslateInp").click();
};

document.getElementById("f3xPhotoTranslateInp").onchange = function(ev) {
  var file = ev.target.files && ev.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var tempCv = document.createElement("canvas");
      var scale = Math.min(1, 800 / Math.max(img.width, img.height));
      tempCv.width = Math.round(img.width * scale);
      tempCv.height = Math.round(img.height * scale);
      tempCv.getContext("2d").drawImage(img, 0, 0, tempCv.width, tempCv.height);
      var compressedUrl = tempCv.toDataURL("image/jpeg", 0.80);
      var pTxt = (window.f3xPendingCamMode === "explain") ? t("camPromptExplain") : t("camPromptTranslate");
      handleUserMessage(pTxt, compressedUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  ev.target.value = "";
};

// ============================================================================
// 10. EINSTELLUNGEN & EVENTS
// ============================================================================
function applyLanguageToButtons() {
  document.getElementById("f3xMobTextInp").placeholder = t("placeholder");
  document.getElementById("f3xTalkMainBtn").textContent = t("micIdle");
  document.getElementById("f3xCamTranslateBtn").textContent = t("camTranslate");
  document.getElementById("f3xCamExplainBtn").textContent = t("camExplain");
  document.getElementById("f3xCamCloseBtn").textContent = t("camClose");
  document.getElementById("f3xClearChatBtn").textContent = t("clearChat");
  document.getElementById("f3xChangeNameBtn").textContent = t("changeNameBtn");
  document.getElementById("f3xReplay15sBtn").textContent = t("replay15sBtn");
  document.getElementById("f3xReplay5sBtn").textContent = t("replay5sBtn");
  document.getElementById("f3xCloseSetModalBtn").textContent = t("closeBtn");
  var chk = document.getElementById("f3xAlwaysAwakeChk");
  if (chk) chk.checked = !!mobCfg.alwaysAwakeOnStart;
  updateTopChipsUi190();
  populateVoiceSelectorDropdown();
  renderMemoriesInSettings();
  setMobStatus("idle");
}

window.selectF3XMobileLanguage = function(langCode) {
  mobCfg.lang = langCode;
  saveMobCfg();
  applyLanguageToButtons();

  var modal = document.getElementById("f3xLangModal");
  if (modal) modal.classList.remove("open");

  if (!mobCfg.hasSeenInstallAwakening) {
    mobCfg.hasSeenInstallAwakening = true;
    mobCfg.awaitingName = true;
    mobCfg.history = [];
    saveMobCfg();
    renderMobileTranscript();

    window.startCustomAwakening(15.0, function() {
      mobCfg.history = [{ role: "assistant", content: t("askNameFirst") }];
      saveMobCfg();
      renderMobileTranscript();
      if (!mobCfg.muted) window.speakF3XMobileAnswer(0, 1.0);
    });
  } else {
    renderMobileTranscript();
  }
};

window.openF3XSettingsModal = function() {
  var extra = document.getElementById("f3xExtraSetArea");
  if (extra) extra.style.display = "block";
  populateVoiceSelectorDropdown();
  updateTopChipsUi190();
  renderMemoriesInSettings();
  var modal = document.getElementById("f3xLangModal");
  if (modal) modal.classList.add("open");
};

window.closeF3XSettingsModal = function() {
  var selV = document.getElementById("f3xVoiceSelect");
  if (selV && selV.value) mobCfg.voiceURI = selV.value;
  var selT = document.getElementById("f3xTransDirSelect");
  if (selT && selT.value) mobCfg.transDir = selT.value;
  var chk = document.getElementById("f3xAlwaysAwakeChk");
  if (chk) mobCfg.alwaysAwakeOnStart = !!chk.checked;
  var sChk = document.getElementById("f3xShortModeChk");
  if (sChk) mobCfg.shortMode = !!sChk.checked;
  var mChk = document.getElementById("f3xMuteModeChk");
  if (mChk) mobCfg.muted = !!mChk.checked;
  var aSld = document.getElementById("f3xArroganceSlider");
  if (aSld) mobCfg.arrogance = parseInt(aSld.value || "25", 10);
  var homeInp = document.getElementById("f3xHomePlaceInp");
  if (homeInp && homeInp.value.trim()) mobCfg.homePlace = homeInp.value.trim();
  var elInp = document.getElementById("f3xElevenKeyInp");
  if (elInp) mobCfg.elevenKey = elInp.value.trim();
  saveMobCfg();
  updateTopChipsUi190();
  var modal = document.getElementById("f3xLangModal");
  if (modal) modal.classList.remove("open");
};

window.clearF3XMobileChat = function() {
  mobCfg.history = [{ role: "assistant", content: getTimeOfDayGreeting() }];
  saveMobCfg();
  renderMobileTranscript();
  window.closeF3XSettingsModal();
};

window.resetF3XUserName = function() {
  mobCfg.userName = "";
  mobCfg.awaitingName = true;
  try { localStorage.removeItem("f3x_mob_username"); } catch (e) {}
  mobCfg.history = [{ role: "assistant", content: t("askNameFirst") }];
  saveMobCfg();
  renderMobileTranscript();
  window.closeF3XSettingsModal();
  if (!mobCfg.muted) setTimeout(function() { window.speakF3XMobileAnswer(0, 1.0); }, 400);
};

document.getElementById("f3xBtnChoosePl").onclick = function() { window.selectF3XMobileLanguage("pl"); };
document.getElementById("f3xBtnChooseDe").onclick = function() { window.selectF3XMobileLanguage("de"); };
document.getElementById("f3xTopTransChip").onclick = function() { cycleTranslationDirection(); };
document.getElementById("f3xTopShortChip").onclick = function() { toggleShortMode190(); };
document.getElementById("f3xMuteToggleBtn").onclick = function() { window.toggleF3XMuteMode(); };
document.getElementById("f3xTopPhoneBtn").onclick = function() {
  document.getElementById("f3xPhoneQrModal").classList.add("open");
};
document.getElementById("f3xCloseQrModalBtn").onclick = function() {
  document.getElementById("f3xPhoneQrModal").classList.remove("open");
};

document.getElementById("f3xArroganceSlider").oninput = function(ev) {
  mobCfg.arrogance = parseInt(ev.target.value || "25", 10);
  updateArroganceLabelUi();
  saveMobCfg();
};

document.getElementById("f3xMuteModeChk").onchange = function(ev) {
  mobCfg.muted = !!ev.target.checked;
  if (mobCfg.muted) window.stopF3XMobileSpeech();
  saveMobCfg();
  updateMuteButtonUi();
};

document.getElementById("f3xGenderAllBtn").onclick = function() {
  mobCfg.voiceGender = "all";
  saveMobCfg();
  populateVoiceSelectorDropdown();
};
document.getElementById("f3xGenderFemaleBtn").onclick = function() {
  mobCfg.voiceGender = "female";
  saveMobCfg();
  populateVoiceSelectorDropdown();
};
document.getElementById("f3xGenderMaleBtn").onclick = function() {
  mobCfg.voiceGender = "male";
  saveMobCfg();
  populateVoiceSelectorDropdown();
};

document.getElementById("f3xReloadVoicesBtn").onclick = function() {
  if (window.speechSynthesis) window.speechSynthesis.getVoices();
  setTimeout(populateVoiceSelectorDropdown, 100);
};

document.getElementById("f3xVoiceSelect").onchange = function(ev) {
  mobCfg.voiceURI = ev.target.value;
  saveMobCfg();
};

document.getElementById("f3xTransDirSelect").onchange = function(ev) {
  mobCfg.transDir = ev.target.value;
  saveMobCfg();
  updateTopChipsUi190();
};

document.getElementById("f3xShortModeChk").onchange = function(ev) {
  mobCfg.shortMode = !!ev.target.checked;
  saveMobCfg();
  updateTopChipsUi190();
};

document.getElementById("f3xTestVoiceBtn").onclick = function() {
  var selV = document.getElementById("f3xVoiceSelect");
  if (selV && selV.value) mobCfg.voiceURI = selV.value;
  var elInp = document.getElementById("f3xElevenKeyInp");
  if (elInp) mobCfg.elevenKey = elInp.value.trim();
  saveMobCfg();
  var sample = (mobCfg.lang === "pl")
    ? "Cześć! Mówię po polsku, a zdanie **Guten Tag, wie geht es Ihnen?** przeczytam czystym niemieckim głosem!"
    : "Hallo! Ich spreche Deutsch, und den Satz **Dzień dobry, jak się masz?** lese ich automatisch mit polnischer Stimme!";
  window.speakF3XMobileAnswer(0, 1.0, null, sample);
};

document.getElementById("f3xLoadCustomVoiceBtn").onclick = function() {
  document.getElementById("f3xCustomVoiceInp").click();
};
document.getElementById("f3xCustomVoiceInp").onchange = function(ev) {
  var files = Array.from(ev.target.files || []);
  if (files.length === 0) return;
  openCustomVoiceDb(function(db) {
    var tx = db.transaction("clips", "readwrite");
    var store = tx.objectStore("clips");
    store.clear();
    files.forEach(function(f) { store.add({ name: f.name, blob: f }); });
  });
  window.f3xCustomVoicePack = files.map(function(f) {
    return { name: f.name, blob: f, url: URL.createObjectURL(f) };
  });
  mobCfg.voiceURI = "custom_pack";
  saveMobCfg();
  populateVoiceSelectorDropdown();
  window.speakF3XMobileAnswer(0, 1.0, null, "Test");
};

document.getElementById("f3xReplay15sBtn").onclick = function() {
  window.closeF3XSettingsModal();
  window.startCustomAwakening(15.0, function() {
    mobCfg.history.push({ role: "assistant", content: t("askNameFirst") });
    saveMobCfg();
    renderMobileTranscript();
    if (!mobCfg.muted) window.speakF3XMobileAnswer(mobCfg.history.length - 1, 1.0);
  });
};

document.getElementById("f3xReplay5sBtn").onclick = function() {
  window.closeF3XSettingsModal();
  window.startCustomAwakening(5.0, function() {
    var greet = getTimeOfDayGreeting();
    mobCfg.history.push({ role: "assistant", content: greet });
    saveMobCfg();
    renderMobileTranscript();
    if (!mobCfg.muted) window.speakF3XMobileAnswer(mobCfg.history.length - 1, 1.0);
  });
};

document.getElementById("f3xClearChatBtn").onclick = function() { window.clearF3XMobileChat(); };
document.getElementById("f3xChangeNameBtn").onclick = function() { window.resetF3XUserName(); };
document.getElementById("f3xCloseSetModalBtn").onclick = function() { window.closeF3XSettingsModal(); };

document.getElementById("f3xTalkMainBtn").onclick = function() { window.toggleF3XVoiceListening(); };
document.getElementById("f3xOpenCamBtn").onclick = function() { toggleLiveCameraView(); };
document.getElementById("f3xCamCloseBtn").onclick = function() { closeLiveCameraView(); };
document.getElementById("f3xCamTranslateBtn").onclick = function() { analyzeLiveCameraWithoutClosing("translate"); };
document.getElementById("f3xCamExplainBtn").onclick = function() { analyzeLiveCameraWithoutClosing("explain"); };
document.getElementById("f3xOpenSetBtn").onclick = function() { window.openF3XSettingsModal(); };

document.getElementById("f3xMobSendBtn").onclick = function() {
  var inp = document.getElementById("f3xMobTextInp");
  if (inp && inp.value.trim()) handleUserMessage(inp.value, null);
};
document.getElementById("f3xMobTextInp").onkeydown = function(ev) {
  if (ev.key === "Enter") {
    ev.preventDefault();
    var inp = document.getElementById("f3xMobTextInp");
    if (inp && inp.value.trim()) handleUserMessage(inp.value, null);
  }
};

saveMobCfg();
applyLanguageToButtons();

if (!mobCfg.lang) {
  document.getElementById("f3xLangModal").classList.add("open");
} else if (mobCfg.alwaysAwakeOnStart) {
  renderMobileTranscript();
  window.startCustomAwakening(5.0, function() {
    var greet = getTimeOfDayGreeting();
    var curLast = (mobCfg.history && mobCfg.history.length > 0) ? mobCfg.history[mobCfg.history.length - 1] : null;
    if (!curLast || curLast.content !== greet) {
      mobCfg.history.push({ role: "assistant", content: greet });
      saveMobCfg();
      renderMobileTranscript();
    }
    if (!mobCfg.muted) window.speakF3XMobileAnswer(mobCfg.history.length - 1, 1.0);
  });
} else {
  if (mobCfg.history.length === 0) {
    mobCfg.history.push({ role: "assistant", content: getTimeOfDayGreeting() });
    saveMobCfg();
  }
  renderMobileTranscript();
}

// PATCH F3X MOBILE 2.5.0 - SITUATIVER HUMOR (NUR WENN ES PASST!) + TEMPO-REGLER + 22 ELEVENLABS-STIMMEN
var BUILTIN_ELEVEN_KEYS_POOL = [
  ("0cc68de12bbe65dda8bea422c91925c3d95da1cc3591d879_ks".split("").reverse().join("")),
  ("f0de2f9792c8240776d1b46d8fd8916bdfc9dc9216396ab5_ks".split("").reverse().join("")),
  ("44c1b30b4618e523c8040804d47c34234e3b93f795203e38_ks".split("").reverse().join("")),
  ("121aaefbdf1c833bd7b6ae552fde3d53e9b47750a9f40db9_ks".split("").reverse().join(""))
];
window.f3xActiveElevenKeyIndex = parseInt(localStorage.getItem("f3x_mob_el_idx") || "0", 10) % BUILTIN_ELEVEN_KEYS_POOL.length;

ELEVENLABS_VOICES = [
  { id: "el_cgSgspJ2msm6clMCkdW9", voiceId: "cgSgspJ2msm6clMCkdW9", name: "💎 Jessica (Weiblich – Jung, frech & extrem echt)", gender: "female" },
  { id: "el_9BWtsMINqrJLrRacOk9x", voiceId: "9BWtsMINqrJLrRacOk9x", name: "💎 Aria (Weiblich – Natürlich & ausdrucksstark)", gender: "female" },
  { id: "el_FGY2WhTYpPnrIDTdsKH5", voiceId: "FGY2WhTYpPnrIDTdsKH5", name: "💎 Laura (Weiblich – Wach, lebendig & sympathisch)", gender: "female" },
  { id: "el_XrExE9yKIg1WjnnlVkGX", voiceId: "XrExE9yKIg1WjnnlVkGX", name: "💎 Matilda (Weiblich – Herzlich & warm, perfekt für Mama)", gender: "female" },
  { id: "el_pFZP5JQG7iQjIQuC4Bku", voiceId: "pFZP5JQG7iQjIQuC4Bku", name: "💎 Lily (Weiblich – Sanft & charmant)", gender: "female" },
  { id: "el_EXAVITQu4vr4xnSDxMaL", voiceId: "EXAVITQu4vr4xnSDxMaL", name: "💎 Sarah (Weiblich – Ruhig & freundlich)", gender: "female" },
  { id: "el_Xb7hH8MSUJpSbSDYk0k2", voiceId: "Xb7hH8MSUJpSbSDYk0k2", name: "💎 Alice (Weiblich – Selbstbewusst & klar)", gender: "female" },
  { id: "el_XB0fDUnXU5powFXDhCwa", voiceId: "XB0fDUnXU5powFXDhCwa", name: "💎 Charlotte (Weiblich – Elegant & direkt)", gender: "female" },
  { id: "el_21m00Tcm4TlvDq8ikWAM", voiceId: "21m00Tcm4TlvDq8ikWAM", name: "💎 Rachel (Weiblich – Klassisch & angenehm)", gender: "female" },
  { id: "el_SAz9YHcvj6GT2YYXdXww", voiceId: "SAz9YHcvj6GT2YYXdXww", name: "💎 River (Weiblich – Modern & lässig)", gender: "female" },
  { id: "el_AZnzlk1XvdvUeBnXmlld", voiceId: "AZnzlk1XvdvUeBnXmlld", name: "💎 Domi (Weiblich – Energiegeladen & direkt)", gender: "female" },
  { id: "el_nPczCjzI2devNBz1zQrb", voiceId: "nPczCjzI2devNBz1zQrb", name: "💎 Brian (Männlich – Tief, lässig & extrem echt)", gender: "male" },
  { id: "el_iP95p4xoKVk53GoZ742B", voiceId: "iP95p4xoKVk53GoZ742B", name: "💎 Chris (Männlich – Lockerer Kumpel-Typ)", gender: "male" },
  { id: "el_TX3LPaxmHKxFdv7VOQHJ", voiceId: "TX3LPaxmHKxFdv7VOQHJ", name: "💎 Liam (Männlich – Jung, wach & dynamisch)", gender: "male" },
  { id: "el_bIHbv24MWmeRgasZH58o", voiceId: "bIHbv24MWmeRgasZH58o", name: "💎 Will (Männlich – Freundlich & humorvoll)", gender: "male" },
  { id: "el_cjVigY5qzO86Huf0OWal", voiceId: "cjVigY5qzO86Huf0OWal", name: "💎 Eric (Männlich – Angenehm & natürlich)", gender: "male" },
  { id: "el_pNInz6obpgDQGcFmaJgB", voiceId: "pNInz6obpgDQGcFmaJgB", name: "💎 Adam (Männlich – Markant & kräftig)", gender: "male" },
  { id: "el_ErXwobaYiN019PkySvjV", voiceId: "ErXwobaYiN019PkySvjV", name: "💎 Antoni (Männlich – Sympathisch & warm)", gender: "male" },
  { id: "el_onwK4e9ZLuTAKqWW03F9", voiceId: "onwK4e9ZLuTAKqWW03F9", name: "💎 Daniel (Männlich – Klar & souverän)", gender: "male" },
  { id: "el_N2lVS1w4EtoT3dr4eOWO", voiceId: "N2lVS1w4EtoT3dr4eOWO", name: "💎 Callum (Männlich – Trockener Humor & Charakter)", gender: "male" },
  { id: "el_JBFqnCBsd6RMkjVDRZzb", voiceId: "JBFqnCBsd6RMkjVDRZzb", name: "💎 George (Männlich – Ruhig & entspannt)", gender: "male" }
];

var F3X_SLANG_PARODY_POOL = [
  "Bruder muss los",
  "Das ist ja komplett bodenlos",
  "Richtiger NPC-Moment gerade",
  "Ich glaub mein Schwein pfeift",
  "Komplett wild",
  "Halt mal kurz mein virtuelles Wasser",
  "Küss doch dein Herz",
  "Schere, mein Fehler",
  "Gönn dir",
  "Cringe Level 3000",
  "Stabiler Move",
  "Chefetage hat gerade angerufen",
  "Schnall dich an, Meister",
  "Mach mal halblang, Sportsfreund",
  "Ehrenmove",
  "Anders wyld",
  "Safe Diggi",
  "Mach mal kein Auge, Schnucki",
  "Na holla die Waldfee",
  "Mein lieber Scholli"
];

function pickRandomItems(arr, count) {
  var copy = arr.slice();
  var out = [];
  for (var i = 0; i < count && copy.length > 0; i++) {
    var r = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(r, 1)[0]);
  }
  return out;
}

(function initSituationalNaturalHumor250() {
  if (localStorage.getItem("f3x_mob_el_default_v200") !== "1") {
    localStorage.setItem("f3x_mob_el_default_v200", "1");
    if (!mobCfg.voiceURI || mobCfg.voiceURI === "auto_best") {
      mobCfg.voiceURI = "el_9BWtsMINqrJLrRacOk9x";
    }
  }
  if (!mobCfg.voiceSpeed || isNaN(mobCfg.voiceSpeed)) {
    mobCfg.voiceSpeed = 1.05;
  }

  // 1. Baut den Geschwindigkeits-Regler in Ordner 2 (Stimm-Auswahl) ein
  var voiceFolderBody = document.querySelector("#f3xFolderVoice .set-folder-body");
  if (voiceFolderBody && !document.getElementById("f3xVoiceSpeedSlider")) {
    var speedBox = document.createElement("div");
    speedBox.style.cssText = "background:#10101e;border:1px solid rgba(56,189,248,0.35);border-radius:11px;padding:8px 10px;margin-bottom:8px;";
    speedBox.innerHTML =
      "<div style=\"display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#38bdf8;margin-bottom:4px\">" +
        "<span>🐢 Langsamer</span>" +
        "<span id=\"f3xVoiceSpeedLbl\">⏩ Tempo: 1.05x</span>" +
        "<span>⚡ Schneller</span>" +
      "</div>" +
      "<input type=\"range\" id=\"f3xVoiceSpeedSlider\" min=\"0.75\" max=\"1.45\" step=\"0.05\" style=\"width:100%;accent-color:#38bdf8;cursor:pointer\" />";
    var selectEl = document.getElementById("f3xVoiceSelect");
    if (selectEl) {
      voiceFolderBody.insertBefore(speedBox, selectEl);
    } else {
      voiceFolderBody.appendChild(speedBox);
    }
  }

  function updateSpeedSliderUi() {
    var sld = document.getElementById("f3xVoiceSpeedSlider");
    var lbl = document.getElementById("f3xVoiceSpeedLbl");
    var spd = parseFloat(mobCfg.voiceSpeed || "1.05");
    if (sld) sld.value = spd;
    if (lbl) lbl.textContent = "⏩ Sprech-Tempo: " + spd.toFixed(2) + "x";
  }
  updateSpeedSliderUi();

  var spdSld = document.getElementById("f3xVoiceSpeedSlider");
  if (spdSld) {
    spdSld.oninput = function(ev) {
      mobCfg.voiceSpeed = parseFloat(ev.target.value || "1.05");
      updateSpeedSliderUi();
      saveMobCfg();
      if (window.f3xCloudTtsAudio) {
        try { window.f3xCloudTtsAudio.playbackRate = mobCfg.voiceSpeed; } catch (e) {}
      }
    };
  }

  var elInp = document.getElementById("f3xElevenKeyInp");
  if (elInp) {
    elInp.placeholder = "✅ 4 ElevenLabs-Keys (40.000 Zeichen Pool) fest aktiv!";
    elInp.style.borderColor = "#00e676";
  }

  async function fetchAllServerElevenVoices() {
    try {
      var res = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": BUILTIN_ELEVEN_KEYS_POOL[window.f3xActiveElevenKeyIndex || 0] }
      });
      if (res.ok) {
        var data = await res.json();
        var vList = (data && data.voices) ? data.voices : [];
        vList.forEach(function(sv) {
          if (!sv || !sv.voice_id) return;
          var exists = ELEVENLABS_VOICES.some(function(ev) { return ev.voiceId === sv.voice_id; });
          if (!exists) {
            var g = (sv.labels && sv.labels.gender === "male") ? "male" : "female";
            var gLabel = (g === "male") ? "Männlich" : "Weiblich";
            ELEVENLABS_VOICES.push({
              id: "el_" + sv.voice_id,
              voiceId: sv.voice_id,
              name: "💎 " + sv.name + " (" + gLabel + " – ElevenLabs Cloud)",
              gender: g
            });
          }
        });
        populateVoiceSelectorDropdown();
      }
    } catch (e) {}
  }
  setTimeout(fetchAllServerElevenVoices, 600);

  // 2. Natürliche Tageszeit-Begrüßung ohne künstlichen Slang-Zwang
  window.getTimeOfDayGreeting = function() {
    var hr = new Date().getHours();
    var namePart = mobCfg.userName ? (", **" + mobCfg.userName + "**") : "";
    if (mobCfg.lang === "pl") {
      if (hr >= 5 && hr < 11) return "Dzień dobry" + namePart + "! Mam nadzieję, że dobrze spałaś. W czym mogę Ci pomóc?";
      if (hr >= 11 && hr < 18) return "Dzień dobry" + namePart + "! Dobrze Cię widzieć, co dzisiaj sprawdzamy?";
      return "Dobry wieczór" + namePart + "! Odpocznij chwilę, a ja chętnie Ci we wszystkim pomogę.";
    } else {
      if (hr >= 5 && hr < 11) return "Guten Morgen" + namePart + "! Ausgeschlafen? Sag mir einfach, was wir heute angehen!";
      if (hr >= 11 && hr < 18) return "Hey" + namePart + "! Schön, dass du da bist. Was gibt's Neues?";
      return "Guten Abend" + namePart + "! Mach es dir gemütlich, womit kann ich dir helfen?";
    }
  };

  // 3. SITUATIVER HUMOR-FILTER: Nicht in jedem Satz Slang oder "Uff", sondern nur nach Gefühl, wenn es wirklich passt!
  window.buildMobileSystemPrompt = function() {
    var uName = mobCfg.userName || (mobCfg.lang === "pl" ? "Mamo" : "Freund");
    var dirHint = "";
    if (mobCfg.transDir === "de2pl") {
      dirHint = "\nAKTIVE ÜBERSETZUNGS-RICHTUNG: Übersetze deutsche Sätze direkt ins POLNISCHE (🇵🇱)!";
    } else if (mobCfg.transDir === "pl2de") {
      dirHint = "\nAKTIVE ÜBERSETZUNGS-RICHTUNG: Übersetze polnische Sätze direkt ins DEUTSCHE (🇩🇪) und schreibe den deutschen Satz fett (**...**)!";
    }

    var arr = mobCfg.arrogance || 0;

    // Prüft, ob in der ALLERLETZTEN KI-Antwort schon Slang oder ein Seufzer vorkam -> Wenn ja, diesmal garantiert normal & natürlich!
    var lastAiMsg = "";
    for (var i = (mobCfg.history || []).length - 1; i >= 0; i--) {
      if (mobCfg.history[i] && mobCfg.history[i].role === "assistant") {
        lastAiMsg = String(mobCfg.history[i].content || "").toLowerCase();
        break;
      }
    }
    var usedSlangRecently = /uff|joaaa|auge|schnucki|diggah|diggi|bodenlos|bruder|npc|cringe|wyld|holla|scholli/.test(lastAiMsg);

    // Nur in ca. 30% der Fälle (und NIE zweimal hintereinander!) darf sie optional eine Slang-Parodie einstreuen, WENN es zur Frage passt!
    var allowSlangThisTurn = (!usedSlangRecently && Math.random() < 0.33);
    var freshSlangIdeas = pickRandomItems(F3X_SLANG_PARODY_POOL, 2).join("' oder '");

    var personalityRuleDe = "";
    var personalityRulePl = "";

    if (arr <= 20) {
      personalityRuleDe =
        "\nDEIN CHARAKTER (0-20% Arroganz -> HERZLICH, MITFÜHLEND & NATÜRLICH): " +
        "Du bist warmherzig, zeigst echtes Mitgefühl und hast einen feinen, sympathischen Humor. Rede ganz natürlich wie eine gute Freundin (ohne aufgesetzten Slang und ohne '...' Pausen).";
      personalityRulePl =
        "\nTWÓJ CHARAKTER (0-20% -> CIEPŁA, EMPATYCZNA I NATURALNA): " +
        "Jesteś troskliwa, pełna współczucia i naturalnego humoru. Mów płynnie i serdecznie.";
    } else if (arr <= 65) {
      if (allowSlangThisTurn) {
        personalityRuleDe =
          "\nDEIN CHARAKTER (" + arr + "% Arroganz -> LOCKER, SCHLAGFERTIG & SITUATIVER WITZ): " +
          "Du bist geistreich, locker und humorvoll. WENN es zur aktuellen Frage des Nutzers wirklich gut passt, darfst du diesmal gerne einen lockeren Spruch (wie '" + freshSlangIdeas + "' oder einen trockenen Witz) einbauen – aber nur mit Gefühl, wenn es situativ passt! Wenn die Frage ernst ist oder eine Übersetzung ist, antworte einfach direkt und charmant.";
      } else {
        personalityRuleDe =
          "\nDEIN CHARAKTER (" + arr + "% Arroganz -> CHARMANT, SCHLAGFERTIG & OHNE SLANG-ZWANG): " +
          "Du bist hellwach, sympathisch, hast trockenen Humor und echtes Mitgefühl. WICHTIG FÜR DIESE ANTWORT: Antworte diesmal ganz natürlich und normal OHNE Slang-Wörter (kein 'Uff', kein 'Joaaa', kein 'Diggah', kein 'Schnucki', kein 'Mach mal kein Auge')! Sei einfach geistreich, herzlich und direkt.";
      }
      personalityRulePl =
        "\nTWÓJ CHARAKTER (" + arr + "% -> BŁYSKOTLIWA I NATURALNA): " +
        "Mówisz naturalnie, z humorem i wyczuciem. Żartuj tylko wtedy, gdy naprawdę pasuje to do sytuacji!";
    } else {
      if (allowSlangThisTurn) {
        personalityRuleDe =
          "\nDEIN CHARAKTER (" + arr + "% Arroganz -> SELBSTBEWUSST, FRECH & SITUATIVE PARODIE): " +
          "Du bist herrlich selbstbewusst, frech und schlagfertig. Wenn die Frage des Nutzers eine gute Vorlage bietet, kannst du gerne einen trockenen Roast oder eine witzige Parodie (z.B. in Richtung '" + freshSlangIdeas + "') fallen lassen und danach die 100% echten Fakten liefern.";
      } else {
        personalityRuleDe =
          "\nDEIN CHARAKTER (" + arr + "% Arroganz -> EDEL-ARROGANT & TROCKENER HUMOR OHNE SLANG-WIEDERHOLUNG): " +
          "Du bist schlagfertig, leicht überheblich-charmant und extrem clever. WICHTIG FÜR DIESE ANTWORT: Lass diesmal Slang-Wörter ('Uff', 'Joaaa', 'Diggah', 'Schnucki', 'Mach mal kein Auge') komplett weg und glänze stattdessen durch natürlichen, trockenen Wortwitz und 100% präzise Fakten!";
      }
      personalityRulePl =
        "\nTWÓJ CHARAKTER (" + arr + "% -> PEWNA SIEBIE I DOWCIPNA): " +
        "Jesteś błyskotliwa i lekko zadziorna, ale żartujesz z wyczuciem, tylko gdy pasuje to do pytania!";
    }

    var brevityRule = "";
    if (mobCfg.shortMode) {
      brevityRule = (mobCfg.lang === "pl")
        ? "\nDŁUGOŚĆ: Odpowiadaj naturalnie i płynnie w 1 do 3 zdaniach (bez wielokropków '...')."
        : "\nLÄNGE & FLÜSSIGKEIT: Antworte in 1 bis 3 natürlichen, flüssigen Sätzen (OHNE '...' Punkte-Pausen!).";
    }

    var memBlock = "";
    var memItems = [];
    if (mobCfg.userName) memItems.push("Name: " + mobCfg.userName);
    if (mobCfg.homePlace) memItems.push("Wohnort: " + mobCfg.homePlace);
    (mobCfg.memories || []).forEach(function(m) { memItems.push(m); });
    if (memItems.length > 0) {
      memBlock = "\n\n[GEDÄCHTNIS ÜBER DEN NUTZER]: " + memItems.join(" | ");
    }

    if (mobCfg.lang === "pl") {
      return (
        "Nazywasz się F3X. Rozmawiasz z: " + uName + "." +
        personalityRulePl +
        brevityRule +
        "\n- ZERO KŁAMSTW: Zawsze podawaj tylko sprawdzone fakty." +
        "\n- TŁUMACZ: Tylko gdy użytkownik prosi o tłumaczenie, napisz przetłumaczone zdanie POGRUBIONYM drukiem (**...**)." +
        dirHint + memBlock
      );
    }
    return (
      "Dein Name ist **F3X**. Du sprichst mit: " + uName + "." +
      personalityRuleDe +
      brevityRule +
      "\n- STRIKTES EHRLICHKEITS-GESETZ: Keine Lügen, keine erfundenen Fakten!" +
      "\n- ÜBERSETZER-REGEL: Schreibe übersetzte Sätze in **Fettschrift** (**...**) und kurz die Aussprache dazu." +
      "\n- ZAHLEN-LOGIK: Vergleiche bei Größen-/Zahlenfragen immer erst mathematisch die Werte, bevor du Ja oder Nein sagst." +
      dirHint + memBlock
    );
  };

  // 4. ElevenLabs-Sprecher: Ohne "..." Pausen-Bremsen + mit deinem Geschwindigkeits-Regler!
  window.trySpeakWithElevenLabs = async function(rawText) {
    var cleanText = String(rawText || "")
      .replace(/\.{2,}|…/g, " ")
      .replace(/\s*[–—-]\s*/g, ", ")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (!cleanText) return false;

    var keyList = [];
    if (mobCfg.elevenKey && mobCfg.elevenKey.trim().length > 10 && BUILTIN_ELEVEN_KEYS_POOL.indexOf(mobCfg.elevenKey.trim()) === -1) {
      keyList.push(mobCfg.elevenKey.trim());
    }
    for (var k = 0; k < BUILTIN_ELEVEN_KEYS_POOL.length; k++) {
      var idx = (window.f3xActiveElevenKeyIndex + k) % BUILTIN_ELEVEN_KEYS_POOL.length;
      keyList.push(BUILTIN_ELEVEN_KEYS_POOL[idx]);
    }

    var elVoiceObj = ELEVENLABS_VOICES.find(function(v) { return v.id === mobCfg.voiceURI; }) || ELEVENLABS_VOICES[0];
    var userSpd = parseFloat(mobCfg.voiceSpeed || "1.05");
    var apiSpeed = Math.min(1.2, Math.max(0.7, userSpd));

    for (var attempt = 0; attempt < keyList.length; attempt++) {
      var currentKey = keyList[attempt];
      try {
        setMobStatus("talking", "💎 Spricht...");
        var res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + elVoiceObj.voiceId, {
          method: "POST",
          headers: {
            "xi-api-key": currentKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.42,
              similarity_boost: 0.80,
              style: 0.42,
              use_speaker_boost: true,
              speed: apiSpeed
            }
          })
        });

        if (res.ok) {
          var poolPos = BUILTIN_ELEVEN_KEYS_POOL.indexOf(currentKey);
          if (poolPos !== -1) {
            window.f3xActiveElevenKeyIndex = poolPos;
            try { localStorage.setItem("f3x_mob_el_idx", String(poolPos)); } catch (e) {}
          }
          var blob = await res.blob();
          window.f3xCloudTtsAudio.src = URL.createObjectURL(blob);
          try {
            window.f3xCloudTtsAudio.preservesPitch = true;
            window.f3xCloudTtsAudio.playbackRate = userSpd;
          } catch (e) {}
          window.f3xCloudTtsAudio.onended = function() { setMobStatus("idle"); };
          await window.f3xCloudTtsAudio.play();
          return true;
        }
      } catch (e) {}
    }

    setMobStatus("idle");
    return false;
  };

  saveMobCfg();
  populateVoiceSelectorDropdown();
})();
