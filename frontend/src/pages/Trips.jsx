import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";
import { formatDate } from "../utils/formatDate";
import TripCard from "../components/TripCard";

export default function Trips() {
  const { user, token } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchTrips = async () => {
        try {
          const response = await axios.get("/trips", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTrips(response.data);
        } catch (error) {
          toast.error("Failed to fetch trips");
        }
      };
      fetchTrips();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/trip", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrips([...trips, response.data.trip]);
      setFormData({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        notes: "",
      });
      setShowForm(false);
      toast.success("Trip added successfully!");
    } catch (error) {
      toast.error("Failed to add trip");
    }
  };

  const handleEditTrip = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `/trip/${selectedTrip._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrips(
        trips.map((trip) =>
          trip._id === selectedTrip._id ? response.data : trip
        )
      );
      setIsEditing(false);
      setSelectedTrip(null);
      setFormData({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        notes: "",
      });
      setShowForm(false);
      toast.success("Trip updated successfully!");
    } catch (error) {
      toast.error("Failed to update trip");
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      if (!id) return toast.error("Invalid trip ID");
      await axios.delete(`/trip/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrips(trips.filter((trip) => trip._id !== id));
      toast.success("Trip deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-8">
      <h2 className="text-3xl font-semibold mb-6">My Trips</h2>

      <button
        onClick={() => {
          setShowForm(true);
          setIsEditing(false);
          setSelectedTrip(null);
        }}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg mb-6"
      >
        Add New Trip
      </button>

      {showForm && (
        <form
          onSubmit={isEditing ? handleEditTrip : handleAddTrip}
          className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto my-8"
        >
          <div className="space-y-4">
            <input
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="border p-3 w-full rounded-md"
              placeholder="Title"
              required
            />
            <input
              name="destination"
              value={formData.destination}
              onChange={handleFormChange}
              className="border p-3 w-full rounded-md"
              placeholder="Destination"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleFormChange}
                className="border p-3 w-full rounded-md"
                required
              />
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleFormChange}
                className="border p-3 w-full rounded-md"
                required
              />
            </div>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              className="border p-3 w-full rounded-md"
              placeholder="Notes"
            />
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 text-white rounded-lg"
            >
              {isEditing ? "Update Trip" : "Add Trip"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.length === 0 ? (
          <p className="text-lg text-gray-500 col-span-3">
            You have no trips yet.
          </p>
        ) : (
          trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={() => {
                setFormData({
                  title: trip.title,
                  destination: trip.destination,
                  startDate: formatDate(trip.startDate),
                  endDate: formatDate(trip.endDate),
                  notes: trip.notes,
                });
                setIsEditing(true);
                setSelectedTrip(trip);
                setShowForm(true);
              }}
              onDelete={() => handleDeleteTrip(trip._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
