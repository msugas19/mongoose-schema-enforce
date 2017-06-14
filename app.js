/**
 * Created by msugas19 on 6/13/17.
 */

'use strict';


module.exports = {
    findSchemaSafePlugin : findSchemaSafePlugin,
    enforceSchema : iterateThroughSchema
};

function findSchemaSafePlugin(schema) {
    schema.statics.findSchemaSafe = function findSchemaSafe(condition, options, callback) {
        var self = this;

        self.find(condition, function (err, results) {
            if (err) {
                callback(err, null);
            } else {
                if (options === undefined || options === null || !options.hasOwnProperty('removeFields') ||
                    typeof options['removeFields'] !== 'object') {
                    options = {removeFields: null}
                }
                callback(null, iterateThroughSchema(schema, results, options));
            }
        });
    };
}

function iterateThroughSchema(schema, results, options) {

    if(results === null ){return {};}

    results.forEach(function (element, index, array) {
        array[index] = iterateNestedObjects(schema, element, options);
    });


    return results;
}

function iterateNestedObjects(schema, result, options) {

    var element = {};

    Object.keys(schema.paths).forEach(function (key, ind, arr) {
        if (schema.paths[key].hasOwnProperty("schema")) {
            result[key] = result[key] ? result[key] : {};
            if(schema.paths[key].instance === "Array"){
                //Handle nested Arrays
                element[key] = iterateThroughSchema(schema.paths[key].schema, result[key], options);
            } else {
                //Handle nested objects
                element[key] = iterateNestedObjects(schema.paths[key].schema, result[key], options);
            }
        } else {
            element[key] = result[key] ? result[key] : null;
        }
    });

    if (options !== undefined && options.removeFields !== undefined && options.removeFields !== null) {
        //Remove specified fields
        try {

            options.removeFields.forEach(function (field) {
                try {
                    delete element[field];
                } catch (err) {
                    console.warn("Object does not contain field to delete: " + field);
                }
            });
        } catch (err) {
            console.warn("Options are not specified as an array");
        }
    }

    return element;

}
