import HomePage from "../components/HomePage";
import { Helmet } from "react-helmet";
import axios from "axios"; // ใช้ axios สำหรับเรียก API
import { useState, useEffect } from "react"; // ใช้ useState และ useEffect
import config from "../config";
import { format } from 'date-fns'; // สำหรับจัดรูปแบบวันที่
import { Collapse } from 'react-bootstrap'; // สำหรับแสดงผลแบบ Accordion
import { useNavigate } from 'react-router-dom'; // เพิ่ม import นี้
import Swal from 'sweetalert2'; // เพิ่ม import นี้
import MyModal from "../components/MyModal";
import { useLocation } from "react-router-dom"; // ใช้ useLocation จาก react-router-dom
import ReactSelect from 'react-select';
// import ReactSlider from 'react-slider';

function Orders() {
    const pageTitle = 'ประวัติการสั่งซื้อ';
    const [orders, setOrders] = useState([]); // เก็บข้อมูลคำสั่งซื้อ
    const [loading, setLoading] = useState(true); // ใช้สถานะ loading
    const [user, setUser] = useState({}); // เก็บข้อมูล user
    const [userCustomerId, setUserCustomerId] = useState(null); // เก็บ userCustomerId

    // สำหรับ Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5); // จำนวนคำสั่งซื้อต่อหน้า

    // สำหรับการค้นหาและกรอง
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // สำหรับแสดงรายละเอียดใบเสร็จ
    const [selectedOrderId, setSelectedOrderId] = useState(null); // เก็บ orderId ที่เลือก
    const [billInfo, setBillInfo] = useState([]); // เก็บข้อมูลรายละเอียดใบเสร็จ
    const [loadingBill, setLoadingBill] = useState(false); // สถานะการโหลด billInfo

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);    

    const statusOptions = [
        { value: 'all', label: 'ทั้งหมด' },
        { value: 'open', label: 'รอชำระเงิน/ชำระเงินไม่สำเร็จ' },
        { value: 'complete', label: 'ชำระเงินเสร็จสิ้น' },
        { value: 'pending', label: 'ชำระเงินปลายทาง' },
        { value: 'cancel', label: 'คำสั่งซื้อถูกยกเลิก' },
    ];

    const handleSelect = (value) => {
        setFilterStatus(value);
    };


    // ฟังก์ชันเมื่อ Slider เปลี่ยนค่า
    const handleSliderChange = (index) => {
        const selectedStatus = statusOptions[index].value;
        setFilterStatus(selectedStatus);
    };

    // ดึงข้อมูลผู้ใช้
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(config.apiPath + "/user/customer/info", config.headers());
                if (res.data.result) {
                    setUser(res.data.result); // ตั้งค่า user
                    setUserCustomerId(res.data.result.id); // ตั้งค่า userCustomerId เมื่อได้รับข้อมูล
                }
            } catch (error) {
                console.error('ไม่สามารถดึงข้อมูลผู้ใช้:', error);
            }
        };

        fetchUser();
    }, []); // เรียก API ครั้งเดียวเมื่อ component โหลด

    // ดึงข้อมูลคำสั่งซื้อ
    useEffect(() => {
        const fetchOrders = async () => {
            if (userCustomerId) {
                try {
                    const response = await axios.get(`${config.apiPath}/api/sale/list/${userCustomerId}`, config.headers());
                    if (response.data.results) {
                        setOrders(response.data.results);
                    }
                } catch (error) {
                    console.error('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้:', error);
                    if (error.response) {
                        alert(`เกิดข้อผิดพลาด: ${error.response.status}`);
                    } else {
                        alert('การเชื่อมต่อล้มเหลว กรุณาลองใหม่อีกครั้ง');
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        if (userCustomerId) {
            fetchOrders();
        }
    }, [userCustomerId]); // เมื่อ userCustomerId เปลี่ยนค่า, ให้เรียกดึงคำสั่งซื้อใหม่

    const calculateBillTotal = (items) => {
        return items.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    // ดึงข้อมูลใบเสร็จ
    const fetchBillInfo = async (orderId) => {
        setLoadingBill(true);
        try {
            const response = await axios.get(`${config.apiPath}/api/sale/billInfo/${orderId}`, config.headers());
            if (response.data.results) {
                setBillInfo(response.data.results);
            }
        } catch (error) {
            console.error('ไม่สามารถดึงข้อมูลใบเสร็จได้:', error);
            if (error.response && error.response.status === 404) {
                alert("ไม่พบข้อมูลใบเสร็จสำหรับคำสั่งซื้อนี้");
            } else {
                alert("เกิดข้อผิดพลาดในการดึงข้อมูลใบเสร็จ");
            }
        } finally {
            setLoadingBill(false);
        }
    };

    // จัดการการคลิกที่คำสั่งซื้อ
    const handleOrderClick = (orderId) => {
        if (!orderId) return;
    
        const orderExists = orders.some(order => order.id === orderId);
        if (!orderExists) {
            alert("ไม่พบคำสั่งซื้อนี้");
            return;
        }
    
        setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
        if (selectedOrderId !== orderId) {
            fetchBillInfo(orderId);
        }
    };

    // รีเฟรชข้อมูลคำสั่งซื้อ
    const refreshOrders = async () => {
        if (!userCustomerId) return;
    
        setLoading(true);
        try {
            const response = await axios.get(`${config.apiPath}/api/sale/list/${userCustomerId}`, config.headers());
            if (response.data.results) {
                setOrders(response.data.results);
            }
        } catch (error) {
            console.error('ไม่สามารถดึงข้อมูลคำสั่งซื้อได้:', error);
        } finally {
            setLoading(false);
        }
    };

    // กรองข้อมูลคำสั่งซื้อ
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.order_id.includes(searchTerm) || order.fullname.includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // คำนวณข้อมูลที่ต้องแสดงในหน้าปัจจุบัน
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // เปลี่ยนหน้า
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // ฟังก์ชันแสดงรูปสินค้า
    const showImage = (item) => {
        const images = item.Product?.imgs || []; // ใช้ Optional Chaining เพื่อป้องกัน error
        if (images.length > 0 && images[0]) {
            let imgPath = config.apiPath + '/uploads/' + images[0];
            return <img className="p-2 m-3 rounded-4" height="90px" width="90px" src={imgPath} alt="ProductImage" />;
        }
        return <img className="p-2 m-3 rounded-4" height="90px" width="90px" src="imgnot.jpg" alt="Noimage" />;
    };

    const navigate = useNavigate(); // ใช้สำหรับนำทางไปยังหน้าตะกร้าสินค้า

    const buyOrder = (orderId) => {
        // ตรวจสอบว่ามีข้อมูลใบเสร็จหรือไม่
        if (billInfo.length === 0) {
            Swal.fire({
                title: 'ไม่พบข้อมูลสินค้า',
                text: 'ไม่สามารถซื้อสินค้านี้ได้',
                icon: 'warning',
            });
            return;
        }
    
        // ดึงข้อมูลตะกร้าสินค้าจาก localStorage
        const storedCarts = JSON.parse(localStorage.getItem('carts')) || [];
    
        // เพิ่มสินค้าจาก billInfo ลงในตะกร้า
        billInfo.forEach(item => {
            const existingItem = storedCarts.find(cartItem => cartItem.id === item.Product.id);
    
            if (existingItem) {
                // หากสินค้ามีอยู่แล้วในตะกร้า ให้เพิ่มจำนวนและเลือกสินค้า
                existingItem.qty += item.qty;
                existingItem.selected = true; // เลือกสินค้า
            } else {
                // หากสินค้าไม่มีในตะกร้า ให้เพิ่มสินค้าใหม่และเลือกสินค้า
                storedCarts.push({
                    id: item.Product.id,
                    name: item.Product.name,
                    price: item.price,
                    qty: item.qty,
                    stock: item.Product.stock,
                    imgs: item.Product.imgs,
                    selected: true, // เลือกสินค้า
                });
            }
        });
    
        // บันทึกตะกร้าสินค้าลงใน localStorage
        localStorage.setItem('carts', JSON.stringify(storedCarts));
    
        // แจ้งเตือนผู้ใช้
        Swal.fire({
            title: 'เพิ่มสินค้าสำเร็จ',
            text: 'สินค้าถูกเพิ่มลงในตะกร้าแล้ว',
            icon: 'success',
        });
    
        // นำผู้ใช้ไปยังหน้าตะกร้าสินค้า
        navigate('/cart');
    };

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const location = useLocation();
    const { carts, sumPrice, sumQty } = location.state || {};
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userAddresses, setUserAddresses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // const [selectedAddress, setSelectedAddress] = useState(null); // เก็บที่อยู่ที่เลือก
    // const [selectedPhone, setSelectedPhone] = useState(null); // เก็บเบอร์โทรที่เลือก
    const [selectedOrder, setSelectedOrder] = useState(null); //

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
        if (carts && sumPrice && sumQty) {
            console.log("ตะกร้า", carts, "ราคารวม", sumPrice, sumQty);
            fetchData();
        }
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

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const input = e.target.value || '';
        const onlyNumbers = input.replace(/\D/g, "");
        const formattedNumber = onlyNumbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        setPhone(formattedNumber);
    };  

     useEffect(() => {
        if (selectedOrderId) {
            // ค้นหาข้อมูลคำสั่งซื้อที่ตรงกับ selectedOrderId
            const selectedOrder = orders.find(order => order.id === selectedOrderId);
            if (selectedOrder) {
                setSelectedOrder(selectedOrder); // อัปเดต selectedOrder
            }
        }
    }, [selectedOrderId, orders]); // เรียกเมื่อ selectedOrderId หรือ orders เปลี่ยนแปลง

    const uniquePhones = currentOrders.length > 0 ? currentOrders.map(order => ({
        value: order.phone,
        label: order.phone,
        order_id: order.id
    })) : [];
    
    const uniqueAddresses = currentOrders.length > 0 ? currentOrders.map(order => ({
        value: order.address,
        label: order.address,
        order_id: order.id
    })) : [];

    const handlePhoneSelect = (selectedPhone) => {
        setPhone(selectedPhone.value);
        const selectedOrder = currentOrders.find(order => order.phone === selectedPhone.value);
        if (selectedOrder) {
            setSelectedOrderId(selectedOrder.id); // อัปเดต selectedOrderId
        }
    };

    const handleAddressSelect = (selectedAddress) => {
        setAddress(selectedAddress.value);
        // ค้นหา order_id ที่ตรงกับ address ที่เลือก
        const selectedOrder = currentOrders.find(order => order.address === selectedAddress.value);
        if (selectedOrder) {
            setSelectedOrderId(selectedOrder.id); // อัปเดต selectedOrderId
        }
    };

    const handleOpenModal = (orderId) => {
        const selectedOrder = orders.find(order => order.id === orderId); // ค้นหา order ที่เลือก
        if (selectedOrder) {
            setName(selectedOrder.fullname); // อัปเดตชื่อ
            setPhone(selectedOrder.phone); // อัปเดตเบอร์โทร
            setAddress(selectedOrder.address); // อัปเดตที่อยู่
            setSelectedOrderId(orderId); // อัปเดต selectedOrderId
            setIsModalOpen(true); // เปิด Modal
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // ปิด Modal
        setSelectedOrderId(null); // รีเซ็ต selectedOrderId
        setSelectedOrder(null); // รีเซ็ต selectedOrder
    };

    const handleSave = async () => {
        if (!selectedOrderId) {
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่พบคำสั่งซื้อที่เลือก',
                icon: 'error',
            });
            return;
        }
    
        const updatedData = {
            fullname: name,
            phone: phone,
            address: address,
        };
    
        try {
            const response = await axios.put(`${config.apiPath}/order/editInfo/${selectedOrderId}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200) {
                const updatedOrder = response.data;
                const updatedOrders = orders.map(order =>
                    order.id === selectedOrderId ? { ...order, ...updatedOrder } : order
                );
    
                setOrders(updatedOrders);
                setIsModalOpen(false);
    
                Swal.fire({
                    title: 'บันทึกสำเร็จ',
                    text: 'ข้อมูลที่อยู่ถูกอัปเดตแล้ว',
                    icon: 'success',
                });
            }
        } catch (error) {
            console.error('Error updating order:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: error.response?.data?.error || 'ไม่สามารถบันทึกข้อมูลได้',
                icon: 'error',
            });
        }
    };

    
    const handleCancelOrder = async (orderId) => {
        try {
            const button = await Swal.fire({
                title: "ยกเลิก",
                text: "",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + "/api/sale/updateStatusToCancel/" + orderId, config.headers());

                if (res.data.message === "success") {
                    Swal.fire({
                        title: "save",
                        text: "save",
                        icon: "success",
                        timer: 1000,
                    });

                    fetchData();
                }
            }
        } catch (e) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };
    return (
        <HomePage title={pageTitle}>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content="Orders page" />
            </Helmet>
            <div className="container">
                <div className="d-flex justify-content-center">
                    <div className="card pt-5 px-5 mb-5" style={{ borderRadius: "30px", padding: "20px", width: "80%", maxWidth: "1200px", height: "auto", borderColor: "#D8BABD" }}>
                        
                        <div className="mb-3 ms-5 ">
                            <div className="d-flex">
                               <input
                                type="text"
                                placeholder="ค้นหาหมายเลขคำสั่งซื้อ"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-control custom-placeholder rounded-pill"
                            />
                            <button 
                                className="btn rounded-pill w-25" 
                                onClick={refreshOrders}
                                disabled={loading}
                            ><i className="fas fa-sync"></i>
                                
                            </button> 
                            </div>
                                <div className="m-1">
                                    {windowWidth < 768 ? (
                                        <select
                                        className="form-select"
                                        value={filterStatus}
                                        onChange={(e) => handleSelect(e.target.value)}
                                        style={{ borderRadius: "20px" }}
                                        >
                                        {statusOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                            {option.label}
                                            </option>
                                        ))}
                                        </select>
                                    ) : (
                                        <div className="d-flex">
                                        {statusOptions.map((option) => (
                                            <button
                                            key={option.value}
                                            onClick={() => handleSelect(option.value)}
                                            className="ms-4 position-relative"
                                            style={{
                                                backgroundColor: "transparent",
                                                color: filterStatus === option.value ? "#5B166C" : "#000",
                                                border: "none",
                                                fontFamily: "'Kanit', sans-serif",
                                                fontSize: "1rem",
                                                cursor: "pointer",
                                                transition: "color 0.3s ease",
                                            }}
                                            >
                                            {option.label}
                                            <span
                                                style={{
                                                content: "''",
                                                position: "absolute",
                                                bottom: "-5px",
                                                left: "50%",
                                                transform:
                                                    filterStatus === option.value
                                                    ? "translateX(-50%)"
                                                    : "translateX(-50%) scaleX(0)",
                                                width: "80%",
                                                height: "6px",
                                                backgroundColor: filterStatus === option.value ? "#5B166C" : "transparent",
                                                borderRadius: "10px",
                                                transition: "transform 0.3s ease, background-color 0.3s ease",
                                                transformOrigin: "center",
                                                }}
                                            ></span>
                                            </button>
                                        ))}
                                        </div>
                                    )}
                                    </div>
    
                        </div>

                        {loading ? (
                            <div className="text-center">กำลังโหลดข้อมูลผู้ใช้...</div>
                        ) : currentOrders.length > 0 ? (
                            <div>
                                {currentOrders.map((order, index) => (
                                    <div key={order.id}>
                                        <div 
                                            className="d-flex flex-column flex-md-row justify-content-between align-items-center my-3"
                                            //onClick={() => handleOrderClick(order.id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div>
                                                <div className="d-flex"><h6 className="mt-1 mx-2">หมายเลขคำสั่งซื้อที่ : </h6> <strong>{order.order_id}</strong></div>
                                                <div className="d-flex"><h6 className="mt-1 mx-2">ชื่อผู้รับ : </h6> {order.fullname}</div>
                                                <div className="d-flex"><h6 className="mt-1 mx-2">ที่อยู่จัดส่ง : </h6> {order.address}</div>
                                                <div className="d-flex">
                                                    <h6 className="mt-1 mx-2">สถานะคำสั่งซื้อ : </h6>
                                                    <span
                                                        style={{
                                                            color:
                                                                order.status === 'complete' ? 'green' :
                                                                order.status === 'shiped' ? 'blue' :
                                                                order.status === 'cancel' ? 'red' :
                                                                order.status === 'open' ? 'orange' :
                                                                order.status === 'pending' ? 'purple' :
                                                                'black', // สีเริ่มต้นหากไม่มีสถานะที่ตรงกัน
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {order.status === 'complete' ? 'ชำระเงินเสร็จสิ้น' :
                                                        order.status === 'shiped' ? 'จัดส่งแล้วรอรับสินค้าภายใน 3-5 วัน' :
                                                        order.status === 'cancel' ? 'ยกเลิก' :
                                                        order.status === 'open' ? 'รอตรวจสอบการชำระเงิน/ชำระไม่สำเร็จ' :
                                                        order.status === 'pending' ? 'รอตรวจการชำระเงินปลายทาง' :
                                                        order.status}
                                                    </span>
                                                </div>
                                                <div className="d-flex"><h6 className="mt-1 mx-2">วันที่สั่งซื้อ : </h6> {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm a')}</div>
                                            </div>
                                            <div>
                                                {(order.status === 'complete' || order.status === 'pending') && (
                                                        <button 
                                                            className="btn ms-3 mt-3 rounded-pill" 
                                                            style={{backgroundColor: "#fff", borderColor: "#5B166C"}}
                                                            onClick={() => handleOpenModal(order.id)}
                                                        >
                                                            <p className="mt-1 m-2">เปลี่ยนที่อยู่</p>
                                                        </button>
                                                    )}
                                                {(order.status === 'complete' || order.status === 'pending') && (
                                                        <button 
                                                            className="btn ms-3 mt-3 rounded-pill" 
                                                            style={{backgroundColor: "#fff", borderColor: "#5B166C"}}
                                                            onClick={() => handleCancelOrder(order.id)}
                                                        >
                                                            <p className="mt-1 m-2">ยกเลิก</p>
                                                        </button>
                                                    )}
                                                <button 
                                                    className="btn ms-3 mt-3 rounded-pill" 
                                                    style={{backgroundColor: "#fff", borderColor: "#5B166C"}}
                                                    onClick={() => handleOrderClick(order.id)}
                                                >
                                                    <p className="mt-1 m-2">รายละเอียด</p>
                                                </button>
                                                {/* <button 
                                                    className="btn ms-3 rounded-pill" 
                                                    style={{backgroundColor: "#fff", borderColor: "#5B166C"}}
                                                >
                                                    <p className="mt-1 m-2">ติดต่อ</p>
                                                </button>
                                                <button
                                                    onClick={() => buyOrder(order.id)} 
                                                    className="btn ms-3 rounded-pill" 
                                                    style={{backgroundColor: "#5B166C"}}
                                                >
                                                    <p className="mt-1 m-2 text-white">ซื้ออีกครั้ง</p>
                                                </button> */}
                                            </div>
                                        </div>

                                        {/* แสดงรายละเอียดใบเสร็จ */}
                                        <Collapse in={selectedOrderId === order.id}>
                                            <div className="px-5">
                                                {loadingBill ? (
                                                    <div className="text-center">กำลังโหลดรายละเอียด...</div>
                                                ) : billInfo.length > 0 ? (
                                                    <div>
                                                        <h6>รายการสินค้า:</h6>
                                                        <div className="d-flex justify-content-between">
                                                            <div className="d-flex">
                                                                <h6 className="mt-1 mx-1">ราคารวมทั้งหมด:</h6> {calculateBillTotal(billInfo)} บาท
                                                            </div>
                                                            <button
                                                                onClick={() => buyOrder(order.id)} 
                                                                className="btn rounded-pill" 
                                                                style={{backgroundColor: "#5B166C"}}
                                                            >
                                                                <p className="mt-1 m-2 text-white">ซื้ออีกครั้ง</p>
                                                            </button>
                                                        </div>
                                                        
                                                        {billInfo.map((item, idx) => (
                                                            <div key={idx} className="mb-3">
                                                                <div className="d-flex justify-content-start align-items-center">
                                                                    {showImage(item)} {/* แสดงรูปสินค้า */}
                                                                    <div className="d-flex justify-content-between">
                                                                        <h6 className="mx-3">{item.Product.name}</h6>
                                                                        <p className="mx-3">{item.qty} ชิ้น</p>
                                                                        <p className="mx-3">{item.price} บาท / ชิ้น</p>
                                                                        <p className="mx-3">รวม {item.price * item.qty} บาท</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))} 
                                                        {/* <div className="text-end px-5 mb-5">
                                                            <button
                                                                onClick={() => buyOrder(order.id)} 
                                                                className="btn ms-3 rounded-pill" 
                                                                style={{backgroundColor: "#5B166C"}}
                                                            >
                                                                <p className="mt-1 m-2 text-white">ซื้ออีกครั้ง</p>
                                                            </button>
                                                        </div> */}
                                                    </div>
                                                ) : (
                                                    <p className="text-center text-secondary">ไม่มีรายการสินค้า</p>
                                                )}
                                            </div>
                                        </Collapse>

                                        {/* เส้นแบ่งระหว่างรายการ */}
                                        {index < currentOrders.length - 1 && (
                                            <div style={{ borderTop: "1px solid #D8BABD", width: "90%", margin: "auto" }}></div>
                                        )}
                                    </div>
                                ))}

                                {/* Pagination */}
                                <div className="d-flex justify-content-center mt-4">
                                    {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            style={{
                                                border: 'none', // เอาเส้นขอบออก
                                                background: 'none', // เอาพื้นหลังออก
                                                color: currentPage === i + 1 ? '#007bff' : '#000', // สีตัวเลข
                                                fontSize: '16px', // ขนาดตัวเลข
                                                padding: '5px 10px', // ปรับ padding
                                                cursor: 'pointer', // เปลี่ยน cursor เป็น pointer
                                                fontWeight: currentPage === i + 1 ? 'bold' : 'normal', // ตัวหนาเมื่อ active
                                            }}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-secondary">ยังไม่มีการสั่งซื้อ</p>
                        )}
                    </div>
                </div>
            </div>
            <MyModal
                    id="editAddress"
                    title="แก้ไขที่อยู่"
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave} // ส่งฟังก์ชัน handleSave ไปยัง Modal
                >
                <div className="d-flex justify-content-center">
                <div className="card w-100" style={{ borderRadius: "30px", padding: "20px", width: "80%", maxWidth: "1200px", height: "260px", borderColor: "#D8BABD" }}>
                    <h5 className="ms-4">ที่อยู่ในการจัดส่ง</h5>
                    <div className="mb-3" style={{ display: "flex", height: "100%", alignItems: "center" }}>
                        {/* คอลัมน์ที่ 1 */}
                        <div  style={{ flex: 1, padding: "10px", textAlign: "center" }}>
                        {isEditing ? (
                          <div>
                            {/* ช่อง input สำหรับแก้ไขชื่อ */}
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
                                  width: "200px",
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            {/* <h6 className="text-black mt-3">
                              {firstName} {lastName}
                            </h6> */}
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
                                  height: "45px"
                                }}
                              />
                            </div>
                            
                            <span className="text-black d-flex">
                            <span className="mt-3 mx-2 text-black">โทรศัพท์ : </span>
                              {/* ส่วนของ select เบอร์โทร */}
                                <ReactSelect className="mt-2"
                                  options={uniquePhones}
                                  onChange={handlePhoneSelect}
                                  value={phone && { value: phone, label: phone }}
                                  placeholder="ค้นหา"
                                  styles={{
                                      container: (provided) => ({
                                          ...provided,
                                          width: '200px',
                                          borderRadius: '30px',
                                      }),
                                      control: (provided) => ({
                                          ...provided,
                                          borderRadius: '30px',
                                          border: '1px solid #ccc',
                                          height: "45px"
                                      }),
                                  }}
                              />
                            </span>
                          </div>
                        )}
                      </div>

                      {/* เส้นแบ่งแนวตั้ง */}
                      <div style={{
                        width: "1px",
                        backgroundColor: "#D8BABD",
                        height: "100%",
                      }}></div>

                      {/* คอลัมน์ที่ 2 */}
                      <div style={{ flex: 1, padding: "10px", textAlign: "center", marginRight: "60px" }}>
                        {/* ส่วนของการเลือกที่อยู่ */}
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
                                      width: '200px',
                                      borderRadius: '30px',
                                  }),
                                  control: (provided) => ({
                                      ...provided,
                                      borderRadius: '30px',
                                      border: '1px solid #ccc',
                                      height: "45px"
                                  }),
                              }}
                          />
                          </span>
                        )}
                      </div>

                      {/* เส้นแบ่งแนวตั้ง */}
                      <div style={{
                        width: "1px",
                        backgroundColor: "#D8BABD",
                        height: "100%",
                      }}></div>

                      {/* คอลัมน์ที่ 3 */}
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <button
                            onClick={toggleEditing}
                            className="custom-btn"
                        >
                            {isEditing ? 'ปิดการแก้ไข' : 'แก้ไข'}
                        </button>
                      </div>
                    </div>
                </div>
            </div>
            </MyModal>
        </HomePage>
    );
}

export default Orders;