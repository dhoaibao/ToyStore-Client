import { useState, useEffect } from "react";
import { Card, Typography, List, Button, Modal, Pagination, Space } from "antd";
import { newsService } from "../services/news.service";
import moment from "moment";

const { Title, Text } = Typography;

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const result = await newsService.getAllNews(`page=${currentPage}`);
        setNews(result.data);
        setTotalPage(result.pagination.totalPages);
      } catch (error) {
        console.log("Failed to fetch news: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  const handleReadMore = (article) => {
    setSelectedNews(article);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedNews(null);
    setIsModalVisible(false);
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Title level={2} style={{ fontWeight: "bold", color: "#333" }}>
          Tin Tức Cửa Hàng
        </Title>
        <Text style={{ fontSize: "16px", color: "#555" }}>
          Cập nhật những tin tức mới nhất từ cửa hàng của chúng tôi
        </Text>
      </div>

      <List
        grid={{ gutter: 24, column: 2 }}
        dataSource={news}
        renderItem={(article) => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt={article.title}
                  src={article.thumbnail.url}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              }
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Meta
                title={
                  <Title
                    level={4}
                    ellipsis={{ rows: 2 }}
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {article.title}
                  </Title>
                }
                description={
                  <>
                    <div
                      dangerouslySetInnerHTML={{ __html: article.content }}
                      style={{
                        fontSize: "14px",
                        color: "#555",
                        marginBottom: "10px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    />
                    <Text style={{ fontSize: "12px", color: "#888" }}>
                      Ngày đăng:{" "}
                      {moment(article.createdAt).format("DD/MM/YYYY")}
                    </Text>
                  </>
                }
              />
              <div style={{ marginTop: "10px", textAlign: "center" }}>
                <Button type="primary" onClick={() => handleReadMore(article)}>
                  Đọc thêm
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Pagination
        align="center"
        defaultCurrent={1}
        current={currentPage}
        total={totalPage}
        pageSize={10}
        onChange={(page) => setCurrentPage(page)}
      />

      <Modal
        title={<Title level={4}>{selectedNews?.title}</Title>}
        open={isModalVisible}
        onCancel={closeModal}
        width={700}
        footer={null}
      >
        {selectedNews && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* <img
              src={selectedNews.thumbnail.url}
              alt={selectedNews.title}
              style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: "20px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            /> */}
            <div
              dangerouslySetInnerHTML={{ __html: selectedNews.content }}
              className="text-base"
            />
            <Text className="text-gray-500">
              Ngày đăng: {moment(selectedNews.createdAt).format("DD/MM/YYYY")}
            </Text>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default NewsPage;
