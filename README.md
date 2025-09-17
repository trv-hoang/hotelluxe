# Hotel Management System

Hệ thống quản lý khách sạn toàn diện với React frontend và Laravel backend.

## 🏨 Tính năng chính

### Frontend (React + TypeScript)
- **🎨 Modern UI**: Giao diện admin panel hiện đại với Tailwind CSS
- **👤 User Management**: Quản lý người dùng với phân quyền (admin, manager, user)
- **🏨 Hotel Management**: CRUD operations cho khách sạn với upload ảnh
- **📅 Booking Management**: Quản lý đặt phòng và trạng thái
- **📊 Dashboard Analytics**: Thống kê doanh thu và booking trends
- **⚙️ Settings**: Cấu hình hệ thống và preferences

### Backend (Laravel + MySQL)
- **🔐 Authentication**: JWT authentication với Laravel Sanctum
- **🗃️ Database**: MySQL với migrations và seeders
- **📡 RESTful API**: API endpoints cho tất cả tính năng
- **📋 Validation**: Request validation và error handling
- **🔧 CORS**: Cấu hình CORS cho frontend-backend communication

## 🚀 Công nghệ sử dụng

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- React Router (routing)
- Lucide React (icons)

### Backend
- Laravel 10
- MySQL
- Laravel Sanctum (authentication)
- Eloquent ORM
- Laravel Migrations & Seeders

## 📦 Cài đặt và chạy

### Prerequisites
- Node.js (v16+)
- PHP (v8.1+)
- Composer
- MySQL

### Backend Setup
```bash
cd be-app
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --port=8001
```

### Frontend Setup
```bash
cd fe-app
npm install
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8001
- **Admin Panel**: http://localhost:5173/admin

## 🔑 Login Credentials

### Admin Account
- **Email**: admin@test.com  
- **Password**: password

### Test User Account
- **Email**: user@test.com
- **Password**: password

## 📁 Cấu trúc Project

```
fe-hotel/
├── fe-app/          # React Frontend
│   ├── src/
│   │   ├── components/  # UI Components
│   │   ├── pages/      # Page Components  
│   │   ├── api/        # API Services
│   │   ├── contexts/   # React Contexts
│   │   └── types/      # TypeScript Types
├── be-app/          # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/  # API Controllers
│   │   ├── Models/           # Eloquent Models
│   │   └── Http/Middleware/  # Middleware
│   ├── database/
│   │   ├── migrations/  # Database Migrations
│   │   └── seeders/    # Database Seeders
│   └── routes/         # API Routes
└── README.md
```

## 🎯 Tính năng đã hoàn thành

- ✅ User Authentication & Authorization
- ✅ Hotel CRUD Operations
- ✅ User Management System
- ✅ Booking Management
- ✅ Admin Dashboard
- ✅ Settings Page
- ✅ Database Seeders with sample data
- ✅ CORS Configuration
- ✅ Error Handling & Validation

## 🚧 Tính năng đang phát triển

- [ ] Dashboard Analytics với charts
- [ ] Review Management System  
- [ ] Improved UX/UI với responsive design
- [ ] File upload cho hotel images
- [ ] Email notifications
- [ ] Payment integration

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed by [Your Name]

---

⭐ Nếu project này hữu ích, hãy cho một star nhé!