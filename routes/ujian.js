const express = require("express");
const axios = require("axios");
const db = require("../config/db");
const router = express.Router();

/* ===============================
   KONFIGURASI TELEGRAM
   =============================== */
const BOT_TOKEN = "8027856787:AAFywd0Qbh0Tzu2T0iJ5f7EzaPx4mrz4Hsw";
const CHAT_ID = "7300874397";

/* ===============================
   HALAMAN LOGIN
   =============================== */
router.get("/", (req, res) => {
    res.render("login");
});

/* ===============================
   PROSES LOGIN
   =============================== */
router.post("/login", (req, res) => {
    const { nama, kelas } = req.body;

    if (!nama || !kelas) {
        return res.send("Nama dan kelas wajib diisi");
    }

    res.redirect(`/soal?nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}`);
});

/* ===============================
   HALAMAN SOAL
   =============================== */
router.get("/soal", (req, res) => {
    db.query("SELECT * FROM soal ORDER BY id ASC", (err, soal) => {
        if (err) {
            console.error(err);
            return res.send("Gagal mengambil soal");
        }

        if (soal.length === 0) {
            return res.send("Soal belum diinput di database");
        }

        res.render("soal", {
            soal,
            query: req.query
        });
    });
});

/* ===============================
   SUBMIT JAWABAN + HITUNG NILAI
   =============================== */
router.post("/submit", (req, res) => {
    const { nama, kelas } = req.body;
    let benar = 0;

    db.query("SELECT * FROM soal", async (err, soal) => {
        if (err) {
            console.error(err);
            return res.send("Error membaca soal");
        }

        // HITUNG JAWABAN BENAR
        soal.forEach(s => {
            const jawabanSiswa = req.body[`soal_${s.id}`];
            if (jawabanSiswa === s.jawaban) {
                benar++;
            }
        });

        const totalSoal = soal.length;
        const nilai = Math.round((benar / totalSoal) * 100);

        // SIMPAN KE DATABASE
        db.query(
            "INSERT INTO hasil (nama, kelas, skor) VALUES (?,?,?)",
            [nama, kelas, nilai]
        );

        // KIRIM KE TELEGRAM
        try {
            await axios.post(
                `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
                {
                    chat_id: CHAT_ID,
                    text:
                        `📘 HASIL UJIAN TIK
━━━━━━━━━━━━━━
👤 Nama  : ${nama}
🏫 Kelas : ${kelas}
📝 Benar : ${benar} / ${totalSoal}
📊 Nilai : ${nilai} / 100
━━━━━━━━━━━━━━`
                }
            );
        } catch (e) {
            console.error("Telegram error:", e.message);
        }

        // TAMPILKAN HASIL
        res.render("hasil", {
            nama,
            kelas,
            nilai
        });
    });
});

/* ===============================
   HALAMAN ADMIN
   =============================== */
router.get("/admin", (req, res) => {
    db.query("SELECT * FROM hasil ORDER BY id DESC", (err, data) => {
        if (err) return res.send("Error admin");
        res.render("admin", { data });
    });
});

module.exports = router;
