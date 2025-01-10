import { Breadcrumb, Empty, Pagination, Spin } from "antd";
import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import Filter from "../components/product/Filter";
import ProductItem from "../components/product/ProductItem";
import SortBar from "../components/product/SortBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { productService } from "../services";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  console.log(searchParams.toString());

  const page = searchParams.get("page") || 1;
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPage, setTotalPage] = useState(50);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await productService.getAllProducts();
        setProducts(result.data);
        setTotalPage(result.pagination.totalPages);
      } catch (error) {
        console.log("Failed to fetch products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateQuery = (key, value) => {
    searchParams.set(key, value);
    navigate({ search: searchParams.toString() });
  };

  const handlePageChange = (page) => {
    updateQuery("page", page);
  };

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
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
              ) : products?.length > 0 ? (
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
