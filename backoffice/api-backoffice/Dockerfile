# -----------------------------[DEV] Dockerfile สำหรับ API Backoffice
# FROM node:20

# # ตั้ง working directory
# WORKDIR /app

# # คัดลอก package.json และ package-lock.json
# COPY package*.json ./

# # ติดตั้ง dependencies
# RUN npm install

# # คัดลอก prisma directory
# COPY prisma ./prisma

# # Generate Prisma client
# RUN npx prisma generate

# # คัดลอก source code
# COPY . .

# # ตั้งค่า environment variables
# ENV DATABASE_URL="postgresql://postgres:1234@db:5432/samrueduu"

# # ตั้งค่า port ที่จะใช้
# EXPOSE 3001

# # รอ database พร้อมก่อน แล้วรัน migrate + start server
# CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]




# -----------------------------[PRODUCTION] Dockerfile สำหรับ API Backoffice
FROM node:20

# ตั้ง working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm ci --legacy-peer-deps

# คัดลอก prisma directory
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# คัดลอก source code
COPY . .

# ตั้งค่า port ที่จะใช้
EXPOSE 3001

# รอ database พร้อมก่อน แล้วรัน migrate + start server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]





# # ใช้ Node.js image
# FROM node:20

# # ตั้ง working directory
# WORKDIR /app

# # คัดลอก package.json และ package-lock.json
# COPY package*.json ./

# # ติดตั้ง dependencies
# RUN npm install

# # คัดลอก source code
# COPY . .

# # ตั้งค่า environment variables
# ENV DATABASE_URL="postgresql://postgres:1234@db:5432/samrueduu"

# # ตั้งค่า port ที่จะใช้
# EXPOSE 3001

# # รอ database พร้อมก่อน แล้วรัน migrate + start server
# CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
# ใช้ Node.js image
# ใช้ Node.js image