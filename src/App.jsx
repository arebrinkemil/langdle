import { useState, useRef } from "react";
import KeyboardWrapper from './KeyboardWrapper.jsx'

const App = () => {
  const testword = "testa"
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState("");
  const [definition, setDefinition] = useState("");
  const [board, setBoard] = useState([]);
  const inputRefs = useRef([]);

  const initializeBoard = () => {
    const newBoard = Array(testword.length).fill("");
    setBoard(newBoard);
    inputRefs.current[0].focus();
  };

  const updateBoard = (index, value) => {
    const newBoard = [...board];
    newBoard[index] = value.toUpperCase();
    setBoard(newBoard);
    if (index < board.length - 1 && value !== "") {
      inputRefs.current[index + 1].focus();
    }
    matchWord(word, board)
  };

  const matchWord = (word, board) => {
    console.log(board);
    console.log(word);
  }

  const fetchInfo = async () => {
    const promptContent =
      language === "Swedish"
        ? `ge en ledtråd till det svenska ordet utan att avslöja ordet självt. Ordet är "${word}". Vänligen ge ledtråden endast.`
        : `give a hard hint to the ${language} word without revealing the word itself. The word is "${word}". Please provide the hint only.`;

    fetchApi(promptContent).then(setDefinition);
  };

  const fetchWord = async (language) => {
    setLanguage(language);

    const promptContent =
      language === "Swedish"
        ? "generara ett riktigt 5-bokstavligt svenskt ord. det måste vara ett riktigt ord på endast 5 tecken, det får inte vara en del av ett helt ord. returnera endast ordet"
        : "generate a real 5-letter English word. only return the word";

    fetchApi(promptContent).then((word) => {
      if (word && word.replace(/[^a-zA-ZåäöÅÄÖ]/g, "").length === 5) {
        setWord(word);
      } else {
        fetchWord(language);
      }
    });
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
    <div className="flex flex-col w-full h-[100vh] justify-center items-center gap-10">
      <div className="flex flex-col">
        <div>
          <button
            className=" text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer"
            onClick={() => fetchWord("English")}
          >
            Generate English Word
          </button>
          <button
            className=" text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer"
            onClick={() => fetchWord("Swedish")}
          >
            Generate Swedish Word
          </button>
        </div>
        <p>Word: {word}</p>
      </div>
      <div>
        {language && (
          <button
            className=" text-white bg-lime-600 px-2 py-3 m-2 cursor-pointer"
            onClick={() => fetchInfo(word)}
          >
            Fetch Info
          </button>
        )}
        <p>Definition: {definition}</p>
      </div>
      <div className="flex flex-col w-full h-4/6 gap-5 items-center">
        <p className="text-4xl text-center">Game Board:</p>
        <div className="flex w-full h-2/6 bg-slate-600 justify-center">
          {board.map((letter, index) => (
            <input
            key={index}
            type="text"
            maxLength="1"
            value={letter}
            onChange={(e) => updateBoard(index, e.target.value)}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className="w-40 h-40 m-1 text-center text-3xl"
          />
          ))}
        </div>
        <button className="text-4xl bg-slate-400 w-1/6" onClick={initializeBoard}>Start Game</button>
        <KeyboardWrapper></KeyboardWrapper>
      </div>
    </div>
  );
};

export default App;
