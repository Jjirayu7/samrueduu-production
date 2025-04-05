// // import React from "react";
// // import { useEffect, useState, useRef } from 'react';
// // import { Link } from "react-router-dom";
// // import MenuBar from "./MenuBar";


// // function Header({ title }) {
  
// //   const [headerTitle, setHeaderTitle] = useState('');
// //   const [isOpen, setIsOpen] = useState(false);
// //   const sidebarRef = useRef(null)

// //   useEffect(() => {
// //     setHeaderTitle(title || 'สามฤดู'); 
// //   }, [title]);
  
// //   const toggleSidebar = () => {
// //     setIsOpen(!isOpen);
// //   };

// //   useEffect(() => {
// //       const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //           setIsOpen(false); 
// //         }
// //       };
  
// //       document.addEventListener("mousedown", handleClickOutside);
// //       return () => {
// //         document.removeEventListener("mousedown", handleClickOutside);
// //       };
// //     }, []);


// //   return (
// //     <div className="d-flex align-item-center p-3">
// //       <div>
// //         <button className="custom-btn mt-2 ms-5" onClick={toggleSidebar}>
// //           <div className="d-flex align-items-center justify-content-center">
// //             <i className="bi bi-list fs-1 text-color"></i>
// //             <h4 className="mt-1 ms-2 text-color text-bold d-none d-md-block">เมนู</h4>
// //           </div>
// //         </button>
// //       </div>

// //       <div className={`sidebar-menu ${isOpen ? "open" : ""}`} ref={sidebarRef}>
// //         <div className="sidebar-content">
// //           <nav>
// //             <MenuBar></MenuBar>
// //           </nav>
// //         </div>
// //       </div>
// //       <div className="container p-3 w-75">
// //       <div className="row">
// //         <div className="col-8 col-md-9 col-lg-10">
// //           <div className="rounded">
// //             <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-center">           
// //               <Link to={-1} className="nav-link">
// //                 <button className="custom-btn">
// //                   <h5 className="text-color mb-2 mb-md-0">ย้อนกลับ</h5>
// //                 </button>
// //               </Link>
// //               {headerTitle === "สามฤดู" ? (
// //                 <Link to="/" className="nav-link">
// //                   <h3 className="text-color text-bold mb-2 mb-md-0">{headerTitle}</h3>
// //                 </Link>
// //               ) : (
// //                 <h3 className="text-color text-bold mb-2 mb-md-0">{headerTitle}</h3>
// //               )}
// //               <Link to="/cart" className="nav-link">
// //                 <button style={{ borderColor: "#D8BABD", borderRadius: "15px" }} className="btn">                           
// //                   <i className="bi bi-cart fs-4 text-color"></i>
// //                 </button>
// //               </Link>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// //   );
// // }

// // export default Header;


// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import MenuBar from "./MenuBar";
// import axios from "axios";
// import Swal from "sweetalert2";
// import config from "../config"; // ตรวจสอบว่า config.apiPath ถูกต้อง


// function Header({ title }) {
//   const [headerTitle, setHeaderTitle] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 1024);
//   const sidebarRef = useRef(null);

//   useEffect(() => {
//     setHeaderTitle(title || "สามฤดู");

//     const handleResize = () => {
//       setIsScreenSmall(window.innerWidth < 1024);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [title]);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     // ดึงข้อมูลจาก localStorage เมื่อ component โหลด
//     const carts = JSON.parse(localStorage.getItem("carts")) || [];
    
//     // นับจำนวนสินค้าเฉพาะที่มี ID ต่างกัน
//     const uniqueItems = new Set(carts.map(item => item.id)); // สร้าง Set เพื่อให้แน่ใจว่าแต่ละไอดีไม่ซ้ำ
//     setCartCount(uniqueItems.size);  // อัปเดตจำนวนสินค้าในตะกร้า (นับแค่สินค้าที่ไม่ซ้ำ)
//   }, []);
//   // return (
//   //   <div className="d-flex align-items-center p-3">
//   //     {/* ซ่อนปุ่มเมนูเมื่อจอน้อยกว่า 1024px */}
      
