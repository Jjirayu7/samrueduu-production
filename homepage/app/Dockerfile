# Build React
# FROM node:20-alpine

# WORKDIR /homepage/app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# RUN npm run build

# CMD [ "npx", "serve", "build" ]

# Serve with Nginx
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
FROM node:20

# ตั้ง working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json เข้ามา
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm ci --legacy-peer-deps

# คัดลอก source code
COPY . .

# สร้างโปรเจค React สำหรับ production
RUN NODE_OPTIONS="--max-old-space-size=6144" npm run build

# ตั้งค่า port ที่จะใช้
EXPOSE 3000

# เรียกใช้โปรเจคใน production mode
CMD ["npm", "start"]
