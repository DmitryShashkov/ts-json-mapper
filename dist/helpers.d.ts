/**
 * Class containing helper functions
 */
export declare class Helpers {
    /**
     * Regular expression used to check the string is a correct date string according to ISO 8601.
     * Taken from https://stackoverflow.com/a/3143231/6794376
     * We know, that using libraries like moment would be more reliable approach
     * (for example, moment(value, moment.ISO_8601, true).isValid()).
     * The reason we use regexp is to keep this package lightweight and free of dependencies.
     * If your server doesn't send you things like 14th month, this check is enough
     * @type {RegExp}
     */
    private static readonly DATE_STRING_REGEXP;
    /**
     * Check if passed value is an array
     * @param value
     * @returns {boolean}
     */
    static isArray(value: any): boolean;
    /**
     * Check if passed value is an object
     * @param value
     * @returns {boolean}
     */
    static isObject(value: any): boolean;
    /**
     * Check if passed value is a date
     * @param value
     * @returns {boolean}
     */
    static isDate(value: any): boolean;
    /**
     * Check if passed value is a date string (based on ISO 8601)
     * @param {string} value
     * @returns {boolean}
     */
    static isDateString(value: string): boolean;
}
