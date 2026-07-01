# OpenJob RESTful API V1
Submission Back-End Fundamental dengan JavaScript — Dicoding

## 📌 Deskripsi Proyek
Repository ini berisi implementasi RESTful API untuk platform job portal bernama OpenJob, dibangun menggunakan Node.js dan Express.js dengan database PostgreSQL. API ini menyediakan fitur autentikasi JWT, manajemen perusahaan, kategori, lowongan pekerjaan, lamaran, dan bookmark.

## 👤 Informasi Pengembang
**Pangeran Clevario Decaesario (103012400148)**
Fakultas Informatika — Telkom University, 2025

## 🛠 Tech Stack
- **Runtime**: Node.js v22
- **Framework**: Express.js v4
- **Database**: PostgreSQL + node-pg-migrate
- **Authentication**: JWT (Access Token + Refresh Token)
- **Validation**: Joi
- **Password Hashing**: bcrypt

## ⚙️ Cara Menjalankan

1. Clone repository
```bash
git clone https://github.com/Decaesario/openjob-api.git
cd openjob-api
```

2. Install dependencies
```bash
npm install
```

3. Buat file `.env` dan isi variabel berikut:
```env
PGUSER=
PGPASSWORD=
PGDATABASE=openjob
PGHOST=localhost
PGPORT=5432
HOST=localhost
PORT=3000
ACCESS_TOKEN_KEY=
REFRESH_TOKEN_KEY=
```

4. Buat database PostgreSQL
```sql
CREATE DATABASE openjob;
```

5. Jalankan migrasi
```bash
npm run migrate
```

6. Jalankan server
```bash
npm run start:dev
```

## 📌 Endpoint API

### Public
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /users | Register user |
| GET | /users/:id | Get user by ID |
| GET | /companies | Get semua company |
| GET | /companies/:id | Get company by ID |
| GET | /categories | Get semua kategori |
| GET | /categories/:id | Get kategori by ID |
| GET | /jobs | Get semua job |
| GET | /jobs/:id | Get job by ID |
| GET | /jobs/company/:companyId | Get job by company |
| GET | /jobs/category/:categoryId | Get job by kategori |
| POST | /authentications | Login |
| PUT | /authentications | Refresh token |

### Protected (Bearer Token)
| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /profile | Get profile user login |
| GET | /profile/applications | Get lamaran saya |
| GET | /profile/bookmarks | Get bookmark saya |
| POST | /companies | Buat company |
| PUT | /companies/:id | Update company |
| DELETE | /companies/:id | Hapus company |
| POST | /categories | Buat kategori |
| PUT | /categories/:id | Update kategori |
| DELETE | /categories/:id | Hapus kategori |
| POST | /jobs | Buat job |
| PUT | /jobs/:id | Update job |
| DELETE | /jobs/:id | Hapus job |
| POST | /applications | Lamar pekerjaan |
| GET | /applications | Get semua lamaran |
| GET | /applications/:id | Get lamaran by ID |
| PUT | /applications/:id | Update status lamaran |
| DELETE | /applications/:id | Hapus lamaran |
| POST | /jobs/:jobId/bookmark | Bookmark job |
| GET | /jobs/:jobId/bookmark/:id | Get bookmark by ID |
| DELETE | /jobs/:jobId/bookmark | Hapus bookmark |
| GET | /bookmarks | Get semua bookmark saya |
| DELETE | /authentications | Logout |

## 🗄 Entity Relationship Diagram
![ERD](ERD-OpenJob-versi-1.png)
