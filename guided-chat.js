(function () {
  const WHATSAPP_BASE = "https://wa.me/972527303546?text=";
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pageCopy = {
    home: {
      summaryLabel: "עמוד הבית",
      launcherTitle: "שואלים משהו קצר?",
      launcherSubtitle: "אזור, מחיר, ואיך מתחילים",
      panelTitle: "שואלים משהו קצר?",
      panelSubtitle: "אפשר להבין כאן מה נכון לבית שלכם",
      greetings: [
        "היי, אפשר להתחיל כאן ממשהו קטן לפני שעוברים לוואטסאפ.",
        "אם נוח לכם, אפשר לבדוק כאן כמה דברים בקצרה.",
        "אפשר לשאול אותי כאן שאלה קצרה, ואני אכוון אתכם.",
      ],
    },
    services: {
      summaryLabel: "עמוד השירותים",
      launcherTitle: "שאלה קטנה על השירות?",
      launcherSubtitle: "מה צריך לנקות ואיך זה עובד",
      panelTitle: "נבדוק רגע יחד?",
      panelSubtitle: "אפשר לדייק כאן מה באמת צריך בבית",
      greetings: [
        "אם אתם כבר בעמוד השירותים, בואו נדייק מה באמת צריך.",
        "אפשר להתחיל ממה שהכי מפריע בבית כרגע.",
        "אם אתם בודקים שירות, אפשר לסדר את זה כאן בכמה צעדים קצרים.",
      ],
    },
    about: {
      summaryLabel: "עמוד האודות",
      launcherTitle: "רוצים לבדוק התאמה?",
      launcherSubtitle: "כמה תשובות קצרות לפני שפונים",
      panelTitle: "נעים להכיר קצת?",
      panelSubtitle: "אפשר לבדוק אם אני מתאימה למה שאתם צריכים",
      greetings: [
        "אם אתם רוצים להבין אם אני מתאימה לבית שלכם, אפשר להתחיל כאן.",
        "לפעמים שתיים-שלוש שאלות מספיקות כדי להבין אם זה נכון.",
        "אפשר לשאול כאן משהו קטן, בלי להתחייב לכלום.",
      ],
    },
    contact: {
      summaryLabel: "עמוד יצירת הקשר",
      launcherTitle: "בואו נעשה את זה פשוט",
      launcherSubtitle: "כמה תשובות קצרות לפני וואטסאפ",
      panelTitle: "אפשר להתחיל כאן",
      panelSubtitle: "נבין יחד בקצרה מה הכי נכון לכם",
      greetings: [
        "אם כבר הגעתם ליצירת קשר, אפשר להתחיל כאן קצר.",
        "בואו נעשה את זה פשוט. נבדוק יחד מה אתם צריכים.",
        "אפשר להתחיל בכמה שאלות קטנות, ואז לעבור לוואטסאפ אם מתאים.",
      ],
    },
  };

  const messageVariants = {
    introPrompt: [
      "מה תרצו לבדוק קודם?",
      "עם מה נתחיל?",
      "מה הכי יעזור לכם לדעת עכשיו?",
    ],
    introLead: [
      "אני יכולה לעזור עם אזור הגעה, להבין אם זה ניקיון מלא או ממוקד, להסביר איך המחיר עובד, ולבדוק גם מצבים שדורשים יותר רגישות.",
      "אפשר לבדוק כאן אזור הגעה, סוג ניקיון, איך המחיר עובד, ואיך הכי נכון להתחיל.",
    ],
    moreTopicsLead: ["בשמחה.", "בטח.", "אין בעיה."],
    moreTopicsPrompt: [
      "מה תרצו לבדוק עכשיו?",
      "על מה נמשיך?",
      "מה עוד יעזור לכם לדעת?",
    ],
    quietAck: ["הבנתי.", "בסדר.", "מעולה."],
    directLead: ["אין בעיה.", "בשמחה.", "בטח."],
  };

  function pick(value) {
    if (Array.isArray(value)) {
      return value[Math.floor(Math.random() * value.length)];
    }

    return value;
  }

  function uniquePush(items, value) {
    if (value && !items.includes(value)) {
      items.push(value);
    }
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function resolvePageType() {
    const body = document.body;

    if (body.classList.contains("page--services")) {
      return "services";
    }

    if (body.classList.contains("page--about")) {
      return "about";
    }

    if (body.classList.contains("page--contact")) {
      return "contact";
    }

    return "home";
  }

  function createInitialSummary(pageType) {
    return {
      page: pageCopy[pageType].summaryLabel,
      topics: [],
      area: "",
      service: "",
      focus: "",
      pricing: "",
      cadence: "",
      sensitivity: "",
      stage: "",
      notes: [],
    };
  }

  function createOption(label, next, extras = {}) {
    return {
      label,
      next,
      ...extras,
    };
  }

  function createTypingIndicator() {
    const item = document.createElement("div");
    item.className = "guided-chat__typing";
    item.setAttribute("aria-hidden", "true");

    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement("span");
      dot.className = "guided-chat__typing-dot";
      item.appendChild(dot);
    }

    return item;
  }

  function createMessage(role, text) {
    const item = document.createElement("div");
    item.className = `guided-chat__message guided-chat__message--${role}`;
    item.textContent = text;
    return item;
  }

  function joinHebrewList(items) {
    if (!items.length) {
      return "";
    }

    if (items.length === 1) {
      return items[0];
    }

    if (items.length === 2) {
      return `${items[0]} ו${items[1]}`;
    }

    return `${items.slice(0, -1).join(", ")} ו${items[items.length - 1]}`;
  }

  function buildWhatsappMessage(summary, leadIntent) {
    const lines = ["היי ליאת, הגעתי מהצ'אט באתר."];

    if (summary.page) {
      lines.push(`הגעתי דרך ${summary.page}.`);
    }

    if (summary.topics.length) {
      lines.push(`מה שרציתי לבדוק: ${joinHebrewList(summary.topics)}.`);
    }

    if (summary.area) {
      lines.push(`אזור: ${summary.area}.`);
    }

    if (summary.service) {
      lines.push(`סוג עזרה: ${summary.service}.`);
    }

    if (summary.focus) {
      lines.push(`הדגש בבית: ${summary.focus}.`);
    }

    if (summary.pricing) {
      lines.push(`רציתי להבין מחיר לגבי: ${summary.pricing}.`);
    }

    if (summary.cadence) {
      lines.push(`התדירות כרגע: ${summary.cadence}.`);
    }

    if (summary.sensitivity) {
      lines.push(`חשוב לדעת: ${summary.sensitivity}.`);
    }

    if (summary.stage) {
      lines.push(`כרגע אני: ${summary.stage}.`);
    }

    summary.notes.forEach((note) => {
      lines.push(`עוד משהו: ${note}.`);
    });

    if (leadIntent) {
      lines.push(`אשמח לבדוק איתך ${leadIntent}.`);
    }

    lines.push("אם זה מתאים, אשמח להמשיך מכאן בוואטסאפ.");
    return `${WHATSAPP_BASE}${encodeURIComponent(lines.join("\n"))}`;
  }

  function createTopicOptions() {
    return [
      createOption("עד איפה את מגיעה?", "coverageAsk", {
        capture: { topic: "אזור הגעה" },
        leadIntent: "הגעה לאזור שלי",
      }),
      createOption("מה אפשר לנקות?", "servicesAsk", {
        capture: { topic: "מה אפשר לנקות" },
        leadIntent: "מה בדיוק אפשר לנקות אצלנו",
      }),
      createOption("איך עובד המחיר?", "pricingAsk", {
        capture: { topic: "מחיר" },
        leadIntent: "איך המחיר עובד",
      }),
      createOption("אני צריך/ה גישה רגישה יותר", "sensitiveAsk", {
        capture: {
          topic: "גישה רגישה יותר",
          note: "פנייה דרך מסלול גישה רגישה יותר",
        },
        leadIntent: "אם צריך גישה רגישה יותר בבית",
      }),
      createOption("איך מתחילים?", "startAsk", {
        capture: { topic: "איך מתחילים" },
        leadIntent: "איך הכי נכון להתחיל",
      }),
    ];
  }

  function createFollowupOptions() {
    return [
      createOption("יש לי עוד משהו", "moreTopics"),
      createOption("נחזור להתחלה", null, { action: "reset" }),
    ];
  }

  function getAreaHint(state) {
    if (state.summary.area === "מעבר לכפר סבא") {
      return "אם אתם קצת מעבר, תכתבו לי גם עיר או שכונה כדי שאבדוק אם ההגעה נוחה לי.";
    }

    if (state.summary.area === "כפר סבא והסביבה") {
      return "אם אתם בכפר סבא או ממש קרוב, זה בדרך כלל עוזר לי לענות מהר יותר.";
    }

    return "";
  }

  const flows = {
    intro: {
      messages: (state) => [
        pick(pageCopy[state.pageType].greetings),
        pick(messageVariants.introLead),
        pick(messageVariants.introPrompt),
      ],
      options: () => createTopicOptions(),
      handoffLabel: "לכתוב לי בוואטסאפ",
    },
    moreTopics: {
      messages: (state) => {
        const base = [pick(messageVariants.moreTopicsLead)];

        if (state.summary.topics.length) {
          base.push(`עד עכשיו עברנו על ${joinHebrewList(state.summary.topics)}.`);
        }

        base.push(pick(messageVariants.moreTopicsPrompt));
        return base;
      },
      options: () => createTopicOptions(),
      handoffLabel: "לכתוב לי בוואטסאפ",
    },
    coverageAsk: {
      messages: () => [
        "אני עובדת בעיקר סביב כפר סבא, אבל לא רק.",
        "אם יש תחבורה ציבורית נוחה, בהרבה מקרים אני מגיעה גם מעבר.",
        "איפה אתם בערך?",
      ],
      options: () => [
        createOption("כפר סבא והסביבה", "coverageNear", {
          capture: { area: "כפר סבא והסביבה" },
          leadIntent: "אם את מגיעה לכפר סבא והסביבה",
        }),
        createOption("קצת מעבר", "coverageFar", {
          capture: { area: "מעבר לכפר סבא", notes: ["צריך לבדוק הגעה"] },
          leadIntent: "אם ההגעה לאזור שלי אפשרית",
        }),
        createOption("אני מעדיפ/ה לבדוק איתך ישירות", "coverageDirect", {
          capture: { notes: ["רוצה לבדוק הגעה ישירות"] },
          leadIntent: "הגעה לאזור שלי",
        }),
      ],
      handoffLabel: "לבדוק הגעה בוואטסאפ",
    },
    coverageNear: {
      messages: () => [
        "אם אתם בכפר סבא והסביבה, בדרך כלל זה פשוט.",
        "תכתבו לי עיר או שכונה, ואני אגיד מיד אם זה מסתדר.",
        "אם כבר יש לכם יום מועדף, אפשר לכתוב גם אותו.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לבדוק הגעה בוואטסאפ",
    },
    coverageFar: {
      messages: () => [
        "גם אם אתם קצת מעבר, עדיין שווה לבדוק.",
        "מה שקובע מבחינתי הוא אם ההגעה נוחה וסבירה בתחבורה ציבורית.",
        "תשלחו לי אזור, ואני אגיד ישר אם זה רלוונטי.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לשלוח לי את האזור",
    },
    coverageDirect: {
      messages: () => [
        pick(messageVariants.directLead),
        "תכתבו לי אזור מדויק, ואני אענה ישר אם אני מגיעה.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לכתוב לי את האזור",
    },
    servicesAsk: {
      messages: () => [
        "אני עושה גם ניקיון של בית שלם וגם עזרה יותר ממוקדת.",
        "זה נשמע יותר כמו בית מלא, אזור אחד או שניים, או בית שנערם וצריך התחלה טובה?",
      ],
      options: () => [
        createOption("ניקיון בית מלא", "servicesFullAsk", {
          capture: { service: "ניקיון בית מלא" },
          leadIntent: "ניקיון בית מלא",
        }),
        createOption("אזור אחד או שניים", "servicesFocusedAsk", {
          capture: { service: "ניקיון ממוקד" },
          leadIntent: "ניקיון ממוקד",
        }),
        createOption("בית שנערם קצת", "servicesPiled", {
          capture: { service: "בית שנערם", notes: ["צריך התחלה מסודרת"] },
          leadIntent: "עזרה בבית שנערם",
        }),
      ],
      handoffLabel: "לספר לי מה צריך",
    },
    servicesFullAsk: {
      messages: () => [
        "אם זה בית מלא, חשוב לי להבין אם אתם מחפשים משהו חד פעמי או משהו שיכול לחזור.",
        "לא בשביל למכור יותר, רק כדי לכוון נכון.",
      ],
      options: () => [
        createOption("חד פעמי", "servicesFullOnce", {
          capture: { cadence: "חד פעמי" },
          leadIntent: "ניקיון בית מלא חד פעמי",
        }),
        createOption("יכול להיות קבוע", "servicesFullRegular", {
          capture: { cadence: "קבוע" },
          leadIntent: "ניקיון בית מלא קבוע",
        }),
        createOption("עוד לא יודע/ת", "servicesFullUnsure", {
          capture: { cadence: "עוד לא ברור" },
          leadIntent: "ניקיון בית מלא",
        }),
      ],
      handoffLabel: "לספר לי על הבית",
    },
    servicesFullOnce: {
      messages: () => [
        pick(messageVariants.quietAck),
        "בניקיון חד פעמי הכי עוזר לי להבין גודל בית, מה הכי דחוף, ואם יש אזורים שלא כדאי לפספס.",
        "לא צריך רשימה מסודרת. שתי שורות מספיקות לי.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לספר לי על הניקיון",
    },
    servicesFullRegular: {
      messages: () => [
        pick(messageVariants.quietAck),
        "אם זה משהו שיכול לחזור, אני בודקת יחד איתכם מה תדירות שפויה ומה באמת צריך בכל פעם.",
        "לפעמים זה פחות ממה שאנשים מדמיינים, ולפעמים צריך להתחיל קצת יותר עמוק.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לדבר איתי על קצב קבוע",
    },
    servicesFullUnsure: {
      messages: () => [
        "זה לגמרי בסדר.",
        "אם עוד לא ברור לכם מה נכון, תכתבו לי רק מה בבית מרגיש תקוע או כבד כרגע.",
        "משם כבר אדע להגיד אם זה מתאים לי.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לספר לי מה מרגיש כבד",
    },
    servicesFocusedAsk: {
      messages: () => [
        "בניקיון ממוקד הכי עוזר לי להבין איפה העומס יושב.",
        "מה הכי מפריע עכשיו?",
      ],
      options: () => [
        createOption("מטבח", "servicesFocusedKitchen", {
          capture: { focus: "מטבח" },
          leadIntent: "ניקיון מטבח",
        }),
        createOption("חדר רחצה", "servicesFocusedBath", {
          capture: { focus: "חדר רחצה" },
          leadIntent: "ניקיון חדר רחצה",
        }),
        createOption("חלונות או רצפה", "servicesFocusedWindows", {
          capture: { focus: "חלונות או רצפה" },
          leadIntent: "ניקיון חלונות או רצפה",
        }),
        createOption("כמה אזורים יחד", "servicesFocusedMixed", {
          capture: { focus: "כמה אזורים יחד" },
          leadIntent: "ניקיון ממוקד בכמה אזורים",
        }),
      ],
      handoffLabel: "לספר לי מה הכי מפריע",
    },
    servicesFocusedKitchen: {
      messages: () => [
        "אם זה המטבח, תכתבו לי אם מדובר בכלים, משטחים, שומן, או פשוט עומס כללי.",
        "אני לא צריכה פירוט מושלם. רק כיוון, כדי להבין אם זה משהו ממוקד או חלק מניקיון רחב יותר.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לספר לי על המטבח",
    },
    servicesFocusedBath: {
      messages: () => [
        "אם זה חדר רחצה, מספיק לכתוב אם העניין הוא ניקיון יסודי, תחזוקה, או אזור מסוים שממש מפריע.",
        "זה כבר נותן לי תמונה מספיק טובה.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לספר לי על חדר הרחצה",
    },
    servicesFocusedWindows: {
      messages: () => [
        "אם זה חלונות או רצפה, תכתבו אם מדובר במשהו נקודתי או בחלק מבית שצריך ריענון כללי.",
        "משם כבר אדע אם זה מתאים לי ואיך נכון לגשת לזה.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לספר לי על החלונות או הרצפה",
    },
    servicesFocusedMixed: {
      messages: () => [
        "אם זה כמה אזורים יחד, תכתבו לי את שניים או שלושה הדברים שהכי חשובים לכם כרגע.",
        "לא צריך יותר מזה כדי להתחיל להבין אם זה מתאים.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לספר לי מה הכי חשוב",
    },
    servicesPiled: {
      messages: () => [
        "זה קורה להרבה בתים, ולא צריך לייפות את זה.",
        "תכתבו לי פשוט מה המצב כרגע, ואני אגיד בכנות אם אני יכולה לעזור ואיך נכון להתחיל.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לכתוב לי מה המצב",
    },
    pricingAsk: {
      messages: () => [
        "אני לא זורקת מספר סתם, כי המחיר תלוי בבית ובמה שבאמת צריך.",
        "מה הכי קרוב למה שאתם מנסים להבין?",
      ],
      options: () => [
        createOption("דירה או בית קטן", "pricingSmall", {
          capture: { pricing: "דירה או בית קטן" },
          leadIntent: "מחיר לדירה או בית קטן",
        }),
        createOption("בית משפחתי", "pricingFamily", {
          capture: { pricing: "בית משפחתי" },
          leadIntent: "מחיר לבית משפחתי",
        }),
        createOption("ניקיון חד פעמי", "pricingOnce", {
          capture: { pricing: "ניקיון חד פעמי" },
          leadIntent: "מחיר לניקיון חד פעמי",
        }),
        createOption("ניקיון קבוע", "pricingRegular", {
          capture: { pricing: "ניקיון קבוע" },
          leadIntent: "מחיר לניקיון קבוע",
        }),
      ],
      handoffLabel: "לשאול על המחיר בוואטסאפ",
    },
    pricingSmall: {
      messages: (state) => [
        "בדירה או בית קטן המחיר מושפע בעיקר מגודל, רמת עומס, והאם זה ניקיון מלא או ממוקד.",
        getAreaHint(state),
        "אם תכתבו לי שתי שורות על הבית ועל מה הכי חשוב לכם, אני אדע לענות ישר יותר.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לשאול על המחיר",
    },
    pricingFamily: {
      messages: (state) => [
        "בבית משפחתי אני בודקת גודל, עומס, ומה הדגש שלכם כרגע.",
        getAreaHint(state),
        "אני מעדיפה לתת תשובה אחרי שאני מבינה את הבית, ולא לנחש מספר סתם.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לשאול על המחיר",
    },
    pricingOnce: {
      messages: (state) => [
        "בניקיון חד פעמי אני בודקת בעיקר כמה עבודה יש, מה הדחיפות, ומה תרצו להרגיש בסוף.",
        getAreaHint(state),
        "תיאור קצר מספיק כדי שאני אגיד אם זה מתאים ואיך אני רואה את זה.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לבדוק ניקיון חד פעמי",
    },
    pricingRegular: {
      messages: () => [
        "בניקיון קבוע אני בודקת גם את מצב הבית עכשיו וגם מה יהיה נוח ונכון בהמשך.",
        "לפעמים מה שמתאים הוא פחות ממה שאנשים חושבים, ולפעמים צריך להתחיל קצת יותר עמוק ואז לשמור.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לבדוק ניקיון קבוע",
    },
    sensitiveAsk: {
      messages: () => [
        "יש בתים שצריך להיכנס אליהם יותר בעדינות, ופחות עם שאלות.",
        "אם זה המצב אצלכם, לא צריך להסביר הרבה. מספיק להבין מה הכי חשוב לי לדעת מראש.",
        "מה הכי קרוב למה שאתם צריכים ממני?",
      ],
      options: () => [
        createOption("מוגבלות או קושי פיזי", "sensitivePhysical", {
          capture: { sensitivity: "מוגבלות או קושי פיזי" },
          leadIntent: "אם נדרשת גישה רגישה בגלל קושי פיזי",
        }),
        createOption("יש ציוד רפואי בבית", "sensitiveMedical", {
          capture: { sensitivity: "ציוד רפואי בבית" },
          leadIntent: "אם יש ציוד רפואי בבית",
        }),
        createOption("הבית פשוט נערם", "sensitivePiled", {
          capture: { sensitivity: "בית שנערם וצריך גישה עדינה" },
          leadIntent: "אם צריך גישה רגישה לבית שנערם",
        }),
        createOption("חשוב לי שייכנסו בשקט", "sensitiveQuiet", {
          capture: { sensitivity: "צריך שקט וכניסה עדינה" },
          leadIntent: "אם צריך שקט ורגישות",
        }),
      ],
      handoffLabel: "לכתוב לי בעדינות",
    },
    sensitivePhysical: {
      messages: () => [
        "כן, בהחלט.",
        "אם יש קושי פיזי או מוגבלות, חשוב לי לדעת את זה מראש כדי להיכנס נכון ולא להעמיס עליכם.",
        "לא צריך לפרט יותר ממה שנוח לכם. מספיק כיוון קצר, ואני אדע להתאים את הדרך שבה אני נכנסת ועובדת.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לכתוב לי על זה",
    },
    sensitiveMedical: {
      messages: () => [
        "אם יש ציוד רפואי בבית, מספיק לכתוב לי את זה מראש כדי שאבין איך להיכנס ולעבוד סביב זה.",
        "אני לא צריכה פירוט רפואי. רק לדעת איך להיזהר ואיך לעבוד בצורה שלא תפריע לכם.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לכתוב לי על הבית",
    },
    sensitivePiled: {
      messages: () => [
        "אם הבית נערם אחרי תקופה לא פשוטה, לא צריך להסביר או להתנצל.",
        "פשוט תכתבו לי את זה כמו שזה, ואני אגיד בכנות אם אני יכולה לקחת את זה ואיך נכון להתחיל.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לכתוב לי מה המצב",
    },
    sensitiveQuiet: {
      messages: () => [
        "אני מבינה את זה לגמרי.",
        "אם חשוב לכם שייכנסו בשקט ובלי הרבה דיבורים, זו גם דרך העבודה שלי.",
        "אפשר פשוט לכתוב לי שזה מה שחשוב בבית שלכם, ואני אדע לגשת לזה נכון.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לכתוב לי מה חשוב",
    },
    startAsk: {
      messages: () => [
        "אפשר להתחיל מאוד פשוט.",
        "אתם כבר יודעים מה צריך, או עוד מנסים להבין?",
      ],
      options: () => [
        createOption("אני יודע/ת מה צריך", "startKnow", {
          capture: { stage: "יודע/ת מה צריך" },
          leadIntent: "להתחיל ולקבוע",
        }),
        createOption("אני עוד לא בטוח/ה", "startUnsure", {
          capture: { stage: "עוד לא בטוח/ה" },
          leadIntent: "להבין מה נכון",
        }),
        createOption("אני רק רוצה לבדוק אזור", "coverageAsk", {
          capture: { stage: "רוצה קודם לבדוק אזור הגעה" },
          leadIntent: "בדיקת הגעה",
        }),
      ],
      handoffLabel: "להתחיל בוואטסאפ",
    },
    startKnow: {
      messages: () => [
        "מעולה.",
        "הודעה קצרה עם אזור, סוג בית, ומה הכי דחוף לכם כרגע, וזה מספיק כדי להתחיל.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "להתחיל בוואטסאפ",
    },
    startUnsure: {
      messages: () => [
        "זה קורה הרבה, וזה ממש בסדר.",
        "גם אם עוד לא ברור לכם מה בדיוק צריך, מספיק לכתוב מה מרגיש לא פתור או איפה בבית הכי מורגש העומס.",
        "אני אדע לכוון משם.",
      ],
      options: () => createFollowupOptions(),
      handoffLabel: "לכתוב לי מה לא פתור",
    },
  };

  function initChat(root) {
    const pageType = resolvePageType();
    const launcher = root.querySelector("[data-guided-chat-launcher]");
    const panel = root.querySelector("[data-guided-chat-panel]");
    const closeBtn = root.querySelector("[data-guided-chat-close]");
    const resetBtn = root.querySelector("[data-guided-chat-reset]");
    const messages = root.querySelector("[data-guided-chat-messages]");
    const optionsEl = root.querySelector("[data-guided-chat-options]");
    const handoffLink = root.querySelector("[data-guided-chat-handoff]");
    const launcherTitle = root.querySelector(".guided-chat__launcher-copy strong");
    const launcherSubtitle = root.querySelector(".guided-chat__launcher-copy span");
    const panelTitle = root.querySelector(".guided-chat__panel-head strong");
    const panelSubtitle = root.querySelector(".guided-chat__panel-head span");

    if (!launcher || !panel || !messages || !optionsEl || !handoffLink) {
      return;
    }

    const copy = pageCopy[pageType];
    const state = {
      currentStep: "intro",
      history: [],
      summary: createInitialSummary(pageType),
      context: { pageType },
      pageType,
      leadIntent: "",
      handoffLabel: "לכתוב לי בוואטסאפ",
      started: false,
      renderToken: 0,
    };

    function updateStaticCopy() {
      if (launcherTitle) {
        launcherTitle.textContent = copy.launcherTitle;
      }

      if (launcherSubtitle) {
        launcherSubtitle.textContent = copy.launcherSubtitle;
      }

      if (panelTitle) {
        panelTitle.textContent = copy.panelTitle;
      }

      if (panelSubtitle) {
        panelSubtitle.textContent = copy.panelSubtitle;
      }
    }

    function syncWhatsappLink() {
      handoffLink.href = buildWhatsappMessage(state.summary, state.leadIntent);
      handoffLink.textContent = state.handoffLabel;
      handoffLink.setAttribute("aria-label", state.handoffLabel);
    }

    function scrollMessages() {
      messages.scrollTop = messages.scrollHeight;
    }

    function applyCapture(capture) {
      if (!capture) {
        return;
      }

      if (capture.topic) {
        uniquePush(state.summary.topics, capture.topic);
      }

      if (capture.area) {
        state.summary.area = capture.area;
      }

      if (capture.service) {
        state.summary.service = capture.service;
      }

      if (capture.focus) {
        state.summary.focus = capture.focus;
      }

      if (capture.pricing) {
        state.summary.pricing = capture.pricing;
      }

      if (capture.cadence) {
        state.summary.cadence = capture.cadence;
      }

      if (capture.sensitivity) {
        state.summary.sensitivity = capture.sensitivity;
      }

      if (capture.stage) {
        state.summary.stage = capture.stage;
      }

      if (Array.isArray(capture.notes)) {
        capture.notes.forEach((note) => uniquePush(state.summary.notes, note));
      }

      if (capture.note) {
        uniquePush(state.summary.notes, capture.note);
      }
    }

    function resolveValue(value) {
      if (typeof value === "function") {
        return value(state);
      }

      return value;
    }

    function resolveMessages(step) {
      const value = resolveValue(step.messages) || [];
      const list = Array.isArray(value) ? value : [value];

      return list.map((item) => pick(item)).filter(Boolean);
    }

    function resolveOptions(step) {
      const value = resolveValue(step.options) || [];
      return Array.isArray(value) ? value : [];
    }

    async function appendAssistantMessages(stepId, texts, token) {
      for (const text of texts) {
        if (token !== state.renderToken || stepId !== state.currentStep) {
          return;
        }

        if (!prefersReducedMotion) {
          const indicator = createTypingIndicator();
          messages.appendChild(indicator);
          scrollMessages();

          const waitTime = Math.min(560, Math.max(220, 120 + text.length * 6));
          await wait(waitTime);

          if (token !== state.renderToken || stepId !== state.currentStep) {
            indicator.remove();
            return;
          }

          indicator.remove();
        }

        messages.appendChild(createMessage("assistant", text));
        scrollMessages();

        if (!prefersReducedMotion) {
          await wait(110);
        }
      }
    }

    function renderOptions(stepId, options) {
      optionsEl.innerHTML = "";

      options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "guided-chat__option";
        button.textContent = option.label;
        button.addEventListener("click", () => {
          messages.appendChild(createMessage("user", option.label));
          scrollMessages();

          state.history.push({
            from: stepId,
            label: option.label,
          });

          if (option.capture) {
            applyCapture(option.capture);
          }

          if (option.context) {
            Object.assign(state.context, option.context);
          }

          if (option.leadIntent) {
            state.leadIntent = option.leadIntent;
          }

          syncWhatsappLink();

          if (option.action === "reset") {
            resetChat();
            return;
          }

          if (!option.next) {
            return;
          }

          renderStep(option.next);
        });

        optionsEl.appendChild(button);
      });
    }

    async function renderStep(stepId) {
      const step = flows[stepId];

      if (!step) {
        return;
      }

      state.currentStep = stepId;
      state.renderToken += 1;
      const token = state.renderToken;

      optionsEl.innerHTML = "";
      state.handoffLabel = resolveValue(step.handoffLabel) || "לכתוב לי בוואטסאפ";
      syncWhatsappLink();

      const messagesToShow = resolveMessages(step);
      await appendAssistantMessages(stepId, messagesToShow, token);

      if (token !== state.renderToken || stepId !== state.currentStep) {
        return;
      }

      renderOptions(stepId, resolveOptions(step));
      syncWhatsappLink();
      scrollMessages();
    }

    function resetState() {
      state.currentStep = "intro";
      state.history = [];
      state.summary = createInitialSummary(pageType);
      state.context = { pageType };
      state.leadIntent = "";
      state.handoffLabel = "לכתוב לי בוואטסאפ";
      state.renderToken += 1;
    }

    function startChat() {
      state.started = true;
      resetState();
      messages.innerHTML = "";
      optionsEl.innerHTML = "";
      syncWhatsappLink();
      renderStep("intro");
    }

    function openChat() {
      panel.hidden = false;
      root.classList.add("is-open");
      document.body.classList.add("has-guided-chat-open");
      launcher.setAttribute("aria-expanded", "true");

      if (!state.started) {
        startChat();
      }
    }

    function closeChat() {
      panel.hidden = true;
      root.classList.remove("is-open");
      document.body.classList.remove("has-guided-chat-open");
      launcher.setAttribute("aria-expanded", "false");
    }

    function resetChat() {
      startChat();
    }

    updateStaticCopy();
    syncWhatsappLink();

    launcher.addEventListener("click", openChat);
    closeBtn?.addEventListener("click", closeChat);
    resetBtn?.addEventListener("click", resetChat);

    handoffLink.addEventListener("click", () => {
      syncWhatsappLink();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && root.classList.contains("is-open")) {
        closeChat();
      }
    });
  }

  document.querySelectorAll("[data-guided-chat]").forEach(initChat);
})();
