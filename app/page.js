"use client";
// app/page.js
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Scheduler App</h1>
      <div className="flex flex-col gap-6">
        <a
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
        >
          Login
        </a>
        <a
          href="/signup"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
        >
          Signup
        </a>
      </div>
    </div>
  );
}