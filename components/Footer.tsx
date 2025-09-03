export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Chyrp Blog. All rights reserved.</p>
      </div>
    </footer>
  )
}
