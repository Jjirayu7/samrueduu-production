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



app.post("/upload", async (req, res) => {
    try {
        if (req.files != undefined) {
            if (req.files.img != undefined) {
                const img = req.files.img;
                const myDate = new Date();
                const y = myDate.getFullYear();
                const m = myDate.getMonth() + 1;  // Month is 0-based in JS
                const d = myDate.getDate();
                const h = myDate.getHours();
                const mi = myDate.getMinutes();
                const s = myDate.getSeconds(); 
                const ms = myDate.getMilliseconds();

                const arrFileName = img.name.split('.');
                const ext = arrFileName[arrFileName.length - 1];

                const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`;

                img.mv('./uploads/' + newName, (err) => {
                    if (err) throw err;
                    res.send({ newName: newName });
                });
            }
        } else {
            res.status(400).send({ error: "No files were uploaded." });
        }
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

// app.post("/create", async (req, res) => {
//     try {
//         await prisma.product.create({
//             data: req.body,
//         });

//         res.send({ message: 'success' });
//     } catch (e) {
//         res.status(500).send({ error: e.message });
//     }
// });
app.post("/create", async (req, res) => {
  try {
      console.log('Received Data:', req.body);  // แสดงข้อมูลที่รับเข้ามา

      // บันทึกข้อมูลใน Prisma
      await prisma.product.create({
          data: req.body,
      });

      res.send({ message: 'success' });
  } catch (e) {
      console.error('Error occurred:', e);  // แสดง error ที่เกิดขึ้น
      res.status(500).send({ error: e.message });
  }
});


app.get("/list", async (req, res) => {
    try {
        const data = await prisma.product.findMany({
            orderBy: {
                id: 'desc',
            },
            where: {
                status: 'use',
            },
        });
        res.send({ result: data });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.delete("/remove/:id", async (req, res) => {
    try {
        await prisma.product.delete({
            where: {
                id: parseInt(req.params.id),
            },
        });
        res.send({ message: "success" });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.put("/update", async (req, res) => {
    try {
        
        const oldData = await prisma.product.findFirst({
            where: {
                id: parseInt(req.body.id),
            },
        });

        
        const updatedImages = oldData.imgs ? [...oldData.imgs, ...req.body.imgs] : req.body.imgs;

        await prisma.product.update({
            data: {
                ...req.body,
                imgs: updatedImages, 
            },
            where: {
                id: parseInt(req.body.id),
            },
        });

        res.send({ message: "success" });
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});


app.post("/uploadFromExcel", async (req, res) => {
    try {
        const fileExcel = req.files.fileExcel;

        fileExcel.mv('./uploads/' + fileExcel.name, async (err) => {
            if (err) throw err;

            const workbook = new exceljs.Workbook();
            await workbook.xlsx.readFile('./uploads/' + fileExcel.name);
            const ws = workbook.getWorksheet(1);

            for (let i = 2; i <= ws.rowCount; i++) {
                const name = ws.getRow(i).getCell(1).value ?? "";
                const cost = ws.getRow(i).getCell(2).value ?? 0;
                const price = ws.getRow(i).getCell(3).value ?? 0;

                if (name !== "" && cost >= 0 && price >= 0) {
                    await prisma.product.create({
                        data: {
                            name: name,
                            cost: cost,
                            price: price,
                            img: '',
                        },
                    });
                }

                console.log(name, cost, price);
            }

            await fs.unlinkSync('./uploads/' + fileExcel.name);
            res.send({ message: 'success' });
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.delete('/remove-image', async (req, res) => {
    const { productId, imgToRemove } = req.body;

    try {
        // สร้างพาธของไฟล์
        const imagePath = path.join(__dirname, '..', 'uploads', imgToRemove);
        console.log('File path:', imagePath);  // ตรวจสอบพาธของไฟล์

        // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // ลบไฟล์
        } else {
            return res.status(404).json({ message: 'File not found' });
        }

        // ค้นหาสินค้าในฐานข้อมูล
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // อัปเดตข้อมูลสินค้า
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                imgs: {
                    set: product.imgs.filter(img => img !== imgToRemove), // ลบรูปจาก array
                },
            },
        });

        res.send({ message: 'success' });
    } catch (error) {
        console.error('Error removing image:', error);
        res.status(500).json({ message: 'Error removing image' });
    }
});

app.get('/info/:id', async (req, res) => {
    const productId = parseInt(req.params.id); 
  
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,  
        },
      });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(product); 
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.post('/updateStock', async (req, res) => {
    console.log('Request Body:', req.body); // ตรวจสอบข้อมูลที่ได้รับ
    const { carts } = req.body;

    if (!Array.isArray(carts)) {
        console.error('Carts is not an array:', carts);
        return res.status(400).json({ message: 'Invalid carts data' });
    }

    try {
        for (const item of carts) {
            // ดึงข้อมูลสินค้าจากฐานข้อมูล
            const product = await prisma.product.findUnique({
                where: { id: item.id },
            });

            // ตรวจสอบว่าสินค้ามีอยู่และ Stock เพียงพอหรือไม่
            if (!product) {
                console.error(`Product not found: ID ${item.id}`);
                continue; // ข้ามไปยังสินค้าถัดไป
            }

            if (product.stock <= 0 || product.stock < item.qty) {
                console.error(`Insufficient stock for product ID ${item.id}`);
                continue; // ข้ามไปยังสินค้าถัดไป
            }

            // ลดจำนวน Stock
            await prisma.product.update({
                where: { id: item.id },
                data: { stock: { decrement: item.qty } },
            });
        }
        res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Error updating stock' });
    }
});

  app.post('/checkStock', async (req, res) => {
    const { productId } = req.body;
  
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
  
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { stock: true },
      });
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ productId: productId, stock: product.stock });
    } catch (error) {
      console.error('Error checking stock:', error);
      res.status(500).json({ message: 'Error checking stock', error: error.message });
    }
  });

  app.get('/stock/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId);

    if (isNaN(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { stock: true },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ productId: productId, stock: product.stock });
    } catch (error) {
        console.error('Error fetching stock:', error);
        res.status(500).json({ message: 'Error fetching stock', error: error.message });
    }
  });

  app.get('/daily-sales', async (req, res) => {
    try {
      const { month, year } = req.query; // ดึงเดือนและปีจากพารามิเตอร์ query
  
      if (!month || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).send({ error: 'Invalid month parameter' });
      }
  
      if (!year || isNaN(year)) {
        return res.status(400).send({ error: 'Invalid year parameter' });
      }
  
      // ใช้ปีที่ได้รับจาก query แทนปีปัจจุบัน
      const myDate = new Date(year, 0); // ปีที่ได้รับจาก query
      const fullYear = myDate.getFullYear(); // ปีจาก query
  
      // จำนวนวันในเดือนที่เลือก
      const daysInMonth = new Date(fullYear, month, 0).getDate();
  
      // สร้างอาร์เรย์สำหรับข้อมูลยอดขายรายวัน
      let dailySales = Array(daysInMonth).fill({ date: null, amount: 0 });
  
      // ค้นหาคำสั่งซื้อในเดือนที่เลือก
      const billSaleInMonth = await prisma.orders.findMany({
        where: {
          createdAt: {
            gte: new Date(fullYear, month - 1, 1), // วันที่เริ่มต้นของเดือน
            lte: new Date(fullYear, month, 0), // วันที่สิ้นสุดของเดือน
          },
        },
      });
  
      // สำหรับแต่ละคำสั่งซื้อ (order)
      for (let i = 0; i < billSaleInMonth.length; i++) {
        const billSaleObject = billSaleInMonth[i];
  
        // คำนวณยอดรวมของ `price` จาก `orderDetail`
        const sum = await prisma.orderDetail.aggregate({
          _sum: {
            price: true, // คำนวณยอดรวมของ `price`
          },
          where: {
            ordersId: billSaleObject.id, // เชื่อมโยง `ordersId` กับคำสั่งซื้อที่กำหนด
          },
        });
  
        // คำนวณวันในเดือน
        const dayOfMonth = billSaleObject.createdAt.getDate() - 1; // หยิบวันจาก createdAt (0-based)
  
        // เพิ่มยอดขายในวันนั้น
        dailySales[dayOfMonth] = {
          date: billSaleObject.createdAt.toLocaleDateString('th-TH'), // วันในรูปแบบไทย
          amount: (dailySales[dayOfMonth].amount || 0) + (sum._sum.price || 0), // รวมยอดขายในวันนั้น
        };
      }
  
      // ส่งผลลัพธ์กลับไป
      res.send({ month, year: fullYear, sales: dailySales });
    } catch (error) {
      // ส่งข้อความ error หากเกิดข้อผิดพลาด
      res.status(500).send({ error: error.message });
    }
  });
   
  app.get('/dashboard', async (req, res) => {
    try {
      let arr = [];
      let totalYearSales = 0; // ตัวแปรสำหรับเก็บยอดขายรวมทั้งปี
      let myDate = new Date();
      let year = myDate.getFullYear(); // ปีปัจจุบัน
  
      // วนลูปเพื่อดึงข้อมูลจากแต่ละเดือน (1 - 12)
      for (let i = 1; i <= 12; i++) {
        const daysInMonth = new Date(year, i, 0).getDate(); // จำนวนวันในเดือน
  
        // ค้นหาคำสั่งซื้อในเดือนนั้น ๆ
        const billSaleInMonth = await prisma.orders.findMany({
          where: {
            createdAt: {
              gte: new Date(year, i - 1, 1),  // เดือน i (1-based) แต่ `Date` ต้องใช้ 0-based เดือน
              lte: new Date(year, i, 0),  // วันที่สุดท้ายของเดือน
            },
          },
        });
  
        // สำหรับแต่ละคำสั่งซื้อ (order)
        let monthSales = 0; // เก็บยอดขายในเดือนนั้น
        for (let j = 0; j < billSaleInMonth.length; j++) {
          const billSaleObject = billSaleInMonth[j];
  
          // คำนวณยอดรวมของ `price` จาก `orderDetail`
          const sum = await prisma.orderDetail.aggregate({
            _sum: {
              price: true,  // คำนวณยอดรวมของ `price`
            },
            where: {
              ordersId: billSaleObject.id,  // เชื่อมโยง `ordersId` กับคำสั่งซื้อที่กำหนด
            },
          });
  
          // รวมยอดขายในเดือนนั้น
          monthSales += sum._sum.price ?? 0;
        }
  
        // เก็บข้อมูลยอดขายในแต่ละเดือน
        arr.push({
          month: i,
          sumPrice: monthSales,  // ยอดขายในเดือนนั้น
        });
  
        // เพิ่มยอดขายของเดือนนั้นไปยังยอดขายรวมทั้งปี
        totalYearSales += monthSales;
      }
  
      // ส่งผลลัพธ์กลับไป
      res.send({ result: arr, totalYearSales });
    } catch (error) {
      // ส่งข้อความ error หากเกิดข้อผิดพลาด
      res.status(500).send({ error: error.message });
    }
  });

  app.get('/available-years', async (req, res) => {
    try {
        const years = await prisma.orders.findMany({
            select: {
                createdAt: true
            },
            distinct: ['createdAt'],
        });

        // แปลงปีจาก createdAt
        const availableYears = years.map(order => new Date(order.createdAt).getFullYear());
        const uniqueYears = [...new Set(availableYears)]; // กรองปีที่ซ้ำออก

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
      let myDate = new Date();
      let selectedYear = parseInt(year);
  
      // วนลูปเพื่อดึงข้อมูลจากแต่ละเดือน (1 - 12)
      for (let i = 1; i <= 12; i++) {
        const daysInMonth = new Date(selectedYear, i, 0).getDate(); // จำนวนวันในเดือน
  
        // ค้นหาคำสั่งซื้อในเดือนนั้น ๆ
        const billSaleInMonth = await prisma.orders.findMany({
          where: {
            createdAt: {  // ใช้ `createdAt` เพื่อกรองคำสั่งซื้อในเดือนนั้น ๆ
              gte: new Date(selectedYear, i - 1, 1),  // เดือน i (1-based) แต่ `Date` ต้องใช้ 0-based เดือน
              lte: new Date(selectedYear, i, 0),  // วันที่สุดท้ายของเดือน
            },
          },
        });
  
        // สำหรับแต่ละคำสั่งซื้อ (order)
        for (let j = 0; j < billSaleInMonth.length; j++) {
          const billSaleObject = billSaleInMonth[j];
  
          // คำนวณยอดรวมของ `price` จาก `orderDetail`
          const sum = await prisma.orderDetail.aggregate({
            _sum: {
              price: true,  // คำนวณยอดรวมของ `price`
            },
            where: {
              ordersId: billSaleObject.id,  // เชื่อมโยง `ordersId` กับคำสั่งซื้อที่กำหนด
            },
          });
  
          // เพิ่มข้อมูลในอาร์เรย์
          arr.push({
            month: i,
            sumPrice: sum._sum.price ?? 0, // ใช้ราคา 0 หากไม่มีข้อมูล
          });
        }
      }
  
      // ส่งผลลัพธ์กลับไป
      res.send({ result: arr });
    } catch (error) {
      // ส่งข้อความ error หากเกิดข้อผิดพลาด
      res.status(500).send({ error: error.message });
    }
  });
  
  app.get("/best-sell*RESERVE", async (req, res) => {
  try {
      const data = await prisma.product.findMany({
          where: {
              status: "use",
          },
          include: {
              _count: {
                  select: {
                      orderDetail: true,  // Optional: can count the number of orderDetails for each product
                  },
              },
              orderDetail: {
                  select: {
                      qty: true,
                  },
              },
          },
      });

      // คำนวณยอดขายรวมของแต่ละสินค้า
      const rankedData = data.map((product) => ({
          ...product,
          totalSales: product.orderDetail.reduce((sum, order) => sum + order.qty, 0),
      }));

      // เรียงลำดับสินค้าตามยอดขายสูงสุด
      rankedData.sort((a, b) => b.totalSales - a.totalSales);

      res.send({ result: rankedData });
  } catch (e) {
      console.error(e);  // Log error for debugging
      res.status(500).send({ error: e.message });
  }
  });

  app.get("/top-selling", async (req, res) => {
      try {
          // ดึงสินค้าขายดี 10 อันดับแรก
          const bestSellingProducts = await prisma.orderDetail.groupBy({
              by: ["productId"],
              where: {
                  orders: {
                      status: "complete", // กรองเฉพาะคำสั่งซื้อที่สำเร็จเท่านั้น
                  },
              },
              _sum: {
                  qty: true,
                  price: true,
              },
              orderBy: {
                  _sum: {
                      qty: "desc", // เรียงตามจำนวนสินค้าที่ขายดีที่สุด
                  },
              },
              take: 10,
          });

          // ดึงข้อมูลสินค้าเพิ่มเติมจาก Product table
          const productIds = bestSellingProducts.map(p => p.productId);
          const products = await prisma.product.findMany({
              where: { id: { in: productIds } },
              select: {
                  id: true,
                  name: true,
                  cost: true,
                  price: true,
                  stock: true,
                  seasons: true,
                  imgs: true,
                  status: true,
              },
          });

          res.json({ bestSellingProducts: products });
      } catch (error) {
          console.error("Error fetching best-selling products:", error);
          res.status(500).json({ error: "Internal server error" });
      }
  });

module.exports = app;
