const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

const ujianRoutes = require("../routes/ujian");
app.use("/", ujianRoutes);

// ❌ JANGAN app.listen
module.exports = app;
