import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../config";

function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${config.apiPath}/user/customer/forgot-password`, 
        { email },
        config.headers() 
    );
      Swal.fire({
        title: "Success",
        text: "Password reset link has been sent to your email",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "An error occurred",
        icon: "error",
      });
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h3>Forgot Password</h3>
        <form onSubmit={handleForgotPassword}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
            />
          </div>
          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
