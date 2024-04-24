const WordInput = ({ onSubmit, inputValue, onInputChange }) => (
  <form className="flex gap-5 text-black" onSubmit={onSubmit}>
    <input
      className="h-16 w-full text-2xl lg:text-xl lg:h-10"
      autoFocus
      type="text"
      value={inputValue.toUpperCase()}
      onChange={(e) => onInputChange(e.target.value.toUpperCase())}
      maxLength={5}
    />
    <button
      className="text-2xl bg-lime-600 rounded-md px-5 py-1 text-white lg:text-lg lg:px-3 hover:bg-lime-700"
      type="submit"
    >
      Submit
    </button>
  </form>
);
export default WordInput;
