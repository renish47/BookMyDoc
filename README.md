# BookMyDoc - Doctor Appointment Booking App

Welcome to the **BookMyDoc** repository! This is a full-stack project developed using React, Bootstrap, Node.js, Express, MongoDB, Mongoose, Bcrypt.js, and JSON Web Tokens (JWT). The application provides functionalities for both doctors and patients to book and manage appointments. Below, you'll find detailed information on setting up and running this application.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [ToDo](#todo)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

**BookMyDoc** is a responsive doctor appointment booking app that handles both doctor and patient functionalities. Users can sign up as either a doctor or a patient, create their profiles, and book appointments with available doctors. Doctors need to enter a purchase code to create their profiles. The app includes the following features:

1. User registration as a doctor or patient.
2. Doctor profile creation with a purchase code.
3. Common sign-in page for both doctors and patients.
4. Patient appointment booking with date and time selection.
5. Patient appointment management, including rescheduling and cancellation.
6. Doctor availability setup.
7. Doctor appointment management with remarks and status updates.
8. Session management using JSON Web Tokens (JWT).
9. Responsive design for various screen sizes.

## Features

### 1. User Registration
- Users can sign up as doctors or patients.
- Passwords are securely encrypted and stored in the MongoDB database.

### 2. Doctor Profile
- Doctors need to enter a purchase code (e.g., 1111-2222-3333-4444) to create their profiles.

### 3. Sign-In
- A common sign-in page checks user credentials and redirects them to their respective dashboards.

### 4. Patient Appointment Booking
- Patients can book appointments with available doctors.
- Date picker displays available dates for selected doctors.
- Time slots are shown for selected dates.
- Patients provide required details and book appointments.

### 5. Patient Appointment Management
- Patients can view and manage their booked appointments in their dashboard.
- Options to reschedule or cancel appointments are available.

### 6. Doctor Availability Setup
- Doctors are prompted to enter their availability dates and times during their first sign-in.

### 7. Doctor Appointment Management
- Doctors can check their appointments by selecting dates.
- They can open appointments to view details, add remarks, and mark them as complete.

### 8. Session Management
- JSON Web Tokens (JWT) are used to monitor user sessions.
- Tokens expire, and users are automatically logged out when expired.
- Middleware ensures route protection, redirecting unauthorized users to the login page.

## Tech Stack

- **Frontend:**
  - React
  - Bootstrap

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - Bcrypt.js
  - JSON Web Tokens (JWT)

## Installation

To run this application locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/renish47/BookMyDoc.git
   cd BookMyDoc
   ```

2. Install dependencies for the client and server:

   ```bash
   # Install client-side dependencies
   cd appointment-booking-fe
   npm install

   # Install server-side dependencies
   cd ../appointment-booking-be
   npm install
   ```

3. Create a `.env` file in the `server` directory and configure your environment variables:

   ```env
   PORT=3001
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   ```

4. Start the server:

   ```bash
   # From the 'appointment-booking-be' directory
   npm start
   ```

5. Start the client:

   ```bash
   # From the 'client' directory
   npm start
   ```

Now, the application should be running locally on [http://localhost:3000](http://localhost:3000).

## Usage

1. Sign up as a doctor or a patient.
2. Use the purchase code (1111-2222-3333-4444) for doctor registration (demo purpose only).
3. Sign in with your credentials.
4. Doctors should set their availability to appear in the patient's list.
5. Patients can book appointments with available doctors.
6. Manage appointments in your dashboard.
7. Ensure secure session management with JWT.
8. Enjoy the responsive design on various screen sizes.

## ToDo

1. Implement functionality for doctors to cancel appointments or block specific time slots or dates.
2. Refine the logic for managing dates and time slots on the client and server sides.
