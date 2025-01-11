import { useState } from "react";
import { useRouter } from "next/router";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode to decode the token

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Define the decoded JWT type
  type DecodedToken = {
    role: string; // User role, e.g., "hospital_manager", "pantry_staff", "delivery_personnel"
    email: string;
    exp: number; // Token expiration time
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Decode the token to get the user role
      const decoded: DecodedToken = jwtDecode(data.token);

      // Redirect based on the user's role
      if (decoded.role === "hospital_manager") {
        router.push("/dashboard");
      } else if (decoded.role === "pantry_staff") {
        router.push("/pantrystaffdashboard");
      } else if (decoded.role === "delivery_personnel") {
        router.push("/deliverydashboard");
      } else {
        router.push("/unauthorized");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg shadow-gray-500/50">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Hospital Food Management</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-500 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}