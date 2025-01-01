import { Drawer, List, Avatar, Typography, Input, Button } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux'

const { Text, Title } = Typography;

const Profile = ({ open, setOpen }) => {
  const [isEditing, setIsEditing] = useState(false);

  const profileDetails = useSelector((state) => state.auth.user);

  const onClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
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
          >
            {isEditing ? "Lưu" : "Chỉnh sửa"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        <Avatar
          src={profileDetails.avatar}
          size={100}
          className="mb-4 shadow-lg"
        />
        <Title level={4}>
          {profileDetails.fullName}
        </Title>
      </div>
      <List itemLayout="vertical" className="mt-6">
        <List.Item className="mb-6">
          <div className="mb-4">
            <Text strong>Email:</Text>
            <Input
              name="email"
              value={profileDetails.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-2 ${
                isEditing ? "border-primary" : "border-gray-300"
              }`}
            />
          </div>
          <div className="mb-4">
            <Text strong>Số điện thoại:</Text>
            <Input
              name="phone"
              value={profileDetails.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-2 ${
                isEditing ? "border-primary" : "border-gray-300"
              }`}
            />
          </div>
          <div className="mb-4">
            <Text strong>Ngày sinh:</Text>
            <Input
              name="birthday"
              value={profileDetails.birthday}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-2 ${
                isEditing ? "border-primary" : "border-gray-300"
              }`}
            />
          </div>
          <div className="mb-4">
            <Text strong>Giới tính:</Text>
            <Input
              name="gender"
              value={profileDetails.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className={`mt-2 ${
                isEditing ? "border-primary" : "border-gray-300"
              }`}
            />
          </div>
        </List.Item>
      </List>
    </Drawer>
  );
};

Profile.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Profile;
