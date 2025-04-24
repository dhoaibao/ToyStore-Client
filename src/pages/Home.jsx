import { Carousel, Button } from "antd";
import ProductItem from "../components/product/ProductItem";
import VoucherSection from "../components/voucher/VoucherSection";
import { recommendationService, categoryService } from "../services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const accessToken = localStorage.getItem("accessToken");

  const navagate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (accessToken) {
          const result = await recommendationService.getRecommendations();
          setProducts(result.data);
        } else {
          const result = await recommendationService.getTrendingProducts();
          setProducts(result.data);
        }
      } catch (error) {
        console.log("Failed to fetch products: ", error);
      }
    };

    fetchProducts();
  }, []);

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

  const carousel = ["/banner1.png", "/banner2.png", "/banner3.png"];

  return (
    <div className="container mx-auto bg-gray-50">
      <div className="w-full h-96 overflow-hidden">
        <Carousel autoplay arrows infinite={false}>
          {carousel.map((item, index) => (
            <div key={index} className="h-full">
              <img
                src={item}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Carousel>
      </div>
      <VoucherSection />
      {/* Featured Products */}
      <section className="mb-4 px-4">
        <hr className="my-4 border-gray-300" />
        <h2 className="text-3xl text-center font-bold text-primary mb-2">
          Sản phẩm dành cho bạn
        </h2>
        <span className="mb-6 bg-primary h-2 rounded flex justify-center w-[50vw] md:w-[30vw] mx-auto"></span>
        <div className="grid grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductItem key={product.id} {...product} />
          ))}
        </div>
      </section>
      {/* Categories */}
      <section className="my-4 p-4">
        <hr className="my-4 border-gray-300" />
        <h2 className="text-3xl text-center text-primary font-bold mb-2">
          Danh mục sản phẩm
        </h2>
        <span className="mb-6 bg-primary h-2 rounded flex justify-center w-[50vw] md:w-[30vw] mx-auto"></span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category?.categoryId}
              className="rounded-lg p-4 text-center shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 border-t-4 border-primary"
            >
              <img
                src={category?.categoryThumbnail.url}
                alt={category?.categoryName}
                className="w-full h-32 object-cover mb-2 rounded-xl"
              />
              <h3 className="font-semibold text-xl">
                {category?.categoryName}
              </h3>
              <Button
                onClick={() =>
                  navagate(`/products?categoryNames=${category?.categoryName}`)
                }
                type="primary"
                className="mt-4 px-6 py-2 font-medium rounded-lg"
              >
                Xem Thêm
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
