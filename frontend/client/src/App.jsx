import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

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
import Products from "./pages/user/Products";
import Wishlist from "./pages/user/Wishlist";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import AddressBook from "./pages/user/AddressBook";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import TermsAndConditions from "./pages/user/TermsAndConditions";
import Blog from "./pages/user/Blog";
import BlogDetails from "./pages/user/BlogDetails";
import ProductDetail from "./pages/user/ProductDetail";

import AdminProducts from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import AdminMessages from "./pages/admin/Messages";
import AdminReviews from "./pages/admin/Reviews";
import Categories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import Analytics from "./pages/admin/Analytics";
import PageContents from "./pages/admin/PageContents";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <CartProvider>
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
          <Route path="pages/user/product/:id" element={<ProductDetail />} />
          <Route path="pages/user/FAQ" element={<Faq />} />
          <Route path="pages/user/wishlist" element={<Wishlist />} />
          <Route path="pages/user/cart" element={<Cart />} />
          <Route path="pages/user/checkout" element={<Checkout />} />
          <Route path="pages/user/orders" element={<Orders />} />
          <Route path="pages/user/profile" element={<Profile />} />
          <Route path="pages/user/address-book" element={<AddressBook />} />
          <Route path="pages/user/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="pages/user/terms-conditions" element={<TermsAndConditions />} />
          <Route path="pages/user/blog" element={<Blog />} />
          <Route path="pages/user/blog/:id" element={<BlogDetails />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<Users />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="reports" element={<Reports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="content" element={<PageContents />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </CartProvider>
  );
}

export default App;
