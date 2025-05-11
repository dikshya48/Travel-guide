import { formatDate } from "../utils/formatDate";

export default function TripCard({ trip, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-200">
      <h3 className="text-xl font-semibold text-teal-600">{trip.title}</h3>
      <p className="text-md text-gray-700 mt-2">{trip.destination}</p>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          <strong>Start Date:</strong> {formatDate(trip.startDate)}
        </p>
        <p className="text-sm text-gray-500">
          <strong>End Date:</strong> {formatDate(trip.endDate)}
        </p>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        <strong>Notes:</strong> {trip.notes || "No notes available."}
      </p>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
