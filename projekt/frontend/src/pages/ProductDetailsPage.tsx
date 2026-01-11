import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsService } from "../services/productsService";
import { reviewService } from "../services/reviewsService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types/Product";
import type { Review } from "../types/Review";
import {
  Row,
  Col,
  Typography,
  Button,
  Image,
  Rate,
  Divider,
  List,
  Avatar,
  Input,
  Space,
  message,
  Card,
  Skeleton,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [canReview, setCanReview] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    productsService
      .getById(Number(id))
      .then(setProduct)
      .catch(() => message.error("Nie udało się pobrać produktu"));

    reviewService
      .getByProduct(Number(id))
      .then((data: any) => {
        setReviews(data.reviews || []);
      })
      .finally(() => setLoading(false));

    if (isAuthenticated) {
      reviewService.canReview(Number(id)).then(setCanReview);
    }
  }, [id, isAuthenticated]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    message.success("Dodano do koszyka");
  };

  const handleAddReview = async () => {
    if (!comment) return message.warning("Napisz chociaż krótką opinię");

    setIsSubmitting(true);
    try {
      const review = await reviewService.add({
        productId: product?.id!,
        rating,
        comment,
      });

      setReviews((r) => [review, ...r]);
      setCanReview(false);
      setShowForm(false);
      setComment("");
      setRating(5);
      message.success("Dziękujemy za opinię!");
    } catch (error) {
      message.error("Błąd podczas dodawania opinii");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (review: Review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = async (reviewId: string) => {
    try {
      const updated = await reviewService.edit(reviewId, {
        rating: editRating,
        comment: editComment,
      });

      setReviews((r) =>
        r.map((rev) => (rev.id === reviewId ? { ...rev, ...updated } : rev))
      );
      setEditingId(null);
      message.success("Zaktualizowano opinię");
    } catch (err) {
      message.error("Nie udało się edytować opinii");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Usunąć opinię?")) return;
    try {
      await reviewService.delete(reviewId);
      setReviews((r) => r.filter((rev) => rev.id !== reviewId));
      message.success("Usunięto opinię");
    } catch (err) {
      message.error("Nie udało się usunąć opinii");
    }
  };

  if (loading) return <Skeleton active paragraph={{ rows: 10 }} />;
  if (!product)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Title level={3}>Produkt nie znaleziony</Title>
      </div>
    );

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div>
      <Row gutter={[48, 32]}>
        <Col xs={24} md={10}>
          <div
            style={{
              border: "1px solid #f0f0f0",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Image
              src={product.image}
              alt={product.title}
              style={{ maxHeight: "400px", objectFit: "contain" }}
              preview={{
                toolbarRender: (
                  _,
                  { transform: { scale }, actions: { onZoomOut, onZoomIn } }
                ) => (
                  <Space size={24} className="toolbar-wrapper">
                    <ZoomOutOutlined
                      onClick={onZoomOut}
                      disabled={scale === 1}
                      style={{ fontSize: 24, color: "#fff", cursor: "pointer" }}
                    />
                    <ZoomInOutlined
                      onClick={onZoomIn}
                      disabled={scale === 50}
                      style={{ fontSize: 24, color: "#fff", cursor: "pointer" }}
                    />
                  </Space>
                ),
              }}
            />
          </div>
        </Col>

        <Col xs={24} md={14}>
          <Title level={2}>{product.title}</Title>

          <div style={{ marginBottom: 20 }}>
            <Rate disabled allowHalf value={Number(avg)} />
            <Text type="secondary" style={{ marginLeft: 10 }}>
              ({reviews.length} opinii)
            </Text>
          </div>

          <Title level={3} style={{ color: "#1677ff", marginTop: 0 }}>
            {product.price} zł
          </Title>

          <Paragraph type="secondary" style={{ fontSize: "1.1em" }}>
            {product.description}
          </Paragraph>

          <Space size="large" style={{ marginTop: 20 }}>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
            >
              Dodaj do koszyka
            </Button>

            <Text type="success">
              <CheckCircleOutlined /> Dostępny
            </Text>
          </Space>
        </Col>
      </Row>

      <Divider style={{ margin: "40px 0" }} />

      <Row>
        <Col span={24} style={{ maxWidth: 800 }}>
          {" "}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Opinie klientów
            </Title>

            {canReview && (
              <Button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Anuluj" : "Napisz opinię"}
              </Button>
            )}
          </div>
          {canReview && showForm && (
            <Card
              style={{
                marginBottom: 30,
                background: "#f9f9f9",
                borderColor: "#d9d9d9",
              }}
            >
              <Title level={5} style={{ marginTop: 0 }}>
                Twoja ocena:
              </Title>
              <Rate
                value={rating}
                onChange={setRating}
                style={{ marginBottom: 15 }}
              />
              <TextArea
                rows={4}
                placeholder="Co myślisz o tym produkcie?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ marginBottom: 15 }}
              />
              <Button
                type="primary"
                onClick={handleAddReview}
                loading={isSubmitting}
              >
                Opublikuj opinię
              </Button>
            </Card>
          )}
          <List
            itemLayout="horizontal"
            dataSource={reviews}
            locale={{ emptyText: "Brak opinii." }}
            renderItem={(item) => (
              <List.Item
                actions={
                  user && item.userId === user.id && editingId !== item.id
                    ? [
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => startEditing(item)}
                        >
                          Edytuj
                        </Button>,
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteReview(item.id)}
                        >
                          Usuń
                        </Button>,
                      ]
                    : []
                }
              >
                {editingId === item.id ? (
                  <div style={{ width: "100%" }}>
                    <Rate value={editRating} onChange={setEditRating} />
                    <TextArea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      style={{ margin: "10px 0" }}
                    />
                    <Space>
                      <Button type="primary" onClick={() => saveEdit(item.id)}>
                        Zapisz
                      </Button>
                      <Button onClick={cancelEditing}>Anuluj</Button>
                    </Space>
                  </div>
                ) : (
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#87d068" }}
                      />
                    }
                    title={
                      <Space>
                        <strong>{item.user?.username || "Anonim"}</strong>
                        <Rate
                          disabled
                          defaultValue={item.rating}
                          style={{ fontSize: 14 }}
                        />
                      </Space>
                    }
                    description={
                      <div>
                        {item.comment}
                        <div
                          style={{
                            fontSize: "0.8em",
                            color: "#ccc",
                            marginTop: 5,
                          }}
                        >
                          {item.createdAt &&
                            new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    }
                  />
                )}
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
}
