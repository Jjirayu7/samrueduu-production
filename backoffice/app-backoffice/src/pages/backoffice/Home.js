import BackOffice from "../../components/BackOffice";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import config from "../../config";  
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

function Home() {
    const refImg = useRef();
    const [imgs, setImgs] = useState([]);
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await axios.get(`${config.apiPath}/media/banner`);
            setBanners(res.data);
            console.error("asasas", res.data);
        } catch (e) {
            console.error("Error fetching banners:", e);
        }
    };

    const deleteBanner = async (id) => {
        try {
            await axios.delete(`${config.apiPath}/media/banner/${id}`);
            Swal.fire("Deleted!", "Banner has been deleted.", "success");
            fetchBanners(); // โหลดข้อมูลใหม่
        } catch (e) {
            Swal.fire("Error", e.message, "error");
        }
    };

    const selectedFilesMain = (inputFiles) => {
        if (inputFiles.length > 0) {
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            const filteredFiles = Array.from(inputFiles).filter(file => 
                allowedTypes.includes(file.type)
            );

            if (filteredFiles.length === 0) {
                Swal.fire({
                    title: "ไฟล์ไม่ถูกต้อง",
                    text: "กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPEG, PNG, GIF)",
                    icon: "warning",
                });
                return;
            }

            setImgs(prevImgs => [...prevImgs, ...filteredFiles]);
        }
    };

    // const handleUpload = async () => {
    //     try {
    //         const uploadedImages = [];

    //         for (let img of imgs) {
    //             const formData = new FormData();
    //             formData.append("img", img);

    //             const res = await axios.post(config.apiPath + "/media/banner/upload", formData, {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                     "Authorization": localStorage.getItem("token"),
    //                 },
    //             });

    //             if (res.data.newName) {
    //                 uploadedImages.push(res.data.newName);
    //             }
    //         }

    //         Swal.fire({
    //             title: "อัปโหลดสำเร็จ",
    //             text: `อัปโหลดไฟล์ ${uploadedImages.length} รายการเรียบร้อย`,
    //             icon: "success",
    //         });

    //         setImgs([]); // ล้างรายการหลังอัปโหลดเสร็จ
    //         return uploadedImages;
    //     } catch (e) {
    //         Swal.fire({
    //             title: "เกิดข้อผิดพลาด",
    //             text: e.message,
    //             icon: "error",
    //         });
    //         return [];
    //     }
    // };

    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (isUploading) return; // ป้องกันการกดซ้ำ
        setIsUploading(true); // ตั้งสถานะให้อยู่ระหว่างอัปโหลด

        try {
            const uploadPromises = imgs.map(async (img) => {
                const formData = new FormData();
                formData.append("img", img);

                const res = await axios.post(`${config.apiPath}/media/banner/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": localStorage.getItem("token"),
                    },
                });

                return res.data.newName; // คืนค่าเฉพาะชื่อไฟล์ใหม่
            });

            const uploadedImages = await Promise.all(uploadPromises); // อัปโหลดทั้งหมดพร้อมกัน

            Swal.fire({
                title: "อัปโหลดสำเร็จ",
                text: `อัปโหลดไฟล์ ${uploadedImages.length} รายการเรียบร้อย`,
                icon: "success",
            });

            setImgs([]); // ล้างรายการรูปหลังอัปโหลดเสร็จ
            return uploadedImages.filter(Boolean); // กรองค่า null หรือ undefined ออก
        } catch (e) {
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: e.message,
                icon: "error",
            });
            return [];
        } finally {
            setIsUploading(false); // รีเซ็ตสถานะ
        }
    };


    return (
        <BackOffice>
            <div className="container mt-5">
                <div className="row text-center mb-4">
                    <div className="col-md-4">
                        <Link to="/dashboard" className="btn-menu">
                            <i className="bi bi-bar-chart icon-menu"></i> {/* ไอคอน Dashboard */}
                            <span>แดชบอร์ด</span>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to="/product" className="btn-menu">
                            <i className="bi bi-box icon-menu"></i> {/* ไอคอน สินค้า */}
                            <span>สินค้า</span>
                        </Link>
                    </div>
                    <div className="col-md-4">
                        <Link to="/billSale" className="btn-menu">
                            <i className="bi bi-list icon-menu"></i> {/* ไอคอน รายงานยอดขาย */}
                            <span>รายงานยอดขาย</span>
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <h4 className="text-custom my-3">รูปภาพแบนเนอร์</h4>
                        {banners.map((banner) => (
                            <div className="col-md-12" key={banner.id}>
                                <div className="card">
                                    <img src={`${config.apiPath}${banner.src}`} className="card-img-top" alt="Banner" />
                                    <div className="card-body text-center">
                                        <button className="btn btn-danger" onClick={() => deleteBanner(banner.id)}>ลบ</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    <div className="col-md-6">
                        <h4 className="text-custom my-3">อัปโหลดรูปภาพแบนเนอร์</h4>    
                            <input
                                className="form-control"
                                type="file"
                                multiple
                                ref={refImg}
                                onChange={(e) => selectedFilesMain(e.target.files)}
                            />

                            <div className="mt-3">
                                <h6>รูปที่เลือก:</h6>
                                <div className="d-flex flex-wrap">
                                    {imgs.map((img, index) => (
                                        <div key={index} className="me-2 mb-2">
                                            <img 
                                                src={URL.createObjectURL(img)} 
                                                alt={`Preview ${index}`}
                                                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {imgs.length > 0 && (
                                <button 
                                    className="btn btn-primary mt-3" 
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    
                                >
                                    {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>    
        </BackOffice>
    );
}

export default Home;
