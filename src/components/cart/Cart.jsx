import { Drawer, Button, List, Avatar, Typography, Checkbox } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const { Text, Title } = Typography;

const Cart = ({ open, setOpen }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 LEGO SUPERHEROES 76293",
      price: 1179000,
      quantity: 1,
      image:
        "https://www.mykingdom.com.vn/cdn/shop/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
    },
    {
      id: 2,
      name: "Đồ Chơi Lắp Ráp Lịch Giáng Sinh Người Nhện 2024 LEGO SUPERHEROES 76293",
      price: 1179000,
      quantity: 2,
      image:
        "https://www.mykingdom.com.vn/cdn/shop/files/lich-giang-sinh-nguoi-nhen-2024-lego-superheroes-76293_5.jpg?v=1733712457&width=500",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);

  const onClose = () => {
    setOpen(false);
  };

  // Tăng số lượng sản phẩm
  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Xử lý chọn checkbox
  const handleCheckboxChange = (id, checked) => {
    setSelectedItems((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  // Xử lý chọn tất cả checkbox
  const handleCheckAll = (checked) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Xóa các sản phẩm đã chọn
  const deleteSelectedItems = () => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]); // Reset danh sách sản phẩm được chọn
  };

  // Tính tổng giá tiền
  const selectedTotalAmount = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Drawer
      closable={false}
      width={600}
      title={<Title level={3}>Giỏ hàng của bạn</Title>}
      onClose={onClose}
      open={open}
      footer={
        <div className="text-right">
          <p className="text-lg font-semibold">
            Tổng cộng:{" "}
            <Text strong style={{ color: "#d4380d", fontSize: "18px" }}>
              {selectedTotalAmount.toLocaleString("vi-VN")}đ
            </Text>
          </p>
          <Button
            type="primary"
            size="large"
            className="mt-2"
            disabled={cartItems.length === 0}
          >
            Thanh toán
          </Button>
        </div>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={cartItems}
        renderItem={(item) => {
          const isSelected = selectedItems.includes(item.id);
          return (
            <List.Item
              className={`${
                isSelected ? "bg-blue-100" : "hover:bg-gray-100"
              } rounded-lg mb-2 px-4 py-2 transition-all`}
              actions={[
                <Button
                  key={"desc"}
                  shape="circle"
                  type="default"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </Button>,
                <Button
                  key={"asc"}
                  shape="circle"
                  type="default"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </Button>,
              ]}
            >
              {/* Custom Styled Checkbox */}
              <Checkbox
                className="mx-4"
                checked={isSelected}
                onChange={(e) =>
                  handleCheckboxChange(item.id, e.target.checked)
                }
                style={{ transform: "scale(1.5)" }}
              />
              <List.Item.Meta
                avatar={<Avatar src={item.image} shape="square" size={64} />}
                title={
                  <Link to={"/products/abc"} onClick={onClose}>
                    <Text
                      ellipsis
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      {item.name}
                    </Text>
                  </Link>
                }
                description={
                  <div>
                    <Text>
                      <Text>Số lượng:</Text> <Text>{item.quantity}</Text>
                    </Text>
                    <br />
                    <Text>
                      <Text>Giá: </Text>
                      <Text strong style={{ color: "red" }}>
                        {item.price.toLocaleString("vi-VN")}đ
                      </Text>
                      <span style={{ margin: "0 4px" }}></span>
                      <Text delete style={{ color: "gray" }}>
                        {item.price.toLocaleString("vi-VN")}đ
                      </Text>
                    </Text>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />

      <div className="flex justify-between items-center mb-4">
        <Checkbox
          onChange={(e) => handleCheckAll(e.target.checked)}
          checked={selectedItems.length === cartItems.length}
        >
          Chọn tất cả
        </Checkbox>
        {selectedItems.length > 0 && (
          <Button
            className="text-red-600 hover:text-red-700"
            type="danger"
            onClick={deleteSelectedItems}
            disabled={selectedItems.length === 0}
          >
            Xóa các sản phẩm đã chọn ({selectedItems.length})
          </Button>
        )}
      </div>
    </Drawer>
  );
};

Cart.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default Cart;
