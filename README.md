# Nama Project

Aplikasi web fullstack PERN Stack (PostgreSQL, Express, React, Node) dengan fitur CRUD, soft delete, dan autentikasi JWT.

## Fitur Utama
- Autentikasi User (Register/Login dengan JWT)
- Operasi CRUD lengkap
- Soft Delete system
- UI Responsif dengan Remixicon
- Notifikasi menggunakan SweetAlert2

## Teknologi
**Frontend:**
- React.js
- Remixicon
- SweetAlert2
- Fetch API
- React Router
- react-hook-form
- react-icons

**Backend:**
- Express.js
- PostgreSQL + Sequelize
- JWT
- CORS
- Bcryptjs
- Dotenv

## Instalasi
```bash
#1. Clone repo:
git clone https://github.com/davidbayu1805/Final-Task.git
cd Final-Task

#2. Setup Database:
export file database

#3. backend
cd backend
npm install
npm install express sequelize pg cors bcryptjs jsonwebtoken dotenv cookie-parser

create file .env
DB_HOST=localhost
DB_USER=postgres_user
DB_PASSWORD=postgres_password
DB_NAME=your_db_name
DB_PORT=5432
JWT_SECRET=your_jwt_secret
PORT=5000

jalankan backend 
npm run dev

#4. frontend
cd ../frontend
npm install
npm install remixicon sweetalert2 react-hook-form react-icons react-router-dom
npm run dev
