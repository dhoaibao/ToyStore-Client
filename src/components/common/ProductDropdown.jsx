import { useState } from "react";

const DropdownWithBanners = () => {
  const [isOpen, setIsOpen] = useState(false);

  const banners = [
    {
      id: 1,
      title: "LEGO -30%",
      image: "https://via.placeholder.com/300x150?text=LEGO+-30%",
    },
    {
      id: 2,
      title: "Ưu đãi độc quyền online",
      image: "https://via.placeholder.com/300x150?text=Ưu+đãi+online",
    },
    {
      id: 3,
      title: "Clever Hippo",
      image: "https://via.placeholder.com/300x150?text=Clever+Hippo",
    },
  ];

  return (
    <div className="relative">
      {/* Trigger Dropdown */}
      <button
      
        onClick={() => setIsOpen(!isOpen)}
        className={`${
            location.pathname === `/products`
              ? "text-hover-primary"
              : "hover:text-hover-primary"
          } p-2 rounded-xl font-bold cursor-pointer`}
      >
        Sản phẩm
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute left-0 w-screen max-w-5xl mt-2 bg-white shadow-lg rounded-lg z-50">
          <div className="grid grid-cols-3 gap-4 p-4">
            {banners.map((banner) => (
              <a
                key={banner.id}
                href="#"
                className="flex flex-col items-center group"
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-32 object-cover rounded-md shadow group-hover:shadow-lg transition-shadow"
                />
                <p className="mt-2 font-semibold text-gray-700 group-hover:text-red-500 transition-colors">
                  {banner.title}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownWithBanners;
