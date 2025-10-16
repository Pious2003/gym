# 🏗️ Gym Booking System - Mermaid Architecture Diagram

## 📊 System Architecture Overview

```mermaid
graph TB
    %% Styling
    classDef clientLayer fill:#E8F4FD,stroke:#2E86AB,stroke-width:2px,color:#2E86AB
    classDef serverLayer fill:#FFF2E6,stroke:#E65100,stroke-width:2px,color:#E65100
    classDef dbLayer fill:#E6F7FF,stroke:#0066CC,stroke-width:2px,color:#0066CC
    classDef userPages fill:#FFE6E6,stroke:#FF6B6B,stroke-width:2px,color:#8B0000
    classDef adminPages fill:#E6F3FF,stroke:#4DABF7,stroke-width:2px,color:#1E3A8A
    classDef components fill:#E6FFE6,stroke:#51CF66,stroke-width:2px,color:#2B8A3E
    classDef services fill:#FFF3E0,stroke:#FFB74D,stroke-width:2px,color:#E65100
    classDef controllers fill:#FFE6E6,stroke:#FF6B6B,stroke-width:2px,color:#8B0000
    classDef businessServices fill:#E6F3FF,stroke:#4DABF7,stroke-width:2px,color:#1E3A8A
    classDef repositories fill:#E6FFE6,stroke:#51CF66,stroke-width:2px,color:#2B8A3E
    classDef models fill:#FFF3E0,stroke:#FFB74D,stroke-width:2px,color:#E65100
    classDef middleware fill:#F3E5F5,stroke:#BA68C8,stroke-width:2px,color:#7B1FA2
    classDef coreTables fill:#FFE6E6,stroke:#FF6B6B,stroke-width:2px,color:#8B0000
    classDef businessTables fill:#E6F3FF,stroke:#4DABF7,stroke-width:2px,color:#1E3A8A
    classDef junctionTables fill:#E6FFE6,stroke:#51CF66,stroke-width:2px,color:#2B8A3E
    classDef supportTables fill:#FFF3E0,stroke:#FFB74D,stroke-width:2px,color:#E65100

    %% Main Title
    title["🏗️ Gym Booking Management System"]
    
    %% CLIENT LAYER
    clientLayer["CLIENT LAYER (Frontend)"]:::clientLayer
    clientTech["Next.js 14 + TypeScript + Tailwind CSS"]
    
    %% Frontend Components
    userPages["User Pages<br/>• /auth/login<br/>• /auth/register<br/>• /user/profile<br/>• /user/cart<br/>• /user/appointments"]:::userPages
    
    adminPages["Admin Pages<br/>• /admin/dashboard<br/>• /admin/users<br/>• /admin/courses<br/>• /admin/services<br/>• /admin/schedule"]:::adminPages
    
    components["UI Components<br/>• Forms & Modals<br/>• Tables & Charts<br/>• Navigation<br/>• Calendar<br/>• Chatbot Widget"]:::components
    
    apiServices["API Services<br/>• authService<br/>• customerService<br/>• appointmentService<br/>• paymentService<br/>• baseService"]:::services
    
    userContext["UserContext (State Management)<br/>• User authentication state<br/>• Global user data<br/>• Session management<br/>• Protected routes"]:::middleware
    
    %% HTTP Connection
    httpConn["HTTP Requests/Responses (RESTful API)"]
    
    %% SERVER LAYER
    serverLayer["APPLICATION SERVER LAYER (Backend)"]:::serverLayer
    serverTech["ASP.NET Core 8.0 + Entity Framework Core"]
    
    %% Backend Components
    controllers["API Controllers<br/>• AuthController<br/>• CustomerController<br/>• AppointmentController<br/>• WorkoutCourseController<br/>• ServiceController<br/>• PaymentController<br/>• DashboardController<br/>• ScheduleController"]:::controllers
    
    businessServices["Business Services<br/>• CustomerService<br/>• AppointmentService<br/>• PaymentService<br/>• WorkoutCourseService<br/>• ServiceService<br/>• ScheduleService<br/>• RecommendationService<br/>• DashboardService"]:::businessServices
    
    repositories["Data Repositories<br/>• CustomerRepository<br/>• AppointmentRepository<br/>• ServiceRepository<br/>• WorkoutCourseRepository<br/>• PaymentRepository<br/>• ScheduleRepository<br/>• DashboardRepository"]:::repositories
    
    models["Data Models<br/>• Customer (Entity)<br/>• Appointment (Entity)<br/>• WorkoutCourse (Entity)<br/>• Service (Entity)<br/>• Payment (Entity)<br/>• Schedule (Entity)<br/>• DTOs & Context"]:::models
    
    diContainer["Dependency Injection Container<br/>• ServiceCollectionExtensions<br/>• Auto-registration of services<br/>• Interface-to-implementation mapping<br/>• Service lifetime management"]:::middleware
    
    middlewarePipeline["Middleware Pipeline<br/>• CORS Policy (AllowAll)<br/>• Swagger/OpenAPI Documentation<br/>• Authentication & Authorization<br/>• Error Handling & Logging"]:::middleware
    
    %% EF Core Connection
    efConn["Entity Framework Core Database Queries"]
    
    %% DATABASE LAYER
    dbLayer["DATABASE SERVER LAYER"]:::dbLayer
    dbTech["PostgreSQL Database"]
    
    %% Database Tables
    coreTables["Core Tables<br/>• customer<br/>• service<br/>• schedule<br/>• payment_detail"]:::coreTables
    
    businessTables["Business Tables<br/>• appointment<br/>• workoutcourse<br/>• payment<br/>• invoice"]:::businessTables
    
    junctionTables["Junction Tables<br/>• pt_course<br/>• appointment_service<br/>• qr_booking<br/>• pt"]:::junctionTables
    
    supportTables["Support Tables<br/>• status<br/>• staff<br/>• recommendation<br/>• schedule"]:::supportTables
    
    %% Connections
    title --> clientLayer
    clientLayer --> clientTech
    clientTech --> userPages
    clientTech --> adminPages
    clientTech --> components
    clientTech --> apiServices
    clientTech --> userContext
    
    userContext --> httpConn
    httpConn --> serverLayer
    
    serverLayer --> serverTech
    serverTech --> controllers
    serverTech --> businessServices
    serverTech --> repositories
    serverTech --> models
    serverTech --> diContainer
    serverTech --> middlewarePipeline
    
    middlewarePipeline --> efConn
    efConn --> dbLayer
    
    dbLayer --> dbTech
    dbTech --> coreTables
    dbTech --> businessTables
    dbTech --> junctionTables
    dbTech --> supportTables
```

