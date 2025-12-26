# auto-check
vehicle valuation and financing services

## Purpose

This project simulates a real-world vehicle-backed loan system,
similar to what is used in fintech and automotive lending platforms.
It demonstrates backend design, security, and business logic handling.

##  Key Design Decisions

- Loans are linked to vehicles instead of valuations to allow valuation updates over time
- Role-based guards are used instead of a separate admin service
- SQLite is used for development simplicity as was instructed

## Tech Stack

- Node.js
- NestJS
- TypeORM
- SQLite (for development)
- JWT Authentication
- bcrypt (password hashing)

# install dependencies
npm install

#  Seeding Data
A seed script is included to populate:
npx ts-node seed.ts

- Vehicles
- Valuations

# start the server
npm run start:dev

# Authentication & Authorization
- User signup and login
- JWT-based authentication
- Role-based access control (user, admin)
- Protected routes using guards

# Vehicles & Valuations
- Seeded vehicle data and valuation
- Each vehicle has one or more valuations(currently using static valuation )
- Public access to all vehicles
- Authenticated access required to view a single vehicle’s valuation

# Users can apply for loans using vehicle valuations
- Loan amount is calculated based on valuation (e.g. 80%)
- Loans are linked to users and vehicles
- Default loan status after application is PENDING
- Admin-only endpoint to view all loan applications