/**
 * @typedef {Object<string, string | number | boolean | ComplexFilter>} SimpleFilterObject
 */

/**
 * @typedef {Object} ComplexFilter
 * @property {Object<string, boolean>} [select]
 * @property {Object<string, boolean>} [include]
 */

/**
 * Converts top-level string booleans to actual boolean values in the filters object.
 * @param {SimpleFilterObject} filters - The filters object to process.
 * @returns {SimpleFilterObject} The processed filters object with string booleans converted.
 */
function convertTopLevelStringBooleans(filters) {
    const result = {};
    for (const [key, value] of Object.entries(filters)) {
        if (typeof value === 'string') {
            // Check if the string is 'true' or 'false' and convert accordingly
            if (value.toLowerCase() === 'true') {
                result[key] = true;
            } else if (value.toLowerCase() === 'false') {
                result[key] = false;
            } else {
                // Retain other strings as they are
                result[key] = value;
            }
        } else if (typeof value === 'object' && value !== null) {
            if (value['select']) {
                const selectValue = value['select'];
                const splitArray = selectValue.split('-');
                let select = {};
                for (let i in splitArray) {
                    select[`${splitArray[i]}`] = true;
                }
                result[key] = { select: select };
            } else if (value['include']) {
                const includeValue = value['include'];
                const splitArray = includeValue.split('-');
                let include = {};
                for (let i in splitArray) {
                    include[`${splitArray[i]}`] = true;
                }
                result[key] = { include: include };
            }
        }
    }
    return result;
}

// Export the function
module.exports = convertTopLevelStringBooleans;
