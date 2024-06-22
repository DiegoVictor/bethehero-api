# [API] Be The Hero
[![AppVeyor](https://img.shields.io/appveyor/build/diegovictor/bethehero-api?logo=appveyor&style=flat-square)](https://ci.appveyor.com/project/DiegoVictor/bethehero-api)
[![nodemon](https://img.shields.io/badge/nodemon-3.1.4-76d04b?style=flat-square&logo=nodemon)](https://nodemon.io/)
[![eslint](https://img.shields.io/badge/eslint-8.57.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-29.7.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/bethehero-api?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/bethehero-api)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/bethehero-api/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Be%20The%20Hero&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fbethehero-api%2Fmain%2FInsomnia_2023-08-24.json)


Responsible for provide data to the [`web`](https://github.com/DiegoVictor/bethehero-web) and [`mobile`](https://github.com/DiegoVictor/bethehero-app) front-ends. Permit to register NGOs and manage its incidents. The app has rate limit, brute force prevention, pagination, pagination's link header (to previous, next, first and last page), friendly errors, use JWT to logins, validation, also a simple versioning was made.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [SQLite](#sqlite)
      * [Migrations](#migrations)
    * [.env](#env)
* [Usage](#usage)
  * [Error Handling](#error-handling)
    * [Errors Reference](#errors-reference)
  * [Pagination](#pagination)
    * [Link Header](#link-header)
    * [X-Total-Count](#x-total-count)
  * [Bearer Token](#bearer-token)
  * [Versioning](#versioning)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application uses just one database: [SQLite](https://www.sqlite.org/index.html). For the fastest setup is recommended to use [docker-compose](https://docs.docker.com/compose/), you just need to up all services:
```
$ docker-compose up -d
```

### SQLite
Store the NGOs and its incidents. For more information to how to setup your database see:
* [knexfile.js](http://knexjs.org/#knexfile)
> You can find the application's `knexfile.js` file in the root folder. It already comes with `test` and `development` connection configured, so you will update it only when deploying or staging!

#### Migrations
Remember to run the SQLite database migrations:
```
$ npx knex migrate:latest
```
> See more information on [Knex Migrations](http://knexjs.org/#Migrations).

### .env
In this file you may configure your JWT settings, the environment, app's port and a url to documentation (this will be returned with error responses, see [error section](#error-handling)). Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_PORT|Port number where the app will run.|`3333`
|NODE_ENV|App environment. The knex's connection configuration used rely on this key value, so if the environment is `development` the knex connection used will be `development`.|`development`
|JWT_SECRET|A alphanumeric random string. Used to create signed tokens.| -
|JWT_EXPIRATION_TIME|How long time will be the token valid. See [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#usage) repo for more information.|`7d`
|DOCS_URL|An url to docs where users can find more information about the app's internal code errors.|`https://github.com/DiegoVictor/bethehero-api#errors-reference`

# Usage
To start up the app run:
```
$ yarn dev:server
```
Or:
```
npm run dev:server
```

## Error Handling
Instead of only throw a simple message and HTTP Status Code this API return friendly errors:
```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Too Many Requests",
  "code": 449,
  "docs": "https://github.com/DiegoVictor/bethehero-api#errors-reference"
}
```
> Errors are implemented with [@hapi/boom](https://github.com/hapijs/boom).
> As you can see a url to error docs are returned too. To configure this url update the `DOCS_URL` key from `.env` file.
> In the next sub section ([Errors Reference](#errors-reference)) you can see the errors `code` description.

### Errors Reference
|code|message|description
|---|---|---
|141|This incident is not owned by your NGO|The referenced incident is from another NGO.
|144|Incident not found|The `id` sent not references an existing incident in the database.
|240|Your NGO was not found|The NGO `id` sent through the login does not references an existing NGO in the database.
|244|NGO not found|The `id` sent does not references an existing NGO in the database.
|340|Token not provided|The JWT token was not sent.
|341|Token invalid|The JWT token provided is invalid or expired.
|449|Too Many Requests|You reached at the requests limit.

## Pagination
All the routes with pagination returns 5 records per page, to navigate to other pages just send the `page` query parameter with the number of the page.

* To get the third page of incidents:
```
GET http://localhost:3333/v1/incidents?page=3
```

### Link Header
Also in the headers of every route with pagination the `Link` header is returned with links to `first`, `last`, `next` and `prev` (previous) page.
```
<http://localhost:3333/v1/incidents?page=7>; rel="last",
<http://localhost:3333/v1/incidents?page=4>; rel="next",
<http://localhost:3333/v1/incidents?page=1>; rel="first",
<http://localhost:3333/v1/incidents?page=2>; rel="prev"
```
> See more about this header in this MDN doc: [Link - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link).

### X-Total-Count
Another header returned in routes with pagination, this bring the total records amount.

## Bearer Token
A few routes expect a Bearer Token in an `Authorization` header.
> You can see these routes in the [routes](#routes) section.
```
GET http://localhost:3333/v1/ngos/e5a76988/incidents?page=1 Authorization: Bearer <token>
```
> To achieve this token you just need authenticate through the `/sessions` route and it will return the `token` key with a valid Bearer Token.

## Versioning
A simple versioning was made. Just remember to set after the `host` the `/v1/` string to your requests.
```
GET http://localhost:3333/v1/ngos
```

## Routes
|route|HTTP Method|pagination|params|description|auth method
|:---|:---:|:---:|:---:|:---:|:---:
|`/sessions`|POST|:x:|Body with NGO `id`.|Authenticates user, return a Bearer Token and ngo's id and name.|:x:
|`/ngos`|GET|:heavy_check_mark:|`page` query parameter.|Lists NGOs.|:x:
|`/ngos/:id`|GET|:x:|`:id` of the NGO.|Return one NGO.|:x:
|`/ngos`|POST|:x:|Body with new NGO data.|Create a new NGO.|:x:
|`/incidents`|GET|:heavy_check_mark:|`page` query parameter.|List incidents.|:x:
|`/incidents/:id`|GET|:x:|`:id` of the incident.|Return one incident.|:x:
|`/incidents`|POST|:x:|Body with new incident data.|Create new incidents.|Bearer
|`/incidents/:id`|DELETE|:x:|`:id` of the incident.|Remove an incident.|Bearer
|`/ngos/:ngo_id/incidents`|GET|:heavy_check_mark:|`page` query parameter and `:ngo_id` of the NGO.|List NGO's incidents.|:x:

> Routes with `Bearer` as auth method expect an `Authorization` header. See [Bearer Token](#bearer-token) section for more information.

### Requests
* `POST /session`

Request body:
```json
{
	"id": "e5a76988"
}
```

* `POST /ngos`

Request body:
```json
{
	"name": "Doe and Sons",
	"email": "johndoe@gmail.com",
	"whatsapp": "39379976591",
	"city": "Corinefurt",
	"uf": "NE"
}
```

* `POST /incidents`

Request body:
```json
{
	"title": "Forward Tactics Representative",
	"description": "Adipisci non assumenda ad sequi.",
	"value": 512.93
}
```

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
