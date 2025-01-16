import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const PromotionCountdown = ({ initialTime = 360000 }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const days = Math.floor(time / (24 * 3600));
    const hours = Math.floor((time % (24 * 3600)) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="flex justify-center items-center pt-4">
      <div className="w-full flex items-center justify-center space-x-10 bg-gradient-to-r from-red-700 to-red-400 text-white rounded-lg text-center shadow-md p-4">
        <h4 className="text-xl font-bold uppercase">Kết thúc trong:</h4>
        <div className="flex justify-center gap-2">
          <div className="flex flex-col items-center bg-white text-primary rounded-md shadow-sm p-2 w-16">
            <span className="text-2xl font-bold">{days}</span>
            <span className="text-xs text-gray-600">Ngày</span>
          </div>
          <div className="flex flex-col items-center bg-white text-primary rounded-md shadow-sm p-2 w-16">
            <span className="text-2xl font-bold">{hours}</span>
            <span className="text-xs text-gray-600">Giờ</span>
          </div>
          <div className="flex flex-col items-center bg-white text-primary rounded-md shadow-sm p-2 w-16">
            <span className="text-2xl font-bold">{minutes}</span>
            <span className="text-xs text-gray-600">Phút</span>
          </div>
          <div className="flex flex-col items-center bg-white text-primary rounded-md shadow-sm p-2 w-16">
            <span className="text-2xl font-bold">{seconds}</span>
            <span className="text-xs text-gray-600">Giây</span>
          </div>
        </div>
      </div>
    </div>
  );
};

PromotionCountdown.propTypes = {
  initialTime: PropTypes.number.isRequired,
};

export default PromotionCountdown;
