import { Button, Card, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { ShoppingCart, Star } from "lucide-react";
import Filter from "../components/product/Filter";
import ProductItem from "../components/product/ProductItem";

const Product = () => {
  const products = [
    {
      id: 1,
      name: "Product 1",
      price: "$100",
      image: "https://via.placeholder.com/150",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Product 2",
      price: "$200",
      image: "https://via.placeholder.com/150",
      rating: 4.0,
    },
    // Add more products as needed
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
      <div className="p-2 bg-gray-100 min-h-screen">
        <div className="flex space-x-4">
          <div className="w-1/4 bg-white p-4 rounded-lg shadow-md">
            <Filter />
          </div>
          <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           < ProductItem/>
            {products.map((product) => (
              <Card
                key={product.id}
                cover={
                  <img
                    alt={product.name}
                    src={product.image}
                    className="h-64 object-cover"
                  />
                }
                className="rounded-lg shadow-md overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <span className="flex items-center text-yellow-500">
                    <Star className="w-5 h-5 mr-1" /> {product.rating}
                  </span>
                </div>
                <p className="text-lg font-medium text-gray-800 mb-4">
                  {product.price}
                </p>
                <Button type="primary" icon={<ShoppingCart />}>
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
