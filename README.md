# [API] Be The Hero
[![redis](https://img.shields.io/badge/redis-3.0.2-d92b21?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![nodemon](https://img.shields.io/badge/nodemon-2.0.2-76d04b?style=flat-square&logo=nodemon)](https://nodemon.io/)
[![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-25.2.7-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen?style=flat-square&logo=jest)
[![airbnb-style](https://flat.badgen.net/badge/eslint/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/bethehero/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=Be%20The%20Hero&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fomnistack%2Fmaster%2F11%2Fapi%2FInsomnia_2020-04-04.json)


Responsible for provide data to the [`web`](https://github.com/DiegoVictor/bethehero/tree/master/web) and [`mobile`](https://github.com/DiegoVictor/bethehero/tree/master/app) front-ends. Permit to register NGOs and manage its incidents. The app has rate limit, brute force prevention, pagination, pagination's link header (to previous, next, first and last page), friendly errors, use JWT to logins, validation, also a simple versioning was made.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [Redis](#redis)
    * [SQLite](#sqlite)
      * [Migrations](#migrations)
    * [.env](#env)
    * [Rate Limit & Brute Force (Optional)](#rate-limit--brute-force-optional)
* [Usage](#usage)
  * [Error Handling](#error-handling)
    * [Errors Reference](#errors-reference)
  * [Pagination](#pagination)
    * [Link Header](#link-header)
    * [X-Total-Count](#x-total-count)
  * [JWT](#jwt)
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
The application use two databases: [SQLite](https://www.sqlite.org/index.html) and [Redis](https://redis.io/).

### Redis
Responsible to store data utilized by the rate limit middleware and brute force prevention. For the fastest setup is recommended to use [docker](https://www.docker.com), you can create a redis container like so:
```
$ docker run --name bethehero-redis -d -p 6379:6379 redis:alpine
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
In this file you may configure your Redis database connection, JWT settings, the environment, app's port and a url to documentation (this will be returned with error responses, see [error section](#errors-reference)). Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_PORT|Port number where the app will run.|`3333`
|NODE_ENV|App environment. The knex's connection configuration used rely on the this key value, so if the environment is `development` the knex connection used will be`development`.|`development`
|JWT_SECRET|A alphanumeric random string. Used to create signed tokens.|-
|JWT_EXPIRATION_TIME|How long time will be the token valid. See [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#usage) repo for more information.|`7d`
|REDIS_HOST|Redis host. For Windows users using Docker Toolbox maybe be necessary in your `.env` file set the host to `192.168.99.100` (docker machine IP) instead of localhost or `127.0.0.1`.|`127.0.0.1`
|REDIS_PORT|Redis port.|`6379`
|DOCS_URL|An url to docs where users can find more information about the app's internal code errors.|`https://github.com/DiegoVictor/bethehero/blob/master/api/README.md#errors-reference`

### Rate Limit & Brute Force (Optional)
The project comes pre-configured, but you can adjust it as your needs.

* `src/config/rate_limit.js`

|key|description|default
|---|---|---
|duration|Number of seconds before consumed points are reset.|`300`
|points|Maximum number of points can be consumed over duration.|`10`

> The lib [`rate-limiter-flexible`](https://github.com/animir/node-rate-limiter-flexible) was used to rate the api's limits, for more configuration information go to [Options](https://github.com/animir/node-rate-limiter-flexible/wiki/Options#options) page.

* `src/config/bruteforce.js`
> `rate-limiter-flexible` was also used to configure brute force prevention, but with a different method of configuration that you can see in [ExpressBrute migration](https://github.com/animir/node-rate-limiter-flexible/wiki/ExpressBrute-migration#options).

# Usage
To start up the app run:
```
$ yarn start
```
Or:
```
npm run start
```

## Error Handling
Instead of only throw a simple message and HTTP Status Code this API return friendly errors:
```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Too Many Requests",
  "code": 449,
  "docs": "https://github.com/DiegoVictor/omnistack/tree/master/11/api#errors"
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
> See more about this header in this MDN web doc: [Link - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link).

### X-Total-Count
Another header returned in routes with pagination, this bring the total records amount.

## JWT
A few routes expect a Bearer JWT Token in an `Authorization` header.
> You can see these routes in the [routes](#routes) section.
```
GET http://localhost:3333/v1/ngo_incidents?page=1 Authorization: Bearer <token>
```
> To achieve this token you just need authenticate through the `/sessions` route and it will return the `token` key with a valid JWT Token.

## Versioning
A simple versioning was made. Just remember to set after the `host` the `/v1/` string to your requests.
```
GET http://localhost:3333/v1/ngos
```

## Routes
|route|HTTP Method|pagination|params|validation|JWT
|:---|:---:|:---:|:---:|:---:|:---:
|`/sessions`|POST|:x:|Body with NGO `id`|:heavy_check_mark:|:x:
|`/ngos`|GET|:heavy_check_mark:|`page` query parameter|:heavy_check_mark:|:x:
|`/ngos/:id`|GET|:x:|`:id` of the NGO|:heavy_check_mark:|:x:
|`/ngos`|POST|:x:|Body with new NGO data|:heavy_check_mark:|:x:
|`/incidents`|GET|:heavy_check_mark:|`page` query parameter|:heavy_check_mark:|:x:
|`/incidents/:id`|GET|:x:|`:id` of the incident|:heavy_check_mark:|:x:
|`/incidents`|POST|:x:|Body with new incident data|:heavy_check_mark:|:heavy_check_mark:
|`/incidents/:id`|DELETE|:x:|`:id` of the incident|:heavy_check_mark:|:heavy_check_mark:
|`/ngo_incidents`|GET|:x:|:x:|:heavy_check_mark:|:heavy_check_mark:

> Routes with `JWT` checked expect an `Authorization` header. See [JWT](#jwt) section for more information.

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
