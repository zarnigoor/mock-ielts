# IELTS Mock Test Platform

Bu loyiha IELTS imtihoni uchun onlayn **mock test platformasi** bo‘lib, foydalanuvchilarga test ishlash, natijalarini olish, va administratorlarga savollarni boshqarish imkonini beradi.  
Backend Node.js va Express’da, frontend esa React.js’da yozilgan. Ma’lumotlar bazasi sifatida MongoDB ishlatiladi. Docker yordamida barcha servislar konteynerlarda ishlaydi.

## Texnologiyalar
- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **API Docs:** Swagger
- **Containerization:** Docker & Docker Compose

##  O‘rnatish va ishga tushirish

1. Lokal ishga tushirish
# Reponi klonlash
cd mock-ielts

# Backend
cd backend
npm install
npm run dev

# Frontend
cd web
npm install
npm run dev


### 2. Docker orqali ishga tushirish
docker-compose up --build


Docker konteynerlari ishga tushgandan so'ng:
Swagger docs: http://localhost:5000/api-docs
Backend API: http://localhost:5000
Frontend: http://localhost:3000



## API Endpoints

### User Endpointlar
`GET /questions?limit=10` → Test uchun tasodifiy savollar
`POST /submit` → Javoblarni yuborish va natijani olish

### Admin Endpointlar
`GET /admin/questions` → Barcha savollar
`POST /admin/questions` → Yangi savol qo'shish
`PUT /admin/questions/:id` → Savolni yangilash`DELETE /admin/questions/:id` → Savolni o'chirish

To'liq API hujjati: [Swagger dokumentatsiya](http://localhost:5000/api-docs)


## Muallif
Ism: Zarnigor