import { body } from "express-validator";

export const registerValidators = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),

  body("passwordHash")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Must contain at least one digit"),
];
export const loginValidators = [
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long"),
];
