import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';

const Piece = ({ id, image, position, onDragEnd }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'piece',
    item: { id, image, position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (onDragEnd) {
        onDragEnd(item, monitor);
      }
    },
  });

  return (
    <div
      ref={dragRef}
      className={`w-16 h-16 border border-gray-300 rounded-sm ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundPosition: `-${position.col * 100}% -${
          position.row * 100
        }%`,
        backgroundSize: '400% 400%', // Điều chỉnh theo số mảnh
      }}
    ></div>
  );
};

Piece.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  position: PropTypes.shape({
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
  }).isRequired,
  onDragEnd: PropTypes.func,
};

export default Piece;