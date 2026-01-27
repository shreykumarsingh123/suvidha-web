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