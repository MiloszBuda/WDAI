import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Menu, Badge, Button, Dropdown, Avatar, Space } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cardItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      label: <Link to="/">Strona Główna</Link>,
    },
  ];

  if (user?.role === "admin") {
    menuItems.push({
      key: "/admin",
      label: <Link to="/admin">Panel Admina</Link>,
    });
  }

  const userMenu: MenuProps["items"] = [
    {
      key: "orders",
      label: <Link to="/orders">Moje Zamówienia</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Wyloguj się",
      icon: <LogoutOutlined />,
      onClick: () => {
        logout();
        navigate("/");
      },
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{ flex: 1, borderBottom: "none", minWidth: 0 }}
      />

      <Space size="large">
        <Link to="/cart">
          <Badge count={cardItemsCount} showZero>
            <Button
              shape="circle"
              icon={<ShoppingCartOutlined />}
              size="large"
            />
          </Badge>
        </Link>

        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenu }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space style={{ cursor: "pointer", color: "black" }}>
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1677ff" }}
                />
                <span style={{ fontWeight: "500" }}>{user?.username}</span>
                <DownOutlined style={{ fontSize: "10px" }} />
              </Space>
            </a>
          </Dropdown>
        ) : (
          <Space>
            <Link to="/login">
              <Button type="text">Logowanie</Button>
            </Link>
            <Link to="/register">
              <Button type="primary">Rejestracja</Button>
            </Link>
          </Space>
        )}
      </Space>
    </div>
  );
}
