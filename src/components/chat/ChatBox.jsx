import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  Input,
  Button,
  List,
  Typography,
  message,
  Spin,
  Upload,
  Image,
} from "antd";
import { Send, ImageUp } from "lucide-react";
import { DownOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { setUnreadCount } from "../../redux/slices/messageSlice";
import moment from "moment";
import { messageService } from "../../services";

const { Text } = Typography;

const ChatDrawer = ({ open, setOpen, socket }) => {
  const { userId, user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showScrollIcon, setShowScrollIcon] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [fileList, setFileList] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const unreadCount = useSelector((state) => state.message.unreadCount);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userId && open && hasMore) {
      const fetchMessages = async () => {
        try {
          setLoading(true);
          const result = await messageService.getMessages(
            userId,
            `page=${page}&limit=20`,
          );
          if (result && result.pagination) {
            setPage(result.pagination.page);
            setHasMore(result.pagination.page < result.pagination.totalPages);
            setMessages((prev) => [...result.data, ...prev]);
            result.data.map((msg) => {
              if (!msg.isRead) {
                socket.emit("markAsRead", {
                  senderId: msg.senderId,
                });
              }
            });
          }
          dispatch(setUnreadCount(0));
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          message.error("Không thể tải tin nhắn!");
        }
      };
      fetchMessages();
    }
    if (!open) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
    }
  }, [open, userId, dispatch, page, hasMore, socket]);

  const handleNotification = (data) => {
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
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("updateStatus", (senderId) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === senderId && !msg.isRead
            ? { ...msg, isRead: true }
            : msg,
        ),
      );
    });

    socket.on("newMessage", (data) => {
      if (open) {
        setMessages((prev) => [...prev, { ...data }]);
        socket.emit("markAsRead", {
          senderId: data.senderId,
          receiverId: userId,
        });
        dispatch(setUnreadCount(0));
      } else {
        dispatch(setUnreadCount(unreadCount + 1));
      }
      handleNotification(data);
    });

    return () => {
      socket.off("updateStatus");
      socket.off("newMessage");
    };
  }, [socket, open, dispatch, userId, unreadCount]);

  useEffect(() => {
    if (messagesEndRef.current && page === 1) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollIcon(false);
    }
  }, [messages, page]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollIcon(!isAtBottom);

      const isAtTop = scrollTop <= 10;
      if (isAtTop && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShowScrollIcon(false);
    }
  };

  const sendMessage = () => {
    if ((!newMessage.trim() && fileList.length === 0) || !socket) return;
    console.log(fileList);
    const newMsg = {
      senderId: userId,
      content: newMessage,
      time: new Date(),
      senderName: user.fullName,
      avatar: user.avatar,
      files: fileList.map((file) => ({
        originName: file.originFileObj.name,
        mimetype: file.originFileObj.type,
        buffer: file.originFileObj,
      })),
    };
    socket.emit("sendMessage", newMsg);
    setMessages([
      ...messages,
      {
        ...newMsg,
        uploadImages: fileList.map((file) => ({
          url: URL.createObjectURL(file.originFileObj),
        })),
      },
    ]);
    setNewMessage("");
    setFileList([]);
    scrollToBottom();
  };

  console.log(messages);

  const closeDrawer = () => {
    setOpen(false);
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid),
    );
  };

  return (
    <Drawer
      closable={false}
      title="Tin nhắn"
      open={open}
      onClose={closeDrawer}
      width={400}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "0",
        },
      }}
      footer={
        <div>
          {fileList.length > 0 && (
            <Upload
              fileList={fileList}
              listType="picture-card"
              onRemove={handleRemove}
            />
          )}
          <div className="flex items-center justify-center space-x-2 p-2">
            <Upload
              beforeUpload={(file) => {
                // Check if file with same name already exists in fileList
                const isDuplicate = fileList.some(
                  (item) => item.originFileObj.name === file.name,
                );
                if (isDuplicate) {
                  message.warning("Hình ảnh này đã được chọn");
                  return Upload.LIST_IGNORE;
                }
                return false;
              }}
              showUploadList={false}
              multiple
              fileList={fileList}
              accept="image/*"
              maxCount={5}
              onChange={handleUploadChange}
            >
              <Button type="text" className="p-0">
                <ImageUp strokeWidth={1} size={26} />
              </Button>
            </Upload>
            <Input
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={sendMessage}
            />
            <Button type="primary" onClick={sendMessage} className="px-3">
              <Send strokeWidth={1} size={18} />
            </Button>
          </div>
        </div>
      }
    >
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2.5 bg-gray-100 relative"
      >
        <List
          dataSource={messages}
          renderItem={(message, index) => {
            const previousMessage = messages[index - 1];
            const showDateHeader =
              !previousMessage ||
              moment(message.time).format("DD/MM/YYYY") !==
                moment(previousMessage.time).format("DD/MM/YYYY");
            return (
              <>
                {showDateHeader && (
                  <div className="text-center sticky top-0 z-50 m-2 text-xs flex justify-center">
                    {loading ? (
                      <Spin size="small" />
                    ) : (
                      <span className="bg-gray-300 w-32 rounded-lg p-1 ">
                        {moment(message.time).format("DD/MM/YYYY") ===
                        moment().format("DD/MM/YYYY")
                          ? "Hôm nay"
                          : moment(message.time).format("DD/MM/YYYY")}
                      </span>
                    )}
                  </div>
                )}
                <div
                  className={`flex mb-2 ${
                    message.senderId === userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.uploadImages && message.uploadImages.length > 0 && (
                    <div
                      className={`max-w-[70%] ${message.senderId === userId ? "ml-auto" : "mr-auto"}`}
                    >
                      <div className="flex flex-col">
                        <div className={`flex flex-wrap gap-1 ${message.senderId === userId ? "justify-end" : "justify-start"}`}>
                          {message.uploadImages.map((image, idx) => (
                            <Image
                              key={idx}
                              src={image.url}
                              className="rounded-lg"
                              width={100}
                              height={100}
                              style={{ objectFit: 'cover' }}
                              preview={true}
                            />
                          ))}
                        </div>
                        <Text
                          type="secondary"
                          className="text-xs mt-1 text-right"
                        >
                          <span>{moment(message.time).format("HH:mm")}</span>
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`flex mb-2 ${
                    message.senderId === userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.content && (
                    <div
                      className={`max-w-[70%] p-2.5 rounded-lg shadow-md ${
                        message.senderId === userId
                          ? "bg-[#e6f7ff]"
                          : "bg-white"
                      }`}
                    >
                      <Text>{message.content}</Text>
                      <br />
                      <Text
                        type="secondary"
                        className="flex space-x-1 justify-between text-xs"
                      >
                        <span>{moment(message.time).format("HH:mm")}</span>
                      </Text>
                    </div>
                  )}
                </div>
                <span className="flex justify-end">
                  {index + 1 === messages.length &&
                    message.senderId === userId && (
                      <Text className="text-gray-600 text-xs">
                        {message.isRead ? "Đã xem" : "Đã gửi"}
                      </Text>
                    )}
                </span>
              </>
            );
          }}
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
  socket: PropTypes.any.isRequired,
};

export default ChatDrawer;
