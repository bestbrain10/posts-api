# posts-api
Simple Facebook Posts API

## API Documentation


## How to Install NodeJS and Git

- Install NodeJS and NPM. Use this link and follow the steps for your own operating system https://nodejs.org/en/download/

- Install Git from https://git-scm.com/downloads

- From your terminal or command line run
    
    - `git clone git@github.com:bestbrain10/posts-api.git`

    - `cd post-api`

    - `npm install`

## How to install Postgres

- Visit https://www.postgresql.org/download/ on your browser to downoad Postgres. 
- After the download is complete, select your operating system and follow instructions to complete the installations
- To start postgres on your computer follow instructions on this website: https://tableplus.com/blog/2018/10/how-to-start-stop-restart-postgresql-server.html

## Setting up the database

- I used `facebook-posts` as the database name (`<database>`) when developing so you can use it or any name of your choice

- Open your CLI, run `createdb <database>` to create a database with default username and password (`postgres`)

## Running Locally

 - create a `.env` file in the project directory using `env.example` as template

 - run `npm run migrate:run` to setup the database

 - Run `npm run start` to start the server

 - From your browser or REST client visit `http://localhost:4000` 

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