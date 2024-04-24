const LanguageSelection = ({ onLanguageSelected }) => (
  <div>
    <button
      className="text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer rounded-md hover:bg-lime-700"
      onClick={() => onLanguageSelected("English")}
    >
      English
    </button>
    <button
      className="text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer rounded-md hover:bg-lime-700"
      onClick={() => onLanguageSelected("Swedish")}
    >
      Swedish
    </button>
  </div>
);
export default LanguageSelection;
