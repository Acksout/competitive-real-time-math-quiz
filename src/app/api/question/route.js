import dbConnect from "@/lib/db";
import Question from "@/lib/questionModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const questions = await Question.aggregate([{ $sample: { size: 1 } }]);

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 }
      );
    }

    const question = questions[0];

    // Ensure all required fields are present
    if (!question.question || !question.options || !question.correct_answer) {
      console.error("Invalid question data:", question);
      return NextResponse.json(
        { error: "Invalid question data" },
        { status: 500 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
