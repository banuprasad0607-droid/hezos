import { E as u } from "./vendor-pdf-BA8uJ8a4.js";
function x(s) {
  if (s == null) return "";
  let c = String(s).replace(/"/g, '""');
  return (["=", "+", "-", "@"].some((r) => c.startsWith(r)) && (c = `'${c}`), `"${c}"`);
}
function E(s, c, r) {
  const n = c.map(x).join(","),
    t = r.map((a) => a.map(x).join(",")),
    i = [n, ...t].join(`
`),
    e = new Blob(["\uFEFF" + i], { type: "text/csv;charset=utf-8;" }),
    l = URL.createObjectURL(e),
    o = document.createElement("a");
  (o.setAttribute("href", l),
    o.setAttribute("download", `${s}.csv`),
    (o.style.visibility = "hidden"),
    document.body.appendChild(o),
    o.click(),
    document.body.removeChild(o));
}
function y(s, c, r) {
  let n =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  ((n +=
    '<head><meta charset="utf-8" /><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet 1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>'),
    (n += "<body><table><thead><tr>"),
    c.forEach((l) => {
      n += `<th style="background-color: #3c68d9; color: #ffffff; font-weight: bold; border: 1px solid #000000;">${l}</th>`;
    }),
    (n += "</tr></thead><tbody>"),
    r.forEach((l) => {
      ((n += "<tr>"),
        l.forEach((o) => {
          const a = o == null ? "" : String(o);
          n += `<td style="border: 1px solid #cccccc;">${a}</td>`;
        }),
        (n += "</tr>"));
    }),
    (n += "</tbody></table></body></html>"));
  const t = new Blob([n], { type: "application/vnd.ms-excel" }),
    i = URL.createObjectURL(t),
    e = document.createElement("a");
  (e.setAttribute("href", i),
    e.setAttribute("download", `${s}.xls`),
    (e.style.visibility = "hidden"),
    document.body.appendChild(e),
    e.click(),
    document.body.removeChild(e));
}
function k(s, c, r, n) {
  const t = new u({ orientation: "portrait", unit: "mm", format: "a4" });
  (t.setFont("helvetica", "bold"),
    t.setFontSize(16),
    t.setTextColor(60, 104, 217),
    t.text(c, 14, 20),
    t.setFont("helvetica", "normal"),
    t.setFontSize(9),
    t.setTextColor(100, 100, 100),
    t.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 26));
  const i = 14;
  let e = 32;
  const l = Math.floor(182 / r.length),
    o = 8,
    a = 280;
  (t.setFillColor(60, 104, 217),
    t.rect(i, e, l * r.length, o, "F"),
    t.setFont("helvetica", "bold"),
    t.setTextColor(255, 255, 255),
    t.setFontSize(8),
    r.forEach((h, f) => {
      const d = String(h).substring(0, Math.floor(l / 2));
      t.text(d, i + f * l + 2, e + 5);
    }),
    (e += o),
    t.setFont("helvetica", "normal"),
    t.setTextColor(22, 22, 22),
    n.forEach((h, f) => {
      (e + o > a && (t.addPage(), (e = 20)),
        f % 2 === 0 && (t.setFillColor(248, 248, 248), t.rect(i, e, l * r.length, o, "F")),
        h.forEach((d, m) => {
          const b = (d == null ? "" : String(d)).substring(0, Math.floor(l / 1.8));
          t.text(b, i + m * l + 2, e + 5);
        }),
        (e += o));
    }),
    t.save(`${s}.pdf`));
}
export { y as a, k as b, E as e };
