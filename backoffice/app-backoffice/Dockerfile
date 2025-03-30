# Build React
# FROM node:20-alpine

# WORKDIR /backoffice/app-backoffice

# COPY . /backoffice/app-backoffice

# RUN npm ci

# COPY . .

# RUN npm run build

# CMD [ "npx", "serve", "build" ]

# Serve with Nginx
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"] 

# ใช้ Node.js image
FROM node:20

# ตั้ง working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json เข้ามา
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm ci

# คัดลอก source code
COPY . .

# สร้างโปรเจค React สำหรับ production
RUN npm run build

# ตั้งค่า port ที่จะใช้
EXPOSE 3002

# เรียกใช้โปรเจคใน production mode
CMD ["npm", "start"]

