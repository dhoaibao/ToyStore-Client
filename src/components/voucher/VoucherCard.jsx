import PropTypes from "prop-types";
import { Ticket } from "lucide-react";
import { Popover, Button, message } from "antd";
import { voucherService } from "../../services";
import { useState } from "react";
import { useSelector } from "react-redux";

const VoucherCard = ({ voucher }) => {
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

  console.log(user);

  const handleCollectVoucher = async (voucherId) => {
    setLoading(true);
    try {
      await voucherService.collectVoucher(voucherId);
      setLoading(false);
      message.success("Nhận mã giảm giá thành công!");
      voucher.users.push({ userId: user.userId });
    } catch (error) {
      setLoading(false);
      message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      console.error(error);
    }
  };

  const checkVoucherCollected = voucher.users.some(
    (u) => u.userId === user?.userId
  );

  const content = (
    <div>
      <p>
        {voucher.discountType === "percentage" &&
          `Giảm ${
            voucher.discountValue
          }%  tối đa ${voucher.maxPriceDiscount.toLocaleString("vi-VN")}đ`}
        {voucher.discountType === "fixed_amount" &&
          `Giảm ${voucher.discountValue.toLocaleString("vi-VN")}đ`}{" "}
        cho đơn hàng từ {voucher.minOrderPrice.toLocaleString("vi-VN")}đ
      </p>
    </div>
  );
  return (
    <div className="flex flex-row items-center bg-white shadow-md rounded-lg p-3">
      <div className="flex justify-center items-center md:mr-2 text-primary text-3xl">
        <Ticket strokeWidth={1} size={70} />
      </div>
      <div className="flex-1 text-left">
        <Popover content={content} trigger="hover">
          <h3 className="text-xl font-bold text-primary">
            {voucher.discountType === "percentage" &&
              `Giảm ${voucher.discountValue}%`}

            {voucher.discountType === "fixed_amount" &&
              `Giảm ${voucher.discountValue.toLocaleString("vi-VN")}đ`}
          </h3>
        </Popover>
        <p className="text-sm text-gray-600">
          Cho đơn hàng từ {voucher.minOrderPrice.toLocaleString("vi-VN")}đ
        </p>
      </div>
      <div className="flex justify-end w-full md:w-auto">
        {checkVoucherCollected ? (
          <Button disabled>Đã nhận</Button>
        ) : (
          <Button
            type="primary"
            onClick={() => handleCollectVoucher(voucher.voucherId)}
            loading={loading}
          >
            Nhận ngay
          </Button>
        )}
      </div>
    </div>
  );
};

VoucherCard.propTypes = {
  voucher: PropTypes.object.isRequired,
};

export default VoucherCard;
