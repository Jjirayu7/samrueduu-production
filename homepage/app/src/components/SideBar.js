// import React, { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
// import MenuBar from "./MenuBar";

// const SideBar = () => {
  // const [isOpen, setIsOpen] = useState(false);
  // const sidebarRef = useRef(null);

  // const toggleSidebar = () => {
  //   setIsOpen(!isOpen);
  // };

  // const handleLinkClick = () => {
  //   setIsOpen(false); 
  // };

  // // เปิด Sidebar เมื่อเมาส์ชนขอบซ้าย
  // const handleMouseMove = (event) => {
  //   if (event.clientX <= 1 && !isOpen) { // ถ้าเมาส์ชนขอบซ้าย 1px
  //     setIsOpen(true);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("mousemove", handleMouseMove);

  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //   };
  // }, [isOpen]);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
  //       setIsOpen(false); 
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

//   return (
//     <>
//       c
//     </>
//   );
// };

// export default SideBar;

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import MenuBar from "./MenuBar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { FiLogOut } from "react-icons/fi";

const SideBar = () => {  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // เช็คขนาดจอ
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleLinkClick = () => {
    setIsOpen(false); 
  };

  // เปิด Sidebar เมื่อเมาส์ชนขอบซ้าย
  const handleMouseMove = (event) => {
    if (event.clientX <= 1 && !isOpen) { // ถ้าเมาส์ชนขอบซ้าย 1px
      setIsOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // อัปเดตสถานะเมื่อขนาดจอเปลี่ยน
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const defaultImage = 'profile-icon.jpg';

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        const fetchData = async () => {
            try {
                const res = await axios.get(config.apiPath + '/user/customer/info', config.headers());
                console.log("API Response:", res.data.result);
                if (res.data.result !== undefined) {
                    console.log(res.data.result.imgProfile);
                    setUser({ ...res.data.result, profileImage: res.data.result.imgProfile });
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    navigate("/signIn");
                }
                Swal.fire({
                    title: 'ไม่มีข้อมูลผู้ใช้',
                    text: 'โปรดเข้าสู่ระบบ',
                    icon: 'warning'
                });
            }
        };

        if (token) {
            fetchData();
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

  return (
    <>
    <div className="sidebar">
         <button className="custom-btn" onClick={toggleSidebar}>
           <div className="d-flex align-items-center justify-content-center top-layer ms-4" >
             <i className="bi bi-list fs-1 text-color"></i>
             <h4 className="mt-1 ms-2 text-color text-bold d-none d-md-block">เมนู</h4>
         </div>
        </button>
      </div>

       <div className={`sidebar-menu ${isOpen ? "open" : ""}`} ref={sidebarRef}>
         <div className="sidebar-content">
           <nav>
             <MenuBar />
           </nav>
        </div>
       </div>
      {!isMobile ? (
        // ✅ แสดง Sidebar ถ้าหน้าจอใหญ่กว่า 1024px
        <div className="sidebar">
          <button className="custom-btn" onClick={toggleSidebar}>
            <div className="d-flex align-items-center justify-content-center top-layer ms-4">
              <i className="bi bi-list fs-1 text-color"></i>
              <h4 className="mt-1 ms-2 text-color text-bold d-none d-md-block">
                เมนู
              </h4>
            </div>
          </button>
          {/* เพิ่มส่วนนี้มา */}
          <div className="mt-5 pt-5">
                <nav>
                    <Link to="/home" className="nav-link">
                        <h6 className="ms-2 text-color">หน้าหลัก</h6>  
                    </Link>                                                  
                </nav>
                <div style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
                
                <div className="mt-3">
                    <Link to="/productMain" className="nav-link">
                        <h6 className="ms-2 text-color">สินค้า</h6>  
                    </Link>                  
                </div>
                <div style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
                
                <div className="mt-3">
                    <Link to="/knowledge" className="nav-link">
                        <h6 className="ms-2 text-color">ความรู้</h6>
                        </Link>                   
                </div>
                <div style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
                
                <div className="mt-3">
                    <Link to="/contact" className="nav-link">
                        <h6 className="ms-2 text-color">ติดต่อเรา</h6> 
                       </Link>                  
                </div>
                <div style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
                
                <div className="mt-3">
                    <Link to="/term-policy" className="nav-link">
                        <h6 className="ms-2 text-color">ข้อกำหนดและนโยบาย</h6>   
                        </Link>                
                </div>
                <div style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
                
                <div className="mt-3">
                    <Link to="/orders" className="nav-link">
                        <h6 className="ms-2 text-color">ประวัติการสั่งซื่อ</h6>    
                    </Link>              
                </div>
                <div style={{ borderTop: "1px solid #D8BABD", width: "100%", margin: "auto" }}></div>
                <div className="mt-3 d-flex justify-content-between align-items-center user-section">
                    {isLoggedIn ? (
                        <Link to='/profile' className="nav-link">
                            <div className="d-flex align-items-center">
                                <img
                                    src={user.profileImage ? `${config.apiPath}/uploads/${user.profileImage}` : defaultImage}
                                    alt={`${user.firstName || 'User'}'s profile`}
                                    className="profile-image"
                                />
                                <h5 className="text-color ms-2 username">{user.userName}</h5>
                            </div>
                        </Link>
                    ) : null}
                    
                    {isLoggedIn ? (
                        <button button onClick={handleLogout} className="nav-link logout-btn flex items-center gap-2">
                          <FiLogOut className="text-red" size={25} />
                        </button>
                    ) : (
                        <Link to="/signIn" className="nav-link">
                            <h6 className="text-color">เข้าสู่ระบบ</h6>
                        </Link>
                    )}                   
                </div>

            </div>
            {/* เพิ่มส่วนนี้มา  */}
        </div>
      ) : (
        <div className="bottom-navbar rounded-5 mb-1">
          <nav>
            <Link to="/" className="nav-link d-flex flex-column align-items-center justify-content-center">
              <i className="bi bi-house-door text-color"></i>
              <span>หน้าแรก</span>
            </Link>
            <Link to="/productMain" className="nav-link d-flex flex-column align-items-center justify-content-center">
              <i className="bi bi-box text-color"></i>
              <span>สินค้า</span>
            </Link>
            <Link to="/cart" className="nav-link d-flex flex-column align-items-center justify-content-center">
              <i className="bi bi-cart text-color"></i>
              <span>ตะกร้า</span>
            </Link>
            <Link to="/profile" className="nav-link d-flex flex-column align-items-center justify-content-center">
              <i className="bi bi-person text-color"></i>
              <span>บัญชี</span>
            </Link>
          </nav>
        </div>

      )}
    </>
  );
};

export default SideBar;

