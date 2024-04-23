import React, { useState, useEffect } from "react";
import Game from "./Game";
import Modal from "./Modal";

const App = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayModal(true);
    });

    return () => clearTimeout(timer);
  }, []);

  const handleScore = (score) => {
    setTotalScore(score + totalScore);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[100vh] bg-gray-900 text-white">
      <h2>score: {totalScore}</h2>
      <h1>LANGDLE</h1>
      <Game GameScore={handleScore} />
      <Modal isOpen={displayModal} onClose={() => setDisplayModal(false)} />
    </div>
  );
};

export default App;
