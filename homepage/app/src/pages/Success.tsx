import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios'; // นำเข้า axios
import SideBar from '../components/SideBar';
import config from '../config';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id'); // ดึงค่า id จาก URL
  const [orderDetails, setOrderDetails] = useState(null); // เก็บข้อมูลคำสั่งซื้อ
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
  const [error, setError] = useState(null); // เก็บข้อผิดพลาด
  const [carts, setCarts] = useState([]); // เก็บข้อมูลตะกร้าสินค้า
  const [recordInCarts, setRecordInCarts] = useState(0); // เก็บจำนวนสินค้าในตะกร้า

  useEffect(() => {
    // ตรวจสอบว่ามี orderId หรือไม่
    if (!orderId) {
      navigate('/cancel', { replace: true }); // เปลี่ยนเส้นทางไปยังหน้าหลักหากไม่มี orderId
      return;
    }

    // เรียก API เพื่อดึงข้อมูลคำสั่งซื้อ
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${config.apiPath}/order/order/${orderId}`); // เรียก API
        const selectedOrder = response.data;

        // ตรวจสอบสถานะของคำสั่งซื้อ
        if (selectedOrder.status === 'complete' || selectedOrder.status === 'pending') {
          // ดึงข้อมูลจาก localStorage และอัปเดตสถานะ
          const savedCarts = JSON.parse(localStorage.getItem('carts')) || [];
          const remainingCarts = savedCarts.filter(item => !item.selected); // กรองสินค้าที่ไม่ได้เลือก

          // อัปเดต state
          setCarts(remainingCarts);
          setRecordInCarts(remainingCarts.length);

          // อัปเดต localStorage และคำนวณราคา/จำนวนสินค้าใหม่
          localStorage.setItem('carts', JSON.stringify(remainingCarts));
          calculatePriceAndQty(remainingCarts);
        } else {
          // หากสถานะไม่ใช่ complete หรือ pending
          setError("คำสั่งซื้อนี้ไม่สามารถดำเนินการได้");
        }

        setOrderDetails(selectedOrder); // เก็บข้อมูลคำสั่งซื้อ
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setError(error.response?.data?.error || "System error"); // เก็บข้อผิดพลาด
        navigate('/cancel', { replace: true });
      } finally {
        setLoading(false); // หยุดการโหลด
      }
    };

    fetchOrderDetails();
  }, [navigate, orderId]);

  const calculatePriceAndQty = (updatedCarts) => {
    const totalQty = updatedCarts.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedCarts.reduce((sum, item) => sum + item.price * item.quantity, 0);

    console.log("Total Quantity:", totalQty);
    console.log("Total Price:", totalPrice);
  };

  const handleComplete = () => {
    navigate('/productMain', { replace: true }); // เปลี่ยนเส้นทางไปยังหน้าหลักเมื่อกดปุ่ม "เสร็จสิ้น"
  };

  if (loading) {
    return <div>กำลังโหลดข้อมูล</div>; // แสดงข้อความโหลดข้อมูล
  }

  if (error) {
    return <div>เกิดข้อผิดพลาด: {error}</div>; // แสดงข้อความข้อผิดพลาด
  }

  return (
    <div style={{ backgroundColor: '#FFF5F6', height: '100vh', paddingTop: '50px' }}>
      <SideBar />
      <div className='container'>
        <div className='d-flex justify-content-center ms-3'>
          <div>
            <h4 className='ms-5'><strong>ชำระเงินสำเร็จ</strong></h4>
            <div className='mt-4'>
              <img 
                src="correctIcon.png" 
                alt="Correct Icon"
                
              />
            </div>
            <div className='ms-5 mt-4'>
              <button 
                onClick={handleComplete}
                className="btn ms-3 rounded-pill" 
                style={{ backgroundColor: "#5B166C" }}
              >
                <p className="mt-1 m-2 text-white">เสร็จสิ้น</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
