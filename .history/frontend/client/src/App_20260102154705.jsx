import { Routes, Route } from "react-router-dom";

import AuthLayout from "./layout/AuthLayout";
import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/user/Home";
import Dashboard from "./pages/admin/Dashboard";
import Contact from "./pages/user/Contact";
import About from "./pages/user/About";
import Faq from "./pages/user/Faq";
import Products from "../../src/pages/admin/Products";

function App() {
  return (
    <Routes>

      {/* AUTH ROUTES */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* USER ROUTES */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="pages/user/contact" element={<Contact />} />
        <Route path="pages/user/about" element={<About />} />
        <Route path="pages/user/products" element={<Products />} />
        <Route path="pages/user/FAQ" element={<Faq />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
  );
}

export default App;
