const FetchClue = ({ onClick, children }) => (
  <button
    className="text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer rounded-md hover:bg-lime-700"
    onClick={onClick}
  >
    {children}
  </button>
);
export default FetchClue;
