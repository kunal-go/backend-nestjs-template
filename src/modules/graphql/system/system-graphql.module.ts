import { Module } from "@nestjs/common"
import { HealthCheckQuery } from "./queries/health-check.query"

@Module({
	imports: [],
	providers: [HealthCheckQuery],
})
export class SystemGraphQLModule {}
