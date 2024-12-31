import { Drawer, Card, Typography, Button, Tag, Table, message } from "antd";
import { useState } from "react";
import PropTypes from "prop-types";

const { Text, Title } = Typography;

const OrderManagement = ({ open, setOpen }) => {
  const [orders] = useState([
    {
      id: "DH001",
      date: "2024-01-01",
      status: "Đang xử lý",
      total: 300000,
      items: [
        { key: 1, name: "Sản phẩm 1", price: 150000, quantity: 1 },
        { key: 2, name: "Sản phẩm 2", price: 150000, quantity: 1 },
      ],
    },
    {
      id: "DH002",
      date: "2024-01-02",
      status: "Đã giao",
      total: 500000,
      items: [
        { key: 1, name: "Sản phẩm 3", price: 200000, quantity: 2 },
        { key: 2, name: "Sản phẩm 4", price: 100000, quantity: 1 },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isChildDrawerOpen, setIsChildDrawerOpen] = useState(false);

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
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
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
        <div className="text-right">
          <Button type="default" size="large" onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            title={
              <Text strong style={{ fontSize: "16px" }}>
                Mã đơn hàng: {order.id}
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
            <p>Ngày đặt: {order.date}</p>
            <p>
              Trạng thái:{" "}
              <Tag
                color={
                  order.status === "Đã giao"
                    ? "green"
                    : order.status === "Đang xử lý"
                    ? "blue"
                    : "red"
                }
              >
                {order.status}
              </Tag>
            </p>
            <p>
              Tổng tiền:{" "}
              <Text strong>{order.total.toLocaleString("vi-VN")}đ</Text>
            </p>
          </Card>
        ))}
      </div>

      {/* Drawer Con */}
      <Drawer
        title={
          selectedOrder && (
            <Title level={4}>Chi tiết đơn hàng: {selectedOrder.id}</Title>
          )
        }
        placement="right"
        width={400}
        open={isChildDrawerOpen}
        onClose={closeChildDrawer}
        footer={
          <div className="text-right">
            <Button onClick={closeChildDrawer} style={{ marginRight: 8 }}>
              Quay lại
            </Button>
          </div>
        }
      >
        {selectedOrder && (
          <>
            <p>Ngày đặt: {selectedOrder.date}</p>
            <p>
              Trạng thái:{" "}
              <Tag
                color={
                  selectedOrder.status === "Đã giao"
                    ? "green"
                    : selectedOrder.status === "Đang xử lý"
                    ? "blue"
                    : "red"
                }
              >
                {selectedOrder.status}
              </Tag>
            </p>
            <p>
              Tổng tiền:{" "}
              <Text strong>{selectedOrder.total.toLocaleString("vi-VN")}đ</Text>
            </p>
            <Table
              columns={columns}
              dataSource={selectedOrder.items}
              pagination={false}
              className="mt-4"
              bordered
              summary={(pageData) => {
                let total = 0;
                pageData.forEach(({ price, quantity }) => {
                  total += price * quantity;
                });
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2} align="right">
                      <Text strong>Tổng cộng:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong>{total.toLocaleString("vi-VN")}đ</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
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
