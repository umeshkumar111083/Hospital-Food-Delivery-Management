import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const patient = await prisma.patients.findUnique({
      where: { id: Number(id) },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ error: "Failed to fetch patient details" });
  }
}