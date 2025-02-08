import { useState, useEffect, useMemo } from "react";
import { Breadcrumb, Row, Col, message } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { GHNService, orderService } from "../services";
import { useSelector, useDispatch } from "react-redux";
import { getAddressByUser } from "../redux/thunks/addressThunk";
import discountedPrice from "../utils/discountedPrice";
import ShippingAddress from "../components/checkout/ShippingAddress";
import AddressModal from "../components/checkout/AddressModal";
import OrderDetail from "../components/checkout/OrderDetail";
import PaymentInfo from "../components/checkout/PaymentInfo";
import VoucherModal from "../components/checkout/VoucherModal";
import OrderSuccess from "../components/checkout/OrderSuccess";

const CheckoutPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const addresses = useSelector((state) => state.address.addresses);

  const addressString = useMemo(
    () => (address) =>
      `${address.detail}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`,
    []
  );

  const { orderItems } = location.state || [];

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
    if (selectedAddress) {
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

  const vouchers = [
    {
      id: 1,
      code: "DISCOUNT10",
      description: "Giảm 10% cho đơn hàng trên 1,000,000đ",
    },
    { id: 2, code: "FREESHIP", description: "Miễn phí vận chuyển" },
  ];

  const totalDiscount = () => {
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

  const finalPrice = () => {
    return totalDiscount() + shippingFee;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const address = addresses.find(
      (item) => item.addressId === selectedAddress
    );
    const data = {
      totalPrice: totalPrice(),
      totalDiscount: totalDiscount(),
      shippingFee,
      finalPrice: finalPrice(),
      paymentMethodId: paymentMethod,
      orderItems,
      addressString: addressString(address),
      contactName: address.contactName,
      contactPhone: address.contactPhone,
    };
    try {
      await orderService.createOrder(data);
      setOrderSuccess(true);
      setLoading(false);
    } catch (error) {
      console.log("Error when order: ", error);
      setLoading(false);
      message.error("Xảy ra lỗi trong quá trình đặt hàng!");
    }
  };

  const handleApplyVoucher = () => {
    if (!selectedVoucher) {
      message.error("Vui lòng chọn hoặc nhập mã voucher!");
      return;
    }
    message.success(`Áp dụng mã voucher: ${selectedVoucher}`);
    setIsVoucherModalOpen(false);
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
                  <OrderDetail
                    orderItems={orderItems}
                    totalDiscount={totalDiscount}
                    totalPrice={totalPrice}
                  ></OrderDetail>
                </Col>
              </Col>

              {/* Payment Details Section */}
              <Col className="w-2/5">
                <PaymentInfo
                  selectedVoucher={selectedVoucher}
                  setIsVoucherModalOpen={setIsVoucherModalOpen}
                  totalPrice={totalPrice}
                  shippingFee={shippingFee}
                  finalPrice={finalPrice}
                  totalDiscount={totalDiscount}
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
        selectedVoucher={selectedVoucher}
        setSelectedVoucher={setSelectedVoucher}
        handleApplyVoucher={handleApplyVoucher}
      ></VoucherModal>
    </>
  );
};

export default CheckoutPage;
