import { useState } from "react";
import axios from "axios";

type ProfileCompletionFormProps = {
  userId: number;
  email: string;
  onClose: () => void;
  role: string;
};

const ProfileCompletionForm = ({ userId, email, onClose, role }: ProfileCompletionFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: role === "pantry_staff" ? "" : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint =
        role === "pantry_staff"
          ? `/api/pantry-staff/save`
          : `/api/delivery-personnel/save`;

      await axios.post(endpoint, {
        ...formData,
        email, // Include email in the submission
        userId,
      });
      alert("Details saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving details:", error);
      alert("Failed to save details. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <form
        className="bg-white p-6 rounded-lg shadow-lg space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold">Complete Your Profile</h2>
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            value={email} // Pre-filled email
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block font-medium">Phone:</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        {role === "pantry_staff" && (
          <div>
            <label className="block font-medium">Location:</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProfileCompletionForm;