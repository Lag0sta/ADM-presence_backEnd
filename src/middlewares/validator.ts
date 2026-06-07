import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validate = <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: T = schema.parse(req.body);
      req.body = data;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = err.issues.map((e) => ({
          field: e.path.join("."), // gère les objets imbriqués
          message: e.message,
        }));

        return res.status(400).json({
          message: "Validation error",
          errors: formattedErrors,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };