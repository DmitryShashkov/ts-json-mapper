declare module "types" {
    /**
     * Interface that describes correspondence between
     * fields in JSON and in TS model.
     */
    export interface Correspondence {
        readonly jsonField: string;
        readonly modelField: string;
        readonly type: any;
    }
}
declare module "constants" {
    /**
     * Class containing constants
     */
    export class Constants {
        /**
         * Name of the field that will be injected to object prototype
         * and contain list of correspondences required for mapping (meta-data)
         * @type {string}
         */
        static readonly CORRESPONDENCES_META_KEY: string;
    }
}
declare module "helpers" {
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
}
declare module "model-property" {
    /**
     * Decorator for model properties.
     * Should decorate properties in classes extended from 'BaseModel'.
     * Adds meta-field to object's prototype. That meta-field will contain
     * list of objects describing correspondences between fields in JSON and TS model.
     * 'BaseModel' constructor will use those correspondences for mapping
     * @param {string} jsonField - name of the field in JSON, that should be mapped to decorated property
     * @param type - class of decorated property (in case it belongs to composite type)
     * @returns {Function}
     */
    export function ModelProperty(jsonField?: string, type?: any): Function;
}
declare module "base-model" {
    /**
     * Base model class.
     * Constructor of this takes in JSON object and maps its fields to inner properties.
     * Depending on options described with 'ModelProperty' decorator, those fields
     * may be renamed or cast to specified types during this process
     */
    export class BaseModel {
        /**
         * Deserialize value depending on its type
         * @param value - value to deserialize
         * @param targetClass - class to cast value to (if needed)
         * @returns
         */
        private deserializeValue(value, targetClass);
        /**
         * Serialize value depending on its type
         * @param value - value to serialize
         * @returns
         */
        private serializeValue(value);
        /**
         * Base model constructor. Performs mapping
         * @param options
         */
        constructor(options: any);
        /**
         * Map properties to initial state (back to JSON)
         * @returns
         */
        toJSON(): {
            [key: string]: any;
        };
    }
}
declare module "index" {
    export * from "model-property";
    export * from "base-model";
}
