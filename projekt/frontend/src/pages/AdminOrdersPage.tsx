import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "../types/Order";
import {
  Table,
  Select,
  Tag,
  Typography,
  message,
  Card,
  Descriptions,
  List,
  Avatar,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        const response = await axiosPrivate.get("/admin/orders", {
          signal: controller.signal,
        });

        if (isMounted) {
          if (Array.isArray(response.data)) {
            setOrders(response.data);
          } else {
            console.error("Nieprawidłowy format danych:", response.data);
            setOrders([]);
          }
        }
      } catch (error: any) {
        if (isMounted && error.name !== "Canceled") {
          console.error("Błąd pobierania zamówień:", error);
          message.error("Błąd pobierania zamówień");
          setOrders([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await axiosPrivate.patch(`/admin/orders/${id}/status`, { status });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: status as OrderStatus } : o
        )
      );
      message.success("Status zaktualizowany");
    } catch (err) {
      console.error(err);
      message.error("Nie udało się zmienić statusu");
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <Text code>{id.slice(0, 8)}...</Text>,
    },
    {
      title: "Klient",
      key: "user",
      render: (_, r) => (
        <div>
          <div>
            {r.firstName} {r.lastName}
          </div>
          <div style={{ fontSize: "0.8em", color: "#888" }}>{r.email}</div>
        </div>
      ),
    },
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "Kwota",
      dataIndex: "total",
      key: "total",
      render: (val: number) => <strong>{val.toFixed(2)} zł</strong>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record) => (
        <Select
          defaultValue={status}
          style={{ width: 140 }}
          onChange={(val) => updateStatus(record.id, val)}
          status={status === "cancelled" ? "error" : ""}
        >
          <Option value="pending">
            <Tag color="warning">Oczekujące</Tag>
          </Option>
          <Option value="paid">
            <Tag color="processing">Opłacone</Tag>
          </Option>
          <Option value="shipped">
            <Tag color="blue">Wysłane</Tag>
          </Option>
          <Option value="completed">
            <Tag color="success">Zakończone</Tag>
          </Option>
          <Option value="cancelled">
            <Tag color="error">Anulowane</Tag>
          </Option>
        </Select>
      ),
      filters: [
        { text: "Oczekujące", value: "pending" },
        { text: "Zakończone", value: "completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  const expandedRowRender = (order: Order) => {
    return (
      <Card style={{ margin: 0 }} size="small" title="Szczegóły zamówienia">
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="Adres dostawy">
            {order.address}, {order.zipCode} {order.city}
          </Descriptions.Item>
          <Descriptions.Item label="Pełne ID">{order.id}</Descriptions.Item>
        </Descriptions>

        <List
          size="small"
          header={<div>Produkty:</div>}
          bordered
          dataSource={order.items}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.product.image} shape="square" />}
                title={item.product.title || "Produkt usunięty"}
                description={`Ilość: ${item.quantity} szt.`}
              />
              <div>{(item.price * item.quantity).toFixed(2)} zł</div>
            </List.Item>
          )}
          style={{ marginTop: 10 }}
        />
      </Card>
    );
  };

  return (
    <div>
      <Title level={2}>Zarządzanie zamówieniami</Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
}
