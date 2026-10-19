export { cn } from "cn";

export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export function getHtmlDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}
