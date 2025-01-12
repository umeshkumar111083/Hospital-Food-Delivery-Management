import { useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import axios from "axios";
import { parse } from "cookie";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: number;
  email: string;
  role: string;
  exp: number;
};

const CompletePantryProfile = ({ email }: { token: string; userId: number; email: string }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post("/api/pantry-staff/save", { name, phone, location });
    
      if (response.data.redirect) {
        router.push(response.data.redirect);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "❌ Failed to save details. Try again.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("❌ An unknown error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 px-4">
      <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-8 shadow-lg text-white">
        <h2 className="text-2xl font-bold text-center mb-4">🍽️ Complete Your Pantry Profile</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Enter your name"
              className="w-full px-4 py-3 mt-2 bg-white text-gray-900 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 mt-2 bg-white text-gray-900 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
              placeholder="Enter your workplace location"
              className="w-full px-4 py-3 mt-2 bg-white text-gray-900 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Email Input (Read Only) */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input 
              type="email" 
              value={email} 
              readOnly 
              className="w-full px-4 py-3 mt-2 bg-gray-200 text-gray-600 rounded-lg shadow-md border border-gray-300 cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full px-4 py-3 text-lg font-semibold bg-indigo-500 hover:bg-indigo-600 transition rounded-lg shadow-md text-white"
          >
            ✅ Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

// ✅ **Get User Data from Server & Check Pantry Staff Entry**
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.id_token;

  if (!token) return { redirect: { destination: "/login", permanent: false } };

  try {
    // ✅ Decode token to get userId and email
    const decoded: DecodedToken = jwtDecode(token);

    // ✅ Ensure user is pantry staff
    if (decoded.role !== "pantry_staff") {
      return { redirect: { destination: "/unauthorized", permanent: false } };
    }

    // ✅ Check if pantry staff details already exist in DB
    const response = await axios.get(`/api/pantry-staff/status?userId=${decoded.id}`);
    if (response.data.detailsFilled) {
      return { redirect: { destination: "/pantrystaffdashboard", permanent: false } };
    }

    return { props: { token, userId: decoded.id, email: decoded.email } };
  } catch (error) {
    console.error("Error checking pantry staff status:", error);
    return { redirect: { destination: "/login", permanent: false } };
  }
};

export default CompletePantryProfile;