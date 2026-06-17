import { k as A } from "./vendor-charts-DECNlt_G.js";
import { Y as _, w as m, z as x, T as v, u as E, s as R, q as h } from "./index-DrqTZ7SR.js";
function M(r) {
  if (Array.isArray(r)) return r.flatMap((d) => M(d));
  if (typeof r != "string") return [];
  const a = [];
  let e = 0,
    n,
    i,
    t,
    s,
    o;
  const c = () => {
      for (; e < r.length && /\s/.test(r.charAt(e)); ) e += 1;
      return e < r.length;
    },
    l = () => ((i = r.charAt(e)), i !== "=" && i !== ";" && i !== ",");
  for (; e < r.length; ) {
    for (n = e, o = !1; c(); )
      if (((i = r.charAt(e)), i === ",")) {
        for (t = e, e += 1, c(), s = e; e < r.length && l(); ) e += 1;
        e < r.length && r.charAt(e) === "="
          ? ((o = !0), (e = s), a.push(r.slice(n, t)), (n = e))
          : (e = t + 1);
      } else e += 1;
    (!o || e >= r.length) && a.push(r.slice(n));
  }
  return a;
}
function P(r) {
  return r instanceof Headers
    ? r
    : Array.isArray(r)
      ? new Headers(r)
      : typeof r == "object"
        ? new Headers(r)
        : null;
}
function j(...r) {
  return r.reduce((a, e) => {
    const n = P(e);
    if (!n) return a;
    for (const [i, t] of n.entries())
      i === "set-cookie" ? M(t).forEach((s) => a.append("set-cookie", s)) : a.set(i, t);
    return a;
  }, new Headers());
}
function H(r) {
  const a = _();
  return A.useCallback(
    async (...e) => {
      try {
        const n = await r(...e);
        if (m(n)) throw n;
        return n;
      } catch (n) {
        if (m(n))
          return (
            (n.options._fromLocation = a.stores.location.get()),
            a.navigate(a.resolveRedirect(n).options)
          );
        throw n;
      }
    },
    [a, r],
  );
}
function O(r) {
  return r !== "__proto__" && r !== "constructor" && r !== "prototype";
}
function y(r, a) {
  const e = Object.create(null);
  if (r) for (const n of Object.keys(r)) O(n) && (e[n] = r[n]);
  if (a && typeof a == "object") for (const n of Object.keys(a)) O(n) && (e[n] = a[n]);
  return e;
}
function F(r) {
  return Object.create(null);
}
var T = () => {
    throw new Error("createServerOnlyFn() functions can only be called on the server!");
  },
  u = (r, a) => {
    const e = a || r || {};
    return (
      typeof e.method > "u" && (e.method = "GET"),
      Object.assign((t) => u(void 0, { ...e, ...t }), {
        options: e,
        middleware: (t) => {
          const s = [...(e.middleware || [])];
          t.map((c) => {
            v in c ? c.options.middleware && s.push(...c.options.middleware) : s.push(c);
          });
          const o = u(void 0, { ...e, middleware: s });
          return ((o[v] = !0), o);
        },
        inputValidator: (t) => u(void 0, { ...e, inputValidator: t }),
        handler: (...t) => {
          const [s, o] = t,
            c = { ...e, extractedFn: s, serverFn: o },
            l = [...(c.middleware || []), V(c)];
          return (
            (s.method = e.method),
            Object.assign(
              async (d) => {
                const f = await S(l, "client", {
                    ...s,
                    ...c,
                    data: d?.data,
                    headers: d?.headers,
                    signal: d?.signal,
                    fetch: d?.fetch,
                    context: F(),
                  }),
                  p = x(f.error);
                if (p) throw p;
                if (f.error) throw f.error;
                return f.result;
              },
              {
                ...s,
                method: e.method,
                __executeServer: async (d) => {
                  const f = T(),
                    p = f.contextAfterGlobalMiddlewares;
                  return await S(l, "server", {
                    ...s,
                    ...d,
                    serverFnMeta: s.serverFnMeta,
                    context: y(d.context, p),
                    request: f.request,
                  }).then((b) => ({ result: b.result, error: b.error, context: b.sendContext }));
                },
              },
            )
          );
        },
      })
    );
  };
