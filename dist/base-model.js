"use strict";
exports.__esModule = true;
var constants_1 = require("./constants");
var helpers_1 = require("./helpers");
/**
 * Base model class.
 * Constructor of this takes in JSON object and maps its fields to inner properties.
 * Depending on options described with 'ModelProperty' decorator, those fields
 * may be renamed or cast to specified types during this process
 */
var BaseModel = /** @class */ (function () {
    /**
     * Base model constructor. Performs mapping
     * @param options
     */
    function BaseModel(options) {
        // correspondences are written to prototype under certain key by @ModelProperty decorators
        var correspondences = this['__proto__'][constants_1.Constants.CORRESPONDENCES_META_KEY];
        // actual mapping: deserialize JSON values, mapping them to model properties,
        // relying on described correspondences
        for (var _i = 0, correspondences_1 = correspondences; _i < correspondences_1.length; _i++) {
            var correspondence = correspondences_1[_i];
            // if 'jsonField' was not specified, property name stays the same
            var dataField = correspondence.jsonField || correspondence.modelField;
            this[correspondence.modelField] = this.deserializeValue(options[dataField], correspondence.type);
        }
    }
    /**
     * Deserialize value depending on its type
     * @param value - value to deserialize
     * @param targetClass - class to cast value to (if needed)
     * @returns
     */
    BaseModel.prototype.deserializeValue = function (value, targetClass) {
        var _this = this;
        // if value is an array, deserialize each of its items
        if (helpers_1.Helpers.isArray(value)) {
            return value.map(function (item) { return _this.deserializeValue(item, targetClass); });
        }
        // if value is JS object, pass it to constructor of corresponding class
        if (helpers_1.Helpers.isObject(value)) {
            var object = Object.create(targetClass.prototype);
            object.constructor.call(object, value);
            return object;
        }
        // if value is a correct date string, cast it to Date
        if (helpers_1.Helpers.isDateString(value)) {
            return new Date(value);
        }
        // primitives do not require processing
        return value;
    };
    /**
     * Serialize value depending on its type
     * @param value - value to serialize
     * @returns
     */
    BaseModel.prototype.serializeValue = function (value) {
        var _this = this;
        // if value is an array, serialize each of its items
        if (helpers_1.Helpers.isArray(value)) {
            return value.map(function (item) { return _this.serializeValue(item); });
        }
        // if value is a date, convert it to ISO string
        if (helpers_1.Helpers.isDate(value)) {
            return value.toISOString();
        }
        // if value is an object, we call 'toJSON' method of it,
        // suggesting that object was also extended from 'BaseModel'
        if (!!value && helpers_1.Helpers.isObject(value)) {
            return value.toJSON();
        }
        // primitives do not require processing
        return value;
    };
    /**
     * Map properties to initial state (back to JSON)
     * @returns
     */
    BaseModel.prototype.toJSON = function () {
        // retrieving the same correspondences that were used for initial mapping
        var correspondences = this['__proto__'][constants_1.Constants.CORRESPONDENCES_META_KEY];
        var result = {};
        // serializing TS model properties to their initial state
        for (var _i = 0, correspondences_2 = correspondences; _i < correspondences_2.length; _i++) {
            var correspondence = correspondences_2[_i];
            var dataField = correspondence.jsonField || correspondence.modelField;
            var serialized = this.serializeValue(this[correspondence.modelField]);
            // result only contains defined fields
            if (serialized !== undefined) {
                result[dataField] = serialized;
            }
        }
        return result;
    };
    return BaseModel;
}());
exports.BaseModel = BaseModel;
