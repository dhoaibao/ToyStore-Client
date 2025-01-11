import { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { Modal } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const VoiceSearch = ({ isOpen, onClose }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Trình duyệt không hỗ trợ tìm kiếm giọng nói.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "vi-VN";

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      recognitionRef.current.transcript = speechResult;
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
      if (recognitionRef.current?.transcript) {
        const searchParams = new URLSearchParams();
        searchParams.set("keyword", recognitionRef.current.transcript);
        navigate(`/search?${searchParams.toString()}`);
        onClose();
        setTranscript("");
      }
    };

    recognitionRef.current = recognition;

    if (isOpen) {
      setTranscript("");
      recognition.start();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current = null;
      }
    };
  }, [isOpen, navigate, onClose]);

  const handleStopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <Modal closable={false} open={isOpen} onCancel={onClose} footer={null}>
      <div className="text-center">
        <h1 className="text-2xl font-medium text-gray-800 mb-6">
          Tìm kiếm bằng giọng nói
        </h1>
        <div
          className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center border-4 border-gray-600 cursor-pointer mx-auto"
          onClick={
            listening
              ? handleStopListening
              : () => recognitionRef.current?.start()
          }
        >
          <Mic
            strokeWidth={1}
            size={48}
            className={`text-red-500 ${listening ? "animate-pulse" : ""}`}
          />
        </div>
        <p className="mt-4 text-gray-600">
          {transcript || "Nói điều gì đó..."}
        </p>
        <button
          onClick={onClose}
          className="mt-6 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
};

VoiceSearch.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VoiceSearch;
