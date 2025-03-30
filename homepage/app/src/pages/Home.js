import { Link } from "react-router-dom";
import HomePage from "../components/HomePage";
import { Helmet } from "react-helmet";


function Home() {
  const pageTitle = "สามฤดู";

  const imagesSlider1 = [
    '17.png',
    '18.png',
    '19.png',
    '17.png',
    '18.png',
    '18.png',
    '19.png',
    '17.png',
    '18.png',
    '19.png',
  ];
  
  const imagesSlider2 = [
    '23.png',
    '25.png',
    '27.png',
    '29.png',
    '31.png',
    '33.png',
    '23.png',
    '25.png',
    '27.png',
  ];
  
  function Slider({ images, width, height, quantity, reverse }) {
    return (
      <div
        className="slider-home"
        style={{
          '--width': `${width}px`,
          '--height': `${height}px`,
          '--quantity': quantity,
        }}
        reverse={reverse ? 'true' : undefined}
      >
        <div className="list-home">
          {images.map((src, index) => (
            <div key={index} className="item-home" style={{ '--position': index + 1 }}>
              <img src={src} alt={`Slider Image ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  window.addEventListener('scroll', function() {
    const img = document.querySelector('.fruit-frist-img');
    const scrollPos = window.scrollY; // ความสูงที่เลื่อน
    const rotation = scrollPos * 0.1; // คูณเพื่อลดความเร็วในการหมุน
    img.style.transform = `rotate(${rotation}deg)`;
  });
  window.addEventListener('scroll', function() {
    const img = document.querySelector('.fruit-second-img');
    const imgPosition = img.getBoundingClientRect().top; // ตำแหน่งของรูปภาพจากขอบบนของหน้าจอ
    const screenHeight = window.innerHeight; // ความสูงของหน้าจอ
  
    // ถ้ารูปภาพอยู่ในมุมมองของผู้ใช้
    if (imgPosition < screenHeight * 0.5 && imgPosition > 0) {
      img.classList.add('visible');
    } else {
      img.classList.remove('visible');
    }
  });
  window.addEventListener('scroll', function() {
    const img = document.querySelector('.fruit-third-img');
    const imgPosition = img.getBoundingClientRect().top; // ตำแหน่งของรูปจากขอบบนของ viewport
    const screenHeight = window.innerHeight; // ความสูงของหน้าจอ
  
    // ตรวจสอบว่าอยู่ในมุมมองหรือไม่
    if (imgPosition < screenHeight * 0.8 && imgPosition > 0) {
      img.classList.add('visible'); // ขยายเมื่ออยู่ใน viewport
    } else {
      img.classList.remove('visible'); // หดกลับเมื่อเลื่อนออก
    }
  });
  
  window.addEventListener('scroll', function() {
    const img = document.querySelector('.fruit-fouth-img');
    const imgPosition = img.getBoundingClientRect().top; // ตำแหน่งของรูปภาพจากขอบบนของหน้าจอ
    const screenHeight = window.innerHeight; // ความสูงของหน้าจอ
  
    // ถ้ารูปภาพอยู่ในมุมมองของผู้ใช้
    if (imgPosition < screenHeight * 1 && imgPosition > 0) {
      img.classList.add('visible');
    } else {
      img.classList.remove('visible');
    }
  });
  
  
  return (
    <HomePage title={pageTitle}> 
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content="Cart page" />
    </Helmet>
        {/* <div>
            <img src='homeB.png' className="w-100">
            </img>
          </div> */}
      <div className="container position-relative">
        
        {/* Section 1: สามฤดู */}
        <div className="row mb-4">
          <div>
            <div className="position-relative rueduurow">
              <p className="headrueduu">สามฤดู</p>
              <div className="d-flex">
                <p className="paragarphone"><span className="dropcap">
                  </span>สินค้าผลไม้แปรรูปจากผลไม้ตามฤดูกาลสามฤดู ได้แก่ ฤดูร้อน ฤดูฝนและฤดูหนาว
                  ด้วยการคัดสรรคุณภาพเพื่อรักษาคุณค่าทางโภชนาการและรสชาติให้คงอยู่
                  พร้อมให้ข้อมูลเพื่อช่วยให้ผู้บริโภคเลือกผลไม้แปรรูปที่ดีที่สุดสำหรับสุขภาพในแต่ละฤดูกาล
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-start p-3 btntolink">
              <Link to='/productMain' className="nav-link">
                <button
                  className="btn buybtn"
                //D8BABD
                >
                  <h5 className="mt-2 mx-4">
                    สั่งซื้อเลย
                  </h5>
                </button>
                <img
                  src="arrowLink.png"
                  className="arrowLink"
                  alt=""
                >
                </img>
              </Link>
            </div>
          </div>
          {/* <Slider
            images={imagesSlider1}
            width={100}
            height={50}
            quantity={10}
          /> */}
          <Slider
            images={imagesSlider2}
            width={200}
            height={200}
            quantity={9}
            reverse={true}
          />
        </div>
        {/* รูปภาพอยู่นอก container */}
        <div className="fruit-frist">
          <img
            src="compofruit 1.png"
            alt="Fruit Image"
            className="fruit-frist-img"
          />
        </div>
      </div>
      {/* Section 2: คิมหันตฤดู */}
      <div className="row sunrow">
        <div className="container position-relative">
          <div className="">
            <div className="d-flex justify-content-end align-item-center" style={{ marginRight: '400px' }}>
              <img
                src="sunny.png"
                alt="Fruit Image"
                className="sunny-img"
              />
              <h1 className="headrueduusun">คิมหันตฤดู</h1>
            </div>
            <div className="text-sun">
              <p className="paragarphtwo"><span className="dropcap">
                ฤ</span>ดูที่มีอากาศร้อนจัด เหมาะสำหรับผลไม้ที่ให้ความสดชื่นและมีน้ำมาก เช่น
                มะม่วง สับปะรด และแตงโม ซึ่งช่วยเติมความชุ่มชื้นให้ร่างกายและให้พลังงาน
              </p>
            </div>
            <div className="fruit-second">
              <img
                src="18.png"
                alt="Fruit Image"
                className="fruit-second-img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: เหมันตฤดู */}
      <div className="row winterrow">
        <div className="container position-relative">
          <div className="">
            <div className="d-flex justify-content-end align-item-center" style={{ marginRight: '200px' }}>
              <h1 className="headrueduusnow">เหมันตฤดู</h1>
              <img
                src="winter.png"
                alt="Fruit Image"
                className="winter-img"
              />

            </div>

            <div className="fruit-third">
              <img
                src="17.png"
                alt="Fruit Image"
                className="fruit-third-img"
              /></div>
            <div className="text-snow">
              <p className="paragarphthree" ><span className="dropcap">
                ฤ</span>ดูหนาว เหมาะสำหรับผลไม้ที่ช่วยให้ร่างกาย
                อบอุ่นและมีสารอาหารบำรุงร่างกาย เช่น แอปเปิล ส้ม และกีวีซึ่งเต็มไปด้วยวิตามินซีที่ช่วยเสริมสร้าง
                ภูมิคุ้มกันในช่วงที่อากาศเย็นและการเจ็บป่วยต่างๆ
              </p>

            </div>
          </div>
        </div>
      </div>


      {/* Section 4: วสันตฤดู */}
      <div className="row rainrow">
        <div className="container position-relative">
          <div className="">
            <div className="d-flex justify-content-end align-item-center" style={{ marginRight: '400px' }}>
              <img
                src="rainy.png"
                alt="Fruit Image"
                className="rainny-img"
              />
              <h1 className="headrueduurain">วสันตฤดู</h1>
            </div>
            <div className="text-rain">
              <p className="paragarphfour"><span className="dropcap">
                ฤ</span>ดูที่มีฝนตกหนักและอากาศชื้น เหมาะสำหรับผลไม้ที่มีคุณสมบัติช่วยเสริมภูมิคุ้มกัน
                และต้านทานโรค เช่น ลิ้นจี่ ขนุน และทับทิม ซึ่งมีสารต้านอนุมูลอิสระและวิตามินที่ช่วย
                เสริมสร้างความแข็งแรงให้ร่างกาย
                <button id="scrollToTopBtn" className="ms-5 btn scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <i class="text-color bi bi-arrow-up-circle-fill fs-1"></i><span className="ms-3 text-color">กลับไปด้านบน</span>
                </button>
              </p>
              
            </div>
            <div className="fruit-fouth">
              <img
                src="19.png"
                alt="Fruit Image"
                className="fruit-fouth-img"
              />
            </div>
          </div>
        </div>
      </div>
    </HomePage>
  );
}

export default Home;