## 🔄 Data Flow Diagram

```mermaid
sequenceDiagram
    participant Client as Frontend (Next.js)
    participant Controller as API Controller
    participant Service as Business Service
    participant Repository as Data Repository
    participant EF as Entity Framework
    participant DB as PostgreSQL Database
    
    Note over Client,DB: Authentication Flow
    Client->>Controller: POST /api/auth/login
    Controller->>Service: AuthenticateUser(credentials)
    Service->>Repository: GetUserByEmail(email)
    Repository->>EF: Query Customer table
    EF->>DB: SELECT * FROM customer WHERE email = @email
    DB-->>EF: User data
    EF-->>Repository: Customer entity
    Repository-->>Service: Customer object
    Service->>Service: Validate password & generate JWT
    Service-->>Controller: JWT token + user data
    Controller-->>Client: 200 OK + JWT token
    
    Note over Client,DB: Appointment Booking Flow
    Client->>Controller: POST /api/appointment
    Controller->>Service: CreateAppointment(appointmentDto)
    Service->>Service: Validate appointment data
    Service->>Repository: CheckScheduleAvailability()
    Repository->>EF: Query Schedule table
    EF->>DB: SELECT * FROM schedule WHERE date = @date
    DB-->>EF: Available slots
    EF-->>Repository: Schedule entities
    Repository-->>Service: Availability status
    Service->>Repository: SaveAppointment(appointment)
    Repository->>EF: Insert into Appointment table
    EF->>DB: INSERT INTO appointment VALUES (...)
    DB-->>EF: Success confirmation
    EF-->>Repository: Appointment entity
    Repository-->>Service: Created appointment
    Service-->>Controller: AppointmentDto
    Controller-->>Client: 201 Created + appointment data
    
    Note over Client,DB: Course Recommendation Flow
    Client->>Controller: POST /api/recommendation
    Controller->>Service: GetRecommendations(customerId)
    Service->>Repository: GetCustomerProfile(customerId)
    Repository->>EF: Query Customer table
    EF->>DB: SELECT * FROM customer WHERE customerid = @id
    DB-->>EF: Customer data with height/weight
    EF-->>Repository: Customer entity
    Repository-->>Service: Customer profile
    Service->>Service: Calculate BMI & generate recommendations
    Service->>Repository: GetRecommendedCourses(bmi, goals)
    Repository->>EF: Query WorkoutCourse table with filters
    EF->>DB: SELECT * FROM workoutcourse WHERE serviceid IN (...)
    DB-->>EF: Matching courses
    EF-->>Repository: WorkoutCourse entities
    Repository-->>Service: Recommended courses
    Service-->>Controller: RecommendationDto[]
    Controller-->>Client: 200 OK + recommendations
```

## 🏛️ Component Relationship Diagram

