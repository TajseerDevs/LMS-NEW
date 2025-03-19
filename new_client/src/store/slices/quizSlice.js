import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  description: "",
  courseId: "",
  quizId: "",
  quizType: "mixed",
  questions: [],
  duration: { value: 0, unit: "minutes" },
  maxScore: 0,
  dueDate: "",
  passScore : 0 ,
  shuffledQuestions : false ,
  isOneWay : false ,
};

const persistedState = JSON.parse(localStorage.getItem("quizData")) || initialState

const quizSlice = createSlice({
  name: "quiz",
  initialState: persistedState,
  reducers: {
    updateQuiz: (state, action) => {
        const newState = { ...state, ...action.payload }
        localStorage.setItem("quizData", JSON.stringify(newState))
        return newState
    },
    addQuestion: (state, action) => {
        state.questions.push(action.payload);
        localStorage.setItem("quizData", JSON.stringify(state))
    },
    resetQuiz: () => {
      localStorage.removeItem("quizData")
      return initialState
    },
  },
});

export const { resetQuiz , updateQuiz , addQuestion } = quizSlice.actions

export {quizSlice}
