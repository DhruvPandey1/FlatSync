# FlatSync

A complete management system for society admins and residents.

## Initial Setup & Installation

Follow these steps to set up the project on your local machine:

### 1. Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- A [Firebase Account](https://firebase.google.com/) for Push Notifications (FCM)

### 2. Clone and Install Dependencies
Open your terminal and install dependencies for both the frontend and backend:
```bash
# Install backend dependencies
cd app/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Setting Up Environment Variables (.env)
You need to create two `.env` files—one for the backend and one for the frontend.

**Inside `app/backend/.env`:**
```env
# Database
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flatsync_db

# Server
PORT=5000
JWT_SECRET=your_super_secret_jwt_key

# Email (Nodemailer for sending passwords)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Inside `app/frontend/.env`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase Config
NEXT_PUBLIC_FB_API_KEY=your_api_key
NEXT_PUBLIC_FB_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FB_PROJECT_ID=your_project_id
NEXT_PUBLIC_FB_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FB_MESSAGE_SENDER_ID=your_sender_id
NEXT_PUBLIC_FB_APP_ID=your_app_id
NEXT_PUBLIC_FB_MESUREMENT_ID=your_measurement_id
NEXT_PUBLIC_VAPID_KEY=your_fcm_vapid_key
```

### 4. Database Setup & Running Schema
Create a PostgreSQL database matching the name in your backend `.env` (e.g., `flatsync_db`). Then, run the schema file to generate all the necessary tables:
```bash
cd app/backend
node db/schema.js
```

### 5. Running the Servers
You need to start both servers simultaneously in two separate terminal windows.

**Start the Backend Server:**
```bash
cd app/backend
npm start
# or 'node server.js'
```
*The backend API will run on http://localhost:5000*

**Start the Frontend App:**
```bash
cd app/frontend
npm run dev
```
*The frontend web app will run on http://localhost:3000*

---

## How to Test the Project Flow (For Reviewers)

Follow these steps to understand how FlatSync works from start to finish:

### 1. Admin Login
- To log in as an Admin, your email needs to be in the database first.
- Run this SQL query to add yourself as an admin:
  ```sql
  INSERT INTO users (email, full_name, role) VALUES ('your_google_email@gmail.com', 'Admin User', 'ADMIN');
  ```
- Go to `http://localhost:3000/admin/login` and sign in with Google.
- You will now have access to the FlatSync Admin Dashboard.

### 2. Creating a Resident
- Go to the **Users** page in the Admin panel and click **Create User**.
- Enter the resident's name, email, and set the role to `RESIDENT`.
- The FlatSync backend will auto-generate a password, hash it securely, and send an email to the resident with their login details.
- A popup will show you the new **User ID** (UUID). Copy this ID!

### 3. Assigning a Flat
- Go to the **Flats** page in the Admin panel.
- Create a new flat (example: Wing A, Flat 101).
- Paste the **User ID** you copied earlier to map this flat to the resident.

### 4. Resident Login & Dashboard
- The resident can now go to `http://localhost:3000/login`.
- They log in using their email and the password sent to them.
- Once logged in, they will see their FlatSync User Dashboard, showing their flat details and pending maintenance dues.
- If a resident wants to change their password, they can do so in the **Profile** section.

### 5. Generating Bills & Making Payments
- As an Admin, click **Generate Monthly Bills** to create maintenance bills for all flats.
- The resident's dashboard will update to show unpaid dues.
- The resident clicks **Pay Now** to open the FlatSync payment terminal.
- They make a mock payment, and their status updates to "PAID".
- They can immediately download a PDF receipt of their transaction.

### 6. Sending Notifications
- The Admin can go to the **Notifications** page and send a broadcast message to all users.
- FlatSync uses Firebase to send these push notifications instantly.
- If the resident is actively using the app, a popup will appear on their screen.
- They can click **Mark as Read** to clear it from their dashboard.

## Tech Stack
- Frontend: Next.js 14, React
- Backend: Node.js, Express
- Database: PostgreSQL
- Services: Firebase Cloud Messaging, Nodemailer, Passport.js (Google OAuth), PDFKit
