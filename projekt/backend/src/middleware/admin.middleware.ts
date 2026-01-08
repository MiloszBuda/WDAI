import type { Request, Response, NextFunction } from "express";

export function aminOnlyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access only" });

  next();
}
