import "./App.css";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import { Route, Routes } from "react-router-dom";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Navbar from "./components/common/Navbar";
import OrdersPage from "./pages/OrderPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import AdminPage from "./pages/AdminPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminReviewsPage from "./pages/AdminReviewsPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutPage from "./pages/CheckoutPage";
import { Layout } from "antd";

const { Header, Content, Footer } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "0 20px",
        }}
      >
        <div
          className="logo"
          style={{ marginRight: "40px", fontWeight: "bold", fontSize: "1.7em" }}
        >
          Sklep
        </div>
        <Navbar />
      </Header>
      <Content style={{ padding: "20px 50px" }}>
        <div
          style={{
            background: "#fff",
            padding: 24,
            minHeight: 280,
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/reviews" element={<AdminReviewsPage />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Projekt @{new Date().getFullYear()} - WDAI
      </Footer>
    </Layout>
  );
}
