# Lab Exchange - Web Application

## Description

Services Architecture

![Screenshot 2021-03-15 143305](https://user-images.githubusercontent.com/53333356/111154215-a46d8c80-859b-11eb-80e1-bd41a51cd7ec.png)

## Install

## Services

### Authentication Service : localhost:8081

https://github.com/JohnDelta/Authentication-Service

### Classses Service : localhost:8082

https://github.com/JohnDelta/Classes-Service

### Notification Service : localhost:8083

https://github.com/JohnDelta/Notification-service

### Messenger Service : localhost:8084

https://github.com/JohnDelta/Messenger-service

### MongoDB : localhost:27017

### notes


- finish the lab exchange function (ok for now)

in classes service
- users must have a user type of student or professor. (k)
- generate professors too, but they should only have labClasses assigned to them. k
- in each service, make sure the requested call comes from the correct user role too. Not only by his jwt. Make it a function you're gonna use it alot. difficult.

in authentication service
- add the user role there too. k


in web app
- change the auth.js to read the returning user role and redirect him there.


fix header to redirect depending the user type.
and to show only the corresponding headers.

then create the classes view for professors.

then try to add the userType to jwt so you can read it from services