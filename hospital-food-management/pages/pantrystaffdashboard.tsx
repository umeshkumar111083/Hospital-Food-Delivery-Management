import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { FaSignOutAlt } from "react-icons/fa";

// ✅ Ensure Axios Sends Cookies Globally
axios.defaults.withCredentials = true;

// ✅ Define Token & Data Types
type DecodedToken = {
  id: number;
  email: string;
  role: string;
};

type Task = {
  id: number;
  status: string;
  patientName: string;
  roomNumber: string | number;
  bedNumber: string | number;
  deliveryPersonnelName?: string | null; // ✅ Add this line
  dietChart: string;
  deliveryStatus?: string | null;
  deliveryPersonnelId?: number | null;
  preparationStatus: string; // Added for meal preparation status
};

type DeliveryPersonnel = {
  id: number;
  name: string;
  phone: string;
};

const PantryStaffDashboard = ({ token }: { token: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [personnel, setPersonnel] = useState<DeliveryPersonnel[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<{ [key: number]: number }>({});
  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({});
  const [pantryStaffId, setPantryStaffId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      console.warn("⚠️ No token found, redirecting to login.");
      router.replace("/login");
    }
  }, [token, router]);

  useEffect(() => {
    if (!token) return;
  
    const fetchUserId = async () => {
      try {
        const decoded: DecodedToken = jwtDecode(token);
  
        if (decoded.role !== "pantry_staff") {
          console.warn("⚠️ Unauthorized access detected. Redirecting...");
          router.replace("/unauthorized");
          return;
        }
  
        const staffResponse = await axios.get(`/api/pantry-staff/get?id=${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (staffResponse.data?.pantry_staff_id) {
          console.log("✅ Pantry Staff ID:", staffResponse.data.pantry_staff_id);
          setPantryStaffId(staffResponse.data.pantry_staff_id);
        } else {
          console.warn("⚠️ Pantry staff ID not found. Redirecting to profile completion.");
          router.replace("/complete-pantry-profile");
        }
      } catch (error) {
        console.error("❌ Error fetching pantry staff ID:", error);
        router.replace("/login");
      }
    };
  
    fetchUserId();
  }, [token, router]); // ✅ Add 'router' to the dependency array

  useEffect(() => {
    if (!pantryStaffId) return;
  
    const fetchData = async () => {
      try {
        const [tasksResponse, personnelResponse, assignedPersonnelResponse] = await Promise.all([
          axios.get(`/api/pantrystaffdashboard/tasks?pantry_staff_id=${pantryStaffId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/pantrystaffdashboard/delivery_personnel`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/pantrystaffdashboard/assigned_delivery?pantry_staff_id=${pantryStaffId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        console.log("🔹 Tasks Response:", tasksResponse.data);
        console.log("🔹 Personnel Response:", personnelResponse.data);
        console.log("🔹 Assigned Personnel Response:", assignedPersonnelResponse.data);
  
        // ✅ Map assigned delivery personnel to their respective meal IDs
        const assignedMap = new Map<number, { mealId: number; deliveryPersonnelName: string }>(
          assignedPersonnelResponse.data.map((a: { mealId: number; deliveryPersonnelName: string }) => [
            a.mealId,
            a,
          ])
        );
  
        setTasks(
          tasksResponse.data.map((task: Task) => ({
            ...task,
            preparationStatus: task.preparationStatus || task.status || "Pending", // ✅ Ensure correct status assignment
            deliveryPersonnelName: assignedMap.get(task.id)?.deliveryPersonnelName || null,
          }))
        );
  
        setPersonnel(personnelResponse.data);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [pantryStaffId, token]); // ✅ Add 'token' to the dependency array

  const assignMeal = async (mealId: number) => {
    if (personnel.length === 0) {
      return alert("❌ No delivery personnel available!");
    }
  
    const deliveryPersonnelId = selectedPersonnel[mealId];
    if (!deliveryPersonnelId) return alert("❌ Select a delivery personnel first!");

    try {
      await axios.post(
        `/api/pantrystaffdashboard/assign_meal`,
        { meal_id: mealId, delivery_personnel_id: deliveryPersonnelId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
      console.error("❌ Error assigning meal:", error);
    }
  };

  const updatePreparationStatus = async (mealId: number) => {
    const newStatus = selectedStatus[mealId];
    if (!newStatus) return alert("❌ Select a valid preparation status!");

    try {
      await axios.put(
        `/api/pantrystaffdashboard/update_meal_status`,
        { meal_id: mealId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Preparation status updated successfully!");
      setTasks((prev) =>
        prev.map((task) =>
          task.id === mealId
            ? {
                ...task,
                preparationStatus: newStatus,
              }
            : task
        )
      );
    } catch (error) {
      console.error("❌ Error updating preparation status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.replace("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-500 to-green-700 text-white">
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
            <div key={task.id} className="p-6 bg-white text-black rounded-lg shadow-md">
              <p className="font-bold text-xl">Patient: {task.patientName}</p>
              <p>Room: {task.roomNumber}, Bed: {task.bedNumber}</p>
              <p>Diet Chart: {task.dietChart}</p>
              <p>Preparation Status: <span className="font-semibold">{task.preparationStatus}</span></p>

              {/* Change Preparation Status */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Change Preparation Status:</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedStatus[task.id] || ""}
                  onChange={(e) =>
                    setSelectedStatus({ ...selectedStatus, [task.id]: e.target.value })
                  }
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-all"
                  onClick={() => updatePreparationStatus(task.id)}
                >
                  🔄 Update Status
                </button>
              </div>

              {/* Assign Delivery Personnel */}
              {/* Show assigned delivery personnel & allow reassignment */}
              {personnel.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {task.deliveryPersonnelName
                      ? `🚚 Assigned Delivery Personnel: ${task.deliveryPersonnelName}`
                      : "Assign Delivery Personnel"}
                  </label>

                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedPersonnel[task.id] || task.deliveryPersonnelId || ""}
                    onChange={(e) =>
                      setSelectedPersonnel({ ...selectedPersonnel, [task.id]: Number(e.target.value) })
                    }
                  >
                    <option value="">Select Personnel</option>
                    {personnel.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} ({person.phone})
                      </option>
                    ))}
                  </select>

                  <button
                    className="mt-3 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-all"
                    onClick={() => assignMeal(task.id)}
                  >
                    🔄 {task.deliveryPersonnelName ? "Reassign Personnel" : "Assign Meal"}
                  </button>
                </div>
              )}
              {task.deliveryPersonnelName && (
                <p className="mt-2 font-medium text-blue-600">
                  🚚 Assigned Delivery Personnel: <span className="font-semibold">{task.deliveryPersonnelName}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Fixed `getServerSideProps`
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.id_token;

  if (!token) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { token } };
};

export default PantryStaffDashboard;