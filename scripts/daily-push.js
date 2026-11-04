// Günlük bildirim: GitHub Actions her gün çalıştırır, OneSignal üzerinden
// her kullanıcıya kendi saatine ve diline göre günde 5 not gönderir:
// 09:00 halini sorma, 12:00 bebeğin haftası, 15:00 günün bilgisi, 18:00 motivasyon, 21:00 iyi geceler;
// ilk trimesterde ayrıca 10:30 ve 20:30'da folik asit hatırlatması.
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

const GECE = {
  tr: ["İyi geceler anne 🌙 Bugün de bebeğin için harika bir iş çıkardın.", "Yatmadan önce sol tarafına yatmak hem sana hem bebeğine iyi gelir 🌙", "Bugünü nasıl geçirdin? Yediklerini eklemeyi unutma, sonra güzelce dinlen 💗", "Gün bitti, sen yine kocaman bir sevgiyle büyüttün onu. Tatlı rüyalar 🌙"],
  en: ["Good night, mum 🌙 You did a wonderful job for your baby today too.", "Sleeping on your left side before bed is good for you and your baby 🌙", "How was your day? Don't forget to log your meals, then rest well 💗", "The day is over and you nurtured your baby with so much love again. Sweet dreams 🌙"],
  de: ["Gute Nacht, Mama 🌙 Du hast heute wieder Großartiges für dein Baby getan.", "Auf der linken Seite zu schlafen tut dir und deinem Baby gut 🌙", "Wie war dein Tag? Vergiss nicht, deine Mahlzeiten einzutragen, dann ruh dich gut aus 💗", "Der Tag ist vorbei und du hast dein Baby wieder mit so viel Liebe genährt. Süße Träume 🌙"],
  ar: ["تصبحين على خير يا أمي 🌙 لقد قمتِ اليوم أيضاً بعمل رائع من أجل طفلكِ.", "النوم على جانبكِ الأيسر قبل النوم مفيد لكِ ولطفلكِ 🌙", "كيف كان يومكِ؟ لا تنسي تسجيل وجباتكِ، ثم استريحي جيداً 💗", "انتهى اليوم وقد غذّيتِ طفلكِ بالكثير من الحب مرة أخرى. أحلاماً سعيدة 🌙"],
  ru: ["Спокойной ночи, мама 🌙 Сегодня ты снова сделала для малыша так много.", "Спать на левом боку полезно и тебе, и малышу 🌙", "Как прошёл твой день? Не забудь записать, что ела, и хорошо отдохни 💗", "День закончился, и ты снова окружила малыша такой любовью. Сладких снов 🌙"],
};

