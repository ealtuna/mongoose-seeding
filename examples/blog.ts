import { Schema, model } from "mongoose";

export const blogSchema = new Schema({
    title: String,
    author: String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: new Schema({
        votes: Number,
        fav: Number
    })
});

export const Blog = model('Blog', blogSchema);
