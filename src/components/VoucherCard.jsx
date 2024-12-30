import PropTypes from "prop-types";
import { Ticket } from "lucide-react";

const VoucherCard = ({ discount, condition, buttonText }) => {
  return (
    <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-4">
      <div className="flex justify-center items-center mb-4 md:mb-0 md:mr-4 text-primary text-3xl">
        <Ticket strokeWidth={1} size={70} />
      </div>
      <div className="flex-1 text-left">
        {/* Giá trị giảm giá */}
        <h3 className="text-2xl font-bold text-primary">{discount}</h3>
        {/* Điều kiện áp dụng */}
        <p className="text-sm text-gray-600 mt-2">{condition}</p>
      </div>
      <div className="flex justify-end w-full md:w-auto">
        <button className="ml-2 px-2 py-2 text-sm bg-primary text-white font-medium rounded-lg hover:bg-blue-900 transition-all">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const VoucherSection = () => {
  const vouchers = [
    {
      id: 1,
      discount: "Giảm 50k",
      condition: "Cho đơn hàng từ 500k",
      buttonText: "Nhận Ngay",
    },
    {
      id: 2,
      discount: "Giảm 100k",
      condition: "Cho đơn hàng từ 1 triệu",
      buttonText: "Nhận Ngay",
    },
    {
      id: 3,
      discount: "Giảm 200k",
      condition: "Cho đơn hàng từ 2 triệu",
      buttonText: "Nhận Ngay",
    },
  ];

  return (
    <section className="container mx-auto p-4 ">
      <h2 className="text-3xl text-center text-primary font-bold mb-2">
        Mã giảm giá
      </h2>
      <span className="mb-2 bg-primary h-2 rounded flex justify-center w-[50vw] md:w-[30vw] mx-auto"></span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vouchers.map((voucher) => (
          <VoucherCard
            key={voucher.id}
            discount={voucher.discount}
            condition={voucher.condition}
            buttonText={voucher.buttonText}
          />
        ))}
      </div>
    </section>
  );
};

VoucherCard.propTypes = {
  discount: PropTypes.string.isRequired,
  condition: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default VoucherSection;
