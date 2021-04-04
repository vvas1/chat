import React from "react";
import { Form, Input, Button, Checkbox, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../styles/login.css";
import axios from "axios";
import Swal from "sweetalert2";
import { ROUTES } from "../configs/routes";

const LoginPage = () => {
  const onFinish = async (userData) => {
    await axios
      .post(ROUTES.login, userData)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userName", res.data.name);
        localStorage.setItem("userId", res.data.userId);
        Swal.fire({ icon: "success", text: res.data.message });
      })
      .catch((e) => {
        if (e) {
          Swal.fire({ icon: "error", text: e.response?.data.message });
        }
      });
  };

  return (
    <Space
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h2>LOGIN</h2>

      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            { type: "email" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            className="site-form-item-icon"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Link className="login-form-forgot" href="">
            Forgot password
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <Link to="/register">register now!</Link>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default LoginPage;
