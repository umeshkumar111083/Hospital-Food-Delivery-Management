import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const patients = await prisma.patients.findMany();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "Error fetching patients" });
  }
}