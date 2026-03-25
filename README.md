# 🚀 Hackoctober

> A real-time collaborative coding environment featuring live code editing, instant synchronization, and built-in audio/video communication.

---

## ✨ Features

* 🔹 **Real-time Collaboration**: Write and edit code simultaneously with others using Monaco Editor and Liveblocks.
* 🔹 **Audio & Video Chat**: Communicate effortlessly through integrated, low-latency audio/video rooms powered by LiveKit.
* 🔹 **Secure Authentication**: Frictionless user signup and login handled securely by Clerk.
* 🔹 **Persistent Storage**: Save your sessions and data seamlessly using MongoDB.
* 🔹 **Email Notifications**: Keep users informed with automated email updates via Nodemailer.

---

## 🛠️ Tech Stack

**Frontend**
* React 19 / Vite / Tailwind CSS / DaisyUI / Zustand state management

**Real-time Services**
* Liveblocks / Yjs / Monaco Editor / LiveKit SDK

**Backend**
* Node.js / Express / Nodemailer

**Database**
* MongoDB (Mongoose)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Hackoctober.git

# Navigate into the folder
cd Hackoctober

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

## ▶️ Usage

1. Add your environment variables to both `frontend/.env` and `backend/.env` files.
2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
4. Open the app in your browser (usually `http://localhost:5173`).
5. Sign up / Login, and jump into a collaborative code editing session!

---

## 📂 Project Structure

```
Hackoctober/
│
├── frontend/
│   ├── public/           # Static assets
│   ├── src/              # React components and pages
│   └── package.json      # Frontend dependencies
│
├── backend/
│   ├── src/              # Express API endpoints and Node.js logic
│   └── package.json      # Backend dependencies
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👤 Author & Contributors

**jites**
* GitHub: https://github.com/jites

**Contributions by:**
* [Nishith-062](https://github.com/Nishith-062)
* [Bharani Kumar](https://github.com/Bharanikumar55)
* [Biradar Omkar](https://github.com/biradaromkar2005)

