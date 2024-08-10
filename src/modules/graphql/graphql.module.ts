import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo"
import { HttpExceptionBody, Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { UserGraphQLModule } from "./user/user-graphql.module"
import { SystemGraphQLModule } from "./system/system-graphql.module"

const GRAPHQL_PATH = "/gql" as const

@Module({
	imports: [
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true,
			path: GRAPHQL_PATH,
			sortSchema: true,
			formatError: (err) => {
				let message = err.message
				let status = "Internal Server Error"
				let statusCode = 500
				const httpError = err.extensions?.originalError as
					| HttpExceptionBody
					| undefined

				if (httpError) {
					message =
						typeof httpError.message === "string"
							? httpError.message
							: httpError.message[0]
					statusCode = httpError.statusCode
					if (httpError?.error) {
						status = httpError?.error
					}
				}

				return {
					message,
					status,
					code: statusCode,
					stacktrace: err.extensions?.stacktrace,
				}
			},
		}),

		SystemGraphQLModule,
		UserGraphQLModule,
	],
})
export class GraphqlModule {}
