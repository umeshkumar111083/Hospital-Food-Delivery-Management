import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Fetch delivery personnel details
      const personnel = await prisma.delivery_personnel.findMany();

      // Transform the response to include default values for missing details
      const formattedPersonnel = personnel.map((person) => ({
        id: person.id,
        name: person.name,
        contactInfo: person.phone,
        otherDetails: person.other_details || "N/A",
      }));

      res.status(200).json(formattedPersonnel);
    } catch (error) {
      console.error("Error fetching delivery personnel:", error);
      res.status(500).json({ error: "Failed to fetch delivery personnel" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}