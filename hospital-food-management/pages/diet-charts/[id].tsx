import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

// Define the type for Diet Chart based on your Prisma schema
type DietChart = {
  id: number;
  patientId: number;
  mealTime: string;
  ingredients: string;
  instructions: string | null;
  patients: {
    name: string;
    room_number: number;
    bed_number: number;
  } | null;
};

export default function DietChartDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [dietChart, setDietChart] = useState<DietChart | null>(null);

  useEffect(() => {
    if (id) {
      const fetchDietChartDetails = async () => {
        try {
          const response = await axios.get(`/api/diet-charts/${id}`);
          setDietChart(response.data);
        } catch (error) {
          console.error("Error fetching diet chart details:", error);
        }
      };
      fetchDietChartDetails();
    }
  }, [id]);

  if (!dietChart) {
    return (
      <main className="flex justify-center items-center h-screen bg-gradient-to-br from-green-500 to-blue-500 text-white">
        <p className="text-lg font-semibold">Loading diet chart details...</p>
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
          🍽️ Diet Chart Details
        </h1>

        {/* Diet Chart Details */}
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {dietChart.mealTime} Meal
          </h2>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>🥗 Ingredients:</p>
            <p>{dietChart.ingredients}</p>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>⚠️ Instructions:</p>
            <p>{dietChart.instructions || "No special instructions"}</p>
          </div>
          {dietChart.patients && (
            <>
              <div className="flex justify-between text-gray-700 mb-3">
                <p>🛏️ Patient Name:</p>
                <p>{dietChart.patients.name}</p>
              </div>
              <div className="flex justify-between text-gray-700 mb-3">
                <p>🏠 Room:</p>
                <p>{dietChart.patients.room_number}</p>
              </div>
              <div className="flex justify-between text-gray-700 mb-3">
                <p>🛌 Bed:</p>
                <p>{dietChart.patients.bed_number}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}