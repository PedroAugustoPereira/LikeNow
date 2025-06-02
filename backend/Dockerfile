FROM node:22-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY . .

COPY .env* ./

RUN npm run build

EXPOSE 3010

CMD ["npm", "run", "start:migrate:prod"]
