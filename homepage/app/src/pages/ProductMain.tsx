// import axios from "axios";
// import { useEffect, useState } from "react";
// import config from "../config";
// import Swal from "sweetalert2";
// import MyModal from "../components/MyModal";
// import dayjs from "dayjs";
// import HomePage from "../components/HomePage";
// import { Link } from "react-router-dom";

// function ProductMain() {
//     const [products, setProducts] = useState([]);
//     const [carts, setCarts] = useState([]);
//     const [recordInCarts, setRecordInCarts] = useState(0);
//     const [sumQty, setSumQty] = useState(0);
//     const [sumPrice, setSumPrice] = useState(0);
//     const [customerName, setCustomerName] = useState('');
//     const [customerPhone, setCustomerPhone] = useState('');
//     const [customerAddress, setCustomerAddress] = useState('');
//     const [payDate, setPayDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
//     const [payTime, setPayTime] = useState('');
    
//     useEffect(() => {
//         fetchData();
//         fetchDataFromLocal();
//     }, []);

    

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

//     function showImage(item) {
//         if (item.imgs && item.imgs.length > 0) {  
//             let imgPath = config.apiPath + '/uploads/' + item.imgs[0]; 
//             return <img className="card-img" height="150px" src={imgPath} alt="Product Image" />;
//         }
//         return <img className="card-img" height="150px" src="imgnot.jpg" alt="No image" />; 
//     }
//     const addToCart = (item) => {
//         let arr = carts;
//         if (arr === null) {
//             arr = [];
//         }
      
//         // เช็คว่ามีสินค้าชิ้นนี้ในตะกร้าแล้วหรือไม่
//         const existingItem = arr.find(cartItem => cartItem.id === item.id);
      
//         if (existingItem) {
//             // ถ้ามีแล้ว เพิ่มจำนวนสินค้า
//             existingItem.qty = (existingItem.qty || 1) + 1;
//         } else {
//             // ถ้ายังไม่มี ให้เพิ่มสินค้าชิ้นใหม่และตั้งจำนวนเป็น 1
//             arr.push({ ...item, qty: 1 });
//         }
      
//         setCarts(arr);
//         setRecordInCarts(arr.length);
      
//         localStorage.setItem('carts', JSON.stringify(arr));
      
//         fetchDataFromLocal();
//       }
//       const fetchDataFromLocal = () => {
//         const itemInCarts = JSON.parse(localStorage.getItem('carts'));
//         if (itemInCarts !== null) {
//             setCarts(itemInCarts);
//             setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0);
    
//             callculatePriceAndQty(itemInCarts);
//         }
    
//     }
//     const callculatePriceAndQty = (itemInCarts) => {
//         let sumQty = 0;
//         let sumPrice = 0;
    
//         for (let i = 0; i < itemInCarts.length; i++) {
//             const item = itemInCarts[i];
//             sumQty++;
//             sumPrice += parseInt(item.price);
//         }
//         setSumPrice(sumPrice);
//         setSumQty(sumQty);
//     }
    
    
//     return<HomePage>
//         <div className="container mt-3">
//             <div className="d-flex justify-content-center">
//                 <img
//                 className="banner px-4"
//                 src="banner.png"
//                 alt=""
//                 style={{ backgroundColor: "#C7D5E9", borderRadius: "50px" }}
//                 >
//                 </img>
//                 </div>
//                 <div className="d-flex justify-content-center mt-5">
//                     <div
//                         className="w-75 d-flex justify-content-center"
//                         style={{ backgroundColor: "#C7D5E9", borderRadius: "30px" }}
//                         >
//                         {/* กล่อง 1: โค้งเฉพาะด้านซ้าย */}
//                             <div
//                                 className="w-75 ms-2 my-2 d-le"
//                                 style={{
//                                 backgroundColor: "#FFF8DE",
//                                 borderTopLeftRadius: "30px",
//                                 borderBottomLeftRadius: "30px",
//                                 }}
//                             >
//                                 <h5 className="m-3 text-center">คิมหันตฤดู</h5>
//                             </div>
                            
//                             {/* กล่อง 2: ไม่มีขอบโค้ง */}
//                             <div
//                                 className="w-75 my-2 mx-1"
//                                 style={{
//                                 backgroundColor: "#C5D3E8",
//                                 }}
//                             >
//                                 <h5 className="m-3 text-center">เหมันตฤดู</h5>
//                             </div>
                            
