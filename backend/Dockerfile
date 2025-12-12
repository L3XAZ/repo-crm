FROM node:18 AS builder
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:18-slim
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install --production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/server.js"]
