import React from 'react';
import HomePage from '../components/HomePage';
import { Helmet } from "react-helmet";

const Knowledge = () => {
    const pageTitle = "ความรู้เกี่ยวกับผลไม้แปรรูป";
  
  return <HomePage title={pageTitle}> 
  <Helmet>
    <title>{pageTitle}</title>
    <meta name="description" content="Cart page" />
  </Helmet>
    <div className="container mx-auto p-6">
        {/* Header Section */}
        <header className="text-center my-8">
            <h1 className="text-3xl font-bold text-purple-800">ความรู้เกี่ยวกับผลไม้แปรรูป</h1>
            <p className="text-gray-600 mt-2">ข้อมูลที่น่าสนใจเกี่ยวกับการแปรรูปผลไม้ กระบวนการแปรรูป และประโยชน์ที่ได้รับจากผลไม้แปรรูป</p>
        </header>

        {/* Introduction Section */}
        <section className="my-10">
            <h2 className="text-2xl font-semibold text-purple-700">การแปรรูปผลไม้คืออะไร?</h2>
            <p className="text-gray-700 mt-4">
            การแปรรูปผลไม้คือกระบวนการเปลี่ยนผลไม้สดให้เป็นผลิตภัณฑ์ใหม่ เช่น ผลไม้อบแห้ง น้ำผลไม้ แยม หรือผลไม้แช่อิ่ม เพื่อเพิ่มอายุการเก็บรักษาและคงคุณค่าทางโภชนาการ การแปรรูปช่วยลดการสูญเสียของผลไม้ที่อาจเน่าเสียได้ง่ายในรูปแบบสด และเพิ่มมูลค่าผลิตภัณฑ์อีกด้วย
            </p>
        </section>

        {/* History Section */}
        <section className="my-10">
            <h2 className="text-2xl font-semibold text-purple-700">ประวัติความเป็นมาของการแปรรูปผลไม้</h2>
            <h3 className="text-xl font-medium text-purple-600 mt-4">ในประเทศไทย</h3>
            <p className="text-gray-700 mt-2">
            การแปรรูปผลไม้ในประเทศไทยมีมาตั้งแต่สมัยโบราณ โดยมีการถนอมอาหารด้วยการอบแห้ง ตากแห้ง และการแช่อิ่มในน้ำตาลเพื่อเก็บไว้บริโภคนอกฤดู ผลไม้แปรรูปพื้นบ้าน เช่น กล้วยตาก มะม่วงแช่อิ่ม และผลไม้กวน เป็นที่นิยมในชุมชนท้องถิ่นและยังคงได้รับความนิยมจนถึงปัจจุบัน
            </p>
            <h3 className="text-xl font-medium text-purple-600 mt-4">ในต่างประเทศ</h3>
            <p className="text-gray-700 mt-2">
            ในต่างประเทศ การแปรรูปผลไม้มีความหลากหลายและมีประวัติยาวนาน ตัวอย่างเช่น ในยุโรปมีการทำแยมและเยลลี่มาตั้งแต่ศตวรรษที่ 16 ส่วนในเอเชีย เช่น ญี่ปุ่น มีการทำผลไม้แห้งและผลไม้ดองเพื่อถนอมอาหาร ในปัจจุบันเทคโนโลยีการแปรรูปผลไม้ได้พัฒนาไปมาก ทำให้เกิดผลิตภัณฑ์ที่หลากหลายและตอบโจทย์ผู้บริโภคมากขึ้น
            </p>
        </section>

        {/* Benefits Section */}
        <section className="my-10">
            <h2 className="text-2xl font-semibold text-purple-700">ประโยชน์ของการบริโภคผลไม้แปรรูป</h2>
            <ul className="list-disc list-inside mt-4 text-gray-700">
            <li><span>อุดมไปด้วยวิตามินและแร่ธาตุ: ผลไม้แปรรูปสามารถคงสารอาหารที่สำคัญ เช่น วิตามิน C, วิตามิน A และไฟเบอร์ได้ดี</span></li>
            <li><span>สามารถเก็บรักษาได้นานขึ้น: การแปรรูปช่วยลดความชื้น ทำให้สามารถเก็บรักษาได้นานโดยไม่ต้องใช้สารกันบูด</span></li>
            <li><span>สะดวกในการพกพาและบริโภค: ผลไม้อบแห้งหรือผลไม้แปรรูปในรูปแบบต่าง ๆ เหมาะสำหรับการพกพาและทานเป็นของว่างได้ง่าย</span></li>
            <li><span>เพิ่มความหลากหลายให้กับเมนูอาหาร: ผลไม้แปรรูปสามารถใช้เป็นวัตถุดิบในของหวาน เครื่องดื่ม หรืออาหารต่าง ๆ ได้</span></li>
            </ul>
        </section>

        {/* Types Section */}
        <section className="my-10">
            <h2 className="text-2xl font-semibold text-purple-700">ประเภทของผลไม้แปรรูป</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="p-4 border rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-600">ผลไม้อบแห้ง</h3>
                <p className="text-gray-700 mt-2">ผลไม้อบแห้งเป็นการนำผลไม้มาอบหรือผึ่งให้แห้ง เพื่อลดความชื้นและยืดอายุการเก็บรักษา ผลไม้ที่นิยมอบแห้งได้แก่ กล้วย มะม่วง และแอปริคอต</p>
            </div>
            <div className="p-4 border rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-600">น้ำผลไม้</h3>
                <p className="text-gray-700 mt-2">น้ำผลไม้ที่ผ่านกระบวนการพาสเจอร์ไรส์หรือแปรรูปเพื่อคงรสชาติและสารอาหาร น้ำผลไม้สามารถทำจากผลไม้หลากหลายชนิด เช่น ส้ม แอปเปิ้ล และทับทิม</p>
            </div>
            <div className="p-4 border rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-600">แยมผลไม้</h3>
                <p className="text-gray-700 mt-2">แยมผลไม้ทำจากผลไม้สดที่ต้มกับน้ำตาลจนได้เนื้อสัมผัสที่เหนียวหนืด แยมเป็นที่นิยมในการทาขนมปังหรือใช้เป็นไส้ขนมต่าง ๆ</p>
            </div>
            <div className="p-4 border rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-600">ผลไม้แช่อิ่ม</h3>
                <p className="text-gray-700 mt-2">ผลไม้แช่อิ่มผ่านการแช่ในน้ำเชื่อมหรือสารละลายเพื่อเพิ่มรสชาติ มักนิยมใช้กับผลไม้เช่น มะม่วง มะขาม และสับปะรด</p>
            </div>
            <div className="p-4 border rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-600">ผลไม้กวน</h3>
                <p className="text-gray-700 mt-2">ผลไม้กวนคือการนำผลไม้สดมาต้มกับน้ำตาลและเคี่ยวจนได้เนื้อผลไม้ที่เหนียวข้น ผลไม้กวนเป็นที่นิยมในการทำของฝากและของทานเล่น</p>
            </div>
            <div className="p-4 border rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-600">เยลลี่ผลไม้</h3>
                <p className="text-gray-700 mt-2">เยลลี่ผลไม้ทำจากน้ำผลไม้ที่ผสมกับเจลาตินหรือตัวทำให้แข็ง นิยมทานเป็นของหวานหรือนำไปใช้ตกแต่งขนมต่าง ๆ</p>
            </div>
            </div>
        </section>

        {/* Health Tips Section */}
        <section className="my-10">
            <h2 className="text-2xl font-semibold text-purple-700">เคล็ดลับการเลือกบริโภคผลไม้แปรรูปให้ดีต่อสุขภาพ</h2>
            <ul className="list-disc list-inside mt-4 text-gray-700">
            <li><span>เลือกผลิตภัณฑ์ที่มีปริมาณน้ำตาลต่ำ</span></li>
            <li><span>ตรวจสอบฉลากเพื่อหลีกเลี่ยงสารกันบูดหรือสารเติมแต่ง</span></li>
            <li><span>เลือกผลไม้แปรรูปที่ใช้วิธีการอบหรือแช่เย็นแทนการทอด</span></li>
            <li><span>บริโภคในปริมาณที่เหมาะสมเพื่อควบคุมพลังงานและน้ำตาล</span></li>
            </ul>
        </section>

        {/* Conclusion Section */}
        <footer className="text-center mt-16">
            <h2 className="text-xl font-semibold text-purple-700">เพิ่มผลไม้แปรรูปในชีวิตประจำวันของคุณ</h2>
            <p className="text-gray-700 mt-4">การบริโภคผลไม้แปรรูปเป็นวิธีที่ยอดเยี่ยมในการเพิ่มสารอาหารและรสชาติให้กับอาหารของคุณ หากเลือกบริโภคอย่างเหมาะสม ผลไม้แปรรูปจะช่วยเสริมสร้างสุขภาพที่ดีในระยะยาว</p>
        </footer>
        </div>
  </HomePage>
    
};

export default Knowledge;
