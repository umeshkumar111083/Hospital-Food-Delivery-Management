import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      if (!id) {
        return res.status(400).json({ error: "Missing diet chart ID" });
      }

      const dietChart = await prisma.diet_charts.findUnique({
        where: { id: Number(id) },
        include: {
          patients: true, // Include related patient details
        },
      });

      if (!dietChart) {
        return res.status(404).json({ error: "Diet chart not found" });
      }

      res.status(200).json(dietChart);
    } catch (error) {
      console.error("Error fetching diet chart:", error);
      res.status(500).json({ error: "Failed to fetch diet chart" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}