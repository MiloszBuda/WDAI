import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Alert } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onFinish = async (values: any) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await login(values.username, values.password);
      message.success("Zalogowano pomyślnie!");
      navigate("/");
    } catch (err: any) {
      setErrorMsg("Błędny login lub hasło.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Card
        style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Title level={2}>Witaj ponownie</Title>
          <Text type="secondary">Zaloguj się, aby kontynuować zakupy</Text>
        </div>

        {errorMsg && (
          <Alert
            message={errorMsg}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Proszę podać nazwę użytkownika!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Nazwa użytkownika"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Proszę podać hasło!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Hasło"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              icon={<LoginOutlined />}
            >
              Zaloguj się
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            Nie masz konta? <Link to="/register">Zarejestruj się</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
