# Amit Kumar Sharma — Portfolio

A responsive React portfolio and Node API for Amit Kumar Sharma, a Computer Science Engineering student. Public content is stored in MongoDB and served through REST endpoints; contact messages, admin editing and a visitor chat inbox use the same API.

## Features

- Responsive portfolio with a lightweight React Three Fiber hero, theme preference, anchor navigation and reduced-motion support.
- Portfolio sections for profile, education, categorized skills, projects, resume, socials, certificates and contact.
- Express/Mongoose APIs with public read routes and cookie-authenticated admin write routes.
- Contact form with validation, rate limiting, MongoDB persistence and optional SMTP notification.
- Visitor chat intake, persisted sessions/messages, Socket.IO rooms and admin message APIs.
- Admin login backed by bcrypt and JWT HTTP-only cookies; JSON editor for portfolio content.
- Helmet, CORS allowlist, request size limit, MongoDB operator sanitization and consistent JSON errors.

## Stack and layout

- `client/`: React, Vite, React Router, Tailwind setup, Framer Motion, Three.js/R3F/Drei, Axios and Lucide.
- `server/`: Express, Mongoose, Socket.IO, JWT, bcrypt, Nodemailer and Cloudinary SDK dependency.
- `client/src/components/`: modular section, navigation, 3D and chat components.
- `client/src/pages/`: homepage, project detail route and admin dashboard.
- `server/src/models/`: separate Mongoose schemas for admin, content, contact and chat.
- `server/src/server.js`: API routes, realtime events and startup wiring.

## Local setup

Requirements: Node.js 20 or newer, npm, and MongoDB (local or Atlas).

1. Install dependencies in both applications:

   ```sh
   cd server && npm install
   cd ../client && npm install
   ```

2. Copy `server/.env.example` to `server/.env`, set `MONGO_URI`, a long random `JWT_SECRET`, `CLIENT_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. Optional mail and cloud settings can be left empty. Copy `client/.env.example` to `client/.env.local` if the API is not at `http://localhost:5000/api`.

3. Start the backend and frontend in separate terminals:

   ```sh
   cd server && npm run dev
   cd client && npm run dev
   ```

The server seeds starter portfolio content when the database is empty. It creates the initial administrator from the configured `ADMIN_*` values. To reset or update that account intentionally, use `npm run seed:admin` after setting the environment.

## Environment variables

### Server

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Signing key for admin sessions |
| `CLIENT_URL` | Allowed frontend origin(s), comma separated |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Initial admin account (password is bcrypt hashed) |
| `OWNER_EMAIL` | Contact/chat notification recipient |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | Optional email delivery configuration |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Reserved for configured media storage |

### Client

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | API base URL including `/api` |

Secrets must only be set in the backend environment. `VITE_*` values are public build-time values.

## Data and API

Public reads use `GET /api/profile`, `/education`, `/skills`, `/projects`, `/certificates`, `/socials`, and `/resume`. Content is managed using admin-authenticated `PUT /api/profile`, CRUD routes on collection resources, and `PUT /api/resume`. Project details are available from `GET /api/projects/:id` (Mongo ID or slug).

Authentication routes: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`. The JWT is stored in an HTTP-only cookie.

Contact: public `POST /api/contact`; authenticated `GET`, `PUT /:id` (status), and `DELETE /:id` under `/api/contact`.

Chat: public `POST /api/chat/start` and `POST /api/chat/message`; authenticated `GET /api/chat/sessions`, `GET /sessions/:id/messages`, and `POST /sessions/:id/messages`. Socket events include `chat:join`, `chat:message`, `chat:typing`, `admin:join`, `chat:new-session`, and `chat:new-message`.

The dashboard at `/admin` uses a JSON editor for creating/updating content. Records should follow their Mongoose schema. It provides list/create/update/delete for portfolio collections, message status changes, visitor conversation history and owner replies. Visitor chat supports persisted sessions plus Socket.IO realtime messages while connected.

## MongoDB, email and media

Create a MongoDB database and user, allow the deploying server's IP in Atlas network access, and use the Atlas connection string as `MONGO_URI`. The application seeds non-sensitive starter content on first connection; it does not seed any personal contact details, social URLs, certificate claims, statistics or project links.

SMTP notifications are sent only when the SMTP host/user and `OWNER_EMAIL` are configured. Authenticated `POST /api/uploads` accepts one JPG, PNG, WebP or PDF file up to 5 MB as `multipart/form-data` under the `file` field. It requires configured Cloudinary credentials and returns a hosted URL; use that URL in the admin content editor. The JSON editor does not yet include a file picker.

## Deployment

- **Vercel:** set the client root directory to `client`, build command `npm run build`, output directory `dist`, and `VITE_API_URL` to the deployed API `/api` URL. Add SPA rewrites for React Router paths.
- **Render/Railway:** deploy `server` with `npm start`, set the server environment variables, and set `CLIENT_URL` to the deployed frontend origin. Use a persistent hosted MongoDB Atlas database.
- Enable HTTPS in production so the admin cookie is marked secure. Use distinct high-entropy admin credentials and keep all server secrets in the platform's secret manager.

## Current implementation boundaries

This repository includes public APIs, admin content CRUD, login, contact persistence, SMTP notification integration, Cloudinary upload API, chat persistence and Socket.IO visitor/admin messaging. It does not include email verification or automated test suites. Configure credentials and a real MongoDB instance before relying on deployed persistence; the live MongoDB, SMTP and Cloudinary integrations have not been exercised from this workspace.

## Troubleshooting

- Check `GET /api/health` to see whether the server and MongoDB are connected.
- If the browser blocks API requests, verify `CLIENT_URL` exactly matches the deployed origin and that `VITE_API_URL` points to the API.
- If admin login fails, verify the admin environment values and `JWT_SECRET`; run `npm run seed:admin` after changing credentials.
- If contact entries save but no email arrives, inspect SMTP credentials, port/security settings and `OWNER_EMAIL`; database persistence does not depend on SMTP.
