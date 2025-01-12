import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Upload, Input } from "antd";
import { Image } from "lucide-react";
import { productService } from "../../services";
import { useNavigate } from "react-router-dom";

const ImageSearchPopup = ({ isOpen, onClose }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setImageFile(null);
      setImageUrl("");
    }
  }, [isOpen]);

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      const file = info.file.originFileObj;
      setImageFile(file);
      setImageUrl("");
      console.log("Uploaded file:", file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
      console.log("Dropped file:", file);
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData("Text");
    if (pastedText) {
      setImageUrl(pastedText);
      setImageFile(null);
      console.log("Pasted URL:", pastedText);
    }
  };

  const handleSearch = () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      productService.imageSearch(formData).then((result) => {
        const encodedIds = btoa(
          result.data.map((product) => product.productId).join(",")
        );
        navigate(`/search?image=${encodedIds}`, {
          state: { isImageSearch: true },
        });
      });
    } else if (imageUrl) {
      productService.imageSearch({ url: imageUrl }).then((result) => {
        const encodedIds = btoa(
          result.data.map((product) => product.productId).join(",")
        );
        navigate(`/search?image=${encodedIds}`, {
          state: { isImageSearch: true },
        });
      });
    }
    onClose();
  };

  return (
    <Modal closable={false} open={isOpen} onCancel={onClose} footer={null}>
      <div
        className="text-center"
        onPaste={handlePaste}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h1 className="text-2xl font-medium text-gray-800 mb-6">
          Tìm kiếm bằng hình ảnh
        </h1>

        {!imageFile && !imageUrl && (
          <Upload.Dragger
            name="file"
            multiple={false}
            showUploadList={false}
            customRequest={({ onSuccess }) =>
              setTimeout(() => onSuccess("ok"), 0)
            }
            onChange={handleUploadChange}
            className="mb-4"
          >
            <p className="ant-upload-drag-icon flex justify-center items-center">
              <Image strokeWidth={1} size={48} />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo một hình ảnh vào đây để tải lên
            </p>
            <p className="ant-upload-hint">Chỉ hỗ trợ một hình ảnh</p>
          </Upload.Dragger>
        )}

        {!imageFile && (
          <div className="mt-4">
            <Input
              placeholder="Dán URL hình ảnh vào đây"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={!!imageFile} // Disable input if a file is uploaded
            />
          </div>
        )}

        {(imageFile || imageUrl) && (
          <div className="mt-4">
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
              alt="Preview"
              className="max-w-80 h-auto mx-auto"
            />
          </div>
        )}

        <div className="mt-6 flex justify-center space-x-4">
          <Button onClick={onClose} type="default">
            Hủy
          </Button>
          <Button
            onClick={handleSearch}
            type="primary"
            disabled={!imageFile && !imageUrl}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ImageSearchPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageSearchPopup;
