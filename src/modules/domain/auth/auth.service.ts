import { UserSessionEntity } from "@modules/entity"
import {
	ForbiddenException,
	Injectable,
	NotAcceptableException,
	UnauthorizedException,
} from "@nestjs/common"
import * as dayjs from "dayjs"
import { Request } from "express"
import { JwtPayload, JwtProvider } from "./providers/jwt.provider"
import { RefreshTokenProvider } from "./providers/refresh-token.provider"
import { EntityService } from "@modules/entity/entity.service"
import { UserSessionService } from "../user/user-session.service"

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtProvider: JwtProvider,
		private readonly refreshTokenProvider: RefreshTokenProvider,
		private readonly entity: EntityService,
		private readonly accountSessionService: UserSessionService,
	) {}

	async authorizeRequest(req: Request): Promise<UserSessionEntity> {
		const jwtPayload = await this.getJwtPayload(req)
		if (!jwtPayload) {
			throw new ForbiddenException("Authorization header is missing")
		}

		const em = this.entity.getManager()
		const accountSession =
			await this.accountSessionService.getAccountSessionById(
				em,
				jwtPayload.accountSessionId,
			)
		if (!accountSession) {
			throw new UnauthorizedException("Invalid or expired session")
		}
		if (accountSession.isExpired) {
			throw new NotAcceptableException("Invalid or expired session")
		}

		return accountSession
	}

	private async getJwtPayload(req: Request): Promise<JwtPayload | null> {
		const authString = req.headers.authorization
		if (!authString) {
			return null
		}

		const accessToken = this.getAccessToken(authString)
		return this.jwtProvider.validateAccessToken(accessToken)
	}

	private getAccessToken(authString: string): string {
		const [_bearer, token] = authString.split(" ")
		if (!_bearer || !token) {
			throw new ForbiddenException("Access token is missing")
		}
		return token
	}

	createTokens(
		accountSession: UserSessionEntity,
		refreshKey: string,
	): {
		accessToken: string
		refreshToken: string
		refreshTokenAfter: Date
	} {
		const [{ token: accessToken, validTill }, refreshToken] = [
			this.jwtProvider.createAccessToken({
				accountSessionId: accountSession.id,
			}),
			this.refreshTokenProvider.createRefreshToken({
				sessionId: accountSession.id,
				refreshKey,
			}),
		]

		const refreshTokenAfter = dayjs(validTill).subtract(1, "hour").toDate()
		return { accessToken, refreshToken, refreshTokenAfter }
	}
}
