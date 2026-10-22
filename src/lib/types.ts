export type IResponse<T> = { success: true; data: T } | { success: false; message: string };
