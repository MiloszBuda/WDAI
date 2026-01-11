import { useState, useEffect } from "react";
import { productsService } from "../services/productsService";
import type { Product } from "../types/Product";
import { ProductCard } from "../components/products/ProductCard";
import { Input, Row, Col, Typography, Spin, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsService
      .getAll()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <Title level={2}>Dostępne Produkty</Title>
        <Input
          size="large"
          placeholder="Czego szukasz?"
          prefix={<SearchOutlined style={{ color: "#ccc" }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 500 }}
          allowClear
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" tip="Ładowanie produktów..." />
        </div>
      ) : (
        <>
          {filtered.length > 0 ? (
            <Row gutter={[16, 24]}>
              {filtered.map((product) => (
                <Col
                  key={product.id}
                  xs={12} // 1 kolumna na telefonach
                  sm={12} // 2 kolumny na małych tabletach
                  md={8} // 3 kolumny na tabletach
                  lg={6} // 4 kolumny na desktopie
                  xl={6}
                >
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ marginTop: 50 }}>
              <Empty description="Nie znaleziono produktów" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
