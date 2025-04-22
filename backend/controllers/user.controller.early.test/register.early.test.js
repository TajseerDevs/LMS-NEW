


const { register } = require('../user.controller');
const createError = require("../../utils/createError")
const User = require("../../models/User")
const Student = require("../../models/Student")
const Instructor = require("../../models/Instructor")
const calculateAge = require("../../utils/calculateAge")
jest.mock("../../models/User");
jest.mock("../../models/Student");
jest.mock("../../models/Instructor");
jest.mock("../../models/Parent");
jest.mock("../../utils/createError");
jest.mock("../../utils/calculateAge");

describe('register() register method', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        password: 'Password1!',
        confirmPassword: 'Password1!',
        dateOfBirth: '2000-01-01',
        gender: 'male',
        role: 'student',
      },
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('Happy Paths', () => {
    it('should register a new student successfully', async () => {
      // Mock User and Student model methods
      User.findOne.mockResolvedValue(null);
      calculateAge.mockReturnValue(21);
      User.prototype.save = jest.fn().mockResolvedValue();
      Student.prototype.save = jest.fn().mockResolvedValue();

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ phone: req.body.phone });
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(User.prototype.save).toHaveBeenCalled();
      expect(Student.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        gender: 'male',
        role: 'student',
      }));
    });

    it('should register a new instructor successfully', async () => {
      req.body.role = 'instructor';

      User.findOne.mockResolvedValue(null);
      calculateAge.mockReturnValue(30);
      User.prototype.save = jest.fn().mockResolvedValue();
      Instructor.prototype.save = jest.fn().mockResolvedValue();

      await register(req, res, next);

      expect(Instructor.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('Edge Cases', () => {
    it('should return an error if phone number is already in use', async () => {
      User.findOne.mockResolvedValue({});

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('Phone number already in use', 400));
    });

    it('should return an error if email is already in use', async () => {
      User.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({});

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('Email already in use', 400));
    });

    it('should return an error if validation fails', async () => {
      req.body.email = 'invalid-email';

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should return an error if unauthorized to create adminOfAdmins', async () => {
      req.body.role = 'adminOfAdmins';
      req.headers['x-admin-authorization'] = 'wrong-key';

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(createError('Unauthorized to create adminOfAdmins', 403));
    });

    it('should handle unexpected errors gracefully', async () => {
      User.findOne.mockRejectedValue(new Error('Unexpected error'));

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});