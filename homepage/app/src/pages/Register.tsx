// import axios from "axios";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import config from "../config";

// function Register() {
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     userName: "",
//     email: "",
//     password: "",
//     repassword: "",
//   });
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (user.password !== user.repassword) {
//       Swal.fire({
//         title: "Error",
//         text: "Passwords do not match",
//         icon: "error",
//       });
//       return;
//     }
//     try {
//       const res = await axios.post(config.apiPath + "/user/customer/register", user);

//       Swal.fire({
//         title: "Success",
//         text: "Registration completed",
//         icon: "success",
//       });
//       navigate("/signIn");
//     } catch (e) {
//       Swal.fire({
//         title: "Error",
//         text: e.response?.data?.message || "An error occurred",
//         icon: "error",
//       });
//     }
//   };

//   return (
//     <div className="signin-container">
//       <div className="signin-image">
//         <img src="logo-2.png" alt="Sign In Visual" />
//       </div>
//       <div className="signin-box">
//         <div className="p-5" style={{ borderRadius: "30px", backgroundColor: "#fff5f6" }}>
//           <h6
//             className="login-box-msg"
//             style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
//           >
//             สมัครสมาชิก
//           </h6>
//           <form onSubmit={handleRegister}>
//             <div className="d-flex justify-content-between mt-4">
//               <div className="mx-2">
//                 <h6>ชื่อ</h6>
//                 <div className="input-group mb-3">
//                   <input
//                     style={{ borderRadius: "30px" }}
//                     type="text"
//                     className="form-control"
//                     placeholder=""
//                     value={user.firstName}
//                     onChange={(e) => setUser({ ...user, firstName: e.target.value })}
//                   />
//                 </div>
//               </div>
//               <div className="mx-2">
//                 <h6>นามสกุล</h6>
//                 <div className="input-group mb-3">
//                   <input
//                     style={{ borderRadius: "30px" }}
//                     type="text"
//                     className="form-control"
//                     placeholder=""
//                     value={user.lastName}
//                     onChange={(e) => setUser({ ...user, lastName: e.target.value })}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="mx-2">
//               <h6>ชื่อผู้ใช้</h6>
//               <div className="input-group mb-3">
//                 <input
//                   style={{ borderRadius: "30px" }}
//                   type="text"
//                   className="form-control"
//                   placeholder=""
//                   value={user.userName}
//                   onChange={(e) => setUser({ ...user, userName: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="mx-2">
//               <h6>อีเมล</h6>
//               <div className="input-group mb-3">
//                 <input
//                   style={{ borderRadius: "30px" }}
//                   type="email"
//                   className="form-control"
//                   placeholder=""
//                   value={user.email}
//                   onChange={(e) => setUser({ ...user, email: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="mx-2">
//               <h6>รหัสผ่าน</h6>
//               <div className="input-group mb-3">
//                 <input
//                   style={{ borderRadius: "30px" }}
//                   type="password"
//                   className="form-control"
//                   placeholder=""
//                   value={user.password}
//                   onChange={(e) => setUser({ ...user, password: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="mx-2">
//               <h6>ยืนยันรหัสผ่าน</h6>
//               <div className="input-group mb-3">
//                 <input
//                   style={{ borderRadius: "30px" }}
//                   type="password"
//                   className="form-control"
//                   placeholder=""
//                   value={user.repassword}
//                   onChange={(e) => setUser({ ...user, repassword: e.target.value })}
//                 />
//               </div>
//             </div>
//             <div className="mt-5" style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
//             <div className="mt-5 d-flex justify-content-center">
//               <button type="submit" className="btn rounded-pill" style={{ backgroundColor: "#5B166C" }}>
//                 <h6 className="text-white mx-4">สมัครสมาชิก</h6>
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;

import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import config from "../config";

function Register() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    repassword: "",
  });
  const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (user.password !== user.repassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match",
        icon: "error",
      });
      return;
    }
    if (!isPolicyAccepted) {
      Swal.fire({
        title: "Error",
        text: "กรุณายอมรับเงื่อนไขและนโยบายความเป็นส่วนตัวก่อนสมัครสมาชิก",
        icon: "error",
      });
      return;
    }
    try {
      const res = await axios.post(config.apiPath + "/user/customer/register", user);

      Swal.fire({
        title: "Success",
        text: "Registration completed",
        icon: "success",
      });
      navigate("/signIn");
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.response?.data?.message || "An error occurred",
        icon: "error",
      });
    }
  };

  const showPrivacyPolicy = () => {
    Swal.fire({
      title: "นโยบายความเป็นส่วนตัว",
      html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto;">
          <h2>1. ข้อมูลที่เราเก็บรวบรวม</h2>
          <p>เราอาจเก็บข้อมูลส่วนบุคคล เช่น ชื่อ อีเมล เบอร์โทรศัพท์ และข้อมูลการใช้งานเว็บไซต์ของท่าน เพื่อให้บริการที่ดียิ่งขึ้น</p>
          <h2>2. การใช้งานข้อมูล</h2>
          <p>ข้อมูลที่เราเก็บรวบรวมจะถูกใช้เพื่อปรับปรุงประสบการณ์การใช้งาน และให้บริการตามที่ท่านต้องการเท่านั้น เราจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านแก่บุคคลที่สาม โดยไม่ได้รับอนุญาต</p>
          <h2>3. คุกกี้</h2>
          <p>เว็บไซต์ของเราอาจใช้คุกกี้เพื่อจดจำการตั้งค่าของท่าน และปรับแต่งเนื้อหาให้เหมาะสมกับการใช้งาน ท่านสามารถเลือกปิดการใช้งานคุกกี้ได้จากการตั้งค่าในเบราว์เซอร์ของท่าน</p>
          <h2>4. สิทธิ์ของท่าน</h2>
          <p>ท่านมีสิทธิ์ในการเข้าถึงข้อมูลส่วนบุคคลของท่าน ขอให้แก้ไข หรือลบข้อมูลได้ตามที่ท่านต้องการ หากท่านมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อเรา</p>
          <h2>5. การเปลี่ยนแปลงนโยบาย</h2>
          <p>เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงนโยบายความเป็นส่วนตัวนี้ตามความเหมาะสม โดยการเปลี่ยนแปลงใด ๆ จะถูกประกาศบนหน้าเว็บไซต์นี้</p>
        </div>
      `,
      width: 600,
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  return (
    <div className="signin-container">
      <div className="signin-image">
        <img src="logo-2.png" alt="Sign In Visual" />
      </div>
      <div className="signin-box">
        <div className="p-5" style={{ borderRadius: "30px", backgroundColor: "#fff5f6" }}>
          <h6
            className="login-box-msg"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
          >
            สมัครสมาชิก
          </h6>
          <form onSubmit={handleRegister}>
            {/* Existing form fields */}
            <div className="d-flex justify-content-between mt-4">
              <div className="mx-2">
                <h6>ชื่อ</h6>
                <div className="input-group mb-3">
                  <input
                    style={{ borderRadius: "30px" }}
                    type="text"
                    className="form-control"
                    placeholder=""
                    value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div className="mx-2">
                <h6>นามสกุล</h6>
                <div className="input-group mb-3">
                  <input
                    style={{ borderRadius: "30px" }}
                    type="text"
                    className="form-control"
                    placeholder=""
                    value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="mx-2">
              <h6>ชื่อผู้ใช้</h6>
              <div className="input-group mb-3">
                <input
                  style={{ borderRadius: "30px" }}
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={user.userName}
                  onChange={(e) => setUser({ ...user, userName: e.target.value })}
                />
              </div>
            </div>
            <div className="mx-2">
              <h6>อีเมล</h6>
              <div className="input-group mb-3">
                <input
                  style={{ borderRadius: "30px" }}
                  type="email"
                  className="form-control"
                  placeholder=""
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
            </div>
            <div className="mx-2">
              <h6>รหัสผ่าน</h6>
              <div className="input-group mb-3">
                <input
                  style={{ borderRadius: "30px" }}
                  type="password"
                  className="form-control"
                  placeholder=""
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
              </div>
            </div>
            <div className="mx-2">
              <h6>ยืนยันรหัสผ่าน</h6>
              <div className="input-group mb-3">
                <input
                  style={{ borderRadius: "30px" }}
                  type="password"
                  className="form-control"
                  placeholder=""
                  value={user.repassword}
                  onChange={(e) => setUser({ ...user, repassword: e.target.value })}
                />
              </div>
            </div>

            {/* Checkbox for policy acceptance */}
            <div className="mx-2 my-4">
              <label>
                <input
                  type="checkbox"
                  checked={isPolicyAccepted}
                  onChange={(e) => setIsPolicyAccepted(e.target.checked)}
                  className="mr-2"
                />
                ฉันยอมรับเงื่อนไขและ
                <span
                  className="text-blue-500 underline cursor-pointer"
                  onClick={showPrivacyPolicy}
                >
                  นโยบายความเป็นส่วนตัว
                </span>
              </label>
            </div>

            <div className="mt-5" style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
            <div className="mt-5 d-flex justify-content-center">
              <button
                type="submit"
                className="btn rounded-pill"
                style={{ backgroundColor: isPolicyAccepted ? "#5B166C" : "#BDBDBD" }}
                disabled={!isPolicyAccepted}
              >
                <h6 className="text-white mx-4">สมัครสมาชิก</h6>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
