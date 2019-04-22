export function exitWithMsg(msg: string, error = true) {
    console.error(msg);
    process.exit(error ? 1 : 0);
}

export function isMongooseSchema(schemaCandidate: any): boolean {
    return schemaCandidate && schemaCandidate.constructor.name === "Schema" && "paths" in schemaCandidate;
}

export function isMongooseModel(modelCandidate: any): boolean {
    return "modelName" in modelCandidate 
        && "model" in modelCandidate 
        && "db" in modelCandidate 
        && "schema" in modelCandidate 
        && isMongooseSchema(modelCandidate.schema);
}