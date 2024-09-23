import '../output.css';

export const metadata = {
  title: 'Diabetes',
  description: 'Diabetes App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-tr from-black to-gray-800 text-white">
        {children}
      </body>
    </html>
  );
}
