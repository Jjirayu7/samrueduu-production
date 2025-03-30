// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const bcrypt = require('bcrypt');

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// dotenv.config();

// function checkSignIn (req, res, next){
//     try {
//         const secret = process.env.TOKEN_SECRET;
//         const token = req.headers['authorization'];
//         const result = jwt.verify(token, secret);
//         // console.log(process.env.TOKEN_SECRET);

//         if (result != undefined){
//             next();
//         }      
//     } catch (e) {
//         res.status(500).send({error: e.message });
//     }
// }
// function getUserCustomerId(req, res){
//     try {
//         const secret = process.env.TOKEN_SECRET;
//         const token = req.headers['authorization'];
//         const result = jwt.verify(token, secret);

//         if(result != undefined){
//             return result.id;
//         }
        
//     } catch (e) {
//         res.status(500).send({ error: e.message });
//     }
// }

// // Endpoint for signIn
// app.post('/signIn', async (req, res) => { 
//     try {
//         if (req.body.userName == undefined || req.body.password == undefined) {
//             return res.status(401).send('unauthorized');
//         }

//         const user = await prisma.userCustomer.findFirst({
//             select: {
//                 id: true,
//                 firstName: true,
//                 status: true,
//             },
//             where: {
//                 userName: req.body.userName,
//                 password: req.body.password,
//                 status: 'use'
//             }
//         });

//         console.log(user);

//         if (user != null) {
//             const secret = process.env.TOKEN_SECRET;
//             const token = jwt.sign(user, secret, { expiresIn: '30d' });

//             return res.send({ token: token });
//         }

//         res.status(401).send({ message: 'unauthorized' });
//     } catch (e) {
//         res.status(500).send({ error: e.message });
//     }
// });

// // Endpoint for getting user info
// app.get('/info', checkSignIn, async (req, res, next) => {
//     try {
//         const userId = getUserCustomerId(req, res);
//         const user = await prisma.userCustomer.findFirst({
//             select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 userName: true
//             },
//             where: {
//                 id: userId
//             }
//         });
//         res.send({ result: user });
//     } catch (e) {
//         res.status(500).send({ error: e.message });
//     }
// });

// app.post('/register', async (req, res) => {
//     const { firstName, lastName, userName, password } = req.body;
  
//     // if (password !== repassword) {
//     //   return res.status(400).json({ message: 'Passwords do not match' });
//     // }
  
//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);
  
//       const newUser = await prisma.userCustomer.create({
//         data: {
//           firstName,
//           lastName,
//           userName,
//         //   email,
//           password: hashedPassword,
//         },
//       });
  
//       res.status(201).json({ message: 'Registration completed', user: newUser });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });


// module.exports = app;


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

app.use(cors());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const client = new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN);
const FRONTEND_URL = process.env.FRONTEND_URL;

dotenv.config();

// Middleware to check if user is signed in
function checkSignIn(req, res, next) {
    try {
        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            throw new Error('TOKEN_SECRET is not defined');
        }

        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        const result = jwt.verify(token, secret);
        req.user = result; // Attach user data to the request object
        next();
    } catch (e) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}

function generateJwtToken(user) {
  const secret = process.env.TOKEN_SECRET;
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    secret,
    { expiresIn: "7d" } // Token ใช้ได้ 7 วัน
  );
}


const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    return res.json({ success: true, decodedToken });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token", error: error.message });
  }
};

