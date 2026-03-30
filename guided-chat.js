(function () {
  const WHATSAPP_BASE = "https://wa.me/972527303546?text=";

  const steps = {
    intro: {
      assistant: [
        "היי, אפשר לשאול אותי משהו קצר.",
        "אני יכולה לעזור עם אזור הגעה, סוג ניקיון, מחיר ואיך מתחילים.",
      ],
      options: [
        { label: "עד איפה את מגיעה?", next: "coverage", summary: "נושא: אזור הגעה" },
        { label: "מה אפשר לנקות?", next: "services", summary: "נושא: סוגי ניקיון" },
        { label: "איך עובד המחיר?", next: "pricing", summary: "נושא: מחיר" },
        { label: "מה לגבי מצבים רגישים יותר?", next: "sensitive", summary: "נושא: מצבים רגישים" },
        { label: "איך מתחילים?", next: "start", summary: "נושא: התחלה" },
      ],
    },
    coverage: {
      assistant: [
        "הדגש הוא על כפר סבא והסביבה.",
        "אם יש אליכם תחבורה ציבורית נוחה, בהרבה מקרים אני יכולה להגיע גם מעבר לזה.",
      ],
      options: [
        { label: "אני מכפר סבא והסביבה", next: "handoff", summary: "אזור: כפר סבא והסביבה" },
        { label: "אני קצת מעבר", next: "coverageTransit", summary: "אזור: מעבר לכפר סבא" },
        { label: "עוד שאלה", next: "intro" },
      ],
    },
    coverageTransit: {
      assistant: [
        "אם אתם קצת מעבר, עדיין שווה לכתוב לי.",
        "אני אגיד בכנות אם זה נוח לי להגיע.",
      ],
      options: [
        { label: "לבדוק איתך בוואטסאפ", next: "handoff", summary: "צריך לבדוק הגעה" },
        { label: "עוד שאלה", next: "intro" },
      ],
    },
    services: {
      assistant: [
        "אני מנקה בתים, מטבחים, חדרי רחצה, חלונות, רצפות, חדרים, וגם עוזרת להחזיר סדר.",
        "יש בתים שצריכים ניקיון מלא, ויש כאלה שצריכים רק כמה דברים ממוקדים.",
      ],
      options: [
        { label: "ניקיון בית מלא", next: "handoff", summary: "צריך ניקיון בית מלא" },
        { label: "מטבח / רחצה / חלונות", next: "handoff", summary: "צריך ניקיון ממוקד" },
        { label: "בית שנערם קצת", next: "handoff", summary: "הבית נערם וצריך התחלה מסודרת" },
        { label: "עוד שאלה", next: "intro" },
      ],
    },
    pricing: {
      assistant: [
        "המחיר תלוי בגודל הבית, במה בדיוק צריך, ואם זה חד פעמי או קבוע.",
        "אני מעדיפה להבין בכמה מילים מה המצב, ואז להגיד בצורה ישרה אם זה מתאים.",
      ],
      options: [
        { label: "דירה או בית קטן", next: "handoff", summary: "שאל/ה על מחיר לדירה או בית קטן" },
        { label: "בית משפחתי", next: "handoff", summary: "שאל/ה על מחיר לבית משפחתי" },
        { label: "ניקיון חד פעמי", next: "handoff", summary: "שאל/ה על ניקיון חד פעמי" },
        { label: "ניקיון קבוע", next: "handoff", summary: "שאל/ה על ניקיון קבוע" },
      ],
    },
    sensitive: {
      assistant: [
        "כן. יש מצבים שדורשים יותר רגישות ופחות שאלות.",
        "אם יש מוגבלות, קושי פיזי, ציוד רפואי בבית, או פשוט תקופה כבדה, אפשר לכתוב לי בקצרה.",
      ],
      options: [
        { label: "יש מוגבלות או קושי פיזי", next: "handoff", summary: "יש מוגבלות או קושי פיזי" },
        { label: "יש ציוד רפואי בבית", next: "handoff", summary: "יש ציוד רפואי בבית" },
        { label: "הבית פשוט נערם", next: "handoff", summary: "הבית נערם וצריך גישה רגישה" },
        { label: "עוד שאלה", next: "intro" },
      ],
    },
    start: {
      assistant: [
        "הדרך הכי פשוטה להתחיל היא בהודעת וואטסאפ קצרה.",
        "מספיק לכתוב איפה אתם, מה צריך, ומה הכי דחוף, ואני חוזרת אליכם מהר.",
      ],
      options: [
        { label: "אני רוצה להתחיל", next: "handoff", summary: "רוצה להתחיל בוואטסאפ" },
        { label: "אני עוד לא בטוח/ה מה צריך", next: "handoff", summary: "עוד לא בטוח/ה מה צריך" },
        { label: "עוד שאלה", next: "intro" },
      ],
    },
    handoff: {
      assistant: [
        "מעולה. אפשר לעבור עכשיו לוואטסאפ.",
        "אני כבר אראה שם את הכיוון הכללי ואענה משם.",
      ],
      options: [
        { label: "עוד שאלה", next: "intro" },
      ],
    },
  };

  function buildWhatsappMessage(summary) {
    const details = Array.from(new Set(summary)).filter(Boolean);
    const lines = ["היי ליאת, הגעתי מהאתר."];

    if (details.length) {
      lines.push("אני בודק/ת איתך:");
      details.forEach((item) => lines.push(`- ${item}`));
    }

    lines.push("אשמח להמשיך איתך בוואטסאפ.");
    return `${WHATSAPP_BASE}${encodeURIComponent(lines.join("\n"))}`;
  }

  function createMessage(role, text) {
    const item = document.createElement("div");
    item.className = `guided-chat__message guided-chat__message--${role}`;
    item.textContent = text;
    return item;
  }

  function initChat(root) {
    const launcher = root.querySelector("[data-guided-chat-launcher]");
    const panel = root.querySelector("[data-guided-chat-panel]");
    const closeBtn = root.querySelector("[data-guided-chat-close]");
    const resetBtn = root.querySelector("[data-guided-chat-reset]");
    const messages = root.querySelector("[data-guided-chat-messages]");
    const optionsEl = root.querySelector("[data-guided-chat-options]");
    const handoffLink = root.querySelector("[data-guided-chat-handoff]");

    if (!launcher || !panel || !messages || !optionsEl || !handoffLink) {
      return;
    }

    const state = {
      started: false,
      summary: [],
    };

    function syncWhatsappLink() {
      handoffLink.href = buildWhatsappMessage(state.summary);
    }

    function scrollMessages() {
      messages.scrollTop = messages.scrollHeight;
    }

    function renderOptions(options) {
      optionsEl.innerHTML = "";

      options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "guided-chat__option";
        button.textContent = option.label;
        button.addEventListener("click", () => {
          messages.appendChild(createMessage("user", option.label));

          if (option.summary) {
            state.summary.push(option.summary);
            syncWhatsappLink();
          }

          renderStep(option.next);
        });

        optionsEl.appendChild(button);
      });

      scrollMessages();
    }

    function renderStep(stepId) {
      const step = steps[stepId];

      if (!step) {
        return;
      }

      step.assistant.forEach((text) => {
        messages.appendChild(createMessage("assistant", text));
      });

      renderOptions(step.options);
    }

    function startChat() {
      state.started = true;
      messages.innerHTML = "";
      optionsEl.innerHTML = "";
      syncWhatsappLink();
      renderStep("intro");
    }

    function openChat() {
      panel.hidden = false;
      root.classList.add("is-open");
      launcher.setAttribute("aria-expanded", "true");

      if (!state.started) {
        startChat();
      }
    }

    function closeChat() {
      panel.hidden = true;
      root.classList.remove("is-open");
      launcher.setAttribute("aria-expanded", "false");
    }

    function resetChat() {
      state.summary = [];
      syncWhatsappLink();
      startChat();
    }

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

    syncWhatsappLink();
  }

  document.querySelectorAll("[data-guided-chat]").forEach(initChat);
})();
