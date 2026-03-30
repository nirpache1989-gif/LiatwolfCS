(function () {
  const days = [
    {
      label: "ראשון",
      status: "available",
      statusLabel: "פנוי",
      timeRange: "09:00-12:00",
      whatsappText: "היי ליאת, ראיתי באתר שיום ראשון פנוי בין 09:00 ל-12:00. אשמח לבדוק אם זה עדיין רלוונטי.",
      enabled: true,
    },
    {
      label: "שני",
      status: "limited",
      statusLabel: "נשאר חלון אחד",
      timeRange: "13:30-16:00",
      whatsappText: "היי ליאת, ראיתי באתר שביום שני נשאר חלון אחד בין 13:30 ל-16:00. אשמח לבדוק אם זה עדיין פנוי.",
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
      timeRange: "08:30-11:30",
      whatsappText: "היי ליאת, ראיתי באתר שיום רביעי פנוי בין 08:30 ל-11:30. אשמח לבדוק אם זה מתאים.",
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
