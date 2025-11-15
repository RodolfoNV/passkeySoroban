import './globals.css';

export const metadata = {
  title: 'RapidLoan - Préstamos para Delivery',
  description: 'Plataforma de préstamos descentralizados para trabajadores de delivery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}