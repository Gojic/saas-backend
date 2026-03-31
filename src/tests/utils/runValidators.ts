import {
  validationResult,
  ValidationChain,
  ValidationError,
} from "express-validator";
import { Request } from "express";

export async function runValidators(
  validators: ValidationChain[],
  body: Record<string, unknown>,
  extras?: Record<string, unknown>
) {
  const req = {
    body,
    ...extras,
  } as Request;

  for (const v of validators) {
    await v.run(req);
  }

  return validationResult(req)
    .array()
    .map((e: ValidationError) => {
      const field = "path" in e ? e.path : (e as any).param;

      return {
        field: field,
        message: String(e.msg),
      };
    });
}
