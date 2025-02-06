import { useState, useEffect, useMemo } from "react";
import {
  Breadcrumb,
  Card,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Form,
  Button,
  List,
  Divider,
  message,
  Modal,
  Empty,
} from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GHNService } from "../services";
import { useSelector, useDispatch } from "react-redux";
import { getAddressByUser } from "../redux/thunks/addressThunk";

const { Text } = Typography;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);

  const addresses = useSelector((state) => state.address.addresses);

  const { orderItems } = location.state || [];

  useEffect(() => {
    dispatch(getAddressByUser());
  }, [dispatch]);

  useEffect(() => {
    const defaultAddress = addresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.addressId);
    }
  }, [addresses]);

  const calculateShippingFee = async (address, quantity) => {
    try {
      const fee = await GHNService.getShippingFee(address, quantity);
      setShippingFee(fee);
    } catch (error) {
      console.error("Error calculating shipping fee:", error);
      message.error("Không thể tính phí vận chuyển.");
    }
  };

  useEffect(() => {
    if (selectedAddress) {
      const address = addresses.find(
        (item) => item.addressId === selectedAddress
      );
      const quantity = orderItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      calculateShippingFee(address, quantity);
    }
  }, [selectedAddress, orderItems, addresses]);

  console.log(shippingFee);

  const addressString = useMemo(
    () => (address) =>
      `${address.detail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
    []
  );

  const vouchers = [
    {
      id: 1,
      code: "DISCOUNT10",
      description: "Giảm 10% cho đơn hàng trên 1,000,000đ",
    },
    { id: 2, code: "FREESHIP", description: "Miễn phí vận chuyển" },
  ];

  const discountedPriceTotal = () => {
    return orderItems?.reduce(
      (total, item) => total + discountedPrice(item.product) * item.quantity,
      0
    );
  };

  const priceTotal = () => {
    return orderItems?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    return discountedPriceTotal() + 20000;
  };

  const handleSubmit = () => {
    form.validateFields().then(() => {
      alert("Thanh toán thành công!");
    });
  };

  const handleApplyVoucher = () => {
    if (!selectedVoucher) {
      message.error("Vui lòng chọn hoặc nhập mã voucher!");
      return;
    }
    message.success(`Áp dụng mã voucher: ${selectedVoucher}`);
    setIsVoucherModalOpen(false);
  };

  const discountedPrice = (product) => {
    return (
      product?.discounts?.reduce((acc, discount) => {
        if (discount.discountType === "percentage") {
          return acc - (acc * discount.discountValue) / 100;
        }

        if (discount.discountType === "fixed_amount") {
          return acc - discount.discountValue;
        }
        return acc;
      }, product?.price) || product?.price
    );
  };

  return (
    <>
      <div className="px-4 py-2 rounded-sm bg-primary">
        <Breadcrumb
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
          <Row gutter={12}>
            {/* Summary Order Section */}
            <Col className="w-3/5">
              <Col className="w-full mb-4">
                <Card
                  title={
                    <Text strong className="text-lg">
                      Địa chỉ nhận hàng
                    </Text>
                  }
                >
                  {selectedAddress ? (
                    <div>
                      <Text>
                        <b>Địa chỉ: </b>
                        {addressString(
                          addresses.find(
                            (addr) => addr.addressId === selectedAddress
                          )
                        )}
                      </Text>
                      <br />
                      <Text>
                        <b>Người nhận: </b>
                        {
                          addresses.find(
                            (addr) => addr.addressId === selectedAddress
                          ).contactName
                        }
                      </Text>
                      <br />
                      <Text>
                        <b>Số điện thoại: </b>
                        {
                          addresses.find(
                            (addr) => addr.addressId === selectedAddress
                          ).contactPhone
                        }
                      </Text>
                    </div>
                  ) : (
                    <Empty description="Không có địa chỉ được chọn" />
                  )}
                  <div className="flex items-center justify-center">
                    <Button
                      type="link"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      Chọn địa chỉ
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col className="w-full">
                <Card
                  title={
                    <Text className="text-lg" strong>
                      Chi tiết đơn hàng
                    </Text>
                  }
                  bordered={false}
                  className="rounded-lg shadow-md bg-white"
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={orderItems}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <img
                              src={
                                item?.product.productImages[0].uploadImage.url
                              }
                              alt={item?.product.productName}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          }
                          title={
                            <Link to={`/products/${item?.product.slug}`}>
                              <Text
                                ellipsis
                                style={{
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  color: "#333",
                                }}
                              >
                                {item?.product.productName}
                              </Text>
                            </Link>
                          }
                          description={
                            <div>
                              <Text>
                                <Text>Số lượng:</Text>{" "}
                                <Text>{item?.quantity}</Text>
                              </Text>
                              <br />
                              <Text>
                                <Text>Giá: </Text>
                                <Text strong style={{ color: "red" }}>
                                  {discountedPrice(item.product).toLocaleString(
                                    "vi-VN"
                                  )}
                                  đ
                                </Text>
                                <span style={{ margin: "0 4px" }}></span>
                                {discountedPrice(item.product) !==
                                  item.product.price && (
                                  <Text delete style={{ color: "gray" }}>
                                    {item?.product.price.toLocaleString(
                                      "vi-VN"
                                    )}
                                    đ
                                  </Text>
                                )}
                              </Text>
                              {item?.product?.discounts?.map((discount) => {
                                if (
                                  discount.discountType.startsWith("buy_") &&
                                  discount.discountType.includes("_get_")
                                ) {
                                  const [x, y] =
                                    discount.discountType.match(/\d+/g);
                                  return (
                                    <Text key={discount.discountId}>
                                      <div className="flex mt-2 items-center">
                                        <img
                                          src={
                                            item.product.productImages[0]
                                              .uploadImage.url
                                          }
                                          alt={item.product.productName}
                                          className="w-16 h-16 object-cover rounded mr-4"
                                        />
                                        <div>
                                          <Text className="block text-xs font-semibold">
                                            Quà tặng:
                                          </Text>
                                          <Text
                                            ellipsis
                                            className="block text-xs"
                                          >
                                            {item.product.productName}
                                          </Text>
                                          <Text className="block text-xs">
                                            Số lượng:{" "}
                                            {parseInt((item.quantity / x) * y)}
                                          </Text>
                                          <div className="flex items-center">
                                            <Text className="block text-xs">
                                              Giá: 0đ
                                            </Text>
                                            <span
                                              style={{ margin: "0 2px" }}
                                            ></span>
                                            <Text className="block line-through text-xs">
                                              {item?.product.price.toLocaleString(
                                                "vi-VN"
                                              )}
                                              đ
                                            </Text>
                                          </div>
                                        </div>
                                      </div>
                                    </Text>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                  <div className="text-right">
                    <Text strong>Tổng: </Text>
                    <Text strong className="text-red-600">
                      {discountedPriceTotal().toLocaleString("vi-VN")}đ
                    </Text>
                    <span style={{ margin: "0 4px" }}></span>
                    {priceTotal() !== discountedPriceTotal() && (
                      <Text delete style={{ color: "gray" }}>
                        {priceTotal().toLocaleString("vi-VN")}đ
                      </Text>
                    )}
                  </div>
                </Card>
              </Col>
            </Col>

            {/* Payment Details Section */}
            <Col className="w-2/5">
              <Card
                title={
                  <Text className="text-lg" strong>
                    Thông tin thanh toán
                  </Text>
                }
                bordered={false}
                className="rounded-lg shadow-md bg-white"
              >
                <Form layout="vertical" form={form}>
                  <Form.Item
                    label={<Text strong>Phương thức thanh toán:</Text>}
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
                        {
                          label: (
                            <>
                              <DollarOutlined style={{ marginRight: 8 }} />{" "}
                              Thanh toán khi nhận hàng
                            </>
                          ),
                          value: "cod",
                        },
                        {
                          label: (
                            <>
                              <CreditCardOutlined style={{ marginRight: 8 }} />{" "}
                              Thanh toán qua VNPay
                            </>
                          ),
                          value: "vnpay",
                        },
                      ]}
                    ></Select>
                  </Form.Item>
                  <Form.Item
                    label={<Text strong>Mã giảm giá:</Text>}
                    name="voucherCode"
                    rules={[
                      {
                        required: false,
                        message: "Vui lòng nhập mã voucher!",
                      },
                    ]}
                  >
                    <Text>
                      {selectedVoucher
                        ? `Mã đã chọn: ${selectedVoucher}`
                        : "Không có mã giảm giá được chọn"}
                    </Text>
                    <br />
                    <div className="flex w-full items-center justify-center">
                      <Button
                        type="link"
                        onClick={() => setIsVoucherModalOpen(true)}
                      >
                        Chọn mã giảm giá
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
                <Divider />
                <div className="mb-4">
                  <Text>Tổng tiền hàng: </Text>
                  <Text strong>{priceTotal().toLocaleString("vi-VN")}đ</Text>
                </div>
                <div>
                  <Text>Phí vận chuyển: </Text>
                  <Text strong>{shippingFee.toLocaleString("vi-VN")}đ</Text>
                </div>
                <div className="mb-4">
                  <Text className="italic text-xs">
                    (Đơn vị vận chuyển: Giao Hàng Nhanh)
                  </Text>
                </div>
                <div className="mb-4">
                  <Text>Giảm: </Text>
                  <Text strong>
                    -
                    {(priceTotal() - discountedPriceTotal()).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </Text>
                </div>
                <div className="mb-5  text-lg font-bold">
                  <Text>Tổng: </Text>
                  <Text className="text-red-600" strong>
                    {calculateTotal().toLocaleString("vi-VN")}đ
                  </Text>
                </div>
                <Button
                  type="primary"
                  block
                  className="font-bold"
                  size="large"
                  onClick={handleSubmit}
                >
                  Thanh toán
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Modal Chọn Địa Chỉ */}
      <Modal
        title="Chọn địa chỉ nhận hàng"
        open={isAddressModalOpen}
        onCancel={() => setIsAddressModalOpen(false)}
        footer={null}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {addresses.map((address) => (
            <Card
              key={address.addressId}
              className={`mb-2 cursor-pointer rounded-lg hover:bg-blue-50 ${
                selectedAddress === address.addressId
                  ? "border-2 border-primary"
                  : "border border-gray-200"
              }`}
              onClick={() => {
                setSelectedAddress(address.addressId);
                setIsAddressModalOpen(false);
              }}
            >
              <Text strong>{address.addressName}</Text>
              <br />
              <Text>{addressString(address)}</Text>
              <br />
              <Text>
                <b>Người nhận:</b> {address.contactName}
              </Text>
              <br />
              <Text>
                <b>Số điện thoại:</b> {address.contactPhone}
              </Text>
            </Card>
          ))}
        </div>
      </Modal>

      {/* Modal Chọn Voucher */}
      <Modal
        closable={false}
        title="Chọn Mã Giảm Giá"
        open={isVoucherModalOpen}
        onCancel={() => setIsVoucherModalOpen(false)}
        onOk={handleApplyVoucher}
        okText="Áp dụng"
        cancelText="Hủy"
      >
        <List
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
