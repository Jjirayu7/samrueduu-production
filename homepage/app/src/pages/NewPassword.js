import React, { useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../config";

function NewPassword() {
  const { token } = useParams(); // รับ token จาก URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // สำหรับการแสดง/ซ่อนรหัสผ่านใหม่
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // สำหรับการแสดง/ซ่อนรหัสผ่านยืนยัน

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match",
        icon: "error",
      });
      return;
    }

    try {
      await axios.post(config.apiPath + "/user/customer/reset-password", 
      {
        token,
        newPassword,
      });
      Swal.fire({
        title: "Success",
        text: "Your password has been reset successfully",
        icon: "success",
      }).then(() => {
        navigate("/"); // Redirect ไปหน้า Login หลังจากรีเซ็ตรหัสสำเร็จ
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "An error occurred",
        icon: "error",
      });
    }
  };

  // ฟังก์ชันสลับการแสดง/ซ่อนรหัสผ่าน
  const togglePasswordVisibility = (field) => {
    if (field === "newPassword") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="new-password-container text-center">
      <div className="new-password-box mt-5">
        <h3>เปลี่ยนรหัสผ่าน</h3>
        <form onSubmit={handleResetPassword}>
          <div>
            <label>รหัสผ่านใหม่ :</label>
            <div className="password-input-container">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="ใส่รหัสผ่านใหม่"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="password-toggle-btn ms-2"
              >
                {showNewPassword ? "ซ่อน" : "แสดง"}
              </button>
            </div>
          </div>
          <div className="mt-3">
            <label>ยืนยัน:</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="ยืนยันรหัสผ่าน"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="password-toggle-btn ms-2"
              >
                {showConfirmPassword ? "ซ่อน" : "แสดง"}
              </button>
            </div>
          </div>
          <button className="mt-5" type="submit">ยืนยัน</button>
        </form>
      </div>
    </div>
  );
}

export default NewPassword;
