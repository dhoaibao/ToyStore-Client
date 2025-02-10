import { Drawer, Typography, Divider, Steps } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import CartItem from "../cart/CartItem";

const { Text, Title } = Typography;

const OrderDetail = ({ open, onClose, selectedOrder, orderStatuses }) => {
  const items = orderStatuses
    .slice(1, -1)
    .map((item) => ({ title: item.label, description: "" }));

  return (
    <Drawer
      title={
        selectedOrder && (
          <Title level={4}>Chi tiết đơn hàng: #{selectedOrder.orderId}</Title>
        )
      }
      placement="right"
      width={600}
      open={open}
      onClose={onClose}
      closable={false}
    >
      {selectedOrder && (
        <>
          <Steps
            progressDot
            size="small"
            current={selectedOrder.orderStatus.orderStatusId - 1}
            items={items}
          ></Steps>
          <Divider></Divider>
          <div className="">
            <p className="text-base font-semibold mb-2">Thông tin thanh toán</p>
            <p>
              <Text>Thời gian đặt hàng: </Text>
              {moment(selectedOrder.createdAt).format("DD/MM/YYYY  HH:mm")}
            </p>
            <p>
              <Text>Tổng tiền hàng: </Text>
              {selectedOrder.totalPrice.toLocaleString("vi-VN")}đ
            </p>
            <p>
              <Text>Giảm: </Text>-
              {selectedOrder.totalDiscount.toLocaleString("vi-VN")}đ
            </p>
            <p>
              <Text>Phí vận chuyển: </Text>
              {selectedOrder.shippingFee.toLocaleString("vi-VN")}đ
            </p>
            <p>
              <Text>Tổng tiền: </Text>
              <Text className="text-red-600">
                {selectedOrder.finalPrice.toLocaleString("vi-VN")}đ
              </Text>
            </p>
          </div>
          <Divider></Divider>
          <div>
            <p className="text-base font-semibold mb-2">Thông tin nhận hàng</p>
            <div>
              <Text>Địa chỉ: {selectedOrder.orderAddress.address}</Text>
              <br />
              <Text>Người nhận: {selectedOrder.orderAddress.contactName}</Text>
              <br />
              <Text>
                Số điện thoại: {selectedOrder.orderAddress.contactPhone}
              </Text>
            </div>
          </div>
          <Divider></Divider>
          <div>
            <p className="text-base font-semibold mb-2">Sản phẩm đã đặt</p>
            <CartItem
              items={selectedOrder.orderDetails}
              action={false}
              checkbox={false}
            ></CartItem>
          </div>
        </>
      )}
    </Drawer>
  );
};

OrderDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedOrder: PropTypes.number.isRequired,
  orderStatuses: PropTypes.array.isRequired,
};

export default OrderDetail;
