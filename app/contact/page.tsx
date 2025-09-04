export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Contact Us
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Have questions, feedback, or ideas? We’d love to hear from you!
      </p>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        <textarea
          placeholder="Your Message"
          rows={5}
          className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
