const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

/* MIDDLEWARE */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* VIEW ENGINE */
app.set("view engine", "ejs");

/* ROUTES */
const ujianRoutes = require("./routes/ujian");
app.use("/", ujianRoutes);

/* PORT (WAJIB UNTUK RAILWAY) */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
