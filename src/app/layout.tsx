import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OScope — Operating System Resource Management & Performance Analysis Platform",
  description:
    "An Interactive Operating System Laboratory simulator featuring CPU scheduling, contiguous memory allocation, paging page replacement, Banker's algorithm deadlock avoidance, and process lifecycle management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
