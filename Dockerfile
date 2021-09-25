FROM node:alpine
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install react-router-dom
RUN npm install stompjs
RUN npm install sockjs
COPY . ./
CMD ["npm", "start"]