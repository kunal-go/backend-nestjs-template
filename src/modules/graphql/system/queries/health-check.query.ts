import { Query, Resolver } from "@nestjs/graphql"
import { SystemHealthInfoV1Response } from "../responses/system-health-info-v1.response"

@Resolver()
export class HealthCheckQuery {
	@Query(() => SystemHealthInfoV1Response)
	async getSystemHealthInfo(): Promise<SystemHealthInfoV1Response> {
		return new SystemHealthInfoV1Response()
	}
}
