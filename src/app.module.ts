import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { dataSource } from "./database/ormconfig"

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
	],
	controllers: [AppController],
})
export class AppModule {}
