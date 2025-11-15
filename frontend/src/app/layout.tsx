import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Passkey Soroban App",
  description: "App con Passkeys y Soroban",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white antialiased">

        {/* Header con estilo glass bonito */}
        <header className="header-glass p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold tracking-tight">
              Passkey Soroban App
            </h1>

            <nav className="flex gap-4 text-white/80">
              <a href="/" className="hover:text-white transition">Dashboard</a>
              <a href="/login" className="hover:text-white transition">Login</a>
            </nav>
          </div>
        </header>

        {/* Contenido */}
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>

      </body>
    </html>
  );
}
