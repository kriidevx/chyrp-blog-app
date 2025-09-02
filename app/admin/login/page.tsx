export default function AdminLoginPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>
      <form className="bg-white dark:bg-gray-800 p-4 rounded shadow max-w-md mx-auto">
        <input type="email" placeholder="Email" className="block w-full mb-2 p-2 border rounded" />
        <input type="password" placeholder="Password" className="block w-full mb-2 p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2 w-full">Login</button>
      </form>
    </div>
  );
}
