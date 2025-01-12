import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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
  const [loading, setLoading] = useState(false);

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formattedData = {
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      disease: form.disease || "",
      allergies: form.allergies || "",
      room_number: Number(form.roomNumber),
      bed_number: Number(form.bedNumber),
      floor_number: Number(form.floorNumber),
      contact_phone: form.contactPhone,
      emergency_contact_phone: form.emergencyContactPhone,
    };

    try {
      await axios.post("/api/dashboard/getpatients", formattedData, {
        headers: { "Content-Type": "application/json" },
      });
      router.push("/dashboard");
    } catch {
      // Removed 'err' since it is not used
      setError("Failed to add patient. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 px-6">
      <div className="w-full max-w-4xl bg-white bg-opacity-95 shadow-lg rounded-xl p-8">
        
        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold shadow-md hover:bg-gray-300 transition-transform hover:scale-105"
        >
          🔙 Back
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">➕ Add Patient</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            <div className="relative">
              <label className="text-gray-700 font-semibold">Patient Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black" />
            </div>

            <div className="relative">
              <label className="text-gray-700 font-semibold">Age</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} required 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black" />
            </div>

            <div className="relative">
              <label className="text-gray-700 font-semibold">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} required 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="relative">
              <label className="text-gray-700 font-semibold">Disease (Optional)</label>
              <input type="text" name="disease" value={form.disease} onChange={handleChange} 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black" />
            </div>

            <div className="relative">
              <label className="text-gray-700 font-semibold">Allergies (Optional)</label>
              <input type="text" name="allergies" value={form.allergies} onChange={handleChange} 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div className="relative">
              <label className="text-gray-700 font-semibold">Room Number</label>
              <input type="number" name="roomNumber" value={form.roomNumber} onChange={handleChange} required 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black" />
            </div>

            <div className="relative">
              <label className="text-gray-700 font-semibold">Bed Number</label>
              <input type="number" name="bedNumber" value={form.bedNumber} onChange={handleChange} required 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black" />
            </div>

            <div className="relative">
              <label className="text-gray-700 font-semibold">Floor Number</label>
              <input type="number" name="floorNumber" value={form.floorNumber} onChange={handleChange} required 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black" />
            </div>

            <div className="relative">
              <label className="text-gray-700 font-semibold">Contact Phone</label>
              <input type="text" name="contactPhone" value={form.contactPhone} onChange={handleChange} required 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black" />
            </div>

            <div className="relative">
              <label className="text-gray-700 font-semibold">Emergency Contact</label>
              <input type="text" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} required 
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-all" disabled={loading}>
              {loading ? "Submitting..." : "✅ Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}