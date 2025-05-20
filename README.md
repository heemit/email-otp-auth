# Email OTP Authentication System

A secure authentication system using email-based One-Time Passwords (OTP) for login. Built with **Next.js (frontend)**, **Express.js (backend)**, and **Supabase (database)**, this project eliminates the need for passwords by verifying users through a 6-digit OTP sent to their email.

---

## Features

* OTP-based authentication via email
* Resend OTP with countdown timer
* OTP expiry and validation (5-minute window)
* JWT-based session handling
* Full-stack architecture using Next.js & Express
* Supabase for session and profile storage
* Responsive UI built with React and Tailwind CSS

---

## Tech Stack

* **Frontend**: Next.js, React, Tailwind CSS
* **Backend**: Express.js, Node.js
* **Database**: Supabase (PostgreSQL)
* **Email Service**: Nodemailer with App Password
* **Authentication**: OTP + JWT

---

## Setup Instructions

### 1. Clone the Repository

Clone this repo to your local machine:

```bash
git clone https://github.com/your-username/email-otp-auth.git
```

### 2. Install Dependencies

Navigate to the project folder and install the required dependencies for both the frontend and backend:

```bash
# Install backend dependencies
cd otp-auth-backend
npm install

# Install frontend dependencies
cd ../otp-auth-frontend
npm install
```

### 3. Create `.env` Files

In both the **frontend** and **backend** directories, create `.env` files with the following environment variables:

#### Backend `.env`

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

### 4. Set Up Supabase

1. Go to [Supabase](https://supabase.io/) and create a new project.
2. Set up the tables `sessions` and `profiles` in Supabase based on your project needs.
3. Get your Supabase URL and Key from the project settings and add them to your `.env` file.

### 5. Running the Application

Start both the backend and frontend servers:

```bash
# In the backend directory
cd otp-auth-backend
npm start

# In the frontend directory
cd otp-auth-frontend
npm run dev
```

Your app should now be running on `http://localhost:3000`.

### 6. Test OTP Authentication

* Open the app in your browser, enter an email, and receive an OTP to log in.
* The app will authenticate the user and create a JWT token for further access.

---
