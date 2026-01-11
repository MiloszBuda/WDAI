import { useCart } from "../context/CartContext";
import { orderService } from "../services/ordersService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  Typography,
  List,
  Divider,
  message,
  Steps,
  Radio,
  Space,
} from "antd";
import {
  CreditCardOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function CheckoutPage() {
  const { items, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        address: values.address,
        city: values.city,
        zipCode: values.zipCode,
        paymentMethod: values.paymentMethod,
      };

      const order = await orderService.create(orderData);

      message.success("Zamówienie zostało złożone pomyślnie!");
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      message.error("Błąd podczas składania zamówienia. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Title level={3}>Twój koszyk jest pusty</Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Wróć do sklepu
        </Button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Steps
        current={1}
        items={[
          { title: "Koszyk", icon: <ShoppingOutlined /> },
          { title: "Dostawa i Płatność", icon: <CreditCardOutlined /> },
          { title: "Gotowe", icon: <CheckCircleOutlined /> },
        ]}
        style={{ marginBottom: 40, maxWidth: 800, margin: "0 auto 40px auto" }}
      />

      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <>
                <HomeOutlined /> Dane do wysyłki
              </>
            }
            bordered={false}
            style={{ marginBottom: 20 }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ paymentMethod: "card" }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="Imię"
                    rules={[{ required: true, message: "Proszę podać imię" }]}
                  >
                    <Input placeholder="Jan" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Nazwisko"
                    rules={[
                      { required: true, message: "Proszę podać nazwisko" },
                    ]}
                  >
                    <Input placeholder="Kowalski" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Email jest wymagany" },
                  { type: "email", message: "Niepoprawny format email" },
                ]}
              >
                <Input placeholder="jan@example.com" />
              </Form.Item>

              <Form.Item
                name="address"
                label="Adres dostawy"
                rules={[{ required: true, message: "Adres jest wymagany" }]}
              >
                <Input placeholder="ul. Kwiatowa 12/3" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="city"
                    label="Miasto"
                    rules={[
                      { required: true, message: "Miasto jest wymagane" },
                    ]}
                  >
                    <Input placeholder="Warszawa" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="zipCode"
                    label="Kod pocztowy"
                    rules={[{ required: true, message: "Kod jest wymagany" }]}
                  >
                    <Input placeholder="00-001" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Metoda płatności</Divider>

              <Form.Item name="paymentMethod">
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="card">
                      Karta płatnicza (Visa/Mastercard)
                    </Radio>
                    <Radio value="blik">BLIK</Radio>
                    <Radio value="transfer">Przelew tradycyjny</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title="Podsumowanie zamówienia"
            bordered={false}
            style={{ position: "sticky", top: 20 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`Ilość: ${item.quantity}`}
                  />
                  <div>{(item.price * item.quantity).toFixed(2)} zł</div>
                </List.Item>
              )}
            />

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <Text strong>Suma do zapłaty:</Text>
              <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
                {totalPrice.toFixed(2)} zł
              </Title>
            </div>

            <Button
              type="primary"
              size="large"
              block
              onClick={() => form.submit()}
              loading={loading}
              icon={<CheckCircleOutlined />}
            >
              Zamawiam i płacę
            </Button>

            <div
              style={{
                marginTop: 15,
                fontSize: "0.8em",
                color: "#888",
                textAlign: "center",
              }}
            >
              Klikając przycisk, akceptujesz regulamin sklepu.
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
