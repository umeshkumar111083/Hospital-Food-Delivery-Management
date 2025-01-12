import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FaArrowLeft, FaTruck, FaUserNurse, FaClock, FaStickyNote, FaCheckCircle } from "react-icons/fa";

type Delivery = {
  id: number;
  mealId: number;
  deliveryStatus: string;
  deliveredAt?: string | null;
  deliveryNotes?: string;
  deliveryPersonnelName?: string;
  patientName: string;
  roomNumber: number;
  bedNumber: number;
  mealTime: string;
};

export default function DeliveryStatus() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const fetchDeliveryData = async () => {
    try {
      const response = await axios.get("/api/dashboard/getDeliveries");
      setDeliveries(response.data);
    } catch (error) {
      console.error("Error fetching delivery data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-6 flex justify-center">
      <div className="max-w-5xl w-full bg-white bg-opacity-90 shadow-xl rounded-lg p-8 backdrop-blur-md">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📦 Delivery Status</h1>
          <button onClick={() => router.push("/dashboard")} className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition">
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>

        {/* Loading or No Deliveries */}
        {loading ? (
          <p className="text-center text-gray-600">Loading deliveries...</p>
        ) : deliveries.length === 0 ? (
          <p className="text-center text-gray-500">No deliveries found.</p>
        ) : (
          <>
            {/* Deliveries Section */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">🚚 Active Deliveries</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaTruck className="mr-2 text-indigo-500" /> {delivery.mealTime} Meal
                  </h3>
                  <p className="text-gray-600 flex items-center">
                    <FaUserNurse className="mr-2 text-blue-500" /> Patient: {delivery.patientName}
                  </p>
                  <p className="text-gray-600">🛏️ Room {delivery.roomNumber}, Bed {delivery.bedNumber}</p>
                  <p className="text-gray-600 font-semibold flex items-center">
                    📦 Status: 
                    <span className={`ml-2 px-2 py-1 rounded text-white ${delivery.deliveryStatus === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {delivery.deliveryStatus}
                    </span>
                  </p>
                  <p className="text-gray-600 flex items-center">
                    🛵 Delivering Person: {delivery.deliveryPersonnelName || "Not Assigned"}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <FaClock className="mr-2 text-gray-500" /> Delivered At: 
                    {delivery.deliveredAt ? new Date(delivery.deliveredAt).toLocaleString() : "Pending"}
                  </p>
                  {delivery.deliveryNotes && (
                    <p className="text-gray-600 flex items-center">
                      <FaStickyNote className="mr-2 text-yellow-500" /> Notes: {delivery.deliveryNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}