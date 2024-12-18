import { Upload } from "lucide-react";

const ImageUpload = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-8 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>
        {/* Content */}
        <h2 className="text-center text-2xl font-bold mb-2">Search by image</h2>
        <p className="text-gray-500 text-center mb-6">
          Find similar images within Freepik’s library
        </p>
        <div className="border-dashed border-2 border-gray-300 rounded-lg h-48 flex justify-center items-center mb-4">
          <div className="text-center">
            <Upload size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Drag and drop an image here</p>
            <p className="text-gray-500 text-sm">or</p>
          </div>
        </div>
        {/* Button */}
        <button className="bg-blue-600 text-white w-full py-2 rounded-md font-medium hover:bg-blue-700">
          Select a file
        </button>
        {/* Footer */}
        <p className="text-gray-400 text-xs text-center mt-4">
          JPG, PNG / Max. 60 MB / Min. 224px x 224px
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
