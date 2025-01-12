import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const {
      name,
      age,
      gender,
      disease,
      allergies,
      room_number,
      bed_number,
      floor_number,
      contact_phone,
      emergency_contact_phone,
    } = req.body;

    // ✅ Validate required fields
    if (!name || !age || !gender || !room_number || !bed_number || !floor_number || !contact_phone || !emergency_contact_phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      // ✅ Insert into database
      const newPatient = await prisma.patients.create({
        data: {
          name,
          age,
          gender,
          disease: disease || null, // Optional field
          allergies: allergies || null, // Optional field
          room_number,
          bed_number,
          floor_number,
          contact_phone,
          emergency_contact_phone,
        },
      });

      return res.status(201).json(newPatient);
    } catch (error) {
      console.error("Error adding patient:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}