import { useState } from "react";
import {
  Breadcrumb,
  Card,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Form,
  Radio,
  Button,
  List,
  Divider,
  message,
  Modal,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Text } = Typography;

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const addresses = [
    {
      id: 1,
      name: "The 80s iCafe",
      address: "Nguyễn Văn Linh, Phường An Khánh, Quận Ninh Kiều, TP. Cần Thơ",
      phone: "0942463758",
    },
    {
      id: 2,
      name: "Nhà riêng",
      address: "123 Đường ABC, Phường DEF, Quận GHI, TP. Hồ Chí Minh",
      phone: "0987654321",
    },
  ];

  const vouchers = [
    {
      id: 1,
      code: "DISCOUNT10",
      description: "Giảm 10% cho đơn hàng trên 1,000,000đ",
    },
    { id: 2, code: "FREESHIP", description: "Miễn phí vận chuyển" },
  ];

  const cartItems = [
    {
      id: 1,
      name: "New Balance 57/40 Men's Sneakers - Mindful Grey",
      price: 129,
      size: "42 EU - 8.5 US",
      image:
        "https://icons.iconarchive.com/icons/graphicloads/filetype/128/png-icon.png",
    },
    {
      id: 2,
      name: "New Balance 997H Men's Sneakers - Grey",
      price: 119,
      size: "42.5 EU - 9 US",
      image:
        "https://icons.iconarchive.com/icons/graphicloads/filetype/128/png-icon.png",
    },
    {
      id: 3,
      name: "New Balance 57/40 Women's - Oyster Pink",
      price: 149,
      size: "41.5 EU - 8 US",
      image:
        "https://icons.iconarchive.com/icons/graphicloads/filetype/128/png-icon.png",
    },
  ];

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleSubmit = () => {
    form.validateFields().then(() => {
      alert("Thanh toán thành công!");
    });
  };

  const handleSelectAddress = () => {
    if (!selectedAddress) {
      message.error("Vui lòng chọn địa chỉ!");
      return;
    }
    message.success("Địa chỉ được chọn thành công!");
    setIsAddressModalOpen(false);
  };

  const handleApplyVoucher = () => {
    if (!selectedVoucher) {
      message.error("Vui lòng chọn hoặc nhập mã voucher!");
      return;
    }
    message.success(`Áp dụng mã voucher: ${selectedVoucher}`);
    setIsVoucherModalOpen(false);
  };

  return (
    <>
      <div className="px-4 py-2 bg-gray-300">
        <Breadcrumb
          className="text-white"
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              title: "Thanh toán",
            },
          ]}
        />
      </div>

      <div className="p-4 bg-gray-100 min-h-screen">
        <div>
          <Row gutter={16}>
            {/* Summary Order Section */}
            <Col className="w-3/5">
              <Card
                title="Chi tiết đơn hàng"
                bordered={false}
                className="rounded-lg shadow-md bg-white"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={cartItems}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        }
                        title={<Text strong>{item.name}</Text>}
                        description={
                          <div>
                            <Text>Số lượng: {item.size}</Text>
                            <br />
                            <Text strong>${item.price.toFixed(2)}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Payment Details Section */}
            <Col className="w-2/5">
              <Card
                title="Chi tiết thanh toán"
                bordered={false}
                className="rounded-lg shadow-md bg-white"
              >
                <Form layout="vertical" form={form}>
                  <Form.Item
                    label="Địa chỉ nhận hàng"
                    name="shippingInfo"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập thông tin nhận hàng!",
                      },
                    ]}
                  >
                    <Card>
                      <div>
                        <Text strong>
                          {selectedAddress
                            ? addresses.find(
                                (addr) => addr.id === selectedAddress
                              ).name
                            : ""}
                        </Text>
                        <br />
                        <Text>
                          {selectedAddress
                            ? addresses.find(
                                (addr) => addr.id === selectedAddress
                              ).address
                            : ""}
                        </Text>
                        <br />
                        <Text>
                          SĐT:{" "}
                          {selectedAddress
                            ? addresses.find(
                                (addr) => addr.id === selectedAddress
                              ).phone
                            : ""}
                        </Text>
                      </div>
                    </Card>
                    <Button
                      type="link"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      Chọn địa chỉ
                    </Button>
                  </Form.Item>
                  <Form.Item
                    label="Phương thức thanh toán"
                    name="paymentMethod"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phương thức thanh toán!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn phương thức thanh toán"
                      allowClear
                      options={[
                        { label: "Thanh toán khi nhận hàng", value: "cod" },
                        { label: "Thanh toán qua VNPay", value: "vnpay" },
                      ]}
                    ></Select>
                  </Form.Item>
                  <Form.Item
                    label="Mã voucher"
                    name="voucherCode"
                    rules={[
                      {
                        required: false,
                        message: "Vui lòng nhập mã voucher!",
                      },
                    ]}
                  >
                    <Text strong>
                      {selectedVoucher
                        ? `Mã đã chọn: ${selectedVoucher}`
                        : "Chưa có mã giảm giá"}
                    </Text>
                    <br />
                    <Button
                      type="link"
                      onClick={() => setIsVoucherModalOpen(true)}
                    >
                      Chọn voucher
                    </Button>
                  </Form.Item>
                </Form>
                <Divider />
                <div className="mb-5">
                  <Text>Tổng tiền hàng: </Text>
                  <Text strong>${calculateTotal().toFixed(2)}</Text>
                </div>
                <div className="mb-5">
                  <Text>Phí vận chuyển: </Text>
                  <Text strong>${(calculateTotal() * 0.2).toFixed(2)}</Text>
                </div>
                <div className="mb-5">
                  <Text>Giảm: </Text>
                  <Text strong>-${(calculateTotal() * 0.2).toFixed(2)}</Text>
                </div>
                <div className="mb-5 text-lg font-bold">
                  <Text>Tổng: </Text>
                  <Text strong>${(calculateTotal() * 1.2).toFixed(2)}</Text>
                </div>
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleSubmit}
                >
                  Thanh toán ${(calculateTotal() * 1.2).toFixed(2)}
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      {/* Modal Chọn Địa Chỉ */}
      <Modal
        title="Chọn Địa Chỉ Nhận Hàng"
        visible={isAddressModalOpen}
        onCancel={() => setIsAddressModalOpen(false)}
        onOk={handleSelectAddress}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Radio.Group
          onChange={(e) => setSelectedAddress(e.target.value)}
          value={selectedAddress}
          style={{ width: "100%" }}
        >
          {addresses.map((address) => (
            <Card
              key={address.id}
              style={{
                marginBottom: "10px",
                borderRadius: "8px",
                padding: "10px",
                border:
                  selectedAddress === address.id
                    ? "2px solid #1890ff"
                    : "1px solid #d9d9d9",
              }}
              bordered={false}
            >
              <Radio value={address.id} style={{ display: "block" }}>
                <Text strong>{address.name}</Text>
                <br />
                <Text>{address.address}</Text>
                <br />
                <Text>SĐT: {address.phone}</Text>
              </Radio>
            </Card>
          ))}
        </Radio.Group>
      </Modal>

      {/* Modal Chọn Voucher */}
      <Modal
        title="Chọn Mã Giảm Giá"
        visible={isVoucherModalOpen}
        onCancel={() => setIsVoucherModalOpen(false)}
        onOk={handleApplyVoucher}
        okText="Áp dụng"
        cancelText="Hủy"
      >
        <List
          bordered
          dataSource={vouchers}
          renderItem={(voucher) => (
            <List.Item
              onClick={() => setSelectedVoucher(voucher.code)}
              style={{
                cursor: "pointer",
                padding: "10px",
                border:
                  selectedVoucher === voucher.code
                    ? "2px solid #1890ff"
                    : "1px solid #d9d9d9",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <Text strong>{voucher.code}</Text>
              <br />
              <Text>{voucher.description}</Text>
            </List.Item>
          )}
        />
        <Form layout="vertical" form={form}>
          <Form.Item label="Hoặc nhập mã voucher">
            <Input
              placeholder="Nhập mã voucher"
              value={selectedVoucher}
              onChange={(e) => setSelectedVoucher(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CheckoutPage;