```mermaid
graph LR
    %% Frontend Components
    subgraph Frontend ["Frontend Layer"]
        UI[UI Components]
        Pages[Pages]
        Services[API Services]
        Context[UserContext]
    end
    
    %% Backend Components
    subgraph Backend ["Backend Layer"]
        Controllers[Controllers]
        BusinessServices[Business Services]
        Repositories[Repositories]
        Models[Models]
    end
    
    %% Database Components
    subgraph Database ["Database Layer"]
        CoreTables[Core Tables]
        BusinessTables[Business Tables]
        JunctionTables[Junction Tables]
        SupportTables[Support Tables]
    end
    
    %% Frontend Relationships
    Pages --> UI
    Pages --> Services
    Services --> Context
    UI --> Context
    
    %% Frontend to Backend
    Services -.->|HTTP Requests| Controllers
    
    %% Backend Relationships
    Controllers --> BusinessServices
    BusinessServices --> Repositories
    Repositories --> Models
    
    %% Backend to Database
    Models -.->|EF Core Queries| CoreTables
    Models -.->|EF Core Queries| BusinessTables
    Models -.->|EF Core Queries| JunctionTables
    Models -.->|EF Core Queries| SupportTables
    
    %% Database Relationships
    CoreTables --> BusinessTables
    BusinessTables --> JunctionTables
    JunctionTables --> SupportTables
    
    %% Styling
    classDef frontend fill:#E8F4FD,stroke:#2E86AB,stroke-width:2px
    classDef backend fill:#FFF2E6,stroke:#E65100,stroke-width:2px
    classDef database fill:#E6F7FF,stroke:#0066CC,stroke-width:2px
    
    class Frontend frontend
    class Backend backend
    class Database database
```

## 🎯 Key Integration Points

```mermaid
graph TD
    %% Authentication Integration
    subgraph Auth ["Authentication Integration"]
        Login[Login Form] --> AuthController[AuthController]
        AuthController --> CustomerService[CustomerService]
        CustomerService --> JWT[JWT Token Generation]
        JWT --> UserContext[UserContext Update]
    end
    
    %% Booking Integration
    subgraph Booking ["Appointment Booking Integration"]
        BookingForm[Booking Form] --> AppointmentController[AppointmentController]
        AppointmentController --> AppointmentService[AppointmentService]
        AppointmentService --> ScheduleValidation[Schedule Validation]
        ScheduleValidation --> PaymentProcessing[Payment Processing]
    end
    
    %% Recommendation Integration
    subgraph Recommendation ["Course Recommendation Integration"]
        UserProfile[User Profile] --> RecommendationController[RecommendationController]
        RecommendationController --> RecommendationService[RecommendationService]
        RecommendationService --> BMICalculation[BMI Calculation]
        BMICalculation --> CourseMatching[Course Matching Algorithm]
    end
    
    %% Payment Integration
    subgraph Payment ["Payment Processing Integration"]
        PaymentForm[Payment Form] --> PaymentController[PaymentController]
        PaymentController --> PaymentService[PaymentService]
        PaymentService --> TransactionRecording[Transaction Recording]
        TransactionRecording --> InvoiceGeneration[Invoice Generation]
    end
    
    %% Styling
    classDef auth fill:#FFE6E6,stroke:#FF6B6B,stroke-width:2px
    classDef booking fill:#E6F3FF,stroke:#4DABF7,stroke-width:2px
    classDef recommendation fill:#E6FFE6,stroke:#51CF66,stroke-width:2px
    classDef payment fill:#FFF3E0,stroke:#FFB74D,stroke-width:2px
    
    class Auth auth
    class Booking booking
    class Recommendation recommendation
    class Payment payment
```

## 📊 System Benefits Visualization

```mermaid
mindmap
  root((Gym Booking System))
    Architecture Benefits
      Separation of Concerns
        Clear layer boundaries
        Modular design
        Independent scaling
      Scalability
        Horizontal scaling
        Load balancing
        Performance optimization
      Maintainability
        Clean code structure
        Easy debugging
        Simple updates
      Technology Flexibility
        Frontend framework swap
        Backend framework swap
        Database migration
      Security
        JWT authentication
        CORS policies
        Input validation
      Performance
        Optimized queries
        Caching strategies
        Response optimization
    Integration Benefits
      RESTful API
        Standardized communication
        Stateless operations
        Resource-based URLs
      Type Safety
        TypeScript frontend
        C# backend
        Compile-time checking
      Database Integrity
        Foreign key constraints
        Data validation
        ACID properties
      Error Handling
        Comprehensive logging
        Graceful degradation
        User-friendly messages
      Real-time Features
        Chatbot integration
        Dynamic updates
        Live notifications
      AI Integration
        Smart recommendations
        Automated suggestions
        Pattern recognition
``` 