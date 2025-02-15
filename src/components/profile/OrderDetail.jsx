import { Drawer, Steps, Button, message } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import CartItem from "../cart/CartItem";
import { useEffect, useState } from "react";
import { orderService } from "../../services";

const OrderDetail = ({
  open,
  onClose,
  selectedOrder,
  orderStatuses,
  setCancelOrder,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderResponse = await orderService.getOrderById(selectedOrder.orderId);

  useEffect(() => {
    if (selectedOrder) {
      const newItems = orderStatuses
        .slice(1, -1)
        .map((item) => ({ title: item.label, description: "" }));
      if (selectedOrder.orderStatus.orderStatusId === 5) {
        newItems[0].title = "Đã hủy";
      }
      setItems(newItems);
    }
  }, [selectedOrder, orderStatuses]);

  const getStepStatus = (orderStatusId) => {
    if (orderStatusId === 5) return "error";
    else if (orderStatusId === 4) return "finish";
    else return "process";
  };

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      await orderService.cancelOrder(selectedOrder.orderId);
      setLoading(false);
      message.success("Hủy đơn hàng thành công!");
      setCancelOrder(true);
      onClose();
    } catch (error) {
      setLoading(false);
      console.log("Error cancel order: ", error);
      message.error("Hủy đơn hàng thất bại!");
    }
  };

  return (
    <Drawer
      title={
        selectedOrder && (
          <div className="flex justify-between">
            <p className="text-lg">Đơn hàng #{selectedOrder.orderId}</p>
            {selectedOrder.orderStatus.orderStatusId === 1 && (
              <Button
                danger
                type="primary"
                loading={loading}
                onClick={handleCancelOrder}
              >
                Hủy đơn hàng
              </Button>
            )}
          </div>
        )
      }
      placement="right"
      width={600}
      open={open}
      onClose={onClose}
      closable={false}
    >
      {selectedOrder && (
        <div>
          <div className="rounded-md p-2 mb-4">
            <Steps
              className="py-4"
              status={getStepStatus(selectedOrder.orderStatus.orderStatusId)}
              size="small"
              current={
                selectedOrder.orderStatus.orderStatusId !== 5
                  ? selectedOrder.orderStatus.orderStatusId - 1
                  : 0
              }
              items={items}
            ></Steps>
          </div>

          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p className="text-base font-semibold mb-2 text-primary">
              Địa chỉ nhận hàng
            </p>
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Địa chỉ: </span>
                {selectedOrder.orderAddress.address}
              </p>

              <p>
                <span className="font-semibold">Người nhận: </span>
                {selectedOrder.orderAddress.contactName}
              </p>

              <p>
                <span className="font-semibold">Số điện thoại:</span>
                {selectedOrder.orderAddress.contactPhone}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <p className="text-base font-semibold mb-2 text-primary">
              Thông tin thanh toán
            </p>
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Thời gian đặt hàng: </span>
                {moment(selectedOrder.createdAt).format("DD/MM/YYYY  HH:mm")}
              </p>
              <p>
                <span className="font-semibold">Phương thức thanh toán: </span>
                {selectedOrder.paymentMethod.paymentMethodName}
              </p>
              <p>
                <span className="font-semibold">Tổng tiền hàng: </span>
                {selectedOrder.totalPrice.toLocaleString("vi-VN")}đ
              </p>
              <p>
                <span className="font-semibold">Giảm: </span>-
                {selectedOrder.totalDiscount.toLocaleString("vi-VN")}đ
              </p>
              <p>
                <span className="font-semibold">Phí vận chuyển: </span>
                {selectedOrder.shippingFee.toLocaleString("vi-VN")}đ
              </p>
              <p>
                <span className="font-semibold">Tổng tiền: </span>
                <span className="text-red-600 font-semibold">
                  {selectedOrder.finalPrice.toLocaleString("vi-VN")}đ
                </span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-md mb-4">
            <p className="text-base font-semibold mb-2 text-primary">
              Sản phẩm đã đặt
            </p>
            <CartItem
              items={selectedOrder.orderDetails}
              action={false}
              checkbox={false}
            ></CartItem>
          </div>
        </div>
      )}
    </Drawer>
  );
};

OrderDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setCancelOrder: PropTypes.func.isRequired,
  selectedOrder: PropTypes.object.isRequired,
  orderStatuses: PropTypes.array.isRequired,
};

export default OrderDetail;
