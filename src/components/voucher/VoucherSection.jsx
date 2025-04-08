import { useState, useEffect } from "react";
import VoucherCard from "./VoucherCard";
import { voucherService } from "../../services";
import { Button } from "antd";
import VoucherPopup from "./VoucherPopup";

const VoucherSection = () => {
  const [vouchers, setVouchers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await voucherService.getAllVouchers(
          "limit=6&status=valid",
        );
        setVouchers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <div>
      <section className="container mx-auto p-4">
        <h2 className="text-3xl text-center text-primary font-bold mb-2">
          Mã giảm giá
        </h2>
        <span className="mb-2 bg-primary h-2 rounded flex justify-center w-[30vw] mx-auto"></span>
        <div className="flex justify-end">
          <Button type="link" onClick={() => setOpen(true)}>Xem tất cả</Button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {vouchers.map((voucher) => (
            <VoucherCard key={voucher.voucherId} voucher={voucher} />
          ))}
        </div>
      </section>
      <VoucherPopup open={open} setOpen={setOpen} />
    </div>
  );
};

export default VoucherSection;
