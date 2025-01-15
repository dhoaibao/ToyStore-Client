import PropTypes from "prop-types";
import { Rate } from "antd";
import { Link } from "react-router-dom";

const ProductItem = ({
  productImages,
  brand,
  productName,
  slug,
  price,
  discounts,
  avgRate = 4.5,
  requiredAge,
}) => {
  const discountedPrice =
    discounts?.reduce((acc, discount) => {
      if (discount.discountType === "percentage") {
        return acc - (acc * discount.discountValue) / 100;
      }

      if (discount.discountType === "fixed_amount") {
        return acc - discount.discountValue;
      }
    }, price) || price;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 relative h-96 w-60">
      {discounts &&
        discounts.map((discount) => (
          <div
            key={discount.id}
            className="absolute z-10 top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-br-lg"
          >
            {discount.discountType === "percentage" &&
              `Giảm ${discount.discountValue}%`}

            {discount.discountType === "fixed_amount" &&
              `Giảm ${discount.discountValue.toLocaleString("vi-VN")}đ`}

            {discount.discountType.startsWith("buy_") &&
              discount.discountType.includes("_get_") &&
              (() => {
                const [x, y] = discount.discountType.match(/\d+/g);
                return `Mua ${x} tặng ${y}`;
              })()}
          </div>
        ))}

      <Link to={`/products/${slug}`}>
        {/* Product Image */}
        <div className=" mt-2 flex justify-center transform transition-all duration-500 ease-in-out hover:scale-110">
          <img
            src={productImages[0].uploadImage.url}
            alt={productName}
            className="w-full max-h-60 object-contain"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-2">
        <p className="text-xs font-semibold text-gray-500 uppercase">
          {brand?.brandName}
          {requiredAge > 0 && (
            <span className="ml-2 text-gray-400">{requiredAge}+</span>
          )}
        </p>
        <Link to={`/products/${slug}`}>
          <h3 className="mt-1 text-sm font-medium text-gray-800 sm:line-clamp-2 line-clamp-3">
            {productName}
          </h3>
        </Link>
        <div className="flex mt-2 items-center">
          <p className="font-extrabold text-hover-primary">
            {discountedPrice.toLocaleString("vi-VN")}đ
          </p>
          {discountedPrice !== price && (
            <p className="ml-2 line-through font-semibold text-gray-500">
              {price.toLocaleString("vi-VN")}đ
            </p>
          )}
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
  productImages: PropTypes.array.isRequired,
  brand: PropTypes.object.isRequired,
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  discounts: PropTypes.array,
  avgRate: PropTypes.number,
  slug: PropTypes.string.isRequired,
  requiredAge: PropTypes.number,
};

export default ProductItem;
