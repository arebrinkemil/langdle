import { useState, useRef, useEffect } from "react";
import LanguageSelection from "./GameComponents/LanguageSelection";
import GameStatus from "./GameComponents/GameStatus";
import GuessDisplay from "./GameComponents/GuessDisplay";
import WordInput from "./GameComponents/WordInput";
import FetchClue from "./GameComponents/FetchClue";
import KeyboardWrapper from "./KeyboardWrapper";

const Game = ({ GameScore }) => {
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState("");
  const [definition, setDefinition] = useState("");
  const [wordArray, setWordArray] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [colorArray, setColorArray] = useState([]);
  const [score, setScore] = useState(120);
  const [letterColorMap, setLetterColorMap] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStatus, setGameStatus] = useState(null);
  const timeoutRef = useRef(null);

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
        return data.choices[0].message.content.trim();
      } else {
        console.error("HTTP error", response.status, await response.text());
        throw new Error("Failed to fetch word");
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      throw new Error("API error occurred");
    }
  };

  const insertLetter = (letter) => {
    if (input.length < 5) {
      setInput(input + letter);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleLanguageSelection = async (selectedLanguage) => {
    setGameStarted(true);
    await fetchWord(selectedLanguage);
  };

  const fetchWord = async (language) => {
    setLanguage(language);
    const promptContent =
      language === "Swedish"
        ? "generara ett riktigt 5-bokstavligt svenskt ord. returnera endast ordet"
        : "generate a real 5-letter English word. only return the word";
    const fetchedWord = await fetchApi(promptContent);
    setWord(fetchedWord.toUpperCase());
    setWordArray(fetchedWord.toUpperCase().split(""));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (guesses.length < 6) {
      const newGuess = input.split("");
      setGuesses([...guesses, newGuess]);
      setInput("");
      checkMatch(newGuess);
    } else {
      setGameStatus("lose");
      timeoutRef.current = setTimeout(clearGame, 5000);
      clearGame();
    }
  };

  const checkMatch = (guess) => {
    const newColorArray = guess.map((letter, index) => {
      if (letter === wordArray[index]) {
        return "green";
      } else if (wordArray.includes(letter)) {
        return "yellow";
      } else {
        return "gray";
      }
    });
    setColorArray([...colorArray, newColorArray]);

    if (newColorArray.every((color) => color === "green")) {
      setGameStatus("win");
      const finalScore = 120 - guesses.length * 20;
      setScore(finalScore);
      GameScore(finalScore);
      timeoutRef.current = setTimeout(clearGame, 5000);
    } else if (guesses.length >= 6) {
      setGameStatus("lose");
      timeoutRef.current = setTimeout(clearGame, 5000);
    }
  };

  const clearGame = () => {
    setWord("");
    setLanguage("");
    setDefinition("");
    setWordArray([]);
    setGuesses([]);
    setInput("");
    setColorArray([]);
    setScore(120);
    setLetterColorMap({});
    setGameStarted(false);
    setGameStatus(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center gap-10">
      {!gameStarted && (
        <LanguageSelection onLanguageSelected={handleLanguageSelection} />
      )}
      <GameStatus gameStatus={gameStatus} />
      {word && (
        <WordInput
          onSubmit={handleSubmit}
          inputValue={input}
          onInputChange={setInput}
        />
      )}
      <div className="flex flex-row items-center">
        {language && (
          <>
            <p>Need a hint?</p>
            <FetchClue onClick={() => fetchInfo()}>Fetch Info</FetchClue>
            <p>Definition: {definition}</p>
          </>
        )}
      </div>
      <GuessDisplay guesses={guesses} colorArray={colorArray} />
      <KeyboardWrapper
        insertLetter={insertLetter}
        letterColorMap={letterColorMap}
      />
    </div>
  );
};

export default Game;