//                             {/* กล่อง 3: โค้งเฉพาะด้านขวา */}
//                             <div
//                                 className="w-75 me-2 my-2"
//                                 style={{
//                                 backgroundColor: "#A6AEBF",
//                                 borderTopRightRadius: "30px",
//                                 borderBottomRightRadius: "30px",
//                                 }}
//                             >
//                                 <h5 className="m-3 text-center">วสันตฤดู</h5>
//                             </div>
//                         </div>                   
//                 </div>
                      
//             {/* <div className="float-end">
//                 ตะกร้าทดสอบ
//                 <button 
//                 data-bs-toggle="modal"
//                 data-bs-target="#modalCart"
//                 className="btn btn-outline-success ms-2 me-2">
//                     <i className="fa fa-shopping-cart me-2"></i>
//                     {recordInCarts}
//                 </button>
//                 ชิ้น
//             </div> */}
//             <div className="mt-5">
//                 <div className="clearfix">
//                     <h5>สินค้ามาใหม่</h5>
//                     </div>
//                 <div className="row">
//                 {products.length > 0 ? (
//                     products.map(item => (
//                         <div className="col-6 col-md-4 col-lg-2 mt-1 mb-3" key={item.id}>
//                             <div className="card" 
//                                 style={{ 
//                                     borderColor: "#D8BABD",
//                                     borderRadius: "15px" // ปรับขอบโค้ง
//                                   }}
//                             >
//                                 <Link 
//                                 to={`/productInfo/${item.id}`} 
//                                 // to="/productInfo"
//                                 style={{ textDecoration: 'none' }}>
//                                     <div>{showImage(item)}</div>
//                                     <div className="card-body" >
//                                         <h6 className="text-black">{item.name}</h6>
//                                         <h6 className="text-black"><strong>{item.price.toLocaleString('th-TH')} บาท</strong></h6> 
//                                     </div>
//                                 </Link>
//                                 <div className="text-end">
//                                 {item.stock > 0 ? ( // ตรวจสอบสต็อก
//                             <button
//                                 className="btn rounded-4"
//                                 style={{ backgroundColor: "#D8BABD" }}
//                                 onClick={e => addToCart(item)}>
//                                 <div className="d-flex"> 
//                                     <i className="bi bi-plus text-color fs-5"></i>
//                                     <i className="fa fa-shopping-cart text-color mt-2"></i>
//                                 </div>
//                             </button>
//                         ) : (
//                             <button
//                                 className="custom-btn m-2"
//                                 style={{ cursor: "not-allowed" }}
//                                 disabled>
//                                 <span className="text-danger">สินค้าหมด</span>
//                             </button>
//                         )}
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : <></>}
//                 </div>
//             </div>
           

//         </div>
//         {/* <MyModal id="modalCart" title="ตะกร้าสินค้า">
//             <table className="table table-bordered table-striped">
//                 <thead>
//                     <tr>
//                         <th>name</th>
//                         <th className="text-end">price</th>
//                         <th className="text-end">piece</th>
//                         <th width="60px"></th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {carts.length > 0 ? carts.map(item =>
//                         <tr key={item.id}>
//                             <td>{item.name}</td>
//                             <td className="text-end">{item.price.toLocaleString('th-TH')}</td>
//                             <td className="text-end">1</td>
//                             <td className="text-center">
//                                 <button className="btn btn-danger" onClick={e => handleRemove(item)}>
//                                     <i className="fa fa-times"></i>
//                                 </button>
//                             </td>
//                         </tr>
//                     ): <></>}
//                 </tbody>
//             </table>
//             <div className="text-center">
//                     จำนวน {sumQty} ราคา {sumPrice}
//             </div>
//             <div className="mt-3">
//                 <div>
//                     <div>ชื่อ</div>
//                     <input className="form-control" onChange={e => setCustomerName(e.target.value)}></input>
//                 </div>
//                 <div className="mt-3">
//                     <div>เบอร์ติดต่อ</div>
//                     <input className="form-control" onChange={e => setCustomerPhone(e.target.value)}></input>
//                 </div>
//                 <div className="mt-3">
//                     <div>ที่อยู่</div>
//                     <input className="form-control" onChange={e => setCustomerAddress(e.target.value)}></input>
//                 </div>
//                 <div className="mt-3">
//                     <div>วันที่</div>
//                     <input className="form-control" type="date" value={payDate} onChange={e => setPayDate(e.target.value)}></input>
//                 </div>
//                 <div className="mt-3">
//                     <div>เวลา</div>
//                     <input className="form-control" onChange={e => setPayTime(e.target.value)}></input>
//                 </div>
//                 <button className="btn btn-primary mt-3" onClick={handleSave}>
//                     <i className="fa fa-check me-2"></i>ยืนยัน
//                 </button>
//             </div>
//         </MyModal> */}
//     </HomePage>
// }

