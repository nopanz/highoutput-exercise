FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333
ENV PORT 3333

CMD ["npm", "start"]
