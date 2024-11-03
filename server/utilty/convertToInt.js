/**
 * @typedef {Object<string, any>} FilterObject
 */

/**
 * Converts string numbers to actual numbers in the filters object.
 * @param {FilterObject} filters - The filters object to process.
 * @returns {FilterObject} The processed filters object with string numbers converted.
 */
function convertStringNumbers(filters) {
    const result = {};

    function processValue(value) {
        if (typeof value === 'string') {
            if (!isNaN(+value)) {
                return +value;
            }
            return value;
        } else if (Array.isArray(value)) {
            return value.map(item => processValue(item));
        } else if (typeof value === 'object' && value !== null) {
            return convertStringNumbers(value);
        } else {
            return value;
        }
    }

    for (const [key, conditions] of Object.entries(filters)) {
        if (typeof conditions === 'object' && conditions !== null) {
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

// Export the function
module.exports = convertStringNumbers;
