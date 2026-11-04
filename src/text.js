export const normalizeAnswer = (value) =>
  (value ?? '')
    .trim()
    .normalize('NFC')
    .toLocaleLowerCase('lt-LT')
    .replace(/[ą]/g, 'a')
    .replace(/[č]/g, 'c')
    .replace(/[ęė]/g, 'e')
    .replace(/[į]/g, 'i')
    .replace(/[š]/g, 's')
    .replace(/[ųū]/g, 'u')
    .replace(/[ž]/g, 'z')
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ');

export const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
