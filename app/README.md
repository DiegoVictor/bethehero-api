# [App] Be The Hero
![react-native](https://img.shields.io/badge/react-16.9.0-61dafb?style=flat-square&logo=react)
![styled-components](https://img.shields.io/badge/styled_components-5.1.0-db7b86?style=flat-square&logo=styled-components)
![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
![jest](https://img.shields.io/badge/jest-24.9.0-brightgreen?style=flat-square&logo=jest)
![expo](https://img.shields.io/badge/expo-37.0.0-000000?style=flat-square&logo=expo)
![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen?style=flat-square)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/bethehero/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
This app version allow everyone to see all open incidents from all NGOs. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/bethehero/tree/master/api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [app.json](#appjson)
    * [API](#api)
* [Usage](#usage)
  * [Expo](#expo)
  * [OS](#os)
  * [Reactotron](#reactotron)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/bethehero/master/app/screenshots/splash.jpg" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/bethehero/master/app/screenshots/incidents.jpg" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/bethehero/master/app/screenshots/incident.jpg" width="32%" />

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
Configure your environment variables and remember to start the [API](https://github.com/DiegoVictor/bethehero/tree/master/api) before to start this app.

### app.json
In this file you may configure the API's url. Rename the `app.example.json` in the root directory to `app.json` then update with your settings **only the keys under `extra` key**.

key|description|default
---|---|---
API_URL|API's url with version (v1)|`http://localhost:3333/v1`

### API
Start the [`API`](https://github.com/DiegoVictor/bethehero/tree/master/api) (see its README for more information). In case of any change in the API's port or host remember to update the `app.json`'s `API_URL` property too.
> Also, maybe you need run reverse command to the API's port: `adb reverse tcp:3333 tcp:3333`

# Usage
To start the app run:
```
$ yarn start
```
Or:
```
$ npm run start
```
> This project was built with [Expo](https://expo.io), to know how to run it in your phone see [Expo client for iOS and Android](https://docs.expo.io/versions/v37.0.0/get-started/installation/#2-mobile-app-expo-client-for-ios) and in your computer see [Running the Expo client on your computer](https://docs.expo.io/versions/v37.0.0/get-started/installation/#running-the-expo-client-on-your-computer).

## OS
This app was tested only with Android through USB connection and [Genymotion](https://www.genymotion.com/) (Simulator), is strongly recommended to use the same operational system, but of course you can use an emulator or a real device connected through wifi or USB.

## Reactotron
The project comes configured with [Reactotron](https://github.com/infinitered/reactotron), after install just open it, then as soon as possible Reactotron will automatically identify new connections.
> If Reactotron show an empty timeline after the app is running try run `adb reverse tcp:9090 tcp:9090`, then reload the app.

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
