import PropTypes from "prop-types";
import { Rate } from "antd";
import { Link } from "react-router-dom";
import discountedPrice from "../../utils/discountedPrice";
import getCurrentPrice from "../../utils/getCurrentPrice";

const ProductItem = ({
  productImages,
  brand,
  productName,
  slug,
  prices,
  promotionPeriods,
  reviews,
  requiredAge,
}) => {
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 p-4 relative h-96 w-60 border-t-4 border-primary">
      {promotionPeriods.length > 0 &&
        promotionPeriods.map((promotion, index) => (
          <div
            key={index}
            className="absolute shadow-md z-10 top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-tl-md rounded-tr-md rounded-br-md"
          >
            {promotion.discountType === "percentage" &&
              `Giảm ${promotion.discountValue}%`}

            {promotion.discountType === "fixed_amount" &&
              `Giảm ${promotion.discountValue.toLocaleString("vi-VN")}đ`}

            {promotion.discountType.startsWith("buy_") &&
              promotion.discountType.includes("_get_") &&
              (() => {
                const [x, y] = promotion.discountType.match(/\d+/g);
                return `Mua ${x} tặng ${y}`;
              })()}
          </div>
        ))}

      <Link to={`/products/${slug}`}>
        {/* Product Image */}
        <div className=" mt-2 flex justify-center">
          <img
            src={productImages[0].url}
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
            {discountedPrice({ promotionPeriods, prices }).toLocaleString(
              "vi-VN"
            )}
            đ
          </p>
          {discountedPrice({ promotionPeriods, prices }) !==
            getCurrentPrice(prices) && (
            <p className="ml-2 line-through font-semibold text-gray-500">
              {getCurrentPrice(prices).toLocaleString("vi-VN")}đ
            </p>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center mt-2">
        {reviews.length > 0 ? (
          <>
            <Rate disabled allowHalf defaultValue={averageRating} />
            <p className="ml-2 text-sm">{averageRating.toFixed(1)}</p>
          </>
        ) : (
          <span className="text-gray-600 text-sm">
            Chưa có đánh giá
          </span>
        )}
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  productImages: PropTypes.array.isRequired,
  brand: PropTypes.object.isRequired,
  productName: PropTypes.string.isRequired,
  prices: PropTypes.number.isRequired,
  promotionPeriods: PropTypes.array,
  reviews: PropTypes.array,
  slug: PropTypes.string.isRequired,
  requiredAge: PropTypes.number,
};

export default ProductItem;
