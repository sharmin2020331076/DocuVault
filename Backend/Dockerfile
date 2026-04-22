FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc

EXPOSE 5000

# We use an environment variable to decide if it's the API or the WORKER
CMD ["node", "dist/index.js"]
