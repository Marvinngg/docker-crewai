// components/Header.tsx
"use client";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
      <div className="container mx-auto py-4 px-5 flex flex-col items-center">
        <h1 className="text-white text-3xl font-bold tracking-tight">
        CrewAI Agent可视化调试
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-white hover:text-gray-300 transition duration-200">Home</a>
            </li>
            <li>
              <a href="/about" className="text-white hover:text-gray-300 transition duration-200">About</a>
            </li>
            <li>
              <a href="/contact" className="text-white hover:text-gray-300 transition duration-200">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
