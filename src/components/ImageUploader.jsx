import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

const ImageUploader = ({ onUpload }) => {
  const [image, setImage] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
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
      <input {...getInputProps()} />
      {image ? (
        <img src={image.src} alt="Uploaded" className="max-w-full mx-auto" />
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