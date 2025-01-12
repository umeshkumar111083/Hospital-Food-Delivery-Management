import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../styles/dashboard.module.css"; // ✅ Using Existing Styles

// ✅ Define Delivery Status Type
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

  // ✅ Fetch Delivery Data
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
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>📦 Delivery Status</h1>
          <button onClick={() => router.push("/dashboard")} className={styles.logoutBtn}>🔙 Back</button>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className={styles.loadingText}>Loading deliveries...</p>
        ) : deliveries.length === 0 ? (
          <p className={styles.emptyText}>No deliveries found.</p>
        ) : (
          <>
            {/* Deliveries Section */}
            <h2 className={styles.sectionTitle}>🚚 Active Deliveries</h2>
            <div className={styles.gridContainer}>
              {deliveries.map((delivery) => (
                <div key={delivery.id} className={styles.dashboardCard}>
                  <h3 className={styles.cardTitle}>🍽️ {delivery.mealTime} Meal</h3>
                  <p>🧑‍⚕️ Patient: {delivery.patientName}</p>
                  <p>🛏️ Room {delivery.roomNumber}, Bed {delivery.bedNumber}</p>
                  <p>📦 Status: <span className="font-semibold">{delivery.deliveryStatus}</span></p>
                  <p>🛵 Delivering Person: {delivery.deliveryPersonnelName || "Not Assigned"}</p>
                  <p>📅 Delivered At: {delivery.deliveredAt ? new Date(delivery.deliveredAt).toLocaleString() : "Pending"}</p>
                  {delivery.deliveryNotes && <p>📝 Notes: {delivery.deliveryNotes}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}