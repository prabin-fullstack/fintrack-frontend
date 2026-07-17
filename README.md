# Fintrack — Frontend

React.js frontend for **Fintrack**, a full-stack personal finance tracker.
Connects to a Django REST Framework API with JWT authentication and a
Neon PostgreSQL database.

🔗 **Live Demo:** https://fintrack-frontend-liart.vercel.app
🔗 **Backend Repo:** https://github.com/prabin-fullstack/fintrack-backend

## Features
- JWT-based login/register with protected routes
- Add, edit, and delete income/expense transactions
- Real-time balance calculation
- Analytics dashboard — income vs. expense trends, category breakdowns
- Multi-filter search (type, category, date)
- Fully responsive, mobile-friendly UI

## Tech Stack
React.js · Vite · Axios · JavaScript · CSS3 · Vercel (deployment)

## Folder Structure
```
src/
├── components/     # Reusable UI components
├── pages/          # Route-level views (Dashboard, Login, Transactions)
├── services/       # Axios API calls
├── context/        # Auth context/provider
└── App.jsx
```

## Installation
```bash
git clone https://github.com/prabin-fullstack/fintrack-frontend.git
cd fintrack-frontend
npm install
npm run dev
```

## Environment Variables
Create a `.env` file in the root:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

## Screenshots
*(Add: dashboard view, login screen, mobile view)*

## Future Improvements
- Add dark mode
- Add recurring transaction support
- Add data export (CSV)

## License
MIT
