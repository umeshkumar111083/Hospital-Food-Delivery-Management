import { useState } from "react";
import axios from "axios"; // Removed AxiosError import

export default function DeliveryPersonnelForm({ email, userId, onClose }: { email: string; userId: number; onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/delivery-personnel/save", {
        name,
        email,
        phone,
        userId,
      });
      alert("Details saved successfully.");
      onClose(); // Close the popup after successful submission
    } catch (err: unknown) { // Use `unknown` to handle any error type safely
      if (axios.isAxiosError(err)) { // Check if error is an AxiosError
        setError(
          err.response?.data?.error || "Failed to save details. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Complete Your Details</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-2 border rounded bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}