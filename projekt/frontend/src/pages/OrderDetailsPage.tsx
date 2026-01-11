import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { orderService } from "../services/ordersService";
import type { Order } from "../types/Order";
import {
  Descriptions,
  Table,
  Tag,
  Button,
  Typography,
  Card,
  Divider,
  Space,
  Skeleton,
  message,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const orders = await orderService.getMy();
      const found = orders.find((o: Order) => o.id === id);
      setOrder(found || null);
    } catch (err) {
      message.error("Błąd pobierania zamówienia");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      await orderService.cancel(order.id);
      message.success("Zamówienie zostało anulowane");
      fetchOrder();
    } catch (err) {
      message.error("Nie udało się anulować zamówienia");
    }
  };

  if (loading) return <Skeleton active paragraph={{ rows: 10 }} />;
  if (!order) return <Navigate to="/orders" />;

  const productColumns = [
    {
      title: "Produkt",
      dataIndex: ["product", "title"],
      key: "product",
      render: (text: string, record: any) => (
        <Link to={`/products/${record.productId}`}>
          {text || "Produkt usunięty"}
        </Link>
      ),
    },
    {
      title: "Cena jedn.",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price} zł`,
    },
    {
      title: "Ilość",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Suma",
      key: "total",
      render: (_: any, record: any) => (
        <strong>{(record.price * record.quantity).toFixed(2)} zł</strong>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Link to="/orders">
          <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 10 }}>
            Powrót do listy
          </Button>
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Zamówienie #{order.id.slice(0, 8)}
          </Title>

          <Space>
            {order.status === "completed" && (
              <Tag color="success" style={{ fontSize: 16, padding: 5 }}>
                Zrealizowane
              </Tag>
            )}
            {order.status === "pending" && (
              <Tag color="warning" style={{ fontSize: 16, padding: 5 }}>
                W trakcie realizacji
              </Tag>
            )}
            {order.status === "cancelled" && (
              <Tag color="error" style={{ fontSize: 16, padding: 5 }}>
                Anulowane
              </Tag>
            )}

            {order.status === "pending" && (
              <Popconfirm
                title="Anulować zamówienie?"
                description="Tej operacji nie można cofnąć."
                onConfirm={handleCancel}
                okText="Tak, anuluj"
                cancelText="Nie"
              >
                <Button danger icon={<CloseCircleOutlined />}>
                  Anuluj zamówienie
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>
      </div>

      <Divider />
      <Card style={{ marginBottom: 24 }} bordered={false}>
        <Descriptions
          title="Informacje o zamówieniu"
          bordered
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 3 }}
        >
          <Descriptions.Item label="Data złożenia">
            {new Date(order.createdAt).toLocaleString()}
          </Descriptions.Item>

          <Descriptions.Item label="Metoda płatności">
            {(order as any).paymentMethod ? (
              <>
                <CreditCardOutlined />{" "}
                {(order as any).paymentMethod.toUpperCase()}
              </>
            ) : (
              "Karta / Online"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {order.status.toUpperCase()}
          </Descriptions.Item>

          <Descriptions.Item label="Dane klienta">
            {order.firstName} {order.lastName} <br />
            <a href={`mailto:${order.email}`}>{order.email}</a>
          </Descriptions.Item>

          <Descriptions.Item label="Adres dostawy" span={2}>
            {order.address} <br />
            {order.zipCode} {order.city}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={
          <>
            <ShoppingOutlined /> Zakupione produkty
          </>
        }
        bordered={false}
      >
        <Table
          columns={productColumns}
          dataSource={order.items}
          rowKey="id"
          pagination={false}
          footer={() => (
            <div style={{ textAlign: "right", fontSize: "1.2em" }}>
              Razem:{" "}
              <Text strong type="success">
                {order.total.toFixed(2)} zł
              </Text>
            </div>
          )}
        />
      </Card>
    </div>
  );
}
