const express = require("express");
const axios = require("axios");
const db = require("../config/db");

const router = express.Router();

const BOT_TOKEN = process.env.8027856787: AAFywd0Qbh0Tzu2T0iJ5f7EzaPx4mrz4Hsw;
const CHAT_ID = process.env.CHAT_ID;

/* LOGIN */
router.get("/", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    const { nama, kelas } = req.body;
    if (!nama || !kelas) return res.send("Data tidak lengkap");
    res.redirect(`/soal?nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}`);
});

/* SOAL */
router.get("/soal", (req, res) => {
    db.query("SELECT * FROM soal ORDER BY id ASC", (err, soal) => {
        if (err) return res.send("DB error soal");
        if (soal.length === 0) return res.send("Soal belum diisi");
        res.render("soal", { soal, query: req.query });
    });
});

/* SUBMIT */
router.post("/submit", (req, res) => {
    const { nama, kelas } = req.body;
    let benar = 0;

    db.query("SELECT * FROM soal", async (err, soal) => {
        if (err) return res.send("DB error");

        soal.forEach(s => {
            if (req.body[`soal_${s.id}`] === s.jawaban) {
                benar++;
            }
        });

        const nilai = Math.round((benar / soal.length) * 100);

        db.query(
            "INSERT INTO hasil (nama, kelas, skor) VALUES (?,?,?)",
            [nama, kelas, nilai]
        );

        if (BOT_TOKEN && CHAT_ID) {
            try {
                await axios.post(
                    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
                    {
                        chat_id: CHAT_ID,
                        text: `📘 HASIL UJIAN\nNama: ${nama}\nKelas: ${kelas}\nNilai: ${nilai}`
                    }
                );
            } catch (e) {
                console.error("Telegram error");
            }
        }

        res.render("hasil", { nama, kelas, nilai });
    });
});

/* ADMIN */
router.get("/admin", (req, res) => {
    db.query("SELECT * FROM hasil ORDER BY id DESC", (err, data) => {
        if (err) return res.send("DB error admin");
        res.render("admin", { data });
    });
});

module.exports = router;
