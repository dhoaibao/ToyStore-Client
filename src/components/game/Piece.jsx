import PropTypes from "prop-types";
import { useDrag } from "react-dnd";

const Piece = ({ id, image, position, gridSize = 4, onDragEnd }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: "piece",
    item: { id, image, position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (onDragEnd && item) {
        onDragEnd(item, monitor);
      }
    },
  });

  const backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;

  return (
    <div
      ref={dragRef}
      className={`w-16 h-16 border border-gray-300 rounded-sm transition ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: `-${position.col * (100 / gridSize)}% -${
          position.row * (100 / gridSize)
        }%`,
        backgroundSize: backgroundSize,
      }}
    ></div>
  );
};

Piece.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  position: PropTypes.shape({
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
  }).isRequired,
  gridSize: PropTypes.number, // Định nghĩa số hàng và cột (mặc định là 4x4)
  onDragEnd: PropTypes.func,
};

export default Piece;