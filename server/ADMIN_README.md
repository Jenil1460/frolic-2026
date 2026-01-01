# Admin APIs - User Management & Activity Logs

This file documents the new Admin endpoints and how to run locally.

## Environment
- Ensure `.env` contains:
  - `MONGO_URI` (MongoDB connection)
  - `JWT_SECRET` (used for signing tokens)
  - `PORT` (optional, default 5000)

_Note: Do not commit secrets to source control. Use environment variables only._

## New dependencies
- exceljs (for Excel export)

Install in server folder:

```bash
cd server
npm install
```

## New routes (Admin-only, protected by JWT + Admin middleware)

Base path: `/api/admin`

- GET /users
  - Query params: `q` (search by name/email), `role`, `isVerified`, `isActive`, `page`, `limit`
  - Returns: `{ success, data: { users, page, totalPages, total }, message }`

- GET /users/export
  - Same filters as above. Returns `.xlsx` file attachment.

- PATCH /users/:id/role
  - Body: `{ role }` — update user role

- PATCH /users/:id/status
  - Body: `{ isActive }` — update active/blocked status

- DELETE /users/:id
  - Deletes a user

- GET /activity-logs
  - Query: `q`, `page`, `limit` — returns audit logs

## Activity Logs
Admin actions (role updates, status updates, deletions) are recorded to `ActivityLog` collection.

## Frontend
- The client `adminAPI` was extended with helper methods to call these endpoints.
- Pages added: `UserManagement` (admin users) and `ActivityLogs` (audit trail).

## Quick manual test
1. Start server: `npm run dev` (from `server/`)
2. Create an admin user (one-time):

   - Option A (script): set `ADMIN_EMAIL` and `ADMIN_PASS` in your environment (or `.env`) and run:
     ```bash
     node scripts/createAdmin.js
     ```

   - Option B: register a user via `/api/auth/register` and update its `role` to `Admin` directly in MongoDB.

3. Login via `/api/auth/login` to obtain JWT.
4. Use the Admin UI (http://localhost:5173/admin/users) to manage users.

### Example curl (list users)

```bash
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:5000/api/admin/users?q=je&role=Student&page=1&limit=10"
```

If you want a Postman collection, I can add one for you.

