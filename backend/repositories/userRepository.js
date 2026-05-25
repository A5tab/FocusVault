import User from "../models/User.js";

const findUserByEmail = (email) => User.findOne({ email });
const findUserById = (userId) => User.findById(userId);
const createUser = (userData) => User.create(userData);

export { findUserByEmail, findUserById, createUser };
