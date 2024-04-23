import React, { useState, useEffect } from "react";
import Game from "./Game";
import Modal from "./Modal";

const App = () => {
  const [displayModal, setDisplayModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayModal(true);
    });

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] bg-gray-900 text-white">
      <h1>LANGDLE</h1>
      <Game />
      <Modal isOpen={displayModal} onClose={() => setDisplayModal(false)} />
    </div>
  );
};

export default App;
