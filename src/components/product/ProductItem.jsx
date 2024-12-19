import { Card, Typography, Row, Col } from 'antd';

const ProductItem = () => {
  return (
    <Card className="bg-white shadow-md rounded-lg p-4">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Typography.Title level={4} className="text-blue-500">
            Economy Saver
          </Typography.Title>
          <Typography.Text className="text-gray-600">
            UK + BD
          </Typography.Text>
        </Col>
        <Col span={12}>
          <Typography.Title level={4} className="text-gray-600">
            6 Flight Tickets
          </Typography.Title>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Typography.Text className="text-gray-600">
            Passenger: Math Done
          </Typography.Text>
          <Typography.Text className="text-gray-600">
            Date: 30 Jan 2021
          </Typography.Text>
        </Col>
        <Col span={12}>
          <Typography.Text className="text-gray-600">
            Flight: 948264846
          </Typography.Text>
          <Typography.Text className="text-gray-600">
            Gate: 77 B
          </Typography.Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Typography.Text className="text-gray-600">
            Class: Economy
          </Typography.Text>
        </Col>
        <Col span={12}>
          <Typography.Text className="text-gray-600">
            Seats: 17 B - 25 B
          </Typography.Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className="flex justify-center">
            {/* <BarCodeIcon className="text-gray-600" /> */}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductItem;