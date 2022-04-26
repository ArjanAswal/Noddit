# Noddit

Noddit is an Open Source Reddit clone implemented in Node.js.
Noddit is a RESTful API that conforms to the constraints of REST architectural style and allows for interaction with RESTful web services.

## Features

* Nginx as a reverse proxy and load balancer.
* Hot ranking algorithm (similar to Reddit) to sort by trending.
* Cron job to calculate the score (rank) of each post and comment.
* Scalable file upload to Amazon S3 through secure presigned URLs.
* Query caching through Redis DB.
* Deployed with AWS Elastic Beanstalk.
* Integration testing through Jest.
* Follows the Model View Controller (MVC) architecture.
* Fully automated Continuous Integration and Deployment (CI/CD) through GitHub Actions.
* Advanced Database queries for complex requests.
* API documentation through Swagger and Postman.
* Sendgrid API integration to send emails.
* ESLint and Prettier integration.
* Fully dockerized app with proper health checking of containers which  follows the best practices.
* A centralised Error handler for efficient error handling.
* Production grade logging through Winston.
* Email templating with Pug.

## Application Architecture

![Architecture](https://github.com/arjanaswal/noddit/blob/main/wiki/architecture.png?raw=true)

## Quick Start

Create a `.env` file with the following properties:

* SERVER_URL: Sets the current server url. It could be localhost for dev environment.
* NODE_ENV: Environment of node app.
* MONGO_URL: Sets the MongoDB URL, this should also work with DocumentDB.
* REDIS_URL: Sets the Redis URL, this should also work with Elasticache.
* REDIS_PASSWORD (Optional): Password needed for Redis Cloud.
* PORT (Optional): Sets the HTTP port number.
* JWT_SECRET: JWT secret key.
* JWT_EXPIRES_IN: Time period in which JWT expires (Eg - 90d).
* JWT_COOKIE_EXPIRES_IN: Time period in which JWT cookie expires (Eg - 90).
* EMAIL_FROM_NAME: Full name of the sender of emails.
* EMAIL_FROM_ADDRESS: Email address associated with Sendgrid.
* SENDGRID_USERNAME: Sendgrid username.
* SENDGRID_PASSWORD: Sendgrid API key.
* AWS_S3_ACCESS_KEY_ID: AWS S3 access key ID for IAM user.
* AWS_S3_SECRET_ACCESS_KEY: AWS S3 secret access key for IAM user.
* AWS_S3_BUCKET: AWS S3 bucket name.

Then run the following command:

`docker-compose up`

## Workflow

![Workflow](https://github.com/arjanaswal/noddit/blob/main/wiki/workflow.png?raw=true)

## Performance

Since Node.js is single threaded, the best way to get the most optimal performance is to run N number of Docker instances of the node server where N is the number of logical CPU cores of the device on which the server is running. Then, Nginx will automatically balance the load by round robin distribution algorithm.

For example, if you are running this app on apple M1 air then you should run 8 docker instances of server. Since m1 air has an 8-core CPU consisting of four high-performance cores and four high-efficiency cores

## Project Structure

| Name                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| **wiki/**           | You can add project documentation and instructions file here |
| **src/**            | Source files                                                 |
| **src/controllers** | The controllers of the express app                           |
| **src/jobs**        | The cron jobs used in the app                                |
| **src/models**      | Mongoose models with swagger documentation                   |
| **src/routes/**     | Express REST API routes with swagger documentation           |
| **src/utils**       | Reusable utilises and library source code like a logger      |
| **src/views/**      | Represents current model state                               |
| **tests/**          | Test suites are placed here                                  |

## Demo

API is hosted [here](http://noddit-env.eba-bearemm7.us-east-1.elasticbeanstalk.com/api/v1/posts).

## Postman Documentation

Postman Documentation and API Playground is hosted [here](https://documenter.getpostman.com/view/18809944/UyrBjwUq).
