import { Breadcrumb, Empty, Pagination, Spin } from "antd";
import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import ProductItem from "../components/product/ProductItem";
import SortBar from "../components/product/SortBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { productService } from "../services";

const Search = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const page = searchParams.get("page") || 1;
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPage, setTotalPage] = useState(50);

  const { imageSearchData } = location.state || {};

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let result;
        if (searchParams.has("image") && imageSearchData) {
          result = await productService.imageSearch(imageSearchData);
        } else {
          result = await productService.getAllProducts(searchParams.toString());
        }
        setProducts(result.data);
        setTotalPage(result.pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, imageSearchData]);

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

  return (
    <div>
      <div className="px-4 py-2 rounded-sm bg-primary">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              title: searchParams.has("image")
                ? "Kết quả tìm kiếm bằng hình ảnh"
                : `Tìm kiếm cho từ khóa: "${searchParams.get("keyword")}"`,
            },
          ]}
        />
      </div>
      <div className="p-4 ">
        <div>
          <div className="flex space-x-4">
            <div className="w-full">
              <SortBar />
              {loading ? (
                <div className="flex items-center justify-center h-screen">
                  <Spin indicator={<LoadingOutlined spin />} size="large" />
                </div>
              ) : products?.length > 0 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {products.map((product) => {
                    const requiredAge = product?.productInfoValues
                      .map((item) =>
                        item.productInfo.productInfoName === "Tuổi"
                          ? item.value
                          : null
                      )
                      .filter((item) => item !== null);
                    return (
                      <ProductItem
                        key={product.id}
                        {...product}
                        requiredAge={requiredAge}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-screen">
                  <Empty description={"Không tìm thấy sản phẩm!"} />
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

export default Search;
