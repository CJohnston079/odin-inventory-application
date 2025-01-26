# The Odin Project | Inventory Application

This Inventory App allows users to manage categories and items from an inventory database, providing the ability to perform CRUD operations on the inventory.

A deployment of the project can be accessed here: [Inventory | Home](https://unacceptable-mei-black-and-white-development-98d9dfe2.koyeb.app/)

## About

### Project aims

The original project brief can be found here: [Project: Inventory Application | The Odin Project](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application). Below is a concise summary of the project requirements:

1. Model the relationships and contraints against inventory entities.
2. Perform CRUD operations on inventory entities.
3. Provide an accessible and responsive user-interface for interacting with inventory entities.

### Database schema

An Entity-Relationship Diagram of the database scheme is available to view here: [odin-inventory-app - dbdiagram.io](https://dbdiagram.io/d/odin-inventory-app-66db0efdeef7e08f0eecaef7).

## Initial setup

### 1. Set environment variables

The application requires connection to a PostgreSQL database to function. This can be configured in a local `.env` file.

See the example file `sample.env` in root directory contains a templete with all the required environment varaibles. Rename the file `.env` and update the variables to use it in the application.

### 2. Initialise the database

To seed the database with data from `/db/data`, run the command:

```bash
npm run seed
```

_Note: if tables in the database already exist, `seed` will drop and rebuild them._

### 3. Run the application locally

Once you have started your Postgres database, to run the application locally and watch for code changes, use the command:

```bash
npm run dev
```

The instance will be restarted when changes to the codebase are saved.

By default, the URL to open the application in a browser is: http://127.0.0.1:3000/. This will be different if you have set the `PORT` variable in `.env`, for instance, http://127.0.0.1:your_port_number/.

### 4. Compile Sass files:

When editing the stylesheets, any changes will need to be compiled to `main.js`. You can do this with the command:

```bash
npm run build:sass
```

Alternatively, to watch for changes in the terminal, run the command:

```bash
npm run watch:sass
```

_Note: the web page may need to be refreshed to see the changes rendered on the server._

## PaaS deployment setup

### Quick setup

- Build command: `npm run seed`
- Run command: `npm start`
- Working directory: `./`

### Detailed setup

Once you have setup your database and environment variables on your PaaS provider of choice, you will first need to seed the database during the build phase with the command:

```bash
npm run seed
```

If you haven't already, you will also need to compile the Sass files with the command:

```bash
npm run build:sass
```

Once the build phase is complete, you can start the server with the command:

```bash
npm run start
```

The working directory is `./`.
