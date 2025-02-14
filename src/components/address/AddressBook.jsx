import { useState, useEffect } from "react";
import { List, Button, Drawer, Typography, message } from "antd";
import PropTypes from "prop-types";
import { getAddressByUser, deleteAddress } from "../../redux/thunks/addressThunk";
import { useDispatch, useSelector } from "react-redux";
import AddressForm from "./AddressForm";

const { Text } = Typography;

const AddressBook = ({ open, setOpen }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const addresses = useSelector((state) => state.address.addresses);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAddressByUser());
  }, [dispatch]);

  const openAddressForm = (address = null) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDelete = (addressId) => {
    dispatch(deleteAddress(addressId));
    message.success("Xóa địa chỉ thành công!");
  };

  return (
    <Drawer
      closable={false}
      title={<p className="text-xl font-semibold">Sổ địa chỉ</p>}
      open={open}
      onClose={() => setOpen(false)}
      width={600}
    >
      <Button
        type="primary"
        onClick={() => openAddressForm()}
        className="mb-4"
      >
        Thêm địa chỉ mới
      </Button>
      <List
        bordered
        dataSource={addresses}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                type="link"
                onClick={() => openAddressForm(item)}
              >
                Chỉnh sửa
              </Button>,
              <Button
                key="delete"
                type="link"
                danger
                onClick={() => handleDelete(item.addressId)}
              >
                Xóa
              </Button>,
            ]}
          >
            <div>
              <Text strong>{item.addressName}</Text>
              <br />
              <Text>
                {item.detail}, {item.wardName}, {item.districtName}, {item.provinceName}
              </Text>
              <br />
              <Text>SĐT: {item.contactPhone}</Text>
              <br />
              {item.isDefault && (
                <Text strong className="text-primary">
                  Địa chỉ mặc định
                </Text>
              )}
            </div>
          </List.Item>
        )}
      />
      <AddressForm
        open={isFormOpen}
        setOpen={setIsFormOpen}
        editingAddress={editingAddress}
        setEditingAddress={setEditingAddress}
      ></AddressForm>
    </Drawer>
  );
};

AddressBook.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AddressBook;