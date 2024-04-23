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
    <div className="flex relative flex-col items-center justify-center w-full h-[100vh] bg-gray-900 text-white">
      <h2 className=" absolute top-3 right-5 text-2xl">Score: {totalScore}</h2>
      <h1 className=" absolute top-3 right-50% text-4xl">LANGDLE</h1>
      <Game GameScore={handleScore} />
      <Modal isOpen={displayModal} onClose={() => setDisplayModal(false)} />
    </div>
  );
};

export default App;
