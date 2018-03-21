"use strict";
exports.__esModule = true;
var constants_1 = require("./constants");
var helpers_1 = require("./helpers");
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
function ModelProperty(jsonField, type) {
    return function (target, propertyKey, index) {
        // getting name of meta-field
        var key = constants_1.Constants.CORRESPONDENCES_META_KEY;
        // forming the object that describes correspondence
        // between JSON and TS model fields
        var newCorrespondence = {
            modelField: propertyKey, jsonField: jsonField, type: type
        };
        // forming array of correspondences
        helpers_1.Helpers.isArray(target[key])
            ? target[key].push(newCorrespondence)
            : target[key] = [newCorrespondence];
    };
}
exports.ModelProperty = ModelProperty;
