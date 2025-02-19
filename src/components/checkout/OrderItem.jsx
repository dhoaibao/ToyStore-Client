import { Card, Typography } from "antd";
import CartItem from "../cart/CartItem";
import PropTypes from "prop-types";

const { Text } = Typography;

const OrderItem = ({ orderItems, totalDiscountedPrice, totalPrice }) => {
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
          {totalDiscountedPrice().toLocaleString("vi-VN")}đ
        </Text>
        <span style={{ margin: "0 4px" }}></span>
        {totalPrice() !== totalDiscountedPrice() && (
          <Text delete style={{ color: "gray" }}>
            {totalPrice().toLocaleString("vi-VN")}đ
          </Text>
        )}
      </div>
    </Card>
  );
};

OrderItem.propTypes = {
  orderItems: PropTypes.array.isRequired,
  totalDiscountedPrice: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
};

export default OrderItem;
