import asyncHandler from "../utils/asyncHandler";

const registerUser = asyncHandler(async (req, res, next) => {
  res.status(201).json({ message: "OK" });
});

export default registerUser ;