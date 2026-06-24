import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TodoList",
  description: "할 일이 너무 많아...🤣",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-full flex flex-col items-center bg-cream">{children}</body>
    </html>
  );
}
