import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { 
  createBrowserRouter, RouterProvider 
} from 'react-router-dom';
import ProductMain from './pages/ProductMain';
import Home from './pages/Home';
import ProductInfo from './pages/ProductInfo';
import Cart from './pages/Cart';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignIn from './pages/SignIn';
import Register from './pages/Register'
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import ProtectedRoute from './pages/ProtectedRoute';
import PublicRoute from './pages/PublicRoute';
import Profile from './pages/Profile';
import Orders from './pages/Orders'
import CancelPage from './pages/Cancel';
import ResetPassword from './pages/ResetPassword';
import NewPassword from './pages/NewPassword';
import Contact from './pages/Contact'
import Knowledge from './pages/Knownledge';
import TermsAndPrivacyPolicy from './pages/TermPolicy';

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
