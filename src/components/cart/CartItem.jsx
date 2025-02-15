import { Button, List, Avatar, Checkbox, Typography } from "antd";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCartItem, removeFromCart } from "../../redux/thunks/cartThunk";
import discountedPrice from "../../utils/discountedPrice";

const { Text } = Typography;

const CartItem = ({
  items,
  handleCheckboxChange,
  selectedItemIds = [],
  onClose,
  action,
  checkbox,
}) => {
  const dispatch = useDispatch();

  const increaseQuantity = (productId) => {
    const item = items.find((item) => item.productId === productId);
    dispatch(updateCartItem({ productId, quantity: item.quantity + 1 }));
  };

  const decreaseQuantity = (productId) => {
    const item = items.find((item) => item.productId === productId);
    if (item.quantity - 1 === 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateCartItem({ productId, quantity: item.quantity - 1 }));
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={items}
      renderItem={(item) => {
        const isSelected = selectedItemIds.includes(item.productId);
        return (
          <List.Item
            key={item.productId}
            className={`${
              isSelected ? "bg-blue-100" : "hover:bg-gray-100"
            } rounded-lg mb-2 px-4 py-2 transition-all`}
            actions={
              action
                ? [
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
                  ]
                : []
            }
          >
            {/* Custom Styled Checkbox */}
            {checkbox && (
              <Checkbox
                className="mx-4"
                checked={isSelected}
                onChange={(e) =>
                  handleCheckboxChange(item.productId, e.target.checked)
                }
                style={{ transform: "scale(1.5)" }}
              />
            )}
            <List.Item.Meta
              avatar={
                <Avatar
                  src={item?.product.productImages[0].uploadImage.url}
                  shape="square"
                  size={64}
                />
              }
              title={
                <Link to={`/products/${item?.product.slug}`} onClick={onClose}>
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
              className="px-2"
              description={
                <div>
                  <Text>
                    <Text>Số lượng:</Text> <Text>{item?.quantity}</Text>
                  </Text>
                  <br />
                  <Text>
                    <Text>Giá: </Text>
                    <Text strong style={{ color: "red" }}>
                      {discountedPrice(item.product).toLocaleString("vi-VN")}đ
                    </Text>
                    <span style={{ margin: "0 4px" }}></span>
                    {discountedPrice(item.product) !== item.product.price && (
                      <Text delete style={{ color: "gray" }}>
                        {item?.product.price.toLocaleString("vi-VN")}đ
                      </Text>
                    )}
                  </Text>
                  {item?.product?.promotions?.map((promotion) => {
                    if (
                      promotion.discountType.startsWith("buy_") &&
                      promotion.discountType.includes("_get_")
                    ) {
                      const [x, y] = promotion.discountType.match(/\d+/g);
                      return (
                        <Text key={promotion.promotionId}>
                          <div className="flex mt-2 items-center">
                            <img
                              src={
                                item.product.productImages[0].uploadImage.url
                              }
                              alt={item.product.productName}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <div>
                              <Text className="block text-xs font-semibold">
                                Quà tặng:
                              </Text>
                              <Text ellipsis className="block text-xs">
                                {item.product.productName}
                              </Text>
                              <Text className="block text-xs">
                                Số lượng: {parseInt((item.quantity / x) * y)}
                              </Text>
                              <div className="flex items-center">
                                <Text className="block text-xs">Giá: 0đ</Text>
                                <span style={{ margin: "0 2px" }}></span>
                                <Text className="block line-through text-xs">
                                  {item?.product.price.toLocaleString("vi-VN")}đ
                                </Text>
                              </div>
                            </div>
                          </div>
                        </Text>
                      );
                    }
                    return null;
                  })}
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

CartItem.propTypes = {
  items: PropTypes.array.isRequired,
  handleCheckboxChange: PropTypes.func,
  selectedItemIds: PropTypes.array,
  onClose: PropTypes.func,
  action: PropTypes.bool.isRequired,
  checkbox: PropTypes.bool.isRequired,
};

export default CartItem;
