FROM node:22-alpine

WORKDIR /app

COPY shared/ ./shared/

COPY backend/user-service/package*.json ./backend/user-service/

WORKDIR /app/backend/user-service
RUN npm install

COPY backend/user-service/ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]