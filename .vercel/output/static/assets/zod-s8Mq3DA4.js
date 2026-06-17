import { R as M } from "./vendor-charts-DECNlt_G.js";
var he = (e) => e.type === "checkbox",
  ie = (e) => e instanceof Date,
  U = (e) => e == null;
const mt = (e) => typeof e == "object";
var O = (e) => !U(e) && !Array.isArray(e) && mt(e) && !ie(e),
  qt = (e) => (O(e) && e.target ? (he(e.target) ? e.target.checked : e.target.value) : e),
  Wt = (e, r) =>
    r.split(".").some((t, i, l) => !isNaN(Number(t)) && e.has(l.slice(0, i).join("."))),
  Ht = (e) => {
    const r = e.constructor && e.constructor.prototype;
    return O(r) && r.hasOwnProperty("isPrototypeOf");
  },
  De = typeof window < "u" && typeof window.HTMLElement < "u" && typeof document < "u";
function S(e) {
  if (e instanceof Date) return new Date(e);
  const r = typeof FileList < "u" && e instanceof FileList;
  if (De && (e instanceof Blob || r)) return e;
  const t = Array.isArray(e);
  if (!t && !(O(e) && Ht(e))) return e;
  const i = t ? [] : Object.create(Object.getPrototypeOf(e));
  for (const l in e) Object.prototype.hasOwnProperty.call(e, l) && (i[l] = S(e[l]));
  return i;
}
const oe = {
    BLUR: "blur",
    FOCUS_OUT: "focusout",
    SUBMIT: "submit",
    TRIGGER: "trigger",
    VALID: "valid",
  },
  Y = {
    onBlur: "onBlur",
    onChange: "onChange",
    onSubmit: "onSubmit",
    onTouched: "onTouched",
    all: "all",
  },
  G = {
    max: "max",
    min: "min",
    maxLength: "maxLength",
    minLength: "minLength",
    pattern: "pattern",
    required: "required",
    validate: "validate",
  },
  Pe = "form",
  bt = "root",
  Vt = ["__proto__", "constructor", "prototype"];
