import { useState } from "react";
import "./App.css";

const App = () => {
  const [word, setWord] = useState("");

  const fetchWord = async (language) => {
    const promptContent =
      language === "Swedish"
        ? "generate a 5-letter Swedish word. only return the word"
        : "generate a 5-letter English word. only return the word";

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
          setWord(lastMessage.content.trim());
        } else {
          console.error("No valid response in data:", data);
          setWord("No word generated");
        }
      } else {
        console.error("HTTP error", response.status, await response.text());
        setWord("Error fetching word");
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      setWord("Error");
    }
  };

  return (
    <div>
      <button onClick={() => fetchWord("English")}>
        Generate English Word
      </button>
      <button onClick={() => fetchWord("Swedish")}>
        Generate Swedish Word
      </button>
      <p>Word: {word}</p>
    </div>
  );
};

export default App;
