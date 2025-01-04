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
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { authService, userService } from "../../services";
import { setAuth } from "../../redux/slices/authSlice";
import { LoginSocialGoogle } from "reactjs-social-login";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const { Title } = Typography;

const AuthDrawer = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("login");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false); // State to manage OTP step
  const [otpForm] = Form.useForm();
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [countdown, setCountdown] = useState(60); // Countdown timer state
  const [resendDisabled, setResendDisabled] = useState(true); // Resend button state
  const [loading, setLoading] = useState(false); // Loading state for buttons
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  useEffect(() => {
    let timer;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleClose = () => {
    setOpen(false);
    setActiveTab("login");
    setOtpSent(false);
    setRegisteredEmail("");
    setIsForgotPassword(false);
    setCountdown(60);
    setResendDisabled(true);
    setLoading(false);
    loginForm.resetFields();
    registerForm.resetFields();
    otpForm.resetFields();
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await authService.signIn(values);

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const user = await userService.getLoggedInUser();
      dispatch(setAuth(user.data));
      message.success("Đăng nhập thành công!");

      handleClose();
    } catch (error) {
      message.error("Đăng nhập thất bại!");
      console.error("Login error:", error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      await authService.signUp(values);
      message.success("Đăng ký thành công! Vui lòng nhập mã OTP.");
      setRegisteredEmail(values.email);
      setOtpSent(true); // Move to OTP step
    } catch (error) {
      message.error("Đăng ký thất bại!");
      console.error("Register error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      await authService.resetPassword(values);
      message.success("Vui lòng xác thực OTP để đặt lại mật khẩu.");
      setRegisteredEmail(values.email);
      setOtpSent(true);
    } catch (error) {
      message.error("Đặt lại mật khẩu thất bại!");
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordVerification = async (values) => {
    setLoading(true);
    try {
      await authService.verifyResetPassword({
        email: registeredEmail,
        otp: values.otp,
      });
      message.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      setOtpSent(false);
      setIsForgotPassword(false);
      setActiveTab("login");
    } catch (error) {
      message.error("Xác thực OTP không đúng hoặc hết hạn!");
      console.error("Reset password verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (values) => {
    setLoading(true);
    try {
      await authService.verifyEmail({
        email: registeredEmail,
        otp: values.otp,
      });
      message.success("Xác thực OTP thành công! Vui lòng đăng nhập.");
      setOtpSent(false);
      setActiveTab("login");
    } catch (error) {
      message.error("OTP không đúng hoặc hết hạn!");
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.resendOtp({ email: registeredEmail });
      message.success("Mã OTP mới đã được gửi!");
      setCountdown(60);
      setResendDisabled(true);
    } catch (error) {
      message.error("Gửi lại mã OTP thất bại!");
      console.error("Resend OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      closable={false}
      title={
        <Title level={3}>
          {activeTab === "login"
            ? "Đăng nhập"
            : otpSent
            ? "Xác thực OTP"
            : "Đăng ký"}
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
            label: !isForgotPassword ? "Đăng nhập" : "Quên mật khẩu",
            children: otpSent ? (
              <Form
                layout="vertical"
                onFinish={handleResetPasswordVerification}
                form={otpForm}
              >
                <Form.Item
                  label="Mã OTP"
                  name="otp"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã OTP!" },
                    { len: 6, message: "Mã OTP phải có 6 chữ số!" },
                  ]}
                  style={{ textAlign: "center" }}
                >
                  <Input.OTP
                    placeholder="Nhập mã OTP"
                    maxLength={6}
                    inputMode="numeric"
                    onChange={(e) => {
                      if (e && e.target) {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }
                    }}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Xác thực OTP
                </Button>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  {resendDisabled ? (
                    <span>Gửi lại mã sau {countdown} giây</span>
                  ) : (
                    <Button type="link" onClick={handleResendOtp}>
                      Gửi lại mã OTP
                    </Button>
                  )}
                </div>
              </Form>
            ) : (
              <Form
                layout="vertical"
                onFinish={isForgotPassword ? handleResetPassword : handleLogin}
                form={loginForm}
              >
                {!isForgotPassword ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                      label="Mật khẩu mới"
                      name="newPassword"
                      rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu!" },
                      ]}
                    >
                      <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                    <Form.Item
                      label="Xác nhận mật khẩu mới"
                      name="confirmNewPassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập lại mật khẩu mới!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue("newPassword") === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Mật khẩu không khớp!")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Xác nhận mật khẩu mới" />
                    </Form.Item>
                  </>
                )}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  {isForgotPassword ? "Đặt lại mật khẩu" : "Đăng nhập"}
                </Button>
                <Button
                  className="mt-2"
                  type="link"
                  block
                  onClick={() => setIsForgotPassword(!isForgotPassword)}
                >
                  {isForgotPassword ? "Quay lại đăng nhập" : "Quên mật khẩu?"}
                </Button>
                {!isForgotPassword && (
                  <LoginSocialGoogle
                    client_id={CLIENT_ID}
                    onResolve={(response) => {
                      console.log(response.data);
                    }}
                    onReject={(error) => {
                      console.log(error);
                    }}
                    className="w-full mt-4"
                  >
                    <Button
                      type="default"
                      icon={
                        <img
                          src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                          alt="Google logo"
                          style={{ width: 20, marginRight: 8 }}
                        />
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      Đăng nhập với Google
                    </Button>
                  </LoginSocialGoogle>
                )}
              </Form>
            ),
          },
          {
            key: "register",
            label: "Đăng ký",
            children: otpSent ? (
              <Form
                layout="vertical"
                onFinish={handleOtpVerification}
                form={otpForm}
              >
                <Form.Item
                  label="Mã OTP"
                  name="otp"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã OTP!" },
                    { len: 6, message: "Mã OTP phải có 6 chữ số!" },
                  ]}
                  style={{ textAlign: "center" }}
                >
                  <Input.OTP
                    placeholder="Nhập mã OTP"
                    maxLength={6}
                    inputMode="numeric"
                    onChange={(e) => {
                      if (e && e.target) {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }
                    }}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Xác thực OTP
                </Button>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  {resendDisabled ? (
                    <span>Gửi lại mã sau {countdown} giây</span>
                  ) : (
                    <Button
                      type="link"
                      loading={loading}
                      onClick={handleResendOtp}
                    >
                      Gửi lại mã OTP
                    </Button>
                  )}
                </div>
              </Form>
            ) : (
              <Form
                layout="vertical"
                onFinish={handleRegister}
                form={registerForm}
              >
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
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
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
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AuthDrawer;
