import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // ✅ Fetch all patients from the database (for dropdown)
    const patients = await prisma.patients.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}