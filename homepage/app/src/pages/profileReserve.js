import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import config from "../config";
import HomePage from "../components/HomePage";

function Profile() {
  const [user, setUser] = useState({
    userName: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState(""); // เพิ่มการเก็บรหัสผ่านเก่า
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    fetchData();
   
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
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
        });
    }
};

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

  // const fetchData = async () => {
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
      const res = await axios.put(
        "http://localhost:3001/user/customer/change-username",
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
      let imgPath = config.apiPath + '/uploads/' + item.imgProfile;
      console.log("Image Path:", imgPath); // log ค่า imgPath
      return <img className="card-img" height="150px" src={imgPath} alt="User Profile" />;
    }
    return <img className="card-img" height="150px" src="imgnot.jpg" alt="No image" />;
  }
  
  const [selectedFile, setSelectedFile] = useState(null); // เก็บไฟล์ที่เลือก
  const [previewImage, setPreviewImage] = useState(user.imgProfile || "profile-icon.jpg"); // แสดงรูปปัจจุบันหรือ Default รูป
  console.log("user.imgProfile",user.imgProfile)
  const refImgInput = useRef(null); 
  
  const [userCustomer, setUserCustomer] = useState({  });

  const handleUpload = async () => {
    if (selectedFile) {  // ตรวจสอบว่าเลือกไฟล์หรือไม่
        try {
            const formData = new FormData();
            formData.append('img', selectedFile);  // ใช้ selectedFile แทน imgProfile

            console.log('Uploading file...', formData); // เช็คข้อมูลที่ถูกส่งไป

            const res = await axios.post(config.apiPath + '/user/customer/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token'),
                },
            });

            console.log('Upload response:', res.data); // เพิ่มบรรทัดนี้เพื่อตรวจสอบผลลัพธ์จาก API

            if (res.data.newName) {
                console.log('File uploaded successfully:', res.data.newName); // เช็คชื่อไฟล์ที่ได้รับ
                return res.data.newName;  // คืนค่าชื่อไฟล์ใหม่
            }
        } catch (error) {
            console.log('Upload failed', error);
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
            });
        }
    } else {
        console.log('No image selected');
        Swal.fire({
            title: 'Error',
            text: 'No image selected!',
            icon: 'error',
        });
    }
};


const handleFileChange = (files) => {
  if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);  // เก็บไฟล์ที่เลือก
      setPreviewImage(URL.createObjectURL(file));  // แสดงรูปตัวอย่าง
  }
};



