import { Correspondence } from './types';
import { Constants } from './constants';
import { Helpers } from './helpers';

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
    private deserializeValue (value: any, targetClass: any) {
        // if value is an array, deserialize each of its items
        if (Helpers.isArray(value)) {
            return value.map((item) => this.deserializeValue(item, targetClass));
        }

        // if value is JS object, pass it to constructor of corresponding class
        if (Helpers.isObject(value)) {
            let object = Object.create(targetClass.prototype);
            object.constructor.call(object, value);
            return object;
        }

        // if value is a correct date string, cast it to Date
        if (Helpers.isDateString(value)) {
            return new Date(value);
        }

        // primitives do not require processing
        return value;
    }

    /**
     * Serialize value depending on its type
     * @param value - value to serialize
     * @returns
     */
    private serializeValue (value: any) : any {
        // if value is an array, serialize each of its items
        if (Helpers.isArray(value)) {
            return (value as any[]).map((item) => this.serializeValue(item));
        }

        // if value is a date, convert it to ISO string
        if (Helpers.isDate(value)) {
            return value.toISOString();
        }

        // if value is an object, we call 'toJSON' method of it,
        // suggesting that object was also extended from 'BaseModel'
        if (!!value && Helpers.isObject(value)) {
            return (<BaseModel>value).toJSON();
        }

        // primitives do not require processing
        return value;
    }

    /**
     * Base model constructor. Performs mapping
     * @param options
     */
    constructor (options: any) {
        // correspondences are written to prototype under certain key by @ModelProperty decorators
        let correspondences: Correspondence[] = this['__proto__'][Constants.CORRESPONDENCES_META_KEY];

        // actual mapping: deserialize JSON values, mapping them to model properties,
        // relying on described correspondences
        for (let correspondence of correspondences) {
            // if 'jsonField' was not specified, property name stays the same
            let dataField = correspondence.jsonField || correspondence.modelField;
            this[correspondence.modelField] = this.deserializeValue(options[dataField], correspondence.type);
        }
    }

    /**
     * Map properties to initial state (back to JSON)
     * @returns
     */
    public toJSON () : { [key: string]: any } {
        // retrieving the same correspondences that were used for initial mapping
        let correspondences: Correspondence[] = this['__proto__'][Constants.CORRESPONDENCES_META_KEY];
        let result: any = {};

        // serializing TS model properties to their initial state
        for (let correspondence of correspondences) {
            let dataField = correspondence.jsonField || correspondence.modelField;
            let serialized: any = this.serializeValue(this[correspondence.modelField]);

            // result only contains defined fields
            if (serialized !== undefined) {
                result[dataField] = serialized;
            }
        }

        return result;
    }
}