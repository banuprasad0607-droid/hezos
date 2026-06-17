var Ti =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof self < "u"
          ? self
          : {};
function le(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var To = { exports: {} },
  Q = {};
var uh;
function CO() {
  if (uh) return Q;
  uh = 1;
  var e = Symbol.for("react.transitional.element"),
    t = Symbol.for("react.portal"),
    r = Symbol.for("react.fragment"),
    n = Symbol.for("react.strict_mode"),
    i = Symbol.for("react.profiler"),
    a = Symbol.for("react.consumer"),
    o = Symbol.for("react.context"),
    u = Symbol.for("react.forward_ref"),
    c = Symbol.for("react.suspense"),
    s = Symbol.for("react.memo"),
    l = Symbol.for("react.lazy"),
    f = Symbol.for("react.activity"),
    p = Symbol.iterator;
  function d(P) {
    return P === null || typeof P != "object"
      ? null
      : ((P = (p && P[p]) || P["@@iterator"]), typeof P == "function" ? P : null);
  }
  var y = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    v = Object.assign,
    h = {};
  function g(P, M, F) {
    ((this.props = P), (this.context = M), (this.refs = h), (this.updater = F || y));
  }
  ((g.prototype.isReactComponent = {}),
    (g.prototype.setState = function (P, M) {
      if (typeof P != "object" && typeof P != "function" && P != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, P, M, "setState");
    }),
    (g.prototype.forceUpdate = function (P) {
      this.updater.enqueueForceUpdate(this, P, "forceUpdate");
    }));
  function x() {}
  x.prototype = g.prototype;
  function w(P, M, F) {
    ((this.props = P), (this.context = M), (this.refs = h), (this.updater = F || y));
  }
  var O = (w.prototype = new x());
  ((O.constructor = w), v(O, g.prototype), (O.isPureReactComponent = !0));
  var m = Array.isArray;
  function b() {}
  var _ = { H: null, A: null, T: null, S: null },
    A = Object.prototype.hasOwnProperty;
  function T(P, M, F) {
    var H = F.ref;
    return { $$typeof: e, type: P, key: M, ref: H !== void 0 ? H : null, props: F };
  }
  function $(P, M) {
    return T(P.type, M, P.props);
  }
  function j(P) {
    return typeof P == "object" && P !== null && P.$$typeof === e;
  }
  function E(P) {
    var M = { "=": "=0", ":": "=2" };
    return (
      "$" +
      P.replace(/[=:]/g, function (F) {
        return M[F];
      })
    );
  }
  var C = /\/+/g;
  function I(P, M) {
    return typeof P == "object" && P !== null && P.key != null ? E("" + P.key) : M.toString(36);
  }
  function R(P) {
    switch (P.status) {
      case "fulfilled":
        return P.value;
      case "rejected":
        throw P.reason;
      default:
        switch (
          (typeof P.status == "string"
            ? P.then(b, b)
            : ((P.status = "pending"),
              P.then(
                function (M) {
                  P.status === "pending" && ((P.status = "fulfilled"), (P.value = M));
                },
                function (M) {
                  P.status === "pending" && ((P.status = "rejected"), (P.reason = M));
                },
              )),
          P.status)
        ) {
          case "fulfilled":
            return P.value;
          case "rejected":
            throw P.reason;
        }
    }
    throw P;
  }
  function k(P, M, F, H, X) {
    var re = typeof P;
    (re === "undefined" || re === "boolean") && (P = null);
    var ae = !1;
    if (P === null) ae = !0;
    else
      switch (re) {
        case "bigint":
        case "string":
        case "number":
          ae = !0;
          break;
        case "object":
          switch (P.$$typeof) {
            case e:
            case t:
              ae = !0;
              break;
            case l:
              return ((ae = P._init), k(ae(P._payload), M, F, H, X));
          }
      }
    if (ae)
      return (
        (X = X(P)),
        (ae = H === "" ? "." + I(P, 0) : H),
        m(X)
          ? ((F = ""),
            ae != null && (F = ae.replace(C, "$&/") + "/"),
            k(X, M, F, "", function (ee) {
              return ee;
            }))
          : X != null &&
            (j(X) &&
              (X = $(
                X,
                F +
                  (X.key == null || (P && P.key === X.key)
                    ? ""
                    : ("" + X.key).replace(C, "$&/") + "/") +
                  ae,
              )),
            M.push(X)),
        1
      );
    ae = 0;
    var ye = H === "" ? "." : H + ":";
    if (m(P))
      for (var U = 0; U < P.length; U++)
        ((H = P[U]), (re = ye + I(H, U)), (ae += k(H, M, F, re, X)));
    else if (((U = d(P)), typeof U == "function"))
      for (P = U.call(P), U = 0; !(H = P.next()).done; )
        ((H = H.value), (re = ye + I(H, U++)), (ae += k(H, M, F, re, X)));
    else if (re === "object") {
      if (typeof P.then == "function") return k(R(P), M, F, H, X);
      throw (
        (M = String(P)),
        Error(
          "Objects are not valid as a React child (found: " +
            (M === "[object Object]" ? "object with keys {" + Object.keys(P).join(", ") + "}" : M) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return ae;
  }
  function N(P, M, F) {
    if (P == null) return P;
    var H = [],
      X = 0;
    return (
      k(P, H, "", "", function (re) {
        return M.call(F, re, X++);
      }),
      H
    );
  }
  function W(P) {
    if (P._status === -1) {
      var M = P._result;
      ((M = M()),
        M.then(
          function (F) {
            (P._status === 0 || P._status === -1) && ((P._status = 1), (P._result = F));
          },
          function (F) {
            (P._status === 0 || P._status === -1) && ((P._status = 2), (P._result = F));
          },
        ),
        P._status === -1 && ((P._status = 0), (P._result = M)));
    }
    if (P._status === 1) return P._result.default;
    throw P._result;
  }
  var z =
      typeof reportError == "function"
        ? reportError
        : function (P) {
            if (typeof window == "object" && typeof window.ErrorEvent == "function") {
              var M = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof P == "object" && P !== null && typeof P.message == "string"
                    ? String(P.message)
                    : String(P),
                error: P,
              });
              if (!window.dispatchEvent(M)) return;
            } else if (typeof process == "object" && typeof process.emit == "function") {
              process.emit("uncaughtException", P);
              return;
            }
            console.error(P);
          },
    K = {
      map: N,
      forEach: function (P, M, F) {
        N(
          P,
          function () {
            M.apply(this, arguments);
          },
          F,
        );
      },
      count: function (P) {
        var M = 0;
        return (
          N(P, function () {
            M++;
          }),
          M
        );
      },
      toArray: function (P) {
        return (
          N(P, function (M) {
            return M;
          }) || []
        );
      },
      only: function (P) {
        if (!j(P))
          throw Error("React.Children.only expected to receive a single React element child.");
        return P;
      },
    };
  return (
    (Q.Activity = f),
    (Q.Children = K),
    (Q.Component = g),
    (Q.Fragment = r),
    (Q.Profiler = i),
    (Q.PureComponent = w),
    (Q.StrictMode = n),
    (Q.Suspense = c),
    (Q.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = _),
    (Q.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (P) {
        return _.H.useMemoCache(P);
      },
    }),
    (Q.cache = function (P) {
      return function () {
        return P.apply(null, arguments);
      };
    }),
    (Q.cacheSignal = function () {
      return null;
    }),
    (Q.cloneElement = function (P, M, F) {
      if (P == null) throw Error("The argument must be a React element, but you passed " + P + ".");
      var H = v({}, P.props),
        X = P.key;
      if (M != null)
        for (re in (M.key !== void 0 && (X = "" + M.key), M))
          !A.call(M, re) ||
            re === "key" ||
            re === "__self" ||
            re === "__source" ||
            (re === "ref" && M.ref === void 0) ||
            (H[re] = M[re]);
      var re = arguments.length - 2;
      if (re === 1) H.children = F;
      else if (1 < re) {
        for (var ae = Array(re), ye = 0; ye < re; ye++) ae[ye] = arguments[ye + 2];
        H.children = ae;
      }
      return T(P.type, X, H);
    }),
    (Q.createContext = function (P) {
      return (
        (P = {
          $$typeof: o,
          _currentValue: P,
          _currentValue2: P,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (P.Provider = P),
        (P.Consumer = { $$typeof: a, _context: P }),
        P
      );
    }),
    (Q.createElement = function (P, M, F) {
      var H,
        X = {},
        re = null;
      if (M != null)
        for (H in (M.key !== void 0 && (re = "" + M.key), M))
          A.call(M, H) && H !== "key" && H !== "__self" && H !== "__source" && (X[H] = M[H]);
      var ae = arguments.length - 2;
      if (ae === 1) X.children = F;
      else if (1 < ae) {
        for (var ye = Array(ae), U = 0; U < ae; U++) ye[U] = arguments[U + 2];
        X.children = ye;
      }
      if (P && P.defaultProps)
        for (H in ((ae = P.defaultProps), ae)) X[H] === void 0 && (X[H] = ae[H]);
      return T(P, re, X);
    }),
    (Q.createRef = function () {
      return { current: null };
    }),
    (Q.forwardRef = function (P) {
      return { $$typeof: u, render: P };
    }),
    (Q.isValidElement = j),
    (Q.lazy = function (P) {
      return { $$typeof: l, _payload: { _status: -1, _result: P }, _init: W };
    }),
    (Q.memo = function (P, M) {
      return { $$typeof: s, type: P, compare: M === void 0 ? null : M };
    }),
    (Q.startTransition = function (P) {
      var M = _.T,
        F = {};
      _.T = F;
      try {
        var H = P(),
          X = _.S;
        (X !== null && X(F, H),
          typeof H == "object" && H !== null && typeof H.then == "function" && H.then(b, z));
      } catch (re) {
        z(re);
      } finally {
        (M !== null && F.types !== null && (M.types = F.types), (_.T = M));
      }
    }),
    (Q.unstable_useCacheRefresh = function () {
      return _.H.useCacheRefresh();
    }),
    (Q.use = function (P) {
      return _.H.use(P);
    }),
    (Q.useActionState = function (P, M, F) {
      return _.H.useActionState(P, M, F);
    }),
    (Q.useCallback = function (P, M) {
      return _.H.useCallback(P, M);
    }),
    (Q.useContext = function (P) {
      return _.H.useContext(P);
    }),
    (Q.useDebugValue = function () {}),
    (Q.useDeferredValue = function (P, M) {
      return _.H.useDeferredValue(P, M);
    }),
    (Q.useEffect = function (P, M) {
      return _.H.useEffect(P, M);
    }),
    (Q.useEffectEvent = function (P) {
      return _.H.useEffectEvent(P);
    }),
    (Q.useId = function () {
      return _.H.useId();
    }),
    (Q.useImperativeHandle = function (P, M, F) {
      return _.H.useImperativeHandle(P, M, F);
    }),
    (Q.useInsertionEffect = function (P, M) {
      return _.H.useInsertionEffect(P, M);
    }),
    (Q.useLayoutEffect = function (P, M) {
      return _.H.useLayoutEffect(P, M);
    }),
    (Q.useMemo = function (P, M) {
      return _.H.useMemo(P, M);
    }),
    (Q.useOptimistic = function (P, M) {
      return _.H.useOptimistic(P, M);
    }),
    (Q.useReducer = function (P, M, F) {
      return _.H.useReducer(P, M, F);
    }),
    (Q.useRef = function (P) {
      return _.H.useRef(P);
    }),
    (Q.useState = function (P) {
      return _.H.useState(P);
    }),
    (Q.useSyncExternalStore = function (P, M, F) {
      return _.H.useSyncExternalStore(P, M, F);
    }),
    (Q.useTransition = function () {
      return _.H.useTransition();
    }),
    (Q.version = "19.2.6"),
    Q
  );
}
var ch;
function u0() {
  return (ch || ((ch = 1), (To.exports = CO())), To.exports);
}
var L = u0();
const S = le(L);
var Eo = { exports: {} },
  ke = {};
var sh;
function IO() {
  if (sh) return ke;
  sh = 1;
  var e = u0();
  function t(c) {
    var s = "https://react.dev/errors/" + c;
    if (1 < arguments.length) {
      s += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++) s += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return (
      "Minified React error #" +
      c +
      "; visit " +
      s +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function r() {}
  var n = {
      d: {
        f: r,
        r: function () {
          throw Error(t(522));
        },
        D: r,
        C: r,
        L: r,
        m: r,
        X: r,
        S: r,
        M: r,
      },
      p: 0,
      findDOMNode: null,
    },
    i = Symbol.for("react.portal");
  function a(c, s, l) {
    var f = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: i,
      key: f == null ? null : "" + f,
      children: c,
      containerInfo: s,
      implementation: l,
    };
  }
  var o = e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function u(c, s) {
    if (c === "font") return "";
    if (typeof s == "string") return s === "use-credentials" ? s : "";
  }
  return (
    (ke.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n),
    (ke.createPortal = function (c, s) {
      var l = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!s || (s.nodeType !== 1 && s.nodeType !== 9 && s.nodeType !== 11)) throw Error(t(299));
      return a(c, s, null, l);
    }),
    (ke.flushSync = function (c) {
      var s = o.T,
        l = n.p;
      try {
        if (((o.T = null), (n.p = 2), c)) return c();
      } finally {
        ((o.T = s), (n.p = l), n.d.f());
      }
    }),
    (ke.preconnect = function (c, s) {
      typeof c == "string" &&
        (s
          ? ((s = s.crossOrigin),
            (s = typeof s == "string" ? (s === "use-credentials" ? s : "") : void 0))
          : (s = null),
        n.d.C(c, s));
    }),
    (ke.prefetchDNS = function (c) {
      typeof c == "string" && n.d.D(c);
    }),
    (ke.preinit = function (c, s) {
      if (typeof c == "string" && s && typeof s.as == "string") {
        var l = s.as,
          f = u(l, s.crossOrigin),
          p = typeof s.integrity == "string" ? s.integrity : void 0,
          d = typeof s.fetchPriority == "string" ? s.fetchPriority : void 0;
        l === "style"
          ? n.d.S(c, typeof s.precedence == "string" ? s.precedence : void 0, {
              crossOrigin: f,
              integrity: p,
              fetchPriority: d,
            })
          : l === "script" &&
            n.d.X(c, {
              crossOrigin: f,
              integrity: p,
              fetchPriority: d,
              nonce: typeof s.nonce == "string" ? s.nonce : void 0,
            });
      }
    }),
    (ke.preinitModule = function (c, s) {
      if (typeof c == "string")
        if (typeof s == "object" && s !== null) {
          if (s.as == null || s.as === "script") {
            var l = u(s.as, s.crossOrigin);
            n.d.M(c, {
              crossOrigin: l,
              integrity: typeof s.integrity == "string" ? s.integrity : void 0,
              nonce: typeof s.nonce == "string" ? s.nonce : void 0,
            });
          }
        } else s == null && n.d.M(c);
    }),
    (ke.preload = function (c, s) {
      if (typeof c == "string" && typeof s == "object" && s !== null && typeof s.as == "string") {
        var l = s.as,
          f = u(l, s.crossOrigin);
        n.d.L(c, l, {
          crossOrigin: f,
          integrity: typeof s.integrity == "string" ? s.integrity : void 0,
          nonce: typeof s.nonce == "string" ? s.nonce : void 0,
          type: typeof s.type == "string" ? s.type : void 0,
          fetchPriority: typeof s.fetchPriority == "string" ? s.fetchPriority : void 0,
          referrerPolicy: typeof s.referrerPolicy == "string" ? s.referrerPolicy : void 0,
          imageSrcSet: typeof s.imageSrcSet == "string" ? s.imageSrcSet : void 0,
          imageSizes: typeof s.imageSizes == "string" ? s.imageSizes : void 0,
          media: typeof s.media == "string" ? s.media : void 0,
        });
      }
    }),
    (ke.preloadModule = function (c, s) {
      if (typeof c == "string")
        if (s) {
          var l = u(s.as, s.crossOrigin);
          n.d.m(c, {
            as: typeof s.as == "string" && s.as !== "script" ? s.as : void 0,
            crossOrigin: l,
            integrity: typeof s.integrity == "string" ? s.integrity : void 0,
          });
        } else n.d.m(c);
    }),
    (ke.requestFormReset = function (c) {
      n.d.r(c);
    }),
    (ke.unstable_batchedUpdates = function (c, s) {
      return c(s);
    }),
    (ke.useFormState = function (c, s, l) {
      return o.H.useFormState(c, s, l);
    }),
    (ke.useFormStatus = function () {
      return o.H.useHostTransitionStatus();
    }),
    (ke.version = "19.2.6"),
    ke
  );
}
var lh;
function RO() {
  if (lh) return Eo.exports;
  lh = 1;
  function e() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
      } catch (t) {
        console.error(t);
      }
  }
  return (e(), (Eo.exports = IO()), Eo.exports);
}
var kO = RO();
const Tq = le(kO);
function c0(e) {
  var t,
    r,
    n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object")
    if (Array.isArray(e)) {
      var i = e.length;
      for (t = 0; t < i; t++) e[t] && (r = c0(e[t])) && (n && (n += " "), (n += r));
    } else for (r in e) e[r] && (n && (n += " "), (n += r));
  return n;
}
function te() {
  for (var e, t, r = 0, n = "", i = arguments.length; r < i; r++)
    (e = arguments[r]) && (t = c0(e)) && (n && (n += " "), (n += t));
  return n;
}
var jo, fh;
function We() {
  if (fh) return jo;
  fh = 1;
  var e = Array.isArray;
  return ((jo = e), jo);
}
var $o, ph;
function s0() {
  if (ph) return $o;
  ph = 1;
  var e = typeof Ti == "object" && Ti && Ti.Object === Object && Ti;
  return (($o = e), $o);
}
var Mo, hh;
function yt() {
  if (hh) return Mo;
  hh = 1;
  var e = s0(),
    t = typeof self == "object" && self && self.Object === Object && self,
    r = e || t || Function("return this")();
  return ((Mo = r), Mo);
}
var Co, dh;
function yi() {
  if (dh) return Co;
  dh = 1;
  var e = yt(),
    t = e.Symbol;
  return ((Co = t), Co);
}
var Io, vh;
function DO() {
  if (vh) return Io;
  vh = 1;
  var e = yi(),
    t = Object.prototype,
    r = t.hasOwnProperty,
    n = t.toString,
    i = e ? e.toStringTag : void 0;
  function a(o) {
    var u = r.call(o, i),
      c = o[i];
    try {
      o[i] = void 0;
      var s = !0;
    } catch {}
    var l = n.call(o);
    return (s && (u ? (o[i] = c) : delete o[i]), l);
  }
  return ((Io = a), Io);
}
var Ro, yh;
function NO() {
  if (yh) return Ro;
  yh = 1;
  var e = Object.prototype,
    t = e.toString;
  function r(n) {
    return t.call(n);
  }
  return ((Ro = r), Ro);
}
var ko, mh;
function jt() {
  if (mh) return ko;
  mh = 1;
  var e = yi(),
    t = DO(),
    r = NO(),
    n = "[object Null]",
    i = "[object Undefined]",
    a = e ? e.toStringTag : void 0;
  function o(u) {
    return u == null ? (u === void 0 ? i : n) : a && a in Object(u) ? t(u) : r(u);
  }
  return ((ko = o), ko);
}
var Do, gh;
function $t() {
  if (gh) return Do;
  gh = 1;
  function e(t) {
    return t != null && typeof t == "object";
  }
  return ((Do = e), Do);
}
var No, bh;
function un() {
  if (bh) return No;
  bh = 1;
  var e = jt(),
    t = $t(),
    r = "[object Symbol]";
  function n(i) {
    return typeof i == "symbol" || (t(i) && e(i) == r);
  }
  return ((No = n), No);
}
var qo, xh;
function ep() {
  if (xh) return qo;
  xh = 1;
  var e = We(),
    t = un(),
    r = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    n = /^\w*$/;
  function i(a, o) {
    if (e(a)) return !1;
    var u = typeof a;
    return u == "number" || u == "symbol" || u == "boolean" || a == null || t(a)
      ? !0
      : n.test(a) || !r.test(a) || (o != null && a in Object(o));
  }
  return ((qo = i), qo);
}
var Lo, wh;
function Lt() {
  if (wh) return Lo;
  wh = 1;
  function e(t) {
    var r = typeof t;
    return t != null && (r == "object" || r == "function");
  }
  return ((Lo = e), Lo);
}
var Bo, Oh;
function tp() {
  if (Oh) return Bo;
  Oh = 1;
  var e = jt(),
    t = Lt(),
    r = "[object AsyncFunction]",
    n = "[object Function]",
    i = "[object GeneratorFunction]",
    a = "[object Proxy]";
  function o(u) {
    if (!t(u)) return !1;
    var c = e(u);
    return c == n || c == i || c == r || c == a;
  }
  return ((Bo = o), Bo);
}
var Fo, _h;
function qO() {
  if (_h) return Fo;
  _h = 1;
  var e = yt(),
    t = e["__core-js_shared__"];
  return ((Fo = t), Fo);
}
var Uo, Ah;
function LO() {
  if (Ah) return Uo;
  Ah = 1;
  var e = qO(),
    t = (function () {
      var n = /[^.]+$/.exec((e && e.keys && e.keys.IE_PROTO) || "");
      return n ? "Symbol(src)_1." + n : "";
    })();
  function r(n) {
    return !!t && t in n;
  }
  return ((Uo = r), Uo);
}
var Wo, Sh;
function l0() {
  if (Sh) return Wo;
  Sh = 1;
  var e = Function.prototype,
    t = e.toString;
  function r(n) {
    if (n != null) {
      try {
        return t.call(n);
      } catch {}
      try {
        return n + "";
      } catch {}
    }
    return "";
  }
  return ((Wo = r), Wo);
}
var zo, Ph;
function BO() {
  if (Ph) return zo;
  Ph = 1;
  var e = tp(),
    t = LO(),
    r = Lt(),
    n = l0(),
    i = /[\\^$.*+?()[\]{}|]/g,
    a = /^\[object .+?Constructor\]$/,
    o = Function.prototype,
    u = Object.prototype,
    c = o.toString,
    s = u.hasOwnProperty,
    l = RegExp(
      "^" +
        c
          .call(s)
          .replace(i, "\\$&")
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") +
        "$",
    );
  function f(p) {
    if (!r(p) || t(p)) return !1;
    var d = e(p) ? l : a;
    return d.test(n(p));
  }
  return ((zo = f), zo);
}
var Ho, Th;
function FO() {
  if (Th) return Ho;
  Th = 1;
  function e(t, r) {
    return t?.[r];
  }
  return ((Ho = e), Ho);
}
var Ko, Eh;
function dr() {
  if (Eh) return Ko;
  Eh = 1;
  var e = BO(),
    t = FO();
  function r(n, i) {
    var a = t(n, i);
    return e(a) ? a : void 0;
  }
  return ((Ko = r), Ko);
}
var Go, jh;
function Wa() {
  if (jh) return Go;
  jh = 1;
  var e = dr(),
    t = e(Object, "create");
  return ((Go = t), Go);
}
var Vo, $h;
function UO() {
  if ($h) return Vo;
  $h = 1;
  var e = Wa();
  function t() {
    ((this.__data__ = e ? e(null) : {}), (this.size = 0));
  }
  return ((Vo = t), Vo);
}
var Xo, Mh;
function WO() {
  if (Mh) return Xo;
  Mh = 1;
  function e(t) {
    var r = this.has(t) && delete this.__data__[t];
    return ((this.size -= r ? 1 : 0), r);
  }
  return ((Xo = e), Xo);
}
var Yo, Ch;
function zO() {
  if (Ch) return Yo;
  Ch = 1;
  var e = Wa(),
    t = "__lodash_hash_undefined__",
    r = Object.prototype,
    n = r.hasOwnProperty;
  function i(a) {
    var o = this.__data__;
    if (e) {
      var u = o[a];
      return u === t ? void 0 : u;
    }
    return n.call(o, a) ? o[a] : void 0;
  }
  return ((Yo = i), Yo);
}
var Zo, Ih;
function HO() {
  if (Ih) return Zo;
  Ih = 1;
  var e = Wa(),
    t = Object.prototype,
    r = t.hasOwnProperty;
  function n(i) {
    var a = this.__data__;
    return e ? a[i] !== void 0 : r.call(a, i);
  }
  return ((Zo = n), Zo);
}
var Jo, Rh;
function KO() {
  if (Rh) return Jo;
  Rh = 1;
  var e = Wa(),
    t = "__lodash_hash_undefined__";
  function r(n, i) {
    var a = this.__data__;
    return ((this.size += this.has(n) ? 0 : 1), (a[n] = e && i === void 0 ? t : i), this);
  }
  return ((Jo = r), Jo);
}
var Qo, kh;
function GO() {
  if (kh) return Qo;
  kh = 1;
  var e = UO(),
    t = WO(),
    r = zO(),
    n = HO(),
    i = KO();
  function a(o) {
    var u = -1,
      c = o == null ? 0 : o.length;
    for (this.clear(); ++u < c; ) {
      var s = o[u];
      this.set(s[0], s[1]);
    }
  }
  return (
    (a.prototype.clear = e),
    (a.prototype.delete = t),
    (a.prototype.get = r),
    (a.prototype.has = n),
    (a.prototype.set = i),
    (Qo = a),
    Qo
  );
}
var eu, Dh;
function VO() {
  if (Dh) return eu;
  Dh = 1;
  function e() {
    ((this.__data__ = []), (this.size = 0));
  }
  return ((eu = e), eu);
}
var tu, Nh;
function rp() {
  if (Nh) return tu;
  Nh = 1;
  function e(t, r) {
    return t === r || (t !== t && r !== r);
  }
  return ((tu = e), tu);
}
var ru, qh;
function za() {
  if (qh) return ru;
  qh = 1;
  var e = rp();
  function t(r, n) {
    for (var i = r.length; i--; ) if (e(r[i][0], n)) return i;
    return -1;
  }
  return ((ru = t), ru);
}
var nu, Lh;
function XO() {
  if (Lh) return nu;
  Lh = 1;
  var e = za(),
    t = Array.prototype,
    r = t.splice;
  function n(i) {
    var a = this.__data__,
      o = e(a, i);
    if (o < 0) return !1;
    var u = a.length - 1;
    return (o == u ? a.pop() : r.call(a, o, 1), --this.size, !0);
  }
  return ((nu = n), nu);
}
var iu, Bh;
function YO() {
  if (Bh) return iu;
  Bh = 1;
  var e = za();
  function t(r) {
    var n = this.__data__,
      i = e(n, r);
    return i < 0 ? void 0 : n[i][1];
  }
  return ((iu = t), iu);
}
var au, Fh;
function ZO() {
  if (Fh) return au;
  Fh = 1;
  var e = za();
  function t(r) {
    return e(this.__data__, r) > -1;
  }
  return ((au = t), au);
}
var ou, Uh;
function JO() {
  if (Uh) return ou;
  Uh = 1;
  var e = za();
  function t(r, n) {
    var i = this.__data__,
      a = e(i, r);
    return (a < 0 ? (++this.size, i.push([r, n])) : (i[a][1] = n), this);
  }
  return ((ou = t), ou);
}
var uu, Wh;
function Ha() {
  if (Wh) return uu;
  Wh = 1;
  var e = VO(),
    t = XO(),
    r = YO(),
    n = ZO(),
    i = JO();
  function a(o) {
    var u = -1,
      c = o == null ? 0 : o.length;
    for (this.clear(); ++u < c; ) {
      var s = o[u];
      this.set(s[0], s[1]);
    }
  }
  return (
    (a.prototype.clear = e),
    (a.prototype.delete = t),
    (a.prototype.get = r),
    (a.prototype.has = n),
    (a.prototype.set = i),
    (uu = a),
    uu
  );
}
var cu, zh;
function np() {
  if (zh) return cu;
  zh = 1;
  var e = dr(),
    t = yt(),
    r = e(t, "Map");
  return ((cu = r), cu);
}
var su, Hh;
function QO() {
  if (Hh) return su;
  Hh = 1;
  var e = GO(),
    t = Ha(),
    r = np();
  function n() {
    ((this.size = 0), (this.__data__ = { hash: new e(), map: new (r || t)(), string: new e() }));
  }
  return ((su = n), su);
}
var lu, Kh;
function e_() {
  if (Kh) return lu;
  Kh = 1;
  function e(t) {
    var r = typeof t;
    return r == "string" || r == "number" || r == "symbol" || r == "boolean"
      ? t !== "__proto__"
      : t === null;
  }
  return ((lu = e), lu);
}
var fu, Gh;
function Ka() {
  if (Gh) return fu;
  Gh = 1;
  var e = e_();
  function t(r, n) {
    var i = r.__data__;
    return e(n) ? i[typeof n == "string" ? "string" : "hash"] : i.map;
  }
  return ((fu = t), fu);
}
var pu, Vh;
function t_() {
  if (Vh) return pu;
  Vh = 1;
  var e = Ka();
  function t(r) {
    var n = e(this, r).delete(r);
    return ((this.size -= n ? 1 : 0), n);
  }
  return ((pu = t), pu);
}
var hu, Xh;
function r_() {
  if (Xh) return hu;
  Xh = 1;
  var e = Ka();
  function t(r) {
    return e(this, r).get(r);
  }
  return ((hu = t), hu);
}
var du, Yh;
function n_() {
  if (Yh) return du;
  Yh = 1;
  var e = Ka();
  function t(r) {
    return e(this, r).has(r);
  }
  return ((du = t), du);
}
var vu, Zh;
function i_() {
  if (Zh) return vu;
  Zh = 1;
  var e = Ka();
  function t(r, n) {
    var i = e(this, r),
      a = i.size;
    return (i.set(r, n), (this.size += i.size == a ? 0 : 1), this);
  }
  return ((vu = t), vu);
}
var yu, Jh;
function ip() {
  if (Jh) return yu;
  Jh = 1;
  var e = QO(),
    t = t_(),
    r = r_(),
    n = n_(),
    i = i_();
  function a(o) {
    var u = -1,
      c = o == null ? 0 : o.length;
    for (this.clear(); ++u < c; ) {
      var s = o[u];
      this.set(s[0], s[1]);
    }
  }
  return (
    (a.prototype.clear = e),
    (a.prototype.delete = t),
    (a.prototype.get = r),
    (a.prototype.has = n),
    (a.prototype.set = i),
    (yu = a),
    yu
  );
}
var mu, Qh;
function f0() {
  if (Qh) return mu;
  Qh = 1;
  var e = ip(),
    t = "Expected a function";
  function r(n, i) {
    if (typeof n != "function" || (i != null && typeof i != "function")) throw new TypeError(t);
    var a = function () {
      var o = arguments,
        u = i ? i.apply(this, o) : o[0],
        c = a.cache;
      if (c.has(u)) return c.get(u);
      var s = n.apply(this, o);
      return ((a.cache = c.set(u, s) || c), s);
    };
    return ((a.cache = new (r.Cache || e)()), a);
  }
  return ((r.Cache = e), (mu = r), mu);
}
var gu, ed;
function a_() {
  if (ed) return gu;
  ed = 1;
  var e = f0(),
    t = 500;
  function r(n) {
    var i = e(n, function (o) {
        return (a.size === t && a.clear(), o);
      }),
      a = i.cache;
    return i;
  }
  return ((gu = r), gu);
}
var bu, td;
function o_() {
  if (td) return bu;
  td = 1;
  var e = a_(),
    t =
      /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    r = /\\(\\)?/g,
    n = e(function (i) {
      var a = [];
      return (
        i.charCodeAt(0) === 46 && a.push(""),
        i.replace(t, function (o, u, c, s) {
          a.push(c ? s.replace(r, "$1") : u || o);
        }),
        a
      );
    });
  return ((bu = n), bu);
}
var xu, rd;
function ap() {
  if (rd) return xu;
  rd = 1;
  function e(t, r) {
    for (var n = -1, i = t == null ? 0 : t.length, a = Array(i); ++n < i; ) a[n] = r(t[n], n, t);
    return a;
  }
  return ((xu = e), xu);
}
var wu, nd;
function u_() {
  if (nd) return wu;
  nd = 1;
  var e = yi(),
    t = ap(),
    r = We(),
    n = un(),
    i = e ? e.prototype : void 0,
    a = i ? i.toString : void 0;
  function o(u) {
    if (typeof u == "string") return u;
    if (r(u)) return t(u, o) + "";
    if (n(u)) return a ? a.call(u) : "";
    var c = u + "";
    return c == "0" && 1 / u == -1 / 0 ? "-0" : c;
  }
  return ((wu = o), wu);
}
var Ou, id;
function p0() {
  if (id) return Ou;
  id = 1;
  var e = u_();
  function t(r) {
    return r == null ? "" : e(r);
  }
  return ((Ou = t), Ou);
}
var _u, ad;
function h0() {
  if (ad) return _u;
  ad = 1;
  var e = We(),
    t = ep(),
    r = o_(),
    n = p0();
  function i(a, o) {
    return e(a) ? a : t(a, o) ? [a] : r(n(a));
  }
  return ((_u = i), _u);
}
var Au, od;
function Ga() {
  if (od) return Au;
  od = 1;
  var e = un();
  function t(r) {
    if (typeof r == "string" || e(r)) return r;
    var n = r + "";
    return n == "0" && 1 / r == -1 / 0 ? "-0" : n;
  }
  return ((Au = t), Au);
}
var Su, ud;
function op() {
  if (ud) return Su;
  ud = 1;
  var e = h0(),
    t = Ga();
  function r(n, i) {
    i = e(i, n);
    for (var a = 0, o = i.length; n != null && a < o; ) n = n[t(i[a++])];
    return a && a == o ? n : void 0;
  }
  return ((Su = r), Su);
}
var Pu, cd;
function d0() {
  if (cd) return Pu;
  cd = 1;
  var e = op();
  function t(r, n, i) {
    var a = r == null ? void 0 : e(r, n);
    return a === void 0 ? i : a;
  }
  return ((Pu = t), Pu);
}
var c_ = d0();
const Ve = le(c_);
var Tu, sd;
function s_() {
  if (sd) return Tu;
  sd = 1;
  function e(t) {
    return t == null;
  }
  return ((Tu = e), Tu);
}
var l_ = s_();
const J = le(l_);
var Eu, ld;
function f_() {
  if (ld) return Eu;
  ld = 1;
  var e = jt(),
    t = We(),
    r = $t(),
    n = "[object String]";
  function i(a) {
    return typeof a == "string" || (!t(a) && r(a) && e(a) == n);
  }
  return ((Eu = i), Eu);
}
var p_ = f_();
const ur = le(p_);
var h_ = tp();
const Z = le(h_);
var d_ = Lt();
const cn = le(d_);
var ju = { exports: {} },
  ce = {};
var fd;
function v_() {
  if (fd) return ce;
  fd = 1;
  var e = Symbol.for("react.element"),
    t = Symbol.for("react.portal"),
    r = Symbol.for("react.fragment"),
    n = Symbol.for("react.strict_mode"),
    i = Symbol.for("react.profiler"),
    a = Symbol.for("react.provider"),
    o = Symbol.for("react.context"),
    u = Symbol.for("react.server_context"),
    c = Symbol.for("react.forward_ref"),
    s = Symbol.for("react.suspense"),
    l = Symbol.for("react.suspense_list"),
    f = Symbol.for("react.memo"),
    p = Symbol.for("react.lazy"),
    d = Symbol.for("react.offscreen"),
    y;
  y = Symbol.for("react.module.reference");
  function v(h) {
    if (typeof h == "object" && h !== null) {
      var g = h.$$typeof;
      switch (g) {
        case e:
          switch (((h = h.type), h)) {
            case r:
            case i:
            case n:
            case s:
            case l:
              return h;
            default:
              switch (((h = h && h.$$typeof), h)) {
                case u:
                case o:
                case c:
                case p:
                case f:
                case a:
                  return h;
                default:
                  return g;
              }
          }
        case t:
          return g;
      }
    }
  }
  return (
    (ce.ContextConsumer = o),
    (ce.ContextProvider = a),
    (ce.Element = e),
    (ce.ForwardRef = c),
    (ce.Fragment = r),
    (ce.Lazy = p),
    (ce.Memo = f),
    (ce.Portal = t),
    (ce.Profiler = i),
    (ce.StrictMode = n),
    (ce.Suspense = s),
    (ce.SuspenseList = l),
    (ce.isAsyncMode = function () {
      return !1;
    }),
    (ce.isConcurrentMode = function () {
      return !1;
    }),
    (ce.isContextConsumer = function (h) {
      return v(h) === o;
    }),
    (ce.isContextProvider = function (h) {
      return v(h) === a;
    }),
    (ce.isElement = function (h) {
      return typeof h == "object" && h !== null && h.$$typeof === e;
    }),
    (ce.isForwardRef = function (h) {
      return v(h) === c;
    }),
    (ce.isFragment = function (h) {
      return v(h) === r;
    }),
    (ce.isLazy = function (h) {
      return v(h) === p;
    }),
    (ce.isMemo = function (h) {
      return v(h) === f;
    }),
    (ce.isPortal = function (h) {
      return v(h) === t;
    }),
    (ce.isProfiler = function (h) {
      return v(h) === i;
    }),
    (ce.isStrictMode = function (h) {
      return v(h) === n;
    }),
    (ce.isSuspense = function (h) {
      return v(h) === s;
    }),
    (ce.isSuspenseList = function (h) {
      return v(h) === l;
    }),
    (ce.isValidElementType = function (h) {
      return (
        typeof h == "string" ||
        typeof h == "function" ||
        h === r ||
        h === i ||
        h === n ||
        h === s ||
        h === l ||
        h === d ||
        (typeof h == "object" &&
          h !== null &&
          (h.$$typeof === p ||
            h.$$typeof === f ||
            h.$$typeof === a ||
            h.$$typeof === o ||
            h.$$typeof === c ||
            h.$$typeof === y ||
            h.getModuleId !== void 0))
      );
    }),
    (ce.typeOf = v),
    ce
  );
}
var pd;
function y_() {
  return (pd || ((pd = 1), (ju.exports = v_())), ju.exports);
}
var m_ = y_(),
  $u,
  hd;
function v0() {
  if (hd) return $u;
  hd = 1;
  var e = jt(),
    t = $t(),
    r = "[object Number]";
  function n(i) {
    return typeof i == "number" || (t(i) && e(i) == r);
  }
  return (($u = n), $u);
}
var Mu, dd;
function g_() {
  if (dd) return Mu;
  dd = 1;
  var e = v0();
  function t(r) {
    return e(r) && r != +r;
  }
  return ((Mu = t), Mu);
}
var b_ = g_();
const sn = le(b_);
var x_ = v0();
const w_ = le(x_);
var qe = function (t) {
    return t === 0 ? 0 : t > 0 ? 1 : -1;
  },
  Qt = function (t) {
    return ur(t) && t.indexOf("%") === t.length - 1;
  },
  B = function (t) {
    return w_(t) && !sn(t);
  },
  O_ = function (t) {
    return J(t);
  },
  je = function (t) {
    return B(t) || ur(t);
  },
  __ = 0,
  vr = function (t) {
    var r = ++__;
    return "".concat(t || "").concat(r);
  },
  Le = function (t, r) {
    var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0,
      i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
    if (!B(t) && !ur(t)) return n;
    var a;
    if (Qt(t)) {
      var o = t.indexOf("%");
      a = (r * parseFloat(t.slice(0, o))) / 100;
    } else a = +t;
    return (sn(a) && (a = n), i && a > r && (a = r), a);
  },
  kt = function (t) {
    if (!t) return null;
    var r = Object.keys(t);
    return r && r.length ? t[r[0]] : null;
  },
  A_ = function (t) {
    if (!Array.isArray(t)) return !1;
    for (var r = t.length, n = {}, i = 0; i < r; i++)
      if (!n[t[i]]) n[t[i]] = !0;
      else return !0;
    return !1;
  },
  Ee = function (t, r) {
    return B(t) && B(r)
      ? function (n) {
          return t + n * (r - t);
        }
      : function () {
          return r;
        };
  };
function Ui(e, t, r) {
  return !e || !e.length
    ? null
    : e.find(function (n) {
        return n && (typeof t == "function" ? t(n) : Ve(n, t)) === r;
      });
}
var S_ = function (t, r) {
  return B(t) && B(r)
    ? t - r
    : ur(t) && ur(r)
      ? t.localeCompare(r)
      : t instanceof Date && r instanceof Date
        ? t.getTime() - r.getTime()
        : String(t).localeCompare(String(r));
};
function $r(e, t) {
  for (var r in e)
    if ({}.hasOwnProperty.call(e, r) && (!{}.hasOwnProperty.call(t, r) || e[r] !== t[r])) return !1;
  for (var n in t) if ({}.hasOwnProperty.call(t, n) && !{}.hasOwnProperty.call(e, n)) return !1;
  return !0;
}
function Ml(e) {
  "@babel/helpers - typeof";
  return (
    (Ml =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Ml(e)
  );
}
var P_ = ["viewBox", "children"],
  T_ = [
    "aria-activedescendant",
    "aria-atomic",
    "aria-autocomplete",
    "aria-busy",
    "aria-checked",
    "aria-colcount",
    "aria-colindex",
    "aria-colspan",
    "aria-controls",
    "aria-current",
    "aria-describedby",
    "aria-details",
    "aria-disabled",
    "aria-errormessage",
    "aria-expanded",
    "aria-flowto",
    "aria-haspopup",
    "aria-hidden",
    "aria-invalid",
    "aria-keyshortcuts",
    "aria-label",
    "aria-labelledby",
    "aria-level",
    "aria-live",
    "aria-modal",
    "aria-multiline",
    "aria-multiselectable",
    "aria-orientation",
    "aria-owns",
    "aria-placeholder",
    "aria-posinset",
    "aria-pressed",
    "aria-readonly",
    "aria-relevant",
    "aria-required",
    "aria-roledescription",
    "aria-rowcount",
    "aria-rowindex",
    "aria-rowspan",
    "aria-selected",
    "aria-setsize",
    "aria-sort",
    "aria-valuemax",
    "aria-valuemin",
    "aria-valuenow",
    "aria-valuetext",
    "className",
    "color",
    "height",
    "id",
    "lang",
    "max",
    "media",
    "method",
    "min",
    "name",
    "style",
    "target",
    "width",
    "role",
    "tabIndex",
    "accentHeight",
    "accumulate",
    "additive",
    "alignmentBaseline",
    "allowReorder",
    "alphabetic",
    "amplitude",
    "arabicForm",
    "ascent",
    "attributeName",
    "attributeType",
    "autoReverse",
    "azimuth",
    "baseFrequency",
    "baselineShift",
    "baseProfile",
    "bbox",
    "begin",
    "bias",
    "by",
    "calcMode",
    "capHeight",
    "clip",
    "clipPath",
    "clipPathUnits",
    "clipRule",
    "colorInterpolation",
    "colorInterpolationFilters",
    "colorProfile",
    "colorRendering",
    "contentScriptType",
    "contentStyleType",
    "cursor",
    "cx",
    "cy",
    "d",
    "decelerate",
    "descent",
    "diffuseConstant",
    "direction",
    "display",
    "divisor",
    "dominantBaseline",
    "dur",
    "dx",
    "dy",
    "edgeMode",
    "elevation",
    "enableBackground",
    "end",
    "exponent",
    "externalResourcesRequired",
    "fill",
    "fillOpacity",
    "fillRule",
    "filter",
    "filterRes",
    "filterUnits",
    "floodColor",
    "floodOpacity",
    "focusable",
    "fontFamily",
    "fontSize",
    "fontSizeAdjust",
    "fontStretch",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "format",
    "from",
    "fx",
    "fy",
    "g1",
    "g2",
    "glyphName",
    "glyphOrientationHorizontal",
    "glyphOrientationVertical",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "hanging",
    "horizAdvX",
    "horizOriginX",
    "href",
    "ideographic",
    "imageRendering",
    "in2",
    "in",
    "intercept",
    "k1",
    "k2",
    "k3",
    "k4",
    "k",
    "kernelMatrix",
    "kernelUnitLength",
    "kerning",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "lengthAdjust",
    "letterSpacing",
    "lightingColor",
    "limitingConeAngle",
    "local",
    "markerEnd",
    "markerHeight",
    "markerMid",
    "markerStart",
    "markerUnits",
    "markerWidth",
    "mask",
    "maskContentUnits",
    "maskUnits",
    "mathematical",
    "mode",
    "numOctaves",
    "offset",
    "opacity",
    "operator",
    "order",
    "orient",
    "orientation",
    "origin",
    "overflow",
    "overlinePosition",
    "overlineThickness",
    "paintOrder",
    "panose1",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "pointerEvents",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "r",
    "radius",
    "refX",
    "refY",
    "renderingIntent",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "restart",
    "result",
    "rotate",
    "rx",
    "ry",
    "seed",
    "shapeRendering",
    "slope",
    "spacing",
    "specularConstant",
    "specularExponent",
    "speed",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stemh",
    "stemv",
    "stitchTiles",
    "stopColor",
    "stopOpacity",
    "strikethroughPosition",
    "strikethroughThickness",
    "string",
    "stroke",
    "strokeDasharray",
    "strokeDashoffset",
    "strokeLinecap",
    "strokeLinejoin",
    "strokeMiterlimit",
    "strokeOpacity",
    "strokeWidth",
    "surfaceScale",
    "systemLanguage",
    "tableValues",
    "targetX",
    "targetY",
    "textAnchor",
    "textDecoration",
    "textLength",
    "textRendering",
    "to",
    "transform",
    "u1",
    "u2",
    "underlinePosition",
    "underlineThickness",
    "unicode",
    "unicodeBidi",
    "unicodeRange",
    "unitsPerEm",
    "vAlphabetic",
    "values",
    "vectorEffect",
    "version",
    "vertAdvY",
    "vertOriginX",
    "vertOriginY",
    "vHanging",
    "vIdeographic",
    "viewTarget",
    "visibility",
    "vMathematical",
    "widths",
    "wordSpacing",
    "writingMode",
    "x1",
    "x2",
    "x",
    "xChannelSelector",
    "xHeight",
    "xlinkActuate",
    "xlinkArcrole",
    "xlinkHref",
    "xlinkRole",
    "xlinkShow",
    "xlinkTitle",
    "xlinkType",
    "xmlBase",
    "xmlLang",
    "xmlns",
    "xmlnsXlink",
    "xmlSpace",
    "y1",
    "y2",
    "y",
    "yChannelSelector",
    "z",
    "zoomAndPan",
    "ref",
    "key",
    "angle",
  ],
  vd = ["points", "pathLength"],
  Cu = { svg: P_, polygon: vd, polyline: vd },
  up = [
    "dangerouslySetInnerHTML",
    "onCopy",
    "onCopyCapture",
    "onCut",
    "onCutCapture",
    "onPaste",
    "onPasteCapture",
    "onCompositionEnd",
    "onCompositionEndCapture",
    "onCompositionStart",
    "onCompositionStartCapture",
    "onCompositionUpdate",
    "onCompositionUpdateCapture",
    "onFocus",
    "onFocusCapture",
    "onBlur",
    "onBlurCapture",
    "onChange",
    "onChangeCapture",
    "onBeforeInput",
    "onBeforeInputCapture",
    "onInput",
    "onInputCapture",
    "onReset",
    "onResetCapture",
    "onSubmit",
    "onSubmitCapture",
    "onInvalid",
    "onInvalidCapture",
    "onLoad",
    "onLoadCapture",
    "onError",
    "onErrorCapture",
    "onKeyDown",
    "onKeyDownCapture",
    "onKeyPress",
    "onKeyPressCapture",
    "onKeyUp",
    "onKeyUpCapture",
    "onAbort",
    "onAbortCapture",
    "onCanPlay",
    "onCanPlayCapture",
    "onCanPlayThrough",
    "onCanPlayThroughCapture",
    "onDurationChange",
    "onDurationChangeCapture",
    "onEmptied",
    "onEmptiedCapture",
    "onEncrypted",
    "onEncryptedCapture",
    "onEnded",
    "onEndedCapture",
    "onLoadedData",
    "onLoadedDataCapture",
    "onLoadedMetadata",
    "onLoadedMetadataCapture",
    "onLoadStart",
    "onLoadStartCapture",
    "onPause",
    "onPauseCapture",
    "onPlay",
    "onPlayCapture",
    "onPlaying",
    "onPlayingCapture",
    "onProgress",
    "onProgressCapture",
    "onRateChange",
    "onRateChangeCapture",
    "onSeeked",
    "onSeekedCapture",
    "onSeeking",
    "onSeekingCapture",
    "onStalled",
    "onStalledCapture",
    "onSuspend",
    "onSuspendCapture",
    "onTimeUpdate",
    "onTimeUpdateCapture",
    "onVolumeChange",
    "onVolumeChangeCapture",
    "onWaiting",
    "onWaitingCapture",
    "onAuxClick",
    "onAuxClickCapture",
    "onClick",
    "onClickCapture",
    "onContextMenu",
    "onContextMenuCapture",
    "onDoubleClick",
    "onDoubleClickCapture",
    "onDrag",
    "onDragCapture",
    "onDragEnd",
    "onDragEndCapture",
    "onDragEnter",
    "onDragEnterCapture",
    "onDragExit",
    "onDragExitCapture",
    "onDragLeave",
    "onDragLeaveCapture",
    "onDragOver",
    "onDragOverCapture",
    "onDragStart",
    "onDragStartCapture",
    "onDrop",
    "onDropCapture",
    "onMouseDown",
    "onMouseDownCapture",
    "onMouseEnter",
    "onMouseLeave",
    "onMouseMove",
    "onMouseMoveCapture",
    "onMouseOut",
    "onMouseOutCapture",
    "onMouseOver",
    "onMouseOverCapture",
    "onMouseUp",
    "onMouseUpCapture",
    "onSelect",
    "onSelectCapture",
    "onTouchCancel",
    "onTouchCancelCapture",
    "onTouchEnd",
    "onTouchEndCapture",
    "onTouchMove",
    "onTouchMoveCapture",
    "onTouchStart",
    "onTouchStartCapture",
    "onPointerDown",
    "onPointerDownCapture",
    "onPointerMove",
    "onPointerMoveCapture",
    "onPointerUp",
    "onPointerUpCapture",
    "onPointerCancel",
    "onPointerCancelCapture",
    "onPointerEnter",
    "onPointerEnterCapture",
    "onPointerLeave",
    "onPointerLeaveCapture",
    "onPointerOver",
    "onPointerOverCapture",
    "onPointerOut",
    "onPointerOutCapture",
    "onGotPointerCapture",
    "onGotPointerCaptureCapture",
    "onLostPointerCapture",
    "onLostPointerCaptureCapture",
    "onScroll",
    "onScrollCapture",
    "onWheel",
    "onWheelCapture",
    "onAnimationStart",
    "onAnimationStartCapture",
    "onAnimationEnd",
    "onAnimationEndCapture",
    "onAnimationIteration",
    "onAnimationIterationCapture",
    "onTransitionEnd",
    "onTransitionEndCapture",
  ],
  Wi = function (t, r) {
    if (!t || typeof t == "function" || typeof t == "boolean") return null;
    var n = t;
    if ((L.isValidElement(t) && (n = t.props), !cn(n))) return null;
    var i = {};
    return (
      Object.keys(n).forEach(function (a) {
        up.includes(a) &&
          (i[a] =
            r ||
            function (o) {
              return n[a](n, o);
            });
      }),
      i
    );
  },
  E_ = function (t, r, n) {
    return function (i) {
      return (t(r, n, i), null);
    };
  },
  cr = function (t, r, n) {
    if (!cn(t) || Ml(t) !== "object") return null;
    var i = null;
    return (
      Object.keys(t).forEach(function (a) {
        var o = t[a];
        up.includes(a) && typeof o == "function" && (i || (i = {}), (i[a] = E_(o, r, n)));
      }),
      i
    );
  },
  j_ = ["children"],
  $_ = ["children"];
function yd(e, t) {
  if (e == null) return {};
  var r = M_(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function M_(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Cl(e) {
  "@babel/helpers - typeof";
  return (
    (Cl =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Cl(e)
  );
}
var md = {
    click: "onClick",
    mousedown: "onMouseDown",
    mouseup: "onMouseUp",
    mouseover: "onMouseOver",
    mousemove: "onMouseMove",
    mouseout: "onMouseOut",
    mouseenter: "onMouseEnter",
    mouseleave: "onMouseLeave",
    touchcancel: "onTouchCancel",
    touchend: "onTouchEnd",
    touchmove: "onTouchMove",
    touchstart: "onTouchStart",
    contextmenu: "onContextMenu",
    dblclick: "onDoubleClick",
  },
  At = function (t) {
    return typeof t == "string" ? t : t ? t.displayName || t.name || "Component" : "";
  },
  gd = null,
  Iu = null,
  cp = function e(t) {
    if (t === gd && Array.isArray(Iu)) return Iu;
    var r = [];
    return (
      L.Children.forEach(t, function (n) {
        J(n) || (m_.isFragment(n) ? (r = r.concat(e(n.props.children))) : r.push(n));
      }),
      (Iu = r),
      (gd = t),
      r
    );
  };
function Xe(e, t) {
  var r = [],
    n = [];
  return (
    Array.isArray(t)
      ? (n = t.map(function (i) {
          return At(i);
        }))
      : (n = [At(t)]),
    cp(e).forEach(function (i) {
      var a = Ve(i, "type.displayName") || Ve(i, "type.name");
      n.indexOf(a) !== -1 && r.push(i);
    }),
    r
  );
}
function Ke(e, t) {
  var r = Xe(e, t);
  return r && r[0];
}
var bd = function (t) {
    if (!t || !t.props) return !1;
    var r = t.props,
      n = r.width,
      i = r.height;
    return !(!B(n) || n <= 0 || !B(i) || i <= 0);
  },
  C_ = [
    "a",
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animate",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColormatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "font",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-url",
    "foreignObject",
    "g",
    "glyph",
    "glyphRef",
    "hkern",
    "image",
    "line",
    "lineGradient",
    "marker",
    "mask",
    "metadata",
    "missing-glyph",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "script",
    "set",
    "stop",
    "style",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "title",
    "tref",
    "tspan",
    "use",
    "view",
    "vkern",
  ],
  I_ = function (t) {
    return t && t.type && ur(t.type) && C_.indexOf(t.type) >= 0;
  },
  y0 = function (t) {
    return t && Cl(t) === "object" && "clipDot" in t;
  },
  R_ = function (t, r, n, i) {
    var a,
      o = (a = Cu?.[i]) !== null && a !== void 0 ? a : [];
    return (
      r.startsWith("data-") ||
      (!Z(t) && ((i && o.includes(r)) || T_.includes(r))) ||
      (n && up.includes(r))
    );
  },
  V = function (t, r, n) {
    if (!t || typeof t == "function" || typeof t == "boolean") return null;
    var i = t;
    if ((L.isValidElement(t) && (i = t.props), !cn(i))) return null;
    var a = {};
    return (
      Object.keys(i).forEach(function (o) {
        var u;
        R_((u = i) === null || u === void 0 ? void 0 : u[o], o, r, n) && (a[o] = i[o]);
      }),
      a
    );
  },
  Il = function e(t, r) {
    if (t === r) return !0;
    var n = L.Children.count(t);
    if (n !== L.Children.count(r)) return !1;
    if (n === 0) return !0;
    if (n === 1) return xd(Array.isArray(t) ? t[0] : t, Array.isArray(r) ? r[0] : r);
    for (var i = 0; i < n; i++) {
      var a = t[i],
        o = r[i];
      if (Array.isArray(a) || Array.isArray(o)) {
        if (!e(a, o)) return !1;
      } else if (!xd(a, o)) return !1;
    }
    return !0;
  },
  xd = function (t, r) {
    if (J(t) && J(r)) return !0;
    if (!J(t) && !J(r)) {
      var n = t.props || {},
        i = n.children,
        a = yd(n, j_),
        o = r.props || {},
        u = o.children,
        c = yd(o, $_);
      return i && u ? $r(a, c) && Il(i, u) : !i && !u ? $r(a, c) : !1;
    }
    return !1;
  },
  wd = function (t, r) {
    var n = [],
      i = {};
    return (
      cp(t).forEach(function (a, o) {
        if (I_(a)) n.push(a);
        else if (a) {
          var u = At(a.type),
            c = r[u] || {},
            s = c.handler,
            l = c.once;
          if (s && (!l || !i[u])) {
            var f = s(a, u, o);
            (n.push(f), (i[u] = !0));
          }
        }
      }),
      n
    );
  },
  k_ = function (t) {
    var r = t && t.type;
    return r && md[r] ? md[r] : null;
  },
  D_ = function (t, r) {
    return cp(r).indexOf(t);
  },
  N_ = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
function Rl() {
  return (
    (Rl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Rl.apply(this, arguments)
  );
}
function q_(e, t) {
  if (e == null) return {};
  var r = L_(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function L_(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function kl(e) {
  var t = e.children,
    r = e.width,
    n = e.height,
    i = e.viewBox,
    a = e.className,
    o = e.style,
    u = e.title,
    c = e.desc,
    s = q_(e, N_),
    l = i || { width: r, height: n, x: 0, y: 0 },
    f = te("recharts-surface", a);
  return S.createElement(
    "svg",
    Rl({}, V(s, !0, "svg"), {
      className: f,
      width: r,
      height: n,
      style: o,
      viewBox: "".concat(l.x, " ").concat(l.y, " ").concat(l.width, " ").concat(l.height),
    }),
    S.createElement("title", null, u),
    S.createElement("desc", null, c),
    t,
  );
}
var B_ = ["children", "className"];
function Dl() {
  return (
    (Dl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Dl.apply(this, arguments)
  );
}
function F_(e, t) {
  if (e == null) return {};
  var r = U_(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function U_(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var ie = S.forwardRef(function (e, t) {
    var r = e.children,
      n = e.className,
      i = F_(e, B_),
      a = te("recharts-layer", n);
    return S.createElement("g", Dl({ className: a }, V(i, !0), { ref: t }), r);
  }),
  ut = function (t, r) {
    for (var n = arguments.length, i = new Array(n > 2 ? n - 2 : 0), a = 2; a < n; a++)
      i[a - 2] = arguments[a];
  },
  Ru,
  Od;
function W_() {
  if (Od) return Ru;
  Od = 1;
  function e(t, r, n) {
    var i = -1,
      a = t.length;
    (r < 0 && (r = -r > a ? 0 : a + r),
      (n = n > a ? a : n),
      n < 0 && (n += a),
      (a = r > n ? 0 : (n - r) >>> 0),
      (r >>>= 0));
    for (var o = Array(a); ++i < a; ) o[i] = t[i + r];
    return o;
  }
  return ((Ru = e), Ru);
}
var ku, _d;
function z_() {
  if (_d) return ku;
  _d = 1;
  var e = W_();
  function t(r, n, i) {
    var a = r.length;
    return ((i = i === void 0 ? a : i), !n && i >= a ? r : e(r, n, i));
  }
  return ((ku = t), ku);
}
var Du, Ad;
function m0() {
  if (Ad) return Du;
  Ad = 1;
  var e = "\\ud800-\\udfff",
    t = "\\u0300-\\u036f",
    r = "\\ufe20-\\ufe2f",
    n = "\\u20d0-\\u20ff",
    i = t + r + n,
    a = "\\ufe0e\\ufe0f",
    o = "\\u200d",
    u = RegExp("[" + o + e + i + a + "]");
  function c(s) {
    return u.test(s);
  }
  return ((Du = c), Du);
}
var Nu, Sd;
function H_() {
  if (Sd) return Nu;
  Sd = 1;
  function e(t) {
    return t.split("");
  }
  return ((Nu = e), Nu);
}
var qu, Pd;
function K_() {
  if (Pd) return qu;
  Pd = 1;
  var e = "\\ud800-\\udfff",
    t = "\\u0300-\\u036f",
    r = "\\ufe20-\\ufe2f",
    n = "\\u20d0-\\u20ff",
    i = t + r + n,
    a = "\\ufe0e\\ufe0f",
    o = "[" + e + "]",
    u = "[" + i + "]",
    c = "\\ud83c[\\udffb-\\udfff]",
    s = "(?:" + u + "|" + c + ")",
    l = "[^" + e + "]",
    f = "(?:\\ud83c[\\udde6-\\uddff]){2}",
    p = "[\\ud800-\\udbff][\\udc00-\\udfff]",
    d = "\\u200d",
    y = s + "?",
    v = "[" + a + "]?",
    h = "(?:" + d + "(?:" + [l, f, p].join("|") + ")" + v + y + ")*",
    g = v + y + h,
    x = "(?:" + [l + u + "?", u, f, p, o].join("|") + ")",
    w = RegExp(c + "(?=" + c + ")|" + x + g, "g");
  function O(m) {
    return m.match(w) || [];
  }
  return ((qu = O), qu);
}
var Lu, Td;
function G_() {
  if (Td) return Lu;
  Td = 1;
  var e = H_(),
    t = m0(),
    r = K_();
  function n(i) {
    return t(i) ? r(i) : e(i);
  }
  return ((Lu = n), Lu);
}
var Bu, Ed;
function V_() {
  if (Ed) return Bu;
  Ed = 1;
  var e = z_(),
    t = m0(),
    r = G_(),
    n = p0();
  function i(a) {
    return function (o) {
      o = n(o);
      var u = t(o) ? r(o) : void 0,
        c = u ? u[0] : o.charAt(0),
        s = u ? e(u, 1).join("") : o.slice(1);
      return c[a]() + s;
    };
  }
  return ((Bu = i), Bu);
}
var Fu, jd;
function X_() {
  if (jd) return Fu;
  jd = 1;
  var e = V_(),
    t = e("toUpperCase");
  return ((Fu = t), Fu);
}
var Y_ = X_();
const Va = le(Y_);
function de(e) {
  return function () {
    return e;
  };
}
const g0 = Math.cos,
  zi = Math.sin,
  st = Math.sqrt,
  Hi = Math.PI,
  Xa = 2 * Hi,
  Nl = Math.PI,
  ql = 2 * Nl,
  Yt = 1e-6,
  Z_ = ql - Yt;
function b0(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t) this._ += arguments[t] + e[t];
}
function J_(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return b0;
  const r = 10 ** t;
  return function (n) {
    this._ += n[0];
    for (let i = 1, a = n.length; i < a; ++i) this._ += Math.round(arguments[i] * r) / r + n[i];
  };
}
class Q_ {
  constructor(t) {
    ((this._x0 = this._y0 = this._x1 = this._y1 = null),
      (this._ = ""),
      (this._append = t == null ? b0 : J_(t)));
  }
  moveTo(t, r) {
    this._append`M${(this._x0 = this._x1 = +t)},${(this._y0 = this._y1 = +r)}`;
  }
  closePath() {
    this._x1 !== null && ((this._x1 = this._x0), (this._y1 = this._y0), this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${(this._x1 = +t)},${(this._y1 = +r)}`;
  }
  quadraticCurveTo(t, r, n, i) {
    this._append`Q${+t},${+r},${(this._x1 = +n)},${(this._y1 = +i)}`;
  }
  bezierCurveTo(t, r, n, i, a, o) {
    this._append`C${+t},${+r},${+n},${+i},${(this._x1 = +a)},${(this._y1 = +o)}`;
  }
  arcTo(t, r, n, i, a) {
    if (((t = +t), (r = +r), (n = +n), (i = +i), (a = +a), a < 0))
      throw new Error(`negative radius: ${a}`);
    let o = this._x1,
      u = this._y1,
      c = n - t,
      s = i - r,
      l = o - t,
      f = u - r,
      p = l * l + f * f;
    if (this._x1 === null) this._append`M${(this._x1 = t)},${(this._y1 = r)}`;
    else if (p > Yt)
      if (!(Math.abs(f * c - s * l) > Yt) || !a) this._append`L${(this._x1 = t)},${(this._y1 = r)}`;
      else {
        let d = n - o,
          y = i - u,
          v = c * c + s * s,
          h = d * d + y * y,
          g = Math.sqrt(v),
          x = Math.sqrt(p),
          w = a * Math.tan((Nl - Math.acos((v + p - h) / (2 * g * x))) / 2),
          O = w / x,
          m = w / g;
        (Math.abs(O - 1) > Yt && this._append`L${t + O * l},${r + O * f}`,
          this
            ._append`A${a},${a},0,0,${+(f * d > l * y)},${(this._x1 = t + m * c)},${(this._y1 = r + m * s)}`);
      }
  }
  arc(t, r, n, i, a, o) {
    if (((t = +t), (r = +r), (n = +n), (o = !!o), n < 0)) throw new Error(`negative radius: ${n}`);
    let u = n * Math.cos(i),
      c = n * Math.sin(i),
      s = t + u,
      l = r + c,
      f = 1 ^ o,
      p = o ? i - a : a - i;
    (this._x1 === null
      ? this._append`M${s},${l}`
      : (Math.abs(this._x1 - s) > Yt || Math.abs(this._y1 - l) > Yt) && this._append`L${s},${l}`,
      n &&
        (p < 0 && (p = (p % ql) + ql),
        p > Z_
          ? this
              ._append`A${n},${n},0,1,${f},${t - u},${r - c}A${n},${n},0,1,${f},${(this._x1 = s)},${(this._y1 = l)}`
          : p > Yt &&
            this
              ._append`A${n},${n},0,${+(p >= Nl)},${f},${(this._x1 = t + n * Math.cos(a))},${(this._y1 = r + n * Math.sin(a))}`));
  }
  rect(t, r, n, i) {
    this
      ._append`M${(this._x0 = this._x1 = +t)},${(this._y0 = this._y1 = +r)}h${(n = +n)}v${+i}h${-n}Z`;
  }
  toString() {
    return this._;
  }
}
function sp(e) {
  let t = 3;
  return (
    (e.digits = function (r) {
      if (!arguments.length) return t;
      if (r == null) t = null;
      else {
        const n = Math.floor(r);
        if (!(n >= 0)) throw new RangeError(`invalid digits: ${r}`);
        t = n;
      }
      return e;
    }),
    () => new Q_(t)
  );
}
function lp(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function x0(e) {
  this._context = e;
}
x0.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    ((this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line));
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        ((this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(e, t);
        break;
    }
  },
};
function Ya(e) {
  return new x0(e);
}
function w0(e) {
  return e[0];
}
function O0(e) {
  return e[1];
}
function _0(e, t) {
  var r = de(!0),
    n = null,
    i = Ya,
    a = null,
    o = sp(u);
  ((e = typeof e == "function" ? e : e === void 0 ? w0 : de(e)),
    (t = typeof t == "function" ? t : t === void 0 ? O0 : de(t)));
  function u(c) {
    var s,
      l = (c = lp(c)).length,
      f,
      p = !1,
      d;
    for (n == null && (a = i((d = o()))), s = 0; s <= l; ++s)
      (!(s < l && r((f = c[s]), s, c)) === p && ((p = !p) ? a.lineStart() : a.lineEnd()),
        p && a.point(+e(f, s, c), +t(f, s, c)));
    if (d) return ((a = null), d + "" || null);
  }
  return (
    (u.x = function (c) {
      return arguments.length ? ((e = typeof c == "function" ? c : de(+c)), u) : e;
    }),
    (u.y = function (c) {
      return arguments.length ? ((t = typeof c == "function" ? c : de(+c)), u) : t;
    }),
    (u.defined = function (c) {
      return arguments.length ? ((r = typeof c == "function" ? c : de(!!c)), u) : r;
    }),
    (u.curve = function (c) {
      return arguments.length ? ((i = c), n != null && (a = i(n)), u) : i;
    }),
    (u.context = function (c) {
      return arguments.length ? (c == null ? (n = a = null) : (a = i((n = c))), u) : n;
    }),
    u
  );
}
function Ei(e, t, r) {
  var n = null,
    i = de(!0),
    a = null,
    o = Ya,
    u = null,
    c = sp(s);
  ((e = typeof e == "function" ? e : e === void 0 ? w0 : de(+e)),
    (t = typeof t == "function" ? t : de(t === void 0 ? 0 : +t)),
    (r = typeof r == "function" ? r : r === void 0 ? O0 : de(+r)));
  function s(f) {
    var p,
      d,
      y,
      v = (f = lp(f)).length,
      h,
      g = !1,
      x,
      w = new Array(v),
      O = new Array(v);
    for (a == null && (u = o((x = c()))), p = 0; p <= v; ++p) {
      if (!(p < v && i((h = f[p]), p, f)) === g)
        if ((g = !g)) ((d = p), u.areaStart(), u.lineStart());
        else {
          for (u.lineEnd(), u.lineStart(), y = p - 1; y >= d; --y) u.point(w[y], O[y]);
          (u.lineEnd(), u.areaEnd());
        }
      g &&
        ((w[p] = +e(h, p, f)),
        (O[p] = +t(h, p, f)),
        u.point(n ? +n(h, p, f) : w[p], r ? +r(h, p, f) : O[p]));
    }
    if (x) return ((u = null), x + "" || null);
  }
  function l() {
    return _0().defined(i).curve(o).context(a);
  }
  return (
    (s.x = function (f) {
      return arguments.length ? ((e = typeof f == "function" ? f : de(+f)), (n = null), s) : e;
    }),
    (s.x0 = function (f) {
      return arguments.length ? ((e = typeof f == "function" ? f : de(+f)), s) : e;
    }),
    (s.x1 = function (f) {
      return arguments.length
        ? ((n = f == null ? null : typeof f == "function" ? f : de(+f)), s)
        : n;
    }),
    (s.y = function (f) {
      return arguments.length ? ((t = typeof f == "function" ? f : de(+f)), (r = null), s) : t;
    }),
    (s.y0 = function (f) {
      return arguments.length ? ((t = typeof f == "function" ? f : de(+f)), s) : t;
    }),
    (s.y1 = function (f) {
      return arguments.length
        ? ((r = f == null ? null : typeof f == "function" ? f : de(+f)), s)
        : r;
    }),
    (s.lineX0 = s.lineY0 =
      function () {
        return l().x(e).y(t);
      }),
    (s.lineY1 = function () {
      return l().x(e).y(r);
    }),
    (s.lineX1 = function () {
      return l().x(n).y(t);
    }),
    (s.defined = function (f) {
      return arguments.length ? ((i = typeof f == "function" ? f : de(!!f)), s) : i;
    }),
    (s.curve = function (f) {
      return arguments.length ? ((o = f), a != null && (u = o(a)), s) : o;
    }),
    (s.context = function (f) {
      return arguments.length ? (f == null ? (a = u = null) : (u = o((a = f))), s) : a;
    }),
    s
  );
}
class A0 {
  constructor(t, r) {
    ((this._context = t), (this._x = r));
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    ((this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line));
  }
  point(t, r) {
    switch (((t = +t), (r = +r), this._point)) {
      case 0: {
        ((this._point = 1), this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r));
        break;
      }
      case 1:
        this._point = 2;
      default: {
        this._x
          ? this._context.bezierCurveTo(
              (this._x0 = (this._x0 + t) / 2),
              this._y0,
              this._x0,
              r,
              t,
              r,
            )
          : this._context.bezierCurveTo(
              this._x0,
              (this._y0 = (this._y0 + r) / 2),
              t,
              this._y0,
              t,
              r,
            );
        break;
      }
    }
    ((this._x0 = t), (this._y0 = r));
  }
}
function eA(e) {
  return new A0(e, !0);
}
function tA(e) {
  return new A0(e, !1);
}
const fp = {
    draw(e, t) {
      const r = st(t / Hi);
      (e.moveTo(r, 0), e.arc(0, 0, r, 0, Xa));
    },
  },
  rA = {
    draw(e, t) {
      const r = st(t / 5) / 2;
      (e.moveTo(-3 * r, -r),
        e.lineTo(-r, -r),
        e.lineTo(-r, -3 * r),
        e.lineTo(r, -3 * r),
        e.lineTo(r, -r),
        e.lineTo(3 * r, -r),
        e.lineTo(3 * r, r),
        e.lineTo(r, r),
        e.lineTo(r, 3 * r),
        e.lineTo(-r, 3 * r),
        e.lineTo(-r, r),
        e.lineTo(-3 * r, r),
        e.closePath());
    },
  },
  S0 = st(1 / 3),
  nA = S0 * 2,
  iA = {
    draw(e, t) {
      const r = st(t / nA),
        n = r * S0;
      (e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath());
    },
  },
  aA = {
    draw(e, t) {
      const r = st(t),
        n = -r / 2;
      e.rect(n, n, r, r);
    },
  },
  oA = 0.8908130915292852,
  P0 = zi(Hi / 10) / zi((7 * Hi) / 10),
  uA = zi(Xa / 10) * P0,
  cA = -g0(Xa / 10) * P0,
  sA = {
    draw(e, t) {
      const r = st(t * oA),
        n = uA * r,
        i = cA * r;
      (e.moveTo(0, -r), e.lineTo(n, i));
      for (let a = 1; a < 5; ++a) {
        const o = (Xa * a) / 5,
          u = g0(o),
          c = zi(o);
        (e.lineTo(c * r, -u * r), e.lineTo(u * n - c * i, c * n + u * i));
      }
      e.closePath();
    },
  },
  Uu = st(3),
  lA = {
    draw(e, t) {
      const r = -st(t / (Uu * 3));
      (e.moveTo(0, r * 2), e.lineTo(-Uu * r, -r), e.lineTo(Uu * r, -r), e.closePath());
    },
  },
  Ye = -0.5,
  Ze = st(3) / 2,
  Ll = 1 / st(12),
  fA = (Ll / 2 + 1) * 3,
  pA = {
    draw(e, t) {
      const r = st(t / fA),
        n = r / 2,
        i = r * Ll,
        a = n,
        o = r * Ll + r,
        u = -a,
        c = o;
      (e.moveTo(n, i),
        e.lineTo(a, o),
        e.lineTo(u, c),
        e.lineTo(Ye * n - Ze * i, Ze * n + Ye * i),
        e.lineTo(Ye * a - Ze * o, Ze * a + Ye * o),
        e.lineTo(Ye * u - Ze * c, Ze * u + Ye * c),
        e.lineTo(Ye * n + Ze * i, Ye * i - Ze * n),
        e.lineTo(Ye * a + Ze * o, Ye * o - Ze * a),
        e.lineTo(Ye * u + Ze * c, Ye * c - Ze * u),
        e.closePath());
    },
  };
function hA(e, t) {
  let r = null,
    n = sp(i);
  ((e = typeof e == "function" ? e : de(e || fp)),
    (t = typeof t == "function" ? t : de(t === void 0 ? 64 : +t)));
  function i() {
    let a;
    if ((r || (r = a = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), a))
      return ((r = null), a + "" || null);
  }
  return (
    (i.type = function (a) {
      return arguments.length ? ((e = typeof a == "function" ? a : de(a)), i) : e;
    }),
    (i.size = function (a) {
      return arguments.length ? ((t = typeof a == "function" ? a : de(+a)), i) : t;
    }),
    (i.context = function (a) {
      return arguments.length ? ((r = a ?? null), i) : r;
    }),
    i
  );
}
function Ki() {}
function Gi(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6,
  );
}
function T0(e) {
  this._context = e;
}
T0.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0));
  },
  lineEnd: function () {
    switch (this._point) {
      case 3:
        Gi(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    ((this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line));
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        ((this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        ((this._point = 3),
          this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6));
      default:
        Gi(this, e, t);
        break;
    }
    ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t));
  },
};
function dA(e) {
  return new T0(e);
}
function E0(e) {
  this._context = e;
}
E0.prototype = {
  areaStart: Ki,
  areaEnd: Ki,
  lineStart: function () {
    ((this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
        NaN),
      (this._point = 0));
  },
  lineEnd: function () {
    switch (this._point) {
      case 1: {
        (this._context.moveTo(this._x2, this._y2), this._context.closePath());
        break;
      }
      case 2: {
        (this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3),
          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3),
          this._context.closePath());
        break;
      }
      case 3: {
        (this.point(this._x2, this._y2),
          this.point(this._x3, this._y3),
          this.point(this._x4, this._y4));
        break;
      }
    }
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        ((this._point = 1), (this._x2 = e), (this._y2 = t));
        break;
      case 1:
        ((this._point = 2), (this._x3 = e), (this._y3 = t));
        break;
      case 2:
        ((this._point = 3),
          (this._x4 = e),
          (this._y4 = t),
          this._context.moveTo(
            (this._x0 + 4 * this._x1 + e) / 6,
            (this._y0 + 4 * this._y1 + t) / 6,
          ));
        break;
      default:
        Gi(this, e, t);
        break;
    }
    ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t));
  },
};
function vA(e) {
  return new E0(e);
}
function j0(e) {
  this._context = e;
}
j0.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x0 = this._x1 = this._y0 = this._y1 = NaN), (this._point = 0));
  },
  lineEnd: function () {
    ((this._line || (this._line !== 0 && this._point === 3)) && this._context.closePath(),
      (this._line = 1 - this._line));
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var r = (this._x0 + 4 * this._x1 + e) / 6,
          n = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(r, n) : this._context.moveTo(r, n);
        break;
      case 3:
        this._point = 4;
      default:
        Gi(this, e, t);
        break;
    }
    ((this._x0 = this._x1), (this._x1 = e), (this._y0 = this._y1), (this._y1 = t));
  },
};
function yA(e) {
  return new j0(e);
}
function $0(e) {
  this._context = e;
}
$0.prototype = {
  areaStart: Ki,
  areaEnd: Ki,
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    this._point && this._context.closePath();
  },
  point: function (e, t) {
    ((e = +e),
      (t = +t),
      this._point ? this._context.lineTo(e, t) : ((this._point = 1), this._context.moveTo(e, t)));
  },
};
function mA(e) {
  return new $0(e);
}
function $d(e) {
  return e < 0 ? -1 : 1;
}
function Md(e, t, r) {
  var n = e._x1 - e._x0,
    i = t - e._x1,
    a = (e._y1 - e._y0) / (n || (i < 0 && -0)),
    o = (r - e._y1) / (i || (n < 0 && -0)),
    u = (a * i + o * n) / (n + i);
  return ($d(a) + $d(o)) * Math.min(Math.abs(a), Math.abs(o), 0.5 * Math.abs(u)) || 0;
}
function Cd(e, t) {
  var r = e._x1 - e._x0;
  return r ? ((3 * (e._y1 - e._y0)) / r - t) / 2 : t;
}
function Wu(e, t, r) {
  var n = e._x0,
    i = e._y0,
    a = e._x1,
    o = e._y1,
    u = (a - n) / 3;
  e._context.bezierCurveTo(n + u, i + u * t, a - u, o - u * r, a, o);
}
function Vi(e) {
  this._context = e;
}
Vi.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN), (this._point = 0));
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        Wu(this, this._t0, Cd(this, this._t0));
        break;
    }
    ((this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      (this._line = 1 - this._line));
  },
  point: function (e, t) {
    var r = NaN;
    if (((e = +e), (t = +t), !(e === this._x1 && t === this._y1))) {
      switch (this._point) {
        case 0:
          ((this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          ((this._point = 3), Wu(this, Cd(this, (r = Md(this, e, t))), r));
          break;
        default:
          Wu(this, this._t0, (r = Md(this, e, t)));
          break;
      }
      ((this._x0 = this._x1),
        (this._x1 = e),
        (this._y0 = this._y1),
        (this._y1 = t),
        (this._t0 = r));
    }
  },
};
function M0(e) {
  this._context = new C0(e);
}
(M0.prototype = Object.create(Vi.prototype)).point = function (e, t) {
  Vi.prototype.point.call(this, t, e);
};
function C0(e) {
  this._context = e;
}
C0.prototype = {
  moveTo: function (e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function () {
    this._context.closePath();
  },
  lineTo: function (e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function (e, t, r, n, i, a) {
    this._context.bezierCurveTo(t, e, n, r, a, i);
  },
};
function gA(e) {
  return new Vi(e);
}
function bA(e) {
  return new M0(e);
}
function I0(e) {
  this._context = e;
}
I0.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x = []), (this._y = []));
  },
  lineEnd: function () {
    var e = this._x,
      t = this._y,
      r = e.length;
    if (r)
      if (
        (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2)
      )
        this._context.lineTo(e[1], t[1]);
      else
        for (var n = Id(e), i = Id(t), a = 0, o = 1; o < r; ++a, ++o)
          this._context.bezierCurveTo(n[0][a], i[0][a], n[1][a], i[1][a], e[o], t[o]);
    ((this._line || (this._line !== 0 && r === 1)) && this._context.closePath(),
      (this._line = 1 - this._line),
      (this._x = this._y = null));
  },
  point: function (e, t) {
    (this._x.push(+e), this._y.push(+t));
  },
};
function Id(e) {
  var t,
    r = e.length - 1,
    n,
    i = new Array(r),
    a = new Array(r),
    o = new Array(r);
  for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t)
    ((i[t] = 1), (a[t] = 4), (o[t] = 4 * e[t] + 2 * e[t + 1]));
  for (i[r - 1] = 2, a[r - 1] = 7, o[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t)
    ((n = i[t] / a[t - 1]), (a[t] -= n), (o[t] -= n * o[t - 1]));
  for (i[r - 1] = o[r - 1] / a[r - 1], t = r - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
  for (a[r - 1] = (e[r] + i[r - 1]) / 2, t = 0; t < r - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
  return [i, a];
}
function xA(e) {
  return new I0(e);
}
function Za(e, t) {
  ((this._context = e), (this._t = t));
}
Za.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    ((this._x = this._y = NaN), (this._point = 0));
  },
  lineEnd: function () {
    (0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y),
      (this._line || (this._line !== 0 && this._point === 1)) && this._context.closePath(),
      this._line >= 0 && ((this._t = 1 - this._t), (this._line = 1 - this._line)));
  },
  point: function (e, t) {
    switch (((e = +e), (t = +t), this._point)) {
      case 0:
        ((this._point = 1), this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t));
        break;
      case 1:
        this._point = 2;
      default: {
        if (this._t <= 0) (this._context.lineTo(this._x, t), this._context.lineTo(e, t));
        else {
          var r = this._x * (1 - this._t) + e * this._t;
          (this._context.lineTo(r, this._y), this._context.lineTo(r, t));
        }
        break;
      }
    }
    ((this._x = e), (this._y = t));
  },
};
function wA(e) {
  return new Za(e, 0.5);
}
function OA(e) {
  return new Za(e, 0);
}
function _A(e) {
  return new Za(e, 1);
}
function Rr(e, t) {
  if ((o = e.length) > 1)
    for (var r = 1, n, i, a = e[t[0]], o, u = a.length; r < o; ++r)
      for (i = a, a = e[t[r]], n = 0; n < u; ++n)
        a[n][1] += a[n][0] = isNaN(i[n][1]) ? i[n][0] : i[n][1];
}
function Bl(e) {
  for (var t = e.length, r = new Array(t); --t >= 0; ) r[t] = t;
  return r;
}
function AA(e, t) {
  return e[t];
}
function SA(e) {
  const t = [];
  return ((t.key = e), t);
}
function PA() {
  var e = de([]),
    t = Bl,
    r = Rr,
    n = AA;
  function i(a) {
    var o = Array.from(e.apply(this, arguments), SA),
      u,
      c = o.length,
      s = -1,
      l;
    for (const f of a) for (u = 0, ++s; u < c; ++u) (o[u][s] = [0, +n(f, o[u].key, s, a)]).data = f;
    for (u = 0, l = lp(t(o)); u < c; ++u) o[l[u]].index = u;
    return (r(o, l), o);
  }
  return (
    (i.keys = function (a) {
      return arguments.length ? ((e = typeof a == "function" ? a : de(Array.from(a))), i) : e;
    }),
    (i.value = function (a) {
      return arguments.length ? ((n = typeof a == "function" ? a : de(+a)), i) : n;
    }),
    (i.order = function (a) {
      return arguments.length
        ? ((t = a == null ? Bl : typeof a == "function" ? a : de(Array.from(a))), i)
        : t;
    }),
    (i.offset = function (a) {
      return arguments.length ? ((r = a ?? Rr), i) : r;
    }),
    i
  );
}
function TA(e, t) {
  if ((n = e.length) > 0) {
    for (var r, n, i = 0, a = e[0].length, o; i < a; ++i) {
      for (o = r = 0; r < n; ++r) o += e[r][i][1] || 0;
      if (o) for (r = 0; r < n; ++r) e[r][i][1] /= o;
    }
    Rr(e, t);
  }
}
function EA(e, t) {
  if ((i = e.length) > 0) {
    for (var r = 0, n = e[t[0]], i, a = n.length; r < a; ++r) {
      for (var o = 0, u = 0; o < i; ++o) u += e[o][r][1] || 0;
      n[r][1] += n[r][0] = -u / 2;
    }
    Rr(e, t);
  }
}
function jA(e, t) {
  if (!(!((o = e.length) > 0) || !((a = (i = e[t[0]]).length) > 0))) {
    for (var r = 0, n = 1, i, a, o; n < a; ++n) {
      for (var u = 0, c = 0, s = 0; u < o; ++u) {
        for (
          var l = e[t[u]], f = l[n][1] || 0, p = l[n - 1][1] || 0, d = (f - p) / 2, y = 0;
          y < u;
          ++y
        ) {
          var v = e[t[y]],
            h = v[n][1] || 0,
            g = v[n - 1][1] || 0;
          d += h - g;
        }
        ((c += f), (s += d * f));
      }
      ((i[n - 1][1] += i[n - 1][0] = r), c && (r -= s / c));
    }
    ((i[n - 1][1] += i[n - 1][0] = r), Rr(e, t));
  }
}
function kn(e) {
  "@babel/helpers - typeof";
  return (
    (kn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    kn(e)
  );
}
var $A = ["type", "size", "sizeType"];
function Fl() {
  return (
    (Fl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Fl.apply(this, arguments)
  );
}
function Rd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function kd(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Rd(Object(r), !0).forEach(function (n) {
          MA(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Rd(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function MA(e, t, r) {
  return (
    (t = CA(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function CA(e) {
  var t = IA(e, "string");
  return kn(t) == "symbol" ? t : t + "";
}
function IA(e, t) {
  if (kn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (kn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function RA(e, t) {
  if (e == null) return {};
  var r = kA(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function kA(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var R0 = {
    symbolCircle: fp,
    symbolCross: rA,
    symbolDiamond: iA,
    symbolSquare: aA,
    symbolStar: sA,
    symbolTriangle: lA,
    symbolWye: pA,
  },
  DA = Math.PI / 180,
  NA = function (t) {
    var r = "symbol".concat(Va(t));
    return R0[r] || fp;
  },
  qA = function (t, r, n) {
    if (r === "area") return t;
    switch (n) {
      case "cross":
        return (5 * t * t) / 9;
      case "diamond":
        return (0.5 * t * t) / Math.sqrt(3);
      case "square":
        return t * t;
      case "star": {
        var i = 18 * DA;
        return 1.25 * t * t * (Math.tan(i) - Math.tan(i * 2) * Math.pow(Math.tan(i), 2));
      }
      case "triangle":
        return (Math.sqrt(3) * t * t) / 4;
      case "wye":
        return ((21 - 10 * Math.sqrt(3)) * t * t) / 8;
      default:
        return (Math.PI * t * t) / 4;
    }
  },
  LA = function (t, r) {
    R0["symbol".concat(Va(t))] = r;
  },
  pp = function (t) {
    var r = t.type,
      n = r === void 0 ? "circle" : r,
      i = t.size,
      a = i === void 0 ? 64 : i,
      o = t.sizeType,
      u = o === void 0 ? "area" : o,
      c = RA(t, $A),
      s = kd(kd({}, c), {}, { type: n, size: a, sizeType: u }),
      l = function () {
        var h = NA(n),
          g = hA()
            .type(h)
            .size(qA(a, u, n));
        return g();
      },
      f = s.className,
      p = s.cx,
      d = s.cy,
      y = V(s, !0);
    return p === +p && d === +d && a === +a
      ? S.createElement(
          "path",
          Fl({}, y, {
            className: te("recharts-symbols", f),
            transform: "translate(".concat(p, ", ").concat(d, ")"),
            d: l(),
          }),
        )
      : null;
  };
pp.registerSymbol = LA;
function kr(e) {
  "@babel/helpers - typeof";
  return (
    (kr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    kr(e)
  );
}
function Ul() {
  return (
    (Ul = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Ul.apply(this, arguments)
  );
}
function Dd(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function BA(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Dd(Object(r), !0).forEach(function (n) {
          Dn(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Dd(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function FA(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function UA(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, D0(n.key), n));
  }
}
function WA(e, t, r) {
  return (t && UA(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function zA(e, t, r) {
  return (
    (t = Xi(t)),
    HA(e, k0() ? Reflect.construct(t, r || [], Xi(e).constructor) : t.apply(e, r))
  );
}
function HA(e, t) {
  if (t && (kr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return KA(e);
}
function KA(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function k0() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (k0 = function () {
    return !!e;
  })();
}
function Xi(e) {
  return (
    (Xi = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Xi(e)
  );
}
function GA(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Wl(e, t));
}
function Wl(e, t) {
  return (
    (Wl = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Wl(e, t)
  );
}
function Dn(e, t, r) {
  return (
    (t = D0(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function D0(e) {
  var t = VA(e, "string");
  return kr(t) == "symbol" ? t : t + "";
}
function VA(e, t) {
  if (kr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (kr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Je = 32,
  hp = (function (e) {
    function t() {
      return (FA(this, t), zA(this, t, arguments));
    }
    return (
      GA(t, e),
      WA(t, [
        {
          key: "renderIcon",
          value: function (n) {
            var i = this.props.inactiveColor,
              a = Je / 2,
              o = Je / 6,
              u = Je / 3,
              c = n.inactive ? i : n.color;
            if (n.type === "plainline")
              return S.createElement("line", {
                strokeWidth: 4,
                fill: "none",
                stroke: c,
                strokeDasharray: n.payload.strokeDasharray,
                x1: 0,
                y1: a,
                x2: Je,
                y2: a,
                className: "recharts-legend-icon",
              });
            if (n.type === "line")
              return S.createElement("path", {
                strokeWidth: 4,
                fill: "none",
                stroke: c,
                d: "M0,"
                  .concat(a, "h")
                  .concat(
                    u,
                    `
            A`,
                  )
                  .concat(o, ",")
                  .concat(o, ",0,1,1,")
                  .concat(2 * u, ",")
                  .concat(
                    a,
                    `
            H`,
                  )
                  .concat(Je, "M")
                  .concat(2 * u, ",")
                  .concat(
                    a,
                    `
            A`,
                  )
                  .concat(o, ",")
                  .concat(o, ",0,1,1,")
                  .concat(u, ",")
                  .concat(a),
                className: "recharts-legend-icon",
              });
            if (n.type === "rect")
              return S.createElement("path", {
                stroke: "none",
                fill: c,
                d: "M0,"
                  .concat(Je / 8, "h")
                  .concat(Je, "v")
                  .concat((Je * 3) / 4, "h")
                  .concat(-Je, "z"),
                className: "recharts-legend-icon",
              });
            if (S.isValidElement(n.legendIcon)) {
              var s = BA({}, n);
              return (delete s.legendIcon, S.cloneElement(n.legendIcon, s));
            }
            return S.createElement(pp, {
              fill: c,
              cx: a,
              cy: a,
              size: Je,
              sizeType: "diameter",
              type: n.type,
            });
          },
        },
        {
          key: "renderItems",
          value: function () {
            var n = this,
              i = this.props,
              a = i.payload,
              o = i.iconSize,
              u = i.layout,
              c = i.formatter,
              s = i.inactiveColor,
              l = { x: 0, y: 0, width: Je, height: Je },
              f = { display: u === "horizontal" ? "inline-block" : "block", marginRight: 10 },
              p = { display: "inline-block", verticalAlign: "middle", marginRight: 4 };
            return a.map(function (d, y) {
              var v = d.formatter || c,
                h = te(
                  Dn(
                    Dn({ "recharts-legend-item": !0 }, "legend-item-".concat(y), !0),
                    "inactive",
                    d.inactive,
                  ),
                );
              if (d.type === "none") return null;
              var g = Z(d.value) ? null : d.value;
              ut(
                !Z(d.value),
                `The name property is also required when using a function for the dataKey of a chart's cartesian components. Ex: <Bar name="Name of my Data"/>`,
              );
              var x = d.inactive ? s : d.color;
              return S.createElement(
                "li",
                Ul({ className: h, style: f, key: "legend-item-".concat(y) }, cr(n.props, d, y)),
                S.createElement(kl, { width: o, height: o, viewBox: l, style: p }, n.renderIcon(d)),
                S.createElement(
                  "span",
                  { className: "recharts-legend-item-text", style: { color: x } },
                  v ? v(g, d, y) : g,
                ),
              );
            });
          },
        },
        {
          key: "render",
          value: function () {
            var n = this.props,
              i = n.payload,
              a = n.layout,
              o = n.align;
            if (!i || !i.length) return null;
            var u = { padding: 0, margin: 0, textAlign: a === "horizontal" ? o : "left" };
            return S.createElement(
              "ul",
              { className: "recharts-default-legend", style: u },
              this.renderItems(),
            );
          },
        },
      ])
    );
  })(L.PureComponent);
Dn(hp, "displayName", "Legend");
Dn(hp, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "middle",
  inactiveColor: "#ccc",
});
var zu, Nd;
function XA() {
  if (Nd) return zu;
  Nd = 1;
  var e = Ha();
  function t() {
    ((this.__data__ = new e()), (this.size = 0));
  }
  return ((zu = t), zu);
}
var Hu, qd;
function YA() {
  if (qd) return Hu;
  qd = 1;
  function e(t) {
    var r = this.__data__,
      n = r.delete(t);
    return ((this.size = r.size), n);
  }
  return ((Hu = e), Hu);
}
var Ku, Ld;
function ZA() {
  if (Ld) return Ku;
  Ld = 1;
  function e(t) {
    return this.__data__.get(t);
  }
  return ((Ku = e), Ku);
}
var Gu, Bd;
function JA() {
  if (Bd) return Gu;
  Bd = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return ((Gu = e), Gu);
}
var Vu, Fd;
function QA() {
  if (Fd) return Vu;
  Fd = 1;
  var e = Ha(),
    t = np(),
    r = ip(),
    n = 200;
  function i(a, o) {
    var u = this.__data__;
    if (u instanceof e) {
      var c = u.__data__;
      if (!t || c.length < n - 1) return (c.push([a, o]), (this.size = ++u.size), this);
      u = this.__data__ = new r(c);
    }
    return (u.set(a, o), (this.size = u.size), this);
  }
  return ((Vu = i), Vu);
}
var Xu, Ud;
function N0() {
  if (Ud) return Xu;
  Ud = 1;
  var e = Ha(),
    t = XA(),
    r = YA(),
    n = ZA(),
    i = JA(),
    a = QA();
  function o(u) {
    var c = (this.__data__ = new e(u));
    this.size = c.size;
  }
  return (
    (o.prototype.clear = t),
    (o.prototype.delete = r),
    (o.prototype.get = n),
    (o.prototype.has = i),
    (o.prototype.set = a),
    (Xu = o),
    Xu
  );
}
var Yu, Wd;
function e1() {
  if (Wd) return Yu;
  Wd = 1;
  var e = "__lodash_hash_undefined__";
  function t(r) {
    return (this.__data__.set(r, e), this);
  }
  return ((Yu = t), Yu);
}
var Zu, zd;
function t1() {
  if (zd) return Zu;
  zd = 1;
  function e(t) {
    return this.__data__.has(t);
  }
  return ((Zu = e), Zu);
}
var Ju, Hd;
function q0() {
  if (Hd) return Ju;
  Hd = 1;
  var e = ip(),
    t = e1(),
    r = t1();
  function n(i) {
    var a = -1,
      o = i == null ? 0 : i.length;
    for (this.__data__ = new e(); ++a < o; ) this.add(i[a]);
  }
  return ((n.prototype.add = n.prototype.push = t), (n.prototype.has = r), (Ju = n), Ju);
}
var Qu, Kd;
function L0() {
  if (Kd) return Qu;
  Kd = 1;
  function e(t, r) {
    for (var n = -1, i = t == null ? 0 : t.length; ++n < i; ) if (r(t[n], n, t)) return !0;
    return !1;
  }
  return ((Qu = e), Qu);
}
var ec, Gd;
function B0() {
  if (Gd) return ec;
  Gd = 1;
  function e(t, r) {
    return t.has(r);
  }
  return ((ec = e), ec);
}
var tc, Vd;
function F0() {
  if (Vd) return tc;
  Vd = 1;
  var e = q0(),
    t = L0(),
    r = B0(),
    n = 1,
    i = 2;
  function a(o, u, c, s, l, f) {
    var p = c & n,
      d = o.length,
      y = u.length;
    if (d != y && !(p && y > d)) return !1;
    var v = f.get(o),
      h = f.get(u);
    if (v && h) return v == u && h == o;
    var g = -1,
      x = !0,
      w = c & i ? new e() : void 0;
    for (f.set(o, u), f.set(u, o); ++g < d; ) {
      var O = o[g],
        m = u[g];
      if (s) var b = p ? s(m, O, g, u, o, f) : s(O, m, g, o, u, f);
      if (b !== void 0) {
        if (b) continue;
        x = !1;
        break;
      }
      if (w) {
        if (
          !t(u, function (_, A) {
            if (!r(w, A) && (O === _ || l(O, _, c, s, f))) return w.push(A);
          })
        ) {
          x = !1;
          break;
        }
      } else if (!(O === m || l(O, m, c, s, f))) {
        x = !1;
        break;
      }
    }
    return (f.delete(o), f.delete(u), x);
  }
  return ((tc = a), tc);
}
var rc, Xd;
function r1() {
  if (Xd) return rc;
  Xd = 1;
  var e = yt(),
    t = e.Uint8Array;
  return ((rc = t), rc);
}
var nc, Yd;
function n1() {
  if (Yd) return nc;
  Yd = 1;
  function e(t) {
    var r = -1,
      n = Array(t.size);
    return (
      t.forEach(function (i, a) {
        n[++r] = [a, i];
      }),
      n
    );
  }
  return ((nc = e), nc);
}
var ic, Zd;
function dp() {
  if (Zd) return ic;
  Zd = 1;
  function e(t) {
    var r = -1,
      n = Array(t.size);
    return (
      t.forEach(function (i) {
        n[++r] = i;
      }),
      n
    );
  }
  return ((ic = e), ic);
}
var ac, Jd;
function i1() {
  if (Jd) return ac;
  Jd = 1;
  var e = yi(),
    t = r1(),
    r = rp(),
    n = F0(),
    i = n1(),
    a = dp(),
    o = 1,
    u = 2,
    c = "[object Boolean]",
    s = "[object Date]",
    l = "[object Error]",
    f = "[object Map]",
    p = "[object Number]",
    d = "[object RegExp]",
    y = "[object Set]",
    v = "[object String]",
    h = "[object Symbol]",
    g = "[object ArrayBuffer]",
    x = "[object DataView]",
    w = e ? e.prototype : void 0,
    O = w ? w.valueOf : void 0;
  function m(b, _, A, T, $, j, E) {
    switch (A) {
      case x:
        if (b.byteLength != _.byteLength || b.byteOffset != _.byteOffset) return !1;
        ((b = b.buffer), (_ = _.buffer));
      case g:
        return !(b.byteLength != _.byteLength || !j(new t(b), new t(_)));
      case c:
      case s:
      case p:
        return r(+b, +_);
      case l:
        return b.name == _.name && b.message == _.message;
      case d:
      case v:
        return b == _ + "";
      case f:
        var C = i;
      case y:
        var I = T & o;
        if ((C || (C = a), b.size != _.size && !I)) return !1;
        var R = E.get(b);
        if (R) return R == _;
        ((T |= u), E.set(b, _));
        var k = n(C(b), C(_), T, $, j, E);
        return (E.delete(b), k);
      case h:
        if (O) return O.call(b) == O.call(_);
    }
    return !1;
  }
  return ((ac = m), ac);
}
var oc, Qd;
function U0() {
  if (Qd) return oc;
  Qd = 1;
  function e(t, r) {
    for (var n = -1, i = r.length, a = t.length; ++n < i; ) t[a + n] = r[n];
    return t;
  }
  return ((oc = e), oc);
}
var uc, ev;
function a1() {
  if (ev) return uc;
  ev = 1;
  var e = U0(),
    t = We();
  function r(n, i, a) {
    var o = i(n);
    return t(n) ? o : e(o, a(n));
  }
  return ((uc = r), uc);
}
var cc, tv;
function o1() {
  if (tv) return cc;
  tv = 1;
  function e(t, r) {
    for (var n = -1, i = t == null ? 0 : t.length, a = 0, o = []; ++n < i; ) {
      var u = t[n];
      r(u, n, t) && (o[a++] = u);
    }
    return o;
  }
  return ((cc = e), cc);
}
var sc, rv;
function u1() {
  if (rv) return sc;
  rv = 1;
  function e() {
    return [];
  }
  return ((sc = e), sc);
}
var lc, nv;
function c1() {
  if (nv) return lc;
  nv = 1;
  var e = o1(),
    t = u1(),
    r = Object.prototype,
    n = r.propertyIsEnumerable,
    i = Object.getOwnPropertySymbols,
    a = i
      ? function (o) {
          return o == null
            ? []
            : ((o = Object(o)),
              e(i(o), function (u) {
                return n.call(o, u);
              }));
        }
      : t;
  return ((lc = a), lc);
}
var fc, iv;
function s1() {
  if (iv) return fc;
  iv = 1;
  function e(t, r) {
    for (var n = -1, i = Array(t); ++n < t; ) i[n] = r(n);
    return i;
  }
  return ((fc = e), fc);
}
var pc, av;
function l1() {
  if (av) return pc;
  av = 1;
  var e = jt(),
    t = $t(),
    r = "[object Arguments]";
  function n(i) {
    return t(i) && e(i) == r;
  }
  return ((pc = n), pc);
}
var hc, ov;
function vp() {
  if (ov) return hc;
  ov = 1;
  var e = l1(),
    t = $t(),
    r = Object.prototype,
    n = r.hasOwnProperty,
    i = r.propertyIsEnumerable,
    a = e(
      (function () {
        return arguments;
      })(),
    )
      ? e
      : function (o) {
          return t(o) && n.call(o, "callee") && !i.call(o, "callee");
        };
  return ((hc = a), hc);
}
var Sn = { exports: {} },
  dc,
  uv;
function f1() {
  if (uv) return dc;
  uv = 1;
  function e() {
    return !1;
  }
  return ((dc = e), dc);
}
Sn.exports;
var cv;
function W0() {
  return (
    cv ||
      ((cv = 1),
      (function (e, t) {
        var r = yt(),
          n = f1(),
          i = t && !t.nodeType && t,
          a = i && !0 && e && !e.nodeType && e,
          o = a && a.exports === i,
          u = o ? r.Buffer : void 0,
          c = u ? u.isBuffer : void 0,
          s = c || n;
        e.exports = s;
      })(Sn, Sn.exports)),
    Sn.exports
  );
}
var vc, sv;
function yp() {
  if (sv) return vc;
  sv = 1;
  var e = 9007199254740991,
    t = /^(?:0|[1-9]\d*)$/;
  function r(n, i) {
    var a = typeof n;
    return (
      (i = i ?? e),
      !!i && (a == "number" || (a != "symbol" && t.test(n))) && n > -1 && n % 1 == 0 && n < i
    );
  }
  return ((vc = r), vc);
}
var yc, lv;
function mp() {
  if (lv) return yc;
  lv = 1;
  var e = 9007199254740991;
  function t(r) {
    return typeof r == "number" && r > -1 && r % 1 == 0 && r <= e;
  }
  return ((yc = t), yc);
}
var mc, fv;
function p1() {
  if (fv) return mc;
  fv = 1;
  var e = jt(),
    t = mp(),
    r = $t(),
    n = "[object Arguments]",
    i = "[object Array]",
    a = "[object Boolean]",
    o = "[object Date]",
    u = "[object Error]",
    c = "[object Function]",
    s = "[object Map]",
    l = "[object Number]",
    f = "[object Object]",
    p = "[object RegExp]",
    d = "[object Set]",
    y = "[object String]",
    v = "[object WeakMap]",
    h = "[object ArrayBuffer]",
    g = "[object DataView]",
    x = "[object Float32Array]",
    w = "[object Float64Array]",
    O = "[object Int8Array]",
    m = "[object Int16Array]",
    b = "[object Int32Array]",
    _ = "[object Uint8Array]",
    A = "[object Uint8ClampedArray]",
    T = "[object Uint16Array]",
    $ = "[object Uint32Array]",
    j = {};
  ((j[x] = j[w] = j[O] = j[m] = j[b] = j[_] = j[A] = j[T] = j[$] = !0),
    (j[n] =
      j[i] =
      j[h] =
      j[a] =
      j[g] =
      j[o] =
      j[u] =
      j[c] =
      j[s] =
      j[l] =
      j[f] =
      j[p] =
      j[d] =
      j[y] =
      j[v] =
        !1));
  function E(C) {
    return r(C) && t(C.length) && !!j[e(C)];
  }
  return ((mc = E), mc);
}
var gc, pv;
function z0() {
  if (pv) return gc;
  pv = 1;
  function e(t) {
    return function (r) {
      return t(r);
    };
  }
  return ((gc = e), gc);
}
var Pn = { exports: {} };
Pn.exports;
var hv;
function h1() {
  return (
    hv ||
      ((hv = 1),
      (function (e, t) {
        var r = s0(),
          n = t && !t.nodeType && t,
          i = n && !0 && e && !e.nodeType && e,
          a = i && i.exports === n,
          o = a && r.process,
          u = (function () {
            try {
              var c = i && i.require && i.require("util").types;
              return c || (o && o.binding && o.binding("util"));
            } catch {}
          })();
        e.exports = u;
      })(Pn, Pn.exports)),
    Pn.exports
  );
}
var bc, dv;
function H0() {
  if (dv) return bc;
  dv = 1;
  var e = p1(),
    t = z0(),
    r = h1(),
    n = r && r.isTypedArray,
    i = n ? t(n) : e;
  return ((bc = i), bc);
}
var xc, vv;
function d1() {
  if (vv) return xc;
  vv = 1;
  var e = s1(),
    t = vp(),
    r = We(),
    n = W0(),
    i = yp(),
    a = H0(),
    o = Object.prototype,
    u = o.hasOwnProperty;
  function c(s, l) {
    var f = r(s),
      p = !f && t(s),
      d = !f && !p && n(s),
      y = !f && !p && !d && a(s),
      v = f || p || d || y,
      h = v ? e(s.length, String) : [],
      g = h.length;
    for (var x in s)
      (l || u.call(s, x)) &&
        !(
          v &&
          (x == "length" ||
            (d && (x == "offset" || x == "parent")) ||
            (y && (x == "buffer" || x == "byteLength" || x == "byteOffset")) ||
            i(x, g))
        ) &&
        h.push(x);
    return h;
  }
  return ((xc = c), xc);
}
var wc, yv;
function v1() {
  if (yv) return wc;
  yv = 1;
  var e = Object.prototype;
  function t(r) {
    var n = r && r.constructor,
      i = (typeof n == "function" && n.prototype) || e;
    return r === i;
  }
  return ((wc = t), wc);
}
var Oc, mv;
function K0() {
  if (mv) return Oc;
  mv = 1;
  function e(t, r) {
    return function (n) {
      return t(r(n));
    };
  }
  return ((Oc = e), Oc);
}
var _c, gv;
function y1() {
  if (gv) return _c;
  gv = 1;
  var e = K0(),
    t = e(Object.keys, Object);
  return ((_c = t), _c);
}
var Ac, bv;
function m1() {
  if (bv) return Ac;
  bv = 1;
  var e = v1(),
    t = y1(),
    r = Object.prototype,
    n = r.hasOwnProperty;
  function i(a) {
    if (!e(a)) return t(a);
    var o = [];
    for (var u in Object(a)) n.call(a, u) && u != "constructor" && o.push(u);
    return o;
  }
  return ((Ac = i), Ac);
}
var Sc, xv;
function mi() {
  if (xv) return Sc;
  xv = 1;
  var e = tp(),
    t = mp();
  function r(n) {
    return n != null && t(n.length) && !e(n);
  }
  return ((Sc = r), Sc);
}
var Pc, wv;
function Ja() {
  if (wv) return Pc;
  wv = 1;
  var e = d1(),
    t = m1(),
    r = mi();
  function n(i) {
    return r(i) ? e(i) : t(i);
  }
  return ((Pc = n), Pc);
}
var Tc, Ov;
function g1() {
  if (Ov) return Tc;
  Ov = 1;
  var e = a1(),
    t = c1(),
    r = Ja();
  function n(i) {
    return e(i, r, t);
  }
  return ((Tc = n), Tc);
}
var Ec, _v;
function b1() {
  if (_v) return Ec;
  _v = 1;
  var e = g1(),
    t = 1,
    r = Object.prototype,
    n = r.hasOwnProperty;
  function i(a, o, u, c, s, l) {
    var f = u & t,
      p = e(a),
      d = p.length,
      y = e(o),
      v = y.length;
    if (d != v && !f) return !1;
    for (var h = d; h--; ) {
      var g = p[h];
      if (!(f ? g in o : n.call(o, g))) return !1;
    }
    var x = l.get(a),
      w = l.get(o);
    if (x && w) return x == o && w == a;
    var O = !0;
    (l.set(a, o), l.set(o, a));
    for (var m = f; ++h < d; ) {
      g = p[h];
      var b = a[g],
        _ = o[g];
      if (c) var A = f ? c(_, b, g, o, a, l) : c(b, _, g, a, o, l);
      if (!(A === void 0 ? b === _ || s(b, _, u, c, l) : A)) {
        O = !1;
        break;
      }
      m || (m = g == "constructor");
    }
    if (O && !m) {
      var T = a.constructor,
        $ = o.constructor;
      T != $ &&
        "constructor" in a &&
        "constructor" in o &&
        !(typeof T == "function" && T instanceof T && typeof $ == "function" && $ instanceof $) &&
        (O = !1);
    }
    return (l.delete(a), l.delete(o), O);
  }
  return ((Ec = i), Ec);
}
var jc, Av;
function x1() {
  if (Av) return jc;
  Av = 1;
  var e = dr(),
    t = yt(),
    r = e(t, "DataView");
  return ((jc = r), jc);
}
var $c, Sv;
function w1() {
  if (Sv) return $c;
  Sv = 1;
  var e = dr(),
    t = yt(),
    r = e(t, "Promise");
  return (($c = r), $c);
}
var Mc, Pv;
function G0() {
  if (Pv) return Mc;
  Pv = 1;
  var e = dr(),
    t = yt(),
    r = e(t, "Set");
  return ((Mc = r), Mc);
}
var Cc, Tv;
function O1() {
  if (Tv) return Cc;
  Tv = 1;
  var e = dr(),
    t = yt(),
    r = e(t, "WeakMap");
  return ((Cc = r), Cc);
}
var Ic, Ev;
function _1() {
  if (Ev) return Ic;
  Ev = 1;
  var e = x1(),
    t = np(),
    r = w1(),
    n = G0(),
    i = O1(),
    a = jt(),
    o = l0(),
    u = "[object Map]",
    c = "[object Object]",
    s = "[object Promise]",
    l = "[object Set]",
    f = "[object WeakMap]",
    p = "[object DataView]",
    d = o(e),
    y = o(t),
    v = o(r),
    h = o(n),
    g = o(i),
    x = a;
  return (
    ((e && x(new e(new ArrayBuffer(1))) != p) ||
      (t && x(new t()) != u) ||
      (r && x(r.resolve()) != s) ||
      (n && x(new n()) != l) ||
      (i && x(new i()) != f)) &&
      (x = function (w) {
        var O = a(w),
          m = O == c ? w.constructor : void 0,
          b = m ? o(m) : "";
        if (b)
          switch (b) {
            case d:
              return p;
            case y:
              return u;
            case v:
              return s;
            case h:
              return l;
            case g:
              return f;
          }
        return O;
      }),
    (Ic = x),
    Ic
  );
}
var Rc, jv;
function A1() {
  if (jv) return Rc;
  jv = 1;
  var e = N0(),
    t = F0(),
    r = i1(),
    n = b1(),
    i = _1(),
    a = We(),
    o = W0(),
    u = H0(),
    c = 1,
    s = "[object Arguments]",
    l = "[object Array]",
    f = "[object Object]",
    p = Object.prototype,
    d = p.hasOwnProperty;
  function y(v, h, g, x, w, O) {
    var m = a(v),
      b = a(h),
      _ = m ? l : i(v),
      A = b ? l : i(h);
    ((_ = _ == s ? f : _), (A = A == s ? f : A));
    var T = _ == f,
      $ = A == f,
      j = _ == A;
    if (j && o(v)) {
      if (!o(h)) return !1;
      ((m = !0), (T = !1));
    }
    if (j && !T)
      return (O || (O = new e()), m || u(v) ? t(v, h, g, x, w, O) : r(v, h, _, g, x, w, O));
    if (!(g & c)) {
      var E = T && d.call(v, "__wrapped__"),
        C = $ && d.call(h, "__wrapped__");
      if (E || C) {
        var I = E ? v.value() : v,
          R = C ? h.value() : h;
        return (O || (O = new e()), w(I, R, g, x, O));
      }
    }
    return j ? (O || (O = new e()), n(v, h, g, x, w, O)) : !1;
  }
  return ((Rc = y), Rc);
}
var kc, $v;
function gp() {
  if ($v) return kc;
  $v = 1;
  var e = A1(),
    t = $t();
  function r(n, i, a, o, u) {
    return n === i
      ? !0
      : n == null || i == null || (!t(n) && !t(i))
        ? n !== n && i !== i
        : e(n, i, a, o, r, u);
  }
  return ((kc = r), kc);
}
var Dc, Mv;
function S1() {
  if (Mv) return Dc;
  Mv = 1;
  var e = N0(),
    t = gp(),
    r = 1,
    n = 2;
  function i(a, o, u, c) {
    var s = u.length,
      l = s,
      f = !c;
    if (a == null) return !l;
    for (a = Object(a); s--; ) {
      var p = u[s];
      if (f && p[2] ? p[1] !== a[p[0]] : !(p[0] in a)) return !1;
    }
    for (; ++s < l; ) {
      p = u[s];
      var d = p[0],
        y = a[d],
        v = p[1];
      if (f && p[2]) {
        if (y === void 0 && !(d in a)) return !1;
      } else {
        var h = new e();
        if (c) var g = c(y, v, d, a, o, h);
        if (!(g === void 0 ? t(v, y, r | n, c, h) : g)) return !1;
      }
    }
    return !0;
  }
  return ((Dc = i), Dc);
}
var Nc, Cv;
function V0() {
  if (Cv) return Nc;
  Cv = 1;
  var e = Lt();
  function t(r) {
    return r === r && !e(r);
  }
  return ((Nc = t), Nc);
}
var qc, Iv;
function P1() {
  if (Iv) return qc;
  Iv = 1;
  var e = V0(),
    t = Ja();
  function r(n) {
    for (var i = t(n), a = i.length; a--; ) {
      var o = i[a],
        u = n[o];
      i[a] = [o, u, e(u)];
    }
    return i;
  }
  return ((qc = r), qc);
}
var Lc, Rv;
function X0() {
  if (Rv) return Lc;
  Rv = 1;
  function e(t, r) {
    return function (n) {
      return n == null ? !1 : n[t] === r && (r !== void 0 || t in Object(n));
    };
  }
  return ((Lc = e), Lc);
}
var Bc, kv;
function T1() {
  if (kv) return Bc;
  kv = 1;
  var e = S1(),
    t = P1(),
    r = X0();
  function n(i) {
    var a = t(i);
    return a.length == 1 && a[0][2]
      ? r(a[0][0], a[0][1])
      : function (o) {
          return o === i || e(o, i, a);
        };
  }
  return ((Bc = n), Bc);
}
var Fc, Dv;
function E1() {
  if (Dv) return Fc;
  Dv = 1;
  function e(t, r) {
    return t != null && r in Object(t);
  }
  return ((Fc = e), Fc);
}
var Uc, Nv;
function j1() {
  if (Nv) return Uc;
  Nv = 1;
  var e = h0(),
    t = vp(),
    r = We(),
    n = yp(),
    i = mp(),
    a = Ga();
  function o(u, c, s) {
    c = e(c, u);
    for (var l = -1, f = c.length, p = !1; ++l < f; ) {
      var d = a(c[l]);
      if (!(p = u != null && s(u, d))) break;
      u = u[d];
    }
    return p || ++l != f
      ? p
      : ((f = u == null ? 0 : u.length), !!f && i(f) && n(d, f) && (r(u) || t(u)));
  }
  return ((Uc = o), Uc);
}
var Wc, qv;
function $1() {
  if (qv) return Wc;
  qv = 1;
  var e = E1(),
    t = j1();
  function r(n, i) {
    return n != null && t(n, i, e);
  }
  return ((Wc = r), Wc);
}
var zc, Lv;
function M1() {
  if (Lv) return zc;
  Lv = 1;
  var e = gp(),
    t = d0(),
    r = $1(),
    n = ep(),
    i = V0(),
    a = X0(),
    o = Ga(),
    u = 1,
    c = 2;
  function s(l, f) {
    return n(l) && i(f)
      ? a(o(l), f)
      : function (p) {
          var d = t(p, l);
          return d === void 0 && d === f ? r(p, l) : e(f, d, u | c);
        };
  }
  return ((zc = s), zc);
}
var Hc, Bv;
function ln() {
  if (Bv) return Hc;
  Bv = 1;
  function e(t) {
    return t;
  }
  return ((Hc = e), Hc);
}
var Kc, Fv;
function C1() {
  if (Fv) return Kc;
  Fv = 1;
  function e(t) {
    return function (r) {
      return r?.[t];
    };
  }
  return ((Kc = e), Kc);
}
var Gc, Uv;
function I1() {
  if (Uv) return Gc;
  Uv = 1;
  var e = op();
  function t(r) {
    return function (n) {
      return e(n, r);
    };
  }
  return ((Gc = t), Gc);
}
var Vc, Wv;
function R1() {
  if (Wv) return Vc;
  Wv = 1;
  var e = C1(),
    t = I1(),
    r = ep(),
    n = Ga();
  function i(a) {
    return r(a) ? e(n(a)) : t(a);
  }
  return ((Vc = i), Vc);
}
var Xc, zv;
function mt() {
  if (zv) return Xc;
  zv = 1;
  var e = T1(),
    t = M1(),
    r = ln(),
    n = We(),
    i = R1();
  function a(o) {
    return typeof o == "function"
      ? o
      : o == null
        ? r
        : typeof o == "object"
          ? n(o)
            ? t(o[0], o[1])
            : e(o)
          : i(o);
  }
  return ((Xc = a), Xc);
}
var Yc, Hv;
function Y0() {
  if (Hv) return Yc;
  Hv = 1;
  function e(t, r, n, i) {
    for (var a = t.length, o = n + (i ? 1 : -1); i ? o-- : ++o < a; ) if (r(t[o], o, t)) return o;
    return -1;
  }
  return ((Yc = e), Yc);
}
var Zc, Kv;
function k1() {
  if (Kv) return Zc;
  Kv = 1;
  function e(t) {
    return t !== t;
  }
  return ((Zc = e), Zc);
}
var Jc, Gv;
function D1() {
  if (Gv) return Jc;
  Gv = 1;
  function e(t, r, n) {
    for (var i = n - 1, a = t.length; ++i < a; ) if (t[i] === r) return i;
    return -1;
  }
  return ((Jc = e), Jc);
}
var Qc, Vv;
function N1() {
  if (Vv) return Qc;
  Vv = 1;
  var e = Y0(),
    t = k1(),
    r = D1();
  function n(i, a, o) {
    return a === a ? r(i, a, o) : e(i, t, o);
  }
  return ((Qc = n), Qc);
}
var es, Xv;
function q1() {
  if (Xv) return es;
  Xv = 1;
  var e = N1();
  function t(r, n) {
    var i = r == null ? 0 : r.length;
    return !!i && e(r, n, 0) > -1;
  }
  return ((es = t), es);
}
var ts, Yv;
function L1() {
  if (Yv) return ts;
  Yv = 1;
  function e(t, r, n) {
    for (var i = -1, a = t == null ? 0 : t.length; ++i < a; ) if (n(r, t[i])) return !0;
    return !1;
  }
  return ((ts = e), ts);
}
var rs, Zv;
function B1() {
  if (Zv) return rs;
  Zv = 1;
  function e() {}
  return ((rs = e), rs);
}
var ns, Jv;
function F1() {
  if (Jv) return ns;
  Jv = 1;
  var e = G0(),
    t = B1(),
    r = dp(),
    n = 1 / 0,
    i =
      e && 1 / r(new e([, -0]))[1] == n
        ? function (a) {
            return new e(a);
          }
        : t;
  return ((ns = i), ns);
}
var is, Qv;
function U1() {
  if (Qv) return is;
  Qv = 1;
  var e = q0(),
    t = q1(),
    r = L1(),
    n = B0(),
    i = F1(),
    a = dp(),
    o = 200;
  function u(c, s, l) {
    var f = -1,
      p = t,
      d = c.length,
      y = !0,
      v = [],
      h = v;
    if (l) ((y = !1), (p = r));
    else if (d >= o) {
      var g = s ? null : i(c);
      if (g) return a(g);
      ((y = !1), (p = n), (h = new e()));
    } else h = s ? [] : v;
    e: for (; ++f < d; ) {
      var x = c[f],
        w = s ? s(x) : x;
      if (((x = l || x !== 0 ? x : 0), y && w === w)) {
        for (var O = h.length; O--; ) if (h[O] === w) continue e;
        (s && h.push(w), v.push(x));
      } else p(h, w, l) || (h !== v && h.push(w), v.push(x));
    }
    return v;
  }
  return ((is = u), is);
}
var as, ey;
function W1() {
  if (ey) return as;
  ey = 1;
  var e = mt(),
    t = U1();
  function r(n, i) {
    return n && n.length ? t(n, e(i, 2)) : [];
  }
  return ((as = r), as);
}
var z1 = W1();
const ty = le(z1);
function Z0(e, t, r) {
  return t === !0 ? ty(e, r) : Z(t) ? ty(e, t) : e;
}
function Dr(e) {
  "@babel/helpers - typeof";
  return (
    (Dr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Dr(e)
  );
}
var H1 = ["ref"];
function ry(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function gt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? ry(Object(r), !0).forEach(function (n) {
          Qa(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : ry(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function K1(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function ny(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, Q0(n.key), n));
  }
}
function G1(e, t, r) {
  return (
    t && ny(e.prototype, t),
    r && ny(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function V1(e, t, r) {
  return (
    (t = Yi(t)),
    X1(e, J0() ? Reflect.construct(t, r || [], Yi(e).constructor) : t.apply(e, r))
  );
}
function X1(e, t) {
  if (t && (Dr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return Y1(e);
}
function Y1(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function J0() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (J0 = function () {
    return !!e;
  })();
}
function Yi(e) {
  return (
    (Yi = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Yi(e)
  );
}
function Z1(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && zl(e, t));
}
function zl(e, t) {
  return (
    (zl = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    zl(e, t)
  );
}
function Qa(e, t, r) {
  return (
    (t = Q0(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Q0(e) {
  var t = J1(e, "string");
  return Dr(t) == "symbol" ? t : t + "";
}
function J1(e, t) {
  if (Dr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Dr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function Q1(e, t) {
  if (e == null) return {};
  var r = eS(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function eS(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function tS(e) {
  return e.value;
}
function rS(e, t) {
  if (S.isValidElement(e)) return S.cloneElement(e, t);
  if (typeof e == "function") return S.createElement(e, t);
  t.ref;
  var r = Q1(t, H1);
  return S.createElement(hp, r);
}
var iy = 1,
  Mr = (function (e) {
    function t() {
      var r;
      K1(this, t);
      for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++) i[a] = arguments[a];
      return (
        (r = V1(this, t, [].concat(i))),
        Qa(r, "lastBoundingBox", { width: -1, height: -1 }),
        r
      );
    }
    return (
      Z1(t, e),
      G1(
        t,
        [
          {
            key: "componentDidMount",
            value: function () {
              this.updateBBox();
            },
          },
          {
            key: "componentDidUpdate",
            value: function () {
              this.updateBBox();
            },
          },
          {
            key: "getBBox",
            value: function () {
              if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
                var n = this.wrapperNode.getBoundingClientRect();
                return (
                  (n.height = this.wrapperNode.offsetHeight),
                  (n.width = this.wrapperNode.offsetWidth),
                  n
                );
              }
              return null;
            },
          },
          {
            key: "updateBBox",
            value: function () {
              var n = this.props.onBBoxUpdate,
                i = this.getBBox();
              i
                ? (Math.abs(i.width - this.lastBoundingBox.width) > iy ||
                    Math.abs(i.height - this.lastBoundingBox.height) > iy) &&
                  ((this.lastBoundingBox.width = i.width),
                  (this.lastBoundingBox.height = i.height),
                  n && n(i))
                : (this.lastBoundingBox.width !== -1 || this.lastBoundingBox.height !== -1) &&
                  ((this.lastBoundingBox.width = -1),
                  (this.lastBoundingBox.height = -1),
                  n && n(null));
            },
          },
          {
            key: "getBBoxSnapshot",
            value: function () {
              return this.lastBoundingBox.width >= 0 && this.lastBoundingBox.height >= 0
                ? gt({}, this.lastBoundingBox)
                : { width: 0, height: 0 };
            },
          },
          {
            key: "getDefaultPosition",
            value: function (n) {
              var i = this.props,
                a = i.layout,
                o = i.align,
                u = i.verticalAlign,
                c = i.margin,
                s = i.chartWidth,
                l = i.chartHeight,
                f,
                p;
              if (
                !n ||
                ((n.left === void 0 || n.left === null) && (n.right === void 0 || n.right === null))
              )
                if (o === "center" && a === "vertical") {
                  var d = this.getBBoxSnapshot();
                  f = { left: ((s || 0) - d.width) / 2 };
                } else
                  f = o === "right" ? { right: (c && c.right) || 0 } : { left: (c && c.left) || 0 };
              if (
                !n ||
                ((n.top === void 0 || n.top === null) && (n.bottom === void 0 || n.bottom === null))
              )
                if (u === "middle") {
                  var y = this.getBBoxSnapshot();
                  p = { top: ((l || 0) - y.height) / 2 };
                } else
                  p =
                    u === "bottom" ? { bottom: (c && c.bottom) || 0 } : { top: (c && c.top) || 0 };
              return gt(gt({}, f), p);
            },
          },
          {
            key: "render",
            value: function () {
              var n = this,
                i = this.props,
                a = i.content,
                o = i.width,
                u = i.height,
                c = i.wrapperStyle,
                s = i.payloadUniqBy,
                l = i.payload,
                f = gt(
                  gt(
                    { position: "absolute", width: o || "auto", height: u || "auto" },
                    this.getDefaultPosition(c),
                  ),
                  c,
                );
              return S.createElement(
                "div",
                {
                  className: "recharts-legend-wrapper",
                  style: f,
                  ref: function (d) {
                    n.wrapperNode = d;
                  },
                },
                rS(a, gt(gt({}, this.props), {}, { payload: Z0(l, s, tS) })),
              );
            },
          },
        ],
        [
          {
            key: "getWithHeight",
            value: function (n, i) {
              var a = gt(gt({}, this.defaultProps), n.props),
                o = a.layout;
              return o === "vertical" && B(n.props.height)
                ? { height: n.props.height }
                : o === "horizontal"
                  ? { width: n.props.width || i }
                  : null;
            },
          },
        ],
      )
    );
  })(L.PureComponent);
Qa(Mr, "displayName", "Legend");
Qa(Mr, "defaultProps", {
  iconSize: 14,
  layout: "horizontal",
  align: "center",
  verticalAlign: "bottom",
});
var os, ay;
function nS() {
  if (ay) return os;
  ay = 1;
  var e = yi(),
    t = vp(),
    r = We(),
    n = e ? e.isConcatSpreadable : void 0;
  function i(a) {
    return r(a) || t(a) || !!(n && a && a[n]);
  }
  return ((os = i), os);
}
var us, oy;
function ex() {
  if (oy) return us;
  oy = 1;
  var e = U0(),
    t = nS();
  function r(n, i, a, o, u) {
    var c = -1,
      s = n.length;
    for (a || (a = t), u || (u = []); ++c < s; ) {
      var l = n[c];
      i > 0 && a(l) ? (i > 1 ? r(l, i - 1, a, o, u) : e(u, l)) : o || (u[u.length] = l);
    }
    return u;
  }
  return ((us = r), us);
}
var cs, uy;
function iS() {
  if (uy) return cs;
  uy = 1;
  function e(t) {
    return function (r, n, i) {
      for (var a = -1, o = Object(r), u = i(r), c = u.length; c--; ) {
        var s = u[t ? c : ++a];
        if (n(o[s], s, o) === !1) break;
      }
      return r;
    };
  }
  return ((cs = e), cs);
}
var ss, cy;
function aS() {
  if (cy) return ss;
  cy = 1;
  var e = iS(),
    t = e();
  return ((ss = t), ss);
}
var ls, sy;
function tx() {
  if (sy) return ls;
  sy = 1;
  var e = aS(),
    t = Ja();
  function r(n, i) {
    return n && e(n, i, t);
  }
  return ((ls = r), ls);
}
var fs, ly;
function oS() {
  if (ly) return fs;
  ly = 1;
  var e = mi();
  function t(r, n) {
    return function (i, a) {
      if (i == null) return i;
      if (!e(i)) return r(i, a);
      for (
        var o = i.length, u = n ? o : -1, c = Object(i);
        (n ? u-- : ++u < o) && a(c[u], u, c) !== !1;
      );
      return i;
    };
  }
  return ((fs = t), fs);
}
var ps, fy;
function bp() {
  if (fy) return ps;
  fy = 1;
  var e = tx(),
    t = oS(),
    r = t(e);
  return ((ps = r), ps);
}
var hs, py;
function rx() {
  if (py) return hs;
  py = 1;
  var e = bp(),
    t = mi();
  function r(n, i) {
    var a = -1,
      o = t(n) ? Array(n.length) : [];
    return (
      e(n, function (u, c, s) {
        o[++a] = i(u, c, s);
      }),
      o
    );
  }
  return ((hs = r), hs);
}
var ds, hy;
function uS() {
  if (hy) return ds;
  hy = 1;
  function e(t, r) {
    var n = t.length;
    for (t.sort(r); n--; ) t[n] = t[n].value;
    return t;
  }
  return ((ds = e), ds);
}
var vs, dy;
function cS() {
  if (dy) return vs;
  dy = 1;
  var e = un();
  function t(r, n) {
    if (r !== n) {
      var i = r !== void 0,
        a = r === null,
        o = r === r,
        u = e(r),
        c = n !== void 0,
        s = n === null,
        l = n === n,
        f = e(n);
      if (
        (!s && !f && !u && r > n) ||
        (u && c && l && !s && !f) ||
        (a && c && l) ||
        (!i && l) ||
        !o
      )
        return 1;
      if (
        (!a && !u && !f && r < n) ||
        (f && i && o && !a && !u) ||
        (s && i && o) ||
        (!c && o) ||
        !l
      )
        return -1;
    }
    return 0;
  }
  return ((vs = t), vs);
}
var ys, vy;
function sS() {
  if (vy) return ys;
  vy = 1;
  var e = cS();
  function t(r, n, i) {
    for (var a = -1, o = r.criteria, u = n.criteria, c = o.length, s = i.length; ++a < c; ) {
      var l = e(o[a], u[a]);
      if (l) {
        if (a >= s) return l;
        var f = i[a];
        return l * (f == "desc" ? -1 : 1);
      }
    }
    return r.index - n.index;
  }
  return ((ys = t), ys);
}
var ms, yy;
function lS() {
  if (yy) return ms;
  yy = 1;
  var e = ap(),
    t = op(),
    r = mt(),
    n = rx(),
    i = uS(),
    a = z0(),
    o = sS(),
    u = ln(),
    c = We();
  function s(l, f, p) {
    f.length
      ? (f = e(f, function (v) {
          return c(v)
            ? function (h) {
                return t(h, v.length === 1 ? v[0] : v);
              }
            : v;
        }))
      : (f = [u]);
    var d = -1;
    f = e(f, a(r));
    var y = n(l, function (v, h, g) {
      var x = e(f, function (w) {
        return w(v);
      });
      return { criteria: x, index: ++d, value: v };
    });
    return i(y, function (v, h) {
      return o(v, h, p);
    });
  }
  return ((ms = s), ms);
}
var gs, my;
function fS() {
  if (my) return gs;
  my = 1;
  function e(t, r, n) {
    switch (n.length) {
      case 0:
        return t.call(r);
      case 1:
        return t.call(r, n[0]);
      case 2:
        return t.call(r, n[0], n[1]);
      case 3:
        return t.call(r, n[0], n[1], n[2]);
    }
    return t.apply(r, n);
  }
  return ((gs = e), gs);
}
var bs, gy;
function pS() {
  if (gy) return bs;
  gy = 1;
  var e = fS(),
    t = Math.max;
  function r(n, i, a) {
    return (
      (i = t(i === void 0 ? n.length - 1 : i, 0)),
      function () {
        for (var o = arguments, u = -1, c = t(o.length - i, 0), s = Array(c); ++u < c; )
          s[u] = o[i + u];
        u = -1;
        for (var l = Array(i + 1); ++u < i; ) l[u] = o[u];
        return ((l[i] = a(s)), e(n, this, l));
      }
    );
  }
  return ((bs = r), bs);
}
var xs, by;
function hS() {
  if (by) return xs;
  by = 1;
  function e(t) {
    return function () {
      return t;
    };
  }
  return ((xs = e), xs);
}
var ws, xy;
function nx() {
  if (xy) return ws;
  xy = 1;
  var e = dr(),
    t = (function () {
      try {
        var r = e(Object, "defineProperty");
        return (r({}, "", {}), r);
      } catch {}
    })();
  return ((ws = t), ws);
}
var Os, wy;
function dS() {
  if (wy) return Os;
  wy = 1;
  var e = hS(),
    t = nx(),
    r = ln(),
    n = t
      ? function (i, a) {
          return t(i, "toString", { configurable: !0, enumerable: !1, value: e(a), writable: !0 });
        }
      : r;
  return ((Os = n), Os);
}
var _s, Oy;
function vS() {
  if (Oy) return _s;
  Oy = 1;
  var e = 800,
    t = 16,
    r = Date.now;
  function n(i) {
    var a = 0,
      o = 0;
    return function () {
      var u = r(),
        c = t - (u - o);
      if (((o = u), c > 0)) {
        if (++a >= e) return arguments[0];
      } else a = 0;
      return i.apply(void 0, arguments);
    };
  }
  return ((_s = n), _s);
}
var As, _y;
function yS() {
  if (_y) return As;
  _y = 1;
  var e = dS(),
    t = vS(),
    r = t(e);
  return ((As = r), As);
}
var Ss, Ay;
function mS() {
  if (Ay) return Ss;
  Ay = 1;
  var e = ln(),
    t = pS(),
    r = yS();
  function n(i, a) {
    return r(t(i, a, e), i + "");
  }
  return ((Ss = n), Ss);
}
var Ps, Sy;
function eo() {
  if (Sy) return Ps;
  Sy = 1;
  var e = rp(),
    t = mi(),
    r = yp(),
    n = Lt();
  function i(a, o, u) {
    if (!n(u)) return !1;
    var c = typeof o;
    return (c == "number" ? t(u) && r(o, u.length) : c == "string" && o in u) ? e(u[o], a) : !1;
  }
  return ((Ps = i), Ps);
}
var Ts, Py;
function gS() {
  if (Py) return Ts;
  Py = 1;
  var e = ex(),
    t = lS(),
    r = mS(),
    n = eo(),
    i = r(function (a, o) {
      if (a == null) return [];
      var u = o.length;
      return (
        u > 1 && n(a, o[0], o[1]) ? (o = []) : u > 2 && n(o[0], o[1], o[2]) && (o = [o[0]]),
        t(a, e(o, 1), [])
      );
    });
  return ((Ts = i), Ts);
}
var bS = gS();
const xp = le(bS);
function Nn(e) {
  "@babel/helpers - typeof";
  return (
    (Nn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Nn(e)
  );
}
function Hl() {
  return (
    (Hl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Hl.apply(this, arguments)
  );
}
function xS(e, t) {
  return AS(e) || _S(e, t) || OS(e, t) || wS();
}
function wS() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function OS(e, t) {
  if (e) {
    if (typeof e == "string") return Ty(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Ty(e, t);
  }
}
function Ty(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function _S(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function AS(e) {
  if (Array.isArray(e)) return e;
}
function Ey(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Es(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ey(Object(r), !0).forEach(function (n) {
          SS(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ey(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function SS(e, t, r) {
  return (
    (t = PS(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function PS(e) {
  var t = TS(e, "string");
  return Nn(t) == "symbol" ? t : t + "";
}
function TS(e, t) {
  if (Nn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Nn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ES(e) {
  return Array.isArray(e) && je(e[0]) && je(e[1]) ? e.join(" ~ ") : e;
}
var jS = function (t) {
  var r = t.separator,
    n = r === void 0 ? " : " : r,
    i = t.contentStyle,
    a = i === void 0 ? {} : i,
    o = t.itemStyle,
    u = o === void 0 ? {} : o,
    c = t.labelStyle,
    s = c === void 0 ? {} : c,
    l = t.payload,
    f = t.formatter,
    p = t.itemSorter,
    d = t.wrapperClassName,
    y = t.labelClassName,
    v = t.label,
    h = t.labelFormatter,
    g = t.accessibilityLayer,
    x = g === void 0 ? !1 : g,
    w = function () {
      if (l && l.length) {
        var E = { padding: 0, margin: 0 },
          C = (p ? xp(l, p) : l).map(function (I, R) {
            if (I.type === "none") return null;
            var k = Es(
                { display: "block", paddingTop: 4, paddingBottom: 4, color: I.color || "#000" },
                u,
              ),
              N = I.formatter || f || ES,
              W = I.value,
              z = I.name,
              K = W,
              P = z;
            if (N && K != null && P != null) {
              var M = N(W, z, I, R, l);
              if (Array.isArray(M)) {
                var F = xS(M, 2);
                ((K = F[0]), (P = F[1]));
              } else K = M;
            }
            return S.createElement(
              "li",
              { className: "recharts-tooltip-item", key: "tooltip-item-".concat(R), style: k },
              je(P)
                ? S.createElement("span", { className: "recharts-tooltip-item-name" }, P)
                : null,
              je(P)
                ? S.createElement("span", { className: "recharts-tooltip-item-separator" }, n)
                : null,
              S.createElement("span", { className: "recharts-tooltip-item-value" }, K),
              S.createElement("span", { className: "recharts-tooltip-item-unit" }, I.unit || ""),
            );
          });
        return S.createElement("ul", { className: "recharts-tooltip-item-list", style: E }, C);
      }
      return null;
    },
    O = Es(
      {
        margin: 0,
        padding: 10,
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        whiteSpace: "nowrap",
      },
      a,
    ),
    m = Es({ margin: 0 }, s),
    b = !J(v),
    _ = b ? v : "",
    A = te("recharts-default-tooltip", d),
    T = te("recharts-tooltip-label", y);
  b && h && l !== void 0 && l !== null && (_ = h(v, l));
  var $ = x ? { role: "status", "aria-live": "assertive" } : {};
  return S.createElement(
    "div",
    Hl({ className: A, style: O }, $),
    S.createElement("p", { className: T, style: m }, S.isValidElement(_) ? _ : "".concat(_)),
    w(),
  );
};
function qn(e) {
  "@babel/helpers - typeof";
  return (
    (qn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    qn(e)
  );
}
function ji(e, t, r) {
  return (
    (t = $S(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function $S(e) {
  var t = MS(e, "string");
  return qn(t) == "symbol" ? t : t + "";
}
function MS(e, t) {
  if (qn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (qn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var yn = "recharts-tooltip-wrapper",
  CS = { visibility: "hidden" };
function IS(e) {
  var t = e.coordinate,
    r = e.translateX,
    n = e.translateY;
  return te(
    yn,
    ji(
      ji(
        ji(
          ji({}, "".concat(yn, "-right"), B(r) && t && B(t.x) && r >= t.x),
          "".concat(yn, "-left"),
          B(r) && t && B(t.x) && r < t.x,
        ),
        "".concat(yn, "-bottom"),
        B(n) && t && B(t.y) && n >= t.y,
      ),
      "".concat(yn, "-top"),
      B(n) && t && B(t.y) && n < t.y,
    ),
  );
}
function jy(e) {
  var t = e.allowEscapeViewBox,
    r = e.coordinate,
    n = e.key,
    i = e.offsetTopLeft,
    a = e.position,
    o = e.reverseDirection,
    u = e.tooltipDimension,
    c = e.viewBox,
    s = e.viewBoxDimension;
  if (a && B(a[n])) return a[n];
  var l = r[n] - u - i,
    f = r[n] + i;
  if (t[n]) return o[n] ? l : f;
  if (o[n]) {
    var p = l,
      d = c[n];
    return p < d ? Math.max(f, c[n]) : Math.max(l, c[n]);
  }
  var y = f + u,
    v = c[n] + s;
  return y > v ? Math.max(l, c[n]) : Math.max(f, c[n]);
}
function RS(e) {
  var t = e.translateX,
    r = e.translateY,
    n = e.useTranslate3d;
  return {
    transform: n
      ? "translate3d(".concat(t, "px, ").concat(r, "px, 0)")
      : "translate(".concat(t, "px, ").concat(r, "px)"),
  };
}
function kS(e) {
  var t = e.allowEscapeViewBox,
    r = e.coordinate,
    n = e.offsetTopLeft,
    i = e.position,
    a = e.reverseDirection,
    o = e.tooltipBox,
    u = e.useTranslate3d,
    c = e.viewBox,
    s,
    l,
    f;
  return (
    o.height > 0 && o.width > 0 && r
      ? ((l = jy({
          allowEscapeViewBox: t,
          coordinate: r,
          key: "x",
          offsetTopLeft: n,
          position: i,
          reverseDirection: a,
          tooltipDimension: o.width,
          viewBox: c,
          viewBoxDimension: c.width,
        })),
        (f = jy({
          allowEscapeViewBox: t,
          coordinate: r,
          key: "y",
          offsetTopLeft: n,
          position: i,
          reverseDirection: a,
          tooltipDimension: o.height,
          viewBox: c,
          viewBoxDimension: c.height,
        })),
        (s = RS({ translateX: l, translateY: f, useTranslate3d: u })))
      : (s = CS),
    { cssProperties: s, cssClasses: IS({ translateX: l, translateY: f, coordinate: r }) }
  );
}
function Nr(e) {
  "@babel/helpers - typeof";
  return (
    (Nr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Nr(e)
  );
}
function $y(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function My(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? $y(Object(r), !0).forEach(function (n) {
          Gl(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : $y(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function DS(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function NS(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, ax(n.key), n));
  }
}
function qS(e, t, r) {
  return (t && NS(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function LS(e, t, r) {
  return (
    (t = Zi(t)),
    BS(e, ix() ? Reflect.construct(t, r || [], Zi(e).constructor) : t.apply(e, r))
  );
}
function BS(e, t) {
  if (t && (Nr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return FS(e);
}
function FS(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function ix() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (ix = function () {
    return !!e;
  })();
}
function Zi(e) {
  return (
    (Zi = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Zi(e)
  );
}
function US(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Kl(e, t));
}
function Kl(e, t) {
  return (
    (Kl = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Kl(e, t)
  );
}
function Gl(e, t, r) {
  return (
    (t = ax(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function ax(e) {
  var t = WS(e, "string");
  return Nr(t) == "symbol" ? t : t + "";
}
function WS(e, t) {
  if (Nr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Nr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Cy = 1,
  zS = (function (e) {
    function t() {
      var r;
      DS(this, t);
      for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++) i[a] = arguments[a];
      return (
        (r = LS(this, t, [].concat(i))),
        Gl(r, "state", {
          dismissed: !1,
          dismissedAtCoordinate: { x: 0, y: 0 },
          lastBoundingBox: { width: -1, height: -1 },
        }),
        Gl(r, "handleKeyDown", function (o) {
          if (o.key === "Escape") {
            var u, c, s, l;
            r.setState({
              dismissed: !0,
              dismissedAtCoordinate: {
                x:
                  (u = (c = r.props.coordinate) === null || c === void 0 ? void 0 : c.x) !== null &&
                  u !== void 0
                    ? u
                    : 0,
                y:
                  (s = (l = r.props.coordinate) === null || l === void 0 ? void 0 : l.y) !== null &&
                  s !== void 0
                    ? s
                    : 0,
              },
            });
          }
        }),
        r
      );
    }
    return (
      US(t, e),
      qS(t, [
        {
          key: "updateBBox",
          value: function () {
            if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
              var n = this.wrapperNode.getBoundingClientRect();
              (Math.abs(n.width - this.state.lastBoundingBox.width) > Cy ||
                Math.abs(n.height - this.state.lastBoundingBox.height) > Cy) &&
                this.setState({ lastBoundingBox: { width: n.width, height: n.height } });
            } else
              (this.state.lastBoundingBox.width !== -1 ||
                this.state.lastBoundingBox.height !== -1) &&
                this.setState({ lastBoundingBox: { width: -1, height: -1 } });
          },
        },
        {
          key: "componentDidMount",
          value: function () {
            (document.addEventListener("keydown", this.handleKeyDown), this.updateBBox());
          },
        },
        {
          key: "componentWillUnmount",
          value: function () {
            document.removeEventListener("keydown", this.handleKeyDown);
          },
        },
        {
          key: "componentDidUpdate",
          value: function () {
            var n, i;
            (this.props.active && this.updateBBox(),
              this.state.dismissed &&
                (((n = this.props.coordinate) === null || n === void 0 ? void 0 : n.x) !==
                  this.state.dismissedAtCoordinate.x ||
                  ((i = this.props.coordinate) === null || i === void 0 ? void 0 : i.y) !==
                    this.state.dismissedAtCoordinate.y) &&
                (this.state.dismissed = !1));
          },
        },
        {
          key: "render",
          value: function () {
            var n = this,
              i = this.props,
              a = i.active,
              o = i.allowEscapeViewBox,
              u = i.animationDuration,
              c = i.animationEasing,
              s = i.children,
              l = i.coordinate,
              f = i.hasPayload,
              p = i.isAnimationActive,
              d = i.offset,
              y = i.position,
              v = i.reverseDirection,
              h = i.useTranslate3d,
              g = i.viewBox,
              x = i.wrapperStyle,
              w = kS({
                allowEscapeViewBox: o,
                coordinate: l,
                offsetTopLeft: d,
                position: y,
                reverseDirection: v,
                tooltipBox: this.state.lastBoundingBox,
                useTranslate3d: h,
                viewBox: g,
              }),
              O = w.cssClasses,
              m = w.cssProperties,
              b = My(
                My({ transition: p && a ? "transform ".concat(u, "ms ").concat(c) : void 0 }, m),
                {},
                {
                  pointerEvents: "none",
                  visibility: !this.state.dismissed && a && f ? "visible" : "hidden",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                x,
              );
            return S.createElement(
              "div",
              {
                tabIndex: -1,
                className: O,
                style: b,
                ref: function (A) {
                  n.wrapperNode = A;
                },
              },
              s,
            );
          },
        },
      ])
    );
  })(L.PureComponent),
  HS = function () {
    return !(
      typeof window < "u" &&
      window.document &&
      window.document.createElement &&
      window.setTimeout
    );
  },
  Bt = { isSsr: HS() };
function qr(e) {
  "@babel/helpers - typeof";
  return (
    (qr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    qr(e)
  );
}
function Iy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Ry(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Iy(Object(r), !0).forEach(function (n) {
          wp(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Iy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function KS(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function GS(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, ux(n.key), n));
  }
}
function VS(e, t, r) {
  return (t && GS(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function XS(e, t, r) {
  return (
    (t = Ji(t)),
    YS(e, ox() ? Reflect.construct(t, r || [], Ji(e).constructor) : t.apply(e, r))
  );
}
function YS(e, t) {
  if (t && (qr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return ZS(e);
}
function ZS(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function ox() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (ox = function () {
    return !!e;
  })();
}
function Ji(e) {
  return (
    (Ji = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Ji(e)
  );
}
function JS(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Vl(e, t));
}
function Vl(e, t) {
  return (
    (Vl = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Vl(e, t)
  );
}
function wp(e, t, r) {
  return (
    (t = ux(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function ux(e) {
  var t = QS(e, "string");
  return qr(t) == "symbol" ? t : t + "";
}
function QS(e, t) {
  if (qr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (qr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function eP(e) {
  return e.dataKey;
}
function tP(e, t) {
  return S.isValidElement(e)
    ? S.cloneElement(e, t)
    : typeof e == "function"
      ? S.createElement(e, t)
      : S.createElement(jS, t);
}
var bt = (function (e) {
  function t() {
    return (KS(this, t), XS(this, t, arguments));
  }
  return (
    JS(t, e),
    VS(t, [
      {
        key: "render",
        value: function () {
          var n = this,
            i = this.props,
            a = i.active,
            o = i.allowEscapeViewBox,
            u = i.animationDuration,
            c = i.animationEasing,
            s = i.content,
            l = i.coordinate,
            f = i.filterNull,
            p = i.isAnimationActive,
            d = i.offset,
            y = i.payload,
            v = i.payloadUniqBy,
            h = i.position,
            g = i.reverseDirection,
            x = i.useTranslate3d,
            w = i.viewBox,
            O = i.wrapperStyle,
            m = y ?? [];
          f &&
            m.length &&
            (m = Z0(
              y.filter(function (_) {
                return _.value != null && (_.hide !== !0 || n.props.includeHidden);
              }),
              v,
              eP,
            ));
          var b = m.length > 0;
          return S.createElement(
            zS,
            {
              allowEscapeViewBox: o,
              animationDuration: u,
              animationEasing: c,
              isAnimationActive: p,
              active: a,
              coordinate: l,
              hasPayload: b,
              offset: d,
              position: h,
              reverseDirection: g,
              useTranslate3d: x,
              viewBox: w,
              wrapperStyle: O,
            },
            tP(s, Ry(Ry({}, this.props), {}, { payload: m })),
          );
        },
      },
    ])
  );
})(L.PureComponent);
wp(bt, "displayName", "Tooltip");
wp(bt, "defaultProps", {
  accessibilityLayer: !1,
  allowEscapeViewBox: { x: !1, y: !1 },
  animationDuration: 400,
  animationEasing: "ease",
  contentStyle: {},
  coordinate: { x: 0, y: 0 },
  cursor: !0,
  cursorStyle: {},
  filterNull: !0,
  isAnimationActive: !Bt.isSsr,
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: { x: !1, y: !1 },
  separator: " : ",
  trigger: "hover",
  useTranslate3d: !1,
  viewBox: { x: 0, y: 0, height: 0, width: 0 },
  wrapperStyle: {},
});
var js, ky;
function rP() {
  if (ky) return js;
  ky = 1;
  var e = yt(),
    t = function () {
      return e.Date.now();
    };
  return ((js = t), js);
}
var $s, Dy;
function nP() {
  if (Dy) return $s;
  Dy = 1;
  var e = /\s/;
  function t(r) {
    for (var n = r.length; n-- && e.test(r.charAt(n)); );
    return n;
  }
  return (($s = t), $s);
}
var Ms, Ny;
function iP() {
  if (Ny) return Ms;
  Ny = 1;
  var e = nP(),
    t = /^\s+/;
  function r(n) {
    return n && n.slice(0, e(n) + 1).replace(t, "");
  }
  return ((Ms = r), Ms);
}
var Cs, qy;
function cx() {
  if (qy) return Cs;
  qy = 1;
  var e = iP(),
    t = Lt(),
    r = un(),
    n = NaN,
    i = /^[-+]0x[0-9a-f]+$/i,
    a = /^0b[01]+$/i,
    o = /^0o[0-7]+$/i,
    u = parseInt;
  function c(s) {
    if (typeof s == "number") return s;
    if (r(s)) return n;
    if (t(s)) {
      var l = typeof s.valueOf == "function" ? s.valueOf() : s;
      s = t(l) ? l + "" : l;
    }
    if (typeof s != "string") return s === 0 ? s : +s;
    s = e(s);
    var f = a.test(s);
    return f || o.test(s) ? u(s.slice(2), f ? 2 : 8) : i.test(s) ? n : +s;
  }
  return ((Cs = c), Cs);
}
var Is, Ly;
function aP() {
  if (Ly) return Is;
  Ly = 1;
  var e = Lt(),
    t = rP(),
    r = cx(),
    n = "Expected a function",
    i = Math.max,
    a = Math.min;
  function o(u, c, s) {
    var l,
      f,
      p,
      d,
      y,
      v,
      h = 0,
      g = !1,
      x = !1,
      w = !0;
    if (typeof u != "function") throw new TypeError(n);
    ((c = r(c) || 0),
      e(s) &&
        ((g = !!s.leading),
        (x = "maxWait" in s),
        (p = x ? i(r(s.maxWait) || 0, c) : p),
        (w = "trailing" in s ? !!s.trailing : w)));
    function O(C) {
      var I = l,
        R = f;
      return ((l = f = void 0), (h = C), (d = u.apply(R, I)), d);
    }
    function m(C) {
      return ((h = C), (y = setTimeout(A, c)), g ? O(C) : d);
    }
    function b(C) {
      var I = C - v,
        R = C - h,
        k = c - I;
      return x ? a(k, p - R) : k;
    }
    function _(C) {
      var I = C - v,
        R = C - h;
      return v === void 0 || I >= c || I < 0 || (x && R >= p);
    }
    function A() {
      var C = t();
      if (_(C)) return T(C);
      y = setTimeout(A, b(C));
    }
    function T(C) {
      return ((y = void 0), w && l ? O(C) : ((l = f = void 0), d));
    }
    function $() {
      (y !== void 0 && clearTimeout(y), (h = 0), (l = v = f = y = void 0));
    }
    function j() {
      return y === void 0 ? d : T(t());
    }
    function E() {
      var C = t(),
        I = _(C);
      if (((l = arguments), (f = this), (v = C), I)) {
        if (y === void 0) return m(v);
        if (x) return (clearTimeout(y), (y = setTimeout(A, c)), O(v));
      }
      return (y === void 0 && (y = setTimeout(A, c)), d);
    }
    return ((E.cancel = $), (E.flush = j), E);
  }
  return ((Is = o), Is);
}
var Rs, By;
function oP() {
  if (By) return Rs;
  By = 1;
  var e = aP(),
    t = Lt(),
    r = "Expected a function";
  function n(i, a, o) {
    var u = !0,
      c = !0;
    if (typeof i != "function") throw new TypeError(r);
    return (
      t(o) && ((u = "leading" in o ? !!o.leading : u), (c = "trailing" in o ? !!o.trailing : c)),
      e(i, a, { leading: u, maxWait: a, trailing: c })
    );
  }
  return ((Rs = n), Rs);
}
var uP = oP();
const sx = le(uP);
function Ln(e) {
  "@babel/helpers - typeof";
  return (
    (Ln =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Ln(e)
  );
}
function Fy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function $i(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Fy(Object(r), !0).forEach(function (n) {
          cP(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Fy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function cP(e, t, r) {
  return (
    (t = sP(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function sP(e) {
  var t = lP(e, "string");
  return Ln(t) == "symbol" ? t : t + "";
}
function lP(e, t) {
  if (Ln(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ln(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function fP(e, t) {
  return vP(e) || dP(e, t) || hP(e, t) || pP();
}
function pP() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function hP(e, t) {
  if (e) {
    if (typeof e == "string") return Uy(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Uy(e, t);
  }
}
function Uy(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function dP(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function vP(e) {
  if (Array.isArray(e)) return e;
}
var Eq = L.forwardRef(function (e, t) {
    var r = e.aspect,
      n = e.initialDimension,
      i = n === void 0 ? { width: -1, height: -1 } : n,
      a = e.width,
      o = a === void 0 ? "100%" : a,
      u = e.height,
      c = u === void 0 ? "100%" : u,
      s = e.minWidth,
      l = s === void 0 ? 0 : s,
      f = e.minHeight,
      p = e.maxHeight,
      d = e.children,
      y = e.debounce,
      v = y === void 0 ? 0 : y,
      h = e.id,
      g = e.className,
      x = e.onResize,
      w = e.style,
      O = w === void 0 ? {} : w,
      m = L.useRef(null),
      b = L.useRef();
    ((b.current = x),
      L.useImperativeHandle(t, function () {
        return Object.defineProperty(m.current, "current", {
          get: function () {
            return (
              console.warn(
                "The usage of ref.current.current is deprecated and will no longer be supported.",
              ),
              m.current
            );
          },
          configurable: !0,
        });
      }));
    var _ = L.useState({ containerWidth: i.width, containerHeight: i.height }),
      A = fP(_, 2),
      T = A[0],
      $ = A[1],
      j = L.useCallback(function (C, I) {
        $(function (R) {
          var k = Math.round(C),
            N = Math.round(I);
          return R.containerWidth === k && R.containerHeight === N
            ? R
            : { containerWidth: k, containerHeight: N };
        });
      }, []);
    L.useEffect(
      function () {
        var C = function (z) {
          var K,
            P = z[0].contentRect,
            M = P.width,
            F = P.height;
          (j(M, F), (K = b.current) === null || K === void 0 || K.call(b, M, F));
        };
        v > 0 && (C = sx(C, v, { trailing: !0, leading: !1 }));
        var I = new ResizeObserver(C),
          R = m.current.getBoundingClientRect(),
          k = R.width,
          N = R.height;
        return (
          j(k, N),
          I.observe(m.current),
          function () {
            I.disconnect();
          }
        );
      },
      [j, v],
    );
    var E = L.useMemo(
      function () {
        var C = T.containerWidth,
          I = T.containerHeight;
        if (C < 0 || I < 0) return null;
        (ut(
          Qt(o) || Qt(c),
          `The width(%s) and height(%s) are both fixed numbers,
       maybe you don't need to use a ResponsiveContainer.`,
          o,
          c,
        ),
          ut(!r || r > 0, "The aspect(%s) must be greater than zero.", r));
        var R = Qt(o) ? C : o,
          k = Qt(c) ? I : c;
        (r && r > 0 && (R ? (k = R / r) : k && (R = k * r), p && k > p && (k = p)),
          ut(
            R > 0 || k > 0,
            `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`,
            R,
            k,
            o,
            c,
            l,
            f,
            r,
          ));
        var N = !Array.isArray(d) && At(d.type).endsWith("Chart");
        return S.Children.map(d, function (W) {
          return S.isValidElement(W)
            ? L.cloneElement(
                W,
                $i(
                  { width: R, height: k },
                  N
                    ? {
                        style: $i(
                          { height: "100%", width: "100%", maxHeight: k, maxWidth: R },
                          W.props.style,
                        ),
                      }
                    : {},
                ),
              )
            : W;
        });
      },
      [r, d, c, p, f, l, T, o],
    );
    return S.createElement(
      "div",
      {
        id: h ? "".concat(h) : void 0,
        className: te("recharts-responsive-container", g),
        style: $i($i({}, O), {}, { width: o, height: c, minWidth: l, minHeight: f, maxHeight: p }),
        ref: m,
      },
      E,
    );
  }),
  Op = function (t) {
    return null;
  };
Op.displayName = "Cell";
function Bn(e) {
  "@babel/helpers - typeof";
  return (
    (Bn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Bn(e)
  );
}
function Wy(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Xl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Wy(Object(r), !0).forEach(function (n) {
          yP(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Wy(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function yP(e, t, r) {
  return (
    (t = mP(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function mP(e) {
  var t = gP(e, "string");
  return Bn(t) == "symbol" ? t : t + "";
}
function gP(e, t) {
  if (Bn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Bn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var wr = { widthCache: {}, cacheCount: 0 },
  bP = 2e3,
  xP = {
    position: "absolute",
    top: "-20000px",
    left: 0,
    padding: 0,
    margin: 0,
    border: "none",
    whiteSpace: "pre",
  },
  zy = "recharts_measurement_span";
function wP(e) {
  var t = Xl({}, e);
  return (
    Object.keys(t).forEach(function (r) {
      t[r] || delete t[r];
    }),
    t
  );
}
var En = function (t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (t == null || Bt.isSsr) return { width: 0, height: 0 };
    var n = wP(r),
      i = JSON.stringify({ text: t, copyStyle: n });
    if (wr.widthCache[i]) return wr.widthCache[i];
    try {
      var a = document.getElementById(zy);
      a ||
        ((a = document.createElement("span")),
        a.setAttribute("id", zy),
        a.setAttribute("aria-hidden", "true"),
        document.body.appendChild(a));
      var o = Xl(Xl({}, xP), n);
      (Object.assign(a.style, o), (a.textContent = "".concat(t)));
      var u = a.getBoundingClientRect(),
        c = { width: u.width, height: u.height };
      return (
        (wr.widthCache[i] = c),
        ++wr.cacheCount > bP && ((wr.cacheCount = 0), (wr.widthCache = {})),
        c
      );
    } catch {
      return { width: 0, height: 0 };
    }
  },
  OP = function (t) {
    return {
      top: t.top + window.scrollY - document.documentElement.clientTop,
      left: t.left + window.scrollX - document.documentElement.clientLeft,
    };
  };
function Fn(e) {
  "@babel/helpers - typeof";
  return (
    (Fn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Fn(e)
  );
}
function Qi(e, t) {
  return PP(e) || SP(e, t) || AP(e, t) || _P();
}
function _P() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function AP(e, t) {
  if (e) {
    if (typeof e == "string") return Hy(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Hy(e, t);
  }
}
function Hy(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function SP(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t === 0)) {
        if (Object(r) !== r) return;
        c = !1;
      } else for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function PP(e) {
  if (Array.isArray(e)) return e;
}
function TP(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Ky(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, jP(n.key), n));
  }
}
function EP(e, t, r) {
  return (
    t && Ky(e.prototype, t),
    r && Ky(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function jP(e) {
  var t = $P(e, "string");
  return Fn(t) == "symbol" ? t : t + "";
}
function $P(e, t) {
  if (Fn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Fn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Gy = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
  Vy = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
  MP = /^px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q$/,
  CP = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/,
  lx = {
    cm: 96 / 2.54,
    mm: 96 / 25.4,
    pt: 96 / 72,
    pc: 96 / 6,
    in: 96,
    Q: 96 / (2.54 * 40),
    px: 1,
  },
  IP = Object.keys(lx),
  Sr = "NaN";
function RP(e, t) {
  return e * lx[t];
}
var Mi = (function () {
  function e(t, r) {
    (TP(this, e),
      (this.num = t),
      (this.unit = r),
      (this.num = t),
      (this.unit = r),
      Number.isNaN(t) && (this.unit = ""),
      r !== "" && !MP.test(r) && ((this.num = NaN), (this.unit = "")),
      IP.includes(r) && ((this.num = RP(t, r)), (this.unit = "px")));
  }
  return EP(
    e,
    [
      {
        key: "add",
        value: function (r) {
          return this.unit !== r.unit ? new e(NaN, "") : new e(this.num + r.num, this.unit);
        },
      },
      {
        key: "subtract",
        value: function (r) {
          return this.unit !== r.unit ? new e(NaN, "") : new e(this.num - r.num, this.unit);
        },
      },
      {
        key: "multiply",
        value: function (r) {
          return this.unit !== "" && r.unit !== "" && this.unit !== r.unit
            ? new e(NaN, "")
            : new e(this.num * r.num, this.unit || r.unit);
        },
      },
      {
        key: "divide",
        value: function (r) {
          return this.unit !== "" && r.unit !== "" && this.unit !== r.unit
            ? new e(NaN, "")
            : new e(this.num / r.num, this.unit || r.unit);
        },
      },
      {
        key: "toString",
        value: function () {
          return "".concat(this.num).concat(this.unit);
        },
      },
      {
        key: "isNaN",
        value: function () {
          return Number.isNaN(this.num);
        },
      },
    ],
    [
      {
        key: "parse",
        value: function (r) {
          var n,
            i = (n = CP.exec(r)) !== null && n !== void 0 ? n : [],
            a = Qi(i, 3),
            o = a[1],
            u = a[2];
          return new e(parseFloat(o), u ?? "");
        },
      },
    ],
  );
})();
function fx(e) {
  if (e.includes(Sr)) return Sr;
  for (var t = e; t.includes("*") || t.includes("/"); ) {
    var r,
      n = (r = Gy.exec(t)) !== null && r !== void 0 ? r : [],
      i = Qi(n, 4),
      a = i[1],
      o = i[2],
      u = i[3],
      c = Mi.parse(a ?? ""),
      s = Mi.parse(u ?? ""),
      l = o === "*" ? c.multiply(s) : c.divide(s);
    if (l.isNaN()) return Sr;
    t = t.replace(Gy, l.toString());
  }
  for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t); ) {
    var f,
      p = (f = Vy.exec(t)) !== null && f !== void 0 ? f : [],
      d = Qi(p, 4),
      y = d[1],
      v = d[2],
      h = d[3],
      g = Mi.parse(y ?? ""),
      x = Mi.parse(h ?? ""),
      w = v === "+" ? g.add(x) : g.subtract(x);
    if (w.isNaN()) return Sr;
    t = t.replace(Vy, w.toString());
  }
  return t;
}
var Xy = /\(([^()]*)\)/;
function kP(e) {
  for (var t = e; t.includes("("); ) {
    var r = Xy.exec(t),
      n = Qi(r, 2),
      i = n[1];
    t = t.replace(Xy, fx(i));
  }
  return t;
}
function DP(e) {
  var t = e.replace(/\s+/g, "");
  return ((t = kP(t)), (t = fx(t)), t);
}
function NP(e) {
  try {
    return DP(e);
  } catch {
    return Sr;
  }
}
function ks(e) {
  var t = NP(e.slice(5, -1));
  return t === Sr ? "" : t;
}
var qP = [
    "x",
    "y",
    "lineHeight",
    "capHeight",
    "scaleToFit",
    "textAnchor",
    "verticalAnchor",
    "fill",
  ],
  LP = ["dx", "dy", "angle", "className", "breakAll"];
function Yl() {
  return (
    (Yl = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Yl.apply(this, arguments)
  );
}
function Yy(e, t) {
  if (e == null) return {};
  var r = BP(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function BP(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Zy(e, t) {
  return zP(e) || WP(e, t) || UP(e, t) || FP();
}
function FP() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function UP(e, t) {
  if (e) {
    if (typeof e == "string") return Jy(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Jy(e, t);
  }
}
function Jy(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function WP(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t === 0)) {
        if (Object(r) !== r) return;
        c = !1;
      } else for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function zP(e) {
  if (Array.isArray(e)) return e;
}
var px = /[ \f\n\r\t\v\u2028\u2029]+/,
  hx = function (t) {
    var r = t.children,
      n = t.breakAll,
      i = t.style;
    try {
      var a = [];
      J(r) || (n ? (a = r.toString().split("")) : (a = r.toString().split(px)));
      var o = a.map(function (c) {
          return { word: c, width: En(c, i).width };
        }),
        u = n ? 0 : En(" ", i).width;
      return { wordsWithComputedWidth: o, spaceWidth: u };
    } catch {
      return null;
    }
  },
  HP = function (t, r, n, i, a) {
    var o = t.maxLines,
      u = t.children,
      c = t.style,
      s = t.breakAll,
      l = B(o),
      f = u,
      p = function () {
        var R = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
        return R.reduce(function (k, N) {
          var W = N.word,
            z = N.width,
            K = k[k.length - 1];
          if (K && (i == null || a || K.width + z + n < Number(i)))
            (K.words.push(W), (K.width += z + n));
          else {
            var P = { words: [W], width: z };
            k.push(P);
          }
          return k;
        }, []);
      },
      d = p(r),
      y = function (R) {
        return R.reduce(function (k, N) {
          return k.width > N.width ? k : N;
        });
      };
    if (!l) return d;
    for (
      var v = "…",
        h = function (R) {
          var k = f.slice(0, R),
            N = hx({ breakAll: s, style: c, children: k + v }).wordsWithComputedWidth,
            W = p(N),
            z = W.length > o || y(W).width > Number(i);
          return [z, W];
        },
        g = 0,
        x = f.length - 1,
        w = 0,
        O;
      g <= x && w <= f.length - 1;
    ) {
      var m = Math.floor((g + x) / 2),
        b = m - 1,
        _ = h(b),
        A = Zy(_, 2),
        T = A[0],
        $ = A[1],
        j = h(m),
        E = Zy(j, 1),
        C = E[0];
      if ((!T && !C && (g = m + 1), T && C && (x = m - 1), !T && C)) {
        O = $;
        break;
      }
      w++;
    }
    return O || d;
  },
  Qy = function (t) {
    var r = J(t) ? [] : t.toString().split(px);
    return [{ words: r }];
  },
  KP = function (t) {
    var r = t.width,
      n = t.scaleToFit,
      i = t.children,
      a = t.style,
      o = t.breakAll,
      u = t.maxLines;
    if ((r || n) && !Bt.isSsr) {
      var c,
        s,
        l = hx({ breakAll: o, children: i, style: a });
      if (l) {
        var f = l.wordsWithComputedWidth,
          p = l.spaceWidth;
        ((c = f), (s = p));
      } else return Qy(i);
      return HP({ breakAll: o, children: i, maxLines: u, style: a }, c, s, r, n);
    }
    return Qy(i);
  },
  em = "#808080",
  sr = function (t) {
    var r = t.x,
      n = r === void 0 ? 0 : r,
      i = t.y,
      a = i === void 0 ? 0 : i,
      o = t.lineHeight,
      u = o === void 0 ? "1em" : o,
      c = t.capHeight,
      s = c === void 0 ? "0.71em" : c,
      l = t.scaleToFit,
      f = l === void 0 ? !1 : l,
      p = t.textAnchor,
      d = p === void 0 ? "start" : p,
      y = t.verticalAnchor,
      v = y === void 0 ? "end" : y,
      h = t.fill,
      g = h === void 0 ? em : h,
      x = Yy(t, qP),
      w = L.useMemo(
        function () {
          return KP({
            breakAll: x.breakAll,
            children: x.children,
            maxLines: x.maxLines,
            scaleToFit: f,
            style: x.style,
            width: x.width,
          });
        },
        [x.breakAll, x.children, x.maxLines, f, x.style, x.width],
      ),
      O = x.dx,
      m = x.dy,
      b = x.angle,
      _ = x.className,
      A = x.breakAll,
      T = Yy(x, LP);
    if (!je(n) || !je(a)) return null;
    var $ = n + (B(O) ? O : 0),
      j = a + (B(m) ? m : 0),
      E;
    switch (v) {
      case "start":
        E = ks("calc(".concat(s, ")"));
        break;
      case "middle":
        E = ks(
          "calc("
            .concat((w.length - 1) / 2, " * -")
            .concat(u, " + (")
            .concat(s, " / 2))"),
        );
        break;
      default:
        E = ks("calc(".concat(w.length - 1, " * -").concat(u, ")"));
        break;
    }
    var C = [];
    if (f) {
      var I = w[0].width,
        R = x.width;
      C.push("scale(".concat((B(R) ? R / I : 1) / I, ")"));
    }
    return (
      b && C.push("rotate(".concat(b, ", ").concat($, ", ").concat(j, ")")),
      C.length && (T.transform = C.join(" ")),
      S.createElement(
        "text",
        Yl({}, V(T, !0), {
          x: $,
          y: j,
          className: te("recharts-text", _),
          textAnchor: d,
          fill: g.includes("url") ? em : g,
        }),
        w.map(function (k, N) {
          var W = k.words.join(A ? "" : " ");
          return S.createElement(
            "tspan",
            { x: $, dy: N === 0 ? E : u, key: "".concat(W, "-").concat(N) },
            W,
          );
        }),
      )
    );
  };
function qt(e, t) {
  return e == null || t == null ? NaN : e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function GP(e, t) {
  return e == null || t == null ? NaN : t < e ? -1 : t > e ? 1 : t >= e ? 0 : NaN;
}
function _p(e) {
  let t, r, n;
  e.length !== 2
    ? ((t = qt), (r = (u, c) => qt(e(u), c)), (n = (u, c) => e(u) - c))
    : ((t = e === qt || e === GP ? e : VP), (r = e), (n = e));
  function i(u, c, s = 0, l = u.length) {
    if (s < l) {
      if (t(c, c) !== 0) return l;
      do {
        const f = (s + l) >>> 1;
        r(u[f], c) < 0 ? (s = f + 1) : (l = f);
      } while (s < l);
    }
    return s;
  }
  function a(u, c, s = 0, l = u.length) {
    if (s < l) {
      if (t(c, c) !== 0) return l;
      do {
        const f = (s + l) >>> 1;
        r(u[f], c) <= 0 ? (s = f + 1) : (l = f);
      } while (s < l);
    }
    return s;
  }
  function o(u, c, s = 0, l = u.length) {
    const f = i(u, c, s, l - 1);
    return f > s && n(u[f - 1], c) > -n(u[f], c) ? f - 1 : f;
  }
  return { left: i, center: o, right: a };
}
function VP() {
  return 0;
}
function dx(e) {
  return e === null ? NaN : +e;
}
function* XP(e, t) {
  for (let r of e) r != null && (r = +r) >= r && (yield r);
}
const YP = _p(qt),
  gi = YP.right;
_p(dx).center;
class tm extends Map {
  constructor(t, r = QP) {
    if (
      (super(),
      Object.defineProperties(this, { _intern: { value: new Map() }, _key: { value: r } }),
      t != null)
    )
      for (const [n, i] of t) this.set(n, i);
  }
  get(t) {
    return super.get(rm(this, t));
  }
  has(t) {
    return super.has(rm(this, t));
  }
  set(t, r) {
    return super.set(ZP(this, t), r);
  }
  delete(t) {
    return super.delete(JP(this, t));
  }
}
function rm({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : r;
}
function ZP({ _intern: e, _key: t }, r) {
  const n = t(r);
  return e.has(n) ? e.get(n) : (e.set(n, r), r);
}
function JP({ _intern: e, _key: t }, r) {
  const n = t(r);
  return (e.has(n) && ((r = e.get(n)), e.delete(n)), r);
}
function QP(e) {
  return e !== null && typeof e == "object" ? e.valueOf() : e;
}
function eT(e = qt) {
  if (e === qt) return vx;
  if (typeof e != "function") throw new TypeError("compare is not a function");
  return (t, r) => {
    const n = e(t, r);
    return n || n === 0 ? n : (e(r, r) === 0) - (e(t, t) === 0);
  };
}
function vx(e, t) {
  return (e == null || !(e >= e)) - (t == null || !(t >= t)) || (e < t ? -1 : e > t ? 1 : 0);
}
const tT = Math.sqrt(50),
  rT = Math.sqrt(10),
  nT = Math.sqrt(2);
function ea(e, t, r) {
  const n = (t - e) / Math.max(0, r),
    i = Math.floor(Math.log10(n)),
    a = n / Math.pow(10, i),
    o = a >= tT ? 10 : a >= rT ? 5 : a >= nT ? 2 : 1;
  let u, c, s;
  return (
    i < 0
      ? ((s = Math.pow(10, -i) / o),
        (u = Math.round(e * s)),
        (c = Math.round(t * s)),
        u / s < e && ++u,
        c / s > t && --c,
        (s = -s))
      : ((s = Math.pow(10, i) * o),
        (u = Math.round(e / s)),
        (c = Math.round(t / s)),
        u * s < e && ++u,
        c * s > t && --c),
    c < u && 0.5 <= r && r < 2 ? ea(e, t, r * 2) : [u, c, s]
  );
}
function Zl(e, t, r) {
  if (((t = +t), (e = +e), (r = +r), !(r > 0))) return [];
  if (e === t) return [e];
  const n = t < e,
    [i, a, o] = n ? ea(t, e, r) : ea(e, t, r);
  if (!(a >= i)) return [];
  const u = a - i + 1,
    c = new Array(u);
  if (n)
    if (o < 0) for (let s = 0; s < u; ++s) c[s] = (a - s) / -o;
    else for (let s = 0; s < u; ++s) c[s] = (a - s) * o;
  else if (o < 0) for (let s = 0; s < u; ++s) c[s] = (i + s) / -o;
  else for (let s = 0; s < u; ++s) c[s] = (i + s) * o;
  return c;
}
function Jl(e, t, r) {
  return ((t = +t), (e = +e), (r = +r), ea(e, t, r)[2]);
}
function Ql(e, t, r) {
  ((t = +t), (e = +e), (r = +r));
  const n = t < e,
    i = n ? Jl(t, e, r) : Jl(e, t, r);
  return (n ? -1 : 1) * (i < 0 ? 1 / -i : i);
}
function nm(e, t) {
  let r;
  for (const n of e) n != null && (r < n || (r === void 0 && n >= n)) && (r = n);
  return r;
}
function im(e, t) {
  let r;
  for (const n of e) n != null && (r > n || (r === void 0 && n >= n)) && (r = n);
  return r;
}
function yx(e, t, r = 0, n = 1 / 0, i) {
  if (
    ((t = Math.floor(t)),
    (r = Math.floor(Math.max(0, r))),
    (n = Math.floor(Math.min(e.length - 1, n))),
    !(r <= t && t <= n))
  )
    return e;
  for (i = i === void 0 ? vx : eT(i); n > r; ) {
    if (n - r > 600) {
      const c = n - r + 1,
        s = t - r + 1,
        l = Math.log(c),
        f = 0.5 * Math.exp((2 * l) / 3),
        p = 0.5 * Math.sqrt((l * f * (c - f)) / c) * (s - c / 2 < 0 ? -1 : 1),
        d = Math.max(r, Math.floor(t - (s * f) / c + p)),
        y = Math.min(n, Math.floor(t + ((c - s) * f) / c + p));
      yx(e, t, d, y, i);
    }
    const a = e[t];
    let o = r,
      u = n;
    for (mn(e, r, t), i(e[n], a) > 0 && mn(e, r, n); o < u; ) {
      for (mn(e, o, u), ++o, --u; i(e[o], a) < 0; ) ++o;
      for (; i(e[u], a) > 0; ) --u;
    }
    (i(e[r], a) === 0 ? mn(e, r, u) : (++u, mn(e, u, n)),
      u <= t && (r = u + 1),
      t <= u && (n = u - 1));
  }
  return e;
}
function mn(e, t, r) {
  const n = e[t];
  ((e[t] = e[r]), (e[r] = n));
}
function iT(e, t, r) {
  if (((e = Float64Array.from(XP(e))), !(!(n = e.length) || isNaN((t = +t))))) {
    if (t <= 0 || n < 2) return im(e);
    if (t >= 1) return nm(e);
    var n,
      i = (n - 1) * t,
      a = Math.floor(i),
      o = nm(yx(e, a).subarray(0, a + 1)),
      u = im(e.subarray(a + 1));
    return o + (u - o) * (i - a);
  }
}
function aT(e, t, r = dx) {
  if (!(!(n = e.length) || isNaN((t = +t)))) {
    if (t <= 0 || n < 2) return +r(e[0], 0, e);
    if (t >= 1) return +r(e[n - 1], n - 1, e);
    var n,
      i = (n - 1) * t,
      a = Math.floor(i),
      o = +r(e[a], a, e),
      u = +r(e[a + 1], a + 1, e);
    return o + (u - o) * (i - a);
  }
}
function oT(e, t, r) {
  ((e = +e), (t = +t), (r = (i = arguments.length) < 2 ? ((t = e), (e = 0), 1) : i < 3 ? 1 : +r));
  for (var n = -1, i = Math.max(0, Math.ceil((t - e) / r)) | 0, a = new Array(i); ++n < i; )
    a[n] = e + n * r;
  return a;
}
function rt(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
      break;
  }
  return this;
}
function Mt(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1: {
      typeof e == "function" ? this.interpolator(e) : this.range(e);
      break;
    }
    default: {
      (this.domain(e), typeof t == "function" ? this.interpolator(t) : this.range(t));
      break;
    }
  }
  return this;
}
const ef = Symbol("implicit");
function Ap() {
  var e = new tm(),
    t = [],
    r = [],
    n = ef;
  function i(a) {
    let o = e.get(a);
    if (o === void 0) {
      if (n !== ef) return n;
      e.set(a, (o = t.push(a) - 1));
    }
    return r[o % r.length];
  }
  return (
    (i.domain = function (a) {
      if (!arguments.length) return t.slice();
      ((t = []), (e = new tm()));
      for (const o of a) e.has(o) || e.set(o, t.push(o) - 1);
      return i;
    }),
    (i.range = function (a) {
      return arguments.length ? ((r = Array.from(a)), i) : r.slice();
    }),
    (i.unknown = function (a) {
      return arguments.length ? ((n = a), i) : n;
    }),
    (i.copy = function () {
      return Ap(t, r).unknown(n);
    }),
    rt.apply(i, arguments),
    i
  );
}
function Un() {
  var e = Ap().unknown(void 0),
    t = e.domain,
    r = e.range,
    n = 0,
    i = 1,
    a,
    o,
    u = !1,
    c = 0,
    s = 0,
    l = 0.5;
  delete e.unknown;
  function f() {
    var p = t().length,
      d = i < n,
      y = d ? i : n,
      v = d ? n : i;
    ((a = (v - y) / Math.max(1, p - c + s * 2)),
      u && (a = Math.floor(a)),
      (y += (v - y - a * (p - c)) * l),
      (o = a * (1 - c)),
      u && ((y = Math.round(y)), (o = Math.round(o))));
    var h = oT(p).map(function (g) {
      return y + a * g;
    });
    return r(d ? h.reverse() : h);
  }
  return (
    (e.domain = function (p) {
      return arguments.length ? (t(p), f()) : t();
    }),
    (e.range = function (p) {
      return arguments.length ? (([n, i] = p), (n = +n), (i = +i), f()) : [n, i];
    }),
    (e.rangeRound = function (p) {
      return (([n, i] = p), (n = +n), (i = +i), (u = !0), f());
    }),
    (e.bandwidth = function () {
      return o;
    }),
    (e.step = function () {
      return a;
    }),
    (e.round = function (p) {
      return arguments.length ? ((u = !!p), f()) : u;
    }),
    (e.padding = function (p) {
      return arguments.length ? ((c = Math.min(1, (s = +p))), f()) : c;
    }),
    (e.paddingInner = function (p) {
      return arguments.length ? ((c = Math.min(1, p)), f()) : c;
    }),
    (e.paddingOuter = function (p) {
      return arguments.length ? ((s = +p), f()) : s;
    }),
    (e.align = function (p) {
      return arguments.length ? ((l = Math.max(0, Math.min(1, p))), f()) : l;
    }),
    (e.copy = function () {
      return Un(t(), [n, i]).round(u).paddingInner(c).paddingOuter(s).align(l);
    }),
    rt.apply(f(), arguments)
  );
}
function mx(e) {
  var t = e.copy;
  return (
    (e.padding = e.paddingOuter),
    delete e.paddingInner,
    delete e.paddingOuter,
    (e.copy = function () {
      return mx(t());
    }),
    e
  );
}
function jn() {
  return mx(Un.apply(null, arguments).paddingInner(1));
}
function Sp(e, t, r) {
  ((e.prototype = t.prototype = r), (r.constructor = e));
}
function gx(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function bi() {}
var Wn = 0.7,
  ta = 1 / Wn,
  Cr = "\\s*([+-]?\\d+)\\s*",
  zn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
  pt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
  uT = /^#([0-9a-f]{3,8})$/,
  cT = new RegExp(`^rgb\\(${Cr},${Cr},${Cr}\\)$`),
  sT = new RegExp(`^rgb\\(${pt},${pt},${pt}\\)$`),
  lT = new RegExp(`^rgba\\(${Cr},${Cr},${Cr},${zn}\\)$`),
  fT = new RegExp(`^rgba\\(${pt},${pt},${pt},${zn}\\)$`),
  pT = new RegExp(`^hsl\\(${zn},${pt},${pt}\\)$`),
  hT = new RegExp(`^hsla\\(${zn},${pt},${pt},${zn}\\)$`),
  am = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  };
Sp(bi, Hn, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: om,
  formatHex: om,
  formatHex8: dT,
  formatHsl: vT,
  formatRgb: um,
  toString: um,
});
function om() {
  return this.rgb().formatHex();
}
function dT() {
  return this.rgb().formatHex8();
}
function vT() {
  return bx(this).formatHsl();
}
function um() {
  return this.rgb().formatRgb();
}
function Hn(e) {
  var t, r;
  return (
    (e = (e + "").trim().toLowerCase()),
    (t = uT.exec(e))
      ? ((r = t[1].length),
        (t = parseInt(t[1], 16)),
        r === 6
          ? cm(t)
          : r === 3
            ? new Ue(
                ((t >> 8) & 15) | ((t >> 4) & 240),
                ((t >> 4) & 15) | (t & 240),
                ((t & 15) << 4) | (t & 15),
                1,
              )
            : r === 8
              ? Ci((t >> 24) & 255, (t >> 16) & 255, (t >> 8) & 255, (t & 255) / 255)
              : r === 4
                ? Ci(
                    ((t >> 12) & 15) | ((t >> 8) & 240),
                    ((t >> 8) & 15) | ((t >> 4) & 240),
                    ((t >> 4) & 15) | (t & 240),
                    (((t & 15) << 4) | (t & 15)) / 255,
                  )
                : null)
      : (t = cT.exec(e))
        ? new Ue(t[1], t[2], t[3], 1)
        : (t = sT.exec(e))
          ? new Ue((t[1] * 255) / 100, (t[2] * 255) / 100, (t[3] * 255) / 100, 1)
          : (t = lT.exec(e))
            ? Ci(t[1], t[2], t[3], t[4])
            : (t = fT.exec(e))
              ? Ci((t[1] * 255) / 100, (t[2] * 255) / 100, (t[3] * 255) / 100, t[4])
              : (t = pT.exec(e))
                ? fm(t[1], t[2] / 100, t[3] / 100, 1)
                : (t = hT.exec(e))
                  ? fm(t[1], t[2] / 100, t[3] / 100, t[4])
                  : am.hasOwnProperty(e)
                    ? cm(am[e])
                    : e === "transparent"
                      ? new Ue(NaN, NaN, NaN, 0)
                      : null
  );
}
function cm(e) {
  return new Ue((e >> 16) & 255, (e >> 8) & 255, e & 255, 1);
}
function Ci(e, t, r, n) {
  return (n <= 0 && (e = t = r = NaN), new Ue(e, t, r, n));
}
function yT(e) {
  return (
    e instanceof bi || (e = Hn(e)),
    e ? ((e = e.rgb()), new Ue(e.r, e.g, e.b, e.opacity)) : new Ue()
  );
}
function tf(e, t, r, n) {
  return arguments.length === 1 ? yT(e) : new Ue(e, t, r, n ?? 1);
}
function Ue(e, t, r, n) {
  ((this.r = +e), (this.g = +t), (this.b = +r), (this.opacity = +n));
}
Sp(
  Ue,
  tf,
  gx(bi, {
    brighter(e) {
      return (
        (e = e == null ? ta : Math.pow(ta, e)),
        new Ue(this.r * e, this.g * e, this.b * e, this.opacity)
      );
    },
    darker(e) {
      return (
        (e = e == null ? Wn : Math.pow(Wn, e)),
        new Ue(this.r * e, this.g * e, this.b * e, this.opacity)
      );
    },
    rgb() {
      return this;
    },
    clamp() {
      return new Ue(ir(this.r), ir(this.g), ir(this.b), ra(this.opacity));
    },
    displayable() {
      return (
        -0.5 <= this.r &&
        this.r < 255.5 &&
        -0.5 <= this.g &&
        this.g < 255.5 &&
        -0.5 <= this.b &&
        this.b < 255.5 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    hex: sm,
    formatHex: sm,
    formatHex8: mT,
    formatRgb: lm,
    toString: lm,
  }),
);
function sm() {
  return `#${er(this.r)}${er(this.g)}${er(this.b)}`;
}
function mT() {
  return `#${er(this.r)}${er(this.g)}${er(this.b)}${er((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function lm() {
  const e = ra(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${ir(this.r)}, ${ir(this.g)}, ${ir(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function ra(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function ir(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function er(e) {
  return ((e = ir(e)), (e < 16 ? "0" : "") + e.toString(16));
}
function fm(e, t, r, n) {
  return (
    n <= 0 ? (e = t = r = NaN) : r <= 0 || r >= 1 ? (e = t = NaN) : t <= 0 && (e = NaN),
    new ot(e, t, r, n)
  );
}
function bx(e) {
  if (e instanceof ot) return new ot(e.h, e.s, e.l, e.opacity);
  if ((e instanceof bi || (e = Hn(e)), !e)) return new ot();
  if (e instanceof ot) return e;
  e = e.rgb();
  var t = e.r / 255,
    r = e.g / 255,
    n = e.b / 255,
    i = Math.min(t, r, n),
    a = Math.max(t, r, n),
    o = NaN,
    u = a - i,
    c = (a + i) / 2;
  return (
    u
      ? (t === a
          ? (o = (r - n) / u + (r < n) * 6)
          : r === a
            ? (o = (n - t) / u + 2)
            : (o = (t - r) / u + 4),
        (u /= c < 0.5 ? a + i : 2 - a - i),
        (o *= 60))
      : (u = c > 0 && c < 1 ? 0 : o),
    new ot(o, u, c, e.opacity)
  );
}
function gT(e, t, r, n) {
  return arguments.length === 1 ? bx(e) : new ot(e, t, r, n ?? 1);
}
function ot(e, t, r, n) {
  ((this.h = +e), (this.s = +t), (this.l = +r), (this.opacity = +n));
}
Sp(
  ot,
  gT,
  gx(bi, {
    brighter(e) {
      return (
        (e = e == null ? ta : Math.pow(ta, e)),
        new ot(this.h, this.s, this.l * e, this.opacity)
      );
    },
    darker(e) {
      return (
        (e = e == null ? Wn : Math.pow(Wn, e)),
        new ot(this.h, this.s, this.l * e, this.opacity)
      );
    },
    rgb() {
      var e = (this.h % 360) + (this.h < 0) * 360,
        t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
        r = this.l,
        n = r + (r < 0.5 ? r : 1 - r) * t,
        i = 2 * r - n;
      return new Ue(
        Ds(e >= 240 ? e - 240 : e + 120, i, n),
        Ds(e, i, n),
        Ds(e < 120 ? e + 240 : e - 120, i, n),
        this.opacity,
      );
    },
    clamp() {
      return new ot(pm(this.h), Ii(this.s), Ii(this.l), ra(this.opacity));
    },
    displayable() {
      return (
        ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
        0 <= this.l &&
        this.l <= 1 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    formatHsl() {
      const e = ra(this.opacity);
      return `${e === 1 ? "hsl(" : "hsla("}${pm(this.h)}, ${Ii(this.s) * 100}%, ${Ii(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
    },
  }),
);
function pm(e) {
  return ((e = (e || 0) % 360), e < 0 ? e + 360 : e);
}
function Ii(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Ds(e, t, r) {
  return (
    (e < 60 ? t + ((r - t) * e) / 60 : e < 180 ? r : e < 240 ? t + ((r - t) * (240 - e)) / 60 : t) *
    255
  );
}
const Pp = (e) => () => e;
function bT(e, t) {
  return function (r) {
    return e + r * t;
  };
}
function xT(e, t, r) {
  return (
    (e = Math.pow(e, r)),
    (t = Math.pow(t, r) - e),
    (r = 1 / r),
    function (n) {
      return Math.pow(e + n * t, r);
    }
  );
}
function wT(e) {
  return (e = +e) == 1
    ? xx
    : function (t, r) {
        return r - t ? xT(t, r, e) : Pp(isNaN(t) ? r : t);
      };
}
function xx(e, t) {
  var r = t - e;
  return r ? bT(e, r) : Pp(isNaN(e) ? t : e);
}
const hm = (function e(t) {
  var r = wT(t);
  function n(i, a) {
    var o = r((i = tf(i)).r, (a = tf(a)).r),
      u = r(i.g, a.g),
      c = r(i.b, a.b),
      s = xx(i.opacity, a.opacity);
    return function (l) {
      return ((i.r = o(l)), (i.g = u(l)), (i.b = c(l)), (i.opacity = s(l)), i + "");
    };
  }
  return ((n.gamma = e), n);
})(1);
function OT(e, t) {
  t || (t = []);
  var r = e ? Math.min(t.length, e.length) : 0,
    n = t.slice(),
    i;
  return function (a) {
    for (i = 0; i < r; ++i) n[i] = e[i] * (1 - a) + t[i] * a;
    return n;
  };
}
function _T(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function AT(e, t) {
  var r = t ? t.length : 0,
    n = e ? Math.min(r, e.length) : 0,
    i = new Array(n),
    a = new Array(r),
    o;
  for (o = 0; o < n; ++o) i[o] = fn(e[o], t[o]);
  for (; o < r; ++o) a[o] = t[o];
  return function (u) {
    for (o = 0; o < n; ++o) a[o] = i[o](u);
    return a;
  };
}
function ST(e, t) {
  var r = new Date();
  return (
    (e = +e),
    (t = +t),
    function (n) {
      return (r.setTime(e * (1 - n) + t * n), r);
    }
  );
}
function na(e, t) {
  return (
    (e = +e),
    (t = +t),
    function (r) {
      return e * (1 - r) + t * r;
    }
  );
}
function PT(e, t) {
  var r = {},
    n = {},
    i;
  ((e === null || typeof e != "object") && (e = {}),
    (t === null || typeof t != "object") && (t = {}));
  for (i in t) i in e ? (r[i] = fn(e[i], t[i])) : (n[i] = t[i]);
  return function (a) {
    for (i in r) n[i] = r[i](a);
    return n;
  };
}
var rf = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  Ns = new RegExp(rf.source, "g");
function TT(e) {
  return function () {
    return e;
  };
}
function ET(e) {
  return function (t) {
    return e(t) + "";
  };
}
function jT(e, t) {
  var r = (rf.lastIndex = Ns.lastIndex = 0),
    n,
    i,
    a,
    o = -1,
    u = [],
    c = [];
  for (e = e + "", t = t + ""; (n = rf.exec(e)) && (i = Ns.exec(t)); )
    ((a = i.index) > r && ((a = t.slice(r, a)), u[o] ? (u[o] += a) : (u[++o] = a)),
      (n = n[0]) === (i = i[0])
        ? u[o]
          ? (u[o] += i)
          : (u[++o] = i)
        : ((u[++o] = null), c.push({ i: o, x: na(n, i) })),
      (r = Ns.lastIndex));
  return (
    r < t.length && ((a = t.slice(r)), u[o] ? (u[o] += a) : (u[++o] = a)),
    u.length < 2
      ? c[0]
        ? ET(c[0].x)
        : TT(t)
      : ((t = c.length),
        function (s) {
          for (var l = 0, f; l < t; ++l) u[(f = c[l]).i] = f.x(s);
          return u.join("");
        })
  );
}
function fn(e, t) {
  var r = typeof t,
    n;
  return t == null || r === "boolean"
    ? Pp(t)
    : (r === "number"
        ? na
        : r === "string"
          ? (n = Hn(t))
            ? ((t = n), hm)
            : jT
          : t instanceof Hn
            ? hm
            : t instanceof Date
              ? ST
              : _T(t)
                ? OT
                : Array.isArray(t)
                  ? AT
                  : (typeof t.valueOf != "function" && typeof t.toString != "function") || isNaN(t)
                    ? PT
                    : na)(e, t);
}
function Tp(e, t) {
  return (
    (e = +e),
    (t = +t),
    function (r) {
      return Math.round(e * (1 - r) + t * r);
    }
  );
}
function $T(e, t) {
  t === void 0 && ((t = e), (e = fn));
  for (var r = 0, n = t.length - 1, i = t[0], a = new Array(n < 0 ? 0 : n); r < n; )
    a[r] = e(i, (i = t[++r]));
  return function (o) {
    var u = Math.max(0, Math.min(n - 1, Math.floor((o *= n))));
    return a[u](o - u);
  };
}
function MT(e) {
  return function () {
    return e;
  };
}
function ia(e) {
  return +e;
}
var dm = [0, 1];
function Be(e) {
  return e;
}
function nf(e, t) {
  return (t -= e = +e)
    ? function (r) {
        return (r - e) / t;
      }
    : MT(isNaN(t) ? NaN : 0.5);
}
function CT(e, t) {
  var r;
  return (
    e > t && ((r = e), (e = t), (t = r)),
    function (n) {
      return Math.max(e, Math.min(t, n));
    }
  );
}
function IT(e, t, r) {
  var n = e[0],
    i = e[1],
    a = t[0],
    o = t[1];
  return (
    i < n ? ((n = nf(i, n)), (a = r(o, a))) : ((n = nf(n, i)), (a = r(a, o))),
    function (u) {
      return a(n(u));
    }
  );
}
function RT(e, t, r) {
  var n = Math.min(e.length, t.length) - 1,
    i = new Array(n),
    a = new Array(n),
    o = -1;
  for (e[n] < e[0] && ((e = e.slice().reverse()), (t = t.slice().reverse())); ++o < n; )
    ((i[o] = nf(e[o], e[o + 1])), (a[o] = r(t[o], t[o + 1])));
  return function (u) {
    var c = gi(e, u, 1, n) - 1;
    return a[c](i[c](u));
  };
}
function xi(e, t) {
  return t
    .domain(e.domain())
    .range(e.range())
    .interpolate(e.interpolate())
    .clamp(e.clamp())
    .unknown(e.unknown());
}
function to() {
  var e = dm,
    t = dm,
    r = fn,
    n,
    i,
    a,
    o = Be,
    u,
    c,
    s;
  function l() {
    var p = Math.min(e.length, t.length);
    return (o !== Be && (o = CT(e[0], e[p - 1])), (u = p > 2 ? RT : IT), (c = s = null), f);
  }
  function f(p) {
    return p == null || isNaN((p = +p)) ? a : (c || (c = u(e.map(n), t, r)))(n(o(p)));
  }
  return (
    (f.invert = function (p) {
      return o(i((s || (s = u(t, e.map(n), na)))(p)));
    }),
    (f.domain = function (p) {
      return arguments.length ? ((e = Array.from(p, ia)), l()) : e.slice();
    }),
    (f.range = function (p) {
      return arguments.length ? ((t = Array.from(p)), l()) : t.slice();
    }),
    (f.rangeRound = function (p) {
      return ((t = Array.from(p)), (r = Tp), l());
    }),
    (f.clamp = function (p) {
      return arguments.length ? ((o = p ? !0 : Be), l()) : o !== Be;
    }),
    (f.interpolate = function (p) {
      return arguments.length ? ((r = p), l()) : r;
    }),
    (f.unknown = function (p) {
      return arguments.length ? ((a = p), f) : a;
    }),
    function (p, d) {
      return ((n = p), (i = d), l());
    }
  );
}
function Ep() {
  return to()(Be, Be);
}
function kT(e) {
  return Math.abs((e = Math.round(e))) >= 1e21
    ? e.toLocaleString("en").replace(/,/g, "")
    : e.toString(10);
}
function aa(e, t) {
  if (!isFinite(e) || e === 0) return null;
  var r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"),
    n = e.slice(0, r);
  return [n.length > 1 ? n[0] + n.slice(2) : n, +e.slice(r + 1)];
}
function Lr(e) {
  return ((e = aa(Math.abs(e))), e ? e[1] : NaN);
}
function DT(e, t) {
  return function (r, n) {
    for (
      var i = r.length, a = [], o = 0, u = e[0], c = 0;
      i > 0 &&
      u > 0 &&
      (c + u + 1 > n && (u = Math.max(1, n - c)),
      a.push(r.substring((i -= u), i + u)),
      !((c += u + 1) > n));
    )
      u = e[(o = (o + 1) % e.length)];
    return a.reverse().join(t);
  };
}
function NT(e) {
  return function (t) {
    return t.replace(/[0-9]/g, function (r) {
      return e[+r];
    });
  };
}
var qT = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function Kn(e) {
  if (!(t = qT.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new jp({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10],
  });
}
Kn.prototype = jp.prototype;
function jp(e) {
  ((this.fill = e.fill === void 0 ? " " : e.fill + ""),
    (this.align = e.align === void 0 ? ">" : e.align + ""),
    (this.sign = e.sign === void 0 ? "-" : e.sign + ""),
    (this.symbol = e.symbol === void 0 ? "" : e.symbol + ""),
    (this.zero = !!e.zero),
    (this.width = e.width === void 0 ? void 0 : +e.width),
    (this.comma = !!e.comma),
    (this.precision = e.precision === void 0 ? void 0 : +e.precision),
    (this.trim = !!e.trim),
    (this.type = e.type === void 0 ? "" : e.type + ""));
}
jp.prototype.toString = function () {
  return (
    this.fill +
    this.align +
    this.sign +
    this.symbol +
    (this.zero ? "0" : "") +
    (this.width === void 0 ? "" : Math.max(1, this.width | 0)) +
    (this.comma ? "," : "") +
    (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) +
    (this.trim ? "~" : "") +
    this.type
  );
};
function LT(e) {
  e: for (var t = e.length, r = 1, n = -1, i; r < t; ++r)
    switch (e[r]) {
      case ".":
        n = i = r;
        break;
      case "0":
        (n === 0 && (n = r), (i = r));
        break;
      default:
        if (!+e[r]) break e;
        n > 0 && (n = 0);
        break;
    }
  return n > 0 ? e.slice(0, n) + e.slice(i + 1) : e;
}
var oa;
function BT(e, t) {
  var r = aa(e, t);
  if (!r) return ((oa = void 0), e.toPrecision(t));
  var n = r[0],
    i = r[1],
    a = i - (oa = Math.max(-8, Math.min(8, Math.floor(i / 3))) * 3) + 1,
    o = n.length;
  return a === o
    ? n
    : a > o
      ? n + new Array(a - o + 1).join("0")
      : a > 0
        ? n.slice(0, a) + "." + n.slice(a)
        : "0." + new Array(1 - a).join("0") + aa(e, Math.max(0, t + a - 1))[0];
}
function vm(e, t) {
  var r = aa(e, t);
  if (!r) return e + "";
  var n = r[0],
    i = r[1];
  return i < 0
    ? "0." + new Array(-i).join("0") + n
    : n.length > i + 1
      ? n.slice(0, i + 1) + "." + n.slice(i + 1)
      : n + new Array(i - n.length + 2).join("0");
}
const ym = {
  "%": (e, t) => (e * 100).toFixed(t),
  b: (e) => Math.round(e).toString(2),
  c: (e) => e + "",
  d: kT,
  e: (e, t) => e.toExponential(t),
  f: (e, t) => e.toFixed(t),
  g: (e, t) => e.toPrecision(t),
  o: (e) => Math.round(e).toString(8),
  p: (e, t) => vm(e * 100, t),
  r: vm,
  s: BT,
  X: (e) => Math.round(e).toString(16).toUpperCase(),
  x: (e) => Math.round(e).toString(16),
};
function mm(e) {
  return e;
}
var gm = Array.prototype.map,
  bm = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function FT(e) {
  var t =
      e.grouping === void 0 || e.thousands === void 0
        ? mm
        : DT(gm.call(e.grouping, Number), e.thousands + ""),
    r = e.currency === void 0 ? "" : e.currency[0] + "",
    n = e.currency === void 0 ? "" : e.currency[1] + "",
    i = e.decimal === void 0 ? "." : e.decimal + "",
    a = e.numerals === void 0 ? mm : NT(gm.call(e.numerals, String)),
    o = e.percent === void 0 ? "%" : e.percent + "",
    u = e.minus === void 0 ? "−" : e.minus + "",
    c = e.nan === void 0 ? "NaN" : e.nan + "";
  function s(f, p) {
    f = Kn(f);
    var d = f.fill,
      y = f.align,
      v = f.sign,
      h = f.symbol,
      g = f.zero,
      x = f.width,
      w = f.comma,
      O = f.precision,
      m = f.trim,
      b = f.type;
    (b === "n" ? ((w = !0), (b = "g")) : ym[b] || (O === void 0 && (O = 12), (m = !0), (b = "g")),
      (g || (d === "0" && y === "=")) && ((g = !0), (d = "0"), (y = "=")));
    var _ =
        (p && p.prefix !== void 0 ? p.prefix : "") +
        (h === "$" ? r : h === "#" && /[boxX]/.test(b) ? "0" + b.toLowerCase() : ""),
      A = (h === "$" ? n : /[%p]/.test(b) ? o : "") + (p && p.suffix !== void 0 ? p.suffix : ""),
      T = ym[b],
      $ = /[defgprs%]/.test(b);
    O =
      O === void 0
        ? 6
        : /[gprs]/.test(b)
          ? Math.max(1, Math.min(21, O))
          : Math.max(0, Math.min(20, O));
    function j(E) {
      var C = _,
        I = A,
        R,
        k,
        N;
      if (b === "c") ((I = T(E) + I), (E = ""));
      else {
        E = +E;
        var W = E < 0 || 1 / E < 0;
        if (
          ((E = isNaN(E) ? c : T(Math.abs(E), O)),
          m && (E = LT(E)),
          W && +E == 0 && v !== "+" && (W = !1),
          (C = (W ? (v === "(" ? v : u) : v === "-" || v === "(" ? "" : v) + C),
          (I =
            (b === "s" && !isNaN(E) && oa !== void 0 ? bm[8 + oa / 3] : "") +
            I +
            (W && v === "(" ? ")" : "")),
          $)
        ) {
          for (R = -1, k = E.length; ++R < k; )
            if (((N = E.charCodeAt(R)), 48 > N || N > 57)) {
              ((I = (N === 46 ? i + E.slice(R + 1) : E.slice(R)) + I), (E = E.slice(0, R)));
              break;
            }
        }
      }
      w && !g && (E = t(E, 1 / 0));
      var z = C.length + E.length + I.length,
        K = z < x ? new Array(x - z + 1).join(d) : "";
      switch ((w && g && ((E = t(K + E, K.length ? x - I.length : 1 / 0)), (K = "")), y)) {
        case "<":
          E = C + E + I + K;
          break;
        case "=":
          E = C + K + E + I;
          break;
        case "^":
          E = K.slice(0, (z = K.length >> 1)) + C + E + I + K.slice(z);
          break;
        default:
          E = K + C + E + I;
          break;
      }
      return a(E);
    }
    return (
      (j.toString = function () {
        return f + "";
      }),
      j
    );
  }
  function l(f, p) {
    var d = Math.max(-8, Math.min(8, Math.floor(Lr(p) / 3))) * 3,
      y = Math.pow(10, -d),
      v = s(((f = Kn(f)), (f.type = "f"), f), { suffix: bm[8 + d / 3] });
    return function (h) {
      return v(y * h);
    };
  }
  return { format: s, formatPrefix: l };
}
var Ri, $p, wx;
UT({ thousands: ",", grouping: [3], currency: ["$", ""] });
function UT(e) {
  return ((Ri = FT(e)), ($p = Ri.format), (wx = Ri.formatPrefix), Ri);
}
function WT(e) {
  return Math.max(0, -Lr(Math.abs(e)));
}
function zT(e, t) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(Lr(t) / 3))) * 3 - Lr(Math.abs(e)));
}
function HT(e, t) {
  return ((e = Math.abs(e)), (t = Math.abs(t) - e), Math.max(0, Lr(t) - Lr(e)) + 1);
}
function Ox(e, t, r, n) {
  var i = Ql(e, t, r),
    a;
  switch (((n = Kn(n ?? ",f")), n.type)) {
    case "s": {
      var o = Math.max(Math.abs(e), Math.abs(t));
      return (n.precision == null && !isNaN((a = zT(i, o))) && (n.precision = a), wx(n, o));
    }
    case "":
    case "e":
    case "g":
    case "p":
    case "r": {
      n.precision == null &&
        !isNaN((a = HT(i, Math.max(Math.abs(e), Math.abs(t))))) &&
        (n.precision = a - (n.type === "e"));
      break;
    }
    case "f":
    case "%": {
      n.precision == null && !isNaN((a = WT(i))) && (n.precision = a - (n.type === "%") * 2);
      break;
    }
  }
  return $p(n);
}
function Ft(e) {
  var t = e.domain;
  return (
    (e.ticks = function (r) {
      var n = t();
      return Zl(n[0], n[n.length - 1], r ?? 10);
    }),
    (e.tickFormat = function (r, n) {
      var i = t();
      return Ox(i[0], i[i.length - 1], r ?? 10, n);
    }),
    (e.nice = function (r) {
      r == null && (r = 10);
      var n = t(),
        i = 0,
        a = n.length - 1,
        o = n[i],
        u = n[a],
        c,
        s,
        l = 10;
      for (u < o && ((s = o), (o = u), (u = s), (s = i), (i = a), (a = s)); l-- > 0; ) {
        if (((s = Jl(o, u, r)), s === c)) return ((n[i] = o), (n[a] = u), t(n));
        if (s > 0) ((o = Math.floor(o / s) * s), (u = Math.ceil(u / s) * s));
        else if (s < 0) ((o = Math.ceil(o * s) / s), (u = Math.floor(u * s) / s));
        else break;
        c = s;
      }
      return e;
    }),
    e
  );
}
function ua() {
  var e = Ep();
  return (
    (e.copy = function () {
      return xi(e, ua());
    }),
    rt.apply(e, arguments),
    Ft(e)
  );
}
function _x(e) {
  var t;
  function r(n) {
    return n == null || isNaN((n = +n)) ? t : n;
  }
  return (
    (r.invert = r),
    (r.domain = r.range =
      function (n) {
        return arguments.length ? ((e = Array.from(n, ia)), r) : e.slice();
      }),
    (r.unknown = function (n) {
      return arguments.length ? ((t = n), r) : t;
    }),
    (r.copy = function () {
      return _x(e).unknown(t);
    }),
    (e = arguments.length ? Array.from(e, ia) : [0, 1]),
    Ft(r)
  );
}
function Ax(e, t) {
  e = e.slice();
  var r = 0,
    n = e.length - 1,
    i = e[r],
    a = e[n],
    o;
  return (
    a < i && ((o = r), (r = n), (n = o), (o = i), (i = a), (a = o)),
    (e[r] = t.floor(i)),
    (e[n] = t.ceil(a)),
    e
  );
}
function xm(e) {
  return Math.log(e);
}
function wm(e) {
  return Math.exp(e);
}
function KT(e) {
  return -Math.log(-e);
}
function GT(e) {
  return -Math.exp(-e);
}
function VT(e) {
  return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e;
}
function XT(e) {
  return e === 10 ? VT : e === Math.E ? Math.exp : (t) => Math.pow(e, t);
}
function YT(e) {
  return e === Math.E
    ? Math.log
    : (e === 10 && Math.log10) ||
        (e === 2 && Math.log2) ||
        ((e = Math.log(e)), (t) => Math.log(t) / e);
}
function Om(e) {
  return (t, r) => -e(-t, r);
}
function Mp(e) {
  const t = e(xm, wm),
    r = t.domain;
  let n = 10,
    i,
    a;
  function o() {
    return (
      (i = YT(n)),
      (a = XT(n)),
      r()[0] < 0 ? ((i = Om(i)), (a = Om(a)), e(KT, GT)) : e(xm, wm),
      t
    );
  }
  return (
    (t.base = function (u) {
      return arguments.length ? ((n = +u), o()) : n;
    }),
    (t.domain = function (u) {
      return arguments.length ? (r(u), o()) : r();
    }),
    (t.ticks = (u) => {
      const c = r();
      let s = c[0],
        l = c[c.length - 1];
      const f = l < s;
      f && ([s, l] = [l, s]);
      let p = i(s),
        d = i(l),
        y,
        v;
      const h = u == null ? 10 : +u;
      let g = [];
      if (!(n % 1) && d - p < h) {
        if (((p = Math.floor(p)), (d = Math.ceil(d)), s > 0)) {
          for (; p <= d; ++p)
            for (y = 1; y < n; ++y)
              if (((v = p < 0 ? y / a(-p) : y * a(p)), !(v < s))) {
                if (v > l) break;
                g.push(v);
              }
        } else
          for (; p <= d; ++p)
            for (y = n - 1; y >= 1; --y)
              if (((v = p > 0 ? y / a(-p) : y * a(p)), !(v < s))) {
                if (v > l) break;
                g.push(v);
              }
        g.length * 2 < h && (g = Zl(s, l, h));
      } else g = Zl(p, d, Math.min(d - p, h)).map(a);
      return f ? g.reverse() : g;
    }),
    (t.tickFormat = (u, c) => {
      if (
        (u == null && (u = 10),
        c == null && (c = n === 10 ? "s" : ","),
        typeof c != "function" &&
          (!(n % 1) && (c = Kn(c)).precision == null && (c.trim = !0), (c = $p(c))),
        u === 1 / 0)
      )
        return c;
      const s = Math.max(1, (n * u) / t.ticks().length);
      return (l) => {
        let f = l / a(Math.round(i(l)));
        return (f * n < n - 0.5 && (f *= n), f <= s ? c(l) : "");
      };
    }),
    (t.nice = () =>
      r(Ax(r(), { floor: (u) => a(Math.floor(i(u))), ceil: (u) => a(Math.ceil(i(u))) }))),
    t
  );
}
function Sx() {
  const e = Mp(to()).domain([1, 10]);
  return ((e.copy = () => xi(e, Sx()).base(e.base())), rt.apply(e, arguments), e);
}
function _m(e) {
  return function (t) {
    return Math.sign(t) * Math.log1p(Math.abs(t / e));
  };
}
function Am(e) {
  return function (t) {
    return Math.sign(t) * Math.expm1(Math.abs(t)) * e;
  };
}
function Cp(e) {
  var t = 1,
    r = e(_m(t), Am(t));
  return (
    (r.constant = function (n) {
      return arguments.length ? e(_m((t = +n)), Am(t)) : t;
    }),
    Ft(r)
  );
}
function Px() {
  var e = Cp(to());
  return (
    (e.copy = function () {
      return xi(e, Px()).constant(e.constant());
    }),
    rt.apply(e, arguments)
  );
}
function Sm(e) {
  return function (t) {
    return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e);
  };
}
function ZT(e) {
  return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e);
}
function JT(e) {
  return e < 0 ? -e * e : e * e;
}
function Ip(e) {
  var t = e(Be, Be),
    r = 1;
  function n() {
    return r === 1 ? e(Be, Be) : r === 0.5 ? e(ZT, JT) : e(Sm(r), Sm(1 / r));
  }
  return (
    (t.exponent = function (i) {
      return arguments.length ? ((r = +i), n()) : r;
    }),
    Ft(t)
  );
}
function Rp() {
  var e = Ip(to());
  return (
    (e.copy = function () {
      return xi(e, Rp()).exponent(e.exponent());
    }),
    rt.apply(e, arguments),
    e
  );
}
function QT() {
  return Rp.apply(null, arguments).exponent(0.5);
}
function Pm(e) {
  return Math.sign(e) * e * e;
}
function eE(e) {
  return Math.sign(e) * Math.sqrt(Math.abs(e));
}
function Tx() {
  var e = Ep(),
    t = [0, 1],
    r = !1,
    n;
  function i(a) {
    var o = eE(e(a));
    return isNaN(o) ? n : r ? Math.round(o) : o;
  }
  return (
    (i.invert = function (a) {
      return e.invert(Pm(a));
    }),
    (i.domain = function (a) {
      return arguments.length ? (e.domain(a), i) : e.domain();
    }),
    (i.range = function (a) {
      return arguments.length ? (e.range((t = Array.from(a, ia)).map(Pm)), i) : t.slice();
    }),
    (i.rangeRound = function (a) {
      return i.range(a).round(!0);
    }),
    (i.round = function (a) {
      return arguments.length ? ((r = !!a), i) : r;
    }),
    (i.clamp = function (a) {
      return arguments.length ? (e.clamp(a), i) : e.clamp();
    }),
    (i.unknown = function (a) {
      return arguments.length ? ((n = a), i) : n;
    }),
    (i.copy = function () {
      return Tx(e.domain(), t).round(r).clamp(e.clamp()).unknown(n);
    }),
    rt.apply(i, arguments),
    Ft(i)
  );
}
function Ex() {
  var e = [],
    t = [],
    r = [],
    n;
  function i() {
    var o = 0,
      u = Math.max(1, t.length);
    for (r = new Array(u - 1); ++o < u; ) r[o - 1] = aT(e, o / u);
    return a;
  }
  function a(o) {
    return o == null || isNaN((o = +o)) ? n : t[gi(r, o)];
  }
  return (
    (a.invertExtent = function (o) {
      var u = t.indexOf(o);
      return u < 0 ? [NaN, NaN] : [u > 0 ? r[u - 1] : e[0], u < r.length ? r[u] : e[e.length - 1]];
    }),
    (a.domain = function (o) {
      if (!arguments.length) return e.slice();
      e = [];
      for (let u of o) u != null && !isNaN((u = +u)) && e.push(u);
      return (e.sort(qt), i());
    }),
    (a.range = function (o) {
      return arguments.length ? ((t = Array.from(o)), i()) : t.slice();
    }),
    (a.unknown = function (o) {
      return arguments.length ? ((n = o), a) : n;
    }),
    (a.quantiles = function () {
      return r.slice();
    }),
    (a.copy = function () {
      return Ex().domain(e).range(t).unknown(n);
    }),
    rt.apply(a, arguments)
  );
}
function jx() {
  var e = 0,
    t = 1,
    r = 1,
    n = [0.5],
    i = [0, 1],
    a;
  function o(c) {
    return c != null && c <= c ? i[gi(n, c, 0, r)] : a;
  }
  function u() {
    var c = -1;
    for (n = new Array(r); ++c < r; ) n[c] = ((c + 1) * t - (c - r) * e) / (r + 1);
    return o;
  }
  return (
    (o.domain = function (c) {
      return arguments.length ? (([e, t] = c), (e = +e), (t = +t), u()) : [e, t];
    }),
    (o.range = function (c) {
      return arguments.length ? ((r = (i = Array.from(c)).length - 1), u()) : i.slice();
    }),
    (o.invertExtent = function (c) {
      var s = i.indexOf(c);
      return s < 0 ? [NaN, NaN] : s < 1 ? [e, n[0]] : s >= r ? [n[r - 1], t] : [n[s - 1], n[s]];
    }),
    (o.unknown = function (c) {
      return (arguments.length && (a = c), o);
    }),
    (o.thresholds = function () {
      return n.slice();
    }),
    (o.copy = function () {
      return jx().domain([e, t]).range(i).unknown(a);
    }),
    rt.apply(Ft(o), arguments)
  );
}
function $x() {
  var e = [0.5],
    t = [0, 1],
    r,
    n = 1;
  function i(a) {
    return a != null && a <= a ? t[gi(e, a, 0, n)] : r;
  }
  return (
    (i.domain = function (a) {
      return arguments.length
        ? ((e = Array.from(a)), (n = Math.min(e.length, t.length - 1)), i)
        : e.slice();
    }),
    (i.range = function (a) {
      return arguments.length
        ? ((t = Array.from(a)), (n = Math.min(e.length, t.length - 1)), i)
        : t.slice();
    }),
    (i.invertExtent = function (a) {
      var o = t.indexOf(a);
      return [e[o - 1], e[o]];
    }),
    (i.unknown = function (a) {
      return arguments.length ? ((r = a), i) : r;
    }),
    (i.copy = function () {
      return $x().domain(e).range(t).unknown(r);
    }),
    rt.apply(i, arguments)
  );
}
const qs = new Date(),
  Ls = new Date();
function $e(e, t, r, n) {
  function i(a) {
    return (e((a = arguments.length === 0 ? new Date() : new Date(+a))), a);
  }
  return (
    (i.floor = (a) => (e((a = new Date(+a))), a)),
    (i.ceil = (a) => (e((a = new Date(a - 1))), t(a, 1), e(a), a)),
    (i.round = (a) => {
      const o = i(a),
        u = i.ceil(a);
      return a - o < u - a ? o : u;
    }),
    (i.offset = (a, o) => (t((a = new Date(+a)), o == null ? 1 : Math.floor(o)), a)),
    (i.range = (a, o, u) => {
      const c = [];
      if (((a = i.ceil(a)), (u = u == null ? 1 : Math.floor(u)), !(a < o) || !(u > 0))) return c;
      let s;
      do (c.push((s = new Date(+a))), t(a, u), e(a));
      while (s < a && a < o);
      return c;
    }),
    (i.filter = (a) =>
      $e(
        (o) => {
          if (o >= o) for (; e(o), !a(o); ) o.setTime(o - 1);
        },
        (o, u) => {
          if (o >= o)
            if (u < 0) for (; ++u <= 0; ) for (; t(o, -1), !a(o); );
            else for (; --u >= 0; ) for (; t(o, 1), !a(o); );
        },
      )),
    r &&
      ((i.count = (a, o) => (qs.setTime(+a), Ls.setTime(+o), e(qs), e(Ls), Math.floor(r(qs, Ls)))),
      (i.every = (a) => (
        (a = Math.floor(a)),
        !isFinite(a) || !(a > 0)
          ? null
          : a > 1
            ? i.filter(n ? (o) => n(o) % a === 0 : (o) => i.count(0, o) % a === 0)
            : i
      ))),
    i
  );
}
const ca = $e(
  () => {},
  (e, t) => {
    e.setTime(+e + t);
  },
  (e, t) => t - e,
);
ca.every = (e) => (
  (e = Math.floor(e)),
  !isFinite(e) || !(e > 0)
    ? null
    : e > 1
      ? $e(
          (t) => {
            t.setTime(Math.floor(t / e) * e);
          },
          (t, r) => {
            t.setTime(+t + r * e);
          },
          (t, r) => (r - t) / e,
        )
      : ca
);
ca.range;
const wt = 1e3,
  et = wt * 60,
  Ot = et * 60,
  Pt = Ot * 24,
  kp = Pt * 7,
  Tm = Pt * 30,
  Bs = Pt * 365,
  tr = $e(
    (e) => {
      e.setTime(e - e.getMilliseconds());
    },
    (e, t) => {
      e.setTime(+e + t * wt);
    },
    (e, t) => (t - e) / wt,
    (e) => e.getUTCSeconds(),
  );
tr.range;
const Dp = $e(
  (e) => {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * wt);
  },
  (e, t) => {
    e.setTime(+e + t * et);
  },
  (e, t) => (t - e) / et,
  (e) => e.getMinutes(),
);
Dp.range;
const Np = $e(
  (e) => {
    e.setUTCSeconds(0, 0);
  },
  (e, t) => {
    e.setTime(+e + t * et);
  },
  (e, t) => (t - e) / et,
  (e) => e.getUTCMinutes(),
);
Np.range;
const qp = $e(
  (e) => {
    e.setTime(e - e.getMilliseconds() - e.getSeconds() * wt - e.getMinutes() * et);
  },
  (e, t) => {
    e.setTime(+e + t * Ot);
  },
  (e, t) => (t - e) / Ot,
  (e) => e.getHours(),
);
qp.range;
const Lp = $e(
  (e) => {
    e.setUTCMinutes(0, 0, 0);
  },
  (e, t) => {
    e.setTime(+e + t * Ot);
  },
  (e, t) => (t - e) / Ot,
  (e) => e.getUTCHours(),
);
Lp.range;
const wi = $e(
  (e) => e.setHours(0, 0, 0, 0),
  (e, t) => e.setDate(e.getDate() + t),
  (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * et) / Pt,
  (e) => e.getDate() - 1,
);
wi.range;
const ro = $e(
  (e) => {
    e.setUTCHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setUTCDate(e.getUTCDate() + t);
  },
  (e, t) => (t - e) / Pt,
  (e) => e.getUTCDate() - 1,
);
ro.range;
const Mx = $e(
  (e) => {
    e.setUTCHours(0, 0, 0, 0);
  },
  (e, t) => {
    e.setUTCDate(e.getUTCDate() + t);
  },
  (e, t) => (t - e) / Pt,
  (e) => Math.floor(e / Pt),
);
Mx.range;
function yr(e) {
  return $e(
    (t) => {
      (t.setDate(t.getDate() - ((t.getDay() + 7 - e) % 7)), t.setHours(0, 0, 0, 0));
    },
    (t, r) => {
      t.setDate(t.getDate() + r * 7);
    },
    (t, r) => (r - t - (r.getTimezoneOffset() - t.getTimezoneOffset()) * et) / kp,
  );
}
const no = yr(0),
  sa = yr(1),
  tE = yr(2),
  rE = yr(3),
  Br = yr(4),
  nE = yr(5),
  iE = yr(6);
no.range;
sa.range;
tE.range;
rE.range;
Br.range;
nE.range;
iE.range;
function mr(e) {
  return $e(
    (t) => {
      (t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 7 - e) % 7)), t.setUTCHours(0, 0, 0, 0));
    },
    (t, r) => {
      t.setUTCDate(t.getUTCDate() + r * 7);
    },
    (t, r) => (r - t) / kp,
  );
}
const io = mr(0),
  la = mr(1),
  aE = mr(2),
  oE = mr(3),
  Fr = mr(4),
  uE = mr(5),
  cE = mr(6);
io.range;
la.range;
aE.range;
oE.range;
Fr.range;
uE.range;
cE.range;
const Bp = $e(
  (e) => {
    (e.setDate(1), e.setHours(0, 0, 0, 0));
  },
  (e, t) => {
    e.setMonth(e.getMonth() + t);
  },
  (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12,
  (e) => e.getMonth(),
);
Bp.range;
const Fp = $e(
  (e) => {
    (e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0));
  },
  (e, t) => {
    e.setUTCMonth(e.getUTCMonth() + t);
  },
  (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12,
  (e) => e.getUTCMonth(),
);
Fp.range;
const Tt = $e(
  (e) => {
    (e.setMonth(0, 1), e.setHours(0, 0, 0, 0));
  },
  (e, t) => {
    e.setFullYear(e.getFullYear() + t);
  },
  (e, t) => t.getFullYear() - e.getFullYear(),
  (e) => e.getFullYear(),
);
Tt.every = (e) =>
  !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : $e(
        (t) => {
          (t.setFullYear(Math.floor(t.getFullYear() / e) * e),
            t.setMonth(0, 1),
            t.setHours(0, 0, 0, 0));
        },
        (t, r) => {
          t.setFullYear(t.getFullYear() + r * e);
        },
      );
Tt.range;
const Et = $e(
  (e) => {
    (e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0));
  },
  (e, t) => {
    e.setUTCFullYear(e.getUTCFullYear() + t);
  },
  (e, t) => t.getUTCFullYear() - e.getUTCFullYear(),
  (e) => e.getUTCFullYear(),
);
Et.every = (e) =>
  !isFinite((e = Math.floor(e))) || !(e > 0)
    ? null
    : $e(
        (t) => {
          (t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e),
            t.setUTCMonth(0, 1),
            t.setUTCHours(0, 0, 0, 0));
        },
        (t, r) => {
          t.setUTCFullYear(t.getUTCFullYear() + r * e);
        },
      );
Et.range;
function Cx(e, t, r, n, i, a) {
  const o = [
    [tr, 1, wt],
    [tr, 5, 5 * wt],
    [tr, 15, 15 * wt],
    [tr, 30, 30 * wt],
    [a, 1, et],
    [a, 5, 5 * et],
    [a, 15, 15 * et],
    [a, 30, 30 * et],
    [i, 1, Ot],
    [i, 3, 3 * Ot],
    [i, 6, 6 * Ot],
    [i, 12, 12 * Ot],
    [n, 1, Pt],
    [n, 2, 2 * Pt],
    [r, 1, kp],
    [t, 1, Tm],
    [t, 3, 3 * Tm],
    [e, 1, Bs],
  ];
  function u(s, l, f) {
    const p = l < s;
    p && ([s, l] = [l, s]);
    const d = f && typeof f.range == "function" ? f : c(s, l, f),
      y = d ? d.range(s, +l + 1) : [];
    return p ? y.reverse() : y;
  }
  function c(s, l, f) {
    const p = Math.abs(l - s) / f,
      d = _p(([, , h]) => h).right(o, p);
    if (d === o.length) return e.every(Ql(s / Bs, l / Bs, f));
    if (d === 0) return ca.every(Math.max(Ql(s, l, f), 1));
    const [y, v] = o[p / o[d - 1][2] < o[d][2] / p ? d - 1 : d];
    return y.every(v);
  }
  return [u, c];
}
const [sE, lE] = Cx(Et, Fp, io, Mx, Lp, Np),
  [fE, pE] = Cx(Tt, Bp, no, wi, qp, Dp);
function Fs(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return (t.setFullYear(e.y), t);
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function Us(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return (t.setUTCFullYear(e.y), t);
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function gn(e, t, r) {
  return { y: e, m: t, d: r, H: 0, M: 0, S: 0, L: 0 };
}
function hE(e) {
  var t = e.dateTime,
    r = e.date,
    n = e.time,
    i = e.periods,
    a = e.days,
    o = e.shortDays,
    u = e.months,
    c = e.shortMonths,
    s = bn(i),
    l = xn(i),
    f = bn(a),
    p = xn(a),
    d = bn(o),
    y = xn(o),
    v = bn(u),
    h = xn(u),
    g = bn(c),
    x = xn(c),
    w = {
      a: N,
      A: W,
      b: z,
      B: K,
      c: null,
      d: Im,
      e: Im,
      f: DE,
      g: KE,
      G: VE,
      H: IE,
      I: RE,
      j: kE,
      L: Ix,
      m: NE,
      M: qE,
      p: P,
      q: M,
      Q: Dm,
      s: Nm,
      S: LE,
      u: BE,
      U: FE,
      V: UE,
      w: WE,
      W: zE,
      x: null,
      X: null,
      y: HE,
      Y: GE,
      Z: XE,
      "%": km,
    },
    O = {
      a: F,
      A: H,
      b: X,
      B: re,
      c: null,
      d: Rm,
      e: Rm,
      f: QE,
      g: sj,
      G: fj,
      H: YE,
      I: ZE,
      j: JE,
      L: kx,
      m: ej,
      M: tj,
      p: ae,
      q: ye,
      Q: Dm,
      s: Nm,
      S: rj,
      u: nj,
      U: ij,
      V: aj,
      w: oj,
      W: uj,
      x: null,
      X: null,
      y: cj,
      Y: lj,
      Z: pj,
      "%": km,
    },
    m = {
      a: $,
      A: j,
      b: E,
      B: C,
      c: I,
      d: Mm,
      e: Mm,
      f: jE,
      g: $m,
      G: jm,
      H: Cm,
      I: Cm,
      j: SE,
      L: EE,
      m: AE,
      M: PE,
      p: T,
      q: _E,
      Q: ME,
      s: CE,
      S: TE,
      u: gE,
      U: bE,
      V: xE,
      w: mE,
      W: wE,
      x: R,
      X: k,
      y: $m,
      Y: jm,
      Z: OE,
      "%": $E,
    };
  ((w.x = b(r, w)),
    (w.X = b(n, w)),
    (w.c = b(t, w)),
    (O.x = b(r, O)),
    (O.X = b(n, O)),
    (O.c = b(t, O)));
  function b(U, ee) {
    return function (ne) {
      var q = [],
        be = -1,
        oe = 0,
        Ae = U.length,
        Se,
        Fe,
        Ct;
      for (ne instanceof Date || (ne = new Date(+ne)); ++be < Ae; )
        U.charCodeAt(be) === 37 &&
          (q.push(U.slice(oe, be)),
          (Fe = Em[(Se = U.charAt(++be))]) != null
            ? (Se = U.charAt(++be))
            : (Fe = Se === "e" ? " " : "0"),
          (Ct = ee[Se]) && (Se = Ct(ne, Fe)),
          q.push(Se),
          (oe = be + 1));
      return (q.push(U.slice(oe, be)), q.join(""));
    };
  }
  function _(U, ee) {
    return function (ne) {
      var q = gn(1900, void 0, 1),
        be = A(q, U, (ne += ""), 0),
        oe,
        Ae;
      if (be != ne.length) return null;
      if ("Q" in q) return new Date(q.Q);
      if ("s" in q) return new Date(q.s * 1e3 + ("L" in q ? q.L : 0));
      if (
        (ee && !("Z" in q) && (q.Z = 0),
        "p" in q && (q.H = (q.H % 12) + q.p * 12),
        q.m === void 0 && (q.m = "q" in q ? q.q : 0),
        "V" in q)
      ) {
        if (q.V < 1 || q.V > 53) return null;
        ("w" in q || (q.w = 1),
          "Z" in q
            ? ((oe = Us(gn(q.y, 0, 1))),
              (Ae = oe.getUTCDay()),
              (oe = Ae > 4 || Ae === 0 ? la.ceil(oe) : la(oe)),
              (oe = ro.offset(oe, (q.V - 1) * 7)),
              (q.y = oe.getUTCFullYear()),
              (q.m = oe.getUTCMonth()),
              (q.d = oe.getUTCDate() + ((q.w + 6) % 7)))
            : ((oe = Fs(gn(q.y, 0, 1))),
              (Ae = oe.getDay()),
              (oe = Ae > 4 || Ae === 0 ? sa.ceil(oe) : sa(oe)),
              (oe = wi.offset(oe, (q.V - 1) * 7)),
              (q.y = oe.getFullYear()),
              (q.m = oe.getMonth()),
              (q.d = oe.getDate() + ((q.w + 6) % 7))));
      } else
        ("W" in q || "U" in q) &&
          ("w" in q || (q.w = "u" in q ? q.u % 7 : "W" in q ? 1 : 0),
          (Ae = "Z" in q ? Us(gn(q.y, 0, 1)).getUTCDay() : Fs(gn(q.y, 0, 1)).getDay()),
          (q.m = 0),
          (q.d =
            "W" in q
              ? ((q.w + 6) % 7) + q.W * 7 - ((Ae + 5) % 7)
              : q.w + q.U * 7 - ((Ae + 6) % 7)));
      return "Z" in q ? ((q.H += (q.Z / 100) | 0), (q.M += q.Z % 100), Us(q)) : Fs(q);
    };
  }
  function A(U, ee, ne, q) {
    for (var be = 0, oe = ee.length, Ae = ne.length, Se, Fe; be < oe; ) {
      if (q >= Ae) return -1;
      if (((Se = ee.charCodeAt(be++)), Se === 37)) {
        if (
          ((Se = ee.charAt(be++)),
          (Fe = m[Se in Em ? ee.charAt(be++) : Se]),
          !Fe || (q = Fe(U, ne, q)) < 0)
        )
          return -1;
      } else if (Se != ne.charCodeAt(q++)) return -1;
    }
    return q;
  }
  function T(U, ee, ne) {
    var q = s.exec(ee.slice(ne));
    return q ? ((U.p = l.get(q[0].toLowerCase())), ne + q[0].length) : -1;
  }
  function $(U, ee, ne) {
    var q = d.exec(ee.slice(ne));
    return q ? ((U.w = y.get(q[0].toLowerCase())), ne + q[0].length) : -1;
  }
  function j(U, ee, ne) {
    var q = f.exec(ee.slice(ne));
    return q ? ((U.w = p.get(q[0].toLowerCase())), ne + q[0].length) : -1;
  }
  function E(U, ee, ne) {
    var q = g.exec(ee.slice(ne));
    return q ? ((U.m = x.get(q[0].toLowerCase())), ne + q[0].length) : -1;
  }
  function C(U, ee, ne) {
    var q = v.exec(ee.slice(ne));
    return q ? ((U.m = h.get(q[0].toLowerCase())), ne + q[0].length) : -1;
  }
  function I(U, ee, ne) {
    return A(U, t, ee, ne);
  }
  function R(U, ee, ne) {
    return A(U, r, ee, ne);
  }
  function k(U, ee, ne) {
    return A(U, n, ee, ne);
  }
  function N(U) {
    return o[U.getDay()];
  }
  function W(U) {
    return a[U.getDay()];
  }
  function z(U) {
    return c[U.getMonth()];
  }
  function K(U) {
    return u[U.getMonth()];
  }
  function P(U) {
    return i[+(U.getHours() >= 12)];
  }
  function M(U) {
    return 1 + ~~(U.getMonth() / 3);
  }
  function F(U) {
    return o[U.getUTCDay()];
  }
  function H(U) {
    return a[U.getUTCDay()];
  }
  function X(U) {
    return c[U.getUTCMonth()];
  }
  function re(U) {
    return u[U.getUTCMonth()];
  }
  function ae(U) {
    return i[+(U.getUTCHours() >= 12)];
  }
  function ye(U) {
    return 1 + ~~(U.getUTCMonth() / 3);
  }
  return {
    format: function (U) {
      var ee = b((U += ""), w);
      return (
        (ee.toString = function () {
          return U;
        }),
        ee
      );
    },
    parse: function (U) {
      var ee = _((U += ""), !1);
      return (
        (ee.toString = function () {
          return U;
        }),
        ee
      );
    },
    utcFormat: function (U) {
      var ee = b((U += ""), O);
      return (
        (ee.toString = function () {
          return U;
        }),
        ee
      );
    },
    utcParse: function (U) {
      var ee = _((U += ""), !0);
      return (
        (ee.toString = function () {
          return U;
        }),
        ee
      );
    },
  };
}
var Em = { "-": "", _: " ", 0: "0" },
  Ie = /^\s*\d+/,
  dE = /^%/,
  vE = /[\\^$*+?|[\]().{}]/g;
function ue(e, t, r) {
  var n = e < 0 ? "-" : "",
    i = (n ? -e : e) + "",
    a = i.length;
  return n + (a < r ? new Array(r - a + 1).join(t) + i : i);
}
function yE(e) {
  return e.replace(vE, "\\$&");
}
function bn(e) {
  return new RegExp("^(?:" + e.map(yE).join("|") + ")", "i");
}
function xn(e) {
  return new Map(e.map((t, r) => [t.toLowerCase(), r]));
}
function mE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 1));
  return n ? ((e.w = +n[0]), r + n[0].length) : -1;
}
function gE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 1));
  return n ? ((e.u = +n[0]), r + n[0].length) : -1;
}
function bE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 2));
  return n ? ((e.U = +n[0]), r + n[0].length) : -1;
}
function xE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 2));
  return n ? ((e.V = +n[0]), r + n[0].length) : -1;
}
function wE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 2));
  return n ? ((e.W = +n[0]), r + n[0].length) : -1;
}
function jm(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 4));
  return n ? ((e.y = +n[0]), r + n[0].length) : -1;
}
function $m(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 2));
  return n ? ((e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3)), r + n[0].length) : -1;
}
function OE(e, t, r) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
  return n ? ((e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00"))), r + n[0].length) : -1;
}
function _E(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 1));
  return n ? ((e.q = n[0] * 3 - 3), r + n[0].length) : -1;
}
function AE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 2));
  return n ? ((e.m = n[0] - 1), r + n[0].length) : -1;
}
function Mm(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 2));
  return n ? ((e.d = +n[0]), r + n[0].length) : -1;
}
function SE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 3));
  return n ? ((e.m = 0), (e.d = +n[0]), r + n[0].length) : -1;
}
function Cm(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 2));
  return n ? ((e.H = +n[0]), r + n[0].length) : -1;
}
function PE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 2));
  return n ? ((e.M = +n[0]), r + n[0].length) : -1;
}
function TE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 2));
  return n ? ((e.S = +n[0]), r + n[0].length) : -1;
}
function EE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 3));
  return n ? ((e.L = +n[0]), r + n[0].length) : -1;
}
function jE(e, t, r) {
  var n = Ie.exec(t.slice(r, r + 6));
  return n ? ((e.L = Math.floor(n[0] / 1e3)), r + n[0].length) : -1;
}
function $E(e, t, r) {
  var n = dE.exec(t.slice(r, r + 1));
  return n ? r + n[0].length : -1;
}
function ME(e, t, r) {
  var n = Ie.exec(t.slice(r));
  return n ? ((e.Q = +n[0]), r + n[0].length) : -1;
}
function CE(e, t, r) {
  var n = Ie.exec(t.slice(r));
  return n ? ((e.s = +n[0]), r + n[0].length) : -1;
}
function Im(e, t) {
  return ue(e.getDate(), t, 2);
}
function IE(e, t) {
  return ue(e.getHours(), t, 2);
}
function RE(e, t) {
  return ue(e.getHours() % 12 || 12, t, 2);
}
function kE(e, t) {
  return ue(1 + wi.count(Tt(e), e), t, 3);
}
function Ix(e, t) {
  return ue(e.getMilliseconds(), t, 3);
}
function DE(e, t) {
  return Ix(e, t) + "000";
}
function NE(e, t) {
  return ue(e.getMonth() + 1, t, 2);
}
function qE(e, t) {
  return ue(e.getMinutes(), t, 2);
}
function LE(e, t) {
  return ue(e.getSeconds(), t, 2);
}
function BE(e) {
  var t = e.getDay();
  return t === 0 ? 7 : t;
}
function FE(e, t) {
  return ue(no.count(Tt(e) - 1, e), t, 2);
}
function Rx(e) {
  var t = e.getDay();
  return t >= 4 || t === 0 ? Br(e) : Br.ceil(e);
}
function UE(e, t) {
  return ((e = Rx(e)), ue(Br.count(Tt(e), e) + (Tt(e).getDay() === 4), t, 2));
}
function WE(e) {
  return e.getDay();
}
function zE(e, t) {
  return ue(sa.count(Tt(e) - 1, e), t, 2);
}
function HE(e, t) {
  return ue(e.getFullYear() % 100, t, 2);
}
function KE(e, t) {
  return ((e = Rx(e)), ue(e.getFullYear() % 100, t, 2));
}
function GE(e, t) {
  return ue(e.getFullYear() % 1e4, t, 4);
}
function VE(e, t) {
  var r = e.getDay();
  return ((e = r >= 4 || r === 0 ? Br(e) : Br.ceil(e)), ue(e.getFullYear() % 1e4, t, 4));
}
function XE(e) {
  var t = e.getTimezoneOffset();
  return (t > 0 ? "-" : ((t *= -1), "+")) + ue((t / 60) | 0, "0", 2) + ue(t % 60, "0", 2);
}
function Rm(e, t) {
  return ue(e.getUTCDate(), t, 2);
}
function YE(e, t) {
  return ue(e.getUTCHours(), t, 2);
}
function ZE(e, t) {
  return ue(e.getUTCHours() % 12 || 12, t, 2);
}
function JE(e, t) {
  return ue(1 + ro.count(Et(e), e), t, 3);
}
function kx(e, t) {
  return ue(e.getUTCMilliseconds(), t, 3);
}
function QE(e, t) {
  return kx(e, t) + "000";
}
function ej(e, t) {
  return ue(e.getUTCMonth() + 1, t, 2);
}
function tj(e, t) {
  return ue(e.getUTCMinutes(), t, 2);
}
function rj(e, t) {
  return ue(e.getUTCSeconds(), t, 2);
}
function nj(e) {
  var t = e.getUTCDay();
  return t === 0 ? 7 : t;
}
function ij(e, t) {
  return ue(io.count(Et(e) - 1, e), t, 2);
}
function Dx(e) {
  var t = e.getUTCDay();
  return t >= 4 || t === 0 ? Fr(e) : Fr.ceil(e);
}
function aj(e, t) {
  return ((e = Dx(e)), ue(Fr.count(Et(e), e) + (Et(e).getUTCDay() === 4), t, 2));
}
function oj(e) {
  return e.getUTCDay();
}
function uj(e, t) {
  return ue(la.count(Et(e) - 1, e), t, 2);
}
function cj(e, t) {
  return ue(e.getUTCFullYear() % 100, t, 2);
}
function sj(e, t) {
  return ((e = Dx(e)), ue(e.getUTCFullYear() % 100, t, 2));
}
function lj(e, t) {
  return ue(e.getUTCFullYear() % 1e4, t, 4);
}
function fj(e, t) {
  var r = e.getUTCDay();
  return ((e = r >= 4 || r === 0 ? Fr(e) : Fr.ceil(e)), ue(e.getUTCFullYear() % 1e4, t, 4));
}
function pj() {
  return "+0000";
}
function km() {
  return "%";
}
function Dm(e) {
  return +e;
}
function Nm(e) {
  return Math.floor(+e / 1e3);
}
var Or, Nx, qx;
hj({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
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
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
});
function hj(e) {
  return ((Or = hE(e)), (Nx = Or.format), Or.parse, (qx = Or.utcFormat), Or.utcParse, Or);
}
function dj(e) {
  return new Date(e);
}
function vj(e) {
  return e instanceof Date ? +e : +new Date(+e);
}
function Up(e, t, r, n, i, a, o, u, c, s) {
  var l = Ep(),
    f = l.invert,
    p = l.domain,
    d = s(".%L"),
    y = s(":%S"),
    v = s("%I:%M"),
    h = s("%I %p"),
    g = s("%a %d"),
    x = s("%b %d"),
    w = s("%B"),
    O = s("%Y");
  function m(b) {
    return (
      c(b) < b
        ? d
        : u(b) < b
          ? y
          : o(b) < b
            ? v
            : a(b) < b
              ? h
              : n(b) < b
                ? i(b) < b
                  ? g
                  : x
                : r(b) < b
                  ? w
                  : O
    )(b);
  }
  return (
    (l.invert = function (b) {
      return new Date(f(b));
    }),
    (l.domain = function (b) {
      return arguments.length ? p(Array.from(b, vj)) : p().map(dj);
    }),
    (l.ticks = function (b) {
      var _ = p();
      return e(_[0], _[_.length - 1], b ?? 10);
    }),
    (l.tickFormat = function (b, _) {
      return _ == null ? m : s(_);
    }),
    (l.nice = function (b) {
      var _ = p();
      return (
        (!b || typeof b.range != "function") && (b = t(_[0], _[_.length - 1], b ?? 10)),
        b ? p(Ax(_, b)) : l
      );
    }),
    (l.copy = function () {
      return xi(l, Up(e, t, r, n, i, a, o, u, c, s));
    }),
    l
  );
}
function yj() {
  return rt.apply(
    Up(fE, pE, Tt, Bp, no, wi, qp, Dp, tr, Nx).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]),
    arguments,
  );
}
function mj() {
  return rt.apply(
    Up(sE, lE, Et, Fp, io, ro, Lp, Np, tr, qx).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]),
    arguments,
  );
}
function ao() {
  var e = 0,
    t = 1,
    r,
    n,
    i,
    a,
    o = Be,
    u = !1,
    c;
  function s(f) {
    return f == null || isNaN((f = +f))
      ? c
      : o(i === 0 ? 0.5 : ((f = (a(f) - r) * i), u ? Math.max(0, Math.min(1, f)) : f));
  }
  ((s.domain = function (f) {
    return arguments.length
      ? (([e, t] = f), (r = a((e = +e))), (n = a((t = +t))), (i = r === n ? 0 : 1 / (n - r)), s)
      : [e, t];
  }),
    (s.clamp = function (f) {
      return arguments.length ? ((u = !!f), s) : u;
    }),
    (s.interpolator = function (f) {
      return arguments.length ? ((o = f), s) : o;
    }));
  function l(f) {
    return function (p) {
      var d, y;
      return arguments.length ? (([d, y] = p), (o = f(d, y)), s) : [o(0), o(1)];
    };
  }
  return (
    (s.range = l(fn)),
    (s.rangeRound = l(Tp)),
    (s.unknown = function (f) {
      return arguments.length ? ((c = f), s) : c;
    }),
    function (f) {
      return ((a = f), (r = f(e)), (n = f(t)), (i = r === n ? 0 : 1 / (n - r)), s);
    }
  );
}
function Ut(e, t) {
  return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown());
}
function Lx() {
  var e = Ft(ao()(Be));
  return (
    (e.copy = function () {
      return Ut(e, Lx());
    }),
    Mt.apply(e, arguments)
  );
}
function Bx() {
  var e = Mp(ao()).domain([1, 10]);
  return (
    (e.copy = function () {
      return Ut(e, Bx()).base(e.base());
    }),
    Mt.apply(e, arguments)
  );
}
function Fx() {
  var e = Cp(ao());
  return (
    (e.copy = function () {
      return Ut(e, Fx()).constant(e.constant());
    }),
    Mt.apply(e, arguments)
  );
}
function Wp() {
  var e = Ip(ao());
  return (
    (e.copy = function () {
      return Ut(e, Wp()).exponent(e.exponent());
    }),
    Mt.apply(e, arguments)
  );
}
function gj() {
  return Wp.apply(null, arguments).exponent(0.5);
}
function Ux() {
  var e = [],
    t = Be;
  function r(n) {
    if (n != null && !isNaN((n = +n))) return t((gi(e, n, 1) - 1) / (e.length - 1));
  }
  return (
    (r.domain = function (n) {
      if (!arguments.length) return e.slice();
      e = [];
      for (let i of n) i != null && !isNaN((i = +i)) && e.push(i);
      return (e.sort(qt), r);
    }),
    (r.interpolator = function (n) {
      return arguments.length ? ((t = n), r) : t;
    }),
    (r.range = function () {
      return e.map((n, i) => t(i / (e.length - 1)));
    }),
    (r.quantiles = function (n) {
      return Array.from({ length: n + 1 }, (i, a) => iT(e, a / n));
    }),
    (r.copy = function () {
      return Ux(t).domain(e);
    }),
    Mt.apply(r, arguments)
  );
}
function oo() {
  var e = 0,
    t = 0.5,
    r = 1,
    n = 1,
    i,
    a,
    o,
    u,
    c,
    s = Be,
    l,
    f = !1,
    p;
  function d(v) {
    return isNaN((v = +v))
      ? p
      : ((v = 0.5 + ((v = +l(v)) - a) * (n * v < n * a ? u : c)),
        s(f ? Math.max(0, Math.min(1, v)) : v));
  }
  ((d.domain = function (v) {
    return arguments.length
      ? (([e, t, r] = v),
        (i = l((e = +e))),
        (a = l((t = +t))),
        (o = l((r = +r))),
        (u = i === a ? 0 : 0.5 / (a - i)),
        (c = a === o ? 0 : 0.5 / (o - a)),
        (n = a < i ? -1 : 1),
        d)
      : [e, t, r];
  }),
    (d.clamp = function (v) {
      return arguments.length ? ((f = !!v), d) : f;
    }),
    (d.interpolator = function (v) {
      return arguments.length ? ((s = v), d) : s;
    }));
  function y(v) {
    return function (h) {
      var g, x, w;
      return arguments.length ? (([g, x, w] = h), (s = $T(v, [g, x, w])), d) : [s(0), s(0.5), s(1)];
    };
  }
  return (
    (d.range = y(fn)),
    (d.rangeRound = y(Tp)),
    (d.unknown = function (v) {
      return arguments.length ? ((p = v), d) : p;
    }),
    function (v) {
      return (
        (l = v),
        (i = v(e)),
        (a = v(t)),
        (o = v(r)),
        (u = i === a ? 0 : 0.5 / (a - i)),
        (c = a === o ? 0 : 0.5 / (o - a)),
        (n = a < i ? -1 : 1),
        d
      );
    }
  );
}
function Wx() {
  var e = Ft(oo()(Be));
  return (
    (e.copy = function () {
      return Ut(e, Wx());
    }),
    Mt.apply(e, arguments)
  );
}
function zx() {
  var e = Mp(oo()).domain([0.1, 1, 10]);
  return (
    (e.copy = function () {
      return Ut(e, zx()).base(e.base());
    }),
    Mt.apply(e, arguments)
  );
}
function Hx() {
  var e = Cp(oo());
  return (
    (e.copy = function () {
      return Ut(e, Hx()).constant(e.constant());
    }),
    Mt.apply(e, arguments)
  );
}
function zp() {
  var e = Ip(oo());
  return (
    (e.copy = function () {
      return Ut(e, zp()).exponent(e.exponent());
    }),
    Mt.apply(e, arguments)
  );
}
function bj() {
  return zp.apply(null, arguments).exponent(0.5);
}
const qm = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      scaleBand: Un,
      scaleDiverging: Wx,
      scaleDivergingLog: zx,
      scaleDivergingPow: zp,
      scaleDivergingSqrt: bj,
      scaleDivergingSymlog: Hx,
      scaleIdentity: _x,
      scaleImplicit: ef,
      scaleLinear: ua,
      scaleLog: Sx,
      scaleOrdinal: Ap,
      scalePoint: jn,
      scalePow: Rp,
      scaleQuantile: Ex,
      scaleQuantize: jx,
      scaleRadial: Tx,
      scaleSequential: Lx,
      scaleSequentialLog: Bx,
      scaleSequentialPow: Wp,
      scaleSequentialQuantile: Ux,
      scaleSequentialSqrt: gj,
      scaleSequentialSymlog: Fx,
      scaleSqrt: QT,
      scaleSymlog: Px,
      scaleThreshold: $x,
      scaleTime: yj,
      scaleUtc: mj,
      tickFormat: Ox,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
var Ws, Lm;
function uo() {
  if (Lm) return Ws;
  Lm = 1;
  var e = un();
  function t(r, n, i) {
    for (var a = -1, o = r.length; ++a < o; ) {
      var u = r[a],
        c = n(u);
      if (c != null && (s === void 0 ? c === c && !e(c) : i(c, s)))
        var s = c,
          l = u;
    }
    return l;
  }
  return ((Ws = t), Ws);
}
var zs, Bm;
function Kx() {
  if (Bm) return zs;
  Bm = 1;
  function e(t, r) {
    return t > r;
  }
  return ((zs = e), zs);
}
var Hs, Fm;
function xj() {
  if (Fm) return Hs;
  Fm = 1;
  var e = uo(),
    t = Kx(),
    r = ln();
  function n(i) {
    return i && i.length ? e(i, r, t) : void 0;
  }
  return ((Hs = n), Hs);
}
var wj = xj();
const Dt = le(wj);
var Ks, Um;
function Gx() {
  if (Um) return Ks;
  Um = 1;
  function e(t, r) {
    return t < r;
  }
  return ((Ks = e), Ks);
}
var Gs, Wm;
function Oj() {
  if (Wm) return Gs;
  Wm = 1;
  var e = uo(),
    t = Gx(),
    r = ln();
  function n(i) {
    return i && i.length ? e(i, r, t) : void 0;
  }
  return ((Gs = n), Gs);
}
var _j = Oj();
const co = le(_j);
var Vs, zm;
function Aj() {
  if (zm) return Vs;
  zm = 1;
  var e = ap(),
    t = mt(),
    r = rx(),
    n = We();
  function i(a, o) {
    var u = n(a) ? e : r;
    return u(a, t(o, 3));
  }
  return ((Vs = i), Vs);
}
var Xs, Hm;
function Sj() {
  if (Hm) return Xs;
  Hm = 1;
  var e = ex(),
    t = Aj();
  function r(n, i) {
    return e(t(n, i), 1);
  }
  return ((Xs = r), Xs);
}
var Pj = Sj();
const Tj = le(Pj);
var Ys, Km;
function Ej() {
  if (Km) return Ys;
  Km = 1;
  var e = gp();
  function t(r, n) {
    return e(r, n);
  }
  return ((Ys = t), Ys);
}
var jj = Ej();
const lr = le(jj);
var pn = 1e9,
  $j = {
    precision: 20,
    rounding: 4,
    toExpNeg: -7,
    toExpPos: 21,
    LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286",
  },
  Kp,
  ge = !0,
  tt = "[DecimalError] ",
  ar = tt + "Invalid argument: ",
  Hp = tt + "Exponent out of range: ",
  hn = Math.floor,
  Zt = Math.pow,
  Mj = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
  Ge,
  Me = 1e7,
  me = 7,
  Vx = 9007199254740991,
  fa = hn(Vx / me),
  G = {};
G.absoluteValue = G.abs = function () {
  var e = new this.constructor(this);
  return (e.s && (e.s = 1), e);
};
G.comparedTo = G.cmp = function (e) {
  var t,
    r,
    n,
    i,
    a = this;
  if (((e = new a.constructor(e)), a.s !== e.s)) return a.s || -e.s;
  if (a.e !== e.e) return (a.e > e.e) ^ (a.s < 0) ? 1 : -1;
  for (n = a.d.length, i = e.d.length, t = 0, r = n < i ? n : i; t < r; ++t)
    if (a.d[t] !== e.d[t]) return (a.d[t] > e.d[t]) ^ (a.s < 0) ? 1 : -1;
  return n === i ? 0 : (n > i) ^ (a.s < 0) ? 1 : -1;
};
G.decimalPlaces = G.dp = function () {
  var e = this,
    t = e.d.length - 1,
    r = (t - e.e) * me;
  if (((t = e.d[t]), t)) for (; t % 10 == 0; t /= 10) r--;
  return r < 0 ? 0 : r;
};
G.dividedBy = G.div = function (e) {
  return St(this, new this.constructor(e));
};
G.dividedToIntegerBy = G.idiv = function (e) {
  var t = this,
    r = t.constructor;
  return pe(St(t, new r(e), 0, 1), r.precision);
};
G.equals = G.eq = function (e) {
  return !this.cmp(e);
};
G.exponent = function () {
  return _e(this);
};
G.greaterThan = G.gt = function (e) {
  return this.cmp(e) > 0;
};
G.greaterThanOrEqualTo = G.gte = function (e) {
  return this.cmp(e) >= 0;
};
G.isInteger = G.isint = function () {
  return this.e > this.d.length - 2;
};
G.isNegative = G.isneg = function () {
  return this.s < 0;
};
G.isPositive = G.ispos = function () {
  return this.s > 0;
};
G.isZero = function () {
  return this.s === 0;
};
G.lessThan = G.lt = function (e) {
  return this.cmp(e) < 0;
};
G.lessThanOrEqualTo = G.lte = function (e) {
  return this.cmp(e) < 1;
};
G.logarithm = G.log = function (e) {
  var t,
    r = this,
    n = r.constructor,
    i = n.precision,
    a = i + 5;
  if (e === void 0) e = new n(10);
  else if (((e = new n(e)), e.s < 1 || e.eq(Ge))) throw Error(tt + "NaN");
  if (r.s < 1) throw Error(tt + (r.s ? "NaN" : "-Infinity"));
  return r.eq(Ge) ? new n(0) : ((ge = !1), (t = St(Gn(r, a), Gn(e, a), a)), (ge = !0), pe(t, i));
};
G.minus = G.sub = function (e) {
  var t = this;
  return ((e = new t.constructor(e)), t.s == e.s ? Zx(t, e) : Xx(t, ((e.s = -e.s), e)));
};
G.modulo = G.mod = function (e) {
  var t,
    r = this,
    n = r.constructor,
    i = n.precision;
  if (((e = new n(e)), !e.s)) throw Error(tt + "NaN");
  return r.s ? ((ge = !1), (t = St(r, e, 0, 1).times(e)), (ge = !0), r.minus(t)) : pe(new n(r), i);
};
G.naturalExponential = G.exp = function () {
  return Yx(this);
};
G.naturalLogarithm = G.ln = function () {
  return Gn(this);
};
G.negated = G.neg = function () {
  var e = new this.constructor(this);
  return ((e.s = -e.s || 0), e);
};
G.plus = G.add = function (e) {
  var t = this;
  return ((e = new t.constructor(e)), t.s == e.s ? Xx(t, e) : Zx(t, ((e.s = -e.s), e)));
};
G.precision = G.sd = function (e) {
  var t,
    r,
    n,
    i = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(ar + e);
  if (((t = _e(i) + 1), (n = i.d.length - 1), (r = n * me + 1), (n = i.d[n]), n)) {
    for (; n % 10 == 0; n /= 10) r--;
    for (n = i.d[0]; n >= 10; n /= 10) r++;
  }
  return e && t > r ? t : r;
};
G.squareRoot = G.sqrt = function () {
  var e,
    t,
    r,
    n,
    i,
    a,
    o,
    u = this,
    c = u.constructor;
  if (u.s < 1) {
    if (!u.s) return new c(0);
    throw Error(tt + "NaN");
  }
  for (
    e = _e(u),
      ge = !1,
      i = Math.sqrt(+u),
      i == 0 || i == 1 / 0
        ? ((t = lt(u.d)),
          (t.length + e) % 2 == 0 && (t += "0"),
          (i = Math.sqrt(t)),
          (e = hn((e + 1) / 2) - (e < 0 || e % 2)),
          i == 1 / 0
            ? (t = "5e" + e)
            : ((t = i.toExponential()), (t = t.slice(0, t.indexOf("e") + 1) + e)),
          (n = new c(t)))
        : (n = new c(i.toString())),
      r = c.precision,
      i = o = r + 3;
    ;
  )
    if (
      ((a = n),
      (n = a.plus(St(u, a, o + 2)).times(0.5)),
      lt(a.d).slice(0, o) === (t = lt(n.d)).slice(0, o))
    ) {
      if (((t = t.slice(o - 3, o + 1)), i == o && t == "4999")) {
        if ((pe(a, r + 1, 0), a.times(a).eq(u))) {
          n = a;
          break;
        }
      } else if (t != "9999") break;
      o += 4;
    }
  return ((ge = !0), pe(n, r));
};
G.times = G.mul = function (e) {
  var t,
    r,
    n,
    i,
    a,
    o,
    u,
    c,
    s,
    l = this,
    f = l.constructor,
    p = l.d,
    d = (e = new f(e)).d;
  if (!l.s || !e.s) return new f(0);
  for (
    e.s *= l.s,
      r = l.e + e.e,
      c = p.length,
      s = d.length,
      c < s && ((a = p), (p = d), (d = a), (o = c), (c = s), (s = o)),
      a = [],
      o = c + s,
      n = o;
    n--;
  )
    a.push(0);
  for (n = s; --n >= 0; ) {
    for (t = 0, i = c + n; i > n; )
      ((u = a[i] + d[n] * p[i - n - 1] + t), (a[i--] = (u % Me) | 0), (t = (u / Me) | 0));
    a[i] = ((a[i] + t) % Me) | 0;
  }
  for (; !a[--o]; ) a.pop();
  return (t ? ++r : a.shift(), (e.d = a), (e.e = r), ge ? pe(e, f.precision) : e);
};
G.toDecimalPlaces = G.todp = function (e, t) {
  var r = this,
    n = r.constructor;
  return (
    (r = new n(r)),
    e === void 0
      ? r
      : (vt(e, 0, pn), t === void 0 ? (t = n.rounding) : vt(t, 0, 8), pe(r, e + _e(r) + 1, t))
  );
};
G.toExponential = function (e, t) {
  var r,
    n = this,
    i = n.constructor;
  return (
    e === void 0
      ? (r = fr(n, !0))
      : (vt(e, 0, pn),
        t === void 0 ? (t = i.rounding) : vt(t, 0, 8),
        (n = pe(new i(n), e + 1, t)),
        (r = fr(n, !0, e + 1))),
    r
  );
};
G.toFixed = function (e, t) {
  var r,
    n,
    i = this,
    a = i.constructor;
  return e === void 0
    ? fr(i)
    : (vt(e, 0, pn),
      t === void 0 ? (t = a.rounding) : vt(t, 0, 8),
      (n = pe(new a(i), e + _e(i) + 1, t)),
      (r = fr(n.abs(), !1, e + _e(n) + 1)),
      i.isneg() && !i.isZero() ? "-" + r : r);
};
G.toInteger = G.toint = function () {
  var e = this,
    t = e.constructor;
  return pe(new t(e), _e(e) + 1, t.rounding);
};
G.toNumber = function () {
  return +this;
};
G.toPower = G.pow = function (e) {
  var t,
    r,
    n,
    i,
    a,
    o,
    u = this,
    c = u.constructor,
    s = 12,
    l = +(e = new c(e));
  if (!e.s) return new c(Ge);
  if (((u = new c(u)), !u.s)) {
    if (e.s < 1) throw Error(tt + "Infinity");
    return u;
  }
  if (u.eq(Ge)) return u;
  if (((n = c.precision), e.eq(Ge))) return pe(u, n);
  if (((t = e.e), (r = e.d.length - 1), (o = t >= r), (a = u.s), o)) {
    if ((r = l < 0 ? -l : l) <= Vx) {
      for (
        i = new c(Ge), t = Math.ceil(n / me + 4), ge = !1;
        r % 2 && ((i = i.times(u)), Vm(i.d, t)), (r = hn(r / 2)), r !== 0;
      )
        ((u = u.times(u)), Vm(u.d, t));
      return ((ge = !0), e.s < 0 ? new c(Ge).div(i) : pe(i, n));
    }
  } else if (a < 0) throw Error(tt + "NaN");
  return (
    (a = a < 0 && e.d[Math.max(t, r)] & 1 ? -1 : 1),
    (u.s = 1),
    (ge = !1),
    (i = e.times(Gn(u, n + s))),
    (ge = !0),
    (i = Yx(i)),
    (i.s = a),
    i
  );
};
G.toPrecision = function (e, t) {
  var r,
    n,
    i = this,
    a = i.constructor;
  return (
    e === void 0
      ? ((r = _e(i)), (n = fr(i, r <= a.toExpNeg || r >= a.toExpPos)))
      : (vt(e, 1, pn),
        t === void 0 ? (t = a.rounding) : vt(t, 0, 8),
        (i = pe(new a(i), e, t)),
        (r = _e(i)),
        (n = fr(i, e <= r || r <= a.toExpNeg, e))),
    n
  );
};
G.toSignificantDigits = G.tosd = function (e, t) {
  var r = this,
    n = r.constructor;
  return (
    e === void 0
      ? ((e = n.precision), (t = n.rounding))
      : (vt(e, 1, pn), t === void 0 ? (t = n.rounding) : vt(t, 0, 8)),
    pe(new n(r), e, t)
  );
};
G.toString =
  G.valueOf =
  G.val =
  G.toJSON =
  G[Symbol.for("nodejs.util.inspect.custom")] =
    function () {
      var e = this,
        t = _e(e),
        r = e.constructor;
      return fr(e, t <= r.toExpNeg || t >= r.toExpPos);
    };
function Xx(e, t) {
  var r,
    n,
    i,
    a,
    o,
    u,
    c,
    s,
    l = e.constructor,
    f = l.precision;
  if (!e.s || !t.s) return (t.s || (t = new l(e)), ge ? pe(t, f) : t);
  if (((c = e.d), (s = t.d), (o = e.e), (i = t.e), (c = c.slice()), (a = o - i), a)) {
    for (
      a < 0 ? ((n = c), (a = -a), (u = s.length)) : ((n = s), (i = o), (u = c.length)),
        o = Math.ceil(f / me),
        u = o > u ? o + 1 : u + 1,
        a > u && ((a = u), (n.length = 1)),
        n.reverse();
      a--;
    )
      n.push(0);
    n.reverse();
  }
  for (u = c.length, a = s.length, u - a < 0 && ((a = u), (n = s), (s = c), (c = n)), r = 0; a; )
    ((r = ((c[--a] = c[a] + s[a] + r) / Me) | 0), (c[a] %= Me));
  for (r && (c.unshift(r), ++i), u = c.length; c[--u] == 0; ) c.pop();
  return ((t.d = c), (t.e = i), ge ? pe(t, f) : t);
}
function vt(e, t, r) {
  if (e !== ~~e || e < t || e > r) throw Error(ar + e);
}
function lt(e) {
  var t,
    r,
    n,
    i = e.length - 1,
    a = "",
    o = e[0];
  if (i > 0) {
    for (a += o, t = 1; t < i; t++)
      ((n = e[t] + ""), (r = me - n.length), r && (a += Rt(r)), (a += n));
    ((o = e[t]), (n = o + ""), (r = me - n.length), r && (a += Rt(r)));
  } else if (o === 0) return "0";
  for (; o % 10 === 0; ) o /= 10;
  return a + o;
}
var St = (function () {
  function e(n, i) {
    var a,
      o = 0,
      u = n.length;
    for (n = n.slice(); u--; ) ((a = n[u] * i + o), (n[u] = (a % Me) | 0), (o = (a / Me) | 0));
    return (o && n.unshift(o), n);
  }
  function t(n, i, a, o) {
    var u, c;
    if (a != o) c = a > o ? 1 : -1;
    else
      for (u = c = 0; u < a; u++)
        if (n[u] != i[u]) {
          c = n[u] > i[u] ? 1 : -1;
          break;
        }
    return c;
  }
  function r(n, i, a) {
    for (var o = 0; a--; ) ((n[a] -= o), (o = n[a] < i[a] ? 1 : 0), (n[a] = o * Me + n[a] - i[a]));
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return function (n, i, a, o) {
    var u,
      c,
      s,
      l,
      f,
      p,
      d,
      y,
      v,
      h,
      g,
      x,
      w,
      O,
      m,
      b,
      _,
      A,
      T = n.constructor,
      $ = n.s == i.s ? 1 : -1,
      j = n.d,
      E = i.d;
    if (!n.s) return new T(n);
    if (!i.s) throw Error(tt + "Division by zero");
    for (
      c = n.e - i.e, _ = E.length, m = j.length, d = new T($), y = d.d = [], s = 0;
      E[s] == (j[s] || 0);
    )
      ++s;
    if (
      (E[s] > (j[s] || 0) && --c,
      a == null ? (x = a = T.precision) : o ? (x = a + (_e(n) - _e(i)) + 1) : (x = a),
      x < 0)
    )
      return new T(0);
    if (((x = (x / me + 2) | 0), (s = 0), _ == 1))
      for (l = 0, E = E[0], x++; (s < m || l) && x--; s++)
        ((w = l * Me + (j[s] || 0)), (y[s] = (w / E) | 0), (l = (w % E) | 0));
    else {
      for (
        l = (Me / (E[0] + 1)) | 0,
          l > 1 && ((E = e(E, l)), (j = e(j, l)), (_ = E.length), (m = j.length)),
          O = _,
          v = j.slice(0, _),
          h = v.length;
        h < _;
      )
        v[h++] = 0;
      ((A = E.slice()), A.unshift(0), (b = E[0]), E[1] >= Me / 2 && ++b);
      do
        ((l = 0),
          (u = t(E, v, _, h)),
          u < 0
            ? ((g = v[0]),
              _ != h && (g = g * Me + (v[1] || 0)),
              (l = (g / b) | 0),
              l > 1
                ? (l >= Me && (l = Me - 1),
                  (f = e(E, l)),
                  (p = f.length),
                  (h = v.length),
                  (u = t(f, v, p, h)),
                  u == 1 && (l--, r(f, _ < p ? A : E, p)))
                : (l == 0 && (u = l = 1), (f = E.slice())),
              (p = f.length),
              p < h && f.unshift(0),
              r(v, f, h),
              u == -1 &&
                ((h = v.length), (u = t(E, v, _, h)), u < 1 && (l++, r(v, _ < h ? A : E, h))),
              (h = v.length))
            : u === 0 && (l++, (v = [0])),
          (y[s++] = l),
          u && v[0] ? (v[h++] = j[O] || 0) : ((v = [j[O]]), (h = 1)));
      while ((O++ < m || v[0] !== void 0) && x--);
    }
    return (y[0] || y.shift(), (d.e = c), pe(d, o ? a + _e(d) + 1 : a));
  };
})();
function Yx(e, t) {
  var r,
    n,
    i,
    a,
    o,
    u,
    c = 0,
    s = 0,
    l = e.constructor,
    f = l.precision;
  if (_e(e) > 16) throw Error(Hp + _e(e));
  if (!e.s) return new l(Ge);
  for (ge = !1, u = f, o = new l(0.03125); e.abs().gte(0.1); ) ((e = e.times(o)), (s += 5));
  for (
    n = ((Math.log(Zt(2, s)) / Math.LN10) * 2 + 5) | 0,
      u += n,
      r = i = a = new l(Ge),
      l.precision = u;
    ;
  ) {
    if (
      ((i = pe(i.times(e), u)),
      (r = r.times(++c)),
      (o = a.plus(St(i, r, u))),
      lt(o.d).slice(0, u) === lt(a.d).slice(0, u))
    ) {
      for (; s--; ) a = pe(a.times(a), u);
      return ((l.precision = f), t == null ? ((ge = !0), pe(a, f)) : a);
    }
    a = o;
  }
}
function _e(e) {
  for (var t = e.e * me, r = e.d[0]; r >= 10; r /= 10) t++;
  return t;
}
function Zs(e, t, r) {
  if (t > e.LN10.sd())
    throw ((ge = !0), r && (e.precision = r), Error(tt + "LN10 precision limit exceeded"));
  return pe(new e(e.LN10), t);
}
function Rt(e) {
  for (var t = ""; e--; ) t += "0";
  return t;
}
function Gn(e, t) {
  var r,
    n,
    i,
    a,
    o,
    u,
    c,
    s,
    l,
    f = 1,
    p = 10,
    d = e,
    y = d.d,
    v = d.constructor,
    h = v.precision;
  if (d.s < 1) throw Error(tt + (d.s ? "NaN" : "-Infinity"));
  if (d.eq(Ge)) return new v(0);
  if ((t == null ? ((ge = !1), (s = h)) : (s = t), d.eq(10)))
    return (t == null && (ge = !0), Zs(v, s));
  if (
    ((s += p), (v.precision = s), (r = lt(y)), (n = r.charAt(0)), (a = _e(d)), Math.abs(a) < 15e14)
  ) {
    for (; (n < 7 && n != 1) || (n == 1 && r.charAt(1) > 3); )
      ((d = d.times(e)), (r = lt(d.d)), (n = r.charAt(0)), f++);
    ((a = _e(d)), n > 1 ? ((d = new v("0." + r)), a++) : (d = new v(n + "." + r.slice(1))));
  } else
    return (
      (c = Zs(v, s + 2, h).times(a + "")),
      (d = Gn(new v(n + "." + r.slice(1)), s - p).plus(c)),
      (v.precision = h),
      t == null ? ((ge = !0), pe(d, h)) : d
    );
  for (u = o = d = St(d.minus(Ge), d.plus(Ge), s), l = pe(d.times(d), s), i = 3; ; ) {
    if (
      ((o = pe(o.times(l), s)),
      (c = u.plus(St(o, new v(i), s))),
      lt(c.d).slice(0, s) === lt(u.d).slice(0, s))
    )
      return (
        (u = u.times(2)),
        a !== 0 && (u = u.plus(Zs(v, s + 2, h).times(a + ""))),
        (u = St(u, new v(f), s)),
        (v.precision = h),
        t == null ? ((ge = !0), pe(u, h)) : u
      );
    ((u = c), (i += 2));
  }
}
function Gm(e, t) {
  var r, n, i;
  for (
    (r = t.indexOf(".")) > -1 && (t = t.replace(".", "")),
      (n = t.search(/e/i)) > 0
        ? (r < 0 && (r = n), (r += +t.slice(n + 1)), (t = t.substring(0, n)))
        : r < 0 && (r = t.length),
      n = 0;
    t.charCodeAt(n) === 48;
  )
    ++n;
  for (i = t.length; t.charCodeAt(i - 1) === 48; ) --i;
  if (((t = t.slice(n, i)), t)) {
    if (
      ((i -= n),
      (r = r - n - 1),
      (e.e = hn(r / me)),
      (e.d = []),
      (n = (r + 1) % me),
      r < 0 && (n += me),
      n < i)
    ) {
      for (n && e.d.push(+t.slice(0, n)), i -= me; n < i; ) e.d.push(+t.slice(n, (n += me)));
      ((t = t.slice(n)), (n = me - t.length));
    } else n -= i;
    for (; n--; ) t += "0";
    if ((e.d.push(+t), ge && (e.e > fa || e.e < -fa))) throw Error(Hp + r);
  } else ((e.s = 0), (e.e = 0), (e.d = [0]));
  return e;
}
function pe(e, t, r) {
  var n,
    i,
    a,
    o,
    u,
    c,
    s,
    l,
    f = e.d;
  for (o = 1, a = f[0]; a >= 10; a /= 10) o++;
  if (((n = t - o), n < 0)) ((n += me), (i = t), (s = f[(l = 0)]));
  else {
    if (((l = Math.ceil((n + 1) / me)), (a = f.length), l >= a)) return e;
    for (s = a = f[l], o = 1; a >= 10; a /= 10) o++;
    ((n %= me), (i = n - me + o));
  }
  if (
    (r !== void 0 &&
      ((a = Zt(10, o - i - 1)),
      (u = ((s / a) % 10) | 0),
      (c = t < 0 || f[l + 1] !== void 0 || s % a),
      (c =
        r < 4
          ? (u || c) && (r == 0 || r == (e.s < 0 ? 3 : 2))
          : u > 5 ||
            (u == 5 &&
              (r == 4 ||
                c ||
                (r == 6 && ((n > 0 ? (i > 0 ? s / Zt(10, o - i) : 0) : f[l - 1]) % 10) & 1) ||
                r == (e.s < 0 ? 8 : 7))))),
    t < 1 || !f[0])
  )
    return (
      c
        ? ((a = _e(e)),
          (f.length = 1),
          (t = t - a - 1),
          (f[0] = Zt(10, (me - (t % me)) % me)),
          (e.e = hn(-t / me) || 0))
        : ((f.length = 1), (f[0] = e.e = e.s = 0)),
      e
    );
  if (
    (n == 0
      ? ((f.length = l), (a = 1), l--)
      : ((f.length = l + 1),
        (a = Zt(10, me - n)),
        (f[l] = i > 0 ? (((s / Zt(10, o - i)) % Zt(10, i)) | 0) * a : 0)),
    c)
  )
    for (;;)
      if (l == 0) {
        (f[0] += a) == Me && ((f[0] = 1), ++e.e);
        break;
      } else {
        if (((f[l] += a), f[l] != Me)) break;
        ((f[l--] = 0), (a = 1));
      }
  for (n = f.length; f[--n] === 0; ) f.pop();
  if (ge && (e.e > fa || e.e < -fa)) throw Error(Hp + _e(e));
  return e;
}
function Zx(e, t) {
  var r,
    n,
    i,
    a,
    o,
    u,
    c,
    s,
    l,
    f,
    p = e.constructor,
    d = p.precision;
  if (!e.s || !t.s) return (t.s ? (t.s = -t.s) : (t = new p(e)), ge ? pe(t, d) : t);
  if (((c = e.d), (f = t.d), (n = t.e), (s = e.e), (c = c.slice()), (o = s - n), o)) {
    for (
      l = o < 0,
        l ? ((r = c), (o = -o), (u = f.length)) : ((r = f), (n = s), (u = c.length)),
        i = Math.max(Math.ceil(d / me), u) + 2,
        o > i && ((o = i), (r.length = 1)),
        r.reverse(),
        i = o;
      i--;
    )
      r.push(0);
    r.reverse();
  } else {
    for (i = c.length, u = f.length, l = i < u, l && (u = i), i = 0; i < u; i++)
      if (c[i] != f[i]) {
        l = c[i] < f[i];
        break;
      }
    o = 0;
  }
  for (l && ((r = c), (c = f), (f = r), (t.s = -t.s)), u = c.length, i = f.length - u; i > 0; --i)
    c[u++] = 0;
  for (i = f.length; i > o; ) {
    if (c[--i] < f[i]) {
      for (a = i; a && c[--a] === 0; ) c[a] = Me - 1;
      (--c[a], (c[i] += Me));
    }
    c[i] -= f[i];
  }
  for (; c[--u] === 0; ) c.pop();
  for (; c[0] === 0; c.shift()) --n;
  return c[0] ? ((t.d = c), (t.e = n), ge ? pe(t, d) : t) : new p(0);
}
function fr(e, t, r) {
  var n,
    i = _e(e),
    a = lt(e.d),
    o = a.length;
  return (
    t
      ? (r && (n = r - o) > 0
          ? (a = a.charAt(0) + "." + a.slice(1) + Rt(n))
          : o > 1 && (a = a.charAt(0) + "." + a.slice(1)),
        (a = a + (i < 0 ? "e" : "e+") + i))
      : i < 0
        ? ((a = "0." + Rt(-i - 1) + a), r && (n = r - o) > 0 && (a += Rt(n)))
        : i >= o
          ? ((a += Rt(i + 1 - o)), r && (n = r - i - 1) > 0 && (a = a + "." + Rt(n)))
          : ((n = i + 1) < o && (a = a.slice(0, n) + "." + a.slice(n)),
            r && (n = r - o) > 0 && (i + 1 === o && (a += "."), (a += Rt(n)))),
    e.s < 0 ? "-" + a : a
  );
}
function Vm(e, t) {
  if (e.length > t) return ((e.length = t), !0);
}
function Jx(e) {
  var t, r, n;
  function i(a) {
    var o = this;
    if (!(o instanceof i)) return new i(a);
    if (((o.constructor = i), a instanceof i)) {
      ((o.s = a.s), (o.e = a.e), (o.d = (a = a.d) ? a.slice() : a));
      return;
    }
    if (typeof a == "number") {
      if (a * 0 !== 0) throw Error(ar + a);
      if (a > 0) o.s = 1;
      else if (a < 0) ((a = -a), (o.s = -1));
      else {
        ((o.s = 0), (o.e = 0), (o.d = [0]));
        return;
      }
      if (a === ~~a && a < 1e7) {
        ((o.e = 0), (o.d = [a]));
        return;
      }
      return Gm(o, a.toString());
    } else if (typeof a != "string") throw Error(ar + a);
    if ((a.charCodeAt(0) === 45 ? ((a = a.slice(1)), (o.s = -1)) : (o.s = 1), Mj.test(a))) Gm(o, a);
    else throw Error(ar + a);
  }
  if (
    ((i.prototype = G),
    (i.ROUND_UP = 0),
    (i.ROUND_DOWN = 1),
    (i.ROUND_CEIL = 2),
    (i.ROUND_FLOOR = 3),
    (i.ROUND_HALF_UP = 4),
    (i.ROUND_HALF_DOWN = 5),
    (i.ROUND_HALF_EVEN = 6),
    (i.ROUND_HALF_CEIL = 7),
    (i.ROUND_HALF_FLOOR = 8),
    (i.clone = Jx),
    (i.config = i.set = Cj),
    e === void 0 && (e = {}),
    e)
  )
    for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"], t = 0; t < n.length; )
      e.hasOwnProperty((r = n[t++])) || (e[r] = this[r]);
  return (i.config(e), i);
}
function Cj(e) {
  if (!e || typeof e != "object") throw Error(tt + "Object expected");
  var t,
    r,
    n,
    i = ["precision", 1, pn, "rounding", 0, 8, "toExpNeg", -1 / 0, 0, "toExpPos", 0, 1 / 0];
  for (t = 0; t < i.length; t += 3)
    if ((n = e[(r = i[t])]) !== void 0)
      if (hn(n) === n && n >= i[t + 1] && n <= i[t + 2]) this[r] = n;
      else throw Error(ar + r + ": " + n);
  if ((n = e[(r = "LN10")]) !== void 0)
    if (n == Math.LN10) this[r] = new this(n);
    else throw Error(ar + r + ": " + n);
  return this;
}
var Kp = Jx($j);
Ge = new Kp(1);
const fe = Kp;
function Ij(e) {
  return Nj(e) || Dj(e) || kj(e) || Rj();
}
function Rj() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function kj(e, t) {
  if (e) {
    if (typeof e == "string") return af(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return af(e, t);
  }
}
function Dj(e) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(e)) return Array.from(e);
}
function Nj(e) {
  if (Array.isArray(e)) return af(e);
}
function af(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var qj = function (t) {
    return t;
  },
  Qx = {},
  ew = function (t) {
    return t === Qx;
  },
  Xm = function (t) {
    return function r() {
      return arguments.length === 0 ||
        (arguments.length === 1 && ew(arguments.length <= 0 ? void 0 : arguments[0]))
        ? r
        : t.apply(void 0, arguments);
    };
  },
  Lj = function e(t, r) {
    return t === 1
      ? r
      : Xm(function () {
          for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++) i[a] = arguments[a];
          var o = i.filter(function (u) {
            return u !== Qx;
          }).length;
          return o >= t
            ? r.apply(void 0, i)
            : e(
                t - o,
                Xm(function () {
                  for (var u = arguments.length, c = new Array(u), s = 0; s < u; s++)
                    c[s] = arguments[s];
                  var l = i.map(function (f) {
                    return ew(f) ? c.shift() : f;
                  });
                  return r.apply(void 0, Ij(l).concat(c));
                }),
              );
        });
  },
  so = function (t) {
    return Lj(t.length, t);
  },
  of = function (t, r) {
    for (var n = [], i = t; i < r; ++i) n[i - t] = i;
    return n;
  },
  Bj = so(function (e, t) {
    return Array.isArray(t)
      ? t.map(e)
      : Object.keys(t)
          .map(function (r) {
            return t[r];
          })
          .map(e);
  }),
  Fj = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
    if (!r.length) return qj;
    var i = r.reverse(),
      a = i[0],
      o = i.slice(1);
    return function () {
      return o.reduce(
        function (u, c) {
          return c(u);
        },
        a.apply(void 0, arguments),
      );
    };
  },
  uf = function (t) {
    return Array.isArray(t) ? t.reverse() : t.split("").reverse.join("");
  },
  tw = function (t) {
    var r = null,
      n = null;
    return function () {
      for (var i = arguments.length, a = new Array(i), o = 0; o < i; o++) a[o] = arguments[o];
      return (
        (r &&
          a.every(function (u, c) {
            return u === r[c];
          })) ||
          ((r = a), (n = t.apply(void 0, a))),
        n
      );
    };
  };
function Uj(e) {
  var t;
  return (e === 0 ? (t = 1) : (t = Math.floor(new fe(e).abs().log(10).toNumber()) + 1), t);
}
function Wj(e, t, r) {
  for (var n = new fe(e), i = 0, a = []; n.lt(t) && i < 1e5; )
    (a.push(n.toNumber()), (n = n.add(r)), i++);
  return a;
}
var zj = so(function (e, t, r) {
    var n = +e,
      i = +t;
    return n + r * (i - n);
  }),
  Hj = so(function (e, t, r) {
    var n = t - +e;
    return ((n = n || 1 / 0), (r - e) / n);
  }),
  Kj = so(function (e, t, r) {
    var n = t - +e;
    return ((n = n || 1 / 0), Math.max(0, Math.min(1, (r - e) / n)));
  });
const lo = {
  rangeStep: Wj,
  getDigitCount: Uj,
  interpolateNumber: zj,
  uninterpolateNumber: Hj,
  uninterpolateTruncation: Kj,
};
function cf(e) {
  return Xj(e) || Vj(e) || rw(e) || Gj();
}
function Gj() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Vj(e) {
  if (typeof Symbol < "u" && Symbol.iterator in Object(e)) return Array.from(e);
}
function Xj(e) {
  if (Array.isArray(e)) return sf(e);
}
function Vn(e, t) {
  return Jj(e) || Zj(e, t) || rw(e, t) || Yj();
}
function Yj() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function rw(e, t) {
  if (e) {
    if (typeof e == "string") return sf(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return sf(e, t);
  }
}
function sf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Zj(e, t) {
  if (!(typeof Symbol > "u" || !(Symbol.iterator in Object(e)))) {
    var r = [],
      n = !0,
      i = !1,
      a = void 0;
    try {
      for (
        var o = e[Symbol.iterator](), u;
        !(n = (u = o.next()).done) && (r.push(u.value), !(t && r.length === t));
        n = !0
      );
    } catch (c) {
      ((i = !0), (a = c));
    } finally {
      try {
        !n && o.return != null && o.return();
      } finally {
        if (i) throw a;
      }
    }
    return r;
  }
}
function Jj(e) {
  if (Array.isArray(e)) return e;
}
function nw(e) {
  var t = Vn(e, 2),
    r = t[0],
    n = t[1],
    i = r,
    a = n;
  return (r > n && ((i = n), (a = r)), [i, a]);
}
function iw(e, t, r) {
  if (e.lte(0)) return new fe(0);
  var n = lo.getDigitCount(e.toNumber()),
    i = new fe(10).pow(n),
    a = e.div(i),
    o = n !== 1 ? 0.05 : 0.1,
    u = new fe(Math.ceil(a.div(o).toNumber())).add(r).mul(o),
    c = u.mul(i);
  return t ? c : new fe(Math.ceil(c));
}
function Qj(e, t, r) {
  var n = 1,
    i = new fe(e);
  if (!i.isint() && r) {
    var a = Math.abs(e);
    a < 1
      ? ((n = new fe(10).pow(lo.getDigitCount(e) - 1)),
        (i = new fe(Math.floor(i.div(n).toNumber())).mul(n)))
      : a > 1 && (i = new fe(Math.floor(e)));
  } else e === 0 ? (i = new fe(Math.floor((t - 1) / 2))) : r || (i = new fe(Math.floor(e)));
  var o = Math.floor((t - 1) / 2),
    u = Fj(
      Bj(function (c) {
        return i.add(new fe(c - o).mul(n)).toNumber();
      }),
      of,
    );
  return u(0, t);
}
function aw(e, t, r, n) {
  var i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 0;
  if (!Number.isFinite((t - e) / (r - 1)))
    return { step: new fe(0), tickMin: new fe(0), tickMax: new fe(0) };
  var a = iw(new fe(t).sub(e).div(r - 1), n, i),
    o;
  e <= 0 && t >= 0
    ? (o = new fe(0))
    : ((o = new fe(e).add(t).div(2)), (o = o.sub(new fe(o).mod(a))));
  var u = Math.ceil(o.sub(e).div(a).toNumber()),
    c = Math.ceil(new fe(t).sub(o).div(a).toNumber()),
    s = u + c + 1;
  return s > r
    ? aw(e, t, r, n, i + 1)
    : (s < r && ((c = t > 0 ? c + (r - s) : c), (u = t > 0 ? u : u + (r - s))),
      { step: a, tickMin: o.sub(new fe(u).mul(a)), tickMax: o.add(new fe(c).mul(a)) });
}
function e$(e) {
  var t = Vn(e, 2),
    r = t[0],
    n = t[1],
    i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6,
    a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0,
    o = Math.max(i, 2),
    u = nw([r, n]),
    c = Vn(u, 2),
    s = c[0],
    l = c[1];
  if (s === -1 / 0 || l === 1 / 0) {
    var f =
      l === 1 / 0
        ? [s].concat(
            cf(
              of(0, i - 1).map(function () {
                return 1 / 0;
              }),
            ),
          )
        : [].concat(
            cf(
              of(0, i - 1).map(function () {
                return -1 / 0;
              }),
            ),
            [l],
          );
    return r > n ? uf(f) : f;
  }
  if (s === l) return Qj(s, i, a);
  var p = aw(s, l, o, a),
    d = p.step,
    y = p.tickMin,
    v = p.tickMax,
    h = lo.rangeStep(y, v.add(new fe(0.1).mul(d)), d);
  return r > n ? uf(h) : h;
}
function t$(e, t) {
  var r = Vn(e, 2),
    n = r[0],
    i = r[1],
    a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0,
    o = nw([n, i]),
    u = Vn(o, 2),
    c = u[0],
    s = u[1];
  if (c === -1 / 0 || s === 1 / 0) return [n, i];
  if (c === s) return [c];
  var l = Math.max(t, 2),
    f = iw(new fe(s).sub(c).div(l - 1), a, 0),
    p = [].concat(cf(lo.rangeStep(new fe(c), new fe(s).sub(new fe(0.99).mul(f)), f)), [s]);
  return n > i ? uf(p) : p;
}
var r$ = tw(e$),
  n$ = tw(t$),
  i$ = "Invariant failed";
function pr(e, t) {
  throw new Error(i$);
}
var a$ = ["offset", "layout", "width", "dataKey", "data", "dataPointFormatter", "xAxis", "yAxis"];
function Ur(e) {
  "@babel/helpers - typeof";
  return (
    (Ur =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Ur(e)
  );
}
function pa() {
  return (
    (pa = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    pa.apply(this, arguments)
  );
}
function o$(e, t) {
  return l$(e) || s$(e, t) || c$(e, t) || u$();
}
function u$() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function c$(e, t) {
  if (e) {
    if (typeof e == "string") return Ym(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Ym(e, t);
  }
}
function Ym(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function s$(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function l$(e) {
  if (Array.isArray(e)) return e;
}
function f$(e, t) {
  if (e == null) return {};
  var r = p$(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function p$(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function h$(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function d$(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, cw(n.key), n));
  }
}
function v$(e, t, r) {
  return (t && d$(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function y$(e, t, r) {
  return (
    (t = ha(t)),
    m$(e, ow() ? Reflect.construct(t, r || [], ha(e).constructor) : t.apply(e, r))
  );
}
function m$(e, t) {
  if (t && (Ur(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return g$(e);
}
function g$(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function ow() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (ow = function () {
    return !!e;
  })();
}
function ha(e) {
  return (
    (ha = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    ha(e)
  );
}
function b$(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && lf(e, t));
}
function lf(e, t) {
  return (
    (lf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    lf(e, t)
  );
}
function uw(e, t, r) {
  return (
    (t = cw(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function cw(e) {
  var t = x$(e, "string");
  return Ur(t) == "symbol" ? t : t + "";
}
function x$(e, t) {
  if (Ur(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Ur(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var Oi = (function (e) {
  function t() {
    return (h$(this, t), y$(this, t, arguments));
  }
  return (
    b$(t, e),
    v$(t, [
      {
        key: "render",
        value: function () {
          var n = this.props,
            i = n.offset,
            a = n.layout,
            o = n.width,
            u = n.dataKey,
            c = n.data,
            s = n.dataPointFormatter,
            l = n.xAxis,
            f = n.yAxis,
            p = f$(n, a$),
            d = V(p, !1);
          this.props.direction === "x" && l.type !== "number" && pr();
          var y = c.map(function (v) {
            var h = s(v, u),
              g = h.x,
              x = h.y,
              w = h.value,
              O = h.errorVal;
            if (!O) return null;
            var m = [],
              b,
              _;
            if (Array.isArray(O)) {
              var A = o$(O, 2);
              ((b = A[0]), (_ = A[1]));
            } else b = _ = O;
            if (a === "vertical") {
              var T = l.scale,
                $ = x + i,
                j = $ + o,
                E = $ - o,
                C = T(w - b),
                I = T(w + _);
              (m.push({ x1: I, y1: j, x2: I, y2: E }),
                m.push({ x1: C, y1: $, x2: I, y2: $ }),
                m.push({ x1: C, y1: j, x2: C, y2: E }));
            } else if (a === "horizontal") {
              var R = f.scale,
                k = g + i,
                N = k - o,
                W = k + o,
                z = R(w - b),
                K = R(w + _);
              (m.push({ x1: N, y1: K, x2: W, y2: K }),
                m.push({ x1: k, y1: z, x2: k, y2: K }),
                m.push({ x1: N, y1: z, x2: W, y2: z }));
            }
            return S.createElement(
              ie,
              pa(
                {
                  className: "recharts-errorBar",
                  key: "bar-".concat(
                    m.map(function (P) {
                      return "".concat(P.x1, "-").concat(P.x2, "-").concat(P.y1, "-").concat(P.y2);
                    }),
                  ),
                },
                d,
              ),
              m.map(function (P) {
                return S.createElement(
                  "line",
                  pa({}, P, {
                    key: "line-".concat(P.x1, "-").concat(P.x2, "-").concat(P.y1, "-").concat(P.y2),
                  }),
                );
              }),
            );
          });
          return S.createElement(ie, { className: "recharts-errorBars" }, y);
        },
      },
    ])
  );
})(S.Component);
uw(Oi, "defaultProps", {
  stroke: "black",
  strokeWidth: 1.5,
  width: 5,
  offset: 0,
  layout: "horizontal",
});
uw(Oi, "displayName", "ErrorBar");
function Xn(e) {
  "@babel/helpers - typeof";
  return (
    (Xn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Xn(e)
  );
}
function Zm(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Gt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Zm(Object(r), !0).forEach(function (n) {
          w$(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Zm(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function w$(e, t, r) {
  return (
    (t = O$(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function O$(e) {
  var t = _$(e, "string");
  return Xn(t) == "symbol" ? t : t + "";
}
function _$(e, t) {
  if (Xn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Xn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var sw = function (t) {
  var r = t.children,
    n = t.formattedGraphicalItems,
    i = t.legendWidth,
    a = t.legendContent,
    o = Ke(r, Mr);
  if (!o) return null;
  var u = Mr.defaultProps,
    c = u !== void 0 ? Gt(Gt({}, u), o.props) : {},
    s;
  return (
    o.props && o.props.payload
      ? (s = o.props && o.props.payload)
      : a === "children"
        ? (s = (n || []).reduce(function (l, f) {
            var p = f.item,
              d = f.props,
              y = d.sectors || d.data || [];
            return l.concat(
              y.map(function (v) {
                return {
                  type: o.props.iconType || p.props.legendType,
                  value: v.name,
                  color: v.fill,
                  payload: v,
                };
              }),
            );
          }, []))
        : (s = (n || []).map(function (l) {
            var f = l.item,
              p = f.type.defaultProps,
              d = p !== void 0 ? Gt(Gt({}, p), f.props) : {},
              y = d.dataKey,
              v = d.name,
              h = d.legendType,
              g = d.hide;
            return {
              inactive: g,
              dataKey: y,
              type: c.iconType || h || "square",
              color: Gp(f),
              value: v || y,
              payload: d,
            };
          })),
    Gt(Gt(Gt({}, c), Mr.getWithHeight(o, i)), {}, { payload: s, item: o })
  );
};
function Yn(e) {
  "@babel/helpers - typeof";
  return (
    (Yn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Yn(e)
  );
}
function Jm(e) {
  return T$(e) || P$(e) || S$(e) || A$();
}
function A$() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function S$(e, t) {
  if (e) {
    if (typeof e == "string") return ff(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return ff(e, t);
  }
}
function P$(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function T$(e) {
  if (Array.isArray(e)) return ff(e);
}
function ff(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Qm(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function xe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Qm(Object(r), !0).forEach(function (n) {
          Ir(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Qm(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Ir(e, t, r) {
  return (
    (t = E$(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function E$(e) {
  var t = j$(e, "string");
  return Yn(t) == "symbol" ? t : t + "";
}
function j$(e, t) {
  if (Yn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Yn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function we(e, t, r) {
  return J(e) || J(t) ? r : je(t) ? Ve(e, t, r) : Z(t) ? t(e) : r;
}
function $n(e, t, r, n) {
  var i = Tj(e, function (u) {
    return we(u, t);
  });
  if (r === "number") {
    var a = i.filter(function (u) {
      return B(u) || parseFloat(u);
    });
    return a.length ? [co(a), Dt(a)] : [1 / 0, -1 / 0];
  }
  var o = n
    ? i.filter(function (u) {
        return !J(u);
      })
    : i;
  return o.map(function (u) {
    return je(u) || u instanceof Date ? u : "";
  });
}
var $$ = function (t) {
    var r,
      n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [],
      i = arguments.length > 2 ? arguments[2] : void 0,
      a = arguments.length > 3 ? arguments[3] : void 0,
      o = -1,
      u = (r = n?.length) !== null && r !== void 0 ? r : 0;
    if (u <= 1) return 0;
    if (
      a &&
      a.axisType === "angleAxis" &&
      Math.abs(Math.abs(a.range[1] - a.range[0]) - 360) <= 1e-6
    )
      for (var c = a.range, s = 0; s < u; s++) {
        var l = s > 0 ? i[s - 1].coordinate : i[u - 1].coordinate,
          f = i[s].coordinate,
          p = s >= u - 1 ? i[0].coordinate : i[s + 1].coordinate,
          d = void 0;
        if (qe(f - l) !== qe(p - f)) {
          var y = [];
          if (qe(p - f) === qe(c[1] - c[0])) {
            d = p;
            var v = f + c[1] - c[0];
            ((y[0] = Math.min(v, (v + l) / 2)), (y[1] = Math.max(v, (v + l) / 2)));
          } else {
            d = l;
            var h = p + c[1] - c[0];
            ((y[0] = Math.min(f, (h + f) / 2)), (y[1] = Math.max(f, (h + f) / 2)));
          }
          var g = [Math.min(f, (d + f) / 2), Math.max(f, (d + f) / 2)];
          if ((t > g[0] && t <= g[1]) || (t >= y[0] && t <= y[1])) {
            o = i[s].index;
            break;
          }
        } else {
          var x = Math.min(l, p),
            w = Math.max(l, p);
          if (t > (x + f) / 2 && t <= (w + f) / 2) {
            o = i[s].index;
            break;
          }
        }
      }
    else
      for (var O = 0; O < u; O++)
        if (
          (O === 0 && t <= (n[O].coordinate + n[O + 1].coordinate) / 2) ||
          (O > 0 &&
            O < u - 1 &&
            t > (n[O].coordinate + n[O - 1].coordinate) / 2 &&
            t <= (n[O].coordinate + n[O + 1].coordinate) / 2) ||
          (O === u - 1 && t > (n[O].coordinate + n[O - 1].coordinate) / 2)
        ) {
          o = n[O].index;
          break;
        }
    return o;
  },
  Gp = function (t) {
    var r,
      n = t,
      i = n.type.displayName,
      a =
        (r = t.type) !== null && r !== void 0 && r.defaultProps
          ? xe(xe({}, t.type.defaultProps), t.props)
          : t.props,
      o = a.stroke,
      u = a.fill,
      c;
    switch (i) {
      case "Line":
        c = o;
        break;
      case "Area":
      case "Radar":
        c = o && o !== "none" ? o : u;
        break;
      default:
        c = u;
        break;
    }
    return c;
  },
  M$ = function (t) {
    var r = t.barSize,
      n = t.totalSize,
      i = t.stackGroups,
      a = i === void 0 ? {} : i;
    if (!a) return {};
    for (var o = {}, u = Object.keys(a), c = 0, s = u.length; c < s; c++)
      for (var l = a[u[c]].stackGroups, f = Object.keys(l), p = 0, d = f.length; p < d; p++) {
        var y = l[f[p]],
          v = y.items,
          h = y.cateAxisId,
          g = v.filter(function (_) {
            return At(_.type).indexOf("Bar") >= 0;
          });
        if (g && g.length) {
          var x = g[0].type.defaultProps,
            w = x !== void 0 ? xe(xe({}, x), g[0].props) : g[0].props,
            O = w.barSize,
            m = w[h];
          o[m] || (o[m] = []);
          var b = J(O) ? r : O;
          o[m].push({ item: g[0], stackList: g.slice(1), barSize: J(b) ? void 0 : Le(b, n, 0) });
        }
      }
    return o;
  },
  C$ = function (t) {
    var r = t.barGap,
      n = t.barCategoryGap,
      i = t.bandSize,
      a = t.sizeList,
      o = a === void 0 ? [] : a,
      u = t.maxBarSize,
      c = o.length;
    if (c < 1) return null;
    var s = Le(r, i, 0, !0),
      l,
      f = [];
    if (o[0].barSize === +o[0].barSize) {
      var p = !1,
        d = i / c,
        y = o.reduce(function (O, m) {
          return O + m.barSize || 0;
        }, 0);
      ((y += (c - 1) * s),
        y >= i && ((y -= (c - 1) * s), (s = 0)),
        y >= i && d > 0 && ((p = !0), (d *= 0.9), (y = c * d)));
      var v = ((i - y) / 2) >> 0,
        h = { offset: v - s, size: 0 };
      l = o.reduce(function (O, m) {
        var b = {
            item: m.item,
            position: { offset: h.offset + h.size + s, size: p ? d : m.barSize },
          },
          _ = [].concat(Jm(O), [b]);
        return (
          (h = _[_.length - 1].position),
          m.stackList &&
            m.stackList.length &&
            m.stackList.forEach(function (A) {
              _.push({ item: A, position: h });
            }),
          _
        );
      }, f);
    } else {
      var g = Le(n, i, 0, !0);
      i - 2 * g - (c - 1) * s <= 0 && (s = 0);
      var x = (i - 2 * g - (c - 1) * s) / c;
      x > 1 && (x >>= 0);
      var w = u === +u ? Math.min(x, u) : x;
      l = o.reduce(function (O, m, b) {
        var _ = [].concat(Jm(O), [
          { item: m.item, position: { offset: g + (x + s) * b + (x - w) / 2, size: w } },
        ]);
        return (
          m.stackList &&
            m.stackList.length &&
            m.stackList.forEach(function (A) {
              _.push({ item: A, position: _[_.length - 1].position });
            }),
          _
        );
      }, f);
    }
    return l;
  },
  I$ = function (t, r, n, i) {
    var a = n.children,
      o = n.width,
      u = n.margin,
      c = o - (u.left || 0) - (u.right || 0),
      s = sw({ children: a, legendWidth: c });
    if (s) {
      var l = i || {},
        f = l.width,
        p = l.height,
        d = s.align,
        y = s.verticalAlign,
        v = s.layout;
      if ((v === "vertical" || (v === "horizontal" && y === "middle")) && d !== "center" && B(t[d]))
        return xe(xe({}, t), {}, Ir({}, d, t[d] + (f || 0)));
      if ((v === "horizontal" || (v === "vertical" && d === "center")) && y !== "middle" && B(t[y]))
        return xe(xe({}, t), {}, Ir({}, y, t[y] + (p || 0)));
    }
    return t;
  },
  R$ = function (t, r, n) {
    return J(r)
      ? !0
      : t === "horizontal"
        ? r === "yAxis"
        : t === "vertical" || n === "x"
          ? r === "xAxis"
          : n === "y"
            ? r === "yAxis"
            : !0;
  },
  lw = function (t, r, n, i, a) {
    var o = r.props.children,
      u = Xe(o, Oi).filter(function (s) {
        return R$(i, a, s.props.direction);
      });
    if (u && u.length) {
      var c = u.map(function (s) {
        return s.props.dataKey;
      });
      return t.reduce(
        function (s, l) {
          var f = we(l, n);
          if (J(f)) return s;
          var p = Array.isArray(f) ? [co(f), Dt(f)] : [f, f],
            d = c.reduce(
              function (y, v) {
                var h = we(l, v, 0),
                  g = p[0] - Math.abs(Array.isArray(h) ? h[0] : h),
                  x = p[1] + Math.abs(Array.isArray(h) ? h[1] : h);
                return [Math.min(g, y[0]), Math.max(x, y[1])];
              },
              [1 / 0, -1 / 0],
            );
          return [Math.min(d[0], s[0]), Math.max(d[1], s[1])];
        },
        [1 / 0, -1 / 0],
      );
    }
    return null;
  },
  k$ = function (t, r, n, i, a) {
    var o = r
      .map(function (u) {
        return lw(t, u, n, a, i);
      })
      .filter(function (u) {
        return !J(u);
      });
    return o && o.length
      ? o.reduce(
          function (u, c) {
            return [Math.min(u[0], c[0]), Math.max(u[1], c[1])];
          },
          [1 / 0, -1 / 0],
        )
      : null;
  },
  fw = function (t, r, n, i, a) {
    var o = r.map(function (c) {
      var s = c.props.dataKey;
      return (n === "number" && s && lw(t, c, s, i)) || $n(t, s, n, a);
    });
    if (n === "number")
      return o.reduce(
        function (c, s) {
          return [Math.min(c[0], s[0]), Math.max(c[1], s[1])];
        },
        [1 / 0, -1 / 0],
      );
    var u = {};
    return o.reduce(function (c, s) {
      for (var l = 0, f = s.length; l < f; l++) u[s[l]] || ((u[s[l]] = !0), c.push(s[l]));
      return c;
    }, []);
  },
  pw = function (t, r) {
    return (
      (t === "horizontal" && r === "xAxis") ||
      (t === "vertical" && r === "yAxis") ||
      (t === "centric" && r === "angleAxis") ||
      (t === "radial" && r === "radiusAxis")
    );
  },
  hw = function (t, r, n, i) {
    if (i)
      return t.map(function (c) {
        return c.coordinate;
      });
    var a,
      o,
      u = t.map(function (c) {
        return (c.coordinate === r && (a = !0), c.coordinate === n && (o = !0), c.coordinate);
      });
    return (a || u.push(r), o || u.push(n), u);
  },
  _t = function (t, r, n) {
    if (!t) return null;
    var i = t.scale,
      a = t.duplicateDomain,
      o = t.type,
      u = t.range,
      c = t.realScaleType === "scaleBand" ? i.bandwidth() / 2 : 2,
      s = (r || n) && o === "category" && i.bandwidth ? i.bandwidth() / c : 0;
    if (
      ((s = t.axisType === "angleAxis" && u?.length >= 2 ? qe(u[0] - u[1]) * 2 * s : s),
      r && (t.ticks || t.niceTicks))
    ) {
      var l = (t.ticks || t.niceTicks).map(function (f) {
        var p = a ? a.indexOf(f) : f;
        return { coordinate: i(p) + s, value: f, offset: s };
      });
      return l.filter(function (f) {
        return !sn(f.coordinate);
      });
    }
    return t.isCategorical && t.categoricalDomain
      ? t.categoricalDomain.map(function (f, p) {
          return { coordinate: i(f) + s, value: f, index: p, offset: s };
        })
      : i.ticks && !n
        ? i.ticks(t.tickCount).map(function (f) {
            return { coordinate: i(f) + s, value: f, offset: s };
          })
        : i.domain().map(function (f, p) {
            return { coordinate: i(f) + s, value: a ? a[f] : f, index: p, offset: s };
          });
  },
  Js = new WeakMap(),
  ki = function (t, r) {
    if (typeof r != "function") return t;
    Js.has(t) || Js.set(t, new WeakMap());
    var n = Js.get(t);
    if (n.has(r)) return n.get(r);
    var i = function () {
      (t.apply(void 0, arguments), r.apply(void 0, arguments));
    };
    return (n.set(r, i), i);
  },
  dw = function (t, r, n) {
    var i = t.scale,
      a = t.type,
      o = t.layout,
      u = t.axisType;
    if (i === "auto")
      return o === "radial" && u === "radiusAxis"
        ? { scale: Un(), realScaleType: "band" }
        : o === "radial" && u === "angleAxis"
          ? { scale: ua(), realScaleType: "linear" }
          : a === "category" &&
              r &&
              (r.indexOf("LineChart") >= 0 ||
                r.indexOf("AreaChart") >= 0 ||
                (r.indexOf("ComposedChart") >= 0 && !n))
            ? { scale: jn(), realScaleType: "point" }
            : a === "category"
              ? { scale: Un(), realScaleType: "band" }
              : { scale: ua(), realScaleType: "linear" };
    if (ur(i)) {
      var c = "scale".concat(Va(i));
      return { scale: (qm[c] || jn)(), realScaleType: qm[c] ? c : "point" };
    }
    return Z(i) ? { scale: i } : { scale: jn(), realScaleType: "point" };
  },
  eg = 1e-4,
  vw = function (t) {
    var r = t.domain();
    if (!(!r || r.length <= 2)) {
      var n = r.length,
        i = t.range(),
        a = Math.min(i[0], i[1]) - eg,
        o = Math.max(i[0], i[1]) + eg,
        u = t(r[0]),
        c = t(r[n - 1]);
      (u < a || u > o || c < a || c > o) && t.domain([r[0], r[n - 1]]);
    }
  },
  D$ = function (t, r) {
    if (!t) return null;
    for (var n = 0, i = t.length; n < i; n++) if (t[n].item === r) return t[n].position;
    return null;
  },
  N$ = function (t, r) {
    if (!r || r.length !== 2 || !B(r[0]) || !B(r[1])) return t;
    var n = Math.min(r[0], r[1]),
      i = Math.max(r[0], r[1]),
      a = [t[0], t[1]];
    return (
      (!B(t[0]) || t[0] < n) && (a[0] = n),
      (!B(t[1]) || t[1] > i) && (a[1] = i),
      a[0] > i && (a[0] = i),
      a[1] < n && (a[1] = n),
      a
    );
  },
  q$ = function (t) {
    var r = t.length;
    if (!(r <= 0))
      for (var n = 0, i = t[0].length; n < i; ++n)
        for (var a = 0, o = 0, u = 0; u < r; ++u) {
          var c = sn(t[u][n][1]) ? t[u][n][0] : t[u][n][1];
          c >= 0
            ? ((t[u][n][0] = a), (t[u][n][1] = a + c), (a = t[u][n][1]))
            : ((t[u][n][0] = o), (t[u][n][1] = o + c), (o = t[u][n][1]));
        }
  },
  L$ = function (t) {
    var r = t.length;
    if (!(r <= 0))
      for (var n = 0, i = t[0].length; n < i; ++n)
        for (var a = 0, o = 0; o < r; ++o) {
          var u = sn(t[o][n][1]) ? t[o][n][0] : t[o][n][1];
          u >= 0
            ? ((t[o][n][0] = a), (t[o][n][1] = a + u), (a = t[o][n][1]))
            : ((t[o][n][0] = 0), (t[o][n][1] = 0));
        }
  },
  B$ = { sign: q$, expand: TA, none: Rr, silhouette: EA, wiggle: jA, positive: L$ },
  F$ = function (t, r, n) {
    var i = r.map(function (u) {
        return u.props.dataKey;
      }),
      a = B$[n],
      o = PA()
        .keys(i)
        .value(function (u, c) {
          return +we(u, c, 0);
        })
        .order(Bl)
        .offset(a);
    return o(t);
  },
  U$ = function (t, r, n, i, a, o) {
    if (!t) return null;
    var u = o ? r.reverse() : r,
      c = {},
      s = u.reduce(function (f, p) {
        var d,
          y =
            (d = p.type) !== null && d !== void 0 && d.defaultProps
              ? xe(xe({}, p.type.defaultProps), p.props)
              : p.props,
          v = y.stackId,
          h = y.hide;
        if (h) return f;
        var g = y[n],
          x = f[g] || { hasStack: !1, stackGroups: {} };
        if (je(v)) {
          var w = x.stackGroups[v] || { numericAxisId: n, cateAxisId: i, items: [] };
          (w.items.push(p), (x.hasStack = !0), (x.stackGroups[v] = w));
        } else x.stackGroups[vr("_stackId_")] = { numericAxisId: n, cateAxisId: i, items: [p] };
        return xe(xe({}, f), {}, Ir({}, g, x));
      }, c),
      l = {};
    return Object.keys(s).reduce(function (f, p) {
      var d = s[p];
      if (d.hasStack) {
        var y = {};
        d.stackGroups = Object.keys(d.stackGroups).reduce(function (v, h) {
          var g = d.stackGroups[h];
          return xe(
            xe({}, v),
            {},
            Ir({}, h, {
              numericAxisId: n,
              cateAxisId: i,
              items: g.items,
              stackedData: F$(t, g.items, a),
            }),
          );
        }, y);
      }
      return xe(xe({}, f), {}, Ir({}, p, d));
    }, l);
  },
  yw = function (t, r) {
    var n = r.realScaleType,
      i = r.type,
      a = r.tickCount,
      o = r.originalDomain,
      u = r.allowDecimals,
      c = n || r.scale;
    if (c !== "auto" && c !== "linear") return null;
    if (a && i === "number" && o && (o[0] === "auto" || o[1] === "auto")) {
      var s = t.domain();
      if (!s.length) return null;
      var l = r$(s, a, u);
      return (t.domain([co(l), Dt(l)]), { niceTicks: l });
    }
    if (a && i === "number") {
      var f = t.domain(),
        p = n$(f, a, u);
      return { niceTicks: p };
    }
    return null;
  };
function da(e) {
  var t = e.axis,
    r = e.ticks,
    n = e.bandSize,
    i = e.entry,
    a = e.index,
    o = e.dataKey;
  if (t.type === "category") {
    if (!t.allowDuplicatedCategory && t.dataKey && !J(i[t.dataKey])) {
      var u = Ui(r, "value", i[t.dataKey]);
      if (u) return u.coordinate + n / 2;
    }
    return r[a] ? r[a].coordinate + n / 2 : null;
  }
  var c = we(i, J(o) ? t.dataKey : o);
  return J(c) ? null : t.scale(c);
}
var tg = function (t) {
    var r = t.axis,
      n = t.ticks,
      i = t.offset,
      a = t.bandSize,
      o = t.entry,
      u = t.index;
    if (r.type === "category") return n[u] ? n[u].coordinate + i : null;
    var c = we(o, r.dataKey, r.domain[u]);
    return J(c) ? null : r.scale(c) - a / 2 + i;
  },
  W$ = function (t) {
    var r = t.numericAxis,
      n = r.scale.domain();
    if (r.type === "number") {
      var i = Math.min(n[0], n[1]),
        a = Math.max(n[0], n[1]);
      return i <= 0 && a >= 0 ? 0 : a < 0 ? a : i;
    }
    return n[0];
  },
  z$ = function (t, r) {
    var n,
      i =
        (n = t.type) !== null && n !== void 0 && n.defaultProps
          ? xe(xe({}, t.type.defaultProps), t.props)
          : t.props,
      a = i.stackId;
    if (je(a)) {
      var o = r[a];
      if (o) {
        var u = o.items.indexOf(t);
        return u >= 0 ? o.stackedData[u] : null;
      }
    }
    return null;
  },
  H$ = function (t) {
    return t.reduce(
      function (r, n) {
        return [co(n.concat([r[0]]).filter(B)), Dt(n.concat([r[1]]).filter(B))];
      },
      [1 / 0, -1 / 0],
    );
  },
  mw = function (t, r, n) {
    return Object.keys(t)
      .reduce(
        function (i, a) {
          var o = t[a],
            u = o.stackedData,
            c = u.reduce(
              function (s, l) {
                var f = H$(l.slice(r, n + 1));
                return [Math.min(s[0], f[0]), Math.max(s[1], f[1])];
              },
              [1 / 0, -1 / 0],
            );
          return [Math.min(c[0], i[0]), Math.max(c[1], i[1])];
        },
        [1 / 0, -1 / 0],
      )
      .map(function (i) {
        return i === 1 / 0 || i === -1 / 0 ? 0 : i;
      });
  },
  rg = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
  ng = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
  pf = function (t, r, n) {
    if (Z(t)) return t(r, n);
    if (!Array.isArray(t)) return r;
    var i = [];
    if (B(t[0])) i[0] = n ? t[0] : Math.min(t[0], r[0]);
    else if (rg.test(t[0])) {
      var a = +rg.exec(t[0])[1];
      i[0] = r[0] - a;
    } else Z(t[0]) ? (i[0] = t[0](r[0])) : (i[0] = r[0]);
    if (B(t[1])) i[1] = n ? t[1] : Math.max(t[1], r[1]);
    else if (ng.test(t[1])) {
      var o = +ng.exec(t[1])[1];
      i[1] = r[1] + o;
    } else Z(t[1]) ? (i[1] = t[1](r[1])) : (i[1] = r[1]);
    return i;
  },
  va = function (t, r, n) {
    if (t && t.scale && t.scale.bandwidth) {
      var i = t.scale.bandwidth();
      if (!n || i > 0) return i;
    }
    if (t && r && r.length >= 2) {
      for (
        var a = xp(r, function (f) {
            return f.coordinate;
          }),
          o = 1 / 0,
          u = 1,
          c = a.length;
        u < c;
        u++
      ) {
        var s = a[u],
          l = a[u - 1];
        o = Math.min((s.coordinate || 0) - (l.coordinate || 0), o);
      }
      return o === 1 / 0 ? 0 : o;
    }
    return n ? void 0 : 0;
  },
  ig = function (t, r, n) {
    return !t || !t.length || lr(t, Ve(n, "type.defaultProps.domain")) ? r : t;
  },
  gw = function (t, r) {
    var n = t.type.defaultProps ? xe(xe({}, t.type.defaultProps), t.props) : t.props,
      i = n.dataKey,
      a = n.name,
      o = n.unit,
      u = n.formatter,
      c = n.tooltipType,
      s = n.chartType,
      l = n.hide;
    return xe(
      xe({}, V(t, !1)),
      {},
      {
        dataKey: i,
        unit: o,
        formatter: u,
        name: a || i,
        color: Gp(t),
        value: we(r, i),
        type: c,
        payload: r,
        chartType: s,
        hide: l,
      },
    );
  };
function Zn(e) {
  "@babel/helpers - typeof";
  return (
    (Zn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Zn(e)
  );
}
function ag(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function xt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? ag(Object(r), !0).forEach(function (n) {
          bw(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : ag(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function bw(e, t, r) {
  return (
    (t = K$(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function K$(e) {
  var t = G$(e, "string");
  return Zn(t) == "symbol" ? t : t + "";
}
function G$(e, t) {
  if (Zn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Zn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function V$(e, t) {
  return J$(e) || Z$(e, t) || Y$(e, t) || X$();
}
function X$() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Y$(e, t) {
  if (e) {
    if (typeof e == "string") return og(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return og(e, t);
  }
}
function og(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function Z$(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function J$(e) {
  if (Array.isArray(e)) return e;
}
var ya = Math.PI / 180,
  Q$ = function (t) {
    return (t * 180) / Math.PI;
  },
  ve = function (t, r, n, i) {
    return { x: t + Math.cos(-ya * i) * n, y: r + Math.sin(-ya * i) * n };
  },
  xw = function (t, r) {
    var n =
      arguments.length > 2 && arguments[2] !== void 0
        ? arguments[2]
        : { top: 0, right: 0, bottom: 0, left: 0 };
    return (
      Math.min(
        Math.abs(t - (n.left || 0) - (n.right || 0)),
        Math.abs(r - (n.top || 0) - (n.bottom || 0)),
      ) / 2
    );
  },
  eM = function (t, r, n, i, a) {
    var o = t.width,
      u = t.height,
      c = t.startAngle,
      s = t.endAngle,
      l = Le(t.cx, o, o / 2),
      f = Le(t.cy, u, u / 2),
      p = xw(o, u, n),
      d = Le(t.innerRadius, p, 0),
      y = Le(t.outerRadius, p, p * 0.8),
      v = Object.keys(r);
    return v.reduce(function (h, g) {
      var x = r[g],
        w = x.domain,
        O = x.reversed,
        m;
      if (J(x.range))
        (i === "angleAxis" ? (m = [c, s]) : i === "radiusAxis" && (m = [d, y]),
          O && (m = [m[1], m[0]]));
      else {
        m = x.range;
        var b = m,
          _ = V$(b, 2);
        ((c = _[0]), (s = _[1]));
      }
      var A = dw(x, a),
        T = A.realScaleType,
        $ = A.scale;
      ($.domain(w).range(m), vw($));
      var j = yw($, xt(xt({}, x), {}, { realScaleType: T })),
        E = xt(
          xt(xt({}, x), j),
          {},
          {
            range: m,
            radius: y,
            realScaleType: T,
            scale: $,
            cx: l,
            cy: f,
            innerRadius: d,
            outerRadius: y,
            startAngle: c,
            endAngle: s,
          },
        );
      return xt(xt({}, h), {}, bw({}, g, E));
    }, {});
  },
  tM = function (t, r) {
    var n = t.x,
      i = t.y,
      a = r.x,
      o = r.y;
    return Math.sqrt(Math.pow(n - a, 2) + Math.pow(i - o, 2));
  },
  rM = function (t, r) {
    var n = t.x,
      i = t.y,
      a = r.cx,
      o = r.cy,
      u = tM({ x: n, y: i }, { x: a, y: o });
    if (u <= 0) return { radius: u };
    var c = (n - a) / u,
      s = Math.acos(c);
    return (i > o && (s = 2 * Math.PI - s), { radius: u, angle: Q$(s), angleInRadian: s });
  },
  nM = function (t) {
    var r = t.startAngle,
      n = t.endAngle,
      i = Math.floor(r / 360),
      a = Math.floor(n / 360),
      o = Math.min(i, a);
    return { startAngle: r - o * 360, endAngle: n - o * 360 };
  },
  iM = function (t, r) {
    var n = r.startAngle,
      i = r.endAngle,
      a = Math.floor(n / 360),
      o = Math.floor(i / 360),
      u = Math.min(a, o);
    return t + u * 360;
  },
  ug = function (t, r) {
    var n = t.x,
      i = t.y,
      a = rM({ x: n, y: i }, r),
      o = a.radius,
      u = a.angle,
      c = r.innerRadius,
      s = r.outerRadius;
    if (o < c || o > s) return !1;
    if (o === 0) return !0;
    var l = nM(r),
      f = l.startAngle,
      p = l.endAngle,
      d = u,
      y;
    if (f <= p) {
      for (; d > p; ) d -= 360;
      for (; d < f; ) d += 360;
      y = d >= f && d <= p;
    } else {
      for (; d > f; ) d -= 360;
      for (; d < p; ) d += 360;
      y = d >= p && d <= f;
    }
    return y ? xt(xt({}, r), {}, { radius: o, angle: iM(d, r) }) : null;
  },
  ww = function (t) {
    return !L.isValidElement(t) && !Z(t) && typeof t != "boolean" ? t.className : "";
  };
function Jn(e) {
  "@babel/helpers - typeof";
  return (
    (Jn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Jn(e)
  );
}
var aM = ["offset"];
function oM(e) {
  return lM(e) || sM(e) || cM(e) || uM();
}
function uM() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function cM(e, t) {
  if (e) {
    if (typeof e == "string") return hf(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return hf(e, t);
  }
}
function sM(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function lM(e) {
  if (Array.isArray(e)) return hf(e);
}
function hf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function fM(e, t) {
  if (e == null) return {};
  var r = pM(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function pM(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function cg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Te(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? cg(Object(r), !0).forEach(function (n) {
          hM(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : cg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function hM(e, t, r) {
  return (
    (t = dM(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function dM(e) {
  var t = vM(e, "string");
  return Jn(t) == "symbol" ? t : t + "";
}
function vM(e, t) {
  if (Jn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Jn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Qn() {
  return (
    (Qn = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Qn.apply(this, arguments)
  );
}
var yM = function (t) {
    var r = t.value,
      n = t.formatter,
      i = J(t.children) ? r : t.children;
    return Z(n) ? n(i) : i;
  },
  mM = function (t, r) {
    var n = qe(r - t),
      i = Math.min(Math.abs(r - t), 360);
    return n * i;
  },
  gM = function (t, r, n) {
    var i = t.position,
      a = t.viewBox,
      o = t.offset,
      u = t.className,
      c = a,
      s = c.cx,
      l = c.cy,
      f = c.innerRadius,
      p = c.outerRadius,
      d = c.startAngle,
      y = c.endAngle,
      v = c.clockWise,
      h = (f + p) / 2,
      g = mM(d, y),
      x = g >= 0 ? 1 : -1,
      w,
      O;
    (i === "insideStart"
      ? ((w = d + x * o), (O = v))
      : i === "insideEnd"
        ? ((w = y - x * o), (O = !v))
        : i === "end" && ((w = y + x * o), (O = v)),
      (O = g <= 0 ? O : !O));
    var m = ve(s, l, h, w),
      b = ve(s, l, h, w + (O ? 1 : -1) * 359),
      _ = "M"
        .concat(m.x, ",")
        .concat(
          m.y,
          `
    A`,
        )
        .concat(h, ",")
        .concat(h, ",0,1,")
        .concat(
          O ? 0 : 1,
          `,
    `,
        )
        .concat(b.x, ",")
        .concat(b.y),
      A = J(t.id) ? vr("recharts-radial-line-") : t.id;
    return S.createElement(
      "text",
      Qn({}, n, { dominantBaseline: "central", className: te("recharts-radial-bar-label", u) }),
      S.createElement("defs", null, S.createElement("path", { id: A, d: _ })),
      S.createElement("textPath", { xlinkHref: "#".concat(A) }, r),
    );
  },
  bM = function (t) {
    var r = t.viewBox,
      n = t.offset,
      i = t.position,
      a = r,
      o = a.cx,
      u = a.cy,
      c = a.innerRadius,
      s = a.outerRadius,
      l = a.startAngle,
      f = a.endAngle,
      p = (l + f) / 2;
    if (i === "outside") {
      var d = ve(o, u, s + n, p),
        y = d.x,
        v = d.y;
      return { x: y, y: v, textAnchor: y >= o ? "start" : "end", verticalAnchor: "middle" };
    }
    if (i === "center") return { x: o, y: u, textAnchor: "middle", verticalAnchor: "middle" };
    if (i === "centerTop") return { x: o, y: u, textAnchor: "middle", verticalAnchor: "start" };
    if (i === "centerBottom") return { x: o, y: u, textAnchor: "middle", verticalAnchor: "end" };
    var h = (c + s) / 2,
      g = ve(o, u, h, p),
      x = g.x,
      w = g.y;
    return { x, y: w, textAnchor: "middle", verticalAnchor: "middle" };
  },
  xM = function (t) {
    var r = t.viewBox,
      n = t.parentViewBox,
      i = t.offset,
      a = t.position,
      o = r,
      u = o.x,
      c = o.y,
      s = o.width,
      l = o.height,
      f = l >= 0 ? 1 : -1,
      p = f * i,
      d = f > 0 ? "end" : "start",
      y = f > 0 ? "start" : "end",
      v = s >= 0 ? 1 : -1,
      h = v * i,
      g = v > 0 ? "end" : "start",
      x = v > 0 ? "start" : "end";
    if (a === "top") {
      var w = { x: u + s / 2, y: c - f * i, textAnchor: "middle", verticalAnchor: d };
      return Te(Te({}, w), n ? { height: Math.max(c - n.y, 0), width: s } : {});
    }
    if (a === "bottom") {
      var O = { x: u + s / 2, y: c + l + p, textAnchor: "middle", verticalAnchor: y };
      return Te(Te({}, O), n ? { height: Math.max(n.y + n.height - (c + l), 0), width: s } : {});
    }
    if (a === "left") {
      var m = { x: u - h, y: c + l / 2, textAnchor: g, verticalAnchor: "middle" };
      return Te(Te({}, m), n ? { width: Math.max(m.x - n.x, 0), height: l } : {});
    }
    if (a === "right") {
      var b = { x: u + s + h, y: c + l / 2, textAnchor: x, verticalAnchor: "middle" };
      return Te(Te({}, b), n ? { width: Math.max(n.x + n.width - b.x, 0), height: l } : {});
    }
    var _ = n ? { width: s, height: l } : {};
    return a === "insideLeft"
      ? Te({ x: u + h, y: c + l / 2, textAnchor: x, verticalAnchor: "middle" }, _)
      : a === "insideRight"
        ? Te({ x: u + s - h, y: c + l / 2, textAnchor: g, verticalAnchor: "middle" }, _)
        : a === "insideTop"
          ? Te({ x: u + s / 2, y: c + p, textAnchor: "middle", verticalAnchor: y }, _)
          : a === "insideBottom"
            ? Te({ x: u + s / 2, y: c + l - p, textAnchor: "middle", verticalAnchor: d }, _)
            : a === "insideTopLeft"
              ? Te({ x: u + h, y: c + p, textAnchor: x, verticalAnchor: y }, _)
              : a === "insideTopRight"
                ? Te({ x: u + s - h, y: c + p, textAnchor: g, verticalAnchor: y }, _)
                : a === "insideBottomLeft"
                  ? Te({ x: u + h, y: c + l - p, textAnchor: x, verticalAnchor: d }, _)
                  : a === "insideBottomRight"
                    ? Te({ x: u + s - h, y: c + l - p, textAnchor: g, verticalAnchor: d }, _)
                    : cn(a) && (B(a.x) || Qt(a.x)) && (B(a.y) || Qt(a.y))
                      ? Te(
                          {
                            x: u + Le(a.x, s),
                            y: c + Le(a.y, l),
                            textAnchor: "end",
                            verticalAnchor: "end",
                          },
                          _,
                        )
                      : Te(
                          {
                            x: u + s / 2,
                            y: c + l / 2,
                            textAnchor: "middle",
                            verticalAnchor: "middle",
                          },
                          _,
                        );
  },
  wM = function (t) {
    return "cx" in t && B(t.cx);
  };
function Ce(e) {
  var t = e.offset,
    r = t === void 0 ? 5 : t,
    n = fM(e, aM),
    i = Te({ offset: r }, n),
    a = i.viewBox,
    o = i.position,
    u = i.value,
    c = i.children,
    s = i.content,
    l = i.className,
    f = l === void 0 ? "" : l,
    p = i.textBreakAll;
  if (!a || (J(u) && J(c) && !L.isValidElement(s) && !Z(s))) return null;
  if (L.isValidElement(s)) return L.cloneElement(s, i);
  var d;
  if (Z(s)) {
    if (((d = L.createElement(s, i)), L.isValidElement(d))) return d;
  } else d = yM(i);
  var y = wM(a),
    v = V(i, !0);
  if (y && (o === "insideStart" || o === "insideEnd" || o === "end")) return gM(i, d, v);
  var h = y ? bM(i) : xM(i);
  return S.createElement(sr, Qn({ className: te("recharts-label", f) }, v, h, { breakAll: p }), d);
}
Ce.displayName = "Label";
var Ow = function (t) {
    var r = t.cx,
      n = t.cy,
      i = t.angle,
      a = t.startAngle,
      o = t.endAngle,
      u = t.r,
      c = t.radius,
      s = t.innerRadius,
      l = t.outerRadius,
      f = t.x,
      p = t.y,
      d = t.top,
      y = t.left,
      v = t.width,
      h = t.height,
      g = t.clockWise,
      x = t.labelViewBox;
    if (x) return x;
    if (B(v) && B(h)) {
      if (B(f) && B(p)) return { x: f, y: p, width: v, height: h };
      if (B(d) && B(y)) return { x: d, y, width: v, height: h };
    }
    return B(f) && B(p)
      ? { x: f, y: p, width: 0, height: 0 }
      : B(r) && B(n)
        ? {
            cx: r,
            cy: n,
            startAngle: a || i || 0,
            endAngle: o || i || 0,
            innerRadius: s || 0,
            outerRadius: l || c || u || 0,
            clockWise: g,
          }
        : t.viewBox
          ? t.viewBox
          : {};
  },
  OM = function (t, r) {
    return t
      ? t === !0
        ? S.createElement(Ce, { key: "label-implicit", viewBox: r })
        : je(t)
          ? S.createElement(Ce, { key: "label-implicit", viewBox: r, value: t })
          : L.isValidElement(t)
            ? t.type === Ce
              ? L.cloneElement(t, { key: "label-implicit", viewBox: r })
              : S.createElement(Ce, { key: "label-implicit", content: t, viewBox: r })
            : Z(t)
              ? S.createElement(Ce, { key: "label-implicit", content: t, viewBox: r })
              : cn(t)
                ? S.createElement(Ce, Qn({ viewBox: r }, t, { key: "label-implicit" }))
                : null
      : null;
  },
  _M = function (t, r) {
    var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
    if (!t || (!t.children && n && !t.label)) return null;
    var i = t.children,
      a = Ow(t),
      o = Xe(i, Ce).map(function (c, s) {
        return L.cloneElement(c, { viewBox: r || a, key: "label-".concat(s) });
      });
    if (!n) return o;
    var u = OM(t.label, r || a);
    return [u].concat(oM(o));
  };
Ce.parseViewBox = Ow;
Ce.renderCallByParent = _M;
var Qs, sg;
function AM() {
  if (sg) return Qs;
  sg = 1;
  function e(t) {
    var r = t == null ? 0 : t.length;
    return r ? t[r - 1] : void 0;
  }
  return ((Qs = e), Qs);
}
var SM = AM();
const PM = le(SM);
function ei(e) {
  "@babel/helpers - typeof";
  return (
    (ei =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    ei(e)
  );
}
var TM = ["valueAccessor"],
  EM = ["data", "dataKey", "clockWise", "id", "textBreakAll"];
function jM(e) {
  return IM(e) || CM(e) || MM(e) || $M();
}
function $M() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function MM(e, t) {
  if (e) {
    if (typeof e == "string") return df(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return df(e, t);
  }
}
function CM(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function IM(e) {
  if (Array.isArray(e)) return df(e);
}
function df(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function ma() {
  return (
    (ma = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    ma.apply(this, arguments)
  );
}
function lg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function fg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? lg(Object(r), !0).forEach(function (n) {
          RM(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : lg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function RM(e, t, r) {
  return (
    (t = kM(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function kM(e) {
  var t = DM(e, "string");
  return ei(t) == "symbol" ? t : t + "";
}
function DM(e, t) {
  if (ei(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ei(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function pg(e, t) {
  if (e == null) return {};
  var r = NM(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function NM(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var qM = function (t) {
  return Array.isArray(t.value) ? PM(t.value) : t.value;
};
function ht(e) {
  var t = e.valueAccessor,
    r = t === void 0 ? qM : t,
    n = pg(e, TM),
    i = n.data,
    a = n.dataKey,
    o = n.clockWise,
    u = n.id,
    c = n.textBreakAll,
    s = pg(n, EM);
  return !i || !i.length
    ? null
    : S.createElement(
        ie,
        { className: "recharts-label-list" },
        i.map(function (l, f) {
          var p = J(a) ? r(l, f) : we(l && l.payload, a),
            d = J(u) ? {} : { id: "".concat(u, "-").concat(f) };
          return S.createElement(
            Ce,
            ma({}, V(l, !0), s, d, {
              parentViewBox: l.parentViewBox,
              value: p,
              textBreakAll: c,
              viewBox: Ce.parseViewBox(J(o) ? l : fg(fg({}, l), {}, { clockWise: o })),
              key: "label-".concat(f),
              index: f,
            }),
          );
        }),
      );
}
ht.displayName = "LabelList";
function LM(e, t) {
  return e
    ? e === !0
      ? S.createElement(ht, { key: "labelList-implicit", data: t })
      : S.isValidElement(e) || Z(e)
        ? S.createElement(ht, { key: "labelList-implicit", data: t, content: e })
        : cn(e)
          ? S.createElement(ht, ma({ data: t }, e, { key: "labelList-implicit" }))
          : null
    : null;
}
function BM(e, t) {
  var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
  if (!e || (!e.children && r && !e.label)) return null;
  var n = e.children,
    i = Xe(n, ht).map(function (o, u) {
      return L.cloneElement(o, { data: t, key: "labelList-".concat(u) });
    });
  if (!r) return i;
  var a = LM(e.label, t);
  return [a].concat(jM(i));
}
ht.renderCallByParent = BM;
function ti(e) {
  "@babel/helpers - typeof";
  return (
    (ti =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    ti(e)
  );
}
function vf() {
  return (
    (vf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    vf.apply(this, arguments)
  );
}
function hg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function dg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? hg(Object(r), !0).forEach(function (n) {
          FM(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : hg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function FM(e, t, r) {
  return (
    (t = UM(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function UM(e) {
  var t = WM(e, "string");
  return ti(t) == "symbol" ? t : t + "";
}
function WM(e, t) {
  if (ti(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ti(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var zM = function (t, r) {
    var n = qe(r - t),
      i = Math.min(Math.abs(r - t), 359.999);
    return n * i;
  },
  Di = function (t) {
    var r = t.cx,
      n = t.cy,
      i = t.radius,
      a = t.angle,
      o = t.sign,
      u = t.isExternal,
      c = t.cornerRadius,
      s = t.cornerIsExternal,
      l = c * (u ? 1 : -1) + i,
      f = Math.asin(c / l) / ya,
      p = s ? a : a + o * f,
      d = ve(r, n, l, p),
      y = ve(r, n, i, p),
      v = s ? a - o * f : a,
      h = ve(r, n, l * Math.cos(f * ya), v);
    return { center: d, circleTangency: y, lineTangency: h, theta: f };
  },
  _w = function (t) {
    var r = t.cx,
      n = t.cy,
      i = t.innerRadius,
      a = t.outerRadius,
      o = t.startAngle,
      u = t.endAngle,
      c = zM(o, u),
      s = o + c,
      l = ve(r, n, a, o),
      f = ve(r, n, a, s),
      p = "M "
        .concat(l.x, ",")
        .concat(
          l.y,
          `
    A `,
        )
        .concat(a, ",")
        .concat(
          a,
          `,0,
    `,
        )
        .concat(+(Math.abs(c) > 180), ",")
        .concat(
          +(o > s),
          `,
    `,
        )
        .concat(f.x, ",")
        .concat(
          f.y,
          `
  `,
        );
    if (i > 0) {
      var d = ve(r, n, i, o),
        y = ve(r, n, i, s);
      p += "L "
        .concat(y.x, ",")
        .concat(
          y.y,
          `
            A `,
        )
        .concat(i, ",")
        .concat(
          i,
          `,0,
            `,
        )
        .concat(+(Math.abs(c) > 180), ",")
        .concat(
          +(o <= s),
          `,
            `,
        )
        .concat(d.x, ",")
        .concat(d.y, " Z");
    } else p += "L ".concat(r, ",").concat(n, " Z");
    return p;
  },
  HM = function (t) {
    var r = t.cx,
      n = t.cy,
      i = t.innerRadius,
      a = t.outerRadius,
      o = t.cornerRadius,
      u = t.forceCornerRadius,
      c = t.cornerIsExternal,
      s = t.startAngle,
      l = t.endAngle,
      f = qe(l - s),
      p = Di({ cx: r, cy: n, radius: a, angle: s, sign: f, cornerRadius: o, cornerIsExternal: c }),
      d = p.circleTangency,
      y = p.lineTangency,
      v = p.theta,
      h = Di({ cx: r, cy: n, radius: a, angle: l, sign: -f, cornerRadius: o, cornerIsExternal: c }),
      g = h.circleTangency,
      x = h.lineTangency,
      w = h.theta,
      O = c ? Math.abs(s - l) : Math.abs(s - l) - v - w;
    if (O < 0)
      return u
        ? "M "
            .concat(y.x, ",")
            .concat(
              y.y,
              `
        a`,
            )
            .concat(o, ",")
            .concat(o, ",0,0,1,")
            .concat(
              o * 2,
              `,0
        a`,
            )
            .concat(o, ",")
            .concat(o, ",0,0,1,")
            .concat(
              -o * 2,
              `,0
      `,
            )
        : _w({ cx: r, cy: n, innerRadius: i, outerRadius: a, startAngle: s, endAngle: l });
    var m = "M "
      .concat(y.x, ",")
      .concat(
        y.y,
        `
    A`,
      )
      .concat(o, ",")
      .concat(o, ",0,0,")
      .concat(+(f < 0), ",")
      .concat(d.x, ",")
      .concat(
        d.y,
        `
    A`,
      )
      .concat(a, ",")
      .concat(a, ",0,")
      .concat(+(O > 180), ",")
      .concat(+(f < 0), ",")
      .concat(g.x, ",")
      .concat(
        g.y,
        `
    A`,
      )
      .concat(o, ",")
      .concat(o, ",0,0,")
      .concat(+(f < 0), ",")
      .concat(x.x, ",")
      .concat(
        x.y,
        `
  `,
      );
    if (i > 0) {
      var b = Di({
          cx: r,
          cy: n,
          radius: i,
          angle: s,
          sign: f,
          isExternal: !0,
          cornerRadius: o,
          cornerIsExternal: c,
        }),
        _ = b.circleTangency,
        A = b.lineTangency,
        T = b.theta,
        $ = Di({
          cx: r,
          cy: n,
          radius: i,
          angle: l,
          sign: -f,
          isExternal: !0,
          cornerRadius: o,
          cornerIsExternal: c,
        }),
        j = $.circleTangency,
        E = $.lineTangency,
        C = $.theta,
        I = c ? Math.abs(s - l) : Math.abs(s - l) - T - C;
      if (I < 0 && o === 0) return "".concat(m, "L").concat(r, ",").concat(n, "Z");
      m += "L"
        .concat(E.x, ",")
        .concat(
          E.y,
          `
      A`,
        )
        .concat(o, ",")
        .concat(o, ",0,0,")
        .concat(+(f < 0), ",")
        .concat(j.x, ",")
        .concat(
          j.y,
          `
      A`,
        )
        .concat(i, ",")
        .concat(i, ",0,")
        .concat(+(I > 180), ",")
        .concat(+(f > 0), ",")
        .concat(_.x, ",")
        .concat(
          _.y,
          `
      A`,
        )
        .concat(o, ",")
        .concat(o, ",0,0,")
        .concat(+(f < 0), ",")
        .concat(A.x, ",")
        .concat(A.y, "Z");
    } else m += "L".concat(r, ",").concat(n, "Z");
    return m;
  },
  KM = {
    cx: 0,
    cy: 0,
    innerRadius: 0,
    outerRadius: 0,
    startAngle: 0,
    endAngle: 0,
    cornerRadius: 0,
    forceCornerRadius: !1,
    cornerIsExternal: !1,
  },
  Aw = function (t) {
    var r = dg(dg({}, KM), t),
      n = r.cx,
      i = r.cy,
      a = r.innerRadius,
      o = r.outerRadius,
      u = r.cornerRadius,
      c = r.forceCornerRadius,
      s = r.cornerIsExternal,
      l = r.startAngle,
      f = r.endAngle,
      p = r.className;
    if (o < a || l === f) return null;
    var d = te("recharts-sector", p),
      y = o - a,
      v = Le(u, y, 0, !0),
      h;
    return (
      v > 0 && Math.abs(l - f) < 360
        ? (h = HM({
            cx: n,
            cy: i,
            innerRadius: a,
            outerRadius: o,
            cornerRadius: Math.min(v, y / 2),
            forceCornerRadius: c,
            cornerIsExternal: s,
            startAngle: l,
            endAngle: f,
          }))
        : (h = _w({ cx: n, cy: i, innerRadius: a, outerRadius: o, startAngle: l, endAngle: f })),
      S.createElement("path", vf({}, V(r, !0), { className: d, d: h, role: "img" }))
    );
  };
function ri(e) {
  "@babel/helpers - typeof";
  return (
    (ri =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    ri(e)
  );
}
function yf() {
  return (
    (yf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    yf.apply(this, arguments)
  );
}
function vg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function yg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? vg(Object(r), !0).forEach(function (n) {
          GM(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : vg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function GM(e, t, r) {
  return (
    (t = VM(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function VM(e) {
  var t = XM(e, "string");
  return ri(t) == "symbol" ? t : t + "";
}
function XM(e, t) {
  if (ri(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ri(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var mg = {
    curveBasisClosed: vA,
    curveBasisOpen: yA,
    curveBasis: dA,
    curveBumpX: eA,
    curveBumpY: tA,
    curveLinearClosed: mA,
    curveLinear: Ya,
    curveMonotoneX: gA,
    curveMonotoneY: bA,
    curveNatural: xA,
    curveStep: wA,
    curveStepAfter: _A,
    curveStepBefore: OA,
  },
  Ni = function (t) {
    return t.x === +t.x && t.y === +t.y;
  },
  wn = function (t) {
    return t.x;
  },
  On = function (t) {
    return t.y;
  },
  YM = function (t, r) {
    if (Z(t)) return t;
    var n = "curve".concat(Va(t));
    return (n === "curveMonotone" || n === "curveBump") && r
      ? mg["".concat(n).concat(r === "vertical" ? "Y" : "X")]
      : mg[n] || Ya;
  },
  ZM = function (t) {
    var r = t.type,
      n = r === void 0 ? "linear" : r,
      i = t.points,
      a = i === void 0 ? [] : i,
      o = t.baseLine,
      u = t.layout,
      c = t.connectNulls,
      s = c === void 0 ? !1 : c,
      l = YM(n, u),
      f = s
        ? a.filter(function (v) {
            return Ni(v);
          })
        : a,
      p;
    if (Array.isArray(o)) {
      var d = s
          ? o.filter(function (v) {
              return Ni(v);
            })
          : o,
        y = f.map(function (v, h) {
          return yg(yg({}, v), {}, { base: d[h] });
        });
      return (
        u === "vertical"
          ? (p = Ei()
              .y(On)
              .x1(wn)
              .x0(function (v) {
                return v.base.x;
              }))
          : (p = Ei()
              .x(wn)
              .y1(On)
              .y0(function (v) {
                return v.base.y;
              })),
        p.defined(Ni).curve(l),
        p(y)
      );
    }
    return (
      u === "vertical" && B(o)
        ? (p = Ei().y(On).x1(wn).x0(o))
        : B(o)
          ? (p = Ei().x(wn).y1(On).y0(o))
          : (p = _0().x(wn).y(On)),
      p.defined(Ni).curve(l),
      p(f)
    );
  },
  or = function (t) {
    var r = t.className,
      n = t.points,
      i = t.path,
      a = t.pathRef;
    if ((!n || !n.length) && !i) return null;
    var o = n && n.length ? ZM(t) : i;
    return L.createElement(
      "path",
      yf({}, V(t, !1), Wi(t), { className: te("recharts-curve", r), d: o, ref: a }),
    );
  },
  el = { exports: {} },
  tl,
  gg;
function JM() {
  if (gg) return tl;
  gg = 1;
  var e = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return ((tl = e), tl);
}
var rl, bg;
function QM() {
  if (bg) return rl;
  bg = 1;
  var e = JM();
  function t() {}
  function r() {}
  return (
    (r.resetWarningCache = t),
    (rl = function () {
      function n(o, u, c, s, l, f) {
        if (f !== e) {
          var p = new Error(
            "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
          );
          throw ((p.name = "Invariant Violation"), p);
        }
      }
      n.isRequired = n;
      function i() {
        return n;
      }
      var a = {
        array: n,
        bigint: n,
        bool: n,
        func: n,
        number: n,
        object: n,
        string: n,
        symbol: n,
        any: n,
        arrayOf: i,
        element: n,
        elementType: n,
        instanceOf: i,
        node: n,
        objectOf: i,
        oneOf: i,
        oneOfType: i,
        shape: i,
        exact: i,
        checkPropTypes: r,
        resetWarningCache: t,
      };
      return ((a.PropTypes = a), a);
    }),
    rl
  );
}
var xg;
function eC() {
  return (xg || ((xg = 1), (el.exports = QM()())), el.exports);
}
var tC = eC();
const se = le(tC),
  { getOwnPropertyNames: rC, getOwnPropertySymbols: nC } = Object,
  { hasOwnProperty: iC } = Object.prototype;
function nl(e, t) {
  return function (n, i, a) {
    return e(n, i, a) && t(n, i, a);
  };
}
function qi(e) {
  return function (r, n, i) {
    if (!r || !n || typeof r != "object" || typeof n != "object") return e(r, n, i);
    const { cache: a } = i,
      o = a.get(r),
      u = a.get(n);
    if (o && u) return o === n && u === r;
    (a.set(r, n), a.set(n, r));
    const c = e(r, n, i);
    return (a.delete(r), a.delete(n), c);
  };
}
function aC(e) {
  return e?.[Symbol.toStringTag];
}
function wg(e) {
  return rC(e).concat(nC(e));
}
const oC = Object.hasOwn || ((e, t) => iC.call(e, t));
function gr(e, t) {
  return e === t || (!e && !t && e !== e && t !== t);
}
const uC = "__v",
  cC = "__o",
  sC = "_owner",
  { getOwnPropertyDescriptor: Og, keys: _g } = Object;
function lC(e, t) {
  return e.byteLength === t.byteLength && ga(new Uint8Array(e), new Uint8Array(t));
}
function fC(e, t, r) {
  let n = e.length;
  if (t.length !== n) return !1;
  for (; n-- > 0; ) if (!r.equals(e[n], t[n], n, n, e, t, r)) return !1;
  return !0;
}
function pC(e, t) {
  return (
    e.byteLength === t.byteLength &&
    ga(
      new Uint8Array(e.buffer, e.byteOffset, e.byteLength),
      new Uint8Array(t.buffer, t.byteOffset, t.byteLength),
    )
  );
}
function hC(e, t) {
  return gr(e.getTime(), t.getTime());
}
function dC(e, t) {
  return e.name === t.name && e.message === t.message && e.cause === t.cause && e.stack === t.stack;
}
function vC(e, t) {
  return e === t;
}
function Ag(e, t, r) {
  const n = e.size;
  if (n !== t.size) return !1;
  if (!n) return !0;
  const i = new Array(n),
    a = e.entries();
  let o,
    u,
    c = 0;
  for (; (o = a.next()) && !o.done; ) {
    const s = t.entries();
    let l = !1,
      f = 0;
    for (; (u = s.next()) && !u.done; ) {
      if (i[f]) {
        f++;
        continue;
      }
      const p = o.value,
        d = u.value;
      if (r.equals(p[0], d[0], c, f, e, t, r) && r.equals(p[1], d[1], p[0], d[0], e, t, r)) {
        l = i[f] = !0;
        break;
      }
      f++;
    }
    if (!l) return !1;
    c++;
  }
  return !0;
}
const yC = gr;
function mC(e, t, r) {
  const n = _g(e);
  let i = n.length;
  if (_g(t).length !== i) return !1;
  for (; i-- > 0; ) if (!Sw(e, t, r, n[i])) return !1;
  return !0;
}
function _n(e, t, r) {
  const n = wg(e);
  let i = n.length;
  if (wg(t).length !== i) return !1;
  let a, o, u;
  for (; i-- > 0; )
    if (
      ((a = n[i]),
      !Sw(e, t, r, a) ||
        ((o = Og(e, a)),
        (u = Og(t, a)),
        (o || u) &&
          (!o ||
            !u ||
            o.configurable !== u.configurable ||
            o.enumerable !== u.enumerable ||
            o.writable !== u.writable)))
    )
      return !1;
  return !0;
}
function gC(e, t) {
  return gr(e.valueOf(), t.valueOf());
}
function bC(e, t) {
  return e.source === t.source && e.flags === t.flags;
}
function Sg(e, t, r) {
  const n = e.size;
  if (n !== t.size) return !1;
  if (!n) return !0;
  const i = new Array(n),
    a = e.values();
  let o, u;
  for (; (o = a.next()) && !o.done; ) {
    const c = t.values();
    let s = !1,
      l = 0;
    for (; (u = c.next()) && !u.done; ) {
      if (!i[l] && r.equals(o.value, u.value, o.value, u.value, e, t, r)) {
        s = i[l] = !0;
        break;
      }
      l++;
    }
    if (!s) return !1;
  }
  return !0;
}
function ga(e, t) {
  let r = e.byteLength;
  if (t.byteLength !== r || e.byteOffset !== t.byteOffset) return !1;
  for (; r-- > 0; ) if (e[r] !== t[r]) return !1;
  return !0;
}
function xC(e, t) {
  return (
    e.hostname === t.hostname &&
    e.pathname === t.pathname &&
    e.protocol === t.protocol &&
    e.port === t.port &&
    e.hash === t.hash &&
    e.username === t.username &&
    e.password === t.password
  );
}
function Sw(e, t, r, n) {
  return (n === sC || n === cC || n === uC) && (e.$$typeof || t.$$typeof)
    ? !0
    : oC(t, n) && r.equals(e[n], t[n], n, n, e, t, r);
}
const wC = "[object ArrayBuffer]",
  OC = "[object Arguments]",
  _C = "[object Boolean]",
  AC = "[object DataView]",
  SC = "[object Date]",
  PC = "[object Error]",
  TC = "[object Map]",
  EC = "[object Number]",
  jC = "[object Object]",
  $C = "[object RegExp]",
  MC = "[object Set]",
  CC = "[object String]",
  IC = {
    "[object Int8Array]": !0,
    "[object Uint8Array]": !0,
    "[object Uint8ClampedArray]": !0,
    "[object Int16Array]": !0,
    "[object Uint16Array]": !0,
    "[object Int32Array]": !0,
    "[object Uint32Array]": !0,
    "[object Float16Array]": !0,
    "[object Float32Array]": !0,
    "[object Float64Array]": !0,
    "[object BigInt64Array]": !0,
    "[object BigUint64Array]": !0,
  },
  RC = "[object URL]",
  kC = Object.prototype.toString;
function DC({
  areArrayBuffersEqual: e,
  areArraysEqual: t,
  areDataViewsEqual: r,
  areDatesEqual: n,
  areErrorsEqual: i,
  areFunctionsEqual: a,
  areMapsEqual: o,
  areNumbersEqual: u,
  areObjectsEqual: c,
  arePrimitiveWrappersEqual: s,
  areRegExpsEqual: l,
  areSetsEqual: f,
  areTypedArraysEqual: p,
  areUrlsEqual: d,
  unknownTagComparators: y,
}) {
  return function (h, g, x) {
    if (h === g) return !0;
    if (h == null || g == null) return !1;
    const w = typeof h;
    if (w !== typeof g) return !1;
    if (w !== "object") return w === "number" ? u(h, g, x) : w === "function" ? a(h, g, x) : !1;
    const O = h.constructor;
    if (O !== g.constructor) return !1;
    if (O === Object) return c(h, g, x);
    if (Array.isArray(h)) return t(h, g, x);
    if (O === Date) return n(h, g, x);
    if (O === RegExp) return l(h, g, x);
    if (O === Map) return o(h, g, x);
    if (O === Set) return f(h, g, x);
    const m = kC.call(h);
    if (m === SC) return n(h, g, x);
    if (m === $C) return l(h, g, x);
    if (m === TC) return o(h, g, x);
    if (m === MC) return f(h, g, x);
    if (m === jC) return typeof h.then != "function" && typeof g.then != "function" && c(h, g, x);
    if (m === RC) return d(h, g, x);
    if (m === PC) return i(h, g, x);
    if (m === OC) return c(h, g, x);
    if (IC[m]) return p(h, g, x);
    if (m === wC) return e(h, g, x);
    if (m === AC) return r(h, g, x);
    if (m === _C || m === EC || m === CC) return s(h, g, x);
    if (y) {
      let b = y[m];
      if (!b) {
        const _ = aC(h);
        _ && (b = y[_]);
      }
      if (b) return b(h, g, x);
    }
    return !1;
  };
}
function NC({ circular: e, createCustomConfig: t, strict: r }) {
  let n = {
    areArrayBuffersEqual: lC,
    areArraysEqual: r ? _n : fC,
    areDataViewsEqual: pC,
    areDatesEqual: hC,
    areErrorsEqual: dC,
    areFunctionsEqual: vC,
    areMapsEqual: r ? nl(Ag, _n) : Ag,
    areNumbersEqual: yC,
    areObjectsEqual: r ? _n : mC,
    arePrimitiveWrappersEqual: gC,
    areRegExpsEqual: bC,
    areSetsEqual: r ? nl(Sg, _n) : Sg,
    areTypedArraysEqual: r ? nl(ga, _n) : ga,
    areUrlsEqual: xC,
    unknownTagComparators: void 0,
  };
  if ((t && (n = Object.assign({}, n, t(n))), e)) {
    const i = qi(n.areArraysEqual),
      a = qi(n.areMapsEqual),
      o = qi(n.areObjectsEqual),
      u = qi(n.areSetsEqual);
    n = Object.assign({}, n, {
      areArraysEqual: i,
      areMapsEqual: a,
      areObjectsEqual: o,
      areSetsEqual: u,
    });
  }
  return n;
}
function qC(e) {
  return function (t, r, n, i, a, o, u) {
    return e(t, r, u);
  };
}
function LC({ circular: e, comparator: t, createState: r, equals: n, strict: i }) {
  if (r)
    return function (u, c) {
      const { cache: s = e ? new WeakMap() : void 0, meta: l } = r();
      return t(u, c, { cache: s, equals: n, meta: l, strict: i });
    };
  if (e)
    return function (u, c) {
      return t(u, c, { cache: new WeakMap(), equals: n, meta: void 0, strict: i });
    };
  const a = { cache: void 0, equals: n, meta: void 0, strict: i };
  return function (u, c) {
    return t(u, c, a);
  };
}
const BC = Wt();
Wt({ strict: !0 });
Wt({ circular: !0 });
Wt({ circular: !0, strict: !0 });
Wt({ createInternalComparator: () => gr });
Wt({ strict: !0, createInternalComparator: () => gr });
Wt({ circular: !0, createInternalComparator: () => gr });
Wt({ circular: !0, createInternalComparator: () => gr, strict: !0 });
function Wt(e = {}) {
  const { circular: t = !1, createInternalComparator: r, createState: n, strict: i = !1 } = e,
    a = NC(e),
    o = DC(a),
    u = r ? r(o) : qC(o);
  return LC({ circular: t, comparator: o, createState: n, equals: u, strict: i });
}
function FC(e) {
  typeof requestAnimationFrame < "u" && requestAnimationFrame(e);
}
function Pg(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
    r = -1,
    n = function i(a) {
      (r < 0 && (r = a), a - r > t ? (e(a), (r = -1)) : FC(i));
    };
  requestAnimationFrame(n);
}
function mf(e) {
  "@babel/helpers - typeof";
  return (
    (mf =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    mf(e)
  );
}
function UC(e) {
  return KC(e) || HC(e) || zC(e) || WC();
}
function WC() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function zC(e, t) {
  if (e) {
    if (typeof e == "string") return Tg(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Tg(e, t);
  }
}
function Tg(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function HC(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function KC(e) {
  if (Array.isArray(e)) return e;
}
function GC() {
  var e = {},
    t = function () {
      return null;
    },
    r = !1,
    n = function i(a) {
      if (!r) {
        if (Array.isArray(a)) {
          if (!a.length) return;
          var o = a,
            u = UC(o),
            c = u[0],
            s = u.slice(1);
          if (typeof c == "number") {
            Pg(i.bind(null, s), c);
            return;
          }
          (i(c), Pg(i.bind(null, s)));
          return;
        }
        (mf(a) === "object" && ((e = a), t(e)), typeof a == "function" && a());
      }
    };
  return {
    stop: function () {
      r = !0;
    },
    start: function (a) {
      ((r = !1), n(a));
    },
    subscribe: function (a) {
      return (
        (t = a),
        function () {
          t = function () {
            return null;
          };
        }
      );
    },
  };
}
function ni(e) {
  "@babel/helpers - typeof";
  return (
    (ni =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    ni(e)
  );
}
function Eg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function jg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Eg(Object(r), !0).forEach(function (n) {
          Pw(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Eg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Pw(e, t, r) {
  return (
    (t = VC(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function VC(e) {
  var t = XC(e, "string");
  return ni(t) === "symbol" ? t : String(t);
}
function XC(e, t) {
  if (ni(e) !== "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ni(n) !== "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var YC = function (t, r) {
    return [Object.keys(t), Object.keys(r)].reduce(function (n, i) {
      return n.filter(function (a) {
        return i.includes(a);
      });
    });
  },
  ZC = function (t) {
    return t;
  },
  JC = function (t) {
    return t.replace(/([A-Z])/g, function (r) {
      return "-".concat(r.toLowerCase());
    });
  },
  Mn = function (t, r) {
    return Object.keys(r).reduce(function (n, i) {
      return jg(jg({}, n), {}, Pw({}, i, t(i, r[i])));
    }, {});
  },
  $g = function (t, r, n) {
    return t
      .map(function (i) {
        return "".concat(JC(i), " ").concat(r, "ms ").concat(n);
      })
      .join(",");
  };
function QC(e, t) {
  return rI(e) || tI(e, t) || Tw(e, t) || eI();
}
function eI() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function tI(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function rI(e) {
  if (Array.isArray(e)) return e;
}
function nI(e) {
  return oI(e) || aI(e) || Tw(e) || iI();
}
function iI() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Tw(e, t) {
  if (e) {
    if (typeof e == "string") return gf(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return gf(e, t);
  }
}
function aI(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function oI(e) {
  if (Array.isArray(e)) return gf(e);
}
function gf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var ba = 1e-4,
  Ew = function (t, r) {
    return [0, 3 * t, 3 * r - 6 * t, 3 * t - 3 * r + 1];
  },
  jw = function (t, r) {
    return t
      .map(function (n, i) {
        return n * Math.pow(r, i);
      })
      .reduce(function (n, i) {
        return n + i;
      });
  },
  Mg = function (t, r) {
    return function (n) {
      var i = Ew(t, r);
      return jw(i, n);
    };
  },
  uI = function (t, r) {
    return function (n) {
      var i = Ew(t, r),
        a = [].concat(
          nI(
            i
              .map(function (o, u) {
                return o * u;
              })
              .slice(1),
          ),
          [0],
        );
      return jw(a, n);
    };
  },
  Cg = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
    var i = r[0],
      a = r[1],
      o = r[2],
      u = r[3];
    if (r.length === 1)
      switch (r[0]) {
        case "linear":
          ((i = 0), (a = 0), (o = 1), (u = 1));
          break;
        case "ease":
          ((i = 0.25), (a = 0.1), (o = 0.25), (u = 1));
          break;
        case "ease-in":
          ((i = 0.42), (a = 0), (o = 1), (u = 1));
          break;
        case "ease-out":
          ((i = 0.42), (a = 0), (o = 0.58), (u = 1));
          break;
        case "ease-in-out":
          ((i = 0), (a = 0), (o = 0.58), (u = 1));
          break;
        default: {
          var c = r[0].split("(");
          if (c[0] === "cubic-bezier" && c[1].split(")")[0].split(",").length === 4) {
            var s = c[1]
                .split(")")[0]
                .split(",")
                .map(function (h) {
                  return parseFloat(h);
                }),
              l = QC(s, 4);
            ((i = l[0]), (a = l[1]), (o = l[2]), (u = l[3]));
          }
        }
      }
    var f = Mg(i, o),
      p = Mg(a, u),
      d = uI(i, o),
      y = function (g) {
        return g > 1 ? 1 : g < 0 ? 0 : g;
      },
      v = function (g) {
        for (var x = g > 1 ? 1 : g, w = x, O = 0; O < 8; ++O) {
          var m = f(w) - x,
            b = d(w);
          if (Math.abs(m - x) < ba || b < ba) return p(w);
          w = y(w - m / b);
        }
        return p(w);
      };
    return ((v.isStepper = !1), v);
  },
  cI = function () {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
      r = t.stiff,
      n = r === void 0 ? 100 : r,
      i = t.damping,
      a = i === void 0 ? 8 : i,
      o = t.dt,
      u = o === void 0 ? 17 : o,
      c = function (l, f, p) {
        var d = -(l - f) * n,
          y = p * a,
          v = p + ((d - y) * u) / 1e3,
          h = (p * u) / 1e3 + l;
        return Math.abs(h - f) < ba && Math.abs(v) < ba ? [f, 0] : [h, v];
      };
    return ((c.isStepper = !0), (c.dt = u), c);
  },
  sI = function () {
    for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++) r[n] = arguments[n];
    var i = r[0];
    if (typeof i == "string")
      switch (i) {
        case "ease":
        case "ease-in-out":
        case "ease-out":
        case "ease-in":
        case "linear":
          return Cg(i);
        case "spring":
          return cI();
        default:
          if (i.split("(")[0] === "cubic-bezier") return Cg(i);
      }
    return typeof i == "function" ? i : null;
  };
function ii(e) {
  "@babel/helpers - typeof";
  return (
    (ii =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    ii(e)
  );
}
function Ig(e) {
  return pI(e) || fI(e) || $w(e) || lI();
}
function lI() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function fI(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function pI(e) {
  if (Array.isArray(e)) return xf(e);
}
function Rg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Re(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Rg(Object(r), !0).forEach(function (n) {
          bf(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Rg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function bf(e, t, r) {
  return (
    (t = hI(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function hI(e) {
  var t = dI(e, "string");
  return ii(t) === "symbol" ? t : String(t);
}
function dI(e, t) {
  if (ii(e) !== "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ii(n) !== "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function vI(e, t) {
  return gI(e) || mI(e, t) || $w(e, t) || yI();
}
function yI() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function $w(e, t) {
  if (e) {
    if (typeof e == "string") return xf(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return xf(e, t);
  }
}
function xf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function mI(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function gI(e) {
  if (Array.isArray(e)) return e;
}
var xa = function (t, r, n) {
    return t + (r - t) * n;
  },
  wf = function (t) {
    var r = t.from,
      n = t.to;
    return r !== n;
  },
  bI = function e(t, r, n) {
    var i = Mn(function (a, o) {
      if (wf(o)) {
        var u = t(o.from, o.to, o.velocity),
          c = vI(u, 2),
          s = c[0],
          l = c[1];
        return Re(Re({}, o), {}, { from: s, velocity: l });
      }
      return o;
    }, r);
    return n < 1
      ? Mn(function (a, o) {
          return wf(o)
            ? Re(
                Re({}, o),
                {},
                { velocity: xa(o.velocity, i[a].velocity, n), from: xa(o.from, i[a].from, n) },
              )
            : o;
        }, r)
      : e(t, i, n - 1);
  };
const xI = function (e, t, r, n, i) {
  var a = YC(e, t),
    o = a.reduce(function (h, g) {
      return Re(Re({}, h), {}, bf({}, g, [e[g], t[g]]));
    }, {}),
    u = a.reduce(function (h, g) {
      return Re(Re({}, h), {}, bf({}, g, { from: e[g], velocity: 0, to: t[g] }));
    }, {}),
    c = -1,
    s,
    l,
    f = function () {
      return null;
    },
    p = function () {
      return Mn(function (g, x) {
        return x.from;
      }, u);
    },
    d = function () {
      return !Object.values(u).filter(wf).length;
    },
    y = function (g) {
      s || (s = g);
      var x = g - s,
        w = x / r.dt;
      ((u = bI(r, u, w)),
        i(Re(Re(Re({}, e), t), p())),
        (s = g),
        d() || (c = requestAnimationFrame(f)));
    },
    v = function (g) {
      l || (l = g);
      var x = (g - l) / n,
        w = Mn(function (m, b) {
          return xa.apply(void 0, Ig(b).concat([r(x)]));
        }, o);
      if ((i(Re(Re(Re({}, e), t), w)), x < 1)) c = requestAnimationFrame(f);
      else {
        var O = Mn(function (m, b) {
          return xa.apply(void 0, Ig(b).concat([r(1)]));
        }, o);
        i(Re(Re(Re({}, e), t), O));
      }
    };
  return (
    (f = r.isStepper ? y : v),
    function () {
      return (
        requestAnimationFrame(f),
        function () {
          cancelAnimationFrame(c);
        }
      );
    }
  );
};
function Wr(e) {
  "@babel/helpers - typeof";
  return (
    (Wr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Wr(e)
  );
}
var wI = [
  "children",
  "begin",
  "duration",
  "attributeName",
  "easing",
  "isActive",
  "steps",
  "from",
  "to",
  "canBegin",
  "onAnimationEnd",
  "shouldReAnimate",
  "onAnimationReStart",
];
function OI(e, t) {
  if (e == null) return {};
  var r = _I(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function _I(e, t) {
  if (e == null) return {};
  var r = {},
    n = Object.keys(e),
    i,
    a;
  for (a = 0; a < n.length; a++) ((i = n[a]), !(t.indexOf(i) >= 0) && (r[i] = e[i]));
  return r;
}
function il(e) {
  return TI(e) || PI(e) || SI(e) || AI();
}
function AI() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function SI(e, t) {
  if (e) {
    if (typeof e == "string") return Of(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Of(e, t);
  }
}
function PI(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function TI(e) {
  if (Array.isArray(e)) return Of(e);
}
function Of(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function kg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function nt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? kg(Object(r), !0).forEach(function (n) {
          Tn(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : kg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Tn(e, t, r) {
  return (
    (t = Mw(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function EI(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function jI(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, Mw(n.key), n));
  }
}
function $I(e, t, r) {
  return (t && jI(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function Mw(e) {
  var t = MI(e, "string");
  return Wr(t) === "symbol" ? t : String(t);
}
function MI(e, t) {
  if (Wr(e) !== "object" || e === null) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Wr(n) !== "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function CI(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && _f(e, t));
}
function _f(e, t) {
  return (
    (_f = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    _f(e, t)
  );
}
function II(e) {
  var t = RI();
  return function () {
    var n = wa(e),
      i;
    if (t) {
      var a = wa(this).constructor;
      i = Reflect.construct(n, arguments, a);
    } else i = n.apply(this, arguments);
    return Af(this, i);
  };
}
function Af(e, t) {
  if (t && (Wr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return Sf(e);
}
function Sf(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function RI() {
  if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
  if (typeof Proxy == "function") return !0;
  try {
    return (Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0);
  } catch {
    return !1;
  }
}
function wa(e) {
  return (
    (wa = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    wa(e)
  );
}
var ct = (function (e) {
  CI(r, e);
  var t = II(r);
  function r(n, i) {
    var a;
    (EI(this, r), (a = t.call(this, n, i)));
    var o = a.props,
      u = o.isActive,
      c = o.attributeName,
      s = o.from,
      l = o.to,
      f = o.steps,
      p = o.children,
      d = o.duration;
    if (
      ((a.handleStyleChange = a.handleStyleChange.bind(Sf(a))),
      (a.changeStyle = a.changeStyle.bind(Sf(a))),
      !u || d <= 0)
    )
      return ((a.state = { style: {} }), typeof p == "function" && (a.state = { style: l }), Af(a));
    if (f && f.length) a.state = { style: f[0].style };
    else if (s) {
      if (typeof p == "function") return ((a.state = { style: s }), Af(a));
      a.state = { style: c ? Tn({}, c, s) : s };
    } else a.state = { style: {} };
    return a;
  }
  return (
    $I(r, [
      {
        key: "componentDidMount",
        value: function () {
          var i = this.props,
            a = i.isActive,
            o = i.canBegin;
          ((this.mounted = !0), !(!a || !o) && this.runAnimation(this.props));
        },
      },
      {
        key: "componentDidUpdate",
        value: function (i) {
          var a = this.props,
            o = a.isActive,
            u = a.canBegin,
            c = a.attributeName,
            s = a.shouldReAnimate,
            l = a.to,
            f = a.from,
            p = this.state.style;
          if (u) {
            if (!o) {
              var d = { style: c ? Tn({}, c, l) : l };
              this.state && p && ((c && p[c] !== l) || (!c && p !== l)) && this.setState(d);
              return;
            }
            if (!(BC(i.to, l) && i.canBegin && i.isActive)) {
              var y = !i.canBegin || !i.isActive;
              (this.manager && this.manager.stop(), this.stopJSAnimation && this.stopJSAnimation());
              var v = y || s ? f : i.to;
              if (this.state && p) {
                var h = { style: c ? Tn({}, c, v) : v };
                ((c && p[c] !== v) || (!c && p !== v)) && this.setState(h);
              }
              this.runAnimation(nt(nt({}, this.props), {}, { from: v, begin: 0 }));
            }
          }
        },
      },
      {
        key: "componentWillUnmount",
        value: function () {
          this.mounted = !1;
          var i = this.props.onAnimationEnd;
          (this.unSubscribe && this.unSubscribe(),
            this.manager && (this.manager.stop(), (this.manager = null)),
            this.stopJSAnimation && this.stopJSAnimation(),
            i && i());
        },
      },
      {
        key: "handleStyleChange",
        value: function (i) {
          this.changeStyle(i);
        },
      },
      {
        key: "changeStyle",
        value: function (i) {
          this.mounted && this.setState({ style: i });
        },
      },
      {
        key: "runJSAnimation",
        value: function (i) {
          var a = this,
            o = i.from,
            u = i.to,
            c = i.duration,
            s = i.easing,
            l = i.begin,
            f = i.onAnimationEnd,
            p = i.onAnimationStart,
            d = xI(o, u, sI(s), c, this.changeStyle),
            y = function () {
              a.stopJSAnimation = d();
            };
          this.manager.start([p, l, y, c, f]);
        },
      },
      {
        key: "runStepAnimation",
        value: function (i) {
          var a = this,
            o = i.steps,
            u = i.begin,
            c = i.onAnimationStart,
            s = o[0],
            l = s.style,
            f = s.duration,
            p = f === void 0 ? 0 : f,
            d = function (v, h, g) {
              if (g === 0) return v;
              var x = h.duration,
                w = h.easing,
                O = w === void 0 ? "ease" : w,
                m = h.style,
                b = h.properties,
                _ = h.onAnimationEnd,
                A = g > 0 ? o[g - 1] : h,
                T = b || Object.keys(m);
              if (typeof O == "function" || O === "spring")
                return [].concat(il(v), [
                  a.runJSAnimation.bind(a, { from: A.style, to: m, duration: x, easing: O }),
                  x,
                ]);
              var $ = $g(T, x, O),
                j = nt(nt(nt({}, A.style), m), {}, { transition: $ });
              return [].concat(il(v), [j, x, _]).filter(ZC);
            };
          return this.manager.start(
            [c].concat(il(o.reduce(d, [l, Math.max(p, u)])), [i.onAnimationEnd]),
          );
        },
      },
      {
        key: "runAnimation",
        value: function (i) {
          this.manager || (this.manager = GC());
          var a = i.begin,
            o = i.duration,
            u = i.attributeName,
            c = i.to,
            s = i.easing,
            l = i.onAnimationStart,
            f = i.onAnimationEnd,
            p = i.steps,
            d = i.children,
            y = this.manager;
          if (
            ((this.unSubscribe = y.subscribe(this.handleStyleChange)),
            typeof s == "function" || typeof d == "function" || s === "spring")
          ) {
            this.runJSAnimation(i);
            return;
          }
          if (p.length > 1) {
            this.runStepAnimation(i);
            return;
          }
          var v = u ? Tn({}, u, c) : c,
            h = $g(Object.keys(v), o, s);
          y.start([l, a, nt(nt({}, v), {}, { transition: h }), o, f]);
        },
      },
      {
        key: "render",
        value: function () {
          var i = this.props,
            a = i.children;
          i.begin;
          var o = i.duration;
          (i.attributeName, i.easing);
          var u = i.isActive;
          (i.steps,
            i.from,
            i.to,
            i.canBegin,
            i.onAnimationEnd,
            i.shouldReAnimate,
            i.onAnimationReStart);
          var c = OI(i, wI),
            s = L.Children.count(a),
            l = this.state.style;
          if (typeof a == "function") return a(l);
          if (!u || s === 0 || o <= 0) return a;
          var f = function (d) {
            var y = d.props,
              v = y.style,
              h = v === void 0 ? {} : v,
              g = y.className,
              x = L.cloneElement(d, nt(nt({}, c), {}, { style: nt(nt({}, h), l), className: g }));
            return x;
          };
          return s === 1
            ? f(L.Children.only(a))
            : S.createElement(
                "div",
                null,
                L.Children.map(a, function (p) {
                  return f(p);
                }),
              );
        },
      },
    ]),
    r
  );
})(L.PureComponent);
ct.displayName = "Animate";
ct.defaultProps = {
  begin: 0,
  duration: 1e3,
  from: "",
  to: "",
  attributeName: "",
  easing: "ease",
  isActive: !0,
  canBegin: !0,
  steps: [],
  onAnimationEnd: function () {},
  onAnimationStart: function () {},
};
ct.propTypes = {
  from: se.oneOfType([se.object, se.string]),
  to: se.oneOfType([se.object, se.string]),
  attributeName: se.string,
  duration: se.number,
  begin: se.number,
  easing: se.oneOfType([se.string, se.func]),
  steps: se.arrayOf(
    se.shape({
      duration: se.number.isRequired,
      style: se.object.isRequired,
      easing: se.oneOfType([
        se.oneOf(["ease", "ease-in", "ease-out", "ease-in-out", "linear"]),
        se.func,
      ]),
      properties: se.arrayOf("string"),
      onAnimationEnd: se.func,
    }),
  ),
  children: se.oneOfType([se.node, se.func]),
  isActive: se.bool,
  canBegin: se.bool,
  onAnimationEnd: se.func,
  shouldReAnimate: se.bool,
  onAnimationStart: se.func,
  onAnimationReStart: se.func,
};
function ai(e) {
  "@babel/helpers - typeof";
  return (
    (ai =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    ai(e)
  );
}
function Oa() {
  return (
    (Oa = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Oa.apply(this, arguments)
  );
}
function kI(e, t) {
  return LI(e) || qI(e, t) || NI(e, t) || DI();
}
function DI() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function NI(e, t) {
  if (e) {
    if (typeof e == "string") return Dg(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Dg(e, t);
  }
}
function Dg(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function qI(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function LI(e) {
  if (Array.isArray(e)) return e;
}
function Ng(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function qg(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ng(Object(r), !0).forEach(function (n) {
          BI(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ng(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function BI(e, t, r) {
  return (
    (t = FI(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function FI(e) {
  var t = UI(e, "string");
  return ai(t) == "symbol" ? t : t + "";
}
function UI(e, t) {
  if (ai(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ai(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Lg = function (t, r, n, i, a) {
    var o = Math.min(Math.abs(n) / 2, Math.abs(i) / 2),
      u = i >= 0 ? 1 : -1,
      c = n >= 0 ? 1 : -1,
      s = (i >= 0 && n >= 0) || (i < 0 && n < 0) ? 1 : 0,
      l;
    if (o > 0 && a instanceof Array) {
      for (var f = [0, 0, 0, 0], p = 0, d = 4; p < d; p++) f[p] = a[p] > o ? o : a[p];
      ((l = "M".concat(t, ",").concat(r + u * f[0])),
        f[0] > 0 &&
          (l += "A "
            .concat(f[0], ",")
            .concat(f[0], ",0,0,")
            .concat(s, ",")
            .concat(t + c * f[0], ",")
            .concat(r)),
        (l += "L ".concat(t + n - c * f[1], ",").concat(r)),
        f[1] > 0 &&
          (l += "A "
            .concat(f[1], ",")
            .concat(f[1], ",0,0,")
            .concat(
              s,
              `,
        `,
            )
            .concat(t + n, ",")
            .concat(r + u * f[1])),
        (l += "L ".concat(t + n, ",").concat(r + i - u * f[2])),
        f[2] > 0 &&
          (l += "A "
            .concat(f[2], ",")
            .concat(f[2], ",0,0,")
            .concat(
              s,
              `,
        `,
            )
            .concat(t + n - c * f[2], ",")
            .concat(r + i)),
        (l += "L ".concat(t + c * f[3], ",").concat(r + i)),
        f[3] > 0 &&
          (l += "A "
            .concat(f[3], ",")
            .concat(f[3], ",0,0,")
            .concat(
              s,
              `,
        `,
            )
            .concat(t, ",")
            .concat(r + i - u * f[3])),
        (l += "Z"));
    } else if (o > 0 && a === +a && a > 0) {
      var y = Math.min(o, a);
      l = "M "
        .concat(t, ",")
        .concat(
          r + u * y,
          `
            A `,
        )
        .concat(y, ",")
        .concat(y, ",0,0,")
        .concat(s, ",")
        .concat(t + c * y, ",")
        .concat(
          r,
          `
            L `,
        )
        .concat(t + n - c * y, ",")
        .concat(
          r,
          `
            A `,
        )
        .concat(y, ",")
        .concat(y, ",0,0,")
        .concat(s, ",")
        .concat(t + n, ",")
        .concat(
          r + u * y,
          `
            L `,
        )
        .concat(t + n, ",")
        .concat(
          r + i - u * y,
          `
            A `,
        )
        .concat(y, ",")
        .concat(y, ",0,0,")
        .concat(s, ",")
        .concat(t + n - c * y, ",")
        .concat(
          r + i,
          `
            L `,
        )
        .concat(t + c * y, ",")
        .concat(
          r + i,
          `
            A `,
        )
        .concat(y, ",")
        .concat(y, ",0,0,")
        .concat(s, ",")
        .concat(t, ",")
        .concat(r + i - u * y, " Z");
    } else
      l = "M ".concat(t, ",").concat(r, " h ").concat(n, " v ").concat(i, " h ").concat(-n, " Z");
    return l;
  },
  WI = function (t, r) {
    if (!t || !r) return !1;
    var n = t.x,
      i = t.y,
      a = r.x,
      o = r.y,
      u = r.width,
      c = r.height;
    if (Math.abs(u) > 0 && Math.abs(c) > 0) {
      var s = Math.min(a, a + u),
        l = Math.max(a, a + u),
        f = Math.min(o, o + c),
        p = Math.max(o, o + c);
      return n >= s && n <= l && i >= f && i <= p;
    }
    return !1;
  },
  zI = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    radius: 0,
    isAnimationActive: !1,
    isUpdateAnimationActive: !1,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: "ease",
  },
  Vp = function (t) {
    var r = qg(qg({}, zI), t),
      n = L.useRef(),
      i = L.useState(-1),
      a = kI(i, 2),
      o = a[0],
      u = a[1];
    L.useEffect(function () {
      if (n.current && n.current.getTotalLength)
        try {
          var O = n.current.getTotalLength();
          O && u(O);
        } catch {}
    }, []);
    var c = r.x,
      s = r.y,
      l = r.width,
      f = r.height,
      p = r.radius,
      d = r.className,
      y = r.animationEasing,
      v = r.animationDuration,
      h = r.animationBegin,
      g = r.isAnimationActive,
      x = r.isUpdateAnimationActive;
    if (c !== +c || s !== +s || l !== +l || f !== +f || l === 0 || f === 0) return null;
    var w = te("recharts-rectangle", d);
    return x
      ? S.createElement(
          ct,
          {
            canBegin: o > 0,
            from: { width: l, height: f, x: c, y: s },
            to: { width: l, height: f, x: c, y: s },
            duration: v,
            animationEasing: y,
            isActive: x,
          },
          function (O) {
            var m = O.width,
              b = O.height,
              _ = O.x,
              A = O.y;
            return S.createElement(
              ct,
              {
                canBegin: o > 0,
                from: "0px ".concat(o === -1 ? 1 : o, "px"),
                to: "".concat(o, "px 0px"),
                attributeName: "strokeDasharray",
                begin: h,
                duration: v,
                isActive: g,
                easing: y,
              },
              S.createElement(
                "path",
                Oa({}, V(r, !0), { className: w, d: Lg(_, A, m, b, p), ref: n }),
              ),
            );
          },
        )
      : S.createElement("path", Oa({}, V(r, !0), { className: w, d: Lg(c, s, l, f, p) }));
  },
  HI = ["points", "className", "baseLinePoints", "connectNulls"];
function Pr() {
  return (
    (Pr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Pr.apply(this, arguments)
  );
}
function KI(e, t) {
  if (e == null) return {};
  var r = GI(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function GI(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Bg(e) {
  return ZI(e) || YI(e) || XI(e) || VI();
}
function VI() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function XI(e, t) {
  if (e) {
    if (typeof e == "string") return Pf(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Pf(e, t);
  }
}
function YI(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function ZI(e) {
  if (Array.isArray(e)) return Pf(e);
}
function Pf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var Fg = function (t) {
    return t && t.x === +t.x && t.y === +t.y;
  },
  JI = function () {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
      r = [[]];
    return (
      t.forEach(function (n) {
        Fg(n) ? r[r.length - 1].push(n) : r[r.length - 1].length > 0 && r.push([]);
      }),
      Fg(t[0]) && r[r.length - 1].push(t[0]),
      r[r.length - 1].length <= 0 && (r = r.slice(0, -1)),
      r
    );
  },
  Cn = function (t, r) {
    var n = JI(t);
    r &&
      (n = [
        n.reduce(function (a, o) {
          return [].concat(Bg(a), Bg(o));
        }, []),
      ]);
    var i = n
      .map(function (a) {
        return a.reduce(function (o, u, c) {
          return ""
            .concat(o)
            .concat(c === 0 ? "M" : "L")
            .concat(u.x, ",")
            .concat(u.y);
        }, "");
      })
      .join("");
    return n.length === 1 ? "".concat(i, "Z") : i;
  },
  QI = function (t, r, n) {
    var i = Cn(t, n);
    return ""
      .concat(i.slice(-1) === "Z" ? i.slice(0, -1) : i, "L")
      .concat(Cn(r.reverse(), n).slice(1));
  },
  eR = function (t) {
    var r = t.points,
      n = t.className,
      i = t.baseLinePoints,
      a = t.connectNulls,
      o = KI(t, HI);
    if (!r || !r.length) return null;
    var u = te("recharts-polygon", n);
    if (i && i.length) {
      var c = o.stroke && o.stroke !== "none",
        s = QI(r, i, a);
      return S.createElement(
        "g",
        { className: u },
        S.createElement(
          "path",
          Pr({}, V(o, !0), { fill: s.slice(-1) === "Z" ? o.fill : "none", stroke: "none", d: s }),
        ),
        c ? S.createElement("path", Pr({}, V(o, !0), { fill: "none", d: Cn(r, a) })) : null,
        c ? S.createElement("path", Pr({}, V(o, !0), { fill: "none", d: Cn(i, a) })) : null,
      );
    }
    var l = Cn(r, a);
    return S.createElement(
      "path",
      Pr({}, V(o, !0), { fill: l.slice(-1) === "Z" ? o.fill : "none", className: u, d: l }),
    );
  };
function Tf() {
  return (
    (Tf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Tf.apply(this, arguments)
  );
}
var _i = function (t) {
  var r = t.cx,
    n = t.cy,
    i = t.r,
    a = t.className,
    o = te("recharts-dot", a);
  return r === +r && n === +n && i === +i
    ? L.createElement("circle", Tf({}, V(t, !1), Wi(t), { className: o, cx: r, cy: n, r: i }))
    : null;
};
function oi(e) {
  "@babel/helpers - typeof";
  return (
    (oi =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    oi(e)
  );
}
var tR = ["x", "y", "top", "left", "width", "height", "className"];
function Ef() {
  return (
    (Ef = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Ef.apply(this, arguments)
  );
}
function Ug(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function rR(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ug(Object(r), !0).forEach(function (n) {
          nR(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ug(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function nR(e, t, r) {
  return (
    (t = iR(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function iR(e) {
  var t = aR(e, "string");
  return oi(t) == "symbol" ? t : t + "";
}
function aR(e, t) {
  if (oi(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (oi(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function oR(e, t) {
  if (e == null) return {};
  var r = uR(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function uR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var cR = function (t, r, n, i, a, o) {
    return "M".concat(t, ",").concat(a, "v").concat(i, "M").concat(o, ",").concat(r, "h").concat(n);
  },
  sR = function (t) {
    var r = t.x,
      n = r === void 0 ? 0 : r,
      i = t.y,
      a = i === void 0 ? 0 : i,
      o = t.top,
      u = o === void 0 ? 0 : o,
      c = t.left,
      s = c === void 0 ? 0 : c,
      l = t.width,
      f = l === void 0 ? 0 : l,
      p = t.height,
      d = p === void 0 ? 0 : p,
      y = t.className,
      v = oR(t, tR),
      h = rR({ x: n, y: a, top: u, left: s, width: f, height: d }, v);
    return !B(n) || !B(a) || !B(f) || !B(d) || !B(u) || !B(s)
      ? null
      : S.createElement(
          "path",
          Ef({}, V(h, !0), { className: te("recharts-cross", y), d: cR(n, a, f, d, u, s) }),
        );
  },
  al,
  Wg;
function lR() {
  if (Wg) return al;
  Wg = 1;
  var e = uo(),
    t = Kx(),
    r = mt();
  function n(i, a) {
    return i && i.length ? e(i, r(a, 2), t) : void 0;
  }
  return ((al = n), al);
}
var fR = lR();
const pR = le(fR);
var ol, zg;
function hR() {
  if (zg) return ol;
  zg = 1;
  var e = uo(),
    t = mt(),
    r = Gx();
  function n(i, a) {
    return i && i.length ? e(i, t(a, 2), r) : void 0;
  }
  return ((ol = n), ol);
}
var dR = hR();
const vR = le(dR);
var yR = ["cx", "cy", "angle", "ticks", "axisLine"],
  mR = ["ticks", "tick", "angle", "tickFormatter", "stroke"];
function zr(e) {
  "@babel/helpers - typeof";
  return (
    (zr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    zr(e)
  );
}
function In() {
  return (
    (In = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    In.apply(this, arguments)
  );
}
function Hg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Vt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Hg(Object(r), !0).forEach(function (n) {
          fo(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Hg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Kg(e, t) {
  if (e == null) return {};
  var r = gR(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function gR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function bR(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Gg(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, Iw(n.key), n));
  }
}
function xR(e, t, r) {
  return (
    t && Gg(e.prototype, t),
    r && Gg(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function wR(e, t, r) {
  return (
    (t = _a(t)),
    OR(e, Cw() ? Reflect.construct(t, r || [], _a(e).constructor) : t.apply(e, r))
  );
}
function OR(e, t) {
  if (t && (zr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return _R(e);
}
function _R(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Cw() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (Cw = function () {
    return !!e;
  })();
}
function _a(e) {
  return (
    (_a = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    _a(e)
  );
}
function AR(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && jf(e, t));
}
function jf(e, t) {
  return (
    (jf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    jf(e, t)
  );
}
function fo(e, t, r) {
  return (
    (t = Iw(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Iw(e) {
  var t = SR(e, "string");
  return zr(t) == "symbol" ? t : t + "";
}
function SR(e, t) {
  if (zr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (zr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var po = (function (e) {
  function t() {
    return (bR(this, t), wR(this, t, arguments));
  }
  return (
    AR(t, e),
    xR(
      t,
      [
        {
          key: "getTickValueCoord",
          value: function (n) {
            var i = n.coordinate,
              a = this.props,
              o = a.angle,
              u = a.cx,
              c = a.cy;
            return ve(u, c, i, o);
          },
        },
        {
          key: "getTickTextAnchor",
          value: function () {
            var n = this.props.orientation,
              i;
            switch (n) {
              case "left":
                i = "end";
                break;
              case "right":
                i = "start";
                break;
              default:
                i = "middle";
                break;
            }
            return i;
          },
        },
        {
          key: "getViewBox",
          value: function () {
            var n = this.props,
              i = n.cx,
              a = n.cy,
              o = n.angle,
              u = n.ticks,
              c = pR(u, function (l) {
                return l.coordinate || 0;
              }),
              s = vR(u, function (l) {
                return l.coordinate || 0;
              });
            return {
              cx: i,
              cy: a,
              startAngle: o,
              endAngle: o,
              innerRadius: s.coordinate || 0,
              outerRadius: c.coordinate || 0,
            };
          },
        },
        {
          key: "renderAxisLine",
          value: function () {
            var n = this.props,
              i = n.cx,
              a = n.cy,
              o = n.angle,
              u = n.ticks,
              c = n.axisLine,
              s = Kg(n, yR),
              l = u.reduce(
                function (y, v) {
                  return [Math.min(y[0], v.coordinate), Math.max(y[1], v.coordinate)];
                },
                [1 / 0, -1 / 0],
              ),
              f = ve(i, a, l[0], o),
              p = ve(i, a, l[1], o),
              d = Vt(
                Vt(Vt({}, V(s, !1)), {}, { fill: "none" }, V(c, !1)),
                {},
                { x1: f.x, y1: f.y, x2: p.x, y2: p.y },
              );
            return S.createElement("line", In({ className: "recharts-polar-radius-axis-line" }, d));
          },
        },
        {
          key: "renderTicks",
          value: function () {
            var n = this,
              i = this.props,
              a = i.ticks,
              o = i.tick,
              u = i.angle,
              c = i.tickFormatter,
              s = i.stroke,
              l = Kg(i, mR),
              f = this.getTickTextAnchor(),
              p = V(l, !1),
              d = V(o, !1),
              y = a.map(function (v, h) {
                var g = n.getTickValueCoord(v),
                  x = Vt(
                    Vt(
                      Vt(
                        Vt(
                          {
                            textAnchor: f,
                            transform: "rotate("
                              .concat(90 - u, ", ")
                              .concat(g.x, ", ")
                              .concat(g.y, ")"),
                          },
                          p,
                        ),
                        {},
                        { stroke: "none", fill: s },
                        d,
                      ),
                      {},
                      { index: h },
                      g,
                    ),
                    {},
                    { payload: v },
                  );
                return S.createElement(
                  ie,
                  In(
                    {
                      className: te("recharts-polar-radius-axis-tick", ww(o)),
                      key: "tick-".concat(v.coordinate),
                    },
                    cr(n.props, v, h),
                  ),
                  t.renderTickItem(o, x, c ? c(v.value, h) : v.value),
                );
              });
            return S.createElement(ie, { className: "recharts-polar-radius-axis-ticks" }, y);
          },
        },
        {
          key: "render",
          value: function () {
            var n = this.props,
              i = n.ticks,
              a = n.axisLine,
              o = n.tick;
            return !i || !i.length
              ? null
              : S.createElement(
                  ie,
                  { className: te("recharts-polar-radius-axis", this.props.className) },
                  a && this.renderAxisLine(),
                  o && this.renderTicks(),
                  Ce.renderCallByParent(this.props, this.getViewBox()),
                );
          },
        },
      ],
      [
        {
          key: "renderTickItem",
          value: function (n, i, a) {
            var o;
            return (
              S.isValidElement(n)
                ? (o = S.cloneElement(n, i))
                : Z(n)
                  ? (o = n(i))
                  : (o = S.createElement(
                      sr,
                      In({}, i, { className: "recharts-polar-radius-axis-tick-value" }),
                      a,
                    )),
              o
            );
          },
        },
      ],
    )
  );
})(L.PureComponent);
fo(po, "displayName", "PolarRadiusAxis");
fo(po, "axisType", "radiusAxis");
fo(po, "defaultProps", {
  type: "number",
  radiusAxisId: 0,
  cx: 0,
  cy: 0,
  angle: 0,
  orientation: "right",
  stroke: "#ccc",
  axisLine: !0,
  tick: !0,
  tickCount: 5,
  allowDataOverflow: !1,
  scale: "auto",
  allowDuplicatedCategory: !0,
});
function Hr(e) {
  "@babel/helpers - typeof";
  return (
    (Hr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Hr(e)
  );
}
function Jt() {
  return (
    (Jt = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Jt.apply(this, arguments)
  );
}
function Vg(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Xt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Vg(Object(r), !0).forEach(function (n) {
          ho(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Vg(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function PR(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Xg(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, kw(n.key), n));
  }
}
function TR(e, t, r) {
  return (
    t && Xg(e.prototype, t),
    r && Xg(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function ER(e, t, r) {
  return (
    (t = Aa(t)),
    jR(e, Rw() ? Reflect.construct(t, r || [], Aa(e).constructor) : t.apply(e, r))
  );
}
function jR(e, t) {
  if (t && (Hr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return $R(e);
}
function $R(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Rw() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (Rw = function () {
    return !!e;
  })();
}
function Aa(e) {
  return (
    (Aa = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Aa(e)
  );
}
function MR(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && $f(e, t));
}
function $f(e, t) {
  return (
    ($f = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    $f(e, t)
  );
}
function ho(e, t, r) {
  return (
    (t = kw(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function kw(e) {
  var t = CR(e, "string");
  return Hr(t) == "symbol" ? t : t + "";
}
function CR(e, t) {
  if (Hr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Hr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var IR = Math.PI / 180,
  Yg = 1e-5,
  vo = (function (e) {
    function t() {
      return (PR(this, t), ER(this, t, arguments));
    }
    return (
      MR(t, e),
      TR(
        t,
        [
          {
            key: "getTickLineCoord",
            value: function (n) {
              var i = this.props,
                a = i.cx,
                o = i.cy,
                u = i.radius,
                c = i.orientation,
                s = i.tickSize,
                l = s || 8,
                f = ve(a, o, u, n.coordinate),
                p = ve(a, o, u + (c === "inner" ? -1 : 1) * l, n.coordinate);
              return { x1: f.x, y1: f.y, x2: p.x, y2: p.y };
            },
          },
          {
            key: "getTickTextAnchor",
            value: function (n) {
              var i = this.props.orientation,
                a = Math.cos(-n.coordinate * IR),
                o;
              return (
                a > Yg
                  ? (o = i === "outer" ? "start" : "end")
                  : a < -Yg
                    ? (o = i === "outer" ? "end" : "start")
                    : (o = "middle"),
                o
              );
            },
          },
          {
            key: "renderAxisLine",
            value: function () {
              var n = this.props,
                i = n.cx,
                a = n.cy,
                o = n.radius,
                u = n.axisLine,
                c = n.axisLineType,
                s = Xt(Xt({}, V(this.props, !1)), {}, { fill: "none" }, V(u, !1));
              if (c === "circle")
                return S.createElement(
                  _i,
                  Jt({ className: "recharts-polar-angle-axis-line" }, s, { cx: i, cy: a, r: o }),
                );
              var l = this.props.ticks,
                f = l.map(function (p) {
                  return ve(i, a, o, p.coordinate);
                });
              return S.createElement(
                eR,
                Jt({ className: "recharts-polar-angle-axis-line" }, s, { points: f }),
              );
            },
          },
          {
            key: "renderTicks",
            value: function () {
              var n = this,
                i = this.props,
                a = i.ticks,
                o = i.tick,
                u = i.tickLine,
                c = i.tickFormatter,
                s = i.stroke,
                l = V(this.props, !1),
                f = V(o, !1),
                p = Xt(Xt({}, l), {}, { fill: "none" }, V(u, !1)),
                d = a.map(function (y, v) {
                  var h = n.getTickLineCoord(y),
                    g = n.getTickTextAnchor(y),
                    x = Xt(
                      Xt(Xt({ textAnchor: g }, l), {}, { stroke: "none", fill: s }, f),
                      {},
                      { index: v, payload: y, x: h.x2, y: h.y2 },
                    );
                  return S.createElement(
                    ie,
                    Jt(
                      {
                        className: te("recharts-polar-angle-axis-tick", ww(o)),
                        key: "tick-".concat(y.coordinate),
                      },
                      cr(n.props, y, v),
                    ),
                    u &&
                      S.createElement(
                        "line",
                        Jt({ className: "recharts-polar-angle-axis-tick-line" }, p, h),
                      ),
                    o && t.renderTickItem(o, x, c ? c(y.value, v) : y.value),
                  );
                });
              return S.createElement(ie, { className: "recharts-polar-angle-axis-ticks" }, d);
            },
          },
          {
            key: "render",
            value: function () {
              var n = this.props,
                i = n.ticks,
                a = n.radius,
                o = n.axisLine;
              return a <= 0 || !i || !i.length
                ? null
                : S.createElement(
                    ie,
                    { className: te("recharts-polar-angle-axis", this.props.className) },
                    o && this.renderAxisLine(),
                    this.renderTicks(),
                  );
            },
          },
        ],
        [
          {
            key: "renderTickItem",
            value: function (n, i, a) {
              var o;
              return (
                S.isValidElement(n)
                  ? (o = S.cloneElement(n, i))
                  : Z(n)
                    ? (o = n(i))
                    : (o = S.createElement(
                        sr,
                        Jt({}, i, { className: "recharts-polar-angle-axis-tick-value" }),
                        a,
                      )),
                o
              );
            },
          },
        ],
      )
    );
  })(L.PureComponent);
ho(vo, "displayName", "PolarAngleAxis");
ho(vo, "axisType", "angleAxis");
ho(vo, "defaultProps", {
  type: "category",
  angleAxisId: 0,
  scale: "auto",
  cx: 0,
  cy: 0,
  orientation: "outer",
  axisLine: !0,
  tickLine: !0,
  tickSize: 8,
  tick: !0,
  hide: !1,
  allowDuplicatedCategory: !0,
});
var ul, Zg;
function RR() {
  if (Zg) return ul;
  Zg = 1;
  var e = K0(),
    t = e(Object.getPrototypeOf, Object);
  return ((ul = t), ul);
}
var cl, Jg;
function kR() {
  if (Jg) return cl;
  Jg = 1;
  var e = jt(),
    t = RR(),
    r = $t(),
    n = "[object Object]",
    i = Function.prototype,
    a = Object.prototype,
    o = i.toString,
    u = a.hasOwnProperty,
    c = o.call(Object);
  function s(l) {
    if (!r(l) || e(l) != n) return !1;
    var f = t(l);
    if (f === null) return !0;
    var p = u.call(f, "constructor") && f.constructor;
    return typeof p == "function" && p instanceof p && o.call(p) == c;
  }
  return ((cl = s), cl);
}
var DR = kR();
const NR = le(DR);
var sl, Qg;
function qR() {
  if (Qg) return sl;
  Qg = 1;
  var e = jt(),
    t = $t(),
    r = "[object Boolean]";
  function n(i) {
    return i === !0 || i === !1 || (t(i) && e(i) == r);
  }
  return ((sl = n), sl);
}
var LR = qR();
const BR = le(LR);
function ui(e) {
  "@babel/helpers - typeof";
  return (
    (ui =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    ui(e)
  );
}
function Sa() {
  return (
    (Sa = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Sa.apply(this, arguments)
  );
}
function FR(e, t) {
  return HR(e) || zR(e, t) || WR(e, t) || UR();
}
function UR() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function WR(e, t) {
  if (e) {
    if (typeof e == "string") return eb(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return eb(e, t);
  }
}
function eb(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function zR(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function HR(e) {
  if (Array.isArray(e)) return e;
}
function tb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function rb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? tb(Object(r), !0).forEach(function (n) {
          KR(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : tb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function KR(e, t, r) {
  return (
    (t = GR(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function GR(e) {
  var t = VR(e, "string");
  return ui(t) == "symbol" ? t : t + "";
}
function VR(e, t) {
  if (ui(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ui(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var nb = function (t, r, n, i, a) {
    var o = n - i,
      u;
    return (
      (u = "M ".concat(t, ",").concat(r)),
      (u += "L ".concat(t + n, ",").concat(r)),
      (u += "L ".concat(t + n - o / 2, ",").concat(r + a)),
      (u += "L ".concat(t + n - o / 2 - i, ",").concat(r + a)),
      (u += "L ".concat(t, ",").concat(r, " Z")),
      u
    );
  },
  XR = {
    x: 0,
    y: 0,
    upperWidth: 0,
    lowerWidth: 0,
    height: 0,
    isUpdateAnimationActive: !1,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: "ease",
  },
  YR = function (t) {
    var r = rb(rb({}, XR), t),
      n = L.useRef(),
      i = L.useState(-1),
      a = FR(i, 2),
      o = a[0],
      u = a[1];
    L.useEffect(function () {
      if (n.current && n.current.getTotalLength)
        try {
          var w = n.current.getTotalLength();
          w && u(w);
        } catch {}
    }, []);
    var c = r.x,
      s = r.y,
      l = r.upperWidth,
      f = r.lowerWidth,
      p = r.height,
      d = r.className,
      y = r.animationEasing,
      v = r.animationDuration,
      h = r.animationBegin,
      g = r.isUpdateAnimationActive;
    if (c !== +c || s !== +s || l !== +l || f !== +f || p !== +p || (l === 0 && f === 0) || p === 0)
      return null;
    var x = te("recharts-trapezoid", d);
    return g
      ? S.createElement(
          ct,
          {
            canBegin: o > 0,
            from: { upperWidth: 0, lowerWidth: 0, height: p, x: c, y: s },
            to: { upperWidth: l, lowerWidth: f, height: p, x: c, y: s },
            duration: v,
            animationEasing: y,
            isActive: g,
          },
          function (w) {
            var O = w.upperWidth,
              m = w.lowerWidth,
              b = w.height,
              _ = w.x,
              A = w.y;
            return S.createElement(
              ct,
              {
                canBegin: o > 0,
                from: "0px ".concat(o === -1 ? 1 : o, "px"),
                to: "".concat(o, "px 0px"),
                attributeName: "strokeDasharray",
                begin: h,
                duration: v,
                easing: y,
              },
              S.createElement(
                "path",
                Sa({}, V(r, !0), { className: x, d: nb(_, A, O, m, b), ref: n }),
              ),
            );
          },
        )
      : S.createElement(
          "g",
          null,
          S.createElement("path", Sa({}, V(r, !0), { className: x, d: nb(c, s, l, f, p) })),
        );
  },
  ZR = ["option", "shapeType", "propTransformer", "activeClassName", "isActive"];
function ci(e) {
  "@babel/helpers - typeof";
  return (
    (ci =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    ci(e)
  );
}
function JR(e, t) {
  if (e == null) return {};
  var r = QR(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function QR(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function ib(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Pa(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? ib(Object(r), !0).forEach(function (n) {
          ek(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : ib(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function ek(e, t, r) {
  return (
    (t = tk(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function tk(e) {
  var t = rk(e, "string");
  return ci(t) == "symbol" ? t : t + "";
}
function rk(e, t) {
  if (ci(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (ci(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function nk(e, t) {
  return Pa(Pa({}, t), e);
}
function ik(e, t) {
  return e === "symbols";
}
function ab(e) {
  var t = e.shapeType,
    r = e.elementProps;
  switch (t) {
    case "rectangle":
      return S.createElement(Vp, r);
    case "trapezoid":
      return S.createElement(YR, r);
    case "sector":
      return S.createElement(Aw, r);
    case "symbols":
      if (ik(t)) return S.createElement(pp, r);
      break;
    default:
      return null;
  }
}
function ak(e) {
  return L.isValidElement(e) ? e.props : e;
}
function Dw(e) {
  var t = e.option,
    r = e.shapeType,
    n = e.propTransformer,
    i = n === void 0 ? nk : n,
    a = e.activeClassName,
    o = a === void 0 ? "recharts-active-shape" : a,
    u = e.isActive,
    c = JR(e, ZR),
    s;
  if (L.isValidElement(t)) s = L.cloneElement(t, Pa(Pa({}, c), ak(t)));
  else if (Z(t)) s = t(c);
  else if (NR(t) && !BR(t)) {
    var l = i(t, c);
    s = S.createElement(ab, { shapeType: r, elementProps: l });
  } else {
    var f = c;
    s = S.createElement(ab, { shapeType: r, elementProps: f });
  }
  return u ? S.createElement(ie, { className: o }, s) : s;
}
function yo(e, t) {
  return t != null && "trapezoids" in e.props;
}
function mo(e, t) {
  return t != null && "sectors" in e.props;
}
function si(e, t) {
  return t != null && "points" in e.props;
}
function ok(e, t) {
  var r,
    n,
    i =
      e.x === (t == null || (r = t.labelViewBox) === null || r === void 0 ? void 0 : r.x) ||
      e.x === t.x,
    a =
      e.y === (t == null || (n = t.labelViewBox) === null || n === void 0 ? void 0 : n.y) ||
      e.y === t.y;
  return i && a;
}
function uk(e, t) {
  var r = e.endAngle === t.endAngle,
    n = e.startAngle === t.startAngle;
  return r && n;
}
function ck(e, t) {
  var r = e.x === t.x,
    n = e.y === t.y,
    i = e.z === t.z;
  return r && n && i;
}
function sk(e, t) {
  var r;
  return (yo(e, t) ? (r = ok) : mo(e, t) ? (r = uk) : si(e, t) && (r = ck), r);
}
function lk(e, t) {
  var r;
  return (
    yo(e, t) ? (r = "trapezoids") : mo(e, t) ? (r = "sectors") : si(e, t) && (r = "points"),
    r
  );
}
function fk(e, t) {
  if (yo(e, t)) {
    var r;
    return (r = t.tooltipPayload) === null ||
      r === void 0 ||
      (r = r[0]) === null ||
      r === void 0 ||
      (r = r.payload) === null ||
      r === void 0
      ? void 0
      : r.payload;
  }
  if (mo(e, t)) {
    var n;
    return (n = t.tooltipPayload) === null ||
      n === void 0 ||
      (n = n[0]) === null ||
      n === void 0 ||
      (n = n.payload) === null ||
      n === void 0
      ? void 0
      : n.payload;
  }
  return si(e, t) ? t.payload : {};
}
function pk(e) {
  var t = e.activeTooltipItem,
    r = e.graphicalItem,
    n = e.itemData,
    i = lk(r, t),
    a = fk(r, t),
    o = n.filter(function (c, s) {
      var l = lr(a, c),
        f = r.props[i].filter(function (y) {
          var v = sk(r, t);
          return v(y, t);
        }),
        p = r.props[i].indexOf(f[f.length - 1]),
        d = s === p;
      return l && d;
    }),
    u = n.indexOf(o[o.length - 1]);
  return u;
}
var Fi;
function Kr(e) {
  "@babel/helpers - typeof";
  return (
    (Kr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Kr(e)
  );
}
function Tr() {
  return (
    (Tr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Tr.apply(this, arguments)
  );
}
function ob(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function he(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? ob(Object(r), !0).forEach(function (n) {
          Qe(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : ob(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function hk(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function ub(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, qw(n.key), n));
  }
}
function dk(e, t, r) {
  return (
    t && ub(e.prototype, t),
    r && ub(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function vk(e, t, r) {
  return (
    (t = Ta(t)),
    yk(e, Nw() ? Reflect.construct(t, r || [], Ta(e).constructor) : t.apply(e, r))
  );
}
function yk(e, t) {
  if (t && (Kr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return mk(e);
}
function mk(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Nw() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (Nw = function () {
    return !!e;
  })();
}
function Ta(e) {
  return (
    (Ta = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Ta(e)
  );
}
function gk(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Mf(e, t));
}
function Mf(e, t) {
  return (
    (Mf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Mf(e, t)
  );
}
function Qe(e, t, r) {
  return (
    (t = qw(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function qw(e) {
  var t = bk(e, "string");
  return Kr(t) == "symbol" ? t : t + "";
}
function bk(e, t) {
  if (Kr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Kr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var zt = (function (e) {
  function t(r) {
    var n;
    return (
      hk(this, t),
      (n = vk(this, t, [r])),
      Qe(n, "pieRef", null),
      Qe(n, "sectorRefs", []),
      Qe(n, "id", vr("recharts-pie-")),
      Qe(n, "handleAnimationEnd", function () {
        var i = n.props.onAnimationEnd;
        (n.setState({ isAnimationFinished: !0 }), Z(i) && i());
      }),
      Qe(n, "handleAnimationStart", function () {
        var i = n.props.onAnimationStart;
        (n.setState({ isAnimationFinished: !1 }), Z(i) && i());
      }),
      (n.state = {
        isAnimationFinished: !r.isAnimationActive,
        prevIsAnimationActive: r.isAnimationActive,
        prevAnimationId: r.animationId,
        sectorToFocus: 0,
      }),
      n
    );
  }
  return (
    gk(t, e),
    dk(
      t,
      [
        {
          key: "isActiveIndex",
          value: function (n) {
            var i = this.props.activeIndex;
            return Array.isArray(i) ? i.indexOf(n) !== -1 : n === i;
          },
        },
        {
          key: "hasActiveIndex",
          value: function () {
            var n = this.props.activeIndex;
            return Array.isArray(n) ? n.length !== 0 : n || n === 0;
          },
        },
        {
          key: "renderLabels",
          value: function (n) {
            var i = this.props.isAnimationActive;
            if (i && !this.state.isAnimationFinished) return null;
            var a = this.props,
              o = a.label,
              u = a.labelLine,
              c = a.dataKey,
              s = a.valueKey,
              l = V(this.props, !1),
              f = V(o, !1),
              p = V(u, !1),
              d = (o && o.offsetRadius) || 20,
              y = n.map(function (v, h) {
                var g = (v.startAngle + v.endAngle) / 2,
                  x = ve(v.cx, v.cy, v.outerRadius + d, g),
                  w = he(
                    he(he(he({}, l), v), {}, { stroke: "none" }, f),
                    {},
                    { index: h, textAnchor: t.getTextAnchor(x.x, v.cx) },
                    x,
                  ),
                  O = he(
                    he(he(he({}, l), v), {}, { fill: "none", stroke: v.fill }, p),
                    {},
                    { index: h, points: [ve(v.cx, v.cy, v.outerRadius, g), x] },
                  ),
                  m = c;
                return (
                  J(c) && J(s) ? (m = "value") : J(c) && (m = s),
                  S.createElement(
                    ie,
                    {
                      key: "label-"
                        .concat(v.startAngle, "-")
                        .concat(v.endAngle, "-")
                        .concat(v.midAngle, "-")
                        .concat(h),
                    },
                    u && t.renderLabelLineItem(u, O, "line"),
                    t.renderLabelItem(o, w, we(v, m)),
                  )
                );
              });
            return S.createElement(ie, { className: "recharts-pie-labels" }, y);
          },
        },
        {
          key: "renderSectorsStatically",
          value: function (n) {
            var i = this,
              a = this.props,
              o = a.activeShape,
              u = a.blendStroke,
              c = a.inactiveShape;
            return n.map(function (s, l) {
              if (s?.startAngle === 0 && s?.endAngle === 0 && n.length !== 1) return null;
              var f = i.isActiveIndex(l),
                p = c && i.hasActiveIndex() ? c : null,
                d = f ? o : p,
                y = he(he({}, s), {}, { stroke: u ? s.fill : s.stroke, tabIndex: -1 });
              return S.createElement(
                ie,
                Tr(
                  {
                    ref: function (h) {
                      h && !i.sectorRefs.includes(h) && i.sectorRefs.push(h);
                    },
                    tabIndex: -1,
                    className: "recharts-pie-sector",
                  },
                  cr(i.props, s, l),
                  {
                    key: "sector-"
                      .concat(s?.startAngle, "-")
                      .concat(s?.endAngle, "-")
                      .concat(s.midAngle, "-")
                      .concat(l),
                  },
                ),
                S.createElement(Dw, Tr({ option: d, isActive: f, shapeType: "sector" }, y)),
              );
            });
          },
        },
        {
          key: "renderSectorsWithAnimation",
          value: function () {
            var n = this,
              i = this.props,
              a = i.sectors,
              o = i.isAnimationActive,
              u = i.animationBegin,
              c = i.animationDuration,
              s = i.animationEasing,
              l = i.animationId,
              f = this.state,
              p = f.prevSectors,
              d = f.prevIsAnimationActive;
            return S.createElement(
              ct,
              {
                begin: u,
                duration: c,
                isActive: o,
                easing: s,
                from: { t: 0 },
                to: { t: 1 },
                key: "pie-".concat(l, "-").concat(d),
                onAnimationStart: this.handleAnimationStart,
                onAnimationEnd: this.handleAnimationEnd,
              },
              function (y) {
                var v = y.t,
                  h = [],
                  g = a && a[0],
                  x = g.startAngle;
                return (
                  a.forEach(function (w, O) {
                    var m = p && p[O],
                      b = O > 0 ? Ve(w, "paddingAngle", 0) : 0;
                    if (m) {
                      var _ = Ee(m.endAngle - m.startAngle, w.endAngle - w.startAngle),
                        A = he(he({}, w), {}, { startAngle: x + b, endAngle: x + _(v) + b });
                      (h.push(A), (x = A.endAngle));
                    } else {
                      var T = w.endAngle,
                        $ = w.startAngle,
                        j = Ee(0, T - $),
                        E = j(v),
                        C = he(he({}, w), {}, { startAngle: x + b, endAngle: x + E + b });
                      (h.push(C), (x = C.endAngle));
                    }
                  }),
                  S.createElement(ie, null, n.renderSectorsStatically(h))
                );
              },
            );
          },
        },
        {
          key: "attachKeyboardHandlers",
          value: function (n) {
            var i = this;
            n.onkeydown = function (a) {
              if (!a.altKey)
                switch (a.key) {
                  case "ArrowLeft": {
                    var o = ++i.state.sectorToFocus % i.sectorRefs.length;
                    (i.sectorRefs[o].focus(), i.setState({ sectorToFocus: o }));
                    break;
                  }
                  case "ArrowRight": {
                    var u =
                      --i.state.sectorToFocus < 0
                        ? i.sectorRefs.length - 1
                        : i.state.sectorToFocus % i.sectorRefs.length;
                    (i.sectorRefs[u].focus(), i.setState({ sectorToFocus: u }));
                    break;
                  }
                  case "Escape": {
                    (i.sectorRefs[i.state.sectorToFocus].blur(), i.setState({ sectorToFocus: 0 }));
                    break;
                  }
                }
            };
          },
        },
        {
          key: "renderSectors",
          value: function () {
            var n = this.props,
              i = n.sectors,
              a = n.isAnimationActive,
              o = this.state.prevSectors;
            return a && i && i.length && (!o || !lr(o, i))
              ? this.renderSectorsWithAnimation()
              : this.renderSectorsStatically(i);
          },
        },
        {
          key: "componentDidMount",
          value: function () {
            this.pieRef && this.attachKeyboardHandlers(this.pieRef);
          },
        },
        {
          key: "render",
          value: function () {
            var n = this,
              i = this.props,
              a = i.hide,
              o = i.sectors,
              u = i.className,
              c = i.label,
              s = i.cx,
              l = i.cy,
              f = i.innerRadius,
              p = i.outerRadius,
              d = i.isAnimationActive,
              y = this.state.isAnimationFinished;
            if (a || !o || !o.length || !B(s) || !B(l) || !B(f) || !B(p)) return null;
            var v = te("recharts-pie", u);
            return S.createElement(
              ie,
              {
                tabIndex: this.props.rootTabIndex,
                className: v,
                ref: function (g) {
                  n.pieRef = g;
                },
              },
              this.renderSectors(),
              c && this.renderLabels(o),
              Ce.renderCallByParent(this.props, null, !1),
              (!d || y) && ht.renderCallByParent(this.props, o, !1),
            );
          },
        },
      ],
      [
        {
          key: "getDerivedStateFromProps",
          value: function (n, i) {
            return i.prevIsAnimationActive !== n.isAnimationActive
              ? {
                  prevIsAnimationActive: n.isAnimationActive,
                  prevAnimationId: n.animationId,
                  curSectors: n.sectors,
                  prevSectors: [],
                  isAnimationFinished: !0,
                }
              : n.isAnimationActive && n.animationId !== i.prevAnimationId
                ? {
                    prevAnimationId: n.animationId,
                    curSectors: n.sectors,
                    prevSectors: i.curSectors,
                    isAnimationFinished: !0,
                  }
                : n.sectors !== i.curSectors
                  ? { curSectors: n.sectors, isAnimationFinished: !0 }
                  : null;
          },
        },
        {
          key: "getTextAnchor",
          value: function (n, i) {
            return n > i ? "start" : n < i ? "end" : "middle";
          },
        },
        {
          key: "renderLabelLineItem",
          value: function (n, i, a) {
            if (S.isValidElement(n)) return S.cloneElement(n, i);
            if (Z(n)) return n(i);
            var o = te("recharts-pie-label-line", typeof n != "boolean" ? n.className : "");
            return S.createElement(or, Tr({}, i, { key: a, type: "linear", className: o }));
          },
        },
        {
          key: "renderLabelItem",
          value: function (n, i, a) {
            if (S.isValidElement(n)) return S.cloneElement(n, i);
            var o = a;
            if (Z(n) && ((o = n(i)), S.isValidElement(o))) return o;
            var u = te(
              "recharts-pie-label-text",
              typeof n != "boolean" && !Z(n) ? n.className : "",
            );
            return S.createElement(sr, Tr({}, i, { alignmentBaseline: "middle", className: u }), o);
          },
        },
      ],
    )
  );
})(L.PureComponent);
Fi = zt;
Qe(zt, "displayName", "Pie");
Qe(zt, "defaultProps", {
  stroke: "#fff",
  fill: "#808080",
  legendType: "rect",
  cx: "50%",
  cy: "50%",
  startAngle: 0,
  endAngle: 360,
  innerRadius: 0,
  outerRadius: "80%",
  paddingAngle: 0,
  labelLine: !0,
  hide: !1,
  minAngle: 0,
  isAnimationActive: !Bt.isSsr,
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: "ease",
  nameKey: "name",
  blendStroke: !1,
  rootTabIndex: 0,
});
Qe(zt, "parseDeltaAngle", function (e, t) {
  var r = qe(t - e),
    n = Math.min(Math.abs(t - e), 360);
  return r * n;
});
Qe(zt, "getRealPieData", function (e) {
  var t = e.data,
    r = e.children,
    n = V(e, !1),
    i = Xe(r, Op);
  return t && t.length
    ? t.map(function (a, o) {
        return he(he(he({ payload: a }, n), a), i && i[o] && i[o].props);
      })
    : i && i.length
      ? i.map(function (a) {
          return he(he({}, n), a.props);
        })
      : [];
});
Qe(zt, "parseCoordinateOfPie", function (e, t) {
  var r = t.top,
    n = t.left,
    i = t.width,
    a = t.height,
    o = xw(i, a),
    u = n + Le(e.cx, i, i / 2),
    c = r + Le(e.cy, a, a / 2),
    s = Le(e.innerRadius, o, 0),
    l = Le(e.outerRadius, o, o * 0.8),
    f = e.maxRadius || Math.sqrt(i * i + a * a) / 2;
  return { cx: u, cy: c, innerRadius: s, outerRadius: l, maxRadius: f };
});
Qe(zt, "getComposedData", function (e) {
  var t = e.item,
    r = e.offset,
    n = t.type.defaultProps !== void 0 ? he(he({}, t.type.defaultProps), t.props) : t.props,
    i = Fi.getRealPieData(n);
  if (!i || !i.length) return null;
  var a = n.cornerRadius,
    o = n.startAngle,
    u = n.endAngle,
    c = n.paddingAngle,
    s = n.dataKey,
    l = n.nameKey,
    f = n.valueKey,
    p = n.tooltipType,
    d = Math.abs(n.minAngle),
    y = Fi.parseCoordinateOfPie(n, r),
    v = Fi.parseDeltaAngle(o, u),
    h = Math.abs(v),
    g = s;
  J(s) && J(f)
    ? (ut(
        !1,
        `Use "dataKey" to specify the value of pie,
      the props "valueKey" will be deprecated in 1.1.0`,
      ),
      (g = "value"))
    : J(s) &&
      (ut(
        !1,
        `Use "dataKey" to specify the value of pie,
      the props "valueKey" will be deprecated in 1.1.0`,
      ),
      (g = f));
  var x = i.filter(function (A) {
      return we(A, g, 0) !== 0;
    }).length,
    w = (h >= 360 ? x : x - 1) * c,
    O = h - x * d - w,
    m = i.reduce(function (A, T) {
      var $ = we(T, g, 0);
      return A + (B($) ? $ : 0);
    }, 0),
    b;
  if (m > 0) {
    var _;
    b = i.map(function (A, T) {
      var $ = we(A, g, 0),
        j = we(A, l, T),
        E = (B($) ? $ : 0) / m,
        C;
      T ? (C = _.endAngle + qe(v) * c * ($ !== 0 ? 1 : 0)) : (C = o);
      var I = C + qe(v) * (($ !== 0 ? d : 0) + E * O),
        R = (C + I) / 2,
        k = (y.innerRadius + y.outerRadius) / 2,
        N = [{ name: j, value: $, payload: A, dataKey: g, type: p }],
        W = ve(y.cx, y.cy, k, R);
      return (
        (_ = he(
          he(
            he(
              {
                percent: E,
                cornerRadius: a,
                name: j,
                tooltipPayload: N,
                midAngle: R,
                middleRadius: k,
                tooltipPosition: W,
              },
              A,
            ),
            y,
          ),
          {},
          { value: we(A, g), startAngle: C, endAngle: I, payload: A, paddingAngle: qe(v) * c },
        )),
        _
      );
    });
  }
  return he(he({}, y), {}, { sectors: b, data: i });
});
var ll, cb;
function xk() {
  if (cb) return ll;
  cb = 1;
  var e = Math.ceil,
    t = Math.max;
  function r(n, i, a, o) {
    for (var u = -1, c = t(e((i - n) / (a || 1)), 0), s = Array(c); c--; )
      ((s[o ? c : ++u] = n), (n += a));
    return s;
  }
  return ((ll = r), ll);
}
var fl, sb;
function Lw() {
  if (sb) return fl;
  sb = 1;
  var e = cx(),
    t = 1 / 0,
    r = 17976931348623157e292;
  function n(i) {
    if (!i) return i === 0 ? i : 0;
    if (((i = e(i)), i === t || i === -t)) {
      var a = i < 0 ? -1 : 1;
      return a * r;
    }
    return i === i ? i : 0;
  }
  return ((fl = n), fl);
}
var pl, lb;
function wk() {
  if (lb) return pl;
  lb = 1;
  var e = xk(),
    t = eo(),
    r = Lw();
  function n(i) {
    return function (a, o, u) {
      return (
        u && typeof u != "number" && t(a, o, u) && (o = u = void 0),
        (a = r(a)),
        o === void 0 ? ((o = a), (a = 0)) : (o = r(o)),
        (u = u === void 0 ? (a < o ? 1 : -1) : r(u)),
        e(a, o, u, i)
      );
    };
  }
  return ((pl = n), pl);
}
var hl, fb;
function Ok() {
  if (fb) return hl;
  fb = 1;
  var e = wk(),
    t = e();
  return ((hl = t), hl);
}
var _k = Ok();
const Ea = le(_k);
function li(e) {
  "@babel/helpers - typeof";
  return (
    (li =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    li(e)
  );
}
function pb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function hb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? pb(Object(r), !0).forEach(function (n) {
          Bw(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : pb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Bw(e, t, r) {
  return (
    (t = Ak(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Ak(e) {
  var t = Sk(e, "string");
  return li(t) == "symbol" ? t : t + "";
}
function Sk(e, t) {
  if (li(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (li(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Pk = ["Webkit", "Moz", "O", "ms"],
  Tk = function (t, r) {
    var n = t.replace(/(\w)/, function (a) {
        return a.toUpperCase();
      }),
      i = Pk.reduce(function (a, o) {
        return hb(hb({}, a), {}, Bw({}, o + n, r));
      }, {});
    return ((i[t] = r), i);
  };
function Gr(e) {
  "@babel/helpers - typeof";
  return (
    (Gr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Gr(e)
  );
}
function ja() {
  return (
    (ja = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    ja.apply(this, arguments)
  );
}
function db(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function dl(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? db(Object(r), !0).forEach(function (n) {
          He(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : db(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Ek(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function vb(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, Uw(n.key), n));
  }
}
function jk(e, t, r) {
  return (
    t && vb(e.prototype, t),
    r && vb(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function $k(e, t, r) {
  return (
    (t = $a(t)),
    Mk(e, Fw() ? Reflect.construct(t, r || [], $a(e).constructor) : t.apply(e, r))
  );
}
function Mk(e, t) {
  if (t && (Gr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return Ck(e);
}
function Ck(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Fw() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (Fw = function () {
    return !!e;
  })();
}
function $a(e) {
  return (
    ($a = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    $a(e)
  );
}
function Ik(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Cf(e, t));
}
function Cf(e, t) {
  return (
    (Cf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Cf(e, t)
  );
}
function He(e, t, r) {
  return (
    (t = Uw(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Uw(e) {
  var t = Rk(e, "string");
  return Gr(t) == "symbol" ? t : t + "";
}
function Rk(e, t) {
  if (Gr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Gr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var kk = function (t) {
    var r = t.data,
      n = t.startIndex,
      i = t.endIndex,
      a = t.x,
      o = t.width,
      u = t.travellerWidth;
    if (!r || !r.length) return {};
    var c = r.length,
      s = jn()
        .domain(Ea(0, c))
        .range([a, a + o - u]),
      l = s.domain().map(function (f) {
        return s(f);
      });
    return {
      isTextActive: !1,
      isSlideMoving: !1,
      isTravellerMoving: !1,
      isTravellerFocused: !1,
      startX: s(n),
      endX: s(i),
      scale: s,
      scaleValues: l,
    };
  },
  yb = function (t) {
    return t.changedTouches && !!t.changedTouches.length;
  },
  Vr = (function (e) {
    function t(r) {
      var n;
      return (
        Ek(this, t),
        (n = $k(this, t, [r])),
        He(n, "handleDrag", function (i) {
          (n.leaveTimer && (clearTimeout(n.leaveTimer), (n.leaveTimer = null)),
            n.state.isTravellerMoving
              ? n.handleTravellerMove(i)
              : n.state.isSlideMoving && n.handleSlideDrag(i));
        }),
        He(n, "handleTouchMove", function (i) {
          i.changedTouches != null &&
            i.changedTouches.length > 0 &&
            n.handleDrag(i.changedTouches[0]);
        }),
        He(n, "handleDragEnd", function () {
          (n.setState({ isTravellerMoving: !1, isSlideMoving: !1 }, function () {
            var i = n.props,
              a = i.endIndex,
              o = i.onDragEnd,
              u = i.startIndex;
            o?.({ endIndex: a, startIndex: u });
          }),
            n.detachDragEndListener());
        }),
        He(n, "handleLeaveWrapper", function () {
          (n.state.isTravellerMoving || n.state.isSlideMoving) &&
            (n.leaveTimer = window.setTimeout(n.handleDragEnd, n.props.leaveTimeOut));
        }),
        He(n, "handleEnterSlideOrTraveller", function () {
          n.setState({ isTextActive: !0 });
        }),
        He(n, "handleLeaveSlideOrTraveller", function () {
          n.setState({ isTextActive: !1 });
        }),
        He(n, "handleSlideDragStart", function (i) {
          var a = yb(i) ? i.changedTouches[0] : i;
          (n.setState({ isTravellerMoving: !1, isSlideMoving: !0, slideMoveStartX: a.pageX }),
            n.attachDragEndListener());
        }),
        (n.travellerDragStartHandlers = {
          startX: n.handleTravellerDragStart.bind(n, "startX"),
          endX: n.handleTravellerDragStart.bind(n, "endX"),
        }),
        (n.state = {}),
        n
      );
    }
    return (
      Ik(t, e),
      jk(
        t,
        [
          {
            key: "componentWillUnmount",
            value: function () {
              (this.leaveTimer && (clearTimeout(this.leaveTimer), (this.leaveTimer = null)),
                this.detachDragEndListener());
            },
          },
          {
            key: "getIndex",
            value: function (n) {
              var i = n.startX,
                a = n.endX,
                o = this.state.scaleValues,
                u = this.props,
                c = u.gap,
                s = u.data,
                l = s.length - 1,
                f = Math.min(i, a),
                p = Math.max(i, a),
                d = t.getIndexInRange(o, f),
                y = t.getIndexInRange(o, p);
              return { startIndex: d - (d % c), endIndex: y === l ? l : y - (y % c) };
            },
          },
          {
            key: "getTextOfTick",
            value: function (n) {
              var i = this.props,
                a = i.data,
                o = i.tickFormatter,
                u = i.dataKey,
                c = we(a[n], u, n);
              return Z(o) ? o(c, n) : c;
            },
          },
          {
            key: "attachDragEndListener",
            value: function () {
              (window.addEventListener("mouseup", this.handleDragEnd, !0),
                window.addEventListener("touchend", this.handleDragEnd, !0),
                window.addEventListener("mousemove", this.handleDrag, !0));
            },
          },
          {
            key: "detachDragEndListener",
            value: function () {
              (window.removeEventListener("mouseup", this.handleDragEnd, !0),
                window.removeEventListener("touchend", this.handleDragEnd, !0),
                window.removeEventListener("mousemove", this.handleDrag, !0));
            },
          },
          {
            key: "handleSlideDrag",
            value: function (n) {
              var i = this.state,
                a = i.slideMoveStartX,
                o = i.startX,
                u = i.endX,
                c = this.props,
                s = c.x,
                l = c.width,
                f = c.travellerWidth,
                p = c.startIndex,
                d = c.endIndex,
                y = c.onChange,
                v = n.pageX - a;
              v > 0
                ? (v = Math.min(v, s + l - f - u, s + l - f - o))
                : v < 0 && (v = Math.max(v, s - o, s - u));
              var h = this.getIndex({ startX: o + v, endX: u + v });
              ((h.startIndex !== p || h.endIndex !== d) && y && y(h),
                this.setState({ startX: o + v, endX: u + v, slideMoveStartX: n.pageX }));
            },
          },
          {
            key: "handleTravellerDragStart",
            value: function (n, i) {
              var a = yb(i) ? i.changedTouches[0] : i;
              (this.setState({
                isSlideMoving: !1,
                isTravellerMoving: !0,
                movingTravellerId: n,
                brushMoveStartX: a.pageX,
              }),
                this.attachDragEndListener());
            },
          },
          {
            key: "handleTravellerMove",
            value: function (n) {
              var i = this.state,
                a = i.brushMoveStartX,
                o = i.movingTravellerId,
                u = i.endX,
                c = i.startX,
                s = this.state[o],
                l = this.props,
                f = l.x,
                p = l.width,
                d = l.travellerWidth,
                y = l.onChange,
                v = l.gap,
                h = l.data,
                g = { startX: this.state.startX, endX: this.state.endX },
                x = n.pageX - a;
              (x > 0 ? (x = Math.min(x, f + p - d - s)) : x < 0 && (x = Math.max(x, f - s)),
                (g[o] = s + x));
              var w = this.getIndex(g),
                O = w.startIndex,
                m = w.endIndex,
                b = function () {
                  var A = h.length - 1;
                  return (
                    (o === "startX" && (u > c ? O % v === 0 : m % v === 0)) ||
                    (u < c && m === A) ||
                    (o === "endX" && (u > c ? m % v === 0 : O % v === 0)) ||
                    (u > c && m === A)
                  );
                };
              this.setState(He(He({}, o, s + x), "brushMoveStartX", n.pageX), function () {
                y && b() && y(w);
              });
            },
          },
          {
            key: "handleTravellerMoveKeyboard",
            value: function (n, i) {
              var a = this,
                o = this.state,
                u = o.scaleValues,
                c = o.startX,
                s = o.endX,
                l = this.state[i],
                f = u.indexOf(l);
              if (f !== -1) {
                var p = f + n;
                if (!(p === -1 || p >= u.length)) {
                  var d = u[p];
                  (i === "startX" && d >= s) ||
                    (i === "endX" && d <= c) ||
                    this.setState(He({}, i, d), function () {
                      a.props.onChange(a.getIndex({ startX: a.state.startX, endX: a.state.endX }));
                    });
                }
              }
            },
          },
          {
            key: "renderBackground",
            value: function () {
              var n = this.props,
                i = n.x,
                a = n.y,
                o = n.width,
                u = n.height,
                c = n.fill,
                s = n.stroke;
              return S.createElement("rect", {
                stroke: s,
                fill: c,
                x: i,
                y: a,
                width: o,
                height: u,
              });
            },
          },
          {
            key: "renderPanorama",
            value: function () {
              var n = this.props,
                i = n.x,
                a = n.y,
                o = n.width,
                u = n.height,
                c = n.data,
                s = n.children,
                l = n.padding,
                f = L.Children.only(s);
              return f
                ? S.cloneElement(f, {
                    x: i,
                    y: a,
                    width: o,
                    height: u,
                    margin: l,
                    compact: !0,
                    data: c,
                  })
                : null;
            },
          },
          {
            key: "renderTravellerLayer",
            value: function (n, i) {
              var a,
                o,
                u = this,
                c = this.props,
                s = c.y,
                l = c.travellerWidth,
                f = c.height,
                p = c.traveller,
                d = c.ariaLabel,
                y = c.data,
                v = c.startIndex,
                h = c.endIndex,
                g = Math.max(n, this.props.x),
                x = dl(dl({}, V(this.props, !1)), {}, { x: g, y: s, width: l, height: f }),
                w =
                  d ||
                  "Min value: "
                    .concat((a = y[v]) === null || a === void 0 ? void 0 : a.name, ", Max value: ")
                    .concat((o = y[h]) === null || o === void 0 ? void 0 : o.name);
              return S.createElement(
                ie,
                {
                  tabIndex: 0,
                  role: "slider",
                  "aria-label": w,
                  "aria-valuenow": n,
                  className: "recharts-brush-traveller",
                  onMouseEnter: this.handleEnterSlideOrTraveller,
                  onMouseLeave: this.handleLeaveSlideOrTraveller,
                  onMouseDown: this.travellerDragStartHandlers[i],
                  onTouchStart: this.travellerDragStartHandlers[i],
                  onKeyDown: function (m) {
                    ["ArrowLeft", "ArrowRight"].includes(m.key) &&
                      (m.preventDefault(),
                      m.stopPropagation(),
                      u.handleTravellerMoveKeyboard(m.key === "ArrowRight" ? 1 : -1, i));
                  },
                  onFocus: function () {
                    u.setState({ isTravellerFocused: !0 });
                  },
                  onBlur: function () {
                    u.setState({ isTravellerFocused: !1 });
                  },
                  style: { cursor: "col-resize" },
                },
                t.renderTraveller(p, x),
              );
            },
          },
          {
            key: "renderSlide",
            value: function (n, i) {
              var a = this.props,
                o = a.y,
                u = a.height,
                c = a.stroke,
                s = a.travellerWidth,
                l = Math.min(n, i) + s,
                f = Math.max(Math.abs(i - n) - s, 0);
              return S.createElement("rect", {
                className: "recharts-brush-slide",
                onMouseEnter: this.handleEnterSlideOrTraveller,
                onMouseLeave: this.handleLeaveSlideOrTraveller,
                onMouseDown: this.handleSlideDragStart,
                onTouchStart: this.handleSlideDragStart,
                style: { cursor: "move" },
                stroke: "none",
                fill: c,
                fillOpacity: 0.2,
                x: l,
                y: o,
                width: f,
                height: u,
              });
            },
          },
          {
            key: "renderText",
            value: function () {
              var n = this.props,
                i = n.startIndex,
                a = n.endIndex,
                o = n.y,
                u = n.height,
                c = n.travellerWidth,
                s = n.stroke,
                l = this.state,
                f = l.startX,
                p = l.endX,
                d = 5,
                y = { pointerEvents: "none", fill: s };
              return S.createElement(
                ie,
                { className: "recharts-brush-texts" },
                S.createElement(
                  sr,
                  ja(
                    {
                      textAnchor: "end",
                      verticalAnchor: "middle",
                      x: Math.min(f, p) - d,
                      y: o + u / 2,
                    },
                    y,
                  ),
                  this.getTextOfTick(i),
                ),
                S.createElement(
                  sr,
                  ja(
                    {
                      textAnchor: "start",
                      verticalAnchor: "middle",
                      x: Math.max(f, p) + c + d,
                      y: o + u / 2,
                    },
                    y,
                  ),
                  this.getTextOfTick(a),
                ),
              );
            },
          },
          {
            key: "render",
            value: function () {
              var n = this.props,
                i = n.data,
                a = n.className,
                o = n.children,
                u = n.x,
                c = n.y,
                s = n.width,
                l = n.height,
                f = n.alwaysShowText,
                p = this.state,
                d = p.startX,
                y = p.endX,
                v = p.isTextActive,
                h = p.isSlideMoving,
                g = p.isTravellerMoving,
                x = p.isTravellerFocused;
              if (!i || !i.length || !B(u) || !B(c) || !B(s) || !B(l) || s <= 0 || l <= 0)
                return null;
              var w = te("recharts-brush", a),
                O = S.Children.count(o) === 1,
                m = Tk("userSelect", "none");
              return S.createElement(
                ie,
                {
                  className: w,
                  onMouseLeave: this.handleLeaveWrapper,
                  onTouchMove: this.handleTouchMove,
                  style: m,
                },
                this.renderBackground(),
                O && this.renderPanorama(),
                this.renderSlide(d, y),
                this.renderTravellerLayer(d, "startX"),
                this.renderTravellerLayer(y, "endX"),
                (v || h || g || x || f) && this.renderText(),
              );
            },
          },
        ],
        [
          {
            key: "renderDefaultTraveller",
            value: function (n) {
              var i = n.x,
                a = n.y,
                o = n.width,
                u = n.height,
                c = n.stroke,
                s = Math.floor(a + u / 2) - 1;
              return S.createElement(
                S.Fragment,
                null,
                S.createElement("rect", {
                  x: i,
                  y: a,
                  width: o,
                  height: u,
                  fill: c,
                  stroke: "none",
                }),
                S.createElement("line", {
                  x1: i + 1,
                  y1: s,
                  x2: i + o - 1,
                  y2: s,
                  fill: "none",
                  stroke: "#fff",
                }),
                S.createElement("line", {
                  x1: i + 1,
                  y1: s + 2,
                  x2: i + o - 1,
                  y2: s + 2,
                  fill: "none",
                  stroke: "#fff",
                }),
              );
            },
          },
          {
            key: "renderTraveller",
            value: function (n, i) {
              var a;
              return (
                S.isValidElement(n)
                  ? (a = S.cloneElement(n, i))
                  : Z(n)
                    ? (a = n(i))
                    : (a = t.renderDefaultTraveller(i)),
                a
              );
            },
          },
          {
            key: "getDerivedStateFromProps",
            value: function (n, i) {
              var a = n.data,
                o = n.width,
                u = n.x,
                c = n.travellerWidth,
                s = n.updateId,
                l = n.startIndex,
                f = n.endIndex;
              if (a !== i.prevData || s !== i.prevUpdateId)
                return dl(
                  { prevData: a, prevTravellerWidth: c, prevUpdateId: s, prevX: u, prevWidth: o },
                  a && a.length
                    ? kk({ data: a, width: o, x: u, travellerWidth: c, startIndex: l, endIndex: f })
                    : { scale: null, scaleValues: null },
                );
              if (i.scale && (o !== i.prevWidth || u !== i.prevX || c !== i.prevTravellerWidth)) {
                i.scale.range([u, u + o - c]);
                var p = i.scale.domain().map(function (d) {
                  return i.scale(d);
                });
                return {
                  prevData: a,
                  prevTravellerWidth: c,
                  prevUpdateId: s,
                  prevX: u,
                  prevWidth: o,
                  startX: i.scale(n.startIndex),
                  endX: i.scale(n.endIndex),
                  scaleValues: p,
                };
              }
              return null;
            },
          },
          {
            key: "getIndexInRange",
            value: function (n, i) {
              for (var a = n.length, o = 0, u = a - 1; u - o > 1; ) {
                var c = Math.floor((o + u) / 2);
                n[c] > i ? (u = c) : (o = c);
              }
              return i >= n[u] ? u : o;
            },
          },
        ],
      )
    );
  })(L.PureComponent);
He(Vr, "displayName", "Brush");
He(Vr, "defaultProps", {
  height: 40,
  travellerWidth: 5,
  gap: 1,
  fill: "#fff",
  stroke: "#666",
  padding: { top: 1, right: 1, bottom: 1, left: 1 },
  leaveTimeOut: 1e3,
  alwaysShowText: !1,
});
var vl, mb;
function Dk() {
  if (mb) return vl;
  mb = 1;
  var e = bp();
  function t(r, n) {
    var i;
    return (
      e(r, function (a, o, u) {
        return ((i = n(a, o, u)), !i);
      }),
      !!i
    );
  }
  return ((vl = t), vl);
}
var yl, gb;
function Nk() {
  if (gb) return yl;
  gb = 1;
  var e = L0(),
    t = mt(),
    r = Dk(),
    n = We(),
    i = eo();
  function a(o, u, c) {
    var s = n(o) ? e : r;
    return (c && i(o, u, c) && (u = void 0), s(o, t(u, 3)));
  }
  return ((yl = a), yl);
}
var qk = Nk();
const Lk = le(qk);
var dt = function (t, r) {
    var n = t.alwaysShow,
      i = t.ifOverflow;
    return (n && (i = "extendDomain"), i === r);
  },
  ml,
  bb;
function Bk() {
  if (bb) return ml;
  bb = 1;
  var e = nx();
  function t(r, n, i) {
    n == "__proto__" && e
      ? e(r, n, { configurable: !0, enumerable: !0, value: i, writable: !0 })
      : (r[n] = i);
  }
  return ((ml = t), ml);
}
var gl, xb;
function Fk() {
  if (xb) return gl;
  xb = 1;
  var e = Bk(),
    t = tx(),
    r = mt();
  function n(i, a) {
    var o = {};
    return (
      (a = r(a, 3)),
      t(i, function (u, c, s) {
        e(o, c, a(u, c, s));
      }),
      o
    );
  }
  return ((gl = n), gl);
}
var Uk = Fk();
const Wk = le(Uk);
var bl, wb;
function zk() {
  if (wb) return bl;
  wb = 1;
  function e(t, r) {
    for (var n = -1, i = t == null ? 0 : t.length; ++n < i; ) if (!r(t[n], n, t)) return !1;
    return !0;
  }
  return ((bl = e), bl);
}
var xl, Ob;
function Hk() {
  if (Ob) return xl;
  Ob = 1;
  var e = bp();
  function t(r, n) {
    var i = !0;
    return (
      e(r, function (a, o, u) {
        return ((i = !!n(a, o, u)), i);
      }),
      i
    );
  }
  return ((xl = t), xl);
}
var wl, _b;
function Kk() {
  if (_b) return wl;
  _b = 1;
  var e = zk(),
    t = Hk(),
    r = mt(),
    n = We(),
    i = eo();
  function a(o, u, c) {
    var s = n(o) ? e : t;
    return (c && i(o, u, c) && (u = void 0), s(o, r(u, 3)));
  }
  return ((wl = a), wl);
}
var Gk = Kk();
const Ww = le(Gk);
var Vk = ["x", "y"];
function fi(e) {
  "@babel/helpers - typeof";
  return (
    (fi =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    fi(e)
  );
}
function If() {
  return (
    (If = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    If.apply(this, arguments)
  );
}
function Ab(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function An(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ab(Object(r), !0).forEach(function (n) {
          Xk(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ab(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Xk(e, t, r) {
  return (
    (t = Yk(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Yk(e) {
  var t = Zk(e, "string");
  return fi(t) == "symbol" ? t : t + "";
}
function Zk(e, t) {
  if (fi(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (fi(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Jk(e, t) {
  if (e == null) return {};
  var r = Qk(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function Qk(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function eD(e, t) {
  var r = e.x,
    n = e.y,
    i = Jk(e, Vk),
    a = "".concat(r),
    o = parseInt(a, 10),
    u = "".concat(n),
    c = parseInt(u, 10),
    s = "".concat(t.height || i.height),
    l = parseInt(s, 10),
    f = "".concat(t.width || i.width),
    p = parseInt(f, 10);
  return An(
    An(An(An(An({}, t), i), o ? { x: o } : {}), c ? { y: c } : {}),
    {},
    { height: l, width: p, name: t.name, radius: t.radius },
  );
}
function Sb(e) {
  return S.createElement(
    Dw,
    If({ shapeType: "rectangle", propTransformer: eD, activeClassName: "recharts-active-bar" }, e),
  );
}
var tD = function (t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    return function (n, i) {
      if (typeof t == "number") return t;
      var a = B(n) || O_(n);
      return a ? t(n, i) : (a || pr(), r);
    };
  },
  rD = ["value", "background"],
  zw;
function Xr(e) {
  "@babel/helpers - typeof";
  return (
    (Xr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Xr(e)
  );
}
function nD(e, t) {
  if (e == null) return {};
  var r = iD(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function iD(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Ma() {
  return (
    (Ma = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Ma.apply(this, arguments)
  );
}
function Pb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Oe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Pb(Object(r), !0).forEach(function (n) {
          Nt(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Pb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function aD(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Tb(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, Kw(n.key), n));
  }
}
function oD(e, t, r) {
  return (
    t && Tb(e.prototype, t),
    r && Tb(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function uD(e, t, r) {
  return (
    (t = Ca(t)),
    cD(e, Hw() ? Reflect.construct(t, r || [], Ca(e).constructor) : t.apply(e, r))
  );
}
function cD(e, t) {
  if (t && (Xr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return sD(e);
}
function sD(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function Hw() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (Hw = function () {
    return !!e;
  })();
}
function Ca(e) {
  return (
    (Ca = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Ca(e)
  );
}
function lD(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Rf(e, t));
}
function Rf(e, t) {
  return (
    (Rf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Rf(e, t)
  );
}
function Nt(e, t, r) {
  return (
    (t = Kw(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Kw(e) {
  var t = fD(e, "string");
  return Xr(t) == "symbol" ? t : t + "";
}
function fD(e, t) {
  if (Xr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Xr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var dn = (function (e) {
  function t() {
    var r;
    aD(this, t);
    for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++) i[a] = arguments[a];
    return (
      (r = uD(this, t, [].concat(i))),
      Nt(r, "state", { isAnimationFinished: !1 }),
      Nt(r, "id", vr("recharts-bar-")),
      Nt(r, "handleAnimationEnd", function () {
        var o = r.props.onAnimationEnd;
        (r.setState({ isAnimationFinished: !0 }), o && o());
      }),
      Nt(r, "handleAnimationStart", function () {
        var o = r.props.onAnimationStart;
        (r.setState({ isAnimationFinished: !1 }), o && o());
      }),
      r
    );
  }
  return (
    lD(t, e),
    oD(
      t,
      [
        {
          key: "renderRectanglesStatically",
          value: function (n) {
            var i = this,
              a = this.props,
              o = a.shape,
              u = a.dataKey,
              c = a.activeIndex,
              s = a.activeBar,
              l = V(this.props, !1);
            return (
              n &&
              n.map(function (f, p) {
                var d = p === c,
                  y = d ? s : o,
                  v = Oe(
                    Oe(Oe({}, l), f),
                    {},
                    {
                      isActive: d,
                      option: y,
                      index: p,
                      dataKey: u,
                      onAnimationStart: i.handleAnimationStart,
                      onAnimationEnd: i.handleAnimationEnd,
                    },
                  );
                return S.createElement(
                  ie,
                  Ma({ className: "recharts-bar-rectangle" }, cr(i.props, f, p), {
                    key: "rectangle-"
                      .concat(f?.x, "-")
                      .concat(f?.y, "-")
                      .concat(f?.value, "-")
                      .concat(p),
                  }),
                  S.createElement(Sb, v),
                );
              })
            );
          },
        },
        {
          key: "renderRectanglesWithAnimation",
          value: function () {
            var n = this,
              i = this.props,
              a = i.data,
              o = i.layout,
              u = i.isAnimationActive,
              c = i.animationBegin,
              s = i.animationDuration,
              l = i.animationEasing,
              f = i.animationId,
              p = this.state.prevData;
            return S.createElement(
              ct,
              {
                begin: c,
                duration: s,
                isActive: u,
                easing: l,
                from: { t: 0 },
                to: { t: 1 },
                key: "bar-".concat(f),
                onAnimationEnd: this.handleAnimationEnd,
                onAnimationStart: this.handleAnimationStart,
              },
              function (d) {
                var y = d.t,
                  v = a.map(function (h, g) {
                    var x = p && p[g];
                    if (x) {
                      var w = Ee(x.x, h.x),
                        O = Ee(x.y, h.y),
                        m = Ee(x.width, h.width),
                        b = Ee(x.height, h.height);
                      return Oe(Oe({}, h), {}, { x: w(y), y: O(y), width: m(y), height: b(y) });
                    }
                    if (o === "horizontal") {
                      var _ = Ee(0, h.height),
                        A = _(y);
                      return Oe(Oe({}, h), {}, { y: h.y + h.height - A, height: A });
                    }
                    var T = Ee(0, h.width),
                      $ = T(y);
                    return Oe(Oe({}, h), {}, { width: $ });
                  });
                return S.createElement(ie, null, n.renderRectanglesStatically(v));
              },
            );
          },
        },
        {
          key: "renderRectangles",
          value: function () {
            var n = this.props,
              i = n.data,
              a = n.isAnimationActive,
              o = this.state.prevData;
            return a && i && i.length && (!o || !lr(o, i))
              ? this.renderRectanglesWithAnimation()
              : this.renderRectanglesStatically(i);
          },
        },
        {
          key: "renderBackground",
          value: function () {
            var n = this,
              i = this.props,
              a = i.data,
              o = i.dataKey,
              u = i.activeIndex,
              c = V(this.props.background, !1);
            return a.map(function (s, l) {
              s.value;
              var f = s.background,
                p = nD(s, rD);
              if (!f) return null;
              var d = Oe(
                Oe(Oe(Oe(Oe({}, p), {}, { fill: "#eee" }, f), c), cr(n.props, s, l)),
                {},
                {
                  onAnimationStart: n.handleAnimationStart,
                  onAnimationEnd: n.handleAnimationEnd,
                  dataKey: o,
                  index: l,
                  className: "recharts-bar-background-rectangle",
                },
              );
              return S.createElement(
                Sb,
                Ma(
                  {
                    key: "background-bar-".concat(l),
                    option: n.props.background,
                    isActive: l === u,
                  },
                  d,
                ),
              );
            });
          },
        },
        {
          key: "renderErrorBar",
          value: function (n, i) {
            if (this.props.isAnimationActive && !this.state.isAnimationFinished) return null;
            var a = this.props,
              o = a.data,
              u = a.xAxis,
              c = a.yAxis,
              s = a.layout,
              l = a.children,
              f = Xe(l, Oi);
            if (!f) return null;
            var p = s === "vertical" ? o[0].height / 2 : o[0].width / 2,
              d = function (h, g) {
                var x = Array.isArray(h.value) ? h.value[1] : h.value;
                return { x: h.x, y: h.y, value: x, errorVal: we(h, g) };
              },
              y = { clipPath: n ? "url(#clipPath-".concat(i, ")") : null };
            return S.createElement(
              ie,
              y,
              f.map(function (v) {
                return S.cloneElement(v, {
                  key: "error-bar-".concat(i, "-").concat(v.props.dataKey),
                  data: o,
                  xAxis: u,
                  yAxis: c,
                  layout: s,
                  offset: p,
                  dataPointFormatter: d,
                });
              }),
            );
          },
        },
        {
          key: "render",
          value: function () {
            var n = this.props,
              i = n.hide,
              a = n.data,
              o = n.className,
              u = n.xAxis,
              c = n.yAxis,
              s = n.left,
              l = n.top,
              f = n.width,
              p = n.height,
              d = n.isAnimationActive,
              y = n.background,
              v = n.id;
            if (i || !a || !a.length) return null;
            var h = this.state.isAnimationFinished,
              g = te("recharts-bar", o),
              x = u && u.allowDataOverflow,
              w = c && c.allowDataOverflow,
              O = x || w,
              m = J(v) ? this.id : v;
            return S.createElement(
              ie,
              { className: g },
              x || w
                ? S.createElement(
                    "defs",
                    null,
                    S.createElement(
                      "clipPath",
                      { id: "clipPath-".concat(m) },
                      S.createElement("rect", {
                        x: x ? s : s - f / 2,
                        y: w ? l : l - p / 2,
                        width: x ? f : f * 2,
                        height: w ? p : p * 2,
                      }),
                    ),
                  )
                : null,
              S.createElement(
                ie,
                {
                  className: "recharts-bar-rectangles",
                  clipPath: O ? "url(#clipPath-".concat(m, ")") : null,
                },
                y ? this.renderBackground() : null,
                this.renderRectangles(),
              ),
              this.renderErrorBar(O, m),
              (!d || h) && ht.renderCallByParent(this.props, a),
            );
          },
        },
      ],
      [
        {
          key: "getDerivedStateFromProps",
          value: function (n, i) {
            return n.animationId !== i.prevAnimationId
              ? { prevAnimationId: n.animationId, curData: n.data, prevData: i.curData }
              : n.data !== i.curData
                ? { curData: n.data }
                : null;
          },
        },
      ],
    )
  );
})(L.PureComponent);
zw = dn;
Nt(dn, "displayName", "Bar");
Nt(dn, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  legendType: "rect",
  minPointSize: 0,
  hide: !1,
  data: [],
  layout: "vertical",
  activeBar: !1,
  isAnimationActive: !Bt.isSsr,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: "ease",
});
Nt(dn, "getComposedData", function (e) {
  var t = e.props,
    r = e.item,
    n = e.barPosition,
    i = e.bandSize,
    a = e.xAxis,
    o = e.yAxis,
    u = e.xAxisTicks,
    c = e.yAxisTicks,
    s = e.stackedData,
    l = e.dataStartIndex,
    f = e.displayedData,
    p = e.offset,
    d = D$(n, r);
  if (!d) return null;
  var y = t.layout,
    v = r.type.defaultProps,
    h = v !== void 0 ? Oe(Oe({}, v), r.props) : r.props,
    g = h.dataKey,
    x = h.children,
    w = h.minPointSize,
    O = y === "horizontal" ? o : a,
    m = s ? O.scale.domain() : null,
    b = W$({ numericAxis: O }),
    _ = Xe(x, Op),
    A = f.map(function (T, $) {
      var j, E, C, I, R, k;
      s ? (j = N$(s[l + $], m)) : ((j = we(T, g)), Array.isArray(j) || (j = [b, j]));
      var N = tD(w, zw.defaultProps.minPointSize)(j[1], $);
      if (y === "horizontal") {
        var W,
          z = [o.scale(j[0]), o.scale(j[1])],
          K = z[0],
          P = z[1];
        ((E = tg({ axis: a, ticks: u, bandSize: i, offset: d.offset, entry: T, index: $ })),
          (C = (W = P ?? K) !== null && W !== void 0 ? W : void 0),
          (I = d.size));
        var M = K - P;
        if (
          ((R = Number.isNaN(M) ? 0 : M),
          (k = { x: E, y: o.y, width: I, height: o.height }),
          Math.abs(N) > 0 && Math.abs(R) < Math.abs(N))
        ) {
          var F = qe(R || N) * (Math.abs(N) - Math.abs(R));
          ((C -= F), (R += F));
        }
      } else {
        var H = [a.scale(j[0]), a.scale(j[1])],
          X = H[0],
          re = H[1];
        if (
          ((E = X),
          (C = tg({ axis: o, ticks: c, bandSize: i, offset: d.offset, entry: T, index: $ })),
          (I = re - X),
          (R = d.size),
          (k = { x: a.x, y: C, width: a.width, height: R }),
          Math.abs(N) > 0 && Math.abs(I) < Math.abs(N))
        ) {
          var ae = qe(I || N) * (Math.abs(N) - Math.abs(I));
          I += ae;
        }
      }
      return Oe(
        Oe(
          Oe({}, T),
          {},
          { x: E, y: C, width: I, height: R, value: s ? j : j[1], payload: T, background: k },
          _ && _[$] && _[$].props,
        ),
        {},
        { tooltipPayload: [gw(r, T)], tooltipPosition: { x: E + I / 2, y: C + R / 2 } },
      );
    });
  return Oe({ data: A, layout: y }, p);
});
function pi(e) {
  "@babel/helpers - typeof";
  return (
    (pi =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    pi(e)
  );
}
function pD(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Eb(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, Gw(n.key), n));
  }
}
function hD(e, t, r) {
  return (
    t && Eb(e.prototype, t),
    r && Eb(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function jb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function it(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? jb(Object(r), !0).forEach(function (n) {
          go(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : jb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function go(e, t, r) {
  return (
    (t = Gw(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Gw(e) {
  var t = dD(e, "string");
  return pi(t) == "symbol" ? t : t + "";
}
function dD(e, t) {
  if (pi(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (pi(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Xp = function (t, r, n, i, a) {
    var o = t.width,
      u = t.height,
      c = t.layout,
      s = t.children,
      l = Object.keys(r),
      f = {
        left: n.left,
        leftMirror: n.left,
        right: o - n.right,
        rightMirror: o - n.right,
        top: n.top,
        topMirror: n.top,
        bottom: u - n.bottom,
        bottomMirror: u - n.bottom,
      },
      p = !!Ke(s, dn);
    return l.reduce(function (d, y) {
      var v = r[y],
        h = v.orientation,
        g = v.domain,
        x = v.padding,
        w = x === void 0 ? {} : x,
        O = v.mirror,
        m = v.reversed,
        b = "".concat(h).concat(O ? "Mirror" : ""),
        _,
        A,
        T,
        $,
        j;
      if (v.type === "number" && (v.padding === "gap" || v.padding === "no-gap")) {
        var E = g[1] - g[0],
          C = 1 / 0,
          I = v.categoricalDomain.sort(S_);
        if (
          (I.forEach(function (H, X) {
            X > 0 && (C = Math.min((H || 0) - (I[X - 1] || 0), C));
          }),
          Number.isFinite(C))
        ) {
          var R = C / E,
            k = v.layout === "vertical" ? n.height : n.width;
          if ((v.padding === "gap" && (_ = (R * k) / 2), v.padding === "no-gap")) {
            var N = Le(t.barCategoryGap, R * k),
              W = (R * k) / 2;
            _ = W - N - ((W - N) / k) * N;
          }
        }
      }
      (i === "xAxis"
        ? (A = [n.left + (w.left || 0) + (_ || 0), n.left + n.width - (w.right || 0) - (_ || 0)])
        : i === "yAxis"
          ? (A =
              c === "horizontal"
                ? [n.top + n.height - (w.bottom || 0), n.top + (w.top || 0)]
                : [n.top + (w.top || 0) + (_ || 0), n.top + n.height - (w.bottom || 0) - (_ || 0)])
          : (A = v.range),
        m && (A = [A[1], A[0]]));
      var z = dw(v, a, p),
        K = z.scale,
        P = z.realScaleType;
      (K.domain(g).range(A), vw(K));
      var M = yw(K, it(it({}, v), {}, { realScaleType: P }));
      i === "xAxis"
        ? ((j = (h === "top" && !O) || (h === "bottom" && O)),
          (T = n.left),
          ($ = f[b] - j * v.height))
        : i === "yAxis" &&
          ((j = (h === "left" && !O) || (h === "right" && O)),
          (T = f[b] - j * v.width),
          ($ = n.top));
      var F = it(
        it(it({}, v), M),
        {},
        {
          realScaleType: P,
          x: T,
          y: $,
          scale: K,
          width: i === "xAxis" ? n.width : v.width,
          height: i === "yAxis" ? n.height : v.height,
        },
      );
      return (
        (F.bandSize = va(F, M)),
        !v.hide && i === "xAxis"
          ? (f[b] += (j ? -1 : 1) * F.height)
          : v.hide || (f[b] += (j ? -1 : 1) * F.width),
        it(it({}, d), {}, go({}, y, F))
      );
    }, {});
  },
  Vw = function (t, r) {
    var n = t.x,
      i = t.y,
      a = r.x,
      o = r.y;
    return {
      x: Math.min(n, a),
      y: Math.min(i, o),
      width: Math.abs(a - n),
      height: Math.abs(o - i),
    };
  },
  vD = function (t) {
    var r = t.x1,
      n = t.y1,
      i = t.x2,
      a = t.y2;
    return Vw({ x: r, y: n }, { x: i, y: a });
  },
  Xw = (function () {
    function e(t) {
      (pD(this, e), (this.scale = t));
    }
    return hD(
      e,
      [
        {
          key: "domain",
          get: function () {
            return this.scale.domain;
          },
        },
        {
          key: "range",
          get: function () {
            return this.scale.range;
          },
        },
        {
          key: "rangeMin",
          get: function () {
            return this.range()[0];
          },
        },
        {
          key: "rangeMax",
          get: function () {
            return this.range()[1];
          },
        },
        {
          key: "bandwidth",
          get: function () {
            return this.scale.bandwidth;
          },
        },
        {
          key: "apply",
          value: function (r) {
            var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
              i = n.bandAware,
              a = n.position;
            if (r !== void 0) {
              if (a)
                switch (a) {
                  case "start":
                    return this.scale(r);
                  case "middle": {
                    var o = this.bandwidth ? this.bandwidth() / 2 : 0;
                    return this.scale(r) + o;
                  }
                  case "end": {
                    var u = this.bandwidth ? this.bandwidth() : 0;
                    return this.scale(r) + u;
                  }
                  default:
                    return this.scale(r);
                }
              if (i) {
                var c = this.bandwidth ? this.bandwidth() / 2 : 0;
                return this.scale(r) + c;
              }
              return this.scale(r);
            }
          },
        },
        {
          key: "isInRange",
          value: function (r) {
            var n = this.range(),
              i = n[0],
              a = n[n.length - 1];
            return i <= a ? r >= i && r <= a : r >= a && r <= i;
          },
        },
      ],
      [
        {
          key: "create",
          value: function (r) {
            return new e(r);
          },
        },
      ],
    );
  })();
go(Xw, "EPS", 1e-4);
var Yp = function (t) {
  var r = Object.keys(t).reduce(function (n, i) {
    return it(it({}, n), {}, go({}, i, Xw.create(t[i])));
  }, {});
  return it(
    it({}, r),
    {},
    {
      apply: function (i) {
        var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
          o = a.bandAware,
          u = a.position;
        return Wk(i, function (c, s) {
          return r[s].apply(c, { bandAware: o, position: u });
        });
      },
      isInRange: function (i) {
        return Ww(i, function (a, o) {
          return r[o].isInRange(a);
        });
      },
    },
  );
};
function yD(e) {
  return ((e % 180) + 180) % 180;
}
var mD = function (t) {
    var r = t.width,
      n = t.height,
      i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
      a = yD(i),
      o = (a * Math.PI) / 180,
      u = Math.atan(n / r),
      c = o > u && o < Math.PI - u ? n / Math.sin(o) : r / Math.cos(o);
    return Math.abs(c);
  },
  Ol,
  $b;
function gD() {
  if ($b) return Ol;
  $b = 1;
  var e = mt(),
    t = mi(),
    r = Ja();
  function n(i) {
    return function (a, o, u) {
      var c = Object(a);
      if (!t(a)) {
        var s = e(o, 3);
        ((a = r(a)),
          (o = function (f) {
            return s(c[f], f, c);
          }));
      }
      var l = i(a, o, u);
      return l > -1 ? c[s ? a[l] : l] : void 0;
    };
  }
  return ((Ol = n), Ol);
}
var _l, Mb;
function bD() {
  if (Mb) return _l;
  Mb = 1;
  var e = Lw();
  function t(r) {
    var n = e(r),
      i = n % 1;
    return n === n ? (i ? n - i : n) : 0;
  }
  return ((_l = t), _l);
}
var Al, Cb;
function xD() {
  if (Cb) return Al;
  Cb = 1;
  var e = Y0(),
    t = mt(),
    r = bD(),
    n = Math.max;
  function i(a, o, u) {
    var c = a == null ? 0 : a.length;
    if (!c) return -1;
    var s = u == null ? 0 : r(u);
    return (s < 0 && (s = n(c + s, 0)), e(a, t(o, 3), s));
  }
  return ((Al = i), Al);
}
var Sl, Ib;
function wD() {
  if (Ib) return Sl;
  Ib = 1;
  var e = gD(),
    t = xD(),
    r = e(t);
  return ((Sl = r), Sl);
}
var OD = wD();
const _D = le(OD);
var AD = f0();
const SD = le(AD);
var PD = SD(
    function (e) {
      return { x: e.left, y: e.top, width: e.width, height: e.height };
    },
    function (e) {
      return ["l", e.left, "t", e.top, "w", e.width, "h", e.height].join("");
    },
  ),
  Zp = L.createContext(void 0),
  Jp = L.createContext(void 0),
  Yw = L.createContext(void 0),
  Zw = L.createContext({}),
  Jw = L.createContext(void 0),
  Qw = L.createContext(0),
  eO = L.createContext(0),
  Rb = function (t) {
    var r = t.state,
      n = r.xAxisMap,
      i = r.yAxisMap,
      a = r.offset,
      o = t.clipPathId,
      u = t.children,
      c = t.width,
      s = t.height,
      l = PD(a);
    return S.createElement(
      Zp.Provider,
      { value: n },
      S.createElement(
        Jp.Provider,
        { value: i },
        S.createElement(
          Zw.Provider,
          { value: a },
          S.createElement(
            Yw.Provider,
            { value: l },
            S.createElement(
              Jw.Provider,
              { value: o },
              S.createElement(
                Qw.Provider,
                { value: s },
                S.createElement(eO.Provider, { value: c }, u),
              ),
            ),
          ),
        ),
      ),
    );
  },
  TD = function () {
    return L.useContext(Jw);
  },
  tO = function (t) {
    var r = L.useContext(Zp);
    r == null && pr();
    var n = r[t];
    return (n == null && pr(), n);
  },
  ED = function () {
    var t = L.useContext(Zp);
    return kt(t);
  },
  jD = function () {
    var t = L.useContext(Jp),
      r = _D(t, function (n) {
        return Ww(n.domain, Number.isFinite);
      });
    return r || kt(t);
  },
  rO = function (t) {
    var r = L.useContext(Jp);
    r == null && pr();
    var n = r[t];
    return (n == null && pr(), n);
  },
  $D = function () {
    var t = L.useContext(Yw);
    return t;
  },
  MD = function () {
    return L.useContext(Zw);
  },
  Qp = function () {
    return L.useContext(eO);
  },
  eh = function () {
    return L.useContext(Qw);
  };
function Yr(e) {
  "@babel/helpers - typeof";
  return (
    (Yr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Yr(e)
  );
}
function CD(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function ID(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, iO(n.key), n));
  }
}
function RD(e, t, r) {
  return (t && ID(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function kD(e, t, r) {
  return (
    (t = Ia(t)),
    DD(e, nO() ? Reflect.construct(t, r || [], Ia(e).constructor) : t.apply(e, r))
  );
}
function DD(e, t) {
  if (t && (Yr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return ND(e);
}
function ND(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function nO() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (nO = function () {
    return !!e;
  })();
}
function Ia(e) {
  return (
    (Ia = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Ia(e)
  );
}
function qD(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && kf(e, t));
}
function kf(e, t) {
  return (
    (kf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    kf(e, t)
  );
}
function kb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Db(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? kb(Object(r), !0).forEach(function (n) {
          th(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : kb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function th(e, t, r) {
  return (
    (t = iO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function iO(e) {
  var t = LD(e, "string");
  return Yr(t) == "symbol" ? t : t + "";
}
function LD(e, t) {
  if (Yr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Yr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function BD(e, t) {
  return zD(e) || WD(e, t) || UD(e, t) || FD();
}
function FD() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function UD(e, t) {
  if (e) {
    if (typeof e == "string") return Nb(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Nb(e, t);
  }
}
function Nb(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function WD(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function zD(e) {
  if (Array.isArray(e)) return e;
}
function Df() {
  return (
    (Df = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Df.apply(this, arguments)
  );
}
var HD = function (t, r) {
    var n;
    return (
      S.isValidElement(t)
        ? (n = S.cloneElement(t, r))
        : Z(t)
          ? (n = t(r))
          : (n = S.createElement("line", Df({}, r, { className: "recharts-reference-line-line" }))),
      n
    );
  },
  KD = function (t, r, n, i, a, o, u, c, s) {
    var l = a.x,
      f = a.y,
      p = a.width,
      d = a.height;
    if (n) {
      var y = s.y,
        v = t.y.apply(y, { position: o });
      if (dt(s, "discard") && !t.y.isInRange(v)) return null;
      var h = [
        { x: l + p, y: v },
        { x: l, y: v },
      ];
      return c === "left" ? h.reverse() : h;
    }
    if (r) {
      var g = s.x,
        x = t.x.apply(g, { position: o });
      if (dt(s, "discard") && !t.x.isInRange(x)) return null;
      var w = [
        { x, y: f + d },
        { x, y: f },
      ];
      return u === "top" ? w.reverse() : w;
    }
    if (i) {
      var O = s.segment,
        m = O.map(function (b) {
          return t.apply(b, { position: o });
        });
      return dt(s, "discard") &&
        Lk(m, function (b) {
          return !t.isInRange(b);
        })
        ? null
        : m;
    }
    return null;
  };
function GD(e) {
  var t = e.x,
    r = e.y,
    n = e.segment,
    i = e.xAxisId,
    a = e.yAxisId,
    o = e.shape,
    u = e.className,
    c = e.alwaysShow,
    s = TD(),
    l = tO(i),
    f = rO(a),
    p = $D();
  if (!s || !p) return null;
  ut(
    c === void 0,
    'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.',
  );
  var d = Yp({ x: l.scale, y: f.scale }),
    y = je(t),
    v = je(r),
    h = n && n.length === 2,
    g = KD(d, y, v, h, p, e.position, l.orientation, f.orientation, e);
  if (!g) return null;
  var x = BD(g, 2),
    w = x[0],
    O = w.x,
    m = w.y,
    b = x[1],
    _ = b.x,
    A = b.y,
    T = dt(e, "hidden") ? "url(#".concat(s, ")") : void 0,
    $ = Db(Db({ clipPath: T }, V(e, !0)), {}, { x1: O, y1: m, x2: _, y2: A });
  return S.createElement(
    ie,
    { className: te("recharts-reference-line", u) },
    HD(o, $),
    Ce.renderCallByParent(e, vD({ x1: O, y1: m, x2: _, y2: A })),
  );
}
var rh = (function (e) {
  function t() {
    return (CD(this, t), kD(this, t, arguments));
  }
  return (
    qD(t, e),
    RD(t, [
      {
        key: "render",
        value: function () {
          return S.createElement(GD, this.props);
        },
      },
    ])
  );
})(S.Component);
th(rh, "displayName", "ReferenceLine");
th(rh, "defaultProps", {
  isFront: !1,
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  fill: "none",
  stroke: "#ccc",
  fillOpacity: 1,
  strokeWidth: 1,
  position: "middle",
});
function Nf() {
  return (
    (Nf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Nf.apply(this, arguments)
  );
}
function Zr(e) {
  "@babel/helpers - typeof";
  return (
    (Zr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Zr(e)
  );
}
function qb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Lb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? qb(Object(r), !0).forEach(function (n) {
          bo(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : qb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function VD(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function XD(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, oO(n.key), n));
  }
}
function YD(e, t, r) {
  return (t && XD(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function ZD(e, t, r) {
  return (
    (t = Ra(t)),
    JD(e, aO() ? Reflect.construct(t, r || [], Ra(e).constructor) : t.apply(e, r))
  );
}
function JD(e, t) {
  if (t && (Zr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return QD(e);
}
function QD(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function aO() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (aO = function () {
    return !!e;
  })();
}
function Ra(e) {
  return (
    (Ra = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Ra(e)
  );
}
function eN(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && qf(e, t));
}
function qf(e, t) {
  return (
    (qf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    qf(e, t)
  );
}
function bo(e, t, r) {
  return (
    (t = oO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function oO(e) {
  var t = tN(e, "string");
  return Zr(t) == "symbol" ? t : t + "";
}
function tN(e, t) {
  if (Zr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Zr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var rN = function (t) {
    var r = t.x,
      n = t.y,
      i = t.xAxis,
      a = t.yAxis,
      o = Yp({ x: i.scale, y: a.scale }),
      u = o.apply({ x: r, y: n }, { bandAware: !0 });
    return dt(t, "discard") && !o.isInRange(u) ? null : u;
  },
  xo = (function (e) {
    function t() {
      return (VD(this, t), ZD(this, t, arguments));
    }
    return (
      eN(t, e),
      YD(t, [
        {
          key: "render",
          value: function () {
            var n = this.props,
              i = n.x,
              a = n.y,
              o = n.r,
              u = n.alwaysShow,
              c = n.clipPathId,
              s = je(i),
              l = je(a);
            if (
              (ut(
                u === void 0,
                'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.',
              ),
              !s || !l)
            )
              return null;
            var f = rN(this.props);
            if (!f) return null;
            var p = f.x,
              d = f.y,
              y = this.props,
              v = y.shape,
              h = y.className,
              g = dt(this.props, "hidden") ? "url(#".concat(c, ")") : void 0,
              x = Lb(Lb({ clipPath: g }, V(this.props, !0)), {}, { cx: p, cy: d });
            return S.createElement(
              ie,
              { className: te("recharts-reference-dot", h) },
              t.renderDot(v, x),
              Ce.renderCallByParent(this.props, {
                x: p - o,
                y: d - o,
                width: 2 * o,
                height: 2 * o,
              }),
            );
          },
        },
      ])
    );
  })(S.Component);
bo(xo, "displayName", "ReferenceDot");
bo(xo, "defaultProps", {
  isFront: !1,
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: "#fff",
  stroke: "#ccc",
  fillOpacity: 1,
  strokeWidth: 1,
});
bo(xo, "renderDot", function (e, t) {
  var r;
  return (
    S.isValidElement(e)
      ? (r = S.cloneElement(e, t))
      : Z(e)
        ? (r = e(t))
        : (r = S.createElement(
            _i,
            Nf({}, t, { cx: t.cx, cy: t.cy, className: "recharts-reference-dot-dot" }),
          )),
    r
  );
});
function Lf() {
  return (
    (Lf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Lf.apply(this, arguments)
  );
}
function Jr(e) {
  "@babel/helpers - typeof";
  return (
    (Jr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Jr(e)
  );
}
function Bb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Fb(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Bb(Object(r), !0).forEach(function (n) {
          wo(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Bb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function nN(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function iN(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, cO(n.key), n));
  }
}
function aN(e, t, r) {
  return (t && iN(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function oN(e, t, r) {
  return (
    (t = ka(t)),
    uN(e, uO() ? Reflect.construct(t, r || [], ka(e).constructor) : t.apply(e, r))
  );
}
function uN(e, t) {
  if (t && (Jr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return cN(e);
}
function cN(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function uO() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (uO = function () {
    return !!e;
  })();
}
function ka(e) {
  return (
    (ka = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    ka(e)
  );
}
function sN(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Bf(e, t));
}
function Bf(e, t) {
  return (
    (Bf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Bf(e, t)
  );
}
function wo(e, t, r) {
  return (
    (t = cO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function cO(e) {
  var t = lN(e, "string");
  return Jr(t) == "symbol" ? t : t + "";
}
function lN(e, t) {
  if (Jr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Jr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var fN = function (t, r, n, i, a) {
    var o = a.x1,
      u = a.x2,
      c = a.y1,
      s = a.y2,
      l = a.xAxis,
      f = a.yAxis;
    if (!l || !f) return null;
    var p = Yp({ x: l.scale, y: f.scale }),
      d = {
        x: t ? p.x.apply(o, { position: "start" }) : p.x.rangeMin,
        y: n ? p.y.apply(c, { position: "start" }) : p.y.rangeMin,
      },
      y = {
        x: r ? p.x.apply(u, { position: "end" }) : p.x.rangeMax,
        y: i ? p.y.apply(s, { position: "end" }) : p.y.rangeMax,
      };
    return dt(a, "discard") && (!p.isInRange(d) || !p.isInRange(y)) ? null : Vw(d, y);
  },
  Oo = (function (e) {
    function t() {
      return (nN(this, t), oN(this, t, arguments));
    }
    return (
      sN(t, e),
      aN(t, [
        {
          key: "render",
          value: function () {
            var n = this.props,
              i = n.x1,
              a = n.x2,
              o = n.y1,
              u = n.y2,
              c = n.className,
              s = n.alwaysShow,
              l = n.clipPathId;
            ut(
              s === void 0,
              'The alwaysShow prop is deprecated. Please use ifOverflow="extendDomain" instead.',
            );
            var f = je(i),
              p = je(a),
              d = je(o),
              y = je(u),
              v = this.props.shape;
            if (!f && !p && !d && !y && !v) return null;
            var h = fN(f, p, d, y, this.props);
            if (!h && !v) return null;
            var g = dt(this.props, "hidden") ? "url(#".concat(l, ")") : void 0;
            return S.createElement(
              ie,
              { className: te("recharts-reference-area", c) },
              t.renderRect(v, Fb(Fb({ clipPath: g }, V(this.props, !0)), h)),
              Ce.renderCallByParent(this.props, h),
            );
          },
        },
      ])
    );
  })(S.Component);
wo(Oo, "displayName", "ReferenceArea");
wo(Oo, "defaultProps", {
  isFront: !1,
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: "#ccc",
  fillOpacity: 0.5,
  stroke: "none",
  strokeWidth: 1,
});
wo(Oo, "renderRect", function (e, t) {
  var r;
  return (
    S.isValidElement(e)
      ? (r = S.cloneElement(e, t))
      : Z(e)
        ? (r = e(t))
        : (r = S.createElement(Vp, Lf({}, t, { className: "recharts-reference-area-rect" }))),
    r
  );
});
function sO(e, t, r) {
  if (t < 1) return [];
  if (t === 1 && r === void 0) return e;
  for (var n = [], i = 0; i < e.length; i += t) n.push(e[i]);
  return n;
}
function pN(e, t, r) {
  var n = { width: e.width + t.width, height: e.height + t.height };
  return mD(n, r);
}
function hN(e, t, r) {
  var n = r === "width",
    i = e.x,
    a = e.y,
    o = e.width,
    u = e.height;
  return t === 1
    ? { start: n ? i : a, end: n ? i + o : a + u }
    : { start: n ? i + o : a + u, end: n ? i : a };
}
function Da(e, t, r, n, i) {
  if (e * t < e * n || e * t > e * i) return !1;
  var a = r();
  return e * (t - (e * a) / 2 - n) >= 0 && e * (t + (e * a) / 2 - i) <= 0;
}
function dN(e, t) {
  return sO(e, t + 1);
}
function vN(e, t, r, n, i) {
  for (
    var a = (n || []).slice(),
      o = t.start,
      u = t.end,
      c = 0,
      s = 1,
      l = o,
      f = function () {
        var y = n?.[c];
        if (y === void 0) return { v: sO(n, s) };
        var v = c,
          h,
          g = function () {
            return (h === void 0 && (h = r(y, v)), h);
          },
          x = y.coordinate,
          w = c === 0 || Da(e, x, g, l, u);
        (w || ((c = 0), (l = o), (s += 1)), w && ((l = x + e * (g() / 2 + i)), (c += s)));
      },
      p;
    s <= a.length;
  )
    if (((p = f()), p)) return p.v;
  return [];
}
function hi(e) {
  "@babel/helpers - typeof";
  return (
    (hi =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    hi(e)
  );
}
function Ub(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function De(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Ub(Object(r), !0).forEach(function (n) {
          yN(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Ub(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function yN(e, t, r) {
  return (
    (t = mN(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function mN(e) {
  var t = gN(e, "string");
  return hi(t) == "symbol" ? t : t + "";
}
function gN(e, t) {
  if (hi(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (hi(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function bN(e, t, r, n, i) {
  for (
    var a = (n || []).slice(),
      o = a.length,
      u = t.start,
      c = t.end,
      s = function (p) {
        var d = a[p],
          y,
          v = function () {
            return (y === void 0 && (y = r(d, p)), y);
          };
        if (p === o - 1) {
          var h = e * (d.coordinate + (e * v()) / 2 - c);
          a[p] = d = De(De({}, d), {}, { tickCoord: h > 0 ? d.coordinate - h * e : d.coordinate });
        } else a[p] = d = De(De({}, d), {}, { tickCoord: d.coordinate });
        var g = Da(e, d.tickCoord, v, u, c);
        g && ((c = d.tickCoord - e * (v() / 2 + i)), (a[p] = De(De({}, d), {}, { isShow: !0 })));
      },
      l = o - 1;
    l >= 0;
    l--
  )
    s(l);
  return a;
}
function xN(e, t, r, n, i, a) {
  var o = (n || []).slice(),
    u = o.length,
    c = t.start,
    s = t.end;
  if (a) {
    var l = n[u - 1],
      f = r(l, u - 1),
      p = e * (l.coordinate + (e * f) / 2 - s);
    o[u - 1] = l = De(De({}, l), {}, { tickCoord: p > 0 ? l.coordinate - p * e : l.coordinate });
    var d = Da(
      e,
      l.tickCoord,
      function () {
        return f;
      },
      c,
      s,
    );
    d && ((s = l.tickCoord - e * (f / 2 + i)), (o[u - 1] = De(De({}, l), {}, { isShow: !0 })));
  }
  for (
    var y = a ? u - 1 : u,
      v = function (x) {
        var w = o[x],
          O,
          m = function () {
            return (O === void 0 && (O = r(w, x)), O);
          };
        if (x === 0) {
          var b = e * (w.coordinate - (e * m()) / 2 - c);
          o[x] = w = De(De({}, w), {}, { tickCoord: b < 0 ? w.coordinate - b * e : w.coordinate });
        } else o[x] = w = De(De({}, w), {}, { tickCoord: w.coordinate });
        var _ = Da(e, w.tickCoord, m, c, s);
        _ && ((c = w.tickCoord + e * (m() / 2 + i)), (o[x] = De(De({}, w), {}, { isShow: !0 })));
      },
      h = 0;
    h < y;
    h++
  )
    v(h);
  return o;
}
function nh(e, t, r) {
  var n = e.tick,
    i = e.ticks,
    a = e.viewBox,
    o = e.minTickGap,
    u = e.orientation,
    c = e.interval,
    s = e.tickFormatter,
    l = e.unit,
    f = e.angle;
  if (!i || !i.length || !n) return [];
  if (B(c) || Bt.isSsr) return dN(i, typeof c == "number" && B(c) ? c : 0);
  var p = [],
    d = u === "top" || u === "bottom" ? "width" : "height",
    y = l && d === "width" ? En(l, { fontSize: t, letterSpacing: r }) : { width: 0, height: 0 },
    v = function (w, O) {
      var m = Z(s) ? s(w.value, O) : w.value;
      return d === "width"
        ? pN(En(m, { fontSize: t, letterSpacing: r }), y, f)
        : En(m, { fontSize: t, letterSpacing: r })[d];
    },
    h = i.length >= 2 ? qe(i[1].coordinate - i[0].coordinate) : 1,
    g = hN(a, h, d);
  return c === "equidistantPreserveStart"
    ? vN(h, g, v, i, o)
    : (c === "preserveStart" || c === "preserveStartEnd"
        ? (p = xN(h, g, v, i, o, c === "preserveStartEnd"))
        : (p = bN(h, g, v, i, o)),
      p.filter(function (x) {
        return x.isShow;
      }));
}
var wN = ["viewBox"],
  ON = ["viewBox"],
  _N = ["ticks"];
function Qr(e) {
  "@babel/helpers - typeof";
  return (
    (Qr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    Qr(e)
  );
}
function Er() {
  return (
    (Er = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Er.apply(this, arguments)
  );
}
function Wb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Pe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Wb(Object(r), !0).forEach(function (n) {
          ih(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Wb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Pl(e, t) {
  if (e == null) return {};
  var r = AN(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function AN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function SN(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function zb(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, fO(n.key), n));
  }
}
function PN(e, t, r) {
  return (
    t && zb(e.prototype, t),
    r && zb(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function TN(e, t, r) {
  return (
    (t = Na(t)),
    EN(e, lO() ? Reflect.construct(t, r || [], Na(e).constructor) : t.apply(e, r))
  );
}
function EN(e, t) {
  if (t && (Qr(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return jN(e);
}
function jN(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function lO() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (lO = function () {
    return !!e;
  })();
}
function Na(e) {
  return (
    (Na = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Na(e)
  );
}
function $N(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Ff(e, t));
}
function Ff(e, t) {
  return (
    (Ff = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Ff(e, t)
  );
}
function ih(e, t, r) {
  return (
    (t = fO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function fO(e) {
  var t = MN(e, "string");
  return Qr(t) == "symbol" ? t : t + "";
}
function MN(e, t) {
  if (Qr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (Qr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var vn = (function (e) {
  function t(r) {
    var n;
    return (
      SN(this, t),
      (n = TN(this, t, [r])),
      (n.state = { fontSize: "", letterSpacing: "" }),
      n
    );
  }
  return (
    $N(t, e),
    PN(
      t,
      [
        {
          key: "shouldComponentUpdate",
          value: function (n, i) {
            var a = n.viewBox,
              o = Pl(n, wN),
              u = this.props,
              c = u.viewBox,
              s = Pl(u, ON);
            return !$r(a, c) || !$r(o, s) || !$r(i, this.state);
          },
        },
        {
          key: "componentDidMount",
          value: function () {
            var n = this.layerReference;
            if (n) {
              var i = n.getElementsByClassName("recharts-cartesian-axis-tick-value")[0];
              i &&
                this.setState({
                  fontSize: window.getComputedStyle(i).fontSize,
                  letterSpacing: window.getComputedStyle(i).letterSpacing,
                });
            }
          },
        },
        {
          key: "getTickLineCoord",
          value: function (n) {
            var i = this.props,
              a = i.x,
              o = i.y,
              u = i.width,
              c = i.height,
              s = i.orientation,
              l = i.tickSize,
              f = i.mirror,
              p = i.tickMargin,
              d,
              y,
              v,
              h,
              g,
              x,
              w = f ? -1 : 1,
              O = n.tickSize || l,
              m = B(n.tickCoord) ? n.tickCoord : n.coordinate;
            switch (s) {
              case "top":
                ((d = y = n.coordinate),
                  (h = o + +!f * c),
                  (v = h - w * O),
                  (x = v - w * p),
                  (g = m));
                break;
              case "left":
                ((v = h = n.coordinate),
                  (y = a + +!f * u),
                  (d = y - w * O),
                  (g = d - w * p),
                  (x = m));
                break;
              case "right":
                ((v = h = n.coordinate),
                  (y = a + +f * u),
                  (d = y + w * O),
                  (g = d + w * p),
                  (x = m));
                break;
              default:
                ((d = y = n.coordinate),
                  (h = o + +f * c),
                  (v = h + w * O),
                  (x = v + w * p),
                  (g = m));
                break;
            }
            return { line: { x1: d, y1: v, x2: y, y2: h }, tick: { x: g, y: x } };
          },
        },
        {
          key: "getTickTextAnchor",
          value: function () {
            var n = this.props,
              i = n.orientation,
              a = n.mirror,
              o;
            switch (i) {
              case "left":
                o = a ? "start" : "end";
                break;
              case "right":
                o = a ? "end" : "start";
                break;
              default:
                o = "middle";
                break;
            }
            return o;
          },
        },
        {
          key: "getTickVerticalAnchor",
          value: function () {
            var n = this.props,
              i = n.orientation,
              a = n.mirror,
              o = "end";
            switch (i) {
              case "left":
              case "right":
                o = "middle";
                break;
              case "top":
                o = a ? "start" : "end";
                break;
              default:
                o = a ? "end" : "start";
                break;
            }
            return o;
          },
        },
        {
          key: "renderAxisLine",
          value: function () {
            var n = this.props,
              i = n.x,
              a = n.y,
              o = n.width,
              u = n.height,
              c = n.orientation,
              s = n.mirror,
              l = n.axisLine,
              f = Pe(Pe(Pe({}, V(this.props, !1)), V(l, !1)), {}, { fill: "none" });
            if (c === "top" || c === "bottom") {
              var p = +((c === "top" && !s) || (c === "bottom" && s));
              f = Pe(Pe({}, f), {}, { x1: i, y1: a + p * u, x2: i + o, y2: a + p * u });
            } else {
              var d = +((c === "left" && !s) || (c === "right" && s));
              f = Pe(Pe({}, f), {}, { x1: i + d * o, y1: a, x2: i + d * o, y2: a + u });
            }
            return S.createElement(
              "line",
              Er({}, f, { className: te("recharts-cartesian-axis-line", Ve(l, "className")) }),
            );
          },
        },
        {
          key: "renderTicks",
          value: function (n, i, a) {
            var o = this,
              u = this.props,
              c = u.tickLine,
              s = u.stroke,
              l = u.tick,
              f = u.tickFormatter,
              p = u.unit,
              d = nh(Pe(Pe({}, this.props), {}, { ticks: n }), i, a),
              y = this.getTickTextAnchor(),
              v = this.getTickVerticalAnchor(),
              h = V(this.props, !1),
              g = V(l, !1),
              x = Pe(Pe({}, h), {}, { fill: "none" }, V(c, !1)),
              w = d.map(function (O, m) {
                var b = o.getTickLineCoord(O),
                  _ = b.line,
                  A = b.tick,
                  T = Pe(
                    Pe(
                      Pe(
                        Pe({ textAnchor: y, verticalAnchor: v }, h),
                        {},
                        { stroke: "none", fill: s },
                        g,
                      ),
                      A,
                    ),
                    {},
                    { index: m, payload: O, visibleTicksCount: d.length, tickFormatter: f },
                  );
                return S.createElement(
                  ie,
                  Er(
                    {
                      className: "recharts-cartesian-axis-tick",
                      key: "tick-"
                        .concat(O.value, "-")
                        .concat(O.coordinate, "-")
                        .concat(O.tickCoord),
                    },
                    cr(o.props, O, m),
                  ),
                  c &&
                    S.createElement(
                      "line",
                      Er({}, x, _, {
                        className: te("recharts-cartesian-axis-tick-line", Ve(c, "className")),
                      }),
                    ),
                  l &&
                    t.renderTickItem(
                      l,
                      T,
                      "".concat(Z(f) ? f(O.value, m) : O.value).concat(p || ""),
                    ),
                );
              });
            return S.createElement("g", { className: "recharts-cartesian-axis-ticks" }, w);
          },
        },
        {
          key: "render",
          value: function () {
            var n = this,
              i = this.props,
              a = i.axisLine,
              o = i.width,
              u = i.height,
              c = i.ticksGenerator,
              s = i.className,
              l = i.hide;
            if (l) return null;
            var f = this.props,
              p = f.ticks,
              d = Pl(f, _N),
              y = p;
            return (
              Z(c) && (y = p && p.length > 0 ? c(this.props) : c(d)),
              o <= 0 || u <= 0 || !y || !y.length
                ? null
                : S.createElement(
                    ie,
                    {
                      className: te("recharts-cartesian-axis", s),
                      ref: function (h) {
                        n.layerReference = h;
                      },
                    },
                    a && this.renderAxisLine(),
                    this.renderTicks(y, this.state.fontSize, this.state.letterSpacing),
                    Ce.renderCallByParent(this.props),
                  )
            );
          },
        },
      ],
      [
        {
          key: "renderTickItem",
          value: function (n, i, a) {
            var o,
              u = te(i.className, "recharts-cartesian-axis-tick-value");
            return (
              S.isValidElement(n)
                ? (o = S.cloneElement(n, Pe(Pe({}, i), {}, { className: u })))
                : Z(n)
                  ? (o = n(Pe(Pe({}, i), {}, { className: u })))
                  : (o = S.createElement(
                      sr,
                      Er({}, i, { className: "recharts-cartesian-axis-tick-value" }),
                      a,
                    )),
              o
            );
          },
        },
      ],
    )
  );
})(L.Component);
ih(vn, "displayName", "CartesianAxis");
ih(vn, "defaultProps", {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: { x: 0, y: 0, width: 0, height: 0 },
  orientation: "bottom",
  ticks: [],
  stroke: "#666",
  tickLine: !0,
  axisLine: !0,
  tick: !0,
  mirror: !1,
  minTickGap: 5,
  tickSize: 6,
  tickMargin: 2,
  interval: "preserveEnd",
});
var CN = ["x1", "y1", "x2", "y2", "key"],
  IN = ["offset"];
function hr(e) {
  "@babel/helpers - typeof";
  return (
    (hr =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    hr(e)
  );
}
function Hb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Ne(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Hb(Object(r), !0).forEach(function (n) {
          RN(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Hb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function RN(e, t, r) {
  return (
    (t = kN(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function kN(e) {
  var t = DN(e, "string");
  return hr(t) == "symbol" ? t : t + "";
}
function DN(e, t) {
  if (hr(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (hr(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function rr() {
  return (
    (rr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    rr.apply(this, arguments)
  );
}
function Kb(e, t) {
  if (e == null) return {};
  var r = NN(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function NN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
var qN = function (t) {
  var r = t.fill;
  if (!r || r === "none") return null;
  var n = t.fillOpacity,
    i = t.x,
    a = t.y,
    o = t.width,
    u = t.height,
    c = t.ry;
  return S.createElement("rect", {
    x: i,
    y: a,
    ry: c,
    width: o,
    height: u,
    stroke: "none",
    fill: r,
    fillOpacity: n,
    className: "recharts-cartesian-grid-bg",
  });
};
function pO(e, t) {
  var r;
  if (S.isValidElement(e)) r = S.cloneElement(e, t);
  else if (Z(e)) r = e(t);
  else {
    var n = t.x1,
      i = t.y1,
      a = t.x2,
      o = t.y2,
      u = t.key,
      c = Kb(t, CN),
      s = V(c, !1);
    s.offset;
    var l = Kb(s, IN);
    r = S.createElement("line", rr({}, l, { x1: n, y1: i, x2: a, y2: o, fill: "none", key: u }));
  }
  return r;
}
function LN(e) {
  var t = e.x,
    r = e.width,
    n = e.horizontal,
    i = n === void 0 ? !0 : n,
    a = e.horizontalPoints;
  if (!i || !a || !a.length) return null;
  var o = a.map(function (u, c) {
    var s = Ne(Ne({}, e), {}, { x1: t, y1: u, x2: t + r, y2: u, key: "line-".concat(c), index: c });
    return pO(i, s);
  });
  return S.createElement("g", { className: "recharts-cartesian-grid-horizontal" }, o);
}
function BN(e) {
  var t = e.y,
    r = e.height,
    n = e.vertical,
    i = n === void 0 ? !0 : n,
    a = e.verticalPoints;
  if (!i || !a || !a.length) return null;
  var o = a.map(function (u, c) {
    var s = Ne(Ne({}, e), {}, { x1: u, y1: t, x2: u, y2: t + r, key: "line-".concat(c), index: c });
    return pO(i, s);
  });
  return S.createElement("g", { className: "recharts-cartesian-grid-vertical" }, o);
}
function FN(e) {
  var t = e.horizontalFill,
    r = e.fillOpacity,
    n = e.x,
    i = e.y,
    a = e.width,
    o = e.height,
    u = e.horizontalPoints,
    c = e.horizontal,
    s = c === void 0 ? !0 : c;
  if (!s || !t || !t.length) return null;
  var l = u
    .map(function (p) {
      return Math.round(p + i - i);
    })
    .sort(function (p, d) {
      return p - d;
    });
  i !== l[0] && l.unshift(0);
  var f = l.map(function (p, d) {
    var y = !l[d + 1],
      v = y ? i + o - p : l[d + 1] - p;
    if (v <= 0) return null;
    var h = d % t.length;
    return S.createElement("rect", {
      key: "react-".concat(d),
      y: p,
      x: n,
      height: v,
      width: a,
      stroke: "none",
      fill: t[h],
      fillOpacity: r,
      className: "recharts-cartesian-grid-bg",
    });
  });
  return S.createElement("g", { className: "recharts-cartesian-gridstripes-horizontal" }, f);
}
function UN(e) {
  var t = e.vertical,
    r = t === void 0 ? !0 : t,
    n = e.verticalFill,
    i = e.fillOpacity,
    a = e.x,
    o = e.y,
    u = e.width,
    c = e.height,
    s = e.verticalPoints;
  if (!r || !n || !n.length) return null;
  var l = s
    .map(function (p) {
      return Math.round(p + a - a);
    })
    .sort(function (p, d) {
      return p - d;
    });
  a !== l[0] && l.unshift(0);
  var f = l.map(function (p, d) {
    var y = !l[d + 1],
      v = y ? a + u - p : l[d + 1] - p;
    if (v <= 0) return null;
    var h = d % n.length;
    return S.createElement("rect", {
      key: "react-".concat(d),
      x: p,
      y: o,
      width: v,
      height: c,
      stroke: "none",
      fill: n[h],
      fillOpacity: i,
      className: "recharts-cartesian-grid-bg",
    });
  });
  return S.createElement("g", { className: "recharts-cartesian-gridstripes-vertical" }, f);
}
var WN = function (t, r) {
    var n = t.xAxis,
      i = t.width,
      a = t.height,
      o = t.offset;
    return hw(
      nh(
        Ne(
          Ne(Ne({}, vn.defaultProps), n),
          {},
          { ticks: _t(n, !0), viewBox: { x: 0, y: 0, width: i, height: a } },
        ),
      ),
      o.left,
      o.left + o.width,
      r,
    );
  },
  zN = function (t, r) {
    var n = t.yAxis,
      i = t.width,
      a = t.height,
      o = t.offset;
    return hw(
      nh(
        Ne(
          Ne(Ne({}, vn.defaultProps), n),
          {},
          { ticks: _t(n, !0), viewBox: { x: 0, y: 0, width: i, height: a } },
        ),
      ),
      o.top,
      o.top + o.height,
      r,
    );
  },
  _r = {
    horizontal: !0,
    vertical: !0,
    stroke: "#ccc",
    fill: "none",
    verticalFill: [],
    horizontalFill: [],
  };
function HN(e) {
  var t,
    r,
    n,
    i,
    a,
    o,
    u = Qp(),
    c = eh(),
    s = MD(),
    l = Ne(
      Ne({}, e),
      {},
      {
        stroke: (t = e.stroke) !== null && t !== void 0 ? t : _r.stroke,
        fill: (r = e.fill) !== null && r !== void 0 ? r : _r.fill,
        horizontal: (n = e.horizontal) !== null && n !== void 0 ? n : _r.horizontal,
        horizontalFill: (i = e.horizontalFill) !== null && i !== void 0 ? i : _r.horizontalFill,
        vertical: (a = e.vertical) !== null && a !== void 0 ? a : _r.vertical,
        verticalFill: (o = e.verticalFill) !== null && o !== void 0 ? o : _r.verticalFill,
        x: B(e.x) ? e.x : s.left,
        y: B(e.y) ? e.y : s.top,
        width: B(e.width) ? e.width : s.width,
        height: B(e.height) ? e.height : s.height,
      },
    ),
    f = l.x,
    p = l.y,
    d = l.width,
    y = l.height,
    v = l.syncWithTicks,
    h = l.horizontalValues,
    g = l.verticalValues,
    x = ED(),
    w = jD();
  if (!B(d) || d <= 0 || !B(y) || y <= 0 || !B(f) || f !== +f || !B(p) || p !== +p) return null;
  var O = l.verticalCoordinatesGenerator || WN,
    m = l.horizontalCoordinatesGenerator || zN,
    b = l.horizontalPoints,
    _ = l.verticalPoints;
  if ((!b || !b.length) && Z(m)) {
    var A = h && h.length,
      T = m(
        {
          yAxis: w ? Ne(Ne({}, w), {}, { ticks: A ? h : w.ticks }) : void 0,
          width: u,
          height: c,
          offset: s,
        },
        A ? !0 : v,
      );
    (ut(
      Array.isArray(T),
      "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(
        hr(T),
        "]",
      ),
    ),
      Array.isArray(T) && (b = T));
  }
  if ((!_ || !_.length) && Z(O)) {
    var $ = g && g.length,
      j = O(
        {
          xAxis: x ? Ne(Ne({}, x), {}, { ticks: $ ? g : x.ticks }) : void 0,
          width: u,
          height: c,
          offset: s,
        },
        $ ? !0 : v,
      );
    (ut(
      Array.isArray(j),
      "verticalCoordinatesGenerator should return Array but instead it returned [".concat(
        hr(j),
        "]",
      ),
    ),
      Array.isArray(j) && (_ = j));
  }
  return S.createElement(
    "g",
    { className: "recharts-cartesian-grid" },
    S.createElement(qN, {
      fill: l.fill,
      fillOpacity: l.fillOpacity,
      x: l.x,
      y: l.y,
      width: l.width,
      height: l.height,
      ry: l.ry,
    }),
    S.createElement(LN, rr({}, l, { offset: s, horizontalPoints: b, xAxis: x, yAxis: w })),
    S.createElement(BN, rr({}, l, { offset: s, verticalPoints: _, xAxis: x, yAxis: w })),
    S.createElement(FN, rr({}, l, { horizontalPoints: b })),
    S.createElement(UN, rr({}, l, { verticalPoints: _ })),
  );
}
HN.displayName = "CartesianGrid";
var KN = ["type", "layout", "connectNulls", "ref"],
  GN = ["key"];
function en(e) {
  "@babel/helpers - typeof";
  return (
    (en =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    en(e)
  );
}
function Gb(e, t) {
  if (e == null) return {};
  var r = VN(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function VN(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function Rn() {
  return (
    (Rn = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Rn.apply(this, arguments)
  );
}
function Vb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function ze(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Vb(Object(r), !0).forEach(function (n) {
          at(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Vb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Ar(e) {
  return JN(e) || ZN(e) || YN(e) || XN();
}
function XN() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function YN(e, t) {
  if (e) {
    if (typeof e == "string") return Uf(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Uf(e, t);
  }
}
function ZN(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function JN(e) {
  if (Array.isArray(e)) return Uf(e);
}
function Uf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function QN(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Xb(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, dO(n.key), n));
  }
}
function e2(e, t, r) {
  return (
    t && Xb(e.prototype, t),
    r && Xb(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function t2(e, t, r) {
  return (
    (t = qa(t)),
    r2(e, hO() ? Reflect.construct(t, r || [], qa(e).constructor) : t.apply(e, r))
  );
}
function r2(e, t) {
  if (t && (en(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return n2(e);
}
function n2(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function hO() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (hO = function () {
    return !!e;
  })();
}
function qa(e) {
  return (
    (qa = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    qa(e)
  );
}
function i2(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Wf(e, t));
}
function Wf(e, t) {
  return (
    (Wf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Wf(e, t)
  );
}
function at(e, t, r) {
  return (
    (t = dO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function dO(e) {
  var t = a2(e, "string");
  return en(t) == "symbol" ? t : t + "";
}
function a2(e, t) {
  if (en(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (en(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var _o = (function (e) {
  function t() {
    var r;
    QN(this, t);
    for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++) i[a] = arguments[a];
    return (
      (r = t2(this, t, [].concat(i))),
      at(r, "state", { isAnimationFinished: !0, totalLength: 0 }),
      at(r, "generateSimpleStrokeDasharray", function (o, u) {
        return "".concat(u, "px ").concat(o - u, "px");
      }),
      at(r, "getStrokeDasharray", function (o, u, c) {
        var s = c.reduce(function (g, x) {
          return g + x;
        });
        if (!s) return r.generateSimpleStrokeDasharray(u, o);
        for (
          var l = Math.floor(o / s), f = o % s, p = u - o, d = [], y = 0, v = 0;
          y < c.length;
          v += c[y], ++y
        )
          if (v + c[y] > f) {
            d = [].concat(Ar(c.slice(0, y)), [f - v]);
            break;
          }
        var h = d.length % 2 === 0 ? [0, p] : [p];
        return []
          .concat(Ar(t.repeat(c, l)), Ar(d), h)
          .map(function (g) {
            return "".concat(g, "px");
          })
          .join(", ");
      }),
      at(r, "id", vr("recharts-line-")),
      at(r, "pathRef", function (o) {
        r.mainCurve = o;
      }),
      at(r, "handleAnimationEnd", function () {
        (r.setState({ isAnimationFinished: !0 }),
          r.props.onAnimationEnd && r.props.onAnimationEnd());
      }),
      at(r, "handleAnimationStart", function () {
        (r.setState({ isAnimationFinished: !1 }),
          r.props.onAnimationStart && r.props.onAnimationStart());
      }),
      r
    );
  }
  return (
    i2(t, e),
    e2(
      t,
      [
        {
          key: "componentDidMount",
          value: function () {
            if (this.props.isAnimationActive) {
              var n = this.getTotalLength();
              this.setState({ totalLength: n });
            }
          },
        },
        {
          key: "componentDidUpdate",
          value: function () {
            if (this.props.isAnimationActive) {
              var n = this.getTotalLength();
              n !== this.state.totalLength && this.setState({ totalLength: n });
            }
          },
        },
        {
          key: "getTotalLength",
          value: function () {
            var n = this.mainCurve;
            try {
              return (n && n.getTotalLength && n.getTotalLength()) || 0;
            } catch {
              return 0;
            }
          },
        },
        {
          key: "renderErrorBar",
          value: function (n, i) {
            if (this.props.isAnimationActive && !this.state.isAnimationFinished) return null;
            var a = this.props,
              o = a.points,
              u = a.xAxis,
              c = a.yAxis,
              s = a.layout,
              l = a.children,
              f = Xe(l, Oi);
            if (!f) return null;
            var p = function (v, h) {
                return { x: v.x, y: v.y, value: v.value, errorVal: we(v.payload, h) };
              },
              d = { clipPath: n ? "url(#clipPath-".concat(i, ")") : null };
            return S.createElement(
              ie,
              d,
              f.map(function (y) {
                return S.cloneElement(y, {
                  key: "bar-".concat(y.props.dataKey),
                  data: o,
                  xAxis: u,
                  yAxis: c,
                  layout: s,
                  dataPointFormatter: p,
                });
              }),
            );
          },
        },
        {
          key: "renderDots",
          value: function (n, i, a) {
            var o = this.props.isAnimationActive;
            if (o && !this.state.isAnimationFinished) return null;
            var u = this.props,
              c = u.dot,
              s = u.points,
              l = u.dataKey,
              f = V(this.props, !1),
              p = V(c, !0),
              d = s.map(function (v, h) {
                var g = ze(
                  ze(ze({ key: "dot-".concat(h), r: 3 }, f), p),
                  {},
                  {
                    index: h,
                    cx: v.x,
                    cy: v.y,
                    value: v.value,
                    dataKey: l,
                    payload: v.payload,
                    points: s,
                  },
                );
                return t.renderDotItem(c, g);
              }),
              y = { clipPath: n ? "url(#clipPath-".concat(i ? "" : "dots-").concat(a, ")") : null };
            return S.createElement(ie, Rn({ className: "recharts-line-dots", key: "dots" }, y), d);
          },
        },
        {
          key: "renderCurveStatically",
          value: function (n, i, a, o) {
            var u = this.props,
              c = u.type,
              s = u.layout,
              l = u.connectNulls;
            u.ref;
            var f = Gb(u, KN),
              p = ze(
                ze(
                  ze({}, V(f, !0)),
                  {},
                  {
                    fill: "none",
                    className: "recharts-line-curve",
                    clipPath: i ? "url(#clipPath-".concat(a, ")") : null,
                    points: n,
                  },
                  o,
                ),
                {},
                { type: c, layout: s, connectNulls: l },
              );
            return S.createElement(or, Rn({}, p, { pathRef: this.pathRef }));
          },
        },
        {
          key: "renderCurveWithAnimation",
          value: function (n, i) {
            var a = this,
              o = this.props,
              u = o.points,
              c = o.strokeDasharray,
              s = o.isAnimationActive,
              l = o.animationBegin,
              f = o.animationDuration,
              p = o.animationEasing,
              d = o.animationId,
              y = o.animateNewValues,
              v = o.width,
              h = o.height,
              g = this.state,
              x = g.prevPoints,
              w = g.totalLength;
            return S.createElement(
              ct,
              {
                begin: l,
                duration: f,
                isActive: s,
                easing: p,
                from: { t: 0 },
                to: { t: 1 },
                key: "line-".concat(d),
                onAnimationEnd: this.handleAnimationEnd,
                onAnimationStart: this.handleAnimationStart,
              },
              function (O) {
                var m = O.t;
                if (x) {
                  var b = x.length / u.length,
                    _ = u.map(function (E, C) {
                      var I = Math.floor(C * b);
                      if (x[I]) {
                        var R = x[I],
                          k = Ee(R.x, E.x),
                          N = Ee(R.y, E.y);
                        return ze(ze({}, E), {}, { x: k(m), y: N(m) });
                      }
                      if (y) {
                        var W = Ee(v * 2, E.x),
                          z = Ee(h / 2, E.y);
                        return ze(ze({}, E), {}, { x: W(m), y: z(m) });
                      }
                      return ze(ze({}, E), {}, { x: E.x, y: E.y });
                    });
                  return a.renderCurveStatically(_, n, i);
                }
                var A = Ee(0, w),
                  T = A(m),
                  $;
                if (c) {
                  var j = ""
                    .concat(c)
                    .split(/[,\s]+/gim)
                    .map(function (E) {
                      return parseFloat(E);
                    });
                  $ = a.getStrokeDasharray(T, w, j);
                } else $ = a.generateSimpleStrokeDasharray(w, T);
                return a.renderCurveStatically(u, n, i, { strokeDasharray: $ });
              },
            );
          },
        },
        {
          key: "renderCurve",
          value: function (n, i) {
            var a = this.props,
              o = a.points,
              u = a.isAnimationActive,
              c = this.state,
              s = c.prevPoints,
              l = c.totalLength;
            return u && o && o.length && ((!s && l > 0) || !lr(s, o))
              ? this.renderCurveWithAnimation(n, i)
              : this.renderCurveStatically(o, n, i);
          },
        },
        {
          key: "render",
          value: function () {
            var n,
              i = this.props,
              a = i.hide,
              o = i.dot,
              u = i.points,
              c = i.className,
              s = i.xAxis,
              l = i.yAxis,
              f = i.top,
              p = i.left,
              d = i.width,
              y = i.height,
              v = i.isAnimationActive,
              h = i.id;
            if (a || !u || !u.length) return null;
            var g = this.state.isAnimationFinished,
              x = u.length === 1,
              w = te("recharts-line", c),
              O = s && s.allowDataOverflow,
              m = l && l.allowDataOverflow,
              b = O || m,
              _ = J(h) ? this.id : h,
              A = (n = V(o, !1)) !== null && n !== void 0 ? n : { r: 3, strokeWidth: 2 },
              T = A.r,
              $ = T === void 0 ? 3 : T,
              j = A.strokeWidth,
              E = j === void 0 ? 2 : j,
              C = y0(o) ? o : {},
              I = C.clipDot,
              R = I === void 0 ? !0 : I,
              k = $ * 2 + E;
            return S.createElement(
              ie,
              { className: w },
              O || m
                ? S.createElement(
                    "defs",
                    null,
                    S.createElement(
                      "clipPath",
                      { id: "clipPath-".concat(_) },
                      S.createElement("rect", {
                        x: O ? p : p - d / 2,
                        y: m ? f : f - y / 2,
                        width: O ? d : d * 2,
                        height: m ? y : y * 2,
                      }),
                    ),
                    !R &&
                      S.createElement(
                        "clipPath",
                        { id: "clipPath-dots-".concat(_) },
                        S.createElement("rect", {
                          x: p - k / 2,
                          y: f - k / 2,
                          width: d + k,
                          height: y + k,
                        }),
                      ),
                  )
                : null,
              !x && this.renderCurve(b, _),
              this.renderErrorBar(b, _),
              (x || o) && this.renderDots(b, R, _),
              (!v || g) && ht.renderCallByParent(this.props, u),
            );
          },
        },
      ],
      [
        {
          key: "getDerivedStateFromProps",
          value: function (n, i) {
            return n.animationId !== i.prevAnimationId
              ? { prevAnimationId: n.animationId, curPoints: n.points, prevPoints: i.curPoints }
              : n.points !== i.curPoints
                ? { curPoints: n.points }
                : null;
          },
        },
        {
          key: "repeat",
          value: function (n, i) {
            for (var a = n.length % 2 !== 0 ? [].concat(Ar(n), [0]) : n, o = [], u = 0; u < i; ++u)
              o = [].concat(Ar(o), Ar(a));
            return o;
          },
        },
        {
          key: "renderDotItem",
          value: function (n, i) {
            var a;
            if (S.isValidElement(n)) a = S.cloneElement(n, i);
            else if (Z(n)) a = n(i);
            else {
              var o = i.key,
                u = Gb(i, GN),
                c = te("recharts-line-dot", typeof n != "boolean" ? n.className : "");
              a = S.createElement(_i, Rn({ key: o }, u, { className: c }));
            }
            return a;
          },
        },
      ],
    )
  );
})(L.PureComponent);
at(_o, "displayName", "Line");
at(_o, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  connectNulls: !1,
  activeDot: !0,
  dot: !0,
  legendType: "line",
  stroke: "#3182bd",
  strokeWidth: 1,
  fill: "#fff",
  points: [],
  isAnimationActive: !Bt.isSsr,
  animateNewValues: !0,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  hide: !1,
  label: !1,
});
at(_o, "getComposedData", function (e) {
  var t = e.props,
    r = e.xAxis,
    n = e.yAxis,
    i = e.xAxisTicks,
    a = e.yAxisTicks,
    o = e.dataKey,
    u = e.bandSize,
    c = e.displayedData,
    s = e.offset,
    l = t.layout,
    f = c.map(function (p, d) {
      var y = we(p, o);
      return l === "horizontal"
        ? {
            x: da({ axis: r, ticks: i, bandSize: u, entry: p, index: d }),
            y: J(y) ? null : n.scale(y),
            value: y,
            payload: p,
          }
        : {
            x: J(y) ? null : r.scale(y),
            y: da({ axis: n, ticks: a, bandSize: u, entry: p, index: d }),
            value: y,
            payload: p,
          };
    });
  return ze({ points: f, layout: l }, s);
});
var o2 = ["layout", "type", "stroke", "connectNulls", "isRange", "ref"],
  u2 = ["key"],
  vO;
function tn(e) {
  "@babel/helpers - typeof";
  return (
    (tn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    tn(e)
  );
}
function yO(e, t) {
  if (e == null) return {};
  var r = c2(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function c2(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function nr() {
  return (
    (nr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    nr.apply(this, arguments)
  );
}
function Yb(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function It(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? Yb(Object(r), !0).forEach(function (n) {
          ft(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : Yb(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function s2(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function Zb(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, gO(n.key), n));
  }
}
function l2(e, t, r) {
  return (
    t && Zb(e.prototype, t),
    r && Zb(e, r),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function f2(e, t, r) {
  return (
    (t = La(t)),
    p2(e, mO() ? Reflect.construct(t, r || [], La(e).constructor) : t.apply(e, r))
  );
}
function p2(e, t) {
  if (t && (tn(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return h2(e);
}
function h2(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function mO() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (mO = function () {
    return !!e;
  })();
}
function La(e) {
  return (
    (La = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    La(e)
  );
}
function d2(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && zf(e, t));
}
function zf(e, t) {
  return (
    (zf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    zf(e, t)
  );
}
function ft(e, t, r) {
  return (
    (t = gO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function gO(e) {
  var t = v2(e, "string");
  return tn(t) == "symbol" ? t : t + "";
}
function v2(e, t) {
  if (tn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (tn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var br = (function (e) {
  function t() {
    var r;
    s2(this, t);
    for (var n = arguments.length, i = new Array(n), a = 0; a < n; a++) i[a] = arguments[a];
    return (
      (r = f2(this, t, [].concat(i))),
      ft(r, "state", { isAnimationFinished: !0 }),
      ft(r, "id", vr("recharts-area-")),
      ft(r, "handleAnimationEnd", function () {
        var o = r.props.onAnimationEnd;
        (r.setState({ isAnimationFinished: !0 }), Z(o) && o());
      }),
      ft(r, "handleAnimationStart", function () {
        var o = r.props.onAnimationStart;
        (r.setState({ isAnimationFinished: !1 }), Z(o) && o());
      }),
      r
    );
  }
  return (
    d2(t, e),
    l2(
      t,
      [
        {
          key: "renderDots",
          value: function (n, i, a) {
            var o = this.props.isAnimationActive,
              u = this.state.isAnimationFinished;
            if (o && !u) return null;
            var c = this.props,
              s = c.dot,
              l = c.points,
              f = c.dataKey,
              p = V(this.props, !1),
              d = V(s, !0),
              y = l.map(function (h, g) {
                var x = It(
                  It(It({ key: "dot-".concat(g), r: 3 }, p), d),
                  {},
                  {
                    index: g,
                    cx: h.x,
                    cy: h.y,
                    dataKey: f,
                    value: h.value,
                    payload: h.payload,
                    points: l,
                  },
                );
                return t.renderDotItem(s, x);
              }),
              v = { clipPath: n ? "url(#clipPath-".concat(i ? "" : "dots-").concat(a, ")") : null };
            return S.createElement(ie, nr({ className: "recharts-area-dots" }, v), y);
          },
        },
        {
          key: "renderHorizontalRect",
          value: function (n) {
            var i = this.props,
              a = i.baseLine,
              o = i.points,
              u = i.strokeWidth,
              c = o[0].x,
              s = o[o.length - 1].x,
              l = n * Math.abs(c - s),
              f = Dt(
                o.map(function (p) {
                  return p.y || 0;
                }),
              );
            return (
              B(a) && typeof a == "number"
                ? (f = Math.max(a, f))
                : a &&
                  Array.isArray(a) &&
                  a.length &&
                  (f = Math.max(
                    Dt(
                      a.map(function (p) {
                        return p.y || 0;
                      }),
                    ),
                    f,
                  )),
              B(f)
                ? S.createElement("rect", {
                    x: c < s ? c : c - l,
                    y: 0,
                    width: l,
                    height: Math.floor(f + (u ? parseInt("".concat(u), 10) : 1)),
                  })
                : null
            );
          },
        },
        {
          key: "renderVerticalRect",
          value: function (n) {
            var i = this.props,
              a = i.baseLine,
              o = i.points,
              u = i.strokeWidth,
              c = o[0].y,
              s = o[o.length - 1].y,
              l = n * Math.abs(c - s),
              f = Dt(
                o.map(function (p) {
                  return p.x || 0;
                }),
              );
            return (
              B(a) && typeof a == "number"
                ? (f = Math.max(a, f))
                : a &&
                  Array.isArray(a) &&
                  a.length &&
                  (f = Math.max(
                    Dt(
                      a.map(function (p) {
                        return p.x || 0;
                      }),
                    ),
                    f,
                  )),
              B(f)
                ? S.createElement("rect", {
                    x: 0,
                    y: c < s ? c : c - l,
                    width: f + (u ? parseInt("".concat(u), 10) : 1),
                    height: Math.floor(l),
                  })
                : null
            );
          },
        },
        {
          key: "renderClipRect",
          value: function (n) {
            var i = this.props.layout;
            return i === "vertical" ? this.renderVerticalRect(n) : this.renderHorizontalRect(n);
          },
        },
        {
          key: "renderAreaStatically",
          value: function (n, i, a, o) {
            var u = this.props,
              c = u.layout,
              s = u.type,
              l = u.stroke,
              f = u.connectNulls,
              p = u.isRange;
            u.ref;
            var d = yO(u, o2);
            return S.createElement(
              ie,
              { clipPath: a ? "url(#clipPath-".concat(o, ")") : null },
              S.createElement(
                or,
                nr({}, V(d, !0), {
                  points: n,
                  connectNulls: f,
                  type: s,
                  baseLine: i,
                  layout: c,
                  stroke: "none",
                  className: "recharts-area-area",
                }),
              ),
              l !== "none" &&
                S.createElement(
                  or,
                  nr({}, V(this.props, !1), {
                    className: "recharts-area-curve",
                    layout: c,
                    type: s,
                    connectNulls: f,
                    fill: "none",
                    points: n,
                  }),
                ),
              l !== "none" &&
                p &&
                S.createElement(
                  or,
                  nr({}, V(this.props, !1), {
                    className: "recharts-area-curve",
                    layout: c,
                    type: s,
                    connectNulls: f,
                    fill: "none",
                    points: i,
                  }),
                ),
            );
          },
        },
        {
          key: "renderAreaWithAnimation",
          value: function (n, i) {
            var a = this,
              o = this.props,
              u = o.points,
              c = o.baseLine,
              s = o.isAnimationActive,
              l = o.animationBegin,
              f = o.animationDuration,
              p = o.animationEasing,
              d = o.animationId,
              y = this.state,
              v = y.prevPoints,
              h = y.prevBaseLine;
            return S.createElement(
              ct,
              {
                begin: l,
                duration: f,
                isActive: s,
                easing: p,
                from: { t: 0 },
                to: { t: 1 },
                key: "area-".concat(d),
                onAnimationEnd: this.handleAnimationEnd,
                onAnimationStart: this.handleAnimationStart,
              },
              function (g) {
                var x = g.t;
                if (v) {
                  var w = v.length / u.length,
                    O = u.map(function (A, T) {
                      var $ = Math.floor(T * w);
                      if (v[$]) {
                        var j = v[$],
                          E = Ee(j.x, A.x),
                          C = Ee(j.y, A.y);
                        return It(It({}, A), {}, { x: E(x), y: C(x) });
                      }
                      return A;
                    }),
                    m;
                  if (B(c) && typeof c == "number") {
                    var b = Ee(h, c);
                    m = b(x);
                  } else if (J(c) || sn(c)) {
                    var _ = Ee(h, 0);
                    m = _(x);
                  } else
                    m = c.map(function (A, T) {
                      var $ = Math.floor(T * w);
                      if (h[$]) {
                        var j = h[$],
                          E = Ee(j.x, A.x),
                          C = Ee(j.y, A.y);
                        return It(It({}, A), {}, { x: E(x), y: C(x) });
                      }
                      return A;
                    });
                  return a.renderAreaStatically(O, m, n, i);
                }
                return S.createElement(
                  ie,
                  null,
                  S.createElement(
                    "defs",
                    null,
                    S.createElement(
                      "clipPath",
                      { id: "animationClipPath-".concat(i) },
                      a.renderClipRect(x),
                    ),
                  ),
                  S.createElement(
                    ie,
                    { clipPath: "url(#animationClipPath-".concat(i, ")") },
                    a.renderAreaStatically(u, c, n, i),
                  ),
                );
              },
            );
          },
        },
        {
          key: "renderArea",
          value: function (n, i) {
            var a = this.props,
              o = a.points,
              u = a.baseLine,
              c = a.isAnimationActive,
              s = this.state,
              l = s.prevPoints,
              f = s.prevBaseLine,
              p = s.totalLength;
            return c && o && o.length && ((!l && p > 0) || !lr(l, o) || !lr(f, u))
              ? this.renderAreaWithAnimation(n, i)
              : this.renderAreaStatically(o, u, n, i);
          },
        },
        {
          key: "render",
          value: function () {
            var n,
              i = this.props,
              a = i.hide,
              o = i.dot,
              u = i.points,
              c = i.className,
              s = i.top,
              l = i.left,
              f = i.xAxis,
              p = i.yAxis,
              d = i.width,
              y = i.height,
              v = i.isAnimationActive,
              h = i.id;
            if (a || !u || !u.length) return null;
            var g = this.state.isAnimationFinished,
              x = u.length === 1,
              w = te("recharts-area", c),
              O = f && f.allowDataOverflow,
              m = p && p.allowDataOverflow,
              b = O || m,
              _ = J(h) ? this.id : h,
              A = (n = V(o, !1)) !== null && n !== void 0 ? n : { r: 3, strokeWidth: 2 },
              T = A.r,
              $ = T === void 0 ? 3 : T,
              j = A.strokeWidth,
              E = j === void 0 ? 2 : j,
              C = y0(o) ? o : {},
              I = C.clipDot,
              R = I === void 0 ? !0 : I,
              k = $ * 2 + E;
            return S.createElement(
              ie,
              { className: w },
              O || m
                ? S.createElement(
                    "defs",
                    null,
                    S.createElement(
                      "clipPath",
                      { id: "clipPath-".concat(_) },
                      S.createElement("rect", {
                        x: O ? l : l - d / 2,
                        y: m ? s : s - y / 2,
                        width: O ? d : d * 2,
                        height: m ? y : y * 2,
                      }),
                    ),
                    !R &&
                      S.createElement(
                        "clipPath",
                        { id: "clipPath-dots-".concat(_) },
                        S.createElement("rect", {
                          x: l - k / 2,
                          y: s - k / 2,
                          width: d + k,
                          height: y + k,
                        }),
                      ),
                  )
                : null,
              x ? null : this.renderArea(b, _),
              (o || x) && this.renderDots(b, R, _),
              (!v || g) && ht.renderCallByParent(this.props, u),
            );
          },
        },
      ],
      [
        {
          key: "getDerivedStateFromProps",
          value: function (n, i) {
            return n.animationId !== i.prevAnimationId
              ? {
                  prevAnimationId: n.animationId,
                  curPoints: n.points,
                  curBaseLine: n.baseLine,
                  prevPoints: i.curPoints,
                  prevBaseLine: i.curBaseLine,
                }
              : n.points !== i.curPoints || n.baseLine !== i.curBaseLine
                ? { curPoints: n.points, curBaseLine: n.baseLine }
                : null;
          },
        },
      ],
    )
  );
})(L.PureComponent);
vO = br;
ft(br, "displayName", "Area");
ft(br, "defaultProps", {
  stroke: "#3182bd",
  fill: "#3182bd",
  fillOpacity: 0.6,
  xAxisId: 0,
  yAxisId: 0,
  legendType: "line",
  connectNulls: !1,
  points: [],
  dot: !1,
  activeDot: !0,
  hide: !1,
  isAnimationActive: !Bt.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
});
ft(br, "getBaseValue", function (e, t, r, n) {
  var i = e.layout,
    a = e.baseValue,
    o = t.props.baseValue,
    u = o ?? a;
  if (B(u) && typeof u == "number") return u;
  var c = i === "horizontal" ? n : r,
    s = c.scale.domain();
  if (c.type === "number") {
    var l = Math.max(s[0], s[1]),
      f = Math.min(s[0], s[1]);
    return u === "dataMin" ? f : u === "dataMax" || l < 0 ? l : Math.max(Math.min(s[0], s[1]), 0);
  }
  return u === "dataMin" ? s[0] : u === "dataMax" ? s[1] : s[0];
});
ft(br, "getComposedData", function (e) {
  var t = e.props,
    r = e.item,
    n = e.xAxis,
    i = e.yAxis,
    a = e.xAxisTicks,
    o = e.yAxisTicks,
    u = e.bandSize,
    c = e.dataKey,
    s = e.stackedData,
    l = e.dataStartIndex,
    f = e.displayedData,
    p = e.offset,
    d = t.layout,
    y = s && s.length,
    v = vO.getBaseValue(t, r, n, i),
    h = d === "horizontal",
    g = !1,
    x = f.map(function (O, m) {
      var b;
      y ? (b = s[l + m]) : ((b = we(O, c)), Array.isArray(b) ? (g = !0) : (b = [v, b]));
      var _ = b[1] == null || (y && we(O, c) == null);
      return h
        ? {
            x: da({ axis: n, ticks: a, bandSize: u, entry: O, index: m }),
            y: _ ? null : i.scale(b[1]),
            value: b,
            payload: O,
          }
        : {
            x: _ ? null : n.scale(b[1]),
            y: da({ axis: i, ticks: o, bandSize: u, entry: O, index: m }),
            value: b,
            payload: O,
          };
    }),
    w;
  return (
    y || g
      ? (w = x.map(function (O) {
          var m = Array.isArray(O.value) ? O.value[0] : null;
          return h
            ? { x: O.x, y: m != null && O.y != null ? i.scale(m) : null }
            : { x: m != null ? n.scale(m) : null, y: O.y };
        }))
      : (w = h ? i.scale(v) : n.scale(v)),
    It({ points: x, baseLine: w, layout: d, isRange: g }, p)
  );
});
ft(br, "renderDotItem", function (e, t) {
  var r;
  if (S.isValidElement(e)) r = S.cloneElement(e, t);
  else if (Z(e)) r = e(t);
  else {
    var n = te("recharts-area-dot", typeof e != "boolean" ? e.className : ""),
      i = t.key,
      a = yO(t, u2);
    r = S.createElement(_i, nr({}, a, { key: i, className: n }));
  }
  return r;
});
function rn(e) {
  "@babel/helpers - typeof";
  return (
    (rn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    rn(e)
  );
}
function y2(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function m2(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, wO(n.key), n));
  }
}
function g2(e, t, r) {
  return (t && m2(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function b2(e, t, r) {
  return (
    (t = Ba(t)),
    x2(e, bO() ? Reflect.construct(t, r || [], Ba(e).constructor) : t.apply(e, r))
  );
}
function x2(e, t) {
  if (t && (rn(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return w2(e);
}
function w2(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function bO() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (bO = function () {
    return !!e;
  })();
}
function Ba(e) {
  return (
    (Ba = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Ba(e)
  );
}
function O2(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Hf(e, t));
}
function Hf(e, t) {
  return (
    (Hf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Hf(e, t)
  );
}
function xO(e, t, r) {
  return (
    (t = wO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function wO(e) {
  var t = _2(e, "string");
  return rn(t) == "symbol" ? t : t + "";
}
function _2(e, t) {
  if (rn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (rn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function Kf() {
  return (
    (Kf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Kf.apply(this, arguments)
  );
}
function A2(e) {
  var t = e.xAxisId,
    r = Qp(),
    n = eh(),
    i = tO(t);
  return i == null
    ? null
    : L.createElement(
        vn,
        Kf({}, i, {
          className: te("recharts-".concat(i.axisType, " ").concat(i.axisType), i.className),
          viewBox: { x: 0, y: 0, width: r, height: n },
          ticksGenerator: function (o) {
            return _t(o, !0);
          },
        }),
      );
}
var Ai = (function (e) {
  function t() {
    return (y2(this, t), b2(this, t, arguments));
  }
  return (
    O2(t, e),
    g2(t, [
      {
        key: "render",
        value: function () {
          return L.createElement(A2, this.props);
        },
      },
    ])
  );
})(L.Component);
xO(Ai, "displayName", "XAxis");
xO(Ai, "defaultProps", {
  allowDecimals: !0,
  hide: !1,
  orientation: "bottom",
  width: 0,
  height: 30,
  mirror: !1,
  xAxisId: 0,
  tickCount: 5,
  type: "category",
  padding: { left: 0, right: 0 },
  allowDataOverflow: !1,
  scale: "auto",
  reversed: !1,
  allowDuplicatedCategory: !0,
});
function nn(e) {
  "@babel/helpers - typeof";
  return (
    (nn =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    nn(e)
  );
}
function S2(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function P2(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, AO(n.key), n));
  }
}
function T2(e, t, r) {
  return (t && P2(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function E2(e, t, r) {
  return (
    (t = Fa(t)),
    j2(e, OO() ? Reflect.construct(t, r || [], Fa(e).constructor) : t.apply(e, r))
  );
}
function j2(e, t) {
  if (t && (nn(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return $2(e);
}
function $2(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function OO() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (OO = function () {
    return !!e;
  })();
}
function Fa(e) {
  return (
    (Fa = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Fa(e)
  );
}
function M2(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Gf(e, t));
}
function Gf(e, t) {
  return (
    (Gf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Gf(e, t)
  );
}
function _O(e, t, r) {
  return (
    (t = AO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function AO(e) {
  var t = C2(e, "string");
  return nn(t) == "symbol" ? t : t + "";
}
function C2(e, t) {
  if (nn(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (nn(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function Vf() {
  return (
    (Vf = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    Vf.apply(this, arguments)
  );
}
var I2 = function (t) {
    var r = t.yAxisId,
      n = Qp(),
      i = eh(),
      a = rO(r);
    return a == null
      ? null
      : L.createElement(
          vn,
          Vf({}, a, {
            className: te("recharts-".concat(a.axisType, " ").concat(a.axisType), a.className),
            viewBox: { x: 0, y: 0, width: n, height: i },
            ticksGenerator: function (u) {
              return _t(u, !0);
            },
          }),
        );
  },
  Si = (function (e) {
    function t() {
      return (S2(this, t), E2(this, t, arguments));
    }
    return (
      M2(t, e),
      T2(t, [
        {
          key: "render",
          value: function () {
            return L.createElement(I2, this.props);
          },
        },
      ])
    );
  })(L.Component);
_O(Si, "displayName", "YAxis");
_O(Si, "defaultProps", {
  allowDuplicatedCategory: !0,
  allowDecimals: !0,
  hide: !1,
  orientation: "left",
  width: 60,
  height: 0,
  mirror: !1,
  yAxisId: 0,
  tickCount: 5,
  type: "number",
  padding: { top: 0, bottom: 0 },
  allowDataOverflow: !1,
  scale: "auto",
  reversed: !1,
});
function Jb(e) {
  return N2(e) || D2(e) || k2(e) || R2();
}
function R2() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function k2(e, t) {
  if (e) {
    if (typeof e == "string") return Xf(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Xf(e, t);
  }
}
function D2(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function N2(e) {
  if (Array.isArray(e)) return Xf(e);
}
function Xf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
var Yf = function (t, r, n, i, a) {
    var o = Xe(t, rh),
      u = Xe(t, xo),
      c = [].concat(Jb(o), Jb(u)),
      s = Xe(t, Oo),
      l = "".concat(i, "Id"),
      f = i[0],
      p = r;
    if (
      (c.length &&
        (p = c.reduce(function (v, h) {
          if (h.props[l] === n && dt(h.props, "extendDomain") && B(h.props[f])) {
            var g = h.props[f];
            return [Math.min(v[0], g), Math.max(v[1], g)];
          }
          return v;
        }, p)),
      s.length)
    ) {
      var d = "".concat(f, "1"),
        y = "".concat(f, "2");
      p = s.reduce(function (v, h) {
        if (h.props[l] === n && dt(h.props, "extendDomain") && B(h.props[d]) && B(h.props[y])) {
          var g = h.props[d],
            x = h.props[y];
          return [Math.min(v[0], g, x), Math.max(v[1], g, x)];
        }
        return v;
      }, p);
    }
    return (
      a &&
        a.length &&
        (p = a.reduce(function (v, h) {
          return B(h) ? [Math.min(v[0], h), Math.max(v[1], h)] : v;
        }, p)),
      p
    );
  },
  Tl = { exports: {} },
  Qb;
function q2() {
  return (
    Qb ||
      ((Qb = 1),
      (function (e) {
        var t = Object.prototype.hasOwnProperty,
          r = "~";
        function n() {}
        Object.create && ((n.prototype = Object.create(null)), new n().__proto__ || (r = !1));
        function i(c, s, l) {
          ((this.fn = c), (this.context = s), (this.once = l || !1));
        }
        function a(c, s, l, f, p) {
          if (typeof l != "function") throw new TypeError("The listener must be a function");
          var d = new i(l, f || c, p),
            y = r ? r + s : s;
          return (
            c._events[y]
              ? c._events[y].fn
                ? (c._events[y] = [c._events[y], d])
                : c._events[y].push(d)
              : ((c._events[y] = d), c._eventsCount++),
            c
          );
        }
        function o(c, s) {
          --c._eventsCount === 0 ? (c._events = new n()) : delete c._events[s];
        }
        function u() {
          ((this._events = new n()), (this._eventsCount = 0));
        }
        ((u.prototype.eventNames = function () {
          var s = [],
            l,
            f;
          if (this._eventsCount === 0) return s;
          for (f in (l = this._events)) t.call(l, f) && s.push(r ? f.slice(1) : f);
          return Object.getOwnPropertySymbols ? s.concat(Object.getOwnPropertySymbols(l)) : s;
        }),
          (u.prototype.listeners = function (s) {
            var l = r ? r + s : s,
              f = this._events[l];
            if (!f) return [];
            if (f.fn) return [f.fn];
            for (var p = 0, d = f.length, y = new Array(d); p < d; p++) y[p] = f[p].fn;
            return y;
          }),
          (u.prototype.listenerCount = function (s) {
            var l = r ? r + s : s,
              f = this._events[l];
            return f ? (f.fn ? 1 : f.length) : 0;
          }),
          (u.prototype.emit = function (s, l, f, p, d, y) {
            var v = r ? r + s : s;
            if (!this._events[v]) return !1;
            var h = this._events[v],
              g = arguments.length,
              x,
              w;
            if (h.fn) {
              switch ((h.once && this.removeListener(s, h.fn, void 0, !0), g)) {
                case 1:
                  return (h.fn.call(h.context), !0);
                case 2:
                  return (h.fn.call(h.context, l), !0);
                case 3:
                  return (h.fn.call(h.context, l, f), !0);
                case 4:
                  return (h.fn.call(h.context, l, f, p), !0);
                case 5:
                  return (h.fn.call(h.context, l, f, p, d), !0);
                case 6:
                  return (h.fn.call(h.context, l, f, p, d, y), !0);
              }
              for (w = 1, x = new Array(g - 1); w < g; w++) x[w - 1] = arguments[w];
              h.fn.apply(h.context, x);
            } else {
              var O = h.length,
                m;
              for (w = 0; w < O; w++)
                switch ((h[w].once && this.removeListener(s, h[w].fn, void 0, !0), g)) {
                  case 1:
                    h[w].fn.call(h[w].context);
                    break;
                  case 2:
                    h[w].fn.call(h[w].context, l);
                    break;
                  case 3:
                    h[w].fn.call(h[w].context, l, f);
                    break;
                  case 4:
                    h[w].fn.call(h[w].context, l, f, p);
                    break;
                  default:
                    if (!x) for (m = 1, x = new Array(g - 1); m < g; m++) x[m - 1] = arguments[m];
                    h[w].fn.apply(h[w].context, x);
                }
            }
            return !0;
          }),
          (u.prototype.on = function (s, l, f) {
            return a(this, s, l, f, !1);
          }),
          (u.prototype.once = function (s, l, f) {
            return a(this, s, l, f, !0);
          }),
          (u.prototype.removeListener = function (s, l, f, p) {
            var d = r ? r + s : s;
            if (!this._events[d]) return this;
            if (!l) return (o(this, d), this);
            var y = this._events[d];
            if (y.fn) y.fn === l && (!p || y.once) && (!f || y.context === f) && o(this, d);
            else {
              for (var v = 0, h = [], g = y.length; v < g; v++)
                (y[v].fn !== l || (p && !y[v].once) || (f && y[v].context !== f)) && h.push(y[v]);
              h.length ? (this._events[d] = h.length === 1 ? h[0] : h) : o(this, d);
            }
            return this;
          }),
          (u.prototype.removeAllListeners = function (s) {
            var l;
            return (
              s
                ? ((l = r ? r + s : s), this._events[l] && o(this, l))
                : ((this._events = new n()), (this._eventsCount = 0)),
              this
            );
          }),
          (u.prototype.off = u.prototype.removeListener),
          (u.prototype.addListener = u.prototype.on),
          (u.prefixed = r),
          (u.EventEmitter = u),
          (e.exports = u));
      })(Tl)),
    Tl.exports
  );
}
var L2 = q2();
const B2 = le(L2);
var El = new B2(),
  jl = "recharts.syncMouseEvents";
function di(e) {
  "@babel/helpers - typeof";
  return (
    (di =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    di(e)
  );
}
function F2(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function U2(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, SO(n.key), n));
  }
}
function W2(e, t, r) {
  return (t && U2(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function $l(e, t, r) {
  return (
    (t = SO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function SO(e) {
  var t = z2(e, "string");
  return di(t) == "symbol" ? t : t + "";
}
function z2(e, t) {
  if (di(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (di(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
var H2 = (function () {
  function e() {
    (F2(this, e),
      $l(this, "activeIndex", 0),
      $l(this, "coordinateList", []),
      $l(this, "layout", "horizontal"));
  }
  return W2(e, [
    {
      key: "setDetails",
      value: function (r) {
        var n,
          i = r.coordinateList,
          a = i === void 0 ? null : i,
          o = r.container,
          u = o === void 0 ? null : o,
          c = r.layout,
          s = c === void 0 ? null : c,
          l = r.offset,
          f = l === void 0 ? null : l,
          p = r.mouseHandlerCallback,
          d = p === void 0 ? null : p;
        ((this.coordinateList = (n = a ?? this.coordinateList) !== null && n !== void 0 ? n : []),
          (this.container = u ?? this.container),
          (this.layout = s ?? this.layout),
          (this.offset = f ?? this.offset),
          (this.mouseHandlerCallback = d ?? this.mouseHandlerCallback),
          (this.activeIndex = Math.min(
            Math.max(this.activeIndex, 0),
            this.coordinateList.length - 1,
          )));
      },
    },
    {
      key: "focus",
      value: function () {
        this.spoofMouse();
      },
    },
    {
      key: "keyboardEvent",
      value: function (r) {
        if (this.coordinateList.length !== 0)
          switch (r.key) {
            case "ArrowRight": {
              if (this.layout !== "horizontal") return;
              ((this.activeIndex = Math.min(this.activeIndex + 1, this.coordinateList.length - 1)),
                this.spoofMouse());
              break;
            }
            case "ArrowLeft": {
              if (this.layout !== "horizontal") return;
              ((this.activeIndex = Math.max(this.activeIndex - 1, 0)), this.spoofMouse());
              break;
            }
          }
      },
    },
    {
      key: "setIndex",
      value: function (r) {
        this.activeIndex = r;
      },
    },
    {
      key: "spoofMouse",
      value: function () {
        var r, n;
        if (this.layout === "horizontal" && this.coordinateList.length !== 0) {
          var i = this.container.getBoundingClientRect(),
            a = i.x,
            o = i.y,
            u = i.height,
            c = this.coordinateList[this.activeIndex].coordinate,
            s = ((r = window) === null || r === void 0 ? void 0 : r.scrollX) || 0,
            l = ((n = window) === null || n === void 0 ? void 0 : n.scrollY) || 0,
            f = a + c + s,
            p = o + this.offset.top + u / 2 + l;
          this.mouseHandlerCallback({ pageX: f, pageY: p });
        }
      },
    },
  ]);
})();
function K2(e, t, r) {
  if (r === "number" && t === !0 && Array.isArray(e)) {
    var n = e?.[0],
      i = e?.[1];
    if (n && i && B(n) && B(i)) return !0;
  }
  return !1;
}
function G2(e, t, r, n) {
  var i = n / 2;
  return {
    stroke: "none",
    fill: "#ccc",
    x: e === "horizontal" ? t.x - i : r.left + 0.5,
    y: e === "horizontal" ? r.top + 0.5 : t.y - i,
    width: e === "horizontal" ? n : r.width - 1,
    height: e === "horizontal" ? r.height - 1 : n,
  };
}
function PO(e) {
  var t = e.cx,
    r = e.cy,
    n = e.radius,
    i = e.startAngle,
    a = e.endAngle,
    o = ve(t, r, n, i),
    u = ve(t, r, n, a);
  return { points: [o, u], cx: t, cy: r, radius: n, startAngle: i, endAngle: a };
}
function V2(e, t, r) {
  var n, i, a, o;
  if (e === "horizontal") ((n = t.x), (a = n), (i = r.top), (o = r.top + r.height));
  else if (e === "vertical") ((i = t.y), (o = i), (n = r.left), (a = r.left + r.width));
  else if (t.cx != null && t.cy != null)
    if (e === "centric") {
      var u = t.cx,
        c = t.cy,
        s = t.innerRadius,
        l = t.outerRadius,
        f = t.angle,
        p = ve(u, c, s, f),
        d = ve(u, c, l, f);
      ((n = p.x), (i = p.y), (a = d.x), (o = d.y));
    } else return PO(t);
  return [
    { x: n, y: i },
    { x: a, y: o },
  ];
}
function vi(e) {
  "@babel/helpers - typeof";
  return (
    (vi =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    vi(e)
  );
}
function e0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function Li(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? e0(Object(r), !0).forEach(function (n) {
          X2(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : e0(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function X2(e, t, r) {
  return (
    (t = Y2(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function Y2(e) {
  var t = Z2(e, "string");
  return vi(t) == "symbol" ? t : t + "";
}
function Z2(e, t) {
  if (vi(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (vi(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function J2(e) {
  var t,
    r,
    n = e.element,
    i = e.tooltipEventType,
    a = e.isActive,
    o = e.activeCoordinate,
    u = e.activePayload,
    c = e.offset,
    s = e.activeTooltipIndex,
    l = e.tooltipAxisBandSize,
    f = e.layout,
    p = e.chartName,
    d =
      (t = n.props.cursor) !== null && t !== void 0
        ? t
        : (r = n.type.defaultProps) === null || r === void 0
          ? void 0
          : r.cursor;
  if (!n || !d || !a || !o || (p !== "ScatterChart" && i !== "axis")) return null;
  var y,
    v = or;
  if (p === "ScatterChart") ((y = o), (v = sR));
  else if (p === "BarChart") ((y = G2(f, o, c, l)), (v = Vp));
  else if (f === "radial") {
    var h = PO(o),
      g = h.cx,
      x = h.cy,
      w = h.radius,
      O = h.startAngle,
      m = h.endAngle;
    ((y = { cx: g, cy: x, startAngle: O, endAngle: m, innerRadius: w, outerRadius: w }), (v = Aw));
  } else ((y = { points: V2(f, o, c) }), (v = or));
  var b = Li(
    Li(Li(Li({ stroke: "#ccc", pointerEvents: "none" }, c), y), V(d, !1)),
    {},
    { payload: u, payloadIndex: s, className: te("recharts-tooltip-cursor", d.className) },
  );
  return L.isValidElement(d) ? L.cloneElement(d, b) : L.createElement(v, b);
}
var Q2 = ["item"],
  eq = ["children", "className", "width", "height", "style", "compact", "title", "desc"];
function an(e) {
  "@babel/helpers - typeof";
  return (
    (an =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          }),
    an(e)
  );
}
function jr() {
  return (
    (jr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    jr.apply(this, arguments)
  );
}
function t0(e, t) {
  return nq(e) || rq(e, t) || EO(e, t) || tq();
}
function tq() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function rq(e, t) {
  var r = e == null ? null : (typeof Symbol < "u" && e[Symbol.iterator]) || e["@@iterator"];
  if (r != null) {
    var n,
      i,
      a,
      o,
      u = [],
      c = !0,
      s = !1;
    try {
      if (((a = (r = r.call(e)).next), t !== 0))
        for (; !(c = (n = a.call(r)).done) && (u.push(n.value), u.length !== t); c = !0);
    } catch (l) {
      ((s = !0), (i = l));
    } finally {
      try {
        if (!c && r.return != null && ((o = r.return()), Object(o) !== o)) return;
      } finally {
        if (s) throw i;
      }
    }
    return u;
  }
}
function nq(e) {
  if (Array.isArray(e)) return e;
}
function r0(e, t) {
  if (e == null) return {};
  var r = iq(e, t),
    n,
    i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++)
      ((n = a[i]),
        !(t.indexOf(n) >= 0) && Object.prototype.propertyIsEnumerable.call(e, n) && (r[n] = e[n]));
  }
  return r;
}
function iq(e, t) {
  if (e == null) return {};
  var r = {};
  for (var n in e)
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      if (t.indexOf(n) >= 0) continue;
      r[n] = e[n];
    }
  return r;
}
function aq(e, t) {
  if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}
function oq(e, t) {
  for (var r = 0; r < t.length; r++) {
    var n = t[r];
    ((n.enumerable = n.enumerable || !1),
      (n.configurable = !0),
      "value" in n && (n.writable = !0),
      Object.defineProperty(e, jO(n.key), n));
  }
}
function uq(e, t, r) {
  return (t && oq(e.prototype, t), Object.defineProperty(e, "prototype", { writable: !1 }), e);
}
function cq(e, t, r) {
  return (
    (t = Ua(t)),
    sq(e, TO() ? Reflect.construct(t, r || [], Ua(e).constructor) : t.apply(e, r))
  );
}
function sq(e, t) {
  if (t && (an(t) === "object" || typeof t == "function")) return t;
  if (t !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
  return lq(e);
}
function lq(e) {
  if (e === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function TO() {
  try {
    var e = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch {}
  return (TO = function () {
    return !!e;
  })();
}
function Ua(e) {
  return (
    (Ua = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (r) {
          return r.__proto__ || Object.getPrototypeOf(r);
        }),
    Ua(e)
  );
}
function fq(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Super expression must either be null or a function");
  ((e.prototype = Object.create(t && t.prototype, {
    constructor: { value: e, writable: !0, configurable: !0 },
  })),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    t && Zf(e, t));
}
function Zf(e, t) {
  return (
    (Zf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (n, i) {
          return ((n.__proto__ = i), n);
        }),
    Zf(e, t)
  );
}
function on(e) {
  return dq(e) || hq(e) || EO(e) || pq();
}
function pq() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function EO(e, t) {
  if (e) {
    if (typeof e == "string") return Jf(e, t);
    var r = Object.prototype.toString.call(e).slice(8, -1);
    if ((r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set"))
      return Array.from(e);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return Jf(e, t);
  }
}
function hq(e) {
  if ((typeof Symbol < "u" && e[Symbol.iterator] != null) || e["@@iterator"] != null)
    return Array.from(e);
}
function dq(e) {
  if (Array.isArray(e)) return Jf(e);
}
function Jf(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
  return n;
}
function n0(e, t) {
  var r = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    (t &&
      (n = n.filter(function (i) {
        return Object.getOwnPropertyDescriptor(e, i).enumerable;
      })),
      r.push.apply(r, n));
  }
  return r;
}
function D(e) {
  for (var t = 1; t < arguments.length; t++) {
    var r = arguments[t] != null ? arguments[t] : {};
    t % 2
      ? n0(Object(r), !0).forEach(function (n) {
          Y(e, n, r[n]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : n0(Object(r)).forEach(function (n) {
            Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(r, n));
          });
  }
  return e;
}
function Y(e, t, r) {
  return (
    (t = jO(t)),
    t in e
      ? Object.defineProperty(e, t, { value: r, enumerable: !0, configurable: !0, writable: !0 })
      : (e[t] = r),
    e
  );
}
function jO(e) {
  var t = vq(e, "string");
  return an(t) == "symbol" ? t : t + "";
}
function vq(e, t) {
  if (an(e) != "object" || !e) return e;
  var r = e[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(e, t);
    if (an(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var yq = { xAxis: ["bottom", "top"], yAxis: ["left", "right"] },
  mq = { width: "100%", height: "100%" },
  $O = { x: 0, y: 0 };
function Bi(e) {
  return e;
}
var gq = function (t, r) {
    return r === "horizontal" ? t.x : r === "vertical" ? t.y : r === "centric" ? t.angle : t.radius;
  },
  bq = function (t, r, n, i) {
    var a = r.find(function (l) {
      return l && l.index === n;
    });
    if (a) {
      if (t === "horizontal") return { x: a.coordinate, y: i.y };
      if (t === "vertical") return { x: i.x, y: a.coordinate };
      if (t === "centric") {
        var o = a.coordinate,
          u = i.radius;
        return D(D(D({}, i), ve(i.cx, i.cy, u, o)), {}, { angle: o, radius: u });
      }
      var c = a.coordinate,
        s = i.angle;
      return D(D(D({}, i), ve(i.cx, i.cy, c, s)), {}, { angle: s, radius: c });
    }
    return $O;
  },
  Ao = function (t, r) {
    var n = r.graphicalItems,
      i = r.dataStartIndex,
      a = r.dataEndIndex,
      o = (n ?? []).reduce(function (u, c) {
        var s = c.props.data;
        return s && s.length ? [].concat(on(u), on(s)) : u;
      }, []);
    return o.length > 0 ? o : t && t.length && B(i) && B(a) ? t.slice(i, a + 1) : [];
  };
function MO(e) {
  return e === "number" ? [0, "auto"] : void 0;
}
var Qf = function (t, r, n, i) {
    var a = t.graphicalItems,
      o = t.tooltipAxis,
      u = Ao(r, t);
    return n < 0 || !a || !a.length || n >= u.length
      ? null
      : a.reduce(function (c, s) {
          var l,
            f = (l = s.props.data) !== null && l !== void 0 ? l : r;
          f &&
            t.dataStartIndex + t.dataEndIndex !== 0 &&
            t.dataEndIndex - t.dataStartIndex >= n &&
            (f = f.slice(t.dataStartIndex, t.dataEndIndex + 1));
          var p;
          if (o.dataKey && !o.allowDuplicatedCategory) {
            var d = f === void 0 ? u : f;
            p = Ui(d, o.dataKey, i);
          } else p = (f && f[n]) || u[n];
          return p ? [].concat(on(c), [gw(s, p)]) : c;
        }, []);
  },
  i0 = function (t, r, n, i) {
    var a = i || { x: t.chartX, y: t.chartY },
      o = gq(a, n),
      u = t.orderedTooltipTicks,
      c = t.tooltipAxis,
      s = t.tooltipTicks,
      l = $$(o, u, s, c);
    if (l >= 0 && s) {
      var f = s[l] && s[l].value,
        p = Qf(t, r, l, f),
        d = bq(n, u, l, a);
      return { activeTooltipIndex: l, activeLabel: f, activePayload: p, activeCoordinate: d };
    }
    return null;
  },
  xq = function (t, r) {
    var n = r.axes,
      i = r.graphicalItems,
      a = r.axisType,
      o = r.axisIdKey,
      u = r.stackGroups,
      c = r.dataStartIndex,
      s = r.dataEndIndex,
      l = t.layout,
      f = t.children,
      p = t.stackOffset,
      d = pw(l, a);
    return n.reduce(function (y, v) {
      var h,
        g = v.type.defaultProps !== void 0 ? D(D({}, v.type.defaultProps), v.props) : v.props,
        x = g.type,
        w = g.dataKey,
        O = g.allowDataOverflow,
        m = g.allowDuplicatedCategory,
        b = g.scale,
        _ = g.ticks,
        A = g.includeHidden,
        T = g[o];
      if (y[T]) return y;
      var $ = Ao(t.data, {
          graphicalItems: i.filter(function (M) {
            var F,
              H =
                o in M.props
                  ? M.props[o]
                  : (F = M.type.defaultProps) === null || F === void 0
                    ? void 0
                    : F[o];
            return H === T;
          }),
          dataStartIndex: c,
          dataEndIndex: s,
        }),
        j = $.length,
        E,
        C,
        I;
      K2(g.domain, O, x) &&
        ((E = pf(g.domain, null, O)),
        d && (x === "number" || b !== "auto") && (I = $n($, w, "category")));
      var R = MO(x);
      if (!E || E.length === 0) {
        var k,
          N = (k = g.domain) !== null && k !== void 0 ? k : R;
        if (w) {
          if (((E = $n($, w, x)), x === "category" && d)) {
            var W = A_(E);
            m && W
              ? ((C = E), (E = Ea(0, j)))
              : m ||
                (E = ig(N, E, v).reduce(function (M, F) {
                  return M.indexOf(F) >= 0 ? M : [].concat(on(M), [F]);
                }, []));
          } else if (x === "category")
            m
              ? (E = E.filter(function (M) {
                  return M !== "" && !J(M);
                }))
              : (E = ig(N, E, v).reduce(function (M, F) {
                  return M.indexOf(F) >= 0 || F === "" || J(F) ? M : [].concat(on(M), [F]);
                }, []));
          else if (x === "number") {
            var z = k$(
              $,
              i.filter(function (M) {
                var F,
                  H,
                  X =
                    o in M.props
                      ? M.props[o]
                      : (F = M.type.defaultProps) === null || F === void 0
                        ? void 0
                        : F[o],
                  re =
                    "hide" in M.props
                      ? M.props.hide
                      : (H = M.type.defaultProps) === null || H === void 0
                        ? void 0
                        : H.hide;
                return X === T && (A || !re);
              }),
              w,
              a,
              l,
            );
            z && (E = z);
          }
          d && (x === "number" || b !== "auto") && (I = $n($, w, "category"));
        } else
          d
            ? (E = Ea(0, j))
            : u && u[T] && u[T].hasStack && x === "number"
              ? (E = p === "expand" ? [0, 1] : mw(u[T].stackGroups, c, s))
              : (E = fw(
                  $,
                  i.filter(function (M) {
                    var F = o in M.props ? M.props[o] : M.type.defaultProps[o],
                      H = "hide" in M.props ? M.props.hide : M.type.defaultProps.hide;
                    return F === T && (A || !H);
                  }),
                  x,
                  l,
                  !0,
                ));
        if (x === "number") ((E = Yf(f, E, T, a, _)), N && (E = pf(N, E, O)));
        else if (x === "category" && N) {
          var K = N,
            P = E.every(function (M) {
              return K.indexOf(M) >= 0;
            });
          P && (E = K);
        }
      }
      return D(
        D({}, y),
        {},
        Y(
          {},
          T,
          D(
            D({}, g),
            {},
            {
              axisType: a,
              domain: E,
              categoricalDomain: I,
              duplicateDomain: C,
              originalDomain: (h = g.domain) !== null && h !== void 0 ? h : R,
              isCategorical: d,
              layout: l,
            },
          ),
        ),
      );
    }, {});
  },
  wq = function (t, r) {
    var n = r.graphicalItems,
      i = r.Axis,
      a = r.axisType,
      o = r.axisIdKey,
      u = r.stackGroups,
      c = r.dataStartIndex,
      s = r.dataEndIndex,
      l = t.layout,
      f = t.children,
      p = Ao(t.data, { graphicalItems: n, dataStartIndex: c, dataEndIndex: s }),
      d = p.length,
      y = pw(l, a),
      v = -1;
    return n.reduce(function (h, g) {
      var x = g.type.defaultProps !== void 0 ? D(D({}, g.type.defaultProps), g.props) : g.props,
        w = x[o],
        O = MO("number");
      if (!h[w]) {
        v++;
        var m;
        return (
          y
            ? (m = Ea(0, d))
            : u && u[w] && u[w].hasStack
              ? ((m = mw(u[w].stackGroups, c, s)), (m = Yf(f, m, w, a)))
              : ((m = pf(
                  O,
                  fw(
                    p,
                    n.filter(function (b) {
                      var _,
                        A,
                        T =
                          o in b.props
                            ? b.props[o]
                            : (_ = b.type.defaultProps) === null || _ === void 0
                              ? void 0
                              : _[o],
                        $ =
                          "hide" in b.props
                            ? b.props.hide
                            : (A = b.type.defaultProps) === null || A === void 0
                              ? void 0
                              : A.hide;
                      return T === w && !$;
                    }),
                    "number",
                    l,
                  ),
                  i.defaultProps.allowDataOverflow,
                )),
                (m = Yf(f, m, w, a))),
          D(
            D({}, h),
            {},
            Y(
              {},
              w,
              D(
                D({ axisType: a }, i.defaultProps),
                {},
                {
                  hide: !0,
                  orientation: Ve(yq, "".concat(a, ".").concat(v % 2), null),
                  domain: m,
                  originalDomain: O,
                  isCategorical: y,
                  layout: l,
                },
              ),
            ),
          )
        );
      }
      return h;
    }, {});
  },
  Oq = function (t, r) {
    var n = r.axisType,
      i = n === void 0 ? "xAxis" : n,
      a = r.AxisComp,
      o = r.graphicalItems,
      u = r.stackGroups,
      c = r.dataStartIndex,
      s = r.dataEndIndex,
      l = t.children,
      f = "".concat(i, "Id"),
      p = Xe(l, a),
      d = {};
    return (
      p && p.length
        ? (d = xq(t, {
            axes: p,
            graphicalItems: o,
            axisType: i,
            axisIdKey: f,
            stackGroups: u,
            dataStartIndex: c,
            dataEndIndex: s,
          }))
        : o &&
          o.length &&
          (d = wq(t, {
            Axis: a,
            graphicalItems: o,
            axisType: i,
            axisIdKey: f,
            stackGroups: u,
            dataStartIndex: c,
            dataEndIndex: s,
          })),
      d
    );
  },
  _q = function (t) {
    var r = kt(t),
      n = _t(r, !1, !0);
    return {
      tooltipTicks: n,
      orderedTooltipTicks: xp(n, function (i) {
        return i.coordinate;
      }),
      tooltipAxis: r,
      tooltipAxisBandSize: va(r, n),
    };
  },
  a0 = function (t) {
    var r = t.children,
      n = t.defaultShowTooltip,
      i = Ke(r, Vr),
      a = 0,
      o = 0;
    return (
      t.data && t.data.length !== 0 && (o = t.data.length - 1),
      i &&
        i.props &&
        (i.props.startIndex >= 0 && (a = i.props.startIndex),
        i.props.endIndex >= 0 && (o = i.props.endIndex)),
      {
        chartX: 0,
        chartY: 0,
        dataStartIndex: a,
        dataEndIndex: o,
        activeTooltipIndex: -1,
        isTooltipActive: !!n,
      }
    );
  },
  Aq = function (t) {
    return !t || !t.length
      ? !1
      : t.some(function (r) {
          var n = At(r && r.type);
          return n && n.indexOf("Bar") >= 0;
        });
  },
  o0 = function (t) {
    return t === "horizontal"
      ? { numericAxisName: "yAxis", cateAxisName: "xAxis" }
      : t === "vertical"
        ? { numericAxisName: "xAxis", cateAxisName: "yAxis" }
        : t === "centric"
          ? { numericAxisName: "radiusAxis", cateAxisName: "angleAxis" }
          : { numericAxisName: "angleAxis", cateAxisName: "radiusAxis" };
  },
  Sq = function (t, r) {
    var n = t.props,
      i = t.graphicalItems,
      a = t.xAxisMap,
      o = a === void 0 ? {} : a,
      u = t.yAxisMap,
      c = u === void 0 ? {} : u,
      s = n.width,
      l = n.height,
      f = n.children,
      p = n.margin || {},
      d = Ke(f, Vr),
      y = Ke(f, Mr),
      v = Object.keys(c).reduce(
        function (m, b) {
          var _ = c[b],
            A = _.orientation;
          return !_.mirror && !_.hide ? D(D({}, m), {}, Y({}, A, m[A] + _.width)) : m;
        },
        { left: p.left || 0, right: p.right || 0 },
      ),
      h = Object.keys(o).reduce(
        function (m, b) {
          var _ = o[b],
            A = _.orientation;
          return !_.mirror && !_.hide
            ? D(D({}, m), {}, Y({}, A, Ve(m, "".concat(A)) + _.height))
            : m;
        },
        { top: p.top || 0, bottom: p.bottom || 0 },
      ),
      g = D(D({}, h), v),
      x = g.bottom;
    (d && (g.bottom += d.props.height || Vr.defaultProps.height), y && r && (g = I$(g, i, n, r)));
    var w = s - g.left - g.right,
      O = l - g.top - g.bottom;
    return D(D({ brushBottom: x }, g), {}, { width: Math.max(w, 0), height: Math.max(O, 0) });
  },
  Pq = function (t, r) {
    if (r === "xAxis") return t[r].width;
    if (r === "yAxis") return t[r].height;
  },
  So = function (t) {
    var r = t.chartName,
      n = t.GraphicalChild,
      i = t.defaultTooltipEventType,
      a = i === void 0 ? "axis" : i,
      o = t.validateTooltipEventTypes,
      u = o === void 0 ? ["axis"] : o,
      c = t.axisComponents,
      s = t.legendContent,
      l = t.formatAxisMap,
      f = t.defaultProps,
      p = function (g, x) {
        var w = x.graphicalItems,
          O = x.stackGroups,
          m = x.offset,
          b = x.updateId,
          _ = x.dataStartIndex,
          A = x.dataEndIndex,
          T = g.barSize,
          $ = g.layout,
          j = g.barGap,
          E = g.barCategoryGap,
          C = g.maxBarSize,
          I = o0($),
          R = I.numericAxisName,
          k = I.cateAxisName,
          N = Aq(w),
          W = [];
        return (
          w.forEach(function (z, K) {
            var P = Ao(g.data, { graphicalItems: [z], dataStartIndex: _, dataEndIndex: A }),
              M = z.type.defaultProps !== void 0 ? D(D({}, z.type.defaultProps), z.props) : z.props,
              F = M.dataKey,
              H = M.maxBarSize,
              X = M["".concat(R, "Id")],
              re = M["".concat(k, "Id")],
              ae = {},
              ye = c.reduce(function (Ht, Kt) {
                var Po = x["".concat(Kt.axisType, "Map")],
                  ah = M["".concat(Kt.axisType, "Id")];
                (Po && Po[ah]) || Kt.axisType === "zAxis" || pr();
                var oh = Po[ah];
                return D(
                  D({}, Ht),
                  {},
                  Y(Y({}, Kt.axisType, oh), "".concat(Kt.axisType, "Ticks"), _t(oh)),
                );
              }, ae),
              U = ye[k],
              ee = ye["".concat(k, "Ticks")],
              ne = O && O[X] && O[X].hasStack && z$(z, O[X].stackGroups),
              q = At(z.type).indexOf("Bar") >= 0,
              be = va(U, ee),
              oe = [],
              Ae = N && M$({ barSize: T, stackGroups: O, totalSize: Pq(ye, k) });
            if (q) {
              var Se,
                Fe,
                Ct = J(H) ? C : H,
                xr =
                  (Se = (Fe = va(U, ee, !0)) !== null && Fe !== void 0 ? Fe : Ct) !== null &&
                  Se !== void 0
                    ? Se
                    : 0;
              ((oe = C$({
                barGap: j,
                barCategoryGap: E,
                bandSize: xr !== be ? xr : be,
                sizeList: Ae[re],
                maxBarSize: Ct,
              })),
                xr !== be &&
                  (oe = oe.map(function (Ht) {
                    return D(
                      D({}, Ht),
                      {},
                      {
                        position: D(
                          D({}, Ht.position),
                          {},
                          { offset: Ht.position.offset - xr / 2 },
                        ),
                      },
                    );
                  })));
            }
            var Pi = z && z.type && z.type.getComposedData;
            Pi &&
              W.push({
                props: D(
                  D(
                    {},
                    Pi(
                      D(
                        D({}, ye),
                        {},
                        {
                          displayedData: P,
                          props: g,
                          dataKey: F,
                          item: z,
                          bandSize: be,
                          barPosition: oe,
                          offset: m,
                          stackedData: ne,
                          layout: $,
                          dataStartIndex: _,
                          dataEndIndex: A,
                        },
                      ),
                    ),
                  ),
                  {},
                  Y(
                    Y(Y({ key: z.key || "item-".concat(K) }, R, ye[R]), k, ye[k]),
                    "animationId",
                    b,
                  ),
                ),
                childIndex: D_(z, g.children),
                item: z,
              });
          }),
          W
        );
      },
      d = function (g, x) {
        var w = g.props,
          O = g.dataStartIndex,
          m = g.dataEndIndex,
          b = g.updateId;
        if (!bd({ props: w })) return null;
        var _ = w.children,
          A = w.layout,
          T = w.stackOffset,
          $ = w.data,
          j = w.reverseStackOrder,
          E = o0(A),
          C = E.numericAxisName,
          I = E.cateAxisName,
          R = Xe(_, n),
          k = U$($, R, "".concat(C, "Id"), "".concat(I, "Id"), T, j),
          N = c.reduce(function (M, F) {
            var H = "".concat(F.axisType, "Map");
            return D(
              D({}, M),
              {},
              Y(
                {},
                H,
                Oq(
                  w,
                  D(
                    D({}, F),
                    {},
                    {
                      graphicalItems: R,
                      stackGroups: F.axisType === C && k,
                      dataStartIndex: O,
                      dataEndIndex: m,
                    },
                  ),
                ),
              ),
            );
          }, {}),
          W = Sq(D(D({}, N), {}, { props: w, graphicalItems: R }), x?.legendBBox);
        Object.keys(N).forEach(function (M) {
          N[M] = l(w, N[M], W, M.replace("Map", ""), r);
        });
        var z = N["".concat(I, "Map")],
          K = _q(z),
          P = p(
            w,
            D(
              D({}, N),
              {},
              {
                dataStartIndex: O,
                dataEndIndex: m,
                updateId: b,
                graphicalItems: R,
                stackGroups: k,
                offset: W,
              },
            ),
          );
        return D(
          D({ formattedGraphicalItems: P, graphicalItems: R, offset: W, stackGroups: k }, K),
          N,
        );
      },
      y = (function (h) {
        function g(x) {
          var w, O, m;
          return (
            aq(this, g),
            (m = cq(this, g, [x])),
            Y(m, "eventEmitterSymbol", Symbol("rechartsEventEmitter")),
            Y(m, "accessibilityManager", new H2()),
            Y(m, "handleLegendBBoxUpdate", function (b) {
              if (b) {
                var _ = m.state,
                  A = _.dataStartIndex,
                  T = _.dataEndIndex,
                  $ = _.updateId;
                m.setState(
                  D(
                    { legendBBox: b },
                    d(
                      { props: m.props, dataStartIndex: A, dataEndIndex: T, updateId: $ },
                      D(D({}, m.state), {}, { legendBBox: b }),
                    ),
                  ),
                );
              }
            }),
            Y(m, "handleReceiveSyncEvent", function (b, _, A) {
              if (m.props.syncId === b) {
                if (A === m.eventEmitterSymbol && typeof m.props.syncMethod != "function") return;
                m.applySyncEvent(_);
              }
            }),
            Y(m, "handleBrushChange", function (b) {
              var _ = b.startIndex,
                A = b.endIndex;
              if (_ !== m.state.dataStartIndex || A !== m.state.dataEndIndex) {
                var T = m.state.updateId;
                (m.setState(function () {
                  return D(
                    { dataStartIndex: _, dataEndIndex: A },
                    d({ props: m.props, dataStartIndex: _, dataEndIndex: A, updateId: T }, m.state),
                  );
                }),
                  m.triggerSyncEvent({ dataStartIndex: _, dataEndIndex: A }));
              }
            }),
            Y(m, "handleMouseEnter", function (b) {
              var _ = m.getMouseInfo(b);
              if (_) {
                var A = D(D({}, _), {}, { isTooltipActive: !0 });
                (m.setState(A), m.triggerSyncEvent(A));
                var T = m.props.onMouseEnter;
                Z(T) && T(A, b);
              }
            }),
            Y(m, "triggeredAfterMouseMove", function (b) {
              var _ = m.getMouseInfo(b),
                A = _ ? D(D({}, _), {}, { isTooltipActive: !0 }) : { isTooltipActive: !1 };
              (m.setState(A), m.triggerSyncEvent(A));
              var T = m.props.onMouseMove;
              Z(T) && T(A, b);
            }),
            Y(m, "handleItemMouseEnter", function (b) {
              m.setState(function () {
                return {
                  isTooltipActive: !0,
                  activeItem: b,
                  activePayload: b.tooltipPayload,
                  activeCoordinate: b.tooltipPosition || { x: b.cx, y: b.cy },
                };
              });
            }),
            Y(m, "handleItemMouseLeave", function () {
              m.setState(function () {
                return { isTooltipActive: !1 };
              });
            }),
            Y(m, "handleMouseMove", function (b) {
              (b.persist(), m.throttleTriggeredAfterMouseMove(b));
            }),
            Y(m, "handleMouseLeave", function (b) {
              m.throttleTriggeredAfterMouseMove.cancel();
              var _ = { isTooltipActive: !1 };
              (m.setState(_), m.triggerSyncEvent(_));
              var A = m.props.onMouseLeave;
              Z(A) && A(_, b);
            }),
            Y(m, "handleOuterEvent", function (b) {
              var _ = k_(b),
                A = Ve(m.props, "".concat(_));
              if (_ && Z(A)) {
                var T, $;
                (/.*touch.*/i.test(_)
                  ? ($ = m.getMouseInfo(b.changedTouches[0]))
                  : ($ = m.getMouseInfo(b)),
                  A((T = $) !== null && T !== void 0 ? T : {}, b));
              }
            }),
            Y(m, "handleClick", function (b) {
              var _ = m.getMouseInfo(b);
              if (_) {
                var A = D(D({}, _), {}, { isTooltipActive: !0 });
                (m.setState(A), m.triggerSyncEvent(A));
                var T = m.props.onClick;
                Z(T) && T(A, b);
              }
            }),
            Y(m, "handleMouseDown", function (b) {
              var _ = m.props.onMouseDown;
              if (Z(_)) {
                var A = m.getMouseInfo(b);
                _(A, b);
              }
            }),
            Y(m, "handleMouseUp", function (b) {
              var _ = m.props.onMouseUp;
              if (Z(_)) {
                var A = m.getMouseInfo(b);
                _(A, b);
              }
            }),
            Y(m, "handleTouchMove", function (b) {
              b.changedTouches != null &&
                b.changedTouches.length > 0 &&
                m.throttleTriggeredAfterMouseMove(b.changedTouches[0]);
            }),
            Y(m, "handleTouchStart", function (b) {
              b.changedTouches != null &&
                b.changedTouches.length > 0 &&
                m.handleMouseDown(b.changedTouches[0]);
            }),
            Y(m, "handleTouchEnd", function (b) {
              b.changedTouches != null &&
                b.changedTouches.length > 0 &&
                m.handleMouseUp(b.changedTouches[0]);
            }),
            Y(m, "handleDoubleClick", function (b) {
              var _ = m.props.onDoubleClick;
              if (Z(_)) {
                var A = m.getMouseInfo(b);
                _(A, b);
              }
            }),
            Y(m, "handleContextMenu", function (b) {
              var _ = m.props.onContextMenu;
              if (Z(_)) {
                var A = m.getMouseInfo(b);
                _(A, b);
              }
            }),
            Y(m, "triggerSyncEvent", function (b) {
              m.props.syncId !== void 0 && El.emit(jl, m.props.syncId, b, m.eventEmitterSymbol);
            }),
            Y(m, "applySyncEvent", function (b) {
              var _ = m.props,
                A = _.layout,
                T = _.syncMethod,
                $ = m.state.updateId,
                j = b.dataStartIndex,
                E = b.dataEndIndex;
              if (b.dataStartIndex !== void 0 || b.dataEndIndex !== void 0)
                m.setState(
                  D(
                    { dataStartIndex: j, dataEndIndex: E },
                    d({ props: m.props, dataStartIndex: j, dataEndIndex: E, updateId: $ }, m.state),
                  ),
                );
              else if (b.activeTooltipIndex !== void 0) {
                var C = b.chartX,
                  I = b.chartY,
                  R = b.activeTooltipIndex,
                  k = m.state,
                  N = k.offset,
                  W = k.tooltipTicks;
                if (!N) return;
                if (typeof T == "function") R = T(W, b);
                else if (T === "value") {
                  R = -1;
                  for (var z = 0; z < W.length; z++)
                    if (W[z].value === b.activeLabel) {
                      R = z;
                      break;
                    }
                }
                var K = D(D({}, N), {}, { x: N.left, y: N.top }),
                  P = Math.min(C, K.x + K.width),
                  M = Math.min(I, K.y + K.height),
                  F = W[R] && W[R].value,
                  H = Qf(m.state, m.props.data, R),
                  X = W[R]
                    ? {
                        x: A === "horizontal" ? W[R].coordinate : P,
                        y: A === "horizontal" ? M : W[R].coordinate,
                      }
                    : $O;
                m.setState(
                  D(
                    D({}, b),
                    {},
                    {
                      activeLabel: F,
                      activeCoordinate: X,
                      activePayload: H,
                      activeTooltipIndex: R,
                    },
                  ),
                );
              } else m.setState(b);
            }),
            Y(m, "renderCursor", function (b) {
              var _,
                A = m.state,
                T = A.isTooltipActive,
                $ = A.activeCoordinate,
                j = A.activePayload,
                E = A.offset,
                C = A.activeTooltipIndex,
                I = A.tooltipAxisBandSize,
                R = m.getTooltipEventType(),
                k = (_ = b.props.active) !== null && _ !== void 0 ? _ : T,
                N = m.props.layout,
                W = b.key || "_recharts-cursor";
              return S.createElement(J2, {
                key: W,
                activeCoordinate: $,
                activePayload: j,
                activeTooltipIndex: C,
                chartName: r,
                element: b,
                isActive: k,
                layout: N,
                offset: E,
                tooltipAxisBandSize: I,
                tooltipEventType: R,
              });
            }),
            Y(m, "renderPolarAxis", function (b, _, A) {
              var T = Ve(b, "type.axisType"),
                $ = Ve(m.state, "".concat(T, "Map")),
                j = b.type.defaultProps,
                E = j !== void 0 ? D(D({}, j), b.props) : b.props,
                C = $ && $[E["".concat(T, "Id")]];
              return L.cloneElement(
                b,
                D(
                  D({}, C),
                  {},
                  {
                    className: te(T, C.className),
                    key: b.key || "".concat(_, "-").concat(A),
                    ticks: _t(C, !0),
                  },
                ),
              );
            }),
            Y(m, "renderPolarGrid", function (b) {
              var _ = b.props,
                A = _.radialLines,
                T = _.polarAngles,
                $ = _.polarRadius,
                j = m.state,
                E = j.radiusAxisMap,
                C = j.angleAxisMap,
                I = kt(E),
                R = kt(C),
                k = R.cx,
                N = R.cy,
                W = R.innerRadius,
                z = R.outerRadius;
              return L.cloneElement(b, {
                polarAngles: Array.isArray(T)
                  ? T
                  : _t(R, !0).map(function (K) {
                      return K.coordinate;
                    }),
                polarRadius: Array.isArray($)
                  ? $
                  : _t(I, !0).map(function (K) {
                      return K.coordinate;
                    }),
                cx: k,
                cy: N,
                innerRadius: W,
                outerRadius: z,
                key: b.key || "polar-grid",
                radialLines: A,
              });
            }),
            Y(m, "renderLegend", function () {
              var b = m.state.formattedGraphicalItems,
                _ = m.props,
                A = _.children,
                T = _.width,
                $ = _.height,
                j = m.props.margin || {},
                E = T - (j.left || 0) - (j.right || 0),
                C = sw({
                  children: A,
                  formattedGraphicalItems: b,
                  legendWidth: E,
                  legendContent: s,
                });
              if (!C) return null;
              var I = C.item,
                R = r0(C, Q2);
              return L.cloneElement(
                I,
                D(
                  D({}, R),
                  {},
                  {
                    chartWidth: T,
                    chartHeight: $,
                    margin: j,
                    onBBoxUpdate: m.handleLegendBBoxUpdate,
                  },
                ),
              );
            }),
            Y(m, "renderTooltip", function () {
              var b,
                _ = m.props,
                A = _.children,
                T = _.accessibilityLayer,
                $ = Ke(A, bt);
              if (!$) return null;
              var j = m.state,
                E = j.isTooltipActive,
                C = j.activeCoordinate,
                I = j.activePayload,
                R = j.activeLabel,
                k = j.offset,
                N = (b = $.props.active) !== null && b !== void 0 ? b : E;
              return L.cloneElement($, {
                viewBox: D(D({}, k), {}, { x: k.left, y: k.top }),
                active: N,
                label: R,
                payload: N ? I : [],
                coordinate: C,
                accessibilityLayer: T,
              });
            }),
            Y(m, "renderBrush", function (b) {
              var _ = m.props,
                A = _.margin,
                T = _.data,
                $ = m.state,
                j = $.offset,
                E = $.dataStartIndex,
                C = $.dataEndIndex,
                I = $.updateId;
              return L.cloneElement(b, {
                key: b.key || "_recharts-brush",
                onChange: ki(m.handleBrushChange, b.props.onChange),
                data: T,
                x: B(b.props.x) ? b.props.x : j.left,
                y: B(b.props.y) ? b.props.y : j.top + j.height + j.brushBottom - (A.bottom || 0),
                width: B(b.props.width) ? b.props.width : j.width,
                startIndex: E,
                endIndex: C,
                updateId: "brush-".concat(I),
              });
            }),
            Y(m, "renderReferenceElement", function (b, _, A) {
              if (!b) return null;
              var T = m,
                $ = T.clipPathId,
                j = m.state,
                E = j.xAxisMap,
                C = j.yAxisMap,
                I = j.offset,
                R = b.type.defaultProps || {},
                k = b.props,
                N = k.xAxisId,
                W = N === void 0 ? R.xAxisId : N,
                z = k.yAxisId,
                K = z === void 0 ? R.yAxisId : z;
              return L.cloneElement(b, {
                key: b.key || "".concat(_, "-").concat(A),
                xAxis: E[W],
                yAxis: C[K],
                viewBox: { x: I.left, y: I.top, width: I.width, height: I.height },
                clipPathId: $,
              });
            }),
            Y(m, "renderActivePoints", function (b) {
              var _ = b.item,
                A = b.activePoint,
                T = b.basePoint,
                $ = b.childIndex,
                j = b.isRange,
                E = [],
                C = _.props.key,
                I =
                  _.item.type.defaultProps !== void 0
                    ? D(D({}, _.item.type.defaultProps), _.item.props)
                    : _.item.props,
                R = I.activeDot,
                k = I.dataKey,
                N = D(
                  D(
                    {
                      index: $,
                      dataKey: k,
                      cx: A.x,
                      cy: A.y,
                      r: 4,
                      fill: Gp(_.item),
                      strokeWidth: 2,
                      stroke: "#fff",
                      payload: A.payload,
                      value: A.value,
                    },
                    V(R, !1),
                  ),
                  Wi(R),
                );
              return (
                E.push(g.renderActiveDot(R, N, "".concat(C, "-activePoint-").concat($))),
                T
                  ? E.push(
                      g.renderActiveDot(
                        R,
                        D(D({}, N), {}, { cx: T.x, cy: T.y }),
                        "".concat(C, "-basePoint-").concat($),
                      ),
                    )
                  : j && E.push(null),
                E
              );
            }),
            Y(m, "renderGraphicChild", function (b, _, A) {
              var T = m.filterFormatItem(b, _, A);
              if (!T) return null;
              var $ = m.getTooltipEventType(),
                j = m.state,
                E = j.isTooltipActive,
                C = j.tooltipAxis,
                I = j.activeTooltipIndex,
                R = j.activeLabel,
                k = m.props.children,
                N = Ke(k, bt),
                W = T.props,
                z = W.points,
                K = W.isRange,
                P = W.baseLine,
                M =
                  T.item.type.defaultProps !== void 0
                    ? D(D({}, T.item.type.defaultProps), T.item.props)
                    : T.item.props,
                F = M.activeDot,
                H = M.hide,
                X = M.activeBar,
                re = M.activeShape,
                ae = !!(!H && E && N && (F || X || re)),
                ye = {};
              $ !== "axis" && N && N.props.trigger === "click"
                ? (ye = { onClick: ki(m.handleItemMouseEnter, b.props.onClick) })
                : $ !== "axis" &&
                  (ye = {
                    onMouseLeave: ki(m.handleItemMouseLeave, b.props.onMouseLeave),
                    onMouseEnter: ki(m.handleItemMouseEnter, b.props.onMouseEnter),
                  });
              var U = L.cloneElement(b, D(D({}, T.props), ye));
              function ee(Kt) {
                return typeof C.dataKey == "function" ? C.dataKey(Kt.payload) : null;
              }
              if (ae)
                if (I >= 0) {
                  var ne, q;
                  if (C.dataKey && !C.allowDuplicatedCategory) {
                    var be =
                      typeof C.dataKey == "function" ? ee : "payload.".concat(C.dataKey.toString());
                    ((ne = Ui(z, be, R)), (q = K && P && Ui(P, be, R)));
                  } else ((ne = z?.[I]), (q = K && P && P[I]));
                  if (re || X) {
                    var oe = b.props.activeIndex !== void 0 ? b.props.activeIndex : I;
                    return [
                      L.cloneElement(b, D(D(D({}, T.props), ye), {}, { activeIndex: oe })),
                      null,
                      null,
                    ];
                  }
                  if (!J(ne))
                    return [U].concat(
                      on(
                        m.renderActivePoints({
                          item: T,
                          activePoint: ne,
                          basePoint: q,
                          childIndex: I,
                          isRange: K,
                        }),
                      ),
                    );
                } else {
                  var Ae,
                    Se =
                      (Ae = m.getItemByXY(m.state.activeCoordinate)) !== null && Ae !== void 0
                        ? Ae
                        : { graphicalItem: U },
                    Fe = Se.graphicalItem,
                    Ct = Fe.item,
                    xr = Ct === void 0 ? b : Ct,
                    Pi = Fe.childIndex,
                    Ht = D(D(D({}, T.props), ye), {}, { activeIndex: Pi });
                  return [L.cloneElement(xr, Ht), null, null];
                }
              return K ? [U, null, null] : [U, null];
            }),
            Y(m, "renderCustomized", function (b, _, A) {
              return L.cloneElement(
                b,
                D(D({ key: "recharts-customized-".concat(A) }, m.props), m.state),
              );
            }),
            Y(m, "renderMap", {
              CartesianGrid: { handler: Bi, once: !0 },
              ReferenceArea: { handler: m.renderReferenceElement },
              ReferenceLine: { handler: Bi },
              ReferenceDot: { handler: m.renderReferenceElement },
              XAxis: { handler: Bi },
              YAxis: { handler: Bi },
              Brush: { handler: m.renderBrush, once: !0 },
              Bar: { handler: m.renderGraphicChild },
              Line: { handler: m.renderGraphicChild },
              Area: { handler: m.renderGraphicChild },
              Radar: { handler: m.renderGraphicChild },
              RadialBar: { handler: m.renderGraphicChild },
              Scatter: { handler: m.renderGraphicChild },
              Pie: { handler: m.renderGraphicChild },
              Funnel: { handler: m.renderGraphicChild },
              Tooltip: { handler: m.renderCursor, once: !0 },
              PolarGrid: { handler: m.renderPolarGrid, once: !0 },
              PolarAngleAxis: { handler: m.renderPolarAxis },
              PolarRadiusAxis: { handler: m.renderPolarAxis },
              Customized: { handler: m.renderCustomized },
            }),
            (m.clipPathId = "".concat(
              (w = x.id) !== null && w !== void 0 ? w : vr("recharts"),
              "-clip",
            )),
            (m.throttleTriggeredAfterMouseMove = sx(
              m.triggeredAfterMouseMove,
              (O = x.throttleDelay) !== null && O !== void 0 ? O : 1e3 / 60,
            )),
            (m.state = {}),
            m
          );
        }
        return (
          fq(g, h),
          uq(g, [
            {
              key: "componentDidMount",
              value: function () {
                var w, O;
                (this.addListener(),
                  this.accessibilityManager.setDetails({
                    container: this.container,
                    offset: {
                      left: (w = this.props.margin.left) !== null && w !== void 0 ? w : 0,
                      top: (O = this.props.margin.top) !== null && O !== void 0 ? O : 0,
                    },
                    coordinateList: this.state.tooltipTicks,
                    mouseHandlerCallback: this.triggeredAfterMouseMove,
                    layout: this.props.layout,
                  }),
                  this.displayDefaultTooltip());
              },
            },
            {
              key: "displayDefaultTooltip",
              value: function () {
                var w = this.props,
                  O = w.children,
                  m = w.data,
                  b = w.height,
                  _ = w.layout,
                  A = Ke(O, bt);
                if (A) {
                  var T = A.props.defaultIndex;
                  if (!(typeof T != "number" || T < 0 || T > this.state.tooltipTicks.length - 1)) {
                    var $ = this.state.tooltipTicks[T] && this.state.tooltipTicks[T].value,
                      j = Qf(this.state, m, T, $),
                      E = this.state.tooltipTicks[T].coordinate,
                      C = (this.state.offset.top + b) / 2,
                      I = _ === "horizontal",
                      R = I ? { x: E, y: C } : { y: E, x: C },
                      k = this.state.formattedGraphicalItems.find(function (W) {
                        var z = W.item;
                        return z.type.name === "Scatter";
                      });
                    k &&
                      ((R = D(D({}, R), k.props.points[T].tooltipPosition)),
                      (j = k.props.points[T].tooltipPayload));
                    var N = {
                      activeTooltipIndex: T,
                      isTooltipActive: !0,
                      activeLabel: $,
                      activePayload: j,
                      activeCoordinate: R,
                    };
                    (this.setState(N), this.renderCursor(A), this.accessibilityManager.setIndex(T));
                  }
                }
              },
            },
            {
              key: "getSnapshotBeforeUpdate",
              value: function (w, O) {
                if (!this.props.accessibilityLayer) return null;
                if (
                  (this.state.tooltipTicks !== O.tooltipTicks &&
                    this.accessibilityManager.setDetails({
                      coordinateList: this.state.tooltipTicks,
                    }),
                  this.props.layout !== w.layout &&
                    this.accessibilityManager.setDetails({ layout: this.props.layout }),
                  this.props.margin !== w.margin)
                ) {
                  var m, b;
                  this.accessibilityManager.setDetails({
                    offset: {
                      left: (m = this.props.margin.left) !== null && m !== void 0 ? m : 0,
                      top: (b = this.props.margin.top) !== null && b !== void 0 ? b : 0,
                    },
                  });
                }
                return null;
              },
            },
            {
              key: "componentDidUpdate",
              value: function (w) {
                Il([Ke(w.children, bt)], [Ke(this.props.children, bt)]) ||
                  this.displayDefaultTooltip();
              },
            },
            {
              key: "componentWillUnmount",
              value: function () {
                (this.removeListener(), this.throttleTriggeredAfterMouseMove.cancel());
              },
            },
            {
              key: "getTooltipEventType",
              value: function () {
                var w = Ke(this.props.children, bt);
                if (w && typeof w.props.shared == "boolean") {
                  var O = w.props.shared ? "axis" : "item";
                  return u.indexOf(O) >= 0 ? O : a;
                }
                return a;
              },
            },
            {
              key: "getMouseInfo",
              value: function (w) {
                if (!this.container) return null;
                var O = this.container,
                  m = O.getBoundingClientRect(),
                  b = OP(m),
                  _ = { chartX: Math.round(w.pageX - b.left), chartY: Math.round(w.pageY - b.top) },
                  A = m.width / O.offsetWidth || 1,
                  T = this.inRange(_.chartX, _.chartY, A);
                if (!T) return null;
                var $ = this.state,
                  j = $.xAxisMap,
                  E = $.yAxisMap,
                  C = this.getTooltipEventType(),
                  I = i0(this.state, this.props.data, this.props.layout, T);
                if (C !== "axis" && j && E) {
                  var R = kt(j).scale,
                    k = kt(E).scale,
                    N = R && R.invert ? R.invert(_.chartX) : null,
                    W = k && k.invert ? k.invert(_.chartY) : null;
                  return D(D({}, _), {}, { xValue: N, yValue: W }, I);
                }
                return I ? D(D({}, _), I) : null;
              },
            },
            {
              key: "inRange",
              value: function (w, O) {
                var m = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1,
                  b = this.props.layout,
                  _ = w / m,
                  A = O / m;
                if (b === "horizontal" || b === "vertical") {
                  var T = this.state.offset,
                    $ = _ >= T.left && _ <= T.left + T.width && A >= T.top && A <= T.top + T.height;
                  return $ ? { x: _, y: A } : null;
                }
                var j = this.state,
                  E = j.angleAxisMap,
                  C = j.radiusAxisMap;
                if (E && C) {
                  var I = kt(E);
                  return ug({ x: _, y: A }, I);
                }
                return null;
              },
            },
            {
              key: "parseEventsOfWrapper",
              value: function () {
                var w = this.props.children,
                  O = this.getTooltipEventType(),
                  m = Ke(w, bt),
                  b = {};
                m &&
                  O === "axis" &&
                  (m.props.trigger === "click"
                    ? (b = { onClick: this.handleClick })
                    : (b = {
                        onMouseEnter: this.handleMouseEnter,
                        onDoubleClick: this.handleDoubleClick,
                        onMouseMove: this.handleMouseMove,
                        onMouseLeave: this.handleMouseLeave,
                        onTouchMove: this.handleTouchMove,
                        onTouchStart: this.handleTouchStart,
                        onTouchEnd: this.handleTouchEnd,
                        onContextMenu: this.handleContextMenu,
                      }));
                var _ = Wi(this.props, this.handleOuterEvent);
                return D(D({}, _), b);
              },
            },
            {
              key: "addListener",
              value: function () {
                El.on(jl, this.handleReceiveSyncEvent);
              },
            },
            {
              key: "removeListener",
              value: function () {
                El.removeListener(jl, this.handleReceiveSyncEvent);
              },
            },
            {
              key: "filterFormatItem",
              value: function (w, O, m) {
                for (var b = this.state.formattedGraphicalItems, _ = 0, A = b.length; _ < A; _++) {
                  var T = b[_];
                  if (
                    T.item === w ||
                    T.props.key === w.key ||
                    (O === At(T.item.type) && m === T.childIndex)
                  )
                    return T;
                }
                return null;
              },
            },
            {
              key: "renderClipPath",
              value: function () {
                var w = this.clipPathId,
                  O = this.state.offset,
                  m = O.left,
                  b = O.top,
                  _ = O.height,
                  A = O.width;
                return S.createElement(
                  "defs",
                  null,
                  S.createElement(
                    "clipPath",
                    { id: w },
                    S.createElement("rect", { x: m, y: b, height: _, width: A }),
                  ),
                );
              },
            },
            {
              key: "getXScales",
              value: function () {
                var w = this.state.xAxisMap;
                return w
                  ? Object.entries(w).reduce(function (O, m) {
                      var b = t0(m, 2),
                        _ = b[0],
                        A = b[1];
                      return D(D({}, O), {}, Y({}, _, A.scale));
                    }, {})
                  : null;
              },
            },
            {
              key: "getYScales",
              value: function () {
                var w = this.state.yAxisMap;
                return w
                  ? Object.entries(w).reduce(function (O, m) {
                      var b = t0(m, 2),
                        _ = b[0],
                        A = b[1];
                      return D(D({}, O), {}, Y({}, _, A.scale));
                    }, {})
                  : null;
              },
            },
            {
              key: "getXScaleByAxisId",
              value: function (w) {
                var O;
                return (O = this.state.xAxisMap) === null ||
                  O === void 0 ||
                  (O = O[w]) === null ||
                  O === void 0
                  ? void 0
                  : O.scale;
              },
            },
            {
              key: "getYScaleByAxisId",
              value: function (w) {
                var O;
                return (O = this.state.yAxisMap) === null ||
                  O === void 0 ||
                  (O = O[w]) === null ||
                  O === void 0
                  ? void 0
                  : O.scale;
              },
            },
            {
              key: "getItemByXY",
              value: function (w) {
                var O = this.state,
                  m = O.formattedGraphicalItems,
                  b = O.activeItem;
                if (m && m.length)
                  for (var _ = 0, A = m.length; _ < A; _++) {
                    var T = m[_],
                      $ = T.props,
                      j = T.item,
                      E =
                        j.type.defaultProps !== void 0
                          ? D(D({}, j.type.defaultProps), j.props)
                          : j.props,
                      C = At(j.type);
                    if (C === "Bar") {
                      var I = ($.data || []).find(function (W) {
                        return WI(w, W);
                      });
                      if (I) return { graphicalItem: T, payload: I };
                    } else if (C === "RadialBar") {
                      var R = ($.data || []).find(function (W) {
                        return ug(w, W);
                      });
                      if (R) return { graphicalItem: T, payload: R };
                    } else if (yo(T, b) || mo(T, b) || si(T, b)) {
                      var k = pk({ graphicalItem: T, activeTooltipItem: b, itemData: E.data }),
                        N = E.activeIndex === void 0 ? k : E.activeIndex;
                      return {
                        graphicalItem: D(D({}, T), {}, { childIndex: N }),
                        payload: si(T, b) ? E.data[k] : T.props.data[k],
                      };
                    }
                  }
                return null;
              },
            },
            {
              key: "render",
              value: function () {
                var w = this;
                if (!bd(this)) return null;
                var O = this.props,
                  m = O.children,
                  b = O.className,
                  _ = O.width,
                  A = O.height,
                  T = O.style,
                  $ = O.compact,
                  j = O.title,
                  E = O.desc,
                  C = r0(O, eq),
                  I = V(C, !1);
                if ($)
                  return S.createElement(
                    Rb,
                    {
                      state: this.state,
                      width: this.props.width,
                      height: this.props.height,
                      clipPathId: this.clipPathId,
                    },
                    S.createElement(
                      kl,
                      jr({}, I, { width: _, height: A, title: j, desc: E }),
                      this.renderClipPath(),
                      wd(m, this.renderMap),
                    ),
                  );
                if (this.props.accessibilityLayer) {
                  var R, k;
                  ((I.tabIndex = (R = this.props.tabIndex) !== null && R !== void 0 ? R : 0),
                    (I.role = (k = this.props.role) !== null && k !== void 0 ? k : "application"),
                    (I.onKeyDown = function (W) {
                      w.accessibilityManager.keyboardEvent(W);
                    }),
                    (I.onFocus = function () {
                      w.accessibilityManager.focus();
                    }));
                }
                var N = this.parseEventsOfWrapper();
                return S.createElement(
                  Rb,
                  {
                    state: this.state,
                    width: this.props.width,
                    height: this.props.height,
                    clipPathId: this.clipPathId,
                  },
                  S.createElement(
                    "div",
                    jr(
                      {
                        className: te("recharts-wrapper", b),
                        style: D(
                          { position: "relative", cursor: "default", width: _, height: A },
                          T,
                        ),
                      },
                      N,
                      {
                        ref: function (z) {
                          w.container = z;
                        },
                      },
                    ),
                    S.createElement(
                      kl,
                      jr({}, I, { width: _, height: A, title: j, desc: E, style: mq }),
                      this.renderClipPath(),
                      wd(m, this.renderMap),
                    ),
                    this.renderLegend(),
                    this.renderTooltip(),
                  ),
                );
              },
            },
          ])
        );
      })(L.Component);
    (Y(y, "displayName", r),
      Y(
        y,
        "defaultProps",
        D(
          {
            layout: "horizontal",
            stackOffset: "none",
            barCategoryGap: "10%",
            barGap: 4,
            margin: { top: 5, right: 5, bottom: 5, left: 5 },
            reverseStackOrder: !1,
            syncMethod: "index",
          },
          f,
        ),
      ),
      Y(y, "getDerivedStateFromProps", function (h, g) {
        var x = h.dataKey,
          w = h.data,
          O = h.children,
          m = h.width,
          b = h.height,
          _ = h.layout,
          A = h.stackOffset,
          T = h.margin,
          $ = g.dataStartIndex,
          j = g.dataEndIndex;
        if (g.updateId === void 0) {
          var E = a0(h);
          return D(
            D(D({}, E), {}, { updateId: 0 }, d(D(D({ props: h }, E), {}, { updateId: 0 }), g)),
            {},
            {
              prevDataKey: x,
              prevData: w,
              prevWidth: m,
              prevHeight: b,
              prevLayout: _,
              prevStackOffset: A,
              prevMargin: T,
              prevChildren: O,
            },
          );
        }
        if (
          x !== g.prevDataKey ||
          w !== g.prevData ||
          m !== g.prevWidth ||
          b !== g.prevHeight ||
          _ !== g.prevLayout ||
          A !== g.prevStackOffset ||
          !$r(T, g.prevMargin)
        ) {
          var C = a0(h),
            I = { chartX: g.chartX, chartY: g.chartY, isTooltipActive: g.isTooltipActive },
            R = D(D({}, i0(g, w, _)), {}, { updateId: g.updateId + 1 }),
            k = D(D(D({}, C), I), R);
          return D(
            D(D({}, k), d(D({ props: h }, k), g)),
            {},
            {
              prevDataKey: x,
              prevData: w,
              prevWidth: m,
              prevHeight: b,
              prevLayout: _,
              prevStackOffset: A,
              prevMargin: T,
              prevChildren: O,
            },
          );
        }
        if (!Il(O, g.prevChildren)) {
          var N,
            W,
            z,
            K,
            P = Ke(O, Vr),
            M =
              P &&
              (N = (W = P.props) === null || W === void 0 ? void 0 : W.startIndex) !== null &&
              N !== void 0
                ? N
                : $,
            F =
              P &&
              (z = (K = P.props) === null || K === void 0 ? void 0 : K.endIndex) !== null &&
              z !== void 0
                ? z
                : j,
            H = M !== $ || F !== j,
            X = !J(w),
            re = X && !H ? g.updateId : g.updateId + 1;
          return D(
            D(
              { updateId: re },
              d(D(D({ props: h }, g), {}, { updateId: re, dataStartIndex: M, dataEndIndex: F }), g),
            ),
            {},
            { prevChildren: O, dataStartIndex: M, dataEndIndex: F },
          );
        }
        return null;
      }),
      Y(y, "renderActiveDot", function (h, g, x) {
        var w;
        return (
          L.isValidElement(h)
            ? (w = L.cloneElement(h, g))
            : Z(h)
              ? (w = h(g))
              : (w = S.createElement(_i, g)),
          S.createElement(ie, { className: "recharts-active-dot", key: x }, w)
        );
      }));
    var v = L.forwardRef(function (g, x) {
      return S.createElement(y, jr({}, g, { ref: x }));
    });
    return ((v.displayName = y.displayName), v);
  },
  jq = So({
    chartName: "LineChart",
    GraphicalChild: _o,
    axisComponents: [
      { axisType: "xAxis", AxisComp: Ai },
      { axisType: "yAxis", AxisComp: Si },
    ],
    formatAxisMap: Xp,
  }),
  $q = So({
    chartName: "BarChart",
    GraphicalChild: dn,
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: ["axis", "item"],
    axisComponents: [
      { axisType: "xAxis", AxisComp: Ai },
      { axisType: "yAxis", AxisComp: Si },
    ],
    formatAxisMap: Xp,
  }),
  Mq = So({
    chartName: "PieChart",
    GraphicalChild: zt,
    validateTooltipEventTypes: ["item"],
    defaultTooltipEventType: "item",
    legendContent: "children",
    axisComponents: [
      { axisType: "angleAxis", AxisComp: vo },
      { axisType: "radiusAxis", AxisComp: po },
    ],
    formatAxisMap: eM,
    defaultProps: {
      layout: "centric",
      startAngle: 0,
      endAngle: 360,
      cx: "50%",
      cy: "50%",
      innerRadius: 0,
      outerRadius: "80%",
    },
  }),
  Cq = So({
    chartName: "AreaChart",
    GraphicalChild: br,
    axisComponents: [
      { axisType: "xAxis", AxisComp: Ai },
      { axisType: "yAxis", AxisComp: Si },
    ],
    formatAxisMap: Xp,
  });
export {
  br as A,
  dn as B,
  HN as C,
  Mr as L,
  zt as P,
  S as R,
  bt as T,
  Ai as X,
  Si as Y,
  Cq as a,
  $q as b,
  Op as c,
  _o as d,
  jq as e,
  Mq as f,
  Tq as g,
  Eq as h,
  Ti as i,
  le as j,
  L as k,
  u0 as l,
  RO as m,
  kO as r,
};
