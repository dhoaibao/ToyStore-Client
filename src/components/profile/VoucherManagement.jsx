import { Drawer, List, Tag, Typography, Empty, Divider } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const { Text } = Typography;

const VoucherManagement = ({ open, setOpen }) => {
  const [vouchers, setVouchers] = useState([
    {
      id: 1,
      name: "Giảm 10% toàn bộ sản phẩm",
      code: "SALE10",
      discount: "10%",
      expiry: "2024-12-31",
      status: "Còn hiệu lực",
    },
    {
      id: 2,
      name: "Giảm 20k cho đơn từ 200k",
      code: "SALE20K",
      discount: "20,000đ",
      expiry: "2024-11-30",
      status: "Đã sử dụng",
    },
    {
      id: 3,
      name: "Giảm 50% dịch vụ vận chuyển",
      code: "SHIP50",
      discount: "50%",
      expiry: "2024-10-15",
      status: "Hết hạn",
    },
  ]);

  // Hàm đóng drawer
  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Drawer
      closable={false}
      title={<p className="text-xl font-semibold">Kho mã giảm giá</p>}
      open={open}
      onClose={closeDrawer}
      width={600}
    >
      {vouchers.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <Empty description={"Hiện tại bạn không có voucher nào!"} />
        </div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={vouchers}
          renderItem={(item) => (
            <List.Item>
              <div
                className=""
                style={{
                  padding: "15px",
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  backgroundColor:
                    item.status === "Còn hiệu lực"
                      ? "#f6ffed"
                      : item.status === "Đã sử dụng"
                      ? "#fffbe6"
                      : "#fff1f0",
                }}
              >
                <Text strong style={{ fontSize: "16px" }}>
                  {item.name}
                </Text>
                <Divider style={{ margin: "10px 0" }} />
                <div>
                  <Text>Mã: </Text>
                  <Tag color="blue" style={{ fontSize: "14px" }}>
                    {item.code}
                  </Tag>
                </div>
                <div style={{ marginTop: "5px" }}>
                  <Text>Giảm giá: </Text>
                  <Text strong style={{ color: "#52c41a" }}>
                    {item.discount}
                  </Text>
                </div>
                <div style={{ marginTop: "5px" }}>
                  <Text>Hạn sử dụng: </Text>
                  <Text>{item.expiry}</Text>
                </div>
                <div style={{ marginTop: "5px" }}>
                  <Text>Trạng thái: </Text>
                  <Tag
                    color={
                      item.status === "Còn hiệu lực"
                        ? "green"
                        : item.status === "Đã sử dụng"
                        ? "gold"
                        : "red"
                    }
                  >
                    {item.status}
                  </Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

VoucherManagement.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default VoucherManagement;
