import {
  Drawer,
  Button,
  Form,
  Input,
  Tabs,
  Typography,
  message,
  DatePicker,
} from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import authService from "../../services/auth.service";
import { setAuth } from "../../redux/slices/authSlice";

const { Title } = Typography;

const AuthDrawer = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("login");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleClose = () => {
    setOpen(false);
    setActiveTab("login");
  };

  const handleLogin = async (values) => {
    try {
      const response = await authService.signIn(values);

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const user = await authService.getLoggedInUser();
      dispatch(setAuth(user.data));
      message.success("Đăng nhập thành công!");

      handleClose();
    } catch (error) {
      message.error("Đăng nhập thất bại!");
      console.error("Login error:", error);
    }
  };

  const handleRegister = async (values) => {
    try {
      await authService.signUp(values);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setRegisteredEmail(values.email);
      setActiveTab("login");
    } catch (error) {
      message.error("Đăng ký thất bại!");
      console.error("Login error:", error);
    }
  };

  return (
    <Drawer
      closable={false}
      title={
        <Title level={3}>
          {activeTab === "login" ? "Đăng nhập" : "Đăng ký"}
        </Title>
      }
      width={400}
      open={open}
      onClose={handleClose}
      footer={
        <div className="text-right">
          <Button onClick={handleClose}>Đóng</Button>
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        centered
        items={[
          {
            key: "login",
            label: "Đăng nhập",
            children: (
              <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đăng nhập
                </Button>
              </Form>
            ),
          },
          {
            key: "register",
            label: "Đăng ký",
            children: (
              <Form layout="vertical" onFinish={handleRegister}>
                <Form.Item
                  label="Họ tên"
                  name="fullName"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                >
                  <Input placeholder="Nhập họ tên" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                  label="Ngày sinh"
                  name="birthday"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày sinh!" },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày sinh"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Xác nhận mật khẩu" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đăng ký
                </Button>
              </Form>
            ),
          },
        ]}
      />
    </Drawer>
  );
};

AuthDrawer.propTypes = {
  open: PropTypes.bool.isRequired, // Trạng thái mở của Drawer
  setOpen: PropTypes.func.isRequired, // Hàm đóng Drawer
};

export default AuthDrawer;
