import { r as W, x as t } from "./index-DrqTZ7SR.js";
import { k as d } from "./vendor-charts-DECNlt_G.js";
const Z = [
    [
      "path",
      {
        d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
        key: "18u6gg",
      },
    ],
    ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }],
  ],
  O = W("camera", Z);
function P({ imageSrc: g, onCrop: I, onCancel: R, circular: B = !1, cropSize: r = 300 }) {
  const [l, p] = d.useState(1),
    [c, u] = d.useState({ x: 0, y: 0 }),
    [b, m] = d.useState(!1),
    [i, f] = d.useState({ x: 0, y: 0 }),
    [y, T] = d.useState(!1),
    _ = (e) => {
      (m(!0), f({ x: e.clientX - c.x, y: e.clientY - c.y }));
    },
    S = (e) => {
      b && u({ x: e.clientX - i.x, y: e.clientY - i.y });
    },
    x = () => {
      m(!1);
    },
    $ = (e) => {
      const s = e.touches[0];
      s && (m(!0), f({ x: s.clientX - c.x, y: s.clientY - c.y }));
    },
    E = (e) => {
      if (!b) return;
      const s = e.touches[0];
      s && u({ x: s.clientX - i.x, y: s.clientY - i.y });
    },
    U = () => {
      const e = new Image();
      ((e.src = g),
        (e.onload = () => {
          const s = document.createElement("canvas");
          ((s.width = r), (s.height = r));
          const o = s.getContext("2d");
          if (!o) return;
          ((o.fillStyle = "#ffffff"), o.fillRect(0, 0, r, r));
          const v = r / 2,
            h = r / 150;
          (o.save(), o.translate(v, v), o.scale(l, l), o.translate((c.x * h) / l, (c.y * h) / l));
          const X = Math.max(e.width, e.height),
            j = (200 * h) / X,
            k = e.width * j,
            M = e.height * j;
          if ((o.drawImage(e, -k / 2, -M / 2, k, M), o.restore(), y)) {
            const N = o.getImageData(0, 0, r, r),
              n = N.data,
              H = n[0],
              L = n[1],
              q = n[2];
            for (let a = 0; a < n.length; a += 4) {
              const w = n[a],
                C = n[a + 1],
                D = n[a + 2],
                A = Math.sqrt((w - H) ** 2 + (C - L) ** 2 + (D - q) ** 2),
                F = Math.sqrt((w - 255) ** 2 + (C - 255) ** 2 + (D - 255) ** 2);
              (A < 70 || F < 70) &&
                ((n[a] = 60), (n[a + 1] = 104), (n[a + 2] = 217), (n[a + 3] = 255));
            }
            o.putImageData(N, 0, 0);
          }
          const Y = s.toDataURL("image/jpeg", 0.9);
          I(Y);
        }));
    };
  return t.jsxs("div", {
    className: "space-y-4",
    children: [
      t.jsxs("div", {
        onMouseDown: _,
        onMouseMove: S,
        onMouseUp: x,
        onMouseLeave: x,
        onTouchStart: $,
        onTouchMove: E,
        onTouchEnd: x,
        className:
          "size-[300px] border border-border bg-slate-900 overflow-hidden relative cursor-move mx-auto rounded-lg select-none",
        children: [
          t.jsx("div", {
            style: {
              transform: `translate(${c.x}px, ${c.y}px) scale(${l})`,
              backgroundImage: `url(${g})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            },
            className: "size-full absolute inset-0 pointer-events-none",
          }),
          t.jsx("div", {
            className:
              "absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40",
            children: t.jsx("div", {
              className: `size-[150px] border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] ${B ? "rounded-full" : "rounded-lg"}`,
            }),
          }),
        ],
      }),
      t.jsxs("div", {
        className: "space-y-2",
        children: [
          t.jsxs("label", {
            className: "text-xs font-medium text-muted-foreground flex justify-between",
            children: [
              t.jsxs("span", { children: ["Zoom: ", Math.round(l * 100), "%"] }),
              t.jsx("button", {
                type: "button",
                onClick: () => {
                  (p(1), u({ x: 0, y: 0 }));
                },
                className: "text-brand hover:underline",
                children: "Reset",
              }),
            ],
          }),
          t.jsx("input", {
            type: "range",
            min: "0.5",
            max: "3.0",
            step: "0.05",
            value: l,
            onChange: (e) => p(parseFloat(e.target.value)),
            className: "w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer",
          }),
        ],
      }),
      t.jsxs("div", {
        className: "flex items-center gap-2 p-2 border border-border rounded-lg bg-secondary/30",
        children: [
          t.jsx("input", {
            type: "checkbox",
            id: "removeBgCheck",
            checked: y,
            onChange: (e) => T(e.target.checked),
            className: "rounded cursor-pointer",
          }),
          t.jsx("label", {
            htmlFor: "removeBgCheck",
            className: "text-xs font-medium select-none cursor-pointer",
            children: "Smart Chroma Key (Replace backdrop with blue)",
          }),
        ],
      }),
      t.jsxs("div", {
        className: "flex gap-2 justify-end",
        children: [
          t.jsx("button", {
            type: "button",
            onClick: R,
            className: "px-3 py-1.5 text-sm border border-border rounded-md hover:bg-secondary",
            children: "Cancel",
          }),
          t.jsx("button", {
            type: "button",
            onClick: U,
            className:
              "px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md font-semibold",
            children: "Crop & Use",
          }),
        ],
      }),
    ],
  });
}
export { O as C, P as I };
