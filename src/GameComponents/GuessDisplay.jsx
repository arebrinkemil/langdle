const GuessDisplay = ({ guesses, colorArray }) => (
  <div className="flex flex-col w-80 h-4/5 items-center justify-start gap-2">
    {guesses.map((guess, guessIndex) => (
      <div key={guessIndex} className="flex w-full gap-3 justify-center">
        {guess.map((letter, index) => (
          <div
            key={index}
            className="flex h-24 w-32 items-center justify-center lg:h-10 lg:w-10 lg:text-sm"
            style={{
              backgroundColor: colorArray[guessIndex]
                ? colorArray[guessIndex][index]
                : "transparent",
              color:
                colorArray[guessIndex] &&
                colorArray[guessIndex][index] === "yellow"
                  ? "gray"
                  : "inherit",
            }}
          >
            <h2 className="text-4xl lg:text-base">{letter}</h2>
          </div>
        ))}
      </div>
    ))}
  </div>
);
export default GuessDisplay;
