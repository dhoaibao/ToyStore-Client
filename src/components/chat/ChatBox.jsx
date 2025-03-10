import { useState, useEffect, useRef } from "react";
import { Drawer, Input, Button, List, Typography, message } from "antd";
import { Check, CheckCheck } from "lucide-react";
import { DownOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { setUnreadCount } from "../../redux/slices/messageSlice";
import io from "socket.io-client";
import moment from "moment";
import { Send } from "lucide-react";
import { messageService } from "../../services";

const { Text } = Typography;

const ChatDrawer = ({ open, setOpen }) => {
  const { userId, user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showScrollIcon, setShowScrollIcon] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);

  const unreadCount = useSelector((state) => state.message.unreadCount);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && open) {
      const fetchMessages = async () => {
        try {
          const result = await messageService.getMessages(userId);
          setMessages(
            result.data.map((msg) => ({
              ...msg,
              time: moment(msg.time).format("HH:mm"),
            })),
          );
          // await messageService.markAsRead(userId);
          dispatch(setUnreadCount(0));
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          message.error("Không thể tải tin nhắn!");
        }
      };
      fetchMessages();
    }
  }, [open, userId, dispatch]);

  useEffect(() => {
    if (userId) {
      const newSocket = io("http://localhost:3000", {
        query: { userId: userId.toString() },
      });

      socketRef.current = newSocket;

      newSocket.on("updateStatus", (senderId) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === senderId && !msg.isRead
              ? { ...msg, isRead: true }
              : msg,
          ),
        );
      });

      newSocket.on("newMessage", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            time: moment(data.time).format("HH:mm"),
          },
        ]);
        if (open) {
          newSocket.emit("markAsRead", {
            senderId: data.senderId,
            receiverId: userId,
          });
          dispatch(setUnreadCount(0));
        } else {
          dispatch(setUnreadCount(unreadCount + 1));
        }

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Toy Store", {
            body: data.content,
          });
        } else if (
          "Notification" in window &&
          Notification.permission !== "denied"
        ) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification("Toy Store", {
                body: data.content,
              });
            }
          });
        }
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.off("newMessage");
          socketRef.current.off("updateStatus");
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [userId, dispatch, open, unreadCount]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollIcon(false);
    }
  }, [messages]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollIcon(!isAtBottom);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollIcon(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    const newMsg = {
      senderId: userId,
      content: newMessage,
      time: new Date(),
      senderName: user.fullName,
      avatar: user.avatar,
    };
    socketRef.current.emit("sendMessage", newMsg);
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
      title="Tin nhắn"
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
            <Send strokeWidth={1} size={18} />
          </Button>
        </div>
      }
    >
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          position: "relative",
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
                marginBottom: "10px",
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
                <Text>{message.content}</Text>
                <br />
                <Text
                  type="secondary"
                  className="flex space-x-1 justify-between text-xs"
                >
                  <span>{message.time}</span>
                  <span>
                    {message.senderId === userId &&
                      (message.isRead ? (
                        <CheckCheck strokeWidth={1} size={16} />
                      ) : (
                        <Check strokeWidth={1} size={16} />
                      ))}
                  </span>
                </Text>
              </div>
            </div>
          )}
        />
        <div ref={messagesEndRef} />
      </div>
      {showScrollIcon && (
        <Button
          shape="circle"
          icon={<DownOutlined />}
          onClick={scrollToBottom}
          className="fixed bottom-20 right-4 z-10"
        />
      )}
    </Drawer>
  );
};

ChatDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default ChatDrawer;
