import asyncHandler from "../utils/asyncHandler.js";
import { login, signup } from "../services/authService.js";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // validate input
    if (!name || !email || !password) {
        const error = new Error("Name, email, and password are required");
        error.statusCode = 400;
        throw error;
    }
    const result = await signup({ name, email, password });
    res.status(201).json(result);
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
    }

    const result = await login({ email, password });
    res.status(200).json(result);
});

export { registerUser, loginUser };
