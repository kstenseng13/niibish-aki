import "./globals.css";
import "./styles.css";
import Navbar from './components/navbar';
import Footer from './components/footer';

export const metadata = {
  title: "Niibish Aki",
  description: "Capstone project for Kailee S.",
  icons: {
    icon: "/favicon.svg",
  },
  // Open Graph Meta Tags
  openGraph: {
    title: "Niibish Aki - Unique Indigenous Teas",
    description: "Capstone project for Kailee S.",
    image: "https://niibish-aki-e5d55d879400.herokuapp.com/favicon.svg",
    url: "https://niibish-aki-e5d55d879400.herokuapp.com/",
    type: "website",
  },
  // Twitter Card Meta Tags
  twitter: {
    card: "summary_large_image",
    title: "Niibish Aki - Unique Indigenous Teas",
    description: "Capstone project for Kailee S.",
    image: "https://niibish-aki-e5d55d879400.herokuapp.com/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
