FROM node:20-alpine

ENV NODE_ENV=production

RUN npm install -g nodemon concurrently rimraf

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]