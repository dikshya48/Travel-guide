import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

import useAuthStore from "../store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-gradient-to-r from-teal-500 via-teal-600 to-green-500 shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-3xl font-semibold">
          <Link to="/">Travel Guide</Link>
        </div>

        <div className="hidden md:flex space-x-6 text-white items-center">
          <Link to="/" className="hover:text-gray-200 transition">
            Home
          </Link>
          <Link
            to="/create-itinerary"
            className="hover:text-gray-200 transition"
          >
            Create Itinerary
          </Link>
          <Link to="/find-buddies" className="hover:text-gray-200 transition">
            Find Buddies
          </Link>
          <Link
            to="/explore-destinations"
            className="hover:text-gray-200 transition"
          >
            Explore
          </Link>
        </div>

        <div className="md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-1 rounded-full border border-white text-white hover:bg-white hover:text-teal-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1 rounded-full bg-white text-teal-600 hover:bg-teal-700 hover:text-white transition"
              >
                Register
              </Link>
            </>
          ) : null}
          {user && (
            <div className="relative">
              <button
                ref={avatarRef}
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-white text-teal-600 flex items-center justify-center text-xl shadow-lg"
              >
                <FaUserCircle />
              </button>

              {isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-40 bg-white text-teal-700 rounded shadow-lg z-10"
                >
                  <Link
                    to="/trips"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 hover:bg-teal-100"
                  >
                    My Trips
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {user && (
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-teal-600 text-white rounded-b-md shadow-lg">
          <Link
            to="/"
            onClick={toggleMenu}
            className="block hover:text-gray-200"
          >
            Home
          </Link>
          <Link
            to="/create-itinerary"
            onClick={toggleMenu}
            className="block hover:text-gray-200"
          >
            Create Itinerary
          </Link>
          <Link
            to="/find-buddies"
            onClick={toggleMenu}
            className="block hover:text-gray-200"
          >
            Find Buddies
          </Link>
          <Link
            to="/explore-destinations"
            onClick={toggleMenu}
            className="block hover:text-gray-200"
          >
            Explore
          </Link>
        </div>
      )}
    </nav>
  );
}
