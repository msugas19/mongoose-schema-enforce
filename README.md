# mongoose-schema-enforce
Ensures that all fields in your Mongoose model show up in your output data, whether they are in your DB or not. Used for the purpose of enforcing fields in your Mongoose Schema to always show up in your Model.Find() queries.

# findSchemaSafe Method
Takes three parameters: findSchemaSafe(condition, options, callback). The condition parameter is your query conditions that you would use inside your regular Db.Collection.Find() queries. The options parameter is an options object that can specify a removeFields key with an array value. Inside that array must be strings that are the names of fields you would like removed from your result. The callback parameter is a user specified callback function that has your standard (err, response) attributes passed to it.

# How to use without options
```
var findSchemaSafe = require('mongoose-schema-enforce'); 

var mySchema = mongoose.Schema({myAttr1: String, myAttr2: Object});

mySchema.plugin(findSchemaSafe);

var myModel = mongoose.model('myModel', mySchema);

myModel.findSchemaSafe({myAttr1:'MyValue'}, {}, function(err, response){
  if(err){
    //Do something
  } else { 
    //Do something else
  }
});
```

# How to use with options

```
var findSchemaSafe = require('mongoose-schema-enforce'); 

var mySchema = mongoose.Schema({myAttr1: String, myAttr2: Object});

mySchema.plugin(findSchemaSafe);

var myModel = mongoose.model('myModel', mySchema);

myModel.findSchemaSafe({myAttr1:'MyValue'}, {removeFields:['_id', '__v']}, function(err, response){
  if(err){
    //Do something
  } else { 
    //Do something else
  }
});
```


