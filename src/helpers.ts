/**
 * Class containing helper functions
 */
export class Helpers {
    /**
     * Regular expression used to check the string is a correct date string according to ISO 8601.
     * Taken from https://stackoverflow.com/a/3143231/6794376
     * We know, that using libraries like moment would be more reliable approach
     * (for example, moment(value, moment.ISO_8601, true).isValid()).
     * The reason we use regexp is to keep this package lightweight and free of dependencies.
     * If your server doesn't send you things like 14th month, this check is enough
     * @type {RegExp}
     */
    private static readonly DATE_STRING_REGEXP = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/;

    /**
     * Check if passed value is an array
     * @param value
     * @returns {boolean}
     */
    public static isArray (value: any) : boolean {
        return Array.isArray(value);
    }

    /**
     * Check if passed value is an object
     * @param value
     * @returns {boolean}
     */
    public static isObject (value: any) : boolean {
        return typeof value === 'function'
            || typeof value === 'object' && !!value;
    }

    /**
     * Check if passed value is a date
     * @param value
     * @returns {boolean}
     */
    public static isDate (value: any) : boolean {
        return Object.prototype.toString.call(value) === '[object Date]';
    }

    /**
     * Check if passed value is a date string (based on ISO 8601)
     * @param {string} value
     * @returns {boolean}
     */
    public static isDateString (value: string) : boolean {
        return Helpers.DATE_STRING_REGEXP.test(value);
    }
}