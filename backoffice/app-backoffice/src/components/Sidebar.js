import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";


function Sidebar() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
      fetchData();

    }, []);
    const fetchData = async () => {
      try {
        const res = await axios.get(config.apiPath + '/user/info', config.headers())
        
        if(res.data.result !== undefined){
          setUser(res.data.result);
        }
      } catch (error) {
        Swal.fire({
          title: 'error',
          text: error.message,
          icon: 'error'
        })
      }
    }

    const handleSignOut = async () => {
      try {
        const button = await Swal.fire({
          title: 'ออกจากระบบ',
          text: 'ยืนยันการออกจากระบบ',
          icon: 'question',
          showCancelButton: true,
          showConfirmButton: true
        })
        if (button.isConfirmed){
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        Swal.fire({
          title: 'error',
          text: error.message,
          icon: 'error'
        })       
      }
    }
    return<>
    <aside className="main-sidebar elevation-4" style={{ backgroundColor: '#ffffff' }}>
      <a href="index3.html" className="brand-link d-flex align-items-center justify-content-center">
        
        <span className="brand-text" style={{ color: '#5A0D6C', fontWeight: 'bold' }}>สามฤดู ผู้ขาย</span>
    </a>

    <div className="sidebar">
      <div className="user-panel mt-3">
        <div className="text-center">
          <div className="image d-flex text-center justify-content-center">
                    <img 
                    src="logo-2.png" 
                    alt="User Image"
                    ></img>
                    <a href="" className="d-block ml-3" style={{ color: '#5A0D6C' }}>
                      <h4>{user.name}</h4>
                      </a>
                  </div>
                  <div className="info mt-2">
                    <button onClick={handleSignOut} className="btn btn-danger btn-sm">
                      <i className="fa fa-sign-out-alt mr-2"></i>ลงชื่อออก
                    </button>
                  </div>
        </div>
        
      </div>
      <nav>
        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          {/* <li class="nav-header" style={{ color: '#5A0D6C', fontWeight: 'bold' }}>เมนู</li> */}

          <li className="nav-item mt-3">
            <Link to="/home" className="nav-link">
              <i className="nav-icon fa fa-home"></i>
              <p>
                หน้าหลัก
                <span className="badge badge-info right"></span>
              </p>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              <i className="nav-icon fa fa-columns"></i>
              <p>
                แดชบอร์ด
                <span className="badge badge-info right"></span>
              </p>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/product" className="nav-link">
              <i className="nav-icon fa fa-box"></i>
              <p>
                สินค้า
                <span className="badge badge-info right"></span>
              </p>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/billSale" className="nav-link">
            <i className="nav-icon fa fa-list"></i>
              <p>
                รายงานยอดขาย
                <span className="badge badge-info right"></span>
              </p>
            </Link>
          </li>

        </ul>

      </nav>
    </div>
  </aside>
    </>
}
export default Sidebar;