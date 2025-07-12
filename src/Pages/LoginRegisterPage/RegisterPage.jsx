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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-xl">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Đăng ký tài khoản</h2>

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        scrollToFirstError
      >
        <Form.Item
          name="username"
          label={<span className="font-semibold">Tên đăng nhập</span>}
          rules={[{ required: true, message: "Vui lòng nhập tài khoản!" }]}
        >
          <Input className="py-2 px-4 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className="font-semibold">Mật khẩu</span>}
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          hasFeedback
        >
          <Input.Password className="py-2 px-4 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="font-semibold">Email</span>}
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
          <Input className="py-2 px-4 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
        </Form.Item>

        <Form.Item className="text-center mt-6">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold shadow-md"
          >
            Đăng ký
          </Button>
        </Form.Item>

        <Form.Item className="text-center">
          <span className="text-gray-600 mr-2">Đã có tài khoản?</span>
          <Button
            type="default"
            onClick={() => navigate("/login")}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div>
  );
};

export default RegisterPage;
