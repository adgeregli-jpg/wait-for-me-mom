// Günlük bildirim: GitHub Actions her gün çalıştırır, OneSignal üzerinden
// her kullanıcıya kendi saatine göre 10:00'da, kendi dilinde bir not gönderir.
// Mesaj türü günden güne döner: halini sorma, bebeğin haftası, motivasyon, günün bilgisi.
// Ortam: ONESIGNAL_API_KEY (gizli), KURU=true ise göndermeden sadece yazdırır, TUR ile tür zorlanabilir.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP_ID = "e63cede8-0c4a-4595-95e1-b879a9464c34";
const SITE = "https://adgeregli-jpg.github.io/wait-for-me-mom/";
const DILLER = ["tr", "en", "de", "ar", "ru"];
const KURU = process.env.KURU === "true";
const KEY = process.env.ONESIGNAL_API_KEY || "";

// Uygulamanın içerik dosyalarını tarayıcıdaki gibi yükle
const kok = path.join(__dirname, "..");
const dosyalar = ["js/foods.js", "js/weeks.js", "js/content.js", "js/i18n.js", "js/lang/en.js", "js/lang/de.js", "js/lang/ar.js", "js/lang/ru.js"];
const kod = dosyalar.map((f) => fs.readFileSync(path.join(kok, f), "utf8")).join("\n;\n") + "\n;({ HAFTALAR, MOTIVASYON, GUNUN_BILGISI, I18N });";
const { HAFTALAR, MOTIVASYON, GUNUN_BILGISI, I18N } = vm.runInNewContext(kod, {});

const HALIN = {
  tr: ["Bugün nasılsın? 💗 Bebeğinle birlikte günün nasıl geçiyor, bir bakalım mı?", "Bugün kendine iyi baktın mı? Su içmeyi ve bir ara öğünü unutma 🍎", "Merhaba anne! Bugün neler yedin? Günlüğüne eklemek bir dakika sürer 📝", "Biraz dinlen, derin bir nefes al. Bebeğin seni hissediyor 🌿"],
  en: ["How are you today? 💗 Shall we see how your day with your baby is going?", "Have you looked after yourself today? Don't forget water and a healthy snack 🍎", "Hello, mum! What have you eaten today? Logging it takes just a minute 📝", "Rest a little and take a deep breath. Your baby can feel you 🌿"],
  de: ["Wie geht es dir heute? 💗 Wollen wir schauen, wie dein Tag mit deinem Baby läuft?", "Hast du heute gut für dich gesorgt? Denk ans Trinken und an einen gesunden Snack 🍎", "Hallo, Mama! Was hast du heute gegessen? Eintragen dauert nur eine Minute 📝", "Ruh dich etwas aus und atme tief durch. Dein Baby spürt dich 🌿"],
  ar: ["كيف حالكِ اليوم؟ 💗 هل نلقي نظرة على يومكِ مع طفلكِ؟", "هل اعتنيتِ بنفسكِ اليوم؟ لا تنسي شرب الماء ووجبة خفيفة صحية 🍎", "مرحباً يا أمي! ماذا أكلتِ اليوم؟ تسجيله يستغرق دقيقة واحدة فقط 📝", "استريحي قليلاً وخذي نفساً عميقاً. طفلكِ يشعر بكِ 🌿"],
  ru: ["Как ты сегодня? 💗 Посмотрим, как проходит твой день с малышом?", "Ты сегодня позаботилась о себе? Не забудь про воду и полезный перекус 🍎", "Привет, мама! Что ты сегодня ела? Записать займёт всего минуту 📝", "Отдохни немного и сделай глубокий вдох. Малыш чувствует тебя 🌿"],
};

