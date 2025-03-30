// import React, { useState } from "react";
// import HomePage from "../components/HomePage";
// import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// import { useEffect } from "react"; // นำเข้า useEffect จาก react
// import { useLocation } from "react-router-dom"; // ใช้ useLocation จาก react-router-dom
// import config from "../config";
// import Swal from "sweetalert2";
// import ReactSelect from 'react-select';

// function Checkout() {
//     const [name, setName] = useState("");
//     const [address, setAddress] = useState("");
//     const [phone, setPhone] = useState("");
//     const location = useLocation();
//     const { carts, sumPrice, sumQty } = location.state || {};
//     const [user, setUser] = useState({});
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [selected, setSelected] = useState("QR Promptpay");
//     const [userAddresses, setUserAddresses] = useState([]);
//     const [isEditing, setIsEditing] = useState(false);

//     const stripePromise = loadStripe("pk_test_51Qc3PWP8f6nZH2rwdJlAtC53Ck5G1EIXGT9ePpaxmWaHUzmWs7DmvODxzWmSCyUigDOwS5QCbZoCpSAuib6g7log00JbXf5hjH");

//     const uniquePhones = [...new Set(userAddresses.map(item => item.phone))].map(phone => ({
//       value: phone,
//       label: phone,
//   }));
  
//   const uniqueAddresses = [...new Set(userAddresses.map(item => item.address))].map(address => ({
//       value: address,
//       label: address,
//   }));

//   useEffect(() => {
//     // เมื่อ userAddresses ถูกอัปเดต
//     if (userAddresses.length > 0) {
//         // กำหนดค่าเริ่มต้นให้ phone เป็นค่าสุดท้าย
//         const lastPhone = userAddresses[userAddresses.length - 1].phone;
//         setPhone(lastPhone);

//         // กำหนดค่าเริ่มต้นให้ address เป็นค่าสุดท้าย
//         const lastAddress = userAddresses[userAddresses.length - 1].address;
//         setAddress(lastAddress);
//     }
// }, [userAddresses]); // เรียกเมื่อ userAddresses เปลี่ยนแปลง

//     useEffect(() => {
//         console.log("ตะกร้า", carts, "ราคารวม", sumPrice, sumQty);
//         fetchData();
//     }, [carts, sumPrice, sumQty]);

//     const fetchData = async () => {
//         try {
//             const res = await axios.get(config.apiPath + "/user/customer/info", config.headers());
//             if (res.data.result) {
//                 setUser(res.data.result);
//                 setFirstName(res.data.result.firstName);
//                 setLastName(res.data.result.lastName);
//                 setPhone(res.data.result.phone);
//                 setName(res.data.result.firstName + " " + res.data.result.lastName);

//                 const addressRes = await axios.get(
//                     `${config.apiPath}/api/sale/address/list/${res.data.result.id}`,
//                     config.headers()
//                 );
//                 if (addressRes.data.results) {
//                     setUserAddresses(addressRes.data.results);
//                 }
//             }
//         } catch (error) {
//             Swal.fire({
//                 title: "Error",
//                 text: error.message,
//                 icon: "error",
//             });
//         }
//     };

//     const checkStock = async () => {
//         try {
//             for (const item of carts) {
//                 const response = await axios.get(`${config.apiPath}/product/stock/${item.id}`, config.headers());
//                 const stock = response.data.stock;

//                 if (stock < item.qty) {
//                     Swal.fire({
//                         title: "สต็อกไม่เพียงพอ",
//                         text: `สินค้า "${item.name}" มีสต็อกเพียง ${stock} ชิ้น`,
//                         icon: "error",
//                     });
//                     return false;
//                 }
//             }
//             return true;
//         } catch (error) {
//             Swal.fire({
//                 title: "Error",
//                 text: error.message,
//                 icon: "error",
//             });
//             return false;
//         }
//     };

//     const placeOrder = async (order) => {
//       try {
//           const requestData = {
//               product: {
//                   name: "carts",
//                   price: sumPrice,
//                   quantity: 1,
//               },
//               information: {
//                   name: order.name,
//                   address: order.address,
//                   phone: order.phone,
//               },
//               paymentMethod: selected,
//               carts: carts.map((item) => ({ id: item.id, qty: item.qty })),
//               userId: user.id,
//           };
  
//           console.log("Request Data:", requestData); // ตรวจสอบข้อมูลก่อนส่ง
  
//           if (selected === "ชำระเงินปลายทาง") {
//               const response = await axios.post(config.apiPath + "/api/sale/checkout-cod", requestData);
//               window.location.href = response.data.successUrl;
//           } else {
//               const response = await axios.post(config.apiPath + "/api/sale/checkout", requestData);
  
//               if (!response || !response.data || !response.data.id) {
//                   throw new Error("Invalid response data: Missing session ID");
//               }
  
//               const stripe = await stripePromise;
//               const result = await stripe.redirectToCheckout({
//                   sessionId: response.data.id,
//               });
  
