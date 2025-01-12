import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import axios from "axios";
import { parse } from "cookie";

const CompleteProfile = ({ token, userId, email }: { token: string; userId: number; email: string }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const router = useRouter();

  // ✅ Check if details already exist
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await axios.get(`/api/delivery_personnel/status?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200 && response.data.detailsFilled) {
          console.log("✅ Profile exists. Redirecting...");
          router.push("/deliverydashboard");
        } else {
          setLoading(false); // ✅ Only show form if details are missing
        }
      } catch (error) {
        console.error("❌ Error checking profile:", error);
        setLoading(false); // ✅ Show form if error occurs
      }
    };

    checkProfile();
  }, [userId, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "/api/delivery_personnel/save", // ✅ Fixed API path
        { name, phone, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        alert("✅ Profile Completed Successfully!");
        router.push("/deliverydashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "❌ Failed to save details. Try again.");
    }
  };

  // ✅ Show a loading screen while checking profile status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Checking profile details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Complete Your Delivery Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} readOnly className="w-full p-2 border rounded bg-gray-200" />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">Save & Continue</button>
        </form>
      </div>
    </div>
  );
};

// ✅ Check if the user is logged in
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, query } = context;
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.id_token;

  if (!token) return { redirect: { destination: "/login", permanent: false } };

  return { props: { token, userId: query.userId, email: query.email } };
};

export default CompleteProfile;