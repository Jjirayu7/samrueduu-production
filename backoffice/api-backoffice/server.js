const userController = require('./controllers/UserController');
const productController = require('./controllers/ProductController');
const saleController = require('./controllers/SaleController');
const userCustomerController = require('./controllers/UserCustomerController');
const dashboardController = require('./controllers/DashboardController');
const orderController = require('./controllers/OrderController')
const mediaController = require('./controllers/MediaController');

const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const allowedOrigins = ['https://backoffice.samrueduu.shop', 'https://samrueduu.shop'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Handle preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencodedf({extended: true}));
//app.use(cors());
app.use('/uploads', express.static('uploads'));

admin.initializeApp({
  credential: admin.credential.cert("login-samrueduu-firebase-adminsdk-fbsvc-acfd0272a0.json"),
});

app.use('/user', userController);
app.use('/product', productController);
app.use('/api/sale', saleController);
app.use('/user/customer', userCustomerController);
app.use('/api/dashboard', dashboardController);
app.use('/order', orderController);
app.use('/media', mediaController);

app.listen(3001);

