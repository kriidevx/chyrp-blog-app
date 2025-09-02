export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-gray-600 dark:text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Chyrp Modernized. All rights reserved.</p>
        <nav className="flex space-x-8 mt-3 md:mt-0 text-base font-medium">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            GitHub
          </a>
          <a href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            About
          </a>
          <a href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
