import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Meal Type
type Meal = {
  id: number;
  patientName: string;
  roomNumber: string | number;
  bedNumber: string | number;
  dietChart: string;
  deliveryPersonnel?: {
    id: number;
    name: string;
    phone: string;
  } | null;
};

// ✅ Delivery Personnel Type
type DeliveryPersonnel = {
  id: number;
  name: string;
  phone: string;
};

// ✅ Pantry Staff Dashboard Component
const PantryStaffDashboard = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [personnel, setPersonnel] = useState<DeliveryPersonnel[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Fetch meals with assigned/unassigned personnel
        const mealsResponse = await axios.get(`/api/pantrystaffdashboard/available_meals`);
        setMeals(mealsResponse.data);

        // ✅ Fetch available delivery personnel
        const personnelResponse = await axios.get(`/api/pantrystaffdashboard/delivery_personnel`);
        setPersonnel(personnelResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ Handle Assign Meal
  const assignMeal = async (mealId: number) => {
    const deliveryPersonnelId = selectedPersonnel[mealId];
    if (!deliveryPersonnelId) return alert("Select a delivery personnel first!");

    try {
      await axios.post(`/api/pantrystaffdashboard/assign_meal`, {
        meal_id: mealId,
        delivery_personnel_id: deliveryPersonnelId,
      });

      alert("✅ Meal assigned successfully!");

      // ✅ Update state to reflect assignment
      setMeals((prev) =>
        prev.map((meal) =>
          meal.id === mealId
            ? {
                ...meal,
                deliveryPersonnel: personnel.find((p) => p.id === deliveryPersonnelId),
              }
            : meal
        )
      );
    } catch (error) {
      console.error("Error assigning meal:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-400 to-green-600 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-8">👨‍🍳 Pantry Staff Dashboard</h1>

      {loading ? (
        <p className="text-center text-white text-lg animate-pulse">Loading...</p>
      ) : meals.length === 0 ? (
        <p className="text-center text-white text-lg">No completed meals available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div key={meal.id} className="bg-white text-black p-6 rounded-lg shadow-lg">
              <p className="font-bold text-lg">Patient: {meal.patientName}</p>
              <p>Room: {meal.roomNumber}, Bed: {meal.bedNumber}</p>
              <p>Diet Chart: {meal.dietChart}</p>
              <p className="font-semibold text-gray-600">Status: Completed</p>

              {/* ✅ Show assigned personnel */}
              {meal.deliveryPersonnel ? (
                <p className="mt-2 text-green-700 font-semibold">
                  🚚 Assigned to: {meal.deliveryPersonnel.name} ({meal.deliveryPersonnel.phone})
                </p>
              ) : (
                // ✅ Assign to Delivery Personnel (Only if Unassigned)
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Assign to:</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, [meal.id]: Number(e.target.value) })}
                  >
                    <option value="">Select Personnel</option>
                    {personnel.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} ({person.phone})
                      </option>
                    ))}
                  </select>

                  <button
                    className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
                    onClick={() => assignMeal(meal.id)}
                  >
                    🚀 Assign Meal
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PantryStaffDashboard;