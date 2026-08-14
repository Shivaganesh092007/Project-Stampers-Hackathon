import { asyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * POST /api/users/register
 * Registers a new student profile
 */
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, leetcodeId, password } = req.body;

    if (!name || !email || !leetcodeId || !password) {
        throw new ApiError(400, "All fields (name, email, leetcodeId, password) are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { leetcodeId }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this email or LeetCode ID already exists");
    }

    const user = await User.create({ name, email, leetcodeId, password });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "Student profile registered successfully")
    );
});

/**
 * POST /api/users/login
 * Simple student login and token generation
 */
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(404, "Student profile does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid student credentials");
    }

    const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET || "default_hackathon_secret",
        { expiresIn: "1d" }
    );

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, { user: loggedInUser, token }, "Login successful")
    );
});

/**
 * GET /api/users/:studentId
 * Fetches student profile & metadata
 */
export const getUserProfile = asyncHandler(async (req, res) => {
    const { studentId } = req.params;

    const user = await User.findById(studentId).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "Student profile not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "Student profile retrieved successfully")
    );
});