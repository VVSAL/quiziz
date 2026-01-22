const express = require("express");
const axios = require("axios");
const getPool = require("../config/db");

const router = express.Router();

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

/* LOGIN */
router.get("/", (req, res) => {
    res.render("login");
});

/* LOGIN POST */
router.post("/login", (req, res) => {
    const { nama, kelas } = req.body;
    res.redirect(`/soal?nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}`);
});

/* SOAL */
router.get("/soal", async (req, res) => {
    try {
        const pool = getPool();
        const [soal] = await pool.query("SELECT * FROM soal ORDER BY id ASC");
        res.render("soal", { soal, query: req.query });
    } catch (err) {
        console.error(err);
        res.send("DB Error soal");
    }
});

/* SUBMIT */
router.post("/submit", async (req, res) => {
    try {
        const pool = getPool();
        const { nama, kelas } = req.body;

        const [soal] = await pool.query("SELECT * FROM soal");

        let benar = 0;
        soal.forEach(s => {
            if (req.body[`soal_${s.id}`] === s.jawaban) benar++;
        });

        const nilai = Math.round((benar / soal.length) * 100);

        await pool.query(
            "INSERT INTO hasil (nama, kelas, skor) VALUES (?,?,?)",
            [nama, kelas, nilai]
        );

        if (BOT_TOKEN && CHAT_ID) {
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: `📘 HASIL UJIAN\nNama: ${nama}\nKelas: ${kelas}\nNilai: ${nilai}`
            });
        }

        res.render("hasil", { nama, kelas, nilai });
    } catch (err) {
        console.error(err);
        res.send("DB Error submit");
    }
});

/* ADMIN */
router.get("/admin", async (req, res) => {
    try {
        const pool = getPool();
        const [data] = await pool.query("SELECT * FROM hasil ORDER BY id DESC");
        res.render("admin", { data });
    } catch (err) {
        console.error(err);
        res.send("DB Error admin");
    }
});

module.exports = router;
