


const { submitAnswers } = require('../quiz.controller');
const Course = require("../../models/Course")
const Quiz = require("../../models/Quiz")
const User = require("../../models/User")
const Student = require("../../models/Student")
const createError = require("../../utils/createError")
const Answer = require("../../models/Answer")
const StudentQuizResult = require("../../models/StudentQuizResult")
jest.mock("../../models/Course");
jest.mock("../../models/Quiz");
jest.mock("../../models/User");
jest.mock("../../models/Instructor");
jest.mock("../../models/Student");
jest.mock("../../utils/createError");
jest.mock("../../models/Answer");
jest.mock("../../models/StudentQuizResult");

describe('submitAnswers() submitAnswers method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { quizId: 'quizId', courseId: 'courseId' },
      body: { answers: [{ questionId: 'questionId', answerText: 'answer' }] },
      user: { _id: 'userId' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Happy Paths', () => {
    it('should submit answers successfully when all conditions are met', async () => {
      // Mocking database calls and responses
      User.findById.mockResolvedValue({ _id: 'userId' });
      Student.findOne.mockResolvedValue({ _id: 'studentId', userObjRef: 'userId' });
      Course.findById.mockResolvedValue({ studentsEnrolled: ['studentId'] });
      Quiz.findById.mockResolvedValue({
        _id: 'quizId',
        questions: [{ _id: 'questionId', type: 'multiple_choice', options: [{ optionText: 'answer', isCorrect: true }] }],
        submittedBy: [],
        dueDate: new Date(Date.now() + 10000),
        maxScore: 100,
        answers: []
      });
      Answer.prototype.save.mockResolvedValue({});
      StudentQuizResult.prototype.save.mockResolvedValue({});
      Quiz.prototype.save.mockResolvedValue({});

      await submitAnswers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Quiz submitted successfully',
        totalScore: '100.00',
        maxScore: 100
      });
    });
  });

  describe('Edge Cases', () => {
    it('should return error if no answers are provided', async () => {
      req.body.answers = null;

      await submitAnswers(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('No answers been provided', 400));
    });

    it('should return error if user is not found', async () => {
      User.findById.mockResolvedValue(null);

      await submitAnswers(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('Not Authorized', 401));
    });

    it('should return error if student is not enrolled in the course', async () => {
      User.findById.mockResolvedValue({ _id: 'userId' });
      Student.findOne.mockResolvedValue({ _id: 'studentId', userObjRef: 'userId' });
      Course.findById.mockResolvedValue({ studentsEnrolled: [] });

      await submitAnswers(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('Student is not enrolled in this course', 400));
    });

    it('should return error if quiz is past due date', async () => {
      User.findById.mockResolvedValue({ _id: 'userId' });
      Student.findOne.mockResolvedValue({ _id: 'studentId', userObjRef: 'userId' });
      Course.findById.mockResolvedValue({ studentsEnrolled: ['studentId'] });
      Quiz.findById.mockResolvedValue({
        _id: 'quizId',
        questions: [],
        submittedBy: [],
        dueDate: new Date(Date.now() - 10000)
      });

      await submitAnswers(req, res, next);

      expect(next).toHaveBeenCalledWith(createError(expect.stringContaining('The Quiz is past'), 400));
    });

    it('should return error if quiz has already been submitted by the student', async () => {
      User.findById.mockResolvedValue({ _id: 'userId' });
      Student.findOne.mockResolvedValue({ _id: 'studentId', userObjRef: 'userId' });
      Course.findById.mockResolvedValue({ studentsEnrolled: ['studentId'] });
      Quiz.findById.mockResolvedValue({
        _id: 'quizId',
        questions: [],
        submittedBy: ['studentId'],
        dueDate: new Date(Date.now() + 10000)
      });

      await submitAnswers(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('You have already submitted answers for this quiz', 400));
    });
  });
});