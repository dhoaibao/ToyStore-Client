import { useState, useEffect } from "react";
import VoucherCard from "./VoucherCard";
import { voucherService } from "../../services";

const VoucherSection = () => {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await voucherService.getAllVouchers();
        setVouchers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <section className="container mx-auto p-4">
      <h2 className="text-3xl text-center text-primary font-bold mb-2">
        Mã giảm giá
      </h2>
      <span className="mb-2 bg-primary h-2 rounded flex justify-center w-[30vw] mx-auto"></span>
      <div className="max-h-[200px] min-h-24 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6">
          {vouchers.map((voucher) => (
            <VoucherCard key={voucher.voucherId} voucher={voucher} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VoucherSection;
