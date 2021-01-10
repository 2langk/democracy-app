FROM node:12-alpine as build

WORKDIR /app

COPY package.json .

RUN npm install

COPY ./src .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]