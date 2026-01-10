import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import plPL from "antd/locale/pl_PL";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ConfigProvider
            locale={plPL}
            theme={{ token: { colorPrimary: "#1677ff", borderRadius: 6 } }}
          >
            <App />
          </ConfigProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
