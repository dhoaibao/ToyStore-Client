import { Heart } from "lucide-react";
import PropTypes from "prop-types";

const ProductCard = ({ image, category, sku, name, price }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 relative w-64 transform transition-transform hover:scale-105 hover:shadow-xl">
      {/* Product Image */}
      <div className="flex justify-center">
        <img
          src={image}
          alt={name}
          className="w-full max-h-60 object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase">
          {category} <span className="ml-2 text-gray-400">SKU: {sku}</span>
        </p>
        <h3 className="mt-1 text-sm font-medium text-gray-800 sm:line-clamp-2 line-clamp-3">
          {name}
        </h3>
        <p className="mt-2 text-lg font-bold text-primary">
          {price.toLocaleString("vi-VN")}₫
        </p>
      </div>

      {/* Add to Cart and Wishlist */}
      <div className="mt-4 flex justify-between items-center">
        <button className="bg-primary text-white text-sm py-2 px-4 rounded-lg hover:bg-hover-primary">
          Thêm Vào Giỏ Hàng
        </button>
        <button className="hover:text-red-500">
          <Heart size={20} />
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  sku: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default ProductCard;
