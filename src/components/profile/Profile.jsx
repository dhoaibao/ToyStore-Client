import {
  Drawer,
  List,
  Avatar,
  Typography,
  Input,
  Button,
  Select,
  DatePicker,
  Form,
  message,
} from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { userService } from "../../services";
import { setAuth } from "../../redux/slices/authSlice";
import generateAvatar from "../../utils/generateAvatar";

const { Text, Title } = Typography;

const Profile = ({ open, setOpen }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { color, initial } = generateAvatar(user?.email, user?.fullName);

  const onClose = () => {
    setOpen(false);
    setIsEditing(false);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const updatedValues = {
        ...values,
        gender: values.gender === "true",
      };
      const response = await userService.updateProfile(
        user.userId,
        updatedValues
      );
      dispatch(setAuth(response.data));
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error.response?.data);
      message.error(
        error.response?.data?.message || "Cập nhật thông tin thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      form.submit();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Drawer
      closable={false}
      title={<Title level={3}>Thông tin cá nhân</Title>}
      onClose={onClose}
      open={open}
      footer={
        <div className="text-right">
          <Button type="default" size="large" onClick={onClose}>
            Đóng
          </Button>
          <Button
            type="primary"
            size="large"
            className={"ml-4"}
            onClick={toggleEdit}
            loading={loading}
          >
            {isEditing ? "Lưu" : "Chỉnh sửa"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <Avatar
          src={user.avatar}
          size={100}
          className="mb-4 shadow-lg"
          style={{
            backgroundColor: user?.avatar ? "transparent" : color,
            fontSize: 36,
          }}
        >
          {!user.avatar && initial}
        </Avatar>
        <Title level={4}>{user?.fullName}</Title>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          email: user?.email,
          phone: user?.phone,
          birthday: user?.birthday ? moment(user?.birthday) : null,
          gender: user?.gender?.toString(),
        }}
        onFinish={handleUpdate}
      >
        <List itemLayout="vertical" className="mt-6">
          <List.Item className="mb-6">
            <div className="mb-4">
              <Text strong>Email:</Text>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input
                  disabled={!isEditing}
                  className={`mt-2 ${
                    isEditing ? "border-primary" : "border-gray-300"
                  }`}
                />
              </Form.Item>
            </div>
            <div className="mb-4">
              <Text strong>Số điện thoại:</Text>
              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input
                  disabled={!isEditing}
                  className={`mt-2 ${
                    isEditing ? "border-primary" : "border-gray-300"
                  }`}
                />
              </Form.Item>
            </div>
            <div className="mb-4">
              <Text strong>Ngày sinh:</Text>
              <Form.Item
                name="birthday"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                ]}
              >
                <DatePicker
                  disabled={!isEditing}
                  className={`mt-2 ${
                    isEditing ? "border-primary" : "border-gray-300"
                  }`}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <div className="mb-4">
              <Text strong>Giới tính:</Text>
              <Form.Item
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select
                  disabled={!isEditing}
                  className={`mt-2 ${
                    isEditing ? "border-primary" : "border-gray-300"
                  }`}
                  style={{ width: "100%" }}
                >
                  <Select.Option value="true">Nam</Select.Option>
                  <Select.Option value="false">Nữ</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </List.Item>
        </List>
      </Form>
    </Drawer>
  );
};

Profile.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Profile;