//               if (result.error) {
//                   console.error("Stripe redirection error:", result.error.message);
//                   alert("There was an issue redirecting to the payment page. Please try again.");
//               }
//           }
//       } catch (error) {
//           console.log("Error during checkout:", error);
//           alert("An error occurred while placing your order. Please try again later.");
//       }
//   };

//   const handleCheckout = async () => {
//     if (!name || !address || !phone) {
//         Swal.fire({
//             title: "Error",
//             text: "กรุณากรอกข้อมูลชื่อ, ที่อยู่, และเบอร์โทรศัพท์ให้ครบถ้วน",
//             icon: "error",
//         });
//         return;
//     }

//     // ตรวจสอบสต็อกสินค้าก่อนทำการสั่งซื้อ
//     const isStockAvailable = await checkStock();
//     if (!isStockAvailable) {
//         return; // หยุดการสั่งซื้อหากสต็อกไม่เพียงพอ
//     }

//     // ทำการสั่งซื้อ
//     await placeOrder({ name, phone, address });
// };

//     const toggleEditing = () => {
//         setIsEditing(!isEditing);
//     };

//     const handleSelect = (method) => {
//         setSelected(method);
//     };

//     const showImage = (item) => {
//         if (item.imgs && item.imgs.length > 0) {
//             let imgPath = config.apiPath + "/uploads/" + item.imgs[0];
//             return <img className="rounded-4" height="80px" width="80px" src={imgPath} alt="Product" />;
//         }
//         return <img className="rounded-4" height="100px" src="imgnot.jpg" alt="No image" />;
//     };

//     const handleAddressSelect = (selectedAddress) => {
//         setAddress(selectedAddress.value);
//     };

//     const handlePhoneSelect = (selectedPhone) => {
//         setPhone(selectedPhone.value);
//     };

