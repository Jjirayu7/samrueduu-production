import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import HomePage from "../components/HomePage";
import { useParams } from "react-router-dom";
import config from "../config";
import Swal from "sweetalert2";
import dayjs from "dayjs";


function ProductInfo() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState();

  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [recordInCarts, setRecordInCarts] = useState(0);
  const [sumQty, setSumQty] = useState(0);
  const [sumPrice, setSumPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [payDate, setPayDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [payTime, setPayTime] = useState('');

  const handleSave = async () => {
    try {
        const payLoad = {
            customerName: customerName,
            customerPhone: customerPhone,
            customerAddress: customerAddress,
            payDate: payDate,
            payTime: payTime,
            carts: carts  
        }

        const res = await axios.post(config.apiPath + '/api/sale/save', payLoad);

        if (res.data.message === 'success') {
            localStorage.removeItem('carts');
            setRecordInCarts(0);
            setCarts([]);

            Swal.fire({
                title: 'บันทึกข้อมูล',
                text: 'ระบบบันทึกข้อมูลของคุณแล้ว',
                icon: 'success'
            })

            document.getElementById('modalCart_btnClose').click();
            setCustomerName('');
            setCustomerPhone('');
            setCustomerAddress('');
            setPayDate(new Date());
            setPayTime('');
        }
    } catch (e) {
        Swal.fire({
            title: 'error',
            text: e.message,
            icon: 'error'
        })
    }
}

const handleRemove = async (item) => {
    try {
        const button = await Swal.fire({
            title: 'ลบสินค้า',
            text: 'คุณต้องการลบสินค้าออกจากตะกร้าใช่หรือไม่',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        })
    if (button.isConfirmed) {
        let arr = carts;

        for (let i = 0; i < arr.length; i++){
            const itemInCarts = arr[i];

            if (item.id === itemInCarts.id) {
                arr.splice(i, 1);
            }
        }
        setCarts(arr);
        setRecordInCarts(arr.length);

        localStorage.setItem('carts', JSON.stringify(arr));

        callculatePriceAndQty(arr);
    }
    } catch (e) {
        Swal.fire({
            title: "error",
            text: e.message,
            icon: "error"
        })
    }
}

const callculatePriceAndQty = (itemInCarts) => {
    let sumQty = 0;
    let sumPrice = 0;

    for (let i = 0; i < itemInCarts.length; i++) {
        const item = itemInCarts[i];
        sumQty++;
        sumPrice += parseInt(item.price);
    }
    setSumPrice(sumPrice);
    setSumQty(sumQty);
}
const addToCart1 = (item) => {
  let arr = carts;
  if (arr === null) {
      arr = [];
  }

  // เช็คว่ามีสินค้าชิ้นนี้ในตะกร้าแล้วหรือไม่
  const existingItem = arr.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
      // ถ้ามีแล้ว เพิ่มจำนวนสินค้า
      existingItem.qty = (existingItem.qty || 1) + 1;
  } else {
      // ถ้ายังไม่มี ให้เพิ่มสินค้าชิ้นใหม่และตั้งจำนวนเป็น 1
      arr.push({ ...item, qty: 1 });
  }

  setCarts(arr);
  setRecordInCarts(arr.length);

  localStorage.setItem('carts', JSON.stringify(arr));

  fetchDataFromLocal();
}

const addToCart = (item) => {
  let arr = carts;
  if (arr === null) {
      arr = [];
  }

  const existingItem = arr.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
  } else {
      arr.push({ ...item, qty: 1 });
  }

  setCarts(arr);
  setRecordInCarts(arr.length);

  localStorage.setItem('carts', JSON.stringify(arr));

  callculatePriceAndQty(arr);  // คำนวณราคาใหม่
}


const fetchDataFromLocal = () => {
    const itemInCarts = JSON.parse(localStorage.getItem('carts'));
    if (itemInCarts !== null) {
        setCarts(itemInCarts);
        setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0);

        callculatePriceAndQty(itemInCarts);
    }

}

