const express = require("express");
const multer = require("multer");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const prisma = new PrismaClient();


// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userCustomerId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


// POST /user/customer/upload-profile-image
app.post(
  "/upload-profile-image",
  authenticate,
  upload.single("profileImage"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profileImageUrl = `/uploads/${req.file.filename}`;

    try {
      await prisma.userCustomer.update({
        where: { id: req.userCustomerId },
        data: { profileImageUrl },
      });

      res.json({ message: "Profile image uploaded successfully", profileImageUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload profile image", error: error.message });
    }
  }
);

module.exports = app;
