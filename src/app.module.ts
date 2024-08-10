import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { dataSource } from "./database/ormconfig"
import { GraphqlModule } from "@modules/graphql/graphql.module"
import { EntityModule } from "@modules/entity"

@Module({
	imports: [
		TypeOrmModule.forRoot({
			...dataSource.options,
			retryAttempts: 10,
			retryDelay: 3000,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
			toRetry: (err: any) => true,
			autoLoadEntities: true,
			keepConnectionAlive: false,
			verboseRetryLog: false,
		}),
		GraphqlModule,
		EntityModule,
	],
})
export class AppModule {}
