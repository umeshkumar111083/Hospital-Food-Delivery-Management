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

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/pantry-staff", form);
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to add pantry staff. Try again.");
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

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">👨‍🍳 Add Pantry Staff</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Name */}
            <input
              type="text"
              name="name"
              placeholder="Staff Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Contact Number */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Full Width */}
          <div className="col-span-1 md:col-span-2">
            {/* Location */}
            <input
              type="text"
              name="location"
              placeholder="Kitchen / Pantry Location"
              value={form.location}
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