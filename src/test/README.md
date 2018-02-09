# Grad Apps Automation Tests

## How to run tests

### Install dependencies
- To install the packages, run `npm i` from the [`src directory`](https://github.com/ssh24/EECS4090-Project/tree/master/src/)

### Configure database
- Using system environmental variables, set the host, port, user and password for the MySQL instance to be tested on.
- The environmental variables are:
  - `MYSQL_HOST`
  - `MYSQL_PORT`
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`
- The database for testing is set to `testdb` by default. It is automatically created as part of the pretest procedure.

### Run tests
- There are three types of test suites available to be ran:
    - **Overall test**: Includes running both the database test and the application's unit test. To run the overall test, run the following command `npm test`
    - **Database test**: Includes running just the database test. To run the database test, run the following command `npm run db:test`
    - **Unit test**: Includes running just the application's unit test. To run the unit test, run the following command `npm run unit:test`
