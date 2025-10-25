import { clerkClient, getAuth } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
    const { userId } = getAuth(req)

  if (!userId) {
    return res
      .status(401)
      .json({ message: "unauthorized you must be logged in" });
  }

  next();
};
