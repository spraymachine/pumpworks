/* ============================================================
   Pumpworks — bench behaviour
   The hero is a test bench: hold the bar, the pump primes,
   the title fills with fuel and the gauges climb.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. Strings the bench writes at runtime.
        Static copy lives in the HTML and is captured at boot.
     --------------------------------------------------------- */
  var DYN = {
    en: {
      statusIdle: 'Priming',    statusLive: 'Running',     statusLocked: 'Calibrated',
      capStandby: 'Standby',    capProgress: 'In progress', capFull: 'At pressure',
      calStandby: 'Standby',    calAdjust: 'Adjust',        calLocked: 'Locked',
      primeIdle: 'Hold to prime', primeActive: 'Priming…',  primeFull: 'At pressure',
      langLabel: 'عربي', menuOpen: 'Open menu', menuClose: 'Close menu'
    },
    ar: {
      statusIdle: 'التهيئة',    statusLive: 'قيد التشغيل',  statusLocked: 'تمت المعايرة',
      capStandby: 'وضع الانتظار', capProgress: 'جارٍ التنفيذ', capFull: 'الضغط الكامل',
      calStandby: 'انتظار',      calAdjust: 'ضبط',           calLocked: 'مثبّت',
      primeIdle: 'اضغط مطولاً للتهيئة', primeActive: 'جارٍ التهيئة…', primeFull: 'الضغط الكامل',
      langLabel: 'English', menuOpen: 'فتح القائمة', menuClose: 'إغلاق القائمة'
    }
  };

  /* Arabic translations of the static copy.
     NOTE: written for the v2 groundwork — have a native speaker
     review before this goes live. */
  var AR = {
    'brand.sub': 'خدمات الديزل',
    'nav.features': 'الخدمات', 'nav.process': 'مراحل العمل',
    'nav.specs': 'المواصفات', 'nav.support': 'الدعم',
    'nav.cta': 'احجز اختبار المنصة',

    'hero.line1': 'منصة اختبار الحقن',
    'hero.line2': 'قيد التشغيل',
    'hero.caption.key': 'تهيئة النظام:',
    'hero.caption.hint': '— اضغط مطولاً وشاهد العنوان يمتلئ',
    'hero.r1.label': 'الضغط', 'hero.r1.unit': 'بار',
    'hero.r2.label': 'دورات المضخة', 'hero.r3.label': 'المعايرة',

    'feat.tag': 'الخدمات',
    'feat.title': 'ما الذي يخرج من المنصة',
    'feat.lede': 'كل مضخة تغادر ومعها تقرير اختبار يوضح معدل الضخ عند كل نقطة قياس، قبل العمل وبعده. وإن لم تقع الأرقام ضمن المواصفة، فلن تغادر.',
    'feat.1.tag': 'اختبار المنصة', 'feat.1.title': 'نختبر قبل أن نسعّر',
    'feat.1.copy': 'تعمل مضختك أولاً على منصة معايرة. ترى العطل موثقاً على الورق قبل أن يمسك أحد بالمفتاح، وتوافق على العمل استناداً إلى أرقام حقيقية.',
    'feat.1.stat': 'إجراء الاختبار',
    'feat.2.tag': 'المعايرة', 'feat.2.title': 'ضخ متوازن عنصراً بعنصر',
    'feat.2.copy': 'تُضبط كمية الوقود عبر كل عنصر وفق نشرة الصانع، فلا تعمل أسطوانة بخليط غني بينما تتضور جارتها. ينخفض الدخان، وينخفض الاستهلاك معه.',
    'feat.2.stat': 'حدود تفاوت الضخ',
    'feat.3.tag': 'إعادة البناء', 'feat.3.title': 'أجزاء التآكل تخرج، وقطع أصلية تدخل',
    'feat.3.copy': 'تُستبدل المكابس والأسطوانات وصمامات الضخ والحشوات والمحامل بقطع أصلية أو معادلة لها. ويُعاد تأهيل الجسم ويُختبر بالضغط للتأكد من إحكامه قبل التجميع.',
    'feat.3.stat': 'قطع وأجور',
    'feat.4.tag': 'البخاخات', 'feat.4.title': 'نمط رذاذ يمكنك رؤيته',
    'feat.4.copy': 'يُفحص ضغط الفتح والتسرب الراجع ودقة الرذاذ في كل بخاخ. تنظيف بالموجات فوق الصوتية، وبخاخات جديدة حيث يستدعي التآكل، ثم تشغيل ثانٍ للتأكيد.',
    'feat.4.stat': 'معتمد للسكة المشتركة',

    'proc.tag': 'مراحل العمل', 'proc.title': 'ست مراحل، بهذا الترتيب',
    'proc.lede': 'الترتيب مهم. لا نفكك شيئاً قبل تسجيل القراءة المرجعية، ولا يخرج شيء قبل اعتماد تشغيل المعايرة. وكل مرحلة تترك سجلاً يمكنك طلبه.',
    'proc.1.title': 'الاستلام والغسيل', 'proc.1.copy': 'تُرقَّم المضخة برقم طلبك، وتُنظَّف من الخارج، وتُصوَّر بحالتها عند الاستلام.', 'proc.1.meta': 'رقم الطلب',
    'proc.2.title': 'تشغيل مرجعي على المنصة', 'proc.2.copy': 'تُشغَّل بحالتها لتسجيل أدائها الفعلي. وهذا التقرير هو ما نسعّر على أساسه.', 'proc.2.meta': 'التقرير المرجعي',
    'proc.3.title': 'التفكيك والفحص', 'proc.3.copy': 'تُفكَّك إلى مكوناتها، ويُقاس كل سطح تآكل ويُقارن بحدود الخدمة.', 'proc.3.meta': 'عرض للاعتماد',
    'proc.4.title': 'إعادة البناء', 'proc.4.copy': 'تُركَّب أجزاء التآكل الجديدة، ويُعاد تأهيل الهيكل، ويُجمَّع بعزم مطابق للمواصفة في غرفة نظيفة.', 'proc.4.meta': 'قائمة القطع',
    'proc.5.title': 'تشغيل المعايرة', 'proc.5.copy': 'يُضبط التوقيت والضخ عبر نطاق السرعة الكامل حتى تقع كل نقطة قياس ضمن الحدود.', 'proc.5.meta': 'تقرير المعايرة',
    'proc.6.title': 'الختم والتقرير والتسليم', 'proc.6.copy': 'تُختم بسلك، ويُرفق تقريرا ما قبل وما بعد، ويُسجَّل الضمان على الرقم التسلسلي للمضخة.', 'proc.6.meta': 'سجل الضمان',

    'spec.tag': 'المواصفات', 'spec.title': 'قدرات المنصة',
    'spec.lede': 'ما تستطيع المعدات قياسه فعلياً، وما يمكننا تركيبه عليها. وإن لم تكن مضختك في هذه القائمة، أرسل الرقم التسلسلي وسنخبرك بصراحة.',
    'spec.h1': 'منصة الاختبار', 'spec.h2': 'المضخات والأنظمة المخدومة',
    'spec.r1': 'نطاق ضغط الاختبار', 'spec.r2': 'سرعة الإدارة', 'spec.r3': 'قدرة الإدارة',
    'spec.r4': 'دقة القياس', 'spec.r5': 'سائل المعايرة', 'spec.r6': 'درجة حرارة السائل',
    'spec.r7': 'معايير الاختبار', 'spec.zexel': 'صف مستقيم ودوّار',
    'spec.r8': 'السكة المشتركة', 'spec.r8v': 'سكك وبخاخات حتى ٢٠٠٠ بار',
    'spec.r9': 'بخاخات الوحدة',

    'sup.tag': 'الدعم', 'sup.title': 'بعد خروجها من الورشة',
    'sup.1.label': 'مدة التنفيذ المعتادة', 'sup.1.unit': 'أيام عمل', 'sup.1.note': 'تُحتسب من اعتماد العرض، لا من تاريخ التسليم.',
    'sup.2.label': 'الخدمة العاجلة', 'sup.2.unit': 'ساعة', 'sup.2.note': 'لمركبات الأساطيل المتوقفة. اتصل قبل الإرسال.',
    'sup.3.label': 'الضمان', 'sup.3.unit': 'شهراً', 'sup.3.note': 'أو ١٠٠٬٠٠٠ كم على المضخات المعاد بناؤها، أيهما أسبق.',
    'sup.4.label': 'الاستلام', 'sup.4.value': 'مجاناً', 'sup.4.note': 'داخل دبي والشارقة لوحدتين فأكثر.',

    'book.tag': 'الحجز', 'book.title': 'ضع مضختك على المنصة',
    'book.copy': 'أرسل الرقم التسلسلي للمضخة وسنؤكد ما إذا كانت تحتاج صيانة أو إعادة بناء أو لا تستحق أياً منهما. مكالمة التقييم دون رسوم.',
    'book.call': 'اتصل على ٠٠٠٠ ٠٠٠ ٤ ٩٧١+',

    'foot.note': 'خدمات حقن وقود الديزل منذ ١٩٩٤.',
    'foot.where': 'الورشة', 'foot.addr': 'القوز الصناعية ٣<br>دبي، الإمارات العربية المتحدة',
    'foot.when': 'ساعات العمل', 'foot.hours': 'السبت – الخميس<br>٠٧:٠٠ – ١٩:٠٠',
    'foot.reach': 'للتواصل'
  };

  /* ---------------------------------------------------------
     2. Language — the v2 Arabic build, wired now
     --------------------------------------------------------- */
  var EN = {};                       // captured from the DOM at boot
  var i18nNodes = document.querySelectorAll('[data-i18n]');
  var lang = 'en';

  i18nNodes.forEach(function (el) { EN[el.getAttribute('data-i18n')] = el.innerHTML; });

  function applyLang(next) {
    lang = next;
    var dict = next === 'ar' ? AR : {};
    i18nNodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = dict[key] !== undefined ? dict[key] : EN[key];
      if (val !== undefined) el.innerHTML = val;
    });
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    if (langBtn) {
      langBtn.textContent = DYN[next].langLabel;
      langBtn.lang = next === 'ar' ? 'en' : 'ar';
    }
    try { localStorage.setItem('pw-lang', next); } catch (e) {}
    render();                        // dynamic strings follow the switch
  }

  var langBtn = document.getElementById('lang');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(lang === 'en' ? 'ar' : 'en');
    });
  }

  /* ---------------------------------------------------------
     3. The bench
     --------------------------------------------------------- */
  var prime      = document.getElementById('prime');
  var primeText  = document.getElementById('primeText');
  var rigFill    = document.getElementById('rigFill');
  var statusEl   = document.getElementById('status');
  var statusLbl  = document.getElementById('statusLabel');
  var capState   = document.getElementById('captionState');
  var valPress   = document.getElementById('valPressure');
  var valRpm     = document.getElementById('valRpm');
  var valCal     = document.getElementById('valCal');

  var MAX_BAR = 1850;      // matches the bench spec table
  var MAX_RPM = 2400;

  var level   = 0;         // 0 … 1 — how full the title is
  var holding = false;
  var slosh   = 0;         // surface disturbance, spikes on release
  var phase   = 0;
  var raf     = null;
  var last    = 0;

  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

  /* The liquid surface: a sine along the top edge of the clip.
     Percentages keep it responsive at any title size. */
  function surface() {
    if (!rigFill) return;

    if (level <= 0.001) {
      rigFill.style.clipPath = 'inset(100% 0 0 0)';
      return;
    }
    if (reduced) {
      rigFill.style.clipPath = 'inset(' + ((1 - level) * 100).toFixed(2) + '% 0 0 0)';
      return;
    }

    var top = (1 - level) * 100;
    var amp = (0.7 + slosh * 3.4);          // % of the title box
    var pts = [];
    var N = 26;
    for (var i = 0; i <= N; i++) {
      var t = i / N;
      var y = top
            + Math.sin(t * Math.PI * 2.6 + phase) * amp
            + Math.sin(t * Math.PI * 5.1 - phase * 1.6) * amp * 0.35;
      pts.push((t * 100).toFixed(2) + '% ' + Math.max(-4, Math.min(104, y)).toFixed(2) + '%');
    }
    pts.push('100% 104%', '0% 104%');
    rigFill.style.clipPath = 'polygon(' + pts.join(',') + ')';
  }

  function render() {
    var d = DYN[lang];
    var live   = level > 0.02;
    var locked = level >= 0.985;

    surface();
    if (prime) prime.style.setProperty('--lvl', level.toFixed(4));

    // gauges wander slightly while the pump is turning, like real needles
    var jitter = live && holding ? (Math.random() - 0.5) * 0.012 : 0;
    var l = Math.max(0, Math.min(1, level + jitter));
    if (valPress) valPress.textContent = fmt(l * MAX_BAR);
    if (valRpm)   valRpm.textContent   = fmt(holding ? l * MAX_RPM : level * MAX_RPM * 0.35);

    if (valCal)  valCal.textContent  = locked ? d.calLocked : (live ? d.calAdjust : d.calStandby);
    if (capState) capState.textContent = locked ? d.capFull : (holding && live ? d.capProgress : d.capStandby);
    if (statusLbl) statusLbl.textContent = locked ? d.statusLocked : (holding && live ? d.statusLive : d.statusIdle);

    if (statusEl) {
      statusEl.classList.toggle('is-live', holding && live && !locked);
      statusEl.classList.toggle('is-locked', locked);
    }
    if (prime) prime.classList.toggle('is-priming', holding);
    if (primeText) {
      primeText.textContent = locked ? d.primeFull : (holding ? d.primeActive : d.primeIdle);
    }
  }

  function tick(now) {
    var dt = Math.min(50, now - (last || now)) / 16.667;
    last = now;

    var target = holding ? 1 : 0;
    var rate   = holding ? 0.021 : 0.045;         // drains faster than it fills
    level += (target - level) * rate * dt;
    if (holding && level > 0.995) level = 1;
    if (!holding && level < 0.0015) level = 0;

    slosh = Math.max(0, slosh - 0.028 * dt);
    phase += 0.055 * dt;

    render();

    if (holding || level > 0 || slosh > 0) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null; last = 0;
      render();
    }
  }

  function start() {
    if (holding) return;
    holding = true;
    slosh = Math.max(slosh, 0.35);
    if (!raf) { last = 0; raf = requestAnimationFrame(tick); }
  }
  function stop() {
    if (!holding) return;
    holding = false;
    slosh = Math.max(slosh, 0.75);                // it sloshes when you let go
    if (!raf) { last = 0; raf = requestAnimationFrame(tick); }
  }

  if (prime) {
    prime.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      if (e.pointerId !== undefined && prime.setPointerCapture) {
        try { prime.setPointerCapture(e.pointerId); } catch (err) {}
      }
      start();
    });
    prime.addEventListener('pointerup', stop);
    prime.addEventListener('pointercancel', stop);
    window.addEventListener('pointerup', stop);
    window.addEventListener('blur', stop);

    // held with the keyboard, not just the mouse
    prime.addEventListener('keydown', function (e) {
      if (e.repeat) return;
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') { e.preventDefault(); start(); }
    });
    prime.addEventListener('keyup', function (e) {
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') { e.preventDefault(); stop(); }
    });
    prime.addEventListener('blur', stop);
    prime.addEventListener('click', function (e) { e.preventDefault(); });
  }

  /* ---------------------------------------------------------
     4. Chrome: sticky header, mobile nav, scroll reveal
     --------------------------------------------------------- */
  var masthead = document.getElementById('masthead');
  if (masthead) {
    var onScroll = function () {
      masthead.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var burger = document.getElementById('burger');
  var nav    = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? DYN[lang].menuClose : DYN[lang].menuOpen);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var reveals = document.querySelectorAll('.reveal, .step');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i, 4) * 60) + 'ms';
      io.observe(el);
    });
    // failsafe: if the observer never reports, show everything anyway
    setTimeout(function () {
      reveals.forEach(function (el) {
        if (!el.classList.contains('is-in') &&
            el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-in');
        }
      });
    }, 1600);
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     5. Boot
     --------------------------------------------------------- */
  var saved = null;
  try { saved = localStorage.getItem('pw-lang'); } catch (e) {}
  applyLang(saved === 'ar' ? 'ar' : 'en');   // applyLang renders
})();
