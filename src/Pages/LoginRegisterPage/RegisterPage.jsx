import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { registerService } from "../../apis/userService";
import toast from "react-hot-toast";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};
let handleRegister = (user, onSuccess) => {
  console.log("user want register", user);
  registerService(user)
    .then((res) => {
      console.log("register success", res);
      toast.success("Đăng kí tài khoản thành công");
      //   const userJson = JSON.stringify(user);
      //   localStorage.setItem("userRegister", userJson);
      // thành công thì chuyển về trang đăng nhập
      if (onSuccess) onSuccess();
    })
    .catch((err) => {
      console.log("register failed", err);
      toast.error("Đăng kí thất bại, tài khoản đã tồn tại");
    });
};
const RegisterPage = ({ onSuccess }) => {
  let navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const payload = {
      ...values,
      created_at: new Date().toISOString(), // hoặc toLocaleString() nếu bạn muốn định dạng dễ đọc hơn
    };

    handleRegister(payload, () => {
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/login");
      }
    });
  };
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      style={{ maxWidth: 1000 }}
      scrollToFirstError
    >
      <Form.Item
        name="username"
        label="username"
        rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="email"
        label="email"
        rules={[
          {
            type: "email",
            message: "Email không hợp lệ!",
          },
          {
            required: true,
            message: "Vui lòng nhập email!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;
