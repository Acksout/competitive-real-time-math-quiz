import dbConnect from "@/lib/db";
import Question from "@/lib/questionModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const question = await Question.aggregate([{ $sample: { size: 1 } }]);

    if (!question || question.length === 0) {
      return NextResponse.json(
        { error: "No questions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question[0]);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
