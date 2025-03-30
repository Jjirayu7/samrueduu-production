const express = require('express');
const app = express.Router();
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const fileUpload = require("express-fileupload");  


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const prisma = new PrismaClient();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const API_URL = process.env.API_URL;


app.use(cors());
app.use(fileUpload());

// app.post("/checkout", express.json(), async (req, res) => {
//   const { product, information, paymentMethod } = req.body; // รับ paymentMethod จาก request body
//   try {
//     const orderId = uuidv4();

//     console.log("Request body received:", req.body);

//     // กำหนด payment_method_types ตามค่าที่ได้รับจาก request
//     let paymentMethodTypes = [];
//     if (paymentMethod === "QR Promptpay") {
//       paymentMethodTypes = ["promptpay"];
//     } else if (paymentMethod === "Credit/Debit Card") {
//       paymentMethodTypes = ["card"];
//     } else if (paymentMethod === "ชำระเงินปลายทาง") {
//       paymentMethodTypes = ["cash"]; // หรือใส่ logic อื่นๆ ตามที่ต้องการ
//     } else {
//       return res.status(400).json({ error: "Invalid payment method" });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: paymentMethodTypes, // ใช้ paymentMethodTypes ที่เลือก
//       line_items: [
//         {
//           price_data: {
//             currency: "thb",
//             product_data: {
//               name: product.name,
//             },
//             unit_amount: product.price * 100, // จำนวนเงิน (หน่วยเป็นสตางค์)
//           },
//           quantity: product.quantity,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://localhost:3000/success?id=${orderId}`,
//       cancel_url: `http://localhost:8888/cancel.html?id=${orderId}`,
//     });

//     console.log("=== session", session);

//     const data = {
//       fullname: information.name,
//       address: information.address,
//       session_id: session.id,
//       status: session.status,
//       order_id: orderId,
//     };

//     const result = await prisma.orders.create({
//       data: data
//     });
    
//     const paymentStatus = await stripe.checkout.sessions.retrieve(session.id);
    
//     // ตรวจสอบสถานะการชำระเงิน
//     if (paymentStatus.payment_status === "complete") {
//       // ถ้าจ่ายเงินแล้ว (paid) จะทำการสร้าง orderDetail
//       for (let i = 0; i < req.body.carts.length; i++) {
//         const rowProduct = await prisma.product.findFirst({
//             where: {
//                 id: req.body.carts[i].id
//             }
//         })
//         await prisma.orderDetail.create({
//             data: {
//                 ordersId: result.id,
//                 productId: rowProduct.id,
//                 cost: rowProduct.cost,
//                 price: rowProduct.price
//             }
//         });
//       }
//     } else {
//       console.log("Payment not completed yet.");
//     }

//     res.json({
//       message: "Checkout success.",
//       id: session.id,
//       result,
//     });
//   } catch (error) {
//     console.error("Error creating user:", error.message);
//     res.status(400).json({ error: "Error processing payment" });
//   }
// });

// app.post("/checkout", express.json(), async (req, res) => { 
//   const { product, information, paymentMethod, carts, userId } = req.body; // รับข้อมูลจาก request body
//   try {
//     const orderId = uuidv4();

//     console.log("Request body received:", req.body);

//     // กำหนด payment_method_types ตามค่าที่ได้รับจาก request
//     let paymentMethodTypes = [];
//     if (paymentMethod === "QR Promptpay") {
//       paymentMethodTypes = ["promptpay"];
//     } else if (paymentMethod === "Credit/Debit Card") {
//       paymentMethodTypes = ["card"];
//     } else if (paymentMethod === "ชำระเงินปลายทาง") {
//       paymentMethodTypes = ["cash"];
//     } else {
//       return res.status(400).json({ error: "Invalid payment method" });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: paymentMethodTypes,
//       line_items: [
//         {
//           price_data: {
//             currency: "thb",
//             product_data: { name: product.name },
//             unit_amount: product.price * 100, // จำนวนเงิน (หน่วยเป็นสตางค์)
//           },
//           quantity: product.quantity,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://localhost:3000/success?id=${orderId}`,
//       cancel_url: `http://localhost:8888/cancel.html?id=${orderId}`,
//     });

//     console.log("=== session", session);

