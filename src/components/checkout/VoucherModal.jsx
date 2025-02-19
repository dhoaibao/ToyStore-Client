import { Input, List, Modal, message } from "antd";
import PropTypes from "prop-types";
import { Ticket } from "lucide-react";
import { useState } from "react";

const VoucherModal = ({ open, setOpen, vouchers, handleApplyVoucher }) => {
  const [selectedVoucherCode, setSelectedVoucherCode] = useState("");
  const handleSubmit = () => {
    const voucher = vouchers.find(
      (voucher) => voucher.voucherCode === selectedVoucherCode
    );
    if (voucher) {
      handleApplyVoucher(voucher);
      setOpen(false);
    } else {
      message.error("Mã giảm giá không tồn tại!");
    }
  };
  return (
    <Modal
      closable={false}
      title="Chọn mã giảm giá"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleSubmit}
      okText="Áp dụng"
      cancelText="Hủy"
      maskClosable={false}
    >
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <List
          dataSource={vouchers}
          renderItem={(voucher) => (
            <List.Item
              onClick={() => setSelectedVoucherCode(voucher.voucherCode)}
              className={`cursor-pointer bg-gray-100 rounded-lg mb-2 ${
                selectedVoucherCode === voucher.voucherCode ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex flex-col px-4">
                <div className="flex items-center text-primary">
                  <Ticket strokeWidth={1} size={30} />
                  <p className="ml-2 font-semibold">{voucher.voucherCode}</p>
                </div>
                <p>
                  {voucher.discountType === "percentage" &&
                    `Giảm ${
                      voucher.discountValue
                    }%  tối đa ${voucher.maxPriceDiscount.toLocaleString(
                      "vi-VN"
                    )}đ`}
                  {voucher.discountType === "fixed_amount" &&
                    `Giảm ${voucher.discountValue.toLocaleString(
                      "vi-VN"
                    )}đ`}{" "}
                  cho đơn hàng từ{" "}
                  {voucher.minOrderPrice.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </List.Item>
          )}
        />
      </div>
      <div>
        <p className="mb-2">Hoặc nhập mã giảm giá:</p>
        <Input
          placeholder="Nhập mã giảm giá"
          value={selectedVoucherCode}
          onChange={(e) => setSelectedVoucherCode(e.target.value)}
        />
      </div>
    </Modal>
  );
};

VoucherModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  vouchers: PropTypes.array.isRequired,
  handleApplyVoucher: PropTypes.func.isRequired,
};

export default VoucherModal;
