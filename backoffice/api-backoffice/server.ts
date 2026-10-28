export {};
const userController = require('./controllers/UserController');
const productController = require('./controllers/ProductController');
const saleController = require('./controllers/SaleController');
const userCustomerController = require('./controllers/UserCustomerController');
const dashboardController = require('./controllers/DashboardController');
const orderController = require('./controllers/OrderController')
const mediaController = require('./controllers/MediaController');

const express = require('express');
const app = express();
require('dotenv').config();
//const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

//app.use(bodyParser.json());
//app.use(bodyParser.urlencodedf({extended: true}));
app.use(cors());
app.use('/uploads', express.static('uploads'));

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !firebasePrivateKey) {
  throw new Error('Missing Firebase credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: firebasePrivateKey,
  }),
});

app.use('/user', userController);
app.use('/product', productController);
app.use('/api/sale', saleController);
app.use('/user/customer', userCustomerController);
app.use('/api/dashboard', dashboardController);
app.use('/order', orderController);
app.use('/media', mediaController);

app.listen(3001);

