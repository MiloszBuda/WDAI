import "./App.css";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import NavBar from "./components/common/NavBar";

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Routes>
    </>
  );
}

/*
<div>
      <h1>Debug</h1>

      {!isAuthenticated ? (
        <button onClick={() => login({ username: "admin", password: "admin" })}>
          Login
        </button>
      ) : (
        <>
          <p>Zalogowany jako: {user?.username}!</p>
          <button onClick={logout}>Logout</button>
        </>
      )}

      <hr />

      <button
        onClick={() =>
          addItem({
            productId: 1,
            title: "Test product",
            price: 100,
            image: "",
            quantity: 1,
          })
        }
      >
        Add to cart
      </button>

      <p>Ilość w koszyku: {items.length}</p>
      <p>Suma: {totalPrice}</p>

      <button onClick={clearCart}>Clear cart</button>
    </div>
*/
