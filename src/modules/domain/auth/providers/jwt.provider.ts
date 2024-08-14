import { getConfig } from "@config"
import { ACCESS_TOKEN_VALIDITY_IN_HOURS } from "@modules/entity"
import {
	Injectable,
	NotAcceptableException,
	UnauthorizedException,
} from "@nestjs/common"
import * as dayjs from "dayjs"
import * as jwt from "jsonwebtoken"

export type JwtPayload = {
	accountSessionId: string
}

@Injectable()
export class JwtProvider {
	private readonly issuer = "flope-invoice-backend"
	private readonly accessTokenSubject = "access-token"

	private get secret() {
		return getConfig("JWT_SECRET")
	}

	createAccessToken(payload: JwtPayload): { token: string; validTill: Date } {
		const token = jwt.sign(payload, this.secret, {
			issuer: this.issuer,
			expiresIn: `${ACCESS_TOKEN_VALIDITY_IN_HOURS}h`,
			subject: this.accessTokenSubject,
		})
		const validTill = dayjs()
			.add(ACCESS_TOKEN_VALIDITY_IN_HOURS, "hour")
			.toDate()
		return { token, validTill }
	}

	validateAccessToken(token: string): JwtPayload {
		try {
			const { accountSessionId } = jwt.verify(token, this.secret, {
				issuer: this.issuer,
				subject: this.accessTokenSubject,
			}) as JwtPayload
			return { accountSessionId }
		} catch (err) {
			if (err instanceof jwt.TokenExpiredError) {
				throw new NotAcceptableException("Access token expired")
			}
			if (err instanceof jwt.JsonWebTokenError) {
				throw new UnauthorizedException("Invalid access token")
			}
			throw err
		}
	}
}
