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
import AddressBook from "../address/AddressBook";
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

  const user = useSelector((state) => state.user.user);

  const { color, initial } = generateAvatar(user?.email, user?.fullName);

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
      onClick: () => setProfileOpen(true),
    },
    {
      key: "3",
      label: "Đổi mật khẩu",
      icon: <LockOutlined />,
      onClick: () => setChangePassOpen(true),
    },
    {
      key: "4",
      label: "Quản lý đơn hàng",
      icon: <ContainerOutlined />,
      onClick: () => setOrderOpen(true),
    },
    {
      key: "5",
      label: "Sổ địa chỉ",
      icon: <BookOutlined />,
      onClick: () => setAddressOpen(true),
    },
    {
      key: "6",
      label: "Kho mã giảm giá",
      icon: <GiftOutlined />,
      onClick: () => setVoucherOpen(true),
    },
    {
      type: "divider",
    },
    {
      key: "7",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        localStorage.clear();
        window.location.reload();
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
              src={user?.avatar?.url}
              style={{
                backgroundColor: user?.avatar?.url ? "transparent" : color,
                fontSize: 16,
              }}
            >
              {!user?.avatar?.url && initial}
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
