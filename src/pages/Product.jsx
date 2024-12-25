import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Filter from "../components/product/Filter";
import ProductItem from "../components/product/ProductItem";

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
        "https://cdn.shopify.com/s/files/1/0731/6514/4343/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
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
  ];

  return (
    <div>
      <div className="px-4 py-2 bg-gray-200">
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
      <div className="p-4 bg-gray-100 min-h-screen">
        <div className="flex space-x-4">
          <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
            <Filter />
          </div>
          <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductItem
                key={product.id}
                image={product.image}
                category={product.category}
                sku={product.sku}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;