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
    <div className="flex flex-wrap h-2/5 w-full lg:w-3/6 justify-center gap-3 text-center">
      {letterArray.map((letter, index) => (
        <button
          onClick={() => inputToInputField(letter)}
          key={index}
          style={{
            backgroundColor: letterColorMap[letter],
            color: letterColorMap[letter] === "yellow" ? "gray" : "white",
          }}
          className="text-center items-center justify-center flex h-20 w-1/12 text-2xl lg:h-10 lg:w-13 lg:text-lg text-white"
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

export default KeyboardWrapper;
