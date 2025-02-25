import { useState, useEffect, useMemo } from "react";
import { Breadcrumb, Row, Col, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { GHNService, orderService, voucherService } from "../services";
import { useSelector, useDispatch } from "react-redux";
import { getAddressByUser } from "../redux/thunks/addressThunk";
import { getCartByUser } from "../redux/thunks/cartThunk";
import discountedPrice from "../utils/discountedPrice";
import ShippingAddress from "../components/checkout/ShippingAddress";
import AddressModal from "../components/checkout/AddressModal";
import OrderItem from "../components/checkout/OrderItem";
import PaymentInfo from "../components/checkout/PaymentInfo";
import VoucherModal from "../components/checkout/VoucherModal";
import OrderSuccess from "../components/checkout/OrderSuccess";

const CheckoutPage = () => {
  const dispatch = useDispatch();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);

  const addresses = useSelector((state) => state.address.addresses);
  const cartId = useSelector((state) => state.cart.cartId);

  const addressString = useMemo(
    () => (address) =>
      `${address.detail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
    []
  );

  const orderItems = useMemo(() => JSON.parse(sessionStorage.getItem("orderItems")) || [], []);

  useEffect(() => {
    const fetchVouchers = async () => {
      const response = await voucherService.getVoucherByUser();
      setVouchers(response.data);
    };
    fetchVouchers();
  }, []);

  useEffect(() => {
    dispatch(getAddressByUser());
  }, [dispatch]);

  useEffect(() => {
    const defaultAddress = addresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddress(defaultAddress.addressId);
    }
  }, [addresses]);

  const calculateShippingFee = async (address, quantity) => {
    try {
      const fee = await GHNService.getShippingFee(address, quantity);
      setShippingFee(fee);
    } catch (error) {
      console.error("Error calculating shipping fee:", error);
      message.error("Không thể tính phí vận chuyển.");
    }
  };

  useEffect(() => {
    if (selectedAddress && orderItems.length > 0) {
      const address = addresses.find(
        (item) => item.addressId === selectedAddress
      );
      const quantity = orderItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      calculateShippingFee(address, quantity);
    }
  }, [selectedAddress, orderItems, addresses]);

  const totalDiscountedPrice = () => {
    return orderItems?.reduce(
      (total, item) => total + discountedPrice(item.product) * item.quantity,
      0
    );
  };

  const totalPrice = () => {
    return orderItems?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const voucherDiscount = () => {
    if (selectedVoucher) {
      if (selectedVoucher.discountType === "percentage") {
        if (
          totalPrice() * (selectedVoucher.discountValue / 100) >
          selectedVoucher.maxPriceDiscount
        ) {
          return selectedVoucher.maxPriceDiscount;
        } else {
          return totalPrice() * (selectedVoucher.discountValue / 100);
        }
      } else {
        return selectedVoucher.discountValue;
      }
    }
    return 0;
  };

  const finalPrice = () => {
    return totalDiscountedPrice() + shippingFee - voucherDiscount();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const address = addresses.find(
      (item) => item.addressId === selectedAddress
    );
    const data = {
      voucherId: selectedVoucher ? selectedVoucher.voucherId : null,
      totalPrice: totalPrice(),
      totalDiscount: totalPrice() - totalDiscountedPrice() + voucherDiscount(),
      shippingFee,
      finalPrice: finalPrice(),
      paymentMethodId: paymentMethod,
      orderItems,
      cartId,
      addressString: addressString(address),
      contactName: address.contactName,
      contactPhone: address.contactPhone,
    };
    try {
      await orderService.createOrder(data);
      dispatch(getCartByUser());
      sessionStorage.removeItem("orderItems");
      setOrderSuccess(true);
      setLoading(false);
    } catch (error) {
      console.log("Error when order: ", error.message);
      setLoading(false);
      message.error("Xảy ra lỗi trong quá trình đặt hàng!");
    }
  };

  return (
    <>
      <div className="px-4 py-2 rounded-sm bg-primary">
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              title: "Thanh toán",
            },
          ]}
        />
      </div>
      {!orderSuccess ? (
        <div className="p-4 bg-gray-100 min-h-screen">
          <div>
            <Row gutter={12}>
              {/* Summary Order Section */}
              <Col className="w-3/5">
                <Col className="w-full mb-4">
                  <ShippingAddress
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                    setIsAddressModalOpen={setIsAddressModalOpen}
                  ></ShippingAddress>
                </Col>
                <Col className="w-full">
                  <OrderItem
                    orderItems={orderItems}
                    totalDiscountedPrice={totalDiscountedPrice}
                    totalPrice={totalPrice}
                  ></OrderItem>
                </Col>
              </Col>

              {/* Payment Details Section */}
              <Col className="w-2/5">
                <PaymentInfo
                  selectedVoucher={selectedVoucher}
                  setIsVoucherModalOpen={setIsVoucherModalOpen}
                  totalPrice={totalPrice}
                  shippingFee={shippingFee}
                  voucherDiscount={voucherDiscount}
                  finalPrice={finalPrice}
                  totalDiscountedPrice={totalDiscountedPrice}
                  setPaymentMethod={setPaymentMethod}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <OrderSuccess></OrderSuccess>
      )}

      <AddressModal
        open={isAddressModalOpen}
        setOpen={setIsAddressModalOpen}
        addresses={addresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      ></AddressModal>
      <VoucherModal
        open={isVoucherModalOpen}
        setOpen={setIsVoucherModalOpen}
        vouchers={vouchers}
        handleApplyVoucher={setSelectedVoucher}
      ></VoucherModal>
    </>
  );
};

export default CheckoutPage;
