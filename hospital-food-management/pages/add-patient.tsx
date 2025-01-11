import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// ✅ Define Patient Form Type
type PatientForm = {
  name: string;
  age: string;
  gender: string;
  disease?: string;
  allergies?: string;
  roomNumber: string;
  bedNumber: string;
  floorNumber: string;
  contactPhone: string;
  emergencyContactPhone: string;
};

export default function AddPatient() {
  const [form, setForm] = useState<PatientForm>({
    name: "",
    age: "",
    gender: "Male",
    disease: "",
    allergies: "",
    roomNumber: "",
    bedNumber: "",
    floorNumber: "",
    contactPhone: "",
    emergencyContactPhone: "",
  });

  const router = useRouter();
  const [error, setError] = useState("");

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formattedData = {
      ...form,
      age: Number(form.age),
      roomNumber: Number(form.roomNumber),
      bedNumber: Number(form.bedNumber),
      floorNumber: Number(form.floorNumber),
    };

    try {
      await axios.post("/api/patients", formattedData);
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to add patient. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 px-4">
      <div className="relative w-full max-w-4xl bg-white bg-opacity-90 backdrop-blur-lg p-8 rounded-xl shadow-lg">
        
        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold shadow-md hover:bg-gray-400 hover:scale-105 transition-transform"
        >
          🔙 Back
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">➕ Add Patient</h1>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Patient Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              name="disease"
              placeholder="Disease (Optional)"
              value={form.disease}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="allergies"
              placeholder="Allergies (Optional)"
              value={form.allergies}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <input
              type="number"
              name="roomNumber"
              placeholder="Room Number"
              value={form.roomNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="bedNumber"
              placeholder="Bed Number"
              value={form.bedNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="floorNumber"
              placeholder="Floor Number"
              value={form.floorNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="contactPhone"
              placeholder="Contact Phone"
              value={form.contactPhone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="emergencyContactPhone"
              placeholder="Emergency Contact Phone"
              value={form.emergencyContactPhone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button (Full Width) */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-600 hover:scale-105 transition-transform"
            >
              ✅ Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}