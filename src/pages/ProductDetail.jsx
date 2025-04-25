import { useState, useMemo, useEffect } from "react";
import { Button, Breadcrumb, Input, Rate, Spin, Image, message } from "antd";
import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { productService } from "../services";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/thunks/cartThunk";
import moment from "moment";
import discountedPrice from "../utils/discountedPrice";

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const addToCartLoading = useSelector((state) => state.cart.loading);
  const isLogin = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    const fetchProduct = async () => {
      if (slug) {
        try {
          const result = await productService.getProductBySlug(slug);
          setProduct(result.data);
          if (result.data.reviews) {
            setReviews(result.data.reviews);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [slug]);

  const requiredAge = product?.productInfoValues
    .map((item) =>
      item.productInfo.productInfoName === "Tuổi" ? item.value : null,
    )
    .filter((item) => item !== null);

  const features = [
    "Bảo Hành 12 Tháng",
    "Cam kết hàng chính hãng",
    "Hỗ Trợ Kỹ Thuật 24/7",
  ];

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      if (isLogin) {
        dispatch(addToCart({ productId: product.productId, quantity }));
      } else {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find((item) => item.slug === product.slug);
        if (existingProduct) {
          cart = cart.map((item) =>
            item.slug === product.slug
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        } else {
          cart.push({ slug: product.slug, quantity });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Cart", cart);
      }
      message.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.log("Error when add to cart: ", error);
      message.error("Đã xảy ra lỗi!");
    }
  };

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  const images = useMemo(
    () => product?.productImages || [],
    [product?.productImages],
  );

  const [currentImage, setCurrentImage] = useState({});

  useEffect(() => {
    if (images.length > 0) {
      setCurrentImage(images[0]);
    }
  }, [images]);

  const handleQuantityChange = (value) => {
    if (value === "increase") {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else if (value === "decrease" && quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    } else {
      const numericValue = Number(value);
      if (!isNaN(numericValue) && numericValue > 0) {
        setQuantity(numericValue);
      }
    }
  };
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Tính trung bình sao
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        <div>
          <div className="px-4 py-2 rounded-sm bg-primary">
            <Breadcrumb
              items={[
                {
                  href: "/",
                  title: <HomeOutlined />,
                },
                {
                  href: "/products",
                  title: "Sản phẩm",
                },
                {
                  title: product?.productName,
                },
              ]}
            />
          </div>
          <div className="container mx-auto p-4 flex flex-col md:flex-row">
            <div className="w-full p-4">
              <div className="flex flex-col items-center p-2">
                <Image
                  src={currentImage?.url}
                  alt={product?.productName}
                  width={450}
                />
                <div className="flex space-x-4 mt-4 overflow-x-auto no-scrollbar">
                  {images.slice(0, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Hình ảnh ${index + 1}`}
                      className={`w-20 h-20 cursor-pointer object-contain border rounded-lg
        ${currentImage === image ? "border-cyan-700" : "border-gray-300"}
        hover:border-cyan-700`}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="w-full p-4">
                <h1 className="text-2xl font-semibold">
                  {product?.productName}
                </h1>
                <p className="mt-2">
                  Thương hiệu:{" "}
                  <span className="text-hover-primary">
                    {product?.brand?.brandName}
                  </span>{" "}
                  | {requiredAge}+
                </p>
                <div className="mt-4">
                  {product?.promotionPeriods.length > 0 ? (
                    <>
                      <p className="text-gray-500 line-through font-semibold">
                        {discountedPrice(product) !== product?.price &&
                          `Giá gốc: ${product?.price?.toLocaleString(
                            "vi-VN",
                          )}đ`}
                      </p>
                      <p className="text-lg text-red-600 font-semibold">
                        Giá hiện tại:{" "}
                        {discountedPrice(product).toLocaleString("vi-VN")}đ
                        {product?.promotionPeriods.length > 0 &&
                          product.promotionPeriods.map((promotion, index) => (
                            <span key={index}>
                              <span
                                key={index}
                                className="ml-4 text-white bg-red-600 p-1 rounded-md text-sm"
                              >
                                {promotion.discountType === "percentage" &&
                                  `-${promotion.discountValue}%`}

                                {promotion.discountType === "fixed_amount" &&
                                  `-${promotion.discountValue.toLocaleString(
                                    "vi-VN",
                                  )}đ`}

                                {promotion.discountType.startsWith("buy_") &&
                                  promotion.discountType.includes("_get_") &&
                                  (() => {
                                    const [x, y] =
                                      promotion.discountType.match(/\d+/g);
                                    return `Mua ${x} tặng ${y}`;
                                  })()}
                              </span>
                              <br />
                              <span className="text-sm font-normal text-gray-800 italic">
                                (Thời gian khuyến mãi:{" "}
                                {moment(promotion.startDate).format(
                                  "DD/MM/YYYY",
                                )}{" "}
                                -{" "}
                                {moment(promotion.endDate).format("DD/MM/YYYY")}
                                )
                              </span>
                            </span>
                          ))}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg text-red-600 font-semibold">
                      Giá: {product?.price?.toLocaleString("vi-VN")}đ
                    </p>
                  )}
                </div>
                {/* <CountDown /> */}
                <ul className="mt-4 space-y-2 ">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">✔️</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4">
                <p className="text-xl font-semibold">Số lượng:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex justify-center h-12 items-center space-x-1 rounded-md">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      className="bg-gray-200 h-full px-4 py-1 rounded text-gray-600"
                    >
                      -
                    </button>
                    <Input
                      className="w-16 h-full text-center"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      min={1}
                      variant={"outlined"}
                    />
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      className="bg-gray-200 h-full px-4 py-1 rounded text-gray-600"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    type="primary"
                    className="w-full h-12 text-lg font-bold text-white"
                    onClick={handleAddToCart}
                    loading={addToCartLoading}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </div>
                <div className="container mx-auto mt-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Thông tin sản phẩm
                  </h2>
                  <div className="flex flex-col items-center">
                    <table className="table-auto border-collapse w-full text-left rounded-lg shadow-lg overflow-hidden">
                      <tbody className="divide-y divide-gray-200">
                        {product?.productInfoValues.map((item, index) => (
                          <tr
                            key={index}
                            className={`${
                              !isExpanded && index > 3 ? "hidden" : ""
                            } ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                          >
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {item?.productInfo.productInfoName}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {item?.value || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      onClick={toggleExpand}
                      className="text-red-600 text-center font-medium mt-2 hover:underline"
                    >
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-4 px-4 pb-6">
            <hr className="my-4 border-gray-300" />
            <h2 className="text-xl font-bold mb-2">Mô tả sản phẩm</h2>
            <div dangerouslySetInnerHTML={{ __html: product?.description }} />
          </div>

          <div className="px-4">
            <hr className="my-4 border-gray-300" />
            <div className="container mx-auto p-4">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">
                  Đánh giá sản phẩm
                </h2>
                <div className="flex items-center space-x-2">
                  {reviews.length > 0 ? (
                    <>
                      <Rate disabled allowHalf defaultValue={averageRating} />
                      <span className="text-gray-600 text-base">
                        {averageRating.toFixed(1)} / 5 ({reviews.length} đánh giá)
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-600 text-base">
                      Chưa có đánh giá nào cho sản phẩm này
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6 mt-6">
                {reviews.map((review) => (
                  <div
                    key={review.reviewId}
                    className="flex flex-col space-y-4 border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                  >
                    {/* Avatar hoặc chữ đại diện */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-lg uppercase">
                        {review.user.fullName.charAt(0)}
                      </div>

                      {/* Nội dung đánh giá */}
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-base font-bold text-gray-800">
                            {review.user.fullName}
                          </h4>
                          <Rate
                            disabled
                            allowHalf
                            value={review.rating}
                            className="text-lg"
                          />
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>

                    {/* Hình ảnh đánh giá */}
                    {review.uploadImages?.length > 0 && (
                      <div className="flex space-x-4 mt-2">
                        {review.uploadImages.map((image, index) => (
                          <Image
                            key={index}
                            src={image.url}
                            alt={`Review Image ${index + 1}`}
                            width={100}
                            className="rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    {/* Trả lời đánh giá */}
                    {review.childrenReviews?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {review.childrenReviews.map((childReview) => (
                          <div
                            key={childReview.reviewId}
                            className="flex items-start space-x-4 border border-gray-200 rounded-lg p-3 bg-gray-50"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-semibold text-sm uppercase">
                              {childReview.user.fullName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-gray-800">
                                {childReview.user.fullName}
                              </h4>
                              <p className="text-gray-700 text-sm">
                                {childReview.comment}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
