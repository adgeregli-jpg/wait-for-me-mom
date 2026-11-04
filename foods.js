// Türk mutfağı besin veritabanı (yaklaşık değerler, tavsiye niteliğindedir)
// f(id, ad, emoji, kategori, porsiyon, kcal, protein(g), besin etiketleri, "neye iyi gelir", uyarı, uyarı seviyesi, kafein mg)

const KATEGORILER = [
  { id: "hepsi", ad: "Hepsi" },
  { id: "kahvalti", ad: "Kahvaltılık" },
  { id: "sut", ad: "Süt ürünleri" },
  { id: "et", ad: "Et & tavuk" },
  { id: "balik", ad: "Balık" },
  { id: "baklagil", ad: "Baklagil" },
  { id: "sebze", ad: "Sebze yemekleri" },
  { id: "corba", ad: "Çorbalar" },
  { id: "tahil", ad: "Tahıl & hamur" },
  { id: "meyve", ad: "Meyveler" },
  { id: "kuruyemis", ad: "Kuruyemiş" },
  { id: "icecek", ad: "İçecekler" },
  { id: "tatli", ad: "Tatlı & atıştırma" },
  { id: "dikkat", ad: "⚠️ Dikkat" },
];

// Takip edilen besin öğeleri: günlük hedef "porsiyon sayısı" olarak
const BESIN_OGELERI = {
  folat:    { ad: "Folat",     e: "🥬", hedef: 3, aciklama: "Bebeğin beyin ve omurilik (nöral tüp) gelişimi için çok önemli. Özellikle ilk 3 ayda kritik.", kaynak: "Ispanak, pazı, brokoli, mercimek, nohut, portakal, avokado" },
  demir:    { ad: "Demir",     e: "🩸", hedef: 3, aciklama: "Kansızlığı önler; bebeğe oksijen taşınmasına yardım eder. Gebelikte ihtiyaç belirgin artar.", kaynak: "Kırmızı et, kuru baklagil, pekmez, kuru kayısı, tahin, yeşil yapraklılar" },
  kalsiyum: { ad: "Kalsiyum",  e: "🥛", hedef: 3, aciklama: "Bebeğin kemik ve diş gelişimi; annenin kemiklerini de korur. Günde en az 2 bardak süt/yoğurt önerilir.", kaynak: "Süt, yoğurt, ayran, peynir, kefir, tahin, kuru incir" },
  protein:  { ad: "Protein",   e: "🍳", hedef: 4, aciklama: "Bebeğin doku, kas ve organ gelişiminin yapı taşı. Rahim ve göğüs dokusunun büyümesini de destekler.", kaynak: "Yumurta, et, tavuk, balık, baklagiller, yoğurt, peynir" },
  omega3:   { ad: "Omega-3",   e: "🐟", hedef: 1, aciklama: "DHA, bebeğin beyin ve göz (retina) gelişimini destekler. Haftada 2 porsiyon civası düşük balık önerilir.", kaynak: "Somon, hamsi, sardalya, levrek, ceviz" },
  lif:      { ad: "Lif",       e: "🌾", hedef: 4, aciklama: "Gebelikte sık görülen kabızlığı azaltır, kan şekerini dengeler.", kaynak: "Tam buğday ekmeği, bulgur, yulaf, sebze, meyve, kuru baklagil" },
  cvit:     { ad: "C vitamini", e: "🍊", hedef: 2, aciklama: "Bağışıklığı destekler ve bitkisel kaynaklı demirin emilimini artırır.", kaynak: "Portakal, mandalina, kivi, biber, domates, maydanoz, çilek" },
};

const BESINLER = [];
function f(id, ad, e, kat, porsiyon, kcal, protein, etiket, fayda, uyari, seviye, kafein) {
  BESINLER.push({ id, ad, e, kat, porsiyon, kcal, protein, etiket: etiket || [], fayda, uyari: uyari || "", seviye: seviye || "", kafein: kafein || 0 });
}

