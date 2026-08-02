# HomeHaven

HomeHaven is a modern full stack real estate portal built with Node.js, Express.js, MongoDB, JWT, bcrypt, and Multer.

## Features
- Responsive modern UI with a real estate theme
- Property listings, property detail pages and search filters
- User authentication and JWT-based protected routes
- Favourite properties per user
- Contact owner enquiries stored in the database
- Admin panel to manage properties, enquiries, and users

## Project Structure
- client/ — frontend HTML, CSS, and JavaScript
- server/ — backend API and database models

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Create a .env file using .env.example
3. Start MongoDB locally or update MONGO_URI in .env
4. Run the app
   ```bash
   npm run dev
   ```

## Default Admin
- Email: admin@homehaven.com
- Password: admin123

## API Overview
- Auth: /api/auth/register, /api/auth/login, /api/auth/me
- Properties: /api/properties
- Favourites: /api/favourites
- Enquiries: /api/enquiries
- Admin: /api/admin/login, /api/admin/dashboard
