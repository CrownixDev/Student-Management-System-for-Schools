import { authRepository } from "@/features/auth";
import { LoginCard } from "./login-card";

export default async function LoginPage() {
  const isFirst = await authRepository.isFirstUser();
  return <LoginCard create={isFirst} />;
}
