// src/pages/Home.jsx
import { FaMapMarkedAlt, FaUsers, FaGlobeAsia } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] via-white to-[#e8f5e9] px-6 py-20 text-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
        Welcome to Travel Guide
      </h2>
      <p className="text-lg md:text-xl text-gray-600 mb-10">
        Create your travel itinerary, connect with people who share your
        interests, and start your next adventure!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition">
          <FaMapMarkedAlt className="text-4xl text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Plan Your Itinerary
          </h3>
          <p className="text-gray-600 mb-4">
            Create, update, and manage your travel plans.
          </p>
          <Link
            to="/trips"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Go to Itinerary
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition">
          <FaUsers className="text-4xl text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Find Travel Buddies
          </h3>
          <p className="text-gray-600 mb-4">
            Connect with people who share your travel interests.
          </p>
          <Link
            to="/trips"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Find Buddies
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition">
          <FaGlobeAsia className="text-4xl text-teal-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Explore Destinations
          </h3>
          <p className="text-gray-600 mb-4">
            Get inspired by top travel destinations around the world.
          </p>
          <Link
            to="/trips"
            className="inline-block px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
