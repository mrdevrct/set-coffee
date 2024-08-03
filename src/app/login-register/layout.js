import { authUser } from "@/utils/isLogin";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const user = await authUser();

  if (user) {
    return redirect("/");
  }

  return <>{children}</>;
}

export const metadata = {
  title: "ورد یا ثبت نام  | فروشگاه اینترنتی قهوه ست",
};
