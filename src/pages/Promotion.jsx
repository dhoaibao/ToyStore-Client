import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  Breadcrumb,
  Empty,
  Pagination,
  Spin,
} from "antd";
import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { promotiontService } from "../services";

const { Paragraph, Text } = Typography;

const Promotion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const page = searchParams.get("page") || 1;
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPage, setTotalPage] = useState(50);
  const [loading, setLoading] = useState(false);

  const [promotionts, setPromotions] = useState([]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const result = await promotiontService.getAllPromotions();
        setPromotions(result.data);
        setTotalPage(result.pagination.totalPages);
      } catch (error) {
        console.log("Failed to fetch promotionts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
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
      <div className="px-4 py-2 rounded-sm bg-primary">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              title: "Khuyến mãi",
            },
          ]}
        />
      </div>
      <div className="p-4 min-h-screen">
        <div className="text-center mb-6">
          <h2 className="text-3xl text-center text-primary font-bold mb-2">
            Chương trình khuyến mãi
          </h2>
          <p className="text-lg text-gray-600">
            Cập nhật những ưu đãi hấp dẫn từ cửa hàng của chúng tôi
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : promotionts?.length > 0 ? (
          <List
            grid={{ gutter: 14, column: 2 }}
            dataSource={promotionts}
            renderItem={(promotiont) => (
              <List.Item>
                <Card
                  onClick={() =>
                    navigate(`/products?promotion=${promotiont.promotiontId}`)
                  }
                  hoverable
                  cover={
                    <img
                      alt={promotiont?.promotiontName}
                      src={promotiont?.promotiontThumbnail.url}
                      className="h-52 object-cover rounded-lg"
                    />
                  }
                  className="rounded-2xl overflow-hidden shadow-md"
                >
                  <Card.Meta
                    title={
                      <p className="text-xl font-bold text-primary line-clamp-1">
                        {promotiont?.promotiontName}
                      </p>
                    }
                    description={
                      <>
                        <Paragraph
                          ellipsis={{ rows: 3 }}
                          className="text-base text-gray-700"
                        >
                          {promotiont.description}
                        </Paragraph>
                        <Text className="text-sm text-gray-700">
                          Khuyến mãi đến ngày:{" "}
                          {new Date(promotiont?.endDate).toLocaleDateString()}
                        </Text>
                      </>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <div className="flex items-center justify-center h-screen">
            <Empty description={"Không có khuyến mãi"} />
          </div>
        )}
        {promotionts?.length > 0 && (
          <Pagination
            align="center"
            defaultCurrent={1}
            current={currentPage}
            total={totalPage}
            onChange={handlePageChange}
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
};

export default Promotion;
