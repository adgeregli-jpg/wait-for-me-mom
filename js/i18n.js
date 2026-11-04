// Çok dil altyapısı. Türkçe içerik foods.js / weeks.js / content.js içindeki temel veridir;
// diğer diller js/lang/*.js dosyalarında I18N.<kod> altında çevirileri verir.

const DILLER = [
  { kod: "tr", ad: "Türkçe", bayrak: "🇹🇷", locale: "tr-TR", dir: "ltr" },
  { kod: "en", ad: "English", bayrak: "🇬🇧", locale: "en-GB", dir: "ltr" },
  { kod: "de", ad: "Deutsch", bayrak: "🇩🇪", locale: "de-DE", dir: "ltr" },
  { kod: "ar", ad: "العربية", bayrak: "🇸🇦", locale: "ar-u-nu-latn", dir: "rtl" },
  { kod: "ru", ad: "Русский", bayrak: "🇷🇺", locale: "ru-RU", dir: "ltr" },
];

const I18N = {};

I18N.tr = {
  ui: {
    app_sub: "Gebelik ve Beslenme Takibi",
    producer: "Yapımcı: Gökhan Atalar",
    nav_today: "Bugün", nav_food: "Beslenme", nav_baby: "Bebeğim", nav_diet: "Diyetler", nav_me: "Ben",
    week_day: "{w}. hafta {d}. gün", trimester_n: "{n}. trimester", weeks_label: "hafta",
    greet_morning: "Günaydın", greet_day: "İyi günler", greet_evening: "İyi akşamlar", mom_default: "anneciğim",
    days_to_birth: "Doğuma {n} gün", percent_done: "%{n} tamamlandı",
    baby_this_week: "Bebeğin bu hafta", size_like: "{x} kadar", length: "Boy", weight: "Ağırlık",
    all_week_info: "Haftanın tüm bilgileri →", tip_of_day: "💡 Günün bilgisi", week_tip: "Bu haftanın ipucu",
    todays_nutrition: "Bugünkü beslenmen", add_food_btn: "+ Yemek ekle",
    energy_today: "Bugünkü enerji", energy_day: "Bu günün enerjisi",
    st_none: "Henüz giriş yok", st_low: "Eksik kalori", st_high: "Fazla kalori", st_good: "Dengede",
    kcal_left: "Hedefe <b>{n} kcal</b> kaldı.", kcal_over: "Hedefin <b>{n} kcal</b> üzerinde.", kcal_ok: "Tam kararında! 🌿",
    kcal_empty: "Yediklerini ekledikçe burada göreceksin.", protein: "Protein",
    caffeine: "☕ Kafein", caffeine_over: "Sınır aşıldı",
    avoid_alert: "⚠️ Bugün gebelikte önerilmeyen bir besin eklendi: <b>{x}</b>. Endişelenme, sadece bilgin olsun; sorun olursa doktoruna danış.",
    nut_goals: "Besin öğesi hedefleri", done_of: "{a} / {b} tamam", portions: "porsiyon",
    nut_hint: "Bir karta dokunarak ne işe yaradığını ve hangi besinlerde bulunduğunu görebilirsin.",
    water: "💧 Su", glasses: "<b>{n}</b> / 8-10 bardak", glass_n: "{n}. bardak",
    water_done: "Harika, sıvı hedefini tamamladın! 💧", water_hint: "Kabızlık, ödem ve idrar yolu enfeksiyonuna karşı bol su iç.", water_toast: "Su hedefin tamam! 💧",
    benefit_title: "Neye iyi gelir?", sources_title: "Nerelerde bulunur?", supplement_note: "Takviye (ilaç) kullanımı için mutlaka doktoruna danış.",
    emergency_title: "🚑 Hemen doktora başvur", emergency_btn: "Belirtileri gör", emergency_sub: "Bazı belirtiler beklemeden tıbbi yardım gerektirir.",
    emergency_modal: "🚑 Acil belirtiler", emergency_intro: "Aşağıdakilerden biri olursa <b>beklemeden</b> doktoruna ya da en yakın acile başvur (112):",
    disclaimer: "Wait for Me, Mom uygulamasındaki tüm bilgiler, kalori hedefleri ve diyet önerileri genel bilgilendirme amaçlıdır; tıbbi tavsiye değildir. Kişisel ihtiyaçların için doktoruna ve diyetisyenine danış.",
    today: "Bugün", yesterday: "Dün", add_small: "+ Ekle", nothing_added: "Henüz bir şey eklenmedi",
    meal_kahvalti: "Kahvaltı", meal_ogle: "Öğle", meal_aksam: "Akşam", meal_ara: "Ara öğünler",
    unknown: "Bilinmeyen", tag_avoid: "Önerilmez", tag_caution: "Dikkat", delete: "Sil",
    add_title: "{m} · ekle", search_ph: "Ara: mercimek, yoğurt, köfte...", no_results: "Sonuç bulunamadı. Aşağıdan kendin ekleyebilirsin.",
    custom_btn: "Listede yok mu? Kendin ekle",
    portion_one: "1 porsiyon: {p}", protein_g: "{n} g protein", how_much: "Ne kadar yedin?", portion_word: "porsiyon",
    add: "Ekle", update: "Güncelle",
    toast_avoid: "Eklendi. Bu besin gebelikte önerilmiyor, bilgin olsun. 💗", toast_goal: "{x} hedefi tamam! {m}", toast_added: "{x} eklendi ✓",
    custom_title: "Kendi besinini ekle", custom_name: "Besin adı", custom_name_ph: "Örn. Annemin dolması", custom_portion: "Porsiyon",
    custom_portion_ph: "1 porsiyon", custom_kcal: "Kalori (kcal)", custom_protein: "Protein (g)",
    custom_hint: "Kalorisini bilmiyorsan paketin üzerindeki etikete ya da benzer bir yemeğe bakabilirsin.", custom_save: "Kaydet ve ekle", custom_err: "Lütfen ad ve kaloriyi gir.",
    week_n: "{n}. hafta", you_are_here: "şu an buradasın 💗", q_baby: "Bebeğinde neler oluyor?", q_mom: "Sende neler oluyor?",
    tri_guide: "Trimester rehberi", tri_common: "Sık görülenler", tri_food: "Beslenme", tri_checks: "Kontroller & testler",
    diet_title: "🥗 Örnek gebe menüleri",
    diet_note: "Bu menüler <b>tavsiye niteliğindedir</b>; kişisel hastalık, alerji ve gebelik şekeri gibi durumlarda diyetisyenine danış. Senin için tahmini günlük hedef: <b>{k} kcal</b> ({t}).",
    add_whole_menu: "Bu menünün tamamını bugüne ekle", add_to_today: "Bugüne ekle",
    principles_title: "🍽️ Genel gebe beslenme ilkeleri",
    principles: ["Günde 3 ana + 2-3 ara öğün; öğün atlama.", "Her öğünde bir protein (yumurta, et, baklagil, süt ürünü) bulunsun.", "Tabağının yarısı sebze/meyve, dörtte biri tam tahıl, dörtte biri protein olsun.", "Günde 2-3 porsiyon süt/yoğurt/peynir.", "Haftada 2 kez civası düşük balık.", "Çay ve kahveyi yemekten 1 saat sonra iç; kafein günde 200 mg'ı aşmasın.", "Çiğ et, çiğ süt, az pişmiş yumurta, çiğ balık ve alkolden uzak dur.", "Tuzu ve şekerli içecekleri azalt."],
    menu_added: "Menü bugünkü günlüğüne eklendi ✓", meal_added: "{x} bugüne eklendi ✓",
    last7: "📊 Son 7 gün", leg_good: "Dengede", leg_low: "Eksik", leg_high: "Fazla", leg_target: "- - Hedef",
    no_week_data: "Henüz bu hafta için kayıt yok. Yediklerini ekledikçe burada haftalık dengeni göreceksin.",
    avg_n: "{n} günlük ortalama", balanced_days: "{n} gün dengedeydin.",
    weight_title: "⚖️ Kilo takibi", weight_today: "Bugünkü kilon (kg)", save: "Kaydet",
    weight_info: "Gebelik öncesi: <b>{w} kg</b> · BKİ: <b>{b}</b> ({c}) · Önerilen toplam artış: <b>{r} kg</b>", so_far: " · Şu ana kadar: <b>{n} kg</b>",
    leg_range: "Önerilen aralık (IOM)", leg_you: "Senin kilon", records: "Kayıtlar ({n})",
    weight_err: "Lütfen geçerli bir kilo gir.", weight_saved: "Kilon kaydedildi ✓",
    bmi_under: "Zayıf", bmi_normal: "Normal", bmi_over: "Fazla kilolu", bmi_obese: "Obez",
    weight_hint: "Haftada bir, aynı saatte (tercihen sabah, aç karnına) tartılıp kaydetmen önerilir.",
    weight_low: "Şu an önerilen aralığın biraz altındasın. Öğün atlamamaya ve ara öğün eklemeye özen göster; bir sonraki kontrolünde doktoruna da sorabilirsin.",
    weight_high: "Şu an önerilen aralığın biraz üzerindesin. Endişelenme; şekerli içecekleri azaltmak ve kısa yürüyüşler iyi gelebilir. Gebelikte diyet yapmak yerine dengeli beslenme önerilir; doktoruna danış.",
    weight_ok: "Kilo artışın önerilen aralıkta. Harika gidiyorsun! 🌿", wk_axis: "{n}. hf",
    theme_title: "🎨 Tema", th_pudra: "Pudra", th_lavanta: "Lavanta", th_nane: "Nane", th_seftali: "Şeftali", th_gece: "Gece",
    lang_title: "🌐 Dil",
    profile_title: "👤 Profilim", f_name: "Ad", f_age: "Yaş", f_height: "Boy", f_pre: "Gebelik öncesi", f_due: "Tahmini doğum", f_goal: "Günlük hedef",
    formula_note: "Kalori hedefi: Mifflin-St Jeor formülüyle hesaplanan bazal ihtiyaç × aktivite katsayısı + trimester eki (0 / +340 / +450 kcal).",
    twin_note: "Çoğul gebelikte ihtiyaç daha yüksektir; hedefini mutlaka doktorunla belirle.",
    edit_profile: "Profili düzenle", download_data: "Verilerimi indir",
    welcome_text: "Gebelik yolculuğunda her gün yanındayım: bebeğinin gelişimi, beslenmen ve sana iyi gelecek küçük hatırlatmalar. Önce seni biraz tanıyayım.",
    edit_profile_title: "Profili düzenle", your_name: "Adın (isteğe bağlı)", name_ph: "Adın",
    age: "Yaş", height_cm: "Boy (cm)", pre_weight: "Gebelik öncesi kilo", which_date: "Hangi tarihi biliyorsun?",
    lmp: "Son adet tarihi", edd: "Tahmini doğum tarihi", lmp_label: "Son adetinin ilk günü", edd_label: "Doktorunun söylediği tahmini doğum tarihi",
    activity: "Günlük hareket düzeyin", act_1: "Hareketsiz (çoğunlukla oturarak)", act_2: "Hafif aktif (hafif yürüyüş, ev işleri)", act_3: "Orta aktif (düzenli yürüyüş / egzersiz)",
    twins: "İkiz / çoğul gebelik", start: "Başlayalım 💗", local_note: "Verilerin yalnızca bu cihazda saklanır.",
    err_age: "Lütfen yaşını kontrol et.", err_height: "Lütfen boyunu cm olarak gir.", err_weight: "Lütfen kilonu kontrol et.", err_date: "Lütfen tarihi seç.",
    err_future: "Son adet tarihi gelecekte olamaz.", err_old: "Tarih çok eski görünüyor, lütfen kontrol et.",
    welcome_toast: "Hoş geldin! Bu yolculukta hep yanındayım 💗", profile_updated: "Profil güncellendi ✓", close: "Kapat",
    mt_kahvalti: "Kahvaltı", mt_ara: "Ara öğün", mt_ogle: "Öğle", mt_aksam: "Akşam", mt_gece: "Gece",
  },
};

