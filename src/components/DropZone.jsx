import PropTypes from "prop-types";
import { useDrop } from "react-dnd";

const DropZone = ({ position, onDrop, placedPiece }) => {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'piece',
    drop: (item) => onDrop(item, position),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  console.log('abc:', placedPiece)

  return (
    <div
      ref={dropRef}
      className={`w-16 h-16 rounded-sm border border-gray-300 flex items-center justify-center ${
        isOver ? 'bg-blue-100' : placedPiece?.isCorrect ? 'bg-green-100' : 'bg-white'
      }`}
    >
      {placedPiece && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${placedPiece.image})`,
            backgroundPosition: `-${placedPiece.position.col * 100}% -${
              placedPiece.position.row * 100
            }%`,
            backgroundSize: '400% 400%',
          }}
        />
      )}
    </div>
  );
};



DropZone.propTypes = {
  position: PropTypes.object.isRequired,
  onDrop: PropTypes.func.isRequired,
  placedPiece: PropTypes.object,
};

export default DropZone;
