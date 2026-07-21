# Sales CRM

Sales CRM is a modern Customer Relationship Management application built to help you manage your tasks, notes, and projects anytime, anywhere—keeping everything flowing in one place.

## Features
- **Premium UI/UX:** A highly professional, responsive light theme with sleek micro-animations, built with React and Vite.
- **Secure Authentication:** Robust backend security powered by Spring Security, featuring integrations for Google, Facebook, and Microsoft logins.
- **Seamless Full-Stack Build:** Integrated Maven workflow that automatically installs Node/npm, builds the frontend, and packages it with the Spring Boot backend.
- **Database Ready:** Configured for robust PostgreSQL data storage.

## Tech Stack
- **Backend:** Java, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL
- **Frontend:** React, React Router, Vite, Vanilla CSS (Custom Design System), Lucide React
- **Build Tool:** Maven (with `frontend-maven-plugin`)

## How to Run Locally

### Prerequisites
- Java 17+
- PostgreSQL (running on `localhost:5432` with default credentials or updated in `application.properties`)

### Running the Application
Since this project uses the `frontend-maven-plugin`, you don't need to manually run `npm install` or `npm run build`. Maven handles the entire full-stack build process!

1. Clone the repository.
2. Open a terminal in the root directory.
3. Run the following command:
   ```bash
   ./mvnw clean compile spring-boot:run
   ```
4. Once the server starts, navigate to `http://localhost:8080/` in your browser.

## Development Mode (Frontend Hot-Reloading)
If you are actively developing the frontend and want instant hot-reloading:
1. Open a new terminal in the `frontend` directory.
2. Run `npm install` (if not already installed).
3. Run `npm run dev`.
4. Open the provided localhost URL (typically `http://localhost:5173/`).
