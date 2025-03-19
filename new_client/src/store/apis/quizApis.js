import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5500/api/v1/quiz" }),
  endpoints: (builder) => ({
    getAllInstructorQuizzes: builder.query({
        query: ({ token , page }) => {
          return {
            url: `/instructor/quizzes?page=${page}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          };
        },
    }),
    createQuiz: builder.mutation({
        query: ({ token , courseId , title , description }) => {
          return {
            url: `/create-quiz/${courseId}`,
            method: "POST",
            headers: { Authorization: `Bearer ${token}`},
            body : {title , description}
          };
        },
    }),
    addQuizQuestion: builder.mutation({
        query: ({ token , courseId , quizId , question }) => {
          return {
            url: `/add-quiz-question/${courseId}/${quizId}`,
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`},
            body : {question}
          };
        },
    }),
    createFillInTheBlankQuestion: builder.mutation({
        query: ({ token , courseId , quizId , questionText , feedback , explanation , hint , points , answerText}) => {
          return {
            url: `/add-quiz-question/fill-in-blank/${courseId}/${quizId}`,
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`},
            body : {questionText , feedback , explanation , hint , points , answerText}
          };
        },
    }),
    updateQuizSettings: builder.mutation({
        query: ({ token , courseId , quizId , duration , dueDate , maxScore , passScore , shuffledQuestions , isOneWay}) => {
          return {
            url: `/settings/${courseId}/${quizId}`,
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`},
            body : {duration , dueDate , maxScore , passScore , shuffledQuestions , isOneWay}
          };
        },
    }),
    getQuizQuestions: builder.query({
        query: ({ token , courseId , quizId }) => {
          return {
            url: `/${quizId}/${courseId}/questions`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          };
        },
    }),
    getInstructorQuizzes: builder.query({
        query: ({ token , page}) => {
          return {
            url: `/instructor/quizzes?page=${page}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          };
        },
    }),
    getCourseLastestQuizzes: builder.query({
        query: ({ token , page , courseId}) => {
          return {
            url: `/course/${courseId}/quizzes-latest?page=${page}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          };
        },
    }),
    getQuizDetails: builder.query({
        query: ({ token , quizId}) => {
          return {
            url: `/${quizId}/details`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}`},
          };
        },
    }),
    submitQuizAnswers: builder.mutation({
        query: ({ token , quizId , answers , timeLeft}) => {
          return {
            url: `/submit-answers/${quizId}`,
            method: "POST",
            headers: { Authorization: `Bearer ${token}`},
            body : {answers , timeLeft}
          };
        },
    }),
    getQuizSubmissionResult: builder.query({
      query: ({ token , quizId}) => {
        return {
          url: `/submission-result/${quizId}`,
          method: "GET",
          headers: { Authorization: `Bearer ${token}`},
        };
      },
    }),
  })
});




const {
  useGetAllInstructorQuizzesQuery , 
  useCreateQuizMutation ,
  useAddQuizQuestionMutation ,
  useCreateFillInTheBlankQuestionMutation ,
  useUpdateQuizSettingsMutation ,
  useGetQuizQuestionsQuery ,
  useGetInstructorQuizzesQuery ,
  useGetCourseLastestQuizzesQuery,
  useGetQuizDetailsQuery ,
  useSubmitQuizAnswersMutation ,
  useGetQuizSubmissionResultQuery
} = quizApi



export {
  useGetAllInstructorQuizzesQuery , 
  useCreateQuizMutation ,
  useAddQuizQuestionMutation ,
  useCreateFillInTheBlankQuestionMutation ,
  useUpdateQuizSettingsMutation ,
  useGetQuizQuestionsQuery ,
  useGetInstructorQuizzesQuery ,
  useGetCourseLastestQuizzesQuery ,
  useGetQuizDetailsQuery ,
  useSubmitQuizAnswersMutation ,
  useGetQuizSubmissionResultQuery ,
  quizApi ,
}