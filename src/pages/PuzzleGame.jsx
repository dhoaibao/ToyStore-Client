import { useState, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Modal } from "antd";
import Piece from "../components/Piece";
import DropZone from "../components/DropZone";
import ImageUploader from "../components/ImageUploader";

const App = () => {
  const [image, setImage] = useState(null);
  const [pieces, setPieces] = useState([]); 
  const canvasRef = useRef(null);
  const [placedPieces, setPlacedPieces] = useState([]); 
  const [isModalVisible, setIsModalVisible] = useState(false); 

  // useEffect(() => {
  //   if (
  //     placedPieces.length === pieces.length &&
  //     placedPieces.every((p) => p.isCorrect)
  //   ) {
  //     alert("Chúc mừng! Bạn đã hoàn thành trò chơi!");
  //   }
  // }, [placedPieces, pieces]);

  // const handleUpload = (e) => {
  //   console.log()
  //   const file = e.target.files[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setImage(imageUrl);
  //   }
  // };

  const handleUpload = (img) => {
    setImage(img.src);
  };

  const handleCutImage = () => {
    if (!image) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const rows = 4; 
      const cols = 4; 
      const pieceWidth = img.width / cols;
      const pieceHeight = img.height / rows;
  
      const newPieces = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          canvas.width = pieceWidth; 
          canvas.height = pieceHeight;
          ctx.clearRect(0, 0, pieceWidth, pieceHeight);
          ctx.drawImage(
            img,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );
          const pieceDataURL = canvas.toDataURL();
          newPieces.push({
            id: `${row}-${col}`,
            image: pieceDataURL,
            position: { row, col },
          });
        }
      }
      setPieces(newPieces.sort(() => Math.random() - 0.5));
    };
  };
  

  const handleDrop = (item, targetPosition) => {
    if (!item.position) return;

    const isCorrect =
      item.position.row === targetPosition.row &&
      item.position.col === targetPosition.col;

    setPlacedPieces((prev) => [
      ...prev.filter((p) => p.id !== item.id),
      { ...item, targetPosition, isCorrect }, 
    ]);
  };

  const onDragEndHandler = (item, monitor) => {
    if (monitor.didDrop()) {
      setPieces((prevPieces) => prevPieces.filter((piece) => piece.id !== item.id));
    }
  };
  
  useEffect(() => {
    if (
      placedPieces.length === pieces.length &&
      placedPieces.every((p) => p.isCorrect)
    ) {
      setIsModalVisible(true);
    }
  }, [placedPieces, pieces]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          Game Xếp Hình Kéo Thả
        </h1>
        {/* <div className="mb-4 w-full max-w-md">
          <label className="block text-sm font-medium text-gray-700">
            Upload ảnh:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}
        <ImageUploader onUpload={handleUpload} />
        {image && (
          <div className="mb-4">
            <Button
              onClick={handleCutImage}
              className="w-full py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
            >
              Cắt ảnh thành mảnh
            </Button>
            
          </div>
        )}
        <div className="flex gap-6 mb-6 w-full max-w-6xl">
          {/* Khu vực bên trái: Hiển thị mảnh ghép */}
          <div className="w-1/2 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Mảnh ghép</h2>
            <div className="flex flex-wrap">
              {pieces.map((piece) => (
                <Piece
                  key={piece.id}
                  id={piece.id}
                  image={piece.image}
                  position={piece.position}
                  onDragEnd={onDragEndHandler}
                />
              ))}
            </div>
          </div>

          {/* Khu vực bên phải: Bảng kéo thả */}
          <div className="w-1/2 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Bảng kéo thả</h2>
            <div className="grid grid-cols-4">
              {Array.from({ length: 16 }).map((_, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;

                const placedPiece = placedPieces.find(
                  (p) =>
                    p.targetPosition?.row === row &&
                    p.targetPosition?.col === col
                );

                return (
                  <DropZone
                    key={`${row}-${col}`}
                    position={{ row, col }}
                    onDrop={handleDrop}
                    placedPiece={placedPiece}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Canvas ẩn dùng để cắt ảnh */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Modal thông báo hoàn thành */}
      <Modal
        title="Chúc mừng!"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        okText="Tiếp tục"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>🎉 Bạn đã hoàn thành trò chơi! 🎉</p>
      </Modal>
    </DndProvider>
  );
};

export default App;
