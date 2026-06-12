# Welcome to My Api
***

## Task
The challenge was to build a production-ready, highly secure, and optimized REST API capable of serving and managing the massive lore of the A Song of Ice and Fire (ASOIAF) universe.

The core engineering hurdles included:

Performance Optimization: Preventing database bottlenecks during heavy query traffic.

Stateful vs. Stateless Auth: Implementing a multi-strategy authentication system (Traditional JWT + Google OAuth 2.0) while keeping the API entirely stateless.

Resilience & Fault Tolerance: Designing a caching mechanism that degrades gracefully without crashing the entire app if the caching layer goes offline.

## Description
This problem was solved by building a decoupled, modern backend using Node.js and Express, engineered with architectural resilience at its core.

Data Persistence: Modeled data relationships using Prisma ORM coupled with a PostgreSQL database for strict relational integrity.

Hybrid Caching & Graceful Degradation: Integrated a Redis caching layer for character pagination routes. The system utilizes global status checks to automatically switch to direct database queries if Redis encounters a connection issue, ensuring zero downtime.

Secure Authentication: Built custom authentication middleware utilizing JSON Web Tokens (JWT) for access control, alongside Passport.js for handling Google OAuth 2.0 handshakes.

Interactive Documentation: Embedded a Swagger UI (/api-docs) engine directly into the application framework for real-time browser testing.

## Installation
Follow these steps to set up and run the development environment locally:

1. Clone the repository and install dependencies:

```bash
git clone <your-repository-url>
cd asoiaf-api
npm install
```
2. Configure environment variables:
Create a `.env` file like the `env.example` provided in the root directory and add your credentials


3. Sync the database schema:

```bash
npx prisma db push
```

## Usage
To boot up the local development server with automatic file reloading:

```bash
npm run dev
```

Alternatively, to run the server in a standard production environment:

```bash
npm start
```

Accessing the API Docs
Once the server is running, you can interact with every single endpoint (including character search and automated pagination loops) via the interactive UI or via your shared testing environments:

Swagger Documentation Interface: Open http://localhost:3000/api-docs in your browser.

Postman Interactive Workspace: Use your generated documentation token-injection environment link to test authorization flows natively: Open https://documenter.getpostman.com/view/52972366/2sBXwsMAo7 in you browser

### The Core Team

azizova_n

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
