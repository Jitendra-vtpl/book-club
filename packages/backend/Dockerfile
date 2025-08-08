FROM node:22.10.0-alpine

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

# CMD ["npm", "run", "dev"]