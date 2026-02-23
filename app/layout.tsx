import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>NextGen Image Optimizer - Privacy-First Image Tools</title>
        <meta name="description" content="Resize, compress and optimize images directly in your browser. 100% Client-side, secure, and free." />
      </head>
      <body className="font-sans antialiased">
        <div className="bg-mesh" />
        {children}
      </body>
    </html>
  );
}
