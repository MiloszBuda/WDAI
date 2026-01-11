import { Link } from "react-router-dom";
import { Row, Col, Card, Typography, Statistic } from "antd";
import {
  ShoppingOutlined,
  MessageOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export default function AdminPage() {
  return (
    <div>
      <Title level={2} style={{ marginBottom: 30 }}>
        Panel Administratora
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Link to="/admin/orders">
            <Card hoverable className="dashboard-card">
              <Statistic
                title="Zarządzaj Zamówieniami"
                value="Przejdź"
                prefix={<ShoppingOutlined />}
                valueStyle={{ fontSize: "1.2rem", color: "#1677ff" }}
                formatter={() => <ArrowRightOutlined />}
              />
              <div style={{ marginTop: 10, color: "#888" }}>
                Zmień statusy, sprawdź adresy wysyłki
              </div>
            </Card>
          </Link>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Link to="/admin/reviews">
            <Card hoverable className="dashboard-card">
              <Statistic
                title="Moderacja Opinii"
                value="Przejdź"
                prefix={<MessageOutlined />}
                valueStyle={{ fontSize: "1.2rem", color: "#1677ff" }}
                formatter={() => <ArrowRightOutlined />}
              />
              <div style={{ marginTop: 10, color: "#888" }}>
                Usuń spam i nieodpowiednie treści
              </div>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
}
