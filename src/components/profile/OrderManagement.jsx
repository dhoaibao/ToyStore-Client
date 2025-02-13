import {
  Drawer,
  Card,
  Typography,
  Button,
  Tag,
  Empty,
  Select,
  Input,
  Spin,
  Pagination,
} from "antd";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { orderService, orderStatusService } from "../../services";
import { LoadingOutlined } from "@ant-design/icons";
import OrderDetail from "./OrderDetail";
import moment from "moment";
import { useLocation } from "react-router-dom";

const { Text, Title } = Typography;

const OrderManagement = ({ open, setOpen }) => {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isChildDrawerOpen, setIsChildDrawerOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const location = useLocation();

  useEffect(() => {
    setIsChildDrawerOpen(false);
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Order Status Options
        const orderStatusResponse =
          await orderStatusService.getAllOrderStatuses();

        let options = [{ value: 0, label: "Tất cả" }];
        orderStatusResponse.data.map((item) =>
          options.push({ value: item.orderStatusId, label: item.statusName })
        );
        setOrderStatuses(options);

        // Orders
        const query = `orderId=${searchText}&orderStatusId=${selectedStatus}&page=${currentPage}&limit=${10}`;
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
  }, [open, cancelOrder, searchText, selectedStatus, currentPage]);

  const handleOrderSearch = (event) => {
    const id = event.target.value.replace("#", "");
    setSearchText(id);
  };

  const changeOrderStatus = (value) => {
    setSelectedStatus(value);
  };

  const onClose = () => {
    setOpen(false);
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
      title={<Title level={3}>Quản lý đơn hàng</Title>}
      onClose={onClose}
      open={open}
      footer={
        <div>
          {orders?.length > 0 && (
            <Pagination
              align="center"
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
      <div className="flex items-center justify-between space-x-2 mb-4">
        <Select
          value={selectedStatus}
          options={orderStatuses}
          onChange={changeOrderStatus}
          placeholder="Trạng thái"
          className="w-36"
        />
        <Input
          className="w-80"
          value={searchText}
          onChange={handleOrderSearch}
          placeholder="Nhập mã đơn hàng để tìm kiếm..."
        ></Input>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {orders.map((order) => (
            <Card
              key={order.orderId}
              title={
                <Text
                  strong
                  className="text-primary"
                  style={{ fontSize: "16px" }}
                >
                  Mã đơn hàng: #{order.orderId}
                </Text>
              }
              extra={
                <Button
                  type="link"
                  onClick={() => openChildDrawer(order)}
                  className="hover:text-blue-500"
                >
                  Xem chi tiết
                </Button>
              }
              hoverable
              style={{
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              className="hover:shadow-lg hover:bg-gray-100"
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
                    order.orderStatus.statusName === "Chờ xác nhận"
                      ? "orange"
                      : order.orderStatus.statusName === "Đang xử lý"
                      ? "yellow"
                      : order.orderStatus.statusName === "Đang giao"
                      ? "blue"
                      : order.orderStatus.statusName === "Đã giao"
                      ? "green"
                      : "red" // Đã hủy
                  }
                >
                  {order.orderStatus.statusName}
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
