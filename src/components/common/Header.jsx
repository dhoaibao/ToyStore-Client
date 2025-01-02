import {
  Search,
  ImageUp,
  Mic,
  ShoppingCart,
  LogIn,
  MessageSquare,
  TableOfContents,
  MoveLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Dropdown, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileDropdown from "../profile/ProfileDropdown";
import Cart from "../cart/Cart";
import ChatBox from "./ChatBox";
import Auth from "./Auth";
import { authService } from "../../services";
import { setAuth } from "../../redux/slices/authSlice";

const Header = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [cartOpen, setCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const dispatch = useDispatch();

  const authStatus = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    setIsLogin(authStatus);
  }, [authStatus]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getLoggedInUser();
        dispatch(setAuth(user.data));
      } catch (error) {
        console.error("Check auth error:", error);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      if (scrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", updateScrollDirection);

    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

  const navItems = [
    { value: "products", label: "Sản phẩm" },
    { value: "saleoff", label: "Khuyến mãi" },
    { value: "news", label: "Tin tức" },
    { value: "about", label: "Giới thiệu" },
  ];

  const items = [
    {
      key: "1",
      type: "group",
      label: "Group title",
      children: [
        {
          key: "1-1",
          label: "1st menu item",
        },
        {
          key: "1-2",
          label: "2nd menu item",
        },
      ],
    },
    {
      key: "2",
      label: "sub menu",
      children: [
        {
          key: "2-1",
          label: "3rd menu item",
        },
        {
          key: "2-2",
          label: "4th menu item",
        },
      ],
    },
    {
      key: "3",
      label: "disabled sub menu",
      disabled: true,
      children: [
        {
          key: "3-1",
          label: "5d menu item",
        },
        {
          key: "3-2",
          label: "6th menu item",
        },
      ],
    },
  ];

  return (
    <div
      className={`text-black rounded-md shadow-md sticky top-0 z-50 bg-white transition-transform duration-300 ${
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Phần trên: Logo, Thanh tìm kiếm, và icon */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link to="/">
          <div className="text-2xl font-bold">
            <img
              src="/src/assets/Logo(150x50).png"
              alt="Logo"
              className="h-12"
            />
          </div>
        </Link>

        {/* Phần menu điều hướng */}
        <div className="flex justify-center space-x-4 p-2">
          {navItems.map((item, index) =>
            item.value === "products" ? (
              <Dropdown
                key={index}
                menu={{
                  items,
                }}
              >
                <Link to="/products">
                  <Space
                    className={`${
                      location.pathname === `/${item.value}`
                        ? "text-hover-primary bg-blue-100"
                        : "hover:text-hover-primary hover:bg-blue-100"
                    } p-2 rounded-xl font-bold cursor-pointer`}
                  >
                    <TableOfContents strokeWidth={1} />
                    {item.label}
                  </Space>
                </Link>
              </Dropdown>
            ) : (
              <Link
                key={index}
                to={`/${item.value}`}
                className={`${
                  location.pathname === `/${item.value}`
                    ? "text-hover-primary bg-blue-100"
                    : "hover:text-hover-primary hover:bg-blue-100"
                } p-2 rounded-xl font-bold cursor-pointer`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Thanh tìm kiếm */}
        <div className="w-full sm:w-1/4 mx-4 sm:mx-8 relative">
          <input
            type="text"
            placeholder="Nhập từ khóa để tìm kiếm..."
            className="w-full px-4 py-2 rounded-full text-sm bg-gray-200 placeholder-gray-600 pr-20 sm:pr-28 shadow-sm "
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex p-2 space-x-2 sm:space-x-2">
            <button>
              <ImageUp strokeWidth={1} size={20} />
            </button>
            <button>
              <Mic strokeWidth={1} size={20} />
            </button>
            <button>
              <Search strokeWidth={1} size={20} />
            </button>
          </div>
        </div>

        {/* Các icon */}
        <div className="flex space-x-4 items-center">
          <Link to="/game">
            <button className="bg-green-300 py-1 px-2 font-semibold flex items-center justify-center rounded-full">
              <MoveLeft strokeWidth={1} />
              Trò chơi
            </button>
          </Link>
          <button onClick={() => setIsChatOpen(true)}>
            <MessageSquare strokeWidth={1} />
          </button>
          <button onClick={() => setCartOpen(true)}>
            <ShoppingCart strokeWidth={1} />
          </button>
          <button onClick={() => !isLogin && setIsAuthOpen(true)}>
            {isLogin ? <ProfileDropdown /> : <LogIn strokeWidth={1} />}
          </button>
          {/* <div className="border rounded px-2 py-1">
            <span>🇻🇳</span>
          </div> */}
        </div>
      </div>
      <Cart open={cartOpen} setOpen={setCartOpen} />
      <ChatBox
        open={isChatOpen}
        setOpen={setIsChatOpen}
        sender="A" // Người dùng hiện tại
        receiver="B" // Tên người nhận
      />
      <Auth open={isAuthOpen} setOpen={setIsAuthOpen} />
    </div>
  );
};

export default Header;
