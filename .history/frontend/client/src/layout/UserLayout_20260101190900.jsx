import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserLayout = () => {
  return (
    <div>
      {/* <h1>UserLayout</h1> */}
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default UserLayout;
