import { Link } from "react-router-dom"; 

function Footer() {
    return (
      <>
      <div style={{ backgroundColor: "#FFF8DE"}}>
        <div className="container-fluid p-5 w-75" >
          <div className="row justify-content-center text-center text-md-start">
            {/* โลโก้ "สามฤดู" */}
            <div className="col-12 col-md-3 d-flex justify-content-center align-items-center mb-4">
              <p className="fw-bold" style={{ fontSize: "40px", color: "#5A0D6C" }}>
                สามฤดู
              </p>
            </div>
  
            {/* เกี่ยวกับเรา */}
            <div className="col-6 col-md-2 mb-3">
              <p className="fw-bold fs-5">เกี่ยวกับเรา</p>
              <Link to="/contact" className="text-dark text-decoration-none d-block">
                ติดต่อเรา
                </Link>
              <Link to="/contact" className="text-dark text-decoration-none d-block">เกี่ยวกับเรา</Link>
              <Link to="/term-policy" className="text-dark text-decoration-none d-block">ข้อกำหนดและเงื่อนไข</Link>
              <Link to="/term-policy" className="text-dark text-decoration-none d-block">นโยบายความเป็นส่วนตัว</Link>
            </div>
  
            {/* บริการลูกค้า */}
            <div className="col-6 col-md-2 mb-3">
              <p className="fw-bold fs-5">บริการลูกค้า</p>
              <Link to="/term-policy" className="text-dark text-decoration-none d-block">การจัดส่งสินค้า</Link>
              <Link to="/term-policy" className="text-dark text-decoration-none d-block">การรับประกันสินค้า</Link>
              <Link to="/term-policy" className="text-dark text-decoration-none d-block">การยกเลิกการสั่งซื้อสินค้า</Link>
              <Link to="/term-policy" className="text-dark text-decoration-none d-block">การคืนสินค้าและการคืนเงิน</Link>
            </div>
  
            {/* ติดต่อเรา + Social Media */}
            <div className="col-12 col-md-4 text-center text-md-start">
              <p className="fw-bold fs-5">ติดต่อเรา</p>
              <div className="d-flex justify-content-center justify-content-md-start">
                <a href="https://x.com/Samrueduu?t=FJqtME4sFGeCuvxCSzKmdg&s=09&fbclid=IwY2xjawJU0FlleHRuA2FlbQIxMAABHTTzmApXku8K9v81IIjSqZnCxs-Jpju_1qcEFbzV984Yp-ifEm3zJLV9Vw_aem_hVPOGm9N0Wnw3MQlCQnVUA" className="me-3">
                  <img src="X Logo.png" alt="X logo" style={{ width: "35px" }} />
                </a>
                <a href="https://www.instagram.com/samrueduu/?igsh=MW94aGUyaGV5a20xbQ%3D%3D&fbclid=IwY2xjawJU0FNleHRuA2FlbQIxMAABHerx6lZvhGPb1YiYkbmJRFtRjJbi4xOKDWJsQi_GozqecpMObCPUxDEwuA_aem_8U-6qp9YAct9FLIv0XAIxQ#" className="me-3">
                  <img src="Logo Instagram.png" alt="Instagram logo" style={{ width: "35px" }} />
                </a>
                <a href="https://www.youtube.com/@samrueduuofficial" className="me-3">
                  <img src="Logo YouTube.png" alt="YouTube logo" style={{ width: "35px" }} />
                </a>
                {/* <a href=""> */}
                  <img src="LinkedIn.png" alt="LinkedIn logo" style={{ width: "35px" }} />
                {/* </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
        
      </>
    );
  }
  
  export default Footer;
  