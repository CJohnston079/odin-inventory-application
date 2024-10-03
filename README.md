# The Odin Project | Inventory Application

This Inventory App allows users to manage categories and items from an inventory database, providing the ability to perform CRUD operations on the inventory.

## Initial setup

### 1. Set environment variables

The application requires connection to a PostgreSQL database to function. This can be configured in a local `.env` file.

See the example file `sample.env` in root directory contains a templete with all the required environment varaibles. Rename the file `.env` and update the variables to use it in the application.

### 2. Initialise the database

Use the command `npm run seed` to seed the database with data from `/db/data`. Note: if tables in the database already exist, `seed` will drop and rebuild them.

### 3. Run the application locally

Once you have started your Postgres database, use the command `npm run dev` to run the application locally and watch for code changes. The instance will be restarted when changes to the codebase are saved.

By default the URL to open the application in a browser is: http://127.0.0.1:3000/. This will be different if you have set the `PORT` variable in `.env`, for instance, http://127.0.0.1:your_port_number/.
