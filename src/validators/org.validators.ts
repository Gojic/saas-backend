import { body } from "express-validator";

export const orgValidators = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("seatsAllowed")
    .isInt({ min: 1 })
    .withMessage("Seats must be at least 1"),
];
export const updateOrgValidators = [
  body("name").isString().optional().notEmpty().withMessage("Name is required"),
  body("seatsAllowed")
    .isInt({ min: 1 })
    .optional()
    .notEmpty()
    .withMessage("Seats must be at least 1"),
  body("plan").isString().optional().notEmpty().withMessage("plan is required"),
];
