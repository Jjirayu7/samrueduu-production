import SideBar from "./SideBar";
import MenuBar from "./MenuBar";
import Header from "./Header";
import Footer from "./Footer";

function HomePage ({title, children}) {

    const pageTitle = title;

  return<>
    <div className='wrapper'>
        <SideBar></SideBar>
        <Header title={pageTitle}></Header>
        <div className='content-wrapper'>
            {children}
        </div>
        <Footer></Footer>
    </div>
        
        
    </>
}

export default HomePage; 