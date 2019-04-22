# mongoose-model-faker

You can use this tool to generate example data from a file containing one or more mongoose schemas or models. 

## Install

     npm install -g mongoose-model-faker
     
### Usage

    mongoose-model-faker -f ./path/to/monngose.schema_or_model.file.js -d mongodb://localhost:27017/test -c collection -n 1000000
    
If the file contains more than one mongoose schema or model you need to provide the exported name of the object.

```
import { Schema, model } from "mongoose";

export const blogSchema = new Schema({
    title: String,
    author: String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    }
});

export const postModel = model("Blog", blogSchema);
```

In the previous file to generate data for blogSchema will be:

     mongoose-model-faker -f ./path/to/mongoose.schema.file.js -o blogSchema -d mongodb://localhost:27017/test -c collection -n 1000000

## Command line arguments

`-f` path of the javascript file to be scanned for mongoose schemas and models

`-o` name of the exported object (schema or model) to be used as template, if multiple are exported in the provided file

`-d` mongo connection string with database to insert the generated elements

`-c` collection name to be used to insert the elements
