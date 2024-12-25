// src/components/ImageUploader.js
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
    <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      {image ? (
        <img src={image.src} alt="Uploaded" style={{ maxWidth: '100%' }} />
      ) : (
        <p>Drag & drop an image here, or click to select one</p>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ImageUploader;