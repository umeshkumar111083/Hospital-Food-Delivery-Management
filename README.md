# Hospital-Food-Delivery-Management

🏥 Hospital Food Management System

Project Description

The Hospital Food Management System is a web application designed to streamline the management of meals and diet charts for hospital patients. The system allows administrators, pantry staff, and delivery personnel to efficiently manage patients’ dietary needs, assign meals, track delivery statuses, and maintain an overview of pantry staff responsibilities.

This project provides a user-friendly interface for managing:
	•	Patient information (e.g., contact details, room assignments, medical details)
	•	Diet charts for patients
	•	Meal delivery tracking
	•	Pantry staff responsibilities and locations

The system also includes detailed analytics on meal delivery status to help administrators monitor the efficiency of meal preparation and delivery.

Features

🎯 Key Features:
	1.	Patient Management: View, add, and update patient details.
	2.	Diet Chart Management: Manage and assign diet charts for patients.
	3.	Meal Delivery Tracking: Track meal preparation and delivery statuses.
	4.	Pantry Staff Management: View and manage pantry staff information.
	5.	Analytics Dashboard: View real-time statistics on meals prepared, assigned, and delivered.
	6.	Detailed View Pages: Each key section (Patients, Diet Charts, Pantry Staff) has a detailed view page to explore all available information.

🖥️ Technologies Used:
	•	Frontend:
	•	React with Next.js for a server-side rendered and responsive UI
	•	Tailwind CSS for styling
	•	Backend:
	•	Next.js API routes
	•	Prisma as the ORM
	•	PostgreSQL for database
	•	Additional Tools:
	•	Axios for API requests
	•	Chart.js for data visualization

📂 Project Structure

├── pages
│   ├── index.tsx                  # Dashboard landing page
│   ├── patients
│   │   ├── [id].tsx               # Patient details page
│   ├── diet-charts
│   │   ├── [id].tsx               # Diet chart details page
│   ├── pantry-staff
│   │   ├── [id].tsx               # Pantry staff details page
│   ├── api
│   │   ├── patients               # API for managing patients
│   │   ├── diet-charts            # API for managing diet charts
│   │   ├── pantry-staff           # API for managing pantry staff
├── prisma
│   ├── schema.prisma              # Prisma schema
├── public                         # Static assets (images, icons)
├── styles                         # Global styles
└── components                     # Reusable components

🚀 How to Run the Project

🛠️ Prerequisites

Make sure you have the following installed on your machine:
	•	Node.js (v16 or later)
	•	PostgreSQL (latest stable version)
	•	Prisma CLI (optional, for schema migrations)

📦 Installation
	1.	Clone the Repository:

git clone https://github.com/your-username/hospital-food-management-system.git
cd hospital-food-management-system


	2.	Install Dependencies:

npm install


	3.	Set Up the Database:
	•	Create a new PostgreSQL database.
	•	Update the DATABASE_URL in .env file:

DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>


	4.	Run Database Migrations:

npx prisma migrate dev --name init


	5.	Seed the Database (optional):

npx prisma db seed


	6.	Start the Development Server:

npm run dev


	7.	Access the Application:
	•	Open your browser and navigate to: http://localhost:3000

🌟 Key Pages and Functionality

Dashboard (/)
	•	View analytics on total meals, assigned meals, delivered meals, and unassigned meals.
	•	Navigate to key sections like Patients, Diet Charts, and Pantry Staff.

Patients
	•	List View: View a summary of all patients, including room and bed assignments.
	•	Details View: Access detailed information about a specific patient, such as allergies and emergency contact details.

Diet Charts
	•	List View: View all diet charts with details on meal time, ingredients, and instructions.
	•	Details View: View detailed diet chart information for a specific patient.

Pantry Staff
	•	List View: View all pantry staff, including their locations and contact details.
	•	Details View: View detailed information about a specific pantry staff member.

📊 Database Schema

Schema Overview:

The database uses PostgreSQL with Prisma as the ORM. The key tables are:
	1.	Patients: Stores patient details such as name, room, allergies, etc.
	2.	Diet Charts: Manages meal schedules, ingredients, and instructions for patients.
	3.	Meals: Tracks meal preparation and delivery status.
	4.	Pantry Staff: Stores information about staff responsible for meal preparation.
	5.	Deliveries: Tracks the assignment of meals to delivery personnel.

🛠️ Development Notes

Running Prisma Studio

To inspect the database:

npx prisma studio

Environment Variables

The following environment variables are required:

DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>

📖 Future Enhancements
	1.	Authentication: Add role-based access (Admin, Staff, Delivery Personnel).
	2.	Notifications: Notify pantry staff and delivery personnel about meal assignments.
	3.	Export Data: Allow exporting analytics and reports in CSV or PDF format.

🧑‍💻 Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request. Ensure your code follows the project’s style and is well-documented.

🙏 Acknowledgments
	•	Next.js Documentation
	•	Prisma Documentation
	•	Tailwind CSS Documentation

📄 License

This project is licensed under the MIT License. See the LICENSE file for details.


Done!