import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const handleGoToOrders = () => {
    navigate("/orders");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-2/3">
      <Result
        className="w-1/2 bg-white rounded-lg shadow-md m-8"
        status="success"
        title={<p className="text-2xl font-semibold">Đặt hàng thành công!</p>}
        subTitle={
          <p className="text-base text-gray-500">
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn
            đã được đặt thành công.
          </p>
        }
        extra={[
          <Button key="orders" onClick={handleGoToOrders}>
            Xem đơn hàng
          </Button>,
          <Button
            type="primary"
            key="continue"
            onClick={handleContinueShopping}
          >
            Tiếp tục mua sắm
          </Button>,
        ]}
      />
    </div>
  );
};

export default OrderSuccess;
