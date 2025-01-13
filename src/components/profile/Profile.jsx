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
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import generateAvatar from "../../utils/generateAvatar";
import dayjs from "dayjs";
import { updateProfile } from "../../redux/thunks/userThunk";

const { Text, Title } = Typography;

const Profile = ({ open, setOpen }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(user?.avatar?.url || "");
  const [file, setFile] = useState(null);

  const { color, initial } = generateAvatar(user?.email, user?.fullName);

  const onClose = () => {
    setOpen(false);
    setIsEditing(false);
    setFile(null);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const updatedValues = {
        ...values,
        gender: values.gender === "true",
      };
      const formData = new FormData();
      if (file) {
        formData.append("avatar", file);
      }
      for (const key in updatedValues) {
        formData.append(key, updatedValues[key]);
      }
      await dispatch(updateProfile(user.userId, formData));
      setAvatar(avatar);
      message.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error.response?.data);
      message.error(
        error.response?.data?.message || "Cập nhật thông tin thất bại!"
      );
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleAvatarChange = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
    }
    if (info.file.status === "done") {
      setFile(info.file.originFileObj);
      setAvatar(URL.createObjectURL(info.file.originFileObj));
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
          src={avatar}
          size={100}
          className="mb-4 shadow-lg"
          style={{
            backgroundColor: avatar ? "transparent" : color,
            fontSize: 36,
          }}
        >
          {!user?.avatar?.url && initial}
        </Avatar>
        {isEditing && (
          <Upload
            name="avatar"
            showUploadList={false}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 0);
            }}
            onChange={handleAvatarChange}
            className="mb-2"
          >
            <Button loading={loading} icon={<UploadOutlined />}>
              Thay đổi ảnh đại diện
            </Button>
          </Upload>
        )}
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
                rules={[{ required: false, message: "Vui lòng nhập email!" }]}
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
                  { required: false, message: "Vui lòng nhập số điện thoại!" },
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
                  { required: false, message: "Vui lòng chọn ngày sinh!" },
                ]}
                getValueProps={(value) => ({
                  value: value && dayjs(value),
                })}
                normalize={(value) => value && value.tz().format("YYYY-MM-DD")}
              >
                <DatePicker
                  format="DD/MM/YYYY"
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
                  { required: false, message: "Vui lòng chọn giới tính!" },
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
