import { useMemo } from "react";
import {
  Card,
  Typography,
  Button,
  Empty,
} from "antd";
import PropTypes from "prop-types"

const { Text } = Typography;

const ShippingAddress = ({addresses, selectedAddress, setIsAddressModalOpen}) => {

  const addressString = useMemo(
    () => (address) =>
      `${address.detail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
    []
  );

  return (
    <Card
      title={
        <Text strong className="text-lg">
          Địa chỉ nhận hàng
        </Text>
      }
    >
      {selectedAddress ? (
        <div>
          <Text>
            <b>Địa chỉ: </b>
            {addressString(
              addresses.find((addr) => addr.addressId === selectedAddress)
            )}
          </Text>
          <br />
          <Text>
            <b>Người nhận: </b>
            {
              addresses.find((addr) => addr.addressId === selectedAddress)
                .contactName
            }
          </Text>
          <br />
          <Text>
            <b>Số điện thoại: </b>
            {
              addresses.find((addr) => addr.addressId === selectedAddress)
                .contactPhone
            }
          </Text>
        </div>
      ) : (
        <Empty description="Không có địa chỉ được chọn" />
      )}
      <div className="flex items-center justify-center">
        <Button type="link" onClick={() => setIsAddressModalOpen(true)}>
          Chọn địa chỉ
        </Button>
      </div>
    </Card>
  );
};

ShippingAddress.propTypes = {
    addresses: PropTypes.array.isRequired,
    selectedAddress: PropTypes.number.isRequired,
    setIsAddressModalOpen: PropTypes.func.isRequired,
}

export default ShippingAddress;
