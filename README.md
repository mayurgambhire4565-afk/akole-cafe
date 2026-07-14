# Akole Cafe (Coffee Katta)

Akole Cafe is a premium full-stack web application designed for a modern cafe, offering custom ordering, payment simulation, reservations, and admin control panels.

## Project Structure

The project is structured into two main components:

- **/frontend**: A React web application built with TypeScript, Tailwind CSS, Vite, and React Router.
- **/backend**: An Express REST API server built with TypeScript, Prisma ORM, and MySQL.

## Technologies Used

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS, Framer Motion for smooth transitions
- **State Management**: Zustand
- **API Clients**: Axios, React Query (TanStack Query)
- **Icons**: Lucide React, React Icons

### Backend
- **Framework**: Express.js with TypeScript
- **Database ORM**: Prisma with MySQL
- **Authentication**: JWT (JSON Web Tokens) with refresh/access token mechanism, Google OAuth
- **Security**: Helmet, Express Rate Limit, bcrypt password hashing
- **Mailing**: Nodemailer (SMTP Gmail integration)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL database instance

### Backend Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the local system configurations:
   ```env
   PORT=3001
   DATABASE_URL="mysql://username:password@localhost:3306/coffee_katta"
   JWT_ACCESS_SECRET=your_access_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```
4. Run Prisma database migrations:
   ```bash
   npx prisma db push
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Configuration
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173`.
