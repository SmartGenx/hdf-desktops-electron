export type FilterObject = Record<string, any>;

/**
 * Converts string numbers to actual numbers in the filters object.
 * @param filters - The filters object to process.
 * @returns The processed filters object with string numbers converted.
 */

export function convertEqualsToInt(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key in obj) {
    const value = obj[key]

    if (
      typeof value === 'string' &&
      value.match(/^(\d+)$/) // تحقق إن كانت قيمة رقمية صحيحة
    ) {
      result[key] = parseInt(value, 10)
    } else {
      result[key] = value
    }
  }
  return result
}
export function convertStringNumbers(filters: FilterObject): FilterObject {
  const result: FilterObject = {};

  function processValue(value: any): any {
    if (typeof value === 'string') {
      // Check if it's a numeric string
      return isNaN(Number(value)) ? value : Number(value);
    } else if (Array.isArray(value)) {
      return value.map(item => processValue(item));
    } else if (typeof value === 'object' && value !== null) {
      return convertStringNumbers(value); // Recursive
    } else {
      return value;
    }
  }

  for (const [key, conditions] of Object.entries(filters)) {
    if (typeof conditions === 'object' && conditions !== null && !Array.isArray(conditions)) {
      result[key] = {};
      for (const [op, value] of Object.entries(conditions)) {
        result[key][op] = processValue(value);
      }
    } else {
      result[key] = processValue(conditions);
    }
  }

  return result;
}
