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
# Clone repository
git clone [repository-url]
cd hotelluxe/be-app

# Install PHP dependencies
composer install

# Environment setup
cp .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Configure database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotelluxe
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Configure payment gateways
STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET=your_stripe_secret_key
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key

# Run migrations and seed data
php artisan migrate
php artisan db:seed

# Start development server
php artisan serve
```

### 🎨 Frontend Setup (React)
```bash
cd ../fe-app

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local

# Configure API endpoint
VITE_API_BASE_URL=http://localhost:8000/api
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Start development server
npm run dev
```

### 🗄️ Database Setup
```sql
-- Create database
CREATE DATABASE hotelluxe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions (adjust username/password)
GRANT ALL PRIVILEGES ON hotelluxe.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
```

## 🌐 Application URLs

- **Frontend (Customer)**: http://localhost:5174
- **Admin Panel**: http://localhost:5174/admin
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/documentation

## 🔑 Default Login Credentials

### 👨‍💼 Admin Account
- **Email**: `admin@hotelluxe.com`
- **Password**: `admin123456`
- **Role**: Administrator
- **Access**: Full system management

### 🏨 Hotel Manager Account  
- **Email**: `manager@hotelluxe.com`
- **Password**: `manager123456`
- **Role**: Hotel Manager
- **Access**: Hotel & booking management

### 👤 Customer Account
- **Email**: `customer@hotelluxe.com`
- **Password**: `customer123456`
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
- ✅ Profile management với avatar upload
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
- [ ] Advanced dashboard analytics với charts
- [ ] Revenue reporting và export
- [ ] Booking trends analysis
- [ ] User activity tracking

### ⭐ Phase 2 - Review System
- [ ] Hotel review và rating system
- [ ] Review moderation tools
- [ ] Review analytics
- [ ] Response system cho hotel owners

### 📧 Phase 3 - Communication
- [ ] Email notification system
- [ ] SMS notifications (Vietnam)
- [ ] In-app messaging
- [ ] Booking confirmation emails

### 🔧 Phase 4 - Advanced Features
- [ ] Multi-language support (Vietnamese/English)
- [ ] Advanced search với AI recommendations
- [ ] Loyalty program
- [ ] Mobile app development
- [ ] Integration với third-party booking platforms

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

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check MySQL service
brew services start mysql  # macOS
sudo systemctl start mysql # Linux

# Verify database credentials in .env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hotelluxe
```

#### CORS Errors
```bash
# Verify CORS configuration in config/cors.php
'allowed_origins' => ['http://localhost:5174']
```

#### JWT Token Issues
```bash
# Regenerate JWT secret
php artisan jwt:secret

# Clear config cache
php artisan config:clear
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes với proper testing
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Submit Pull Request

### Development Guidelines
- Follow PSR-12 coding standards cho PHP
- Use TypeScript và proper typing cho React
- Write descriptive commit messages
- Add proper documentation cho new features
- Include tests cho critical functionality

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## � Team

**Project Lead**: Việt Hoàng  
**Frontend**: React + TypeScript  
**Backend**: Laravel + MySQL  
**DevOps**: Local Development Setup

## � Support

For support và questions:
- Create an issue on GitHub
- Email: support@hotelluxe.com
- Documentation: Check README và inline comments

---

## 🚀 Production Deployment

### Server Requirements
- **Server**: Ubuntu 20.04+ hoặc CentOS 7+
- **Web Server**: Nginx hoặc Apache
- **PHP**: 8.1+ với required extensions
- **Database**: MySQL 8.0+ hoặc MariaDB 10.4+
- **SSL Certificate**: Let's Encrypt hoặc commercial SSL

### Deployment Steps
```bash
# 1. Clone và setup trên production server
git clone [repository] /var/www/hotelluxe
cd /var/www/hotelluxe

# 2. Backend deployment
cd be-app
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Frontend build
cd ../fe-app
npm ci
npm run build

# 4. Setup web server (Nginx example)
# Configure virtual host pointing to be-app/public
```

---

⭐ **Nếu project này hữu ích, hãy cho chúng tôi một star trên GitHub!**

🔗 **Demo**: [Live Demo URL] (updating...)  
📖 **Documentation**: [Wiki/Docs URL] (updating...)