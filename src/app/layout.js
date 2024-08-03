import { Inter } from "next/font/google";
import "./globals.css";
import AOSInit from "@/utils/Aos";
import ScrollToTop from "@/utils/ScrollToTop";
import ClientProvider from "@/components/modules/clientProvider/ClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "صفحه اصلی - SET Coffee | فروشگاه اینترنتی قهوه ست",
  description:
    "Previous slide Next slide انواع قهوه Coffee انتخاب گزینه‌ها مقایسه مشاهده سریع افزودن به علاقه مندی دانه قهوه کلمبیا اسپشالیتی",

  icons: {
    icon: "https://set-coffee.com/wp-content/uploads/2022/03/cropped-512x5122-1-32x32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <AOSInit />
          {children}
          <ScrollToTop />
        </ClientProvider>
      </body>
    </html>
  );
}
