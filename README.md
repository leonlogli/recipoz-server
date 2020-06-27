# Recipoz Server


## Table of Contents

- [Overview](#overview)
- [Motivation](#motivation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Application Structure](#application-structure)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Eslint](#eslint)
- [License](#license)


## Overview

Recipoz is a modern web application built with Node.js and Apollo Graphql Server.
It allows users to create, share and explore food recipes as well as manage their grocery list.


## Motivation

Recipoz is above all the result of web technologies that I've mastered through training as well as the experiences acquired during my internships. My goal was to gather my programming skills in a "real world" project that would make life easier for end users. That is why I have decided to create Recipoz, a place where cooks and food bloggers save recipes, make shopping lists and share their recipes with others.


## Features

- Browse Food recipes by categories, trending and reviews
- Shopping list (Grocery list) with smart organizer for most ingredients
- Users authentication and authorization based on roles
- Follow users to be updated for newly added recipes
- Save recipes as favorite or made.
- Create custom recipe collections to organize saved recipes
- Comment or Review recipes
- Support push and platform notifications
- Multi-language support (I18n & L10n)
- Advanced Search with filtering, sorting and autocomplete
- Cursor based pagination to enable infinite scroll (like in Relay spec)


## Tech Stack

Recipoz server uses a number of open source projects to work properly:

- [Node.js](https://github.com/nodejs/node), [TypeScript](https://github.com/microsoft/TypeScript) — core platform
- [GraphQL.js](https://graphql.org/), [Apollo Server](https://github.com/apollographql/apollo-server), [DataLoader](https://github.com/graphql/dataloader) — GraphQL server schema and API endpoint
- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [MongoDB](https://www.mongodb.com/), [Mongoose](https://github.com/Automattic/mongoose) — data access, and db object modeling
- [Firebase Admin Node.JS SDK](https://github.com/firebase/firebase-admin-node), [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/) — users authentication and push notifications
- [Joi](https://github.com/hapijs/joi) - data validations
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [Prettier](https://github.com/prettier/prettier), [Eslint](https://github.com/eslint/eslint) - code formating and linting tool
- [Mocha](https://github.com/mochajs/mocha), [Chai](https://github.com/chaijs/chai) - unit and integration testing


## Application Structure

- `src/__tests__` - Contains unit and integration tests.
- `src/config` - Defines app module configurations such as firebase, mongodb, i18n, etc.
- `src/constants` - Gathers all constants at one place.
- `src/graphql` - Place where all graphql related modules (typeDefs, resolvers, dataloaders, etc) are handled.
- `src/middlewares` - Express server middlewares.
- `src/models` - Contains the schema definitions for our Mongoose models.
- `src/resource` - This folder contains the resources folders such as locale translations, ingredient data etc.
- `src/services` - Contains app services or modules
- `src/utils` - This folder contains all helper files.
- `src/validations` - Define all server side validations with hapi/joi.
- `src/app.ts` - Is the file that defines our express server and connects it to MongoDB using mongoose. It also requires the middlewares we'll be using in the application.
- `src/index.ts` - Entry point of the application. This file define the Apollo server and listen to the Express app.


## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. When the client app sign in a user via Firebase Client Sdk, it sends its idToken to Recipoz server, which checks its validity before associating a Recipoz account with the target user. The client subsequently requests an access token which he sends in the header for each subsequent request. We therefore don't directly use the Firebase idToken to validate requests because we want to strengthen security by reducing the expiration time of the access token (15min max for example)


## Error Handling

In `src/validations`, we define error-handling schema that can't be handle with graphql. All error messages are translated into the user's language so that the client can display it directly on the UI without processing. However, errors that frontend developers can avoid (user input validation errors) are not translated but are sent directly with more details to allow developers to handle them.


## Prerequisites

- [Node.js](https://nodejs.org/en/) v12 or higher + [Yarn](https://yarnpkg.com/) package manager
- [MongoDB](https://www.mongodb.com/) (can be local or remote instance)
- Optionally [VS Code](https://code.visualstudio.com/) editor with [Apollo GraphQL](https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) plug-ins.


## Getting Started

Firebase config:

- Create a project at the [Firebase console](https://console.firebase.google.com/).
- Copy the contents of `.env.local.example` into a new file called `.env.local`
- Get your account credentials from the Firebase console at _Project settings > Service accounts_, where you can click on _Generate new private key_ and download the credentials as a json file. It will contain keys such as `project_id`, `client_email` etc. Set them as environment variables in the `.env.local` file at the root of this project.
- Go to **Develop**, click on **Authentication** and in the **Sign-in method** tab enable authentication for the app.

Install it and run:

```bash
# Install Node.js dependencies
$ yarn install
# Runs the app in development mode. Open http://localhost:3000 to view it in the browser.
yarn dev
# Builds the app for production and optimizes the build for the best performance.
yarn build
# Start the server in local
yarn start
```

The API server must become available at [http://localhost:4000/graphql](http://localhost:4000/graphql)
[WIP] - Currently i am working on the frontend app to bring this idea to live


## Testing

Recipoz server uses Mocha and Chai for testing .To enable integration tests, a testing config file is included in tests directory, where various options and helper methods are defined to suit the needs of the project.

```bash
# run all tests
yarn test
# run unit tests
yarn test:unit
# run integration tests
yarn test:integration
# Run the test watcher
yarn test:watch
# run test coverage
yarn test:coverage
```

## ESLint

```bash
# run lint
yarn lint
# fix lint auto-fixable errors
yarn lint:fix
# watch
yarn lint:watch
```

## License

This source code is licensed under the [Apache License, version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

---

Author: [Léon Komi Logli](https://www.linkedin.com/in/komi-logli-a51ba9151)