// İlk trimesterde folik asit hatırlatması (sabah / akşam)
const FOLIK = {
  tr: ["💊 Folik asidini aldın mı? Bebeğinin sinir sistemi için bu ilk aylar çok önemli.", "💊 Küçük bir hatırlatma: bugünkü folik asidini unutma 💗"],
  en: ["💊 Have you taken your folic acid? These first months are vital for your baby's nervous system.", "💊 A gentle reminder: don't forget today's folic acid 💗"],
  de: ["💊 Hast du deine Folsäure genommen? Diese ersten Monate sind für das Nervensystem deines Babys sehr wichtig.", "💊 Kleine Erinnerung: Vergiss deine Folsäure für heute nicht 💗"],
  ar: ["💊 هل تناولتِ حمض الفوليك؟ هذه الأشهر الأولى مهمة جداً للجهاز العصبي لطفلكِ.", "💊 تذكير لطيف: لا تنسي حمض الفوليك اليوم 💗"],
  ru: ["💊 Ты приняла фолиевую кислоту? Первые месяцы очень важны для нервной системы малыша.", "💊 Небольшое напоминание: не забудь сегодняшнюю фолиевую кислоту 💗"],
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
// Haftalık mesaj gün gün döner: 0 boyut, 1 bebek, 2 anne, 3 ipucu
function hafta(l, n, k) {
  const h = HAFTALAR[n], c = (I18N[l] && I18N[l].weeks || {})[n];
  const alan = ["boyut", "bebek", "anne", "ipucu"][k % 4];
  const deger = l !== "tr" && c ? c[["boyut", "bebek", "anne", "ipucu"].indexOf(alan)] || h[alan] : h[alan];
  if (alan === "boyut") return ui(l, "baby_this_week") + ": " + ui(l, "size_like").replace("{x}", deger) + " " + h.e;
  return deger;
}
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

async function gonder(ad, saat, baslik, metin, filtre) {
  const govde = {
    app_id: APP_ID, target_channel: "push", filters: filtre,
    headings: baslik, contents: metin,
    web_url: SITE, chrome_web_icon: SITE + "icons/icon-192.png",
    delayed_option: "timezone", delivery_time_of_day: saat,
  };
  if (KURU) { console.log(`[KURU] ${saat} ${ad}\n  ${JSON.stringify(filtre)}\n  TR: ${baslik.tr} | ${metin.tr}\n  EN: ${metin.en}`); return; }
  const r = await fetch("https://api.onesignal.com/notifications?c=push", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: "Key " + KEY }, body: JSON.stringify(govde),
  });
  const j = await r.json().catch(() => ({}));
  console.log(`${ad}: ${r.status} ${JSON.stringify(j)}`);
  if (!r.ok) process.exitCode = 1;
}

async function main() {
  if (!KURU && !KEY) { console.error("ONESIGNAL_API_KEY tanımlı değil (Settings → Secrets and variables → Actions)."); process.exit(1); }
  // Tür ve kullanıcının yerel saatiyle gönderim zamanı; TUR verilirse yalnızca o tür gider
  const PLAN = [["halin", "9:00AM"], ["folik-sabah", "10:30AM"], ["hafta", "12:00PM"], ["bilgi", "3:00PM"], ["motivasyon", "6:00PM"], ["folik-aksam", "8:30PM"], ["gece", "9:00PM"]];
  const secili = PLAN.filter(([tur]) => !process.env.TUR || tur.startsWith(process.env.TUR));
  const i = BUGUN;
  const uygulama = dilHer(() => "Wait for Me, Mom");
  console.log(`Gün ${BUGUN}, türler: ${secili.map((p) => p[0]).join(", ")}${KURU ? " (kuru çalıştırma)" : ""}`);

  for (const [tur, saat] of secili) {
    if (tur === "halin") await gonder("halin", saat, uygulama, dilHer((l) => HALIN[l][i % HALIN[l].length]), HERKES);
    if (tur.startsWith("folik")) await gonder(tur, saat, uygulama, dilHer((l) => FOLIK[l][tur === "folik-sabah" ? 0 : 1]), aralik(0, 97));
    if (tur === "gece") await gonder("gece", saat, uygulama, dilHer((l) => GECE[l][i % GECE[l].length]), HERKES);
    if (tur === "motivasyon") await gonder("motivasyon", saat, uygulama, dilHer((l) => "💗 " + kisalt(mot(l, i), 170)), HERKES);
    if (tur === "hafta") {
      for (let n = 1; n <= 40; n++) {
        const gMin = n === 1 ? 0 : n * 7, gMax = n === 40 ? 300 : n * 7 + 6;
        await gonder("hafta " + n, saat, dilHer((l) => "👶 " + ui(l, "week_n").replace("{n}", n)), dilHer((l) => kisalt(hafta(l, n, i), 170)), aralik(gMin, gMax));
      }
    }
    if (tur === "bilgi") {
      const trim = { 1: [0, 97], 2: [98, 195], 3: [196, 300] };
      for (const tri of [1, 2, 3]) {
        await gonder("bilgi T" + tri, saat, dilHer((l) => temiz(ui(l, "tip_of_day"))), dilHer((l) => kisalt(bilgi(l, tri, i), 170)), aralik(...trim[tri]));
      }
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
