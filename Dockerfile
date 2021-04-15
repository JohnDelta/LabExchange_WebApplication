FROM node:13:12:0-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
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