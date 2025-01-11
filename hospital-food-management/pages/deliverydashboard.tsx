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

// Delivery Personnel Form Props
type DeliveryPersonnelFormProps = {
  email: string;
  deliveryPersonnelId: number;
  onClose: () => void;
  token: string;
};

// Delivery Personnel Form Component
const DeliveryPersonnelForm = ({ email, deliveryPersonnelId, onClose, token }: DeliveryPersonnelFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `/api/delivery-personnel/save`,
        { name, email, phone, userId: deliveryPersonnelId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Details saved successfully.");
      onClose(); // Close the form after successful submission
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save details. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Complete Your Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
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

    return { props: { token, deliveryPersonnelId: decoded.id, email: decoded.email } };
  } catch {
    return { redirect: { destination: "/login", permanent: false } };
  }
};

const DeliveryDashboard = ({
  token,
  deliveryPersonnelId,
  email,
}: {
  token: string;
  deliveryPersonnelId: number;
  email: string;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showPopup, setShowPopup] = useState(true); // Default to show form for new users

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

    async function checkProfileCompletion() {
      try {
        const response = await axios.get(
          `/api/delivery-personnel/status?userId=${deliveryPersonnelId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setShowPopup(!response.data.detailsFilled);
      } catch (error) {
        console.error("Error checking profile completion:", error);
      }
    }

    fetchTasks();
    checkProfileCompletion();
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

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-500 p-6">
      {showPopup && (
        <DeliveryPersonnelForm
          email={email}
          deliveryPersonnelId={deliveryPersonnelId}
          onClose={handleClosePopup}
          token={token}
        />
      )}

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