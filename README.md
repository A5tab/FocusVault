# FocusVault Smart Notes App

A full-stack notes app with a React frontend and an Express + MongoDB backend. It includes authentication, searchable notes, and a clean dashboard for creating, editing, and managing notes.

## Project Structure

- `backend/` - Express API, MongoDB models, controllers, services, repositories, and middleware
- `frontend/` - React app with login, signup, and the notes dashboard

## Highlights

- JWT authentication for signup and login
- Notes CRUD with title, content, timeline, and author details
- Versioned backend API under `/api/v1`
- Security, logging, JSON parsing, and CORS on the backend
- Responsive dashboard UI with search and note previews

## Setup

### Backend Environment

Create `backend/.env` with the values below:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/focusvault
JWT_SECRET=change-this-secret
CORS_ORIGIN=http://localhost:5173,http://localhost:4173
```

### Frontend Environment

Create `frontend/.env` with the value below:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Run the App

Start the backend first:

```bash
cd backend
npm run dev
```

Then start the frontend:

```bash
cd frontend
npm run dev
```

## API Overview

Base path: `/api/v1`

- `POST /auth/signup`
- `POST /auth/login`
- `GET /notes`
- `POST /notes`
- `GET /notes/:id`
- `PUT /notes/:id`
- `DELETE /notes/:id`

## Tech Stack

- Backend: Express, MongoDB, Mongoose, JWT, Helmet, Morgan, CORS
- Frontend: React, Vite, Axios, React Router

## Notes

- The backend runs on port `3000`.
- The frontend uses `VITE_API_BASE_URL=http://localhost:3000/api/v1`.
- Notes can be pinned so important items stay at the top of the list.
