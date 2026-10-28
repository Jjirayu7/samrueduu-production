// @ts-nocheck
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const handleLoginSuccess = async (response) => {
    const { credential } = response;
    try {
      // ส่งข้อมูลไปที่ backend เพื่อขอ JWT token
      const res = await axios.post('http://localhost:3001/user/customer/auth/google/callback', {
        token: credential,
      });

      // เซฟ JWT token ลงใน localStorage หรือใช้ใน context
      localStorage.setItem('token', res.data.token);
      console.log('Logged in successfully', res.data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log('Login Failed')}
      />
    </div>
  );
};

export default GoogleLoginButton;
