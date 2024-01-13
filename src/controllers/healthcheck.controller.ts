import asyncHandler from "../utils/asyncHandler";

const healthcheck = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "OK" });
});

export { healthcheck };
