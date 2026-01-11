import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onFinish = async (values: any) => {
    setLoading(true);
    setErrorMsg("");
    try {
      await register(values.email, values.username, values.password);
      message.success("Konto utworzone! Możesz się teraz zalogować.");
      navigate("/");
    } catch (err: any) {
      const msg =
        err.message ||
        "Błąd rejestracji. Spróbuj innej nazwy użytkownika lub emaila.";
      setErrorMsg(msg);
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
        style={{ width: 450, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        bordered={false}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Title level={2}>Utwórz konto</Title>
        </div>

        {errorMsg && (
          <Alert
            message="Błąd rejestracji"
            description={errorMsg}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          name="register_form"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label="Nazwa użytkownika"
            rules={[
              { required: true, message: "Proszę podać nazwę użytkownika!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Twój login" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Adres Email"
            rules={[
              { type: "email", message: "Niepoprawny format email!" },
              { required: true, message: "Proszę podać email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="jan@przyklad.pl" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Hasło"
            rules={[
              { required: true, message: "Proszę podać hasło!" },
              { min: 6, message: "Hasło musi mieć min. 6 znaków" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Hasło" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Potwierdź hasło"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Proszę potwierdzić hasło!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Hasła nie są identyczne!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Potwierdź hasło"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              icon={<UserAddOutlined />}
            >
              Zarejestruj się
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            Masz już konto? <Link to="/login">Zaloguj się tutaj</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
