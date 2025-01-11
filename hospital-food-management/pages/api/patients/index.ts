import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const patients = await prisma.patients.findMany();
      return res.status(200).json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      return res.status(500).json({ error: "Failed to fetch patients" });
    }
  }

  if (req.method === "POST") {
    try {
      console.log("Received Data:", req.body); // ✅ Debugging Log

      // Convert required fields to the correct data type
      const patient = await prisma.patients.create({
        data: {
          name: req.body.name,
          age: Number(req.body.age), // ✅ Ensure Age is stored as a number
          gender: req.body.gender,
          disease: req.body.disease || null,
          allergies: req.body.allergies || null,
          room_number: Number(req.body.roomNumber), // ✅ Ensure Room Number is stored as a number
          bed_number: Number(req.body.bedNumber), // ✅ Ensure Bed Number is stored as a number
          floor_number: Number(req.body.floorNumber), // ✅ Ensure Floor Number is stored as a number
          contact_phone: req.body.contactPhone,
          emergency_contact_phone: req.body.emergencyContactPhone,
        },
      });

      console.log("Patient Created:", patient);
      return res.status(201).json(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      return res.status(500).json({ error: "Failed to create patient" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}