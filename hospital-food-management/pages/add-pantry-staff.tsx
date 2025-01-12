import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// ✅ Define Pantry Staff Form Type
type PantryStaffForm = {
  name: string;
  phone: string;
  location: string;
};

export default function AddPantryStaff() {
  const [form, setForm] = useState<PantryStaffForm>({
    name: "",
    phone: "",
    location: "",
  });

  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      await axios.post("/api/dashboard/addPantryStaff", form, {
        headers: { "Content-Type": "application/json" },
      });
      router.push("/dashboard");
    } catch {
      // Removed 'err' since it is not used
      setError("Failed to add pantry staff. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 px-6">
      <div className="w-full max-w-3xl bg-white bg-opacity-95 shadow-lg rounded-xl p-8 relative">
        
        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="absolute top-4 left-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold shadow-md hover:bg-gray-300 transition-transform hover:scale-105"
        >
          🔙 Back
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">👨‍🍳 Add Pantry Staff</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {/* Name Field */}
          <div className="relative">
            <label className="text-gray-700 font-semibold">Staff Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black"
            />
          </div>

          {/* Phone Field */}
          <div className="relative">
            <label className="text-gray-700 font-semibold">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black"
            />
          </div>

          {/* Location Field */}
          <div className="relative">
            <label className="text-gray-700 font-semibold">Kitchen / Pantry Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="mt-1 p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-green-300 text-black"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
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