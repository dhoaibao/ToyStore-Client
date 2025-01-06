import { useState } from "react";
import { Drawer, Input, Button, List, Typography } from "antd";
import PropTypes from "prop-types";

const { Text } = Typography;

const ChatDrawer = ({ open, setOpen, sender, receiver }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "A",
      content: "Xin chào! Bạn khỏe không?",
      time: "10:00 AM",
    },
    {
      id: 2,
      sender: "B",
      content: "Mình khỏe. Còn bạn thì sao?",
      time: "10:02 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Gửi tin nhắn mới
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: Date.now(),
      sender,
      content: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage(""); // Reset input
  };

  // Đóng Drawer
  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Drawer
      closable={false}
      title={`Chat với ${receiver}`}
      open={open}
      onClose={closeDrawer}
      width={400}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "0",
      }}
      footer={
        <div style={{ display: "flex", padding: "10px" }}>
          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onPressEnter={sendMessage}
            style={{ marginRight: "10px", flex: 1 }}
          />
          <Button type="primary" onClick={sendMessage}>
            Gửi
          </Button>
        </div>
      }
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <List
          dataSource={messages}
          renderItem={(message) => (
            <div
              style={{
                justifyContent:
                  message.sender === sender ? "flex-end" : "flex-start",
                display: "flex",
                marginBottom: "10px", // Tạo khoảng cách giữa các tin nhắn
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    message.sender === sender ? "#e6f7ff" : "#ffffff",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Text strong>
                  {message.sender === sender ? "Bạn" : receiver}
                </Text>
                <br />
                <Text>{message.content}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {message.time}
                </Text>
              </div>
            </div>
          )}
        />
      </div>
    </Drawer>
  );
};

ChatDrawer.propTypes = {
  open: PropTypes.bool.isRequired, // Drawer có mở không
  setOpen: PropTypes.func.isRequired, // Hàm đóng Drawer
  sender: PropTypes.string.isRequired, // Người gửi
  receiver: PropTypes.string.isRequired, // Người nhận
};

export default ChatDrawer;
