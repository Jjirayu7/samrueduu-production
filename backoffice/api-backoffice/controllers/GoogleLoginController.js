const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: 'http://localhost:3001/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const { id, displayName, emails } = profile;
    let user = await prisma.userCustomer.findUnique({
      where: { userName: id }
    });

    // ถ้าไม่เจอ user ในฐานข้อมูล ให้เพิ่มข้อมูลใหม่
    if (!user) {
      user = await prisma.userCustomer.create({
        data: {
          userName: id,
          firstName: displayName,
          email: emails[0].value,
          status: 'use',
          role: 'customer',
          imgProfile: profile.photos ? profile.photos[0].value : null,
        },
      });
    }

    // สร้าง JWT token
    const token = jwt.sign({ id: user.id, userName: user.userName }, 'YOUR_JWT_SECRET_KEY');
    return done(null, { user, token });
  } catch (error) {
    return done(error);
  }
}));

// Route สำหรับการล็อกอินผ่าน Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route ที่จะรับข้อมูลจาก Google
app.get('/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const { user, token } = req.user;
    res.json({ user, token });
  }
);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