// --- Kahvaltılık ---
f("yumurta", "Haşlanmış yumurta", "🥚", "kahvalti", "1 adet", 75, 6, ["protein"], "Kaliteli protein ve kolin içerir; kolin bebeğin beyin gelişimini destekler. Sarısında D vitamini bulunur.", "Gebelikte yumurtayı katı pişmiş tüketin; rafadan/akışkan sarı önerilmez.", "dikkat");
f("menemen", "Menemen", "🍳", "kahvalti", "1 porsiyon (2 yumurta)", 220, 13, ["protein", "cvit"], "Yumurtadan protein, domates ve biberden C vitamini sağlar.", "Yumurtanın iyice pişmesine dikkat edin.", "dikkat");
f("omlet", "Sebzeli omlet", "🍳", "kahvalti", "1 porsiyon (2 yumurta)", 200, 13, ["protein", "folat"], "Ispanak/biber eklenirse folat ve vitamin kazancı artar.");
f("beyaz_peynir", "Beyaz peynir (pastörize)", "🧀", "kahvalti", "1 dilim (30 g)", 80, 5, ["kalsiyum", "protein"], "Kalsiyum ve protein kaynağı; bebeğin kemik gelişimini destekler.", "Tuzu yüksektir, ödem varsa miktarı azaltın. Mutlaka pastörize sütten yapılmış olsun.", "");
f("kasar", "Kaşar peyniri", "🧀", "kahvalti", "1 dilim (30 g)", 110, 7, ["kalsiyum", "protein"], "Yüksek kalsiyum içerir; kemik ve diş gelişimi için değerlidir.");
f("lor", "Lor peyniri", "🧀", "kahvalti", "2 yemek kaşığı (50 g)", 50, 6, ["kalsiyum", "protein"], "Düşük yağlı, tuzu az; hafif ve proteinli bir seçenek.");
f("zeytin", "Zeytin", "🫒", "kahvalti", "5 adet", 40, 0.3, [], "Sağlıklı tekli doymamış yağlar içerir.", "Tuzludur; ödem ve tansiyon sorununda azaltın.", "");
f("tam_ekmek", "Tam buğday ekmeği", "🍞", "kahvalti", "1 dilim", 70, 3, ["lif", "folat"], "Lif kabızlığa iyi gelir; B vitaminleri enerji metabolizmasını destekler.");
f("beyaz_ekmek", "Beyaz ekmek", "🥖", "kahvalti", "1 dilim", 75, 2.5, [], "Hızlı enerji verir ancak lifi düşüktür; tam tahıllı ekmek tercih etmek daha iyidir.");
f("simit", "Simit", "🥯", "kahvalti", "1 adet", 280, 9, [], "Susamı biraz kalsiyum sağlar; enerjisi yüksektir.");
f("pogaca", "Poğaça", "🥐", "kahvalti", "1 adet", 250, 5, [], "Enerji verir ama yağ ve beyaz un oranı yüksektir; ara sıra tercih edin.");
f("bal", "Bal", "🍯", "kahvalti", "1 tatlı kaşığı", 30, 0, [], "Doğal tatlandırıcı; az miktarda enerji verir.", "Şeker içeriği yüksektir; gebelik şekeri varsa doktorunuza danışın.", "");
f("pekmez", "Üzüm/dut pekmezi", "🍯", "kahvalti", "1 yemek kaşığı", 60, 0, ["demir"], "Demir içerir; C vitamini ile birlikte alınırsa emilimi artar.");
f("tahin", "Tahin", "🥄", "kahvalti", "1 yemek kaşığı", 90, 3, ["kalsiyum", "demir"], "Susamdan gelen kalsiyum, demir ve sağlıklı yağ kaynağı.");
f("tahin_pekmez", "Tahin-pekmez", "🥄", "kahvalti", "1+1 yemek kaşığı", 150, 3, ["demir", "kalsiyum"], "Klasik demir + kalsiyum ikilisi; enerji verir, kansızlığa karşı destek olur.");
f("yulaf", "Yulaf ezmesi (sütlü)", "🥣", "kahvalti", "4 yk yulaf + 1 bardak süt", 270, 12, ["lif", "kalsiyum", "demir", "protein"], "Uzun süre tok tutar, kan şekerini dengeler, kabızlığa iyi gelir.");
f("domates", "Domates", "🍅", "kahvalti", "1 orta boy", 20, 1, ["cvit"], "C vitamini ve likopen içerir; demir emilimine yardımcı olur.");
f("salatalik", "Salatalık", "🥒", "kahvalti", "1 adet", 15, 0.7, [], "Su oranı yüksektir; hafif ve ferahlatıcıdır.");
f("biber", "Yeşil biber", "🫑", "kahvalti", "2 adet", 10, 0.4, ["cvit"], "Portakaldan bile fazla C vitamini içerebilir.");
f("tereyagi", "Tereyağı", "🧈", "kahvalti", "1 tatlı kaşığı", 35, 0, [], "A vitamini içerir; az miktarda tüketin.");
f("recel", "Reçel", "🍓", "kahvalti", "1 yemek kaşığı", 50, 0, [], "Enerji verir ama şeker oranı yüksektir.");
f("sucuk", "Sucuk", "🌭", "kahvalti", "3 dilim", 130, 6, ["protein"], "Protein içerir.", "İşlenmiş et; tuz ve yağ oranı yüksek. Mutlaka iyice pişirilmiş tüketin, sık tüketmeyin.", "dikkat");
f("avokado", "Avokado", "🥑", "kahvalti", "Yarım adet", 160, 2, ["folat", "lif"], "Folat, potasyum ve sağlıklı yağ kaynağı; bacak kramplarına iyi gelebilir.");

