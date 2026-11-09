import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/constants";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const accesstoken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accesstoken) {
    try {
      await verifyAccessToken(accesstoken);
      redirect("/");
    } catch {}
  }

  if (refreshToken) {
    redirect("/");
  }

  return <div className="bg-gray-200 dark:bg-transparent">{children}</div>;
}
