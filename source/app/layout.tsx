import type { Metadata } from "next";
import "./globals.css";
import "@xyflow/react/dist/style.css";

export const metadata: Metadata = {
  title: "CT239",
  description: "CT239",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  );
}