// --- Süt ürünleri ---
f("sut", "Süt", "🥛", "sut", "1 su bardağı (200 ml)", 120, 6.5, ["kalsiyum", "protein"], "Kalsiyum, protein ve iyot kaynağı; bebeğin kemikleri ve annenin kemik sağlığı için.");
f("yogurt", "Yoğurt", "🥣", "sut", "1 kase (200 g)", 120, 7, ["kalsiyum", "protein"], "Kalsiyum ve probiyotik içerir; sindirime ve bağırsak sağlığına iyi gelir.");
f("suzme", "Süzme yoğurt", "🥣", "sut", "100 g", 90, 9, ["kalsiyum", "protein"], "Proteini yüksek; tok tutan bir ara öğün.");
f("ayran", "Ayran", "🥛", "sut", "1 bardak", 75, 3.5, ["kalsiyum"], "Sıvı ve kalsiyum desteği; yemek yanında iyi bir içecek.");
f("kefir", "Kefir", "🥛", "sut", "1 bardak", 110, 6, ["kalsiyum", "protein"], "Probiyotik açısından zengin; sindirimi ve bağışıklığı destekler.");
f("sutlac", "Sütlaç", "🍮", "sut", "1 kase", 260, 7, ["kalsiyum"], "Sütten kalsiyum alırsınız; tatlı isteğini sağlıklıya yakın karşılar.", "Şekerlidir, porsiyonu küçük tutun.", "");
f("dondurma", "Dondurma", "🍨", "sut", "1 top", 140, 2.5, ["kalsiyum"], "Biraz kalsiyum içerir.", "Şekerlidir; ara sıra tercih edin.", "");

