FROM node:14

WORKDIR /kafa-connect-node
COPY package.json .
RUN npm install
COPY . .
CMD npm start