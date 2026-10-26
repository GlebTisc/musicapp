# Node.js 22
FROM node:22-alpine

WORKDIR /app
COPY shared/ ./shared/
COPY frontend/package*.json ./frontend/

WORKDIR /app/frontend
RUN npm install

COPY frontend/ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]