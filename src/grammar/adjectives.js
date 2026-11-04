// Формы в автономном демо хранятся явно, чтобы не генерировать ошибочные
// окончания для разных моделей прилагательных. После подключения полной
// размеченной базы формы будут поступать из словаря.
export function adjectiveForQuantity(item, pattern) {
  return item.adjectiveForms?.[pattern] ?? item.adjective;
}
