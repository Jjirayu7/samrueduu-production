import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import HomePage from "../components/HomePage";
import { useParams } from "react-router-dom";
import config from "../config";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Canvas,  useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from 'three';  // นำเข้า THREE.js


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
  // const [customerName, setCustomerName] = useState('');
  // const [customerPhone, setCustomerPhone] = useState('');
  // const [customerAddress, setCustomerAddress] = useState('');
  // const [payDate, setPayDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  // const [payTime, setPayTime] = useState('');

  // const Model = () => {
  //   const gltf = useLoader(GLTFLoader, "/Sofa Free Version.glb");
  
  //   return (
  //     <primitive object={gltf.scene} scale={1} />
  //   );
  // };
  
function ShowModel(product) {
  console.log("Product data:", product); // ตรวจสอบค่าของ product ใน Console

  if (!product?.img1 || !product.img1.endsWith(".glb")) {
    return null; 
}

  return (
      <div style={{ width: "100%", height: "500px", position: 'relative' }}>
          <Canvas camera={{ position: [2, 1, 3], fov: 50 }} style={{ width: '100%', height: '100%' }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <Model3D modelPath={`${config.apiPath}/uploads/${product.img1}`} />
              <OrbitControls />
          </Canvas>
      </div>
  );
}

const Model3D = ({ modelPath }) => {
  const gltf = useLoader(GLTFLoader, modelPath);
  const [scale, setScale] = useState(1);
  const modelRef = useRef();
  const groupRef = useRef(); // ใช้ group เพื่อจัดการกับจุดหมุน

  useEffect(() => {
      if (gltf && modelRef.current) {
          // ตรวจสอบขนาด Bounding Box ของโมเดล
          const box = new THREE.Box3().setFromObject(modelRef.current);
          const size = box.getSize(new THREE.Vector3());
          const maxSize = Math.max(size.x, size.y, size.z);
          const scaleFactor = 2 / maxSize; // ปรับสเกลเพื่อให้โมเดลพอดี
          setScale(scaleFactor);
      }
  }, [gltf]);

  // ใช้ useFrame เพื่อหมุนโมเดลไปเรื่อยๆ
  useFrame(() => {
      if (groupRef.current) {
          groupRef.current.rotation.y += 0.01; // หมุนในแกน Y
      }
  });

  return (
      <group ref={groupRef} position={[0, 0, 0]}> 
          {/* ปรับตำแหน่ง และการหมุนของ group */}
          <primitive ref={modelRef} object={gltf.scene} scale={scale} />
      </group>
  );
};
  
//   const handleSave = async () => {
//     try {
//         const payLoad = {
//             customerName: customerName,
//             customerPhone: customerPhone,
//             customerAddress: customerAddress,
//             payDate: payDate,
//             payTime: payTime,
//             carts: carts  
//         }

//         const res = await axios.post(config.apiPath + '/api/sale/save', payLoad);

//         if (res.data.message === 'success') {
//             localStorage.removeItem('carts');
//             setRecordInCarts(0);
//             setCarts([]);

//             Swal.fire({
//                 title: 'บันทึกข้อมูล',
//                 text: 'ระบบบันทึกข้อมูลของคุณแล้ว',
//                 icon: 'success'
//             })

//             document.getElementById('modalCart_btnClose').click();
//             setCustomerName('');
//             setCustomerPhone('');
//             setCustomerAddress('');
//             setPayDate(new Date());
//             setPayTime('');
//         }
//     } catch (e) {
//         Swal.fire({
//             title: 'error',
//             text: e.message,
//             icon: 'error'
//         })
//     }
// }

// const handleRemove = async (item) => {
//     try {
//         const button = await Swal.fire({
//             title: 'ลบสินค้า',
//             text: 'คุณต้องการลบสินค้าออกจากตะกร้าใช่หรือไม่',
//             icon: 'question',
//             showCancelButton: true,
//             showConfirmButton: true
//         })
//     if (button.isConfirmed) {
//         let arr = carts;

//         for (let i = 0; i < arr.length; i++){
//             const itemInCarts = arr[i];

//             if (item.id === itemInCarts.id) {
//                 arr.splice(i, 1);
//             }
//         }
//         setCarts(arr);
//         setRecordInCarts(arr.length);

//         localStorage.setItem('carts', JSON.stringify(arr));

//         callculatePriceAndQty(arr);
//     }
//     } catch (e) {
//         Swal.fire({
//             title: "error",
//             text: e.message,
//             icon: "error"
//         })
//     }
// }

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
// const addToCart1 = (item) => {
//   let arr = carts;
//   if (arr === null) {
//       arr = [];
//   }

//   // เช็คว่ามีสินค้าชิ้นนี้ในตะกร้าแล้วหรือไม่
//   const existingItem = arr.find(cartItem => cartItem.id === item.id);

//   if (existingItem) {
//       // ถ้ามีแล้ว เพิ่มจำนวนสินค้า
//       existingItem.qty = (existingItem.qty || 1) + 1;
//   } else {
//       // ถ้ายังไม่มี ให้เพิ่มสินค้าชิ้นใหม่และตั้งจำนวนเป็น 1
//       arr.push({ ...item, qty: 1 });
//   }

//   setCarts(arr);
//   setRecordInCarts(arr.length);

//   localStorage.setItem('carts', JSON.stringify(arr));

//   fetchDataFromLocal();
// }

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

  Swal.fire({
              title: "เพิ่มลงตะกร้าแล้ว",
              
              icon: "success",
              showConfirmButton: false,
              timer: 1000, // ปิดอัตโนมัติหลัง 1.5 วินาที
            });

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
    // const handleImageClick = (img) => {
    //     setSelectedImage(img);
    // };

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

 

// function showImage1(product, setProduct) {
//     if (product.img1) {
//         return (
//             <div>
//                 <img
//                     src={`${config.apiPath}/uploads/${product.img1}`}
//                     alt="description-image"
//                     className="w-75 rounded-4"
//                 />
                
//             </div>
//         );
//     }
//     return <span>ไม่มีรูปภาพ</span>;
// }
function showImage1(product, setProduct) {
  // ตรวจสอบว่ามี product.img1 และเป็นไฟล์ .glb หรือไม่
  if (!product?.img1) {
      return <span>ไม่มีรูปภาพ</span>;
  }

  if (product.img1.endsWith(".glb")) {
      return null; // ไม่แสดงอะไรเลย
  }

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
// ตั้งค่าเริ่มต้น
  return (
    <HomePage>
      <Helmet>
        <title>{product.name}</title>
        <meta name="description" content="Product details page" />
      </Helmet>
      <div>
        <div 
        className="d-flex justify-content-center d-flex-cus"
        >
          <div>
            <div
              className="mt-5 p-4 border-custom card-img-preview"
              // style={{
              //   maxWidth: "600px",
              //   borderRadius: "50px",
              //   backgroundColor: "#ffffff"
              // }}
            >
              <div className="preview-img"
              // style={{ width: '500px'}}
              >
                  {/* พรีวิวภาพที่เลือก */}
                  <div>
                      {selectedImage ? (
                          <img
                              src={`${config.apiPath}/uploads/${selectedImage}`} // พรีวิวภาพที่เลือก
                              alt="Selected Product"
                              className="rounded-5 img-select-pre"
                              // style={{ listStyle: "none", padding: 0, margin: 0, height: "300px", width: '380px' }}
                              
                          />
                      ) : (
                            <img
                            src={`${config.apiPath}/uploads/${product.imgs[0]}`}
                            alt="Selected Product"
                            className="rounded-5 img-select-pre"
                            // style={{ listStyle: "none", padding: 0, margin: 0, height: "300px", width: '380px' }}
                        />
                      )}
                      {/* <img
                        src={`${config.apiPath}/uploads/${selectedImage}`}
                        alt="Selected Product"
                        className="m-3 rounded-5"
                        style={{ height: "300px", objectFit: "contain", width: '500px' }}
                      /> */}
                  </div> 
              </div>
            </div>
              <div className="width-swipe">
                <div className="container mt-5" 
                // style={{ width: '500px' }}
                >
                  {/* <Swiper
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    coverflowEffect={{
                      rotate: 0,
                      stretch: 0,
                      depth: 100,
                      modifier: 2.5,
                    }}
                    slidesPerView={3} // แสดง 3 รูปต่อหน้า
                    spaceBetween={10}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[EffectCoverflow, Pagination, Navigation]}
                    className="swiper_container"
                  >
                    {product.imgs.map((img, index) => (
                      <SwiperSlide key={index} className="ms-2">
                        <img
                          src={`${config.apiPath}/uploads/${img}`}
                          alt={`product-${product.id}-${index}`}
                          className="rounded-4 d-flex"
                          style={{ width: '110px', height: '100px', cursor: 'pointer', objectFit: 'contain', }}
                          onClick={() => handleImageClick(img)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper> */}
                    <Swiper
                      effect="coverflow"
                      grabCursor={true}
                      //centeredSlides={true}
                      loop={product.imgs.length > 3}
                      coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        // depth: 100,
                        modifier: 0,
                      }}
                      slidesPerView={product.imgs.length < 3 ? product.imgs.length : 3}
                      spaceBetween={10}
                      pagination={{ clickable: true }}
                      navigation={true}
                      modules={[EffectCoverflow, Pagination, Navigation]}
                      className="swiper_container"
                      onSlideChange={(swiper) => setSelectedImage(product.imgs[swiper.realIndex])} // เปลี่ยนภาพพรีวิว
                    >
                      {product.imgs.map((img, index) => (
                        <SwiperSlide key={index} className="d-flex justify-content-center"
                        style={{
                          boxShadow: "none", // ลบเงา
                          borderRadius: "10px", // ลบขอบ
                          padding: "0", // ลบ padding
                        }}
                        >
                          <img
                            src={`${config.apiPath}/uploads/${img}`}
                            alt={`product-${product.id}-${index}`}
                            className="rounded-4 img-in-swiper"
                            // style={{
                            //   width: "110px",
                            //   height: "100px",
                            //   cursor: "pointer",
                            //   objectFit: "cover",
                            // }}
                            onClick={() => setSelectedImage(img)}
                          />
                        </SwiperSlide>
                      ))}
                  </Swiper> 
                </div>
              </div>
              
          </div>
          
          <div
            className="m-5 w-100 border-custom card-info"
            // style={{
            //   maxWidth: "600px",
            //   borderRadius: "50px",
            //   borderColor: "#D8BABD",
            //   backgroundColor: "#ffffff",
            // }}
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
                className="d-flex justify-content-between price-info"
                // style={{ marginTop: "400px", marginBottom: "20px" }}
              >
                <div className="d-flex justify-content-start">
                  <h3 className="m-2 text-black">{product.price}.00</h3><h3 className="m-2 ms-3 text-black">฿</h3>
                </div>
                <div className="d-flex justify-content-end">
                {product.stock > 0 ? ( // ตรวจสอบสต็อก
                            <button
                                className="btn rounded-pill"
                                style={{ backgroundColor: "#5B166C" }}
                                onClick={e => addToCart(product)}>
                                <div className="d-flex"> 
                                    <i className="bi bi-plus text-white fs-5"></i>
                                    <i className="fa fa-shopping-cart text-white mt-2"></i>
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
            {/* Section 1 */}
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center" style={{ marginTop: "50px" }}>
              <div className="p-3" style={{ flex: 1, overflowWrap: "break-word", textAlign: "right", marginRight: "20px" }}>
                <h4 className="text-black">{product.toppic1}</h4>
                <p className="text-black text-start" style={{ fontSize: "18px"}}>{product.detail1}</p>
              </div>
              <div className="p-3 d-flex justify-content-center align-items-center" style={{ flex: 1 }}>
                {showImage1(product)}
                {/* <Canvas>
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[10, 10, 5]} intensity={1} />
                  <Model />
                  <OrbitControls />
                </Canvas> */}
                {ShowModel(product)}
              </div>
            </div>

            {/* Section 2 */}
            <div className="d-flex flex-column flex-md-row-reverse justify-content-center align-items-center" style={{ marginTop: "100px" }}>
              
              <div className="p-3" style={{ flex: 1, overflowWrap: "break-word", textAlign: "left", marginLeft: "20px" }}>
                <h4 className="text-black">{product.toppic2}</h4>
                <p className="text-black" style={{ fontSize: "18px"}}>{product.detail2}</p>
              </div>
              <div className="p-3 text-center" style={{ flex: 1 }}>
                {showImage2(product)}
              </div>
            </div>

            {/* Section 3 */}
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center" style={{ marginTop: "100px" }}>
              <div className="p-3" style={{ flex: 1, overflowWrap: "break-word", textAlign: "right", marginRight: "20px" }}>
                <h4 className="text-black">{product.toppic3}</h4>
                <p className="text-black text-start" style={{ fontSize: "18px"}}>{product.detail3}</p>
              </div>
              <div className="p-3 text-center" style={{ flex: 1 }}>
                {showImage3(product)}
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
                <h6 className="mt-3 text-white d-none d-md-block">เพิ่มลงตะกร้า</h6>
                <i className="fa fa-shopping-cart fs-6 mt-1 text-white d-md-none"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </HomePage>
  );
}

export default ProductInfo;
