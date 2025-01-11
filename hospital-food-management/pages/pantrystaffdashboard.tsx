import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { parse } from "cookie";
import axios from "axios";
import ProfileCompletionForm from "../components/ProfileCompletionForm";

// ✅ Define Task and Delivery Personnel Types
type Task = {
  id: number;
  mealId: number;
  preparationStatus: string;
  mealDetails: {
    patientName: string;
    roomNumber: number;
    bedNumber: number;
    dietChart: string;
  };
};

type DeliveryPersonnel = {
  id: number;
  name: string;
  contactInfo: string;
  otherDetails?: string;
};

// ✅ Define Decoded JWT Type
type DecodedToken = {
  role: string;
  email: string;
  id: number;
  exp: number;
};

// Server-side authentication check
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;

  // Parse cookies from the request headers
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.id_token;

  if (!token) {
    console.log("No token found in cookies.");
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);

    if (decoded.role !== "pantry_staff") {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      };
    }

    return {
      props: {
        token,
        decoded,
      },
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

const PantryStaffDashboard = ({
  token,
  decoded,
}: {
  token: string;
  decoded: DecodedToken;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPersonnel[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch meal preparation tasks
        const tasksResponse = await axios.get("/api/pantry-tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(tasksResponse.data);

        // Fetch delivery personnel details
        const personnelResponse = await axios.get("/api/delivery-personnel", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeliveryPersonnel(personnelResponse.data);

        // Check if profile completion is required
        const profileStatusResponse = await axios.get(
          `/api/pantry-staff/status?userId=${decoded.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setShowPopup(!profileStatusResponse.data.detailsFilled);
      } catch (error) {
        console.error("Error fetching data or checking profile status:", error);
      }
    }

    fetchData();
  }, [token, decoded.id]);

  const updatePreparationStatus = async (taskId: number, status: string) => {
    try {
      await axios.put(
        `/api/pantry-tasks/${taskId}`,
        { preparationStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, preparationStatus: status } : task
        )
      );
    } catch (error) {
      console.error("Error updating preparation status:", error);
    }
  };

  const assignDeliveryPersonnel = async (taskId: number, personnelId: number) => {
    try {
      await axios.post(
        `/api/assign-delivery`,
        { taskId, personnelId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Delivery personnel assigned successfully.");
    } catch (error) {
      console.error("Error assigning delivery personnel:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 p-6">
      {showPopup && (
        <ProfileCompletionForm
          userId={decoded.id}
          email={decoded.email} // Pre-fill email
          role={decoded.role}
          onClose={() => setShowPopup(false)}
        />
      )}
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8">👨‍🍳 Inner Pantry Dashboard</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🍽️ Meal Preparation Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-gray-100 p-6 rounded-lg shadow-md transition-transform hover:scale-105"
              >
                <p className="font-bold">Task ID: {task.id}</p>
                <p>Meal ID: {task.mealId}</p>
                <p>Patient: {task.mealDetails.patientName}</p>
                <p>
                  Room: {task.mealDetails.roomNumber}, Bed: {task.mealDetails.bedNumber}
                </p>
                <p>Diet Chart: {task.mealDetails.dietChart}</p>
                <p>Preparation Status: {task.preparationStatus}</p>
                <div className="mt-4">
                  <button
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                    onClick={() => updatePreparationStatus(task.id, "Completed")}
                  >
                    Mark as Completed
                  </button>
                </div>
                <div className="mt-4">
                  <select
                    onChange={(e) =>
                      assignDeliveryPersonnel(task.id, parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="">Assign Delivery Personnel</option>
                    {deliveryPersonnel.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PantryStaffDashboard;