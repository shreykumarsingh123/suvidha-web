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
- **MongoDB** for data storage (or any other database as per configuration).

#### Frontend
The frontend is developed using Angular, offering a responsive and user-friendly interface. Key components include:
- **Kiosk Component**: Manages the kiosk interface for user interactions.
- **Touch Panel Component**: Provides the touch interface for seamless user experience.

### Installation
#### Prerequisites
- Node.js (v14 or later recommended)
- Angular CLI (for frontend development)
- MongoDB (or any other database as per your choice)

#### Setup Instructions
1. Clone the repository (if not already):
	```bash
	git clone https://github.com/yourusername/suvidha-web.git
	cd suvidha-web/suvidha-2026
	```

2. Install root (project) dependencies if present:
	```powershell
	cd "C:\Users\shrey\OneDrive\Desktop\suvidha app\suvidha-web\suvidha-2026"
	npm install
	```

3. Install backend dependencies:
	```powershell
	cd src/backend
	npm install
	```

4. Install frontend dependencies:
	```powershell
	cd src/frontend
	npm install
	```

5. Configure environment variables for the backend (e.g., `.env` with DB connection string).

6. Start the backend server (build then run):
	```powershell
	cd src/backend
	npm run build
	node dist/app.js
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
Once the backend and frontend are running, open `http://localhost:4200` in your browser to view the homepage.

### Contributing
Contributions are welcome. Please open issues or submit pull requests for enhancements and fixes.

### License
This project is licensed under the MIT License.

---
Merged content from `suvidha-2026/README.md` into this top-level README for convenience.