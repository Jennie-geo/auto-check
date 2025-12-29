# auto-check
vehicle Valuation & Financing Service (Backend API)

## Purpose

This project simulates a real-world vehicle-backed loan system similar to what is used in automotive fintech platforms like Autochek.

## The system allows:
- Vehicle data ingestion using VIN
- Real-time vehicle valuation via a third-party API (RapidAPI VIN lookup)
- Cash loan applications backed by vehicle value
- Loan eligibility checks and lifecycle management

##  Key Design Decisions

- Vehicles are identified by VIN first and enriched later with valuation and metadata
- Valuations are stored separately to allow multiple valuation records over time
- Loan applications reference the latest valuation at the time of application
- Vehicle valuation is fetched on demand from RapidAPI and persisted
- SQLite is used for simplicity, as instructed

## Tech Stack

- Node.js
- NestJS
- TypeORM
- SQLite (for development)
- JWT Authentication
- Bcrypt (password hashing)
- RapidAPI (VIN Lookup / Valuation)

# install dependencies
npm install

#  Seeding Data
  A seed script is included to populate:
- npx ts-node seed.ts

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
- Vehicles are created or seeded using VIN
- Valuations are retrieved dynamically from RapidAPI
- Retrieved valuation data is saved in the database

A vehicle can have multiple valuation records over time, but last one is retrieve during valuation

# Access rules:
Public access to list vehicles
Authenticated users can request vehicle valuation when retrieving single vehicle

# Users can apply for loans using vehicle valuations
- Users apply for cash loans backed by vehicle value
- Users submit a requestedAmount
- Loan eligibility is determined using the latest vehicle valuation
- Basic eligibility rule:
- Loan amount must not exceed 80% of the vehicle’s trade-in value
- Loan status defaults to PENDING
- Admin-only endpoint to view all loan applications