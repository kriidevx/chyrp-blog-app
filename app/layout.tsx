import "@/styles/globals.css";
import SupabaseProviderClient from "@/components/SupabaseProviderClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <SupabaseProviderClient>
          <Navbar />
          <main className="container mx-auto px-6 py-8 flex-grow">{children}</main>
          <Footer />
          <ThemeToggle />
        </SupabaseProviderClient>
      </body>
    </html>
  );
}