//     // สร้างข้อมูล order ในฐานข้อมูล
//     const result = await prisma.orders.create({
//       data: {
//         fullname: information.name,
//         address: information.address,
//         session_id: session.id,
//         status: session.status,
//         order_id: orderId,
//         userCustomerId: userId,
//       },
//     });

//     // ตอบกลับ client เพื่อ redirect ไปยัง Stripe
//     res.json({
//       message: "Checkout session created.",
//       id: session.id,
//       result,
//     });

//     // รอให้สถานะการชำระเงินเปลี่ยนเป็น complete
//     const interval = setInterval(async () => {
//       const updatedSession = await stripe.checkout.sessions.retrieve(session.id);

//       if (updatedSession.payment_status === "paid") {
//         clearInterval(interval); // หยุดการตรวจสอบ

//         // ตรวจสอบสถานะออร์เดอร์ในฐานข้อมูล
//         const order = await prisma.orders.findUnique({
//           where: { id: result.id },
//         });

//         if (order && order.status === "complete") {
//           // สร้าง orderDetail
//           for (const cart of carts) {
//             const product = await prisma.product.findFirst({
//               where: { id: cart.id },
//             });

//             if (product) {
//               await prisma.orderDetail.create({
//                 data: {
//                   ordersId: result.id,
//                   productId: product.id,
//                   cost: product.cost,
//                   price: product.price,
//                   qty : cart.qty
//                 },
//               });
//             }
//           }

//           console.log("Order details created successfully.");
//         } else {
//           console.log("Order status is not complete. Cannot create order details.");
//         }
//       }
//     }, 5000); // ตรวจสอบทุก ๆ 5 วินาที

//   } catch (error) {
//     console.error("Error processing checkout:", error.message);
//     res.status(400).json({ error: "Error processing payment" });
//   }
// });

// app.post("/checkout1", express.json(), async (req, res) => { 
//   const { product, information, paymentMethod, carts, userId } = req.body; // รับข้อมูลจาก request body
//   try {
//     const orderId = uuidv4();

//     console.log("Request body received:", req.body);

//     // กำหนด payment_method_types ตามค่าที่ได้รับจาก request
//     let paymentMethodTypes = [];
//     if (paymentMethod === "QR Promptpay") {
//       paymentMethodTypes = ["promptpay"];
//     } else if (paymentMethod === "Credit/Debit Card") {
//       paymentMethodTypes = ["card"];
//     } else if (paymentMethod === "ชำระเงินปลายทาง") {
//       paymentMethodTypes = ["cash"];
//     } else {
//       return res.status(400).json({ error: "Invalid payment method" });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: paymentMethodTypes,
//       line_items: [
//         {
//           price_data: {
//             currency: "thb",
//             product_data: { name: product.name },
//             unit_amount: product.price * 100, // จำนวนเงิน (หน่วยเป็นสตางค์)
//           },
//           quantity: product.quantity,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://localhost:3000/success?id=${orderId}`,
//       cancel_url: `http://localhost:8888/cancel.html?id=${orderId}`,
//     });

//     console.log("=== session", session);

//     // สร้างข้อมูล order ในฐานข้อมูล
//     const result = await prisma.orders.create({
//       data: {
//         fullname: information.name,
//         address: information.address,
//         phone: information.phone,
//         session_id: session.id,
//         status: session.status,
//         order_id: orderId,
//         userCustomerId: userId,
//       },
//     });

//     // ตอบกลับ client เพื่อ redirect ไปยัง Stripe
//     res.json({
//       message: "Checkout session created.",
//       id: session.id,
//       result,
//     });

//     // รอให้สถานะการชำระเงินเปลี่ยนเป็น complete
//     const interval = setInterval(async () => {
//       const updatedSession = await stripe.checkout.sessions.retrieve(session.id);

//       if (updatedSession.payment_status === "paid") {
//         clearInterval(interval); // หยุดการตรวจสอบ

//         // ตรวจสอบสถานะออร์เดอร์ในฐานข้อมูล
//         const order = await prisma.orders.findUnique({
//           where: { id: result.id },
//         });

//         if (order && order.status === "complete") {
//           // สร้าง orderDetail
//           for (const cart of carts) {
//             const product = await prisma.product.findFirst({
//               where: { id: cart.id },
//             });

//             if (product) {
//               await prisma.orderDetail.create({
//                 data: {
//                   ordersId: result.id,
//                   productId: product.id,
//                   cost: product.cost,
//                   price: product.price,
//                   qty : cart.qty
//                 },
//               });
//             }
//           }

