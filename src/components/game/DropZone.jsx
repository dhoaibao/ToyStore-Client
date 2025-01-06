import PropTypes from "prop-types";
import { useDrop } from "react-dnd";

const DropZone = ({ position, onDrop, placedPiece }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: "piece",
    drop: (item) => onDrop(item, position),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const gridSize = 4; // Số hàng/cột (đảm bảo khớp với số cắt ảnh)
  const backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;

  return (
    <div
      ref={dropRef}
      className={`w-16 h-16 rounded-sm border border-gray-300 flex items-center justify-center transition ${
        isOver
          ? "bg-blue-100"
          : placedPiece?.isCorrect
          ? "bg-green-100"
          : "bg-white"
      }`}
    >
      {placedPiece && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${placedPiece.image})`,
            backgroundPosition: `-${placedPiece.position.col * (100 / gridSize)}% -${
              placedPiece.position.row * (100 / gridSize)
            }%`,
            backgroundSize: backgroundSize,
          }}
        />
      )}
    </div>
  );
};

DropZone.propTypes = {
  position: PropTypes.shape({
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
  }).isRequired,
  onDrop: PropTypes.func.isRequired,
  placedPiece: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    position: PropTypes.shape({
      row: PropTypes.number.isRequired,
      col: PropTypes.number.isRequired,
    }).isRequired,
    isCorrect: PropTypes.bool.isRequired,
  }),
};

export default DropZone;
