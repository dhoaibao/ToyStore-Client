import { Drawer, Empty, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Ticket } from "lucide-react";
import { voucherService } from "../../services";
import moment from "moment";

const VoucherManagement = ({ open, setOpen }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const response = await voucherService.getVoucherByUser();
        setVouchers(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (open) fetchVouchers();
  }, [open]);

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Drawer
      closable={false}
      title={<p className="mb-4 text-xl font-semibold">Kho mã giảm giá</p>}
      open={open}
      onClose={closeDrawer}
      width={600}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : vouchers.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {vouchers.map((voucher) => (
            <div
              key={voucher.voucherId}
              className="bg-gray-100 p-4 rounded-lg shadow-sm space-y-1"
            >
              <div className="flex text-primary">
                <Ticket strokeWidth={1} size={30} />
                <p className="text-lg ml-2 font-bold text-primary">
                  {voucher.discountType === "percentage" &&
                    `Giảm ${voucher.discountValue}%`}

                  {voucher.discountType === "fixed_amount" &&
                    `Giảm ${voucher.discountValue.toLocaleString("vi-VN")}đ`}
                </p>
              </div>
              <p>
                <span className="font-semibold">Mã voucher: </span>
                {voucher.voucherCode}
              </p>
              <p>
                <span className="font-semibold">Điều kiện áp dụng: </span>
                giảm
                {voucher.discountType === "percentage" &&
                  ` tối đa ${voucher.maxPriceDiscount.toLocaleString(
                    "vi-VN"
                  )}đ`}
                {` cho đơn hàng từ ${voucher.minOrderPrice.toLocaleString(
                  "vi-VN"
                )}đ.`}
              </p>
              <p>
                <span className="font-semibold">Ngày hết hạn: </span>
                {moment(voucher.endDate).format("DD/MM/YYYY")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Empty description={"Không có mã giảm giá nào khả dụng!"} />
        </div>
      )}
    </Drawer>
  );
};

VoucherManagement.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default VoucherManagement;
