# Service Booking Platform

A full-stack web application designed to connect service providers with customers, allowing for easy browsing, booking, and management of appointments. This project was developed as part of a student internship program at **symphony.is**, demonstrating a complete development lifecycle from concept to a functional application.

## Key Features

-   **Role-Based Access Control:** Three distinct user roles (USER, TENANT/Provider, ADMIN) with different permissions, secured by Spring Security.
-   **JWT Authentication:** Secure stateless authentication using JSON Web Tokens.
-   **Service Management:** Tenants can create, update, and delete their services, including details like price, category, and duration.
-   **Dynamic Availability:** The system automatically generates available time slots based on the service's specific duration and the provider's working hours.
-   **Booking System:** Registered users can browse services by category or provider and book available time slots.
-   **Admin Dashboard:** A dedicated panel for administrators to manage users (lock/unlock, delete) and service categories.
-   **Google OAuth2 Login:** In addition to standard registration, users can sign up and log in using their Google account.

## Tech Stack

**Backend:**
-   Java 17
-   Spring Boot 3
-   Spring Security & JWT
-   Spring Data JPA
-   Maven
-   MySQL

**Frontend:**
-   React
-   Vite
-   Material-UI
-   React Router
-   Axios
-   Zod (for form validation)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need the following software installed on your machine:
-   [Git](https://git-scm.com/)
-   **Java Development Kit (JDK) 17** or later
-   [Apache Maven](https://maven.apache.org/download.cgi)
-   **Node.js 18** or later (which includes npm)
-   A running **MySQL Server** instance

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/slavi1337/service-booking-platform.git
    cd service-booking-platform
    ```

2.  **Configure the Backend:**
    -   Navigate to the `backend` directory.
    -   Open the `src/main/resources/application.properties` file.
    -   Update the `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` properties to match your local MySQL database configuration. Make sure you have created the database schema.
    -   Ensure you have a valid JWT secret key set for `application.security.jwt.secret-key`.

3.  **Configure the Frontend:**
    -   Navigate to the `frontend` directory.
    -   Verify that the `API_BASE_URL` in your API client (e.g., `src/api.js`) points to the backend server. For local development, this should be `http://localhost:8080/api`.

    ```javascript
    // Example in frontend/src/api.js
    const API_BASE_URL = 'http://localhost:8080/api';
    ```

### Running the Application

You will need to run the backend and frontend in separate terminals.

#### 1. Run the Backend (Spring Boot)

-   Open a terminal and navigate to the `backend` directory.
-   Run the application using the Maven wrapper:

    ```bash
    ./mvnw spring-boot:run
    ```
-   The backend API will be available at `http://localhost:8080`.

#### 2. Run the Frontend (React)

-   Open a **new** terminal and navigate to the `frontend` directory.
-   Install the dependencies:

    ```bash
    npm install
    ```
-   Start the development server:

    ```bash
    npm run dev
    ```
-   The frontend will be available at `http://localhost:5173`.

Once both are running, you can open your browser and navigate to the frontend URL to use the application.

## Screenshots
![Login](https://github.com/user-attachments/assets/1c49f070-793b-4402-b339-4b139f588e4c)
![Registration](https://github.com/user-attachments/assets/bb315dff-4063-4aef-b143-d31ac8302a6f)
![TenantRegistration](https://github.com/user-attachments/assets/25924669-0d68-49a8-b313-9505d60454e9)
![EmailVerif](https://github.com/user-attachments/assets/70fa011b-3c22-434b-ac14-7a003840ab8b)
![MyServices](https://github.com/user-attachments/assets/a8cdbcd1-6884-453c-868b-ff3648d46d56)
![Services](https://github.com/user-attachments/assets/5bc25f7b-ee36-42d0-9e39-fb4ce22b748f)
![Booking](https://github.com/user-attachments/assets/6e14213b-4d6a-41b6-bcb0-9280663f1ff3)
![MyBookings](https://github.com/user-attachments/assets/515aeee7-a379-4b08-96cc-9f0e8cb5bcac)
![ManageBookings](https://github.com/user-attachments/assets/e8254a0a-1d4d-4ae0-8350-cf159fec991a)



