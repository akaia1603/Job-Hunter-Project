# TopCV Mobile & Job Hunter API

A comprehensive job-seeking platform featuring a React Native mobile application and a robust Java Spring Boot backend. This project integrates AI-driven job matching, advanced CV building, and an administrative management portal.

## 🏗 System Architecture

The project is divided into two main components:
*   **Backend (Job Hunter API):** Built with Java 21 and Spring Boot 3, utilizing MySQL for data persistence and MinIO for secure file storage.
*   **Frontend (TopCV Mobile):** A cross-platform mobile application developed with React Native, Expo, and TypeScript, utilizing Expo Router for navigation and Zustand for state management.

---

## 🛠 Technology Stack

### Backend
*   **Language:** Java 21
*   **Framework:** Spring Boot 3.2.3
*   **Security:** Spring Security with OAuth2 & JWT
*   **Database:** MySQL
*   **File Storage:** MinIO (S3-compatible)
*   **Documentation:** OpenAPI / Swagger UI
*   **Mail:** Spring Boot Starter Mail (Thymeleaf templates)

### Frontend
*   **Framework:** React Native / Expo (SDK 50)
*   **Navigation:** Expo Router (File-based routing)
*   **State Management:** Zustand
*   **Forms:** React Hook Form
*   **Styling:** Custom Theme System (Vanilla CSS-in-JS)
*   **Tools:** Axios, Day.js, Expo Print (PDF generation)

---

## 🚀 Key Features

*   **AI Match System:** Intelligent job recommendation engine based on user profiles and skills.
*   **Professional CV Builder:** Interactive tool to create, edit, and export CVs to PDF format.
*   **Job Management:** Search, filter, and apply for jobs with real-time status tracking.
*   **Premium Membership:** Badge system and enhanced features for premium users.
*   **Admin Dashboard:** Dedicated portal for managing companies, resumes, and system statistics.
*   **File Handling:** Secure CV upload and management integrated with MinIO storage.
*   **Authentication:** Secure JWT-based authentication flow with token persistence.

---

## 📦 Project Structure

```text
.
├── backend/                # Java Spring Boot API
│   ├── src/main/java/      # Business logic and controllers
│   ├── src/main/resources/ # Configuration and mail templates
│   └── pom.xml             # Maven dependencies
├── frontend/               # React Native Mobile App
│   ├── app/                # Expo Router pages (Screens)
│   ├── components/         # Reusable UI components
│   ├── services/           # API integration layer
│   ├── store/              # Zustand state management
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript definitions
├── docker-compose.yml      # Infrastructure orchestration
└── README.md               # Project documentation
```

---

## 🏁 Getting Started

### Prerequisites
*   Node.js >= 18.x
*   Java JDK 21
*   MySQL 8.x
*   MinIO Server (optional, for local file storage)

### Backend Setup
1.  Navigate to `backend/`
2.  Configure `src/main/resources/application.properties` with your database credentials.
3.  Run the application using Maven:
    ```bash
    ./mvnw spring-boot:run
    ```

### Frontend Setup
1.  Navigate to `frontend/`
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file based on `.env.example` and set `EXPO_PUBLIC_API_URL`.
4.  Start the development server:
    ```bash
    npx expo start
    ```

---

## 🔒 Security & Standards
*   **Authentication:** Stateless JWT authentication.
*   **Validation:** Robust server-side and client-side validation using Spring Validation and React Hook Form.
*   **Type Safety:** Strict TypeScript implementation across the frontend.
*   **Logging:** Centralized logging system for development and production monitoring.

---

## 🤝 Contributing
For contributions, please follow the standard feature-branch workflow:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---

Developed for **TopCV** - *Connecting Talent with Opportunity*
