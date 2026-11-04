// Motivasyon cümleleri, günün bilgileri ve örnek diyet menüleri

const MOTIVASYON = {
  genel: [
    "Şu an içinde bir kalp atıyor ve o kalp seninle büyüyor. Sen mucizenin ta kendisisin. 💗",
    "Her gün biraz daha güçlüsün; bedenin inanılmaz bir iş başarıyor.",
    "Mükemmel olmak zorunda değilsin. Sevgiyle yaptığın her şey bebeğine yetiyor.",
    "Bugün kendine iyi davranmak, bebeğine iyi davranmaktır.",
    "Yorgun hissetmen zayıf olduğun anlamına gelmez; bedenin bir hayat inşa ediyor.",
    "Bebeğin sesini duyuyor; ona bugün güzel bir şey söyle.",
    "Bir gün geriye baktığında, bu günlerin ne kadar özel olduğunu hatırlayacaksın.",
    "Kendi hızında ilerle. Her gebelik ve her anne farklıdır.",
    "Yardım istemek de bir güçtür. Etrafındakilere yaslanmaktan çekinme.",
    "Derin bir nefes al... Sen ve bebeğin birlikte nefes alıyorsunuz.",
    "Kendine ayırdığın 10 dakika bile bugünü güzelleştirmeye yeter.",
    "Endişelenmen ne kadar çok sevdiğini gösterir. Ama unutma: sen bu işi başarıyorsun.",
    "Bedeninin değişimi bir kayıp değil, sevgiyle yazılan bir hikâye.",
    "Bugün bir bardak su, bir avuç sevgi, bir parça sabır. Yeter de artar bile.",
    "Annelik doğumla değil, şimdi, bu kalp atışlarıyla başladı.",
    "Kendini başkalarıyla kıyaslama; senin yolculuğun eşsiz.",
    "Bebeğin seni tanıyor: kalp atışını, sesini, kahkahanı. En güzel melodisi sensin.",
    "Bazı günler zor geçer. Bu, iyi bir anne olmadığın anlamına gelmez.",
    "Her öğünde bebeğine sevgi gönderiyorsun.",
    "Sabırla bekle, güzel şeyler zaman alır. En güzeli de yolda. 🌸",
  ],
  1: [
    "Bulantılı günler geçici; bebeğin şu an organlarını oluşturuyor ve sen ona yuva oluyorsun.",
    "Bu haftalarda çok yorgun hissetmen normal. Dinlenmek bir ihtiyaç, tembellik değil.",
    "Henüz kimse görmüyor olabilir ama içinde dünyanın en büyük mucizesi gerçekleşiyor.",
    "Yiyebildiğin kadarını ye; bu dönemde kalite, miktardan daha önemli.",
  ],
  2: [
    "Enerjin geri geliyor! Bu güzel dönemin tadını çıkar.",
    "O minik kıpırtılar 'buradayım anne' demenin en tatlı yolu.",
    "Karnındaki her santim, bebeğinin büyüdüğünün en güzel kanıtı.",
    "Bebeğin artık seni duyuyor; ona şarkı söylemeye ne dersin? 🎶",
  ],
  3: [
    "Son düzlüktesin! Her gün kavuşmaya bir adım daha yakınsın.",
    "Bedenin doğum için hazırlanıyor; ona güven, o ne yapacağını biliyor.",
    "Uykusuz geceler bile bir hazırlık; sen zaten bir anne gibi düşünüyorsun.",
    "Çok yakında o küçük elleri tutacaksın. 👶",
  ],
  dengeli: [
    "Harika! Bugün dengeli beslendin, bebeğin bunun için sana teşekkür ediyor. 🌿",
    "Tam kararında! Bedenini ve bebeğini çok güzel besledin.",
    "Bugünkü tabağın tam bir sevgi tabağı. Böyle devam!",
  ],
  eksik: [
    "Bugün biraz az enerji aldın. Sorun değil; bir kase yoğurt ya da bir avuç kuruyemişle tamamlayabilirsin.",
    "Bazı günler iştah olmaz, bu çok normal. Küçük ve besleyici bir ara öğün iyi gelebilir.",
    "Bebeğinin ihtiyacı için biraz daha enerjiye ihtiyacın var. Kendini zorlamadan, sevdiğin sağlıklı bir şey ye.",
  ],
  fazla: [
    "Bugün biraz fazla oldu, dert etme! Bir gün her şeyi belirlemez; yarın yeniden dengeyi bulursun.",
    "Kendini suçlama; gebelikte iştah dalgalanır. Yarın sebze ve proteine biraz daha ağırlık verebilirsin.",
    "Bazen canın çeker, bu çok insani. Kısa bir yürüyüş hem sana hem bebeğe iyi gelir.",
  ],
  rozet: [
    "Yeni bir hedefi tamamladın! 🏅",
    "Süpersin! Bebeğin bugün bunun için büyüyor. ✨",
    "Bir hedef daha tamam; kendinle gurur duy!",
  ],
};

