// ===== Wait for Me, Mom – uygulama mantığı =====
(function () {
  "use strict";

  const KEY = "annecigim_v1";
  const OGUNLER = [
    { id: "kahvalti", e: "🌅" },
    { id: "ogle", e: "☀️" },
    { id: "aksam", e: "🌙" },
    { id: "ara", e: "🍎" },
  ];
  const AKTIVITE = [{ id: 1.2, k: "act_1" }, { id: 1.375, k: "act_2" }, { id: 1.55, k: "act_3" }];
  const TEMALAR = [
    { id: "pudra", sw: "linear-gradient(135deg,#f7b6c2,#fbe6d4)" },
    { id: "lavanta", sw: "linear-gradient(135deg,#c7b6ef,#f6dce8)" },
    { id: "nane", sw: "linear-gradient(135deg,#9fd9c6,#f3efd6)" },
    { id: "seftali", sw: "linear-gradient(135deg,#fbc29a,#fff0d3)" },
    { id: "gece", sw: "linear-gradient(135deg,#4a3352,#2f3346)" },
  ];
  // Menülerdeki Türkçe öğün adlarının çeviri anahtarları
  const MENU_OGUN = { "Kahvaltı": "mt_kahvalti", "Ara öğün": "mt_ara", "Öğle": "mt_ogle", "Akşam": "mt_aksam", "Gece": "mt_gece" };
  const BESIN_MAP = Object.fromEntries(BESINLER.map((b) => [b.id, b]));

  // ---------- Depolama ----------
  let S = { profil: null, gunluk: {}, kilolar: [], tema: "pudra", ozel: [], dil: null };
  function yukle() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) S = Object.assign(S, JSON.parse(raw));
    } catch (e) { /* depolama yoksa bellek içinde çalışır */ }
    (S.ozel || []).forEach((b) => { BESIN_MAP[b.id] = b; });
  }
  function kaydet() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* yok say */ }
  }

  // ---------- Yardımcılar ----------
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const yuvarla = (n, d) => { const p = Math.pow(10, d || 0); return Math.round(n * p) / p; };
  const loc = () => dilBilgi().locale;
  const fmt = (n) => Math.round(n).toLocaleString(loc());
  const sayi = (n) => Number(n).toLocaleString(loc());
  function gunAnahtari(d) {
    const x = d || new Date();
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  }
  function tarihCoz(k) { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); }
  function gunEkle(k, n) { const d = tarihCoz(k); d.setDate(d.getDate() + n); return gunAnahtari(d); }
  function tarihYaz(k, uzun) {
    return tarihCoz(k).toLocaleDateString(loc(), uzun ? { weekday: "long", day: "numeric", month: "long" } : { day: "numeric", month: "long", year: "numeric" });
  }
  function gunIndeksi(k) { return Math.floor(tarihCoz(k).getTime() / 86400000); }
  function sec(liste, tohum) { return liste[Math.abs(tohum) % liste.length]; }
  const B = (id) => besinMetni(BESIN_MAP[id]);
  const ogunAdi = (id) => t("meal_" + id);

  let toastT;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove("show"), 3200);
  }

  // ---------- Dil ----------
  function dilSec(kod) {
    AKTIF_DIL = DILLER.some((d) => d.kod === kod) ? kod : "tr";
    S.dil = AKTIF_DIL;
    const d = dilBilgi();
    document.documentElement.lang = d.kod;
    document.documentElement.dir = d.dir;
    document.title = "Wait for Me, Mom – " + t("app_sub");
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    const ls = $("#langSel"); if (ls) ls.value = AKTIF_DIL;
  }
  function varsayilanDil() {
    if (S.dil) return S.dil;
    const n = (navigator.language || "tr").slice(0, 2).toLowerCase();
    return DILLER.some((d) => d.kod === n) ? n : "tr";
  }
  function dilSecici(id) {
    return `<div class="langs" ${id ? `id="${id}"` : ""}>${DILLER.map((d) => `<button class="lang-opt ${d.kod === AKTIF_DIL ? "active" : ""}" data-dil="${d.kod}"><span>${d.bayrak}</span>${d.ad}</button>`).join("")}</div>`;
  }

  // ---------- Gebelik hesapları ----------
  function gebelik(k) {
    if (!S.profil) return null;
    const sat = tarihCoz(S.profil.sat);
    const ref = tarihCoz(k || gunAnahtari());
    const gun = Math.round((ref - sat) / 86400000);
    const hafta = Math.floor(gun / 7);
    const artan = gun % 7;
    const icerikHafta = Math.min(40, Math.max(1, hafta + (hafta === 0 ? 1 : 0)));
    const tri = hafta < 14 ? 1 : hafta < 28 ? 2 : 3;
    const tdt = new Date(sat); tdt.setDate(tdt.getDate() + 280);
    const kalan = Math.max(0, Math.round((tdt - ref) / 86400000));
    return { gun, hafta, artan, icerikHafta, tri, tdt: gunAnahtari(tdt), kalan, yuzde: Math.min(100, Math.max(0, (gun / 280) * 100)) };
  }
  function bki() { const p = S.profil; return p.kilo / Math.pow(p.boy / 100, 2); }
  function bkiSinif() {
    const b = bki();
    if (b < 18.5) return { k: "bmi_under", min: 12.5, max: 18, hMin: 0.44, hMax: 0.58 };
    if (b < 25) return { k: "bmi_normal", min: 11.5, max: 16, hMin: 0.35, hMax: 0.50 };
    if (b < 30) return { k: "bmi_over", min: 7, max: 11.5, hMin: 0.23, hMax: 0.33 };
    return { k: "bmi_obese", min: 5, max: 9, hMin: 0.17, hMax: 0.27 };
  }
  function hedefKalori(tri) {
    const p = S.profil;
    const bmr = 10 * p.kilo + 6.25 * p.boy - 5 * p.yas - 161;
    const ek = tri === 1 ? 0 : tri === 2 ? 340 : 450;
    return Math.round((bmr * p.aktivite + ek) / 10) * 10;
  }
  function hedefProtein(tri) {
    const kg = S.profil.kilo;
    return Math.round(tri === 1 ? Math.max(46, 0.8 * kg) : Math.max(71, 1.1 * kg));
  }

  // ---------- Günlük hesapları ----------
  function gunVerisi(k) {
    if (!S.gunluk[k]) S.gunluk[k] = { items: [], su: 0 };
    return S.gunluk[k];
  }
  function gunToplam(k) {
    const g = S.gunluk[k] || { items: [], su: 0 };
    const tp = { kcal: 0, protein: 0, kafein: 0, etiket: {}, uyarilar: [], adet: g.items.length, su: g.su || 0 };
    Object.keys(BESIN_OGELERI).forEach((e) => (tp.etiket[e] = 0));
    g.items.forEach((it) => {
      const b = BESIN_MAP[it.id];
      if (!b) return;
      tp.kcal += b.kcal * it.q;
      tp.protein += b.protein * it.q;
      tp.kafein += (b.kafein || 0) * it.q;
      b.etiket.forEach((e) => { if (e in tp.etiket) tp.etiket[e] += it.q; });
      if (b.seviye === "kacin") tp.uyarilar.push(b);
    });
    return tp;
  }
  function durum(kcal, hedef, adet) {
    if (!adet) return { cls: "st-none", ad: t("st_none"), kod: "yok" };
    const o = kcal / hedef;
    if (o < 0.85) return { cls: "st-low", ad: t("st_low"), kod: "eksik", fark: hedef - kcal };
    if (o > 1.1) return { cls: "st-high", ad: t("st_high"), kod: "fazla", fark: kcal - hedef };
    return { cls: "st-good", ad: t("st_good"), kod: "dengeli", fark: 0 };
  }

  // ---------- Navigasyon ----------
  let aktifSayfa = "bugun";
  let secGun = gunAnahtari();
  let secHafta = null;
  let diyetTri = null;
  function git(s) {
    aktifSayfa = s;
    $$(".page").forEach((p) => p.classList.toggle("active", p.id === "p-" + s));
    $$(".nav button").forEach((b) => b.classList.toggle("active", b.dataset.p === s));
    ciz();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function ciz() {
    if (!S.profil) return;
    const g = gebelik();
    $("#topWeek").textContent = g.hafta >= 0 ? t("week_day", { w: g.hafta, d: g.artan }) : "";
    ({ bugun: cizBugun, beslenme: cizBeslenme, bebegim: cizBebegim, diyet: cizDiyet, ben: cizBen })[aktifSayfa]();
  }

  // ---------- Bileşenler ----------
  function halka(yuzde, boyut, kalinlik, renk) {
    const r = (boyut - kalinlik) / 2, c = 2 * Math.PI * r;
    return `<svg width="${boyut}" height="${boyut}"><circle cx="${boyut / 2}" cy="${boyut / 2}" r="${r}" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="${kalinlik}"/>
      <circle cx="${boyut / 2}" cy="${boyut / 2}" r="${r}" fill="none" stroke="${renk}" stroke-width="${kalinlik}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - yuzde / 100)}" style="transition:stroke-dashoffset .8s"/></svg>`;
  }
  function kaloriKarti(k, baslik) {
    const g = gebelik(k);
    const hedef = hedefKalori(g.tri);
    const tp = gunToplam(k);
    const d = durum(tp.kcal, hedef, tp.adet);
    const maxV = hedef * 1.4;
    const w = Math.min(100, (tp.kcal / maxV) * 100);
    const renk = d.kod === "dengeli" ? "var(--good)" : d.kod === "eksik" ? "var(--warn)" : d.kod === "fazla" ? "var(--bad)" : "var(--primary-2)";
    let alt;
    if (d.kod === "eksik") alt = t("kcal_left", { n: fmt(d.fark) });
    else if (d.kod === "fazla") alt = t("kcal_over", { n: fmt(d.fark) });
    else if (d.kod === "dengeli") alt = t("kcal_ok");
    else alt = t("kcal_empty");
    return `<div class="card">
      <div class="kcal-top">
        <div><div class="muted small">${baslik || t("energy_today")}</div>
          <div class="kcal-big">${fmt(tp.kcal)} <span class="muted" style="font-size:1rem">/ ${fmt(hedef)} kcal</span></div></div>
        <span class="status-pill ${d.cls}">${d.ad}</span>
      </div>
      <div class="bar"><span class="zone" style="left:${(hedef * 0.85 / maxV) * 100}%;width:${(hedef * 0.25 / maxV) * 100}%"></span><i style="width:${w}%;background:${renk}"></i></div>
      <div class="row small muted" style="justify-content:space-between"><span>${alt}</span><span>${t("protein")}: <b>${sayi(yuvarla(tp.protein))}</b> / ${hedefProtein(g.tri)} g</span></div>
      ${tp.kafein > 0 ? `<div class="small ${tp.kafein > 200 ? "" : "muted"}" style="margin-top:6px">${t("caffeine")}: <b>${Math.round(tp.kafein)} mg</b> / 200 mg ${tp.kafein > 200 ? `<span class="tag bad">${t("caffeine_over")}</span>` : ""}</div>` : ""}
      ${tp.uyarilar.length ? `<div class="alert bad small">${t("avoid_alert", { x: tp.uyarilar.map((b) => esc(besinMetni(b).ad)).join(", ") })}</div>` : ""}
    </div>`;
  }
  function besinKarti(k) {
    const g = gebelik(k);
    const tp = gunToplam(k);
    const html = Object.keys(BESIN_OGELERI).map((id) => {
      const n = besinOgesi(id);
      let deger, hedef, metin;
      if (id === "protein") { hedef = hedefProtein(g.tri); deger = tp.protein; metin = `${sayi(yuvarla(deger))} / ${hedef} g`; }
      else { hedef = n.hedef; deger = tp.etiket[id]; metin = `${sayi(yuvarla(deger, 1))} / ${hedef} ${t("portions")}`; }
      const y = Math.min(100, (deger / hedef) * 100);
      return `<div class="nut ${y >= 100 ? "done" : ""}" data-nut="${id}">
        <div class="nut-head"><span class="e">${n.e}</span>${n.ad}${y >= 100 ? " ✓" : ""}</div>
        <div class="mini"><i style="width:${y}%"></i></div><small>${metin}</small></div>`;
    }).join("");
    const tamam = Object.keys(BESIN_OGELERI).filter((id) => {
      const d = id === "protein" ? tp.protein / hedefProtein(g.tri) : tp.etiket[id] / BESIN_OGELERI[id].hedef;
      return d >= 1;
    }).length;
    return `<div class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h3 style="margin:0">${t("nut_goals")}</h3><span class="tag">${t("done_of", { a: tamam, b: Object.keys(BESIN_OGELERI).length })}</span></div>
      <div class="nutrients">${html}</div><p class="small muted" style="margin:10px 0 0">${t("nut_hint")}</p></div>`;
  }
  function suKarti(k) {
    const su = (S.gunluk[k] && S.gunluk[k].su) || 0;
    let b = "";
    for (let i = 1; i <= 10; i++) b += `<button class="glass ${i <= su ? "full" : ""}" data-su="${i}" aria-label="${t("glass_n", { n: i })}"></button>`;
    return `<div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${t("water")}</h3><span class="muted small">${t("glasses", { n: su })}</span></div>
      <div class="water">${b}</div><p class="small muted" style="margin:8px 0 0">${su >= 8 ? t("water_done") : t("water_hint")}</p></div>`;
  }
  function suBagla(k) {
    $$("[data-su]").forEach((b) => b.onclick = () => {
      const g = gunVerisi(k); const n = +b.dataset.su;
      g.su = g.su === n ? n - 1 : n; kaydet(); ciz();
      if (g.su === 8) toast(t("water_toast"));
    });
  }
  function besinBagla() {
    $$("[data-nut]").forEach((el) => el.onclick = () => {
      const n = besinOgesi(el.dataset.nut);
      modalAc(`<div class="modal-head"><h2>${n.e} ${n.ad}</h2><button class="icon-btn" data-close aria-label="${t("close")}">✕</button></div>
        <div class="benefit"><b>${t("benefit_title")}</b><br>${n.aciklama}</div>
        <p><b>${t("sources_title")}</b><br>${n.kaynak}</p>
        <p class="small muted">${t("supplement_note")}</p>`);
    });
  }

  // ---------- Sayfa: Bugün ----------
  function cizBugun() {
    const k = gunAnahtari();
    const g = gebelik(k);
    const h = haftaMetni(g.icerikHafta);
    const tp = gunToplam(k);
    const d = durum(tp.kcal, hedefKalori(g.tri), tp.adet);
    const tohum = gunIndeksi(k);
    const havuz = motivasyon("genel").concat(motivasyon(g.tri));
    const mot = sec(havuz, tohum);
    const bilgi = sec(gununBilgisi(g.tri), tohum);
    const saat = new Date().getHours();
    const selam = saat < 11 ? t("greet_morning") : saat < 18 ? t("greet_day") : t("greet_evening");
    let gunMesaj = "";
    if (d.kod !== "yok" && saat >= 18) gunMesaj = `<div class="card quote"><p>${sec(motivasyon(d.kod), tohum)}</p></div>`;

    $("#p-bugun").innerHTML = `
      <div class="hero">
        <div class="ring-wrap">${halka(g.yuzde, 132, 12, "#fff")}<div class="ring-center"><div><b>${Math.max(0, g.hafta)}</b><span>${t("weeks_label")}</span></div></div></div>
        <div style="position:relative;z-index:1">
          <h1>${selam}, ${esc(S.profil.ad || t("mom_default"))} 💗</h1>
          <div class="sub">${t("week_day", { w: g.hafta, d: g.artan })} · ${t("trimester_n", { n: g.tri })}</div>
          <div class="hero-chips"><span class="chip">👶 ${t("days_to_birth", { n: g.kalan })}</span><span class="chip">📅 ${tarihYaz(g.tdt)}</span><span class="chip">${t("percent_done", { n: Math.round(g.yuzde) })}</span></div>
        </div>
      </div>
      <div class="card quote" style="margin-top:16px"><p>${esc(mot)}</p></div>
      ${gunMesaj}
      <div class="grid grid-2" style="margin-top:16px">
        <div class="card"><div class="baby-card">
          <div class="fruit">${h.e}</div>
          <div><div class="muted small">${t("baby_this_week")}</div><h3>${esc(t("size_like", { x: h.boyut }))}</h3>
            <div class="stat-row"><div>${t("length")}<b>${h.uzunluk}</b></div><div>${t("weight")}<b>${h.agirlik}</b></div></div></div>
        </div><p style="margin:12px 0 8px">${h.bebek}</p><button class="btn ghost small" data-go="bebegim">${t("all_week_info")}</button></div>
        <div class="card"><h3>${t("tip_of_day")}</h3><p>${bilgi}</p><div class="alert info small" style="margin-bottom:0"><b>${t("week_tip")}:</b> ${h.ipucu}</div></div>
      </div>
      <div class="section-title"><h2>${t("todays_nutrition")}</h2><button class="btn small" data-go="beslenme">${t("add_food_btn")}</button></div>
      ${kaloriKarti(k)}
      ${besinKarti(k)}
      ${suKarti(k)}
      ${acilKart()}
      ${uyariMetni()}`;
    $$("[data-go]").forEach((b) => b.onclick = () => { if (b.dataset.go === "beslenme") secGun = gunAnahtari(); git(b.dataset.go); });
    suBagla(k); besinBagla(); acilBagla();
  }
  function acilKart() {
    return `<div class="card danger-card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${t("emergency_title")}</h3><button class="btn light small" id="acilBtn" style="flex:0 0 auto">${t("emergency_btn")}</button></div>
      <p class="small muted" style="margin:6px 0 0">${t("emergency_sub")}</p></div>`;
  }
  function acilBagla() {
    const b = $("#acilBtn");
    if (b) b.onclick = () => modalAc(`<div class="modal-head"><h2>${t("emergency_modal")}</h2><button class="icon-btn" data-close aria-label="${t("close")}">✕</button></div>
      <p>${t("emergency_intro")}</p>
      <ul class="clean">${acilListesi().map((x) => `<li>${x}</li>`).join("")}</ul>`);
  }
  function uyariMetni() {
    return `<p class="disclaimer">${t("disclaimer")}<br><span class="credit">${t("producer")}</span> · <a href="privacy.html?lang=${AKTIF_DIL}">${t("privacy")}</a></p>`;
  }

  // ---------- Sayfa: Beslenme ----------
  function cizBeslenme() {
    const k = secGun;
    const bugun = gunAnahtari();
    const g = gunVerisi(k);
    const bloklar = OGUNLER.map((o) => {
      const items = g.items.map((it, i) => ({ it, i })).filter((x) => x.it.m === o.id);
      const top = items.reduce((s, x) => s + ((BESIN_MAP[x.it.id] || {}).kcal || 0) * x.it.q, 0);
      return `<div class="meal-block"><div class="meal-head"><h3>${o.e} ${ogunAdi(o.id)} ${top ? `<span class="muted small">· ${fmt(top)} kcal</span>` : ""}</h3>
        <button class="btn ghost small" data-ekle="${o.id}">${t("add_small")}</button></div>
        ${items.length ? items.map(({ it, i }) => yemekSatiri(it, i)).join("") : `<div class="empty">${t("nothing_added")}</div>`}</div>`;
    }).join("");
    $("#p-beslenme").innerHTML = `
      <div class="card"><div class="day-nav">
        <button class="icon-btn" id="dPrev">${dilBilgi().dir === "rtl" ? "›" : "‹"}</button>
        <div class="d">${k === bugun ? t("today") : k === gunEkle(bugun, -1) ? t("yesterday") : ""}<div class="muted small">${tarihYaz(k, true)}</div></div>
        <button class="icon-btn" id="dNext" ${k >= bugun ? "disabled style='opacity:.35'" : ""}>${dilBilgi().dir === "rtl" ? "‹" : "›"}</button>
      </div>${bloklar}</div>
      ${kaloriKarti(k, k === bugun ? t("energy_today") : t("energy_day"))}
      ${besinKarti(k)}
      ${suKarti(k)}
      ${uyariMetni()}`;
    $("#dPrev").onclick = () => { secGun = gunEkle(k, -1); ciz(); };
    $("#dNext").onclick = () => { if (k < bugun) { secGun = gunEkle(k, 1); ciz(); } };
    $$("[data-ekle]").forEach((b) => b.onclick = () => aramaAc(b.dataset.ekle));
    $$("[data-sil]").forEach((b) => b.onclick = () => { g.items.splice(+b.dataset.sil, 1); kaydet(); ciz(); });
    $$("[data-detay]").forEach((b) => b.onclick = () => { const it = g.items[+b.dataset.detay]; detayAc(it.id, it.m, +b.dataset.detay); });
    suBagla(k); besinBagla();
  }
  function etiketler(b, kac) {
    return b.etiket.slice(0, kac).map((e) => `<span class="tag">${besinOgesi(e).ad}</span>`).join("")
      + (b.seviye === "kacin" ? `<span class="tag bad">${t("tag_avoid")}</span>` : b.seviye === "dikkat" ? `<span class="tag warn">${t("tag_caution")}</span>` : "");
  }
  function yemekSatiri(it, i) {
    const b = BESIN_MAP[it.id] ? B(it.id) : { ad: t("unknown"), e: "❔", kcal: 0, etiket: [], porsiyon: "" };
    return `<div class="food-item"><div class="em">${b.e}</div>
      <div class="info" data-detay="${i}" style="cursor:pointer"><div class="name">${esc(b.ad)}</div><div class="meta">${sayi(it.q)} × ${esc(b.porsiyon)} ${etiketler(b, 3)}</div></div>
      <div class="kc">${fmt(b.kcal * it.q)}</div><button class="del" data-sil="${i}" aria-label="${t("delete")}">✕</button></div>`;
  }

  // ---------- Modal ----------
  function modalAc(html) {
    const bg = $("#modal");
    $("#modalBody").innerHTML = html;
    bg.classList.add("open");
    $$("[data-close]", bg).forEach((b) => b.onclick = modalKapat);
  }
  function modalKapat() { $("#modal").classList.remove("open"); }

  let aramaKat = "hepsi";
  function aramaAc(ogun) {
    const og = OGUNLER.find((o) => o.id === ogun);
    modalAc(`<div class="modal-head"><h2>${og.e} ${t("add_title", { m: ogunAdi(og.id) })}</h2><button class="icon-btn" data-close aria-label="${t("close")}">✕</button></div>
      <input class="input" id="ara" placeholder="${esc(t("search_ph"))}" autocomplete="off">
      <div class="chips" id="katlar">${KATEGORILER.map((c) => `<button data-kat="${c.id}" class="${c.id === aramaKat ? "active" : ""}">${kategoriAdi(c.id)}</button>`).join("")}</div>
      <div class="search-results" id="sonuc"></div>
      <button class="btn light block" id="ozelBtn" style="margin-top:10px">${t("custom_btn")}</button>`);
    const listele = () => {
      const q = $("#ara").value.trim().toLocaleLowerCase(loc());
      const tum = BESINLER.concat(S.ozel || []).map((b) => ({ b, m: besinMetni(b) }));
      const r = tum.filter(({ b, m }) => (aramaKat === "hepsi" || b.kat === aramaKat) &&
        (!q || m.ad.toLocaleLowerCase(loc()).includes(q) || b.ad.toLocaleLowerCase("tr-TR").includes(q)));
      $("#sonuc").innerHTML = r.length ? r.map(({ b, m }) => `<div class="result" data-b="${b.id}"><div class="em">${b.e}</div>
        <div class="info"><b>${esc(m.ad)}</b><div class="small muted">${esc(m.porsiyon)} · ${b.kcal} kcal
        ${b.seviye === "kacin" ? `<span class="tag bad">${t("tag_avoid")}</span>` : b.seviye === "dikkat" ? `<span class="tag warn">${t("tag_caution")}</span>` : ""}</div></div>
        <span class="muted">${dilBilgi().dir === "rtl" ? "‹" : "›"}</span></div>`).join("") : `<div class="empty">${t("no_results")}</div>`;
      $$("[data-b]").forEach((el) => el.onclick = () => detayAc(el.dataset.b, ogun));
    };
    $("#ara").oninput = listele;
    $$("[data-kat]").forEach((b) => b.onclick = () => { aramaKat = b.dataset.kat; $$("[data-kat]").forEach((x) => x.classList.toggle("active", x === b)); listele(); });
    $("#ozelBtn").onclick = () => ozelAc(ogun);
    listele();
    setTimeout(() => $("#ara") && $("#ara").focus(), 100);
  }
  function detayAc(id, ogun, duzenIndeks) {
    if (!BESIN_MAP[id]) return;
    const b = B(id);
    let q = duzenIndeks != null ? gunVerisi(secGun).items[duzenIndeks].q : 1;
    const qs = [0.5, 1, 1.5, 2, 3];
    modalAc(`<div class="modal-head"><h2>${b.e} ${esc(b.ad)}</h2><button class="icon-btn" data-close aria-label="${t("close")}">✕</button></div>
      <div class="muted">${t("portion_one", { p: esc(b.porsiyon) })} · <b>${b.kcal} kcal</b> · ${t("protein_g", { n: sayi(b.protein) })}</div>
      ${b.etiket.length ? `<div style="margin-top:8px">${b.etiket.map((e) => { const n = besinOgesi(e); return `<span class="tag">${n.e} ${n.ad}</span>`; }).join("")}</div>` : ""}
      ${b.fayda ? `<div class="benefit"><b>${t("benefit_title")}</b><br>${esc(b.fayda)}</div>` : ""}
      ${b.uyari ? `<div class="alert ${b.seviye === "kacin" ? "bad" : "warn"}">${b.seviye === "kacin" ? "🚫" : "⚠️"} ${esc(b.uyari)}</div>` : ""}
      <h3 style="margin-top:14px">${t("how_much")}</h3>
      <div class="qty">${qs.map((x) => `<button data-q="${x}" class="${x === q ? "active" : ""}">${x === 0.5 ? "½" : x === 1.5 ? "1½" : x} ${t("portion_word")}</button>`).join("")}</div>
      <div class="center" style="margin:12px 0"><b id="qKcal">${fmt(b.kcal * q)}</b> kcal</div>
      <button class="btn block" id="ekleBtn">${duzenIndeks != null ? t("update") : t("add")}</button>`);
    $$("[data-q]").forEach((x) => x.onclick = () => {
      q = +x.dataset.q; $$("[data-q]").forEach((y) => y.classList.toggle("active", y === x));
      $("#qKcal").textContent = fmt(b.kcal * q);
    });
    $("#ekleBtn").onclick = () => {
      const g = gunVerisi(secGun);
      const onceki = gunToplam(secGun);
      if (duzenIndeks != null) g.items[duzenIndeks].q = q;
      else g.items.push({ id, q, m: ogun });
      kaydet(); modalKapat();
      const sonra = gunToplam(secGun);
      const yeniRozet = Object.keys(BESIN_OGELERI).find((e) => e !== "protein" &&
        onceki.etiket[e] < BESIN_OGELERI[e].hedef && sonra.etiket[e] >= BESIN_OGELERI[e].hedef);
      if (b.seviye === "kacin") toast(t("toast_avoid"));
      else if (yeniRozet) { const n = besinOgesi(yeniRozet); toast(n.e + " " + t("toast_goal", { x: n.ad, m: sec(motivasyon("rozet"), Date.now()) })); }
      else toast(t("toast_added", { x: b.ad }));
      if (aktifSayfa !== "beslenme") git("beslenme"); else ciz();
    };
  }
  function ozelAc(ogun) {
    modalAc(`<div class="modal-head"><h2>${t("custom_title")}</h2><button class="icon-btn" data-close aria-label="${t("close")}">✕</button></div>
      <label class="field"><span>${t("custom_name")}</span><input class="input" id="oAd" placeholder="${esc(t("custom_name_ph"))}"></label>
      <div class="row"><label class="field"><span>${t("custom_portion")}</span><input class="input" id="oPor" placeholder="${esc(t("custom_portion_ph"))}"></label>
      <label class="field"><span>${t("custom_kcal")}</span><input class="input" id="oKcal" type="number" min="0" inputmode="numeric"></label>
      <label class="field"><span>${t("custom_protein")}</span><input class="input" id="oPro" type="number" min="0" inputmode="decimal" placeholder="0"></label></div>
      <p class="small muted">${t("custom_hint")}</p>
      <button class="btn block" id="oKaydet">${t("custom_save")}</button>`);
    $("#oKaydet").onclick = () => {
      const ad = $("#oAd").value.trim(); const kcal = +$("#oKcal").value;
      if (!ad || !(kcal >= 0) || $("#oKcal").value === "") { toast(t("custom_err")); return; }
      const b = { id: "ozel_" + Date.now(), ad, e: "🍽️", kat: "hepsi", porsiyon: $("#oPor").value.trim() || t("custom_portion_ph"), kcal, protein: +$("#oPro").value || 0, etiket: [], fayda: "", uyari: "", seviye: "", kafein: 0 };
      S.ozel.push(b); BESIN_MAP[b.id] = b;
      gunVerisi(secGun).items.push({ id: b.id, q: 1, m: ogun });
      kaydet(); modalKapat(); toast(t("toast_added", { x: ad })); ciz();
    };
  }

  // ---------- Sayfa: Bebeğim ----------
  function cizBebegim() {
    const g = gebelik();
    if (secHafta == null) secHafta = g.icerikHafta;
    const h = haftaMetni(secHafta);
    const tri = secHafta < 14 ? 1 : secHafta < 28 ? 2 : 3;
    const T = trimesterMetni(tri);
    let hb = "";
    for (let i = 1; i <= 40; i++) hb += `<button data-h="${i}" class="${i === secHafta ? "active" : ""} ${i === g.icerikHafta ? "cur" : ""}">${i}</button>`;
    $("#p-bebegim").innerHTML = `
      <div class="week-scroller" id="hs">${hb}</div>
      <div class="hero" style="grid-template-columns:auto 1fr">
        <div class="fruit" style="width:110px;height:110px;font-size:3.8rem;background:rgba(255,255,255,.6)">${h.e}</div>
        <div style="position:relative;z-index:1"><div class="sub">${t("week_n", { n: secHafta })} ${secHafta === g.icerikHafta ? "· " + t("you_are_here") : ""}</div>
          <h1>${esc(h.boyut)}</h1>
          <div class="hero-chips"><span class="chip">📏 ${h.uzunluk}</span><span class="chip">⚖️ ${h.agirlik}</span><span class="chip">${T.e} ${T.ad}</span></div></div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="info-block"><div class="e">👶</div><div><h4>${t("q_baby")}</h4><p>${h.bebek}</p></div></div>
        <div class="info-block"><div class="e">🤰</div><div><h4>${t("q_mom")}</h4><p>${h.anne}</p></div></div>
        <div class="info-block"><div class="e">💡</div><div><h4>${t("week_tip")}</h4><p>${h.ipucu}</p></div></div>
      </div>
      <div class="section-title"><h2>${t("tri_guide")}</h2></div>
      <div class="seg tri-tabs">${[1, 2, 3].map((x) => `<button data-tri="${x}" class="${x === tri ? "active" : ""}">${trimesterMetni(x).e} ${trimesterMetni(x).ad}</button>`).join("")}</div>
      <div id="triIcerik">${triIcerik(tri)}</div>
      ${acilKart()}
      ${uyariMetni()}`;
    $$("[data-h]").forEach((b) => b.onclick = () => { secHafta = +b.dataset.h; cizBebegim(); });
    $$("[data-tri]").forEach((b) => b.onclick = () => {
      $$("[data-tri]").forEach((x) => x.classList.toggle("active", x === b));
      $("#triIcerik").innerHTML = triIcerik(+b.dataset.tri);
    });
    const akt = $("#hs .active");
    if (akt) akt.scrollIntoView({ block: "nearest", inline: "center" });
    acilBagla();
  }
  function triIcerik(n) {
    const T = trimesterMetni(n);
    return `<div class="card"><h3>${T.e} ${T.ad} <span class="muted small">(${T.haftalar})</span></h3><p>${T.ozet}</p>
      <div class="grid grid-3" style="gap:12px">
        <div><h4>${t("tri_common")}</h4><ul class="clean">${T.belirtiler.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div><h4>${t("tri_food")}</h4><ul class="clean">${T.beslenme.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div><h4>${t("tri_checks")}</h4><ul class="clean">${T.kontroller.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div></div>`;
  }

  // ---------- Sayfa: Diyet önerileri ----------
  function cizDiyet() {
    const g = gebelik();
    if (diyetTri == null) diyetTri = g.tri;
    const menuler = DIYET_MENULERI.map((m, i) => ({ i, m: menuMetni(i) })).filter((x) => x.m.tri === diyetTri);
    $("#p-diyet").innerHTML = `
      <div class="card"><h2>${t("diet_title")}</h2>
        <p class="muted">${t("diet_note", { k: fmt(hedefKalori(diyetTri)), t: t("trimester_n", { n: diyetTri }) })}</p>
        <div class="seg">${[1, 2, 3].map((x) => `<button data-dt="${x}" class="${x === diyetTri ? "active" : ""}">${t("trimester_n", { n: x })}</button>`).join("")}</div></div>
      ${menuler.map(({ i, m }) => {
        const top = m.ogunler.reduce((s, o) => s + ogunKalori(o), 0);
        return `<div class="card menu-day"><div class="row" style="justify-content:space-between;align-items:flex-start">
          <div><h3>${esc(m.ad)}</h3><p class="muted small">${esc(m.aciklama)}</p></div><span class="tag">≈ ${fmt(top)} kcal</span></div>
          ${m.ogunler.map((o, oi) => `<div class="menu-meal"><div class="mt">${t(MENU_OGUN[o.ad] || "mt_ara")}</div><div>${esc(o.metin)}</div>
            <div class="row" style="flex:0;gap:6px;flex-wrap:nowrap"><span class="mk">${fmt(ogunKalori(o))} kcal</span><button class="btn ghost small" data-mo="${i}-${oi}" title="${esc(t("add_to_today"))}">+</button></div></div>`).join("")}
          <button class="btn light block" data-mtum="${i}" style="margin-top:10px">${t("add_whole_menu")}</button></div>`;
      }).join("")}
      <div class="card"><h3>${t("principles_title")}</h3><ul class="clean">${t("principles").map((x) => `<li>${x}</li>`).join("")}</ul></div>
      ${uyariMetni()}`;
    $$("[data-dt]").forEach((b) => b.onclick = () => { diyetTri = +b.dataset.dt; cizDiyet(); });
    $$("[data-mo]").forEach((b) => b.onclick = () => {
      const [mi, oi] = b.dataset.mo.split("-").map(Number);
      menuEkle([menuMetni(mi).ogunler[oi]]);
    });
    $$("[data-mtum]").forEach((b) => b.onclick = () => menuEkle(menuMetni(+b.dataset.mtum).ogunler));
  }
  function ogunKalori(o) { return o.items.reduce((s, [id, q]) => s + (BESIN_MAP[id] ? BESIN_MAP[id].kcal * q : 0), 0); }
  function menuEkle(ogunler) {
    const g = gunVerisi(gunAnahtari());
    ogunler.forEach((o) => o.items.forEach(([id, q]) => { if (BESIN_MAP[id]) g.items.push({ id, q, m: o.ogun }); }));
    kaydet();
    toast(ogunler.length > 1 ? t("menu_added") : t("meal_added", { x: t(MENU_OGUN[ogunler[0].ad] || "mt_ara") }));
  }

  // ---------- Sayfa: Ben (ilerleme + profil) ----------
  function cizBen() {
    const g = gebelik();
    const p = S.profil;
    const sinif = bkiSinif();
    const son = S.kilolar.length ? S.kilolar[S.kilolar.length - 1] : null;
    $("#p-ben").innerHTML = `
      <div class="section-title" style="margin-top:4px"><h2>${t("last7")}</h2></div>
      <div class="card">${haftalikGrafik()}</div>
      <div class="section-title"><h2>${t("weight_title")}</h2></div>
      <div class="card">
        <div class="row" style="align-items:flex-end">
          <label class="field" style="margin:0"><span>${t("weight_today")}</span><input class="input" id="kgIn" type="number" step="0.1" inputmode="decimal" placeholder="${son ? son.kg : p.kilo}"></label>
          <button class="btn" id="kgBtn" style="flex:0">${t("save")}</button></div>
        <p class="small muted" style="margin-top:10px">${t("weight_info", { w: sayi(p.kilo), b: sayi(yuvarla(bki(), 1)), c: t(sinif.k), r: sayi(sinif.min) + "–" + sayi(sinif.max) })}
        ${son ? t("so_far", { n: sayi(yuvarla(son.kg - p.kilo, 1)) }) : ""}</p>
        ${kiloGrafik()}
        <div class="legend"><span><i style="background:color-mix(in srgb,var(--good) 25%,transparent)"></i>${t("leg_range")}</span><span><i style="background:var(--primary)"></i>${t("leg_you")}</span></div>
        ${kiloYorum()}
        ${S.kilolar.length ? `<details style="margin-top:10px"><summary class="small muted" style="cursor:pointer">${t("records", { n: S.kilolar.length })}</summary>
          ${S.kilolar.slice().reverse().map((x) => `<div class="food-item" style="margin-top:6px"><div class="info"><div class="name">${sayi(x.kg)} kg</div><div class="meta">${tarihYaz(x.d)}</div></div><button class="del" data-ksil="${x.d}" aria-label="${t("delete")}">✕</button></div>`).join("")}</details>` : ""}
      </div>
      <div class="section-title"><h2>${t("notif_title")}</h2></div>
      <div class="card"><p style="margin-top:0">${t("notif_text")}</p><div id="bildirimKutu"></div></div>
      <div class="section-title"><h2>${t("lang_title")}</h2></div>
      <div class="card">${dilSecici()}</div>
      <div class="section-title"><h2>${t("theme_title")}</h2></div>
      <div class="card"><div class="themes">${TEMALAR.map((th) => `<button class="theme-opt ${S.tema === th.id ? "active" : ""}" data-tema="${th.id}"><div class="sw" style="background:${th.sw}"></div>${t("th_" + th.id)}</button>`).join("")}</div></div>
      <div class="section-title"><h2>${t("profile_title")}</h2></div>
      <div class="card">
        <div class="stat-row"><div>${t("f_name")}<b>${esc(p.ad || "-")}</b></div><div>${t("f_age")}<b>${p.yas}</b></div><div>${t("f_height")}<b>${p.boy} cm</b></div><div>${t("f_pre")}<b>${sayi(p.kilo)} kg</b></div>
        <div>${t("f_due")}<b>${tarihYaz(g.tdt)}</b></div><div>${t("f_goal")}<b>${fmt(hedefKalori(g.tri))} kcal</b></div></div>
        <p class="small muted" style="margin-top:10px">${t("formula_note")} ${p.ikiz ? `<b>${t("twin_note")}</b>` : ""}</p>
        <div class="row" style="margin-top:10px"><button class="btn ghost" id="profDuzen">${t("edit_profile")}</button><button class="btn light" id="yedekBtn">${t("download_data")}</button></div>
      </div>
      ${uyariMetni()}`;
    $("#kgBtn").onclick = () => {
      const kg = parseFloat(String($("#kgIn").value).replace(",", "."));
      if (!(kg > 30 && kg < 250)) { toast(t("weight_err")); return; }
      const d = gunAnahtari();
      S.kilolar = S.kilolar.filter((x) => x.d !== d).concat([{ d, kg }]).sort((a, b) => a.d.localeCompare(b.d));
      kaydet(); toast(t("weight_saved")); cizBen();
    };
    $$("[data-ksil]").forEach((b) => b.onclick = () => { S.kilolar = S.kilolar.filter((x) => x.d !== b.dataset.ksil); kaydet(); cizBen(); });
    $$("[data-tema]").forEach((b) => b.onclick = () => { S.tema = b.dataset.tema; temaUygula(); kaydet(); cizBen(); });
    dilBagla();
    bildirimKartiDoldur();
    $("#profDuzen").onclick = () => profilFormu(false);
    $("#yedekBtn").onclick = () => {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "waitformemom-" + gunAnahtari() + ".json"; a.click();
    };
  }
  function dilBagla() {
    $$("[data-dil]").forEach((b) => b.onclick = () => {
      dilSec(b.dataset.dil); kaydet(); bildirimEtiketle();
      if (!$("#welcome").classList.contains("hidden")) profilFormu(true, formDegerleri());
      else ciz();
    });
  }
  function haftalikGrafik() {
    const bugun = gunAnahtari();
    const gunler = []; for (let i = 6; i >= 0; i--) gunler.push(gunEkle(bugun, -i));
    const veri = gunler.map((k) => { const g = gebelik(k); const tp = gunToplam(k); const h = hedefKalori(g.tri); return { k, tp, h, d: durum(tp.kcal, h, tp.adet) }; });
    const maxV = Math.max(...veri.map((v) => Math.max(v.tp.kcal, v.h))) * 1.15;
    const W = 640, H = 220, pl = 10, pb = 28, pt = 10, bw = (W - pl * 2) / 7;
    const y = (v) => pt + (H - pt - pb) * (1 - v / maxV);
    const renk = { dengeli: "var(--good)", eksik: "var(--warn)", fazla: "var(--bad)", yok: "var(--line)" };
    let svg = `<svg class="chart" viewBox="0 0 ${W} ${H}" direction="ltr">`;
    veri.forEach((v, i) => {
      const x = pl + i * bw + bw * 0.2, w = bw * 0.6;
      const bh = v.tp.adet ? Math.max(3, H - pb - y(v.tp.kcal)) : 3;
      svg += `<rect x="${x}" y="${H - pb - bh}" width="${w}" height="${bh}" rx="8" fill="${renk[v.d.kod]}" opacity="${v.tp.adet ? 0.9 : 0.6}"/>`;
      svg += `<line x1="${x - 4}" x2="${x + w + 4}" y1="${y(v.h)}" y2="${y(v.h)}" stroke="var(--text)" stroke-width="2" stroke-dasharray="4 3" opacity=".5"/>`;
      if (v.tp.adet) svg += `<text x="${x + w / 2}" y="${H - pb - bh - 5}" text-anchor="middle">${fmt(v.tp.kcal)}</text>`;
      svg += `<text x="${x + w / 2}" y="${H - 8}" text-anchor="middle">${tarihCoz(v.k).toLocaleDateString(loc(), { weekday: "short" })}</text>`;
    });
    svg += "</svg>";
    const girilen = veri.filter((v) => v.tp.adet);
    let ozet = `<p class="muted small">${t("no_week_data")}</p>`;
    if (girilen.length) {
      const ort = girilen.reduce((s, v) => s + v.tp.kcal, 0) / girilen.length;
      const hOrt = girilen.reduce((s, v) => s + v.h, 0) / girilen.length;
      const d = durum(ort, hOrt, 1);
      const dengeli = girilen.filter((v) => v.d.kod === "dengeli").length;
      ozet = `<div class="row" style="justify-content:space-between;margin-top:6px"><div><div class="muted small">${t("avg_n", { n: girilen.length })}</div><b style="font-size:1.3rem">${fmt(ort)} kcal</b> <span class="muted">/ ${fmt(hOrt)}</span></div>
        <span class="status-pill ${d.cls}" style="white-space:nowrap">${d.ad}</span></div>
        <p class="small" style="margin-top:8px">${t("balanced_days", { n: dengeli })} ${sec(motivasyon(d.kod), girilen.length)}</p>`;
    }
    return svg + `<div class="legend"><span><i style="background:var(--good)"></i>${t("leg_good")}</span><span><i style="background:var(--warn)"></i>${t("leg_low")}</span><span><i style="background:var(--bad)"></i>${t("leg_high")}</span><span>${t("leg_target")}</span></div>` + ozet;
  }
  function aralik(h) {
    const s = bkiSinif();
    if (h <= 13) return [0.5 * h / 13, 2 * h / 13];
    return [Math.min(s.min, 0.5 + (h - 13) * s.hMin), Math.min(s.max, 2 + (h - 13) * s.hMax)];
  }
  function kiloGrafik() {
    const p = S.profil;
    const W = 640, H = 240, pl = 34, pr = 10, pt = 10, pb = 26;
    const noktalar = S.kilolar.map((x) => ({ h: gebelik(x.d).gun / 7, v: x.kg - p.kilo })).filter((x) => x.h >= 0 && x.h <= 42);
    const ymax = Math.max(bkiSinif().max + 2, ...noktalar.map((n) => n.v + 1));
    const ymin = Math.min(-2, ...noktalar.map((n) => n.v - 1));
    const X = (h) => pl + (W - pl - pr) * (h / 40);
    const Y = (v) => pt + (H - pt - pb) * (1 - (v - ymin) / (ymax - ymin));
    let ust = "", alt = "";
    for (let h = 0; h <= 40; h++) { const [a, b] = aralik(h); ust += `${X(h)},${Y(b)} `; alt = `${X(h)},${Y(a)} ` + alt; }
    let svg = `<svg class="chart" viewBox="0 0 ${W} ${H}" style="margin-top:12px" direction="ltr">`;
    for (let v = Math.ceil(ymin / 4) * 4; v <= ymax; v += 4) svg += `<line x1="${pl}" x2="${W - pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${pl - 6}" y="${Y(v) + 4}" text-anchor="end">${v > 0 ? "+" : ""}${v}</text>`;
    [0, 13, 27, 40].forEach((h) => svg += `<text x="${X(h)}" y="${H - 6}" text-anchor="middle">${t("wk_axis", { n: h })}</text>`);
    svg += `<polygon points="${ust}${alt}" fill="color-mix(in srgb, var(--good) 22%, transparent)" stroke="var(--good)" stroke-opacity=".4"/>`;
    const g = gebelik();
    if (g.hafta >= 0 && g.hafta <= 40) svg += `<line x1="${X(g.gun / 7)}" x2="${X(g.gun / 7)}" y1="${pt}" y2="${H - pb}" stroke="var(--primary)" stroke-dasharray="3 3" opacity=".6"/>`;
    if (noktalar.length > 1) svg += `<polyline points="${noktalar.map((n) => `${X(n.h)},${Y(n.v)}`).join(" ")}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round"/>`;
    noktalar.forEach((n) => svg += `<circle cx="${X(n.h)}" cy="${Y(n.v)}" r="4.5" fill="var(--primary)" stroke="var(--card)" stroke-width="2"/>`);
    return svg + "</svg>";
  }
  function kiloYorum() {
    if (!S.kilolar.length) return `<p class="small muted">${t("weight_hint")}</p>`;
    const son = S.kilolar[S.kilolar.length - 1];
    const h = gebelik(son.d).gun / 7;
    const [a, b] = aralik(Math.max(0, Math.min(40, h)));
    const art = son.kg - S.profil.kilo;
    if (art < a - 0.5) return `<div class="alert warn small">${t("weight_low")}</div>`;
    if (art > b + 0.5) return `<div class="alert warn small">${t("weight_high")}</div>`;
    return `<div class="alert info small">${t("weight_ok")}</div>`;
  }

  // ---------- Profil formu ----------
  let formTip = "sat";
  function formDegerleri() {
    const v = (id) => ($("#" + id) ? $("#" + id).value : "");
    return { ad: v("fAd"), yas: v("fYas"), boy: v("fBoy"), kilo: v("fKilo"), tarih: v("fTarih"), aktivite: v("fAkt"), ikiz: $("#fIkiz") ? $("#fIkiz").checked : false };
  }
  function profilFormu(ilk, taslak) {
    const p = S.profil || { ad: "", yas: "", boy: "", kilo: "", sat: "", aktivite: 1.375, ikiz: false };
    const f = taslak || { ad: p.ad, yas: p.yas, boy: p.boy, kilo: p.kilo, tarih: p.sat || "", aktivite: p.aktivite, ikiz: p.ikiz };
    if (!taslak) formTip = "sat";
    const icerik = `
      ${ilk ? `${dilSecici()}<div class="center" style="margin-top:14px"><img src="icons/icon-192.png" alt="" style="width:88px;height:88px;border-radius:24px;box-shadow:var(--shadow)"></div>
        <h2 class="center" style="margin-top:10px">Wait for Me, Mom</h2><p class="center small muted" style="margin-top:-6px">${t("producer")}</p>
        <p class="center muted">${t("welcome_text")}</p>` :
        `<div class="modal-head"><h2>${t("edit_profile_title")}</h2><button class="icon-btn" data-close aria-label="${t("close")}">✕</button></div>`}
      <label class="field"><span>${t("your_name")}</span><input class="input" id="fAd" value="${esc(f.ad)}" placeholder="${esc(t("name_ph"))}"></label>
      <div class="row">
        <label class="field"><span>${t("age")}</span><input class="input" id="fYas" type="number" inputmode="numeric" value="${esc(f.yas)}"></label>
        <label class="field"><span>${t("height_cm")}</span><input class="input" id="fBoy" type="number" inputmode="numeric" value="${esc(f.boy)}"></label>
        <label class="field"><span>${t("pre_weight")}</span><input class="input" id="fKilo" type="number" step="0.1" inputmode="decimal" value="${esc(f.kilo)}"></label>
      </div>
      <label class="field"><span>${t("which_date")}</span>
        <div class="seg" id="fTip"><button data-tip="sat" class="${formTip === "sat" ? "active" : ""}">${t("lmp")}</button><button data-tip="tdt" class="${formTip === "tdt" ? "active" : ""}">${t("edd")}</button></div></label>
      <label class="field"><span id="fTarihEt">${formTip === "sat" ? t("lmp_label") : t("edd_label")}</span><input class="input" id="fTarih" type="date" value="${esc(f.tarih)}"></label>
      <label class="field"><span>${t("activity")}</span><select class="input" id="fAkt">${AKTIVITE.map((a) => `<option value="${a.id}" ${+f.aktivite === a.id ? "selected" : ""}>${t(a.k)}</option>`).join("")}</select></label>
      <label class="row small" style="margin-bottom:14px;flex-wrap:nowrap"><input type="checkbox" id="fIkiz" style="flex:0 0 20px;width:20px;height:20px" ${f.ikiz ? "checked" : ""}><span>${t("twins")}</span></label>
      <button class="btn block" id="fKaydet">${ilk ? t("start") : t("save")}</button>
      <p class="small muted center" style="margin-top:10px">${t("local_note")}</p>`;
    if (ilk) { $("#welcomeBody").innerHTML = icerik; $("#welcome").classList.remove("hidden"); dilBagla(); }
    else modalAc(icerik);
    $$("[data-tip]").forEach((b) => b.onclick = (e) => {
      e.preventDefault(); formTip = b.dataset.tip;
      $$("[data-tip]").forEach((x) => x.classList.toggle("active", x === b));
      $("#fTarihEt").textContent = formTip === "sat" ? t("lmp_label") : t("edd_label");
      const v = $("#fTarih").value;
      if (v) $("#fTarih").value = gunEkle(v, formTip === "tdt" ? 280 : -280);
    });
    $("#fKaydet").onclick = () => {
      const yas = +$("#fYas").value, boy = +$("#fBoy").value, kilo = parseFloat(String($("#fKilo").value).replace(",", "."));
      const tarih = $("#fTarih").value;
      if (!(yas >= 14 && yas <= 55)) return toast(t("err_age"));
      if (!(boy >= 130 && boy <= 210)) return toast(t("err_height"));
      if (!(kilo >= 35 && kilo <= 200)) return toast(t("err_weight"));
      if (!tarih) return toast(t("err_date"));
      const sat = formTip === "sat" ? tarih : gunEkle(tarih, -280);
      const gun = Math.round((tarihCoz(gunAnahtari()) - tarihCoz(sat)) / 86400000);
      if (gun < 0) return toast(t("err_future"));
      if (gun > 300) return toast(t("err_old"));
      S.profil = { ad: $("#fAd").value.trim(), yas, boy, kilo, sat, aktivite: +$("#fAkt").value, ikiz: $("#fIkiz").checked };
      kaydet();
      $("#welcome").classList.add("hidden"); modalKapat();
      secHafta = null; diyetTri = null;
      git(aktifSayfa);
      bildirimEtiketle();
      toast(ilk ? t("welcome_toast") : t("profile_updated"));
    };
  }

  function temaUygula() { document.documentElement.setAttribute("data-theme", S.tema || "pudra"); }

  // ---------- Bildirimler (OneSignal) ----------
  const ONESIGNAL_APP_ID = "e63cede8-0c4a-4595-95e1-b879a9464c34";
  const YAYIN_HOST = "adgeregli-jpg.github.io";
  const bildirimDestek = () => location.host === YAYIN_HOST && "Notification" in window;
  function bildirimSirasi(fn) {
    if (location.host !== YAYIN_HOST) return;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(fn);
  }
  function bildirimBaslat() {
    bildirimSirasi(async (OS) => {
      await OS.init({
        appId: ONESIGNAL_APP_ID,
        serviceWorkerPath: "wait-for-me-mom/sw.js",
        serviceWorkerParam: { scope: "/wait-for-me-mom/" },
      });
      OS.User.PushSubscription.addEventListener("change", () => { if (aktifSayfa === "ben") bildirimKartiDoldur(); });
    });
    bildirimEtiketle();
  }
  // Gönderilecek mesajları dile ve gebelik haftasına göre seçebilmek için etiketler
  function bildirimEtiketle() {
    bildirimSirasi(async (OS) => {
      try {
        OS.User.setLanguage(AKTIF_DIL);
        if (!S.profil) return;
        const g = gebelik();
        const [y, m, d] = S.profil.sat.split("-").map(Number);
        // sat_gun: son adet tarihinin UTC gün numarası; günlük gönderim betiği haftayı buradan hesaplar
        OS.User.addTags({ sat_gun: String(Math.round(Date.UTC(y, m - 1, d) / 86400000)), hafta: String(Math.max(0, g.hafta)), trimester: String(g.tri), dil: AKTIF_DIL });
      } catch (e) { /* bildirim servisi yoksa sessizce geç */ }
    });
  }
  const iosTarayici = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator.standalone || matchMedia("(display-mode: standalone)").matches);
  function bildirimKartiDoldur() {
    const kutu = $("#bildirimKutu");
    if (!kutu) return;
    if (!bildirimDestek()) {
      kutu.innerHTML = `<p class="small muted" style="margin:0">${iosTarayici() ? t("notif_ios") : t("notif_unavailable")}</p>`;
      return;
    }
    bildirimSirasi(async (OS) => {
      const acik = OS.User.PushSubscription.optedIn && Notification.permission === "granted";
      if (Notification.permission === "denied") {
        kutu.innerHTML = `<div class="alert warn small" style="margin:0">${t("notif_denied")}</div>`;
        return;
      }
      kutu.innerHTML = acik
        ? `<div class="row" style="justify-content:space-between"><span class="status-pill st-good">${t("notif_active")}</span><button class="btn light small" id="bildirimBtn" style="flex:0 0 auto">${t("notif_off_btn")}</button></div>`
        : `<button class="btn block" id="bildirimBtn">${t("notif_on_btn")}</button>`;
      $("#bildirimBtn").onclick = async () => {
        if (acik) { await OS.User.PushSubscription.optOut(); toast(t("notif_off_toast")); }
        else {
          await OS.Notifications.requestPermission();
          if (Notification.permission === "granted") { await OS.User.PushSubscription.optIn(); bildirimEtiketle(); toast(t("notif_on_toast")); }
        }
        bildirimKartiDoldur();
      };
    });
  }

  // ---------- Başlat ----------
  function baslat() {
    yukle();
    dilSec(varsayilanDil());
    temaUygula();
    const ls = $("#langSel");
    if (ls) {
      ls.innerHTML = DILLER.map((d) => `<option value="${d.kod}">${d.bayrak} ${d.ad}</option>`).join("");
      ls.value = AKTIF_DIL;
      ls.onchange = () => { dilSec(ls.value); kaydet(); bildirimEtiketle(); ciz(); };
    }
    $$(".nav button").forEach((b) => b.onclick = () => { if (b.dataset.p === "beslenme") secGun = gunAnahtari(); git(b.dataset.p); });
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") modalKapat(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") modalKapat(); });
    bildirimBaslat();
    if (!S.profil) profilFormu(true);
    else git("bugun");
  }
  document.addEventListener("DOMContentLoaded", baslat);
})();
