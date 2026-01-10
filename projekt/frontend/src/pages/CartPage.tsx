import { useCart } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Table,
  Button,
  InputNumber,
  Typography,
  Card,
  Empty,
  Space,
  message,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import type { CartItem } from "../types/Cart";

const { Title, Text } = Typography;

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const columns = [
    {
      title: "Produkt",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: CartItem) => (
        <Link
          to={`/products/${record.productId}`}
          style={{ fontWeight: 500, color: "#1677ff" }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Cena",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price} zł`,
    },
    {
      title: "Ilość",
      key: "quantity",
      render: (_: any, record: CartItem) => (
        <InputNumber
          min={1}
          max={99}
          value={record.quantity}
          onChange={(val) => updateQuantity(record.productId, Number(val))}
        />
      ),
    },
    {
      title: "Suma",
      key: "total",
      render: (_: any, record: CartItem) => (
        <strong>{(record.price * record.quantity).toFixed(2)} zł</strong>
      ),
    },
    {
      title: "Akcje",
      key: "action",
      render: (_: any, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            removeItem(record.productId);
            message.info("Usunięto produkt");
          }}
        />
      ),
    },
  ];

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0" }}>
        <Empty description="Twój koszyk jest pusty" />
        <Link to="/">
          <Button type="primary" size="large" style={{ marginTop: 20 }}>
            Wróć do zakupów
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 20 }}>
        <ShoppingOutlined /> Twój koszyk
      </Title>

      <Table
        dataSource={items}
        columns={columns}
        rowKey="productId"
        pagination={false}
        style={{ marginBottom: 24 }}
        bordered
      />

      <Card
        style={{
          textAlign: "right",
          background: "#f9f9f9",
          border: "1px solid #f0f0f0",
        }}
      >
        <Space direction="vertical" align="end" size="small">
          <Text type="secondary">Suma całkowita:</Text>
          <Title level={3} style={{ margin: 0, color: "#1677ff" }}>
            {totalPrice.toFixed(2)} zł
          </Title>

          <Space style={{ marginTop: 10 }}>
            <Link to="/">
              <Button size="large">Kontynuuj zakupy</Button>
            </Link>
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate("/checkout")}
            >
              Przejdź do kasy
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
}
