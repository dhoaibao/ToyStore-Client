import {
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  ContainerOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { Dropdown, Space, Avatar } from "antd";
import Profile from "./Profile";
import Order from "./OrderManagement";
import AddressBook from "./AddressBook";
import VoucherManagement from "./VoucherManagement";
import { useState } from "react";
import { useSelector } from 'react-redux'

const ProfileDropdown = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const handleProfileClick = () => {
    setProfileOpen(true);
  };

  const handleOrderClick = () => {
    setOrderOpen(true);
  };

  const handleAddressClick = () => {
    setAddressOpen(true);
  };

  const handleVoucherClick = () => {
    setVoucherOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const items = [
    {
      key: "1",
      label: (
        <div>
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-gray-600">{user.email}</p>
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
      onClick: handleOrderClick,
    },
    {
      key: "4",
      label: "Sổ địa chỉ",
      icon: <BookOutlined />,
      onClick: handleAddressClick,
    },
    {
      key: "5",
      label: "Kho mã giảm giá",
      icon: <GiftOutlined />,
      onClick: handleVoucherClick,
    },
    {
      type: "divider",
    },
    {
      key: "6",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
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
      <Order open={orderOpen} setOpen={setOrderOpen} />
      <AddressBook open={addressOpen} setOpen={setAddressOpen} />
      <VoucherManagement open={voucherOpen} setOpen={setVoucherOpen} />
    </>
  );
};
export default ProfileDropdown;
