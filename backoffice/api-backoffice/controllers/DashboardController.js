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
const cors = require('cors');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

dotenv.config();

//   app.get('/daily-sales', async (req, res) => {
//     try {
//       const { month, year } = req.query; // ดึงเดือนและปีจากพารามิเตอร์ query
  
//       if (!month || isNaN(month) || month < 1 || month > 12) {
//         return res.status(400).send({ error: 'Invalid month parameter' });
//       }
  
//       if (!year || isNaN(year)) {
//         return res.status(400).send({ error: 'Invalid year parameter' });
//       }
  
//       // ใช้ปีที่ได้รับจาก query แทนปีปัจจุบัน
//       const myDate = new Date(year, 0); // ปีที่ได้รับจาก query
//       const fullYear = myDate.getFullYear(); // ปีจาก query
  
//       // จำนวนวันในเดือนที่เลือก
//       const daysInMonth = new Date(fullYear, month, 0).getDate();
  
//       // สร้างอาร์เรย์สำหรับข้อมูลยอดขายรายวัน
//       let dailySales = Array(daysInMonth).fill({ date: null, amount: 0 });
  
//       // ค้นหาคำสั่งซื้อในเดือนที่เลือก
//       const billSaleInMonth = await prisma.orders.findMany({
//         where: {
//           createdAt: {
//             gte: new Date(fullYear, month - 1, 1), // วันที่เริ่มต้นของเดือน
//             lte: new Date(fullYear, month, 0), // วันที่สิ้นสุดของเดือน
//           },
//         },
//       });
  
//       // สำหรับแต่ละคำสั่งซื้อ (order)
//       for (let i = 0; i < billSaleInMonth.length; i++) {
//         const billSaleObject = billSaleInMonth[i];
  
//         // คำนวณยอดรวมของ `price` จาก `orderDetail`
//         const sum = await prisma.orderDetail.aggregate({
//           _sum: {
//             price: true, // คำนวณยอดรวมของ `price`
//           },
//           where: {
//             ordersId: billSaleObject.id, // เชื่อมโยง `ordersId` กับคำสั่งซื้อที่กำหนด
//           },
//         });
  
//         // คำนวณวันในเดือน
//         const dayOfMonth = billSaleObject.createdAt.getDate() - 1; // หยิบวันจาก createdAt (0-based)
  
//         // เพิ่มยอดขายในวันนั้น
//         dailySales[dayOfMonth] = {
//           date: billSaleObject.createdAt.toLocaleDateString('th-TH'), // วันในรูปแบบไทย
//           amount: (dailySales[dayOfMonth].amount || 0) + (sum._sum.price || 0), // รวมยอดขายในวันนั้น
//         };
//       }
  
//       // ส่งผลลัพธ์กลับไป
//       res.send({ month, year: fullYear, sales: dailySales });
//     } catch (error) {
//       // ส่งข้อความ error หากเกิดข้อผิดพลาด
//       res.status(500).send({ error: error.message });
//     }
//   });

//   app.get('/available-years', async (req, res) => {
//     try {
//         const years = await prisma.orders.findMany({
//             select: {
//                 createdAt: true,
//             },
//             distinct: ['createdAt'],
//         });

//         // แปลงปีจาก createdAt
//         const availableYears = years.map(order => new Date(order.createdAt).getFullYear());
//         const uniqueYears = [...new Set(availableYears)]; // กรองปีที่ซ้ำออก

//         res.send({ years: uniqueYears });
//     } catch (error) {
//         res.status(500).send({ error: error.message });
//     }
// });

//   app.get('/dashboard', async (req, res) => {
//     try {
//       const { year } = req.query;
//       if (!year || isNaN(year)) {
//         return res.status(400).send({ error: 'Invalid year parameter' });
//       }
  
//       let arr = [];
//       let myDate = new Date();
//       let selectedYear = parseInt(year);
  
//       // วนลูปเพื่อดึงข้อมูลจากแต่ละเดือน (1 - 12)
//       for (let i = 1; i <= 12; i++) {
//         const daysInMonth = new Date(selectedYear, i, 0).getDate(); // จำนวนวันในเดือน
  
//         // ค้นหาคำสั่งซื้อในเดือนนั้น ๆ
//         const billSaleInMonth = await prisma.orders.findMany({
//           where: {
//             createdAt: {  // ใช้ `createdAt` เพื่อกรองคำสั่งซื้อในเดือนนั้น ๆ
//               gte: new Date(selectedYear, i - 1, 1),  // เดือน i (1-based) แต่ `Date` ต้องใช้ 0-based เดือน
//               lte: new Date(selectedYear, i, 0),  // วันที่สุดท้ายของเดือน
//             },
            
//           },
//         });
  
//         // สำหรับแต่ละคำสั่งซื้อ (order)
//         for (let j = 0; j < billSaleInMonth.length; j++) {
//           const billSaleObject = billSaleInMonth[j];
  
//           // คำนวณยอดรวมของ `price` จาก `orderDetail`
//           const sum = await prisma.orderDetail.aggregate({
//             _sum: {
//               price: true,  // คำนวณยอดรวมของ `price`
//             },
//             where: {
//               ordersId: billSaleObject.id,  // เชื่อมโยง `ordersId` กับคำสั่งซื้อที่กำหนด
//             },
//           });
  
