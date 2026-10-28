import BackOffice from "../components/BackOffice";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import dayjs from "dayjs";
import MyModal from "./MyModal";

function BillSale() {
    const [billSales, setBillSeles] = useState([]);
    const [billSaleDetail, setBillSelesDetail] = useState([]);
    const [sumPrice, setSumPrice] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedOrderId, setSelectedOrderId] = useState(null);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + "/api/sale/list", config.headers());

            if (res.data.results !== undefined) {
                setBillSeles(res.data.results);
            }
        } catch (e) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };

    const openModalInfo = async (item) => {
        try {
            setSelectedOrderId(item.order_id);

            const res = await axios.get(config.apiPath + "/api/sale/billInfo/" + item.id, config.headers());

            if (res.data.results !== undefined) {
                setBillSelesDetail(res.data.results);

                let mySumPrice = 0;
                for (let i = 0; i < res.data.results.length; i++) {
                    mySumPrice += parseInt(res.data.results[i].price);
                }

                setSumPrice(mySumPrice);
                setModalCustomerData({
                    fullname: item.fullname,
                    phone: item.phone,
                    address: item.address,
                    details: res.data.results  // ข้อมูลรายการสินค้า
                });
            }
        } catch (e) {
            Swal.fire({
                title: "error",
                text: e.message,
                icon: "error",
            });
        }
    };

    const handlePay = async (item) => {
        try {
            const button = await Swal.fire({
                title: "ชำระเงิน",
                text: "",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + "/api/sale/updateStatusToPay/" + item.id, config.headers());

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

    const handleSend = async (item) => {
        try {
            const button = await Swal.fire({
                title: "ส่งแล้ว",
                text: "",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + "/api/sale/updateStatusToSend/" + item.id, config.headers());

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

    const handleCancel = async (item) => {
        try {
            const button = await Swal.fire({
                title: "ยกเลิก",
                text: "",
                icon: "question",
                showCancelButton: true,
                showConfirmButton: true,
            });

            if (button.isConfirmed) {
                const res = await axios.get(config.apiPath + "/api/sale/updateStatusToCancel/" + item.id, config.headers());

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

    // กรองข้อมูลตามค่าค้นหาและสถานะ
    const filteredBillSales = billSales.filter((item) => {
        const matchesSearch = item.order_id.includes(searchTerm) || item.fullname.includes(searchTerm);
        const matchesStatus = filterStatus === "all" || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    const handleStatusChange = (item, newStatus) => {
        if (newStatus === "complete") {
            handlePay(item);
        } else if (newStatus === "shipped") {
            handleSend(item);
        } else if (newStatus === "cancel") {
            handleCancel(item);
        }
    };
    
    const [modalCustomerData, setModalCustomerData] = useState({
        fullname: '',
        phone: '',
        address: '',
        details: []  // เก็บข้อมูลของรายการสินค้าจาก billSaleDetail
    });

    return (
        // <BackOffice>
        //     <div className="card">
        //         <div className="card-header">
        //             <div className="card-title mt-4 mx-5">
        //                 <h5>รายงานยอดขาย</h5>
        //                 </div>
        //             <div className="d-flex justify-content-between mt-3">
        //                 <input
        //                     type="text"
        //                     placeholder="ค้นหาชื่อลูกค้าหรือหมายเลขคำสั่งซื้อ..."
        //                     value={searchTerm}
        //                     onChange={(e) => setSearchTerm(e.target.value)}
        //                     className="form-control w-50"
        //                 />
        //                 <select
        //                     value={filterStatus}
        //                     onChange={(e) => setFilterStatus(e.target.value)}
        //                     className="form-control w-25"
        //                 >
        //                     <option value="all">ทั้งหมด</option>
        //                     <option value="open">รอตรวจสอบ</option>
        //                     <option value="complete">ชำระเงินแล้ว</option>
        //                     <option value="pending">ชำระเงินปลายทาง</option>
        //                     <option value="shiped">ส่งแล้ว</option>
        //                     <option value="cancel">ยกเลิก</option>
        //                 </select>
        //             </div>
        //         </div>
        //         {/* <div className="card-body">
        //             <table className="table table-bordered table-striped">
        //                 <thead>
        //                     <th className="text-center">หมายเลขคำสั่งซื้อ</th>
        //                     <th className="text-center">ชื่อลูกค้า</th>
        //                     <th className="text-center">เบอร์โทร</th>
        //                     <th className="text-center">ที่อยู่</th>
        //                     <th className="text-center">วันที่</th>
        //                     <th className="text-center">เวลา</th>
        //                     <th className="text-center">สถานะสินค้า</th>
        //                     <th width="500px" className="text-center">จัดการสินค้า</th>
        //                 </thead>
        //                 <tbody>
        //                     {filteredBillSales.length > 0 ? filteredBillSales.map((item) => (
        //                         <tr key={item.id}>
        //                             <td className="text-center">{item.order_id}</td>
        //                             <td className="text-center">{item.fullname}</td>
        //                             <td className="text-center">{item.phone}</td>
        //                             <td className="text-center">{item.address}</td>
        //                             <td className="text-center">{dayjs(item.createdAt).format("YYYY-MM-DD")}</td>
        //                             <td className="text-center">{dayjs(item.createdAt).format("hh:mm A")}</td>
        //                             <td className="text-center">
        //                             {item.status === 'complete' ? 'ชำระเงินเสร็จสิ้น' : 
        //                             item.status === 'shiped' ? 'จัดส่งแล้ว' : 
        //                             item.status === 'cancel' ? 'ยกเลิก' :
        //                             item.status === 'open' ? 'รอตรวจสอบการชำระเงิน' : 
        //                             item.status === 'pending' ? 'รอชำระเงินปลายทาง' :
        //                             item.status}
        //                             </td>
        //                             <td className="text-center">
        //                                 <button
        //                                     className="btn btn-secondary mr-2 rounded-pill"
        //                                     data-toggle="modal"
        //                                     data-target="#modalInfo"
        //                                     onClick={(e) => openModalInfo(item)}
        //                                 >
        //                                     <i></i>รายการ
        //                                 </button>
        //                                 <button
        //                                     className="btn btn-secondary mr-2 rounded-pill"
        //                                     onClick={(e) => handlePay(item)}
        //                                 >
        //                                     <i></i>ชำเงินแล้ว
        //                                 </button>
        //                                 <button
        //                                     className="btn btn-secondary mr-2 rounded-pill"
        //                                     onClick={(e) => handleSend(item)}
        //                                 >
        //                                     <i></i>จัดส่งแล้ว
        //                                 </button>
        //                                 <button
        //                                     className="btn btn-secondary mr-2 rounded-pill"
        //                                     onClick={(e) => handleCancel(item)}
        //                                 >
        //                                     <i></i>ยกเลิก
        //                                 </button>
        //                             </td>
        //                         </tr>
        //                     )) : (
        //                         <tr>
        //                             <td colSpan={8} className="text-center">ไม่พบข้อมูล</td>
        //                         </tr>
        //                     )}
        //                 </tbody>
        //             </table>
        //         </div> */}
        //         <div className="card-body">
        //             <div className="table-responsive">
        //                 <table className="table table-bordered table-striped table-hover">
        //                     <thead className="bg-primary text-white text-center">
        //                         <tr>
        //                             <th width="200px">หมายเลขคำสั่งซื้อ</th>
        //                             <th>ชื่อลูกค้า</th>
        //                             <th>เบอร์โทร</th>
        //                             <th width="200px">ที่อยู่</th>
        //                             <th>วันที่</th>
        //                             <th>เวลา</th>
        //                             <th>สถานะสินค้า</th>
        //                             <th >จัดการสินค้า</th>
        //                         </tr>
        //                     </thead>
        //                     <tbody>
        //                         {filteredBillSales.length > 0 ? filteredBillSales.map((item) => (
        //                             <tr key={item.id} className="text-center">
        //                                 <td>{item.order_id}</td>
        //                                 <td>{item.fullname}</td>
        //                                 <td>{item.phone}</td>
        //                                 <td className="text-start">{item.address}</td>
        //                                 <td>{dayjs(item.createdAt).format("YYYY-MM-DD")}</td>
        //                                 <td>{dayjs(item.createdAt).format("hh:mm A")}</td>
        //                                 {/* <td>
        //                                     <span className={`badge ${item.status === 'complete' ? 'badge-success' :
        //                                         item.status === 'shiped' ? 'badge-info' :
        //                                         item.status === 'cancel' ? 'badge-danger' :
        //                                         item.status === 'open' ? 'badge-warning' :
        //                                         item.status === 'pending' ? 'badge-secondary' : 'badge-light'}`}>
        //                                         {item.status === 'complete' ? 'ชำระเงินเสร็จสิ้น' :
        //                                         item.status === 'shiped' ? 'จัดส่งแล้ว' :
        //                                         item.status === 'cancel' ? 'ยกเลิก' :
        //                                         item.status === 'open' ? 'รอตรวจสอบการชำระเงิน' :
        //                                         item.status === 'pending' ? 'รอชำระเงินปลายทาง' : item.status}
        //                                     </span>
        //                                 </td> */}
        //                                 <td>
        //                                     <select
        //                                         className="form-select"
        //                                         value={item.status}
        //                                         onChange={(e) => handleStatusChange(item, e.target.value)}
        //                                     >
        //                                         <option value="complete" className="text-success">✅ ชำระเงินเสร็จสิ้น</option>
        //                                         <option value="shiped" className="text-info">🚚 จัดส่งแล้ว</option>
        //                                         <option value="cancel" className="text-danger">❌ ยกเลิก</option>
        //                                         <option value="open" className="text-muted" disabled>⏳ รอตรวจสอบการชำระเงิน</option>
        //                                         <option value="pending" className="text-muted" disabled>💰 รอชำระเงินปลายทาง</option>
        //                                     </select>
        //                                 </td>

        //                                 <td>
        //                                     <button className="btn btn-info btn-sm mr-2" data-toggle="modal"
        //                                         data-target="#modalInfo" onClick={() => openModalInfo(item)}>
        //                                         <i className="bi bi-list-ul"></i> รายการ
        //                                     </button>
        //                                     {/* <button className="btn btn-success btn-sm mr-2" onClick={() => handlePay(item)}>
        //                                         <i className="bi bi-cash-stack"></i> ชำระเงินแล้ว
        //                                     </button>
        //                                     <button className="btn btn-primary btn-sm mr-2" onClick={() => handleSend(item)}>
        //                                         <i className="bi bi-truck"></i> จัดส่งแล้ว
        //                                     </button>
        //                                     <button className="btn btn-danger btn-sm" onClick={() => handleCancel(item)}>
        //                                         <i className="bi bi-x-circle"></i> ยกเลิก
        //                                     </button> */}
        //                                 </td>
        //                             </tr>
        //                         )) : (
        //                             <tr>
        //                                 <td colSpan={8} className="text-center text-danger">ไม่พบข้อมูล</td>
        //                             </tr>
        //                         )}
        //                     </tbody>
        //                 </table>
        //             </div>
        //         </div>

        //     </div>

        //     <MyModal id="modalInfo" title="รายการ">
        //         <table className="table table-bordered table-striped">
        //             <thead>
        //                 <tr>
        //                     <th>รายการ</th>
        //                     <th className="text-right">รหัสสินค้า</th>
        //                     <th className="text-right">ราคา</th>
        //                     <th className="text-right">จำนวน</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {billSaleDetail.length > 0 ? billSaleDetail.map((item) => (
        //                     <tr key={item.id}>
        //                         <td>{item.Product.name}</td>
        //                         <td className="text-right">{item.Product.id}</td>
        //                         <td className="text-right">{parseInt(item.price).toLocaleString("th-TH")}</td>
        //                         <td className="text-right">{item.qty}</td>
        //                     </tr>
        //                 )) : <></>}
        //             </tbody>
        //         </table>
        //         <div>ราคารวม {sumPrice.toLocaleString("th-th")} บาท</div>
        //     </MyModal>
        // </BackOffice>
        <BackOffice>
            <div className="card">
    <div className="card-header">
        <div className="card-title mt-4 mx-5">
            {/* <h5>รายงานยอดขาย</h5> */}
            <div className="h4 pl-3" style={{ color: '#5A0D6C' }}>รายงานยอดขาย</div>
        </div>
        <div className="d-flex justify-content-between mt-3">
            <input
                type="text"
                placeholder="ค้นหาชื่อลูกค้าหรือหมายเลขคำสั่งซื้อ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control w-50"
            />
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-control w-25"
            >
                <option value="all">ทั้งหมด</option>
                <option value="open">รอตรวจสอบ</option>
                <option value="complete">ชำระเงินแล้ว</option>
                <option value="pending">ชำระเงินปลายทาง</option>
                <option value="shiped">ส่งแล้ว</option>
                <option value="cancel">ยกเลิก</option>
            </select>
        </div>
    </div>
    <div className="card-body">
        <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
                <thead className="bg-primary text-white text-center">
                    <tr>
                        <th>หมายเลขคำสั่งซื้อ</th>
                        <th>ชื่อลูกค้า</th>
                        <th>เบอร์โทร</th>
                        <th style={{ width: '200px' }}>ที่อยู่</th>
                        <th>วันที่</th>
                        <th>เวลา</th>
                        <th>สถานะสินค้า</th>
                        <th>รายละเอียด</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBillSales.length > 0 ? filteredBillSales.map((item) => (
                        <tr key={item.id} className="text-center">
                            <td>{item.order_id}</td>
                            <td>{item.fullname}</td>
                            <td>{item.phone}</td>
                            <td className="text-start">{item.address}</td>
                            <td>{dayjs(item.createdAt).format("YYYY-MM-DD")}</td>
                            <td>{dayjs(item.createdAt).format("hh:mm A")}</td>
                            <td>
                                <select
                                    className="form-select"
                                    value={item.status}
                                    onChange={(e) => handleStatusChange(item, e.target.value)}
                                >
                                    <option value="complete" className="text-success">✅ ชำระเงินเสร็จสิ้น</option>
                                    <option value="shiped" className="text-info">🚚 จัดส่งแล้ว</option>
                                    <option value="cancel" className="text-danger">❌ ยกเลิก</option>
                                    <option value="open" className="text-muted" disabled>⏳ รอตรวจสอบการชำระเงิน</option>
                                    <option value="pending" className="text-muted" disabled>💰 รอชำระเงินปลายทาง</option>
                                </select>
                            </td>

                            <td>
                                <button 
                                className={`btn btn-sm mr-2 ${selectedOrderId === item.order_id ? 'btn-warning' : 'btn-info'}`} 
                                data-toggle="modal" 
                                data-target="#modalInfo" 
                                onClick={() => openModalInfo(item)}
                                    >
                                    <i className="bi bi-list-ul"></i> แสดงข้อมูล
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={8} className="text-center text-danger">ไม่พบข้อมูล</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
</div>

{/* <MyModal id="modalInfo" title="รายการ">
    <div>
        <h5>ข้อมูลลูกค้า</h5>
        <p><strong>ชื่อลูกค้า:</strong> {modalCustomerData.fullname}</p>
        <p><strong>เบอร์โทร:</strong> {modalCustomerData.phone}</p>
        <p><strong>ที่อยู่:</strong> {modalCustomerData.address}</p>
    </div>
    <table className="table table-bordered table-striped">
        <thead>
            <tr>
                <th>รายการ</th>
                <th className="text-right">รหัสสินค้า</th>
                <th className="text-right">ราคา</th>
                <th className="text-right">จำนวน</th>
            </tr>
        </thead>
        <tbody>
            {modalCustomerData.details.length > 0 ? modalCustomerData.details.map((item) => (
                <tr key={item.id}>
                    <td>{item.Product.name}</td>
                    <td className="text-right">{item.Product.id}</td>
                    <td className="text-right">{parseInt(item.price).toLocaleString("th-TH")}</td>
                    <td className="text-right">{item.qty}</td>
                </tr>
            )) : <></>}
        </tbody>
    </table>
    <div>ราคารวม {sumPrice.toLocaleString("th-th")} บาท</div>
</MyModal> */}
<MyModal id="modalInfo" title="รายละเอียดรายการ">
    {/* ข้อมูลลูกค้า */}
    <div className="mb-4 p-4 bg-light rounded shadow-sm">
        <h5 className="mb-3 text-primary">
            <i className="bi bi-person-circle me-2"></i> ข้อมูลลูกค้า
        </h5>
        <div className="d-flex flex-column gap-2">
            <p className="mb-1"><i className="bi bi-person me-2"></i> <strong>ชื่อลูกค้า:</strong> {modalCustomerData.fullname}</p>
            <p className="mb-1"><i className="bi bi-telephone me-2"></i> <strong>เบอร์โทร:</strong> {modalCustomerData.phone}</p>
            <p className="mb-0"><i className="bi bi-geo-alt me-2"></i> <strong>ที่อยู่:</strong> {modalCustomerData.address}</p>
        </div>
    </div>

    {/* รายการสินค้า */}
    <h5 className="mb-3 text-success">
        <i className="bi bi-cart me-2"></i> รายการสินค้า
    </h5>
    <div className="table-responsive">
        <table className="table table-hover table-bordered text-center align-middle">
            <thead className="bg-primary text-white">
                <tr>
                    <th>รายการ</th>
                    <th>รหัสสินค้า</th>
                    <th>ราคา (บาท)</th>
                    <th>จำนวน</th>
                </tr>
            </thead>
            <tbody>
                {modalCustomerData.details.length > 0 ? modalCustomerData.details.map((item) => (
                    <tr key={item.id}>
                        <td className="text-start">{item.Product.name}</td>
                        <td>{item.Product.id}</td>
                        <td className="text-end">{parseInt(item.price).toLocaleString("th-TH")}</td>
                        <td className="text-end">{item.qty}</td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="py-3 text-muted">ไม่มีรายการสินค้า</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>

    {/* ราคารวม */}
    <div className="mt-4 p-4 bg-light rounded shadow-sm text-end">
        <h5 className="mb-0 text-danger">
            <i className="bi bi-cash-stack me-2"></i> ราคารวม: {sumPrice.toLocaleString("th-TH")} บาท
        </h5>
    </div>
</MyModal>

        </BackOffice>
    );
}

export default BillSale;
