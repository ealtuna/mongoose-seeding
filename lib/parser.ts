import * as path from "path";
import { Schema, Model } from "mongoose";
import { isMongooseSchema, isMongooseModel, exitWithMsg } from "./util";

function extractSchemasAndModels(filePath: string): Array<[string, Schema | Model<any>]> {
    const schemaFile: { [k: string]: any } = require(path.join(process.cwd(), filePath));
    return Object.entries(schemaFile).filter(([s, v]) => isMongooseSchema(v) || isMongooseModel(v));
}

export function selectSchema(filePath: string, objectName: string): Schema {
    const schemasAndModels = extractSchemasAndModels(filePath);
    if (schemasAndModels.length < 1) {
        exitWithMsg("No mongoose schema or model found in file");
    }
    if (schemasAndModels.length > 1 && !objectName) {
        exitWithMsg("Multiple schemas or models in file and no name provided");
    }
    const schemaOrModelTuple: [string, Schema | Model<any>] = schemasAndModels.length === 1
        ? schemasAndModels[0]
        : schemasAndModels.find(([k]) => k === objectName);
    if (!schemaOrModelTuple || !schemaOrModelTuple[1]) {
        exitWithMsg(`Schema not found in file`);
    }
    return isMongooseSchema(schemaOrModelTuple[1])
        ? schemaOrModelTuple[1] as Schema : (schemaOrModelTuple[1] as Model<any>).schema;
}
