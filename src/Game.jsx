import { useState, useRef, useEffect } from "react";
import KeyboardWrapper from "./KeyboardWrapper.jsx";

const Game = ({ GameScore }) => {
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState("");
  const [definition, setDefinition] = useState("");
  const [wordArray, setWordArray] = useState([]);
  const [inputArray, setInputArray] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [colorArray, setColorArray] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(120);
  const [letterColorMap, setLetterColorMap] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);

  const insertLetter = (letter) => {
    if (input.length < 5) {
      setInput(input + letter);
    }
  };

  const fetchInfo = async () => {
    const promptContent =
      language === "Swedish"
        ? `ge en ledtråd till det svenska ordet utan att avslöja ordet självt. Ordet är "${word}". Vänligen ge ledtråden endast.`
        : `give a hard hint to the ${language} word without revealing the word itself. The word is "${word}". Please provide the hint only.`;

    fetchApi(promptContent).then(setDefinition);
    setScore(score - 20);
    console.log("Score:", score);
  };

  const fetchWord = async (language) => {
    setLanguage(language);

    const promptContent =
      language === "Swedish"
        ? "generara ett riktigt 5-bokstavligt svenskt ord. det måste vara ett riktigt ord på endast 5 tecken, det får inte vara en del av ett helt ord. returnera endast ordet"
        : "generate a real 5-letter English word. only return the word, do a creative word not something as simple as 'apple' or 'house'";

    fetchApi(promptContent).then((word) => {
      if (word && word.replace(/[^a-zA-ZåäöÅÄÖ]/g, "").length === 5) {
        const upperCaseWord = word.toUpperCase();
        setWord(upperCaseWord);
        const wordArray = upperCaseWord.split("");
        setWordArray(wordArray);
        console.log("Word:", wordArray);
      } else {
        fetchWord(language);
      }
    });
  };

  const hideLanguageButtons = () => {
    setGameStarted(true);
  };

  useEffect(() => {
    if (guesses.length > 0) {
      checkMatch(guesses[guesses.length - 1]);
    }
  }, [guesses]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input.length < 5) {
      return;
    }
    if (guesses.length < 6) {
      const newGuess = input.split("");
      setGuesses([...guesses, newGuess]);
      setInput("");
    } else {
      setGameStatus("lose");
      setTimeout(clearGame, 5000); // Delay clearGame by 5 seconds
    }
  };

  const clearGame = () => {
    setWord("");
    setLanguage("");
    setDefinition("");
    setWordArray([]);
    setInputArray([]);
    setGuesses([]);
    setInput("");
    setColorArray([]);
    setCorrect(0);
    setScore(120);
    setLetterColorMap({});
    setGameStarted(false);
    setGameStatus(null);
  };

  const checkMatch = (guess) => {
    setCorrect(0);
    let newLetterColorMap = { ...letterColorMap };
    const newColorArray = guess.map((guessLetter, index) => {
      if (guessLetter === wordArray[index]) {
        setCorrect((correct) => correct + 1);
        newLetterColorMap[guessLetter] = "green";
        return "green";
      } else if (wordArray.includes(guessLetter)) {
        if (newLetterColorMap[guessLetter] !== "green") {
          newLetterColorMap[guessLetter] = "yellow";
        }
        return "yellow";
      } else {
        if (newLetterColorMap[guessLetter] !== "green") {
          newLetterColorMap[guessLetter] = "gray";
        }
        return "gray";
      }
    });
    setColorArray([...colorArray, newColorArray]);
    setLetterColorMap(newLetterColorMap);

    if (newColorArray.every((color) => color === "green")) {
      setGameStatus("win");
      setTimeout(clearGame, 5000);
    }
  };

  const fetchApi = async (promptContent) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_AUTHORIZATION_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: promptContent },
        ],
      }),
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        requestOptions
      );
      const data = await response.json();
      if (response.ok) {
        const lastMessage = data.choices[0].message;
        if (lastMessage && lastMessage.content) {
          return lastMessage.content.trim();
        } else {
          console.error("No valid response in data:", data);
          setError("No word generated");
        }
      } else {
        console.error("HTTP error", response.status, await response.text());
        setError("Error fetching word");
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      setError("Error");
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center gap-10 ">
      {gameStatus === "win" && <div>You win!</div>}
      {gameStatus === "lose" && <div>You lose!</div>}
      <div className="flex flex-col">
        <div>
          {!gameStarted && (
            <>
              <button
                className="text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer rounded-md hover:bg-lime-700"
                onClick={() => {
                  fetchWord("English");
                  hideLanguageButtons();
                }}
              >
                English
              </button>
              <button
                className="text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer rounded-md hover:bg-lime-700"
                onClick={() => {
                  fetchWord("Swedish");
                  hideLanguageButtons();
                }}
              >
                Swedish
              </button>
            </>
          )}
        </div>
      </div>
      {word && (
        <form className="flex gap-5 text-black px-5" onSubmit={handleSubmit}>
          <input
            className="h-10 w-full text-xl"
            autoFocus
            type="text"
            value={input.toUpperCase()}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            maxLength={5}
          />
          <button
            className="text-base bg-lime-600 rounded-md px-3 py-0 text-white lg:text-lg lg:px-3 hover:bg-lime-700"
            type="submit"
          >
            HINT
          </button>
          <p>{definition}</p>
        </form>
      )}
      <div className="flex flex-row items-center px-3 md:px-0">
        {language && (
          <>
            <p>Need a hint?</p>
            <button
              className="text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer rounded-md hover:bg-lime-700"
              onClick={() => fetchInfo(word)}
            >
              Fetch Info
            </button>
            <p className="text-center">Definition: {definition}</p>
          </>
        )}
      </div>

      <div className="flex flex-col w-full h-full gap-5 items-center bg-gray-900 text-stone-200">
        <div className="flex flex-col w-80 h-4/5 items-center justify-start gap-2">
          {guesses.map((guess, guessIndex) => (
            <div key={guessIndex} className="flex w-full gap-3 justify-center">
              {guess.map((letter, index) => (
                <div
                  key={index}
                  className="flex h-12 w-10 items-center justify-center lg:h-14 lg:w-10 lg:text-2xl"
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
                  <h2 className="text-xl lg:text-2xl">{letter}</h2>
                </div>
              ))}
            </div>
          ))}
        </div>
        <KeyboardWrapper
          insertLetter={insertLetter}
          letterColorMap={letterColorMap}
        />
      </div>
    </div>
  );
};

export default Game;