//   //       <div>
//   //         <button className="custom-btn mt-3 menu-cus" onClick={toggleSidebar}>
//   //           <div className="d-flex align-items-center justify-content-center">
//   //             <i className="bi bi-list fs-1 text-color"></i>
//   //             <h4 className="mt-1 ms-2 text-color text-bold d-none d-md-block">เมนู</h4>
//   //           </div>
//   //         </button>
//   //       </div>
      

//   //     {/* Sidebar Menu */}
//   //     <div className={`sidebar-menu ${isOpen ? "open" : ""}`} ref={sidebarRef}>
//   //       <div className="sidebar-content">
//   //         <nav>
//   //           <MenuBar />
//   //         </nav>
//   //       </div>
//   //     </div>

//   //     {/* Header Content */}
//   //     <div className="container mt-4 w-75">
//   //       <div className="row">
//   //         <div className="col-12 col-md-12 col-lg-10">
//   //           <div className="rounded">
//   //             <div className="d-flex flex-md-row justify-content-between align-items-center text-center">
//   //               <Link to={-1} className="nav-link">
//   //                 <button className="custom-btn">
//   //                   <h5 className="text-color mb-2 mb-md-0">ย้อนกลับ</h5>
//   //                 </button>
//   //               </Link>
//   //               {headerTitle === "สามฤดู" ? (
//   //                 <Link to="/" className="nav-link">
//   //                   <h3 className="text-color text-bold mb-2 mb-md-0">{headerTitle}</h3>
//   //                 </Link>
//   //               ) : (
//   //                 <h3 className="text-color text-bold mb-2 mb-md-0">{headerTitle}</h3>
//   //               )}
//   //               <Link to="/cart" className="nav-link">
//   //                 <button style={{ borderColor: "#D8BABD", borderRadius: "15px" }} className="btn position-relative">
//   //                   <i className="bi bi-cart fs-4 text-color"></i>
//   //                   {cartCount > 0 && (
//   //                     <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
//   //                       {cartCount}
//   //                     </span>
//   //                   )}
//   //                 </button>
//   //               </Link>
//   //             </div>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
//   const [searchQuery, setSearchQuery] = useState('');
//   const [products, setProducts] = useState([]); // เก็บรายการสินค้าทั้งหมด
//   const [filteredProducts, setFilteredProducts] = useState([]); // เก็บผลลัพธ์การค้นหา
//   const [showDropdown, setShowDropdown] = useState(false);
//   const searchBoxRef = useRef(null);
//   useEffect(() => {
    
//     if (searchQuery.trim() === "") {
//       setFilteredProducts([]);
//       setShowDropdown(false);
//       return;
//     }

//     const results = products.filter(product =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setFilteredProducts(results);
//     setShowDropdown(results.length > 0);
//   }, [searchQuery, products]);

//   // ปิด dropdown ถ้าคลิกนอกพื้นที่
//   useEffect(() => {
//     fetchData();
//     const handleClickOutside = (event) => {
//       if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(config.apiPath + "/product/list");
//       if (res.data.result !== undefined) {
//         setProducts(res.data.result);
//         setFilteredProducts(res.data.result);
//       }
//     } catch (e) {
//       Swal.fire({
//         title: "Error",
//         text: e.message,
//         icon: "error"
//       });
//     }
//   };

//   function showImage(item) {
//     if (item.imgs && item.imgs.length > 0) {  
//         let imgPath = config.apiPath + '/uploads/' + item.imgs[0]; 
//         return <img className="card-img" height="100px" src={imgPath} alt="Product Image" />;
//     }
//     return <img className="card-img" height="100px" src="imgnot.jpg" alt="No image" />; 
// }

//   return (
//     <div 
//       className="d-flex align-items-center p-2 bg-white"
//       style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000 }}
//     >
//       {/* ซ่อนปุ่มเมนูเมื่อจอน้อยกว่า 1024px */}
//       <div>
//         <button className="custom-btn mt-3 menu-cus" onClick={toggleSidebar}>
//           <div className="d-flex align-items-center justify-content-center">
//             <i className="bi bi-list fs-1 text-color"></i>
//             <h4 className="mt-1 ms-2 text-color text-bold d-none d-md-block">เมนู</h4>
//           </div>
//         </button>
//       </div>
  
