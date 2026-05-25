# FocusVault Smart Notes App - Answers

## How to run on a fresh machine

### Install first

You need:

- Node.js 20 LTS or newer
- npm
- A MongoDB database, either local MongoDB or a MongoDB Atlas cluster

### Create the environment files

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/focusvault
JWT_SECRET=change-this-secret
CORS_ORIGIN=http://localhost:5173,http://localhost:4173
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Start the app

Open two terminals.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

If you use Atlas instead of local MongoDB, replace `MONGODB_URI` in `backend/.env` with your Atlas connection string.

## Stack choice

I used MERN because it is a strong full-stack choice for a notes app:

- React gives a fast, component-based UI.
- Express keeps the backend simple and flexible.
- MongoDB fits note documents well because the data is naturally document-shaped.
- Mongoose gives validation and a clearer data model.
- JWT-based auth works well for login/signup flows.

This is a good industry-style starting stack, but it is not magically "enterprise-ready" by itself. It becomes production-worthy when you add proper validation, auth, deployment, logging, backups, and monitoring.

A worse choice for this project would be plain vanilla JavaScript with only `localStorage` for notes. That would be easier to start, but it would be a bad fit because:

- notes would not persist across devices,
- login/auth would be weaker,
- there would be no shared backend data model,
- search, pinning, and sync would be much harder to evolve,
- it would not scale into a real multi-device app cleanly.

## One real edge case handled correctly

The backend rejects invalid note IDs before querying MongoDB 
File and line reference: [backend/services/noteService.js](backend/services/noteService.js#L26).

Without that check, a bad ID like `abc` would flow into Mongoose and could cause a cast error or an unhelpful 500-style failure instead of a clean 400/404-style response. With the current code, the request fails fast and the UI can show a readable error.

## AI usage

I used AI in these main places:

- Project scaffold and boilerplate generation: I asked for the initial backend/frontend structure, and AI produced the folder layout, starter files, and baseline app wiring.
- Backend API structure: I asked for Express routes, controllers, services, repositories, middleware, and Mongoose models, and AI generated the first version of that layer structure.
- Frontend app structure: I asked for the React login/signup/dashboard setup, and AI generated the pages, routing, auth context, and Axios client.
- Validation and error handling: AI suggested early validation patterns, but I changed them. In particular, I replaced the weaker shorthand/shortcut style with explicit `if` / `else` checks and clearer error objects because I wanted easier-to-read code and better field-level error handling.
- UI and dashboard behavior: I asked AI to help improve the dashboard, search, note card actions, toast behavior, and responsive layout.
- README writing: I asked AI to rewrite the README into a cleaner GitHub-friendly format with setup steps and env examples.

One specific change I made to the AI output was in validation. The first pass leaned too much on compact shorthand and was not clear enough for maintainability, so I rewrote it with explicit branching and structured error messages. I did that because the project needed predictable validation and better UX, not just shorter code.

## Honest gap

The biggest thing that is not good enough yet is the UI polish. It is functional and much cleaner now, but it is still not the level I would want for a final product design system.

With more days, I would:

- migrate the frontend styling to Tailwind CSS,
- add shadcn/ui for consistent components,
- improve empty states and dialogs,
- make the dashboard feel more like a polished product than a custom CSS prototype.
