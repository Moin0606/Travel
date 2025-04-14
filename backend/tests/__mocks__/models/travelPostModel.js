// __mocks__/models/travelPostModel.js
const { ObjectId } = require("mongoose").Types;

module.exports = {
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
};