// --- Et & tavuk ---
f("kofte", "Izgara köfte", "🍖", "et", "4 adet (~100 g)", 230, 18, ["protein", "demir"], "Hem demiri (vücutta kolay emilen demir) ve protein sağlar.", "Köftenin içi tamamen pişmiş olmalı.", "dikkat");
f("dana_et", "Dana eti (haşlama/sote)", "🥩", "et", "100 g", 200, 26, ["protein", "demir"], "En iyi demir kaynaklarından biri; ayrıca B12 ve çinko içerir.", "Az pişmiş/kanlı et tüketmeyin.", "dikkat");
f("tavuk_gogus", "Tavuk göğsü ızgara", "🍗", "et", "100 g", 165, 31, ["protein"], "Yağı düşük, yüksek kaliteli protein; bebeğin doku gelişimi için.");
f("tavuk_but", "Tavuk but (fırın)", "🍗", "et", "100 g", 210, 26, ["protein", "demir"], "Protein ve göğüse göre biraz daha fazla demir içerir.");
f("et_sebze", "Etli sebze yemeği", "🍲", "et", "1 porsiyon", 250, 15, ["protein", "demir", "lif"], "Et ve sebzeyi birlikte sunar; dengeli bir ana öğün.");
f("ciger", "Dana ciğeri", "🥩", "et", "100 g", 175, 26, ["demir", "folat", "protein"], "Demir ve folat açısından çok zengin.", "A vitamini (retinol) çok yüksektir; gebelikte fazla A vitamini bebeğe zarar verebilir. Sık tüketmeyin, doktorunuza danışın.", "dikkat");
f("karniyarik", "Karnıyarık", "🍆", "et", "1 adet", 350, 14, ["protein", "lif"], "Patlıcandan lif, kıymadan protein sağlar.");
f("manti", "Mantı (yoğurtlu)", "🥟", "et", "1 porsiyon", 450, 18, ["protein", "kalsiyum"], "Yoğurdu ile kalsiyum, kıymasıyla protein içerir.");
f("lahmacun", "Lahmacun", "🫓", "et", "1 adet", 300, 12, ["protein"], "Protein ve enerji verir; yanına salata ekleyin.");
f("pide", "Kıymalı pide", "🫓", "et", "1 porsiyon", 600, 25, ["protein"], "Doyurucu ama enerjisi yüksek; yarım porsiyon + salata iyi bir seçimdir.");
f("doner", "Tavuk döner dürüm", "🌯", "et", "1 adet", 500, 30, ["protein"], "Protein açısından zengin.", "Dışarıda yenen dönerin iyice pişmiş ve taze olmasına dikkat edin.", "dikkat");

// --- Balık ---
f("somon", "Somon (ızgara/fırın)", "🐟", "balik", "150 g", 300, 30, ["omega3", "protein"], "DHA (omega-3) bakımından çok zengin; bebeğin beyin ve göz gelişimi için. D vitamini de içerir.");
f("hamsi", "Hamsi (fırın/tava)", "🐟", "balik", "150 g", 330, 25, ["omega3", "kalsiyum", "protein"], "Civası düşük; omega-3 ve kılçığıyla yenirse kalsiyum sağlar.");
f("sardalya", "Sardalya", "🐟", "balik", "100 g", 210, 25, ["omega3", "kalsiyum", "protein"], "Omega-3, kalsiyum ve D vitamini kaynağı; civası düşüktür.");
f("levrek", "Levrek / çupra ızgara", "🐠", "balik", "150 g", 200, 30, ["omega3", "protein"], "Hafif, proteinli ve omega-3 içeren bir balık.");
f("ton", "Ton balığı (konserve)", "🥫", "balik", "80 g", 110, 20, ["protein", "omega3"], "Pratik protein kaynağı.", "Civa içerebilir; haftada 1-2 porsiyonla sınırlayın.", "dikkat");
f("kilic", "Kılıç balığı", "🐟", "balik", "150 g", 230, 30, ["protein"], "", "Civası yüksektir. Gebelikte tüketilmemesi önerilir.", "kacin");

