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
        setWord(word);
        const wordArray = word.split("");
        setWordArray(wordArray);
        console.log("Word:", wordArray);
      } else {
        fetchWord(language);
      }
    });
  };

  useEffect(() => {
    if (guesses.length > 0) {
      checkMatch(guesses[guesses.length - 1]);
    }
  }, [guesses]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (guesses.length < 6) {
      const newGuess = input.split("");
      setGuesses([...guesses, newGuess]);
      setInput("");
    } else {
      console.log("You have reached the maximum number of guesses");
      clearGame();
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
    setScore(0);
  };

  const checkMatch = (guess) => {
    setCorrect(0);
    const newColorArray = guess.map((guessLetter, index) => {
      if (guessLetter === wordArray[index]) {
        setCorrect((correct) => correct + 1);
        return "green";
      } else if (wordArray.includes(guessLetter)) {
        return "yellow";
      } else {
        return "gray";
      }
    });
    setColorArray([...colorArray, newColorArray]);

    if (newColorArray.every((color) => color === "green")) {
      console.log("You win!");
      setScore(Math.round(score / guesses.length));
      GameScore(score);
      clearGame();
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
      <div className="flex flex-col">
        <div>
          <button
            className=" text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer"
            onClick={() => fetchWord("English")}
          >
            English
          </button>
          <button
            className=" text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer"
            onClick={() => fetchWord("Swedish")}
          >
            Swedish
          </button>
        </div>
      </div>
      {word && (
        <form className=" flex gap-5 text-black " onSubmit={handleSubmit}>
          <input
            className=" h-16 w-full text-2xl"
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={5}
          />
          <button
            className=" text-2xl bg-lime-600 rounded-full px-5 py-1 text-white"
            type="submit"
          >
            Submit
          </button>
        </form>
      )}
      <div className="flex flex-row">
        {language && (
          <>
            <p>Need a hint?</p>
            <button
              className=" text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer"
              onClick={() => fetchInfo(word)}
            >
              Fetch Info
            </button>
            <p>Definition: {definition}</p>
          </>
        )}
      </div>
      <div className="flex flex-col w-full h-4/6 gap-5 items-center bg-gray-900 text-stone-200">
        <div className="flex flex-col w-2/6 h-4/5 items-center justify-start gap-2">
          {guesses.map((guess, guessIndex) => (
            <div key={guessIndex} className="flex w-full h-1/6 gap-3">
              {guess.map((letter, index) => (
                <div
                  key={index}
                  className="flex w-1/6 h-full items-center justify-center"
                  style={{
                    backgroundColor: colorArray[guessIndex]
                      ? colorArray[guessIndex][index]
                      : "transparent",
                  }}
                >
                  <h2 className="text-5xl">{letter}</h2>
                </div>
              ))}
            </div>
          ))}
        </div>
        <KeyboardWrapper></KeyboardWrapper>
      </div>
    </div>
  );
};

export default Game;
