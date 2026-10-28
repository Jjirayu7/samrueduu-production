import React, { useEffect, useState,  useCallback, useMemo  } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import config from "../../config";
import axios from "axios";
import BackOffice from "../../components/BackOffice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const [data, setData] = useState(null);
    const [availableYears, setAvailableYears] = useState([]); // เก็บข้อมูลปีที่มี
    const [selectedYear, setSelectedYear] = useState(null); // ปีที่เลือก
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [products, setProducts] = useState([]);
    const [options] = useState({
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'ยอดขายรายเดือน'
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `ยอดขาย: ฿${tooltipItem.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return `฿${value.toLocaleString()}`;
                    }
                }
            },
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    });
    const [dailySalesData, setDailySalesData] = useState(null);
    const chartRef = React.useRef();

    useEffect(() => {
        fetchAvailableYears(); // เรียกข้อมูลปีที่มี
    }, []);

    useEffect(() => {
        if (selectedYear) {
            fetchData(selectedYear); // ดึงข้อมูลยอดขายรายเดือนตามปีที่เลือก
        }
    }, [selectedYear]);

    const fetchAvailableYears = useCallback(async () => {
        try {
            const res = await axios.get(`${config.apiPath}/api/dashboard/available-years`, { headers: config.headers() });
            setAvailableYears(res.data.years); // กำหนดปีที่มีให้ผู้ใช้เลือก
            if (res.data.years.length > 0) {
                setSelectedYear(res.data.years[0]); // กำหนดปีแรกเป็นปีเริ่มต้น
            }
        } catch (error) {
            console.error("Error fetching available years: ", error);
        }
    }, []);

    const fetchData = useCallback(async (year) => {
        try {
            const res = await axios.get(`${config.apiPath}/api/dashboard/dashboard`, {
                params: { year },
                headers: config.headers()
            });

            let monthlySales = Array(12).fill(0);

            if (res.data.result !== undefined) {
                for (let i = 0; i < res.data.result.length; i++) {
                    const month = res.data.result[i].month - 1;
                    monthlySales[month] += res.data.result[i].sumPrice;
                }
            }

            setData({
                labels: [
                    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
                ],
                datasets: [
                    {
                        label: 'ยอดขายรายเดือน',
                        data: monthlySales,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            });
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }, []);

    const handleClick = async (event) => {
        const activePoints = chartRef.current.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        if (activePoints.length > 0) {
            const clickedIndex = activePoints[0].index;
            const clickedMonth = clickedIndex + 1;
            console.log("คลิกเดือน: ", clickedMonth, " ปี: ", selectedYear);  // ตรวจสอบข้อมูลที่ส่งไป
            fetchDailySalesData(clickedMonth, selectedYear);  // ส่งทั้งเดือนและปี
        }
    };
    
    useEffect(() => {
        if (selectedYear) {
            // ถ้า selectedMonth เป็น "" หรือ null จะไม่ส่ง month ไป
            fetchBestSellingProducts(selectedYear, selectedMonth ?? null);
        }
    }, [selectedYear, selectedMonth]);
    

    const fetchDailySalesData = async (month, year) => {
        try {
            const res = await axios.get(`${config.apiPath}/api/dashboard/daily-sales`, {
                params: { year, month },  // ส่งทั้งปีและเดือน
                headers: config.headers()
            });
            setDailySalesData(res.data);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูลยอดขายรายวัน: ", error);
        }
    };

    const fetchBestSellingProducts = async (year, month) => {
        try {
            // ถ้า month เป็น null หรือ "" ให้ไม่ส่งค่า month ไปที่ API
            const params = { year };
            if (month !== null && month !== "") {
                params.month = month;  // ส่งค่า month เฉพาะเมื่อมีเดือน
            }
        
            const res = await axios.get(`${config.apiPath}/api/dashboard/best-selling-products`, {
                params,
                headers: config.headers()
            });
        
            setProducts(res.data.products || []);
            console.log("สินค้าขายดี: ", res.data.products);
        } catch (error) {
            console.error("Error fetching best selling products: ", error);
        }
    };
    

    return (
        <BackOffice>
             <div>
                {/* <h4>สินค้าขายดี</h4> */}
                <div className="h4 pl-3 mt-4 mb-3" style={{ color: '#5A0D6C' }}>สินค้าขายดี</div>

                {/* <div>
                    <label>เลือกปี: </label>
                    <select value={selectedYear || ""} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    
                    <label>เลือกเดือน: </label>
                    <select value={selectedMonth || ""} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                        <option value="">ทุกเดือน</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{`เดือนที่ ${i + 1}`}</option>
                        ))}
                    </select>
                </div> */}
                <div>
                    <label className="mx-3">เลือกปี: </label>
                    <select
                        value={selectedYear || ""}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className={`form-select border ${
                            selectedYear ? "bg-primary text-white border-primary" : "bg-light text-dark border-secondary"
                        }`}
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <label className="mx-3">เลือกเดือน: </label>
                    <select
                        value={selectedMonth || ""}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className={`form-select border ${
                            selectedMonth ? "bg-primary text-white border-primary" : "bg-success text-white border-success"
                        }`}
                    >
                        <option value="">ทุกเดือน</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{`เดือนที่ ${i + 1}`}</option>
                        ))}
                    </select>
                </div>

                
                {products.length > 0 ? (
                    <table className="table table-bordered table-striped table-hover">
                    <thead className="table-primary text-start text-white">
                        <tr>
                            <th><i className="fas fa-hashtag"></i> ลำดับ</th>
                            <th><i className="fas fa-box"></i> ชื่อสินค้า</th>
                            <th><i className="fas fa-shopping-cart"></i> จำนวนที่ขายได้</th>
                            <th><i className="fas fa-dollar-sign"></i> ยอดขายรวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={product.productId} className="text-start">
                                <td><i className="fas fa-hashtag text-primary"></i> {index + 1}</td>
                                <td className="text-start"><i className="fas fa-tag text-success"></i> {product.productName}</td>
                                <td><i className="fas fa-shopping-basket text-warning"></i> {product.totalQuantity}</td>
                                <td><i className="fas fa-money-bill text-danger"></i> {product.totalPrice?.toLocaleString() || '0'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                ) : (
                    <p>ไม่มีข้อมูลสินค้าในช่วงเวลานี้</p>
                )}
            </div>
            <div>
                {/* Dropdown ปีที่มีข้อมูล */}
                <div>
                {/* <h4>สินค้าขายดี</h4> */}
                <div className="h4 pl-3 mt-5 mb-3" style={{ color: '#5A0D6C' }}>รายได้ทั้งหมด</div>
                    <label className="mx-3">เลือกปี: </label>
                    <select className="bg-primary" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {availableYears.length > 0 ? (
                            availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))
                        ) : (
                            <option value="">ไม่มีข้อมูลปี</option>
                        )}
                    </select>
                </div>

                {data ? (
                    <div>
                        <Bar
                            ref={chartRef}
                            data={data}
                            options={options}
                            onClick={handleClick}
                        />
                        {dailySalesData && (
                            <div>
                                <h3>ยอดขายรายวันในเดือน {dailySalesData.month}</h3>
                                <Bar
                                    data={{
                                        labels: dailySalesData.sales.map(sale => sale.date),
                                        datasets: [
                                            {
                                                label: 'ยอดขายรายวัน',
                                                data: dailySalesData.sales.map(sale => sale.amount),
                                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                                borderColor: 'rgba(153, 102, 255, 1)',
                                                borderWidth: 1
                                            }
                                        ]
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top'
                                            },
                                            title: {
                                                display: true,
                                                text: `ยอดขายรายวันในเดือน ${dailySalesData.month}`
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: function(value) {
                                                        return `฿${value.toLocaleString()}`;
                                                    }
                                                }
                                            },
                                            x: {
                                                ticks: {
                                                    autoSkip: false,
                                                    maxRotation: 45,
                                                    minRotation: 45
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </BackOffice>
    );
}

export default Dashboard;
