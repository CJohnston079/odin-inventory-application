#! /usr/bin/env node

const { Client } = require("pg");
const fs = require("fs").promises;
const path = require("path");
const logger = require("../../js/logger");

require("dotenv").config();

const insertAuthors = require("./scripts/insertAuthors");
const insertGenres = require("./scripts/insertGenres");
const insertCountries = require("./scripts/insertCountries");
const insertBooks = require("./scripts/insertBooks");

const isProduction = process.env.NODE_ENV === "production";
const sslConfig = isProduction ? "?sslmode=require" : "";

function getArgumentValue(flag, defaultValue) {
	const index = process.argv.indexOf(flag);
	return index > -1 ? process.argv[index + 1] : defaultValue;
}

async function main() {
	logger.info("Seeding initialised...");

	const user = getArgumentValue("--user", process.env.USER);
	const password = getArgumentValue("--password", process.env.PASSWORD);
	const host = getArgumentValue("--host", process.env.HOST);
	const database = getArgumentValue("--database", process.env.DATABASE);

	const client = new Client({
		connectionString: `postgresql://${user}:${password}@${host}:5432/${database}${sslConfig}`,
		ssl: isProduction ? { rejectUnauthorized: false } : false,
	});

	try {
		await client.connect();

		const schema = await fs.readFile(path.join(__dirname, "schema.sql"), "utf8");
		await client.query(schema);
		logger.separator();
		console.log("> Schema successfully created");

		await insertCountries(client);
		await insertAuthors(client);
		await insertGenres(client);
		await insertBooks(client);
	} catch (err) {
		logger.error("An error occurred during seeding", err);
	} finally {
		await client.end();
		logger.info("Seeding complete!");
		logger.separator();
	}
}

main();
