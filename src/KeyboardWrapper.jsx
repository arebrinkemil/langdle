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
    <div className="flex flex-wrap h-2/5 w-2/4 gap-3 text-center">
      {letterArray.map((letter, index) => (
        <button
          onClick={() => inputToInputField(letter)}
          key={index}
          style={{ backgroundColor: letterColorMap[letter] }}
          className="text-center items-center justify-center flex h-20 w-1/12 text-2xl text-white"
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

export default KeyboardWrapper;