// --- Baklagil ---
f("kuru_fasulye", "Kuru fasulye", "🫘", "baklagil", "1 porsiyon", 250, 13, ["demir", "folat", "lif", "protein"], "Demir, folat, lif ve bitkisel protein deposu. Yanına salata/limon eklemek demir emilimini artırır.");
f("nohut", "Nohut yemeği", "🫘", "baklagil", "1 porsiyon", 260, 12, ["folat", "demir", "lif", "protein"], "Folat ve lif açısından zengin; tok tutar.");
f("barbunya", "Zeytinyağlı barbunya", "🫘", "baklagil", "1 porsiyon", 220, 10, ["demir", "lif", "folat"], "Lif ve demir kaynağı; kan şekerini dengeler.");
f("yesil_mercimek", "Yeşil mercimek yemeği", "🫘", "baklagil", "1 porsiyon", 220, 12, ["demir", "folat", "lif", "protein"], "Folat ve demirden zengin; et yemediğiniz günler için ideal.");
f("humus", "Humus", "🥙", "baklagil", "3 yemek kaşığı", 120, 4, ["folat", "lif"], "Nohut + tahin; lif, folat ve biraz kalsiyum sağlar.");
f("mercimek_kofte", "Mercimek köftesi", "🥙", "baklagil", "4 adet", 200, 8, ["demir", "lif"], "Bulgur ve mercimekten lif ve demir; marul ve limonla harika.");
f("leblebi", "Leblebi", "🥜", "baklagil", "1 avuç (30 g)", 110, 6, ["protein", "lif"], "Pratik, proteinli ve lifli bir ara öğün.");

// --- Sebze yemekleri ---
f("ispanak", "Ispanak yemeği", "🥬", "sebze", "1 porsiyon", 150, 5, ["folat", "demir", "kalsiyum", "lif"], "Folat, demir ve kalsiyum içerir. Yoğurtla birlikte çok besleyicidir.");
f("pazi", "Pazı kavurma / yemeği", "🥬", "sebze", "1 porsiyon", 120, 4, ["folat", "demir", "lif"], "Folat ve demir kaynağı yeşil yapraklı sebze.");
f("brokoli", "Brokoli (buharda)", "🥦", "sebze", "1 kase", 55, 4, ["folat", "cvit", "kalsiyum", "lif"], "Folat, C vitamini, kalsiyum ve lif; gebeliğin süper sebzelerinden.");
f("taze_fasulye", "Zeytinyağlı taze fasulye", "🫛", "sebze", "1 porsiyon", 160, 3, ["lif", "folat"], "Lif ve folat içerir; hafif bir öğün.");
f("kabak", "Kabak yemeği", "🥒", "sebze", "1 porsiyon", 130, 3, ["lif"], "Hafif ve kolay sindirilir; mide bulantısı olan günlerde iyi gelir.");
f("turlu", "Türlü", "🍲", "sebze", "1 porsiyon", 180, 5, ["lif", "cvit"], "Farklı sebzelerden çeşitli vitamin ve lif.");
f("imam", "İmam bayıldı", "🍆", "sebze", "1 porsiyon", 300, 4, ["lif"], "Lif içerir; zeytinyağından enerjisi yüksektir.");
f("sarma", "Zeytinyağlı yaprak sarma", "🍃", "sebze", "6 adet", 220, 4, ["lif"], "Lif ve enerji sağlar.");
f("salata", "Mevsim salata (zeytinyağlı)", "🥗", "sebze", "1 kase", 120, 2, ["cvit", "folat", "lif"], "Folat, C vitamini ve lif. Yemeklerin yanında demir emilimini de artırır.", "Yeşillikleri çok iyi yıkayın (toksoplazma riskine karşı).", "");
f("coban", "Çoban salata", "🥗", "sebze", "1 kase", 100, 2, ["cvit", "lif"], "Domates, biber ve maydanozdan bol C vitamini.", "Sebzeleri iyice yıkayın.", "");
f("patates", "Haşlanmış patates", "🥔", "sebze", "1 orta boy", 130, 3, [], "Potasyum ve enerji kaynağı.");
f("kizartma", "Patates kızartması", "🍟", "sebze", "1 porsiyon", 350, 4, [], "Enerji yüksek, besin değeri düşük; mide yanmasını artırabilir.");

