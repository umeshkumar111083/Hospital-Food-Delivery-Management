import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

// Define the type for Pantry Staff based on your Prisma schema
type PantryStaff = {
  id: number;
  name: string;
  location: string;
  phone: string;
};

export default function PantryStaffDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [staff, setStaff] = useState<PantryStaff | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPantryStaffDetails = async () => {
        try {
          const response = await axios.get(`/api/pantry-staff/${id}`);
          setStaff(response.data);
        } catch (error) {
          console.error("Error fetching pantry staff details:", error);
        }
      };
      fetchPantryStaffDetails();
    }
  }, [id]);

  if (!staff) {
    return (
      <main className="flex justify-center items-center h-screen bg-gradient-to-br from-green-500 to-blue-500 text-white">
        <p className="text-lg font-semibold">Loading pantry staff details...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-500 via-blue-500 to-indigo-500 p-6 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md mb-6 flex items-center"
        >
          🔙 Back
        </button>

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          👨‍🍳 Pantry Staff Details
        </h1>

        {/* Pantry Staff Details */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {staff.name}
          </h2>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>📍 Location:</p>
            <p>{staff.location}</p>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>📞 Contact:</p>
            <p>{staff.phone}</p>
          </div>
        </div>
      </div>
    </main>
  );
}