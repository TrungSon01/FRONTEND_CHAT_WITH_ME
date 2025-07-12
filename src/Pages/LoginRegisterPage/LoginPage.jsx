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
    <div>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          taiKhoan: "",
          matKhau: "",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="email"
          name="email"
          rules={[
            {
              required: true,
              message: "Tài khoản không được bỏ trống",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="password"
          name="password"
          rules={[
            {
              required: true,
              message: "Mật khẩu không được bỏ trống",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
