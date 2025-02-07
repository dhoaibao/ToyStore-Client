import { Card, Typography } from "antd";
import CartItem from "../cart/CartItem";
import PropTypes from "prop-types";

const { Text } = Typography;

const OrderDetail = ({ orderItems, discountedPriceTotal, priceTotal }) => {
  return (
    <Card
      title={
        <Text className="text-lg" strong>
          Chi tiết đơn hàng
        </Text>
      }
      bordered={false}
      className="rounded-lg shadow-md bg-white"
    >
      <CartItem items={orderItems} action={false} checkbox={false}></CartItem>
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
  );
};

OrderDetail.propTypes = {
  orderItems: PropTypes.array.isRequired,
  discountedPriceTotal: PropTypes.number.isRequired,
  priceTotal: PropTypes.number.isRequired,
};

export default OrderDetail;
