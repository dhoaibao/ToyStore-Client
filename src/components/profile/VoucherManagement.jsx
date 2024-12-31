import { Drawer, List, Tag, Typography, Button, Divider } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";

const { Title, Text } = Typography;

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
      title={<Title level={3}>Kho voucher của bạn</Title>}
      open={open}
      onClose={closeDrawer}
      width={600}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button type="primary" onClick={closeDrawer}>
            Đóng
          </Button>
        </div>
      }
    >
      {vouchers.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Text style={{ fontSize: "16px", color: "#888" }}>
            Hiện tại bạn chưa có voucher nào.
          </Text>
        </div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={vouchers}
          renderItem={(item) => (
            <List.Item>
              <div
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
