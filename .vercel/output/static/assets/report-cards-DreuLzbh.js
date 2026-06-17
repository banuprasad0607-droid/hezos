import {
  x as r,
  a0 as xe,
  X as be,
  P as pe,
  D as ge,
  n as we,
  M as P,
  N as C,
  I as ye,
} from "./index-DrqTZ7SR.js";
import { k as p, r as je } from "./vendor-charts-DECNlt_G.js";
import { E as ke } from "./vendor-pdf-BA8uJ8a4.js";
import "./vendor-supabase-Bz3EdAMz.js";
const K = 6048e5,
  ve = 864e5,
  X = Symbol.for("constructDateFrom");
function k(e, t) {
  return typeof e == "function"
    ? e(t)
    : e && typeof e == "object" && X in e
      ? e[X](t)
      : e instanceof Date
        ? new e.constructor(t)
        : new Date(t);
}
function w(e, t) {
  return k(t || e, e);
}
let Ne = {};
function F() {
  return Ne;
}
function W(e, t) {
  const a = F(),
    n =
      t?.weekStartsOn ??
      t?.locale?.options?.weekStartsOn ??
      a.weekStartsOn ??
      a.locale?.options?.weekStartsOn ??
      0,
    s = w(e, t?.in),
    o = s.getDay(),
    c = (o < n ? 7 : 0) + o - n;
  return (s.setDate(s.getDate() - c), s.setHours(0, 0, 0, 0), s);
}
function Y(e, t) {
  return W(e, { ...t, weekStartsOn: 1 });
}
function Z(e, t) {
  const a = w(e, t?.in),
    n = a.getFullYear(),
    s = k(a, 0);
  (s.setFullYear(n + 1, 0, 4), s.setHours(0, 0, 0, 0));
  const o = Y(s),
    c = k(a, 0);
  (c.setFullYear(n, 0, 4), c.setHours(0, 0, 0, 0));
  const u = Y(c);
  return a.getTime() >= o.getTime() ? n + 1 : a.getTime() >= u.getTime() ? n : n - 1;
}
function B(e) {
  const t = w(e),
    a = new Date(
      Date.UTC(
        t.getFullYear(),
        t.getMonth(),
        t.getDate(),
        t.getHours(),
        t.getMinutes(),
        t.getSeconds(),
        t.getMilliseconds(),
      ),
    );
  return (a.setUTCFullYear(t.getFullYear()), +e - +a);
}
function Pe(e, ...t) {
  const a = k.bind(
    null,
    t.find((n) => typeof n == "object"),
  );
  return t.map(a);
}
function z(e, t) {
  const a = w(e, t?.in);
  return (a.setHours(0, 0, 0, 0), a);
}
function Me(e, t, a) {
  const [n, s] = Pe(a?.in, e, t),
    o = z(n),
    c = z(s),
    u = +o - B(o),
    b = +c - B(c);
  return Math.round((u - b) / ve);
}
function Se(e, t) {
  const a = Z(e, t),
    n = k(e, 0);
  return (n.setFullYear(a, 0, 4), n.setHours(0, 0, 0, 0), Y(n));
}
function _e(e) {
  return (
    e instanceof Date ||
    (typeof e == "object" && Object.prototype.toString.call(e) === "[object Date]")
  );
}
function De(e) {
  return !((!_e(e) && typeof e != "number") || isNaN(+w(e)));
}
function Oe(e, t) {
  const a = w(e, t?.in);
  return (a.setFullYear(a.getFullYear(), 0, 1), a.setHours(0, 0, 0, 0), a);
}
const We = {
    lessThanXSeconds: { one: "less than a second", other: "less than {{count}} seconds" },
    xSeconds: { one: "1 second", other: "{{count}} seconds" },
    halfAMinute: "half a minute",
    lessThanXMinutes: { one: "less than a minute", other: "less than {{count}} minutes" },
    xMinutes: { one: "1 minute", other: "{{count}} minutes" },
    aboutXHours: { one: "about 1 hour", other: "about {{count}} hours" },
    xHours: { one: "1 hour", other: "{{count}} hours" },
    xDays: { one: "1 day", other: "{{count}} days" },
    aboutXWeeks: { one: "about 1 week", other: "about {{count}} weeks" },
    xWeeks: { one: "1 week", other: "{{count}} weeks" },
    aboutXMonths: { one: "about 1 month", other: "about {{count}} months" },
    xMonths: { one: "1 month", other: "{{count}} months" },
    aboutXYears: { one: "about 1 year", other: "about {{count}} years" },
    xYears: { one: "1 year", other: "{{count}} years" },
    overXYears: { one: "over 1 year", other: "over {{count}} years" },
    almostXYears: { one: "almost 1 year", other: "almost {{count}} years" },
  },
  Ee = (e, t, a) => {
    let n;
    const s = We[e];
    return (
      typeof s == "string"
        ? (n = s)
        : t === 1
          ? (n = s.one)
          : (n = s.other.replace("{{count}}", t.toString())),
      a?.addSuffix ? (a.comparison && a.comparison > 0 ? "in " + n : n + " ago") : n
    );
  };
function H(e) {
  return (t = {}) => {
    const a = t.width ? String(t.width) : e.defaultWidth;
    return e.formats[a] || e.formats[e.defaultWidth];
  };
}
const Te = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy",
  },
  Ce = { full: "h:mm:ss a zzzz", long: "h:mm:ss a z", medium: "h:mm:ss a", short: "h:mm a" },
  Ye = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}",
  },
  Fe = {
    date: H({ formats: Te, defaultWidth: "full" }),
    time: H({ formats: Ce, defaultWidth: "full" }),
    dateTime: H({ formats: Ye, defaultWidth: "full" }),
  },
  qe = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P",
  },
  Re = (e, t, a, n) => qe[e];
