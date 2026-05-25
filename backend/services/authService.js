import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repositories/userRepository.js";
import { validateLoginInput, validateSignupInput } from "../utils/validation.js";

const buildToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const signup = async ({ name, email, password }) => {
  const cleaned = validateSignupInput({ name, email, password });
  const existingUser = await findUserByEmail(cleaned.email);

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(cleaned.password, 10);
  const user = await createUser({
    name: cleaned.name,
    email: cleaned.email,
    password: hashedPassword,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: buildToken(user._id),
  };
};

const login = async ({ email, password }) => {
  const cleaned = validateLoginInput({ email, password });
  const user = await findUserByEmail(cleaned.email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(cleaned.password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: buildToken(user._id),
  };
};

export { signup, login };
