


const { getQuizSubmissionResult } = require('../quiz.controller');
const createError = require("../../utils/createError")
const QuizResult = require("../../models/QuizResult")


// Import necessary modules and dependencies
// Mock the dependencies
jest.mock("../../models/QuizResult");
jest.mock("../../utils/createError");

describe('getQuizSubmissionResult() getQuizSubmissionResult method', () => {
  let req, res, next;

  beforeEach(() => {
    // Set up the request, response, and next function for each test
    req = {
      params: {
        quizId: 'quiz123',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('Happy Paths', () => {
    it('should return quiz result when it exists', async () => {
      // Arrange: Mock the QuizResult.findOne to return a valid result
      const mockQuizResult = {
        _id: 'result123',
        quizId: 'quiz123',
        courseId: { title: 'Course Title' },
        studentId: { userObjRef: { firstName: 'John', lastName: 'Doe' } },
      };
      QuizResult.findOne.mockResolvedValue(mockQuizResult);

      // Act: Call the function
      await getQuizSubmissionResult(req, res, next);

      // Assert: Check that the response is correct
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockQuizResult);
    });
  });

  describe('Edge Cases', () => {
    it('should return 404 error when quiz result does not exist', async () => {
      // Arrange: Mock the QuizResult.findOne to return null
      QuizResult.findOne.mockResolvedValue(null);

      // Act: Call the function
      await getQuizSubmissionResult(req, res, next);

      // Assert: Check that the error is handled correctly
      expect(next).toHaveBeenCalledWith(createError(404, 'Quiz result not found for the given quiz'));
    });

    it('should handle errors thrown during database query', async () => {
      // Arrange: Mock the QuizResult.findOne to throw an error
      const error = new Error('Database error');
      QuizResult.findOne.mockRejectedValue(error);

      // Act: Call the function
      await getQuizSubmissionResult(req, res, next);

      // Assert: Check that the error is passed to the next function
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});