import * as path from "path"
import { DataSource } from "typeorm"
import { getConfig } from "../configuration"

export const dataSource = new DataSource({
	type: "postgres",
	applicationName: getConfig("APP_NAME"),
	migrationsTableName: "migrations",

	host: getConfig("POSTGRES_HOST"),
	port: getConfig("POSTGRES_PORT"),
	username: getConfig("POSTGRES_USER"),
	password: getConfig("POSTGRES_PASSWORD"),
	database: getConfig("POSTGRES_DB_NAME"),

	entities: [
		path.join(
			__dirname,
			"..",
			"modules",
			"entity",
			"entities",
			"**",
			"*.*entity.js",
		),
	],
	migrations: [path.join(__dirname, "migrations", "*.js")],
	synchronize: false,

	connectTimeoutMS: 30000,
})
