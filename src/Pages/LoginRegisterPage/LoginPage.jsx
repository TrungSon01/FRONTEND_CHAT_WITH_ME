import { Button, Form, Input } from "antd";
import { loginService } from "../../apis/userService";
import { useDispatch } from "react-redux";
import { setUserAction } from "../../redux/userSlice";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
export default function LoginPage() {
  // di chuyển trang
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = (user) => {
    console.log(" user:", user);
    loginService(user)
      .then(function (res) {
        // gọi api đăng nhập thành công
        console.log("SUCCESS", res);
        // tạo action
        let user = res.data.user;
        if (user.id && !user.userid) {
          user.userid = user.id;
          delete user.id;
        }
      
        const action = setUserAction(user);
        // đưa action vào reducer ở userSlice
        dispatch(action);
        // đưa user về home page sau khi login thành công
        navigate("/");
        // window.location.href = "/"; => gây reload trang => mất data redux
        toast.success("Đăng nhập thành công");

        // dùng localStorage để lưu data, tránh mất data khi reload trang
        const userJson = JSON.stringify(user);
        localStorage.setItem("user", userJson);
      })
      .catch(function (err) {
        console.log("ERROR:", err);
      });
  };
   
  const onFinish = (values) => {
    handleLogin(values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
<div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
    <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Đăng Nhập</h2>
    <Form
      name="basic"
      initialValues={{
        taiKhoan: "",
        matKhau: "",
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label={<span className="text-gray-700">Email</span>}
        name="email"
        rules={[
          {
            required: true,
            message: "Tài khoản không được bỏ trống",
          },
        ]}
      >
        <Input
          className="py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Nhập email của bạn"
        />
      </Form.Item>

      <Form.Item
        label={<span className="text-gray-700">Mật khẩu</span>}
        name="password"
        rules={[
          {
            required: true,
            message: "Mật khẩu không được bỏ trống",
          },
        ]}
      >
        <Input.Password
          className="py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Nhập mật khẩu"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Đăng nhập
        </Button>
      </Form.Item>

      <Form.Item>
        <Button
          type="default"
          onClick={() => navigate("/register")}
          className="w-full border border-blue-600 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition duration-300"
        >
          Đăng ký
        </Button>
      </Form.Item>
    </Form>
  </div>
</div>

  );
}
