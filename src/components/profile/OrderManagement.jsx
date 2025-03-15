import {
  Drawer,
  Card,
  Typography,
  Button,
  Tag,
  Empty,
  Tabs,
  Input,
  Spin,
  Pagination,
  DatePicker,
} from "antd";
const { RangePicker } = DatePicker;
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { orderService } from "../../services";
import { LoadingOutlined } from "@ant-design/icons";
import OrderDetail from "./OrderDetail";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { ORDER_STATUS } from "../../constants";

const { Text } = Typography;

const OrderManagement = ({ open, setOpen }) => {
  const [orders, setOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isChildDrawerOpen, setIsChildDrawerOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const location = useLocation();

  const orderStatuses = [
    { key: "all", label: "Tất cả", value: 0 },
    { key: "pending", label: "Chờ xác nhận", value: 1 },
    { key: "confirmed", label: "Đang xử lý", value: 2 },
    { key: "shipping", label: "Đang giao", value: 3 },
    { key: "delivered", label: "Đã giao", value: 4 },
    { key: "canceled", label: "Đã hủy", value: 5 },
  ];

  useEffect(() => {
    setIsChildDrawerOpen(false);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = `orderId=${searchText}&orderStatus=${selectedStatus}&page=${currentPage}&limit=${10}&startDate=${startDate}&endDate=${endDate}`;
        const orderResponse = await orderService.getOrderByUser(query);
        console.log("orders: ", orderResponse.data);
        setOrders(orderResponse.data);
        setTotalPage(orderResponse.pagination.totalPages * 10);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    if (open || cancelOrder) fetchData();
    setCancelOrder(false);
  }, [
    open,
    cancelOrder,
    searchText,
    selectedStatus,
    currentPage,
    startDate,
    endDate,
  ]);

  const handleOrderSearch = (event) => {
    const id = event.target.value.replace("#", "");
    setSearchText(id);
  };

  const changeOrderStatus = (value) => {
    setSelectedStatus(value);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0].format("YYYY-MM-DD"));
      setEndDate(dates[1].format("YYYY-MM-DD"));
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const onClose = () => {
    setSelectedOrder(null);
    setIsChildDrawerOpen(false);
  };

  const openChildDrawer = (order) => {
    setSelectedOrder(order);
    setIsChildDrawerOpen(true);
  };

  const closeChildDrawer = () => {
    setSelectedOrder(null);
    setIsChildDrawerOpen(false);
  };

  return (
    <Drawer
      width={600}
      closable={false}
      title={
        <div className="font-normal">
          <p className="mb-4 text-xl font-semibold">Quản lý đơn hàng</p>
          <Tabs
            type="card"
            defaultActiveKey="1"
            items={orderStatuses}
            onChange={changeOrderStatus}
          ></Tabs>
          <div className="flex items-center justify-between space-x-2">
            <Input
              className="w-1/2"
              value={searchText}
              onChange={handleOrderSearch}
              placeholder="Nhập mã đơn hàng để tìm kiếm..."
            ></Input>
            <RangePicker
              className="w-1/2"
              onChange={handleDateChange}
            ></RangePicker>
          </div>
        </div>
      }
      onClose={() => setOpen(false)}
      open={open}
      footer={
        <div>
          {orders?.length > 0 && (
            <Pagination
              align="center"
              simple
              defaultCurrent={1}
              current={currentPage}
              total={totalPage}
              onChange={setCurrentPage}
              className="mt-4"
            />
          )}
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {orders.map((order) => (
            <Card
              key={order.orderId}
              title={
                <Text strong className="text-primary text-base">
                  Mã đơn hàng: #{order.orderId}
                </Text>
              }
              extra={
                <Button type="link" onClick={() => openChildDrawer(order)}>
                  Xem chi tiết
                </Button>
              }
              className="bg-gray-100"
            >
              <p>
                Thời gian đặt hàng:{" "}
                {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
              </p>
              <p>
                Trạng thái:{" "}
                <Tag
                  className="rounded-lg font-medium"
                  color={
                    order.orderTrackings[order.orderTrackings.length - 1]
                      .orderStatus.statusName === "pending"
                      ? "orange"
                      : order.orderTrackings[order.orderTrackings.length - 1]
                          .orderStatus.statusName === "confirmed"
                      ? "purple"
                      : order.orderTrackings[order.orderTrackings.length - 1]
                          .orderStatus.statusName === "shipping"
                      ? "blue"
                      : order.orderTrackings[order.orderTrackings.length - 1]
                          .orderStatus.statusName === "delivered"
                      ? "green"
                      : "red" // Đã hủy
                  }
                >
                  {
                    ORDER_STATUS[
                      order.orderTrackings[order.orderTrackings.length - 1]
                        .orderStatus.statusName
                    ].label
                  }
                </Tag>
              </p>
              <p>
                Tổng tiền:{" "}
                <Text strong>{order.finalPrice.toLocaleString("vi-VN")}đ</Text>
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <Empty description={"Không có đơn hàng nào!"} />
        </div>
      )}
      <OrderDetail
        open={isChildDrawerOpen}
        onClose={closeChildDrawer}
        setCancelOrder={setCancelOrder}
        selectedOrder={selectedOrder}
        orderStatuses={orderStatuses}
      ></OrderDetail>
    </Drawer>
  );
};

OrderManagement.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default OrderManagement;