const handleSave = async () => {
  try {
      const uploadedImage = await handleUpload(); // รับชื่อไฟล์จากการอัปโหลด
      if (uploadedImage) { 
          // อัปเดต imgProfile ด้วยชื่อไฟล์ที่อัปโหลด
          setUserCustomer({
              ...userCustomer,
              imgProfile: uploadedImage,
          });
      }

      let res;
      if (userCustomer.id === undefined) {
          console.log("User ID is undefined");
      } else {
          res = await axios.put(config.apiPath + '/user/customer/update', userCustomer, config.headers());
      }

      if (res?.data?.message === 'success') {
          Swal.fire({
              title: 'Save',
              text: 'Success',
              icon: 'success',
              timer: 500,
          });
          fetchData();
      } else {
          console.log('Response from server:', res?.data);
      }
  } catch (error) {
      console.error("Error in handleSave:", error);
      if (error.response) {
          console.error('Error Response:', error.response);
          Swal.fire({
              title: 'Error',
              text: `Status: ${error.response.status}, Message: ${error.response.data.message}`,
              icon: 'error',
          });
      } else {
          Swal.fire({
              title: 'Error',
              text: error.message,
              icon: 'error',
          });
      }
  }
};


  return (
    <HomePage>
      <div className="container w-50 profile-page ps-5">
        <div className="user-panel mt-3">
          <div className="image text-center mb-3">
          <div className="image text-center mb-3">
              {/* แสดงรูปภาพตัวอย่าง */}
              
              <img
                src={{}}
                className="img-circle elevation-2 mb-3"
                style={{ borderRadius: "50px" }}
                alt="Profile"
                width="100"
                height="100"
              />

              {/* Input สำหรับเลือกไฟล์ */}
              <input
                type="file"
                className="form-control mt-3"
                ref={refImgInput}
                onChange={(e) => handleFileChange(e.target.files)}
                accept="image/*"
              />

              {/* ปุ่มบันทึกรูป */}
              <button
                className="btn btn-primary mt-3"
                onClick={handleSave}
                disabled={!selectedFile} // ปิดปุ่มถ้ายังไม่ได้เลือกไฟล์
              >
                บันทึกรูป
              </button>
            </div>                    
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
            <div className="info text-center mt-3">
              <h4>{user.userName}</h4>
              <button
                className="btn rounded-pill" 
                style={{backgroundColor: "#5B166C"}}
                onClick={() => setEditMode(true)}
              >
                <h6 className="text-white mt-2 mx-2">เปลี่ยนชื่อผู้ใช้</h6>
              </button>
            </div>
          )}

          <div className="change-password mt-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h5>เปลี่ยนรหัสผ่าน</h5>
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
              className="btn btn-warning btn-sm"
              style={{ borderRadius: "30px", backgroundColor: '#5B166C' }}
              onClick={handlePasswordChange}
              disabled={loading}
            >
              {loading ? "Changing..." : "ยืนยัน"}
            </button>
          </div>
        </div>
      </div>
    </HomePage>
  );
}

export default Profile;





// import axios from "axios";
// import { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import config from "../config";
// import HomePage from "../components/HomePage";

// function Profile() {
//   const [user, setUser] = useState({ userName: "", profileImageUrl: "" });
//   const [editMode, setEditMode] = useState(false);
//   const [passwords, setPasswords] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [profileImage, setProfileImage] = useState(null);
//   const [profileImageUrl, setProfileImageUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(config.apiPath + "/user/customer/info", {
//         ...config.headers(),
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       });
//       if (res.data.result) {
//         setUser(res.data.result);
//         setProfileImageUrl(res.data.result.profileImageUrl); // ตั้งค่ารูปภาพโปรไฟล์จาก API
//       }
//     } catch (error) {
//       Swal.fire({
//         title: "Error",
//         text: error.response?.data?.message || error.message,
//         icon: "error",
//       });
//     }
//   };

