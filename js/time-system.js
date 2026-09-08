/* =========================================================
   ATHAR TIME SYSTEM
   Reverse 24-hour clock + ATHAR calendar
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const ATHAR_ORIGIN_BCE = 2900;
const ATHAR_MIN_YEAR = 0;
const ATHAR_MAX_YEAR = 5240;


/*
 * ATHAR calendar is inspired by the ancient Egyptian
 * civil calendar:
 *
 * 12 months × 30 days
 * + 5 epagomenal days
 *
 * The names are ancient Egyptian month names.
 */

const ATHAR_MONTHS = [
  {
    name: "توت",
    latin: "THOTH"
  },
  {
    name: "بابه",
    latin: "PAOPHI"
  },
  {
    name: "هاتور",
    latin: "HATHOR"
  },
  {
    name: "كيهك",
    latin: "CHOIAK"
  },
  {
    name: "طوبة",
    latin: "TYBI"
  },
  {
    name: "أمشير",
    latin: "MECHIR"
  },
  {
    name: "برمهات",
    latin: "PHAMENOTH"
  },
  {
    name: "برمودة",
    latin: "PHARMUTHI"
  },
  {
    name: "بشنس",
    latin: "PACHONS"
  },
  {
    name: "بؤونة",
    latin: "PAYNI"
  },
  {
    name: "أبيب",
    latin: "EPIPHI"
  },
  {
    name: "مسرى",
    latin: "MESORE"
  }
];


const EPAGOMENAL_DAYS = [
  "يوم أوزير",
  "يوم حورس",
  "يوم ست",
  "يوم إيزيس",
  "يوم نفتيس"
];


/* =========================================================
   DOM
========================================================= */

const atharClockHour =
  document.getElementById("athar-hour-hand");

const atharClockMinute =
  document.getElementById("athar-minute-hand");

const atharClockSecond =
  document.getElementById("athar-second-hand");

const atharClockDigital =
  document.getElementById("athar-clock-digital");


const atharCalendarButton =
  document.getElementById("athar-calendar-button");

const atharCalendar =
  document.getElementById("athar-calendar");

const atharCalendarClose =
  document.getElementById("athar-calendar-close");

const atharCalendarGrid =
  document.getElementById("athar-calendar-grid");

const atharCalendarYear =
  document.getElementById("athar-calendar-year");

const atharCalendarMonth =
  document.getElementById("athar-calendar-month");

const atharCalendarDay =
  document.getElementById("athar-calendar-day");

const atharCalendarMonthFull =
  document.getElementById(
    "athar-calendar-month-full"
  );

const atharCalendarButtonDay =
  document.getElementById(
    "athar-calendar-button-day"
  );


const atharPrevYear =
  document.getElementById("athar-prev-year");

const atharNextYear =
  document.getElementById("athar-next-year");

const atharPrevMonth =
  document.getElementById("athar-prev-month");

const atharNextMonth =
  document.getElementById("athar-next-month");


/* =========================================================
   REVERSE CLOCK
========================================================= */

function updateAtharClock() {

  if (
    !atharClockHour ||
    !atharClockMinute ||
    !atharClockSecond
  ) {
    return;
  }

  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();


  /*
   * Normal clock:
   *
   * hour   = 30° per hour
   * minute = 6° per minute
   * second = 6° per second
   *
   * ATHAR reverses the direction.
   */

  const preciseSeconds =
    seconds + milliseconds / 1000;

  const preciseMinutes =
    minutes + preciseSeconds / 60;

  const preciseHours =
    (hours % 24) +
    preciseMinutes / 60;


  /*
   * 24-hour clock:
   * complete revolution = 24 hours
   *
   * Reverse direction:
   * subtract angle instead of adding it.
   */

  const hourAngle =
    -(preciseHours * 15);

  const minuteAngle =
    -(preciseMinutes * 6);

  const secondAngle =
    -(preciseSeconds * 6);


  atharClockHour.style.transform =
    `translateX(-50%) rotate(${hourAngle}deg)`;

  atharClockMinute.style.transform =
    `translateX(-50%) rotate(${minuteAngle}deg)`;

  atharClockSecond.style.transform =
    `translateX(-50%) rotate(${secondAngle}deg)`;


  const hh =
    String(hours).padStart(2, "0");

  const mm =
    String(minutes).padStart(2, "0");

  const ss =
    String(seconds).padStart(2, "0");


  atharClockDigital.textContent =
    `${hh}:${mm}:${ss}`;
}


/*
 * requestAnimationFrame makes the movement continuous.
 */

function runAtharClock() {

  updateAtharClock();

  requestAnimationFrame(
    runAtharClock
  );
}


/* =========================================================
   ATHAR DATE
========================================================= */

/*
 * ATHAR YEAR:
 *
 * 2900 BCE = ATHAR YEAR 0
 *
 * Therefore:
 *
 * 2026 CE ≈ ATHAR YEAR 4926
 *
 * This is a symbolic era calculation,
 * not a historical claim about Noah.
 */

function getAtharYear(gregorianYear) {

  return (
    gregorianYear +
    ATHAR_ORIGIN_BCE
  );
}


/*
 * ATHAR calendar uses:
 *
 * 12 × 30 days
 * + 5 epagomenal days
 *
 * For the interface we anchor ATHAR
 * year boundaries to January 1.
 */

