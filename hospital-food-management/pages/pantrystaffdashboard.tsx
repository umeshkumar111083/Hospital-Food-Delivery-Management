import { useState, useEffect } from "react";
import axios from "axios";

// ✅ Task Type (Meal Preparation)
type Task = {
  id: number;
  status: string;
  patientName: string;
  roomNumber: string | number;
  bedNumber: string | number;
  dietChart: string;
  deliveryStatus?: string | null;
  deliveryPersonnelName?: string | null;
  deliveryPersonnelId?: number | null;
  deliveredAt?: string | null;
  deliveryNotes?: string | null;
};

// ✅ Delivery Personnel Type
type DeliveryPersonnel = {
  id: number;
  name: string;
  phone: string;
};

const PantryStaffDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [personnel, setPersonnel] = useState<DeliveryPersonnel[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // ✅ Fetch all meal preparation tasks (Pending, In Progress, Completed)
        const tasksResponse = await axios.get(`/api/pantrystaffdashboard/tasks?pantry_staff_id=1`);
        
        // ✅ Fetch delivery status for each meal
        const tasksWithDeliveryStatus = await Promise.all(
          tasksResponse.data.map(async (task: Task) => {
            try {
              const deliveryResponse = await axios.get(`/api/pantrystaffdashboard/get_delivery_status?meal_id=${task.id}`);
              return { ...task, ...deliveryResponse.data };
            } catch (error) {
              console.error(`Error fetching delivery status for meal ${task.id}:`, error);
              return task;
            }
          })
        );

        setTasks(tasksWithDeliveryStatus);

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

  // ✅ Update Meal Preparation Status
  const updateMealStatus = async (mealId: number, newStatus: string) => {
    try {
      await axios.put(`/api/pantrystaffdashboard/update_meal_status`, { meal_id: mealId, status: newStatus });

      // ✅ Update UI instantly
      setTasks((prev) =>
        prev.map((task) => (task.id === mealId ? { ...task, status: newStatus } : task))
      );
    } catch (error) {
      console.error("Error updating meal status:", error);
    }
  };

  // ✅ Assign Meal to Delivery Personnel
  const assignMeal = async (mealId: number) => {
    const deliveryPersonnelId = selectedPersonnel[mealId];
    if (!deliveryPersonnelId) return alert("Select a delivery personnel first!");

    try {
      await axios.post(`/api/pantrystaffdashboard/assign_meal`, {
        meal_id: mealId,
        delivery_personnel_id: deliveryPersonnelId,
      });

      alert("✅ Meal assigned successfully!");
      setTasks((prev) =>
        prev.map((task) =>
          task.id === mealId
            ? {
                ...task,
                deliveryStatus: "Assigned",
                deliveryPersonnelName: personnel.find((p) => p.id === deliveryPersonnelId)?.name,
              }
            : task
        )
      );
    } catch (error) {
      console.error("Error assigning meal:", error);
    }
  };

  // ✅ Update Delivery Status (Pending → In Transit → Delivered)
  const updateDeliveryStatus = async (mealId: number, newStatus: string) => {
    try {
      await axios.put(`/api/pantrystaffdashboard/update_delivery_status`, { meal_id: mealId, status: newStatus });

      // ✅ Update UI instantly
      setTasks((prev) =>
        prev.map((task) => (task.id === mealId ? { ...task, deliveryStatus: newStatus } : task))
      );
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-500 to-green-700 text-white">
      <h1 className="text-4xl font-extrabold text-center mb-8">👨‍🍳 Pantry Staff Dashboard</h1>

      {loading ? (
        <p className="text-center text-white text-lg animate-pulse">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-white text-lg">No meal preparation tasks available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="p-6 bg-white text-black rounded-lg shadow-md transform hover:scale-105 transition-all">
              <p className="font-bold text-xl">Patient: {task.patientName}</p>
              <p>Room: {task.roomNumber}, Bed: {task.bedNumber}</p>
              <p>Diet Chart: {task.dietChart}</p>

              {/* ✅ Meal Preparation Status (Always Changeable) */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">Meal Status:</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={task.status}
                  onChange={(e) => updateMealStatus(task.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* ✅ Assign Delivery Personnel (If Completed) */}
              {task.status === "Completed" && !task.deliveryStatus && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Assign to:</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, [task.id]: Number(e.target.value) })}
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
                    onClick={() => assignMeal(task.id)}
                  >
                    🚀 Assign Meal
                  </button>
                </div>
              )}

              {/* ✅ Show Delivery Status & Allow Updates */}
              {task.deliveryStatus && (
                <div className="mt-3">
                  <p className="font-semibold text-gray-700">
                    Delivery Status: <span className="text-blue-500">{task.deliveryStatus}</span>
                    <br />
                    Assigned To: <span className="text-green-700">{task.deliveryPersonnelName || "N/A"}</span>
                  </p>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700">Update Delivery Status:</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={task.deliveryStatus || "Pending"}
                      onChange={(e) => updateDeliveryStatus(task.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
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