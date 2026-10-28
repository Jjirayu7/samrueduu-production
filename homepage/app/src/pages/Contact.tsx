import HomePage from "../components/HomePage";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLine } from "react-icons/fa";
import { Helmet } from "react-helmet";

function Contact() {
    const pageTitle = "เกี่ยวกับเรา";
    const teamMembers = [
        {
          name: "จิรายุวัฒน์ นวชาตสกุล",
          position: "Developer",
          graduate:"นักศึกษาระดับปริญญาตรีชั้นปีที่ 4 สาขาวิชาวิทยาการคอมพิวเตอร์ประยุกต์-มัลติมีเดีย คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",
          image: "profile-icon.jpg",
        },
        {
          name: "มัทวีกร ชัยสอน",
          position: "Developer",
          graduate:"นักศึกษาระดับปริญญาตรีชั้นปีที่ 4 สาขาวิชาวิทยาการคอมพิวเตอร์ประยุกต์-มัลติมีเดีย คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",
          image: "profile-icon.jpg",
        },
        {
          name: "ธนากร โตกระจ่าง",
          position: "Designer",
          graduate:"นักศึกษาระดับปริญญาตรีชั้นปีที่ 4 สาขาวิชาวิทยาการคอมพิวเตอร์ประยุกต์-มัลติมีเดีย คณะครุศาสตร์อุตสาหกรรมและเทคโนโลยี มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี",
          image: "profile-icon.jpg",
        },
      ];

    return<HomePage title={pageTitle}> 
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content="Cart page" />
    </Helmet>
        <div className="container">
            {/* Social Media Links */}
            <div className="mt-8">
                <h3>ติดต่อเรา</h3>
                <ul className="flex flex-col gap-2">
                <li className="flex items-center mt-2">
                    <FaInstagram className="text-pink-500 mr-2" />
                    <span className="ms-2">Instagram:</span> <a href="https://instagram.com/SamRueduu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">SamRueduu</a>
                </li>
                <li className="flex items-center mt-2">
                    <FaFacebook className="text-blue-500 mr-2" />
                    <span className="ms-2">Facebook:</span> <a href="https://facebook.com/SamRueduuInc" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">SamRueduu</a>
                </li>
                <li className="flex items-center mt-2">
                    <FaTwitter className="text-blue-400 mr-2" />
                    <span className="ms-2">X: </span><a href="https://twitter.com/SamRueduu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">@SamRueduu</a>
                </li>
                <li className="flex items-center mt-2">
                    <FaYoutube className="text-red-500 mr-2" />
                    <span className="ms-2">Youtube:</span> <a href="https://youtube.com/c/SamRueduuOfficial" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">SamRueduu Official</a>
                </li>
                <li className="flex items-center mt-2">
                    <FaLine className="text-green-500 mr-2" />
                    <span className="ms-2">Line:</span> <a href="https://line.me/R/ti/p/@SamRueduu" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">@SamRueduu</a>
                </li>
                </ul>
            </div>
                <div className="p-6 bg-gray-100 min-h-screen mt-5">
                    <h3 className="text-4xl font-bold mb-8">เกี่ยวกับเรา</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                    {teamMembers.map((member, index) => (
                        <div 
                            key={index}
                            className="mb-5"
                        >
                            <img
                            src={member.image}
                            className="w-25 h-25 rounded-pill mx-auto mb-4 "
                            />
                            <h5 className="text-2xl font-semibold mb-2">{member.name}</h5>
                            <p>{member.position}</p>
                            <p>{member.graduate}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    
    </HomePage>
}

export default Contact;