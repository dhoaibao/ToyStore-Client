import { Drawer, Button, Form, Input, Tabs, Typography, message } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";

const { Title } = Typography;

const AuthDrawer = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState("login"); // Quản lý tab hiện tại: Đăng nhập hoặc Đăng ký

  const handleClose = () => {
    setOpen(false);
    setActiveTab("login"); // Đặt lại về tab Đăng nhập khi đóng
  };

  const handleLogin = (values) => {
    // Xử lý logic đăng nhập
    message.success(`Đăng nhập thành công! Chào mừng, ${values.username}`);
    handleClose();
  };

  const handleRegister = (values) => {
    // Xử lý logic đăng ký
    message.success(`Đăng ký thành công! Xin chào, ${values.username}`);
    handleClose();
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
                  label="Tên đăng nhập"
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                  ]}
                >
                  <Input placeholder="Nhập tên đăng nhập" />
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
                  label="Tên đăng nhập"
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                  ]}
                >
                  <Input placeholder="Nhập tên đăng nhập" />
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
