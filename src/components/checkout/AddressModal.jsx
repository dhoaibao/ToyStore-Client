import { useMemo } from "react";
import { Card, Typography, Modal } from "antd";
import PropTypes from "prop-types";

const { Text } = Typography;

const AddressModal = ({
  open,
  setOpen,
  addresses,
  selectedAddress,
  setSelectedAddress,
}) => {
  const addressString = useMemo(
    () => (address) =>
      `${address.detail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
    []
  );

  return (
    <Modal
      title="Chọn địa chỉ nhận hàng"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {addresses.map((address) => (
          <Card
            key={address.addressId}
            className={`mb-2 cursor-pointer rounded-lg hover:bg-blue-50 ${
              selectedAddress === address.addressId
                ? "border-2 border-primary"
                : "border border-gray-200"
            }`}
            onClick={() => {
              setSelectedAddress(address.addressId);
              setOpen(false);
            }}
          >
            <Text strong>{address.addressName}</Text>
            <br />
            <Text>{addressString(address)}</Text>
            <br />
            <Text>
              <b>Người nhận:</b> {address.contactName}
            </Text>
            <br />
            <Text>
              <b>Số điện thoại:</b> {address.contactPhone}
            </Text>
          </Card>
        ))}
      </div>
    </Modal>
  );
};

AddressModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  addresses: PropTypes.array.isRequired,
  selectedAddress: PropTypes.number.isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
};

export default AddressModal;
