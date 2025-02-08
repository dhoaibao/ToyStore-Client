import { Card, Typography, Select, Form, Button, Divider } from "antd";
import { DollarOutlined, CreditCardOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Text } = Typography;

const PaymentInfo = ({
  selectedVoucher,
  setIsVoucherModalOpen,
  setPaymentMethod,
  totalPrice,
  shippingFee,
  finalPrice,
  totalDiscount,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(onSubmit);
  };

  return (
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
            onChange={setPaymentMethod}
            options={[
              {
                label: (
                  <>
                    <DollarOutlined style={{ marginRight: 8 }} /> Thanh toán khi
                    nhận hàng
                  </>
                ),
                value: 1,
              },
              {
                label: (
                  <>
                    <CreditCardOutlined style={{ marginRight: 8 }} /> Thanh toán
                    qua VNPay
                  </>
                ),
                value: 2,
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
            <Button type="link" onClick={() => setIsVoucherModalOpen(true)}>
              Chọn mã giảm giá
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Divider />
      <div className="mb-4">
        <Text>Tổng tiền hàng: </Text>
        <Text strong>{totalPrice().toLocaleString("vi-VN")}đ</Text>
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
          -{(totalPrice() - totalDiscount()).toLocaleString("vi-VN")}đ
        </Text>
      </div>
      <div className="mb-5  text-lg font-bold">
        <Text>Tổng: </Text>
        <Text className="text-red-600" strong>
          {finalPrice().toLocaleString("vi-VN")}đ
        </Text>
      </div>
      <Button
        type="primary"
        block
        className="font-bold"
        size="large"
        loading={loading}
        onClick={handleSubmit}
      >
        Thanh toán
      </Button>
    </Card>
  );
};

PaymentInfo.propTypes = {
  selectedVoucher: PropTypes.string,
  setIsVoucherModalOpen: PropTypes.func.isRequired,
  setPaymentMethod: PropTypes.func.isRequired,
  totalPrice: PropTypes.func.isRequired,
  shippingFee: PropTypes.number.isRequired,
  finalPrice: PropTypes.func.isRequired,
  totalDiscount: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PaymentInfo;