async function S(r, a, e) {
  let n = C([...(E()?.functionMiddleware || []), ...r]);
  if (a === "server") {
    const t = T();
    t?.executedRequestMiddlewares && (n = n.filter((s) => !t.executedRequestMiddlewares.has(s)));
  }
  const i = async (t) => {
    const s = n.shift();
    if (!s) return t;
    try {
      "inputValidator" in s.options &&
        s.options.inputValidator &&
        a === "server" &&
        (t.data = await g(s.options.inputValidator, t.data));
      let o;
      if (
        (a === "client"
          ? "client" in s.options && (o = s.options.client)
          : "server" in s.options && (o = s.options.server),
        o)
      ) {
        const l = await o({
          ...t,
          next: async (d = {}) => {
            const f = await i({
              ...t,
              ...d,
              context: y(t.context, d.context),
              sendContext: y(t.sendContext, d.sendContext),
              headers: j(t.headers, d.headers),
              _callSiteFetch: t._callSiteFetch,
              fetch: t._callSiteFetch ?? d.fetch ?? t.fetch,
              result: d.result !== void 0 ? d.result : d instanceof Response ? d : t.result,
              error: d.error ?? t.error,
            });
            if (f.error) throw f.error;
            return f;
          },
        });
        if (m(l)) return { ...t, error: l };
        if (l instanceof Response) return { ...t, result: l };
        if (!l)
          throw new Error(
            "User middleware returned undefined. You must call next() or return a result in your middlewares.",
          );
        return l;
      }
      return i(t);
    } catch (o) {
      return { ...t, error: o };
    }
  };
  return i({
    ...e,
    headers: e.headers || {},
    sendContext: e.sendContext || {},
    context: e.context || F(),
    _callSiteFetch: e.fetch,
  });
}
function C(r, a = 100) {
  const e = new Set(),
    n = [],
    i = (t, s) => {
      if (s > a)
        throw new Error(
          `Middleware nesting depth exceeded maximum of ${a}. Check for circular references.`,
        );
      t.forEach((o) => {
        (o.options.middleware && i(o.options.middleware, s + 1), e.has(o) || (e.add(o), n.push(o)));
      });
    };
  return (i(r, 0), n);
}
async function g(r, a) {
  if (r == null) return {};
  if ("~standard" in r) {
    const e = await r["~standard"].validate(a);
    if (e.issues) throw new Error(JSON.stringify(e.issues, void 0, 2));
    return e.value;
  }
  if ("parse" in r) return r.parse(a);
  if (typeof r == "function") return r(a);
  throw new Error("Invalid validator type!");
}
function V(r) {
  return {
    "~types": void 0,
    options: {
      inputValidator: r.inputValidator,
      client: async ({ next: a, sendContext: e, fetch: n, ...i }) => {
        const t = { ...i, context: e, fetch: n };
        return a(await r.extractedFn?.(t));
      },
      server: async ({ next: a, ...e }) => {
        const n = await r.serverFn?.(e);
        return a({ ...e, result: n });
      },
    },
  };
}
const w = R({ type: "function" }),
  I = u({ method: "POST" })
    .middleware([w])
    .handler(h("f5a10fa45077857e4d1ccffd01555f31e38f2fc7acf0424e1a6e7a1422ff961a")),
  G = u({ method: "POST" })
    .middleware([w])
    .handler(h("6193ca6393ff03622607c8e55de2002fd953e53dcbd843c85041be86c59fb8d2")),
  Y = u({ method: "POST" })
    .middleware([w])
    .handler(h("133844214a4719bda90889cd9afc62d29e0c7841cbe15401eb91c1345a8a4771")),
  U = u({ method: "POST" })
    .middleware([w])
    .handler(h("c7daddccdc4a017418bf0449431ca08cd5c578b6a1bf52bd6661311bcd53d9e8")),
  z = u({ method: "POST" })
    .middleware([w])
    .handler(h("74b7c266f17fc6d5b1c13c80e08d7e19423388a35e64756457927e70d6973987"));
u({ method: "POST" })
  .middleware([w])
  .handler(h("0b555f14295dc8bb51ce806a00ff7f2f77bcfbe15bed2747495355e8757e2db7"));
const B = u({ method: "POST" }).handler(
    h("167edb1c60030c9184e6d11128b4ea90f01d5a02d17005feca7fc87c6859134d"),
  ),
  J = u({ method: "POST" }).handler(
    h("58ddf5d25e1dfb1dd783a74fb6c21b95be7cb5f10822e4b6efda608e38293daa"),
  );
export { z as a, G as b, J as c, Y as g, B as l, I as p, U as r, H as u };