// --- Çorbalar ---
f("mercimek_corba", "Mercimek çorbası", "🍲", "corba", "1 kase", 150, 8, ["folat", "demir", "lif", "protein"], "Folat, demir ve bitkisel protein; limon sıkarsanız demir emilimi artar.");
f("ezogelin", "Ezogelin çorbası", "🍲", "corba", "1 kase", 160, 7, ["folat", "lif"], "Mercimek ve bulgurdan lif ve folat.");
f("tavuk_corba", "Tavuk suyu çorba", "🍜", "corba", "1 kase", 120, 8, ["protein"], "Hafif, sıvı ve protein desteği; hasta/bulantılı günlerde iyi gelir.");
f("yayla", "Yayla çorbası", "🥣", "corba", "1 kase", 150, 6, ["kalsiyum"], "Yoğurt bazlı; kalsiyum ve sindirim dostu.");
f("domates_corba", "Domates çorbası", "🍅", "corba", "1 kase", 120, 3, ["cvit"], "C vitamini ve likopen içerir.");
f("sebze_corba", "Sebze çorbası", "🥕", "corba", "1 kase", 100, 3, ["lif", "cvit"], "Çeşitli sebzelerden vitamin ve lif; hafif bir öğün.");

// --- Tahıl & hamur ---
f("bulgur", "Bulgur pilavı", "🍚", "tahil", "1 porsiyon (150 g)", 230, 6, ["lif"], "Pirince göre lifi ve B vitaminleri daha yüksek; kan şekerini daha dengeli yükseltir.");
f("pirinc", "Pirinç pilavı", "🍚", "tahil", "1 porsiyon (150 g)", 300, 5, [], "Enerji verir; lif için bulgurla dönüşümlü tüketin.");
f("makarna", "Makarna", "🍝", "tahil", "1 porsiyon", 300, 10, [], "Enerji kaynağı; tam buğday makarna daha liflidir.");
f("tam_makarna", "Tam buğday makarna", "🍝", "tahil", "1 porsiyon", 280, 11, ["lif"], "Lif ve B vitaminleri açısından daha zengin.");
f("borek", "Peynirli börek", "🥧", "tahil", "1 dilim", 320, 10, ["kalsiyum"], "Peynirinden kalsiyum içerir ama yağ oranı yüksektir.");
f("gozleme", "Ispanaklı gözleme", "🫓", "tahil", "1 adet", 350, 11, ["folat", "kalsiyum"], "Ispanak ve peynirden folat ve kalsiyum.");

// --- Meyveler ---
f("portakal", "Portakal", "🍊", "meyve", "1 orta boy", 60, 1, ["cvit", "folat", "lif"], "Günlük C vitamini ihtiyacının büyük kısmını karşılar; folat da içerir.");
f("mandalina", "Mandalina", "🍊", "meyve", "2 adet", 70, 1, ["cvit"], "C vitamini ile bağışıklığı destekler.");
f("elma", "Elma", "🍎", "meyve", "1 orta boy", 80, 0.4, ["lif"], "Lif (pektin) kabızlığa iyi gelir; mide bulantısında da hafif bir seçenek.");
f("muz", "Muz", "🍌", "meyve", "1 adet", 105, 1.3, [], "Potasyum bacak kramplarına iyi gelebilir; bulantıda kolay yenir.");
f("armut", "Armut", "🍐", "meyve", "1 adet", 100, 0.6, ["lif"], "Lifi yüksektir; kabızlığa iyi gelir.");
f("cilek", "Çilek", "🍓", "meyve", "1 kase", 50, 1, ["cvit", "folat"], "C vitamini ve folat; düşük kalorili tatlı ihtiyacı.");
f("kivi", "Kivi", "🥝", "meyve", "2 adet", 85, 1.6, ["cvit", "lif"], "C vitamini çok yüksek; kabızlığa iyi gelir.");
f("nar", "Nar", "🍎", "meyve", "Yarım adet", 70, 1.4, ["cvit"], "Antioksidan ve C vitamini kaynağı.");
f("uzum", "Üzüm", "🍇", "meyve", "1 kase", 100, 1, [], "Enerji verir; şekeri yüksek olduğundan porsiyona dikkat.");
f("karpuz", "Karpuz", "🍉", "meyve", "1 dilim", 85, 1.7, [], "Su oranı çok yüksek; sıvı alımına ve ödemde ferahlamaya yardımcı.");
f("kayisi_kuru", "Kuru kayısı", "🍑", "meyve", "5 adet", 80, 1, ["demir", "lif"], "Demir ve lif kaynağı; kansızlığa ve kabızlığa iyi gelir.");
f("incir_kuru", "Kuru incir", "🟤", "meyve", "3 adet", 140, 2, ["kalsiyum", "lif", "demir"], "Kalsiyum ve lif açısından zengin kuru meyve.");
f("hurma", "Hurma", "🟤", "meyve", "3 adet", 70, 0.6, ["lif"], "Doğal enerji ve lif kaynağı.");