const GUNUN_BILGISI = {
  1: [
    "Folik asit, bebeğin nöral tüpünün kapanmasına yardım eder; bu süreç gebeliğin ilk 4 haftasında tamamlanır.",
    "Zencefil (az miktarda, çay ya da yemeğe katarak) bazı annelerde bulantıyı hafifletebilir.",
    "Kafein sınırı günde 200 mg: yaklaşık 2 fincan Türk kahvesi ya da 5-6 ince belli bardak çay.",
    "Kediniz varsa kum kabını başkası temizlesin; toksoplazma riskini azaltır.",
    "Bulantı varken soğuk yiyecekler (yoğurt, ayran, meyve) sıcak yemeklere göre daha kolay yenebilir.",
    "Dinlenmek bu dönemin en önemli ihtiyaçlarından biri; kısa gündüz uykuları iyi gelir.",
    "C vitamini (portakal, biber, maydanoz) bitkisel demirin emilimini 2-3 kata kadar artırabilir.",
    "İlk trimesterde ek kalori gerekmez; önemli olan besin çeşitliliğidir.",
  ],
  2: [
    "Bebeğin kemikleri için kalsiyum şart; yeterli almazsan bebek bunu senin kemiklerinden alır.",
    "Gebelikte kan hacmi yaklaşık %50 artar; bu yüzden demir ve sıvı ihtiyacın yükselir.",
    "Sol yanına yatmak rahme ve bebeğe giden kan akışını artırır.",
    "Haftada 150 dakika orta tempolu aktivite (yürüyüş, yüzme) gebelikte önerilir; doktor onayıyla.",
    "Bebek 18. haftadan itibaren seni duyuyor; kitap okumak ya da müzik dinletmek bağ kurmanın güzel bir yolu.",
    "Bacak kramplarına germe hareketleri, yeterli sıvı ve dengeli beslenme iyi gelebilir.",
    "Şeker yükleme testi 24-28. haftalarda yapılır; gebelik şekerini erken yakalamak çok önemlidir.",
    "Tam tahıllar kan şekerini yavaş yükseltir; beyaz ekmek yerine tam buğday tercih et.",
  ],
  3: [
    "28. haftadan itibaren bebek hareketlerini günlük takip etmek önerilir (2 saatte 10 hareket gibi).",
    "Bebek son 3 ayda ağırlığının büyük kısmını kazanır; protein ve sağlıklı yağlar bu yüzden önemli.",
    "Mide yanması için yemekten sonra 2-3 saat uzanmamak ve başını hafif yüksek tutmak iyi gelir.",
    "Ayaklarını gün içinde 15-20 dakika yukarı kaldırmak ödemi azaltabilir.",
    "Doğum çantasına: kimlik, gebelik dosyası, rahat kıyafetler, bebek için zıbın ve battaniye.",
    "Hurma, son haftalarda bazı annelerin tercih ettiği doğal bir enerji kaynağıdır (gebelik şekeri varsa dikkat).",
    "Nefes egzersizleri doğumda ve kaygılı anlarda sakinleşmene yardım eder.",
    "Anne sütü için hazırlık: dengeli beslenmeye doğumdan sonra da devam etmek emzirmeyi destekler.",
  ],
};

