import { List, Button, Typography } from "antd";
import PropTypes from "prop-types";

const { Text } = Typography;

const AddressList = ({ addresses, onEdit, onDelete, formatAddress }) => (
  <List
    bordered
    dataSource={addresses}
    renderItem={(item) => (
      <List.Item
        actions={[
          <Button key="edit" type="link" onClick={() => onEdit(item)}>
            Chỉnh sửa
          </Button>,
          <Button
            key="delete"
            type="link"
            danger
            onClick={() => onDelete(item.addressId)}
          >
            Xóa
          </Button>,
        ]}
      >
        <div>
          <Text strong>{item.addressName}</Text>
          <br />
          <Text>{formatAddress(item)}</Text>
          <br />
          <Text>SĐT: {item.contactPhone}</Text>
        </div>
      </List.Item>
    )}
  />
);

AddressList.propTypes = {
  addresses: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatAddress: PropTypes.func.isRequired,
};

export default AddressList;
