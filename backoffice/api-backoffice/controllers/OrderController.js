const express = require("express");
const bodyParser = require('body-parser');
const app = express.Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const exceljs = require("exceljs");
const fs = require("fs");
const path = require('path');  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


dotenv.config();

app.use(fileUpload());
  
app.put('/editInfo/:id', async (req, res) => {
try {
    const { id } = req.params;
    const { fullname, phone, address } = req.body;

    // ตรวจสอบว่ามี order ที่ตรงกับ id หรือไม่
    const existingOrder = await prisma.orders.findUnique({
        where: { id: parseInt(id) },
    });

    if (!existingOrder) {
        return res.status(404).json({ error: 'Order not found' });
    }

    // อัปเดตข้อมูล order
    const updatedOrder = await prisma.orders.update({
        where: { id: parseInt(id) },
        data: {
            fullname,
            phone,
            address,
        },
    });

    res.json(updatedOrder);
} catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
}
});

app.get("/order/:id", async (req, res) => {
    const orderId = req.params.id;  // Get order_id from the URL params
    try {
      // Fetch the order from the database using Prisma
      const selectedOrder = await prisma.orders.findUnique({
        where: {
          order_id: orderId,  // Use the order_id field for the search
        },
      });
  
      // If the order is not found, throw an error
      if (!selectedOrder) {
        throw {
          errorMessage: "Order not found",
        };
      }
  
      // Send the order as a JSON response
      res.json(selectedOrder);
    } catch (error) {
      console.log("error", error);
      res.status(404).json({ error: error.errorMessage || "System error" });
    }
  }); 

module.exports = app;
