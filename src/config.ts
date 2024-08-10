import "dotenv/config"

let configuration: Configuration | null

export type Configuration = {
	NODE_ENV: string
	PORT: number
	APP_NAME: string

	POSTGRES_HOST: string
	POSTGRES_PORT: number
	POSTGRES_USER: string
	POSTGRES_PASSWORD: string
	POSTGRES_DB_NAME: string
}

export function getOrSetConfiguration() {
	if (configuration) {
		return configuration
	}

	configuration = {
		NODE_ENV: process.env.NODE_ENV || "development",
		PORT: parseInt(process.env.PORT as string),
		APP_NAME: process.env.APP_NAME || "foo-backend",

		POSTGRES_HOST: process.env.POSTGRES_HOST || "localhost",
		POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT as string) || 5432,
		POSTGRES_USER: process.env.POSTGRES_USERNAME || "postgres",
		POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "postgres",
		POSTGRES_DB_NAME: process.env.POSTGRES_DB_NAME || "postgres",
	}
	return configuration
}

export function getConfig<T extends keyof Configuration>(
	key: T,
): Configuration[T] {
	const configuration = getOrSetConfiguration()
	return configuration[key]
}
