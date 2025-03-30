import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { 
  createBrowserRouter, RouterProvider 
} from 'react-router-dom';
import ProductMain from './pages/ProductMain.js';
import Home from './pages/Home.js';
import ProductInfo from './pages/ProductInfo.js';
import Cart from './pages/Cart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignIn from './pages/SignIn.js';
import Register from './pages/Register.js'
import Checkout from './pages/Checkout.js';
import Success from './pages/Success.js';
import ProtectedRoute from './pages/ProtectedRoute.js';
import PublicRoute from './pages/PublicRoute.js';
import Profile from './pages/Profile.js';
import Orders from './pages/Orders.js'
import CancelPage from './pages/Cancel.js';
import ResetPassword from './pages/ResetPassword.js';
import NewPassword from './pages/NewPassword.js';
import Contact from './pages/Contact.js'
import Knowledge from './pages/Knownledge.js';
import TermsAndPrivacyPolicy from './pages/TermPolicy.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute><SignIn></SignIn></PublicRoute>
  },
  {
    path: '/home',
    element: <Home></Home>
  },
  {
    path: '/productMain',
  element: <ProductMain></ProductMain>
  },
  {
    path: '/productInfo/:id',
    element: <ProductInfo></ProductInfo>
  },
  {
    path: '/cart',
    element: <ProtectedRoute><Cart></Cart></ProtectedRoute>
  },
  {
    path: '/signIn',
    element: <PublicRoute><SignIn></SignIn></PublicRoute>
  },
  {
    path: '/register',
    element: <Register></Register>
  },
  {
    path: '/checkout',
    element: <ProtectedRoute><Checkout></Checkout></ProtectedRoute>
  },
  {
    path: '/success',
    element: <ProtectedRoute><Success></Success></ProtectedRoute>
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile></Profile></ProtectedRoute>
  },
  {
    path: '/orders',
    element: <ProtectedRoute><Orders></Orders></ProtectedRoute>
  },
  {
    path: '/cancel',
    element: <ProtectedRoute><CancelPage></CancelPage></ProtectedRoute>
  },
  {
    path: '/forgotPassword',
    element: <ResetPassword></ResetPassword>
  },
  { 
    path: '/reset-password/:token',
    element: <NewPassword></NewPassword>
  },
  {
    path: '/contact',
    element: <Contact></Contact>
  },
  {
    path: '/knowledge',
    element: <Knowledge></Knowledge>
  },
  {
    path: '/term-policy',
    element: <TermsAndPrivacyPolicy></TermsAndPrivacyPolicy>
  }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}></RouterProvider>
);

reportWebVitals();