// --- Kuruyemiş ---
f("ceviz", "Ceviz", "🌰", "kuruyemis", "3 tam ceviz", 130, 3, ["omega3"], "Bitkisel omega-3 (ALA) içerir; beyin dostu bir atıştırmalık.");
f("badem", "Çiğ badem", "🌰", "kuruyemis", "10 adet", 70, 2.5, ["kalsiyum"], "Kalsiyum, E vitamini ve magnezyum içerir.");
f("findik", "Fındık", "🌰", "kuruyemis", "1 avuç (30 g)", 190, 4, [], "E vitamini ve sağlıklı yağ; enerjisi yüksektir.");
f("kabak_cekirdek", "Kabak çekirdeği (tuzsuz)", "🌰", "kuruyemis", "1 avuç (30 g)", 160, 9, ["demir", "protein"], "Demir, çinko ve magnezyum kaynağı.");

// --- İçecekler ---
f("portakal_suyu", "Taze portakal suyu", "🧃", "icecek", "1 bardak", 110, 1.5, ["cvit"], "Bol C vitamini; demirden zengin yemekle birlikte içilebilir.", "Meyvenin kendisi lif açısından daha iyidir.", "");
f("cay", "Çay", "🍵", "icecek", "1 ince belli bardak", 2, 0, [], "Sıvı alımına katkı.", "Kafein içerir (~30 mg). Yemekle birlikte içilirse demir emilimini azaltır; yemekten 1 saat sonra açık için.", "dikkat", 30);
f("turk_kahvesi", "Türk kahvesi", "☕", "icecek", "1 fincan", 10, 0, [], "", "Kafein içerir (~60 mg). Gebelikte günlük toplam kafein 200 mg'ı geçmemeli.", "dikkat", 60);
f("filtre_kahve", "Filtre kahve", "☕", "icecek", "1 kupa", 5, 0, [], "", "Kafein içerir (~95 mg). Gebelikte günlük toplam kafein 200 mg'ı geçmemeli.", "dikkat", 95);
f("kola", "Kola", "🥤", "icecek", "1 kutu", 140, 0, [], "", "Şeker ve kafein (~35 mg) içerir; gebelikte sınırlayın.", "dikkat", 35);
f("maden_suyu", "Maden suyu", "🫧", "icecek", "1 şişe", 0, 0, [], "Mineral desteği; mide yanmasında bazılarına iyi gelir.", "Sodyumu yüksek olabilir; ödemde günde 1'i geçmeyin.", "");
f("ihlamur", "Ihlamur", "🍵", "icecek", "1 fincan", 2, 0, [], "Sıcak sıvı, rahatlatıcı.", "Bitki çaylarının bazıları gebelikte önerilmez (ör. adaçayı, rezene fazlası). Düzenli içmeden önce doktorunuza danışın.", "dikkat");
f("smoothie", "Muzlu-süt smoothie", "🥤", "icecek", "1 bardak", 220, 8, ["kalsiyum", "protein"], "Bulantılı günlerde yemek yiyemiyorsanız besleyici bir alternatif.");

