import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { parse } from "cookie";
import { jwtDecode } from "jwt-decode";

const prisma = new PrismaClient();

type DecodedToken = {
  id: number;
  email: string;
  role: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ✅ Extract token from cookies
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.id_token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token found" });
    }

    // ✅ Decode token to get user ID
    const decoded: DecodedToken = jwtDecode(token);
    const userId = decoded.id;

    // ✅ Fetch Pantry Staff by user_id
    const pantryStaff = await prisma.pantry_staff.findUnique({
      where: { user_id: userId },
      select: { id: true }, // Select only ID
    });

    if (!pantryStaff) {
      return res.status(404).json({ error: "Pantry staff details not found" });
    }

    return res.status(200).json({ pantry_staff_id: pantryStaff.id });

  } catch (error) {
    console.error("Error fetching pantry staff details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}