// export default ProductMain;

import axios from "axios"; 
import { useEffect, useState, useRef } from "react";
import config from "../config";
import Swal from "sweetalert2";
import MyModal from "../components/MyModal";
import dayjs from "dayjs";
import HomePage from "../components/HomePage";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";


function ProductMain() {
    const pageTitle = "สินค้า";
    const [products, setProducts] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    // const [searchQuery, setSearchQuery] = useState('');
    const [carts, setCarts] = useState([]);
    const [recordInCarts, setRecordInCarts] = useState(0);
    const [sumQty, setSumQty] = useState(0);
    const [sumPrice, setSumPrice] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [payDate, setPayDate] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
    const [payTime, setPayTime] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');
    const seasons = [
        { name: "คิมหันตฤดู", bgColor: "#FFF8DE", borderRadius: "30px 0 0 30px", wrapperBg: "#FFF8DE" },
        { name: "เหมันตฤดู", bgColor: "#C5D3E8", borderRadius: "0", wrapperBg: "#C5D3E8" },
        { name: "วสันตฤดู", bgColor: "#A6AEBF", borderRadius: "0 30px 30px 0", wrapperBg: "#A6AEBF" },
    ];
    
    const [wrapperBackgroundColor, setWrapperBackgroundColor] = useState("#FFC677");
    const location = useLocation();  // ใช้ useLocation เพื่อดึงข้อมูลจาก URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query") || ""; // ถ้าไม่มีค่าให้เป็นค่าว่าง
  
    const [searchQuery, setSearchQuery] = useState(
      localStorage.getItem("lastSearch") || query
    );
  
    useEffect(() => {
      setSearchQuery(query);
      localStorage.setItem("lastSearch", query); // บันทึกค่าลง localStorage
      console.log("ค่าที่พิมพ์:", query);
    }, [query]);

    const handleSelect = (name, wrapperBg) => {
        if (selectedSeason === name) {
            setSelectedSeason(null);  
            setWrapperBackgroundColor("#FFC677");  

            setFilteredProducts(products);

            setSearchQuery("");  
        } else {
            setSelectedSeason(name);
            setWrapperBackgroundColor(wrapperBg);  
    
            const filtered = products.filter(product => product.seasons.includes(name));
            setFilteredProducts(filtered);

            setSearchQuery("");  
        }
    };
    
    useEffect(() => {
        fetchData();
        fetchDataFromLocal();
        fetchBanners();
        fetchDataTopSell();
    }, []);
    // useEffect(() => {
    //     fetchDataTopSell();
    // }, []);

    useEffect(() => {
        const result = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(result);
    }, [searchQuery, products]);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list');
            if (res.data.result !== undefined) {
                setProducts(res.data.result);
                setFilteredProducts(res.data.result);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            });
        }
    }
    const fetchDataTopSell = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/top-selling');
            if (res.data.bestSellingProducts !== undefined) {
                setTopProducts(res.data.bestSellingProducts);
            }
            console.log(res.data.bestSellingProducts);
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            });
        }
    }

    function showImage(item) {
        if (item.imgs && item.imgs.length > 0) {  
            let imgPath = config.apiPath + '/uploads/' + item.imgs[0]; 
            return <img className="card-img" height="auto" src={imgPath} alt="Product Image" />;
        }
        return <img className="card-img" height="auto" src="imgnot.jpg" alt="No image" />; 
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
        Swal.fire({
            title: "เพิ่มลงตะกร้าแล้ว!",
            // text: `คุณได้เพิ่มสินค้าลงในตะกร้าสำเร็จ`,
            icon: "success",
            showConfirmButton: false,
            timer: 1000, // ปิดอัตโนมัติหลัง 1.5 วินาที
          });
      
        setCarts(arr);
        setRecordInCarts(arr.length);
      
        localStorage.setItem('carts', JSON.stringify(arr));
        fetchDataFromLocal();
    }

    const fetchDataFromLocal = () => {
        const itemInCarts = JSON.parse(localStorage.getItem('carts'));
        if (itemInCarts !== null) {
            setCarts(itemInCarts);
            setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0);
            callculatePriceAndQty(itemInCarts);
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

    const handleSearch = () => {
        const result = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(result);
    }

   
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [banners, setBanners] = useState([]);
    const productsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
    }, 7000); // เปลี่ยนแบนเนอร์ทุก 3 วินาที

    return () => clearInterval(interval);
}, [banners]); // เพิ่ม 'banners' เป็น dependency เพื่อให้การเปลี่ยนแบนเนอร์ทำงานได้หลังจากดึงข้อมูลจาก API

