import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Extract token from cookies
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.id_token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token found" });
    }

    // ✅ Send token back to `getServerSideProps`
    return res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Error retrieving token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}