import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { parse } from "cookie";
import { jwtDecode } from "jwt-decode";

const prisma = new PrismaClient();

type DecodedToken = {
  id: number;
  email: string;
  role: string;
  exp: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ✅ Extract token from cookies
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.id_token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token found" });
    }

    // ✅ Decode token to get user ID and role
    const decoded: DecodedToken = jwtDecode(token);
    const userId = decoded.id;
    // const email = decoded.email;

    if (decoded.role !== "pantry_staff") {
      return res.status(403).json({ error: "Forbidden: User is not pantry staff" });
    }

    // ✅ Extract request body fields
    const { name, phone, location } = req.body;

    if (!name || !phone || !location) {
      return res.status(400).json({ error: "Missing required fields: name, phone, or location" });
    }

    // ✅ Check if pantry staff details already exist
    const existingStaff = await prisma.pantry_staff.findUnique({
      where: { user_id: userId },
    });

    if (existingStaff) {
      return res.status(400).json({ error: "Pantry staff details already exist", redirect: "/pantrystaffdashboard" });
    }

    // ✅ Save pantry staff details in DB
    await prisma.pantry_staff.create({
      data: { name, phone, location, user_id: userId },
    });

    return res.status(201).json({ message: "Details saved successfully", redirect: "/pantrystaffdashboard" });

  } catch (error) {
    console.error("Error saving pantry staff details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}