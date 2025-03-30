import { useEffect, useRef, useState } from "react";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../config";

function Product() {
    const [product, setProduct] = useState({});
    const [seasons, setSeasons] = useState([]);
    const [products, setProducts] = useState([]);
    const [imgs, setImgs] = useState([]);
    const [fileExcel, setFileExcel] = useState({});
    const refImg = useRef();
    const refImg2 = useRef();
    const refImg3 = useRef();
    const [img1, setImg1] = useState(null); 
    const [img2, setImg2] = useState(null); 
    const [img3, setImg3] = useState(null); 
    const refImg1 = useRef();
    const refExcel = useRef();
    const [imgsToDelete, setImgsToDelete] = useState([]); 
    const [isVisible, setIsVisible] = useState(true); // กำหนดสถานะว่าแสดงผลอยู่หรือไม่

    useEffect(() => {
        // เมื่อเปิด modal ให้ตั้งค่า seasons ตาม product.seasons
        if (product.seasons && Array.isArray(product.seasons)) {
            setSeasons(product.seasons);
        }
    }, [product]);
    
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
    
        // ถ้าคลิกเลือก checkbox
        setSeasons((prevSeasons) => {
            if (checked) {
                return [...prevSeasons, value]; // เพิ่มค่าฤดูที่เลือก
            } else {
                return prevSeasons.filter((season) => season !== value); // เอาฤดูที่ไม่เลือกออก
            }
        });
    };
      

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());
            if (res.data.result !== undefined) {
                setProducts(res.data.result);
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('time interval is running');
            if (isVisible) {
                fetchData(); // เรียก fetchData ถ้าหน้ากำลังมองเห็น
            }
        }, 1000); // เรียกทุก 1 วินาที

        // ตรวจสอบเมื่อหน้าเว็บไม่ได้มองเห็น
        const handleVisibilityChange = () => {
            setIsVisible(document.visibilityState === 'visible');
        };

        // ตั้งค่า event listener สำหรับ visibilitychange
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval); // ทำความสะอาดเมื่อ component ถูก unmount
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isVisible]); // ขึ้นกับการเปลี่ยนแปลงของ isVisible

    const fetchData1 = async() => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());

            if (res.data.result !== undefined){
                setProducts(res.data.result);
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                text: error.message,
                icon: 'error'
            })
        }
    }
    
    const handleRemoveImage = async (item, imgToRemove) => {
        item.imgs = item.imgs.filter((img) => img !== imgToRemove);
        setProduct({ ...item });
        try {
            const response = await axios.delete(config.apiPath + '/product/remove-image', {
                
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    productId: item.id,
                    imgToRemove: imgToRemove,
                }
            });
           

            if (response.data.message === 'success') {
                item.imgs = item.imgs.filter((img) => img !== imgToRemove);
                setProduct({ ...item }); // อัปเดต state ของ product
            } else {
                console.error('Failed to remove image');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    // const handleSave = async () => {
    //     try {
    //         const uploadedImages = await handleUpload();
    //         product.imgs = uploadedImages; 
    
    //         product.cost = parseInt(product.cost);
    //         product.price = parseInt(product.price);
    //         product.stock = parseInt(product.stock);
    //         product.season = season;
           
    
    //         let res;
    
    //         if (product.id === undefined) {
    //             res = await axios.post(config.apiPath + '/product/create', product, config.headers());
    //         } else {
    //             res = await axios.put(config.apiPath + '/product/update', product, config.headers());
    //         }
    
    //         if (res.data.message === 'success') {
    //             Swal.fire({
    //                 title: 'save',
    //                 text: 'success',
    //                 icon: 'success',
    //                 timer: 500,
    //             });
    //             document.getElementById('modalProduct_btnClose').click();
    //             fetchData();
    //         }
    //     } catch (error) {
    //         Swal.fire({
    //             title: 'error',
    //             text: error.message,
    //             icon: 'error',
    //         });
    //     }
    // };

    const handleSave1 = async () => { 
        try {
            // เช็คค่าของ product และ season ก่อน
            console.log('Product Data Before Save:', product);
            console.log('Selected Seasons:', seasons);
            
            // อัพโหลดภาพและเก็บในตัวแปร
            const uploadedImages = await handleUpload();
            product.imgs = uploadedImages;
    
            // แปลงค่า cost, price, stock เป็นตัวเลข
            product.cost = parseInt(product.cost);
            product.price = parseInt(product.price);
            product.stock = parseInt(product.stock);
    
            // เพิ่มฤดูกาลที่เลือกลงใน product
            product.seasons = seasons; // season เป็น array ของฤดูกาลที่เลือกจาก checkbox
    
            // เช็คค่าหลังจากเพิ่ม season
            console.log('Product Data After Adding Seasons:', product);
    
            let res;
    
            // เช็คว่า product.id มีค่าหรือไม่ แล้วเลือกการใช้ POST หรือ PUT
            if (product.id === undefined) {
                res = await axios.post(config.apiPath + '/product/create', product, config.headers());
            } else {
                res = await axios.put(config.apiPath + '/product/update', product, config.headers());
            }
    
            // ถ้าส่งข้อมูลสำเร็จ
            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'save',
                    text: 'success',
                    icon: 'success',
                    timer: 500,
                });
                document.getElementById('modalProduct_btnClose').click(); // ปิด modal
                fetchData(); // โหลดข้อมูลใหม่
            }
        } catch (error) {
            Swal.fire({
                title: 'error',
                text: error.message,
                icon: 'error',
            });
        }
    };
    
    const handleSave = async () => { 
    try {
        // เช็คค่าของ product และ season ก่อน
        console.log('Product Data Before Save:', product);
        console.log('Selected Seasons:', seasons);

        // ตรวจสอบว่ามีการเลือกฤดูกาลหรือไม่
        if (seasons.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'กรุณาเลือกฤดูกาล',
                icon: 'error',
            });
            return;
        }

        // อัพโหลดภาพและเก็บในตัวแปร
        const uploadedImages = await handleUpload();
        product.imgs = uploadedImages;

        // แปลงค่า cost, price, stock เป็นตัวเลข
        product.cost = parseInt(product.cost);
        product.price = parseInt(product.price);
        product.stock = parseInt(product.stock);

        // เพิ่มฤดูกาลที่เลือกลงใน product
        product.seasons = seasons; // season เป็น array ของฤดูกาลที่เลือกจาก checkbox

        // เช็คค่าหลังจากเพิ่ม season
        console.log('Product Data After Adding Seasons:', product);

        let res;

        // เช็คว่า product.id มีค่าหรือไม่ แล้วเลือกการใช้ POST หรือ PUT
        if (product.id === undefined) {
            res = await axios.post(config.apiPath + '/product/create', product, config.headers());
        } else {
            res = await axios.put(config.apiPath + '/product/update', product, config.headers());
        }

        // ถ้าส่งข้อมูลสำเร็จ
        if (res.data.message === 'success') {
            Swal.fire({
                title: 'บันทึกสำเร็จ',
                text: 'ข้อมูลได้รับการบันทึกเรียบร้อยแล้ว',
                icon: 'success',
                timer: 500,
            });
            document.getElementById('modalProduct_btnClose').click(); // ปิด modal
            fetchData(); // โหลดข้อมูลใหม่
        }
    } catch (error) {
        Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: error.message,
            icon: 'error',
        });
    }
};


    const clearForm = () => {
        setProduct({
            name: '',
            price: '',
            cost: '',
            stock: '',
            seasons: [],
            toppic1: '',
            toppic2: '',
            toppic3: '',
            detail1: '',
            detail2: '',
            detail3: ''
        });
        setImgs([]); 
        refImg.current.value = ""; 
        refImg1.current.value = ''; 
        refImg2.current.value = ''; 
        refImg3.current.value = '';
    };
    

    const handleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                title: "remove",
                text: "remove item",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true
            })
            if(button.isConfirmed){
                const res = await axios.delete(config.apiPath + '/product/remove/' + item.id, config.headers());
                if (res.data.message === "success"){
                    Swal.fire({
                        title: "remove",
                        text: "remove success",
                        icon: "success",
                        timer: 1000
                    })
                    fetchData();
                }
            }
        } catch (error) {
            Swal.fire({
                title: "error",
                text: error.messsage,
                icon: "error"
            })
        }
    }

    const selectedFilesMain = (inputFiles) => {
        if (inputFiles.length > 0) {
            setImgs([...imgs, ...Array.from(inputFiles)]);
        }
    };


    const handleUpload = async () => {
        try {
            const uploadedImages = [];
    
            for (let img of imgs) {
                const formData = new FormData();
                formData.append('img', img);
    
                const res = await axios.post(config.apiPath + '/product/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token'),
                    },
                });
    
                if (res.data.newName !== undefined) {
                    uploadedImages.push(res.data.newName);
                }
            }
    
            return uploadedImages; // คืนค่าชื่อไฟล์ทั้งหมด
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error',
            });
            return [];
        }
    };
    
    const showImage = (item) => {
        if (item.imgs && item.imgs.length > 0) {
            return (
                <div className="d-flex flex-wrap">
                    {item.imgs.map((img, index) => (
                        <div
                            key={index}
                            className="position-relative mr-2 mb-2"
                            style={{ width: '100px', height: '100px' }}
                        >
                            <img
                                src={`${config.apiPath}/uploads/${img}`} // ใส่พาธสมบูรณ์
                                alt={`product-${item.id}-${index}`}
                                className="rounded-img"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute"
                                style={{ top: '5px', right: '5px' }}
                                onClick={() => handleRemoveImage(item, img)} // เพิ่มฟังก์ชันสำหรับลบรูป
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            );
        }
        return <span>กรุณาอัพโหลดรูปภาพ</span>;
    };

    function showImage1(product, setProduct) {
        if (product.img1) {
            return (
                <div>
                    <img
                        src={`${config.apiPath}/uploads/${product.img1}`}
                        alt="description-image"
                        className="img-thumbnail"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <button
                        type="button"
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => {
                            setProduct({ ...product, img1: null });
                        }}
                    >
                        ลบรูปภาพ
                    </button>
                </div>
            );
        }
        return <span>กรุณาอัพโหลดรูปภาพ</span>;
    }
    function showImage2(product, setProduct) {
        if (product.img2) {
            return (
                <div>
                    <img
                        src={`${config.apiPath}/uploads/${product.img2}`}
                        alt="description-image"
                        className="img-thumbnail"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <button
                        type="button"
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => {
                            setProduct({ ...product, img2: null });
                        }}
                    >
                        ลบรูปภาพ
                    </button>
                </div>
            );
        }
        return <span>กรุณาอัพโหลดรูปภาพ</span>;
    }
    function showImage3(product, setProduct) {
        if (product.img3) {
            return (
                <div>
                    <img
                        src={`${config.apiPath}/uploads/${product.img3}`}
                        alt="description-image"
                        className="img-thumbnail"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <button
                        type="button"
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => {
                            setProduct({ ...product, img3: null });
                        }}
                    >
                        ลบรูปภาพ
                    </button>
                </div>
            );
        }
        return <span>กรุณาอัพโหลดรูปภาพ</span>;
    }
    
    const selectedFileExcel = (fileInput) => {
        if (fileInput !== undefined) {
            if (fileInput.length > 0){
                setFileExcel(fileInput[0]);
            }
        }
    }

    const handleUploadExcel = async () => {
        try {
            const formData = new FormData();
            formData.append('fileExcel', fileExcel);

            const res = await axios.post(config.apiPath + '/product/uploadFromExcel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (res.data.message === 'success') {
                Swal.fire({
                    title: 'upload file',
                    text: 'upload success',
                    icon: 'success',
                    timer: 1000
                });
                fetchData();

                document.getElementById('modalExcel_btnClose').click();
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const clearFormExcel = () => {
        refExcel.current.value = '';
        setFileExcel(null);
    }

    const selectedFileDescriptionImage1 = (inputFiles) => {
        if (inputFiles.length > 0) {
            setImg1(inputFiles[0]); // เก็บไฟล์ที่เลือกจาก input
        }
    };
    const selectedFileDescriptionImage2 = (inputFiles) => {
        if (inputFiles.length > 0) {
            setImg2(inputFiles[0]); // เก็บไฟล์ที่เลือกจาก input
        }
    };
    const selectedFileDescriptionImage3 = (inputFiles) => {
        if (inputFiles.length > 0) {
            setImg3(inputFiles[0]); // เก็บไฟล์ที่เลือกจาก input
        }
    };

    const handleUploadDescriptionImage1 = async () => {
        if (img1) {
            try {
                const formData = new FormData();
                formData.append('img', img1);

                const res = await axios.post(config.apiPath + '/product/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token'),
                    },
                });

                if (res.data.newName) {
                    // หากการอัปโหลดสำเร็จ ให้เก็บชื่อไฟล์ใน product
                    setProduct({
                        ...product,
                        img1: res.data.newName, // เก็บชื่อไฟล์ที่อัปโหลด
                    });
                    Swal.fire({
                        title: 'Success',
                        text: 'Image uploaded successfully!',
                        icon: 'success',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                });
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No image selected!',
                icon: 'error',
            });
        }
    };
    const handleUploadDescriptionImage2 = async () => {
        if (img2) {
            try {
                const formData = new FormData();
                formData.append('img', img2);

                const res = await axios.post(config.apiPath + '/product/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token'),
                    },
                });

                if (res.data.newName) {
                    // หากการอัปโหลดสำเร็จ ให้เก็บชื่อไฟล์ใน product
                    setProduct({
                        ...product,
                        img2: res.data.newName, // เก็บชื่อไฟล์ที่อัปโหลด
                    });
                    Swal.fire({
                        title: 'Success',
                        text: 'Image uploaded successfully!',
                        icon: 'success',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                });
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No image selected!',
                icon: 'error',
            });
        }
    };
    const handleUploadDescriptionImage3 = async () => {
        if (img3) {
            try {
                const formData = new FormData();
                formData.append('img', img3);

                const res = await axios.post(config.apiPath + '/product/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': localStorage.getItem('token'),
                    },
                });

                if (res.data.newName) {
                    // หากการอัปโหลดสำเร็จ ให้เก็บชื่อไฟล์ใน product
                    setProduct({
                        ...product,
                        img3: res.data.newName, // เก็บชื่อไฟล์ที่อัปโหลด
                    });
                    Swal.fire({
                        title: 'Success',
                        text: 'Image uploaded successfully!',
                        icon: 'success',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                });
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No image selected!',
                icon: 'error',
            });
        }
    };
    
    return<BackOffice>
      
        <div className="h1 pl-3" style={{ color: '#5A0D6C' }}>สินค้า</div>
        <div className="container">
            <div className="d-flex justify-content-end">
                <button onClick={clearForm} className="d-flex btn ms-3 rounded-pill mx-2" style={{backgroundColor: "#5B166C"}} data-toggle="modal" data-target="#modalProduct">
                    <i className="fa fa-plus mt-2 text-white"></i><h6 className="mt-2 mx-3 text-white">เพิ่มสินค้า</h6>
                </button>
                {/* <button onClick={clearFormExcel} className="d-flex btn ms-3 rounded-pill" style={{backgroundColor: "#5B166C"}} data-toggle="modal" data-target="#modalExcel">
                    <i className="fa fa-arrow-down mt-2 text-white"></i><h6 className="mt-2 mx-3 text-white">เพิ่มสินค้าด้วยไฟล์ Excel</h6>
                </button> */}
            </div>
        </div>
            
        <MyModal id="modalProduct" title="เพิ่มสินค้า">
            <div className="mt-3" >
                {showImage(product)}
            <h5 className="text-custom">รูปภาพหลัก</h5>
                <input
                    className="form-control"
                    type="file"
                    multiple
                    ref={refImg}
                    onChange={(e) => selectedFilesMain(e.target.files)}
                />
            </div>

            <div>
                <h5 className="text-custom">ชื่อสินค้า</h5>
                    <input 
                    value={product.name} 
                    className="form-control text-custom" 
                    onChange={e => setProduct({ ...product, name: e.target.value})}>
                    </input>
            </div>
            {/* <div> 
            <h5 className="text-custom">ฤดูกาล</h5>
            <div>
                <label>
                <input
                    type="checkbox"
                    value="summer"
                    checked={seasons.includes("summer")}
                    onChange={handleCheckboxChange}
                />
                ฤดูร้อน
                </label>
                <label>
                <input
                    type="checkbox"
                    value="winter"
                    checked={seasons.includes("winter")}
                    onChange={handleCheckboxChange}
                />
                ฤดูหนาว
                </label>
                <label>
                <input
                    type="checkbox"
                    value="rainy"
                    checked={seasons.includes("rainy")}
                    onChange={handleCheckboxChange}
                />
                ฤดูฝน
                </label>
            </div>
            </div> */}

            <div className="mt-3">
                <h5 className="text-custom">ราคาทุน</h5>
                    <input 
                    value={product.cost} 
                    className="form-control"
                    onChange={e => setProduct({ ...product, cost: e.target.value})}>
                    </input>
            </div>
            <div className="mt-3">
                <h5 className="text-custom">ราคาขาย</h5>
                    <input 
                    value={product.price} 
                    className="form-control" 
                    onChange={e => setProduct({ ...product, price: e.target.value})}>
                    </input>
            </div>
            <div className="mt-3">
                <h5 className="text-custom">จำนวนในคลัง</h5>
                    <input 
                    value={product.stock} 
                    className="form-control" 
                    onChange={e => setProduct({ ...product, stock: e.target.value})}>
                    </input>
            </div>
            
            <div className="mt-3">
                    <h5 className="text-custom">ส่วนที่ 1</h5>
                </div>
             <div className="d-flex justify-content-between mt-3">        
                <div style={{ flex: 1, marginRight: '10px' }}>
                <h5 className="text-custom">หัวข้อส่วนที่ 1</h5>
                    <textarea 
                        rows="1"
                        value={product.toppic1} 
                        className="form-control"
                        onChange={e => setProduct({ ...product, toppic1: e.target.value})}
                        />
                    <h5 className="text-custom">คำบรรยายส่วนที่ 1</h5>
                    <textarea 
                        rows="4"
                        value={product.detail1} 
                        className="form-control"
                        onChange={e => setProduct({ ...product, detail1: e.target.value})}
                        />                       
                </div>

                <div className="ml-3">
                    <h5 className="text-custom">รูปภาพบรรยายส่วนที่ 1</h5>
                    {showImage1(product, setProduct)}
                        <input
                        className="form-control"
                        type="file"
                        ref={refImg1}
                        onChange={(e) => selectedFileDescriptionImage1(e.target.files)}
                    />
                    <button className="btn btn-primary mt-3" 
                    onClick={handleUploadDescriptionImage1}
                    >
                        อัปโหลดรูปภาพบรรยายส่วนที่ 1
                    </button>
                </div>
            </div> 
            <div className="mt-3">
                    <h5 className="text-custom">ส่วนที่ 2</h5>
                </div>
             <div className="d-flex justify-content-between mt-3">        
                <div className="ml-3">
                    <h5 className="text-custom">รูปภาพบรรยายส่วนที่ 2</h5>
                    {showImage2(product, setProduct)}
                        <input
                        className="form-control"
                        type="file"
                        ref={refImg2}
                        onChange={(e) => selectedFileDescriptionImage2(e.target.files)}
                    />
                    <button className="btn btn-primary mt-3" 
                    onClick={handleUploadDescriptionImage2}
                    >
                        อัปโหลดรูปภาพบรรยายส่วนที่ 2
                    </button>
                </div>
                <div style={{ flex: 1, marginLeft: '20px' }}>
                    <h5 className="text-custom">หัวข้อส่วนที่ 2</h5>
                        <textarea 
                            rows="1"
                            value={product.toppic2} 
                            className="form-control"
                            onChange={e => setProduct({ ...product, toppic2: e.target.value})}
                            />
                    <h5 className="text-custom">คำบรรยายส่วนที่ 2</h5>
                    <textarea 
                        rows="4"
                        value={product.detail2} 
                        className="form-control"
                        onChange={e => setProduct({ ...product, detail2: e.target.value})}
                        />                       
                </div>
            </div>
            <div className="mt-3">
                    <h5 className="text-custom">ส่วนที่ 3</h5>
                </div>
             <div className="d-flex justify-content-between mt-3">        
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <h5 className="text-custom">หัวข้อส่วนที่ 3</h5>
                        <textarea 
                            rows="1"
                            value={product.toppic3} 
                            className="form-control"
                            onChange={e => setProduct({ ...product, toppic3: e.target.value})}
                            />
                    <h5 className="text-custom">คำบรรยายส่วนที่ 3</h5>
                    <textarea 
                        rows="4"
                        value={product.detail3} 
                        className="form-control"
                        onChange={e => setProduct({ ...product, detail3: e.target.value})}
                        />                       
                </div>

                <div className="ml-3">
                    <h5 className="text-custom">รูปภาพบรรยายส่วนที่ 3</h5>
                    {showImage3(product, setProduct)}
                        <input
                        className="form-control"
                        type="file"
                        ref={refImg3}
                        onChange={(e) => selectedFileDescriptionImage3(e.target.files)}
                    />
                    <button className="btn btn-primary mt-3" 
                    onClick={handleUploadDescriptionImage3}
                    >
                        อัปโหลดรูปภาพบรรยาย3
                    </button>
                </div>
            </div>    
            <div> 
            <h5 className="text-custom">ฤดูกาล</h5>
            <div>
                
                <label className="m-2">
                <input
                    type="checkbox"
                    value="คิมหันตฤดู"
                    checked={seasons.includes("คิมหันตฤดู")}
                    onChange={handleCheckboxChange}
                />
                <span className="text-custom m-2">คิมหันตฤดู(ฤดูร้อน)</span>
                </label>
                <label className="m-2">
                <input
                    type="checkbox"
                    value="เหมันตฤดู"
                    checked={seasons.includes("เหมันตฤดู")}
                    onChange={handleCheckboxChange}
                />
                <span className="text-custom m-2">เหมันตฤดู(ฤดูหนาว)</span>
                </label>
                <label className="m-2">
                <input
                    type="checkbox"
                    value="วสันตฤดู"
                    checked={seasons.includes("วสันตฤดู")}
                    onChange={handleCheckboxChange}
                />
                <span className="text-custom m-2">วสันตฤดู(ฤดูฝน)</span>
                </label>
            </div>
            </div> 
            <div className="mt-3">
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="fa fa-check mr-2"></i>save
                </button>
            </div>
        </MyModal>
        <div className="pl-3">
                <table className="mt-3 table-bordered table-striped">
                    <thead>
                        <tr>
                            <th className="p-2 text-center">รูปภาพสินค้า</th>
                            <th className="text-center">ชื่อสินค้า</th>
                            <th width="150px" className="text-center">ราคาต้นทุน</th>
                            <th width="150px" className="text-center">ราคาขาย</th>
                            <th width="150px" className="text-center">จำนวนในคลัง</th>
                            <th width="200px" className="text-center">จัดการสินค้า</th>
                        </tr>
                    </thead>
                    <tbody>
                    {products.length > 0 ? products.map(item =>
                        <tr key={item.id}>
                            <td className="p-2">{showImage(item)}</td>
                            <td className="text-center">{item.name}</td>
                            <td className="text-center">{item.cost}</td>
                            <td className="text-center">{item.price}</td>
                            <td className="text-center">{item.stock}</td>
                            <td className="text-center">
                                <button className="btn btn-primary mr-2" 
                                        data-toggle="modal" 
                                        data-target="#modalProduct" 
                                        onClick={() => {
                                            setProduct(item);
                                            setImgs([]);
                                            refImg.current.value = "";
                                            refImg1.current.value = ''; 
                                            refImg2.current.value = ''; 
                                            refImg3.current.value = '';
                                            setProduct({
                                                ...item,
                                                toppic1: item.toppic1 || '',
                                                toppic2: item.toppic1 || '',
                                                toppic3: item.toppic1 || '',
                                                detail1: item.detail1 || '', 
                                                detail2: item.detail2 || '',
                                                detail3: item.detail3 || '',
                                                seasons: item.seasons || [],
                                            });
                                            }
                                        }>
                                    <i className="fa fa-edit"></i> แก้ไข
                                </button>
                                <button className="btn btn-danger" onClick={() => handleRemove(item)}>
                                    <i className="fa fa-times"></i> ลบ
                                </button>
                            </td>
                        </tr>
                    ) : <tr><td colSpan="5" className="text-center text-muted">
                    <i className="bi bi-arrow-repeat me-2"></i> กำลังโหลด...
                </td>
                </tr>}
                    </tbody>
                </table>
            <MyModal id="modalExcel" title="เลือกไฟล์">
                    <div>เลือกไฟล์</div>
                    <input className="form-control" type="file" ref={refExcel} onChange={e => selectedFileExcel(e.target.files)}></input>
                    <button className="mt-3 btn btn-primary" onClick={handleUploadExcel}>
                        <i className="fa fa-check mr-2"></i>Save
                    </button>
            </MyModal>
        </div>
        
    </BackOffice>
}

export default Product;