export function isPelayananDitutup() {
  const today = new Date().getDate()
  return today > 9
}
