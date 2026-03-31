import { validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result
      .formatWith((e: ValidationError) => {
        const field = "path" in e ? e.path : (e as any).param;
        return {
          field: field,
          message: String(String(e.msg)),
        };
      })
      .array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }
  next();
};
