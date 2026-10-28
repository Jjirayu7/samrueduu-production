import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import SignIn from './pages/backoffice/SignIn';
import Home from './pages/backoffice/Home';
import Product from './pages/backoffice/Product';
import BillSale from './components/BillSale';
import Dashboard from './pages/backoffice/Dashboard';
import Profile from './pages/backoffice/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn/>
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/product',
    element: <Product />
  },
  {
    path: '/billSale',
    element: <BillSale />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/profile',
    element: <Profile />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);