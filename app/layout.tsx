import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "群编年史 | tatalab-一起早睡",
  description: "一个公开只读的群体编年史网站，记录 tatalab-一起早睡 如何从作息提醒成长为互相信任的共同体。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
