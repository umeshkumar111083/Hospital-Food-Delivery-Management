import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FaUserPlus, FaUtensils, FaTruck, FaUsers, FaSignOutAlt } from "react-icons/fa";

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
        axios.get("/api/dashboard/patients"),
        axios.get("/api/dashboard/diet-charts"),
        axios.get("/api/dashboard/pantry-staff"),
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 flex justify-center">
      <div className="max-w-6xl w-full bg-white bg-opacity-90 shadow-xl rounded-lg p-8 backdrop-blur-md">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🏥 Hospital Food Manager</h1>
          <button onClick={handleLogout} className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <button onClick={() => router.push("/add-patient")} className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg shadow-lg transition">
            <FaUserPlus className="mr-2" /> Add Patient
          </button>
          <button onClick={() => router.push("/add-diet-chart")} className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg shadow-lg transition">
            <FaUtensils className="mr-2" /> Add Diet Chart
          </button>
          <button onClick={() => router.push("/add-pantry-staff")} className="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg shadow-lg transition">
            <FaUsers className="mr-2" /> Add Pantry Staff
          </button>
          <button onClick={() => router.push("/delivery-status")} className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg shadow-lg transition">
            <FaTruck className="mr-2" /> Delivery Details
          </button>
        </div>

        {/* Data Sections */}
        {loading ? (
          <p className="text-center text-gray-600">Loading dashboard data...</p>
        ) : (
          <>
            {/* Patients Section */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">🧑‍⚕️ Patients</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <div key={patient.id} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-gray-600">🛏️ Room {patient.roomNumber}, Bed {patient.bedNumber}</p>
                    <p className="text-gray-600">🔹 Age: {patient.age} | Gender: {patient.gender}</p>
                    <p className="text-gray-600">💊 Disease: {patient.disease || "N/A"}</p>
                    <p className="text-gray-600">📞 Contact: {patient.contactPhone}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No patients available.</p>
              )}
            </div>

            {/* Diet Charts Section */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">🍽️ Diet Charts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {dietCharts.length > 0 ? (
                dietCharts.map((chart) => (
                  <div key={chart.id} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">🍽️ {chart.mealTime} Meal</h3>
                    <p className="text-gray-600">🥗 Ingredients: {chart.ingredients}</p>
                    <p className="text-gray-600">⚠️ Instructions: {chart.instructions}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No diet charts available.</p>
              )}
            </div>

            {/* Pantry Staff Section */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">👨‍🍳 Pantry Staff</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {pantryStaff.length > 0 ? (
                pantryStaff.map((staff) => (
                  <div key={staff.id} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">{staff.name}</h3>
                    <p className="text-gray-600">📍 Location: {staff.location}</p>
                    <p className="text-gray-600">📞 Contact: {staff.phone}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No pantry staff available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}