//     const handleInputChange = (e) => {
//       const input = e.target.value;
//       const onlyNumbers = input.replace(/\D/g, ""); // ลบตัวอักษรที่ไม่ใช่ตัวเลขออก
//       const formattedNumber = onlyNumbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"); // จัดรูปแบบเบอร์โทร
//       setPhone(formattedNumber); // กำหนดค่า phone
//   };
//   return (
//     <HomePage>
//         <div className="container ">
//             <div className="d-flex justify-content-center">
//                 <div className="card" style={{ borderRadius: "30px", padding: "20px", width: "80%", maxWidth: "1200px", height: "260px", borderColor: "#D8BABD" }}>
//                     <h5 className="ms-4">ที่อยู่ในการจัดส่ง</h5>
//                     <div className="mb-3" style={{ display: "flex", height: "100%", alignItems: "center" }}>
//                         {/* คอลัมน์ที่ 1 */}
//                         <div  style={{ flex: 1, padding: "10px", textAlign: "center" }}>
//                         {isEditing ? (
//                           <div>
//                             {/* ช่อง input สำหรับแก้ไขชื่อ */}
//                             <div className="d-flex">
//                               <span className="mt-3 mx-4 text-black">ชื่อ : </span>
//                               <input
//                                 type="text"
//                                 name="fullname"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 placeholder="ชื่อ นามสกุล"
//                                 style={{
//                                   border: "1px solid #ccc",
//                                   borderRadius: "30px",
//                                   padding: "10px",
//                                   outline: "none",
//                                 }}
//                               />
//                             </div>
//                             <div className="d-flex">
//                               <span className="mt-3 mx-2 text-black">โทรศัพท์ :</span>
//                               <input
//                                 type="text"
//                                 value={phone}
//                                 onChange={handleInputChange}
//                                 placeholder=""
//                                 className="mt-2"
//                                 style={{
//                                   border: "1px solid #ccc",
//                                   borderRadius: "30px",
//                                   padding: "10px",
//                                   width: "200px",
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         ) : (
//                           <div>
//                             {/* <h6 className="text-black mt-3">
//                               {firstName} {lastName}
//                             </h6> */}
//                             <div className="d-flex">
//                               <span className="mt-3 mx-4 text-black">ชื่อ :</span>
//                             <input
//                                 type="text"
//                                 name="fullname"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 placeholder="ชื่อ นามสกุล"
//                                 style={{
//                                   border: "1px solid #ccc",
//                                   borderRadius: "30px",
//                                   padding: "10px",
//                                   outline: "none",
//                                   height: "45px"
//                                 }}
//                               />
//                             </div>
                            
//                             <span className="text-black d-flex">
//                             <span className="mt-3 mx-2 text-black">โทรศัพท์ : </span>
//                               {/* ส่วนของ select เบอร์โทร */}
//                                 <ReactSelect className="mt-2"
//                                   options={uniquePhones}
//                                   onChange={handlePhoneSelect}
//                                   value={phone && { value: phone, label: phone }}
//                                   placeholder="ค้นหา"
//                                   styles={{
//                                       container: (provided) => ({
//                                           ...provided,
//                                           width: '200px',
//                                           borderRadius: '30px',
//                                       }),
//                                       control: (provided) => ({
//                                           ...provided,
//                                           borderRadius: '30px',
//                                           border: '1px solid #ccc',
//                                           height: "45px"
//                                       }),
//                                   }}
//                               />
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       {/* เส้นแบ่งแนวตั้ง */}
//                       <div style={{
//                         width: "1px",
//                         backgroundColor: "#D8BABD",
//                         height: "100%",
//                       }}></div>

//                       {/* คอลัมน์ที่ 2 */}
//                       <div style={{ flex: 1, padding: "10px", textAlign: "center", marginRight: "60px" }}>
//                         {/* ส่วนของการเลือกที่อยู่ */}
//                         {isEditing ? (
//                           <div>
//                             <div className="d-flex justify-content-start mb-1">                            
//                               <span className="mt-2 mx-4 text-black">ที่อยู่ : </span>
//                               </div>
//                             <textarea
//                             type="text"
//                             name="address"
//                             value={address}
//                             onChange={(e) => setAddress(e.target.value)}
//                             placeholder=""
//                             className="w-100"
//                             style={{
//                               height: "100px",
//                               border: "1px solid #ccc",
//                               borderRadius: "30px",
//                               padding: "10px",
//                               outline: "none",
//                               resize: "none",
//                             }}
//                           />
//                           </div>
                          
                          
//                         ) : (
//                           <span className="text-black d-flex justify-content-center">
//                             <span className="mt-2 mx-4 text-black">ที่อยู่</span>
//                               <ReactSelect
//                               options={uniqueAddresses}
//                               onChange={handleAddressSelect}
//                               value={address && { value: address, label: address }}
//                               placeholder="ค้นหา"
//                               styles={{
//                                   container: (provided) => ({
//                                       ...provided,
//                                       width: '200px',
//                                       borderRadius: '30px',
//                                   }),
//                                   control: (provided) => ({
//                                       ...provided,
//                                       borderRadius: '30px',
//                                       border: '1px solid #ccc',
//                                       height: "45px"
//                                   }),
//                               }}
//                           />
//                           </span>
//                         )}
//                       </div>

//                       {/* เส้นแบ่งแนวตั้ง */}
//                       <div style={{
//                         width: "1px",
//                         backgroundColor: "#D8BABD",
//                         height: "100%",
//                       }}></div>

//                       {/* คอลัมน์ที่ 3 */}
//                       <div style={{ flex: 1, textAlign: "center" }}>
//                         <button
//                             onClick={toggleEditing}
//                             className="custom-btn"
//                         >
//                             {isEditing ? 'ปิดการแก้ไข' : 'แก้ไข'}
//                         </button>
//                       </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="d-flex justify-content-center mt-4">
//                 <div className="card" style={{ borderRadius: "30px", width: "80%", maxWidth: "1200px", borderColor: "#D8BABD" }}>
//                 {carts.length > 0 ? (
//                           <>
//                               {/* ตารางสินค้า */}
//                               <table className="table borderless">
//                                   <thead>
//                                       <tr>
//                                           <th scope="col"></th>
//                                           <th scope="col" className="text-center"><h6>ราคาต่อหน่วย</h6></th>
//                                           <th scope="col" className="text-center"><h6>จำนวน</h6></th>
//                                           <th scope="col" className="text-center"><h6>ราคาต่อรวม</h6></th>
//                                       </tr>
//                                   </thead>
//                                   <tbody>
//                                       {carts.map(item => (
//                                           <tr key={item.id}>
//                                               <td className="d-flex align-items-center ms-5">
//                                                   {showImage(item)}
//                                                   <div className="text-wrap overflow-hidden ps-3">
//                                                       <h5
//                                                           className="text-truncate text-black"
//                                                           data-bs-toggle="tooltip"
//                                                           title={item.name}
//                                                       >
//                                                           {item.name}
//                                                       </h5>
//                                                       <span className="text-black">คลัง {item.stock} ชิ้น</span>
//                                                   </div>
//                                               </td>
//                                               <td className="text-center">
//                                                   <h5 className="text-black mt-4">{item.price.toLocaleString('th-TH')} ฿</h5>
//                                               </td>
//                                               <td className="text-center">
//                                                   <h5 className="text-black mt-4">{item.qty}</h5>
//                                               </td>
//                                               <td className="text-center">
//                                                   <h5 className="text-black mt-4">{(item.price * item.qty).toLocaleString('th-TH')} ฿</h5>
//                                               </td>
//                                           </tr>
//                                       ))}
//                                   </tbody>
//                               </table>

//                               {/* เส้นแบ่ง */}
//                               <div className="mt-5" style={{ borderTop: "1px solid #D8BABD", width: "90%", margin: "auto" }}></div>

//                               {/* รวมราคา */}
//                               <div className="d-flex justify-content-end">
//                                   <div className="m-5 d-flex">
//                                       <h3 className="text-black">{sumPrice.toLocaleString('th-TH')}.00</h3>
//                                       <h3 className="mx-4 text-black">฿</h3>
//                                   </div>
//                               </div>
//                           </>
//                       ) : (
//                           <div className="text-center m-5">
//                               <i className="bi bi-cart-x fs-1 text-secondary"></i>
//                               <h6 className="mt-3 text-secondary text-black">ไม่มีสินค้าในตะกร้า</h6>
//                           </div>
//                       )}
                    
//                 </div>
//             </div>
//             <div className="d-flex justify-content-center mt-5">
//                 <div className="card" style={{ borderRadius: "30px", padding: "20px", width: "80%", maxWidth: "1200px", borderColor: "#D8BABD" }}>               
//                   <div className="d-flex justify-content-between">
//                     <h5 className="ms-4">วิธีชำระเงิน</h5>
//                       <div className="d-flex mx-4">
//                           {["QR Promptpay", "Credit/Debit Card", "ชำระเงินปลายทาง"].map((method) => (
//                             <button
//                               key={method}
//                               onClick={() => handleSelect(method)}
//                               className="ms-4 position-relative"
//                               style={{
//                                 backgroundColor: "transparent", // ไม่มีสีพื้นหลัง
//                                 color: "#000", // ข้อความสีดำ
//                                 border: "none", // ลบเส้นกรอบ
//                                 fontWeight: "bold", // ข้อความหนา
//                                 fontSize: "1rem", // ขนาดตัวอักษร
//                                 cursor: "pointer", // เปลี่ยนเป็นรูปมือเมื่อ hover
//                               }}
//                             >
//                               {method}
//                               {/* เส้นตกแต่ง */}
//                               <span
//                                 style={{
//                                   content: "''",
//                                   position: "absolute",
//                                   bottom: "-5px",
//                                   left: "50%",
//                                   transform: selected === method ? "translateX(-50%)" : "translateX(-50%) scaleX(0)",
//                                   width: "80%", // ความยาวเส้น
//                                   height: "6px", // ความหนา
//                                   backgroundColor: selected === method ? "#ccc" : "transparent", // สีเทา
//                                   borderRadius: "10px", // ขอบโค้ง
//                                   transition: "transform 0.3s ease, background-color 0.3s ease", // เพิ่ม transition
//                                   transformOrigin: "center",
//                                 }}
//                               ></span>
//                             </button>
//                           ))}
//                     </div>                
//                   </div>
//                   <div className="d-flex justify-content-end mx-4 mt-3">
//                     <div>
//                       <div className="d-flex justify-content-between"><p className="mx-1 text-black">รวมการสั่งซื้อ</p><p className="mx-1 text-black">{sumPrice}</p><p className="mx-1 text-black">฿</p></div>
//                       <div className="d-flex justify-content-between"><p className="mx-1 text-black">ค่าส่ง</p><p className="mx-1 ms-5 text-black">40</p><p className="mx-1 text-black">฿</p></div>
//                       <div className="d-flex justify-content-between"><p className="mx-1 text-black">ส่วนลดค่าส่ง</p><p className="mx-1 text-black">-40</p><p className="mx-1 text-black">฿</p></div>
//                       <div className="d-flex justify-content-between mt-3"><h5 className="mx-1 text-black">ยอดชำระเงินทั้งหมด</h5><h5 className="mx-1 text-black">{sumPrice}</h5><h5 className="mx-1 text-black">฿</h5></div>
//                     </div> 
//                   </div>
//                   <div className="d-flex justify-content-end mx-4 mt-3">
//                     <button className="custom-btn mt-2"><p>ยกเลิก</p></button>
//                     <button 
//                       onClick={handleCheckout}
//                       className="btn ms-3 rounded-pill" style={{backgroundColor: "#5B166C"}}>
//                         <p className="mt-1 m-2 text-white">ชำระเงิน</p>
//                       </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
        

//       {/* <div className="container w-50">
//         <h1>Checkout</h1>
//         <div>
//           <div>Name</div>
//           <input
//             type="text"
//             name="fullname"
//             value={name}
//             onChange={(e) => setName(e.target.value)} // อัปเดต state name
//           />
//         </div>
//         <div>
//           <div>Address</div>
//           <input
//             type="text"
//             name="address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)} // อัปเดต state address
//           />
//         </div>
//         <button id="checkout" onClick={handleCheckout}>
//           Checkout
//         </button>
//       </div> */}
//     </HomePage>
//   );
// }


// export default Checkout;

// import { Helmet } from "react-helmet";
// import MyModal from "../components/MyModal";
// import Img from "../components/Img";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import config from "../config";
// import Swal from "sweetalert2";
// import dayjs from "dayjs";
// import HomePage from "../components/HomePage";
// import { useNavigate } from 'react-router-dom';  
// import { Link } from "react-router-dom";


// function Cart() {

//   const pageTitle = "ตะกร้าสินค้า";
//   const [products, setProducts] = useState([]);
//   const [carts, setCarts] = useState([]);
//   const [recordInCarts, setRecordInCarts] = useState(0);
//   const [sumQty, setSumQty] = useState(0);
//   const [sumPrice, setSumPrice] = useState(0);
//   const [customerName, setCustomerName] = useState('');
//   const [customerPhone, setCustomerPhone] = useState('');
//   const [customerAddress, setCustomerAddress] = useState('');
//   const [payDate, setPayDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
//   const [payTime, setPayTime] = useState('');    
//   const [isVisible, setIsVisible] = useState(true); // สถานะการแสดงผลของหน้า
//     const navigate = useNavigate();

//     const validateCartItems = (items) => {
//         return items.map(item => {
//             if (item.qty > item.stock) {
//                 Swal.fire({
//                     title: "การแจ้งเตือน",
//                     text: `สินค้า "${item.name}" มีในคลังเพียง ${item.stock} ชิ้น จำนวนจะถูกปรับให้อัตโนมัติ`,
//                     icon: "warning"
//                 });

//                 return {
//                     ...item,
//                     qty: item.stock // ปรับ qty ให้ไม่เกิน stock
//                 };
//             }
//             return item;
//         });
//     };

//     useEffect(() => {
//         const storedCarts = JSON.parse(localStorage.getItem('carts')) || [];
//         const validatedCarts = validateCartItems(storedCarts);
//         setCarts(validatedCarts);
//         localStorage.setItem('carts', JSON.stringify(validatedCarts));

//         fetchData();
//         fetchDataFromLocal();
//     }, []);

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             console.log('asdadsadsas');
//             if (isVisible) {
//                 // โหลดข้อมูลตะกร้าสินค้าจาก localStorage
//                 const storedCarts = JSON.parse(localStorage.getItem('carts')) || [];

//                 // ตรวจสอบและปรับจำนวนสินค้า
//                 const validatedCarts = validateCartItems(storedCarts);

//                 // บันทึกข้อมูลที่ปรับปรุงใหม่
//                 setCarts(validatedCarts);
//                 localStorage.setItem('carts', JSON.stringify(validatedCarts));

//                 // เรียก fetchData และ fetchDataFromLocal เพื่ออัปเดตข้อมูล
//                 fetchData();
//                 fetchDataFromLocal();
//             }
//         }, 1000); // ทำงานทุก 1 วินาที

//         // ล้าง interval เมื่อ component ถูก unmount
//         return () => clearInterval(intervalId);
//     }, [isVisible]);   // ขึ้นอยู่กับการเปลี่ยนแปลงของ isVisible

//     // ฟังก์ชันที่ตรวจจับสถานะการแสดงผลของหน้า
//     useEffect(() => {
//         const handleVisibilityChange = () => {
//             setIsVisible(document.visibilityState === 'visible'); // ตั้งค่า isVisible ตามสถานะของ visibilityState
//         };

//         document.addEventListener('visibilitychange', handleVisibilityChange);

//         return () => {
//             document.removeEventListener('visibilitychange', handleVisibilityChange); // ลบ event listener เมื่อ component unmount
//         };
//     }, []);


//   //   const handleCheckout = () => {
//   //     const selectedItems = getSelectedItems(); // เลือกเฉพาะสินค้าที่ติ๊กเลือก
  
//   //     if (selectedItems.length === 0) {
//   //         Swal.fire({
//   //             title: 'ไม่มีสินค้า',
//   //             text: 'กรุณาเลือกสินค้าก่อนชำระเงิน',
//   //             icon: 'warning',
//   //         });
//   //         return;
//   //     }
  
//   //     // Navigate to the checkout page with the selected items
//   //     navigate('/checkout', { 
//   //         state: { 
//   //             carts: selectedItems, 
//   //             sumPrice: calculateSelectedPrice(), 
//   //             sumQty: selectedItems.reduce((sum, item) => sum + item.qty, 0) 
//   //         } 
//   //     });
  
//   //     // // ลบสินค้าที่เลือกออกจากตะกร้า
//   //     // const remainingCarts = carts.filter(item => !item.selected);
//   //     // setCarts(remainingCarts); // อัปเดตสถานะตะกร้า
//   //     // setRecordInCarts(remainingCarts.length); // อัปเดตจำนวนสินค้าในตะกร้า
//   //     // localStorage.setItem('carts', JSON.stringify(remainingCarts)); // อัปเดต localStorage
//   //     // callculatePriceAndQty(remainingCarts); // คำนวณราคาและจำนวนใหม่
//   // };

//     const handleCheckout = () => {
//       const selectedItems = getSelectedItems();

//       if (selectedItems.length === 0) {
//         Swal.fire({
//           title: 'ไม่มีสินค้า',
//           text: 'กรุณาเลือกสินค้าก่อนชำระเงิน',
//           icon: 'warning',
//         });
//         return;
//       }

//       const totalPrice = calculateSelectedPrice();
//       const totalQty = selectedItems.reduce((sum, item) => sum + (item.qty || 1), 0);

//       navigate('/checkout', { 
//         state: { 
//           carts: selectedItems, 
//           sumPrice: totalPrice, 
//           sumQty: totalQty 
//         } 
//       });
//     };


//     const handleRemove = (item) => {
//       try {
//           let arr = [...carts]; 
          
//           const itemIndex = arr.findIndex(cartItem => cartItem.id === item.id);
          
//           if (itemIndex !== -1) {
//               const selectedItem = arr[itemIndex];
              
//               if (selectedItem.qty > 1) {
//                   selectedItem.qty -= 1;  // ลดจำนวนสินค้า
//               } else {
//                   arr.splice(itemIndex, 1);  // ลบสินค้าออกจากตะกร้า
//               }
//           }
  
//           setCarts(arr);
//           setRecordInCarts(arr.length);
  
//           localStorage.setItem('carts', JSON.stringify(arr));  // บันทึกตะกร้าใหม่ใน localStorage
  
//           callculatePriceAndQty(arr);  // คำนวณราคาใหม่
//       } catch (e) {
//           Swal.fire({
//               title: "error",
//               text: e.message,
//               icon: "error"
//           });
//       }
//   };

//   const handleAdd1 = (item) => {
//     try {
//         let arr = [...carts]; // คัดลอกตะกร้าปัจจุบัน
//         const itemIndex = arr.findIndex(cartItem => cartItem.id === item.id);

//         if (itemIndex !== -1) {
//             arr[itemIndex].qty = (arr[itemIndex].qty || 1) + 1; // เพิ่มจำนวนสินค้า
//         }

//         setCarts(arr);
//         setRecordInCarts(arr.length);

//         localStorage.setItem('carts', JSON.stringify(arr)); // บันทึกข้อมูลลง localStorage

//         callculatePriceAndQty(arr); // คำนวณราคาและจำนวนใหม่
//     } catch (e) {
//         Swal.fire({
//             title: "error",
//             text: e.message,
//             icon: "error"
//         });
//     }
// };

//   const handleAdd = (item) => {
//     try {
//         let arr = [...carts]; // คัดลอกตะกร้าปัจจุบัน
//         const itemIndex = arr.findIndex(cartItem => cartItem.id === item.id);

//         if (itemIndex !== -1) {
//             const currentQty = arr[itemIndex].qty || 1;

//             // ตรวจสอบว่าจำนวนสินค้าในตะกร้าเกิน stock หรือไม่
//             if (currentQty < arr[itemIndex].stock) {
//                 arr[itemIndex].qty = currentQty + 1; // เพิ่มจำนวนสินค้า
//             } else {
//                 arr[itemIndex].qty = arr[itemIndex].stock; // ปรับจำนวนให้เท่ากับ stock สูงสุด
//             }
//         }

//         setCarts(arr);
//         setRecordInCarts(arr.length);

//         localStorage.setItem('carts', JSON.stringify(arr)); // บันทึกข้อมูลลง localStorage

//         callculatePriceAndQty(arr); // คำนวณราคาและจำนวนใหม่
//     } catch (e) {
//         Swal.fire({
//             title: "error",
//             text: e.message,
//             icon: "error"
//         });
//     }
// };


//   // const handleToggleSelect = (item) => {
//   //   const updatedCarts = carts.map(cartItem => {
//   //       if (cartItem.id === item.id) {
//   //           return { ...cartItem, selected: !cartItem.selected }; // เปลี่ยนสถานะ selected
//   //       }
//   //       return cartItem;
//   //   });

//   //   setCarts(updatedCarts);
//   //   localStorage.setItem('carts', JSON.stringify(updatedCarts)); // บันทึกลง localStorage
//   // };

//   const handleToggleSelect = (item) => {
//     // ตรวจสอบหาก stock เป็น 0 แล้วจะไม่ให้เลือกสินค้า
//     if (item.stock === 0) {
//       Swal.fire({
//         title: 'สินค้าหมดสต็อก',
//         text: 'ไม่สามารถเลือกสินค้ารายการนี้ได้ เพราะสินค้าหมดสต็อก',
//         icon: 'warning',
//       });
//       return;
//     }
  
//     // หาก stock มีค่า ก็สามารถเลือกหรือยกเลิกการเลือกได้
//     const updatedCarts = carts.map(cartItem => {
//       if (cartItem.id === item.id) {
//         return { ...cartItem, selected: !cartItem.selected }; // เปลี่ยนสถานะ selected
//       }
//       return cartItem;
//     });
  
//     setCarts(updatedCarts);
//     localStorage.setItem('carts', JSON.stringify(updatedCarts)); // บันทึกลง localStorage
//   };

//   const calculateSelectedPrice = () => {
//     const selectedItems = carts.filter(item => item.selected); // เลือกเฉพาะสินค้าที่ติ๊กเลือก
//     let total = 0;

//     selectedItems.forEach(item => {
//         total += (item.price || 0) * (item.qty || 1);
//     });

//     return total; // ส่งคืนราคารวมของสินค้าที่เลือก
// };

  
//   const callculatePriceAndQty = (itemInCarts) => {
//     let sumQty = 0;
//     let sumPrice = 0;

//     for (let i = 0; i < itemInCarts.length; i++) {
//         const item = itemInCarts[i];
//         sumQty += item.qty || 1;  // รวมจำนวนสินค้าทั้งหมด
//         sumPrice += parseInt(item.price) * (item.qty || 1);  // คำนวณราคาทั้งหมดตามจำนวน
//     }

//     setSumPrice(sumPrice);  // อัปเดตราคาทั้งหมด
//     setSumQty(sumQty);      // อัปเดตจำนวนสินค้า
// }

//     // const fetchDataFromLocal = () => {
//     //     const itemInCarts = JSON.parse(localStorage.getItem('carts'));
//     //     if (itemInCarts !== null) {
//     //         setCarts(itemInCarts);
//     //         setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0);

//     //         callculatePriceAndQty(itemInCarts);
//     //     }

//     // }

//     const fetchDataFromLocal = async () => {
//       const itemInCarts = JSON.parse(localStorage.getItem('carts'));
    
//       if (itemInCarts && itemInCarts.length > 0) {
//         try {
//           const res = await axios.get(config.apiPath + '/product/list');
//           const productsFromDb = res.data.result || [];
    
//           // อัปเดตข้อมูลสินค้าในตะกร้าให้ตรงกับฐานข้อมูล
//           const updatedCarts = itemInCarts.filter(cartItem => {
//             const productFromDb = productsFromDb.find(product => product.id === cartItem.id);
//             return productFromDb; // ถ้าสินค้าไม่มีในฐานข้อมูลให้ลบออกจากตะกร้า
//           }).map(cartItem => {
//             const productFromDb = productsFromDb.find(product => product.id === cartItem.id);
//             if (productFromDb) {
//               return {
//                 ...cartItem,
//                 name: productFromDb.name, // อัปเดตชื่อ
//                 price: productFromDb.price, // อัปเดตราคา
//                 stock: productFromDb.stock,
//                 imgs: productFromDb.imgs, // อัปเดตรูปภาพ
//               };
//             }
//             return cartItem;
//           });
    
//           setCarts(updatedCarts);
//           setRecordInCarts(updatedCarts.length);
//           localStorage.setItem('carts', JSON.stringify(updatedCarts)); // อัปเดต localStorage
//           callculatePriceAndQty(updatedCarts); // คำนวณราคาทั้งหมดใหม่
//         } catch (e) {
//           Swal.fire({
//             title: 'error',
//             text: 'ไม่สามารถอัปเดตข้อมูลสินค้าได้: ' + e.message,
//             icon: 'error',
//           });
//         }
//       } else {
//         setCarts([]);
//         setRecordInCarts(0);
//       }
//     };
    
    

//     const fetchData = async () => {
//         try {
//             const res = await axios.get(config.apiPath + '/product/list');
//             if (res.data.result !== undefined) {
//                 setProducts(res.data.result);
//             }
//         } catch (e) {
//             Swal.fire({
//                 title: 'error',
//                 text: e.message,
//                 icon: 'error'
//             })
            
//         }
//     }

//     const getSelectedItems = () => {
//       return carts.filter(item => item.selected); // เลือกเฉพาะสินค้าที่ถูกเลือก
//   };
  

//    function showImage(item) {
//         if (item.imgs && item.imgs.length > 0) {  
//             let imgPath = config.apiPath + '/uploads/' + item.imgs[0]; 
//             return <img className="p-2 m-3" height="100px" src={imgPath} alt="Product Image" />;
//         }
//         return <img className="p-2 m-3" height="100px" src="imgnot.jpg" alt="No image" />; 
//     }
    
//   return<HomePage title={pageTitle}> 
//       <Helmet>
//         <title>{pageTitle}</title>
//         <meta name="description" content="Cart page" />
//       </Helmet>
//       <div>
//         <div className="d-flex justify-content-center">
//           <div
//             className="card w-100 p-5"
//             style={{
//               maxWidth: "900px",
//               borderRadius: "30px",
//               borderColor: "#D8BABD",
//               backgroundColor: "#ffffff",
//               marginBottom: "400px"
//             }}
//           >
//             {/* {carts.length > 0 ? carts.map(item =>
//               <div className="d-flex flex-column flex-md-row align-items-center" key={item.id}>
//               <div className="p-5">
//                 <input
//                     type="checkbox"
//                     className="custom-checkbox"
//                     checked={item.selected || false}
//                     onChange={() => handleToggleSelect(item)} // เปลี่ยนสถานะ selected เมื่อคลิก
//                 />
//               </div>
//               <Link 
//                 to={`/productInfo/${item.id}`} 
//                 // to="/productInfo"
//                 style={{ textDecoration: 'none' }}>
//               {showImage(item)}</Link>
//               <Link 
//                 to={`/productInfo/${item.id}`} 
//                 // to="/productInfo"
//                 className="text-wrap overflow-hidden p-3 w-50"
//                 style={{ textDecoration: 'none' }}>
//               <div >
//                 <h4
//                   className="mb-0 text-truncate"
//                   data-bs-toggle="tooltip"
//                   title="ชื่อสินค้าตัวอย่างยาวๆ เพื่อดูว่า responsive หรือไม่"
//                 >
//                   {item.name}
                  
//                 </h4>
//                 <h6>ราคา {item.price}</h6> */}
//                 {/* เปลี่ยนแสดง stock เมื่อ stock เป็น 0 */}
//                 {/* <h6 
//                   className={item.stock === 0 ? 'text-danger' : ''}  // ใช้ class text-danger ถ้า stock เป็น 0
//                 >
//                   {item.stock === 0 ? "สินค้าหมด" : `คลัง ${item.stock} ชิ้น`}
//                 </h6>
//               </div></Link>
              

//               <div className="d-flex quantity-buttons p-3 align-items-center">
//                 <button onClick={e => handleRemove(item)} className="text-black">-</button>
//                 <span className="mx-2 text-black" >{item.qty || 1}</span>
//                 <button onClick={e => handleAdd(item)} className="text-black">+</button>
//               </div>
//             </div>
//             ) : (
//               <div className="text-center m-5">
//                 <i className="bi bi-cart-x fs-1 text-secondary"></i>
//                 <h6 className="mt-3 text-secondary">ไม่มีสินค้าในตะกร้า</h6>
//               </div>
//             )} */}
            
//               {carts.length > 0 ? carts.map(item => (
//                 <div className="d-flex flex-column flex-md-row align-items-center mb-3" key={item.id}>
//                   <div className="p-3">
//                     <input
//                       type="checkbox"
//                       className="custom-checkbox"
//                       checked={item.selected || false}
//                       onChange={() => handleToggleSelect(item)} // เปลี่ยนสถานะ selected เมื่อคลิก
//                     />
//                   </div>
                  
//                   <Link to={`/productInfo/${item.id}`} style={{ textDecoration: 'none' }}>
//                     {showImage(item)}
//                   </Link>

//                   <Link 
//                     to={`/productInfo/${item.id}`} 
//                     className="text-wrap overflow-hidden p-3 w-100 w-md-50"  // ใช้ w-100 บนอุปกรณ์ขนาดเล็ก
//                     style={{ textDecoration: 'none' }}
//                   >
//                     <div>
//                       <h4
//                         className="mb-0 text-truncate"
//                         data-bs-toggle="tooltip"
//                         title="ชื่อสินค้าตัวอย่างยาวๆ เพื่อดูว่า responsive หรือไม่"
//                       >
//                         {item.name}
//                       </h4>
//                       <h6>ราคา {item.price}</h6>
//                       <h6 className={item.stock === 0 ? 'text-danger' : ''}>
//                         {item.stock === 0 ? "สินค้าหมด" : `คลัง ${item.stock} ชิ้น`}
//                       </h6>
//                     </div>
//                   </Link>

//                   <div className="d-flex quantity-buttons p-3 align-items-center">
//                     <button onClick={() => handleRemove(item)} className="text-black">-</button>
//                     <span className="mx-2 text-black">{item.qty || 1}</span>
//                     <button onClick={() => handleAdd(item)} className="text-black">+</button>
//                   </div>
//                 </div>
                
                
//               )) : (
//                 <div className="text-center m-5">
//                   <i className="bi bi-cart-x fs-1 text-secondary"></i>
//                   <h6 className="mt-3 text-secondary">ไม่มีสินค้าในตะกร้า</h6>
//                 </div>
//               )}

            
//             <div style={{ borderTop: "1px solid #D8BABD", width: "90%", margin: "auto" }}>
//             </div>
//             <div className="d-flex justify-content-end p-5">
//               <div className="d-flex mt-2">
//                 <h4 className="mx-5">ราคารวม : </h4><h4 className="mx-2">{calculateSelectedPrice().toLocaleString('th-TH')}</h4><h4 className="mx-2">฿</h4>
//               </div>
//               <button 
//               onClick={handleCheckout}
//               className="btn ms-3 rounded-pill" style={{backgroundColor: "#5B166C"}}>
//                 <h6 className="mt-1 m-2 text-white">ชำระเงิน</h6>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </HomePage>
  
// }

// export default Cart;