useEffect(() => {
  fetchData();
  fetchDataFromLocal();
}, []);

const fetchData = async () => {
    try {
        const res = await axios.get(config.apiPath + '/product/list');
        if (res.data.result !== undefined) {
            setProducts(res.data.result);
        }
    } catch (e) {
        Swal.fire({
            title: 'error',
            text: e.message,
            icon: 'error'
        })
        
    }
}

    // ฟังก์ชันสำหรับจัดการเมื่อคลิกที่รูปภาพ
    const handleImageClick = (img) => {
        setSelectedImage(img);
    };

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลสินค้า
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${config.apiPath}/product/info/${id}`); 
        setProduct(response.data);  // เก็บข้อมูลที่ได้ใน state
        setLoading(false);  // เปลี่ยนสถานะการโหลด
      } catch (err) {
        setError("Failed to fetch product data");
        setLoading(false);
      }
    };

    fetchProduct();  // เรียกฟังก์ชันใน useEffect
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

 

function showImage1(product, setProduct) {
    if (product.img1) {
        return (
            <div>
                <img
                    src={`${config.apiPath}/uploads/${product.img1}`}
                    alt="description-image"
                    className="w-75 rounded-4"
                />
                
            </div>
        );
    }
    return <span>ไม่มีรูปภาพ</span>;
}
function showImage2(product, setProduct) {
    if (product.img2) {
        return (
            <div>
                <img
                    src={`${config.apiPath}/uploads/${product.img2}`}
                    alt="description-image"
                    className="w-75 rounded-4"
                />
               
            </div>
        );
    }
    return <span>ไม่มีรูปภาพ</span>;
}
function showImage3(product, setProduct) {
    if (product.img3) {
        return (
            <div>
                <img
                    src={`${config.apiPath}/uploads/${product.img3}`}
                    alt="description-image"
                    className="w-75 rounded-4"
                />
            </div>
        );
    }
    return <span>ไม่มีรูปภาพ</span>;
}

  return (
    <HomePage>
      <Helmet>
        <title>{product.name}</title>
        <meta name="description" content="Product details page" />
      </Helmet>

      <div>
        <div className="d-flex justify-content-center">
          <div>
            <div
              className="mt-5 p-4 border-custom w-100"
              style={{
                maxWidth: "600px",
                borderRadius: "50px",
                backgroundColor: "#ffffff",
              }}
            >
              <div>
                  {/* พรีวิวภาพที่เลือก */}
                  <div className="d-flex justify-content-center">
                      {selectedImage ? (
                          <img
                              src={`${config.apiPath}/uploads/${selectedImage}`} // พรีวิวภาพที่เลือก
                              alt="Selected Product"
                              className=" m-3 rounded-5"
                              style={{ listStyle: "none", padding: 0, margin: 0, height: "300px" }}
                              
                          />
                      ) : (
                            <img
                            src={`${config.apiPath}/uploads/${product.imgs[0]}`}
                            alt="Selected Product"
                            className="m-3 rounded-5"
                            style={{ listStyle: "none", padding: 0, margin: 0, height: "300px"  }}
                        />
                      )}
                  </div>

                  
              </div>
            </div>
              {/* แสดงรายการภาพ */}
                    <ul className="d-flex justify-content-around mt-5" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {product.imgs.map((img, index) => (
                            <li key={index} className="m-2">
                                <div
                                    className="position-relative mr-2 mb-2"
                                    style={{ width: '100px', height: '100px' }}
                                >
                                    <img
                                        src={`${config.apiPath}/uploads/${img}`} // พาธของภาพ
                                        alt={`product-${product.id}-${index}`}
                                        className="w-100 rounded-4"
                                        style={{ width: '150px', height: '100px', objectFit: 'cover' }}
                                        onClick={() => handleImageClick(img)} // เมื่อคลิกภาพ
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
          </div>
          
          <div
            className="m-5 w-100 border-custom"
            style={{
              maxWidth: "600px",
              borderRadius: "50px",
              borderColor: "#D8BABD",
              backgroundColor: "#ffffff",
            }}
          >
            <div className="p-5">
              <div>
                <h3 className="text-black">{product.name}</h3>
              </div>
              <div>
                <h5 className="text-black">
                  {product.name} <span className="text-black">| รหัสสินค้า </span> {product.id}
                </h5>
                <span className={`text-black ${product.stock === 0 ? "text-danger" : ""}`}>
                  {product.stock > 0 ? `คลัง ${product.stock} ชิ้น` : "ไม่มีสินค้าในคลัง"}
                </span>
              </div>

              <div
                className="d-flex justify-content-between"
                style={{ marginTop: "400px", marginBottom: "20px" }}
              >
                <div className="d-flex justify-content-start">
                  <h3 className="m-2 text-black">{product.price}.00</h3><h3 className="m-2 ms-3 text-black">฿</h3>
                </div>
                <div className="d-flex justify-content-end">
                {product.stock > 0 ? ( // ตรวจสอบสต็อก
                            <button
                                className="btn rounded-4"
                                style={{ backgroundColor: "#D8BABD" }}
                                onClick={e => addToCart(product)}>
                                <div className="d-flex"> 
                                    <i className="bi bi-plus text-color fs-5"></i>
                                    <i className="fa fa-shopping-cart text-color mt-2"></i>
                                </div>
                            </button>
                        ) : (
                          <button
                            className="custom-btn m-2"
                            style={{ cursor: "not-allowed" }}
                            disabled>
                            <span className="text-danger">สินค้าหมด</span>
                          </button>
                        )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div>
            <div className="d-flex justify-content-center" style={{ marginTop: "50px" }}>
              <div className="p-3" style={{ flex: 1, overflowWrap: "break-word" }}>
                <h5 className="text-black" style={{ textAlign: "right", marginRight: "20px" }}>{product.toppic1}</h5>
                <p className="text-black">{product.detail1}</p>
              </div>
              <div className="p-3 d-flex justify-content-center align-items-center" style={{ flex: 1 }}>
                {showImage1(product)}
              </div>
            </div>
          </div>

          <div>
            <div className="d-flex justify-content-center" style={{ marginTop: "100px" }}>
              <div className="p-3 d-flex justify-content-center align-items-center" style={{ flex: 1 }}>
                {showImage2(product)}
              </div>
              <div className="p-3" style={{ flex: 1, overflowWrap: "break-word" }}>
                <h5 className="text-black" style={{ textAlign: "left", marginRight: "20px" }}>{product.toppic2}</h5>
                <p className="text-black">{product.detail2}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="d-flex justify-content-center" style={{ marginTop: "100px" }}>
              <div className="p-3" style={{ flex: 1, overflowWrap: "break-word" }}>
                <h5 className="text-black" style={{ textAlign: "right", marginRight: "20px" }}>{product.toppic3}</h5>
                <p className="text-black">{product.detail3}</p>
              </div>
              <div className="p-3 d-flex justify-content-center align-items-center" style={{ flex: 1 }}>
                {showImage3(product)}
              {/* <img
                      src={`${config.apiPath}/uploads/${product.img3}`}
                      alt="description-image"
                      className="w-75 rounded-1"
                  /> */}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center" style={{ margin: "70px" }}>
            <button
              onClick={e => addToCart(product)}
              className="btn rounded-pill w-25"
              style={{ backgroundColor: "#5B166C" }}
            >
              <div className="d-flex justify-content-center">
                <i className="bi bi-plus fs-2 text-white"></i>
                <h6 className="mt-3 text-white">เพิ่มลงตะกร้า</h6>
              </div>
            </button>
          </div>
        </div>
      </div>
    </HomePage>
  );
}

export default ProductInfo;
