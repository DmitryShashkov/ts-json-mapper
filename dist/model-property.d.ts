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
export declare function ModelProperty(jsonField?: string, type?: any): Function;
