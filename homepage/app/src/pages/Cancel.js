import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';


const CancelPage = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/productMain', { replace: true }); // เปลี่ยนเส้นทางไปยังหน้าหลักเมื่อกดปุ่ม "เสร็จสิ้น"
  };


  return (
    <div style={{ backgroundColor: '#FFF5F6', height: '100vh', paddingTop: '50px' }}>
      <SideBar />
      <div className='container'>
        <div className='d-flex justify-content-center ms-3'>
          <div className='text-center'>
            <h4 className='ms-5'><strong>ชำระเงินสำเร็จ</strong></h4>
            <div className='mt-4 ms-3'>
              <img 
                src="error-icon.png" 
                alt="Correct Icon"
                className='w-50 ms-5'
              />
            </div>
            <div className='ms-5 mt-4'>
              <button 
                onClick={handleComplete}
                className="btn ms-5 rounded-pill" 
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

export default CancelPage;
