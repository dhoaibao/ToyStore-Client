import { Steps, message, Modal, Avatar, Button } from "antd";
import { Star } from "lucide-react";
import PropTypes from "prop-types";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { orderService } from "../../services";
import { generateStepItems, getStepStatus } from "../../utils";
import { PAYMENT_METHOD } from "../../constants";
import ReviewForm from "./ReviewForm";

const OrderDetail = ({ open, onClose, selectedOrder, setCancelOrder }) => {
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

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

  const { stepItems, currentStep, stepStatus } = useMemo(() => {
    const trackings = order?.orderTrackings || [];
    const lastTracking = trackings[trackings.length - 1];
    return {
      stepItems: generateStepItems(trackings).map((item) => ({
        ...item,
        description: item.description ? (
          <span className="text-xs">{item.description}</span>
        ) : null,
      })),
      currentStep: trackings.length - 1,
      stepStatus: getStepStatus(lastTracking?.orderStatus.statusName),
    };
  }, [order?.orderTrackings]);

  const disabled =
    order?.orderTrackings[order?.orderTrackings.length - 1]?.orderStatus
      ?.orderStatusId > 1;

  const orderStatusId =
    order?.orderTrackings[order?.orderTrackings.length - 1]?.orderStatus
      ?.orderStatusId;

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
    <>
      <Modal
        loading={loadingOrder}
        onCancel={onClose}
        title={`Đơn hàng: #${order?.orderId || ""}`}
        footer={
          <Button
            color="danger"
            variant="dashed"
            loading={loading}
            onClick={handleCancelOrder}
            disabled={disabled}
          >
            Hủy đơn hàng
          </Button>
        }
        open={open}
        centered
        width={900}
        className="max-h-[95vh] overflow-y-auto scrollbar-hide"
      >
        <Steps
          className="p-4 pb-6"
          status={stepStatus}
          size="small"
          current={currentStep}
          items={stepItems}
        ></Steps>
        <div className="flex justify-between space-x-2">
          <div className="bg-gray-100 p-4 mb-2 rounded-md w-1/2">
            <p className="font-semibold text-base text-primary mb-2">
              Địa chỉ nhận hàng:{" "}
            </p>
            {[
              { label: "Người nhận", value: order?.orderAddress.contactName },
              {
                label: "Số điện thoại",
                value: order?.orderAddress.contactPhone,
              },
              { label: "Địa chỉ", value: order?.orderAddress.address },
            ].map((item, index) => (
              <div key={index} className="flex space-x-1">
                <p className="font-semibold">{item.label}:</p>
                <p>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-100 p-4 mb-2 rounded-md w-1/2">
            <p className="font-semibold text-base text-primary mb-2">
              Thông tin thanh toán:{" "}
            </p>
            <div>
              {[
                {
                  label: "Thời gian đặt hàng",
                  value: moment(order?.createdAt).format("DD/MM/YYYY HH:mm"),
                },
                {
                  label: "Phương thức thanh toán",
                  value:
                    PAYMENT_METHOD[order?.paymentMethod.paymentMethodName]
                      ?.label,
                },
                {
                  label: "Trạng thái thanh toán",
                  value: `${
                    order?.paymentStatus ? "Đã thanh toán" : "Chờ thanh toán"
                  }`,
                },
                {
                  label: "Tiền hàng",
                  value: `${order?.totalPrice.toLocaleString("vi-VN")}đ`,
                },
                {
                  label: "Giảm",
                  value: `-${order?.totalDiscount.toLocaleString("vi-VN")}đ`,
                },
                {
                  label: "Phí vận chuyển",
                  value: `${order?.shippingFee.toLocaleString("vi-VN")}đ`,
                },
                {
                  label: "Tổng",
                  value: `${order?.finalPrice.toLocaleString("vi-VN")}đ`,
                  className: "text-red-600 font-semibold",
                },
              ].map((item, index) => (
                <div key={index} className="flex space-x-1">
                  <p className="font-semibold">{item.label}:</p>
                  <p className={item.className || ""}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 mb-2 rounded-md">
          <p className="font-semibold text-base text-primary mb-2">
            Sản phẩm đã đặt:{" "}
          </p>
          <div>
            {order?.orderDetails.map((item, index) => (
              <div key={index} className="py-1 flex justify-between">
                <div className="flex space-x-2">
                  <Avatar
                    src={item.product.productImages[0].url}
                    shape="square"
                    size={64}
                    className="border border-gray-300"
                  />
                  <div>
                    <p className="font-semibold line-clamp-1">
                      {item.product.productName}
                    </p>
                    <p>{`Số lượng: ${item.quantity}`}</p>
                    <p>{`Giá: ${
                      item.discountedPrice !== 0
                        ? item.discountedPrice.toLocaleString("vi-VN")
                        : item.price.toLocaleString("vi-VN")
                    }đ`}</p>
                  </div>
                </div>
                {orderStatusId === 4 && (
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedOrderItem(item);
                      setReviewOpen(true);
                    }}
                  >
                    <Star strokeWidth={1.5} size={20} />
                    Đánh giá
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <ReviewForm
        open={reviewOpen}
        setOpen={setReviewOpen}
        data={selectedOrderItem}
      />
    </>
  );
};

OrderDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setCancelOrder: PropTypes.func.isRequired,
  selectedOrder: PropTypes.object.isRequired,
};

export default OrderDetail;
