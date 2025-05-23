FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "preview", "--", "--host", "--port", "8080"]
