import { Input, Form, List, Modal, Typography } from "antd";
import PropTypes from "prop-types";

const { Text } = Typography;

const VoucherModal = ({
  open,
  setOpen,
  handleApplyVoucher,
  vouchers,
  selectedVoucher,
  setSelectedVoucher,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      closable={false}
      title="Chọn Mã Giảm Giá"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleApplyVoucher}
      okText="Áp dụng"
      cancelText="Hủy"
    >
      <List
        dataSource={vouchers}
        renderItem={(voucher) => (
          <List.Item
            onClick={() => setSelectedVoucher(voucher.code)}
            style={{
              cursor: "pointer",
              padding: "10px",
              border:
                selectedVoucher === voucher.code
                  ? "2px solid #1890ff"
                  : "1px solid #d9d9d9",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <Text strong>{voucher.code}</Text>
            <br />
            <Text>{voucher.description}</Text>
          </List.Item>
        )}
      />
      <Form layout="vertical" form={form}>
        <Form.Item label="Hoặc nhập mã voucher">
          <Input
            placeholder="Nhập mã voucher"
            value={selectedVoucher}
            onChange={(e) => setSelectedVoucher(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

VoucherModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  handleApplyVoucher: PropTypes.func.isRequired,
  vouchers: PropTypes.array.isRequired,
  selectedVoucher: PropTypes.string.isRequired,
  setSelectedVoucher: PropTypes.func.isRequired,
};

export default VoucherModal;