//       {/* Sidebar Menu */}
//       <div className={`sidebar-menu ${isOpen ? "open" : ""}`} ref={sidebarRef}>
//         <div className="sidebar-content">
//           <nav>
//             <MenuBar />
//           </nav>
//         </div>
//       </div>
  
//       {/* Header Content */}
//       <div className="container mt-4 w-75">
//         <div className="row">
//           <div className="col-12">
//             <div className="rounded">
//               <div className="d-flex flex-md-row justify-content-between align-items-center text-center">
//                 {/* <Link to={-1} className="nav-link">
//                   <button className="custom-btn">
//                     <h5 className="text-color mb-2 mb-md-0">ย้อนกลับ</h5>
//                   </button>
//                 </Link> */}
//                 {headerTitle === "สามฤดู" ? (
//                   <Link to="/" className="nav-link">
//                     <p className="text-color text-bold mb-2 mb-md-0 brand-text">{headerTitle}</p>
//                   </Link>
//                 ) : (
//                   <h3 className="text-color text-bold mb-2 mb-md-0">{headerTitle}</h3>
//                 )}
//                   {/*ช่องค้นหาสินค้า */}
//                   <div className="search-box position-relative d-flex" ref={searchBoxRef}>
//                     <input
//                       type="text"
//                       className="form-control custom-placeholder rounded-start-pill"
//                       placeholder="ค้นหาสินค้า..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       onFocus={() => setShowDropdown(true)}
//                     />
//                     <button 
//                       className="btn btn-primary rounded-end-pill ms-2"
//                       onClick={() => setShowDropdown(true)}
//                       style={{ backgroundColor: "#5B166C" }}
//                     >
//                       <i className="bi bi-search"></i><span>ค้นหา</span>
//                     </button>

//                     {/* Dropdown แสดงผลลัพธ์การค้นหา */}
//                     {showDropdown && (
//                       <ul className="dropdown-menu show w-100">
//                         {searchQuery === "" ? (
//                           <li className="dropdown-item text-muted">
//                             <span className="text-dark">ไม่พบสินค้า</span>
//                             </li>
//                         ) : filteredProducts.length > 0 ? (
//                           filteredProducts.map((product) => (
//                             <li key={product.id} className="dropdown-item">
//                               <Link to={`/productInfo/${product.id}`} className="text-dark text-decoration-none">
//                                 <div className="d-flex align-items-center">
//                                   {/* <div className="h-25">{showImage(product)}</div> */}
//                                   {product.name}
//                                 </div>
                                
//                               </Link>
//                             </li>
//                           ))
//                         ) : (
//                           <li className="dropdown-item text-muted"><span className="text-dark">ไม่พบสินค้า</span></li>
//                         )}
//                       </ul>
//                     )}
//                   </div>
//                 <Link to="/cart" className="nav-link">
//                   <button style={{ borderColor: "#D8BABD", borderRadius: "15px" }} className="btn position-relative">
//                     <i className="bi bi-cart fs-4 text-color"></i>
//                     {cartCount > 0 && (
//                       <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
//                         {cartCount}
//                       </span>
//                     )}
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Header;


import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuBar from "./MenuBar";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../config"; // ตรวจสอบว่า config.apiPath ถูกต้อง

