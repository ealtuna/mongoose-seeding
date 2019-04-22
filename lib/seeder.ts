import { ObjectID } from "mongodb";
import * as faker from "faker";
import { Schema } from "mongoose";

// tslint:disable-next-line:no-any
const typesMap: { [k: string]: (d: any) => any } = {
    "ObjectID": seedObjectID,
    "String": seedString,
    "Boolean": seedBoolean,
    "Date": seedDate,
    "Number": seedNumber,
    "Embedded": seedEmbedded,
    "Array": seedArray
};

export function seedSchema(schema: Schema): { [k: string]: any } {
    return seedPaths((schema as any).paths);
}

function seedPaths(paths: { [k: string]: any }): { [k: string]: any } {
    return Object.entries(paths)
        .filter(([name]) => name !== "_id")
        .map(([name, definition]) => {
            return [name, seedType(definition)];
        })
        .reduce((p: any, c: any) => { // tslint:disable-line:no-any
            p[c[0]] = c[1];
            return p;
        }, {});
}

// tslint:disable-next-line:no-any
function seedType(definition: any) {
    if ("instance" in definition === false) {
        throw new Error(`No definition found for path ${definition["path"]}`);
    }
    if (definition["instance"] in typesMap === false) {
        throw new Error(`No schema type supported ${definition["instance"]} in path ${definition["path"]}`);
    }
    if ("options" in definition && "enum" in definition["options"]) {
        return seedEnum(definition);
    }
    return typesMap[definition["instance"] as string](definition);
}

function seedObjectID() {
    return new ObjectID();
}

// tslint:disable-next-line:no-any
function seedEnum(definition: any) {
    const options = definition["options"]["enum"];
    if (!Array.isArray(options) || options.length === 0) {
        throw new Error("Enum field found but no options identified");
    }
    return faker.random.arrayElement(definition["options"]["enum"]);
}

// tslint:disable-next-line:no-any
function seedString(definition: any) {
    return faker.random.word();
}

function seedBoolean() {
    return faker.random.boolean();
}

function seedDate() {
    return faker.date.past();
}

function seedNumber() {
    return faker.random.number();
}

// tslint:disable-next-line:no-any
function seedEmbedded(definition: any) {
    if ("schema" in definition === false || "paths" in definition["schema"] === false) {
        throw new Error("No paths definition in Embedded schema");
    }
    if ("_id" in definition["schema"]["options"] ===  false) {
        throw new Error("Expected _id internal argument in Embedded type schema options");
    }
    const embeddedOptions: { [k: string]: any } = {}; // tslint:disable-line:no-any
    if (definition["schema"]["options"]["_id"]) {
        embeddedOptions["_id"] = seedObjectID();
    }
    return Object.assign(embeddedOptions, seedPaths(definition["schema"]["paths"]));
}

// tslint:disable-next-line:no-any
function seedArray(definition: any) {
    const size = 5;
    if ("caster" in definition && "instance" in definition["caster"]) {
        // Simple data type
        return new Array(size)
            .map(() => typesMap[definition["caster"]["instance"]](definition["caster"]));
    } else if ("schema" in definition && "paths" in definition["schema"]) {
        // Embedded data type
        return [...new Array(size)].map(() => seedEmbedded(definition));
    }
    throw new Error("No type definition for Array schema");
}
