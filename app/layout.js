import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "iGotchu",
  description: "Share reviewers in seconds. From your seniors, for you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen font-sans antialiased overflow-x-hidden">
        <SplashScreen />
        <Header />
        <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-32">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
