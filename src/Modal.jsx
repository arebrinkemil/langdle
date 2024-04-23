import React from "react";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto h-[70vh]">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30"></div>
        <div className="relative p-4 w-full max-w-2xl mx-auto bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white text-center">
              Langdle
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4">
            <p className="text-gray-500 dark:text-gray-400">
              Challenge your vocabulary in English or Swedish with LANGDLE, a
              word puzzle game inspired by Wordle. Choose your language, guess
              the word, and use hints if you get stuck. Perfect for quick and
              engaging wordplay.
            </p>
          </div>
          <div className="flex justify-center p-4 border-t dark:border-gray-600">
            <button
              onClick={onClose}
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
            >
              PLAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
