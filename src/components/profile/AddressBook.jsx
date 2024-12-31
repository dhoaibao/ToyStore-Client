import { useState } from "react";
import { List, Button, Input, Drawer, Form, Typography, message } from "antd";
import PropTypes from "prop-types";

const { Title, Text } = Typography;

const AddressBook = ({ open, setOpen }) => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Nhà riêng",
      address: "123 Đường ABC, Phường DEF, Quận GHI, TP.Hồ Chí Minh",
      phone: "0123456789",
    },
    {
      id: 2,
      name: "Văn phòng",
      address: "456 Đường XYZ, Phường LMN, Quận OPQ, TP.Hà Nội",
      phone: "0987654321",
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form] = Form.useForm();

  // Xử lý mở drawer để thêm hoặc chỉnh sửa địa chỉ
  const openAddressDrawer = (address = null) => {
    setEditingAddress(address);
    setIsDrawerOpen(true);
    form.setFieldsValue(address || { name: "", address: "", phone: "" });
  };

  // Đóng drawer
  const closeDrawer = () => {
    setEditingAddress(null);
    setIsDrawerOpen(false);
    form.resetFields();
  };

  // Lưu địa chỉ mới hoặc cập nhật địa chỉ
  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingAddress) {
          // Cập nhật địa chỉ
          setAddresses((prev) =>
            prev.map((item) =>
              item.id === editingAddress.id ? { ...item, ...values } : item
            )
          );
          message.success("Cập nhật địa chỉ thành công!");
        } else {
          // Thêm địa chỉ mới
          const newAddress = { id: Date.now(), ...values };
          setAddresses((prev) => [...prev, newAddress]);
          message.success("Thêm địa chỉ mới thành công!");
        }
        closeDrawer();
      })
      .catch(() => {
        message.error("Vui lòng kiểm tra lại thông tin!");
      });
  };

  // Xóa địa chỉ
  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
    message.success("Xóa địa chỉ thành công!");
  };

  return (
    <Drawer
      closable={false}
      title={<Title level={3}>Sổ quản lý địa chỉ</Title>}
      open={open}
      onClose={() => setOpen(false)}
      width={600}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
            Đóng
          </Button>
        </div>
      }
    >
      <Button
        type="primary"
        onClick={() => openAddressDrawer()}
        style={{ marginBottom: "20px" }}
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
                onClick={() => openAddressDrawer(item)}
              >
                Chỉnh sửa
              </Button>,
              <Button
                key="delete"
                type="link"
                danger
                onClick={() => handleDelete(item.id)}
              >
                Xóa
              </Button>,
            ]}
          >
            <div>
              <Text strong>{item.name}</Text>
              <br />
              <Text>{item.address}</Text>
              <br />
              <Text>SĐT: {item.phone}</Text>
            </div>
          </List.Item>
        )}
      />
      <Drawer
        title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={isDrawerOpen}
        onClose={closeDrawer}
        width={400}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSave} type="primary">
              {editingAddress ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên địa chỉ"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên địa chỉ!" }]}
          >
            <Input placeholder="Ví dụ: Nhà riêng, Văn phòng" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ đầy đủ" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại liên hệ" />
          </Form.Item>
        </Form>
      </Drawer>
    </Drawer>
  );
};

AddressBook.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default AddressBook;
