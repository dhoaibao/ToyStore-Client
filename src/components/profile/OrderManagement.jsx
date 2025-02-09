import {
  Drawer,
  Card,
  Typography,
  Button,
  Tag,
  Table,
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
import moment from "moment";

const { Text, Title } = Typography;

const OrderManagement = ({ open, setOpen }) => {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isChildDrawerOpen, setIsChildDrawerOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = `orderId=${searchText}&orderStatusId=${selectedStatus}&page=${currentPage}&limit=${10}`;
        const orderResponse = await orderService.getOrderByUser(query);
        console.log("orders: ", orderResponse.data);
        setOrders(orderResponse.data);
        setTotalPage(orderResponse.pagination.totalPages * 10);

        // Order Status Options
        const orderStatusResponse =
          await orderStatusService.getAllOrderStatuses();

        let options = [{ value: 0, label: "Tất cả" }];
        orderStatusResponse.data.map((item) =>
          options.push({ value: item.orderStatusId, label: item.statusName })
        );
        setOrderStatuses(options);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, searchText, selectedStatus, currentPage]);

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

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: ["product", "productImages"],
      key: "image",
      render: (productImages) => {
        const imageUrl = productImages[0]?.uploadImage?.url;
        return (
          <img
            src={imageUrl}
            alt="Product"
            style={{ width: "50px", height: "50px" }}
          />
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: ["product", "productName"],
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (price) => `${price.toLocaleString("vi-VN")}đ`,
    },
  ];

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
                <Text strong style={{ fontSize: "16px" }}>
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
              className="hover:shadow-lg hover:bg-blue-50"
            >
              <p>
                Thời gian đặt hàng:{" "}
                {moment(order.createdAt).format("DD/MM/YYYY HH:mm")}
              </p>
              <p>
                Trạng thái:{" "}
                <Tag
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

      {/* Drawer Con */}
      <Drawer
        title={
          selectedOrder && (
            <Title level={4}>Chi tiết đơn hàng: #{selectedOrder.orderId}</Title>
          )
        }
        placement="right"
        width={600}
        open={isChildDrawerOpen}
        onClose={closeChildDrawer}
      >
        {selectedOrder && (
          <>
            <div className="space-y-1">
              <p>
                Thời gian đặt hàng:{" "}
                {moment(selectedOrder.createdAt).format("DD/MM/YYYY HH:mm")}
              </p>
              <p>
                Trạng thái:{" "}
                <Tag
                  color={
                    selectedOrder.orderStatus.statusName === "Chờ xác nhận"
                      ? "orange"
                      : selectedOrder.orderStatus.statusName === "Đang xử lý"
                      ? "blue"
                      : selectedOrder.orderStatus.statusName === "Đang giao"
                      ? "yellow"
                      : selectedOrder.orderStatus.statusName === "Đã giao"
                      ? "green"
                      : "red"
                  }
                >
                  {selectedOrder.orderStatus.statusName}
                </Tag>
              </p>
              <p>
                Tổng tiền hàng:{" "}
                <Text strong>
                  {selectedOrder.totalPrice.toLocaleString("vi-VN")}đ
                </Text>
              </p>
              <p>
                Giảm:{" "}
                <Text strong>
                  -{selectedOrder.totalDiscount.toLocaleString("vi-VN")}đ
                </Text>
              </p>
              <p>
                Phí vận chuyển:{" "}
                <Text strong>
                  {selectedOrder.shippingFee.toLocaleString("vi-VN")}đ
                </Text>
              </p>
              <p>
                <Text strong>Tổng tiền: </Text>
                <Text className="text-red-600" strong>
                  {selectedOrder.finalPrice.toLocaleString("vi-VN")}đ
                </Text>
              </p>
            </div>
            <Table
              columns={columns}
              dataSource={selectedOrder.orderDetails}
              pagination={false}
              className="mt-4"
              bordered
            />
          </>
        )}
      </Drawer>
    </Drawer>
  );
};

OrderManagement.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default OrderManagement;
