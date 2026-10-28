import { Helmet } from "react-helmet";
import MyModal from "../components/MyModal";
import Img from "../components/Img";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../config";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import HomePage from "../components/HomePage";
import { useNavigate } from 'react-router-dom';  
import { Link } from "react-router-dom";


function Cart() {

  const pageTitle = "ตะกร้าสินค้า";
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
  const [isVisible, setIsVisible] = useState(true); // สถานะการแสดงผลของหน้า
    const navigate = useNavigate();

    const validateCartItems = (items) => {
        return items.map(item => {
            if (item.qty > item.stock) {
                Swal.fire({
                    title: "การแจ้งเตือน",
                    text: `สินค้า "${item.name}" มีในคลังเพียง ${item.stock} ชิ้น จำนวนจะถูกปรับให้อัตโนมัติ`,
                    icon: "warning"
                });

                return {
                    ...item,
                    qty: item.stock // ปรับ qty ให้ไม่เกิน stock
                };
            }
            return item;
        });
    };

    useEffect(() => {
        const storedCarts = JSON.parse(localStorage.getItem('carts')) || [];
        const validatedCarts = validateCartItems(storedCarts);
        setCarts(validatedCarts);
        localStorage.setItem('carts', JSON.stringify(validatedCarts));

        fetchData();
        fetchDataFromLocal();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            
            if (isVisible) {
                // โหลดข้อมูลตะกร้าสินค้าจาก localStorage
                const storedCarts = JSON.parse(localStorage.getItem('carts')) || [];

                // ตรวจสอบและปรับจำนวนสินค้า
                const validatedCarts = validateCartItems(storedCarts);

                // บันทึกข้อมูลที่ปรับปรุงใหม่
                setCarts(validatedCarts);
                localStorage.setItem('carts', JSON.stringify(validatedCarts));

                // เรียก fetchData และ fetchDataFromLocal เพื่ออัปเดตข้อมูล
                fetchData();
                fetchDataFromLocal();
            }
        }, 1000); // ทำงานทุก 1 วินาที

        // ล้าง interval เมื่อ component ถูก unmount
        return () => clearInterval(intervalId);
    }, [isVisible]);   // ขึ้นอยู่กับการเปลี่ยนแปลงของ isVisible

    // ฟังก์ชันที่ตรวจจับสถานะการแสดงผลของหน้า
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(document.visibilityState === 'visible'); // ตั้งค่า isVisible ตามสถานะของ visibilityState
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange); // ลบ event listener เมื่อ component unmount
        };
    }, []);


  //   const handleCheckout = () => {
  //     const selectedItems = getSelectedItems(); // เลือกเฉพาะสินค้าที่ติ๊กเลือก
  
  //     if (selectedItems.length === 0) {
  //         Swal.fire({
  //             title: 'ไม่มีสินค้า',
  //             text: 'กรุณาเลือกสินค้าก่อนชำระเงิน',
  //             icon: 'warning',
  //         });
  //         return;
  //     }
  
  //     // Navigate to the checkout page with the selected items
  //     navigate('/checkout', { 
  //         state: { 
  //             carts: selectedItems, 
  //             sumPrice: calculateSelectedPrice(), 
  //             sumQty: selectedItems.reduce((sum, item) => sum + item.qty, 0) 
  //         } 
  //     });
  
  //     // // ลบสินค้าที่เลือกออกจากตะกร้า
  //     // const remainingCarts = carts.filter(item => !item.selected);
  //     // setCarts(remainingCarts); // อัปเดตสถานะตะกร้า
  //     // setRecordInCarts(remainingCarts.length); // อัปเดตจำนวนสินค้าในตะกร้า
  //     // localStorage.setItem('carts', JSON.stringify(remainingCarts)); // อัปเดต localStorage
  //     // callculatePriceAndQty(remainingCarts); // คำนวณราคาและจำนวนใหม่
  // };

    // const handleCheckout = () => {
    //   const selectedItems = getSelectedItems();

    //   if (selectedItems.length === 0) {
    //     Swal.fire({
    //       title: 'ไม่มีสินค้า',
    //       text: 'กรุณาเลือกสินค้าก่อนชำระเงิน',
    //       icon: 'warning',
    //     });
    //     return;
    //   }

    //   const totalPrice = calculateSelectedPrice();
    //   const totalQty = selectedItems.reduce((sum, item) => sum + (item.qty || 1), 0);

    //   navigate('/checkout', { 
    //     state: { 
    //       carts: selectedItems, 
    //       sumPrice: totalPrice, 
    //       sumQty: totalQty 
    //     } 
    //   });
    // };
    const handleCheckout = () => {
      // ดึงรายการสินค้าที่เลือกจากฟังก์ชัน getSelectedItems()
      const selectedItems = getSelectedItems().filter(item => item.stock > 0); // กรองสินค้าที่มีสต็อก
      
      if (selectedItems.length === 0) {
        Swal.fire({
          title: 'ไม่มีสินค้า',
          text: 'กรุณาเลือกสินค้าที่มีสต็อกก่อนชำระเงิน',
          icon: 'warning',
        });
        return;
      }
    
      // คำนวณราคาและจำนวนรวมของสินค้าที่เลือก
      const totalPrice = calculateSelectedPrice();
      const totalQty = selectedItems.reduce((sum, item) => sum + (item.qty || 1), 0);
    
      // นำข้อมูลสินค้าที่เลือกไปที่หน้าชำระเงิน
      navigate('/checkout', { 
        state: { 
          carts: selectedItems, 
          sumPrice: totalPrice, 
          sumQty: totalQty 
        } 
      });
    };
    
    const handleRemove = (item) => {
      try {
          let arr = [...carts]; 
          
          const itemIndex = arr.findIndex(cartItem => cartItem.id === item.id);
          
          if (itemIndex !== -1) {
              const selectedItem = arr[itemIndex];
              
              if (selectedItem.qty > 1) {
                  selectedItem.qty -= 1;  // ลดจำนวนสินค้า
              } else {
                  arr.splice(itemIndex, 1);  // ลบสินค้าออกจากตะกร้า
              }
          }
  
          setCarts(arr);
          setRecordInCarts(arr.length);
  
          localStorage.setItem('carts', JSON.stringify(arr));  // บันทึกตะกร้าใหม่ใน localStorage
  
          callculatePriceAndQty(arr);  // คำนวณราคาใหม่
      } catch (e) {
          Swal.fire({
              title: "error",
              text: e.message,
              icon: "error"
          });
      }
  };

  const handleAdd1 = (item) => {
    try {
        let arr = [...carts]; // คัดลอกตะกร้าปัจจุบัน
        const itemIndex = arr.findIndex(cartItem => cartItem.id === item.id);

        if (itemIndex !== -1) {
            arr[itemIndex].qty = (arr[itemIndex].qty || 1) + 1; // เพิ่มจำนวนสินค้า
        }

        setCarts(arr);
        setRecordInCarts(arr.length);

        localStorage.setItem('carts', JSON.stringify(arr)); // บันทึกข้อมูลลง localStorage

        callculatePriceAndQty(arr); // คำนวณราคาและจำนวนใหม่
    } catch (e) {
        Swal.fire({
            title: "error",
            text: e.message,
            icon: "error"
        });
    }
};

  const handleAdd = (item) => {
    try {
        let arr = [...carts]; // คัดลอกตะกร้าปัจจุบัน
        const itemIndex = arr.findIndex(cartItem => cartItem.id === item.id);

        if (itemIndex !== -1) {
            const currentQty = arr[itemIndex].qty || 1;

            // ตรวจสอบว่าจำนวนสินค้าในตะกร้าเกิน stock หรือไม่
            if (currentQty < arr[itemIndex].stock) {
                arr[itemIndex].qty = currentQty + 1; // เพิ่มจำนวนสินค้า
            } else {
                arr[itemIndex].qty = arr[itemIndex].stock; // ปรับจำนวนให้เท่ากับ stock สูงสุด
            }
        }

        setCarts(arr);
        setRecordInCarts(arr.length);

        localStorage.setItem('carts', JSON.stringify(arr)); // บันทึกข้อมูลลง localStorage

        callculatePriceAndQty(arr); // คำนวณราคาและจำนวนใหม่
    } catch (e) {
        Swal.fire({
            title: "error",
            text: e.message,
            icon: "error"
        });
    }
};


  // const handleToggleSelect = (item) => {
  //   const updatedCarts = carts.map(cartItem => {
  //       if (cartItem.id === item.id) {
  //           return { ...cartItem, selected: !cartItem.selected }; // เปลี่ยนสถานะ selected
  //       }
  //       return cartItem;
  //   });

  //   setCarts(updatedCarts);
  //   localStorage.setItem('carts', JSON.stringify(updatedCarts)); // บันทึกลง localStorage
  // };

  const handleToggleSelect = (item) => {
    // ตรวจสอบหาก stock เป็น 0 แล้วจะไม่ให้เลือกสินค้า
    if (item.stock === 0) {
      Swal.fire({
        title: 'สินค้าหมดสต็อก',
        text: 'ไม่สามารถเลือกสินค้ารายการนี้ได้ เพราะสินค้าหมดสต็อก',
        icon: 'warning',
      });
      return;
    }
  
    // หาก stock มีค่า ก็สามารถเลือกหรือยกเลิกการเลือกได้
    const updatedCarts = carts.map(cartItem => {
      if (cartItem.id === item.id) {
        return { ...cartItem, selected: !cartItem.selected }; // เปลี่ยนสถานะ selected
      }
      return cartItem;
    });
  
    setCarts(updatedCarts);
    localStorage.setItem('carts', JSON.stringify(updatedCarts)); // บันทึกลง localStorage
  };

  const calculateSelectedPrice = () => {
  // กรองเฉพาะสินค้าที่ถูกเลือกและมีสต็อกมากกว่า 0
  const selectedItems = carts.filter(item => item.selected && item.stock > 0);
  
  let total = 0;

  selectedItems.forEach(item => {
    total += (item.price || 0) * (item.qty || 1); // คำนวณราคา
  });

  return total; // ส่งคืนราคารวมของสินค้าที่เลือกและมีสต็อก
};


  
  const callculatePriceAndQty = (itemInCarts) => {
    let sumQty = 0;
    let sumPrice = 0;

    for (let i = 0; i < itemInCarts.length; i++) {
        const item = itemInCarts[i];
        sumQty += item.qty || 1;  // รวมจำนวนสินค้าทั้งหมด
        sumPrice += parseInt(item.price) * (item.qty || 1);  // คำนวณราคาทั้งหมดตามจำนวน
    }

    setSumPrice(sumPrice);  // อัปเดตราคาทั้งหมด
    setSumQty(sumQty);      // อัปเดตจำนวนสินค้า
}

    // const fetchDataFromLocal = () => {
    //     const itemInCarts = JSON.parse(localStorage.getItem('carts'));
    //     if (itemInCarts !== null) {
    //         setCarts(itemInCarts);
    //         setRecordInCarts(itemInCarts !== null ? itemInCarts.length : 0);

    //         callculatePriceAndQty(itemInCarts);
    //     }

    // }

    const fetchDataFromLocal = async () => {
      const itemInCarts = JSON.parse(localStorage.getItem('carts'));
    
      if (itemInCarts && itemInCarts.length > 0) {
        try {
          const res = await axios.get(config.apiPath + '/product/list');
          const productsFromDb = res.data.result || [];
    
          // อัปเดตข้อมูลสินค้าในตะกร้าให้ตรงกับฐานข้อมูล
          const updatedCarts = itemInCarts.filter(cartItem => {
            const productFromDb = productsFromDb.find(product => product.id === cartItem.id);
            return productFromDb; // ถ้าสินค้าไม่มีในฐานข้อมูลให้ลบออกจากตะกร้า
          }).map(cartItem => {
            const productFromDb = productsFromDb.find(product => product.id === cartItem.id);
            if (productFromDb) {
              return {
                ...cartItem,
                name: productFromDb.name, // อัปเดตชื่อ
                price: productFromDb.price, // อัปเดตราคา
                stock: productFromDb.stock,
                imgs: productFromDb.imgs, // อัปเดตรูปภาพ
              };
            }
            return cartItem;
          });
    
          setCarts(updatedCarts);
          setRecordInCarts(updatedCarts.length);
          localStorage.setItem('carts', JSON.stringify(updatedCarts)); // อัปเดต localStorage
          callculatePriceAndQty(updatedCarts); // คำนวณราคาทั้งหมดใหม่
        } catch (e) {
          Swal.fire({
            title: 'error',
            text: 'ไม่สามารถอัปเดตข้อมูลสินค้าได้: ' + e.message,
            icon: 'error',
          });
        }
      } else {
        setCarts([]);
        setRecordInCarts(0);
      }
    };
    
    

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

    const getSelectedItems = () => {
      return carts.filter(item => item.selected); // เลือกเฉพาะสินค้าที่ถูกเลือก
  };
  

   function showImage(item) {
        if (item.imgs && item.imgs.length > 0) {  
            let imgPath = config.apiPath + '/uploads/' + item.imgs[0]; 
            return <img className="p-2 m-3" height="100px" src={imgPath} alt="Product Image" />;
        }
        return <img className="p-2 m-3" height="100px" src="imgnot.jpg" alt="No image" />; 
    }
    const handleDelete = (item) => {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: `ต้องการลบ "${item.name}" ออกจากตะกร้าใช่ไหม?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "ลบสินค้า",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedCarts = carts.filter(cartItem => cartItem.id !== item.id);
          setCarts(updatedCarts);
          localStorage.setItem('carts', JSON.stringify(updatedCarts));
          Swal.fire("ลบสำเร็จ!", "สินค้าถูกนำออกจากตะกร้า", "success");
        }
      });
    };
    
  return<HomePage title={pageTitle}> 
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Cart page" />
      </Helmet>
      <div>
        <div className="d-flex justify-content-center">
          <div
            className="card w-100 p-5 mb-5"
            style={{
              maxWidth: "900px",
              borderRadius: "30px",
              borderColor: "#D8BABD",
              backgroundColor: "#ffffff",
              
            }}
          >
            {/* {carts.length > 0 ? carts.map(item =>
              <div className="d-flex flex-column flex-md-row align-items-center" key={item.id}>
              <div className="p-5">
                <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={item.selected || false}
                    onChange={() => handleToggleSelect(item)} // เปลี่ยนสถานะ selected เมื่อคลิก
                />
              </div>
              <Link 
                to={`/productInfo/${item.id}`} 
                // to="/productInfo"
                style={{ textDecoration: 'none' }}>
              {showImage(item)}</Link>
              <Link 
                to={`/productInfo/${item.id}`} 
                // to="/productInfo"
                className="text-wrap overflow-hidden p-3 w-50"
                style={{ textDecoration: 'none' }}>
              <div >
                <h4
                  className="mb-0 text-truncate"
                  data-bs-toggle="tooltip"
                  title="ชื่อสินค้าตัวอย่างยาวๆ เพื่อดูว่า responsive หรือไม่"
                >
                  {item.name}
                  
                </h4>
                <h6>ราคา {item.price}</h6> */}
                {/* เปลี่ยนแสดง stock เมื่อ stock เป็น 0 */}
                {/* <h6 
                  className={item.stock === 0 ? 'text-danger' : ''}  // ใช้ class text-danger ถ้า stock เป็น 0
                >
                  {item.stock === 0 ? "สินค้าหมด" : `คลัง ${item.stock} ชิ้น`}
                </h6>
              </div></Link>
              

              <div className="d-flex quantity-buttons p-3 align-items-center">
                <button onClick={e => handleRemove(item)} className="text-black">-</button>
                <span className="mx-2 text-black" >{item.qty || 1}</span>
                <button onClick={e => handleAdd(item)} className="text-black">+</button>
              </div>
            </div>
            ) : (
              <div className="text-center m-5">
                <i className="bi bi-cart-x fs-1 text-secondary"></i>
                <h6 className="mt-3 text-secondary">ไม่มีสินค้าในตะกร้า</h6>
              </div>
            )} */}
            
              {/* {carts.length > 0 ? carts.map(item => (
                <div className="d-flex flex-column flex-md-row align-items-center mb-3" key={item.id}>
                  <div className="p-3">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={item.selected || false}
                      onChange={() => handleToggleSelect(item)} // เปลี่ยนสถานะ selected เมื่อคลิก
                      disabled={item.stock === 0}
                    />
                  </div>
                  
                  <Link to={`/productInfo/${item.id}`} style={{ textDecoration: 'none' }}>
                    {showImage(item)}
                  </Link>

                  <Link 
                    to={`/productInfo/${item.id}`} 
                    className="text-wrap overflow-hidden p-3 w-100 w-md-50"  // ใช้ w-100 บนอุปกรณ์ขนาดเล็ก
                    style={{ textDecoration: 'none' }}
                  >
                    <div>
                      <h4
                        className="mb-0 text-truncate"
                        data-bs-toggle="tooltip"
                        title="ชื่อสินค้าตัวอย่างยาวๆ เพื่อดูว่า responsive หรือไม่"
                      >
                        {item.name}
                      </h4>
                      <h6>ราคา {item.price}</h6>
                      <h6 className={item.stock === 0 ? 'text-danger' : ''}>
                        {item.stock === 0 ? "สินค้าหมด" : `คลัง ${item.stock} ชิ้น`}
                      </h6>
                    </div>
                  </Link>

                  <div className="d-flex quantity-buttons p-3 align-items-center">
                    <button onClick={() => handleRemove(item)} className="text-black">-</button>
                    <span className="mx-2 text-black">{item.qty || 1}</span>
                    <button onClick={() => handleAdd(item)} className="text-black">+</button>
                  </div>
                </div>
                
                
              )) : (
                <div className="text-center m-5">
                  <i className="bi bi-cart-x fs-1 text-secondary"></i>
                  <h6 className="mt-3 text-secondary">ไม่มีสินค้าในตะกร้า</h6>
                </div>
              )} */}
            {carts.length > 0 ? carts.map(item => (
              <div className="d-flex flex-column flex-md-row align-items-center mb-3" key={item.id}>
                <div className="p-3">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={item.selected || false}
                    onChange={() => handleToggleSelect(item)} // เปลี่ยนสถานะ selected เมื่อคลิก
                    disabled={item.stock === 0}
                  />
                </div>

                <Link to={`/productInfo/${item.id}`} style={{ textDecoration: 'none' }}>
                  {showImage(item)}
                </Link>

                <Link 
                  to={`/productInfo/${item.id}`} 
                  className="text-wrap overflow-hidden p-3 w-100 w-md-50"  // ใช้ w-100 บนอุปกรณ์ขนาดเล็ก
                  style={{ textDecoration: 'none' }}
                >
                  <div>
                    <h4
                      className="mb-0 text-truncate"
                      data-bs-toggle="tooltip"
                      title={item.name} // ใช้ชื่อสินค้าจริง
                    >
                      {item.name}
                    </h4>
                    <h6>ราคา {item.price}</h6>
                    <h6 className={item.stock === 0 ? 'text-danger' : ''}>
                      {item.stock === 0 ? "สินค้าหมด" : `คลัง ${item.stock} ชิ้น`}
                    </h6>
                  </div>
                </Link>

                <div className="d-flex quantity-buttons p-3 align-items-center">
                  <button 
                    onClick={() => handleRemove(item)} 
                    className="text-black" 
                    disabled={item.qty <= 1} // ป้องกันการลดจำนวนต่ำกว่า 1
                  >
                    -
                  </button>
                  <span className="mx-2 text-black">{item.qty || 1}</span>
                  <button 
                    onClick={() => handleAdd(item)} 
                    className="text-black"
                    disabled={item.qty >= item.stock} // ป้องกันการเพิ่มเกินสต็อก
                  >
                    +
                  </button>
                </div>

                {/* ปุ่มลบสินค้าออกจากตะกร้า */}
                <div className="p-3">
                  <button onClick={() => handleDelete(item)} className="btn">
                    <i className="bi bi-trash text-danger"></i>
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center m-5">
                <i className="bi bi-cart-x fs-1 text-secondary"></i>
                <h6 className="mt-3 text-secondary">ไม่มีสินค้าในตะกร้า</h6>
              </div>
            )}

            
            <div style={{ borderTop: "1px solid #D8BABD", width: "90%", margin: "auto" }}>
            </div>
            <div className="d-flex justify-content-end p-5">
              <div className="d-flex mt-2">
                <h4 className="mx-5">ราคารวม : </h4><h4 className="mx-2">{calculateSelectedPrice().toLocaleString('th-TH')}</h4><h4 className="mx-2">฿</h4>
              </div>
              <button 
              onClick={handleCheckout}
              className="btn ms-3 rounded-pill" style={{backgroundColor: "#5B166C"}}>
                <h6 className="mt-1 m-2 text-white">ชำระเงิน</h6>
              </button>
            </div>
          </div>
        </div>
      </div>
    </HomePage>
  
}

export default Cart;
