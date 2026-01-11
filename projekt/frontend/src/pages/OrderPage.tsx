import { useEffect, useState } from "react";
import { orderService } from "../services/ordersService";
import type { Order } from "../types/Order";
import { Link } from "react-router-dom";
import { Table, Tag, Button, Typography, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMy()
      .then(setOrders)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusTag = (status: string) => {
    switch (status) {
      case "completed":
        return <Tag color="success">Zrealizowane</Tag>;
      case "cancelled":
        return <Tag color="error">Anulowane</Tag>;
      case "pending":
        return <Tag color="warning">W trakcie</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: "ID Zamówienia",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <Link to={`/orders/${id}`} style={{ fontFamily: "monospace" }}>
          #{id.slice(0, 8)}...
        </Link>
      ),
    },
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: "Zrealizowane", value: "completed" },
        { text: "W trakcie", value: "pending" },
        { text: "Anulowane", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Kwota",
      dataIndex: "total",
      key: "total",
      render: (total: number) => <strong>{total.toFixed(2)} zł</strong>,
    },
    {
      title: "Akcje",
      key: "actions",
      render: (_, record) => (
        <Tooltip title="Zobacz szczegóły">
          <Link to={`/orders/${record.id}`}>
            <Button icon={<EyeOutlined />} size="small">
              Szczegóły
            </Button>
          </Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 20 }}>
        Moje zamówienia
      </Title>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