// Örnek diyet menüleri – her öğün besin veritabanındaki kimliklerle eşleşir: [id, porsiyon çarpanı]
const DIYET_MENULERI = [
  {
    tri: 1, ad: "Bulantı dostu gün", aciklama: "Mide bulantısı olan günler için hafif, soğuk ve kuru seçenekler; az ve sık öğün.",
    ogunler: [
      { ogun: "kahvalti", ad: "Kahvaltı", metin: "Yataktan kalkmadan 3 kraker, ardından 1 haşlanmış yumurta, lor peyniri, tam buğday ekmeği, domates", items: [["kraker", 0.6], ["yumurta", 1], ["lor", 1], ["tam_ekmek", 1], ["domates", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "1 muz + 1 bardak ayran", items: [["muz", 1], ["ayran", 1]] },
      { ogun: "ogle", ad: "Öğle", metin: "Mercimek çorbası (limonlu), yoğurt, tam buğday ekmeği", items: [["mercimek_corba", 1], ["yogurt", 0.5], ["tam_ekmek", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "1 elma + 10 badem", items: [["elma", 1], ["badem", 1]] },
      { ogun: "aksam", ad: "Akşam", metin: "Izgara tavuk, bulgur pilavı, mevsim salata", items: [["tavuk_gogus", 1], ["bulgur", 0.7], ["salata", 1]] },
      { ogun: "ara", ad: "Gece", metin: "1 bardak süt", items: [["sut", 1]] },
    ],
  },
  {
    tri: 1, ad: "Folat odaklı gün", aciklama: "Bebeğin sinir sistemi gelişimi için folattan zengin yeşil yapraklı sebze ve baklagiller.",
    ogunler: [
      { ogun: "kahvalti", ad: "Kahvaltı", metin: "Ispanaklı omlet, beyaz peynir, tam buğday ekmeği, yeşil biber", items: [["omlet", 1], ["beyaz_peynir", 1], ["tam_ekmek", 1], ["biber", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "1 portakal + 3 ceviz", items: [["portakal", 1], ["ceviz", 1]] },
      { ogun: "ogle", ad: "Öğle", metin: "Nohut yemeği, bulgur pilavı, cacık", items: [["nohut", 1], ["bulgur", 0.7], ["yogurt", 0.5]] },
      { ogun: "ara", ad: "Ara öğün", metin: "1 kase çilek + süzme yoğurt", items: [["cilek", 1], ["suzme", 1]] },
      { ogun: "aksam", ad: "Akşam", metin: "Buharda brokoli, fırın somon, salata", items: [["brokoli", 1], ["somon", 0.8], ["salata", 1]] },
    ],
  },
  {
    tri: 2, ad: "Demir & kalsiyum günü", aciklama: "Artan kan hacmi için demir, bebeğin kemikleri için kalsiyum. Yaklaşık +340 kcal'lik ihtiyaca uygun.",
    ogunler: [
      { ogun: "kahvalti", ad: "Kahvaltı", metin: "2 haşlanmış yumurta, beyaz peynir, tahin-pekmez, tam buğday ekmeği, domates-biber", items: [["yumurta", 2], ["beyaz_peynir", 1], ["tahin_pekmez", 0.7], ["tam_ekmek", 2], ["domates", 1], ["biber", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "5 kuru kayısı + 1 bardak kefir", items: [["kayisi_kuru", 1], ["kefir", 1]] },
      { ogun: "ogle", ad: "Öğle", metin: "Kuru fasulye, bulgur pilavı, çoban salata (limonlu)", items: [["kuru_fasulye", 1], ["bulgur", 1], ["coban", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "Yoğurt + 1 kase meyve", items: [["yogurt", 1], ["cilek", 1]] },
      { ogun: "aksam", ad: "Akşam", metin: "Etli sebze yemeği, yoğurt, tam buğday ekmeği", items: [["et_sebze", 1], ["yogurt", 0.5], ["tam_ekmek", 1]] },
      { ogun: "ara", ad: "Gece", metin: "1 bardak süt + 2 kuru incir", items: [["sut", 1], ["incir_kuru", 0.7]] },
    ],
  },
  {
    tri: 2, ad: "Balık & omega-3 günü", aciklama: "Bebeğin beyin ve göz gelişimi için civası düşük balık; haftada 2 kez önerilir.",
    ogunler: [
      { ogun: "kahvalti", ad: "Kahvaltı", metin: "Sütlü yulaf, 1 muz, 3 ceviz", items: [["yulaf", 1], ["muz", 1], ["ceviz", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "2 kivi + 1 avuç leblebi", items: [["kivi", 1], ["leblebi", 1]] },
      { ogun: "ogle", ad: "Öğle", metin: "Ezogelin çorbası, ıspanaklı gözleme, ayran", items: [["ezogelin", 1], ["gozleme", 1], ["ayran", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "Süzme yoğurt + 1 tatlı kaşığı bal", items: [["suzme", 1], ["bal", 1]] },
      { ogun: "aksam", ad: "Akşam", metin: "Fırın hamsi ya da sardalya, mevsim salata, haşlanmış patates", items: [["hamsi", 1], ["salata", 1], ["patates", 1]] },
    ],
  },
  {
    tri: 3, ad: "Mide yanması dostu gün", aciklama: "Az ve sık öğün, az yağlı ve az baharatlı; yaklaşık +450 kcal ihtiyacına uygun.",
    ogunler: [
      { ogun: "kahvalti", ad: "Kahvaltı", metin: "Haşlanmış yumurta, lor peyniri, tam buğday ekmeği, salatalık, avokado", items: [["yumurta", 2], ["lor", 1], ["tam_ekmek", 2], ["salatalik", 1], ["avokado", 0.5]] },
      { ogun: "ara", ad: "Ara öğün", metin: "1 armut + 10 badem", items: [["armut", 1], ["badem", 1]] },
      { ogun: "ogle", ad: "Öğle", metin: "Yeşil mercimek yemeği, yoğurt, tam buğday ekmeği", items: [["yesil_mercimek", 1], ["yogurt", 1], ["tam_ekmek", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "Muzlu-süt smoothie", items: [["smoothie", 1]] },
      { ogun: "aksam", ad: "Akşam", metin: "Fırın tavuk but, zeytinyağlı taze fasulye, bulgur pilavı", items: [["tavuk_but", 1], ["taze_fasulye", 1], ["bulgur", 0.7]] },
      { ogun: "ara", ad: "Gece", metin: "1 kase yoğurt", items: [["yogurt", 0.7]] },
    ],
  },
  {
    tri: 3, ad: "Protein & lif günü", aciklama: "Bebeğin hızlı büyümesi için protein, kabızlığa karşı lif ve bol sıvı.",
    ogunler: [
      { ogun: "kahvalti", ad: "Kahvaltı", metin: "Menemen, kaşar, tam buğday ekmeği, zeytin", items: [["menemen", 1], ["kasar", 1], ["tam_ekmek", 2], ["zeytin", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "3 kuru incir + 1 bardak süt", items: [["incir_kuru", 1], ["sut", 1]] },
      { ogun: "ogle", ad: "Öğle", metin: "Izgara köfte, bulgur pilavı, çoban salata, ayran", items: [["kofte", 1], ["bulgur", 1], ["coban", 1], ["ayran", 1]] },
      { ogun: "ara", ad: "Ara öğün", metin: "Humus + havuç/salatalık", items: [["humus", 1], ["salatalik", 1]] },
      { ogun: "aksam", ad: "Akşam", metin: "Levrek ızgara, brokoli, yoğurt", items: [["levrek", 1], ["brokoli", 1], ["yogurt", 0.5]] },
      { ogun: "ara", ad: "Gece", metin: "1 portakal + 3 ceviz", items: [["portakal", 1], ["ceviz", 1]] },
    ],
  },
];
