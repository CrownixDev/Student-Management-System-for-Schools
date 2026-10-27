export type IResponse<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; message: string };
