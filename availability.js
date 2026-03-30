(function () {
  const days = [
    {
      label: "ראשון",
      status: "available",
      statusLabel: "פנוי",
      timeRange: "08:00-19:00",
      whatsappText: "היי ליאת, ראיתי באתר שיום ראשון פנוי בין 08:00 ל-19:00. אשמח לבדוק אם זה עדיין רלוונטי.",
      enabled: true,
    },
    {
      label: "שני",
      status: "available",
      statusLabel: "פנוי",
      timeRange: "08:00-19:00",
      whatsappText: "היי ליאת, ראיתי באתר שיום שני פנוי בין 08:00 ל-19:00. אשמח לבדוק אם זה עדיין רלוונטי.",
      enabled: true,
    },
    {
      label: "שלישי",
      status: "full",
      statusLabel: "מלא",
      timeRange: "כבר נתפס",
      whatsappText: "",
      enabled: false,
    },
    {
      label: "רביעי",
      status: "available",
      statusLabel: "פנוי",
      timeRange: "08:00-19:00",
      whatsappText: "היי ליאת, ראיתי באתר שיום רביעי פנוי בין 08:00 ל-19:00. אשמח לבדוק אם זה מתאים.",
      enabled: true,
    },
    {
      label: "חמישי",
      status: "full",
      statusLabel: "מלא",
      timeRange: "כבר נתפס",
      whatsappText: "",
      enabled: false,
    },
  ];

  const container = document.querySelector("[data-availability-board]");

  if (!container) {
    return;
  }

  container.innerHTML = days
    .map((day) => {
      const action = day.enabled
        ? `
          <a
            class="availability-card__action"
            href="https://wa.me/972527303546?text=${encodeURIComponent(day.whatsappText)}"
            target="_blank"
            rel="noreferrer"
          >
            לבדוק איתי
          </a>
        `
        : `
          <span class="availability-card__meta availability-card__meta--disabled">אפשר לכתוב לי לשבוע אחר</span>
        `;

      return `
        <article class="availability-card availability-card--${day.status}" data-animate>
          <div class="availability-card__top">
            <span class="availability-card__day">${day.label}</span>
            <span class="availability-card__status">${day.statusLabel}</span>
          </div>
          <p class="availability-card__time">${day.timeRange}</p>
          ${action}
        </article>
      `;
    })
    .join("");
})();
