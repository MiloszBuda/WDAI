import { useEffect, useState } from "react";
import type { Review } from "../types/Review";
import { Table, Button, Rate, Typography, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const { Title, Text } = Typography;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchReviews = async () => {
      try {
        const response = await axiosPrivate.get("/reviews", {
          signal: controller.signal,
        });

        if (isMounted) {
          if (Array.isArray(response.data)) {
            setReviews(response.data);
          } else {
            console.error(
              "Otrzymano nieprawidłowy format danych:",
              response.data
            );
            setReviews([]);
          }
        }
      } catch (err: any) {
        if (isMounted && err.name !== "Canceled") {
          console.error(err);
          message.error("Błąd pobierania opinii");
          setReviews([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);
  const remove = async (id: string) => {
    try {
      await axiosPrivate.delete(`/reviews/${id}`);

      setReviews((prev) => prev.filter((x) => x.id !== id));
      message.success("Opinia usunięta");
    } catch (err) {
      console.error(err);
      message.error("Nie udało się usunąć opinii");
    }
  };

  const columns: ColumnsType<Review> = [
    {
      title: "Produkt",
      dataIndex: ["product", "title"],
      key: "product",
      render: (text, record) =>
        text ? (
          <strong>{text}</strong>
        ) : (
          <Text type="secondary">ID: {record.productId}</Text>
        ),
    },
    {
      title: "Użytkownik",
      dataIndex: ["user", "username"],
      key: "user",
      render: (text) => text || "Anonim",
    },
    {
      title: "Ocena",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <Rate
          disabled
          allowHalf
          defaultValue={rating}
          style={{ fontSize: 14 }}
        />
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Komentarz",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
    },
    {
      title: "Data",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "-",
      sorter: (a, b) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime(),
    },
    {
      title: "Akcje",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Usunąć opinię?"
          description="Ta operacja jest nieodwracalna."
          onConfirm={() => remove(record.id)}
          okText="Tak"
          cancelText="Nie"
        >
          <Button danger size="small" icon={<DeleteOutlined />}>
            Usuń
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Moderacja opinii</Title>
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}
