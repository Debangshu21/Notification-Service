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
