# Lab Exchange - Web Application

## Description

The project constists of the following services

- Web Application in react : localhost:8080

- Authentication Service : localhost:8081
  https://github.com/JohnDelta/Authentication-Service

- Classses Service : localhost:8082
  https://github.com/JohnDelta/Classes-Service

- Notification Service : localhost:8083
  https://github.com/JohnDelta/Notification-service

- Messenger Service : localhost:8084
  https://github.com/JohnDelta/Messenger-service

- MongoDB server : localhost:27017

- RabbitMQ server : localhost:56014

## Services Architecture

![Screenshot 2021-03-15 143305](https://user-images.githubusercontent.com/53333356/111154215-a46d8c80-859b-11eb-80e1-bd41a51cd7ec.png)

# Installation

To run this project, you must first follow each of the previous links and pull them (save them in folders named after the repo's name).
Then, run ` mvn clean install ` to make the .jar files in each one.

## Install and deploy all with docker compose

- Build compose ``` docker-compose -f docker-compose.yaml --project-name lab_exchange build ```
- Run compose ``` docker-compose -f docker-compose.yaml --project-name lab_exchange up ```
- Stop it ``` docker-compose -f docker-compose.yaml down ```

## Install web app only using npm

- install all necessary packages:
  - `npm install`
  - `npm install stompjs`
  - `npm install sockjs`
  - `npm install react-router-dom`
- run the webapp `npm run`

## Install web app using docker

- Run the react web app
  - build the web app ` npm run build `
  - build the image ``` docker build -t webapp . ```
  - find the image and its ID ``` docker image ls ```
  - create and run the container by image ID ``` docker run -it --rm -p 8080:8080 {ID} ```
  - see all docker containers and find ID ``` docker ps ```
  - stop / start containers ``` docker container stop {ID} ```


### notes

- Ensure that the app runs perfectly now using docker compose and its ready

 

- Start search on how to set up the k8 process

- I can not set up CICD on the first local environment


 - When everything works, I can later use the google run to deploy the 4 services
 - use mlab to deploy mongo
 - final problem is the rabbitmq ?
