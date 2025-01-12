import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

// Define the type for Patient based on your API response
type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  disease?: string | null;
  allergies?: string | null;
  roomNumber: number;
  bedNumber: number;
  floorNumber: number;
  contactPhone: string;
  emergencyContactPhone: string;
};

export default function PatientDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPatientDetails = async () => {
        try {
          const response = await axios.get(`/api/patients/${id}`);
          const data = response.data;

          // Map API keys to component keys
          const mappedPatient: Patient = {
            id: data.id,
            name: data.name,
            age: data.age,
            gender: data.gender,
            disease: data.disease || null,
            allergies: data.allergies || null,
            roomNumber: data.room_number,
            bedNumber: data.bed_number,
            floorNumber: data.floor_number,
            contactPhone: data.contact_phone,
            emergencyContactPhone: data.emergency_contact_phone,
          };

          setPatient(mappedPatient);
        } catch (error) {
          console.error("Error fetching patient details:", error);
        }
      };
      fetchPatientDetails();
    }
  }, [id]);

  if (!patient) {
    return (
      <main className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-600 to-purple-500 text-white">
        <p className="text-lg font-semibold">Loading patient details...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 p-6 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md mb-6 flex items-center"
        >
          🔙 Back
        </button>

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">
          🧑‍⚕️ Patient Details
        </h1>

        {/* Patient Details */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {patient.name}
          </h2>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>🛏️ Room:</p>
            <p>{patient.roomNumber}</p>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>🛌 Bed:</p>
            <p>{patient.bedNumber}</p>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>🏢 Floor:</p>
            <p>{patient.floorNumber}</p>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>🔹 Age:</p>
            <p>{patient.age}</p>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>⚥ Gender:</p>
            <p>{patient.gender}</p>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>📞 Contact Phone:</p>
            <p>{patient.contactPhone}</p>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <p>📞 Emergency Contact:</p>
            <p>{patient.emergencyContactPhone}</p>
          </div>
          {patient.disease && (
            <div className="flex justify-between text-gray-700 mb-3">
              <p>💊 Disease:</p>
              <p>{patient.disease}</p>
            </div>
          )}
          {patient.allergies && (
            <div className="flex justify-between text-gray-700 mb-3">
              <p>⚠️ Allergies:</p>
              <p>{patient.allergies}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}