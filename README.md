# 🏋️‍♂️ Gym Booking Management System

A comprehensive gym management system built with ASP.NET Core backend and Next.js frontend, featuring appointment scheduling, workout course management, AI-powered recommendations, and admin dashboard.

## ✨ Features

### 🎯 Core Features

- **Appointment Management**: Schedule and manage gym appointments
- **Workout Course System**: Create and manage fitness courses with personal trainers
- **User Management**: Customer profiles with height/weight tracking
- **Service Categories**: Yoga, Pilates, Cardio, Gym, Zumba, Fitness, Weight Management
- **AI Recommendations**: Smart course suggestions based on user's BMI
- **Admin Dashboard**: Comprehensive analytics and reporting
- **Real-time Chatbot**: AI-powered customer support

### 🎨 User Interface

- **Responsive Design**: Modern UI with Tailwind CSS
- **Interactive Calendar**: Visual appointment scheduling
- **Course Filtering**: Filter by service categories
- **Real-time Updates**: Dynamic content updates
- **Mobile-Friendly**: Optimized for all devices

### 🔧 Technical Features

- **RESTful API**: Clean, documented API endpoints
- **Database Integration**: PostgreSQL with Entity Framework Core
- **Authentication**: Secure user authentication system
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### Backend

- **Framework**: ASP.NET Core 8.0
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **Authentication**: JWT-based authentication
- **API Documentation**: Swagger/OpenAPI

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Fetch API

### Database

- **Database**: PostgreSQL
- **Data Types**: UUID, JSONB, Timestamp, Decimal
- **Relationships**: Foreign key constraints

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **.NET 8.0 SDK**: [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **PostgreSQL 12+**: [Download here](https://www.postgresql.org/download/)
- **Git**: [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd gym-booking-kts
```

### 2. Database Setup

#### Install PostgreSQL (macOS)

```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create database
psql postgres
CREATE DATABASE gymdb;
\q
```

#### Install PostgreSQL (Windows)

1. Download from [PostgreSQL official website](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Create a database named `gymdb`

#### Install PostgreSQL (Linux)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE gymdb;
\q
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd gym_be

# Restore dependencies
dotnet restore

# Update database connection string in appsettings.json
# Replace "your_connection_string" with your PostgreSQL connection string

# Run database migrations (if using EF Core migrations)
dotnet ef database update

# Start the backend server
dotnet run
```

The backend will be available at: `http://localhost:5231`

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd gym_fe

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 📁 Project Structure

```
gym-booking-kts/
├── gym_be/                          # Backend (.NET Core)
│   ├── Controllers/                 # API Controllers
│   ├── Models/                      # Entities and DTOs
│   ├── Services/                    # Business Logic
│   ├── Repositories/                # Data Access Layer
│   └── Program.cs                   # Application Entry Point
├── gym_fe/                          # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   ├── component/               # React Components
│   │   ├── service/                 # API Services
│   │   ├── context/                 # React Context
│   │   └── type/                    # TypeScript Types
│   └── package.json
└── db/                              # Database Scripts
    └── gymdb.sql                    # Database Schema
```

## 🔧 Configuration

### Backend Configuration

Update `gym_be/gym_be/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=gymdb;Username=your_username;Password=your_password"
  }
}
```

### Frontend Configuration

Update API base URL in `gym_fe/src/service/baseService.ts`:

```typescript
const BASE_URL = "http://localhost:5231";
```

## 📊 API Endpoints

### Core Endpoints

- `GET /api/customer` - Get all customers
- `POST /api/customer` - Create customer
- `PUT /api/customer/{id}` - Update customer
- `GET /api/workout-course` - Get all workout courses
- `POST /api/workout-course` - Create workout course
- `GET /api/appointment` - Get all appointments
- `POST /api/appointment` - Create appointment
- `GET /api/service` - Get all services

### Special Endpoints

- `POST /api/recommendation` - Get AI course recommendations
- `GET /api/dashboard/overview` - Get dashboard overview
- `GET /api/dashboard/revenue-chart` - Get revenue data
- `GET /api/dashboard/appointment-trends` - Get appointment trends

## 🎯 Usage

### For Users

1. **Register/Login**: Create an account or sign in
2. **Update Profile**: Add your height and weight for personalized recommendations
3. **Browse Courses**: View available workout courses
4. **Get Recommendations**: See AI-suggested courses based on your BMI
5. **Book Appointments**: Schedule sessions with personal trainers
6. **View Schedule**: Check your upcoming appointments

### For Admins

1. **Dashboard**: View system overview and analytics
2. **Manage Courses**: Create and edit workout courses
3. **Manage Appointments**: Handle appointment scheduling
4. **User Management**: Manage customer accounts
5. **Service Management**: Configure service categories

## 🤖 AI Features

### Course Recommendations

The system uses a rule-based AI system to recommend courses based on:

- **BMI Calculation**: Using height and weight
- **Service Categories**: Matching user needs with appropriate services
- **Personalization**: Tailored suggestions for each user

### Chatbot

- **Real-time Support**: Instant customer assistance
- **Dynamic Responses**: Based on current system data
- **Multi-language Support**: Vietnamese and English

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

```bash
# Database connection error
# Check your connection string in appsettings.json

# Port already in use
# Change port in launchSettings.json or kill existing process

# Missing dependencies
dotnet restore
```

#### Frontend Issues

```bash
# Node modules missing
npm install

# Port already in use
# Change port in package.json or kill existing process

# Build errors
npm run build
```

#### Database Issues

```bash
# Connection refused
# Ensure PostgreSQL is running

# Permission denied
# Check database user permissions

# Table not found
# Run database scripts in db/gymdb.sql
```

## 📝 Development

### Adding New Features

1. **Backend**: Add controllers, services, and models
2. **Frontend**: Create components and services
3. **Database**: Update schema if needed
4. **Testing**: Test both API and UI

### Code Style

- **Backend**: Follow C# conventions
- **Frontend**: Use TypeScript and ESLint rules
- **Database**: Use snake_case for table/column names

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.




## 🔄 Version History

- **v1.0.0**: Initial release with core features
- **v1.1.0**: Added AI recommendations
- **v1.2.0**: Enhanced admin dashboard
- **v1.3.0**: Improved UI/UX and chatbot integration

---