const fetchBanners = async () => {
    try {
        const res = await axios.get(`${config.apiPath}/media/banner`);
        setBanners(res.data); // บันทึกข้อมูลแบนเนอร์จาก API ลงใน state
        console.log("Fetched banners:", res.data);
    } catch (e) {
        console.error("Error fetching banners:", e);
    }
};

const handleBannerClick = () => {
    if (productsRef.current) {
        productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
};
  

    return (
        <HomePage title={pageTitle}> 
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content="Cart page" />
        </Helmet>
         <div className="wrapper-prod" style={{ backgroundColor: wrapperBackgroundColor }}>
            <div className="container">
            <motion.div 
                className="d-flex justify-content-center"
                initial={{ opacity: 0, scale: 0.9 }} // เริ่มต้นที่โปร่งใสและขนาดเล็ก
                animate={{ opacity: 1, scale: 1 }}    // เมื่อแสดงจะเต็มความทึบและขยาย
                transition={{ duration: 0.8 }}         // ความเร็วในการแสดง
            >
                {/* <motion.img
                    className="banner px-4"
                    src="Banner (3).png"
                    alt=""
                    whileHover={{ scale: 1.05 }}  // เมื่อ hover ให้ขยายขนาดเล็กน้อย
                    transition={{ duration: 0.3 }} // ความเร็วของการขยายเมื่อ hover
                /> */}
                {banners.length > 0 && (
                    <AnimatePresence mode="wait">
                        <motion.img
                        key={banners[currentImageIndex]?.id}  // ใช้ key จาก ID ของแบนเนอร์
                        className="banner mx-5 shadow-sm"
                        src={`${config.apiPath}${banners[currentImageIndex]?.src}`}  // ใช้แบนเนอร์ตาม currentImageIndex
                        alt={`Banner ${currentImageIndex}`}
                        whileHover={{ scale: 1.05 }}  // ขยายขณะโฮเวอร์
                        initial={{ opacity: 0, x: 50 }} // เริ่มจากจางและเลื่อนเข้ามาจากขวา
                        animate={{ opacity: 1, x: 0 }} // แสดงผลเต็มที่
                        exit={{ opacity: 0, x: -50 }} // เลื่อนออกไปทางซ้าย
                        transition={{ duration: 0.5, ease: "easeInOut" }} // กำหนดความเร็วและการเคลื่อนที่
                        onClick={handleBannerClick}
                        />
                    </AnimatePresence>
                    )}

            </motion.div>
                <div className="d-flex justify-content-center mt-5" ref={productsRef}>
                    <div className="d-flex justify-content-center nav-seasons">
                    {seasons.map(({ name, bgColor, borderRadius, wrapperBg }) => (
                        <motion.div
                            key={name}
                            onClick={() => handleSelect(name, wrapperBg)}
                            className={`season-box ${selectedSeason === name ? "bg-selected" : ""}`}
                            style={{
                            backgroundColor: bgColor,
                            borderRadius,
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                            <p className="text-center text-bar">{name}</p>
                            {/* เส้นตกแต่ง */}
                            <motion.span
                            className="season-underline"
                            animate={{ opacity: selectedSeason === name ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                position: "absolute",
                                bottom: "-5px",
                                left: "50%",
                                width: "80%",
                                height: "6px",
                                backgroundColor: selectedSeason === name ? "#ccc" : "transparent",
                                borderRadius: "10px",
                                transform: "translateX(-50%)",
                            }}
                            ></motion.span>
                        </motion.div>
                        ))}
                    </div>
                </div>
                {/* ช่องค้นหาสินค้า */}
                {/* <div className="d-flex justify-content-center mt-5">
                    <input
                        type="text"
                        className="form-control w-75 form-control custom-placeholder rounded-pill"
                        placeholder="ค้นหาสินค้า"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </div> */}
                    
               
                <div className="mt-5">
                    <div className="clearfix">

                    {/* แสดงข้อความขึ้นอยู่กับการค้นหาหรือไม่ */}
                        {searchQuery && (
                            <h5>
                                {`สินค้าที่ค้นหา : ${searchQuery}`}
                            </h5>
                        )}

                        {/* แสดงสินค้าที่กรองมา */}
                        {searchQuery && (
                            <div className="row">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(item => (
                                        <motion.div
                                            className="col-6 col-md-4 col-lg-2 mt-1 mb-3" 
                                            key={item.id}
                                            initial={{ opacity: 0, scale: 0.8 }}  // เริ่มต้นที่มองไม่เห็นและย่อขนาด
                                            animate={{ opacity: 1, scale: 1 }}    // เมื่อแสดงขึ้นมาจะขยายและมีความทึบ
                                            exit={{ opacity: 0, scale: 0.8 }}     // เมื่อออกจะหดและมองไม่เห็น
                                            transition={{ duration: 0.5 }}         // ความเร็วในการแสดงผล
                                        >
                                            <motion.div
                                                className="card bg-or" 
                                                style={{ borderColor: "#D8BABD", borderRadius: "15px" }}
                                                whileHover={{ scale: 1.05, y: -5 }}  // เมื่อ hover การ์ดจะขยายและยกขึ้นเล็กน้อย
                                                transition={{ duration: 0.3 }}       // ความเร็วในการเคลื่อนที่
                                            >
                                                <Link to={`/productInfo/${item.id}`} style={{ textDecoration: 'none' }}>
                                                    <div>{showImage(item)}</div>
                                                    <div className="card-body" >
                                            <span className="text-black"
                                            style={{
                                                whiteSpace: 'normal', 
                                                overflow: 'hidden', 
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,  // จำกัดให้แสดงแค่ 2 บรรทัด
                                                WebkitBoxOrient: 'vertical',  // ทำให้ข้อความตัดเป็นแนวตั้ง
                                                textOverflow: 'ellipsis'  // แสดง "..." เมื่อข้อความเกิน 2 บรรทัด
                                            }}
                                            >
                                                {item.name}
                                            </span>
                                        </div>
                                                </Link>
                                                <div className="text-end">
                                                    {item.stock > 0 ? (
                                                        <button
                                                            className="btn rounded-4"
                                                            style={{ backgroundColor: "#5B166C" }}
                                                            onClick={e => addToCart(item)}
                                                        >
                                                            <div className="d-flex"> 
                                                                <i className="bi bi-plus text-white fs-5"></i>
                                                                <i className="fa fa-shopping-cart text-white mt-2"></i>
                                                            </div>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="custom-btn m-2"
                                                            style={{ cursor: "not-allowed" }}
                                                            disabled
                                                        >
                                                            <span className="text-danger">สินค้าหมด</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p>ไม่พบสินค้า</p>  // ถ้าไม่มีสินค้าก็แสดงข้อความนี้
                                )}
                            </div>
                        )}

                    <h5>
                        {selectedSeason ? `สินค้าตามฤดูกาล` : "สินค้ามาใหม่"}
                    </h5>
                    </div>
                    <div className="row">
        
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(item => (
                            <motion.div
                                className="col-6 col-md-4 col-lg-2 mt-1 mb-3" 
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.8 }}  // เริ่มต้นที่มองไม่เห็นและย่อขนาด
                                animate={{ opacity: 1, scale: 1 }}    // เมื่อแสดงขึ้นมาจะขยายและมีความทึบ
                                exit={{ opacity: 0, scale: 0.8 }}     // เมื่อออกจะหดและมองไม่เห็น
                                transition={{ duration: 0.5 }}         // ความเร็วในการแสดงผล
                            >
                                <motion.div
                                    className="card bg-or" 
                                    style={{ borderColor: "#D8BABD", borderRadius: "15px" }}
                                    whileHover={{ scale: 1.05, y: -5 }}  // เมื่อ hover การ์ดจะขยายและยกขึ้นเล็กน้อย
                                    transition={{ duration: 0.3 }}       // ความเร็วในการเคลื่อนที่
                                >
                                    <Link to={`/productInfo/${item.id}`} style={{ textDecoration: 'none' }}>
                                        <div>{showImage(item)}</div>
                                        <div className="card-body" >
                                            <span className="text-black"
                                            style={{
                                                whiteSpace: 'normal', 
                                                overflow: 'hidden', 
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,  // จำกัดให้แสดงแค่ 2 บรรทัด
                                                WebkitBoxOrient: 'vertical',  // ทำให้ข้อความตัดเป็นแนวตั้ง
                                                textOverflow: 'ellipsis'  // แสดง "..." เมื่อข้อความเกิน 2 บรรทัด
                                            }}
                                            >
                                                {item.name}
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <h6 className="text-black mt-auto"><strong>{item.price.toLocaleString('th-TH')} บาท</strong></h6>
                                        {item.stock > 0 ? (
                                            <button
                                                className="btn rounded-4"
                                                style={{ backgroundColor: "#5B166C" }}
                                                onClick={e => addToCart(item)}
                                            >
                                                <div className="d-flex"> 
                                                    <i className="bi bi-plus text-white fs-5"></i>
                                                    <i className="fa fa-shopping-cart text-white mt-2"></i>
                                                </div>
                                            </button>
                                        ) : (
                                            <button
                                                className="custom-btn m-2"
                                                style={{ cursor: "not-allowed" }}
                                                disabled
                                            >
                                                <span className="text-danger">สินค้าหมด</span>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))
                    ) : (
                        <p>ไม่มีสินค้าตามฤดูกาลนี้</p>  // ถ้าไม่มีสินค้าก็แสดงข้อความนี้
                    )}
                    </div>
                </div>
                <div className="mt-5">
                    <div className="clearfix">
                        <h5>สินค้าขายดี</h5>
                    </div>
                    <div className="row">
                        {/* {filteredProducts.length > 0 ? (
                            filteredProducts.map(item => (
                                <div className="col-6 col-md-4 col-lg-2 mt-1 mb-3" key={item.id}>
                                    <div className="card" style={{ borderColor: "#D8BABD", borderRadius: "15px" }}>
                                        <Link to={`/productInfo/${item.id}`} style={{ textDecoration: 'none' }}>
                                            <div>{showImage(item)}</div>
                                            <div className="card-body">
                                                <h6 className="text-black">{item.name}</h6>
                                                <h6 className="text-black"><strong>{item.price.toLocaleString('th-TH')} บาท</strong></h6>
                                            </div>
                                        </Link>
                                        <div className="text-end">
                                            {item.stock > 0 ? (
                                                <button
                                                className="btn rounded-4"
                                                style={{ backgroundColor: "#5B166C" }}
                                                onClick={e => addToCart(item)}
                                            >
                                                <div className="d-flex"> 
                                                    <i className="bi bi-plus text-white fs-5"></i>
                                                    <i className="fa fa-shopping-cart text-white mt-2"></i>
                                                </div>
                                            </button>
                                            ) : (
                                                <button
                                                    className="custom-btn m-2"
                                                    style={{ cursor: "not-allowed" }}
                                                    disabled
                                                >
                                                    <span className="text-danger">สินค้าหมด</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>ไม่มีสินค้าตามฤดูกาลนี้</p>  // ถ้าไม่มีสินค้าก็แสดงข้อความนี้
                        )} */}
                    {topProducts.length > 0 ? (
                            topProducts.map(item => (
                                <motion.div 
                                    className="col-6 col-md-4 col-lg-2 mt-1 mb-3 d-flex" 
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8 }}  
                                    animate={{ opacity: 1, scale: 1 }}    
                                    exit={{ opacity: 0, scale: 0.8 }}     
                                    transition={{ duration: 0.5 }}         
                                >
                                    <motion.div
                                        className="card bg-or position-relative"  // ใช้ position-relative เพื่อให้ badge อยู่ข้างบน
                                        style={{ 
                                            borderColor: "#D8BABD",
                                            borderRadius: "15px"
                                        }}
                                        whileHover={{ scale: 1.05, y: -5 }}  
                                        transition={{ duration: 0.3 }}      
                                    >
                                        {/* Badge "ขายดี" */}
                                            <span className="badge badge-best-seller">🔥 ขายดี</span>
                                        

                                        <Link to={`/productInfo/${item.id}`} style={{ textDecoration: 'none' }}>
                                            <div>{showImage(item)}</div>
                                            <div className="card-body">
                                                <span className="text-black"
                                                style={{
                                                    whiteSpace: 'normal', 
                                                    overflow: 'hidden', 
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,  
                                                    WebkitBoxOrient: 'vertical',  
                                                    textOverflow: 'ellipsis'  
                                                }}>
                                                    {item.name}
                                                </span>
                                            </div>
                                        </Link>
                                        <div className="d-flex justify-content-between mt-auto">
                                            <h6 className="text-black mt-auto"><strong>{item.price.toLocaleString('th-TH')} บาท</strong></h6>
                                            {item.stock > 0 ? (
                                                <button
                                                    className="btn rounded-4"
                                                    style={{ backgroundColor: "#5B166C" }}
                                                    onClick={e => addToCart(item)}
                                                >
                                                    <div className="d-flex"> 
                                                        <i className="bi bi-plus text-white fs-5"></i>
                                                        <i className="fa fa-shopping-cart text-white mt-2"></i>
                                                    </div>
                                                </button>
                                            ) : (
                                                <button
                                                    className="custom-btn m-2"
                                                    style={{ cursor: "not-allowed" }}
                                                    disabled
                                                >
                                                    <span className="text-danger">สินค้าหมด</span>
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))
                        ) : <><p>ไม่มีสินค้า</p></>}

                        {/* {filteredProducts.length > 0 ? (
                            filteredProducts.map(item => (
                                <motion.div
                                    className="col-6 col-md-4 col-lg-2 mt-1 mb-3" 
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.8 }}  // เริ่มต้นที่มองไม่เห็นและย่อขนาด
                                    animate={{ opacity: 1, scale: 1 }}    // เมื่อแสดงขึ้นมาจะขยายและมีความทึบ
                                    exit={{ opacity: 0, scale: 0.8 }}     // เมื่อออกจะหดและมองไม่เห็น
                                    transition={{ duration: 0.5 }}         // ความเร็วในการแสดงผล
                                >
                                    <motion.div
                                        className="card" 
                                        style={{ borderColor: "#D8BABD", borderRadius: "15px" }}
                                        whileHover={{ scale: 1.05, y: -5 }}  // เมื่อ hover การ์ดจะขยายและยกขึ้นเล็กน้อย
                                        transition={{ duration: 0.3 }}       // ความเร็วในการเคลื่อนที่
                                    >
                                        <Link to={`/productInfo/${item.id}`} style={{ textDecoration: 'none' }}>
                                            <div>{showImage(item)}</div>
                                            <div className="card-body">
                                                <h6 className="text-black">{item.name}</h6>
                                                <h6 className="text-black"><strong>{item.price.toLocaleString('th-TH')} บาท</strong></h6>
                                            </div>
                                        </Link>
                                        <div className="text-end">
                                            {item.stock > 0 ? (
                                                <button
                                                    className="btn rounded-4"
                                                    style={{ backgroundColor: "#5B166C" }}
                                                    onClick={e => addToCart(item)}
                                                >
                                                    <div className="d-flex"> 
                                                        <i className="bi bi-plus text-white fs-5"></i>
                                                        <i className="fa fa-shopping-cart text-white mt-2"></i>
                                                    </div>
                                                </button>
                                            ) : (
                                                <button
                                                    className="custom-btn m-2"
                                                    style={{ cursor: "not-allowed" }}
                                                    disabled
                                                >
                                                    <span className="text-danger">สินค้าหมด</span>
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))
                        ) : (
                            <p>ไม่มีสินค้าตามฤดูกาลนี้</p>  // ถ้าไม่มีสินค้าก็แสดงข้อความนี้
                        )} */}
                    </div>
                </div>

            </div>
            </div>
        </HomePage>
    );
}

export default ProductMain;




// {/* <div
//     className="d-flex justify-content-center nav-seasons"
//     // style={{ backgroundColor: "#C7D5E9", borderRadius: "30px" }}
// >
//     {/* กล่อง 1: โค้งเฉพาะด้านซ้าย */}
//     <div
//     onClick={() => handleSelect("คิมหันตฤดู")}
//     className={`w-75 ms-2 my-2 d-le ${selectedSeason === "คิมหันตฤดู" ? "bg-selected" : ""}`}
//     style={{
//         backgroundColor: "#FFF8DE",
//         borderTopLeftRadius: "30px",
//         borderBottomLeftRadius: "30px",
//         cursor: "pointer",
//         position: "relative", // ให้เส้นตกแต่งปรากฏได้
        
//     }}
//     >
//     <h6 className="m-3 text-center">คิมหันตฤดู</h6>
//     {/* เส้นตกแต่ง */}
//     <span
//         style={{
//         content: "''",
//         position: "absolute",
//         bottom: "-5px", // ขยับเส้นให้ต่ำลงจากข้อความ
//         left: "50%",
//         transform: selectedSeason === "คิมหันตฤดู" ? "translateX(-50%)" : "translateX(-50%) scaleX(0)", // สร้าง effect ให้เส้นหายไป
//         width: "80%", // ความยาวเส้น
//         height: "6px", // ความหนา
//         backgroundColor: selectedSeason === "คิมหันตฤดู" ? "#ccc" : "transparent", // สีเทา
//         borderRadius: "10px", // ขอบโค้ง
//         transition: "transform 0.3s ease, background-color 0.3s ease", // การเปลี่ยนแปลงของเส้น
//         transformOrigin: "center",
//         }}
//     ></span>
//     </div>

//     {/* กล่อง 2: ไม่มีขอบโค้ง */}
//     <div
//     onClick={() => handleSelect("เหมันตฤดู")}
//     className={`w-75 my-2 mx-1 ${selectedSeason === "เหมันตฤดู" ? "bg-selected" : ""}`}
//     style={{
//         backgroundColor: "#C5D3E8",
//         cursor: "pointer",
//         position: "relative", // ให้เส้นตกแต่งปรากฏได้
//     }}
//     >
//     <h6 className="m-3 text-center">เหมันตฤดู</h6>
//     {/* เส้นตกแต่ง */}
//     <span
//         style={{
//         content: "''",
//         position: "absolute",
//         bottom: "-5px",
//         left: "50%",
//         transform: selectedSeason === "เหมันตฤดู" ? "translateX(-50%)" : "translateX(-50%) scaleX(0)",
//         width: "80%",
//         height: "6px",
//         backgroundColor: selectedSeason === "เหมันตฤดู" ? "#ccc" : "transparent",
//         borderRadius: "10px",
//         transition: "transform 0.3s ease, background-color 0.3s ease",
//         transformOrigin: "center",
//         }}
//     ></span>
//     </div>

//     {/* กล่อง 3: โค้งเฉพาะด้านขวา */}
//     <div
//     onClick={() => handleSelect("วสันตฤดู")}
//     className={`w-75 me-2 my-2 ${selectedSeason === "วสันตฤดู" ? "bg-selected" : ""}`}
//     style={{
//         backgroundColor: "#A6AEBF",
//         borderTopRightRadius: "30px",
//         borderBottomRightRadius: "30px",
//         cursor: "pointer",
//         position: "relative", // ให้เส้นตกแต่งปรากฏได้
//     }}
//     >
//     <h6 className="m-3 text-center">วสันตฤดู</h6>
//     {/* เส้นตกแต่ง */}
//     <span
//         style={{
//         content: "''",
//         position: "absolute",
//         bottom: "-5px",
//         left: "50%",
//         transform: selectedSeason === "วสันตฤดู" ? "translateX(-50%)" : "translateX(-50%) scaleX(0)",
//         width: "80%",
//         height: "6px",
//         backgroundColor: selectedSeason === "วสันตฤดู" ? "#ccc" : "transparent",
//         borderRadius: "10px",
//         transition: "transform 0.3s ease, background-color 0.3s ease",
//         transformOrigin: "center",
//         }}
//     ></span>
//     </div>
//     </div> */}