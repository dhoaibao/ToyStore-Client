import { useState, useMemo, useEffect } from "react";
import { Button, Breadcrumb, Input, Rate, Spin, Image, message } from "antd";
import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { productService } from "../services";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/thunks/cartThunk";

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const addToCartLoading = useSelector((state) => state.cart.loading);

  useEffect(() => {
    const fetchProduct = async () => {
      if (slug) {
        try {
          const result = await productService.getProductBySlug(slug);
          console.log("result: ", result);
          setProduct(result.data);
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
      item.productInfo.productInfoName === "Tuổi" ? item.value : null
    )
    .filter((item) => item !== null);

  const features = [
    "Bảo Hành 12 Tháng",
    "Cam kết hàng chính hãng",
    "Hỗ Trợ Kỹ Thuật 24/7",
  ];

  const discountedPrice =
    product?.discounts?.reduce((acc, discount) => {
      if (discount.discountType === "percentage") {
        return acc - (acc * discount.discountValue) / 100;
      }

      if (discount.discountType === "fixed_amount") {
        return acc - discount.discountValue;
      }
    }, product?.price) || product?.price;

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    await dispatch(addToCart({ productId: product.productId, quantity }));
    message.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  const images = useMemo(
    () => product?.productImages || [],
    [product?.productImages]
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
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "Nguyễn Văn A",
      rating: 5,
      comment: "Sản phẩm rất tốt, chất lượng tuyệt vời!",
    },
    {
      id: 2,
      user: "Trần Thị B",
      rating: 4,
      comment: "Hàng đẹp, giao nhanh. Nhưng giá hơi cao.",
    },
  ]);

  const [newReview, setNewReview] = useState({
    user: "",
    rating: 0,
    comment: "",
  });

  // Xử lý thêm đánh giá
  const handleAddReview = () => {
    if (newReview.user && newReview.rating > 0 && newReview.comment) {
      setReviews([...reviews, { ...newReview, id: reviews.length + 1 }]);
      setNewReview({ user: "", rating: 0, comment: "" });
    } else {
      alert("Vui lòng điền đầy đủ thông tin đánh giá.");
    }
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
          <div className="px-4 py-2 bg-gray-300">
            <Breadcrumb
              className="text-white"
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
                  src={currentImage?.uploadImage?.url}
                  alt={product?.productName}
                  width={450}
                />
                <div className="flex space-x-4 mt-4 overflow-x-auto no-scrollbar">
                  {images.slice(0, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image.uploadImage.url}
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
                  {product?.discounts ? (
                    <>
                      <p className="text-gray-500 line-through font-semibold">
                        {discountedPrice !== product?.price &&
                          `Giá gốc: ${product?.price?.toLocaleString(
                            "vi-VN"
                          )}đ`}
                      </p>
                      <p className="text-lg text-red-600 font-semibold">
                        Giá hiện tại: {discountedPrice.toLocaleString("vi-VN")}đ
                        {product?.discounts &&
                          product.discounts.map((discount, index) => (
                            <span
                              key={index}
                              className="ml-4 text-white bg-red-600 p-1 rounded-md text-sm"
                            >
                              {discount.discountType === "percentage" &&
                                `-${discount.discountValue}%`}

                              {discount.discountType === "fixed_amount" &&
                                `-${discount.discountValue.toLocaleString(
                                  "vi-VN"
                                )}đ`}

                              {discount.discountType.startsWith("buy_") &&
                                discount.discountType.includes("_get_") &&
                                (() => {
                                  const [x, y] =
                                    discount.discountType.match(/\d+/g);
                                  return `Mua ${x} tặng ${y}`;
                                })()}
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
                <h2 className="text-xl font-bold mb-2">Đánh giá sản phẩm</h2>
                <div className="flex items-center">
                  <Rate disabled defaultValue={Math.round(averageRating)} />
                  <p className="ml-2 text-gray-600">
                    {averageRating.toFixed(1)} / 5 ({reviews.length} đánh giá)
                  </p>
                </div>
              </div>
              <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold mb-4">
                  Thêm đánh giá của bạn
                </h3>
                <div className="mb-4">
                  <Rate
                    value={newReview.rating}
                    onChange={(value) =>
                      setNewReview({ ...newReview, rating: value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Nhận xét:</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    rows="4"
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                  ></textarea>
                </div>
                <button
                  onClick={handleAddReview}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Gửi đánh giá
                </button>
              </div>
              <div className="space-y-4 mt-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-300 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-800">{review.user}</h4>
                      <Rate disabled value={review.rating} />
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
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
