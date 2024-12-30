import PropTypes from "prop-types";
import { Rate } from "antd";
import { Link } from "react-router-dom";

const ProductItem = ({
  image,
  category,
  name,
  slug = "abc",
  price,
  discount = 18,
  avgRate = 4.5,
  requiredAge = 13,
}) => {
  const discountedPrice = price - (price * discount) / 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative h-96 w-60">
      {discount > 0 && (
        <div className="absolute z-10 top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-br-lg">
          Giảm {discount}%
        </div>
      )}

      <Link to={`/products/${slug}`}>
        {/* Product Image */}
        <div className=" mt-2 flex justify-center transform transition-all duration-500 ease-in-out hover:scale-110">
          <img
            src={image}
            alt={name}
            className="w-full max-h-60 object-contain"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-2">
        <p className="text-xs font-semibold text-gray-500 uppercase">
          {category}
          {requiredAge > 0 && (
            <span className="ml-2 text-gray-400">{requiredAge}+</span>
          )}
        </p>
        <Link to={`/products/${slug}`}>
          <h3 className="mt-1 text-sm font-medium text-gray-800 sm:line-clamp-2 line-clamp-3">
            {name}
          </h3>
        </Link>
        <div className="flex mt-2 items-center">
          <p className="font-extrabold text-hover-primary">
            {discountedPrice.toLocaleString("vi-VN")}đ
          </p>
          <p className="ml-2 line-through font-semibold text-gray-500">
            {price.toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center mt-2">
        <Rate disabled allowHalf defaultValue={avgRate} />
        <p className="ml-2 text-sm">{avgRate}</p>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  image: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  sku: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  discount: PropTypes.number,
  avgRate: PropTypes.number,
  slug: PropTypes.string.isRequired,
  requiredAge: PropTypes.number.isRequired,
};

export default ProductItem;