//   const handleChangeUsername = async () => {
//     if (!user.userName.trim()) {
//       Swal.fire({
//         title: "Error",
//         text: "Username is required",
//         icon: "error",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.put(
//         `${config.apiPath}/user/customer/change-username`,
//         { userName: user.userName },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       Swal.fire({
//         title: "Success",
//         text: res.data.message,
//         icon: "success",
//       });
//       setEditMode(false);
//     } catch (error) {
//       Swal.fire({
//         title: "Error",
//         text: error.response?.data?.message || error.message,
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePasswordChange = async () => {
//     const { oldPassword, newPassword, confirmPassword } = passwords;

//     if (!oldPassword || !newPassword || !confirmPassword) {
//       Swal.fire({
//         title: "Error",
//         text: "All fields are required",
//         icon: "error",
//       });
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       Swal.fire({
//         title: "Error",
//         text: "Passwords do not match!",
//         icon: "error",
//       });
//       return;
//     }

//     if (newPassword.length < 8) {
//       Swal.fire({
//         title: "Error",
//         text: "Password must be at least 8 characters long",
//         icon: "error",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.post(
//         `${config.apiPath}/user/customer/change-password`,
//         { oldPassword, newPassword, confirmPassword },
//         {
//           ...config.headers(),
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         }
//       );
//       Swal.fire({
//         title: "Success",
//         text: "Password changed successfully!",
//         icon: "success",
//       });
//       setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (error) {
//       Swal.fire({
//         title: "Error",
//         text: error.response?.data?.message || error.message,
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadProfileImage = async () => {
//     if (!profileImage) {
//       Swal.fire({
//         title: "Error",
//         text: "Please select an image to upload",
//         icon: "error",
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("profileImage", profileImage);

//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${config.apiPath}/user/customer/upload-profile-image`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       Swal.fire({
//         title: "Success",
//         text: res.data.message,
//         icon: "success",
//       });
//       setProfileImageUrl(res.data.profileImageUrl); // อัปเดต URL ของรูปภาพ
//     } catch (error) {
//       Swal.fire({
//         title: "Error",
//         text: error.response?.data?.message || error.message,
//         icon: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <HomePage>
//       <div className="container w-50 profile-page ps-5">
//         <div className="user-panel mt-3">
//           <div className="profile-image text-center mb-3">
//             <img
//               src={profileImageUrl || user.profileImageUrl || "default-profile-image.png"}
//               alt="Profile"
//               style={{ width: "100px", height: "100px", borderRadius: "50%" }}
//             />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files[0];
//                 if (file) {
//                   setProfileImage(file);
//                   setProfileImageUrl(URL.createObjectURL(file));
//                 }
//               }}
//               className="form-control mt-2"
//             />
//             <button
//               className="btn btn-primary mt-2"
//               onClick={handleUploadProfileImage}
//               disabled={loading}
//             >
//               {loading ? "Uploading..." : "Upload Profile Image"}
//             </button>
//           </div>

//           {editMode ? (
//             <div className="info mt-3">
//               <input
//                 type="text"
//                 className="form-control mb-2"
//                 value={user.userName}
//                 onChange={(e) => setUser({ ...user, userName: e.target.value })}
//                 placeholder="Enter your username"
//                 style={{ borderRadius: "30px" }}
//               />
//               <button
//                 className="btn btn-success btn-sm mr-2"
//                 onClick={handleChangeUsername}
//                 disabled={loading}
//               >
//                 {loading ? "Saving..." : "Save Changes"}
//               </button>
//               <button
//                 className="btn btn-secondary btn-sm"
//                 onClick={() => setEditMode(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           ) : (
//             <div className="info text-center mt-3">
//               <h4>{user.userName}</h4>
//               <button
//                 className="btn rounded-pill"
//                 style={{ backgroundColor: "#5B166C" }}
//                 onClick={() => setEditMode(true)}
//               >
//                 <h6 className="text-white mt-2 mx-2">เปลี่ยนชื่อผู้ใช้</h6>
//               </button>
//             </div>
//           )}

//           <div
//             className="change-password mt-4"
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <h5>เปลี่ยนรหัสผ่าน</h5>
//             <input
//               type="password"
//               className="form-control mb-2 w-50"
//               style={{ borderRadius: "30px" }}
//               value={passwords.oldPassword}
//               onChange={(e) =>
//                 setPasswords({ ...passwords, oldPassword: e.target.value })
//               }
//               placeholder="รหัสผ่านเก่า"
//             />
//             <input
//               type="password"
//               className="form-control mb-2 w-50"
//               style={{ borderRadius: "30px" }}
//               value={passwords.newPassword}
//               onChange={(e) =>
//                 setPasswords({ ...passwords, newPassword: e.target.value })
//               }
//               placeholder="รหัสผ่านใหม่"
//             />
//             <input
//               type="password"
//               className="form-control mb-2 w-50"
//               style={{ borderRadius: "30px" }}
//               value={passwords.confirmPassword}
//               onChange={(e) =>
//                 setPasswords({ ...passwords, confirmPassword: e.target.value })
//               }
//               placeholder="ยืนยันรหัสผ่าน"
//             />
//             <button
//               className="btn btn-warning btn-sm"
//               style={{ borderRadius: "30px", backgroundColor: "#5B166C" }}
//               onClick={handlePasswordChange}
//               disabled={loading}
//             >
//               {loading ? "Changing..." : "ยืนยัน"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </HomePage>
//   );
// }

// export default Profile;