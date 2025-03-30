import axios from "axios";
import Swal from "sweetalert2";
import config from "../../config";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function SignIn(){
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const handleSignIn = async () =>{
    try{
      
      const res = await axios.post(config.apiPath + '/user/signIn', user);

      if(res.data.token !== undefined){
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      }
    }catch (e) {
      if (e.response.status === 401) {
        Swal.fire({
          title: 'sign in',
          text: 'username or password invalid',
          icon: 'warning'
        })
      }
      else{
        Swal.fire({
          title: 'error',
          text: e.message,
          icon: 'error'
        })
      }
    }
  }

    return(
        <div class="signin-container">   
          <div className="signin-image">
            <img src="logo-2.png" alt="Sign In Visual" />
          </div>      
          <div className="signin-box">
            <div className="p-5" style={{ borderRadius: "30px", backgroundColor: "#fff5f6" }}>
              <div>
                <h6 className="login-box-msg" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: '20vw' }}>แอดมิน-ล็อคอิน</h6>
                <div>
                  <h6>ชื่อผู้ใช้</h6>
                  <div className="input-group mb-3 ">               
                  <input 
                            style={{ borderRadius: "30px"}}
                            type="email" 
                            class="form-control" 
                            placeholder="Email"
                            onChange={e => setUser({  ...user, user: e.target.value })}
                            />
                  </div>
                  <h6>รหัสผ่าน</h6> 
                  <div className="input-group mb-3">
                  <input 
                            style={{ borderRadius: "30px"}}
                            type="password" 
                            class="form-control" 
                            placeholder="Password"
                            onChange={e => setUser({ ...user, pass: e.target.value })}
                            />                
                  </div> 
                    {/* <div className="d-flex justify-content-end">
                      <h6>ลืมรหัสผ่าน?</h6>
                    </div> */}
                    {/* <div style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}>
                        </div> */}
                    <div className="mt-4 d-flex justify-content-center">
                      <button type="submit" onClick={handleSignIn} className="btn rounded-pill" style={{backgroundColor: "#5B166C"}}>
                        <h6 className="text-white mx-4 mt-2">เข้าสู่ระบบ</h6>
                      </button>
                    </div>
                </div>
                {/* <p className="d-flex justify-content-center mt-3">
                  <h6>ยังไม่เป็นสมาชิกหรอ</h6>
                  <Link to="/register">
                    <h6 className="text-center">
                      สมัครสมาชิกเลย
                    </h6>
                  </Link>             
                </p> */}
              </div>
            </div><style jsx>{`
            .signin-container {
            display: flex;
            height: 100vh;
          }

          .signin-image {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .signin-image img {
            max-width: 100%;
            max-height: 100%;
            object-fit: cover;
          }

          .signin-box {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          `}</style>
          </div>     
    </div>
)}

export default SignIn;