import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import config from "../config";
import HomePage from "../components/HomePage";
import { Helmet } from "react-helmet";

function Profile() {
  const pageTitle = "โปรไฟล์";
  const [user, setUser] = useState({
    userName: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState(""); // เพิ่มการเก็บรหัสผ่านเก่า
  // const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  // const defaultImage = 'profile-icon.jpg';
  

  useEffect(() => {
    fetchData();
    fetchData1();
   
  }, []);
  const fetchData = async () => {
    try {
        const res = await axios.get(config.apiPath + "/user/customer/info", {
            ...config.headers(),
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        });
        console.log("Fetched user data:", res.data); // Check if id exists
        if (res.data.result) {
            setUserCustomer(res.data.result); // Ensure userCustomer is updated
            setUser({ ...res.data.result, profileImage: res.data.result.imgProfile });
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
        });
    }
};

// const fetchData1 = async () => {
//   try {
//     const res = await axios.get(config.apiPath + "/user/customer/info", {
//       ...config.headers(),
//       Authorization: `Bearer ${localStorage.getItem('token')}`,
//     });
//     if (res.data.result) {
//       setUser(res.data.result);
//     }
//     console.log("Fetched user data:", res.data); // Log ข้อมูลที่ได้รับจาก API
//   } catch (error) {
//     Swal.fire({
//       title: "Error",
//       text: error.message,
//       icon: "error",
//     });
//   }
// };

  const fetchData1 = async () => {
    try {
      const res = await axios.get(config.apiPath + "/user/customer/info", {
        ...config.headers(),
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
      if (res.data.result) {
        setUser(res.data.result);
      }
      console.log("Fetched user data:", res.data); // Log ข้อมูลที่ได้รับจาก API
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleChangeUsername = async () => {
    if (!user.userName) {
      Swal.fire({
        title: "Error",
        text: "Username is required",
        icon: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // const res = await axios.put(
      //   "http://localhost:3001/user/customer/change-username",
      const res = await axios.put(config.apiPath + "/user/customer/change-username",
        { userName: user.userName },  // ส่งเฉพาะ userName
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,  // ส่ง Token ใน header
          },
        }
      );
      Swal.fire({
        title: "Success",
        text: res.data.message,
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data.message || error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
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
  
    if (newPassword.length < 8) {
      Swal.fire({
        title: "Error",
        text: "Password must be at least 8 characters long",
        icon: "error",
      });
      return;
    }
  
    setLoading(true);
    try {
      // ส่ง oldPassword, newPassword และ confirmPassword ไปทั้งหมด
      await axios.post(config.apiPath + "/user/customer/change-password", 
        { oldPassword, newPassword, confirmPassword }, 
        {
          ...config.headers(),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      );
      Swal.fire({
        title: "Success",
        text: "Password changed successfully!",
        icon: "success",
      });
      setNewPassword("");
      setConfirmPassword("");
      setOldPassword(""); // รีเซ็ต oldPassword หลังจากการเปลี่ยนรหัสสำเร็จ
    } catch (error) {
      // แสดงข้อความที่เหมาะสมจาก error.response หากมี
      const errorMessage = error.response ? error.response.data.message : error.message;
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  function showImage(item) {
    if (item.imgProfile && item.imgProfile.length > 0) {  
      let imgPath = `${config.apiPath}/uploads/${item.imgProfile}`;
      console.log("Image Path:", imgPath); // log ค่า imgPath
      return (
        <img 
          className="card-img rounded-circle" 
          style={{ 
            width: '150px', 
            height: '150px', 
            objectFit: 'cover', 
            borderRadius: '50%' 
          }} 
          src={imgPath} 
          alt="User Profile" 
        />
      );
    }
    return (
      <img 
        className="card-img rounded-circle" 
        style={{ 
          width: '150px', 
          height: '150px', 
          objectFit: 'cover', 
          borderRadius: '50%' 
        }} 
        src="imgnot.jpg" 
        alt="Noimage" 
      />
    );
  }
  
  
  const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์ที่เลือก
  const [previewImage, setPreviewImage] = useState(user.imgProfile || "profile-icon.jpg"); // แสดงรูปปัจจุบันหรือ Default รูป
  console.log("user.imgProfile",user.imgProfile)
  // const refImgInput = useRef(null); 
  
  const [userCustomer, setUserCustomer] = useState({  });

  // const handleUpload = async () => {
  //   if (selectedFile) {
  //     try {
  //       const formData = new FormData();
  //       formData.append('img', selectedFile);
  
  //       const res = await axios.post(config.apiPath + '/user/customer/upload', formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       });
  
  //       console.log('Upload response:', res.data);
  
  //       if (res.data.newName) {
  //         console.log('File uploaded successfully:', res.data.newName);
  //         return res.data.newName;
  //       }
  //     } catch (error) {
  //       console.log('Upload failed', error);
  //       Swal.fire({
  //         title: 'Error',
  //         text: error.message,
  //         icon: 'error',
  //       });
  //     }
  //   } else {
  //     Swal.fire({
  //       title: 'Error',
  //       text: 'No image selected!',
  //       icon: 'error',
  //     });
  //   }
  // };
  

  const handleFileChange = (files) => {
    if (files && files[0]) {
        const file = files[0];
        setSelectedFile(file);  // เก็บไฟล์ที่เลือก
        setPreviewImage(URL.createObjectURL(file));  // แสดงรูปตัวอย่าง
    }
  };
  // const handleSave = async () => {
  //   try {
  //     // ตรวจสอบว่าได้ทำการอัพโหลดรูปภาพแล้ว
  //     const uploadedImage = await handleUpload(); // รับชื่อไฟล์จากการอัปโหลด
  //     if (uploadedImage) {
  //       // อัปเดต imgProfile ด้วยชื่อไฟล์ที่อัปเดตล่าสุด
  //       setUserCustomer({
  //         ...userCustomer,
  //         imgProfile: uploadedImage,
  //       });
  //     }
  
  //     let res;
  //     if (userCustomer.id === undefined) {
  //       console.log("User ID is undefined");
  //     } else {
  //       // ส่งข้อมูลทั้งหมดรวมทั้ง imgProfile ที่อัปเดต
  //       res = await axios.put(config.apiPath + '/user/customer/update', userCustomer, config.headers());
  //     }
  
  //     if (res?.data?.message === 'success') {
  //       Swal.fire({
  //         title: 'Save',
  //         text: 'Success',
  //         icon: 'success',
  //         timer: 500,
  //       });
  //       fetchData();
  //     } else {
  //       console.log('Response from server:', res?.data);
  //     }
  //   } catch (error) {
  //     console.error("Error in handleSave:", error);
  //     if (error.response) {
  //       console.error('Error Response:', error.response);
  //       Swal.fire({
  //         title: 'Error',
  //         text: `Status: ${error.response.status}, Message: ${error.response.data.message}`,
  //         icon: 'error',
  //       });
  //     } else {
  //       Swal.fire({
  //         title: 'Error',
  //         text: error.message,
  //         icon: 'error',
  //       });
  //     }
  //   }
  // };
  
  // สมมติว่า handleUpload เป็นฟังก์ชันที่จัดการการอัพโหลดไฟล์

  const fileInputRef = useRef(null);  // ประกาศ fileInputRef

  const handleUpload = async () => {
    try {
      // ตรวจสอบว่าเลือกไฟล์หรือไม่
      if (fileInputRef.current && fileInputRef.current.files.length > 0) {
        const formData = new FormData();
        formData.append('img', fileInputRef.current.files[0]);  // ดึงไฟล์จาก fileInputRef

        // ส่งไฟล์ไปยัง server
        const response = await axios.post(config.apiPath + '/user/customer/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const uploadedImage = response.data.newName;  // รับชื่อไฟล์ที่อัพโหลดจาก response
        console.log('File uploaded successfully:', uploadedImage);
        return uploadedImage;  // ส่งกลับชื่อไฟล์ที่อัพโหลด
      } else {
        console.error('No file selected');
        return null;
      }
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleSave = async () => {
    try {
        // เรียก handleUpload เพื่ออัพโหลดไฟล์และรับชื่อไฟล์ที่อัพโหลด
        const uploadedImage = await handleUpload();  // รับชื่อไฟล์ที่อัพโหลด
        
        // ตั้งค่า imgProfile ของ userCustomer
        userCustomer.imgProfile = uploadedImage;

        let res;

        // หากไม่มี userCustomer.id ให้ทำการสร้างผู้ใช้ใหม่
        if (userCustomer.id === undefined) {
            
        } else {
            // หากมี userCustomer.id ให้ทำการอัพเดตข้อมูลผู้ใช้
            res = await axios.put(config.apiPath + '/user/customer/update', userCustomer, config.headers());
        }

        // ตรวจสอบว่าการอัพเดตหรือสร้างผู้ใช้สำเร็จ
        if (res.data.message === 'success') {
            Swal.fire({
                title: 'Save Successful',
                text: 'The user has been saved successfully.',
                icon: 'success',
                timer: 500,
            });
            fetchData();  // รีเฟรชข้อมูลหลังจากบันทึก
        }
    } catch (error) {
        // แสดงข้อความผิดพลาด
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
        });
    }
};





  return (
    <HomePage title={pageTitle}> 
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content="Cart page" />
    </Helmet>
      <div className="container profile-page ps-5">
  <div className="user-panel mt-3">
    <div className="image text-center mb-3">
      {/* แสดงรูปภาพตัวอย่าง */}
      {showImage(user)}
      {/* Input สำหรับเลือกไฟล์ */}
      <input
        type="file"
        className="form-control mt-3"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e.target.files)}
        accept="image/*"
      />

      {/* ปุ่มบันทึกรูป */}
      <button
        className="btn rounded-pill mt-3"
        style={{ borderRadius: "30px", backgroundColor: '#5B166C' }}
        onClick={handleSave}
        disabled={!selectedFile} // ปิดปุ่มถ้ายังไม่ได้เลือกไฟล์
      >
        <h6 className="text-white mt-2 mx-2">บันทึกรูป</h6>
      </button>
    </div>

    {editMode ? (
      <div className="info mt-3">
        <input
          type="text"
          className="form-control mb-2"
          value={user.userName}
          onChange={(e) => setUser({ ...user, userName: e.target.value })}
          placeholder="Enter your username"
          style={{ borderRadius: "30px" }}
        />
        <button
          className="btn btn-success btn-sm mr-2"
          onClick={handleChangeUsername}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setEditMode(false)}
        >
          Cancel
        </button>
      </div>
    ) : (
      <div className=" d-flex justify-content-center info text-center mt-5">
        <h4 className="mt-2 mx-3">ชื่อผู้ใช้ : {user.userName}</h4>
        <div>
          <button
          className="btn rounded-pill" 
          style={{backgroundColor: "#5B166C"}}
          onClick={() => setEditMode(true)}
        >
          <span className="text-white mx-2">เปลี่ยนชื่อผู้ใช้</span>
        </button>
          </div>
        
      </div>
    )}

    <div className="change-password mt-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h4 className="mt-4">เปลี่ยนรหัสผ่าน</h4>
      <input
        type="password"
        className="form-control mb-2 w-50"
        style={{ borderRadius: "30px" }}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="รหัสผ่านเก่า"
      />
      <input
        type="password"
        className="form-control mb-2 w-50"
        style={{ borderRadius: "30px" }}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="รหัสผ่านใหม่"
      />
      <input
        type="password"
        className="form-control mb-2 w-50"
        style={{ borderRadius: "30px" }}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="ยืนยันรหัสผ่าน"
      />
      <button
      className="btn rounded-pill"
      style={{ borderRadius: "30px", backgroundColor: '#5B166C' }}
      onClick={handlePasswordChange}
      disabled={loading}
    >
      <h6 className="text-white mt-2 mx-2">{loading ? "Changing..." : "ยืนยัน"}</h6>
    </button>
    </div>
  </div>
</div>

    </HomePage>
  );
}

export default Profile;