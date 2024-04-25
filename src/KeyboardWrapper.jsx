import React, { useEffect } from "react";
import "./KeyboardWrapper.css";

function KeyboardWrapper({ insertLetter, letterColorMap }) {
  const letterArray = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "B",
    "V",
    "C",
    "X",
    "Z",
    "Å",
    "Ä",
    "Ö",
  ];

  const inputToInputField = (letter) => {
    insertLetter(letter);
  };

  return (
    <div className="flex flex-wrap h-2/5 w-full lg:w-[45%] justify-center gap-3 text-center px-6 md:px-48 lg:px-0">
      {letterArray.map((letter, index) => (
        <button
          onClick={() => inputToInputField(letter)}
          key={index}
          style={{
            backgroundColor: letterColorMap[letter],
            color: letterColorMap[letter] === "yellow" ? "gray" : "white",
          }}
          className="text-center items-center justify-center flex h-10 w-5 text-lg lg:h-10 lg:w-5 lg:text-2xl text-white"
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

export default KeyboardWrapper;
