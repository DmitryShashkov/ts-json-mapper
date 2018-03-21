import { Correspondence } from './types';
import { Constants } from './constants';
import { Helpers } from './helpers';

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
export function ModelProperty (jsonField?: string, type?: any) : Function {
    return function (target: any, propertyKey : string, index : number) {
        // getting name of meta-field
        let key = Constants.CORRESPONDENCES_META_KEY;

        // forming the object that describes correspondence
        // between JSON and TS model fields
        let newCorrespondence: Correspondence = {
            modelField: propertyKey, jsonField, type
        };

        // forming array of correspondences
        Helpers.isArray(target[key])
            ? target[key].push(newCorrespondence)
            : target[key] = [ newCorrespondence ];
    }
}
