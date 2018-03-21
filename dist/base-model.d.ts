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
