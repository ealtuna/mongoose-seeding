import * as minimist from "minimist";
import { seedSchema } from "./lib/seeder";
import { selectSchema } from "./lib/parser";
import { Schema } from "mongoose";
import { exitWithMsg } from "./lib/util";
import { persist } from "./lib/database";

interface CommandLineOptions {
    fileName: string;
    objectName?: string;
    database: string;
    collection: string;
    numberOfDocuments: number;
}

const args = minimist(process.argv.slice(2));
const options: CommandLineOptions = {
    fileName: args.f ? args.f : exitWithMsg("No file name provided"),
    objectName: args.o ? args.o : undefined,
    database: args.d ? args.d : undefined,
    collection: args.c ? args.c
        : (args.d ? exitWithMsg("Connection string provided but collection name missing") : undefined),
    numberOfDocuments: args.n ? parseInt(args.n) : 1
};

const schema: Schema = selectSchema(options.fileName, options.objectName);

if (options.database) {
    persist(schema, seedSchema, options.numberOfDocuments, options.database, options.collection)
        .then((inserted) => {
            exitWithMsg(`Successfully persisted ${inserted} documents in database`, false);
        });
} else {
    console.log(seedSchema(schema));
}
