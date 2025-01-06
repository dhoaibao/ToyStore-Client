import { useState } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        setImage(img);
        onUpload(img);
      };
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 mb-4 p-6 text-center cursor-pointer"
    >
      <input {...getInputProps({ accept: "image/*" })} />
      {image ? (
        <p>{fileName}</p>
        // <img src={image.src} alt="Uploaded" className="max-w-1/2 mx-auto" />
      ) : (
        <p>Kéo & thả hình ảnh vào đây, hoặc nhấp để chọn</p>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ImageUploader;