function getAtharDate(date = new Date()) {

  const gregorianYear =
    date.getFullYear();

  const atharYear =
    getAtharYear(gregorianYear);


  /*
   * Calculate day of Gregorian year.
   */

  const start =
    new Date(
      gregorianYear,
      0,
      1
    );

  const current =
    new Date(
      gregorianYear,
      date.getMonth(),
      date.getDate()
    );


  const diff =
    Math.floor(
      (
        current - start
      ) /
      86400000
    );


  /*
   * 0-based day of ATHAR year.
   */

  const dayOfYear =
    diff;


  /*
   * First 360 days:
   * 12 months × 30 days.
   */

  if (dayOfYear < 360) {

    const monthIndex =
      Math.floor(
        dayOfYear / 30
      );

    const day =
      (dayOfYear % 30) + 1;

    return {
      year: atharYear,
      monthIndex,
      day,
      epagomenal: false
    };
  }


  /*
   * Five sacred days outside the months.
   */

  const epagomenalIndex =
    Math.min(
      dayOfYear - 360,
      4
    );

  return {
    year: atharYear,
    monthIndex: 12,
    day: epagomenalIndex + 1,
    epagomenal: true
  };
}


/* =========================================================
   CALENDAR STATE
========================================================= */

const todayAthar =
  getAtharDate();


let calendarYear =
  todayAthar.year;

let calendarMonth =
  todayAthar.monthIndex;


/* =========================================================
   CALENDAR RENDER
========================================================= */

function renderAtharCalendar() {

  if (!atharCalendarGrid) {
    return;
  }


  /*
   * Update header.
   */

  atharCalendarYear.textContent =
    calendarYear;


  if (
    calendarMonth >= 0 &&
    calendarMonth < 12
  ) {

    const month =
      ATHAR_MONTHS[calendarMonth];

    atharCalendarMonth.textContent =
      `${month.name} / ${month.latin}`;

    atharCalendarMonthFull.textContent =
      `${month.name} — ${month.latin}`;

  } else {

    atharCalendarMonth.textContent =
      "الأيام الخمسة";

    atharCalendarMonthFull.textContent =
      "EPAGOMENAL DAYS";
  }


  /*
   * Large date display.
   */

  if (
    calendarYear === todayAthar.year &&
    calendarMonth === todayAthar.monthIndex
  ) {

    atharCalendarDay.textContent =
      todayAthar.day;

  } else {

    atharCalendarDay.textContent =
      "—";
  }


  /*
   * Empty calendar.
   */

  atharCalendarGrid.innerHTML = "";


  /*
   * 30 days for every normal month.
   * Five special days for the epagomenal period.
   */

  const totalDays =
    calendarMonth < 12
      ? 30
      : 5;


  /*
   * We use a 7-column visual grid.
   * The first day starts at position 1
   * to keep the ancient calendar visually
   * independent from the Gregorian weekday.
   */

  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {

    const cell =
      document.createElement("button");

    cell.type = "button";

    cell.className =
      "athar-calendar-day";


    if (
      calendarYear === todayAthar.year &&
      calendarMonth === todayAthar.monthIndex &&
      day === todayAthar.day
    ) {

      cell.classList.add(
        "is-today"
      );
    }


    if (calendarMonth === 12) {

      cell.classList.add(
        "epagomenal"
      );

      cell.textContent =
        EPAGOMENAL_DAYS[day - 1];

    } else {

      cell.textContent =
        day;
    }


    atharCalendarGrid.appendChild(
      cell
    );
  }
}


/* =========================================================
   CALENDAR NAVIGATION
========================================================= */

function moveAtharMonth(amount) {

  calendarMonth += amount;


  if (calendarMonth < 0) {

    if (
      calendarYear >
      ATHAR_MIN_YEAR
    ) {

      calendarYear--;
      calendarMonth = 12;

    } else {

      calendarMonth = 0;
    }
  }


  if (calendarMonth > 12) {

    if (
      calendarYear <
      ATHAR_MAX_YEAR
    ) {

      calendarYear++;
      calendarMonth = 0;

    } else {

      calendarMonth = 12;
    }
  }


  renderAtharCalendar();
}


function moveAtharYear(amount) {

  const newYear =
    calendarYear + amount;


  if (
    newYear <
    ATHAR_MIN_YEAR
  ) {
    return;
  }


  if (
    newYear >
    ATHAR_MAX_YEAR
  ) {
    return;
  }


  calendarYear =
    newYear;


  renderAtharCalendar();
}


/* =========================================================
   OPEN / CLOSE
========================================================= */

if (atharCalendarButton) {

  atharCalendarButton.addEventListener(
    "click",
    () => {

      atharCalendar.classList.remove(
        "hidden"
      );

      renderAtharCalendar();
    }
  );
}


if (atharCalendarClose) {

  atharCalendarClose.addEventListener(
    "click",
    () => {

      atharCalendar.classList.add(
        "hidden"
      );
    }
  );
}


if (atharPrevMonth) {

  atharPrevMonth.addEventListener(
    "click",
    () => {

      moveAtharMonth(-1);
    }
  );
}


if (atharNextMonth) {

  atharNextMonth.addEventListener(
    "click",
    () => {

      moveAtharMonth(1);
    }
  );
}


if (atharPrevYear) {

  atharPrevYear.addEventListener(
    "click",
    () => {

      moveAtharYear(-1);
    }
  );
}


if (atharNextYear) {

  atharNextYear.addEventListener(
    "click",
    () => {

      moveAtharYear(1);
    }
  );
}


/* =========================================================
   TODAY BUTTON DISPLAY
========================================================= */

function updateAtharCalendarButton() {

  if (!atharCalendarButtonDay) {
    return;
  }

  atharCalendarButtonDay.textContent =
    String(
      todayAthar.day
    ).padStart(2, "0");
}


/* =========================================================
   START
========================================================= */

updateAtharCalendarButton();

runAtharClock();