const temiz = (s) => String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
function kisalt(s, max) {
  s = temiz(s);
  if (s.length <= max) return s;
  const kes = s.slice(0, max);
  const nokta = Math.max(kes.lastIndexOf(". "), kes.lastIndexOf("! "), kes.lastIndexOf("؟ "), kes.lastIndexOf("? "));
  return nokta > max * 0.5 ? kes.slice(0, nokta + 1) : kes.slice(0, kes.lastIndexOf(" ")) + "…";
}
const ui = (l, k) => (I18N[l] && I18N[l].ui && I18N[l].ui[k]) || I18N.tr.ui[k];
const dilHer = (fn) => Object.fromEntries(DILLER.map((l) => [l, fn(l)]));
function hafta(l, n) { return l === "tr" ? HAFTALAR[n].bebek : ((I18N[l].weeks || {})[n] || [])[1] || HAFTALAR[n].bebek; }
function mot(l, i) { const a = l === "tr" ? MOTIVASYON.genel : ((I18N[l].mot || {}).genel || MOTIVASYON.genel); return a[i % a.length]; }
function bilgi(l, tri, i) { const a = l === "tr" ? GUNUN_BILGISI[tri] : ((I18N[l].tips || {})[tri] || GUNUN_BILGISI[tri]); return a[i % a.length]; }

// Gebelik günü aralığı → sat_gun etiketi filtresi
const BUGUN = Math.floor(Date.now() / 86400000);
function aralik(gMin, gMax) {
  return [
    { field: "tag", key: "sat_gun", relation: ">", value: String(BUGUN - gMax - 1) },
    { field: "tag", key: "sat_gun", relation: "<", value: String(BUGUN - gMin + 1) },
  ];
}
const HERKES = [{ field: "tag", key: "sat_gun", relation: "exists" }];

async function gonder(ad, baslik, metin, filtre) {
  const govde = {
    app_id: APP_ID, target_channel: "push", filters: filtre,
    headings: baslik, contents: metin,
    web_url: SITE, chrome_web_icon: SITE + "icons/icon-192.png",
    delayed_option: "timezone", delivery_time_of_day: "10:00AM",
  };
  if (KURU) { console.log(`[KURU] ${ad}\n  ${JSON.stringify(filtre)}\n  TR: ${baslik.tr} | ${metin.tr}\n  EN: ${metin.en}`); return; }
  const r = await fetch("https://api.onesignal.com/notifications?c=push", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: "Key " + KEY }, body: JSON.stringify(govde),
  });
  const j = await r.json().catch(() => ({}));
  console.log(`${ad}: ${r.status} ${JSON.stringify(j)}`);
  if (!r.ok) process.exitCode = 1;
}

async function main() {
  if (!KURU && !KEY) { console.error("ONESIGNAL_API_KEY tanımlı değil (Settings → Secrets and variables → Actions)."); process.exit(1); }
  const TURLER = ["halin", "hafta", "motivasyon", "bilgi"];
  const tur = TURLER.includes(process.env.TUR) ? process.env.TUR : TURLER[BUGUN % 4];
  const i = Math.floor(BUGUN / 4);
  const uygulama = dilHer(() => "Wait for Me, Mom");
  console.log(`Gün ${BUGUN}, tür: ${tur}${KURU ? " (kuru çalıştırma)" : ""}`);

  if (tur === "halin") await gonder("halin", uygulama, dilHer((l) => HALIN[l][i % HALIN[l].length]), HERKES);
  if (tur === "motivasyon") await gonder("motivasyon", uygulama, dilHer((l) => "💗 " + kisalt(mot(l, i), 170)), HERKES);
  if (tur === "hafta") {
    for (let n = 1; n <= 40; n++) {
      const gMin = n === 1 ? 0 : n * 7, gMax = n === 40 ? 300 : n * 7 + 6;
      await gonder("hafta " + n, dilHer((l) => "👶 " + ui(l, "week_n").replace("{n}", n)), dilHer((l) => kisalt(hafta(l, n), 170)), aralik(gMin, gMax));
    }
  }
  if (tur === "bilgi") {
    const trim = { 1: [0, 97], 2: [98, 195], 3: [196, 300] };
    for (const tri of [1, 2, 3]) {
      await gonder("bilgi T" + tri, dilHer((l) => temiz(ui(l, "tip_of_day"))), dilHer((l) => kisalt(bilgi(l, tri, i), 170)), aralik(...trim[tri]));
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
