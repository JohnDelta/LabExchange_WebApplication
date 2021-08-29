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

Cloud Provider Services used to deploy:

- MongoDB by Microsoft Azure's CosmosDB

- RabbitMQ by AWS Amazon MQ

## Services Architecture


# Installation

To run this project, you must first follow each of the previous links and pull them (save them in folders named after the repo's name).
Then, run ` mvn clean install ` to make the .jar files in each one. (choose the master branch)

Once Everything's ready open a browser and type  ` https://lab-exchange.com/api/classes-service/data/clean And /data/fill ` to reset DB with trash data

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

### Kubernetes notes

- Run in Kubernetes:
  - Add to your system32/etc/host ` 127.0.0.1 lab-exchange.com ` (works for Docker Desktop K8s)
  - First run ` mvn clean install ` to each of the projects
  - Then run compose build ` docker-compose -f docker-compose.yaml --project-name lab_exchange build `
  - And last apply the k8 config ` kubectl apply -f kubernetesConfig.yaml `
  - Set-up Ingress (see bellow)

- Ingress: 
  - https://stackoverflow.com/a/65771251/14434647
  - https://kubernetes.github.io/ingress-nginx/deploy/
  - Mandadory resources for Ingress : ` kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml `
  - Bare-metal Ingress nginx using NodePort (kubectl) : `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.46.0/deploy/static/provider/baremetal/deploy.yaml`

- Commands:
  - Execute the configuration file (create or update) `kubectl apply -f config-file.yaml`
  - Delete the configuration file `kubectl delete -f config-file.yaml`
  - Log to console `kubectl logs pod-name`
  - Get terminal `kubectl exec -it pod-name -- bin/bash`
  - Get info about pod `kubectl describe pod pod-name` (and '-o wide' for more information)
  - Validate that a service runs the correct pod `kubectl describe service service-name` (see the endpoints) 
  - Get pods, services `kubectl get pod, service` (or type 'all')
  - See the ingress controller running `kubectl get pod -n kube-system`