import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// ✅ Define Diet Chart Form Type
type DietChartForm = {
  patientId: string;
  mealTime: string;
  ingredients: string;
  instructions: string;
};

// ✅ Define Patient Type for dropdown
type Patient = {
  id: number;
  name: string;
};

export default function AddDietChart() {
  const [form, setForm] = useState<DietChartForm>({
    patientId: "",
    mealTime: "Morning",
    ingredients: "",
    instructions: "",
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Fetch Patient List
  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await axios.get("/api/dashboard/fetchPatients"); // ✅ New API
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    }
    fetchPatients();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      await axios.post("/api/dashboard/dietcharts", {
        ...form,
        patientId: Number(form.patientId),
      });
  
      router.push("/dashboard");
    } catch {
      setError("Failed to add diet chart. Try again."); // Removed 'err' as it was unused
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 px-6">
      <div className="w-full max-w-4xl bg-white bg-opacity-95 shadow-lg rounded-xl p-8 relative">
        
        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold shadow-md hover:bg-gray-300 transition-transform hover:scale-105"
        >
          🔙 Back
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">🍽️ Add Diet Chart</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Select Patient */}
            <div className="relative">
              <label className="text-gray-700 font-semibold">Select Patient</label>
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Time */}
            <div className="relative">
              <label className="text-gray-700 font-semibold">Meal Time</label>
              <select
                name="mealTime"
                value={form.mealTime}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black"
                required
              >
                <option value="Morning">🌅 Morning</option>
                <option value="Evening">🌆 Evening</option>
                <option value="Night">🌙 Night</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Ingredients */}
            <div className="relative">
              <label className="text-gray-700 font-semibold">Ingredients (comma-separated)</label>
              <input
                type="text"
                name="ingredients"
                placeholder="E.g. Rice, Dal, Vegetables"
                value={form.ingredients}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black"
                required
              />
            </div>

            {/* Special Instructions */}
            <div className="relative">
              <label className="text-gray-700 font-semibold">Special Instructions (Optional)</label>
              <input
                type="text"
                name="instructions"
                placeholder="E.g. No salt, Low sugar"
                value={form.instructions}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black"
              />
            </div>
          </div>

          {/* Submit Button (Full Width) */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-all"
              disabled={loading}
            >
              {loading ? "Submitting..." : "✅ Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}