var ge = (e) => /^\w*$/.test(e),
  k = (e) => e === void 0,
  xe = (e) => e.split(/[.[\]'"]/g).filter(Boolean),
  g = (e, r, t) => {
    if (!r || !O(e)) return t;
    const i = ge(r) ? [r] : xe(r);
    if (i.some((a) => Vt.includes(a))) return t;
    const l = i.reduce((a, u) => (U(a) ? void 0 : a[u]), e);
    return k(l) || l === e ? (k(e[r]) ? t : e[r]) : l;
  },
  K = (e) => typeof e == "boolean",
  W = (e) => typeof e == "function",
  E = (e, r, t) => {
    let i = -1;
    const l = ge(r) ? [r] : xe(r),
      a = l.length,
      u = a - 1;
    for (; ++i < a; ) {
      const f = l[i];
      let w = t;
      if (i !== u) {
        const x = e[f];
        w = O(x) || Array.isArray(x) ? x : isNaN(+l[i + 1]) ? {} : [];
      }
      if (Vt.includes(f)) return;
      ((e[f] = w), (e = e[f]));
    }
  };
const Zt = M.createContext(null);
Zt.displayName = "HookFormControlContext";
var Gt = (e, r, t, i = !0) => {
  const l = {};
  for (const a in e)
    Object.defineProperty(l, a, {
      get: () => {
        const u = a;
        return (r._proxyFormState[u] !== Y.all && (r._proxyFormState[u] = !i || Y.all), e[u]);
      },
    });
  return l;
};
const Yt = De ? M.useLayoutEffect : M.useEffect;
var L = (e) => typeof e == "string",
  Kt = (e, r, t, i, l) =>
    L(e)
      ? (i && r.watch.add(e), g(t, e, l))
      : Array.isArray(e)
        ? e.map((a) => (i && r.watch.add(a), g(t, a)))
        : (i && (r.watchAll = !0), t),
  Ie = (e) => U(e) || !mt(e);
function J(e, r, t = new WeakSet()) {
  if (e === r) return !0;
  if (Ie(e) || Ie(r)) return Object.is(e, r);
  if (ie(e) && ie(r)) return Object.is(e.getTime(), r.getTime());
  const i = Object.keys(e),
    l = Object.keys(r);
  if (i.length !== l.length) return !1;
  if (t.has(e) || t.has(r)) return !0;
  (t.add(e), t.add(r));
  for (const a of i) {
    const u = e[a];
    if (!(a in r)) return !1;
    if (a !== "ref") {
      const f = r[a];
      if (
        (ie(u) && ie(f)) || ((O(u) || Array.isArray(u)) && (O(f) || Array.isArray(f)))
          ? !J(u, f, t)
          : !Object.is(u, f)
      )
        return !1;
    }
  }
  return !0;
}
const Jt = M.createContext(null);
Jt.displayName = "HookFormContext";
var je = (e, r, t, i, l) =>
    r ? { ...t[e], types: { ...(t[e] && t[e].types ? t[e].types : {}), [i]: l || !0 } } : {},
  Ft = (e) => (Array.isArray(e) ? e.filter(Boolean) : []),
  we = (e) => (Array.isArray(e) ? e : [e]),
  rt = () => {
    let e = [];
    return {
      get observers() {
        return e;
      },
      next: (l) => {
        for (const a of e) a.next && a.next(l);
      },
      subscribe: (l) => (
        e.push(l),
        {
          unsubscribe: () => {
            e = e.filter((a) => a !== l);
          },
        }
      ),
      unsubscribe: () => {
        e = [];
      },
    };
  };
function wt(e, r) {
  const t = {};
  for (const i in e)
    if (e.hasOwnProperty(i)) {
      const l = e[i],
        a = r[i];
      if (l && O(l) && a) {
        const u = wt(l, a);
        O(u) && (t[i] = u);
      } else e[i] && (t[i] = a);
    }
  return t;
}
var I = (e) => O(e) && !Object.keys(e).length,
  Be = (e) => e.type === "file",
  Ae = (e) => {
    if (!De) return !1;
    const r = e ? e.ownerDocument : 0;
    return e instanceof (r && r.defaultView ? r.defaultView.HTMLElement : HTMLElement);
  },
  At = (e) => e.type === "select-multiple",
  ze = (e) => e.type === "radio",
  Qt = (e) => ze(e) || he(e),
  Ne = (e) => Ae(e) && e.isConnected;
function Xt(e, r) {
  const t = r.slice(0, -1).length;
  let i = 0;
  for (; i < t; ) {
    if (U(e)) {
      e = void 0;
      break;
    }
    ((e = e[r[i]]), i++);
  }
  return e;
}
function er(e) {
  for (const r in e) if (e.hasOwnProperty(r) && !k(e[r])) return !1;
  return !0;
}
function R(e, r) {
  if (L(r) && Object.prototype.hasOwnProperty.call(e, r)) return (delete e[r], e);
  const t = Array.isArray(r) ? r : ge(r) ? [r] : xe(r),
    i = t.length === 1 ? e : Xt(e, t),
    l = t.length - 1,
    a = t[l];
  return (
    i && delete i[a],
    l !== 0 && ((O(i) && I(i)) || (Array.isArray(i) && er(i))) && R(e, t.slice(0, -1)),
    e
  );
}
var tr = (e) => {
  for (const r in e) if (W(e[r])) return !0;
  return !1;
};
function Et(e) {
  return Array.isArray(e) || (O(e) && !tr(e));
}
function Ue(e, r = {}) {
  for (const t in e) {
    const i = e[t];
    Et(i) ? ((r[t] = Array.isArray(i) ? [] : {}), Ue(i, r[t])) : k(i) || (r[t] = !0);
  }
  return r;
}
function Ce(e) {
  if (e !== !1) {
    if (e === !0) return !0;
    if (Array.isArray(e)) {
      const r = e.map((t) => Ce(t));
      return r.some((t) => t !== void 0) ? r : void 0;
    }
    if (O(e)) {
      const r = {};
      for (const t in e) {
        const i = Ce(e[t]);
        k(i) || (r[t] = i);
      }
      return Object.keys(r).length ? r : void 0;
    }
  }
}
function se(e, r, t) {
  t || (t = Ue(r));
  for (const i in e) {
    const l = e[i];
    if (Et(l))
      k(r) || Ie(t[i]) ? (t[i] = Ue(l, Array.isArray(l) ? [] : {})) : se(l, U(r) ? {} : r[i], t[i]);
    else {
      const a = r[i];
      t[i] = !J(l, a);
    }
  }
  return Ce(t) || {};
}
const st = { value: !1, isValid: !1 },
  it = { value: !0, isValid: !0 };
var Dt = (e) => {
    if (Array.isArray(e)) {
      if (e.length > 1) {
        const r = e.filter((t) => t && t.checked && !t.disabled).map((t) => t.value);
        return { value: r, isValid: !!r.length };
      }
      return e[0].checked && !e[0].disabled
        ? e[0].attributes && !k(e[0].attributes.value)
          ? k(e[0].value) || e[0].value === ""
            ? it
            : { value: e[0].value, isValid: !0 }
          : it
        : st;
    }
    return st;
  },
  xt = (e, { valueAsNumber: r, valueAsDate: t, setValueAs: i }) =>
    k(e) ? e : r ? (e === "" ? NaN : e && +e) : t && L(e) ? new Date(e) : i ? i(e) : e;
const nt = { isValid: !1, value: null };
var kt = (e) =>
  Array.isArray(e)
    ? e.reduce((r, t) => (t && t.checked && !t.disabled ? { isValid: !0, value: t.value } : r), nt)
    : nt;
function at(e) {
  const r = e.ref;
  return Be(r)
    ? r.files
    : ze(r)
      ? kt(e.refs).value
      : At(r)
        ? [...r.selectedOptions].map(({ value: t }) => t)
        : he(r)
          ? Dt(e.refs).value
          : xt(k(r.value) ? e.ref.value : r.value, e);
}
var rr = (e, r, t, i) => {
    const l = {};
    for (const a of e) {
      const u = g(r, a);
      u && E(l, a, u._f);
    }
    return { criteriaMode: t, names: [...e], fields: l, shouldUseNativeValidation: i };
  },
  Ee = (e) => e instanceof RegExp,
  ce = (e) => (k(e) ? e : Ee(e) ? e.source : O(e) ? (Ee(e.value) ? e.value.source : e.value) : e),
  ot = (e) => ({
    isOnSubmit: !e || e === Y.onSubmit,
    isOnBlur: e === Y.onBlur,
    isOnChange: e === Y.onChange,
    isOnAll: e === Y.all,
    isOnTouch: e === Y.onTouched,
  });
const lt = "AsyncFunction";
var sr = (e) =>
    !!e &&
    !!e.validate &&
    !!(
      (W(e.validate) && e.validate.constructor.name === lt) ||
      (O(e.validate) && Object.values(e.validate).find((r) => r.constructor.name === lt))
    ),
  ir = (e) =>
    e.mount &&
    (e.required || e.min || e.max || e.maxLength || e.minLength || e.pattern || e.validate),
  ut = (e, r, t) =>
    !t && (r.watchAll || r.watch.has(e) || [...r.watch].some((i) => e.startsWith(`${i}.`)));
const ye = (e, r, t, i) => {
  for (const l of t || Object.keys(e)) {
    const a = g(e, l);
    if (a) {
      const { _f: u, ...f } = a;
      if (u) {
        if (u.refs && u.refs[0] && r(u.refs[0], l) && !i) return !0;
        if (u.ref && r(u.ref, u.name) && !i) return !0;
        if (ye(f, r)) break;
      } else if (O(f) && ye(f, r)) break;
    }
  }
};
function ft(e, r, t) {
  const i = g(e, t);
  if (i || ge(t)) return { error: i, name: t };
  const l = t.split(".");
  for (; l.length; ) {
    const a = l.join("."),
      u = g(r, a),
      f = g(e, a);
    if (u && !Array.isArray(u) && t !== a) return { name: t };
    if (f && f.type) return { name: a, error: f };
    if (f && f.root && f.root.type) return { name: `${a}.root`, error: f.root };
    l.pop();
  }
  return { name: t };
}
var nr = (e, r, t, i) => {
    t(e);
    const { name: l, ...a } = e;
    return (
      I(a) ||
      (i && Object.keys(a).length >= Object.keys(r).length) ||
      Object.keys(a).find((u) => r[u] === (!i || Y.all))
    );
  },
  ar = (e, r, t) =>
    !e ||
    !r ||
    e === r ||
    we(e).some((i) => i && (t ? i === r : i.startsWith(r) || r.startsWith(i))),
  or = (e, r, t, i, l) =>
    l.isOnAll
      ? !1
      : !t && l.isOnTouch
        ? !(r || e)
        : (t ? i.isOnBlur : l.isOnBlur)
          ? !e
          : (t ? i.isOnChange : l.isOnChange)
            ? e
            : !0,
  lr = (e, r) => !Ft(g(e, r)).length && R(e, r),
  dt = (e, r, t) => {
    const i = g(e, t),
      l = Array.isArray(i) ? i : [];
    return (E(l, bt, r[t]), E(e, t, l), e);
  };
function ct(e, r, t = "validate") {
  if (L(e) || (Array.isArray(e) && e.every(L)) || (K(e) && !e))
    return { type: t, message: L(e) ? e : "", ref: r };
}
var le = (e) => (O(e) && !Ee(e) ? e : { value: e, message: "" }),
  yt = async (e, r, t, i, l, a) => {
    const {
        ref: u,
        refs: f,
        required: w,
        maxLength: x,
        minLength: C,
        min: A,
        max: D,
        pattern: _,
        validate: Q,
        name: j,
        valueAsNumber: B,
        mount: z,
      } = e._f,
      V = g(t, j);
    if (!z || r.has(j)) return {};
    const X = f ? f[0] : u,
      ee = (F) => {
        l && X.reportValidity && (X.setCustomValidity(K(F) ? "" : F || ""), X.reportValidity());
      },
      N = {},
      ve = ze(u),
      ue = he(u),
      _e = ve || ue,
      ne =
        ((B || Be(u)) && k(u.value) && k(V)) ||
        (Ae(u) && u.value === "") ||
        V === "" ||
        (Array.isArray(V) && !V.length),
      H = je.bind(null, j, i, N),
      me = (F, b, P, p = G.maxLength, $ = G.minLength) => {
        const te = F ? b : P;
        N[j] = { type: F ? p : $, message: te, ref: u, ...H(F ? p : $, te) };
      };
    if (
      a
        ? !Array.isArray(V) || !V.length
        : w &&
          ((!_e && (ne || U(V))) ||
            (K(V) && !V) ||
            (ue && !Dt(f).isValid) ||
            (ve && !kt(f).isValid))
    ) {
      const { value: F, message: b } = L(w) ? { value: !!w, message: w } : le(w);
      if (F && ((N[j] = { type: G.required, message: b, ref: X, ...H(G.required, b) }), !i))
        return (ee(b), N);
    }
    if (!ne && (!U(A) || !U(D))) {
      let F, b;
      const P = le(D),
        p = le(A);
      if (!U(V) && !isNaN(V)) {
        const $ = u.valueAsNumber || (V && +V);
        (U(P.value) || (F = $ > P.value), U(p.value) || (b = $ < p.value));
      } else {
        const $ = u.valueAsDate || new Date(V),
          te = (be) => new Date(new Date().toDateString() + " " + be),
          ae = u.type == "time",
          fe = u.type == "week";
        (L(P.value) &&
          V &&
          (F = ae ? te(V) > te(P.value) : fe ? V > P.value : $ > new Date(P.value)),
          L(p.value) &&
            V &&
            (b = ae ? te(V) < te(p.value) : fe ? V < p.value : $ < new Date(p.value)));
      }
      if ((F || b) && (me(!!F, P.message, p.message, G.max, G.min), !i))
        return (ee(N[j].message), N);
    }
    if ((x || C) && !ne && (L(V) || (a && Array.isArray(V)))) {
      const F = le(x),
        b = le(C),
        P = !U(F.value) && V.length > +F.value,
        p = !U(b.value) && V.length < +b.value;
      if ((P || p) && (me(P, F.message, b.message), !i)) return (ee(N[j].message), N);
    }
    if (_ && !ne && L(V)) {
      const { value: F, message: b } = le(_);
      if (
        Ee(F) &&
        !V.match(F) &&
        ((N[j] = { type: G.pattern, message: b, ref: u, ...H(G.pattern, b) }), !i)
      )
        return (ee(b), N);
    }
    if (Q) {
      if (W(Q)) {
        const F = await Q(V, t),
          b = ct(F, X);
        if (b && ((N[j] = { ...b, ...H(G.validate, b.message) }), !i)) return (ee(b.message), N);
      } else if (O(Q)) {
        let F = {};
        for (const b in Q) {
          if (!I(F) && !i) break;
          const P = ct(await Q[b](V, t), X, b);
          P && ((F = { ...P, ...H(b, P.message) }), ee(P.message), i && (N[j] = F));
        }
        if (!I(F) && ((N[j] = { ref: X, ...F }), !i)) return N;
      }
    }
    return (ee(!0), N);
  };
const ur = { mode: Y.onSubmit, reValidateMode: Y.onChange, shouldFocusError: !0 },
  Ot = {
    submitCount: 0,
    isDirty: !1,
    isReady: !1,
    isValidating: !1,
    isSubmitted: !1,
    isSubmitting: !1,
    isSubmitSuccessful: !1,
    isValid: !1,
    touchedFields: {},
    dirtyFields: {},
    validatingFields: {},
  };
function fr(e = {}) {
  let r = { ...ur, ...e },
    t = {
      ...S(Ot),
      isLoading: W(r.defaultValues),
      errors: r.errors || {},
      disabled: r.disabled || !1,
    },
    i = {},
    l = O(r.defaultValues) || O(r.values) ? S(r.defaultValues || r.values) || {} : {},
    a = r.shouldUnregister ? {} : S(l),
    u = { action: !1, mount: !1, watch: !1, keepIsValid: !1 },
    f = {
      mount: new Set(),
      disabled: new Set(),
      unMount: new Set(),
      array: new Set(),
      watch: new Set(),
      registerName: new Set(),
    },
    w,
    x = 0;
  const C = {
      isDirty: !1,
      dirtyFields: !1,
      validatingFields: !1,
      touchedFields: !1,
      isValidating: !1,
      isValid: !1,
      errors: !1,
    },
    A = { ...C };
  let D = { ...A };
  const _ = { array: rt(), state: rt() },
    Q = r.criteriaMode === Y.all,
    j = (s) => (n) => {
      (clearTimeout(x), (x = setTimeout(s, n)));
    },
    B = async (s) => {
      if (!u.keepIsValid && !r.disabled && (A.isValid || D.isValid || s)) {
        let n;
        (r.resolver
          ? ((n = I((await H()).errors)), z())
          : (n = await b({ fields: i, onlyCheckValid: !0, eventType: oe.VALID })),
          n !== t.isValid && _.state.next({ isValid: n }));
      }
    },
    z = (s, n) => {
      !r.disabled &&
        (A.isValidating || A.validatingFields || D.isValidating || D.validatingFields) &&
        ((s || Array.from(f.mount)).forEach((o) => {
          o && (n ? E(t.validatingFields, o, n) : R(t.validatingFields, o));
        }),
        _.state.next({
          validatingFields: t.validatingFields,
          isValidating: !I(t.validatingFields),
        }));
    },
    V = () => {
      t.dirtyFields = se(l, a);
    },
    X = (s, n = [], o, d, y = !0, h = !0) => {
      if (d && o && !r.disabled) {
        if (((u.action = !0), h && Array.isArray(g(i, s)))) {
          const c = o(g(i, s), d.argA, d.argB);
          y && E(i, s, c);
        }
        if (h && Array.isArray(g(t.errors, s))) {
          const c = o(g(t.errors, s), d.argA, d.argB);
          (y && E(t.errors, s, c), lr(t.errors, s));
        }
        if ((A.touchedFields || D.touchedFields) && h && Array.isArray(g(t.touchedFields, s))) {
          const c = o(g(t.touchedFields, s), d.argA, d.argB);
          y && E(t.touchedFields, s, c);
        }
        ((A.dirtyFields || D.dirtyFields) && V(),
          _.state.next({
            name: s,
            isDirty: p(s, n),
            dirtyFields: t.dirtyFields,
            errors: t.errors,
            isValid: t.isValid,
          }));
      } else E(a, s, n);
    },
    ee = (s, n) => {
      (E(t.errors, s, n), _.state.next({ errors: t.errors }));
    },
    N = (s) => {
      ((t.errors = s), _.state.next({ errors: t.errors, isValid: !1 }));
    },
    ve = (s) => {
      const n = ge(s) ? [s] : xe(s);
      let o = a,
        d = l;
      for (let y = 0; y < n.length - 1; y++) {
        const h = n[y];
        if (((o = U(o) ? o : o[h]), (d = U(d) ? d : d[h]), o === null && d !== null)) return !0;
      }
      return !1;
    },
    ue = (s, n, o, d) => {
      const y = g(i, s);
      if (y) {
        if (ve(s)) return;
        const h = k(g(a, s)),
          c = g(a, s, k(o) ? g(l, s) : o);
        (k(c) || (d && d.defaultChecked) || n ? E(a, s, n ? c : at(y._f)) : ae(s, c),
          u.mount &&
            !u.action &&
            (B(),
            h &&
              t.isDirty &&
              (A.isDirty || D.isDirty) &&
              (p() || ((t.isDirty = !1), _.state.next({ ...t })))));
      }
    },
    _e = (s, n, o, d, y) => {
      let h = !1,
        c = !1;
      const v = { name: s };
      if (!r.disabled) {
        if (!o || d) {
          (A.isDirty || D.isDirty) &&
            ((c = t.isDirty), (t.isDirty = v.isDirty = p()), (h = c !== v.isDirty));
          const m = J(g(l, s), n);
          ((c = !!g(t.dirtyFields, s)),
            m !== t.isDirty
              ? (t.dirtyFields = se(l, a))
              : m
                ? R(t.dirtyFields, s)
                : E(t.dirtyFields, s, !0),
            (v.dirtyFields = t.dirtyFields),
            (h = h || ((A.dirtyFields || D.dirtyFields) && c !== !m)));
        }
        if (o) {
          const m = g(t.touchedFields, s);
          m ||
            (E(t.touchedFields, s, o),
            (v.touchedFields = t.touchedFields),
            (h = h || ((A.touchedFields || D.touchedFields) && m !== o)));
        }
        h && y && _.state.next(v);
      }
      return h ? v : {};
    },
    ne = (s, n, o, d) => {
      const y = g(t.errors, s),
        h = (A.isValid || D.isValid) && K(n) && t.isValid !== n;
      if (
        (r.delayError && o
          ? ((w = j(() => ee(s, o))), w(r.delayError))
          : (clearTimeout(x), (w = null), o ? E(t.errors, s, o) : R(t.errors, s)),
        (o ? !J(y, o) : y) || !I(d) || h)
      ) {
        const c = { ...d, ...(h && K(n) ? { isValid: n } : {}), errors: t.errors, name: s };
        ((t = { ...t, ...c }), _.state.next(c));
      }
    },
    H = async (s) => (
      z(s, !0),
      await r.resolver(
        a,
        r.context,
        rr(s || f.mount, i, r.criteriaMode, r.shouldUseNativeValidation),
      )
    ),
    me = async (s) => {
      const { errors: n } = await H(s);
      if ((z(s), s))
        for (const o of s) {
          const d = g(n, o);
          d
            ? f.array.has(o) && O(d) && !Object.keys(d).some((y) => !Number.isNaN(Number(y)))
              ? dt(t.errors, { [o]: d }, o)
              : E(t.errors, o, d)
            : R(t.errors, o);
        }
      else t.errors = n;
      return n;
    },
    F = async ({ name: s, eventType: n }) => {
      if (e.validate) {
        const o = await e.validate({ formValues: a, formState: t, name: s, eventType: n });
        if (O(o))
          for (const d in o) {
            const y = o[d];
            y &&
              Ve(`${Pe}.${d}`, {
                message: L(y.message) ? y.message : "",
                type: y.type || G.validate,
              });
          }
        else L(o) || !o ? Ve(Pe, { message: o || "", type: G.validate }) : Ze(Pe);
        return o;
      }
      return !0;
    },
    b = async ({
      fields: s,
      onlyCheckValid: n,
      name: o,
      eventType: d,
      context: y = { valid: !0, runRootValidation: !1 },
    }) => {
      if (
        e.validate &&
        ((y.runRootValidation = !0), !(await F({ name: o, eventType: d })) && ((y.valid = !1), n))
      )
        return y.valid;
      for (const h in s) {
        const c = s[h];
        if (c) {
          const { _f: v, ...m } = c;
          if (v) {
            const T = f.array.has(v.name),
              q = c._f && sr(c._f),
              Z = A.validatingFields || A.isValidating || D.validatingFields || D.isValidating;
            q && Z && z([v.name], !0);
            const re = await yt(c, f.disabled, a, Q, r.shouldUseNativeValidation && !n, T);
            if (
              (q && Z && z([v.name]),
              (re[v.name] && ((y.valid = !1), n)) ||
                (!n &&
                  (g(re, v.name)
                    ? T
                      ? dt(t.errors, re, v.name)
                      : E(t.errors, v.name, re[v.name])
                    : R(t.errors, v.name)),
                e.shouldUseNativeValidation && re[v.name]))
            )
              break;
          }
          !I(m) && (await b({ context: y, onlyCheckValid: n, fields: m, name: h, eventType: d }));
        }
      }
      return y.valid;
    },
    P = () => {
      for (const s of f.unMount) {
        const n = g(i, s);
        n && (n._f.refs ? n._f.refs.every((o) => !Ne(o)) : !Ne(n._f.ref)) && Oe(s);
      }
      f.unMount = new Set();
    },
    p = (s, n) => !r.disabled && (s && n && E(a, s, n), !J(We(), l)),
    $ = (s, n, o) => Kt(s, f, { ...(u.mount ? a : k(n) ? l : L(s) ? { [s]: n } : n) }, o, n),
    te = (s) => Ft(g(u.mount ? a : l, s, r.shouldUnregister ? g(l, s, []) : [])),
    ae = (s, n, o = {}, d = !1) => {
      const y = g(i, s);
      let h = n;
      if (y) {
        const c = y._f;
        c &&
          (!c.disabled && E(a, s, xt(n, c)),
          (h = Ae(c.ref) && U(n) ? "" : n),
          At(c.ref)
            ? [...c.ref.options].forEach((v) => (v.selected = h.includes(v.value)))
            : c.refs
              ? he(c.ref)
                ? c.refs.forEach((v) => {
                    (!v.defaultChecked || !v.disabled) &&
                      (Array.isArray(h)
                        ? (v.checked = !!h.find((m) => m === v.value))
                        : (v.checked = h === v.value || !!h));
                  })
                : c.refs.forEach((v) => (v.checked = v.value === h))
              : Be(c.ref)
                ? (c.ref.value = "")
                : ((c.ref.value = h),
                  c.ref.type || _.state.next({ name: s, values: d ? a : S(a) })));
      }
      ((o.shouldDirty || o.shouldTouch) && _e(s, h, o.shouldTouch, o.shouldDirty, !0),
        o.shouldValidate && ke(s));
    },
    fe = (s, n, o, d = !1) => {
      for (const y in n) {
        if (!n.hasOwnProperty(y)) return;
        const h = n[y],
          c = s + "." + y,
          v = g(i, c);
        (f.array.has(s) || O(h) || (v && !v._f)) && !ie(h) ? fe(c, h, o, d) : ae(c, h, o, d);
      }
    },
    be = (s, n, o, d) => {
      const y = g(i, s),
        h = f.array.has(s),
        c = d ? n : S(n),
        v = g(a, s),
        m = J(v, c);
      if ((m || E(a, s, c), h))
        (_.array.next({ name: s, values: d ? a : S(a) }),
          (A.isDirty || A.dirtyFields || D.isDirty || D.dirtyFields) &&
            o.shouldDirty &&
            (V(), _.state.next({ name: s, dirtyFields: t.dirtyFields, isDirty: p(s, c) })));
      else {
        const T = (Array.isArray(c) && !c.length) || I(c);
        !y || y._f || U(c) || T ? ae(s, c, o, d) : fe(s, c, o, d);
      }
      if (!m) {
        const T = ut(s, f),
          q = d ? a : S(a);
        _.state.next({ ...(T && t), name: u.mount || T ? s : void 0, values: q });
      }
    },
    de = (s, n, o = {}) => be(s, n, o, !1),
    It = (s, n = {}) => {
      const o = W(s) ? s(a) : s;
      if (!J(a, o)) {
        a = { ...a, ...o };
        for (const d of f.mount) be(d, g(o, d), n, !0);
        (_.state.next({ ...t, name: void 0, type: void 0, values: a }), n.shouldValidate && B());
      }
    },
    $e = async (s) => {
      u.mount = !0;
      const n = s.target;
      let o = n.name,
        d = !0;
      const y = g(i, o),
        h = (m) => {
          d = Number.isNaN(m) || (ie(m) && isNaN(m.getTime())) || J(m, g(a, o, m));
        },
        c = ot(r.mode),
        v = ot(r.reValidateMode);
      if (y) {
        let m, T;
        const q = n.type ? at(y._f) : qt(s),
          Z = s.type === oe.BLUR || s.type === oe.FOCUS_OUT,
          re =
            (!ir(y._f) && !e.validate && !r.resolver && !g(t.errors, o) && !y._f.deps) ||
            or(Z, g(t.touchedFields, o), t.isSubmitted, v, c),
          Te = ut(o, f, Z);
        (E(a, o, q),
          Z
            ? (!n || !n.readOnly) && (y._f.onBlur && y._f.onBlur(s), w && w(0))
            : y._f.onChange && y._f.onChange(s));
        const Re = _e(o, q, Z),
          zt = !I(Re) || Te;
        if ((!Z && _.state.next({ name: o, type: s.type, values: S(a) }), re))
          return (
            (A.isValid || D.isValid) && (r.mode === "onBlur" ? Z && B() : Z || B()),
            zt && _.state.next({ name: o, ...(Te ? {} : Re) })
          );
        if (
          (!r.resolver && e.validate && (await F({ name: o, eventType: s.type })),
          !Z && Te && _.state.next({ ...t }),
          r.resolver)
        ) {
          const { errors: et } = await H([o]);
          if ((z([o]), h(q), d)) {
            const $t = ft(t.errors, i, o),
              tt = ft(et, i, $t.name || o);
            ((m = tt.error), (o = tt.name), (T = I(et)));
          }
        } else
          (z([o], !0),
            (m = (await yt(y, f.disabled, a, Q, r.shouldUseNativeValidation))[o]),
            z([o]),
            h(q),
            d &&
              (m
                ? (T = !1)
                : (A.isValid || D.isValid) &&
                  (T = await b({ fields: i, onlyCheckValid: !0, name: o, eventType: s.type }))));
        d &&
          (y._f.deps && (!Array.isArray(y._f.deps) || y._f.deps.length > 0) && ke(y._f.deps),
          ne(o, T, m, Re));
      }
    },
    qe = (s, n) => {
      if (g(t.errors, n) && s.focus) return (s.focus(), 1);
    },
    ke = async (s, n = {}) => {
      let o, d;
      const y = we(s);
      if (r.resolver) {
        const h = await me(k(s) ? s : y);
        ((o = I(h)), (d = s ? !y.some((c) => g(h, c)) : o));
      } else
        s
          ? ((d = (
              await Promise.all(
                y.map(async (h) => {
                  const c = g(i, h);
                  return await b({ fields: c && c._f ? { [h]: c } : c, eventType: oe.TRIGGER });
                }),
              )
            ).every(Boolean)),
            !(!d && !t.isValid) && B())
          : (d = o = await b({ fields: i, name: s, eventType: oe.TRIGGER }));
      return (
        _.state.next({
          ...(!L(s) || ((A.isValid || D.isValid) && o !== t.isValid) ? {} : { name: s }),
          ...(r.resolver || !s ? { isValid: o } : {}),
          errors: t.errors,
        }),
        n.shouldFocus && !d && ye(i, qe, s ? y : f.mount),
        d
      );
    },
    We = (s, n) => {
      let o = { ...(u.mount ? a : l) };
      return (
        n && (o = wt(n.dirtyFields ? t.dirtyFields : t.touchedFields, o)),
        k(s) ? o : L(s) ? g(o, s) : s.map((d) => g(o, d))
      );
    },
    He = (s, n) => ({
      invalid: !!g((n || t).errors, s),
      isDirty: !!g((n || t).dirtyFields, s),
      error: g((n || t).errors, s),
      isValidating: !!g(t.validatingFields, s),
      isTouched: !!g((n || t).touchedFields, s),
    }),
    Ze = (s) => {
      const n = s ? we(s) : void 0;
      (n?.forEach((o) => R(t.errors, o)),
        n
          ? n.forEach((o) => {
              _.state.next({ name: o, errors: t.errors });
            })
          : _.state.next({ errors: {} }));
    },
    Ve = (s, n, o) => {
      const d = (g(i, s, { _f: {} })._f || {}).ref,
        y = g(t.errors, s) || {},
        { ref: h, message: c, type: v, ...m } = y;
      (E(t.errors, s, { ...m, ...n, ref: d }),
        _.state.next({ name: s, errors: t.errors, isValid: !1 }),
        o && o.shouldFocus && d && d.focus && d.focus());
    },
    Ut = (s, n) =>
      W(s)
        ? _.state.subscribe({ next: (o) => "values" in o && s(o.values || $(void 0, n), o) })
        : $(s, n, !0),
    Ge = (s) =>
      _.state.subscribe({
        next: (n) => {
          if (ar(s.name, n.name, s.exact) && nr(n, s.formState || A, Bt, s.reRenderRoot)) {
            const o = { ...a };
            s.callback({ values: o, ...t, ...n, defaultValues: l });
          }
        },
      }).unsubscribe,
    Ct = (s) => (
      (u.mount = !0),
      (D = { ...D, ...s.formState }),
      Ge({ ...s, formState: { ...C, ...s.formState } })
    ),
    Oe = (s, n = {}) => {
      for (const o of s ? we(s) : f.mount)
        (f.mount.delete(o),
          f.array.delete(o),
          n.keepValue || (R(i, o), R(a, o)),
          !n.keepError && R(t.errors, o),
          !n.keepDirty && R(t.dirtyFields, o),
          !n.keepTouched && R(t.touchedFields, o),
          !n.keepIsValidating && R(t.validatingFields, o),
          !r.shouldUnregister && !n.keepDefaultValue && R(l, o));
      (_.state.next({ values: S(a) }),
        _.state.next({ ...t, ...(n.keepDirty ? { isDirty: p() } : {}) }),
        !n.keepIsValid && B());
    },
    Ye = ({ disabled: s, name: n }) => {
      if ((K(s) && u.mount) || s || f.disabled.has(n)) {
        const y = f.disabled.has(n) !== !!s;
        (s ? f.disabled.add(n) : f.disabled.delete(n), y && u.mount && !u.action && B());
      }
    },
    pe = (s, n = {}) => {
      let o = g(i, s);
      const d = K(n.disabled) || K(r.disabled),
        y = !f.registerName.has(s) && o && o._f && !o._f.mount;
      return (
        E(i, s, {
          ...(o || {}),
          _f: { ...(o && o._f ? o._f : { ref: { name: s } }), name: s, mount: !0, ...n },
        }),
        f.mount.add(s),
        o && !y
          ? Ye({ disabled: K(n.disabled) ? n.disabled : r.disabled, name: s })
          : ue(s, !0, n.value),
        {
          ...(d ? { disabled: n.disabled || r.disabled } : {}),
          ...(r.progressive
            ? {
                required: !!n.required,
                min: ce(n.min),
                max: ce(n.max),
                minLength: ce(n.minLength),
                maxLength: ce(n.maxLength),
                pattern: ce(n.pattern),
              }
            : {}),
          name: s,
          onChange: $e,
          onBlur: $e,
          ref: (h) => {
            if (h) {
              (f.registerName.add(s), pe(s, n), f.registerName.delete(s), (o = g(i, s)));
              const c =
                  (k(h.value) &&
                    h.querySelectorAll &&
                    h.querySelectorAll("input,select,textarea")[0]) ||
                  h,
                v = Qt(c),
                m = o._f.refs || [];
              if (v ? m.find((T) => T === c) : c === o._f.ref) return;
              (E(i, s, {
                _f: {
                  ...o._f,
                  ...(v
                    ? {
                        refs: [...m.filter(Ne), c, ...(Array.isArray(g(l, s)) ? [{}] : [])],
                        ref: { type: c.type, name: s },
                      }
                    : { ref: c }),
                },
              }),
                ue(s, !1, void 0, c));
            } else
              ((o = g(i, s, {})),
                o._f && (o._f.mount = !1),
                (r.shouldUnregister || n.shouldUnregister) &&
                  !(Wt(f.array, s) && u.action) &&
                  f.unMount.add(s));
          },
        }
      );
    },
    Se = () => r.shouldFocusError && !r.shouldUseNativeValidation && ye(i, qe, f.mount),
    Lt = (s) => {
      K(s) &&
        (_.state.next({ disabled: s }),
        ye(
          i,
          (n, o) => {
            const d = g(i, o);
            d &&
              ((n.disabled = d._f.disabled || s),
              Array.isArray(d._f.refs) &&
                d._f.refs.forEach((y) => {
                  y.disabled = d._f.disabled || s;
                }));
          },
          0,
          !1,
        ));
    },
    Ke = (s, n) => async (o) => {
      let d;
      o && (o.preventDefault && o.preventDefault(), o.persist && o.persist());
      let y = S(a);
      if ((_.state.next({ isSubmitting: !0 }), r.resolver)) {
        const { errors: h, values: c } = await H();
        (z(), (t.errors = h), (y = S(c)));
      } else await b({ fields: i, eventType: oe.SUBMIT });
      if (f.disabled.size) for (const h of f.disabled) R(y, h);
      if ((R(t.errors, bt), I(t.errors))) {
        _.state.next({ errors: {} });
        try {
          await s(y, o);
        } catch (h) {
          d = h;
        }
      } else (n && (await n({ ...t.errors }, o)), Se(), setTimeout(Se));
      if (
        (_.state.next({
          isSubmitted: !0,
          isSubmitting: !1,
          isSubmitSuccessful: I(t.errors) && !d,
          submitCount: t.submitCount + 1,
          errors: t.errors,
        }),
        d)
      )
        throw d;
    },
    Mt = (s, n = {}) => {
      g(i, s) &&
        (k(n.defaultValue)
          ? de(s, S(g(l, s)))
          : (de(s, n.defaultValue), E(l, s, S(n.defaultValue))),
        n.keepTouched || R(t.touchedFields, s),
        n.keepDirty || (R(t.dirtyFields, s), (t.isDirty = n.defaultValue ? p(s, S(g(l, s))) : p())),
        n.keepError || (R(t.errors, s), A.isValid && B()),
        _.state.next({ ...t }));
    },
    Je = (s, n = {}) => {
      const o = s ? S(s) : l,
        d = S(o),
        y = I(s),
        h = d;
      if ((n.keepDefaultValues || (l = o), !n.keepValues)) {
        if (n.keepDirtyValues) {
          const c = new Set([...f.mount, ...Object.keys(se(l, a))]);
          for (const v of Array.from(c)) {
            const m = g(t.dirtyFields, v),
              T = g(a, v),
              q = g(h, v);
            m && !k(T) ? E(h, v, T) : !m && !k(q) && de(v, q);
          }
        } else {
          if (De && k(s))
            for (const c of f.mount) {
              const v = g(i, c);
              if (v && v._f) {
                const m = Array.isArray(v._f.refs) ? v._f.refs[0] : v._f.ref;
                if (Ae(m)) {
                  const T = m.closest("form");
                  if (T) {
                    T.reset();
                    break;
                  }
                }
              }
            }
          if (n.keepFieldsRef) for (const c of f.mount) de(c, g(h, c));
          else i = {};
        }
        if (r.shouldUnregister) {
          if (((a = n.keepDefaultValues ? S(l) : {}), n.keepFieldsRef))
            for (const c of f.mount) E(a, c, g(h, c));
        } else a = S(h);
        (_.array.next({ values: { ...h } }), _.state.next({ values: { ...h } }));
      }
      ((f = {
        mount: n.keepDirtyValues ? f.mount : new Set(),
        unMount: new Set(),
        array: new Set(),
        registerName: new Set(),
        disabled: new Set(),
        watch: new Set(),
        watchAll: !1,
        focus: "",
      }),
        (u.mount =
          !A.isValid || !!n.keepIsValid || !!n.keepDirtyValues || (!r.shouldUnregister && !I(h))),
        (u.watch = !!r.shouldUnregister),
        (u.keepIsValid = !!n.keepIsValid),
        (u.action = !1),
        n.keepErrors || (t.errors = {}),
        _.state.next({
          submitCount: n.keepSubmitCount ? t.submitCount : 0,
          isDirty: y
            ? !1
            : n.keepDirty
              ? t.isDirty
              : n.keepValues
                ? p()
                : !!(n.keepDefaultValues && !J(s, l)),
          isSubmitted: n.keepIsSubmitted ? t.isSubmitted : !1,
          dirtyFields: y
            ? {}
            : n.keepDirtyValues
              ? n.keepDefaultValues && a
                ? se(l, a)
                : t.dirtyFields
              : n.keepDefaultValues && s
                ? se(l, s)
                : n.keepDirty
                  ? t.dirtyFields
                  : {},
          touchedFields: n.keepTouched ? t.touchedFields : {},
          errors: n.keepErrors ? t.errors : {},
          isSubmitSuccessful: n.keepIsSubmitSuccessful ? t.isSubmitSuccessful : !1,
          isSubmitting: !1,
          defaultValues: l,
        }));
    },
    Qe = (s, n) => Je(W(s) ? s(a) : s, { ...r.resetOptions, ...n }),
    jt = (s, n = {}) => {
      const o = g(i, s),
        d = o && o._f;
      if (d) {
        const y = d.refs ? d.refs[0] : d.ref;
        y.focus &&
          setTimeout(() => {
            (y.focus(), n.shouldSelect && W(y.select) && y.select());
          });
      }
    },
    Bt = (s) => {
      t = { ...t, ...s };
    },
    Xe = {
      control: {
        register: pe,
        unregister: Oe,
        getFieldState: He,
        handleSubmit: Ke,
        setError: Ve,
        _subscribe: Ge,
        _runSchema: H,
        _updateIsValidating: z,
        _focusError: Se,
        _getWatch: $,
        _getDirty: p,
        _setValid: B,
        _setFieldArray: X,
        _setDisabledField: Ye,
        _setErrors: N,
        _getFieldArray: te,
        _reset: Je,
        _resetDefaultValues: () =>
          W(r.defaultValues) &&
          r.defaultValues().then((s) => {
            (Qe(s, r.resetOptions), _.state.next({ isLoading: !1 }));
          }),
        _removeUnmounted: P,
        _disableForm: Lt,
        _subjects: _,
        _proxyFormState: A,
        get _fields() {
          return i;
        },
        get _formValues() {
          return a;
        },
        get _state() {
          return u;
        },
        set _state(s) {
          u = s;
        },
        get _defaultValues() {
          return l;
        },
        get _names() {
          return f;
        },
        set _names(s) {
          f = s;
        },
        get _formState() {
          return t;
        },
        get _options() {
          return r;
        },
        set _options(s) {
          r = { ...r, ...s };
        },
      },
      subscribe: Ct,
      trigger: ke,
      register: pe,
      handleSubmit: Ke,
      watch: Ut,
      setValue: de,
      setValues: It,
      getValues: We,
      reset: Qe,
      resetField: Mt,
      resetDefaultValues: (s, n = {}) => {
        if (((l = S(s)), !n.keepDirty)) {
          const o = se(l, a);
          ((t.dirtyFields = o), (t.isDirty = !I(o)));
        }
        (n.keepIsValid || B(), _.state.next({ ...t, defaultValues: l }));
      },
      clearErrors: Ze,
      unregister: Oe,
      setError: Ve,
      setFocus: jt,
      getFieldState: He,
    };
  return { ...Xe, formControl: Xe };
}
function Dr(e = {}) {
  const r = M.useRef(void 0),
    t = M.useRef(void 0),
    [i, l] = M.useState(() => ({
      ...S(Ot),
      isLoading: W(e.defaultValues),
      errors: e.errors || {},
      disabled: e.disabled || !1,
      defaultValues: W(e.defaultValues) ? void 0 : e.defaultValues,
    }));
  if (!r.current)
    if (e.formControl)
      ((r.current = { ...e.formControl, formState: i }),
        e.defaultValues &&
          !W(e.defaultValues) &&
          e.formControl.reset(e.defaultValues, e.resetOptions));
    else {
      const { formControl: u, ...f } = fr(e);
      r.current = { ...f, formState: i };
    }
  const a = r.current.control;
  return (
    (a._options = e),
    Yt(() => {
      const u = a._subscribe({
        formState: a._proxyFormState,
        callback: () => l({ ...a._formState, defaultValues: a._defaultValues }),
        reRenderRoot: !0,
      });
      return (l((f) => ({ ...f, isReady: !0 })), (a._formState.isReady = !0), u);
    }, [a]),
    M.useEffect(() => a._disableForm(e.disabled), [a, e.disabled]),
    M.useEffect(() => {
      (e.mode && (a._options.mode = e.mode),
        e.reValidateMode && (a._options.reValidateMode = e.reValidateMode));
    }, [a, e.mode, e.reValidateMode]),
    M.useEffect(() => {
      e.errors && (a._setErrors(e.errors), a._focusError());
    }, [a, e.errors]),
    M.useEffect(() => {
      e.shouldUnregister && a._subjects.state.next({ values: a._getWatch() });
    }, [a, e.shouldUnregister]),
    M.useEffect(() => {
      if (a._proxyFormState.isDirty) {
        const u = a._getDirty();
        u !== i.isDirty && a._subjects.state.next({ isDirty: u });
      }
    }, [a, i.isDirty]),
    M.useEffect(() => {
      var u;
      e.values && !J(e.values, t.current)
        ? (a._reset(e.values, { keepFieldsRef: !0, ...a._options.resetOptions }),
          (!((u = a._options.resetOptions) === null || u === void 0) && u.keepIsValid) ||
            a._setValid(),
          (t.current = e.values),
          l((f) => ({ ...f })))
        : a._resetDefaultValues();
    }, [a, e.values]),
    M.useEffect(() => {
      (a._state.mount || (a._setValid(), (a._state.mount = !0)),
        a._state.watch && ((a._state.watch = !1), a._subjects.state.next({ ...a._formState })),
        a._removeUnmounted());
    }),
    (r.current.formState = M.useMemo(() => Gt(i, a), [a, i])),
    r.current
  );
}
const ht = (e, r, t) => {
    if (e && "reportValidity" in e) {
      const i = g(t, r);
      (e.setCustomValidity((i && i.message) || ""), e.reportValidity());
    }
  },
  Le = (e, r) => {
    for (const t in r.fields) {
      const i = r.fields[t];
      i && i.ref && "reportValidity" in i.ref
        ? ht(i.ref, t, e)
        : i && i.refs && i.refs.forEach((l) => ht(l, t, e));
    }
  },
  gt = (e, r) => {
    r.shouldUseNativeValidation && Le(e, r);
    const t = {};
    for (const i in e) {
      const l = g(r.fields, i),
        a = Object.assign(e[i] || {}, { ref: l && l.ref });
      if (dr(r.names || Object.keys(e), i)) {
        const u = Object.assign({}, g(t, i));
        (E(u, "root", a), E(t, i, u));
      } else E(t, i, a);
    }
    return t;
  },
  dr = (e, r) => {
    const t = vt(r).replace(/[.*+?^${}()|\\]/g, "\\$&");
    return e.some((i) => vt(i).match(`^${t}\\.\\d+`));
  };
function vt(e) {
  return e.replace(/[\[\]]/g, "");
}
function pt(e, r, t) {
  function i(f, w) {
    var x;
    (Object.defineProperty(f, "_zod", { value: f._zod ?? {}, enumerable: !1 }),
      (x = f._zod).traits ?? (x.traits = new Set()),
      f._zod.traits.add(e),
      r(f, w));
    for (const C in u.prototype)
      C in f || Object.defineProperty(f, C, { value: u.prototype[C].bind(f) });
    ((f._zod.constr = u), (f._zod.def = w));
  }
  const l = t?.Parent ?? Object;
  class a extends l {}
  Object.defineProperty(a, "name", { value: e });
  function u(f) {
    var w;
    const x = t?.Parent ? new a() : this;
    (i(x, f), (w = x._zod).deferred ?? (w.deferred = []));
    for (const C of x._zod.deferred) C();
    return x;
  }
  return (
    Object.defineProperty(u, "init", { value: i }),
    Object.defineProperty(u, Symbol.hasInstance, {
      value: (f) => (t?.Parent && f instanceof t.Parent ? !0 : f?._zod?.traits?.has(e)),
    }),
    Object.defineProperty(u, "name", { value: e }),
    u
  );
}
class cr extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
const yr = {};
function St(e) {
  return yr;
}
function hr(e, r) {
  return typeof r == "bigint" ? r.toString() : r;
}
const Tt = Error.captureStackTrace ? Error.captureStackTrace : (...e) => {};
function Fe(e) {
  return typeof e == "string" ? e : e?.message;
}
function Rt(e, r, t) {
  const i = { ...e, path: e.path ?? [] };
  if (!e.message) {
    const l =
      Fe(e.inst?._zod.def?.error?.(e)) ??
      Fe(r?.error?.(e)) ??
      Fe(t.customError?.(e)) ??
      Fe(t.localeError?.(e)) ??
      "Invalid input";
    i.message = l;
  }
  return (delete i.inst, delete i.continue, r?.reportInput || delete i.input, i);
}
const Pt = (e, r) => {
    ((e.name = "$ZodError"),
      Object.defineProperty(e, "_zod", { value: e._zod, enumerable: !1 }),
      Object.defineProperty(e, "issues", { value: r, enumerable: !1 }),
      Object.defineProperty(e, "message", {
        get() {
          return JSON.stringify(r, hr, 2);
        },
        enumerable: !0,
      }),
      Object.defineProperty(e, "toString", { value: () => e.message, enumerable: !1 }));
  },
  gr = pt("$ZodError", Pt),
  Nt = pt("$ZodError", Pt, { Parent: Error }),
  vr = (e) => (r, t, i, l) => {
    const a = i ? Object.assign(i, { async: !1 }) : { async: !1 },
      u = r._zod.run({ value: t, issues: [] }, a);
    if (u instanceof Promise) throw new cr();
    if (u.issues.length) {
      const f = new (l?.Err ?? e)(u.issues.map((w) => Rt(w, a, St())));
      throw (Tt(f, l?.callee), f);
    }
    return u.value;
  },
  _r = vr(Nt),
  mr = (e) => async (r, t, i, l) => {
    const a = i ? Object.assign(i, { async: !0 }) : { async: !0 };
    let u = r._zod.run({ value: t, issues: [] }, a);
    if ((u instanceof Promise && (u = await u), u.issues.length)) {
      const f = new (l?.Err ?? e)(u.issues.map((w) => Rt(w, a, St())));
      throw (Tt(f, l?.callee), f);
    }
    return u.value;
  },
  br = mr(Nt);
function Me() {
  return (
    (Me = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = arguments[r];
            for (var i in t) ({}).hasOwnProperty.call(t, i) && (e[i] = t[i]);
          }
          return e;
        }),
    Me.apply(null, arguments)
  );
}
function _t(e, r) {
  try {
    var t = e();
  } catch (i) {
    return r(i);
  }
  return t && t.then ? t.then(void 0, r) : t;
}
function Vr(e, r) {
  for (var t = {}; e.length; ) {
    var i = e[0],
      l = i.code,
      a = i.message,
      u = i.path.join(".");
    if (!t[u])
      if ("unionErrors" in i) {
        var f = i.unionErrors[0].errors[0];
        t[u] = { message: f.message, type: f.code };
      } else t[u] = { message: a, type: l };
    if (
      ("unionErrors" in i &&
        i.unionErrors.forEach(function (C) {
          return C.errors.forEach(function (A) {
            return e.push(A);
          });
        }),
      r)
    ) {
      var w = t[u].types,
        x = w && w[i.code];
      t[u] = je(u, r, t, l, x ? [].concat(x, i.message) : i.message);
    }
    e.shift();
  }
  return t;
}
function Fr(e, r) {
  for (
    var t = {},
      i = function () {
        var l = e[0],
          a = l.code,
          u = l.message,
          f = l.path.join(".");
        if (!t[f])
          if (l.code === "invalid_union" && l.errors.length > 0) {
            var w = l.errors[0][0];
            t[f] = { message: w.message, type: w.code };
          } else t[f] = { message: u, type: a };
        if (
          (l.code === "invalid_union" &&
            l.errors.forEach(function (A) {
              return A.forEach(function (D) {
                return e.push(Me({}, D, { path: [].concat(l.path, D.path) }));
              });
            }),
          r)
        ) {
          var x = t[f].types,
            C = x && x[l.code];
          t[f] = je(f, r, t, a, C ? [].concat(C, l.message) : l.message);
        }
        e.shift();
      };
    e.length;
  )
    i();
  return t;
}
function xr(e, r, t) {
  if (
    (t === void 0 && (t = {}),
    (function (i) {
      return "_def" in i && typeof i._def == "object" && "typeName" in i._def;
    })(e))
  )
    return function (i, l, a) {
      try {
        return Promise.resolve(
          _t(
            function () {
              return Promise.resolve(e[t.mode === "sync" ? "parse" : "parseAsync"](i, r)).then(
                function (u) {
                  return (
                    a.shouldUseNativeValidation && Le({}, a),
                    { errors: {}, values: t.raw ? Object.assign({}, i) : u }
                  );
                },
              );
            },
            function (u) {
              if (
                (function (f) {
                  return Array.isArray(f?.issues);
                })(u)
              )
                return {
                  values: {},
                  errors: gt(
                    Vr(u.errors, !a.shouldUseNativeValidation && a.criteriaMode === "all"),
                    a,
                  ),
                };
              throw u;
            },
          ),
        );
      } catch (u) {
        return Promise.reject(u);
      }
    };
  if (
    (function (i) {
      return "_zod" in i && typeof i._zod == "object";
    })(e)
  )
    return function (i, l, a) {
      try {
        return Promise.resolve(
          _t(
            function () {
              return Promise.resolve((t.mode === "sync" ? _r : br)(e, i, r)).then(function (u) {
                return (
                  a.shouldUseNativeValidation && Le({}, a),
                  { errors: {}, values: t.raw ? Object.assign({}, i) : u }
                );
              });
            },
            function (u) {
              if (
                (function (f) {
                  return f instanceof gr;
                })(u)
              )
                return {
                  values: {},
                  errors: gt(
                    Fr(u.issues, !a.shouldUseNativeValidation && a.criteriaMode === "all"),
                    a,
                  ),
                };
              throw u;
            },
          ),
        );
      } catch (u) {
        return Promise.reject(u);
      }
    };
  throw new Error("Invalid input: not a Zod schema");
}
export { Dr as a, xr as u };
