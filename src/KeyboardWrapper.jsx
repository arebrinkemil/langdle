import React, { useEffect } from 'react';
import './KeyboardWrapper.css'

function KeyboardWrapper({ insertLetter }) {
  const letterArray = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','M','N','B','V','C','X','Z'];

  const inputToInputField = (letter) => {
    insertLetter(letter);
  }
  

  return (
    <div className="flex flex-wrap h-60 w-2/4 gap-3 text-center">
      {letterArray.map((letter, index) => (
        <button key={index} onClick={() => inputToInputField(letter)} className="text-center items-center justify-center flex h-20 w-20 text-2xl bg-black text-white">{letter}</button>
      ))}
    </div>
  );
}

export default KeyboardWrapper;
