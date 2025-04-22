


const { updateEnrolmentStatus } = require('../admin.controller');
const Course = require("../../models/Course")
const Student = require("../../models/Student")
const StudentCourseRequest = require("../../models/studentCourseRequests")
const User = require("../../models/User")
const createError = require("../../utils/createError")
const { ObjectId } = require('mongodb');
const Notification = require('../../models/Notification')
jest.mock("../../models/Course");
jest.mock("../../models/Student");
jest.mock("../../models/studentCourseRequests");
jest.mock("../../models/User");
jest.mock("../../utils/createError");
jest.mock("../../models/Notification");

describe('updateEnrolmentStatus() updateEnrolmentStatus method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { courseId: 'courseId', studentId: 'studentId' },
      body: { newStatus: 'approved' },
      user: { _id: 'adminId' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('Happy paths', () => {
    it('should approve a student enrolment request successfully', async () => {
      // Mocking the database calls
      Course.findById.mockResolvedValue({ _id: 'courseId', title: 'Course Title' });
      StudentCourseRequest.findOne.mockResolvedValue({ _id: 'requestId', status: 'pending' });
      Student.findById.mockResolvedValue({ _id: 'studentId', user: { _id: 'userId' } });
      User.findById.mockResolvedValue({ _id: 'userId' });
      StudentCourseRequest.findByIdAndUpdate.mockResolvedValue({ _id: 'requestId', status: 'approved' });
      Notification.prototype.save = jest.fn().mockResolvedValue();

      await updateEnrolmentStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: 'requestId', status: 'approved' });
    });

    it('should reject a student enrolment request successfully', async () => {
      req.body.newStatus = 'rejected';
      StudentCourseRequest.findOne.mockResolvedValue({ _id: 'requestId', status: 'approved' });

      await updateEnrolmentStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ _id: 'requestId', status: 'rejected' });
    });
  });

  describe('Edge cases', () => {
    it('should return 404 if course is not found', async () => {
      Course.findById.mockResolvedValue(null);

      await updateEnrolmentStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('course not found', 404));
    });

    it('should return 404 if student is not found', async () => {
      Course.findById.mockResolvedValue({ _id: 'courseId' });
      Student.findById.mockResolvedValue(null);

      await updateEnrolmentStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('Student not found', 404));
    });

    it('should return 404 if student enrolment request is not found', async () => {
      Course.findById.mockResolvedValue({ _id: 'courseId' });
      Student.findById.mockResolvedValue({ _id: 'studentId', user: { _id: 'userId' } });
      StudentCourseRequest.findOne.mockResolvedValue(null);

      await updateEnrolmentStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(createError("student with this id doesn't request enrolment for this course", 404));
    });

    it('should return 400 if new status is invalid', async () => {
      req.body.newStatus = 'invalidStatus';
      Course.findById.mockResolvedValue({ _id: 'courseId' });
      Student.findById.mockResolvedValue({ _id: 'studentId', user: { _id: 'userId' } });
      StudentCourseRequest.findOne.mockResolvedValue({ _id: 'requestId', status: 'pending' });

      await updateEnrolmentStatus(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('Invalid course request status type', 400));
    });
  });
});