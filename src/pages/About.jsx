import { Layout, Typography, Row, Col, Card } from "antd";
import { Truck, ShoppingCart, Star } from "lucide-react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Content, Footer } = Layout;

const About = () => {
  return (
    <Layout className="min-h-screen">
      <div className="px-4 py-2 bg-gray-200">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              title: "Giới thiệu",
            },
          ]}
        />
      </div>
      {/* Nội dung chính */}
      <Content className="px-8 py-16">
        <div className="text-center mb-12">
          <Title level={2}>Giới thiệu về ToyStore</Title>
          <Paragraph className="text-lg">
            ToyStore là cửa hàng chuyên cung cấp các loại đồ chơi chất lượng cao cho trẻ em, với mục tiêu mang đến sự vui vẻ và sáng tạo cho trẻ em ở mọi độ tuổi. Chúng tôi luôn đảm bảo mỗi sản phẩm là sự lựa chọn tuyệt vời cho các bậc phụ huynh.
          </Paragraph>
        </div>

        <Row gutter={16} justify="center">
          {/* Thẻ 1: Lựa chọn đa dạng */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              className="shadow-lg"
              hoverable
              cover={<img alt="selection" src="https://via.placeholder.com/200" />}
            >
              <Card.Meta
                title="Lựa chọn đa dạng"
                description="Chúng tôi có một bộ sưu tập đồ chơi đa dạng, phù hợp với mọi sở thích của trẻ em."
              />
              <div className="flex items-center mt-4">
                <ShoppingCart size={24} className="text-blue-600 mr-2" />
                <span>Vô vàn lựa chọn</span>
              </div>
            </Card>
          </Col>

          {/* Thẻ 2: Giao hàng nhanh chóng */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              className="shadow-lg"
              hoverable
              cover={<img alt="delivery" src="https://via.placeholder.com/200" />}
            >
              <Card.Meta
                title="Giao hàng nhanh chóng"
                description="ToyStore cam kết giao hàng nhanh chóng đến tận tay khách hàng trong thời gian ngắn nhất."
              />
              <div className="flex items-center mt-4">
                <Truck size={24} className="text-green-600 mr-2" />
                <span>Nhanh chóng và an toàn</span>
              </div>
            </Card>
          </Col>

          {/* Thẻ 3: Đánh giá khách hàng */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              className="shadow-lg"
              hoverable
              cover={<img alt="customer" src="https://via.placeholder.com/200" />}
            >
              <Card.Meta
                title="Hài lòng khách hàng"
                description="ToyStore luôn nhận được những đánh giá tích cực từ khách hàng vì chất lượng sản phẩm và dịch vụ."
              />
              <div className="flex items-center mt-4">
                <Star size={24} className="text-yellow-500 mr-2" />
                <span>Được yêu thích bởi khách hàng</span>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>

      {/* Footer */}
      <Footer className="bg-gray-800 text-white text-center py-4">
        ToyStore © 2024 | Tất cả quyền được bảo lưu
      </Footer>
    </Layout>
  );
};

export default About;
