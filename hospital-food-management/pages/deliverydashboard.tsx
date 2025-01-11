import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { parse } from "cookie";
import axios from "axios";

// Task Type
type Task = {
  id: number;
  status: string;
  notes: string;
  patientName: string;
  roomNumber: string | number;
  bedNumber: string | number;
  dietChart: string;
};

// Decoded JWT Type
type DecodedToken = {
  role: string;
  email: string;
  id: number;
  exp: number;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.id_token;

  if (!token) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);

    if (decoded.role !== "delivery_personnel") {
      return { redirect: { destination: "/unauthorized", permanent: false } };
    }

    return { props: { token, deliveryPersonnelId: decoded.id } };
  } catch {
    return { redirect: { destination: "/login", permanent: false } };
  }
};

const DeliveryDashboard = ({
  token,
  deliveryPersonnelId,
}: {
  token: string;
  deliveryPersonnelId: number;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get(`/api/delivery-tasks?deliveryPersonnelId=${deliveryPersonnelId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching delivery tasks:", error);
      }
    }
    fetchTasks();
  }, [token, deliveryPersonnelId]);

  const markDeliveryDone = async (taskId: number, notes: string) => {
    try {
      await axios.put(
        `/api/delivery-tasks/${taskId}`,
        { status: "Delivered", notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: "Delivered", notes } : task
        )
      );
    } catch (error) {
      console.error("Error marking delivery as done:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-500 p-6">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">🚚 Delivery Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-100 p-6 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              <p className="font-bold">Patient: {task.patientName}</p>
              <p>
                Room: {task.roomNumber}, Bed: {task.bedNumber}
              </p>
              <p>Diet Chart: {task.dietChart}</p>
              <p>Status: {task.status}</p>
              <textarea
                placeholder="Add delivery notes"
                className="w-full p-2 border rounded-md mt-4"
                onBlur={(e) => markDeliveryDone(task.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;