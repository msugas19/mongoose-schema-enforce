/**
 * Created by msugas19 on 6/13/17.
 */

'use strict';

var async = require('async');

module.exports = {
    findSchemaSafePlugin: findSchemaSafePlugin
};

function findSchemaSafePlugin(schema) {
    schema.statics.findSchemaSafe = function findSchemaSafe(condition,options, callback) {
        var self = this;

        self.find(condition, function (err, results) {
            if (err) {
                callback(err, null);
            } else {
                if(options === undefined || options === null || !options.hasOwnProperty('removeFields')){
                    options = {removeFields:null}
                }
                callback(null, iterateThroughSchema(schema,results, options));
            }
        });
    };
}






function iterateThroughSchema(schema, results, options) {
    var tasks = [];

    results.forEach(function (element, index, array) {
        array[index] = iterateNestedObjects(schema, element, options);
    });

    return results;
}

function iterateNestedObjects(schema, result, options){

    var element = {};

    Object.keys(schema.paths).forEach(function (key, ind, arr) {
        if (schema.paths[key].hasOwnProperty("schema")) {
            //element[key] = {};
            element[key]= iterateNestedObjects(schema.paths[key].schema,result[key], options);
        } else {
            //element[key] = result.hasOwnProperty(key) ? result[key] : null;
            element[key] = result[key] ? result[key] : null;
        }
    });

    if(options.removeFields !== null){
        //Remove specified fields
        options.removeFields.forEach(function(field){
            try{
                delete element[field];
            } catch(err){
                console.warn("Object does not contain field to delete: " + field);
            }

        });
    }

    return element;

}
