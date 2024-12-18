import {
  Search,
  ImageUp,
  Mic,
  ShoppingCart,
  CircleUserRound,
  Star,
} from "lucide-react";
import { Link } from 'react-router-dom';

const Header = () => {
  const navItems = [
    { value: "", label: "Trang chủ" },
    { value: "products", label: "Sản phẩm" },
    { value: "saleoff", label: "Khuyến mãi" },
    { value: "news", label: "Tin tức" },
    { value: "about", label: "Giới thiệu" },
    { value: "contact", label: "Liên hệ" },
  ];

  return (
    <div className="text-black">
      {/* Phần trên: Logo, Thanh tìm kiếm, và icon */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <img src="/src/assets/Logo(150x50).png" alt="Logo" className="h-12" />
        </div>

        {/* Thanh tìm kiếm */}
        <div className="w-full sm:w-1/2 mx-4 sm:mx-8 relative">
          <input
            type="text"
            placeholder="Nhập từ khóa để tìm kiếm (ví dụ: lắp ráp, mô hình, ba lô,...)"
            className="w-full px-4 py-2 rounded-full text-sm text-black placeholder-gray-500 pr-20 sm:pr-16 border border-gray-300 shadow-sm focus:border-primary focus:shadow-md"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2 sm:space-x-4">
            <button>
              <Mic color="#000000" strokeWidth={1} />
            </button>
            <button>
              <ImageUp color="#000000" strokeWidth={1} />
            </button>
            <button className="bg-white p-1 rounded-full">
              <Search strokeWidth={1} color="#000000" />
            </button>
          </div>
        </div>

        {/* Các icon */}
        <div className="flex space-x-4 items-center">
          <button>
            <Star strokeWidth={1} />
          </button>
          <button>
            <ShoppingCart strokeWidth={1} />
          </button>
          <button>
            <CircleUserRound strokeWidth={1} />
          </button>
          <div className="border rounded px-2 py-1">
            <span>🇻🇳</span>
          </div>
        </div>
      </div>
    
    {/* Phần menu điều hướng */}
    <div className="flex justify-center space-x-16 p-2 bg-white shadow-md border-b border-b-primary">
      {navItems.map((item, index) => (
        <Link key={index} to={`/${item.value}`} className="hover:text-hover-primary hover:bg-blue-100 p-2 rounded-xl font-bold cursor-pointer">
          {item.label}
        </Link>
      ))}
    </div>
    </div>
  );
};

export default Header;

// import { Search, Upload } from "lucide-react";

// const Header = () => (
//   <header className="flex justify-between items-center p-4 bg-white shadow">
//     <h1 className="text-2xl font-bold">
//       <span className="text-black">ONIEX</span>
//       <span className="text-blue-600">MINT</span>
//     </h1>
//     <nav className="space-x-6">
//       <a href="#" className="text-gray-600">Discover</a>
//       <a href="#" className="text-gray-600">Resources</a>
//       <a href="#" className="text-gray-600">How it works</a>
//     </nav>
//     <div className="flex gap-4">
//       <div className="relative">
//         <Search className="absolute left-2 top-2 w-5 h-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search"
//           className="pl-10 pr-4 py-2 border rounded-full"
//         />
//       </div>
//       <button className="bg-indigo-700 text-white px-4 py-2 rounded-full flex items-center gap-1">
//         <Upload size={16} />
//         Upload
//       </button>
//     </div>
//   </header>
// );

// export default Header;
