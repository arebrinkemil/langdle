import { useState, useRef, useEffect } from "react";
import KeyboardWrapper from "./KeyboardWrapper.jsx";

const App = () => {
  const testword = "testa";
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState("");
  const [definition, setDefinition] = useState("");
  const [wordArray, setWordArray] = useState([]);
  const [inputArray, setInputArray] = useState([]);
  const [input, setInput] = useState("");

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
        const wordArray = word.split("");
        setWordArray(wordArray);
        console.log("Word:", wordArray);
      } else {
        fetchWord(language);
      }
    });
  };

  useEffect(() => {
    checkMatch();
  }, [inputArray]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(input);
    setInput("");
    const inputArray = input.split("");
    setInputArray(inputArray);
    console.log("Input:", inputArray);
  };

  const checkMatch = () => {
    inputArray.forEach((inputLetter, index) => {
      if (inputLetter === wordArray[index]) {
        console.log("green");
      } else if (wordArray.includes(inputLetter)) {
        console.log("yellow");
      } else {
        console.log("black");
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
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
        <KeyboardWrapper></KeyboardWrapper>
      </div>
    </div>
  );
};

export default App;
