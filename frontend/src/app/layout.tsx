import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Logitec",
  description: "Passwordless authentication with Passkeys on Stellar/Soroban",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
