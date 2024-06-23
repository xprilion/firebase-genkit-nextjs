FROM node:18-buster
RUN mkdir /app
COPY package.json /app/
WORKDIR /app
COPY . ./

RUN npm install
RUN npm run build

CMD ["npm", "run","start"]