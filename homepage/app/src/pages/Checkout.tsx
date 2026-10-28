import React, { useState } from "react";
import HomePage from "../components/HomePage";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react"; // นำเข้า useEffect จาก react
import { useLocation } from "react-router-dom"; // ใช้ useLocation จาก react-router-dom
import config from "../config";
import Swal from "sweetalert2";
import ReactSelect from 'react-select';
import { Helmet } from "react-helmet";

function Checkout() {
    const pageTitle = "ชำระเงิน";
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const location = useLocation();
    const { carts, sumPrice, sumQty } = location.state || {};
    const [user, setUser] = useState({});
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [selected, setSelected] = useState("QR Promptpay");
    const [userAddresses, setUserAddresses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

    const uniquePhones = [...new Set(userAddresses.map(item => item.phone))].map(phone => ({
      value: phone,
      label: phone,
  }));
  
  const uniqueAddresses = [...new Set(userAddresses.map(item => item.address))].map(address => ({
      value: address,
      label: address,
  }));

  useEffect(() => {
    // เมื่อ userAddresses ถูกอัปเดต
    if (userAddresses.length > 0) {
        // กำหนดค่าเริ่มต้นให้ phone เป็นค่าสุดท้าย
        const lastPhone = userAddresses[userAddresses.length - 1].phone;
        setPhone(lastPhone);

        // กำหนดค่าเริ่มต้นให้ address เป็นค่าสุดท้าย
        const lastAddress = userAddresses[userAddresses.length - 1].address;
        setAddress(lastAddress);
    }
}, [userAddresses]); // เรียกเมื่อ userAddresses เปลี่ยนแปลง

    useEffect(() => {
        // console.log("ตะกร้า", carts, "ราคารวม", sumPrice, sumQty);
        fetchData();
    }, [carts, sumPrice, sumQty]);
    

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + "/user/customer/info", config.headers());
            if (res.data.result) {
                setUser(res.data.result);
                setFirstName(res.data.result.firstName);
                setLastName(res.data.result.lastName);
                setPhone(res.data.result.phone);
                setName(res.data.result.firstName + " " + res.data.result.lastName);

                const addressRes = await axios.get(
                    `${config.apiPath}/api/sale/address/list/${res.data.result.id}`,
                    config.headers()
                );
                if (addressRes.data.results) {
                    setUserAddresses(addressRes.data.results);
                }
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
            });
        }
    };

    const checkStock = async () => {
        try {
            for (const item of carts) {
                const response = await axios.get(`${config.apiPath}/product/stock/${item.id}`, config.headers());
                const stock = response.data.stock;

                if (stock < item.qty) {
                    Swal.fire({
                        title: "สต็อกไม่เพียงพอ",
                        text: `สินค้า "${item.name}" มีสต็อกเพียง ${stock} ชิ้น`,
                        icon: "error",
                    });
                    return false;
                }
            }
            return true;
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
            });
            return false;
        }
    };

    const placeOrder = async (order) => {
      try {
          const requestData = {
              product: {
                  name: "carts",
                  price: sumPrice,
                  quantity: 1,
              },
              information: {
                  name: order.name,
                  address: order.address,
                  phone: order.phone,
              },
              paymentMethod: selected,
              carts: carts.map((item) => ({ id: item.id, qty: item.qty })),
              userId: user.id,
          };
  
          console.log("Request Data:", requestData); // ตรวจสอบข้อมูลก่อนส่ง
  
          if (selected === "ชำระเงินปลายทาง") {
              const response = await axios.post(config.apiPath + "/api/sale/checkout-cod", requestData);
              window.location.href = response.data.successUrl;
          } else {
              const response = await axios.post(config.apiPath + "/api/sale/checkout", requestData);
  
              if (!response || !response.data || !response.data.id) {
                  throw new Error("Invalid response data: Missing session ID");
              }
  
              const stripe = await stripePromise;
              const result = await stripe.redirectToCheckout({
                  sessionId: response.data.id,
              });
  
              if (result.error) {
                  console.error("Stripe redirection error:", result.error.message);
                  alert("There was an issue redirecting to the payment page. Please try again.");
              }
          }
      } catch (error) {
          console.log("Error during checkout:", error);
          alert("An error occurred while placing your order. Please try again later.");
      }
  };

  const handleCheckout = async () => {
    checkStock();
    if (!name || !address || !phone) {
        Swal.fire({
            title: "Error",
            text: "กรุณากรอกข้อมูลชื่อ, ที่อยู่, และเบอร์โทรศัพท์ให้ครบถ้วน",
            icon: "error",
        });
        return;
    }

    // ตรวจสอบสต็อกสินค้าก่อนทำการสั่งซื้อ
    const isStockAvailable = await checkStock();
    if (!isStockAvailable) {
        return; // หยุดการสั่งซื้อหากสต็อกไม่เพียงพอ
    }

    // ทำการสั่งซื้อ
    await placeOrder({ name, phone, address });
 };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleSelect = (method) => {
        setSelected(method);
    };

    const showImage = (item) => {
        if (item.imgs && item.imgs.length > 0) {
            let imgPath = config.apiPath + "/uploads/" + item.imgs[0];
            return <img className="rounded-4" height="80px" width="80px" src={imgPath} alt="Product" />;
        }
        return <img className="rounded-4" height="100px" src="imgnot.jpg" alt="No image" />;
    };

    const handleAddressSelect = (selectedAddress) => {
        setAddress(selectedAddress.value);
    };

    const handlePhoneSelect = (selectedPhone) => {
        setPhone(selectedPhone.value);
    };

    const handleInputChange = (e) => {
      const input = e.target.value;
      const onlyNumbers = input.replace(/\D/g, ""); // ลบตัวอักษรที่ไม่ใช่ตัวเลขออก
      const formattedNumber = onlyNumbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"); // จัดรูปแบบเบอร์โทร
      setPhone(formattedNumber); // กำหนดค่า phone
  };
  return (
    <HomePage title={pageTitle}> 
  <Helmet>
    <title>{pageTitle}</title>
    <meta name="description" content="Cart page" />
  </Helmet>
        <div className="container">
            <div className="d-flex justify-content-center">
              <div
                className="card"
                style={{
                  borderRadius: "30px",
                  padding: "20px",
                  width: "100%",
                  maxWidth: "1200px",
                  height: "auto",
                  borderColor: "#D8BABD",
                }}
              >
                <h5 className="ms-4">ที่อยู่ในการจัดส่ง</h5>
                <div
                  className="d-flex flex-wrap"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "auto",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* คอลัมน์ที่ 1 */}
                  <div style={{ flex: 1, padding: "10px", textAlign: "center", minWidth: "250px" }}>
                    {isEditing ? (
                      <div>
                        <div className="d-flex">
                          <span className="mt-3 mx-4 text-black">ชื่อ : </span>
                          <input
                            type="text"
                            name="fullname"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ชื่อ นามสกุล"
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "30px",
                              padding: "10px",
                              outline: "none",
                              width: "100%",
                            }}
                          />
                        </div>
                        <div className="d-flex">
                          <span className="mt-3 mx-2 text-black">โทรศัพท์ :</span>
                          <input
                            type="text"
                            value={phone}
                            onChange={handleInputChange}
                            placeholder=""
                            className="mt-2"
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "30px",
                              padding: "10px",
                              width: "100%",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="d-flex">
                          <span className="mt-3 mx-4 text-black">ชื่อ :</span>
                          <input
                            type="text"
                            name="fullname"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ชื่อ นามสกุล"
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "30px",
                              padding: "10px",
                              outline: "none",
                              height: "45px",
                              width: "60%",
                            }}
                          />
                        </div>
                        <span className="text-black d-flex">
                          <span className="mt-3 mx-2 text-black">โทรศัพท์ : </span>
                          <ReactSelect
                            className="mt-2"
                            options={uniquePhones}
                            onChange={handlePhoneSelect}
                            value={phone && { value: phone, label: phone }}
                            placeholder="ค้นหา"
                            styles={{
                              container: (provided) => ({
                                ...provided,
                                width: "60%",
                                borderRadius: "30px",
                              }),
                              control: (provided) => ({
                                ...provided,
                                borderRadius: "30px",
                                border: "1px solid #ccc",
                                height: "45px",
                              }),
                            }}
                          />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* คอลัมน์ที่ 2 */}
                  <div style={{ flex: 1, padding: "10px", textAlign: "center", minWidth: "250px" }}>
                    {isEditing ? (
                      <div>
                        <div className="d-flex justify-content-start mb-1">
                          <span className="mt-2 mx-4 text-black">ที่อยู่ : </span>
                        </div>
                        <textarea
                          type="text"
                          name="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder=""
                          className="w-100"
                          style={{
                            height: "100px",
                            border: "1px solid #ccc",
                            borderRadius: "30px",
                            padding: "10px",
                            outline: "none",
                            resize: "none",
                            width: "100%",
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-black d-flex justify-content-center">
                        <span className="mt-2 mx-4 text-black">ที่อยู่</span>
                        <ReactSelect
                          options={uniqueAddresses}
                          onChange={handleAddressSelect}
                          value={address && { value: address, label: address }}
                          placeholder="ค้นหา"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: "100%",
                              borderRadius: "30px",
                            }),
                            control: (provided) => ({
                              ...provided,
                              borderRadius: "30px",
                              border: "1px solid #ccc",
                              height: "45px",
                            }),
                          }}
                        />
                      </span>
                    )}
                  </div>

                  {/* คอลัมน์ที่ 3 */}
                  <div style={{ flex: 1, textAlign: "center", minWidth: "250px" }}>
                    <button onClick={toggleEditing} className="custom-btn">
                      {isEditing ? "ปิดการแก้ไข" : "แก้ไข"}
                    </button>
                  </div>
                </div>
              </div>

            </div>
            <div className="d-flex justify-content-center mt-4">
              <div
                className="card"
                style={{
                  borderRadius: "30px",
                  width: "100%",
                  maxWidth: "1200px",
                  borderColor: "#D8BABD",
                  padding: "20px",
                }}
              >
                {carts.length > 0 ? (
                  <>
                    {/* ตารางสินค้า */}
                    <div className="table-responsive">
                      <table className="table borderless">
                        <thead>
                          <tr>
                            <th scope="col"></th>
                            <th scope="col" className="text-center">
                              <h6>ราคาต่อหน่วย</h6>
                            </th>
                            <th scope="col" className="text-center">
                              <h6>จำนวน</h6>
                            </th>
                            <th scope="col" className="text-center">
                              <h6>ราคาต่อรวม</h6>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {carts.map((item) => (
                            <tr key={item.id}>
                              <td className="d-flex align-items-center ms-3">
                                {showImage(item)}
                                <div className="text-wrap overflow-hidden ps-2">
                                  <h5
                                    className="text-truncate text-black"
                                    data-bs-toggle="tooltip"
                                    title={item.name}
                                  >
                                    {item.name}
                                  </h5>
                                  <span className="text-black">คลัง {item.stock} ชิ้น</span>
                                </div>
                              </td>
                              <td className="text-center">
                                <h5 className="text-black mt-4">{item.price.toLocaleString('th-TH')} ฿</h5>
                              </td>
                              <td className="text-center">
                                <h5 className="text-black mt-4">{item.qty}</h5>
                              </td>
                              <td className="text-center">
                                <h5 className="text-black mt-4">{(item.price * item.qty).toLocaleString('th-TH')} ฿</h5>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* เส้นแบ่ง */}
                    <div
                      className="mt-4"
                      style={{
                        borderTop: "1px solid #D8BABD",
                        width: "90%",
                        margin: "auto",
                      }}
                    ></div>

                    {/* รวมราคา */}
                    <div className="d-flex justify-content-end flex-wrap">
                      <div className="m-3 d-flex">
                        <h3 className="text-black">{sumPrice.toLocaleString('th-TH')}.00</h3>
                        <h3 className="mx-2 text-black">฿</h3>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center m-4">
                    <i className="bi bi-cart-x fs-1 text-secondary"></i>
                    <h6 className="mt-3 text-secondary text-black">ไม่มีสินค้าในตะกร้า</h6>
                  </div>
                )}
              </div>

            </div>
            <div className="d-flex justify-content-center mt-5 mb-5">
              <div
              className="card"
              style={{
                borderRadius: "30px",
                padding: "20px",
                width: "100%",
                maxWidth: "1200px",
                borderColor: "#D8BABD",
              }}
            >
              <div className="d-flex flex-wrap justify-content-between">
                <h5 className="ms-3 mb-3">วิธีชำระเงิน</h5>
                <div className="d-flex flex-wrap mx-3">
                  {["QR Promptpay", "Credit/Debit Card", "ชำระเงินปลายทาง"].map((method) => (
                    <button
                      key={method}
                      onClick={() => handleSelect(method)}
                      className="ms-3 mb-2 position-relative"
                      style={{
                        backgroundColor: "transparent",
                        color: "#000",
                        border: "none",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                    >
                      {method}
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-5px",
                          left: "50%",
                          transform: selected === method ? "translateX(-50%)" : "translateX(-50%) scaleX(0)",
                          width: "80%",
                          height: "6px",
                          backgroundColor: selected === method ? "#ccc" : "transparent",
                          borderRadius: "10px",
                          transition: "transform 0.3s ease, background-color 0.3s ease",
                        }}
                      ></span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="d-flex justify-content-end mx-3 mt-3 flex-wrap">
                <div>
                  <div className="d-flex justify-content-between">
                    <p className="mx-1 text-black">รวมการสั่งซื้อ</p>
                    <p className="mx-1 text-black">{sumPrice}</p>
                    <p className="mx-1 text-black">฿</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="mx-1 text-black">ค่าส่ง</p>
                    <p className="mx-1 ms-5 text-black">40</p>
                    <p className="mx-1 text-black">฿</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="mx-1 text-black">ส่วนลดค่าส่ง</p>
                    <p className="mx-1 text-black">-40</p>
                    <p className="mx-1 text-black">฿</p>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <h5 className="mx-1 text-black">ยอดชำระเงินทั้งหมด</h5>
                    <h5 className="mx-1 text-black">{sumPrice}</h5>
                    <h5 className="mx-1 text-black">฿</h5>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mx-3 mt-3 flex-wrap">
                <button className="custom-btn mt-2">
                  <p>ยกเลิก</p>
                </button>
                <button
                  onClick={handleCheckout}
                  className="btn ms-3 rounded-pill"
                  style={{ backgroundColor: "#5B166C" }}
                >
                  <p className="mt-1 m-2 text-white">ชำระเงิน</p>
                </button>
              </div>
            </div>

            </div>
        </div>
        

      {/* <div className="container w-50">
        <h1>Checkout</h1>
        <div>
          <div>Name</div>
          <input
            type="text"
            name="fullname"
            value={name}
            onChange={(e) => setName(e.target.value)} // อัปเดต state name
          />
        </div>
        <div>
          <div>Address</div>
          <input
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)} // อัปเดต state address
          />
        </div>
        <button id="checkout" onClick={handleCheckout}>
          Checkout
        </button>
      </div> */}
    </HomePage>
  );
}


export default Checkout;
