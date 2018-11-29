const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const path = require("path");

const API_PORT = 3001;
const app = express();
const router = express.Router();

require('dotenv').config();
// this is our MongoDB database
const dbRoute = process.env.DATABASE;

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, name, yes, no, answer, R, fp, Ne, fl, fi, fc, L, N } = req.body;

  if ((!id && id !== 0) || !name || !answer || !R || !fp || !Ne || !fl || !fi || !fc || !L || !N) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.name = name;
  data.id = id;
  data.yes = yes;
  data.no = no;
  data.answer = answer;
  data.R = R;
  data.fp = fp;
  data.Ne = Ne;
  data.fl = fl;
  data.fi = fi;
  data.fc = fc;
  data.L = L;
  data.N = N;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve("../client/build", "index.html"))
  );

  // append /api for our http requests
  app.use("/api", router);
}


// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));