import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { parse } from "cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaSignOutAlt } from "react-icons/fa";

// ✅ Define Task Type
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
};

// ✅ Define Delivery Personnel Type
type DeliveryPersonnel = {
  id: number;
  name: string;
  phone: string;
};

// ✅ Define Decoded Token Type
type DecodedToken = {
  id: number;
  email: string;
  role: string;
};

const PantryStaffDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [personnel, setPersonnel] = useState<DeliveryPersonnel[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<{ [key: number]: number }>({});
  const [pantryStaffId, setPantryStaffId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Decode Token & Fetch Pantry Staff ID
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const cookies = parse(document.cookie);
        if (!cookies.id_token) {
          router.push("/login");
          return;
        }

        const decoded: DecodedToken = jwtDecode(cookies.id_token);
        if (decoded.role !== "pantry_staff") {
          router.push("/unauthorized");
          return;
        }

        // ✅ Fetch Pantry Staff ID from API
        const staffResponse = await axios.get(`/api/pantry-staff/get?id=${decoded.id}`);
        if (staffResponse.data && staffResponse.data.pantry_staff_id) {
          setPantryStaffId(staffResponse.data.pantry_staff_id);
        } else {
          console.warn("Pantry staff ID not found for user.");
          router.push("/complete-pantry-profile");
        }
      } catch (error) {
        console.error("Error fetching pantry staff ID:", error);
        router.push("/login");
      }
    };

    fetchUserId();
  }, []);

  // ✅ Fetch Tasks & Personnel
  useEffect(() => {
    if (!pantryStaffId) return; // ✅ Ensure we have a valid pantryStaffId

    const fetchData = async () => {
      try {
        // ✅ Fetch meal preparation tasks dynamically
        const tasksResponse = await axios.get(`/api/pantrystaffdashboard/tasks?pantry_staff_id=${pantryStaffId}`);

        // ✅ Fetch delivery status dynamically
        const tasksWithDeliveryStatus = await Promise.all(
          tasksResponse.data.map(async (task: Task) => {
            try {
              const deliveryResponse = await axios.get(`/api/pantrystaffdashboard/get_delivery_status?meal_id=${task.id}`);
              return { ...task, ...deliveryResponse.data };
            } catch (error: any) {
              if (error.response?.status === 404) {
                console.warn(`No delivery record found for meal ${task.id}. Skipping.`);
                return { ...task, deliveryStatus: "Not Assigned" };
              } else {
                console.error(`Error fetching delivery status for meal ${task.id}:`, error);
                return task;
              }
            }
          })
        );

        setTasks(tasksWithDeliveryStatus);

        // ✅ Fetch delivery personnel
        const personnelResponse = await axios.get(`/api/pantrystaffdashboard/delivery_personnel`);
        setPersonnel(personnelResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pantryStaffId]);

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

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-500 to-green-700 text-white">
      {/* ✅ Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold">👨‍🍳 Pantry Staff Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

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

              {/* ✅ Assign Delivery Personnel */}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PantryStaffDashboard;