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

To run this system, you must first follow each of the previous links and pull them. Then follow the installation in each README.md

If you want to run this using a docker compose, be sure you've first created the images of all the services before running the commands bellow.

## Install and deploy all with docker compose

- Make sure the all the other service images are created inside their pull folders
- Run compose ``` docker-compose -f docker-compose.yaml up ```
- Stop it ``` docker-compose -f docker-compose.yaml down ```

## Install using npm

- install all necessary packages `npm install`, `npm install stompjs`, `npm install sockjs`, `npm install react-router-dom`
- run the webapp `npm run`

## Install using docker

- Run the spring boot service
  - build the image ``` npm build -t webApplication ```
  - find the image and its ID ``` docker image ls ```
  - create and run the container by image ID ``` docker run -it --rm -p 8080:8080 {ID} ```
  - see all docker containers and find ID ``` docker ps ```
  - stop / start containers ``` docker container stop {ID} ```