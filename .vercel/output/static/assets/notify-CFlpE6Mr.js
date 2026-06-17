function r(t, e) {
  if (!t) return null;
  const n = t.replace(/[^\d]/g, "");
  return n.length < 7 ? null : `https://wa.me/${n}?text=${encodeURIComponent(e)}`;
}
export { r as w };