// --- Tatlı & atıştırma ---
f("baklava", "Baklava", "🍯", "tatli", "2 dilim", 330, 5, [], "Enerji verir.", "Şeker ve yağ oranı çok yüksek; özel günlere saklayın.", "dikkat");
f("sutlu_cik", "Sütlü çikolata", "🍫", "tatli", "30 g", 160, 2, [], "Keyif verir.", "Şekerlidir ve az miktar kafein içerir.", "", 6);
f("bitter_cik", "Bitter çikolata", "🍫", "tatli", "2 kare (20 g)", 110, 1.5, ["demir"], "Biraz demir ve magnezyum içerir.", "Kafein içerir (~20 mg).", "", 20);
f("biskuvi", "Bisküvi", "🍪", "tatli", "3 adet", 140, 2, [], "Sabah bulantısında yataktan kalkmadan birkaç kraker/bisküvi bazılarına iyi gelir.");
f("cips", "Cips", "🥔", "tatli", "1 küçük paket", 270, 3, [], "", "Tuz ve yağ çok yüksek; ödem ve mide yanmasını artırabilir.", "dikkat");
f("kek", "Ev yapımı kek", "🍰", "tatli", "1 dilim", 250, 4, [], "Enerji verir; tam buğday unu ile yapılırsa daha liflidir.");
f("kraker", "Tuzlu kraker", "🍘", "tatli", "5 adet", 90, 2, [], "Mide bulantısında kuru gıdalar iyi gelebilir.");

// --- Dikkat / kaçınılması gerekenler ---
f("cig_sut", "Çiğ süt / köy peyniri (pastörize değil)", "🚫", "dikkat", "1 porsiyon", 110, 6, ["kalsiyum"], "", "Pastörize edilmemiş süt ve ürünleri listeria bakterisi taşıyabilir; gebelikte kaçının.", "kacin");
f("cig_kofte_etli", "Etli çiğ köfte", "🚫", "dikkat", "1 porsiyon", 250, 12, [], "", "Çiğ et toksoplazma ve bakteri riski taşır; gebelikte tüketmeyin. (Etsiz çiğ köfte uygundur.)", "kacin");
f("cig_kofte_etsiz", "Etsiz çiğ köfte (dürüm)", "🌯", "dikkat", "1 dürüm", 300, 7, ["lif"], "Bulgurdan lif ve enerji.", "Tuzlu ve acılı olabilir; mide yanması ve ödeme dikkat.", "");
f("susi", "Suşi (çiğ balık)", "🍣", "dikkat", "6 parça", 250, 10, [], "", "Çiğ balık parazit ve bakteri riski taşır; gebelikte pişmiş balık tercih edin.", "kacin");
f("rafadan", "Rafadan / akışkan yumurta", "🥚", "dikkat", "1 adet", 75, 6, ["protein"], "Protein içerir.", "Az pişmiş yumurta salmonella riski taşır; katı pişmiş tüketin.", "kacin");
f("pastirma", "Pastırma", "🥩", "dikkat", "3 dilim", 120, 12, ["protein", "demir"], "Protein ve demir içerir.", "Çiğ kurutulmuş ettir; toksoplazma riskine karşı yalnızca pişmiş (yumurtalı, fırında) tüketin.", "dikkat");
f("alkol", "Alkollü içecek", "🚫", "dikkat", "1 kadeh", 120, 0, [], "", "Gebelikte güvenli bir alkol miktarı yoktur. Lütfen tüketmeyin.", "kacin");
f("enerji_icecegi", "Enerji içeceği", "🚫", "dikkat", "1 kutu", 110, 0, [], "", "Yüksek kafein ve şeker; gebelikte önerilmez.", "kacin", 80);
