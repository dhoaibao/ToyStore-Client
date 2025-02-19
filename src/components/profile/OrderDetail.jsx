import { Drawer, Steps, Button, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  CircleEllipsis,
  CircleCheckBig,
  Truck,
  PackageCheck,
  CircleX,
} from "lucide-react";
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
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoadingOrder(true);
      const orderResponse = await orderService.getOrderById(
        selectedOrder.orderId
      );
      setOrder(orderResponse.data);
      setLoadingOrder(false);
    };

    if (selectedOrder) {
      fetchOrder();
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (selectedOrder) {
      const newItems = orderStatuses
        .slice(1, -1)
        .map((item) => ({ title: item.label, description: "" }));
      const icons = [
        <CircleEllipsis key="circle-ellipsis" strokeWidth={1} />,
        <CircleCheckBig key="circle-check-big" strokeWidth={1} />,
        <Truck key="truck" strokeWidth={1} />,
        <PackageCheck key="package-check" strokeWidth={1} />,
      ];
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        icon: icons[index],
      }));
      if (selectedOrder.orderStatus.orderStatusId === 5) {
        updatedItems[0].title = "Đã hủy";
        updatedItems[0].icon = <CircleX key="circle-x" strokeWidth={1} />;
      }
      setItems(updatedItems);
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
      {loadingOrder ? (
        <div className="flex items-center justify-center h-full">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        order && (
          <div>
            <div className="rounded-md p-2 mb-4">
              <Steps
                className="py-4"
                status={getStepStatus(order.orderStatus.orderStatusId)}
                size="small"
                current={
                  order.orderStatus.orderStatusId !== 5
                    ? order.orderStatus.orderStatusId - 1
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
                  {order.orderAddress.address}
                </p>

                <p>
                  <span className="font-semibold">Người nhận: </span>
                  {order.orderAddress.contactName}
                </p>

                <p>
                  <span className="font-semibold">Số điện thoại:</span>
                  {order.orderAddress.contactPhone}
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
                  {moment(order.createdAt).format("DD/MM/YYYY  HH:mm")}
                </p>
                <p>
                  <span className="font-semibold">
                    Phương thức thanh toán:{" "}
                  </span>
                  {order.paymentMethod.paymentMethodName}
                </p>
                <p>
                  <span className="font-semibold">Tổng tiền hàng: </span>
                  {order.totalPrice.toLocaleString("vi-VN")}đ
                </p>
                <p>
                  <span className="font-semibold">Giảm: </span>-
                  {order.totalDiscount.toLocaleString("vi-VN")}đ
                </p>
                <p>
                  <span className="font-semibold">Phí vận chuyển: </span>
                  {order.shippingFee.toLocaleString("vi-VN")}đ
                </p>
                <p>
                  <span className="font-semibold">Tổng tiền: </span>
                  <span className="text-red-600 font-semibold">
                    {order.finalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-md mb-4">
              <p className="text-base font-semibold mb-2 text-primary">
                Sản phẩm đã đặt
              </p>
              <CartItem
                items={order.orderDetails}
                action={false}
                checkbox={false}
              ></CartItem>
            </div>
          </div>
        )
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
