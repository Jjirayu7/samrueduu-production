import ControlSidebar from './ControlSidebar';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function BackOffice(props) {
    return<>
    <div className='wrapper'>
        <Navbar></Navbar>
        <Sidebar></Sidebar>
        <div className='content-wrapper p-2' style={{ backgroundColor: '#FFF5F6' }}>
            {props.children}
        </div>

        <Footer></Footer>
        <ControlSidebar></ControlSidebar>
    </div>
    </>
}

export default BackOffice;