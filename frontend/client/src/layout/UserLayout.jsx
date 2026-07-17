import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLayout = () => {
  return (
    <div>
      {/* <h1>UserLayout</h1> */}
      <Header />
      <Outlet />
      <ScrollToTop />
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default UserLayout;
