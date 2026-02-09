# Smart Urban Virtual Interactive Digital Helpdesk Assistant (SUVIDHA) - 2026

## Overview
SUVIDHA is a digital helpdesk assistant designed to enhance customer interaction in civic utility offices through an intuitive touch interface. This project aims to streamline service requests and improve user experience in public service environments.

## Project Structure
The project is organized into two main parts: the backend and the frontend.

### Backend
The backend is built using Node.js and TypeScript, providing a RESTful API for the frontend to interact with. It includes:
- **Express.js** for handling HTTP requests.
- **TypeScript** for type safety and better development experience.
- **MongoDB** for data storage (or any other database as per configuration).

### Frontend
The frontend is developed using Angular, offering a responsive and user-friendly interface. Key components include:
- **Kiosk Component**: Manages the kiosk interface for user interactions.
- **Touch Panel Component**: Provides the touch interface for seamless user experience.

## Installation

### Prerequisites
- Node.js (v14 or later)
- Angular CLI (for frontend development)
- MongoDB (or any other database as per your choice)

### Setup Instructions
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/suvidha-2026.git
   cd suvidha-2026
   ```

2. Install backend dependencies:
   ```
   cd src/backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd src/frontend
   npm install
   ```

4. Configure environment variables for the backend (e.g., database connection strings).

5. Start the backend server:
   ```
   cd src/backend
   npm start
   ```

6. Start the frontend application:
   ```
   cd src/frontend
   ng serve
   ```

## Usage
Once both the backend and frontend are running, navigate to `http://localhost:4200` in your web browser to access the application. Users can interact with the touch interface to submit service requests, check ticket statuses, and receive assistance.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Thanks to all contributors and participants of the SUVIDHA - 2026 hackathon.
- Special thanks to the community for their support and feedback.
# suvidha-web

This repository contains the SUVIDHA project — Smart Urban Virtual Interactive Digital Helpdesk Assistant (2026).

## Projects
- `suvidha-2026/` — main project containing backend and frontend source code.

## SUVIDHA (Smart Urban Virtual Interactive Digital Helpdesk Assistant) - 2026

### Overview
SUVIDHA is a digital helpdesk assistant designed to enhance customer interaction in civic utility offices through an intuitive touch interface. This project aims to streamline service requests and improve user experience in public service environments.

### Project Structure
The project is organized into two main parts: the backend and the frontend.

#### Backend
The backend is built using Node.js and TypeScript, providing a RESTful API for the frontend to interact with. It includes:
- **Express.js** for handling HTTP requests.
- **TypeScript** for type safety and better development experience.
- **PostgreSQL** for data storage with connection pooling.
- **JWT Authentication** for secure user sessions.
- **OTP Verification** via Twilio SMS integration.
- **Rate Limiting** to prevent abuse.
- **Data Encryption** for sensitive information.

##### API Endpoints

**Authentication**
- `POST /api/auth/request-otp` - Request OTP for mobile number
  - Body: `{ "mobileNumber": "+1234567890" }`
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
  - Body: `{ "mobileNumber": "+1234567890", "otp": "1234" }`
- `POST /api/auth/resend-otp` - Resend OTP to mobile number
  - Body: `{ "mobileNumber": "+1234567890" }`

**Tickets** (All require JWT authentication via `Authorization: Bearer <token>` header)
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get specific ticket by ID
- `GET /api/tickets/user/:userId` - Get all tickets for a specific user
- `POST /api/tickets` - Create new ticket
  - Body: `{ "title": "...", "description": "...", "category": "billing|technical|general|complaint|request", "priority": "low|medium|high|urgent" }`
- `PUT /api/tickets/:id` - Update ticket
  - Body: `{ "title": "...", "description": "...", "status": "open|in-progress|resolved|closed", "priority": "...", "category": "..." }`
- `DELETE /api/tickets/:id` - Delete ticket

#### Frontend
The frontend is developed using Angular, offering a responsive and user-friendly interface. Key components include:
- **Kiosk Component**: Manages the kiosk interface for user interactions.
- **Touch Panel Component**: Provides the touch interface for seamless user experience.

### Installation
#### Prerequisites
- Node.js (v14 or later recommended)
- Angular CLI (for frontend development)
- PostgreSQL (v12 or later)

#### Setup Instructions
1. Clone the repository (if not already):
	```bash
	git clone https://github.com/shreykumarsingh123/suvidha-web.git
	cd suvidha-web/suvidha-2026
	```

2. **Set up PostgreSQL Database:**
	- Create a new database named `suvidha`
	- Update connection string in `.env` file

3. Install backend dependencies:
	```powershell
	cd src/backend
	npm install
	```

4. **Configure backend environment:**
	```powershell
	cd src/backend
	cp .env.example .env
	# Edit .env file with your PostgreSQL credentials and other settings
	```

5. Install frontend dependencies:
	```powershell
	cd src/frontend
	npm install
	```

6. Start the backend server (development mode):
	```powershell
	cd src/backend
	npm run dev
	```
	
	Or build and run production:
	```powershell
	cd src/backend
	npm run build
	npm start
	```

7. Start the frontend application (Angular dev server):
	```powershell
	cd src/frontend
	npm start
	# or for a static preview
	cd src/frontend/src
	npx http-server -p 4200
	```

### Usage
Once the backend and frontend are running, open `http://localhost:4200` in your browser to view the homepage