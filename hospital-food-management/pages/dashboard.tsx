import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../styles/dashboard.module.css"; // ✅ Import CSS Module

// ✅ Define types for Patients, Diet Charts, and Pantry Staff
type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  disease?: string;
  allergies?: string;
  roomNumber: number;
  bedNumber: number;
  contactPhone: string;
  emergencyContactPhone: string;
};

type DietChart = {
  id: number;
  patientId: number;
  mealTime: string;
  ingredients: string;
  instructions: string;
};

type PantryStaff = {
  id: number;
  name: string;
  phone: string;
  location: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dietCharts, setDietCharts] = useState<DietChart[]>([]);
  const [pantryStaff, setPantryStaff] = useState<PantryStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, dietChartsRes, pantryRes] = await Promise.all([
        axios.get("/api/dashboard/patients"),
        axios.get("/api/dashboard/diet-charts"),
        axios.get("/api/dashboard/pantry-staff"),
      ]);
      setPatients(patientsRes.data);
      setDietCharts(dietChartsRes.data);
      setPantryStaff(pantryRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.title}>🏥 Hospital Food Manager Dashboard</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>🚪 Logout</button>
        </div>

        {/* Navigation Buttons */}
        <div className={styles.buttonGrid}>
          <button onClick={() => router.push("/add-patient")} className={`${styles.dashboardBtn} ${styles.blue}`}>
            ➕ Add New Patient
          </button>
          <button onClick={() => router.push("/add-diet-chart")} className={`${styles.dashboardBtn} ${styles.green}`}>
            🍽️ Add Diet Chart
          </button>
          <button onClick={() => router.push("/add-pantry-staff")} className={`${styles.dashboardBtn} ${styles.purple}`}>
            👨‍🍳 Add Pantry Staff
          </button>
          <button onClick={() => router.push("/delivery-status")} className={`${styles.dashboardBtn} ${styles.orange}`}>
            📦 Delivery Details
          </button>
          <button onClick={() => router.push("/pantry-staff-dashboard")} className={`${styles.dashboardBtn} ${styles.pink}`}>
            👨‍🍳 Pantry Staff Dashboard
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className={styles.loadingText}>Loading dashboard data...</p>
        ) : (
          <>
            {/* Patients Section */}
            <h2 className={styles.sectionTitle}>🧑‍⚕️ Patients</h2>
            <div className={styles.gridContainer}>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <div key={patient.id} className={styles.dashboardCard}>
                    <h3 className={styles.cardTitle}>{patient.name}</h3>
                    <p>🛏️ Room {patient.roomNumber}, Bed {patient.bedNumber}</p>
                    <p>🔹 Age: {patient.age} | Gender: {patient.gender}</p>
                    <p>💊 Disease: {patient.disease || "N/A"}</p>
                    <p>📞 Contact: {patient.contactPhone}</p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No patients available.</p>
              )}
            </div>

            {/* Diet Charts Section */}
            <h2 className={styles.sectionTitle}>🍽️ Diet Charts</h2>
            <div className={styles.gridContainer}>
              {dietCharts.length > 0 ? (
                dietCharts.map((chart) => (
                  <div key={chart.id} className={styles.dashboardCard}>
                    <h3 className={styles.cardTitle}>🍽️ {chart.mealTime} Meal</h3>
                    <p>🥗 Ingredients: {chart.ingredients}</p>
                    <p>⚠️ Instructions: {chart.instructions}</p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No diet charts available.</p>
              )}
            </div>

            {/* Pantry Staff Section */}
            <h2 className={styles.sectionTitle}>👨‍🍳 Pantry Staff</h2>
            <div className={styles.gridContainer}>
              {pantryStaff.length > 0 ? (
                pantryStaff.map((staff) => (
                  <div key={staff.id} className={styles.dashboardCard}>
                    <h3 className={styles.cardTitle}>{staff.name}</h3>
                    <p>📍 Location: {staff.location}</p>
                    <p>📞 Contact: {staff.phone}</p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>No pantry staff available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}