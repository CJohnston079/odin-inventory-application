#! /usr/bin/env node

const { Client } = require("pg");
const fs = require("fs").promises;
const path = require("path");

require("dotenv").config();

const insertAuthors = require("./insertAuthors");
const insertGenres = require("./insertGenres");
const insertLanguages = require("./insertLanguages");
const insertBooks = require("./insertBooks");
const insertBookGenres = require("./insertBookGenres");
const insertBookLanguages = require("./insertBookLanguages");

const isProduction = process.env.NODE_ENV === "production";
const sslConfig = isProduction ? "?sslmode=require" : "";

function getArgumentValue(flag, defaultValue) {
	const index = process.argv.indexOf(flag);
	return index > -1 ? process.argv[index + 1] : defaultValue;
}

async function main() {
	console.log("Seeding...");

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
		console.log("Schema created successfully");

		await insertAuthors(client);
		await insertGenres(client);
		await insertLanguages(client);
		await insertBooks(client);
		await insertBookGenres(client);
		await insertBookLanguages(client);

		console.log("Seeding complete");
	} catch (e) {
		console.log("An error occurred during seeding", e);
	} finally {
		await client.end();
	}
}

main();
