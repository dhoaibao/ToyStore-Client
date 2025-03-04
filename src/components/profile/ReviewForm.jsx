import PropTypes from "prop-types";
import { useState } from "react";
import { Modal, Form, Input, Upload, message, Rate } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { reviewService } from "../../services";
import { useSelector } from "react-redux";

const ReviewForm = ({ open, setOpen, data }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.user);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemove = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("comment", values.comment);
    formData.append("rating", values.rating);
    formData.append("productId", data.product.productId);
    formData.append("orderDetailId", data.orderDetailId);
    formData.append("userId", user.userId);

    if (fileList.length > 0) {
      fileList.forEach((file) => {
        formData.append("images", file.originFileObj);
      });
    }

    console.log({ formData });

    try {
      await reviewService.createReview(formData);
      message.success("Trả lời thành công!");
      onClose();
    } catch (error) {
      switch (error.response?.data?.message) {
        case "Review already exists!":
          message.error("Bạn đã đánh giá sản phẩm này rồi!");
          break;
        case "Authorization: Permission denied!":
          message.error("Bạn không có quyền sử dụng tính năng này!");
          break;
        default:
          message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
          break;
      }
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Modal
      maskClosable={false}
      title="Đánh giá sản phẩm"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
      okText="Đánh giá"
      cancelText="Hủy"
      className="max-h-[95vh] overflow-y-auto scrollbar-hide"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Nội dung:"
          name="comment"
          rules={[
            { required: true, message: "Vui lòng nhập trả lời đánh giá" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Số sao:"
          rules={[{ required: true, message: "Vui lòng chọn số sao" }]}
          name="rating"
        >
          <Rate allowHalf />
        </Form.Item>
        <Form.Item label="Hình ảnh:" name="images">
          <Upload
            fileList={fileList}
            listType="picture-card"
            maxCount={5}
            accept="image/*"
            beforeUpload={() => false}
            onChange={handleUploadChange}
            onRemove={handleRemove}
          >
            {fileList.length < 5 && (
              <div className="flex-col">
                <UploadOutlined /> <p>Tải lên</p>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

ReviewForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default ReviewForm;
