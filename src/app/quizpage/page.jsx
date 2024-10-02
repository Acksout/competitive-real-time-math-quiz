"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

const QuizPage = () => {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      initSocket(storedUsername);
    } else {
      router.push("/");
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initSocket = async (username) => {
    try {
      const newSocket = io({
        path: "/api/socketio",
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected");
        newSocket.emit("join_game", username);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
      });

      newSocket.on("game_joined", (data) => {
        console.log("Game joined:", data);
        setScore(data.score || 0);
        requestNewQuestion(newSocket);
      });

      newSocket.on("new_question", (data) => {
        console.log("New question received:", data);
        setQuestion(data);
        setSelectedOption(null);
      });

      newSocket.on("answer_result", (data) => {
        setScore(data.newScore);
        setTimeout(() => requestNewQuestion(newSocket), 2000);
      });

      newSocket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    } catch (error) {
      console.error("Error initializing socket:", error);
    }
  };

  const requestNewQuestion = (socket) => {
    socket.emit("request_question");
  };

  const handleOptionSelect = (option) => {
    if (selectedOption || !socket) return;
    setSelectedOption(option);
    socket.emit("submit_answer", { username, answer: option });
  };

  if (!question) {
    return (
      <div className="text-center mt-8">
        <p>Loading...</p>
        <p>Username: {username}</p>
        <p>Socket connected: {socket ? "Yes" : "No"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Real-Time Math Quiz</h1>
      <div className="mb-4">
        <strong>Score:</strong> {score}
      </div>
      <div className="mb-4">
        <strong>Question:</strong> {question.question}
      </div>
      <div className="space-y-2">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleOptionSelect(key)}
            className={`w-full p-2 text-left border rounded ${
              selectedOption === key
                ? selectedOption === question.correct_answer
                  ? "bg-green-200"
                  : "bg-red-200"
                : "bg-white"
            }`}
            disabled={selectedOption !== null}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
