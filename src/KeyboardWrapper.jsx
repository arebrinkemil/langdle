import React, { useEffect } from 'react';

function KeyboardWrapper() {
  const letterArray = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','M','N','B','V','C','X','Z'];

  return (
    <div className="flex flex-wrap h-60 w-2/4 gap-3">
      {letterArray.map((letter, index) => (
        <button key={index} className=" items-center border-2 border-solid border-slate-400 justify-center flex h-20 w-20 text-2xl bg-black text-white">{letter}</button>
      ))}
    </div>
  );
}

export default KeyboardWrapper;
