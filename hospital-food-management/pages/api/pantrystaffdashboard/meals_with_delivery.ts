import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db"; // Your database connection file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const mealsWithDelivery = await db.query(`
      SELECT 
        meals.id,
        meals.preparation_status AS status,
        patients.name AS patientName,
        patients.room_number AS roomNumber,
        patients.bed_number AS bedNumber,
        diet_charts.meal_time AS dietChart,
        deliveries.delivery_status,
        deliveries.delivered_at,
        deliveries.delivery_notes,
        delivery_personnel.id AS deliveryPersonnelId,
        delivery_personnel.name AS deliveryPersonnelName,
        delivery_personnel.phone AS deliveryPersonnelPhone
      FROM meals
      JOIN diet_charts ON meals.diet_chart_id = diet_charts.id
      JOIN patients ON diet_charts.patient_id = patients.id
      LEFT JOIN deliveries ON meals.id = deliveries.meal_id
      LEFT JOIN delivery_personnel ON deliveries.delivery_personnel_id = delivery_personnel.id
      WHERE meals.preparation_status = 'Completed';
    `);

    res.status(200).json(mealsWithDelivery.rows);
  } catch (error) {
    console.error("Error fetching meals with delivery info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}