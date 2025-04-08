import VoucherCard from "./VoucherCard";
import { useState, useEffect } from "react";
import { voucherService } from "../../services";
import { Modal, Empty, Pagination } from "antd";
import PropTypes from "prop-types";

const VoucherPopup = ({ open, setOpen }) => {
  const [vouchers, setVouchers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const response = await voucherService.getAllVouchers(
          `&status=valid&limit=6&page=${currentPage}`,
        );
        setVouchers(response.data);
        setTotalPage(response.pagination.totalPages * 10);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchVouchers();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [open]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={900}
      centered
      loading={loading}
      styles={{
        body: {
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <div className="flex-grow">
        {vouchers?.length > 0 ? (
          <section className="container mx-auto p-4">
            <h2 className="text-2xl text-center text-primary font-bold mb-2">
              Mã giảm giá
            </h2>
            <span className="mb-2 bg-primary h-2 rounded flex justify-center w-[30vw] mx-auto"></span>
            <div className="grid grid-cols-2 gap-6">
              {vouchers.map((voucher) => (
                <VoucherCard key={voucher.voucherId} voucher={voucher} />
              ))}
            </div>
          </section>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Empty description={"Không có mã giảm giá!"} />
          </div>
        )}
      </div>
      <div className="mt-auto pt-4">
        {vouchers?.length > 0 && (
          <Pagination
            align="center"
            defaultCurrent={1}
            current={currentPage}
            total={totalPage}
            onChange={handlePageChange}
          />
        )}
      </div>
    </Modal>
  );
};

VoucherPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default VoucherPopup;
