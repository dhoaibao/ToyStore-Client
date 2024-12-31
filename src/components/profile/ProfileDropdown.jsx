import {
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  ContainerOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { Dropdown, Space, Avatar } from "antd";
import Profile from "./Profile";
import { useState } from "react";

const ProfileDropdown = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  const handleProfileClick = () => {
    setProfileOpen(true);
  };

  const items = [
    {
      key: "1",
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src="https://www.vlance.vn/uploads/portfolio/view/c4a875224357fa0f1dce59defcb7a42b3d6d2cab1.jpg"
            size="large"
            style={{ marginRight: "10px" }}
          />
          <div>
            <p className="font-semibold">Duong Hoai Bao</p>
            <p className="text-gray-600">abc@gmail.com</p>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: handleProfileClick,
    },
    {
      key: "3",
      label: "Quản lý đơn hàng",
      icon: <ContainerOutlined />,
    },
    {
      key: "4",
      label: "Sổ địa chỉ",
      icon: <BookOutlined />,
    },
    {
      key: "5",
      label: "Kho mã giảm giá",
      icon: <GiftOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "6",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        alert("Logout");
      },
    },
  ];
  return (
    <>
      <Dropdown
        menu={{
          items,
        }}
        overlayClassName="custom-dropdown-menu"
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <Avatar
              src={
                <img
                  src={
                    "https://www.vlance.vn/uploads/portfolio/view/c4a875224357fa0f1dce59defcb7a42b3d6d2cab1.jpg"
                  }
                  alt="avatar"
                />
              }
            />
          </Space>
        </a>
      </Dropdown>
      <Profile open={profileOpen} setOpen={setProfileOpen} />
    </>
  );
};
export default ProfileDropdown;
