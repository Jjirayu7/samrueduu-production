import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import config from "../config";
import { Helmet } from "react-helmet";
import { auth, googleProvider, facebookProvider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

function SignIn() {
  // const pageTitle = "เข้าสู่ระบบ";
  // const [user, setUser] = useState({
  //   userName: "",
  //   password: "",
  // });
  // const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/home");
  //   }
  // }, [navigate]);

  // const handleSignIn = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!user.userName || !user.password) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Please fill in all fields",
  //       icon: "error",
  //     });
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const res = await axios.post(config.apiPath + "/user/customer/signIn", user);

  //     if (res.data.token) {
  //       localStorage.setItem("token", res.data.token);
  //       navigate("/home");
  //     }
  //   } catch (e) {
  //     if (e.response?.status === 401) {
  //       Swal.fire({
  //         title: "Sign In",
  //         text: "Username or password invalid",
  //         icon: "warning",
  //       });
  //     } else {
  //       Swal.fire({
  //         title: "Error",
  //         text: e.message,
  //         icon: "error",
  //       });
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRedirect = () => {
    window.location.href = config.backofficePath; // Redirect ไปที่ http://localhost:3002/signIn
  };
  
  const pageTitle = "เข้าสู่ระบบ";
  const [user, setUser] = useState({ userName: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user.userName || !user.password) {
      Swal.fire({ title: "Error", text: "Please fill in all fields", icon: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(config.apiPath + "/user/customer/signIn", user);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      }
    } catch (e) {
      Swal.fire({ title: "Error", text: e.response?.data?.message || e.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // ✅ ฟังก์ชันล็อกอินด้วย Google
  // const handleGoogleLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
      
  //     console.log("🔹 Google Login Result:", result); // ✅ Log ข้อมูลทั้งหมดที่ได้จาก Google
      
  //     const token = await result.user.getIdToken();
            
  //     handleOAuthLogin(token);
  //   } catch (error) {
  //     console.error("🔻 Google Login Error:", error);
  //     Swal.fire({ title: "Error", text: error.message, icon: "error" });
  //   }
  // };
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      console.log("🔹 Google Login Result:", result); // ✅ Log ข้อมูลทั้งหมด
      
      const token = await result.user.getIdToken();
      
      console.log("🔹 Google ID Token:", token); // ✅ Log Token ที่ได้จาก Firebase
      
      // ✅ ส่งข้อมูลทั้งหมดไปที่ Backend
      handleOAuthLogin({
        token,
        provider: "google",
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL
      });
  
    } catch (error) {
      console.error("🔻 Google Login Error:", error);
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    }
  };
  

  // ✅ ฟังก์ชันล็อกอินด้วย Facebook
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const token = await result.user.getIdToken();
      handleOAuthLogin(token);
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    }
  };

  // ✅ ฟังก์ชันล็อกอินด้วย Line
  const handleLineLogin = () => {
    window.location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${config.lineClientId}&redirect_uri=${config.lineRedirectUri}&state=12345&scope=profile%20openid%20email`;
  };

  // ✅ ฟังก์ชันส่ง token ไป backend
  // const handleOAuthLogin = async (token) => {
  //   try {
  //     const res = await axios.post(config.apiPath + "/user/oauth/signIn", { token });
  //     localStorage.setItem("token", res.data.token);
  //     navigate("/home");
  //   } catch (error) {
  //     Swal.fire({ title: "Error", text: error.message, icon: "error" });
  //   }
  // };
  const handleOAuthLogin = async (userData) => {
    console.log("user data:", userData);
    try {
      const res = await axios.post(config.apiPath + "/user/customer/oauth/signIn", userData);
  
      console.log("🔹 Backend Response:", res.data); // ✅ Log Response จาก Backend
  
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch (error) {
      console.error("🔻 OAuth Login Error:", error);
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    }
  };
  return (
    <div>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Sign In page" />
      </Helmet>

      <div className="signin-container">
        <div className="signin-image">
          <img src="logo-2.png" alt="Sign In Visual" />
        </div>
        <div className="signin-box">
          <div className="p-5" style={{ borderRadius: "30px", backgroundColor: "#fff5f6" }}>
            <div>
              <h6 className="login-box-msg" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "20vw" }}>
                ล็อคอิน
              </h6>
              <form onSubmit={handleSignIn}>
                <h6>ชื่อผู้ใช้</h6>
                <div className="input-group mb-3">
                  <input
                    style={{ borderRadius: "30px" }}
                    type="text"
                    className="form-control"
                    placeholder=""
                    onChange={(e) => setUser({ ...user, userName: e.target.value })}
                  />
                </div>
                <h6>รหัสผ่าน</h6>
                <div className="input-group mb-3">
                <input
                  style={{
                    borderRadius: "30px",
                    paddingRight: "40px", // เพิ่มพื้นที่ด้านขวาให้ไอคอน
                  }}
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder=""
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  value={user.password}
                />
                {user.password && ( // แสดงไอคอนเมื่อมีการพิมพ์
                <span
                  onClick={togglePassword}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    zIndex: 10, // ✅ ป้องกันโดนทับ
                  }}
                >
                  {showPassword ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
                </span>
              )}
              </div>
                <div className="d-flex justify-content-end">
                <Link to="/forgotPassword">
                    <h6>ลืมรหัสผ่าน?</h6>
                  </Link>
                </div>
                <div style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
                <div className="mt-4 d-flex justify-content-center">
                  <button type="submit" className="btn rounded-pill" style={{ backgroundColor: "#5B166C" }} disabled={loading}>
                    <h6 className="text-white mx-4">{loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</h6>
                  </button>
                </div>
              </form>
              <p className="d-flex justify-content-center mt-3">
                <h6 className="mt-1">-หรือ-</h6>
              </p>
            <div className="d-flex justify-content-center">
              {/* <button className="btn mx-2 d-flex bg-white" onClick={handleGoogleLogin}>
                <FcGoogle size={20} /><h5 className="mx-2">Sign in with Google</h5>
                </button> */}
              {/* <button className="btn btn-primary mx-2" onClick={handleFacebookLogin}>Facebook</button>
              <button className="btn btn-success mx-2" onClick={handleLineLogin}>Line</button> */}
            </div>
              <p className="d-flex justify-content-center mt-3">
                <button className="custom-btn" onClick={handleRedirect}>
                  <a className="text-center">สำหรับแอดมิน</a>
                </button>
              </p>
              <p className="d-flex justify-content-center mt-3">
                <h6 className="mt-1">ยังไม่เป็นสมาชิกหรอ</h6>
                <Link to="/register">
                  <a className="text-center">สมัครสมาชิกเลย</a>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default SignIn;

// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import config from "../config";
// import { Helmet } from "react-helmet";

// function SignIn() {
//   const pageTitle = "เข้าสู่ระบบ";
//   const [user, setUser] = useState({
//     userName: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/home");
//     }
//   }, [navigate]);

//   const handleSignIn = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!user.userName || !user.password) {
//       Swal.fire({
//         title: "Error",
//         text: "Please fill in all fields",
//         icon: "error",
//       });
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.post(config.apiPath + "/user/customer/signIn", user);

//       if (res.data.token) {
//         localStorage.setItem("token", res.data.token);
//         const decodedToken = JSON.parse(atob(res.data.token.split('.')[1])); // Decode JWT
    
//         if (decodedToken.role === "admin") {
//             window.location.href = "http://localhost:3000/home";
//         } else if (decodedToken.role === "customer") {
//             navigate("/home");
//         } else {
//             Swal.fire({
//                 title: "Error",
//                 text: "Unauthorized role",
//                 icon: "error",
//             });
//             localStorage.removeItem("token");
//         }
//     }
//     } catch (e) {
//       if (e.response?.status === 401) {
//         Swal.fire({
//           title: "Sign In",
//           text: "Username or password invalid",
//           icon: "warning",
//         });
//       } else {
//         Swal.fire({
//           title: "Error",
//           text: e.message,
//           icon: "error",
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Helmet>
//         <title>{pageTitle}</title>
//         <meta name="description" content="Sign In page" />
//       </Helmet>
//       <div className="signin-container">
//         <div className="signin-image">
//           <img src="logo-2.png" alt="Sign In Visual" />
//         </div>
//         <div className="signin-box">
//           <div className="p-5" style={{ borderRadius: "30px", backgroundColor: "#fff5f6" }}>
//             <div>
//               <h6 className="login-box-msg" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "20vw" }}>
//                 ล็อคอิน
//               </h6>
//               <form onSubmit={handleSignIn}>
//                 <h6>ชื่อผู้ใช้</h6>
//                 <div className="input-group mb-3">
//                   <input
//                     style={{ borderRadius: "30px" }}
//                     type="text"
//                     className="form-control"
//                     placeholder=""
//                     onChange={(e) => setUser({ ...user, userName: e.target.value })}
//                   />
//                 </div>
//                 <h6>รหัสผ่าน</h6>
//                 <div className="input-group mb-3">
//                   <input
//                     style={{ borderRadius: "30px" }}
//                     type="password"
//                     className="form-control"
//                     placeholder=""
//                     onChange={(e) => setUser({ ...user, password: e.target.value })}
//                   />
//                 </div>
//                 <div className="d-flex justify-content-end">
//                   <Link to="/forgotPassword">
//                     <h6>ลืมรหัสผ่าน?</h6>
//                   </Link>
//                 </div>
//                 <div style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
//                 <div className="mt-4 d-flex justify-content-center">
//                   <button type="submit" className="btn rounded-pill" style={{ backgroundColor: "#5B166C" }} disabled={loading}>
//                     <h6 className="text-white mx-4">{loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</h6>
//                   </button>
//                 </div>
//               </form>
//               <p className="d-flex justify-content-center mt-3">
//                 <h6>ยังไม่เป็นสมาชิกหรอ</h6>
//                 <Link to="/register">
//                   <h6 className="text-center">สมัครสมาชิกเลย</h6>
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignIn;
