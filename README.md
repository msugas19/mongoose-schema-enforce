# mongoose-schema-enforce
Ensures that all fields in your Mongoose model show up in your output data, whether they are in your DB or not. Used for the purpose of enforcing fields in your Mongoose Schema to always show up in your Model.Find() queries.

## findSchemaSafe Method
Takes three parameters: findSchemaSafe(condition, options, callback). The condition parameter is your query conditions that you would use inside your regular Db.Collection.Find() queries. The options parameter is an options object that can specify a removeFields key with an array value. Inside that array must be strings that are the names of fields you would like removed from your result. The callback parameter is a user specified callback function that has your standard (err, response) attributes passed to it.

### How to use without options
```
var schemaEnforcer = require('mongoose-schema-enforce'); 

var mySchema = mongoose.Schema({myAttr1: String, myAttr2: Object});

mySchema.plugin(schemaEnforcer.findSchemaSafePlugin);

var myModel = mongoose.model('myModel', mySchema);

myModel.findSchemaSafe({myAttr1:'MyValue'}, {}, function(err, response){
  if(err){
    //Do something
  } else { 
    //Do something else
  }
});
```

### How to use with options

```
var schemaEnforcer = require('mongoose-schema-enforce'); 

var mySchema = mongoose.Schema({myAttr1: String, myAttr2: Object});

mySchema.plugin(schemaEnforcer.findSchemaSafePlugin);

var myModel = mongoose.model('myModel', mySchema);

myModel.findSchemaSafe({myAttr1:'MyValue'}, {removeFields:['_id', '__v']}, function(err, response){
  if(err){
    //Do something
  } else { 
    //Do something else
  }
});
```

## enforceSchema Method

#### Parameters
Takes three Parameters: enforceSchema(schema, results, options). Schema is your mongoose.schema , results is the JSON object you wish to reflect your schema, and options is the same structure and functionality as mentioned above. It will return your new, schema-enforced JSON object.

#### Why expose this too?
This method is what is used internally to enforce your schema structure onto the returned results in findSchemaSafe. By exposing it, I am providing the capabilities to transform any JSON structure, no matter how complex, into the form of your defined mongoose schema. This could be used before updates to ensure no fields are missing, or after complex find and aggregate calls where you know the desired output response. This transformation will only remove the fields that you specify in the options. Otherwise, it will only add missing fields to your object.

### How to use with options
```
var schemaEnforcer = require('mongoose-schema-enforce'); 

var mySchema = mongoose.Schema({myAttr1: String, myAttr2: Object});

var myJSONObject = {
                    _id: NumberLong(123231231223123123123),
                    myAttr1: "valueHere",
                    dateUpdated: ISODate("2017-04-25T21:42:50.994Z")
   };

var schemaEnforcedObject = schemaEnforcer.enforceSchema(mySchema, myJSONObject, {removeFields: ['_id', 'dateUpdated']});

console.log("New object is: " + JSON.stringify(schemaEnforcedObject));
//New object is: {"myAttr1":"valueHere", "myAttr2": null}

```


### How to use without options
```
var schemaEnforcer = require('mongoose-schema-enforce'); 

var mySchema = mongoose.Schema({myAttr1: String, myAttr2: Object});

var myJSONObject = {
                    _id: 101.0,
                    myAttr1: "valueHere",
                    dateUpdated: null
   };

var schemaEnforcedObject = schemaEnforcer.enforceSchema(mySchema, myJSONObject, {});

console.log("New object is: " + JSON.stringify(schemaEnforcedObject));
//New object is: {"_id": 101.0, "myAttr1":"valueHere", "dateUpdated": null, "myAttr2": null}

```

### Find something wrong? 
Report an issue or contribute on Github!
https://github.com/msugas19/mongoose-schema-enforce