function Header({ title }) {
  const [headerTitle, setHeaderTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 1024);
  const sidebarRef = useRef(null);

  useEffect(() => {
    setHeaderTitle(title || "สามฤดู");

    const handleResize = () => {
      setIsScreenSmall(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [title]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
  
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const carts = JSON.parse(localStorage.getItem("carts")) || [];
    const uniqueItems = new Set(carts.map(item => item.id)); 
    setCartCount(uniqueItems.size);  
  }, []);
  
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [showDropdown, setShowDropdown] = useState(false); 
  const searchBoxRef = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      setShowDropdown(false);
      return;
    }

    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(results);
    setShowDropdown(results.length > 0);
  }, [searchQuery, products]);

  useEffect(() => {
    fetchData();
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/product/list");
      if (res.data.result !== undefined) {
        setProducts(res.data.result);
        setFilteredProducts(res.data.result);
      }
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: e.message,
        icon: "error"
      });
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get("query") || "";

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    navigate(`/productMain?query=${encodeURIComponent(searchQuery)}`);
  };

  // ฟังก์ชันล้างค่า searchQuery
  // const clearSearchQuery = () => {
  //   setSearchQuery("");
  //   setShowDropdown(false); // ปิด dropdown เมื่อเคลียร์ค่าค้นหา
  // };

  return (
    <div 
      className="header-bar d-flex align-items-center p-2"
      // style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000, backgroundColor: "#FFA347" }}
    >
      {/* ซ่อนปุ่มเมนูเมื่อจอน้อยกว่า 1024px */}
      <div className="d-flex align-items-center">
        <button className="custom-btn mt-3 menu-cus" onClick={toggleSidebar}>
          <div className="d-flex align-items-center justify-content-center">
            <i className="bi bi-list fs-1 text-color"></i>
          </div>
        </button>
        <img src="logo-3.png" className="logo-header mt-2" alt=""></img>
        {/* <h4 className="mt-3 ms-2 text-color text-bold d-none d-md-block">สามฤดู</h4> */}
      </div>
  
      {/* Sidebar Menu */}
      <div className={`sidebar-menu ${isOpen ? "open" : ""}`} ref={sidebarRef}>
        <div className="sidebar-content">
          <nav>
            <MenuBar />
          </nav>
        </div>
      </div>
  
      {/* Header Content */}
      <div className="container mt-4 w-75">
        <div className="row">
          <div className="col-12">
            <div className="rounded">
              <div className="d-flex flex-md-row justify-content-between align-items-center text-center">
                {/* {headerTitle === "สามฤดู" ? (
                  <Link to="/" className="nav-link">
                    <p className="text-color text-bold mb-2 mb-md-0 brand-text">{headerTitle}</p>
                  </Link>
                ) : (
                  <h3 className="text-color text-bold mb-2 mb-md-0">{headerTitle}</h3>
                )} */}
                {/* ช่องค้นหาสินค้า */}
                <div className="search-box position-relative d-flex me-2" ref={searchBoxRef}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control custom-placeholder rounded-start-pill"
                    placeholder="ค้นหาสินค้า..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {/* ปุ่มกากบาท (X) เพื่อล้างค่าค้นหา */}
                  {searchQuery && (
                    <button
                    className="btn"
                    type="button"
                    onClick={() => setSearchQuery('')}
                  >
                  <i className="bi bi-x-circle text-muted"></i>
                  </button>
                    
                  )}
                </div>
                  <button 
                    className="btn text-white rounded-end-pill"
                    onClick={handleSearch}
                    style={{ 
                      backgroundColor: "#5B166C",
                      borderColor: "#D8BABD",
                     }}
                  >
                    <div className="d-flex">
                      <i className="bi bi-search "></i>
                    </div>
                  </button>

                  

                  {/* Dropdown แสดงผลลัพธ์การค้นหา */}
                  {showDropdown && (
                    <ul className="dropdown-menu show w-100 mt-5">
                      {searchQuery === "" ? (
                        <li className="dropdown-item text-muted">
                          <span className="text-dark">ไม่พบสินค้า</span>
                        </li>
                      ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <li key={product.id} className="dropdown-item">
                            <Link to={`/productInfo/${product.id}`} className="text-dark text-decoration-none">
                              <div className="d-flex align-items-center">
                                {product.name}
                              </div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="dropdown-item text-muted"><span className="text-dark">ไม่พบสินค้า</span></li>
                      )}
                    </ul>
                  )}
                </div>
                <Link to="/cart" className="nav-link">
                  <button style={{ borderColor: "#D8BABD", borderRadius: "15px", backgroundColor: "#5B166C" }} className="btn position-relative">
                    <i className="bi bi-cart fs-4 text-white"></i>
                    {cartCount > 0 && (
                      <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
