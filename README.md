[![Test](https://github.com/bestbrain10/posts-api/actions/workflows/pipeline.yml/badge.svg)](https://github.com/bestbrain10/posts-api/actions/workflows/pipeline.yml)
# posts-api
Simple Facebook Posts API


## API Documentation

https://documenter.getpostman.com/view/2210503/TzRLmqmq

## How to Install NodeJS and Git

- Install NodeJS and NPM. Use this link and follow the steps for your own operating system https://nodejs.org/en/download/

- Install Git from https://git-scm.com/downloads

- From your terminal or command line run
    
    - `git clone git@github.com:bestbrain10/posts-api.git`

    - `cd post-api`

    - `npm install`

## Creating AWS Credentials

Core to this project is emailing and I use AWS SES to send email to users. 
To have this feature work one must have an AWS account (register here https://aws.amazon.com/account/sign-up).
If you alread have an account login to the console here: https://aws.amazon.com/console
Once in the console use the following steps to get the credentials for using AWS SES

### Generating IAM Role for sending Emails

- From the console dashboard after you login, type `IAM` into the search bar, on the services in the popup, select `IAM`
- On the left sidebar, select `IAM`
- On the new page opened, enter any username of choice
- For `Access type` section, select `Programmatic access` as we would only be using these credentials strictly for sending mails and nothing else, then click `Next: Permissions`
- Under the set permissions section select `Attach existing policies directly`
- In the newly revealed table, type `SES` into the searchbox
- From the search results select `AmazonSESFullAccess` and then click `Next: Tags` and then `Next: Reviews`
- Double check if everything is filled correctly, otherwise go back and make corrections
- If every detail provided is correct then click `create user`
- On the new page, copy the `Access key ID` column value (e.g <access-key-id>) and paste in your .env file like so: `AWS_ACCESS_KEY_ID=<access key id>`
- click show on the `Secret access key` column value (e.g <secret-access-key>) and paste it in your .env file like so: `AWS_SECRET_ACCESS_KEY=<secret-access-key>`

### Verifying a sender email on AWS

- Type `SES` in the top search bar on the AWS Management console, select `Amazon Simple Email Service`
- From the left sidebar, select `Email Addresses`,
- `verify a New Email Address`
- Type in you email in the pop and click `Verify This Email Address`
- Your email verification status should now be `pending`, Go to the email address' mailbox and confirm the mail from AWS
- Verify on Your verification status for this email is now verified on your AWS Management console
- Once verified you can now send emails, add the email to the .env file like so: `MAIL_SENDER=youremail`

### Selecting a Region

Based on where you are in the world, AWS has a region (group of data centers) located somewhat close to you and it is best practice to use the closest region to you. The closest region to me from Nigeria is Cape Town (af-south-1).

Find the region closest to you and put in the region code in your .env file. For me it is `REGION=af-south-1`



## How to install Postgres

- Visit https://www.postgresql.org/download/ on your browser to downoad Postgres. 
- After the download is complete, select your operating system and follow instructions to complete the installations
- To start postgres on your computer follow instructions on this website: https://tableplus.com/blog/2018/10/how-to-start-stop-restart-postgresql-server.html

## Setting up the database

- I used `facebook-posts` as the database name (`<database>`) when developing so you can use it or any name of your choice

- Open your CLI, run `createdb <database>` to create a database with default username and password (`postgres`)

## Alternatively use Docker
The database and API are already containerized to enable anyone setup quickly.

 - Install docker on your laptop using https://docs.docker.com/engine/install/
 - Once installation is complete, navigate to the project directory (post-api)
 - create a `.env` file in the project directory using `env.example` as template
 - run `docker-compose up database` to get the DB running standlone
 - run `docker-compose up` to run both the DB and API via containers

## Running Locally

 - create a `.env` file in the project directory using `env.example` as template

 - run `npm run migrate:run` to setup the database

 - Run `npm run start` to start the server

 - From your browser or REST client visit `http://localhost:3000` 

 - If you make any changes, you will have to first close the running server, save the file you made changes to and then start the server again using `npm run start`



## Running Unit Test

To run unit test run

> `npm test`

## Running Test Coverage

To run test coverage

> `npm run coverage`

## Running Integration Tests

To run test integration

> `npm run test:e2e`