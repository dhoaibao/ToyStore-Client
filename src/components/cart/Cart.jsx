import {
  Drawer,
  Button,
  List,
  Avatar,
  Typography,
  Checkbox,
  Spin,
  Card,
} from "antd";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateCartItem, removeFromCart } from "../../redux/thunks/cartThunk";

const { Text, Title } = Typography;

const Cart = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartDetails);
  const loading = useSelector((state) => state.cart.loading);

  const [selectedItems, setSelectedItems] = useState([]);

  const onClose = () => {
    setOpen(false);
  };

  const increaseQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    dispatch(updateCartItem({ productId, quantity: item.quantity + 1 }));
  };

  const decreaseQuantity = (productId) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (item.quantity - 1 === 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateCartItem({ productId, quantity: item.quantity - 1 }));
    }
  };

  const handleCheckboxChange = (productId, checked) => {
    setSelectedItems((prev) =>
      checked
        ? [...prev, productId]
        : prev.filter((itemId) => itemId !== productId)
    );
  };

  const handleCheckAll = (checked) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.productId));
    } else {
      setSelectedItems([]);
    }
  };

  const deleteSelectedItems = () => {
    selectedItems.forEach((productId) => dispatch(removeFromCart(productId)));
    setSelectedItems([]);
  };

  const discountedPrice = (product) => {
    return (
      product?.discounts?.reduce((acc, discount) => {
        if (discount.discountType === "percentage") {
          return acc - (acc * discount.discountValue) / 100;
        }

        if (discount.discountType === "fixed_amount") {
          return acc - discount.discountValue;
        }
        return acc;
      }, product.price) || product.price
    );
  };

  const selectedTotalAmount = cartItems
    .filter((item) => selectedItems.includes(item.productId))
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
            onClick={() => {
              navigate("/checkout", { state: { selectedItems } });
              onClose();
            }}
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
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => {
              const isSelected = selectedItems.includes(item.productId);
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
                      onClick={() => decreaseQuantity(item.productId)}
                    >
                      -
                    </Button>,
                    <Button
                      key={"asc"}
                      shape="circle"
                      type="default"
                      onClick={() => increaseQuantity(item.productId)}
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
                      handleCheckboxChange(item.productId, e.target.checked)
                    }
                    style={{ transform: "scale(1.5)" }}
                  />
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item?.product.productImages[0].uploadImage.url}
                        shape="square"
                        size={64}
                      />
                    }
                    title={
                      <Link
                        to={`/products/${item?.product.slug}`}
                        onClick={onClose}
                      >
                        <Text
                          ellipsis
                          style={{
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "#333",
                          }}
                        >
                          {item?.product.productName}
                        </Text>
                      </Link>
                    }
                    description={
                      <div>
                        <Text>
                          <Text>Số lượng:</Text> <Text>{item?.quantity}</Text>
                        </Text>
                        <br />
                        <Text>
                          <Text>Giá: </Text>
                          <Text strong style={{ color: "red" }}>
                            {discountedPrice(item.product).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </Text>
                          <span style={{ margin: "0 4px" }}></span>
                          {discountedPrice(item.product) !==
                            item.product.price && (
                            <Text delete style={{ color: "gray" }}>
                              {item?.product.price.toLocaleString("vi-VN")}đ
                            </Text>
                          )}
                        </Text>
                        <Card>
                          <div className="flex items-center">
                            <img
                              src={
                                item.product.productImages[0].uploadImage.url
                              }
                              alt={item.product.productName}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <div>
                              <Text className="block font-semibold italic">
                                Quà tặng:
                              </Text>
                              <Text className="block">
                                {item.product.productName}
                              </Text>
                              <Text className="block">
                                Số lượng: {item.quantity}
                              </Text>
                              <Text className="block line-through">
                                Giá: 0 VND
                              </Text>
                            </div>
                          </div>
                        </Card>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </>
      )}

      <div className="flex justify-between items-center mb-4">
        <Checkbox
          onChange={(e) => handleCheckAll(e.target.checked)}
          checked={
            selectedItems.length === cartItems.length &&
            selectedItems.length !== 0
          }
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
