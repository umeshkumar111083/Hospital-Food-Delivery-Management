import { useState, useEffect } from "react";
import axios from "axios";

type PantryStaff = {
  id: number;
  name: string;
  location: string;
};

type DietChart = {
  id: number;
  meal_time: string;
  ingredients: string;
};

const AssignMeal = () => {
  const [pantryStaff, setPantryStaff] = useState<PantryStaff[]>([]);
  const [dietCharts, setDietCharts] = useState<DietChart[]>([]);
  const [selectedPantryStaff, setSelectedPantryStaff] = useState<number | "">("");
  const [selectedDietChart, setSelectedDietChart] = useState<number | "">("");
  const [preparationStatus, setPreparationStatus] = useState("Pending");
  const [message, setMessage] = useState("");
  const [loadingPantry, setLoadingPantry] = useState(true);
  const [loadingDietCharts, setLoadingDietCharts] = useState(true);

  useEffect(() => {
    fetchPantryStaff();
    fetchDietCharts();
  }, []);

  const fetchPantryStaff = async () => {
    try {
      const response = await axios.get("/api/pantry-staff/list");
      setPantryStaff(response.data.pantryStaff);
    } catch (error) {
      console.error("Error fetching pantry staff:", error);
    } finally {
      setLoadingPantry(false);
    }
  };

  const fetchDietCharts = async () => {
    try {
      console.log("Fetching diet charts...");
      const response = await axios.get("/api/dashboard/dietcharts", {
        headers: { "Cache-Control": "no-cache" },
      });
    
      if (response.data && response.data.dietCharts) {
        console.log("Diet charts received:", response.data.dietCharts);
        setDietCharts(response.data.dietCharts);
      } else {
        console.warn("No diet charts found.");
      }
    } catch (error: unknown) {
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        console.error("Error fetching diet charts:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("Unexpected error:", error.message);
      } else {
        console.error("An unknown error occurred.");
      }
    } finally {
      setLoadingDietCharts(false);
    }
  };

  const handleAssignMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPantryStaff || !selectedDietChart) {
      setMessage("⚠️ Please select both Pantry Staff and Diet Chart.");
      return;
    }

    try {
      const response = await axios.post("/api/pantry-staff/assign-meal", {
        pantry_staff_id: selectedPantryStaff,
        diet_chart_id: selectedDietChart,
        preparation_status: preparationStatus,
      });
    
      if (response.status === 201) {
        setMessage("✅ Meal assigned successfully!");
        setSelectedPantryStaff("");
        setSelectedDietChart("");
        setPreparationStatus("Pending");
      }
    } catch (error: unknown) {
      console.error("Error assigning meal:", error);
    
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "❌ Failed to assign meal. Try again.");
      } else {
        setMessage("❌ An unexpected error occurred. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-teal-600 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">🍽️ Assign Meal</h2>

        {message && <p className="text-center text-red-500 font-semibold mb-4">{message}</p>}

        <form onSubmit={handleAssignMeal} className="space-y-6">
          {/* Pantry Staff Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">👨‍🍳 Select Pantry Staff</label>
            {loadingPantry ? (
              <p className="text-gray-500 text-sm italic">Loading pantry staff...</p>
            ) : (
              <select
                value={selectedPantryStaff}
                onChange={(e) => setSelectedPantryStaff(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select a staff member</option>
                {pantryStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} ({staff.location})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Diet Chart Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">🥗 Select Diet Chart</label>
            {loadingDietCharts ? (
              <p className="text-gray-500 text-sm italic">Loading diet charts...</p>
            ) : (
              <select
                value={selectedDietChart}
                onChange={(e) => setSelectedDietChart(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                <option value="">Select a diet chart</option>
                {dietCharts.map((chart) => (
                  <option key={chart.id} value={chart.id}>
                    {chart.meal_time} - {chart.ingredients}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Preparation Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">⚙️ Preparation Status</label>
            <select
              value={preparationStatus}
              onChange={(e) => setPreparationStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 text-lg font-semibold bg-green-500 hover:bg-green-600 transition rounded-lg shadow-md text-white"
          >
            ✅ Assign Meal
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignMeal;