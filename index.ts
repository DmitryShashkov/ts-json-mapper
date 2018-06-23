/**
 * Class containing helper functions
 */
class Helpers {
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
     * Regular expression used to check the json field is a nested field.
     * @type {RegExp}
     */
    private static readonly NESTED_JSON_KEY_REGEXP = /[a-z0-9-_]+/g;

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

    /**
     * Check if passed value is a nested json field
     * @param {string} value
     * @returns {RegExpMatchArray | null}
     */
    public static getNestedFields (value: string): RegExpMatchArray | null{
        return value.match(Helpers.NESTED_JSON_KEY_REGEXP)
    }
}

/**
 * Class containing constants
 */
class Constants {
    /**
     * Name of the field that will be injected to object prototype
     * and contain list of correspondences required for mapping (meta-data)
     * @type {string}
     */
    public static readonly CORRESPONDENCES_META_KEY = '__correspondences';
}

/**
 * Interface that describes correspondence between
 * fields in JSON and in TS model.
 */
interface Correspondence {
    // name of the field in JSON
    readonly jsonField: string;

    // name of the field in TS model
    readonly modelField: string;

    // type of the field in TS model
    readonly type: any;

    // type of the field in TS model 
    readonly required: boolean;
}

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
export function ModelProperty (jsonField: string = "", type?: any, required: boolean = false) : Function {
    return function (target: any, propertyKey : string, index : number) {
        // getting name of meta-field
        let key = Constants.CORRESPONDENCES_META_KEY;

        // forming the object that describes correspondence
        // between JSON and TS model fields
        let newCorrespondence: Correspondence = {
            modelField: propertyKey, jsonField, type, required
        };

        // forming array of correspondences
        Helpers.isArray(target[key])
            ? target[key].push(newCorrespondence)
            : target[key] = [ newCorrespondence ];
    }
}

/**
 * Base model class.
 * Constructor of this takes in JSON object and maps its fields to inner properties.
 * Depending on options described with 'ModelProperty' decorator, those fields
 * may be renamed or cast to specified types during this process
 */
export class BaseModel {
    /**
     * Find value based on json field key
     * @param options
     * @param {string} jsonField - name of the field in JSON
     * @returns {object}
     */
    private findValue (options: any, jsonField: string) {

        // init an empty value
        let value: any = undefined

        // get nested fields from jsonField
        const nestedFields = Helpers.getNestedFields(jsonField)

        // check if jsonField has nested fields
        if(nestedFields){

        // loop through nested fields 
        nestedFields.forEach(field => {
            value = value ? value[field] : options[field]
        });
        
        }else{
        value = options[jsonField]
        }
        
        return value
    }

    /**
     * Deserialize value depending on its type
     * @param value - value to deserialize
     * @param targetClass - class to cast value to (if needed)
     * @param {string} jsonField - name of the field in JSON
     * @param {boolean} required - force deserialize value
     * @returns
     */
    private deserializeValue (value: any, targetClass: any, jsonField: string, required: boolean = false) {
        // if value is an array, deserialize each of its items
        if (Helpers.isArray(value)) {
            return value.map((item) => this.deserializeValue(item, targetClass, jsonField, required));
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

        // if value is required
        if (required && !value){
            throw new Error("Value for json field '" + jsonField + "' not found")
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
            this[correspondence.modelField] = this.deserializeValue(this.findValue(options, dataField), correspondence.type, correspondence.jsonField, correspondence.required);
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