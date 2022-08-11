FROM node:16-alpine3.11

ENV API_IP "http://localhost:4300/api/"

WORKDIR /usr/src/app
RUN apk add --no-cache bash
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000
EXPOSE 9229
CMD ["npm", "start"]