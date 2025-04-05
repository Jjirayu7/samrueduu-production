const express = require('express');
const app = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const postmark = require("postmark");
const fileUpload = require("express-fileupload");
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const sharp = require('sharp');

app.use(cors());
app.use(fileUpload());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dotenv.config();

// ✅ กำหนดค่า `uploadDir` ให้ถูกต้อง
const uploadDir = path.join(__dirname, "../uploads");

async function getNextBannerName(ext) {
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const files = await fs.promises.readdir(uploadDir);
    
    let maxNum = 0;
    files.forEach(file => {
        const match = file.match(/^banner(\d+)\./);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });

    return `banner${maxNum + 1}.${ext}`;
}
// app.post("/banner/upload", async (req, res) => {
//     try {
//         if (!req.files?.img) {
//             return res.status(400).send({ error: "No files were uploaded." });
//         }

//         const img = req.files.img;
//         const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
//         const ext = path.extname(img.name).toLowerCase().replace(".", "");

//         if (!allowedExtensions.includes(ext)) {
//             return res.status(400).send({ error: "Invalid file type. Only images are allowed." });
//         }

//         const newName = await getNextBannerName(ext);
//         const filePath = path.join(uploadDir, newName);
        
//         await img.mv(filePath);
//         res.send({ newName });

//     } catch (e) {
//         console.error("Error in upload:", e.message);
//         res.status(500).send({ message: e.message });
//     }
// });

app.post("/banner/upload", async (req, res) => {
    try {
        if (!req.files?.img) {
            return res.status(400).send({ error: "No files were uploaded." });
        }

        const img = req.files.img;
        const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
        const ext = path.extname(img.name).toLowerCase().replace(".", "");

        if (!allowedExtensions.includes(ext)) {
            return res.status(400).send({ error: "Invalid file type. Only images are allowed." });
        }

        const newName = await getNextBannerName("jpg"); // ใช้ .jpg เพื่อลดขนาดไฟล์
        const filePath = path.join(uploadDir, newName);

        // ใช้ sharp เพื่อลดขนาดภาพและบันทึกไฟล์ใหม่
        await sharp(img.data)
            .resize(1200) 
            .jpeg({ quality: 90 })
            .toFile(filePath);

        // บันทึกลงฐานข้อมูล
        const media = await prisma.media.create({
            data: { src: `/uploads/${newName}` },
        });

        res.send({ newName: media.src });

    } catch (e) {
        console.error("Error in upload:", e.message);
        res.status(500).send({ message: e.message });
    }
});

app.get("/banner", async (req, res) => {
    try {
        const banners = await prisma.media.findMany();
        res.send(banners);
    } catch (e) {
        console.error("Error fetching banners:", e.message);
        res.status(500).send({ message: e.message });
    }
});

app.delete("/banner/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await prisma.media.findUnique({ where: { id: Number(id) } });

        if (!banner) {
            return res.status(404).send({ error: "Banner not found" });
        }

        // ลบไฟล์จากเซิร์ฟเวอร์
        const filePath = path.join(__dirname, banner.src);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // ลบจากฐานข้อมูล
        await prisma.media.delete({ where: { id: Number(id) } });

        res.send({ message: "Banner deleted successfully" });

    } catch (e) {
        console.error("Error deleting banner:", e.message);
        res.status(500).send({ message: e.message });
    }
});

app.put("/banner/:id", async (req, res) => {
    try {
        if (!req.files?.img) {
            return res.status(400).send({ error: "No files were uploaded." });
        }

        const { id } = req.params;
        const banner = await prisma.media.findUnique({ where: { id: Number(id) } });

        if (!banner) {
            return res.status(404).send({ error: "Banner not found" });
        }

        // ลบไฟล์เก่าก่อน
        const oldFilePath = path.join(__dirname, banner.src);
        if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
        }

        // อัปโหลดไฟล์ใหม่
        const img = req.files.img;
        const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
        const ext = path.extname(img.name).toLowerCase().replace(".", "");

        if (!allowedExtensions.includes(ext)) {
            return res.status(400).send({ error: "Invalid file type. Only images are allowed." });
        }

        const newName = await getNextBannerName(ext);
        const filePath = path.join(uploadDir, newName);

        await img.mv(filePath);

        // อัปเดตฐานข้อมูล
        const updatedBanner = await prisma.media.update({
            where: { id: Number(id) },
            data: { src: `/uploads/${newName}` },
        });

        res.send(updatedBanner);

    } catch (e) {
        console.error("Error updating banner:", e.message);
        res.status(500).send({ message: e.message });
    }
});



module.exports = app;
