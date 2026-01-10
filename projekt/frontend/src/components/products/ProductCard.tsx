import { Card, Button, Typography, message, Space } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types/Product";

const { Meta } = Card;
const { Text } = Typography;

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    message.success(`Dodano do koszyka`);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/products/${product.id}`);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      style={{ display: "block", height: "100%" }}
    >
      <Card
        hoverable
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
        bodyStyle={{ flex: 1, display: "flex", flexDirection: "column" }}
        cover={
          <div
            style={{
              height: 200,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              padding: "10px 10px 0 10px",
            }}
          >
            <img
              alt={product.title}
              src={product.image || "https://via.placeholder.com/200"}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        }
      >
        <div style={{ flex: 1 }}>
          <Meta
            title={
              <div
                style={{
                  whiteSpace: "normal",
                  fontSize: "1em",
                  lineHeight: "1.3",
                  height: "2.6em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.title}
              </div>
            }
            description={
              <Text
                strong
                style={{
                  fontSize: "1.2em",
                  color: "#1677ff",
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {product.price} zł
              </Text>
            }
          />
        </div>

        <div style={{ marginTop: "auto", paddingTop: "15px" }}>
          <Space direction="vertical" style={{ width: "100%" }} size={8}>
            <Button
              type="primary"
              block
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
            >
              Do koszyka
            </Button>

            <Button block icon={<EyeOutlined />} onClick={handleDetailsClick}>
              Szczegóły
            </Button>
          </Space>
        </div>
      </Card>
    </Link>
  );
};