// ---- Yardımcılar ----
let AKTIF_DIL = "tr";
function dilBilgi() { return DILLER.find((d) => d.kod === AKTIF_DIL) || DILLER[0]; }
function L() { return I18N[AKTIF_DIL] || I18N.tr; }
function t(anahtar, deg) {
  let s = (L().ui && L().ui[anahtar]);
  if (s == null) s = I18N.tr.ui[anahtar];
  if (s == null) return anahtar;
  if (deg && typeof s === "string") Object.keys(deg).forEach((k) => { s = s.split("{" + k + "}").join(deg[k]); });
  return s;
}
// İçerik çevirileri: bulunamazsa Türkçe temel veri kullanılır
function besinMetni(b) {
  const c = L().foods && L().foods[b.id];
  if (!c) return b;
  return Object.assign({}, b, { ad: c[0] || b.ad, porsiyon: c[1] || b.porsiyon, fayda: c[2] != null ? c[2] : b.fayda, uyari: c[3] != null ? c[3] : b.uyari });
}
function haftaMetni(n) {
  const h = HAFTALAR[n]; const c = L().weeks && L().weeks[n];
  if (!c) return h;
  return Object.assign({}, h, { boyut: c[0], bebek: c[1], anne: c[2], ipucu: c[3], uzunluk: c[4] || h.uzunluk, agirlik: c[5] || h.agirlik });
}
function besinOgesi(id) {
  const n = BESIN_OGELERI[id]; const c = L().nut && L().nut[id];
  return c ? Object.assign({}, n, { ad: c[0], aciklama: c[1], kaynak: c[2] }) : n;
}
function kategoriAdi(id) {
  const c = L().kat && L().kat[id];
  return c || (KATEGORILER.find((k) => k.id === id) || {}).ad || id;
}
function trimesterMetni(n) { return (L().tri && L().tri[n]) || TRIMESTERLER[n]; }
function acilListesi() { return L().acil || ACIL_BELIRTILER; }
function motivasyon(tur) { return (L().mot && L().mot[tur]) || MOTIVASYON[tur]; }
function gununBilgisi(tri) { return (L().tips && L().tips[tri]) || GUNUN_BILGISI[tri]; }
function menuMetni(i) {
  const m = DIYET_MENULERI[i]; const c = L().menus && L().menus[i];
  if (!c) return m;
  return Object.assign({}, m, { ad: c[0], aciklama: c[1], ogunler: m.ogunler.map((o, j) => Object.assign({}, o, { metin: c[2][j] || o.metin })) });
}
