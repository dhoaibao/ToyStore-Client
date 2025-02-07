import { Drawer, Button, Typography, Checkbox, Spin, message } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/thunks/cartThunk";
import discountedPrice from "../../utils/discountedPrice";
import CartItem from "./CartItem";

const { Text, Title } = Typography;

const Cart = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartDetails);
  const loading = useSelector((state) => state.cart.loading);

  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const onClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (productId, checked) => {
    setSelectedItemIds((prev) =>
      checked
        ? [...prev, productId]
        : prev.filter((itemId) => itemId !== productId)
    );
  };

  const handleCheckAll = (checked) => {
    if (checked) {
      setSelectedItemIds(cartItems.map((item) => item.productId));
    } else {
      setSelectedItemIds([]);
    }
  };

  const deleteSelectedItems = () => {
    selectedItemIds.forEach((productId) => dispatch(removeFromCart(productId)));
    setSelectedItemIds([]);
  };

  const handleCheckout = () => {
    const orderItems = selectedItemIds.map((productId) => {
      return cartItems.find((item) => item.productId === productId);
    });
    if (orderItems.length === 0) {
      message.error("Vui lòng chọn sản phẩm để thanh toán!");
    } else {
      navigate("/checkout", { state: { orderItems } });
      onClose();
    }
  };

  const selectedTotalAmount = cartItems
    .filter((item) => selectedItemIds.includes(item.productId))
    .reduce(
      (total, item) => total + discountedPrice(item.product) * item.quantity,
      0
    );

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
            onClick={handleCheckout}
          >
            Thanh toán
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <CartItem
            items={cartItems}
            handleCheckboxChange={handleCheckboxChange}
            selectedItemIds={selectedItemIds}
            onClose={onClose}
            action={true}
            checkbox={true}
          ></CartItem>
        </>
      )}

      <div className="flex justify-between items-center mb-4">
        <Checkbox
          onChange={(e) => handleCheckAll(e.target.checked)}
          checked={
            selectedItemIds.length === cartItems.length &&
            selectedItemIds.length !== 0
          }
        >
          Chọn tất cả
        </Checkbox>
        {selectedItemIds.length > 0 && (
          <Button
            className="text-red-600 hover:text-red-700"
            type="danger"
            onClick={deleteSelectedItems}
            disabled={selectedItemIds.length === 0}
          >
            Xóa các sản phẩm đã chọn ({selectedItemIds.length})
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
