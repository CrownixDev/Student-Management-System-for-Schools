/**
 * Custom error class for API-specific errors with a status code.
 */
export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    // Set the prototype explicitly to ensure 'instanceof' works correctly
    // when extending built-in classes in TypeScript/Babel environments.
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ApiErrorV2 extends Error {
  public readonly code?: string;
  public readonly statusCode?: number;

  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
