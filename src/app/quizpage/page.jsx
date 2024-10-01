"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const QuizPage = () => {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await fetch("/api/question");
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Failed to fetch question:", error);
    }
  };

  const handleOptionSelect = async (option) => {
    if (selectedOption) return;
    setSelectedOption(option);

    if (option === question.correct_answer) {
      setScore((prevScore) => prevScore + 1);

      await fetchQuestion();
      setSelectedOption(null);
    } else {
      setTimeout(async () => {
        await fetchQuestion();
        setSelectedOption(null);
      }, 1000);
    }
  };

  if (!question) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Math Quiz</h1>
      <div>
        <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleOptionSelect(key)}
              disabled={selectedOption !== null}
              className={`p-2 rounded ${
                selectedOption === key
                  ? selectedOption === question.correct_answer
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              } ${selectedOption !== null && "cursor-not-allowed"}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 font-semibold">Your Score: {score}</p>
    </div>
  );
};

export default QuizPage;