//           console.log("Order details created successfully.");

//           // เรียก API ไปอัพเดทสต็อกสินค้า
//           try {
//             await axios.post('http://localhost:3001/product/updateStock', { carts });
//             console.log('Stock updated successfully');
//           } catch (error) {
//             console.error('Error updating stock:', error.message);
//           }

//         } else {
//           console.log("Order status is not complete. Cannot create order details.");
//         }
//       }
//     }, 5000); 

//   } catch (error) {
//     console.error("Error processing checkout:", error.message);
//     res.status(400).json({ error: "Error processing payment" });
//   }
// });


app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Stripe needs the raw body for signature verification
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const paymentSuccessData = event.data.object;
        const sessionId = paymentSuccessData.id;
        
        console.log("session_id", sessionId);
  
        const data = {
          status: paymentSuccessData.status,  // Update the status with the status from Stripe
        };
  
        // Update the order in the database using Prisma
        try {
          const result = await prisma.orders.update({
            where: {
              session_id: sessionId,  // Use the session_id to find the order
            },
            data: data,  // Update the status field with the new status
          });

          
  
          console.log("=== update result", result);
        } catch (error) {
          console.error("Error updating order status:", error.message);
        }
  
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    res.send();
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

app.post('/save', async (req, res) => {
    try {
        const rowBillSale = await prisma.billSale.create({
            data: {
                customerName: req.body.customerName,
                customerPhone: req.body.customerPhone,
                customerAddress: req.body.customerAddress,
                payDate: new Date(req.body.payDate),
                payTime: req.body.payTime
            }
        });

        for (let i = 0; i < req.body.carts.length; i++) {
            const rowProduct = await prisma.product.findFirst({
                where: {
                    id: req.body.carts[i].id
                }
            })
            await prisma.orderDetail.create({
                data: {
                    ordersId: rowBillSale.id,
                    productId: rowProduct.id,
                    cost: rowProduct.cost,
                    price: rowProduct.price
                }
            });
        }
        res.send({ message: 'success' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.get('/list', async (req, res) => {
    try {
        const results = await prisma.orders.findMany({
            orderBy: {
                id: 'desc'
            }
        })

        res.send({ results: results })
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.get('/list/:userCustomerId', async (req, res) => {
  const { userCustomerId } = req.params;  // รับค่า userCustomerId จาก URL

  try {
      const results = await prisma.orders.findMany({
          where: {
              userCustomerId: parseInt(userCustomerId),  // กรองข้อมูลตาม userCustomerId ที่ส่งมา
          },
          orderBy: {
              id: 'desc',
          },
      });

      res.send({ results: results });
  } catch (e) {
      res.status(500).send({ error: e.message });
  }
});

app.get('/address/list/:userCustomerId', async (req, res) => {
  const { userCustomerId } = req.params;  // รับค่า userCustomerId จาก URL

  try {
      const results = await prisma.orders.findMany({
          where: {
              userCustomerId: parseInt(userCustomerId),  // กรองข้อมูลตาม userCustomerId ที่ส่งมา
          },
          select: {
              phone: true,
              address: true,  // เลือกส่งแค่ฟิลด์ address
              userCustomerId: true,  // เลือกส่งแค่ฟิลด์ userCustomerId
          },
          orderBy: {
              id: 'desc',  // จัดเรียงตาม id จากใหม่ไปเก่า
          },
      });

      res.send({ results: results });
  } catch (e) {
      res.status(500).send({ error: e.message });
  }
});


app.get('/orderList', async (req, res) => {
  try {
      const results = await prisma.orderDetail.findMany({
          orderBy: {
              id: 'desc'
          }
      })

      res.send({ results: results })
  } catch (e) {
      res.status(500).send({ error: e.message });
  }
})

app.get('/billInfo/:orderId', async (req, res) => {
    try {
        const results = await prisma.orderDetail.findMany({
            include: {
                Product: true
            },
            where: {
                ordersId: parseInt(req.params.orderId)
            },
            orderBy: {
                id: 'desc'
            }
        });

        res.send({ results: results })
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.get('/updateStatusToPay/:billSaleId', async (req, res) => {
    try {
        await prisma.orders.update({
            data: {
                status: 'complete'
            },
            where: {
                id: parseInt(req.params.billSaleId)
            }
        })

        res.send({ message: 'success' })
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.get('/updateStatusToSend/:billSaleId', async (req, res) => {
    try {
        await prisma.orders.update({
            data: {
                status: 'shiped'
            },
            where: {
                id: parseInt(req.params.billSaleId)
            }
        })

        res.send({ message: 'success' })
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

app.get('/updateStatusToCancel/:billSaleId', async (req, res) => {
    try {
        await prisma.orders.update({
            data: {
                status: 'cancel'
            },
            where: {
                id: parseInt(req.params.billSaleId)
            }
        })

        res.send({ message: 'success' })
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})


app.get('/test', (req, res) => {
  res.send('success.jsทำงานได้่');
  console.log('success.jsทำงานได้่')
})

// app.post("/checkout-cod1", express.json(), async (req, res) => { 
//   const { information, carts, userId } = req.body; // รับข้อมูลจาก request body
//   try {
//     const orderId = uuidv4();

//     console.log("Request body received for COD:", req.body);

//     // สร้างข้อมูลคำสั่งซื้อในฐานข้อมูล
//     const result = await prisma.orders.create({
//       data: {
//         fullname: information.name,
//         address: information.address,
//         phone: information.phone,
//         status: "pending",  // สถานะเริ่มต้นเป็น pending
//         order_id: orderId,
//         userCustomerId: userId,
//       },
//     });

//     // สร้าง orderDetail
//     for (const cart of carts) {
//       const product = await prisma.product.findFirst({
//         where: { id: cart.id },
//       });

//       if (product) {
//         await prisma.orderDetail.create({
//           data: {
//             ordersId: result.id,
//             productId: product.id,
//             cost: product.cost,
//             price: product.price,
//             qty: cart.qty,
//           },
//         });
//       }
//     }

//     console.log("Order created successfully for COD with order ID:", orderId);

//     // ตอบกลับ client พร้อมข้อมูล success URL
//     res.json({
//       message: "Order created for COD.",
//       orderId: orderId,
//       successUrl: `http://localhost:3000/success?id=${orderId}`,
//     });
//   } catch (error) {
//     console.error("Error processing COD checkout:", error.message);
//     res.status(500).json({ error: "Error processing COD checkout" });
//   }
// });

app.post("/checkout1", express.json(), async (req, res) => { 
  const { product, information, paymentMethod, carts, userId } = req.body; // รับข้อมูลจาก request body
  try {
    const orderId = uuidv4();

    console.log("Request body received:", req.body);

    // กำหนด payment_method_types ตามค่าที่ได้รับจาก request
    let paymentMethodTypes = [];
    if (paymentMethod === "QR Promptpay") {
      paymentMethodTypes = ["promptpay"];
    } else if (paymentMethod === "Credit/Debit Card") {
      paymentMethodTypes = ["card"];
    } else {
      return res.status(400).json({ error: "Invalid payment method for online payment" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: { name: product.name },
            unit_amount: product.price * 100, // จำนวนเงิน (หน่วยเป็นสตางค์)
          },
          quantity: product.quantity,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/success?id=${orderId}`,
      cancel_url: `http://localhost:8888/cancel.html?id=${orderId}`,
    });

    console.log("=== session", session);

    // สร้างข้อมูล order ในฐานข้อมูล
    const result = await prisma.orders.create({
      data: {
        fullname: information.name,
        address: information.address,
        phone: information.phone,
        session_id: session.id,
        status: session.status,
        order_id: orderId,
        userCustomerId: userId,
      },
    });

    // ตอบกลับ client เพื่อ redirect ไปยัง Stripe
    res.json({
      message: "Checkout session created.",
      id: session.id,
      result,
    });

    // ตรวจสอบสถานะการชำระเงิน
    const interval = setInterval(async () => {
      const updatedSession = await stripe.checkout.sessions.retrieve(session.id);

      if (updatedSession.payment_status === "paid") {
        clearInterval(interval);

        console.log("Payment successful for order ID:", orderId);

        // สร้าง orderDetail
        for (const cart of carts) {
          const product = await prisma.product.findFirst({
            where: { id: cart.id },
          });

          if (product) {
            await prisma.orderDetail.create({
              data: {
                ordersId: result.id,
                productId: product.id,
                cost: product.cost,
                price: product.price,
                qty: cart.qty,
              },
            });
          }
        }

        console.log("Order details created successfully.");
          // เรียก API ไปอัพเดทสต็อกสินค้า
          try {
            await axios.post('http://localhost:3001/product/updateStock', { carts });
            console.log('Stock updated successfully');
          } catch (error) {
            console.error('Error updating stock:', error.message);
          }
      }
    }, 5000);
  } catch (error) {
    console.error("Error processing online checkout:", error.message);
    res.status(500).json({ error: "Error processing online checkout" });
  }
});

app.post("/checkout", express.json(), async (req, res) => {  
  const { product, information, paymentMethod, carts, userId } = req.body;
  try {
    const orderId = uuidv4();
    console.log("Request body received:", req.body);

    let paymentMethodTypes = [];
    if (paymentMethod === "QR Promptpay") {
      paymentMethodTypes = ["promptpay"];
    } else if (paymentMethod === "Credit/Debit Card") {
      paymentMethodTypes = ["card"];
    } else {
      return res.status(400).json({ error: "Invalid payment method for online payment" });
    }

  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: { name: product.name },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        },
      ],
      mode: "payment",
      success_url: `${FRONTEND_URL}/success?id=${orderId}`,
      cancel_url: `${FRONTEND_URL}/cancel?id=${orderId}`,
    });

    console.log("=== session", session);

    const result = await prisma.orders.create({
      data: {
        fullname: information.name,
        address: information.address,
        phone: information.phone,
        session_id: session.id,
        status: session.status,
        order_id: orderId,
        userCustomerId: userId,
      },
    });

    res.json({
      message: "Checkout session created.",
      id: session.id,
      result,
    });

    // ตรวจสอบการชำระเงิน
    const interval = setInterval(async () => {
      const updatedSession = await stripe.checkout.sessions.retrieve(session.id);

      if (updatedSession.payment_status === "paid") {
        clearInterval(interval);

        console.log("Payment successful for order ID:", orderId);

        for (const cart of carts) {
          const product = await prisma.product.findFirst({
            where: { id: cart.id },
          });

          if (product) {
            await prisma.orderDetail.create({
              data: {
                ordersId: result.id,
                productId: product.id,
                cost: product.cost,
                price: product.price,
                qty: cart.qty,
              },
            });
          }
        }

        console.log("Order details created successfully.");

        // เรียก API ไปอัพเดทสต็อกสินค้า
        try {
          await axios.post(`${API_URL}/product/updateStock`, { carts });
          console.log('Stock updated successfully');
        } catch (error) {
          console.error('Error updating stock:', error.message);
        }
      }
    }, 5000);
  } catch (error) {
    console.error("Error processing online checkout:", error.message);
    res.status(500).json({ error: "Error processing online checkout" });
  }
});


app.post("/checkout-cod", express.json(), async (req, res) => {
  const { information, carts, userId } = req.body; // รับข้อมูลจาก request body
  try {
    const orderId = uuidv4();
    const sessionId = uuidv4();  // สร้าง session_id ใหม่

    console.log("Request body received for COD:", req.body);

    // สร้างข้อมูลคำสั่งซื้อในฐานข้อมูล
    const result = await prisma.orders.create({
      data: {
        fullname: information.name,
        address: information.address,
        phone: information.phone,
        status: "pending",  // สถานะเริ่มต้นเป็น pending
        order_id: orderId,
        session_id: sessionId,  // เพิ่ม session_id
        userCustomerId: userId,
      },
    });
    for (const cart of carts) {
      const product = await prisma.product.findFirst({
        where: { id: cart.id },
      });

      if (product) {
        await prisma.orderDetail.create({
          data: {
            ordersId: result.id,
            productId: product.id,
            cost: product.cost,
            price: product.price,
            qty: cart.qty,
          },
        });
      }
    }
    console.log("Order created successfully for COD with order ID:", orderId);
    // เรียก API ไปอัพเดทสต็อกสินค้า
    try {
      await axios.post(`${API_URL}/product/updateStock`, { carts });
      console.log('Stock updated successfully');
    } catch (error) {
      console.error('Error updating stock:', error.message);
    }

    // ตอบกลับ client พร้อมข้อมูล success URL
    res.json({
      message: "Order created for COD.",
      orderId: orderId,
      successUrl: `${FRONTEND_URL}/success?id=${orderId}`,
    });
  } catch (error) {
    console.error("Error processing COD checkout:", error.message);
    res.status(500).json({ error: "Error processing COD checkout" });
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


module.exports = app;