function D(e) {
  return (t, a) => {
    const n = a?.context ? String(a.context) : "standalone";
    let s;
    if (n === "formatting" && e.formattingValues) {
      const c = e.defaultFormattingWidth || e.defaultWidth,
        u = a?.width ? String(a.width) : c;
      s = e.formattingValues[u] || e.formattingValues[c];
    } else {
      const c = e.defaultWidth,
        u = a?.width ? String(a.width) : e.defaultWidth;
      s = e.values[u] || e.values[c];
    }
    const o = e.argumentCallback ? e.argumentCallback(t) : t;
    return s[o];
  };
}
const He = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"],
  },
  Ae = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
  },
  Ge = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    wide: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  Le = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  Ie = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
  },
  Qe = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
  },
  Xe = (e, t) => {
    const a = Number(e),
      n = a % 100;
    if (n > 20 || n < 10)
      switch (n % 10) {
        case 1:
          return a + "st";
        case 2:
          return a + "nd";
        case 3:
          return a + "rd";
      }
    return a + "th";
  },
  Be = {
    ordinalNumber: Xe,
    era: D({ values: He, defaultWidth: "wide" }),
    quarter: D({ values: Ae, defaultWidth: "wide", argumentCallback: (e) => e - 1 }),
    month: D({ values: Ge, defaultWidth: "wide" }),
    day: D({ values: Le, defaultWidth: "wide" }),
    dayPeriod: D({
      values: Ie,
      defaultWidth: "wide",
      formattingValues: Qe,
      defaultFormattingWidth: "wide",
    }),
  };
function O(e) {
  return (t, a = {}) => {
    const n = a.width,
      s = (n && e.matchPatterns[n]) || e.matchPatterns[e.defaultMatchWidth],
      o = t.match(s);
    if (!o) return null;
    const c = o[0],
      u = (n && e.parsePatterns[n]) || e.parsePatterns[e.defaultParseWidth],
      b = Array.isArray(u) ? Ve(u, (h) => h.test(c)) : ze(u, (h) => h.test(c));
    let d;
    ((d = e.valueCallback ? e.valueCallback(b) : b),
      (d = a.valueCallback ? a.valueCallback(d) : d));
    const m = t.slice(c.length);
    return { value: d, rest: m };
  };
}
function ze(e, t) {
  for (const a in e) if (Object.prototype.hasOwnProperty.call(e, a) && t(e[a])) return a;
}
function Ve(e, t) {
  for (let a = 0; a < e.length; a++) if (t(e[a])) return a;
}
function $e(e) {
  return (t, a = {}) => {
    const n = t.match(e.matchPattern);
    if (!n) return null;
    const s = n[0],
      o = t.match(e.parsePattern);
    if (!o) return null;
    let c = e.valueCallback ? e.valueCallback(o[0]) : o[0];
    c = a.valueCallback ? a.valueCallback(c) : c;
    const u = t.slice(s.length);
    return { value: c, rest: u };
  };
}
const Je = /^(\d+)(th|st|nd|rd)?/i,
  Ue = /\d+/i,
  Ke = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i,
  },
  Ze = { any: [/^b/i, /^(a|c)/i] },
  et = { narrow: /^[1234]/i, abbreviated: /^q[1234]/i, wide: /^[1234](th|st|nd|rd)? quarter/i },
  tt = { any: [/1/i, /2/i, /3/i, /4/i] },
  at = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  },
  nt = {
    narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
  },
  rt = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  },
  st = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  },
  ot = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
  },
  it = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i,
    },
  },
  ct = {
    ordinalNumber: $e({
      matchPattern: Je,
      parsePattern: Ue,
      valueCallback: (e) => parseInt(e, 10),
    }),
    era: O({
      matchPatterns: Ke,
      defaultMatchWidth: "wide",
      parsePatterns: Ze,
      defaultParseWidth: "any",
    }),
    quarter: O({
      matchPatterns: et,
      defaultMatchWidth: "wide",
      parsePatterns: tt,
      defaultParseWidth: "any",
      valueCallback: (e) => e + 1,
    }),
    month: O({
      matchPatterns: at,
      defaultMatchWidth: "wide",
      parsePatterns: nt,
      defaultParseWidth: "any",
    }),
    day: O({
      matchPatterns: rt,
      defaultMatchWidth: "wide",
      parsePatterns: st,
      defaultParseWidth: "any",
    }),
    dayPeriod: O({
      matchPatterns: ot,
      defaultMatchWidth: "any",
      parsePatterns: it,
      defaultParseWidth: "any",
    }),
  },
  dt = {
    code: "en-US",
    formatDistance: Ee,
    formatLong: Fe,
    formatRelative: Re,
    localize: Be,
    match: ct,
    options: { weekStartsOn: 0, firstWeekContainsDate: 1 },
  };
