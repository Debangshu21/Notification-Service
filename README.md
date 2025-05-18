# Notification-Service

A simple Node.js/Express notification service with email and SMS notification support using MongoDB.

---

## Features

- Create users with name, email, and phone number
- Send notifications (email or SMS) to users
- Store notifications with status tracking (`pending`, `sent`, `failed`)
- Retry failed notifications (optional)
- View users and their notifications via API endpoints
- Simple dashboard to view users and notifications (optional)

---

## Assumptions

- MongoDB instance is available and connection URI is provided via environment variable
- Email sending is done via SMTP (e.g., Gmail SMTP)
- SMS sending uses a mock or actual SMS service (needs configuration)
- `.env` file contains all sensitive credentials and is **never pushed** to git
- `.env.example` is provided with placeholder keys for reference

---

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
- npm install express mongoose nodemailer twilio dotenv

3. **Create a .env file**
- Create a .env file in the root directory based on .env.example:
- MONGO_URI=your_mongodb_connection_string
- EMAIL_USER=your_email@example.com
- EMAIL_PASS=your_email_password_or_app_password
- SMS_API_KEY=your_sms_api_key

4. **Run the app locally**
- npm start
- The server will run on http://localhost:3000
