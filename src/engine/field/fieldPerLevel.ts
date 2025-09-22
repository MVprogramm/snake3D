/**
 * @module fieldPerLevel.ts Управление размерами игрового поля
 *    @var fieldPerLevel количество ячеек по стороне квадратного поля
 *    @function setField Задает количество ячеек по стороне поля
 *    @function getField Возвращает количество ячеек по стороне поля
 */
/**
 * @var количество ячеек по стороне квадратного игрового поля на текущем уровне
 */
let fieldPerLevel: number = 5 // Инициализируем значением по умолчанию
/**
 * Задает количество ячеек по стороне квадратного игрового поля на текущем уровне
 * @param size - размер поля (количество ячеек по стороне)
 */
export function setField(size: number): void {
  const warnings: string[] = []
  let validSize = size
  // Проверка минимального размера
  if (size < 5) {
    warnings.push('WARNING! The field cannot have less than 5 cells on each side!')
    validSize = 5
  }
  // Проверка на четность (поле должно быть нечетным для симметрии)
  if (validSize % 2 === 0) {
    warnings.push('WARNING! The field cannot have an even number of cells on each side!')
    validSize = validSize + 1
  }

  fieldPerLevel = validSize

  // Выводим предупреждения в консоль для отладки
  warnings.forEach((warning) => console.log(warning))
}
/**
 * Возвращает количество ячеек по стороне квадратного игрового поля на текущем уровне
 * @returns размер поля
 */
export function getField(): number {
  return fieldPerLevel
}
