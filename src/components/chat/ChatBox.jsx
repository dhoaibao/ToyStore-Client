import { useState, useEffect } from "react";
import { Drawer, Input, Button, List, Typography } from "antd";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import moment from "moment";

const { Text } = Typography;

const ChatDrawer = ({ open, setOpen, sender, receiver }) => {
  const { userId } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userId) {
      const newSocket = io("http://localhost:3000", {
        query: { userId: userId.toString() },
      });

      setSocket(newSocket);

      newSocket.on("newMessage", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            time: moment(data.createdAt).format("HH:mm"),
          },
        ]);
      });

      return () => {
        newSocket.off("newMessage");
        newSocket.disconnect();
      };
    }
  }, [userId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      senderId: userId,
      content: newMessage,
      time: new Date(),
    };
    socket.emit("sendMessage", newMsg);
    setMessages([
      ...messages,
      {
        ...newMsg,
        time: moment(newMsg.time).format("HH:mm"),
      },
    ]);
    setNewMessage("");
  };

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
                  message.senderId === userId ? "flex-end" : "flex-start",
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
                    message.senderId === userId ? "#e6f7ff" : "#ffffff",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Text strong>
                  {message.senderId === userId ? "Bạn" : receiver}
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
  open: PropTypes.bool.isRequired, 
  setOpen: PropTypes.func.isRequired, 
  sender: PropTypes.string.isRequired, // Người gửi
  receiver: PropTypes.string.isRequired, // Người nhận
};

export default ChatDrawer;