function lt(e, t) {
  const a = w(e, t?.in);
  return Me(a, Oe(a)) + 1;
}
function ut(e, t) {
  const a = w(e, t?.in),
    n = +Y(a) - +Se(a);
  return Math.round(n / K) + 1;
}
function ee(e, t) {
  const a = w(e, t?.in),
    n = a.getFullYear(),
    s = F(),
    o =
      t?.firstWeekContainsDate ??
      t?.locale?.options?.firstWeekContainsDate ??
      s.firstWeekContainsDate ??
      s.locale?.options?.firstWeekContainsDate ??
      1,
    c = k(t?.in || e, 0);
  (c.setFullYear(n + 1, 0, o), c.setHours(0, 0, 0, 0));
  const u = W(c, t),
    b = k(t?.in || e, 0);
  (b.setFullYear(n, 0, o), b.setHours(0, 0, 0, 0));
  const d = W(b, t);
  return +a >= +u ? n + 1 : +a >= +d ? n : n - 1;
}
function mt(e, t) {
  const a = F(),
    n =
      t?.firstWeekContainsDate ??
      t?.locale?.options?.firstWeekContainsDate ??
      a.firstWeekContainsDate ??
      a.locale?.options?.firstWeekContainsDate ??
      1,
    s = ee(e, t),
    o = k(t?.in || e, 0);
  return (o.setFullYear(s, 0, n), o.setHours(0, 0, 0, 0), W(o, t));
}
function ht(e, t) {
  const a = w(e, t?.in),
    n = +W(a, t) - +mt(a, t);
  return Math.round(n / K) + 1;
}
function l(e, t) {
  const a = e < 0 ? "-" : "",
    n = Math.abs(e).toString().padStart(t, "0");
  return a + n;
}
const j = {
    y(e, t) {
      const a = e.getFullYear(),
        n = a > 0 ? a : 1 - a;
      return l(t === "yy" ? n % 100 : n, t.length);
    },
    M(e, t) {
      const a = e.getMonth();
      return t === "M" ? String(a + 1) : l(a + 1, 2);
    },
    d(e, t) {
      return l(e.getDate(), t.length);
    },
    a(e, t) {
      const a = e.getHours() / 12 >= 1 ? "pm" : "am";
      switch (t) {
        case "a":
        case "aa":
          return a.toUpperCase();
        case "aaa":
          return a;
        case "aaaaa":
          return a[0];
        default:
          return a === "am" ? "a.m." : "p.m.";
      }
    },
    h(e, t) {
      return l(e.getHours() % 12 || 12, t.length);
    },
    H(e, t) {
      return l(e.getHours(), t.length);
    },
    m(e, t) {
      return l(e.getMinutes(), t.length);
    },
    s(e, t) {
      return l(e.getSeconds(), t.length);
    },
    S(e, t) {
      const a = t.length,
        n = e.getMilliseconds(),
        s = Math.trunc(n * Math.pow(10, a - 3));
      return l(s, t.length);
    },
  },
  S = {
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  V = {
    G: function (e, t, a) {
      const n = e.getFullYear() > 0 ? 1 : 0;
      switch (t) {
        case "G":
        case "GG":
        case "GGG":
          return a.era(n, { width: "abbreviated" });
        case "GGGGG":
          return a.era(n, { width: "narrow" });
        default:
          return a.era(n, { width: "wide" });
      }
    },
    y: function (e, t, a) {
      if (t === "yo") {
        const n = e.getFullYear(),
          s = n > 0 ? n : 1 - n;
        return a.ordinalNumber(s, { unit: "year" });
      }
      return j.y(e, t);
    },
    Y: function (e, t, a, n) {
      const s = ee(e, n),
        o = s > 0 ? s : 1 - s;
      if (t === "YY") {
        const c = o % 100;
        return l(c, 2);
      }
      return t === "Yo" ? a.ordinalNumber(o, { unit: "year" }) : l(o, t.length);
    },
    R: function (e, t) {
      const a = Z(e);
      return l(a, t.length);
    },
    u: function (e, t) {
      const a = e.getFullYear();
      return l(a, t.length);
    },
    Q: function (e, t, a) {
      const n = Math.ceil((e.getMonth() + 1) / 3);
      switch (t) {
        case "Q":
          return String(n);
        case "QQ":
          return l(n, 2);
        case "Qo":
          return a.ordinalNumber(n, { unit: "quarter" });
        case "QQQ":
          return a.quarter(n, { width: "abbreviated", context: "formatting" });
        case "QQQQQ":
          return a.quarter(n, { width: "narrow", context: "formatting" });
        default:
          return a.quarter(n, { width: "wide", context: "formatting" });
      }
    },
    q: function (e, t, a) {
      const n = Math.ceil((e.getMonth() + 1) / 3);
      switch (t) {
        case "q":
          return String(n);
        case "qq":
          return l(n, 2);
        case "qo":
          return a.ordinalNumber(n, { unit: "quarter" });
        case "qqq":
          return a.quarter(n, { width: "abbreviated", context: "standalone" });
        case "qqqqq":
          return a.quarter(n, { width: "narrow", context: "standalone" });
        default:
          return a.quarter(n, { width: "wide", context: "standalone" });
      }
    },
    M: function (e, t, a) {
      const n = e.getMonth();
      switch (t) {
        case "M":
        case "MM":
          return j.M(e, t);
        case "Mo":
          return a.ordinalNumber(n + 1, { unit: "month" });
        case "MMM":
          return a.month(n, { width: "abbreviated", context: "formatting" });
        case "MMMMM":
          return a.month(n, { width: "narrow", context: "formatting" });
        default:
          return a.month(n, { width: "wide", context: "formatting" });
      }
    },
    L: function (e, t, a) {
      const n = e.getMonth();
      switch (t) {
        case "L":
          return String(n + 1);
        case "LL":
          return l(n + 1, 2);
        case "Lo":
          return a.ordinalNumber(n + 1, { unit: "month" });
        case "LLL":
          return a.month(n, { width: "abbreviated", context: "standalone" });
        case "LLLLL":
          return a.month(n, { width: "narrow", context: "standalone" });
        default:
          return a.month(n, { width: "wide", context: "standalone" });
      }
    },
    w: function (e, t, a, n) {
      const s = ht(e, n);
      return t === "wo" ? a.ordinalNumber(s, { unit: "week" }) : l(s, t.length);
    },
    I: function (e, t, a) {
      const n = ut(e);
      return t === "Io" ? a.ordinalNumber(n, { unit: "week" }) : l(n, t.length);
    },
    d: function (e, t, a) {
      return t === "do" ? a.ordinalNumber(e.getDate(), { unit: "date" }) : j.d(e, t);
    },
    D: function (e, t, a) {
      const n = lt(e);
      return t === "Do" ? a.ordinalNumber(n, { unit: "dayOfYear" }) : l(n, t.length);
    },
    E: function (e, t, a) {
      const n = e.getDay();
      switch (t) {
        case "E":
        case "EE":
        case "EEE":
          return a.day(n, { width: "abbreviated", context: "formatting" });
        case "EEEEE":
          return a.day(n, { width: "narrow", context: "formatting" });
        case "EEEEEE":
          return a.day(n, { width: "short", context: "formatting" });
        default:
          return a.day(n, { width: "wide", context: "formatting" });
      }
    },
    e: function (e, t, a, n) {
      const s = e.getDay(),
        o = (s - n.weekStartsOn + 8) % 7 || 7;
      switch (t) {
        case "e":
          return String(o);
        case "ee":
          return l(o, 2);
        case "eo":
          return a.ordinalNumber(o, { unit: "day" });
        case "eee":
          return a.day(s, { width: "abbreviated", context: "formatting" });
        case "eeeee":
          return a.day(s, { width: "narrow", context: "formatting" });
        case "eeeeee":
          return a.day(s, { width: "short", context: "formatting" });
        default:
          return a.day(s, { width: "wide", context: "formatting" });
      }
    },
    c: function (e, t, a, n) {
      const s = e.getDay(),
        o = (s - n.weekStartsOn + 8) % 7 || 7;
      switch (t) {
        case "c":
          return String(o);
        case "cc":
          return l(o, t.length);
        case "co":
          return a.ordinalNumber(o, { unit: "day" });
        case "ccc":
          return a.day(s, { width: "abbreviated", context: "standalone" });
        case "ccccc":
          return a.day(s, { width: "narrow", context: "standalone" });
        case "cccccc":
          return a.day(s, { width: "short", context: "standalone" });
        default:
          return a.day(s, { width: "wide", context: "standalone" });
      }
    },
    i: function (e, t, a) {
      const n = e.getDay(),
        s = n === 0 ? 7 : n;
      switch (t) {
        case "i":
          return String(s);
        case "ii":
          return l(s, t.length);
        case "io":
          return a.ordinalNumber(s, { unit: "day" });
        case "iii":
          return a.day(n, { width: "abbreviated", context: "formatting" });
        case "iiiii":
          return a.day(n, { width: "narrow", context: "formatting" });
        case "iiiiii":
          return a.day(n, { width: "short", context: "formatting" });
        default:
          return a.day(n, { width: "wide", context: "formatting" });
      }
    },
    a: function (e, t, a) {
      const s = e.getHours() / 12 >= 1 ? "pm" : "am";
      switch (t) {
        case "a":
        case "aa":
          return a.dayPeriod(s, { width: "abbreviated", context: "formatting" });
        case "aaa":
          return a.dayPeriod(s, { width: "abbreviated", context: "formatting" }).toLowerCase();
        case "aaaaa":
          return a.dayPeriod(s, { width: "narrow", context: "formatting" });
        default:
          return a.dayPeriod(s, { width: "wide", context: "formatting" });
      }
    },
    b: function (e, t, a) {
      const n = e.getHours();
      let s;
      switch (
        (n === 12 ? (s = S.noon) : n === 0 ? (s = S.midnight) : (s = n / 12 >= 1 ? "pm" : "am"), t)
      ) {
        case "b":
        case "bb":
          return a.dayPeriod(s, { width: "abbreviated", context: "formatting" });
        case "bbb":
          return a.dayPeriod(s, { width: "abbreviated", context: "formatting" }).toLowerCase();
        case "bbbbb":
          return a.dayPeriod(s, { width: "narrow", context: "formatting" });
        default:
          return a.dayPeriod(s, { width: "wide", context: "formatting" });
      }
    },
    B: function (e, t, a) {
      const n = e.getHours();
      let s;
      switch (
        (n >= 17
          ? (s = S.evening)
          : n >= 12
            ? (s = S.afternoon)
            : n >= 4
              ? (s = S.morning)
              : (s = S.night),
        t)
      ) {
        case "B":
        case "BB":
        case "BBB":
          return a.dayPeriod(s, { width: "abbreviated", context: "formatting" });
        case "BBBBB":
          return a.dayPeriod(s, { width: "narrow", context: "formatting" });
        default:
          return a.dayPeriod(s, { width: "wide", context: "formatting" });
      }
    },
    h: function (e, t, a) {
      if (t === "ho") {
        let n = e.getHours() % 12;
        return (n === 0 && (n = 12), a.ordinalNumber(n, { unit: "hour" }));
      }
      return j.h(e, t);
    },
    H: function (e, t, a) {
      return t === "Ho" ? a.ordinalNumber(e.getHours(), { unit: "hour" }) : j.H(e, t);
    },
    K: function (e, t, a) {
      const n = e.getHours() % 12;
      return t === "Ko" ? a.ordinalNumber(n, { unit: "hour" }) : l(n, t.length);
    },
    k: function (e, t, a) {
      let n = e.getHours();
      return (
        n === 0 && (n = 24),
        t === "ko" ? a.ordinalNumber(n, { unit: "hour" }) : l(n, t.length)
      );
    },
    m: function (e, t, a) {
      return t === "mo" ? a.ordinalNumber(e.getMinutes(), { unit: "minute" }) : j.m(e, t);
    },
    s: function (e, t, a) {
      return t === "so" ? a.ordinalNumber(e.getSeconds(), { unit: "second" }) : j.s(e, t);
    },
    S: function (e, t) {
      return j.S(e, t);
    },
    X: function (e, t, a) {
      const n = e.getTimezoneOffset();
      if (n === 0) return "Z";
      switch (t) {
        case "X":
          return J(n);
        case "XXXX":
        case "XX":
          return M(n);
        default:
          return M(n, ":");
      }
    },
    x: function (e, t, a) {
      const n = e.getTimezoneOffset();
      switch (t) {
        case "x":
          return J(n);
        case "xxxx":
        case "xx":
          return M(n);
        default:
          return M(n, ":");
      }
    },
    O: function (e, t, a) {
      const n = e.getTimezoneOffset();
      switch (t) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + $(n, ":");
        default:
          return "GMT" + M(n, ":");
      }
    },
    z: function (e, t, a) {
      const n = e.getTimezoneOffset();
      switch (t) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + $(n, ":");
        default:
          return "GMT" + M(n, ":");
      }
    },
    t: function (e, t, a) {
      const n = Math.trunc(+e / 1e3);
      return l(n, t.length);
    },
    T: function (e, t, a) {
      return l(+e, t.length);
    },
  };
