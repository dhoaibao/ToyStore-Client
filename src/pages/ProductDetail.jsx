import { useState, useMemo } from "react";
import { Button, Breadcrumb, Input, Rate } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const ProductDetail = () => {
  const product = {
    images: [
      "https://www.mykingdom.com.vn/cdn/shop/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=1100",
      "https://www.mykingdom.com.vn/cdn/shop/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_3.jpg?v=1733712457&width=1100",
    ],
    name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 LEGO SUPERHEROES 76293",
    brand: "LEGO SUPERHEROES",
    price: 1179000,
    discount: 18,
    requiredAge: 13,
    features: [
      "Hàng Chính Hãng",
      "Miễn Phí Giao Hàng Toàn Quốc Đơn Trên 500k",
      "Giao Hàng Hỏa Tốc 4 Tiếng",
    ],
    description: `
        <h2>Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 LEGO SUPERHEROES 76293 (246 chi tiết)</h2>
<p>- Hãy bắt đầu kỳ nghỉ thật đặc biệt cùng Lịch Mùa Vọng Lego® Marvel Spider-Man 2024!</p>
<p>- Mỗi ngày, mở một cánh cửa để khám phá bất ngờ thú vị từ thế giới Spider-Man. Trong đó có 5 nhân vật nhỏ, nhiều mô hình mini, phụ kiện ngầu và vô vàn niềm vui mùa đông.&nbsp;</p>
<p>- Khi ngày lễ lớn đến gần, hãy kết hợp các món quà lại để tái hiện những cảnh phim yêu thích hoặc tạo ra các cuộc phiêu lưu Marvel của riêng bạn!</p>
<p>- Lịch mùa vọng với 24 món quà bất ngờ về Spider-Man dành cho bé từ 7 tuổi trở lên.</p>
<p>- Các mô hình nhỏ bao gồm Spider-Ham tuyết, xe bán xúc xích và cây mùa đông của Electro.</p>
<p>- Nhân vật mini gồm Spider-Man, Green Goblin, Miles Morales, Ghost-Spider và Venom.</p>
<p>- Bé có thể kết hợp các món quà để tái hiện cảnh phim hoặc sáng tạo những cuộc phiêu lưu của riêng mình.</p>
<p>- Một món quà Giáng Sinh tuyệt vời, mang niềm vui kéo dài ngay cả sau khi mở cánh cửa cuối cùng.</p>
<p>- Các món quà trong lịch tương thích với các bộ Lego® Marvel khác (bán riêng).</p>
<p>- Bộ Lego® Marvel mở ra vô vàn khả năng xây dựng và chơi sáng tạo.</p>
<p>- Hãy làm cho mùa lễ hội năm nay thật đặc biệt với 24 ngày quà tặng bất ngờ từ Spider-Man!&nbsp;</p>
    `,
  };

  const discountedPrice =
    product?.price - (product?.price * product?.discount) / 100;

  const [quantity, setQuantity] = useState(1);

  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  const images = useMemo(() => product.images || [], [product.images]);

  const [currentImage, setCurrentImage] = useState(images[0]);

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

  const productDetails = [
    { label: "Chủ đề", value: "" },
    { label: "Xuất xứ", value: "Cộng Hòa Séc" },
    { label: "Mã VT", value: "" },
    { label: "Tuổi", value: "7 tuổi trở lên" },
    { label: "Thương hiệu", value: "LEGO SUPERHEROES" },
    { label: "Xuất xứ thương hiệu", value: "Đan Mạch" },
  ];

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
              title:
                "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 LEGO SUPERHEROES 76293",
            },
          ]}
        />
      </div>
      <div className="container mx-auto p-4 flex flex-col md:flex-row">
        <div className="w-full p-4">
          <div className="flex flex-col items-center p-2">
            <img
              src={
                String(currentImage).startsWith("http")
                  ? currentImage
                  : `http://localhost:3000/${String(currentImage).replace(
                      /\\/g,
                      "/"
                    )}`
              }
              alt={product.name}
              className="w-96 h-96 object-contain"
            />
            {/* Thêm container cho hình ảnh nhỏ có thể cuộn ngang khi màn hình nhỏ */}
            <div className="flex space-x-4 mt-4 overflow-x-auto no-scrollbar">
              {/* Đặt chiều rộng cố định cho các hình ảnh để chúng không co lại quá nhiều */}
              {images.slice(0, 5).map((image, index) => (
                <img
                  key={index}
                  src={
                    String(image).startsWith("http")
                      ? image
                      : `http://localhost:3000/${String(image).replace(
                          /\\/g,
                          "/"
                        )}`
                  }
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
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="mt-2">
              Thương hiệu:{" "}
              <span className="text-hover-primary">{product.brand}</span> |{" "}
              {product.requiredAge}+
            </p>
            <div className="mt-4">
              <p className="text-gray-500 line-through font-semibold">
                Giá gốc: {product.price.toLocaleString("vi-VN")}đ
              </p>
              <p className="text-lg text-red-600 font-semibold">
                Giá hiện tại: {discountedPrice.toLocaleString("vi-VN")}đ
                <span className="ml-4 text-white bg-red-600 p-1 rounded-md text-sm">
                  -{product.discount}%
                </span>
              </p>
            </div>
            <ul className="mt-4 space-y-2 ">
              {product.features.map((feature, index) => (
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
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
            <div className="container mx-auto mt-4">
              <h2 className="text-xl font-semibold mb-4">Thông tin sản phẩm</h2>
              <div className="flex flex-col items-center">
                <table className="table-auto border-collapse w-full text-left rounded-lg shadow-lg overflow-hidden">
                  <tbody className="divide-y divide-gray-200">
                    {productDetails.map((detail, index) => (
                      <tr
                        key={index}
                        className={`${
                          !isExpanded && index > 2 ? "hidden" : ""
                        } ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-700">
                          {detail.label}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {detail.value || "-"}
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
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>

      {/*Rating */}
      <div className="px-4">
        <hr className="my-4 border-gray-300" />
        <div className="container mx-auto p-4">
          {/* Tổng sao đánh giá */}
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
            <h3 className="text-lg font-bold mb-4">Thêm đánh giá của bạn</h3>
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
          {/* Danh sách đánh giá */}
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
  );
};

export default ProductDetail;
