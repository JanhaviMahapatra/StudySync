StudySync

StudySync is a full-stack web platform that helps students find the perfect study partner and stay accountable while preparing for exams, internships, or learning new technologies.

The platform matches users based on their study habits, goals, and availability, and also includes an AI assistant that generates personalized study plans.

---

🚀 Features

Study Buddy Matching

- Match with users who share similar:
  - Study hours
  - Goals (internship, exams, skill learning)
  - Topics (DSA, React, etc.)
  - Preferred study time

Real-Time Chat

- Private chat between study partners
- Real-time messaging using WebSockets
- Typing indicator
- Online / Offline status

AI Study Assistant

- AI powered study guidance
- Generates study plans based on the user's profile
- Helps create roadmaps for technologies and exams

User Profile System

Users can define:

- Study level (Beginner / Intermediate / Advanced)
- Daily study hours
- Preferred study time
- Learning goals
- Topics of interest
- Weekly availability schedule

Accountability Features

- Track consistency
- Stay motivated with a study partner

---

🛠 Tech Stack

Frontend

- React
- React Router
- Axios
- Socket.io Client
- Vite

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io

AI Integration

- OpenRouter API
- DeepSeek Chat Model

---

📂 Project Structure

StudySync
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   └── socket.js
│   └── main.jsx
│
└── README.md

---

⚙️ Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/your-username/StudySync.git
cd StudySync

---

2️⃣ Backend Setup

cd backend
npm install

Create ".env" file:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_ai_api_key

Run backend:

npm run dev

---

3️⃣ Frontend Setup

cd frontend
npm install
npm run dev

Frontend will run on:

http://localhost:5173

---

🔮 Future Improvements

- Study streak tracking
- AI generated shared plans for study buddies
- Group study rooms
- Notifications and reminders
- Progress tracking dashboard

---

👨‍💻 Author

Developed by Janhavi Mahapatra

If you found this project interesting, feel free to ⭐ the repository.