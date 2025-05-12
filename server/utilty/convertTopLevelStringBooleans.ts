type ComplexFilter = {
    select?: Record<string, boolean>;
    include?: Record<string, boolean>;
  };
  
  export type SimpleFilterObject = Record<string, string | number | boolean | ComplexFilter>;
  
  /**
   * Converts top-level string booleans to actual boolean values in the filters object.
   * Also handles select/include parsing from dash-separated strings.
   *
   * @param filters - The filters object to process.
   * @returns The processed filters object.
   */
  export function convertTopLevelStringBooleans(filters: Record<string, any>): SimpleFilterObject {
    const result: SimpleFilterObject = {};
  
    for (const [key, value] of Object.entries(filters)) {
      if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (lower === 'true') {
          result[key] = true;
        } else if (lower === 'false') {
          result[key] = false;
        } else {
          result[key] = value;
        }
      } else if (typeof value === 'object' && value !== null) {
        if ('select' in value && typeof value.select === 'string') {
          const splitArray = value.select.split('-');
          const select: Record<string, boolean> = {};
          for (const key of splitArray) {
            select[key] = true;
          }
          result[key] = { select };
        } else if ('include' in value && typeof value.include === 'string') {
          const splitArray = value.include.split('-');
          const include: Record<string, boolean> = {};
          for (const key of splitArray) {
            include[key] = true;
          }
          result[key] = { include };
        }
      } else {
        result[key] = value;
      }
    }
  
    return result;
  }
  