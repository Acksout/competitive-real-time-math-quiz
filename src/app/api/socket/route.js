import { Server } from "socket.io";

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io server");
    const io = new Server(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("join_game", (username) => {
        console.log(`${username} joined the game`);
        socket.join("quizpage");
        socket.emit("game_joined", { username });
      });

      socket.on("request_question", async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/question`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch question");
          }

          const question = await response.json();
          socket.emit("new_question", question);
        } catch (error) {
          console.error("Error fetching question:", error);
          socket.emit("error", { message: "Failed to fetch question" });
        }
      });

      socket.on("submit_answer", async ({ username, answer }) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/question/check`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, answer }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to check answer");
          }

          const result = await response.json();
          socket.emit("answer_result", result);
        } catch (error) {
          console.error("Error checking answer:", error);
          socket.emit("error", { message: "Failed to check answer" });
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export const GET = ioHandler;
export const POST = ioHandler;

export const config = {
  api: {
    bodyParser: false,
  },
};
