import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../../config";
import BackOffice from "../../components/BackOffice";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    avatar: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/user/info", config.headers());
      if (res.data.result) {
        setUser(res.data.result);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(config.apiPath + "/user/update", user, config.headers());
      Swal.fire({
        title: "Success",
        text: "Profile updated successfully!",
        icon: "success",
      });
      setEditMode(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match!",
        icon: "error",
      });
      return;
    }

    try {
      await axios.put(
        config.apiPath + "/user/change-password",
        { password: newPassword },
        config.headers()
      );
      Swal.fire({
        title: "Success",
        text: "Password changed successfully!",
        icon: "success",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.post(config.apiPath + "/user/upload-avatar", formData, {
        ...config.headers(),
        "Content-Type": "multipart/form-data",
      });
      setUser((prev) => ({ ...prev, avatar: res.data.avatar }));
      Swal.fire({
        title: "Success",
        text: "Avatar updated successfully!",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <BackOffice>
      <div className="profile-page">
        <div className="user-panel mt-3">
          <div className="image text-center mb-3">
            <img
              src={user.avatar || "dist/img/default-avatar.png"}
              className="img-circle elevation-2"
              alt="รูปภาพโปรไฟล์"
              width="100"
              height="100"
            />
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
          {editMode ? (
            <div className="info mt-3">
              <input
                type="text"
                className="form-control mb-2"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Enter your name"
              />
              <button
                className="btn btn-success btn-sm mr-2"
                onClick={handleUpdateProfile}
              >
                Save Changes
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="info text-center mt-3">
              <h4>{user.name || "Guest"}</h4>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setEditMode(true)}
              >
                แก้ไขโปรไฟล์
              </button>
            </div>
          )}
          <div className="change-password mt-4">
            <h5>เปลี่ยนรหัสผ่าน</h5>
            <input
              type="password"
              className="form-control mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="รหัสผ่านใหม่"
            />
            <input
              type="password"
              className="form-control mb-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="ยืนยันรหัสผ่าน"
            />
            <button
              className="btn btn-warning btn-sm"
              onClick={handlePasswordChange}
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </BackOffice>
  );
}

export default Profile;
