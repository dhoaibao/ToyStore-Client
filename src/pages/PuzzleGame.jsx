import { useState, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Piece from "../components/Piece";
import DropZone from "../components/DropZone";

const App = () => {
  const [image, setImage] = useState(null);
  const [pieces, setPieces] = useState([]); // Lưu các mảnh đã cắt
  const canvasRef = useRef(null);
  const [placedPieces, setPlacedPieces] = useState([]); // Lưu các mảnh đã đặt

  // useEffect(() => {
  //   if (
  //     placedPieces.length === pieces.length &&
  //     placedPieces.every((p) => p.isCorrect)
  //   ) {
  //     alert("Chúc mừng! Bạn đã hoàn thành trò chơi!");
  //   }
  // }, [placedPieces, pieces]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
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
    
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;
    
      const newPieces = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
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
      setPieces(newPieces);
    };    
  };

    const handleDrop = (item, targetPosition) => {
    if (!item.position) return;
  
    // Check if the piece is placed in the correct position
    const isCorrect =
      item.position.row === targetPosition.row &&
      item.position.col === targetPosition.col;
  
    // Update the state of placed pieces
    setPlacedPieces((prev) => [
      ...prev.filter((p) => p.id !== item.id), // Remove the piece if it was placed elsewhere
      { ...item, targetPosition, isCorrect }, // Add the piece with the new target position and correctness status
    ]);
  };

  console.log(pieces)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h1 className="text-3xl font-bold mb-6">Game Xếp Hình Kéo Thả</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload ảnh:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {image && (
          <div className="mb-4">
            <button
              onClick={handleCutImage}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
            >
              Cắt ảnh thành mảnh
            </button>
          </div>
        )}
        <div className="flex gap-4">
          {/* Khu vực bên trái: Hiển thị mảnh ghép */}
          <div className="w-1/2 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">Mảnh ghép</h2>
            <div className="flex flex-wrap">
              {pieces.map((piece) => (
                <Piece
                  key={piece.id}
                  id={piece.id}
                  image={image}
                  position={piece.position}
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
      {placedPieces.length === pieces.length &&
        placedPieces.every((p) => p.isCorrect) && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 font-bold rounded">
            🎉 Chúc mừng! Bạn đã hoàn thành trò chơi! 🎉
          </div>
        )}
    </DndProvider>
  );
};

export default App;
