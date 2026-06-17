function whatsappLink(phone, text) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
export { whatsappLink as w };
