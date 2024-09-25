import asyncHandler from "../utils/asyncHandler";

const healthcheck = asyncHandler(async (req : any, res: any) => {
  return res.status(200).json({ message: "OK" });
});

export { healthcheck };
