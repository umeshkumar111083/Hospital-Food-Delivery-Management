import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  disease?: string;
  allergies?: string;
  roomNumber: number;
  bedNumber: number;
  contactPhone: string;
  emergencyContactPhone: string;
};

type DietChart = {
  id: number;
  patientId: number;
  mealTime: string;
  ingredients: string;
  instructions: string;
};

type PantryStaff = {
  id: number;
  name: string;
  phone: string;
  location: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dietCharts, setDietCharts] = useState<DietChart[]>([]);
  const [pantryStaff, setPantryStaff] = useState<PantryStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, dietChartsRes, pantryRes] = await Promise.all([
        axios.get("/api/patients"),
        axios.get("/api/diet-charts"),
        axios.get("/api/pantry-staff"),
      ]);
      setPatients(patientsRes.data);
      setDietCharts(dietChartsRes.data);
      setPantryStaff(pantryRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto bg-white bg-opacity-90 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-4 sm:mb-0">
            🏥 Hospital Food Manager Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-105 hover:bg-red-600"
          >
            🚪 Logout
          </button>

          
          
        </div>
        {/* Buttons Section */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button
            onClick={() => router.push("/add-patient")}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-105 hover:bg-blue-600"
          >
            ➕ Add New Patient
          </button>
          <button
            onClick={() => router.push("/add-diet-chart")}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-105 hover:bg-green-600"
          >
            🍽️ Add Diet Chart
          </button>
          <button
            onClick={() => router.push("/add-pantry-staff")}
            className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-105 hover:bg-purple-600"
          >
            👨‍🍳 Add Pantry Staff
          </button>

          <button
            onClick={() => router.push("/delivery-status")}
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-105 hover:bg-orange-600"
          >
            📦 Delivery Details
          </button>
          <button
            onClick={() => router.push("/pantry-staff-dashboard")}
            className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md transition-transform hover:scale-105 hover:bg-purple-600"
          >
            👨‍🍳 Pantry Staff Dashboard
          </button>
          
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-700 text-lg font-semibold">Loading dashboard data...</p>
        ) : (
          <>
            {/* Patients Section */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">🧑‍⚕️ Patients</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white p-4 sm:p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-gray-700">🛏️ Room {patient.roomNumber}, Bed {patient.bedNumber}</p>
                    <p className="text-gray-700">🔹 Age: {patient.age} | Gender: {patient.gender}</p>
                    <p className="text-gray-700">💊 Disease: {patient.disease || "N/A"}</p>
                    <p className="text-gray-700">📞 Contact: {patient.contactPhone}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No patients available.</p>
              )}
            </div>

            {/* Diet Charts Section */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">🍽️ Diet Charts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              {dietCharts.length > 0 ? (
                dietCharts.map((chart) => (
                  <div
                    key={chart.id}
                    className="bg-white p-4 sm:p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">🍽️ {chart.mealTime} Meal</h3>
                    <p className="text-gray-700">🥗 Ingredients: {chart.ingredients}</p>
                    <p className="text-gray-700">⚠️ Instructions: {chart.instructions}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No diet charts available.</p>
              )}
            </div>

            {/* Pantry Staff Section */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">👨‍🍳 Pantry Staff</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pantryStaff.length > 0 ? (
                pantryStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-white p-4 sm:p-6 rounded-xl shadow-lg transform transition-transform hover:scale-105"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{staff.name}</h3>
                    <p className="text-gray-700">📍 Location: {staff.location}</p>
                    <p className="text-gray-700">📞 Contact: {staff.phone}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No pantry staff available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}