function $(e, t = "") {
  const a = e > 0 ? "-" : "+",
    n = Math.abs(e),
    s = Math.trunc(n / 60),
    o = n % 60;
  return o === 0 ? a + String(s) : a + String(s) + t + l(o, 2);
}
function J(e, t) {
  return e % 60 === 0 ? (e > 0 ? "-" : "+") + l(Math.abs(e) / 60, 2) : M(e, t);
}
function M(e, t = "") {
  const a = e > 0 ? "-" : "+",
    n = Math.abs(e),
    s = l(Math.trunc(n / 60), 2),
    o = l(n % 60, 2);
  return a + s + t + o;
}
const U = (e, t) => {
    switch (e) {
      case "P":
        return t.date({ width: "short" });
      case "PP":
        return t.date({ width: "medium" });
      case "PPP":
        return t.date({ width: "long" });
      default:
        return t.date({ width: "full" });
    }
  },
  te = (e, t) => {
    switch (e) {
      case "p":
        return t.time({ width: "short" });
      case "pp":
        return t.time({ width: "medium" });
      case "ppp":
        return t.time({ width: "long" });
      default:
        return t.time({ width: "full" });
    }
  },
  ft = (e, t) => {
    const a = e.match(/(P+)(p+)?/) || [],
      n = a[1],
      s = a[2];
    if (!s) return U(e, t);
    let o;
    switch (n) {
      case "P":
        o = t.dateTime({ width: "short" });
        break;
      case "PP":
        o = t.dateTime({ width: "medium" });
        break;
      case "PPP":
        o = t.dateTime({ width: "long" });
        break;
      default:
        o = t.dateTime({ width: "full" });
        break;
    }
    return o.replace("{{date}}", U(n, t)).replace("{{time}}", te(s, t));
  },
  xt = { p: te, P: ft },
  bt = /^D+$/,
  pt = /^Y+$/,
  gt = ["D", "DD", "YY", "YYYY"];
function wt(e) {
  return bt.test(e);
}
function yt(e) {
  return pt.test(e);
}
function jt(e, t, a) {
  const n = kt(e, t, a);
  if ((console.warn(n), gt.includes(e))) throw new RangeError(n);
}
function kt(e, t, a) {
  const n = e[0] === "Y" ? "years" : "days of the month";
  return `Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${t}\`) for formatting ${n} to the input \`${a}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const vt = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  Nt = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  Pt = /^'([^]*?)'?$/,
  Mt = /''/g,
  St = /[a-zA-Z]/;
function _t(e, t, a) {
  const n = F(),
    s = n.locale ?? dt,
    o = n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1,
    c = n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0,
    u = w(e, a?.in);
  if (!De(u)) throw new RangeError("Invalid time value");
  let b = t
    .match(Nt)
    .map((m) => {
      const h = m[0];
      if (h === "p" || h === "P") {
        const _ = xt[h];
        return _(m, s.formatLong);
      }
      return m;
    })
    .join("")
    .match(vt)
    .map((m) => {
      if (m === "''") return { isToken: !1, value: "'" };
      const h = m[0];
      if (h === "'") return { isToken: !1, value: Dt(m) };
      if (V[h]) return { isToken: !0, value: m };
      if (h.match(St))
        throw new RangeError(
          "Format string contains an unescaped latin alphabet character `" + h + "`",
        );
      return { isToken: !1, value: m };
    });
  s.localize.preprocessor && (b = s.localize.preprocessor(u, b));
  const d = { firstWeekContainsDate: o, weekStartsOn: c, locale: s };
  return b
    .map((m) => {
      if (!m.isToken) return m.value;
      const h = m.value;
      (yt(h) || wt(h)) && jt(h, t, String(e));
      const _ = V[h[0]];
      return _(u, h, s.localize, d);
    })
    .join("");
}
function Dt(e) {
  const t = e.match(Pt);
  return t ? t[1].replace(Mt, "'") : e;
}
function Ot({ school: e, exam: t, student: a, marks: n, overallRemarks: s }) {
  const o = n.reduce((d, m) => d + m.max_marks, 0),
    c = n.reduce((d, m) => (m.is_absent || m.is_medical_exempt ? d : d + m.obtained), 0),
    u = o > 0 ? (c / o) * 100 : 0,
    b = (d) =>
      d >= 91
        ? "A+"
        : d >= 81
          ? "A"
          : d >= 71
            ? "B+"
            : d >= 61
              ? "B"
              : d >= 51
                ? "C+"
                : d >= 41
                  ? "C"
                  : d >= 35
                    ? "D"
                    : "F";
  return r.jsxs("div", {
    className:
      "bg-white w-[794px] min-h-[1123px] p-10 font-sans text-slate-800 mx-auto shadow-xl relative overflow-hidden",
    style: { boxSizing: "border-box" },
    children: [
      r.jsx("div", {
        className:
          "absolute inset-4 border-[3px] border-double border-slate-800 pointer-events-none rounded-sm opacity-20",
      }),
      r.jsx("div", {
        className:
          "absolute inset-5 border border-slate-800 pointer-events-none rounded opacity-10",
      }),
      r.jsxs("div", {
        className:
          "flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-8 relative z-10",
        children: [
          r.jsx("div", {
            className:
              "w-24 h-24 shrink-0 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden border border-slate-200",
            children: e.logo_url
              ? r.jsx("img", {
                  src: e.logo_url,
                  alt: "Logo",
                  className: "w-full h-full object-contain p-2",
                })
              : r.jsx("div", { className: "text-3xl font-black text-slate-300", children: "Logo" }),
          }),
          r.jsxs("div", {
            className: "flex-1 text-center px-4",
            children: [
              r.jsx("h1", {
                className: "text-3xl font-black text-slate-900 tracking-tight uppercase",
                children: e.name,
              }),
              r.jsx("p", {
                className: "text-sm font-medium text-slate-600 mt-1 uppercase tracking-widest",
                children: e.address || "School Address Not Provided",
              }),
              r.jsxs("p", {
                className: "text-xs text-slate-500 mt-0.5",
                children: ["Ph: ", e.phone || "N/A"],
              }),
            ],
          }),
          r.jsx("div", { className: "w-24 h-24 shrink-0" }),
        ],
      }),
      r.jsxs("div", {
        className: "text-center mb-8 relative z-10",
        children: [
          r.jsx("h2", {
            className:
              "text-xl font-bold tracking-widest uppercase bg-slate-800 text-white inline-block px-6 py-1.5 rounded-full shadow-sm",
            children: "Report Card",
          }),
          r.jsxs("p", {
            className: "text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest",
            children: [t.name, " • ", t.academic_year],
          }),
        ],
      }),
      r.jsxs("div", {
        className: "flex gap-6 mb-8 relative z-10",
        children: [
          r.jsx("div", {
            className:
              "w-32 h-36 border-2 border-slate-200 rounded-lg overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center",
            children: a.photo_url
              ? r.jsx("img", {
                  src: a.photo_url,
                  alt: a.full_name,
                  className: "w-full h-full object-cover",
                })
              : r.jsx("div", {
                  className:
                    "text-slate-300 font-bold text-xs uppercase tracking-widest text-center px-2",
                  children: "No Photo",
                }),
          }),
          r.jsxs("div", {
            className: "flex-1 grid grid-cols-2 gap-x-8 gap-y-4",
            children: [
              r.jsxs("div", {
                className: "border-b border-slate-200 pb-1",
                children: [
                  r.jsx("span", {
                    className:
                      "text-[10px] font-bold text-slate-400 uppercase tracking-wider block",
                    children: "Student Name",
                  }),
                  r.jsx("span", { className: "font-bold text-lg", children: a.full_name }),
                ],
              }),
              r.jsxs("div", {
                className: "border-b border-slate-200 pb-1",
                children: [
                  r.jsx("span", {
                    className:
                      "text-[10px] font-bold text-slate-400 uppercase tracking-wider block",
                    children: "Class & Section",
                  }),
                  r.jsxs("span", {
                    className: "font-bold text-lg",
                    children: [a.class_name, " - ", a.section?.toUpperCase()],
                  }),
                ],
              }),
              r.jsxs("div", {
                className: "border-b border-slate-200 pb-1",
                children: [
                  r.jsx("span", {
                    className:
                      "text-[10px] font-bold text-slate-400 uppercase tracking-wider block",
                    children: "Roll Number",
                  }),
                  r.jsx("span", {
                    className: "font-semibold text-slate-700",
                    children: a.roll_number || "N/A",
                  }),
                ],
              }),
              r.jsxs("div", {
                className: "border-b border-slate-200 pb-1",
                children: [
                  r.jsx("span", {
                    className:
                      "text-[10px] font-bold text-slate-400 uppercase tracking-wider block",
                    children: "Admission Number",
                  }),
                  r.jsx("span", {
                    className: "font-semibold text-slate-700",
                    children: a.admission_number || "N/A",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      r.jsx("div", {
        className: "mb-8 relative z-10",
        children: r.jsxs("table", {
          className: "w-full border-collapse",
          children: [
            r.jsx("thead", {
              children: r.jsxs("tr", {
                className: "bg-slate-100 border-b-2 border-slate-800",
                children: [
                  r.jsx("th", {
                    className: "py-3 px-4 text-left font-bold text-sm uppercase tracking-wider",
                    children: "Subject",
                  }),
                  r.jsx("th", {
                    className: "py-3 px-4 text-center font-bold text-sm uppercase tracking-wider",
                    children: "Max",
                  }),
                  r.jsx("th", {
                    className: "py-3 px-4 text-center font-bold text-sm uppercase tracking-wider",
                    children: "Pass",
                  }),
                  r.jsx("th", {
                    className: "py-3 px-4 text-center font-bold text-sm uppercase tracking-wider",
                    children: "Obtained",
                  }),
                  r.jsx("th", {
                    className: "py-3 px-4 text-center font-bold text-sm uppercase tracking-wider",
                    children: "Grade",
                  }),
                  r.jsx("th", {
                    className: "py-3 px-4 text-left font-bold text-sm uppercase tracking-wider",
                    children: "Remarks",
                  }),
                ],
              }),
            }),
            r.jsx("tbody", {
              children: n.map((d, m) =>
                r.jsxs(
                  "tr",
                  {
                    className: "border-b border-slate-200 even:bg-slate-50/50",
                    children: [
                      r.jsx("td", {
                        className: "py-2.5 px-4 font-bold text-slate-700",
                        children: d.subject,
                      }),
                      r.jsx("td", {
                        className: "py-2.5 px-4 text-center font-medium text-slate-500",
                        children: d.max_marks,
                      }),
                      r.jsx("td", {
                        className: "py-2.5 px-4 text-center font-medium text-slate-400",
                        children: d.pass_marks,
                      }),
                      r.jsx("td", {
                        className: "py-2.5 px-4 text-center font-bold",
                        children: d.is_absent
                          ? r.jsx("span", {
                              className: "text-rose-600 text-xs tracking-wider",
                              children: "ABS",
                            })
                          : d.is_medical_exempt
                            ? r.jsx("span", {
                                className: "text-blue-600 text-xs tracking-wider",
                                children: "MED",
                              })
                            : d.obtained,
                      }),
                      r.jsx("td", {
                        className: "py-2.5 px-4 text-center font-black",
                        children: d.grade,
                      }),
                      r.jsx("td", {
                        className: "py-2.5 px-4 text-xs font-medium text-slate-600 italic",
                        children: d.remarks || "—",
                      }),
                    ],
                  },
                  m,
                ),
              ),
            }),
            r.jsx("tfoot", {
              children: r.jsxs("tr", {
                className: "border-t-[3px] border-slate-800 bg-slate-50",
                children: [
                  r.jsx("td", {
                    className: "py-4 px-4 font-black uppercase text-right tracking-widest",
                    colSpan: 3,
                    children: "Grand Total:",
                  }),
                  r.jsxs("td", {
                    className: "py-4 px-4 text-center font-black text-xl",
                    children: [c, " / ", o],
                  }),
                  r.jsxs("td", {
                    className: "py-4 px-4 text-center font-black text-xl text-brand",
                    children: [u.toFixed(1), "%"],
                  }),
                  r.jsx("td", {}),
                ],
              }),
            }),
          ],
        }),
      }),
      r.jsxs("div", {
        className: "grid grid-cols-3 gap-6 mb-12 relative z-10",
        children: [
          r.jsxs("div", {
            className: "bg-slate-50 border border-slate-200 rounded-xl p-4 text-center",
            children: [
              r.jsx("p", {
                className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1",
                children: "Overall Grade",
              }),
              r.jsx("p", { className: "text-3xl font-black text-slate-800", children: b(u) }),
            ],
          }),
          r.jsxs("div", {
            className: "bg-slate-50 border border-slate-200 rounded-xl p-4 text-center",
            children: [
              r.jsx("p", {
                className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1",
                children: "Attendance",
              }),
              r.jsxs("p", {
                className: "text-3xl font-black text-slate-800",
                children: [a.attendance_pct ?? "—", "%"],
              }),
            ],
          }),
          r.jsxs("div", {
            className: "bg-slate-50 border border-slate-200 rounded-xl p-4 text-center",
            children: [
              r.jsx("p", {
                className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1",
                children: "Result",
              }),
              r.jsx("p", {
                className: `text-2xl font-black ${u >= 35 ? "text-emerald-600" : "text-rose-600"} mt-1 uppercase tracking-widest`,
                children: u >= 35 ? "Pass" : "Fail",
              }),
            ],
          }),
        ],
      }),
      r.jsxs("div", {
        className: "mb-12 relative z-10",
        children: [
          r.jsx("h4", {
            className:
              "font-bold text-sm uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2 mb-3",
            children: "Class Teacher Remarks",
          }),
          r.jsx("p", {
            className:
              "text-sm text-slate-600 italic bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[80px]",
            children: s || "No remarks provided.",
          }),
        ],
      }),
      r.jsxs("div", {
        className: "mt-24 pt-8 border-t border-slate-200 flex justify-between px-10 relative z-10",
        children: [
          r.jsxs("div", {
            className: "text-center",
            children: [
              r.jsx("div", { className: "w-40 border-b border-slate-800 mb-2" }),
              r.jsx("span", {
                className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
                children: "Class Teacher",
              }),
            ],
          }),
          r.jsxs("div", {
            className: "text-center",
            children: [
              r.jsx("div", { className: "w-40 border-b border-slate-800 mb-2" }),
              r.jsx("span", {
                className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
                children: "Principal",
              }),
            ],
          }),
          r.jsxs("div", {
            className: "text-center",
            children: [
              r.jsx("div", { className: "w-40 border-b border-slate-800 mb-2" }),
              r.jsx("span", {
                className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
                children: "Parent / Guardian",
              }),
            ],
          }),
        ],
      }),
      r.jsxs("div", {
        className:
          "absolute bottom-6 left-0 right-0 text-center text-[9px] text-slate-400 font-medium tracking-widest uppercase",
        children: ["Generated on ", _t(new Date(), "MMM dd, yyyy"), " • Hezo School Connect"],
      }),
    ],
  });
}
function Yt() {
  const { currentSchoolId: e, user: t, roles: a, loading: n } = xe();
  be("Report Cards");
  const s = a.includes("super_admin") || a.includes("admin") || a.includes("principal"),
    [o, c] = p.useState(!0),
    [u, b] = p.useState(!1),
    [d, m] = p.useState([]),
    [h, _] = p.useState([]),
    [q, A] = p.useState([]),
    [G, R] = p.useState([]),
    [ae, ne] = p.useState([]),
    [re, se] = p.useState([]),
    [E, oe] = p.useState(null),
    [y, ie] = p.useState(""),
    [v, ce] = p.useState(""),
    L = p.useRef(null),
    de = async () => {
      if (e) {
        c(!0);
        try {
          const { data: i } = await P.from("schools").select("*").eq("id", e).single();
          oe(i);
          const { data: f } = await P.from("teacher_allocations").select("*").eq("school_id", e);
          se(f || []);
          const { data: g } = await P.from("classes")
            .select("*")
            .eq("school_id", e)
            .is("deleted_at", null)
            .order("name");
          m(g || []);
          const { data: x } = await P.from("exams")
            .select("*")
            .eq("school_id", e)
            .order("date", { ascending: !1 });
          _(x || []);
          const { data: N } = await P.from("exam_subjects")
            .select("*, subjects(name, code)")
            .eq("school_id", e);
          ne(N || []);
        } catch (i) {
          C.error("Error loading data: " + i.message);
        } finally {
          c(!1);
        }
      }
    };
  (p.useEffect(() => {
    de();
  }, [e]),
    p.useEffect(() => {
      if (!y || !v || !e) {
        (A([]), R([]));
        return;
      }
      (async () => {
        try {
          const { data: f } = await P.from("students")
            .select("*")
            .eq("school_id", e)
            .eq("class_id", y)
            .is("deleted_at", null);
          A(f || []);
          const g = (f || []).map((x) => x.id);
          if (g.length > 0) {
            const { data: x } = await P.from("mark_entries")
              .select("*")
              .eq("exam_id", v)
              .in("student_id", g);
            R(x || []);
          } else R([]);
        } catch (f) {
          console.error("Error loading details:", f);
        }
      })();
    }, [y, v, e]));
  const le = d.filter((i) =>
      s
        ? !0
        : re.some((f) => f.class_id === i.id && f.teacher_id === t?.id) ||
          i.class_teacher_id === t?.id,
    ),
    I = h.find((i) => i.id === v),
    Q = d.find((i) => i.id === y),
    ue = (i) => {
      const g = G.filter((x) => x.student_id === i.id).map((x) => {
        const N = ae.find((T) => T.id === x.exam_subject_id);
        return {
          subject: N?.subjects?.name || "Unknown Subject",
          max_marks: N?.max_marks || 100,
          pass_marks: N?.pass_marks || 35,
          obtained: Number(x.marks_obtained),
          grade: x.grade || "",
          remarks: x.remarks || "",
          is_absent: x.is_absent || !1,
          is_medical_exempt: x.is_medical_exempt || !1,
        };
      });
      return {
        school: {
          name: E?.name || "School Name",
          logo_url: E?.logo_url,
          address: E?.address,
          phone: E?.phone,
        },
        exam: { name: I?.name || "Exam", academic_year: I?.academic_year || "2026-2027" },
        student: {
          full_name: i.full_name,
          roll_number: i.roll_number,
          admission_number: i.admission_number,
          class_name: Q?.name || "",
          section: Q?.section || "",
          photo_url: i.photo_url,
          attendance_pct: 95,
        },
        marks: g,
        overallRemarks: "Promoted to next class.",
      };
    },
    me = async (i) => {
      if (L.current) {
        (b(!0), C.info(`Generating PDF for ${i.full_name}...`));
        try {
          await new Promise((fe) => setTimeout(fe, 150));
          const f = document.getElementById(`report-card-${i.id}`);
          if (!f) throw new Error("DOM element not found");
          const g = await ye(f, { scale: 2 }),
            x = new ke({ orientation: "portrait", unit: "mm", format: "a4" }),
            N = g.toDataURL("image/jpeg", 0.95),
            T = x.internal.pageSize.getWidth(),
            he = (g.height * T) / g.width;
          (x.addImage(N, "JPEG", 0, 0, T, he),
            x.save(`${i.full_name}_ReportCard.pdf`),
            C.success("Downloaded successfully!"));
        } catch (f) {
          C.error("Export failed: " + f.message);
        } finally {
          b(!1);
        }
      }
    };
  return n
    ? r.jsx("div", {
        className:
          "flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold",
        children: r.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            r.jsx("div", {
              className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
            }),
            r.jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "Loading report cards...",
            }),
          ],
        }),
      })
    : r.jsxs(r.Fragment, {
        children: [
          r.jsx(pe, { title: "Report Cards", breadcrumb: "Academics" }),
          r.jsxs("div", {
            className: "p-6 lg:p-8 space-y-6",
            children: [
              r.jsxs("div", {
                className:
                  "bg-white dark:bg-slate-900 p-5 rounded-2xl border border-border dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4",
                children: [
                  r.jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      r.jsx("span", {
                        className: "text-[10px] font-bold text-muted-foreground uppercase",
                        children: "Class",
                      }),
                      r.jsxs("select", {
                        value: y,
                        onChange: (i) => ie(i.target.value),
                        className:
                          "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                        children: [
                          r.jsx("option", { value: "", children: "-- Select Class --" }),
                          le.map((i) => r.jsx("option", { value: i.id, children: i.name }, i.id)),
                        ],
                      }),
                    ],
                  }),
                  r.jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      r.jsx("span", {
                        className: "text-[10px] font-bold text-muted-foreground uppercase",
                        children: "Exam Term",
                      }),
                      r.jsxs("select", {
                        value: v,
                        onChange: (i) => ce(i.target.value),
                        className:
                          "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                        children: [
                          r.jsx("option", { value: "", children: "-- Select Exam --" }),
                          h
                            .filter((i) => i.class_id === y)
                            .map((i) => r.jsx("option", { value: i.id, children: i.name }, i.id)),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              y && v
                ? r.jsxs("div", {
                    className:
                      "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden",
                    children: [
                      r.jsx("div", {
                        className:
                          "p-4 border-b border-border dark:border-slate-800 flex justify-between items-center",
                        children: r.jsx("h3", { className: "font-bold", children: "Students" }),
                      }),
                      r.jsxs("table", {
                        className: "w-full text-sm text-left",
                        children: [
                          r.jsx("thead", {
                            className:
                              "bg-slate-50 dark:bg-slate-800/40 text-muted-foreground border-b border-border dark:border-slate-800",
                            children: r.jsxs("tr", {
                              children: [
                                r.jsx("th", {
                                  className: "py-3 px-6 font-semibold",
                                  children: "Roll No",
                                }),
                                r.jsx("th", {
                                  className: "py-3 px-6 font-semibold",
                                  children: "Name",
                                }),
                                r.jsx("th", {
                                  className: "py-3 px-6 font-semibold text-center",
                                  children: "Marks Entered",
                                }),
                                r.jsx("th", {
                                  className: "py-3 px-6 font-semibold text-right",
                                  children: "Actions",
                                }),
                              ],
                            }),
                          }),
                          r.jsx("tbody", {
                            className: "divide-y divide-border dark:divide-slate-800",
                            children:
                              q.length === 0
                                ? r.jsx("tr", {
                                    children: r.jsx("td", {
                                      colSpan: 4,
                                      className: "p-6 text-center text-muted-foreground",
                                      children: "No students found.",
                                    }),
                                  })
                                : q.map((i) => {
                                    const f = G.filter((g) => g.student_id === i.id).length;
                                    return r.jsxs(
                                      "tr",
                                      {
                                        className:
                                          "hover:bg-slate-50/50 dark:hover:bg-slate-800/50",
                                        children: [
                                          r.jsxs("td", {
                                            className:
                                              "py-3 px-6 text-slate-500 font-mono font-bold",
                                            children: ["#", i.roll_number || "—"],
                                          }),
                                          r.jsxs("td", {
                                            className:
                                              "py-3 px-6 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2",
                                            children: [
                                              r.jsx("div", {
                                                className:
                                                  "size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0",
                                                children: i.photo_url
                                                  ? r.jsx("img", {
                                                      src: i.photo_url,
                                                      alt: "",
                                                      className: "size-full object-cover",
                                                    })
                                                  : r.jsx("span", {
                                                      className: "text-[10px]",
                                                      children: i.full_name.charAt(0),
                                                    }),
                                              }),
                                              i.full_name,
                                            ],
                                          }),
                                          r.jsx("td", {
                                            className: "py-3 px-6 text-center",
                                            children: r.jsxs("span", {
                                              className: `px-2 py-0.5 rounded text-xs font-bold ${f > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`,
                                              children: [f, " Subjects"],
                                            }),
                                          }),
                                          r.jsx("td", {
                                            className: "py-3 px-6 text-right",
                                            children: r.jsxs("button", {
                                              disabled: u || f === 0,
                                              onClick: () => me(i),
                                              className:
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-bold rounded shadow-sm hover:bg-brand/90 disabled:opacity-50 transition-all cursor-pointer",
                                              children: [
                                                r.jsx(ge, { className: "size-3" }),
                                                " PDF",
                                              ],
                                            }),
                                          }),
                                        ],
                                      },
                                      i.id,
                                    );
                                  }),
                          }),
                        ],
                      }),
                    ],
                  })
                : r.jsxs("div", {
                    className:
                      "bg-white dark:bg-slate-900 p-12 text-center text-muted-foreground rounded-2xl border border-border dark:border-slate-800",
                    children: [
                      r.jsx(we, { className: "size-10 mx-auto text-slate-300 mb-2" }),
                      r.jsx("p", {
                        className: "font-semibold",
                        children: "Select class and exam term above to generate report cards.",
                      }),
                    ],
                  }),
            ],
          }),
          y &&
            v &&
            je.createPortal(
              r.jsx("div", {
                ref: L,
                className: "absolute left-[-9999px] top-[-9999px] pointer-events-none opacity-0",
                children: q.map((i) =>
                  r.jsx(
                    "div",
                    {
                      id: `report-card-${i.id}`,
                      className: "bg-white",
                      children: r.jsx(Ot, { ...ue(i) }),
                    },
                    i.id,
                  ),
                ),
              }),
              document.body,
            ),
        ],
      });
}
export { Yt as component };
