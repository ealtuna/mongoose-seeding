import { MongoClient, Collection } from "mongodb";

import { exitWithMsg } from "./util";
import { Schema } from "mongoose";

let collection: Collection;

async function connect(connectionString: string, collectionName: string) {
    const connection = await (new MongoClient(connectionString, { useNewUrlParser: true })).connect();
    const database = connection.db();
    if (!database || !database.databaseName) {
        exitWithMsg("No database specified in the connection string");
    }
    collection = database.collection(collectionName);
}

const BATCH_SIZE = 1000;

async function persistBath(schema: Schema, seeder: (d: Schema) => any, batchSize: number): Promise<number> {
    const documents = [...new Array(batchSize)].map(() => seeder(schema));
    const opResult = await collection.insertMany(documents);
    return opResult.insertedCount;
}

async function persistWithBatches(schema: Schema, seeder: (d: Schema) => any, numberOfDocuments: number): Promise<number> {
    let insertedCount = 0;
    while (numberOfDocuments > 0) {
        const batchSize = Math.min(numberOfDocuments, BATCH_SIZE);
        numberOfDocuments -= batchSize;
        insertedCount += await persistBath(schema, seeder, batchSize);
    }
    return insertedCount;
}

export async function persist(
    schema: Schema, seeder: (d: Schema) => any, numberOfDocuments: number
    , connectionString: string, collectionName: string
): Promise<number> {
    if (!collection) {
        await connect(connectionString, collectionName);
    }
    return persistWithBatches(schema, seeder, numberOfDocuments);
}