app.post("/oauth/signIn-", verifyToken, async (req, res) => {
  const { token, provider, uid, email, displayName, photoURL } = req.body;

  try {
    // ✅ ตรวจสอบ Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("🔹 Token Verified:", decodedToken);

    // ✅ ค้นหาผู้ใช้ในฐานข้อมูล
    let user = await prisma.userCustomer.findUnique({ where: { email } });

    if (!user) {
      // ✅ ถ้ายังไม่มีในระบบ ให้สร้างใหม่
      user = await prisma.userCustomer.create({
        data: {
          // uid,
          firstName: 'test',
          lastName: 'test',
          email,
          userName: displayName,
          imgProfile: photoURL,
          password: 'googleLogin',
        },
      });
    }

    // ✅ สร้าง JWT Token ของระบบ (ถ้าต้องการ)
    const jwtToken = generateJwtToken(user); // ฟังก์ชันสร้าง JWT ของระบบ

    res.json({ success: true, token: jwtToken, user });
  } catch (error) {
    console.error("🔻 OAuth SignIn Error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

app.post("/oauth/signIn", async (req, res) => {
  const { user, token, provider, uid, email, displayName, photoURL } = req.body;

  try {
    // ✅ ตรวจสอบ Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("🔹 Token Verified:", decodedToken);

    // ✅ ค้นหาผู้ใช้ในฐานข้อมูล
    let user = await prisma.userCustomer.findUnique({ where: { email } });

    if (!user) {
      // ✅ ถ้ายังไม่มีในระบบ ให้สร้างใหม่
      user = await prisma.userCustomer.create({
        data: {
          firstName: 'test',
          lastName: 'test',
          email,
          userName: displayName,
          imgProfile: photoURL,
          password: 'googleLogin',
        },
      });
    }

    // ✅ สร้าง JWT Token ของระบบ (ถ้าต้องการ)
    const jwtToken = generateJwtToken(user); // ฟังก์ชันสร้าง JWT ของระบบ

    res.json({ success: true, token: jwtToken, user });
  } catch (error) {
    console.error("🔻 OAuth SignIn Error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});


// Endpoint for signIn
app.post('/signIn', async (req, res) => {
    try {
        const { userName, password } = req.body;

        // Check if username and password are provided
        if (!userName || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Find user in the database
        const user = await prisma.userCustomer.findFirst({
            where: {
                userName: userName,
                status: 'use'
            }
        });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Username or password is incorrect' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Username or password is incorrect' });
        }

        // Create token
        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            throw new Error('TOKEN_SECRET is not defined');
        }

        const token = jwt.sign(
            { id: user.id, firstName: user.firstName, status: user.status, role: user.role },
            secret,
            { expiresIn: '30d' }
        );

        // Send token to the client
        res.status(200).json({ token });
    } catch (e) {
        console.error('Error during sign in:', e);
        res.status(500).json({ error: 'An error occurred during sign in' });
    }
});

// Endpoint for getting user info
app.get('/info', checkSignIn, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the request object
        const user = await prisma.userCustomer.findFirst({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                userName: true,
                imgProfile: true,
                role: true,
            },
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ result: user });
    } catch (e) {
        console.error('Error fetching user info:', e);
        res.status(500).json({ error: 'An error occurred while fetching user info' });
    }
});

// Endpoint for user registration
// app.post('/register', async (req, res) => {
//     const { firstName, lastName, userName, password } = req.body;

//     // Check if all fields are provided
//     if (!firstName || !lastName || !userName || !password) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create new user
//         const newUser = await prisma.userCustomer.create({
//             data: {
//                 firstName,
//                 lastName,
//                 userName,
//                 password: hashedPassword,
//                 status: 'use' // Set default status
//             }
//         });

//         res.status(201).json({ message: 'Registration completed', user: newUser });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ message: 'An error occurred during registration' });
//     }
// });

app.post('/register', async (req, res) => {
    const { firstName, lastName, userName, email, password, repassword } = req.body;
  
    if (password !== repassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await prisma.userCustomer.create({
        data: {
          firstName,
          lastName,
          userName,
          email,
          password: hashedPassword,
        },
      });
  
      res.status(201).json({ message: 'Registration completed', user: newUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // app.post("/forgot-password", async (req, res) => {
  //   const { email } = req.body;
  
  //   try {
  //     const user = await prisma.userCustomer.findUnique({
  //       where: { email },
  //     });
  
  //     if (!user) {
  //       return res.status(404).json({ message: "Email not found" });
  //     }
  
  //     // สร้าง Token สำหรับรีเซ็ตรหัสผ่าน
  //     const resetToken = crypto.randomBytes(32).toString("hex");
  //     const hashedToken = await bcrypt.hash(resetToken, 10);
  
  //     // บันทึก Token ลงฐานข้อมูล
  //     await prisma.passwordResetToken.create({
  //       data: {
  //         userCustomerId: user.id,
  //         token: hashedToken,
  //         expiresAt: new Date(Date.now() + 3600000), // Token หมดอายุใน 1 ชั่วโมง
  //       },
  //     });
  
  //     // สร้างลิงก์สำหรับรีเซ็ตรหัสผ่าน
  //     const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  
  //     // ส่งอีเมลโดยใช้ Postmark
  //     const emailResponse = await client.sendEmail({
  //       From: "jirayuwat.nawa@kmutt.ac.th", // อีเมลของคุณ
  //       To: email,
  //       Subject: "Samrueduu-suppport",
  //       HtmlBody: `<p>Link for reset your password : </p><a href="${resetLink}">${resetLink}</a>`,
  //     });
  
  //     console.log("Email sent: ", emailResponse);
  
  //     res.json({ message: "ลิงค์สำหรับรีเซ็ตรหัสผ่านถูกส่งไปที่อีเมลแล้ว" });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "An error occurred" });
  //   }
  // });
  
  // // API สำหรับการรีเซ็ตรหัสผ่าน
  // app.post("/reset-password", async (req, res) => {
  //   const { token, newPassword } = req.body;
  
  //   try {
  //     // ค้นหา Token ที่ตรงกันและยังไม่หมดอายุ
  //     const resetTokenEntry = await prisma.passwordResetToken.findFirst({
  //       where: {
  //         token: token,
  //         expiresAt: { gte: new Date() },
  //       },
  //     });
  
  //     if (!resetTokenEntry) {
  //       return res.status(400).json({ message: "Invalid or expired token" });
  //     }
  
  //     // อัปเดตรหัสผ่านใหม่
  //     const hashedPassword = await bcrypt.hash(newPassword, 10);
  //     await prisma.userCustomer.update({
  //       where: { id: resetTokenEntry.userCustomerId },
  //       data: { password: hashedPassword },
  //     });
  
  //     // ลบ Token หลังใช้งาน
  //     await prisma.passwordResetToken.delete({ where: { id: resetTokenEntry.id } });
  
  //     res.json({ message: "Password has been reset successfully" });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "An error occurred" });
  //   }
  // });

  // app.post("/forgot-password", async (req, res) => {
  //   const { email } = req.body;
  
  //   try {
  //     const user = await prisma.userCustomer.findUnique({
  //       where: { email },
  //     });
  
  //     if (!user) {
  //       return res.status(404).json({ message: "Email not found" });
  //     }
  
  //     // สร้าง Token สำหรับรีเซ็ตรหัสผ่าน
  //     const resetToken = crypto.randomBytes(32).toString("hex");
  //     const hashedToken = await bcrypt.hash(resetToken, 10); // เก็บ token ที่แฮชในฐานข้อมูล
  
  //     // บันทึก Token ลงฐานข้อมูล
  //     await prisma.passwordResetToken.create({
  //       data: {
  //         userCustomerId: user.id,
  //         token: hashedToken,
  //         expiresAt: new Date(Date.now() + 3600000), // Token หมดอายุใน 1 ชั่วโมง
  //       },
  //     });
  
  //     // สร้างลิงก์สำหรับรีเซ็ตรหัสผ่าน
  //     const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  
  //     // ส่งอีเมลโดยใช้ Postmark
  //     const emailResponse = await client.sendEmail({
  //       From: "jirayuwat.nawa@kmutt.ac.th", // อีเมลของคุณ
  //       To: email,
  //       Subject: "Samrueduu-suppport",
  //       HtmlBody: `<p>Link for reset your password : </p><a href="${resetLink}">${resetLink}</a>`,
  //     });
  
  //     console.log("Email sent: ", emailResponse);
  
  //     res.json({ message: "ลิงค์สำหรับรีเซ็ตรหัสผ่านถูกส่งไปที่อีเมลแล้ว" });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "An error occurred" });
  //   }
  // });

  // app.post("/reset-password", async (req, res) => {
  //   const { token, newPassword } = req.body;
  
  //   try {
  //     // ค้นหา Token ที่ตรงกันและยังไม่หมดอายุ
  //     const resetTokenEntry = await prisma.passwordResetToken.findFirst({
  //       where: {
  //         expiresAt: { gte: new Date() },
  //       },
  //     });
  
  //     if (!resetTokenEntry) {
  //       return res.status(400).json({ message: "Invalid or expired token" });
  //     }
  
  //     // ตรวจสอบ Token ที่ส่งมาจากผู้ใช้กับ token ที่เก็บในฐานข้อมูล
  //     const isTokenValid = await bcrypt.compare(token, resetTokenEntry.token);
  //     if (!isTokenValid) {
  //       return res.status(400).json({ message: "Invalid or expired token" });
  //     }
  
  //     // อัปเดตรหัสผ่านใหม่
  //     const hashedPassword = await bcrypt.hash(newPassword, 10);
  //     await prisma.userCustomer.update({
  //       where: { id: resetTokenEntry.userCustomerId },
  //       data: { password: hashedPassword },
  //     });
  
  //     // ลบ Token หลังใช้งาน
  //     await prisma.passwordResetToken.delete({ where: { id: resetTokenEntry.id } });
  
  //     res.json({ message: "Password has been reset successfully" });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "An error occurred" });
  //   }
  // });
  
  app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await prisma.userCustomer.findUnique({
        where: { email },
      });
  
      if (!user) {
        return res.status(404).json({ message: "Email not found" });
      }
  
      // สร้าง Token สำหรับรีเซ็ตรหัสผ่าน
      const resetToken = crypto.randomBytes(32).toString("hex"); // Token แบบธรรมดา
  
      // บันทึก Token ลงฐานข้อมูล (เก็บ token แบบธรรมดา)
      await prisma.passwordResetToken.create({
        data: {
          userCustomerId: user.id,
          token: resetToken,  // เก็บ token แบบธรรมดา
          expiresAt: new Date(Date.now() + 360000), 
        },
      });
  
      // สร้างลิงก์สำหรับรีเซ็ตรหัสผ่าน
      const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
  
      // ส่งอีเมลโดยใช้ Postmark
      const emailResponse = await client.sendEmail({
        From: "jirayuwat.nawa@kmutt.ac.th", // อีเมลของคุณ
        To: email,
        Subject: "Samrueduu-suppport",
        HtmlBody: `<p>Link for reset your password : </p><a href="${resetLink}">${resetLink}</a>`,
      });
  
      console.log("Email sent: ", emailResponse);
  
      res.json({ message: "ลิงค์สำหรับรีเซ็ตรหัสผ่านถูกส่งไปที่อีเมลแล้ว" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  });

  app.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // ล็อก token และ newPassword ที่ได้รับจาก client
      console.log("Received token:", token);
      console.log("Received newPassword:", newPassword);
  
      // ค้นหา Token ที่ตรงกันและยังไม่หมดอายุ
      const resetTokenEntry = await prisma.passwordResetToken.findFirst({
        where: {
          token: token,  // เปรียบเทียบกับ token ที่ได้รับจาก client
          expiresAt: { gte: new Date() }, // ตรวจสอบว่า Token ยังไม่หมดอายุ
        },
      });
  
      // ล็อกค่า resetTokenEntry ที่ค้นหาจากฐานข้อมูล
      console.log("Reset Token Entry from DB:", resetTokenEntry);
  
      if (!resetTokenEntry) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // อัปเดตรหัสผ่านใหม่
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("Hashed new password:", hashedPassword);
  
      await prisma.userCustomer.update({
        where: { id: resetTokenEntry.userCustomerId },
        data: { password: hashedPassword },
      });
  
      // ลบ Token หลังใช้งาน
      await prisma.passwordResetToken.delete({ where: { id: resetTokenEntry.id } });
  
      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error occurred during password reset:", error);
      res.status(500).json({ message: "An error occurred" });
    }
  });

  // ------------------------------------------------------------------------------Profile Page----------------------------------------------------------------------------------------
  app.put('/change-username', async (req, res) => {
    try {
      // ตรวจสอบว่า Token ถูกส่งมาหรือไม่
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(403).json({ message: 'No token provided' });
      }
  
      // ดึงข้อมูล userId จาก Token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // ใช้ JWT_SECRET สำหรับการยืนยัน token
      const userId = decoded.id;
  
      // ตรวจสอบข้อมูลจาก body
      const { userName } = req.body;
      if (!userName) {
        return res.status(400).json({ message: 'UserName is required' });
      }
  
      // อัปเดตชื่อผู้ใช้
      const updatedUser = await prisma.userCustomer.update({
        where: { id: userId },
        data: { userName },
      });
  
      return res.json({
        message: 'Username updated successfully',
        result: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // app.post('/user/upload-avatar', upload.single('avatar'), async (req, res) => {
  //   try {
  //     const userId = req.user.id;
  //     const avatar = req.file.path; // หรือเส้นทางที่คุณต้องการบันทึกในฐานข้อมูล
  
  //     const updatedUser = await prisma.userCustomer.update({
  //       where: { id: userId },
  //       data: { imgProfile: avatar },
  //     });
  
  //     res.json({ message: 'Avatar updated successfully', result: updatedUser });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // });

  app.post('/change-password', checkSignIn, async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    console.log("Old Password:", oldPassword);
  console.log("New Password:", newPassword);
  console.log("Confirm Password:", req.body.confirmPassword);
  
    try {
      // ตรวจสอบว่า newPassword กับ confirmPassword ตรงกันไหม
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New password and confirm password do not match' });
      }
  
      // ตรวจสอบว่าผู้ใช้มีการระบุรหัสเก่าหรือไม่
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Old password and new password are required' });
      }
  
      const userId = req.user.id; // ดึง userId จาก Token
  
      // ค้นหาผู้ใช้จากฐานข้อมูล
      const user = await prisma.userCustomer.findUnique({
        where: { id: userId }
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // เปรียบเทียบรหัสเก่ากับในฐานข้อมูล
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
  
      // เข้ารหัสรหัสใหม่
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // อัปเดตรหัสผ่านใหม่
      await prisma.userCustomer.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error during password change:', error);
      res.status(500).json({ message: 'An error occurred while changing the password' });
    }
  });

  app.post('/change-avatar', checkSignIn, async (req, res) => { 
    try {
        if (!req.files || !req.files.imgProfile) {
            return res.status(400).json({ message: 'No avatar file uploaded' });
        }

        const imgProfile = req.files.imgProfile;
        const ext = imgProfile.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        // Validate file type
        if (!allowedExtensions.includes(ext)) {
            return res.status(400).json({ message: 'Invalid file type' });
        }

        // Validate file size
        if (imgProfile.size > maxSize) {
            return res.status(400).json({ message: 'File size exceeds the limit' });
        }

        // Generate unique filename
        const myDate = new Date();
        const newName = `${myDate.getTime()}.${ext}`;
        const uploadPath = path.join(__dirname, 'uploads', 'avatars', newName);

        // Ensure upload directory exists
        const dirPath = path.join(__dirname, 'uploads', 'avatars');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Move file to upload directory
        await imgProfile.mv(uploadPath);

        // Update database
        const fileUrl = `/uploads/avatars/${newName}`;
        const userId = req.user.id;

        const updatedUser = await prisma.userCustomer.update({
            where: { id: userId },
            data: { imgProfile: fileUrl },
        });

        // Send response
        res.json({
            message: 'Avatar updated successfully',
            result: updatedUser,
            imgProfileUrl: fileUrl,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  });
  
  app.put("/update", async (req, res) => {
    try {
        console.log("Request Body (Update):", req.body);

        // Validate input
        if (!req.body.id || isNaN(parseInt(req.body.id))) {
            return res.status(400).send({ message: "Invalid user ID" });
        }

        const oldData = await prisma.userCustomer.findFirst({
            where: { id: parseInt(req.body.id) },
        });

        if (!oldData) {
            return res.status(404).send({ message: "User not found" });
        }

        // ใช้ชื่อไฟล์ใหม่หรือเก่า ถ้ามีการอัพโหลดรูป
        const updatedImage = req.body.imgProfile || oldData.imgProfile;
        console.log("Updated Image:", updatedImage); // Log the updated image

        await prisma.userCustomer.update({
            data: {
                ...req.body,
                imgProfile: updatedImage, // อัพเดท imgProfile
            },
            where: { id: parseInt(req.body.id) },
        });

        res.send({ message: "success" });
    } catch (e) {
        console.error("Update error:", e);
        res.status(500).send({ message: e.message });
    }
});

  app.post("/upload", async (req, res) => {
    try {
        if (!req.files || !req.files.img) {
            console.error("No files were uploaded.");
            return res.status(400).send({ error: "No files were uploaded." });
        }

        const img = req.files.img;

        // Validate file type (e.g., allow only images)
        const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
        const arrFileName = img.name.split(".");
        const ext = arrFileName[arrFileName.length - 1].toLowerCase();

        if (!allowedExtensions.includes(ext)) {
            console.error("Invalid file type:", ext);
            return res.status(400).send({ error: "Invalid file type. Only images are allowed." });
        }

        // Generate a unique file name
        const myDate = new Date();
        const y = myDate.getFullYear();
        const m = String(myDate.getMonth() + 1).padStart(2, "0");
        const d = String(myDate.getDate()).padStart(2, "0");
        const h = String(myDate.getHours()).padStart(2, "0");
        const mi = String(myDate.getMinutes()).padStart(2, "0");
        const s = String(myDate.getSeconds()).padStart(2, "0");
        const ms = String(myDate.getMilliseconds()).padStart(3, "0");
        const newName = `${y}${m}${d}${h}${mi}${s}${ms}.${ext}`;

        // Ensure the uploads directory exists
        const uploadDir = "./uploads";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Move the file to the uploads directory
        const filePath = path.join(uploadDir, newName);
        img.mv(filePath, (err) => {
            if (err) {
                console.error("Error moving file:", err);
                return res.status(500).send({ message: "Failed to save file" });
            }

            console.log("File successfully uploaded to:", filePath);
            res.send({ newName: newName });
        });
    } catch (e) {
        console.error("Error in upload:", e.message);
        res.status(500).send({ message: e.message });
    }
  });
  
module.exports = app;