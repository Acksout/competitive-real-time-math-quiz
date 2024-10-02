import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

let scores = {};

export async function POST(request) {
  try {
    await dbConnect();

    const { username, score } = await request.json();

    if (!username || typeof score !== "number") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!scores[username]) {
      scores[username] = 0;
    }

    scores[username] += score;

    return NextResponse.json({
      username,
      totalScore: scores[username],
    });
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    username,
    totalScore: scores[username] || 0,
  });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  scores[username] = 0;

  return NextResponse.json({
    username,
    totalScore: 0,
  });
}
