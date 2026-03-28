/* =============================================
   ROTATING EYEBROW SENTENCES
   Replaces text in elements with data-rotate="true"
   with a random sentence from the bank below.
   Each label on the same page gets a unique sentence.

   To add/edit sentences: modify the array below.
   To add a new rotating label: add data-rotate="true"
   to any element in the HTML.
   ============================================= */
(function () {
  const sentences = [
    "כל בית צריך משהו אחר.",
    "אני מתחילה ממה שהכי דחוף.",
    "גם מה שנדחה לסוף מקבל אצלי תשומת לב.",
    "לא צריך להסביר הרבה. אני רואה מהר.",
    "אני באה לעבוד, לא לעשות עניין.",
    "כמה שעות טובות, והבית חוזר לעצמו.",
    "אני שמה לב גם לפרטים הקטנים.",
    "גם מאחורי הדלת ומתחת לשולחן.",
    "אני מסיימת רק כשנראה לי כמו שצריך.",
    "יש בתים שצריכים יסודי. יש כאלה שצריכים רק סדר.",
    "אני אוהבת להשאיר אחריי בית מסודר באמת.",
    "לא צריך רשימה ארוכה כדי להתחיל.",
    "אני עובדת כמו שהייתי רוצה שיעבדו אצלי.",
    "כל פינה חשובה.",
    "אני רואה מהר מאיפה צריך להתחיל.",
    "גם בית עמוס אפשר להחזיר למקום.",
    "אני באה לעזור, לא לשפוט.",
    "אני לא הולכת עד שזה נראה לי כמו שצריך.",
    "אני שומרת על הבית שלכם כמו שהייתי שומרת על שלי.",
    "יש הקלה גדולה כשנכנסים לבית מסודר.",
    "אני מעדיפה לעבוד פשוט וברור.",
    "גם מה שלא רואים מקבל אצלי טיפול.",
    "לפעמים מתחילים מהמטבח, ומשם הכל זז.",
    "חשוב לי שתהיו בנוח מהשיחה הראשונה.",
    "אני מגיעה לעבוד מסודר וללכת כשהכל במקום.",
  ];

  function shuffle(arr) {
    const a = [...arr];

    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
  }

  const shuffled = shuffle(sentences);
  const labels = document.querySelectorAll('[data-rotate="true"]');

  labels.forEach((label, index) => {
    label.textContent = shuffled[index % shuffled.length];
    label.style.opacity = "0";
    label.style.transition = "opacity 0.4s ease";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        label.style.opacity = "1";
      });
    });
  });
})();
