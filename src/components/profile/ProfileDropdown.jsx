import {
  UserOutlined,
  LogoutOutlined,
  BookOutlined,
  ContainerOutlined,
  GiftOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Dropdown, Space, Avatar } from "antd";
import Profile from "./Profile";
import Order from "./OrderManagement";
import AddressBook from "./AddressBook";
import VoucherManagement from "./VoucherManagement";
import ChangePassword from "./ChangePassword";
import { useState } from "react";
import { useSelector } from "react-redux";
import generateAvatar from "../../utils/generateAvatar";

const ProfileDropdown = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const { color, initial } = generateAvatar(user?.email, user?.fullName);

  const handleProfileClick = () => {
    setProfileOpen(true);
  };

  const handleChangePassClick = () => {
    setChangePassOpen(true);
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
      label: "Đổi mật khẩu",
      icon: <LockOutlined />,
      onClick: handleChangePassClick,
    },
    {
      key: "4",
      label: "Quản lý đơn hàng",
      icon: <ContainerOutlined />,
      onClick: handleOrderClick,
    },
    {
      key: "5",
      label: "Sổ địa chỉ",
      icon: <BookOutlined />,
      onClick: handleAddressClick,
    },
    {
      key: "6",
      label: "Kho mã giảm giá",
      icon: <GiftOutlined />,
      onClick: handleVoucherClick,
    },
    {
      type: "divider",
    },
    {
      key: "7",
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
              src={user?.avatar}
              style={{
                backgroundColor: user?.avatar ? "transparent" : color,
                fontSize: 16,
              }}
            >
              {!user.avatar && initial}
            </Avatar>
          </Space>
        </a>
      </Dropdown>
      <Profile open={profileOpen} setOpen={setProfileOpen} />
      <Order open={orderOpen} setOpen={setOrderOpen} />
      <AddressBook open={addressOpen} setOpen={setAddressOpen} />
      <VoucherManagement open={voucherOpen} setOpen={setVoucherOpen} />
      <ChangePassword open={changePassOpen} setOpen={setChangePassOpen} />
    </>
  );
};
export default ProfileDropdown;