//           // เพิ่มข้อมูลในอาร์เรย์
//           arr.push({
//             month: i,
//             sumPrice: sum._sum.price ?? 0, // ใช้ราคา 0 หากไม่มีข้อมูล
//           });
//         }
//       }
  
//       // ส่งผลลัพธ์กลับไป
//       res.send({ result: arr });
//     } catch (error) {
//       // ส่งข้อความ error หากเกิดข้อผิดพลาด
//       res.status(500).send({ error: error.message });
//     }
//   });

  app.get("/best-selling-products", async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || isNaN(Number(year))) {
            return res.status(400).json({ error: "Invalid year parameter" });
        }

        const fullYear = parseInt(year, 10);
        const fullMonth = month && !isNaN(Number(month)) && month >= 1 && month <= 12 
            ? parseInt(month, 10) 
            : null;

        // กำหนดช่วงวันที่
        const startDate = new Date(fullYear, 0, 1);
        const endDate = new Date(fullYear, 11, 31, 23, 59, 59);

        // ถ้าเลือกเดือน ให้ปรับช่วงวันที่ให้แคบลง
        if (fullMonth) {
            startDate.setMonth(fullMonth - 1, 1);
            endDate.setMonth(fullMonth, 0);
        }

        // ดึง orderDetails ที่อยู่ในคำสั่งซื้อของช่วงเวลาที่เลือก
        const bestSellingProducts = await prisma.orderDetail.groupBy({
            by: ["productId"],
            where: {
                orders: {  // ✅ ใช้ "orders" ตาม schema
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                    status: "complete", // ✅ กรองเฉพาะคำสั่งซื้อที่สำเร็จเท่านั้น
                },
            },
            _sum: {
                qty: true,
                price: true,
            },
            orderBy: {
                _sum: {
                    qty: "desc", // ✅ เรียงตามจำนวนสินค้าที่ขายดีที่สุด
                },
            },
            take: 10, // ✅ ดึงแค่ 10 อันดับแรก
        });

        // ดึงข้อมูลสินค้า
        const products = await Promise.all(
            bestSellingProducts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: { name: true },
                });
                return {
                    productId: item.productId,
                    productName: product?.name || "Unknown",
                    totalQuantity: item._sum.qty ?? 0,
                    totalPrice: item._sum.price ?? 0,
                };
            })
        );

        res.json({ month: fullMonth, year: fullYear, products });
    } catch (error) {
        console.error("Error fetching best-selling products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/daily-sales', async (req, res) => {
  try {
      const { month, year } = req.query;

      if (!month || isNaN(month) || month < 1 || month > 12) {
          return res.status(400).send({ error: 'Invalid month parameter' });
      }

      if (!year || isNaN(year)) {
          return res.status(400).send({ error: 'Invalid year parameter' });
      }

      const fullYear = parseInt(year, 10);
      const daysInMonth = new Date(fullYear, month, 0).getDate();

      let dailySales = Array.from({ length: daysInMonth }, (_, i) => ({
          date: `${i + 1}/${month}/${fullYear}`,
          amount: 0
      }));

      const billSaleInMonth = await prisma.orders.findMany({
          where: {
              createdAt: {
                  gte: new Date(fullYear, month - 1, 1),
                  lte: new Date(fullYear, month, 0),
              },
              status: "complete" // ✅ เพิ่มเงื่อนไขเฉพาะออเดอร์ที่สำเร็จ
          },
      });

      for (let order of billSaleInMonth) {
          const sum = await prisma.orderDetail.aggregate({
              _sum: { price: true },
              where: { ordersId: order.id },
          });

          const dayOfMonth = order.createdAt.getDate() - 1;
          dailySales[dayOfMonth].amount += sum._sum.price ?? 0;
      }

      res.send({ month, year: fullYear, sales: dailySales });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});
app.get('/available-years', async (req, res) => {
  try {
      const years = await prisma.orders.findMany({
          select: { createdAt: true },
          where: { status: "complete" }, // ✅ เพิ่มเงื่อนไขสถานะออเดอร์
          distinct: ['createdAt'],
      });

      const availableYears = years.map(order => new Date(order.createdAt).getFullYear());
      const uniqueYears = [...new Set(availableYears)];

      res.send({ years: uniqueYears });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});
app.get('/dashboard', async (req, res) => {
    try {
        const { year } = req.query;
        if (!year || isNaN(year)) {
            return res.status(400).send({ error: 'Invalid year parameter' });
        }

        let arr = [];
        let selectedYear = parseInt(year);

        for (let i = 1; i <= 12; i++) {
            const billSaleInMonth = await prisma.orders.findMany({
                where: {
                    createdAt: {
                        gte: new Date(selectedYear, i - 1, 1),
                        lte: new Date(selectedYear, i, 0),
                    },
                    status: "complete" // ✅ เพิ่มเงื่อนไขสถานะออเดอร์
                },
            });

            let sumPrice = 0;

            for (let order of billSaleInMonth) {
                const sum = await prisma.orderDetail.aggregate({
                    _sum: { price: true },
                    where: { ordersId: order.id },
                });

                sumPrice += sum._sum.price ?? 0;
            }

            arr.push({ month: i, sumPrice });
        }

        res.send({ result: arr });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = app;
