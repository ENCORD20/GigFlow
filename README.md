# GigFlow 🚀

A full-stack (MERN) freelance marketplace application where users can post gigs, bid on projects, and hire freelancers in real-time.

## features

- **Authentication**: Secure Login/Register (JWT + HttpOnly Cookies).
- **Gig Management**: Post, Search, and View Gigs.
- **Bidding System**: Freelancers can place bids; Clients can review them.
- **Atomic Hiring**: "Hire" button uses MongoDB Transactions to ensure data integrity.
- **Real-time**: Socket.io notifications when a freelancer is hired.
- **Dashboard**: "My Active Projects" section for hired freelancers.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd GigFlow
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder with the following credentials:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend
Open a new terminal:
```bash
cd gig-flow
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app!

## License
MIT
