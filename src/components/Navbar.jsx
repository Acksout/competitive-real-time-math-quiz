import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-white text-2xl font-bold hover:text-blue-200 transition-colors"
        >
          Real Time Math Quiz
        </Link>
        <div className="space-x-4">
          <Link
            href="/quizpage"
            className="bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors font-semibold"
          >
            Go To Quiz
          </Link>
          <Link
            href="/loginpage"
            className="bg-transparent text-white border-2 border-white px-4 py-2 rounded-full hover:bg-white hover:text-blue-500 transition-colors font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
