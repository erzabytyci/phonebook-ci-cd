FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 5001

CMD ["sh", "-c", "serve -s -l ${PORT:-10000} dist"]
