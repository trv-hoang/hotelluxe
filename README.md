# 🏨 Hotel Luxe Management System

Hệ thống quản lý khách sạn toàn diện với React frontend và Laravel backend, bao gồm tính năng đặt phòng, quản lý khách sạn, thanh toán và quản trị hệ thống.

## ✨ Tính năng chính

### 🖥️ Frontend (React + TypeScript + Vite)
- **🎨 Modern UI/UX**: Giao diện hiện đại với shadcn/ui + Tailwind CSS
- **👤 User Authentication**: Đăng nhập/đăng ký với JWT tokens
- **🏨 Hotel Booking**: Tìm kiếm, lọc và đặt phòng khách sạn
- **�‍💼 Profile Management**: Cập nhật thông tin cá nhân và avatar
- **❤️ Favorites System**: Lưu khách sạn yêu thích
- **� Payment Integration**: Thanh toán qua Stripe và MoMo
- **📱 Responsive Design**: Tối ưu cho mobile và desktop
- **⭐ Review System**: Đánh giá và nhận xét khách sạn

### ⚡ Backend (Laravel 10 + JWT)
- **🔐 JWT Authentication**: Xác thực người dùng với tymon/jwt-auth
- **🏨 Hotel Management**: CRUD operations cho khách sạn và phòng
- **� Booking System**: Quản lý đặt phòng với trạng thái realtime
- **💰 Payment Processing**: Tích hợp Stripe và MoMo payment gateway
- **� Admin Dashboard**: Thống kê doanh thu và quản lý hệ thống
- **� File Upload**: Upload và quản lý hình ảnh khách sạn/avatar
- **🔍 Search & Filter**: Tìm kiếm và lọc khách sạn theo nhiều tiêu chí
- **📧 Email Notifications**: Thông báo booking và cập nhật trạng thái

## �️ Tech Stack

### 🎨 Frontend
- **React 18** với TypeScript
- **Vite** - Build tool và dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Zustand** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### 🔧 Backend
- **Laravel 10** - PHP framework
- **MySQL 8.0** - Relational database
- **JWT (tymon/jwt-auth)** - Authentication
- **Eloquent ORM** - Database ORM
- **Laravel Migrations & Seeders**
- **Stripe PHP SDK** - Payment processing
- **CORS middleware** - Cross-origin resource sharing

### 🌐 APIs & Integrations
- **Stripe API** - Payment processing
- **MoMo Payment Gateway** - Vietnam payment
- **Unsplash API** - Random hotel images
- **RESTful API** - Backend API architecture

## � Cài đặt và khởi chạy

### 📋 Prerequisites
- **Node.js** v18+ và npm/yarn
- **PHP** v8.1+ với extensions: mysqli, pdo, mbstring, openssl
- **Composer** - PHP dependency manager
- **MySQL** v8.0+
- **Git** for version control

### 🔧 Backend Setup (Laravel)
```bash
# Run this
cd be-app
composer install
php artisan serve
```

### 🎨 Frontend Setup (React)
```bash
# Run this
cd fe-app
npm install
npm run dev
```
## 🌐 Application URLs

- **Frontend (Customer)**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/documentation

## 🔑 Default Login Credentials

### 👨‍💼 Admin Account
- **Email**: `admin@hotel.com`
- **Password**: `admin123`
- **Role**: Administrator
- **Access**: Full system management

### 👤 User Account
- **Email**: `user@example.com`
- **Password**: `123456`
- **Role**: Customer
- **Access**: Hotel booking & profile management

> ⚠️ **Security Note**: Đổi mật khẩu mặc định trước khi deploy production!

## 📁 Project Structure

```
hotelluxe/
├── fe-app/                 # 🎨 React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── hotel/      # Hotel-specific components
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin panel pages
│   │   │   └── customer/   # Customer pages
│   │   ├── store/          # Zustand stores
│   │   ├── api/            # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── assets/         # Static assets
│   ├── public/             # Public static files
│   └── package.json        # Frontend dependencies
├── be-app/                 # ⚡ Laravel Backend Application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # API Controllers
│   │   │   ├── Middleware/       # Custom middleware
│   │   │   └── Resources/        # API resources
│   │   ├── Models/               # Eloquent models
│   │   └── Services/             # Business logic services
│   ├── database/
│   │   ├── migrations/           # Database schema migrations
│   │   ├── seeders/              # Sample data seeders
│   │   └── factories/            # Model factories
│   ├── routes/
│   │   ├── api.php               # API routes
│   │   └── web.php               # Web routes
│   ├── config/                   # Configuration files
│   ├── public/                   # Web root & uploaded files
│   │   └── avatars/              # User profile pictures
│   └── storage/                  # File storage & logs
├── README.md                     # 📖 Project documentation
└── .gitignore                    # Git ignore rules
```

