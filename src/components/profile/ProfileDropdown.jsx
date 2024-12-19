import {
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dropdown, Space, Avatar } from "antd";
import { Link } from "react-router-dom";
const items = [
  {
    key: "1",
    label: (
        <p className="font-semibold">Duong Hoai Bao</p>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "2",
    label: <Link to="/profile">Hồ sơ người dùng</Link>,
    icon: <UserOutlined />,
  },
  {
    key: "3",
    label: (
        <Link to="/setting">Thiết lập tài khoản</Link>
    ),
    icon: <SettingOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "4",
    label: "Đăng xuất",
    icon: <LogoutOutlined />,
    danger: true,
    onClick: () => {
      alert("Logout");
    },
  },
];
const ProfileDropdown = () => (
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
);
export default ProfileDropdown;
