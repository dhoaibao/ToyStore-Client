import { Breadcrumb, Empty, Pagination } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Filter from "../components/product/Filter";
import ProductItem from "../components/product/ProductItem";
import SortBar from "../components/product/SortBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Product = () => {
  const products = [
    {
      id: 1,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
    {
      id: 2,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/76290.jpg?v=1727170924&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
    {
      id: 3,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
    {
      id: 4,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
    {
      id: 5,
      image:
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
      category: "LEGO SUPERHEROES",
      sku: "76293",
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 Lego Superheroes 76293",
      price: 1179000,
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const page = searchParams.get("page") || 1;
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPage, setTotalPage] = useState(50);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const updateQuery = (key, value) => {
    searchParams.set(key, value);
    navigate({ search: searchParams.toString() });
  };

  const handlePageChange = (page) => {
    updateQuery("page", page);
  };

  console.log(searchParams.toString());

  return (
    <div>
      <div className="px-4 py-2 rounded-md bg-gray-300">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              title: "Sản phẩm",
            },
          ]}
        />
      </div>
      <div className="p-4 ">
        <div>
          <div className="flex space-x-4">
            <div className="w-1/5 bg-white p-4 rounded-lg shadow-md">
              <Filter />
            </div>
            <div className="w-4/5">
              <SortBar />
              {products?.length > 0 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {products.map((product) => (
                    <ProductItem key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Empty description={"Không có sản phẩm"} />
                </div>
              )}
            </div>
          </div>
          {products?.length > 0 && (
            <Pagination
              align="center"
              defaultCurrent={1}
              current={currentPage}
              total={totalPage}
              onChange={handlePageChange}
              className="mt-4"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
