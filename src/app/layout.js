import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Tallownara | Perawatan Kulit Alami",
  description: "Solusi kulit sehat berseri dengan produk skincare murni dari alam.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" />
      </head>
      <body suppressHydrationWarning={true}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}