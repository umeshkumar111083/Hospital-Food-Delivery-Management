import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { parse } from "cookie";
import axios from "axios";
import { useRouter } from "next/router";
import { FaSignOutAlt } from "react-icons/fa";

// ✅ Task Type
type Task = {
  id: number;
  status: string;
  notes: string;
  patientName: string;
  roomNumber: string | number;
  bedNumber: string | number;
  dietChart: string;
  delivered_at?: string; // Include delivered_at timestamp
};

// ✅ Decoded JWT Type
type DecodedToken = {
  role: string;
  email: string;
  id: number;
  exp: number;
};

// ✅ Fetch Token & User Data
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.id_token;

  if (!token) return { redirect: { destination: "/login", permanent: false } };

  try {
    const decoded: DecodedToken = jwtDecode(token);
    if (decoded.role !== "delivery_personnel") {
      return { redirect: { destination: "/unauthorized", permanent: false } };
    }

    // ✅ Fetch correct delivery_personnel_id from the database
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/delivery_personnel/${decoded.id}`
    );

    const { id: deliveryPersonnelId } = response.data;

    return { props: { token, deliveryPersonnelId, email: decoded.email } };
  } catch (error) {
    console.error("Error fetching delivery personnel ID:", error);
    return { redirect: { destination: "/login", permanent: false } };
  }
};

// ✅ Delivery Dashboard Component
const DeliveryDashboard = ({ token, deliveryPersonnelId }: { token: string; deliveryPersonnelId: number }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  // ✅ Fetch Delivery Tasks
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get(
          `/api/delivery_personnel/tasks?delivery_personnel_id=${deliveryPersonnelId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sortedTasks = response.data.sort((a: Task, b: Task) => {
          if (a.status === "Delivered" && b.status !== "Delivered") {
            return 1;
          } else if (a.status !== "Delivered" && b.status === "Delivered") {
            return -1;
          }
          return 0; // Keep other tasks in their current order
        });
        setTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching delivery tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [token, deliveryPersonnelId]);

  // ✅ Handle Notes Input Change
  const handleNoteChange = (taskId: number, note: string) => {
    setDeliveryNotes((prevNotes) => ({
      ...prevNotes,
      [taskId]: note,
    }));
  };

  // ✅ Mark Delivery as Done
  const markDeliveryDone = async (taskId: number) => {
    try {
      const notes = deliveryNotes[taskId] || "No additional notes provided";

      const response = await axios.put(
        `/api/delivery_personnel/update`,
        { id: taskId, status: "Delivered", notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Get the delivered_at timestamp from the response
      const { delivered_at } = response.data;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: "Delivered", notes, delivered_at } : task
        )
      );

      alert("✅ Delivery marked as completed!");
    } catch (error) {
      console.error("Error marking delivery as done:", error);
    }
  };

  // ✅ Logout Function
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 text-white">
      {/* ✅ Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-center">🚚 Delivery Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

      {/* ✅ Loading State */}
      {loading ? (
        <p className="text-center text-white text-lg animate-pulse">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-white text-lg">No delivery tasks assigned.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-6 rounded-lg shadow-xl border-l-4 transform transition-transform hover:scale-105 ${
                task.status === "Delivered"
                  ? "bg-gray-200 text-gray-900 border-green-500"
                  : "bg-white text-gray-900 border-yellow-500"
              }`}
            >
              <p className="font-bold text-xl">👨‍⚕️ Patient: {task.patientName}</p>
              <p className="text-md">
                🏠 Room: <span className="font-semibold">{task.roomNumber}</span>, Bed:{" "}
                <span className="font-semibold">{task.bedNumber}</span>
              </p>
              <p className="text-md">🍽 Diet Chart: <span className="font-semibold">{task.dietChart}</span></p>

              <p className="mt-2 text-sm font-semibold">
                Status:{" "}
                <span
                  className={`px-3 py-1 rounded-full ${
                    task.status === "Delivered" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                  }`}
                >
                  {task.status}
                </span>
              </p>

              {task.notes && (
                <p className="mt-2 text-sm text-gray-700 italic">📌 Notes: {task.notes}</p>
              )}

              {/* ✅ Display Delivered At */}
              {task.status === "Delivered" && task.delivered_at && (
                <p className="mt-2 text-sm text-gray-700 italic">
                  📅 Delivered At: {new Date(task.delivered_at).toLocaleString()}
                </p>
              )}

              {/* ✅ Input for additional delivery notes */}
              {task.status !== "Delivered" && (
                <div className="mt-4">
                  <textarea
                    placeholder="Add delivery notes (optional)"
                    className="w-full p-3 border rounded-md text-black shadow-md"
                    value={deliveryNotes[task.id] || ""}
                    onChange={(e) => handleNoteChange(task.id, e.target.value)}
                  />
                  <button
                    className="mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-all"
                    onClick={() => markDeliveryDone(task.id)}
                  >
                    ✅ Mark as Delivered
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

export default DeliveryDashboard;