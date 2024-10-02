import { Server as SocketIOServer } from "socket.io";
import { NextResponse } from "next/server";

let io;

export async function GET(req) {
  if (!io) {
    const httpServer = req.socket?.server;
    if (!httpServer) {
      return NextResponse.json(
        { error: "HTTP server not available" },
        { status: 500 }
      );
    }

    io = new SocketIOServer(httpServer, {
      path: "/api/socketio",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("join_game", (username) => {
        console.log(`${username} joined the game`);
        socket.join("quizpage");
        socket.emit("game_joined", { username });
      });

      // Add other event handlers here
    });
  }

  return NextResponse.json({ message: "Socket.IO server is running" });
}

export const dynamic = "force-dynamic";
