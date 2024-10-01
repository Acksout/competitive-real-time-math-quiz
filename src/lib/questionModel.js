import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
  correct_answer: {
    type: String,
    required: true,
  },
});

const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);

export default Question;
