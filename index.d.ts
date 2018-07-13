/**
 * Decorator for model properties.
 * Should decorate properties in classes extended from 'BaseModel'.
 * Adds meta-field to object's prototype. That meta-field will contain
 * list of objects describing correspondences between fields in JSON and TS model.
 * 'BaseModel' constructor will use those correspondences for mapping
 * @param {string} jsonField - name of the field in JSON, that should be mapped to decorated property
 * @param type - class of decorated property (in case it belongs to composite type)
 * @param {boolean} required - to force parse value, or will throw an exception
 * @returns {Function}
 */
export declare function ModelProperty(jsonField?: string, type?: any, required?: boolean): Function;
/**
 * Base model class.
 * Constructor of this takes in JSON object and maps its fields to inner properties.
 * Depending on options described with 'ModelProperty' decorator, those fields
 * may be renamed or cast to specified types during this process
 */
export declare class BaseModel {
    /**
     * Deserialize value depending on its type
     * @param value - value to deserialize
     * @param targetClass - class to cast value to (if needed)
     * @param {string} jsonField - name of the field in JSON
     * @param {boolean} required - force deserialize value
     * @returns
     */
    private deserializeValue(value, targetClass, jsonField, required?);
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