## ✅ Tính năng đã hoàn thành

### 🔐 Authentication & Security
- ✅ JWT Authentication với refresh tokens
- ✅ Role-based access control (Admin/Manager/Customer)
- ✅ Password encryption và validation
- ✅ Profile management
- ✅ Session management và logout

### 🏨 Hotel Management
- ✅ Hotel CRUD operations với image upload
- ✅ Hotel categories và amenities management
- ✅ Room availability checking
- ✅ Hotel search với filters (location, price, amenities)
- ✅ Hotel favorites system

### 📅 Booking System
- ✅ Real-time booking với date validation
- ✅ Booking status management (pending/confirmed/cancelled)
- ✅ Guest information management
- ✅ Booking history và tracking
- ✅ Admin booking oversight

### 💳 Payment Integration
- ✅ Stripe payment gateway
- ✅ MoMo payment gateway (Vietnam)
- ✅ Payment status tracking
- ✅ Secure payment processing

### 📊 Admin Dashboard
- ✅ Revenue analytics và statistics
- ✅ User management system
- ✅ Hotel management interface
- ✅ Booking oversight và management
- ✅ System settings và configuration

### 🎨 UI/UX Features
- ✅ Responsive design (mobile-first)
- ✅ Modern UI với shadcn/ui components
- ✅ Loading states và error handling
- ✅ Toast notifications
- ✅ Search và filtering capabilities

## 🚧 Roadmap & Future Enhancements

### 📈 Phase 1 - Analytics & Reporting
- Advanced dashboard analytics với charts
- Revenue reporting và export
- Booking trends analysis
- User activity tracking

### ⭐ Phase 2 - Review System
- Hotel review và rating system
- Review moderation tools
- Review analytics
- Response system cho hotel owners

### 📧 Phase 3 - Communication
- Email notification system
- SMS notifications (Vietnam)
- In-app messaging
- Booking confirmation emails

### 🔧 Phase 4 - Advanced Features
- Multi-language support (Vietnamese/English)
- Advanced search với AI recommendations
- Loyalty program
- Mobile app development
- Integration với third-party booking platforms

## 🔧 API Endpoints

### 🔐 Authentication
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
POST /api/auth/refresh      # Refresh JWT token
GET  /api/auth/profile      # Get user profile
PUT  /api/auth/profile      # Update user profile
```

### 🏨 Hotels
```
GET    /api/hotels          # List hotels with filters
GET    /api/hotels/{id}     # Get hotel details
POST   /api/hotels          # Create hotel (admin only)
PUT    /api/hotels/{id}     # Update hotel (admin only)
DELETE /api/hotels/{id}     # Delete hotel (admin only)
```

### 📅 Bookings
```
GET    /api/bookings        # List user bookings
POST   /api/bookings        # Create new booking
GET    /api/bookings/{id}   # Get booking details
PUT    /api/bookings/{id}   # Update booking status
DELETE /api/bookings/{id}   # Cancel booking
```

### 💳 Payments
```
POST /api/payments/stripe   # Process Stripe payment
POST /api/payments/momo     # Process MoMo payment
GET  /api/payments/{id}     # Get payment status
```

#### JWT Token Issues
```bash
# Regenerate JWT secret
php artisan jwt:secret

# Clear config cache
php artisan config:clear
```

## � Team

**Project Contributors**: Việt Hoàng, Phạm Linh, Đăng Tân, Uyên, Đông Kha  
**Frontend**: React + TypeScript  
**Backend**: Laravel(PHP) + MySQL  

---
⭐ **Nếu project này hữu ích, hãy cho chúng tôi một star trên GitHub!**

🔗 **Demo**: [Live Demo URL] (updating...)  
📖 **Documentation**: [Wiki/Docs URL] (updating...)
