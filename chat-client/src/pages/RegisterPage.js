import React from "react";
import { Form, Input, Button } from "antd";
import { Link, Redirect } from "react-router-dom";
import "../styles/login.css";
import axios from "axios";
import Swal from "sweetalert2";
import { ROUTES } from "../configs/routes";

const RegisterPage = () => {
  const onFinish = async (userData) => {
    await axios
      .post(ROUTES.register, userData)
      .then((res) => {
        Swal.fire({ icon: "success", text: res.data.message });
        return <Redirect to="/login" />;
      })
      .catch((e) => {
        if (e) {
          Swal.fire({ icon: "error", text: e.response?.data.message });
        }
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h2>REGISTER</h2>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: "Please input your Username!",
            },
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "Please input your Username!",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Link className="login-form-forgot" to="#">
            Forgot password
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Register
          </Button>
          Or <Link to="/login">Log in now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
