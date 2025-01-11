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
  const router = useRouter();

  // ✅ Fetch Patient List
  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await axios.get("/api/patients");
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

    try {
      await axios.post("/api/diet-charts", {
        ...form,
        patientId: Number(form.patientId),
      });
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to add diet chart. Try again.");
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

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">🍽️ Add Diet Chart</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Select Patient */}
            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>

            {/* Meal Time */}
            <select
              name="mealTime"
              value={form.mealTime}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Morning">🌅 Morning</option>
              <option value="Evening">🌆 Evening</option>
              <option value="Night">🌙 Night</option>
            </select>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Ingredients */}
            <input
              type="text"
              name="ingredients"
              placeholder="Ingredients (comma-separated)"
              value={form.ingredients}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Special Instructions */}
            <input
              type="text"
              name="instructions"
              placeholder="Special Instructions (Optional)"
              value={form.instructions}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
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