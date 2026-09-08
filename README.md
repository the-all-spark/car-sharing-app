# Car Sharing API

## Description

A lightweight RESTful API built with Node.js, Express, and MongoDB (Mongoose) to manage a car sharing park.

## Getting Started (Docker)

### Prerequisites
Make sure you have [Docker Desktop](https://docs.docker.com/get-docker/) installed on your computer.

### Installation & Running

1. Clone the repository and navigate to the project root:
   
    `git clone https://github.com/the-all-spark/car-sharing-app.git`  
    `cd car-sharing-app`  
   
2. Start the application using Docker Compose:
   
    `docker compose up --build`  
    
    This command spins up the Node.js application server and a MongoDB instance automatically.

3. Stop the application:
   
    `docker compose down`

## Swagger

Swagger UI by default is available on http://localhost:3000/api-docs
   
## API Endpoints

* `GET /api/cars/in-use/low-fuel`  
Retrieves a list of all cars currently marked as 'In use' with a fuel level less than 1/4 of full tank.

* `GET /api/cars/reserved/unauthorized-card`    
Retrieves all cars that are 'Reserved' but the driver's credit/debit card hasn't been authorized.  
Returns: VIN, location, driver's first/last name, and driver's license number.

* `POST /api/cars`  
Adds a new car to the car sharing park.
Request body includes required fields: vin, registrationNumber, productionInfo.

* `PUT /api/cars/service-old-or-high-mileage`  
Set status to 'In Service' for any vehicle that meets _one of_ condition:
  * produced before 01/01/2017
  * or mileage is greater than 100000 km

* `PUT /api/cars/relocate-frequent`  
Updates the location of vehicles that meet _both_ condition:
  * have been booked more than 2 times 
  * and are neither 'In use' nor 'Reserved'.  
Sets location coordinates to: { longitude: 27.5442615, latitude: 53.8882836 }

* `DELETE /api/cars/:vin`   
Removes a specific car from the database using its VIN (Vehicle Identification Number).