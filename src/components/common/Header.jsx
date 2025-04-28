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
import { useState, useEffect, useRef } from "react";
import { Dropdown, Space, Badge, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileDropdown from "../profile/ProfileDropdown";
import Cart from "../cart/Cart";
import ChatBox from "../chat/ChatBox";
import Auth from "../auth/Auth";
import { getLoggedInUser } from "../../redux/thunks/userThunk";
import { getCartByUser } from "../../redux/thunks/cartThunk";
import VoiceSearch from "../search/VoiceSearch";
import ImageSearch from "../search/ImageSearch";
import { categoryService, messageService } from "../../services";
import { setUnreadCount } from "../../redux/slices/messageSlice";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL;
const socket = io(SOCKET_URL);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrollDirection, setScrollDirection] = useState("up");
  const [cartOpen, setCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);

  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

  const isLogin = useSelector((state) => state.user.isLogin);
  const userId = useSelector((state) => state.user.userId);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const unreadCount = useSelector((state) => state.message.unreadCount);
  const totalItemsLocal = JSON.parse(
    localStorage.getItem("cart") || "[]"
  ).length;

  const socketRef = useRef(socket);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (userId) {
      const newSocket = io(SOCKET_URL, {
        query: { userId: userId.toString() },
      });

      socketRef.current = newSocket;
    }
  }, [userId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryService.getAllCategories();
        setCategories(result.data);
      } catch (error) {
        console.log("Failed to fetch categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await messageService.getUnreadCount(userId);
        dispatch(setUnreadCount(response.data));
      } catch (error) {
        console.log("Failed to fetch unread count: ", error);
      }
    };

    if (isLogin) fetch();
  }, [userId, dispatch, isLogin]);

  useEffect(() => {
    if (accessToken) {
      dispatch(getLoggedInUser());
      dispatch(getCartByUser());
    }
  }, [dispatch, accessToken]);

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

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("keyword", searchString);
    navigate(`/search?${searchParams.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const navItems = [
    { value: "products", label: "Sản phẩm" },
    { value: "promotions", label: "Khuyến mãi" },
    { value: "news", label: "Tin tức" },
    { value: "about", label: "Giới thiệu" },
  ];

  const items = categories.map((category) => ({
    label: (
      <Link to={`/products?categoryNames=${category?.categoryName}`}>
        <div className="border border-gray-200 rounded-lg p-4 text-center shadow hover:shadow-lg transition-shadow duration-300">
          <img
            src={category?.categoryThumbnail.url}
            alt={category?.categoryName}
            className="w-full h-32 object-cover mb-3 rounded-md transition-transform duration-300 hover:scale-105"
          />
          <h3 className="font-semibold text-lg text-gray-700 hover:text-blue-500 transition-colors duration-300">
            {category?.categoryName}
          </h3>
        </div>
      </Link>
    ),
  }));

  return (
    <div
      className={`text-black rounded-md shadow-sm sticky top-0 z-50 bg-white transition-transform duration-300 ${
        scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Phần trên: Logo, Thanh tìm kiếm, và icon */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link to="/">
          <div className="text-2xl font-bold">
            <img src="/logo(150x50).png" alt="Logo" className="h-12" />
          </div>
        </Link>

        {/* Phần menu điều hướng */}
        <div className="flex justify-center space-x-4 p-2">
          {navItems.map((item, index) => (
            // item.value === "products" ? (
            //   <Dropdown
            //     key={index}
            //     menu={{
            //       items,
            //     }}
            //   >
            //     <Link to="/products?sort=newest">
            //       <Space
            //         className={`${
            //           location.pathname === `/${item.value}`
            //             ? "text-hover-primary"
            //             : "hover:text-hover-primary"
            //         } p-2 rounded-xl font-bold cursor-pointer`}
            //       >
            //         <TableOfContents strokeWidth={1} />
            //         {item.label}
            //       </Space>
            //     </Link>
            //   </Dropdown>
            // ) :
            <Link
              key={index}
              to={`/${item.value}`}
              className={`${
                location.pathname === `/${item.value}`
                  ? "text-hover-primary"
                  : "hover:text-hover-primary"
              } p-2 rounded-xl font-bold cursor-pointer`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Thanh tìm kiếm */}
        <div className="w-full sm:w-1/4 mx-4 sm:mx-8 relative">
          <input
            onChange={(e) => setSearchString(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Nhập từ khóa để tìm kiếm..."
            className="w-full px-4 py-2 rounded-full text-sm bg-gray-200 placeholder-gray-600 pr-20 sm:pr-28 shadow-sm "
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex p-2 space-x-2 sm:space-x-2">
            <button onClick={() => setIsImageSearchOpen(true)}>
              <ImageUp strokeWidth={1} size={20} />
            </button>
            <button onClick={() => setIsVoiceSearchOpen(true)}>
              <Mic strokeWidth={1} size={20} />
            </button>
            <button onClick={handleSearch}>
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
          <div className="flex items-center space-x-6">
            <button
              onClick={() => {
                if (isLogin) {
                  setIsChatOpen(true);
                } else {
                  message.error("Vui lòng đăng nhập để sử dụng tính năng này!");
                }
              }}
              className="flex items-center justify-center"
            >
              <Badge count={unreadCount} overflowCount={99} color="red">
                <MessageSquare strokeWidth={1} />
              </Badge>
            </button>
            <button
              onClick={() => {
                if (isLogin) {
                  setCartOpen(true);
                } else {
                  message.error("Vui lòng đăng nhập để sử dụng tính năng này!");
                }
              }}
              className="flex items-center justify-center"
            >
              <Badge
                count={isLogin ? totalItems : totalItemsLocal}
                overflowCount={99}
                color="red"
              >
                <ShoppingCart strokeWidth={1} />
              </Badge>
            </button>
            <button
              onClick={() => !isLogin && setIsAuthOpen(true)}
              className="flex items-center justify-center"
            >
              {isLogin ? <ProfileDropdown /> : <LogIn strokeWidth={1} />}
            </button>
          </div>
        </div>
      </div>
      <Cart open={cartOpen} setOpen={setCartOpen} />
      <ChatBox
        open={isChatOpen}
        setOpen={setIsChatOpen}
        socket={socketRef.current}
      />
      <Auth open={isAuthOpen} setOpen={setIsAuthOpen} />
      <VoiceSearch
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
      />
      <ImageSearch
        isOpen={isImageSearchOpen}
        onClose={() => setIsImageSearchOpen(false)}
      />
    </div>
  );
};

export default Header;
