    // /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    id: Number,
    name: String,
    yes: Boolean,
    no: Boolean,
    answer: String,
    R: Number,
    fp: Number,
    Ne: Number,
    fl: Number,
    fi: Number,
    fc: Number,
    L: Number,
    N: Number
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Nodejs
module.exports = mongoose.model("Data", DataSchema);
